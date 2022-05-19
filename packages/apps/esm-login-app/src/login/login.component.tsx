import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "../styles.scss";
import ArrowRight24 from "@carbon/icons-react/es/arrow--right/24";
import {
  Button,
  InlineNotification,
  TextInput,
  Tile,
} from "carbon-components-react";
import { useTranslation } from "react-i18next";
import { useConfig, interpolateUrl, useSession } from "@openmrs/esm-framework";
import { performLogin } from "./login.resource";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const hidden: React.CSSProperties = {
  height: 0,
  width: 0,
  border: 0,
  padding: 0,
};

export interface LoginReferrer {
  referrer?: string;
}

export interface LoginProps extends LoginReferrer {
  isLoginEnabled: boolean;
}

const Login: React.FC<LoginProps> = ({ isLoginEnabled }) => {
  const config = useConfig();
  const { user } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [t] = useTranslation();
  const showPassword = location.pathname === "/login/confirm";

  useEffect(() => {
    if (user) {
      navigate("/login/location", { state: location.state });
    } else if (!username && location.pathname === "/login/confirm") {
      navigate("/login", { state: location.state });
    }
  }, [username, navigate, location, user]);

  useEffect(() => {
    const field = showPassword
      ? passwordInputRef.current
      : usernameInputRef.current;

    if (field) {
      field.focus();
    }
  }, [showPassword]);

  useEffect(() => {
    if (!user && config.provider.type === "oauth2") {
      const loginUrl = config.provider.loginUrl;
      window.location.href = loginUrl;
    }
  }, [config, user]);

  const continueLogin = useCallback(() => {
    const field = usernameInputRef.current;

    if (field.value.length > 0) {
      navigate("/login/confirm", { state: location.state });
    } else {
      field.focus();
    }
  }, [navigate]);

  const changeUsername = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value),
    []
  );

  const changePassword = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value),
    []
  );

  const resetUserNameAndPassword = useCallback(() => {
    setUsername("");
    setPassword("");
  }, []);

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (!showPassword) {
        continueLogin();
        return false;
      }

      try {
        const loginRes = await performLogin(username, password);
        const authData = loginRes.data;
        const valid = authData && authData.authenticated;

        if (!valid) {
          throw new Error("invalidCredentials");
        }
      } catch (error) {
        setErrorMessage(error.message);
        resetUserNameAndPassword();
      }

      return false;
    },
    [continueLogin, resetUserNameAndPassword, showPassword, username, password]
  );

  const logo = config.logo.src ? (
    <img
      src={interpolateUrl(config.logo.src)}
      alt={config.logo.alt}
      className={styles["logo-img"]}
    />
  ) : (
    <svg role="img" className={styles["logo"]}>
      <title>OpenMRS logo</title>
      <use xlinkHref="#omrs-logo-full-color"></use>
    </svg>
  );

  if (config.provider.type === "basic") {
    return (
      <div className={`canvas ${styles["container"]}`}>
        {errorMessage && (
          <InlineNotification
            kind="error"
            style={{ width: "23rem" }}
            /**
             * This comment tells i18n to still keep the following translation keys (used as value for: errorMessage):
             * t('invalidCredentials')
             */
            subtitle={t(errorMessage)}
            title={t("error", "Error")}
            onClick={() => setErrorMessage("")}
          />
        )}
        <Tile className={styles["login-card"]}>
          <div className={styles["center"]}>{logo}</div>
          <form onSubmit={handleSubmit} ref={formRef}>
            {!showPassword && (
              <div className={styles["input-group"]}>
                <TextInput
                  id="username"
                  type="text"
                  name="username"
                  labelText={t("username", "Username")}
                  className={styles.inputStyle}
                  value={username}
                  onChange={changeUsername}
                  ref={usernameInputRef}
                  autoFocus
                  required
                />

                <input
                  id="password"
                  style={hidden}
                  type="password"
                  name="password"
                  value={password}
                  onChange={changePassword}
                />

                <Button
                  className={styles.continueButton}
                  renderIcon={ArrowRight24}
                  type="submit"
                  iconDescription="Next"
                  onClick={continueLogin}
                  disabled={!isLoginEnabled}
                >
                  {t("continue", "Continue")}
                </Button>
              </div>
            )}
            {showPassword && (
              <div className={styles["input-group"]}>
                <input
                  id="username"
                  type="text"
                  name="username"
                  style={hidden}
                  value={username}
                  onChange={changeUsername}
                  required
                />

                <TextInput.PasswordInput
                  id="password"
                  invalidText={t(
                    "validValueRequired",
                    "A valid value is required"
                  )}
                  labelText={t("password", "Password")}
                  name="password"
                  className={styles.inputStyle}
                  value={password}
                  onChange={changePassword}
                  ref={passwordInputRef}
                  required
                  showPasswordLabel="Show password"
                />

                <Button
                  aria-label="submit"
                  type="submit"
                  className={styles.continueButton}
                  renderIcon={ArrowRight24}
                  iconDescription="Next"
                  disabled={!isLoginEnabled}
                >
                  {t("login", "Log in")}
                </Button>
              </div>
            )}
          </form>
        </Tile>
        <div className={styles["need-help"]}>
          <p className={styles["need-help-txt"]}>
            {t("needHelp", "Need help?")}
            <Button kind="ghost">
              {t("contactAdmin", "Contact the site administrator")}
            </Button>
          </p>
        </div>
        <div className={styles["footer"]}>
          <p className={styles["powered-by-txt"]}>
            {t("poweredBy", "Powered by")}
          </p>
          <div>
            <svg role="img" className={styles["powered-by-logo"]}>
              <use xlinkHref="#omrs-logo-partial-mono"></use>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Login;

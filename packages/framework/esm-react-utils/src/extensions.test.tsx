import React, {
  useCallback,
  useReducer,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { render, screen, waitFor } from "@testing-library/react";
import {
  attach,
  getExtensionNameFromId,
  registerExtension,
  updateInternalExtensionStore,
} from "@openmrs/esm-extensions";
import {
  getSyncLifecycle,
  Extension,
  ExtensionSlot,
  openmrsComponentDecorator,
  useExtensionSlotMeta,
  ExtensionData,
} from ".";
import userEvent from "@testing-library/user-event";

describe("ExtensionSlot, Extension, and useExtensionSlotMeta", () => {
  beforeEach(() => {
    updateInternalExtensionStore(() => ({ slots: {}, extensions: {} }));
  });

  test("Extension receives state changes passed through (not using <Extension>)", async () => {
    function EnglishExtension({ suffix }) {
      return <div>English{suffix}</div>;
    }
    registerSimpleExtension("English", "esm-languages-app", EnglishExtension);
    attach("Box", "English");
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => {
      const [suffix, toggleSuffix] = useReducer(
        (suffix) => (suffix == "!" ? "?" : "!"),
        "!"
      );
      return (
        <div>
          <ExtensionSlot name="Box" state={{ suffix }} />
          <button onClick={toggleSuffix}>Toggle suffix</button>
        </div>
      );
    });
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/English/)).toBeInTheDocument()
    );
    expect(screen.getByText(/English/)).toHaveTextContent("English!");
    userEvent.click(screen.getByText("Toggle suffix"));
    await waitFor(() =>
      expect(screen.getByText(/English/)).toHaveTextContent("English?")
    );
  });

  test("Extension receives state changes (using <Extension>)", async () => {
    function HaitianCreoleExtension({ suffix }) {
      return <div>Haitian Creole{suffix}</div>;
    }
    registerSimpleExtension(
      "Haitian",
      "esm-languages-app",
      HaitianCreoleExtension
    );
    attach("Box", "Haitian");
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => {
      const [suffix, toggleSuffix] = useReducer(
        (suffix) => (suffix == "!" ? "?" : "!"),
        "!"
      );

      return (
        <div>
          <ExtensionSlot name="Box">
            {suffix}
            <Extension state={{ suffix }} />
          </ExtensionSlot>
          <button onClick={toggleSuffix}>Toggle suffix</button>
        </div>
      );
    });
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/Haitian/)).toBeInTheDocument()
    );
    expect(screen.getByText(/Haitian/)).toHaveTextContent("Haitian Creole!");
    userEvent.click(screen.getByText("Toggle suffix"));
    await waitFor(() =>
      expect(screen.getByText(/Haitian/)).toHaveTextContent("Haitian Creole?")
    );
  });

  test("Extension Slot receives meta", async () => {
    registerSimpleExtension("Spanish", "esm-languages-app", undefined, {
      code: "es",
    });
    attach("Box", "Spanish");
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => {
      const metas = useExtensionSlotMeta("Box");
      const wrapItem = useCallback(
        (slot: React.ReactNode, extension: ExtensionData) => {
          return (
            <div>
              <h1>
                {metas[getExtensionNameFromId(extension.extensionId)].code}
              </h1>
              {slot}
            </div>
          );
        },
        [metas]
      );
      return (
        <div>
          <ExtensionSlot name="Box">
            <Extension wrap={wrapItem} />
          </ExtensionSlot>
        </div>
      );
    });
    render(<App />);

    await waitFor(() =>
      expect(screen.getByRole("heading")).toBeInTheDocument()
    );
    expect(screen.getByRole("heading")).toHaveTextContent("es");
    expect(screen.getByText("Spanish")).toBeInTheDocument();
  });

  test("Both meta and state can be used at the same time", async () => {
    function SwahiliExtension({ suffix }) {
      return <div>Swahili{suffix}</div>;
    }
    registerSimpleExtension("Swahili", "esm-languages-app", SwahiliExtension, {
      code: "sw",
    });
    attach("Box", "Swahili");
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => {
      const [suffix, toggleSuffix] = useReducer(
        (suffix) => (suffix == "!" ? "?" : "!"),
        "!"
      );
      const metas = useExtensionSlotMeta("Box");
      const wrapItem = useCallback(
        (slot: React.ReactNode, extension: ExtensionData) => {
          return (
            <div>
              <h1>
                {metas[getExtensionNameFromId(extension.extensionId)].code}
              </h1>
              {slot}
            </div>
          );
        },
        [metas]
      );
      return (
        <div>
          <ExtensionSlot name="Box">
            <Extension wrap={wrapItem} state={{ suffix }} />
          </ExtensionSlot>
          <button onClick={toggleSuffix}>Toggle suffix</button>
        </div>
      );
    });
    render(<App />);

    await waitFor(() =>
      expect(screen.getByRole("heading")).toBeInTheDocument()
    );
    expect(screen.getByRole("heading")).toHaveTextContent("sw");
    expect(screen.getByText(/Swahili/)).toHaveTextContent("Swahili!");
    userEvent.click(screen.getByText("Toggle suffix"));
    await waitFor(() =>
      expect(screen.getByText(/Swahili/)).toHaveTextContent("Swahili?")
    );
  });
});

function registerSimpleExtension(
  name: string,
  moduleName: string,
  Component?: React.ComponentType<any>,
  meta: object = {}
) {
  const SimpleComponent = () => <div>{name}</div>;
  registerExtension({
    name,
    moduleName,
    load: getSyncLifecycle(Component ?? SimpleComponent, {
      moduleName,
      featureName: moduleName,
      disableTranslations: true,
    }),
    meta,
  });
}

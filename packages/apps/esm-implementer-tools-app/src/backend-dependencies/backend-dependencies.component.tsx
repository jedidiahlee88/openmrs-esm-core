import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
} from "carbon-components-react";
import { FrontendModule } from "./openmrs-backend-dependencies";

export interface ModuleDiagnosticsProps {
  frontendModules: Array<FrontendModule>;
}

export const ModuleDiagnostics: React.FC<ModuleDiagnosticsProps> = ({
  frontendModules,
}) => {
  const { t } = useTranslation();

  const headers = useMemo(
    () => [
      {
        key: "name",
        header: t("moduleName", "Module Name"),
      },
      {
        key: "installedVersion",
        header: t("installedVersion", "Installed Version"),
      },
      {
        key: "requiredVersion",
        header: t("requiredVersion", "Required Version"),
      },
    ],
    [t]
  );

  return (
    <div style={{ height: "50vh", overflowY: "auto" }}>
      <DataTable rows={[]} headers={headers}>
        {({ headers, getTableProps, getHeaderProps }) => (
          <TableContainer title="">
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {frontendModules.map((esm) => (
                  <Fragment key={esm.name}>
                    <TableRow>
                      <TableCell>
                        <strong>{esm.name}</strong>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {esm.dependencies.map((dep) => (
                      <TableRow key={dep.name}>
                        <TableCell>{dep.name}</TableCell>
                        <TableCell>
                          {dep.type === "missing" ? (
                            <span style={{ color: "red" }}>
                              {t("missing", "Missing")}
                            </span>
                          ) : dep.type === "version-mismatch" ? (
                            <span style={{ color: "red" }}>
                              {dep.installedVersion}
                            </span>
                          ) : (
                            <span style={{ color: "green" }}>
                              {dep.installedVersion}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{dep.requiredVersion}</TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
};

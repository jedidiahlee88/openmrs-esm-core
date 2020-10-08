import { ImportmapDeclaration, loadConfig, logInfo } from "../utils";

/* eslint-disable no-console */

export interface BuildArgs {
  target: string;
  importmap: ImportmapDeclaration;
}

export function runBuild(args: BuildArgs) {
  const webpack = require("webpack");
  const config = loadConfig({
    importmap: args.importmap,
    env: "production",
  });

  logInfo(`Running build process ...`);

  const compiler = webpack({
    ...config,
    output: {
      ...config.output,
      path: args.target,
    },
  });

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        stats.toString({
          colors: true,
        })
      );

      logInfo(`Build finished.`);
    }
  });
}

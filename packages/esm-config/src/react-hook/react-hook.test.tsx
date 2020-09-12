import React from "react";
import { clearAll, defineConfigSchema } from "../module-config/module-config";
import { render, cleanup, waitFor } from "@testing-library/react";
import { ModuleNameContext, useConfig, clearConfig } from "./react-hook";

describe(`useConfig`, () => {
  afterEach(clearAll);
  afterEach(cleanup);
  afterEach(clearConfig);

  it(`can return config as a react hook`, async () => {
    defineConfigSchema("foo-module", {
      thing: {
        default: "The first thing"
      }
    });

    const { getByText } = render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="foo-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => {
      expect(getByText("The first thing")).toBeTruthy();
    });
  });

  it(`can handle multiple calls to useConfig from different modules`, async () => {
    defineConfigSchema("foo-module", {
      thing: {
        default: "foo thing"
      }
    });

    defineConfigSchema("bar-module", {
      thing: {
        default: "bar thing"
      }
    });

    let wrapper = render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="foo-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => {
      expect(wrapper.getByText("foo thing")).toBeTruthy();
    });

    cleanup();

    wrapper = render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="bar-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => {
      expect(wrapper.getByText("bar thing")).toBeTruthy();
    });
  });
});

function RenderConfig(props) {
  const config = useConfig();

  return <button>{config[props.configKey]}</button>;
}

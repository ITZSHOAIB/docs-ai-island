# Plain HTML integration fixture

This fixture is the smallest framework-free consumer of the public package. It imports the JavaScript and CSS exports, mounts the default Island, performs a `history.pushState()` navigation, updates page metadata, and calls `controller.refresh()` without replacing the root.

From the repository root:

```sh
pnpm test:fixture:html
pnpm test:fixture:html:pack
```

The packed test copies this fixture, replaces its workspace dependency with the generated tarball, installs it without workspace resolution, typechecks it, and completes a Vite production build.

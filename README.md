# @fioc/react

@fioc/react is a lightweight dependency injection library for React applications, built on [@fioc/core](https://www.npmjs.com/package/@fioc/core). It provides a type-safe way to manage dependencies in React components using hooks and context providers, without requiring reflection, decorators, or classes.

## Features

- 🚀 **React Integration**: Tailored for React with hooks and context providers
- 🪶 **Lightweight**: Minimal overhead, integrates seamlessly into React projects
- 🔗 **Ecosystem Compatible**: Works with [@fioc/core](https://www.npmjs.com/package/@fioc/core), [@fioc/strict](https://www.npmjs.com/package/@fioc/strict), and [@fioc/next](https://www.npmjs.com/package/@fioc/next)

[Jump to Basic Usage →](#basic-usage)

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
  - [Configuring Dependencies Provider](#configuring-dependencies-provider)
  - [Resolving Dependencies](#resolving-dependencies)
- [Related Packages](#related-packages)

## Installation

Install using npm, pnpm, or yarn (requires `@fioc/core`):

```bash
npm install @fioc/core @fioc/react
```

```bash
pnpm install @fioc/core @fioc/react
```

```bash
yarn add @fioc/core @fioc/react
```

## Basic Usage

### Configuring Dependencies Provider

Set up a container manager with `@fioc/core` or `@fioc/strict` (see [@fioc/core](https://www.npmjs.com/package/@fioc/core) for details). Wrap your app with `DependenciesProvider`:

```tsx
// app.tsx
import { DependenciesProvider } from "@fioc/react";
import { buildDIContainer, buildDIManager } from "@fioc/core";
import { ApiServiceToken } from "./interfaces/ApiService";

const container = buildDIContainer()
  .register(ApiServiceToken, { getData: () => "Hello, World!" })
  .getResult();

const DIManager = buildDIManager()
  .registerContainer(container, "default")
  .getResult()
  .setDefaultContainer("default");

export default function App() {
  return (
    <DependenciesProvider manager={DIManager}>
      <MyComponent />
    </DependenciesProvider>
  );
}
```

### Resolving Dependencies

Use the `useDependencies` hook to resolve dependencies in components:

```tsx
// components/MyComponent.tsx
import { useDependencies } from "@fioc/react";
import { ApiServiceToken } from "../interfaces/ApiService";

export function MyComponent() {
  const { resolve } = useDependencies();
  const apiService = resolve(ApiServiceToken);

  return <div>API Data: {apiService.getData()}</div>;
}
```

## Best Practices

- Define tokens in shared interfaces for type safety
- Use `@fioc/strict` for compile-time validation in complex apps
- Keep containers modular for easier testing and maintenance
- Use with `@fioc/next` for Next.js Server Components and Actions

## Related Packages

- [@fioc/core](https://www.npmjs.com/package/@fioc/core): Core dependency injection library
- [@fioc/strict](https://www.npmjs.com/package/@fioc/strict): Strict type-safe dependency injection
- [@fioc/next](https://www.npmjs.com/package/@fioc/next): Next.js integration for Server Components and Actions

[Back to Top ↑](#fiocreact)

## Contributing

Contributions welcome! Open issues or submit pull requests on [GitHub](https://github.com/kolostring/fioc-react).

## License

MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

Thanks to the open-source community for inspiring this project.

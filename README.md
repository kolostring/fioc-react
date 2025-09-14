# FIOC-React

FIOC-React (Functional Inversion Of Control - React) is a lightweight dependency injection library for React applications. It simplifies the management of dependencies in your React components by providing a flexible and type-safe way to define, register, and resolve dependencies, without the need of reflection, decorators or classes.

Based on [FIOC](https://www.npmjs.com/package/fioc).

## Features

- **Type-Safe Dependency Injection**: Define and resolve dependencies with full TypeScript support.
- **Non String Tokens**: Define and resolve dependencies with non-string tokens.
- **React Integration**: Built specifically for React, with hooks and context providers.
- **Lightweight**: Minimal overhead, designed to integrate seamlessly into your existing React projects.
- **As Complex as You Want**: Going from just registering implementations of interfaces to registering consumers/use cases with recursive dependencies resolution.

## Installation

Install the library using npm, pnpm or yarn:

```bash
npm install fioc-react
```

```bash
pnpm install fioc-react
```

```bash
yarn add fioc-react
```

### 1. Configuring Dependencies Provider

For details of how to configure the Container Manager see [FIOC](https://www.npmjs.com/package/fioc).
Use the `DependenciesProvider` to provide the container manager to your application:

```tsx
import { DependenciesProvider } from "fioc-react";
import { DIManager } from "./containers";

const App = () => {
  return (
    <DependenciesProvider manager={DIManager}>
      <p>API URL: {config.apiUrl}</p>
    </DependenciesProvider>
  );
};
```

### 2. Resolve Dependencies

Use the `useDependencies` hook to resolve dependencies in your components:

```tsx
import { useDependencies } from "fioc-react";
import { ApiServiceToken } from "./interfaces/ApiService";

const MyComponent = () => {
  const apiService = useDependencies().resolve(ApiServiceToken);

  return (
    <div>
      <p>API URL: {apiService.getData()}</p>
    </div>
  );
};
```

## License

This library is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on [GitHub](https://github.com/kolostring/fioc-react).

## Acknowledgments

Special thanks to the open-source community for inspiring this project.

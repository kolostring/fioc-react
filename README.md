# FIOC-React

FIOC-React (Functional Inversion Of Control - React) is a lightweight dependency injection library for React applications. It simplifies the management of dependencies in your React components by providing a flexible and type-safe way to define, register, and resolve dependencies, without the need of reflection, decorators or classes.

Based on [FIOC](https://www.npmjs.com/package/fioc)

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

## Getting Started

For the sake of simplicity, we'll start by just registering implementations of interfaces into the container.

### 1. Create DIToken

Use the `createDIToken` function to define tokens for your types/interfaces. These will be used by the container to locate the related implementation:

```ts
import { createDIToken } from "fioc-react";

interface ApiService {
  getData: () => string;
}

const ApiServiceToken = createDIToken<ApiService>("ApiService");
```

### 2. Register Implementations

Use the `buildContainer` function to build a Dependency Injection Container and register your implementations. You can chain the `register` method to register multiple implementations. When you're done , call the `makeStatic` method to create a read-only container:

```tsx
import { ApiService, ApiServiceToken } from "./interfaces/ApiService";
import { buildContainer } from "fioc-react";

const HttpApiService: ApiService = {
  getData: () => "Hello, World!",
};

const onlineContainer = buildContainer()
  .register(ApiServiceToken, HttpApiService)
  .makeStatic();
```

### 3. Configuring the Container Manager

Use the buildManager function to create a Container Manager. It allows you to register multiple containers and switch between them. Really useful when having multiple environments (like fetching from an API when "online" or fetching from local storage when "offline"). Also realy useful for mocking interfaces.

You can set the default container by calling the `setDefaultContainer` method. If no key is provided for a container, it will be set as the default container.

```tsx
import { buildManager } from "fioc-react";
import { onlineContainer, offlineContainer } from "./containers";

export const DIManager = buildManager()
  .registerContainer(onlineContainer, "online")
  .registerContainer(offlineContainer, "offline")
  .setDefaultContainer("online");
```

### 4. Configuring Dependencies Provider

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

### 5. Resolve Dependencies

Use the `useDependencies` hook to resolve dependencies in your components:

```tsx
import { useDependencies } from "fioc-react";
import { ApiServiceToken } from "./interfaces/ApiService";

const MyComponent = () => {
  const apiService = useDependencies(ApiServiceToken);

  return (
    <div>
      <p>API URL: {apiService.getData()}</p>
    </div>
  );
};
```

## Consumers/Use Cases

Let's call **Consumers** to all functions that have dependencies to interfaces or other consumers. The most common use is for **Use Cases** in business logic. For example, a use case might be to get some data from a repository.

To build a consumer, use the `defineDIConsumer` function. It takes an object with the following properties:

- dependencies: An array of tokens representing the dependencies of the consumer.
- factory: A function that takes the dependencies as arguments and returns a function with the dependencies resolved.
- description: An optional description for the consumer for logging purposes.

```ts
import { defineDIConsumer } from "fioc-react";
import { ApiServiceToken } from "./interfaces/ApiService";

export const getDataUseCase = defineDIConsumer({
  dependencies: [ApiServiceToken],
  factory: (apiService) => () => apiService.getData(),
  description: "getDataConsumer",
});
```

It can then later be registered into a container. It doesn't require a token:

```ts
import { ApiService, ApiServiceToken } from "./interfaces/ApiService";
import getDataUseCase from "./useCases/getDataUseCase";

const ApiServiceImpl: ApiService = {
  getData: () => "Hello, World!",
};

const DIManager = buildManager().registerContainer(
  buildContainer()
    .register(ApiServiceToken, ApiServiceImpl)
    .registerConsumer(getDataUseCase)
    .makeStatic()
);
```

To resolve a consumer, just use regular `resolve` method. Tho keep in mind any time you resolve a consumer, the dependencies will be resolved recursively **every time**. You can implement yourself a cache to avoid this.

## License

This library is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on [GitHub](https://github.com/kolostring/fioc-react).

## Acknowledgments

Special thanks to the open-source community for inspiring this project.

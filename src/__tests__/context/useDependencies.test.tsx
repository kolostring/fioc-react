import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDependencies } from "../../context/useDependencies";
import { DependenciesProvider } from "../../context/DependenciesProvider";
import {
  DIManager,
  buildDIContainer,
  buildDIContainerManager,
  createDIToken,
} from "fioc";

// Example tokens and services for testing
const TestServiceToken = createDIToken<{ value: string }>().as("TestService");
const TestService = { value: "test" };

describe("useDependencies", () => {
  let manager: DIManager;

  beforeEach(() => {
    // Create a container with the test service
    const container = buildDIContainer()
      .register(TestServiceToken, TestService)
      .getResult();

    // Create a manager and set up the container as both default and named
    manager = buildDIContainerManager()
      .registerContainer(container, "default")
      .registerContainer(container, "test")
      .getResult();
  });

  it("should throw error when used outside DependenciesProvider", () => {
    expect(() => {
      renderHook(() => {
        const result = useDependencies();
        // Access result to trigger the hook

        return result;
      });
    }).toThrow("Dependencies Provider not found");
  });

  it("should throw error when container key not found", () => {
    expect(() => {
      renderHook(() => useDependencies("nonexistent"), {
        wrapper: ({ children }) => (
          <DependenciesProvider manager={manager}>
            {children}
          </DependenciesProvider>
        ),
      });
    }).toThrow("Container nonexistent not found");
  });

  it("should return default container when no key is provided", () => {
    const { result } = renderHook(() => useDependencies(), {
      wrapper: ({ children }) => (
        <DependenciesProvider manager={manager}>
          {children}
        </DependenciesProvider>
      ),
    });
    const container = result.current;
    expect(container.resolve(TestServiceToken)).toEqual(TestService);
  });

  it("should return specific container when key is provided", () => {
    const { result } = renderHook(() => useDependencies("test"), {
      wrapper: ({ children }) => (
        <DependenciesProvider manager={manager}>
          {children}
        </DependenciesProvider>
      ),
    });
    const container = result.current;
    expect(container.resolve(TestServiceToken)).toEqual(TestService);
  });
});

declare module 'react' {
  export const StrictMode: any;
  export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useContext(context: any): any;
  export function createContext(initialValue: any): any;
  export function useReducer(reducer: any, initialState: any, initializer?: any): [any, (action: any) => void];
  export function useRef<T>(value: T): { current: T };
  const React: any;
  export default React;
}

declare module 'react/jsx-runtime' {
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): {
    render(node: any): void;
  };
}

declare module 'react-router-dom' {
  export const HashRouter: any;
  export const NavLink: any;
  export const Route: any;
  export const Routes: any;
  export const Outlet: any;
  export const Navigate: any;
  export function useNavigate(): (to: string) => void;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

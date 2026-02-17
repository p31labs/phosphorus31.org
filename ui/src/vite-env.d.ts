/// <reference types="vite/client" />

declare module '@axe-core/react' {
  const axe: (React: unknown, ReactDOM: unknown, delay: number) => void;
  export default axe;
}

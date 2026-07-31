/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_ZHIPU_API_KEY?: string
  readonly VITE_ZHIPU_MODEL?: string
  readonly VITE_ZHIPU_ENDPOINT?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

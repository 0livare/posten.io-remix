/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

declare module '*.mdx' {
  export const frontmatter: Record<string, unknown>
  export const title: string
}

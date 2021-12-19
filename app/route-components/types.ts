export type PostFrontMatter = {
  title: string
  description: string
  imageFilename?: string
  date: string
  slug: string
}

export type Post = PostFrontMatter & {
  title: string
  description: string
  imageFilename?: string
  date: string
  slug: string
  code: string
}

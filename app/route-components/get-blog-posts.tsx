import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import path from 'path'
import fs from 'fs/promises'
import parseFrontMatter from 'front-matter'
import * as yup from 'yup'
import {glob} from 'glob'
import MarkdownIt from 'markdown-it'
import {CodeBlock, dracula} from 'react-code-blocks'
import {bundleMDX} from 'mdx-bundler'

import {Post} from './types'

let postAttrSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  imageFilename: yup.string(),
  date: yup.date().required(),
  slug: yup.string().required(),
})

let md = new MarkdownIt({
  html: true,
  linkify: true,
  langPrefix: 'language-',
  typographer: true,
  highlight: highlightCode,
})

function highlightCode(sourceCode: string, language: string) {
  let r = ReactDOMServer.renderToString(
    <CodeBlock
      text={sourceCode}
      language={language}
      showLineNumbers
      style={{background: 'red'}}
      theme={dracula}
    />,
  )

  console.log({
    sourceCode,
    language,
    toReturn: r,
  })
  return r
}

export async function getPost(slug: string) {
  let data = await allPostData
  return data.find((datum) => datum.slug === slug) ?? ({} as Post)
}

export const allPostData = getAllPostData()
async function getAllPostData(): Promise<Post[]> {
  // When this runs, it's in /build
  let globPath = path.resolve(__dirname, '..', 'app', 'posts', 'code', '*.mdx')

  let postFilePaths = await globPromise(globPath)

  return await Promise.all(
    postFilePaths.map(async (filePath) => {
      let file = await fs.readFile(filePath)

      let result = await bundleMDX({
        source: file.toString(),
      })

      let {code, frontmatter} = result
      let attrs = await postAttrSchema.validate(frontmatter)

      return {...attrs, date: formatDate(attrs.date), code}
    }),
  )
}

function globPromise(path: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(path, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0]
}

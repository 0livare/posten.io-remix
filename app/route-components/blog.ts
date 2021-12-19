import path from 'path'
import fs from 'fs/promises'
import parseFrontMatter from 'front-matter'
import * as yup from 'yup'
import {glob} from 'glob'
import MarkdownIt from 'markdown-it'

let postAttrSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  imageFilename: yup.string(),
  date: yup.date().required(),
  slug: yup.string().required(),
})

export type Post = {
  title: string
  description: string
  imageFilename?: string
  date: string
  slug: string
  body: string
}

let md = new MarkdownIt({
  html: true,
  linkify: true,
  langPrefix: 'language-',
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, {language: lang, ignoreIllegals: true}).value +
          '</code></pre>'
        )
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  },
})

export async function getPost(slug: string) {
  let allPostData = await getAllPostData()
  let postData = allPostData.find((datum) => datum.slug === slug) ?? ({} as Post)
  return {
    ...postData,
    body: md.render(postData.body),
  }
}

export async function getAllPostData(): Promise<Post[]> {
  let postFilePaths = await globPromise(
    path.join(__dirname, '..', 'content', 'posts', '**', '*.md'),
  )

  return await Promise.all(
    postFilePaths.map(async (filePath) => {
      let file = await fs.readFile(filePath)
      let {attributes, body} = parseFrontMatter(file.toString())
      let attrs = await postAttrSchema.validate(attributes)
      return {...attrs, date: formatDate(attrs.date), body}
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

import path from 'path'
import fs from 'fs/promises'
import parseFrontMatter from 'front-matter'
import * as yup from 'yup'
import {glob} from 'glob'

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

export async function getPostData(slug: string) {
  let allPostData = await getAllPostData()
  return allPostData.find((datum) => datum.slug === slug)
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
      return {...attrs, date: attrs.date.toISOString(), body}
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

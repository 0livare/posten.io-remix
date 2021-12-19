import {useLoaderData, LoaderFunction} from 'remix'
import {getPostData, Post} from '~/route-components/blog'

export const loader: LoaderFunction = async ({params}) => {
  return await getPostData(params.slug!)
}

export default function PostSlug() {
  const post: Post = useLoaderData()
  return (
    <div>
      <h1>{post.title}</h1>
      <h2>{post.date}</h2>
      <div>{post.body}</div>
    </div>
  )
}

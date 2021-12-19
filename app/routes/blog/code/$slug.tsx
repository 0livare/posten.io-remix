import {useLoaderData, LoaderFunction} from 'remix'
import {BlogPost, getPost, Post} from '~/route-components'

export const loader: LoaderFunction = async ({params}) => {
  return await getPost(params.slug!)
}

export default function PostSlug() {
  const post: Post = useLoaderData()
  return <BlogPost post={post} />
}

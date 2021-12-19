import {useLoaderData, LoaderFunction} from 'remix'
import {getPost, Post} from '~/route-components/blog'

export const loader: LoaderFunction = async ({params}) => {
  return await getPost(params.slug!)
}

export default function PostSlug() {
  const post: Post = useLoaderData()
  return (
    <div className="prose dark:prose-invert lg:prose-xl mx-auto pb-8 pt-12  ">
      <h1 className="mb-0 ">{post.title}</h1>
      <p className="">{post.date}</p>
      <div dangerouslySetInnerHTML={{__html: post.body}} />
    </div>
  )
}

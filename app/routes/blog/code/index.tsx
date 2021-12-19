import {useLoaderData, LoaderFunction, Link} from 'remix'
import {getAllPostData, Post} from '~/post'

export const loader: LoaderFunction = async ({params}) => {
  return await getAllPostData()
}

export default function Code() {
  let posts = useLoaderData<Post[]>()
  return (
    <>
      <h1>Code Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/blog/code/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

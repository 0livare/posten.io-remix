import {useLoaderData, LoaderFunction, Link} from 'remix'
import {allPostData, Post} from '~/route-components'

export const loader: LoaderFunction = async ({params}) => {
  return await allPostData
}

export default function Code() {
  let posts = useLoaderData<Post[]>()
  console.log(`posts`, posts)
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

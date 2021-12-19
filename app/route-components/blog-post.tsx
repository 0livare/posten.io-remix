import {useMemo} from 'react'
import {getMDXComponent} from 'mdx-bundler/client'

import {Post} from '~/route-components'

export function BlogPost(props: {post: Post}) {
  const {post} = props
  const Component = useMemo(() => getMDXComponent(post.code), [post.code])

  return (
    <div className="prose dark:prose-invert lg:prose-xl mx-auto pb-8 pt-12">
      <h1 className="mb-0">{post.title}</h1>
      <p className="">{post.date}</p>
      <div>
        <Component />
      </div>
    </div>
  )
}

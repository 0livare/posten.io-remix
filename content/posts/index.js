import {sortAndParsePostsByDate} from './sortAndParsePostsByDate'

import iosPosts from './ios'
import gitPosts from './git'
import securityPosts from './security'
import azurePosts from './azure'
import * as csharpIocContainer from './csharp-ioc-container.md'

const allPosts = [
  ...iosPosts,
  ...gitPosts,
  ...securityPosts,
  ...azurePosts,
  csharpIocContainer,
]

export default sortAndParsePostsByDate(allPosts)

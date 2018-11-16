// @flow

import type { GraphQLResolveInfo } from 'graphql';

// For query: query { articles { author { name } } }
// In articles.author resolver will get the following `info.path` value:
// { prev: { prev: { prev: undefined, key: 'articles' }, key: 0 }, key: 'author' }
// Passing it via getPathFromInfo(info.path) we get ['articles', 0 'author'] value

export default function getPathFromInfo(info: GraphQLResolveInfo): Array<string | number> | false {
  if (!info || !info.path) return false;
  const res = [];
  let curPath = info.path;
  while (curPath) {
    if (curPath.key) {
      res.unshift(curPath.key);
      if (curPath.prev) curPath = curPath.prev;
      else break;
    } else break;
  }
  return res;
}

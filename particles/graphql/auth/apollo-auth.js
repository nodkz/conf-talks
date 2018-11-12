// @flow

// Run: ./node_modules/.bin/babel-node ./particles/graphql/auth/apollo-auth.js

import { ApolloServer, AuthenticationError } from 'apollo-server'; // v2.1
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = 'qwerty ;)';

const users = [{ id: 1, role: 'ADMIN' }, { id: 2, role: 'USER' }];

// Получаем объект пользователя из запроса
async function getUserFromReq(req: any) {
  const token = req?.cookies?.token || req?.headers?.authorization;
  if (token) {
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    if (payload) {
      const user = users.find(u => u.id === payload?.sub);
      if (user) return user;
    }
  }
  return null;
}

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: (source, args, context) => {
          return `Hello, ${context.role} from ip ${context.req.ip}`;
        },
      },
    },
  }),
});

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    let user;
    try {
      user = await getUserFromReq(req);
    } catch (e) {
      throw new AuthenticationError('You provide incorrect token!');
    }
    const role = user?.role || 'GUEST';
    return { req, user, role };
  },
  playground: {
    tabs: [
      {
        endpoint: 'http://localhost:5000/',
        query: `
# FOR DEMO PURPOSES
# You may try 
# 1) Delete HTTP HEADERS at all (open them from bottom panel)
# 2) Change token (add some symbols to it) for getting an error
# 3) Or try admin token:
# { "Authorization": "${jwt.sign({ sub: 1 }, JWT_SECRET_KEY)}" }

query {
  hello
}
          `,
        headers: {
          Authorization: jwt.sign({ sub: 2 }, JWT_SECRET_KEY),
        },
      },
    ],
  },
});

server.listen({ port: 5000, endpoint: '/' }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

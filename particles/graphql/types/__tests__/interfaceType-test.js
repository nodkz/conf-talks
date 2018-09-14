/* @flow strict */

import {
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLList,
  graphql,
} from 'graphql';

describe('check how works GraphQLInterfaceType', () => {
  it('demo query', async () => {
    class Event {
      ip: string;
      createdAt: number;
      constructor({ ip, createdAt }: any) {
        this.ip = ip;
        this.createdAt = createdAt;
      }
    }

    // Define models
    class ClickEvent extends Event {
      url: string;
      constructor(data) {
        super(data);
        this.url = data.url;
      }
    }

    class SignedUpEvent extends Event {
      login: string;
      constructor(data) {
        super(data);
        this.login = data.login;
      }
    }

    // Define interface
    const EventInterface = new GraphQLInterfaceType({
      name: 'EventInterface',
      fields: () => ({
        ip: {
          type: GraphQLString,
          resolve: () => '*.*.*.*', // resolve method in Interface does not change your data in response
        },
        createdAt: { type: GraphQLInt },
      }),
      resolveType: value => {
        if (value instanceof ClickEvent) {
          return 'ClickEvent';
        } else if (value instanceof SignedUpEvent) {
          return 'SignedUpEvent';
        }
        return null;
      },
    });

    // Define GraphQL types for models
    const ClickEventType = new GraphQLObjectType({
      name: 'ClickEvent',
      interfaces: [EventInterface],
      fields: () => ({
        ip: { type: GraphQLString },
        createdAt: { type: GraphQLInt },
        url: { type: GraphQLString },
      }),
    });

    const SignedUpEventType = new GraphQLObjectType({
      name: 'SignedUpEvent',
      interfaces: [EventInterface],
      fields: () => ({
        ip: { type: GraphQLString },
        createdAt: { type: GraphQLInt },
        login: { type: GraphQLString },
      }),
    });

    // Define some working schema with mock data
    const schema = new GraphQLSchema({
      types: [ClickEventType, SignedUpEventType], // <-- хитрый способ передать инстансы типов, о которых схема ничего не знает
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          search: {
            type: new GraphQLList(EventInterface),
            resolve: () => [
              new ClickEvent({ ip: '1.1.1.1', createdAt: 1536854101, url: '/list' }),
              new ClickEvent({ ip: '1.1.1.1', createdAt: 1536854102, url: '/register' }),
              new SignedUpEvent({ ip: '1.1.1.1', createdAt: 1536854103, login: 'NICKNAME' }),
              { some: 'strange object' },
            ],
          },
        },
      }),
    });

    const res = await graphql({
      schema,
      source: `
        query {
          search {
            __typename  # <----- магическое поле, которое вернет имя типа для каждой записи
            ip
            createdAt
            ...on ClickEvent {
              url
            }
            ...on SignedUpEvent {
              login
            }
          }
        }
      `,
    });
    expect(res.data).toEqual({
      search: [
        { __typename: 'ClickEvent', createdAt: 1536854101, ip: '1.1.1.1', url: '/list' },
        { __typename: 'ClickEvent', createdAt: 1536854102, ip: '1.1.1.1', url: '/register' },
        { __typename: 'SignedUpEvent', createdAt: 1536854103, ip: '1.1.1.1', login: 'NICKNAME' },
        null, // <------- object with wrong type will be returned as null
      ],
    });
  });
});

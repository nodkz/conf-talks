/* @flow strict */

import { GraphQLSchema, GraphQLObjectType, GraphQLEnumType, GraphQLList, graphql } from 'graphql';

describe('check how works GraphQLEnumType', () => {
  it('demo query', async () => {
    const GenderEnum = new GraphQLEnumType({
      name: 'GenderEnum',
      values: {
        MALE: { value: 1 },
        FEMALE: { value: 2 },
      },
    });

    const ID_ASC = { id: 1 }; // значение энума в виде объекта желательно объявлять через переменную, если она будет использоваться для вывода
    const SortByEnum = new GraphQLEnumType({
      name: 'SortByEnum',
      values: {
        ID_ASC: { value: ID_ASC }, // regular ascending index for MongoDB
        ID_DESC: { value: { id: -1 } },
        DAY_SCORE: { value: { day: -1, score: -1 } }, // compound index for MongoDB
      },
    });

    // Define some working schema with mock data
    let lastResolveArgs;
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          search: {
            args: {
              sort: { type: SortByEnum, defaultValue: ID_ASC }, // мы не можем передать дефолтное значение как `{ id: 1 }`, надо передать инстанс объекта уже существующего значения
            },
            type: new GraphQLObjectType({
              name: 'SearchData',
              fields: {
                wasSortedBy: { type: SortByEnum },
                brokenEnum: { type: SortByEnum },
                items: { type: new GraphQLList(GenderEnum) },
              },
            }),
            resolve: (_, args) => {
              lastResolveArgs = args;
              return {
                wasSortedBy: args.sort,
                brokenEnum: { id: 1 }, // будет работать если передать ID_ASC
                items: [1, 1, 2, 1],
              };
            },
          },
        },
      }),
    });

    const res = await graphql({
      schema,
      source: `
        query {
          search {
            brokenEnum
            wasSortedBy
            items
          }
        }
      `,
    });
    expect(lastResolveArgs).toEqual({ sort: { id: 1 } }); // мы получили значение, а не ключ `ID_ASC`
    expect(res.data).toEqual({
      search: {
        brokenEnum: null, // под капотом используется строгое сравнение ===, а как мы знаем в JS `{ id: 1 } !== { id: 1 }` поэтому null
        wasSortedBy: 'ID_ASC', // получили ключ значения, т.к. использовали переменную ID_ASC для defaultValue
        items: ['MALE', 'MALE', 'FEMALE', 'MALE'],
      },
    });
  });
});

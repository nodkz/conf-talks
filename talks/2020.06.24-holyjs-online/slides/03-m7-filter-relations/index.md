## M7: Создание Резолверов

-----

### FieldConfig > Резолвер > Relations

`schema/relations`

-----

### FieldConfig состоит из <!-- .element: class="orange" -->

### type, <br/>args, <br/>resolve, <br/><span class="gray">description, <br/>deprecationReason,<br/> extensions</span>

-----

### Резолвер – это генератор, который создает FieldConfig

```js
export function getRelationContactIds(
  sourceFieldName: string
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: () => ContactTC.NonNull.List,
    resolve: resolveManyViaDL('ContactID', (s) => s[sourceFieldName]),
    projection: { [sourceFieldName]: 1 },
  };
}

```

-----

### В нашем случаем, мы создаем Резолверы для создания Relations между Entity.

-----

### Relations-резолверы позволяют избавиться от копипасты.

-----

### Позволяют расширять логику реляций (например добавлять аргументы для фильтрации и сортировки)

```js
export function getRelationTasksBySpaceId(
  sourceFieldName: string
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: () => TaskTC.NonNull.List,
    args: {
      filter: TaskFilterByRelation,
      sort: TaskFindManySortEnum,
      limit: 'Int',
      pageSize: 'Int',
    },
    resolve: (source, args, context, info) => {
      return taskFindMany(
        {
          info,
          filter: {
            ...args.filter,
            spaceId: source[sourceFieldName],
          },
          limit: args.limit,
          pageSize: args.pageSize,
          ...args.sort,
        },
        context
      );
    },
    projection: { [sourceFieldName]: 1 },
  };
}

```

-----

## В демке `wrike-graphql` <!-- .element: class="orange" -->

- рефакторим M6, превращая 12 DataLoaders в Relations <!-- .element: class="fragment" -->
- добавляем 26 новых "обратных" Relations <!-- .element: class="fragment" -->

-----

## "Обратные" Relation – это те которые используют доступные фильтры из REST API.

К примеру к entity `Contact` можно добавить поля `tasksAuthored`, `tasksResponsible`. И для этого необходимо будет воспользоваться фильтром `GET /tasks?authors=[]&responsibles=[]`

-----

### Грубая оценка

- 14 файлов
- 1142 LoC
- Рефакторинг M6 на M7
- Поиск и добавление новых обратных связей с фильтрацией
- ~ `⏱ 20 часов`

-----

### 110 relations VS 135 relations (38 nodes)

![direct_and_back_relations](./direct_and_back_relations.png) <!-- .element: style="max-width: 1100px;" class="plain" -->

-----

### 110 relations VS 135 relations (38 nodes)

![direct_and_back_relations](./direct_and_back_relations.png) <!-- .element: style="max-width: 1100px; filter: saturate(500);" class="plain" -->

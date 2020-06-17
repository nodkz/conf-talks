## M3: Описание Entity

-----

### Что такое Entity?

### `schema/entities`

-----

### Это бизнес сущность с ID

### К примеру, таблица в БД

-----

### В Api Wrike 22 entity <!-- .element: class="orange" -->

### А всего 134 GraphQL-типа <!-- .element: class="orange" -->

<br/>

20% entity типов M3 и 80% "обслуживающих" типов M2<!-- .element: class="fragment" -->
<br/>
[Вильфредо в шоке](https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%BA%D0%BE%D0%BD_%D0%9F%D0%B0%D1%80%D0%B5%D1%82%D0%BE) <!-- .element: class="fragment" -->

-----

### Entity описывают <!-- .element: class="orange" -->

- поля из которого состоит объект <!-- .element: class="fragment" -->
- связи с другими entity <!-- .element: class="fragment" -->
- "любят" вызывать проблемы hoisting'а <!-- .element: class="fragment" -->

-----

### <span class="red">Hoisting problem</span> – это когда <br/>модули импортируют друг друга, <br/>используют переменные друг друга, <br/>но одна из них еще не инициализирована.

<br/>

<div class="fragment">Это на сервере подлый и неожиданный <br/><span class="red">TypeError: Cannot read property of undefined</span></div>

-----

### module1.ts

```ts
import { TaskTC } from './module2';

FolderTC.addFields({
  tasks: {
    type: () => TaskTC.List,
    description: 'List of Tasks',
  },
});

```

### module2.ts

```ts
import { FolderTC } from './module1';

TaskTC.addFields({
  folder: {
    type: () => FolderTC,
    description: 'Folder where task',
  },
});

```

<span class="fragment" data-code-focus="1" data-code-block="1">
<span class="fragment" data-code-focus="1" data-code-block="2">
<span class="fragment" data-code-focus="5" data-code-block="1">
<span class="fragment green" data-code-focus="5" data-code-block="2">С `graphql-compose` можно обернуть тип в arrow function</span>

-----

### Грубая оценка M3

- 22 Entity
- 1196 LoC
- ~ `⏱ 10 часов`

<br/>

Это время без учета общих типов (M2)<br/> и связей между Entity (M5,M7). <!-- .element: class="gray fragment" -->

-----

#### Пример создания схемы из JSON ответа<br/>(быстро, дешево, сердито):

<a href="https://youtu.be/ar7-HXBYfnk?t=1788" target="_blank"><img width="600" alt="Screen Shot 2020-06-16 at 01 25 42" src="https://user-images.githubusercontent.com/1946920/84697762-86252280-af70-11ea-98d2-224fab7326db.png"></a>

<https://youtu.be/ar7-HXBYfnk?t=1788>

-----

### Наблюдение: <!-- .element: class="orange" -->

- Когда создавал тип `Task` по ответу из JSON
  - то упустил кучу специфичных полей (CustomFields, Recurrent, Dependencies)
  - потерял документацию

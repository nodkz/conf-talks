# АВТОРИЗАЦИЯ

-----

### Что такое...

|                    | <!-- .element: class="fragment" data-fragment-index="1" -->|
|--------------------|----------------------|
| **Аутентификация** | процедура проверки подлинности пользователя путём сравнения введённого им логина и пароля. <!-- .element: class="fragment" data-fragment-index="1" --> |
| **Идентификация**  | процедура распознания пользователя по токену, сессии или кукам. <!-- .element: class="fragment" data-fragment-index="1" --> |
| **Авторизация**    | процедура проверки прав доступа к ресурсам на выполнение определённых действий. <!-- .element: class="fragment" data-fragment-index="1" --> |

-----

## 1. Аутентификация — Sign In

- **Без GraphQL**
  - отправляем логин/пароль через старый добрый POST, получаем токен
  - используем OAuth, получаем токен

- **Через GraphQL**
  - крутим query или mutation, через аргументы передаем логин/пароль в респонсе получаем токен; плюс сразу можем получить вагон данных

-----

## В результате Аутентификации должен быть ТОКЕН

-----

## 2. Идентификация — JWT, cookie

<br/>

### В мире GraphQL для генерации токенов сильно прижился [JWT](https://jwt.io/)

<br/>

Читать про JSON Web Token в [википедии](https://ru.wikipedia.org/wiki/JSON_Web_Token).

-----

## JWT-токен состоит из:

<p style="font-size: 2em">
<span style="color: #00b9f1" class="fragment" data-fragment-index="1">header</span>.<span style="color: #d63aff" class="fragment" data-fragment-index="2">payload</span>.<span style="color: #fb015b" class="fragment" data-fragment-index="3">sign</span>
</p>

**Пример:**

<span style="color: #00b9f1" class="fragment" data-fragment-index="1">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.</span>
<br/><span style="color: #d63aff" class="fragment" data-fragment-index="2">eyJzdWIiOjEsImlhdCI6MTU0MTI1MDE2M30.</span>
<br/><span style="color: #fb015b" class="fragment" data-fragment-index="3">M7xYg8GuEgwbqTrta0xnN7WmNEXOCKiQGDdogt_Kduk</span>

**Внутрянка**

<span style="color: #00b9f1" class="fragment" data-fragment-index="1">base64({ "alg": "HS256", "typ": "JWT" }).</span>
<br/><span style="color: #d63aff" class="fragment" data-fragment-index="2">base64({ "sub": 1, "iat": 1541250163 }).</span>
<br/><span style="color: #fb015b" class="fragment" data-fragment-index="3">HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), JWT_SECRET_KEY)</span>

-----

## C JWT легко работать на сервере

```js
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = 'qwerty ;)';

// Генерация токена
const token = jwt.sign({ sub: 2 }, JWT_SECRET_KEY);

// Проверка токена
const payload = jwt.verify(token, JWT_SECRET_KEY);
// { "sub": 1, "iat": 1541250163 }
// sub - это subject, например id пользователя
// iat - это время генерации токена
// а еще есть `iss`, `aud`, `exp`, `nbf`, `jti` - смотри спеку

```

-----

## Где хранить ТОКЕН на клиенте?

<br />

- `Если браузер` — то в куках с флагом httpOnly
  - делается только бэкендером, фронтендеру ничего делать не нужно <!-- .element: class="fragment" -->
  - если фронтендер в браузере хоть как-то сохранит токен, то привет XSS ☠️ <!-- .element: class="fragment" -->
- `Если мобильное приложение` — то в "AsyncStorage"
  - передаем токен через HTTP-заголовки с каждым запросом <!-- .element: class="fragment" -->

-----

## ☝️ Пссс, Бэкендер! ☝️

### Ты должен:

- уметь принимать и ставить токен через httpOnly куки
- а если там пусто, то посмотреть в HTTP-заголовках
- иначе Индетификация не прошла и перед тобой аноним 👻

-----

## 3. Авторизация — Прикручиваем ACL

Ее можно и нужно настраивать на следующих уровнях:

- на уровне сервера (apollo, express, koa и пр.)
- на уровне GraphQL-схемы (глобально на первых полях схемы)
- на уровне полей (в resolve методах)
- на уровне связей между типами (в resolve методах)

-----

## 3.1. Авторизация на уровне сервера (apollo, express, koa и пр.)

- считать токен из кук, либо заголовков
- провалидировать токен и произвести индетификацию пользователя
- передать пользователя в `context` graphql
- либо завернуть запрос, если токен невалиден или пользователь забанен

-----

### Пишем функцию помогайку получения пользователя из реквеста:

```js
async function getUserFromReq(req: $Request) {
  const token = req?.cookies?.token || req?.headers?.authorization;
  if (token) {
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    const userId = payload?.sub;
    if (userId) {
      const user = await users.find(userId);
      if (user) {
        if (user.isBanned) throw new Error('Looser!');
        return user;
      }
    }
  }
  return null;
}

```

<span class="fragment" data-code-focus="2" />
<span class="fragment" data-code-focus="4" />
<span class="fragment" data-code-focus="7" />
<span class="fragment" data-code-focus="9,10,14" />

-----

### Ну и на сервере формируем GraphQL-контекст

```js
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
});

```

<span class="fragment" data-code-focus="3" />
<span class="fragment" data-code-focus="6" />
<span class="fragment" data-code-focus="8" />
<span class="fragment" data-code-focus="10" />
<span class="fragment" data-code-focus="11" />

- Контекст формируется для каждого http-запроса перед тем как начнется выполняться GraphQL-запрос
- Переменные req, user и role будут доступны в агрументе context во всех методах resolve(source, args, `context`)

-----

## 3.2. Авторизация на уровне GraphQL-схемы

## (глобально на первых полях схемы)

-----

-----

-----
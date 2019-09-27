# JSON Models

-----

По спецификации GraphQL возвращает JSON. И чтобы работать с ответом от сервера, вы первым делом захотите переиспользовать практики наработанные с REST API. К примеру, воспользуетесь JSON моделью:

```java
interface JSONModel {
  @Nullable String getString(String key);
  @Nullable Int getInt(String key);
  @Nullable JSONModel getJSON(String key);
}
```

И когда захотите прочитать следующий ответ:

```graphql
fragment UserProfile on User {
  picture {
    url
    about
  }
}
```

То ваш код компоненты с JSON моделью будет выглядеть так:

```java
class UserProfileComponent {
  Component render(JSONModel model) {
    JSONModel pic = model.getJSON("picture");
    String uri = pic.getString("uri");
    int about = model.getInt("about");
  }
}
```

И при таком подходе мы столкнемся со следующими проблемами:

#### Проблема 1.1: Опечатки (typos)

Запрашиваем `url`, а считываем в модели `uri`:

```diff
fragment UserProfile on User {
  picture {
-    url
+    url
    about
  }
}

class UserProfileComponent {
  Component render(JSONModel model) {
    JSONModel pic = model.getJSON("picture");
-    String uri = pic.getString("uri");
+    String url = pic.getString("url");
    int about = model.getInt("about");
  }
}
```

#### Проблема 1.2: Отсутствие типовой безопасности (type safety):

Запрашиваем поле `about: String`, а в моделе оно считывается как `Int`:

```diff
fragment UserProfile on User {
  picture {
    url
-    about
+    about
  }
}

class UserProfileComponent {
  Component render(JSONModel model) {
    JSONModel pic = model.getJSON("picture");
    String url = pic.getString("url");
-    int about = model.getInt("about");
+    String about = model.getString("about");
  }
}
```

#### Проблема 1.3: Недополучения данных (underfetch):

Это когда мы используем данные в нашей компоненте, но при этом их не запрашиваем/получаем с сервера:

```diff
fragment UserProfile on User {
  picture {
    url
    about
+    width
  }
}

class UserProfileComponent {
  Component render(JSONModel model) {
    JSONModel pic = model.getJSON("picture");
    String url = pic.getString("url");
-    int width = model.getInt("width");
+    int width = model.getInt("width");
  }
}
```

#### Проблема 1.4: Получение лишних данных (overfetch):

C JSON очень легко получить больше данных, чем вам надо. Обычно это не считают проблемой, НО запрос каждого лишнего поля тратит время на получение его из базы, передачи по сети и парсинге значения на клиенте **(страдают впустую все, кроме ленивого разработчика 🤓)**:

```diff
fragment UserProfile on User {
  picture {
    url
    width
-    about
-    createdAt
  }
}

class UserProfileComponent {
  Component render(JSONModel model) {
    JSONModel pic = model.getJSON("picture");
    String url = pic.getString("url");
    int width = model.getInt("width");
  }
}
```

#### Вывод по JSON Models

С `JSON Models` вы получите следующие ошибки:

- Опечатки (typos)
- Отсутствие типовой безопасности (type safety)
- Недополучения данных (underfetch)
- Получение лишних данных (overfetch)

Не желательно использовать JSON Models в больших приложениях и командах. С горем пополам можно использовать если:

- код пишет один человек
- контролируете код и сервера, и клиента
- стабильные типы, редко меняющиеся
- очень мальнькие запросы
- можете протестировать каждое изменение

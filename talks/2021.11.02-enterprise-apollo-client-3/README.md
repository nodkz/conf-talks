# Докручиваем ApolloClient до энтерпрайзной разработки

Презентация доступна по следующим ссылкам:
- [темная тема](https://nodkz.github.io/conf-talks/talks/2021.11.02-enterprise-apollo-client-3/index.html)
- [светлая теме](https://nodkz.github.io/conf-talks/talks/2021.11.02-enterprise-apollo-client-3/white.html)

--------

Павел Черторогов
ps.kz, Архитектор информационных систем
<https://www.dropbox.com/s/22mncow425wsvwu/%20HolyJS%20%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82%D1%8B%20%D1%81%D0%BF%D0%B8%D0%BA%D0%B5%D1%80%D0%BE%D0%B2-53.jpg?dl=0>

GraphQL евангелист, разработчик интернет-продуктов, опенсорс-мейнтейнер. Сделал более 15 докладов о GraphQL и провел более 5 воркшопов как на клиенте, так и сервере. В веб разработке с 2001 года. Обладает обширными практическими знаниями по бэкенду, фронтенду, администрированию и построению архитектуры. В 2016 начал разработку graphql-compose (генератора GraphQL-схем). Написал много материала о GraphQL на русском – <https://github.com/nodkz/conf-talks>. В 2019 начал формировать best practice по дизайну GraphQL-схем – <https://graphql-rules.com>.

Twitter – @nodkz
Telegram – <https://t.me/graphql_ru>
GitHub – <https://github.com/nodkz>

### Тайминги

- 0:00 Интро (длительность 10:00)
  - О себе (1:30)
  - О теме доклада (3:30)
  - Герои пьесы - о туллинге (6:00)
- 10:00 Life coding  (длительность 42:00)
  - 10:00 Интро - старт скрипты, что делаем (1:30)
  - 11:30 Вывод списка продуктов (14:30)
    - 11:30 описание компонента ProductList (0:50)
    - 12:20 пишем query ProductListQuery (0:50)
    - 13:10 про @graphql-eslint/eslint-plugin (1:20)
    - 14:30 про vscode extension GraphQL (1:10)
    - 15:40 graphql-codegen (4:20)
    - 20:00 папочка generated (3:50)
    - 23:30 подключаем useProductListQuery() (2:30)
  - 26:00 Настоящая пагинация (8:30)
    - 26:00 переписываем на productPagination.items (1:50)
    - 27:50 добавляем переменные (2:30)
    - 30:20 показать networkTab переменные и названия операций (0:20)
    - 30:40 подключаем productPagination.pageInfo (1:20)
    - 32:00 рефакторим чутка код (2:00)
    - 34:00 почему показываем пагинацию с сервера (0:30)
  - 34:30 Удаляем запись (5:20)
    - 34:30 мутация ProductRemoveByIdMutation (1:30)
    - 36:00 подключаем useProductRemoveByIdMutation() (1:00)
    - 37:00 update(cache, result), cache.indetify(), cache.evict({ id }) (2:50)
  - 39:50 Обновляем запись (5:40)
    - 39:50 мутация ProductSetPriceMutation (2:40)
    - 42:30 useProductSetPriceMutation() (1:50)
    - 44:20 кастомизация месседжа, врапаем аполловский хук (1:10)
  - 45:30 Subscription на изменение цены (6:30)
    - 45:30 открываем второй браузер (0:30)
    - 46:00 сабскрипшн ProductUpdateSubscription (0:30)
    - 46:30 обновляем схему с сервера через graphql-codegen (1:50)
    - 48:20 создаем фрагмент ProductListItem.fragment (2:20)
    - 50:40 подключаем useProductUpdateSubscription() (1:20)
- 52:00 Всяко разно, новости, планы  (длительность 7:00)
- 59:00 Закрытие (длительность 1:00)

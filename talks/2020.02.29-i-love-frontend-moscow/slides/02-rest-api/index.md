# За что мы не любим REST API?

-----

- Жирные ответы
  - Научный труд от бразильцев (ссылка на доклад): we show that GraphQL can reduce the size of the JSON documents returned by REST APIs in 94% (in number of fields) and in 99% (in number of bytes), both median results.
  - Со временем в АПИ добавляются новые поля, и старые клиенты могут начать захлебываться/тормозить
- Сложность получения связных данных
- Скорость получения связных данных
- Опыт Paypal (1/3 времени на разработку, 2/3 на болтавню о том что, где и как взять).
  - <https://github.com/nodkz/graphql-podcast/blob/master/2019-11-paypal/index.md#graphql-a-success-story-for-paypal-checkout>

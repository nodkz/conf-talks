# ApolloClient 3

# vs <!-- .element: class="grey" -->

# Relay

-----

### Старое сравнение ApolloClient 2 и Relay

<a href="https://youtu.be/VdoPraj0QqU" target="_blank"><img src="https://img.youtube.com/vi/VdoPraj0QqU/0.jpg" alt="ApolloClient или Relay с фрагментами, «волосатый» GraphQL" style="max-width: 580px" class="plain" /></a>

<https://youtu.be/VdoPraj0QqU>

HolyJS Piter 2019

-----

## Грубо говоря <!-- .element: class="gray" -->

## На текущий момент они сравнялись по функциональности 🎉

Теперь у ApolloClient 3 есть GC <!-- .element: class="green" -->

-----

### Что-нибудь слышали про FragmentModels?

<a href="https://www.youtube.com/watch?v=0bpZiMVJh14" target="_blank"><img src="https://img.youtube.com/vi/0bpZiMVJh14/0.jpg" alt="GraphQL-фрагменты на клиенте: история появления, ошибки использования" style="max-width: 580px" class="plain" /></a>

<https://youtu.be/0bpZiMVJh14>

HolyJS Moscow 2019

-----

## ApolloClient не будет поддерживать FragmentModels

### (никогда не говори никогда, <br/>но в ближайший год точно) <!-- .element: class="fragment gray" -->

-----

## ApolloClient 3 и Relay – их дорожки разошлись!

Аполловцы ударились в производительность и скорость работы кэша c EntityCache. <!-- .element: class="fragment green" -->

И, скорее всего, не будут поддерживать FragmentModels<!-- .element: class="fragment orange" -->

А для FragmentModels, как в Relay, нужна глубокая нормализация кэша. <!-- .element: class="fragment red" -->

PS. Apollo поддерживал и будет поддерживать <br/>GraphQL-фрагменты (не путать с FragmentModels). <!-- .element: class="fragment" -->

-----

## За что я перестал любить Relay  <!-- .element: class="red" -->

- Основная разработка внутри фабрикатора фейсбука <!-- .element: class="fragment" -->
- Если у вас возник вопрос или проблема, то инженеры Фейсбука практически не отвечают в ишьюсах <!-- .element: class="fragment" -->
- Слабое комьюнити <!-- .element: class="fragment" -->
- Тяжело изучить самостоятельно и по статьям в интернете <!-- .element: class="fragment" -->
- Достаточно сложный внутренний код (KISS не про Relay) <!-- .element: class="fragment" -->
- Внутри Flowtype (и его тоже я перестал любить за его тормознутости и жестокость) <!-- .element: class="fragment" -->

-----

## А что Apollo?

### Они строят бизнес на своем опен-сорсе (консультации, engine, ...) и поэтому сильно: <!-- .element: class="fragment green" -->

- качают комьюнити <!-- .element: class="fragment" -->
- пилят документашку <!-- .element: class="fragment" -->
- отвечают на ишью <!-- .element: class="fragment" -->
- активно принимают Pull Request'ы. <!-- .element: class="fragment" -->

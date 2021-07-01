Microservices is a widely used architecture pattern for designing backend systems. Microservice systems are composed of small independently deployed units, running on separate processes, and communicating with each other using a network interface.

They promise low coupling, high cohesion, and strong composability, which is achieved by providing a high level of autonomy to teams. Some of the promised benefits of using microfrontends are simple decoupled codebases, independent deployment, autonomous teams [36], and better customer focus.

An equivalent architecture pattern for the frontend has emerged called microfrontends. Как и микросервисы, они нацелены на обеспечение высокой автономии команды, но зрелость методов и технологий ниже, чем у микросервисов.

ThoughtWorks, defines microfrontends as: “An architectural style where independently deliverable frontend applications are composed into a greater whole”

## Problem Statement

### Safe microfrontend consumption.

Обновления микрофронтэнда публикуются для клиентов независимо от клиентских интерфейсов. Если обновление представляет измененный API или другое требование к макету, существует риск того, что приложение-потребитель сломается во время выполнения.

### Microfrontend deployment autonomy

Команда, внедряющая микрофронтенд, лучше всех знает, как следует использовать микрофронтенд, и должна иметь максимальную автономию. Они должны иметь возможность вносить любые требуемые обновления, даже если обновления нарушают работу текущих интерфейсных API. В настоящее время провайдерам необходимо синхронизировать аварийные обновления со всеми потребителями, что препятствует автономии команды.

### Ownership of integration complexity

При использовании микрофронтендов потребители управляют логикой интеграции для включения, а не провайдеры микрофронтендов. Насколько нам известно, эта взаимосвязь верна для всех существующих решений для микрофронтендов. Поскольку группа-поставщик обладает наибольшими знаниями предметной области, они должны нести ответственность за реализацию логики интеграции. Еще лучше, если логика интеграции будет реализована автоматически.

----

Semantic versioning Semantic versioning is a versioning specification that allows consumers to know if a specific version is compatible with their consuming code [54]. Every version number consists of three positive integers denoted with the following format: MAJOR.MINOR.PATCH (e.g. 2.4.1) [54]. The version number is sometimes denoted as BREAKING.FEATURE.FIX to better convey the meaning of the numbers.

-----

## Composing Microfrontends

### Linked Pages and SPAs

Microfrontends can be integrated on the server, on the client, or a combination of both [36]. The simplest server side integration is to serve different web pages on different endpoints [36]. All traditional tools and processes can be used to develop the separate pages, and the different microfrontends can be SPAs. This can be achieved with a web proxy to serve the different pages on a single domain address, which is visualized in Figure 3.4.1. Geers calls this technique Linked Pages if every page is a separate application, and Linked SPAs if some pages are grouped into one SPA [27]. When using Linked SPAs page navigation is hard when navigating between SPAs and soft when navigating internally in an SPA.

### Server-Side Fragment Composition 

Server-side composition can also be used to serve page fragments. This is sometimes called transclusion, and can be done by using technologies like Server Side Includes [25], Edge Side Includes, Zalando Tailor, or Podium [27, ch. 4]. Similar technologies exist for XML transclusion as well [35]. Note that as pages just are large fragments, these technologies can also be used to divide an application on a page level.

### Iframes 

All existing client side integration methods can be used for fragment composition, and therefore page composition. The most naive client side in- tegration method is using iframes, which is a web-native standard [27, ch. 2]. Iframes were introduced with the HTML 4.01 standard in 1998 [55], when web was still an early technology, which is why there are drawbacks to using them on a modern web application. The most notable trade-offs are performance overhead, accessibility problems, search engine optimization problems, and the lack of layout control [27, ch. 2].

### Web Components 

A much newer web-native standard is web components, which in practice is a suite of four web technology standards [43]. They allow dynamic custom elements to be defined and registered, in an encapsulated scope [43]. They are used by Google on large products like Youtube to include highly interactive elements [62]. The largest issue is that web components can not be server side rendered, as they have to be run in a browser at the client.

### Unified SPAs

One of the most popular and extensive frameworks is single-spa [58]. It is a shell application that includes applications developed using other frameworks [58]. It behaves like a thin orchestration layer that handles routing and micro front end composition. Geers calls this kind of framework a Unified SPA, as it wraps other SPAs into one cohesive application [27]. Single-spa requires the root application to be written as a single-spa application, which implies a considerable migration cost to existing applications [58].

### Module Federation 

Module Federation is an addition to the web bundler Webpack that allows an application to consist of more than one deployment unit [37, 67]. The extension allows encapsulated compiled deployment units to expose functionality and consume functionality from other deployment units [37, 67]. This way separate deployment units can share dependencies and depend on each other. The composition is done at run-time, which facilitates independent deployments.

Federated modules could have a large impact on microfrontends, as it allows developers to write applications as if they are monolithic, when they in practice are distributed over multiple projects. There is a potential for frameworks to emerge that are built on top of the functionality of module federation.

Don't forget to say about 
- SystemJS
- Déjà Vu (Researchers at MIT) https://deja-vu-platform.com/
- Zalando Interface Framework (ZIF)

## Peoples

- Zackary Jackson author of flagship feature for Webpack 5, module federation
- Michael Geers creator of https://micro-frontends.org/
- Joel Denning  single-spa
- Luca Mezzalira author of Building Micro-Frontends
- Jérémy Colin https://www.mosaic9.org/, Interface Framework

### 4.2.1 What is a Microfrontend?

independent deployments is the most important aspect
The problems that microfrontends solve, are largely organizational problems, not technical problems. And we think that one of the biggest organizational problems that is solved, is [...] different parts of an organization, being able to act independently. Being able to release their code to production without getting approval from everyone else.


It is impractical or even impossible for microfrontends to communicate via network, and they are always executed on the same thread. The DOM, which can be seen as a replacement for a datastore, is shared, which means that they are accessing and mutating the same datastore.

A micro-frontend represents a business domain that is autonomous, is independently deliverable, and is owned by a team.

Microfrontends borrow many aspects from microservices, but because of the vastly different execution environments and different constraints, they are also different in many ways. 

Microfrontends are modelled to match organization structure.

### 4.2.2 Why Are Microfrontends Used?

There is a clear consensus that microfrontends solve complexity problems that arise when there are too many developers working on the same frontend. Solving the scalability problems, can have other indirect positive consequences, like a higher software quality, fewer published bugs, and counterintuitively, higher performance.

The interviewees gave rules of thumb that ranged between 10 and 50 developers, as a minimum requirement before looking into using microfrontends.

For Michael a prominent reason for using microfrontends is for creating vertically aligned teams. Michael describes microfrontends as a tool for creating very clear boundaries.

For Joel, a prominent reason for using microfrontends is lower build times and easier deployments. Joel shared experiences where large frontend applications take an hour to build, which vastly prolongs the developer feedback loop. By dividing an application into smaller parts, the parts get independent build steps, which are all quicker to execute.

### benefits of using microfrontends

- Independent deployability - Microfrontends can be independently deploy- able, which enables teams to be more independent.
- Fault isolation - It can be easier to isolate faults to parts of an application, while the rest of the application works.
- Easier development - Microfrontends are smaller and easier to work with than monoliths.
- Live support - It can be easier and quicker to do hotfixes. This is a consequence of fault isolation, where it is easy to know which part of the application is breaking, and therefore easier to find the cause than in a monolith.

### Problems that could be a reason for using microfrontends

- Scalability - There are more than 50 developers working on the same frontend application.
- Complexity - The application is very complex. Dividing a complex application enforces loose coupling between the microfrontends. Moreover the separate parts are smaller and easier to understand than a large complex monolith.
- Team coordination - there are problems with coordinating multiple frontend teams.
- Long feedback loop - The duration of compiling a frontend application is very long.

### Impact on User Experience 

A common misconception about microfrontends is that they always provide worse UX than monoliths. The reasoning is based on code duplication. Every microfrontend shares large parts of code, like the framework code, and therefore the total bundle size of a web-page becomes much larger.

Module federation aims to enable microfrontends to share common code in an easy manner. In projects where module federation is used, there should be a very small impact to bundle sizes, as code duplication is avoided by enabling easy sharing.

Joel has a similar contribution with single-spa, which is not about reducing total code size but aims at reducing initial code size by lazy loading resources.

Jérémy’s suggested a strategy for deciding when to decouple a fragment. When there exists an isolated piece of UI that can be dropped in anywhere else in the application, he suggests that it could be a good target for a microfrontend. Reusability is Jérémy’s primary indicator for deciding where to place boundaries. If a part of a UI is not reusable, it could be a part of the page it exists in.

## Managing the integration layer

Zackary suggests that anything that is shared across many microfrontends could be placed in the integration layer. Examples are user authentication and user data. Zackary usually places the website footer and navigation bar in the integration layer, as it is shared across the application.

## State management 

Michael, Joel, and Zackary all mentioned that it is important to consider what application state is shared between microfrontends and how it is shared. Global application state stores should be avoided, as it adds tight coupling between microfrontends. If two microfrontends share a lot of state, they should in many cases be merged into one microfrontend.

## The Future of Microfrontends

Microfrontends is still a new technology. All interviewees mentioned expectations for the technology to mature and grow in popularity. They also expect new patterns and best practices to emerge.

Zackary expects tools to emerge from module federation. Module federation is a low level construct, and will become more powerful when it is used to create tools built using it. Zackary expects frontend frameworks to use it to compose shared assets.


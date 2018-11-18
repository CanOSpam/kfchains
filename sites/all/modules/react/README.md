
## Decoupled Starter Kit Application from Acquia

### About

The Acquia Decoupled Starter Kit for React provides a complete working environment for demonstrating and prototyping front-end digital experience applications coded in standard Javascript, utilizing decoupled Drupal as a content service. This starter kit aims to provide technical guidance and insights for both Javascript and Drupal developers and is comprised of three separate applications: Headless Lightning Drupal website, React application, and a GraphQL application. Each of these applications works in tandem to illustrate patterned workflows when developing with each of the interconnected applications.

The Decoupled Starter Kit for React was created by [Steve Worley](https://twitter.com/sjworley) and [Jason Enter](https://twitter.com/jasonenter) from the [Acquia](https://www.acquia.com) Professional Services team. The intent of the application(s) is to explore different architectural scenarios when building Decoupled Drupal applications while using the development to explore options around best practices with these patterned workflows. The components are broken out by functional purposes and the content subjects are intended as straightforward methods to understand.

### Getting Started

A complete installation steps, high-level overview of the architecture and detailed walk-thru of the code is included in the [Read the Docs website](http://decoupledkit-react.readthedocs.io). The getting started guide is broken out for the [React application](http://decoupledkit-react.readthedocs.io/en/develop/gettingstarted-react/), the [GraphQL application](http://decoupledkit-react.readthedocs.io/en/develop/gettingstarted-graphql/), and the [Headless Lightning Drupal](http://decoupledkit-react.readthedocs.io/en/develop/gettingstarted-drupal/) website. The applications are structured for baseline API architectures to work in tandem, but can also be used as boilerplates for other purposes.


### Feature Summary

**Drupal CRUD** <br>
This page addresses workflows when dealing directly with JSON API endpoints served from a Headless Lightning Drupal instance. These tasks are broken out by core CRUD (Create, Read, Update, Delete) tasks for rich text and images fields. This application does not propose replacing Drupal content authoring strengths but rather seeks to understand workflows around interacting with API content.

**GraphQL Client (Single)**  <br>
This page addresses architecture scenarios when interacting with a GraphQL server which is exposing content that originates from Drupal's JSON API (single source). These components interact with data that is served via GraphQL queries to retrieve and compare data sets. This page also helps to compare benefits of using GraphQL as a middle orchestration layer, opposed to dealing directly with standard JSON API structures.

**GraphQL Client (Multiple)**  <br>
This page builds upon the previous example by synthesizing non-Drupal and Drupal API data with GraphQL by combining multiple sources. GraphQL serves the combination of data points into proper structures for retrieval of data, as well as GraphQL mutations. This component also addresses scenarios around caching and performance by using the Apollo Client layer.

**API Data Failover** <br>
Architectures which lean on external sources as the primary data streams can offer challenges. This page demonstrates methods to tackle these scenarios with API failure with techniques of browser cache, local indexed databases, and local storage.

**API Data Mock** <br>
This component illustrates utilizing techniques to mock API data endpoints when developing locally. Mock data endpoints are typically included within local build scripts to help emulate data models, while addressing issues around rate limits, changing real data, and similar challenges.


### Visual References

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/6df987ad-ceda-41b2-a3cb-8bcd93a2ac6d/00002939.png" />

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/b5ccb893-bc70-4450-887b-804e1c83919d/00002936.png" />

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/115dae2c-8ee3-4af2-854b-10e2319ee43e/00002937.png" />

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/abe00c23-123a-494b-aed8-13e0a5a14863/00002940.png" />

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/66016689-79d4-4c8c-9af1-6b3d3b9dc189/00002938.png" />

<br /> <hr />

### Credit

The React portion of this project was built using the excellent toolset provided in the [React Slingshot](https://github.com/coryhouse/react-slingshot) by Cory House. We have included the primary readme documentation [here](/docs/react-slingshot/README.md). Be sure to also review the React Slingshot [FAQs](/docs/react-slingshot/FAQ.md), as well as [contributors](/docs/react-slingshot/CONTRIBUTORS.md) and [contributing](/docs/react-slingshot/CONTRIBUTING.md).


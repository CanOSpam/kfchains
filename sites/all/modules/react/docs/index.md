## Decoupled Starter Kit for React 

### About the Starter Kit

The Acquia Decoupled Starter Kit for React provides a complete working environment for demonstrating and prototyping front-end digital experience applications coded in standard Javascript, utilizing decoupled Drupal as a content service. This starter kit aims to provide technical guidance and insights for both Javascript and Drupal developers and is comprised of three separate applications: Headless Lightning Drupal website, React application, and a GraphQL application. Each of these applications work in tandem to illustrate patterned workflows when developing with each of the interconnected applications.

The Decoupled Starter Kit for React was created [Steve Worley](https://twitter.com/sjworley) and [Jason Enter](https://twitter.com/jasonenter) from the [Acquia](https://www.acquia.com) Professional Services team. The intent of the application(s) is to explore different architectural scenarios when building Decoupled Drupal applications, while using the development to explore options around best practices with these patterned workflows. The components are broken out by functionality and the content subjects are targeted according to the purpose. 

### Ready to get started? 

Each of the applications can be set up independently of each other, but are reliant on data shared between each other. So we suggest setting up the applications in the following order to get the full benefits of the complete workflow. 

> 1. [Set up your Headless Lightning Drupal website](./gettingstarted-drupal.md)

> 2. [Set up your GraphQL application](./gettingstarted-graphql.md)

> 3. [Set up your Decoupled React application](./gettingstarted-react.md)


### Decoupled scenarios covered in the architecture


**Perform Drupal CRUD Operations with React applications**                             
The application demonstrates workflows when interacting directly with JSON API endpoints served from a Headless Lightning Drupal instance. The functional tasks are broken out by traditional CRUD (Create, Read, Update, Delete) operations. This application seeks to understand workflows around interacting with API content.

**Orchestrate Drupal JSON API Data with GraphQL**                              
This architecture offers functionality when interacting with GraphQL as an proxy application in which JSON API data originates from Drupal. The code utilizes a Pokemon content type which is served by Drupal via GraphQL. The code and documentation walks the developer through the experience of abstracting and structuring data in GraphQL, and subsequent queries in React.  

**Synthesize Multiple API Sources in GraphQL for React**                    
This functionality offers workflows when interacting with GraphQL as an orchestration application in which API data is abstracted from several sources. The architecture combines and structures: Drupal JSON API from Drupal, Marvel API web service, and a comic book sales RESTful service.

**Implement API-first Architectures Best Practices**                                       
The application tackles the challenges of building an API-first architecture. Multiple methods are implemented to address API failover for unavailable web services or inconsistent connections such as the implementation and utilization of mock APIs within the standard development tasks. These techniques are displayed using existing API data from Drupal. Many examples are included with storing and leveraging API data within React, in addition to storing API data back into Drupal.



### Visual References

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/6df987ad-ceda-41b2-a3cb-8bcd93a2ac6d/00002939.png" />

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/b5ccb893-bc70-4450-887b-804e1c83919d/00002936.png" />

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/115dae2c-8ee3-4af2-854b-10e2319ee43e/00002937.png" />

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/abe00c23-123a-494b-aed8-13e0a5a14863/00002940.png" />

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/66016689-79d4-4c8c-9af1-6b3d3b9dc189/00002938.png" />



### Credit

The React portion of this project was built using the excellent toolset provided in the [React Slingshot](https://github.com/coryhouse/react-slingshot) by Cory House. We have included the primary readme documentation [here](./react-slingshot/README.md). Be sure to also review the React Slingshot [FAQs](./react-slingshot/FAQ.md), as well as [contributors](./react-slingshot/CONTRIBUTORS.md) and [contributing](./react-slingshot/CONTRIBUTING.md).


# GraphQL Demo Server

### About 

This is a GraphQL server application to be used with a [sibling React application](https://github.com/acquia-pso/javascript-ps-starter-react) for demo and training purposes. This application has a simple schema for the display of a handful of Marvel Villain characters. After installation, you can view the GraphQL API UI for testing at  <a href="http://localhost:8082/graphiql">http://localhost:8082/graphiql</a>. The endpoint path to target from an external application is `http://localhost:8082/graphql`.

- Express
- GraphQL
- GraphQL Tools
- Apollo Server Express
- Babel transpiling 


### Installation 

- Install <a href="https://yarnpkg.com/lang/en/docs/install/">yarn</a> or also use `npm` for dependencies.
- Install packages with `yarn install` or `npm install`
- Run the server with `yarn start` or `npm start` and visit `http://localhost:8082`


### Usage

The GraphQL API UI will provide a method to test queries, which you can then replicate in our secondary application. Below are some quick schema constructs which have been added by default. 


#### Show all Marvel characters with the following properties

```
{
  characters {
    id
    name
    description
    image
    comics {
      id
      title
      image
      description
      sales {
        issue
        count
      }
    }
  }
}

```

#### Create a new Marvel character with a Mutation

```
mutation CreateCharacter($input: CharacterName!) {
  createCharacter(input: $input) {
    id
    name
    description
    image
    comics {
      id
      title
      image
      description
      sales {
        issue
        count
      }
    }
  }
}


(query variable)
{
  "input": {
    "name": "Arcade"
  }
}
```
#### Update Marvel character with a Mutation

```
mutation UpdateCharacter($input: CharacterName!) {
  createCharacter(input: $input) {
    name
    description
  }
}

(query variable)
{
  "input": {
    "name": "Arcade"
  }
}
```

#### Display all Marvel character names

```
{
  marvel {
    name
  }
}
```

#### Display all Pokemon characters

```
{
  pokemons {
    id
    nid
    pokemon_id
    title
    back_shiny_sprite
    front_shiny_sprite
    height_pokemon
    weight_pokemon
    hp
    attack
    defense
    special_attack
    special_defense
    speed
    abilities {
      id
      type
      name
      description
    }
    ref_types {
      id
      type
      name
      description
    }
  }
}
```

#### Select Pokemon characters by Drupal NID

```
{
  pokemon(nid:27) {
    id
    nid
    pokemon_id
    title
    back_shiny_sprite
    front_shiny_sprite
    height_pokemon
    weight_pokemon
    hp
    attack
    defense
    special_attack
    special_defense
    speed
    abilities {
      id
      type
      name
      description
    }
    ref_types {
      id
      type
      name
      description
    }
  }
}
```

#### Display Mocked User data

```
{
  users {
    name
    email
    first_name
    last_name
    email
    country
    id
  }
}
```

<br />

---------------------------


**http://localhost:8082/graphiql**

<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/01c8189d-44a9-495f-bf0d-8778e3945bbb/00002870.png" />







## GraphQL Data Sources

**Note:** each of the queries can be tested in the browser at [http://localhost:8082/graphiql](http://localhost:8082/graphiql)

### Pokemon

The `pokemons` type is sourced from the Drupal JSON API endpoints which are served from the Headless Lightning instance stored in the sibling repository. A `Model` and query structure is broken out and combined for the `pokemon` content type in Drupal, as well as the `field_abilities` and `field_type_pokemon_ref` taxonomy terms on that same content type. OAuth2 validation is used when communicating with the Drupal instance, in addition to the proper headers when fetching the data.

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




### Characters 

This type allows for both queries and mutations based on functional purpose. This is also designated to display the combination of multiple sources in GraphQL, and subsequently within the React application. This document notes the separation as an explanation but the synthesizing of this data is address in the [Marvel docs](./graphql-marvel.md).

#### Marvel 

#### Characters 

This type is retrieving data from the Drupal instance via the JSON API for the content type "Marvel Characters". 

```
{
  characters {
    id
    name
    marvelId
    image
  }
} 
```

This data is originally fetched from the [Marvel API](https://developer.marvel.com/) using the `API_PUBLIC_KEY` and `API_PRIVATE_KEY` which is stored in the local `.env` file.

```
{
  marvel {
    id
    name
  }
}
```

#### Comics 

This data is also fetched from the [Marvel API](https://developer.marvel.com/) using the `API_PUBLIC_KEY` and `API_PRIVATE_KEY`, which is stored in the local `.env` file. Comics are related directly to characters and cannot be queried for independently.

```
{
  characters {
    comics {
      id
      title
      issueNumber
      description
      image
    }
  }
}
```

#### Comic Sales 

This data is also fetched from the [Comic Sales API](https://comichron-data.github.io/api/titles.json) to compare sales data with the comic list from the chosen characters. Similar to Comics, Comic sales are related directly to comics and cannot be queried for independently. The comic sales API does not directly match the Marvel's API so the server does a fuzzy match to try and find data to present to demo the concept.

```
{
  characters {
    comics {
      comicSales {
        issue
        count
      }
    }
  }
}
```


### User 

The `users` type is a designated mock query intended for testing within the React application. This mock API data facilitates using the `mocks` option from the `graphql-tools` package. The `casual` package is also used to generate fake data. These tools allow for the custom type declarations which are defined in `src/mocks.js`.

```
{
  users {
    email
    first_name
    last_name
    email
    country
    id
  }
}
```

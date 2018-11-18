## Drupal Content Types

### What are Drupal content types?

An API-first CMS could contain many types of content that are designated for a storage method and intent. In Drupal, each item of content is called a node and each node belongs to a single content type. The content type defines various default settings for nodes of that type, such as whether it is published automatically and whether comments are permitted.

### Considerations for content APIs

#### No more layouts in WYSIWYG

In a coupled Drupal architecture your website's theme is linked directly to your content model. This allows you to provide content editors with classes and additional HTML layout options in WYSIWYG fields. In a decoupled architecture you should provide only raw content for clients to display as they see fit. Meaning your content should be clean of all inline HTML attributes (no classes, no styles).

### The decoupled kits content types

This Decoupled Starter Kit for Drupal offers following 5 content types with the associated fields.

**Client** - A collection of user clients for sample data.

```
Country | field_country | Text (plain)
Email | field_client_email | Email
First Name | field_first_name | Text (plain)
Last Name | field_last_name | Text (plain)
```

**Dogs** - A content type to display common schema constructs with fields.
   
```
Description | body | Text (formatted, long, with summary)
dog picture | field_dog_picture	Image
History and Background | field_history_and_background | Text (formatted, long, with summary)
```

**Marvel Characters** - Marvel character nodes to be used as sample data.
    
```
Description	| field_description	| Text (formatted, long)
Image Reference	| field_image_reference | Text (plain)
Marvel ID | field_marvel_id | Text (plain)
Nemesis | field_nemesis | Text (plain)
```

**Pokemon** - Various characters from the Pokemon game series.

```
Abilities |	field_abilities	| Entity reference
Attack | field_attack |	Number (integer)	Back Shiny (image sprite) |	field_back_shiny_sprite | Text (plain)
Defense | field_defense | Number (integer)
Front Shiny (image sprite) | field_front_shiny_sprite | Text (plain)
Height | field_height_pokemon | Number (integer)
HP | field_hp | Number (integer)
Pokemon ID | field_pokemon_id | Number (integer)
Special Attack | field_special_attack | Number (integer)
Special Defense | field_special_defense | Number (integer)
Speed | field_speed | Number (integer)
Type | field_type_pokemon_ref | Entity reference
Weight | field_weight_pokemon | Number (integer)
```


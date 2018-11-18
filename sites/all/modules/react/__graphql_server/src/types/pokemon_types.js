
const schema = `
type Ref_Type {
  id: ID!
  type: String
  name: String
  description: String
}
`;

/**
* --- CLASS MODEL ---
*
* A model can be used to massage the data received from a remote source (db,
* api, etc.) into the schema known by GraphQL.
*/
export class Model {
  constructor({ id, type, attributes }) {
    this.id = id;
    this.type = type;
    this.name = attributes.name;
    this.description = (attributes.description) ? attributes.description.value : 'not available';
  }
}
/** ---- */

export default () => ({
  schema
});

import comicSale from './comicSale'
import { api as ComicSalesApi } from '../helper/ComicSalesApi'

const schema = `
  type Comic @cacheControl(maxAge: 30) {
    id: ID!
    title: String!
    issueNumber: Int
    description: String
    image: String
    sales: [ComicSale]
  }
`;

const resolvers = {
  Comic: {
    sales: (({title}) => ComicSalesApi.fetch(title))
  }
}

/**
 * --- CLASS MODEL ---
 *
 * A model can be used to massage the data received from a remote source (db,
 * api, etc.) into the schema known by GraphQL.
 */
export class Model {
  constructor({ id, title, issueNumber, description, thumbnail }) {
    this.id = id;
    this.title = title;
    this.issueNumber = issueNumber,
    this.description = description;
    this.image = `${thumbnail.path}.${thumbnail.extension}`;
  }
}
/** ---- */

export default () => ({
  schema,
  resolvers,
  modules: [comicSale]
});

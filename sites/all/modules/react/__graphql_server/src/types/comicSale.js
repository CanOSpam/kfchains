const schema = `
  type ComicSale @cacheControl(maxAge: 30) {
    issue: Int!
    count: Int!
  }
`

export default () => ({
  schema
})

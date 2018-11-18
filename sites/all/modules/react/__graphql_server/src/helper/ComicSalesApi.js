import fetch from 'node-fetch'

class ComicSalesApi {
  constructor() {
    this.url = 'https://comichron-data.github.io'
    this.cache = {issues: this.fetchTitles() }
  }

  handleErrors(id) {
    return (message) => {
      console.log(`ComicSales API Error: Couldn't retrieve comic (${id})`, message)
      return []
    }
  }

  async fetchTitles() {
    // This request was slow and due to how the ComicSalesApi class was using it; it was a fetch
    // to this endpoint for every comic to find the Issue ID that this API uses so we can inspect
    // further for the actual sales data.
    // 
    // This leverages a new feature of ES2016- we can halt a Prmoise until it resolves, so we warm
    // this cache every time the application starts and then the list will be held in memory until
    // we restart the application. .then() also returns a promise so this will wait until the 
    // request has completed and the JSON is returned from the response object.
    return await fetch('https://comichron-data.github.io/api/titles.json').then(res => res.json())
  }

  fetchById(id) {
    return fetch(`${this.url}/api/titles/${id}/by-issue.json`)
      .then(res => res.json())
      .then(json => json.records)
      .catch(this.handleErrors(id))
  }

  fetch(title) {
    // Fuzzy matching for illustrative purposes.
    title = title.replace(/[^a-zA-Z]/g, '').toLowerCase()
    return this.cache.issues.then(issues => {
      const issue = issues.find(el => el.title.toLowerCase().indexOf(title) > -1)
      if (!issue) return []
      return this.fetchById(issue.id)
    })
  }

}

export let api = new ComicSalesApi()
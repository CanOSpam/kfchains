import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactHtmlParser from 'react-html-parser'
import '../styles/character.scss'
import Comic from './Comic';

class Character extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { name, image, description, comics } = this.props;

    const Comics = comics.map(comic => {
      return (
        <Comic
          key={comic.id}
          title={comic.title}
          image={comic.image}
          description={comic.description}
          sales={comic.sales}
        />
      )
    })

    return (
      <div className="character">
        <h4>{name}<span className="api-source api-source-drupal">Drupal API</span></h4>
        <div className="col col-image">
          <div className="row">
            <div className="label">{"Image"}</div>
            <div className="image"><img src={image} /></div>
          </div>
        </div>
        <div className="col">
          <div className="row">
            <div className="label">{"Name"}</div>
            <p>{name}</p>
          </div>
          <div className="row">
            <div className="label">{"Description"}</div>
            {(description) ? ReactHtmlParser(description) : 'No description available'}
          </div>
          <div className="comics">
            <div className="label"><span className="api-source api-source-marvel">Marvel API</span>{"Appearances"}</div>
            {Comics}
          </div>
        </div>
      </div>
    )
  }

}

Character.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  description: PropTypes.string,
  comics: PropTypes.array
}

export default Character;

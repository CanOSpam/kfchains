import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'
import PropTypes from 'prop-types'

import '../styles/villain.scss'

class Villain extends Component {

  constructor(props) {
    super(props);
  }

  showInfo(e) {
    e.preventDefault();
  }

  render() {

    const { name, description, image, nemesis } = this.props;
    const nemesisList = (nemesis) ? nemesis.join(", ") : '';

    return (
      <div className="villain clearfix">
        <span className="api-source api-source-drupal">Drupal API</span>
        <h4><a href="#" onClick={this.showInfo.bind(this)} >{name} </a></h4>
        <div className="villain-container clearfix">
          <div className="row row-img">
            <div className="label">Image</div>
            <p style={{ textAlign: "center" }}> <img src={image} /></p>
          </div>
          <div className="row">
            <div className="label">Name</div>
            {name}
          </div>
          <div className="row">
            <div className="label">Description</div>
            {ReactHtmlParser(description)}
          </div>
          {nemesisList && (
            <div className="row">
              <div className="label">Nemesis</div>
              <p> {nemesisList} </p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

Villain.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  nemesis: PropTypes.array,
}

export default Villain;

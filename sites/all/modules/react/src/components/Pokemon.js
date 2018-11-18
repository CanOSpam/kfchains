import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser'

class Pokemon extends Component {
  constructor(props) {
    super(props)
    this.state = { showfull: false }
  }
  showInfo(e) {
    e.preventDefault();
    this.setState({ showfull: !this.state.showfull });
  }

  taxonomies(title, el) {
    return (
      <div>
        <div className="label"> {title} </div>
        {
          el.map((item, index) => (
            <div className="rows-terms" key={index}>
              {item['name'] ? <div className="name"> {item['name']}</div> : null}
              {item['description'] ? <div className="description">Description: {ReactHtmlParser(item['description'])}</div> : null}
            </div>
          ))
        }
      </div>
    );
  }

  base_stats(el) {
    const delta = 74; // just random number, not from the official Pokemon universe :)
    return (
      <div className="base-stats-row">
        <div className="label">Base Stats</div>
        <div className="stats-groupings">
          <div className={(el['hp'] > delta) ? 'impressive' : ''}><span>HP</span> <span>{el['hp']}</span> </div>
          <div className={(el['attack'] > delta) ? 'impressive' : ''}><span>Attack</span> <span>{el['attack']}</span></div>
          <div className={(el['defense'] > delta) ? 'impressive' : ''}><span>Defense</span> <span>{el['defense']}</span></div>
          <div className={(el['special_attack'] > delta) ? 'impressive' : ''}><span>Special Attack</span> <span>{el['special_attack']}</span></div>
          <div className={(el['special_defense'] > delta) ? 'impressive' : ''}><span>Special Defense</span> <span>{el['special_defense']}</span></div>
          <div className={(el['speed'] > delta) ? 'impressive' : ''}><span>Speed</span> <span>{el['speed']}</span></div>
          <div className="total">
            <span>Total</span>
            <span>{el['hp'] + el['attack'] + el['defense'] + el['special_attack'] + el['special_defense'] + el['speed']}</span>
          </div>
        </div>
      </div>
    );
  }


  render() {

    const { pokemon_id, title, back_shiny_sprite, front_shiny_sprite, height_pokemon, weight_pokemon, abilities, ref_types } = this.props;

    const abilities_data = this.taxonomies('Abilities', abilities);
    const types_data = this.taxonomies('Types', ref_types);

    const statsObj = Object.assign(
      { hp: this.props.hp },
      { attack: this.props.attack },
      { defense: this.props.defense },
      { special_attack: this.props.special_attack },
      { special_defense: this.props.special_defense },
      { speed: this.props.speed }
    ), stats = this.base_stats(statsObj);

    const outerclasses = (this.state.showfull ? 'full' : 'minimal') + ' pokemon clearfix';

    return (
      <div className={outerclasses}>
        <span className="api-source-graphql">GraphQL</span>
        <h4><a href="#" onClick={this.showInfo.bind(this)} >{title} <span>(click to expand)</span></a></h4>
        <div className="pokemon-container clearfix">

          <div className="row-three">
            <div className="row row-img">
              <div className="label">Images</div>
              <img src={front_shiny_sprite} />
              <img src={back_shiny_sprite} />
            </div>
          </div>

          <div className="row-three">
            <div className="row row-title">
              <div className="label">Title</div>
              <span>{title}</span>
            </div>
            <div className="row row-id">
              <div className="label">Pokemon ID</div>
              <span>{pokemon_id}</span>
            </div>
          </div>

          <div className="row-three">
            <div className="row">
              <div className="label">Height</div>
              <span>{height_pokemon}</span>
            </div>
            <div className="row">
              <div className="label">Weight</div>
              <span>{weight_pokemon}</span>
            </div>
          </div>

          <div className="row-clear clearfix">&nbsp;</div>

          <div className="row-three">
            <div className="row">
              {stats}
            </div>
          </div>

          <div className="row-three">
            <div className="row">{abilities_data} </div>
          </div>

          <div className="row-three">
            <div className="row">{types_data}</div>
          </div>

        </div>
      </div>
    )
  }
}

Pokemon.propTypes = {
  id: PropTypes.string.isRequired,
  nid: PropTypes.number.isRequired,
  pokemon_id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  back_shiny_sprite: PropTypes.string,
  front_shiny_sprite: PropTypes.string,
  height_pokemon: PropTypes.number,
  weight_pokemon: PropTypes.number,
  abilities: PropTypes.array,
  ref_types: PropTypes.array,
  hp: PropTypes.number,
  attack: PropTypes.number,
  defense: PropTypes.number,
  special_attack: PropTypes.number,
  special_defense: PropTypes.number,
  speed: PropTypes.number
}


export default Pokemon;

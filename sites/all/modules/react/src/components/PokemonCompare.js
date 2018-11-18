import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PokemonCompare extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showfull: false,
      dataset: this.props.dataset,
      compare_a: [],
      compare_b: [],
    }
    this.handleClickStats = this.handleClickStats.bind(this);
  }

  handleClickStats(event) {
    event.preventDefault();
    const data = this.state.dataset;
    const nid = event.target.getAttribute("data-nid");
    const group_option = event.target.getAttribute("data-option-group");
    let selectedPokemon = data.filter((data) => {
      return data.nid == nid;
    })
    return (group_option == 'a') ? this.setState({ compare_a: selectedPokemon }) : this.setState({ compare_b: selectedPokemon });
  }

  render() {

    const data = this.state.dataset;

    const pokemongroup_a = data.map((pokemon, i) => {
      const currentclass = ((this.state.compare_a[0] !== undefined) && (this.state.compare_a[0].nid == pokemon.nid)) ? 'active' : 'non';
      return (
        <img key={i} href="#" className={currentclass} onClick={this.handleClickStats} data-option-group="a" data-nid={pokemon.nid} src={pokemon.front_shiny_sprite} />
      )
    });

    const pokemongroup_b = data.map((pokemon, i) => {
      const currentclass = ((this.state.compare_b[0] !== undefined) && (this.state.compare_b[0].nid == pokemon.nid)) ? 'active' : 'non';
      return (
        <img key={i} href="#" className={currentclass} onClick={this.handleClickStats} data-option-group="b" data-nid={pokemon.nid} src={pokemon.front_shiny_sprite} />
      )
    });

    const displaystats = (el) => {
      let stats = el.map((pokemon, i) => {
        return (
          <div className="stats-items" data-nid={pokemon.nid} key={i}>
            <div className="title">{pokemon.title}</div>
            <div><span>HP</span> <span>{pokemon.hp}</span></div>
            <div><span>Attack</span> <span>{pokemon.attack}</span></div>
            <div><span>Defense</span> <span>{pokemon.defense}</span></div>
            <div><span>Special Attack</span> <span>{pokemon.special_attack}</span></div>
            <div><span>Special Defense</span> <span>{pokemon.special_defense}</span></div>
            <div><span>Speed</span> <span>{pokemon.speed}</span></div>
          </div>
        )
      });
      return stats;
    }

    const valueResults = (a, b, el) => {
      const option_a = a[0][el], option_b = b[0][el];
      if (option_a != option_b) {
        return (option_a > option_b) ? 'left' : 'right';
      } else {
        return 'middle';
      }
    }

    const comparingstats = (a, b) => {
      if ((a && b) === undefined) return;
      let obj = {
        hp: valueResults(a, b, 'hp'),
        attack: valueResults(a, b, 'attack'),
        defense: valueResults(a, b, 'defense'),
        special_attack: valueResults(a, b, 'special_attack'),
        special_defense: valueResults(a, b, 'special_defense'),
        speed: valueResults(a, b, 'speed'),
      }
      return obj;
    }

    const displayComparison = (el) => {
      if (el === undefined) return;
      let liftArray = [el];
      let stats = liftArray.map((el, i) => {
        return (
          <div className="comparing-results-row" data-nid={el.nid} key={i}>
            <div>&nbsp;</div>
            <div className={el.hp}>&nbsp;</div>
            <div className={el.attack}>&nbsp;</div>
            <div className={el.defense}>&nbsp;</div>
            <div className={el.special_attack}>&nbsp;</div>
            <div className={el.special_defense}>&nbsp;</div>
            <div className={el.speed}>&nbsp;</div>
          </div>
        )
      });
      return stats;
    }

    const compare_stats = (state) => {

      if (!state.compare_a.length || !state.compare_b.length) return;

      const a = state.compare_a;
      const b = state.compare_b;
      const displaystats_a = displaystats(a);
      const displaystats_b = displaystats(b);
      const compareResults = comparingstats(state.compare_a, state.compare_b);
      const compareRow = displayComparison(compareResults);

      if (displayComparison === undefined) return;

      if (a.length && b.length) {
        return (
          <div className="results-wrapper">
            <div className="leftside-group-a">
              {displaystats_a}
            </div>
            <div className="middleside-group">
              {compareRow}
            </div>
            <div className="leftside-group-b">
              {displaystats_b}
            </div>
          </div>
        )
      }
    };

    const displayStatsEl = compare_stats(this.state);

    return (
      <div>
        <div className="compare-pokemon clearfix">
          <div className="inside">
            <div className="option-rows option-a">
              <div className="label">Group A <span>(click image to select)</span></div>
              {pokemongroup_a}
            </div>
            <div className="option-rows option-b">
              <div className="label">Group B <span>(click image to select)</span></div>
              {pokemongroup_b}
            </div>
            <div className="comparing-stats-row clearfix">
              {displayStatsEl}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PokemonCompare.propTypes = {
  dataset: PropTypes.array.isRequired
}

export default PokemonCompare;

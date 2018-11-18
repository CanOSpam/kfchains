import React from 'react';
import {connect} from 'react-redux';
import GraphQLClientDrupalApp from '../components/GraphQLClientDrupalApp';

export class GraphQLClientDrupalPage extends React.Component {

  render() {
    return (
      <div className="boxy float-left clearfix">
        <GraphQLClientDrupalApp />
      </div>
    );
  }
}

export default connect()(GraphQLClientDrupalPage);

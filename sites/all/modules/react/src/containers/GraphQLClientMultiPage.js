import React from 'react';
import {connect} from 'react-redux';
import GraphQLClientMultiApp from '../components/GraphQLClientMultiApp';

export class GraphQLClientMultiPage extends React.Component {

  render() {
    return (
      <div className="boxy float-left clearfix">
        <GraphQLClientMultiApp />
      </div>
    );
  }
}

export default connect()(GraphQLClientMultiPage);

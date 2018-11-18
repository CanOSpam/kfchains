import React from 'react';
import {connect} from 'react-redux';
import DrupalCrudApp from '../components/DrupalCrudApp';

export class DrupalCrudPage extends React.Component {

  render() {
    return (
      <div className="boxy float-left clearfix">
        <DrupalCrudApp />
      </div>
    );
  }
}

export default connect()(DrupalCrudPage);

import React from 'react';
import {connect} from 'react-redux';
import APIDataFailoverApp from '../components/APIDataFailoverApp';

export class APIDataFailoverPage extends React.Component {

  render() {
    return (
      <div className="boxy float-left clearfix">
        <APIDataFailoverApp />
      </div>
    );
  }
}

export default connect()(APIDataFailoverPage);

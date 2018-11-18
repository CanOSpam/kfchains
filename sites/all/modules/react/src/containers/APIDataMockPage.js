import React from 'react';
import {connect} from 'react-redux';
import APIDataMockApp from '../components/APIDataMockApp';

export class APIDataMockPage extends React.Component {

  render() {
    return (
      <div className="boxy float-left clearfix">
        <APIDataMockApp />
      </div>
    );
  }
}

export default connect()(APIDataMockPage);

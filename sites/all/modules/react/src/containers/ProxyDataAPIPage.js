import React from 'react';
import {connect} from 'react-redux';
import ProxyDataAPIApp from '../components/ProxyDataAPIApp';

export class ProxyDataAPIPage extends React.Component {

  render() {
    return (
      <div className="boxy float-left clearfix">
        <ProxyDataAPIApp />
      </div>
    );
  }
}

export default connect()(ProxyDataAPIPage);

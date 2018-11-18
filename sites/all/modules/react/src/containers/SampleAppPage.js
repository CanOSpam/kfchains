import React from 'react';
import {connect} from 'react-redux';
import SampleApp from '../components/SampleApp';
import '../styles/sampleapp.scss';

export class SampleAppPage extends React.Component {

  render() {
    return (
        <SampleApp />
    );
  }
}

export default connect()(SampleAppPage);

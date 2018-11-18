import React from 'react';
import '../styles/proxydataapi.scss';

class ProxyDataAPIApp extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      marker: false
    };
  }

  handleChange(event) {
    let e = event.target.value;
    this.setState({
      marker: e,
    });
  }

  render() {
    return (
      <div>

        <h4>Using a JavaScript Application to proxy data into Drupal</h4>
        <p>
          <b>Story:</b> As a developer, I would like to proxy data from a non-Drupal API source and store this data within Drupal.
        </p>

        <ul>
          <li>Setup a common data schema as a single content types in Drupal using the Headless Lightning distro located at https://github.com/acquia-pso/javascript-ps-starter-headlessdrupal</li>
          <li>Identify another non-Drupal API services to mirror the topic of the Drupal content type.</li>
          <li>Using this React application, identify common workflows and cases to migrate selected data from a non-Drupal source back into Drupal thru an API.</li>
        </ul>


        {/* <form>
          <input type="text" placeholder="Search" value={this.state.filterText} onChange={this.handleChange} />
          <p>
            {this.state.postText ? 'Your selection is: ' + this.state.filterText : ''}
          </p>
        </form> */}
      </div>
    );
  }
}

export default ProxyDataAPIApp;

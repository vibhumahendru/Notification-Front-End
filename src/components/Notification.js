import React, { Component } from 'react';
import '../App.css';
import Moment from 'react-moment';

class Notification extends Component {
// this component is rendered for each individual notification.
  render() {
    return (
      <div className="notification-display">
        <text id="cross">X</text>
        <div >
        <strong><Moment fromNow>{this.props.notification.created_at}</Moment></strong>
        </div>
        <div>
          Type: {this.props.notification.category}
        </div>
        <div>
          {this.props.notification.message} <text className="workspace">View Task {'>'}</text>
        </div>

      </div>
    );
  }

}

export default Notification;

// src/components/NewConversationForm.js

import React from 'react';
import { API_ROOT, HEADERS } from '../constants';
import { ActionCable } from 'react-actioncable-provider';


class NewConversationForm extends React.Component {
  state = {
    title: ''
  };

  handleChange = e => {
    this.setState({ title: e.target.value });
  };

  handleSubmit = e => {
    
    e.preventDefault()
    fetch(`${API_ROOT}/conversations`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(this.state)
    });
    this.setState({ title: '' });
  };

  render = () => {
    return (
      <div className="newConversationForm">

        <form onSubmit={this.handleSubmit}>
          <label>New Conversation:</label>
          <br />
          <input
            placeholder="suup"
            type="text"
            value={this.state.title}
            onChange={this.handleChange}
          />
          <input type="submit" />
        </form>
      </div>
    );
  };
}

export default NewConversationForm;

// src/App.js

import React, { Component } from 'react';
// import './App.css'; <-- commented out for styling
// import ConversationsList from './components/ConversationsList';
import { API_WS_ROOT } from './constants';
import { API_ROOT } from './constants';
import { HEADERS } from './constants';
import { ActionCable } from 'react-actioncable-provider';

class App extends Component {

  state = {
    notifications: [],
    message:'',
    category: "Notification",
    reminders:[],
    assignedTasks: [],
    generalNotifications: []

  };

  componentDidMount = () => {
    // console.log(API_ROOT);
    fetch(`${API_ROOT}/notifications`)
      .then(res => res.json())
      .then((res)=>{
        this.setState({
          notifications: res
        })
        this.handleUnique()
      })
  };

  handleReceivedConversation = response => {

      this.setState({
        notifications: [...this.state.notifications, response.notification]
      })
      this.handleUnique()
    };

    handleMessageInput=(event)=>{
      this.setState({
        message: event.target.value
      })
    }

    handleCategorySelect=(event)=>{
      this.setState({
        category: event.target.value
      })
    }

    handleSubmit = e => {
    // e.preventDefault()
    fetch(`${API_ROOT}/notifications`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        category: this.state.category,
        message: "this is a test"
      })
    });
    this.setState({ message: '' });
  };

  handleUnique=()=>{
    const uniqueNotifications = [];
const map = new Map();
for (const item of this.state.notifications) {
    if(!map.has(item.id)){
        map.set(item.id, true);    // set any value to Map
        uniqueNotifications.push({
            id: item.id,
            category: item.category
        });
    }
}
    let reminders = uniqueNotifications.filter(el=> el.category == "Reminder")
    let generalNotifications = uniqueNotifications.filter(el=> el.category == "Notification")
    let assignedTasks = uniqueNotifications.filter(el=> el.category == "Assigned Task")
    this.setState({
      reminders: reminders,
      assignedTasks:assignedTasks,
      generalNotifications: generalNotifications,
      notifications: uniqueNotifications
    })
return uniqueNotifications
  }


  render() {
    console.log(this.state);
    return (

      <div className="App">
      <ActionCable
          channel={{ channel: 'NotificationsChannel' }}
          onReceived={this.handleReceivedConversation}
        />
        <input value={this.state.message} onChange={(event)=>this.handleMessageInput(event)} type="text"></input>
        <select onChange={(event)=>this.handleCategorySelect(event)}>
          <option value="Assigned Task">Assigned Task</option>
          <option value="Reminder">Reminder</option>
          <option selected value="Notification">Notification</option>
        </select>
        <button onClick={this.handleSubmit}>submit</button>
        <br></br>

        <div>
          <h1>Reminders : {this.state.reminders.length}</h1>
          <h1>Notifications : {this.state.generalNotifications.length}</h1>
          <h1>Assigned Tasks : {this.state.assignedTasks.length}</h1>
        </div>


      </div>


    );
  }
}

export default App;

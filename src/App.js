// src/App.js

import React, { Component } from 'react';
import './App.css';
// import ConversationsList from './components/ConversationsList';
import { API_WS_ROOT } from './constants';
import { API_ROOT } from './constants';
import { HEADERS } from './constants';
import { ActionCable } from 'react-actioncable-provider';
import Notification from './components/Notification';

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
        message: "This is some sample text."
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
            category: item.category,
            created_at: item.created_at,
            message:item.message
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

  handleDate=()=>{
    let newDate = new Date()
// let date = newDate.getDate();
// let month = newDate.getMonth() + 1;
// let year = newDate.getFullYear();
// let day = newDate.getDay()
let date = newDate.toString()
let dateAr = date.split(" ")

return dateAr[0] + " " + dateAr[1] + " " + dateAr[2]+", " + dateAr[3]
  }


  render() {
    console.log(this.handleDate());
    return (

      <div className="main-container">
      <ActionCable channel={{ channel: 'NotificationsChannel' }} onReceived={this.handleReceivedConversation}/>

        <div>
          <select onChange={(event)=>this.handleCategorySelect(event)}>
            <option value="Assigned Task">Assigned Task</option>
            <option value="Reminder">Reminder</option>
            <option selected value="Notification">Notification</option>
          </select>
          <button onClick={this.handleSubmit}>Create New Notification</button>
          <br></br>
        </div>
        <div className="dashboard">
          <div className="date-display">
          <p id="date-text">{this.handleDate()}</p>
          </div>
          <div className="counter-display">
            <text className="notif-number">{this.state.assignedTasks.length}</text>  <text>Assigned Tasks</text><br></br>
            <text className="notif-number">{this.state.reminders.length}</text>  <text>Reminders</text><br></br>
            <text className="notif-number">{this.state.generalNotifications.length}</text>  <text>Notifications</text>
            <br></br>
            <br></br>
            <text className="workspace">My Workspace{`>`}</text>
          </div>

          <div id="notification-info-column">
            {this.state.notifications.slice(this.state.notifications.length -10, this.state.notifications.length).reverse().map(eachNotification=> <Notification notification={eachNotification} /> )}
          </div>
        </div>
      </div>


    );
  }
}

export default App;

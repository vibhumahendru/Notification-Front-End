
import React, { Component } from 'react';
import './App.css';
import { API_WS_ROOT } from './constants';
import { API_ROOT } from './constants';
import { HEADERS } from './constants';
import { ActionCable } from 'react-actioncable-provider';
import Notification from './components/Notification';

class App extends Component {

  state = {
    notifications: [],
    category: "Notification", // type of notification to be created
    reminders:[],
    assignedTasks: [],
    generalNotifications: [],
    viewCategory: "notifications" // default category type to display notifications on dashboard
  };

// when component mounts, it fetches all previous notifications and saves them in state
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

// this function is triggered when new notification is recieved from server
  handleReceivedConversation = response => {
      this.setState({
        notifications: [...this.state.notifications, response.notification]
      })
      this.handleUnique()
    };

// this function selects the type of notification to be created
    handleCategorySelect=(event)=>{
      this.setState({
        category: event.target.value
      })
    }

// this function creates a new notification instance in the DB. After creation
// DB broadcasts the message back to front-end through channel.
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
  };

// I faced a glitch in the backend. When an instance of a notification
// was created, it would sometimes be broadcasted back through the channel more than one time.
// This function removes any duplicate notifications.
  handleUnique=()=>{
    const uniqueNotifications = [];
const map = new Map();
for (const item of this.state.notifications) {
    if(!map.has(item.id)){
        map.set(item.id, true);
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

// gets date into desired format
  handleDate=()=>{
    let newDate = new Date()
    let date = newDate.toString()
    let dateAr = date.split(" ")
    return dateAr[0] + " " + dateAr[1] + " " + dateAr[2]+", " + dateAr[3]
  }

// this function selects the type of notification the user wants to see on the dashboard
  handleSelectViewCategory=(category)=>{
    this.setState({
      viewCategory: category
    })
  }



  render() {
    console.log(this.state.reminders);
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
            <text className="notif-number">{this.state.assignedTasks.length}</text>  <text onClick={(category)=>this.handleSelectViewCategory("assignedTasks")}>Assigned Tasks</text><br></br>
            <text className="notif-number">{this.state.reminders.length}</text>  <text onClick={(category)=>this.handleSelectViewCategory("reminders")}>Reminders</text><br></br>
            <text className="notif-number">{this.state.generalNotifications.length}</text>  <text onClick={(category)=>this.handleSelectViewCategory("notifications")}>Notifications</text>
            <br></br>
            <br></br>
            <text className="workspace">My Workspace{`>`}</text>
          </div>

          <div id="notification-info-column">
          {this.state.viewCategory == "notifications"? this.state.generalNotifications.slice(this.state.generalNotifications.length -10, this.state.generalNotifications.length).reverse().map(eachNotification=> <Notification notification={eachNotification} /> ):null}
          {this.state.viewCategory == "reminders"? this.state.reminders.slice(this.state.reminders.length -10, this.state.reminders.length).reverse().map(eachNotification=> <Notification notification={eachNotification} /> ):null}
          {this.state.viewCategory == "assignedTasks"? this.state.assignedTasks.slice(this.state.assignedTasks.length -10, this.state.assignedTasks.length).reverse().map(eachNotification=> <Notification notification={eachNotification} /> ):null}

          </div>
        </div>
      </div>


    );
  }
}

export default App;

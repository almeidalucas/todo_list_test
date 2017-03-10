import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

const api = 'http://localhost:3001/tasks';

class App extends Component {
  constructor(props){
    super(props);

    this.state ={
      task: '',
      tasks: [],
      open: false,
      selectedTask: {},
      dateOrder: 'desc'
    }
  }

  _getTasks(){
      return axios.get(api).then((response) => {
        this.setState({tasks: response.data});
      });
  }

  _orderByDate(){
      let i, j, aux;
      if(this.state.dateOrder === 'desc'){
        for(i = 0; i < this.state.tasks.length; i++){
          aux = i;
          for(j = i; j < this.state.tasks.length; j++){
            let todayI = this.state.tasks[i].date.split("/");
            let ddI = parseInt(todayI[0],10);
            let mmI = parseInt(todayI[1],10);
            let yyyyI = parseInt(todayI[2],10);
            let todayJ = this.state.tasks[j].date.split("/");
            let ddJ = parseInt(todayJ[0],10);
            let mmJ = parseInt(todayJ[1],10);
            let yyyyJ = parseInt(todayJ[2],10);
            if(yyyyI > yyyyJ || (yyyyI === yyyyJ && mmI > mmJ) || (yyyyI === yyyyJ && mmI === mmJ && ddI > ddJ) ){
              aux = j;
              console.log(`${yyyyI} - ${yyyyJ}`);
            }

          }
          let aux2 = {id: '', task: '', status: '', date: ''};
          Object.assign(aux2, this.state.tasks[i]);

          Object.assign(this.state.tasks[i], this.state.tasks[aux]);
          Object.assign(this.state.tasks[aux], aux2);
        }
      } else {
        for(i = 0; i < this.state.tasks.length; i++){
          aux = i;
          for(j = i; j < this.state.tasks.length; j++){
            let todayI = this.state.tasks[i].date.split("/");
            let ddI = parseInt(todayI[0],10);
            let mmI = parseInt(todayI[1],10);
            let yyyyI = parseInt(todayI[2],10);
            let todayJ = this.state.tasks[j].date.split("/");
            let ddJ = parseInt(todayJ[0],10);
            let mmJ = parseInt(todayJ[1],10);
            let yyyyJ = parseInt(todayJ[2],10);
            if(yyyyI < yyyyJ || (yyyyI === yyyyJ && mmI < mmJ) || (yyyyI === yyyyJ && mmI === mmJ && ddI < ddJ) ){
              aux = j;
              console.log(`${yyyyI} - ${yyyyJ}`);
            }

          }
          let aux2 = {id: '', task: '', status: '', date: ''};
          Object.assign(aux2, this.state.tasks[i]);

          Object.assign(this.state.tasks[i], this.state.tasks[aux]);
          Object.assign(this.state.tasks[aux], aux2);
        }
      }
      
      this.setState({dateOrder: this.state.dateOrder === 'desc' ? 'asc' : 'desc'});    
  }

  _insertTask(task){
    return axios.post(api, task).then((response) => {
      this._getTasks();
    });
  }

  _updateTask(task){
    return axios.put(api, task).then((response) => {
      this._getTasks();
    });
  }

  _deleteTask(task){
    return axios({method: 'delete', url: api, data: task}).then((response) => {
      this._getTasks();
    });
  }

  componentDidMount() {
    this._getTasks();
  }

  render() {
    return (
      <div className="App" style={{display:'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',}}>
        <div className="App-header" style={{width: 400, marginBottom: 23, padding: 0,}}>
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React ToDo List</h2>
        </div>
        <div className="App-container" style={{width: 400, marginBottom: 23, display:'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start',}}>
          <div style={{width: 400, display:'flex', flexDirection: 'row', justifyContent: 'space-between',}}>
            <RaisedButton 
              onClick={(e) => {
                e.preventDefault();
                if(confirm('Add task?')){
                  let today = new Date();
                  let dd = ("0" + (today.getDate())).slice(-2);
                  let mm = ("0" + (today.getMonth() +　1)).slice(-2);
                  let yyyy = today.getFullYear();
                  this._insertTask({task: this.state.task, status: 'Pending', date: `${dd}/${mm}/${yyyy}`});
                }
              }}
              label="Add" />
            <input value={this.state.task}
              onChange={(e) => {
                this.setState({task: e.target.value});
              }} />
            <RaisedButton
              onClick={(e) => {
                e.preventDefault();
                this._orderByDate();
              }}
              label="Reorder" />
          </div>
          {
            this.state.tasks.map((item, index) => {
              return(
                <div key={index} style={{width: 400, display:'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',}}>
                <ListItem
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    if(item.status === 'Pending'){
                      this._updateTask({...item, status: 'Done'});
                    } else {
                      this._updateTask({...item, status: 'Pending'});
                    }
                  }}
                  style={{
                    width: 300,
                    color: item.status === 'Pending' ? '#FF0000' : '#228b22',
                    textDecoration: item.status === 'Pending' ? 'none' : 'line-through',
                  }}
                  primaryText={item.task}
                  secondaryText={item.status}
                  rightAvatar={<span style={{fontSize: 14, color: '#AAA'}}>{item.date}</span>}
                />
                
                <RaisedButton 
                  onClick={(e) => {
                    e.preventDefault();
                    if(confirm(`Delete ${item.task}?`)){
                      this._deleteTask(item);
                    }
                  }} label="Delete" />
                </div>)
            })
          }
        </div>
      </div>
    );
  }
}

export default App;

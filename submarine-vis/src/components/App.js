import React, { Component } from 'react';
import { Donut } from './Donut.react';
import { Submarine, Probe } from './Submarine.react';
import StatsTable from './StatsTable.react';
import SubmarineAppBar from './SubmarineAppBar.react';
import '../assets/css/App.css';


class App extends Component {
  constructor() {
    super();
    window.app = this;
    window.connect = () =>{
      window.app.ws = new WebSocket('ws://localhost:8000');
      window.app.ws.onmessage = (e)=>{window.app.handleData(e.data);};
      window.app.ws.onclose = ()=>{setTimeout(function() {window.connect();}, 1000) };
    }
    window.connect();
    this.state = {
      redRegion: 5,
      position: 0,
      isSafetyConditionAchieved: true,
      submarineRegion: 'yellow',
      trenchAlert: 'red',
      probes: [],
      gameStates: [],
      interval: undefined,
    };
  }

  componentDidMount() {
    this.setState({
        interval: setInterval(() => {
          const gameState = this.state.gameStates.shift();
          if (gameState !== undefined) {
            this.setState({
              redRegion: gameState.red_region,
              position: gameState.position,
              isSafetyConditionAchieved: gameState.is_safety_condition_achieved,
              submarineRegion: gameState.submarine_region,
              trenchAlert: gameState.trench_alert,
              probes: gameState.probes,
            });
          }
        }, 200)
    });
  }

  componentWillUnmount() {
    if (this.state.interval !== undefined) {
      clearInterval(this.state.interval);
    }
  }

  handleData(data) {
    const gameState = JSON.parse(data);
    const { gameStates } = this.state;
    gameStates.push(gameState);
    this.setState({gameStates});
  }

  render() {
    return (
      <div>
        <SubmarineAppBar/>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <Donut start={this.state.redRegion}/>
          <Submarine pos={this.state.position}/>
          {this.state.probes.map(position => <Probe pos={position}/>)}
          <StatsTable {...this.state}/>


        </div>
      </div>
    );
  }
}

export default App;

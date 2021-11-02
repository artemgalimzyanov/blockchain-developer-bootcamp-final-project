import React, { Component, useState} from 'react';
import StepCoinContract from "./contracts/StepCoin.json";
import Web3 from 'web3'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      isEnroll: false,
      currentBalance: 0,
      count: 0
     };
  }
  
  componentDidMount() {
    this.loadBlockchainData();
    this.Enroll();
  
  }



  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = StepCoinContract.networks[networkId];
    const StepCoin = new web3.eth.Contract(
        StepCoinContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
    this.setState({ StepCoin});

    // read enroll or not
    var checkEnrollStatus = await StepCoin.methods.enrolled(accounts[0]).call({from: accounts[0]});
    console.log(checkEnrollStatus);
    this.setState({isEnroll: checkEnrollStatus});  
 
    
    //read balance
    var currentBalance = await StepCoin.methods.balances(accounts[0]).call({from: accounts[0]});
    console.log(currentBalance);
    this.setState({currentBalance});

    //var doEnroll = await StepCoin.methods.enroll().send({ from: accounts[0]});
  }

  async Enroll(){
    console.log("you did press me");
    //var ee = await StepCoin.methods.enroll().send({ from: accounts[0] });
    //console.log(ee);
  }





  render() {
    return (
      <div className="container">
        <h1>Step Coin dApp (beta)</h1>
        <p>Your account address: {String(this.state.account).substring(0,6)+ "..."+ String(this.state.account).substring(38)}</p>
        <p>Your enrollment status: {this.state.isEnroll}</p>
        <p>Your balance: {this.state.currentBalance}</p>
          <div id="content">
          <button onClick={this.doEnroll} >Enroll</button> 
          <br></br>
          <p>you click {this.state.count} times</p>
          <button onClick={() => this.setState({count: this.state.count + 1})}>Count</button> 
            <form>
              
              <input id="claimSteps" type="number" placeholder="put your steps" required />
                
              <button id="step-input-button" hidden="" >Submit Your Steps</button>         
            </form>
         </div>
      </div>
      
      

    );
  }
}
export default App;
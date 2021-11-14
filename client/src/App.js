import React, { Component, useState} from 'react';
import {useEffect} from 'react';
import StepCoinABI from "./contracts/StepCoin.json";


import Web3 from 'web3'
import './App.css'
import { Text, Button, Box, Flex, Form, Input, Heading, Field, Select, ToastMessage, Blockie} from 'rimble-ui';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      contract: 'underfined',
      currentBalance: 0,
      idForInfo: 1,
      userSteps: 0,
      awardCount: 0,
      newAwardName: "",
      newAwardPrice: 0,
      loading: true,
      newPurchaseId: 1,
      newUsedId: 1,
      MM: false
     
     }

  }
  
  async componentWillMount() {
      
      try {

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }

  }


  handleUserConnecttoMM = async (event) => {
      // console.log("I am clicking");
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      
      
      const networkID = await window.web3.eth.net.getId();
      if (networkID != 3){
        window.alert('Please connect to the Ropsten test net')
      }
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      
    }
    else{
      window.alert('Please install MetaMask wallet (metamask.io)')
    }

    this.state.MM = true;
    
    this.loadBlockchain();
   
  }
    
  loadBlockchain = async () =>{
      // Get network provider and web3 instance.
        const web3 = window.web3;

        // Get the contract instance.
        // const networkId = await web3.eth.net.getId();
        // const deployedNetwork = StepCoinContract.networks[networkId];
        // const StepCoin = new web3.eth.Contract(
        //    StepCoinContract.abi,
        //   deployedNetwork && deployedNetwork.address,
        //   );
      
        const StepCoin = new web3.eth.Contract(StepCoinABI.abi, StepCoinABI.networks[3].address);
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get state variables
        const _account = web3.utils.toChecksumAddress(accounts[0]);
        const _balance = await StepCoin.methods.balances(accounts[0]).call({from: accounts[0]});
  
        // Set web3, accounts, and contract to the state
        this.setState({
          web3: web3,
          account: _account,
          contract: StepCoin,
          balance: _balance,
          awardlist: [],
          
        });
        
        this.refreshUserBalance();
  }


  setStatus = (message) => {
    document.getElementById("status").innerHTML = message;
  }

  refreshUserBalance = async () => {
    //show metamask account and current balance
    document.getElementsByClassName("user")[0].innerHTML = String(this.state.account).substring(0,6)+"..."+ String(this.state.account).substring(38);
  
    const balance = await this.state.contract.methods.balances(this.state.account).call();
    document.getElementsByClassName("balance")[0].innerHTML = balance;
    
    //show awards owned by user 
    this.getAllAwardsFromUser(this.state.account);
    
    //show options to buy and for info
    this.getAllProductsForSale();
  }

  getAllAwardsFromUser = async () => { 
    const list = await this.state.contract.methods.checkmyAwards().call({from: this.state.account});
 
    this.setState({awardlist: list });
    if (list.length === 0) {
      document.getElementById("products").innerHTML = "You don't own any awards yet. Go for run and redeem your steps for your first one!";

    } else {
      document.getElementById("products").innerHTML = list;
    }
  }

   getAllProductsForSale = async () => { 
     const _awardCount =  await this.state.contract.methods.awardCount().call();
    
     this.setState({awardCount: _awardCount});
  
   }



  handleSetUserStepDeposit = async (event) => {
    
    if (typeof this.state.contract !== 'undefined') {
      event.preventDefault();
      await this.state.contract.methods.depositSteps(this.state.userSteps).send({from: this.state.account})
    }
    this.setStatus("Initiating transaction... (please wait)");
    window.toastProvider.addMessage("Steps are depositing", {
      variant: "success"
    })
    this.setStatus("Transaction complete!");
    this.refreshUserBalance();
  }

  handleCreateAward = async (event) => {
    
    if (typeof this.state.contract !== 'undefined') {
      event.preventDefault();
      await this.state.contract.methods.addAward(this.state.newAwardName,this.state.newAwardPrice).send({from: this.state.account})
    }
    this.setStatus("Initiating transaction... (please wait)");
    window.toastProvider.addMessage("Award Created!", {
      variant: "success"
    })
    this.setStatus("Transaction complete!");
    this.refreshUserBalance();
  }

  handleBuyProduct = async (event) => {
    
    if (typeof this.state.contract !== 'undefined') {
      event.preventDefault();
      const productInfo = await this.state.contract.methods.fetchAward(this.state.newPurchaseId-1).call();
      const balance = await this.state.contract.methods.balances(this.state.account).call();
       
      if (productInfo[3] !=0 || productInfo[2]>balance){
          window.toastProvider.addMessage("Sorry! Award sold or not enough balance", {
          variant: "failure"
        })
        this.setStatus("Transaction declined!");
        this.refreshUserBalance(); 
      }
      await this.state.contract.methods.buyAward(this.state.newPurchaseId-1).send({from: this.state.account});
    }
    this.setStatus("Initiating transaction... (please wait)");
    window.toastProvider.addMessage("Congrats! You just bought new award!", {
      variant: "success"
    })
    this.setStatus("Transaction complete!");
    this.refreshUserBalance();
  }


  handleUseProduct = async (event) => {
    
    if (typeof this.state.contract !== 'undefined') {
      event.preventDefault();
      const productInfo = await this.state.contract.methods.fetchAward(this.state.newUsedId-1).call();

    if (productInfo[4] != this.state.account){
        window.toastProvider.addMessage("Sorry! You are not a seller", {
        variant: "failure"
      })
      this.setStatus("Transaction declined!");
      this.refreshUserBalance(); 
    }

      await this.state.contract.methods.useAward(this.state.newUsedId-1).send({from: this.state.account});
    }
    this.setStatus("Initiating transaction... (please wait)");
    window.toastProvider.addMessage("Congrats! You just used your award!", {
      variant: "success"
    })
    this.setStatus("Transaction complete!");
    this.refreshUserBalance();
  }

  getProductInfo = async () => { 
    document.getElementById("productInfo").style.display = 'block';
    try {

      //get award name
      const productInfo = await this.state.contract.methods.fetchAward(this.state.idForInfo-1).call();
      document.getElementById("_name").innerHTML = productInfo[0];
      
      // check award status: new  - for sale - sold
      if (productInfo[3]==0 ){
        document.getElementById("_forSale").innerHTML = "For Sale";
      }
      if (productInfo[3]==1){
        document.getElementById("_forSale").innerHTML = "Sold";
      }  
      if (productInfo[3]==2){
        document.getElementById("_forSale").innerHTML = "Used";
      } 
      
      //get award price
      document.getElementById("_price").innerHTML = productInfo[2];
      } catch (error) {
        document.getElementById("productInfo").innerHTML = "This product doesn't exist";
      }
  }
 
 // Handle form data change
 handleChange = (event) => {
  switch(event.target.name) {
      case "userSteps":
          this.setState({"userSteps": event.target.value})
          break;
      case "newAwardName":
          this.setState({"newAwardName": event.target.value})
          break;
      case "newAwardPrice":
          this.setState({"newAwardPrice": event.target.value})
          break;

      case "newPurchaseId":
          this.setState({"newPurchaseId": event.target.value})
          break;

      case "newUsedId":
          this.setState({"newUsedId": event.target.value})
          break;
 
      case "idForInfo":
          this.setState({"idForInfo": event.target.value}, () => {
          this.getProductInfo()
             });
          break;

      default:
          break;
  }
}


  render() {
    return (
      <div>
        <Box bg="#D3D3D3" border='3px solid' borderColor="DarkGrey">
        <br/>
        <Heading as={"h1"}> Step Coin dApp  (beta version - only Ropsten testnet)</Heading>
        <Text fontWeight='bold'> Move and Earn </Text>
        <Text fontWeight='light'> This dApp motivates you to go out for a walk and earn StepCoin. You can redeem your StepCoin for awards.</Text>

        <br/>
        </Box>
        
      <Box>
          <Text italic> <p id="status"></p> </Text>
      </Box>

      <div id="store">
        <Flex fontSize={1} textAlign='left'>
          <Box width={1 / 20}></Box>
          <Box id="blockie" width={1 / 20}>
            
          </Box>
          <Box width={1 / 20}></Box>
          <Box width={1 / 5}>
              Hey, <strong className="user">loading...</strong> <br/>
              Your Step coin balance is  <strong className="balance">loading...</strong> <br/>
              Your Awards: <strong id="products">loading...</strong> <br/>
             
          <Button size="medium" mainColor="#B26200" value="submit" onClick={this.handleUserConnecttoMM}>{this.state.MM ? "Connected" : "Connect your wallet"}</Button>
          

          </Box>
          <Box width={1 / 5}></Box>
          <Box>
            <Field label="How many steps you run? Submit them and get StepCoin">
            <Input type="number" placeholder="1000" required={true} name="userSteps" value={this.state.userSteps} onChange={this.handleChange} />
            </Field>
            <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
            <Button size="small" mainColor="Black" value="submit" onClick={this.handleSetUserStepDeposit}>Submit Your Steps</Button>
          </Box>

          <Box width={1 / 20}></Box>
          <Box width={1 / 5}>
            
          <Field label="Check info on Award:"> 
          
            <Select type="number" min="1" max={this.state.awardCount} name="idForInfo" placeholder="e.g. 10" required={true} onChange={this.handleChange} />
          </Field>
          </Box>
          <Box width={1 / 20}></Box>
          <Box width={1 / 20}></Box>
          <Box width={1 / 5}>
            <p id="productInfo">
              Award name: <strong id="_name">loading...</strong> <br/>
              Status <strong id="_forSale">loading...</strong> <br/>
              Award's price: <strong id="_price">loading...</strong> <br/>
              
            </p>
          </Box>
          </Flex>

          <br/><br/>
          <Flex fontSize={1}>
          <Box width={1 / 40}></Box>
            <Box bg="#D3D3D3" p={3} width={1 / 3} border='3px solid' borderColor="DarkGrey"> 
              <Heading> Create a new award  (only for Seller)</Heading>
                <Form>
                  <Box>
                    <Field label="Enter your award name:">
                      <Input type="text" placeholder="Name of award" required={true} name="newAwardName" value={this.state.newAwardName} onChange={this.handleChange}/>
                    </Field>
                  </Box>

                  <Box>
                  <Field label="Enter price">
                  <Select required={true} name="newAwardPrice" value={this.state.newAwardPrice} onChange={this.handleChange}/>
                  </Field>
                  </Box>

                  <Box>
                    <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
                    <Button size="medium" mainColor="black" value="submit" onClick={this.handleCreateAward}>Add New Award</Button>
                  </Box>
                </Form>
            </Box>
            <Box width={1 / 40}></Box>

            
    
            <Box bg="#D3D3D3" border='3px solid' borderColor="Black" p={3} width={1 / 3}>
              <Heading> Redeem your StepCoin on Award </Heading>
                <Form>
                <Box>
                  <Field label="Choose the award you want to buy">
                  <Select type="number" min="1" max={this.state.awardCount} required={true} name="newPurchaseId" value={this.state.newPurchaseId} onChange={this.handleChange} />
                  </Field>
                  </Box>

                  <Box>
                    <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
                    <Button size="medium" mainColor="black" value="submit" onClick={this.handleBuyProduct}>Buy Award</Button>
                  </Box>
                </Form>
            </Box>
            <Box width={1 / 40}></Box>

            <Box bg="#D3D3D3" border='3px solid' borderColor="DarkGrey" p={3} width={1 / 3}>
              <Heading> Consume Award (only for Seller)</Heading>
                <Form>
                <Box>
                  <Field label="Choose the award you want to consume">
                  <Select type="number" min="1" max={this.state.awardCount} required={true} name="newUsedId" value={this.state.newUsedId} onChange={this.handleChange} />
                  </Field>
                  </Box>

                  <Box>
                    <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
                    <Button size="medium" mainColor="black" value="submit" onClick={this.handleUseProduct}>Use Award</Button>
                  </Box>
                </Form>
            </Box>
            <Box width={1 / 40}></Box>
          </Flex>
      </div>

      </div>
      
      

    );
  }
}
export default App;
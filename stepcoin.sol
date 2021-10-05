// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

contract StepCoin {

  // state variables
  address public owner = msg.sender;
  uint public awardCount;

  // enrollment to the StepCoin
  mapping (address => bool) public enrolled;
  // keep clients balances of stepcoints
  mapping (address => uint) internal balances;
  // mapping all awards from shops
  mapping (uint256 => Award) public awards;

  // enum states of award: New, Redeemed, Used
  enum State {
    New,
    Redeemed,
    Used
  }

  // struct Award
  struct Award {
    string name;
    uint count;
    uint price;
    State state;
    address payable seller;
    address payable buyer;
  }

  // Events
  event LogEnrolled(address accountAddress);
  event LogBalance(address accountAddress, uint amount);
  event LogRedeem(address accountAddress, uint redeemAmount, uint newBalance);

// function to enroll to the system
  function enroll() public returns(bool){
    enrolled[msg.sender] = true;
    emit LogEnrolled(msg.sender);
    return enrolled[msg.sender];
  }

// fuction to deposit steps into coins
// maybe deposit should take steps from user and convert to coint??
  function depositSteps() public payable returns (uint) {
    require(enrolled[msg.sender]== true);
    balances[msg.sender] +=msg.value;
    emit LogBalance(msg.sender, balances[msg.sender]);
    return balances[msg.sender];
  }

// function to check balance of coins
  function checkBalance() public view returns(uint){
    return balances[msg.sender];
  }

// function to add Award to the site
  function addAward(string memory _name, uint _price) public returns(bool){
    awards[awardCount] = Award({
      name: _name,
      count: awardCount,
      price: _price,
      state: State.New,
      seller: msg.sender,
      buyer: address(0)
    });
    awardCount = awardCount +1;
    return true;
  }

// function to redeem stepcoin and get Award
// maybe need to add some modifier like Award is New and Buyer has enough coins to redeem
  function getAward(uint _awardCount) payable public {
    awards[_awardCount].buyer = msg.sender;
    awards[_awardCount].state = State.Redeemed;
    awards[_awardCount].seller.transfer(awards[_awardCount].price);
    uint newBalance = balances[msg.sender]-awards[_awardCount].price;
    emit LogRedeem(awards[_awardCount].buyer, awards[_awardCount].price, newBalance);
  } 

// function to use Award
  function useAward(uint _awardCount) payable public{
    awards[_awardCount].state = State.Used;
  }
}

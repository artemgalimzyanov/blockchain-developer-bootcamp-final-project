// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Contract StepCoin allows to convert your steps into coins and get award
/// @author Artem Galimzyanov
/// @notice Allows a user to convert steps into coins and  get award


contract StepCoin is Ownable {

/// @dev state variables
  uint public awardCount;
  bool public paused = false;

/// @dev declare modifiers
modifier whenNotPaused () {
    require (!paused);
    _;
  }

modifier whenPaused () {
    require (paused);
    _;
  }

modifier paidEnough(uint _i) {
    require(balances[msg.sender]>= awards[_i].price, "Not enough Stepcoins");
    _;
  }
  
modifier forSale(uint _i) {
    require(awards[_i].state == State.New && awards[_i].seller != address(0));
    _;
  }
modifier Redeemed(uint _i) {
    require(awards[_i].state == State.Redeemed && awards[_i].seller != address(0));
    _;
  }

  /// @dev create mappling of clients balances of stepcoints
  mapping (address => uint) public balances;
  /// @dev create mapping of all awards from sellers
  mapping (uint256 => Award) public awards;
  /// @dev create mapping of awards per user
  mapping (address => string[]) public  List;

  /// @notice define enum states of award: New, Redeemed, Used
  enum State {
    New,
    Redeemed,
    Used
  }

  /// @notice define a struct Award
  struct Award {
    string name;
    uint count;
    uint price;
    State state;
    address payable seller;
    address payable buyer;
  }

  ///@notice define Events
  event LogBalance(address accountAddress, uint amount);
  event LogRedeem(address accountAddress, uint redeemAmount, uint newBalance);
  event Pause();
  event Unpause();

  constructor() public {
  
  }

/// @notice function to deposit steps and get Stepcoins
  function depositSteps(uint step) public payable whenNotPaused returns (uint) {
    
    balances[msg.sender] += step;
    emit LogBalance(msg.sender, balances[msg.sender]);
    return balances[msg.sender];
  }

/// @notice function to check availabe awards of specific user
  function checkmyAwards() public view returns(string[] memory){
    return List[msg.sender];
  }

/// @notice function to add Award to the dApp
  function addAward(string memory _name, uint _price) public whenNotPaused returns(bool){
    awards[awardCount] = Award({
      name: _name,
      count: awardCount,
      price: _price,
      state: State.New,
      seller: payable (msg.sender),
      buyer: payable ( address(0))
    });
    
    awardCount = awardCount +1;
    return true;
  }

/// @notice function to buy Award with StepCoins  
function buyAward(uint _i)  public payable forSale(_i)  paidEnough(_i) whenNotPaused returns (uint){
    awards[_i].buyer = payable (msg.sender);
    awards[_i].state = State.Redeemed;
    balances[msg.sender] -= awards[_i].price;
    List[msg.sender].push(awards[_i].name);
    emit LogRedeem(awards[_i].buyer, awards[_i].price, balances[msg.sender]);
    return balances[msg.sender];
}

/// @notice function to use Award
/// @dev only seller can change status of award from redeemed to used
  function useAward(uint _i) public payable whenNotPaused Redeemed(_i) returns(bool){
    require (awards[_i].seller == msg.sender, "You are not a seller");
    awards[_i].state = State.Used;
    return true;
  }

/// @notice function to pause a contract
  function pause() public onlyOwner whenNotPaused returns(bool){
    paused = true;
    emit Pause();
    return true;
  }

/// @notice function to unpause a contract
  function unpause() public onlyOwner whenPaused {
    paused = false;
    emit Unpause();
  }

/// @notice function to get info about any award
  function fetchAward(uint _i) public view 
    returns (string memory name, uint count, uint price, uint state, address seller, address buyer) 
  {
    name = awards[_i].name;
    count = awards[_i].count;
    price = awards[_i].price;
    state = uint(awards[_i].state);
    seller = awards[_i].seller;
    buyer = awards[_i].buyer;
    return (name, count, price, state, seller, buyer);
  }

}
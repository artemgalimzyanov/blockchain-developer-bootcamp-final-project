const StepCoin = artifacts.require("StepCoin");
//const truffleAssert = require('truffle-assertions');

contract("StepCoin", function (accounts) {
  const [owner, alice, bob] = accounts;


  const step = "2000";
  const price = "1000";
  const name = "iphone";

  let instance;

  beforeEach(async () => {
    instance = await StepCoin.new();
  });

// 1 check that the contract inherits Ownable from Open Zeppelin library
it ("should make first account as owner", async () =>{
  _owner = await instance.owner();
  assert.equal(_owner, owner, 'This is no owner');
});

// // 2 alice should NOT be enroll to the program
// it ("alice should NOT be enrolled to the program", async () =>{
  
//   enroll = await instance.enrolled(alice);
//   assert.equal(enroll, false, 'She is enrolled');
// });
  
// 2 bob should add the award
it ("bob should add the award", async () =>{
  
  await instance.addAward(name, price, { from: bob });
  const result = await instance.fetchAward.call(0);
  
  assert.equal(result[0], name, "the name of the added Award does not match the expected name",);
  assert.equal(result[2].toString(10), price, "the price of the  added Award does not match the expected value",
  );

});

// // 4 alice should enroll to the Program
// it ("alice should BE enrolled to the program NOW", async () =>{
//   await instance.enroll({from: alice});
//   enrollAlice = await instance.enrolled(alice);
//   assert.equal(enrollAlice, true, 'She DOES NOT enrolled');
// });


// 3 alice should deposit steps and get coins
it ("alice should  deposit Steps to the program NOW", async () =>{
 
  await instance.depositSteps(step, {from: alice});
  const result = await instance.balances(alice);
  assert.equal(result, step, 'She DOES NOT deposit right Steps');
});

// 4 alice should buy the Award
it ("alice should buy the Award", async () =>{
  
  await instance.depositSteps(step, {from: alice});
  await instance.addAward(name, price, { from: bob });
  await instance.buyAward(0, { from: alice });

  const result = await instance.fetchAward.call(0);
  assert.equal(result[3], 1, "the status of  Award does not match the sold",);
  assert.equal(result[5], alice, 'She DOES NOT buy the award');
});

// 5. bob cannot buy award which alice just bought
it ("bob should NOT buy the Award which just was sold to alice", async () =>{
  
  await instance.depositSteps(step, {from: alice});
  await instance.addAward(name, price, { from: bob });
  await instance.buyAward(0, { from: alice });

  try{
    await instance.buyAward(0, { from: bob });
  }
  catch(e){
    return e;
  }
 
});

// 6. bob can check award as used
it ("bob as seller should check the Award as used", async () =>{
  
  await instance.depositSteps(step, {from: alice});
  await instance.addAward(name, price, { from: bob });
  await instance.buyAward(0, { from: alice });
  await instance.useAward(0, { from: bob });

  const result = await instance.fetchAward.call(0);
  assert.equal(result[3], 2, "the status of  Award does not match the sold",);
  
});

// 7 emit event
it("should emit a Pause event when contract is paused by Owner", async () => {
  let eventEmitted = false;
  const tx = await instance.pause( { from: owner });

  if (tx.logs[0].event == "Pause") {
    eventEmitted = true;
  }

  assert.equal(
    eventEmitted,
    true,
    "making a pause of contract event should emit",
  );
});

});

var StepCoin = artifacts.require("./StepCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(StepCoin);
};

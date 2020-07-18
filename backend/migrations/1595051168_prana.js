const prana = artifacts.require("prana.sol");
module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(prana);
};

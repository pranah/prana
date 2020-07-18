const prana = artifacts.require("prana.sol");
module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(prana);
};

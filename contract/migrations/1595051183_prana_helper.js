const pranaHelper = artifacts.require("pranaHelper.sol");
module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(pranaHelper);
};

const pranaHelper = artifacts.require("pranaHelper.sol");
module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(pranaHelper);
};

// const pranaHelper = artifacts.require("pranaHelper.sol");
// module.exports = function(deployer) {
//   // Use deployer to state migration tasks.
//   // deployer.deploy(pranaHelper);
//   deployer.deploy(PranaInterface).then( ()=> deployer.deploy(pranaHelper) );
// };


const PranaInterface = artifacts.require("PranaInterface");
const pranaHelper = artifacts.require("pranaHelper");

module.exports = function(deployer) {
  deployer.deploy(PranaInterface);
  deployer.deploy(pranaHelper);
};
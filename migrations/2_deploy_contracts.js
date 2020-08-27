const BettingFactory = artifacts.require("BettingFactory");

module.exports = function (deployer) {
  deployer.deploy(BettingFactory);
};

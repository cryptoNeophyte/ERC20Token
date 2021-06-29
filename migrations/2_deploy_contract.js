const Crypto = artifacts.require("Crypto");  // in our case artifacts is the directory client/src/contracts (which contains json files of all the contract after compiling)
// Crypto is the name of contract which inherits properties of ERC20Interface

const addr = '0x3Da2AFa10Ce6c1c4ccC001d025Cba19f372F2e1d';
module.exports = function (deployer) {
  deployer.deploy(Crypto, addr);
};

// in constructor Crypto takes one parameter which is address
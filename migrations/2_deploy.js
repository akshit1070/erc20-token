const mytoken = artifacts.require("mytoken");
const mytokensale = artifacts.require("mytokensale");

module.exports = function (deployer) {
  deployer.deploy(mytoken,1000000)
     var tokenprice=1000000000000000;//wei 0.01ether
  deployer.deploy(mytokensale,mytoken.address,tokenprice);

  
};

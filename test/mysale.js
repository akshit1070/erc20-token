
var mytokensale= artifacts.require("mytokensale");
var mytoken=artifacts.require("mytoken");
contract('mytoken sale',function(accounts){
var tokensaleinstance;
var tokeninstance;
var tokenprice=1000000000000000;//wei
var buyer =accounts[1];
var number;
var admin=accounts[0];
var tokenav=750000;
it('verifying the value',function(){

    return mytokensale.deployed().then(function(instance){
        tokensaleinstance=instance;
        return tokensaleinstance.address
    }).then(function(address){
        assert.notEqual(address,0x0,'has address');
        return tokensaleinstance.tokenprice();
    }).then(function(price){
        assert.equal(price,tokenprice,'token price is correct');
    })
})
it('buying a token',function(){
    return mytoken.deployed().then(function(instance){
        //grab token instance first
        tokeninstance=instance;
    return mytokensale.deployed()
}).then(function(instance){
    //grab tokensale instance
        tokensaleinstance=instance;
        //75% token to sale
        return tokeninstance.transfer(tokensaleinstance.address,tokenav,{from:admin});
}).then(function(reciept){
        number=10;
        return tokensaleinstance.buytoken(number,{from:buyer , value:number*tokenprice});
    }).then(function(reciept){
        assert.equal(reciept.logs.length,1,'event trigger');
        assert.equal(reciept.logs[0].event,'Sell','Sell event');
        assert.equal(reciept.logs[0].args._buyer,buyer,'buyer who buying the tokens');
        assert.equal(reciept.logs[0].args._amount,number,'token number');
        return tokensaleinstance.tokensold();
    }).then(function(amount){
        assert.equal(amount.toNumber(),number,'number of token sold');
        return tokeninstance.balanceof(buyer);
    }).then(function(balance){
      assert.equal(balance.toNumber(),number,'tranfered');

        return tokeninstance.balanceof(tokensaleinstance.address);
    }).then(function(balance){
        assert.equal(balance.toNumber(),tokenav-number,'token withdraw');
        //buy with less value
        return tokensaleinstance.buytoken(number,{from:buyer , value: 1});
    }).then(assert.error).catch(function(error){
        assert(error.message.indexOf('revert')>=0,'error message contain revert');
        return tokensaleinstance.buytoken(800000,{from:buyer , value:number*tokenprice});
    }).then(assert.error).catch(function(error){
        assert(error.message.indexOf('revert')>=0,'cannot purchase more token than avai');

    })
})

it('ending a token sale',function(){
    return mytoken.deployed().then(function(instance){
        tokeninstance=instance;
    return mytokensale.deployed();
}).then(function(instance){
        tokensaleinstance=instance;
   //end sale by not admin
   return tokensaleinstance.endsale({from:buyer});
}).then(assert.fail).catch(function(error){
    assert(error.message.indexOf('revert'>=0,'must be admin to end sale'));
  //end sale by admin
  return tokensaleinstance.endsale({from: admin});
}).then(function(reciept){
//     return tokeninstance.balanceof(admin);
//  }).then(function(balance){
//    // assert.equal(balance.toNumber(),999990,'returns all unsold tokens');
return tokensaleinstance.tokenprice();
}).then(function(price){
    assert.equal(price.toNumber(),0,'RESET');
})

})

})


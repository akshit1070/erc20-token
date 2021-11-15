var mytoken=artifacts.require("mytoken");
var tokeninstance;
contract('mytoken',function(accounts){
    it('tokenconfig',function(){
        return mytoken.deployed().then(function(instance){
            tokeninstance=instance;
            return tokeninstance.name();
        }).then(function(name){
            assert.equal(name,'mytoken','correct');
            return tokeninstance.symbol();
        }).then(function(symbol){  
            assert.equal(symbol,'mym','corrrect');
            return tokeninstance.standard();
        }).then(function(standard){
            assert.equal(standard,'mym v1','correct');
        });
    })

    // it('set the total supply',function(){
    //     return mytoken.deployed().then(function(instance){
    //         tokeninstance=instance;
    //         return tokeninstance.totalSupply();
    //     }).then(function(totalSupply){
    //     assert.equal(totalSupply().toNumber(),1000000,'set');
    //     })
    // });

    it('validate token tranfer',function(){
        return mytoken.deployed().then(function(instance){
            tokeninstance=instance;
            return tokeninstance.transfer.call(accounts[1],99999999999,{from:accounts[0]});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,'error message contain revert');
            return tokeninstance.transfer.call(accounts[1],25000,{from:accounts[0]});
        }).then(function(sucess){
            assert.equal(sucess,true,'it returns true');
            return tokeninstance.transfer(accounts[1],250000,{from:accounts[0]});
        }).then(function(reciept){
            assert.equal(reciept.logs.length,1,'event trigger');
            assert.equal(reciept.logs[0].event,'Transfer','Transfer event');
            assert.equal(reciept.logs[0].args._from,accounts[0],'from');
            assert.equal(reciept.logs[0].args._to,accounts[1],'to account');
            assert.equal(reciept.logs[0].args._value,250000,'value');
            return tokeninstance.balanceof(accounts[1]);
        }).then(function(deposit){
            assert.equal(deposit.toNumber(),250000,'deposited');
            return tokeninstance.balanceof(accounts[0]);
        }).then(function(withdraw){
            assert.equal(withdraw.toNumber(),750000,'withdraw');
        })
    })
    
    it('approve tokens',function(){
        return mytoken.deployed().then(function(instance){
            tokeninstance=instance;
            return tokeninstance.approve.call(accounts[1],100);
        }).then(function(success){
           assert.equal(success,true,'returns true')
           return tokeninstance.approve(accounts[1],100,{from : accounts[0]});
        }).then(function(reciept){
            assert.equal(reciept.logs.length,1,'event trigger');
            assert.equal(reciept.logs[0].event,'Approval','Approval event');
            assert.equal(reciept.logs[0].args._owner,accounts[0],'owner');
            assert.equal(reciept.logs[0].args._spender,accounts[1],'spender');
            assert.equal(reciept.logs[0].args._value,100,'value');
            return tokeninstance.allowance(accounts[0],accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(),100,'100 tokens allowed');
        })
    })

    it('tranfer delegate tokens',function(){
        return mytoken.deployed().then(function(instance){
            tokeninstance=instance;
            fromaccount=accounts[2];
            toaccount=accounts[3];
            spendingaccount=accounts[4];
            return tokeninstance.transfer(fromaccount,100,{from:accounts[0]});
        }).then(function(reciept){
            //to approve spending amount to spent 10 tokens
        return tokeninstance.approve(spendingaccount,10,{from :fromaccount});
        }).then(function(reciept){
            //try tranfer larger then sender balance
            return tokeninstance.transferfrom(fromaccount,toaccount,1000,{from:spendingaccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,'insufficent balance');
            //try to send greater value than approve
            return tokeninstance.transferfrom(fromaccount,toaccount,34,{from:spendingaccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,'delegate value is less');
            return tokeninstance.transferfrom.call(fromaccount,toaccount,10,{from:spendingaccount});
        }).then(function(success){
            assert.equal(success,true,'it is returning true');
            return tokeninstance.transferfrom(fromaccount,toaccount,10,{from:spendingaccount});
        }).then(function(reciept){
            assert.equal(reciept.logs.length,1,'event trigger');
            assert.equal(reciept.logs[0].event,'Transfer','Transfer event');
            assert.equal(reciept.logs[0].args._from,fromaccount,'from');
            assert.equal(reciept.logs[0].args._to,toaccount,'to account');
            assert.equal(reciept.logs[0].args._value,10,'value');
            return tokeninstance.balanceof(fromaccount);
        }).then(function(balance){
            assert.equal(balance,90,'amount is deducted');
            return tokeninstance.balanceof(toaccount);
        }).then(function(balance){
            assert.equal(balance,10,'amount is added');
            return tokeninstance.allowance(fromaccount,spendingaccount);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(),0,'dealgate value is zero');
        });
     });

    });

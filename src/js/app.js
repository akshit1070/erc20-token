//  const { default: Web3 } = require("web3");


// var contract = require("@truffle/contract");
App={
    web3Provider:null,
    contracts:{},
    account : '0x0',
    loading: false,
    tokenprice:1000000000000000,
    tokensold:0,
    tokenav:7500000,
    init: function(){

        console.log("app ini...");
        return App.initWeb3();
    },
    initWeb3: function(){
   if(typeof web3!== 'undefined' && 0)
   {
       App.web3Provider=web3.currentProvider;
       web3=new Web3(web3.currentProvider);
   }
   else
   {
       App.web3Provider=new Web3.providers.HttpProvider('');
       web3=new Web3(App.web3Provider);
   }
			 return App.initContract();

		 },
      
        
    initContract: function(){
        $.getJSON("mytokensale.json",function(mytokensale){
         App.contracts.mytokensale=TruffleContract(mytokensale);
         App.contracts.mytokensale.setProvider(App.web3Provider);
         App.contracts.mytokensale.deployed().then(function(mytokensale){
             console.log("address: ",mytokensale.address);
         });
        }).done(function(){
            $.getJSON("mytoken.json",function(mytoken){
                App.contracts.mytoken=TruffleContract(mytoken);
         App.contracts.mytoken.setProvider(App.web3Provider);
         App.contracts.mytoken.deployed().then(function(mytoken){
             console.log("address token: ",mytoken.address);
           });
           return App.render();
         })
        })
    },


    render:async function(){
       
        if(App.loading){
            return;
        }
        App.loading=true;
        var loader=$("#loader");
        var content=$("#content");
         loader.show();
         content.hide();
         
try{
        //load account datay
        window.ethereum
          await  ethereum.enable().then( function(acc){
               App.account = acc;
                console.log("addd",App.account);

                $("#accountaddress").html("Your Account: " + App.account);
            
            App.contracts.mytokensale.deployed().then( function(instance){
                tokensaleinstance=instance;
                 return tokensaleinstance.tokensold();
            }).then(function(tokensold){
                 App.tokensold=tokensold.toNumber();
                $(".token-sold").html(App.tokensold);
                $(".token-available").html(App.tokenav);

                var pp=(Math.ceil(App.tokensold)/App.tokenav)*100;
                $('#progress').css('width',pp+ '%');
                   //token contract
            App.contracts.mytoken.deployed().then( function(instance){
                mytokeninstance=instance;
               return mytokeninstance.balanceOf(App.account);
            }).then(function(balance){
                $('.mym-balance').html(balance.toNumber());
                  })
            })
        

           
        })
        
        App.loading=false;
        loader.hide();
        content.show();
        
    }catch(err){
        console.log("error",err)

    }


    },
    buytoken:function(){
          var loader=$("#loader");
        var content=$("#content");
       
        console.log("aaw",App.account);

         ethereum.enable().then(function(acc){
             App.account = acc;
         })
       
            loader.show();
        content.hide();
         var numberoftoken=$('#numberoftoken').val();
         console.log(numberoftoken);
         App.contracts.mytokensale.deployed().then(function(instance){
             return instance.buytoken(numberoftoken,{from:App.account,value:numberoftoken*App.tokenprice,gas:50000});
         }).then(function(result){
             console.log("bought");
             $('form').trigger('reset')
             loader.hide();
             content.show();
         });
        

    }
}


$(function(){
    $(window).on("load",function(){
        App.init();
    });
});

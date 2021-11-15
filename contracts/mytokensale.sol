//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./mytoken.sol";

contract mytokensale{
 address payable  admin;
 mytoken public tokencontract;
 mytokensale public salecontract;
 uint public tokenprice=1000000000000000;
 uint public tokensold;

 event Sell(
     address indexed _buyer,
     uint _amount
 );

 constructor(mytoken _tokencontract,uint _tokenprice){
      admin=payable(msg.sender); 
     _tokencontract=tokencontract;
     _tokenprice=tokenprice;
 }

 //or we can use library math
 function multiply(uint x,uint y)internal pure returns(uint z){
     require(y==0||(z=x*y)/y==x);
 } 

 function buytoken(uint _number)public payable{
     //value is equal to tokens
     require(msg.value == multiply(_number,tokenprice));
     //contract have enough balance
     require(tokencontract.balanceof(address(this))>=_number);
     //transfer the tokens
     require(tokencontract.transfer( msg.sender, _number));

     
     //token sold\
     tokensold += _number;
     emit Sell(msg.sender, _number);
 }

 function endsale()public {
     //only admin
     require(msg.sender==admin);
     
     
     //transfer remaining token to admin
    //  uint num=999990;
    //   require(tokencontract.transfer(admin, num));
    
    
     //destroy the contract
      address payable addr = payable(address(admin));
        selfdestruct(addr);
       


 }
}
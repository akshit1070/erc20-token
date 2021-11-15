//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
contract mytoken{
string public name ="mytoken";
string public symbol="mym";
string public standard="mym v1";

//event
event Transfer(
address indexed _from,
address indexed _to,
uint _value
);

//event approval
event Approval(
    address indexed _owner,
    address indexed _spender,
    uint _value
);

//mapping
mapping(address=>uint)public   balanceof;
mapping(address => mapping(address => uint))public allowance;

uint public  totalSupply;
    
    constructor(uint initialsupply){
        balanceof[msg.sender]=initialsupply;
        totalSupply=initialsupply;
    }


    //transfer
    function transfer(address _to,uint _value)public returns(bool success){
    require(balanceof[msg.sender]>=_value);
    //tranfer
    balanceof[msg.sender]-=_value;
    balanceof[_to]+=_value;
    emit Transfer(msg.sender,_to,_value);
    return true;
    }

    //Delegated tranfer(sender himself donot initiate the tranfer)approve,tranferfrom,allowance
    function approve(address _spender,uint _value)public returns(bool success){
     //allowance
     allowance[msg.sender][_spender]=_value;


        emit Approval(msg.sender, _spender, _value);
        
        return true;

    }
    //transferfrom
    function transferfrom(address _from,address _to,uint _value)public returns(bool success){
        require(_value<=balanceof[_from]);
        require(_value<=allowance[_from][msg.sender]);
        balanceof[_to]+=_value;
        balanceof[_from]-=_value;
        allowance[_from][msg.sender]-=_value;
        emit  Transfer(_from, _to, _value);
        return true;

    }
     function balanceOf(address _a)public view returns(uint balance){
       
       return  balanceof[_a] ;

    } 
     
}
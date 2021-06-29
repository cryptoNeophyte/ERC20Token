//SPDX-License-Identifier: GPL-3.0
 
pragma solidity >=0.5.0 <0.9.0;


// an interface cannot have any state variable and all the functions should be external
interface ERC20Interface{
    // a functional token that can be transferred from one address to another, not all six functions are mandatory, but only the first three. 
    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view returns(uint balance);
    // transfer() function is used to send token from one user to another, but it does not work well when tokens are being used to pay for a function in a smart contract
    function transfer(address to, uint tokens) external returns(bool success);
    
    
    
    // for an address, allowance can only be set by the owner of the tokens
    function allowance(address tokenOwner, address spender) external view returns(uint remaining);
    // together these two functions approve() and transferFrom() permit to the token owner to give another address approval to transfer up to a number of tokens known as allowance
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from , address to , uint tokens) external returns (bool success);
    
    event Transfer(address indexed from , address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}


/**
this Crypto contract is inheriting properties of ERC20Interface
When a contract inherits properties of an interface or an abstract contract then it must implement all the functions contained in parent contract 
else the contract must be marked abstract  
and abstract contract cannot be deployed */
contract Crypto is ERC20Interface{
    string public name = "Cryptos";
    string public symbol = "CRPT";
    uint public decimal = 0; // 18 is used mostly
    uint public override totalSupply; // overrride keyword is necessary to overrirde a fucntion 
    // and declaring state variable as public creates a getter function
    
    uint public tokenCost = 0.0002 ether; // 1 ether = 5000 token (CRPT)
    uint public minInvestment = 0.01 ether;
    uint public maxInvestment = 5 ether;
    uint public raisedAmount; // whenever someone buys token using eth, ethBalance will increase 
    
    // Not part of ERC-20 token but useful
    address public founder;
    
    address payable public depositTo; // investor will send eth to this address
    
    // NOTE: each ethereum address can have a number of tokens, by default the value at any address will be ERC-20
    mapping(address => uint) public balances;
    // balances[0x111...] = 100; this is how the contract will store the tokens of each address
    
    
    // this mapping includes accounts apporved to withdraw from a given account together with the withdrawal sum allowed for each of them
    
    mapping(address => mapping(address => uint)) allowed;
    // allowed[0x111...][0x222...] = 100; this is how the 
    // owner(0x111...) allows the spender(0x222...) to spend 100 tokens
    
    constructor(address payable _depositTo){
        depositTo = _depositTo; // at deployment owner will set a deposit address where all the eth amount will deposit after buying tokens
        totalSupply = 10000000; // 10M
        founder = msg.sender;
        balances[founder] = totalSupply; // after deploying, founder will have 1 million tokens
    }
    
    function balanceOf(address tokenOwner) public view override returns (uint balance){
        return balances[tokenOwner];
    }
    
    // this function transfers a number to token from the account who calls it and has enough token to a recipient 
    // this function makes the tokens transferable, 
    // virtual means, the function can change its behaviour in the contract by overriding
    // anyone can transfer their tokens to another address
    function transfer(address to, uint tokens) public override returns(bool success){
        // check if sender has enough balance
        require(balances[msg.sender] >= tokens, "YOU DON'T HAVE SUFFICIENT TOKENS!");
        
        balances[to] += tokens; // if the recipient is new then if we search this new recipient in balances mapping then it will return 0 and given token value will be added to 0.
        balances[msg.sender] -= tokens; // updating the balance of sender 
        
        // after updating the balances of the sender and recipient, the function should emit an event
        // emit is a log message which is saved on the blocks 
        // In the interface, we have already declared the event, which is inheritable into the contract so we will can just emit it
        emit Transfer(msg.sender, to, tokens);
        
        return true;
        
        // NOTE: we have followed the general guidelines, that functions revert instead of returing false of failure
        // so, on failure, function will revert and on success, it will return true
    }
    
    
    event Invest(address investor, uint value, uint tokens);
    // anyone can buy tokens using ETH 
    function buyTokens() public payable returns(bool success) {
        require(msg.value >= minInvestment && msg.value <= maxInvestment, 'Not proper amount!');
        
        uint tokens = msg.value / tokenCost;
        
        // now make transaction
        depositTo.transfer(msg.value);
        
        balances[msg.sender] += tokens;
        balances[founder] -= tokens;
        raisedAmount += msg.value;
        
        // finally, emit an event which is a log message written to the blockchain that can be processed by frontend
        emit Invest(msg.sender, msg.value, tokens);
        
        return true;
    }
    
    // the contract will accept eth sent to address if there is a payable function called receive
    receive() payable external{
        buyTokens(); // this function will be automatically called when somebody sends ether directly to the contract's address
    }
    
    
    
    // this function will return that how many tokens owner has allowed the spender to withdraw 
    function allowance(address tokenOwner, address spender) view public override returns(uint){
        return allowed[tokenOwner][spender];
    }
    
    // this function will be called by the token owner to set the allowance which is the amount that can be spent by the spender from his account
    function approve(address spender, uint tokens) public override returns(bool success){
        require(balances[msg.sender] >= tokens);
        require(tokens > 0);
        
        allowed[msg.sender][spender] = tokens;
        
        emit Approval(msg.sender, spender, tokens);
        // NOTE: some implementations also define another two functions --> increase approval and decrease approval
        // our function only sets the allowance for a spender to fixed value, however they aren't part of the official ERC-20 interface
        return true;
    }
    
    // it allows the spender to withdraw from the owner's account multiple times up to the allowance value
    // this function will be called by the account that wants to withdraw tokens from the holder's account to his own
    // transferFrom() is called in behalf of token's owner after the owner approved another address to spend the tokens he possesses
    function transferFrom(address from, address to, uint tokens) public virtual override returns(bool success){
        require(allowed[from][to] >= tokens);
        require(balances[from] >= tokens);
        
        balances[from] -= tokens;
        balances[to] += tokens;
        
        // the allowance has decreased with the amount already withdrawn
        allowed[from][to] -= tokens;
        
        return true;
        
    }
}















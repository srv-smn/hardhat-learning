// SPDX-License-Identifier: NONE
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 *
 * @author Bhupesh Dubey
*/
contract GIEToken is Ownable, IERC20, IERC20Metadata {

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     *
     * @notice constructor initializes the GIE token with name and symbol
       @param name_ name of the token
       @param symbol_ symbol of the token
    */
    constructor(
        string memory name_, 
        string memory symbol_
    ) {
        _name = name_;
        _symbol = symbol_;
        _mint(msg.sender, 1000000000 * 10 ** 18);
    }

    /**
     *
       @notice changes the owner to new owner
       @param newOwner address of the new owner
    */
    function transferOwnership(
        address newOwner
    ) public override onlyOwner {
        require(newOwner != address(0), "GieToken: new owner is the zero address");
        require(newOwner != owner(), "GieToken: Already a owner");
        _transferOwnership(newOwner);
    }

    /**
     *
     * @notice transfer's the GIE token from sender to receiver's address
       @return bool true or false based on successful transaction
       @param to address of the receiver
       @param amount amount of tokens to be transferred
    */
    function transfer(
        address to, 
        uint256 amount
    ) public virtual override returns (
        bool
    ) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    /**
     *
     * @notice mints new GIE tokens and increases total supply 
       @param account address of the account where minted tokens is to be transferred
       @param amount amount of tokens to be minted
    */
    function mint(
        address account, 
        uint256 amount
    ) public onlyOwner() {
        require(amount > 0, "ERC20: amount to mint should be greater than zero");
        _mint(account, amount);
    }

    /**
     *
     * @notice burns GIE tokens and decreases total supply 
       @param account address of the account from which tokens has to be burned
       @param amount amount of tokens to be burned
    */
    function burn(
        address account, 
        uint256 amount
    ) public onlyOwner() {
        require(amount > 0, "ERC20: amount to burn should be greater than zero");
        _burn(account, amount);
    }

    /**
     *
     * @notice provides approval to address to spend specific tokens on owner's behalf
       @return bool returns true or false based on transaction success
       @param spender address of the account to whom permission has to be granted for spending
       @param amount amount of tokens that can be spend
    */
    function approve(
        address spender, 
        uint256 amount
    ) public virtual override returns (
        bool
    ) {
        require(amount > 0, "ERC20: amount to approve should be greater than zero");
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /**
     *
     * @notice transfer's the GIE token from sender to receiver's address on behalf of actual owner
       @return bool true or false based on successful transaction
       @param from address of the actual token owner
       @param to address of the receiver
       @param amount amount of tokens to be transferred
    */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (
        bool
    ) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     *
     * @notice increases the allowance of the spender by the owner
       @return bool true or false based on successful transaction
       @param spender address of the spender
       @param addedValue amount of tokens to be added in allowance
    */
    function increaseAllowance(
        address spender, 
        uint256 addedValue
    ) public virtual returns (
        bool
    ) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     *
     * @notice decreases the allowance of the spender by the owner
       @return bool true or false based on successful transaction
       @param spender address of the spender
       @param subtractedValue amount of tokens to be deducted in allowance
    */
    function decreaseAllowance(
        address spender, 
        uint256 subtractedValue
    ) public virtual returns (
        bool
    ) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        _approve(owner, spender, currentAllowance - subtractedValue);
        return true;
    }

    /**
     *
     * @notice transfers the amount of tokens from sender's address to receiver's address
       @param from address of the sender
       @param to address of the receiver
       @param amount amount of tokens to transfer
    */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        _balances[from] = fromBalance - amount;
        _balances[to] += amount;
        emit Transfer(from, to, amount);
    }

    /**
     *
     * @notice mints the specific amount of tokens to the caller
       @param account address where minted tokens is send
       @param amount amount of tokens to mint
    */
    function _mint(
        address account, 
        uint256 amount
    ) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    /**
     *
     * @notice burns the specific amount of tokens of the caller
       @param account address from where tokens is burned
       @param amount amount of tokens to burn
    */
    function _burn(
        address account, 
        uint256 amount
    ) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");
        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        _balances[account] = accountBalance - amount;
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount);
    }

    /**
     *
     * @notice provides approval to address to spend specific tokens on owner's behalf
       @param owner address of token owner
       @param spender address of the account to whom permission has to be granted for spending
       @param amount amount of tokens that can be spend
    */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     *
     * @notice deducts the specific amount of tokens from allowance of user by the owner
       @param owner address of token owner
       @param spender address of the account to whom permission has to be granted for spending
       @param amount amount of tokens that is to be deducted
    */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            _approve(owner, spender, currentAllowance - amount);
        }
    }

    /**
     *
     * @notice fetches the name of the GIE token
       @return _name the name of the GIE token
    */
    function name() public view virtual override returns (
        string memory
    ) {
        return _name;
    }

    /**
     *
     * @notice fetches the symbol of the GIE token
       @return _symbol the symbol of the GIE token
    */
    function symbol() public view virtual override returns (
        string memory
    ) {
        return _symbol;
    }

    /**
     *
     * @notice fetches the decimals of the GIE token
       @return decimal the decimal of the GIE token
    */
    function decimals() public view virtual override returns (
        uint8
    ) {
        return 18;
    }

    /**
     *
     * @notice fetches the total supply of the GIE token
       @return _totalSupply the total supply of the GIE token
    */
    function totalSupply() public view virtual override returns (
        uint256
    ) {
        return _totalSupply;
    }

    /**
     *
     * @notice fetches the balance of user holding GIE tokens
       @return balance the balance of user holding GIE token
       @param account the address of the user whose balance needs to be fetched
    */
    function balanceOf(
        address account
    ) public view virtual override returns (
        uint256
    ) {
        return _balances[account];
    }

    /**
     *
     * @notice fetches the allowance of spender provided by the token owner
       @return allowance the allowance of the user 
       @param owner the address of the owner
       @param spender the address of the spender 
    */
    function allowance(
        address owner, 
        address spender
    ) public view virtual override returns (
        uint256
    ) {
        return _allowances[owner][spender];
    }

}
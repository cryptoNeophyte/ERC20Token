import React, { useState, useEffect } from 'react'

const InfoBox = ({ contract, currentOwnerBalance }) => {
  const [balance, setBalance] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [balanceAddress, setBalanceAddress] = useState('')
  const [tokenOwner, setTokenOwner] = useState('')
  const [tokenSpender, setTokenSpender] = useState('')

  function handleInputs(event) {
    const { name, value } = event.target
    if (name === 'balance_address') {
      setBalanceAddress(value)
    } else if (name === 'token_owner') {
      setTokenOwner(value)
    } else {
      setTokenSpender(value)
    }
  }

  async function handleGetBalance(event) {
    event.preventDefault()
    if (balanceAddress.length > 0) {
      try {
        const result = await contract.methods.balanceOf(balanceAddress).call()
        setBalance(result)
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function handleGetAllowance(event) {
    event.preventDefault()
    if (tokenOwner.length > 0 && tokenSpender.length > 0) {
      try {
        const result = await contract.methods
          .allowance(tokenOwner, tokenSpender)
          .call()
        setAllowance(result)
      } catch (err) {
        console.log(err)
      }
    }
  }
  return (
    <div className="getter-functions">
      <div className="card p-3 current-owner-tokens" style={{ width: '30rem' }}>
        <h5>Your Balance: {currentOwnerBalance} CRPT</h5>
      </div>
      <div
        className="card info-box p-3"
        style={{ width: '30rem', textAlign: 'right' }}
      >
        <form className="get-balance" onSubmit={handleGetBalance}>
          <label>
            Address
            <input
              type="text"
              placeholder="Token Owner"
              name="balance_address"
              onChange={handleInputs}
              value={balanceAddress}
            />
          </label>
          <br />
          <button>Get Balance</button>
          <h5>{balance} CRPT</h5>
        </form>
      </div>

      <div
        className="card info-box p-3"
        style={{ width: '30rem', textAlign: 'right' }}
      >
        <form className="get-allowance" onSubmit={handleGetAllowance}>
          <label>
            Address of token owner:
            <input
              type="text"
              placeholder="Token Owner"
              name="token_owner"
              onChange={handleInputs}
              value={tokenOwner}
            />
          </label>
          <label>
            Address of spender:
            <input
              type="text"
              placeholder="Token Spender"
              name="token_spender"
              onChange={handleInputs}
              value={tokenSpender}
            />
          </label>
          <br />
          <button>Get Allowance</button>
          <h5>{allowance} CRPT</h5>
        </form>
      </div>
    </div>
  )
}

export default InfoBox

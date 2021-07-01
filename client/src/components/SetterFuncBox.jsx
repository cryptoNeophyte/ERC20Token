import React, { useState } from 'react'

const SetterFuncBox = ({ contract, currentAccount, stateChange }) => {
  // this is for transferring tokens from own account to other account
  const [transferTo, setTransferAddress] = useState('')
  const [tokenTransfer, setTokenTransfer] = useState(0)

  // this is for allowing token transfer
  const [allowance, setAllowance] = useState(0)
  const [allowanceAddress, setSpenderAddress] = useState('')

  // this is for transferring token from owners to spender account until allowed tokens (allowance)
  const [addressFrom, setAddressFrom] = useState('')
  const [addressTo, setAddressTo] = useState('')
  const [tokenTransferFrom, setTokenTransferFrom] = useState(0)

  function handleInputs(event) {
    const { name, value } = event.target
    if (name === 'transfer-address') {
      setTransferAddress(value)
    } else if (name === 'token-transfer') {
      setTokenTransfer(value)
    } else if (name === 'address-transfer-from') {
      setAddressFrom(value)
    } else if (name === 'address-transfer-to') {
      setAddressTo(value)
    } else if (name === 'token-transfer-from') {
      setTokenTransferFrom(value)
    } else if (name === 'allowance-address') {
      setSpenderAddress(value)
    } else if (name === 'allowance') {
      setAllowance(value)
    }
  }

  async function handleTransfer(event) {
    event.preventDefault()
    if (transferTo.length > 0 && tokenTransfer > 0) {
      try {
        await contract.methods
          .transfer(transferTo, tokenTransfer)
          .send({ from: currentAccount })
          .on('transactionhash', () => {
            console.log('Token Successfully Transferred!')
          })
        setTransferAddress('')
        setTokenTransfer(0)
        stateChange()
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function handleTokenAllowanceApproval(event) {
    event.preventDefault()
    if (allowanceAddress.length > 0 && allowance > 0) {
      try {
        await contract.methods
          .approve(allowanceAddress, allowance)
          .send({ from: currentAccount })
          .on('transactionhash', () => {
            console.log('Allowance Successfully Approved!')
          })
        setAllowance(0)
        setSpenderAddress('')
        setTokenTransferFrom(0)
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function handleTransferFrom(event) {
    event.preventDefault()
    console.log('addressFrom', addressFrom)
    console.log('addressTo', addressTo)
    console.log('tokenTransferFrom', tokenTransferFrom)
    console.log(currentAccount)
    if (
      addressFrom.length > 0 &&
      addressTo.length > 0 &&
      tokenTransferFrom > 0
    ) {
      try {
        await contract.methods
          .transferFrom(addressFrom, addressTo, tokenTransferFrom)
          .send({ from: currentAccount })
          .on('transactionhash', () => {
            console.log('Token successfully transferred!')
          })
        setAddressFrom('')
        setAddressTo('')
        stateChange()
      } catch (err) {
        console.log(err.message)
        alert(err.message)
      }
    }
  }

  return (
    <div
      className="getter-functions"
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {/* ------------transfer token-------------- */}
      <div className="card info-box p-3" style={{ width: '28rem' }}>
        <h5>Transfer Token To Other Account</h5>
        <form
          className="transfer-token"
          onSubmit={handleTransfer}
          style={{ textAlign: 'right' }}
        >
          <label>
            Account Address
            <input
              type="text"
              placeholder="Transfer To"
              name="transfer-address"
              onChange={handleInputs}
              value={transferTo}
            />
            <input
              type="number"
              placeholder="CRPT Amount"
              name="token-transfer"
              onChange={handleInputs}
              value={tokenTransfer}
            />
          </label>
          <br />
          <button>Transfer CRPT</button>
        </form>
      </div>

      {/* ----------token allowance--------- */}
      <div className="card info-box p-3" style={{ width: '28rem' }}>
        <h5>Token Allowance</h5>
        <p>Allow other address to withdraw some CRYPTOS</p>
        <form
          className="token-allowance"
          onSubmit={handleTokenAllowanceApproval}
          style={{ textAlign: 'right' }}
        >
          <label>
            Spender Address
            <input
              type="text"
              placeholder="Transfer To"
              name="allowance-address"
              onChange={handleInputs}
              value={allowanceAddress}
            />
            <input
              type="number"
              placeholder="CRPT Amount"
              name="allowance"
              onChange={handleInputs}
              value={allowance}
            />
          </label>
          <br />
          <button>Give Allowance</button>
        </form>
      </div>

      {/* -----------token transfer from ----------------- */}
      <div className="card info-box p-3" style={{ width: '28rem' }}>
        <h5>Transfer Token From Token Owner's Account To Spender's Account</h5>
        <form
          className="transfer-token-from"
          onSubmit={handleTransferFrom}
          style={{ textAlign: 'right' }}
        >
          <label>
            Token Owner's Address
            <input
              type="text"
              placeholder="Transfer From"
              name="address-transfer-from"
              onChange={handleInputs}
              value={addressFrom}
            />
            <br />
            Spender's Address
            <input
              type="text"
              placeholder="Transfer To"
              name="address-transfer-to"
              onChange={handleInputs}
              value={addressTo}
            />
            <br />
            <input
              type="number"
              placeholder="CRPT Amount"
              name="token-transfer-from"
              onChange={handleInputs}
              value={tokenTransferFrom}
            />
          </label>
          <br />
          <button>Transfer CRPT</button>
        </form>
      </div>
    </div>
  )
}

export default SetterFuncBox

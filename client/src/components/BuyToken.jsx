import React, { useState } from 'react'
import Web3 from 'web3'

function BuyToken({ contract, currentAccount, stateChange }) {
  const [value, setValue] = useState(0)

  function handleInput(event) {
    setValue(event.target.value)
  }

  async function buyToken(event) {
    event.preventDefault()
    if (value > 0) {
      try {
        console.log(currentAccount)

        await contract.methods.buyTokens().send({
          from: currentAccount,
          value: Web3.utils.toWei(`${value}`, 'ether'),
        })

        stateChange()
        setValue(0)
      } catch (err) {
        console.log(err)
      }
    }
  }
  return (
    <div className="card buy-token" style={{ width: '28rem' }}>
      <form>
        <label>
          <input
            value={value}
            type="number"
            style={{ width: '80%' }}
            onChange={handleInput}
          />
          ETH
        </label>
        <br />
        <button onClick={buyToken}>Buy Token</button>
      </form>
    </div>
  )
}

export default BuyToken

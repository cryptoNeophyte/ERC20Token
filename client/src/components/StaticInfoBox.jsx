import React from 'react'

const StaticInfoBox = ({ staticInfo }) => {
  if (staticInfo != {}) {
    console.log('staticInfo', staticInfo)
    const {
      tokenName,
      tokenSymbol,
      tokenCost,
      totalSupply,
      maxInvestment,
      minInvestment,
      founder,
      depositAddress,
      tokenDecimal,
      raisedAmount,
    } = staticInfo
    return (
      <div
        className="card static-info-box"
        style={{ width: '18rem', textAlign: 'left' }}
      >
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Token Name : </strong>
            {tokenName}
          </li>
          <li className="list-group-item">
            <strong>Token Symbol : </strong>
            {tokenSymbol}
          </li>
          <li className="list-group-item">
            <strong>Token Cost : </strong>
            {tokenCost * 0.000000000000000001} ETH
          </li>
          <li className="list-group-item">
            <strong>Total Supply : </strong>
            {totalSupply} CRPT
          </li>
          <li className="list-group-item">
            <strong>Decimal : </strong>
            {tokenDecimal}
          </li>
          <li className="list-group-item">
            <strong>Minimum Investment : </strong>
            {minInvestment * 0.000000000000000001} ETH
          </li>
          <li className="list-group-item">
            <strong>Maximum Investment : </strong>
            {maxInvestment * 0.000000000000000001} ETH
          </li>
          <li className="list-group-item">
            <strong>Founder : </strong>
            {founder}
          </li>
          <li className="list-group-item">
            <strong>Contract's deposit address : </strong>
            {depositAddress}
          </li>
        </ul>
        <div className="card-footer">
          <strong>Raised Amount: </strong>
          {raisedAmount * 0.000000000000000001} ETH
        </div>
      </div>
    )
  } else {
    return <h5>Loading...</h5>
  }
}

export default StaticInfoBox

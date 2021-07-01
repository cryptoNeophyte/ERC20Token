import React from 'react'
import StaticInfoBox from '../components/StaticInfoBox'
import InfoBox from '../components/InfoBox'
import SetterFuncBox from '../components/SetterFuncBox'
import BuyToken from '../components/BuyToken'

function HomePage({ staticInfo, contract, currentAccount, stateChange }) {
  return (
    <div className="home-page">
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <StaticInfoBox staticInfo={staticInfo} />
        <InfoBox
          contract={contract}
          currentOwnerBalance={staticInfo.currentOwnerBalance}
        />
        <SetterFuncBox
          contract={contract}
          currentAccount={currentAccount}
          stateChange={stateChange}
        />
        <BuyToken
          contract={contract}
          currentAccount={currentAccount}
          stateChange={stateChange}
        />
      </div>
    </div>
  )
}

export default HomePage

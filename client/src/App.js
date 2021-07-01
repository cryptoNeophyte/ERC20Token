import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState } from 'react'

import Web3 from 'web3'
import CryptoAbi from './contracts/Crypto.json'

import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

function App() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [loading, setLoader] = useState(true)
  const [hasEthereumAccount, setAccountState] = useState(true)
  const [staticObject, setStaticObject] = useState({})
  const [contract, setContract] = useState()
  const [stateChangeFlag, setStateChangeFlag] = useState(0)

  useEffect(() => {
    loadWeb3()
    LoadBlockchainData()
  }, [currentAccount, stateChangeFlag])

  function stateChange() {
    setStateChangeFlag(stateChangeFlag + 1)
  }

  async function loadWeb3Account(provider) {
    try {
      const web3 = provider

      const accounts = await web3.eth.getAccounts()
      const account = accounts[0]
      setCurrentAccount(account)
      console.log('account', account)

      return web3
    } catch (err) {
      console.log(err)
    }
  }

  async function loadWeb3() {
    // console.log('window.ethereum', window.ethereum)
    // console.log('window.web3', window.web3)

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)

      await window.ethereum.enable() // here metamask will connect to our fullstack app
      await loadWeb3Account(window.web3)
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      await loadWeb3Account(window.web3)
    } else {
      window.alert('Non Ethereum browser detected! please use metamask.')
      setAccountState(false)
    }
  }

  async function LoadBlockchainData() {
    try {
      setLoader(true)
      const web3 = await loadWeb3Account(window.web3)

      const networkId = await web3.eth.net.getId()
      console.log('networkId', networkId)

      const networkData = CryptoAbi.networks[networkId]
      console.log('networkData', networkData)

      if (networkData) {
        // console.log('CryptoAbi.abi', CryptoAbi.abi)
        // console.log('networkData.address', networkData.address)

        // fetching Crypto contract
        const crypto = new web3.eth.Contract(CryptoAbi.abi, networkData.address)
        console.log('crypto ---> ', crypto)

        setContract(crypto)

        // fetching token name
        const tokenName = await crypto.methods.name().call()
        // fetching token symbol
        const tokenSymbol = await crypto.methods.symbol().call()
        // fetching token cost
        const tokenCost = await crypto.methods.tokenCost().call()
        // fetching token decimal
        const tokenDecimal = await crypto.methods.decimal().call()
        // fetching total supply
        const totalSupply = await crypto.methods.totalSupply().call()
        // fetching minimum investment
        const minInvestment = await crypto.methods.minInvestment().call()
        // fetching maximum investment
        const maxInvestment = await crypto.methods.maxInvestment().call()
        // fetching founder address
        const founder = await crypto.methods.founder().call()
        // fetching contract's deposit address
        const depositAddress = await crypto.methods.depositTo().call()
        // fetching raised amount by contract
        const raisedAmount = await crypto.methods.raisedAmount().call()

        console.log('currentAccount', currentAccount)
        // fetching balance of current owner
        const currentOwnerBalance = await crypto.methods
          .balanceOf(currentAccount)
          .call()

        setStaticObject({
          ...staticObject,
          tokenName,
          tokenSymbol,
          tokenCost,
          tokenDecimal,
          totalSupply,
          minInvestment,
          maxInvestment,
          founder,
          depositAddress,
          raisedAmount,
          currentOwnerBalance,
        })
      } else {
        window.alert('The smart contract is not deployed to current network!')
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function Connect() {
    // console.log('connect to metamask!')
    loadWeb3()
  }

  if (hasEthereumAccount || !loading) {
    return (
      <div className="App">
        <Navbar currentAccount={currentAccount} connect={Connect} />
        <HomePage
          staticInfo={staticObject}
          contract={contract}
          currentAccount={currentAccount}
          stateChange={stateChange}
        />
      </div>
    )
  } else {
    return <h3>Loading...</h3>
  }
}

export default App

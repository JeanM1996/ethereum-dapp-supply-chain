const Web3 = require("web3") // import web3 v1.0 constructor

// use globally injected web3 to find the currentProvider and wrap with web3 v1.0
const getWeb3 = () => {
    const myWeb3 = new Web3(web3.currentProvider)
    return myWeb3
}

// assumes passed-in web3 is v1.0 and creates a function to receive contract name
const getContractInstance = (web3) => (contractName) => {
    const artifact = artifacts.require(contractName) // globally injected artifacts helper
    const deployedAddress = artifact.networks[artifact.network_id].address
    const instance = new web3.eth.Contract(artifact.abi, deployedAddress)
    return instance
}

module.exports = { getWeb3, getContractInstance }
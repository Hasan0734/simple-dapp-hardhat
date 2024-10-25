import './App.css';
import { useEffect, useState } from 'react';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import {ethers} from 'ethers';




function App() {

  const [greeting, doGreeting] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [inputValue, setInputValue] = useState('')



  useEffect(() => {

    const loadProvider =  async () => {

      try {
        let contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        const url = "http://localhost:8545";
        const provider = new ethers.JsonRpcProvider(url);
        const getContract = new ethers.Contract(contractAddress, Greeter.abi, provider);
        setContract(getContract);
        setProvider(provider);
  
      } catch (error) {
        console.log(error)
      }
    }
    loadProvider();

  }, [])

  const getGreeting =  async () => {
    const greeting = await contract.greet();
    doGreeting(greeting)
  }

  useEffect(() => {

     contract && getGreeting();

  }, [contract])


  const setGreeting = async () => {

    if(!inputValue) return

    try {
      const signer = await provider.getSigner();
      const contractWithSigner = await contract.connect(signer);
      const tx = await contractWithSigner.setGreeting(inputValue);
      tx.wait(); //wait for transaction to be mined
      getGreeting();
      setInputValue('')
    } catch (error) {
      console.log(error)
    }
    
  }


  return (
    <div className="center">
      <h3>{greeting}</h3>
      <input onChange={(e) => setInputValue(e.target.value)} value={inputValue} type='text' />
      <button onClick={setGreeting}>Set Greet</button>
    </div>
  );
}

export default App;

import './App.css';
import { useState, useEffect } from 'react';
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract"

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reload, setReload] = useState(false);

  const reloadEffect = () => setReload(!reload);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        let provider = await detectEthereumProvider();
        const contract = await loadContract("Funder", provider);
        if (provider) {
          provider.request({ method: "eth_requestAccounts" });
          setWeb3Api({
            web3: new Web3(provider),
            provider,
            contract
          })
        } else {
          console.error('Please install MetaMask!');
        }
      } catch (error) {
        console.error('Error getting provider', error);
      }
    }
    loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, 'ether'));
    }

    web3Api.contract && loadBalance();
  }, [web3Api, reload]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  const transferFund = async () => {
    const { web3, contract } = web3Api;
    await contract.fund({
      from: account,
      value: web3.utils.toWei("2", "ether")
    });
    reloadEffect();
  }

  const withdrawFund = async () => {
    const { web3, contract } = web3Api;
    const withdrawAmount = web3.utils.toWei("2", "ether");
    await contract.withdraw(withdrawAmount, {
      from: account,
    });
    reloadEffect();
  }

  return (
    <>
      <div class="card text-center">
        <div class="card-header">Funding</div>
        <div class="card-body">
          <h5 class="card-title">Balance: { balance } ETH </h5>
          <p class="card-text">
            Account : {account ? account : "not connected"}
          </p>
          &nbsp;
          <button type="button" class="btn btn-success "  onClick={transferFund}>
            Transfer
          </button>
          &nbsp;
          <button type="button" class="btn btn-primary " onClick={withdrawFund}>
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

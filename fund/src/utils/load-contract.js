const contract = require('@truffle/contract');

export const loadContract = async (name, provider) => {
  try {
    // Fetch the ABI from the public folder dynamically
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json(); // ABI and networks info

    // Initialize the contract using @truffle/contract
    const _contract = contract(Artifact);
    
    // Set provider to the passed provider (e.g., web3.currentProvider)
    _contract.setProvider(provider);

    // Get the deployed contract instance
    const deployedContract = await _contract.deployed();
    return deployedContract;
  } catch (error) {
    console.error('Error loading contract:', error);
    throw error;
  }
};

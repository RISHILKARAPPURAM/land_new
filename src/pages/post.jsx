import { useState } from 'react';
import {ethers} from 'ethers';

import LandRegistry from '../../contracts/artifacts/contracts/LandRegistry.sol/LandRegistry.json'; // Replace with your contract's artifact

export default function CreateProperty() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Connect to Ethereum provider
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

      // Get the user's Ethereum account
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Create a contract instance
      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your contract's address
      const contract = new ethers.Contract(contractAddress, LandRegistry.abi, signer);

      // Add the property to the contract
      await contract.addProperty(name, location, ethers.parseEther(price), address);

      localStorage.setItem("name", name)
      localStorage.setItem("location", location)
      localStorage.setItem("price", price)

      // Reset form fields
      setName('');
      setLocation('');
      setPrice('');

      alert('Property added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add property');
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Property</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter property name"
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            type="text"
            placeholder="Enter property location"
            value={location}
            onChange={handleLocationChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price (ETH)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="text"
            placeholder="Enter price"
            value={price}
            onChange={handlePriceChange}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Post
        </button>
        </form>
        </div>
  )
}

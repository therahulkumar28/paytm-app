import React from 'react';
import { useLocation } from 'react-router-dom';
import useGetBalance from '../hooks/GetBalance';
import { Appbar } from '../components/Appbar';


const TransactionSuccessful = () => {
  const location = useLocation();
  console.log(location.state);
  const { name, amount } = location.state || { name: '', amount: 0 };
  const balance = useGetBalance(); 
console.log(balance);
  return (
    <>
   <Appbar/>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4">Transaction Successful!</h2>
          <p className="text-lg mb-2">
            You successfully sent money to {name}.
          </p>
          <p className="text-lg mb-4">Amount sent: Rs. {amount}</p>
          <p className="text-lg mb-4">Remaining Balance is:</p>
          <div className="text-2xl font-semibold text-green-500">
            Rs. {balance}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionSuccessful;

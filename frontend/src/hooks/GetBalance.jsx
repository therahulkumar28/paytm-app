import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetBalance = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get("http://localhost:3001/api/account/balance", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setBalance(response.data.balance.toFixed(2));
      } catch (err) {
        console.log("Error during fetch balance ", err);
      }
    };

    fetchBalance();
  }, []); 

  return balance;
};

export default useGetBalance;

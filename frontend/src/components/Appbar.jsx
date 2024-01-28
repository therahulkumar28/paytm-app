import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Appbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { para, name } = location.state || { para: 'U' };

  const handleDropdownClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    // Add your logout logic here, such as clearing tokens or redirecting to the login page
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">
        PayTM App
      </div>
      <div className="relative flex">
        <div
          className="flex flex-col justify-center h-full mr-4 " >
          Hello
        </div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div  onClick={handleDropdownClick} className="flex flex-col justify-center h-full text-xl cursor-pointer">
            {para ? para[0].toUpperCase() : name[0].toUpperCase()}
          </div>
        </div>
        {dropdownVisible && (
          <div className="absolute right-1 mt-14 bg-white border border-gray-300 rounded-md shadow-lg">
            <div
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import { checkLoggedInUser } from '@/utils/utils';
import React, {createContext, useContext, useState, useEffect} from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({children}) => {
  const [user, setUser] = useState([]);
  
  const fetchData = () => {
    setUser(checkLoggedInUser());
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
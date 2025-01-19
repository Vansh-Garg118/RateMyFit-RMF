import {
  createContext,
  useContext,
  useState,
  useEffect,
  Children,
} from "react";
import { getCurrentUser } from "../lib/appwrite";
import { isLoading } from "expo-font";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggidIn, setIsLoggidIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoding, setIsLoding] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggidIn(true);
          setUser(res);
        } else {
          setIsLoggidIn(false);
          setUser(none);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoding(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggidIn,
        setIsLoggidIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;

    // import { useState, useEffect } from "react";

    // const useAppwrite = (fn) => {
    // const [data, setData] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);

    // const fetchData = async () => {
    //     setIsLoading(true);
    //     try {
    //     const response = await fn();
    //     setData(response);
    //     } catch (error) {
    //     Alert.alert("Error", error.message);
    //     } finally {
    //     setIsLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    // const refetch = () => fetchData();
    // return { data, isLoading, refetch};
    // };

    // export default useAppwrite;
    import { useState, useEffect, useCallback } from "react";
    import { Alert } from "react-native";
    
    const useAppwrite = (fn) => {
      const [data, setData] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
    
      const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
          const response = await fn();
          setData(response);
        } catch (error) {
          console.error("Error fetching data:", error.message);
          Alert.alert("Error", error.message);
        } finally {
          setIsLoading(false);
        }
      }, [fn]);
    
      useEffect(() => {
        fetchData();
      }, [fetchData]);
    
      return { data, isLoading, refetch: fetchData };
    };
    
    export default useAppwrite;
    
import { useEffect, useRef } from "react";

// creating the custom useTimeout hook
const useTimeout = (callback, delay) => {
  // Creating a ref
  const savedCallback = useRef();

  // To remember the latest callback .
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Setting and clearing up a timeout
  useEffect(() => {
    const func = () => {
      savedCallback.current();
    };
    if (delay !== null) {
      const id = setTimeout(func, delay);
      return () => clearTimeout(id);
    }
    return () => null;
  }, [delay]);
};

export default useTimeout;

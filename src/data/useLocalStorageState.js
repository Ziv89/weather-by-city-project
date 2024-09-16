import React, { useEffect } from "react";

export default function useLocalStorageState(key, defaultValue = "") {
  const [state, setState] = React.useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      // Ensure that storedValue is valid JSON or fallback to defaultValue
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      // Convert state to JSON string for storage
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, state]);

  return [state, setState];
}
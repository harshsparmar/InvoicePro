import { useEffect, useState } from "react";

const STORAGE_KEY = "invoicepro-theme";

const readTheme = () => {
  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const useTheme = () => {
  const [theme, setTheme] = useState(() => readTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark"))
  };
};

export default useTheme;

import { useContext } from "react";
import { PerfContext } from "../context/PerfContext";

export const usePerfContext = () => {
  const context = useContext(PerfContext);

  if (!context) {
    throw new Error("You have to be inside the perf context provider to use it.");
  }
  
  return context;
};
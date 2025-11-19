import React from "react";
import { useAppSelector } from "@/store/hooks";
import Loader from "./Loader";

const GlobalLoader: React.FC = () => {
  const isLoading = useAppSelector((state) => state.loader.isLoading);

  if (!isLoading) {
    return null;
  }

  return <Loader fullScreen size="lg" />;
};

export default GlobalLoader;


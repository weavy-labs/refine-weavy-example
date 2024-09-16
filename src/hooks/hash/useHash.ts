"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const getHash = () =>
  typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";

const useHash = () => {
  const [isClient, setIsClient] = useState(false);
  const [hash, setHash] = useState(getHash());
  const params = useParams();

  useEffect(() => {
    const handleHashChange = () => {
      setHash(getHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
    setHash(getHash());
  }, [params]);

  return isClient ? hash : "";
};

export default useHash;
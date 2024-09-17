"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Gets the hash from the current location.
 * @returns The current hash without a leading #hash sign
 */
const getHash = () =>
  typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";

/**
 * Returns the hash from the current location. 
 * Updates when the hash is changed by the browser or by next navigation.
 * 
 * @returns Any current hash without leading #hash sign
 */
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
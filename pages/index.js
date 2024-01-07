import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useContext } from "react";
import KeyInfoCard from "../components/setting/KeyInfoCard";
import ProgressBar from "../components/sign/ProgressBar";
import SignCard from "../components/sign/SignCard";
import WalletCard from "../components/WalletCard";
import Connect from "../components/Connect";
import { StoreContext } from '../contexts'
import { readSettings } from "../modules/settings";
import { CircularProgress } from "@nextui-org/react";

export default function Home() {
  const network = process.env.network;
  const { store, setStore } = useContext(StoreContext)
  const [isLoading, setLoading ] = useState(true)

  useEffect(() => {
    setStore((s) => ({...s, network}))
    console.log("readSettings ==>", readSettings())
    setLoading(false)
  }, [])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className="w-1/2 min-w-[calc(max(50%,400px))] max-w-[calc(min(50%,400px))] sm:w-full h-dvh py-5 flex flex-col gap-6 items-center justify-center">
          <Connect/>
          { isLoading && <CircularProgress aria-label="Loading..." /> }
          {store.keyInfo && <WalletCard address={store.address} /> }
          {!store.keyInfo && !isLoading && <SignCard /> }
          {store.isCreating && <ProgressBar txId={store.txId} network={network}/> }
        </div>
      </main>
    </div>
  );
}

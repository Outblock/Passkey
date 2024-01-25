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
import ErrorCard from "../components/error";

export default function Home() {
  const network = process.env.network;
  const { store, setStore } = useContext(StoreContext)
  const [isLoading, setLoading ] = useState(true)

  useEffect(() => {
    setStore((s) => ({...s, network}))
    console.log("readSettings ==>", readSettings())
    setLoading(false)
  }, [])


  const render = () => {
    if (isLoading) {
      return <CircularProgress aria-label="Loading..." /> 
    }

    if (store.isCreating) {
      return <ProgressBar txId={store.txId} network={network}/>
    }

    if (!store.keyInfo) {
      return <SignCard /> 
    }

    if (store.address && store.keyInfo) {
      return <WalletCard address={store.address} />
    }

    return <ErrorCard/>
  }

  return (
    <div className={styles.container}>
        <Head>
          <title>MONO - Flow Wallet</title>
        </Head>
      <main className={styles.main}>
        <div className="w-1/2 min-w-[calc(max(50%,400px))] max-w-[calc(min(50%,400px))] sm:w-full h-dvh py-5 flex flex-col gap-6 items-center justify-center">
          <Connect/>
          {render()}
        </div>
      </main>
    </div>
  );
}
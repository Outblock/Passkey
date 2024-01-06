import { Card, CardBody, CardHeader, Tabs, Tab } from "@nextui-org/react";
import { StoreContext } from "../../contexts";
import { useEffect, useState, useContext } from "react";
import styles from "../../styles/Home.module.css";
import { FaKey } from "react-icons/fa6";
import { KEY_TAB } from './keyTab';

const Import = ({ address }) => {
  const { store, setStore } = useContext(StoreContext);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className="w-1/2 min-w-[calc(max(50%,400px))] max-w-[calc(min(50%,400px))] sm:w-full h-dvh py-5 flex flex-col gap-6 items-center justify-center">
          <Card className="">
            <div className="flex flex-col w-full gap-4 px-6 pt-6 items-start">
              <div className="flex items-center gap-4">
                <FaKey className="text-2xl" />
                <h1 className="text-2xl font-bold text-gray-300">
                  Import Address
                </h1>
              </div>
              <h1 className="text-1xl text-gray-500 pb-3">
                Support Flow Wallet, Blocto, seed phrase, json and private key
              </h1>
            </div>
            <CardBody className="w-full">
              <div className="flex w-full flex-col">
                <Tabs
                  aria-label="Options"
                  color="warning"
                  variant="solid"
                  fullWidth
                  items={KEY_TAB}
                >
                {(item) => (
                    <Tab
                    key={item.id}
                    title={
                      <div className="flex items-center space-x-2">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                    }
                  >
                    {item.node}
                    </Tab>
                )}
                </Tabs>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Import;

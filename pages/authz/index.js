import {
  Button,
  Card,
  CardBody,
  Avatar,
  Divider,
  Snippet,
  Code,
  Textarea,
} from "@nextui-org/react";
import { StoreContext } from "../../contexts";
import { useEffect, useState, useContext } from "react";
import * as fcl from "@onflow/fcl";
import { RiGlobalLine } from "react-icons/ri";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import { signWithKey } from "../../utils/sign";

const Authz = () => {
  const { store } = useContext(StoreContext);
  const [authzInfo, setAuthzInfo] = useState(null);

  useEffect(() => {
    const callback = (msg) => {
      console.log("msg ==>", msg);
      setAuthzInfo(msg);
    };
    try {
      fcl.WalletUtils.ready(callback);
    } catch (err) {}
  }, []);

  const onApproval = async () => {
    fcl.WalletUtils.approve({
      f_type: "CompositeSignature",
      f_vsn: "1.0.0",
      addr: store.address,
      network: store.network,
      signature: await signWithKey(store, authzInfo.body.message)
    });
  };

  const onReject = () => {
    fcl.WalletUtils.decline("Declined by user.");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>MONO - Transaction Request</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <div className="w-2/3 max-w-7xl flex flex-col gap-4">
          <Card>
            {authzInfo && (
              <CardBody className="flex flex-col space-y-4 p-6">
                <div className="flex items-center gap-4">
                  {/* <FaWallet className="text-2xl" /> */}
                  <Avatar
                    size="lg"
                    src={authzInfo.config.app.icon}
                  />
                  <div className="flex flex-col gap-1">
                    <h1 className="text-1xl font-bold text-gray-500">
                      Transaction Request from
                    </h1>
                    <h1 className="text-2xl font-bold text-gray-300">
                        {authzInfo.config.app.title}
                    </h1>
                  </div>
                </div>

                <div className="flex bg-zinc-800 items-center px-4 py-2 rounded-medium gap-2">
                  <RiGlobalLine className="text-lg text-blue-100" />
                  <h1 className="text-lg font-normal text-blue-100">
                    https://test.opensea.io
                  </h1>
                </div>

                <Textarea
                  isReadOnly
                  fullWidth
                  label="Cadence"
                  variant="flat"
                    // labelPlacement="outside"
                  placeholder="Enter your description"
                  defaultValue={authzInfo.body.cadence}
                  className="w-full max-h-30"
                />

                <div className="flex gap-4 h-12">
                  <Button
                    color="default"
                    className="w-full h-full"
                    onPress={onReject}
                  >
                    Cancel
                  </Button>

                  <Button
                    color="primary"
                    variant="solid"
                    className="w-full h-full"
                    onPress={onApproval}
                  >
                    Approve
                  </Button>
                </div>
              </CardBody>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Authz;

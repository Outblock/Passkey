import {
    Button,
    Card,
    CardBody,
    Avatar,
    Divider,
    Snippet,
  } from "@nextui-org/react";
  import { StoreContext } from "../../contexts";
  import { useEffect, useState, useContext } from "react";
  import { FaWallet } from "react-icons/fa";
  import { fmtFlow } from "../../utils";
  import * as fcl from "@onflow/fcl";
  import { RiGlobalLine } from "react-icons/ri";
  
  const Connect = ({ address }) => {
    const { store, setStore } = useContext(StoreContext);
  
    useEffect(() => {

        const callback = (msg) => {
            console.log("msg ==>", msg);
            setAuthnInfo(msg)
        }

        fcl.WalletUtils.onMessageFromFCL('FCL:VIEW:READY:RESPONSE', callback)
        fcl.WalletUtils.sendMsgToFCL('FCL:VIEW:READY')
    }, [])

    const onApproval = () => {

    }

    const onReject = () => {

    }

    return (
      <Card>
        <CardBody className="flex flex-col space-y-4 p-6">
          <div className="flex items-center gap-4">
            {/* <FaWallet className="text-2xl" /> */}
            <Avatar
            size="lg"
            src="https://github.com/Outblock/Assets/blob/main/ft/flow/logo.png?raw=true"
          />
            <div className="flex flex-col gap-1">
                <h1 className="text-1xl font-bold text-gray-500">Connecting to</h1>
                <h1 className="text-2xl font-bold text-gray-300">Harness</h1>
            </div>
          </div>

          <div className="flex bg-zinc-800 items-center px-4 py-2 rounded-medium gap-2">
            <RiGlobalLine className="text-lg text-blue-100" />
            <h1 className="text-lg font-normal text-blue-100">https://test.opensea.io</h1>
            </div>

            <div className="flex gap-4 h-10">
            <Button color="default" className="w-full" onPress={onReject}>
                Cancel
            </Button>

            <Button color="primary" variant="solid" className="w-full" onPress={onApproval}>
                Connect
            </Button>
            </div>
        </CardBody>
      </Card>
    );
  };
  
  export default Connect;
  
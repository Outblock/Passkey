import {
    Button,
    Card,
    CardBody,
    Avatar,
    Divider,
    Snippet,
  } from "@nextui-org/react";
  import { StoreContext } from "../contexts";
  import { useEffect, useState, useContext } from "react";
  import { FaWallet } from "react-icons/fa";
  import { fmtFlow } from "../utils";
  import * as fcl from "@onflow/fcl";
  import { RiGlobalLine } from "react-icons/ri";
  
  const Connect = ({ address }) => {
    const { store, setStore } = useContext(StoreContext);
    const [authnInfo, setAuthnInfo] = useState(null);

    useEffect(() => {
        const callback = (msg) => {
            console.log("msg ==>", msg);
            setAuthnInfo(msg)
        }
        try {
            fcl.WalletUtils.ready(callback)
        } catch (err) {

        }
    }, [])

    const onApproval = () => {
        fcl.WalletUtils.approve({ 
            f_type: "AuthnResponse",
            f_vsn: "1.0.0",
            addr: store.address,
            network: store.network,
            services: [
                {
                    type: "authn",
                    uid: "fpk#authn",
                    f_type: "Service",                  
                    f_vsn: "1.0.0",
                    type: "authn", 
                    id: store.address,
                    identity: { 
                        address: store.address
                    },
                    provider: {
                        address: "0x7179def56a8b9c5e",
                        description: "A wallet created for everyone.",
                        f_type: "ServiceProvider",
                        f_vsn: "1.0.0",
                        icon: "https://lilico.app/fcw-logo.png",
                        name: "Flow PassKey"
                    }
                },
                {
                    endpoint: `${window.location.origin}/authz`,
                    f_type: "Service",
                    f_vsn: "1.0.0",
                    identity: {address: store.address, keyId: 0},
                    method: "POP/RPC",
                    network: store.network,
                    type: "authz",
                    uid: "fpk#authz"
                }
            ]
        })
    }

    const onReject = () => {
        fcl.WalletUtils.decline("Declined by user.")
    }

    return (
      <Card>
        {authnInfo &&
        <CardBody className="flex flex-col space-y-4 p-6">
          <div className="flex items-center gap-4">
            {/* <FaWallet className="text-2xl" /> */}
            <Avatar
            size="lg"
            src={authnInfo.config.app.icon}
          />
            <div className="flex flex-col gap-1">
                <h1 className="text-1xl font-bold text-gray-500">Connecting to</h1>
                <h1 className="text-2xl font-bold text-gray-300">{authnInfo.config.app.title}</h1>
            </div>
          </div>

          <div className="flex bg-zinc-800 items-center px-4 py-2 rounded-medium gap-2">
            <RiGlobalLine className="text-lg text-blue-100" />
            <h1 className="text-lg font-normal text-blue-100">{authnInfo.config.client.hostname}</h1>
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
  }
      </Card>
    );
  };
  
  export default Connect;
  
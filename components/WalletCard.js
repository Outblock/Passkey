import {
  Button,
  Card,
  CardBody,
  Avatar,
  Divider,
  Snippet,
  Tabs,
  Tab,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { StoreContext } from "../contexts";
import { useEffect, useState, useContext } from "react";
import { FaWallet } from "react-icons/fa";
import { fmtFlow } from "../utils";
import KeyInfoCard from "./KeyInfoCard";
import * as fcl from "@onflow/fcl";
import { IoExitOutline } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";

const WalletCard = ({ address }) => {
  const { store, setStore } = useContext(StoreContext);
  const [balance, setBalance] = useState(0.0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const result = await fcl.account(address);
        console.log("fetchBalance ==>", result);
        setBalance(result.balance);
      } catch {
        setBalance("Error");
      }
    };

    if (address) {
      fetchBalance();
      const userInfo = { ...store };
      delete userInfo.keyInfo;
      window.localStorage.setItem("store", JSON.stringify(userInfo));
    }
  }, [address]);

  return (
    <Card className="w-full h-full">
      <CardBody className="flex flex-col space-y-4 p-6">
        <div className="flex items-center gap-4">
          <FaWallet className="text-2xl" />
          <h1 className="text-3xl font-bold text-gray-300">Flow Wallet</h1>
          {/* <Chip
            color="success"
            size="sm"
            variant="flat"
            className="uppercase text-xs"
          >
            {store.network}
          </Chip> */}
          <div className="grow" />
          <Tooltip showArrow={true} content="Log out" className="dark">
            <Button
              isIconOnly
              aria-label="Exit"
              variant="light"
              onPress={() => {
                setStore({});
                window.localStorage.removeItem("store");
              }}
            >
              <IoExitOutline className="text-2xl text-danger" />
            </Button>
          </Tooltip>
        </div>

        <Card>
          <CardBody>
            <div className="flex items-center gap-6">
              <Avatar
                isBordered={store.network !== 'mainnet'}
                name="🤑"
                color="success"
                size="md"
                className="text-2xl bg-yellow-500"
              />
              <div className="flex flex-col items-start gap-2 grow">
                <div className="flex gap-2">
                  <h1 className="font-bold">Name</h1>
                  <Chip
                    color="success"
                    size="sm"
                    variant="flat"
                    className="uppercase text-xs"
                  >
                    {store.network}
                  </Chip>
                </div>
                <h1 className="text-gray-400">{store.address}</h1>
              </div>
              <Button
                variant="light"
                isIconOnly
                onPress={() => {
                  navigator.clipboard.writeText(store.address);
                }}
              >
                <LuCopy className="text-lg" />
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* <Snippet
          size="md"
          symbol=""
          tooltipProps={{
            color: "foreground",
          }}
        >
          {store.address}
        </Snippet> */}

        <Divider />

        {/* <h1 className="text-1xl text-gray-500 pb-3">
          This is a Demo for showing the passkey on flow blockchain.
        </h1> */}

        <Tabs aria-label="Options" fullWidth>
          <Tab key="Tokens" title="Tokens">
            <div className="flex items-center gap-4">
              {/* <Avatar color="success" src={`https://source.boringavatars.com/marble/160/${store.address}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`}/> */}
              <Avatar
                size="sm"
                src="https://github.com/Outblock/Assets/blob/main/ft/flow/logo.png?raw=true"
              />
              <div className="flex flex-col gap-2">
                <h1 className="text-1xl text-gray-300">Flow</h1>
              </div>

              <div className="flex items-center gap-1 justify-end grow">
                <h1 className="text-1xl text-gray-300">{fmtFlow(balance)}</h1>
                <h1 className="text-1xl text-gray-500 uppercase">Flow</h1>
              </div>
            </div>
          </Tab>

          <Tab key="Key" title="Key">
            <KeyInfoCard />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default WalletCard;

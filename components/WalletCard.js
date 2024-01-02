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

const WalletCard = ({ address }) => {
  const { store, setStore } = useContext(StoreContext);

  const [balance, setBalance] = useState(0.0);

  useEffect(() => {
    const fetchBalance = async () => {
      const result = await fcl.account(address);
      console.log("fetchBalance ==>", result);
      setBalance(result.balance);
    };

    if (address) {
      fetchBalance();
    }
  }, [address]);

  return (
    <Card>
      <CardBody className="flex flex-col space-y-4 p-6">
        <div className="flex items-center gap-4">
          <FaWallet className="text-2xl" />
          <h1 className="text-3xl font-bold text-gray-300">Wallet</h1>

          <Snippet
            size="md"
            symbol=" "
            tooltipProps={{
              color: "foreground",
            }}
          >
            {store.address}
          </Snippet>
        </div>

        <Divider />

        {/* <h1 className="text-1xl text-gray-500 pb-3">
          This is a Demo for showing the passkey on flow blockchain.
        </h1> */}

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
      </CardBody>
    </Card>
  );
};

export default WalletCard;

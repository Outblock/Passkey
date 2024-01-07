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
  ButtonGroup,
  CardHeader,
  CardFooter,
  useDisclosure,
} from "@nextui-org/react";
import { StoreContext } from "../contexts";
import { useEffect, useState, useContext } from "react";
import { FaWallet } from "react-icons/fa";
import KeyInfoCard from "./setting/KeyInfoCard";
import * as fcl from "@onflow/fcl";
import { IoExitOutline } from "react-icons/io5";
import { LuCopy } from "react-icons/lu";
import {
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoAddOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5";
import SignOut from "./sign/SignOut";
import { CustomTab } from "./tab/CustomTab";
import Setting from "./setting/Setting";
import TokenList from "./token/TokenList";
import { IoCardOutline } from "react-icons/io5";
import { isEnableBiometric } from "../account";

const WalletCard = ({ address }) => {
  const { store, setStore } = useContext(StoreContext);
  const [balance, setBalance] = useState(0.0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState("Setting");

  useEffect(() => {
    if (address) {
      // const userInfo = { ...store };
      // if (isEnableBiometric) {
      //   delete userInfo.keyInfo;
      // }
      // window.localStorage.setItem("store", JSON.stringify(userInfo));
    }
  }, [address]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-col w-full gap-4 px-6 pt-6">
        <div className="flex items-center gap-4 w-full">
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
              onPress={onOpen}
            >
              <IoExitOutline className="text-2xl text-danger" />
            </Button>
          </Tooltip>
        </div>

        <Card className="w-full">
          <CardBody className="px-4">
            <div className="flex items-center gap-6">
              <Avatar
                isBordered={process.env.network !== "mainnet"}
                name="🤑"
                color="success"
                size="md"
                className="text-2xl bg-yellow-500"
              />
              <div className="flex flex-col items-start gap-2 grow">
                <div className="flex gap-2">
                  <h1 className="font-bold">{store.username || "Name"}</h1>
                  <Chip
                    color="success"
                    size="sm"
                    variant="flat"
                    className="uppercase text-xs"
                  >
                    {process.env.network}
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

        <div className="flex items-center w-full gap-4">
          <ButtonGroup
            // radius="full"
            className="basis-3/4 w-full grow"
            isDisabled
          >
            <Button className="w-full">
              <IoArrowUpOutline className="text-lg" />
            </Button>
            <Button className="w-full">
              <IoSwapHorizontalOutline className="text-lg" />
            </Button>
            <Button className="w-full">
              <IoArrowDownOutline className="text-lg" />
            </Button>
          </ButtonGroup>

          <Button
            className="basis-1/4 w-full"
            // radius="full"
            isDisabled
            startContent={<IoCardOutline className="text-lg" />}
          >
            Buy
          </Button>
        </div>

        <Divider />
      </CardHeader>

      <CardBody className="flex flex-col space-y-4 px-6">
        <SignOut isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
        <Tabs aria-label="Options"  selectedKey={selected} onSelectionChange={setSelected} fullWidth radius="full" className="hidden">
          <Tab key="Token" title="Tokens" className="!mt-0 h-full py-0">
            <TokenList/>
          </Tab>

          <Tab key="Setting" title="Key" className="!mt-0 h-full">
            <Setting />
          </Tab>
        </Tabs>
      </CardBody>
      <CardFooter className="w-full">
        <CustomTab selected={selected} setSelected={setSelected}/>
      </CardFooter>
    </Card>
  );
};

export default WalletCard;

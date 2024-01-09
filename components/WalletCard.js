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
import { TAB } from "./tab/Tab";
import toast from "react-hot-toast";

const WalletCard = ({ address }) => {
  const { store, setStore } = useContext(StoreContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState("Token");

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-col w-full gap-4 px-6 pt-6 pb-0">
        <div className="flex items-center gap-4 w-full">
          <FaWallet className="text-2xl" />
          <h1 className="text-3xl font-bold text-gray-300">Flow Wallet</h1>
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
                  {process.env.network !== "mainnet" && (
                    <Chip
                      color="success"
                      size="sm"
                      variant="flat"
                      className="uppercase text-xs"
                    >
                      {process.env.network}
                    </Chip>
                  )}
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
            // isDisabled
          >
            <Button className="w-full" onPress={()=> toast('Coming Soon', {icon: '🚧'})}>
              <IoArrowUpOutline className="text-lg" />
              <p className="hidden sm:block">Send</p>
            </Button>
            <Button className="w-full" onPress={()=> toast('Coming Soon', {icon: '🚧'})}>
              <IoSwapHorizontalOutline className="text-lg" />
              <p className="hidden sm:block">Swap</p>
            </Button>
            <Button className="w-full" onPress={()=> toast('Coming Soon', {icon: '🚧'})}>
              <IoArrowDownOutline className="text-lg" />
              <p className="hidden sm:block">Receive</p>
            </Button>
          </ButtonGroup>

          <Button
            className="basis-1/4 w-full"
            // radius="full"
            // isDisabled
            startContent={<IoCardOutline className="text-lg" />}
            onPress={()=> toast('Coming Soon', {icon: '🚧'})}
          >
            <p className="hidden sm:block">Buy</p>
          </Button>
        </div>

        <Divider />
      </CardHeader>

      <CardBody className="flex flex-col  px-6 p-2">
        <SignOut isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
        <Tabs
          aria-label="Options"
          items={TAB}
          selectedKey={selected}
          onSelectionChange={setSelected}
          fullWidth
          radius="full"
          className="hidden"
        >
          {(item) => (
            <Tab key={item.id} title={item.id} className="!mt-0 h-full py-0">
              {(() => {
                switch (item.id) {
                  case 'Token':
                    return (<TokenList/>)
                  case 'NFT':
                    return (<p> This is a NFT Tab </p>)
                  case 'Setting':
                    return (<Setting />)
                }
              })()}
            </Tab>
          )}
        </Tabs>
      </CardBody>
      <CardFooter className="w-full">
        <CustomTab selected={selected} setSelected={setSelected} />
      </CardFooter>
    </Card>
  );
};

export default WalletCard;

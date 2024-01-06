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
  
  const WalletCard = ({ address }) => {
    const { store, setStore } = useContext(StoreContext);
    const [balance, setBalance] = useState(0.0);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selected, setSelected] = useState("Setting");
  
    useEffect(() => {
      if (address) {
        const userInfo = { ...store };
        if (window.localStorage.getItem('enableBiometric') === 'true') {
          console.log('delete', window.localStorage.getItem('enableBiometric'))
          delete userInfo.keyInfo;
        }
        window.localStorage.setItem("store", JSON.stringify(userInfo));
      }
    }, [address]);
  
    return (
      <Card className="w-full h-full">
        <CardHeader className="flex flex-col w-full gap-4 px-6 pt-6">
        </CardHeader>
        <CardBody>
        </CardBody>
      </Card>
    );
  };
  
  export default WalletCard;
  
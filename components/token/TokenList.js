import {
    FaHashtag,
  } from "react-icons/fa6";
  import { TbMathMax } from "react-icons/tb";
  import {
    Listbox,
    ListboxSection,
    ListboxItem,
    Avatar
  } from "@nextui-org/react";
  import { useContext, useEffect, useState } from "react";
  import { StoreContext } from "../../contexts";
  import * as fcl from "@onflow/fcl";
  import TokenItem from "./TokenItem"

  const flowTokenInfo = {
    name: "Flow",
    symbol: "FLOW",
    icon: "https://github.com/Outblock/Assets/blob/main/ft/flow/logo.png?raw=true",
}


  const TokenList = () => {
    const { store } = useContext(StoreContext);
    const [tokenInfo, setTokenInfo] = useState(flowTokenInfo)

    useEffect(() => {
        const fetchBalance = async () => {
          try {
            const result = await fcl.account(store.address);
            console.log("fetchBalance ==>", result);
            setTokenInfo((s) => ({...s, balance: result.balance}))
          } catch (e) {
            console.log("error ==>", e)
          }
        };
    
        if (store.address) {
          fetchBalance();
          // const userInfo = { ...store };
          // delete userInfo.keyInfo;
          // window.localStorage.setItem("store", JSON.stringify(userInfo));
        }
      }, []);

    return (

        <Listbox
          aria-label="Actions"
          variant="flat"
          onAction={(key) => alert(key)}
        >
        <ListboxItem  key="new"> <TokenItem tokenInfo={tokenInfo}/> </ListboxItem>
        </Listbox> 

    );
  };
  
  export default TokenList;
  
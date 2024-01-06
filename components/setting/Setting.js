import {
    FaRegIdBadge,
    FaCircleUser,
    FaKey,
    FaHashtag,
    FaArrowDownWideShort,
  } from "react-icons/fa6";
  import { TbMathMax } from "react-icons/tb";
  import {
    Button,
    Card,
    CardBody,
    Code,
    Divider,
    Chip,
    Input,
    Progress,
    Switch,
  } from "@nextui-org/react";
  import { useContext, useEffect, useState } from "react";
  import { StoreContext } from "../../contexts";
  import { getPasskey, getPKfromLogin } from "../../utils/passkey";
  import { FLOW_BIP44_PATH } from "../../utils/constants";
import KeyInfoCard from "./KeyInfoCard";
import { IoKeyOutline, IoChevronForwardOutline, IoChevronBackOutline, IoFingerPrintOutline} from "react-icons/io5";

  const Setting = () => {
    const [isSelected, setIsSelected] = useState(window.localStorage.getItem('enableBiometric') === 'true');
    const { store, setStore } = useContext(StoreContext);
    const [isExpanded, setExpanded] = useState(false)

    // useEffect(()=> {
    //     const value = window.localStorage.getItem('enableBiometric') === 'true'
    //     console.log()
    //     setIsSelected(value)
    // },[])

    const handleKeyInfo = async (isSelected) => {
        console.log("handleKeyInfo ==>", isSelected)
        if (isSelected) {
            const userInfo = { ...store };
            delete userInfo.keyInfo;
            setStore(userInfo)
            window.localStorage.setItem("store", JSON.stringify(userInfo));
        } else {
            const result = await getPasskey(store.id)
            const keyInfo = await getPKfromLogin(result);
            console.log("handleKeyInfo keyInfo ==>",store, keyInfo)
            setStore((s)=>({...s, keyInfo: keyInfo}))
            window.localStorage.setItem("store", JSON.stringify({...store, keyInfo: keyInfo}));
        }
    }
  
    return (
        <div className="flex flex-col gap-3">
        <Card>
            <CardBody>
                <div className="flex items-center gap-4">
                    <IoFingerPrintOutline className="text-2xl text-gray-300"/> 
                    <div className="flex flex-col grow">
                        <p className="font-bold text-sm">Biometric</p>
                        <p className="text-sm text-gray-500">Enable biometric check every time</p>
                    </div>
                    <Switch isSelected={isSelected} onValueChange={async () => {
                        console.log("onValueChange ==>", isSelected)
                        setIsSelected(!isSelected); 
                        window.localStorage.setItem('enableBiometric',!isSelected)
                        handleKeyInfo(!isSelected)
                    }} />
                </div>
            </CardBody>
        </Card>

        <Card>
            <CardBody className="gap-2 transition-transform">
                <div className="flex items-center gap-4" onClick={() => setExpanded((s) => (!isExpanded))}>
                    <IoKeyOutline className="text-2xl text-gray-300"/> 
                    <div className="flex flex-col grow ">
                        <p className="font-bold text-sm">Private Key</p>
                        <p className="text-sm text-gray-500">View seed phrase and private key</p>
                    </div>
                    {isExpanded ? <IoChevronForwardOutline className="text-lg text-gray-500"/> : <IoChevronForwardOutline className="text-lg text-gray-500"/>}
                </div>

                {isExpanded && <KeyInfoCard className="transition-transform"/>}
            </CardBody>
        </Card>

        </div>
    );
  };
  
  export default Setting;
  
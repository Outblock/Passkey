import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Chip,
  AvatarGroup,
  Avatar
} from "@nextui-org/react";
import { StoreContext } from "../../contexts";
import { FaKey } from "react-icons/fa6";
import {
  createPasskey,
  getPasskey,
  getPKfromLogin,
  getPKfromRegister,
} from "../../utils/passkey";
import { useEffect, useState, useContext } from "react";
import { getUsername } from "../../modules/settings";
import { IoKeyOutline, IoChevronForwardOutline, IoChevronBackOutline, IoFingerPrintOutline} from "react-icons/io5";
import Router from 'next/router';
import { isEnableBiometric, login } from "../../account";
import { toast } from 'sonner'

const SignCard = () => {
  const network = process.env.network;
  const [username, setUsername] = useState("");
  const [registerInfo, setRegisterInfo] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);
  const { store, setStore } = useContext(StoreContext);

  useEffect(() => {
    const decodeLoginInfo = async () => {
      console.log("loginInfo ==>", loginInfo);
      const result = await getPKfromLogin(loginInfo);

      const response = await fetch("/api/getAddress", {
        method: "POST",
        body: JSON.stringify({
          publicKey: result.pubK,
          network: network,
          apikey: process.env.apikey,
        }),
      });

      const body = await response.json();
      console.log("body ==>", body);
      if (body.data && body.data.length > 0) {
        const user = {...store}
        user.address = body.data[0].address
        user.id = loginInfo.id
        user.username = getUsername(loginInfo.id)
        if (isEnableBiometric()) {
          delete result.pk
          delete result.mnemonic
        }
        user.keyInfo = result
        setStore(user);
        login(user)
      }
    };

    if (loginInfo) {
      decodeLoginInfo();
    }
  }, [loginInfo, network]);

  useEffect(() => {
    const decodeRegisterInfo = async () => {
      const result = await getPKfromRegister(registerInfo);
      setStore((s) => ({
        ...s,
        keyInfo: result,
        id: registerInfo.result.id,
        username: username,
        isCreating: true
      }));

      const response = await fetch("/api/createAddress", {
        method: "POST",
        body: JSON.stringify({
          publicKey: result.pubK,
          network: network,
          apikey: process.env.apikey,
        }),
      });
      const body = await response.json();
      if (body.txId) {
        setStore((s) => ({ ...s, txId: body.txId}));
      }
      console.log("txId =>", body.txId);
    };
    if (registerInfo && registerInfo.userId) {
      console.log("registerInfo 1111");
      decodeRegisterInfo();
    }
  }, [registerInfo, network]);

  return (
    <div className="flex flex-col gap-4">
    <Card>
      <CardBody className="flex flex-col space-y-4 p-6">
        <div className="flex items-center gap-4">
          <FaKey className="text-2xl" />
          <h1 className="text-3xl font-bold text-gray-300">Passkey on Flow</h1>
          { process.env.network !== 'mainnet' && <Chip
            color="success"
            size="sm"
            variant="flat"
            className="uppercase text-xs"
          >
            {process.env.network}
          </Chip>}
        </div>
        <h1 className="text-1xl text-gray-500 pb-3">
          This is a Demo for showing the passkey on flow blockchain.
        </h1>

        <Input
          isClearable
          type="text"
          label="Username"
          value={username}
          description="Create your username for passkey"
          onValueChange={setUsername}
        />

        <Button
          color="primary"
          variant="solid"
          // startContent={<FaCircleUser />}
          onPress={async () =>
            setRegisterInfo(await createPasskey(username, username))
          }
        >
          Register
        </Button>

        <div className="flex items-center gap-6 justify-center">
          <Divider className="w-5/12" />
          <p className="text-gray-500">or</p>
          <Divider className="w-5/12" />
        </div>

        <Button
          color="warning"
          variant="solid"
          // startContent={<FaRegIdBadge />}
          onPress={async () => {
            const result = await getPasskey(store.id || "");
            setLoginInfo(result);
          }}
        >
          Sign In
        </Button>
      </CardBody>
    </Card>
    <Button className="bg-zinc-900 py-10 px-6" onPress={()=>{Router.push('/import')}}>
      <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-2 grow items-start">
        <p className="font-semibold text-base inline-flex items-center">Import address <IoChevronForwardOutline className="text-[#FF7964]"/> </p>
        <p className="text-gray-500 text-sm">Support Flow Wallet, Blocto, json and raw key</p>
      </div>

      <AvatarGroup isBordered size="sm" >
      <Avatar src="https://static.vecteezy.com/system/resources/previews/017/395/378/original/google-drive-icons-free-png.png" />
      <Avatar src="https://github.com/Outblock/fcl-swift/blob/main/Assets/blocto/logo.jpg?raw=true" />
      <Avatar src="https://frw-link.lilico.app/_next/image?url=%2Flogo.png&w=256&q=75" />
    </AvatarGroup>

      </div>
      </Button>
    </div>
    
  );
};

export default SignCard;

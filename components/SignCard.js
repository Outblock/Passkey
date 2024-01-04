import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { StoreContext } from "../contexts";
import { FaKey } from "react-icons/fa6";
import { createPasskey, getPasskey, getPKfromLogin, getPKfromRegister } from "../utils/passkey";
import { useEffect, useState, useContext } from "react";
import { getUsername } from "../modules/settings"

const SignCard = () => {
  const network = process.env.network;
  const [username, setUsername] = useState("");
  const [registerInfo, setRegisterInfo] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);
  const {store, setStore} = useContext(StoreContext);

  useEffect(() => {
    const decodeLoginInfo = async () => {
      console.log("loginInfo ==>", loginInfo);
      const result = await getPKfromLogin(loginInfo);
      // console.log("id ===>", loginInfo.id)

      setStore((s) => ({...s, id: loginInfo.id, username: getUsername(loginInfo.id,)}));

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
        setStore((s) => ({...s, address: body.data[0].address}))
      }
    };

    if (loginInfo) {
      decodeLoginInfo();
    }
  }, [loginInfo, network]);

  useEffect(() => {
    const decodeRegisterInfo = async () => {
      const result = await getPKfromRegister(registerInfo);
      console.log("id ===>", registerInfo.result.id)
      setStore((s) => ({...s, keyInfo: result, id: registerInfo.result.id, username: username}));

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
        setStore((s) => ({...s, txId: body.txId, isCreating: true}));
      }
      console.log("txId =>", body.txId);
    };
    if (registerInfo && registerInfo.userId) {
      console.log("registerInfo 1111");
      decodeRegisterInfo();
    }
  }, [registerInfo, network]);

  return (
    <Card>
      <CardBody className="flex flex-col space-y-4 p-6">
        <div className="flex items-center gap-4">
          <FaKey className="text-2xl" />
          <h1 className="text-3xl font-bold text-gray-300">Passkey on Flow</h1>
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
          color="default"
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
  );
};

export default SignCard;

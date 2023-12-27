import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Button, Card, CardBody, Code, Divider, Chip } from "@nextui-org/react";
import {
  FaRegIdBadge,
  FaCircleUser,
  FaKey,
  FaHashtag,
  FaArrowDownWideShort,
} from "react-icons/fa6";
import {
  createPasskey,
  getPasskey,
  getPKfromLogin,
  getPKfromRegister,
} from "../utils/passkey";
import { useEffect, useState } from "react";
import { TbMathMax } from "react-icons/tb";

export default function Home() {
  const [registerInfo, setRegisterInfo] = useState(null);
  const [loginInfo, setLoginInfo] = useState(null);
  const [keyInfo, setKeyInfo] = useState(null);

  useEffect(() => {
    const decodeLoginInfo = async () => {
      const result = await getPKfromLogin(loginInfo);
      console.log(result);
      setKeyInfo(result);
    };

    if (loginInfo) {
      decodeLoginInfo();
    }
  }, [loginInfo]);

  useEffect(() => {
    const decodeRegisterInfo = async () => {
      const result = await getPKfromRegister(registerInfo);
      console.log(result);
      setKeyInfo(result);
    };

    console.log("registerInfo ==>", registerInfo);

    if (registerInfo && registerInfo.userId) {
      console.log("registerInfo 1111");
      decodeRegisterInfo();
    }
  }, [registerInfo]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Card className="max-w-fit bottom-3">
          <CardBody className="flex flex-col space-y-4">
            <div className="flex items-center gap-4">
              <FaKey className="text-2xl" />
              <h1 className="text-3xl font-bold text-gray-300">
                Passkey on Flow
              </h1>
            </div>
            <h1 className="text-1xl text-gray-500">
              {" "}
              This is a Demo for showing the passkey on flow blockchain.
            </h1>
            <Button
              color="primary"
              variant="solid"
              // startContent={<FaCircleUser />}
              onPress={async () =>
                setRegisterInfo(
                  await createPasskey("Test Name", "Test Display Name")
                )
              }
            >
              Register
            </Button>
            <Button
              color="default"
              variant="solid"
              // startContent={<FaRegIdBadge />}
              onPress={async () => {
                const result = await getPasskey();
                setLoginInfo(result);
              }}
            >
              Sign In
            </Button>
          </CardBody>
        </Card>

        {keyInfo && (
          <Card className="w-1/3">
            <CardBody className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <FaArrowDownWideShort className="text-2xl" />
                <h1 className="text-2xl font-bold text-gray-300"> Result </h1>
              </div>
              <Divider />

              <div class="grid grid-cols-4 gap-4 overflow-auto">
                <h6> Mnemonic </h6>
                <div class="col-span-3">
                  <Code className="whitespace-normal">{keyInfo.mnemonic}</Code>
                </div>

                <h6> BIP44 Path </h6>
                <div className="col-span-3">
                  <Code className="whitespace-normal w-full">
                    m/44&apos;/539&apos;/0&apos;/0/0
                  </Code>
                </div>

                <h6> Private Key </h6>
                <div class="col-span-3 place-self-auto h-auto min-h-fit">
                  <Code className="whitespace-normal w-full">{keyInfo.pk}</Code>
                </div>

                <h6> Public Key </h6>
                <div class="col-span-3 ">
                  <Code className="whitespace-normal w-full">
                    {keyInfo.pubK}
                  </Code>
                </div>

                <div className="col-span-3 justify-self-end">
                  <Chip startContent={<TbMathMax />} variant="faded">
                    Secp256r1
                  </Chip>
                </div>

                <Chip
                  // className= "row-end-1"
                  startContent={<FaHashtag />}
                  variant="faded"
                >
                  SHA-256
                </Chip>
              </div>
            </CardBody>
          </Card>
        )}
      </main>
    </div>
  );
}

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
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../contexts";
import { getPasskey, getPKfromLogin } from "../utils/passkey";
import { FLOW_BIP44_PATH } from "../utils/constants";

const KeyInfoCard = () => {
  const { store } = useContext(StoreContext);

  const [keyInfo, setKeyInfo] = useState(null);

  useEffect(() => {
    const fetchKeyInfo = async () => {
        console.log("fetchKeyInfo ==>", store.id)
      const result = await getPasskey(store.id || "");
      const keyInfo = await getPKfromLogin(result);
      setKeyInfo(keyInfo);
    };

    fetchKeyInfo();
  }, []);

  return (
    <Card>
      {keyInfo && (
        <CardBody className="flex flex-col space-y-4 p-6">
          {/* <div className="flex items-center gap-4">
          <FaArrowDownWideShort className="text-2xl" />
          <h1 className="text-2xl font-bold text-gray-300"> Result </h1>
        </div>
        <Divider /> */}

          <div className="grid grid-cols-4 gap-4 overflow-auto">
            {/* {store.address && <h6> Address </h6>}
          {store.address && (
            <div className="col-span-3">
              <Code className="whitespace-normal">{store.address}</Code>
            </div>
          )} */}

            <h6> Mnemonic </h6>
            <div className="col-span-3">
              <Code className="whitespace-normal">{keyInfo.mnemonic}</Code>
            </div>

            <h6> BIP44 Path </h6>
            <div className="col-span-3">
              <Code className="whitespace-normal w-full">
                {FLOW_BIP44_PATH}
              </Code>
            </div>

            <h6> Private Key </h6>
            <div className="col-span-3 place-self-auto h-auto min-h-fit">
              <Code className="whitespace-normal w-full">{keyInfo.pk}</Code>
            </div>

            <h6> Public Key </h6>
            <div className="col-span-3 ">
              <Code className="whitespace-normal w-full">{keyInfo.pubK}</Code>
            </div>

            <div className="col-span-4 justify-self-end">
              <div className="flex justify-self-end gap-4">
                <Chip startContent={<TbMathMax />} variant="faded">
                  Secp256r1
                </Chip>

                <Chip startContent={<FaHashtag />} variant="faded">
                  SHA-256
                </Chip>
              </div>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  );
};

export default KeyInfoCard;

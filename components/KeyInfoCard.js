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

const KeyInfoCard = ({keyInfo}) => {
  return (
    <Card>
      <CardBody className="flex flex-col space-y-4 p-6">
        <div className="flex items-center gap-4">
          <FaArrowDownWideShort className="text-2xl" />
          <h1 className="text-2xl font-bold text-gray-300"> Result </h1>
        </div>
        <Divider />

        <div className="grid grid-cols-4 gap-4 overflow-auto">
          <h6> Mnemonic </h6>
          <div className="col-span-3">
            <Code className="whitespace-normal">{keyInfo.mnemonic}</Code>
          </div>

          <h6> BIP44 Path </h6>
          <div className="col-span-3">
            <Code className="whitespace-normal w-full">
              m/44&apos;/539&apos;/0&apos;/0/0
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
    </Card>
  );
};

export default KeyInfoCard;
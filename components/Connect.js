import {
  Button,
  Card,
  CardBody,
  Avatar,
  Divider,
  Snippet,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox
} from "@nextui-org/react";
import { StoreContext } from "../contexts";
import { useEffect, useState, useContext } from "react";
import { FaWallet } from "react-icons/fa";
import { fmtFlow } from "../utils";
import * as fcl from "@onflow/fcl";
import { RiGlobalLine } from "react-icons/ri";
import { FaCircleCheck } from "react-icons/fa6";

const Connect = ({ address }) => {
  const { store, setStore } = useContext(StoreContext);
  const [authnInfo, setAuthnInfo] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const callback = (msg) => {
      console.log("msg ==>", msg);
      setAuthnInfo(msg);
      onOpen();
    };
    try {
      fcl.WalletUtils.ready(callback);
    } catch (err) {}

    window.addEventListener("message", (d) => {
      console.log("Harness Message Received", d.data);
    });
  }, []);

  const onApproval = () => {
    fcl.WalletUtils.approve({
      f_type: "AuthnResponse",
      f_vsn: "1.0.0",
      addr: store.address,
      network: store.network,
      services: [
        {
          type: "authn",
          uid: "fpk#authn",
          f_type: "Service",
          f_vsn: "1.0.0",
          type: "authn",
          id: store.address,
          identity: {
            address: store.address,
          },
          provider: {
            address: "0x7179def56a8b9c5e",
            description: "A wallet created for everyone.",
            f_type: "ServiceProvider",
            f_vsn: "1.0.0",
            icon: "https://lilico.app/fcw-logo.png",
            name: "Flow PassKey",
          },
        },
        {
          endpoint: `${window.location.origin}/authz`,
          f_type: "Service",
          f_vsn: "1.0.0",
          identity: { address: store.address, keyId: 0 },
          method: "POP/RPC",
          network: store.network,
          type: "authz",
          uid: "fpk#authz",
        },
      ],
    });
  };

  const onReject = () => {
    fcl.WalletUtils.decline("Declined by user.");
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="bottom"
      onOpenChange={onOpenChange}
      className="dark"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <Avatar size="lg" src={authnInfo.config.app.icon} />
                <div className="flex flex-col gap-1">
                  <h1 className="text-1xl font-bold text-gray-500">
                    Connecting to
                  </h1>
                  <h1 className="text-2xl font-bold text-gray-300">
                    {authnInfo.config.app.title}
                  </h1>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
                <div className="flex flex-col gap-4">
              <Card >
                <CardBody>
                    <div className="flex items-center gap-2">
                        <RiGlobalLine className="text-lg text-blue-100" />
                        <h1 className="text-lg font-normal text-blue-100">
                        {authnInfo.config.client.hostname}
                        </h1>
                    </div>
                </CardBody>
              </Card>
              <Card >
                <CardBody>
                    <h1 className="text-base font-normal text-gray-500 uppercase mb-3">
                        This App would like to
                    </h1>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <FaCircleCheck className="text-success-500 text-normal"/>
                            <p>View your wallet balance and activity</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaCircleCheck className="text-success-500 text-normal"/>
                            <p>Request approval for transactions</p>
                        </div>
                    </div>
                </CardBody>
              </Card>
              </div>

            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                className="w-full h-12"
                onPress={() => {
                  onClose();
                  onReject();
                }}
              >
                Cancel
              </Button>

              <Button
                color="primary"
                variant="solid"
                className="w-full h-12"
                onPress={() => {
                  onClose();
                  onApproval();
                }}
              >
                Connect
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Connect;

import {
    Button,
    Card,
    CardBody,
    Avatar,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
  } from "@nextui-org/react";
  import { StoreContext } from "../contexts";
  import { useEffect, useState, useContext } from "react";
  import * as fcl from "@onflow/fcl";
  import { RiGlobalLine } from "react-icons/ri";
  import { FaCircleCheck } from "react-icons/fa6";
  import { encode } from "@onflow/rlp"
  import { signAcctProofWithPassKey, signWithPassKey } from "../utils/sign";
  
  const SignOut = ({isOpen, onOpen, onOpenChange }) => {
    const { store, setStore } = useContext(StoreContext);
    const [authnInfo, setAuthnInfo] = useState(null);
  
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
                  <div className="flex flex-col gap-1">
                    <h1 className="text-1xl font-bold text-danger-300">
                      Confirmation
                    </h1>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                    <h1 className="text-2xl font-bold text-gray-300">
                      Are you sure you want to sign out ?
                    </h1>
  
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  className="w-full h-12"
                  onPress={onClose}
                >
                  Cancel
                </Button>
  
                <Button
                  color="danger"
                  variant="solid"
                  className="w-full h-12"
                  onPress={async () => {
                    setStore({});
                    window.localStorage.removeItem("store");
                    onClose();
                  }}
                >
                  Sign Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };
  
  export default SignOut;
  
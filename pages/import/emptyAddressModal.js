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
  import { StoreContext } from "../../contexts";
  import { useEffect, useState, useContext } from "react";
  import * as fcl from "@onflow/fcl";
  import { RiGlobalLine } from "react-icons/ri";
  import { FaCircleCheck } from "react-icons/fa6";
  import { encode } from "@onflow/rlp";
  
  const EmptyAddressModal = ({ isOpen, onOpen, onOpenChange }) => {
    const { store, setStore } = useContext(StoreContext);
  
    return (
      <Modal
        isOpen={isOpen}
      //   placement="bottom"
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
                      No Address Found
                    </h1>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <h1 className="text-1xl font-semibold text-gray-300">
                  We can&#39;t find any address on flow with this key. Please check your input and try again.
                </h1>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="default" className="w-full h-12" onPress={onClose}>
                    Cancel
                </Button> */}
  
                <Button
                //   color="warning"
                  variant="solid"
                  className="w-full h-12"
                  onPress={onClose}
                >
                    OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };
  
  export default EmptyAddressModal;
  
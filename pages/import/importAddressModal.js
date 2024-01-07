import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select,
    SelectItem,
  } from "@nextui-org/react";
  
  const ImportAddressModal = ({ isOpen, onOpen, onOpenChange, accounts, handleAddressSelection }) => {
    const test = (e) => {
      e.preventDefault();
      handleAddressSelection(e.target[0].value)
    }

    return (
      <Modal
        isOpen={isOpen}
        // placement="bottom"
        onOpenChange={onOpenChange}
        className="dark"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-1xl font-bold text-success-300">
                      Account Found on Chain
                    </h1>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <h1 className="text-1xl font-semibold text-gray-300">
                    Choose an account you want to import
                </h1>

              <form id="address" onSubmit={test}>
                <Select
                  isRequired
                    // label="Flow account"
                    aria-label="Select Flow Address"
                    placeholder="Select Flow Address"
                    // selectedKeys={value}
                    defaultSelectedKeys={[accounts[0].address]}
                    className="w-full dark"
                    // onSelectionChange={setValue}
                >
                    {accounts.map((account) => (
                    <SelectItem className="dark bg-dark" aria-label={account.address} key={account.address} value={account.address}>
                        {account.address}
                    </SelectItem>
                    ))}
                </Select>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="default" className="w-full h-12" onPress={onClose}>
                    Cancel
                </Button>
  
                <Button
                  form="address"
                  color="primary"
                  variant="solid"
                  className="w-full h-12"
                  type="submit"
                >
                    Import
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };
  
  export default ImportAddressModal;
  
import { Textarea, Input, Button } from "@nextui-org/react";
import { StoreContext } from "../../contexts";
import { useEffect, useState, useContext } from "react";
import { findAddressWithKey } from "./findAddressWithPubKey";
import { pk2PubKey } from "../../utils/passkey"
import { initWasm } from "@trustwallet/wallet-core";
import { HASH_ALGO, SIGN_ALGO } from "../../utils/constants";

const PrivateKeyImport = ({ onOpen, onImport }) => {
  const { store, setStore } = useContext(StoreContext);
  const [isLoading, setLoading] = useState(false);

  const handleImport = async (e) => {
    try {
      setLoading(true)
      e.preventDefault();
      const pk = e.target[0].value.replace(/^0x/, "")
      const addressInput = e.target[1].value
      const { P256, SECP256K1 } = await pk2PubKey(pk)
      let pubK = P256
      let accounts = await findAddressWithKey(P256, addressInput)
      if (!accounts) {
        accounts = await findAddressWithKey(SECP256K1, addressInput)
        pubK = SECP256K1
      }
      console.log('pubKeyHex', P256, SECP256K1, addressInput, accounts)
      setLoading(false)
      if (!accounts) {
        onOpen()
        return
      }
      onImport(accounts, {pk, pubK, type: 'privateKey'})
    } finally {
      setLoading(false)
    }
  };

  return (
    <form id="privateKey" onSubmit={handleImport} className="w-full flex flex-col gap-3 items-start justify-start">
    <Input isRequired value="0x8822c99458cea9de3ba4e1d608680a8c58265ee83d99bb6e3b450a6d4c464662" type="text" label="Private Key" placeholder="Enter your private key"/>
    <Input
      value="0xc2389ed351926764"
        label="Address"
        placeholder="Enter your flow address (Optional)"
        type="text"
      />
    <Button form="privateKey" type="submit" isLoading={isLoading} className="w-full font-bold" color="primary"> Import </Button>
    </form>
  );
};

export default PrivateKeyImport;

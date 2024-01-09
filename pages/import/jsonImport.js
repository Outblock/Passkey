import { Textarea, Input, Button } from "@nextui-org/react";
import { StoreContext } from "../../contexts";
import { useEffect, useState, useContext } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { jsonToKey } from "../../utils/passkey";
import { findAddressWithKey } from "../../utils/findAddressWithPubKey";
import { findAddressWithPK } from "../../utils/findAddressWithPK";

const JsonImport = ({onOpen}) => {
  const { store, setStore } = useContext(StoreContext);
  const [isLoading, setLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [json, setJson] = useState(`{"version":3,"id":"c0cae541-21f2-43f5-ab45-66c49a21a43f","address":"8cd687688f1ca87c34259a251b0f31f7dfc1bdbd","crypto":{"ciphertext":"d361ad39e8e859d309838d5017f7dc6b88e4ccf08ec5bc12f6b78fca702a8f74","cipherparams":{"iv":"c895d524bc3bcaf7d35baf43140237df"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"72ace8aae80f25c56b05eede9f6654f407914dfaf5f40c2d74fb19be7e1d541a","n":131072,"r":8,"p":1},"mac":"30962d3311dc476ea9b8941a823c083dd9f149083c15e75fddbd193af0e3d261"}}`);
  const [errorMesssage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const hasJsonStructure = (str) => {
    if (typeof str !== "string") return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === "[object Object]" || type === "[object Array]";
    } catch (err) {
      return false;
    }
  };

  const handleImport = async (e) => {
    try {
      setLoading(true)
      e.preventDefault();
      const keystore = e.target[0].value
      const password = e.target[1].value
      const address = e.target[3].value
      console.log('address 111==>', address)
      const pk = await jsonToKey(keystore, password)
      const pkHex = Buffer.from(pk.data(), 'hex')
      const result = await findAddressWithPK(pkHex, address)
      console.log(result)
      if (!result) {
        onOpen();
        return;
      }
      onImport(result.accounts, { pk:pk, pubK: result.pubK, type: KEY_TYPE.KEYSTORE });
    } finally {
      setLoading(false)
    }
  };

  const checkJSONImport = (event) => {
    setJson(event);
    if (event.length === 0) {
      setIsInvalid(false);
      setErrorMessage("");
      return false;
    }
    const result = hasJsonStructure(event);
    console.log("result ==>", result);
    setIsInvalid(!result);
    setErrorMessage(!result ? "Not a valid json input" : "");
    return result;
  };

  return (
    <form
      id="keystore"
      onSubmit={handleImport}
      className="w-full flex flex-col gap-3 items-start justify-start"
    >
      <Textarea
        isInvalid={isInvalid}
        value={json}
        onValueChange={checkJSONImport}
        minRows={18}
        fullWidth
        isRequired
        label="JSON"
        placeholder="You can import the json file from other wallet (eg. Blocto)"
        className="grow"
        errorMessage={errorMesssage}
      />
      <Input
        isRequired
        label="Password"
        value="11111111"
        placeholder="Enter password for json file"
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <IoMdEye className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isVisible ? "text" : "password"}
      />
     <Input
        label="Address"
        placeholder="Enter your flow address (Optional)"
        type="text"
      />
      <Button
        isLoading={isLoading}
        form="keystore"
        className="w-full"
        type="submit"
        color="primary"
      >
        Import
      </Button>
    </form>
  );
};

export default JsonImport;

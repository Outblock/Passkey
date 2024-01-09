import { Card, CardBody, Switch } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../contexts";
import { getPasskey, getPKfromLogin } from "../../utils/passkey";
import { FLOW_BIP44_PATH, KEY_TYPE } from "../../utils/constants";
import KeyInfoCard from "./KeyInfoCard";
import {
  IoKeyOutline,
  IoChevronForwardOutline,
  IoFingerPrintOutline,
} from "react-icons/io5";
import { KEYS, deleteKeyInfo, isEnableBiometric, set, login } from "../../account";

const Setting = () => {
  const [enableBiometric, setEnableBiometric] = useState(isEnableBiometric());
  const { store, setStore } = useContext(StoreContext);
  const [isExpanded, setExpanded] = useState(false);

  const handleKeyInfo = async (isSelected) => {
    if (isSelected) {
      const userInfo = { ...store };
      delete userInfo.keyInfo.pk;
      delete userInfo.keyInfo.mnemonic;
      setStore(userInfo);
      login(userInfo)
    } else {
      const result = await getPasskey(store.id);
      const keyInfo = await getPKfromLogin(result);
      setStore((s) => ({ ...s, keyInfo: keyInfo }));
      login({ ...store, keyInfo: keyInfo });
    }
  };

  console.log('store ==>', store)

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <IoFingerPrintOutline className="text-2xl text-gray-300" />
            <div className="flex flex-col grow">
              <p className="font-bold text-sm">Biometric</p>
              {store.id ? (
                <p className="text-sm text-gray-500">
                  Enable biometric check every time
                </p>
              ) : (
                <p className="text-sm text-red-600">For passkey account only</p>
              )}
            </div>
            <Switch
              isDisabled={store.id == null}
              isSelected={enableBiometric}
              onValueChange={async () => {
                console.log("onValueChange ==>", enableBiometric);
                setEnableBiometric(!enableBiometric);
                set(KEYS.BIOMETRIC, !enableBiometric);
                handleKeyInfo(!enableBiometric);
              }}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="gap-2 transition-transform">
          <div
            className="flex items-center gap-4"
            onClick={() => setExpanded((s) => !isExpanded)}
          >
            <IoKeyOutline className="text-2xl text-gray-300" />
            <div className="flex flex-col grow ">
              <p className="font-bold text-sm">Private Key</p>
              <p className="text-sm text-gray-500">
                View seed phrase or private key
              </p>
            </div>
            {isExpanded ? (
              <IoChevronForwardOutline className="text-lg text-gray-500" />
            ) : (
              <IoChevronForwardOutline className="text-lg text-gray-500" />
            )}
          </div>

          {isExpanded && <KeyInfoCard className="!transition-transform" />}
        </CardBody>
      </Card>
    </div>
  );
};

export default Setting;

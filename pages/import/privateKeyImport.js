import { Textarea, Input, Button } from "@nextui-org/react";
import { StoreContext } from "../../contexts";
import { useEffect, useState, useContext } from "react";

const PrivateKeyImport = ({ address }) => {
  const { store, setStore } = useContext(StoreContext);

  return (
    <div className="w-full flex flex-col gap-3 items-start justify-start">
    <Input isRequired type="text" label="Private Key" placeholder="Enter your private key"/>
    <Button className="w-full" color="primary"> Import </Button>
    </div>
  );
};

export default PrivateKeyImport;

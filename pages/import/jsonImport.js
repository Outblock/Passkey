import { Textarea, Input, Button } from "@nextui-org/react";
import { StoreContext } from "../../contexts";
import { useEffect, useState, useContext } from "react";

const JsonImport = ({ address }) => {
  const { store, setStore } = useContext(StoreContext);

  return (
    <div className="w-full flex flex-col gap-3 items-start justify-start">
    <Textarea
    minRows={18}
     fullWidth
     isRequired
      label="JSON"
      placeholder="You can import the json file from other wallet (eg. Blocto)"
      className="grow"
    />
    <Input isRequired type="password" label="Password" placeholder="Enter password for json file"/>
    <Button className="w-full" color="primary"> Import </Button>
    </div>
  );
};

export default JsonImport;

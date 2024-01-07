import { Textarea, Input, Button } from "@nextui-org/react";
import { StoreContext } from "../../contexts";
import { useEffect, useState, useContext } from "react";

const SeedPhraseImport = ({ address }) => {
  const { store, setStore } = useContext(StoreContext);

  return (
    <div className="w-full flex flex-col gap-3 items-start justify-start">
    <Textarea
    minRows={18}
     fullWidth
     isRequired
      label="Seed Phrase"
      placeholder="Import 12 or 24 seed phrase"
      className="grow"
    />
    {/* <Input isRequired type="password" label="Password" placeholder="Enter password for json file"/> */}
    <Input
        label="Address"
        placeholder="Enter your flow address (Optional)"
        type="text"
      />
    <Button className="w-full font-bold" color="primary"> Import </Button>
    </div>
  );
};

export default SeedPhraseImport;

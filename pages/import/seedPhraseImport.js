import { Textarea, Input, Button } from "@nextui-org/react";
import { useEffect, useState, useContext } from "react";
import { findAddressWithSeed } from "../../utils/findAddressWithPK";
import { KEY_TYPE } from "../../utils/constants";

const SeedPhraseImport = ({ onOpen, onImport }) => {
  const [isLoading, setLoading] = useState(false);

  const handleImport = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const seed = e.target[0].value;
      const address = e.target[1].value;
      const result = await findAddressWithSeed(seed, address)
      if (!result){
        onOpen();
        return;
      }
      const accounts = result.map((a) => ({...a, type: KEY_TYPE.SEED_PHRASE, mnemonic: seed}))
      onImport(accounts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="seed" onSubmit={handleImport} className="w-full flex flex-col gap-3 items-start justify-start">
    <Textarea
      minRows={18}
      // value="edge dumb split music shell spray proof elbow vault thank swallow final"
     fullWidth
     isRequired
      label="Seed Phrase"
      placeholder="Import 12 or 24 seed phrase"
      className="grow"
    />
    {/* <Input isRequired type="password" label="Password" placeholder="Enter password for json file"/> */}
    <Input
        label="Address"
        // value="0x8b8eadda2370412b"
        placeholder="Enter your flow address (Optional)"
        type="text"
      />
    <Button isLoading={isLoading} type="submit" form="seed" className="w-full font-bold" color="primary"> Import </Button>
    </form>
  );
};

export default SeedPhraseImport;

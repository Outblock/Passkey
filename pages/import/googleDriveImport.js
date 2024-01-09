import { Button, Image } from "@nextui-org/react";
import { StoreContext } from "../../contexts";
import { useEffect, useState, useContext } from "react";
import { FaGoogleDrive } from "react-icons/fa";
import toast from "react-hot-toast";

const GoogleDriveImport = ({ address }) => {
  const { store, setStore } = useContext(StoreContext);

  return (
    <div className="w-full bg-zinc-800 rounded-large flex flex-col gap-1 items-center justify-center py-6">
      <Image
        alt="drive"
        width={60}
        src="https://frw-link.lilico.app/_next/image?url=%2Flogo.png&w=256&q=75"
      />
      <p className="text-lg font-semibold">Flow Reference Wallet</p>
      <p className="text-sm text-gray-500">
        You can import your FRW account from google drive
      </p>
      <Button
        variant="flat"
        className="mt-3"
        startContent={<FaGoogleDrive />}
        color="success"
        onPress={()=> toast('Coming Soon', {icon: '🚧'})}
      >
        Import from Google Drive
      </Button>
    </div>
  );
};

export default GoogleDriveImport;

import { LuFileJson } from "react-icons/lu";
import { FaGoogleDrive } from "react-icons/fa";
import { TbPassword } from "react-icons/tb";
import { FaListOl } from "react-icons/fa6";

import GoogleDriveImport from "../pages/import/googleDriveImport";
import JsonImport from "../pages/import/jsonImport";
import SeedPhraseImport from "../pages/import/seedPhraseImport";
import PrivateKeyImport from "../pages/import/privateKeyImport";

export const KEY_TAB = [
    {
        id: "drive",
        name: "FRW",
        icon: <FaGoogleDrive/>,
        node: <GoogleDriveImport/>
    },
    {
        id: "json",
        name: "Keystore",
        icon: <LuFileJson/>,
        node: <JsonImport/>
    },
    {
        id: "seed",
        name: "Seed Phrase",
        icon: <FaListOl/>,
        node: <SeedPhraseImport/>
    },
    {
        id: "key",
        name: "Private Key",
        icon: <TbPassword/>,
        node: <PrivateKeyImport/>
    },
]
import { LuFileJson } from "react-icons/lu";
import { FaGoogleDrive } from "react-icons/fa";
import { TbPassword } from "react-icons/tb";
import { FaListOl } from "react-icons/fa6";

import GoogleDriveImport from "./googleDriveImport";
import JsonImport from "./jsonImport";
import SeedPhraseImport from "./seedPhraseImport";
import PrivateKeyImport from "./privateKeyImport";

export const KEY_TAB = [
    {
        id: "drive",
        name: "Drive",
        icon: <FaGoogleDrive/>,
        node: <GoogleDriveImport/>
    },
    {
        id: "json",
        name: "JSON",
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
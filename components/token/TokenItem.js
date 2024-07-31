import { Avatar } from "@nextui-org/react";
import { fmtFlow } from "../../utils";

const TokenItem = ({ tokenInfo }) => {
  return (
    <div className="flex items-center gap-4 py-1">
      <Avatar size="sm" src={tokenInfo.icon} />
      <div className="flex flex-col gap-2">
        <h1 className="text-1xl text-gray-300">{tokenInfo.name}</h1>
      </div>
      <div className="flex items-center gap-1 justify-end grow">
        <h1 className="text-1xl text-gray-300">{parseFloat(fmtFlow(tokenInfo.balance)).toFixed(2)}</h1>
        <h1 className="text-1xl text-gray-500 uppercase">{tokenInfo.symbol}</h1>
      </div>
    </div>
  );
};

export default TokenItem;

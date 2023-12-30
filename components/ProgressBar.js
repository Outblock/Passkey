import { FaRegIdBadge } from "react-icons/fa6";
import { Card, CardBody, Progress, Link } from "@nextui-org/react";

const ProgressBar = ({txId, network}) => {
  const url = `https://${network === 'testnet' ? 'testnet.' : ''}flowdiver.io/tx/${txId}`
  return (
    <Card>
      <CardBody className="flex flex-col space-y-4 px-8 py-4">
        <div className="flex items-center gap-4">
          <FaRegIdBadge className="text-2xl" />
          <h1 className="text-2xl font-bold text-gray-300">
            Creating flow address
          </h1>
        </div>
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="max-w"
        />
        <Link isExternal showAnchorIcon href={url} underline="hover" color="primary">View in FlowDiver</Link>
      </CardBody>
    </Card>
  );
};

export default ProgressBar;

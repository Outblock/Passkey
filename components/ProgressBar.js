import { FaRegIdBadge } from "react-icons/fa6";
import { Card, CardBody, Progress, Link } from "@nextui-org/react";
import { useContext, useEffect } from "react";
import { StoreContext } from '../contexts'
import * as fcl from "@onflow/fcl";

const ProgressBar = ({txId, network}) => {

  const {store, setStore} = useContext(StoreContext)

  const url = `https://${network === 'testnet' ? 'testnet.' : ''}flowdiver.io/tx/${txId}`

  useEffect(() => {
    const waitForTx = async () => {
      const result = await fcl.tx(txId).onceSealed()
      console.log('waitForTx ==>', result)
      const event = result.events.filter(event => event.type === 'flow.AccountCreated')[0]
      console.log('event ==>', event)
      const address = event.data.address
      console.log('address ==>', address)
      setStore((s) => ({...s, address, isCreating: false}));
      console.log('user ==>', store)
      window.sessionStorage.setItem('store', JSON.stringify(store))
      return address
    };

    if (txId) {
      console.log('txId ===>', txId)
      waitForTx();
    }

  }, [txId])

  return (
    <Card>
      <CardBody className="flex flex-col space-y-4 p-6">
        <div className="flex items-center gap-4">
          <FaRegIdBadge className="text-2xl" />
          <h1 className="text-2xl font-bold text-gray-300">
            Creating Your Flow Address
          </h1>
        </div>
        <Progress
          size="md"
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

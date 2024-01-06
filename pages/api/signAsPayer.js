import { ec as EC } from "elliptic";
import { sha256 } from "../../modules/Crypto";
import { cors, runMiddleware } from "./cors";

const sign = async (signableMessage) => {
  const ec = new EC("p256");
  const messageHash = await sha256(Buffer.from(signableMessage, "hex"));
  const privateKey = process.env.payerPrivateKey;
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(new Uint8Array(messageHash));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
};

export default async function preAuthz(req, res) {
  await runMiddleware(req, res, cors);
  // TODO: ADD check
  const { message } = req.body;
  res.status(200).json({
    f_type: "PollingResponse",
    f_vsn: "1.0.0",
    status: "APPROVED",
    reason: null,
    data: {
      f_type: "CompositeSignature",
      f_vsn: "1.0.0",
      addr: process.env.payerAddress,
      keyId: parseInt(process.env.payerKeyIndex),
      network: process.env.network,
      signature: await sign(message),
    },
  });
}

import { initWasm } from "@trustwallet/wallet-core";
import { FLOW_BIP44_PATH } from "./constants";
import { getPasskey } from "./passkey";
import { sha256 } from "../modules/Crypto";

const DOMAIN_TAG = {
    tx: "FLOW-V0.0-transaction",
    user: "FLOW-V0.0-user",
    acct: "FCL-ACCOUNT-PROOF-V0.0"
}

const rightPaddedHexBuffer = (value, pad) =>
  Buffer.from(value.padEnd(pad * 2, "0"), "hex")

const leftPaddedHexBuffer = (value, pad) =>
  Buffer.from(value.padStart(pad * 2, "0"), "hex")

const domainTag = (tag) => {
    return rightPaddedHexBuffer(
        Buffer.from(tag).toString("hex"),
        32
    ).toString("hex")
}

const signWithPassKey = async (id, message) => {
    const { HDWallet, Curve } = await initWasm();
    const result = await getPasskey(id || "");
    const wallet = HDWallet.createWithEntropy(result.response.userHandle, "")
    const pk = wallet.getKeyByCurve(Curve.nist256p1, FLOW_BIP44_PATH)
    const messageHash = await sha256(Buffer.from(message, 'hex'))
    const signature = pk.sign(new Uint8Array(messageHash), Curve.nist256p1)
    return Buffer.from(signature.subarray(0, signature.length - 1)).toString('hex')
}

const signUserMsgWithPassKey = async (id, message) => {
    return await signWithPassKey(id, domainTag(DOMAIN_TAG.user) + message)
}

const signAcctProofWithPassKey = async (id, message) => {
    return await signWithPassKey(id, domainTag(DOMAIN_TAG.acct) + message)
}

export {signWithPassKey, signUserMsgWithPassKey, signAcctProofWithPassKey};
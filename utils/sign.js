import { initWasm } from "@trustwallet/wallet-core";
import { FLOW_BIP44_PATH } from "./constants";
import { getPKfromLogin, getPasskey } from "./passkey";
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

const signWithPassKey = async (store, message) => {
    console.log('signWithPassKey ===>', store)
    const enableBiometric = Boolean(window.localStorage.getItem('enableBiometric'))
    const { HDWallet, Curve } = await initWasm();
    const id = store.id
    let wallet;

    if (enableBiometric === 'true') {
        const result = await getPasskey(id || "");
        wallet = HDWallet.createWithEntropy(result.response.userHandle, "")
    } else {
        if (!store.keyInfo?.mnemonic) {
            const result = await getPasskey(id || "");
            const keyInfo = await getPKfromLogin(result)
            wallet = HDWallet.createWithMnemonic(keyInfo.mnemonic, "")
        } else {
            wallet = HDWallet.createWithMnemonic(store.keyInfo.mnemonic, "")
        }
    }

    const pk = wallet.getKeyByCurve(Curve.nist256p1, FLOW_BIP44_PATH)
    const messageHash = await sha256(Buffer.from(message, 'hex'))
    const signature = pk.sign(new Uint8Array(messageHash), Curve.nist256p1)
    return Buffer.from(signature.subarray(0, signature.length - 1)).toString('hex')
}

const signUserMsgWithPassKey = async (store, message) => {
    return await signWithPassKey(store, domainTag(DOMAIN_TAG.user) + message)
}

const signAcctProofWithPassKey = async (id, message) => {
    return await signWithPassKey(id, domainTag(DOMAIN_TAG.acct) + message)
}

export {signWithPassKey, signUserMsgWithPassKey, signAcctProofWithPassKey};
import { initWasm } from "@trustwallet/wallet-core";
import { FLOW_BIP44_PATH, HASH_ALGO, KEY_TYPE, SIGN_ALGO } from "./constants";
import { getPKfromLogin, getPasskey } from "./passkey";
import { sha256 } from "../modules/Crypto";
import { isEnableBiometric } from "../account";

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

const signWithKey = async (store, message) => {
    // PassKey
    if(!store.keyInfo) {
        return await signWithPassKey(store, message)
    }

    if (store.keyInfo.type === KEY_TYPE.PASSKEY) {
        return await signWithPassKey(store, message)
    }

    // Other key
    const { HDWallet, Curve, Hash, PrivateKey } = await initWasm();
    const messageData = Buffer.from(message, 'hex')
    const {signAlgo, hashAlgo, pk} = store.keyInfo
    console.log(signAlgo, hashAlgo, pk)
    const privateKey = PrivateKey.createWithData(Buffer.from(pk, 'hex'))
    const curve = signAlgo === SIGN_ALGO.P256 ? Curve.nist256p1 : Curve.secp256k1
    const messageHash = hashAlgo === HASH_ALGO.SHA3_256 ? Hash.sha3_256(messageData) : Hash.sha256(messageData)
    const signature = privateKey.sign(messageHash, curve)
    return Buffer.from(signature.subarray(0, signature.length - 1)).toString('hex')
}

const signWithPassKey = async (store, message) => {
    console.log('signWithPassKey ===>', isEnableBiometric(), store)
    const { HDWallet, Curve, Hash } = await initWasm();
    const id = store.id
    let wallet;

    if (isEnableBiometric()) {
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
    return await signWithKey(store, domainTag(DOMAIN_TAG.user) + message)
}

const signAcctProofWithPassKey = async (id, message) => {
    return await signWithKey(id, domainTag(DOMAIN_TAG.acct) + message)
}

export {signWithPassKey, signUserMsgWithPassKey, signAcctProofWithPassKey, signWithKey};
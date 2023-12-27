import { getRandomBytes, base64DecodeURL } from ".";
import { decodeAuthenticatorData, decodeClientDataJSON } from "../modules/WebAuthnDecoder"
import { encodeArray } from "../modules/base64"
import { initWasm } from "@trustwallet/wallet-core";
// import WalletCore from "../wallet-core.wasm";

const path = "m/44'/539'/0'/0/0"

const createPasskey = async (name, displayName) => {
    const userId = getRandomBytes(16)
    const result = await navigator.credentials.create({
      publicKey: {
        challenge: getRandomBytes(20),
        rp: {
          name: window.location.hostname
        },
        user: {
          id: userId,
          name: name,
          displayName: displayName
        },
        pubKeyCredParams: [
          {
            "type": "public-key",
            "alg": -7
          },
          {
            "type": "public-key",
            "alg": -257
          }
        ]
      },
    });
    console.log("result ==>", result);
    return {userId, result};
};

const getPasskey = async () => {
    const result = await navigator.credentials.get({
      publicKey: {
        challenge: getRandomBytes(20),
        rpId: window.location.hostname,
      },
    });
    return result
};

const getPKfromLogin = async (result) => {
    const { HDWallet, Curve } = await initWasm();
    const wallet = HDWallet.createWithEntropy(result.response.userHandle, "")
    const pk = wallet.getKeyByCurve(Curve.nist256p1, path)
    const pubk = pk.getPublicKeyNist256p1().uncompressed().data()
    // const json = decodeClientDataJSON(result.response.clientDataJSON)
    // console.log("clientDataJSON =>", json)
    // const test = decodeAuthenticatorData(result.response.authenticatorData)
    
    return { mnemonic: wallet.mnemonic(), pk: uint8Array2Hex(pk.data()), pubK: uint8Array2Hex(pubk) }
}

const getPKfromRegister = async ({userId, result}) => {
    console.log(userId, result)
    if (!userId) {
        return null
    }
    const { HDWallet, Curve } = await initWasm();
    const wallet = HDWallet.createWithEntropy(userId, "")
    const pk = wallet.getKeyByCurve(Curve.nist256p1, path)
    const pubk = pk.getPublicKeyNist256p1().uncompressed().data()
    return { mnemonic: wallet.mnemonic(), pk: uint8Array2Hex(pk.data()), pubK: uint8Array2Hex(pubk) }
}

const uint8Array2Hex = (input) => {
    const buffer = new Buffer.from(input)
    return buffer.toString("hex")
}

export { createPasskey, getPasskey, getPKfromLogin, getPKfromRegister};
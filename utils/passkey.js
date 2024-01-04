import { getRandomBytes, base64DecodeURL } from ".";
import {
  decodeAuthenticatorData,
  decodeClientDataJSON,
  decodeAttestationObject,
} from "../modules/WebAuthnDecoder";
import { decodeArray, encodeArray } from "../modules/base64";
import { initWasm } from "@trustwallet/wallet-core";
import { addCredential, readSettings } from "../modules/settings";
import { FLOW_BIP44_PATH } from "./constants";

const createPasskey = async (name, displayName) => {
  const userId = getRandomBytes(16);
  const setup = {
    publicKey: {
      challenge: getRandomBytes(20),
      rp: {
        name: window.location.hostname,
      },
      user: {
        id: userId,
        name: name,
        displayName: displayName,
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7,
        },
      ],
    },
  };
  const result = await navigator.credentials.create(setup);
  console.log("result ==>", result);
  const attestationObject = decodeAttestationObject(
    result.response.attestationObject
  );
  console.log("attestationObject ==>", attestationObject);
  const authData = decodeAuthenticatorData(attestationObject.authData);
  console.log("authData ==>", authData);
  addCredential(
    readSettings(),
    setup.publicKey.user,
    result.id,
    authData.attestedCredentialData.credentialPublicKey,
    result.response
  );
  return { userId, result, userName: name };
};

const getPasskey = async (id) => {
  const setup = {
    publicKey: {
      challenge: getRandomBytes(20),
      rpId: window.location.hostname,
    },
  };

  if (id && id.length > 0) {
    setup.publicKey.allowCredentials = [
      {
        type: "public-key",
        id: decodeArray(id),
      },
    ];
  }

  console.log("getPasskey setup ==>", setup);
  const result = await navigator.credentials.get(setup);
  console.log("getPasskey result ==>", result);
  const json = decodeClientDataJSON(result.response.clientDataJSON);
  console.log("clientDataJSON =>", json);
  const test = decodeAuthenticatorData(result.response.authenticatorData);
  console.log("authenticatorData =>", test);
  return result;
};

const getPKfromLogin = async (result) => {
  const { HDWallet, Curve } = await initWasm();
  const wallet = HDWallet.createWithEntropy(result.response.userHandle, "");
  const pk = wallet.getKeyByCurve(Curve.nist256p1, FLOW_BIP44_PATH);
  const pubk = pk.getPublicKeyNist256p1().uncompressed().data();
  const json = decodeClientDataJSON(result.response.clientDataJSON);
  
  return {
    mnemonic: wallet.mnemonic(),
    pk: uint8Array2Hex(pk.data()),
    pubK: uint8Array2Hex(pubk).replace(/^04/, ""),
    clientDataJSON: json,
  };
};

const getPKfromRegister = async ({ userId, result }) => {
  console.log(userId, result);
  if (!userId) {
    return null;
  }
  const { HDWallet, Curve } = await initWasm();
  const wallet = HDWallet.createWithEntropy(userId, "");
  const pk = wallet.getKeyByCurve(Curve.nist256p1, FLOW_BIP44_PATH);
  const pubk = pk.getPublicKeyNist256p1().uncompressed().data();
  return {
    mnemonic: wallet.mnemonic(),
    pk: uint8Array2Hex(pk.data()),
    pubK: uint8Array2Hex(pubk).replace(/^04/, ""),
  };
};

const uint8Array2Hex = (input) => {
  const buffer = new Buffer.from(input);
  return buffer.toString("hex");
};

export { createPasskey, getPasskey, getPKfromLogin, getPKfromRegister };

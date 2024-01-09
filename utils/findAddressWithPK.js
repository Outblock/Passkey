import { pk2PubKey } from "./passkey";
import { findAddressWithKey } from "./findAddressWithPubKey";

export const findAddressWithPK = async (pk, address) => {
    console.log("findAddressWithPK", pk, address);
    const { P256, SECP256K1 } = await pk2PubKey(pk);
    console.log("P256 ==>", P256)
    console.log("SECP256K1 ==>", SECP256K1)
    let pubK = P256;
    let accounts = await findAddressWithKey(P256, address);
    if (!accounts) {
      accounts = await findAddressWithKey(SECP256K1, address);
      pubK = SECP256K1;
    }
    if (!accounts) {
        return null
    }

    //TODO: Add both account supoort
    // const p256Accounts = await findAddressWithKey(P256, address);
    // const secpAccounts = await findAddressWithKey(SECP256K1, address);
    // let accounts = p256Accounts.concat(secpAccounts)

    return {accounts, pubK}
}

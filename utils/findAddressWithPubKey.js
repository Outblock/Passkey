import * as fcl from "@onflow/fcl";

export const findAddressWithKey = async (pubKeyHex, address) => {
    if (!address) {
        const data = await fetch(`/api/getAddressByIndexer?publicKey=${pubKeyHex}`)
        if (data.accounts && data.accounts.length > 0) {
            return data.accounts
        }
        return null
    }

    console.log('findAddressWithKey ==>', address)

    const account = await fcl.account(address)
    const keys = account.keys
    .filter(key => key.publicKey === pubKeyHex && !key.revoked)
    .filter(key => key.weight >= 1000 )

    console.log("account =>", account, keys)

    if (keys.length == 0) {
        return null
    }

    return keys.map(key => {
        return {
            address: address,
            keyId: parseInt(key.index),
            weight: key.weight,
            hash: key.hashAlgoString,
            sign: key.signAlgoString
        }
    })
}

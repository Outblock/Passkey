import * as fcl from "@onflow/fcl";

export const findAddressWithKey = async (pubKeyHex, address) => {
    if (!address) {
        const response = await fetch(`/api/getAddressByIndexer?publicKey=${pubKeyHex}`)
        const data = await response.json()
        
        if (data.accounts && data.accounts.length > 0) {
            const addresses = data.accounts.map((a) => fcl.withPrefix(fcl.sansPrefix(a.address).padStart(16, '0')))
            const result = await Promise.all(addresses.map((a) => findAddres(a, pubKeyHex)))
            return result.flat()
        }
        return null
    }
    return await findAddres(address, pubKeyHex)
}

const findAddres = async (address, pubKeyHex) => {
    const account = await fcl.account(address)
    const keys = account.keys
    .filter(key => key.publicKey === pubKeyHex && !key.revoked)
    .filter(key => key.weight >= 1000 )
    
    if (keys.length == 0) {
        return null
    }

    return keys.map(key => {
        return {
            address: address,
            keyIndex: parseInt(key.index),
            weight: key.weight,
            hashAlgo: key.hashAlgoString,
            signAlgo: key.signAlgoString,
            pubK: key.publicKey
        }
    })
}

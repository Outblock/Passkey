package dev.lilico.testpasskey.pages

import dev.lilico.testpasskey.passkey.Passkey
import dev.lilico.testpasskey.passkey.decodeHex
import dev.lilico.testpasskey.passkey.model.AccountInfo
import dev.lilico.testpasskey.passkey.toHex
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.runBlocking
import wallet.core.jni.Curve
import wallet.core.jni.HDWallet

class AccountHandler(val passkey: Passkey) {

    fun register(): AccountInfo? {
        return runBlocking {
            val result = passkey.createPasskeyAccount(username = "Test Android Account") ?: throw Exception("Failed to create account")
            println("result ===> ${result}")
            val entropy = result.userId.decodeHex()
            entropyToAccountInfo(entropy)
        }
    }

    fun signIn(): AccountInfo {
        return runBlocking {
            val result = passkey.login() ?: throw Exception("Failed to create account")
            println("result ===> ${result}")
            val entropy = result.response.userHandle.decodeHex()
            entropyToAccountInfo(entropy)
        }
    }

    private fun entropyToAccountInfo(entropy: ByteArray): AccountInfo {
        val wallet = HDWallet(entropy, "")
        val mnemonic = wallet.mnemonic()
        val pk = wallet.getKeyByCurve(Curve.NIST256P1,DERIVATION_PATH)
        val pubKey = pk.publicKeyNist256p1.uncompressed().data().toHex()
        return AccountInfo(mnemonic, pk.data().toHex(), pubKey)
    }

    companion object {
        const val DERIVATION_PATH = "m/44'/539'/0'/0/0"
    }

}
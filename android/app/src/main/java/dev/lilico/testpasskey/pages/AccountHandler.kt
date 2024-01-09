package dev.lilico.testpasskey.pages

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import dev.lilico.testpasskey.passkey.Passkey
import dev.lilico.testpasskey.passkey.decodeHex
import dev.lilico.testpasskey.passkey.model.AccountInfo
import dev.lilico.testpasskey.passkey.toHex
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import wallet.core.jni.Curve
import wallet.core.jni.HDWallet
import java.util.Base64

class AccountHandler(val passkey: Passkey) {
    var userInfo: AccountInfo? by mutableStateOf(null)

    fun register() {
        CoroutineScope(Dispatchers.IO).launch {
            val result = passkey.createPasskeyAccount(username = "Test Android Account")
                ?: throw Exception("Failed to create account")
            val data = Base64.getUrlDecoder().decode(result.userId)
            userInfo = entropyToAccountInfo(data)
        }
    }

    fun signIn(){
        CoroutineScope(Dispatchers.IO).launch {
            val result = passkey.login() ?: throw Exception("Failed to create account")
            println("result ===> ${result}")
            val entropy = Base64.getUrlDecoder().decode(result.response.userHandle)
            userInfo = entropyToAccountInfo(entropy)
        }
    }

    private fun entropyToAccountInfo(entropy: ByteArray): AccountInfo {
        val wallet = HDWallet(entropy, "")
        val mnemonic = wallet.mnemonic()
        val pk = wallet.getKeyByCurve(Curve.NIST256P1,DERIVATION_PATH)
        val pubKey = pk.publicKeyNist256p1.uncompressed().data().toHex().replace("^04".toRegex(), "")
        return AccountInfo(mnemonic, pk.data().toHex(), pubKey)
    }

    companion object {
        const val DERIVATION_PATH = "m/44'/539'/0'/0/0"
    }
}
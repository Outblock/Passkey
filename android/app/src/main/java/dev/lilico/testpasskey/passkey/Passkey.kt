package dev.lilico.testpasskey.passkey

import android.app.Activity
import android.content.Context
import android.credentials.CreateCredentialException
import androidx.credentials.CredentialManager
import androidx.credentials.CreatePublicKeyCredentialRequest
import androidx.credentials.CreatePublicKeyCredentialResponse
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetPublicKeyCredentialOption
import androidx.credentials.PublicKeyCredential
import androidx.lifecycle.viewModelScope
import co.nstant.`in`.cbor.CborDecoder
import co.nstant.`in`.cbor.model.UnicodeString
import co.nstant.`in`.cbor.model.ByteString
import co.nstant.`in`.cbor.model.Map
import com.google.gson.Gson
import dev.lilico.testpasskey.passkey.model.CreatePasskeyRequest
import dev.lilico.testpasskey.passkey.model.CreatePasskeyResponseData
import dev.lilico.testpasskey.passkey.model.GetPasskeyRequest
import dev.lilico.testpasskey.passkey.model.UserData
import dev.lilico.testpasskey.passkeyo.model.GetPasskeyResponseData
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import java.security.SecureRandom
import java.time.Instant
import java.util.UUID

class Passkey(private val context: Context) {
    private var gson = Gson()
    private var credentialManager = CredentialManager.create(context)

    suspend fun createPasskeyAccount(username: String): UserData? {
            val userId = generateFidoChallenge(16)

            val test = getCreatePasskeyRequest(userId, username)

            val response = credentialManager.createCredential(
                context,
                CreatePublicKeyCredentialRequest(test),
            )
            val responseData = gson.fromJson(
                (response as CreatePublicKeyCredentialResponse).registrationResponseJson,
                CreatePasskeyResponseData::class.java
            )
            val attestationObject =
                CborDecoder.decode(responseData.response.attestationObject.b64Decode()).first()
            val authData = (attestationObject as Map).get(UnicodeString("authData")) as ByteString
            val publicKey = parseAuthData(authData.bytes)
            val userData = UserData(
                userId,
                responseData.id,
                username,
                publicKey.b64Encode(),
                Instant.now().epochSecond
            )
            return userData
    }

    private fun generateFidoChallenge(size: Int): String {
        val secureRandom = SecureRandom()
        val challengeBytes = ByteArray(size)
        secureRandom.nextBytes(challengeBytes)
        return challengeBytes.b64Encode()
    }

    private fun getCreatePasskeyRequest(userId: String, displayName: String): String {
        return gson.toJson(
            CreatePasskeyRequest(
                challenge = generateFidoChallenge(32),
                rp = CreatePasskeyRequest.Rp(
                    name = "Passkey Demo on Flow",
                    id = RELYING_PARTY_ID
                ),
                user = CreatePasskeyRequest.User(
                    id = userId,
                    name = displayName,
                    displayName = displayName
                ),
                pubKeyCredParams = listOf(
                    CreatePasskeyRequest.PubKeyCredParams(
                        type = "public-key",
                        alg = -7
                    )
                ),
                timeout = 1800000,
                attestation = "none",
                excludeCredentials = emptyList(),
                authenticatorSelection = CreatePasskeyRequest.AuthenticatorSelection(
                    authenticatorAttachment = "platform",
                    requireResidentKey = false,
                    residentKey = "required",
                    userVerification = "required"
                )
            )
        )
    }

    /**
     * Call the credential manager to create a passkey login request
     */
    private suspend fun getLoginResponse(
        option: GetPublicKeyCredentialOption
    ): GetPasskeyResponseData {
        val getCredRequest = GetCredentialRequest(listOf(option))
        val response = credentialManager.getCredential(context, getCredRequest)
        val cred = response.credential as PublicKeyCredential
        return gson.fromJson(cred.authenticationResponseJson, GetPasskeyResponseData::class.java)
    }

    fun login(): GetPasskeyResponseData? {
        return runBlocking {
            try {
                val option = GetPublicKeyCredentialOption(getLoginPasskeyRequest(listOf()))
                val responseData = getLoginResponse(option)
                responseData
//                val userData = accountRepository.getUserAccount(responseData.id)
//                if (userData == null) {
//                    _state.emit(LoginState.LoginError("No account found for this user"))
//                    return
//                }
//                val publicKey = userData.publicKey.toJavaPublicKey()
            } catch (e: Exception) {
                e.printStackTrace()
                null
            }
        }
    }

    private fun getLoginPasskeyRequest(allowedCredential: List<String>): String {
        return gson.toJson(
            GetPasskeyRequest(
                challenge = generateFidoChallenge(32),
                timeout = 1800000,
//                userVerification = "required",
                rpId = RELYING_PARTY_ID,
//                allowCredentials = allowedCredential.map {
//                    GetPasskeyRequest.AllowCredentials(
//                        id = it,
//                        transports = listOf(),
//                        type = "public-key"
//                    )
//                }
            )
        )
    }

    /**
     * Parse the authData from the attestationObject to get the public key
     */
    private fun parseAuthData(buffer: ByteArray): ByteArray {
        /*val rpIdHash = buffer.copyOfRange(0, 32)
        val flags = buffer.copyOfRange(32, 33)
        val signCount = buffer.copyOfRange(33, 37)
        val aaguid = buffer.copyOfRange(37, 53)*/
        val credentialIdLength = buffer.copyOfRange(53, 55)
        //val credentialId = buffer.copyOfRange(55, 55 + credentialIdLength[1].toInt())
        return buffer.copyOfRange(55 + credentialIdLength[1].toInt(), buffer.size)
    }

    companion object {
        private const val RELYING_PARTY_ID = "passkey.lilico.dev"
    }

}
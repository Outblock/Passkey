package dev.lilico.testpasskey.passkey

import android.app.Activity
import android.content.Context
import android.credentials.CreateCredentialException
import androidx.credentials.CredentialManager
import androidx.compose.ui.platform.LocalContext
import androidx.credentials.CreatePublicKeyCredentialRequest
import androidx.credentials.CreatePublicKeyCredentialResponse
import com.google.gson.Gson
import com.google.protobuf.ByteString
import dev.lilico.testpasskey.passkey.model.CreatePasskeyRequest
import dev.lilico.testpasskey.passkey.model.CreatePasskeyResponseData
import dev.lilico.testpasskey.passkey.model.GetPasskeyRequest
import dev.lilico.testpasskey.passkey.model.UserData
import java.security.SecureRandom
import java.time.Instant
import java.util.UUID

class Passkey(context: Context) {
    private var gson = Gson()
    private var credentialManager = CredentialManager.create(context)

    suspend fun createPasskeyAccount(activity: Activity, email: String) {
            val userId = UUID.randomUUID().toString()
            try {
                val response = credentialManager.createCredential(
                    activity,
                    CreatePublicKeyCredentialRequest(getCreatePasskeyRequest(userId, email)),
                )
                val responseData = gson.fromJson(
                    (response as CreatePublicKeyCredentialResponse).registrationResponseJson,
                    CreatePasskeyResponseData::class.java
                )
                val attestationObject = CborDecoder.decode(responseData.response.attestationObject.b64Decode()).first()
                val authData = (attestationObject as Map).get(UnicodeString("authData")) as ByteString
                val publicKey = parseAuthData(authData.bytes)
                val userData = UserData(responseData.id, email, publicKey.b64Encode(), Instant.now().epochSecond)
                accountRepository.saveUserAccount(responseData.id, userData)
                _state.emit(LoginState.CreateAccountSuccess)
            } catch (e: CreateCredentialException) {
                _state.emit(LoginState.CreateAccountError(e.message ?: "Unknown error"))
                e.printStackTrace()
            }
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

    private fun getLoginPasskeyRequest(allowedCredential: List<String>): String {
        return gson.toJson(
            GetPasskeyRequest(
                challenge = generateFidoChallenge(32),
                timeout = 1800000,
                userVerification = "required",
                rpId = RELYING_PARTY_ID,
                allowCredentials = allowedCredential.map {
                    GetPasskeyRequest.AllowCredentials(
                        id = it,
                        transports = listOf(),
                        type = "public-key"
                    )
                }
            )
        )
    }

    companion object {
        private const val RELYING_PARTY_ID = "passkey.lilico.dev"
    }

}
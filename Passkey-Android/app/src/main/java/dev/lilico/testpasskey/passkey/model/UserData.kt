package dev.lilico.testpasskey.passkey.model

data class UserData(
    val credentialId: String,
    val email: String,
    val publicKey: String,
    val creationDate: Long
)
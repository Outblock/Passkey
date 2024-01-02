package dev.lilico.testpasskey.passkey.model

data class UserData(
    val userId: String,
    val credentialId: String,
    val email: String,
    val publicKey: String,
    val creationDate: Long
)
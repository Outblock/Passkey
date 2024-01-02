package dev.lilico.testpasskey.passkey.model

data class GetPasskeyRequest(
    val challenge: String,
    val allowCredentials: List<AllowCredentials>? = listOf(),
    val timeout: Long,
    val userVerification: String? = null,
    val rpId: String,
) {
    data class AllowCredentials(
        val id: String,
        val transports: List<String>,
        val type: String,
    )
}
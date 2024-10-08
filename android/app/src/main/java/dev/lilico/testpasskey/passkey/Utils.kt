package dev.lilico.testpasskey.passkey

import android.util.Base64

fun String.b64Decode(): ByteArray {
    return Base64.decode(this, Base64.NO_PADDING or Base64.NO_WRAP or Base64.URL_SAFE)
}

fun ByteArray.b64Encode(): String {
    return Base64.encodeToString(this, Base64.NO_PADDING or Base64.NO_WRAP or Base64.URL_SAFE)
}

fun ByteArray.toHex(): String = joinToString(separator = "") { eachByte -> "%02x".format(eachByte) }

fun String.decodeHex(): ByteArray {
    check(length % 2 == 0) { "Must have an even length" }

    return chunked(2)
        .map { it.toInt(16).toByte() }
        .toByteArray()
}
function base64DecodeURL(b64urlstring) {
  return new Uint8Array(
    atob(b64urlstring.replace(/-/g, "+").replace(/_/g, "/"))
      .split("")
      .map((val) => {
        return val.charCodeAt(0);
      })
  );
}

function base64EncodeURL(byteArray) {
  return btoa(
    Array.from(new Uint8Array(byteArray))
      .map((val) => {
        return String.fromCharCode(val);
      })
      .join("")
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=/g, "");
}

function getRandomBytes(length) {
  var array = new Uint8Array(length ?? 32);
  crypto.getRandomValues(array);
  return array;
}

function fmtFlow(balance) {
  if (balance == null) return null
  return String(Number(balance) / 100000000)
}

export { base64DecodeURL, base64EncodeURL, getRandomBytes, fmtFlow };

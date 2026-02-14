const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const GROUPS_PAYLOAD_SALT = "whapi-groups-static-salt-v1";

const toBase64 = (bytes: Uint8Array) => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const fromBase64 = (value: string) => {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(value, "base64"));
  }

  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const deriveKey = async (salt: string) => {
  const material = encoder.encode(`whapi-groups:${salt}`);
  const hash = await crypto.subtle.digest("SHA-256", material);
  return crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
};

export const encryptGroupsPayload = async <T>(payload: T, salt: string) => {
  const key = await deriveKey(salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = encoder.encode(JSON.stringify(payload));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext,
  );

  return {
    ciphertext: toBase64(new Uint8Array(encrypted)),
    iv: toBase64(iv),
  };
};

export const decryptGroupsPayload = async <T>(
  ciphertext: string,
  iv: string,
  salt: string,
) => {
  const key = await deriveKey(salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(iv) },
    key,
    fromBase64(ciphertext),
  );

  return JSON.parse(decoder.decode(new Uint8Array(decrypted))) as T;
};

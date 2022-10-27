import { encryptData, decryptData } from "./crypto";

export const encryption = true;

export const encryptionConfig = {
  updated: false,
  password: ""
};

function encrypt(data: string) {
  return btoa(data);
}

function decrypt(data: string) {
  return atob(data);
}

/**
 * Encrypts data for dynamic caching
 * @param json response json data
 */
export async function encryptCache(json: JSON) {
  let data = JSON.stringify(json);
  let encryptedData = await encryptData(data);
  let encryptedJson = { 
    content: new Uint8Array(encryptedData[0]),
    nonce: encryptedData[1]
  };
  console.log("crypto :: encrypted json: ",encryptedJson);
  console.log("crypto :: content type: ",typeof encryptedJson[0]);
  console.log("crypto :: nonce type: ",typeof encryptedJson[1]);
  return JSON.stringify(encryptedJson);
}

/**
 * Decrypts data for dynamic caching
 * @param json response json data
 */
export async function decryptCache(json: JSON) {
  let data = json["content"];
  let nonce = json["nonce"];
  console.log("crypto :: json: ",json);
  let decryptedData = await decryptData(data, nonce);
  let decryptedJson = JSON.parse(decryptedData);
  return JSON.stringify(decryptedJson);
}

/**
 * Encrypts data for offline sync
 * @param json content json data
 */
export function encryptSyncData(json: JSON) {
  let data = JSON.stringify(json);

  return encrypt(data);
}

/**
 * Decrypts data for offline sync
 * @param data content string data
 */
export function decryptSyncData(data: string) {
  let decryptedData = decrypt(data);

  return JSON.parse(decryptedData);
}
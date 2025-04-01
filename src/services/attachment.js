import axios from 'axios';
import request from '../utils/request';
import global from '../config/global';
import common from '../utils/common';
import crypto from "crypto-browserify";

function get_upload_form(data = { file_name: "", metadata: { cipher_id: "" } }) {
  return request({
    url: global.endpoint.ATTACHMENTS,
    method: 'post',
    data
  })
}

async function upload_file(urlUpload, file) {
  const fileBuffer = Buffer.from(file, "base64");
  return await axios.put(urlUpload, fileBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
}

async function get_file_url(path) {
  return await request({
    url: global.endpoint.ATTACHMENTS_URL,
    method: "post",
    data: {
      path
    }
  });
}

async function remove(data = { paths: [] }) {
  return await request({
    url: global.endpoint.ATTACHMENTS_MULTIPLE_DELETE,
    method: "post",
    data
  });
}

async function encrypt_file(file, key) {
  try {
    const iv = crypto.randomBytes(12) // 12-byte IV for AES-GCM
    const fileData = await common.readFileAsBase64(file) // Read file as base64
    const fileBuffer = Buffer.from(fileData, "base64")

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
    const encryptedData = Buffer.concat([cipher.update(fileBuffer), cipher.final()])
    const authTag = cipher.getAuthTag() // 16-byte AuthTag for integrity

    // Combine IV + AuthTag + Encrypted Data
    const finalData = Buffer.concat([iv, authTag, encryptedData]).toString("base64")
    return finalData
  } catch (error) {
    return null
  }
}

async function decrypt_file(file, key) {
  try {
    const encryptedBase64 = await common.readFileAsBase64(file)
    const encryptedBuffer = Buffer.from(encryptedBase64, "base64")

    // Extract IV, AuthTag, and Encrypted Data
    const iv = encryptedBuffer.slice(0, 12)
    const authTag = encryptedBuffer.slice(12, 28)
    const encryptedData = encryptedBuffer.slice(28)

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(authTag)

    const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()])
    return decryptedData.toString("base64")
  } catch (error) {
    return null
  }
}

export default {
  get_upload_form,
  upload_file,
  get_file_url,
  remove,
  encrypt_file,
  decrypt_file
}

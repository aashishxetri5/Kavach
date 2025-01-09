const NodeRSA = require("node-rsa");
const crypto = require("crypto");
const fs = require("fs");

// KeyManager class to manage RSA keys in PKCS format
class KeyManager {
  constructor(keyDir) {
    this.keySize = 2048;
    this.keyDir = keyDir;
    fs.mkdirSync(keyDir, { recursive: true });
    this.publicKeyPath = `${keyDir}/public_key.pem`;
    this.privateKeyPath = `${keyDir}/private_key.pem`;
  }

  // Ensure RSA keys exist or generate new ones
  generateAndSaveKeyPairs() {
    if (
      !fs.existsSync(this.publicKeyPath) ||
      !fs.existsSync(this.privateKeyPath)
    ) {
      const key = new NodeRSA({ b: this.keySize });
      key.setOptions({ encryptionScheme: "pkcs1" });

      const publicKeyPEM = key.exportKey("pkcs8-public-pem");
      const privateKeyPEM = key.exportKey("pkcs1-pem");

      fs.writeFileSync(this.publicKeyPath, publicKeyPEM);
      fs.writeFileSync(this.privateKeyPath, privateKeyPEM);
    }
  }
}

// Encryption and Decryption class inheriting from KeyManager
class Encryption_and_Decryption {
  encryptAESKey(aesKey, publicKey) {
    const aesKeyBigInt = BigInt(`0x${aesKey}`);
    const { N, e } = this.extractPublicKeyComponents(publicKey);
    let ciphertext = 1n;
    let base = aesKeyBigInt % N;
    let exp = e;

    while (exp > 0n) {
      if (exp % 2n === 1n) {
        ciphertext = (ciphertext * base) % N;
      }
      exp = exp >> 1n;
      base = (base * base) % N;
    }

    const encryptedAesKey = Buffer.from(
      ciphertext.toString(16),
      "hex"
    ).toString("base64");
    return encryptedAesKey;
  }

  // Decrypt the AES key using the RSA private key
  decryptAESKey(encryptedAesKey, privateKey) {
    const ciphertext = BigInt(
      `0x${Buffer.from(encryptedAesKey, "base64").toString("hex")}`
    );
    const { N, d } = this.extractPrivateKeyComponents(privateKey);
    let decrypted = 1n;
    let base = ciphertext % N;
    let exp = d;

    // Calculate decrypted = (ciphertext ** d) % N
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        decrypted = (decrypted * base) % N;
      }
      exp = exp >> 1n;
      base = (base * base) % N;
    }

    const hexDecrypted = decrypted.toString(16).replace(/^0+/, ""); // Remove leading zeros
    return hexDecrypted;
  }

  // Extract N, e, and d from provided keys
  extractPublicKeyComponents(key) {
    const publicKey = crypto.createPublicKey(key);
    const publicKeyDetails = publicKey.export({ format: "jwk" });

    const N = BigInt(
      `0x${Buffer.from(publicKeyDetails.n, "base64").toString("hex")}`
    );
    const e = BigInt(
      `0x${Buffer.from(publicKeyDetails.e, "base64").toString("hex")}`
    );

    return { N, e };
  }

  extractPrivateKeyComponents(key) {
    const privateKey = crypto.createPrivateKey(key);
    const privateKeyDetails = privateKey.export({ format: "jwk" });

    const N = BigInt(
      `0x${Buffer.from(privateKeyDetails.n, "base64").toString("hex")}`
    );
    const d = BigInt(
      `0x${Buffer.from(privateKeyDetails.d, "base64").toString("hex")}`
    );

    return { N, d };
  }
}

module.exports = { Encryption_and_Decryption, KeyManager };

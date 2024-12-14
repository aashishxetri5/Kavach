const NodeRSA = require("node-rsa");
<<<<<<< HEAD
const crypto = require("crypto");
const fs = require("fs");

// KeyManager class to manage RSA keys in PKCS format
class KeyManager {
  constructor(userId, aesKeyHex, keyDir) {
    this.keySize = 2048;

    // Store user ID, AES key, and key directory path
    this.userId = userId;
    this.aesKeyHex = aesKeyHex;
    this.keyDir = keyDir;

    // User-specific key paths
    this.publicKeyPath = `${keyDir}/${userId}_public_key.pem`;
    this.privateKeyPath = `${keyDir}/${userId}_private_key.pem`;

    // Check if keys exist; if not, generate them
    this.ensureKeysExist();

    // Parse keys and extract N and e/d
    this.extractKeyComponents();
  }

  // Ensure RSA keys exist or generate new ones
  ensureKeysExist() {
    if (!fs.existsSync(this.publicKeyPath) || !fs.existsSync(this.privateKeyPath)) {
      console.log(`Keys not found for user ${this.userId}. Generating new keys...`);

      const key = new NodeRSA({ b: this.keySize });
      key.setOptions({ encryptionScheme: "pkcs1" });

      const publicKeyPEM = key.exportKey("pkcs8-public-pem");
      const privateKeyPEM = key.exportKey("pkcs1-pem");

      fs.writeFileSync(this.publicKeyPath, publicKeyPEM);
      fs.writeFileSync(this.privateKeyPath, privateKeyPEM);
    } else {
      console.log(`Keys found for user ${this.userId}.`);
=======

// KeyManager class to extract prime numbers, calculate N and totient, calculate private key using euclidean algorithm
class KeyManager {
  constructor(aesKeyHex) {
    this.keySize = 2048;
    this.e = 65537n; // Common public exponent
    this.generateKeys();
    this.aesKeyHex = aesKeyHex;

    // Generate new keys if they don't exist
    this.d = this.calculatePrivateKey();
  }

  // Generate RSA keys using the library
  generateKeys() {
    const key = new NodeRSA({ b: this.keySize });

    // Extract prime numbers P and Q
    const keyData = key.exportKey("components");
    this.P = BigInt("0x" + keyData.p.toString("hex")); // Convert buffer to BigInt
    this.Q = BigInt("0x" + keyData.q.toString("hex")); // Convert buffer to BigInt
    this.N = this.P * this.Q;
    this.totient = (this.P - 1n) * (this.Q - 1n);
  }

  // Extended Euclidean Algorithm to find modular inverse of e
  extendedGCD(a, b) {
    if (b === 0n) {
      return { gcd: a, x: 1n, y: 0n };
>>>>>>> e5b6874ee655241c4a9d404795045da59ff0b2c7
    }
  }

<<<<<<< HEAD
  // Extract N, e, and d from provided keys
  extractKeyComponents() {
    const publicKeyPEM = fs.readFileSync(this.publicKeyPath, "utf-8");
    const privateKeyPEM = fs.readFileSync(this.privateKeyPath, "utf-8");

    const publicKey = crypto.createPublicKey(publicKeyPEM);
    const publicKeyDetails = publicKey.export({ format: "jwk" });
    this.N = BigInt(`0x${Buffer.from(publicKeyDetails.n, "base64").toString("hex")}`);
    this.e = BigInt(`0x${Buffer.from(publicKeyDetails.e, "base64").toString("hex")}`);

    const privateKey = crypto.createPrivateKey(privateKeyPEM);
    const privateKeyDetails = privateKey.export({ format: "jwk" });
    this.d = BigInt(`0x${Buffer.from(privateKeyDetails.d, "base64").toString("hex")}`);
=======
    const { gcd, x, y } = this.extendedGCD(b, a % b);
    return { gcd: gcd, x: y, y: x - (a / b) * y };
  }

  // Calculate the private key 'd' using e and the totient
  calculatePrivateKey() {
    const { gcd, x } = this.extendedGCD(this.e, this.totient);
    if (gcd !== 1n) {
      throw new Error(
        "e and totient are not coprime, unable to calculate private key."
      );
    }

    // Ensure x is positive
    return ((x % this.totient) + this.totient) % this.totient;
>>>>>>> e5b6874ee655241c4a9d404795045da59ff0b2c7
  }
}

// Encryption and Decryption class inheriting from KeyManager
class Encryption_and_Decryption extends KeyManager {
<<<<<<< HEAD
  constructor(userId, aesKeyHex, keyDir) {
    super(userId, aesKeyHex, keyDir);
  }

  // Encrypt the AES key using the RSA public key
  encryptAESKey(aesKey, fileName) {
    const encryptedAESKeysPath = `${this.keyDir}/${this.userId}_encrypted_keys.json`;
  
    /* Check if encrypted keys file exists, create it if not
    let encryptedKeys = {};
    if (fs.existsSync(encryptedAESKeysPath)) {
      encryptedKeys = JSON.parse(fs.readFileSync(encryptedAESKeysPath, "utf-8"));
    }
  
    // If the encrypted key for this file already exists, return it
    if (encryptedKeys[fileName]) {
      console.log(`Encrypted AES key for ${fileName} already exists.`);
      return encryptedKeys[fileName];
    }*/
  
    // Encrypt the AES key
    const aesKeyBigInt = BigInt(`0x${aesKey}`);
    let ciphertext = 1n;
    let base = aesKeyBigInt % this.N;
    let exp = this.e;
  
=======
  constructor(aesKeyHex) {
    super(aesKeyHex); // Generate or load keys for this specific AES key
  }

  // Encrypt the AES key using the RSA public key
  encryptAESKey(aesKey) {
    const aesKeyBigInt = BigInt(`0x${aesKey}`); // Convert AES key to BigInt
    let ciphertext = 1n;
    let base = aesKeyBigInt % this.N;
    let exp = this.e;

    // Calculate ciphertext = (aesKeyBigInt ** e) % N
>>>>>>> e5b6874ee655241c4a9d404795045da59ff0b2c7
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        ciphertext = (ciphertext * base) % this.N;
      }
      exp = exp >> 1n;
      base = (base * base) % this.N;
<<<<<<< HEAD
    }
  
    const encryptedAESKeyBase64 = Buffer.from(ciphertext.toString(16), "hex").toString("base64");
  
    /* Store the encrypted key in the JSON file
    encryptedKeys[fileName] = encryptedAESKeyBase64;
    fs.writeFileSync(encryptedAESKeysPath, JSON.stringify(encryptedKeys, null, 2));
    console.log(`Encrypted AES key for ${fileName} stored successfully.`);*/
  
    return encryptedAESKeyBase64;
  }
  

  // Decrypt the AES key using the RSA private key
  decryptAESKey(ciphertextBase64) {
    const ciphertext = BigInt(`0x${Buffer.from(ciphertextBase64, "base64").toString("hex")}`); // Decode base64 to BigInt
    let decrypted = 1n;
    let base = ciphertext % this.N;
    let exp = this.d;

    // Calculate decrypted = (ciphertext ** d) % N
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        decrypted = (decrypted * base) % this.N;
      }
      exp = exp >> 1n;
      base = (base * base) % this.N;
    }

    const hexDecrypted = decrypted.toString(16).replace(/^0+/, ""); // Remove leading zeros
    return Buffer.from(hexDecrypted, "hex");
  }

  // Display public and private keys
  displayKeys() {
    const publicKeyPEM = fs.readFileSync(this.publicKeyPath, "utf-8");
    const privateKeyPEM = fs.readFileSync(this.privateKeyPath, "utf-8");
    console.log(`Public Key:\n${publicKeyPEM}`);
    console.log(`Private Key:\n${privateKeyPEM}`);
  }
}

// Example usage
const keyDir = "./keys"; // Directory to store user keys
if (!fs.existsSync(keyDir)) {
  fs.mkdirSync(keyDir);
}

const userId = "Aashish"; // Example user ID
const aesKeyHex = "8F1E2D3C4B5A69708E7D6C5B4A3F2E1D8F1E2D3C4B5A69708E7D6C5B4A3F2E1D"; // Sample AES key in hex
const encryptionDecryption = new Encryption_and_Decryption(userId, aesKeyHex, keyDir);

encryptionDecryption.displayKeys();
const encryptedAESKey = encryptionDecryption.encryptAESKey(aesKeyHex);
console.log("Encrypted AES Key (Base64):", encryptedAESKey);

const decryptedAESKey = encryptionDecryption.decryptAESKey(encryptedAESKey);
console.log("Decrypted AES Key (Hex):", decryptedAESKey.toString("hex"));

=======
    }

    return ciphertext;
  }

  // Decrypt the AES key using the RSA private key
  decryptAESKey(ciphertext) {
    let decrypted = 1n;
    let base = ciphertext % this.N;
    let exp = this.d;

    // Calculate decrypted = (ciphertext ** d) % N
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        decrypted = (decrypted * base) % this.N;
      }
      exp = exp >> 1n;
      base = (base * base) % this.N;
    }

    const hexDecrypted = decrypted.toString(16).padStart(64, "0"); // Convert back to hex
    return Buffer.from(hexDecrypted, "hex");
  }
}

>>>>>>> e5b6874ee655241c4a9d404795045da59ff0b2c7
module.exports = Encryption_and_Decryption;

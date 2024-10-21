const NodeRSA = require("node-rsa");

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
    }

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
  }
}

// Encryption and Decryption class inheriting from KeyManager
class Encryption_and_Decryption extends KeyManager {
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
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        ciphertext = (ciphertext * base) % this.N;
      }
      exp = exp >> 1n;
      base = (base * base) % this.N;
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

module.exports = Encryption_and_Decryption;

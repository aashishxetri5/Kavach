const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const AES_Encrypt = require('./AES.js');

// RSA2048 class to generate Prime Numbers, Calculate Product and Totient
class RSA2048 {
    constructor() {
        this.keySize = 2048;
        this.e = 65537n; // Common public exponent
        this.generateKeys();
    }

    // Generate RSA keys using the library
    generateKeys() {
        const key = new NodeRSA({ b: this.keySize });
        
        // Extract prime numbers P and Q
        const keyData = key.exportKey('components');
        this.P = BigInt('0x' + keyData.p.toString('hex')); // Convert buffer to BigInt
        this.Q = BigInt('0x' + keyData.q.toString('hex')); // Convert buffer to BigInt
        this.N = this.P * this.Q;
        this.totient = (this.P - 1n) * (this.Q - 1n);
    }

}

// KeyManager class is created to select Public Key and Private Key
class KeyManager extends RSA2048 {
    constructor() {
        super();
        this.d = this.calculatePrivateKey();
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
            throw new Error("e and totient are not coprime, unable to calculate private key.");
        }
        
        // Ensure x is positive
        return (x % this.totient + this.totient) % this.totient;
    }

}

// Encryption and Decryption class inheriting from KeyManager
class Encryption_and_Decryption extends KeyManager {
    constructor() {
        super();
    }

    // Encrypt the AES key using the RSA public key
    encryptAESKey(aesKey) {
        const aesKeyBigInt = BigInt('0x' + aesKey.toString('hex')); // Convert AES key to BigInt
        const ciphertext = this.modularExponentiation(aesKeyBigInt, this.e, this.N);
        return ciphertext;
    }

    // Decrypt the AES key using the RSA private key
    decryptAESKey(ciphertext) {
        const decrypted = this.modularExponentiation(ciphertext, this.d, this.N);
        const hexDecrypted = decrypted.toString(16).padStart(64, '0'); // Convert back to hex
        return Buffer.from(hexDecrypted, 'hex');
    }

    // Perform modular exponentiation: (base ** exp) % mod
    modularExponentiation(base, exp, mod) {
        let result = 1n;
        base = base % mod;

        while (exp > 0n) {
            if (exp % 2n === 1n) {
                result = (result * base) % mod;
            }
            exp = exp >> 1n;
            base = (base * base) % mod;
        }

        return result;
    }


    // Display encryption and decryption results
    demonstrateEncryptionDecryption() {
        // Given AES key
        const message = "Hi there, This is aashish speaking to the world.";
        const { key, iv, ciphermsg } = AES_Encrypt(message);
        const aesKey = Buffer.from(key, 'hex');

        console.log(`Original AES Key: ${aesKey.toString('hex')}`);
        
        // Display the AES key using RSA public key
        const ciphertext = this.encryptAESKey(aesKey);
        console.log(`\nRSA Encrypted AES Key (Ciphertext): ${ciphertext}`);
        
        // Display the AES key using RSA private key
        const decryptedKey = this.decryptAESKey(ciphertext);
        console.log(`\nDecrypted AES Key: ${decryptedKey.toString('hex')}`);
        
        // Verification
        if (decryptedKey.equals(aesKey)) {
            console.log("\nDecryption successful: AES keys match!");
        } else {
            console.log("\nDecryption failed: AES keys do not match.");
        }
    }
}

// Create an instance of Encryption_and_Decryption and demonstrate encryption/decryption
const show = new Encryption_and_Decryption();
show.demonstrateEncryptionDecryption();

module.exports = Encryption_and_Decryption;

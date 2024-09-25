// Import the library
const cryptoUtils = require('bigint-crypto-utils');
const crypto = require('crypto'); // Required for OAEP padding
const { Buffer } = require ('node:buffer'); // Required for buffering

const buf = Buffer.from('buffer');

// Import module from AES.js
// const { key } = require('./AES.js');
const key = "a68fbc00805a91b4bf3899a6b69749dcdb10a1ed495746a483a62b61080191d6";

const e = BigInt(65537); // Common public exponent

// Create a class to handle prime generation
class GenerateKeys {
    constructor() {
        this.p = BigInt(0);        // Prime number p
        this.q = BigInt(0);        // Prime number q
    }

    // Method to generate a random prime number of given bits synchronously
    generateRandomPrime(bits) {
        return cryptoUtils.primeSync(bits); // Synchronous method to generate a prime number
    }

    // Method to generate both primes and return them
    generateKeys() {
        this.p = this.generateRandomPrime(1024);
        this.q = this.generateRandomPrime(1024);
        return { p: this.p, q: this.q }; // Return an object containing p and q
    }
}

// Define KeyManager class that inherits from GenerateKeys
class KeyManager extends GenerateKeys {
    constructor() {
        super(); // Call the parent constructor
    }

    // Method to calculate the product of p and q
    calculateProduct() {
        const { p, q } = this.generateKeys(); // Get p and q from the generateKeys method
        const n = p * q;
        return n;
    }

    // Method to calculate the totient
    calculateTotient() {
        const { p, q } = this; // Access p and q from the current instance
        const phi_n = (p - BigInt(1)) * (q - BigInt(1));
        return phi_n;
    }

    // Method to select the public key 'e' such that gcd(e, φ(n)) = 1
    selectPublicKey() {
        const phi_n = this.calculateTotient();
        if (this.gcd(e, phi_n) === BigInt(1)) {
            return e;
        } else {
            return null;
        }
    }

    // Helper method to calculate the Greatest Common Divisor (GCD) for Public Key
    gcd(a, b) {
        while (b !== BigInt(0)) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Method to select the private key 'd' such that (d % phi_n + phi_n) % phi_n
    selectPrivateKey() {
        const phi_n = this.calculateTotient(); // Example totient

        const { gcd, x: d } = this.extendedGCD(e, phi_n);

        if (gcd === BigInt(1)) { // e and phi(n) are coprime
            const positiveD = (d % phi_n + phi_n) % phi_n; // Ensure d is positive
            return positiveD;
        } else {
            return null;
        }
    }

    // Helper method to calculate Extended GCD for Private Key
    extendedGCD(a, b) {
        if (a === BigInt(0)) {
            return { gcd: b, x: BigInt(0), y: BigInt(1) };
        }
        const { gcd, x: x1, y: y1 } = this.extendedGCD(b % a, a);
        const x = y1 - (b / a) * x1;
        const y = x1;
        return { gcd, x, y };
    }
}

class Encryption_and_Decryption extends KeyManager {
    constructor() {
        super();
    }

    // Method to pad the AES key using OAEP padding
    padKey(aesKey) {
        const keyBuffer = Buffer.from(aesKey, 'utf-8');
        const keyLength = 256 / 8; // Key length in bytes for AES-256
        const label = Buffer.from(''); // Optional label

        // Determine the length for the padding
        const paddedData = crypto.createHash('sha256').update(keyBuffer).digest();
        const db = Buffer.concat([Buffer.alloc(keyLength - paddedData.length - 2), paddedData, Buffer.from([0x01])]);

        // Create a mask
        const hash = crypto.createHash('sha256').update(label).digest();
        const mask = Buffer.alloc(db.length);
        for (let i = 0; i < db.length; i++) {
            mask[i] = hash[i % hash.length] ^ db[i];
        }

        // Final OAEP padded key
        return Buffer.concat([Buffer.from([0x00]), mask]);
    }

    RSA_Encrypt() {
        // Apply OAEP padding to the AES key
        const paddedKey = this.padKey(key);

        // Encrypt using RSA
        const n = this.calculateProduct(); // Get n
        const paddedKeyBigInt = BigInt('0x' + paddedKey); // Convert to BigInt
        const encryptedAesKey = (paddedKeyBigInt ** e) % n; // RSA Encryption
        const ciphertext = encryptedAesKey.toString(16);
        console.log("Encrypted AES Key using RSA (Hex): ", ciphertext);
    }

    RSA_Decrypt() {
        const n = this.calculateProduct(); // Get n
        const d = this.selectPrivateKey(); // Select the private key 'd'
        const encryptedAesKey = this.encryptedAesKey; // Retrieve the encrypted key
    
        // RSA Decryption
        const decryptedAesKeyBigInt = (encryptedAesKey ** d) % n;
        
        // Convert the decrypted key from BigInt to Buffer
        const decryptedKeyBuffer = Buffer.from(decryptedAesKeyBigInt.toString(16), 'hex');
    
        // OAEP Padding Removal
        const hLen = 32; // Length of the SHA-256 hash output
        const seed = decryptedKeyBuffer.slice(0, hLen); // Masked seed
        const maskedDB = decryptedKeyBuffer.slice(hLen); // Masked data block
    
        // Unmasking the data block
        const hash = crypto.createHash('sha256').update('').digest(); // Generate SHA-256 hash
        const originalDataBlock = Buffer.alloc(maskedDB.length);
        
        for (let i = 0; i < maskedDB.length; i++) {
            originalDataBlock[i] = maskedDB[i] ^ hash[i % hash.length]; // Unmask the data block
        }
    
        // Extract the original AES key (after the first occurrence of 0x01)
        const originalAesKey = originalDataBlock.slice(originalDataBlock.indexOf(1) + 1);
        console.log("Decrypted AES Key: ", originalAesKey.toString('utf-8')); // Output the original AES key
    }
    
}

const show = new Encryption_and_Decryption();
show.RSA_Encrypt;
show.RSA_Decrypt;


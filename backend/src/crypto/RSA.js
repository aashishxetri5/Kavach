const NodeRSA = require('node-rsa');
const fs = require('fs');


// KeyManager class to extract prime numbers, calculate N and totient, calculate private key using euclidean algorithm
class KeyManager {
    constructor(aesKeyHex) {
        this.keySize = 2048;
        this.e = 65537n; // Common public exponent
        this.generateKeys();
        this.aesKeyHex = aesKeyHex;

        // Check for existing keys inside the file
        const keyFileName = `keys.json`;
        if (fs.existsSync(keyFileName)) {
            const keys = this.loadKeysFromFile(keyFileName);
            if (keys[this.aesKeyHex]) {
                // Load existing key if they exist for the AES key
                this.e = BigInt(keys[this.aesKeyHex].publicKey.e);
                this.N = BigInt(keys[this.aesKeyHex].publicKey.N);
                this.d = BigInt(keys[this.aesKeyHex].privateKey.d);
                console.log(`Loaded existing RSA keys for AES Key: ${this.aesKeyHex}`);
                return; // Exit the constructor
            }
        }

        // Generate new keys if they don't exist
        this.d = this.calculatePrivateKey();
        this.saveKeysToFile(); // Only save keys if they don't already exist
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

    // Load existing keys from a file
    loadKeysFromFile(keyFileName) {
        return JSON.parse(fs.readFileSync(keyFileName));
    }

    // Save the public and private keys to a file if the AES key doesn't exist
    saveKeysToFile() {
        const keyFileName = `keys.json`; // Using a single file to store all keys
        const keys = fs.existsSync(keyFileName) ? this.loadKeysFromFile(keyFileName) : {};

        // Check if the AES key already exists in the file
        if (keys[this.aesKeyHex]) {
            console.log(`RSA keys for AES key ${this.aesKeyHex} already exist. Skipping save.`);
            return;
        }

        // Store the keys for the specific AES key if not already present
        keys[this.aesKeyHex] = {
            publicKey: { e: this.e.toString(), N: this.N.toString() },
            privateKey: { d: this.d.toString(), N: this.N.toString() }
        };

        fs.writeFileSync(keyFileName, JSON.stringify(keys, null, 2));
        console.log(`RSA keys saved for AES key ${this.aesKeyHex} in ${keyFileName}.`);
    }
}

// Encryption and Decryption class inheriting from KeyManager
class Encryption_and_Decryption extends KeyManager {
    constructor(aesKeyHex) {
        super(aesKeyHex); // Generate or load keys for this specific AES key
    }

    // Encrypt the AES key using the RSA public key
    encryptAESKey(aesKey) {
        const aesKeyBigInt = BigInt('0x' + aesKey.toString('hex')); // Convert AES key to BigInt
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

        const hexDecrypted = decrypted.toString(16).padStart(64, '0'); // Convert back to hex
        return Buffer.from(hexDecrypted, 'hex');
    }

    // Display encryption and decryption results
    demonstrateEncryptionDecryption() {
        // Given AES key
        const aesKey = Buffer.from(this.aesKeyHex, 'hex');

        console.log(`\nOriginal AES Key: ${aesKey.toString('hex')}`);
        
        // Encrypt the AES key using RSA public key
        const ciphertext = this.encryptAESKey(aesKey);
        console.log(`\nRSA Encrypted AES Key (Ciphertext): ${ciphertext}`);
        //Decrypt the AES key using RSA private key
        const decryptedKey = this.decryptAESKey(ciphertext);
        console.log(`\nDecrypted AES Key: ${decryptedKey.toString('hex')}`);
        
        // Verification
        if (decryptedKey.equals(aesKey)) {
            console.log("\nDecryption successful: AES keys match!");
        } else {
            console.log("Decryption failed: AES keys do not match.");
        }

        // Save the encrypted AES key to the same `keys.json` file
        const keyFileName = `keys.json`;
        const keys = fs.existsSync(keyFileName) ? this.loadKeysFromFile(keyFileName) : {};

        // Update the keys with the encrypted AES key
        if (keys[this.aesKeyHex]) {
            keys[this.aesKeyHex].encryptedAESKey = ciphertext.toString();
        } else {
            keys[this.aesKeyHex] = {
                publicKey: { e: this.e.toString(), N: this.N.toString() },
                privateKey: { d: this.d.toString(), N: this.N.toString() },
                encryptedAESKey: ciphertext.toString()
            };
        }

        fs.writeFileSync(keyFileName, JSON.stringify(keys, null, 2));
        console.log(`Encrypted AES key saved inside ${keyFileName} under AES key section.`);
    }
}

// Example AES keys for demonstration
const aesKeys = '6a43d878fb05fc41d8142131e0f97cbe584f9d73434e7fd79f822e4f443bd53e';
const aesKeyHex = aesKeys;

const show = new Encryption_and_Decryption(aesKeyHex);
show.demonstrateEncryptionDecryption(); // Perform the demonstration for each AES key

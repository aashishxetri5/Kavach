const crypto = require('crypto');

// Step 1: Generate RSA keys
function generateRSAKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
    });
    console.log('Public Key:', publicKey.export({ type: 'spki', format: 'pem' }));
    return { publicKey, privateKey };
}

// Step 2: Encrypt an AES key using the RSA public key
function encryptAESKey(aesKey, publicKey) {
    const encryptedKey = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        aesKey
    );
    return encryptedKey;
}

// Step 3: Decrypt the AES key using the RSA private key
function decryptAESKey(encryptedKey, privateKey) {
    const decryptedKey = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        encryptedKey
    );
    return decryptedKey;
}

// Example usage
const { publicKey, privateKey } = generateRSAKeys();

// Generate a random AES key (256 bits)
const aesKey = '6a43d878fb05fc41d8142131e0f97cbe584f9d73434e7fd79f822e4f443bd53e' // AES-256 key

// Encrypt the AES key
const encryptedKey = encryptAESKey(aesKey, publicKey);
console.log('Encrypted AES Key:', encryptedKey.toString('hex'));

// Decrypt the AES key
const decryptedKey = decryptAESKey(encryptedKey, privateKey);
console.log('Decrypted AES Key:', decryptedKey.toString('hex'));

// Verify that the original AES key and decrypted key are the same
console.log(typeof aesKey, typeof decryptedKey);
console.log('Keys match:', aesKey === decryptedKey);
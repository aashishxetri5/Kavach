class Sha256 {
  constructor() {
    /**
 * SHA-256 Constants
 K contains the first 32 bits of the fractional parts of the cube roots of the first 64 primes.
These are the round constants used in each of the 64 rounds of the compression function.
 */
    this.K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
      0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
      0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
      0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
      0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
      0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
      0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
      0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
      0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];

    this.H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
      0x1f83d9ab, 0x5be0cd19,
    ];
  }

  /**
   * Rotates a 32-bit value `value` to the right by `shift` bits.
   * Right-rotate means shifting bits to the right and wrapping shifted-out bits to the left.
   * @param {number} value - The value to rotate
   * @param {number} shift - Number of positions to rotate
   * @returns {number} The rotated value
   */
  rightRotate(value, shift) {
    return ((value >>> shift) | (value << (32 - shift))) >>> 0;
  }

  /**
   * The main SHA-256 hash function.
   * This function takes a message and computes its SHA-256 hash based on the algorithm specification.
   * @param {string} message - The input message to be hashed
   * @returns {string} - The resulting 256-bit hash as a hex string
   */
  hash(message) {
    // Pre-processing (padding)
    const originalMessage = Buffer.from(message, "utf8");
    let binaryMessage = "";
    for (let i = 0; i < originalMessage.length; i++) {
      binaryMessage += originalMessage[i].toString(2).padStart(8, "0");
    }
    binaryMessage += "1";
    while ((binaryMessage.length + 64) % 512 !== 0) {
      binaryMessage += "0";
    }
    const lengthInBits = (originalMessage.length * 8)
      .toString(2)
      .padStart(64, "0");
    binaryMessage += lengthInBits;

    // Convert binary string to an array of 512-bit chunks
    let chunks = [];
    for (let i = 0; i < binaryMessage.length; i += 512) {
      chunks.push(binaryMessage.slice(i, i + 512));
    }

    chunks.forEach((chunk) => {
      // Initialize message schedule array
      let w = new Array(64);
      for (let i = 0; i < 16; i++) {
        w[i] = parseInt(chunk.slice(i * 32, (i + 1) * 32), 2);
      }

      /**
       * Formula:
       *
       * s0=(w[i - 15] ROTR 7)⊕(w[i - 15] ROTR 18)⊕(w[i - 15] >> 3)
       *
       * Explanation:
       * The s0 formula is designed to "mix" the bits of the word w[i - 15] by
       * using different bit shifts and rotations,
       * which helps in creating more randomness in the extended words.
       *
       * s1=(w[i - 2] ROTR 17)⊕(w[i - 2] ROTR 19)⊕(w[i - 2] >> 10)
       *
       * Explanation:
       * The s1 formula applies similar logic to the word w[i - 2], introducing bit-level randomness.
       * The combination of bit shifts and rotations ensures that the message schedule is well-dispersed and nonlinear.
       */
      for (let i = 16; i < 64; i++) {
        const s0 =
          this.rightRotate(w[i - 15], 7) ^
          this.rightRotate(w[i - 15], 18) ^
          (w[i - 15] >>> 3);
        const s1 =
          this.rightRotate(w[i - 2], 17) ^
          this.rightRotate(w[i - 2], 19) ^
          (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }

      // Initialize working variables to current hash value
      let [a, b, c, d, e, f, g, h] = this.H;

      // Compression function main loop
      for (let i = 0; i < 64; i++) {
        const S1 =
          this.rightRotate(e, 6) ^
          this.rightRotate(e, 11) ^
          this.rightRotate(e, 25);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + this.K[i] + w[i]) >>> 0;
        const S0 =
          this.rightRotate(a, 2) ^
          this.rightRotate(a, 13) ^
          this.rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) >>> 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) >>> 0;
      }

      // Add the compressed chunk to the current hash value
      this.H[0] = (this.H[0] + a) >>> 0;
      this.H[1] = (this.H[1] + b) >>> 0;
      this.H[2] = (this.H[2] + c) >>> 0;
      this.H[3] = (this.H[3] + d) >>> 0;
      this.H[4] = (this.H[4] + e) >>> 0;
      this.H[5] = (this.H[5] + f) >>> 0;
      this.H[6] = (this.H[6] + g) >>> 0;
      this.H[7] = (this.H[7] + h) >>> 0;
    });

    // Produce the final hash value (big-endian)
    return this.H.map((value) => value.toString(16).padStart(8, "0")).join("");
  }
}

module.exports = Sha256;

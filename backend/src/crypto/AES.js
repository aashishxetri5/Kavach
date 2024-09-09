const { sbox } = require("./SBox.js");
const crypto = require("crypto");

function generateKey() {
  const date = new Date().toString(32);

  const aesKey = crypto
    .createHash("sha256")
    .update(date)
    .digest("hex")
    .slice(0, 32);

  return aesKey;
}

/**
 * * This method rotates the provided array by mentioned shift position.
 *
 * @param {*} array Accepts every row of the 4x4 matrix.
 * @param {*} shiftPos Indicates the number of positions to be shifted.
 * @returns the shifted array.
 */
function rotateRight(array, shiftPos) {
  let length = array.length;
  shiftPos = shiftPos % length;

  return array.slice(shiftPos).concat(array.slice(0, shiftPos));
}

/**
 * ? Shift Row stage
 * * This stage is repeated in every round (upto N)
 * * In this, circular shiting happens in every row of the 4x4 matrix.
 * * First row is shifted by 0, second by 1, third by 2 and fourth by 3 position.
 *
 * @Param state The parameter is the current state of the matrix. Its value changes in every round.
 */
function shiftRows(state) {
  let shiftBy = 0;

  state.forEach((row) => {
    state[shiftBy] = rotateRight(row, shiftBy);
    shiftBy++;
  });

  console.log(state);
}
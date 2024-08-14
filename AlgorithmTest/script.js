//NOTE: Nomor 1
let word = "NEGIE1";

let word2 = "";
for (const karakter of word) {
  if (!isNaN(karakter)) word2 += karakter;
  else {
    word2 = karakter + word2;
  }
}
console.log(`hasil no 1 = ${word2}`);

//NOTE: Nomor 2

let sentence = "Saya sangat senang mengerjakan soal algoritma";
let kataTerpanjang = "";
let sentenceSeparation = sentence.split(" ");
let palingPanjang = 0;

for (const kata of sentenceSeparation) {
  if (kata.length > palingPanjang) {
    palingPanjang = kata.length;
    kataTerpanjang = kata;
  }
}

console.log(`hasil no 2 = ${kataTerpanjang}`);

//NOTE: Nomor 3

const input = ["xc", "dz", "bbb", "dz"];
const query = ["bbb", "ac", "dz"];
let countResult = [];

for (const q of query) {
  let num = 0;
  for (const i of input) {
    if (i === q) {
      num++;
    }
  }
  countResult.push(num);
}

console.log(`hasil no 3 = ${countResult}`);

//NOTE: Nomor 4

const Matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];

function penguranganDiagonalKiriKanan(Matrix) {
  let diagonalKiri = 0;
  let diagonalKanan = 0;
  let n = Matrix.length;

  for (let i = 0; i < n; i++) {
    diagonalKiri += Matrix[i][i];
    diagonalKanan += Matrix[i][n - i - 1];
  }

  return diagonalKiri - diagonalKanan;
}

console.log(`hasil no 3 = ${penguranganDiagonalKiriKanan(Matrix)}`);

//const Block = require('./block');
//const {Blockchain} = require('./blockchain');
const {sampleChain} = require('./blockchain');

// let jsChain = new Blockchain;

// console.log("Mining block 1...");
// jsChain.addBlock(new Block());
//console.log("Mining block 2...");
//jsChain.addBlock(new Block({amount: 10}));

console.log(JSON.stringify(sampleChain, null, 4));
console.log("Is blockchain valid? " + sampleChain.checkValid());

const Block = require('./block');
const Blockchain = require('./blockchain');

console.log(JSON.stringify(sampleChain, null, 4));
console.log("Is blockchain valid? " + sampleChain.checkValid());

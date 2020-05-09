const Block = require('./block');
const Blockchain = require('./blockchain');
const Encrypt = require('./encrypt');
const P2sh = require('./p2sh');
const pubKey = require('./pubKey');
const secretKey = require('./secretKey');
const Transaction = require('./transaction');
const Decrypt = require('./decrypt');
const Uuid = require('./uuid');

const shangaChain = new Blockchain();

// jsonfile.writeFile(blockchainPath, shangaChain)
// .then(res => {console.log("write complete")})
// .catch(err => {console.log(error)
// });

module.exports = shangaChain;

//console.log(JSON.stringify(shangaChain, null, 4));
// console.log("Is blockchain valid? " + sampleChain.checkValid());
const Encrypt = require('./encrypt');

module.exports = class Transaction{
    constructor(data){
        this.data = data;
        this.UUID = this.getproductUUID();
        this.createdAt = new Date();
    }

    getproductUUID(){
        return new Encrypt(this.data).getUUID();
    }
}

//let tx1 = new Transact("my first transaction");

//console.log(JSON.stringify(tx1, null, 4));
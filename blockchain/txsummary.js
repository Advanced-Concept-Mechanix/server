//class for creating a summary of transactions

class TxSummary{
    constructor(){
        this.transactionSummary = [];
    }

    addTx(newTx){
        newTx.calculateHash();
        this.transactionSummary = [...this.transactionSummary, newTx];
    }

    count(){
        return this.transactionSummary.length;
    }
}

let txSummary = new TxSummary();

module.exports = txSummary;
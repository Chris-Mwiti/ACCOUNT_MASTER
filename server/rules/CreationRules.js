class CreationRules{
    constructor(amount){
        this.amount = amount
    }

    generalAccount(){
        if (this.amount < 500) return false
        return true
    }

    savingsAccount(){
        if(this.amount < 1000) return false
        return true
    }
}

module.exports = CreationRules
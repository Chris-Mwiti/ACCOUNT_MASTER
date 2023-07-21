// Properties: Unique, should have a length of 10 digits and should consist of only numbers
const accountNumberGen = () => {
    const strNumbers = [];
    while (strNumbers.length < 10){
        const num = Math.floor(Math.random() * 10);
        if(strNumbers.indexOf(num) === -1){
            strNumbers.push(num);
        }
    }
    const numbers = strNumbers.join('');   
    const accountNumber = Number(numbers);
    return accountNumber ;
}

accountNumberGen()

module.exports = accountNumberGen


// Properties: Unique, should have a length of 10 digits and should consist of only numbers
const accountNumberGen = () => {
    const numbers = [];
    while (numbers.length < 10){
        const num = Math.floor(Math.random() * 10);
        if(numbers.indexOf(num) === -1){
            numbers.push(num);
        }
    }
    numbers.join('');   
    const accountNumber = Number(numbers);
    return accountNumber ;
}

module.exports = accountNumberGen


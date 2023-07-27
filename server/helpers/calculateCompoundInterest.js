const calculateInterest = (principle,rate,hours,minutes) => {
    const fractionalTime = (hours + (minutes / 60)) / (364 / 24);
    const interest = (principle * rate * fractionalTime) / 100;

    return interest.toFixed(2);
}

module.exports = calculateInterest
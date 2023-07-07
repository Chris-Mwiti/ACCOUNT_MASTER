const recordIdGenerator = (() => {
    let counter = 1
    return (prefix) => {
        const code = `${prefix}${String(counter).padStart(3, '0')}`;
        counter++;
        console.log(code)
        return code
    }
})();


module.exports = recordIdGenerator;

const Keyvalidation = (body) => {
    Keys = []
    for(let key of body){
        if(Keys.includes(key)){
            console.log(`should be diff ${key}`)
            return `All keys should be different...Change this key ${key}`;
            
        } else {
            Keys.push(key)
        }
    }}

module.exports = { Keyvalidation }
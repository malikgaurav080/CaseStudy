// const a = {
//     "key1": "a",
//     "key2": "b",
//     "key3": "b",
//     "key4": "d",
//     "key5": "e",
// }

const chars = ["a", "b", "b", "c", "d"];
chr = []
for(let ch of chars){
    if(chr.includes(ch)){
        console.log(`should be diff ${ch}`)
        return
    } else {
        chr.push(ch)
    }
}

console.log(chr)


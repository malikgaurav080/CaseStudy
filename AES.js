const crypto = require('crypto');
const buffer=require('buffer');

const key = Buffer.from('BpwiCmfkfEFNjxqfLRzPk/YhgwZqPxL8o3if2/2CZHg=','base64')
// const key= (crypto.randomBytes(32), 'base64');

function encrypt(plaintext) {
    const plaintextJson = JSON.stringify(plaintext)

    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv('aes-256-gcm',key, iv)
    const enc = Buffer.concat([cipher.update(plaintextJson, 'utf8'), cipher.final()])

    return [enc, iv, cipher.getAuthTag()].map(e => e.toString('base64')).join('~')
}

function decrypt(ciphertext) {
    const [enc, iv, authTag] = ciphertext.split('~').map(e => Buffer.from(e, 'base64'))
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)
    
    const plaintext = Buffer.concat(
        [decipher.update(enc, 'utf8'), decipher.final()]).toString()
    return JSON.parse(plaintext)
}

// const plaintext = JSON.stringify({
//     expiresAt: 1660223874,
//     data: {
//         user: 'connelly.abdullah@schmeler.com',
//         verification_code: '336028',
//         signed_in: false
//     }
// })

// const ciphertext = encrypt(plaintext, key)
// console.log(`ciphertext:\n${ciphertext}\n`)

// // const ciphertext = "tUB3DHWyqn+7sVGAfziQU3NdeobpcxhNoZrIKn2zNnL5EYsYPuAucDr7Ll7dVczbe3al8xBmWAHYG2lkKnTyMb6MC/Jt1CyD7ybVJQwczStAsXV5rOz3gy6IULKt0NmViP/mRBAd45ZLuIqmQ2K24WufKLpNZUpiN9ukUYpzU7CWx6kWEGzNrA==~hIgl2sEN6qGJZ1HePC2ATw==~LIcVOOZeCfZz+SfTkS4IhA=="

// const plaintextDecrypted = decrypt(ciphertext, key)
// console.log(`plaintext:\n${plaintextDecrypted}\n`)

module.exports={encrypt,decrypt};
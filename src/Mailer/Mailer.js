const https = require('https')

// Keys used to encode	
const masterString = process.env.MASTER_STRING;
const MasterStrArry = StringToBytes(masterString);

const masterKeyString = process.env.MASTER_KEY_STRING;
const MasterKeyArry = StringToBytes(masterKeyString);

var htmlEmail = { to: "", from: "", subject: "", file: "", var_old: "", var_new: "" }; // message structure

const mailer = {

    sendMail: (to, from, subject, file, var_old, var_new) => {

        htmlEmail.to = to;
        htmlEmail.from = from;
        htmlEmail.subject = subject;
        htmlEmail.file = file; // you host the file you want to be emailed
        htmlEmail.var_old = var_old; // Variables on HTML to swap - Order must match
        htmlEmail.var_new = var_new; // Variables on HTML to swap - Order must match

        // Encode the message

        const data = EncodeMessage(htmlEmail);

        const options = {
            hostname: process.env.MAIL_HOSTNAME,
            path: '/mail_api/mail_api.php/mail_handler',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)

            res.on('data', d => {
                process.stdout.write(d)
            })
        })

        req.on('error', error => {
            console.error(error)
        })

        req.write(data)
        req.end()
    }
}

//******************************* this is all my functions

// Check if the transponder message is correct
function EncodeMessage(msg) {
    var i;
    var tmpInt;
    var tmpRandByte = [];
    var tmpRandomKey = [];
    var tmpOutKey = [];

    for (i = 0; i < 32; i++) {
        tmpRandByte[i] = Math.floor(Math.random() * (255) + 1);
    }

    for (i = 0; i < 32; i++) {
        tmpRandomKey[i] = tmpRandByte[i] ^ MasterStrArry[i];
    }

    for (i = 0; i < 16; i++) {
        tmpInt = MasterKeyArry[i];
        tmpOutKey[i] = tmpRandByte[tmpInt % 16];
    }

    var tmpTime = Math.round(Date.now() / 1000);
    var tmpKey1 = strToHex(bin2String(tmpRandomKey), tmpRandomKey.length);
    var tmpKey2 = strToHex(bin2String(tmpOutKey), tmpOutKey.length);

    // Calc the CRC Order matters, don't crc the var_old and var_new
    var tmpCrc = crcHelperStr2Bytes(0, tmpKey1);
    tmpCrc = crcHelperStr2Bytes(tmpCrc, tmpKey2);
    //tmpCrc = crcHelperStr2Bytes(tmpCrc, tmpTime); // dont CRC

    tmpCrc = crcHelperStr2Bytes(tmpCrc, msg.from);
    tmpCrc = crcHelperStr2Bytes(tmpCrc, msg.subject);
    tmpCrc = crcHelperStr2Bytes(tmpCrc, msg.file);
    tmpCrc = crcHelperStr2Bytes(tmpCrc, msg.to);


    return JSON.stringify({
        to: htmlEmail.to,
        from: htmlEmail.from,
        subject: htmlEmail.subject,
        file: htmlEmail.file,
        var_old: htmlEmail.var_old, // Order must match
        var_new: htmlEmail.var_new, // Order must match
        key_1: tmpKey1,
        key_2: tmpKey2,
        timestamp: tmpTime,
        crc: tmpCrc,
    });

}

function StringToBytes(str) {
    var bytes = []; // char codes

    for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);

        bytes = bytes.concat([code]);
    }
    return bytes;
}

function strToHex(str, len) {
    var arr1 = [];
    for (var n = 0, l = len; n < l; n++) {
        var hex = Number(str.charCodeAt(n)).toString(16);
        if (hex.length < 2)
            hex = "0" + hex;
        arr1.push(hex);
    }
    return arr1.join('');
}

function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}

function crcHelperStr2Bytes(crc, elm) {
    return crc32c(crc, StringToBytes(elm), StringToBytes(elm).length)
}

function crc32c(crc, buf, len) {
    var k;
    var buffIdx = 0;
    const POLY = 0xe1f9643d;

    crc = ~crc >>> 0;
    while (len--) {
        crc ^= buf[buffIdx++];

        for (k = 0; k < 8; k++)
            crc = crc >>> 0 & 1 ? (crc >>> 1) ^ POLY >>> 0 : crc >>> 1;

    }
    return ~crc >>> 0;
}

module.exports = mailer
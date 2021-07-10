const fs = require('fs');
const readStream = fs.createReadStream('./access.log', 'utf8');


readStream.on('data', (chunk) => {
    let arr = chunk.split('\n');
    let addresses = [`89.123.1.41`, `34.48.240.111`];
    

    arr.forEach(element => {
        for (let i = 0; i < addresses.length; i++) {
            if (element.includes(addresses[i])) {
                const writeStream = fs.createWriteStream(`./${addresses[i]}_request.log`, { flags: 'a', encoding: 'utf8' });
                writeStream.write(element + `\n`);
                writeStream.end();
            }
        }
    });
    
    console.log(arr);
});

readStream.on('end', () => console.log('File reading finished'));
readStream.on('error', (err) => console.log(err));

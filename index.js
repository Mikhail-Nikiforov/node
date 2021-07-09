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

            } else if (element.includes(addresses[i])) {
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

// writeStream.on('error', err => console.log(err));


// readStream.pipe(writeStream).pipe(process.stdout);

// const log1 = '89.123.1.41 - - [30/Jan/2021:11:11:20 -0300] "POST /foo HTTP/1.1" 200 0 "-" "curl/7.47.0"';
// const log2 = '34.48.240.111 - - [30/Jan/2021:11:11:25 -0300] "GET /boo HTTP/1.1" 404 0 "-" "curl/7.47.0"';

// fs.writeFile('./access.log', log1, {flag: 'a' }, (err) => console.log(err));
// fs.writeFile('./access.log', '\n', { flag: 'a' }, (err) => console.log(err));

// readStream.on('data', (chunk) => {
//     console.log('chunk');
//     console.log(chunk);
// });
// readStream.on('end', () => console.log('File reading finished'));
// readStream.on('error', () => console.log(err));

// writeStream.write('\n');
// writeStream.write(log1);

// writeStream.end(() => console.log('File writing finished'));
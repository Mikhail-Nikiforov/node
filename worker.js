const { workerData, parentPort } = require('worker_threads');
const fs = require('fs');


const readStream = fs.createReadStream(workerData, 'utf8');
const adresses = [`89.123.1.41`, `34.48.240.111`];
const writeStreams = [];

adresses.forEach(element => {
    writeStreams.push({ ip: element, item: fs.createWriteStream(`./test/${element}_request.txt`, { flags: 'a', encoding: 'utf8' }) });
});

readStream.on('data', (chunk) => {
    let arr = chunk.split('\n');    

    arr.forEach(element => {
        for (let i = 0; i < writeStreams.length; i++) {
            if (element.includes(writeStreams[i].ip)) {
                writeStreams[i].item.write(element + `\n`);
            }
        }
    });
});


readStream.on('end', () => {
    writeStreams.forEach(element => {
    element.item.on('finish', () => {
        console.log(`Файл с логами для IP ${element.ip} создан`);
    });
    element.item.end();
});
});
readStream.on('error', (err) => console.log(err));


parentPort.postMessage({ result: `Log file created` });
const fs = require('fs');


const readStream = fs.createReadStream('./access.log', 'utf8');
const adresses = [`89.123.1.41`, `34.48.240.111`];
const writeStreams = [];

adresses.forEach(element => {
    writeStreams.push({ ip: element, item: fs.createWriteStream(`./${element}_request.log`, { flags: 'a', encoding: 'utf8' }) });
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
    console.log('Чтение файла заверешено');
    writeStreams.forEach(element => {
    element.item.on('finish', () => {
        console.log(`Файл с логами для IP ${element.ip} создан`);
    });
    element.item.end();
});
});
readStream.on('error', (err) => console.log(err));

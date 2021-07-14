#!/usr/bin/env node

const EventEmmitter = require('events');
const fs = require('fs');
const yargs = require("yargs");
const path = require("path");
const readline = require("readline");
const inquirer = require("inquirer");

const emitter = new EventEmmitter();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

emitter.on(`pathChosen`, (directoryPath) => {
    let list = fs.readdirSync(directoryPath)

    inquirer
        .prompt([
            {
                name: "fileName",
                type: "list",
                message: "Choose file:",
                choices: list,
            },
        ])
        .then((answer) => {
            const filePath = path.join(directoryPath, answer.fileName);
            if (fs.lstatSync(filePath).isFile()) {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) throw err;
                    emitter.emit(`fileChosen`, data);
                });
                
            } else {
                emitter.emit(`pathChosen`, filePath);
            }
        })
        .catch((err) => console.log(err));
});
emitter.on(`fileChosen`, (fileData) => {

    let dataArr = fileData.split(`\n`);
    rl.resume();
    rl.question("Укажите IP-адреса (если их несколько, укажите через пробел): ", (adresses) => {
        emitter.emit(`ipChosen`, adresses, dataArr);
        
    });
});
emitter.on(`ipChosen`, (ipArr, dataArr) => {
    if (ipArr.includes(` `)) {
        ipArr = ipArr.split(` `);
    } else {
        ipArr = [ipArr];
    }

    for (let i = 0; i < dataArr.length; i++) {
        ipArr.forEach(element => {
            if (dataArr[i].includes(element)) {
                fs.writeFileSync(`./${element}_request.log`, dataArr[i] + `\n`, { encoding: "utf8", flag: "a+" })
            }
        });
    }

    console.log(`Логи отфильтрованы`);
    process.exit();
});

rl.question("Введите путь к директории содержащей файл: ", (inputedPath) => {
    let directoryPath = path.join(process.cwd(), inputedPath);
    rl.pause();
    emitter.emit(`pathChosen`, directoryPath);
    
});
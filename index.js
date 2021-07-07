//Задание 1
// console.log('Record 1');

// setTimeout(() => {
//   console.log('Record 2');
//   Promise.resolve().then(() => {
//     setTimeout(() => {
//     console.log('Record 3');
//     Promise.resolve().then(() => {
//       console.log('Record 4');
//       });       
//     });
//   });       
// });

// console.log('Record 5');

// Promise.resolve().then(() => Promise.resolve().then(() => console.log('Record 6')));

// 1-я строка сразу выведет в консоль 1. 
// 3 - я строка создаст таймер, который выполнится не в тот же момент, а на фазе timers.
// 15-я строка сразу выведет в консоль 5.
// 17-z строка создаст промис. Т.к. текущая фаза на этом закончилась, то наступает очередь выполнения микрозадач. В ней находятся только промисы из 17 строки. В консоль выведтся 6.
// Тик завершен. Фаза timers. Таймер из 2-й строки выводит в консоль 2. Конец фазы. Выполнение микрозадач создается таймер из 6-й строки. 
// Тик завершен. Фаза timers. Таймер из 6-й строки выводит в консоль 3. Конец фазы. Выполняется микрозадача из 8-й строки, в консоль выводится 4. 

// 1 5 6 2 3 4



const EventEmitter = require('events');
let emitter = new EventEmitter(),
    logText = '',
    timersFinished = [];

let arguments = process.argv.slice(2);

for (let i = 0; i < arguments.length; i++) {
    let arr = arguments[i].split('-');

    let year = arr[5],
        month = arr[4],
        day = arr[3],
        hour = arr[2],
        minute = arr[1],
        second = arr[0];
    
    let endTime = new Date(year, month-1, day, hour, minute, second),
        startTime = new Date(),
        diff = endTime.getTime() - startTime.getTime();
    
    emitter.on(`oneSecondPassed`,  () => {
        diff = diff - 1000;
        if (diff > 0) {
            logText += `До истечения времени таймера № ${i + 1} осталось: ${Math.floor((diff / 1000) % 60)} сек. ${Math.floor((diff / 1000 / 60) % 60)} мин. ${Math.floor((diff / (1000 * 60 * 60)) % 24)} ч. ${Math.floor(diff / (1000 * 60 * 60 * 24))} д.; `;
            timersFinished[i] = false;    
        } else {
            logText += `Время таймера № ${i + 1} истекло; `;
            timersFinished[i] = true;
        }
    })
}

let interval =
    setInterval(() => {
    emitter.emit(`oneSecondPassed`);
       
    if (timersFinished.includes(false)) {
        console.log(logText);
        logText = '';
    } else {
        console.log(`Время всех таймеров истекло`);
        clearInterval(interval);
    }

}, 1000);

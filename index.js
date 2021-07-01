const colors = require("colors/safe");

if (isNaN(process.argv[2]) || isNaN(process.argv[3])) {
    console.log(colors.yellow(`Не верно указаны границы диапазона!`));
} else {
    let startNumber = Number(process.argv[2]),
        endNumber = Number(process.argv[3]),
        indexOfColor = 0,
        count = 0;

    for (let i = startNumber; i <= endNumber; i++) {
        let flag = true;
        for (let j = 2; j < i; j++) {
            if (i % j == 0) {
                flag = false;
                continue
            }
        }
        if (flag == true) {
            count++;
            if (indexOfColor == 0) {
                console.log(colors.green(i));
                indexOfColor = 1;
            } else if (indexOfColor == 1) {
                console.log(colors.yellow(i));
                indexOfColor = 2;
            } else if (indexOfColor == 2) {
                console.log(colors.red(i));
                indexOfColor = 0;
            }
        }
    }

    if (count == 0) {
        console.log(colors.red(`В диапазоне нет простых чисел!`));
    }
}


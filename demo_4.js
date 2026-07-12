const fs = require('fs');

fs.readFile('./readme.md', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

process.nextTick(() => console.log("Next tick callback 1")); // nextTick queue[callback 1]
Promise.resolve().then(() => console.log("Promise 1"));  // microtask queue [promise 1]
for(let i = 0 ; i < 10000000000; i++) {} // block main thread ~ 5s
setTimeout(() => console.log("Timer 1"), 0);
setImmediate(() => console.log("Immediate 1")); // check immediate queue

for(let i = 0 ; i < 10000000000; i++) {}  // > 5s

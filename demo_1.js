Promise.resolve().then(() => console.log("Resolved promise 1"));
process.nextTick(() => console.log("Process.nextTick 1"));
setTimeout(() => {
    console.log("Timer 1 Done");
}, 0);
process.nextTick(() => console.log("Process.nextTick 2"));

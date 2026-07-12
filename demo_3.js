Promise.resolve().then(() => {
    console.log("Promise resolved");
    process.nextTick(() => console.log("Next tick 3"));
});
process.nextTick(() => console.log("Next tick 1"));
setTimeout(() => {
    console.log("Timer 1");
}, 1);
setTimeout(() => {
    console.log("Timer 2");
}, 0);
process.nextTick(() => console.log("Next tick 2"));
console.log("HELLO WORLD");
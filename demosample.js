const fs = require('fs');

fs.readFile('./readme.md', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

setTimeout(() => console.log("Timer 1"), 0);
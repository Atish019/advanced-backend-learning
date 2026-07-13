// const { readFile } = require('fs/promises');

// async function readGivenFile(pathToFile) {
//     const data = await readFile(pathToFile);
//     console.log(data.toString());
// }

// const pathToFile = __dirname + "/index.html";

// readGivenFile(pathToFile);


// // *********** === 2nd Way === **************
// import { readFile } from 'fs/promises';

// console.log(import.meta.url);
// console.log(process.cwd());

// // const pathToFile = "/Users/atish019/NodeJSAdv/File_IO_in_NodeJS/" + "/index.html";
// // const pathToFile = process.cwd() + "/index.html";  // way 1 absolute path
// const pathToFile = new URL('./index.html', import.meta.url).pathname; // way 2 getting relative path

// console.log("Path to file", pathToFile);

// const data = await readFile(pathToFile);

// console.log(data.toString());


// *********** === 3nd Way === **************
import { readFile, writeFile } from 'fs/promises';

console.log(import.meta.url);
console.log(process.cwd());

const pathToFile = new URL('./index.html', import.meta.url).pathname; 

console.log("Path to file", pathToFile);

const data = await readFile(pathToFile);

let template = data.toString();

const obj = {
    name: "Atish Sharma",
    message: "Hello World",
}

for ( const [key, value] of Object.entries(obj)) {
    template = template.replace(`{{${key}}}`, value);  // {{name}} -> Atish, {{message}} -> Hello World.
}

await writeFile(new URL('./output.html', import.meta.url).pathname, template);

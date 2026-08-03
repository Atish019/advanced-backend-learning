/* Types in TypeScript

    Below are all primitive types in TS

    string -> store text
    number -> integers, real
    boolean
    undefined
    null
    bigint
    symbol

    var <variable_name> : number = <value>;  // type annotation or type signature

*/

let id : number = 5;
// TS understands firstName will store strings
let firstName = "Atish";
// FirstName = 12 ; TSC throws error
var lastName : string = "Sharma";
// LastName = 13; TSC throws error
console.log(id, firstName, lastName);

// Union of types
let userId : number | string = 24;
userId = 10;

let x : any = 10;
x = "Atish";
x = false;
console.log(x);

/**
 * 
 * Arrays
 * 
 * let <variable_name> : type[] = [val1, val2, ....];
 * 
 */

let ids : number[] = [1,2,3,4,5];
let hetero : any[] = [1,2,false,"123",null]
let data : (number | string | boolean)[] = [1, "Atish", true];

console.log(ids, hetero, data)

// Arrays in form of typed tuple
let data1 : (number | string | boolean)[] = [1, "Atish", true];

/**
 * 
 * How to define types for objects
 *  - classes -> data members, members functions
 *  - interface -> its a contract
 */

class Car {
    name : string
    constructor(name : string) {
        this.name = name;
    }
    display() {
        console.log(this.name);
    }
};

interface Product {
    name : string;
    price : Number;
    brand : string

    display() : void;
};

// let p1 : Product = {
//     name : "Iphone",
//     price : 100000,
//     brand : "apple"
// };

// let c1 : Car = {
//     name: "Santro",
//     price: 10000000,
//     brand: "Hyundai"
// }

// let p1 = new Product();
// let c1 = new Car("Santro");

let p1 : Product = {
    name : "Iphone",
    price : 100000,
    brand : "apple",
    display: () => {
        console.log("display");
    }
};
console.log(p1);


function sum(a : number, b : number) : number {
    return a + b;
}
console.log(sum(10, 20))

function sum(a : number, b? : number) : number {
    return a + (b || 0);
}
console.log(sum(10))

// Date Object in TS 
const dob = new Date(2009, 5, 20);
console.log(dob);
console.log(dob.getDate());
// console.log(dob.addDays(2))

/**
 * Any type -> your free ticket to get rid of TS type checking 
 * 
 * if you want to define a variable with type any, then either mention ": any" while declaring the variable
 * or do not assign a value while declaring a variable
 * 
 *  // execute 
 */

let x;  // this variable x is of type any
console.log(x);
x = "10";
x = 10;

// function fun() : (number | string) {
//     return 10;
// }

function fun() : void {


}
console.log(fun());

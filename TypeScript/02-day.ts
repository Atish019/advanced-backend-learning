


// TYPE vs Interface 
type text = string;

// For defining custom types for arrays, type keyword is more easy
type stringArray = string[];
// Using an interface we will define an object which will be always having keys 
// of type number and value to be of the type of the array
interface numberArray {
    [index: number]: number
}

// Let's say we want to define a pair or a triplet or a custom tuple (set of x values)
type pair = [number, number];
type triplet = [number, number, number];

interface pairInterface {
    first: number,
    second: number
}

// Can type and interfaces represent functions ?

type logger = (msg: string, errorCode: number) => void;

interface loggerInterface {
    (msg: string, errorCode: number): void;
}

// Defining unions is possible with type but not interfaces

type unionOfstrandnum = number | string;

interface ComplexNumber {
    real: number,
    imaginary: number
}

interface ComplexNumber {
    add: (num: ComplexNumber) => ComplexNumber
}

/**
 * 
 * interface ComplexNumber {
    real: number,
    imaginary: number
    add: (num: ComplexNumber) => ComplexNumber
}
 */


/**
 * ComplexNumber
 *  - what will be the data members ? 
 *  - write two member functions 
 *      - add two complex numbers
 *      - multiply two complex numbers
 */

class Complex {
    private real: number;
    private imag: number;
    constructor(real:number, imag: number) {
        this.real = real;
        this.imag = imag;
    }

    display() : void {
        console.log(`${this.real} ÷ i${this.imag}`);
    }

    add(C: Complex) : void {
        this.real += C.real;
        this.imag += C.imag;
    }

    multiply(C: Complex) : void {
        this.real = (this.real*C.real - this.imag*C.imag);
        this.imag = (this.real*C.imag + this.imag*C.real);
    }
}

let c1: Complex = new Complex(2, 3);
let c2: Complex = new Complex(1, 3);
c1.display();
c2.display();
c1.multiply(c2);
c1.display();
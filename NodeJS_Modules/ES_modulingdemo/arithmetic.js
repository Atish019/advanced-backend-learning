export function add(x, y){
    return x + y;
}

export function subtract(x, y) {
    return x -y;
}

export function multiply(x, y) {
    return x * y;
}

export default {
    add,
    subtract,
    multiply
}

function divide(x, y) { //this function is not accessible to out world
    return x / y;
}

/**
 * ENUNS or Enumeration
 * const INITIALISED = "initialised"
 * Ticket ["initialised", "Cancelled", "resoled", "pending"]
 * 
 * ti.status == "resolved"
 * 
 */
// Number
enum TicketStatus {
    INITIALISED,
    CANCELLED,
    PENDING,
    CLOSED
}
// String
enum TicketStatus1 {
    INITIALISED = "initialised",
    CANCELLED = "cancelled",
    PENDING = "pending",
    CLOSED = "closed"
}

const Ticket = {
    id: 1,
    title: "new ticket",
    status: TicketStatus.INITIALISED
}

if(Ticket.status == TicketStatus.INITIALISED) {
    console.log("Done")
}

console.log(Ticket);
console.log(TicketStatus.INITIALISED);
console.log(TicketStatus.CANCELLED);

enum StatusCodes {
    NotFound = 400,
    Success = 200,
    Accepted = 202,
    Create = 201,
    BadRequest = 400
}

const response = {
    url: "www.something.com",
    type: "GET",
    data: "some string",
    status: StatusCodes.Success
}
console.log(response);


//OBJECT TYPES
const result = {
    name: "Atish",
    marks: 98
}
/*
The type of the above raw object is inferred as {name: string, marks: number}
something like the given object below 
const result : {name: string,  marks: number, address?: string}= {
    name: "Atish",
    marks: 98
}
*/

console.log(result);
// updating an old key value pair
result.marks = 99; // do you think TS will allow this ?
// adding a new key value pair 
// result.address = "XYZ";  //do you think TS will allow this?
/**
 * Now the above statement will throw a compiler error because in the the type {name: string, marks: number}
 * We never mentioned anything about any address.
 * That's why TS thinks we are violating the default type 
 * To solve this, we can add an additional optional address property while defining the object
 * const result : {name: string,  marks: number, address?: string}= {
    name: "Atish",
    marks: 98
}
 */


// Creating_alias
type Details = {name: string, marks: number, address? : string};
// Details is kind of like an alias or a nickname to {name: string, marks: number, address? : string}

const result1 : Details = {
    name: "Atish",
    marks: 98
}


const result2 : Details = {
    name: "Atish",
    marks: 95
}


/** 
 * // Interfcae_Example
 * We want to define a common type for authentication forms
 * this common type will take multiple parameters
 *  - name of the form
 *  - how to handle submission of the form
 *  - how to handle reset of the form
 *  - what should be the text of the submitting button
 */

interface AuthForm {
    name: string,
    submitButtonText: string,
    onReset: (e : any) => void,
    onSubmit: (e : any) => void
}

const loginForm: AuthForm = {
    name: "Login form",
    submitButtonText: "Login",
    onReset: (e) => {
        // some impl
    },
    onSubmit: (e) => {
        // some impl
    }
}
console.log(loginForm)


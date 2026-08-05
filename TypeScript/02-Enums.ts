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

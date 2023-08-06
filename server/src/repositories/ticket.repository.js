import TicketDao from "../dao/ticket.dao.js";

class TicketRepository {

    getTickets = async () => {
        try {
            const tickets = await TicketDao.getAllTickets();
            return tickets;
        } catch (error) {
            console.log(`Error en getTickets: ${error.message}`);
        }
    }

    getTicketById = async (ticketId) => {
        try {
            const ticket = await TicketDao.getTicketById(ticketId);
            return ticket;
        } catch (error) {
            console.log(`Error en getTicketById: ${error.message}`);
        }
    }

    createTicket = async (ticket) => {
        try {
            const newTicket = await TicketDao.createTicket(ticket);
            return newTicket;
        } catch (error) {
            console.log(`Error en createTicket: ${error.message}`);
        }
    }

    updateTicket = async (ticketId, ticket) => {
        try {
            const updatedTicket = await TicketDao.updateTicket(ticketId, ticket);
            return updatedTicket;
        } catch (error) {
            console.log(`Error en updateTicket: ${error.message}`);
        }
    }
}

const ticketRepository = new TicketRepository();

export default ticketRepository;
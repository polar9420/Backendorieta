import TicketModel from '../models/Ticket.js';

class TicketDao {

    getAllTickets = async () => {
        try {
            const tickets = await TicketModel.find();
            return tickets;
        } catch (error) {
            console.log(`Error en getAllTickets: ${error.message}`);
        }
    }

    getTicketById = async (ticketId) => {
        try {
            const ticket = await TicketModel.findById(ticketId);
            return ticket;
        } catch (error) {
            console.log(`Error en getTicketById: ${error.message}`);
        }
    }

    createTicket = async (ticket) => {
        try {
            const newTicket = await TicketModel.create(ticket);
            return newTicket;
        } catch (error) {
            console.log(`Error en createTicket: ${error.message}`);
        }
    }

    updateTicket = async (ticketId, ticket) => {
        try {
            const updatedTicket = await TicketModel.findByIdAndUpdate(
                ticketId,
                ticket,
                { new: true }
            );
            return updatedTicket;
        }
        catch (error) {
            console.log(`Error en updateTicket: ${error.message}`);
        }
    }
}

const ticketDao = new TicketDao();

export default ticketDao;
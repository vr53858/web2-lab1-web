import { query } from '../db/data';
import { Ticket } from '../types/Ticket';

export const getAllTickets = async (): Promise<Ticket[]> => {
  const result = await query('SELECT * FROM tickets');
  return result.rows;
};

export const getTicketById = async (id: string): Promise<Ticket | null> => {
  const result = await query('SELECT * FROM tickets WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createTicket = async (ticket: Ticket): Promise<Ticket> => {
  const result = await query(
    'INSERT INTO tickets (vatin, first_name, last_name, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [ticket.vatin, ticket.firstName, ticket.lastName, new Date()]
  );
  return result.rows[0];
};
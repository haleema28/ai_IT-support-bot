import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

// Employee: create new ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    // find it_support user with least open assigned tickets
    const itSupportUsers = await User.find({ role: "it_support" }).select("_id");
    let assignedToUserId = undefined;
    if (itSupportUsers.length > 0) {
      const counts = await Promise.all(
        itSupportUsers.map(async (u) => ({
          userId: u._id,
          count: await Ticket.countDocuments({ assignedTo: u._id, status: { $in: ["open", "in_progress"] } })
        }))
      );
      counts.sort((a, b) => a.count - b.count);
      assignedToUserId = counts[0]?.userId;
    }

    const ticket = await Ticket.create({
      title,
      description,
      createdBy: req.user._id,
      assignedTo: assignedToUserId,
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tickets for current user
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// IT Support: get all assigned tickets
export const getAssignedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user._id });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// IT/Admin: update ticket status or assign
export const updateTicket = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo },
      { new: true }
    );
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

dotenv.config();

async function main() {
  try {
    await connectDB();

    const passwordHash = await bcrypt.hash("password123", 10);

    // Upsert users
    const [emp1, it1, it2] = await Promise.all([
      User.findOneAndUpdate(
        { email: "employee1@example.com" },
        { name: "Employee One", email: "employee1@example.com", password: passwordHash, role: "employee" },
        { new: true, upsert: true }
      ),
      User.findOneAndUpdate(
        { email: "it1@example.com" },
        { name: "IT Support A", email: "it1@example.com", password: passwordHash, role: "it_support" },
        { new: true, upsert: true }
      ),
      User.findOneAndUpdate(
        { email: "it2@example.com" },
        { name: "IT Support B", email: "it2@example.com", password: passwordHash, role: "it_support" },
        { new: true, upsert: true }
      ),
    ]);

    // Clean existing demo tickets for this employee
    await Ticket.deleteMany({ createdBy: emp1._id });

    // Create demo tickets and spread across it_support users
    const ticketsData = [
      { title: "Laptop running slow", description: "My laptop is extremely slow after update.", assignedTo: it1._id },
      { title: "VPN connection issue", description: "Unable to connect to VPN from home network.", assignedTo: it2._id },
      { title: "Printer not responding", description: "Office printer near desk 12 doesn't respond.", assignedTo: it1._id },
      { title: "Email sync problem", description: "Outlook not syncing new emails.", assignedTo: it2._id },
    ];

    await Ticket.insertMany(
      ticketsData.map((t) => ({ ...t, createdBy: emp1._id, status: "open" }))
    );

    console.log("✅ Seed complete:\n- employee1@example.com / password123\n- it1@example.com / password123\n- it2@example.com / password123");
  } catch (e) {
    console.error("Seed error:", e);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

main();



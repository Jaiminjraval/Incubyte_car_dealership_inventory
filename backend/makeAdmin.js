import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

// Load environment variables
dotenv.config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email "${email}" not found.`);
      
      const allUsers = await User.find({}).select('email');
      if (allUsers.length > 0) {
        console.log("\nHere are the emails of users currently registered in your database:");
        allUsers.forEach(u => console.log(` - ${u.email}`));
        console.log("\nPlease try running the command again with one of the emails listed above.");
      } else {
        console.log("\nYour database currently has 0 registered users. Please open the React app in your browser and register an account first.");
      }
      
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`Success! User ${email} has been promoted to Admin.`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating user:", error);
    process.exit(1);
  }
};

// Get email from command line arguments
const emailArg = process.argv[2];

if (!emailArg) {
  console.log("Please provide an email address.");
  console.log("Usage: node makeAdmin.js <user_email>");
  process.exit(1);
}

makeAdmin(emailArg);

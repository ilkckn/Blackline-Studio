import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.js";

dotenv.config();

const seedAdmin = async () => {
  const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const existingUser = await User.findOne({ email: ADMIN_EMAIL });

  if (existingUser) {
    existingUser.role = ["admin"];
    existingUser.isActive = true;
    await existingUser.save();
    console.log("Existing user was promoted to admin:", ADMIN_EMAIL);
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
      name: "Admin",
      userName: "admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: ["admin"],
    });
    console.log("Admin created:", ADMIN_EMAIL);
  }

  await mongoose.disconnect();
};

seedAdmin().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
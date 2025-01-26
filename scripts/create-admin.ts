import { db } from "@db";
import { users } from "@db/schema";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const username = "admin";
  const password = "admin123"; // This is just for testing, change in production
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    await db.insert(users).values({
      username,
      password: hashedPassword,
      isAdmin: true,
    });
    
    console.log("Admin user created successfully");
    console.log("Username:", username);
    console.log("Password:", password);
  } catch (err) {
    console.error("Error creating admin user:", err);
  }
  
  process.exit();
}

createAdmin();

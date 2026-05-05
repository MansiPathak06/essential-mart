import { NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Database Connection setup
const pool = new Pool({
  host:     process.env.DB_HOST     || "localhost",
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),  // ← THE fix
  ssl:      false,
});
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET || "change_this_secret",
  { expiresIn: "7d" }
);

export async function POST(request) {
  try {
    // 1. Frontend se data nikalna
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email aur Password dono zaruri hain" },
        { status: 400 }
      );
    }

    // 2. Database mein User search karna
    // Dhyaan rakhein: Table ka naam 'users' hi hona chahiye
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    // Agar user nahi mila
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Account nahi mila. Please signup karein." },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    // 3. Password verify karna 
   const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return NextResponse.json({ error: "Galat password!" }, { status: 401 });
}

    // 4. Success Response
    return NextResponse.json({
      message: "Login successful!",
      user: {
        id: user.id,
        email: user.email,
        role: user.role || 'user'
      },
      
    }, { status: 200 });

  } catch (error) {
    // Terminal mein asli error dekhne ke liye
    console.error("Login Route Error:", error);
    
    return NextResponse.json(
      { error: "Server Error: " + error.message },
      { status: 500 }
    );
  }
}
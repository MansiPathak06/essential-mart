import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Check karein user pehle se toh nahi hai
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Naya user insert karein (Role default 'user' rahega)
    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
      [email, password, 'user']
    );

    return NextResponse.json({ message: "Account created successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}
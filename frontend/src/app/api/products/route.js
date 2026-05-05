import { NextResponse } from "next/server";
import { Pool } from "pg";

// -------------------------------------------------------------------------
// 1. DATABASE CONNECTION
// -------------------------------------------------------------------------
const pool = new Pool({
  host:     process.env.DB_HOST     || "localhost",
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  ssl:      false,   // ← local PostgreSQL doesn't use SSL
});

// -------------------------------------------------------------------------
// 2. GET METHOD: Products fetch karne aur Filter karne ke liye
// -------------------------------------------------------------------------
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    let query = "SELECT * FROM products WHERE 1=1";
    let values = [];

    // Category Filter (e.g., 'women')
    if (category && category !== "all" && category !== "undefined") {
      values.push(category.toLowerCase().trim());
      query += ` AND LOWER(category) = $${values.length}`;
    }

    // STRICT Subcategory Filter (e.g., 'dresses')
    // Isse Dresses tab mein sirf Dresses dikhengi, Saree nahi.
    if (subcategory && subcategory !== "null" && subcategory !== "undefined" && subcategory !== "") {
      values.push(subcategory.toLowerCase().trim());
      query += ` AND LOWER(sub_category) = $${values.length}`;
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, values);
    
    // JSON response return karein
    return NextResponse.json(result.rows, { 
        status: 200,
        headers: { 'Cache-Control': 'no-store' } 
    });

  } catch (error) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json({ error: "Products fetch nahi ho paye" }, { status: 500 });
  }
}

// -------------------------------------------------------------------------
// 3. POST METHOD: Admin Dashboard se Product add karne ke liye
// -------------------------------------------------------------------------
export async function POST(request) {
  try {
    const body = await request.json();
    
    /**
     * Frontend (AdminDashboard) se aane wala saara data:
     * Naming conventions ko aapke "form" state ke according rakha gaya hai.
     */
    const { 
      name, 
      category, 
      subcategory, 
      originalPrice, 
      discountedPrice, 
      inStock, 
      shortDescription, 
      fullDescription, // Aapka missing field yahan hai
      images, 
      reviewerName, 
      rating, 
      reviewText 
    } = body;

    // Validation: Name aur Category zaroori hain
    if (!name || !category) {
      return NextResponse.json({ error: "Name and Category are required!" }, { status: 400 });
    }

    /**
     * SQL INSERT Query:
     * Humne saare columns include kiye hain takki NULL values na aayein.
     */
    const query = `
      INSERT INTO products (
        name, 
        category, 
        sub_category, 
        price, -- purana column name agar change nahi kiya
        original_price, 
        discounted_price, 
        in_stock, 
        short_description, 
        full_description, 
        image_url, 
        images,
        reviewer_name, 
        reviewer_rating, 
        reviewer_review,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
      RETURNING *`;
    
    // Values array mapping frontend variables to DB columns
    const values = [
      name,
      category.toLowerCase(),
      subcategory ? subcategory.toLowerCase() : null,
      parseFloat(discountedPrice) || 0, // 'price' column ke liye
      parseFloat(originalPrice) || 0,
      parseFloat(discountedPrice) || 0,
      inStock ?? true,
      shortDescription || '',
      fullDescription || '', // Ab pgAdmin mein data null nahi aayega
      images && images.length > 0 ? images[0] : '', // Pehli image as main image
      JSON.stringify(images || []), // Saari images ka JSON array
      reviewerName || '',
      parseInt(rating) || 0,
      reviewText || ''
    ];
    
    const result = await pool.query(query, values);

    return NextResponse.json({ 
      message: "Success! Product saved to Database.", 
      product: result.rows[0] 
    }, { status: 201 });

  } catch (error) {
    console.error("Insert Error Detailed:", error);
    return NextResponse.json({ 
      error: "Data save karne mein galti hui", 
      details: error.message 
    }, { status: 500 });
  }
}

// -------------------------------------------------------------------------
// 4. DELETE METHOD: Manage Product tab se delete karne ke liye
// -------------------------------------------------------------------------
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID missing" }, { status: 400 });
    }

    const deleteQuery = "DELETE FROM products WHERE id = $1";
    await pool.query(deleteQuery, [id]);

    return NextResponse.json({ message: "Product deleted successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Product delete nahi ho paya" }, { status: 500 });
  }
}

// -------------------------------------------------------------------------
// 5. PUT METHOD (OPTIONAL): Product update karne ke liye
// -------------------------------------------------------------------------
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, name, originalPrice, discountedPrice, inStock } = body;

        const updateQuery = `
            UPDATE products 
            SET name = $1, original_price = $2, discounted_price = $3, in_stock = $4 
            WHERE id = $5 
            RETURNING *`;
        
        const result = await pool.query(updateQuery, [name, originalPrice, discountedPrice, inStock, id]);
        
        return NextResponse.json({ message: "Updated!", product: result.rows[0] });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
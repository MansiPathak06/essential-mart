"use client";

import { useState, useEffect } from 'react';

// -------------------------------------------------------------------------
// CONSTANTS & CONFIG
// -------------------------------------------------------------------------
const CATEGORIES = [
   'Men', 'Women', 'Kids', 
];
const SUB_CATEGORIES = {
  Men: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Hoodies', 'Jackets','Ethnic','Track-Pants'],
  Women: ['Sarees', 'Suits', 'Ethnic Sets', 'Dresses', 'Kurtas', 'Tops', 'Co-ord Sets'],
  Kids: ['Tops','Bottoms','Ethnic','Party','T-Shirts', 'shoes'],
  
};
// -------------------------------------------------------------------------
// STYLES OBJECTS
// -------------------------------------------------------------------------
const inputStyle = {
  width: '100%', padding: '12px 14px', border: '1px solid #E2D1B9',
  borderRadius: 12, fontSize: 14, background: '#FFFFFF',
  outline: 'none', boxSizing: 'border-box',
  color: '#333', transition: 'all 0.2s'
};

const labelStyle = { 
  fontSize: 12, fontWeight: 700, color: '#5C3A1E', 
  marginBottom: 6, display: 'block', textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const sectionCard = {
  background: 'white', borderRadius: 20, padding: '24px',
  border: '1px solid #F0E8D0', marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
};

const actionBtn = (color) => ({
    padding: '8px 16px', borderRadius: '8px', border: 'none',
    cursor: 'pointer', fontWeight: '600', fontSize: '12px',
    background: color === 'red' ? '#FEE2E2' : '#E0E7FF',
    color: color === 'red' ? '#B91C1C' : '#4338CA',
    transition: '0.2s'
});

// -------------------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------------------
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('add'); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    name: '', 
    category: '', 
    subcategory: '', 
    originalPrice: '', 
    discountedPrice: '',
    inStock: true, 
    shortDescription: '', 
    fullDescription: '',
    images: ['', '', '', ''],
    reviewerName: '', 
    rating: '', 
    reviewText: '',
  });

  // -------------------------------------------------------------------------
  // FETCH & DATA SYNC
  // -------------------------------------------------------------------------
 const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => {
    if (activeTab === 'manage') fetchProducts();
    if (activeTab === 'orders') {
      fetch('http://localhost:5000/api/orders')
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(err => console.log("Orders fetch error:", err));
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm(prev => ({ ...prev, images: newImages }));
  };

  const handleFileUpload = async (index, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) handleImageChange(index, data.url);
    } catch (err) { console.error("Upload failed", err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        alert("Product removed.");
      }
    } catch (error) { alert("Delete failed."); }
  };

  // -------------------------------------------------------------------------
  // FIXED SUBMIT HANDLER
  // -------------------------------------------------------------------------
  const handleSubmit = async () => {
    if (!form.name || !form.category) {
      alert("Please fill Name and Category");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        category: form.category.toLowerCase(),
        subcategory: form.subcategory || null,
        images: form.images.filter(img => img !== ''),
        reviews: form.reviewerName ? [{
          reviewerName: form.reviewerName,
          rating: form.rating,
          text: form.reviewText,
        }] : [],
      };

      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess('✅ Product saved successfully!');
        setForm({
          name: '', category: '', subcategory: '', originalPrice: '', discountedPrice: '',
          inStock: true, shortDescription: '', fullDescription: '',
          images: ['', '', '', ''], reviewerName: '', rating: '', reviewText: ''
        });
        setTimeout(() => setSuccess(''), 4000);
      } else {
        const errData = await res.json();
        alert("Error: " + errData.error);
      }
    } catch (err) {
      alert("Connection failed! Check backend terminal.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // UI HELPERS
  // -------------------------------------------------------------------------
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTabStyle = (tabName) => ({
    padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
    fontWeight: '700', fontSize: '14px', transition: 'all 0.3s',
    background: activeTab === tabName ? '#3D1F0D' : 'transparent',
    color: activeTab === tabName ? 'white' : '#5C3A1E',
  });

  return (
    <div style={{ maxWidth: '1260px', margin: '0 auto', padding: '20px', background: '#FAF8F5', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. TOP HEADER */}
      <div style={{ background: '#3D1F0D', color: 'white', padding: '28px 32px', borderRadius: 24, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(61,31,13,0.15)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>Admin Dashboard</h1>
          <p style={{ margin: 0, opacity: 0.7, fontSize: 13, marginTop: 4 }}>Essential Mart | Database: pgAdmin (Connected)</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 12, fontSize: 12 }}>
            System Time: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: '10px', background: '#F0E8D0', padding: '8px', borderRadius: '18px', marginBottom: 24 }}>
        <button onClick={() => setActiveTab('add')} style={getTabStyle('add')}>➕ Add Product</button>
        <button onClick={() => setActiveTab('manage')} style={getTabStyle('manage')}>🛠️ Manage Inventory</button>
        <button onClick={() => setActiveTab('orders')} style={getTabStyle('orders')}>📦 Orders & Logs</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        
        {/* --- MAIN CONTENT AREA --- */}
        <div className="main-content">
          
          {/* TAB 1: ADD PRODUCT FORM */}
          {activeTab === 'add' && (
            <>
              <div style={sectionCard}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#3D1F0D', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{background: '#3D1F0D', color: 'white', width: 24, height: 24, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 12}}>1</span>
                    Basic Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Product Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Silk Banarasi Saree" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Main Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {form.category  && (
                  <div style={{ marginBottom: 20, animation: 'fadeIn 0.3s ease' }}>
                    <label style={labelStyle}>Store Sub-Category *</label>
                    <select name="subcategory" value={form.subcategory} onChange={handleChange} style={{...inputStyle, border: '2px solid #3D1F0D'}}>
                      <option value="">Select Sub-Category</option>
                      {SUB_CATEGORIES[form.category]?.map(s => (
  <option key={s} value={s}>{s}</option>
))}
                    </select>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Original Price (₹)</label>
                    <input name="originalPrice" value={form.originalPrice} onChange={handleChange} placeholder="MRP" type="number" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Discounted Price (₹)</label>
                    <input name="discountedPrice" value={form.discountedPrice} onChange={handleChange} placeholder="Selling Price" type="number" style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 30, marginBottom: 20 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, color: '#3D1F0D', cursor: 'pointer' }}>
                      <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} style={{ width: 18, height: 18 }} /> In Stock
                    </label>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Short Tagline</label>
                  <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief one-liner for search cards..." style={inputStyle} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Full Product Details</label>
                  <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} rows={5} placeholder="Fabric details, size charts, care instructions..." style={{ ...inputStyle, resize: 'none' }} />
                </div>
              </div>

              <div style={sectionCard}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#3D1F0D', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{background: '#3D1F0D', color: 'white', width: 24, height: 24, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 12}}>2</span>
                    Visual Assets & Gallery
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {form.images.map((img, i) => (
                    <div key={i} style={{background: '#F9F9F9', padding: 10, borderRadius: 12, border: '1px solid #EEE'}}>
                      <input type="file" accept="image/*" id={`img-${i}`} style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) handleFileUpload(i, e.target.files[0]); }} />
                      <label htmlFor={`img-${i}`} style={{ display: 'block', padding: '10px', background: '#3D1F0D', color: 'white', borderRadius: 10, fontSize: 11, cursor: 'pointer', textAlign: 'center', fontWeight: 700, marginBottom: 8 }}>Upload {i+1}</label>
                      <input value={img} onChange={e => handleImageChange(i, e.target.value)} placeholder="Paste URL" style={{ ...inputStyle, fontSize: 11, padding: '8px' }} />
                      {img && <img src={img} style={{width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, marginTop: 8}} alt="Preview" />}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...sectionCard, background: '#FAF7F2', border: '1px dashed #D4C4A8' }}>
                <h3 style={{ ...labelStyle, color: '#C4872A' }}>⭐ Pre-filled Review (Optional)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
                  <input name="reviewerName" value={form.reviewerName} onChange={handleChange} placeholder="Reviewer Name" style={inputStyle} />
                  <input name="rating" value={form.rating} onChange={handleChange} type="number" min="1" max="5" placeholder="Rating (1-5)" style={inputStyle} />
                </div>
                <textarea name="reviewText" value={form.reviewText} onChange={handleChange} rows={2} placeholder="Write a dummy review to boost trust..." style={{ ...inputStyle, resize: 'none' }} />
              </div>

              {success && <div style={{ background: '#D4EDDA', color: '#155724', padding: '16px', borderRadius: 12, marginBottom: 16, textAlign: 'center', fontWeight: 600 }}>{success}</div>}

              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '20px', background: '#3D1F0D', color: 'white', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(61,31,13,0.2)', transform: loading ? 'scale(0.98)' : 'scale(1)', transition: '0.2s' }}>
                {loading ? 'Pushing to Database...' : '🚀 SAVE PRODUCT TO PGADMIN'}
              </button>
            </>
          )}

          {/* TAB 2: MANAGE PRODUCTS */}
          {activeTab === 'manage' && (
            <div style={sectionCard}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                <h2 style={{ color: '#3D1F0D', margin: 0 }}>Inventory List</h2>
                <input 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{...inputStyle, width: 250, padding: '8px 12px'}}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredProducts.length > 0 ? filteredProducts.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', border: '1px solid #F0E8D4', borderRadius: 16, background: '#FFF' }}>
                    <div style={{display: 'flex', gap: 15, alignItems: 'center'}}>
                        <img src={p.image_url || p.images?.[0]} style={{width: 50, height: 50, borderRadius: 8, background: '#F5F5F5', objectFit: 'cover'}} />
                        <div>
                            <div style={{fontWeight: 700, color: '#3D1F0D'}}>{p.name}</div>
                            <div style={{fontSize: 12, color: '#888'}}>
                                {p.category.toUpperCase()} • {p.sub_category || 'General'} • ₹{p.discounted_price}
                            </div>
                        </div>
                    </div>
                    <div style={{display: 'flex', gap: 10}}>
                        <button style={actionBtn('blue')}>Edit</button>
                        <button onClick={() => handleDelete(p.id)} style={actionBtn('red')}>Delete</button>
                    </div>
                  </div>
                )) : <div style={{textAlign: 'center', padding: 40, color: '#999'}}>No products found. Start by adding one!</div>}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div style={sectionCard}>
              <h2 style={{ color: '#3D1F0D', marginBottom: 20 }}>Live Orders</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: '#FAF8F5', borderBottom: '2px solid #F0E8D0' }}>
                            <th style={{ padding: '15px 10px', fontSize: 13 }}>ID</th>
                            <th style={{ padding: '15px 10px', fontSize: 13 }}>Customer</th>
                            <th style={{ padding: '15px 10px', fontSize: 13 }}>Items</th>
                            <th style={{ padding: '15px 10px', fontSize: 13 }}>Total</th>
                            <th style={{ padding: '15px 10px', fontSize: 13 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map(o => (
                        <tr key={o.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                            <td style={{ padding: '15px 10px', fontWeight: 600 }}>#{o.id}</td>
                            <td style={{ padding: '15px 10px' }}>{o.user_name || 'Guest'}</td>
                            <td style={{ padding: '15px 10px' }}>{o.items_count || 1} Products</td>
                            <td style={{ padding: '15px 10px', fontWeight: 700 }}>₹{o.total_amount}</td>
                            <td style={{ padding: '15px 10px' }}>
                                <span style={{background: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700}}>Paid</span>
                            </td>
                        </tr>
                        )) : (
                            <tr><td colSpan="5" style={{padding: 40, textAlign: 'center', color: '#999'}}>Waiting for your first sale... 📈</td></tr>
                        )}
                    </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- SIDEBAR AREA --- */}
        <div className="sidebar">
          {/* BULK IMPORT */}
          <div style={sectionCard}>
            <h3 style={labelStyle}>📤 Bulk Import (CSV/Excel)</h3>
            <div style={{ border: '2px dashed #E2D1B9', padding: '24px 15px', borderRadius: 16, textAlign: 'center', background: '#FCFAF8', transition: '0.3s' }}>
              <div style={{fontSize: 24, marginBottom: 10}}>📄</div>
              <label htmlFor="bulk-import" style={{ cursor: 'pointer', fontSize: 13, color: '#8B6914', fontWeight: 700 }}>Choose Excel File</label>
              <p style={{fontSize: 10, color: '#AAA', marginTop: 5}}>Only .xlsx or .csv supported</p>
              <input type="file" id="bulk-import" style={{ display: 'none' }} />
            </div>
          </div>

          {/* STATS PANEL */}
          <QuickStatsPanel />

          {/* SYSTEM STATUS */}
          <div style={{...sectionCard, background: '#F3F4F6', border: 'none', padding: 15, marginTop: 20}}>
            <div style={{fontSize: 11, fontWeight: 700, color: '#6B7280', marginBottom: 10}}>SERVER STATUS</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#059669'}}>
                <div style={{width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981'}}></div>
                Backend: Running on Port 5000
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// COMPONENT: QUICK STATS
// -------------------------------------------------------------------------
function QuickStatsPanel() {
  const [stats, setStats] = useState({ total: 0, categories: 0, active: 0 });
  
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
            setStats({ 
              total: data.length, 
              categories: new Set(data.map(p => p.category)).size, 
              active: data.filter(p => p.in_stock !== false).length 
            });
        }
      }).catch(() => {});
  }, []);

  const statRow = (label, val, icon) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #5C3A1E' }}>
        <span style={{opacity: 0.8, fontSize: 13}}>{icon} {label}</span> 
        <span style={{fontWeight: 800, fontSize: 15}}>{val}</span>
    </div>
  );

  return (
    <div style={{ background: '#3D1F0D', borderRadius: 24, padding: '26px', color: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#C4A882', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 }}>Inventory Health</h3>
      {statRow("Total Products", stats.total, "📦")}
      {statRow("Active Categories", stats.categories, "📂")}
      {statRow("In Stock Items", stats.active, "✅")}
      
      <div style={{marginTop: 20, background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12, fontSize: 11, textAlign: 'center'}}>
        Syncing with <strong>essential_mart</strong> DB
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';

const CATEGORIES = [
  'Kitchenware', 'Furniture', 'Decoratives', 'Garden Accessories',
  'Lamp Stand and Holders', 'Men', 'Women', 'Kids', 'Accessories'
];

// --- NEW: Sub-category Slugs for Women (Matches your store icons) ---
const WOMEN_SUBCATEGORIES = [
  { name: 'SAREES', slug: 'sarees' },
  { name: 'ETHNIC SETS', slug: 'ethnic-sets' },
  { name: 'DRESSES', slug: 'dresses' },
  { name: 'KURTAS', slug: 'kurtas' },
  { name: 'TOPS', slug: 'tops' },
  { name: 'CO-ORD SETS', slug: 'co-ord-sets' },
  { name: 'BOTTOMS', slug: 'bottoms' },
  { name: 'SUITS', slug: 'suits' },
  { name: 'LINGERIE', slug: 'lingerie' },
  { name: 'FOOTWEAR', slug: 'footwear' },
  { name: 'ACCESSORIES', slug: 'accessories' },
  { name: 'BAGS', slug: 'bags' },
  { name: 'BEAUTY', slug: 'beauty' },
];

// Styles (Exactly same as yours)
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('add'); 
  const [form, setForm] = useState({
    name: '', 
    category: '', 
    subCategory: '', // Added for filtering logic
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
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (activeTab === 'manage') {
      fetch('http://localhost:5000/api/products')
        .then(res => res.json())
        .then(data => setProducts(Array.isArray(data) ? data : []))
        .catch(err => console.log("Fetch error:", err));
    }
    if (activeTab === 'orders') {
      fetch('http://localhost:5000/api/orders')
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(err => console.log("Fetch error:", err));
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Reset subCategory if category changes
    if (name === 'category') {
        setForm(prev => ({ ...prev, category: value, subCategory: '' }));
    } else {
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
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
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category) {
        alert("Please fill Name and Category");
        return;
    }
    // Added sub-category check for Women
    if (form.category === 'Women' && !form.subCategory) {
        alert("Please select a Sub-category (like Sarees) for Women store.");
        return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        category: form.category.toLowerCase(),
        subCategory: form.subCategory, // Matches backend query
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
        setSuccess('✅ Product saved to pgAdmin & filtered to icons!');
        setForm({
          name: '', category: '', subCategory: '', originalPrice: '', discountedPrice: '',
          inStock: true, shortDescription: '', fullDescription: '',
          images: ['', '', '', ''], reviewerName: '', rating: '', reviewText: ''
        });
        setTimeout(() => setSuccess(''), 4000);
      } else {
          const errData = await res.json();
          alert("Error: " + errData.error);
      }
    } catch (err) {
        alert("Connection failed! Make sure your backend (Port 5000) is running.");
    } finally {
      setLoading(false);
    }
  };

  const getTabStyle = (tabName) => ({
    padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
    fontWeight: '700', fontSize: '14px', transition: 'all 0.3s',
    background: activeTab === tabName ? '#3D1F0D' : 'transparent',
    color: activeTab === tabName ? 'white' : '#5C3A1E',
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', background: '#FAF8F5', minHeight: '100vh' }}>
      
      {/* Header - No Change */}
      <div style={{ background: '#3D1F0D', color: 'white', padding: '24px 32px', borderRadius: 24, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Admin Dashboard</h1>
          <p style={{ margin: 0, opacity: 0.7, fontSize: 13 }}>Essential Mart | Database: pgAdmin</p>
        </div>
      </div>

      {/* Tabs - No Change */}
      <div style={{ display: 'flex', gap: '10px', background: '#F0E8D0', padding: '8px', borderRadius: '18px', marginBottom: 24 }}>
        <button onClick={() => setActiveTab('add')} style={getTabStyle('add')}>➕ Add Product</button>
        <button onClick={() => setActiveTab('manage')} style={getTabStyle('manage')}>🛠️ Manage Product</button>
        <button onClick={() => setActiveTab('orders')} style={getTabStyle('orders')}>📦 Orders</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        
        <div className="main-content">
          {activeTab === 'add' ? (
            <>
              <div style={sectionCard}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#3D1F0D', marginBottom: 20 }}>Add New Product</h2>
                
                {/* Product Name & Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Product Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Enter name" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* --- NEW: Sub Category Logic for Icon Filtering --- */}
                {form.category === 'Women' && (
                  <div style={{ marginBottom: 20, animation: 'fadeIn 0.5s' }}>
                    <label style={{...labelStyle, color: '#C4872A'}}>Filter Icon (Sub-category) *</label>
                    <select name="subCategory" value={form.subCategory} onChange={handleChange} style={{...inputStyle, border: '1px solid #C4872A'}}>
                      <option value="">Select Icon Location (e.g., Sarees)</option>
                      {WOMEN_SUBCATEGORIES.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
                    </select>
                    <p style={{fontSize: '10px', color: '#888', mt: '4px'}}>* Isse product Image 1 ke sahi icon ke andar jayega.</p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <input name="originalPrice" value={form.originalPrice} onChange={handleChange} placeholder="Original Price" type="number" style={inputStyle} />
                  <input name="discountedPrice" value={form.discountedPrice} onChange={handleChange} placeholder="Discounted Price" type="number" style={inputStyle} />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, fontWeight: 700, color: '#3D1F0D' }}>
                  <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} style={{ width: 18, height: 18 }} /> In Stock
                </label>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Short Description</label>
                  <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief tagline..." style={inputStyle} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Full Description</label>
                  <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} rows={5} style={{ ...inputStyle, resize: 'none' }} />
                </div>
              </div>

              {/* Images Section - Same UI */}
              <div style={sectionCard}>
                <h3 style={labelStyle}>🖼️ Product Images (Need 3 for Store Look)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {form.images.map((img, i) => (
                    <div key={i}>
                      <input type="file" accept="image/*" id={`img-${i}`} style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) handleFileUpload(i, e.target.files[0]); }} />
                      <label htmlFor={`img-${i}`} style={{ display: 'block', padding: '10px', background: '#3D1F0D', color: 'white', borderRadius: 10, fontSize: 11, cursor: 'pointer', textAlign: 'center', fontWeight: 700, marginBottom: 8 }}>File</label>
                      <input value={img} onChange={e => handleImageChange(i, e.target.value)} placeholder="URL" style={{ ...inputStyle, fontSize: 11, padding: '8px' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Section - Same UI */}
              <div style={{ ...sectionCard, background: '#FAF7F2', border: '1px dashed #D4C4A8' }}>
                <h3 style={{ ...labelStyle, color: '#C4872A' }}>⭐ Product Review</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
                  <input name="reviewerName" value={form.reviewerName} onChange={handleChange} placeholder="Reviewer Name" style={inputStyle} />
                  <input name="rating" value={form.rating} onChange={handleChange} type="number" min="1" max="5" placeholder="Rating (1-5)" style={inputStyle} />
                </div>
                <textarea name="reviewText" value={form.reviewText} onChange={handleChange} rows={2} placeholder="Review content..." style={{ ...inputStyle, resize: 'none' }} />
              </div>

              {success && <div style={{ background: '#D4EDDA', color: '#155724', padding: '12px', borderRadius: 12, marginBottom: 16, textAlign: 'center' }}>{success}</div>}

              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '18px', background: '#3D1F0D', color: 'white', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Processing...' : '+ Save Product to Database'}
              </button>
            </>
          ) : activeTab === 'manage' ? (
            /* Manage Tab - No UI change */
            <div style={sectionCard}>
              <h2 style={{ color: '#3D1F0D' }}>Manage Products</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {products.length > 0 ? products.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, border: '1px solid #F0E8D4', borderRadius: 12 }}>
                    <span>{p.name} <small style={{color: '#999'}}>({p.sub_category || p.category})</small></span>
                    <button style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                  </div>
                )) : <p>No products found in database.</p>}
              </div>
            </div>
          ) : (
            /* Orders Tab - No UI change */
            <div style={sectionCard}>
              <h2 style={{ color: '#3D1F0D' }}>Order History</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', background: '#F5F0E8' }}>
                    <th style={{ padding: 10 }}>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #EEE' }}>
                        <td style={{ padding: 10 }}>#{o.orderNumber}</td>
                        <td>{o.userName}</td>
                        <td>₹{o.total}</td>
                    </tr>
                    )) : (
                        <tr><td colSpan="3" style={{padding: 20, textAlign: 'center'}}>No orders yet.</td></tr>
                    )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar - No UI change */}
        <div className="sidebar">
          <div style={sectionCard}>
            <h3 style={labelStyle}>📤 Bulk Import</h3>
            <div style={{ border: '2px dashed #E2D1B9', padding: '20px', borderRadius: 12, textAlign: 'center', background: '#FCFAF8' }}>
              <label htmlFor="bulk-import" style={{ cursor: 'pointer', fontSize: 13, color: '#8B6914', fontWeight: 600 }}>Click to upload Excel</label>
              <input type="file" id="bulk-import" style={{ display: 'none' }} />
            </div>
          </div>
          <QuickStatsPanel />
        </div>

      </div>
    </div>
  );
}

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
              active: data.filter(p => p.in_stock || p.inStock).length 
            });
        }
      }).catch(() => {});
  }, []);

  return (
    <div style={{ background: '#3D1F0D', borderRadius: 24, padding: '24px', color: 'white' }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#C4A882', marginBottom: 20 }}>Quick Stats</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #5C3A1E' }}>
        <span>Total:</span> <span>{stats.total}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #5C3A1E' }}>
        <span>Categories:</span> <span>{stats.categories}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
        <span>In Stock:</span> <span>{stats.active}</span>
      </div>
    </div>
  );
}
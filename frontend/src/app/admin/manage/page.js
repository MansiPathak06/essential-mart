"use client";
// src/app/admin/products/page.tsx — Manage Products Page (JS Version)

import { useState, useEffect } from 'react';

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setFiltered(data);
      const cats = Array.from(new Set(data.map((p) => p.category)));
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  const filterByCategory = (cat) => {
    setSelectedCat(cat);
    if (cat === 'all') setFiltered(products);
    else setFiltered(products.filter(p => p.category === cat));
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const formatCategory = (cat) =>
    cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "";

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60, color: '#8B6914' }}>Loading products...</div>
  );

  return (
    <div style={{ background: 'white', borderRadius: 10, padding: 20, border: '1px solid #E8DCC8' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#3D1F0D', display: 'flex', alignItems: 'center', gap: 8 }}>
          ✏️ Manage Products
        </h2>
        <span style={{ fontSize: 12, color: '#8B7355' }}>{filtered.length} products shown</span>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 12px', background: '#F5F0E8', borderRadius: 8 }}>
        <span style={{ fontSize: 12, color: '#5C3A1E', fontWeight: 600 }}>🔽 Filter by Category</span>
        <select value={selectedCat} onChange={e => filterByCategory(e.target.value)}
          style={{ padding: '6px 12px', border: '1px solid #D4C4A8', borderRadius: 6, background: 'white', fontSize: 13, cursor: 'pointer' }}>
          <option value="all">All Categories ({products.length})</option>
          {categories.map(c => (
            <option key={c} value={c}>{formatCategory(c)} ({products.filter(p => p.category === c).length})</option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(product => (
          <div key={product.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', border: '1px solid #EEE8DA', borderRadius: 8,
            background: '#FDFAF5', transition: 'box-shadow 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(61,31,13,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            {/* Product Image */}
            <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F0E8D4' }}>
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📦</div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#2D1505', marginBottom: 2 }}>{product.name}</div>
              <div style={{ fontSize: 11, color: '#8B7355', marginBottom: 4 }}>{formatCategory(product.category)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#3D1F0D' }}>₹{Number(product.discountedPrice).toFixed(2)}</span>
                <span style={{ fontSize: 12, color: '#AAA', textDecoration: 'line-through' }}>₹{Number(product.originalPrice).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: product.inStock ? '#28A745' : '#DC3545' }}></div>
                <span style={{ fontSize: 11, color: product.inStock ? '#28A745' : '#DC3545', fontWeight: 600 }}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => window.open(`/product/${product.id}`, '_blank')}
                style={{ width: 34, height: 34, background: '#E8F4FD', border: '1px solid #B3D7F0', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
                title="View"
              >👁️</button>
              <button
                onClick={() => setEditProduct(product)}
                style={{ width: 34, height: 34, background: '#FFF3CD', border: '1px solid #FFCC80', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
                title="Edit"
              >✏️</button>
              <button
                onClick={() => setDeleteConfirm(product.id)}
                style={{ width: 34, height: 34, background: '#F8D7DA', border: '1px solid #F5C6CB', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
                title="Delete"
              >🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 28, maxWidth: 340, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontWeight: 700, color: '#3D1F0D', marginBottom: 8 }}>Delete Product?</h3>
            <p style={{ color: '#8B7355', fontSize: 14, marginBottom: 20 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '10px', background: '#F5F0E8', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                style={{ flex: 1, padding: '10px', background: '#DC3545', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <EditProductModal 
          product={editProduct} 
          onClose={() => setEditProduct(null)} 
          onSaved={() => { setEditProduct(null); fetchProducts(); }} 
        />
      )}
    </div>
  );
}

function EditProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product.name,
    originalPrice: product.originalPrice.toString(),
    discountedPrice: product.discountedPrice.toString(),
    inStock: product.inStock,
  });

  const handleSave = async () => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      onSaved();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #D4C4A8', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 24, maxWidth: 400, width: '100%' }}>
        <h3 style={{ fontWeight: 700, color: '#3D1F0D', marginBottom: 16 }}>Edit Product</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Name</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Original Price</label>
            <input value={form.originalPrice} type="number" onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Discounted Price</label>
            <input value={form.discountedPrice} type="number" onChange={e => setForm(p => ({ ...p, discountedPrice: e.target.value }))} style={inputStyle} />
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.inStock} onChange={e => setForm(p => ({ ...p, inStock: e.target.checked }))} />
          In Stock
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: '#F5F0E8', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ flex: 1, padding: '10px', background: '#3D1F0D', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
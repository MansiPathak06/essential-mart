"use client";

import { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ==================== FIXED STORAGE ====================
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user.id);     // ← Yeh line add ki
        localStorage.setItem('role', data.user.role || 'user');
        localStorage.setItem('email', data.user.email);

        if (isLogin) {
          if (email === 'admin@essential.com' || data.user.role === 'admin') {
            alert("Welcome Admin! 🎉");
            setTimeout(() => {
              window.location.href = '/admin/add-product';
            }, 300);
          } else {
            alert("Login Successful! Welcome back ❤️");
            window.location.href = '/women-store';   // Ya jahan aap chahein
          }
        } else {
          alert("Account created! Now please login.");
          setIsLogin(true);
        }
      } else {
        alert("Error: " + (data.error || "Invalid credentials"));
      }
    } catch (err) {
      console.error(err);
      alert("Server connection failed. Backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Essential Mart Login' : 'Create an account'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-black"
                placeholder="admin@essential.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Register</>}
          </button>

          <div className="text-center pt-2">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 hover:underline">
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Store, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ initialRole = 'CUSTOMER', onNavigate }) => {
  const { login, register, switchDemoRole } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(initialRole);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [locality, setLocality] = useState('Indiranagar');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const loggedUser = await login(email, password);
        if (loggedUser.role === 'ADMIN') onNavigate('admin');
        else if (loggedUser.role === 'ENTREPRENEUR') onNavigate('entrepreneur');
        else onNavigate('explore');
      } else {
        const registered = await register({
          email,
          password,
          full_name: fullName,
          role,
          phone,
          preferred_city: city,
          preferred_locality: locality,
        });
        if (registered.role === 'ENTREPRENEUR') onNavigate('entrepreneur');
        else onNavigate('explore');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || err.response?.data?.email?.[0] || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await switchDemoRole(demoRole);
      if (demoRole === 'ADMIN') onNavigate('admin');
      else if (demoRole === 'ENTREPRENEUR') onNavigate('entrepreneur');
      else onNavigate('explore');
    } catch (e) {
      setErrorMsg('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-[#5B4CF0] text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md shadow-[#5B4CF0]/25">
          C
        </div>
        <h2 className="text-3xl font-extrabold text-[#202033]">
          {isLogin ? 'Welcome Back to Communiti' : 'Join Your Hyperlocal Platform'}
        </h2>
        <p className="text-xs text-[#6B6B7B] max-w-sm mx-auto">
          {isLogin 
            ? 'Sign in to access your saved makers, CSAT reviews, and orders.' 
            : 'Create your account to discover artisanal creators or launch your ₹150/mo storefront.'}
        </p>
      </div>

      {/* Quick 1-Click Demo Login Bar */}
      <div className="bg-[#EEECFE]/70 rounded-2xl p-5 border border-[#5B4CF0]/30 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B4CF0]">
          <Sparkles className="w-4 h-4 text-[#FFB84D]" />
          <span>Quick 1-Click Demo Personas (Instant Access)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('CUSTOMER')}
            className="bg-white hover:bg-[#F8F8FC] p-2.5 rounded-xl border border-[#E8E8F2] text-left transition cursor-pointer shadow-xs"
          >
            <div className="text-base">🛍️</div>
            <div className="text-xs font-bold text-[#202033]">Customer</div>
            <div className="text-[10px] text-[#6B6B7B]">Riya Sharma</div>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('ENTREPRENEUR')}
            className="bg-white hover:bg-[#F8F8FC] p-2.5 rounded-xl border border-[#E8E8F2] text-left transition cursor-pointer shadow-xs"
          >
            <div className="text-base">👩‍🍳</div>
            <div className="text-xs font-bold text-[#202033]">Maker Pass</div>
            <div className="text-[10px] text-[#6B6B7B]">Ananya Roy (Bakes)</div>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('ADMIN')}
            className="bg-white hover:bg-[#F8F8FC] p-2.5 rounded-xl border border-[#E8E8F2] text-left transition cursor-pointer shadow-xs"
          >
            <div className="text-base">🛡️</div>
            <div className="text-xs font-bold text-[#202033]">Admin</div>
            <div className="text-[10px] text-[#6B6B7B]">Approvals Queue</div>
          </button>
        </div>
      </div>

      {/* Auth Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E8F2] shadow-card space-y-6">
        {/* Toggle Login vs Register */}
        <div className="grid grid-cols-2 p-1 bg-[#F8F8FC] rounded-xl border border-[#E8E8F2]">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              isLogin ? 'bg-white text-[#202033] shadow-xs' : 'text-[#6B6B7B] hover:text-[#202033]'
            }`}
          >
            Sign In with Email
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              !isLogin ? 'bg-white text-[#202033] shadow-xs' : 'text-[#6B6B7B] hover:text-[#202033]'
            }`}
          >
            Create New Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#FDF2F2] border border-[#D64545]/20 rounded-xl text-xs text-[#D64545] font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            /* Role Selector for Registration */
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#202033] block">I am joining as a:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    role === 'CUSTOMER'
                      ? 'bg-[#EEECFE] border-[#5B4CF0] text-[#202033] shadow-xs'
                      : 'bg-[#F8F8FC] border-[#E8E8F2] text-[#6B6B7B] hover:bg-white'
                  }`}
                >
                  <div className="text-lg">🛍️</div>
                  <div className="text-xs font-bold mt-1">Customer / Buyer</div>
                  <div className="text-[10px] text-[#6B6B7B]">Discover local bakes & crafts</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('ENTREPRENEUR')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    role === 'ENTREPRENEUR'
                      ? 'bg-[#EEECFE] border-[#5B4CF0] text-[#202033] shadow-xs'
                      : 'bg-[#F8F8FC] border-[#E8E8F2] text-[#6B6B7B] hover:bg-white'
                  }`}
                >
                  <div className="text-lg">👩‍🍳</div>
                  <div className="text-xs font-bold mt-1">Micro-Entrepreneur</div>
                  <div className="text-[10px] text-[#6B6B7B]">₹150/mo digital storefront</div>
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-[#202033] block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B7B]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Nair"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E8E8F2] rounded-xl focus:border-[#5B4CF0] outline-hidden text-[#202033]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#202033] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B7B]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E8E8F2] rounded-xl focus:border-[#5B4CF0] outline-hidden text-[#202033]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#202033] block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B7B]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-[#E8E8F2] rounded-xl focus:border-[#5B4CF0] outline-hidden text-[#202033]"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl bg-white outline-hidden text-[#202033] focus:border-[#5B4CF0]"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Goa">Goa</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#202033] block mb-1">Area / Locality</label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Indiranagar"
                  className="w-full text-xs p-2.5 border border-[#E8E8F2] rounded-xl outline-hidden focus:border-[#5B4CF0] text-[#202033]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;

import React from 'react';
import { Sparkles, Heart, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-[#202033] text-[#F8F8FC] pt-16 pb-12 border-t border-[#31314D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#31314D]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#5B4CF0] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                C
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">Communiti</span>
            </div>
            <p className="text-xs text-[#9A9AA8] leading-relaxed max-w-sm">
              The hyperlocal discovery platform dedicated to celebrating home bakers, bean-to-bar chocolatiers, bespoke gifting curators, studio potters, artisanal gourmet preserves, handmade jewellery designers, and homemade wine crafters.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-[#FFB84D] bg-[#FFB84D]/10 px-3 py-1.5 rounded-xl font-medium border border-[#FFB84D]/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fair Platform: ₹150 / mo flat</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#15A37D] bg-[#15A37D]/10 px-3 py-1.5 rounded-xl font-medium border border-[#15A37D]/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Quality Moderated</span>
              </div>
            </div>
          </div>

          {/* Micro-Segments */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
              Micro-Segments
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9A9AA8]">
              <li><button onClick={() => onNavigate('explore', { category: 'home-bakers' })} className="hover:text-[#5B4CF0] transition cursor-pointer">🍰 Home Bakers & Sourdough</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'chocolate-creations' })} className="hover:text-[#5B4CF0] transition cursor-pointer">🍫 Chocolate Creations</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'bespoke-gifting' })} className="hover:text-[#5B4CF0] transition cursor-pointer">🎁 Bespoke Gifting & Hampers</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'handcrafted-crafts' })} className="hover:text-[#5B4CF0] transition cursor-pointer">🧶 Handcrafted & Ceramics</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'artisanal-gourmet' })} className="hover:text-[#5B4CF0] transition cursor-pointer">🎨 Artisanal Gourmet Preserves</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'jewellery-designers' })} className="hover:text-[#5B4CF0] transition cursor-pointer">💍 Jewellery Designers</button></li>
              <li><button onClick={() => onNavigate('explore', { category: 'homemade-wines' })} className="hover:text-[#5B4CF0] transition cursor-pointer">🍷 Homemade Botanical Wines</button></li>
            </ul>
          </div>

          {/* Top Localities */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
              Top Hubs & Localities
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9A9AA8]">
              <li><button onClick={() => onNavigate('explore', { location: 'Indiranagar' })} className="hover:text-[#5B4CF0] transition cursor-pointer">📍 Indiranagar, Bengaluru</button></li>
              <li><button onClick={() => onNavigate('explore', { location: 'Koramangala' })} className="hover:text-[#5B4CF0] transition cursor-pointer">📍 Koramangala, Bengaluru</button></li>
              <li><button onClick={() => onNavigate('explore', { location: 'Bandra West' })} className="hover:text-[#5B4CF0] transition cursor-pointer">📍 Bandra West, Mumbai</button></li>
              <li><button onClick={() => onNavigate('explore', { location: 'Colaba' })} className="hover:text-[#5B4CF0] transition cursor-pointer">📍 Colaba, Mumbai</button></li>
              <li><button onClick={() => onNavigate('explore', { location: 'Connaught Place' })} className="hover:text-[#5B4CF0] transition cursor-pointer">📍 Connaught Place, Delhi</button></li>
              <li><button onClick={() => onNavigate('explore', { location: 'Anna Nagar' })} className="hover:text-[#5B4CF0] transition cursor-pointer">📍 Anna Nagar, Chennai</button></li>
              <li><button onClick={() => onNavigate('explore', { location: 'Panaji' })} className="hover:text-[#5B4CF0] transition cursor-pointer">📍 Fontainhas, Goa</button></li>
            </ul>
          </div>

          {/* For Makers */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4">
              For Micro-Makers
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9A9AA8]">
              <li><button onClick={() => onNavigate('auth', { role: 'ENTREPRENEUR' })} className="hover:text-[#FFB84D] transition cursor-pointer text-[#FFB84D] font-semibold">✨ Start Your Storefront</button></li>
              <li><button onClick={() => onNavigate('entrepreneur')} className="hover:text-[#5B4CF0] transition cursor-pointer">💳 ₹150 / mo UPI Plan</button></li>
              <li><button onClick={() => onNavigate('entrepreneur')} className="hover:text-[#5B4CF0] transition cursor-pointer">📊 Lead Management</button></li>
              <li><button onClick={() => onNavigate('admin')} className="hover:text-[#5B4CF0] transition cursor-pointer">🛡️ Quality Verification Policy</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A9AA8]">
          <p>© {new Date().getFullYear()} Communiti Marketplace. Built with ❤️ for neighborhood micro-businesses.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition cursor-pointer">CSAT Guarantee</span>
            <span className="hover:text-white transition cursor-pointer">UPI Direct Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { X, MapPin, Navigation, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const POPULAR_HUBS = [
  { city: 'Bengaluru', localities: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar', 'Malleshwaram'] },
  { city: 'Mumbai', localities: ['Bandra West', 'Juhu', 'Colaba', 'Andheri West', 'Powai', 'Dadar'] },
  { city: 'Delhi NCR', localities: ['Connaught Place', 'Hauz Khas', 'Vasant Kunj', 'Gurgaon DLF', 'Noida Sector 62'] },
  { city: 'Chennai', localities: ['Anna Nagar', 'Besant Nagar', 'T. Nagar', 'Adyar', 'Mylapore'] },
  { city: 'Goa', localities: ['Panaji / Fontainhas', 'Assagao', 'Anjuna', 'Candolim', 'Margao'] },
];

export const LocationPickerModal = ({ isOpen, onClose, onSelectLocation }) => {
  const { currentLocation, currentCity, updateLocation } = useAuth();
  const [selectedCity, setSelectedCity] = useState(currentCity || 'Bengaluru');
  const [customArea, setCustomArea] = useState('');

  if (!isOpen) return null;

  const handleSelect = (locality, city) => {
    const formatted = `${locality}, ${city}`;
    updateLocation(formatted, city);
    if (onSelectLocation) onSelectLocation(formatted, city);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customArea.trim()) return;
    handleSelect(customArea.trim(), selectedCity);
  };

  const handleAutoDetect = () => {
    // Simulated geolocation to popular Indiranagar hub
    handleSelect('Indiranagar', 'Bengaluru');
  };

  const activeCityData = POPULAR_HUBS.find(h => h.city === selectedCity) || POPULAR_HUBS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202033]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-modal border border-[#E8E8F2] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E8F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#15A37D]" />
            <h3 className="text-base font-bold text-[#202033]">Select Your Hyperlocal Hub</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#6B6B7B] hover:text-[#202033] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Auto-detect button */}
          <button
            onClick={handleAutoDetect}
            className="w-full bg-[#EEECFE] hover:bg-[#D5D1FC] text-[#5B4CF0] p-3 rounded-xl border border-[#5B4CF0]/20 flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-[#5B4CF0]" />
            <span>Auto-Detect My Current Neighborhood</span>
          </button>

          {/* City Selector Tabs */}
          <div>
            <label className="text-xs font-bold text-[#6B6B7B] uppercase tracking-wider block mb-2">
              Select City
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_HUBS.map((hub) => (
                <button
                  key={hub.city}
                  onClick={() => setSelectedCity(hub.city)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                    selectedCity === hub.city
                      ? 'bg-[#5B4CF0] text-white shadow-xs'
                      : 'bg-[#F8F8FC] text-[#6B6B7B] hover:bg-[#EEECFE] hover:text-[#5B4CF0]'
                  }`}
                >
                  {hub.city}
                </button>
              ))}
            </div>
          </div>

          {/* Localities Grid */}
          <div>
            <label className="text-xs font-bold text-[#6B6B7B] uppercase tracking-wider block mb-2">
              Popular Localities in {selectedCity}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeCityData.localities.map((loc) => {
                const isCurrent = currentLocation.includes(loc);
                return (
                  <button
                    key={loc}
                    onClick={() => handleSelect(loc, selectedCity)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition flex items-center justify-between cursor-pointer ${
                      isCurrent
                        ? 'bg-[#EEECFE] text-[#5B4CF0] border-[#5B4CF0]/40 shadow-xs'
                        : 'bg-white text-[#202033] border-[#E8E8F2] hover:border-[#5B4CF0]/30 hover:bg-[#F8F8FC]'
                    }`}
                  >
                    <span>{loc}</span>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-[#5B4CF0]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Area Input */}
          <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-[#E8E8F2]">
            <label className="text-xs font-bold text-[#202033] block mb-1.5">
              Or Enter Specific Area / Street / Pincode
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                placeholder="e.g. Lavelle Road, Bandra Bandstand..."
                className="flex-1 text-xs p-2.5 border border-[#E8E8F2] rounded-xl focus:border-[#5B4CF0] focus:ring-2 focus:ring-[#5B4CF0]/10 outline-hidden text-[#202033]"
              />
              <button
                type="submit"
                className="bg-[#5B4CF0] hover:bg-[#4A3BE0] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                Set Location
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;

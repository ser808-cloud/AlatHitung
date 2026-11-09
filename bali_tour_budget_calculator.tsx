import React, { useState, useMemo } from 'react';
import { 
  Users, Calendar, Bus, Hotel, Utensils, Compass, DollarSign, 
  Printer, ShieldAlert, Sparkles, MapPin, Check, Plus, Trash2, 
  PieChart as PieIcon, BarChart3, ChevronRight, Info, Award, Edit2, X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Preset Objek Wisata Populer Bali (Harga per orang estimasi)
const INITIAL_ATTRACTIONS = [
  { id: 'tanah-lot', name: 'Tanah Lot', category: 'Candi & Budaya', price: 30000, isCustom: false },
  { id: 'uluwatu', name: 'Pura Luhur Uluwatu', category: 'Candi & Kecak', price: 50000, isCustom: false },
  { id: 'bedugul', name: 'Bedugul - Ulun Danu Beratan', category: 'Danau & Pegunungan', price: 40000, isCustom: false },
  { id: 'kintamani', name: 'Kintamani & Batur View', category: 'Pegunungan', price: 50000, isCustom: false },
  { id: 'tegalalang', name: 'Tegalalang Rice Terrace', category: 'Alam', price: 25000, isCustom: false },
  { id: 'tirta-empul', name: 'Pura Tirta Empul (Tampak Siring)', category: 'Budaya', price: 30000, isCustom: false },
  { id: 'pandawa', name: 'Pantai Pandawa / Melasti', category: 'Pantai', price: 15000, isCustom: false },
  { id: 'penglipuran', name: 'Desa Adat Penglipuran', category: 'Desa Wisata', price: 25000, isCustom: false },
  { id: 'nusa-penida', name: 'Day Trip Nusa Penida (Boat + Transport)', category: 'Tour Kepulauan', price: 350000, isCustom: false },
  { id: 'garuda-wisnu', name: 'Garuda Wisnu Kencana (GWK)', category: 'Taman Budaya', price: 125000, isCustom: false },
  { id: 'kecak-dance', name: 'Pertunjukan Tari Kecak Uluwatu', category: 'Seni & Pertunjukan', price: 150000, isCustom: false },
];

// Opsi Kota Asal Keberangkatan
const ORIGIN_CITIES = [
  { id: 'surabaya', name: 'Surabaya / Sidoarjo / Gresik', defaultTransCost: 12000000, desc: 'Transportasi via Jalur Darat + Ferry' },
  { id: 'blitar', name: 'Blitar / Malang / Kediri', defaultTransCost: 13500000, desc: 'Transportasi via Jalur Darat + Ferry' },
  { id: 'semarang', name: 'Semarang / Solo / Jogja', defaultTransCost: 18000000, desc: 'Transportasi via Jalur Darat + Ferry' },
  { id: 'jakarta', name: 'Jabodetabek / Bandung', defaultTransCost: 28000000, desc: 'Transportasi via Jalur Darat + Ferry' },
  { id: 'custom', name: 'Lainnya / Terbang Langsung ke Bali', defaultTransCost: 0, desc: 'Sewa armada lokal di Bali saja / Pesawat terpisah' }
];

export default function App() {
  // --- STATE DATA TRIP & ROMBONGAN ---
  const [adults, setAdults] = useState(30);
  const [children, setChildren] = useState(5);
  const [days, setDays] = useState(4);
  const [nights, setNights] = useState(3);
  const [originCity, setOriginCity] = useState('surabaya');

  // --- STATE TRANSPORTASI ---
  const [transMode, setTransMode] = useState('big_bus');
  const [mainTransCost, setMainTransCost] = useState(14000000);
  const [ferryCostPerPax, setFerryCostPerPax] = useState(35000);
  const [flightCostPerPax, setFlightCostPerPax] = useState(0);

  // --- STATE AKOMODASI ---
  const [roomCapacity, setRoomCapacity] = useState(2);
  const [pricePerRoomNight, setPricePerRoomNight] = useState(450000);

  // --- STATE KONSUMSI ---
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [avgMealCost, setAvgMealCost] = useState(45000);

  // --- STATE TIKET WISATA & CUSTOM ATTRACTIONS ---
  const [attractions, setAttractions] = useState(INITIAL_ATTRACTIONS);
  const [selectedAttractions, setSelectedAttractions] = useState([
    'tanah-lot', 'uluwatu', 'bedugul', 'pandawa', 'penglipuran'
  ]);
  
  // State Form Custom Attraction
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customCategory, setCustomCategory] = useState('Wisata Kustom');
  const [editingId, setEditingId] = useState(null);

  // --- STATE OPERASIONAL & KONTINGENSI ---
  const [tourGuidePerDay, setTourGuidePerDay] = useState(350000);
  const [driverTipTotal, setDriverTipTotal] = useState(1000000);
  const [bannerDocCost, setBannerDocCost] = useState(500000);
  const [emergencyMarginPercent, setEmergencyMarginPercent] = useState(5);

  // --- HITUNGAN AUTOMATIS ---
  const totalPax = useMemo(() => Number(adults) + Number(children), [adults, children]);
  
  const roomsNeeded = useMemo(() => {
    if (totalPax <= 0 || roomCapacity <= 0) return 0;
    return Math.ceil(totalPax / roomCapacity);
  }, [totalPax, roomCapacity]);

  const totalAccommodationCost = useMemo(() => {
    return roomsNeeded * Number(pricePerRoomNight) * Number(nights);
  }, [roomsNeeded, pricePerRoomNight, nights]);

  const totalTransportCost = useMemo(() => {
    let main = Number(mainTransCost);
    let ferryTotal = transMode !== 'flight_plus_local' ? totalPax * Number(ferryCostPerPax) * 2 : 0;
    let flightTotal = transMode === 'flight_plus_local' ? totalPax * Number(flightCostPerPax) : 0;
    return main + ferryTotal + flightTotal;
  }, [mainTransCost, ferryCostPerPax, flightCostPerPax, totalPax, transMode]);

  const totalMealsCost = useMemo(() => {
    const totalMealsCount = Number(days) * Number(mealsPerDay);
    return totalPax * Number(avgMealCost) * totalMealsCount;
  }, [totalPax, days, mealsPerDay, avgMealCost]);

  const totalAttractionsCost = useMemo(() => {
    const attractionsTotalPerPax = selectedAttractions.reduce((sum, id) => {
      const item = attractions.find(a => a.id === id);
      return sum + (item ? Number(item.price) : 0);
    }, 0);
    return attractionsTotalPerPax * totalPax;
  }, [selectedAttractions, attractions, totalPax]);

  const totalOperationalCost = useMemo(() => {
    const guideTotal = Number(tourGuidePerDay) * Number(days);
    const driverTip = Number(driverTipTotal);
    const bannerDoc = Number(bannerDocCost);
    return guideTotal + driverTip + bannerDoc;
  }, [tourGuidePerDay, days, driverTipTotal, bannerDocCost]);

  const subtotalCost = useMemo(() => {
    return totalAccommodationCost + totalTransportCost + totalMealsCost + totalAttractionsCost + totalOperationalCost;
  }, [totalAccommodationCost, totalTransportCost, totalMealsCost, totalAttractionsCost, totalOperationalCost]);

  const emergencyMarginAmount = useMemo(() => {
    return (subtotalCost * Number(emergencyMarginPercent)) / 100;
  }, [subtotalCost, emergencyMarginPercent]);

  const grandTotalCost = useMemo(() => {
    return subtotalCost + emergencyMarginAmount;
  }, [subtotalCost, emergencyMarginAmount]);

  const costPerPax = useMemo(() => {
    return totalPax > 0 ? Math.ceil(grandTotalCost / totalPax) : 0;
  }, [grandTotalCost, totalPax]);

  // --- DATA VISUALISASI CHART ---
  const chartData = [
    { name: 'Transportasi', value: totalTransportCost, color: '#0284c7' }, 
    { name: 'Akomodasi (Hotel)', value: totalAccommodationCost, color: '#0d9488' }, 
    { name: 'Makan & Minum', value: totalMealsCost, color: '#f59e0b' }, 
    { name: 'Tiket Wisata', value: totalAttractionsCost, color: '#ec4899' }, 
    { name: 'Operasional & Tip', value: totalOperationalCost, color: '#8b5cf6' }, 
    { name: 'Dana Darurat / Margin', value: emergencyMarginAmount, color: '#64748b' } 
  ].filter(item => item.value > 0);

  // --- HANDLERS ---
  const handleToggleAttraction = (id) => {
    if (selectedAttractions.includes(id)) {
      setSelectedAttractions(selectedAttractions.filter(item => item !== id));
    } else {
      setSelectedAttractions([...selectedAttractions, id]);
    }
  };

  const handleCityChange = (cityId) => {
    setOriginCity(cityId);
    const selected = ORIGIN_CITIES.find(c => c.id === cityId);
    if (selected && selected.defaultTransCost > 0) {
      setMainTransCost(selected.defaultTransCost);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveCustomAttraction = (e) => {
    e.preventDefault();
    if (!customName.trim() || customPrice === '') return;

    const priceNum = Math.max(0, parseInt(customPrice) || 0);

    if (editingId) {
      setAttractions(attractions.map(item => 
        item.id === editingId 
          ? { ...item, name: customName, price: priceNum, category: customCategory || 'Wisata Kustom' }
          : item
      ));
      setEditingId(null);
    } else {
      const newId = 'custom-' + Date.now();
      const newItem = {
        id: newId,
        name: customName,
        category: customCategory || 'Wisata Kustom',
        price: priceNum,
        isCustom: true
      };
      setAttractions([...attractions, newItem]);
      setSelectedAttractions([...selectedAttractions, newId]);
    }

    setCustomName('');
    setCustomPrice('');
    setCustomCategory('Wisata Kustom');
    setShowAddModal(false);
  };

  const handleStartEditCustom = (e, item) => {
    e.stopPropagation();
    setEditingId(item.id);
    setCustomName(item.name);
    setCustomPrice(item.price);
    setCustomCategory(item.category);
    setShowAddModal(true);
  };

  const handleDeleteCustomAttraction = (e, id) => {
    e.stopPropagation();
    setAttractions(attractions.filter(item => item.id !== id));
    setSelectedAttractions(selectedAttractions.filter(item => item !== id));
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans print:bg-white print:text-black">
      {/* HEADER BAR */}
      <header className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 text-white shadow-lg sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600/50 backdrop-blur rounded-xl border border-teal-400/30">
              <Compass className="w-7 h-7 text-teal-200 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Kalkulator Biaya Wisata Bali</h1>
              <p className="text-xs text-teal-200">Estimasi Biaya Tour & Gathering Rombongan Interaktif</p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition backdrop-blur active:scale-95"
          >
            <Printer className="w-4 h-4" /> Cetak / Export PDF
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* HIGHLIGHT STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TOTAL BIAYA ROMBONGAN */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-teal-500/20">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-100 bg-teal-800/50 px-2.5 py-1 rounded-md border border-teal-400/30">
                Total Estimasi Rombongan
              </span>
              <DollarSign className="w-5 h-5 text-teal-200" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight my-2">
              {formatRupiah(grandTotalCost)}
            </div>
            <p className="text-teal-100 text-xs">Termasuk estimasi margin darurat {emergencyMarginPercent}%</p>
          </div>

          {/* BIAYA PER PAX */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                Biaya Per Orang (Cost/Pax)
              </span>
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-700 tracking-tight my-2">
              {formatRupiah(costPerPax)}
            </div>
            <div className="text-slate-500 text-xs flex items-center justify-between">
              <span>Rata-rata / iuran per peserta</span>
              <span className="font-semibold text-slate-700">{adults} Dewasa, {children} Anak</span>
            </div>
          </div>

          {/* RINGKASAN AKOMODASI & ARMADA */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                Kebutuhan Logistik
              </span>
              <Hotel className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Hotel className="w-4 h-4 text-blue-500" /> Kebutuhan Kamar:
                </span>
                <span className="font-bold text-slate-800">{roomsNeeded} Kamar</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-500" /> Jatah Makan:
                </span>
                <span className="font-bold text-slate-800">{days * mealsPerDay}x Makan</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-pink-500" /> Objek Wisata:
                </span>
                <span className="font-bold text-slate-800">{selectedAttractions.length} Destinasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION UTAMA: FORM INPUT & VISUALISASI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI: FORM CONFIGURATION (7 COLS) */}
          <div className="lg:col-span-7 space-y-6 print:w-full">
            
            {/* 1. INFORMASI ROMBONGAN & WAKTU */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
                <Users className="w-5 h-5 text-teal-600" />
                1. Data Rombongan & Waktu Trip
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Peserta Dewasa</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="1"
                      value={adults}
                      onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">Pax</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Peserta Anak-anak</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="0"
                      value={children}
                      onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">Pax</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Durasi Hari (Tour)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="1"
                      value={days}
                      onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">Hari</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Durasi Menginap (Malam)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="0"
                      value={nights}
                      onChange={(e) => setNights(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400">Malam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. TRANSPORTASI & TITIK KEBERANGKATAN */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
                <Bus className="w-5 h-5 text-blue-600" />
                2. Transportasi & Titik Keberangkatan
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kota / Titik Asal Keberangkatan</label>
                  <select 
                    value={originCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-medium bg-slate-50"
                  >
                    {ORIGIN_CITIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name} — ({c.desc})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mode Armada Utama</label>
                    <select 
                      value={transMode}
                      onChange={(e) => setTransMode(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-medium"
                    >
                      <option value="big_bus">Big Bus Pariwisata (45-50 Seat)</option>
                      <option value="medium_bus">Medium Bus (30-35 Seat)</option>
                      <option value="elf">HiAce / Elf Long (12-19 Seat)</option>
                      <option value="flight_plus_local">Pesawat + Sewa Bus Lokal Bali</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Biaya Sewa Bus / Armada (Total)</label>
                    <input 
                      type="number" 
                      step="500000"
                      value={mainTransCost}
                      onChange={(e) => setMainTransCost(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {transMode !== 'flight_plus_local' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Tiket Penyeberangan Ferry Ketapang-Gilimanuk (Per Orang PP)
                    </label>
                    <input 
                      type="number" 
                      value={ferryCostPerPax}
                      onChange={(e) => setFerryCostPerPax(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Dikali 2 untuk pulang-pergi per peserta.</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Estimasi Tiket Pesawat PP Per Pax
                    </label>
                    <input 
                      type="number" 
                      value={flightCostPerPax}
                      onChange={(e) => setFlightCostPerPax(Number(e.target.value))}
                      placeholder="e.g. 1800000"
                      className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 3. AKOMODASI (HOTEL) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
                <Hotel className="w-5 h-5 text-teal-600" />
                3. Akomodasi & Penginapan
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kapasitas per Kamar</label>
                  <select 
                    value={roomCapacity}
                    onChange={(e) => setRoomCapacity(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  >
                    <option value={2}>2 Orang / Kamar (Double/Twin)</option>
                    <option value={3}>3 Orang / Kamar (+Extra Bed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Harga Kamar / Malam</label>
                  <input 
                    type="number" 
                    step="50000"
                    value={pricePerRoomNight}
                    onChange={(e) => setPricePerRoomNight(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-center">
                  <span className="text-[11px] text-slate-500">Estimasi Kamar Didapat:</span>
                  <span className="text-lg font-bold text-teal-700">{roomsNeeded} Kamar</span>
                  <span className="text-[10px] text-slate-400">({nights} Malam menginap)</span>
                </div>
              </div>
            </div>

            {/* 4. KONSUMSI & MAKAN */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
                <Utensils className="w-5 h-5 text-amber-600" />
                4. Konsumsi & Culinary
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Frekuensi Makan per Hari</label>
                  <select 
                    value={mealsPerDay}
                    onChange={(e) => setMealsPerDay(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  >
                    <option value={2}>2x Makan Per Hari</option>
                    <option value={3}>3x Makan Per Hari (Standar Fullboard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Rata-rata Harga Makan / Orang / Porsi</label>
                  <input 
                    type="number" 
                    step="5000"
                    value={avgMealCost}
                    onChange={(e) => setAvgMealCost(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm font-semibold"
                  />
                  <span className="text-[11px] text-slate-400">Contoh: Prasmanan Rp35.000 - Rp50.000</span>
                </div>
              </div>
            </div>

            {/* 5. DESTINASI & TIKET MASUK WISATA (DENGAN FITUR TAMBAH CUSTOM) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3 border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-pink-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    5. Destinasi Wisata & Entry Tickets
                  </h2>
                  <span className="text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-semibold border border-pink-200">
                    {selectedAttractions.length} Dipilih
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setCustomName('');
                    setCustomPrice('');
                    setCustomCategory('Wisata Kustom');
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm active:scale-95 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Wisata Custom
                </button>
              </div>

              {/* LIST WISATA (PRESET + CUSTOM) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {attractions.map((attraction) => {
                  const isChecked = selectedAttractions.includes(attraction.id);
                  return (
                    <div 
                      key={attraction.id}
                      onClick={() => handleToggleAttraction(attraction.id)}
                      className={`p-3 rounded-xl border text-sm cursor-pointer transition flex items-center justify-between group relative ${
                        isChecked 
                          ? 'bg-pink-50/70 border-pink-300 text-slate-900 font-medium' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-pink-600 border-pink-600 text-white' : 'border-slate-300 bg-white'}`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold leading-tight truncate flex items-center gap-1">
                            {attraction.name}
                            {attraction.isCustom && (
                              <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">Custom</span>
                            )}
                          </p>
                          <span className="text-[10px] text-slate-400 block truncate">{attraction.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold text-slate-700">{formatRupiah(attraction.price)}</span>
                        
                        {/* AKSI KOLEKSI UNTUK CUSTOM DESTINASI */}
                        {attraction.isCustom && (
                          <div className="flex items-center gap-1">
                            <button
                              title="Edit Destinasi"
                              onClick={(e) => handleStartEditCustom(e, attraction)}
                              className="p-1 hover:bg-pink-200 text-slate-500 hover:text-pink-700 rounded transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              title="Hapus Destinasi"
                              onClick={(e) => handleDeleteCustomAttraction(e, attraction.id)}
                              className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MODAL TAMBAH/EDIT DESTINASI CUSTOM */}
            {showAddModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-pink-600" />
                      {editingId ? 'Edit Destinasi Wisata Custom' : 'Tambah Destinasi Wisata Custom'}
                    </h3>
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCustomAttraction} className="p-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Nama Destinasi / Wahana <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Contoh: Waterbom Bali / Beach Club Ticket"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Harga Tiket Masuk (Per Orang / Pax) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                        <input 
                          type="number" 
                          required
                          min="0"
                          placeholder="50000"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori (Opsional)</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Wahana Air / Beach Club / Souvenir"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white rounded-xl shadow-md transition"
                      >
                        {editingId ? 'Simpan Perubahan' : 'Tambahkan Destinasi'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 6. OPERASIONAL & KONTINGENSI (DANA DARURAT) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b pb-3 border-slate-100">
                <ShieldAlert className="w-5 h-5 text-purple-600" />
                6. Operasional, Tip & Dana Darurat
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tour Guide Lokal (Per Hari)</label>
                  <input 
                    type="number" 
                    step="50000"
                    value={tourGuidePerDay}
                    onChange={(e) => setTourGuidePerDay(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tip Crew Bus / Driver (Total Trip)</label>
                  <input 
                    type="number" 
                    step="100000"
                    value={driverTipTotal}
                    onChange={(e) => setDriverTipTotal(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Banner & Dokumentasi (Total)</label>
                  <input 
                    type="number" 
                    step="50000"
                    value={bannerDocCost}
                    onChange={(e) => setBannerDocCost(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Margin Dana Darurat / Contingency (%)</label>
                  <select
                    value={emergencyMarginPercent}
                    onChange={(e) => setEmergencyMarginPercent(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
                  >
                    <option value={0}>0% (Tanpa Cadangan)</option>
                    <option value={3}>3% Cadangan Minim</option>
                    <option value={5}>5% Rekomendasi Standar</option>
                    <option value={10}>10% Cadangan Aman</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: RINGKASAN, GRAFIK & BREAKDOWN (5 COLS) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">

            {/* VISUAL GRAFIK BIAYA */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center justify-between border-b pb-3 border-slate-100">
                <span className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-teal-600" />
                  Proporsi Pengeluaran Trip
                </span>
                <span className="text-xs font-normal text-slate-500">Persentase Biaya</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val) => formatRupiah(val)}
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* LEGEND BADGES */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-600 truncate">{item.name}:</span>
                    <span className="font-bold text-slate-800 ml-auto">{formatRupiah(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RINCIAN ITEM (ITEMIZED COST TABLE) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b pb-3 border-slate-100">
                Rincian Estimasi Per-Kategori
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">Transportasi Utama & Penyeberangan</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(totalTransportCost)}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">Akomodasi ({roomsNeeded} Kamar x {nights} Nite)</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(totalAccommodationCost)}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">Konsumsi ({days * mealsPerDay}x Makan x {totalPax} Pax)</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(totalMealsCost)}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">Tiket Objek Wisata ({selectedAttractions.length} Lokasi)</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(totalAttractionsCost)}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200">
                  <span className="text-slate-600">Guide, Tip Driver & Dokumen</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(totalOperationalCost)}</span>
                </div>

                {emergencyMarginAmount > 0 && (
                  <div className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200 text-slate-500">
                    <span>Dana Darurat / Contingency ({emergencyMarginPercent}%)</span>
                    <span className="font-semibold">{formatRupiah(emergencyMarginAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t-2 border-slate-800 flex justify-between items-center text-base font-extrabold text-slate-900">
                  <span>GRAND TOTAL</span>
                  <span className="text-teal-700">{formatRupiah(grandTotalCost)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
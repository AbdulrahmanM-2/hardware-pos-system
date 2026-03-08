import { useState, useEffect } from 'react';
import { 
  ShoppingCart, Package, BarChart3, History, 
  Plus, Minus, Trash2, CreditCard, Banknote, 
  Smartphone, Download, Globe, X 
} from 'lucide-react';

// --- Translations ---
const translations = {
  en: {
    pos: "Point of Sale",
    inventory: "Inventory",
    history: "Sales History",
    analytics: "Analytics",
    search_products: "Search products...",
    cart: "Current Sale",
    empty_cart: "Cart is empty",
    subtotal: "Subtotal",
    vat: "VAT (18%)",
    total: "TOTAL",
    cash: "Cash",
    card: "Card",
    mpesa: "M-Pesa",
    process_payment: "Process Payment",
    payment_method: "Payment Method",
    enter_phone: "Enter M-Pesa Phone Number",
    daily_sales: "Today's Sales",
    transactions: "Transactions",
    export_report: "Export Report",
    date: "Date",
    items: "Items",
    amount: "Amount",
    status: "Status",
    completed: "Completed",
    stock: "Stock",
    low_stock: "Low Stock",
    add_stock: "Add Stock"
  },
  sw: {
    pos: "Kituo cha Uuzaji",
    inventory: "Hifadhi",
    history: "Historia ya Mauzo",
    analytics: "Uchambuzi",
    search_products: "Tafuta bidhaa...",
    cart: "Mauzo ya Sasa",
    empty_cart: "Gari ni tupu",
    subtotal: "Jumla Ndogo",
    vat: "Kodi (VAT 18%)",
    total: "JUMLA",
    cash: "Taslimu",
    card: "Kadi",
    mpesa: "M-Pesa",
    process_payment: "Malipo",
    payment_method: "Njia ya Malipo",
    enter_phone: "Weka Nambari ya Simu ya M-Pesa",
    daily_sales: "Mauzo ya Leo",
    transactions: "Miamala",
    export_report: "Pakua Ripoti",
    date: "Tarehe",
    items: "Vitu",
    amount: "Kiasi",
    status: "Hali",
    completed: "Imekamilika",
    stock: "Stoki",
    low_stock: "Stoki Ndogo",
    add_stock: "Ongeza Stoki"
  }
};

// --- Initial Data ---
const initialProducts = [
  { id: 1, name: "Cement (50kg)", price: 15000, stock: 100, category: "Building" },
  { id: 2, name: "Iron Sheet (Gauge 30)", price: 25000, stock: 50, category: "Roofing" },
  { id: 3, name: "Nails (1kg)", price: 3500, stock: 200, category: "Hardware" },
  { id: 4, name: "Paint (20L)", price: 45000, stock: 20, category: "Finishing" },
  { id: 5, name: "PVC Pipe (3m)", price: 8000, stock: 150, category: "Plumbing" },
  { id: 6, name: "Hammer", price: 12000, stock: 30, category: "Tools" },
];

// --- Main App Component ---
export default function App() {
  // State
  const [activeView, setActiveView] = useState('pos');
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('pos_inventory');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [cart, setCart] = useState([]);
  const [salesHistory, setSalesHistory] = useState(() => {
    const saved = localStorage.getItem('pos_sales');
    return saved ? JSON.parse(saved) : [];
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('pos_lang') || 'en';
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('pos_inventory', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pos_sales', JSON.stringify(salesHistory));
  }, [salesHistory]);

  useEffect(() => {
    localStorage.setItem('pos_lang', language);
  }, [language]);

  // Helpers
  const t = (key) => translations[language][key] || key;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(amount);
  };

  // Cart Logic
  const addToCart = (product) => {
    if (product.stock <= 0) return alert("Out of stock!");
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (newQty <= 0) return null; 
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  // Calculations (VAT)
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const vat = subtotal * 0.18;
  const total = subtotal + vat;

  // Payment Processing
  const processPayment = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'mpesa' && !mpesaNumber) return alert(t('enter_phone'));

    // Deduct stock
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.qty };
      }
      return p;
    });
    setProducts(updatedProducts);

    // Save Sale
    const sale = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: cart.map(i => `${i.name} (${i.qty})`).join(', '),
      total: total,
      method: paymentMethod,
      mpesa: paymentMethod === 'mpesa' ? mpesaNumber : null
    };
    
    setSalesHistory(prev => [sale, ...prev]);
    
    // Reset
    setCart([]);
    setMpesaNumber('');
    setShowPaymentModal(false);
    setActiveView('history');
    
    alert("Payment Successful! Receipt Generated.");
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Date", "Items", "Total (TZS)", "Method", "Phone"];
    const rows = salesHistory.map(s => [s.date, s.items, s.total, s.method, s.mpesa || 'N/A']);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Filtering
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Hardware POS</h1>
          <span className="text-xs text-gray-400">v3.0 Production</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'pos', icon: ShoppingCart, label: t('pos') },
            { id: 'inventory', icon: Package, label: t('inventory') },
            { id: 'history', icon: History, label: t('history') },
            { id: 'analytics', icon: BarChart3, label: t('analytics') },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.id 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={() => setLanguage(lang => lang === 'en' ? 'sw' : 'en')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            <Globe size={18} />
            {language === 'en' ? 'English' : 'Swahili'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        
        {/* POS View */}
        {activeView === 'pos' && (
          <div className="flex h-full">
            {/* Product Grid */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="mb-6">
                <input 
                  type="text"
                  placeholder={t('search_products')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-transform hover:scale-105 ${
                      product.stock <= 5 ? 'border-red-200 bg-red-50' : 'border-gray-100'
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-2">{product.name}</div>
                    <div className="text-blue-600 font-bold">{formatCurrency(product.price)}</div>
                    <div className={`text-xs mt-2 ${product.stock <= 5 ? 'text-red-500' : 'text-gray-400'}`}>
                      {t('stock')}: {product.stock}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Sidebar */}
            <aside className="w-96 bg-white border-l flex flex-col">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart size={24} /> {t('cart')}
                </h2>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 mt-20">{t('empty_cart')}</div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-blue-600 text-sm">{formatCurrency(item.price)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-white rounded border hover:bg-gray-100">
                            <Minus size={14} />
                          </button>
                          <span className="font-bold w-6 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-white rounded border hover:bg-gray-100">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals & Payment */}
              <div className="border-t bg-gray-50 p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('subtotal')}</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>{t('vat')}</span>
                    <span>{formatCurrency(vat)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>{t('total')}</span>
                    <span className="text-blue-600">{formatCurrency(total)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPaymentModal(true)}
                  disabled={cart.length === 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                >
                  {t('process_payment')}
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* History View */}
        {activeView === 'history' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t('history')}</h2>
              <button 
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={18} /> {t('export_report')}
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 font-semibold">{t('date')}</th>
                    <th className="p-4 font-semibold">{t('items')}</th>
                    <th className="p-4 font-semibold">{t('amount')}</th>
                    <th className="p-4 font-semibold">{t('status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {salesHistory.map(sale => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-gray-600">{sale.date}</td>
                      <td className="p-4">{sale.items}</td>
                      <td className="p-4 font-semibold text-blue-600">{formatCurrency(sale.total)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          sale.method === 'mpesa' ? 'bg-green-100 text-green-700' : 
                          sale.method === 'card' ? 'bg-purple-100 text-purple-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {sale.method.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Placeholder Views */}
        {activeView === 'inventory' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">{t('inventory')}</h2>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">Advanced inventory management view.</p>
              <p className="text-sm text-gray-400 mt-2">Real-time stock updates are handled automatically in the POS view.</p>
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">{t('analytics')}</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="text-gray-500 text-sm">{t('daily_sales')}</div>
                <div className="text-3xl font-bold mt-2">
                  {formatCurrency(salesHistory
                    .filter(s => new Date(s.date).toDateString() === new Date().toDateString())
                    .reduce((sum, s) => sum + s.total, 0))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold mb-6">{t('payment_method')}</h2>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['cash', 'card', 'mpesa'].map(method => (
                <button 
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-colors ${
                    paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {method === 'cash' && <Banknote size={24} />}
                  {method === 'card' && <CreditCard size={24} />}
                  {method === 'mpesa' && <Smartphone size={24} />}
                  <span className="text-sm font-medium">{t(method)}</span>
                </button>
              ))}
            </div>

            {paymentMethod === 'mpesa' && (
              <input 
                type="text"
                placeholder={t('enter_phone')}
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
                className="w-full p-3 border rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">{t('total')}</span>
                <span className="font-bold">{formatCurrency(total)}</span>
              </div>
            </div>

            <button 
              onClick={processPayment}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
    }

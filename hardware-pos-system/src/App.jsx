import React, { useState, useMemo } from 'react';
import { ShoppingCart, Package, AlertTriangle, Search, Plus, Minus, X, Trash2, BarChart3, DollarSign, Box } from 'lucide-react';

// Initial inventory data (prices in TZS)
const initialInventory = [
  { id: 1, name: '2x4x8 Lumber', category: 'Lumber', price: 22000, stock: 450, minStock: 100, sku: 'LMB-001' },
  { id: 2, name: '2x6x10 Lumber', category: 'Lumber', price: 38000, stock: 280, minStock: 80, sku: 'LMB-002' },
  { id: 3, name: 'Plywood 4x8 3/4"', category: 'Lumber', price: 130000, stock: 120, minStock: 30, sku: 'PLY-001' },
  { id: 4, name: 'Cement 94lb Bag', category: 'Concrete', price: 32000, stock: 85, minStock: 50, sku: 'CEM-001' },
  { id: 5, name: 'Concrete Mix 80lb', category: 'Concrete', price: 16000, stock: 200, minStock: 100, sku: 'CON-001' },
  { id: 6, name: 'Rebar #4 20ft', category: 'Steel', price: 47000, stock: 45, minStock: 20, sku: 'REB-001' },
  { id: 7, name: 'Drywall 4x8 1/2"', category: 'Drywall', price: 37000, stock: 180, minStock: 50, sku: 'DRY-001' },
  { id: 8, name: 'Joint Compound 5gal', category: 'Drywall', price: 56000, stock: 65, minStock: 25, sku: 'JNT-001' },
  { id: 9, name: 'Paint White 5gal', category: 'Paint', price: 220000, stock: 42, minStock: 15, sku: 'PNT-001' },
  { id: 10, name: 'Paint Roller Kit', category: 'Paint', price: 31000, stock: 95, minStock: 30, sku: 'PNT-002' },
  { id: 11, name: 'Deck Screws 5lb', category: 'Fasteners', price: 61000, stock: 125, minStock: 40, sku: 'SCR-001' },
  { id: 12, name: 'Framing Nails 50lb', category: 'Fasteners', price: 220000, stock: 55, minStock: 20, sku: 'NAL-001' },
  { id: 13, name: 'PVC Pipe 2" 10ft', category: 'Plumbing', price: 25000, stock: 160, minStock: 50, sku: 'PVC-001' },
  { id: 14, name: 'Copper Pipe 3/4" 10ft', category: 'Plumbing', price: 113000, stock: 38, minStock: 20, sku: 'CPR-001' },
  { id: 15, name: 'Wire 12/2 250ft', category: 'Electrical', price: 310000, stock: 28, minStock: 15, sku: 'WIR-001' },
  { id: 16, name: 'Outlet 15A White', category: 'Electrical', price: 6100, stock: 340, minStock: 100, sku: 'OUT-001' },
  { id: 17, name: 'Insulation R-13', category: 'Insulation', price: 105000, stock: 75, minStock: 25, sku: 'INS-001' },
  { id: 18, name: 'Roofing Shingles', category: 'Roofing', price: 81000, stock: 95, minStock: 30, sku: 'ROF-001' },
  { id: 19, name: 'Circular Saw Blade', category: 'Tools', price: 86000, stock: 48, minStock: 15, sku: 'TLS-001' },
  { id: 20, name: 'Safety Glasses', category: 'Safety', price: 22000, stock: 215, minStock: 75, sku: 'SAF-001' },
];

// Format currency in TZS
const formatTZS = (amount) => {
  return 'TZS ' + Math.round(amount).toLocaleString('en-US');
};

export default function HardwarePOS() {
  const [inventory, setInventory] = useState(initialInventory);
  const [cart, setCart] = useState([]);
  const [activeView, setActiveView] = useState('pos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Get unique categories
  const categories = ['All', ...new Set(inventory.map(item => item.category))];

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, selectedCategory]);

  // Low stock items
  const lowStockItems = inventory.filter(item => item.stock <= item.minStock);

  // Calculate totals
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Add multiple to cart
  const addMultipleToCart = (product, quantity) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= product.stock) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, quantity: product.stock } : item
        ));
      }
    } else {
      const addQuantity = Math.min(quantity, product.stock);
      setCart([...cart, { ...product, quantity: addQuantity }]);
    }
  };

  // Update cart quantity
  const updateCartQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        const product = inventory.find(p => p.id === productId);
        if (newQuantity > 0 && newQuantity <= product.stock) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Show payment modal
  const showPayment = () => {
    setShowPaymentModal(true);
    setCashReceived(0);
  };

  // Process payment
  const processPayment = () => {
    if (paymentMethod === 'cash' && cashReceived < cartTotal) {
      alert('Insufficient cash received!');
      return;
    }
    completeSale();
    setShowPaymentModal(false);
  };

  // Complete sale
  const completeSale = () => {
    // Update inventory
    const updatedInventory = inventory.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity };
      }
      return product;
    });
    setInventory(updatedInventory);

    // Store transaction
    setLastTransaction({
      items: [...cart],
      total: cartTotal,
      date: new Date(),
      id: Date.now(),
      paymentMethod: paymentMethod,
      cashReceived: paymentMethod === 'cash' ? cashReceived : cartTotal,
      change: paymentMethod === 'cash' ? cashReceived - cartTotal : 0
    });

    // Clear cart and show receipt
    setShowReceipt(true);
    setCart([]);
    setCashReceived(0);
  };

  // Adjust inventory
  const adjustInventory = (productId, change) => {
    setInventory(inventory.map(product =>
      product.id === productId
        ? { ...product, stock: Math.max(0, product.stock + change) }
        : product
    ));
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-zinc-950 to-zinc-900 border-b-4 border-yellow-500 shadow-lg">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 text-zinc-900 p-3 rotate-45 transform">
                <Box className="w-8 h-8 -rotate-45" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
                  BuildPro Hardware
                </h1>
                <p className="text-zinc-400 text-sm font-mono">POINT OF SALE SYSTEM v2.1</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('pos')}
                className={`px-6 py-3 font-bold uppercase tracking-wide transition-all ${
                  activeView === 'pos'
                    ? 'bg-yellow-500 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <ShoppingCart className="inline w-5 h-5 mr-2" />
                POS
              </button>
              <button
                onClick={() => setActiveView('inventory')}
                className={`px-6 py-3 font-bold uppercase tracking-wide transition-all ${
                  activeView === 'inventory'
                    ? 'bg-yellow-500 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <Package className="inline w-5 h-5 mr-2" />
                Inventory
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-6 py-3 font-bold uppercase tracking-wide transition-all ${
                  activeView === 'analytics'
                    ? 'bg-yellow-500 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                <BarChart3 className="inline w-5 h-5 mr-2" />
                Analytics
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        {activeView === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Cart Summary Bar */}
              {cartItemCount > 0 && (
                <div className="bg-yellow-500 text-zinc-900 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-zinc-900 text-yellow-500 px-4 py-2 rounded-full font-black text-xl">
                      {cartItemCount}
                    </div>
                    <div>
                      <p className="font-black text-lg uppercase">Items in Cart</p>
                      <p className="font-mono text-sm">Click "Complete Sale" when ready</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold uppercase">Cart Total</p>
                    <p className="font-black text-2xl">{formatTZS(cartTotal)}</p>
                  </div>
                </div>
              )}

              {/* Search and Filter */}
              <div className="bg-zinc-800 p-4 border-l-4 border-yellow-500">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[250px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-yellow-500 focus:outline-none font-mono"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-zinc-100 focus:border-yellow-500 focus:outline-none font-bold uppercase"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                {filteredInventory.map(product => (
                  <div
                    key={product.id}
                    className="bg-zinc-800 border-l-4 border-zinc-700 hover:border-yellow-500 transition-all p-4 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-zinc-100 group-hover:text-yellow-500 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-zinc-500 font-mono text-sm">SKU: {product.sku}</p>
                      </div>
                      <span className="bg-yellow-500 text-zinc-900 px-3 py-1 font-black text-lg">
                        {formatTZS(product.price)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-700">
                      <span className="text-sm font-bold text-zinc-400 uppercase">{product.category}</span>
                      <span className={`font-mono font-bold ${
                        product.stock <= product.minStock ? 'text-red-500' : 'text-green-500'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => addMultipleToCart(product, 1)}
                        className="flex-1 bg-zinc-700 hover:bg-yellow-500 hover:text-zinc-900 py-2 font-bold uppercase transition-all"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => addMultipleToCart(product, 5)}
                        className="flex-1 bg-zinc-700 hover:bg-yellow-500 hover:text-zinc-900 py-2 font-bold uppercase transition-all"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => addMultipleToCart(product, 10)}
                        className="flex-1 bg-zinc-700 hover:bg-yellow-500 hover:text-zinc-900 py-2 font-bold uppercase transition-all"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="bg-zinc-800 border-l-4 border-yellow-500 p-6 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase">Cart</h2>
                <div className="bg-yellow-500 text-zinc-900 px-3 py-1 rounded-full font-black">
                  {cartItemCount}
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-bold">Cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2">
                    {cart.map(item => (
                      <div key={item.id} className="bg-zinc-900 p-3 border-l-2 border-zinc-700">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-sm">{item.name}</h4>
                            <p className="text-zinc-500 text-xs font-mono">{item.sku}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-500 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="bg-zinc-800 hover:bg-zinc-700 p-1 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-black font-mono w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="bg-zinc-800 hover:bg-zinc-700 p-1 transition-colors"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="font-black text-yellow-500">
                            {formatTZS(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-4 border-zinc-700 pt-4 space-y-4">
                    <div className="flex justify-between items-center text-2xl">
                      <span className="font-black uppercase">Total</span>
                      <span className="font-black text-yellow-500">{formatTZS(cartTotal)}</span>
                    </div>
                    
                    <button
                      onClick={showPayment}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 py-4 font-black text-xl uppercase tracking-wide transition-colors"
                    >
                      <DollarSign className="inline w-6 h-6 mr-2" />
                      Complete Sale
                    </button>
                    
                    <button
                      onClick={() => setCart([])}
                      className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 py-3 font-bold uppercase tracking-wide transition-colors"
                    >
                      <Trash2 className="inline w-5 h-5 mr-2" />
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeView === 'inventory' && (
          <div className="space-y-6">
            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <div className="bg-red-950 border-l-4 border-red-500 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h2 className="text-xl font-black uppercase">Low Stock Alert</h2>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full font-black text-sm">
                    {lowStockItems.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="bg-zinc-900 p-3 border-l-2 border-red-500">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-zinc-500 font-mono">{item.sku}</p>
                      <p className="text-red-500 font-black mt-1">
                        Stock: {item.stock} / Min: {item.minStock}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Table */}
            <div className="bg-zinc-800 border-l-4 border-yellow-500">
              <div className="p-6 border-b border-zinc-700">
                <h2 className="text-2xl font-black uppercase">Inventory Management</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900">
                    <tr className="text-left">
                      <th className="p-4 font-black uppercase text-sm">SKU</th>
                      <th className="p-4 font-black uppercase text-sm">Product</th>
                      <th className="p-4 font-black uppercase text-sm">Category</th>
                      <th className="p-4 font-black uppercase text-sm text-right">Price</th>
                      <th className="p-4 font-black uppercase text-sm text-right">Stock</th>
                      <th className="p-4 font-black uppercase text-sm text-right">Min Stock</th>
                      <th className="p-4 font-black uppercase text-sm text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((product, idx) => (
                      <tr
                        key={product.id}
                        className={`border-b border-zinc-700 ${
                          idx % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-850'
                        } hover:bg-zinc-750 transition-colors`}
                      >
                        <td className="p-4 font-mono text-sm text-zinc-400">{product.sku}</td>
                        <td className="p-4 font-bold">{product.name}</td>
                        <td className="p-4 text-sm text-zinc-400 uppercase">{product.category}</td>
                        <td className="p-4 text-right font-black text-yellow-500">
                          {formatTZS(product.price)}
                        </td>
                        <td className={`p-4 text-right font-black font-mono ${
                          product.stock <= product.minStock ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {product.stock}
                        </td>
                        <td className="p-4 text-right font-mono text-zinc-400">{product.minStock}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => adjustInventory(product.id, -10)}
                              className="bg-zinc-700 hover:bg-zinc-600 p-2 transition-colors"
                              title="Remove 10"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => adjustInventory(product.id, 10)}
                              className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 p-2 transition-colors"
                              title="Add 10"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 border-l-4 border-yellow-700">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-yellow-900" />
                <span className="text-yellow-900 font-mono text-sm">TOTAL</span>
              </div>
              <p className="text-4xl font-black text-yellow-900">
                {inventory.reduce((sum, item) => sum + item.stock, 0)}
              </p>
              <p className="text-yellow-900 font-bold uppercase text-sm mt-1">Units in Stock</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 border-l-4 border-green-800">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-green-950" />
                <span className="text-green-950 font-mono text-sm">VALUE</span>
              </div>
              <p className="text-4xl font-black text-green-950">
                {formatTZS(inventory.reduce((sum, item) => sum + (item.price * item.stock), 0))}
              </p>
              <p className="text-green-950 font-bold uppercase text-sm mt-1">Inventory Value</p>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 border-l-4 border-red-800">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8 text-red-950" />
                <span className="text-red-950 font-mono text-sm">ALERTS</span>
              </div>
              <p className="text-4xl font-black text-red-950">{lowStockItems.length}</p>
              <p className="text-red-950 font-bold uppercase text-sm mt-1">Low Stock Items</p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 border-l-4 border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <Box className="w-8 h-8 text-blue-950" />
                <span className="text-blue-950 font-mono text-sm">PRODUCTS</span>
              </div>
              <p className="text-4xl font-black text-blue-950">{inventory.length}</p>
              <p className="text-blue-950 font-bold uppercase text-sm mt-1">Total Products</p>
            </div>

            {/* Category Breakdown */}
            <div className="md:col-span-2 lg:col-span-4 bg-zinc-800 border-l-4 border-yellow-500 p-6">
              <h2 className="text-2xl font-black uppercase mb-6">Category Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.filter(cat => cat !== 'All').map(category => {
                  const categoryItems = inventory.filter(item => item.category === category);
                  const categoryStock = categoryItems.reduce((sum, item) => sum + item.stock, 0);
                  const categoryValue = categoryItems.reduce((sum, item) => sum + (item.price * item.stock), 0);
                  
                  return (
                    <div key={category} className="bg-zinc-900 p-4 border-l-2 border-zinc-700">
                      <h3 className="font-black uppercase text-yellow-500 mb-3">{category}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Products:</span>
                          <span className="font-bold">{categoryItems.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Units:</span>
                          <span className="font-bold font-mono">{categoryStock}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Value:</span>
                          <span className="font-bold text-green-500">{formatTZS(categoryValue)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 text-zinc-100 max-w-md w-full p-8 relative border-l-4 border-yellow-500">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-black uppercase mb-6">Payment</h2>

            <div className="mb-6">
              <div className="flex justify-between items-center text-2xl mb-6 pb-4 border-b-2 border-zinc-700">
                <span className="font-black uppercase">Total Due</span>
                <span className="font-black text-yellow-500">{formatTZS(cartTotal)}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`py-3 px-4 font-bold uppercase transition-all ${
                        paymentMethod === 'cash' ? 'bg-yellow-500 text-zinc-900' : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      Cash
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`py-3 px-4 font-bold uppercase transition-all ${
                        paymentMethod === 'card' ? 'bg-yellow-500 text-zinc-900' : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      Card
                    </button>
                  </div>
                </div>

                {paymentMethod === 'cash' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2 uppercase">Cash Received</label>
                      <input
                        type="number"
                        value={cashReceived || ''}
                        onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                        placeholder="Enter amount..."
                        className="w-full p-3 bg-zinc-900 border-2 border-zinc-700 text-zinc-100 font-mono text-lg focus:border-yellow-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[50000, 20000, 10000, 5000, 2000, 1000].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setCashReceived((cashReceived || 0) + amount)}
                          className="py-2 bg-zinc-700 hover:bg-zinc-600 font-mono font-bold transition-colors"
                        >
                          +{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    {cashReceived > 0 && (
                      <div className={`bg-zinc-900 p-4 border-l-2 ${
                        cashReceived >= cartTotal ? 'border-green-500' : 'border-red-500'
                      }`}>
                        <div className="flex justify-between text-lg mb-2">
                          <span className="font-bold">Cash Received:</span>
                          <span className="font-black font-mono">{formatTZS(cashReceived)}</span>
                        </div>
                        {cashReceived >= cartTotal ? (
                          <div className="flex justify-between text-lg">
                            <span className="font-bold text-green-500">Change:</span>
                            <span className="font-black font-mono text-green-500">
                              {formatTZS(cashReceived - cartTotal)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-between text-lg">
                            <span className="font-bold text-red-500">Remaining:</span>
                            <span className="font-black font-mono text-red-500">
                              {formatTZS(cartTotal - cashReceived)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {paymentMethod === 'card' && (
                  <div className="bg-zinc-900 p-4 border-l-2 border-green-500">
                    <p className="text-center font-bold text-green-500">Ready to process card payment</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={processPayment}
                disabled={paymentMethod === 'cash' && cashReceived < cartTotal}
                className={`w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 py-4 font-black text-xl uppercase tracking-wide transition-colors ${
                  paymentMethod === 'cash' && cashReceived < cartTotal ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {paymentMethod === 'cash' ? 'Complete Cash Sale' : 'Process Card Payment'}
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full bg-zinc-700 hover:bg-zinc-600 py-3 font-bold uppercase transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-zinc-900 max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowReceipt(false)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-900"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6 pb-6 border-b-2 border-dashed border-zinc-400">
              <h2 className="text-3xl font-black uppercase mb-2">BuildPro Hardware</h2>
              <p className="text-sm text-zinc-600 font-mono">SALES RECEIPT</p>
              <p className="text-xs text-zinc-500 font-mono mt-2">
                {lastTransaction.date.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 font-mono">
                Transaction ID: {lastTransaction.id}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {lastTransaction.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-zinc-600 text-xs">
                      {item.quantity} × {formatTZS(item.price)}
                    </p>
                  </div>
                  <p className="font-black">{formatTZS(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-zinc-400 pt-4 mb-6">
              <div className="flex justify-between text-2xl mb-2">
                <span className="font-black uppercase">Total</span>
                <span className="font-black">{formatTZS(lastTransaction.total)}</span>
              </div>
              {lastTransaction.paymentMethod === 'cash' && lastTransaction.change > 0 && (
                <div className="text-sm space-y-1 mt-3 pt-3 border-t border-zinc-300">
                  <div className="flex justify-between">
                    <span>Cash Received:</span>
                    <span className="font-bold">{formatTZS(lastTransaction.cashReceived)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Change:</span>
                    <span className="font-bold">{formatTZS(lastTransaction.change)}</span>
                  </div>
                </div>
              )}
              <p className="text-center text-xs text-zinc-600 font-mono mt-4">
                THANK YOU FOR YOUR BUSINESS
              </p>
            </div>

            <button
              onClick={() => setShowReceipt(false)}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3 font-bold uppercase transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

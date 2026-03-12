import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ShoppingCart, Package, AlertTriangle, Search, Plus, Minus, X, Trash2, BarChart3, DollarSign, Box, History, Download, Globe, Receipt, LogOut, User, Scan, Camera, Printer, Users, Award } from 'lucide-react';

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

// Translations
const translations = {
  en: {
    pos: 'POS',
    inventory: 'Inventory',
    analytics: 'Analytics',
    salesHistory: 'Sales History',
    customers: 'Customers',
    cart: 'Cart',
    cartEmpty: 'Cart is empty',
    completeSale: 'Complete Sale',
    clearCart: 'Clear Cart',
    total: 'Total',
    payment: 'Payment',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    card: 'Card',
    mpesa: 'M-Pesa',
    cashReceived: 'Cash Received',
    change: 'Change',
    remaining: 'Remaining',
    processSale: 'Complete Sale',
    cancel: 'Cancel',
    receipt: 'Sales Receipt',
    thankYou: 'THANK YOU FOR YOUR BUSINESS',
    stock: 'Stock',
    lowStockAlert: 'Low Stock Alert',
    searchProducts: 'Search products or SKU...',
    itemsInCart: 'Items in Cart',
    cartTotal: 'Cart Total',
    subtotal: 'Subtotal',
    vat: 'VAT (18%)',
    transactionId: 'Transaction ID',
    date: 'Date',
    exportReport: 'Export Report',
    todaySales: "Today's Sales",
    totalRevenue: 'Total Revenue',
    enterPhone: 'Enter M-Pesa number',
    readyToProcess: 'Ready to process',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    productName: 'Product Name',
    price: 'Price',
    category: 'Category',
    minimumStock: 'Minimum Stock',
    save: 'Save',
    duplicate: 'Duplicate',
    selectAll: 'Select All',
    deleteSelected: 'Delete Selected',
    productsSelected: 'products selected',
    storageLocation: 'Storage Location',
  },
  sw: {
    pos: 'POS',
    inventory: 'Hesabu',
    analytics: 'Takwimu',
    salesHistory: 'Historia ya Mauzo',
    cart: 'Kikapu',
    cartEmpty: 'Kikapu ni tupu',
    completeSale: 'Maliza Mauzo',
    clearCart: 'Futa Kikapu',
    total: 'Jumla',
    payment: 'Malipo',
    paymentMethod: 'Njia ya Malipo',
    cash: 'Pesa Taslimu',
    card: 'Kadi',
    mpesa: 'M-Pesa',
    cashReceived: 'Pesa Zilizopokelewa',
    change: 'Chenji',
    remaining: 'Zilizobaki',
    processSale: 'Maliza Mauzo',
    cancel: 'Ghairi',
    receipt: 'Risiti ya Mauzo',
    thankYou: 'ASANTE KWA BIASHARA YAKO',
    stock: 'Hisa',
    lowStockAlert: 'Tahadhari ya Hisa Chini',
    searchProducts: 'Tafuta bidhaa au SKU...',
    itemsInCart: 'Vitu katika Kikapu',
    cartTotal: 'Jumla ya Kikapu',
    subtotal: 'Jumla Ndogo',
    vat: 'VAT (18%)',
    transactionId: 'Nambari ya Muamala',
    date: 'Tarehe',
    exportReport: 'Toa Ripoti',
    todaySales: 'Mauzo ya Leo',
    totalRevenue: 'Mapato Yote',
    enterPhone: 'Ingiza nambari ya M-Pesa',
    readyToProcess: 'Tayari kuchakata',
    addProduct: 'Ongeza Bidhaa',
    editProduct: 'Hariri Bidhaa',
    deleteProduct: 'Futa Bidhaa',
    productName: 'Jina la Bidhaa',
    price: 'Bei',
    category: 'Jamii',
    minimumStock: 'Hisa ya Chini',
    save: 'Hifadhi',
    duplicate: 'Nakili',
    selectAll: 'Chagua Zote',
    deleteSelected: 'Futa Zilizochaguliwa',
    productsSelected: 'bidhaa zilizochaguliwa',
    storageLocation: 'Mahali pa Uhifadhi',
  }
};

// VAT rate for Tanzania
const VAT_RATE = 0.18;

// Format currency in TZS
const formatTZS = (amount) => {
  return 'TZS ' + Math.round(amount).toLocaleString('en-US');
};

// Load data from localStorage
const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Save data to localStorage
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage error:', error);
  }
};

export default function HardwarePOS({ user, userProfile, onLogout, language: propLanguage, setLanguage: propSetLanguage, demoMode }) {
  // Use prop language if provided, otherwise fall back to local state
  const [localLanguage, setLocalLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const language = propLanguage !== undefined ? propLanguage : localLanguage;
  const setLanguage = propSetLanguage || setLocalLanguage;
  
  const [inventory, setInventory] = useState(() => loadFromStorage('inventory', initialInventory));
  const [cart, setCart] = useState([]);
  const [activeView, setActiveView] = useState('pos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [salesHistory, setSalesHistory] = useState(() => loadFromStorage('salesHistory', []));
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannerMode, setScannerMode] = useState('camera'); // 'camera' or 'usb'
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [autoPrint, setAutoPrint] = useState(() => loadFromStorage('autoPrint', false));
  const [customers, setCustomers] = useState(() => loadFromStorage('customers', []));
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    minStock: '',
    sku: '',
    storageLocation: 'Main Store',
    barcode: '',
  });
  const [selectedProducts, setSelectedProducts] = useState([]);

  const t = translations[language];

  // Save to localStorage when data changes
  useEffect(() => {
    saveToStorage('inventory', inventory);
  }, [inventory]);

  useEffect(() => {
    saveToStorage('salesHistory', salesHistory);
  }, [salesHistory]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    saveToStorage('autoPrint', autoPrint);
  }, [autoPrint]);

  useEffect(() => {
    saveToStorage('customers', customers);
  }, [customers]);

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
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartVAT = cartSubtotal * VAT_RATE;
  const cartTotal = cartSubtotal + cartVAT;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate today's sales
  const todaySales = useMemo(() => {
    const today = new Date().toDateString();
    return salesHistory.filter(sale => new Date(sale.date).toDateString() === today);
  }, [salesHistory]);

  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);

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
    setMpesaNumber('');
  };

  // Process payment
  const processPayment = () => {
    if (paymentMethod === 'cash' && cashReceived < cartTotal) {
      alert('Insufficient cash received!');
      return;
    }
    if (paymentMethod === 'mpesa' && !mpesaNumber) {
      alert('Please enter M-Pesa number!');
      return;
    }
    completeSale();
    setShowPaymentModal(false);
  };

  // Complete sale
  const completeSale = () => {
    // Calculate customer discount and points
    let finalTotal = cartTotal;
    let discount = 0;
    let pointsEarned = 0;
    let tierInfo = null;

    if (selectedCustomer) {
      tierInfo = calculateLoyaltyTier(selectedCustomer.points);
      discount = cartSubtotal * tierInfo.discount;
      finalTotal = cartTotal - discount;
      // 1 point per 100 TZS spent
      pointsEarned = Math.floor(finalTotal / 100);
    }

    // Update inventory
    const updatedInventory = inventory.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity };
      }
      return product;
    });
    setInventory(updatedInventory);

    // Create transaction
    const transaction = {
      items: [...cart],
      subtotal: cartSubtotal,
      vat: cartVAT,
      total: cartTotal,
      discount: discount,
      finalTotal: finalTotal,
      date: new Date().toISOString(),
      id: Date.now(),
      paymentMethod: paymentMethod,
      cashReceived: paymentMethod === 'cash' ? cashReceived : finalTotal,
      change: paymentMethod === 'cash' ? cashReceived - finalTotal : 0,
      mpesaNumber: paymentMethod === 'mpesa' ? mpesaNumber : null,
      customerId: selectedCustomer ? selectedCustomer.id : null,
      customerName: selectedCustomer ? selectedCustomer.name : null,
      pointsEarned: pointsEarned,
      tier: tierInfo ? tierInfo.tier : null,
    };

    // Update customer if selected
    if (selectedCustomer) {
      setCustomers(customers.map(c => 
        c.id === selectedCustomer.id
          ? {
              ...c,
              points: c.points + pointsEarned,
              totalSpent: c.totalSpent + finalTotal,
              visits: c.visits + 1,
              lastVisit: new Date().toISOString(),
            }
          : c
      ));
    }

    // Store transaction
    setLastTransaction(transaction);
    setSalesHistory([transaction, ...salesHistory]);

    // Clear cart and show receipt
    setShowReceipt(true);
    setCart([]);
    setCashReceived(0);
    setMpesaNumber('');
    setSelectedCustomer(null);
    
    // Auto-print if enabled
    if (autoPrint) {
      setTimeout(() => printReceipt(transaction), 500);
    }
  };

  // Adjust inventory
  const adjustInventory = (productId, change) => {
    setInventory(inventory.map(product =>
      product.id === productId
        ? { ...product, stock: Math.max(0, product.stock + change) }
        : product
    ));
  };

  // Export sales report
  const exportSalesReport = () => {
    const csvContent = [
      ['Transaction ID', 'Date', 'Items', 'Subtotal', 'VAT', 'Total', 'Payment Method'],
      ...salesHistory.map(sale => [
        sale.id,
        new Date(sale.date).toLocaleString(),
        sale.items.length,
        sale.subtotal,
        sale.vat,
        sale.total,
        sale.paymentMethod
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Product Management Functions
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: '',
      price: '',
      stock: '',
      minStock: '',
      sku: '',
    });
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      sku: product.sku,
    });
    setShowProductModal(true);
  };

  const handleProductFormChange = (field, value) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const saveProduct = () => {
    // Validation
    if (!productForm.name || !productForm.category || !productForm.price || !productForm.sku) {
      alert('Please fill in all required fields (Name, Category, Price, SKU)');
      return;
    }

    const price = parseFloat(productForm.price);
    const stock = parseInt(productForm.stock) || 0;
    const minStock = parseInt(productForm.minStock) || 0;

    if (isNaN(price) || price <= 0) {
      alert('Price must be a valid positive number');
      return;
    }

    // Check for duplicate SKU (except when editing)
    const duplicateSku = inventory.find(p => 
      p.sku.toLowerCase() === productForm.sku.toLowerCase() && 
      (!editingProduct || p.id !== editingProduct.id)
    );
    
    if (duplicateSku) {
      alert(`SKU "${productForm.sku}" already exists! Please use a unique SKU.`);
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        setInventory(inventory.map(product =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: productForm.name,
                category: productForm.category,
                price: price,
                stock: stock,
                minStock: minStock,
                sku: productForm.sku,
                storageLocation: productForm.storageLocation || 'Main Store',
                barcode: productForm.barcode || '',
              }
            : product
        ));
        alert('Product updated successfully!');
      } else {
        // Add new product
        const newProduct = {
          id: Date.now(),
          name: productForm.name,
          category: productForm.category,
          price: price,
          stock: stock,
          minStock: minStock,
          sku: productForm.sku,
          storageLocation: productForm.storageLocation || 'Main Store',
          barcode: productForm.barcode || '',
        };
        setInventory([...inventory, newProduct]);
        alert('Product added successfully!');
      }

      setShowProductModal(false);
      setProductForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        minStock: '',
        sku: '',
        storageLocation: 'Main Store',
        barcode: '',
      });
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const deleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setInventory(inventory.filter(product => product.id !== productId));
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const deleteSelectedProducts = () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to delete');
      return;
    }
    
    if (window.confirm(`Delete ${selectedProducts.length} selected product(s)? This action cannot be undone.`)) {
      setInventory(inventory.filter(product => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllProducts = () => {
    if (selectedProducts.length === inventory.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(inventory.map(p => p.id));
    }
  };

  const duplicateProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      sku: `${product.sku}-COPY`,
      name: `${product.name} (Copy)`,
    };
    setInventory([...inventory, newProduct]);
  };

  // Customer Management Functions
  const handleCustomerFormChange = (field, value) => {
    console.log(`Form change - ${field}:`, value);
    setCustomerForm(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      console.log('Updated form state:', updated);
      return updated;
    });
  };

  const calculateLoyaltyTier = (points) => {
    if (points >= 5000) return { tier: 'Platinum', discount: 0.15, color: 'text-purple-400' };
    if (points >= 2000) return { tier: 'Gold', discount: 0.10, color: 'text-yellow-400' };
    if (points >= 500) return { tier: 'Silver', discount: 0.05, color: 'text-zinc-400' };
    return { tier: 'Bronze', discount: 0, color: 'text-orange-400' };
  };

  const addCustomer = () => {
    console.log('addCustomer called');
    console.log('customerForm:', customerForm);
    
    if (!customerForm.name || !customerForm.phone) {
      alert('Name and phone are required');
      console.log('Validation failed - missing name or phone');
      return;
    }

    const newCustomer = {
      id: Date.now(),
      ...customerForm,
      points: 0,
      totalSpent: 0,
      visits: 0,
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
    };

    console.log('Creating new customer:', newCustomer);
    
    setCustomers(prev => {
      const updated = [...prev, newCustomer];
      console.log('Updated customers list:', updated);
      return updated;
    });
    
    setShowCustomerModal(false);
    setCustomerForm({ name: '', phone: '', email: '', address: '' });
    alert('Customer added successfully!');
  };

  const selectCustomerForSale = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerLookup(false);
  };

  const clearSelectedCustomer = () => {
    setSelectedCustomer(null);
  };

  // Barcode Scanner Functions
  const scannerVideoRef = useRef(null);
  const html5QrcodeRef = useRef(null);

  const handleBarcodeScanned = (barcode) => {
    setScannedBarcode(barcode);
    
    // Search for product by barcode
    const product = inventory.find(p => p.barcode === barcode || p.sku === barcode);
    
    if (product) {
      // Product found - add to cart
      addToCart(product);
      setShowScannerModal(false);
      alert(`Added ${product.name} to cart!`);
    } else {
      // Product not found
      alert(`No product found with barcode: ${barcode}\n\nYou can search manually or add a new product with this barcode.`);
      setShowScannerModal(false);
    }
  };

  const startCameraScanner = async () => {
    try {
      if (typeof window !== 'undefined' && window.Html5Qrcode) {
        const Html5Qrcode = window.Html5Qrcode;
        const html5QrCode = new Html5Qrcode("barcode-reader");
        html5QrcodeRef.current = html5QrCode;
        
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            html5QrCode.stop();
            handleBarcodeScanned(decodedText);
          },
          (errorMessage) => {
            // Scanner is scanning, errors are normal
          }
        );
      }
    } catch (err) {
      console.error("Error starting camera scanner:", err);
      alert("Could not access camera. Please check permissions or use USB scanner mode.");
    }
  };

  const stopCameraScanner = () => {
    if (html5QrcodeRef.current) {
      html5QrcodeRef.current.stop().catch(err => console.error("Error stopping scanner:", err));
      html5QrcodeRef.current = null;
    }
  };

  useEffect(() => {
    if (showScannerModal && scannerMode === 'camera') {
      // Load html5-qrcode library dynamically
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
      script.onload = () => {
        setTimeout(startCameraScanner, 500);
      };
      document.body.appendChild(script);
      
      return () => {
        stopCameraScanner();
        document.body.removeChild(script);
      };
    }
  }, [showScannerModal, scannerMode]);

  const handleUSBScan = (e) => {
    if (e.key === 'Enter' && scannedBarcode) {
      handleBarcodeScanned(scannedBarcode);
    }
  };

  // Print Receipt Function
  const printReceipt = (transaction) => {
    const printWindow = window.open('', '', 'width=300,height=600');
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt</title>
        <style>
          @media print {
            @page { margin: 0; size: 80mm auto; }
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            margin: 0;
            padding: 10px;
            width: 80mm;
            background: white;
            color: black;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .large { font-size: 16px; }
          .line { border-top: 1px dashed black; margin: 5px 0; }
          .double-line { border-top: 2px solid black; margin: 5px 0; }
          .row { display: flex; justify-content: space-between; margin: 2px 0; }
          .item-row { margin: 3px 0; }
          .small { font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="center bold large">BUILDPRO HARDWARE</div>
        <div class="center small">Point of Sale System</div>
        <div class="line"></div>
        
        <div class="row small">
          <span>Date: ${new Date(transaction.date).toLocaleDateString()}</span>
          <span>Time: ${new Date(transaction.date).toLocaleTimeString()}</span>
        </div>
        <div class="small">Receipt #: ${transaction.id}</div>
        ${transaction.cashier ? `<div class="small">Cashier: ${transaction.cashier}</div>` : ''}
        
        <div class="double-line"></div>
        
        ${transaction.items.map(item => `
          <div class="item-row">
            <div class="bold">${item.name}</div>
            <div class="row small">
              <span>${item.quantity} x ${Math.round(item.price).toLocaleString()} TZS</span>
              <span class="bold">${Math.round(item.price * item.quantity).toLocaleString()} TZS</span>
            </div>
          </div>
        `).join('')}
        
        <div class="line"></div>
        
        <div class="row">
          <span>Subtotal:</span>
          <span>${Math.round(transaction.subtotal).toLocaleString()} TZS</span>
        </div>
        <div class="row">
          <span>VAT (18%):</span>
          <span>${Math.round(transaction.vat).toLocaleString()} TZS</span>
        </div>
        
        <div class="double-line"></div>
        
        <div class="row bold large">
          <span>TOTAL:</span>
          <span>${Math.round(transaction.total).toLocaleString()} TZS</span>
        </div>
        
        <div class="line"></div>
        
        <div class="row">
          <span>Payment Method:</span>
          <span class="bold">${transaction.paymentMethod.toUpperCase()}</span>
        </div>
        
        ${transaction.paymentMethod === 'cash' && transaction.change > 0 ? `
          <div class="row">
            <span>Cash Received:</span>
            <span>${Math.round(transaction.cashReceived).toLocaleString()} TZS</span>
          </div>
          <div class="row bold">
            <span>Change:</span>
            <span>${Math.round(transaction.change).toLocaleString()} TZS</span>
          </div>
        ` : ''}
        
        <div class="double-line"></div>
        
        <div class="center small">THANK YOU FOR YOUR BUSINESS!</div>
        <div class="center small">Please come again</div>
        
        <div class="line"></div>
        <div class="center small">v4.4.0 - Powered by BuildPro POS</div>
      </body>
      </html>
    `;
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-zinc-950 to-zinc-900 border-b-4 border-yellow-500 shadow-lg">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 text-zinc-900 p-3 rotate-45 transform">
                <Box className="w-8 h-8 -rotate-45" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
                  BuildPro Hardware
                </h1>
                <p className="text-zinc-400 text-sm font-mono">POINT OF SALE SYSTEM v5.0{demoMode ? ' (Demo Mode)' : ''}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* User Info */}
              {userProfile && (
                <div className="px-4 py-2 bg-zinc-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-300">{userProfile.name}</span>
                  <span className="text-xs text-zinc-500">({userProfile.role})</span>
                </div>
              )}
              
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 font-bold uppercase transition-all flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'SW' : 'EN'}
              </button>

              {/* Auto-Print Toggle */}
              <button
                onClick={() => setAutoPrint(!autoPrint)}
                className={`px-4 py-2 font-bold uppercase transition-all flex items-center gap-2 ${
                  autoPrint ? 'bg-green-600 hover:bg-green-500' : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
                title={autoPrint ? 'Auto-print enabled' : 'Auto-print disabled'}
              >
                <Printer className="w-4 h-4" />
                {autoPrint ? 'AUTO' : 'MANUAL'}
              </button>
              
              {/* Logout Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 font-bold uppercase transition-all flex items-center gap-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  {language === 'en' ? 'Logout' : 'Ondoka'}
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setActiveView('pos')}
              className={`px-6 py-3 font-bold uppercase tracking-wide transition-all ${
                activeView === 'pos'
                  ? 'bg-yellow-500 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <ShoppingCart className="inline w-5 h-5 mr-2" />
              {t.pos}
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
              {t.inventory}
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
              {t.analytics}
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={`px-6 py-3 font-bold uppercase tracking-wide transition-all ${
                activeView === 'history'
                  ? 'bg-yellow-500 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <History className="inline w-5 h-5 mr-2" />
              {t.salesHistory}
            </button>
            <button
              onClick={() => setActiveView('customers')}
              className={`px-6 py-3 font-bold uppercase tracking-wide transition-all ${
                activeView === 'customers'
                  ? 'bg-yellow-500 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <Users className="inline w-5 h-5 mr-2" />
              {t.customers}
            </button>
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
                      <p className="font-black text-lg uppercase">{t.itemsInCart}</p>
                      <p className="font-mono text-sm">Click "{t.completeSale}" when ready</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold uppercase">{t.cartTotal}</p>
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
                      placeholder={t.searchProducts}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-yellow-500 focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    onClick={() => setShowScannerModal(true)}
                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-black uppercase transition-colors flex items-center gap-2"
                  >
                    <Scan className="w-5 h-5" />
                    SCAN
                  </button>
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
                        {t.stock}: {product.stock}
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
                <h2 className="text-2xl font-black uppercase">{t.cart}</h2>
                <div className="bg-yellow-500 text-zinc-900 px-3 py-1 rounded-full font-black">
                  {cartItemCount}
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-bold">{t.cartEmpty}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
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

                  {/* Customer Selection */}
                  <div className="border-t-2 border-zinc-700 pt-4 mb-4">
                    {selectedCustomer ? (
                      <div className="bg-zinc-900 p-3 border-l-2 border-yellow-500">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold">{selectedCustomer.name}</p>
                            <p className="text-xs text-zinc-400">{selectedCustomer.phone}</p>
                          </div>
                          <button
                            onClick={clearSelectedCustomer}
                            className="text-zinc-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {(() => {
                          const tier = calculateLoyaltyTier(selectedCustomer.points);
                          return (
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Tier:</span>
                                <span className={`font-bold ${tier.color}`}>{tier.tier}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Points:</span>
                                <span className="font-bold">{selectedCustomer.points}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Discount:</span>
                                <span className="font-bold text-green-400">{(tier.discount * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowCustomerLookup(true)}
                        className="w-full bg-zinc-700 hover:bg-zinc-600 py-2 font-bold uppercase text-sm flex items-center justify-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        ADD CUSTOMER
                      </button>
                    )}
                  </div>

                  <div className="border-t-4 border-zinc-700 pt-4 space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold uppercase">{t.subtotal}</span>
                      <span className="font-mono">{formatTZS(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="font-bold uppercase">{t.vat}</span>
                      <span className="font-mono">{formatTZS(cartVAT)}</span>
                    </div>
                    {selectedCustomer && (() => {
                      const tier = calculateLoyaltyTier(selectedCustomer.points);
                      const discount = cartSubtotal * tier.discount;
                      return discount > 0 ? (
                        <div className="flex justify-between text-lg text-green-400">
                          <span className="font-bold uppercase">DISCOUNT ({tier.tier} {(tier.discount * 100).toFixed(0)}%)</span>
                          <span className="font-mono">-{formatTZS(discount)}</span>
                        </div>
                      ) : null;
                    })()}
                    <div className="flex justify-between items-center text-2xl pt-2 border-t-2 border-zinc-700">
                      <span className="font-black uppercase">{t.total}</span>
                      <span className="font-black text-yellow-500">
                        {selectedCustomer ? (
                          formatTZS(cartTotal - (cartSubtotal * calculateLoyaltyTier(selectedCustomer.points).discount))
                        ) : (
                          formatTZS(cartTotal)
                        )}
                      </span>
                    </div>
                    
                    <button
                      onClick={showPayment}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 py-4 font-black text-xl uppercase tracking-wide transition-colors"
                    >
                      <DollarSign className="inline w-6 h-6 mr-2" />
                      {t.completeSale}
                    </button>
                    
                    <button
                      onClick={() => setCart([])}
                      className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 py-3 font-bold uppercase tracking-wide transition-colors"
                    >
                      <Trash2 className="inline w-5 h-5 mr-2" />
                      {t.clearCart}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeView === 'history' && (
          <div className="space-y-6">
            {/* Sales Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 border-l-4 border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <Receipt className="w-8 h-8 text-blue-950" />
                  <span className="text-blue-950 font-mono text-sm">TODAY</span>
                </div>
                <p className="text-4xl font-black text-blue-950">{todaySales.length}</p>
                <p className="text-blue-950 font-bold uppercase text-sm mt-1">{t.todaySales}</p>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 border-l-4 border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-950" />
                  <span className="text-green-950 font-mono text-sm">REVENUE</span>
                </div>
                <p className="text-3xl font-black text-green-950">{formatTZS(todayRevenue)}</p>
                <p className="text-green-950 font-bold uppercase text-sm mt-1">{t.totalRevenue}</p>
              </div>

              <div className="bg-zinc-800 p-6 border-l-4 border-yellow-500 flex items-center justify-center">
                <button
                  onClick={exportSalesReport}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 py-3 px-6 font-black uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  {t.exportReport}
                </button>
              </div>
            </div>

            {/* Sales History Table */}
            <div className="bg-zinc-800 border-l-4 border-yellow-500">
              <div className="p-6 border-b border-zinc-700">
                <h2 className="text-2xl font-black uppercase">{t.salesHistory}</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900">
                    <tr className="text-left">
                      <th className="p-4 font-black uppercase text-sm">{t.transactionId}</th>
                      <th className="p-4 font-black uppercase text-sm">{t.date}</th>
                      <th className="p-4 font-black uppercase text-sm">Items</th>
                      <th className="p-4 font-black uppercase text-sm text-right">{t.subtotal}</th>
                      <th className="p-4 font-black uppercase text-sm text-right">{t.vat}</th>
                      <th className="p-4 font-black uppercase text-sm text-right">{t.total}</th>
                      <th className="p-4 font-black uppercase text-sm">{t.paymentMethod}</th>
                      <th className="p-4 font-black uppercase text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesHistory.map((sale, idx) => (
                      <tr
                        key={sale.id}
                        className={`border-b border-zinc-700 ${
                          idx % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-850'
                        } hover:bg-zinc-750 transition-colors`}
                      >
                        <td className="p-4 font-mono text-sm text-zinc-400">{sale.id}</td>
                        <td className="p-4 text-sm">{new Date(sale.date).toLocaleString()}</td>
                        <td className="p-4 font-bold">{sale.items.length}</td>
                        <td className="p-4 text-right font-mono">{formatTZS(sale.subtotal)}</td>
                        <td className="p-4 text-right font-mono">{formatTZS(sale.vat)}</td>
                        <td className="p-4 text-right font-black text-yellow-500">{formatTZS(sale.total)}</td>
                        <td className="p-4 uppercase font-bold">
                          <span className={`px-2 py-1 text-xs ${
                            sale.paymentMethod === 'cash' ? 'bg-green-900 text-green-300' :
                            sale.paymentMethod === 'mpesa' ? 'bg-blue-900 text-blue-300' :
                            'bg-purple-900 text-purple-300'
                          }`}>
                            {sale.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => printReceipt(sale)}
                            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold uppercase text-xs flex items-center gap-1"
                            title="Reprint receipt"
                          >
                            <Printer className="w-4 h-4" />
                            PRINT
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  <h2 className="text-xl font-black uppercase">{t.lowStockAlert}</h2>
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
                        {t.stock}: {item.stock} / Min: {item.minStock}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Table */}
            <div className="bg-zinc-800 border-l-4 border-yellow-500">
              <div className="p-6 border-b border-zinc-700 flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-black uppercase">{t.inventory} Management</h2>
                <div className="flex gap-2 flex-wrap">
                  {selectedProducts.length > 0 && (
                    <>
                      <span className="px-4 py-2 bg-zinc-700 text-zinc-300 font-bold rounded">
                        {selectedProducts.length} {t.productsSelected}
                      </span>
                      <button
                        onClick={deleteSelectedProducts}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold uppercase transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        {t.deleteSelected}
                      </button>
                    </>
                  )}
                  <button
                    onClick={openAddProduct}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-black uppercase transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {t.addProduct}
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900">
                    <tr className="text-left">
                      <th className="p-4 w-12">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === inventory.length && inventory.length > 0}
                          onChange={toggleAllProducts}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </th>
                      <th className="p-4 font-black uppercase text-sm">SKU</th>
                      <th className="p-4 font-black uppercase text-sm">Product</th>
                      <th className="p-4 font-black uppercase text-sm">Category</th>
                      <th className="p-4 font-black uppercase text-sm text-right">Price</th>
                      <th className="p-4 font-black uppercase text-sm text-right">{t.stock}</th>
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
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
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
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditProduct(product)}
                              className="bg-blue-600 hover:bg-blue-500 p-2 transition-colors"
                              title="Edit Product"
                            >
                              <Search className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicateProduct(product)}
                              className="bg-zinc-700 hover:bg-zinc-600 p-2 transition-colors"
                              title="Duplicate"
                            >
                              <Package className="w-4 h-4" />
                            </button>
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
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="bg-red-600 hover:bg-red-500 p-2 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
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
          <div className="space-y-6">
            {/* Sales Analytics Section */}
            <div className="bg-zinc-800 border-l-4 border-yellow-500 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase">Sales Analytics</h2>
                <button
                  onClick={() => {
                    const analytics = {
                      totalRevenue: salesHistory.reduce((sum, sale) => sum + sale.total, 0),
                      totalSales: salesHistory.length,
                      avgSale: salesHistory.length > 0 ? salesHistory.reduce((sum, sale) => sum + sale.total, 0) / salesHistory.length : 0,
                      products: {},
                      categories: {},
                      paymentMethods: { cash: 0, card: 0, mpesa: 0 }
                    };
                    
                    salesHistory.forEach(sale => {
                      // Payment methods
                      analytics.paymentMethods[sale.paymentMethod] = (analytics.paymentMethods[sale.paymentMethod] || 0) + sale.total;
                      
                      // Products
                      sale.items.forEach(item => {
                        if (!analytics.products[item.name]) {
                          analytics.products[item.name] = { revenue: 0, quantity: 0, orders: 0 };
                        }
                        analytics.products[item.name].revenue += item.price * item.quantity;
                        analytics.products[item.name].quantity += item.quantity;
                        analytics.products[item.name].orders += 1;
                      });
                    });
                    
                    const csv = [
                      ['BuildPro Hardware - Sales Analytics'],
                      ['Generated:', new Date().toLocaleString()],
                      [''],
                      ['OVERVIEW'],
                      ['Total Revenue', `TZS ${Math.round(analytics.totalRevenue).toLocaleString()}`],
                      ['Total Transactions', analytics.totalSales],
                      ['Average Transaction', `TZS ${Math.round(analytics.avgSale).toLocaleString()}`],
                      [''],
                      ['TOP PRODUCTS'],
                      ['Product', 'Revenue', 'Quantity', 'Orders'],
                      ...Object.entries(analytics.products)
                        .sort((a, b) => b[1].revenue - a[1].revenue)
                        .slice(0, 10)
                        .map(([name, data]) => [
                          name,
                          `TZS ${Math.round(data.revenue).toLocaleString()}`,
                          data.quantity,
                          data.orders
                        ]),
                      [''],
                      ['PAYMENT METHODS'],
                      ['Method', 'Revenue', 'Percentage'],
                      ...Object.entries(analytics.paymentMethods).map(([method, amount]) => [
                        method.toUpperCase(),
                        `TZS ${Math.round(amount).toLocaleString()}`,
                        `${((amount / analytics.totalRevenue) * 100).toFixed(1)}%`
                      ])
                    ];
                    
                    const csvContent = csv.map(row => row.join(',')).join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold uppercase flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              {/* Sales Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-green-950" />
                    <span className="text-green-950 font-mono text-sm">REVENUE</span>
                  </div>
                  <p className="text-3xl font-black text-green-950">
                    {formatTZS(salesHistory.reduce((sum, sale) => sum + sale.total, 0))}
                  </p>
                  <p className="text-green-950 font-bold uppercase text-sm mt-1">Total Sales Revenue</p>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingCart className="w-8 h-8 text-blue-950" />
                    <span className="text-blue-950 font-mono text-sm">TRANSACTIONS</span>
                  </div>
                  <p className="text-4xl font-black text-blue-950">{salesHistory.length}</p>
                  <p className="text-blue-950 font-bold uppercase text-sm mt-1">Total Sales</p>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Receipt className="w-8 h-8 text-purple-950" />
                    <span className="text-purple-950 font-mono text-sm">AVERAGE</span>
                  </div>
                  <p className="text-3xl font-black text-purple-950">
                    {formatTZS(salesHistory.length > 0 ? salesHistory.reduce((sum, sale) => sum + sale.total, 0) / salesHistory.length : 0)}
                  </p>
                  <p className="text-purple-950 font-bold uppercase text-sm mt-1">Avg Transaction</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 text-yellow-900" />
                    <span className="text-yellow-900 font-mono text-sm">BEST SELLER</span>
                  </div>
                  <p className="text-xl font-black text-yellow-900">
                    {(() => {
                      const products = {};
                      salesHistory.forEach(sale => {
                        sale.items.forEach(item => {
                          products[item.name] = (products[item.name] || 0) + (item.price * item.quantity);
                        });
                      });
                      const best = Object.entries(products).sort((a, b) => b[1] - a[1])[0];
                      return best ? best[0].substring(0, 15) + (best[0].length > 15 ? '...' : '') : 'N/A';
                    })()}
                  </p>
                  <p className="text-yellow-900 font-bold uppercase text-sm mt-1">Top Product</p>
                </div>
              </div>

              {/* Top 10 Products */}
              <div className="bg-zinc-900 p-6 mb-6">
                <h3 className="text-xl font-black uppercase mb-4 text-yellow-500">Top 10 Products by Revenue</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zinc-800">
                      <tr className="text-left">
                        <th className="p-3 font-black uppercase text-sm">Rank</th>
                        <th className="p-3 font-black uppercase text-sm">Product</th>
                        <th className="p-3 font-black uppercase text-sm text-right">Revenue</th>
                        <th className="p-3 font-black uppercase text-sm text-right">Qty Sold</th>
                        <th className="p-3 font-black uppercase text-sm text-right">Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const products = {};
                        salesHistory.forEach(sale => {
                          sale.items.forEach(item => {
                            if (!products[item.name]) {
                              products[item.name] = { revenue: 0, quantity: 0, orders: 0 };
                            }
                            products[item.name].revenue += item.price * item.quantity;
                            products[item.name].quantity += item.quantity;
                            products[item.name].orders += 1;
                          });
                        });
                        return Object.entries(products)
                          .sort((a, b) => b[1].revenue - a[1].revenue)
                          .slice(0, 10)
                          .map(([name, data], idx) => (
                            <tr key={name} className="border-b border-zinc-800 hover:bg-zinc-800">
                              <td className="p-3 font-bold text-yellow-500">#{idx + 1}</td>
                              <td className="p-3 font-bold">{name}</td>
                              <td className="p-3 text-right font-mono text-green-500">{formatTZS(data.revenue)}</td>
                              <td className="p-3 text-right font-mono">{data.quantity}</td>
                              <td className="p-3 text-right font-mono">{data.orders}</td>
                            </tr>
                          ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="bg-zinc-900 p-6">
                <h3 className="text-xl font-black uppercase mb-4 text-yellow-500">Payment Methods</h3>
                <div className="space-y-3">
                  {(() => {
                    const totals = { cash: 0, card: 0, mpesa: 0 };
                    salesHistory.forEach(sale => {
                      totals[sale.paymentMethod] = (totals[sale.paymentMethod] || 0) + sale.total;
                    });
                    const grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);
                    
                    return Object.entries(totals).map(([method, amount]) => {
                      const percentage = grandTotal > 0 ? (amount / grandTotal) * 100 : 0;
                      return (
                        <div key={method} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold uppercase">{method}</span>
                            <span className="font-mono">{formatTZS(amount)} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-3">
                            <div 
                              className={`h-full ${
                                method === 'cash' ? 'bg-green-600' : 
                                method === 'card' ? 'bg-blue-600' : 
                                'bg-purple-600'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Inventory Analytics Section (Existing) */}
            <div className="bg-zinc-800 border-l-4 border-yellow-500 p-6">
              <h2 className="text-2xl font-black uppercase mb-6">Inventory Analytics</h2>
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
              <p className="text-yellow-900 font-bold uppercase text-sm mt-1">Units in {t.stock}</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 border-l-4 border-green-800">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-green-950" />
                <span className="text-green-950 font-mono text-sm">VALUE</span>
              </div>
              <p className="text-3xl font-black text-green-950">
                {formatTZS(inventory.reduce((sum, item) => sum + (item.price * item.stock), 0))}
              </p>
              <p className="text-green-950 font-bold uppercase text-sm mt-1">{t.inventory} Value</p>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 border-l-4 border-red-800">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8 text-red-950" />
                <span className="text-red-950 font-mono text-sm">ALERTS</span>
              </div>
              <p className="text-4xl font-black text-red-950">{lowStockItems.length}</p>
              <p className="text-red-950 font-bold uppercase text-sm mt-1">Low {t.stock} Items</p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 border-l-4 border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <Box className="w-8 h-8 text-blue-950" />
                <span className="text-blue-950 font-mono text-sm">PRODUCTS</span>
              </div>
              <p className="text-4xl font-black text-blue-950">{inventory.length}</p>
              <p className="text-blue-950 font-bold uppercase text-sm mt-1">Total Products</p>
            </div>
            </div>

            {/* Category Breakdown */}
            <div className="mt-6">
              <h3 className="text-xl font-black uppercase mb-4 text-yellow-500">Category Breakdown</h3>
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
          </div>
        )}

        {/* Customers View */}
        {activeView === 'customers' && (
          <div className="space-y-6">
            {/* Customers Header */}
            <div className="bg-zinc-800 border-l-4 border-yellow-500 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-black uppercase mb-2">CUSTOMER MANAGEMENT</h2>
                  <p className="text-zinc-400">Manage customers and loyalty rewards</p>
                </div>
                <button
                  onClick={() => setShowCustomerModal(true)}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-black uppercase flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  ADD CUSTOMER
                </button>
              </div>
            </div>

            {/* Loyalty Tiers Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-4 border-l-4 border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-orange-950" />
                  <h3 className="font-black uppercase text-orange-950">BRONZE</h3>
                </div>
                <p className="text-sm text-orange-950">0-499 points</p>
                <p className="text-xl font-black text-orange-950 mt-2">0% Discount</p>
              </div>

              <div className="bg-gradient-to-br from-zinc-400 to-zinc-500 p-4 border-l-4 border-zinc-600">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-zinc-900" />
                  <h3 className="font-black uppercase text-zinc-900">SILVER</h3>
                </div>
                <p className="text-sm text-zinc-900">500-1,999 points</p>
                <p className="text-xl font-black text-zinc-900 mt-2">5% Discount</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 border-l-4 border-yellow-600">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-yellow-900" />
                  <h3 className="font-black uppercase text-yellow-900">GOLD</h3>
                </div>
                <p className="text-sm text-yellow-900">2,000-4,999 points</p>
                <p className="text-xl font-black text-yellow-900 mt-2">10% Discount</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 border-l-4 border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-purple-950" />
                  <h3 className="font-black uppercase text-purple-950">PLATINUM</h3>
                </div>
                <p className="text-sm text-purple-950">5,000+ points</p>
                <p className="text-xl font-black text-purple-950 mt-2">15% Discount</p>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-zinc-800 border-l-4 border-yellow-500">
              <div className="p-6 border-b border-zinc-700">
                <h2 className="text-2xl font-black uppercase">CUSTOMERS ({customers.length})</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900">
                    <tr className="text-left">
                      <th className="p-4 font-black uppercase text-sm">Name</th>
                      <th className="p-4 font-black uppercase text-sm">Phone</th>
                      <th className="p-4 font-black uppercase text-sm">Email</th>
                      <th className="p-4 font-black uppercase text-sm">Tier</th>
                      <th className="p-4 font-black uppercase text-sm text-right">Points</th>
                      <th className="p-4 font-black uppercase text-sm text-right">Total Spent</th>
                      <th className="p-4 font-black uppercase text-sm text-right">Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-zinc-500">
                          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="font-bold">No customers yet</p>
                          <p className="text-sm mt-2">Add your first customer to get started</p>
                        </td>
                      </tr>
                    ) : (
                      customers.map((customer, idx) => {
                        const tier = calculateLoyaltyTier(customer.points);
                        return (
                          <tr
                            key={customer.id}
                            className={`border-b border-zinc-700 ${
                              idx % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-850'
                            } hover:bg-zinc-750 transition-colors`}
                          >
                            <td className="p-4 font-bold">{customer.name}</td>
                            <td className="p-4 font-mono text-sm">{customer.phone}</td>
                            <td className="p-4 text-sm">{customer.email || '-'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 text-xs font-black ${tier.color}`}>
                                {tier.tier}
                              </span>
                            </td>
                            <td className="p-4 text-right font-mono font-bold">{customer.points}</td>
                            <td className="p-4 text-right font-mono">{formatTZS(customer.totalSpent)}</td>
                            <td className="p-4 text-right font-bold">{customer.visits}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 text-zinc-100 max-w-md w-full p-8 relative border-l-4 border-yellow-500 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-black uppercase mb-6">{t.payment}</h2>

            <div className="mb-6">
              <div className="space-y-2 mb-6 pb-4 border-b-2 border-zinc-700">
                <div className="flex justify-between text-lg">
                  <span className="font-bold uppercase">{t.subtotal}</span>
                  <span className="font-mono">{formatTZS(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold uppercase">{t.vat}</span>
                  <span className="font-mono">{formatTZS(cartVAT)}</span>
                </div>
                <div className="flex justify-between items-center text-2xl pt-2 border-t border-zinc-700">
                  <span className="font-black uppercase">{t.total}</span>
                  <span className="font-black text-yellow-500">{formatTZS(cartTotal)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase">{t.paymentMethod}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {setPaymentMethod('cash'); setMpesaNumber('');}}
                      className={`py-3 px-4 font-bold uppercase transition-all ${
                        paymentMethod === 'cash' ? 'bg-yellow-500 text-zinc-900' : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      {t.cash}
                    </button>
                    <button
                      onClick={() => {setPaymentMethod('card'); setMpesaNumber('');}}
                      className={`py-3 px-4 font-bold uppercase transition-all ${
                        paymentMethod === 'card' ? 'bg-yellow-500 text-zinc-900' : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      {t.card}
                    </button>
                    <button
                      onClick={() => {setPaymentMethod('mpesa'); setCashReceived(0);}}
                      className={`py-3 px-4 font-bold uppercase transition-all ${
                        paymentMethod === 'mpesa' ? 'bg-yellow-500 text-zinc-900' : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      {t.mpesa}
                    </button>
                  </div>
                </div>

                {paymentMethod === 'cash' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2 uppercase">{t.cashReceived}</label>
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
                          className="py-2 bg-zinc-700 hover:bg-zinc-600 font-mono font-bold transition-colors text-sm"
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
                          <span className="font-bold">{t.cashReceived}:</span>
                          <span className="font-black font-mono">{formatTZS(cashReceived)}</span>
                        </div>
                        {cashReceived >= cartTotal ? (
                          <div className="flex justify-between text-lg">
                            <span className="font-bold text-green-500">{t.change}:</span>
                            <span className="font-black font-mono text-green-500">
                              {formatTZS(cashReceived - cartTotal)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-between text-lg">
                            <span className="font-bold text-red-500">{t.remaining}:</span>
                            <span className="font-black font-mono text-red-500">
                              {formatTZS(cartTotal - cashReceived)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {paymentMethod === 'mpesa' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2 uppercase">{t.enterPhone}</label>
                      <input
                        type="tel"
                        value={mpesaNumber}
                        onChange={(e) => setMpesaNumber(e.target.value)}
                        placeholder="255XXXXXXXXX"
                        className="w-full p-3 bg-zinc-900 border-2 border-zinc-700 text-zinc-100 font-mono text-lg focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                    {mpesaNumber && (
                      <div className="bg-zinc-900 p-4 border-l-2 border-green-500">
                        <p className="text-center font-bold text-green-500">{t.readyToProcess} M-Pesa payment</p>
                        <p className="text-center text-sm text-zinc-400 mt-2">Amount: {formatTZS(cartTotal)}</p>
                      </div>
                    )}
                  </>
                )}

                {paymentMethod === 'card' && (
                  <div className="bg-zinc-900 p-4 border-l-2 border-green-500">
                    <p className="text-center font-bold text-green-500">{t.readyToProcess} card payment</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={processPayment}
                disabled={
                  (paymentMethod === 'cash' && cashReceived < cartTotal) ||
                  (paymentMethod === 'mpesa' && !mpesaNumber)
                }
                className={`w-full bg-yellow-500 hover:bg-yellow-400 text-zinc-900 py-4 font-black text-xl uppercase tracking-wide transition-colors ${
                  ((paymentMethod === 'cash' && cashReceived < cartTotal) || (paymentMethod === 'mpesa' && !mpesaNumber)) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {t.processSale}
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full bg-zinc-700 hover:bg-zinc-600 py-3 font-bold uppercase transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-zinc-900 max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReceipt(false)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-900"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6 pb-6 border-b-2 border-dashed border-zinc-400">
              <h2 className="text-3xl font-black uppercase mb-2">BuildPro Hardware</h2>
              <p className="text-sm text-zinc-600 font-mono">{t.receipt}</p>
              <p className="text-xs text-zinc-500 font-mono mt-2">
                {new Date(lastTransaction.date).toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 font-mono">
                {t.transactionId}: {lastTransaction.id}
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

            <div className="border-t-2 border-dashed border-zinc-400 pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-bold uppercase">{t.subtotal}</span>
                <span className="font-mono">{formatTZS(lastTransaction.subtotal)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-bold uppercase">{t.vat}</span>
                <span className="font-mono">{formatTZS(lastTransaction.vat)}</span>
              </div>
              <div className="flex justify-between text-2xl mb-2 pt-2 border-t border-zinc-300">
                <span className="font-black uppercase">{t.total}</span>
                <span className="font-black">{formatTZS(lastTransaction.total)}</span>
              </div>
              {lastTransaction.paymentMethod === 'cash' && lastTransaction.change > 0 && (
                <div className="text-sm space-y-1 mt-3 pt-3 border-t border-zinc-300">
                  <div className="flex justify-between">
                    <span>{t.cashReceived}:</span>
                    <span className="font-bold">{formatTZS(lastTransaction.cashReceived)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>{t.change}:</span>
                    <span className="font-bold">{formatTZS(lastTransaction.change)}</span>
                  </div>
                </div>
              )}
            {lastTransaction.paymentMethod === 'mpesa' && (
                <div className="text-sm pt-3 border-t border-zinc-300">
                  <p className="text-center font-bold">M-Pesa: {lastTransaction.mpesaNumber}</p>
                </div>
              )}
              <p className="text-center text-xs text-zinc-600 font-mono mt-4">
                {t.thankYou}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => printReceipt(lastTransaction)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 py-3 font-bold uppercase transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                PRINT
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-3 font-bold uppercase transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

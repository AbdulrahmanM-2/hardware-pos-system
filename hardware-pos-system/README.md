# BuildPro Hardware - POS System

A modern, industrial-themed Point of Sale system designed for hardware and building materials stores in Tanzania. Features real-time inventory management, sales tracking, comprehensive analytics, and TZS currency support.

![Hardware POS System](https://img.shields.io/badge/React-18.2-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![Vite](https://img.shields.io/badge/Vite-5.0-646cff)

## ✨ Features

### Point of Sale
- **TZS Currency Support** - All prices in Tanzanian Shillings with proper formatting
- **Fast Checkout** - Quick product search with category filtering
- **Quick Add Buttons** - Add 1, 5, or 10 units instantly
- **Real-time Cart Summary** - Live cart total and item count display
- **Smart Payment Processing** - Cash and card payment options
- **Change Calculator** - Automatic change calculation for cash payments
- **Transaction Receipts** - Professional printable receipts with payment details

### Inventory Management
- **Stock Tracking** - Real-time inventory updates
- **Bulk Adjustments** - Quick +/-10 unit adjustments
- **SKU Management** - Unique SKU for every product
- **Category Organization** - Products organized by category
- **Low Stock Alerts** - Automatic alerts when items reach minimum threshold

### Analytics Dashboard
- **Inventory Value** - Total stock value in TZS
- **Category Breakdown** - Stock and value by category
- **Stock Alerts** - Visual alerts for low-stock items
- **Key Metrics** - Total units, products, and alerts

### Enhanced Cart Features
- **Bulk Add** - Add multiple quantities with one click (+1, +5, +10)
- **Cart Summary Bar** - Always-visible cart status when items are added
- **Payment Modal** - Professional payment processing interface
- **Cash Quick Buttons** - TZS 50,000 | 20,000 | 10,000 | 5,000 | 2,000 | 1,000
- **Change Calculation** - Automatic calculation and display of change
- **Payment Method Selection** - Choose between cash or card payment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/hardware-pos-system.git
cd hardware-pos-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite - just click "Deploy"

### Option 2: Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy"

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
},
"homepage": "https://yourusername.github.io/hardware-pos-system"
```

3. Deploy:
```bash
npm run deploy
```

### Option 4: Traditional Hosting

1. Build the project:
```bash
npm run build
```

2. Upload the `dist/` folder to your web server

## 🏗️ Project Structure

```
hardware-pos-system/
├── src/
│   ├── App.jsx           # Main POS application
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # This file
```

## 🎨 Pre-loaded Data

The system comes with 20 sample products across 10 categories:
- Lumber
- Concrete
- Steel
- Drywall
- Paint
- Fasteners
- Plumbing
- Electrical
- Insulation
- Roofing
- Tools
- Safety

## 🔧 Customization

### Adding Products

Edit the `initialInventory` array in `src/App.jsx`:

```javascript
const initialInventory = [
  {
    id: 1,
    name: 'Product Name',
    category: 'Category',
    price: 9.99,
    stock: 100,
    minStock: 20,
    sku: 'SKU-001'
  },
  // Add more products...
];
```

### Changing Theme Colors

Edit `src/App.jsx` and modify the Tailwind classes:
- Primary color: `yellow-500` (currently safety yellow)
- Background: `zinc-900` (dark gray)
- Borders: `zinc-700` (medium gray)

### Adding Backend Integration

Currently uses in-memory state. For production, integrate with:
- **REST API** - Connect to your backend server
- **Firebase** - Real-time database
- **Supabase** - PostgreSQL with real-time subscriptions
- **MongoDB** - Document database

Example API integration:
```javascript
// Fetch inventory
const response = await fetch('https://your-api.com/inventory');
const inventory = await response.json();
setInventory(inventory);

// Save transaction
await fetch('https://your-api.com/transactions', {
  method: 'POST',
  body: JSON.stringify(transaction)
});
```

## 📱 Features to Add

- [ ] Barcode scanner integration
- [ ] Customer management
- [ ] Multi-user authentication
- [ ] Receipt printing
- [ ] Sales reports & exports
- [ ] Multi-location inventory
- [ ] Purchase orders
- [ ] Supplier management
- [ ] Tax calculations
- [ ] Payment processing integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your business.

## 🆘 Support

For issues or questions, please open an issue on GitHub.

---

**Built with React + Vite + Tailwind CSS**

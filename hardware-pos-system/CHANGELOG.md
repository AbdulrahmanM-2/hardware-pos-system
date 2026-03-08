# Changelog

All notable changes to the BuildPro Hardware POS System will be documented in this file.

## [3.0.0] - 2026-03-08

### 🎉 Major Production Release

### Added
- **Multi-Language Support (English/Swahili)**
  - Complete UI translation system
  - Language toggle in header
  - Persistent language preference
  - All labels, buttons, and messages translated
  
- **Sales History & Analytics**
  - Complete transaction history table
  - Daily sales summary
  - Today's revenue tracking
  - Transaction search and filtering
  - Sales count by date
  
- **CSV Export Functionality**
  - Export sales reports to CSV
  - Includes: Transaction ID, Date, Items, Subtotal, VAT, Total, Payment Method
  - Perfect for accounting and tax filing
  
- **VAT Calculation System**
  - Automatic 18% VAT calculation (Tanzania standard)
  - Subtotal displayed separately
  - VAT amount shown on cart and receipts
  - Tax-compliant receipts
  
- **M-Pesa Payment Integration (UI)**
  - M-Pesa as payment option
  - Phone number capture for M-Pesa transactions
  - M-Pesa details on receipts
  - Ready for backend API integration
  
- **Data Persistence with LocalStorage**
  - Inventory automatically saved
  - Sales history preserved
  - Language preference remembered
  - No data loss on page refresh
  
- **Enhanced Receipt System**
  - Subtotal, VAT, and Total breakdown
  - Payment method displayed
  - M-Pesa number shown for M-Pesa payments
  - Multi-language receipts
  
- **New Sales History View**
  - Dedicated tab for viewing all transactions
  - Today's sales summary cards
  - Revenue tracking
  - Export button for reports

### Changed
- Version bumped to 3.0.0
- Enhanced payment modal with 3 payment methods
- Improved navigation with Sales History tab
- Updated all currency displays to include VAT
- Enhanced receipt format with tax breakdown

### Fixed
- Payment validation improved
- M-Pesa number validation added
- Export functionality edge cases

## [2.1.0] - 2026-03-08

### Added
- **TZS Currency Support** - All prices converted to Tanzanian Shillings
  - Professional formatting with comma separators (e.g., "TZS 22,000")
  - Realistic hardware pricing for Tanzania market
  
- **Enhanced Cart Functionality**
  - Quick add buttons (+1, +5, +10) on every product card
  - Bulk quantity additions without multiple clicks
  - Cart summary bar showing total items and value
  - Stock validation prevents over-ordering
  
- **Advanced Payment Processing**
  - Payment modal before completing sale
  - Cash payment with custom amount entry
  - Quick cash buttons: TZS 50,000 | 20,000 | 10,000 | 5,000 | 2,000 | 1,000
  - Automatic change calculation
  - Remaining amount indicator for insufficient cash
  - Card payment option with one-click processing
  
- **Enhanced Receipts**
  - Payment method displayed on receipt
  - Cash payments show amount received and change given
  - Professional Tanzania business receipt format
  - Transaction ID tracking

### Changed
- Updated all currency displays from USD to TZS
- Improved cart user experience with summary bar
- Enhanced product cards with quick action buttons
- Version bumped to 2.1.0

### Fixed
- Cart quantity validation against stock levels
- Payment processing flow improvements

## [1.0.0] - 2026-03-08

### Initial Release
- Point of Sale system with cart management
- Inventory tracking and management
- Analytics dashboard
- Low stock alerts
- Transaction receipts
- 20 pre-loaded hardware products
- Product search and category filtering
- Industrial design theme

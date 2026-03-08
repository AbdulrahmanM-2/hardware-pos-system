# Changelog

All notable changes to the BuildPro Hardware POS System will be documented in this file.

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

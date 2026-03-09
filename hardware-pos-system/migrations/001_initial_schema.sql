-- =====================================================
-- BUILDPRO HARDWARE POS - SUPABASE DATABASE SCHEMA
-- Version: 4.0
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (Staff/Employees)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'cashier',
  -- Roles: 'admin', 'manager', 'cashier', 'stock_manager'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STORAGE LOCATIONS TABLE
-- =====================================================
CREATE TABLE storage_locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  capacity INTEGER,
  current_usage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default storage locations
INSERT INTO storage_locations (name, description, capacity) VALUES
  ('Main Store', 'Retail floor display area', 1000),
  ('Warehouse A', 'Primary bulk storage', 5000),
  ('Warehouse B', 'Overflow and seasonal storage', 3000),
  ('Back Room', 'Quick access stock room', 500),
  ('External Storage', 'Off-site storage facility', 10000);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(100),
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  storage_location_id INTEGER REFERENCES storage_locations(id),
  storage_location VARCHAR(100) DEFAULT 'Main Store',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- =====================================================
-- CUSTOMERS TABLE
-- =====================================================
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  phone VARCHAR(50) UNIQUE,
  email VARCHAR(255),
  loyalty_points INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'Bronze',
  -- Tiers: Bronze, Silver, Gold, Platinum
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- SALES TABLE
-- =====================================================
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  sale_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  cashier_id UUID REFERENCES users(id),
  cashier_name VARCHAR(255),
  subtotal DECIMAL(10,2) NOT NULL,
  vat DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  -- Payment methods: 'cash', 'card', 'mpesa'
  mpesa_number VARCHAR(50),
  cash_received DECIMAL(10,2),
  change_given DECIMAL(10,2),
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SALE ITEMS TABLE
-- =====================================================
CREATE TABLE sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STOCK MOVEMENTS TABLE (Audit Trail)
-- =====================================================
CREATE TABLE stock_movements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  type VARCHAR(50) NOT NULL,
  -- Types: 'sale', 'adjustment', 'return', 'transfer', 'initial'
  quantity INTEGER NOT NULL,
  -- Positive = stock in, Negative = stock out
  from_location VARCHAR(100),
  to_location VARCHAR(100),
  reference_id INTEGER,
  -- References sale_id or other transaction
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS VIEWS
-- =====================================================

-- Daily Sales Summary
CREATE VIEW daily_sales_summary AS
SELECT 
  DATE(created_at) as sale_date,
  COUNT(*) as total_transactions,
  SUM(total) as total_revenue,
  SUM(subtotal) as total_before_vat,
  SUM(vat) as total_vat,
  AVG(total) as average_transaction,
  STRING_AGG(DISTINCT payment_method, ', ') as payment_methods_used
FROM sales
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

-- Product Performance
CREATE VIEW product_performance AS
SELECT 
  p.id,
  p.name,
  p.sku,
  p.category,
  p.price,
  p.stock,
  COUNT(si.id) as times_sold,
  SUM(si.quantity) as total_quantity_sold,
  SUM(si.subtotal) as total_revenue,
  (p.price - COALESCE(p.cost_price, 0)) as profit_per_unit,
  (p.price - COALESCE(p.cost_price, 0)) * SUM(si.quantity) as total_profit
FROM products p
LEFT JOIN sale_items si ON p.id = si.product_id
GROUP BY p.id, p.name, p.sku, p.category, p.price, p.stock, p.cost_price
ORDER BY total_revenue DESC NULLS LAST;

-- Low Stock Alert View
CREATE VIEW low_stock_products AS
SELECT 
  id,
  name,
  sku,
  category,
  stock,
  min_stock,
  storage_location,
  (min_stock - stock) as shortage
FROM products
WHERE stock <= min_stock
ORDER BY shortage DESC;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update product updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update customer stats after sale
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL THEN
    UPDATE customers
    SET 
      total_spent = total_spent + NEW.total,
      total_orders = total_orders + 1,
      last_visit = NEW.created_at,
      loyalty_points = loyalty_points + NEW.points_earned,
      tier = CASE
        WHEN loyalty_points + NEW.points_earned >= 5000 THEN 'Platinum'
        WHEN loyalty_points + NEW.points_earned >= 2000 THEN 'Gold'
        WHEN loyalty_points + NEW.points_earned >= 500 THEN 'Silver'
        ELSE 'Bronze'
      END
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_stats_trigger
  AFTER INSERT ON sales
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_stats();

-- Auto-create stock movement on sale
CREATE OR REPLACE FUNCTION create_stock_movement_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO stock_movements (
    product_id,
    type,
    quantity,
    reference_id,
    notes,
    created_at
  )
  SELECT 
    product_id,
    'sale',
    -quantity,
    NEW.sale_id,
    'Sold in transaction ' || (SELECT sale_number FROM sales WHERE id = NEW.sale_id),
    NOW()
  FROM sale_items
  WHERE sale_id = NEW.sale_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

-- Admins can read all users
CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

-- Everyone can read products
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

-- Only managers and admins can modify products
CREATE POLICY "Managers can modify products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Everyone can read customers
CREATE POLICY "Anyone can read customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

-- Cashiers and above can create customers
CREATE POLICY "Cashiers can create customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND active = true
    )
  );

-- Everyone can create sales
CREATE POLICY "Anyone can create sales"
  ON sales FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND active = true
    )
  );

-- Everyone can read sales
CREATE POLICY "Anyone can read sales"
  ON sales FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_storage ON products(storage_location);
CREATE INDEX idx_sales_date ON sales(created_at);
CREATE INDEX idx_sales_cashier ON sales(cashier_id);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(created_at);

-- =====================================================
-- INITIAL ADMIN USER
-- =====================================================
-- Note: You need to create the auth user first in Supabase Auth UI
-- Then insert into users table with that auth_id

-- Example (replace with your actual auth user ID):
-- INSERT INTO users (auth_id, email, name, role)
-- VALUES (
--   'your-auth-uid-from-supabase',
--   'admin@buildpro.com',
--   'System Admin',
--   'admin'
-- );

-- =====================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Function to get product with stock info
CREATE OR REPLACE FUNCTION get_product_details(product_sku VARCHAR)
RETURNS TABLE (
  id INTEGER,
  name VARCHAR,
  sku VARCHAR,
  price DECIMAL,
  stock INTEGER,
  min_stock INTEGER,
  storage_location VARCHAR,
  low_stock BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.sku,
    p.price,
    p.stock,
    p.min_stock,
    p.storage_location,
    (p.stock <= p.min_stock) as low_stock
  FROM products p
  WHERE p.sku = product_sku;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate loyalty points
CREATE OR REPLACE FUNCTION calculate_loyalty_points(amount DECIMAL)
RETURNS INTEGER AS $$
BEGIN
  -- 1 point per 100 TZS spent
  RETURN FLOOR(amount / 100);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Staff/employee accounts with role-based access';
COMMENT ON TABLE products IS 'Product catalog with inventory tracking';
COMMENT ON TABLE customers IS 'Customer database with loyalty program';
COMMENT ON TABLE sales IS 'Sales transactions with payment details';
COMMENT ON TABLE sale_items IS 'Line items for each sale';
COMMENT ON TABLE stock_movements IS 'Audit trail for all stock changes';
COMMENT ON TABLE storage_locations IS 'Physical storage locations for inventory';

-- =====================================================
-- SCHEMA VERSION
-- =====================================================

CREATE TABLE schema_version (
  version VARCHAR(10) PRIMARY KEY,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT
);

INSERT INTO schema_version (version, description)
VALUES ('4.0.0', 'Initial enterprise schema with auth, products, sales, customers, and analytics');

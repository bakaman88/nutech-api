-- ==========================
-- DATABASE STRUCTURE
-- ==========================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  balance INT NOT NULL DEFAULT 0,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_code VARCHAR(50) NOT NULL UNIQUE,
  service_name VARCHAR(100) NOT NULL,
  service_icon VARCHAR(255) NOT NULL,
  service_tariff INT NOT NULL
);

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_number VARCHAR(50) NOT NULL,
  user_id INT NOT NULL,
  service_code VARCHAR(50),
  transaction_type ENUM('TOPUP', 'PAYMENT') NOT NULL,
  description VARCHAR(255) NOT NULL,
  total_amount INT NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_code) REFERENCES services(service_code)
);

-- 4. Banner Table
CREATE TABLE IF NOT EXISTS banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  images VARCHAR(255) NOT NULL,
  link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



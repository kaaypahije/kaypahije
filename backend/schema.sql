CREATE DATABASE IF NOT EXISTS kaypahije;
USE kaypahije;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  image VARCHAR(255) NULL,
  description TEXT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subcategories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL UNIQUE,
  image VARCHAR(255) NULL,
  description TEXT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subcategories_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_subcategory_category_name (category_id, name),
  INDEX idx_subcategory_category_id (category_id)
);

CREATE TABLE IF NOT EXISTS businesses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NOT NULL,
  subcategory_id INT UNSIGNED NOT NULL,
  business_name VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  logo VARCHAR(255) NULL,
  banner VARCHAR(255) NULL,
  mobile VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20) NULL,
  email VARCHAR(150) NULL,
  website VARCHAR(255) NULL,
  address TEXT NOT NULL,
  area VARCHAR(120) NULL,
  city VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  pincode VARCHAR(12) NULL,
  map_link TEXT NULL,
  latitude DECIMAL(11, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  description TEXT NULL,
  services TEXT NULL,
  opening_time VARCHAR(20) NULL,
  closing_time VARCHAR(20) NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  verified TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  seo_title VARCHAR(255) NULL,
  seo_description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_business_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_business_subcategory
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_business_category_id (category_id),
  INDEX idx_business_subcategory_id (subcategory_id),
  INDEX idx_business_status (status),
  INDEX idx_business_city (city)
);

CREATE TABLE IF NOT EXISTS business_gallery (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  business_id INT UNSIGNED NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_gallery_business
    FOREIGN KEY (business_id) REFERENCES businesses(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_business_gallery_business_id (business_id)
);

-- Clippr Database Schema
-- Run this script in MySQL Workbench or command line

-- Create database
CREATE DATABASE IF NOT EXISTS clippr;
USE clippr;

-- Users table
CREATE TABLE users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_provider_id (provider_id)
);

-- URLs table
CREATE TABLE urls (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11),
    longurl VARCHAR(2048) NOT NULL,
    shorturlid VARCHAR(7) NOT NULL UNIQUE,
    count INT(11) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastclicked TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_shorturlid (shorturlid),
    INDEX idx_user_id (user_id)
);

-- Show tables
SHOW TABLES;

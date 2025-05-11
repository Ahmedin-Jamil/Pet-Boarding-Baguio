-- Create pet_hotel database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pet_hotel;

-- Use the pet_hotel database
USE pet_hotel;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pet_name VARCHAR(100) NOT NULL,
  pet_type VARCHAR(50) NOT NULL,
  pet_breed VARCHAR(100) NOT NULL,
  pet_age VARCHAR(20) NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  owner_email VARCHAR(100) NOT NULL,
  owner_phone VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  room_type VARCHAR(50) NOT NULL,
  time_slot VARCHAR(20) NOT NULL,
  additional_services JSON,
  special_requirements TEXT,
  total_cost DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  service_type VARCHAR(50) DEFAULT 'overnight',
  selected_service_type VARCHAR(100),
  selected_size VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create rooms table to store room information
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default room types
INSERT INTO rooms (room_type, description, price_per_night, features) VALUES
('standard', 'Comfortable bedding, climate controlled environment, 2 meals per day, daily walks, basic grooming', 35.00, '{"amenities": ["comfortable bedding", "climate controlled", "2 meals per day", "daily walks", "basic grooming"]}'),
('deluxe', 'Premium bedding, climate controlled environment, 3 meals per day, 3 walks per day, basic grooming, playtime sessions, daily photo updates', 50.00, '{"amenities": ["premium bedding", "climate controlled", "3 meals per day", "3 walks per day", "basic grooming", "playtime sessions", "daily photo updates"]}'),
('luxury', 'Luxury bedding, private room with window, climate controlled environment, custom meal plan, 4 walks per day, full grooming service, extended playtime, video calls with owner, daily photo & video updates', 75.00, '{"amenities": ["luxury bedding", "private room with window", "climate controlled", "custom meal plan", "4 walks per day", "full grooming service", "extended playtime", "video calls with owner", "daily photo & video updates"]}');

-- Create services table to store additional services
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_per_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default services
INSERT INTO services (service_name, description, price, is_per_day) VALUES
('basicGrooming', 'Brushing, ear cleaning, nail trimming', 25.00, FALSE),
('fullGrooming', 'Bath, haircut, brushing, ear cleaning, nail trimming', 45.00, FALSE),
('specialDiet', 'Custom meal preparation for pets with dietary needs', 10.00, TRUE),
('extraPlaytime', '30 minutes of additional one-on-one playtime', 15.00, FALSE),
('training', '30-minute basic training or reinforcement session', 30.00, FALSE);
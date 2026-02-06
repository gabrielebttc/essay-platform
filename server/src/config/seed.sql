-- Insert admin user (password: admin123)
INSERT INTO users (email, name, password_hash, role) 
VALUES ('admin@ielts.com', 'Admin', '$2y$10$5hc2JeepHPx7ysfSc3yTHOc1dKh.dEwrhM69kN8Z4FuiYYcNygAoG', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert essay types
INSERT INTO essay_types (name, price, min_words)
VALUES ('IELTS ESSAY Task 1', 20, 150),
('IELTS ESSAY Task 2', 25, 250),
('Prova Test', 0, 0),
('Prova Test', 1.5, 0);
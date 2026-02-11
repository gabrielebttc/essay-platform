-- Seed the database with initial data
-- This script is designed to be idempotent and transactional.

\echo '--------------------------------------'
\echo 'Starting database seeding...'
\echo '--------------------------------------'

-- Start a transaction
BEGIN;

\echo 'Seeding admin user (admin@ielts.com)...'
INSERT INTO users (email, name, password_hash, role) 
VALUES ('admin@ielts.com', 'Admin', '$2y$10$5hc2JeepHPx7ysfSc3yTHOc1dKh.dEwrhM69kN8Z4FuiYYcNygAoG', 'admin')
ON CONFLICT (email) DO NOTHING;

\echo 'Seeding essay types...'
INSERT INTO essay_types (name, price, min_words)
VALUES ('IELTS ESSAY Task 1', 20, 150),
('IELTS ESSAY Task 2', 25, 250)
ON CONFLICT (name) DO NOTHING;

-- Commit the transaction
COMMIT;

\echo '--------------------------------------'
\echo 'Database seeding finished successfully.'
\echo '--------------------------------------'

-- Initialize database schema for IELTS Essay Feedback Platform
-- This script is designed to be idempotent and transactional.

\echo '--------------------------------------'
\echo 'Starting schema initialization...'
\echo '--------------------------------------'

-- Start a transaction
BEGIN;

\echo 'Creating table: users...'
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    target_band_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\echo 'Creating table: essay_types...'
CREATE TABLE IF NOT EXISTS essay_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(30) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    min_words NUMERIC(10)
); 

\echo 'Creating table: essays...'
CREATE TABLE IF NOT EXISTS essays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_type_id UUID NOT NULL REFERENCES essay_types(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\echo 'Creating table: essay_feedback...'
CREATE TABLE IF NOT EXISTS essay_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    essay_id UUID NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
    overall_band_score DECIMAL(2,1) NOT NULL,
    task_achievement DECIMAL(2,1) NOT NULL,
    coherence DECIMAL(2,1) NOT NULL,
    lexical_resource DECIMAL(2,1) NOT NULL,
    grammatical_range DECIMAL(2,1) NOT NULL,
    comments TEXT,
    improved_version TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\echo 'Creating table: payments...'
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    essay_id UUID NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\echo 'Creating indexes for performance...'
CREATE INDEX IF NOT EXISTS idx_essays_user_id ON essays(user_id);
CREATE INDEX IF NOT EXISTS idx_essays_status ON essays(status);
CREATE INDEX IF NOT EXISTS idx_essay_feedback_essay_id ON essay_feedback(essay_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_essay_id ON payments(essay_id);

-- Commit the transaction
COMMIT;

\echo '--------------------------------------'
\echo 'Schema initialization finished successfully.'
\echo '--------------------------------------'

\echo '--------------------------------------'
\echo 'Starting schema initialization SECOND TIME...'
\echo '--------------------------------------'

-- Start a transaction
BEGIN;

\echo 'Creating table: users...'
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    target_band_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\echo 'Creating table: essay_types...'
CREATE TABLE IF NOT EXISTS essay_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(30) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    min_words NUMERIC(10)
); 

\echo 'Creating table: essays...'
CREATE TABLE IF NOT EXISTS essays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_type_id UUID NOT NULL REFERENCES essay_types(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\echo 'Creating table: essay_feedback...'
CREATE TABLE IF NOT EXISTS essay_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    essay_id UUID NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
    overall_band_score DECIMAL(2,1) NOT NULL,
    task_achievement DECIMAL(2,1) NOT NULL,
    coherence DECIMAL(2,1) NOT NULL,
    lexical_resource DECIMAL(2,1) NOT NULL,
    grammatical_range DECIMAL(2,1) NOT NULL,
    comments TEXT,
    improved_version TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\echo 'Creating table: payments...'
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    essay_id UUID NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\echo 'Creating indexes for performance...'
CREATE INDEX IF NOT EXISTS idx_essays_user_id ON essays(user_id);
CREATE INDEX IF NOT EXISTS idx_essays_status ON essays(status);
CREATE INDEX IF NOT EXISTS idx_essay_feedback_essay_id ON essay_feedback(essay_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_essay_id ON payments(essay_id);

-- Commit the transaction
COMMIT;

\echo '--------------------------------------'
\echo 'Schema initialization SECOND TIME finished successfully.'
\echo '--------------------------------------'
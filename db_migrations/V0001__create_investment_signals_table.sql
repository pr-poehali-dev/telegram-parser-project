-- Таблица для хранения инвестиционных сигналов из Telegram каналов
CREATE TABLE IF NOT EXISTS investment_signals (
    id SERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL,
    channel_username VARCHAR(255),
    message_id BIGINT,
    ticker VARCHAR(50),
    signal_type VARCHAR(50),
    entry_price DECIMAL(18, 8),
    target_price DECIMAL(18, 8),
    stop_loss DECIMAL(18, 8),
    message_text TEXT NOT NULL,
    parsed_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message_date TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_ticker ON investment_signals(ticker);
CREATE INDEX idx_channel ON investment_signals(channel_username);
CREATE INDEX idx_created_at ON investment_signals(created_at DESC);

-- Таблица для управления каналами
CREATE TABLE IF NOT EXISTS telegram_channels (
    id SERIAL PRIMARY KEY,
    channel_username VARCHAR(255) UNIQUE NOT NULL,
    channel_title VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_message_id BIGINT DEFAULT 0,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

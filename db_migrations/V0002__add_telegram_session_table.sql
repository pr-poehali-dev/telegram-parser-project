-- Добавляем таблицу для хранения Telegram сессии
CREATE TABLE IF NOT EXISTS telegram_session (
    id SERIAL PRIMARY KEY,
    session_string TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем пустую запись для хранения сессии
INSERT INTO telegram_session (session_string) VALUES (NULL) ON CONFLICT DO NOTHING;
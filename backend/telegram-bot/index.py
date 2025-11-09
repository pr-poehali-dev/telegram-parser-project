'''
Business: Telegram бот для автоматического парсинга каналов
Args: event - вызывается по расписанию или вручную
Returns: HTTP response со статусом парсинга
'''

import os
import json
import re
from datetime import datetime
from telethon import TelegramClient
import psycopg2
from typing import Dict, Any

API_ID = int(os.environ.get('TELEGRAM_API_ID', '0'))
API_HASH = os.environ.get('TELEGRAM_API_HASH', '')
PHONE = os.environ.get('TELEGRAM_PHONE', '')
DATABASE_URL = os.environ.get('DATABASE_URL', '')
TWO_FA_PASSWORD = os.environ.get('TELEGRAM_2FA_PASSWORD', '')

def extract_investment_data(text: str) -> Dict[str, Any]:
    data = {
        'ticker': None,
        'entry_price': None,
        'target_price': None,
        'stop_loss': None,
        'risk_level': 'Средний',
        'category': 'Разное'
    }
    
    text_upper = text.upper()
    
    ticker_patterns = [
        r'\b([A-Z]{2,5})\b',
        r'#([A-Za-z]{2,5})',
        r'\$([A-Za-z]{2,5})'
    ]
    for pattern in ticker_patterns:
        match = re.search(pattern, text)
        if match:
            data['ticker'] = match.group(1)
            break
    
    price_patterns = [
        r'(?:вход|buy|купи|entry).*?(\d+[.,]?\d*)',
        r'(?:цена|price).*?(\d+[.,]?\d*)',
    ]
    for pattern in price_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data['entry_price'] = float(match.group(1).replace(',', '.'))
            break
    
    target_patterns = [
        r'(?:цель|target|tp).*?(\d+[.,]?\d*)',
        r'(?:take profit|тп).*?(\d+[.,]?\d*)',
    ]
    for pattern in target_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data['target_price'] = float(match.group(1).replace(',', '.'))
            break
    
    stop_patterns = [
        r'(?:стоп|stop|sl).*?(\d+[.,]?\d*)',
        r'(?:stop loss|сл).*?(\d+[.,]?\d*)',
    ]
    for pattern in stop_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data['stop_loss'] = float(match.group(1).replace(',', '.'))
            break
    
    if any(word in text_upper for word in ['ВЫСОКИЙ РИСК', 'HIGH RISK', 'РИСКОВАННО']):
        data['risk_level'] = 'Высокий'
    elif any(word in text_upper for word in ['НИЗКИЙ РИСК', 'LOW RISK', 'БЕЗОПАСНО']):
        data['risk_level'] = 'Низкий'
    
    if any(word in text_upper for word in ['КРИПТО', 'CRYPTO', 'BTC', 'ETH', 'BITCOIN']):
        data['category'] = 'Крипто'
    elif any(word in text_upper for word in ['АКЦИ', 'STOCK', 'IPO']):
        data['category'] = 'Акции'
    elif any(word in text_upper for word in ['НЕДВИЖ', 'REAL ESTATE']):
        data['category'] = 'Недвижимость'
    elif any(word in text_upper for word in ['СТАРТАП', 'STARTUP']):
        data['category'] = 'Стартапы'
    
    return data

async def parse_channels():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    cur.execute("SELECT session_string FROM telegram_session ORDER BY id DESC LIMIT 1")
    result = cur.fetchone()
    session_string = result[0] if result and result[0] else None
    
    from telethon.sessions import StringSession
    session = StringSession(session_string) if session_string else StringSession()
    
    client = TelegramClient(session, API_ID, API_HASH)
    
    code = os.environ.get('TELEGRAM_CODE', '')
    password = TWO_FA_PASSWORD if TWO_FA_PASSWORD else None
    
    if code:
        await client.start(phone=PHONE, code_callback=lambda: code, password=password)
    else:
        await client.start(phone=PHONE, password=password)
    
    cur.execute("SELECT id, channel_username, last_message_id FROM telegram_channels WHERE is_active = true")
    channels = cur.fetchall()
    
    parsed_count = 0
    
    for channel_id, username, last_msg_id in channels:
        try:
            entity = await client.get_entity(username)
            
            messages = await client.get_messages(entity, limit=100, min_id=last_msg_id or 0)
            
            for msg in reversed(messages):
                if not msg.text:
                    continue
                
                investment_data = extract_investment_data(msg.text)
                
                if investment_data['ticker'] or investment_data['entry_price']:
                    cur.execute("""
                        INSERT INTO investment_signals 
                        (channel_id, message_text, ticker, entry_price, target_price, stop_loss, 
                         risk_level, category, message_date, telegram_message_id)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (channel_id, telegram_message_id) DO NOTHING
                    """, (
                        channel_id,
                        msg.text[:1000],
                        investment_data['ticker'],
                        investment_data['entry_price'],
                        investment_data['target_price'],
                        investment_data['stop_loss'],
                        investment_data['risk_level'],
                        investment_data['category'],
                        msg.date,
                        msg.id
                    ))
                    parsed_count += 1
            
            if messages:
                latest_id = max(msg.id for msg in messages)
                cur.execute(
                    "UPDATE telegram_channels SET last_message_id = %s WHERE id = %s",
                    (latest_id, channel_id)
                )
            
        except Exception as e:
            print(f"Error parsing {username}: {e}")
            continue
    
    new_session_string = client.session.save()
    cur.execute(
        "INSERT INTO telegram_session (session_string) VALUES (%s) ON CONFLICT (id) DO UPDATE SET session_string = EXCLUDED.session_string, updated_at = CURRENT_TIMESTAMP",
        (new_session_string,)
    )
    
    conn.commit()
    cur.close()
    conn.close()
    await client.disconnect()
    
    return parsed_count

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        try:
            import asyncio
            parsed_count = asyncio.run(parse_channels())
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'status': 'success',
                    'parsed_messages': parsed_count
                })
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'status': 'error',
                    'message': str(e)
                })
            }
    
    return {
        'statusCode': 405,
        'body': json.dumps({'error': 'Method not allowed'})
    }
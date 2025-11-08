'''
Business: Parse Telegram channels for investment signals and store in database
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with request_id, function_name attributes
Returns: HTTP response dict with parsed signals
'''

import json
import os
import re
from typing import Dict, Any, List, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(db_url)
    
    try:
        if method == 'GET':
            return get_signals(conn, event)
        elif method == 'POST':
            return add_channel(conn, event)
        elif method == 'PUT':
            return parse_channel(conn, event)
        elif method == 'DELETE':
            return delete_signal(conn, event)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    finally:
        conn.close()


def get_signals(conn, event: Dict[str, Any]) -> Dict[str, Any]:
    params = event.get('queryStringParameters') or {}
    limit = int(params.get('limit', 100))
    ticker = params.get('ticker')
    channel = params.get('channel')
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = "SELECT * FROM investment_signals WHERE 1=1"
    query_params = []
    
    if ticker:
        query += " AND ticker ILIKE %s"
        query_params.append(f'%{ticker}%')
    
    if channel:
        query += " AND channel_username = %s"
        query_params.append(channel)
    
    query += " ORDER BY created_at DESC LIMIT %s"
    query_params.append(limit)
    
    cursor.execute(query, query_params)
    signals = cursor.fetchall()
    
    cursor.execute("SELECT * FROM telegram_channels ORDER BY added_at DESC")
    channels = cursor.fetchall()
    
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'signals': signals,
            'channels': channels
        }, default=str)
    }


def add_channel(conn, event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    channel_username = body.get('channel_username', '').strip().replace('@', '')
    channel_title = body.get('channel_title', channel_username)
    
    if not channel_username:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'channel_username required'})
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        "INSERT INTO telegram_channels (channel_username, channel_title) VALUES (%s, %s) ON CONFLICT (channel_username) DO UPDATE SET is_active = true, channel_title = EXCLUDED.channel_title RETURNING *",
        (channel_username, channel_title)
    )
    channel = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'channel': channel}, default=str)
    }


def parse_channel(conn, event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    channel_username = body.get('channel_username', '').strip().replace('@', '')
    messages = body.get('messages', [])
    
    if not channel_username or not messages:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'channel_username and messages required'})
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    parsed_count = 0
    
    for msg in messages:
        message_text = msg.get('text', '')
        message_id = msg.get('id')
        message_date = msg.get('date')
        
        parsed = parse_investment_signal(message_text)
        
        if parsed:
            cursor.execute(
                """INSERT INTO investment_signals 
                (channel_username, channel_name, message_id, message_text, message_date, 
                ticker, signal_type, entry_price, target_price, stop_loss, parsed_data)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING""",
                (
                    channel_username,
                    channel_username,
                    message_id,
                    message_text,
                    message_date,
                    parsed.get('ticker'),
                    parsed.get('signal_type'),
                    parsed.get('entry_price'),
                    parsed.get('target_price'),
                    parsed.get('stop_loss'),
                    json.dumps(parsed)
                )
            )
            parsed_count += 1
    
    cursor.execute(
        "UPDATE telegram_channels SET last_message_id = %s WHERE channel_username = %s",
        (messages[-1].get('id', 0) if messages else 0, channel_username)
    )
    
    conn.commit()
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'parsed_count': parsed_count,
            'total_messages': len(messages)
        })
    }


def delete_signal(conn, event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body', '{}'))
    signal_id = body.get('id')
    
    if not signal_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'id required'})
        }
    
    cursor = conn.cursor()
    cursor.execute("DELETE FROM investment_signals WHERE id = %s", (signal_id,))
    conn.commit()
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }


def parse_investment_signal(text: str) -> Optional[Dict[str, Any]]:
    text_upper = text.upper()
    
    ticker_patterns = [
        r'\b([A-Z]{1,5})\b',
        r'\$([A-Z]{1,5})\b',
        r'#([A-Z]{1,5})\b'
    ]
    
    ticker = None
    for pattern in ticker_patterns:
        match = re.search(pattern, text_upper)
        if match:
            ticker = match.group(1)
            break
    
    signal_type = None
    if any(word in text_upper for word in ['BUY', 'LONG', 'ПОКУПКА', 'КУПИТЬ', 'ЛОНГ']):
        signal_type = 'BUY'
    elif any(word in text_upper for word in ['SELL', 'SHORT', 'ПРОДАЖА', 'ПРОДАТЬ', 'ШОРТ']):
        signal_type = 'SELL'
    
    price_patterns = [
        r'(?:ENTRY|ВХОД|PRICE|ЦЕНА)[:\s]*[\$]?([\d.,]+)',
        r'(?:@|AT)\s*[\$]?([\d.,]+)',
        r'[\$]([\d.,]+)'
    ]
    
    entry_price = None
    for pattern in price_patterns:
        match = re.search(pattern, text_upper)
        if match:
            entry_price = float(match.group(1).replace(',', '.'))
            break
    
    target_match = re.search(r'(?:TARGET|ЦЕЛЬ|TP)[:\s]*[\$]?([\d.,]+)', text_upper)
    target_price = float(target_match.group(1).replace(',', '.')) if target_match else None
    
    sl_match = re.search(r'(?:STOP|SL|СТОП)[:\s]*[\$]?([\d.,]+)', text_upper)
    stop_loss = float(sl_match.group(1).replace(',', '.')) if sl_match else None
    
    if ticker or entry_price or signal_type:
        return {
            'ticker': ticker,
            'signal_type': signal_type,
            'entry_price': entry_price,
            'target_price': target_price,
            'stop_loss': stop_loss
        }
    
    return None

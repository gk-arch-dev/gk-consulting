import json
import logging
import os
import re
from html import escape
from typing import Any

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

_EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


def _response(status: int, body: dict) -> dict:
    origin = os.environ.get('SITE_ORIGIN', '')
    headers: dict[str, str] = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    }
    if status != 204:
        headers['Content-Type'] = 'application/json'
    return {
        'statusCode': status,
        'headers': headers,
        'body': json.dumps(body) if status != 204 else '',
    }


def _validate(data: dict) -> list[str]:
    errors: list[str] = []

    name = data.get('name', '')
    if not isinstance(name, str) or not (1 <= len(name.strip()) <= 100):
        errors.append('name')

    email = data.get('email', '')
    if not isinstance(email, str) or not _EMAIL_RE.match(email.strip()):
        errors.append('email')

    company = data.get('company') or ''
    if company and (not isinstance(company, str) or len(company.strip()) > 100):
        errors.append('company')

    message = data.get('message', '')
    if not isinstance(message, str) or not (10 <= len(message.strip()) <= 5000):
        errors.append('message')

    return errors


def handler(event: dict, context: Any) -> dict:
    method = (
        event.get('requestContext', {}).get('http', {}).get('method', '')
        or event.get('httpMethod', '')
    ).upper()

    if method == 'OPTIONS':
        return _response(204, {})

    try:
        body = json.loads(event.get('body') or '{}')
    except (json.JSONDecodeError, TypeError):
        return _response(400, {'ok': False, 'errors': ['body']})

    if not isinstance(body, dict):
        return _response(400, {'ok': False, 'errors': ['body']})

    errors = _validate(body)
    if errors:
        logger.info('validation failed: %s', errors)
        return _response(400, {'ok': False, 'errors': errors})

    name = body['name'].strip()
    email = body['email'].strip()
    company = (body.get('company') or '').strip()
    message = body['message'].strip()

    source_ip = (
        event.get('requestContext', {}).get('http', {}).get('sourceIp', '')
        or event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
    )

    company_display = company or 'Personal'
    subject = f'[Contact form] {name} — {company_display}'
    email_body = (
        f'Name: {escape(name)}\n'
        f'Email: {escape(email)}\n'
        f'Company: {escape(company_display)}\n'
        f'Source IP: {escape(source_ip)}\n\n'
        f'Message:\n{escape(message)}\n'
    )

    ses_from = os.environ.get('SES_FROM', '')
    ses_to = os.environ.get('SES_TO', '')

    # Mock mode: skip SES when running locally via dev_server.py
    if ses_from == 'mock':
        logger.info('mock mode — skipping SES send')
        return _response(200, {'ok': True})

    try:
        ses = boto3.client('ses', region_name=os.environ.get('AWS_REGION', 'eu-central-1'))
        ses.send_email(
            Source=ses_from,
            Destination={'ToAddresses': [ses_to]},
            ReplyToAddresses=[email],
            Message={
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': {'Text': {'Data': email_body, 'Charset': 'UTF-8'}},
            },
        )
    except ClientError as exc:
        logger.error('SES error: %s', exc.__class__.__name__)
        return _response(500, {'ok': False, 'error': 'internal'})

    return _response(200, {'ok': True})

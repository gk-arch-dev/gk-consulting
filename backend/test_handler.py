import json
import os

import boto3
import pytest
from moto import mock_aws

os.environ.setdefault('SITE_ORIGIN', 'http://localhost:3000')
os.environ.setdefault('AWS_DEFAULT_REGION', 'eu-central-1')
os.environ.setdefault('AWS_ACCESS_KEY_ID', 'test')
os.environ.setdefault('AWS_SECRET_ACCESS_KEY', 'test')

from handler import handler  # noqa: E402


VALID_BODY = {
    'name': 'Ada Lovelace',
    'email': 'ada@example.com',
    'company': 'Analytical Engine Ltd',
    'message': 'Hello, I would like to discuss a modernisation project.',
}

CORS_HEADERS = {
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
}


def _event(body: dict | None = None, method: str = 'POST', raw_body: str | None = None) -> dict:
    return {
        'requestContext': {'http': {'method': method, 'sourceIp': '1.2.3.4'}},
        'body': raw_body if raw_body is not None else json.dumps(body or VALID_BODY),
    }


def _ses_verified(ses_client: object, email: str) -> None:
    ses_client.verify_email_identity(EmailAddress=email)


@mock_aws
def test_happy_path():
    ses = boto3.client('ses', region_name='eu-central-1')
    _ses_verified(ses, 'noreply@gkconsulting.cloud')
    _ses_verified(ses, 'hello@gkconsulting.cloud')

    os.environ['SES_FROM'] = 'noreply@gkconsulting.cloud'
    os.environ['SES_TO'] = 'hello@gkconsulting.cloud'
    os.environ.pop('AWS_REGION', None)

    result = handler(_event(), None)

    assert result['statusCode'] == 200
    assert json.loads(result['body']) == {'ok': True}
    assert CORS_HEADERS.issubset(result['headers'])

    send_quota = ses.get_send_quota()
    assert send_quota['SentLast24Hours'] == 1.0


@mock_aws
def test_happy_path_no_company():
    ses = boto3.client('ses', region_name='eu-central-1')
    _ses_verified(ses, 'noreply@gkconsulting.cloud')
    _ses_verified(ses, 'hello@gkconsulting.cloud')

    os.environ['SES_FROM'] = 'noreply@gkconsulting.cloud'
    os.environ['SES_TO'] = 'hello@gkconsulting.cloud'

    body = {**VALID_BODY, 'company': ''}
    result = handler(_event(body), None)
    assert result['statusCode'] == 200


def test_options_preflight():
    result = handler(_event(method='OPTIONS'), None)
    assert result['statusCode'] == 204
    assert CORS_HEADERS.issubset(result['headers'])


def test_missing_name():
    body = {**VALID_BODY, 'name': ''}
    result = handler(_event(body), None)
    assert result['statusCode'] == 400
    data = json.loads(result['body'])
    assert 'name' in data['errors']


def test_name_too_long():
    body = {**VALID_BODY, 'name': 'A' * 101}
    result = handler(_event(body), None)
    assert result['statusCode'] == 400
    assert 'name' in json.loads(result['body'])['errors']


def test_invalid_email():
    body = {**VALID_BODY, 'email': 'not-an-email'}
    result = handler(_event(body), None)
    assert result['statusCode'] == 400
    assert 'email' in json.loads(result['body'])['errors']


def test_message_too_short():
    body = {**VALID_BODY, 'message': 'Hi'}
    result = handler(_event(body), None)
    assert result['statusCode'] == 400
    assert 'message' in json.loads(result['body'])['errors']


def test_message_too_long():
    body = {**VALID_BODY, 'message': 'A' * 5001}
    result = handler(_event(body), None)
    assert result['statusCode'] == 400
    assert 'message' in json.loads(result['body'])['errors']


def test_company_too_long():
    body = {**VALID_BODY, 'company': 'C' * 101}
    result = handler(_event(body), None)
    assert result['statusCode'] == 400
    assert 'company' in json.loads(result['body'])['errors']


def test_multiple_validation_errors():
    body = {'name': '', 'email': 'bad', 'message': 'short'}
    result = handler(_event(body), None)
    data = json.loads(result['body'])
    assert result['statusCode'] == 400
    assert 'name' in data['errors']
    assert 'email' in data['errors']
    assert 'message' in data['errors']


def test_invalid_json_body():
    result = handler(_event(raw_body='not json'), None)
    assert result['statusCode'] == 400


@mock_aws
def test_ses_error_returns_500(caplog):
    # SES identity not verified → ClientError → 500
    os.environ['SES_FROM'] = 'noreply@gkconsulting.cloud'
    os.environ['SES_TO'] = 'hello@gkconsulting.cloud'

    import logging
    with caplog.at_level(logging.ERROR, logger='handler'):
        result = handler(_event(), None)

    assert result['statusCode'] == 500
    assert json.loads(result['body']) == {'ok': False, 'error': 'internal'}
    # Should log error type, not the full message body
    assert any('SES error' in r.message for r in caplog.records)


def test_mock_mode_skips_ses():
    os.environ['SES_FROM'] = 'mock'
    os.environ['SES_TO'] = 'anything@example.com'
    result = handler(_event(), None)
    assert result['statusCode'] == 200
    os.environ.pop('SES_FROM', None)
    os.environ.pop('SES_TO', None)

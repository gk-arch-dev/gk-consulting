"""Local dev server wrapping the Lambda handler over plain HTTP on :8080.

Usage:
    SES_FROM=mock SES_TO=mock SITE_ORIGIN=http://localhost:3000 python dev_server.py

The handler runs in mock mode (SES_FROM=mock) so no real emails are sent.
Set NEXT_PUBLIC_API_URL=http://localhost:8080 in app/.env.local.
"""

import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

os.environ.setdefault('SES_FROM', 'mock')
os.environ.setdefault('SES_TO', 'mock')
os.environ.setdefault('SITE_ORIGIN', 'http://localhost:3000')
os.environ.setdefault('AWS_DEFAULT_REGION', 'eu-central-1')
os.environ.setdefault('AWS_ACCESS_KEY_ID', 'mock')
os.environ.setdefault('AWS_SECRET_ACCESS_KEY', 'mock')

from handler import handler  # noqa: E402

PORT = int(os.environ.get('PORT', 8080))


class ContactHandler(BaseHTTPRequestHandler):
    def _build_event(self, method: str) -> dict:
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode() if length else ''
        return {
            'requestContext': {'http': {'method': method, 'sourceIp': self.client_address[0]}},
            'body': body,
        }

    def _dispatch(self, method: str) -> None:
        if self.path.rstrip('/') != '/contact':
            self.send_response(404)
            self.end_headers()
            return
        result = handler(self._build_event(method), None)
        status = result['statusCode']
        self.send_response(status)
        for key, val in result.get('headers', {}).items():
            self.send_header(key, val)
        self.end_headers()
        if result.get('body'):
            self.wfile.write(result['body'].encode())

    def do_POST(self) -> None:   # noqa: N802
        self._dispatch('POST')

    def do_OPTIONS(self) -> None:  # noqa: N802
        self._dispatch('OPTIONS')

    def log_message(self, fmt: str, *args: object) -> None:
        print(f'[dev_server] {fmt % args}')


if __name__ == '__main__':
    server = HTTPServer(('', PORT), ContactHandler)
    print(f'[dev_server] listening on http://localhost:{PORT}')
    server.serve_forever()

"""Loopback-only UI test server. Form requests are mocked, never forwarded."""
import argparse
import json
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

class Handler(SimpleHTTPRequestHandler):
    requests_received = 0

    def do_GET(self):
        if self.path == '/test-stats':
            self.respond({'requests': Handler.requests_received})
        else:
            super().do_GET()

    def do_POST(self):
        if self.path != '/test-submit':
            self.send_error(404)
            return
        Handler.requests_received += 1
        data = json.loads(self.rfile.read(int(self.headers.get('Content-Length', 0))))
        mode = data.get('message', '')
        if mode == 'timeout':
            time.sleep(21)
        else:
            time.sleep(1)
        if mode == 'unsafe-text':
            self.respond({'success': False, 'message': '<img src=x onerror=alert(1)> Test error'}, 400)
        elif mode == 'malformed':
            self.send_response(502)
            self.end_headers()
            self.wfile.write(b'Service unavailable')
        else:
            self.respond({'success': True})

    def respond(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        try:
            self.wfile.write(json.dumps(data).encode())
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--directory', type=Path, required=True)
    parser.add_argument('--port', type=int, default=8766)
    args = parser.parse_args()
    ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(args.directory))).serve_forever()

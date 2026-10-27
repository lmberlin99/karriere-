# -*- coding: utf-8 -*-
# Локальный HTTPS-сервер для квеста (PWA: нужен для офлайн-кэша на iPad)
import os
import ssl
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 8443
CERT = "server.crt"
KEY = "server.key"


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # не засоряем консоль


httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain(CERT, KEY)
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)

print("HTTPS-сервер квеста запущен: https://localhost:%d/" % PORT)
print("Не закрывайте это окно, пока квест не закэшируется на iPad.")
httpd.serve_forever()
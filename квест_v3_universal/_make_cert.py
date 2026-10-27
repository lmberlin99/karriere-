# -*- coding: utf-8 -*-
# Генерирует самоподписанный сертификат для локального HTTPS (квест PWA)
# Если IP компьютера изменился — запустите заново:  python _make_cert.py
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID
import datetime, ipaddress, os, socket, sys

KEY = "server.key"
CERT = "server.crt"
HERE = os.path.dirname(os.path.abspath(__file__))  # сохраняем рядом со скриптом (в папке квест)

def local_ip():
    # Если IP не передан аргументом — пытаемся определить сами
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"
    finally:
        s.close()

# python _make_cert.py 192.168.31.66  (или без аргумента — IP найдётся сам)
if len(sys.argv) > 1:
    ip = sys.argv[1]
else:
    ip = local_ip()
print("IP для сертификата:", ip)

key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

name = x509.Name([
    x509.NameAttribute(NameOID.COMMON_NAME, "ipu-quiz.local"),
    x509.NameAttribute(NameOID.ORGANIZATION_NAME, "ИПУ РАН"),
    x509.NameAttribute(NameOID.COUNTRY_NAME, "RU"),
])

now = datetime.datetime.now(datetime.timezone.utc)
cert = (
    x509.CertificateBuilder()
    .subject_name(name)
    .issuer_name(name)
    .public_key(key.public_key())
    .serial_number(x509.random_serial_number())
    .not_valid_before(now - datetime.timedelta(days=1))
    .not_valid_after(now + datetime.timedelta(days=3650))
    .add_extension(
        x509.SubjectAlternativeName([
            x509.DNSName("localhost"),
            x509.DNSName("ipu-quiz.local"),
            x509.IPAddress(ipaddress.ip_address(ip)),
        ]),
        critical=False,
    )
    .add_extension(x509.BasicConstraints(ca=True, path_length=None), critical=True)
    .add_extension(x509.KeyUsage(
        digital_signature=True,
        key_encipherment=True,
        key_cert_sign=True,
        content_commitment=False,
        data_encipherment=False,
        key_agreement=False,
        crl_sign=True,
        encipher_only=False,
        decipher_only=False,
    ), critical=True)
    .sign(key, hashes.SHA256())
)

with open(os.path.join(HERE, KEY), "wb") as f:
    f.write(key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.TraditionalOpenSSL,
        serialization.NoEncryption(),
    ))
with open(os.path.join(HERE, CERT), "wb") as f:
    f.write(cert.public_bytes(serialization.Encoding.PEM))

print("cert ok: " + CERT + " / " + KEY)
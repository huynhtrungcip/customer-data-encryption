from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
import os
import base64  # Thêm thư viện base64

# --- Cấu hình ---
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PRIVATE_KEY_FILE = os.path.join(BACKEND_DIR, "private_key.pem")
PUBLIC_KEY_FILE = os.path.join(BACKEND_DIR, "public_key.pem")
KEY_SIZE = 2048

def generate_keys():
    """Tạo cặp khóa RSA nếu chưa có."""
    if not os.path.exists(PRIVATE_KEY_FILE) or not os.path.exists(PUBLIC_KEY_FILE):
        key = RSA.generate(KEY_SIZE)
        private_key = key.export_key()
        public_key = key.publickey().export_key()

        with open(PRIVATE_KEY_FILE, "wb") as priv_file:
            priv_file.write(private_key)

        with open(PUBLIC_KEY_FILE, "wb") as pub_file:
            pub_file.write(public_key)

        print("RSA keys generated successfully.")

def load_public_key():
    """Tải khóa công khai từ file."""
    try:
        with open(PUBLIC_KEY_FILE, "rb") as file:
            return RSA.import_key(file.read())
    except Exception as e:
        print(f"Error loading public key: {e}")
        return None

def load_private_key():
    """Tải khóa riêng tư từ file."""
    try:
        with open(PRIVATE_KEY_FILE, "rb") as file:
            return RSA.import_key(file.read())
    except FileNotFoundError:
        print("Error: Private key file not found. Run key generation.")
        return None
    except ValueError:
        print("ERROR: Private key is corrupted or invalid format.")
        return None
    except Exception as e:
        print(f"Error loading private key: {e}")
        return None
    
def decrypt_rsa(encrypted_data):
    """Giải mã dữ liệu đã mã hóa bằng RSA và OAEP padding

    Args:
        encrypted_data (bytes): Dữ liệu đã mã hóa ở dạng bytes

    Returns:
        str: Dữ liệu đã giải mã (dạng chuỗi), hoặc None nếu có lỗi
    """
    private_key = load_private_key()
    if private_key is None:
        return None

    cipher = PKCS1_OAEP.new(private_key)
    try:
        decrypted_data = cipher.decrypt(encrypted_data)
        return decrypted_data.decode('utf-8')  # Giải mã thành UTF-8
    except ValueError as e:
        print(f"Decryption Error: {e}")  # ValueError thường gặp khi sai key, padding
        return None
    except Exception as e:
        print(f"Unexpected Decryption Error: {e}")
        return None
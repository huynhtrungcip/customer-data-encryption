from flask import Flask, request, jsonify, send_from_directory
from rsa_utils import decrypt_rsa, load_public_key, generate_keys  # Import generate_keys
import os
import base64

app = Flask(__name__)

# --- Phục vụ Frontend ---
@app.route("/")
def serve_index():
    """Phục vụ trang index.html từ thư mục frontend."""
    return send_from_directory("../frontend", "index.html")

@app.route('/<path:filename>')
def serve_static_files(filename):
    """Phục vụ các file tĩnh (CSS, JS, v.v.) từ thư mục frontend."""
    return send_from_directory("../frontend", filename)

# --- API Endpoints ---
@app.route("/get_public_key", methods=["GET"])
def get_public_key():
    """Trả về khóa công khai RSA cho frontend."""
    try:
        key = load_public_key()
        return jsonify({"public_key": key.export_key().decode()})
    except Exception as e:
        print(f"Failed to load public key: {e}")
        return jsonify({"error": f"Failed to load public key: {str(e)}"}), 500

@app.route("/decrypt", methods=["POST"])
def decrypt_data():
    """Giải mã dữ liệu đã được mã hóa bằng RSA."""
    try:
        data = request.json.get("encrypted_data")
        if not data:
            return jsonify({"error": "No data received"}), 400

        # Giải mã Base64
        encrypted_bytes = base64.b64decode(data)
        decrypted_text = decrypt_rsa(encrypted_bytes)

        if decrypted_text is None:
             return jsonify({"error": "Decryption failed."}), 500

        return jsonify({"decrypted_data": decrypted_text})

    except Exception as e:
        print(f"Unexpected error during decryption: {e}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

if __name__ == "__main__":
    generate_keys()  # Tạo khóa nếu chúng chưa tồn tại
    app.run(debug=True)

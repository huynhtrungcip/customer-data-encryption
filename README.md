
# 🔐 Customer Data Encryption System Using RSA

![Encryption](https://img.shields.io/badge/Encryption-RSA-blue)
![Flask](https://img.shields.io/badge/Backend-Flask-red)
![JavaScript](https://img.shields.io/badge/Frontend-JavaScript-yellow)
![License](https://img.shields.io/github/license/yourusername/customer-data-encryption)


## 📌 Introduction
This project is a customer data encryption system utilizing the **RSA** algorithm to secure sensitive information.  
It includes:
- **Frontend** (HTML, CSS, JavaScript) for data input and encryption.
- **Backend** (Python, Flask) to receive encrypted data, decrypt it, and return results.
- **Security Mechanism**: Data is encrypted using a public key before transmission, ensuring only the server can decrypt it.

## 🚀 Features
✅ **Encrypt customer data using RSA**  
✅ **Send encrypted data to the backend**  
✅ **Backend decrypts and displays results**  
✅ **Automatically generates RSA keys if not available**  
✅ **Supports CORS and RESTful API**  

## 🏗 Project Structure
```
customer-data-encryption/
│── backend/
│   ├── app.py                 # Flask backend handling encryption & decryption
│   ├── private_key.pem        # RSA private key (auto-generated)
│   ├── public_key.pem         # RSA public key (auto-generated)
│   ├── requirements.txt       # Dependencies list
│── frontend/
│   ├── index.html             # User interface for input & encryption
│   ├── styles.css             # CSS styling
│   ├── script.js              # JavaScript for encryption & API calls
│── README.md                  # Documentation
│── LICENSE                    # Open-source license
```

## 📥 Installation & Running
### 1️⃣ Clone this repository:
```sh
git clone https://github.com/huynhtrungcip/customer-data-encryption.git
cd customer-data-encryption/backend
```
### 2️⃣ Install Backend Dependencies:
```sh
cd backend
pip install -r requirements.txt
```
### 3️⃣ Run the Backend:
```sh
python app.py
```
Server will be running at: `http://127.0.0.1:5000/`

### 4️⃣ Run the Frontend:  
Open **frontend/index.html** in a browser.  

## 🔑 API Endpoints
| Method     | Endpoint         | Description                   |
|------------|-----------------|-------------------------------|
| `GET`      | `/get_public_key` | Retrieve the RSA public key  |
| `POST`     | `/decrypt_data`   | Receive encrypted data and decrypt it |

## 🎯 Technologies Used
- **Python + Flask**: Backend for encryption & API handling.
- **JavaScript + Forge.js**: Encrypts data before transmission.
- **HTML + CSS**: Provides a user-friendly interface.

## 📄 License  

This project is licensed under the **Restricted License**.  

- **Personal and Educational Use Only**: You may use, modify, and distribute this software for personal or educational purposes.  
- **No Commercial Use**: Selling, sublicensing, or using this software for any commercial purposes is strictly prohibited.  
- **No Unauthorized Distribution**: Do not redistribute this software without explicit permission from the author.  

For full details, see the [LICENSE](LICENSE) file.

---

✍ **Author:** [Trung Huynh Chi](https://www.linkedin.com/in/trung-huynh-chi-pc01/) 
📧 For inquiries, contact via LinkedIn or GitHub.  
🚀 **Thank you for using this project!**

---

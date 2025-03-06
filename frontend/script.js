document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("customerDataForm");
    const nextStepButton = document.getElementById("nextStep");
    const originalDataOutput = document.getElementById("originalData");
    const encryptedDataOutput = document.getElementById("encryptedData");
    const decryptedDataOutput = document.getElementById("decryptedData");
    const resetFormButton = document.getElementById("resetForm");
    const encryptLoader = document.getElementById("encryptLoader");
    const decryptLoader = document.getElementById("decryptLoader");
  
    const steps = document.querySelectorAll(".process-step");
    let currentStep = 0;
  
    let publicKeyPem;
    let encryptedData;
  
    // --- Hàm hỗ trợ ---
  
    async function fetchPublicKey() {
      try {
        const response = await fetch("/get_public_key");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(`Server error: ${data.error}`);
        }
        publicKeyPem = data.public_key;
      } catch (error) {
        console.error("Error fetching public key:", error);
        alert(
          "Failed to fetch public key. Please check your connection and try again."
        );
      }
    }
  
    function importPublicKey(pemKey) {
      try {
        return forge.pki.publicKeyFromPem(pemKey);
      } catch (error) {
        console.error("Error importing public key:", error);
        alert("Invalid public key format.");
        return null;
      }
    }
  
    function encryptRSA(data, publicKey) {
      try {
        const encrypted = publicKey.encrypt(forge.util.encodeUtf8(data), "RSA-OAEP");
        return forge.util.encode64(encrypted);
      } catch (error) {
        console.error("Error encrypting data:", error);
        alert("Encryption failed.");
        return null;
      }
    }
  
    function validateForm() {
      let isValid = true;
      const fields = ["name", "idCard", "phone"];
  
      fields.forEach((fieldId) => {
        const input = document.getElementById(fieldId);
        if (!input.value.trim()) {
          input.classList.add("invalid-input");
          isValid = false;
        } else {
          input.classList.remove("invalid-input");
        }
      });
  
      const emailInput = document.getElementById("email");
      if (emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
        emailInput.classList.add("invalid-input");
        isValid = false;
      } else if (emailInput.value.trim()) {
        emailInput.classList.remove("invalid-input");
      }
  
      return isValid;
    }
  
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    // --- Khởi tạo ---
  
    async function initialize() {
      await fetchPublicKey();
      showStep(currentStep); // Hiển thị bước đầu tiên
    }
  
    function showStep(stepIndex) {
      steps.forEach((step, index) => {
        step.hidden = index !== stepIndex;
      });
    }
  
    initialize();
  
    // --- Xử lý sự kiện ---
  
    nextStepButton.addEventListener("click", async function () {
      switch (currentStep) {
        case 0: // Nhập dữ liệu
          if (!validateForm()) {
            alert("Vui lòng nhập đầy đủ thông tin và đúng định dạng.");
            return;
          }
          const customerData = {
            name: document.getElementById("name").value,
            idCard: document.getElementById("idCard").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            email: document.getElementById("email").value,
          };
          originalDataOutput.textContent = JSON.stringify(customerData, null, 2);
          currentStep = 1;
          showStep(currentStep);
          break;
  
        case 1: // Mã hóa
          nextStepButton.innerHTML = `Đang mã hóa... <i class="fas fa-spinner fa-spin"></i>`;
          nextStepButton.disabled = true;
          const publicKey = importPublicKey(publicKeyPem);
          if (!publicKey) return;
  
          const customerDataEncrypt = {
            name: document.getElementById("name").value,
            idCard: document.getElementById("idCard").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            email: document.getElementById("email").value,
          };
          encryptLoader.hidden = false;
  
          try {
            encryptedData = await new Promise((resolve, reject) => {
              setTimeout(() => {
                try {
                  const result = encryptRSA(
                    JSON.stringify(customerDataEncrypt),
                    publicKey
                  );
                  resolve(result);
                } catch (error) {
                  reject(error);
                }
              }, 500);
            });
  
            if (!encryptedData) {
              encryptLoader.hidden = true;
              nextStepButton.disabled = false;
              return;
            }
            encryptedDataOutput.textContent = encryptedData;
            nextStepButton.innerHTML = `Tiếp tục <i class="fas fa-arrow-right"></i>`;
            nextStepButton.disabled = false;
            currentStep = 2;
            showStep(currentStep);
          } catch (error) {
            console.error("Encryption error:", error);
            alert("Encryption failed.");
            encryptLoader.hidden = true;
            nextStepButton.disabled = false;
            return;
          } finally {
            encryptLoader.hidden = true;
          }
          break;
  
        case 2: // Gửi dữ liệu (hiển thị bước 3)
          currentStep = 3;
          // *Thêm nội dung vào bước 3*
          document.querySelector("#step3 .step-content").innerHTML = `
                      <h3>3. Gửi dữ liệu</h3>
                      <p>Dữ liệu đã mã hóa được gửi lên server.</p>
                  `;
          showStep(currentStep);
          break;
  
        case 3: // Giải mã (hiển thị bước 4, thực hiện giải mã)
          currentStep = 4;
          // *Thêm nội dung vào bước 4*
          document.querySelector("#step4 .step-content").innerHTML = `
                      <h3>4. Giải mã dữ liệu</h3>
                      <p>Server giải mã dữ liệu bằng khóa riêng.</p>
                  `;
          showStep(currentStep);
          nextStepButton.innerHTML = `Đang giải mã... <i class="fas fa-spinner fa-spin"></i>`;
          nextStepButton.disabled = true;
          decryptLoader.hidden = false;
  
          try {
            const response = await fetch("/decrypt", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ encrypted_data: encryptedData }),
            });
  
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
  
            const result = await response.json();
  
            if (result.error) {
              throw new Error(`Server error: ${result.error}`);
            }
  
            decryptedDataOutput.textContent = JSON.stringify(
              JSON.parse(result.decrypted_data),
              null,
              2
            );
            nextStepButton.hidden = true;
            resetFormButton.hidden = false;
          } catch (error) {
            console.error("Error during decryption:", error);
            alert("Decryption failed. Please check the server and your data.");
            nextStepButton.hidden = true;
            resetFormButton.hidden = false;
          } finally {
            decryptLoader.hidden = true;
          }
          break;
      }
    });
  
    resetFormButton.addEventListener("click", function () {
      form.reset();
      originalDataOutput.textContent = "";
      encryptedDataOutput.textContent = "";
      decryptedDataOutput.textContent = "";
  
      currentStep = 0; // Reset về bước 0
      showStep(currentStep); // *Hiển thị lại bước 0*
  
      nextStepButton.hidden = false;
      nextStepButton.innerHTML = `Tiếp tục <i class="fas fa-arrow-right"></i>`;
      nextStepButton.disabled = false; // Bật lại nút
      resetFormButton.hidden = true;
  
      const inputs = form.querySelectorAll("input");
      inputs.forEach((input) => input.classList.remove("invalid-input"));
    });
  });
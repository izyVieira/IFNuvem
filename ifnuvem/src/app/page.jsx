"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor, selecione um arquivo primeiro.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setMessage("Enviando arquivo...");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: file,
        headers: {
          "Content-Type": file.type,
          "X-File-Name": file.name,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro: ${await response.text()}`);
      }

      const result = await response.json();
      setMessage("");
      setSuccessModal(true);
    } catch (error) {
      setMessage(`Erro ao enviar arquivo: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#333", fontSize: "1.5rem", marginBottom: "1rem" }}>
          Enviar para o Google Drive
        </h2>
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        />
        <button
          onClick={handleUpload}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
        >
          Fazer Upload
        </button>
        {message && (
          <p
            style={{
              marginTop: "1rem",
              color: message.includes("Erro") ? "#FF4E4E" : "#4CAF50",
              fontSize: "0.9rem",
            }}
          >
            {message}
          </p>
        )}
      </div>

      {successModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setSuccessModal(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "80%",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#4CAF50", marginBottom: "1rem" }}>
              Upload realizado com sucesso!
            </h3>
            <p style={{ color: "#333", fontSize: "1rem", marginBottom: "1rem" }}>
              Seu arquivo foi enviado com sucesso para o Google Drive.
            </p>
            <button
              onClick={() => setSuccessModal(false)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

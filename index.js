import express from "express";
import { io } from "socket.io-client";
import cors from "cors";

const app = express();
app.use(cors());

let cachedMembers = [];
let socketConnected = false;

// Conexión al socket backend
const socket = io("http://bc-api.estelarbet.net", {
  transports: ["polling"], // evita errores por WebSocket en serverless
});

// Eventos del socket
socket.on("connect", () => {
  console.log("✅ Conectado al servidor de campaña");
  socketConnected = true;
});

socket.on("connect_error", (err) => {
  console.error("❌ Error de conexión:", err.message);
  socketConnected = false;
});

socket.on("campaign-1", (members) => {
  console.log("📦 Datos recibidos:", members.length, "usuarios");
  cachedMembers = members;
});

// Endpoint REST
app.get("/members", (req, res) => {
  if (!socketConnected || cachedMembers.length === 0) {
    return res.json([
      {
        rut: "00000000-0",
        fullName: "SIN DATOS",
        isRegistered: "false",
        isVerified: "false",
        didDeposit: "false"
      }
    ]);
  }

  res.json(cachedMembers);
});

// Iniciar servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy en puerto ${PORT}`);
});

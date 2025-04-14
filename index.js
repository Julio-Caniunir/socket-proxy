import express from "express";
import { io } from "socket.io-client";
import cors from "cors";

const app = express();
app.use(cors());

let cachedMembers = [];
let socketConnected = false;

const socket = io("http://bc-api.estelarbet.net", {
  transports: ["polling"],
});

socket.on("connect", () => {
  console.log("✅ Conectado al servidor de campaña");
  socketConnected = true;
});

socket.on("campaign-1", (data) => {
  console.log("📦 Datos recibidos:", data.length, "usuarios");
  cachedMembers = data;
});

socket.on("connect_error", (err) => {
  console.error("❌ Error de conexión:", err.message);
  socketConnected = false;
});

app.get("/members", (req, res) => {
  if (!socketConnected) {
    return res.status(502).json({ error: "No conectado al backend aún." });
  }

  res.json(cachedMembers);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy en puerto ${PORT}`);
});

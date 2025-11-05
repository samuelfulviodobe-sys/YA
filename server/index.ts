import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Corrigir caminhos (necessário em ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware padrão
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir o frontend do Vite (build)
const clientDistPath = path.resolve(__dirname, "../dist/client");
app.use(express.static(clientDistPath));

app.get("*", (_req, res) => {
res.sendFile(path.join(clientDistPath, "index.html"));
});

// Porta Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
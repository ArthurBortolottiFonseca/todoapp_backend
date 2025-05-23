const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - IMPORTANTE: estas linhas devem vir ANTES das rotas
app.use(cors());
app.use(express.json());  // Esta linha é crucial para interpretar o corpo JSON

const PORT = process.env.PORT || 3000;

// Conexão com o Banco de Dados
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database Connected');
}).catch((error) => {
  console.error('Database Connection Error:', error);
});

// Rotas - IMPORTANTE: estas linhas devem vir DEPOIS dos middlewares
const routes = require('./routes/routes');
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
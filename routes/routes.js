const express = require('express');
const router = express.Router();
const modeloTarefa = require('../models/tarefa');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const autenticarToken = require('../middleware/auth');

// ROTAS DE USUÁRIO

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({ nome, email, senha: senhaHash });
    await novoUsuario.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao registrar usuário', error });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ message: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ message: 'Senha inválida' });

    // Gera o token JWT
    const token = jwt.sign(
      { userId: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || 'segredo',
      { expiresIn: '2h' }
    );

    res.json({ token, nome: usuario.nome, email: usuario.email });
  } catch (error) {
    res.status(500).json({ message: 'Erro no login', error });
  }
});

// ROTAS DE TAREFAS (protegidas por autenticação)

// Obter todas as tarefas (GET)
router.get('/getAll', autenticarToken, async (req, res) => {
  try {
    const tarefas = await modeloTarefa.find();
    res.status(200).json(tarefas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Adicionar uma nova tarefa (POST)
router.post('/post', autenticarToken, async (req, res) => {
  const objetoTarefa = new modeloTarefa({
    descricao: req.body.descricao,
    statusRealizada: req.body.statusRealizada
  });
  try {
    const tarefaSalva = await objetoTarefa.save();
    res.status(200).json(tarefaSalva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remover uma tarefa (DELETE)
router.delete('/delete/:id', autenticarToken, async (req, res) => {
  try {
    const id = req.params.id;
    const tarefaRemovida = await modeloTarefa.findByIdAndDelete(id);
    res.status(200).json(tarefaRemovida);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar uma tarefa (PATCH)
router.patch('/update/:id', autenticarToken, async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;
    const options = { new: true };
    const tarefaAtualizada = await modeloTarefa.findByIdAndUpdate(
      id, dadosAtualizados, options
    );
    res.status(200).json(tarefaAtualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
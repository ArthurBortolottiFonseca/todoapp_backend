const express = require('express');
const router = express.Router();
const modeloTarefa = require('../models/tarefa');

// Rota para obter todas as tarefas (GET)
router.get('/getAll', async (req, res) => {
    try {
        const tarefas = await modeloTarefa.find();
        res.status(200).json(tarefas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para adicionar uma nova tarefa (POST)
router.post('/post', async (req, res) => {
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

// Rota para remover uma tarefa (DELETE)
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const tarefaRemovida = await modeloTarefa.findByIdAndDelete(id);
        res.status(200).json(tarefaRemovida);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rota para atualizar uma tarefa (PATCH)
router.patch('/update/:id', async (req, res) => {
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
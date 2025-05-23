const express = require('express');
const router = express.Router();
const modeloTarefa = require('../models/tarefa');

//Post Method
router.post('/post', async (req, res) => {
    const objetoTarefa = new modeloTarefa({
        descricao: req.body.descricao,
        statusRealizada: req.body.statusRealizada
    })
    try {
        const tarefaSalva = await objetoTarefa.save();
        res.status(200).json(tarefaSalva)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;
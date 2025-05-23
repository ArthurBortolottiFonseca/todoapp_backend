const mongoose = require('mongoose');
const tarefaSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
  statusRealizada: { type: Boolean, required: true }
});
module.exports = mongoose.model('tarefas', tarefaSchema);
// Backend - Node.js + Express
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

// JSON file la save pannuvom
const FILE = 'feedbacks.json';
if(!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]');

function getData(){
  return JSON.parse(fs.readFileSync(FILE));
}
function saveData(data){
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// GET - All feedbacks vaangu
app.get('/api/feedbacks', (req, res) => {
  res.json(getData());
});

// POST - Puthu feedback save pannu
app.post('/api/feedbacks', (req, res) => {
  let data = getData();
  data.unshift(req.body);
  saveData(data);
  res.json({ success: true, message: 'Feedback saved!' });
});

// DELETE - Feedback delete pannu
app.delete('/api/feedbacks/:id', (req, res) => {
  let data = getData();
  data.splice(req.params.id, 1);
  saveData(data);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});

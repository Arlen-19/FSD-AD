const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let items = [];
let nextId = 1;

app.post('/register', (req, res) => {
  const { name, roll, course, email, phone } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  if (!roll) return res.status(400).json({ error: 'roll is required' });
  if (!course) return res.status(400).json({ error: 'course is required' });
  if (!email) return res.status(400).json({ error: 'email is required' });
  if (!phone) return res.status(400).json({ error: 'phone is required' });

  const newItem = { id: nextId++, name, roll, course, email, phone };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.get('/about', (req, res) => {
  res.json(items);
});

app.get('/contact/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((i) => i.id === id);
  return item
    ? res.json(item)
    : res.status(404).json({ error: 'Item not found' });
});

app.put('/update/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, roll, course, email, phone } = req.body;
  const item = items.find((i) => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (!name) return res.status(400).json({ error: 'name is required' });

  item.name = name;
  item.roll = roll;
  item.course = course;
  item.email = email;
  item.phone = phone;
  res.json(item);
});

app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });

  const deleted = items.splice(idx, 1)[0];
  res.json({ message: 'Deleted', item: deleted });
});

app.get('/', (req, res) => res.send('Welcome Sir ji !!'));

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
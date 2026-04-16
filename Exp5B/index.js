require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/backenddb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const studentSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true, min: 3 },
    email: { type: String, required: true },
    age: { type: Number, min: 0 },
    hobbies: [String],
    bio: { type: String, max: 200 },
    createdAt: { type: Date, default: Date.now },
});

studentSchema.index({ name: 1 });
studentSchema.index({ email: 1, age: 1 });
studentSchema.index({ hobbies: 1 });
studentSchema.index({ bio: 'text' });
studentSchema.index({ userId: 'hashed' });
studentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Student = mongoose.model('Student', studentSchema);


app.post('/add', async (req, res, next) => {
  try {
    const { userId, name, email, age, hobbies, bio } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const student = new Student({
      userId: userId || new mongoose.Types.ObjectId().toString(),
      name,
      email,
      age,
      hobbies,
      bio,
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    next(error);
  }
});

app.get('/students', async (req, res, next) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    next(error);
  }
});

app.put('/update/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, age, hobbies, bio } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { name, email, age, hobbies, bio },
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(updatedStudent);
    } catch (error) {
        next(error);
    }
});

app.delete('/delete/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(deletedStudent);
    } catch (error) {
        next(error);
    }
});

app.get('/findbyname/:name', async (req, res, next) => {
    try {
        const { name } = req.params;
        const students = await Student.find({ name: new RegExp(name, 'i') });
        res.json(students);
    } catch (error) {
        next(error);
    }
});

app.get('/filterbyemailandage/:email/:age', async (req, res, next) => {
    try {
        const { email, age } = req.params;
        const students = await Student.find({ email: new RegExp(email, 'i'), age: parseInt(age) });
        res.json(students);
    } catch (error) {
        next(error);
    }
});

app.get('/findbyhobbies/:hobby', async (req, res, next) => {
    try {
        const { hobby } = req.params;
        const students = await Student.find({ hobbies: hobby });
        res.json(students);
    } catch (error) {
        next(error);
    }
});

app.get('/textsearchonbio/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const students = await Student.find({ $text: { $search: keyword } });
        res.json(students);
    } catch (error) {
        next(error);
    }
});


// Postlab 1

app.get('/api/explain', async (req, res) => {
  try {
    const { email, age } = req.query;

    const filter = {};
    if (email) filter.email = email;
    if (age) filter.age = parseInt(age);

    const explain = await Student.find(filter).explain('executionStats');
    
    res.json({
      query: filter,
      stats: {
        keysExamined: explain.executionStats.totalKeysExamined,
        docsExamined: explain.executionStats.totalDocsExamined,
        executionTimeMillis: explain.executionStats.executionTimeMillis,
        indexName: explain.executionStats.executionStages.stage,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Postlab 1
// {
//   "error": "Student validation failed: email: Path `email` is required."
// }

// {
//   "error": "E11000 duplicate key error collection: backenddb.students index: email_1 dup key: { email: \"john@example.com\" }"
// }


const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
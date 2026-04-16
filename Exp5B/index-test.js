require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/backenddb';

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

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

const showStats = (label, explain) => {
  const stats = explain.executionStats || explain;
  console.log(`\n=== ${label} ===`);
  console.log('keysExamined:', stats.totalKeysExamined || stats.totalKeysExamined === 0 ? stats.totalKeysExamined : 'n/a');
  console.log('docsExamined:', stats.totalDocsExamined || stats.totalDocsExamined === 0 ? stats.totalDocsExamined : 'n/a');
  console.log('executionTimeMillis:', stats.executionTimeMillis || 'n/a');
};

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to', MONGODB_URI);

    await Student.deleteMany({});

    const sampleStudents = [
      {
        userId: 'user-1',
        name: 'Alice',
        email: 'alice@example.com',
        age: 28,
        hobbies: ['reading', 'swimming'],
        bio: 'Software engineer with a love for open source.',
      },
      {
        userId: 'user-2',
        name: 'Bob',
        email: 'bob@example.com',
        age: 35,
        hobbies: ['cycling', 'hiking'],
        bio: 'Project manager who enjoys fitness and team building.',
      },
      {
        userId: 'user-3',
        name: 'Carol',
        email: 'carol@example.com',
        age: 23,
        hobbies: ['reading', 'coding', 'gaming'],
        bio: 'Junior developer learning backend APIs.',
      },
      {
        userId: 'user-4',
        name: 'David',
        email: 'david@example.com',
        age: 28,
        hobbies: ['swimming', 'gaming'],
        bio: 'Quality analyst passionate about test automation.',
      },
    ];

    await Student.insertMany(sampleStudents);
    console.log('Sample data inserted.');
    
    await Student.init();

    const queries = [
      {
        label: 'name index (single-field)',
        query: () => Student.find({ name: 'Alice' }).explain('executionStats'),
      },
      {
        label: 'compound index (email+age)',
        query: () => Student.find({ email: 'alice@example.com', age: 28 }).explain('executionStats'),
      },
      {
        label: 'multikey index (hobbies)',
        query: () => Student.find({ hobbies: 'reading' }).explain('executionStats'),
      },
      {
        label: 'text index (bio)',
        query: () => Student.find({ $text: { $search: 'engineer' } }).explain('executionStats'),
      },
      {
        label: 'hashed index (userId)',
        query: () => Student.find({ userId: 'user-2' }).explain('executionStats'),
      },
      {
        label: 'TTL index ignored in query (createdAt)',
        query: () => Student.find({ createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24) } }).explain('executionStats'),
      },
    ];

    for (const q of queries) {
      const explain = await q.query();
      const stats = explain.executionStats || explain;
      showStats(q.label, stats);
    }

  } catch (err) {
    console.error('Error in test script:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
})();
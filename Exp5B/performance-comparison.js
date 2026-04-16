require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/backenddb';

// Schema WITHOUT indexes
const studentSchemaNoIndex = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true, min: 3 },
  email: { type: String, required: true },
  age: { type: Number, min: 0 },
  hobbies: [String],
  bio: { type: String, max: 200 },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'students_no_index' });

// Schema WITH indexes
const studentSchemaWithIndex = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true, min: 3 },
  email: { type: String, required: true },
  age: { type: Number, min: 0 },
  hobbies: [String],
  bio: { type: String, max: 200 },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'students_with_index' });

// Apply indexes to WITH_INDEX schema
studentSchemaWithIndex.index({ name: 1 });
studentSchemaWithIndex.index({ email: 1, age: 1 });
studentSchemaWithIndex.index({ hobbies: 1 });
studentSchemaWithIndex.index({ bio: 'text' });
studentSchemaWithIndex.index({ userId: 'hashed' });

const StudentNoIndex = mongoose.model('StudentNoIndex', studentSchemaNoIndex);
const StudentWithIndex = mongoose.model('StudentWithIndex', studentSchemaWithIndex);

const showStats = (label, explain) => {
  const stats = explain.executionStats || explain;
  console.log(`\n📊 ${label}`);
  console.log('   ├─ Keys Examined:', stats.totalKeysExamined || 'n/a');
  console.log('   ├─ Docs Examined:', stats.totalDocsExamined || 'n/a');
  console.log('   └─ Time (ms):', stats.executionTimeMillis || 'n/a');
};

const performanceComparison = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`\n✓ Connected to MongoDB: ${MONGODB_URI}\n`);

    // Load data from JSON
    const dataFilePath = path.join(__dirname, 'data.json');
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const students = JSON.parse(data);

    console.log(`📋 Loaded ${students.length} student records from data.json\n`);

    // Clear existing collections
    await StudentNoIndex.deleteMany({});
    await StudentWithIndex.deleteMany({});
    console.log('🗑️  Cleared existing collections\n');

    // Insert data into both collections
    await StudentNoIndex.insertMany(students);
    await StudentWithIndex.insertMany(students);
    console.log(`✅ Inserted ${students.length} documents into both collections\n`);

    // Wait for indexes to be built
    await StudentWithIndex.init();

    // Define test queries
    const queries = [
      {
        label: 'Single-field query (name)',
        query: (Model) => Model.find({ name: 'Alice Smith' }).explain('executionStats'),
      },
      {
        label: 'Compound query (email + age)',
        query: (Model) => Model.find({ email: 'alice.smith1@example.com', age: 28 }).explain('executionStats'),
      },
      {
        label: 'Multikey query (hobbies)',
        query: (Model) => Model.find({ hobbies: 'reading' }).explain('executionStats'),
      },
      {
        label: 'Range query (age)',
        query: (Model) => Model.find({ age: { $gte: 25, $lte: 35 } }).explain('executionStats'),
      },
      {
        label: 'Text search (bio)',
        query: (Model) => Model.find({ $text: { $search: 'engineer' } }).explain('executionStats'),
      },
    ];

    console.log('═'.repeat(70));
    console.log('⚡ PERFORMANCE COMPARISON: WITH vs WITHOUT INDEXES');
    console.log('═'.repeat(70));

    // Run all queries
    for (const q of queries) {
      console.log(`\n🔍 ${q.label}`);
      console.log('─'.repeat(50));

      try {
        // Query WITHOUT index
        const explainNoIndex = await q.query(StudentNoIndex);
        showStats('❌ WITHOUT INDEX', explainNoIndex);
      } catch (err) {
        console.log('❌ WITHOUT INDEX - Error:', err.message);
      }

      try {
        // Query WITH index
        const explainWithIndex = await q.query(StudentWithIndex);
        showStats('✅ WITH INDEX', explainWithIndex);
      } catch (err) {
        console.log('✅ WITH INDEX - Error:', err.message);
      }
    }

    console.log('\n' + '═'.repeat(70));
    console.log('📈 ANALYSIS');
    console.log('═'.repeat(70));
    console.log(`
✓ Collections: students_no_index vs students_with_index
✓ Each contains ${students.length} documents
✓ Metrics:
  - Keys Examined: Number of index entries scanned
  - Docs Examined: Number of full documents read
  - Time: Query execution time in milliseconds

✓ Key Observations:
  - If docsExamined ≈ # of records → Collection scan (no index)
  - If docsExamined << # of records → Using index (efficient)
  - Time diff shows real-world performance improvement
    `);

    console.log('═'.repeat(70) + '\n');

  } catch (err) {
    console.error('❌ Error in performance test:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  }
};

// Run the comparison
performanceComparison();

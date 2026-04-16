require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

/**
 * Load data from JSON file and insert into MongoDB database
 * @param {string} filePath - Path to JSON file with student data
 * @returns {Promise<void>}
 */
const loadDataFromJSON = async (filePath) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB:', MONGODB_URI);

    // Read JSON file
    const data = fs.readFileSync(filePath, 'utf-8');
    const students = JSON.parse(data);

    console.log(`\n📋 Parsed ${students.length} student records from ${path.basename(filePath)}`);

    // Clear existing collection
    await Student.deleteMany({});
    console.log('🗑️  Cleared existing student collection');

    // Insert data into database
    const result = await Student.insertMany(students);
    console.log(`\n✅ Successfully inserted ${result.length} documents into database!`);

    // Display sample inserted data
    console.log('\n📊 Sample of inserted data (first 3 records):');
    const sampleData = await Student.find().limit(3);
    console.log(JSON.stringify(sampleData, null, 2));

    // Display statistics
    const totalCount = await Student.countDocuments();
    const avgAge = await Student.aggregate([
      { $group: { _id: null, avgAge: { $avg: '$age' } } }
    ]);

    console.log('\n📈 Database Statistics:');
    console.log(`   Total Documents: ${totalCount}`);
    console.log(`   Average Age: ${avgAge[0].avgAge.toFixed(2)}`);

  } catch (err) {
    console.error('❌ Error loading data:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the function
const dataFilePath = path.join(__dirname, 'data.json');
console.log('🚀 Starting data import process...\n');
loadDataFromJSON(dataFilePath);

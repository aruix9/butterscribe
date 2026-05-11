import mongoose from 'mongoose';
import Document from '../src/models/document';
import { connectToDatabase } from '../src/lib/db';

async function verify() {
  try {
    await connectToDatabase();
    console.log('Connected to DB');

    const testDoc = await Document.create({
      title: 'Verification Test',
      body: '<p>Test content</p>',
      userId: new mongoose.Types.ObjectId(), // Fake ID
      status: 'draft'
    });

    console.log('Document created:', testDoc._id);

    const found = await Document.findById(testDoc._id);
    console.log('Document found:', found?.title);

    await Document.findByIdAndDelete(testDoc._id);
    console.log('Test document cleaned up');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

verify();

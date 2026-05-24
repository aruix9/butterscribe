import mongoose from "mongoose";

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalWithMongoose = global as any;

const cached: Cached = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

globalWithMongoose.mongoose = cached;

export const connectToDatabase = async (
  MONGODB_URI = `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`,
) => {
  if (!MONGODB_URI) {
    throw new Error("MongoDB URI is missing");
  }

  // Reuse cached connection
  if (cached.conn) {
    console.log(
      `✅ Using cached MongoDB connection - ${process.env.MONGODB_NAME}`,
    );

    return cached.conn;
  }

  try {
    // Create connection promise only once
    if (!cached.promise) {
      console.log(
        `🔄 Creating new MongoDB connection - ${process.env.MONGODB_NAME}`,
      );

      cached.promise = mongoose.connect(MONGODB_URI);
    }

    cached.conn = await cached.promise;

    console.log(
      `✅ DB connection successful! - ${process.env.MONGODB_NAME}`,
    );

    return cached.conn;
  } catch (error) {
    cached.promise = null;

    console.error("❌ MongoDB connection failed:", error);

    throw error;
  }
};
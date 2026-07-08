import mongoose from "mongoose"

// Track connection status state across serverless lifecycles
const connectionState = { isConnected: false }

const connectDB = async () => {
  // If an active connection already exists in this serverless container, reuse it
  if (connectionState.isConnected) {
    console.log("// Reusing active database connection matrix pipeline...")
    return
  }

  try {
    const dbUri = process.env.DB_URL
    if (!dbUri) {
      throw new Error("CRITICAL: DB_URL environment variable is missing.")
    }

    const dbConnection = await mongoose.connect(dbUri)

    // Update state based on Mongoose readiness states (1 = Connected)
    connectionState.isConnected = dbConnection.connections[0].readyState === 1
    console.log(
      "// [SUCCESS] Shared memory database pipeline allocation complete.",
    )
  } catch (error) {
    console.error(
      "// [FAILURE] Database transport layer handshake failed:",
      error.message,
    )
    // Do not crash the entire process on Vercel; allow the next invoke to try reconnecting
  }
}

export default connectDB

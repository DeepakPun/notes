import mongoose from "mongoose"

// Track connection status state across serverless lifecycles
const connectionState = {
  isConnected: false,
}

// Global error listener to catch connection drops after the initial handshake
mongoose.connection.on("error", (err) => {
  console.error("❌ [CRITICAL] Mongoose Post-Connection Error:", err.message)
})

const connectDB = async () => {
  // If an active connection already exists in this serverless container, reuse it
  if (connectionState.isConnected) {
    const conn = mongoose.connection
    console.log("// Reusing active database connection matrix pipeline...")
    console.log(
      `🔗 [CACHE INSTANCE] Connected Host: ${conn.host} | DB Name: ${conn.name}`,
    )
    return
  } else {
    connectionState.isConnected = false
  }

  try {
    const dbUri = process.env.DB_URL
    if (!dbUri) {
      throw new Error("CRITICAL: DB_URL environment variable is missing.")
    }

    // Attempt the initial connection handshake
    const dbConnection = await mongoose.connect(dbUri, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    // Update state based on Mongoose readiness states (1 = Connected)
    connectionState.isConnected = dbConnection.connections[0].readyState === 1

    // Extract relevant connection metadata
    const activeConnection = dbConnection.connections[0]
    const host = activeConnection.host
    const dbName = activeConnection.name

    console.log(
      "// [SUCCESS] Shared memory database pipeline allocation complete.",
    )
    console.log(`📡 [METRICS] Target Cluster Host: ${host}`)
    console.log(`🗄️  [METRICS] Active Database Name: ${dbName}`)

    // Fetch and display active collections available in this specific database target
    if (activeConnection.db) {
      const collections = await activeConnection.db.listCollections().toArray()
      const collectionNames = collections.map((col) => col.name)
      console.log(
        `📋 [METRICS] Registered Collections Found: [${collectionNames.join(", ")}]`,
      )
    }
  } catch (error) {
    console.error(
      "// [FAILURE] Database transport layer handshake failed:",
      error.message,
    )
    // Do not crash the entire process on Vercel; allow the next invoke to try reconnecting
  }
}

export default connectDB

import mongoose from "mongoose"

const NoteSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "Untitled Note Node",
    },
    content: {
      type: String,
      required: true,
    },
    folderName: {
      type: String,
      default: "Root_Directory",
    },
    tags: [
      {
        type: String,
      },
    ],

    coreFeatures: [
      {
        type: String,
      },
    ],
    codeSnippet: {
      type: String,
    },
    useCase: {
      type: String,
    },
    officialDocs: {
      type: String,
    },

    // System Telemetry Metrics
    plainTextSummary: {
      type: String,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Note || mongoose.model("Note", NoteSchema)

import mongoose from "mongoose"

const NoteSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Note Node",
    },

    content: {
      type: String,
      required: true,
    },

    plainTextSummary: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    folderName: {
      type: String,
      trim: true,
      default: "Root_Directory",
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    wordCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

NoteSchema.index({ title: "text", plainTextSummary: "text" })
NoteSchema.index({ updatedAt: -1 })

const Note = mongoose.model("Note", NoteSchema)
export default Note

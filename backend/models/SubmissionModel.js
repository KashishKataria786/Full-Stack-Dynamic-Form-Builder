import mongoose from "mongoose";

const { Schema } = mongoose;

const SubmissionSchema = new Schema(
  {
    form: { type: Schema.Types.ObjectId, ref: "Forms", required: true },

    data: { type: Schema.Types.Mixed, required: true },

    // submittedBy: { type: String },  
    
  },
  {
    timestamps: true 
  }
);

SubmissionSchema.index({ form: 1, createdAt: -1 });

export const SubmissionModel = mongoose.model("Submission", SubmissionSchema);

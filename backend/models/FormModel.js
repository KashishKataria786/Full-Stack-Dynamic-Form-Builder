import mongoose from "mongoose";


const FieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },     
    label: { type: String, required: true },    
    type: {
      type: String,
      required: true,
      enum: ["text", "email", "number", "textarea", "select", "checkbox", "date"]
    },
    required: { type: Boolean, default: true },

    options: [{ type: String }],


    min: { type: Number },
    max: { type: Number },

    
    order: { type: Number, default: 0 } 
  },
  { _id: false }
);


const FormSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, 
    title: { type: String, required: true },             
    description: { type: String },                      
    fields: { type: [FieldSchema], default: [] },        
    isActive: { type: Boolean, default: true },
    version: { type: Number, default: 1 }
  },
  {
    timestamps: true 
  }
);
const FormModel = new  mongoose.model('Forms',FormSchema);

export default FormModel ;
import FormModel from "../models/FormModel.js";
import { SubmissionModel } from "../models/SubmissionModel.js";

// export const createForm = async (req,res) => {
//   try {
//     const { key, title, description } = req.body;
//     if (!key || !title || !description)
//       return res
//         .status(400)
//         .send({ success: false, message: "Missing Fields" });
//     const form = await FormModel.create({
//       key: key,
//       title: title,
//       description: description,
//     });
//     if (!form)
//       return res
//         .status(400)
//         .send({ success: false, message: "Error in Creating Form" });

//     const submittionInstance= await SubmissionModel.create({form:form._id, data:[]})
//     return res
//       .status(201)
//       .send({
//         success: true,
//         message: "Form Created Successfully",
//         data: form,
//       });
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ success: false, message: "Internal Server Error", error: error });
//   }
// };

export const createForm = async (req, res) => {
    try {
        const { key, title, description, fields = [] } = req.body;
        
        // 1. Basic Input Validation
        if (!key || !title || !description) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields: key, title, or description." 
            });
        }
        
        // 2. Check for duplicate key (CRITICAL for form IDs)
        const existingForm = await FormModel.findOne({ key });
        if (existingForm) {
            return res.status(409).json({ 
                success: false, 
                message: `Form with key '${key}' already exists. Keys must be unique.` 
            });
        }

        // 3. Create the Form Definition
        const newForm = await FormModel.create({
            key,
            title,
            description,
            fields,
        });

        // 4. Create the Submission Instance Placeholder (If required by your app logic)
        // If SubmissionModel uses 'formId' to link to FormModel's _id:
        const submissionPlaceholder = await SubmissionModel.create({
    form: newForm._id, // CORRECT: Use the field name 'form' from the Submission Schema
    data: [] 
});

        // 5. Final Success Response (201 Created)
        return res.status(201).json({
            success: true,
            message: "Form definition and submission placeholder created successfully.",
            data: newForm,
            // Include submissionPlaceholder details for debugging/reference if needed
            submissionId: submissionPlaceholder._id 
        });

    } catch (error) {
        // Handle Mongoose/Database errors
        console.error("Error creating form or submission placeholder:", error);

        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error during form creation.", 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getAllForm = async(req,res)=>{
    try {
        const forms = await FormModel.find();
        return res.status(200).send({success:true, message:"Forms retrieved", data:forms})
    } catch (error) {
        return res
        .status(500)
        .send({ success: false, message: "Internal Server Error", error: error?.message });
    }
}

export const getParticularForm = async(req,res)=>{
    const {id} =req.params;
    try {
        const form = await FormModel.findById(id)
        if(!form)return res.status(400).send({success:false, message:"Form not Fpound"});
        return res.status(200).send({success:true, message:"Forms retrieved", data:form})
    } catch (error) {
        return res
        .status(500)
        .send({ success: false, message: "Internal Server Error", error: error });
    }
}

export const getParticularFormByKey = async (req, res) => {
    try {
        const { key: formKey } = req.params;

        // 1. Validate param
        if (!formKey) {
            return res.status(400).json({
                success: false,
                message: "Form key is missing from the request URL."
            });
        }

        // 2. Find the form by its 'key'
        const form = await FormModel.findOne({ key: formKey });

        if (!form) {
            return res.status(404).json({
                success: false,
                message: `Form not found with key: ${formKey}`
            });
        }

        // 3. Success
        return res.status(200).json({
            success: true,
            message: "Form retrieved successfully.",
            data: form
        });

    } catch (error) {
        console.error("Error fetching form by key:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error while retrieving form.",
            error: error.message || "Unknown error"
        });
    }
};

export const addAField= async(req,res)=>{
    
    try {
        const {key} = req.params;
    const {name, label, type} = req.body;
       if(!name || !label || !type)return res.status(400).send({success:false, message:"Missing required field properties"});

       const updatedForm =await FormModel.findOneAndUpdate({key:key}, {
        $push:{fields:{name, label, type}}
       }, { new: true, runValidators: true })

       if (!updatedForm) {
            return res.status(404).send({ success: false, message: `Form with key '${key}' not found.` });
        }
        return res.status(200).send({
            success: true,
            message: "Field added successfully.",
            data: updatedForm.fields.pop() 
        });
    } catch (error) {
        return res.status(500).send({success:false, message:"Field Added",data:field})
    }
}

export const addMultipleFieldsToForm = async (req, res) => {
    const { id } = req.params;
    const newFields = req.body.fields; 

    if (!Array.isArray(newFields) || newFields.length === 0) {
        return res
            .status(400)
            .send({ success: false, message: "Request body must contain a non-empty array named 'fields'." });
    }

    try {
        const updatedForm = await FormModel.findOneAndUpdate(
            { _id:id }, 
            { $push: { 
                fields: { 
                    $each: newFields 
                } 
            } },
            
            { new: true, runValidators: true } 
        );

      
        if (!updatedForm) {
            return res.status(404).send({ success: false, message: `Form with key '${key}' not found.` });
        }

        
        return res.status(200).send({
            success: true,
            message: `${newFields.length} field(s) added successfully.`,
            data: updatedForm.fields 
        });
        
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).send({ 
                success: false, 
                message: "Validation failed for one or more fields.", 
                errors: error.message 
            });
        }
        
        return res
            .status(500)
            .send({ 
                success: false, 
                message: "Internal Server Error", 
                error: error.message || error 
            });
    }
};




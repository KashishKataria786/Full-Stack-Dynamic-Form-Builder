import { SubmissionModel } from "../models/SubmissionModel.js";

export const getAllSubmissionsBasedOnId = async(req,res)=>{
    const {id}=req.params;
    if(!id)return res.status(404).send({success:false,message:"Missing Id "});
    try{
        const data = await SubmissionModel.findOne({_id:id});
        if(!data)return res.status(400).send({success:false, message:"Data not Found"});
        return res.status(200).send({success:true, message:"Submisstion REtrieved Successfully", data:data});

    }catch(error){
        console.error("Error fetching submission but ID:", error);
        
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error while retrieving submiission.",
                    error: error.message || "Unknown error"
                });
    }
}


export const addDataToForm = async (req, res) => {
    const { id: formId } = req.params; // Renaming 'id' to 'formId' for clarity
    const { formData } = req.body;
    
    // 1. Input Validation
    if (!formData || !Array.isArray(formData) || formData.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing or invalid submission data in the request body. Expected a non-empty array." 
        });
    }

    try {
        // 2. Atomic Update: Use findOneAndUpdate with $push
        // This operation is performed directly on the database, making it atomic
        // and protecting against simultaneous submissions overwriting each other.
        const updatedSubmission = await SubmissionModel.findOneAndUpdate(
            { form: formId }, // Query: Find the Submission document linked to this formId
            { $push: { data: formData } }, // Update: Atomically push the new formData into the 'data' array
            { 
                new: true, // Returns the document AFTER the update is applied
                runValidators: true // Ensures Mongoose validation rules are applied
            } 
        );

        // 3. Check for Not Found (404)
        if (!updatedSubmission) {
            return res.status(404).json({ 
                success: false, 
                message: `Submission record not found for Form ID: ${formId}.` 
            });
        }

        // 4. Success Response (201 Created is often semantic for new data)
        return res.status(201).json({
            success: true,
            message: "Data submitted and recorded successfully.",
            data: updatedSubmission
        });
        
    } catch (error) {
        console.error("Error submitting data to form:", formId, error);

        // Handle specific Mongoose Errors
        if (error.name === 'CastError') {
             return res.status(400).json({ 
                success: false, 
                message: "Invalid Form ID format.", 
                error: error.message
            });
        }
        
        if (error.name === 'ValidationError') {
             return res.status(400).json({ 
                success: false, 
                message: "Submission data validation failed.", 
                errors: error.errors
            });
        }

        // 5. Generic Internal Server Error
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during data submission.",
            error: error.message || "Unknown error"
        });
    }
};
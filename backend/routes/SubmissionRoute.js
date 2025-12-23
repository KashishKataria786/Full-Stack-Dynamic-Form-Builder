import express from 'express'
import { addDataToForm, getAllSubmissionsBasedOnId,getAllFields} from '../controller/SubmittionController.js';
const SubmissionRouter= express.Router();

SubmissionRouter.get('/submissions/:id', getAllSubmissionsBasedOnId);
SubmissionRouter.post('/submit/:id', addDataToForm);
SubmissionRouter.get('/get-schema/:id', getAllFields);

export default SubmissionRouter
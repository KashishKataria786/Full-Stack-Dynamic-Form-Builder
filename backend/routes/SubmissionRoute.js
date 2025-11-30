import express from 'express'
import { addDataToForm, getAllSubmissionsBasedOnId} from '../controller/SubmittionController.js';
const SubmissionRouter= express.Router();

SubmissionRouter.get('/submissions/:id', getAllSubmissionsBasedOnId);
SubmissionRouter.post('/submit/:id', addDataToForm);


export default SubmissionRouter
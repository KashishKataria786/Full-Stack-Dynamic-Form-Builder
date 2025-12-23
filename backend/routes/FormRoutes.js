import express from "express";
import {
  addMultipleFieldsToForm,
  createForm,
  getAllForm,
  getParticularForm,
  getParticularFormByKey,
  changeStatusOfForm,
  deleteForm,
} from "../controller/FormController.js";
const FormRouter = express.Router();

FormRouter.post("/create-form", createForm);
FormRouter.get("/all-forms", getAllForm);
FormRouter.post("/add-fields/:id", addMultipleFieldsToForm);
FormRouter.get("/:id", getParticularForm);
FormRouter.get("/key/:key", getParticularFormByKey);
FormRouter.patch('/status-update/:id',changeStatusOfForm);
FormRouter.delete('/delete/:id',deleteForm);


export default FormRouter;

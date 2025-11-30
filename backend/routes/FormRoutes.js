import express from "express";
import {
  addMultipleFieldsToForm,
  createForm,
  getAllForm,
  getParticularForm,
  getParticularFormByKey,
} from "../controller/FormController.js";
const FormRouter = express.Router();

FormRouter.post("/create-form", createForm);
FormRouter.get("/all-forms", getAllForm);
FormRouter.post("/add-fields/:id", addMultipleFieldsToForm);
FormRouter.get("/:id", getParticularForm);
FormRouter.get("/key/:key", getParticularFormByKey);

export default FormRouter;

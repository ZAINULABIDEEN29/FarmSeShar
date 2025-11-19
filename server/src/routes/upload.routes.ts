import express from "express";
import { authFarmer } from "../middlewares/auth.middleware.js";
import { uploadSingle, uploadMultiple } from "../middlewares/upload.middleware.js";
import {
  uploadSingleImage,
  uploadMultipleImagesController,
} from "../controllers/upload.controller.js";

const router = express.Router();

// Upload single image
router.post("/image", authFarmer, uploadSingle, uploadSingleImage);

// Upload multiple images
router.post("/images", authFarmer, uploadMultiple, uploadMultipleImagesController);

export default router;


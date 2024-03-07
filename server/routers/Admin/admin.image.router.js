const express = require("express");
const {
  adminGetImageByProductID,
  adminDeleteImage,
  adminAddImage,
  adminUpdateImage,
} = require("../../controllers/Admin/admin.image.controller");
const {
  sizeNameAdminValidation,
  sizeIDAdminValidation,
} = require("../../middlewares/validations/size.validation");
const { urlImageAdminValidation, fishIDAdminValidation, imageIDAdminValidation, imageAdminValidation } = require("../../middlewares/validations/image.validation");

const adminImageRoute = express.Router();

adminImageRoute.get("/:id", adminGetImageByProductID);
adminImageRoute.post("/:id", urlImageAdminValidation, fishIDAdminValidation, adminAddImage);
adminImageRoute.delete("/:id", imageIDAdminValidation, fishIDAdminValidation, adminDeleteImage);
adminImageRoute.put(
  "/:id",
  imageAdminValidation,
  adminUpdateImage
);

module.exports = adminImageRoute;

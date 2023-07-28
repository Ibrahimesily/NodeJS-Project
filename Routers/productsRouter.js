const express = require("express");
const router = express.Router();
const proModel = require("../Products/proSchema");
const CustomError = require("../Helper/customError");
const admin = require("../Authorizations/Authorization_admin");
//--------------------------------------------------------------------------- add product
router.post("/addproduct", admin, async (req, res, next) => {
    try {
      let { ProductName, Price, Description } = req.body;
      const newProduct = await proModel.create({
        ProductName,
        Price,
        Description,
      });
      res.status(200).send(newProduct);
    } catch {
      next(
        CustomError({
          stateCod: 401,
          message: "Error in add product API",
        })
      );
    }
  });
  //--------------------------------------------------------------------------- show all prouducts
router.get("/showpro", admin, async (req, res, next) => {
    try {
      const allpro = await proModel.find();
      res.status(200).send(allpro);
    } catch {
      next(
        CustomError({
          stateCod: 401,
          message: "Error in show all products API",
        })
      );
    }
  });
  //--------------------------------------------------------------------------- edit product
  router.patch("/editpro/:id", admin, async (req, res, next) => {
    try {
      const { id } = req.params;
      let { ProductName, Price, Description } = req.body;
      const edited_Product = await proModel.findByIdAndUpdate(id, {
        ProductName,
        Price,
        Description,
      });
      res.status(200).send({ edited_Product });
    } catch {
      next(
        CustomError({
          stateCod: 400,
          message: "Error in edit product API",
        })
      );
    }
  });
  //--------------------------------------------------------------------------- delete product
  router.delete("/deletepro/:id", admin, async (req, res, next) => {
    try {
      const { id } = req.params;
      const del_Product = await proModel.findOneAndDelete(id);
      res.status(200).send("deleted successfully");
    } catch {
      next(
        CustomError({
          statecod: 400,
          message: "Error in delete product API",
        })
      );
    }
  });

  module.exports = router
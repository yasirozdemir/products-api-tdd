import Express from "express";
import createHttpError from "http-errors";
import ProductsModel from "./model.js";

const ProductsRouter = Express.Router();

ProductsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductsModel(req.body);
    const { _id } = await newProduct.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

ProductsRouter.get("/", async (req, res, next) => {
  try {
    const resources = await ProductsModel.find();
    res.send(resources);
  } catch (error) {
    next(error);
  }
});

ProductsRouter.get("/:id", async (req, res, next) => {
  try {
    const resource = await ProductsModel.findById(req.params.id);
    if (resource) {
      res.send(resource);
    } else {
      next(
        createHttpError(404, `Resource with id ${req.params.id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

ProductsRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedResource = await ProductsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedResource) {
      res.send(updatedResource);
    } else {
      next(
        createHttpError(404, `Resource with id ${req.params.id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

ProductsRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedResource = await ProductsModel.findByIdAndUpdate(
      req.params.id
    );
    if (deletedResource) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Resource with id ${req.params.id} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default ProductsRouter;

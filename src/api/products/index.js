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
    const products = await ProductsModel.find();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

ProductsRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      next(createHttpError(404, `Product with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

ProductsRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(createHttpError(404, `Product with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

ProductsRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedProduct = await ProductsModel.findByIdAndUpdate(req.params.id);
    if (deletedProduct) {
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

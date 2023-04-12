import Express from "express";
import cors from "cors";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import ProductsRouter from "./api/products/index.js";

const server = Express();

const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
const corsOpt = {
  origin: (currentOrigin, corsNext) => {
    if (!currentOrigin || whiteList.indexOf(currentOrigin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(400, `Origin ${currentOrigin} is not in the whitelist!`)
      );
    }
  },
};

server.use(cors(corsOpt));
server.use(Express.json());

server.use("/products", ProductsRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

export default server;

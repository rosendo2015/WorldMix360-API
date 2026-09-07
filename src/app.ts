import express from "express";

import { mercadoLivreConfig } from "./configs/mercado-livre";
import { errorHandling } from "./middleware/error-handling";
import { routes } from "./routes";

const app = express();

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", mercadoLivreConfig.corsOrigin);

  response.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get("/health", (_request, response) => {
  return response.json({ status: "ok" });
});

app.use(routes);

app.use(errorHandling);

export { app };

import { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError";

export const errorHandlerMidleware: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
    // Vai se tratar de qualquer erro que a gente não tratar de forma específica
  } else if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: "Erro interno no servidor desconhecido" });
  }
};

import { log } from "console";
import cors from "cors";
import express from "express";
import { router } from "./router";
import { errorHandlerMidleware } from "./middlewares/ErrorHandler";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandlerMidleware);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

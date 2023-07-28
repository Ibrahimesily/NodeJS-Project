require("./db");
const userRouter = require("./Routers/userRouter");
const proudctRouter = require("./Routers/productsRouter")
const express = require("express");
const app = express();
require("dotenv").config();
//---------------------------------------------------------------------------
app.use(express.json());
app.use("/", userRouter);
app.use("/", proudctRouter)

app.use((err, req, res, next) => {
      res.status(err.status).send({message: err.message})
});
//---------------------------------------------------------------------------
app.listen(process.env.port, () => {
      console.log(`Server Runing on http://localhost${process.env.port}`);
});

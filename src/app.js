import express from "express";
import productsRouter from "./routes/products.route.js"
import cartsRouter from "./routes/carts.route.js"

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/",(req,res) =>{
    res.send("Hola Mundo")
});

app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
});
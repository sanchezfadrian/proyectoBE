import { Router } from "express";
import { CartManager } from "../classes/CartManager.js"

const router = Router();
const cartManager = new CartManager("carts.json");

router.get("/", async (req, res) => {
    try {
        const response = await cartManager.getCarts();
        res.json({ response });
    } catch (err) {
        res.status(500).json({ Message: "Error al obtener los carritos", data: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const response = await cartManager.createCart();
        res.json({ response });
    } catch (err) {
        res.status(500).json({ Message: "Error al crear el carrito", data: err });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const response = await cartManager.getCartById(cid);
        res.json({ response });
    } catch (err) {
        res.status(500).json({ Message: "Error al obtener el carrito", data: err });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const response = await cartManager.addProductToCart(cid, pid);
        res.json({ response });
    } catch (err) {
        res.status(500).json({ Message: "Error al agregar productos al carrito", data: err });
    }
});

export default router;
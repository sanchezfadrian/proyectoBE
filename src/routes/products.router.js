import { Router } from "express";
import { ProductManager } from "../classes/ProductManager.js"

const router = Router();
const productManager = new ProductManager("products.json");

router.get("/", async (req, res) => {
    try {
        let temporalProducts = productManager.getProducts();
        const { limit } = req.query;
        if (limit) temporalProducts.data = temporalProducts.slice(0, +limit);
        res.json({
            temporalProducts,
            limit: limit ? limit : "false",
            total: temporalProducts.length,
        });
    } catch (err) {
        res.status(500).json({ Message: "Error al obtener los productos", data: err });
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await productManager.getProductById(pid);
        res.json({ response })
    } catch (err) {
        res.status(500).json({ message: "Error al obtener el producto", data: err });
    }
  });

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await productManager.deleteProductById(pid);
        res.json({response});
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar el producto", data: err });
    }
});

router.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    try {
        const response = await productManager.addProduct(title, description, price, thumbnail, code, stock);
        res.json({ response });
    } catch (err) {
        res.status(500).json({ message: "Error al agregar el producto", data: err });
    }
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, thumbnail, code, stock } = req.body;
    try {
        let product = await productManager.getProductById(pid);
        if (product.data) {
            let productUpdated = {
                title: title || product.data.title,
                description: description || product.data.description,
                price: price || product.data.price,
                thumbnail: thumbnail || product.data.thumbnail,
                code: code || product.data.code,
                stock: stock || product.data.stock,
            };
        }
        const response = await productManager.updateProductById(pid, productUpdated);
        res.json({ response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error al actualizar el producto", data: err });
    }
});

export default router;
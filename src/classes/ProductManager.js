import fs from "fs";
import { __dirname } from "../utils.js";

class ProductManager {
    constructor(filePath) {
        this.path = __dirname + "/" + filePath;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error cargando productos:', error);
            this.products = [];
        }
        this.loadLastId();
    }

    loadLastId() {
        if (this.products.length > 0) {
            const lastProduct = this.products[this.products.length - 1];
            this.productIdCounter = lastProduct.id + 1;
        } else {
            this.productIdCounter = 1;
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (title == undefined || description == undefined || price == undefined || thumbnail == undefined || code == undefined || stock == undefined) {
            return { message: "Campos incompletos"};
        }
        if (this.products.find((product) => product.code === code)) {
            return { message: "Producto duplicado"};
        } else {
            const newProduct = { 
                id: this.productIdCounter,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
            this.products.push(newProduct);
            this.saveProducts();
            this.loadLastId();
            return { message: "Producto agregado correctamente", data: newProduct};;
        }
    }

    getProducts() {
        return { message: "Productos encontrados", data: this.products };
    }

    getProductById(id) {
        try {
            const productFound = this.products.find(product => product.id === +id);
            if (productFound) {
                return { message: "Producto encontrado", data: productFound };
            } else {
                return { message: "Producto no encontrado" };
            }
        } catch (error) {
            console.error('Error buscando el producto', error);
        }
    }

    deleteProductById(id) {
        const newProducts = this.products.filter((product) => product.id !== id);
        if (newProducts.length < this.products.length) {
            this.products = newProducts;
            this.saveProducts();
            return { message: "Producto eliminado correctamente" };
        } else {
            return { message: "Producto no encontrado" };
        }
    }

    updateProductById(id, productUpdated) {
        try{
            const index = this.products.findIndex((product) => product.id === id);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...productUpdated };
                this.saveProducts();
                return { message: "Producto actualizado correctamente", data: this.products[index] };
            } else {
                console.log("Producto no encontrado");
            }
        }
        catch{
            return { message: "Producto no encontrado" };
        }
    }

    async saveProducts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
            console.log('Productos guardados correctamente.');
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }

}

export { ProductManager };
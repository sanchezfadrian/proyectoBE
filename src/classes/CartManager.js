import fs from "fs";
import { __dirname } from "../utils.js";

class CartManager {
    constructor(filePath) {
        this.path = __dirname + "/" + filePath;
        this.carts = [];
        this.cartIdCounter = 1;
        this.loadCart();
    }

    async loadCart() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.error('Error cargando productos:', error);
            this.carts = [];
        }
        this.loadLastId();
    }

    loadLastId() {
        if (this.carts.length > 0) {
            const lastCart = this.carts[this.carts.length - 1];
            this.cartIdCounter = lastCart.id + 1;
        } else {
            this.cartIdCounter = 1;
        }
    }

    getCarts() {
        return { message: "Carritos encontrados", data: this.carts };
    }

    createCart() {
        try{
            const newCart = {
                id: this.cartIdCounter,
                products: [],
            };
            this.carts.push(newCart);
            this.saveCarts();
            this.loadLastId();
            return { message: "Carrito creado correctamente", data: newCart};
        } catch(err){
            return { message: "Error al crear el carrito", data: err };
        }
    }

    getCartById(cid) {
        try {
            const cartFound = this.carts.find(cart => cart.id === +cid);
            if (cartFound !== undefined) {
                return { message: "Carrito encontrado", data: cartFound };
            } else {
                return { message: "No se encontro el carrito" };
            }   
        } catch (err) {
            return { message: "Error al buscar el carrito:", data: err };
        }
    };

    addProductToCart(cid, pid) {
        try {
            const cart = this.getCartById(cid);
            const { products } = cart.data;
            const productIndex = products.findIndex((product) => product.product === +pid);
            console.log(products)
            if (productIndex !== -1) {
                products[productIndex].quantity++;
            } else {
                products.push({product: +pid, quantity: 1});
            }
            this.updateCart(cart.data);
            return { message: "Se añadio correctamente el producto:", data: cart };
        } catch (err) {
            return { message: "Error al añadir el producto:", data: err };
        }
    };

    updateCart(cart) {
        const { id } = cart;
        const cartToUpdateIndex = this.carts.findIndex((cart) => cart.id === id);
        this.carts.splice(cartToUpdateIndex, 1, cart);
        this.saveCarts();
    };

    async saveCarts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
            console.log('Carritos guardados correctamente');
        } catch (err) {
            console.error('Error al guardar productos:', err);
        }
    }

}

export { CartManager };
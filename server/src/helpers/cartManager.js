import fs from "fs";

class CartManager{

    constructor(){
        this.cart = [];
        this.path = './src/data/cart.json';
    }

    async addToCart({ product, qty }){
        try {
            this.cart = await this.getAllCart();
            const itemFounded = this.cart.find(el => el.product === product)
            if(itemFounded){
                itemFounded.qty += qty;
                await fs.promises.writeFile(this.path,JSON.stringify(this.cart));
                return itemFounded;
            }

            const newItem = {
                product, qty,
                id: this.cart.length + 1
            }
            this.cart.push(newItem);
            await fs.promises.writeFile(this.path,JSON.stringify(this.cart));
            
            return newItem

        } catch (error) {
            return null;
        }
    }

    async getAllCart( ){
        try {
            const result = await fs.promises.readFile(this.path, 'utf-8');
            this.cart = await JSON.parse(result)
            return this.cart;
        } catch (error) {
            return null;
        }
    }

}

export default CartManager;
import fs from "fs";

class ProductManager {
    
    constructor() {
        this.products = [];
        this.path = './src/data/products.json';
    }
    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = await JSON.parse(data);
            return this.products;
        } catch (error) {
            console.error(`error read archive ${this.path}: ${error}`);
            return [];
        }
    }
    addProduct = async ({code, title, description, price, thumbnail, stock, status}) => {
        try {
            await this.getProducts();
            if (!code || !title || !description || !price || !thumbnail || !stock || !status) {
                console.log("All the fields must be completed")
                return;
            }
    
            let productRepeated = this.products.find((element) => element.code === code);
            if (productRepeated) {
                return `The field code ${code} is repeated so this product cannot be save in the list`;
                
            }
            const product = {
                code,
                title,
                description,
                price,
                thumbnail,
                stock,
                status,
                id: this.products.length + 1
            }
    
    
            this.products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
            return product;
        } catch (error) {
            console.log(error);
        }
     
    }

    getProductById = async (id) => {
        if (fs.existsSync(this.path)) {
            try {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);

                const result = products.find( prod => prod.id === Number(id));
                if ( !result ) {
                    return null;
                } else {
                    return result;
                }
            } catch (error) {
                console.log(error);
            }
        }

    }
    //eliminacion producto//
    deleteProduct = async (id) => {
        
        try {
            this.products = await this.getProducts();
           
            if( !this.products.some( prod => prod.id === id) ) return null;

            this.products = this.products.filter( prod => prod.id !== id );
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            return true;
            
        } catch (error) {
            console.log(error);
            return false;
        }       

    }
    updateProduct = async ({code, title, description, price, thumbnail, stock, status }, id) => {

        try {

            const products = await this.getProducts(); 
            const product = products.find(product => product.id === Number(id)) 
            if (!product) {
                console.log(`no se encontro el producto con id ${id}`)
                return `no se encontro el producto con id ${id}`

            } else {
                product.code = code;
                    product.title = title;
                    product.description = description;
                    product.price = price;
                    product.thumbnail = thumbnail;
                    product.stock = stock;
                    product.status = status;
                await fs.promises.writeFile(this.path, JSON.stringify(products)); //reescribimos el archivo .json ya modificado//
                return product;

            }

        } catch (error) {

            return `error`

        }
    }
}


export default ProductManager;
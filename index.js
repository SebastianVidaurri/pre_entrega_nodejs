//objeto literal
const apiService = {
    baseUrl: 'https://fakestoreapi.com',

    //metodo para obtener todos los productos
    async getAllProducts() {
        const response = await fetch(`${this.baseUrl}/products`);
        return response.json();
    },

    //metodo para obtener un producto por id
    async getProductById(id) {
        const response = await fetch(`${this.baseUrl}/products/${id}`);
        return response.json();
    },
    
    //metodo para crear un producto
    async createProduct(product) {
        const response = await fetch(`${this.baseUrl}/products`, {
             method: "POST",
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(product)
         });
         return response.json();
    },

    //metodo para borrar un producto
    async deleteProduct(id) {
        const response = await fetch(`${this.baseUrl}/products/${id}`, {
             method: "DELETE" });
         return response.json();
    },

    //metodo para actualizar un producto
    async updateProduct(id, product) {
        const response = await fetch(`${this.baseUrl}/products/${id}`, {
             method: "PUT",
             body: JSON.stringify(product)
         });
         return response.json();
    }
}


//inicio

const args = process.argv.slice(2)
console.log(args[0])


/*
// Probamos traer el producto con ID 1
apiService.getProductById(1)
    .then(producto => {
        console.log("Producto encontrado:");
        console.log(producto);
    })
    .catch(error => {
        console.error("Error al obtener el producto:", error);
    });*/
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

//iniciamos
const args = process.argv.slice(2)
//desestructuramos args par que se más legible 
let [action, resource, id] = args;

if (!id){
    [resource, id] = resource.split("/")
}

//usamos una funsion async por que vamos a utilizar await apiService
async function main() {
    if (resource == "products"){
            switch (action){

                case "GET":    
                    if (!id){ //Si no hay ID entonces traemos todos los productos
                        console.log("Lista de TODOS los productos: ");
                        const productos = await apiService.getAllProducts();
                        console.log(productos);
                    } else { //Busqueda con id
                        console.log(`Producto con ID ${id}: `);
                        const producto = await apiService.getProductById(id);
                        console.log(producto);
                    };
                    break;

                case "POST":
                    break;

                case "DELETE":
                    if (id){
                        console.log(`Eliminando el producto con id: ${id}...`)
                        const borrado= await apiService.deleteProduct(id);
                        console.log("Pruducto eliminado: ", borrado);
                    } else {
                        console.log("Error: Debes indicar un ID (ej: products/2)")
                    }
                    break;

                default:
                    console.log("Acción no reconocida. Usa GET, POST o DELETE")
        }

    }
    
    
}

main()
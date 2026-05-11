//objeto literal
const apiService = {
    baseUrl: 'https://fakestoreapi.com',

    //metodo para obtener todos los productos
    async getAllProducts() {
        const response = await fetch(`${this.baseUrl}/products`);
        if(!response.ok){
            throw new Error (`Error ${response.status}: No se pudo obtener la lista de productos`);
        }
        return response.json();
    },

    //metodo para obtener un producto por id
    async getProductById(id) {
        const response = await fetch(`${this.baseUrl}/products/${id}`);
        if(!response.ok){
            throw new Error (`Error ${response.status}: No se encontró el producto con ID ${id}`);
        }
        //revisamos que el tamaño del headers tenga contenido
        //console.log(response) descubri que la API responde 200 aún si no existe el producto
        const contentSize = response.headers.get('content-length');
        if (contentSize === '0' || contentSize === null) {
            throw new Error(`El producto con ID ${id} no existe (Respuesta vacía).`);
        }
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
        
             if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo realizar la eliminación`);
            }
        
            const contentSize = response.headers.get('content-length');
            if (contentSize === '0' || contentSize === null) { //igual que en el GET la API devuelve un 200 aún si el producto no existe por lo tanto hay que validar
                throw new Error(`El producto con ID ${id} no existe, por lo tanto no se puede eliminar.`);
            }
        
            return response.json();
        },
    /*
    //metodo para actualizar un producto
    async updateProduct(id, product) {
        const response = await fetch(`${this.baseUrl}/products/${id}`, {
             method: "PUT",
             body: JSON.stringify(product)
         });
         return response.json();
    }*/
}

//iniciamos
const args = process.argv.slice(2)
//desestructuramos args par que se más legible 
let [action, resource, ] = args;
let id = undefined;

//si esta incluida un barra en resource
if (resource && resource.includes("/")){
    [resource, id] = resource.split("/")
    console.log(id);
}

//usamos una funsion async por que vamos a utilizar await apiService
async function main() {
    try{
        if (resource == "products"){
                switch (action){ //CASOS GET POST DELETE

                    case "GET":
                        const finalId = id || args[2];
                        if (finalId) {
                            const producto = await apiService.getProductById(finalId);
                            console.log(`Producto con ID ${finalId}:`);
                            console.log(producto);
                        } else {
                            console.log("Lista de TODOS los productos:");
                            const productos = await apiService.getAllProducts();
                            console.log(productos);
                        }
                        break;

                    case "POST":
                        const [ , , nombre, precio, categoria] = args;
                        const bodyProduct = {
                                title: nombre,
                                price: precio,
                                category: categoria
                        };

                        if (!nombre) { //Verificamos que almenos haya un nombre para el producto
                            throw new Error("Faltan parámetros. Uso: npm start POST products <nombre> <precio> <categoria>");
                        }
                        const newProduct = await apiService.createProduct(bodyProduct);
                        console.log("✅ Producto creado:");
                        console.log(newProduct);
                        break;

                    case "DELETE":
                        const deleteId = id || args[2];
                        if (deleteId){
                            console.log(`Eliminando el producto con id: ${deleteId}...`)
                            const borrado = await apiService.deleteProduct(deleteId);
                            
                            if (!borrado) {
                                throw new Error(`El producto ${deleteId} no se pudo eliminar o no existe.`);
                            }
                            console.log("✅ Producto eliminado exitosamente:");
                            console.log(borrado);
                        
                        } else {
                             throw new Error (`Error: Debes indicar un ID (ej: products/2)`)
                        }
                        break;

                    default:
                        console.log("Acción no reconocida. Usa GET, POST o DELETE")
                }

        } else {
            throw new Error (`Error: Ingresa correctamente los argumentos`)
        }
    } catch(error) {
        // MOSTRAR EL ERROR POR PANTALLA
        console.error("\x1b[31m%s\x1b[0m", " OCURRIÓ UN ERROR ");
        console.error(`Detalle: ${error.message}`);
    }
}

main()
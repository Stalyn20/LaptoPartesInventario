const fs = require('fs');
const readlineSync = require('readline-sync');

// Función para cargar productos desde el archivo JSON
function loadProducts() {
    try {
        const data = fs.readFileSync('products.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        return [];
    }
}

// Función para guardar productos en el archivo JSON
function saveProducts(products) {
    try {
        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Error al guardar los productos:', error);
    }
}

// Función para mostrar productos con stock bajo
function showLowStockAlert(products) {
    const lowStockProducts = products.filter(product => product.stock <= 5);
    if (lowStockProducts.length > 0) {
        console.log('\n¡Alerta! Productos con stock bajo:');
        lowStockProducts.forEach(product => {
            console.log(`- ${product.name} (${product.stock} en stock)`);
        });
    } else {
        console.log('\nNo hay productos con stock bajo.');
    }
}

// Función para registrar un producto
function registerProduct(products) {
    const name = readlineSync.question('Nombre del producto: ');
    const brand = readlineSync.question('Marca del producto: ');
    const stock = parseInt(readlineSync.question('Cantidad en stock: '));
    const price = parseFloat(readlineSync.question('Precio del producto: '));

    const newProduct = { name, brand, stock, price };
    products.push(newProduct);
    saveProducts(products);
    console.log('Producto registrado exitosamente.');
}

// Función para editar un producto
function editProduct(products) {
    const name = readlineSync.question('Ingrese el nombre del producto a editar: ');
    const product = products.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (product) {
        product.name = readlineSync.question(`Nuevo nombre (actual: ${product.name}): `) || product.name;
        product.brand = readlineSync.question(`Nueva marca (actual: ${product.brand}): `) || product.brand;
        product.stock = parseInt(readlineSync.question(`Nuevo stock (actual: ${product.stock}): `)) || product.stock;
        product.price = parseFloat(readlineSync.question(`Nuevo precio (actual: ${product.price}): `)) || product.price;

        saveProducts(products);
        console.log('Producto editado exitosamente.');
    } else {
        console.log('Producto no encontrado.');
    }
}

// Función para eliminar un producto
function deleteProduct(products) {
    const name = readlineSync.question('Ingrese el nombre del producto a eliminar: ');
    const index = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());

    if (index !== -1) {
        products.splice(index, 1);
        saveProducts(products);
        console.log('Producto eliminado exitosamente.');
    } else {
        console.log('Producto no encontrado.');
    }
}

// Función para registrar movimiento de productos (ingresos y egresos)
function registerMovement(products) {
    const name = readlineSync.question('Ingrese el nombre del producto para registrar el movimiento: ');
    const product = products.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (product) {
        const movementType = readlineSync.question('Es un ingreso o egreso? (ingreso/egreso): ').toLowerCase();
        const quantity = parseInt(readlineSync.question('Cantidad a registrar: '));

        if (movementType === 'ingreso') {
            product.stock += quantity;
        } else if (movementType === 'egreso') {
            if (product.stock >= quantity) {
                product.stock -= quantity;
            } else {
                console.log('No hay suficiente stock.');
                return;
            }
        } else {
            console.log('Tipo de movimiento inválido.');
            return;
        }

        saveProducts(products);
        console.log('Movimiento registrado exitosamente.');
    } else {
        console.log('Producto no encontrado.');
    }
}

// Función para generar reportes de inventario
function generateReport(products) {
    console.log('\nReporte de Inventario:');
    products.forEach(product => {
        console.log(`${product.name} - Stock: ${product.stock} - Precio: ${product.price}`);
    });
}

// Función para buscar productos
function searchProduct(products) {
    const searchTerm = readlineSync.question('Ingrese el nombre del producto que desea buscar: ');
    const result = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (result.length > 0) {
        console.log('\nProductos encontrados:');
        result.forEach(p => {
            console.log(`${p.name} - Stock: ${p.stock} - Precio: ${p.price}`);
        });
    } else {
        console.log('No se encontraron productos con ese nombre.');
    }
}

// Función para mostrar el menú según el rol
function showMenu(role) {
    const products = loadProducts();

    if (role === 'vendedor') {
        let option;
        do {
            console.log('\nSeleccione una opción:');
            console.log('1. Registrar producto');
            console.log('2. Editar producto');
            console.log('3. Eliminar producto');
            console.log('4. Registrar movimiento');
            console.log('5. Generar reporte de inventario');
            console.log('6. Ver alertas de stock');
            console.log('7. Salir');

            option = readlineSync.question('Opcion: ');

            switch (option) {
                case '1':
                    registerProduct(products);
                    break;
                case '2':
                    editProduct(products);
                    break;
                case '3':
                    deleteProduct(products);
                    break;
                case '4':
                    registerMovement(products);
                    break;
                case '5':
                    generateReport(products);
                    break;
                case '6':
                    showLowStockAlert(products);
                    break;
                case '7':
                    console.log('Saliendo...');
                    break;
                default:
                    console.log('Opción inválida. Intente de nuevo.');
            }
        } while (option !== '7');
    } else if (role === 'comprador') {
        let option;
        do {
            console.log('\nSeleccione una opción:');
            console.log('1. Buscar producto');
            console.log('2. Ver productos');
            console.log('3. Ver alertas de stock');
            console.log('4. Salir');

            option = readlineSync.question('Opcion: ');

            switch (option) {
                case '1':
                    searchProduct(products);
                    break;
                case '2':
                    generateReport(products);
                    break;
                case '3':
                    showLowStockAlert(products);
                    break;
                case '4':
                    console.log('Saliendo...');
                    break;
                default:
                    console.log('Opción inválida. Intente de nuevo.');
            }
        } while (option !== '4');
    } else {
        console.log('Rol no reconocido.');
    }
}

// Función para pedir el rol de usuario
function askRole() {
    const role = readlineSync.question('Eres comprador o vendedor? (comprador/vendedor): ').toLowerCase();
    if (role === 'vendedor' || role === 'comprador') {
        showMenu(role);
    } else {
        console.log('Rol no válido. Debes ingresar comprador o vendedor.');
    }
}

// Iniciar el sistema
askRole();

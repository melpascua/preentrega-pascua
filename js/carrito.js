const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));

//*Se trae del HTML:

const carritoVacio = document.querySelector("#carrito-vacio");
let carritoConProductos = document.querySelector("#carrito-con-productos");
const acciones = document.querySelector("#acciones");
const compraRealizada = document.querySelector("#compra-realizada");
let eliminarProducto = document.querySelectorAll(".eliminar");
const totalAPagar = document.querySelector("#total");
const botonCompra = document.querySelector("#carrito-accion-comprar");


//*Eventos

botonCompra.addEventListener("click", compraDeProductos);

//*FUNCIONES

function cargarProductosCarrito() {

    //*NO HACE FALTA COMPARAR EL IF CON NADA, PORQUE DEVOLVERÁ TRUE CUANDO EL CONST TENGA ALGO, NO SEA NULL. Cuando haya algún producto, queremos que se desactiven algunos elementos del HTML y se muestren otros y viceversa.
    //*Se le agrega && productosEnCarrito.length > 0 porque al eliminar todos los productos queda el array vacío [], entonces SÍ devuelve algo y no null.
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        //*Mensaje de carrito vacío desaparece al haber productos en el carrito.
        carritoVacio.classList.add("disabled");

        //*Las acciones aparecen al haber un producto en el carrito, ya que se pueden realizar.
        acciones.classList.remove("disabled");

        //*Se le elimina la clase desactivado al haber productos en él.
        carritoConProductos.classList.remove("disabled");

        //*Se oculta el mensaje de compra realizada ya que aún no se ha realizado ninguna compra.
        compraRealizada.classList.add("disabled");


        carritoConProductos.innerHTML = "";

        //*Por cada producto seleccionado por el usuario, creará un div con la clase nombrada abajo y con los siguientes elementos dentro de él:

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("producto-carrito");
            div.innerHTML = `
                <img src=".${producto.imagen}" alt="${producto.nombre}" class="producto-carrito-imagen">
                <div class="carrito-producto-nombre">
                    <h3>Nombre</h3>
                    <h4>${producto.nombre}</h4>
                </div>
                <div class="cantidad">
                    <h3>Cantidad</h3>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="precio-carrito">
                    <h3>Precio</h3>
                    <p>$${producto.precio}</p>
                </div>
                <div class="subtotal">
                    <h3>Subtotal</h3>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="eliminar" id="${producto.id}"><i class="bi bi-trash3-fill"></i></button>
            `;

            carritoConProductos.append(div);

        });


    } else {

        //*Mensaje de carrito vacío aparece al NO haber productos en el carrito.
        carritoVacio.classList.remove("disabled");

        //*Las acciones desaparecen al NO haber un producto en el carrito, ya que NO se pueden realizar.
        acciones.classList.add("disabled");

        //*Se le agrega la clase desactivado al NO haber productos en él.
        carritoConProductos.classList.add("disabled");

        //*Se oculta el mensaje de compra realizada ya que aún no se ha realizado ninguna compra.
        compraRealizada.classList.add("disabled");

    };

    botonesEliminar();
    actualizacionDelTotal();
}

function botonesEliminar() {
    eliminarProducto = document.querySelectorAll(".eliminar");

    eliminarProducto.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    })
};

function eliminarDelCarrito(e) {

    //*Al presionar el botón eliminar, se encontrará en el array productosEnCarrito un elemento con el mismo id y se eliminará de este.
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    //*Si hay productos acumulados, restará uno
    if (productosEnCarrito[index].cantidad > 1) {
        productosEnCarrito[index].cantidad--;
    } else {
        productosEnCarrito.splice(index, 1);
    }

    //*Se vuelve a cargar los productos para que la página se actualice, eliminando los productos que fueron quitados del array
    cargarProductosCarrito();

    //*Se actualiza el localStorage
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

//*En este caso no agrego un toastify para alertar al usuario de la eliminación del producto porque él puede verlo y siento que sería demasiado invasivo. En cambio en la tienda, el usuario no tiene la posibilidad de ver si el producto fue agregado al carrito y el toastify se lo asegura.

//*Hay que calcular el total cada que se actualizan los productos en el carrito
function actualizacionDelTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    totalAPagar.innerText = `$${totalCalculado}`;
};




//*Al no estar realizando una compra real, vacíaremos el array.
function compraDeProductos() {

    //*Al presionar el botón, la alerta aparecerá, preguntándole al usuario si desea proceder con la compra. Si el usuario dice que sí, se realizará toda la operación.
    Swal.fire({
        title: '¿Deseas confirmar tu compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí!',
        cancelButtonText: 'Cancelar'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            Swal.fire(
                '¡Listo!',
                '¡Tu compra ha sido realizada correctamente!',
                'success'
            )
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            //*Mensaje de carrito vacío desaparece al haber realizado la compra.
            carritoVacio.classList.add("disabled");

            //*Las acciones desaparecen al NO haber un producto en el carrito, ya que NO se pueden realizar.
            acciones.classList.add("disabled");

            //*Se le agrega la clase desactivado al NO haber productos en él.
            carritoConProductos.classList.add("disabled");

            //*Se muestra el mensaje de compra realizada ya que se ha realizado la compra.
            compraRealizada.classList.remove("disabled");
        }
    })
}

//*INICIO DEL PROGRAMA

cargarProductosCarrito();






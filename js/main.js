//*ARRAYS

const listaDeProductos = [];

fetch('./array.json')
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        listaDeProductos.push(...json);

        //*se llama la función productos dentro del "then", ya que el fetch es una función asincrónica.
        cargarProductos();
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });


let carritoDeCompras;

//*Para que el carrito de compras no comience vacío si es que este tiene agregado algún producto.
const productosEnCarritoLS = JSON.parse(localStorage.getItem("productos-en-carrito"));

if (productosEnCarritoLS) {
    carritoDeCompras = productosEnCarritoLS;
} else {
    carritoDeCompras = [];
}


//*DOM 

let botones = document.querySelectorAll(".boton");

//*FUNCIONES


//*esta función reemplaza el HTML y coloca todos los productos en el de forma mucho más dinámica. Recorre cada producto del array "listaDeProductos" y los crea en el html.
function cargarProductos() {
    const contenedorProductos = document.getElementById("contenedor-tienda");

    listaDeProductos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre} $${producto.precio}</h3>
        <button class="boton" id="${producto.id}">Añadir al carrito</button>`;
        contenedorProductos.append(div);
    });
    botonesAgregar();
};

//*detección de click de los botones para agregar al carrito. Se selecciona a cada boton y se le agrega la propiedad. 
function botonesAgregar() {
    botones = document.querySelectorAll(".boton");

    botones.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    })
};


//*Al presionar el botón, saldrá el ID del producto y esta función recorrerá el array en busca que el primer ID igual a este. y luego se pushea a un Array
function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;

    const agregandoProducto = listaDeProductos.find(producto => producto.id === idBoton);

    //*Some verificará si ya hay algún producto que coincida con el que se está agregando al array para poder sumar cantidad en vez de agregar un objeto nuevo al array, una entidad nueva. Estos estarán juntos. Si some devuelve false, pusheara el producto.

    if (carritoDeCompras.some(producto => producto.id === idBoton)) {

        const encontrarIndex = carritoDeCompras.findIndex(producto => producto.id === idBoton);
        carritoDeCompras[encontrarIndex].cantidad++;
    }
    else {
        //*Se le asgina una propiedad nueva a los productos
        agregandoProducto.cantidad = 1;

        carritoDeCompras.push(agregandoProducto);
    }

    //*Cada vez que se agregue un producto al carrito, una ventana emergente le avisará al usuario de esto.
    Toastify({
        text: "¡El producto se ha agregado al carrito!",

        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "#7c5033",
            fontWeight: "bold",
        },
    }).showToast();


    //*Ahora guardamos el array carritoDeCompras en el local storage para poder enviarlo a la página de carrito.

    localStorage.setItem("productos-en-carrito", JSON.stringify(carritoDeCompras));
};


//*INICIO DEL PROGRAMA

botonesAgregar();








//VARIABLES INIIALES
//ARREGLO CON PRODUCTOS QUE ENTRAN EN EL CARRITO Y TOTAL
let shoppingCartArray = [];

let carros = [];

let total = 0;
// VARIABLE DEL DIV A DONDE VAN LOS ITEMS SE UTILIZA QUERYSELECTOR
let productContainer = document.querySelector('.shop-items');

//selecciono el elemento dentro de el html que muestra el total
let totalElement = document.querySelector('.cart-total-title');

//LLAMADO A LA API STORE
//PETICION DE PRODUCTOS AL SERVIDOR

//fetch('https://api.escuelajs.co/api/v1/products')
//.then(res => res.json())
//.then(data => console.log(data));

let res = await fetch('https://ecommerce-668c5-default-rtdb.firebaseio.com/productos.json')
let data = await res.json()

//ARREGLO CON PRODUCTOS LIMITAMOS A 4 PRODUCTOS
let productsArray = data

//IMPRIMIR PRODUCTOS EN PANTALLA
productsArray.forEach(product => {
    let tallaProducto = dibujarTallas()
    // se utiliza innerHTML para decir que va ir sumar al contenido los datos del servidor
    productContainer.innerHTML += `
    <div class="shop-item" id="${product.id}">
        <span class="shop-item-title">${product.title}</span>
        <img class="shop-item-image" onmouseout="this.src='${product.img}'" onmouseover="this.src='${product.img2}';" src="${product.img} ">
        <span class="shop-item-price">$${product.price}</span> 
        <div class="shop-item-details">
            ${tallaProducto}`

    function dibujarTallas() {
        let hola = ' '
        for (var i in product.tallas) {
            if (product.tallas[i] > 0) {
                hola = hola + `
                        <button class="btn btn-dark shop-item-button" type="button" value="${product.id}">${i}</button>`
            } else {
                hola = hola + `
                        <button class="btn btn-secondary shop-item-button-disable" disabled>${i}</button>`
            }
        }

        return hola
    }
    redireccionarPagina();
});

// VARIABLE DEL BOTON QUE TIENE EL AGREGAR AL CARRITO
let addBtns = document.querySelectorAll('.shop-item-button');
//se transforma nolist de los botones a un arreglo
addBtns = [...addBtns];
//console.log(addBtns);
//VARIABLE DEL CONTAINER DEL CARRITO
let cartContainer = document.querySelector('.cart-items');

//click pasar al carrito
addBtns.forEach(btn => {
    //se captura ese boton
    //Buscar el id del producto seleccionado 
    // se escucha el evento click de cada boton 
    btn.addEventListener('click', event => {
        //cuando damos click en el boton 
        //AGREGO PRODUCTOS AL CARRITO
        borrarCarritoVacio();
        //con travesnting dom se busca hasta encontrar el parent node con el id 
        //let actualID = parseInt(event.target.parentNode.parentNode.id);
        let actualID = (btn.value)
        let actualTalla = (btn.textContent)

        //con el id encontrar el objeto actual
        let actualProduct = productsArray.find(item => item.id == actualID);

        let itemCompra = { "nombre": actualProduct.title, "talla": actualTalla, "cantidad": 1, "precio": 3000, "imagen": actualProduct.img }

        // preguntar si el product ya existe en el carrito
        let existe = false
        let i = 0
        carros.forEach(producto => {
            //se compara el id del producto que entro con todoslos productos que estan en el carrito
            if (itemCompra.nombre == producto.nombre) {
                if (itemCompra.talla == producto.talla) {
                    existe = true
                    let tal = toString(actualTalla)
                    let compra = carros[i]
                    compra.cantidad = compra.cantidad + 1
                }
            }
            i = i + 1
        })
        //si el producto no existe en el carrito lo inserto en el array
        if (existe == false) {
            carros.push(itemCompra)
        }
        //dibujar en el dom el arreglo de compras actualizado
        dibujarItemsCarrito();
        //actualizar el precio total
        //vamos a la funcion gettotal cada vez que tengamos un nuevo evento
        total = getTotal();
        //actualiza el input de cantidad de un producto
        actualizarNumeroItems();
        //remueve el producto de el carrito
        removeProducto();
    });

});

//funcion para obtener el total de la cuenta 
function getTotal() {
    //variable para suma de los productos  
    let sumTotal
    // devuelve con reduce un solo valor
    let total = carros.reduce((sum, item) => {
        // suma el precio y multiplica por la cantidad 
        sumTotal = sum + item.cantidad * item.precio
        return sumTotal
    }, 0)
    //a ese elemento le inserto el valor de la variabe total que en principio vale 0  
    totalElement.innerHTML = `$${total}`

}

//dibuja productos a comprar
function dibujarItemsCarrito() {
    cartContainer.innerHTML = ``;
    carros.forEach(item => {
        cartContainer.innerHTML += `
            <div class="cart-row row">
                <div class="cart-item cart-column">
                    <img class="cart-item-image" src="${item.imagen}" width="100" height="100">
                    <span class="cart-item-title">${item.nombre}</span>
                    <span class="cart-item-title">${item.talla}</span>
                </div>
                <span class="cart-price cart-column">$${item.precio}</span>
                <div class="cart-quantity cart-column">
                    <input class="cart-quantity-input" name="${item.nombre}" id="${item.talla}" min="1" type="number" value="${item.cantidad}">
                    <button class="btn btn-danger material-symbols-outlined" name="${item.nombre}" id="${item.talla}"type="button">delete</button>
                </div>
            </div>`


    });
    removeProducto();
}

//actualiza el numero de productos a comprar
function actualizarNumeroItems() {

    //captura el input con su clase dentro del dom
    let inputCantidad = document.querySelectorAll('.cart-quantity-input');
    //convierto todos los inputs en un arreglo
    inputCantidad = [...inputCantidad];
    //recorro el arreglo cuando se pulse click en uno 
    inputCantidad.forEach(item => {
        item.addEventListener('click', event => {
            //capturar el nombre del producto y el id y la cantidad
            let productActualTalla = event.target.getAttribute("id");
            let productActualNombre = event.target.getAttribute("name");
            let cantidadActual = parseInt(event.target.value);

            //se recorre el arreglo de los productos dentro del carrito
            carros.forEach(producto => {
                //se compara el nombre del producto que di click con el arreglo dentro del carrito
                if (productActualNombre == producto.nombre) {
                    //tambien se compara la talla
                    if (productActualTalla == producto.talla) {
                        producto.cantidad = cantidadActual
                        inputCantidad.cantidad = +1
                    }
                }
            })

            //actualizar el precio total 
            getTotal();
        })
    })
}

//elimina producto del carrito
function removeProducto() {
    let btnRemove = document.querySelectorAll('.btn-danger');
    btnRemove = [...btnRemove];
    btnRemove.forEach(btn => {
        btn.addEventListener('click', event => {
            //capturar nombre producto
            let productActualTalla = event.target.getAttribute("id");
            let productActualNombre = event.target.getAttribute("name");

            //se recorre el arreglo de los productos dentro del carrito
            carros.forEach(producto => {
                //se compara el nombre del producto que di click con el arreglo dentro del carrito
                if (productActualNombre == producto.nombre) {
                    //tambien se compara la talla
                    if (productActualTalla == producto.talla) {
                        carros = carros.filter(item => item != producto)

                    }
                }
            })
            //actualizar el precio total 
            dibujarItemsCarrito();
            getTotal();
            actualizarNumeroItems();
        })
    })
}

function borrarCarritoVacio() {
    var x = document.getElementById("compraDes");
        x.style.display = "none";
    var x = document.getElementById("compraAct");
        x.style.display = "block";
}


document.querySelector("#submit").addEventListener("click", e => {
    e.preventDefault();

    //INGRESE UN NUMERO DE WHATSAPP VALIDO AQUI:
    let telefono = "573107680539";
    let productWap = " ";
    let totalWhatsapp = 0;

    //SE OBTIENE LOS PRODUCTOS CANTIDAD Y PRECIO DEL CARRITO
    carros.forEach(item => {
        let texto = `*${item.nombre}*
    %0APrecio: $ *${item.precio}*
    %0ACantidad: *${item.cantidad}*
    %0ATotal: $ *${item.precio * item.cantidad}*
    %0A%0A`;
        let valPro = item.precio * item.cantidad;
        totalWhatsapp = totalWhatsapp + valPro;
        productWap = productWap + texto;
    });

    let url = `https://api.whatsapp.com/send?phone=${telefono}&text=
		*Mith*%0A%0A
		Tu compra:%0A
		${productWap}TOTAL:%0A
		$ *${totalWhatsapp}*%0A`;

    window.open(url);

});

function redireccionarPagina() {
    setTimeout("location.href='#scrollspyHeading2'", 20000);
  }

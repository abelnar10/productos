//VARIABLES INIIALES
//ARREGLO CON PRODUCTOS QUE ENTRAN EN EL CARRITO Y TOTAL
let shoppingCartArray = [];
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
    // se utiliza innerHTML para decir que va ir sumar al contenido los datos del servidor
    productContainer.innerHTML += `
    <div class="shop-item" id="${product.id}">
        <span class="shop-item-title">${product.title}</span>
        <img class="shop-item-image" src="${product.img}">
        <div class="shop-item-details">
            <span class="shop-item-price">$${product.price}</span>
            <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
        </div>
    </div>`
});

// VARIABLE DEL BOTON QUE TIENE EL AGREGAR AL CARRITO
let addBtns = document.querySelectorAll('.shop-item-button');
//se transforma nolist de los botones a un arreglo
addBtns = [...addBtns];
//console.log(addBtns);
//VARIABLE DEL CONTAINER DEL CARRITO
let cartContainer = document.querySelector('.cart-items');

addBtns.forEach(btn=>{
//se captura ese boton
    //Buscar el id del producto seleccionado 
    // se escucha el evento click de cada boton 
    btn.addEventListener('click', event=>{
        //cuando damos click en el boton 
        //AGREGO PRODUCTOS AL CARRITO
        
        //con travesnting dom se busca hasta encontrar el parent node con el id 
        let actualID = parseInt(event.target.parentNode.parentNode.id);
        //con el id encontrar el objeto actual
        let actualProduct = productsArray.find(item => item.id == actualID)
        //si la cantidaddel objeto no existe
        if(actualProduct.quantity === undefined){
            //es el primer producto que ingresa a el carrito su cantidad es 1
            actualProduct.quantity = 1;
        }
        // preguntar si el product ya existe en el carrito
        let  existe = false
        shoppingCartArray.forEach(producto =>{
            //se compara el id del producto que entro con todoslos productos que estan en el carrito
            if(actualID == producto.id){
                existe = true
            }
        })
        //si el producto ya existe en el carrito subimos la cantidad 1 
        if (existe){
            actualProduct.quantity++
        }else{
            shoppingCartArray.push(actualProduct)
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
function getTotal(){
    //variable para suma de los productos  
    let sumTotal
    // devuelve con reduce un solo valor
    let total =  shoppingCartArray.reduce( (sum, item)=>{
        // suma el precio y multiplica por la cantidad 
        sumTotal = sum + item.quantity*item.price
        return sumTotal
    },0 )
    //a ese elemento le inserto el valor de la variabe total que en principio vale 0  
    totalElement.innerHTML = `$${total}`

}

function dibujarItemsCarrito(){
    cartContainer.innerHTML = ``;
        shoppingCartArray.forEach(item => {
            cartContainer.innerHTML += `
            <div class="cart-row">
                <div class="cart-item cart-column">
                    <img class="cart-item-image" src="${item.img}" width="100" height="100">
                    <span class="cart-item-title">${item.title}</span>
                </div>
                <span class="cart-price cart-column">$${item.price}</span>
                <div class="cart-quantity cart-column">
                    <input class="cart-quantity-input" min="1" type="number" value="${item.quantity}">
                    <button class="btn btn-danger" type="button">REMOVE</button>
                </div>
            </div>`

        });
        removeProducto();
}

function actualizarNumeroItems(){
    //captura el input con su clase dentro del dom
    let inputCantidad = document.querySelectorAll('.cart-quantity-input');
    //convierto todos los inputs en un arreglo
    inputCantidad = [...inputCantidad];
    //recorro el arreglo cuando se pulse click en uno 
    inputCantidad.forEach(item => {
        item.addEventListener('click', event => {
            //capturar el nombre del producto
            let productActualNombre = event.target.parentElement.parentElement.childNodes[1].innerText;
            let cantidadActual = parseInt(event.target.value);
            //busco el objeto con ese nombre dentro del carrito
            let productoActual = shoppingCartArray.find(item => item.title == productActualNombre);
            //actualizar el nuero de la cantidad
            productoActual.quantity = cantidadActual;
            //actualizar el precio total 
            getTotal();
        })
    })
}

function removeProducto(){
    let btnRemove = document.querySelectorAll('.btn-danger');
    btnRemove = [...btnRemove];
    btnRemove.forEach(btn => {
        btn.addEventListener('click', event=>{
            //capturar nombre producto
            let productActualNombre = event.target.parentElement.parentElement.childNodes[1].innerText;
            //busco el objeto con ese producto
            let productoActual = shoppingCartArray.find(item => item.title == productActualNombre);
            // remover del arreglo carrito
            shoppingCartArray = shoppingCartArray.filter(item => item != productoActual)
            //actualizar el precio total 
            dibujarItemsCarrito();
            getTotal();
            actualizarNumeroItems();
        })
    })
}

document.querySelector("#submit").addEventListener("click", e => {
    e.preventDefault();
  
    //INGRESE UN NUMERO DE WHATSAPP VALIDO AQUI:
    let telefono = "573107680539";
    let productWap = " "; 
    let totalWhatsapp = 0;

    //SE OBTIENE LOS PRODUCTOS CANTIDAD Y PRECIO DEL CARRITO
    shoppingCartArray.forEach(item => {
    let texto =`*${item.title}*
    %0APrecio: $ *${item.price}*
    %0ACantidad: *${item.quantity}*
    %0ATotal: $ *${item.price*item.quantity}*
    %0A%0A`;
    let valPro = item.price*item.quantity;
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
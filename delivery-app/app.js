const orderList = document.getElementById("orders")

async function loadOrders(){

try{

const response = await fetch("https://w4-delivery-app.vercel.app/api/orders")

const orders = await response.json()

orderList.innerHTML=""

orders.forEach(order => {

const li = document.createElement("li")

let productsHTML = ""

order.order_items.forEach(item => {

productsHTML += `<li>${item.products.name}</li>`

})

li.innerHTML = `
<h3>Orden #${order.id}</h3>
<ul>${productsHTML}</ul>
<strong>Total: $${order.total}</strong>
`

orderList.appendChild(li)

})

}catch(error){

console.error("Error cargando órdenes:", error)

orderList.innerHTML = "<p>No se pudieron cargar las órdenes.</p>"

}

}

loadOrders()
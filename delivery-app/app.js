const orderList = document.getElementById("orders")

async function loadOrders(){

const response = await fetch("http://localhost:3000/api/orders")

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

}

loadOrders()
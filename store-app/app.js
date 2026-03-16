const orderList = document.getElementById("orders")

async function loadOrders(){

const response = await fetch("http://localhost:3000/api/orders")

const orders = await response.json()

orderList.innerHTML=""

orders.forEach(order => {

const li = document.createElement("li")

li.innerText = `Orden #${order.id} - Total: $${order.total}`

orderList.appendChild(li)

})

}

loadOrders()
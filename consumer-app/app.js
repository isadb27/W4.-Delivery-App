let stores = []
let products = []

let cart = []
let selectedStore = null

const storeDiv = document.getElementById("stores")
const productDiv = document.getElementById("products")
const cartList = document.getElementById("cart")
const totalText = document.getElementById("total")
const cartCount = document.getElementById("cart-count")

// cargar tiendas desde backend
async function loadStores(){

try{

const response = await fetch("http://localhost:3000/api/stores")

if(!response.ok) throw new Error("Stores endpoint not ready")

stores = await response.json()

}catch(error){

console.log("Using mock stores")

stores = [
{
id:1,
name:"Pizza Store",
image:"https://images.pexels.com/photos/4109084/pexels-photo-4109084.jpeg"
},
{
id:2,
name:"Burger House",
image:"https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
},
{
id:3,
name:"Sushi Bar",
image:"https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg"
}
]

}

renderStores()

}

// cargar productos desde backend
async function loadProducts(){

try{

const response = await fetch("http://localhost:3000/api/products")

if(!response.ok) throw new Error("Products endpoint not ready")

products = await response.json()

}catch(error){

console.log("Using mock products")

products = [

{
id:1,
storeId:1,
name:"Pepperoni Pizza",
price:22000,
image:"https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg"
},

{
id:2,
storeId:1,
name:"Cheese Pizza",
price:20000,
image:"https://images.pexels.com/photos/4109084/pexels-photo-4109084.jpeg"
},

{
id:3,
storeId:2,
name:"Classic Burger",
price:18000,
image:"https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
},

{
id:4,
storeId:2,
name:"French Fries",
price:9000,
image:"https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg"
},

{
id:5,
storeId:3,
name:"Sushi Roll",
price:25000,
image:"https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg"
}

]

}

renderProducts()

}

function renderStores(){

storeDiv.innerHTML=""

stores.forEach(store=>{

const div=document.createElement("div")

div.className="store-card"

div.onclick=()=>selectStore(store.id)

div.innerHTML=`
<img src="${store.image}" onerror="this.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'">
<h3>${store.name}</h3>
`

storeDiv.appendChild(div)

})

}

function selectStore(id){

selectedStore = id
renderProducts()

}

function renderProducts(){

productDiv.innerHTML=""

let filteredProducts = products

if(selectedStore){
filteredProducts = products.filter(p=>p.storeId===selectedStore)
}

filteredProducts.forEach(product=>{

const div=document.createElement("div")

div.className="product-card"

div.innerHTML=`
<img src="${product.image}" onerror="this.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'">
<h3>${product.name}</h3>
<p>$${product.price}</p>
<button onclick="addToCart(${product.id})">Agregar</button>
`

productDiv.appendChild(div)

})

}

function addToCart(id){

const product = products.find(p=>p.id===id)

if(!product) return

cart.push(product)

renderCart()

}

function removeFromCart(index){

cart.splice(index,1)

renderCart()

}

function renderCart(){

cartList.innerHTML=""

let total=0

cart.forEach((item,index)=>{

const li=document.createElement("li")

li.innerHTML=`
${item.name} - $${item.price}
<button onclick="removeFromCart(${index})">❌</button>
`

cartList.appendChild(li)

total+=item.price

})

totalText.innerText=`Total: $${total}`
cartCount.innerText = cart.length

}

// crear orden en backend
async function createOrder(){

if(cart.length === 0){
alert("El carrito está vacío")
return
}

const order = {
items: cart,
total: cart.reduce((sum,item)=> sum + item.price,0)
}

try{

const response = await fetch("http://localhost:3000/api/orders",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(order)
})

if(!response.ok){
throw new Error("Error creando orden")
}

await response.json()

alert("Orden creada correctamente!")

cart = []
renderCart()

}catch(error){

console.log(error)

alert("No se pudo crear la orden. El backend puede no estar listo.")

}

}

// cargar datos cuando inicia la app
loadStores()
loadProducts()
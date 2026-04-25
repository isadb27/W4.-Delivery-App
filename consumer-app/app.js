/* eslint-disable */

// =======================
// SUPABASE 
// =======================
const SUPABASE_URL = "https://romjxixsasvtnevljnep.supabase.co"
const SUPABASE_KEY = "sb_publishable_pBKTpNq5oUaWz5tCfJE8wA_nGgLKGZK"
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

// =======================
let stores = []
let products = []

let cart = []
let selectedStore = null

let selectedLat = null
let selectedLng = null

const API_URL = "https://w4-delivery-app.vercel.app"

const storeDiv = document.getElementById("stores")
const productDiv = document.getElementById("products")
const cartList = document.getElementById("cart")
const totalText = document.getElementById("total")
const cartCount = document.getElementById("cart-count")

// =======================
// MAPA PRINCIPAL
// =======================
const map = L.map('map').setView([3.45, -76.53], 13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

let marker

map.on('click', function(e){

  selectedLat = e.latlng.lat
  selectedLng = e.latlng.lng

  if(marker){
    map.removeLayer(marker)
  }

  marker = L.marker([selectedLat, selectedLng]).addTo(map)

  document.getElementById("coords").innerText =
    `Ubicación: ${selectedLat.toFixed(4)}, ${selectedLng.toFixed(4)}`
})

// =======================
// ORDEN
// =======================
function openMap(){
  if(cart.length === 0){
    alert("El carrito está vacío")
    return
  }

  document.getElementById("map-container").style.display = "block"

  setTimeout(() => {
    map.invalidateSize()
  }, 200)
}

async function confirmOrder(){

  if(selectedLat === null || selectedLng === null){
    alert("Selecciona una ubicación en el mapa")
    return
  }
console.log("📍 ENVIANDO:", selectedLat, selectedLng)
  const order = {
    items: cart,
    total: cart.reduce((sum,item)=> sum + item.price,0),
    lat: selectedLat,
    lng: selectedLng
  }

  try{
    const response = await fetch(`${API_URL}/api/orders`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(order)
    })

    if(!response.ok) throw new Error()

    await response.json()

    alert("Orden creada correctamente!")

    cart = []
    renderCart()

    selectedLat = null
    selectedLng = null

    document.getElementById("map-container").style.display = "none"

    if(marker){
      map.removeLayer(marker)
    }

    document.getElementById("coords").innerText = ""

  }catch(error){
    alert("Error creando orden")
  }
}

// =======================
// MAPAS PEDIDOS
// =======================
const orderMaps = {}
const deliveryMarkers = {}

async function loadMyOrders(){

  const res = await fetch(`${API_URL}/api/orders`)
  const orders = await res.json()

  const div = document.getElementById("orders")
  div.innerHTML = ""

  orders.forEach(o => {

    const orderDiv = document.createElement("div")

    orderDiv.innerHTML = `
      <h3>Orden #${o.id}</h3>
      <p>Total: $${o.total}</p>
      <p>Estado: ${o.status}</p>
      <div id="map-${o.id}" style="height:200px; margin-bottom:20px;"></div>
    `

    div.appendChild(orderDiv)

    setTimeout(() => {

      if(!o.destination) return

      const coords = extractCoords(o.destination)

      if(!orderMaps[o.id]){
        const mapOrder = L.map(`map-${o.id}`).setView(coords, 15)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
          .addTo(mapOrder)

        L.marker(coords)
          .addTo(mapOrder)
          .bindPopup("📍 Destino")

        orderMaps[o.id] = mapOrder
      }

    }, 100)

  })
}

// =======================
// REALTIME
// =======================
supabaseClient
  .channel('orders-realtime')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders'
    },
    payload => {

      const order = payload.new

      if(order.delivery_position){
        updateDeliveryOnMap(order)
      }
    }
  )
  .subscribe()

function updateDeliveryOnMap(order){

  const mapInstance = orderMaps[order.id]
  if(!mapInstance) return

  const coords = extractCoords(order.delivery_position)

  if(deliveryMarkers[order.id]){
    deliveryMarkers[order.id].setLatLng(coords)
  }else{
    deliveryMarkers[order.id] = L.marker(coords)
      .addTo(mapInstance)
      .bindPopup("🚴 Repartidor")
  }
}

// =======================
// UTIL
// =======================
function extractCoords(point){

  const match = point.match(/POINT\(([-\d.]+) ([-\d.]+)\)/)

  if(!match) return [0,0]

  const lng = parseFloat(match[1])
  const lat = parseFloat(match[2])

  return [lat, lng]
}

// =======================
// DATA
// =======================
async function loadStores(){

try{
const response = await fetch(`${API_URL}/api/stores`)
if(!response.ok) throw new Error()
stores = await response.json()
}catch{
stores = [
{ id:1,name:"Pizza Store",image:"https://images.pexels.com/photos/4109084/pexels-photo-4109084.jpeg"},
{ id:2,name:"Burger House",image:"https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"},
{ id:3,name:"Sushi Bar",image:"https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg"}
]
}

renderStores()
}

async function loadProducts(){

try{
const response = await fetch(`${API_URL}/api/products`)
if(!response.ok) throw new Error()
products = await response.json()
}catch{
products = [
{ id:1,storeId:1,name:"Pepperoni Pizza",price:22000,image:"https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg"},
{ id:2,storeId:1,name:"Cheese Pizza",price:20000,image:"https://images.pexels.com/photos/4109084/pexels-photo-4109084.jpeg"},
{ id:3,storeId:2,name:"Classic Burger",price:18000,image:"https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"},
{ id:4,storeId:2,name:"French Fries",price:9000,image:"https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg"},
{ id:5,storeId:3,name:"Sushi Roll",price:25000,image:"https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg"}
]
}

renderProducts()
}

// =======================
// UI
// =======================
function renderStores(){
storeDiv.innerHTML=""

stores.forEach(store=>{
const div=document.createElement("div")
div.className="store-card"
div.onclick=()=>selectStore(store.id)

div.innerHTML=`
<img src="${store.image || store.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}"
     onerror="this.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'">
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

let filtered = selectedStore
  ? products.filter(p => (p.store_id || p.storeId) === selectedStore)
  : products

filtered.forEach(product=>{
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

// =======================
// INIT
// =======================
loadStores()
loadProducts()
function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between ">
  <div>
  <span class="item-text" style=" font-family: 'Almarai', sans-serif;">${item.text}</span> <br>
  <span class="item-text" style=" font-size: .9rem";>${item.date}</span> <br><br>
  <span class="item-text">${item.name}</span> <br> 
  </div>
  </li>`
}



// Initial Page Load Render
let ourHTML = items.map(function(item) {
  return itemTemplate(item)
}).join('')
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)

// Create Feature
let createField = document.getElementById("create-field")
let createField2 = document.getElementById("create-field2")

document.getElementById("create-form").addEventListener("submit", function(e) {
  e.preventDefault()

    axios.post('/create-item', {text: createField.value, name: createField2.value}).then(function (response) {
      // Create the HTML for a new item
      document.getElementById("item-list").insertAdjacentHTML("afterbegin", itemTemplate(response.data))
      createField.value = ""
      createField2.value = ""
  
    }).catch(function() {
      console.log("Please try again later.")
    })
  
})

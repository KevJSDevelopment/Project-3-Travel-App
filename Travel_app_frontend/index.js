const URL = "http://localhost:3000";
const nav = () => document.querySelector("nav");
const body = () => document.querySelector("body");
// const bookingsList = () => document.querySelector("#bookings")
let account =  null;
document.addEventListener("DOMContentLoaded", () => {
  seeProfile();
  getDestinations();
  showCarousel()
  // bookingsList().remove();
});

function getDestinations() {
    let locationFrom = document.querySelector("#location-from")
    let locationTo = document.querySelector("#location-to")
    let locForm = document.querySelector("#location-form")
    
    fetch(URL + "/destinations")
    .then(resp => resp.json())
    .then(destinations => {
      destinations.forEach(destination => {
        let fromOption = document.createElement("option")
        fromOption.innerText = destination.name
        let toOption = document.createElement("option")
        toOption.innerText = destination.name
        locationFrom.append(fromOption)
        locationTo.append(toOption)
      });
    })

    locForm.addEventListener("submit", seeBookings)
}
function seeProfile() {

  let createAccount = document.createElement("button");
  createAccount.classList = "btn btn-light";
  createAccount.innerText = "Create Account";

  createAccount.addEventListener("click", () => {
    let accountForm = document.createElement("form");
    let nameDiv = document.createElement("div");
    nameDiv.classList = "form-group";
    let nameLabel = document.createElement("label");
    nameLabel.innerText = "Username";
    let nameInput = document.createElement("input");
    nameInput.type = "username";
    nameInput.classList = "form-control";
    nameInput.placeholder = "Enter username";
    let loginButton = document.createElement("button");
    loginButton.type = "submit";
    loginButton.value = "Submit";
    loginButton.innerText = "submit";
    loginButton.classList = "btn btn-success";

    accountForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        
        fetch(URL + "/travelers", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({ name: ev.target[0].value })
        })
        .then((resp) => resp.json())
        .then(currentAccount => {
            account = currentAccount 
            createAccount.remove()
            accountForm.remove()

            let profile = document.createElement("button");
            profile.classList = "btn btn-light";
            profile.innerText = "Profile";

            profile.addEventListener('click', () => { showProfile(account) })

            nav().append(profile);
      })
    });
    nameDiv.append(nameLabel, nameInput, loginButton);
    accountForm.append(nameDiv);

    body().append(accountForm);
  });

  nav().append(createAccount);
}

function showProfile(profileAccount) {
    let profileDiv = document.createElement("div")
    profileDiv.classList = "card"
    // <div class="card-body">
    //     <h5 class="card-title">Card title</h5>
    //     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    //     <a href="#" class="btn btn-primary">Go somewhere</a>
    // </div>
    let profileName = document.createElement("h3")
    profileName.innerText = profileAccount.name
    profileName.classList = "card-title"
    profileDiv.append(profileName)
    body().append(profileDiv)
}

function seeBookings(event) {
  event.preventDefault();
  let destination = event.target[1].value
  
  let bookingList = document.querySelector("#bookings-list")

  while (bookingList.firstChild) {
    bookingList.removeChild(bookingList.firstChild);
  } 
  //console.log( bookingList )
  
  fetch(URL + "/bookings", {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({destination: destination})
  })
  .then(res => res.json())
  .then(rooms => rooms.forEach(room => {   
    // fetch to get rooms
    fetch(URL + "/hotels", {
      method: "POST", 
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({hotel_id: room.hotel_id})
    })
    .then(resp => resp.json())
    .then(hotel => {
      //fetch for each room's corresponding hotel
      let from = event.target[0].value
      let to = event.target[1].value
      let dateFrom = event.target[2].value
      let dateTo = event.target[3].value
      
      let roomDiv = document.createElement("div")
      roomDiv.classList = "col-5"
      
      let cardDiv = document.createElement("div")
      cardDiv.classList = "card card-block"
      
      let hotelName = document.createElement("h2")
      hotelName.innerText = hotel.name
      
      let roomNum = document.createElement("p") 
      roomNum.classList = "subtitle"
      roomNum.innerText= "Room number: " + room.id
      
      let roomPrice = document.createElement("p") 
      roomPrice.classList = "subtitle"
      roomPrice.innerText= "Price per night: $" + room.price
      
      let bookingBtn = document.createElement("button")
      
      bookingBtn.addEventListener("click", () => {
        // event listener for submitting a booking
        fetch(URL + "/flights", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ loc_from: from, loc_to: to, days_out: getDaysBetween(dateFrom)})
        })
        .then(resp => resp.json())
        .then(travelPrice => makeModal(room, travelPrice, from, to, dateFrom, dateTo))
      })
      bookingBtn.classList = "btn btn-success btn-sm booking-btn"
      bookingBtn.innerText = "Book Room"
      
      cardDiv.append(hotelName)
      cardDiv.append(roomNum)
      cardDiv.append(roomPrice)
      cardDiv.append(bookingBtn)
      roomDiv.append(cardDiv)
      bookingList.append(roomDiv)
      
      // let locForm = document.querySelector("#location-form")
      // locForm.reset()
      // end of hotel fetch
    })
    //end of rooms fetch
  }))
  // end of seeBookings function
}
function confirmTrip(event, roomId, location, destination, travelPrice, roomPrice, user, dateFrom, dateTo) {
  // debugger
  fetch(URL + "/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      room_id: roomId, 
      location: location,
      destination: destination, 
      travel_price: travelPrice, 
      room_price: roomPrice, 
      traveler: user, 
      date_from: dateFrom, 
      date_to: dateTo
    })
  })
    .then((resp) => {
    return resp.json()
    
    })
    .then((json) => {
      let currentTripButton = document.createElement("button")
      currentTripButton.classList = "btn btn-light"
      currentTripButton.innerText = "My Trips"
      currentTripButton.addEventListener("click", myTrips)
      
      nav().append(currentTripButton)
      let bookingLi = document.querySelector("#bookings")
      let locationForm = document.querySelector("#location-form")
     
      bookingLi.remove()
      locationForm.remove()
      let modal = document.querySelector("#modal")
      modal.remove()
      let carousel = document.querySelector('#carouselExampleFade')
      carousel.remove()
      
      myTrips();
  })
}

function myTrips() {
  // console.log("chexking")
  let prevContainer = document.querySelector("#trip-container")
  if(prevContainer != null){
    prevContainer.remove()
  }

  let container = document.createElement("div")
  container.classList = "container"
  container.id = "trip-container"
  
  fetch(URL + "/trips")
    .then((resp) => {
    return resp.json()
  })
    .then((trips) => {
    trips.forEach(trip => {
      fetch(URL + "/destinations/" + trip.destination_id)
      .then(res => res.json())
      .then(loc => {
        let card = document.createElement("card")
        card.classList = "card"
        card.style.width = "18rem"

        let img = document.createElement("img")
        img.classList = "card-img-top"
        img.src = loc.image
        img.alt = "Card image cap"

        let div = document.createElement("div")
        div.classList = "card-body"

        let h5 = document.createElement("h5")
        h5.classList = "card-title"
        h5.innerText = "Trip ID: " + trip.id

        let p1 = document.createElement("p")
        p1.classList = "card-text"
        p1.innerText = "Destination: " + loc.name

        let p2 = document.createElement("p")
        p2.classList = "card-text"
        p2.innerText = "Date: " + trip.date_from + "-" + trip.date_to

        let p3 = document.createElement("p")
        p3.classList = "card-text"
        let days = getDays(trip.date_from, trip.date_to) + 1
        let total = (trip.travel_price + (trip.room_price * days)).toFixed(2)
        p3.innerText = "Trip Cost: $" + total

        let button = document.createElement("button")
        button.classList = "btn btn-info btn-sm"
        button.innerText = "Edit Trip"
        fetch(URL + "/rooms/" + trip.room_id)
        .then(resp => resp.json())
        .then(room => {
          button.addEventListener('click', () => {
            makeModal(room, trip.travel_price, trip.location_id, trip.destination_id, trip.date_from, trip.date_to, trip)
          })
        })
        
        div.append(h5, p1, p2, p3, button)
        card.append(img, div)
        container.append(card)
        body().append(container)
      })
    })
  })
}

function makeModal(room, travelPrice, loc, dest, dateFrom, dateTo, trip = null) {
  
  if(trip != null){
    let modalDiv = document.createElement("div")
            
    modalDiv.classList = "modal" 
    modalDiv.id ="modal"
    modalDiv.tabIndex = "-1"
    modalDiv.role = "dialog"
    
    let dialogModal = document.createElement("div")
    dialogModal.classList = "modal-dialog"
    dialogModal.role = "document"
    
    let modalContent = document.createElement("form")
    modalContent.classList = "modal-content"
  
    // Header
        
    let modalHeader = document.createElement("div")
    modalHeader.classList = "modal-header"
    let h5 = document.createElement("h5")
    h5.classList = "modal-title"
    h5.innerHTML = "Booking Information"
    modalHeader.append(h5)
    
    // BODY
    
    let modalBodyDiv = document.createElement("div")
    modalBodyDiv.classList = "modal-body"
    let fromTag = document.createElement("p")
    fromTag.innerText = "Leaving from: " + loc
    let toTag = document.createElement("p")
    toTag.innerText = "Arriving at: " + dest
    let roomPrice = document.createElement("p")
    roomPrice.innerText = `Hotel room price: $${room.price} per night`
    let flightPrice  = document.createElement("p")
    flightPrice.innerText = "Roundtrip flight price: $" + travelPrice.toFixed(2)

    let startingDate = document.createElement("div")
    startingDate.classList = "input-group date"
    startingDate.setAttribute("data-provide", "datepicker")

    let endingDate = document.createElement("div")
    endingDate.classList = "input-group date"
    endingDate.setAttribute("data-provide", "datepicker")

    let startDate = document.createElement("input")
    startDate.type ="text"
    startDate.classList = "form-control"
    startDate.value = dateFrom

    let startAddOn = document.createElement("div")
    startAddOn.classList = "input-group-addon"

    let startSpan = document.createElement("span")
    startSpan.classList = "glyphicon glyphicon-th"

    startAddOn.append(startSpan)
    startDate.append(startAddOn)

    let endDate = document.createElement("input")
    endDate.type ="text"
    endDate.classList = "form-control"
    endDate.value = dateTo

    let endAddOn = document.createElement("div")
    endAddOn.classList = "input-group-addon"

    let endSpan = document.createElement("span")
    endSpan.classList = "glyphicon glyphicon-th"

    endAddOn.append(endSpan)
    endDate.append(endAddOn)

    startingDate.append(startDate)
    endingDate.append(endDate)

    let totalPrice = document.createElement("h4")
    
    let daysBetween = getDays(dateFrom, dateTo)
    let roomTotal = room.price * (daysBetween + 1)
    let total = (room.price + roomTotal).toFixed(2)
    totalPrice.innerHTML = `Trip Total: $ ${total}`
    
    modalBodyDiv.append(fromTag, toTag, roomPrice, flightPrice, startingDate, endingDate, totalPrice)
    
    //footer
    let modalFooter = document.createElement("div")
    modalFooter.classList = "modal-footer"
    let backButton = document.createElement("button")
    backButton.onclick = function () { modalDiv.remove() }
    backButton.type = "button"
    backButton.classList = "btn btn-secondary" 
    backButton.setAttribute("data-dismiss", "modal")
    backButton.innerHTML = "Back"
    let confirmButton = document.createElement('button')    
    confirmButton.type = "submit"
    confirmButton.classList = "btn btn-primary"
    confirmButton.innerText = "Confirm Booking"
    modalFooter.append(backButton, confirmButton)
    
    modalContent.addEventListener("submit", () => { 
      debugger
      fetch(URL + "/trips/" + trip.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date_from: event.target, date_to: event})
      }).then((resp) => resp.json())
        .then((trip) => console.log(trip))
    })
    
    modalContent.append(modalHeader, modalBodyDiv, modalFooter)
    dialogModal.append(modalContent)
    modalDiv.append(dialogModal)
    
    body().append(modalDiv)
    modalDiv.style.display = "block"
  }
  else {
    let modalDiv = document.createElement("div")
          
    modalDiv.classList = "modal" 
    modalDiv.id ="modal"
    modalDiv.tabIndex = "-1"
    modalDiv.role = "dialog"
    
    let dialogModal = document.createElement("div")
    dialogModal.classList = "modal-dialog"
    dialogModal.role = "document"
    
    let modalContent = document.createElement("div")
    modalContent.classList = "modal-content"

    // Header
        
    let modalHeader = document.createElement("div")
    modalHeader.classList = "modal-header"
    let h5 = document.createElement("h5")
    h5.classList = "modal-title"
    h5.innerHTML = "Booking Information"
    modalHeader.append(h5)
    
    // BODY
    
    let modalBodyDiv = document.createElement("div")
    modalBodyDiv.classList = "modal-body"
    let fromTag = document.createElement("p")
    fromTag.innerText = "Leaving from: " + loc
    let toTag = document.createElement("p")
    toTag.innerText = "Arriving at: " + dest
    let roomPrice = document.createElement("p")
    roomPrice.innerText = `Hotel room price: $${room.price} per night`
    let flightPrice  = document.createElement("p")
    flightPrice.innerText = "Roundtrip flight price: $" + travelPrice.toFixed(2)

    let tripDate = document.createElement("p")
    tripDate.innerText = dateFrom + "-" + dateTo
    let totalPrice = document.createElement("h4")
    
    let daysBetween = getDays(dateFrom, dateTo)
    let roomTotal = room.price * (daysBetween + 1)
    let total = (room.price + roomTotal).toFixed(2)
    totalPrice.innerHTML = `Trip Total: $ ${total}`
    modalBodyDiv.append(fromTag, toTag, roomPrice, flightPrice, tripDate, totalPrice)
    //footer
    let modalFooter = document.createElement("div")
    modalFooter.classList = "modal-footer"
    let backButton = document.createElement("button")
    backButton.onclick = function () { modalDiv.remove() }
    backButton.type = "button"
    backButton.classList = "btn btn-secondary" 
    backButton.setAttribute("data-dismiss", "modal")
    backButton.innerHTML = "Back"
    let confirmButton = document.createElement('button')
    
    confirmButton.addEventListener("click", (event) => { confirmTrip(event, room.id, loc, dest, travelPrice, room.price, account, dateFrom, dateTo) })
    
    confirmButton.type = "submit"
    confirmButton.classList = "btn btn-primary"
    confirmButton.innerText = "Confirm Booking"
    modalFooter.append(backButton, confirmButton)
    
    
    modalContent.append(modalHeader, modalBodyDiv, modalFooter)
    dialogModal.append(modalContent)
    modalDiv.append(dialogModal)
    
    body().append(modalDiv)
    modalDiv.style.display = "block"
  }
  
  
}


function getDaysBetween(date) {
  let today = new Date();
  // let dd = String(today.getDate()).padStart(2, '0');
  // let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  // let yyyy = today.getFullYear();
  
  // today = mm + '/' + dd + '/' + yyyy;
  let newDate = new Date(date)
  let diffTime = Math.abs(newDate - today);
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays 
  // let dateArray = date.split("/")
  // let monthPicked = date[0]
  // let dayPicked = date[1]
  // let yearPicked = date[2]

}

function getDays(date, date2) {
  let from = new Date(date);
  // let dd = String(today.getDate()).padStart(2, '0');
  // let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  // let yyyy = today.getFullYear();
  
  // today = mm + '/' + dd + '/' + yyyy;
  let to = new Date(date2)
  let diffTime = Math.abs(to - from);
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays 
}

function showCarousel() {

  let destinationCarousel = document.querySelector("#location-carousel")
  //console.log(locationCarousel)
  fetch(URL + "/destinations")
    .then((resp) => {
      return resp.json()
    }).then((destinations) => {
      destinations.forEach((destination) => {

        if (destination === destinations[0]) {
          let imageDiv = document.createElement('div')
          imageDiv.classList = "carousel-item active"
          let image = document.createElement("img")
          image.src = destination.image
          image.classList = "d-block w-75" 
          image.alt="First slide"
        
          imageDiv.append(image)
          destinationCarousel.append(imageDiv)
          
        
        }
        else {
          let imageDiv = document.createElement('div')
          imageDiv.classList = "carousel-item"
          let image = document.createElement("img")
          image.src = destination.image
          image.classList = "d-block w-75" 
          image.alt="First slide"
          imageDiv.append(image)
          destinationCarousel.append(imageDiv)
          
        }
          
    })
  })

  
  

  
  // <div class="carousel-item active">
  //               <img class="d-block w-100" src=".../800x400?auto=yes&bg=777&fg=555&text=First slide" alt="First slide">
  //             </div>
  //             <div class="carousel-item">
  //               <img class="d-block w-100" src=".../800x400?auto=yes&bg=666&fg=444&text=Second slide" alt="Second slide">
  //             </div>
  //             <div class="carousel-item">
  //               <img class="d-block w-100" src=".../800x400?auto=yes&bg=555&fg=333&text=Third slide" alt="Third slide">
  //             </div>

}
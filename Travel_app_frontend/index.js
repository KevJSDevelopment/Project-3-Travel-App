const URL = "http://localhost:3000";
const nav = () => document.querySelector("nav");
const body = () => document.querySelector("body");
// const bookingsList = () => document.querySelector("#bookings")
let account =  null;
document.addEventListener("DOMContentLoaded", () => {
  seeProfile();
  getLocations();
  showCarousal()
  // bookingsList().remove();
});

function getLocations() {
    let locationFrom = document.querySelector("#location-from")
    let locationTo = document.querySelector("#location-to")
    let locForm = document.querySelector("#location-form")
    
    fetch(URL + "/locations")
    .then(resp => resp.json())
    .then(locations => {
      locations.forEach(location => {
        let fromOption = document.createElement("option")
        fromOption.innerText = location.name
        let toOption = document.createElement("option")
        toOption.innerText = location.name
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
        .then(travelPrice => {
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
          fromTag.innerText = "Leaving from: " + from
          let toTag = document.createElement("p")
          toTag.innerText = "Arriving at: " + to
          let roomPrice = document.createElement("p")
          roomPrice.innerText = `Hotel room price: $${room.price} per night`
          let flightPrice  = document.createElement("p")
          flightPrice.innerText = "Roundtrip flight price: $" + travelPrice.toFixed(2)
          let tripDate = document.createElement("p")
          tripDate.innerText = dateFrom + "-" + dateTo
          let totalPrice = document.createElement("h4")

          let daysBetween = getDays(dateFrom, dateTo)
          let roomTotal = room.price * (daysBetween + 1)
          let total = (travelPrice + roomTotal).toFixed(2)

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
          
          confirmButton.addEventListener("click", (event) => { confirmTrip(event,room.id,to,total,account) })
          
          confirmButton.type = "submit"
          confirmButton.classList = "btn btn-primary"
          confirmButton.innerText = "Confirm Booking"
          modalFooter.append(backButton, confirmButton)

          
          modalContent.append(modalHeader, modalBodyDiv, modalFooter)
          dialogModal.append(modalContent)
          modalDiv.append(dialogModal)
          
          body().append(modalDiv)
          modalDiv.style.display = "block"
          
        // end of event listener
        })
        })
        bookingBtn.classList = "btn btn-success btn-sm booking-btn"
        bookingBtn.innerText = "Book Room"
        
        cardDiv.append(hotelName)
        cardDiv.append(roomNum)
        cardDiv.append(roomPrice)
        cardDiv.append(bookingBtn)
        roomDiv.append(cardDiv)
      bookingList.append(roomDiv)
      
      // end of hotel fetch
    })
    //end of rooms fetch
    }))
  // end of seeBookings function
}

function confirmTrip(event,roomId,location, price,user) {
  

  fetch(URL + "/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room_id: roomId, location: location, price: price, traveler:user})
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
     

  })
}

function myTrips() {
  // console.log("chexking")
  fetch(URL + "/trips")
    .then((resp) => {
    return resp.json()
  })
    .then((json) => {
    console.log(json)
  })
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

function showCarousal() {

  let locationCarousel = document.querySelector("#location-carousel")
  //console.log(locationCarousel)
  fetch(URL + "/locations")
    .then((resp) => {
      return resp.json()
    }).then((locations) => {
      locations.forEach((location) => {

        if (location === locations[0]) {
          let imageDiv = document.createElement('div')
          imageDiv.classList = "carousel-item active"
          let image = document.createElement("img")
          image.src = location.image
          image.classList = "d-block w-75" 
          image.alt="First slide"
        
          imageDiv.append(image)
          locationCarousel.append(imageDiv)
          
        
        }
        else {
          let imageDiv = document.createElement('div')
          imageDiv.classList = "carousel-item"
          let image = document.createElement("img")
          image.src = location.image
          image.classList = "d-block w-75" 
          image.alt="First slide"
          imageDiv.append(image)
          locationCarousel.append(imageDiv)
          
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
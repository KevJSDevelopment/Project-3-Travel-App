const URL = "http://localhost:3000";
const nav = () => document.querySelector("nav");
const body = () => document.querySelector("body");
const cont = () => document.querySelector("div.container-body");
const title = () => document.querySelector("#app-title");
const alertCont = () => document.querySelector(".alert-container")
// const bookingsList = () => document.querySelector("#bookings")
let account = null;
let keepAlert = false;
document.addEventListener("DOMContentLoaded", () => {
  seeProfile();
  getDestinations();
  showCarousel();
  title().addEventListener('click', getDestinations)
  // bookingsList().remove();
});

function getDestinations() {
  while (cont().firstChild) {
    cont().removeChild(cont().firstChild);
  } 

  if (keepAlert === false) {
    while(alertCont().firstChild) {
      alertCont().removeChild(alertCont().firstChild);
    }
  } else {
    keepAlert = false
  }
  cont().innerHTML = `<div class="bootstrap-iso">
  <div class="container-fluid" id="background">
    <div class="row">
      <form id="location-form">
       
        <select class="form-control form-control-lg" id="location-from">
          
        </select>
        <select class="form-control form-control-lg" id="location-to">
            
        </select>
        <form class="form-horizontal" method="post" id="date-form">
        <div class="form-group ">
          <label class="control-label col-sm-2 requiredField" for="date">
          From: 
          </label>
          <div class="col-sm-10">
          <div class="input-group">
            <div class="input-group-addon">
            <i class="fa fa-calendar">
            </i>
            </div>
            <input class="form-control" id="fromDate" name="date" placeholder="MM/DD/YYYY" type="text"/>
          </div>
          </div>
        </div>
        <div class="form-group">
            <label class="control-label col-sm-2 requiredField" for="date">
            To: 
            </label>
            <div class="col-sm-10">
            <div class="input-group">
              <div class="input-group-addon">
              <i class="fa fa-calendar">
              </i>
              </div>
              <input class="form-control" id="toDate" name="date" placeholder="MM/DD/YYYY" type="text"/>
            </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-10 col-sm-offset-2">
            <button class="btn btn-primary " name="submit" type="submit" id="travel-button">
              Submit
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
</form>
<div class="container">
  <div class="row justify-content-around">
    <div class="col-md-6">
      <div id="carouselExampleFade" class="carousel slide carousel-fade" data-ride="carousel">
        <div id="location-carousel"class="carousel-inner">
          
        </div>
        <a id="prev"class="carousel-control-prev" href="#carouselExampleFade" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a id="next"class="carousel-control-next" href="#carouselExampleFade" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
    </div>
    </div>
    <div class="col-md-6">
      <div class="card-div" id="bookings-card">   
        <div class="container-fluid" id="bookings">
          <h1 class="mt-5">Available Bookings</h1>
          <p class="subtitle">List of all rooms that are available</p>
          <div class="scrolling-wrapper row flex-row flex-nowrap mt-4 pb-4" id="bookings-list">
            
          </div>
        </div>
        </div>
    </div>
  </div>
</div>` 
  showCarousel()
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
    while (cont().firstChild) {
      cont().removeChild(cont().firstChild);
    } 
    while(alertCont().firstChild) {
      alertCont().removeChild(alertCont().firstChild);
    }
    let accountDiv = document.createElement("div")
    accountDiv.classList = "card-div"

    let accountForm = document.createElement("form");
    let nameDiv = document.createElement("div");
    nameDiv.classList = "form-group";
    let nameLabel = document.createElement("label");
    nameLabel.innerText = "Create New Account";
    let nameInput = document.createElement("input");
    nameInput.type = "username";
    nameInput.classList = "form-control";
    nameInput.placeholder = "Enter username";
    let loginButton = document.createElement("button");
    loginButton.type = "submit";
    loginButton.value = "Submit";
    loginButton.innerText = "Create account";
    loginButton.classList = "btn btn-success";

    accountForm.addEventListener("submit", (ev) => {
        ev.preventDefault();
        while(alertCont().firstChild) {
          alertCont().removeChild(alertCont().firstChild);
        }
        fetch(URL + "/travelers", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            },
            body: JSON.stringify({ name: ev.target[0].value })
        })
        .then((resp) => resp.json())
        .then(newAccount => {
          if(newAccount != "You must have a username"){
            account = newAccount 
            loginBtn.remove()
            createAccount.remove()
            accountForm.remove()
            
            let profile = document.createElement("button");
            profile.classList = "btn btn-light";
            profile.innerText = "Profile";
            profile.id = "prof-btn"

            let tripsBtn = document.createElement("button");
            tripsBtn.classList = "btn btn-light";
            tripsBtn.innerText = "My Trips";
            tripsBtn.id = "trips-btn"

            let bookTrip = document.createElement("button");
            bookTrip.classList = "btn btn-light";
            bookTrip.innerText = "New Trip";
            bookTrip.id = "new-trip-btn"

            profile.addEventListener('click', () => { showProfile(account) })

            tripsBtn.addEventListener('click', myTrips)

            bookTrip.addEventListener('click', getDestinations)

            nav().append(profile, tripsBtn, bookTrip);
            getDestinations();
          }
          else 
          {
            while(alertCont().firstChild) {
              alertCont().removeChild(alertCont().firstChild);
            }
            let myAlert = document.createElement("div")
            myAlert.classList = "alert alert-danger"
            myAlert.role = "alert"
            myAlert.innerText = newAccount
    
            alertCont().appendChild(myAlert)
          }
      })
    });
    nameDiv.append(nameLabel, nameInput, loginButton);
    accountForm.append(nameDiv);
    accountDiv.append(accountForm);
    cont().append(accountDiv);
  });

  let loginBtn = document.createElement("button")
  loginBtn.classList = "btn btn-light";
  loginBtn.innerText = "login";

  loginBtn.addEventListener("click" , () => {
    while (cont().firstChild) {
      cont().removeChild(cont().firstChild);
    } 
    let loginDiv = document.createElement("div")
    loginDiv.classList = "card-div"
    let loginForm = document.createElement("form");
    let divName = document.createElement("div");
    divName.classList = "form-group";
    let nameLab = document.createElement("label");
    nameLab.innerText = "Login";
    let nameInfo = document.createElement("input");
    nameInfo.type = "username";
    nameInfo.classList = "form-control";
    nameInfo.placeholder = "Enter username";
    let submitLogin = document.createElement("button");
    submitLogin.type = "submit";
    submitLogin.value = "Submit";
    submitLogin.innerText = "submit login";
    submitLogin.classList = "btn btn-success";

    loginForm.addEventListener("submit", (ev) => {
      ev.preventDefault();

      fetch(URL + "/travelers/login", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        body: JSON.stringify({ name: ev.target[0].value })
      })
    .then(resp => resp.json())
    .then(currentAccount => {
      if(currentAccount === "No user found") {
        while(alertCont().firstChild) {
          alertCont().removeChild(alertCont().firstChild);
        }
        let myAlert = document.createElement("div")
        myAlert.classList = "alert alert-danger"
        myAlert.role = "alert"
        myAlert.innerText = currentAccount

        alertCont().appendChild(myAlert)
      }
      else
      {
        account = currentAccount
        loginBtn.remove()
        createAccount.remove()
        loginForm.remove()
        
        let profile = document.createElement("button");
        profile.classList = "btn btn-light";
        profile.innerText = "Profile";

        let tripsBtn = document.createElement("button");
        tripsBtn.classList = "btn btn-light";
        tripsBtn.innerText = "My Trips";

        let bookTrip = document.createElement("button");
        bookTrip.classList = "btn btn-light";
        bookTrip.innerText = "New Trip";

        profile.addEventListener('click', () => { showProfile(account) })

        tripsBtn.addEventListener('click', myTrips)

        bookTrip.addEventListener('click', getDestinations)

        nav().append(profile, tripsBtn, bookTrip);
        getDestinations();
      }
    })
    })

    divName.append(nameLab, nameInfo, submitLogin)
    loginForm.append(divName)
    loginDiv.append(loginForm)

    cont().append(loginDiv);

  })
  nav().append(loginBtn, createAccount);
}

function showProfile(profileAccount) {
  while (cont().firstChild) {
    cont().removeChild(cont().firstChild);
  } 
  while(alertCont().firstChild) {
    alertCont().removeChild(alertCont().firstChild);
  }
  let profileDiv = document.createElement("div")
  profileDiv.classList = "card card-div"

  let profileName = document.createElement("h3")
  profileName.innerText = capitalizeFirstLetter(profileAccount.name)
  profileName.classList = "card-title"
  profileDiv.append(profileName)

  let form = document.createElement("form")
  let formGroup = document.createElement("div")
  formGroup.classList = "form-group"
  let label = document.createElement("label")
  label.innerText = "Username:"
  let input = document.createElement("input")
  input.class="form-control"
  input.placeholder= "Name"

  formGroup.append(label,input)
  
  // let btnDiv = document.createElement("div")
  
  let editBtn = document.createElement("button")
  editBtn.innerText = "Edit Account"
  editBtn.classList = "btn btn-info btn-sm"
  editBtn.id = "edit-acc"
  editBtn.type = 'submit'
  
  
  let deleteBtn = document.createElement("button")
  deleteBtn.innerText = "Delete Account"
  deleteBtn.classList = "btn btn-danger btn-sm"
  deleteBtn.id = "delete-acc"
  deleteBtn.type = 'click'
  
  // btnDiv.append(deleteBtn, editBtn)
  form.append(formGroup, deleteBtn,editBtn)
  profileDiv.append(form)
  cont().append(profileDiv)
  
  deleteBtn.addEventListener('click', () => {
    fetch(URL + "/travelers/" + profileAccount.id)
    .then(res => res.json())
    .then((deleteMessage) => {
      while(alertCont().firstChild) {
        alertCont().removeChild(alertCont().firstChild);
      }
      let profile = document.querySelector("#prof-btn")
      let myTrips = document.querySelector("#trips-btn")
      let newTrip = document.querySelector("#new-trip-btn")

      profile.remove()
      myTrips.remove()
      newTrip.remove()

      let deleteAlert = document.createElement("div")
      deleteAlert.classList = "alert alert-success"
      deleteAlert.role = "alert"
      deleteAlert.innerText = deleteMessage

      alertCont().appendChild(deleteAlert)
      profileDiv.remove()

      keepAlert = true
      seeProfile()
      getDestinations()
      
      // while(alertCont().firstChild) {
      //   if(alertCont().removeChild(alertCont().firstChild) != deleteAlert){
      //     alertCont().removeChild(alertCont().firstChild);
      //   }
      // }
    })
  })

  form.addEventListener('submit', (ev) => { 
    ev.preventDefault()
    while(alertCont().firstChild) {
      alertCont().removeChild(alertCont().firstChild);
    }
    fetch(URL + "/travelers/" + profileAccount.id, {
      method: "PATCH",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({name: ev.target[0].value})
    })
    .then(res => res.json())
    .then(updatedAcc => {
      if(updatedAcc === "You must enter a name to edit your profile"){
        while(alertCont().firstChild) {
          alertCont().removeChild(alertCont().firstChild);
        }
      }
      else {
        while(alertCont().firstChild) {
          alertCont().removeChild(alertCont().firstChild);
        }
        account = updatedAcc
        profileName.innerText = capitalizeFirstLetter(updatedAcc.name)
        form.reset()
      }
    })
  })
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
      hotelName.class = "hotel"
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
  while(alertCont().firstChild) {
    alertCont().removeChild(alertCont().firstChild);
  }
  // console.log("chexking")
  let prevContainer = document.querySelector("#trip-container")
  if(prevContainer != null){
    prevContainer.remove()
  }
  while (cont().firstChild) {
    cont().removeChild(cont().firstChild);
  } 

  let container = document.createElement("div")
  container.classList = "container"
  container.id = "trip-container"
  
  fetch(URL + "/trips", {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({account: account})
  })
    .then((resp) => resp.json())
    .then((trips) => {
    trips.forEach(trip => {
      fetch(URL + "/destinations/" + trip.destination_id)
      .then(res => res.json())
      .then(loc => {
        let card = document.createElement("card")
        card.classList = "card"
        card.style.width = "18rem"
        card.id = "card-"+ trip.id

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
            fetch(URL + "/trips/" + trip.id)
            .then(resp => resp.json())
            .then(newTrip => {
              makeModal(room, newTrip.travel_price, newTrip.location_id, newTrip.destination_id, newTrip.date_from, newTrip.date_to, newTrip)
            })
          })
        })
        
        div.append(h5, p1, p2, p3, button)
        card.append(img, div)
        container.append(card)
        cont().append(container)
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
    // fetch(URL + "/dest_image",
    // {method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({dest_name: dest })
    //   })
    // .then(resp => resp.json())
    // .then(image => {
    //   modalHeader.style.backgroundImage= `url(${image})`;
    // })
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
    startDate.classList = "form-control date-picker"
    startDate.value = dateFrom

    let startAddOn = document.createElement("div")
    startAddOn.classList = "input-group-addon"

    let startSpan = document.createElement("span")
    startSpan.classList = "glyphicon glyphicon-th"

    startAddOn.append(startSpan)
    startDate.append(startAddOn)

    let endDate = document.createElement("input")
    endDate.type ="text"
    endDate.classList = "form-control date-picker"
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
    totalPrice.id = "total-price"
    let daysBetween = getDays(dateFrom, dateTo)
    let roomTotal = room.price * (daysBetween + 1)
    let total = (travelPrice + roomTotal).toFixed(2)
    totalPrice.innerHTML = `Trip Total: $ ${total}`
    
    modalBodyDiv.append(fromTag, toTag, roomPrice, flightPrice, startingDate, endingDate, totalPrice)
    // startDate.value.addEventListener("change", (ev) => {
    //   let tripDays = getDays(startDate.value, endDate.value)
    //   let roomTot = room.price * (tripDays + 1)
    //   let newTotal = (travelPrice + roomTot).toFixed(2)
    //   totalPrice.innerHTML = `Trip Total: $ ${newTotal}`
    //   debugger
    // })
    // endDate.value.addEventListener("change", (ev) => {
    //   let tripDays = getDays(startDate.value, endDate.value)
    //   let roomTot = room.price * (tripDays + 1)
    //   let newTotal = (travelPrice + roomTot).toFixed(2)
    //   totalPrice.innerHTML = `Trip Total: $ ${newTotal}`
    //   debugger
    // })

    startDate.addEventListener("blur", () => {
      let priceTotal = document.querySelector("#total-price")
      let tripDays = getDays(startDate.value, endDate.value)
      let roomTot = room.price * (tripDays + 1)
      let newTotal = (travelPrice + roomTot).toFixed(2)
      priceTotal.innerHTML = `Trip Total: $ ${newTotal}`
    })
    endDate.addEventListener("blur", () => {
      let priceTotal = document.querySelector("#total-price")
      let tripDays = getDays(startDate.value, endDate.value)
      let roomTot = room.price * (tripDays + 1)
      let newTotal = (travelPrice + roomTot).toFixed(2)
      priceTotal.innerHTML = `Trip Total: $ ${newTotal}`
    })
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
    
    
    modalContent.append(modalHeader, modalBodyDiv, modalFooter)
    dialogModal.append(modalContent)
    modalDiv.append(dialogModal)
    
    cont().append(modalDiv)
    modalDiv.style.display = "block"
    modalContent.addEventListener("submit", (event) => { 
      event.preventDefault()
      fetch(URL + "/trips/" + trip.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date_from: event.target[0].value, date_to: event.target[1].value})
      }).then((resp) => resp.json())
        .then((updatedTrip) => {
          let modal = document.querySelector("#modal")
          modal.remove()

          let card = document.querySelector("#card-" + updatedTrip.id)
          card.children[1].children[2].innerText = "Date: " + updatedTrip.date_from + "-" + updatedTrip.date_to
          let tripDays = getDays(updatedTrip.date_from, updatedTrip.date_to)
          let roomTotal = room.price * (tripDays + 1)
          let total = (updatedTrip.travel_price + roomTotal).toFixed(2)
          card.children[1].children[3].innerText = `Trip Total: $ ${total}`
        })
    })
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
    // fetch(URL + "/dest_image",
    // {method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({dest_name: dest })
    //   })
    // .then(resp => resp.json())
    // .then(image => {
    //   modalHeader.style.backgroundImage= `url(${image})`;
    // })
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
    
    confirmButton.addEventListener("click", (event) => { confirmTrip(event, room.id, loc, dest, travelPrice, room.price, account, dateFrom, dateTo) })
    
    confirmButton.type = "submit"
    confirmButton.classList = "btn btn-primary"
    confirmButton.innerText = "Confirm Booking"
    modalFooter.append(backButton, confirmButton)
    
    
    modalContent.append(modalHeader, modalBodyDiv, modalFooter)
    dialogModal.append(modalContent)
    modalDiv.append(dialogModal)
    
    cont().append(modalDiv)
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
          image.classList = "d-block w-100 carousel-image"  
          image.alt="First slide"
        
          imageDiv.append(image)
          destinationCarousel.append(imageDiv)
          
        
        }
        else {
          let imageDiv = document.createElement('div')
          imageDiv.classList = "carousel-item"
          let image = document.createElement("img")
          image.src = destination.image
          image.classList = "d-block w-100 carousel-image" 
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
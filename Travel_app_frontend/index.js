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
  //  event.target[3].value
  // event.target[2].value
  let destination = event.target[1].value
  let bookingList = document.querySelector("#bookings-list")
  console.log(bookingList)
  
  fetch(URL + "/bookings", {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({destination: destination})
  })
  .then(res => res.json())
  .then(rooms => rooms.forEach(room => {   
    // nested fetch request
    fetch(URL + "/hotels", {
      method: "POST", 
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({hotel_id: room.hotel_id})
    })
    .then(resp => resp.json())
    .then(hotel => {

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
      roomPrice.innerText= "Price: $" + room.price

      let bookingBtn = document.createElement("button")
      bookingBtn.classList = "btn btn-success btn-sm booking-btn"
      bookingBtn.innerText = "Book Room"

      cardDiv.append(hotelName)
      cardDiv.append(roomNum)
      cardDiv.append(roomPrice)
      cardDiv.append(bookingBtn)
      roomDiv.append(cardDiv)
      bookingList.append(roomDiv)
    })



      // <div class="col-5">
			// 	<div class="card card-block card-1"></div>
			// </div>
    })
  )
}

function showCarousal() {

  let locationCarousel = document.querySelector("#location-carousel")
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
const URL = "http://localhost:3000";
const nav = () => document.querySelector("nav");
const body = () => document.querySelector("body");
let account =  null;
document.addEventListener("DOMContentLoaded", () => {
  seeProfile();
  getLocations();
});

function getLocations() {
    let locationFrom = document.querySelector("#location-from")
    let locationTo = document.querySelector("#location-to")
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
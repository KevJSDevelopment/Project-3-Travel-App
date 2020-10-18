const URL = "http://localhost:3000";
const nav = () => document.querySelector("nav");
const body = () => document.querySelector("body");
let account =  null;
document.addEventListener("DOMContentLoaded", () => {
  // fetch(URL + "/locations")
  // .then(resp => resp.json())
  // .then()
  
  seeProfile();
});

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
      accountForm.addEventListener("submit", ev => {
          ev.preventDefault();
       

          fetch(URL + "/travelers", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
              },
              body: JSON.stringify({ name: ev.target[0].value })
                
          }).then((resp) => resp.json())
              .then(currentAccount => {
                  account = currentAccount 
                  createAccount.remove()
                  accountForm.remove()

                  let profile = document.createElement("button");
                  profile.classList = "btn btn-light";
                  profile.innerText = "Profile";

                  nav().append(profile);  
                
                  
                  
      })
    });
    nameDiv.append(nameLabel, nameInput, loginButton);
    accountForm.append(nameDiv);

    body().append(accountForm);
  });

  nav().append(createAccount);
}

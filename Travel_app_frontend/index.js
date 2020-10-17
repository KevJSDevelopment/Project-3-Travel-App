const URL = "http://localhost:3000"

document.addEventListener("DOMContentLoaded", () => {
    // fetch(URL + "/locations")
    // .then(resp => resp.json())
    // .then()

    let button = document.createElement("button")
    button.classList = "btn btn-light"
    button.innerText = "Profile"
    let div = document.querySelector("nav")
    div.append(button)
})
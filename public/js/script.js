// show password option javascript attempt.
const showPasswordBtn = document.getElementById("show_p")
showPasswordBtn.addEventListener("click", () => {
    const passInput = document.getElementById("password")
    const inputAtt = passInput.getAttribute("type")
    if (inputAtt === "password") {
        passInput.setAttribute("type", "text")
        showPasswordBtn.innerHTML = "Hide Password"
    }else {
        passInput.setAttribute("type", "password")
        showPasswordBtn.innerHTML = "Show Password"
    }
})
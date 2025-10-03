const form = document.querySelector("#update_form")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#update_vehicle")
      updateBtn.removeAttribute("disabled")
    })
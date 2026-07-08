/**
 * Notes Matrix Central Client UI Utilities
 */
;(() => {
  "use strict"

  window.addEventListener("load", () => {
    // 1. Initialize Native Bootstrap Form Validation Engine
    const validationForms = document.querySelectorAll(".needs-validation")

    Array.from(validationForms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          const passwordInput = form.querySelector('input[type="password"]')

          // 2. Extra Client-Side Protection: Run custom checks if on the registration screen
          if (passwordInput && window.location.pathname === "/register") {
            const passVal = passwordInput.value
            const repetitivePattern = /^(.)\1+$/
            const weakBlacklist = [
              "123456",
              "abcdef",
              "qwerty",
              "password",
              "111111",
              "000000",
            ]

            if (
              weakBlacklist.includes(passVal.toLowerCase()) ||
              repetitivePattern.test(passVal)
            ) {
              passwordInput.setCustomValidity("Invalid weak structure.")

              // Inject or select an element to display custom error text to user
              const feedback = passwordInput.nextElementSibling
              if (feedback && feedback.classList.contains("invalid-feedback")) {
                feedback.textContent =
                  "[REJECTED] Password pattern is too weak. Mixed values mandatory."
              }
            } else {
              passwordInput.setCustomValidity("") // Validates cleanly
            }
          }

          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
          form.classList.add("was-validated")
        },
        false,
      )
    })
  })
})()

// Find all Bootstrap alerts on the page
const alerts = document.querySelectorAll(".alert")
alerts.forEach(function (alert) {
  // Automatically close the alert overlay after 4 seconds (4000ms)
  setTimeout(function () {
    const bsAlert = new bootstrap.Alert(alert)
    bsAlert.close()
  }, 6000)
})

let app = new Vue({
  el: "#app",

  // data
  data: {
    error: false,
    error_message: "",
    nonce: "",

  },

  methods: {

    // login()
    async login() {
      this.clearErrors()
      url = "api/admin/login"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({nonce: this.nonce}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (response.status !== 200) {
          throw new Error("Bad login")
        }
        window.location.replace("/")
      }).catch(err => {
        this.error = true
        this.error_message = err.message
        console.error(err)
      })
    },

    // clearErrors()
    clearErrors() {
      this.error = false
      this.error_message = ""
    },

  },

})


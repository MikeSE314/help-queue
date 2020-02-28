let app = new Vue({
  el: "#app",

  // data
  data: {

    user: {
      username: "",
      firstname: "",
      lastname: "",
      password: "",
      c_password: "",
      admin: false,
    },

    view: {
      login: true,
      register: false,
    },

    error: false,
    error_message: "",
    helpUsers: [],
    passoffUsers: [],
    realm: "IT210 Help Queue",
  },

  methods: {

    async digestMessage(message) {
      // encode as (utf-8) Uint8Array
      const msgUint8 = new TextEncoder().encode(message)
      // hash the message
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8)
      // convert buffer to byte array
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      // convert bytes to hex string
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
      return hashHex
    },

    async getSalt_c() {
      url = "api/user/salt_c/" + this.user.username
      return await fetch(url).then(response => {
        return response.text()
      }).then(text => {
        this.salt_c = text
        return text
      }).catch(err => {
        console.error(err)
      })
    },

    async getSalt_s() {
      url = "api/user/salt_s/" + this.user.username
      return await fetch(url).then(response => {
        return response.text()
      }).then(text => {
        this.salt_s = text
        return text
      }).catch(err => {
        console.error(err)
      })
    },

    // getNonce()
    async getNonce() {
      url = "api/user/nonce/" + this.user.username
      return await fetch(url).then(response => {
        return response.text()
      }).then(text => {
        this.nonce = text
        return text
      }).catch(err => {
        console.error(err)
      })
    },

    // login()
    async login() {
      let nonce = await this.getNonce()
      let salt_c = await this.getSalt_c()
      let salt_s = await this.getSalt_s()
      let c_salted_password = await this.digestMessage(this.user.password + salt_c)
      let s_salted_password = await this.digestMessage(c_salted_password + salt_s)
      let hc = await this.digestMessage(this.user.username + this.realm + s_salted_password + nonce)
      this.clearErrors()
      url = "api/user/login"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({username: this.user.username, hc: hc}),
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

    // register()
    async register() {
      let salt_c = await this.getSalt_c()
      let c_salted_password = await this.digestMessage(this.user.password + salt_c)
      let c_salted_password_confirm = await this.digestMessage(this.user.c_password + salt_c)
      if (this.user.password != this.user.c_password) {
        this.error = true
        this.error_message = "Passwords must match"
        return
      }
      this.clearErrors()
      url = "api/user/register"
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username: this.user.username,
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          c_salted_password: c_salted_password,
          c_salted_password_confirm: c_salted_password_confirm
        }),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (response.status !== 200) {
          throw new Error("Bad login!")
        }
        window.location.replace("/")
        return
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

    // changeView()
    changeView(view) {
      this.view.register = false
      this.view.index = false
      this.view.login = false
      this.view[view] = true
    },

  },

})

// let socket = io.connect("http://localhost:8001")
// socket.on("updateList", (data) => {
//   app.getLists()
// })


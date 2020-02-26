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

  // methods
  methods: {

    // getNonce()
    getNonce() {
      url = "api/user/nonce"
      fetch(url, {
        method: "GET",
        body: JSON.stringify(this.secureUser),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        return response.json()
      }).then(json => {
        this.nonce = json.nonce
      }).catch(err => {
        console.error(err)
      })
    },

    // login()
    login() {
      this.clearErrors()
      url = "api/user/login"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
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
    register() {
      this.clearErrors()
      url = "api/user/register"
      fetch(url, {
        method: "POST",
        body: JSON.stringify(this.user),
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

    // getHelpList()
    getHelpList() {
      url = "api/help"
      fetch(url).then(response => {
        return response.json()
      }).then(json => {
        this.helpUsers = json
      }).catch(err => {
        console.error(err)
      })
    },

    // getPassoffList()
    getPassoffList() {
      url = "api/passoff"
      fetch(url).then(response => {
        return response.json()
      }).then(json => {
        this.passoffUsers = json
      }).catch(err => {
        console.error(err)
      })
    },

    // getLists()
    getLists() {
      this.getHelpList()
      this.getPassoffList()
    },

    // adminRemoveHelp()
    adminRemoveHelp(username) {
      url = "api/help/admin/remove/" + username
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        return response.json()
      }).then(json => {
        this.helpUsers = json
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

    // adminRemovePassoff()
    adminRemovePassoff(username) {
      url = "api/passoff/admin/remove/" + username
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        return response.json()
      }).then(json => {
        this.passoffUsers = json
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

    // joinHelp()
    joinHelp() {
      url = "api/help/add"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        return response.json()
      }).then(json => {
        this.helpUsers.push(json)
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

    // joinPassoff()
    joinPassoff() {
      url = "api/passoff/add"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        return response.json()
      }).then(json => {
        this.passoffUsers.push(json)
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

    // removeHelp()
    removeHelp() {
      console.log("Helping!")
      url = "api/help/remove"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        console.log("returned")
        if (response.status !== 200) {
          throw new Error("Bad")
        }
        this.helpUsers = this.helpUsers.filter(item => item.username !== this.user.username)
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

    // removePassoff()
    removePassoff() {
      url = "api/passoff/remove"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (response.status !== 200) {
          throw new Error("Bad")
        }
        this.passoffUsers = this.passoffUsers.filter(item => item.username !== this.user.username)
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

  },

  // computed
  computed: {

    onHelpList: function() {
      return this.helpUsers.some(item => item.username === this.user.username)
    },

    onPassoffList: function() {
      return this.passoffUsers.some(item => item.username === this.user.username)
    },

    onList: function() {
      return this.onHelpList || this.onPassoffList
    },

  }

})

// let socket = io.connect("http://localhost:8001")
// socket.on("updateList", (data) => {
//   app.getLists()
// })


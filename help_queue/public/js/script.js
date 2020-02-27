let app = new Vue({
  el: "#app",

  // data
  data: {

    username: "notset",

    error: false,
    error_message: "",
    helpUsers: [],
    passoffUsers: [],
    realm: "IT210 Help Queue",
  },

  // methods
  methods: {

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
        if (response.status !== 200) {
          throw new Error("Bad remove")
        }
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
        if (response.status !== 200) {
          throw new Error("Bad remove")
        }
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
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

    // removeHelp()
    removeHelp() {
      url = "api/help/remove"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (response.status !== 200) {
          throw new Error("Bad")
        }
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
        // this.passoffUsers = this.passoffUsers.filter(item => item.username !== this.user.username)
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

    // checkAuthentication()
    checkAuthentication() {
      url = "api/user/check_token/" + this.token + "/" + this.username
    },

    // getUsername()
    getUsername() {
      url = "api/user/get_username"
      fetch(url).then(response => {
        return response.text()
      }).then(text => {
        this.username = text
      }).catch(err => {
        console.error(err)
      })
    },

  },

  // computed
  computed: {

    onHelpList: function() {
      return this.helpUsers.some(item => item.username === this.username)
    },

    onPassoffList: function() {
      return this.passoffUsers.some(item => item.username === this.username)
    },

    onList: function() {
      return this.onHelpList || this.onPassoffList
    },

  },

  // created
  created: function() {
    // this.checkAuthentication()
    this.getUsername()
    this.getLists()
  },

})

let socket = io.connect("http://localhost:8001")
socket.on("updateList", (data) => {
  app.getLists()
})


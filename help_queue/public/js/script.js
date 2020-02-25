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
      index: false,
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
          this.error = true
          this.error_message = "Login no. Is bad."
          throw new Error("Bad login")
        }
        return response.json()
      }).then(json => {
        this.user = json
        this.changeView("index")
        this.getPassoffList()
        this.getHelpList()
      }).catch(err => {
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
        return response.status
      }).then(status => {
        if (status === 200) {
          // GOOD
          this.changeView("index")
          this.getPassoffList()
          this.getHelpList()
          return
        }
        this.error = true
        this.error_message = "Butts. Something went wrong."
      }).catch(err => {
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
        console.log("filtering...")
        console.log(this.helpUsers)
        this.helpUsers = this.helpUsers.filter(item => item.username !== this.user.username)
        console.log("filtered!")
        console.log(this.helpUsers)
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

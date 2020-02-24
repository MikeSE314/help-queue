let app = new Vue({
  el: "#app",
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
  },
  methods: {
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
    clearErrors() {
      this.error = false
      this.error_message = ""
    },
    changeView(view) {
      this.view.register = false
      this.view.index = false
      this.view.login = false
      this.view[view] = true
    },
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
  }
})

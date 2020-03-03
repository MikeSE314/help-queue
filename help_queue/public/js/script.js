let app = new Vue({
  el: "#app",

  // data
  data: {

    netid: "notset",

    error: false,
    error_message: "",
    helpUsers: [],
    passoffUsers: [],
    set: false,
    user: {},
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
    adminRemoveHelp(netid) {
      url = "api/help/admin/remove"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({netid: netid}),
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
    adminRemovePassoff(netid) {
      url = "api/passoff/admin/remove"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({netid: netid}),
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
      console.log(this.user)
      console.log("?")
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
      url = "api/help/remove/" + this.netid
      console.log(url)
      fetch(url).then(response => {
        console.log(response)
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
      url = "api/passoff/remove/" + this.netid
      fetch(url).then(response => {
        if (response.status !== 200) {
          throw new Error("Bad")
        }
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

    async getName() {
      url = "api/user/" + this.netid
      await fetch(url).then(response => {
        return response.json()
      }).then(json => {
        this.user = {
          netid: json.netid,
          firstname: json.firstname,
          lastname: json.lastname
        }
        console.log(json)
        if (json) {
          localStorage.setItem("netid", json.netid)
          localStorage.setItem("firstname", json.firstname)
          localStorage.setItem("lastname", json.lastname)
        }
      }).catch(err => {
        console.error(err)
      })
    },

    async setup() {
      await this.getName()
      this.getStorage()
      // get first and last names
      // store them in local storage
      // check that it's set up
    },

    check() {

    },

    getStorage() {
      this.netid = localStorage.getItem("netid")
      firstname = localStorage.getItem("firstname")
      lastname = localStorage.getItem("lastname")
      this.user = {
        netid: this.netid,
        firstname: firstname,
        lastname: lastname
      }
      console.log(this.set)
      this.set = false
      if (firstname) {
        this.set = true
      }
      console.log(firstname)
      console.log(this.set)
    },


  },

  // computed
  computed: {

    onHelpList: function() {
      return this.helpUsers.some(item => item.netid === this.netid)
    },

    onPassoffList: function() {
      return this.passoffUsers.some(item => item.netid === this.netid)
    },

    onList: function() {
      return this.onHelpList || this.onPassoffList
    },

  },

  // created
  created: function() {
    // this.checkAuthentication()
    this.getLists()
    this.getStorage()
  },

})

let socket = io.connect("http://localhost:8001")
socket.on("updateList", (data) => {
  app.getLists()
})


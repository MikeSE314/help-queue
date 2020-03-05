let app = new Vue({
  el: "#app",

  // data
  data: {

    netid: "notset",

    error_message: "",
    helpUsers: [],
    passoffUsers: [],
    set: false,
    user: {},
    admin: false,
    audio: new Audio('audio/chime.mp3'),
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
      this.helpUsers.map(item => {
        if (item.netid === netid) {
          console.info(`Removing %c${item.firstname} ${item.lastname} %cfrom Help List`, 'font-weight: bold; color: white;', 'font-weight: normal')
        }
      })
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
      this.passoffUsers.map(item => {
        if (item.netid === netid) {
          console.info(`Removing %c${item.firstname} ${item.lastname} %cfrom Passoff List`, 'font-weight: bold; color: white;', 'font-weight: normal')
        }
      })
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
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        socket.emit("updateList")
        socket.emit("playSound")
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
        socket.emit("playSound")
      }).catch(err => {
        console.error(err)
      })
    },

    // removeHelp()
    removeHelp() {
      url = "api/help/remove/" + this.netid
      fetch(url).then(response => {
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
        if (response.status !== 200) {
          throw new Error(`Couldn't find netid ${this.netid}`)
        }
        return response.json()
      }).then(json => {
        this.user = {
          netid: json.netid,
          firstname: json.firstname,
          lastname: json.lastname
        }
        if (json) {
          localStorage.setItem("netid", json.netid)
          localStorage.setItem("firstname", json.firstname)
          localStorage.setItem("lastname", json.lastname)
        }
      }).catch(err => {
        this.error_message = err.message
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
      this.set = false
      if (firstname) {
        this.set = true
      }
    },

    play() {
      if (this.admin) {
        this.audio.play()
      }
    },

    getAdmin() {
      url = "api/admin/test"
      fetch(url).then(response => {
        if (response.status === 200) {
          this.admin = true
        }
      }).catch(err => {
        console.error(err)
      })
    }


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
    this.getAdmin()
  },

})

let socket = io.connect("/")
socket.on("updateList", (data) => {
  app.getLists()
})

socket.on("playSound", (data) => {
  app.play()
})


let app = new Vue({
  el: "#app",

  // data
  data: {

    error_message: "",
    helpUsers: [],
    passoffUsers: [],
    set: false,
    user: {
      zoom: "",
      name: "",
    },
    ta: {
      name: "The TA",
      zoom: "example.com",
    },
    admin: false,
    audio: new Audio('audio/chime.mp3'),
    modal: undefined,
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
    adminRemoveHelp(name) {
      this.helpUsers.map(item => {
        if (item.name === name) {
          console.info(`Removing %c${item.name} %cfrom Help List %c\n${item.zoom}`, 'font-weight: bold; color: white;', '', 'font-weight: bold; color: white;')
        }
      })
      url = "api/help/remove"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({name: name}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (response.status !== 200) {
          throw new Error("Bad remove")
        }
        socket.emit("updateList")
        socket.emit("removed", {
          name: name,
          ta: this.user,
        })
      }).catch(err => {
        console.error(err)
      })
    },

    // adminRemovePassoff()
    adminRemovePassoff(name) {
      this.passoffUsers.map(item => {
        if (item.name === name) {
          console.info(`Removing %c${item.name} %cfrom Passoff List %c\n${item.zoom}`, 'font-weight: bold;', '', 'font-weight: bold;')
        }
      })
      url = "api/passoff/remove"
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({name: name}),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        if (response.status !== 200) {
          throw new Error("Bad remove")
        }
        socket.emit("updateList")
        socket.emit("removed", {
          name: name,
          ta: this.user,
        })
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
        socket.emit("updateList")
      }).catch(err => {
        console.error(err)
      })
    },

    getStorage() {
      name = localStorage.getItem("name") || ""
      zoom = localStorage.getItem("zoom") || ""
      this.user = {
        name: name,
        zoom: zoom,
      }
      this.set = false
      if (name && zoom) {
        this.set = true
      }
    },

    playAdd() {
      if (this.admin) {
        this.audio.play()
      }
    },

    playRemove(data) {
      name = data.name
      this.ta = data.ta
      if (this.user.name === name) {
        this.audio.play()
        this.modal.open()
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
    },

    setStorage() {
      localStorage.setItem("name", this.user.name)
      localStorage.setItem("zoom", this.user.zoom)
    },

    setup() {
      this.setStorage()
      this.getStorage()
      // get first and last names
      // store them in local storage
      // check that it's set up
    },

  },

  // computed
  computed: {

    onHelpList: function() {
      return this.helpUsers.some(item => item.name === this.user.name)
    },

    onPassoffList: function() {
      return this.passoffUsers.some(item => item.name === this.user.name)
    },

    onList: function() {
      return this.onHelpList || this.onPassoffList
    },

  },

  // created
  created: function() {
    this.getStorage()
    this.getLists()
    this.getAdmin()
    // this.modal.open()
  },

})

let socket = io.connect("/")
socket.on("updateList", (data) => {
  app.getLists()
})

socket.on("playSound", (data) => {
  app.playAdd()
})

socket.on("removed", (data) => {
  app.playRemove(data)
})

document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('.modal')
  let options = {}
  let instances = M.Modal.init(elems, options)
  //
  let elem = document.querySelector("#modal")
  app.modal = M.Modal.getInstance(elem)
})

function leave() {
  localStorage.clear()
  window.location.href = "/logout"
}

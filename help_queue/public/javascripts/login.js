let app = new Vue({
  el: "#app",
  data: {
    user: {
      username: "",
      firstname: "",
      lastname: "",
      password: "",
      c_password: "",
    },
    view: {
      login: true,
      index: false,
      register: false,
    }
  },
  methods: {
    login() {
      console.log("stuff")
      url = "api/user/login",
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(this.user),
        headers: {"Content-Type": "application/json"}
      }).then(response => {
        console.log(response)
        return response.json()
      }).then(json => {
        this.view.login = false
        this.view.index = true
      }).catch(err => {
        console.error(err)
      })
    }
  }
})

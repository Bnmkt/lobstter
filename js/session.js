class Session {
    constructor(id, name, token) {
        this.name = name
        this.id = id
        this.token = token
        this.expire = null
        if (this.isSet()) {
            this.getAll();
        } else {
            Session.create(this.id, this.name, this.token)
        }
    }

    isSet() {
        if (window.localStorage.getItem("session")) {
            return true
        } else {
            return false
        }
    }

    getProp(prop) {
        return this[prop]
    }

    setProp(prop, value) {
        if (this.hasOwnProperty(prop)) {
            this[prop] = value
        }
    }

    static now() {
        return Date.now()
    }

    static destory() {
        window.localStorage.setItem("session", null)
    }

    static create(id, name, token) {
        if (!id || !name || !token) return
        this.expire = Session.now() + (60 * 60 * 24)
        const obj = {id, name, token, expire: this.expire}
        window.localStorage.setItem("session", JSON.stringify(obj))
    }

    getAll() {
        const ls = window.localStorage.getItem("session")
        const obj = JSON.parse(ls)
        for (let prop in obj) {
            this.setProp(prop, obj[prop])
        }
        ;
    }

}
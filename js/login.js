window.onload = function() {
    if (sessionStorage.getItem('login') != null) {
        window.location = "index.html";
    } else {
        var mySingleton = (function() {

            // Instance stores a reference to the Singleton
            var instance;

            function init() {
                //Implementing user class for login functionality.
                //I am using only username and password as fields
                //This class is hidden from outside
                class User {
                    constructor(email, password) {
                        this.email = email;
                        this.password = password;
                    }
                    login() {
                        var map = new Map(JSON.parse(localStorage.getItem('userstorage')));
                        var user = map.get(this.email);
                        if (user.password == this.password) {
                            sessionStorage.setItem('login', this.email);
                            return true;
                        }

                        return false;
                    }
                    createUser(username) {
                        var createUser = {
                            'username': username,
                            'password': this.password
                        };
                        var userdata = [];
                        userdata.push(createUser);
                        var map = new Map(JSON.parse(localStorage.getItem('userstorage')));
                        if (!map.has(this.email)) {
                            map.set(this.email, createUser);
                            localStorage.setItem('userstorage', JSON.stringify(Array.from(map.entries())));
                            return true;
                        }
                        return false;
                    }

                }

                return {
                    // Public methods and variables
                    login: function(credentials) {
                        var user = new User(credentials.email.value, credentials.password.value);
                        if (user.login()) {
                            window.location = "index.html";
                        } else {
                            document.getElementById("login-error").innerHTML = "!! Invalid credentials";
                        }
                    },

                    createUser: function(credentials) {
                        var user = new User(credentials.email.value, credentials.password.value);
                        if (user.createUser(credentials.username.value)) {
                            window.location = "login.html";
                        } else {
                            document.getElementById("user-error").innerHTML = "User already exists";
                        }
                    }
                };
            }

            return {
                // Get the Singleton instance if one exists
                // or create one if it doesn't
                getInstance: function() {
                    if (!instance) {
                        instance = init();
                    }
                    return instance;
                }
            };
        })();

        var singleA = mySingleton.getInstance();

        var form = document.getElementById('login-form');
        form.onsubmit = function(e) {
            e.preventDefault();
            singleA.login(form)
        }

        var rForm = document.getElementById('register-form');
        rForm.onsubmit = function(e) {
            e.preventDefault();
            singleA.createUser(rForm);
        }

        document.getElementById("create").addEventListener("click", function() {
            document.getElementById("login-form").style.display = "none";
            document.getElementById("register-form").removeAttribute("style");
        });

        document.getElementById("sign-in").addEventListener("click", function() {
            document.getElementById("register-form").style.display = "none";
            document.getElementById("login-form").removeAttribute("style");
        });
    }
};
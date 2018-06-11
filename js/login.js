/*
Initially user login will be stored in sessionstorage 
which means if the browser is closed logins will be deleted permanently
Once the user signout he will be navigated back to login page
login functionality is implemented using singleton pattern.
*/
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
                    //Login function will check if a user exists or not if
                    //user doesn't exists it will display error stating user doesn't exists
                    //if password is wrong it will show invalid credentials error.
                    login() {
                        var map = new Map(JSON.parse(localStorage.getItem('userstorage')));
                        var user = map.get(this.email);
                        if (user == undefined) {
                            return "Invalid";
                        } else if (user.password == this.password) {
                            sessionStorage.setItem('login', this.email);
                            return true;
                        }

                        return false;
                    }
                    //createuser function will create the user if user already exists, user will
                    //not be created.
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
                    //This function is used for login purpose
                    //Original operaions is performed in user object.
                    login: function(credentials) {
                        var user = new User(credentials.email.value, credentials.password.value);
                        var login = user.login();
                        if (login == true) {
                            window.location = "index.html";
                        } else if (login == "Invalid") {
                            document.getElementById("login-error").innerHTML = "User doesn't exists";
                        } else {
                            document.getElementById("login-error").innerHTML = "!! Invalid credentials";
                        }
                    },
                    //This function is used to create the user.
                    //Data is passed to user object where operations are performed
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

        var singleton = mySingleton.getInstance();

        var form = document.getElementById('login-form');
        form.onsubmit = function(e) {
            e.preventDefault();
            singleton.login(form)
        }

        var rForm = document.getElementById('register-form');
        rForm.onsubmit = function(e) {
            e.preventDefault();
            singleton.createUser(rForm);
        }
        //The codes below is used to diplay create panel and login panel
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
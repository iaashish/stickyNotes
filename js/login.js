var mySingleton = (function() {

    // Instance stores a reference to the Singleton
    var instance;
    function init() {
    	//Implementing user class for login functionality.
    	// I am using only username and password as fields
    	//This class is hidden from outside
	    class User{
	    	constructor(username,password){
	    		this.username = username;
        		this.password = password;	
	    	}
	    	login(){
	    		
        		var username = userdata.some(item => item.username === this.username);
        		var password = userdata.some(item => item.password === this.password);
            	return true;
        
	    	}
	    	createUser(email){
	         	var createUser = new User(this.username, this.password);
 				var userdata = [];
         		userdata.push(createUser);
         		var map = new Map();
         		map.set(email, createUser);
         		localStorage.setItem('myStorage', JSON.stringify(userdata));
	    	}
        	
		}
       return {
            // Public methods and variables
            login: function(credentials) {
            	var user = new User(credentials.username.value,credentials.password.value);
                if (user.login()) {
                    window.location = "index.html";
                } else {
                    return false;
                }
            },

            createUser: function(credentials) {
            	var user = new User(credentials.username.value,credentials.password.value);
            	user.createUser(credentials.username);
            }
        };

    };

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
form.onsubmit = function(e){
	e.preventDefault();
	singleA.login(form)
}

var rForm = document.getElementById('register-form');
rForm.onsubmit = function(e){
	e.preventDefault();
	singleA.createUser(rForm);
}

document.getElementById("create").addEventListener("click", function(){
	document.getElementById("login-form").style.display = "none";
	document.getElementById("register-form").removeAttribute("style");
});

document.getElementById("sign-in").addEventListener("click", function(){
	document.getElementById("register-form").style.display = "none";
	document.getElementById("login-form").removeAttribute("style");
});

(function() {
    var loggedInUser = sessionStorage.getItem('login');
    //Note Object
    function Note(title, content) {
        this.title = title;
        this.content = content;
    }
    //factory pattern
    function createNote() {
        var html = "<div class=\"modal-container\">\n" +
            "    <section class=\"create-modal\">\n" +
            "        <div class=\"form-group title\">\n" +
            "            <label class=\"sr-only\">Title</label>\n" +
            "            <input type=\"text\" id=\"title\" placeholder=\"Title...\" class=\"form-control\">\n" +
            "        </div>\n" +
            "        <div class=\"form-group\">\n" +
            "            <label class=\"sr-only\">Content</label>\n" +
            "            <textarea type=\"text\" id=\"content\" placeholder=\"Content...\" class=\"form-control\"></textarea>\n" +
            "        </div>\n" +
            "        <div class=\"form-group action-btn\">\n" +
            "            <button class=\"btn btn-primary \" id='cancel-button'>Cancel</button>\n" +
            "            <button class=\"btn btn-primary\" id='save-button'>Save</button>\n" +
            "        </div>\n" +
            "    </section>\n" +
            "</div>";

        document.getElementById('modal-container').innerHTML = html;

        document.getElementById('cancel-button').addEventListener('click', function() {
            document.getElementById('modal-container').innerHTML = "";
        });
        document.getElementById('save-button').addEventListener('click', function() {
            var text = document.getElementById('title').value;
            var content = document.getElementById('content').value;
            var note = new Note(text, content);
            var time = new Date().getTime();
            if (localStorage.getItem(loggedInUser) !== null) {
                var map = new Map(JSON.parse(localStorage.getItem(loggedInUser)));
                map.set(time, note);
            } else {
                var map = new Map();
                map.set(time, note)
            }

            localStorage.setItem(loggedInUser, JSON.stringify(Array.from(map.entries())));
            document.getElementById('modal-container').innerHTML = "";
            var deletedata = document.getElementById('list');
            while (deletedata.firstElementChild) {
                deletedata.firstElementChild.remove();
            }
            displayNotes();
        });
    }

    function updateNote(data) {
        var key = parseInt(data.evt.currentTarget.parentElement.getAttribute("id"))
        var map = new Map(JSON.parse(localStorage.getItem(loggedInUser)));

        var data = map.get(key)
        var html = "<div class=\"modal-container\">\n" +
            "    <section class=\"create-modal\">\n" +
            "        <div class=\"form-group title\">\n" +
            "            <label class=\"sr-only\">Title</label>\n" +
            "            <input type=\"text\" id=\"title1\" placeholder=\"Title...\" class=\"form-control\">\n" +
            "        </div>\n" +
            "        <div class=\"form-group\">\n" +
            "            <label class=\"sr-only\">Content</label>\n" +
            "            <textarea type=\"text\" id=\"content\" placeholder=\"Content...\" class=\"form-control\">" + data.content + "</textarea>\n" +
            "        </div>\n" +
            "        <div class=\"form-group action-btn\">\n" +
            "            <button class=\"btn btn-primary \" id='cancel-button'>Cancel</button>\n" +
            "            <button class=\"btn btn-primary\" id='save-button'>Save</button>\n" +
            "        </div>\n" +
            "    </section>\n" +
            "</div>";

        document.getElementById('modal-container').innerHTML = html;
        document.getElementById('title1').value = data.title;
        document.getElementById('cancel-button').addEventListener('click', function() {
            document.getElementById('modal-container').innerHTML = "";
        });
        document.getElementById('save-button').addEventListener('click', function() {
            var text = document.getElementById('title1').value;
            var content = document.getElementById('content').value;
            var note = new Note(text, content);
            var map = new Map(JSON.parse(localStorage.getItem(loggedInUser)));
            map.set(key, note);
            localStorage.setItem(loggedInUser, JSON.stringify(Array.from(map.entries())));
            document.getElementById('modal-container').innerHTML = "";
            var id = document.getElementById(key.toString()).children;
            id[0].textContent = text;
            id[1].textContent = content;
        });
    }

    function deleteNote(data) {
        var key = parseInt(data.evt.currentTarget.parentElement.getAttribute("id"))
        var map = new Map(JSON.parse(localStorage.getItem(loggedInUser)));
        map.delete(key);
        localStorage.setItem(loggedInUser, JSON.stringify(Array.from(map.entries())));
        var elem = document.getElementById(key.toString());
        elem.parentNode.removeChild(elem);
    }

    function NoteFactory() {};

    NoteFactory.prototype.operation = function(data) {
        var noteClass = null;
        if (data.type == "create") {
            noteClass = createNote;
        } else if (data.type == "update") {
            noteClass = updateNote;
        } else {
            noteClass = deleteNote;
        }
        return new noteClass(data);
    }

    var myNotefact = new NoteFactory();

    //Adding event listener for add-note link.
    document.getElementById('add-note').addEventListener('click', function() {
        var createNote = myNotefact.operation({
            type: "create",
        });
    })


    function displayNotes() {
        //get the map from localstorage
        var map = new Map(JSON.parse(localStorage.getItem(loggedInUser)));
        for (var entry of map.entries()) {
            //create li, h2 and p nodes
            var node = document.createElement("LI");
            node.setAttribute("id", entry[0]);
            node.setAttribute("action", entry[1].title);
            var h2node = document.createElement("h2");
            var pnode = document.createElement("p");
            //Create a text node and add data
            var hdata = document.createTextNode(entry[1].title);
            var pdata = document.createTextNode(entry[1].content);
            //append the text node to respective tags(h2 and p)
            h2node.appendChild(hdata);
            pnode.appendChild(pdata);
            node.appendChild(h2node);
            node.appendChild(pnode);
            document.getElementById("list").appendChild(node);
        }
        contextMenu();

    }

    //This will update the order of list when we re-order using drag and drop api
    function updateOrder() {
        var ul = document.getElementById("list").children;
        var map = new Map();
        for (var li of ul) {
            var note = new Note(li.children[0].innerText, li.children[1].innerText);
            var id = parseInt(li.id);
            map.set(id, note);
        }
        localStorage.removeItem(loggedInUser);
        localStorage.setItem(loggedInUser, JSON.stringify(Array.from(map.entries())));
    }

    //this is context menu on right click we can see update and delete options
    function contextMenu() {
        //make sure the right click menu is hidden
        menu = document.querySelector('.menu');
        menu.classList.add('off');
        //add the right click listener to the box
        // let box = document.querySelectorAll("#box1");
        var box = document.getElementById("list").children;

        for (var b of box) {
            b.addEventListener('contextmenu', showmenu);
        }
        //add a listener for leaving the menu and hiding it
        menu.addEventListener('mouseleave', hidemenu);
        //add the listeners for the menu items
        addMenuListeners();
    }

    function addMenuListeners() {
        document.getElementById('Edit').addEventListener('click', function(evt) {
            var createNote = myNotefact.operation({
                type: "update",
                evt: evt
            });
        });
        document.getElementById('Delete').addEventListener('click', function(evt) {
            var createNote = myNotefact.operation({
                type: "delete",
                evt: evt
            });
        });
    }

    function showmenu(ev) {
        //stop the real right click menu
        ev.preventDefault();
        //show the custom menu
        //get the id of the clicked item
        var id = ev.currentTarget.getAttribute("id")
        console.log(ev.clientX, ev.clientY);
        menu.style.top = (ev.clientY - 20) + "px";
        menu.style.left = (ev.clientX - 20) + "px";
        menu.setAttribute("id", id);
        menu.classList.remove('off');
    }

    function hidemenu(ev) {
        menu.classList.add('off');
        menu.style.top = '-200%';
        menu.style.left = '-200%';
    }

    //this is drag and drop functionality it adds drag and drop events to the notes
    function sortable(rootEl, onUpdate) {
        var dragEl, nextEl;

        [].slice.call(rootEl.children).forEach(function(itemEl) {
            itemEl.draggable = true;
        });


        function _onDragOver(evt) {
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'move';

            var target = evt.target;
            if (target && target !== dragEl && target.nodeName == 'LI') {
                var rect = target.getBoundingClientRect();
                var next = (evt.clientY - rect.top) / (rect.bottom - rect.top) > .5;
                console.log(next);
                rootEl.insertBefore(dragEl, next && target.nextSibling || target);

            }
        }

        function _onDragEnd(evt) {
            evt.preventDefault();

            dragEl.classList.remove('ghost');
            rootEl.removeEventListener('dragover', _onDragOver, false);
            rootEl.removeEventListener('dragend', _onDragEnd, false);

            if (nextEl !== dragEl.nextSibling) {
                updateOrder();
                onUpdate(dragEl);
            }
        }

        rootEl.addEventListener('dragstart', function(evt) {
            dragEl = evt.target;
            nextEl = dragEl.nextSibling;

            evt.dataTransfer.effectAllowed = 'move';

            rootEl.addEventListener('dragover', _onDragOver, false);
            rootEl.addEventListener('dragend', _onDragEnd, false);

            setTimeout(function() {
                dragEl.classList.add('ghost');
                contextMenu();
            }, 0)
        }, false);
    }
    displayNotes();
    sortable(document.getElementById('list'), function(item) {
        console.log(item);
    });
})();
window.onload = function() {
  if(sessionStorage.getItem('login') == null){
    window.location = "login.html";
  }
};
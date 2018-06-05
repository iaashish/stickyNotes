(function (){
    function onCreateNoteClick(){
        var html = "<div class=\"modal-container\">\n" +
            "    <section class=\"create-modal\">\n" +
            "        <div class=\"form-group title\">\n" +
            "            <label class=\"sr-only\">Title</label>\n" +
            "            <input type=\"text\" placeholder=\"Title...\" class=\"form-control\">\n" +
            "        </div>\n" +
            "        <div class=\"form-group\">\n" +
            "            <label class=\"sr-only\">Content</label>\n" +
            "            <textarea type=\"text\" placeholder=\"Content...\" class=\"form-control\"></textarea>\n" +
            "        </div>\n" +
            "        <div class=\"form-group action-btn\">\n" +
            "            <button class=\"btn btn-primary \" id='cancel-button'>Cancel</button>\n" +
            "            <button class=\"btn btn-primary\" id='save-button'>Save</button>\n" +
            "        </div>\n" +
            "    </section>\n" +
            "</div>";

        document.getElementById('modal-container').innerHTML = html;

        document.getElementById('cancel-button').addEventListener('click',function(){
            document.getElementById('modal-container').innerHTML = "";
        });
        document.getElementById('save-button').addEventListener('click',function(){
            document.getElementById('modal-container').innerHTML = "";
        });

    }

    function main(){
        document.getElementById('add-note').addEventListener('click',onCreateNoteClick);
    }


    main();

})();
$(document).ready(function () {
    contactsNamespace.initialize();
    var img;
    img = "";

    jQuery.event.props.push('dataTransfer');
    $('#target').on('dragenter', preventDefault);
    $('#target').on('dragover', preventDefault);
    $('#target').on('drop', dropItem);
    function preventDefault(e) {
        e.preventDefault();
    }
    function dropItem(e) {
        e.preventDefault();
        var files = e.dataTransfer.files
        a = "";
        i = 0;

        for (i = 0; i < files.length; i++) {

            (function (file) {
                var name = file.name;
                var reader = new FileReader();
                reader.onload = function (e1) {
                    // get file content
                    var text = e1.target.result;
                    img += `<img  width="100px" height="100px" src="${text}"/>`
                    $("#imgshow").append(`<img width="100px" height="100px" src="${text}"/>`);
                }
                reader.readAsDataURL(file, "UTF-8");
            })(files[i]);
        }

        preventDefault(e);
    }
    $(".classhere").change(function () {
        var fileInput = $(".classhere")[0];
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            text = reader.result;
            $("#imgshow").append(`<img  width="100px" height="100px" src="${text}"/>`);
        }
        reader.readAsDataURL(file);
    });
});
(function () {
    this.contactsNamespace = this.contactsNamespace || {};
    var ns = this.contactsNamespace;
    var gid;
    var records;
    var db = openDatabase('MyContacts', '2.0', 'MyContacts', 5 * 1024 * 1024);
    db.changeVersion('2.0', '2.0', migrateDB, onError, onSuccess);
    function migrateDB(transaction) {
        transaction.executeSql("CREATE TABLE IF NOT EXISTS contact2(" +
            "id INTEGER PRIMARY KEY, " +
            "firstName TEXT, " +
            "lastName TEXT, " +
            "email TEXT, " +
            "phoneNumber TEXT, " +
            "logo TEXT " +
            ")");
    }
    function onError(error) {
        alert("Error code: " + error.code + " Message: " + error.message);
    }
    function abc() {
        $("#id").val("");
        $("#firstName").val("");
        $("#lastName").val("");
        $("#email").val("");
        $("#phoneNumber").val("");

        $("#imgshow").html("");
    }
    function onSuccess() {
        
       
    }
    function onSuccessInsert() {

        abc();
    }
    function onSuccessUpdate() {

        abc();
    }
    var currentRecord;
    ns.initialize = function () {
        $('#btnSave').on('click', ns.save);
        ns.display();
    };
    function migrateDB1(transaction) {
        console.log("INSERT INTO contact2 VALUES(" + $("#id").val() + ",'" + $("#firstName").val() + "', '" + $("#lastName").val() + "','" + $("#email").val() + "','" + $("#phoneNumber").val() + "','" + $("#imgshow").html() + "')");
        transaction.executeSql("INSERT INTO contact2 VALUES(" + $("#id").val() + ",'" + $("#firstName").val() + "', '" + $("#lastName").val() + "','" + $("#email").val() + "','" + $("#phoneNumber").val() + "','" + $("#imgshow").html() + "')");
       
    };
    ns.save = function () {
        db.changeVersion('2.0', '2.0', migrateDB1, onInsertError, onSuccessInsert);
        ns.display();
       
        alert("saved");

    };
    function onInsertError(error) {
        if (error.code == 6) {
            db.changeVersion('2.0', '2.0', migrateDB4, onError, onSuccessUpdate);
            ns.display();
        }
        else
            alert("Error code: " + error.code + " Message: " + error.message);
    }
    ns.deleteContact = function () {
        gid = parseInt($(this).attr('data-key'));
        db.changeVersion('2.0', '2.0', migrateDB5, onError, onSuccess);
        ns.display();
    }
    function migrateDB2(transaction) {
        transaction.executeSql("SELECT * FROM contact2", [], bindToGrid)
    }
    function migrateDB3(transaction, id) {
        transaction.executeSql("SELECT * FROM contact2 where id=?", [gid], showinTexts)
    }
    function migrateDB4(transaction) {
        transaction.executeSql("update contact2 set firstname='" + $("#firstName").val() + "',lastname= '" + $("#lastName").val() + "',email='" + $("#email").val() + "',phonenumber='" + $("#phoneNumber").val() + "',logo='" + $("#imgshow").html() + "' where id=" + $("#id").val());
       
    }
    function migrateDB5(transaction) {
        alert("delete from contact2  where id=" + gid);
        transaction.executeSql("delete from contact2  where id=" + gid);
    }
    function showinTexts(transaction, results) {
        var contact = results.rows.item(0);
        $('#id').val(contact.id);
        $('#firstName').val(contact.firstName);
        $('#lastName').val(contact.lastName);
        $('#email').val(contact.email);
        $('#phoneNumber').val(contact.phoneNumber);
        $('#imgshow').html(contact.logo);
    };
    ns.display = function () {
        db.changeVersion('2.0', '2.0', migrateDB2, onError, onSuccess);
    };
    function bindToGrid(transaction, results) {
        var html = '';
        for (var i = 0; i < results.rows.length; i++) {
            var contact = results.rows.item(i);
            html += '<tr><td>' + contact.email + '</td>';
            html += '<td>' + contact.firstName + ' ' + contact.lastName + '</td>';
            html += '<td>' + contact.logo + '</td>';
            html += '<td><a class="edit" href="#" data-key='
                + contact.id + '>Edit</a> | <a class="delete" href="#" data-key='
                + contact.id + '>Delete</a></td></tr>';
        }
        html = html || '<tr><td colspan="3">No records available</td></tr>';
        $('#contacts tbody').html(html);
        $('#contacts a.edit').on('click', ns.loadContact);
        $('#contacts a.delete').on('click', ns.deleteContact);
    };
    ns.loadContact = function () {
        gid = parseInt($(this).attr('data-key'));
        db.changeVersion('2.0', '2.0', migrateDB3, onError, onSuccess2);

    };
    function onSuccess2() {

    }
})();

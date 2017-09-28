function update_table_row_numbers(table,active_row_count) {
    for (var i = 1; i <= active_row_count; i++) {
        table.rows[i].cells.namedItem('numTd').innerHTML = i;
    }
}

function put_ref_rows_in_array_obj() {
    
}

function check_if_ref_in_table_ref(ref_id,ref_buy_time) {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    var len = tableRef.rows.length;
    var flag = false;

    for (var j = 0; j<len; j++) {
        var row = tableRef.rows[j];
        if($(row).data("id")) {
            var row_id = $(row).data("id");
            var order = row.cells.namedItem('buyTimeTd').innerText;
            if(row_id == ref_id && order == ref_buy_time){
                flag = true;
                break;
            }
        }else{
            break;
        }
    }

    return flag;
}

function put_clone_tr_in_table_ref(clone_tr,id){
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    var len = tableRef.rows.length;
    var active_len = 0;
    for (var j = 0; j < len; j++) { //add row to ref table in first gray(deactive) row
        var row = tableRef.rows[j];//alert(j);
        if (!$(row).data("id")) {
            clone_tr.cells.namedItem('numTd').innerHTML = j + 1; // update number of column
            row.innerHTML = clone_tr.innerHTML;
            row.setAttribute("data-id", id);
            row.classList.remove('empty-row');
            break;
        }
        active_len++;
    }

    // if (active_len >= 5) {// go to next page
    //     //save ref_table_info..............
    //     var table_ref_cur_page = tableRef.innerHTML; //alert(table_ref_cur_page);
    //     //make ref table next_page.........
    //     empty_ref_table();
    //     var row2 = tableRef.rows[0];
    //     clone_tr.cells.namedItem('numTd').innerHTML = 1; // update number of column
    //     row2.innerHTML = clone_tr.innerHTML;
    //     row2.setAttribute("data-id", id);
    //     row2.classList.remove('empty-row');
    //     //paginagion.......................
    //     document.getElementById('pagination_ref').innerHTML = create_ref_pagination(2, 2);
    //     alert('not space ' + active_len);
    // }

    alert('شخص انتخاب شده به جدول معرفی ها اضافه شد!');
}

function add_reffered(source) {
    var user_tr = source.parentNode.parentNode.parentNode;
    var id = user_tr.getAttribute('data-id');//alert('id='+id);
    var clone_tr = user_tr.cloneNode(true);
    var BuyingTime = user_tr.cells.namedItem('select_td').getElementsByTagName('select')[0].value;//alert(BuyingTime);

    $.ajax({
        type: "POST",
        url: "searchRef.php",
        // dataType : 'JSON',
        data: {
            id: id,
            buy_time: BuyingTime
        },
        success: function(count){//alert(count_arr);alert(count_arr.length);
            if(count == 0){
                var flag = check_if_ref_in_table_ref(id,BuyingTime);
                if(flag){
                    alert('شما قبلا این کاربر را برای این خریدش انتخاب کرده اید!');
                }else {
                    var td = clone_tr.insertCell(7);
                    td.innerHTML = '<div>' + BuyingTime + '</div>';
                    td.id = 'buyTimeTd';

                    clone_tr.cells.namedItem('chbxtd').innerHTML = '<div onclick="delete_record(this)">حذف</div>';//add delete column to refferd table
                    clone_tr.cells.namedItem('chbxtd').className = "deleteTd"; // add class name to delete column

                    clone_tr.removeChild(clone_tr.cells.namedItem('editTd')); // remove edit column
                    clone_tr.removeChild(clone_tr.cells.namedItem('delTd')); // remove soft delete column
                    clone_tr.removeChild(clone_tr.cells.namedItem('select_td')); // remove buy time column

                    put_clone_tr_in_table_ref(clone_tr,id);
                }
            }else{
                source.parentNode.parentNode.parentNode.style.backgroundColor = 'gray';
                alert('این کاربر به ازای این خرید قبلا معرفی شده است');
            }
        }
    });
}

function create_ref_pagination(count,active) {
    var prev = active-1;
    var pagination = '';
    pagination += "<div class='";
    if(active != 1) pagination += "cell";
    else pagination += "cell_disabled";
    pagination +="' data-val='1'  onclick='paging_ref(this)'><span>اول</span></div>";
    pagination += "<div class='";
    if(active != 1) pagination += "cell";
    else pagination += "cell_disabled";
    pagination +="' data-val='"+prev+"'  onclick='paging_ref(this)'><span>قبل</span></div>";
    pagination += "<div class='";
    if(active != 1) pagination += "cell";
    else pagination += "cell_active";
    pagination +="' data-val='1'  onclick='paging_ref(this)'><span>1</span></div>";

    for (var i=2; i<=count; i++) {
        pagination += "<div class='";
        if (i == active) pagination += "cell_active";
        else pagination += "cell";
        pagination += "' data-val='"+i+"'  onclick='paging_ref(this)'><span>"+i+"</span></div>";
    }

    var next = active+1;
    pagination += "<div class='";
    if(count > 1 && active < count) pagination += "cell";
    else pagination += "cell_disabled";
    pagination +="' data-val='"+next+"'  onclick='paging_ref(this)'><span>بعد</span></div>";
    pagination += "<div class='";
    if(count > 1 && active < count) pagination += "cell";
    else pagination += "cell_disabled";
    pagination +="' data-val='"+count+"'  onclick='paging_ref(this)'><span>آخر</span></div>";

    return pagination;
}

function paging_ref(source) {
    alert(source.value);
}


function delete_record(source) {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    var row = source.parentNode.parentNode;
    tableRef.removeChild(row);
    //update number of rows
    for (var i = 0; i < tableRef.rows.length; i++) {
        tableRef.rows[i].cells.namedItem('numTd').innerHTML = i+1;
    }
}

function soft_delete(id) {
    var txt;
    var r = confirm("آیا مطمئنید میخواهید فرد با شناسه "+id+" را حذف کنید!");
    if (r == true) {
        $.ajax({
            type: "POST",
            url: "delete.php",
            data: {
                id: id
            },
            success: function(data) {
                show_list('','','',1,'created_at DESC','111');
                txt = "حذف با موفقیت انجام شد!";
            }
        });
    } else {
        txt = "عملیات حذف لغو شد!";
    }
    alert(txt);

}
function active_delete(source,id) {
    if(source.checked){
        var link = $(source).parent().parent().find(".deactiveDel");
        link.removeClass('deactiveDel');
        link.addClass('deleteTd');
        $( link ).click(function() {
            soft_delete(id);
        });
    }else {
        var link = $(source).parent().parent().find(".deleteTd");
        link.removeClass('deleteTd');
        link.addClass('deactiveDel');
        $(link).off("click");
    }
}
// these are for ajax form submit..................
function get_referred() {
    var refs = '';
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    var len = tableRef.rows.length;
    for (var i = 0; i<len; i++) {
        var row = tableRef.rows[i];
        if($(row).data("id")) {
            var order = row.cells.namedItem('buyTimeTd').innerText;
            // var order = row.cells.namedItem('selectTd').firstChild.firstChild.innerHTML;
            // alert(order);
            var id = row.getAttribute('data-id');
            refs += ',{' + id + '-' + order + '}';
        }
    }
    refs = refs.substring(1, refs.length );
    return refs;
}

function generate_password() {
    var token = "";
    var codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    codeAlphabet+= "abcdefghijklmnopqrstuvwxyz";
    codeAlphabet+= "0123456789";
    var max = codeAlphabet.length; // edited

    for (var i=0; i < 6; i++) {
        token += codeAlphabet[Math.floor((Math.random() * (max-1)))];
    }

    return token;
}

// this is for edit.......................
function showInForm(source){
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    // document.getElementsByClassName('buyselection')[0].style.display = 'flex';
    document.getElementsByClassName('buying')[0].style.display = 'flex';
    // document.getElementsByClassName('buyselection')[0].style.justifyContent = 'space-around';
    document.getElementById('save').style.display = 'none';
    document.getElementsByClassName('btn-secondary')[0].style.display = 'block';
    document.getElementsByClassName('pull-me')[0].innerHTML = 'ویرایش';
    //load input forms...........................................................
    var tr = source.parentNode;
    remove_gray_bg_from_user_list();
    $(tr).addClass('gray_row');
    document.getElementById('last_name').value  = tr.cells.namedItem('lastNameTd').innerText;
    document.getElementById('name').value  = tr.cells.namedItem('nameTd').innerText;
    document.getElementById('mobile').value  = tr.cells.namedItem('phoneTd').innerText;
    var gender = (tr.cells.namedItem('genderTd').innerText == 'مرد')? 0 :  1;
    document.getElementById('gender').value  = gender;
    document.getElementById('birth_date').value  = tr.cells.namedItem('birthTd').innerText;
    var cash = tr.cells.namedItem('buy_cash_td').innerText.split(",");// string to array
    document.getElementById('buy_cash').value  = cash[0];
    var month = tr.cells.namedItem('buy_2month_td').innerText.split(",");
    document.getElementById('buy_2month').value  = month[0];
    var cheque = tr.cells.namedItem('buy_cheque_td').innerText.split(",");
    document.getElementById('buy_cheque').value  = cheque[0];

    var chPassVal = tr.cells.namedItem('cheque_passed_td').innerText.split(",");
    document.getElementById('passed_cheque').value  = (chPassVal[0]=='شده') ? 't' : 'f';
    if(chPassVal[0]== 'شده') document.getElementById('passed_cheque').checked = true;
    var MPassVal = tr.cells.namedItem('month_passed_td').innerText.split(",");
    document.getElementById('passed').value  = (MPassVal[0]=='شده') ? 't' : 'f';
    if(MPassVal[0]== 'شده') document.getElementById('passed').checked = true;

// load referred table..............................................................
    var referrd = tr.cells.namedItem('referredTd').innerText;
    if(referrd != 'NULL'){
        referrd = referrd.split(",");
        var ids = [];
        var buy_times = [];
        for(var i = 0; i< referrd.length; i++){ //alert(referrd[i]);
            var id = referrd[i].substring(1, referrd[i].indexOf('-'));
            ids.push(id);
            var buy_time = referrd[i].substring(referrd[i].indexOf('-')+1, referrd[i].indexOf('}'));
            buy_times.push(buy_time);
        }
        // alert(ids);

        show_ref_list(ids,buy_times,'','','',1,'created_at DESC','111');
    }else{
        empty_ref_table();
    }

// create buy time select.......................................................
    var id = tr.getAttribute('data-id');
    var select = document.getElementById('buyTime');
    select.setAttribute('data-id', id);
    for (var i = 2; i<= cash.length; i++){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        select.appendChild(opt);
    }

    document.getElementById('save_new_buy').setAttribute('data-id', id);
}
document.getElementById("buyTime").addEventListener("change", change_buy_time);

function remove_gray_bg_from_user_list() {
    var table = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    var len = table.rows.length;
    for (var i = 0; i<len; i++) {
        var row = table.rows[i];
        if($(row).data("id")) {
            $(row).removeClass('gray_row');
        }
    }
}

function new_buy() {
    document.getElementById('buy_cash').value  = '';
    document.getElementById('buy_2month').value  = '';
    document.getElementById('buy_cheque').value  = '';
    document.getElementById('save_new_buy').style.display  = 'block';
}
function save_new_buy(source) {
    $(".money").each(function() {
        var val = this.value;
        val = val.replace(/,/g, "");
        this.value = val;
    });

    var id = $(source).data('id');
    var cash = document.getElementById('buy_cash').value ? document.getElementById('buy_cash').value : 0 ;
    var month = document.getElementById('buy_2month').value ? document.getElementById('buy_2month').value : 0 ;
    var cheque = document.getElementById('buy_cheque').value ? document.getElementById('buy_cheque').value : 0;

    $.ajax({
        type: 'post',
        url: 'newBuy.php',
        data: { 'cash': cash, 'month': month, 'cheque': cheque , 'id': id },
        beforeSend: function() {
        },
        success: function (data) {
            document.getElementById("message").innerHTML = data;
            document.getElementById("message").style.display = 'block';
        }
    });
}
// this is for edit form time of buy....................
function change_buy_time() {
    var i = this.value - 1;
    var id = $(this).data('id');
    var table = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    for(var j=0; j<table.rows.length; j++){
        var tr = table.rows[j];
        if($(tr).data('id') == id){
            var cash = tr.cells.namedItem('buy_cash_td').innerText.split(",");
            document.getElementById('buy_cash').value  = cash[i];
            var month = tr.cells.namedItem('buy_2month_td').innerText.split(",");
            document.getElementById('buy_2month').value  = month[i];
            var cheque = tr.cells.namedItem('buy_cheque_td').innerText.split(",");
            document.getElementById('buy_cheque').value  = cheque[i];


            var chPassVal = tr.cells.namedItem('cheque_passed_td').innerText.split(",");
            document.getElementById('passed_cheque').value  = (chPassVal[i]=='شده') ? 't' : 'f';
            (chPassVal[i]== 'شده') ? document.getElementById('passed_cheque').checked = true: document.getElementById('passed_cheque').checked = false;
            var MPassVal = tr.cells.namedItem('month_passed_td').innerText.split(",");
            document.getElementById('passed').value  = (MPassVal[i]=='شده') ? 't' : 'f';
            (MPassVal[i]== 'شده') ? document.getElementById('passed').checked = true : document.getElementById('passed').checked = false;
            break;
        }
    }
}

function change_user_buy_time(source) {// this is for select inside user table
    var i = source.value - 1;
    var tr = source.parentNode.parentNode.parentNode;

    var cash = tr.cells.namedItem('buy_cash_td').getAttribute('data-val').split(",");
    var month = tr.cells.namedItem('buy_2month_td').getAttribute('data-val').split(",");
    var cheque = tr.cells.namedItem('buy_cheque_td').getAttribute('data-val').split(",");
    var chPassVal = tr.cells.namedItem('cheque_passed_td').getAttribute('data-val').split(",");
    var MPassVal = tr.cells.namedItem('month_passed_td').getAttribute('data-val').split(",");

    tr.cells.namedItem('buy_cash_td').innerText = cash[i];
    tr.cells.namedItem('buy_2month_td').innerText  = month[i];
    tr.cells.namedItem('buy_cheque_td').innerText  = cheque[i];
    tr.cells.namedItem('cheque_passed_td').innerText  = chPassVal[i];
    tr.cells.namedItem('month_passed_td').innerText  = MPassVal[i];

}
//***********************************************************************************
$(document).ready(function() {
    // Get the modal.....................................................
    var modal = document.getElementById('Modal_Form');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    //.................................................................

    // cama seperated inputs..................
    $(".money").keyup(function(event) {
        // skip for arrow keys
        if(event.which >= 37 && event.which <= 40) return;

        var $this = $(this);
        var num = $this.val().replace(/,/g, '');
        $this.val(num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
    });
    // birth date field.......................
    $("#birth_date").keyup(function(event) {
        // skip for arrow keys
        if(event.which >= 37 && event.which <= 40) return;

        // var val = this.value;
        // if(val.length == 4){
        //     this.value+='-';
        // }
        // if(val.length == 7){
        //     this.value+='-';
        // }
    });

    // new user ajax form......................
    $('#user-form').submit(function(event) {
        var referrd = get_referred(); //alert(referrd);
        $(".money").each(function() {
            var val = this.value;
            val = val.replace(/,/g, "");
            this.value = val;
            // alert(this.value);
        });

        if(this.submited == 'save'){
            var password = generate_password();
            $.ajax({
                type: 'post',
                url: 'userCreate.php',
                data: $('#user-form').serialize()+'&'+$.param({ 'password': password, 'referred': referrd }),
                beforeSend: function() {
                    $("#loading").css("display","block");
                },
                success: function (data) {
                    document.getElementById("message").innerHTML = data;
                    document.getElementById("message").style.display = 'block';
                    $("#loading").css("display","none");
                    // alert(data);
                    if(data.indexOf(' با موفقیت اضافه شد.') > -1){
                        show_list('','','',1,'created_at DESC','111');
                        $('html, body').animate({ scrollTop: 0 }, 'slow');
                        setTimeout(function() { refresh_form(); }, 5000);
                    }
                }
            });
        }//...................updateee........................
        else {
            var id = document.getElementById('buyTime').getAttribute('data-id');

            $.ajax({
                type: 'post',
                url: 'updateUser.php',
                data: $('#user-form').serialize()+'&'+$.param({'id': id , 'referred': referrd }),
                beforeSend: function() {
                    $("#loading").css("display","block");
                },
                success: function (data) {
                    document.getElementById("message").innerHTML = data;
                    document.getElementById("message").style.display = 'block';
                    $("#loading").css("display","none");
                    // alert(data);
                    show_list('','','',1,'created_at DESC','111');
                    $('html, body').animate({ scrollTop: 0 }, 'slow');
                    setTimeout(function() { refresh_form(); }, 5000);
                }
            });
        }

        // // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });



    $('#ref-form').submit(function(event) {
            var password = generate_password();
            $.ajax({
                type: 'post',
                url: 'refCreate.php',
                data: $('#ref-form').serialize()+'&'+$.param({ 'password': password }),
                dataType: 'json',
                beforeSend: function() {
                    $("#loading").css("display","block");
                },
                success: function (data) {
                    document.getElementById("ref_message").innerHTML = data.message;
                    document.getElementById("ref_message").style.display = 'block';
                    $("#loading").css("display","none");
                    // alert(data);
                    // if(data.indexOf(' با موفقیت اضافه شد.') > -1){
                    if(data.status == 200){
                        show_list('','','',1,'created_at DESC','111');
                        // var tr = document.createElement("TR");
                        // var x = tr.insertCell(0);
                        // x.setAttribute("id", "numTd");
                        var name = $("#ref-form input[name=name]").val();
                        var last_name = $("#ref-form input[name=last_name]").val();
                        var phone = $("#ref-form input[name=phone]").val();
                        var record = {name:name, last_name:last_name, phone:phone, id:data.id};
                        add_row_to_table_ref(record);
                    }
                }
            });
        // // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

    // search ajax input .................................
   $(".search").keyup(function(event) {
       if (event.keyCode === 9 || event.keyCode === 32 ) {
           return;
       }

       var last_name_search = $('#last_name_search').val();
       var name_search = $('#name_search').val();
       var phone_search = $('#phone_search').val();
       show_list(last_name_search,name_search,phone_search,1,'created_at DESC','111');
   });

   $(".search_ref").keyup(function(event) {
        if (event.keyCode === 9 || event.keyCode === 32 ) {
            return;
        }

        var last_name_search = $('#last_name_search_ref').val();
        var name_search = $('#name_search_ref').val();
        var phone_search = $('#phone_search_ref').val();
        var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
        var ids = [],buy_times = [];
        for (var i = 0; i < tableRef.rows.length; i++) {
            var row = tableRef.rows[i];
            var id  = $(row).data("id");
            ids.push(id);
            // var buy_time = row.cells.namedItem('selectTd').firstChild.firstChild.value ;alert(buy_time);
            var buy_time = row.getElementById('buyTimeTd').innerText;//alert(buy_time);
            buy_times.push(buy_time);
        }
        show_ref_list(ids,buy_times,last_name_search,name_search,phone_search,'created_at DESC','111');

   });

    // ------------------------------------------------------- //
    // Transition Placeholders
    // ------------------------------------------------------ //
    $('input').on('focus', function () {
        $(this).siblings('.label-custom').addClass('active');
    });

    $('input').on('blur', function () {
        $(this).siblings('.label-custom').removeClass('active');

        if ($(this).val() !== '') {
            $(this).siblings('.label-custom').addClass('active');
        } else {
            $(this).siblings('.label-custom').removeClass('active');
        }
    });

});

function add_row_to_table_ref(record) {
    var tr = document.createElement("TR");

    var x0 = tr.insertCell(0);
    x0.setAttribute("id", "deleteTd");
    x0.innerHTML = 'حذف';

    var x1 = tr.insertCell(1);
    x1.setAttribute("id", "numTd");

    var x2 = tr.insertCell(2);
    x2.setAttribute("id", "nameTd");
    x2.innerHTML = record.name;

    var x3 = tr.insertCell(3);
    x3.setAttribute("id", "lastNameTd");
    x3.innerHTML = record.last_name;

    var x4 = tr.insertCell(4);
    x4.setAttribute("id", "phoneTd");
    x4.innerHTML = record.phone;

    var x5 = tr.insertCell(5);
    x5.setAttribute("id", "genderTd");
    x5.innerHTML = 'مرد';

    var x6 = tr.insertCell(6);
    x6.setAttribute("id", "birthTd");

    var x7 = tr.insertCell(7);
    x7.setAttribute("id", "buyTimeTd");

    var x8 = tr.insertCell(8);
    x8.setAttribute("id", "buy_cash_td");

    var x9 = tr.insertCell(9);
    x9.setAttribute("id", "buy_2month_td");

    var x10 = tr.insertCell(10);
    x10.setAttribute("id", "month_passed_td");

    var x11 = tr.insertCell(11);
    x11.setAttribute("id", "buy_cheque_td");

    var x12 = tr.insertCell(12);
    x12.setAttribute("id", "cheque_passed_td");

    var x13 = tr.insertCell(13);
    x13.setAttribute("id", "referredTd");

    var x14 = tr.insertCell(14);
    x14.setAttribute("id", "scoreTd");

    put_clone_tr_in_table_ref(tr,record.id);
}
function show_list(last_name_search,name_search,phone_search,page,sort_col,filter) {
    $.ajax({
        type: "POST",
        url: "search.php",
        dataType : 'JSON',
        data: {
            last_name_search: last_name_search,
            name_search: name_search ,
            phone_search: phone_search,
            page: page,
            sort_col: sort_col,
            filter: filter
        },
        beforeSend: function() {

        },
        success: function(data) { //alert(data);
            $("#results").html(data.table);
            $("#pagination").html(data.pagination);
            // alert(data.count);
        }
    });
}

function sort(source){
    var col = $(source).parent().parent().parent().data("col");
    var sortType = $(source).data("type");
    show_list('','','',1,col+' '+sortType,'111');
}


function paging(source){
    if(source.className != 'cell_disabled'){
        var page = $(source).data("val");
        var last_name_search = $('#last_name_search').val();
        var name_search = $('#name_search').val();
        var phone_search = $('#phone_search').val();

        var active = document.getElementsByClassName('cell_active');
        active[0].className = 'cell';
        source.className = 'cell_active';

        show_list(last_name_search,name_search,phone_search,page,'created_at DESC','111');
    }
}

function filter(filter_case) {
    show_list('','','',1,'created_at DESC',filter_case);
}

function show_ref_list(ids,buy_times,last_name_search,name_search,phone_search,page,sort_col,filter) {
    $.ajax({
        type: "POST",
        url: "selectRef.php",
        dataType : 'JSON',
        data: {
            last_name_search: last_name_search,
            name_search: name_search ,
            phone_search: phone_search,
            page: page,
            sort_col: sort_col,
            filter: filter,
            ids: ids,
            buy_times : buy_times
        },
        beforeSend: function() {

        },
        success: function(data) { //alert(data.count);
            $("#ref_results").html(data.table); //alert(data.table);
            $("#pagination_ref").html(data.pagination);
        }
    });
}

function refresh_form() {
    document.getElementById("message").innerHTML = '';
    document.getElementById("message").style.display = 'none';

    document.getElementById('last_name').value  = '';
    document.getElementById('name').value  = '';
    document.getElementById('mobile').value  = '';
    document.getElementById('birth_date').value  = '';
    document.getElementById('buy_cash').value  = '';
    document.getElementById('buy_2month').value  = '';
    document.getElementById('buy_cheque').value  = '';
    document.getElementById('gender').value  = 0;
    document.getElementById('passed').checked = false;
    document.getElementById('passed_cheque').checked = false;

    empty_ref_table();
}

function empty_ref_table() {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    tableRef.innerHTML = '';
    var row = '<tr class="empty-row">\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            <td></td>\
            </tr>';
    for(var i=0; i<5; i++){
        tableRef.innerHTML +=row;
    }
}
//..........................validations...........................................
function just_persian(event){
    if (event.keyCode === 8 || event.keyCode === 9) {//backspace and tab
        return;
    }
    if(event.which >= 37 && event.which <= 40) return;

    str = String.fromCharCode(event.which);
    var p = /^[\u0600-\u06FF\s]+$/;

    if (!p.test(str)) {
        event.preventDefault();
        alert("فقط حروف فارسی قابل قبول است!");
    }
}
function just_number(event){
    if (event.keyCode === 8 || event.keyCode === 9) {
        return;
    }
    if(event.which >= 37 && event.which <= 40) return;

    str = String.fromCharCode(event.which);
    var p = /^\d([\,][\d])?$/; //    /^[\d+]+$/;

    if (!p.test(str)) {
        event.preventDefault();
        alert("فقط عدد قابل قبول است!");
    }
}
//....................................................................................
function save_cancle(){
    refresh_form();
    remove_gray_bg_from_user_list();

    document.getElementsByClassName('buying')[0].style.display = 'none';
    document.getElementsByClassName('btn-primary')[0].style.display = 'block';
    document.getElementsByClassName('btn-secondary')[0].style.display = 'none';
    document.getElementsByClassName('pull-me')[0].innerHTML = 'افزودن فرد جدید';

    // document.getElementById('pagination_ref').innerHTML = create_ref_pagination(1,1);
}

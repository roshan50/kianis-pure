//global variables...................................................
var row_per_ref_page = 5;
var ref_table_array = [];
var ref_table_array_rows_page = [];
var current_page = 1;//ref table
var last_page = 1;//ref table
//*******************************************************************
$(document).ready(function() {
    // var modal = document.getElementById('Modal_Form');
    // var btn = document.getElementById("myBtn");
    // var span = document.getElementsByClassName("close")[0];
    // btn.onclick = function() {
    //     modal.style.display = "block";
    // }
    // span.onclick = function() {
    //     modal.style.display = "none";
    // }
    // window.onclick = function(event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //     }
    // }
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
    });

    // new user ajax form......................
    $('#user-form').submit(function(event) {
        var referrd = get_referred(); //alert(referrd);

        remove_camas();

        $('html, body').animate({ scrollTop: 0 }, 'slow');

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
                    // document.getElementById("message").innerHTML = data;
                    // document.getElementById("message").style.display = 'block';
                    show_save_message(data);
                    $("#loading").css("display","none");
                    // alert(data);
                    if(data.indexOf(' با موفقیت اضافه شد.') > -1){
                        show_list('','','',1,'created_at DESC','111');
                        setTimeout(function() { refresh_form(); }, 1000);
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
                    // document.getElementById("message").innerHTML = data;
                    // document.getElementById("message").style.display = 'block';
                    show_save_message(data);
                    $("#loading").css("display","none");
                    // alert(data);
                    show_list('','','',1,'created_at DESC','111');
                    setTimeout(function() { save_cancle(); }, 1000);
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
                success: function (data) {//alert(0);
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
                        var record = {name:name, last_name:last_name, phone:phone,
                                        gender:'مرد', birth_date:'', buy_time:'',
                                        buy_cash:'', buy_2month:'', /*2month_passed:'',*/
                                        buy_cheque: '', cheque_passed: '', referred: '',
                                        score:'' ,id:data.id};
                        var html_row = create_ref_row_from_obj(record);
                        put_clone_tr_in_table_ref(html_row,data.id);

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
        if (event.keyCode === 9 || event.keyCode === 32 ) {// 9 for tab, 32 for space
            return;
        }

        if (event.keyCode === 16 || event.keyCode === 17 || event.keyCode === 18) {//ctrl keys
            return;
        }

       search_referred_table();
   });

   $("#name").keyup(function () {
       var val = this.value;
       $("#ref_table_title_get_name_input").text(val);
   });

    $("#last_name").keyup(function () {
        var val = this.value;
        var txt = $("#name").val();
        $("#ref_table_title_get_name_input").text(txt+' '+val);
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
//**********************************************************************************************************************
function show_save_message(msg) {
    $('.wrap').addClass('active');
    $('.content').text(msg);
    setTimeout(function() { $('.wrap').removeClass('active'); }, 2000);
    // return false;
}

function remove_camas() {
    $(".money").each(function() {
        var val = this.value;
        val = val.replace(/,/g, "");
        this.value = val;
        // alert(this.value);
    });
}

function update_table_row_numbers(table,base) {
    for (var i = base; i < base+row_per_ref_page; i++) {
        var row = table.rows[i];
        if(row.getAttribute('data-id'))
            row.cells.namedItem('numTd').innerHTML = i+1;
    }
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

    if (active_len >= row_per_ref_page) {// go to next page
        //save ref_table_info..............
        var table_ref_cur_page = tableRef.innerHTML;
        ref_table_array_rows_page.push([table_ref_cur_page,last_page]); //alert(ref_table_array_rows_page);
        last_page++;
        current_page = last_page;
        //make ref table next_page.........
        full_ref_table_with_empty_rows(0);
        var row2 = tableRef.rows[0];
        clone_tr.cells.namedItem('numTd').innerHTML = 1; // update number of column
        row2.innerHTML = clone_tr.innerHTML;
        row2.setAttribute("data-id", id);
        row2.classList.remove('empty-row');
        //paginagion.......................
        document.getElementById('pagination_ref').innerHTML = create_ref_pagination(2, 2);
        active_len = 0;
    }

    add_ref_msg('شخص انتخاب شده به جدول معرفی ها اضافه شد!');
}

function add_ref_msg(msg) {
    var g = document.createElement('div');
    g.className='modal-content-add-ref-msg';
    g.innerText = msg;
    var modal = document.getElementById('modal-add-ref-msg');
    modal.appendChild(g);
    modal.style.display = 'block';
    if(msg.indexOf('شخص انتخاب شده به جدول معرفی ها اضافه شد!') == -1){
        g.style.backgroundColor = '#bf3f3a';
    }
    $( g ).fadeIn( "slow" );
    setTimeout(function() {
        $( g ).fadeOut( "slow" );
     }, 1700);
    // remove_msg(g);
    setTimeout(function() { remove_msg(g); }, 2000);
}
function remove_msg(g) {
    var modal = document.getElementById('modal-add-ref-msg');
    modal.removeChild(g);
    if(!modal.innerText){
        modal.style.display = 'none';
    }
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
                    add_ref_msg('شما قبلا این کاربر را برای این خریدش انتخاب کرده اید!');
                    // alert('شما قبلا این کاربر را برای این خریدش انتخاب کرده اید!');
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

                    put_ref_tr_in_obj(clone_tr,id);
                }
            }else{
                source.parentNode.parentNode.parentNode.style.backgroundColor = 'gray';
                add_ref_msg('این کاربر به ازای این خرید قبلا معرفی شده است');
                // alert('این کاربر به ازای این خرید قبلا معرفی شده است');
            }
        }
    });
}

function delete_record(source) {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    var row = source.parentNode.parentNode;
    tableRef.removeChild(row);

    full_ref_table_with_empty_rows(4);
    update_table_row_numbers(tableRef,0);

    for(var i = 0; i<ref_table_array.length; i++){
        if(row.cells.namedItem('phoneTd').innerHTML == ref_table_array[i]['phone']){
            // delete ref_table_array[i];
            ref_table_array.splice(i, 1);
        }
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
                alert(txt);
                // document.getElementsByClassName('wrap')[0].style.top = '75%';
                // document.getElementsByClassName('wrap')[0].style.bottom = '15%';
                // show_save_message(txt);
            }
        });
    } else {
        txt = "عملیات حذف لغو شد!";
        alert(txt);
        // show_save_message(txt);
    }
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

// this is for edit............................................................................
function make_ready_for_edit(source) {
    var tr = source.parentNode;
    remove_gray_bg_from_user_list();
    make_appearance_ready_for_edit(tr);
    //load input forms.................
    show_in_form(tr);
    // load referred table.............
    load_ref_table(tr);
    // create buy time select..........
    var id = tr.getAttribute('data-id');
    create_buy_time_part_for_edit(tr,id);
    // this is for keep editable row after paging
    document.getElementById('userTable').setAttribute('data-selectedId', id);
}

function make_appearance_ready_for_edit(tr) {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    // document.getElementsByClassName('buyselection')[0].style.display = 'flex';
    document.getElementsByClassName('buying')[0].style.display = 'flex';
    // document.getElementsByClassName('buyselection')[0].style.justifyContent = 'space-around';
    document.getElementById('save').style.display = 'none';
    document.getElementsByClassName('btn-secondary')[0].style.display = 'block';
    document.getElementsByClassName('pull-me')[0].innerHTML = 'ویرایش';

    // alert(tr.cells.namedItem('chbxtd').firstElementChild.firstElementChild.disabled);
    $(tr).addClass('gray_row');
    tr.cells.namedItem('chbxtd').firstChild.getElementsByTagName('button')[0].disabled = true;
    tr.cells.namedItem('chbxtd').firstChild.getElementsByTagName('button')[0].style.cursor= "default";
}

function show_in_form(tr){
    document.getElementById('ref_table_title_get_name_input').innerText  = tr.cells.namedItem('nameTd').innerText
        +' '+tr.cells.namedItem('lastNameTd').innerText;

    document.getElementById('last_name').value  = tr.cells.namedItem('lastNameTd').innerText;
    document.getElementById('name').value  = tr.cells.namedItem('nameTd').innerText;
    document.getElementById('mobile').value  = tr.cells.namedItem('phoneTd').innerText;
    var gender = (tr.cells.namedItem('genderTd').innerText == 'مرد')? 0 :  1;
    document.getElementById('gender').value  = gender;
    document.getElementById('birth_date').value  = tr.cells.namedItem('birthTd').innerText;
    var cash = tr.cells.namedItem('buy_cash_td').innerText;// string to array
    document.getElementById('buy_cash').value  = cash;
    var month = tr.cells.namedItem('buy_2month_td').innerText;
    document.getElementById('buy_2month').value  = month;
    var cheque = tr.cells.namedItem('buy_cheque_td').innerText;
    document.getElementById('buy_cheque').value  = cheque;

    if(month != '0') document.getElementById('passed').disabled = false;
    if(cheque != '0') document.getElementById('passed_cheque').disabled = false;

    var chPassVal = tr.cells.namedItem('cheque_passed_td').innerText;
    document.getElementById('passed_cheque').value  = (chPassVal=='خورده') ? 't' : 'f';
    if(chPassVal== 'خورده') document.getElementById('passed_cheque').checked = true;
    var MPassVal = tr.cells.namedItem('month_passed_td').innerText;
    document.getElementById('passed').value  = (MPassVal=='خورده') ? 't' : 'f';
    if(MPassVal== 'خورده') document.getElementById('passed').checked = true;
}


function remove_gray_bg_from_user_list() {
    var table = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    document.getElementById('userTable').setAttribute('data-selectedId',0);
    var len = table.rows.length;
    for (var i = 0; i<len; i++) {
        var row = table.rows[i];
        if($(row).data("id")) {
            $(row).removeClass('gray_row');
            row.cells.namedItem('chbxtd').firstElementChild.firstElementChild.disabled = false;
        }
    }
}

function load_ref_table(tr) {
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
    }
}

function create_buy_time_part_for_edit(tr,id) {
    var select = document.getElementById('buyTime');
    select.disabled = false;
    select.setAttribute('data-id', id);
    select.innerText = null;
    var cash = tr.cells.namedItem('buy_cash_td').getAttribute('data-val').split(',');
    var len = tr.cells.namedItem('buy_cash_td').innerText ? cash.length : 0;
    for (var i = 1; i<= len; i++){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        select.appendChild(opt);
    }
    document.getElementById('newBuy').style.display = 'block';
    document.getElementById('save_new_buy').setAttribute('data-id', id);
}
//********************************************************************************************************
function new_buy() {
    document.getElementById('buy_cash').value  = '';
    document.getElementById('buy_2month').value  = '';
    document.getElementById('buy_cheque').value  = '';
    //...........................................
    var optCount = document.getElementById("buyTime").length;
    var opt = document.createElement('option');
    opt.value = optCount+1;
    opt.innerHTML = optCount+1;
    opt.selected = 'selected';
    document.getElementById("buyTime").appendChild(opt);
    document.getElementById("buyTime").disabled = true;
    document.getElementById("newBuy").style.display  = 'none';
    //............................................
    document.getElementById('save_new_buy').style.display  = 'block';
}
function save_new_buy(source) {
    remove_camas();

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
            // update_form_buy_select();
            document.getElementById("buyTime").disabled = false;
            document.getElementById("newBuy").style.display  = 'block';
            document.getElementById('save_new_buy').style.display  = 'none';
            // update_user_table_row(id,cash,month,cheque,'نخورده','نخورده');
            show_list('','','',1,'created_at DESC','111');
        }
    });
}

// function update_form_buy_select() {
//     var buy_select = document.getElementById("buyTime");
//     var option = document.createElement("option");
//     option.text = parseInt(buy_select.options[buy_select.options.length - 1].value)+1;
//     buy_select.add(option);
// }

function update_user_table_row(id,newCash,newMonth,newCheque,newPass,newCpass) {
    var table = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    for(var j=0; j<table.rows.length; j++){
        var tr = table.rows[j];
        if($(tr).data('id') == id){
            var cash = tr.cells.namedItem('buy_cash_td').getAttribute('data-val');
            cash = cash ? cash+','+newCash : newCash;
            tr.cells.namedItem('buy_cash_td').setAttribute('data-val',cash);
            var month = tr.cells.namedItem('buy_2month_td').getAttribute('data-val');
            month = month ? month+','+newMonth : newMonth;
            tr.cells.namedItem('buy_2month_td').setAttribute('data-val',month);
            var cheque = tr.cells.namedItem('buy_cheque_td').getAttribute('data-val');
            cheque = cheque ? cheque+','+newCheque : newCheque;
            tr.cells.namedItem('buy_cheque_td').setAttribute('data-val',cheque);
            var chPassVal = tr.cells.namedItem('cheque_passed_td').getAttribute('data-val');
            chPassVal = chPassVal ? chPassVal+','+newPass : newPass;
            tr.cells.namedItem('cheque_passed_td').setAttribute('data-val',chPassVal);
            var MPassVal = tr.cells.namedItem('month_passed_td').getAttribute('data-val');
            MPassVal = MPassVal ? MPassVal+','+newCpass : newCpass;
            tr.cells.namedItem('month_passed_td').setAttribute('data-val',MPassVal);
            break;
        }
    }
}
// this is for edit form time of buy....................
function change_buy_time(source) {
    var i = source.value - 1;
    var id = source.getAttribute('data-id');
    var table = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    for(var j=0; j<table.rows.length; j++){
        var tr = table.rows[j];
        if(tr.getAttribute('data-id') == id){
            var cash = tr.cells.namedItem('buy_cash_td').getAttribute('data-val').split(",");
            document.getElementById('buy_cash').value  = cash[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var month = tr.cells.namedItem('buy_2month_td').getAttribute('data-val').split(",");
            document.getElementById('buy_2month').value  = month[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var cheque = tr.cells.namedItem('buy_cheque_td').getAttribute('data-val').split(",");
            document.getElementById('buy_cheque').value  = cheque[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


            var chPassVal = tr.cells.namedItem('cheque_passed_td').getAttribute('data-val').split(",");
            document.getElementById('passed_cheque').value  = (chPassVal[i]=='خورده') ? 't' : 'f';
            (chPassVal[i]== 'خورده') ? document.getElementById('passed_cheque').checked = true: document.getElementById('passed_cheque').checked = false;
            var MPassVal = tr.cells.namedItem('month_passed_td').getAttribute('data-val').split(",");
            document.getElementById('passed').value  = (MPassVal[i]=='خورده') ? 't' : 'f';
            (MPassVal[i]== 'خورده') ? document.getElementById('passed').checked = true : document.getElementById('passed').checked = false;
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

    tr.cells.namedItem('buy_cash_td').innerText = cash[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    tr.cells.namedItem('buy_2month_td').innerText  = month[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    tr.cells.namedItem('buy_cheque_td').innerText  = cheque[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    tr.cells.namedItem('cheque_passed_td').innerText  = chPassVal[i];
    tr.cells.namedItem('month_passed_td').innerText  = MPassVal[i];

}

function show_list(last_name_search,name_search,phone_search,page,sort_col,filter) {
    var select_for_edit_id = document.getElementById('userTable').getAttribute('data-selectedId');
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
            filter: filter,
            selectedId: select_for_edit_id
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
//......................................................................................................
function refresh_form() {
    document.getElementById("message").innerHTML = '';
    document.getElementById("message").style.display = 'none';
    document.getElementById("ref_table_title_get_name_input").innerHTML = "";

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

    document.getElementById("save_new_buy").style.display = 'none';
    document.getElementsByClassName('buying')[0].style.display = 'none';

    ref_table_array = [];
    ref_table_array_rows_page = [];

    full_ref_table_with_empty_rows(0);
}
//....................................................................................
function save_cancle(){
    refresh_form();
    remove_gray_bg_from_user_list();


    document.getElementById('save').style.display = 'block';
    document.getElementsByClassName('btn-secondary')[0].style.display = 'none';
    document.getElementsByClassName('pull-me')[0].innerHTML = 'افزودن فرد جدید';

    // document.getElementById('pagination_ref').innerHTML = create_ref_pagination(1,1);
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


//******************...Referred Table...***************************************************************************
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
        success: function(data) {
            ref_table_array = data.obj; //alert(ref_table_array[0]['name']);
            $("#ref_results").html(data.table); //alert(data.table);
            $("#pagination_ref").html(data.pagination);
            // for(var i=0; i<obj.length; i++){
            //     alert(obj[i]['name']);
            // }
        }
    });
}

function create_ref_row_from_obj(record) {
    var tr = document.createElement("TR");
    tr.setAttribute("data-id", record.id);

    var x0 = tr.insertCell(0);
    x0.setAttribute("id", "chbxtd");
    x0.setAttribute("class", "deleteTd");
    x0.innerHTML = '<div onclick="delete_record(this)">حذف</div>';

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
    x5.innerHTML = record.gender;//'مرد';

    var x6 = tr.insertCell(6);
    x6.setAttribute("id", "birthTd");
    x6.innerHTML = record.birth_date;

    var x7 = tr.insertCell(7);
    x7.setAttribute("id", "buyTimeTd");
    // x7.innerHTML = record.gender;

    var x8 = tr.insertCell(8);
    x8.setAttribute("id", "buy_cash_td");
    x8.innerHTML = record.buy_cash;

    var x9 = tr.insertCell(9);
    x9.setAttribute("id", "buy_2month_td");
    x9.innerHTML = record.buy_2month;

    var x10 = tr.insertCell(10);
    x10.setAttribute("id", "month_passed_td");
    // x10.innerHTML = record.2month_passed;

    var x11 = tr.insertCell(11);
    x11.setAttribute("id", "buy_cheque_td");
    x11.innerHTML = record.buy_cheque;

    var x12 = tr.insertCell(12);
    x12.setAttribute("id", "cheque_passed_td");
    if(record.cheque_passed == 'f') record.cheque_passed = 'نخورده';
    if(record.cheque_passed == 't') record.cheque_passed = 'خورده';
    x12.innerHTML = record.cheque_passed;

    var x13 = tr.insertCell(13);
    x13.setAttribute("id", "sumTd");
    // x13.innerHTML = record.referred;

    var x14 = tr.insertCell(14);
    x14.setAttribute("id", "referredTd");
    x14.innerHTML = record.referred;

    var x15 = tr.insertCell(15);
    x15.setAttribute("id", "scoreTd");
    x15.innerHTML = record.score;

    return tr;
}

function put_ref_tr_in_obj(clone_tr,id) {
    var record = {
        name : clone_tr.cells.namedItem('nameTd').innerText,
        last_name: clone_tr.cells.namedItem('lastNameTd').innerText,
        phone: clone_tr.cells.namedItem('phoneTd').innerText,
        gender: clone_tr.cells.namedItem('genderTd').innerText,
        birth_date: clone_tr.cells.namedItem('birthTd').innerText,
        buy_time:'',
        buy_cash: clone_tr.cells.namedItem('buy_cash_td').innerText,
        buy_2month: clone_tr.cells.namedItem('buy_2month_td').innerText,
        /*2month_passed:'',*/
        buy_cheque: clone_tr.cells.namedItem('buy_cheque_td').innerText,
        cheque_passed: clone_tr.cells.namedItem('cheque_passed_td').innerText,
        referred: clone_tr.cells.namedItem('referredTd').innerText,
        score: clone_tr.cells.namedItem('scoreTd').innerText,
        id:id
    };

    ref_table_array.push(record);
}

function full_ref_table_with_empty_rows(row_number) {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    if(row_number == 0) tableRef.innerHTML = ''; // for empty ref table
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
            <td></td>\
            </tr>';

    for(var i=row_number; i<row_per_ref_page; i++){
        tableRef.innerHTML +=row;
    }
}

function search_referred_table() {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    tableRef.innerHTML = '';

    var name_search = $('#name_search_ref').val();
    var last_name_search = $('#last_name_search_ref').val();
    var phone_search = $('#phone_search_ref').val();

    var html_row = '';
    var row_number = 0;
    for(var i=0; i < ref_table_array.length; i++){ //alert(ref_table_array[i]['name']);
        if(ref_table_array[i]['name'].startsWith(name_search)
           && ref_table_array[i]['last_name'].startsWith(last_name_search)
           && ref_table_array[i]['phone'].startsWith(phone_search)
        ){
            html_row = create_ref_row_from_obj(ref_table_array[i]);
            tableRef.appendChild(html_row);
            row_number++;
        }
    }

    full_ref_table_with_empty_rows(row_number);

    update_table_row_numbers(tableRef,0);
    //pagination
    // document.getElementById('pagination_ref').innerHTML = create_ref_pagination(last_page, target_page);
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
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    var target_page = source.getAttribute('data-val');
    var result;
    var len = ref_table_array_rows_page.length;
    for (var i = 0; i < len; i++) {
        if (ref_table_array_rows_page[i][1] == target_page) {
            result = ref_table_array_rows_page[i][0];

            if (current_page == last_page && ref_table_array_rows_page[len - 1][1] != last_page) {
                var table_ref_cur_page = tableRef.innerHTML;
                ref_table_array_rows_page.push([table_ref_cur_page, last_page]);
                current_page = target_page;
            }

            break;
        }
    }

    tableRef.innerHTML = result;
    //pagination
    document.getElementById('pagination_ref').innerHTML = create_ref_pagination(last_page, target_page);
}




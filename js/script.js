// check box for passed cheque.....................
// function toggle(source) {
//     checkboxes = document.getElementsByName('users');
//     for(var i=0;i<checkboxes.length;i++) {
//         checkboxes[i].checked = source.checked;
//     }
// }

// function update_table_row_numbers(table) {
//     for (var i = 0; i < table.rows.length; i++) {
//         table.rows[i].cells.namedItem('numTd').innerHTML = i+1;
//     }
// }

function add_reffered(source) {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
   // // if(source.checked) {//insert row to ref table.................
        var tr = source.parentNode.parentNode.parentNode.cloneNode(true);
        var id = tr.getAttribute('data-id');//alert('id='+id);

        var BuyingTime = tr.cells.namedItem('buy_cash_td').innerText.split(",").length; //alert('buyintime='+BuyingTime);
        var row_count = 0;
        var options = '';

        $.ajax({
            type: "POST",
            url: "searchRef.php",
            dataType : 'JSON',
            data: {
                id: id,
                length: BuyingTime
            },
            success: function(count_arr){//alert(count_arr);alert(count_arr.length);
                var cash = [];
                var month = [];
                var cheque = [];
                var chPassVal = [];
                var MPassVal = [];

                var cash1 = tr.cells.namedItem('buy_cash_td').innerText.split(",");
                var month1 = tr.cells.namedItem('buy_2month_td').innerText.split(",");
                var cheque1 = tr.cells.namedItem('buy_cheque_td').innerText.split(",");
                var chPassVal1 = tr.cells.namedItem('cheque_passed_td').innerText.split(",") ;
                var MPassVal1 = tr.cells.namedItem('month_passed_td').innerText.split(",");


                var len = tableRef.rows.length;
                var flag = true;
                for(var i=0; i<count_arr.length; i++){// loop through every buying
                    if(count_arr[i] == 0){ // if dose not have referred for this buying
                        //check if it is in table ref...................
                        var order;
                        for (var j = 0; j<len; j++) {
                            var row = tableRef.rows[j];
                            if($(row).data("id")) {
                                var row_id = $(row).data("id");
                                if(row_id == id){
                                    order = row.getElementsByTagName('select')[0].value;
                                    if(order == i+1){ //alert('order='+order);
                                        // alert(row.getElementsByTagName('select')[0].getElementsByTagName('option')[1].innerHTML);
                                        // remove this order from this select box
                                        // row.getElementsByTagName('select')[0].removeChild();

                                        flag = false;
                                        break;
                                    }else {
                                        flag = true;
                                    }
                                }
                            }else{
                                break;
                            }
                        }
                        //...............................................
                        //alert('i='+i+'flag='+flag);
                        if(flag) {
                            options += '<option value="' + (i + 1) + '">' + (i + 1) + '</option>';
                            row_count++;
                            cash.push(cash1[i]);
                            month.push(month1[i]);
                            cheque.push(cheque1[i]);
                            chPassVal.push(chPassVal1[i]);
                            MPassVal.push(MPassVal1[i]);
                        }
                    }
                }

                if(row_count > 0){ //alert('row >1');
                    var select = '<select id="buyTimeTd" onchange="change_time_td(this,'+id+')"> '+
                                        options
                                 +'</select>';
                    // select.addEventListener("change", change_time_td);
                    var td = tr.insertCell(7);
                    td.innerHTML = '<div id="buyselectionTd">'+select+'</div>';
                    td.id = 'selectTd';

                    tr.cells.namedItem('chbxtd').innerHTML = '<div onclick="delete_record(this)">حذف</div>';//add delete column to refferd table
                    tr.cells.namedItem('chbxtd').className = "deleteTd"; // add class name to delete column

                    tr.removeChild(tr.cells.namedItem('editTd')); // remove edit column
                    tr.removeChild(tr.cells.namedItem('delTd')); // remove soft delete column
                    tr.removeChild(tr.cells.namedItem('select_td')); // remove buy time column

                    tr.cells.namedItem('buy_cash_td').innerText = cash[0];
                    tr.cells.namedItem('buy_2month_td').innerText  = month[0];
                    tr.cells.namedItem('buy_cheque_td').innerText  = cheque[0];
                    tr.cells.namedItem('cheque_passed_td').innerText  = chPassVal[0];
                    tr.cells.namedItem('month_passed_td').innerText  = MPassVal[0];
                    // tableRef.appendChild(tr); // add row to ref table
                    var len = tableRef.rows.length;
                    var active_len = 0;
                    for (var j = 0; j<len; j++) { //add row to ref table in first gray(deactive) row
                        var row = tableRef.rows[j];//alert(j);
                        if(!$(row).data("id")) {
                            tr.cells.namedItem('numTd').innerHTML = j+1; // update number of column
                            row.innerHTML = tr.innerHTML;
                            row.setAttribute("data-id", id);
                            row.classList.remove('empty-row');
                            break;
                        }
                        active_len ++;
                    }

                    if(active_len >= 5){// go to next page
                        //save ref_table_info..............
                        var table_ref_cur_page = tableRef.innerHTML; //alert(table_ref_cur_page);
                        //make ref table next_page.........
                        empty_ref_table();
                        var row2 = tableRef.rows[0];
                        tr.cells.namedItem('numTd').innerHTML = 1; // update number of column
                        row2.innerHTML = tr.innerHTML;
                        row2.setAttribute("data-id", id);
                        row2.classList.remove('empty-row');
                        //paginagion.......................
                        document.getElementById('pagination_ref').innerHTML = create_ref_pagination(2,2);
                        alert('not space '+active_len);

                    }

                }else{
                    source.parentNode.parentNode.parentNode.style.backgroundColor = 'gray';
                    alert('این کاربر به ازای تمام خریدهایش قبلا معرفی شده است');
                }

            }
        });

    // }
    // else {// delete row from ref table ............................
    //     var mobile = source.parentNode.parentNode.parentNode.cells.namedItem('phoneTd').innerText;
    //
    //     var len = tableRef.rows.length;
    //     for (var i = 0; i < len; i++) {
    //         var row = tableRef.rows[i];
    //         if(mobile == row.cells.namedItem('phoneTd').innerText){
    //             tableRef.removeChild(row);
    //             break;
    //         }
    //     }//update numbers
    //     for (var i = 0; i < tableRef.rows.length; i++) {
    //         tableRef.rows[i].cells.namedItem('numTd').innerHTML = i+1;
    //     }
    // }
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
        // link.addEventListener("click",test);
    }else {
        var link = $(source).parent().parent().find(".deleteTd");
        link.removeClass('deleteTd');
        link.addClass('deactiveDel');
        $(link).off("click");
        // link.removeEventListener("click", test);
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
            var order = row.getElementsByTagName('select')[0].value;
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
    // $('.panel').slideDown('slow');
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    // document.getElementsByClassName('buyselection')[0].style.display = 'flex';
    document.getElementsByClassName('buying')[0].style.display = 'flex';
    // document.getElementsByClassName('buyselection')[0].style.justifyContent = 'space-around';
    document.getElementsByClassName('btn-primary')[0].style.display = 'none';
    document.getElementsByClassName('btn-secondary')[0].style.display = 'block';
    document.getElementsByClassName('pull-me')[0].innerHTML = 'ویرایش';
    //load input forms...........................................................
    var tr = source.parentNode;
    // tr.style.backgroundColor = 'gray';
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
        }//alert(ids);

        show_ref_list(ids,buy_times,'','','','created_at DESC');
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
            // $("#loading").css("display","block");
        },
        success: function (data) {
            document.getElementById("message").innerHTML = data;
            document.getElementById("message").style.display = 'block';
            // $("#loading").css("display","none");
            // alert(data);
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

function change_time_td(source,id) {
    var i = source.value - 1;
    var row = source.parentNode.parentNode.parentNode;
    var table = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    for(var j=0; j<table.rows.length; j++){
        var tr = table.rows[j];
        if($(tr).data('id') == id){
            var cash = tr.cells.namedItem('buy_cash_td').innerText.split(",");
            var month = tr.cells.namedItem('buy_2month_td').innerText.split(",");
            var cheque = tr.cells.namedItem('buy_cheque_td').innerText.split(",");
            var chPassVal = tr.cells.namedItem('cheque_passed_td').innerText.split(",");
            var MPassVal = tr.cells.namedItem('month_passed_td').innerText.split(",");

            row.cells.namedItem('buy_cash_td').innerText = cash[i];
            row.cells.namedItem('buy_2month_td').innerText  = month[i];
            row.cells.namedItem('buy_cheque_td').innerText  = cheque[i];
            row.cells.namedItem('cheque_passed_td').innerText  = chPassVal[i];
            row.cells.namedItem('month_passed_td').innerText  = MPassVal[i];
            break;
        }
    }
}

function change_user_buy_time(source) {
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
    // $('.pull-me').click(function() {
    //     $('.panel').slideToggle('slow');
    // });


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
                data: $('form').serialize()+'&'+$.param({ 'password': password, 'referred': referrd }),
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
                data: $('form').serialize()+'&'+$.param({'id': id , 'referred': referrd }),
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
                beforeSend: function() {
                    $("#loading").css("display","block");
                },
                success: function (data) {
                    document.getElementById("ref_message").innerHTML = data;
                    document.getElementById("ref_message").style.display = 'block';
                    $("#loading").css("display","none");
                    // alert(data);
                    if(data.indexOf(' با موفقیت اضافه شد.') > -1){
                        show_list('','','',1,'created_at DESC','111');
                        // $('html, body').animate({ scrollTop: 0 }, 'slow');
                        // setTimeout(function() { refresh_form(); }, 5000);
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

       var cls = this.className;
       var last_name_search,name_search,phone_search;
       if(cls.indexOf('ref') == -1){
           last_name_search = $('#last_name_search').val();
           name_search = $('#name_search').val();
           phone_search = $('#phone_search').val();
           show_list(last_name_search,name_search,phone_search,1,'created_at DESC','111');
       }else{
           last_name_search = $('#last_name_search_ref').val();
           name_search = $('#name_search_ref').val();
           phone_search = $('#phone_search_ref').val();
           var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
           var ids = [],buy_times = [];
           for (var i = 0; i < tableRef.rows.length; i++) {
               var row = tableRef.rows[i];
               var id  = $(row).data("id");
               ids.push(id);
               // var buy_time = row.cells.namedItem('selectTd').firstChild.firstChild.value ;alert(buy_time);
               var buy_time = row.getElementsByTagName('select')[0].value;//alert(buy_time);
               buy_times.push(buy_time);
           }
           show_ref_list(ids,buy_times,last_name_search,name_search,phone_search,'created_at DESC');
       }

   });

    // $(".filter").click(function() {
    //     var filter = '';
    //     var chbx = document.getElementsByClassName('filter_div');
    //     for(var i=0; i<3 ;i++)
    //     {
    //         var cb = chbx[i].getElementsByClassName("checkbox")[0].getElementsByTagName('input')[0];
    //         filter += cb.checked ? '1' : '0';
    //     }
    //     alert(filter);
    //
    //     show_list('','','','','created_at DESC',filter);
    //
    // });


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


function show_list(last_name_search,name_search,phone_search,page,sort_col,filter) {
    var tempScrollTop = $(window).scrollTop();//for maintaning page scroll position after ajax call
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
            // $("#loading").css("display","none");
            // $(window).scrollTop(tempScrollTop);//for maintaning page scroll position after ajax call
        }
    });
}

function sort(source){
    var col = $(source).parent().parent().parent().data("col");
    var sortType = $(source).data("type");
    // alert(col+' '+sortType);
    show_list('','','',1,col+' '+sortType,'111');
}


function paging(source){
    if(source.className != 'cell_disabled'){
        var page = $(source).data("val");
        // alert(page);
        var cls = source.parentNode.className;
        var last_name_search,name_search,phone_search;
        if(cls.indexOf('ref') == -1){
            last_name_search = $('#last_name_search').val();
            name_search = $('#name_search').val();
            phone_search = $('#phone_search').val();
        }else{
            last_name_search = $('#last_name_search_ref').val();
            name_search = $('#name_search_ref').val();
            phone_search = $('#phone_search_ref').val();
        }

        var active = document.getElementsByClassName('cell_active');
        active[0].className = 'cell';
        source.className = 'cell_active';

        show_list(last_name_search,name_search,phone_search,page,'created_at DESC','111');
    }
}

function filter(filter_case) {
    show_list('','','',1,'created_at DESC',filter_case);
}

function show_ref_list(ids,buy_times,last_name_search,name_search,phone_search,sort_col) {
    $.ajax({
        type: "POST",
        url: "selectRef.php",
        dataType : 'JSON',
        data: {
            last_name_search: last_name_search,
            name_search: name_search ,
            phone_search: phone_search,
            page: 1,
            sort_col: sort_col,
            ids: ids,
            buy_times : buy_times
        },
        beforeSend: function() {
            // $("#loading").css("display","block");
            $("#ref_results").html('<div id="loading"><img src="images/loading.gif" /></div>');

        },
        success: function(data) { //alert(data);
            $("#ref_results").html(data.table); //alert(data.table);
            $("#pagination_ref").html(data.pagination);
            // $("#loading").css("display","none");
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

function just_persian(event){
    if (event.keyCode === 8 || event.keyCode === 9) {//backspace and tab
        return;
    }

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

    str = String.fromCharCode(event.which);
    var p = /^\d([\,][\d])?$/; //    /^[\d+]+$/;

    if (!p.test(str)) {
        event.preventDefault();
        alert("فقط عدد قابل قبول است!");
    }
}

function save_cancle(){
    refresh_form();
    remove_gray_bg_from_user_list();

    document.getElementsByClassName('buying')[0].style.display = 'none';
    document.getElementsByClassName('btn-primary')[0].style.display = 'block';
    document.getElementsByClassName('btn-secondary')[0].style.display = 'none';
    document.getElementsByClassName('pull-me')[0].innerHTML = 'افزودن فرد جدید';

    // document.getElementById('pagination_ref').innerHTML = create_ref_pagination(1,1);
}

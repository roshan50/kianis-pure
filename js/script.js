// check box for passed cheque.....................
function toggle(source) {
    checkboxes = document.getElementsByName('users');
    for(var i=0;i<checkboxes.length;i++) {
        checkboxes[i].checked = source.checked;
    }
}

// function update_table_row_numbers(table) {
//     for (var i = 0; i < table.rows.length; i++) {
//         table.rows[i].cells.namedItem('numTd').innerHTML = i+1;
//     }
// }

function add_reffered(source) {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    if(source.checked) {//insert row to ref table.................
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

                for(var i=0; i<count_arr.length; i++){
                    if(count_arr[i] == 0){
                        options += '<option value="'+(i+1)+'">'+(i+1)+'</option>';
                        row_count++;
                        cash.push(cash1[i]);
                        month.push(month1[i]);
                        cheque.push(cheque1[i]);
                        chPassVal.push(chPassVal1[i]);
                        MPassVal.push(MPassVal1[i]);
                    }
                }

                if(row_count > 0){ //alert('row >1');
                    var select = '<div id="buyselectionTd"> \
                            <select id="buyTimeTd"> '+
                                options
                                +'</select> \
                        </div>';
                    var td = tr.insertCell(7);
                    td.innerHTML = select;
                    td.id = 'selectTd';
                    td.addEventListener("change", change_time_td);

                    var len = tableRef.rows.length;
                    tr.cells.namedItem('chbxtd').innerHTML = 'حذف';//add delete column to refferd table
                    tr.cells.namedItem('chbxtd').className = "deleteTd"; // add class name to delete column
                    tr.cells.namedItem('chbxtd').addEventListener("click", delete_record);// add event to delete column
                    tr.cells.namedItem('numTd').innerHTML = len+1; // update number of column
                    tr.removeChild(tr.cells.namedItem('editTd')); // remove edit column
                    tr.removeChild(tr.cells.namedItem('delTd')); // remove soft delete column

                    tr.cells.namedItem('buy_cash_td').innerText = cash[0];
                    tr.cells.namedItem('buy_2month_td').innerText  = month[0];
                    tr.cells.namedItem('buy_cheque_td').innerText  = cheque[0];
                    tr.cells.namedItem('cheque_passed_td').innerText  = chPassVal[0];
                    tr.cells.namedItem('month_passed_td').innerText  = MPassVal[0];

                    tableRef.appendChild(tr); // add row to ref table
                }else{
                    source.parentNode.parentNode.parentNode.style.backgroundColor = 'gray';
                    alert('این کاربر به ازای تمام خریدهایش قبلا معرفی شده است');
                }

            }
        });

    }
    else {// delete row from ref table ............................
        var mobile = source.parentNode.parentNode.parentNode.cells.namedItem('phoneTd').innerText;

        var len = tableRef.rows.length;
        for (var i = 0; i < len; i++) {
            var row = tableRef.rows[i];
            if(mobile == row.cells.namedItem('phoneTd').innerText){
                tableRef.removeChild(row);
                break;
            }
        }//update numbers
        for (var i = 0; i < tableRef.rows.length; i++) {
            tableRef.rows[i].cells.namedItem('numTd').innerHTML = i+1;
        }
    }
}

function delete_record(source) {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    var row = this.parentNode;
    if(!row){var row = source.parentNode;}
    tableRef.removeChild(row);
    //update number of rows
    for (var i = 0; i < tableRef.rows.length; i++) {
        tableRef.rows[i].cells.namedItem('numTd').innerHTML = i+1;
    }
}

function soft_delete(id,source) {
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
                show_list('','','','','created_at DESC');
                txt = "حذف با موفقیت انجام شد!";
            }
        });
    } else {
        txt = "عملیات حذف لغو شد!";
    }
    alert(txt);

}
// these are for ajax form submit..................
function get_referred() {
    var refs = '';
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    var len = tableRef.rows.length;
    for (var i = 0; i<len; i++) {
        var row = tableRef.rows[i];
        var order = row.getElementsByTagName('select')[0].value;
        // var order = row.cells.namedItem('selectTd').firstChild.firstChild.innerHTML;
        // alert(order);
        var id = row.getAttribute('data-id');
        refs+=',{'+id+'-'+order+'}';
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

        $.ajax({
            type: "POST",
            url: "search.php",
            dataType : 'JSON',
            data: {
                last_name_search: last_name_search,
                name_search: name_search ,
                phone_search: phone_search,
                page: page
                // $sort_col: $('#sort_col').val()
            },
            beforeSend: function() {
                // $('#loading').css({'opacity':0.8});
                // $("#loading").css("display","block");
                if(cls.indexOf('ref') == -1) {
                    $("#results").html('<div id="loading"><img src="images/loading.gif" /></div>');
                }else {
                    $("#ref_results").html('<div id="loading"><img src="images/loading.gif" /></div>');
                }
            },
            success: function(data) {
                if(cls.indexOf('ref') == -1){
                    $("#results").html(data.table);
                    $("#pagination").html(data.pagination);
                    // alert(data.count);
                }else {
                    $("#ref_results").html(data.table);
                    $("#pagination_ref").html(data.pagination);
                }

            }
        });
    }
}

// this is for edit.......................
function showInForm(source){
    $('.panel').slideDown('slow');
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    // document.getElementsByClassName('buyselection')[0].style.display = 'flex';
    document.getElementsByClassName('buying')[0].style.display = 'flex';
    // document.getElementsByClassName('buyselection')[0].style.justifyContent = 'space-around';
    document.getElementsByClassName('btn-primary')[0].style.display = 'none';
    document.getElementsByClassName('btn-secondary')[0].style.display = 'block';
    document.getElementsByClassName('pull-me')[0].innerHTML = 'ویرایش';
    //load input forms...........................................................
    var tr = source.parentNode;
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
    document.getElementById('passed_cheque').value  = (chPassVal[0]=='پاس شده') ? 't' : 'f';
    if(chPassVal[0]== 'پاس شده') document.getElementById('passed_cheque').checked = 'true';
    var MPassVal = tr.cells.namedItem('month_passed_td').innerText.split(",");
    document.getElementById('passed').value  = (MPassVal[0]=='پاس شده') ? 't' : 'f';
    if(MPassVal[0]== 'پاس شده') document.getElementById('passed').checked = 'true';

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
            document.getElementById('passed_cheque').value  = (chPassVal[i]=='پاس شده') ? 't' : 'f';
            (chPassVal[i]== 'پاس شده') ? document.getElementById('passed_cheque').checked = 'true': document.getElementById('passed_cheque').checked = 'false';
            var MPassVal = tr.cells.namedItem('month_passed_td').innerText.split(",");
            document.getElementById('passed').value  = (MPassVal[i]=='پاس شده') ? 't' : 'f';
            (MPassVal[i]== 'پاس شده') ? document.getElementById('passed').checked = 'true' : document.getElementById('passed').checked = 'false';
            break;
        }
    }
}

function change_time_td() {alert('hiiiiee');
    // var table = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    // var tr = table.rows[this.value]; //alert(tr.innerHTML);
    // var cash = tr.cells.namedItem('buy_cash_td').innerText.split(",");//alert(cash);
    // document.getElementById('buy_cash').value  = cash[this.value];
    // var month = tr.cells.namedItem('buy_2month_td').innerText.split(",");
    // document.getElementById('buy_2month').value  = month[this.value];
    // var cheque = tr.cells.namedItem('buy_cheque_td').innerText.split(",");
    // document.getElementById('buy_cheque').value  = cheque[this.value];
    // var chPassVal = (tr.cells.namedItem('cheque_passed_td').innerText == 'پاس نشده')? 0 :  1;
    // document.getElementById('cheque_passed').value  = chPassVal;alert(0);
    // var MPassVal = (tr.cells.namedItem('month_passed_td').innerText == 'پاس نشده')? 0 : 1;
}
//***********************************************************************************
$(document).ready(function() {
    $('.pull-me').click(function() {
        $('.panel').slideToggle('slow');
    });

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
    $('form').submit(function(event) {
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
                    show_list('','','','','created_at DESC');
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
                    show_list('','','','','created_at DESC');
                }
            });
        }

        // // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

    // search ajax input .................................
   $(".search").keyup(function() {
       var cls = this.className;
       var last_name_search,name_search,phone_search;
       if(cls.indexOf('ref') == -1){
           last_name_search = $('#last_name_search').val();
           name_search = $('#name_search').val();
           phone_search = $('#phone_search').val();
           show_list(cls,last_name_search,name_search,phone_search,'created_at DESC');
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
               var buy_time = row.getElementsByTagName('select')[0].value;alert(buy_time);
               buy_times.push(buy_time);
           }
           show_ref_list(ids,buy_times,last_name_search,name_search,phone_search,'created_at DESC');
       }

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


function show_list(cls,last_name_search,name_search,phone_search,sort_col) {
    $.ajax({
        type: "POST",
        url: "search.php",
        dataType : 'JSON',
        data: {
            last_name_search: last_name_search,
            name_search: name_search ,
            phone_search: phone_search,
            page: 1,
            sort_col: sort_col
        },
        beforeSend: function() {
            // $("#loading").css("display","block");
            if(cls.indexOf('ref') == -1) {
                $("#results").html('<div id="loading"><img src="images/loading.gif" /></div>');
            }else {
                $("#ref_results").html('<div id="loading"><img src="images/loading.gif" /></div>');
            }
        },
        success: function(data) { //alert(data);
            if(cls.indexOf('ref') == -1){
                $("#results").html(data.table);
                $("#pagination").html(data.pagination);
                // alert(data.count);
            }else {
                $("#ref_results").html(data.table);
                $("#pagination_ref").html(data.pagination);
            }
            $("#loading").css("display","none");
        }
    });
}

function sort(source){
    var col = $(source).data("col");
    // alert(col);
    show_list('','','','',col);
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
            $("#ref_results").html(data.table);
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
    // var chPassVal = (tr.cells.namedItem('cheque_passed_td').innerText == 'پاس نشده')? 0 :  1;
    // document.getElementById('cheque_passed').value  = chPassVal;alert(0);
    // var MPassVal = (tr.cells.namedItem('month_passed_td').innerText == 'پاس نشده')? 0 : 1;
    // document.getElementById('month_passed').value  = MPassVal;

    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0].innerHTML = '';
}



// $("#name").on("keyup", function () {
//     if ($(this).val() == 0) {
//         e.preventDefault();
        // $(this).val(null);
//     }
// });

function just_persian(source){
    str = source.value;
    var p = /^[\u0600-\u06FF\s]+$/;

    if (!p.test(str)) {
        source.value = null;
        // $(str).val(null);
        alert("فقط حروف فارسی قابل قبول است!");
    }
}

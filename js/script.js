// check box for passed cheque.....................
function toggle(source) {
    checkboxes = document.getElementsByName('users');
    for(var i=0;i<checkboxes.length;i++) {
        checkboxes[i].checked = source.checked;
    }
}

function add_reffered(source) {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    if(source.checked) {
        var len = tableRef.rows.length;
        var tr = source.parentNode.parentNode.parentNode.cloneNode(true);
        tr.cells.namedItem('chbxtd').innerHTML = 'حذف';
        tr.cells.namedItem('chbxtd').className = "deleteTd";
        tr.cells.namedItem('chbxtd').addEventListener("click", delete_record);
        tr.cells.namedItem('numTd').innerHTML = len+1;
        tableRef.appendChild(tr);
    }
    else {
        var mobile = source.parentNode.parentNode.parentNode.cells.namedItem('phoneTd').innerText;

        var len = tableRef.rows.length;
        for (var i = 0; i < len; i++) {
            var row = tableRef.rows[i];
            if(mobile == row.cells.namedItem('phoneTd').innerText){
                tableRef.removeChild(row);
                break;
            }
        }
        for (var i = 0; i < tableRef.rows.length; i++) {
            tableRef.rows[i].cells.namedItem('numTd').innerHTML = i+1;
        }
    }
}

function delete_record() {
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    var row = this.parentNode;
    tableRef.removeChild(row);
    for (var i = 0; i < tableRef.rows.length; i++) {
        tableRef.rows[i].cells.namedItem('numTd').innerHTML = i+1;
    }
}
// these are for ajax form submit..................
function get_referred() {
    var refs = '';
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    var len = tableRef.rows.length;
    for (var i = 0; i<len; i++) {
        var row = tableRef.rows[i];
        refs+=','+row.getElementsByClassName('username')[0].innerText;
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
        var username_search,name_search,phone_search;
        if(cls.indexOf('ref') == -1){
            username_search = $('#username_search').val();
            name_search = $('#name_search').val();
            phone_search = $('#phone_search').val();
        }else{
            username_search = $('#username_search_ref').val();
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
                username_search: username_search,
                name_search: name_search ,
                phone_search: phone_search,
                page: page
                // $sort_col: $('#sort_col').val()
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
    document.getElementsByClassName('buyselection')[0].style.display = 'flex';
    document.getElementsByClassName('buyselection')[0].style.justifyContent = 'space-around';
    document.getElementsByClassName('btn-primary')[0].style.display = 'none';
    document.getElementsByClassName('btn-secondary')[0].style.display = 'block';
    // for (var i = 0; i<len; i++) {
    //     var row = tableRef.rows[i];
    //     // alert(row.innerHTML);
    //     // alert(row.getElementsByClassName('username')[0].innerText);
    //
    // }
    document.getElementsByClassName('pull-me')[0].innerHTML = 'ویرایش';
    var tr = source.parentNode;
    // alert(source.parentNode.innerHTML);
    document.getElementById('username').value  = source.innerText;
    document.getElementById('name').value  = tr.cells.namedItem('nameTd').innerText;
    document.getElementById('mobile').value  = tr.cells.namedItem('phoneTd').innerText;
    document.getElementById('birth_date').value  = tr.cells.namedItem('birthTd').innerText;
    var cash = tr.cells.namedItem('buy_cash_td').innerText.split(",");// string to array
    document.getElementById('buy_cash').value  = cash[0];
    var month = tr.cells.namedItem('buy_2month_td').innerText.split(",");
    document.getElementById('buy_2month').value  = month[0];
    var cheque = tr.cells.namedItem('buy_cheque_td').innerText.split(",");
    document.getElementById('buy_cheque').value  = cheque[0];
    var gender = (tr.cells.namedItem('genderTd').innerText == 'مرد')? 0 :  1;
    document.getElementById('gender').value  = gender;
    // var chPassVal = (tr.cells.namedItem('cheque_passed_td').innerText == 'پاس نشده')? 0 :  1;
    // document.getElementById('cheque_passed').value  = chPassVal;alert(0);
    // var MPassVal = (tr.cells.namedItem('month_passed_td').innerText == 'پاس نشده')? 0 : 1;
    // document.getElementById('month_passed').value  = MPassVal;


    var referrd = tr.cells.namedItem('referredTd').innerText.split(",");
    var tableUser = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    var tableRef = document.getElementById('ref_table').getElementsByTagName('tbody')[0];
    for (var i = 0; i<= referrd.length-1; i++){ //alert(referrd[i]);

        // var len = tableUser.rows.length;
        // var tr = source.parentNode.parentNode.parentNode.cloneNode(true);
        // tr.cells.namedItem('chbxtd').innerHTML = 'حذف';
        // tr.cells.namedItem('chbxtd').className = "deleteTd";
        // tr.cells.namedItem('chbxtd').addEventListener("click", delete_record);
        // tr.cells.namedItem('numTd').innerHTML = len+1;
        // tableRef.appendChild(tr);
    }


    select = document.getElementById('buyTime');
    for (var i = 2; i<= cash.length; i++){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        select.appendChild(opt);
    }
}
document.getElementById("buyTime").addEventListener("change", change_buy_time);

// this is for edit form time of buy....................
function change_buy_time() {alert(this.value);
    var table = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    var tr = table.rows[this.value]; alert(tr.innerHTML);
    var cash = tr.cells.namedItem('buy_cash_td').innerText.split(",");alert(cash);
    document.getElementById('buy_cash').value  = cash[this.value];
    var month = tr.cells.namedItem('buy_2month_td').innerText.split(",");
    document.getElementById('buy_2month').value  = month[this.value];
    var cheque = tr.cells.namedItem('buy_cheque_td').innerText.split(",");
    document.getElementById('buy_cheque').value  = cheque[this.value];
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
        var password = generate_password();
        var referrd = get_referred(); //alert(referrd);
        $(".money").each(function() {
            var val = this.value;
            val = val.replace(/,/g, "");
            this.value = val;
            // alert(this.value);
        });

        $.ajax({
            type: 'post',
            url: 'userCreate.php',
            data: $('form').serialize()+'&'+$.param({ 'password': password, 'referred': referrd }),
            beforeSend: function() {
                $('#loading').css({'opacity':0.8});
                $("#loading").css("display","block");
            },
            success: function (data) {
                document.getElementById("message").innerHTML = data;
                document.getElementById("message").style.display = 'block';
                $("#loading").css("display","none");
                alert(data);
                show_list('','','','','created_at DESC');
            }
        });
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

    // search ajax input .................................
   $(".search").keyup(function() {
       var cls = this.className;
       var username_search,name_search,phone_search;
       if(cls.indexOf('ref') == -1){
           username_search = $('#username_search').val();
           name_search = $('#name_search').val();
           phone_search = $('#phone_search').val();
       }else{
           username_search = $('#username_search_ref').val();
           name_search = $('#name_search_ref').val();
           phone_search = $('#phone_search_ref').val();
       }
       show_list(cls,username_search,name_search,phone_search,'created_at DESC');
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


function show_list(cls,username_search,name_search,phone_search,sort_col) {
    $.ajax({
        type: "POST",
        url: "search.php",
        dataType : 'JSON',
        data: {
            username_search: username_search,
            name_search: name_search ,
            phone_search: phone_search,
            page: 1,
            sort_col: sort_col
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
            // $("#loading").css("display","none");
        }
    });
}

function sort(source){
    var col = $(source).data("col");
    // alert(col);
    show_list('','','','',col);
}


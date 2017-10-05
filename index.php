<?php
    include('include/session.php');
    include("include/db.php");
    include ("include/lib.php");
    include ("include/const.php");

    $row_per_page = ROW_PER_PAGE;
    $offset = 0;
    $sql = "SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC  LIMIT $row_per_page OFFSET $offset";
    $result = mysqli_query($db,$sql);

    $sql2 = "SELECT * FROM users WHERE deleted_at IS NULL";
    $result2 = mysqli_query($db,$sql2);
    $count = mysqli_num_rows($result2);
?>
<html>
   <head>
       <title>کیانیس </title>
       <!-- Including CSS file. -->
       <link rel="stylesheet" href="css\style.css">
       <link rel="stylesheet" href="css\table.css">
       <link rel="stylesheet" href="css\form.css">
   </head>

   <body lang="fa" dir="rtl">
       <div class="index-page">
         <div class="container">
           <div class="form-outer text-center d-flex align-items-center">

             <div class="form-inner">

              <div class="header">
                  <h1>خوش آمدید <?php echo $login_session; ?></h1>
                  <h2><a href = "logout.php">خروج</a></h2>
              </div>
<!--.................................................................................................................-->
                 <img src="images/add-user.png" class="add-user-img" onclick="save_cancle()" />
              <h2 class="pull-me">افزودن فرد جدید</h2>

              <div class="panel">
                  <div id="message"></div>
                  <div id="loading"><img src="images/loading.gif" /></div>
                  <div class="new-user">
                      <form id="user-form">
                          <input type="hidden" name="kian_fest_score" value="0" />
                          <div class="new-user-cols">
                              <div class="right-side">
                                  <div class="form-group">
                                      <label for="name" class="label-custom"  >نام </label>
                                      <input id="name" type="text" name="name" required="" ">
                                  </div>
                                  <div class="form-group">
                                      <label for="last_name" class="label-custom">نام خانوادگی</label>
                                      <input id="last_name" type="text" name="last_name" required="" ">
                                  </div>
                                  <div class="form-group">
                                      <label for="mobile" class="label-custom">تلفن</label>
                                      <input id="mobile" type="text" name="phone" min="11" maxlength="11" required="" pattern="\d+" onkeypress="just_number(event)">
                                  </div>
                              </div>


                              <div class="center-side">
                                  <div class="form-group genderselection">
                                      <label for="gender" class="label-custom-select">جنسیت</label>
                                      <div id="genderselection">
                                          <select id="gender" type="text" name="gender">
                                              <option value="0" selected>مرد</option>
                                              <option value="1">زن</option>
                                          </select>
                                      </div>
                                  </div>


                                  <link rel="stylesheet" href="js/jalalijscalendar-1.4/skins/aqua/theme.css">
                                  <script src="js/jalalijscalendar-1.4/jalali.js"></script>
                                  <script src="js/jalalijscalendar-1.4/calendar.js"></script>
                                  <script src="js/jalalijscalendar-1.4/calendar-setup.js"></script>
                                  <script src="js/jalalijscalendar-1.4/lang/calendar-fa.js"></script>

                                  <div class="form-group">
                                      <label for="birth_date" class="label-custom">تاریخ تولد</label>
                                      <input id="birth_date" type="text" name="birth_date" pattern="[0-9]{4}-(0[0-9]|1[012])-(0[0-9]|1[0-9]|2[0-9]|3[01])" maxlength="10">
                                      <img id="date_btn" src="images/cal.png" class="cal-img">
                                      <script>
                                          Calendar.setup({
                                              date: new Date("1989"),
                                              inputField: 'birth_date',
                                              button: 'date_btn',
                                              ifFormat: '%Y-%m-%d',
                                              dateType: 'jalali'
                                          });
                                      </script>
                                  </div>
                              </div>

                              <div class="left-side">
                                <div class="buying">
                                  <div class="form-group buyselection">
                                      <label for="gender" class="label-custom-select">خرید چندم </label>
                                      <div id="buyselection">
                                          <select id="buyTime" name="selectedBuy"></select>
                                      </div>
                                  </div>
                                  <a id="newBuy" onclick="new_buy()">خرید جدید</a>

                                </div>

                                  <div class="form-group by-cash">
                                      <label for="buy_cash" class="label-custom">خرید نقدی</label>
                                      <input id="buy_cash" type="text" name="buy_cash" class="money" pattern="[0-9,]*" onkeypress="just_number(event)">
                                      <label class="toman-label">تومان</label>
                                  </div>
                                  <div class="form-group">
                                      <div class="pass_chbx_div" >
                                          <label for="passed" class="label-custom-chbx">پاس شده</label>
                                          <input type="checkbox" id="passed" class="passed" name="2month_passed"/>
                                          <label for="passed" class="passed_label">شده</label>
                                      </div>
                                      <label for="buy_2month" class="label-custom label-custom-passed">خرید دو ماهه</label>
                                      <input id="buy_2month" type="text" name="buy_2month" class="money"  pattern="[0-9,]*" onkeypress="just_number(event)">
                                      <label class="toman-label">تومان</label>
                                  </div>


                                  <div class="form-group">
                                      <div class="pass_chbx_div" >
                                          <label for="passed_cheque" class="label-custom-chbx">پاس شده</label>
                                          <input type="checkbox" id="passed_cheque" class="passed" name="cheque_passed"/>
                                          <label for="passed_cheque" class="passed_label">شده</label>
                                      </div>
                                      <label for="buy_cheque" class="label-custom label-custom-passed">خرید چکی</label>
                                      <input id="buy_cheque" type="text" name="buy_cheque" class="money"  pattern="[0-9,]*"  onkeypress="just_number(event)">
                                      <label class="toman-label">تومان</label>
                                  </div>


                                  <a id="save_new_buy" class="insert btn btn-primary" onclick="save_new_buy(this)">ثبت خرید جدید</a>

                              </div>
                          </div>
                          <div class="extraBtn">
                              <a class="btn btn-primary insert"  id="myBtn">افزودن خریدار جهت معرفی</a>

                          </div>
<!--.................................................................................................................-->
                          <div class="refered">
                              <div class="text-uppercase"><h2>خریدار(های) معرفی شده توسط <span id="ref_table_title_get_name_input"></span></h2></div>
                              <!-- Search box. -->
                              <div class="search_field">
                                  <input id="name_search_ref"  class="search_ref" placeholder="جستجو با نام" />
                                  <input id="last_name_search_ref" class="search_ref" placeholder="جستجو با نام خانوادگی" />
                                  <input id="phone_search_ref" class="search_ref" placeholder="جستجو با شماره موبایل" />
                              </div>
                              <!-- .......... -->
                              <table class="table" id="ref_table">
                                  <thead>
                                  <tr>
                                      <th> حذف</th>
                                      <th>#</th>
                                      <th>نام</th>
                                      <th>نام خانوادگی</th>
                                      <th>موبایل</th>
                                      <th>جنسیت</th>
                                      <th>تاریخ تولد</th>
                                      <th>خرید چندم</th>
                                      <th>خرید نقد</th>
                                      <th>خرید دو ماهه</th>
                                      <th>پاس</th>
                                      <th>خرید چکی</th>
                                      <th>پاس</th>
                                      <th>جمع</th>
                                      <th>معرفی ها</th>
                                      <th>امتیاز</th>
                                  </tr>
                                  </thead>
                                  <tbody id="ref_results">
                                  <?php for($i=0; $i<5; $i++){ ?>
                                      <tr class="empty-row">
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                      </tr>
                                  <?php } ?>
                                  </tbody>
                              </table>
                              <div id="pagination_ref">
                                  <div class="cell_disabled" data-val="1" onclick="paging(this)"><span>اول</span></div>
                                  <div class="cell_disabled" data-val="1" onclick="paging(this)"><span>قبل</span></div>
                                  <div class="cell_disabled" data-val="1" onclick="paging(this)"><span>1</span></div>
                                  <div class="cell_disabled" data-val="2" onclick="paging(this)"><span>بعد</span></div>
                                  <div class="cell_disabled" data-val="" onclick="paging(this)"><span>آخر</span></div>
                              </div>
                              </div>
                          </div>
                          <!--.................................................................................................................-->

                          <div class="btns">
                              <button class = "btn btn-primary btn-block insert" id="save" type = "submit" onclick="this.form.submited=this.name;"
                                      name = "save">ثبت جدید</button>
                              <button class = "btn btn-secondary btn-block insert" type = "submit" onclick="this.form.submited=this.name;"
                                      name = "edit">ثبت ویرایش</button>
                              <a class="btn btn-primary cancel" onclick="save_cancle()">لغو عملیات</a>
                          </div>
                      </form>
                  </div>
              </div>
               <!--.................................................................................................................-->
               <!-- The Modal -->
               <div id="Modal_Form" class="modal">
                   <!-- Modal content -->
                   <div class="modal-content">
                           <span class="close">&times;</span>
                       <div class="modal-body">
                           <div class="form-inner">
                               <div id="ref_message"></div>
                               <h2>افزودن خریدار جدید و معرفی آن</h2>
                               <form id="ref-form">
                                   <div class="form-group">
                                       <label for="ref-name" class="label-custom">نام</label>
                                       <input id="ref-name" type="text" name="name" required="" pattern="[\u0600-\u06FF\s]*" onkeypress="just_persian(event)">
                                   </div>
                                   <div class="form-group">
                                       <label for="ref-lastname" class="label-custom" pattern="[\u0600-\u06FF\s]*" onkeypress="just_persian(event)">نام خانوادگی</label>
                                       <input id="ref-lastname" type="text" name="last_name" required="">
                                   </div>
                                   <div class="form-group">
                                       <label for="ref-phone" class="label-custom">تلفن</label>
                                       <input id="ref-phone" type="text" name="phone" required="" min="11" maxlength="11" required=""  onkeypress="just_number(event)">
                                   </div>
                                   <div id="message"></div>
                                   <button class = "btn btn-primary insert" type = "submit">ثبت معرف</button>
                               </form>
                           </div>
                       </div>
                   </div>

               </div>
<!--.................................................................................................................-->
       <div id="modal-add-ref-msg">

       </div>

      <div class="form-inner">
          <div class="logo text-uppercase"><h2>لیست کاربران</h2></div>
      <!-- Search box. -->
          <div class="search_field">
              <input type="text" id="name_search"  class="search" placeholder="جستجو با نام" />
              <input type="text" id="last_name_search" class="search" placeholder="جستجو با نام خانوادگی" />
              <input type="text"  id="phone_search" class="search" placeholder="جستجو با شماره موبایل" />
          </div>
      <!-- .......... -->
      <!-- filter box. -->
      <div class="filter_field">
          <div class="filter_div">
              <label for='customer'>خریدار</label>
              <div class='checkbox'>
                  <input type="radio" name="filter" checked id="customer"  class="filter" onclick="filter('100');"/>
                  <label for='customer'></label>
              </div>
          </div>
          <div class="filter_div">
              <label for='ref'>معرف</label>
              <div class='checkbox'>
                  <input type="radio" name="filter" checked id="ref"  class="filter" onclick="filter('010');" />
                  <label for='ref'></label>
              </div>
          </div>
          <div class="filter_div">
              <label for='customer_ref'>خریدار و معرف</label>
              <div class='checkbox'>
                  <input type="radio" name="filter" checked id="customer_ref"  class="filter" onclick="filter('001');" />
                  <label for='customer_ref'></label>
              </div>
          </div>
          <div class="filter_div">
              <label for='all'>همه</label>
              <div class='checkbox'>
                  <input type="radio" name="filter" checked id="all"  class="filter" onclick="filter('111');" />
                  <label for='all'></label>
              </div>
          </div>
      </div>
      <!-- .......... -->
                  <table class="table" id="userTable">
                    <thead>
                      <tr>
                          <th>انتخاب معرف</th>
                          <th>#</th>
                          <th data-col="name">
                              <div class="flex-center">
                                  نام
                                  <div class="sort-arrow-div">
                                      <img src="images/up.png" class="sort-arrow" onclick="sort(this)" data-type="ASC"/>
                                      <img src="images/down.png" class="sort-arrow" onclick="sort(this)" data-type="DESC">
                                  </div>
                              </div>
                          </th>
                          <th data-col="last_name" style="width: 88.75px;">
                              <div class="flex-center">
                                  نام خانوادگی
                                  <div class="sort-arrow-div">
                                      <img src="images/up.png" class="sort-arrow" onclick="sort(this)" data-type="ASC"/>
                                      <img src="images/down.png" class="sort-arrow" onclick="sort(this)" data-type="DESC">
                                  </div>
                              </div>                          </th>
                          <th data-col="phone">موبایل</th>
                          <th>جنسیت</th>
                          <th>تاریخ تولد</th>
                          <th>خرید چندم</th>
                          <th>خرید نقد</th>
                          <th>خرید دو ماهه</th>
                          <th>پاس</th>
                          <th>خرید چکی</th>
                          <th>پاس</th>
                          <th>جمع</th>
                          <th>معرفی ها</th>
                          <th data-col="score">
                              <div class="flex-center">
                                  امتیاز
                                  <div class="sort-arrow-div">
                                      <img src="images/up.png" class="sort-arrow" onclick="sort(this)" data-type="ASC"/>
                                      <img src="images/down.png" class="sort-arrow" onclick="sort(this)" data-type="DESC">
                                  </div>
                              </div>
                          </th>
                          <th>ویرایش</th>
                          <th>حذف</th>
                      </tr>
                    </thead>
                    <tbody id="results">
                      <?php
                        echo get_users_list($result,$row_per_page);
                      ?>
                    </tbody>
                  </table>

                    <div id="pagination">
                        <?php $page_count = ceil($count/$row_per_page); $page = 1; ?>
                        <div class="<?php if($page != 1) echo 'cell'; else echo 'cell_disabled'; ?>" data-val="1" onclick="paging(this)"><span>اول</span></div>
                        <div class="<?php if($page != 1) echo 'cell'; else echo 'cell_disabled'; ?>" data-val="1" onclick="paging(this)"><span>قبل</span></div>
                        <div class="cell_active" data-val="1" onclick="paging(this)"><span>1</span></div>
                        <?php
                        $pagination = '';
                        for ($i=2; $i<=$page_count; $i++) {
                            $pagination .= "<div class='cell' data-val='$i' onclick='paging(this)'><span> $i </span></div>";
                        }
                        echo $pagination;
                        ?>
                        <div class="<?php if($page_count > 1) echo 'cell'; else echo 'cell_disabled'; ?>" data-val="2" onclick="paging(this)"><span>بعد</span></div>
                        <div class="<?php if($page_count > 1) echo 'cell'; else echo 'cell_disabled'; ?>" data-val="<?php echo $page_count; ?>" onclick="paging(this)"><span>آخر</span></div>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>

       <!-- Including jQuery is required. -->
       <script type="text/javascript" src="js/google-ajax.js"></script>
       <!-- Including our scripting file. -->
       <script type="text/javascript" src="js/script.js"></script>
   </body>

</html>

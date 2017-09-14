<?php
   include('include/session.php');
  //  include("include/db.php");
    $row_per_page = 5;
    $offset = 0;
    $sql = "SELECT * FROM users ORDER BY created_at DESC  LIMIT $row_per_page OFFSET $offset";
    $result = mysqli_query($db,$sql);
    $sql2 = "SELECT * FROM users";
    $result2 = mysqli_query($db,$sql2);
    $count = mysqli_num_rows($result2);
?>
<html>

   <head>
       <title>کیانیس </title>
       <link rel="stylesheet" href="css\style.css">
       <link rel="stylesheet" href="css\table.css">
       <link rel="stylesheet" href="css\form.css">
       <!-- Including CSS file. -->
       <link rel="stylesheet" type="text/css" href="css/search.css">
   </head>

   <body lang="fa" dir="rtl">
       <div class="login-page">
         <div class="container">
           <div class="form-outer text-center d-flex align-items-center">

             <div class="form-inner">

              <div class="header">
                  <h1>خوش آمدید <?php echo $login_session; ?></h1>
                  <h2><a href = "logout.php">خروج</a></h2>
              </div>

              <h2><a class="pull-me">افزودن فرد جدید</a></h2>

              <div class="card-block panel">

                  <div id="message"></div>
                  <div id="loading"><img src="images/loading.gif" /></div>
                  <div class="new-user">
                      <form id="user-form">
                          <input type="hidden" name="kian_fest_score" value="0" />
                          <div class="new-user-cols">
                          <div class="right-side">
                              <div class="form-group">
                                  <label for="username" class="label-custom">نام کاربری</label>
                                  <input id="username" type="text" name="username" required="">
                              </div>
                              <div class="form-group">
                                  <label for="name" class="label-custom">نام و نام خانوادگی</label>
                                  <input id="name" type="text" name="name" required="">
                              </div>
                              <div class="form-group">
                                  <label for="mobile" class="label-custom">تلفن</label>
                                  <input id="mobile" type="text" name="phone" required="">
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
                                  <input id="birth_date" type="text" name="birth_date">
                                  <img id="date_btn" src="images/cal.png" class="cal-img">
                                  <script>
                                      Calendar.setup({
                                          inputField: 'birth_date',
                                          button: 'date_btn',
                                          ifFormat: '%Y-%m-%d',
                                          dateType: 'jalali'
                                      });
                                  </script>
                              </div>
                          </div>

                          <div class="left-side">
                              <div class="form-group buyselection">
                                  <label for="gender" class="label-custom-select">خرید چندم </label>
                                  <div id="buyselection">
                                      <select id="buyTime">
                                          <option value="1" selected>1</option>
                                      </select>
                                  </div>
                              </div>


                              <div class="form-group">
                                  <label for="buy_cash" class="label-custom">خرید نقدی</label>
                                  <input id="buy_cash" type="text" name="buy_cash" class="money">
                              </div>
                              <div class="form-group">
                                  <label for="buy_2month" class="label-custom">خرید دو ماهه</label>
                                  <input id="buy_2month" type="text" name="buy_2month" class="money">
                                  <div class="form-group pass_chbx_div" >
                                      <input type="checkbox" id="passed" class="passed" name="2month_passed"/>
                                      <label for="passed" class="passed_label">پاس شده</label>
                                  </div>
                              </div>


                              <div class="form-group">
                                  <label for="buy_cheque" class="label-custom">خرید با چک</label>
                                  <input id="buy_cheque" type="text" name="buy_cheque" class="money">
                                  <div class="form-group pass_chbx_div" >
                                      <input type="checkbox" id="passed_cheque" class="passed" name="cheque_passed"/>
                                      <label for="passed_cheque" class="passed_label">پاس شده</label>
                                  </div>
                              </div>




                          </div>
                          </div>
                          <div class="btns">
                              <button class = "btn btn-primary btn-block" type = "submit"
                                      name = "save">ثبت</button>
                              <button class = "btn btn-secondary btn-block" type = "submit"
                                      name = "edit">ویرایش</button>
                          </div>
                      </form>
                  </div>

                  <div class="refered">
                      <div class="logo text-uppercase"><span>لیست معرف ها</span></div>
                      <!-- Search box. -->
                      <div class="search_field">
                          <div>
                              <input type="text" id="name_search_ref"  class="search ref" placeholder="جستجو با نام" />
                              <!-- Suggestions will be displayed in below div. -->
                              <div ></div>
                          </div>
                          <!-- .......... -->
                          <!-- Search box. -->
                          <div>
                              <input type="text" id="username_search_ref" class="search ref" placeholder="جستجو با نام کاربری" />
                              <!-- Suggestions will be displayed in below div. -->
                              <div id="display"></div>
                          </div>
                          <!-- .......... -->
                          <!-- Search box. -->
                          <div>
                              <input type="text"  id="phone_search_ref" class="search ref" placeholder="جستجو با شماره موبایل" />
                              <!-- Suggestions will be displayed in below div. -->
                              <div ></div>
                          </div>
                      </div>
                      <!-- .......... -->
                      <table class="table" id="ref_table">
                          <thead>
                          <tr>
                              <th> </th>
                              <th>شماره</th>
                              <th>نام کاربری</th>
                              <th>نام</th>
                              <th>موبایل</th>
                              <th>جنسیت</th>
                              <th>تاریخ تولد</th>
                              <th>خرید نقد</th>
                              <th>خرید دو ماهه</th>
                              <th>پاس شدن خرید دو ماهه</th>
                              <th>خرید با چک</th>
                              <th>پاس شدن چک</th>
                              <th>معرفی ها</th>
                              <th>امتیاز</th>
                          </tr>
                          </thead>
                          <tbody id="ref_results">
                          <?php
//                          $i = 1;
//                          foreach ($res as $key => $value) {
//                              $id = $value['id'];
//                              echo '<tr>';
//                              echo  "<td scope='row'>";
//                              echo  "<div class='checkbox'><input type='checkbox' id='check$i' name='users'><label for='check$i'></label></div>";
//                              echo "</td>";
//                              echo  "<td scope='row'>";
//                              echo $i;
//                              echo "</td>";
//                              echo  "<td scope='row'><a href='detail.php?id=$id'>";
//                              echo $value['username'];
//                              echo "</a></td>";
//                              echo  "<td scope='row'>";
//                              echo $value['buy'];
//                              echo "</td>";
//                              echo  "<td scope='row'>";
//                              echo $value['referred'];
//                              echo "</td>";
//                              echo '</tr>';
//                              $i++;
//                          } ?>
                          </tbody>
                      </table>
                      <div id="paggination_ref"></div>
                  </div>
              </div>





      <div class="card-block">
          <div class="logo text-uppercase"><span>لیست خریداران</span></div>
      <!-- Search box. -->
          <div class="search_field">
              <div>
                   <input type="text" id="name_search"  class="search" placeholder="جستجو با نام" />
                   <!-- Suggestions will be displayed in below div. -->
                   <div ></div>
              </div>
              <!-- .......... -->
              <!-- Search box. -->
              <div>
                  <input type="text" id="username_search" class="search" placeholder="جستجو با نام کاربری" />
                  <!-- Suggestions will be displayed in below div. -->
                  <div id="display"></div>
              </div>
              <!-- .......... -->
              <!-- Search box. -->
              <div>
                  <input type="text"  id="phone_search" class="search" placeholder="جستجو با شماره موبایل" />
                  <!-- Suggestions will be displayed in below div. -->
                  <div ></div>
              </div>
          </div>
      <!-- .......... -->
                  <table class="table" id="userTable">
                    <thead>
                      <tr>
                          <th>
                              <div class="checkbox">
                                  <input type='checkbox' id="checkall" onClick="toggle(this)">
                                  <label for="checkall"></label>
                              </div>
                          </th>
                          <th>شماره</th>
                          <th>نام کاربری</th>
                          <th>نام</th>
                          <th onclick="sort(this)" data-col="phone">موبایل</th>
                          <th>جنسیت</th>
                          <th>تاریخ تولد</th>
                          <th>خرید نقد</th>
                          <th>خرید دو ماهه</th>
                          <th>پاس شدن خرید دو ماهه</th>
                          <th>خرید با چک</th>
                          <th>پاس شدن چک</th>
                          <th>معرفی ها</th>
                          <th>امتیاز</th>
                          <th>حذف</th>
                      </tr>
                    </thead>
                    <tbody id="results">
                      <?php
                      $i = 1;
                      foreach ($result as $key => $value) {
                        $id = $value['id'];
                        echo '<tr>';
                          echo  "<td scope='row' id='chbxtd'>";
                          echo  "<div class='checkbox tooltip'>
                                    <input type='checkbox' id='check$i' name='users' onclick='add_reffered(this)'>
                                    <label for='check$i'></label>
                                    <span class='tooltiptext'>اضافه به لیست معرفی ها</span>
                                 </div>";
                          echo "</td>";
                          echo  "<td scope='row' id='numTd'>";
                          echo $i;
                          echo "</td>";
                          echo  "<td scope='row' class='username' onclick='showInForm(this)'><a>";
                          echo $value['username'];
                          echo "</a></td>";
                          echo  "<td scope='row' id='nameTd'>";
                          echo $value['name'];
                          echo "</td>";
                          echo  "<td scope='row' id='phoneTd'>";
                          echo $value['phone'];
                          echo "</td>";
                          $gender = ($value['gender']==0) ? 'مرد' : 'زن';
                          echo  "<td scope='row' id='genderTd'>";
                          echo $gender;
                          echo "</td>";
                          echo  "<td scope='row' id='birthTd'>";
                          echo $value['birth_date'];
                          echo "</td>";
                          echo  "<td scope='row' id='buy_cash_td'>";
                          echo $value['buy_cash'];
                          echo "</td>";
                          echo  "<td scope='row' id='buy_2month_td'>";
                          echo $value['buy_2month'];
                          echo "</td>";
                          $month_passed = ($value['2month_passed']=='f') ? 'پاس نشده' : 'پاس شده';
                          echo  "<td scope='row' id='month_passed_td'>";
                          echo $month_passed;
                          echo "</td>";
                          echo  "<td scope='row' id='buy_cheque_td'>";
                          echo $value['buy_cheque'];
                          echo "</td>";
                          $cheque_passed = ($value['cheque_passed']=='f') ? 'پاس نشده' : 'پاس شده';
                          echo  "<td scope='row' id='cheque_passed_td'>";
                          echo $cheque_passed;
                          echo "</td>";
                          echo  "<td scope='row' id='referredTd'>";
                          echo $value['referred'];
                          echo "</td>";
                          echo  "<td scope='row' id='scoreTd'>";
                          echo $value['score'];
                          echo "</td>";
                          echo  "<td scope='row' id='delTd'>";
                          echo 'حذف';
                          echo "</td>";
                        echo '</tr>';
                        $i++;
                      } ?>
                    </tbody>
                  </table>

                    <div id="pagination">
                        <script></script>
                        <?php $page_count = ceil($count/$row_per_page); $page = 1; ?>
                        <div class="<?php if($page != 1) echo 'cell'; else echo 'cell_disabled'; ?>" data-val="1" onclick="paging(this)"><span>اول</span></div>
                        <div class="<?php if($page != 1) echo 'cell'; else echo 'cell_disabled'; ?>" data-val="<?php /*echo $page-1;*/ ?>" onclick="paging(this)"><span>قبل</span></div>
                        <div class="cell_active" data-val="1" onclick="paging(this)"><span>1</span></div>
                        <?php
                        $pagination = '';
                        for ($i=2; $i<=$page_count; $i++) {
                            $pagination .= "<div class='cell' data-val='$i' onclick='paging(this)'><span> $i </span></div>";
                        }
                        echo $pagination;
                        ?>
                        <div class="<?php if($page_count > 1 /*&& $page < $row_per_page*/) echo 'cell'; else echo 'cell_disabled'; ?>" data-val="<?php ;/*echo $page+1;*/ ?>2" onclick="paging(this)"><span>بعد</span></div>
                        <div class="<?php if($page_count > 1 /*&& $page < $row_per_page*/) echo 'cell'; else echo 'cell_disabled'; ?>" data-val="<?php echo $page_count; ?>" onclick="paging(this)"><span>آخر</span></div>
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>


       <!-- Including jQuery is required. -->
<!--       <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>-->
       <script type="text/javascript" src="js/google-ajax.js"></script>
       <!-- Including our scripting file. -->
       <script type="text/javascript" src="js/script.js"></script>
   </body>

</html>

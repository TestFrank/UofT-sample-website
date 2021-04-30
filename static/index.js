$(document).ready(function () {
  $(".grade-item-title .grade-content, .feedback-item-title .feedback-content, .remark-item-title .remark-content").click(function () {
    switchcount = 0;
    list = $(this).hasClass("grade-content") ? document.getElementById("list-grade") : $(this).hasClass("feedback-content") ?  document.getElementById("list-feedback") : document.getElementById("list-remark");
    switching = true, shouldSwitch = false;
    dir = ($(this).hasClass("asc")) ? "asc" : "desc";
    $(".grade-item-title").find("img").attr("src", "/static/img/tableicon.png");
    $(".feedback-item-title").find("img").attr("src", "/static/img/tableicon.png");
    $(".remark-item-title").find("img").attr("src", "/static/img/tableicon.png");
    $(this).find("img").attr("src", "/static/img/" + dir + ".png");

    while (switching) {
      switching = false;
      b = $(this).hasClass("grade-content") ? list.getElementsByClassName("grade-item") : $(this).hasClass("feedback-content") ? list.getElementsByClassName("feedback-item") : list.getElementsByClassName("remark-item");

      for (i = 0; i < (b.length - 1); i++) {
        shouldSwitch = false;

        if (dir == "asc") {
          if ($(this).attr("id") == "username" || $(this).attr("id") == "name" || $(this).attr("id") == "type") {
            if (b[i].querySelector("#" + $(this).attr("id")).innerHTML.toLowerCase() > b[i + 1].querySelector("#" + $(this).attr("id")).innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          } else if ($(this).attr("id") == "score" || $(this).attr("id") == "total") {
            if (Number(b[i].querySelector("#" + $(this).attr("id")).innerHTML.toLowerCase()) > Number(b[i + 1].querySelector("#" + $(this).attr("id")).innerHTML.toLowerCase())) {
              shouldSwitch = true;
              break;
            }
          } else if ($(this).attr("id") == "date") {
            date1 = new Date(b[i].querySelector("#date").innerHTML.substring(0, 6) + " " + new Date().getFullYear() + " " + b[i].querySelector("#date").innerHTML.substring(10, 15));
            date2 = new Date(b[i + 1].querySelector("#date").innerHTML.substring(0, 6) + " " + new Date().getFullYear() + " " + b[i + 1].querySelector("#date").innerHTML.substring(10, 15));
            if (b[i].querySelector("#date").innerHTML.substring(16, 18) == "PM") {
              date1.setTime(date1.getTime() + (12 * 60 * 60 * 1000));
            }
            if (b[i + 1].querySelector("#date").innerHTML.substring(16, 18) == "PM") {
              date2.setTime(date2.getTime() + (12 * 60 * 60 * 1000));
            }
            if (date1 > date2) {
              shouldSwitch = true;
              break;
            }
          }
        } else if (dir == "desc") {
          if ($(this).attr("id") == "username" || $(this).attr("id") == "name" || $(this).attr("id") == "type") {
            if (b[i].querySelector("#" + $(this).attr("id")).innerHTML.toLowerCase() < b[i + 1].querySelector("#" + $(this).attr("id")).innerHTML.toLowerCase()) {
              shouldSwitch = true;
              break;
            }
          } else if ($(this).attr("id") == "score" || $(this).attr("id") == "total") {
            if (Number(b[i].querySelector("#" + $(this).attr("id")).innerHTML.toLowerCase()) < Number(b[i + 1].querySelector("#" + $(this).attr("id")).innerHTML.toLowerCase())) {
              shouldSwitch = true;
              break;
            }
          } else if ($(this).attr("id") == "date") {
            date1 = new Date(b[i].querySelector("#date").innerHTML.substring(0, 6) + " " + new Date().getFullYear() + " " + b[i].querySelector("#date").innerHTML.substring(10, 15));
            date2 = new Date(b[i + 1].querySelector("#date").innerHTML.substring(0, 6) + " " + new Date().getFullYear() + " " + b[i + 1].querySelector("#date").innerHTML.substring(10, 15));
            if (b[i].querySelector("#date").innerHTML.substring(16, 18) == "PM") {
              date1.setTime(date1.getTime() + (12 * 60 * 60 * 1000));
            }
            if (b[i + 1].querySelector("#date").innerHTML.substring(16, 18) == "PM") {
              date2.setTime(date2.getTime() + (12 * 60 * 60 * 1000));
            }
            if (date1 < date2) {
              shouldSwitch = true;
              break;
            }
          }
        }
      }
      if (shouldSwitch) {
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
        switchcount++;
      }
    }

    if ($(this).hasClass("asc")) {
      $(this).removeClass("asc");
       $(this).addClass("desc");
    } else {
      $(this).removeClass("desc");
      $(this).addClass("asc");
    }
  });

  $(".edit-form, .feedback-form, .remark-form").submit(function () {
     return false;
  });

  function editButton() {
    $(".edit-username, .label-username").css("display", "none");
    $(".edit-submit").css("display", "inherit");
    $(".edit-submit").attr("disabled", false);
    $(".add-submit").css("display", "none");
    $(".add-submit").attr("disabled", true);
    $(".edit-submit").insertBefore($(".add-submit"));
    $(".edit-id").val($(this).attr("id")).text();
    $(".edit-username").find("option").attr("selected", false);
    $(".edit-username").find("#" + $(".username" + $(this).attr("id")).text()).attr("selected", true);
    $(".edit-name").val($(".name" + $(this).attr("id")).text());
    $(".edit-date").val($(".date" + $(this).attr("id")).text());
    $(".edit-score").val($(".score" + $(this).attr("id")).text());
    $(".edit-total").val($(".total" + $(this).attr("id")).text());
    $(".edit-type").val($(".type" + $(this).attr("id")).text());
    dateParse = Date.parse(new Date($(".edit-date").val().replace("by ", "")));
    $(".edit-date").daterangepicker({
      "singleDatePicker": true,
      "timePicker": true,
      "showDropdowns": true,
      "linkedCalendars": false,
      "autoUpdateInput": false,
      "showCustomRangeLabel": false,
      "startDate": (dateParse) ? $(".edit-date").val() : new Date(),
      "locale": {
        "format": "MMM DD by hh:mm A"
      }
    }, function(start) {
      $(".edit-date").val(start.format("MMM DD by hh:mm A"));
    });
    $(".edit-panel").css("display", "flex");
  }
  $(".edit-button").bind("click", editButton);

  $(".add").click(function () {
    $(".edit-username, .label-username").css("display", "inherit");
    $(".add-submit").css("display", "inherit");
    $(".add-submit").attr("disabled", false);
    $(".edit-submit").css("display", "none");
    $(".edit-submit").attr("disabled", true);
    $(".add-submit").insertBefore($(".edit-submit"));
    $(".edit-username, .edit-name, .edit-score, .edit-total, .edit-type").val("");
    $(".edit-id").val($(".add").attr("id"));
    date = new Date();
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    hour = date.getHours() % 12;
    hour = hour ? hour : 12;
    hour = (hour >= 10) ? hour : '0' + hour;
    minutes = (date.getMinutes() < 10) ? '0'+ date.getMinutes() : date.getMinutes();
    ampm = (date.getHours() < 12) ? "AM" : "PM";
    $(".edit-date").val(months[date.getMonth()] + " " + date.getDate() + " by " + hour + ":" + minutes + " " + ampm)
    $(".edit-date").daterangepicker({
      "singleDatePicker": true,
      "timePicker": true,
      "showDropdowns": true,
      "linkedCalendars": false,
      "autoUpdateInput": false,
      "showCustomRangeLabel": false,
      "startDate": date,
      "locale": {
        "format": "MMM DD by hh:mm A"
      }
    }, function(start) {
      $(".edit-date").val(start.format("MMM DD by hh:mm A"));
    });
    $(".edit-panel").css("display", "flex");
  });

  deleteItems = new Array();
  function deleteButton () {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteItems.push($(".grade-item#" + $(this).attr("id")));
      $(".grade-item#" + $(this).attr("id")).remove();
    }
  }
  $(".delete-button").bind("click", deleteButton);

  editItems = new Array();
  $(".edit-submit").click(function () {
    formValid = true;
    if ($(".edit-form").find(".edit-username").val() === '') {
      formValid = false
    }
    number = new RegExp("^\\d+$");
    if (!number.test($(".edit-form").find(".edit-score").val()) || !number.test($(".edit-form").find(".edit-total").val())) {
      formValid = false;
    }
    $(".edit-form input").each(function() {
        if ($(this).val() === '') {
          formValid = false;
        }
    });

    if (formValid) {
      $(".username" + $(".edit-id").val()).text($(".edit-username").val());
      $(".name" + $(".edit-id").val()).text($(".edit-name").val());
      $(".date" + $(".edit-id").val()).text($(".edit-date").val());
      $(".score" + $(".edit-id").val()).text($(".edit-score").val());
      $(".total" + $(".edit-id").val()).text($(".edit-total").val());
      $(".type" + $(".edit-id").val()).text($(".edit-type").val());
      $(".edit-panel").css("display", "none");
      editItems.push($(".grade-item#" + $(".edit-id").val()));
    }
  });

  addItems = new Array();
  $(".add-submit").click(function () {
    formValid = true;
    if ($(".edit-form").find(".edit-username").val() === '') {
      formValid = false
    }
    number = new RegExp("^\\d+$");
    if (!number.test($(".edit-form").find(".edit-score").val()) || !number.test($(".edit-form").find(".edit-total").val())) {
      formValid = false;
    }
    $(".edit-form input").each(function() {
        if ($(this).val() === '') {
          formValid = false;
        }
    });

    if (formValid) {
      id = $(".add").attr("id");
      gradeItem = $("<div class = 'grade-item' id = " + id + "></div>");
      username = $("<div class = 'username grade-content username" + id + "' id = 'username'>" + $(".edit-username").val() + "</div>");
      title = $("<div class = 'name grade-content name" + id + "' id = 'name'>" + $(".edit-name").val() + "</div>");
      date = $("<div class = 'date grade-content date" + id + "' id = 'date'>" + $(".edit-date").val() + "</div>");
      score = $("<div class = 'score grade-content score" + id + "' id = 'score'>" + $(".edit-score").val() + "</div>");
      total = $("<div class = 'total grade-content total" + id + "' id = 'total'>" + $(".edit-total").val() + "</div>");
      type = $("<div class = 'type grade-content type" + id + "' id = 'type'>" + $(".edit-type").val() + "</div>");
      action = $("<div class = 'action grade-content' id = 'action'><button class = 'edit-button' type = 'button' name = 'button' id = '" + id + "'>Edit</button><button class = 'delete-button' type = 'button' name = 'button' id = '" + id + "'>Delete</button></div>");
      gradeItem.append(username, title, date, score, total, type, action);
      $("#list-grade").append(gradeItem);
      addItems.push($(".grade-item#" + id));
      $(".edit-button").unbind();
      $(".edit-button").bind("click", editButton);
      $(".delete-button").unbind();
      $(".delete-button").bind("click", deleteButton);
      $(".add").attr("id", parseInt($(".add").attr("id")) + 1);
      $(".edit-panel").css("display", "none");
    }
  });

  $(".edit-cancel").click(function () {
    $(".edit-panel").css("display", "none");
  });

  $(".save").click(function () {
    $(".loading-screen").css("display", "flex");
    $(".loading-screen").find(".load-gif").fadeIn(0);
    $(".loading-screen").find(".done-png").fadeOut(0);
    setTimeout(function() {
      reqAdd = $.ajax({});
      reqUpdate = $.ajax({});
      reqDelete = $.ajax({});
      for (i = 0; i < addItems.length; i++) {
        id = addItems[i][0].id;
        username = addItems[i][0].querySelector(".username").innerHTML;
        name = addItems[i][0].querySelector(".name").innerHTML;
        date = addItems[i][0].querySelector(".date").innerHTML;
        score = addItems[i][0].querySelector(".score").innerHTML;
        total = addItems[i][0].querySelector(".total").innerHTML;
        type = addItems[i][0].querySelector(".type").innerHTML;

        reqAdd = $.ajax({
          url: "/save",
          type: "POST",
          data: {action: "add", id: id, username: username, name: name, date: date, score: score, total: total, type: type}
        });
      }
      reqAdd.done(function () {
        for (i = 0; i < editItems.length; i++) {
          id = editItems[i][0].id;
          username = editItems[i][0].querySelector(".username").innerHTML;
          name = editItems[i][0].querySelector(".name").innerHTML;
          date = editItems[i][0].querySelector(".date").innerHTML;
          score = editItems[i][0].querySelector(".score").innerHTML;
          total = editItems[i][0].querySelector(".total").innerHTML;
          type = editItems[i][0].querySelector(".type").innerHTML;

          reqUpdate = $.ajax({
            url: "/save",
            type: "POST",
            data: {action: "update", id: id, username: username, name: name, date: date, score: score, total: total, type: type}
          });
        }
      });

      reqUpdate.done(function () {
        for (i = 0; i < deleteItems.length; i++) {
          id = deleteItems[i][0].id;

          reqDelete = $.ajax({
            url: "/save",
            type: "POST",
            data: {action: "delete", id: id}
          });
        }
      });

      reqDelete.done(function () {
        $(".loading-screen").find(".done-png").fadeIn(500);
        $(".loading-screen").find(".load-gif").fadeOut(500);
        setTimeout(function () {
          $(".loading-screen").css("display", "none");
        }, 1000);

        addItems = new Array();
        editItems = new Array();
        deleteItems = new Array();
      });
    }, 500);
  });

  $(".cancel").click(function () {
    location.reload();
  });

  $(".remark-button").click(function () {
    $(".comments").val("");
    $(".remark-name").val($(".grade-content.name" + $(this).attr("id")).text());
    $(".remark-panel").css("display", "flex");
  });

  $(".remark-submit").click(function () {
    formValid = true;
    if ($(".comments").val() === "") {
      formValid = false;
    }

    if (formValid) {
      reqRemark = $.ajax({
        url: "/remark",
        type: "POST",
        data: {username: $(".remark-username").val(), name: $(".remark-name").val(), comments: $(".comments").val()}
      });

      reqRemark.done(function () {
        alert("Remark request submitted");
        $(".remark-panel").css("display", "none");
        $(".comments").val("");
      });
    }
  });

  $(".remark-cancel").click(function () {
    $(".remark-panel").css("display", "none");
  });

  $(".feedback-submit").click(function () {
    formValid = true;
    $("textarea[name = 'feedback']").each(function() {
      if ($(this).val() === "") {
        formValid = false;
      }
    });

    if (formValid) {
      questions = "";
      $("textarea[name = 'feedback']").each(function() {
        questions += $(this).val() + String.fromCharCode(31);
      });
      reqFeedback = $.ajax({
        url: "/feedback",
        type: "POST",
        data: {username: $(".username").val(), "choose-instructor": $(".choose-instructor").val(), feedback: questions}
      });

      reqFeedback.done(function() {
        $("textarea[name = 'feedback']").each(function() {
          $(this).val("");
        });
        alert("Thanks for your feedback!");
      })
    }
  });
});

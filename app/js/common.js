$(document).ready(function() {
  /*create datepicker*/
  function createDatepicker() {
    $("input[data-attr='birth-date-input']").datepicker({
      format: 'dd.mm.yyyy',
      icons: {
        rightIcon: '<img src="img/calendar-alt-regular.svg">'
      }
    });
  }
  createDatepicker();
  /*create datepicker*/

  /*valid*/
  function validForm() {
    $('.birth-date-input').mask('00.00.0000');
    $(".postcode-input").mask("#");
    $(".house-input").mask("#");
    $.validate({
      modules : 'security, date'
    });
    // $('.pretty').addClass('has-success');
  }
  validForm();
  /*valid*/

  /*send request post to reg 1*/
  /* START */
  const baseUrl = 'http://10.10.1.35:3010';
  const form = $('#pr-form');
  const tokenForm = $('#token-form');
  const visitorsForm = $('#visitors-form');
  const userInfoSection = $('.user-info-section');
  let visitorsFormEmail = '';
  let visitorsFormPostcode = '';
  let visitorsFormStreet = '';
  let visitorsFormHouse = '';

  // function getAge(born, now) {
  //   let birthday = new Date(now.getFullYear(), born.getMonth(), born.getDate());
  //   console.log('birthday', birthday);
  //   if (now >= birthday) {
  //     console.log('now >= birthday: ', now.getFullYear() - born.getFullYear());
  //     return now.getFullYear() - born.getFullYear();
  //   } else {
  //     console.log('!now >= birthday: ', now.getFullYear() - born.getFullYear());
  //     return now.getFullYear() - born.getFullYear() - 1;
  //   }
  // }

  function getAge(dob) {
    const ageMS = Date.now() - dob.getTime();
    const ageDate = new Date(ageMS);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  /**
   * @param stringDate {string} in format DD.MM.YYYY
   * @returns {Date}
   */
  function getDateFromString(stringDate) {
    return new Date(stringDate.split('.').reverse().join('-'));
  }

  /**
   *
   * @param stringDate {string} in format DD.MM.YYYY
   * @returns {number}
   */
  function getAgeFromStringDate(stringDate) {
    const date = getDateFromString(stringDate);
    return getAge(date);
  }

  form.submit(function(e) {
    e.preventDefault();
    let data = {
      "sex": form.find('.sex-input').val(),
      "firstName": form.find('.first-name-input').val(),
      "lastName": form.find('.last-name-input').val(),
      "birthDate": form.find('.birth-date-input').val(),
      "address": {
        "city": form.find('.city-input').val(),
        "street": form.find('.street-input').val(),
        "house": form.find('.house-input').val(),
        "postcode": form.find('.postcode-input').val()
      },
      "checkboxes": {
        "terms-1": form.find('.terms-first .terms-input').val(),
        "terms-2": form.find('.terms-second .terms-input').val(),
        "terms-3": form.find('.terms-third .terms-input').val()
      },
      "email": form.find('.email-input').val()
    };
    data = JSON.stringify(data);
    const now = new Date();
    let dob = $('body').find('.birth-date-input').val();
    dob = dob.split('.');
    let born = new Date(dob[0] + '-' +  dob[1] + '-' + dob[2]);
    let age = getAge(born, now);
    if (age >= 18) {
      $.ajax({
        url: '/T4000_EntitlementREST/services/client',
        type: "POST",
        data: data,
        contentType: 'application/json',
        dataType: 'json',
        complete: function(response, textStatus) {
          console.log('registration-form response:', response);
          if (response.status === 200) {
            form.toggle();
            form.prev().remove();
            setTimeout(function() {
              form.remove();
              // tokenForm.fadeIn();
              $('.redirect').show();
            }, 1000);
          } else if (response.status === 400) {
            alert('Email schon registriert');
          } else {
            alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
          }
        }
      });
    } else {
      $('.age-answer span').html('18');
      $('.age-answer').show();
      setTimeout(function() {
        $('.age-answer').hide();
      }, 2000);
    }
  });
  /*send request 1*/

  /*second step*/
  function getParamsURL() {
    let urlParams = new URLSearchParams(window.location.search);
    let userToken = urlParams.get('token');

    if (userToken !== null) {
      $.ajax({
        url: 'http://10.10.1.35:3010/T4000_EntitlementREST/services/client/confirm/'+userToken,
        type: "GET",
        contentType: 'application/json',
        dataType: 'json',
        complete: function (response) {
          if (response.status !== 200) {
            disableAllButtons();
            alert(response.responseText);
            return;
          }
          const msg = response.responseJSON;
          const bDate = (new Date(msg.birthDate)).toDateString();
          if (msg !== undefined) {
            $('.user-list__value-sex').html(msg.sex);
            $('.user-list__value-firstName').html(msg.firstName);
            $('.user-list__value-lastName').html(msg.lastName);
            visitorsFormStreet = $('.user-list__value-street').html(msg.address.street);
            // visitorsFormHouse = $('.user-list__value-house').html(msg.address.house);
            visitorsFormPostcode = $('.user-list__value-postcode').html(msg.address.postcode);
            $('.user-list__value-city').html(msg.address.city);
            $('.user-list__value-birthDate').html(bDate);
            visitorsFormEmail = $('.user-list__value-email').html(msg.email);
          } else {
            alert('sorry, try it later');
          }
        }
      });
    }
  }
  getParamsURL();
  /*second step*/


  /*third step*/
  // START
  let addFormStatus = false;
  setTimeout(function() {
    if (addFormStatus===false) {
      addFormStatus = true;

      const currVisForm = $('.visitors-wrapper').find('#visitors-form');

      $('.applicant .pretty input').trigger('click');
      checkboxStatus();
      $('.applicant .pretty').on('click', function() {
        checkboxStatus();
      });
      createDatepicker();
      // currVisForm.fadeIn();
      let urlParams = new URLSearchParams(window.location.search);
      let userToken = urlParams.get('token');
      if (userToken !== null) {
        $.ajax({
          url: 'http://10.10.1.35:3010/T4000_EntitlementREST/services/visitor/'+visitorsFormEmail.text(),
          type: "GET",
          contentType: 'application/json',
          dataType: 'json',
          complete: function(response, textStatus) {
            let tableRow = '';
            const arrResponse = response.responseJSON;
            $('.children-table tbody').empty();
            $.each(arrResponse, function (index, value) {
              tableRow += createVisitorRow(value);
            });
            // $.each(arrResponse, function (index, value) {
            //   tableRow += "<tr><td>"+value.firstName+"</td><td>"+value.lastName+"</td><td>"+value.birthDate+"</td><td>"+value.age+"</td><td><span class='delete'><img src='img/remove.svg' alt=''></span></td></tr>";
            // });
            $('.children-table tbody').append(tableRow);
            if (arrResponse != "") {
              $('.children').show();
            }
          }
        });
      }

      // validForm();
      visitsFormSubmit(currVisForm);
      // swimmersStatus();
    }
  }, 1000);

  function checkboxStatus() {
    const body = $('body');
    const statusCheckbox = $('[name=applicant-checkbox]');
    if (statusCheckbox.prop('checked')) {
      body.find('.email-input').val(visitorsFormEmail.text());
      body.find('.postcode-input').val(visitorsFormPostcode.text());
      body.find('.street-input').val(visitorsFormStreet.text());
      // body.find('.house-input').val(visitorsFormHouse.text());
    } else {
      body.find('.email-input').val('');
      body.find('.postcode-input').val('');
      body.find('.street-input').val('');
      body.find('.house-input').val('');
    }
  }

  function responseServer(age) {
    $.ajax({
      url: 'http://10.10.1.35:3010/T4000_EntitlementREST/services/visitor/'+visitorsFormEmail.text(),
      type: "GET",
      contentType: 'application/json',
      dataType: 'json',
      complete: function(response) {
        if (response.status === 200) {
          let item = response.responseJSON.map(function(item) {
            return item;
          });
          setTimeout(function() {
            // if (age <= 14 ) {
            //   let row = "<tr><td>"+item[0].firstName+"</td><td>"+item[0].lastName+"</td><td>"+item[0].birthDate+"</td><td><span class='delete'><img src='img/remove.svg' alt=''></span></td></tr>";
            //   $('.children-table tbody').append(row);
            // }
            let tableRow = '';
            $('.children-table tbody').empty();
            $.each(arrResponse, function (index, value) {
              tableRow += createVisitorRow(value);
            });
            $('.children-table tbody').append(tableRow);
            $('.body').find('#visitors-form')[0].reset();
            $('.visitors-answer').hide();
          }, 1500);
          $('.children').show();
          return false;
        } else if (response.status === 400) {
          alert("Visitor already exist");
          return false;
        } else {
          alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
          return false;
        }
      }
    });


  }
  $('body').on('click', '.delete', function () {
    let current = $(this);
    const data = {
      firstName: current.attr('data-first-name'),
      lastName: current.attr('data-last-name'),
      birthDate: current.attr('data-birth-date'),
    };
    $.ajax({
      url: 'http://10.10.1.35:3010/T4000_EntitlementREST/services/visitor/drop' + visitorsFormEmail.text(),
      type: "DELETE",
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      complete: function (response) {
        if (response.status === 200) {
          current.closest('tr').remove();
        }
      }
    })
  });

  function visitsFormSubmit(currVisForm) {
    $('body').on('click', '#visitors-form input[type=submit]', function (e) {
      e.preventDefault();
      $('.helper-input').val($(this).val());
      visitorsForm.submit();
    });
    visitorsForm.submit(function (e) {
      e.preventDefault();
      const dob = $('body').find('.birth-date-input').val();
      let age = getAgeFromStringDate(dob);
      let data = {
        "firstName": currVisForm.find('.first-name-input').val(),
        "lastName": currVisForm.find('.last-name-input').val(),
        "birthDate": currVisForm.find('.birth-date-input').val(),
        "sex": currVisForm.find('.sex-input').val(),
        "address": {
          "city": currVisForm.find('.city-input').val(),
          "street": currVisForm.find('.street-input').val(),
          "house": currVisForm.find('.house-input').val(),
          "postcode": currVisForm.find('.postcode-input').val()
        },
        "swimmer": currVisForm.find('.swimmer').val(),
        "swimmerClass": currVisForm.find('.course-input').val()
      };
      data = JSON.stringify(data);
      if (age <= 14) {
        $.ajax({
          url: '/T4000_EntitlementREST/services/visitor/one/' + visitorsFormEmail.text(),
          type: "POST",
          data: data,
          contentType: 'application/json',
          dataType: 'json',
          complete: function (response, textStatus) {
            if (response.status !== 200) {
              alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
              return false;
            } else if (response.status === 400) {
              alert("Visitor already exist");
              return false;
            } else {
              addFormStatus = false;
              const body = $('body');
              // body.find('#visitors-form').fadeOut();
              body.find('.visitors-answer').fadeIn();
              setTimeout(function () {
                body.find('.visitors-answer').fadeOut();
              }, 1200);
              responseServer();
            }
          }
        });
      } else {
        $('.age-answer span').html('14');
        $('.age-answer').show();
        setTimeout(function () {
          $('.age-answer').hide();
        }, 2000);
      }
    });
  }

  function createVisitorRow(visitor) {
    return "<tr>" +
      "<td>" + visitor.firstName + "</td>" +
      "<td>" + visitor.lastName + "</td>" +
      "<td>" + visitor.birthDate + "</td>" +
      "<td>" + getAgeFromStringDate(visitor.birthDate) + "</td>" +
      "<td>" +
      "<span class='delete' data-first-name=\"" + visitor.firstName + "\" data-last-name=\"" + visitor.lastName + "\" data-birth-date=\"" + visitor.birthDate + "\">" +
      "<img src='img/remove.svg' alt=''>" +
      "</span>" +
      "</td>" +
      "</tr>";
  }

  $('#complete-btn').click(function () {
    $.ajax({
      url: 'http://10.10.1.35:3010/T4000_EntitlementREST/services/visitor/send/' + visitorsFormEmail.text(),
      type: "PUT",
      contentType: 'application/json',
      dataType: 'json',
      complete: function (response) {
        if (response.status !== 200) {
          alert(response.responseText);
        } else {
          $.ajax({
            url: 'http://10.10.1.35:3010/T4000_EntitlementREST/services/client/drop/' + visitorsFormEmail.text(),
            type: "DELETE",
            contentType: 'application/json',
            dataType: 'json',
            complete: function () {
              disableAllButtons();
            }
          });
        }
      }
    });
  });

  function disableAllButtons() {
    $('.pr-form-submit').attr('disabled', true);
    $('.delete').attr('disabled', true);
  }
  /*third step*/
});
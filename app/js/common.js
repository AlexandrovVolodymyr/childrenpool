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
    // $('.birth-date-input').mask('0000-00-00');
    $('.birth-date-input').mask('00.00.0000');
    $(".postcode-input").mask("#");
    $.validate({
      modules : 'security, date'
    });
    $('.pretty').addClass('has-success');
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

  function getAge(born, now) {
    let birthday = new Date(now.getFullYear(), born.getMonth(), born.getDate());
    console.log('birthday', birthday);
    if (now >= birthday) {
      console.log('now >= birthday: ', now.getFullYear() - born.getFullYear());
      return now.getFullYear() - born.getFullYear();
    } else {
      console.log('!now >= birthday: ', now.getFullYear() - born.getFullYear());
      return now.getFullYear() - born.getFullYear() - 1;
    }
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
    console.log('registration-form data: ', data);

    const now = new Date();
    let dob = $('body').find('.birth-date-input').val();
    dob = dob.split('.');
    let born = new Date(dob[0] + '-' +  dob[1] + '-' + dob[2]);
    let age = getAge(born, now);
    if (age >= 18) {
      $.ajax({
        url: `/T4000_EntitlementREST/services/client`,
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
          } else {
            alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
          }
        }
      });
    } else {
      $('.age-answer span').html('18');
      $('.age-answer').show();
      setTimeout(() => {
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
        url: `/T4000_EntitlementREST/services/client/confirm/${userToken}`,
        type: "GET",
        contentType: 'application/json',
        dataType: 'json',
        complete: function (response) {
          const msg = response.responseJSON;
          const bDate = (new Date(msg.birthDate)).toDateString();
          if (msg !== undefined) {
            $('.user-list__value-sex').html(msg.sex);
            $('.user-list__value-firstName').html(msg.firstName);
            $('.user-list__value-lastName').html(msg.lastName);
            visitorsFormStreet = $('.user-list__value-street').html(msg.address.street);
            visitorsFormHouse = $('.user-list__value-house').html(msg.address.house);
            visitorsFormPostcode = $('.user-list__value-postcode').html(msg.address.postcode);
            $('.user-list__value-city').html(msg.address.city);
            $('.user-list__value-birthDate').html(bDate);
            visitorsFormEmail = $('.user-list__value-email').html(msg.email);
          } else {
            console.log('msg: ', msg);
            alert('sorry, try it later');
          }
        }
      });
    }
  }
  getParamsURL();
  /*second step*/


  /*third step*/
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
      // if (userToken !== null) {
      //   $.ajax({
      //     url: `/T4000_EntitlementREST/services/client/confirm/${userToken}`,
      //     type: "GET",
      //
      //     contentType: 'application/json',
      //     dataType: 'json',
      //     complete: function(response, textStatus) {
      //       let item = response.responseJSON.map((item) => {
      //         return item;
      //       });
      //       let row = `<tr><td>${item[0].firstName}</td><td>${item[0].lastName}</td><td>${item[0].birthDate}</td></tr>`;
      //       $('.children-table tbody').append(row);
      //     }
      //   });
      // }


      visitsFormSubmit(currVisForm);
      validForm();
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
      body.find('.house-input').val(visitorsFormHouse.text());
    } else {
      body.find('.email-input').val('');
      body.find('.postcode-input').val('');
      body.find('.street-input').val('');
      body.find('.house-input').val('');
    }
  }

  function responseServer(age) {
    $.ajax({
      url: `/T4000_EntitlementREST/services/visitor/${visitorsFormEmail.text()}`,
      type: "GET",
      contentType: 'application/json',
      dataType: 'json',
      complete: function(response) {
        if (response.status === 200) {
          let item = response.responseJSON.map((item) => {
            return item;
          });
          let row = `<tr><td>${item[0].firstName}</td><td>${item[0].lastName}</td><td>${item[0].birthDate}</td></tr>`;
          setTimeout(() => {

            if (age <=14 ) {
              $('.children-table tbody').append(row);
            }
            $('.body').find('#visitors-form')[0].reset();
            $('.visitors-answer').hide();
          }, 1500);
          $('.children').show();
        } else if (response.status === 400) {
          alert("Visitor already exist");
        } else {
          alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
        }
      }
    })
  }

  function visitsFormSubmit(currVisForm) {
    $('.kind-add-btn').on('click', function(e) {
      currVisForm.submit(function(e) {
        e.preventDefault();
        let dob = $('body').find('.birth-date-input').val();
        dob = dob.split('.');
        let born = new Date(dob[0] + '-' +  dob[1] + '-' + dob[2]);
        const now = new Date();
        let age = getAge(born, now);
        console.log('kind age', age);
        if (age <= 14) {
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
          $.ajax({
            url: `/T4000_EntitlementREST/services/visitor/one/${visitorsFormEmail.text()}`,
            type: "POST",
            data: data,
            contentType: 'application/json',
            dataType: 'json',
            complete: function( response, textStatus ) {
              if (response.status === 200) {
                addFormStatus = false;
                const body = $('body');
                // body.find('#visitors-form').fadeOut();
                // body.find('.visitors-answer').fadeIn();
                // setTimeout(() => {
                //   body.find('.visitors-answer').fadeOut();
                // }, 1200);
                responseServer(age);
              } else if (response.status === 400) {
                alert("Visitor already exist");
                return false;
              } else {
                alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
                return false;
              }
            }
          });
        } else {
          $('.age-answer').show();
          setTimeout(() => {
            $('.age-answer').hide();
          }, 2000);
        }
      });
    });

    $('.all-add-btn').on('click', function(e) {
      e.preventDefault();
      // currVisForm.submit(function(e) {
      //   e.preventDefault();
      //
      //   let dob = $('body').find('.birth-date-input').val();
      //
      //   dob = dob.split('.');
      //   let born = new Date(dob[0] + '-' +  dob[1] + '-' + dob[2]);
      //   const now = new Date();
      //   let age = getAge(born, now);
      //
      //   let data = [{
      //     "firstName": currVisForm.find('.first-name-input').val(),
      //     "lastName": currVisForm.find('.last-name-input').val(),
      //     "birthDate": currVisForm.find('.birth-date-input').val(),
      //     "sex": currVisForm.find('.sex-input').val(),
      //     "address": {
      //       "city": currVisForm.find('.city-input').val(),
      //       "street": currVisForm.find('.street-input').val(),
      //       "house": currVisForm.find('.house-input').val(),
      //       "postcode": currVisForm.find('.postcode-input').val()
      //     },
      //     "swimmer": currVisForm.find('.swimmer').val(),
      //     "swimmerClass": currVisForm.find('.course-input').val()
      //   }];
      //   data = JSON.stringify(data);
      //
      //   $.ajax({
      //     url: `/T4000_EntitlementREST/services/visitor/all/${visitorsFormEmail.text()}`,
      //     type: "POST",
      //     data: data,
      //     contentType: 'application/json',
      //     dataType: 'json',
      //     complete: function( response, textStatus ) {
      //       if (response.status !== 200) {
      //         alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
      //       } else {
      //         addFormStatus = false;
      //         const body = $('body');
      //         body.find('.btn-add').removeClass('disabled');
      //         // body.find('#visitors-form').fadeOut();
      //         body.find('.visitors-answer').fadeIn();
      //
      //         console.log('child date', body.find('#visitors-form .birth-date-input').val());
      //
      //         responseServer();
      //       }
      //     }
      //   });
      // });
    });

  }
  /*third step*/

/*
old code


  /*token form*/
  /*tokenForm.submit(function(e) {
    e.preventDefault();
    getToken();
  });
  /*token form*/

  /*$('.can-authorize__link').on('click', function(e) {
    e.preventDefault();
    form.toggle();
    form.prev().remove();
    setTimeout(function() {
      form.remove();
      // tokenForm.fadeIn();
    }, 1000);
  });

  /*get token, customer*/
  /*function getToken() {
    const token = $('.token-form__input').val();
    $.ajax({
      url: `/T4000_EntitlementREST/services/client/${token}`,
      data: form,
      type: "GET",
      contentType: 'application/json',
      dataType: 'json',
      complete: function (response) {
        if (response.status !== 200) {
          alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
        } else {
          const msg = response.responseJSON;
          tokenForm.fadeOut();
          setTimeout(function() {
            userInfoSection.fadeIn();
            userInfoSection.closest('.pr-section').add('.visitors-section');
          }, 1000);

          // const dateFromServer = new Date(dateConverter(msg.birthDate));
          // let year = dateFromServer.getFullYear();
          // let month = dateFromServer.getMonth() + 1;
          // let day = dateFromServer.getDay();

          // if (month < 9) { month = '0' + month + 1; }
          // if (day < 9) { day = '0' + day; }
          // const dateToHtml = day + '.' + month + '.' + year;

          if (msg !== 'undefined') {
            $('.user-list__value-firstName').html(msg.firstName);
            $('.user-list__value-lastName').html(msg.lastName);
            $('.user-list__value-birthDate').html(new Date(msg.birthDate));
            $('.user-list__value-sex').html(msg.sex);
            $('.user-list__value-city').html(msg.address.city);
            $('.user-list__value-street').html(msg.address.street);
            $('.user-list__value-house').html(msg.address.house);
            visitorsFormEmail = $('.user-list__value-email').html(msg.email);
          } else {
            alert('sorry, try it later');
          }
        }
      }
    });
  }

  /*swimmer / nonswimmer ?*/
  /*
  function swimmersStatus() {
    $('.swimmers-true input').change(function() {
      if (this.value === "on") {
        $(this).closest('.swimmers').next().addClass('open');
      }
    });
    $('.swimmers-false input').change(function() {
      if (this.value === "on") {
        $(this).closest('.swimmers').next().removeClass('open');
      }
    });
  }
  // swimmersStatus();
  /*swimmer / nonswimmer ?*/
  /*get token, customer*/

  function checkboxStatusStatic() {
    const body = $('body');
    const statusCheckbox = $('[name=applicant-checkbox]');
    if (statusCheckbox.prop('checked')) {
      body.find('.email-input').val('test@gmail.com');
      body.find('.postcode-input').val('666');
      body.find('.street-input').val('test street');
      body.find('.house-input').val('test house');
    } else {
      body.find('.email-input').val('');
      body.find('.postcode-input').val('');
      body.find('.street-input').val('');
      body.find('.house-input').val('');
    }
  }

});
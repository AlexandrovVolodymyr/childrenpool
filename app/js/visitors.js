$(document).ready(function() {
  /*valid*/
  function validForm() {
    $('.birth-date-input').mask('0000-00-00');
    $(".postcode-input").mask("#");
    $.validate({
      modules : 'date'
    });
    $('.pretty').addClass('has-success');
  }
  validForm();
  /*valid*/

  /*add form*/
  $('.adds-form__link').on('click', function(e) {
    e.preventDefault();
    cloneF();
    validForm();
    swimmersStatus();
  });
  let countForm = 0;
  function cloneF() {
    countForm++;
    /*clone form*/
    const implementedForm = $('#current-form').clone().addClass('implemented-form');
    /*create new name for radio*/
    $("input[type='radio']", implementedForm).prop("name", "swimmer-" + countForm);

    /*delete form*/
    const removeFormIcon = document.createElement('img');
    removeFormIcon.setAttribute('src', 'img/remove.svg');
    removeFormIcon.classList.add('implemented-form__icon');

    const showDescIcon = document.createElement('span');
    showDescIcon.innerHTML = "Sie können dieses Formular bei Bedarf entfernen";
    showDescIcon.classList.add('implemented-form__desc');

    const formRow = document.createElement('div');
    formRow.append(removeFormIcon);
    formRow.append(showDescIcon);
    formRow.classList.add('implemented-form__row');
    /*delete form*/

    implementedForm.prepend(formRow);
    implementedForm.hide();
    implementedForm.find('.help-block').remove();
    implementedForm.find('.pr-form__row').removeClass('has-error');
    implementedForm.find('input').removeClass('error');
    implementedForm.find('input').css('border', '1px solid #ccc');
    $('.created-form').append(implementedForm);
    implementedForm.fadeIn();
  }

  /*remove-form*/
  $('body').on('click', '.implemented-form__icon', function() {
    $(this).closest('.implemented-form').remove();
  });
  /*remove-form*/

  /*swimmer / nonswimmer ?*/
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
  swimmersStatus();
  /*swimmer / nonswimmer ?*/
});

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

// function checkboxStatusStatic() {
//   const body = $('body');
//   const statusCheckbox = $('[name=applicant-checkbox]');
//   if (statusCheckbox.prop('checked')) {
//     body.find('.email-input').val('test@gmail.com');
//     body.find('.postcode-input').val('666');
//     body.find('.street-input').val('test street');
//     body.find('.house-input').val('test house');
//   } else {
//     body.find('.email-input').val('');
//     body.find('.postcode-input').val('');
//     body.find('.street-input').val('');
//     body.find('.house-input').val('');
//   }
// }
/*
visitorsForm.submit(function (e) {
    e.preventDefault();
    let dob = $('body').find('.birth-date-input').val();
    // dob = dob.split('.');
    // let born = new Date(dob[0] + '-' +  dob[1] + '-' + dob[2]);
    // const now = new Date();
    // let age = getAge(born, now);
    let age = getAgeFromStringDate(dob);
    console.log('kind age', age);
    if ($('.helper-input').val() === '+ weiteres Kind erfassen') {
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
          url: '/T4000_EntitlementREST/services/visitor/one/'+visitorsFormEmail.text(),
          type: "POST",
          data: data,
          contentType: 'application/json',
          dataType: 'json',
          complete: function( response, textStatus ) {
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
              setTimeout(function() {
                body.find('.visitors-answer').fadeOut();
              }, 1200);
              responseServer(age);
            }
          }
        });
      } else {
        $('.age-answer span').html('14');
        $('.age-answer').show();
        setTimeout(function() {
          $('.age-answer').hide();
        }, 2000);
      }
    } else {
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
      $.ajax({
        url: '/T4000_EntitlementREST/services/visitor/all/'+visitorsFormEmail.text(),
        type: "POST",
        data: data,
        contentType: 'application/json',
        dataType: 'json',
        complete: function( response, textStatus ) {
          if (response.status !== 200) {
            alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
          } else if (response.status === 400) {
            alert("Visitor already exist");
            return false;
          } else {
            addFormStatus = false;
            const body = $('body');
            body.find('.visitors-answer').fadeIn();

            responseServer(age);
          }
        }
      });
    }

  });
* */
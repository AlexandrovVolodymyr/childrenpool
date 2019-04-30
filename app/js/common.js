$(document).ready(function() {
  $("input[data-attr='birth-date-input']").datepicker();
  /*valid*/
  function validForm() {
    // $('.birth-date-input').mask('0000-00-00');
    $(".postcode-input").mask("#");
    $.validate({
      modules : 'date'
    });
    $('.pretty').addClass('has-success');
  }
  validForm();
  /*valid*/
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

  /*send request post to reg 1*/
  const baseUrl = 'http://10.10.1.35:3020';
  const form = $('#pr-form');
  const tokenForm = $('#token-form');
  const visitorsForm = $('#visitors-form');
  const userInfoSection = $('.user-info-section');
  let visitorsFormEmail = '';

  form.submit(function(e) {
    e.preventDefault();
    let data = {
      "firstName": form.find('.first-name-input').val(),
      "lastName": form.find('.last-name-input').val(),
      "birthDate": form.find('.birth-date-input').val(),
      "sex": form.find('.last-name-input').val(),
      "address": {
        "city": form.find('.city-input').val(),
        "street": form.find('.street-input').val(),
        "house": form.find('.house-input').val(),
        "postcode": form.find('.postcode-input').val()
      },
      "email": form.find('.email-input').val()
    };
    data = JSON.stringify(data);

    $.ajax({
      url: `${baseUrl}/T4000_ChildrenAdmission/services/children/customer`,
      type: "POST",
      data: data,
      contentType: 'application/json',
      dataType: 'json',
      complete: function(response, textStatus) {
        if (response.status === 200) {
          form.toggle();
          form.next().fadeIn();
          setTimeout(function() {
            form.next().remove();
            form.remove();
            tokenForm.fadeIn();
          }, 3000);
        } else {
          alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
        }
      }
    });
  });
  /*send request 1*/

  /*token form*/
  tokenForm.submit(function(e) {
    e.preventDefault();
    getToken();
  });
  /*token form*/

  /*get token, customer*/
  function getToken() {
    const token = $('.token-form__input').val();
    $.ajax({
      url: `${baseUrl}/T4000_ChildrenAdmission/services/children/customer/confirm/${token}`,
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
          if (msg !== 'undefined') {
            $('.user-list__value-firstName').html(msg.firstName);
            $('.user-list__value-lastName').html(msg.lastName);
            $('.user-list__value-birthDate').html(msg.birthDate);
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
  /*get token, customer*/

  /*show form*/
  let addFormStatus = false;
  if (addFormStatus===false) {
    $('.btn-add').on('click', function(e) {
      e.preventDefault();
      addFormStatus = true;
      $(this).addClass('disabled');
      const newFormTemplate = `<form class="pr-form" id="visitors-form" novalidate>
            <div class="current-form" id="current-form">
              <div class="pr-form__row">
                <label class="pr__text">Vorname*</label>
                <input type="text" class="pr__input first-name-input" placeholder="Vorname"
                       name="firstName"
                       required="required"
                       data-validation="length"
                       data-validation-error-msg="Der Eingabewert muss zwischen 1 und 50 Zeichen betragen"
                       data-validation-length="1-25">
              </div>
              <div class="pr-form__row">
                <label class="pr__text">Nachname*</label>
                <input type="text" class="pr__input last-name-input" placeholder="Nachname"
                       name="lastName"
                       required="required"
                       data-validation="length"
                       data-validation-error-msg="Der Eingabewert muss zwischen 1 und 50 Zeichen betragen"
                       data-validation-length="1-25">
              </div>
              <div class="pr-form__row">
                <label class="pr__text">Geburtstag*</label>
                <input id="datepicker2" class="pr__input hasDatepicker birth-date-input" placeholder="Geburtstag"
                   data-attr="birth-date-input"
                   data-validation-error-msg="Sie haben kein korrektes Datum angegeben"
                   data-validation="required">
              </div>
              <div class="pr-form__row">
                <label class="pr__text">Mail Adresse*</label>
                <input type="text" placeholder="Mail" class="pr__input email-input"
                       name="email"
                       data-validation="email"
                       data-validation-error-msg="Sie haben keine korrekte E-Mail-Adresse angegeben"
                       required="required">
              </div>
              <div class="pr-form__row select-gender">
                <label for="sex2" class="pr__text">Anrede*</label>
                <select name="sex" id="sex2" class="pr__input pr__select sex-input"
                        required="required">
                  <option value="0" selected>Herr</option>
                  <option value="1">Frau</option>
                  <option value="2">Divers</option>
                </select>
              </div>
              <div class="pr-form__row current-address">
                <label class="pr__text">Stadt*</label>
                <input type="text" placeholder="Stadt" class="pr__input city-input"
                       name="city"
                       required="required"
                       data-validation="length"
                       data-validation-error-msg="Der Eingabewert muss zwischen 1 und 50 Zeichen betragen"
                       data-validation-length="1-50">
              </div>
              <div class="pr-form__row current-address">
                <label class="pr__text">Straße<span>*</span></label>
                <input type="text" placeholder="Straße" class="pr__input street-input"
                       name="street"
                       required="required"
                       data-validation="length"
                       data-validation-error-msg="Der Eingabewert muss zwischen 1 und 50 Zeichen betragen"
                       data-validation-length="1-50">
              </div>
              <div class="pr-form__row current-address">
                <label class="pr__text">Haus<span>*</span></label>
                <input type="text" placeholder="Haus" class="pr__input house-input"
                       name="house"
                       required="required"
                       data-validation="length"
                       data-validation-error-msg="Der Eingabewert muss zwischen 1 und 50 Zeichen betragen"
                       data-validation-length="1-50">
              </div>
              <div class="pr-form__row current-address">
                <label class="pr__text">Postleitzahl<span>*</span></label>
                <input type="text" placeholder="Postleitzahl" class="pr__input postcode-input"
                       name="postcode"
                       data-validation="number"
                       data-validation-allowing="float"
                       data-validation-error-msg="Sie haben keine korrekte Nummer angegeben"
                       required="required">
              </div>
              <div class="pr-form__row swimmers">
                <label class="pr__text">Swimmers</label>
                <div class="swimmers-status" id="swimmers-status">
                  <div class="pretty p-default p-curve swimmers-true">
                    <input type="radio" name="swimmer"
                           data-validation="required"
                           data-validation-error-msg="Sie müssen einen Schwimmer wählen oder nicht"/>
                    <div class="state p-info-o">
                      <label>
                        <span class="swimmers__text">Yes</span>
                      </label>
                    </div>
                  </div>
                  <div class="pretty p-default p-curve swimmers-false">
                    <input type="radio" name="swimmer"
                           data-validation="required"
                           data-validation-error-msg="Sie müssen einen Schwimmer wählen oder nicht"/>
                    <div class="state p-info-o">
                      <label>
                        <span class="swimmers__text">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pr-form__row swimmers-category">
                <label class="pr__text">Kategorie</label>
                <input type="text" class="swimmers-category-input pr__input" placeholder="Kategorie"
                       name="swimmerClass"
                       data-validation="length"
                       data-validation-error-msg="Der Eingabewert muss zwischen 1 und 50 Zeichen betragen"
                       data-validation-length="1-50">
              </div>
            </div>
  
            <div class="created-form"></div>
  
            <div class="pr-form__row terms">
              <div class="terms-first">
                <div class="pretty p-default p-curve">
                  <input type="checkbox" name="terms" data-validation="required"
                         data-validation-error-msg="Sie müssen unseren Allgemeinen Geschäftsbedingungen zustimmen"/>
                  <div class="state p-info">
                    <label>
                      <a href="" class="terms__text" data-toggle="modal" data-target="#exampleModal">Geschäftsbedingungen*</a>
                    </label>
                  </div>
                </div>
              </div>
              <div class="terms-second">
                <div class="pretty p-default p-curve">
                  <input type="checkbox" name="police" data-validation="required"
                         data-validation-error-msg="Sie müssen unserer Datenschutzerklärung zustimmen"/>
                  <div class="state p-info">
                    <label>
                      <a href="" class="terms__text" data-toggle="modal" data-target="#exampleModal">Datenschutz-Bestimmungen*</a>
                    </label>
                  </div>
                </div>
              </div>
              <div class="terms-third">
                <div class="pretty p-default p-curve">
                  <input type="checkbox" name="parent" data-validation="required"
                         data-validation-error-msg="Bist du ein Elternteil?"/>
                  <div class="state p-info">
                    <label>
                      <a href="" class="terms__text">Elternteil*</a>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="pr-form__row">
              <input type="submit" value="Senden" class="btn-info pr-form-submit">
            </div>
          </form>`;
      const currVisForm = $('.visitors-wrapper').html(newFormTemplate).find('#visitors-form');

      $('body').find('.email-input').val(visitorsFormEmail.text());
      currVisForm.fadeIn();

      visitsFormSubmit(currVisForm);
      validForm();
      swimmersStatus();
    });
  }


  function visitsFormSubmit(currVisForm) {
    currVisForm.submit(function(e) {
      e.preventDefault();
      let dob = $('body').find('.birth-date-input').val();
      dob = dob.split('-');
      let born = new Date(dob[0] + '-' +  dob[1] + '-' + dob[2]);
      function getAge(born, now) {
        let birthday = new Date(now.getFullYear(), born.getMonth(), born.getDate());
        if (now >= birthday)
          return now.getFullYear() - born.getFullYear();
        else
          return now.getFullYear() - born.getFullYear() - 1;
      }
      const now = new Date();
      let age = getAge(born, now);
      if (age > 14) {
        let data = [{
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
          "swimmerClass": currVisForm.find('.swimmerClass').val()
        }];
        data = JSON.stringify(data);
        $.ajax({
          url: `${baseUrl}/T4000_ChildrenAdmission/services/children/visitor/${visitorsFormEmail.text()}`,
          type: "POST",
          data: data,
          contentType: 'application/json',
          dataType: 'json',
          complete: function( response, textStatus ) {
            if (response.status !== 200) {
              alert('Sie haben falsche Daten eingegeben or Server antwortet nicht');
            } else {
              addFormStatus = false;
              const body = $('body');
              body.find('.btn-add').removeClass('disabled');
              body.find('#visitors-form').fadeOut();
              body.find('.visitors-answer').fadeIn();
              setTimeout(() => {
                $('.body').find('#visitors-form').remove();
                body.find('.visitors-answer').hide();
              }, 3500);
            }
          }
        });
      } else {
        $('.age-answer').show();

        setTimeout(() => {
          $('.age-answer').remove();
        }, 2000);
      }

    })
  }
  /*show form*/
});
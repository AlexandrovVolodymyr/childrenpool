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
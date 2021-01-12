$(document).ready(() => {
  $('#dateOfBirth').datepicker();
  $('#registration').validate({
    //validation rules
    rules: {
      username: {
        required: true
      },
      mobileNumber: {
        required: true,
        minlength: 10,
        maxlength: 10
      },
      address: {
        required: true
      },
      dateOfBirth: {
        required: true,
        date: true,
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 8
      }
    },

    //validation messages
    messages: {
      username: 'This field is required',
      password: 'Password must contain atleast 8 chracters',
      mobileNumber: 'Please enter valid 10 digit mobile number',
      address: 'This field is required',
      dateOfBirth: 'Select date from calender',
      email: 'Enter valid email address'
    },

    //submit handler
    submitHandler: function (form, event) {
      event.preventDefault();
      form.submit();
    }
  })
});

const dateOptionsDOE = {
  dateFormat: 'mm/dd/yy',
  changeMonth: true,
  changeYear: true,
  onClose: function (selectedDate) {
    $('#dateOfBirth').datepicker('option', 'maxDate', selectedDate);
  }
};

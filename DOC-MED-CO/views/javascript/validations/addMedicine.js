$(document).ready(() => {
  $('#manufacturingDate').datepicker();
  $('#expiryDate').datepicker();

  $('#addMedicine').validate({
    //validation rules
    rules: {
      medicineName: {
        required: true
      },
      manufacturingDate: {
        required: true,
        date: true
      },
      expiryDate: {
        required: true,
        date: true
      },
      price: {
        required: true,
        digits: true
      },
      quantity: {
        required: true,
        digits: true
      }
    },

    //validation messages
    messages: {
      medicineName: 'This field is required',
      manufacturingDate: {
        required: 'This field is required',
        date: 'Please select valid date'
      },
      expiryDate: {
        required: 'This field is required',
        date: 'Please select valid date'
      },
      price: {
        required: 'This field is required',
        digit: 'Enter numbers only'
      },
      quantity: {
        required: 'This field is required',
        digit: 'Enter numbers only'
      }
    },

    //submit handler
    submitHandler: function (form, event) {
      event.preventDefault();
      form.submit();
    }
  });
});

const dateOptionsDOE = {
  dateFormat: 'mm/dd/yy',
  changeMonth: true,
  changeYear: true,
  onClose: function (selectedDate) {
    $('#dateOfBirth').datepicker('option', 'maxDate', selectedDate);
  }
};

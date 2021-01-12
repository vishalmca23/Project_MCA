$(document).ready(() => $('#appointmentRequest').validate({
  focusOut: true,
  //validation rules
  rules: {
    doctorName: {
      required: true
    },
    subject: {
      required: true
    },
    time: {
      required: true
    }
  },

  //validation messages
  messages: {
    doctorName: 'Please select doctor from below list',
    subject: 'This field is required',
    time: 'This field is required'
  },

  //submit handler
  submitHandler: function (form, event) {
    event.preventDefault();
    form.submit();
  }
}));

$(document).ready(() => $('#login').validate({
  focusOut: true,
  //validation rules
  rules: {
    username: {
      required: true,
      email: true
    },
    password: {
      required: true
    }
  },

  //validation messages
  messages: {
    username: 'Please enter email Address',
    password: 'Please enter password'
  },

  //submit handler
  submitHandler: function (form, event) {
    event.preventDefault();
    form.submit();
  }
}));

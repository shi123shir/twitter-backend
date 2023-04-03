



function isValidEmail(data) {
    const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
    return emailRegex.test(data);
  }

  const isValidPassword = function (value) {
    let password = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    if (password.test(value) && value.length >= 8 && value.length <= 15) return true;
    return false
  };

  function isString(data) {
    if (
      typeof data == "string" && data.trim().length !== 0
    )
      return true;
    return false;
  }


  module.exports = {isValidEmail,isValidPassword,isString}
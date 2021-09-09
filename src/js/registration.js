// window.onload = function () {
let inputName = document.querySelector('.form__input[name="name"]');
let inputEmail = document.querySelector('.form__input[name="email"]');
let inputPassword = document.querySelector('.form__input[name="password"]');
let inputConfPassword = document.querySelector('.form__input[name="сonf-password"]');
let fileInput = document.querySelector('.file__input');
let filePreview = document.querySelector('.file__preview');
let nameRegex = /^[a-zA-Z0-9\-]{7,}$/;
let emailRegxp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let passwordRegxp = /^[a-zA-Z0-9!@#$%^&*()\-]{7,}$/;

fileInput.addEventListener('change', () => {
  uploadFile(fileInput.files[0]);
});
document.querySelector('.form__button').addEventListener('click', checkValidation);

function checkValidation(e) {
  e.preventDefault();

  if (nameRegex.test(inputName.value)) {
    assignCorrectStatus(inputName, true);
  } else {
    assignCorrectStatus(inputName, false);
  }

  if (emailRegxp.test(inputEmail.value)) {
    assignCorrectStatus(inputEmail, true);
  } else {
    assignCorrectStatus(inputEmail, false);
  }

  if (passwordRegxp.test(inputPassword.value)) {
    assignCorrectStatus(inputPassword, true);
  } else {
    assignCorrectStatus(inputPassword, false);
  }

  if (inputConfPassword.value === inputPassword.value && inputPassword.value) {
    assignCorrectStatus(inputConfPassword, true);
  } else {
    assignCorrectStatus(inputConfPassword, false);
  }
}

function assignCorrectStatus(currentInput, inputIsValid) {
  let errorText = currentInput.nextElementSibling.nextElementSibling;

  if (currentInput == inputPassword && inputIsValid) {
    let counter = 0;

    if (/[0-9]/.test(currentInput.value)) {
      counter += 1;
    }
    if (/[A-Z]/.test(currentInput.value)) {
      counter += 1;
    }
    if (/[!@#$%^&*()]/g.test(currentInput.value)) {
      counter += 1;
    }
    if (currentInput.value.length >= 10) {
      counter += 1;
    }
    if (currentInput.value.length >= 15) {
      counter += 1;
    }
    if (counter <= 2) {
      errorText.textContent = 'you have light password';
      errorText.style.color = '#edc639';
    } else if (counter <= 4) {
      errorText.textContent = 'you have medium password';
      errorText.style.color = '#b1db30';
    } else if (counter === 5) {
      errorText.textContent = 'you have strong password';
      errorText.style.color = 'var(--correct-color)';
    }
    currentInput.style.borderBottomColor = 'var(--correct-color)';
    errorText.classList.add('error');
  } else {
    if (inputIsValid) {
      currentInput.style.borderBottomColor = 'var(--correct-color)';
      errorText.classList.remove('error');
    } else {
      currentInput.style.borderBottomColor = 'var(--error-color)';
      errorText.classList.add('error');
    }
  }
}

function uploadFile(file) {
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    alert('only images allowed');
    fileInput.value = '';
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    alert('the file must be less than 2 MB.');
    return;
  }

  let reader = new FileReader();
  reader.onload = (e) => {
    filePreview.innerHTML = `<img src="${e.target.result}" alt="photo">`;
  };
  reader.onerror = (e) => {
    alert('error');
  };
  reader.readAsDataURL(file);
}
// };

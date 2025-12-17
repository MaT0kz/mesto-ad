// Функция для отображения ошибки валидации
const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

// Функция для скрытия ошибки валидации
const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = '';
};

// Функция проверки валидности поля
const checkInputValidity = (formElement, inputElement, settings) => {
  if (inputElement.validity.patternMismatch) {
    // Используем кастомное сообщение из data-error-message
    const customErrorMessage = inputElement.dataset.errorMessage;
    showInputError(formElement, inputElement, customErrorMessage, settings);
  } else if (!inputElement.validity.valid) {
    // Используем стандартное сообщение браузера
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

// Проверка, есть ли в форме невалидные поля
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Деактивация кнопки отправки формы
const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
};

// Активация кнопки отправки формы
const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.remove(settings.inactiveButtonClass);
  buttonElement.disabled = false;
};

// Переключение состояния кнопки в зависимости от валидности полей
const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

// Установка обработчиков событий для всех полей формы
const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  // Изначально проверяем состояние кнопки
  toggleButtonState(inputList, buttonElement, settings);
  
  // Обработчики для каждого поля ввода
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

// Очистка ошибок валидации формы
export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  // Сбрасываем ошибки для каждого поля
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });
  
  // Деактивируем кнопку
  disableSubmitButton(buttonElement, settings);
};

// Включение валидации для всех форм
export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
};
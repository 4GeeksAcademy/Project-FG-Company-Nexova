(() => {
  const form = document.getElementById("application-form");
  if (!(form instanceof HTMLFormElement)) {
    console.error("validation.js: missing #application-form");
    return;
  }

  const requiredIds = [
    "form-status",
    "contact-name",
    "work-email",
    "phone",
    "company-name",
    "country",
    "employee-count",
    "service-interest-group",
    "service-executive-search",
    "service-customer-support",
    "service-corporate-training",
    "start-date",
    "project-details",
    "project-details-counter",
    "preferred-contact-group",
    "contact-by-email",
    "contact-by-phone",
    "privacy-consent",
    "contact-name-error",
    "work-email-error",
    "phone-error",
    "company-name-error",
    "country-error",
    "employee-count-error",
    "service-interest-error",
    "start-date-error",
    "project-details-error",
    "preferred-contact-error",
    "privacy-consent-error"
  ];

  const missingIds = requiredIds.filter((id) => !document.getElementById(id));
  if (missingIds.length > 0) {
    console.error(`validation.js: missing expected elements: ${missingIds.join(", ")}`);
    return;
  }

  const statusRegion = document.getElementById("form-status");
  const contactName = document.getElementById("contact-name");
  const workEmail = document.getElementById("work-email");
  const phone = document.getElementById("phone");
  const companyName = document.getElementById("company-name");
  const country = document.getElementById("country");
  const employeeCount = document.getElementById("employee-count");
  const startDate = document.getElementById("start-date");
  const projectDetails = document.getElementById("project-details");
  const projectDetailsCounter = document.getElementById("project-details-counter");
  const privacyConsent = document.getElementById("privacy-consent");

  const serviceInterestFieldset = document.getElementById("service-interest-group");
  const preferredContactFieldset = document.getElementById("preferred-contact-group");

  const serviceInterestRadios = Array.from(form.querySelectorAll('input[name="service_interest"]'));
  const preferredContactRadios = Array.from(form.querySelectorAll('input[name="preferred_contact"]'));

  const errorEls = {
    contactName: document.getElementById("contact-name-error"),
    workEmail: document.getElementById("work-email-error"),
    phone: document.getElementById("phone-error"),
    companyName: document.getElementById("company-name-error"),
    country: document.getElementById("country-error"),
    employeeCount: document.getElementById("employee-count-error"),
    serviceInterest: document.getElementById("service-interest-error"),
    startDate: document.getElementById("start-date-error"),
    projectDetails: document.getElementById("project-details-error"),
    preferredContact: document.getElementById("preferred-contact-error"),
    privacyConsent: document.getElementById("privacy-consent-error")
  };

  const touched = new Set();

  const statusErrorClasses = [
    "border",
    "border-red-300",
    "bg-red-50",
    "text-red-800",
    "rounded-xl",
    "p-4"
  ];
  const statusSuccessClasses = [
    "border",
    "border-emerald-300",
    "bg-emerald-50",
    "text-emerald-800",
    "rounded-xl",
    "p-4"
  ];
  const controlErrorClasses = ["border-red-600", "ring-1", "ring-red-600"];
  const groupErrorClasses = ["border", "border-red-300", "rounded-md", "p-3", "ring-1", "ring-red-200"];
  const privacyWrapperErrorClasses = ["border-red-600", "ring-1", "ring-red-600"];

  const COUNTRY_VALUES = new Set(["chile", "argentina", "otro"]);
  const SERVICE_VALUES = new Set(["executive_search", "customer_support", "corporate_training"]);
  const PREFERRED_CONTACT_VALUES = new Set(["email", "phone"]);

  function padTwoDigits(value) {
    return String(value).padStart(2, "0");
  }

  function getLocalTodayValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = padTwoDigits(now.getMonth() + 1);
    const day = padTwoDigits(now.getDate());
    return `${year}-${month}-${day}`;
  }

  const localTodayValue = getLocalTodayValue();
  startDate.min = localTodayValue;

  function addClasses(el, classes) {
    el.classList.add(...classes);
  }

  function removeClasses(el, classes) {
    el.classList.remove(...classes);
  }

  function hasError(el) {
    return el.getAttribute("aria-invalid") === "true";
  }

  function clearStatus() {
    statusRegion.textContent = "";
    removeClasses(statusRegion, statusErrorClasses);
    removeClasses(statusRegion, statusSuccessClasses);
  }

  function setStatusError(message) {
    removeClasses(statusRegion, statusSuccessClasses);
    addClasses(statusRegion, statusErrorClasses);
    statusRegion.textContent = message;
  }

  function setStatusSuccess(message) {
    removeClasses(statusRegion, statusErrorClasses);
    addClasses(statusRegion, statusSuccessClasses);
    statusRegion.textContent = message;
  }

  function clearStatusOnEdit() {
    if (statusRegion.textContent.trim() !== "") {
      clearStatus();
    }
  }

  function setControlError(control, errorEl, message) {
    control.setAttribute("aria-invalid", "true");
    errorEl.textContent = message;
    addClasses(control, controlErrorClasses);
  }

  function clearControlError(control, errorEl) {
    control.removeAttribute("aria-invalid");
    errorEl.textContent = "";
    removeClasses(control, controlErrorClasses);
  }

  function setRadioGroupError(radios, fieldset, errorEl, message) {
    radios.forEach((radio) => {
      radio.setAttribute("aria-invalid", "true");
    });
    errorEl.textContent = message;
    addClasses(fieldset, groupErrorClasses);
  }

  function clearRadioGroupError(radios, fieldset, errorEl) {
    radios.forEach((radio) => {
      radio.removeAttribute("aria-invalid");
    });
    errorEl.textContent = "";
    removeClasses(fieldset, groupErrorClasses);
  }

  function getPrivacyWrapper() {
    return privacyConsent.closest('label[for="privacy-consent"]');
  }

  function setPrivacyError(message) {
    privacyConsent.setAttribute("aria-invalid", "true");
    errorEls.privacyConsent.textContent = message;
    addClasses(privacyConsent, controlErrorClasses);
    const wrapper = getPrivacyWrapper();
    if (wrapper) {
      addClasses(wrapper, privacyWrapperErrorClasses);
    }
  }

  function clearPrivacyError() {
    privacyConsent.removeAttribute("aria-invalid");
    errorEls.privacyConsent.textContent = "";
    removeClasses(privacyConsent, controlErrorClasses);
    const wrapper = getPrivacyWrapper();
    if (wrapper) {
      removeClasses(wrapper, privacyWrapperErrorClasses);
    }
  }

  function updateProjectDetailsCounter() {
    const currentLength = projectDetails.value.length;
    projectDetailsCounter.textContent = `${currentLength} de 1000 caracteres`;
  }

  function validateContactName() {
    const value = contactName.value.trim();

    if (value.length === 0) {
      setControlError(contactName, errorEls.contactName, "Escribe tu nombre completo.");
      return false;
    }
    if (value.length < 2) {
      setControlError(contactName, errorEls.contactName, "El nombre debe tener al menos 2 caracteres.");
      return false;
    }
    if (value.length > 80) {
      setControlError(contactName, errorEls.contactName, "El nombre no puede superar los 80 caracteres.");
      return false;
    }

    clearControlError(contactName, errorEls.contactName);
    return true;
  }

  function validateWorkEmail() {
    const value = workEmail.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value.length === 0) {
      setControlError(workEmail, errorEls.workEmail, "Escribe tu correo electrónico corporativo.");
      return false;
    }
    if (value.length > 120) {
      setControlError(workEmail, errorEls.workEmail, "El correo electrónico no puede superar los 120 caracteres.");
      return false;
    }
    if (/\s/.test(value) || !emailPattern.test(value)) {
      setControlError(workEmail, errorEls.workEmail, "Escribe una dirección de correo electrónico válida.");
      return false;
    }

    clearControlError(workEmail, errorEls.workEmail);
    return true;
  }

  function validatePhone() {
    const value = phone.value.trim();
    const phonePattern = /^\+?[\d\s().-]+$/;
    const digits = value.replace(/\D/g, "");

    if (value.length === 0) {
      setControlError(phone, errorEls.phone, "Escribe un número de teléfono.");
      return false;
    }
    if (value.length > 25) {
      setControlError(phone, errorEls.phone, "El número de teléfono no puede superar los 25 caracteres.");
      return false;
    }
    if (!phonePattern.test(value) || digits.length < 7 || digits.length > 15) {
      setControlError(phone, errorEls.phone, "Escribe un teléfono válido con entre 7 y 15 dígitos.");
      return false;
    }

    clearControlError(phone, errorEls.phone);
    return true;
  }

  function validateCompanyName() {
    const value = companyName.value.trim();

    if (value.length === 0) {
      setControlError(companyName, errorEls.companyName, "Escribe el nombre de la empresa.");
      return false;
    }
    if (value.length < 2) {
      setControlError(companyName, errorEls.companyName, "El nombre de la empresa debe tener al menos 2 caracteres.");
      return false;
    }
    if (value.length > 120) {
      setControlError(companyName, errorEls.companyName, "El nombre de la empresa no puede superar los 120 caracteres.");
      return false;
    }

    clearControlError(companyName, errorEls.companyName);
    return true;
  }

  function validateCountry() {
    const value = country.value;
    if (!COUNTRY_VALUES.has(value)) {
      setControlError(country, errorEls.country, "Selecciona el país de operación principal.");
      return false;
    }

    clearControlError(country, errorEls.country);
    return true;
  }

  function validateEmployeeCount() {
    const raw = employeeCount.value.trim();

    if (raw.length === 0) {
      setControlError(employeeCount, errorEls.employeeCount, "Indica la cantidad aproximada de empleados.");
      return false;
    }
    if (!/^-?\d+$/.test(raw)) {
      setControlError(employeeCount, errorEls.employeeCount, "Escribe una cantidad de empleados en números enteros.");
      return false;
    }

    const value = Number(raw);
    if (!Number.isInteger(value) || Number.isNaN(value)) {
      setControlError(employeeCount, errorEls.employeeCount, "Escribe una cantidad de empleados en números enteros.");
      return false;
    }
    if (value < 1) {
      setControlError(employeeCount, errorEls.employeeCount, "La cantidad de empleados debe ser al menos 1.");
      return false;
    }
    if (value > 100000) {
      setControlError(employeeCount, errorEls.employeeCount, "La cantidad de empleados no puede superar 100000.");
      return false;
    }

    clearControlError(employeeCount, errorEls.employeeCount);
    return true;
  }

  function getCheckedValue(name) {
    const selected = form.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : "";
  }

  function validateServiceInterest() {
    const selectedValue = getCheckedValue("service_interest");
    if (!SERVICE_VALUES.has(selectedValue)) {
      setRadioGroupError(
        serviceInterestRadios,
        serviceInterestFieldset,
        errorEls.serviceInterest,
        "Selecciona el servicio que necesita tu empresa."
      );
      return false;
    }

    clearRadioGroupError(serviceInterestRadios, serviceInterestFieldset, errorEls.serviceInterest);
    return true;
  }

  function isValidDateValue(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const [yearText, monthText, dayText] = value.split("-");
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);

    const parsed = new Date(year, month - 1, day);
    return (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    );
  }

  function validateStartDate() {
    const value = startDate.value.trim();

    if (value.length === 0) {
      setControlError(startDate, errorEls.startDate, "Selecciona una fecha estimada de inicio.");
      return false;
    }
    if (!isValidDateValue(value)) {
      setControlError(startDate, errorEls.startDate, "Selecciona una fecha válida.");
      return false;
    }
    if (value < localTodayValue) {
      setControlError(startDate, errorEls.startDate, "La fecha estimada de inicio no puede ser anterior a hoy.");
      return false;
    }

    clearControlError(startDate, errorEls.startDate);
    return true;
  }

  function validateProjectDetails() {
    const rawValue = projectDetails.value;
    const trimmed = rawValue.trim();

    if (trimmed.length === 0) {
      setControlError(projectDetails, errorEls.projectDetails, "Describe brevemente qué necesita tu empresa.");
      return false;
    }
    if (trimmed.length < 30) {
      setControlError(projectDetails, errorEls.projectDetails, "La descripción debe tener al menos 30 caracteres.");
      return false;
    }
    if (rawValue.length > 1000) {
      setControlError(projectDetails, errorEls.projectDetails, "La descripción no puede superar los 1000 caracteres.");
      return false;
    }

    clearControlError(projectDetails, errorEls.projectDetails);
    return true;
  }

  function validatePreferredContact() {
    const selectedValue = getCheckedValue("preferred_contact");
    if (!PREFERRED_CONTACT_VALUES.has(selectedValue)) {
      setRadioGroupError(
        preferredContactRadios,
        preferredContactFieldset,
        errorEls.preferredContact,
        "Selecciona cómo prefieres que Nexova Solutions te contacte."
      );
      return false;
    }

    clearRadioGroupError(preferredContactRadios, preferredContactFieldset, errorEls.preferredContact);
    return true;
  }

  function validatePrivacyConsent() {
    if (!privacyConsent.checked) {
      setPrivacyError("Debes aceptar el uso de la información para enviar la solicitud.");
      return false;
    }

    clearPrivacyError();
    return true;
  }

  function clearAllErrors() {
    clearControlError(contactName, errorEls.contactName);
    clearControlError(workEmail, errorEls.workEmail);
    clearControlError(phone, errorEls.phone);
    clearControlError(companyName, errorEls.companyName);
    clearControlError(country, errorEls.country);
    clearControlError(employeeCount, errorEls.employeeCount);
    clearControlError(startDate, errorEls.startDate);
    clearControlError(projectDetails, errorEls.projectDetails);
    clearRadioGroupError(serviceInterestRadios, serviceInterestFieldset, errorEls.serviceInterest);
    clearRadioGroupError(preferredContactRadios, preferredContactFieldset, errorEls.preferredContact);
    clearPrivacyError();
  }

  function validateAll() {
    const orderedChecks = [
      { key: "contact-name", validate: validateContactName, focusEl: contactName },
      { key: "work-email", validate: validateWorkEmail, focusEl: workEmail },
      { key: "phone", validate: validatePhone, focusEl: phone },
      { key: "company-name", validate: validateCompanyName, focusEl: companyName },
      { key: "country", validate: validateCountry, focusEl: country },
      { key: "employee-count", validate: validateEmployeeCount, focusEl: employeeCount },
      { key: "service_interest", validate: validateServiceInterest, focusEl: serviceInterestRadios[0] },
      { key: "start-date", validate: validateStartDate, focusEl: startDate },
      { key: "project-details", validate: validateProjectDetails, focusEl: projectDetails },
      { key: "preferred_contact", validate: validatePreferredContact, focusEl: preferredContactRadios[0] },
      { key: "privacy-consent", validate: validatePrivacyConsent, focusEl: privacyConsent }
    ];

    let firstInvalidControl = null;
    let allValid = true;

    orderedChecks.forEach((check) => {
      touched.add(check.key);
      const valid = check.validate();
      if (!valid) {
        allValid = false;
        if (!firstInvalidControl) {
          firstInvalidControl = check.focusEl;
        }
      }
    });

    return { allValid, firstInvalidControl };
  }

  function maybeValidateOnInput(key, control, validateFn) {
    if (touched.has(key) || hasError(control)) {
      validateFn();
    }
  }

  function markTouchedAndValidate(key, validateFn) {
    touched.add(key);
    validateFn();
  }

  const blurConfigs = [
    { key: "contact-name", control: contactName, validate: validateContactName },
    { key: "work-email", control: workEmail, validate: validateWorkEmail },
    { key: "phone", control: phone, validate: validatePhone },
    { key: "company-name", control: companyName, validate: validateCompanyName },
    { key: "employee-count", control: employeeCount, validate: validateEmployeeCount },
    { key: "start-date", control: startDate, validate: validateStartDate },
    { key: "project-details", control: projectDetails, validate: validateProjectDetails }
  ];

  blurConfigs.forEach(({ key, control, validate }) => {
    control.addEventListener("blur", () => {
      markTouchedAndValidate(key, validate);
    });
    control.addEventListener("input", () => {
      clearStatusOnEdit();
      if (control === projectDetails) {
        updateProjectDetailsCounter();
      }
      maybeValidateOnInput(key, control, validate);
    });
  });

  country.addEventListener("change", () => {
    clearStatusOnEdit();
    markTouchedAndValidate("country", validateCountry);
  });

  serviceInterestRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      clearStatusOnEdit();
      markTouchedAndValidate("service_interest", validateServiceInterest);
    });
  });

  preferredContactRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      clearStatusOnEdit();
      markTouchedAndValidate("preferred_contact", validatePreferredContact);
    });
  });

  privacyConsent.addEventListener("change", () => {
    clearStatusOnEdit();
    markTouchedAndValidate("privacy-consent", validatePrivacyConsent);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const { allValid, firstInvalidControl } = validateAll();

    if (!allValid) {
      setStatusError("Revisa los campos marcados antes de enviar la solicitud.");
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
      return;
    }

    clearAllErrors();
    setStatusSuccess(
      "Tu solicitud fue validada correctamente. Nexova Solutions podrá revisarla cuando el formulario esté conectado a su sistema."
    );
  });

  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      touched.clear();
      clearAllErrors();
      clearStatus();
      updateProjectDetailsCounter();
      startDate.min = localTodayValue;
    });
  });

  updateProjectDetailsCounter();
})();
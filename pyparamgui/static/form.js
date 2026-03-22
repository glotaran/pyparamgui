/**
 * Creates a form group with a label and a text input field.
 *
 * @param {string} labelText - The text content for the label.
 * @param {string} inputId - The id attribute for the input element.
 * @param {string} inputName - The name attribute for the input element.
 * @param {string} inputValue - The initial value for the input element.
 *
 * @returns {{ formGroup: HTMLDivElement, input: HTMLInputElement }} An object containing the form group element and text input.
 */
function createTextFormGroup(labelText, inputId, inputName, inputValue) {
  const formGroup = document.createElement("div");
  formGroup.className = "form-group";

  const label = document.createElement("label");
  label.setAttribute("for", inputId);
  label.textContent = labelText;

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("id", inputId);
  input.setAttribute("name", inputName);
  input.value = inputValue;

  formGroup.appendChild(label);
  formGroup.appendChild(input);

  return { formGroup, input };
}

/**
 * Creates a form group with a label and a checkbox input field.
 *
 * @param {string} labelText - The text content for the label.
 * @param {string} inputId - The id attribute for the input element.
 * @param {string} inputName - The name attribute for the input element.
 * @param {boolean} [inputChecked=false] - The initial checked state for the checkbox.
 *
 * @returns {{ formGroup: HTMLDivElement, input: HTMLInputElement }} An object containing the form group element and checkbox input.
 */
function createCheckboxFormGroup(
  labelText,
  inputId,
  inputName,
  inputChecked = false,
) {
  const formGroup = document.createElement("div");
  formGroup.className = "form-group";

  const label = document.createElement("label");
  label.setAttribute("for", inputId);
  label.textContent = labelText;

  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("id", inputId);
  input.setAttribute("name", inputName);
  input.checked = inputChecked;

  formGroup.appendChild(label);
  formGroup.appendChild(input);

  return { formGroup, input };
}

function appendTextFormGroup(form, labelText, inputId, inputName, inputValue) {
  const { formGroup, input } = createTextFormGroup(
    labelText,
    inputId,
    inputName,
    inputValue,
  );
  form.appendChild(formGroup);
  return input;
}

function appendCheckboxFormGroup(
  form,
  labelText,
  inputId,
  inputName,
  inputChecked = false,
) {
  const { formGroup, input } = createCheckboxFormGroup(
    labelText,
    inputId,
    inputName,
    inputChecked,
  );
  form.appendChild(formGroup);
  return input;
}

function parseNumberList(value) {
  return value.split(",").map((part) => parseFloat(part.trim()));
}

function createSimulationId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Converts the input values from the form into their respective data types.
 *
 * @param {Object} inputs - The input values to convert.
 *
 * @returns {Object|null} An object containing the converted input values, or null if an error occurs.
 *
 * @property {number[]} decay_rates - Array of decay rates as floats.
 * @property {number[]} amplitude - Array of amplitudes as floats.
 * @property {number[]} location - Array of locations as floats.
 * @property {number[]} width - Array of widths as floats.
 * @property {number[]} skewness - Array of skewness values as floats.
 * @property {number} timepoints_max - Maximum number of timepoints as an integer.
 * @property {number} timepoints_stepsize - Step size for timepoints as a float.
 * @property {number} wavelength_min - Minimum wavelength value as a float.
 * @property {number} wavelength_max - Maximum wavelength value as a float.
 * @property {number} wavelength_stepsize - Step size for wavelength as a float.
 * @property {number} stdev_noise - Standard deviation of noise as a float.
 * @property {number} seed - Seed for random number generation as an integer.
 * @property {number} irf_location - Location of the IRF center as a float.
 * @property {number} irf_width - Width of the IRF as a float.
 */
function convertInputs(inputs) {
  try {
    const decay_rates = parseNumberList(inputs.decay_rates);
    const amplitude = parseNumberList(inputs.amplitude);
    const location = parseNumberList(inputs.location);
    const width = parseNumberList(inputs.width);
    const skewness = parseNumberList(inputs.skewness);
    const timepoints_max = parseInt(inputs.timepoints_max, 10);
    const timepoints_stepsize = parseFloat(inputs.timepoints_stepsize);
    const wavelength_min = parseFloat(inputs.wavelength_min);
    const wavelength_max = parseFloat(inputs.wavelength_max);
    const wavelength_stepsize = parseFloat(inputs.wavelength_stepsize);
    const stdev_noise = parseFloat(inputs.stdev_noise);
    const seed = parseInt(inputs.seed, 10);
    const irf_location = parseFloat(inputs.irf_location);
    const irf_width = parseFloat(inputs.irf_width);

    return {
      decay_rates,
      amplitude,
      location,
      width,
      skewness,
      timepoints_max,
      timepoints_stepsize,
      wavelength_min,
      wavelength_max,
      wavelength_stepsize,
      stdev_noise,
      seed,
      irf_location,
      irf_width,
    };
  } catch (error) {
    alert("Error converting inputs: " + error.message);
    return null;
  }
}

/**
 * Validates the input values for the simulation.
 *
 * @param {Object} inputs - The input values to validate.
 *
 * @param {number[]} inputs.decay_rates - Array of decay rates as floats.
 * @param {number[]} inputs.amplitude - Array of amplitudes as floats.
 * @param {number[]} inputs.location - Array of locations as floats.
 * @param {number[]} inputs.width - Array of widths as floats.
 * @param {number[]} inputs.skewness - Array of skewness values as floats.
 * @param {number} inputs.wavelength_min - Minimum wavelength value as a float.
 * @param {number} inputs.wavelength_max - Maximum wavelength value as a float.
 * @param {number} inputs.timepoints_max - Maximum number of timepoints as an integer.
 *
 * @returns {boolean} True if all inputs are valid, otherwise false.
 */
function validateInputs(inputs) {
  try {
    const { decay_rates, amplitude, location, width, skewness } = inputs;

    if (decay_rates.some(isNaN)) {
      alert("Invalid decay rates");
      return false;
    }
    if (amplitude.some(isNaN)) {
      alert("Invalid amplitudes");
      return false;
    }
    if (location.some(isNaN)) {
      alert("Invalid locations");
      return false;
    }
    if (width.some(isNaN)) {
      alert("Invalid widths");
      return false;
    }
    if (skewness.some(isNaN)) {
      alert("Invalid skewness values");
      return false;
    }

    const lengths = [
      decay_rates.length,
      amplitude.length,
      location.length,
      width.length,
      skewness.length,
    ];
    if (new Set(lengths).size !== 1) {
      alert("All input lists must have the same length");
      return false;
    }

    if (
      inputs.wavelength_min >= inputs.wavelength_max ||
      inputs.timepoints_max <= 0
    ) {
      alert("Invalid timepoints or wavelength specification");
      return false;
    }

    return true;
  } catch (error) {
    alert("Validation error: " + error.message);
    return false;
  }
}

/**
 * Displays a temporary message indicating simulation completion.
 * @param {HTMLElement} parentElement - The parent element to which the message will be appended.
 */
function displaySimulationMessage(parentElement) {
  const message = document.createElement("p");
  message.textContent = "Simulated! Files created!";
  parentElement.appendChild(message);

  setTimeout(() => {
    setTimeout(() => {
      parentElement.removeChild(message);
    }, 500);
  }, 2000);
}

/**
 * Entrypoint for frontend rendering called by Python backend based on anywidget.
 * @param {Object} model - The model data passed from the backend.
 * @param {HTMLElement} el - The HTML element where the form will be rendered.
 */
function render({ model, el }) {
  const form = document.createElement("form");

  const decayRatesInput = appendTextFormGroup(
    form,
    "Decay rates:",
    "decay_rates_input",
    "decay_rates_input",
    "0.055, 0.005",
  );
  form.appendChild(document.createElement("hr"));
  const amplitudeInput = appendTextFormGroup(
    form,
    "Amplitudes:",
    "amplitude_input",
    "amplitude_input",
    "1., 1.",
  );
  const locationInput = appendTextFormGroup(
    form,
    "Location (mean) of spectra:",
    "location_input",
    "location_input",
    "22000, 20000",
  );
  const widthInput = appendTextFormGroup(
    form,
    "Width of spectra:",
    "width_input",
    "width_input",
    "4000, 3500",
  );
  const skewnessInput = appendTextFormGroup(
    form,
    "Skewness of spectra:",
    "skewness_input",
    "skewness_input",
    "0.1, -0.1",
  );
  form.appendChild(document.createElement("hr"));
  const timepointsMaxInput = appendTextFormGroup(
    form,
    "Timepoints, max:",
    "timepoints_max_input",
    "timepoints_max_input",
    "80",
  );
  const timepointsStepsizeInput = appendTextFormGroup(
    form,
    "Stepsize:",
    "timepoints_stepsize_input",
    "timepoints_stepsize_input",
    "1",
  );
  form.appendChild(document.createElement("hr"));
  const wavelengthMinInput = appendTextFormGroup(
    form,
    "Wavelength Min:",
    "wavelength_min_input",
    "wavelength_min_input",
    "400",
  );
  const wavelengthMaxInput = appendTextFormGroup(
    form,
    "Wavelength Max:",
    "wavelength_max_input",
    "wavelength_max_input",
    "600",
  );
  const wavelengthStepsizeInput = appendTextFormGroup(
    form,
    "Stepsize:",
    "wavelength_stepsize_input",
    "wavelength_stepsize_input",
    "5",
  );
  form.appendChild(document.createElement("hr"));
  const stdevNoiseInput = appendTextFormGroup(
    form,
    "Std.dev. noise:",
    "stdev_noise_input",
    "stdev_noise_input",
    "0.01",
  );
  const seedInput = appendTextFormGroup(
    form,
    "Seed:",
    "seed_input",
    "seed_input",
    "123",
  );
  form.appendChild(document.createElement("hr"));
  const addGaussianIrfInput = appendCheckboxFormGroup(
    form,
    "Add Gaussian IRF:",
    "add_gaussian_irf_input",
    "add_gaussian_irf_input",
  );
  const irfLocationInput = appendTextFormGroup(
    form,
    "IRF location:",
    "irf_location_input",
    "irf_location_input",
    "3",
  );
  const irfWidthInput = appendTextFormGroup(
    form,
    "IRF width:",
    "irf_width_input",
    "irf_width_input",
    "1",
  );
  form.appendChild(document.createElement("hr"));
  const useSequentialSchemeInput = appendCheckboxFormGroup(
    form,
    "Use Sequential Scheme:",
    "use_sequential_scheme_input",
    "use_sequential_scheme_input",
  );
  form.appendChild(document.createElement("hr"));
  const modelFileNameInput = appendTextFormGroup(
    form,
    "Model File Name:",
    "model_file_name_input",
    "model_file_name_input",
    "model.yml",
  );
  const parameterFileNameInput = appendTextFormGroup(
    form,
    "Parameter File Name:",
    "parameter_file_name_input",
    "parameter_file_name_input",
    "parameters.csv",
  );
  const dataFileNameInput = appendTextFormGroup(
    form,
    "Data File Name:",
    "data_file_name_input",
    "data_file_name_input",
    "dataset.nc",
  );
  form.appendChild(document.createElement("hr"));
  const visualizeDataInput = appendCheckboxFormGroup(
    form,
    "Visualize Data:",
    "visualize_data_input",
    "visualize_data_input",
    true,
  );

  el.appendChild(form);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Simulate";
  btn.addEventListener("click", function (event) {
    event.preventDefault();

    const inputs = {
      decay_rates: decayRatesInput.value,
      amplitude: amplitudeInput.value,
      location: locationInput.value,
      width: widthInput.value,
      skewness: skewnessInput.value,
      timepoints_max: timepointsMaxInput.value,
      timepoints_stepsize: timepointsStepsizeInput.value,
      wavelength_min: wavelengthMinInput.value,
      wavelength_max: wavelengthMaxInput.value,
      wavelength_stepsize: wavelengthStepsizeInput.value,
      stdev_noise: stdevNoiseInput.value,
      seed: seedInput.value,
      irf_location: irfLocationInput.value,
      irf_width: irfWidthInput.value,
    };
    const convertedInputs = convertInputs(inputs);
    if (!convertedInputs) return;

    const isValid = validateInputs(convertedInputs);
    if (!isValid) return;

    model.set("decay_rates_input", convertedInputs.decay_rates);
    model.set("amplitude_input", convertedInputs.amplitude);
    model.set("location_input", convertedInputs.location);
    model.set("width_input", convertedInputs.width);
    model.set("skewness_input", convertedInputs.skewness);
    model.set("timepoints_max_input", convertedInputs.timepoints_max);
    model.set("timepoints_stepsize_input", convertedInputs.timepoints_stepsize);
    model.set("wavelength_min_input", convertedInputs.wavelength_min);
    model.set("wavelength_max_input", convertedInputs.wavelength_max);
    model.set("wavelength_stepsize_input", convertedInputs.wavelength_stepsize);
    model.set("stdev_noise_input", convertedInputs.stdev_noise);
    model.set("seed_input", convertedInputs.seed);
    model.set("add_gaussian_irf_input", addGaussianIrfInput.checked);
    model.set("irf_location_input", convertedInputs.irf_location);
    model.set("irf_width_input", convertedInputs.irf_width);
    model.set("use_sequential_scheme_input", useSequentialSchemeInput.checked);
    model.set("model_file_name_input", modelFileNameInput.value);
    model.set("parameter_file_name_input", parameterFileNameInput.value);
    model.set("data_file_name_input", dataFileNameInput.value);
    model.set("visualize_data", visualizeDataInput.checked);
    model.set("simulate", createSimulationId());

    model.save_changes();

    displaySimulationMessage(el);
  });

  el.appendChild(btn);
}

export default { render };

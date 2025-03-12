export type FormValidator = (value: any, formValues: Record<string, any>) => string | boolean | null;

export interface FormField {
    value: any;
    validators?: FormValidator[];
    error?: string | null;
    dirty?: boolean;
    touched?: boolean;
}

export interface UseFormOptions {
    initialValues?: Record<string, any>;
    validators?: Record<string, FormValidator[]>;
    onSubmit?: (values: Record<string, any>) => void | Promise<void>;
}

export function useForm({
    initialValues = {},
    validators = {},
    onSubmit
}: UseFormOptions = {}) {
    // Form state
    const fields = reactive<Record<string, FormField>>({});
    const values = reactive<Record<string, any>>({});
    const errors = reactive<Record<string, string | null>>({});
    const isSubmitting = ref(false);
    const isDirty = ref(false);
    const touched = reactive<Record<string, boolean>>({});

    // Initialize form with initial values and validators
    Object.keys(initialValues).forEach((fieldName) => {
        registerField(fieldName, initialValues[fieldName], validators[fieldName]);
    });

    // Register a field with the form
    function registerField(name: string, initialValue: any = '', fieldValidators: FormValidator[] = []) {
        if (!fields[name]) {
            fields[name] = reactive({
                value: initialValue,
                validators: fieldValidators,
                error: null,
                dirty: false,
                touched: false
            });
            values[name] = initialValue;
            errors[name] = null;
            touched[name] = false;
        } else {
            // Update validators if provided
            if (fieldValidators.length) {
                fields[name].validators = fieldValidators;
            }
            // Only set initial value if the field doesn't have a value yet
            if (fields[name].value === undefined || fields[name].value === '') {
                fields[name].value = initialValue;
                values[name] = initialValue;
            }
        }
    }

    // Set field value
    function setValue(field: string, value: any) {
        if (!fields[field]) {
            registerField(field, value);
        }

        fields[field].value = value;
        values[field] = value;
        fields[field].dirty = true;
        isDirty.value = true;

        validateField(field);
    }

    // Mark field as touched
    function setTouched(field: string, isTouched = true) {
        if (!fields[field]) {
            registerField(field);
        }

        fields[field].touched = isTouched;
        touched[field] = isTouched;

        if (isTouched) {
            validateField(field);
        }
    }

    // Set a specific error for a field
    function setError(field: string, errorMessage: string | null) {
        if (!fields[field]) {
            registerField(field);
        }

        fields[field].error = errorMessage;
        errors[field] = errorMessage;
    }

    // Clear error for a field
    function clearError(field: string) {
        if (fields[field]) {
            fields[field].error = null;
            errors[field] = null;
        }
    }

    // Reset the form
    function reset() {
        Object.keys(fields).forEach((field) => {
            const initialValue = initialValues[field] !== undefined ? initialValues[field] : '';
            fields[field].value = initialValue;
            values[field] = initialValue;
            fields[field].error = null;
            errors[field] = null;
            fields[field].dirty = false;
            fields[field].touched = false;
            touched[field] = false;
        });
        isDirty.value = false;
        isSubmitting.value = false;
    }

    // Validate a specific field
    function validateField(field: string): boolean {
        if (!fields[field] || !fields[field].validators?.length) {
            errors[field] = null;
            fields[field].error = null;
            return true;
        }

        for (const validator of fields[field].validators) {
            const result = validator(fields[field].value, values);

            if (typeof result === 'string') {
                errors[field] = result;
                fields[field].error = result;
                return false;
            } else if (result === false) {
                errors[field] = 'Invalid value';
                fields[field].error = 'Invalid value';
                return false;
            }
        }

        errors[field] = null;
        fields[field].error = null;
        return true;
    }

    // Validate all fields
    function validateForm(): boolean {
        let isValid = true;

        Object.keys(fields).forEach((field) => {
            setTouched(field, true);
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Submit the form
    async function submitForm() {
        if (!validateForm()) {
            return false;
        }

        if (onSubmit) {
            isSubmitting.value = true;
            try {
                await onSubmit(values);
                return true;
            } catch (error) {
                console.error('Form submission error:', error);
                return false;
            } finally {
                isSubmitting.value = false;
            }
        }

        return true;
    }

    // Check if the form is valid
    const isValid = computed(() => {
        return Object.values(errors).every(error => error === null);
    });

    return {
        fields,
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        isDirty,
        registerField,
        setValue,
        setTouched,
        setError,        // Add the new method
        clearError,      // Add the new method
        reset,
        validateField,
        validateForm,
        submitForm
    };
}

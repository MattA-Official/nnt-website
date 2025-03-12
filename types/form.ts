// Basic form field type
export interface FormField {
    name: string;
    value: any;
    groupPath?: string[];
    isValid?: boolean;
}

export interface FormGroup {
    name?: string;
    fields: { [key: string]: any };
    groups: { [key: string]: FormGroup };
}

// Validation type definitions
export type ValidationResult = string | boolean | null;
export type FormValidator = (value: any, formValues?: Record<string, any>) => ValidationResult;

// Common validation functions
export const validators = {
    required: (message = 'This field is required'): FormValidator =>
        (value) => value !== null && value !== undefined && value !== '' ? null : message,

    email: (message = 'Please enter a valid email address'): FormValidator =>
        (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : message,

    minLength: (length: number, message?: string): FormValidator =>
        (value) => !value || value.length >= length ? null : (message || `Must be at least ${length} characters`),

    maxLength: (length: number, message?: string): FormValidator =>
        (value) => !value || value.length <= length ? null : (message || `Must be no more than ${length} characters`),

    pattern: (regex: RegExp, message: string): FormValidator =>
        (value) => !value || regex.test(value) ? null : message,

    match: (fieldName: string, message = 'Fields must match'): FormValidator =>
        (value, formValues) => {
            if (!formValues) return null;
            const targetValue = fieldName.split('.').reduce((obj, key) => obj?.[key], formValues);
            return typeof targetValue === 'string' && value === targetValue ? null : message;
        },

    phone: (message = 'Please enter a valid phone number'): FormValidator =>
        (value) => !value || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value) ? null : message
};

// Combine multiple validators into one
export function composeValidators(...validators: FormValidator[]): FormValidator {
    return (value: any, formValues?: Record<string, any>) => {
        for (const validator of validators) {
            const result = validator(value, formValues);
            if (result !== null && result !== true) {
                return result;
            }
        }
        return null;
    };
}

// Form context interface for injection
export interface FormContext {
    fields: Record<string, FormField>;
    values: Record<string, any>;
    errors: Record<string, string | null>;
    touched: Record<string, boolean>;
    isSubmitting: Ref<boolean>;
    isValid: ComputedRef<boolean>;
    isDirty: Ref<boolean>;
    registerField: (name: string, initialValue?: any, fieldValidators?: FormValidator[]) => void;
    setValue: (field: string, value: any) => void;
    setTouched: (field: string, isTouched?: boolean) => void;
    reset: () => void;
    validateField: (field: string) => boolean;
    validateForm: () => boolean;
    submitForm: () => Promise<boolean>;
}

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

export type ValidationRule = {
    validate: (value: any) => boolean;
    message: string;
}

export type ValidationContext = {
    validateForm: () => boolean;
}

// Common validation rules
export const email: ValidationRule = {
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
}

export const required: ValidationRule = {
    validate: (value: any) => value !== null && value !== undefined && value !== '',
    message: 'This field is required'
}

export const minLength = (length: number): ValidationRule => ({
    validate: (value: string) => value?.length >= length,
    message: `Must be at least ${length} characters`
})

// Custom validation rule creators
export const maxLength = (length: number): ValidationRule => ({
    validate: (value: string) => !value || value.length <= length,
    message: `Must be no more than ${length} characters`
})

export const pattern = (regex: RegExp, message: string): ValidationRule => ({
    validate: (value: string) => !value || regex.test(value),
    message
})

export const match = (fieldName: string): ValidationRule => ({
    validate: (value: string, formData?: any) => !value || value === formData?.[fieldName],
    message: `Must match ${fieldName}`
})

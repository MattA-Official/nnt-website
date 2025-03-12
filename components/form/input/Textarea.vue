<template>
    <FormLayoutGroup>
        <div v-if="icon && !loading" class="textarea-icon">
            <i :class="icon"></i>
        </div>
        <div v-if="loading" class="textarea-icon">
            <div class="" role="status">
                <span class="hidden">Loading...</span>
            </div>
        </div>

        <textarea :id="id" :name="name" :placeholder="placeholder" :required="required" :disabled="disabled"
            :rows="rows" v-model="innerValue" @blur="onBlur" class="form-textarea"
            :class="[varient, color, { 'error': formContext && formContext.errors[name] }]"></textarea>

        <FormInputError v-if="formContext && formContext.errors[name]"
            :message="formContext.errors[name] ?? undefined" />
    </FormLayoutGroup>
</template>

<script setup lang="ts">
import type { FormField, FormContext } from '~/types';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    placeholder: {
        type: String,
        default: null
    },
    required: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    rows: {
        type: Number,
        default: 4
    },
    icon: {
        type: String,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    },
    varient: {
        type: String,
        default: 'outline',
        validator: (value: string) => ['outline'].includes(value)
    },
    color: {
        type: String,
        default: 'primary',
        validator: (value: string) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

// Form system integration with proper typing
const formContext = inject<FormContext | null>('form', null)
const registerFormField = inject<((field: { name: string, value: any }) => void) | null>('registerFormField', null)

const innerValue = ref(props.modelValue)

// Update innerValue when modelValue changes externally
watch(() => props.modelValue, (newValue) => {
    innerValue.value = newValue
})

// Update modelValue when innerValue changes
watch(innerValue, (newValue) => {
    emit('update:modelValue', newValue)

    // Update form state
    if (props.name && formContext) {
        formContext.setValue(props.name, newValue)
    }
})

const onBlur = () => {
    const value = innerValue.value?.toString().trim()
    innerValue.value = value

    if (formContext && props.name) {
        formContext.setTouched(props.name)
    }
}

onMounted(() => {
    if (props.name) {
        // Register with form system if needed
        if (registerFormField) {
            registerFormField({
                name: props.name,
                value: props.modelValue
            })
        }

        // Get the value from form context if available
        if (formContext && formContext.values && props.name in formContext.values) {
            innerValue.value = formContext.values[props.name]
        }
    }
})

// Add a watcher to listen for form context value changes
if (props.name && formContext) {
    watch(() => formContext.values[props.name], (newVal) => {
        if (newVal !== undefined && newVal !== innerValue.value) {
            innerValue.value = newVal
        }
    })
}
</script>

<style scoped>
textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--alt-text-color);
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    resize: vertical;
    min-height: 100px;
}

textarea.error {
    border-color: var(--danger-color, #dc3545);
}
</style>

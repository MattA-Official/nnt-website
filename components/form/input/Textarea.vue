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
            :class="[varient, color, { 'error': hasError }]"></textarea>
        <FormInputError v-if="hasError" :message="errorMessage" />
    </FormLayoutGroup>
</template>

<script setup lang="ts">
import type { FormField, ValidationRule } from '~/types';

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
    },
    error: {
        type: String,
        default: null
    },
    rules: {
        type: Array as PropType<ValidationRule[]>,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

const groupPath = inject('groupPath', [] as string[])
const registerFormField = inject('registerFormField') as (field: FormField) => void
const getFormData = inject('getFormData') as () => { [key: string]: any }

const hasError = ref(false)
const errorMessage = ref('')

const validateField = (value = props.modelValue) => {
    hasError.value = false
    errorMessage.value = ''

    const formData = getFormData?.()

    for (const rule of props.rules) {
        if (!rule.validate(value, formData)) {
            hasError.value = true
            errorMessage.value = rule.message
            return false
        }
    }
    return true
}

const innerValue = ref(props.modelValue)

// Update innerValue when modelValue changes externally
watch(() => props.modelValue, (newValue) => {
    innerValue.value = newValue
})

// Update modelValue when innerValue changes
watch(innerValue, (newValue) => {
    emit('update:modelValue', newValue)
    if (props.name) {
        registerFormField({
            name: props.name,
            value: newValue,
            groupPath
        })
    }
})

const onBlur = () => {
    const value = innerValue.value?.toString().trim()
    const isValid = validateField(value)

    if (props.name) {
        registerFormField({
            name: props.name,
            value,
            groupPath,
            isValid
        })
    }
}

onMounted(() => {
    if (props.name) {
        registerFormField({
            name: props.name,
            value: props.modelValue,
            groupPath
        })
    }
})

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
    if (props.name) {
        registerFormField({
            name: props.name,
            value: newValue,
            groupPath
        })
    }
})
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

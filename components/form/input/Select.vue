<template>
    <FormLayoutGroup>
        <div v-if="icon && !loading" class="select-icon">
            <i :class="icon"></i>
        </div>
        <div v-if="loading" class="select-icon">
            <div class="" role="status">
                <span class="hidden">Loading...</span>
            </div>
        </div>

        <select :id="id" :name="name" :required="required" :disabled="disabled" v-model="innerValue" @blur="onBlur"
            class="form-select" :class="[varient, color, { 'error': formContext && formContext.errors[name] }]">
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
        <FormInputError v-if="formContext && formContext.errors[name]"
            :message="formContext.errors[name] ?? undefined" />
    </FormLayoutGroup>
</template>

<script setup lang="ts">
import type { FormContext } from '~/types';

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    options: {
        type: Array as PropType<{ value: string, label: string }[]>,
        default: () => []
    },
    id: {
        type: String,
        default: null
    },
    name: {
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
    if (formContext && props.name) {
        formContext.setTouched(props.name)
        // Ensure the current value is properly reflected in the form
        emit('update:modelValue', innerValue.value)
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

// Enhanced watcher for form context value changes with immediate flag
if (props.name && formContext) {
    watch(() => formContext.values[props.name], (newVal) => {
        console.log(`Select ${props.name} value changed to:`, newVal)
        if (newVal !== undefined && newVal !== innerValue.value) {
            innerValue.value = newVal
            // Emit the updated value to parent components
            emit('update:modelValue', newVal)
        }
    }, { immediate: true }) // Run immediately after setup
}
</script>

<style scoped>
select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--alt-text-color);
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    background-color: white;
    appearance: auto;
}

select.error {
    border-color: var(--danger-color, #dc3545);
}
</style>

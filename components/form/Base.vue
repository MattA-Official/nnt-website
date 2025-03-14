<template>
  <form @submit.prevent="handleSubmit" ref="formRef" class="base-form">
    <slot></slot>
    <FormButtonGroup v-if="showActions">
      <FormButtonSubmit :disabled="loading || isSubmitting" @submit="handleSubmit">
        {{ submitLabel }}
      </FormButtonSubmit>
      <FormButtonCancel v-if="showCancel" @cancel="handleCancel">
        {{ cancelLabel }}
      </FormButtonCancel>
    </FormButtonGroup>
    <FormFeedbackError v-if="formError || error">{{ formError || error }}</FormFeedbackError>
  </form>
</template>

<script setup lang="ts">
import type { FormValidator, FormContext } from '~/types'

const props = defineProps({
  showActions: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  submitLabel: {
    type: String,
    default: 'Submit'
  },
  cancelLabel: {
    type: String,
    default: 'Cancel'
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  validators: {
    type: Object as PropType<Record<string, FormValidator[]>>,
    default: () => ({})
  },
  initialValues: {
    type: Object,
    default: () => ({})
  },
})

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const formRef = ref<HTMLFormElement | null>(null)
const formError = ref<string | null>(null)
const isSubmitting = ref(false)

// Initialize form with useForm composable
const form = useForm({
  initialValues: props.initialValues,
  validators: props.validators
}) as unknown as FormContext

// Registration method for field management
provide('registerFormField', (field: { name: string, value: any }) => {
  form.registerField(field.name, field.value);
})

// Provide an update method for child components
provide('updateFormField', (name: string, value: any) => {
  form.setValue(name, value)
})

// Provide form data access to child components
provide('getFormData', () => form.values)

const handleSubmit = async () => {
  formError.value = null
  isSubmitting.value = true

  try {
    const isValid = form.validateForm()

    if (isValid) {
      emit('submit', form.values)
    }
  } catch (error: any) {
    formError.value = error.message || 'An error occurred during form submission'
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

// Provide form context to children with proper typing
provide<FormContext>('form', form)

// Watch for changes in initialValues and update form fields accordingly
watch(() => props.initialValues, (newVals) => {
  Object.keys(newVals).forEach(key => {
    form.setValue(key, newVals[key])
  })
}, { deep: true })
</script>

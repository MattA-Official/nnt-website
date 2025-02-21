<template>
  <form @submit.prevent="handleSubmit" ref="formRef" class="base-form">
    <slot></slot>
    <FormButtonGroup v-if="showActions">
      <FormButtonSubmit :disabled="loading || isSubmitting" @submit.prevent="handleSubmit">
        {{ submitLabel }}
      </FormButtonSubmit>
      <FormButtonCancel v-if="showCancel" @cancel="handleCancel">
        {{ cancelLabel }}
      </FormButtonCancel>
    </FormButtonGroup>
    <FormFeedbackError v-if="error">{{ error }}</FormFeedbackError>
  </form>
</template>

<script setup lang="ts">
import type { FormField, FormGroup } from '~/types'

const formData = ref<{ [key: string]: any }>({})

const formStructure = ref<FormGroup>({
  fields: {},
  groups: {}
})

// Make formData reactive to formStructure changes
watch(formStructure, () => {
  updateFormData()
}, { deep: true })

// Updated registration method for nested structure
provide('registerFormField', (field: FormField) => {
  let target = formStructure.value
  if (field.groupPath) {
    for (const groupName of field.groupPath) {
      if (!target.groups[groupName]) {
        target.groups[groupName] = { fields: {}, groups: {} }
      }
      target = target.groups[groupName]
    }
  }
  target.fields[field.name] = field.value
  updateFormData()
})

// Function to flatten form structure into formData
const updateFormData = () => {
  formData.value = flattenFormStructure(formStructure.value)
}

const flattenFormStructure = (group: FormGroup): { [key: string]: any } => {
  let result: { [key: string]: any } = {}

  // Add direct fields
  if (Object.keys(group.fields).length > 0) {
    result = { ...group.fields }
  }

  // Add nested groups recursively
  Object.entries(group.groups).forEach(([groupName, groupData]) => {
    result[groupName] = flattenFormStructure(groupData)
  })

  return result
}

// Provide an update method for child components
provide('updateFormField', (name: string, value: any) => {
  formData.value[name] = value
})

defineProps({
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
  onSubmit: {
    type: Function,
    default: (data: any) => undefined
  },
  onCancel: {
    type: Function,
    default: () => undefined
  }
})

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const formRef = ref<HTMLFormElement | null>(null)
const isSubmitting = ref(false)

const handleSubmit = async (event: Event) => {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    // Use formData object directly instead of flattening
    const data = flattenFormStructure(formStructure.value)

    emit('submit', data)
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

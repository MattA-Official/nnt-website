<template>
  <FormBase :onSubmit="handleSubmit" :loading="isLoading" submit-label="Complete Setup" :error="error || undefined"
    :validators="formValidators" :initialValues="initialValues">
    <FormLayoutGroup type="column">
      <FormLayoutGroup>
        <FormInputLabel for="photoUpload">Profile Picture</FormInputLabel>
        <FormInputImageUpload id="photoUpload" name="photoURL" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="displayName" required>Display Name</FormInputLabel>
        <FormInput id="displayName" name="displayName" type="text" placeholder="Your name as shown publicly" required />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="username" required>Username</FormInputLabel>
        <FormInput id="username" name="username" type="text" placeholder="Your unique username" required />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="status">Status</FormInputLabel>
        <FormInputSelect id="status" name="status" :options="statusOptions" @update:modelValue="handleStatusChange" />
      </FormLayoutGroup>

      <FormLayoutGroup v-if="showGradYear">
        <FormInputLabel for="gradYear">Graduation Year</FormInputLabel>
        <FormInputSelect id="gradYear" name="gradYear" :options="gradYearOptions" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="bio">Bio</FormInputLabel>
        <FormInputTextarea id="bio" name="bio" placeholder="Tell us about yourself" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="contactNumber">Contact Number</FormInputLabel>
        <FormInput id="contactNumber" name="contactNumber" type="tel" placeholder="Your phone number" />
      </FormLayoutGroup>
    </FormLayoutGroup>
  </FormBase>
</template>

<script lang="ts" setup>
import type { FormContext, UserProfile } from '~/types'
import { validators } from '~/types/form'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      displayName: '',
      username: '',
      status: 'unknown',
      gradYear: null,
      bio: '',
      contactNumber: '',
      photoURL: ''
    })
  },
  isSetup: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['success'])

const statusOptions = [
  { value: 'student', label: 'Current UoN Student' },
  { value: 'alumni', label: 'UoN Alumni' },
  { value: 'guest', label: 'Other' },
  { value: 'unknown', label: 'Prefer not to say' }
]

const { updateProfile, isLoading, error } = useAuth()
const router = useRouter()

// Set up form validators
const formValidators = {
  displayName: [validators.required('Display name is required')],
  username: [validators.required('Username is required')],
  status: [],
  gradYear: [],
  bio: [],
  contactNumber: [validators.phone()],
  photoURL: []
}

// Create initial values from props
const initialValues = computed(() => ({
  displayName: props.initialData.displayName || '',
  username: props.initialData.username || '',
  status: props.initialData.status || 'unknown',
  gradYear: props.initialData.gradYear?.toString() || null,
  bio: props.initialData.bio || '',
  contactNumber: props.initialData.contactNumber || '',
  photoURL: props.initialData.photoURL || ''
}))

// Enhanced reactive tracking of status
const formStatus = ref(props.initialData.status || 'unknown')

// Form needs to be accessed for dynamic UI changes based on values
const formContext = inject<FormContext | null>('form', null)

// Watch the form context for status changes
watch(() => formContext?.values?.status, (newStatus) => {
  if (newStatus) {
    formStatus.value = newStatus
    console.log('Status changed to:', newStatus)
  }
}, { immediate: true })

// Use formStatus for computing visibility instead of directly using formContext
const showGradYear = computed(() => {
  const status = formStatus.value
  console.log('Computing showGradYear with status:', status)
  return status === 'student' || status === 'alumni'
})

// Get current year and generate year options
const currentYear = new Date().getFullYear()
const gradYearOptions = computed(() => {
  const years = []
  const status = formStatus.value // Use our reactive formStatus instead

  console.log('Computing gradYearOptions with status:', status)

  if (status === 'student') {
    // For students, graduation years are typically in the future
    for (let year = currentYear; year <= currentYear + 5; year++) {
      years.push({ value: year.toString(), label: year.toString() })
    }
  } else if (status === 'alumni') {
    // For alumni, graduation years are in the past
    for (let year = currentYear; year >= 1926; year--) {
      years.push({ value: year.toString(), label: year.toString() })
    }
  }

  return years
})

// Improve status change handler to update our reactive ref
const handleStatusChange = (newStatus: string) => {
  console.log('handleStatusChange called with:', newStatus)
  formStatus.value = newStatus // Update our local reactive reference first

  if (!formContext) return

  if (newStatus === 'student' || newStatus === 'alumni') {
    // Set appropriate default grad year based on status
    const defaultYear = newStatus === 'student'
      ? currentYear.toString()
      : (currentYear - 4).toString()

    formContext.setValue('gradYear', defaultYear)
    console.log('Set gradYear to:', defaultYear)
  } else {
    formContext.setValue('gradYear', null)
    console.log('Cleared gradYear')
  }
}

const handleSubmit = async (data: Partial<UserProfile>) => {
  try {
    await updateProfile(data)
    emit('success')

    if (props.isSetup) {
      await router.push('/')
    }
  } catch (err) {
    // Error handled by composable
  }
}
</script>

<style></style>
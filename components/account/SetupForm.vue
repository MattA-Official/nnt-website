<template>
  <FormBase :onSubmit="handleSubmit" :loading="isLoading" submit-label="Complete Setup" :error="error || undefined">
    <FormLayoutGroup type="column">
      <FormLayoutGroup>
        <FormInputLabel for="photoUpload">Profile Picture</FormInputLabel>
        <FormInputImageUpload id="photoUpload" name="photoURL" v-model="formData.photoURL" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="displayName" required>Display Name</FormInputLabel>
        <FormInput id="displayName" name="displayName" type="text" placeholder="Your name as shown publicly" required
          :rules="[required]" v-model="formData.displayName" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="username" required>Username</FormInputLabel>
        <FormInput id="username" name="username" type="text" placeholder="Your unique username" required
          :rules="[required]" v-model="formData.username" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="status">Status</FormInputLabel>
        <FormInputSelect id="status" name="status" :options="statusOptions" v-model="formData.status"
          @update:modelValue="handleStatusChange" />
      </FormLayoutGroup>

      <FormLayoutGroup v-if="showGradYear">
        <FormInputLabel for="gradYear">Graduation Year</FormInputLabel>
        <FormInputSelect id="gradYear" name="gradYear" :options="gradYearOptions" v-model="formData.gradYear" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="bio">Bio</FormInputLabel>
        <FormInputTextarea id="bio" name="bio" placeholder="Tell us about yourself" v-model="formData.bio" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="contactNumber">Contact Number</FormInputLabel>
        <FormInput id="contactNumber" name="contactNumber" type="tel" placeholder="Your phone number"
          v-model="formData.contactNumber" />
      </FormLayoutGroup>
    </FormLayoutGroup>
  </FormBase>
</template>

<script lang="ts" setup>
import type { UserProfile } from '~/types'
import { required } from '~/types/form'

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

// Create reactive form data object initialized with the props
const formData = reactive({
  displayName: props.initialData.displayName || '',
  username: props.initialData.username || '',
  status: props.initialData.status || 'unknown',
  gradYear: props.initialData.gradYear?.toString() || null,
  bio: props.initialData.bio || '',
  contactNumber: props.initialData.contactNumber || '',
  photoURL: props.initialData.photoURL || ''
})

// Update form data when initialData changes
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.displayName = newData.displayName || ''
    formData.username = newData.username || ''
    formData.status = newData.status || 'unknown'
    formData.gradYear = newData.gradYear?.toString() || null
    formData.bio = newData.bio || ''
    formData.contactNumber = newData.contactNumber || ''
    formData.photoURL = newData.photoURL || ''
  }
}, { deep: true })

// Derived value to determine if gradYear should be shown
const showGradYear = computed(() => ['student', 'alumni'].includes(formData.status))

// Get current year and generate year options
const currentYear = new Date().getFullYear()
const gradYearOptions = computed(() => {
  const years = []

  if (formData.status === 'student') {
    // For students, graduation years are typically in the future
    for (let year = currentYear; year <= currentYear + 5; year++) {
      years.push({ value: year.toString(), label: year.toString() })
    }
  } else if (formData.status === 'alumni') {
    // For alumni, graduation years are in the past
    for (let year = currentYear; year >= 1926; year--) {
      years.push({ value: year.toString(), label: year.toString() })
    }
  }

  return years
})

// When status changes, set an appropriate default grad year if none exists
const handleStatusChange = () => {
  if (showGradYear.value) {
    if (!formData.gradYear) {
      formData.gradYear = formData.status === 'student' ?
        currentYear.toString() :
        currentYear.toString()
    }
  } else {
    formData.gradYear = null
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
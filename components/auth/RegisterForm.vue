<template>
  <FormBase :onSubmit="handleSubmit" :loading="isLoading" submit-label="Register" :validators="formValidators"
    :initialValues="initialValues">
    <FormLayoutGroup type="column">
      <FormLayoutGroup>
        <FormInputLabel for="email" required>Email</FormInputLabel>
        <FormInput id="email" name="email" type="email" placeholder="Enter your email" required
          autocomplete="username" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="password" required>Password</FormInputLabel>
        <FormInput id="password" name="password" type="password" placeholder="Enter your password" required
          autocomplete="new-password" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="confirmPassword" required>Confirm Password</FormInputLabel>
        <FormInput id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password"
          required autocomplete="new-password" />
      </FormLayoutGroup>
    </FormLayoutGroup>
  </FormBase>
</template>

<script setup lang="ts">
import { validators } from '~/types/form'

const props = defineProps<{
  redirect?: string
}>()

const { register, isLoading, error } = await useAuth()
const router = useRouter()

// Define form validators
const formValidators = {
  email: [
    validators.required("Email is required"),
    validators.email("Please enter a valid email address")
  ],
  password: [
    validators.required("Password is required"),
    validators.minLength(8, "Password must be at least 8 characters")
  ],
  confirmPassword: [
    validators.required("Please confirm your password"),
    validators.match("password", "Passwords do not match")
  ]
}

const initialValues = {
  email: '',
  password: '',
  confirmPassword: ''
}

const handleSubmit = async (data: { email: string; password: string; confirmPassword: string }) => {
  try {
    const result = await register(data.email, data.password)

    if (result?.requiresSetup) {
      await router.push('/account/setup')
    } else {
      await router.push(props.redirect || '/')
    }
  } catch (error) {
    // Error handled by composable
  }
}
</script>

<style></style>
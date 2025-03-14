<template>
  <FormBase :onSubmit="handleSubmit" :loading="isLoading" submit-label="Login" :validators="formValidators"
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
          autocomplete="current-password" />
      </FormLayoutGroup>
    </FormLayoutGroup>
  </FormBase>
</template>

<script setup lang="ts">
import { validators } from '~/types/form'

const props = defineProps<{
  redirect?: string
}>()

const { loginWithEmail, isLoading, error } = useAuth()

// Define form validators
const formValidators = {
  email: [
    validators.required("Email is required"),
    validators.email("Please enter a valid email address")
  ],
  password: [
    validators.required("Password is required")
  ]
}

const initialValues = {
  email: '',
  password: ''
}

const handleSubmit = async (data: { email: string; password: string }) => {
  try {
    await loginWithEmail(data.email, data.password)
    await navigateTo(props.redirect || '/')
  } catch (error) {
    // Error handled by composable
  }
}
</script>

<template>
  <FormBase :onSubmit="handleSubmit" :loading="isLoading" submit-label="Login" :error="error ?? undefined">
    <FormLayoutGroup type="column">
      <FormLayoutGroup>
        <FormInputLabel for="email" required>Email</FormInputLabel>
        <FormInput id="email" name="email" type="email" placeholder="Enter your email" required
          :rules="[required, email]" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="password" required>Password</FormInputLabel>
        <FormInput id="password" name="password" type="password" placeholder="Enter your password" required
          :rules="[required, minLength(8)]" autocomplete="current-password" />
      </FormLayoutGroup>
    </FormLayoutGroup>
  </FormBase>
</template>

<script setup lang="ts">
import { required, email, minLength } from '~/types/form'

const props = defineProps<{
  redirect?: string
}>()

const { loginWithEmail, isLoading, error } = useAuth()
const router = useRouter()

const handleSubmit = async (data: { email: string; password: string }) => {
  if (!data.email || !data.password) return

  try {
    await loginWithEmail(data.email, data.password)
    await router.push(props.redirect || '/admin') // TODO: Only redirect to admin if user is admin
  } catch (error) {
    // Error handled by composable
  }
}
</script>

<template>
  <FormBase :onSubmit="handleSubmit" :loading="isLoading" submit-label="Register" :error="error ?? undefined">
    <FormLayoutGroup type="column">
      <FormLayoutGroup>
        <FormInputLabel for="email" required>Email</FormInputLabel>
        <FormInput id="email" name="email" type="email" placeholder="Enter your email" required
          :rules="[required, email]" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <FormInputLabel for="password" required>Password</FormInputLabel>
        <FormInput id="password" name="password" type="password" placeholder="Enter your password" required
          :rules="[required, minLength(8)]" />
      </FormLayoutGroup>

      <FormLayoutGroup>
        <!-- FIXME: Edgecase sometimes means "match" doesn't verify correctly -->
        <FormInputLabel for="confirmPassword" required>Confirm Password</FormInputLabel>
        <FormInput id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password"
          required :rules="[required, match('password')]" />
      </FormLayoutGroup>
    </FormLayoutGroup>
  </FormBase>
</template>

<script setup lang="ts">
import { required, email, minLength, match } from '~/types/form'

const props = defineProps<{
  redirect?: string
}>()

const { register, isLoading, error } = useAuth()
const router = useRouter()

const handleSubmit = async (data: { email: string; password: string; confirmPassword: string }) => {
  if (!data.email || !data.password) return

  try {
    await register(data.email, data.password)
    await router.push('/') // TODO: Redirect to profile setup
  } catch (error) {
    // Error handled by composable
  }
}
</script>

<style></style>
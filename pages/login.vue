<template>
  <div class="login-container">
    <h2>Login to New Theatre</h2>

    <Alert v-if="error" type="error">
      {{ error }}
    </Alert>

    <p>
      Don't have an account? <a href="/register">Register here</a>
    </p>
    <p>
      Committee member? <a href="#" @click.prevent="handleGoogleLogin" :aria-disabled="isLoading">Login with
        SSO</a>
    </p>
  </div>
</template>

<script lang="ts" setup>
const { loginWithGoogle, isLoading, error } = useAuth()
const router = useRouter()

const handleGoogleLogin = async () => {
  // ignore if already loading
  if (isLoading.value) return

  try {
    await loginWithGoogle()
    // Redirect to dashboard on success
    router.push('/admin')
  } catch (err) {
    // Error is already handled in the composable
  }
}
</script>

<style></style>
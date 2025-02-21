<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login to New Theatre</h2>

      <FormFeedbackHelp>
        Email and password login coming soon!
      </FormFeedbackHelp>

      <AuthLoginForm />

      <div class="divider">
        <span>or</span>
      </div>

      <NavButton type="secondary" :disabled="isLoading" @click="handleGoogleLogin" class="btn">
        Committee? Login with Google SSO
      </NavButton>

      <Alert v-if="error" type="error">
        {{ error }}
      </Alert>

      <p class="redirect">
        Don't have an account? <NuxtLink to="/register">Register here</NuxtLink>
      </p>

    </div>
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

// TODO: replace the form with components based form and strip out ugly styles
// TODO: implement login with email and password
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 1.5rem;
  background-color: var(--nnt-light);
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--nnt-white);
  border: 1px solid var(--nnt-orange);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.divider {
  text-align: center;
  margin: 0.75rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 60%;
  width: 45%;
  height: 1px;
  background-color: var(--primary-text-color);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  padding: 0 10px;
  color: var(--primary-text-color);
  background-color: var(--nnt-white);
  position: relative;
  z-index: 1;
}

.btn {
  width: 100%;
}

.redirect {
  text-align: center;
  margin-top: 1.5rem;
}
</style>
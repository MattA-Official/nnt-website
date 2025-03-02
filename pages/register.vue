<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Register for New Theatre</h2>

      <Alert type="info">
        Registration is currently closed. Please check back later.
      </Alert>

      <AuthRegisterForm />

      <p class="redirect">
        Already have an account? <NuxtLink to="/login">Login here</NuxtLink>
      </p>

      <Alert v-if="error" type="error">
        {{ error }}
      </Alert>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { isLoading, error } = useAuth()
const router = useRouter()
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 1.5rem;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--nnt-orange);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--alt-text-color);
  border-radius: 0.5rem;
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
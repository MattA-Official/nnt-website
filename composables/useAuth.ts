// composables/useAuth.ts
import { ref } from 'vue'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

export const useAuth = () => {
    const currentUser = useCurrentUser()
    const isLoading = ref(false)
    const error = ref('')
    const auth = useFirebaseAuth()!

    const loginWithGoogle = async () => {
        isLoading.value = true
        error.value = ''

        try {
            // Sign in with Google popup
            const provider = new GoogleAuthProvider()

            // Requested Scopes
            provider.addScope('profile')
            provider.addScope('email')

            const result = await signInWithPopup(auth, provider)
            const idToken = await result.user.getIdToken()

            // Verify with server and ensure domain restriction
            const response = await $fetch('/api/auth/google', {
                method: 'POST',
                body: { idToken }
            })

            // If successful, stay signed in
            return response
        } catch (err: any) {

            if (err.response?.status === 401) {
                error.value = 'Unauthorized domain. Only @newtheatre.org.uk emails are allowed.'
            } else {
                error.value = err.message || 'Authentication failed'
            }

            // Make sure user is signed out if the server rejected them
            await signOut(auth)

            throw err
        } finally {
            isLoading.value = false
        }
    }

    const logout = async () => {
        isLoading.value = true
        error.value = ''

        try {
            // Attempt to sign out
            await signOut(auth)
        } catch (err: any) {
            error.value = err.message || 'Logout failed'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return {
        currentUser,
        isLoading,
        error,
        loginWithGoogle,
        logout
    }
}
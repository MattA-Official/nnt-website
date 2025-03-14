<template>
    <div class="profile-setup-container">
        <div class="profile-setup-box">
            <h2>Complete Your Profile</h2>
            <p>Just a few more details to get you started!</p>

            <div v-if="isProfileLoading || isLoading" class="loading-container">
                <p>Loading your profile...</p>
                <span class="loader"></span>
            </div>

            <div v-else-if="loadError" class="error-container">
                <p>{{ loadError }}</p>
                <button @click="loadProfileData" class="retry-button">Retry</button>
            </div>

            <Transition name="fade">
                <AccountSetupForm v-if="!isProfileLoading && !isLoading && !loadError" :initialData="initialProfileData"
                    :isSetup="true" @success="onSetupComplete" />
            </Transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { UserProfile } from 'firebase/auth'

definePageMeta({
    middleware: ['auth']
})

const { getUser, getProfile, isLoading, currentUser } = useAuth()
const router = useRouter()

const initialProfileData = ref<Partial<UserProfile>>({
    displayName: '',
    username: '',
    status: 'unknown',
    gradYear: null,
    bio: '',
    contactNumber: ''
})

const isProfileLoading = ref(true)
const loadError = ref<string | null>(null)
const dataLoaded = ref(false)

const loadProfileData = async () => {
    try {
        isProfileLoading.value = true
        loadError.value = null

        // Get the user, waiting if necessary
        const user = await getUser()

        if (!user) {
            loadError.value = 'User is not authenticated'
            return
        }

        const profile = await getProfile()

        if (profile) {
            initialProfileData.value = {
                displayName: profile.displayName || user.displayName || '',
                username: profile.username || '',
                status: profile.status || 'unknown',
                gradYear: profile.gradYear || null,
                bio: profile.profile?.bio || '',
                contactNumber: profile.profile?.contactNumber || '',
                photoURL: profile.profile?.photoURL || user.photoURL || ''
            }
            dataLoaded.value = true
        }
    } catch (error) {
        console.error('Failed to load profile data:', error)
        loadError.value = 'Failed to load profile data. Please try again.'
    } finally {
        isProfileLoading.value = false
    }
}

// Load profile when component is mounted - use our enhanced getUser
onMounted(async () => {
    await loadProfileData()
})

// Watch for currentUser changes in case it loads after component mount
watch(() => currentUser.value, async (newUser) => {
    if (newUser && !dataLoaded.value) {
        await loadProfileData()
    }
}, { immediate: true })

const onSetupComplete = () => {
    router.push('/')
}
</script>

<style scoped>
.profile-setup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    padding: 1.5rem;
}

.profile-setup-box {
    width: 100%;
    max-width: 600px;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--nnt-orange);
}

h2 {
    text-align: center;
    margin-bottom: 1rem;
}

p {
    text-align: center;
    margin-bottom: 2rem;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem 0;
}

.loader {
    width: 48px;
    height: 48px;
    border: 5px solid var(--nnt-orange);
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-container {
    text-align: center;
    color: red;
    margin: 1rem 0;
}

.retry-button {
    background-color: var(--nnt-orange);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
}

/* Add transition styles */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

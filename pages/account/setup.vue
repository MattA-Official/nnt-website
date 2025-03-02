<template>
    <div class="profile-setup-container">
        <div class="profile-setup-box">
            <h2>Complete Your Profile</h2>
            <p>Just a few more details to get you started!</p>

            <AccountSetupForm :initialData="initialProfileData" :isSetup="true" @success="onSetupComplete" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { UserProfile } from 'firebase/auth'
import { useCurrentUser } from 'vuefire'

definePageMeta({
    middleware: ['auth']
})

const { userProfile, getProfile, isLoading } = useAuth()
const router = useRouter()
const currentUser = useCurrentUser()

const initialProfileData = ref<Partial<UserProfile>>({
    displayName: '',
    username: '',
    status: 'unknown',
    gradYear: null,
    bio: '',
    contactNumber: ''
})

onMounted(async () => {
    if (currentUser.value) {
        const profile = await getProfile()
        if (profile) {
            initialProfileData.value = {
                displayName: profile.displayName || currentUser.value?.displayName || '',
                username: profile.username || '',
                status: profile.status || 'unknown',
                gradYear: profile.gradYear || null,
                bio: profile.profile?.bio || '',
                contactNumber: profile.profile?.contactNumber || '',
                photoURL: profile.profile?.photoURL || currentUser.value?.photoURL || ''
            }
        }
    }
})

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
</style>

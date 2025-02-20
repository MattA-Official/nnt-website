import generateUniqueSlug from "~/server/utils/slug"
import { UserProfile } from "~/types"

export default defineEventHandler(async (event) => {
    const auth = event.context.auth
    const db = event.context.db

    try {
        const { idToken } = await readBody(event)

        // Verify the Firebase token directly
        const decodedToken = await auth.verifyIdToken(idToken)

        // Check if email ends with @newtheatre.org.uk
        if (!decodedToken.email?.endsWith('@newtheatre.org.uk')) {

            // delete the user/login method from Firebase Auth
            const result = await auth.deleteUser(decodedToken.uid).then(() => true).catch((error) => error.toJSON())

            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized domain. Only @newtheatre.org.uk emails are allowed.',
                message: 'Unauthorized domain. Only @newtheatre.org.uk emails are allowed.'
            })
        }

        // Generate session token using admin SDK
        const sessionToken = await auth.createCustomToken(decodedToken.uid)

        // TODO: Create the user in the database if they don't exist
        const userDoc = await db.collection('users').doc(decodedToken.uid).get()

        if (!userDoc.exists) {
            const username = await generateUniqueSlug(db, decodedToken.name || decodedToken.email.split('@')[0])

            const user: UserProfile = {
                uid: decodedToken.uid,
                username: username,
                displayName: decodedToken.name || decodedToken.email.split('@')[0],
                email: decodedToken.email,
                status: 'committee',
                gradYear: null,
                roles: {
                    admin: false,
                    trainer: false,
                    committee: {
                        role: 'unknown',
                    }
                },
                profile: {
                    photoURL: decodedToken.picture || null,
                    bio: null,
                    contactNumber: null,
                    preferences: {
                        emailNotifications: false,
                        pushNotifications: false,
                        language: 'en'
                    }
                },
                metadata: {
                    createdAt: new Date(),
                    lastLoginAt: new Date(),
                    isActive: true
                }
            }


            await db.collection('users').doc(decodedToken.uid).set(user)
        }

        // Return the user and session token
        const user: UserProfile = convertTimestamps(userDoc.data() as UserProfile)

        return {
            success: true,
            user: decodedToken,
            sessionToken
        }
    } catch (error: any) {
        throw createError({
            statusCode: 401,
            statusMessage: error.statusMessage || 'Unauthorized',
            message: error.message || 'Authentication failed'
        })
    }
})
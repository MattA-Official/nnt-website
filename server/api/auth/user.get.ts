import { UserProfile } from "~/types";

export default defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const db = event.context.db;

  try {
    // Verify token and get user ID
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await auth.verifyIdToken(idToken)
    const uid = decodedToken.uid

    // Get the current user profile
    const userDoc = await db.collection('users').doc(uid).get()

    if (!userDoc.exists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'User profile not found'
      })
    }

    const currentUser = convertTimestamps(userDoc.data() as UserProfile)

    return {
      success: true,
      user: currentUser
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Server Error',
      message: error.message || 'Failed to get user profile'
    })
  }
})

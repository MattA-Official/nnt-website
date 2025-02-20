const generateUniqueSlug = async (db: FirebaseFirestore.Firestore, displayName: string): Promise<string> => {
    let slug = (displayName || '').toLowerCase().replace(/\s+/g, '-')
    let counter = 0

    while (true) {
        const currentSlug = counter === 0 ? slug : `${slug}-${counter}`

        const querySnapshot = await db.collection('users').where('slug', '==', currentSlug).get()

        if (querySnapshot.empty) {
            return currentSlug
        }

        counter++
    }
}

export default generateUniqueSlug;
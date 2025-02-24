// Base Types
export interface BaseMetadata {
    createdAt: Date
    createdBy: string
    lastUpdatedAt?: Date
    lastUpdatedBy?: string
    isActive: boolean
}

// User & Auth Types
export type UserStatus = 'committee' | 'student' | 'alumni' | 'staff' | 'guest' | 'unknown'

export interface CommitteeInfo {
    // departmentId?: string
    role: string
}

export interface UserRoles {
    admin: boolean
    manager: boolean
    trainer: boolean
    committee: CommitteeInfo | false
}

export interface UserProfile {
    uid: string
    username: string
    displayName: string
    email: string
    status: UserStatus
    gradYear: number | null
    course?: string
    studentId?: string
    roles: UserRoles
    profile: {
        photoURL: string | null
        bio: string | null
        contactNumber: string | null
        socialLinks?: {
            facebook?: string
        }
        preferences?: {
            emailNotifications: boolean
            pushNotifications: boolean
            language: string
        }
    }
    metadata: Omit<BaseMetadata, 'createdBy'> & {
        lastLoginAt: Date
        verifiedAt?: Date
    }
}

// re-export form types
export * from './form'
<template>
    <div class="image-upload-container">
        <div class="preview-container" v-if="previewUrl || modelValue">
            <img :src="previewUrl || modelValue" alt="Profile Preview" class="preview-image" />
            <button type="button" class="remove-button" @click="removeImage" aria-label="Remove image">
                <span>×</span>
            </button>
        </div>

        <div v-else class="upload-placeholder" @click="triggerFileInput">
            <div class="placeholder-content">
                <span class="placeholder-icon">+</span>
                <span>Upload Photo</span>
            </div>
        </div>

        <div v-if="isUploading" class="upload-progress">
            <div class="progress-bar">
                <div class="progress-inner">Uploading...</div>
            </div>
        </div>

        <input ref="fileInput" type="file" :name="name" accept="image/*" class="hidden-input"
            @change="handleFileChange" />

        <FormInputError v-if="hasError" :message="errorMessage" />
    </div>
</template>

<script setup lang="ts">
import type { FormField } from '~/types';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: 'image'
    },
    required: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const isUploading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');

const groupPath = inject('groupPath', [] as string[])
const registerFormField = inject('registerFormField') as (field: FormField) => void

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
        hasError.value = true;
        errorMessage.value = 'Please select an image file';
        return;
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
        hasError.value = true;
        errorMessage.value = 'Image must be smaller than 2MB';
        return;
    }

    // Clear previous errors
    hasError.value = false;
    errorMessage.value = '';

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Upload the file
    try {
        isUploading.value = true;

        const formData = new FormData();
        formData.append('file', file);

        const { currentUser } = useAuth();
        const idToken = await currentUser.value?.getIdToken();

        const response = await $fetch('/api/auth/upload-profile-picture', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        if (response?.url) {
            emit('update:modelValue', response.url);

            // Register with form system if inside a form
            if (props.name && registerFormField) {
                registerFormField({
                    name: props.name,
                    value: response.url,
                    groupPath,
                    isValid: true
                });
            }
        }
    } catch (error: any) {
        hasError.value = true;
        errorMessage.value = error.message || 'Failed to upload image';
        previewUrl.value = null;
    } finally {
        isUploading.value = false;

        // Reset the input so the same file can be selected again if needed
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    }
};

const removeImage = () => {
    previewUrl.value = null;
    emit('update:modelValue', '');

    if (props.name && registerFormField) {
        registerFormField({
            name: props.name,
            value: '',
            groupPath
        });
    }

    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Initialize form field
onMounted(() => {
    if (props.name && registerFormField) {
        registerFormField({
            name: props.name,
            value: props.modelValue,
            groupPath
        });
    }
});
</script>

<style scoped>
.image-upload-container {
    width: 100%;
    margin-bottom: 1rem;
}

.upload-placeholder {
    width: 100%;
    height: 150px;
    border: 2px dashed var(--alt-text-color);
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.03);
    transition: all 0.2s ease;
}

.upload-placeholder:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--alt-text-color);
}

.placeholder-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.hidden-input {
    display: none;
}

.preview-container {
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
}

.preview-image {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 0.5rem;
}

.remove-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    color: var(--danger-color, #dc3545);
    transition: all 0.2s ease;
}

.remove-button:hover {
    background-color: rgba(255, 255, 255, 1);
}

.upload-progress {
    margin-top: 0.5rem;
}

.progress-bar {
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
}

.progress-inner {
    width: 100%;
    height: 100%;
    background-color: var(--nnt-orange);
    animation: progress-animation 1s infinite linear;
    display: flex;
    align-items: center;
    justify-content: center;
    color: transparent;
    font-size: 0.1px;
}

@keyframes progress-animation {
    0% {
        width: 0%;
        margin-left: 0;
    }

    50% {
        width: 50%;
    }

    100% {
        width: 0%;
        margin-left: 100%;
    }
}
</style>

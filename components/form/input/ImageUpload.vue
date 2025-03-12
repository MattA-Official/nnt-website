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

        <FormInputError v-if="formContext && formContext.errors[name]"
            :message="formContext.errors[name] ?? undefined" />
    </div>
</template>

<script setup lang="ts">
import type { FormContext } from '~/types';

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

// Form system integration with proper typing
const formContext = inject<FormContext | null>('form', null);
const registerFormField = inject<((field: { name: string, value: any }) => void) | null>('registerFormField', null);

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
        // Use setValue to set empty value and let validators handle the error
        if (formContext && props.name) {
            formContext.setValue(props.name, '');
            formContext.setTouched(props.name); // Trigger validation
        }
        return;
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
        // Use setValue to set empty value and let validators handle the error
        if (formContext && props.name) {
            formContext.setValue(props.name, '');
            formContext.setTouched(props.name); // Trigger validation
        }
        return;
    }

    // No need to explicitly clear errors - setting a valid value will do this automatically
    // when validation runs

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

        // Use the new getUser function
        const { getUser } = useAuth();
        const user = await getUser();
        if (!user) {
            throw new Error('Not authenticated');
        }

        const idToken = await user.getIdToken();

        const response = await $fetch('/api/auth/upload-profile-picture', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        if (response?.url) {
            emit('update:modelValue', response.url);

            // Update form state
            if (formContext && props.name) {
                formContext.setValue(props.name, response.url);
            } else if (registerFormField && props.name) {
                registerFormField({
                    name: props.name,
                    value: response.url
                });
            }
        }
    } catch (error: any) {
        // Handle upload error by setting empty value and triggering validation
        if (formContext && props.name) {
            formContext.setValue(props.name, '');
            formContext.setTouched(props.name);
        }
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

    // Update form state
    if (formContext && props.name) {
        formContext.setValue(props.name, '');
    } else if (registerFormField && props.name) {
        registerFormField({
            name: props.name,
            value: ''
        });
    }

    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Initialize form field
onMounted(() => {
    if (formContext && props.name) {
        // The form context will initialize the value
    } else if (registerFormField && props.name) {
        registerFormField({
            name: props.name,
            value: props.modelValue
        });
    }
});

// Watch for model value changes
watch(() => props.modelValue, (newValue) => {
    if (newValue && !previewUrl.value) {
        previewUrl.value = newValue;
    }
});

onMounted(() => {
    if (props.name) {
        // Register with form system if needed
        if (registerFormField) {
            registerFormField({
                name: props.name,
                value: props.modelValue
            })
        }

        // Get the value from form context if available
        if (formContext && formContext.values && props.name in formContext.values) {
            const formValue = formContext.values[props.name]
            if (formValue) {
                previewUrl.value = formValue
                emit('update:modelValue', formValue)
            }
        }
    }
})

// Add a watcher to listen for form context value changes
if (props.name && formContext) {
    watch(() => formContext.values[props.name], (newVal) => {
        if (newVal && newVal !== previewUrl.value) {
            previewUrl.value = newVal
            emit('update:modelValue', newVal)
        }
    })
}
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

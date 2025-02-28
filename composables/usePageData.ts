import type { PagesCollectionItem } from "@nuxt/content"

// Default empty state to ensure consistency
const defaultPageData: PagesCollectionItem = {
    title: '',
    description: '',
    body: {
        toc: {
            links: [],
            title: "",
            depth: 0,
            searchDepth: 0
        },
        type: "root",
        children: []
    },
    path: "",
    seo: {
        title: undefined,
        description: undefined
    },
    id: "",
    stem: "",
    extension: "",
    meta: {
        layout: "default"
    }
}

// Use Nuxt's built-in useState for shared state management
export function usePageData() {
    const route = useRoute()

    // Create or access the shared state with a consistent default value
    const pageData = useState<PagesCollectionItem>('pageData', () => defaultPageData)
    const currentLayout = useState<string>('layout', () => 'default')

    // Fetch page data based on the current route
    const fetchPageData = async () => {
        const page = await queryCollection('pages').path(route.path).first();

        setPageData(page || null)
        return page
    }

    // Set the page data and update layout
    const setPageData = (data: PagesCollectionItem | null) => {
        if (!data) {
            pageData.value = defaultPageData
            currentLayout.value = 'default'
            return
        }

        // Ensure we're creating a new object with proper defaults
        pageData.value = data

        // Update the layout based on page metadata
        currentLayout.value = data.meta.layout as string || 'default'
    }

    const tocLinks = computed(() => {
        return pageData.value.body.toc?.links || []
    })

    const layout = computed(() => {
        return currentLayout.value
    })

    return {
        pageData,
        tocLinks,
        layout,
        fetchPageData,
    }
}

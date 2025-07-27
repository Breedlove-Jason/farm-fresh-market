// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get products data from global object
    const productsData = window.productsData;

    // Initialize all features
    initializeSearch();
    initializeFilters();
    initializeDeleteModal();
    initializeAnimations();
    initializeStats();
    addInteractiveEffects();

    /**
     * Initialize search functionality
     */
    function initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');

        if (searchInput && clearSearch) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();

                if (searchTerm) {
                    clearSearch.style.display = 'block';
                } else {
                    clearSearch.style.display = 'none';
                }

                filterProducts();
            });

            clearSearch.addEventListener('click', function() {
                searchInput.value = '';
                this.style.display = 'none';
                filterProducts();
                searchInput.focus();
            });
        }
    }

    /**
     * Initialize category filters
     */
    function initializeFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const clearFilters = document.getElementById('clearFilters');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterProducts);
        }

        if (clearFilters) {
            clearFilters.addEventListener('click', function() {
                const searchInput = document.getElementById('searchInput');
                const categoryFilter = document.getElementById('categoryFilter');
                const clearSearch = document.getElementById('clearSearch');

                if (searchInput) searchInput.value = '';
                if (categoryFilter) categoryFilter.value = 'all';
                if (clearSearch) clearSearch.style.display = 'none';

                filterProducts();
            });
        }
    }

    /**
     * Filter products based on search and category
     */
    function filterProducts() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const productItems = document.querySelectorAll('.product-item');
        const noResults = document.getElementById('noResults');
        const productsGrid = document.getElementById('productsGrid');

        if (!searchInput || !categoryFilter || !productItems.length) return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;

        let visibleCount = 0;

        productItems.forEach(item => {
            const productName = item.getAttribute('data-name') || '';
            const productCategory = item.getAttribute('data-category') || '';

            const matchesSearch = !searchTerm || productName.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;

            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
                item.classList.remove('filtered-out');
                item.classList.add('filtered-in');
                visibleCount++;

                // Add staggered animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, visibleCount * 50);
            } else {
                item.classList.remove('filtered-in');
                item.classList.add('filtered-out');

                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

        // Show/hide no results message
        if (noResults && productsGrid) {
            if (visibleCount === 0) {
                noResults.style.display = 'block';
                productsGrid.style.display = 'none';
                updateSearchSummary(searchTerm, selectedCategory, 0);
            } else {
                noResults.style.display = 'none';
                productsGrid.style.display = 'block';
                updateSearchSummary(searchTerm, selectedCategory, visibleCount);
            }
        }

        // Update stats
        updateFilteredStats(visibleCount);
    }

    /**
     * Update search summary in no results area
     */
    function updateSearchSummary(searchTerm, category, count) {
        const noResults = document.getElementById('noResults');
        if (!noResults) return;

        let message = 'No products found';
        if (searchTerm && category !== 'all') {
            message += ` matching "${searchTerm}" in ${category} category`;
        } else if (searchTerm) {
            message += ` matching "${searchTerm}"`;
        } else if (category !== 'all') {
            message += ` in ${category} category`;
        }

        const messageElement = noResults.querySelector('h4');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }

    /**
     * Initialize delete modal functionality
     */
    function initializeDeleteModal() {
        const deleteButtons = document.querySelectorAll('.delete-product');
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        const deleteForm = document.getElementById('deleteForm');
        const productNameSpan = document.getElementById('productNameToDelete');

        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                const productId = this.getAttribute('data-product-id');
                const productName = this.getAttribute('data-product-name');

                if (productNameSpan && deleteForm) {
                    productNameSpan.textContent = productName;
                    deleteForm.action = `/products/${productId}?_method=DELETE`;
                }

                deleteModal.show();
            });
        });

        // Handle form submission with loading state
        if (deleteForm) {
            deleteForm.addEventListener('submit', function () {
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalHTML = submitBtn.innerHTML;
                }
            });
        }
    }
});
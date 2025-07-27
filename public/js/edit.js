document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    const productCategory = document.getElementById('productCategory');
    const form = document.getElementById('editForm');
    
    // Preview elements
    const pricePreview = document.getElementById('pricePreview');
    const priceDisplay = document.getElementById('priceDisplay');
    const categoryPreview = document.getElementById('categoryPreview');
    const categoryIcon = document.getElementById('categoryIcon');
    const categoryText = document.getElementById('categoryText');
    
    // Product preview card
    const previewIcon = document.getElementById('previewIcon');
    const previewName = document.getElementById('previewName');
    const previewPrice = document.getElementById('previewPrice');
    const previewCategory = document.getElementById('previewCategory');
    
    // Changes tracking
    const changesSummary = document.getElementById('changesSummary');
    const changesList = document.getElementById('changesList');
    
    // Get original values from the global productData object
    const originalName = window.productData.name;
    const originalPrice = window.productData.price;
    const originalCategory = window.productData.category;

    // Initialize the form
    function initializeForm() {
        // Initialize category preview
        updateCategoryPreview(originalCategory);
        pricePreview.style.display = 'block';
        
        // Add entrance animations
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            formContainer.style.opacity = '0';
            formContainer.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                formContainer.style.transition = 'all 0.6s ease';
                formContainer.style.opacity = '1';
                formContainer.style.transform = 'translateY(0)';
            }, 200);
        }
    }

    // Price input handler
    productPrice.addEventListener('input', function() {
        const price = parseFloat(this.value) || 0;
        priceDisplay.textContent = price.toFixed(2);
        previewPrice.textContent = '$' + price.toFixed(2);
        checkForChanges();
    });

    // Category selector handler
    productCategory.addEventListener('change', function() {
        updateCategoryPreview(this.value);
        checkForChanges();
    });

    // Product name handler
    productName.addEventListener('input', function() {
        previewName.textContent = this.value || 'Product Name';
        checkForChanges();
    });

    function updateCategoryPreview(category) {
        let icon, text, iconClass;
        
        switch(category) {
            case 'fruit':
                icon = 'fas fa-apple-alt';
                iconClass = 'text-success';
                text = 'Fresh Fruit';
                break;
            case 'vegetable':
                icon = 'fas fa-carrot';
                iconClass = 'text-warning';
                text = 'Fresh Vegetable';
                break;
            case 'dairy':
                icon = 'fas fa-cheese';
                iconClass = 'text-info';
                text = 'Dairy Product';
                break;
            default:
                if (categoryPreview) {
                    categoryPreview.style.display = 'none';
                }
                return;
        }
        
        if (categoryIcon && categoryText && categoryPreview) {
            categoryIcon.className = icon + ' fa-2x mb-2 ' + iconClass;
            categoryText.textContent = text;
            categoryPreview.style.display = 'block';
        }
        
        // Update preview card
        if (previewIcon && previewCategory) {
            previewIcon.className = icon + ' fa-3x text-primary mb-2';
            previewCategory.textContent = text;
        }
    }

    function checkForChanges() {
        const currentName = productName.value.trim();
        const currentPrice = parseFloat(productPrice.value) || 0;
        const currentCategory = productCategory.value;
        
        const changes = [];
        
        if (currentName !== originalName) {
            changes.push(`Name: "${originalName}" → "${currentName}"`);
        }
        
        if (Math.abs(currentPrice - originalPrice) > 0.001) { // Account for floating point precision
            changes.push(`Price: $${originalPrice.toFixed(2)} → $${currentPrice.toFixed(2)}`);
        }
        
        if (currentCategory !== originalCategory) {
            const oldCat = originalCategory.charAt(0).toUpperCase() + originalCategory.slice(1);
            const newCat = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
            changes.push(`Category: ${oldCat} → ${newCat}`);
        }
        
        if (changes.length > 0 && changesSummary && changesList) {
            changesList.innerHTML = changes.map(change => 
                `<li><i class="fas fa-arrow-right text-primary me-2"></i>${change}</li>`
            ).join('');
            changesSummary.style.display = 'block';
        } else if (changesSummary) {
            changesSummary.style.display = 'none';
        }
    }

    // Form submission with loading state
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('.btn-submit');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                
                // Add loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving Changes...';
                submitBtn.disabled = true;
                
                // Re-enable after 3 seconds (in case of errors)
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // Form validation feedback
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    });

    // Initialize everything
    initializeForm();
});
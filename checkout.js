// Theme Switching
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    // Theme toggle handler
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Quantity Controls
    const quantityControls = document.querySelectorAll('.quantity-control');
    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('.minus');
        const plusBtn = control.querySelector('.plus');
        const input = control.querySelector('.qty-input');

        minusBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateCartTotals();
            }
        });

        plusBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            input.value = value + 1;
            updateCartTotals();
        });

        input.addEventListener('change', () => {
            let value = parseInt(input.value);
            if (value < 1) input.value = 1;
            updateCartTotals();
        });
    });

    // Remove Item
    const removeButtons = document.querySelectorAll('.action-btn');
    removeButtons.forEach(btn => {
        if (btn.innerHTML.includes('Remove')) {
            btn.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                cartItem.style.opacity = '0';
                setTimeout(() => {
                    cartItem.remove();
                    updateCartTotals();
                    updateCartCount();
                }, 300);
            });
        }
    });

    // Save for Later
    const saveButtons = document.querySelectorAll('.action-btn');
    saveButtons.forEach(btn => {
        if (btn.innerHTML.includes('Save for later')) {
            btn.addEventListener('click', () => {
                const icon = btn.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    showToast('Item saved for later');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    showToast('Item removed from saved items');
                }
            });
        }
    });

    // Format currency to Indonesian Rupiah
    function formatToRupiah(number) {
        return 'Rp ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Parse Rupiah string to number
    function parseRupiah(rupiahString) {
        return parseInt(rupiahString.replace(/[^\d]/g, ''));
    }

    // Update Cart Totals
    function updateCartTotals() {
        const cartItems = document.querySelectorAll('.cart-item');
        let subtotal = 0;
        const deliveryCost = 75000; // Rp 75.000 delivery cost

        cartItems.forEach(item => {
            const price = parseRupiah(item.querySelector('.price').textContent);
            const quantity = parseInt(item.querySelector('.qty-input').value);
            subtotal += price * quantity;
        });

        const total = subtotal + deliveryCost;

        // Update display
        document.querySelector('.summary-details .summary-line:first-child span:last-child').textContent = formatToRupiah(subtotal);
        document.querySelector('.summary-total span:last-child').textContent = formatToRupiah(total);

        // Update cart count
        updateCartCount();
    }

    // Update Cart Count
    function updateCartCount() {
        const cartItems = document.querySelectorAll('.cart-item');
        let totalItems = 0;

        cartItems.forEach(item => {
            const quantity = parseInt(item.querySelector('.qty-input').value);
            totalItems += quantity;
        });

        document.querySelector('.shopping-cart h2').textContent = `Shopping bag (${totalItems})`;
    }

    // Toast Notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Add styles dynamically
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = 'var(--card-bg)';
        toast.style.color = 'var(--text-color)';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '25px';
        toast.style.backdropFilter = 'blur(10px)';
        toast.style.border = '1px solid var(--border-color)';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';

        // Show toast
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);

        // Remove toast
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Postal Code Edit
    const postalEdit = document.querySelector('.edit-btn');
    const postalInput = document.querySelector('.postal-input');

    postalEdit.addEventListener('click', () => {
        postalInput.removeAttribute('readonly');
        postalInput.focus();
        postalEdit.textContent = 'Save';
        
        const savePostal = () => {
            postalInput.setAttribute('readonly', true);
            postalEdit.textContent = 'Edit';
            showToast('Postal code updated');
        };

        postalInput.addEventListener('blur', savePostal, { once: true });
        postalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                savePostal();
            }
        }, { once: true });
    });

    // Payment Modal Handling
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        $('#paymentModal').modal('show');
        startPaymentTimer();
    });

    function startPaymentTimer() {
        let timeLeft = 15 * 60; // 15 minutes in seconds
        const timerDisplay = document.getElementById('paymentTimer');
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                $('#paymentModal').modal('hide');
                alert('Payment session expired. Please try again.');
            }
            
            timeLeft--;
        }, 1000);

        // Clear timer when modal is closed
        $('#paymentModal').on('hidden.bs.modal', function () {
            clearInterval(timer);
        });
    }

    // Check Payment Status Button
    document.getElementById('checkPaymentStatus').addEventListener('click', function() {
        // Simulate payment check
        const randomSuccess = Math.random() < 0.5;
        if (randomSuccess) {
            alert('Payment successful! Thank you for your purchase.');
            $('#paymentModal').modal('hide');
            window.location.href = 'index.html';
        } else {
            alert('Payment not yet received. Please complete the payment or try again later.');
        }
    });

    // Initialize
    updateCartTotals();
}); 
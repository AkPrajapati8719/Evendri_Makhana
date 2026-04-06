// --- Cart State & Logic (Dark Premium SEO Edition) ---
let cart = JSON.parse(localStorage.getItem('evendri_cart')) || [];

const CartManager = {
    add(id, name, price, img) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ id, name, price: parseInt(price), img, qty: 1 });
        }
        this.saveAndRender();
        this.openCartUI();
    },

    updateQty(id, delta) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) this.remove(id);
            else this.saveAndRender();
        }
    },

    remove(id) {
        cart = cart.filter(item => item.id !== id);
        this.saveAndRender();
    },

    saveAndRender() {
        localStorage.setItem('evendri_cart', JSON.stringify(cart));
        this.render();
    },

    render() {
        const container = document.getElementById('cart-items-container');
        const subtotalEl = document.getElementById('cart-subtotal');
        const badges = document.querySelectorAll('#cart-btn span, #cart-btn-mobile span');

        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        
        // SEO/Accessibility: Update badges and provide aria-labels if possible
        badges.forEach(b => {
            b.innerText = totalQty;
            b.parentElement.setAttribute('aria-label', `Cart contains ${totalQty} items`);
        });

        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-20 text-gray-500" role="status">
                    <i class="fas fa-shopping-bag text-4xl mb-4 opacity-20" aria-hidden="true"></i>
                    <p class="font-medium">Your premium snack bag is empty</p>
                </div>`;
            if (subtotalEl) subtotalEl.innerText = `₹0`;
            return;
        }

        let html = '';
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += (item.price * item.qty);
            // SEO UPDATE: Added aria-labels and descriptive titles for buttons
            html += `
            <div class="flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-white/5 mb-4 group transition-all hover:border-secondary/30" role="listitem">
                <div class="flex items-center">
                    <div class="relative overflow-hidden rounded-xl border border-white/10">
                        <img src="${item.img}" alt="${item.name} - Evendri Makhana" class="w-16 h-16 object-cover shadow-2xl transition group-hover:scale-110">
                    </div>
                    <div class="ml-4">
                        <h4 class="font-bold text-white text-sm">${item.name}</h4>
                        <p class="font-black text-secondary mt-1 text-xs" aria-label="Price">₹${item.price}</p>
                    </div>
                </div>
                <div class="text-right flex flex-col items-end">
                    <button onclick="CartManager.remove(${item.id})" 
                            title="Remove ${item.name} from bag" 
                            aria-label="Remove item"
                            class="text-gray-500 hover:text-red-400 transition mb-3 text-xs">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                    <div class="flex items-center bg-slate-900 rounded-full px-3 py-1 border border-white/5">
                        <button onclick="CartManager.updateQty(${item.id}, -1)" 
                                title="Decrease quantity" 
                                aria-label="Decrease quantity"
                                class="text-gray-400 hover:text-secondary px-2 font-bold">-</button>
                        <span class="px-2 text-xs font-bold text-white" aria-label="Quantity">${item.qty}</span>
                        <button onclick="CartManager.updateQty(${item.id}, 1)" 
                                title="Increase quantity" 
                                aria-label="Increase quantity"
                                class="text-gray-400 hover:text-secondary px-2 font-bold">+</button>
                    </div>
                </div>
            </div>`;
        });

        // SEO FIX: Use role="list" for the container to help crawlers understand structure
        container.setAttribute('role', 'list');
        container.innerHTML = html;
        if (subtotalEl) {
            subtotalEl.innerText = `₹${subtotal}`;
            subtotalEl.setAttribute('aria-label', `Total amount: ${subtotal} Rupees`);
        }
    },

    openCartUI() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('overlay');
        if (drawer) {
            drawer.classList.remove('translate-x-full');
            drawer.setAttribute('aria-hidden', 'false');
        }
        if (overlay) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        }
    }
};
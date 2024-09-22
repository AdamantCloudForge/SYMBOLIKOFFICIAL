// client/script.js
const stripe = Stripe('your_stripe_publishable_key');

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.getElementById('products');
            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                    <input type="number" id="quantity-${product.id}" min="1" value="1">
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
                `;
                productsContainer.appendChild(productDiv);
            });
        });

    let cart = [];

    window.addToCart = (id, name, price) => {
        const quantity = document.getElementById(`quantity-${id}`).value;
        cart.push({ id, name, price, quantity: parseInt(quantity) });
        alert(`${name} added to cart!`);
    };

    document.getElementById('checkoutButton').addEventListener('click', async () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const { id } = await fetch('http://localhost:5000/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart })
        }).then(response => response.json());

        const result = await stripe.redirectToCheckout({ sessionId: id });

        if (result.error) {
            alert(result.error.message);
        }
    });
});

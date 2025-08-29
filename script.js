const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');

document.getElementById('comprar-produto-1').addEventListener('click', () => {
 stripe.redirectToCheckout({
 lineItems: [
 {
 price: 'PRICE_ID_PRODUTO_1',
 quantity: 1,
 },
 ],
 mode: 'payment',
 successUrl: 'https:                       
 cancelUrl: '//seusite.com/success',
 cancelUrl: 'https://seusite.com/cancel',
 });
});

document.getElementById('comprar-produto-2').addEventListener('click', () => {
 stripe.redirectToCheckout({
 lineItems: [
 {
 price: 'PRICE_ID_PRODUTO_2',
 quantity: 1,
 },
 ],
 mode: 'payment',
 successUrl: 'https:                       
 cancelUrl: '//seusite.com/success',
 cancelUrl: 'https://seusite.com/cancel',
 });
});
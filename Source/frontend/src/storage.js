const KEY = 'toy-shelf-session';
const CART_KEY = 'toy-shelf-cart';

export function loadSession() {
  const value = localStorage.getItem(KEY);
  return value ? JSON.parse(value) : null;
}

export function saveSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function loadCart() {
  const value = localStorage.getItem(CART_KEY);
  return value ? JSON.parse(value) : {};
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

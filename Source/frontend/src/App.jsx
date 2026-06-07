import { useEffect, useMemo, useState } from 'react';
import {
  LogIn,
  LogOut,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  UserRound,
} from 'lucide-react';
import { request } from './api';
import { clearCart, clearSession, loadCart, loadSession, saveCart, saveSession } from './storage';

const initialUser = { name: '', email: '', age: '' };

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

function App() {
  const [session, setSession] = useState(loadSession());
  const [loginForm, setLoginForm] = useState({ login: 'client', password: 'client123', role: 'client' });
  const [users, setUsers] = useState([]);
  const [toys, setToys] = useState([]);
  const [cart, setCart] = useState(loadCart());
  const [category, setCategory] = useState('Все');
  const [newUser, setNewUser] = useState(initialUser);
  const [message, setMessage] = useState('');

  const canCreateUsers = session?.role === 'admin';
  const canBuy = session?.role === 'client' || session?.role === 'admin';

  const roleLabel = useMemo(() => {
    if (!session) return 'не выполнен';
    return session.role === 'admin' ? 'администратор' : session.role === 'client' ? 'клиент' : 'гость';
  }, [session]);

  const categories = useMemo(() => ['Все', ...new Set(toys.map((toy) => toy.category))], [toys]);
  const visibleToys = useMemo(
    () => (category === 'Все' ? toys : toys.filter((toy) => toy.category === category)),
    [category, toys],
  );

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => {
          const toy = toys.find((item) => item.id === id);
          return toy ? { ...toy, quantity } : null;
        })
        .filter(Boolean),
    [cart, toys],
  );

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  async function loadData() {
    setMessage('');
    try {
      const [usersPayload, toysPayload] = await Promise.all([request('/users'), request('/toys')]);
      setUsers(usersPayload);
      setToys(toysPayload);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setMessage('');
    try {
      const payload = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginForm),
      });
      saveSession(payload);
      setSession(payload);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleCreateUser(event) {
    event.preventDefault();
    setMessage('');
    try {
      await request('/users', {
        method: 'POST',
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          age: newUser.age ? Number(newUser.age) : undefined,
        }),
      });
      setNewUser(initialUser);
      await loadData();
      setMessage('Пользователь создан');
    } catch (error) {
      setMessage(error.message);
    }
  }

  function updateCart(nextCart) {
    setCart(nextCart);
    saveCart(nextCart);
  }

  function addToCart(toy) {
    if (!canBuy) {
      setMessage('Войдите как клиент или администратор, чтобы добавлять товары в корзину');
      return;
    }
    if (!toy.available) {
      setMessage('Товар временно отсутствует');
      return;
    }
    const currentQuantity = cart[toy.id] || 0;
    if (currentQuantity >= toy.stock) {
      setMessage('В корзине уже максимальное доступное количество');
      return;
    }
    updateCart({ ...cart, [toy.id]: currentQuantity + 1 });
    setMessage(`${toy.title} добавлен в корзину`);
  }

  function decreaseCartItem(id) {
    const currentQuantity = cart[id] || 0;
    if (currentQuantity <= 1) {
      const { [id]: removed, ...nextCart } = cart;
      updateCart(nextCart);
      return;
    }
    updateCart({ ...cart, [id]: currentQuantity - 1 });
  }

  function removeCartItem(id) {
    const { [id]: removed, ...nextCart } = cart;
    updateCart(nextCart);
  }

  function handleCheckout() {
    if (!cartCount) {
      setMessage('Корзина пока пустая');
      return;
    }
    updateCart({});
    clearCart();
    setMessage('Заказ оформлен в демонстрационном режиме');
  }

  function handleLogout() {
    clearSession();
    setSession(null);
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <main className="app">
      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">Toy Shelf</p>
          <h1>Магазин игрушек с корзиной и API</h1>
          <p className="lead">
            Витрина товаров, роли пользователей, LocalStorage, корзина и серверная валидация данных.
          </p>
        </div>
        <div className="heroStats">
          <div>
            <strong>{toys.length}</strong>
            <span>товаров</span>
          </div>
          <div>
            <strong>{users.length}</strong>
            <span>пользователей</span>
          </div>
          <div>
            <strong>{cartCount}</strong>
            <span>в корзине</span>
          </div>
        </div>
      </section>

      <section className="topbar">
        <div className="session">
          <ShieldCheck size={18} />
          <span>Вход: {roleLabel}</span>
          {session && (
            <button type="button" className="iconButton" onClick={handleLogout} title="Выйти">
              <LogOut size={18} />
            </button>
          )}
        </div>
        <button type="button" className="secondary" onClick={loadData}>
          <RefreshCw size={18} />
          Обновить
        </button>
      </section>

      {message && <div className="alert">{message}</div>}

      {!session && (
        <section className="authPanel">
          <h2>Вход в приложение</h2>
          <form onSubmit={handleLogin} className="formGrid">
            <label>
              Логин
              <input value={loginForm.login} onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })} />
            </label>
            <label>
              Пароль
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </label>
            <label>
              Роль
              <select value={loginForm.role} onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })}>
                <option value="client">Клиент</option>
                <option value="admin">Администратор</option>
                <option value="guest">Гость</option>
              </select>
            </label>
            <button type="submit" className="primary">
              <LogIn size={18} />
              Войти
            </button>
          </form>
        </section>
      )}

      <section className="layout">
        <div className="catalog">
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Каталог</p>
              <h2>Игрушки</h2>
            </div>
            <div className="categoryTabs">
              {categories.map((item) => (
                <button
                  type="button"
                  className={item === category ? 'tab activeTab' : 'tab'}
                  key={item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="productGrid">
            {visibleToys.map((toy) => (
              <article className="productCard" key={toy.id}>
                <div className="productImageWrap">
                  <img src={toy.image} alt={toy.title} className="productImage" />
                  <span className={toy.available ? 'badge available' : 'badge unavailable'}>
                    {toy.available ? 'В наличии' : 'Нет в наличии'}
                  </span>
                </div>
                <div className="productBody">
                  <div className="productTitleRow">
                    <h3>{toy.title}</h3>
                    <span className="rating">{toy.rating}</span>
                  </div>
                  <p>{toy.description}</p>
                  <div className="productMeta">
                    <span>{toy.category}</span>
                    <span>Остаток: {toy.stock}</span>
                  </div>
                  <div className="buyRow">
                    <strong>{formatPrice(toy.price)}</strong>
                    <button type="button" className="primary" onClick={() => addToCart(toy)} disabled={!toy.available}>
                      <ShoppingCart size={18} />
                      В корзину
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="cartPanel">
          <div className="sectionHeader compact">
            <div>
              <p className="eyebrow">Покупка</p>
              <h2>Корзина</h2>
            </div>
            <ShoppingCart size={22} />
          </div>

          {cartItems.length === 0 ? (
            <div className="emptyCart">Корзина пустая. Войдите как клиент или администратор и добавьте товары.</div>
          ) : (
            <div className="cartItems">
              {cartItems.map((item) => (
                <article className="cartItem" key={item.id}>
                  <img src={item.image} alt={item.title} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{formatPrice(item.price)} × {item.quantity}</span>
                    <div className="quantityControls">
                      <button type="button" className="iconButton" onClick={() => decreaseCartItem(item.id)} title="Уменьшить">
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" className="iconButton" onClick={() => addToCart(item)} title="Увеличить">
                        <Plus size={16} />
                      </button>
                      <button type="button" className="iconButton danger" onClick={() => removeCartItem(item.id)} title="Удалить">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="cartSummary">
            <span>Итого</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>
          <button type="button" className="checkout" onClick={handleCheckout}>
            Оформить заказ
          </button>
        </aside>
      </section>

      <section className="adminArea">
        <div className="usersBox">
          <div className="sectionHeader compact">
            <div>
              <p className="eyebrow">API</p>
              <h2>Пользователи</h2>
            </div>
            <UserRound size={22} />
          </div>
          <div className="usersList">
            {users.map((user) => (
              <article className="userItem" key={user.id}>
                <UserRound size={18} />
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}{user.age ? ` · ${user.age}` : ''}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {canCreateUsers && (
          <div className="createUserBox">
            <div className="sectionHeader compact">
              <div>
                <p className="eyebrow">Администратор</p>
                <h2>Создание пользователя</h2>
              </div>
            </div>
            <form onSubmit={handleCreateUser} className="formGrid adminForm">
              <label>
                Имя
                <input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              </label>
              <label>
                Email
                <input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              </label>
              <label>
                Возраст
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={newUser.age}
                  onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                />
              </label>
              <button type="submit" className="primary">
                <Plus size={18} />
                Создать
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;

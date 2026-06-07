import { useEffect, useMemo, useState } from 'react';
import { LogOut, Minus, Plus, RefreshCw, ShoppingCart, Trash2, UserRound } from 'lucide-react';
import { request } from './api';
import { clearCart, clearSession, loadCart, loadSession, saveCart, saveSession } from './storage';

const initialRegister = { name: '', email: '', age: '', password: '' };
const initialLogin = { login: '', password: '', role: 'client' };

function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

function App() {
  const [session, setSession] = useState(loadSession());
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [startMode, setStartMode] = useState('login');
  const [users, setUsers] = useState([]);
  const [toys, setToys] = useState([]);
  const [cart, setCart] = useState(loadCart());
  const [category, setCategory] = useState('Все');
  const [message, setMessage] = useState('');

  const isAdmin = session?.role === 'admin';

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

  async function handleRegister(event) {
    event.preventDefault();
    setMessage('');
    try {
      const user = await request('/users', {
        method: 'POST',
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          age: registerForm.age ? Number(registerForm.age) : undefined,
        }),
      });
      const nextSession = {
        token: `profile-${user.id}`,
        role: 'client',
        login: user.email,
        user,
      };
      saveSession(nextSession);
      setSession(nextSession);
      setRegisterForm(initialRegister);
      await loadData();
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
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDeleteUser(id) {
    setMessage('');
    try {
      await request(`/users/${id}`, { method: 'DELETE' });
      await loadData();
      setMessage('Пользователь удален');
    } catch (error) {
      setMessage(error.message);
    }
  }

  function updateCart(nextCart) {
    setCart(nextCart);
    saveCart(nextCart);
  }

  function addToCart(toy) {
    if (!toy.available) {
      setMessage('Товар закончился');
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

  async function handleCheckout() {
    if (!cartCount) {
      setMessage('Корзина пока пустая');
      return;
    }

    try {
      const payload = await request('/toys/checkout', {
        method: 'POST',
        body: JSON.stringify({
          userId: session?.user?.id,
          customerEmail: session?.user?.email || session?.login,
          items: cartItems.map((item) => ({
            toyId: item.id,
            quantity: item.quantity,
          })),
        }),
      });
      updateCart({});
      clearCart();
      setToys(payload.toys);
      setMessage(`Заказ оформлен. Сумма: ${formatPrice(payload.total)}. Остатки обновлены.`);
    } catch (error) {
      setMessage(error.message);
      await loadData();
    }
  }

  function handleLogout() {
    clearSession();
    setSession(null);
  }

  useEffect(() => {
    void loadData();
  }, []);

  if (!session) {
    return (
      <main className="startPage">
        <section className="startShell">
          <div className="brandPanel">
            <p className="eyebrow lightText">artlo</p>
            <h1>Магазин игрушек</h1>
            <p>Создайте профиль покупателя или войдите как администратор, чтобы управлять пользователями.</p>
            <div className="brandFacts">
              <span>5 товаров</span>
              <span>корзина</span>
              <span>остатки</span>
            </div>
          </div>

          <div className="startPanel">
            <div className="startSwitch">
              <button
                type="button"
                className={startMode === 'login' ? 'tab activeTab' : 'tab'}
                onClick={() => {
                  setStartMode('login');
                  setMessage('');
                }}
              >
                Вход
              </button>
              <button
                type="button"
                className={startMode === 'register' ? 'tab activeTab' : 'tab'}
                onClick={() => {
                  setStartMode('register');
                  setMessage('');
                }}
              >
                Регистрация
              </button>
            </div>

            {message && <div className="alert">{message}</div>}

            {startMode === 'login' ? (
              <form onSubmit={handleLogin} className="startForm">
                <label>
                  Тип входа
                  <select value={loginForm.role} onChange={(event) => setLoginForm({ ...loginForm, role: event.target.value })}>
                    <option value="client">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>
                </label>
                <label>
                  {loginForm.role === 'admin' ? 'Логин' : 'Email'}
                  <input
                    value={loginForm.login}
                    placeholder={loginForm.role === 'admin' ? 'admin' : 'client@example.com'}
                    onChange={(event) => setLoginForm({ ...loginForm, login: event.target.value })}
                  />
                </label>
                <label>
                  Пароль
                  <input
                    type="password"
                    value={loginForm.password}
                    placeholder={loginForm.role === 'admin' ? 'admin123' : 'client123'}
                    onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                  />
                </label>
                <button type="submit" className="primary wideButton">Войти</button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="startForm">
                <label>
                  Имя
                  <input value={registerForm.name} onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })} />
                </label>
                <label>
                  Email
                  <input value={registerForm.email} onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })} />
                </label>
                <label>
                  Пароль
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                  />
                </label>
                <label>
                  Возраст
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={registerForm.age}
                    onChange={(event) => setRegisterForm({ ...registerForm, age: event.target.value })}
                  />
                </label>
                <button type="submit" className="primary wideButton">Зарегистрироваться</button>
              </form>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow lightText">artlo</p>
          <h1>Магазин игрушек</h1>
        </div>
        <div className="profileCard">
          <UserRound size={18} />
          <div>
            <strong>{session.user?.name || session.login}</strong>
            <span>{isAdmin ? 'администратор' : session.user?.email || session.login}</span>
          </div>
          <button type="button" className="iconButton" onClick={handleLogout} title="Выйти">
            <LogOut size={18} />
          </button>
        </div>
      </section>

      <section className="topbar">
        <div className="heroStats">
          <div>
            <strong>{toys.length}</strong>
            <span>товаров</span>
          </div>
          <div>
            <strong>{cartCount}</strong>
            <span>в корзине</span>
          </div>
          <div>
            <strong>{formatPrice(cartTotal)}</strong>
            <span>сумма</span>
          </div>
        </div>
        <button type="button" className="secondary" onClick={loadData}>
          <RefreshCw size={18} />
          Обновить
        </button>
      </section>

      {message && <div className="alert">{message}</div>}

      <section className="layout">
        <div className="catalog">
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Каталог</p>
              <h2>Товары</h2>
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
                    {toy.available ? `Остаток: ${toy.stock}` : 'Нет в наличии'}
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
                    <span>{toy.available ? 'можно заказать' : 'закончился'}</span>
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
            <div className="emptyCart">Корзина пустая. Добавьте товар из каталога.</div>
          ) : (
            <div className="cartItems">
              {cartItems.map((item) => (
                <article className="cartItem" key={item.id}>
                  <img src={item.image} alt={item.title} />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{formatPrice(item.price)} x {item.quantity}</span>
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

      <section className="usersBox">
        <div className="sectionHeader compact">
          <div>
            <p className="eyebrow">Профили</p>
            <h2>{isAdmin ? 'Управление пользователями' : 'Зарегистрированные пользователи'}</h2>
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
              {isAdmin && (
                <button type="button" className="iconButton danger" onClick={() => handleDeleteUser(user.id)} title="Удалить пользователя">
                  <Trash2 size={16} />
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;

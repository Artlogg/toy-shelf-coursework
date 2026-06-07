import { useEffect, useMemo, useState } from 'react';
import { LogIn, LogOut, Plus, RefreshCw, ShieldCheck, ToyBrick, UserRound } from 'lucide-react';
import { request } from './api';
import { clearSession, loadSession, saveSession } from './storage';

const initialUser = { name: '', email: '', age: '' };

function App() {
  const [session, setSession] = useState(loadSession());
  const [loginForm, setLoginForm] = useState({ login: 'client', password: 'client123', role: 'client' });
  const [users, setUsers] = useState([]);
  const [toys, setToys] = useState([]);
  const [newUser, setNewUser] = useState(initialUser);
  const [message, setMessage] = useState('');

  const canCreateUsers = session?.role === 'admin';
  const roleLabel = useMemo(() => {
    if (!session) return 'не выполнен';
    return session.role === 'admin' ? 'администратор' : session.role === 'client' ? 'клиент' : 'гость';
  }, [session]);

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
    } catch (error) {
      setMessage(error.message);
    }
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
      <section className="topbar">
        <div>
          <p className="eyebrow">Toy Shelf</p>
          <h1>Учет игрушек и пользователей</h1>
        </div>
        <div className="session">
          <ShieldCheck size={18} />
          <span>{roleLabel}</span>
          {session && (
            <button type="button" className="iconButton" onClick={handleLogout} title="Выйти">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </section>

      {message && <div className="alert">{message}</div>}

      {!session && (
        <section className="panel authPanel">
          <h2>Вход</h2>
          <form onSubmit={handleLogin} className="formGrid">
            <label>
              Логин
              <input value={loginForm.login} onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })} />
            </label>
            <label>
              Пароль
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
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

      <section className="contentGrid">
        <div className="panel">
          <div className="panelHeader">
            <h2>Игрушки</h2>
            <button type="button" className="iconButton" onClick={loadData} title="Обновить">
              <RefreshCw size={18} />
            </button>
          </div>
          <div className="items">
            {toys.map((toy) => (
              <article className="item" key={toy.id}>
                <ToyBrick size={20} />
                <div>
                  <strong>{toy.title}</strong>
                  <span>{toy.category} · {toy.price} ₽ · {toy.available ? 'в наличии' : 'нет в наличии'}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panelHeader">
            <h2>Пользователи</h2>
          </div>
          <div className="items">
            {users.map((user) => (
              <article className="item" key={user.id}>
                <UserRound size={20} />
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}{user.age ? ` · ${user.age}` : ''}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {canCreateUsers && (
        <section className="panel">
          <h2>Создание пользователя</h2>
          <form onSubmit={handleCreateUser} className="formGrid">
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
              <input type="number" min="1" max="120" value={newUser.age} onChange={(e) => setNewUser({ ...newUser, age: e.target.value })} />
            </label>
            <button type="submit" className="primary">
              <Plus size={18} />
              Создать
            </button>
          </form>
        </section>
      )}
    </main>
  );
}

export default App;


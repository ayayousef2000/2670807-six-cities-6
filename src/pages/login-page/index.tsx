import { Link, Navigate } from 'react-router-dom';
import { FormEvent, useState, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginAction } from '../../store/api-actions';
import { AuthorizationStatus, CITIES } from '../../const';
import { clearLoginError, setLoginError } from '../../store/user-slice';
import { setCity } from '../../store/offers-slice';
import './login-page.css';
import { AppRoute } from '../../app/routes';

function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector((state) => state.user.authorizationStatus);
  const loginError = useAppSelector((state) => state.user.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [randomCity] = useState(() => CITIES[Math.floor(Math.random() * CITIES.length)]);

  const handleCityLinkClick = () => {
    dispatch(setCity(randomCity));
  };

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Main} />;
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!email.trim() || !password.trim()) {
      dispatch(setLoginError('Email and Password are required.'));
      return;
    }
    dispatch(loginAction({
      login: email,
      password: password,
    }));
  };

  const handleInputChange = (setter: (value: string) => void) => (evt: ChangeEvent<HTMLInputElement>) => {
    setter(evt.target.value);
    if (loginError) {
      dispatch(clearLoginError());
    }
  };

  return (
    <div className="page page--gray page--login">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to={AppRoute.Main}>
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form
              className="login__form form"
              action="#"
              method="post"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={handleInputChange(setEmail)}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={handleInputChange(setPassword)}
                />
              </div>

              {loginError && (
                <div className="login__error-message">
                  {loginError.split('\n').map((msg) => (
                    <span key={msg} style={{ display: 'block', marginBottom: '4px' }}>
                      {msg}
                    </span>
                  ))}
                </div>
              )}

              <button
                className="login__submit form__submit button"
                type="submit"
              >
                Sign in
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link
                className="locations__item-link"
                to={AppRoute.Main}
                onClick={handleCityLinkClick}
              >
                <span>{randomCity}</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;

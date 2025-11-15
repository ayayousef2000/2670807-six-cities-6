import { Link, Navigate } from 'react-router-dom';
import { FormEvent, useState, useMemo, useEffect, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginAction } from '../../store/api-actions';
import { AuthorizationStatus, CITIES } from '../../const';
import { clearLoginError } from '../../store/user-slice';
import './login-page.css';
import { AppRoute } from '../../app/routes';

function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector((state) => state.user.authorizationStatus);
  const loginError = useAppSelector((state) => state.user.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  const randomCity = useMemo(() => CITIES[Math.floor(Math.random() * CITIES.length)], []);

  useEffect(() => () => {
    dispatch(clearLoginError());
  }, [dispatch]);

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Main} />;
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      setClientError('Password must contain at least one letter and one number.');
      return;
    }
    dispatch(loginAction({
      login: email,
      password: password,
    }));
  };

  const handleInputChange = (setter: (value: string) => void) => (evt: ChangeEvent<HTMLInputElement>) => {
    setter(evt.target.value);
    if (clientError) {
      setClientError(null);
    }
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

              {(clientError || loginError) && (
                <p className="login__error-message"> {/* Use the new CSS class */}
                  {clientError || loginError}
                </p>
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
              <Link className="locations__item-link" to={AppRoute.Main}>
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

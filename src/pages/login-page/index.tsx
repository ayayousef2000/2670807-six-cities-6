import { Link, Navigate } from 'react-router-dom';
import { useState, useCallback, memo, FormEvent, ChangeEvent, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AuthorizationStatus, CITIES, RequestStatus } from '../../const';
import { setCity } from '../../store/offers';
import { loginAction, selectAuthorizationStatus, selectUserRequestStatus } from '../../store/user';
import { AppRoute } from '../../app/routes';
import './login-page.css';

const LoginHeader = memo(() => (
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
));
LoginHeader.displayName = 'LoginHeader';

type CityLocationItemProps = {
  city: string;
  onClick: () => void;
};

const CityLocationItem = memo(({ city, onClick }: CityLocationItemProps) => (
  <section className="locations locations--login locations--current">
    <div className="locations__item">
      <Link
        className="locations__item-link"
        to={AppRoute.Main}
        onClick={onClick}
        data-testid="login-city-link"
      >
        <span>{city}</span>
      </Link>
    </div>
  </section>
));
CityLocationItem.displayName = 'CityLocationItem';

function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const requestStatus = useAppSelector(selectUserRequestStatus);

  const randomCity = useMemo(() => CITIES[Math.floor(Math.random() * CITIES.length)], []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitting = requestStatus === RequestStatus.Loading;

  const handleCityLinkClick = useCallback(() => {
    dispatch(setCity(randomCity));
  }, [dispatch, randomCity]);

  const handleEmailChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setEmail(evt.target.value);
    setErrorMessage(null);
  }, []);

  const handlePasswordChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setPassword(evt.target.value);
    setErrorMessage(null);
  }, []);

  const handleSubmit = useCallback((evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password should not be empty.');
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])/;

    if (!passwordRegex.test(password)) {
      setErrorMessage('Password must contain at least one letter and one number.');
      return;
    }

    dispatch(loginAction({ login: email, password }))
      .unwrap()
      .catch((serverError) => {
        setErrorMessage(serverError as string);
      });
  }, [dispatch, email, password]);

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Main} />;
  }

  return (
    <div className="page page--gray page--login">
      <LoginHeader />
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
              data-testid="login-form"
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
                  onChange={handleEmailChange}
                  disabled={isSubmitting}
                  data-testid="email-input"
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
                  onChange={handlePasswordChange}
                  disabled={isSubmitting}
                  data-testid="password-input"
                />
              </div>

              {errorMessage && (
                <div className="login__error-message" data-testid="login-error">
                  {errorMessage}
                </div>
              )}

              <button
                className="login__submit form__submit button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </section>

          <CityLocationItem
            city={randomCity}
            onClick={handleCityLinkClick}
          />
        </div>
      </main>
    </div>
  );
}

export default LoginPage;

import { Link, Navigate } from 'react-router-dom';
import { useState, useCallback, memo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AuthorizationStatus, CITIES } from '../../const';
import { setCity } from '../../store/offers';
import { selectAuthorizationStatus } from '../../store/user';
import { AppRoute } from '../../app/routes';
import LoginForm from '../../components/login-form';
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
  const [randomCity] = useState(() => CITIES[Math.floor(Math.random() * CITIES.length)]);

  const handleCityLinkClick = useCallback(() => {
    dispatch(setCity(randomCity));
  }, [dispatch, randomCity]);

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Main} />;
  }

  return (
    <div className="page page--gray page--login">
      <LoginHeader />
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <LoginForm />
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

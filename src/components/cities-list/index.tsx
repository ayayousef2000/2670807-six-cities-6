import React from 'react';

type CitiesListProps = {
  cities: string[];
  currentCity: string;
  onCityChange: (city: string) => void;
};

function CitiesList({ cities, currentCity, onCityChange }: CitiesListProps): JSX.Element {

  const handleCityClick = (evt: React.MouseEvent<HTMLAnchorElement>, city: string) => {
    evt.preventDefault();
    onCityChange(city);
  };

  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((city) => {
            const isActive = city === currentCity;
            const activeClass = isActive ? 'tabs__item--active' : '';

            return (
              <li key={city} className="locations__item">
                <a
                  className={`locations__item-link tabs__item ${activeClass}`}
                  href="#"
                  onClick={(evt) => handleCityClick(evt, city)}
                >
                  <span>{city}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

const CitiesListMemo = React.memo(CitiesList);
export default CitiesListMemo;

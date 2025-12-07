import { render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { describe, it, expect, vi } from 'vitest';
import CitiesList from './index';

describe('Component: CitiesList', () => {
  it('should render all cities and highlight the active one', () => {
    const cities = [faker.location.city(), faker.location.city(), faker.location.city()];
    const currentCity = cities[1];
    const onCityChange = vi.fn();

    render(
      <CitiesList
        cities={cities}
        currentCity={currentCity}
        onCityChange={onCityChange}
      />
    );

    cities.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument();
    });

    const activeLink = screen.getByRole('link', { name: currentCity });
    const inactiveLink = screen.getByRole('link', { name: cities[0] });

    expect(activeLink).toHaveClass('tabs__item--active');
    expect(inactiveLink).not.toHaveClass('tabs__item--active');
  });
});

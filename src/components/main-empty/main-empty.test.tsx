import { render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import MainEmpty from './index';

describe('Component: MainEmpty', () => {
  it('should render correct text with the provided city name', () => {
    const mockCity = faker.location.city();
    const expectedHeader = 'No places to stay available';
    const expectedDescription = `We could not find any property available at the moment in ${mockCity}`;

    render(<MainEmpty city={mockCity} />);

    expect(screen.getByText(expectedHeader)).toBeInTheDocument();
    expect(screen.getByText(expectedDescription)).toBeInTheDocument();
  });
});

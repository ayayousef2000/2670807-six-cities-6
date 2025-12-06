import { render, screen } from '@testing-library/react';
import UserGuest from './user-guest';
import { AppRoute } from '../../app/routes';
import { withHistory } from '../../utils/mock-component';

describe('Component: UserGuest', () => {
  it('should render sign in link', () => {
    const component = withHistory(<UserGuest />);

    render(component);

    const link = screen.getByRole('link', { name: /Sign in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', AppRoute.Login);
  });
});

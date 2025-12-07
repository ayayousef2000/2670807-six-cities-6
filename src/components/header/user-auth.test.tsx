import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import UserAuth from './user-auth';
import { withHistory } from '../../utils/mock-component';
import { makeFakeUser } from '../../utils/mocks';

describe('Component: UserAuth', () => {
  it('should render user email, avatar and favorite count', () => {
    const mockUser = {
      ...makeFakeUser(),
      email: 'test@test.com',
      avatarUrl: 'img/test-avatar.jpg',
      name: 'Test User'
    };
    const favoriteCount = 5;

    const component = withHistory(
      <UserAuth
        user={mockUser}
        favoriteCount={favoriteCount}
        onSignOut={vi.fn()}
        isLoggingOut={false}
      />
    );

    render(component);

    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByAltText('Test User')).toHaveAttribute('src', 'img/test-avatar.jpg');
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should change text and opacity when logging out', () => {
    const mockUser = makeFakeUser();
    const component = withHistory(
      <UserAuth
        user={mockUser}
        favoriteCount={0}
        onSignOut={vi.fn()}
        isLoggingOut
      />
    );

    render(component);

    const signOutLink = screen.getByRole('link', { name: /Signing out.../i });
    expect(signOutLink).toBeInTheDocument();
    expect(signOutLink).toHaveStyle({ pointerEvents: 'none', opacity: '0.5' });
  });

  it('should call onSignOut when clicking sign out link', async () => {
    const mockUser = makeFakeUser();
    const mockOnSignOut = vi.fn();
    const component = withHistory(
      <UserAuth
        user={mockUser}
        favoriteCount={0}
        onSignOut={mockOnSignOut}
        isLoggingOut={false}
      />
    );

    render(component);

    const signOutLink = screen.getByRole('link', { name: /Sign out/i });
    await userEvent.click(signOutLink);

    expect(mockOnSignOut).toHaveBeenCalledTimes(1);
  });
});

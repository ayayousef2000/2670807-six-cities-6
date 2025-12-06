import { render, screen } from '@testing-library/react';
import LoginForm from './index';
import { withStore } from '../../utils/mock-component';

describe('Component: LoginForm', () => {
  it('should render correct form elements', () => {
    const { withStoreComponent } = withStore(<LoginForm />);

    render(withStoreComponent);

    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });
});

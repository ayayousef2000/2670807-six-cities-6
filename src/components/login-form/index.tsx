import { FormEvent, useState, ChangeEvent, useCallback, memo } from 'react';
import { useAppDispatch } from '../../hooks';
import { loginAction } from '../../store/user/user-thunks';
import './login-form.css';

function LoginForm(): JSX.Element {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setEmail(evt.target.value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [errorMessage]);

  const handlePasswordChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setPassword(evt.target.value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  }, [errorMessage]);

  const handleSubmit = useCallback((evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and Password are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    dispatch(loginAction({ login: email, password }))
      .unwrap()
      .catch((error: string) => {
        setErrorMessage(error || 'Failed to login');
        setIsSubmitting(false);
      });
  }, [dispatch, email, password]);

  return (
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
          <div className="login__error-message">
            {errorMessage.split('\n').map((msg) => (
              <span key={msg}>{msg}</span>
            ))}
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
  );
}

const MemoizedLoginForm = memo(LoginForm);
export default MemoizedLoginForm;

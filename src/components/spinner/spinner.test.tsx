import { render } from '@testing-library/react';
import Spinner from './index';

describe('Component: Spinner', () => {
  it('should render correctly', () => {
    const spinnerContainerTestId = 'spinner-container';
    const loadingSpinnerTestId = 'loading-spinner';

    const { container } = render(<Spinner />);

    expect(container.querySelector(`.${spinnerContainerTestId}`)).toBeInTheDocument();
    expect(container.querySelector(`.${loadingSpinnerTestId}`)).toBeInTheDocument();
  });
});

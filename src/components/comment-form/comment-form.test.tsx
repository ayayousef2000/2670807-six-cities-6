import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CommentForm from './index';
import { withHistory, withStore } from '../../utils/mock-component';
import { NameSpace, RequestStatus } from '../../const';
import * as ReviewsThunks from '../../store/reviews/reviews-thunks';
import * as ReviewsSlice from '../../store/reviews';

vi.mock('../../store/reviews/reviews-thunks', () => ({
  postCommentAction: vi.fn(() => ({ type: 'reviews/postComment' })),
}));

vi.mock('../../store/reviews', async (importOriginal) => {
  const actual = await importOriginal<typeof ReviewsSlice>();
  return {
    ...actual,
    dropSendingStatus: vi.fn(() => ({ type: 'reviews/dropSendingStatus' })),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'offer-123' }),
  };
});

describe('Component: CommentForm', () => {
  const validComment = 'This is a test comment that is definitely longer than fifty characters to meet the validation requirements.';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with initial state', () => {
    const { withStoreComponent } = withStore(<CommentForm />, {
      [NameSpace.Reviews]: {
        sendingStatus: RequestStatus.Idle,
        sendingError: null,
        reviews: [],
        status: RequestStatus.Success,
      }
    });
    const preparedComponent = withHistory(withStoreComponent);

    render(preparedComponent);

    expect(screen.getByLabelText(/Your review/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tell how was your stay/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('should have submit button disabled by default', () => {
    const { withStoreComponent } = withStore(<CommentForm />, {
      [NameSpace.Reviews]: {
        sendingStatus: RequestStatus.Idle,
        sendingError: null,
        reviews: [],
        status: RequestStatus.Success,
      }
    });

    render(withHistory(withStoreComponent));

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid (rating + long text)', () => {
    const { withStoreComponent } = withStore(<CommentForm />, {
      [NameSpace.Reviews]: {
        sendingStatus: RequestStatus.Idle,
        sendingError: null,
        reviews: [],
        status: RequestStatus.Success,
      }
    });

    render(withHistory(withStoreComponent));

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    const textArea = screen.getByRole('textbox', { name: /Your review/i });
    const starInputs = screen.getAllByRole('radio');

    fireEvent.change(textArea, { target: { value: validComment } });
    expect(submitButton).toBeDisabled();
    fireEvent.click(starInputs[0]);

    expect(submitButton).toBeEnabled();
  });

  it('should dispatch "postCommentAction" when submitting valid form', () => {
    const { withStoreComponent } = withStore(<CommentForm />, {
      [NameSpace.Reviews]: {
        sendingStatus: RequestStatus.Idle,
        sendingError: null,
        reviews: [],
        status: RequestStatus.Success,
      }
    });

    render(withHistory(withStoreComponent));

    const textArea = screen.getByRole('textbox', { name: /Your review/i });
    const starInputs = screen.getAllByRole('radio');
    const form = screen.getByRole('button', { name: /Submit/i }).closest('form');

    fireEvent.change(textArea, { target: { value: validComment } });
    fireEvent.click(starInputs[0]); // 5 stars

    if (form) {
      fireEvent.submit(form);
    }

    expect(ReviewsThunks.postCommentAction).toHaveBeenCalledTimes(1);
    expect(ReviewsThunks.postCommentAction).toHaveBeenCalledWith({
      offerId: 'offer-123',
      rating: 5,
      comment: validComment,
    });
  });

  it('should disable all controls when status is Loading', () => {
    const { withStoreComponent } = withStore(<CommentForm />, {
      [NameSpace.Reviews]: {
        sendingStatus: RequestStatus.Loading,
        sendingError: null,
        reviews: [],
        status: RequestStatus.Success,
      }
    });

    render(withHistory(withStoreComponent));

    const textArea = screen.getByRole('textbox', { name: /Your review/i });
    const submitButton = screen.getByRole('button', { name: /Submitting.../i });
    const starInputs = screen.getAllByRole('radio');

    expect(textArea).toBeDisabled();
    expect(submitButton).toBeDisabled();
    starInputs.forEach((input) => expect(input).toBeDisabled());
  });

  it('should display error message when status is Error', () => {
    const errorMessage = 'Network Error';
    const { withStoreComponent } = withStore(<CommentForm />, {
      [NameSpace.Reviews]: {
        sendingStatus: RequestStatus.Error,
        sendingError: errorMessage,
        reviews: [],
        status: RequestStatus.Success,
      }
    });

    render(withHistory(withStoreComponent));

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should dispatch "dropSendingStatus" when user types after an error', () => {
    const { withStoreComponent } = withStore(<CommentForm />, {
      [NameSpace.Reviews]: {
        sendingStatus: RequestStatus.Error,
        sendingError: 'Some error',
        reviews: [],
        status: RequestStatus.Success,
      }
    });

    render(withHistory(withStoreComponent));

    const textArea = screen.getByRole('textbox', { name: /Your review/i });

    fireEvent.change(textArea, { target: { value: 'New text' } });

    expect(ReviewsSlice.dropSendingStatus).toHaveBeenCalled();
  });
});

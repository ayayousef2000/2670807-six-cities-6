import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CommentForm from './comment-form';
import { withHistory, withStore } from '../../utils/mock-component';
import { NameSpace, RequestStatus } from '../../const';
import * as ReviewsStore from '../../store/reviews';

vi.mock('../../store/reviews', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store/reviews')>();
  return {
    ...actual,
    postCommentAction: vi.fn(() => ({ type: 'reviews/postComment' })),
    dropSendingStatus: vi.fn(() => ({ type: 'reviews/dropSendingStatus' })),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
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

    render(withHistory(withStoreComponent));

    expect(screen.getByLabelText(/Your review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('should enable submit button when form is valid', () => {
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

    expect(submitButton).toBeDisabled();

    fireEvent.change(textArea, { target: { value: validComment } });
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
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    fireEvent.change(textArea, { target: { value: validComment } });
    fireEvent.click(starInputs[0]);
    fireEvent.click(submitButton);

    expect(ReviewsStore.postCommentAction).toHaveBeenCalledTimes(1);
    expect(ReviewsStore.postCommentAction).toHaveBeenCalledWith({
      offerId: 'offer-123',
      rating: 5,
      comment: validComment,
    });
  });

  it('should disable all controls when status is "Loading"', () => {
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

  it('should display error message and clear it when user interacts', () => {
    const errorMessage = 'Failed to post comment';
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

    const textArea = screen.getByRole('textbox', { name: /Your review/i });
    fireEvent.change(textArea, { target: { value: 'Typing something new...' } });

    expect(ReviewsStore.dropSendingStatus).toHaveBeenCalledTimes(1);
  });
});

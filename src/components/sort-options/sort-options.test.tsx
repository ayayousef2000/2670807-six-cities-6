import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SortOptions from './index';
import { SortOption } from '../../const';

describe('Component: SortOptions', () => {
  it('should render correctly with the current sort selected', () => {
    const currentSort = SortOption.PriceLowToHigh;
    const onSortChange = vi.fn();

    render(
      <SortOptions
        currentSort={currentSort}
        onSortChange={onSortChange}
      />
    );

    expect(screen.getByText('Sort by')).toBeInTheDocument();

    const optionItems = screen.getAllByRole('listitem');
    const activeOption = optionItems.find((item) => item.textContent === currentSort);

    expect(activeOption).toHaveClass('places__option--active');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
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

  it('should open and close the options list when clicked', () => {
    const onSortChange = vi.fn();
    const { container } = render(
      <SortOptions
        currentSort={SortOption.Popular}
        onSortChange={onSortChange}
      />
    );

    const toggle = screen.getByText(SortOption.Popular, { selector: '.places__sorting-type' });
    const optionsList = container.querySelector('.places__options');

    expect(optionsList).not.toHaveClass('places__options--opened');

    fireEvent.click(toggle);
    expect(optionsList).toHaveClass('places__options--opened');

    fireEvent.click(toggle);
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should call onSortChange and close list when an option is clicked', () => {
    const onSortChange = vi.fn();
    const { container } = render(
      <SortOptions
        currentSort={SortOption.Popular}
        onSortChange={onSortChange}
      />
    );

    const toggle = screen.getByText(SortOption.Popular, { selector: '.places__sorting-type' });
    fireEvent.click(toggle);

    const optionToSelect = screen.getByText(SortOption.PriceHighToLow);
    fireEvent.click(optionToSelect);

    expect(onSortChange).toHaveBeenCalledWith(SortOption.PriceHighToLow);
    
    const optionsList = container.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });
});

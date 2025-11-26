import { useState, memo } from 'react';
import { SortOption as SortOptionsEnum } from '../../const';

type SortOptionValue = typeof SortOptionsEnum[keyof typeof SortOptionsEnum];

type SortOptionsProps = {
  currentSort: SortOptionValue;
  onSortChange: (sortType: SortOptionValue) => void;
};

const sortOptionValues = Object.values(SortOptionsEnum) as SortOptionValue[];

function SortOptionsComponent({ currentSort, onSortChange }: SortOptionsProps): JSX.Element {
  const [isOpened, setIsOpened] = useState(false);

  const handleSortTypeClick = (sortType: SortOptionValue) => {
    onSortChange(sortType);
    setIsOpened(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by </span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpened((prevIsOpened) => !prevIsOpened)}
      >
        {currentSort}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${isOpened ? 'places__options--opened' : ''}`}
      >
        {sortOptionValues.map((sortType) => (
          <li
            key={sortType}
            className={`places__option ${currentSort === sortType ? 'places__option--active' : ''}`}
            tabIndex={0}
            onClick={() => handleSortTypeClick(sortType)}
          >
            {sortType}
          </li>
        ))}
      </ul>
    </form>
  );
}

const SortOptions = memo(SortOptionsComponent);
export default SortOptions;

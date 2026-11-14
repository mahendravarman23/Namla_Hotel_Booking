import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotels, setFilter } from '../features/hotels/hotelsSlice';
import useDebounce from '../hooks/useDebounce';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Gallery from '../features/ui/Gallery';
import { getHotelLocation, formatPrice } from '../utils/format';
import { SearchIcon } from '../components/icons';

export default function HotelListPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  const { items, total, listStatus, listError, filters } = useSelector((state) => state.hotels);
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(initialSearch || filters.search);

  useEffect(() => {
    if (initialSearch && initialSearch !== filters.search) {
      dispatch(setFilter({ name: 'search', value: initialSearch }));
      setSearchInput(initialSearch);
    }
  }, [initialSearch, dispatch, filters.search]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);

    dispatch(setFilter({ name: 'search', value: val }));
  };

  useEffect(() => {
    dispatch(
      fetchHotels({
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        limit: 50,
        offset: 0,
      })
    );
  }, [dispatch, filters.search, filters.minPrice, filters.maxPrice]);

  const hasFilters = filters.search || filters.minPrice || filters.maxPrice;

  return (
    <>
      <Helmet>
        <title>Hotel Showcase</title>
        <meta
          name="description"
          content="Explore our hotel collection in an interactive 3D sphere showcase."
        />
        <meta property="og:title" content="Hotel Showcase" />
        <meta
          property="og:description"
          content="Explore our hotel collection in an interactive 3D sphere showcase."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container page">
        <div className="page-head">
          <div>
            <h1>Hotel Showcase</h1>
            <p className="page-sub">
              {listStatus === 'succeeded'
                ? `${total} hotel${total === 1 ? '' : 's'} in 3D sphere • Drag to rotate • Click any card to inspect`
                : 'Loading…'}
            </p>
          </div>
          {isAdmin ? (
            <Link to="/hotels/add" className="btn btn--primary">
              + Add Hotel
            </Link>
          ) : (
            <Link to="/login" className="btn btn--outline btn--sm">
              Admin Login
            </Link>
          )}
        </div>

        <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
          <label className="filters__search">
            <SearchIcon aria-hidden="true" />
            <input
              type="search"
              placeholder="Search by title…"
              value={searchInput}
              onChange={handleSearchChange}
              aria-label="Search hotels by title"
            />
          </label>

          <label className="filters__price">
            <span>Min ₹</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => dispatch(setFilter({ name: 'minPrice', value: e.target.value }))}
              aria-label="Minimum price"
            />
          </label>

          <label className="filters__price">
            <span>Max ₹</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Any"
              value={filters.maxPrice}
              onChange={(e) => dispatch(setFilter({ name: 'maxPrice', value: e.target.value }))}
              aria-label="Maximum price"
            />
          </label>

          {hasFilters ? (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => {
                setSearchInput('');
                dispatch(setFilter({ name: 'search', value: '' }));
                dispatch(setFilter({ name: 'minPrice', value: '' }));
                dispatch(setFilter({ name: 'maxPrice', value: '' }));
              }}
            >
              Clear
            </button>
          ) : null}
        </form>

        {listStatus === 'loading' ? (
          <Spinner label="Loading hotel showcase…" />
        ) : listError ? (
          <EmptyState title="Something went wrong" text={listError} />
        ) : items.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No hotels match your filters' : 'No hotels yet'}
            text={
              hasFilters
                ? 'Try a different search term or widen the price range.'
                : 'Once a hotel is added it will show up here.'
            }
          >
            {!hasFilters ? (
              <Link to="/hotels/add" className="btn btn--primary">
                Add the first hotel
              </Link>
            ) : null}
          </EmptyState>
        ) : (
          <Gallery
            items={items.map((hotel) => ({
              id: hotel.id,
              src: hotel.image_url,
              title: hotel.title,
              location: getHotelLocation(hotel),
              price: hotel.price,
              description: hotel.description,
            }))}
          />
        )}
      </div>
    </>
  );
}

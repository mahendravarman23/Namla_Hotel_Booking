import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotels, deleteHotel, setFilter, PAGE_SIZE } from '../features/hotels/hotelsSlice';
import { showToast } from '../features/ui/uiSlice';
import { formatPrice, getHotelLocation } from '../utils/format';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { SearchIcon } from '../components/icons';

export default function AdminHotelsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items, total, listStatus, listError, filters } = useSelector((state) => state.hotels);

  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [searchInput, setSearchInput] = useState(filters.search);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);

    dispatch(setFilter({ name: 'search', value: val }));
  };

  const offset = (filters.page - 1) * PAGE_SIZE;

  useEffect(() => {
    dispatch(
      fetchHotels({
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        limit: PAGE_SIZE,
        offset,
      })
    );
  }, [dispatch, filters.search, filters.minPrice, filters.maxPrice, filters.page, offset]);

  useEffect(() => {
    if (listStatus === 'succeeded' && items.length === 0 && filters.page > 1) {
      dispatch(setFilter({ name: 'page', value: filters.page - 1 }));
    }
  }, [listStatus, items.length, filters.page, dispatch]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await dispatch(deleteHotel(pendingDelete.id)).unwrap();
      dispatch(showToast('Hotel deleted successfully.'));
      dispatch(
        fetchHotels({
          search: filters.search,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          limit: PAGE_SIZE,
          offset,
        })
      );
    } catch {
      dispatch(showToast('Could not delete this hotel. Please try again.', 'error'));
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const hasFilters = filters.search || filters.minPrice || filters.maxPrice;

  if (isAdminRoute && !isAdmin) {
    return (
      <div className="container page">
        <EmptyState
          title="Admin Access Required"
          text="You must be signed in as an Administrator to access the Admin Panel."
        >
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
            <Link to="/login" className="btn btn--primary">
              Sign In as Admin
            </Link>
            <Link to="/hotels" className="btn btn--outline">
              Browse Hotels
            </Link>
          </div>
        </EmptyState>
      </div>
    );
  }

  const pageTitle = isAdminRoute ? 'Admin Hotel Management' : 'Browse Hotels';

  return (
    <>
      <Helmet>
        <title>{pageTitle} — Hotels</title>
        <meta
          name="description"
          content="Browse our complete collection of verified hotels, havelis, and luxury suites with photos and rates."
        />
        <meta property="og:title" content={`${pageTitle} — Hotels`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container page">
        <div className="page-head">
          <div>
            {isAdmin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    background: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  👑 Administrator View
                </span>
              </div>
            )}
            <h1>{isAdminRoute ? 'Hotel Management' : 'Find your next stay'}</h1>
            <p className="page-sub">
              {listStatus === 'succeeded' ? `${total} hotel listing${total === 1 ? '' : 's'} available` : 'Loading…'}
            </p>
          </div>

          {isAdmin ? (
            <Link to="/hotels/add" className="btn btn--primary">
              + Add Hotel
            </Link>
          ) : (
            <Link to="/showcase" className="btn btn--outline btn--sm">
              3D Sphere Showcase &rarr;
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
          <Spinner label="Loading hotels…" />
        ) : listError ? (
          <EmptyState title="Something went wrong" text={listError} />
        ) : items.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No hotels match your filters' : 'No hotels yet'}
            text={
              hasFilters
                ? 'Try a different search term or widen the price range.'
                : isAdmin
                ? 'Click "+ Add Hotel" above to create your first hotel listing.'
                : 'No hotels are currently available.'
            }
          >
            {!hasFilters && isAdmin ? (
              <Link to="/hotels/add" className="btn btn--primary">
                + Add Hotel
              </Link>
            ) : null}
          </EmptyState>
        ) : (
          <>
            <div className="card-grid">
              {items.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onDelete={setPendingDelete}
                  showAdminTools={isAdmin}
                />
              ))}
            </div>

            <Pagination
              page={filters.page}
              pageSize={PAGE_SIZE}
              total={total}
              onPage={(p) => dispatch(setFilter({ name: 'page', value: p }))}
            />
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete this hotel?"
        message={`"${pendingDelete?.title ?? ''}" and its photo will be removed permanently.`}
        busy={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

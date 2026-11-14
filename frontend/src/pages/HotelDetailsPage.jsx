import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotel, clearCurrent } from '../features/hotels/hotelsSlice';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { formatPrice, formatCoord, formatDate, getHotelLocation } from '../utils/format';
import { ArrowLeftIcon, MapPinIcon } from '../components/icons';

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='533' viewBox='0 0 800 533'%3E%3Crect width='800' height='533' fill='%23e8eaee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%235f6672'%3ENo image available%3C/text%3E%3C/svg%3E";

export default function HotelDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: hotel, currentStatus, currentError } = useSelector((state) => state.hotels);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchHotel(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id]);

  if (currentStatus === 'loading' || currentStatus === 'idle') {
    return (
      <div className="container page">
        <Spinner label="Loading hotel…" />
      </div>
    );
  }

  if (currentStatus === 'failed') {
    return (
      <div className="container page">
        <EmptyState title="Hotel not found" text={currentError || 'It may have been deleted, or the link is wrong.'}>
          <Link to="/" className="btn btn--primary">
            Back to all hotels
          </Link>
        </EmptyState>
      </div>
    );
  }

  const lat = Number(hotel.latitude);
  const lng = Number(hotel.longitude);
  const locationName = getHotelLocation(hotel);

  const bboxDelta = 0.015;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - bboxDelta}%2C${lat - bboxDelta * 0.7}%2C${lng + bboxDelta}%2C${lat + bboxDelta * 0.7}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <>
      <Helmet>
        <title>{hotel.title} — Hotels</title>
        <meta name="description" content={hotel.description.slice(0, 155)} />
        <meta property="og:title" content={hotel.title} />
        <meta property="og:description" content={hotel.description.slice(0, 155)} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={hotel.image_url} />
      </Helmet>

      <div className="container page">
        <Link to="/showcase" className="back-link">
          <ArrowLeftIcon aria-hidden="true" /> Back to Hotel Showcase
        </Link>

        <div className="details-grid">
          <img
            className="details-img"
            src={hotel.image_url}
            alt={hotel.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />

          <div className="details-info">
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '6px',
              }}
            >
              <MapPinIcon aria-hidden="true" /> {locationName}
            </span>

            <h1>{hotel.title}</h1>
            <p className="details-price">
              {formatPrice(hotel.price)} <span>per night</span>
            </p>
            <p className="details-desc">{hotel.description}</p>

            <dl className="details-meta">
              <div>
                <dt>Latitude</dt>
                <dd>{formatCoord(hotel.latitude)}</dd>
              </div>
              <div>
                <dt>Longitude</dt>
                <dd>{formatCoord(hotel.longitude)}</dd>
              </div>
              <div>
                <dt>Added on</dt>
                <dd>{formatDate(hotel.created_at)}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{formatDate(hotel.updated_at)}</dd>
              </div>
            </dl>

            {isAdmin && (
              <div className="details-actions">
                <Link to={`/hotels/${hotel.id}/edit`} className="btn btn--primary">
                  Edit this hotel
                </Link>
              </div>
            )}
          </div>
        </div>

        <section className="details-map-card" aria-label="Hotel Location and Map">
          <div className="details-map-head">
            <div className="details-map-title">
              <h3>
                <MapPinIcon aria-hidden="true" /> Location &amp; Map View
              </h3>
              <p className="page-sub">
                Coordinates: {lat.toFixed(4)}°N, {lng.toFixed(4)}°E • {locationName}
              </p>
            </div>
          </div>

          <iframe
            className="details-map-frame"
            title={`Location map of ${hotel.title}`}
            src={mapEmbedUrl}
            loading="lazy"
          />

          <div className="details-map-links">
            <a
              href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Larger Map (OpenStreetMap)
            </a>
            <span>•</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Google Maps
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

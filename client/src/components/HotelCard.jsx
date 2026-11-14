import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import { PencilIcon, TrashIcon } from './icons';

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='267' viewBox='0 0 400 267'%3E%3Crect width='400' height='267' fill='%23e8eaee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%235f6672'%3ENo image%3C/text%3E%3C/svg%3E";

export default function HotelCard({ hotel, onDelete, showAdminTools = false }) {
  return (
    <article className="card hotel-card">
      <Link to={`/hotels/${hotel.id}`} className="hotel-card__img-link" aria-label={`View ${hotel.title}`}>
        <img
          className="hotel-card__img"
          src={hotel.image_url}
          alt={hotel.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </Link>

      <div className="hotel-card__body">
        <h3 className="hotel-card__title">
          <Link to={`/hotels/${hotel.id}`}>{hotel.title}</Link>
        </h3>

        <p className="hotel-card__desc">{hotel.description}</p>

        <p className="hotel-card__price">{formatPrice(hotel.price)}</p>

        <div className="hotel-card__actions">
          <Link className="btn btn--primary btn--sm" to={`/hotels/${hotel.id}`}>
            View details
          </Link>

          {showAdminTools && (
            <div className="hotel-card__tools">
              <Link className="icon-btn" to={`/hotels/${hotel.id}/edit`} aria-label={`Edit ${hotel.title}`} title="Edit">
                <PencilIcon />
              </Link>
              <button
                type="button"
                className="icon-btn icon-btn--danger"
                onClick={() => onDelete(hotel)}
                aria-label={`Delete ${hotel.title}`}
                title="Delete"
              >
                <TrashIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

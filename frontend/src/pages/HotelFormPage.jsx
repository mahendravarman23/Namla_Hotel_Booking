import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotel, createHotel, updateHotel, clearCurrent } from '../features/hotels/hotelsSlice';
import { showToast } from '../features/ui/uiSlice';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { ArrowLeftIcon } from '../components/icons';

const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  latitude: '',
  longitude: '',
};

export default function HotelFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: hotel, currentStatus, saving } = useSelector((state) => state.hotels);
  const { user } = useSelector((state) => state.auth);

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!isEdit) return undefined;
    dispatch(fetchHotel(id));
    return () => dispatch(clearCurrent());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && hotel) {

      const tidy = (n) => String(Number(Number(n).toFixed(6)));
      setValues({
        title: hotel.title,
        description: hotel.description,
        price: String(hotel.price),
        latitude: tidy(hotel.latitude),
        longitude: tidy(hotel.longitude),
      });
      setPreviewUrl(hotel.image_url);
    }
  }, [isEdit, hotel]);

  useEffect(
    () => () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const setField = (name) => (event) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};

    if (values.title.trim().length < 3) next.title = 'Title must be at least 3 characters long.';

    if (values.description.trim().length < 10) next.description = 'Please write at least 10 characters.';

    const price = Number(values.price);
    if (values.price === '' || Number.isNaN(price) || price < 0 || price > 1_000_000) {
      next.price = 'Price must be a number between 0 and 1,000,000.';
    }

    const lat = Number(values.latitude);
    if (values.latitude === '' || Number.isNaN(lat) || lat < -90 || lat > 90) {
      next.latitude = 'Latitude must be between -90 and 90.';
    }

    const lng = Number(values.longitude);
    if (values.longitude === '' || Number.isNaN(lng) || lng < -180 || lng > 180) {
      next.longitude = 'Longitude must be between -180 and 180.';
    }

    if (!isEdit && !imageFile) next.image = 'Please upload a photo for this hotel.';

    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const formData = new FormData();
    formData.append('title', values.title.trim());
    formData.append('description', values.description.trim());
    formData.append('price', values.price);
    formData.append('latitude', values.latitude);
    formData.append('longitude', values.longitude);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (isEdit) {
        await dispatch(updateHotel({ id, formData })).unwrap();
        dispatch(showToast('Hotel updated successfully.'));
        navigate(`/hotels/${id}`);
      } else {
        const created = await dispatch(createHotel(formData)).unwrap();
        dispatch(showToast('Hotel added successfully.'));
        navigate(`/hotels/${created.id}`);
      }
    } catch (payload) {

      if (payload?.errors) {
        setErrors(payload.errors);
      } else {
        dispatch(showToast(payload?.message || 'Could not save the hotel. Please try again.', 'error'));
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container page">
        <EmptyState
          title="Admin Access Required"
          text="Only administrators can add or edit hotel listings. Please sign in with an admin account."
        >
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
            <Link to="/login" className="btn btn--primary">
              Sign In as Admin
            </Link>
            <Link to="/showcase" className="btn btn--outline">
              Return to Showcase
            </Link>
          </div>
        </EmptyState>
      </div>
    );
  }

  if (isEdit && currentStatus !== 'succeeded') {
    return (
      <div className="container page">
        {currentStatus === 'failed' ? (
          <p className="page-sub">This hotel could not be loaded. It may have been deleted.</p>
        ) : (
          <Spinner label="Loading hotel…" />
        )}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? `Edit ${hotel?.title ?? 'hotel'}` : 'Add a new hotel'} — Hotels</title>
        <meta name="description" content="Add or edit a hotel listing: photo, description, price and coordinates." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="container page form-page">
        <Link to={isEdit ? `/hotels/${id}` : '/'} className="back-link">
          <ArrowLeftIcon aria-hidden="true" /> {isEdit ? 'Back to hotel' : 'Back to all hotels'}
        </Link>

        <form className="card form-card" onSubmit={handleSubmit} noValidate>
          <h1>{isEdit ? 'Edit hotel' : 'Add a new hotel'}</h1>
          <p className="page-sub">Fields marked with an asterisk are required.</p>

          <div className="form-field">
            <label className="label" htmlFor="title">
              Title <span className="req">*</span>
            </label>
            <input
              id="title"
              className={`input${errors.title ? ' input--invalid' : ''}`}
              value={values.title}
              onChange={setField('title')}
              placeholder="e.g. Jaipur Haveli Boutique"
              maxLength={160}
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          <div className="form-field">
            <label className="label" htmlFor="description">
              Description <span className="req">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              className={`input${errors.description ? ' input--invalid' : ''}`}
              value={values.description}
              onChange={setField('description')}
              placeholder="What makes this place worth a night? Rooms, location, breakfast…"
            />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="label" htmlFor="price">
                Price per night (₹) <span className="req">*</span>
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                className={`input${errors.price ? ' input--invalid' : ''}`}
                value={values.price}
                onChange={setField('price')}
                placeholder="99.50"
              />
              {errors.price && <p className="field-error">{errors.price}</p>}
            </div>

            <div className="form-field">
              <label className="label" htmlFor="latitude">
                Latitude <span className="req">*</span>
              </label>
              <input
                id="latitude"
                type="number"
                step="any"
                className={`input${errors.latitude ? ' input--invalid' : ''}`}
                value={values.latitude}
                onChange={setField('latitude')}
                placeholder="26.9124"
              />
              {errors.latitude && <p className="field-error">{errors.latitude}</p>}
            </div>

            <div className="form-field">
              <label className="label" htmlFor="longitude">
                Longitude <span className="req">*</span>
              </label>
              <input
                id="longitude"
                type="number"
                step="any"
                className={`input${errors.longitude ? ' input--invalid' : ''}`}
                value={values.longitude}
                onChange={setField('longitude')}
                placeholder="75.7873"
              />
              {errors.longitude && <p className="field-error">{errors.longitude}</p>}
            </div>
          </div>

          <div className="form-field">
            <span className="label">
              Photo {!isEdit && <span className="req">*</span>}
              {isEdit && <span className="hint-inline">(leave unchanged to keep the current photo)</span>}
            </span>
            <div className="upload">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Hotel preview"
                  className="upload__preview"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling && (e.currentTarget.nextSibling.style.display = 'grid');
                  }}
                />
              ) : (
                <div className="upload__placeholder">No photo chosen yet</div>
              )}
              <div className="upload__side">
                <label className="btn btn--outline btn--sm" htmlFor="hotel-image">
                  Choose photo…
                </label>
                <p className="hint">JPG, PNG or WEBP — up to 5 MB.</p>
                {errors.image && <p className="field-error">{errors.image}</p>}
              </div>
            </div>
            <input
              id="hotel-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
                setErrors((prev) => ({ ...prev, image: undefined }));
              }}
            />
          </div>

          <div className="form-actions">
            <Link to={isEdit ? `/hotels/${id}` : '/'} className="btn btn--outline">
              Cancel
            </Link>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add hotel'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

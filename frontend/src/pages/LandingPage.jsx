import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotels } from '../features/hotels/hotelsSlice';
import Gallery from '../features/ui/Gallery';
import { getHotelLocation, formatPrice } from '../utils/format';
import './LandingPage.css';

export default function LandingPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.hotels);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchHotels({ limit: 50, offset: 0 }));
  }, [dispatch]);

  const showcaseItems = items.map((hotel) => ({
    id: hotel.id,
    src: hotel.image_url,
    title: hotel.title,
    location: getHotelLocation(hotel),
    price: hotel.price,
    description: hotel.description,
  }));

  return (
    <>
      <Helmet>
        <title>Hotels — Handcrafted Luxury & Boutique Stays</title>
        <meta
          name="description"
          content="Discover extraordinary boutique retreats, heritage havelis, and coastal villas in our interactive 3D Sphere Showcase."
        />
        <meta property="og:title" content="Hotels — Handcrafted Luxury Stays" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="hero">
        <div className="container hero__inner">
          <h1 className="hero__title">
            Find Stays That Feel <span className="hero__highlight">Extraordinary</span>
          </h1>

          <p className="hero__desc">
            Where every journey finds its perfect stay. Discover exceptional places, experience unmatched comfort, and make every moment memorable.
          </p>

          <div className="hero__ctas">
            <Link to="/showcase" className="btn btn--primary">
              Explore 3D Showcase
            </Link>
            {isAdmin ? (
              <Link to="/hotels/add" className="btn btn--outline">
                + Add a Hotel
              </Link>
            ) : (
              <Link to="/login" className="btn btn--outline">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="section-showcase">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-tag">Interactive Preview</span>
            <h2>Signature 3D Hotel Showcase</h2>
            <p className="section-sub">
              Every stay is pinned to our live interactive sphere. Drag or swipe in any direction to orbit the globe of stays, and click any photo to inspect details.
            </p>
          </div>

          {items.length > 0 && <Gallery items={showcaseItems} />}

          <div className="text-center" style={{ marginTop: '1rem' }}>
            <Link to="/showcase" className="btn btn--primary">
              Open Full Showcase Page &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="section-destinations">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Popular Getaways</span>
            <h2>Curated Destinations</h2>
            <p className="section-sub">
              Handpicked regions celebrated for culture, scenery, and unmatched hospitality.
            </p>
          </div>

          <div className="dest-grid">
            <div className="dest-card">
              <img src="/uploads/seed/hotel-01.jpg" alt="Rajasthan" className="dest-card__img" />
              <div className="dest-card__body">
                <h3>Rajasthan Royalty</h3>
                <p>Udaipur &amp; Jaipur havelis with palace views &amp; private boat rides.</p>
                <Link to="/showcase" className="dest-card__link">
                  Explore Stays &rarr;
                </Link>
              </div>
            </div>

            <div className="dest-card">
              <img src="/uploads/seed/hotel-02.jpg" alt="Goa" className="dest-card__img" />
              <div className="dest-card__body">
                <h3>Goan Coastlines</h3>
                <p>Candolim villas with shaded verandas two minutes from the sea.</p>
                <Link to="/showcase" className="dest-card__link">
                  Explore Stays &rarr;
                </Link>
              </div>
            </div>

            <div className="dest-card">
              <img src="/uploads/seed/hotel-05.jpg" alt="Manali" className="dest-card__img" />
              <div className="dest-card__body">
                <h3>Himalayan Retreats</h3>
                <p>Pine lodges in Manali and riverside rafting camps in Rishikesh.</p>
                <Link to="/showcase" className="dest-card__link">
                  Explore Stays &rarr;
                </Link>
              </div>
            </div>

            <div className="dest-card">
              <img src="/uploads/seed/hotel-11.jpg" alt="Dubai" className="dest-card__img" />
              <div className="dest-card__body">
                <h3>Global Metros</h3>
                <p>Infinity pool suites in Dubai Marina and Orchard Road Singapore.</p>
                <Link to="/showcase" className="dest-card__link">
                  Explore Stays &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-testimonials">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-tag">Guest Experiences</span>
            <h2>Loved by Discerning Travelers</h2>
          </div>

          <div className="reviews-grid">
            <blockquote className="review-card">
              <p>
                &ldquo;The 3D Sphere made exploring Udaipur hotels an absolute joy. The Lake Pichola Heritage Suite exceeded every expectation.&rdquo;
              </p>
              <footer>
                <strong>Priya Sharma</strong>
                <span>Mumbai, India</span>
              </footer>
            </blockquote>

            <blockquote className="review-card">
              <p>
                &ldquo;Candolim Beach House was peaceful, spotless, and two minutes from the waves. Best Goan getaway we have booked in years.&rdquo;
              </p>
              <footer>
                <strong>Alex Mitchell</strong>
                <span>London, UK</span>
              </footer>
            </blockquote>

            <blockquote className="review-card">
              <p>
                &ldquo;The Dubai Marina tower suite gave us 41st-floor infinity pool views over the skyline. Effortless check-in and booking.&rdquo;
              </p>
              <footer>
                <strong>Rohan Kulkarni</strong>
                <span>Bangalore, India</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section-cta">
        <div className="container">
          <div className="cta-banner">
            <div>
              <h2>Have an extraordinary stay to share?</h2>
              <p>List your boutique haveli, beach villa, or mountain lodge and welcome travelers from across the world.</p>
            </div>
            <Link to={isAdmin ? "/hotels/add" : "/login"} className="btn btn--primary cta-btn">
              {isAdmin ? "+ List Your Hotel Now" : "Sign In as Admin to List"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

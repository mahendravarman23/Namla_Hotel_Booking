export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span className="footer__brand">Hotels</span> © {new Date().getFullYear()}
      </div>
    </footer>
  );
}

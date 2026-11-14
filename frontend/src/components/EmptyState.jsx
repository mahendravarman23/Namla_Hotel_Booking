import { BuildingIcon } from './icons';

export default function EmptyState({ title, text, children }) {
  return (
    <div className="empty">
      <div className="empty__icon" aria-hidden="true">
        <BuildingIcon />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
}

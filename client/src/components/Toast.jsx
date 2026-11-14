import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../features/ui/uiSlice';

export default function Toast() {
  const toast = useSelector((state) => state.ui.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dispatch(hideToast()), 3200);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div key={toast.id} className={`toast toast--${toast.type}`} role="status" aria-live="polite">
      {toast.message}
    </div>
  );
}

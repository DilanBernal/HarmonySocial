import { useEffect, useRef, useCallback } from 'react';
import { Subscription } from 'rxjs';

/**
 * Hook personalizado para manejar subscripciones de RxJS
 * Automáticamente limpia las subscripciones cuando el componente se desmonta
 */
export const useRxSubscriptions = () => {
  const subscriptionsRef = useRef<Subscription[]>([]);

  const addSubscription = useCallback((subscription: Subscription) => {
    subscriptionsRef.current.push(subscription);
  }, []);

  const removeSubscription = useCallback((subscription: Subscription) => {
    const index = subscriptionsRef.current.indexOf(subscription);
    if (index > -1) {
      subscriptionsRef.current.splice(index, 1);
    }
  }, []);

  const unsubscribeAll = useCallback(() => {
    subscriptionsRef.current.forEach(sub => {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    });
    subscriptionsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      unsubscribeAll();
    };
  }, [unsubscribeAll]);

  return {
    addSubscription,
    removeSubscription,
    unsubscribeAll,
  };
};

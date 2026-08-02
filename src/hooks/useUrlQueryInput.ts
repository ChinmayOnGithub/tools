'use client';

import { useEffect } from 'react';

export function useUrlQueryInput(setInput: (val: string) => void) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const inputVal = params.get('input') || params.get('data');
      if (inputVal) {
        setInput(inputVal);
      }
    }
  }, [setInput]);
}

export default useUrlQueryInput;

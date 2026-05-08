'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAuth(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }, []);

    return <Component {...props} />;
  };
}

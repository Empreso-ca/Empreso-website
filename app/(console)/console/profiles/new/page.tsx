"use client";

import { Suspense } from 'react';
import NewProfilePage from '@/components/console/profile/NewProfilePage'
import "../profiles.css";

export default function Page() {
 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewProfilePage />
    </Suspense>
  );
}
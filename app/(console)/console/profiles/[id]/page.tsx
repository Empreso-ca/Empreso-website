"use client";

import { Suspense } from 'react';
import "../profiles.css"
import EditProfilePage from '@/components/console/profile/EditProfilePage';

export default function ProfilePage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProfilePage />
    </Suspense>
  );
}
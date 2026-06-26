import { Suspense } from "react";
import ProfilesClient from "./ProfilesClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilesClient />
    </Suspense>
  );
}
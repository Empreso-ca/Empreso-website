// editor/page.tsx
import { Suspense } from "react";
import CVEditorPage from "@/components/console/CVEditorPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CVEditorPage />
    </Suspense>
  );
}
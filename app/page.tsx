import { Suspense } from "react";
import ExperimentManager from "@/components/Survey/ExperimentManager";

export default function Home() {
  return (
    <main className="h-screen overflow-y-auto bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ExperimentManager />
      </Suspense>
    </main>
  );
}

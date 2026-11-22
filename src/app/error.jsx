"use client";

import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-10">
      <EmptyState
        icon={FiAlertTriangle}
        title="Something went wrong"
        description="We couldn't load this page. Please try again — if the problem continues, come back in a few minutes."
        className="py-28"
      >
        <Button onClick={reset}>Try Again</Button>
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </EmptyState>
    </div>
  );
}

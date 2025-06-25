"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function LoadingButton({ 
  loading, 
  children, 
  loadingText = "Loading...", 
  ...props 
}) {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
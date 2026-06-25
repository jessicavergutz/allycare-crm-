"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SSOLoader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        .then(({ error }) => {
          if (!error) {
            router.replace("/dashboard");
          } else {
            console.error("SSO authentication error:", error);
            router.replace("/login");
          }
        })
        .catch((err) => {
          console.error("SSO exception:", err);
          router.replace("/login");
        });
    } else {
      router.replace("/login");
    }
  }, [searchParams, router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-muted-foreground animate-pulse">Autenticando sessão administrativa...</p>
      </div>
    </div>
  );
}

export default function SSOPage() {
  return (
    <Suspense fallback={null}>
      <SSOLoader />
    </Suspense>
  );
}

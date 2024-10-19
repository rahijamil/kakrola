"use client";

import Script from "next/script";
import { supabaseBrowser } from "@/utils/supabase/client";
import { CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const OneTapComponent = () => {
  const router = useRouter();

  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(
        ...Array.from(crypto.getRandomValues(new Uint8Array(32)))
      )
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return [nonce, hashedNonce];
  };

  useEffect(() => {
    const initializeGoogleOneTap = async () => {
      console.log("Initializing Google One Tap");

      const [nonce, hashedNonce] = await generateNonce();
      console.log("Nonce: ", nonce, hashedNonce);

      const { data, error } = await supabaseBrowser.auth.getSession();
      if (error) {
        console.error("Error getting session", error);
      }
      if (data.session) {
        router.push("/app");
        return; // Existing session
      }

      // Ensure google is defined
      const google = window.google;
      if (!google) {
        console.error("Google One Tap API not loaded");
        return;
      }

      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: CredentialResponse) => {
          console.log("Google One Tap response: ", response);
          if (response.credential) {
            try {
              const { data, error } =
                await supabaseBrowser.auth.signInWithIdToken({
                  provider: "google",
                  token: response.credential,
                  nonce,
                });

              if (error) throw error;
              console.log("Session data: ", data);
              console.log("Successfully logged in with Google One Tap");
              router.push("/app");
            } catch (error) {
              console.error("Error logging in with Google One Tap", error);
            }
          }
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      });

      google.accounts.id.prompt(); // Display the One Tap UI
    };

    initializeGoogleOneTap();

    return () => {
      window.removeEventListener("load", initializeGoogleOneTap);
    };
  }, []);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        strategy="afterInteractive"
      />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default OneTapComponent;

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const SignupCTA = () => {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      router.push(`/auth/signup?email=${encodeURIComponent(email)}`);
    }
  };

  const handleGoogleSignup = () => {
    // Implement Google sign-up logic here
    console.log('Google sign-up clicked');
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {showEmailInput ? (
        <form onSubmit={handleEmailSubmit} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" className='group'>
            Sign up
            <ChevronsRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-all duration-300" />
          </Button>
        </form>
      ) : (
        <div className="flex space-x-4">
          <Button onClick={() => setShowEmailInput(true)}>
            Sign up with Email
            <ChevronsRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-all duration-300" />
          </Button>
          <Button variant="outline" onClick={handleGoogleSignup}>
            Continue with Google
          </Button>
        </div>
      )}
      <p className="text-sm text-text-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignupCTA;
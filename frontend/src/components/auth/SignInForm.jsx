"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { LoadingButton } from '@/components/ui/loading-button';
import { ErrorAlert } from '@/components/ui/error-alert';
import { useSignIn } from '@/hooks/useSignIn';
import { useRoleRedirect } from '@/hooks/useRoleRedirect';
import Link from 'next/link';

export default function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { loading, error, fieldErrors, signIn, clearError, clearFieldErrors } = useSignIn();
  
  // Handle automatic redirect after successful authentication
  useRoleRedirect();

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear errors when user starts typing
    if (fieldErrors[field]) {
      clearFieldErrors();
    }
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back!
          </CardTitle>
          <CardDescription>
            Sign in to your Detect to Protect account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorAlert message={error} />

            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={fieldErrors.email}
              required
            />

            <FormField
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={fieldErrors.password}
              required
            />

            <LoadingButton
              type="submit"
              className="w-full"
              loading={loading}
              loadingText="Signing in..."
            >
              Sign In
            </LoadingButton>

            <div className="text-center space-y-2">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline block"
              >
                Forgot your password?
              </Link>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/sign-up"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
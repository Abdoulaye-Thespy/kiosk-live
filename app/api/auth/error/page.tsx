// app/auth/error/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An unknown error occurred.';
  if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid email or password.';
  }

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{errorMessage}</p>
      <a href='/auth/signin'>Back to Sign In</a>
    </div>
  );
};

export default ErrorPage;
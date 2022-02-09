import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react';
import { checkUserSession } from '../lib'
import HomePage from '../components/HomePage'
import AuthPage from '../components/AuthPage';

const index: NextPage = () => {
  const [user, setUser] = useState<{
    userId: string,
    email: string
  } | null>(null)

  useEffect(() => {
    isAutheticated()
  }, [])

  const isAutheticated = async () => {
    const userResponse = await checkUserSession()
    if (userResponse) {
      setUser({
        userId: userResponse.attributes.sub,
        email: userResponse.attributes.email
      })
    }
  }

  return (
    <>
      {user ? (
        <HomePage />
      ) : (
        <AuthPage />
      )}
    </>
  );
}

export default index;





import { useEffect, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';

import Header from '@components/Header';
import netlifyAuth from '../netlifyAuth.js';

export default function Home() {

  let [
    loggedIn, 
    setLoggedIn
  ] = useState(netlifyAuth.isAuthenticated);

  let [
    user,
    setUser
  ] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    netlifyAuth.initialize((user) => {
      if (isCurrent) {
        setLoggedIn(!!user);
      }
    })

    return () => {
      isCurrent = false;
    }
  }, []);

  const login = () => {
    netlifyAuth.authenticate((user) => {
      setLoggedIn(!!user);
      setUser(user);
      console.log(user);
    })
  }
  
  const logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false);
      setUser(null);
    })
  }

  const redirectToPortal = () => {
    fetch('/.netlify/functions/create-portal-link', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token.access_token}`,
      }
    }).then(
      response => response.json()
    ).then((linkJson) => {
      window.location.href = linkJson.url;
    })
  }

  return (
    <div>
      <Header/>
      <h1>Hello world</h1>
      {loggedIn ? (
        <div>
        You are logged in!
        {user && <>Welcome {user?.user_metadata.full_name}!</>}
        <br /> 
        <button onClick={logout}>
          Log out here.
        </button>
        <button onClick={redirectToPortal}>
          Go to your portal.
        </button>
        </div>
      ) : (
        <button onClick={login}>
          Log in here.
        </button>
      )}
    </div>
  )
}

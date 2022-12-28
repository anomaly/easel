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

  let login = () => {
    netlifyAuth.authenticate((user) => {
      setLoggedIn(!!user);
      setUser(user);
      console.log(user);
    })
  }
  
  let logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false);
      setUser(null);
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
        </div>
      ) : (
        <button onClick={login}>
          Log in here.
        </button>
      )}
    </div>
  )
}

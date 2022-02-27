import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import UploadVideo from './UploadVideo';
import { database } from '../firebase';
import Posts from './Posts';

function Feed() {
    const { signout, user } = useContext(AuthContext)
    const [userData, setUserData] = useState('');
    useEffect(async () => {
        const unsub = await database.users.doc(user.uid).onSnapshot((snapshot) => {
            setUserData(snapshot.data())
        })
        return () => { unsub() }
    }, [user])
    return (
        <div>
            <h1>Welcome to feed</h1>
            <button onClick={signout}>LOGOUT</button>
            <UploadVideo user={userData} />
            <Posts user={userData} />
        </div>
    )
}

export default Feed
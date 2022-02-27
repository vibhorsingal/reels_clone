import { Alert, Button, Box } from '@mui/material';
import React, { useState } from 'react'
import { database, storage } from '../firebase'
import { v4 as uuidv4 } from 'uuid';
import LinearProgress from '@mui/material/LinearProgress';
import MovieIcon from '@mui/icons-material/Movie';

function UploadVideo({ user }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleUpload = async (file) => {
        setLoading(true);
        if (file == null) {
            setError('Please upload file')
            setTimeout(() => {
                setError('')
                setLoading(false);
            }, 2000)
            return;
        }
        if (file.size / (1024 * 1024) > 100) {
            setError('File size is greater than 100MB')
            setTimeout(() => {
                setError('')
                setLoading(false);
            }, 2000)
            return;
        }
        try {
            const uid = uuidv4();
            const uploadTask = storage.ref(`posts/${uid}/video`).put(file)
            uploadTask.on('state_changed',
                function (snapshot) {
                    setLoading(true);
                    var percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                    console.log(percent + "% done");
                },
                function fn1(error) {
                    setError(error.message);
                    setTimeout(() => {
                        setError('');
                    }, 2000)
                },
                function () {
                    console.log(user)
                    uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                        setLoading(true)
                        let postObj = {
                            userId: user.userId,
                            videoUrl: url,
                            likes: [],
                            comments: [],
                            pId: uid,
                            userName: user.name,
                            profileImg: user.profileImageUrl,
                            createdAt: database.getTimeStamp
                        }
                        console.log(postObj)
                        database.posts.add(postObj).then(async (ref) => {
                            let res = await database.users.doc(user.userId).update({
                                postIds: user.postIds != null ? [...user.postIds, ref.id] : [ref.id]
                            })
                        }).then(() => {
                            setLoading(false)
                        }).catch((error) => {
                            setError(error.message);
                            setLoading(false)
                            setTimeout(() => {
                                setError('');
                            }, 2000)
                        })
                    })

                    console.log('upload completed')
                }
            );

        }
        catch (err) {
            setError(err);
            setTimeout(() => {
                setError("");
            }, 2000)
            return;
        }
        setLoading(false);
    }
    return (
        <div >
            {error != '' && <Alert severity="error">{error}</Alert>}
            <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>

                    <input type="file" accept='video/*' id='uploadVideo' style={{ display: 'none' }} onChange={(e) => { handleUpload(e.target.files[0]) }} />
                    <label htmlFor="uploadVideo">
                        <Button variant='outlined' color='secondary' disabled={loading} component="span" size='small' >
                            <MovieIcon /> Upload Video
                        </Button>
                    </label>
                </div>
                {
                    loading && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                        <Box sx={{ width: '9%' }}>
                            <LinearProgress color="secondary" />
                        </Box>
                    </div>
                }
            </>
        </div>
    )
}

export default UploadVideo
import * as React from 'react';
import { useContext, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
// import CardMedia from '@mui/material/CardMedia';
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import './Signup.css'
import insta from '../Assets/instagram.png'
import { TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { database, storage } from '../firebase';

export default function Signup() {
    const navigate = useNavigate();
    const store = useContext(AuthContext)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);
    const { signup } = store
    const useStyles = makeStyles({
        text1: {
            color: 'grey',
            textAlign: 'center',
            marginTop: '0px',
            marginBottom: '0px',
            padding: '2px'
        },
        card2: {
            marginTop: '3px',
            width: '28vw',
            height: '4vh'
        }
    })

    const handleSignup = async () => {
        if (file == null) {
            setError('Please upload Image');
            setTimeout(() => {
                setError("");
            }, 2000)
            return;
        }
        else {
            try {
                const user = await signup(email, password)
                const uid = user.user.uid
                console.log(uid)
                setLoading(true);
                setError('');
                console.log(storage)
                const uploadTask = storage.ref(`user/${uid}/profile`).put(file)
                uploadTask.on('state_changed',
                    function (snapshot) {
                        var percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                        console.log(percent + "% done");
                    },
                    function fn1(error) {
                        console.log(error.message)
                    },
                    function () {
                        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                            console.log(url)
                            database.users.doc(uid).set({
                                'email': email,
                                'userId': uid,
                                'name': name,
                                'profileImageUrl': url,
                                'createdAt': database.getTimeStamp
                            })
                        })
                        setLoading(false);
                        console.log('upload completed')
                    }
                );
                navigate('/', { replace: true })
            }
            catch (err) {
                setError(err);
                setTimeout(() => {
                    setError("");
                }, 2000)
                return;
            }
        }
    }
    const classes = useStyles()
    return (
        <div className="signupWrapper">
            <div className='signupCard'>
                <Card variant="outlined">
                    <CardContent>
                        <div className='instaLogo'>
                            <img src={insta} alt="" style={{ 'width': "100%", 'height': '130px' }} />
                        </div>
                        <Typography variant="subtitle1" className={classes.text1}>
                            Signup to see photos and videos from your
                        </Typography>
                        {error != '' && <Alert severity="error">{error}</Alert>}
                        <TextField margin='dense' size='small' fullWidth variant="outlined" label="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        <TextField margin='dense' size='small' fullWidth variant="outlined" label="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        <TextField margin='dense' size='small' fullWidth variant="outlined" label="Username" value={name} onChange={(e) => { setName(e.target.value) }} />
                        <Button variant="outlined" fullWidth={true} startIcon={<CloudUploadIcon />} component='label' color='secondary' margin='dense'>
                            upload profile picture
                            <Input accept="image/*" id="icon-button-file" type="file" sx={{ 'display': 'none' }} onChange={(e) => { setFile(e.target.files[0]) }} />
                        </Button>

                    </CardContent>
                    <CardActions>
                        <Button size="small" variant="contained" fullWidth disabled={loading} onClick={handleSignup}>SIGNUP</Button>
                    </CardActions>
                    <Typography variant="subtitle1" className={classes.text1}>
                        By signing up you are agreeing to our terms, conditions and cookies policy
                    </Typography>
                </Card>
                <Card variant='outlined' className={classes.card2}>
                    <Typography variant="subtitle2" className={classes.text1} >
                        Already have an account?<Link to="/login" style={{ 'textDecoration': 'none' }}>Login</Link>
                    </Typography>
                </Card>
            </div>
        </div>
    );
}

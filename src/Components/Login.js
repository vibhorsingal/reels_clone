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
import './Login.css'
import insta from '../Assets/instagram.png'
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login } = useContext(AuthContext)
    const useStyles = makeStyles({
        text1: {
            color: 'grey',
            textAlign: 'center',
            marginTop: '0px',
            marginBottom: '0px',
            padding: '2px'
        },
        text2: {
            textAlign: 'center'
        },
        card2: {
            marginTop: '3px',
            width: '28vw',
            height: '4vh'
        }
    })
    const classes = useStyles()
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleLogin = async () => {
        try {
            setLoading(true);
            console.log('email', email)
            const user = await login(email, password);
            setLoading(false);
            navigate('/')
        }
        catch (error) {
            setError(error.message);
            console.log(error.message);
            setTimeout(() => {
                setError('');
                setLoading(false);
            }, 2000)
        }
    }
    return (
        <div className="loginWrapper">
            <div className='loginCard'>
                <div>
                    <CarouselProvider
                        naturalSlideWidth={100}
                        naturalSlideHeight={125}
                        totalSlides={3}
                        infinite={true}
                    // hasMasterSpinner={true}
                    >
                        <Slider>
                            <Slide index={0}>I am the first Slide.</Slide>
                            <Slide index={1}>I am the second Slide.</Slide>
                            <Slide index={2}>I am the third Slide.</Slide>
                        </Slider>
                    </CarouselProvider>
                </div>
            </div>
            <div className='loginCard'>
                <Card variant="outlined">
                    <CardContent>
                        <div className='instaLogo'>
                            <img src={insta} alt="" style={{ 'width': "100%", 'height': '130px' }} />
                        </div>
                        {error != '' && <Alert severity="error">{error}</Alert>}
                        <TextField margin='dense' size='small' fullWidth variant="outlined" label="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        <TextField margin='dense' size='small' fullWidth variant="outlined" label="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                        <Typography variant="subtitle1" color='primary' className={classes.text2}>
                            Forgot password?
                        </Typography>
                        <Button variant="contained" fullWidth={true} color='primary' margin='dense' disabled={loading} onClick={handleLogin}>
                            Login
                        </Button>
                    </CardContent>
                </Card>
                <Card variant='outlined' className={classes.card2}>
                    <Typography variant="subtitle2" className={classes.text1} margin='dense'>
                        Don't have an account?<Link to="/signup" style={{ 'textDecoration': 'none' }}>Signup</Link>
                    </Typography>
                </Card>
            </div>
        </div>
    );
}

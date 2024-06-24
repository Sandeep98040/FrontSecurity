import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/authContext';
import { useUser } from '../../utils/userContext';
import userServices from '../../services/userService';
import { Alert, Avatar, Chip, Grid, Snackbar } from '@mui/material';
import { isEmail } from '../../lib/input-validation';
import { ResponsiveAppBarLandingPage } from '../AppBar/ResponsiveAppBarLandingPage';
import ReCAPTCHA from "react-google-recaptcha";
import recaptchKeys from '../../services/recaptcha';

function Login() {
    const auth = useAuth();
    const user = useUser();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [formError, setFormError] = useState("");
    const [formWarning, setFormWarning] = useState("");

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleEmailError = () => {
        if (!credentials.email || !isEmail(credentials.email)) {
            setEmailError(true);
            setFormError("Please, enter a valid email address.");
            return;
        }
        setEmailError(false);
        setFormError("");
    };

    const handlePasswordError = () => {
        if (!credentials.password) {
            setPasswordError(true);
            setFormError("Please, enter a valid password.");
            return;
        }
        setPasswordError(false);
        setFormError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setFormError("");
        setFormWarning("");

        if (credentials.email === "" || credentials.password === "") {
            setFormError("Please, enter all the fields.");
            return;
        }

        if (!recaptchaToken) {
            setFormError("Please complete the reCAPTCHA.");
            return;
        }

        console.log("reCAPTCHA token: ", recaptchaToken); // Debugging step
        console.log("Credentials: ", credentials); // Debugging step

        try {
            const res = await userServices.login({ ...credentials, recaptchaToken });
            console.log("Login successful, response: ", res); // Debugging step
            auth.setEmail(credentials.email);
            window.localStorage.setItem('token', res.token);
            user.setUser(res.user);

            setRecaptchaToken(null);

            const passwordChangeRes = await userServices.passwordNeedChange();
            if (passwordChangeRes.message === true) {
                navigate('/changePassword');
            }

            if (res.user.role === 'user') {
                navigate('/home');
            } else if (res.user.role === 'admin') {
                navigate('/addProduct');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error("Error during login: ", err); // Detailed logging
            console.log("Error response data: ", err.response?.data); // Log detailed error response
            const errorMessage = err.response?.data?.error || "An error occurred during login.";
            setFormError(errorMessage);
            setOpen(true);
        }
    };

    const onChange = (value) => {
        console.log("reCAPTCHA value: ", value); // Debugging step
        setRecaptchaToken(value);
    };

    return (
        <>
            <ResponsiveAppBarLandingPage />
            <div className="bg-darkzero h-screen w-screen">
                <div className="text-3xl p-2 font-bold">Welcome to Samaan Kinam E-commerce</div>
                <div className="w-[80%] mx-auto" align="center">
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <div className="mx-auto pt-10">
                                <img src="https://img.freepik.com/free-vector/ecommerce-checkout-laptop-concept-illustration_114360-8243.jpg?size=626&ext=jpg&ga=GA1.1.1078491387.1698994615&semt=ais" alt="" />
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className='mx-auto pt-10'>
                                <div style={{ border: '1px solid green', boxShadow: "0 0 50px rgb(26, 176, 23)" }}
                                     className="rounded-lg mt-3 text-white bg-indigo-500 p-5 m-auto lg:w-[500px] md:w-[400px] sm:w-[300px]"
                                     align="center">
                                    <div className="text-3xl font-bold">LOGIN</div>
                                    <div className="mt-5">
                                        <div className="mt-3 mb-2" align="left">Email:</div>
                                        <input type="email" onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                               placeholder="Enter Your Email ..." onBlur={handleEmailError}
                                               className={`input input-bordered ${emailError ? "input-error" : "input-accent"} w-full`} />
                                    </div>
                                    <div className="mt-5">
                                        <div className="mt-3 mb-2" align="left">Password:</div>
                                        <input type={showPassword ? 'text' : 'password'}
                                               onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                               placeholder="Enter Your Password ..." onBlur={handlePasswordError}
                                               className={`input input-bordered ${passwordError ? "input-error" : "input-accent"} w-full`} />
                                    </div>
                                    <br />
                                    <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} /> Show Password
                                    <br />
                                    {formError && (
                                        <div className="alert alert-error mt-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{formError}</span>
                                        </div>
                                    )}
                                    {formWarning && (
                                        <div className="warning-section mt-4">
                                            <div className="alert alert-warning">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <span>{formWarning}</span>
                                            </div>
                                        </div>
                                    )}
                                    <br />
                                    <ReCAPTCHA sitekey={recaptchKeys.secondSiteKey} onChange={onChange} />
                                    <button onClick={handleLogin} className='btn btn-primary w-full font-bold mt-8 mb-8' disabled={!recaptchaToken}>LOGIN</button>
                                    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>Error: {formError}</Alert>
                                    </Snackbar>
                                    <label htmlFor="" className='p-4'>Don't have an account ?</label>
                                    <Chip Avatar={<Avatar>R</Avatar>} color="success" label="REGISTER YOUR ACCOUNT" onClick={() => navigate('/signup')} />
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
}

export default Login;

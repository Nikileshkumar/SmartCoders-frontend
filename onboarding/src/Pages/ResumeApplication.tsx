import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setApplicationData } from '../slices/applicationSlice';
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    InputAdornment,
    Container,
    Paper,
    Alert,
    Snackbar,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { resumeApplication, verifyOtp } from '../Services/ApiService';

import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';


type ApplicationResponse = {
    id: string;
    appid: string;
    journeytype: string;
};

const StartApplication: React.FC = () => {
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [applicationId, setApplicationId] = useState<string>('');
    const navigate = useNavigate();


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (token) {
            setOtpSent(true);
            setOtpVerified(true);
            console.log('Token received:', token);
            resumeApplication(token).then((data: any) => {
                
                console.log('Resume Application Data:', data);
                if (data?.id) {
                    setAlert({ open: true, type: 'success', message: data.message || 'OTP sent successfully' });
                    setApplicationId(data.id);
                    dispatch(setApplicationData({ id: data.id, appid: '', journeytype: '' }));
                } else {
                    setAlert({ open: true, type: 'error', message: 'Invalid Request' });
                }
            });
        }
    }, [token]);


    const [form, setForm] = useState({
        otp: '',
    });



    // Snackbar state
    const [alert, setAlert] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
        open: false,
        type: 'success',
        message: '',
    });



    const handleVerifyOtp = () => {
        if(form.otp) { 
            verifyOtp(applicationId, form.otp).then((data: any) => {
                if (data?.success) {
                    setOtpVerified(true);
                    setAlert({ open: true, type: 'success', message: 'OTP verified successfully!' });
                    navigate('/setup-account');
                } else {
                    setOtpVerified(false);
                    setAlert({ open: true, type: 'error', message: 'Invalid OTP' });
                }
            }).catch((error) => {
                setOtpVerified(false);
                setAlert({ open: true, type: 'error', message: error.message || 'Failed to verify OTP' });
            });
        
        } else {
            setOtpVerified(false);
            setAlert({ open: true, type: 'error', message: 'Invalid OTP' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
          setOtpVerified(false);
    };

    const handleAlertClose = () => {
        setAlert({ ...alert, open: false });
    };


    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box component="form" sx={{ mt: 2, maxWidth: 700, mx: 'auto' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        You would have received an OTP on your mobile number.
                        Please enter it below to verify your identity.
                    </Typography>
                    {otpSent && (
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                label="Enter OTP"
                                name="otp"
                                value={form.otp}
                                onChange={handleChange}
                                type="password"
                                required
                                sx={{ flex: 1 }}
                            />
                            <Button
                                variant="contained"
                                color={otpVerified ? "success" : "primary"}
                                onClick={handleVerifyOtp}
                                disabled={otpVerified}
                                sx={{ minWidth: 120 }}
                            >
                                {otpVerified ? 'Verified' : 'Verify OTP'}
                            </Button>
                        </Box>
                    )}
                   
                </Box>
                <Snackbar
                    open={alert.open}
                    autoHideDuration={4000}
                    onClose={handleAlertClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleAlertClose}
                        severity={alert.type}
                        sx={{
                            width: '100%',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 2
                        }}
                    >
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Paper>
        </Container>
    );
};

export default StartApplication;
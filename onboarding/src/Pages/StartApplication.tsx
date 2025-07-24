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
import { createApplication } from '../Services/ApiService';

const salutationOptions = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Ms', label: 'Ms' },
  { value: 'Dr', label: 'Dr' },
];

type ApplicationResponse = {
  id: string;
  appid: string;
  journeytype: string;
};

const StartApplication: React.FC = () => {

  const [form, setForm] = useState({
    salutation: '',
    firstname: '',
    lastname: '',
    countryCode: '',
    mobilenumber: '',
    otp: '',
    email: '',
    address: '',
    postalcode: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Snackbar state
  const [alert, setAlert] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
    open: false,
    type: 'success',
    message: '',
  });

  // Simulate OTP send/verify
  const handleSendOtp = () => {
    if (form.mobilenumber) {
      setOtpSent(true);
      // In real app, call backend to send OTP here
    }
  };

  const handleVerifyOtp = () => {
    if (form.otp === '123456') { // Simulate OTP check
      setOtpVerified(true);
    } else {
      setOtpVerified(false);
      setAlert({ open: true, type: 'error', message: 'Invalid OTP' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestData = {
        status: 'inprogress',
        journeytype: 'PCA',
        salutation: form.salutation,
        firstname: form.firstname,
        lastname: form.lastname,
        mobilenumber: form.countryCode + form.mobilenumber,
        email: form.email,
        address: form.address,
        postalcode: form.postalcode,
        formdata: '{}',
        currentpage: 0
      };
      const res = await createApplication(requestData) as ApplicationResponse;
      if (res && res.id && res.appid && res.journeytype) {
        dispatch(setApplicationData({ id: res.id, appid: res.appid, journeytype: res.journeytype }));
      }
      // Dispatch to Redux
      if (res && res.id && res.appid && res.journeytype) {
        dispatch(setApplicationData({ id: res.id, appid: res.appid, journeytype: res.journeytype }));
      }
      setAlert({ open: true, type: 'success', message: 'Application submitted successfully!' });
      setTimeout(() => {
        navigate('/setup-account');
      }, 2000);
    } catch (error: any) {
      setAlert({ open: true, type: 'error', message: error.message || 'Failed to submit application' });
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" sx={{ mt: 2, maxWidth: 700, mx: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Personal Details
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              select
              label="Salutation"
              name="salutation"
              value={form.salutation}
              onChange={handleChange}
              required
              sx={{ minWidth: 120 }}
              size="small"
            >
              {salutationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="First Name"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              required
              sx={{ flex: 1 }}
              size="small"
            />
            <TextField
              label="Last Name"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              required
              sx={{ flex: 1 }}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              sx={{ flex: 1 }}
              type="email"
              size="small"
            />
            <TextField
              label="Postal Code"
              name="postalcode"
              value={form.postalcode}
              onChange={handleChange}
              required
              sx={{ flex: 1 }}
              size="small"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              fullWidth
              multiline
              minRows={2}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Mobile Number"
              name="mobilenumber"
              value={form.mobilenumber}
              onChange={handleChange}
              required
              sx={{ flex: 1 }}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ minWidth: 120 }}
              onClick={handleSendOtp}
              disabled={otpSent || !form.mobilenumber}
            >
              {otpSent ? 'OTP Sent' : 'Send OTP'}
            </Button>
          </Box>

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
                disabled={otpVerified}
                size="small"
              />
              <Button
                variant="contained"
                color={otpVerified ? 'success' : 'primary'}
                onClick={handleVerifyOtp}
                disabled={otpVerified}
                sx={{ minWidth: 120 }}
              >
                {otpVerified ? 'Verified' : 'Verify OTP'}
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              disabled={!otpVerified || loading}
              sx={{ bgcolor: 'black', fontWeight: 700, color: 'white' }}
              onClick={handleSubmit}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
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
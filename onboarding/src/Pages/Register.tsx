import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import Steps from '../components/Steps';
import formJson from '../formEelement.json';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AskLloydChatBot from '../components/Bot/AskLloydChatBot';

const REGISTRATION_STEPS = Array.isArray(formJson.pages)
  ? formJson.pages.map((step: any) => ({
    name: step?.title || 'Untitled',
    Component: () => (
      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
        {step?.description || ''}
      </Typography>
    ),
  }))
  : [];

const Register: React.FC = () => {
  const application = useSelector((state: RootState) => state.application);

  const isValidApplication =
    application ?? '';
  if (!isValidApplication) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" color="error">
            Application data not found. Please restart the process.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Setup Your Account
        </Typography>

        <Typography component="div" variant="body1">
          <Steps stepsConfig={REGISTRATION_STEPS} formJson={formJson} />
        </Typography>

        <Typography variant="body2" sx={{ mt: 2 }}>
          <strong>Application ID:</strong> {application.id}
          <br />
          <strong>App ID:</strong> {application.appid}
          <br />
          <strong>Journey Type:</strong> {application.journeytype}
        </Typography>
      </Paper>

      {/* 🟢 Embedded chatbot floating at bottom-right */}
      <AskLloydChatBot
        journeyType={application.journeytype ?? ''}
        appId={typeof application.id === 'number' ? application.id : 0}
      />
    </Container>
  );
};

export default Register;

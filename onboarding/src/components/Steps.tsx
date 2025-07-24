// eslint-disable react/prop-types

import { Button, StepLabel, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import { useEffect, useState } from "react";
import Eelement from "./Eelement";
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { updateApplication, getApplication, uploadDocument, submitApplication } from '../Services/ApiService';

interface StepConfig {
  name: string;
  Component: React.FC;
}

interface StepsProps {
  stepsConfig: StepConfig[];
  formJson: any;
}

const Steps: React.FC<StepsProps> = ({ stepsConfig, formJson }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const { id } = useSelector((state: RootState) => state.application);
  const [formData, setFormData] = useState({});
  const [elements, setElements] = useState(
    formJson?.pages?.length > 0 ? formJson.pages[0] : null
  );
  const { fields } = elements ?? {};

  useEffect(() => {
    setElements(formJson.pages[currentStep - 1]);
  }, [currentStep, formJson]);

  useEffect(() => {
    async function fetchAndPrefill() {
      if (!id) return;
      const data: any = await getApplication(id);
      if (data?.formdata) {
        try {
          const parsedForm = JSON.parse(data.formdata);
          setFormData(parsedForm);
          formJson.pages.forEach((page: any) => {
            page.fields.forEach((field: any) => {
              if (parsedForm[field.name] !== undefined) {
                field.value = parsedForm[field.name];
              }
            });
          });
          setElements({ ...formJson.pages[currentStep - 1] });
        } catch (e) {
          console.error('Failed to parse formdata', e);
        }
      }
      if (data?.currentpage && Number.isInteger(data.currentpage)) {
        setCurrentStep(data.currentpage);
      }
    }
    fetchAndPrefill();
  }, [id]);

  const [alert, setAlert] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    open: false,
    type: 'success',
    message: '',
  });

  const navigate = useNavigate();
  if (!stepsConfig.length) return <></>;

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleNext = async () => {
    if (!id) {
      setAlert({ open: true, type: 'error', message: 'No application to update.' });
      return;
    }

    try {
      if (currentStep >= stepsConfig.length) {
        setIsComplete(true);
        setAlert({ open: true, type: 'success', message: 'Application submitted successfully!' });
        await submitApplication(id, currentStep, formData);
      } else {
        setAlert({ open: true, type: 'success', message: 'Step saved successfully!' });
        setCurrentStep(prev => prev + 1);
      }
    } catch (error) {
      setAlert({ open: true, type: 'error', message: 'Failed to save application' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    formJson.pages.forEach((page: any) => {
      page.fields.forEach((field: any) => {
        if (field.name === name) field.value = value;
      });
    });
    setElements({ ...formJson.pages[currentStep - 1] });
  };

  const handleSaveAndExit = async () => {
    if (!id) {
      setAlert({ open: true, type: 'error', message: 'No application to update.' });
      return;
    }
    try {
      setAlert({ open: true, type: 'success', message: 'Application is in progress' });
      await updateApplication(id, currentStep, formData);
      navigate('/');
    } catch (error) {
      setAlert({ open: true, type: 'error', message: 'Failed to save application' });
    }
  };

  const handleUpload = async (file: File, fieldName: string) => {
    if (!id) {
      setAlert({ open: true, type: 'error', message: 'Application ID is missing' });
      return;
    }

    const currentPageIndex = currentStep - 1;
    const fieldExists = formJson.pages[currentPageIndex]?.fields.some(
      (field: any) => field.name === fieldName
    );
    if (!fieldExists) {
      setAlert({ open: true, type: 'error', message: `Field "${fieldName}" not found.` });
      return;
    }

    try {
      const uploadedUrl = await uploadDocument(id, currentStep, fieldName, file);
      setFormData(prev => ({ ...prev, [fieldName]: uploadedUrl }));
      formJson.pages.forEach((page: any) => {
        page.fields.forEach((field: any) => {
          if (field.name === fieldName) field.value = uploadedUrl;
        });
      });
      setElements({ ...formJson.pages[currentPageIndex] });
      setAlert({ open: true, type: 'success', message: 'File uploaded successfully' });
    } catch (error) {
      console.error("Upload failed:", error);
      setAlert({ open: true, type: 'error', message: 'File upload failed' });
    }
  };

  const handleAlertClose = () => setAlert(prev => ({ ...prev, open: false }));

  const ActiveComponent = stepsConfig[currentStep - 1]?.Component;

  return (
    <Box sx={{ width: '100%' }} aria-label="Form Steps Container">
      <Stepper activeStep={currentStep - 1} aria-label="Stepper Navigation">
        {stepsConfig.map((step, index) => (
          <Step key={step.name} aria-current={currentStep - 1 === index}>
            <StepLabel>{step.name}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <ActiveComponent />

      <Box sx={{ mt: 3 }}>
        {fields?.map((field: any, idx: number) => (
          <Eelement
            key={idx}
            field={{
              ...field,
              onChange: handleChange,
              onFileChange: handleUpload,
            }}
          />
        ))}
      </Box>

      <Box justifyContent="space-between" sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          aria-label="Go to previous step"
          color="inherit"
          variant="outlined"
          disabled={currentStep === 1}
          onClick={handleBack}
          sx={{ mr: 1, fontWeight: 700, color: "black" }}
        >
          Back
        </Button>
        <Button
          aria-label="Save and exit form"
          color="inherit"
          variant="outlined"
          onClick={handleSaveAndExit}
          sx={{ mr: 1, fontWeight: 700, color: "black" }}
        >
          Save & Exit
        </Button>
        <Button
          aria-label="Proceed to next step"
          className="btn"
          sx={{ bgcolor: "black", fontWeight: 700, color: "white" }}
          variant="contained"
          onClick={handleNext}
        >
          {currentStep >= stepsConfig.length ? "Finish" : "Next"}
        </Button>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        role="status"
        aria-live="polite"
      >
        <Alert onClose={handleAlertClose} severity={alert.type} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Steps;

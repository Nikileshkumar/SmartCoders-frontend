import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

interface FieldOption {
  value: string | number;
  label: string;
}

interface FieldProps {
  type: string;
  label?: string;
  name: string;
  options?: FieldOption[] | string[];
  value?: string | number;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange?: (file: File, fieldName: string) => void;
  accept?: string[];
  [key: string]: any;
}

function Eelement({ field }: { field: FieldProps }) {
  const {
    type,
    label,
    name,
    options,
    value,
    required,
    onChange,
    onFileChange,
    accept,
    ...rest
  } = field;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Normalize options for select/radio
  const normalizedOptions: FieldOption[] = (options || []).map((opt: any) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Load initial preview for existing file URL
  useEffect(() => {
    if (typeof value === 'string' && value.startsWith('http')) {
      setPreviewUrl(value);
    }
  }, [value]);

  // Handles file input change and preview logic
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    // Send selected file to parent via prop function
    if (onFileChange) {
      onFileChange(file, name);
    }

    setUploading(false);
  };

  switch (type) {
    case 'file':
      return (
        <Box sx={{ my: 2 }}>
          {/* Accessible file input label */}
          <FormLabel htmlFor={`${name}-upload`} sx={{ display: 'block', fontWeight: 600 }}>
            {label || name}
          </FormLabel>

          <input
            id={`${name}-upload`}
            type="file"
            name={name}
            accept={accept?.join(',')}
            onChange={handleFileChange}
            required={required}
            aria-describedby={`${name}-preview`}
            style={{ marginTop: '8px' }}
            {...rest}
          />

          {/* Show loading indicator while file is uploading */}
          {uploading && <CircularProgress size={24} sx={{ mt: 1 }} aria-label="Uploading file" />}

          {/* Show preview of uploaded file */}
          {previewUrl && (
            <Box sx={{ mt: 2 }} id={`${name}-preview`}>
              {previewUrl.endsWith('.pdf') ? (
                <object
                  data={previewUrl}
                  type="application/pdf"
                  width="100%"
                  height="400px"
                  aria-label="PDF file preview"
                >
                  {/* Fallback content for screen readers and unsupported browsers */}
                  <p>
                    PDF preview not available.{' '}
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                      Download PDF
                    </a>
                  </p>
                </object>
              ) : (
                <img
                  src={previewUrl}
                  alt={`Preview of uploaded file`}
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 4 }}
                />
              )}
            </Box>
          )}
        </Box>
      );

    case 'radio':
      return (
        <FormControl component="fieldset" required={required} margin="normal" fullWidth>
          <FormLabel component="legend">{label || name}</FormLabel>
          <RadioGroup
            name={name}
            value={value ?? ''}
            onChange={onChange}
            row
            aria-label={label || name}
          >
            {normalizedOptions.map((option, idx) => (
              <FormControlLabel
                key={idx}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );

    case 'select':
      return (
        <TextField
          select
          fullWidth
          margin="normal"
          size="small"
          label={label || name}
          name={name}
          value={value ?? ''}
          required={required}
          onChange={onChange}
          inputProps={{ 'aria-label': label || name }}
          {...rest}
        >
          <MenuItem value="">Select an option</MenuItem>
          {normalizedOptions.map((option, idx) => (
            <MenuItem key={idx} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );

    default:
      return (
        <TextField
          fullWidth
          margin="normal"
          type={type}
          label={label || name}
          name={name}
          value={value ?? ''}
          required={required}
          onChange={onChange}
          inputProps={{ 'aria-label': label || name }}
          {...rest}
        />
      );
  }
}

export default Eelement;

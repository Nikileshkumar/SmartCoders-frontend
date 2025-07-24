import axios from 'axios';
import { verify } from 'crypto';

const BASE_URL = 'http://localhost:8080/api';

export interface CreateApplicationPayload {
  status: string;
  salutation: string;
  firstname: string;
  lastname: string;
  mobilenumber: string;
  email: string;
  address: string;
  postalcode: string;
  formdata: string;
  currentpage: number;
  journeytype?: string;
  appid?: string;
}

interface ApplicationResponse {
  status?: string;
  salutation?: string;
  firstname?: string;
  lastname?: string;
  mobilenumber?: string;
  email?: string;
  address?: string;
  postalcode?: string;
  formdata?: string;
  currentpage?: number;
  journeytype?: string;
  appid?: string;
}

interface UploadResponse {
  fileUrl?: string;
  url?: string;
  [key: string]: any;
}

export const getApplication = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/applications/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log('Server Error', error.response.data?.message);
    } else if (error.request) {
      console.log('No response from server');
    } else {
      console.log('Unknown error', error.message);
    }
  }
};

export const createApplication = async (payload: CreateApplicationPayload) => {
  try {
    const response = await axios.post(`${BASE_URL}/applications`, payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log('Server Error', error.response.data?.message);
    } else if (error.request) {
      console.log('No response from server');
    } else {
      console.log('Unknown error', error.message);
    }
  }
};

export const updateApplication = async (id: string, currentpage: number, formData: Partial<CreateApplicationPayload>) => {
  try {
    const response = await axios.get<ApplicationResponse>(`${BASE_URL}/applications/${id}`);
    let responseData = response.data || {};
    let ResformData = JSON.parse(responseData.formdata || '{}');
    responseData.currentpage = currentpage;
    responseData.formdata = JSON.stringify({ ...ResformData, ...formData });
    const updateResponse = await axios.put(`${BASE_URL}/applications`, responseData);
    console.log('Update Response:', updateResponse.data);
    return updateResponse.data;

  } catch (error: any) {
    if (error.response) {
      console.log('Server Error', error.response.data?.message);
    } else if (error.request) {
      console.log('No response from server');
    } else {
      console.log('Unknown error', error.message);
    }
  }
};


export const submitApplication = async (
  id: string,
  currentpage: number,
  formData: Partial<CreateApplicationPayload>
) => {
  try {
    const response = await axios.get<ApplicationResponse>(`${BASE_URL}/applications/${id}`);
    let responseData = response.data || {};
    let ResformData = JSON.parse(responseData.formdata || '{}');
    responseData.currentpage = currentpage;
    responseData.formdata = JSON.stringify({ ...ResformData, ...formData });

    const updateResponse = await axios.post(`${BASE_URL}/applications/submit-application`, responseData);
    console.log('Update Response:', updateResponse.data);

    const redirectUrl = updateResponse.data;

    if (typeof redirectUrl === 'string') {
      window.location.href = redirectUrl;
    } else {
      console.error('Invalid redirect URL:', redirectUrl);
    }

  } catch (error: any) {
    if (error.response) {
      console.log('Server Error', error.response.data?.message);
    } else if (error.request) {
      console.log('No response from server');
    } else {
      console.log('Unknown error', error.message);
    }
  }
};


export const resumeApplication = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/applications/resume-journey?token=${token}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log('Server Error', error.response.data?.message);
    } else if (error.request) {
      console.log('No response from server');
    } else {
      console.log('Unknown error', error.message);
    }
  }
}

export const verifyOtp = async (id: string, otp: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/verify`, { id, otp });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log('Server Error', error.response.data?.message);
    } else if (error.request) {
      console.log('No response from server');
    } else {
      console.log('Unknown error', error.message);
    }
  }
}

/**
 * Upload a document to the server.
 *
 * @param id - Application ID
 * @param currentPage - Current page number
 * @param fieldName - Name of the field being uploaded
 * @param file - File (binary)
 * @returns Upload result
 */
export const uploadDocument = async (
  id: string,
  currentPage: number,
  fieldName: string,
  file: File
): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append('id', id);
  formData.append('currentPage', currentPage.toString());
  formData.append('fieldName', fieldName);
  formData.append('file', file);

  try {
    const response = await axios.post<UploadResponse>(`${BASE_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Log and inspect the actual response
    console.log('Upload response:', response.data);

    // Return the file URL — update this based on real structure
    return response.data?.fileUrl || response.data?.url || undefined;

  } catch (error: any) {
    if (error.response) {
      console.error('Upload failed:', error.response.data?.message);
    } else if (error.request) {
      console.error('No response from server during file upload.');
    } else {
      console.error('Unexpected error during file upload:', error.message);
    }
  }
};

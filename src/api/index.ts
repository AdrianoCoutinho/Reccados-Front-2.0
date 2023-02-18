/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { LoginUserType, NoteType, RegisterUserType } from '../types';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export interface ApiResponse {
  ok: boolean;
  data?: any;
  message: string;
  notes?: [];
}

export const createUser = async (user: RegisterUserType): Promise<ApiResponse> => {
  try {
    const result = await axios.post('/', user);
    return result.data;
  } catch (error: any) {
    if (error.request?.response) {
      const result = error.request.response;
      return JSON.parse(result);
    }

    return {
      ok: false,
      message: error.toString()
    };
  }
};

export const login = async (user: LoginUserType): Promise<ApiResponse> => {
  try {
    const result = await axios.post('/login', user);
    return result.data;
  } catch (error: any) {
    if (error.request?.response) {
      const result = error.request.response;
      return JSON.parse(result);
    }

    return {
      ok: false,
      message: error.toString()
    };
  }
};

export const listNotes = async (userid: string): Promise<ApiResponse> => {
  try {
    const result = await axios.get(`/${userid}/notes`);
    return result.data;
  } catch (error: any) {
    if (error.request?.response) {
      const result = error.request.response;
      return JSON.parse(result);
    }

    return {
      ok: false,
      message: error.toString()
    };
  }
};

export const createNote = async (userid: string, note: NoteType): Promise<ApiResponse> => {
  try {
    const result = await axios.post(`/${userid}/notes`, note);
    return result.data;
  } catch (error: any) {
    if (error.request?.response) {
      const result = error.request.response;
      return JSON.parse(result);
    }

    return {
      ok: false,
      message: error.toString()
    };
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { LoginUserType, NoteEditType, NoteType, RegisterUserType } from '../types';
import NoteDeleteType from '../types/NoteDeleteType';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export interface ApiResponse {
  ok: boolean;
  data?: any;
  message: string;
  notes?: [];
}

export interface ApiResponseListNotes {
  ok: boolean;
  data?: any;
  message: string;
  notes: [];
}

export interface ApiResponseActionNote {
  ok: boolean;
  data?: any;
  message: string;
  note: any;
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

export const listNotes = async (userid: string): Promise<ApiResponseListNotes> => {
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
      notes: [],
      message: error.toString()
    };
  }
};

export const createNote = async (note: NoteType): Promise<ApiResponseListNotes> => {
  try {
    const result = await axios.post(`/${note.userid}/notes`, note);
    return result.data;
  } catch (error: any) {
    if (error.request?.response) {
      const result = error.request.response;
      return JSON.parse(result);
    }

    return {
      ok: false,
      notes: [],
      message: error.toString()
    };
  }
};

export const editNote = async (note: NoteEditType): Promise<ApiResponseActionNote> => {
  try {
    const result = await axios.put(`/${note.userid}/notes/${note.id}`, note);
    return result.data;
  } catch (error: any) {
    if (error.request?.response) {
      const result = error.request.response;
      return JSON.parse(result);
    }

    return {
      ok: false,
      note: {},
      message: error.toString()
    };
  }
};

export const deleteNote = async (note: NoteDeleteType): Promise<ApiResponseActionNote> => {
  try {
    const result = await axios.delete(`/${note.userid}/notes/${note.id}`);
    return result.data;
  } catch (error: any) {
    if (error.request?.response) {
      const result = error.request.response;
      return JSON.parse(result);
    }

    return {
      ok: false,
      note: {},
      message: error.toString()
    };
  }
};

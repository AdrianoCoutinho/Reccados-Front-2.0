/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { LoginUserType, NoteDeleteType, NoteEditType, NoteType, RegisterUserType } from '../types';

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
    const newUser = {
      name: user.name,
      email: user.email,
      password: user.password,
      repassword: user.repassword
    };
    const result = await axios.post('/', newUser);
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

export const listUser = async (user: string): Promise<any> => {
  try {
    const result = await axios.get(`/${user}`);
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

export const listNotes = async (params: any): Promise<ApiResponseListNotes> => {
  try {
    let result = await axios.get(`/${params.userid}/notes`);
    if (params.note) {
      result = await axios.get(`/${params.userid}/notes?detail=${params.note.detail}&arquived=${params.note.arquived}`);
    }
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
    const result = await axios.put(`/notes/${note.id}`, note);
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
    const result = await axios.delete(`/notes/${note.id}`);
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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import companyService from './companyService';

const initialState = {
  company: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create async thunk to get a company by slug
export const getCompanyBySlug = createAsyncThunk(
  'companies/getBySlug',
  async (slug, thunkAPI) => {
    try {
      return await companyService.getCompanyBySlug(slug);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyBySlug.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompanyBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.company = action.payload; // The company data from the API
      })
      .addCase(getCompanyBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.company = null;
      });
  },
});

export const { reset } = companySlice.actions;
export default companySlice.reducer;
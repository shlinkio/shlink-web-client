import type { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { createAsyncThunk as baseCreateAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '.';

export const createAsyncThunk = <Returned, ThunkArg>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, { state: RootState; serializedErrorType: any }>,
) => baseCreateAsyncThunk(typePrefix, payloadCreator, { serializeError: (e) => e });

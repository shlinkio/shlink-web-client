import type { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { createAsyncThunk as baseCreateAsyncThunk } from '@reduxjs/toolkit';
import { identity } from 'ramda';
import type { RootState } from '../container/store';

export const createAsyncThunk = <Returned, ThunkArg>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, { state: RootState, serializedErrorType: any }>,
) => baseCreateAsyncThunk(
    typePrefix,
    payloadCreator,
    { serializeError: identity },
  );

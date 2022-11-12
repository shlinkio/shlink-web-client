import { createAsyncThunk as baseCreateAsyncThunk, AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { ShlinkState } from '../../container/types';

export const createAsyncThunk = <Returned, ThunkArg>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, { state: ShlinkState }>,
) => baseCreateAsyncThunk(typePrefix, payloadCreator);

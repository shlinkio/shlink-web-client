import type { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { createAsyncThunk as baseCreateAsyncThunk } from '@reduxjs/toolkit';
import { identity } from 'ramda';
import type { ShlinkState } from '../../container/types';

export const createAsyncThunk = <Returned, ThunkArg>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, { state: ShlinkState, serializedErrorType: any }>,
) => baseCreateAsyncThunk(
    typePrefix,
    payloadCreator,
    { serializeError: identity },
  );

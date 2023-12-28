import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface Range {
  _id: string;
  startRange: number;
  endRange: number;
  color: string;
  date: Date;
}

interface RangeState {
  rangeList: Range[];
}

const initialState: RangeState = {
  rangeList: [],
};

const rangeSlice = createSlice({
  name: 'range',
  initialState,
  reducers: {
    addRange: (state, action: PayloadAction<Range>) => {
      state.rangeList.push(action.payload);
    },
    setRangeList: (state, action: PayloadAction<Range[]>) => {
      state.rangeList = action.payload;
    },
  },
});

export const { addRange, setRangeList } = rangeSlice.actions;
export const selectRangeList = (state: RootState) => state.range.rangeList;
export const rangeReducer = rangeSlice.reducer;

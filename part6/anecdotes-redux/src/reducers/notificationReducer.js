import { createSlice } from "@reduxjs/toolkit";

let timeout;

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return "";
    },
  },
});

export const notify = (message, time) => {
  return (dispatch) => {
    dispatch(setNotification(message));
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => dispatch(clearNotification()), time * 1000);
  };
};

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

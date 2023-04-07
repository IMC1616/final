import { isRejectedWithValue } from "@reduxjs/toolkit";

const rtkQueryErrorLogger = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.error(action.error);
  }
  return next(action);
}

export default rtkQueryErrorLogger;

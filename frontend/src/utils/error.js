export const getErrorMessage = (error) => {
  if (!error) {
    return "Something went wrong";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};


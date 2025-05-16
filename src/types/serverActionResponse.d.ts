type ServerActionResponse<T> = {
  data: T | null;
  error: string | null;
  validationErrors?: {
    [x: string]: string[] | undefined;
  };
};

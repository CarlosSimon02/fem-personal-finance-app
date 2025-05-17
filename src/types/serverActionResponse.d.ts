type ServerActionResponse<T> = {
  data: T | null;
  error?: string | null;
  validationErrors?: Record<string, string | undefined>;
};

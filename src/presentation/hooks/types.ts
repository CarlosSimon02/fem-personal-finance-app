export type StatusCallbacksType<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

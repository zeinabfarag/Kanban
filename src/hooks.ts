import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import store, { RootState } from "./redux/store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => {
  return useDispatch<AppDispatch>();
};

import { createContext, Dispatch, SetStateAction } from "react";

type authContextType = {
  currentUsername: string;
  setCurrentUsername: Dispatch<SetStateAction<string>>;
};

export const authContext = createContext<authContextType>({
  currentUsername: "",
  setCurrentUsername: () => {},
});

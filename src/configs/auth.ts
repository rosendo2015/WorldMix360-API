import { env } from "../../env";

export interface AuthConfigProps {
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "1d",
  },
};

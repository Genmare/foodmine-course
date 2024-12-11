import { HTTP_UNAUTHORIZED } from "../constants/http_status";
import authMid from "./auth.mid";

const adminMid = (req: any, res: any, next: any) => {
  console.log("req.user", req.user);

  if (!req.user.isAdmin) res.status(HTTP_UNAUTHORIZED).send();

  return next();
};

export default [authMid, adminMid];


import { BaseEndPoint } from "@/app/lib/api/baseEndpoint";
import { Server } from "@/app/lib/api/server";
import { DbRef } from "@/app/lib/types/dbref";

export const { DELETE, GET, POST, PUT } = BaseEndPoint.init(
  new Server().getDb<DbRef>("db")
)
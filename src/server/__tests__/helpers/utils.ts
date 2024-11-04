import ExpressApp from "@/server/app";
import { makeFetch } from "supertest-fetch";

const superFetch = makeFetch(ExpressApp);

export { superFetch };

import ExpressApp from "../../app";
import { makeFetch } from "supertest-fetch";

const superFetch = makeFetch(ExpressApp);

export { superFetch };

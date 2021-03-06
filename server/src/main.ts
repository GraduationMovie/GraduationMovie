import * as express from "express";
import * as router from "./router/routes";
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as RecApi from "./api/recommender";

declare global {
  namespace NodeJS {
    interface Global {
      recommendations: JSON;
      similarUsers: JSON;
      dissimilarMovies: JSON;
    }
  }
}

RecApi.initAllJSON();

dotenv.config();

const app = express();
app.use(cors());
app.use(router);

const port: number = 5000;
app.listen(port, () => {
  console.log(`${port} 포트 서버 대기 중!`);
});

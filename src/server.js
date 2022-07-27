
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";
import flash from "express-flash";


const app = express();
const logger = morgan("dev");
          

app.use(flash()); 
app.set("view engine",  "pug");
app.set("views", process.cwd() + "/src/views");
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
    });
app.use(logger);
app.use(express.urlencoded({extended: true}));
//- form으로부터 오는 data를 server가이해할수 있도록함
app.use(express.text());
//- server가 웹사이트 req로 들어오는 text를 이해하도록 함
app.use(express.json());
//- stringfy로 변환된걸 json(ex.js obj)으로 다시 변환 
//-  *commentSection.js/handleSubmit
app.use(session({
    secret: process.env.COOKIE_SECRET, 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl:process.env.DB_URL})

  
})
);
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);
  
export default app;
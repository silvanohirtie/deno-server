import { green,cyan,bold,yellow,red,} from "https://deno.land/std@0.51.0/fmt/colors.ts";
import { Application, Context, Router, HttpError, send, Status} from "https://deno.land/x/oak/mod.ts";

const app = new Application();


// Static Content
app.use(async (context) => {
  await send(context, context.request.url.pathname, {
    root: `${Deno.cwd()}/public/`,
    index: "views/index.html",
  });

});

// Logger
app.use(async (context, next) => {
  await next();
  const rt = context.response.headers.get("X-Response-Time");
  console.log(
    `${green(context.request.method)} ${cyan(context.request.url.pathname)} - ${
      bold(
        String(rt),
      )
    }`,
  );
});

// Response Time
app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set("X-Response-Time", `${ms}ms`);
});


const options = { hostname: "localhost", port: 3000 };
console.log(
  bold("Start listening on ") + yellow(`${options.hostname}:${options.port}`),
);
await app.listen(options);
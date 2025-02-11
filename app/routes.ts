import { index, prefix, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  ...prefix(process.env.BASE_PATH || "/arbeid/dagpenger/mine-dagpenger-frontend/", [
    index("./routes/index.tsx"),
    route(
      "api/hent-dokument/:journalpostId/:dokumentInfoId",
      "routes/api.hent-dokument.$journalpostId.$dokumentInfoId.tsx"
    ),
    route("isalive", "routes/api.internal.isalive.ts"),
    route("isready", "routes/api.internal.isready.ts"),
  ]),
] satisfies RouteConfig;

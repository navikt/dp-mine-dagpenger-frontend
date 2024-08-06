import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    "graphql/generated/saf/": {
      preset: "client",
      schema: "graphql/saf.graphql",
      documents: ["app/models/saf.server.ts"],
      plugins: [],
    },
  },
};

export default config;

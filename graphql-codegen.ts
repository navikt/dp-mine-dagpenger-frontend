import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    "graphql/generated/saf/": {
      preset: "client",
      schema: "schema.graphql",
      documents: ["app/utils/safJournalposter.utils.ts"],
      plugins: [],
    },
  },
};

export default config;

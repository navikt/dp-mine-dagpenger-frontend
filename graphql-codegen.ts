import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    "graphql/generated/saf/": {
      preset: "client",
      schema: "graphql/safselvbetjening-schema.graphql",
      documents: ["app/utils/safselvbetjening.utils.ts"],
      plugins: [],
    },
  },
};

export default config;

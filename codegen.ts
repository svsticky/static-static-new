import type { CodegenConfig } from "@graphql-codegen/cli";

import "dotenv/config";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env["GRAPHQL_URL"],
  // This assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: ["src/queries.gql"],
  // Don't exit with non-zero status when there are no documents
  ignoreNoDocuments: true,
  generates: {
    "./src/graphql/rawSdk.ts": {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      config: {
        avoidOptionals: true,
        defaultScalarType: "unknown",
        skipTypename: true,
        useTypeImports: true
      }
    },
    "schema.gql": {
      plugins: ["schema-ast"]
    }
  },
};

export default config;
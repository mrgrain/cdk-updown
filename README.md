# ![CDK up / down](./images/wordmark-dynamic.svg)

Self-executable CDK apps.

![Demo](./images/demo.gif)

## Usage

Create an executable TypeScript file for your CDK app `./bin/my-app.ts` using the `updown()` function.

```typescript
import { updown } from "@mrgrain/cdk-updown";
import { App, Stack, aws_sns } from "aws-cdk-lib";

const cli = updown(async () => {
  // Build your CDK app here
  const app = new App();
  const stack = new Stack(app);
  new aws_sns.Topic(stack, "Topic");

  return app.synth();
});

// Run the CLI
await cli.run();
```

Then execute as usual:

```console
npx tsx ./bin/my-app.ts
```

## Single-file executable

Using a bundle that can produce single-file executables, it is easily possible to make your CDK app fully runtime independent.
For example [with Bun](https://bun.sh/docs/bundler/executables):

```console
bun build ./bin/my-app.ts --compile --minify --outfile ./dist/my-app
```

Now you have a fully self-contained binary of your app:

```console
./dist/my-app
```

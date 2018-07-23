import * as FS from "fs";
import * as Path from "path";

import CLI from "caporal";
import chalk, { default as Chalk } from "chalk";

import * as Log from "./Log";
import * as Init from "./Init";
import * as Scripts from "./Scripts";
import * as Dependencies from "./Dependencies";
import * as Dev from "./Dev";
import * as Shell from "./Shell";

export = (argv: string[]) => CLI.parse(argv);

const packageJSON = JSON.parse(
  FS.readFileSync(Path.join(__dirname, `../package.json`)).toString()
);

const packages = FS.readdirSync("packages").filter(
  itemName => !itemName.includes(".")
);

CLI.version(packageJSON.version).description("TypeScript Tooling");

CLI.command("init", `Configure ${Log.tool("typescript-tooling")}`)
  .option(
    "--install",
    `Installs ${chalk.italic("peerDependencies")}`,
    CLI.BOOLEAN,
    false
  )
  .option(
    "--scripts",
    `Writes ${chalk.italic("npm scripts")} to ${Log.file("package.json")}`,
    CLI.BOOLEAN,
    false
  )
  .action(Init.action(packageJSON, packages));

CLI.command("scripts", `List convenience ${Chalk.italic("npm scripts")}`)
  .help(
    `List convenience ${Chalk.italic(
      "npm scripts"
    )} which can be added to your ${Log.file("package.json")}`
  )
  .action((_args, _options, logger) => {
    logger.info("");
    Scripts.print(logger, packages);
  });

CLI.command(
  "dependencies",
  `Prints ${Log.code(`npm install --save-dev [...peerDependencies]`)}`
)
  .help(
    `List convenience ${Chalk.italic(
      "npm scripts"
    )} which can be added to your ${Log.file("package.json")}`
  )
  .action((_args, _options, logger) => {
    logger.info("");
    Dependencies.print(logger, packageJSON);
  });

CLI.command("test", `Test a package with ${Log.tool("Jest")}`)
  .help(
    `Run package tests with ${Log.tool("Jest")}. If ${Chalk.yellow(
      "[package-name]"
    )} isn't specified, all tests will run.`
  )
  .argument("[package-name]", Log.packages(packages), packages)
  .option("-w --watch", "Re-run tests on file changes", CLI.BOOLEAN, false)
  .action((_args, _options, logger) => Shell.exec(logger, `echo "TODO!"`));

CLI.command("dev", `Run a package with ${Log.tool("nodemon")}`)
  .help(`Run a package with ${Log.tool("nodemon")}.`)
  .argument("<package-name>", Log.packages(packages), packages)
  .action(Dev.action);

CLI.command("build", `Build a package with ${Log.tool("TypeScript")}`)
  .help(
    `Compile a package with ${Log.tool("TypeScript")}. If ${Chalk.yellow(
      "[package-name]"
    )} isn't specified, all packages will build.`
  )
  .argument("[package-name]", Log.packages(packages), packages)
  .option("-w --watch", "Re-run tests on file changes", CLI.BOOLEAN, false)
  .action((_args, _options, logger) => Shell.exec(logger, `echo "TODO!"`));

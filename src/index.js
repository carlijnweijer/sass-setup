#!/usr/bin/env node
import * as cp from "child_process";
import inquirer from "inquirer";
import path from "path";
import fs, { mkdir } from "fs";
import chalk from "chalk";

const CURR_DIR = process.cwd();
const templatePath = path.join(CURR_DIR, "node_modules/sass-setup/src/sass");

inquirer
  .prompt([
    {
      type: "list",
      name: "framework",
      message: "Which framework do you want to use?",
      choices: ["react", "nextjs"],
    },
    {
      type: "confirm",
      name: "create",
      message:
        "This package will also install/update the latest version of sass. Continue?",
    },
  ])
  .then((answers) => {
    if (answers.create) {
      cp.execSync("npm i sass");

      console.log(chalk.magenta.bold("💄 Installed sass 💄"));
    }

    const framework = answers.framework;
    const targetPath =
      framework === "react"
        ? path.join(CURR_DIR, "src/styles")
        : path.join(CURR_DIR, "styles");

    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath);
    }

    createDirectoryContents(templatePath, targetPath);
    console.log(chalk.green.bold("✨ Successfully created scss files ✨"));
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment");
    } else {
      console.log("Something went wrong", error);
    }
  });

function createDirectoryContents(templatePath, newPath) {
  fs.readdirSync(templatePath).forEach((file) => {
    const origFilePath = path.join(templatePath, file);
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      let contents = fs.readFileSync(origFilePath, "utf8");
      const writePath = path.join(newPath, file);
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      const newSubFolder = path.join(newPath, file);
      if (!fs.existsSync(newSubFolder)) {
        fs.mkdirSync(newSubFolder);
      }
      if (fs.existsSync(newSubFolder)) {
        createDirectoryContents(
          path.join(templatePath, file),
          path.join(newPath, file)
        );
      } else {
        createDirectoryContents(
          path.join(templatePath, file),
          path.join(newPath, file)
        );
      }
    }
  });
}

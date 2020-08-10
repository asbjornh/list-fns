const fs = require("fs");
const path = require("path");

const codeToJson = require("./code-to-json");

const header = fs.readFileSync(path.join(__dirname, "header.md"), "utf-8");
const outPath = path.resolve(__dirname, "../README.md");

codeToJson(path.resolve(__dirname, "../")).then(
  ({ declarations, symbols, types }) => {
    const functions = Object.values(symbols)
      .filter(filterSymbol)
      .map(symbol => [
        symbol.name,
        symbol.otherDeclarationTypes[0].type[1],
        [...symbol.declarations].pop()[1],
        (symbol.documentation || {}).summary,
      ]);

    const toc = functions
      .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
      .map(([name]) => `<li><a href="#${name}">${name}</a></li>`)
      .join("\n");

    const docs = functions
      .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
      .map(([name, typeId, sourceId, doc]) =>
        [
          renderName(name),
          renderType(types[typeId].text, name),
          renderDoc(doc),
          renderSource(declarations[sourceId].text),
        ].join("\n\n")
      )
      .join("\n\n");

    const fileContent = `${header}
<details>
  <summary>Table of contents</summary>
  <ul>
    ${toc}
  </ul>
</details>

${docs}
`;

    fs.writeFileSync(outPath, fileContent);
  }
);

function filterSymbol(symbol) {
  if (symbol.name === "__function") return false;
  if (symbol.flags.includes("transient")) return false;
  return symbol.flags.includes("variable") || symbol.flags.includes("function");
}

function renderName(name) {
  return `### <div id="${name}"></div> ${name}`;
}

function renderType(type, name) {
  if (type.startsWith("{")) {
    const body = type
      .replace(/^{/, "")
      .replace(/}$/, "")
      .split(";")
      .map(l => l.trim())
      .filter(a => a)
      .join(";\n  ");

    return codeBlock("ts", `${name}: {\n  ${body};\n}`);
  }
  return codeBlock("ts", `${name}: ${type}`);
}

function renderSource(code) {
  const output =
    code.startsWith("export") || code.startsWith("function")
      ? code
      : `const ${code}`;
  return `<details>
  <summary>Implementation</summary>
  <p>
    ${codeBlock("ts", output)}
  <p>
</details>`;
}

function codeBlock(language, code) {
  return "\n```" + `${language}\n${code}\n` + "```\n";
}

function renderDoc(fragments = []) {
  return fragments
    .map(fragment => {
      if (typeof fragment === "string") return fragment;

      const { code, kind, language } = fragment;

      if (kind === "inlineCode") return " `" + code + "` ";
      if (kind === "fencedCode") return codeBlock(language, code);
      throw new Error(
        `Missing parser for comment fragment of type '${fragment.kind}'`
      );
    })
    .join("");
}

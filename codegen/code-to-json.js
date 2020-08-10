const core = require("@code-to-json/core");
const formatter = require("@code-to-json/formatter");
const nodeUtils = require("@code-to-json/utils-node");
const tsUtils = require("@code-to-json/utils-ts");

// NOTE: `code-to-json` does not expose a proper Node.js API. This function replicates what `@code-to-json/cli` does (with hard coded options)
module.exports = async projectPath => {
  const program = await tsUtils.createProgramFromTsConfig(
    projectPath,
    nodeUtils.NODE_HOST
  );
  const pathNormalizer = await nodeUtils.createReverseResolverForProject(
    projectPath,
    nodeUtils.NODE_HOST
  );
  const result = core.walkProgram(program, nodeUtils.NODE_HOST, {
    pathNormalizer,
  });

  const formatted = formatter.formatWalkerOutput(result);

  return formatted.data;
};

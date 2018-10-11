import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: "tsx-no-render-non-intel-context",
    description: "Forbidden the usage of non-internationalization context in typescript-react component",
    optionsDescription: "Not configurable.",
    options: null,
    optionExamples: ["true"],
    type: "functionality",
    typescriptOnly: true
  };

  public static FAILURE_STRING = "React component should not be included non-internationalization context";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoRenderNonIntelContextRuleWalker(sourceFile, this.getOptions()));
  }
}

class NoRenderNonIntelContextRuleWalker extends Lint.RuleWalker {
  public visitJsxElement(node: ts.JsxElement) {
    this.checkAttributeIncludeNonInterlContext(node.openingElement.attributes);
    if (node.children) {
      node.children.forEach((children) => { // 子结点为文本结点或为一变量
        if (children.kind === ts.SyntaxKind.JsxText && !children.containsOnlyWhiteSpaces) {
          this.addFailureAtNode(
            children,
            Rule.FAILURE_STRING
          );
        } else if (children.kind === ts.SyntaxKind.JsxExpression && children.expression && children.expression.kind === ts.SyntaxKind.Identifier) { // 子结点为一变量，而不是表达式
          this.addFailureAtNode(
            children,
            Rule.FAILURE_STRING
          );
        }
      });
    }
    super.visitJsxElement(node);
  }

  public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
    this.checkAttributeIncludeNonInterlContext(node.attributes);
    super.visitJsxSelfClosingElement(node);
  }

  private checkAttributeIncludeNonInterlContext(attributes: ts.JsxAttributes) {
    attributes.properties.forEach((property) => {
      if (property.name && property.name.getText().toLowerCase() === "placeholder") { // placeholder 属性为一变量或常量
        if (property.name.kind === ts.SyntaxKind.Identifier) {
          this.addFailureAtNode(
            property,
            Rule.FAILURE_STRING
          );
        }
      }
    });
  }
}

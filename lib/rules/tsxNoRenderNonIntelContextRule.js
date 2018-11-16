"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const Lint = require("tslint");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new NoRenderNonIntelContextRuleWalker(sourceFile, this.getOptions()));
    }
}
Rule.metadata = {
    ruleName: "tsx-no-render-non-intel-context",
    description: "Forbidden the usage of non-internationalization context in typescript-react component",
    optionsDescription: "Not configurable.",
    options: null,
    optionExamples: ["true"],
    type: "functionality",
    typescriptOnly: true
};
Rule.FAILURE_STRING = "React component should not be included non-internationalization context";
exports.Rule = Rule;
class NoRenderNonIntelContextRuleWalker extends Lint.RuleWalker {
    visitJsxElement(node) {
        this.checkAttributeIncludeNonInterlContext(node.openingElement.attributes);
        if (node.children) {
            node.children.forEach((children) => {
                if (children.kind === ts.SyntaxKind.JsxText && !children.containsOnlyWhiteSpaces) {
                    this.addFailureAtNode(children, Rule.FAILURE_STRING);
                }
                else if (children.kind === ts.SyntaxKind.JsxExpression && children.expression && children.expression.kind === ts.SyntaxKind.Identifier) {
                    this.addFailureAtNode(children, Rule.FAILURE_STRING);
                }
            });
        }
        super.visitJsxElement(node);
    }
    visitJsxSelfClosingElement(node) {
        this.checkAttributeIncludeNonInterlContext(node.attributes);
        super.visitJsxSelfClosingElement(node);
    }
    checkAttributeIncludeNonInterlContext(attributes) {
        attributes.properties.forEach(property => {
            if (property.name && property.name.getText().toLowerCase() === "placeholder") {
                if (property.initializer.kind === ts.SyntaxKind.StringLiteral) {
                    this.addFailureAtNode(property, Rule.FAILURE_STRING);
                }
            }
        });
    }
}

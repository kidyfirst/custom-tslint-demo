import * as Lint from "tslint";
import * as assert from "assert";
import Linter from "../../linter";

const cases = [
  {
    source: `export default class YourComponentName extends React.Component<{}, {}> {
                    render() {
                        const test = 'test';
                        return (
                            <div>
                                {test}
                            </div>
                        );
                    }
                }`,
    success: false
  },
  {
    source: `export default class YourComponentName extends React.Component<{}, {}> {
                    render() {
                        return (
                            <div>
                                test
                            </div>
                        );
                    }
                }`,
    success: false
  },
  {
    source: `export default class YourComponentName extends React.Component<{}, {}> {
                    render() {
                        return (
                            <div>
                                <input placeholder = "test" />
                            </div>
                        );
                    }
                }`,
    success: false
  },

  {
    source: `export default class YourComponentName extends React.Component<{}, {}> {
                    render() {
                        return (
                            <div>
                                <input placeholder = {formatMessage(messages.password)} />
                            </div>
                        );
                    }
                }`,
    success: true
  },
  {
    source: `export default class YourComponentName extends React.Component<{}, {}> {
                    render() {
                        return (
                            <div>
                            </div>
                        );
                    }
                }`,
    success: true
  },
  {
    source: `export default class YourComponentName extends React.Component<{}, {}> {
                    render() {
                        return (
                            <div>
                                {formatMessage(messages.password)}
                            </div>
                        );
                    }
                }`,
    success: true
  }
];

describe("tsx-no-render-non-intel-context", () => {
  cases.forEach(({ source, success }, index) => {
    it(`Render of React component should not be included non-internationalization context  [Case ${index + 1}]`, () => {
      const linter = new Linter();
      linter.addRule("tsx-no-render-non-intel-context");
      const result = linter.lint(source);
      assert.equal(result.errorCount === 0, success);
    });
  });
});

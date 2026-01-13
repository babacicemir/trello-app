module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "standard"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "comma-dangle": [
            "warn",
            "only-multiline"
        ],
        "eqeqeq": "warn",
        "func-call-spacing": "off",
        "no-multiple-empty-lines": "off",
        "no-trailing-spaces": [
            "error",
            {
                "skipBlankLines": true
            }
        ],
        "prefer-promise-reject-errors": "off",
        "indent": [
            "error",
            2
        ],
        "quotes": [
            2,
            "double",
            {
                "avoidEscape": true
            }
        ],
        "no-use-before-define": "off",
        "no-useless-escape": "error"
    }
}

module.exports = {
    extends: [require.resolve('@umijs/fabric/dist/eslint')],
    rules: {
        '@typescript-eslint/dot-notation': 'off',
        'react-hooks/exhaustive-deps': 'off',
    },
};

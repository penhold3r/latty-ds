/**
 * Converts camel, pascal, snake, or kebab case strings to Title Case.
 *
 * @param {String} str - String to convert
 * @returns {String}
 */
export const toTitleCase = (str) => {
    if (!str)
        return '';
    return (str
        // Handles camelCase/PascalCase
        .replace(/([A-Z])/g, ' $1')
        // Replaces hyphens and underscores with spaces (kebab-case/camelCase)
        .replace(/[-_]+/g, ' ')
        // Trims leading/trailing whitespace
        .trim()
        // Capitalizes the first letter of each word and lowercase the rest
        .replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    }));
};

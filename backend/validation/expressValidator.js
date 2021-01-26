const { body } = require('express-validator');

const signupValidator = () => [
    body('email', "Email is not valid!").isEmail().notEmpty()
        .custom((value, { req }) => {
            if (value === 'test@test.com' || value === 'test@test.test') {
                throw new Error('This email address is forbidden! try another valid email address!');
            }
            return true;
        }).isLowercase().trim().normalizeEmail({ all_lowercase: true, gmail_remove_dots: false }),
    body('password', 'Password is not valid! it should be between 5 and 10 character!')
        .isLength({ min: 5, max: 10 })
        .isAlphanumeric().withMessage('Password in not valid! it should contain alphabet and number!'),
    body('confirmPassword', 'Password is not match!').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password is not match!');
        }
        return true;
    }),
]

const loginValidator = () => [
    body('email', 'Email is not valid!')
        .isEmail()
        .isLowercase().trim()
]

const recipeValidator = () => [
    body('name').isLength({ min: 3, max: 300 }).withMessage('Recipe name lenght should be between 3 and 300 character.')
        .notEmpty({ ignore_whitespace: true }).withMessage('Recipe name is required!').trim(),
    body('description').notEmpty({ ignore_whitespace: true }).withMessage("Recipe decription is required!").trim()
]

module.exports = { signupValidator, loginValidator, recipeValidator }
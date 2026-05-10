/**
 * @openapi
 *
 * Create a new user
 *
 * Creates a user and returns the created entity.
 *
 * @tag Users
 * @tag Admin
 *
 * @operationId createUser
 * @route GET /users
 *
 * @param {string} organizationId.path required - Organization ID
 * @param {boolean} sendEmail.query optional - Send welcome email
 *
 * @body {CreateUserInput} required - User payload
 *
 * @response 201 {User} application/json - User created
 * @response 400 {ValidationError} application/json - Invalid payload
 * @response 409 {ConflictError} application/json - Email already exists
 *
 * @security bearerAuth
 */
export const idk = () => {}

/**
 * @openapi
 *
 * Get a user by ID
 *
 * @route GET /users/:userId
 *
 * @param {string} userId.path The ID of the user
 * @param {string} include.query Additional fields to include
 *
 * @response 200 {User} application/json The user object
 * @response 404 {NotFoundError} application/json User not found
 */
export const getUser = (_userId: string, _include?: string) => {}

/**
 * @openapi
 * Create a new user
 *
 * @route POST /users
 * @param {string} role.query The role of the new user
 *
 * @body {CreateUserInput} application/json required - User payload
 *
 * @response 201 {User} application/json The created user object
 * @response 400 {ValidationError} application/json Invalid input
 */
export const createUser = () => {}

/**
 * @openapi
 * Update an item
 *
 * @route PUT /items/{itemId}
 * @param {number} itemId.path The ID of the item
 *
 * @body {UpdateItemInput} application/json required - Item payload
 *
 * @response 200 {Item} application/json Updated item
 */
export const updateItem = () => {}

/**
 * Delete something
 * @description Internal function, not for openapi
 */
export const deleteInternal = () => {}

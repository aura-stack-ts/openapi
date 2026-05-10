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
 * @response 201 {User} - User created
 * @response 400 {ValidationError} - Invalid payload
 * @response 409 {ConflictError} - Email already exists
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
 * @response 200 The user object
 * @response 404 User not found
 */
export const getUser = (_userId: string, _include?: string) => {}

/**
 * Create a new user
 * @openapi
 * @route POST /users
 * @param {string} role.query The role of the new user
 * @response 201 The created user object
 * @response 400 Invalid input
 */
export const createUser = () => {}

/**
 * Update an item
 * @openapi
 * @route PUT /items/{itemId}
 * @param {number} itemId.path The ID of the item
 * @response 200 Updated item
 */
export const updateItem = () => {}

/**
 * Delete something
 * @description Internal function, not for openapi
 */
export const deleteInternal = () => {}

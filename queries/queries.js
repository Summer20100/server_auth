const queries = {

  // FOR USERS TABLE
  getUsers: 'SELECT * FROM users',
  addUser: 'INSERT INTO users (email,password,activationlink) VALUES ($1,$2,$3)',
  checkIsUserById: "SELECT * FROM users WHERE id = $1",
  checkIsUserByEmail: "SELECT * FROM users WHERE email = $1",
  checkIsUserByLink: "SELECT * FROM users WHERE activationlink = $1",
  updateUserActivated: "UPDATE users SET isactivated = $1 WHERE id = $2",

  // FOR TOKENS TABLE
  getTokens: 'SELECT * FROM tokens',
  addToken: 'INSERT INTO tokens (user_id,refreshtoken) VALUES ($1,$2)',
  removeToken: 'DELETE FROM tokens WHERE refreshtoken = $1',
  updateToken: 'UPDATE tokens SET refreshtoken = $1 WHERE user_id = $2 RETURNING *',
  findToken: 'SELECT * FROM tokens WHERE refreshtoken = $1',
  checkIsToken: 'SELECT * FROM tokens WHERE user_id = $1',
}

module.exports = queries;
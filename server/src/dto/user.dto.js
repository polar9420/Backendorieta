export default class UserDto {
  constructor(user) {
    this._id = user._id
    this.email = user.email
    this.role = user.role
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
    this.cartId = user.cartId
    this.first_name = user.first_name
    this.last_name = user.last_name
    this.age = user.age
  }
}

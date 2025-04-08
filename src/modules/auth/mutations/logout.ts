export const logout = () => {
  return localStorage.removeItem("userInfo");
};

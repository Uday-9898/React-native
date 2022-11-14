const ROUTES = {
  PINCODE: 'PinCode',
  LOGIN: 'Login',
  FORGOT: 'ForgotPassword',
  SETPINCODE: 'SetPinCode',
  HOME: 'Home',
  AVAILABILITY: 'Availability',
  RECOVER_CHECK_EMAIL: 'CheckYourEmail',
  CREATE_NEW_PASSWORD: 'CreateNewPassword',
  SELECT_EMPLOYEE_FOR_ADMIN : 'SelectEmployeeForAdmin',
};

const TITLES = {};

TITLES[ROUTES.LOGIN] = '';
TITLES[ROUTES.FORGOT] = '';
TITLES[ROUTES.HOME] = 'Home';
TITLES[ROUTES.AVAILABILITY] = 'Availability';
TITLES[ROUTES.RECOVER_CHECK_EMAIL] = 'Check your email';
TITLES[ROUTES.CREATE_NEW_PASSWORD] = 'Create new password';

module.exports = {
  ...ROUTES,
  TITLES,
};

const defaultState = {
  isAuth: false,
  user: {},
  attemptInterval: 0,
  attemptIntervalTimerId: null,
  phone: null,
};

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const SET_ATTEMPT_INTERVAL = 'SET_ATTEMPT_INTERVAL';
const SET_ATTEMPT_INTERVAL_TIMER_ID = 'SET_ATTEMPT_INTERVAL_TIMER_ID';
const SET_PHONE = 'SET_PHONE';

export const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, isAuth: true, user: action.payload };
    case LOGOUT:
      return { ...state, isAuth: false, user: {} };
    case SET_ATTEMPT_INTERVAL:
      return { ...state, attemptInterval: action.payload };
    case SET_ATTEMPT_INTERVAL_TIMER_ID:
      return { ...state, attemptIntervalTimerId: action.payload };
    case SET_PHONE:
      return { ...state, phone: action.payload };
    default:
      return state;
  }
};

export const loginAction = payload => ({ type: LOGIN, payload });
export const logoutAction = () => ({ type: LOGOUT });
export const setAttemptIntervalAction = payload => ({
  type: SET_ATTEMPT_INTERVAL,
  payload,
});
export const setAttemptIntervalTimerIdAction = payload => ({
  type: SET_ATTEMPT_INTERVAL_TIMER_ID,
  payload,
});
export const setPhoneAction = payload => ({ type: SET_PHONE, payload });

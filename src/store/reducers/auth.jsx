import { getType } from 'typesafe-actions';
import * as actions from '../actions';

export const defaultState = {
  web3: null,
  provider: null,
  curAccount: null,
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    case getType(actions.setWeb3):
      return { ...state, web3: action.payload };
    case getType(actions.setProvider):
      return { ...state, provider: action.payload };
    case getType(actions.setCurAcount):
      return { ...state, curAccount: action.payload };
    case getType(actions.setInit):
      return defaultState;
    default:
      return state;
  }
};

export default states;

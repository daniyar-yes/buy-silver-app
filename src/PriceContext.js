// this file context is a candidate for refactoring
// ideally it should store the whole Order context
// not just price
// and be a compound object that has:
// price, budget, order counter, coin counter, address history

import { createContext } from "react";

export const PriceContext = createContext(null);
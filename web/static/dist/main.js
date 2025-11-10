var SE = { exports: {} }, Zp = {}, EE = { exports: {} }, _t = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rT;
function ak() {
  if (rT) return _t;
  rT = 1;
  var N = Symbol.for("react.element"), w = Symbol.for("react.portal"), x = Symbol.for("react.fragment"), oe = Symbol.for("react.strict_mode"), ie = Symbol.for("react.profiler"), I = Symbol.for("react.provider"), g = Symbol.for("react.context"), he = Symbol.for("react.forward_ref"), ee = Symbol.for("react.suspense"), K = Symbol.for("react.memo"), Ve = Symbol.for("react.lazy"), Q = Symbol.iterator;
  function fe(D) {
    return D === null || typeof D != "object" ? null : (D = Q && D[Q] || D["@@iterator"], typeof D == "function" ? D : null);
  }
  var ae = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, de = Object.assign, te = {};
  function Ce(D, Y, nt) {
    this.props = D, this.context = Y, this.refs = te, this.updater = nt || ae;
  }
  Ce.prototype.isReactComponent = {}, Ce.prototype.setState = function(D, Y) {
    if (typeof D != "object" && typeof D != "function" && D != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, D, Y, "setState");
  }, Ce.prototype.forceUpdate = function(D) {
    this.updater.enqueueForceUpdate(this, D, "forceUpdate");
  };
  function Ie() {
  }
  Ie.prototype = Ce.prototype;
  function pe(D, Y, nt) {
    this.props = D, this.context = Y, this.refs = te, this.updater = nt || ae;
  }
  var Re = pe.prototype = new Ie();
  Re.constructor = pe, de(Re, Ce.prototype), Re.isPureReactComponent = !0;
  var Fe = Array.isArray, Te = Object.prototype.hasOwnProperty, Ye = { current: null }, W = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ke(D, Y, nt) {
    var et, Et = {}, mt = null, pt = null;
    if (Y != null) for (et in Y.ref !== void 0 && (pt = Y.ref), Y.key !== void 0 && (mt = "" + Y.key), Y) Te.call(Y, et) && !W.hasOwnProperty(et) && (Et[et] = Y[et]);
    var yt = arguments.length - 2;
    if (yt === 1) Et.children = nt;
    else if (1 < yt) {
      for (var Ct = Array(yt), Wt = 0; Wt < yt; Wt++) Ct[Wt] = arguments[Wt + 2];
      Et.children = Ct;
    }
    if (D && D.defaultProps) for (et in yt = D.defaultProps, yt) Et[et] === void 0 && (Et[et] = yt[et]);
    return { $$typeof: N, type: D, key: mt, ref: pt, props: Et, _owner: Ye.current };
  }
  function Ke(D, Y) {
    return { $$typeof: N, type: D.type, key: Y, ref: D.ref, props: D.props, _owner: D._owner };
  }
  function We(D) {
    return typeof D == "object" && D !== null && D.$$typeof === N;
  }
  function ft(D) {
    var Y = { "=": "=0", ":": "=2" };
    return "$" + D.replace(/[=:]/g, function(nt) {
      return Y[nt];
    });
  }
  var ht = /\/+/g;
  function Le(D, Y) {
    return typeof D == "object" && D !== null && D.key != null ? ft("" + D.key) : Y.toString(36);
  }
  function Ut(D, Y, nt, et, Et) {
    var mt = typeof D;
    (mt === "undefined" || mt === "boolean") && (D = null);
    var pt = !1;
    if (D === null) pt = !0;
    else switch (mt) {
      case "string":
      case "number":
        pt = !0;
        break;
      case "object":
        switch (D.$$typeof) {
          case N:
          case w:
            pt = !0;
        }
    }
    if (pt) return pt = D, Et = Et(pt), D = et === "" ? "." + Le(pt, 0) : et, Fe(Et) ? (nt = "", D != null && (nt = D.replace(ht, "$&/") + "/"), Ut(Et, Y, nt, "", function(Wt) {
      return Wt;
    })) : Et != null && (We(Et) && (Et = Ke(Et, nt + (!Et.key || pt && pt.key === Et.key ? "" : ("" + Et.key).replace(ht, "$&/") + "/") + D)), Y.push(Et)), 1;
    if (pt = 0, et = et === "" ? "." : et + ":", Fe(D)) for (var yt = 0; yt < D.length; yt++) {
      mt = D[yt];
      var Ct = et + Le(mt, yt);
      pt += Ut(mt, Y, nt, Ct, Et);
    }
    else if (Ct = fe(D), typeof Ct == "function") for (D = Ct.call(D), yt = 0; !(mt = D.next()).done; ) mt = mt.value, Ct = et + Le(mt, yt++), pt += Ut(mt, Y, nt, Ct, Et);
    else if (mt === "object") throw Y = String(D), Error("Objects are not valid as a React child (found: " + (Y === "[object Object]" ? "object with keys {" + Object.keys(D).join(", ") + "}" : Y) + "). If you meant to render a collection of children, use an array instead.");
    return pt;
  }
  function kt(D, Y, nt) {
    if (D == null) return D;
    var et = [], Et = 0;
    return Ut(D, et, "", "", function(mt) {
      return Y.call(nt, mt, Et++);
    }), et;
  }
  function Mt(D) {
    if (D._status === -1) {
      var Y = D._result;
      Y = Y(), Y.then(function(nt) {
        (D._status === 0 || D._status === -1) && (D._status = 1, D._result = nt);
      }, function(nt) {
        (D._status === 0 || D._status === -1) && (D._status = 2, D._result = nt);
      }), D._status === -1 && (D._status = 0, D._result = Y);
    }
    if (D._status === 1) return D._result.default;
    throw D._result;
  }
  var Ue = { current: null }, se = { transition: null }, ce = { ReactCurrentDispatcher: Ue, ReactCurrentBatchConfig: se, ReactCurrentOwner: Ye };
  function le() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return _t.Children = { map: kt, forEach: function(D, Y, nt) {
    kt(D, function() {
      Y.apply(this, arguments);
    }, nt);
  }, count: function(D) {
    var Y = 0;
    return kt(D, function() {
      Y++;
    }), Y;
  }, toArray: function(D) {
    return kt(D, function(Y) {
      return Y;
    }) || [];
  }, only: function(D) {
    if (!We(D)) throw Error("React.Children.only expected to receive a single React element child.");
    return D;
  } }, _t.Component = Ce, _t.Fragment = x, _t.Profiler = ie, _t.PureComponent = pe, _t.StrictMode = oe, _t.Suspense = ee, _t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ce, _t.act = le, _t.cloneElement = function(D, Y, nt) {
    if (D == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + D + ".");
    var et = de({}, D.props), Et = D.key, mt = D.ref, pt = D._owner;
    if (Y != null) {
      if (Y.ref !== void 0 && (mt = Y.ref, pt = Ye.current), Y.key !== void 0 && (Et = "" + Y.key), D.type && D.type.defaultProps) var yt = D.type.defaultProps;
      for (Ct in Y) Te.call(Y, Ct) && !W.hasOwnProperty(Ct) && (et[Ct] = Y[Ct] === void 0 && yt !== void 0 ? yt[Ct] : Y[Ct]);
    }
    var Ct = arguments.length - 2;
    if (Ct === 1) et.children = nt;
    else if (1 < Ct) {
      yt = Array(Ct);
      for (var Wt = 0; Wt < Ct; Wt++) yt[Wt] = arguments[Wt + 2];
      et.children = yt;
    }
    return { $$typeof: N, type: D.type, key: Et, ref: mt, props: et, _owner: pt };
  }, _t.createContext = function(D) {
    return D = { $$typeof: g, _currentValue: D, _currentValue2: D, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, D.Provider = { $$typeof: I, _context: D }, D.Consumer = D;
  }, _t.createElement = ke, _t.createFactory = function(D) {
    var Y = ke.bind(null, D);
    return Y.type = D, Y;
  }, _t.createRef = function() {
    return { current: null };
  }, _t.forwardRef = function(D) {
    return { $$typeof: he, render: D };
  }, _t.isValidElement = We, _t.lazy = function(D) {
    return { $$typeof: Ve, _payload: { _status: -1, _result: D }, _init: Mt };
  }, _t.memo = function(D, Y) {
    return { $$typeof: K, type: D, compare: Y === void 0 ? null : Y };
  }, _t.startTransition = function(D) {
    var Y = se.transition;
    se.transition = {};
    try {
      D();
    } finally {
      se.transition = Y;
    }
  }, _t.unstable_act = le, _t.useCallback = function(D, Y) {
    return Ue.current.useCallback(D, Y);
  }, _t.useContext = function(D) {
    return Ue.current.useContext(D);
  }, _t.useDebugValue = function() {
  }, _t.useDeferredValue = function(D) {
    return Ue.current.useDeferredValue(D);
  }, _t.useEffect = function(D, Y) {
    return Ue.current.useEffect(D, Y);
  }, _t.useId = function() {
    return Ue.current.useId();
  }, _t.useImperativeHandle = function(D, Y, nt) {
    return Ue.current.useImperativeHandle(D, Y, nt);
  }, _t.useInsertionEffect = function(D, Y) {
    return Ue.current.useInsertionEffect(D, Y);
  }, _t.useLayoutEffect = function(D, Y) {
    return Ue.current.useLayoutEffect(D, Y);
  }, _t.useMemo = function(D, Y) {
    return Ue.current.useMemo(D, Y);
  }, _t.useReducer = function(D, Y, nt) {
    return Ue.current.useReducer(D, Y, nt);
  }, _t.useRef = function(D) {
    return Ue.current.useRef(D);
  }, _t.useState = function(D) {
    return Ue.current.useState(D);
  }, _t.useSyncExternalStore = function(D, Y, nt) {
    return Ue.current.useSyncExternalStore(D, Y, nt);
  }, _t.useTransition = function() {
    return Ue.current.useTransition();
  }, _t.version = "18.3.1", _t;
}
var nv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
nv.exports;
var aT;
function ik() {
  return aT || (aT = 1, function(N, w) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var x = "18.3.1", oe = Symbol.for("react.element"), ie = Symbol.for("react.portal"), I = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), he = Symbol.for("react.profiler"), ee = Symbol.for("react.provider"), K = Symbol.for("react.context"), Ve = Symbol.for("react.forward_ref"), Q = Symbol.for("react.suspense"), fe = Symbol.for("react.suspense_list"), ae = Symbol.for("react.memo"), de = Symbol.for("react.lazy"), te = Symbol.for("react.offscreen"), Ce = Symbol.iterator, Ie = "@@iterator";
      function pe(h) {
        if (h === null || typeof h != "object")
          return null;
        var C = Ce && h[Ce] || h[Ie];
        return typeof C == "function" ? C : null;
      }
      var Re = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Fe = {
        transition: null
      }, Te = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, Ye = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, W = {}, ke = null;
      function Ke(h) {
        ke = h;
      }
      W.setExtraStackFrame = function(h) {
        ke = h;
      }, W.getCurrentStack = null, W.getStackAddendum = function() {
        var h = "";
        ke && (h += ke);
        var C = W.getCurrentStack;
        return C && (h += C() || ""), h;
      };
      var We = !1, ft = !1, ht = !1, Le = !1, Ut = !1, kt = {
        ReactCurrentDispatcher: Re,
        ReactCurrentBatchConfig: Fe,
        ReactCurrentOwner: Ye
      };
      kt.ReactDebugCurrentFrame = W, kt.ReactCurrentActQueue = Te;
      function Mt(h) {
        {
          for (var C = arguments.length, j = new Array(C > 1 ? C - 1 : 0), P = 1; P < C; P++)
            j[P - 1] = arguments[P];
          se("warn", h, j);
        }
      }
      function Ue(h) {
        {
          for (var C = arguments.length, j = new Array(C > 1 ? C - 1 : 0), P = 1; P < C; P++)
            j[P - 1] = arguments[P];
          se("error", h, j);
        }
      }
      function se(h, C, j) {
        {
          var P = kt.ReactDebugCurrentFrame, ue = P.getStackAddendum();
          ue !== "" && (C += "%s", j = j.concat([ue]));
          var Ge = j.map(function(ye) {
            return String(ye);
          });
          Ge.unshift("Warning: " + C), Function.prototype.apply.call(console[h], console, Ge);
        }
      }
      var ce = {};
      function le(h, C) {
        {
          var j = h.constructor, P = j && (j.displayName || j.name) || "ReactClass", ue = P + "." + C;
          if (ce[ue])
            return;
          Ue("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", C, P), ce[ue] = !0;
        }
      }
      var D = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(h) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(h, C, j) {
          le(h, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(h, C, j, P) {
          le(h, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(h, C, j, P) {
          le(h, "setState");
        }
      }, Y = Object.assign, nt = {};
      Object.freeze(nt);
      function et(h, C, j) {
        this.props = h, this.context = C, this.refs = nt, this.updater = j || D;
      }
      et.prototype.isReactComponent = {}, et.prototype.setState = function(h, C) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, C, "setState");
      }, et.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var Et = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, mt = function(h, C) {
          Object.defineProperty(et.prototype, h, {
            get: function() {
              Mt("%s(...) is deprecated in plain JavaScript React classes. %s", C[0], C[1]);
            }
          });
        };
        for (var pt in Et)
          Et.hasOwnProperty(pt) && mt(pt, Et[pt]);
      }
      function yt() {
      }
      yt.prototype = et.prototype;
      function Ct(h, C, j) {
        this.props = h, this.context = C, this.refs = nt, this.updater = j || D;
      }
      var Wt = Ct.prototype = new yt();
      Wt.constructor = Ct, Y(Wt, et.prototype), Wt.isPureReactComponent = !0;
      function Nn() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var br = Array.isArray;
      function Rn(h) {
        return br(h);
      }
      function rr(h) {
        {
          var C = typeof Symbol == "function" && Symbol.toStringTag, j = C && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return j;
        }
      }
      function Bn(h) {
        try {
          return In(h), !1;
        } catch {
          return !0;
        }
      }
      function In(h) {
        return "" + h;
      }
      function $r(h) {
        if (Bn(h))
          return Ue("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", rr(h)), In(h);
      }
      function ci(h, C, j) {
        var P = h.displayName;
        if (P)
          return P;
        var ue = C.displayName || C.name || "";
        return ue !== "" ? j + "(" + ue + ")" : j;
      }
      function sa(h) {
        return h.displayName || "Context";
      }
      function Kn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Ue("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case I:
            return "Fragment";
          case ie:
            return "Portal";
          case he:
            return "Profiler";
          case g:
            return "StrictMode";
          case Q:
            return "Suspense";
          case fe:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case K:
              var C = h;
              return sa(C) + ".Consumer";
            case ee:
              var j = h;
              return sa(j._context) + ".Provider";
            case Ve:
              return ci(h, h.render, "ForwardRef");
            case ae:
              var P = h.displayName || null;
              return P !== null ? P : Kn(h.type) || "Memo";
            case de: {
              var ue = h, Ge = ue._payload, ye = ue._init;
              try {
                return Kn(ye(Ge));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var Tn = Object.prototype.hasOwnProperty, Yn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Sr, $a, Ln;
      Ln = {};
      function Er(h) {
        if (Tn.call(h, "ref")) {
          var C = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function ca(h) {
        if (Tn.call(h, "key")) {
          var C = Object.getOwnPropertyDescriptor(h, "key").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function Qa(h, C) {
        var j = function() {
          Sr || (Sr = !0, Ue("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        j.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: j,
          configurable: !0
        });
      }
      function fi(h, C) {
        var j = function() {
          $a || ($a = !0, Ue("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        j.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: j,
          configurable: !0
        });
      }
      function ve(h) {
        if (typeof h.ref == "string" && Ye.current && h.__self && Ye.current.stateNode !== h.__self) {
          var C = Kn(Ye.current.type);
          Ln[C] || (Ue('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', C, h.ref), Ln[C] = !0);
        }
      }
      var He = function(h, C, j, P, ue, Ge, ye) {
        var Je = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: oe,
          // Built-in properties that belong on the element
          type: h,
          key: C,
          ref: j,
          props: ye,
          // Record the component responsible for creating this element.
          _owner: Ge
        };
        return Je._store = {}, Object.defineProperty(Je._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(Je, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: P
        }), Object.defineProperty(Je, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: ue
        }), Object.freeze && (Object.freeze(Je.props), Object.freeze(Je)), Je;
      };
      function gt(h, C, j) {
        var P, ue = {}, Ge = null, ye = null, Je = null, xt = null;
        if (C != null) {
          Er(C) && (ye = C.ref, ve(C)), ca(C) && ($r(C.key), Ge = "" + C.key), Je = C.__self === void 0 ? null : C.__self, xt = C.__source === void 0 ? null : C.__source;
          for (P in C)
            Tn.call(C, P) && !Yn.hasOwnProperty(P) && (ue[P] = C[P]);
        }
        var zt = arguments.length - 2;
        if (zt === 1)
          ue.children = j;
        else if (zt > 1) {
          for (var un = Array(zt), Xt = 0; Xt < zt; Xt++)
            un[Xt] = arguments[Xt + 2];
          Object.freeze && Object.freeze(un), ue.children = un;
        }
        if (h && h.defaultProps) {
          var St = h.defaultProps;
          for (P in St)
            ue[P] === void 0 && (ue[P] = St[P]);
        }
        if (Ge || ye) {
          var Jt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Ge && Qa(ue, Jt), ye && fi(ue, Jt);
        }
        return He(h, Ge, ye, Je, xt, Ye.current, ue);
      }
      function Yt(h, C) {
        var j = He(h.type, C, h.ref, h._self, h._source, h._owner, h.props);
        return j;
      }
      function rn(h, C, j) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var P, ue = Y({}, h.props), Ge = h.key, ye = h.ref, Je = h._self, xt = h._source, zt = h._owner;
        if (C != null) {
          Er(C) && (ye = C.ref, zt = Ye.current), ca(C) && ($r(C.key), Ge = "" + C.key);
          var un;
          h.type && h.type.defaultProps && (un = h.type.defaultProps);
          for (P in C)
            Tn.call(C, P) && !Yn.hasOwnProperty(P) && (C[P] === void 0 && un !== void 0 ? ue[P] = un[P] : ue[P] = C[P]);
        }
        var Xt = arguments.length - 2;
        if (Xt === 1)
          ue.children = j;
        else if (Xt > 1) {
          for (var St = Array(Xt), Jt = 0; Jt < Xt; Jt++)
            St[Jt] = arguments[Jt + 2];
          ue.children = St;
        }
        return He(h.type, Ge, ye, Je, xt, zt, ue);
      }
      function hn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === oe;
      }
      var sn = ".", Xn = ":";
      function an(h) {
        var C = /[=:]/g, j = {
          "=": "=0",
          ":": "=2"
        }, P = h.replace(C, function(ue) {
          return j[ue];
        });
        return "$" + P;
      }
      var Gt = !1, qt = /\/+/g;
      function fa(h) {
        return h.replace(qt, "$&/");
      }
      function Cr(h, C) {
        return typeof h == "object" && h !== null && h.key != null ? ($r(h.key), an("" + h.key)) : C.toString(36);
      }
      function wa(h, C, j, P, ue) {
        var Ge = typeof h;
        (Ge === "undefined" || Ge === "boolean") && (h = null);
        var ye = !1;
        if (h === null)
          ye = !0;
        else
          switch (Ge) {
            case "string":
            case "number":
              ye = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case oe:
                case ie:
                  ye = !0;
              }
          }
        if (ye) {
          var Je = h, xt = ue(Je), zt = P === "" ? sn + Cr(Je, 0) : P;
          if (Rn(xt)) {
            var un = "";
            zt != null && (un = fa(zt) + "/"), wa(xt, C, un, "", function(Xf) {
              return Xf;
            });
          } else xt != null && (hn(xt) && (xt.key && (!Je || Je.key !== xt.key) && $r(xt.key), xt = Yt(
            xt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            j + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (xt.key && (!Je || Je.key !== xt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              fa("" + xt.key) + "/"
            ) : "") + zt
          )), C.push(xt));
          return 1;
        }
        var Xt, St, Jt = 0, mn = P === "" ? sn : P + Xn;
        if (Rn(h))
          for (var Rl = 0; Rl < h.length; Rl++)
            Xt = h[Rl], St = mn + Cr(Xt, Rl), Jt += wa(Xt, C, j, St, ue);
        else {
          var qo = pe(h);
          if (typeof qo == "function") {
            var Bi = h;
            qo === Bi.entries && (Gt || Mt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Gt = !0);
            for (var Ko = qo.call(Bi), ou, Kf = 0; !(ou = Ko.next()).done; )
              Xt = ou.value, St = mn + Cr(Xt, Kf++), Jt += wa(Xt, C, j, St, ue);
          } else if (Ge === "object") {
            var sc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (sc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : sc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Jt;
      }
      function Hi(h, C, j) {
        if (h == null)
          return h;
        var P = [], ue = 0;
        return wa(h, P, "", "", function(Ge) {
          return C.call(j, Ge, ue++);
        }), P;
      }
      function Zl(h) {
        var C = 0;
        return Hi(h, function() {
          C++;
        }), C;
      }
      function eu(h, C, j) {
        Hi(h, function() {
          C.apply(this, arguments);
        }, j);
      }
      function pl(h) {
        return Hi(h, function(C) {
          return C;
        }) || [];
      }
      function vl(h) {
        if (!hn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function tu(h) {
        var C = {
          $$typeof: K,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: h,
          _currentValue2: h,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        C.Provider = {
          $$typeof: ee,
          _context: C
        };
        var j = !1, P = !1, ue = !1;
        {
          var Ge = {
            $$typeof: K,
            _context: C
          };
          Object.defineProperties(Ge, {
            Provider: {
              get: function() {
                return P || (P = !0, Ue("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), C.Provider;
              },
              set: function(ye) {
                C.Provider = ye;
              }
            },
            _currentValue: {
              get: function() {
                return C._currentValue;
              },
              set: function(ye) {
                C._currentValue = ye;
              }
            },
            _currentValue2: {
              get: function() {
                return C._currentValue2;
              },
              set: function(ye) {
                C._currentValue2 = ye;
              }
            },
            _threadCount: {
              get: function() {
                return C._threadCount;
              },
              set: function(ye) {
                C._threadCount = ye;
              }
            },
            Consumer: {
              get: function() {
                return j || (j = !0, Ue("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), C.Consumer;
              }
            },
            displayName: {
              get: function() {
                return C.displayName;
              },
              set: function(ye) {
                ue || (Mt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", ye), ue = !0);
              }
            }
          }), C.Consumer = Ge;
        }
        return C._currentRenderer = null, C._currentRenderer2 = null, C;
      }
      var _r = -1, kr = 0, ar = 1, di = 2;
      function Wa(h) {
        if (h._status === _r) {
          var C = h._result, j = C();
          if (j.then(function(Ge) {
            if (h._status === kr || h._status === _r) {
              var ye = h;
              ye._status = ar, ye._result = Ge;
            }
          }, function(Ge) {
            if (h._status === kr || h._status === _r) {
              var ye = h;
              ye._status = di, ye._result = Ge;
            }
          }), h._status === _r) {
            var P = h;
            P._status = kr, P._result = j;
          }
        }
        if (h._status === ar) {
          var ue = h._result;
          return ue === void 0 && Ue(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, ue), "default" in ue || Ue(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, ue), ue.default;
        } else
          throw h._result;
      }
      function pi(h) {
        var C = {
          // We use these fields to store the result.
          _status: _r,
          _result: h
        }, j = {
          $$typeof: de,
          _payload: C,
          _init: Wa
        };
        {
          var P, ue;
          Object.defineProperties(j, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return P;
              },
              set: function(Ge) {
                Ue("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), P = Ge, Object.defineProperty(j, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return ue;
              },
              set: function(Ge) {
                Ue("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), ue = Ge, Object.defineProperty(j, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return j;
      }
      function vi(h) {
        h != null && h.$$typeof === ae ? Ue("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Ue("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Ue("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Ue("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var C = {
          $$typeof: Ve,
          render: h
        };
        {
          var j;
          Object.defineProperty(C, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return j;
            },
            set: function(P) {
              j = P, !h.name && !h.displayName && (h.displayName = P);
            }
          });
        }
        return C;
      }
      var R;
      R = Symbol.for("react.module.reference");
      function G(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === I || h === he || Ut || h === g || h === Q || h === fe || Le || h === te || We || ft || ht || typeof h == "object" && h !== null && (h.$$typeof === de || h.$$typeof === ae || h.$$typeof === ee || h.$$typeof === K || h.$$typeof === Ve || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === R || h.getModuleId !== void 0));
      }
      function ge(h, C) {
        G(h) || Ue("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var j = {
          $$typeof: ae,
          type: h,
          compare: C === void 0 ? null : C
        };
        {
          var P;
          Object.defineProperty(j, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return P;
            },
            set: function(ue) {
              P = ue, !h.name && !h.displayName && (h.displayName = ue);
            }
          });
        }
        return j;
      }
      function Ne() {
        var h = Re.current;
        return h === null && Ue(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function st(h) {
        var C = Ne();
        if (h._context !== void 0) {
          var j = h._context;
          j.Consumer === h ? Ue("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : j.Provider === h && Ue("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return C.useContext(h);
      }
      function lt(h) {
        var C = Ne();
        return C.useState(h);
      }
      function wt(h, C, j) {
        var P = Ne();
        return P.useReducer(h, C, j);
      }
      function Rt(h) {
        var C = Ne();
        return C.useRef(h);
      }
      function wn(h, C) {
        var j = Ne();
        return j.useEffect(h, C);
      }
      function ln(h, C) {
        var j = Ne();
        return j.useInsertionEffect(h, C);
      }
      function cn(h, C) {
        var j = Ne();
        return j.useLayoutEffect(h, C);
      }
      function ir(h, C) {
        var j = Ne();
        return j.useCallback(h, C);
      }
      function Ga(h, C) {
        var j = Ne();
        return j.useMemo(h, C);
      }
      function qa(h, C, j) {
        var P = Ne();
        return P.useImperativeHandle(h, C, j);
      }
      function ct(h, C) {
        {
          var j = Ne();
          return j.useDebugValue(h, C);
        }
      }
      function vt() {
        var h = Ne();
        return h.useTransition();
      }
      function Ka(h) {
        var C = Ne();
        return C.useDeferredValue(h);
      }
      function nu() {
        var h = Ne();
        return h.useId();
      }
      function ru(h, C, j) {
        var P = Ne();
        return P.useSyncExternalStore(h, C, j);
      }
      var hl = 0, Wu, ml, Qr, $o, Dr, uc, oc;
      function Gu() {
      }
      Gu.__reactDisabledLog = !0;
      function yl() {
        {
          if (hl === 0) {
            Wu = console.log, ml = console.info, Qr = console.warn, $o = console.error, Dr = console.group, uc = console.groupCollapsed, oc = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: Gu,
              writable: !0
            };
            Object.defineProperties(console, {
              info: h,
              log: h,
              warn: h,
              error: h,
              group: h,
              groupCollapsed: h,
              groupEnd: h
            });
          }
          hl++;
        }
      }
      function da() {
        {
          if (hl--, hl === 0) {
            var h = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: Y({}, h, {
                value: Wu
              }),
              info: Y({}, h, {
                value: ml
              }),
              warn: Y({}, h, {
                value: Qr
              }),
              error: Y({}, h, {
                value: $o
              }),
              group: Y({}, h, {
                value: Dr
              }),
              groupCollapsed: Y({}, h, {
                value: uc
              }),
              groupEnd: Y({}, h, {
                value: oc
              })
            });
          }
          hl < 0 && Ue("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Xa = kt.ReactCurrentDispatcher, Ja;
      function qu(h, C, j) {
        {
          if (Ja === void 0)
            try {
              throw Error();
            } catch (ue) {
              var P = ue.stack.trim().match(/\n( *(at )?)/);
              Ja = P && P[1] || "";
            }
          return `
` + Ja + h;
        }
      }
      var au = !1, gl;
      {
        var Ku = typeof WeakMap == "function" ? WeakMap : Map;
        gl = new Ku();
      }
      function Xu(h, C) {
        if (!h || au)
          return "";
        {
          var j = gl.get(h);
          if (j !== void 0)
            return j;
        }
        var P;
        au = !0;
        var ue = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Ge;
        Ge = Xa.current, Xa.current = null, yl();
        try {
          if (C) {
            var ye = function() {
              throw Error();
            };
            if (Object.defineProperty(ye.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(ye, []);
              } catch (mn) {
                P = mn;
              }
              Reflect.construct(h, [], ye);
            } else {
              try {
                ye.call();
              } catch (mn) {
                P = mn;
              }
              h.call(ye.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (mn) {
              P = mn;
            }
            h();
          }
        } catch (mn) {
          if (mn && P && typeof mn.stack == "string") {
            for (var Je = mn.stack.split(`
`), xt = P.stack.split(`
`), zt = Je.length - 1, un = xt.length - 1; zt >= 1 && un >= 0 && Je[zt] !== xt[un]; )
              un--;
            for (; zt >= 1 && un >= 0; zt--, un--)
              if (Je[zt] !== xt[un]) {
                if (zt !== 1 || un !== 1)
                  do
                    if (zt--, un--, un < 0 || Je[zt] !== xt[un]) {
                      var Xt = `
` + Je[zt].replace(" at new ", " at ");
                      return h.displayName && Xt.includes("<anonymous>") && (Xt = Xt.replace("<anonymous>", h.displayName)), typeof h == "function" && gl.set(h, Xt), Xt;
                    }
                  while (zt >= 1 && un >= 0);
                break;
              }
          }
        } finally {
          au = !1, Xa.current = Ge, da(), Error.prepareStackTrace = ue;
        }
        var St = h ? h.displayName || h.name : "", Jt = St ? qu(St) : "";
        return typeof h == "function" && gl.set(h, Jt), Jt;
      }
      function Pi(h, C, j) {
        return Xu(h, !1);
      }
      function Gf(h) {
        var C = h.prototype;
        return !!(C && C.isReactComponent);
      }
      function Vi(h, C, j) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Xu(h, Gf(h));
        if (typeof h == "string")
          return qu(h);
        switch (h) {
          case Q:
            return qu("Suspense");
          case fe:
            return qu("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Ve:
              return Pi(h.render);
            case ae:
              return Vi(h.type, C, j);
            case de: {
              var P = h, ue = P._payload, Ge = P._init;
              try {
                return Vi(Ge(ue), C, j);
              } catch {
              }
            }
          }
        return "";
      }
      var Ft = {}, Ju = kt.ReactDebugCurrentFrame;
      function At(h) {
        if (h) {
          var C = h._owner, j = Vi(h.type, h._source, C ? C.type : null);
          Ju.setExtraStackFrame(j);
        } else
          Ju.setExtraStackFrame(null);
      }
      function Qo(h, C, j, P, ue) {
        {
          var Ge = Function.call.bind(Tn);
          for (var ye in h)
            if (Ge(h, ye)) {
              var Je = void 0;
              try {
                if (typeof h[ye] != "function") {
                  var xt = Error((P || "React class") + ": " + j + " type `" + ye + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[ye] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw xt.name = "Invariant Violation", xt;
                }
                Je = h[ye](C, ye, P, j, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (zt) {
                Je = zt;
              }
              Je && !(Je instanceof Error) && (At(ue), Ue("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", P || "React class", j, ye, typeof Je), At(null)), Je instanceof Error && !(Je.message in Ft) && (Ft[Je.message] = !0, At(ue), Ue("Failed %s type: %s", j, Je.message), At(null));
            }
        }
      }
      function hi(h) {
        if (h) {
          var C = h._owner, j = Vi(h.type, h._source, C ? C.type : null);
          Ke(j);
        } else
          Ke(null);
      }
      var it;
      it = !1;
      function Zu() {
        if (Ye.current) {
          var h = Kn(Ye.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function lr(h) {
        if (h !== void 0) {
          var C = h.fileName.replace(/^.*[\\\/]/, ""), j = h.lineNumber;
          return `

Check your code at ` + C + ":" + j + ".";
        }
        return "";
      }
      function mi(h) {
        return h != null ? lr(h.__source) : "";
      }
      var Or = {};
      function yi(h) {
        var C = Zu();
        if (!C) {
          var j = typeof h == "string" ? h : h.displayName || h.name;
          j && (C = `

Check the top-level render call using <` + j + ">.");
        }
        return C;
      }
      function fn(h, C) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var j = yi(C);
          if (!Or[j]) {
            Or[j] = !0;
            var P = "";
            h && h._owner && h._owner !== Ye.current && (P = " It was passed a child from " + Kn(h._owner.type) + "."), hi(h), Ue('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', j, P), hi(null);
          }
        }
      }
      function Kt(h, C) {
        if (typeof h == "object") {
          if (Rn(h))
            for (var j = 0; j < h.length; j++) {
              var P = h[j];
              hn(P) && fn(P, C);
            }
          else if (hn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var ue = pe(h);
            if (typeof ue == "function" && ue !== h.entries)
              for (var Ge = ue.call(h), ye; !(ye = Ge.next()).done; )
                hn(ye.value) && fn(ye.value, C);
          }
        }
      }
      function Sl(h) {
        {
          var C = h.type;
          if (C == null || typeof C == "string")
            return;
          var j;
          if (typeof C == "function")
            j = C.propTypes;
          else if (typeof C == "object" && (C.$$typeof === Ve || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          C.$$typeof === ae))
            j = C.propTypes;
          else
            return;
          if (j) {
            var P = Kn(C);
            Qo(j, h.props, "prop", P, h);
          } else if (C.PropTypes !== void 0 && !it) {
            it = !0;
            var ue = Kn(C);
            Ue("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ue || "Unknown");
          }
          typeof C.getDefaultProps == "function" && !C.getDefaultProps.isReactClassApproved && Ue("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function $n(h) {
        {
          for (var C = Object.keys(h.props), j = 0; j < C.length; j++) {
            var P = C[j];
            if (P !== "children" && P !== "key") {
              hi(h), Ue("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", P), hi(null);
              break;
            }
          }
          h.ref !== null && (hi(h), Ue("Invalid attribute `ref` supplied to `React.Fragment`."), hi(null));
        }
      }
      function Nr(h, C, j) {
        var P = G(h);
        if (!P) {
          var ue = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (ue += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ge = mi(C);
          Ge ? ue += Ge : ue += Zu();
          var ye;
          h === null ? ye = "null" : Rn(h) ? ye = "array" : h !== void 0 && h.$$typeof === oe ? (ye = "<" + (Kn(h.type) || "Unknown") + " />", ue = " Did you accidentally export a JSX literal instead of a component?") : ye = typeof h, Ue("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ye, ue);
        }
        var Je = gt.apply(this, arguments);
        if (Je == null)
          return Je;
        if (P)
          for (var xt = 2; xt < arguments.length; xt++)
            Kt(arguments[xt], h);
        return h === I ? $n(Je) : Sl(Je), Je;
      }
      var xa = !1;
      function iu(h) {
        var C = Nr.bind(null, h);
        return C.type = h, xa || (xa = !0, Mt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(C, "type", {
          enumerable: !1,
          get: function() {
            return Mt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), C;
      }
      function Wo(h, C, j) {
        for (var P = rn.apply(this, arguments), ue = 2; ue < arguments.length; ue++)
          Kt(arguments[ue], P.type);
        return Sl(P), P;
      }
      function Go(h, C) {
        var j = Fe.transition;
        Fe.transition = {};
        var P = Fe.transition;
        Fe.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (Fe.transition = j, j === null && P._updatedFibers) {
            var ue = P._updatedFibers.size;
            ue > 10 && Mt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), P._updatedFibers.clear();
          }
        }
      }
      var El = !1, lu = null;
      function qf(h) {
        if (lu === null)
          try {
            var C = ("require" + Math.random()).slice(0, 7), j = N && N[C];
            lu = j.call(N, "timers").setImmediate;
          } catch {
            lu = function(ue) {
              El === !1 && (El = !0, typeof MessageChannel > "u" && Ue("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Ge = new MessageChannel();
              Ge.port1.onmessage = ue, Ge.port2.postMessage(void 0);
            };
          }
        return lu(h);
      }
      var ba = 0, Za = !1;
      function gi(h) {
        {
          var C = ba;
          ba++, Te.current === null && (Te.current = []);
          var j = Te.isBatchingLegacy, P;
          try {
            if (Te.isBatchingLegacy = !0, P = h(), !j && Te.didScheduleLegacyUpdate) {
              var ue = Te.current;
              ue !== null && (Te.didScheduleLegacyUpdate = !1, Cl(ue));
            }
          } catch (St) {
            throw _a(C), St;
          } finally {
            Te.isBatchingLegacy = j;
          }
          if (P !== null && typeof P == "object" && typeof P.then == "function") {
            var Ge = P, ye = !1, Je = {
              then: function(St, Jt) {
                ye = !0, Ge.then(function(mn) {
                  _a(C), ba === 0 ? eo(mn, St, Jt) : St(mn);
                }, function(mn) {
                  _a(C), Jt(mn);
                });
              }
            };
            return !Za && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              ye || (Za = !0, Ue("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), Je;
          } else {
            var xt = P;
            if (_a(C), ba === 0) {
              var zt = Te.current;
              zt !== null && (Cl(zt), Te.current = null);
              var un = {
                then: function(St, Jt) {
                  Te.current === null ? (Te.current = [], eo(xt, St, Jt)) : St(xt);
                }
              };
              return un;
            } else {
              var Xt = {
                then: function(St, Jt) {
                  St(xt);
                }
              };
              return Xt;
            }
          }
        }
      }
      function _a(h) {
        h !== ba - 1 && Ue("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), ba = h;
      }
      function eo(h, C, j) {
        {
          var P = Te.current;
          if (P !== null)
            try {
              Cl(P), qf(function() {
                P.length === 0 ? (Te.current = null, C(h)) : eo(h, C, j);
              });
            } catch (ue) {
              j(ue);
            }
          else
            C(h);
        }
      }
      var to = !1;
      function Cl(h) {
        if (!to) {
          to = !0;
          var C = 0;
          try {
            for (; C < h.length; C++) {
              var j = h[C];
              do
                j = j(!0);
              while (j !== null);
            }
            h.length = 0;
          } catch (P) {
            throw h = h.slice(C + 1), P;
          } finally {
            to = !1;
          }
        }
      }
      var uu = Nr, no = Wo, ro = iu, ei = {
        map: Hi,
        forEach: eu,
        count: Zl,
        toArray: pl,
        only: vl
      };
      w.Children = ei, w.Component = et, w.Fragment = I, w.Profiler = he, w.PureComponent = Ct, w.StrictMode = g, w.Suspense = Q, w.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = kt, w.act = gi, w.cloneElement = no, w.createContext = tu, w.createElement = uu, w.createFactory = ro, w.createRef = Nn, w.forwardRef = vi, w.isValidElement = hn, w.lazy = pi, w.memo = ge, w.startTransition = Go, w.unstable_act = gi, w.useCallback = ir, w.useContext = st, w.useDebugValue = ct, w.useDeferredValue = Ka, w.useEffect = wn, w.useId = nu, w.useImperativeHandle = qa, w.useInsertionEffect = ln, w.useLayoutEffect = cn, w.useMemo = Ga, w.useReducer = wt, w.useRef = Rt, w.useState = lt, w.useSyncExternalStore = ru, w.useTransition = vt, w.version = x, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(nv, nv.exports)), nv.exports;
}
process.env.NODE_ENV === "production" ? EE.exports = ak() : EE.exports = ik();
var _e = EE.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var iT;
function lk() {
  if (iT) return Zp;
  iT = 1;
  var N = _e, w = Symbol.for("react.element"), x = Symbol.for("react.fragment"), oe = Object.prototype.hasOwnProperty, ie = N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, I = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(he, ee, K) {
    var Ve, Q = {}, fe = null, ae = null;
    K !== void 0 && (fe = "" + K), ee.key !== void 0 && (fe = "" + ee.key), ee.ref !== void 0 && (ae = ee.ref);
    for (Ve in ee) oe.call(ee, Ve) && !I.hasOwnProperty(Ve) && (Q[Ve] = ee[Ve]);
    if (he && he.defaultProps) for (Ve in ee = he.defaultProps, ee) Q[Ve] === void 0 && (Q[Ve] = ee[Ve]);
    return { $$typeof: w, type: he, key: fe, ref: ae, props: Q, _owner: ie.current };
  }
  return Zp.Fragment = x, Zp.jsx = g, Zp.jsxs = g, Zp;
}
var ev = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lT;
function uk() {
  return lT || (lT = 1, process.env.NODE_ENV !== "production" && function() {
    var N = _e, w = Symbol.for("react.element"), x = Symbol.for("react.portal"), oe = Symbol.for("react.fragment"), ie = Symbol.for("react.strict_mode"), I = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), he = Symbol.for("react.context"), ee = Symbol.for("react.forward_ref"), K = Symbol.for("react.suspense"), Ve = Symbol.for("react.suspense_list"), Q = Symbol.for("react.memo"), fe = Symbol.for("react.lazy"), ae = Symbol.for("react.offscreen"), de = Symbol.iterator, te = "@@iterator";
    function Ce(R) {
      if (R === null || typeof R != "object")
        return null;
      var G = de && R[de] || R[te];
      return typeof G == "function" ? G : null;
    }
    var Ie = N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function pe(R) {
      {
        for (var G = arguments.length, ge = new Array(G > 1 ? G - 1 : 0), Ne = 1; Ne < G; Ne++)
          ge[Ne - 1] = arguments[Ne];
        Re("error", R, ge);
      }
    }
    function Re(R, G, ge) {
      {
        var Ne = Ie.ReactDebugCurrentFrame, st = Ne.getStackAddendum();
        st !== "" && (G += "%s", ge = ge.concat([st]));
        var lt = ge.map(function(wt) {
          return String(wt);
        });
        lt.unshift("Warning: " + G), Function.prototype.apply.call(console[R], console, lt);
      }
    }
    var Fe = !1, Te = !1, Ye = !1, W = !1, ke = !1, Ke;
    Ke = Symbol.for("react.module.reference");
    function We(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === oe || R === I || ke || R === ie || R === K || R === Ve || W || R === ae || Fe || Te || Ye || typeof R == "object" && R !== null && (R.$$typeof === fe || R.$$typeof === Q || R.$$typeof === g || R.$$typeof === he || R.$$typeof === ee || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === Ke || R.getModuleId !== void 0));
    }
    function ft(R, G, ge) {
      var Ne = R.displayName;
      if (Ne)
        return Ne;
      var st = G.displayName || G.name || "";
      return st !== "" ? ge + "(" + st + ")" : ge;
    }
    function ht(R) {
      return R.displayName || "Context";
    }
    function Le(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && pe("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case oe:
          return "Fragment";
        case x:
          return "Portal";
        case I:
          return "Profiler";
        case ie:
          return "StrictMode";
        case K:
          return "Suspense";
        case Ve:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case he:
            var G = R;
            return ht(G) + ".Consumer";
          case g:
            var ge = R;
            return ht(ge._context) + ".Provider";
          case ee:
            return ft(R, R.render, "ForwardRef");
          case Q:
            var Ne = R.displayName || null;
            return Ne !== null ? Ne : Le(R.type) || "Memo";
          case fe: {
            var st = R, lt = st._payload, wt = st._init;
            try {
              return Le(wt(lt));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Ut = Object.assign, kt = 0, Mt, Ue, se, ce, le, D, Y;
    function nt() {
    }
    nt.__reactDisabledLog = !0;
    function et() {
      {
        if (kt === 0) {
          Mt = console.log, Ue = console.info, se = console.warn, ce = console.error, le = console.group, D = console.groupCollapsed, Y = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: nt,
            writable: !0
          };
          Object.defineProperties(console, {
            info: R,
            log: R,
            warn: R,
            error: R,
            group: R,
            groupCollapsed: R,
            groupEnd: R
          });
        }
        kt++;
      }
    }
    function Et() {
      {
        if (kt--, kt === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Ut({}, R, {
              value: Mt
            }),
            info: Ut({}, R, {
              value: Ue
            }),
            warn: Ut({}, R, {
              value: se
            }),
            error: Ut({}, R, {
              value: ce
            }),
            group: Ut({}, R, {
              value: le
            }),
            groupCollapsed: Ut({}, R, {
              value: D
            }),
            groupEnd: Ut({}, R, {
              value: Y
            })
          });
        }
        kt < 0 && pe("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var mt = Ie.ReactCurrentDispatcher, pt;
    function yt(R, G, ge) {
      {
        if (pt === void 0)
          try {
            throw Error();
          } catch (st) {
            var Ne = st.stack.trim().match(/\n( *(at )?)/);
            pt = Ne && Ne[1] || "";
          }
        return `
` + pt + R;
      }
    }
    var Ct = !1, Wt;
    {
      var Nn = typeof WeakMap == "function" ? WeakMap : Map;
      Wt = new Nn();
    }
    function br(R, G) {
      if (!R || Ct)
        return "";
      {
        var ge = Wt.get(R);
        if (ge !== void 0)
          return ge;
      }
      var Ne;
      Ct = !0;
      var st = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var lt;
      lt = mt.current, mt.current = null, et();
      try {
        if (G) {
          var wt = function() {
            throw Error();
          };
          if (Object.defineProperty(wt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(wt, []);
            } catch (ct) {
              Ne = ct;
            }
            Reflect.construct(R, [], wt);
          } else {
            try {
              wt.call();
            } catch (ct) {
              Ne = ct;
            }
            R.call(wt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (ct) {
            Ne = ct;
          }
          R();
        }
      } catch (ct) {
        if (ct && Ne && typeof ct.stack == "string") {
          for (var Rt = ct.stack.split(`
`), wn = Ne.stack.split(`
`), ln = Rt.length - 1, cn = wn.length - 1; ln >= 1 && cn >= 0 && Rt[ln] !== wn[cn]; )
            cn--;
          for (; ln >= 1 && cn >= 0; ln--, cn--)
            if (Rt[ln] !== wn[cn]) {
              if (ln !== 1 || cn !== 1)
                do
                  if (ln--, cn--, cn < 0 || Rt[ln] !== wn[cn]) {
                    var ir = `
` + Rt[ln].replace(" at new ", " at ");
                    return R.displayName && ir.includes("<anonymous>") && (ir = ir.replace("<anonymous>", R.displayName)), typeof R == "function" && Wt.set(R, ir), ir;
                  }
                while (ln >= 1 && cn >= 0);
              break;
            }
        }
      } finally {
        Ct = !1, mt.current = lt, Et(), Error.prepareStackTrace = st;
      }
      var Ga = R ? R.displayName || R.name : "", qa = Ga ? yt(Ga) : "";
      return typeof R == "function" && Wt.set(R, qa), qa;
    }
    function Rn(R, G, ge) {
      return br(R, !1);
    }
    function rr(R) {
      var G = R.prototype;
      return !!(G && G.isReactComponent);
    }
    function Bn(R, G, ge) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return br(R, rr(R));
      if (typeof R == "string")
        return yt(R);
      switch (R) {
        case K:
          return yt("Suspense");
        case Ve:
          return yt("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case ee:
            return Rn(R.render);
          case Q:
            return Bn(R.type, G, ge);
          case fe: {
            var Ne = R, st = Ne._payload, lt = Ne._init;
            try {
              return Bn(lt(st), G, ge);
            } catch {
            }
          }
        }
      return "";
    }
    var In = Object.prototype.hasOwnProperty, $r = {}, ci = Ie.ReactDebugCurrentFrame;
    function sa(R) {
      if (R) {
        var G = R._owner, ge = Bn(R.type, R._source, G ? G.type : null);
        ci.setExtraStackFrame(ge);
      } else
        ci.setExtraStackFrame(null);
    }
    function Kn(R, G, ge, Ne, st) {
      {
        var lt = Function.call.bind(In);
        for (var wt in R)
          if (lt(R, wt)) {
            var Rt = void 0;
            try {
              if (typeof R[wt] != "function") {
                var wn = Error((Ne || "React class") + ": " + ge + " type `" + wt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[wt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw wn.name = "Invariant Violation", wn;
              }
              Rt = R[wt](G, wt, Ne, ge, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (ln) {
              Rt = ln;
            }
            Rt && !(Rt instanceof Error) && (sa(st), pe("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Ne || "React class", ge, wt, typeof Rt), sa(null)), Rt instanceof Error && !(Rt.message in $r) && ($r[Rt.message] = !0, sa(st), pe("Failed %s type: %s", ge, Rt.message), sa(null));
          }
      }
    }
    var Tn = Array.isArray;
    function Yn(R) {
      return Tn(R);
    }
    function Sr(R) {
      {
        var G = typeof Symbol == "function" && Symbol.toStringTag, ge = G && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return ge;
      }
    }
    function $a(R) {
      try {
        return Ln(R), !1;
      } catch {
        return !0;
      }
    }
    function Ln(R) {
      return "" + R;
    }
    function Er(R) {
      if ($a(R))
        return pe("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Sr(R)), Ln(R);
    }
    var ca = Ie.ReactCurrentOwner, Qa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, fi, ve;
    function He(R) {
      if (In.call(R, "ref")) {
        var G = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (G && G.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function gt(R) {
      if (In.call(R, "key")) {
        var G = Object.getOwnPropertyDescriptor(R, "key").get;
        if (G && G.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function Yt(R, G) {
      typeof R.ref == "string" && ca.current;
    }
    function rn(R, G) {
      {
        var ge = function() {
          fi || (fi = !0, pe("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", G));
        };
        ge.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: ge,
          configurable: !0
        });
      }
    }
    function hn(R, G) {
      {
        var ge = function() {
          ve || (ve = !0, pe("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", G));
        };
        ge.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: ge,
          configurable: !0
        });
      }
    }
    var sn = function(R, G, ge, Ne, st, lt, wt) {
      var Rt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: w,
        // Built-in properties that belong on the element
        type: R,
        key: G,
        ref: ge,
        props: wt,
        // Record the component responsible for creating this element.
        _owner: lt
      };
      return Rt._store = {}, Object.defineProperty(Rt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(Rt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Ne
      }), Object.defineProperty(Rt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: st
      }), Object.freeze && (Object.freeze(Rt.props), Object.freeze(Rt)), Rt;
    };
    function Xn(R, G, ge, Ne, st) {
      {
        var lt, wt = {}, Rt = null, wn = null;
        ge !== void 0 && (Er(ge), Rt = "" + ge), gt(G) && (Er(G.key), Rt = "" + G.key), He(G) && (wn = G.ref, Yt(G, st));
        for (lt in G)
          In.call(G, lt) && !Qa.hasOwnProperty(lt) && (wt[lt] = G[lt]);
        if (R && R.defaultProps) {
          var ln = R.defaultProps;
          for (lt in ln)
            wt[lt] === void 0 && (wt[lt] = ln[lt]);
        }
        if (Rt || wn) {
          var cn = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          Rt && rn(wt, cn), wn && hn(wt, cn);
        }
        return sn(R, Rt, wn, st, Ne, ca.current, wt);
      }
    }
    var an = Ie.ReactCurrentOwner, Gt = Ie.ReactDebugCurrentFrame;
    function qt(R) {
      if (R) {
        var G = R._owner, ge = Bn(R.type, R._source, G ? G.type : null);
        Gt.setExtraStackFrame(ge);
      } else
        Gt.setExtraStackFrame(null);
    }
    var fa;
    fa = !1;
    function Cr(R) {
      return typeof R == "object" && R !== null && R.$$typeof === w;
    }
    function wa() {
      {
        if (an.current) {
          var R = Le(an.current.type);
          if (R)
            return `

Check the render method of \`` + R + "`.";
        }
        return "";
      }
    }
    function Hi(R) {
      return "";
    }
    var Zl = {};
    function eu(R) {
      {
        var G = wa();
        if (!G) {
          var ge = typeof R == "string" ? R : R.displayName || R.name;
          ge && (G = `

Check the top-level render call using <` + ge + ">.");
        }
        return G;
      }
    }
    function pl(R, G) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var ge = eu(G);
        if (Zl[ge])
          return;
        Zl[ge] = !0;
        var Ne = "";
        R && R._owner && R._owner !== an.current && (Ne = " It was passed a child from " + Le(R._owner.type) + "."), qt(R), pe('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', ge, Ne), qt(null);
      }
    }
    function vl(R, G) {
      {
        if (typeof R != "object")
          return;
        if (Yn(R))
          for (var ge = 0; ge < R.length; ge++) {
            var Ne = R[ge];
            Cr(Ne) && pl(Ne, G);
          }
        else if (Cr(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var st = Ce(R);
          if (typeof st == "function" && st !== R.entries)
            for (var lt = st.call(R), wt; !(wt = lt.next()).done; )
              Cr(wt.value) && pl(wt.value, G);
        }
      }
    }
    function tu(R) {
      {
        var G = R.type;
        if (G == null || typeof G == "string")
          return;
        var ge;
        if (typeof G == "function")
          ge = G.propTypes;
        else if (typeof G == "object" && (G.$$typeof === ee || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        G.$$typeof === Q))
          ge = G.propTypes;
        else
          return;
        if (ge) {
          var Ne = Le(G);
          Kn(ge, R.props, "prop", Ne, R);
        } else if (G.PropTypes !== void 0 && !fa) {
          fa = !0;
          var st = Le(G);
          pe("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", st || "Unknown");
        }
        typeof G.getDefaultProps == "function" && !G.getDefaultProps.isReactClassApproved && pe("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function _r(R) {
      {
        for (var G = Object.keys(R.props), ge = 0; ge < G.length; ge++) {
          var Ne = G[ge];
          if (Ne !== "children" && Ne !== "key") {
            qt(R), pe("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Ne), qt(null);
            break;
          }
        }
        R.ref !== null && (qt(R), pe("Invalid attribute `ref` supplied to `React.Fragment`."), qt(null));
      }
    }
    var kr = {};
    function ar(R, G, ge, Ne, st, lt) {
      {
        var wt = We(R);
        if (!wt) {
          var Rt = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (Rt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var wn = Hi();
          wn ? Rt += wn : Rt += wa();
          var ln;
          R === null ? ln = "null" : Yn(R) ? ln = "array" : R !== void 0 && R.$$typeof === w ? (ln = "<" + (Le(R.type) || "Unknown") + " />", Rt = " Did you accidentally export a JSX literal instead of a component?") : ln = typeof R, pe("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ln, Rt);
        }
        var cn = Xn(R, G, ge, st, lt);
        if (cn == null)
          return cn;
        if (wt) {
          var ir = G.children;
          if (ir !== void 0)
            if (Ne)
              if (Yn(ir)) {
                for (var Ga = 0; Ga < ir.length; Ga++)
                  vl(ir[Ga], R);
                Object.freeze && Object.freeze(ir);
              } else
                pe("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              vl(ir, R);
        }
        if (In.call(G, "key")) {
          var qa = Le(R), ct = Object.keys(G).filter(function(nu) {
            return nu !== "key";
          }), vt = ct.length > 0 ? "{key: someKey, " + ct.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!kr[qa + vt]) {
            var Ka = ct.length > 0 ? "{" + ct.join(": ..., ") + ": ...}" : "{}";
            pe(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, vt, qa, Ka, qa), kr[qa + vt] = !0;
          }
        }
        return R === oe ? _r(cn) : tu(cn), cn;
      }
    }
    function di(R, G, ge) {
      return ar(R, G, ge, !0);
    }
    function Wa(R, G, ge) {
      return ar(R, G, ge, !1);
    }
    var pi = Wa, vi = di;
    ev.Fragment = oe, ev.jsx = pi, ev.jsxs = vi;
  }()), ev;
}
process.env.NODE_ENV === "production" ? SE.exports = lk() : SE.exports = uk();
var O = SE.exports, CE = { exports: {} }, Ia = {}, Gm = { exports: {} }, mE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var uT;
function ok() {
  return uT || (uT = 1, function(N) {
    function w(se, ce) {
      var le = se.length;
      se.push(ce);
      e: for (; 0 < le; ) {
        var D = le - 1 >>> 1, Y = se[D];
        if (0 < ie(Y, ce)) se[D] = ce, se[le] = Y, le = D;
        else break e;
      }
    }
    function x(se) {
      return se.length === 0 ? null : se[0];
    }
    function oe(se) {
      if (se.length === 0) return null;
      var ce = se[0], le = se.pop();
      if (le !== ce) {
        se[0] = le;
        e: for (var D = 0, Y = se.length, nt = Y >>> 1; D < nt; ) {
          var et = 2 * (D + 1) - 1, Et = se[et], mt = et + 1, pt = se[mt];
          if (0 > ie(Et, le)) mt < Y && 0 > ie(pt, Et) ? (se[D] = pt, se[mt] = le, D = mt) : (se[D] = Et, se[et] = le, D = et);
          else if (mt < Y && 0 > ie(pt, le)) se[D] = pt, se[mt] = le, D = mt;
          else break e;
        }
      }
      return ce;
    }
    function ie(se, ce) {
      var le = se.sortIndex - ce.sortIndex;
      return le !== 0 ? le : se.id - ce.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var I = performance;
      N.unstable_now = function() {
        return I.now();
      };
    } else {
      var g = Date, he = g.now();
      N.unstable_now = function() {
        return g.now() - he;
      };
    }
    var ee = [], K = [], Ve = 1, Q = null, fe = 3, ae = !1, de = !1, te = !1, Ce = typeof setTimeout == "function" ? setTimeout : null, Ie = typeof clearTimeout == "function" ? clearTimeout : null, pe = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Re(se) {
      for (var ce = x(K); ce !== null; ) {
        if (ce.callback === null) oe(K);
        else if (ce.startTime <= se) oe(K), ce.sortIndex = ce.expirationTime, w(ee, ce);
        else break;
        ce = x(K);
      }
    }
    function Fe(se) {
      if (te = !1, Re(se), !de) if (x(ee) !== null) de = !0, Mt(Te);
      else {
        var ce = x(K);
        ce !== null && Ue(Fe, ce.startTime - se);
      }
    }
    function Te(se, ce) {
      de = !1, te && (te = !1, Ie(ke), ke = -1), ae = !0;
      var le = fe;
      try {
        for (Re(ce), Q = x(ee); Q !== null && (!(Q.expirationTime > ce) || se && !ft()); ) {
          var D = Q.callback;
          if (typeof D == "function") {
            Q.callback = null, fe = Q.priorityLevel;
            var Y = D(Q.expirationTime <= ce);
            ce = N.unstable_now(), typeof Y == "function" ? Q.callback = Y : Q === x(ee) && oe(ee), Re(ce);
          } else oe(ee);
          Q = x(ee);
        }
        if (Q !== null) var nt = !0;
        else {
          var et = x(K);
          et !== null && Ue(Fe, et.startTime - ce), nt = !1;
        }
        return nt;
      } finally {
        Q = null, fe = le, ae = !1;
      }
    }
    var Ye = !1, W = null, ke = -1, Ke = 5, We = -1;
    function ft() {
      return !(N.unstable_now() - We < Ke);
    }
    function ht() {
      if (W !== null) {
        var se = N.unstable_now();
        We = se;
        var ce = !0;
        try {
          ce = W(!0, se);
        } finally {
          ce ? Le() : (Ye = !1, W = null);
        }
      } else Ye = !1;
    }
    var Le;
    if (typeof pe == "function") Le = function() {
      pe(ht);
    };
    else if (typeof MessageChannel < "u") {
      var Ut = new MessageChannel(), kt = Ut.port2;
      Ut.port1.onmessage = ht, Le = function() {
        kt.postMessage(null);
      };
    } else Le = function() {
      Ce(ht, 0);
    };
    function Mt(se) {
      W = se, Ye || (Ye = !0, Le());
    }
    function Ue(se, ce) {
      ke = Ce(function() {
        se(N.unstable_now());
      }, ce);
    }
    N.unstable_IdlePriority = 5, N.unstable_ImmediatePriority = 1, N.unstable_LowPriority = 4, N.unstable_NormalPriority = 3, N.unstable_Profiling = null, N.unstable_UserBlockingPriority = 2, N.unstable_cancelCallback = function(se) {
      se.callback = null;
    }, N.unstable_continueExecution = function() {
      de || ae || (de = !0, Mt(Te));
    }, N.unstable_forceFrameRate = function(se) {
      0 > se || 125 < se ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Ke = 0 < se ? Math.floor(1e3 / se) : 5;
    }, N.unstable_getCurrentPriorityLevel = function() {
      return fe;
    }, N.unstable_getFirstCallbackNode = function() {
      return x(ee);
    }, N.unstable_next = function(se) {
      switch (fe) {
        case 1:
        case 2:
        case 3:
          var ce = 3;
          break;
        default:
          ce = fe;
      }
      var le = fe;
      fe = ce;
      try {
        return se();
      } finally {
        fe = le;
      }
    }, N.unstable_pauseExecution = function() {
    }, N.unstable_requestPaint = function() {
    }, N.unstable_runWithPriority = function(se, ce) {
      switch (se) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          se = 3;
      }
      var le = fe;
      fe = se;
      try {
        return ce();
      } finally {
        fe = le;
      }
    }, N.unstable_scheduleCallback = function(se, ce, le) {
      var D = N.unstable_now();
      switch (typeof le == "object" && le !== null ? (le = le.delay, le = typeof le == "number" && 0 < le ? D + le : D) : le = D, se) {
        case 1:
          var Y = -1;
          break;
        case 2:
          Y = 250;
          break;
        case 5:
          Y = 1073741823;
          break;
        case 4:
          Y = 1e4;
          break;
        default:
          Y = 5e3;
      }
      return Y = le + Y, se = { id: Ve++, callback: ce, priorityLevel: se, startTime: le, expirationTime: Y, sortIndex: -1 }, le > D ? (se.sortIndex = le, w(K, se), x(ee) === null && se === x(K) && (te ? (Ie(ke), ke = -1) : te = !0, Ue(Fe, le - D))) : (se.sortIndex = Y, w(ee, se), de || ae || (de = !0, Mt(Te))), se;
    }, N.unstable_shouldYield = ft, N.unstable_wrapCallback = function(se) {
      var ce = fe;
      return function() {
        var le = fe;
        fe = ce;
        try {
          return se.apply(this, arguments);
        } finally {
          fe = le;
        }
      };
    };
  }(mE)), mE;
}
var yE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var oT;
function sk() {
  return oT || (oT = 1, function(N) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var w = !1, x = 5;
      function oe(ve, He) {
        var gt = ve.length;
        ve.push(He), g(ve, He, gt);
      }
      function ie(ve) {
        return ve.length === 0 ? null : ve[0];
      }
      function I(ve) {
        if (ve.length === 0)
          return null;
        var He = ve[0], gt = ve.pop();
        return gt !== He && (ve[0] = gt, he(ve, gt, 0)), He;
      }
      function g(ve, He, gt) {
        for (var Yt = gt; Yt > 0; ) {
          var rn = Yt - 1 >>> 1, hn = ve[rn];
          if (ee(hn, He) > 0)
            ve[rn] = He, ve[Yt] = hn, Yt = rn;
          else
            return;
        }
      }
      function he(ve, He, gt) {
        for (var Yt = gt, rn = ve.length, hn = rn >>> 1; Yt < hn; ) {
          var sn = (Yt + 1) * 2 - 1, Xn = ve[sn], an = sn + 1, Gt = ve[an];
          if (ee(Xn, He) < 0)
            an < rn && ee(Gt, Xn) < 0 ? (ve[Yt] = Gt, ve[an] = He, Yt = an) : (ve[Yt] = Xn, ve[sn] = He, Yt = sn);
          else if (an < rn && ee(Gt, He) < 0)
            ve[Yt] = Gt, ve[an] = He, Yt = an;
          else
            return;
        }
      }
      function ee(ve, He) {
        var gt = ve.sortIndex - He.sortIndex;
        return gt !== 0 ? gt : ve.id - He.id;
      }
      var K = 1, Ve = 2, Q = 3, fe = 4, ae = 5;
      function de(ve, He) {
      }
      var te = typeof performance == "object" && typeof performance.now == "function";
      if (te) {
        var Ce = performance;
        N.unstable_now = function() {
          return Ce.now();
        };
      } else {
        var Ie = Date, pe = Ie.now();
        N.unstable_now = function() {
          return Ie.now() - pe;
        };
      }
      var Re = 1073741823, Fe = -1, Te = 250, Ye = 5e3, W = 1e4, ke = Re, Ke = [], We = [], ft = 1, ht = null, Le = Q, Ut = !1, kt = !1, Mt = !1, Ue = typeof setTimeout == "function" ? setTimeout : null, se = typeof clearTimeout == "function" ? clearTimeout : null, ce = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function le(ve) {
        for (var He = ie(We); He !== null; ) {
          if (He.callback === null)
            I(We);
          else if (He.startTime <= ve)
            I(We), He.sortIndex = He.expirationTime, oe(Ke, He);
          else
            return;
          He = ie(We);
        }
      }
      function D(ve) {
        if (Mt = !1, le(ve), !kt)
          if (ie(Ke) !== null)
            kt = !0, Ln(Y);
          else {
            var He = ie(We);
            He !== null && Er(D, He.startTime - ve);
          }
      }
      function Y(ve, He) {
        kt = !1, Mt && (Mt = !1, ca()), Ut = !0;
        var gt = Le;
        try {
          var Yt;
          if (!w) return nt(ve, He);
        } finally {
          ht = null, Le = gt, Ut = !1;
        }
      }
      function nt(ve, He) {
        var gt = He;
        for (le(gt), ht = ie(Ke); ht !== null && !(ht.expirationTime > gt && (!ve || ci())); ) {
          var Yt = ht.callback;
          if (typeof Yt == "function") {
            ht.callback = null, Le = ht.priorityLevel;
            var rn = ht.expirationTime <= gt, hn = Yt(rn);
            gt = N.unstable_now(), typeof hn == "function" ? ht.callback = hn : ht === ie(Ke) && I(Ke), le(gt);
          } else
            I(Ke);
          ht = ie(Ke);
        }
        if (ht !== null)
          return !0;
        var sn = ie(We);
        return sn !== null && Er(D, sn.startTime - gt), !1;
      }
      function et(ve, He) {
        switch (ve) {
          case K:
          case Ve:
          case Q:
          case fe:
          case ae:
            break;
          default:
            ve = Q;
        }
        var gt = Le;
        Le = ve;
        try {
          return He();
        } finally {
          Le = gt;
        }
      }
      function Et(ve) {
        var He;
        switch (Le) {
          case K:
          case Ve:
          case Q:
            He = Q;
            break;
          default:
            He = Le;
            break;
        }
        var gt = Le;
        Le = He;
        try {
          return ve();
        } finally {
          Le = gt;
        }
      }
      function mt(ve) {
        var He = Le;
        return function() {
          var gt = Le;
          Le = He;
          try {
            return ve.apply(this, arguments);
          } finally {
            Le = gt;
          }
        };
      }
      function pt(ve, He, gt) {
        var Yt = N.unstable_now(), rn;
        if (typeof gt == "object" && gt !== null) {
          var hn = gt.delay;
          typeof hn == "number" && hn > 0 ? rn = Yt + hn : rn = Yt;
        } else
          rn = Yt;
        var sn;
        switch (ve) {
          case K:
            sn = Fe;
            break;
          case Ve:
            sn = Te;
            break;
          case ae:
            sn = ke;
            break;
          case fe:
            sn = W;
            break;
          case Q:
          default:
            sn = Ye;
            break;
        }
        var Xn = rn + sn, an = {
          id: ft++,
          callback: He,
          priorityLevel: ve,
          startTime: rn,
          expirationTime: Xn,
          sortIndex: -1
        };
        return rn > Yt ? (an.sortIndex = rn, oe(We, an), ie(Ke) === null && an === ie(We) && (Mt ? ca() : Mt = !0, Er(D, rn - Yt))) : (an.sortIndex = Xn, oe(Ke, an), !kt && !Ut && (kt = !0, Ln(Y))), an;
      }
      function yt() {
      }
      function Ct() {
        !kt && !Ut && (kt = !0, Ln(Y));
      }
      function Wt() {
        return ie(Ke);
      }
      function Nn(ve) {
        ve.callback = null;
      }
      function br() {
        return Le;
      }
      var Rn = !1, rr = null, Bn = -1, In = x, $r = -1;
      function ci() {
        var ve = N.unstable_now() - $r;
        return !(ve < In);
      }
      function sa() {
      }
      function Kn(ve) {
        if (ve < 0 || ve > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        ve > 0 ? In = Math.floor(1e3 / ve) : In = x;
      }
      var Tn = function() {
        if (rr !== null) {
          var ve = N.unstable_now();
          $r = ve;
          var He = !0, gt = !0;
          try {
            gt = rr(He, ve);
          } finally {
            gt ? Yn() : (Rn = !1, rr = null);
          }
        } else
          Rn = !1;
      }, Yn;
      if (typeof ce == "function")
        Yn = function() {
          ce(Tn);
        };
      else if (typeof MessageChannel < "u") {
        var Sr = new MessageChannel(), $a = Sr.port2;
        Sr.port1.onmessage = Tn, Yn = function() {
          $a.postMessage(null);
        };
      } else
        Yn = function() {
          Ue(Tn, 0);
        };
      function Ln(ve) {
        rr = ve, Rn || (Rn = !0, Yn());
      }
      function Er(ve, He) {
        Bn = Ue(function() {
          ve(N.unstable_now());
        }, He);
      }
      function ca() {
        se(Bn), Bn = -1;
      }
      var Qa = sa, fi = null;
      N.unstable_IdlePriority = ae, N.unstable_ImmediatePriority = K, N.unstable_LowPriority = fe, N.unstable_NormalPriority = Q, N.unstable_Profiling = fi, N.unstable_UserBlockingPriority = Ve, N.unstable_cancelCallback = Nn, N.unstable_continueExecution = Ct, N.unstable_forceFrameRate = Kn, N.unstable_getCurrentPriorityLevel = br, N.unstable_getFirstCallbackNode = Wt, N.unstable_next = Et, N.unstable_pauseExecution = yt, N.unstable_requestPaint = Qa, N.unstable_runWithPriority = et, N.unstable_scheduleCallback = pt, N.unstable_shouldYield = ci, N.unstable_wrapCallback = mt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(yE)), yE;
}
var sT;
function vT() {
  return sT || (sT = 1, process.env.NODE_ENV === "production" ? Gm.exports = ok() : Gm.exports = sk()), Gm.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cT;
function ck() {
  if (cT) return Ia;
  cT = 1;
  var N = _e, w = vT();
  function x(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var oe = /* @__PURE__ */ new Set(), ie = {};
  function I(n, r) {
    g(n, r), g(n + "Capture", r);
  }
  function g(n, r) {
    for (ie[n] = r, n = 0; n < r.length; n++) oe.add(r[n]);
  }
  var he = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ee = Object.prototype.hasOwnProperty, K = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Ve = {}, Q = {};
  function fe(n) {
    return ee.call(Q, n) ? !0 : ee.call(Ve, n) ? !1 : K.test(n) ? Q[n] = !0 : (Ve[n] = !0, !1);
  }
  function ae(n, r, l, o) {
    if (l !== null && l.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return o ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function de(n, r, l, o) {
    if (r === null || typeof r > "u" || ae(n, r, l, o)) return !0;
    if (o) return !1;
    if (l !== null) switch (l.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function te(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var Ce = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    Ce[n] = new te(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    Ce[r] = new te(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    Ce[n] = new te(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    Ce[n] = new te(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    Ce[n] = new te(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    Ce[n] = new te(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    Ce[n] = new te(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    Ce[n] = new te(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    Ce[n] = new te(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Ie = /[\-:]([a-z])/g;
  function pe(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Ie,
      pe
    );
    Ce[r] = new te(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Ie, pe);
    Ce[r] = new te(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Ie, pe);
    Ce[r] = new te(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    Ce[n] = new te(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), Ce.xlinkHref = new te("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    Ce[n] = new te(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function Re(n, r, l, o) {
    var c = Ce.hasOwnProperty(r) ? Ce[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (de(r, l, c, o) && (l = null), o || c === null ? fe(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var Fe = N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Te = Symbol.for("react.element"), Ye = Symbol.for("react.portal"), W = Symbol.for("react.fragment"), ke = Symbol.for("react.strict_mode"), Ke = Symbol.for("react.profiler"), We = Symbol.for("react.provider"), ft = Symbol.for("react.context"), ht = Symbol.for("react.forward_ref"), Le = Symbol.for("react.suspense"), Ut = Symbol.for("react.suspense_list"), kt = Symbol.for("react.memo"), Mt = Symbol.for("react.lazy"), Ue = Symbol.for("react.offscreen"), se = Symbol.iterator;
  function ce(n) {
    return n === null || typeof n != "object" ? null : (n = se && n[se] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var le = Object.assign, D;
  function Y(n) {
    if (D === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      D = r && r[1] || "";
    }
    return `
` + D + n;
  }
  var nt = !1;
  function et(n, r) {
    if (!n || nt) return "";
    nt = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (F) {
          var o = F;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (F) {
          o = F;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (F) {
          o = F;
        }
        n();
      }
    } catch (F) {
      if (F && o && typeof F.stack == "string") {
        for (var c = F.stack.split(`
`), d = o.stack.split(`
`), m = c.length - 1, E = d.length - 1; 1 <= m && 0 <= E && c[m] !== d[E]; ) E--;
        for (; 1 <= m && 0 <= E; m--, E--) if (c[m] !== d[E]) {
          if (m !== 1 || E !== 1)
            do
              if (m--, E--, 0 > E || c[m] !== d[E]) {
                var T = `
` + c[m].replace(" at new ", " at ");
                return n.displayName && T.includes("<anonymous>") && (T = T.replace("<anonymous>", n.displayName)), T;
              }
            while (1 <= m && 0 <= E);
          break;
        }
      }
    } finally {
      nt = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? Y(n) : "";
  }
  function Et(n) {
    switch (n.tag) {
      case 5:
        return Y(n.type);
      case 16:
        return Y("Lazy");
      case 13:
        return Y("Suspense");
      case 19:
        return Y("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = et(n.type, !1), n;
      case 11:
        return n = et(n.type.render, !1), n;
      case 1:
        return n = et(n.type, !0), n;
      default:
        return "";
    }
  }
  function mt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case W:
        return "Fragment";
      case Ye:
        return "Portal";
      case Ke:
        return "Profiler";
      case ke:
        return "StrictMode";
      case Le:
        return "Suspense";
      case Ut:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case ft:
        return (n.displayName || "Context") + ".Consumer";
      case We:
        return (n._context.displayName || "Context") + ".Provider";
      case ht:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case kt:
        return r = n.displayName || null, r !== null ? r : mt(n.type) || "Memo";
      case Mt:
        r = n._payload, n = n._init;
        try {
          return mt(n(r));
        } catch {
        }
    }
    return null;
  }
  function pt(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return mt(r);
      case 8:
        return r === ke ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function yt(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function Ct(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Wt(n) {
    var r = Ct(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, d = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(m) {
        o = "" + m, d.call(this, m);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return o;
      }, setValue: function(m) {
        o = "" + m;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function Nn(n) {
    n._valueTracker || (n._valueTracker = Wt(n));
  }
  function br(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = Ct(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function Rn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function rr(n, r) {
    var l = r.checked;
    return le({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Bn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = yt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function In(n, r) {
    r = r.checked, r != null && Re(n, "checked", r, !1);
  }
  function $r(n, r) {
    In(n, r);
    var l = yt(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? sa(n, r.type, l) : r.hasOwnProperty("defaultValue") && sa(n, r.type, yt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function ci(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var o = r.type;
      if (!(o !== "submit" && o !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function sa(n, r, l) {
    (r !== "number" || Rn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Kn = Array.isArray;
  function Tn(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + yt(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Yn(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(x(91));
    return le({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Sr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(x(92));
        if (Kn(l)) {
          if (1 < l.length) throw Error(x(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: yt(l) };
  }
  function $a(n, r) {
    var l = yt(r.value), o = yt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function Ln(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Er(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function ca(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Er(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var Qa, fi = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, o, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, o, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (Qa = Qa || document.createElement("div"), Qa.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = Qa.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function ve(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var He = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, gt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(He).forEach(function(n) {
    gt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), He[r] = He[n];
    });
  });
  function Yt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || He.hasOwnProperty(n) && He[n] ? ("" + r).trim() : r + "px";
  }
  function rn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = Yt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var hn = le({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function sn(n, r) {
    if (r) {
      if (hn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(x(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(x(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(x(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(x(62));
    }
  }
  function Xn(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var an = null;
  function Gt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var qt = null, fa = null, Cr = null;
  function wa(n) {
    if (n = $e(n)) {
      if (typeof qt != "function") throw Error(x(280));
      var r = n.stateNode;
      r && (r = yn(r), qt(n.stateNode, n.type, r));
    }
  }
  function Hi(n) {
    fa ? Cr ? Cr.push(n) : Cr = [n] : fa = n;
  }
  function Zl() {
    if (fa) {
      var n = fa, r = Cr;
      if (Cr = fa = null, wa(n), r) for (n = 0; n < r.length; n++) wa(r[n]);
    }
  }
  function eu(n, r) {
    return n(r);
  }
  function pl() {
  }
  var vl = !1;
  function tu(n, r, l) {
    if (vl) return n(r, l);
    vl = !0;
    try {
      return eu(n, r, l);
    } finally {
      vl = !1, (fa !== null || Cr !== null) && (pl(), Zl());
    }
  }
  function _r(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var o = yn(l);
    if (o === null) return null;
    l = o[r];
    e: switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (o = !o.disabled) || (n = n.type, o = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !o;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (l && typeof l != "function") throw Error(x(231, r, typeof l));
    return l;
  }
  var kr = !1;
  if (he) try {
    var ar = {};
    Object.defineProperty(ar, "passive", { get: function() {
      kr = !0;
    } }), window.addEventListener("test", ar, ar), window.removeEventListener("test", ar, ar);
  } catch {
    kr = !1;
  }
  function di(n, r, l, o, c, d, m, E, T) {
    var F = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, F);
    } catch (J) {
      this.onError(J);
    }
  }
  var Wa = !1, pi = null, vi = !1, R = null, G = { onError: function(n) {
    Wa = !0, pi = n;
  } };
  function ge(n, r, l, o, c, d, m, E, T) {
    Wa = !1, pi = null, di.apply(G, arguments);
  }
  function Ne(n, r, l, o, c, d, m, E, T) {
    if (ge.apply(this, arguments), Wa) {
      if (Wa) {
        var F = pi;
        Wa = !1, pi = null;
      } else throw Error(x(198));
      vi || (vi = !0, R = F);
    }
  }
  function st(n) {
    var r = n, l = n;
    if (n.alternate) for (; r.return; ) r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (l = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? l : null;
  }
  function lt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function wt(n) {
    if (st(n) !== n) throw Error(x(188));
  }
  function Rt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = st(n), r === null) throw Error(x(188));
      return r !== n ? null : n;
    }
    for (var l = n, o = r; ; ) {
      var c = l.return;
      if (c === null) break;
      var d = c.alternate;
      if (d === null) {
        if (o = c.return, o !== null) {
          l = o;
          continue;
        }
        break;
      }
      if (c.child === d.child) {
        for (d = c.child; d; ) {
          if (d === l) return wt(c), n;
          if (d === o) return wt(c), r;
          d = d.sibling;
        }
        throw Error(x(188));
      }
      if (l.return !== o.return) l = c, o = d;
      else {
        for (var m = !1, E = c.child; E; ) {
          if (E === l) {
            m = !0, l = c, o = d;
            break;
          }
          if (E === o) {
            m = !0, o = c, l = d;
            break;
          }
          E = E.sibling;
        }
        if (!m) {
          for (E = d.child; E; ) {
            if (E === l) {
              m = !0, l = d, o = c;
              break;
            }
            if (E === o) {
              m = !0, o = d, l = c;
              break;
            }
            E = E.sibling;
          }
          if (!m) throw Error(x(189));
        }
      }
      if (l.alternate !== o) throw Error(x(190));
    }
    if (l.tag !== 3) throw Error(x(188));
    return l.stateNode.current === l ? n : r;
  }
  function wn(n) {
    return n = Rt(n), n !== null ? ln(n) : null;
  }
  function ln(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = ln(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var cn = w.unstable_scheduleCallback, ir = w.unstable_cancelCallback, Ga = w.unstable_shouldYield, qa = w.unstable_requestPaint, ct = w.unstable_now, vt = w.unstable_getCurrentPriorityLevel, Ka = w.unstable_ImmediatePriority, nu = w.unstable_UserBlockingPriority, ru = w.unstable_NormalPriority, hl = w.unstable_LowPriority, Wu = w.unstable_IdlePriority, ml = null, Qr = null;
  function $o(n) {
    if (Qr && typeof Qr.onCommitFiberRoot == "function") try {
      Qr.onCommitFiberRoot(ml, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Dr = Math.clz32 ? Math.clz32 : Gu, uc = Math.log, oc = Math.LN2;
  function Gu(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (uc(n) / oc | 0) | 0;
  }
  var yl = 64, da = 4194304;
  function Xa(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function Ja(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var o = 0, c = n.suspendedLanes, d = n.pingedLanes, m = l & 268435455;
    if (m !== 0) {
      var E = m & ~c;
      E !== 0 ? o = Xa(E) : (d &= m, d !== 0 && (o = Xa(d)));
    } else m = l & ~c, m !== 0 ? o = Xa(m) : d !== 0 && (o = Xa(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && !(r & c) && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if (o & 4 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - Dr(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function qu(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function au(n, r) {
    for (var l = n.suspendedLanes, o = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var m = 31 - Dr(d), E = 1 << m, T = c[m];
      T === -1 ? (!(E & l) || E & o) && (c[m] = qu(E, r)) : T <= r && (n.expiredLanes |= E), d &= ~E;
    }
  }
  function gl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Ku() {
    var n = yl;
    return yl <<= 1, !(yl & 4194240) && (yl = 64), n;
  }
  function Xu(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Pi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Dr(r), n[r] = l;
  }
  function Gf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - Dr(l), d = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Vi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - Dr(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var Ft = 0;
  function Ju(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var At, Qo, hi, it, Zu, lr = !1, mi = [], Or = null, yi = null, fn = null, Kt = /* @__PURE__ */ new Map(), Sl = /* @__PURE__ */ new Map(), $n = [], Nr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function xa(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Or = null;
        break;
      case "dragenter":
      case "dragleave":
        yi = null;
        break;
      case "mouseover":
      case "mouseout":
        fn = null;
        break;
      case "pointerover":
      case "pointerout":
        Kt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Sl.delete(r.pointerId);
    }
  }
  function iu(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = $e(r), r !== null && Qo(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Wo(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return Or = iu(Or, n, r, l, o, c), !0;
      case "dragenter":
        return yi = iu(yi, n, r, l, o, c), !0;
      case "mouseover":
        return fn = iu(fn, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return Kt.set(d, iu(Kt.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, Sl.set(d, iu(Sl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function Go(n) {
    var r = vu(n.target);
    if (r !== null) {
      var l = st(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = lt(l), r !== null) {
            n.blockedOn = r, Zu(n.priority, function() {
              hi(l);
            });
            return;
          }
        } else if (r === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function El(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = no(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        an = o, l.target.dispatchEvent(o), an = null;
      } else return r = $e(l), r !== null && Qo(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function lu(n, r, l) {
    El(n) && l.delete(r);
  }
  function qf() {
    lr = !1, Or !== null && El(Or) && (Or = null), yi !== null && El(yi) && (yi = null), fn !== null && El(fn) && (fn = null), Kt.forEach(lu), Sl.forEach(lu);
  }
  function ba(n, r) {
    n.blockedOn === r && (n.blockedOn = null, lr || (lr = !0, w.unstable_scheduleCallback(w.unstable_NormalPriority, qf)));
  }
  function Za(n) {
    function r(c) {
      return ba(c, n);
    }
    if (0 < mi.length) {
      ba(mi[0], n);
      for (var l = 1; l < mi.length; l++) {
        var o = mi[l];
        o.blockedOn === n && (o.blockedOn = null);
      }
    }
    for (Or !== null && ba(Or, n), yi !== null && ba(yi, n), fn !== null && ba(fn, n), Kt.forEach(r), Sl.forEach(r), l = 0; l < $n.length; l++) o = $n[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < $n.length && (l = $n[0], l.blockedOn === null); ) Go(l), l.blockedOn === null && $n.shift();
  }
  var gi = Fe.ReactCurrentBatchConfig, _a = !0;
  function eo(n, r, l, o) {
    var c = Ft, d = gi.transition;
    gi.transition = null;
    try {
      Ft = 1, Cl(n, r, l, o);
    } finally {
      Ft = c, gi.transition = d;
    }
  }
  function to(n, r, l, o) {
    var c = Ft, d = gi.transition;
    gi.transition = null;
    try {
      Ft = 4, Cl(n, r, l, o);
    } finally {
      Ft = c, gi.transition = d;
    }
  }
  function Cl(n, r, l, o) {
    if (_a) {
      var c = no(n, r, l, o);
      if (c === null) Ec(n, r, o, uu, l), xa(n, o);
      else if (Wo(c, n, r, l, o)) o.stopPropagation();
      else if (xa(n, o), r & 4 && -1 < Nr.indexOf(n)) {
        for (; c !== null; ) {
          var d = $e(c);
          if (d !== null && At(d), d = no(n, r, l, o), d === null && Ec(n, r, o, uu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else Ec(n, r, o, null, l);
    }
  }
  var uu = null;
  function no(n, r, l, o) {
    if (uu = null, n = Gt(o), n = vu(n), n !== null) if (r = st(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = lt(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return uu = n, null;
  }
  function ro(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (vt()) {
          case Ka:
            return 1;
          case nu:
            return 4;
          case ru:
          case hl:
            return 16;
          case Wu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ei = null, h = null, C = null;
  function j() {
    if (C) return C;
    var n, r = h, l = r.length, o, c = "value" in ei ? ei.value : ei.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++) ;
    return C = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function P(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function ue() {
    return !0;
  }
  function Ge() {
    return !1;
  }
  function ye(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var E in n) n.hasOwnProperty(E) && (l = n[E], this[E] = l ? l(d) : d[E]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? ue : Ge, this.isPropagationStopped = Ge, this;
    }
    return le(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = ue);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = ue);
    }, persist: function() {
    }, isPersistent: ue }), r;
  }
  var Je = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, xt = ye(Je), zt = le({}, Je, { view: 0, detail: 0 }), un = ye(zt), Xt, St, Jt, mn = le({}, zt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ed, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Jt && (Jt && n.type === "mousemove" ? (Xt = n.screenX - Jt.screenX, St = n.screenY - Jt.screenY) : St = Xt = 0, Jt = n), Xt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : St;
  } }), Rl = ye(mn), qo = le({}, mn, { dataTransfer: 0 }), Bi = ye(qo), Ko = le({}, zt, { relatedTarget: 0 }), ou = ye(Ko), Kf = le({}, Je, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), sc = ye(Kf), Xf = le({}, Je, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), rv = ye(Xf), Jf = le({}, Je, { data: 0 }), Zf = ye(Jf), av = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, iv = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, ey = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ey[n]) ? !!r[n] : !1;
  }
  function ed() {
    return Ii;
  }
  var td = le({}, zt, { key: function(n) {
    if (n.key) {
      var r = av[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = P(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? iv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ed, charCode: function(n) {
    return n.type === "keypress" ? P(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? P(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), nd = ye(td), rd = le({}, mn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), lv = ye(rd), cc = le({}, zt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ed }), uv = ye(cc), Wr = le({}, Je, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yi = ye(Wr), Mn = le({}, mn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), $i = ye(Mn), ad = [9, 13, 27, 32], ao = he && "CompositionEvent" in window, Xo = null;
  he && "documentMode" in document && (Xo = document.documentMode);
  var Jo = he && "TextEvent" in window && !Xo, ov = he && (!ao || Xo && 8 < Xo && 11 >= Xo), sv = " ", fc = !1;
  function cv(n, r) {
    switch (n) {
      case "keyup":
        return ad.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function fv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var io = !1;
  function dv(n, r) {
    switch (n) {
      case "compositionend":
        return fv(r);
      case "keypress":
        return r.which !== 32 ? null : (fc = !0, sv);
      case "textInput":
        return n = r.data, n === sv && fc ? null : n;
      default:
        return null;
    }
  }
  function ty(n, r) {
    if (io) return n === "compositionend" || !ao && cv(n, r) ? (n = j(), C = h = ei = null, io = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return ov && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var ny = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function pv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!ny[n.type] : r === "textarea";
  }
  function id(n, r, l, o) {
    Hi(o), r = as(r, "onChange"), 0 < r.length && (l = new xt("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var Si = null, su = null;
  function vv(n) {
    du(n, 0);
  }
  function Zo(n) {
    var r = ni(n);
    if (br(r)) return n;
  }
  function ry(n, r) {
    if (n === "change") return r;
  }
  var hv = !1;
  if (he) {
    var ld;
    if (he) {
      var ud = "oninput" in document;
      if (!ud) {
        var mv = document.createElement("div");
        mv.setAttribute("oninput", "return;"), ud = typeof mv.oninput == "function";
      }
      ld = ud;
    } else ld = !1;
    hv = ld && (!document.documentMode || 9 < document.documentMode);
  }
  function yv() {
    Si && (Si.detachEvent("onpropertychange", gv), su = Si = null);
  }
  function gv(n) {
    if (n.propertyName === "value" && Zo(su)) {
      var r = [];
      id(r, su, n, Gt(n)), tu(vv, r);
    }
  }
  function ay(n, r, l) {
    n === "focusin" ? (yv(), Si = r, su = l, Si.attachEvent("onpropertychange", gv)) : n === "focusout" && yv();
  }
  function Sv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Zo(su);
  }
  function iy(n, r) {
    if (n === "click") return Zo(r);
  }
  function Ev(n, r) {
    if (n === "input" || n === "change") return Zo(r);
  }
  function ly(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ti = typeof Object.is == "function" ? Object.is : ly;
  function es(n, r) {
    if (ti(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!ee.call(r, c) || !ti(n[c], r[c])) return !1;
    }
    return !0;
  }
  function Cv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function dc(n, r) {
    var l = Cv(n);
    n = 0;
    for (var o; l; ) {
      if (l.nodeType === 3) {
        if (o = n + l.textContent.length, n <= r && o >= r) return { node: l, offset: r - n };
        n = o;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = Cv(l);
    }
  }
  function Tl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Tl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function ts() {
    for (var n = window, r = Rn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = Rn(n.document);
    }
    return r;
  }
  function pc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function lo(n) {
    var r = ts(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && Tl(l.ownerDocument.documentElement, l)) {
      if (o !== null && pc(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(o.start, c);
          o = o.end === void 0 ? d : Math.min(o.end, c), !n.extend && d > o && (c = o, o = d, d = c), c = dc(l, d);
          var m = dc(
            l,
            o
          );
          c && m && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== m.node || n.focusOffset !== m.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), d > o ? (n.addRange(r), n.extend(m.node, m.offset)) : (r.setEnd(m.node, m.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++) n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var uy = he && "documentMode" in document && 11 >= document.documentMode, uo = null, od = null, ns = null, sd = !1;
  function cd(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    sd || uo == null || uo !== Rn(o) || (o = uo, "selectionStart" in o && pc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), ns && es(ns, o) || (ns = o, o = as(od, "onSelect"), 0 < o.length && (r = new xt("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = uo)));
  }
  function vc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var cu = { animationend: vc("Animation", "AnimationEnd"), animationiteration: vc("Animation", "AnimationIteration"), animationstart: vc("Animation", "AnimationStart"), transitionend: vc("Transition", "TransitionEnd") }, ur = {}, fd = {};
  he && (fd = document.createElement("div").style, "AnimationEvent" in window || (delete cu.animationend.animation, delete cu.animationiteration.animation, delete cu.animationstart.animation), "TransitionEvent" in window || delete cu.transitionend.transition);
  function hc(n) {
    if (ur[n]) return ur[n];
    if (!cu[n]) return n;
    var r = cu[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in fd) return ur[n] = r[l];
    return n;
  }
  var Rv = hc("animationend"), Tv = hc("animationiteration"), wv = hc("animationstart"), xv = hc("transitionend"), dd = /* @__PURE__ */ new Map(), mc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ka(n, r) {
    dd.set(n, r), I(r, [n]);
  }
  for (var pd = 0; pd < mc.length; pd++) {
    var fu = mc[pd], oy = fu.toLowerCase(), sy = fu[0].toUpperCase() + fu.slice(1);
    ka(oy, "on" + sy);
  }
  ka(Rv, "onAnimationEnd"), ka(Tv, "onAnimationIteration"), ka(wv, "onAnimationStart"), ka("dblclick", "onDoubleClick"), ka("focusin", "onFocus"), ka("focusout", "onBlur"), ka(xv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), I("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), I("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), I("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), I("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), I("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), I("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var rs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), vd = new Set("cancel close invalid load scroll toggle".split(" ").concat(rs));
  function yc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, Ne(o, r, void 0, n), n.currentTarget = null;
  }
  function du(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var E = o[m], T = E.instance, F = E.currentTarget;
          if (E = E.listener, T !== d && c.isPropagationStopped()) break e;
          yc(c, E, F), d = T;
        }
        else for (m = 0; m < o.length; m++) {
          if (E = o[m], T = E.instance, F = E.currentTarget, E = E.listener, T !== d && c.isPropagationStopped()) break e;
          yc(c, E, F), d = T;
        }
      }
    }
    if (vi) throw n = R, vi = !1, R = null, n;
  }
  function $t(n, r) {
    var l = r[us];
    l === void 0 && (l = r[us] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (bv(r, n, 2, !1), l.add(o));
  }
  function gc(n, r, l) {
    var o = 0;
    r && (o |= 4), bv(l, n, o, r);
  }
  var Sc = "_reactListening" + Math.random().toString(36).slice(2);
  function oo(n) {
    if (!n[Sc]) {
      n[Sc] = !0, oe.forEach(function(l) {
        l !== "selectionchange" && (vd.has(l) || gc(l, !1, n), gc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Sc] || (r[Sc] = !0, gc("selectionchange", !1, r));
    }
  }
  function bv(n, r, l, o) {
    switch (ro(r)) {
      case 1:
        var c = eo;
        break;
      case 4:
        c = to;
        break;
      default:
        c = Cl;
    }
    l = c.bind(null, r, l, n), c = void 0, !kr || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function Ec(n, r, l, o, c) {
    var d = o;
    if (!(r & 1) && !(r & 2) && o !== null) e: for (; ; ) {
      if (o === null) return;
      var m = o.tag;
      if (m === 3 || m === 4) {
        var E = o.stateNode.containerInfo;
        if (E === c || E.nodeType === 8 && E.parentNode === c) break;
        if (m === 4) for (m = o.return; m !== null; ) {
          var T = m.tag;
          if ((T === 3 || T === 4) && (T = m.stateNode.containerInfo, T === c || T.nodeType === 8 && T.parentNode === c)) return;
          m = m.return;
        }
        for (; E !== null; ) {
          if (m = vu(E), m === null) return;
          if (T = m.tag, T === 5 || T === 6) {
            o = d = m;
            continue e;
          }
          E = E.parentNode;
        }
      }
      o = o.return;
    }
    tu(function() {
      var F = d, J = Gt(l), ne = [];
      e: {
        var X = dd.get(n);
        if (X !== void 0) {
          var xe = xt, Me = n;
          switch (n) {
            case "keypress":
              if (P(l) === 0) break e;
            case "keydown":
            case "keyup":
              xe = nd;
              break;
            case "focusin":
              Me = "focus", xe = ou;
              break;
            case "focusout":
              Me = "blur", xe = ou;
              break;
            case "beforeblur":
            case "afterblur":
              xe = ou;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              xe = Rl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              xe = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              xe = uv;
              break;
            case Rv:
            case Tv:
            case wv:
              xe = sc;
              break;
            case xv:
              xe = Yi;
              break;
            case "scroll":
              xe = un;
              break;
            case "wheel":
              xe = $i;
              break;
            case "copy":
            case "cut":
            case "paste":
              xe = rv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              xe = lv;
          }
          var je = (r & 4) !== 0, Dn = !je && n === "scroll", L = je ? X !== null ? X + "Capture" : null : X;
          je = [];
          for (var _ = F, z; _ !== null; ) {
            z = _;
            var Z = z.stateNode;
            if (z.tag === 5 && Z !== null && (z = Z, L !== null && (Z = _r(_, L), Z != null && je.push(so(_, Z, z)))), Dn) break;
            _ = _.return;
          }
          0 < je.length && (X = new xe(X, Me, null, l, J), ne.push({ event: X, listeners: je }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (X = n === "mouseover" || n === "pointerover", xe = n === "mouseout" || n === "pointerout", X && l !== an && (Me = l.relatedTarget || l.fromElement) && (vu(Me) || Me[Qi])) break e;
          if ((xe || X) && (X = J.window === J ? J : (X = J.ownerDocument) ? X.defaultView || X.parentWindow : window, xe ? (Me = l.relatedTarget || l.toElement, xe = F, Me = Me ? vu(Me) : null, Me !== null && (Dn = st(Me), Me !== Dn || Me.tag !== 5 && Me.tag !== 6) && (Me = null)) : (xe = null, Me = F), xe !== Me)) {
            if (je = Rl, Z = "onMouseLeave", L = "onMouseEnter", _ = "mouse", (n === "pointerout" || n === "pointerover") && (je = lv, Z = "onPointerLeave", L = "onPointerEnter", _ = "pointer"), Dn = xe == null ? X : ni(xe), z = Me == null ? X : ni(Me), X = new je(Z, _ + "leave", xe, l, J), X.target = Dn, X.relatedTarget = z, Z = null, vu(J) === F && (je = new je(L, _ + "enter", Me, l, J), je.target = z, je.relatedTarget = Dn, Z = je), Dn = Z, xe && Me) t: {
              for (je = xe, L = Me, _ = 0, z = je; z; z = wl(z)) _++;
              for (z = 0, Z = L; Z; Z = wl(Z)) z++;
              for (; 0 < _ - z; ) je = wl(je), _--;
              for (; 0 < z - _; ) L = wl(L), z--;
              for (; _--; ) {
                if (je === L || L !== null && je === L.alternate) break t;
                je = wl(je), L = wl(L);
              }
              je = null;
            }
            else je = null;
            xe !== null && _v(ne, X, xe, je, !1), Me !== null && Dn !== null && _v(ne, Dn, Me, je, !0);
          }
        }
        e: {
          if (X = F ? ni(F) : window, xe = X.nodeName && X.nodeName.toLowerCase(), xe === "select" || xe === "input" && X.type === "file") var Ae = ry;
          else if (pv(X)) if (hv) Ae = Ev;
          else {
            Ae = Sv;
            var Xe = ay;
          }
          else (xe = X.nodeName) && xe.toLowerCase() === "input" && (X.type === "checkbox" || X.type === "radio") && (Ae = iy);
          if (Ae && (Ae = Ae(n, F))) {
            id(ne, Ae, l, J);
            break e;
          }
          Xe && Xe(n, X, F), n === "focusout" && (Xe = X._wrapperState) && Xe.controlled && X.type === "number" && sa(X, "number", X.value);
        }
        switch (Xe = F ? ni(F) : window, n) {
          case "focusin":
            (pv(Xe) || Xe.contentEditable === "true") && (uo = Xe, od = F, ns = null);
            break;
          case "focusout":
            ns = od = uo = null;
            break;
          case "mousedown":
            sd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            sd = !1, cd(ne, l, J);
            break;
          case "selectionchange":
            if (uy) break;
          case "keydown":
          case "keyup":
            cd(ne, l, J);
        }
        var Ze;
        if (ao) e: {
          switch (n) {
            case "compositionstart":
              var at = "onCompositionStart";
              break e;
            case "compositionend":
              at = "onCompositionEnd";
              break e;
            case "compositionupdate":
              at = "onCompositionUpdate";
              break e;
          }
          at = void 0;
        }
        else io ? cv(n, l) && (at = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (at = "onCompositionStart");
        at && (ov && l.locale !== "ko" && (io || at !== "onCompositionStart" ? at === "onCompositionEnd" && io && (Ze = j()) : (ei = J, h = "value" in ei ? ei.value : ei.textContent, io = !0)), Xe = as(F, at), 0 < Xe.length && (at = new Zf(at, n, null, l, J), ne.push({ event: at, listeners: Xe }), Ze ? at.data = Ze : (Ze = fv(l), Ze !== null && (at.data = Ze)))), (Ze = Jo ? dv(n, l) : ty(n, l)) && (F = as(F, "onBeforeInput"), 0 < F.length && (J = new Zf("onBeforeInput", "beforeinput", null, l, J), ne.push({ event: J, listeners: F }), J.data = Ze));
      }
      du(ne, r);
    });
  }
  function so(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function as(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = _r(n, l), d != null && o.unshift(so(n, d, c)), d = _r(n, r), d != null && o.push(so(n, d, c))), n = n.return;
    }
    return o;
  }
  function wl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function _v(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var E = l, T = E.alternate, F = E.stateNode;
      if (T !== null && T === o) break;
      E.tag === 5 && F !== null && (E = F, c ? (T = _r(l, d), T != null && m.unshift(so(l, T, E))) : c || (T = _r(l, d), T != null && m.push(so(l, T, E)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var kv = /\r\n?/g, cy = /\u0000|\uFFFD/g;
  function Dv(n) {
    return (typeof n == "string" ? n : "" + n).replace(kv, `
`).replace(cy, "");
  }
  function Cc(n, r, l) {
    if (r = Dv(r), Dv(n) !== r && l) throw Error(x(425));
  }
  function xl() {
  }
  var is = null, pu = null;
  function Rc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Tc = typeof setTimeout == "function" ? setTimeout : void 0, hd = typeof clearTimeout == "function" ? clearTimeout : void 0, Ov = typeof Promise == "function" ? Promise : void 0, co = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ov < "u" ? function(n) {
    return Ov.resolve(null).then(n).catch(wc);
  } : Tc;
  function wc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function fo(n, r) {
    var l = r, o = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8) if (l = c.data, l === "/$") {
        if (o === 0) {
          n.removeChild(c), Za(r);
          return;
        }
        o--;
      } else l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    Za(r);
  }
  function Ei(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function Nv(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var l = n.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (r === 0) return n;
          r--;
        } else l === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var bl = Math.random().toString(36).slice(2), Ci = "__reactFiber$" + bl, ls = "__reactProps$" + bl, Qi = "__reactContainer$" + bl, us = "__reactEvents$" + bl, po = "__reactListeners$" + bl, fy = "__reactHandles$" + bl;
  function vu(n) {
    var r = n[Ci];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Qi] || l[Ci]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = Nv(n); n !== null; ) {
          if (l = n[Ci]) return l;
          n = Nv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function $e(n) {
    return n = n[Ci] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ni(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(x(33));
  }
  function yn(n) {
    return n[ls] || null;
  }
  var Dt = [], Da = -1;
  function Oa(n) {
    return { current: n };
  }
  function on(n) {
    0 > Da || (n.current = Dt[Da], Dt[Da] = null, Da--);
  }
  function Be(n, r) {
    Da++, Dt[Da] = n.current, n.current = r;
  }
  var Rr = {}, Cn = Oa(Rr), Qn = Oa(!1), Gr = Rr;
  function qr(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Rr;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r) return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function An(n) {
    return n = n.childContextTypes, n != null;
  }
  function vo() {
    on(Qn), on(Cn);
  }
  function Lv(n, r, l) {
    if (Cn.current !== Rr) throw Error(x(168));
    Be(Cn, r), Be(Qn, l);
  }
  function os(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(x(108, pt(n) || "Unknown", c));
    return le({}, l, o);
  }
  function Jn(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Rr, Gr = Cn.current, Be(Cn, n), Be(Qn, Qn.current), !0;
  }
  function xc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(x(169));
    l ? (n = os(n, r, Gr), o.__reactInternalMemoizedMergedChildContext = n, on(Qn), on(Cn), Be(Cn, n)) : on(Qn), Be(Qn, l);
  }
  var Ri = null, ho = !1, Wi = !1;
  function bc(n) {
    Ri === null ? Ri = [n] : Ri.push(n);
  }
  function _l(n) {
    ho = !0, bc(n);
  }
  function Ti() {
    if (!Wi && Ri !== null) {
      Wi = !0;
      var n = 0, r = Ft;
      try {
        var l = Ri;
        for (Ft = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        Ri = null, ho = !1;
      } catch (c) {
        throw Ri !== null && (Ri = Ri.slice(n + 1)), cn(Ka, Ti), c;
      } finally {
        Ft = r, Wi = !1;
      }
    }
    return null;
  }
  var kl = [], Dl = 0, Ol = null, Gi = 0, zn = [], Na = 0, pa = null, wi = 1, xi = "";
  function hu(n, r) {
    kl[Dl++] = Gi, kl[Dl++] = Ol, Ol = n, Gi = r;
  }
  function Mv(n, r, l) {
    zn[Na++] = wi, zn[Na++] = xi, zn[Na++] = pa, pa = n;
    var o = wi;
    n = xi;
    var c = 32 - Dr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - Dr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, wi = 1 << 32 - Dr(r) + c | l << c | o, xi = d + n;
    } else wi = 1 << d | l << c | o, xi = n;
  }
  function _c(n) {
    n.return !== null && (hu(n, 1), Mv(n, 1, 0));
  }
  function kc(n) {
    for (; n === Ol; ) Ol = kl[--Dl], kl[Dl] = null, Gi = kl[--Dl], kl[Dl] = null;
    for (; n === pa; ) pa = zn[--Na], zn[Na] = null, xi = zn[--Na], zn[Na] = null, wi = zn[--Na], zn[Na] = null;
  }
  var Kr = null, Xr = null, pn = !1, La = null;
  function md(n, r) {
    var l = ja(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Av(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, Kr = n, Xr = Ei(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, Kr = n, Xr = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = pa !== null ? { id: wi, overflow: xi } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = ja(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Kr = n, Xr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function yd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function gd(n) {
    if (pn) {
      var r = Xr;
      if (r) {
        var l = r;
        if (!Av(n, r)) {
          if (yd(n)) throw Error(x(418));
          r = Ei(l.nextSibling);
          var o = Kr;
          r && Av(n, r) ? md(o, l) : (n.flags = n.flags & -4097 | 2, pn = !1, Kr = n);
        }
      } else {
        if (yd(n)) throw Error(x(418));
        n.flags = n.flags & -4097 | 2, pn = !1, Kr = n;
      }
    }
  }
  function Wn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Kr = n;
  }
  function Dc(n) {
    if (n !== Kr) return !1;
    if (!pn) return Wn(n), pn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Rc(n.type, n.memoizedProps)), r && (r = Xr)) {
      if (yd(n)) throw ss(), Error(x(418));
      for (; r; ) md(n, r), r = Ei(r.nextSibling);
    }
    if (Wn(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(x(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                Xr = Ei(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        Xr = null;
      }
    } else Xr = Kr ? Ei(n.stateNode.nextSibling) : null;
    return !0;
  }
  function ss() {
    for (var n = Xr; n; ) n = Ei(n.nextSibling);
  }
  function Nl() {
    Xr = Kr = null, pn = !1;
  }
  function qi(n) {
    La === null ? La = [n] : La.push(n);
  }
  var dy = Fe.ReactCurrentBatchConfig;
  function mu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(x(309));
          var o = l.stateNode;
        }
        if (!o) throw Error(x(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var E = c.refs;
          m === null ? delete E[d] : E[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(x(284));
      if (!l._owner) throw Error(x(290, n));
    }
    return n;
  }
  function Oc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(x(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function zv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function yu(n) {
    function r(L, _) {
      if (n) {
        var z = L.deletions;
        z === null ? (L.deletions = [_], L.flags |= 16) : z.push(_);
      }
    }
    function l(L, _) {
      if (!n) return null;
      for (; _ !== null; ) r(L, _), _ = _.sibling;
      return null;
    }
    function o(L, _) {
      for (L = /* @__PURE__ */ new Map(); _ !== null; ) _.key !== null ? L.set(_.key, _) : L.set(_.index, _), _ = _.sibling;
      return L;
    }
    function c(L, _) {
      return L = Hl(L, _), L.index = 0, L.sibling = null, L;
    }
    function d(L, _, z) {
      return L.index = z, n ? (z = L.alternate, z !== null ? (z = z.index, z < _ ? (L.flags |= 2, _) : z) : (L.flags |= 2, _)) : (L.flags |= 1048576, _);
    }
    function m(L) {
      return n && L.alternate === null && (L.flags |= 2), L;
    }
    function E(L, _, z, Z) {
      return _ === null || _.tag !== 6 ? (_ = qd(z, L.mode, Z), _.return = L, _) : (_ = c(_, z), _.return = L, _);
    }
    function T(L, _, z, Z) {
      var Ae = z.type;
      return Ae === W ? J(L, _, z.props.children, Z, z.key) : _ !== null && (_.elementType === Ae || typeof Ae == "object" && Ae !== null && Ae.$$typeof === Mt && zv(Ae) === _.type) ? (Z = c(_, z.props), Z.ref = mu(L, _, z), Z.return = L, Z) : (Z = Hs(z.type, z.key, z.props, null, L.mode, Z), Z.ref = mu(L, _, z), Z.return = L, Z);
    }
    function F(L, _, z, Z) {
      return _ === null || _.tag !== 4 || _.stateNode.containerInfo !== z.containerInfo || _.stateNode.implementation !== z.implementation ? (_ = cf(z, L.mode, Z), _.return = L, _) : (_ = c(_, z.children || []), _.return = L, _);
    }
    function J(L, _, z, Z, Ae) {
      return _ === null || _.tag !== 7 ? (_ = tl(z, L.mode, Z, Ae), _.return = L, _) : (_ = c(_, z), _.return = L, _);
    }
    function ne(L, _, z) {
      if (typeof _ == "string" && _ !== "" || typeof _ == "number") return _ = qd("" + _, L.mode, z), _.return = L, _;
      if (typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case Te:
            return z = Hs(_.type, _.key, _.props, null, L.mode, z), z.ref = mu(L, null, _), z.return = L, z;
          case Ye:
            return _ = cf(_, L.mode, z), _.return = L, _;
          case Mt:
            var Z = _._init;
            return ne(L, Z(_._payload), z);
        }
        if (Kn(_) || ce(_)) return _ = tl(_, L.mode, z, null), _.return = L, _;
        Oc(L, _);
      }
      return null;
    }
    function X(L, _, z, Z) {
      var Ae = _ !== null ? _.key : null;
      if (typeof z == "string" && z !== "" || typeof z == "number") return Ae !== null ? null : E(L, _, "" + z, Z);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case Te:
            return z.key === Ae ? T(L, _, z, Z) : null;
          case Ye:
            return z.key === Ae ? F(L, _, z, Z) : null;
          case Mt:
            return Ae = z._init, X(
              L,
              _,
              Ae(z._payload),
              Z
            );
        }
        if (Kn(z) || ce(z)) return Ae !== null ? null : J(L, _, z, Z, null);
        Oc(L, z);
      }
      return null;
    }
    function xe(L, _, z, Z, Ae) {
      if (typeof Z == "string" && Z !== "" || typeof Z == "number") return L = L.get(z) || null, E(_, L, "" + Z, Ae);
      if (typeof Z == "object" && Z !== null) {
        switch (Z.$$typeof) {
          case Te:
            return L = L.get(Z.key === null ? z : Z.key) || null, T(_, L, Z, Ae);
          case Ye:
            return L = L.get(Z.key === null ? z : Z.key) || null, F(_, L, Z, Ae);
          case Mt:
            var Xe = Z._init;
            return xe(L, _, z, Xe(Z._payload), Ae);
        }
        if (Kn(Z) || ce(Z)) return L = L.get(z) || null, J(_, L, Z, Ae, null);
        Oc(_, Z);
      }
      return null;
    }
    function Me(L, _, z, Z) {
      for (var Ae = null, Xe = null, Ze = _, at = _ = 0, tr = null; Ze !== null && at < z.length; at++) {
        Ze.index > at ? (tr = Ze, Ze = null) : tr = Ze.sibling;
        var Vt = X(L, Ze, z[at], Z);
        if (Vt === null) {
          Ze === null && (Ze = tr);
          break;
        }
        n && Ze && Vt.alternate === null && r(L, Ze), _ = d(Vt, _, at), Xe === null ? Ae = Vt : Xe.sibling = Vt, Xe = Vt, Ze = tr;
      }
      if (at === z.length) return l(L, Ze), pn && hu(L, at), Ae;
      if (Ze === null) {
        for (; at < z.length; at++) Ze = ne(L, z[at], Z), Ze !== null && (_ = d(Ze, _, at), Xe === null ? Ae = Ze : Xe.sibling = Ze, Xe = Ze);
        return pn && hu(L, at), Ae;
      }
      for (Ze = o(L, Ze); at < z.length; at++) tr = xe(Ze, L, at, z[at], Z), tr !== null && (n && tr.alternate !== null && Ze.delete(tr.key === null ? at : tr.key), _ = d(tr, _, at), Xe === null ? Ae = tr : Xe.sibling = tr, Xe = tr);
      return n && Ze.forEach(function(Bl) {
        return r(L, Bl);
      }), pn && hu(L, at), Ae;
    }
    function je(L, _, z, Z) {
      var Ae = ce(z);
      if (typeof Ae != "function") throw Error(x(150));
      if (z = Ae.call(z), z == null) throw Error(x(151));
      for (var Xe = Ae = null, Ze = _, at = _ = 0, tr = null, Vt = z.next(); Ze !== null && !Vt.done; at++, Vt = z.next()) {
        Ze.index > at ? (tr = Ze, Ze = null) : tr = Ze.sibling;
        var Bl = X(L, Ze, Vt.value, Z);
        if (Bl === null) {
          Ze === null && (Ze = tr);
          break;
        }
        n && Ze && Bl.alternate === null && r(L, Ze), _ = d(Bl, _, at), Xe === null ? Ae = Bl : Xe.sibling = Bl, Xe = Bl, Ze = tr;
      }
      if (Vt.done) return l(
        L,
        Ze
      ), pn && hu(L, at), Ae;
      if (Ze === null) {
        for (; !Vt.done; at++, Vt = z.next()) Vt = ne(L, Vt.value, Z), Vt !== null && (_ = d(Vt, _, at), Xe === null ? Ae = Vt : Xe.sibling = Vt, Xe = Vt);
        return pn && hu(L, at), Ae;
      }
      for (Ze = o(L, Ze); !Vt.done; at++, Vt = z.next()) Vt = xe(Ze, L, at, Vt.value, Z), Vt !== null && (n && Vt.alternate !== null && Ze.delete(Vt.key === null ? at : Vt.key), _ = d(Vt, _, at), Xe === null ? Ae = Vt : Xe.sibling = Vt, Xe = Vt);
      return n && Ze.forEach(function(yh) {
        return r(L, yh);
      }), pn && hu(L, at), Ae;
    }
    function Dn(L, _, z, Z) {
      if (typeof z == "object" && z !== null && z.type === W && z.key === null && (z = z.props.children), typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case Te:
            e: {
              for (var Ae = z.key, Xe = _; Xe !== null; ) {
                if (Xe.key === Ae) {
                  if (Ae = z.type, Ae === W) {
                    if (Xe.tag === 7) {
                      l(L, Xe.sibling), _ = c(Xe, z.props.children), _.return = L, L = _;
                      break e;
                    }
                  } else if (Xe.elementType === Ae || typeof Ae == "object" && Ae !== null && Ae.$$typeof === Mt && zv(Ae) === Xe.type) {
                    l(L, Xe.sibling), _ = c(Xe, z.props), _.ref = mu(L, Xe, z), _.return = L, L = _;
                    break e;
                  }
                  l(L, Xe);
                  break;
                } else r(L, Xe);
                Xe = Xe.sibling;
              }
              z.type === W ? (_ = tl(z.props.children, L.mode, Z, z.key), _.return = L, L = _) : (Z = Hs(z.type, z.key, z.props, null, L.mode, Z), Z.ref = mu(L, _, z), Z.return = L, L = Z);
            }
            return m(L);
          case Ye:
            e: {
              for (Xe = z.key; _ !== null; ) {
                if (_.key === Xe) if (_.tag === 4 && _.stateNode.containerInfo === z.containerInfo && _.stateNode.implementation === z.implementation) {
                  l(L, _.sibling), _ = c(_, z.children || []), _.return = L, L = _;
                  break e;
                } else {
                  l(L, _);
                  break;
                }
                else r(L, _);
                _ = _.sibling;
              }
              _ = cf(z, L.mode, Z), _.return = L, L = _;
            }
            return m(L);
          case Mt:
            return Xe = z._init, Dn(L, _, Xe(z._payload), Z);
        }
        if (Kn(z)) return Me(L, _, z, Z);
        if (ce(z)) return je(L, _, z, Z);
        Oc(L, z);
      }
      return typeof z == "string" && z !== "" || typeof z == "number" ? (z = "" + z, _ !== null && _.tag === 6 ? (l(L, _.sibling), _ = c(_, z), _.return = L, L = _) : (l(L, _), _ = qd(z, L.mode, Z), _.return = L, L = _), m(L)) : l(L, _);
    }
    return Dn;
  }
  var xn = yu(!0), Se = yu(!1), va = Oa(null), Jr = null, mo = null, Sd = null;
  function Ed() {
    Sd = mo = Jr = null;
  }
  function Cd(n) {
    var r = va.current;
    on(va), n._currentValue = r;
  }
  function Rd(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function gn(n, r) {
    Jr = n, Sd = mo = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (jn = !0), n.firstContext = null);
  }
  function Ma(n) {
    var r = n._currentValue;
    if (Sd !== n) if (n = { context: n, memoizedValue: r, next: null }, mo === null) {
      if (Jr === null) throw Error(x(308));
      mo = n, Jr.dependencies = { lanes: 0, firstContext: n };
    } else mo = mo.next = n;
    return r;
  }
  var gu = null;
  function Td(n) {
    gu === null ? gu = [n] : gu.push(n);
  }
  function wd(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Td(r)) : (l.next = c.next, c.next = l), r.interleaved = l, ha(n, o);
  }
  function ha(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ma = !1;
  function xd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Uv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Ki(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ll(n, r, l) {
    var o = n.updateQueue;
    if (o === null) return null;
    if (o = o.shared, Ot & 2) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, ha(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, Td(o)) : (r.next = c.next, c.next = r), o.interleaved = r, ha(n, l);
  }
  function Nc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  function jv(n, r) {
    var l = n.updateQueue, o = n.alternate;
    if (o !== null && (o = o.updateQueue, l === o)) {
      var c = null, d = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var m = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          d === null ? c = d = m : d = d.next = m, l = l.next;
        } while (l !== null);
        d === null ? c = d = r : d = d.next = r;
      } else c = d = r;
      l = { baseState: o.baseState, firstBaseUpdate: c, lastBaseUpdate: d, shared: o.shared, effects: o.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function cs(n, r, l, o) {
    var c = n.updateQueue;
    ma = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, E = c.shared.pending;
    if (E !== null) {
      c.shared.pending = null;
      var T = E, F = T.next;
      T.next = null, m === null ? d = F : m.next = F, m = T;
      var J = n.alternate;
      J !== null && (J = J.updateQueue, E = J.lastBaseUpdate, E !== m && (E === null ? J.firstBaseUpdate = F : E.next = F, J.lastBaseUpdate = T));
    }
    if (d !== null) {
      var ne = c.baseState;
      m = 0, J = F = T = null, E = d;
      do {
        var X = E.lane, xe = E.eventTime;
        if ((o & X) === X) {
          J !== null && (J = J.next = {
            eventTime: xe,
            lane: 0,
            tag: E.tag,
            payload: E.payload,
            callback: E.callback,
            next: null
          });
          e: {
            var Me = n, je = E;
            switch (X = r, xe = l, je.tag) {
              case 1:
                if (Me = je.payload, typeof Me == "function") {
                  ne = Me.call(xe, ne, X);
                  break e;
                }
                ne = Me;
                break e;
              case 3:
                Me.flags = Me.flags & -65537 | 128;
              case 0:
                if (Me = je.payload, X = typeof Me == "function" ? Me.call(xe, ne, X) : Me, X == null) break e;
                ne = le({}, ne, X);
                break e;
              case 2:
                ma = !0;
            }
          }
          E.callback !== null && E.lane !== 0 && (n.flags |= 64, X = c.effects, X === null ? c.effects = [E] : X.push(E));
        } else xe = { eventTime: xe, lane: X, tag: E.tag, payload: E.payload, callback: E.callback, next: null }, J === null ? (F = J = xe, T = ne) : J = J.next = xe, m |= X;
        if (E = E.next, E === null) {
          if (E = c.shared.pending, E === null) break;
          X = E, E = X.next, X.next = null, c.lastBaseUpdate = X, c.shared.pending = null;
        }
      } while (!0);
      if (J === null && (T = ne), c.baseState = T, c.firstBaseUpdate = F, c.lastBaseUpdate = J, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Oi |= m, n.lanes = m, n.memoizedState = ne;
    }
  }
  function bd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(x(191, c));
        c.call(o);
      }
    }
  }
  var fs = {}, bi = Oa(fs), ds = Oa(fs), ps = Oa(fs);
  function Su(n) {
    if (n === fs) throw Error(x(174));
    return n;
  }
  function _d(n, r) {
    switch (Be(ps, r), Be(ds, n), Be(bi, fs), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : ca(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = ca(r, n);
    }
    on(bi), Be(bi, r);
  }
  function Eu() {
    on(bi), on(ds), on(ps);
  }
  function Fv(n) {
    Su(ps.current);
    var r = Su(bi.current), l = ca(r, n.type);
    r !== l && (Be(ds, n), Be(bi, l));
  }
  function Lc(n) {
    ds.current === n && (on(bi), on(ds));
  }
  var Sn = Oa(0);
  function Mc(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var l = r.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || l.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var vs = [];
  function Qe() {
    for (var n = 0; n < vs.length; n++) vs[n]._workInProgressVersionPrimary = null;
    vs.length = 0;
  }
  var Tt = Fe.ReactCurrentDispatcher, Ht = Fe.ReactCurrentBatchConfig, Zt = 0, Pt = null, Un = null, Zn = null, Ac = !1, hs = !1, Cu = 0, q = 0;
  function jt() {
    throw Error(x(321));
  }
  function tt(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ti(n[l], r[l])) return !1;
    return !0;
  }
  function Ml(n, r, l, o, c, d) {
    if (Zt = d, Pt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Tt.current = n === null || n.memoizedState === null ? qc : Cs, n = l(o, c), hs) {
      d = 0;
      do {
        if (hs = !1, Cu = 0, 25 <= d) throw Error(x(301));
        d += 1, Zn = Un = null, r.updateQueue = null, Tt.current = Kc, n = l(o, c);
      } while (hs);
    }
    if (Tt.current = bu, r = Un !== null && Un.next !== null, Zt = 0, Zn = Un = Pt = null, Ac = !1, r) throw Error(x(300));
    return n;
  }
  function ri() {
    var n = Cu !== 0;
    return Cu = 0, n;
  }
  function Tr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Zn === null ? Pt.memoizedState = Zn = n : Zn = Zn.next = n, Zn;
  }
  function bn() {
    if (Un === null) {
      var n = Pt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Un.next;
    var r = Zn === null ? Pt.memoizedState : Zn.next;
    if (r !== null) Zn = r, Un = n;
    else {
      if (n === null) throw Error(x(310));
      Un = n, n = { memoizedState: Un.memoizedState, baseState: Un.baseState, baseQueue: Un.baseQueue, queue: Un.queue, next: null }, Zn === null ? Pt.memoizedState = Zn = n : Zn = Zn.next = n;
    }
    return Zn;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Al(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(x(311));
    l.lastRenderedReducer = n;
    var o = Un, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var m = c.next;
        c.next = d.next, d.next = m;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var E = m = null, T = null, F = d;
      do {
        var J = F.lane;
        if ((Zt & J) === J) T !== null && (T = T.next = { lane: 0, action: F.action, hasEagerState: F.hasEagerState, eagerState: F.eagerState, next: null }), o = F.hasEagerState ? F.eagerState : n(o, F.action);
        else {
          var ne = {
            lane: J,
            action: F.action,
            hasEagerState: F.hasEagerState,
            eagerState: F.eagerState,
            next: null
          };
          T === null ? (E = T = ne, m = o) : T = T.next = ne, Pt.lanes |= J, Oi |= J;
        }
        F = F.next;
      } while (F !== null && F !== d);
      T === null ? m = o : T.next = E, ti(o, r.memoizedState) || (jn = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = T, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Pt.lanes |= d, Oi |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function Ru(n) {
    var r = bn(), l = r.queue;
    if (l === null) throw Error(x(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ti(d, r.memoizedState) || (jn = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function zc() {
  }
  function Uc(n, r) {
    var l = Pt, o = bn(), c = r(), d = !ti(o.memoizedState, c);
    if (d && (o.memoizedState = c, jn = !0), o = o.queue, ms(Hc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || Zn !== null && Zn.memoizedState.tag & 1) {
      if (l.flags |= 2048, Tu(9, Fc.bind(null, l, o, c, r), void 0, null), Gn === null) throw Error(x(349));
      Zt & 30 || jc(l, r, c);
    }
    return c;
  }
  function jc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Pt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Pt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Fc(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Pc(r) && Vc(n);
  }
  function Hc(n, r, l) {
    return l(function() {
      Pc(r) && Vc(n);
    });
  }
  function Pc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ti(n, l);
    } catch {
      return !0;
    }
  }
  function Vc(n) {
    var r = ha(n, 1);
    r !== null && zr(r, n, 1, -1);
  }
  function Bc(n) {
    var r = Tr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = xu.bind(null, Pt, n), [r.memoizedState, n];
  }
  function Tu(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = Pt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Pt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Ic() {
    return bn().memoizedState;
  }
  function yo(n, r, l, o) {
    var c = Tr();
    Pt.flags |= n, c.memoizedState = Tu(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function go(n, r, l, o) {
    var c = bn();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (Un !== null) {
      var m = Un.memoizedState;
      if (d = m.destroy, o !== null && tt(o, m.deps)) {
        c.memoizedState = Tu(r, l, d, o);
        return;
      }
    }
    Pt.flags |= n, c.memoizedState = Tu(1 | r, l, d, o);
  }
  function Yc(n, r) {
    return yo(8390656, 8, n, r);
  }
  function ms(n, r) {
    return go(2048, 8, n, r);
  }
  function $c(n, r) {
    return go(4, 2, n, r);
  }
  function ys(n, r) {
    return go(4, 4, n, r);
  }
  function wu(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Qc(n, r, l) {
    return l = l != null ? l.concat([n]) : null, go(4, 4, wu.bind(null, r, n), l);
  }
  function gs() {
  }
  function Wc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && tt(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Gc(n, r) {
    var l = bn();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && tt(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function kd(n, r, l) {
    return Zt & 21 ? (ti(l, r) || (l = Ku(), Pt.lanes |= l, Oi |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, jn = !0), n.memoizedState = l);
  }
  function Ss(n, r) {
    var l = Ft;
    Ft = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Ht.transition;
    Ht.transition = {};
    try {
      n(!1), r();
    } finally {
      Ft = l, Ht.transition = o;
    }
  }
  function Dd() {
    return bn().memoizedState;
  }
  function Es(n, r, l) {
    var o = Ni(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Zr(n)) Hv(r, l);
    else if (l = wd(n, r, l, o), l !== null) {
      var c = Pn();
      zr(l, n, o, c), nn(l, r, o);
    }
  }
  function xu(n, r, l) {
    var o = Ni(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Zr(n)) Hv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, E = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = E, ti(E, m)) {
          var T = r.interleaved;
          T === null ? (c.next = c, Td(r)) : (c.next = T.next, T.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = wd(n, r, c, o), l !== null && (c = Pn(), zr(l, n, o, c), nn(l, r, o));
    }
  }
  function Zr(n) {
    var r = n.alternate;
    return n === Pt || r !== null && r === Pt;
  }
  function Hv(n, r) {
    hs = Ac = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function nn(n, r, l) {
    if (l & 4194240) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  var bu = { readContext: Ma, useCallback: jt, useContext: jt, useEffect: jt, useImperativeHandle: jt, useInsertionEffect: jt, useLayoutEffect: jt, useMemo: jt, useReducer: jt, useRef: jt, useState: jt, useDebugValue: jt, useDeferredValue: jt, useTransition: jt, useMutableSource: jt, useSyncExternalStore: jt, useId: jt, unstable_isNewReconciler: !1 }, qc = { readContext: Ma, useCallback: function(n, r) {
    return Tr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ma, useEffect: Yc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, yo(
      4194308,
      4,
      wu.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return yo(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return yo(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Tr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = Tr();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Es.bind(null, Pt, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = Tr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Bc, useDebugValue: gs, useDeferredValue: function(n) {
    return Tr().memoizedState = n;
  }, useTransition: function() {
    var n = Bc(!1), r = n[0];
    return n = Ss.bind(null, n[1]), Tr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = Pt, c = Tr();
    if (pn) {
      if (l === void 0) throw Error(x(407));
      l = l();
    } else {
      if (l = r(), Gn === null) throw Error(x(349));
      Zt & 30 || jc(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Yc(Hc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, Tu(9, Fc.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Tr(), r = Gn.identifierPrefix;
    if (pn) {
      var l = xi, o = wi;
      l = (o & ~(1 << 32 - Dr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Cu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = q++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Cs = {
    readContext: Ma,
    useCallback: Wc,
    useContext: Ma,
    useEffect: ms,
    useImperativeHandle: Qc,
    useInsertionEffect: $c,
    useLayoutEffect: ys,
    useMemo: Gc,
    useReducer: Al,
    useRef: Ic,
    useState: function() {
      return Al(Xi);
    },
    useDebugValue: gs,
    useDeferredValue: function(n) {
      var r = bn();
      return kd(r, Un.memoizedState, n);
    },
    useTransition: function() {
      var n = Al(Xi)[0], r = bn().memoizedState;
      return [n, r];
    },
    useMutableSource: zc,
    useSyncExternalStore: Uc,
    useId: Dd,
    unstable_isNewReconciler: !1
  }, Kc = { readContext: Ma, useCallback: Wc, useContext: Ma, useEffect: ms, useImperativeHandle: Qc, useInsertionEffect: $c, useLayoutEffect: ys, useMemo: Gc, useReducer: Ru, useRef: Ic, useState: function() {
    return Ru(Xi);
  }, useDebugValue: gs, useDeferredValue: function(n) {
    var r = bn();
    return Un === null ? r.memoizedState = n : kd(r, Un.memoizedState, n);
  }, useTransition: function() {
    var n = Ru(Xi)[0], r = bn().memoizedState;
    return [n, r];
  }, useMutableSource: zc, useSyncExternalStore: Uc, useId: Dd, unstable_isNewReconciler: !1 };
  function ai(n, r) {
    if (n && n.defaultProps) {
      r = le({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Od(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : le({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Xc = { isMounted: function(n) {
    return (n = n._reactInternals) ? st(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Pn(), c = Ni(n), d = Ki(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (zr(r, n, c, o), Nc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Pn(), c = Ni(n), d = Ki(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (zr(r, n, c, o), Nc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Pn(), o = Ni(n), c = Ki(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ll(n, c, o), r !== null && (zr(r, n, o, l), Nc(r, n, o));
  } };
  function Pv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !es(l, o) || !es(c, d) : !0;
  }
  function Jc(n, r, l) {
    var o = !1, c = Rr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Ma(d) : (c = An(r) ? Gr : Cn.current, o = r.contextTypes, d = (o = o != null) ? qr(n, c) : Rr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Xc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Vv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && Xc.enqueueReplaceState(r, r.state, null);
  }
  function Rs(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, xd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Ma(d) : (d = An(r) ? Gr : Cn.current, c.context = qr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Od(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Xc.enqueueReplaceState(c, c.state, null), cs(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function _u(n, r) {
    try {
      var l = "", o = r;
      do
        l += Et(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function Nd(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Ld(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var Zc = typeof WeakMap == "function" ? WeakMap : Map;
  function Bv(n, r, l) {
    l = Ki(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      wo || (wo = !0, Ou = o), Ld(n, r);
    }, l;
  }
  function Md(n, r, l) {
    l = Ki(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        Ld(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Ld(n, r), typeof o != "function" && (jl === null ? jl = /* @__PURE__ */ new Set([this]) : jl.add(this));
      var m = r.stack;
      this.componentDidCatch(r.value, { componentStack: m !== null ? m : "" });
    }), l;
  }
  function Ad(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new Zc();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = Sy.bind(null, n, r, l), r.then(n, n));
  }
  function Iv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function zl(n, r, l, o, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ki(-1, 1), r.tag = 2, Ll(l, r, 1))), l.lanes |= 1), n);
  }
  var Ts = Fe.ReactCurrentOwner, jn = !1;
  function or(n, r, l, o) {
    r.child = n === null ? Se(r, null, l, o) : xn(r, n.child, l, o);
  }
  function ea(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return gn(r, c), o = Ml(n, r, l, o, d, c), l = ri(), n !== null && !jn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, za(n, r, c)) : (pn && l && _c(r), r.flags |= 1, or(n, r, o, c), r.child);
  }
  function ku(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !Gd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, dt(n, r, d, o, c)) : (n = Hs(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : es, l(m, o) && n.ref === r.ref) return za(n, r, c);
    }
    return r.flags |= 1, n = Hl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function dt(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (es(d, o) && n.ref === r.ref) if (jn = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) n.flags & 131072 && (jn = !0);
      else return r.lanes = n.lanes, za(n, r, c);
    }
    return Yv(n, r, l, o, c);
  }
  function ws(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Be(Co, ya), ya |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Be(Co, ya), ya |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, Be(Co, ya), ya |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, Be(Co, ya), ya |= o;
    return or(n, r, c, l), r.child;
  }
  function zd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Yv(n, r, l, o, c) {
    var d = An(l) ? Gr : Cn.current;
    return d = qr(r, d), gn(r, c), l = Ml(n, r, l, o, d, c), o = ri(), n !== null && !jn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, za(n, r, c)) : (pn && o && _c(r), r.flags |= 1, or(n, r, l, c), r.child);
  }
  function $v(n, r, l, o, c) {
    if (An(l)) {
      var d = !0;
      Jn(r);
    } else d = !1;
    if (gn(r, c), r.stateNode === null) Aa(n, r), Jc(r, l, o), Rs(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, E = r.memoizedProps;
      m.props = E;
      var T = m.context, F = l.contextType;
      typeof F == "object" && F !== null ? F = Ma(F) : (F = An(l) ? Gr : Cn.current, F = qr(r, F));
      var J = l.getDerivedStateFromProps, ne = typeof J == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      ne || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== o || T !== F) && Vv(r, m, o, F), ma = !1;
      var X = r.memoizedState;
      m.state = X, cs(r, o, m, c), T = r.memoizedState, E !== o || X !== T || Qn.current || ma ? (typeof J == "function" && (Od(r, l, J, o), T = r.memoizedState), (E = ma || Pv(r, l, E, o, X, T, F)) ? (ne || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = T), m.props = o, m.state = T, m.context = F, o = E) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, Uv(n, r), E = r.memoizedProps, F = r.type === r.elementType ? E : ai(r.type, E), m.props = F, ne = r.pendingProps, X = m.context, T = l.contextType, typeof T == "object" && T !== null ? T = Ma(T) : (T = An(l) ? Gr : Cn.current, T = qr(r, T));
      var xe = l.getDerivedStateFromProps;
      (J = typeof xe == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== ne || X !== T) && Vv(r, m, o, T), ma = !1, X = r.memoizedState, m.state = X, cs(r, o, m, c);
      var Me = r.memoizedState;
      E !== ne || X !== Me || Qn.current || ma ? (typeof xe == "function" && (Od(r, l, xe, o), Me = r.memoizedState), (F = ma || Pv(r, l, F, o, X, Me, T) || !1) ? (J || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, Me, T), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, Me, T)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && X === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && X === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = Me), m.props = o, m.state = Me, m.context = T, o = F) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && X === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && X === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return xs(n, r, l, o, d, c);
  }
  function xs(n, r, l, o, c, d) {
    zd(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && xc(r, l, !1), za(n, r, d);
    o = r.stateNode, Ts.current = r;
    var E = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = xn(r, n.child, null, d), r.child = xn(r, null, E, d)) : or(n, r, E, d), r.memoizedState = o.state, c && xc(r, l, !0), r.child;
  }
  function So(n) {
    var r = n.stateNode;
    r.pendingContext ? Lv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Lv(n, r.context, !1), _d(n, r.containerInfo);
  }
  function Qv(n, r, l, o, c) {
    return Nl(), qi(c), r.flags |= 256, or(n, r, l, o), r.child;
  }
  var ef = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ud(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function tf(n, r, l) {
    var o = r.pendingProps, c = Sn.current, d = !1, m = (r.flags & 128) !== 0, E;
    if ((E = m) || (E = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), E ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), Be(Sn, c & 1), n === null)
      return gd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, !(o & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Pl(m, o, 0, null), n = tl(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Ud(l), r.memoizedState = ef, n) : jd(r, m));
    if (c = n.memoizedState, c !== null && (E = c.dehydrated, E !== null)) return Wv(n, r, m, o, E, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, E = c.sibling;
      var T = { mode: "hidden", children: o.children };
      return !(m & 1) && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = T, r.deletions = null) : (o = Hl(c, T), o.subtreeFlags = c.subtreeFlags & 14680064), E !== null ? d = Hl(E, d) : (d = tl(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? Ud(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = ef, o;
    }
    return d = n.child, n = d.sibling, o = Hl(d, { mode: "visible", children: o.children }), !(r.mode & 1) && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function jd(n, r) {
    return r = Pl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function bs(n, r, l, o) {
    return o !== null && qi(o), xn(r, n.child, null, l), n = jd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Wv(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Nd(Error(x(422))), bs(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Pl({ mode: "visible", children: o.children }, c, 0, null), d = tl(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, r.mode & 1 && xn(r, n.child, null, m), r.child.memoizedState = Ud(m), r.memoizedState = ef, d);
    if (!(r.mode & 1)) return bs(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var E = o.dgst;
      return o = E, d = Error(x(419)), o = Nd(d, o, void 0), bs(n, r, m, o);
    }
    if (E = (m & n.childLanes) !== 0, jn || E) {
      if (o = Gn, o !== null) {
        switch (m & -m) {
          case 4:
            c = 2;
            break;
          case 16:
            c = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            c = 32;
            break;
          case 536870912:
            c = 268435456;
            break;
          default:
            c = 0;
        }
        c = c & (o.suspendedLanes | m) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, ha(n, c), zr(o, n, c, -1));
      }
      return Wd(), o = Nd(Error(x(421))), bs(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = Ey.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Xr = Ei(c.nextSibling), Kr = r, pn = !0, La = null, n !== null && (zn[Na++] = wi, zn[Na++] = xi, zn[Na++] = pa, wi = n.id, xi = n.overflow, pa = r), r = jd(r, o.children), r.flags |= 4096, r);
  }
  function Fd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), Rd(n.return, r, l);
  }
  function Lr(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function _i(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (or(n, r, o.children, l), o = Sn.current, o & 2) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Fd(n, l, r);
        else if (n.tag === 19) Fd(n, l, r);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === r) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === r) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      o &= 1;
    }
    if (Be(Sn, o), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Mc(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Lr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Mc(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        Lr(r, !0, l, null, d);
        break;
      case "together":
        Lr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Aa(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function za(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Oi |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(x(153));
    if (r.child !== null) {
      for (n = r.child, l = Hl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Hl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function _s(n, r, l) {
    switch (r.tag) {
      case 3:
        So(r), Nl();
        break;
      case 5:
        Fv(r);
        break;
      case 1:
        An(r.type) && Jn(r);
        break;
      case 4:
        _d(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        Be(va, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (Be(Sn, Sn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? tf(n, r, l) : (Be(Sn, Sn.current & 1), n = za(n, r, l), n !== null ? n.sibling : null);
        Be(Sn, Sn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, n.flags & 128) {
          if (o) return _i(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Be(Sn, Sn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, ws(n, r, l);
    }
    return za(n, r, l);
  }
  var Ua, Fn, Gv, qv;
  Ua = function(n, r) {
    for (var l = r.child; l !== null; ) {
      if (l.tag === 5 || l.tag === 6) n.appendChild(l.stateNode);
      else if (l.tag !== 4 && l.child !== null) {
        l.child.return = l, l = l.child;
        continue;
      }
      if (l === r) break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === r) return;
        l = l.return;
      }
      l.sibling.return = l.return, l = l.sibling;
    }
  }, Fn = function() {
  }, Gv = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, Su(bi.current);
      var d = null;
      switch (l) {
        case "input":
          c = rr(n, c), o = rr(n, o), d = [];
          break;
        case "select":
          c = le({}, c, { value: void 0 }), o = le({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Yn(n, c), o = Yn(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = xl);
      }
      sn(l, o);
      var m;
      l = null;
      for (F in c) if (!o.hasOwnProperty(F) && c.hasOwnProperty(F) && c[F] != null) if (F === "style") {
        var E = c[F];
        for (m in E) E.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else F !== "dangerouslySetInnerHTML" && F !== "children" && F !== "suppressContentEditableWarning" && F !== "suppressHydrationWarning" && F !== "autoFocus" && (ie.hasOwnProperty(F) ? d || (d = []) : (d = d || []).push(F, null));
      for (F in o) {
        var T = o[F];
        if (E = c != null ? c[F] : void 0, o.hasOwnProperty(F) && T !== E && (T != null || E != null)) if (F === "style") if (E) {
          for (m in E) !E.hasOwnProperty(m) || T && T.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in T) T.hasOwnProperty(m) && E[m] !== T[m] && (l || (l = {}), l[m] = T[m]);
        } else l || (d || (d = []), d.push(
          F,
          l
        )), l = T;
        else F === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, E = E ? E.__html : void 0, T != null && E !== T && (d = d || []).push(F, T)) : F === "children" ? typeof T != "string" && typeof T != "number" || (d = d || []).push(F, "" + T) : F !== "suppressContentEditableWarning" && F !== "suppressHydrationWarning" && (ie.hasOwnProperty(F) ? (T != null && F === "onScroll" && $t("scroll", n), d || E === T || (d = [])) : (d = d || []).push(F, T));
      }
      l && (d = d || []).push("style", l);
      var F = d;
      (r.updateQueue = F) && (r.flags |= 4);
    }
  }, qv = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function ks(n, r) {
    if (!pn) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var l = null; r !== null; ) r.alternate !== null && (l = r), r = r.sibling;
        l === null ? n.tail = null : l.sibling = null;
        break;
      case "collapsed":
        l = n.tail;
        for (var o = null; l !== null; ) l.alternate !== null && (o = l), l = l.sibling;
        o === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : o.sibling = null;
    }
  }
  function er(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, o = 0;
    if (r) for (var c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags & 14680064, o |= c.flags & 14680064, c.return = n, c = c.sibling;
    else for (c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags, o |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= o, n.childLanes = l, r;
  }
  function Kv(n, r, l) {
    var o = r.pendingProps;
    switch (kc(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return er(r), null;
      case 1:
        return An(r.type) && vo(), er(r), null;
      case 3:
        return o = r.stateNode, Eu(), on(Qn), on(Cn), Qe(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (Dc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, La !== null && (Nu(La), La = null))), Fn(n, r), er(r), null;
      case 5:
        Lc(r);
        var c = Su(ps.current);
        if (l = r.type, n !== null && r.stateNode != null) Gv(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(x(166));
            return er(r), null;
          }
          if (n = Su(bi.current), Dc(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ci] = r, o[ls] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                $t("cancel", o), $t("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                $t("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < rs.length; c++) $t(rs[c], o);
                break;
              case "source":
                $t("error", o);
                break;
              case "img":
              case "image":
              case "link":
                $t(
                  "error",
                  o
                ), $t("load", o);
                break;
              case "details":
                $t("toggle", o);
                break;
              case "input":
                Bn(o, d), $t("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, $t("invalid", o);
                break;
              case "textarea":
                Sr(o, d), $t("invalid", o);
            }
            sn(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var E = d[m];
              m === "children" ? typeof E == "string" ? o.textContent !== E && (d.suppressHydrationWarning !== !0 && Cc(o.textContent, E, n), c = ["children", E]) : typeof E == "number" && o.textContent !== "" + E && (d.suppressHydrationWarning !== !0 && Cc(
                o.textContent,
                E,
                n
              ), c = ["children", "" + E]) : ie.hasOwnProperty(m) && E != null && m === "onScroll" && $t("scroll", o);
            }
            switch (l) {
              case "input":
                Nn(o), ci(o, d, !0);
                break;
              case "textarea":
                Nn(o), Ln(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = xl);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Er(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ci] = r, n[ls] = o, Ua(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = Xn(l, o), l) {
                case "dialog":
                  $t("cancel", n), $t("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  $t("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < rs.length; c++) $t(rs[c], n);
                  c = o;
                  break;
                case "source":
                  $t("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  $t(
                    "error",
                    n
                  ), $t("load", n), c = o;
                  break;
                case "details":
                  $t("toggle", n), c = o;
                  break;
                case "input":
                  Bn(n, o), c = rr(n, o), $t("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = le({}, o, { value: void 0 }), $t("invalid", n);
                  break;
                case "textarea":
                  Sr(n, o), c = Yn(n, o), $t("invalid", n);
                  break;
                default:
                  c = o;
              }
              sn(l, c), E = c;
              for (d in E) if (E.hasOwnProperty(d)) {
                var T = E[d];
                d === "style" ? rn(n, T) : d === "dangerouslySetInnerHTML" ? (T = T ? T.__html : void 0, T != null && fi(n, T)) : d === "children" ? typeof T == "string" ? (l !== "textarea" || T !== "") && ve(n, T) : typeof T == "number" && ve(n, "" + T) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (ie.hasOwnProperty(d) ? T != null && d === "onScroll" && $t("scroll", n) : T != null && Re(n, d, T, m));
              }
              switch (l) {
                case "input":
                  Nn(n), ci(n, o, !1);
                  break;
                case "textarea":
                  Nn(n), Ln(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + yt(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? Tn(n, !!o.multiple, d, !1) : o.defaultValue != null && Tn(
                    n,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = xl);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = !0;
                  break e;
                default:
                  o = !1;
              }
            }
            o && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return er(r), null;
      case 6:
        if (n && r.stateNode != null) qv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(x(166));
          if (l = Su(ps.current), Su(bi.current), Dc(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[Ci] = r, (d = o.nodeValue !== l) && (n = Kr, n !== null)) switch (n.tag) {
              case 3:
                Cc(o.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Cc(o.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[Ci] = r, r.stateNode = o;
        }
        return er(r), null;
      case 13:
        if (on(Sn), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (pn && Xr !== null && r.mode & 1 && !(r.flags & 128)) ss(), Nl(), r.flags |= 98560, d = !1;
          else if (d = Dc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(x(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(x(317));
              d[Ci] = r;
            } else Nl(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            er(r), d = !1;
          } else La !== null && (Nu(La), La = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, r.mode & 1 && (n === null || Sn.current & 1 ? kn === 0 && (kn = 3) : Wd())), r.updateQueue !== null && (r.flags |= 4), er(r), null);
      case 4:
        return Eu(), Fn(n, r), n === null && oo(r.stateNode.containerInfo), er(r), null;
      case 10:
        return Cd(r.type._context), er(r), null;
      case 17:
        return An(r.type) && vo(), er(r), null;
      case 19:
        if (on(Sn), d = r.memoizedState, d === null) return er(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) ks(d, !1);
        else {
          if (kn !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (m = Mc(n), m !== null) {
              for (r.flags |= 128, ks(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return Be(Sn, Sn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && ct() > To && (r.flags |= 128, o = !0, ks(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Mc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), ks(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !pn) return er(r), null;
          } else 2 * ct() - d.renderingStartTime > To && l !== 1073741824 && (r.flags |= 128, o = !0, ks(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = ct(), r.sibling = null, l = Sn.current, Be(Sn, o ? l & 1 | 2 : l & 1), r) : (er(r), null);
      case 22:
      case 23:
        return Qd(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && r.mode & 1 ? ya & 1073741824 && (er(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : er(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(x(156, r.tag));
  }
  function nf(n, r) {
    switch (kc(r), r.tag) {
      case 1:
        return An(r.type) && vo(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Eu(), on(Qn), on(Cn), Qe(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Lc(r), null;
      case 13:
        if (on(Sn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(x(340));
          Nl();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return on(Sn), null;
      case 4:
        return Eu(), null;
      case 10:
        return Cd(r.type._context), null;
      case 22:
      case 23:
        return Qd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ds = !1, wr = !1, py = typeof WeakSet == "function" ? WeakSet : Set, Oe = null;
  function Eo(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      vn(n, r, o);
    }
    else l.current = null;
  }
  function rf(n, r, l) {
    try {
      l();
    } catch (o) {
      vn(n, r, o);
    }
  }
  var Xv = !1;
  function Jv(n, r) {
    if (is = _a, n = ts(), pc(n)) {
      if ("selectionStart" in n) var l = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        l = (l = n.ownerDocument) && l.defaultView || window;
        var o = l.getSelection && l.getSelection();
        if (o && o.rangeCount !== 0) {
          l = o.anchorNode;
          var c = o.anchorOffset, d = o.focusNode;
          o = o.focusOffset;
          try {
            l.nodeType, d.nodeType;
          } catch {
            l = null;
            break e;
          }
          var m = 0, E = -1, T = -1, F = 0, J = 0, ne = n, X = null;
          t: for (; ; ) {
            for (var xe; ne !== l || c !== 0 && ne.nodeType !== 3 || (E = m + c), ne !== d || o !== 0 && ne.nodeType !== 3 || (T = m + o), ne.nodeType === 3 && (m += ne.nodeValue.length), (xe = ne.firstChild) !== null; )
              X = ne, ne = xe;
            for (; ; ) {
              if (ne === n) break t;
              if (X === l && ++F === c && (E = m), X === d && ++J === o && (T = m), (xe = ne.nextSibling) !== null) break;
              ne = X, X = ne.parentNode;
            }
            ne = xe;
          }
          l = E === -1 || T === -1 ? null : { start: E, end: T };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (pu = { focusedElem: n, selectionRange: l }, _a = !1, Oe = r; Oe !== null; ) if (r = Oe, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Oe = n;
    else for (; Oe !== null; ) {
      r = Oe;
      try {
        var Me = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Me !== null) {
              var je = Me.memoizedProps, Dn = Me.memoizedState, L = r.stateNode, _ = L.getSnapshotBeforeUpdate(r.elementType === r.type ? je : ai(r.type, je), Dn);
              L.__reactInternalSnapshotBeforeUpdate = _;
            }
            break;
          case 3:
            var z = r.stateNode.containerInfo;
            z.nodeType === 1 ? z.textContent = "" : z.nodeType === 9 && z.documentElement && z.removeChild(z.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(x(163));
        }
      } catch (Z) {
        vn(r, r.return, Z);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Oe = n;
        break;
      }
      Oe = r.return;
    }
    return Me = Xv, Xv = !1, Me;
  }
  function Os(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && rf(r, l, d);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function Ns(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var o = l.create;
          l.destroy = o();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Hd(n) {
    var r = n.ref;
    if (r !== null) {
      var l = n.stateNode;
      switch (n.tag) {
        case 5:
          n = l;
          break;
        default:
          n = l;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function af(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, af(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ci], delete r[ls], delete r[us], delete r[po], delete r[fy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ls(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Ji(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Ls(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function ki(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = xl));
    else if (o !== 4 && (n = n.child, n !== null)) for (ki(n, r, l), n = n.sibling; n !== null; ) ki(n, r, l), n = n.sibling;
  }
  function Di(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (Di(n, r, l), n = n.sibling; n !== null; ) Di(n, r, l), n = n.sibling;
  }
  var _n = null, Mr = !1;
  function Ar(n, r, l) {
    for (l = l.child; l !== null; ) Zv(n, r, l), l = l.sibling;
  }
  function Zv(n, r, l) {
    if (Qr && typeof Qr.onCommitFiberUnmount == "function") try {
      Qr.onCommitFiberUnmount(ml, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        wr || Eo(l, r);
      case 6:
        var o = _n, c = Mr;
        _n = null, Ar(n, r, l), _n = o, Mr = c, _n !== null && (Mr ? (n = _n, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : _n.removeChild(l.stateNode));
        break;
      case 18:
        _n !== null && (Mr ? (n = _n, l = l.stateNode, n.nodeType === 8 ? fo(n.parentNode, l) : n.nodeType === 1 && fo(n, l), Za(n)) : fo(_n, l.stateNode));
        break;
      case 4:
        o = _n, c = Mr, _n = l.stateNode.containerInfo, Mr = !0, Ar(n, r, l), _n = o, Mr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!wr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && (d & 2 || d & 4) && rf(l, r, m), c = c.next;
          } while (c !== o);
        }
        Ar(n, r, l);
        break;
      case 1:
        if (!wr && (Eo(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (E) {
          vn(l, r, E);
        }
        Ar(n, r, l);
        break;
      case 21:
        Ar(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (wr = (o = wr) || l.memoizedState !== null, Ar(n, r, l), wr = o) : Ar(n, r, l);
        break;
      default:
        Ar(n, r, l);
    }
  }
  function eh(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new py()), r.forEach(function(o) {
        var c = sh.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function ii(n, r) {
    var l = r.deletions;
    if (l !== null) for (var o = 0; o < l.length; o++) {
      var c = l[o];
      try {
        var d = n, m = r, E = m;
        e: for (; E !== null; ) {
          switch (E.tag) {
            case 5:
              _n = E.stateNode, Mr = !1;
              break e;
            case 3:
              _n = E.stateNode.containerInfo, Mr = !0;
              break e;
            case 4:
              _n = E.stateNode.containerInfo, Mr = !0;
              break e;
          }
          E = E.return;
        }
        if (_n === null) throw Error(x(160));
        Zv(d, m, c), _n = null, Mr = !1;
        var T = c.alternate;
        T !== null && (T.return = null), c.return = null;
      } catch (F) {
        vn(c, r, F);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Pd(r, n), r = r.sibling;
  }
  function Pd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ii(r, n), ta(n), o & 4) {
          try {
            Os(3, n, n.return), Ns(3, n);
          } catch (je) {
            vn(n, n.return, je);
          }
          try {
            Os(5, n, n.return);
          } catch (je) {
            vn(n, n.return, je);
          }
        }
        break;
      case 1:
        ii(r, n), ta(n), o & 512 && l !== null && Eo(l, l.return);
        break;
      case 5:
        if (ii(r, n), ta(n), o & 512 && l !== null && Eo(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            ve(c, "");
          } catch (je) {
            vn(n, n.return, je);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, E = n.type, T = n.updateQueue;
          if (n.updateQueue = null, T !== null) try {
            E === "input" && d.type === "radio" && d.name != null && In(c, d), Xn(E, m);
            var F = Xn(E, d);
            for (m = 0; m < T.length; m += 2) {
              var J = T[m], ne = T[m + 1];
              J === "style" ? rn(c, ne) : J === "dangerouslySetInnerHTML" ? fi(c, ne) : J === "children" ? ve(c, ne) : Re(c, J, ne, F);
            }
            switch (E) {
              case "input":
                $r(c, d);
                break;
              case "textarea":
                $a(c, d);
                break;
              case "select":
                var X = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var xe = d.value;
                xe != null ? Tn(c, !!d.multiple, xe, !1) : X !== !!d.multiple && (d.defaultValue != null ? Tn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : Tn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[ls] = d;
          } catch (je) {
            vn(n, n.return, je);
          }
        }
        break;
      case 6:
        if (ii(r, n), ta(n), o & 4) {
          if (n.stateNode === null) throw Error(x(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (je) {
            vn(n, n.return, je);
          }
        }
        break;
      case 3:
        if (ii(r, n), ta(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Za(r.containerInfo);
        } catch (je) {
          vn(n, n.return, je);
        }
        break;
      case 4:
        ii(r, n), ta(n);
        break;
      case 13:
        ii(r, n), ta(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Id = ct())), o & 4 && eh(n);
        break;
      case 22:
        if (J = l !== null && l.memoizedState !== null, n.mode & 1 ? (wr = (F = wr) || J, ii(r, n), wr = F) : ii(r, n), ta(n), o & 8192) {
          if (F = n.memoizedState !== null, (n.stateNode.isHidden = F) && !J && n.mode & 1) for (Oe = n, J = n.child; J !== null; ) {
            for (ne = Oe = J; Oe !== null; ) {
              switch (X = Oe, xe = X.child, X.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, X, X.return);
                  break;
                case 1:
                  Eo(X, X.return);
                  var Me = X.stateNode;
                  if (typeof Me.componentWillUnmount == "function") {
                    o = X, l = X.return;
                    try {
                      r = o, Me.props = r.memoizedProps, Me.state = r.memoizedState, Me.componentWillUnmount();
                    } catch (je) {
                      vn(o, l, je);
                    }
                  }
                  break;
                case 5:
                  Eo(X, X.return);
                  break;
                case 22:
                  if (X.memoizedState !== null) {
                    Ms(ne);
                    continue;
                  }
              }
              xe !== null ? (xe.return = X, Oe = xe) : Ms(ne);
            }
            J = J.sibling;
          }
          e: for (J = null, ne = n; ; ) {
            if (ne.tag === 5) {
              if (J === null) {
                J = ne;
                try {
                  c = ne.stateNode, F ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (E = ne.stateNode, T = ne.memoizedProps.style, m = T != null && T.hasOwnProperty("display") ? T.display : null, E.style.display = Yt("display", m));
                } catch (je) {
                  vn(n, n.return, je);
                }
              }
            } else if (ne.tag === 6) {
              if (J === null) try {
                ne.stateNode.nodeValue = F ? "" : ne.memoizedProps;
              } catch (je) {
                vn(n, n.return, je);
              }
            } else if ((ne.tag !== 22 && ne.tag !== 23 || ne.memoizedState === null || ne === n) && ne.child !== null) {
              ne.child.return = ne, ne = ne.child;
              continue;
            }
            if (ne === n) break e;
            for (; ne.sibling === null; ) {
              if (ne.return === null || ne.return === n) break e;
              J === ne && (J = null), ne = ne.return;
            }
            J === ne && (J = null), ne.sibling.return = ne.return, ne = ne.sibling;
          }
        }
        break;
      case 19:
        ii(r, n), ta(n), o & 4 && eh(n);
        break;
      case 21:
        break;
      default:
        ii(
          r,
          n
        ), ta(n);
    }
  }
  function ta(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (Ls(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(x(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (ve(c, ""), o.flags &= -33);
            var d = Ji(n);
            Di(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, E = Ji(n);
            ki(n, E, m);
            break;
          default:
            throw Error(x(161));
        }
      } catch (T) {
        vn(n, n.return, T);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function vy(n, r, l) {
    Oe = n, Vd(n);
  }
  function Vd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; Oe !== null; ) {
      var c = Oe, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || Ds;
        if (!m) {
          var E = c.alternate, T = E !== null && E.memoizedState !== null || wr;
          E = Ds;
          var F = wr;
          if (Ds = m, (wr = T) && !F) for (Oe = c; Oe !== null; ) m = Oe, T = m.child, m.tag === 22 && m.memoizedState !== null ? Bd(c) : T !== null ? (T.return = m, Oe = T) : Bd(c);
          for (; d !== null; ) Oe = d, Vd(d), d = d.sibling;
          Oe = c, Ds = E, wr = F;
        }
        th(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, Oe = d) : th(n);
    }
  }
  function th(n) {
    for (; Oe !== null; ) {
      var r = Oe;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              wr || Ns(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !wr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ai(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && bd(r, d, o);
              break;
            case 3:
              var m = r.updateQueue;
              if (m !== null) {
                if (l = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    l = r.child.stateNode;
                    break;
                  case 1:
                    l = r.child.stateNode;
                }
                bd(r, m, l);
              }
              break;
            case 5:
              var E = r.stateNode;
              if (l === null && r.flags & 4) {
                l = E;
                var T = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    T.autoFocus && l.focus();
                    break;
                  case "img":
                    T.src && (l.src = T.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (r.memoizedState === null) {
                var F = r.alternate;
                if (F !== null) {
                  var J = F.memoizedState;
                  if (J !== null) {
                    var ne = J.dehydrated;
                    ne !== null && Za(ne);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(x(163));
          }
          wr || r.flags & 512 && Hd(r);
        } catch (X) {
          vn(r, r.return, X);
        }
      }
      if (r === n) {
        Oe = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Oe = l;
        break;
      }
      Oe = r.return;
    }
  }
  function Ms(n) {
    for (; Oe !== null; ) {
      var r = Oe;
      if (r === n) {
        Oe = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Oe = l;
        break;
      }
      Oe = r.return;
    }
  }
  function Bd(n) {
    for (; Oe !== null; ) {
      var r = Oe;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ns(4, r);
            } catch (T) {
              vn(r, l, T);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (T) {
                vn(r, c, T);
              }
            }
            var d = r.return;
            try {
              Hd(r);
            } catch (T) {
              vn(r, d, T);
            }
            break;
          case 5:
            var m = r.return;
            try {
              Hd(r);
            } catch (T) {
              vn(r, m, T);
            }
        }
      } catch (T) {
        vn(r, r.return, T);
      }
      if (r === n) {
        Oe = null;
        break;
      }
      var E = r.sibling;
      if (E !== null) {
        E.return = r.return, Oe = E;
        break;
      }
      Oe = r.return;
    }
  }
  var hy = Math.ceil, Ul = Fe.ReactCurrentDispatcher, Du = Fe.ReactCurrentOwner, sr = Fe.ReactCurrentBatchConfig, Ot = 0, Gn = null, Hn = null, cr = 0, ya = 0, Co = Oa(0), kn = 0, As = null, Oi = 0, Ro = 0, lf = 0, zs = null, na = null, Id = 0, To = 1 / 0, ga = null, wo = !1, Ou = null, jl = null, uf = !1, Zi = null, Us = 0, Fl = 0, xo = null, js = -1, xr = 0;
  function Pn() {
    return Ot & 6 ? ct() : js !== -1 ? js : js = ct();
  }
  function Ni(n) {
    return n.mode & 1 ? Ot & 2 && cr !== 0 ? cr & -cr : dy.transition !== null ? (xr === 0 && (xr = Ku()), xr) : (n = Ft, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ro(n.type)), n) : 1;
  }
  function zr(n, r, l, o) {
    if (50 < Fl) throw Fl = 0, xo = null, Error(x(185));
    Pi(n, l, o), (!(Ot & 2) || n !== Gn) && (n === Gn && (!(Ot & 2) && (Ro |= l), kn === 4 && li(n, cr)), ra(n, o), l === 1 && Ot === 0 && !(r.mode & 1) && (To = ct() + 500, ho && Ti()));
  }
  function ra(n, r) {
    var l = n.callbackNode;
    au(n, r);
    var o = Ja(n, n === Gn ? cr : 0);
    if (o === 0) l !== null && ir(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && ir(l), r === 1) n.tag === 0 ? _l(Yd.bind(null, n)) : bc(Yd.bind(null, n)), co(function() {
        !(Ot & 6) && Ti();
      }), l = null;
      else {
        switch (Ju(o)) {
          case 1:
            l = Ka;
            break;
          case 4:
            l = nu;
            break;
          case 16:
            l = ru;
            break;
          case 536870912:
            l = Wu;
            break;
          default:
            l = ru;
        }
        l = fh(l, of.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function of(n, r) {
    if (js = -1, xr = 0, Ot & 6) throw Error(x(327));
    var l = n.callbackNode;
    if (bo() && n.callbackNode !== l) return null;
    var o = Ja(n, n === Gn ? cr : 0);
    if (o === 0) return null;
    if (o & 30 || o & n.expiredLanes || r) r = sf(n, o);
    else {
      r = o;
      var c = Ot;
      Ot |= 2;
      var d = rh();
      (Gn !== n || cr !== r) && (ga = null, To = ct() + 500, el(n, r));
      do
        try {
          ah();
          break;
        } catch (E) {
          nh(n, E);
        }
      while (!0);
      Ed(), Ul.current = d, Ot = c, Hn !== null ? r = 0 : (Gn = null, cr = 0, r = kn);
    }
    if (r !== 0) {
      if (r === 2 && (c = gl(n), c !== 0 && (o = c, r = Fs(n, c))), r === 1) throw l = As, el(n, 0), li(n, o), ra(n, ct()), l;
      if (r === 6) li(n, o);
      else {
        if (c = n.current.alternate, !(o & 30) && !my(c) && (r = sf(n, o), r === 2 && (d = gl(n), d !== 0 && (o = d, r = Fs(n, d))), r === 1)) throw l = As, el(n, 0), li(n, o), ra(n, ct()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(x(345));
          case 2:
            Mu(n, na, ga);
            break;
          case 3:
            if (li(n, o), (o & 130023424) === o && (r = Id + 500 - ct(), 10 < r)) {
              if (Ja(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Pn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Tc(Mu.bind(null, n, na, ga), r);
              break;
            }
            Mu(n, na, ga);
            break;
          case 4:
            if (li(n, o), (o & 4194240) === o) break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - Dr(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = ct() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * hy(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = Tc(Mu.bind(null, n, na, ga), o);
              break;
            }
            Mu(n, na, ga);
            break;
          case 5:
            Mu(n, na, ga);
            break;
          default:
            throw Error(x(329));
        }
      }
    }
    return ra(n, ct()), n.callbackNode === l ? of.bind(null, n) : null;
  }
  function Fs(n, r) {
    var l = zs;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = sf(n, r), n !== 2 && (r = na, na = l, r !== null && Nu(r)), n;
  }
  function Nu(n) {
    na === null ? na = n : na.push.apply(na, n);
  }
  function my(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var o = 0; o < l.length; o++) {
          var c = l[o], d = c.getSnapshot;
          c = c.value;
          try {
            if (!ti(d(), c)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (l = r.child, r.subtreeFlags & 16384 && l !== null) l.return = r, r = l;
      else {
        if (r === n) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function li(n, r) {
    for (r &= ~lf, r &= ~Ro, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Dr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Yd(n) {
    if (Ot & 6) throw Error(x(327));
    bo();
    var r = Ja(n, 0);
    if (!(r & 1)) return ra(n, ct()), null;
    var l = sf(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = gl(n);
      o !== 0 && (r = o, l = Fs(n, o));
    }
    if (l === 1) throw l = As, el(n, 0), li(n, r), ra(n, ct()), l;
    if (l === 6) throw Error(x(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Mu(n, na, ga), ra(n, ct()), null;
  }
  function $d(n, r) {
    var l = Ot;
    Ot |= 1;
    try {
      return n(r);
    } finally {
      Ot = l, Ot === 0 && (To = ct() + 500, ho && Ti());
    }
  }
  function Lu(n) {
    Zi !== null && Zi.tag === 0 && !(Ot & 6) && bo();
    var r = Ot;
    Ot |= 1;
    var l = sr.transition, o = Ft;
    try {
      if (sr.transition = null, Ft = 1, n) return n();
    } finally {
      Ft = o, sr.transition = l, Ot = r, !(Ot & 6) && Ti();
    }
  }
  function Qd() {
    ya = Co.current, on(Co);
  }
  function el(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, hd(l)), Hn !== null) for (l = Hn.return; l !== null; ) {
      var o = l;
      switch (kc(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && vo();
          break;
        case 3:
          Eu(), on(Qn), on(Cn), Qe();
          break;
        case 5:
          Lc(o);
          break;
        case 4:
          Eu();
          break;
        case 13:
          on(Sn);
          break;
        case 19:
          on(Sn);
          break;
        case 10:
          Cd(o.type._context);
          break;
        case 22:
        case 23:
          Qd();
      }
      l = l.return;
    }
    if (Gn = n, Hn = n = Hl(n.current, null), cr = ya = r, kn = 0, As = null, lf = Ro = Oi = 0, na = zs = null, gu !== null) {
      for (r = 0; r < gu.length; r++) if (l = gu[r], o = l.interleaved, o !== null) {
        l.interleaved = null;
        var c = o.next, d = l.pending;
        if (d !== null) {
          var m = d.next;
          d.next = c, o.next = m;
        }
        l.pending = o;
      }
      gu = null;
    }
    return n;
  }
  function nh(n, r) {
    do {
      var l = Hn;
      try {
        if (Ed(), Tt.current = bu, Ac) {
          for (var o = Pt.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          Ac = !1;
        }
        if (Zt = 0, Zn = Un = Pt = null, hs = !1, Cu = 0, Du.current = null, l === null || l.return === null) {
          kn = 1, As = r, Hn = null;
          break;
        }
        e: {
          var d = n, m = l.return, E = l, T = r;
          if (r = cr, E.flags |= 32768, T !== null && typeof T == "object" && typeof T.then == "function") {
            var F = T, J = E, ne = J.tag;
            if (!(J.mode & 1) && (ne === 0 || ne === 11 || ne === 15)) {
              var X = J.alternate;
              X ? (J.updateQueue = X.updateQueue, J.memoizedState = X.memoizedState, J.lanes = X.lanes) : (J.updateQueue = null, J.memoizedState = null);
            }
            var xe = Iv(m);
            if (xe !== null) {
              xe.flags &= -257, zl(xe, m, E, d, r), xe.mode & 1 && Ad(d, F, r), r = xe, T = F;
              var Me = r.updateQueue;
              if (Me === null) {
                var je = /* @__PURE__ */ new Set();
                je.add(T), r.updateQueue = je;
              } else Me.add(T);
              break e;
            } else {
              if (!(r & 1)) {
                Ad(d, F, r), Wd();
                break e;
              }
              T = Error(x(426));
            }
          } else if (pn && E.mode & 1) {
            var Dn = Iv(m);
            if (Dn !== null) {
              !(Dn.flags & 65536) && (Dn.flags |= 256), zl(Dn, m, E, d, r), qi(_u(T, E));
              break e;
            }
          }
          d = T = _u(T, E), kn !== 4 && (kn = 2), zs === null ? zs = [d] : zs.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var L = Bv(d, T, r);
                jv(d, L);
                break e;
              case 1:
                E = T;
                var _ = d.type, z = d.stateNode;
                if (!(d.flags & 128) && (typeof _.getDerivedStateFromError == "function" || z !== null && typeof z.componentDidCatch == "function" && (jl === null || !jl.has(z)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var Z = Md(d, E, r);
                  jv(d, Z);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        lh(l);
      } catch (Ae) {
        r = Ae, Hn === l && l !== null && (Hn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function rh() {
    var n = Ul.current;
    return Ul.current = bu, n === null ? bu : n;
  }
  function Wd() {
    (kn === 0 || kn === 3 || kn === 2) && (kn = 4), Gn === null || !(Oi & 268435455) && !(Ro & 268435455) || li(Gn, cr);
  }
  function sf(n, r) {
    var l = Ot;
    Ot |= 2;
    var o = rh();
    (Gn !== n || cr !== r) && (ga = null, el(n, r));
    do
      try {
        yy();
        break;
      } catch (c) {
        nh(n, c);
      }
    while (!0);
    if (Ed(), Ot = l, Ul.current = o, Hn !== null) throw Error(x(261));
    return Gn = null, cr = 0, kn;
  }
  function yy() {
    for (; Hn !== null; ) ih(Hn);
  }
  function ah() {
    for (; Hn !== null && !Ga(); ) ih(Hn);
  }
  function ih(n) {
    var r = ch(n.alternate, n, ya);
    n.memoizedProps = n.pendingProps, r === null ? lh(n) : Hn = r, Du.current = null;
  }
  function lh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = nf(l, r), l !== null) {
          l.flags &= 32767, Hn = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          kn = 6, Hn = null;
          return;
        }
      } else if (l = Kv(l, r, ya), l !== null) {
        Hn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        Hn = r;
        return;
      }
      Hn = r = n;
    } while (r !== null);
    kn === 0 && (kn = 5);
  }
  function Mu(n, r, l) {
    var o = Ft, c = sr.transition;
    try {
      sr.transition = null, Ft = 1, gy(n, r, l, o);
    } finally {
      sr.transition = c, Ft = o;
    }
    return null;
  }
  function gy(n, r, l, o) {
    do
      bo();
    while (Zi !== null);
    if (Ot & 6) throw Error(x(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(x(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (Gf(n, d), n === Gn && (Hn = Gn = null, cr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || uf || (uf = !0, fh(ru, function() {
      return bo(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = sr.transition, sr.transition = null;
      var m = Ft;
      Ft = 1;
      var E = Ot;
      Ot |= 4, Du.current = null, Jv(n, l), Pd(l, n), lo(pu), _a = !!is, pu = is = null, n.current = l, vy(l), qa(), Ot = E, Ft = m, sr.transition = d;
    } else n.current = l;
    if (uf && (uf = !1, Zi = n, Us = c), d = n.pendingLanes, d === 0 && (jl = null), $o(l.stateNode), ra(n, ct()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (wo) throw wo = !1, n = Ou, Ou = null, n;
    return Us & 1 && n.tag !== 0 && bo(), d = n.pendingLanes, d & 1 ? n === xo ? Fl++ : (Fl = 0, xo = n) : Fl = 0, Ti(), null;
  }
  function bo() {
    if (Zi !== null) {
      var n = Ju(Us), r = sr.transition, l = Ft;
      try {
        if (sr.transition = null, Ft = 16 > n ? 16 : n, Zi === null) var o = !1;
        else {
          if (n = Zi, Zi = null, Us = 0, Ot & 6) throw Error(x(331));
          var c = Ot;
          for (Ot |= 4, Oe = n.current; Oe !== null; ) {
            var d = Oe, m = d.child;
            if (Oe.flags & 16) {
              var E = d.deletions;
              if (E !== null) {
                for (var T = 0; T < E.length; T++) {
                  var F = E[T];
                  for (Oe = F; Oe !== null; ) {
                    var J = Oe;
                    switch (J.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, J, d);
                    }
                    var ne = J.child;
                    if (ne !== null) ne.return = J, Oe = ne;
                    else for (; Oe !== null; ) {
                      J = Oe;
                      var X = J.sibling, xe = J.return;
                      if (af(J), J === F) {
                        Oe = null;
                        break;
                      }
                      if (X !== null) {
                        X.return = xe, Oe = X;
                        break;
                      }
                      Oe = xe;
                    }
                  }
                }
                var Me = d.alternate;
                if (Me !== null) {
                  var je = Me.child;
                  if (je !== null) {
                    Me.child = null;
                    do {
                      var Dn = je.sibling;
                      je.sibling = null, je = Dn;
                    } while (je !== null);
                  }
                }
                Oe = d;
              }
            }
            if (d.subtreeFlags & 2064 && m !== null) m.return = d, Oe = m;
            else e: for (; Oe !== null; ) {
              if (d = Oe, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, d, d.return);
              }
              var L = d.sibling;
              if (L !== null) {
                L.return = d.return, Oe = L;
                break e;
              }
              Oe = d.return;
            }
          }
          var _ = n.current;
          for (Oe = _; Oe !== null; ) {
            m = Oe;
            var z = m.child;
            if (m.subtreeFlags & 2064 && z !== null) z.return = m, Oe = z;
            else e: for (m = _; Oe !== null; ) {
              if (E = Oe, E.flags & 2048) try {
                switch (E.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ns(9, E);
                }
              } catch (Ae) {
                vn(E, E.return, Ae);
              }
              if (E === m) {
                Oe = null;
                break e;
              }
              var Z = E.sibling;
              if (Z !== null) {
                Z.return = E.return, Oe = Z;
                break e;
              }
              Oe = E.return;
            }
          }
          if (Ot = c, Ti(), Qr && typeof Qr.onPostCommitFiberRoot == "function") try {
            Qr.onPostCommitFiberRoot(ml, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Ft = l, sr.transition = r;
      }
    }
    return !1;
  }
  function uh(n, r, l) {
    r = _u(l, r), r = Bv(n, r, 1), n = Ll(n, r, 1), r = Pn(), n !== null && (Pi(n, 1, r), ra(n, r));
  }
  function vn(n, r, l) {
    if (n.tag === 3) uh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        uh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (jl === null || !jl.has(o))) {
          n = _u(l, n), n = Md(r, n, 1), r = Ll(r, n, 1), n = Pn(), r !== null && (Pi(r, 1, n), ra(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function Sy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Pn(), n.pingedLanes |= n.suspendedLanes & l, Gn === n && (cr & l) === l && (kn === 4 || kn === 3 && (cr & 130023424) === cr && 500 > ct() - Id ? el(n, 0) : lf |= l), ra(n, r);
  }
  function oh(n, r) {
    r === 0 && (n.mode & 1 ? (r = da, da <<= 1, !(da & 130023424) && (da = 4194304)) : r = 1);
    var l = Pn();
    n = ha(n, r), n !== null && (Pi(n, r, l), ra(n, l));
  }
  function Ey(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), oh(n, l);
  }
  function sh(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var o = n.stateNode, c = n.memoizedState;
        c !== null && (l = c.retryLane);
        break;
      case 19:
        o = n.stateNode;
        break;
      default:
        throw Error(x(314));
    }
    o !== null && o.delete(r), oh(n, l);
  }
  var ch;
  ch = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Qn.current) jn = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return jn = !1, _s(n, r, l);
      jn = !!(n.flags & 131072);
    }
    else jn = !1, pn && r.flags & 1048576 && Mv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        Aa(n, r), n = r.pendingProps;
        var c = qr(r, Cn.current);
        gn(r, l), c = Ml(null, r, o, n, c, l);
        var d = ri();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, An(o) ? (d = !0, Jn(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, xd(r), c.updater = Xc, r.stateNode = c, c._reactInternals = r, Rs(r, o, n, l), r = xs(null, r, o, !0, d, l)) : (r.tag = 0, pn && d && _c(r), or(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (Aa(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = Ry(o), n = ai(o, n), c) {
            case 0:
              r = Yv(null, r, o, n, l);
              break e;
            case 1:
              r = $v(null, r, o, n, l);
              break e;
            case 11:
              r = ea(null, r, o, n, l);
              break e;
            case 14:
              r = ku(null, r, o, ai(o.type, n), l);
              break e;
          }
          throw Error(x(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Yv(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), $v(n, r, o, c, l);
      case 3:
        e: {
          if (So(r), n === null) throw Error(x(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, Uv(n, r), cs(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = _u(Error(x(423)), r), r = Qv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = _u(Error(x(424)), r), r = Qv(n, r, o, l, c);
            break e;
          } else for (Xr = Ei(r.stateNode.containerInfo.firstChild), Kr = r, pn = !0, La = null, l = Se(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Nl(), o === c) {
              r = za(n, r, l);
              break e;
            }
            or(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Fv(r), n === null && gd(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, Rc(o, c) ? m = null : d !== null && Rc(o, d) && (r.flags |= 32), zd(n, r), or(n, r, m, l), r.child;
      case 6:
        return n === null && gd(r), null;
      case 13:
        return tf(n, r, l);
      case 4:
        return _d(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = xn(r, null, o, l) : or(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), ea(n, r, o, c, l);
      case 7:
        return or(n, r, r.pendingProps, l), r.child;
      case 8:
        return or(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return or(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, Be(va, o._currentValue), o._currentValue = m, d !== null) if (ti(d.value, m)) {
            if (d.children === c.children && !Qn.current) {
              r = za(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var E = d.dependencies;
            if (E !== null) {
              m = d.child;
              for (var T = E.firstContext; T !== null; ) {
                if (T.context === o) {
                  if (d.tag === 1) {
                    T = Ki(-1, l & -l), T.tag = 2;
                    var F = d.updateQueue;
                    if (F !== null) {
                      F = F.shared;
                      var J = F.pending;
                      J === null ? T.next = T : (T.next = J.next, J.next = T), F.pending = T;
                    }
                  }
                  d.lanes |= l, T = d.alternate, T !== null && (T.lanes |= l), Rd(
                    d.return,
                    l,
                    r
                  ), E.lanes |= l;
                  break;
                }
                T = T.next;
              }
            } else if (d.tag === 10) m = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (m = d.return, m === null) throw Error(x(341));
              m.lanes |= l, E = m.alternate, E !== null && (E.lanes |= l), Rd(m, l, r), m = d.sibling;
            } else m = d.child;
            if (m !== null) m.return = d;
            else for (m = d; m !== null; ) {
              if (m === r) {
                m = null;
                break;
              }
              if (d = m.sibling, d !== null) {
                d.return = m.return, m = d;
                break;
              }
              m = m.return;
            }
            d = m;
          }
          or(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, gn(r, l), c = Ma(c), o = o(c), r.flags |= 1, or(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ai(o, r.pendingProps), c = ai(o.type, c), ku(n, r, o, c, l);
      case 15:
        return dt(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Aa(n, r), r.tag = 1, An(o) ? (n = !0, Jn(r)) : n = !1, gn(r, l), Jc(r, o, c), Rs(r, o, c, l), xs(null, r, o, !0, n, l);
      case 19:
        return _i(n, r, l);
      case 22:
        return ws(n, r, l);
    }
    throw Error(x(156, r.tag));
  };
  function fh(n, r) {
    return cn(n, r);
  }
  function Cy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ja(n, r, l, o) {
    return new Cy(n, r, l, o);
  }
  function Gd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Ry(n) {
    if (typeof n == "function") return Gd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === ht) return 11;
      if (n === kt) return 14;
    }
    return 2;
  }
  function Hl(n, r) {
    var l = n.alternate;
    return l === null ? (l = ja(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Hs(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") Gd(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case W:
        return tl(l.children, c, d, r);
      case ke:
        m = 8, c |= 8;
        break;
      case Ke:
        return n = ja(12, l, r, c | 2), n.elementType = Ke, n.lanes = d, n;
      case Le:
        return n = ja(13, l, r, c), n.elementType = Le, n.lanes = d, n;
      case Ut:
        return n = ja(19, l, r, c), n.elementType = Ut, n.lanes = d, n;
      case Ue:
        return Pl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case We:
            m = 10;
            break e;
          case ft:
            m = 9;
            break e;
          case ht:
            m = 11;
            break e;
          case kt:
            m = 14;
            break e;
          case Mt:
            m = 16, o = null;
            break e;
        }
        throw Error(x(130, n == null ? n : typeof n, ""));
    }
    return r = ja(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function tl(n, r, l, o) {
    return n = ja(7, n, o, r), n.lanes = l, n;
  }
  function Pl(n, r, l, o) {
    return n = ja(22, n, o, r), n.elementType = Ue, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function qd(n, r, l) {
    return n = ja(6, n, null, r), n.lanes = l, n;
  }
  function cf(n, r, l) {
    return r = ja(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function dh(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Xu(0), this.expirationTimes = Xu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Xu(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function ff(n, r, l, o, c, d, m, E, T) {
    return n = new dh(n, r, l, E, T), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = ja(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, xd(d), n;
  }
  function Ty(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Ye, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function Kd(n) {
    if (!n) return Rr;
    n = n._reactInternals;
    e: {
      if (st(n) !== n || n.tag !== 1) throw Error(x(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (An(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(x(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (An(l)) return os(n, l, r);
    }
    return r;
  }
  function ph(n, r, l, o, c, d, m, E, T) {
    return n = ff(l, o, !0, n, c, d, m, E, T), n.context = Kd(null), l = n.current, o = Pn(), c = Ni(l), d = Ki(o, c), d.callback = r ?? null, Ll(l, d, c), n.current.lanes = c, Pi(n, c, o), ra(n, o), n;
  }
  function df(n, r, l, o) {
    var c = r.current, d = Pn(), m = Ni(c);
    return l = Kd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ki(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ll(c, r, m), n !== null && (zr(n, c, m, d), Nc(n, c, m)), m;
  }
  function pf(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function Xd(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function vf(n, r) {
    Xd(n, r), (n = n.alternate) && Xd(n, r);
  }
  function vh() {
    return null;
  }
  var Au = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Jd(n) {
    this._internalRoot = n;
  }
  hf.prototype.render = Jd.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(x(409));
    df(n, r, null, null);
  }, hf.prototype.unmount = Jd.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Lu(function() {
        df(null, n, null, null);
      }), r[Qi] = null;
    }
  };
  function hf(n) {
    this._internalRoot = n;
  }
  hf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = it();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < $n.length && r !== 0 && r < $n[l].priority; l++) ;
      $n.splice(l, 0, n), l === 0 && Go(n);
    }
  };
  function Zd(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function mf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function hh() {
  }
  function wy(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var F = pf(m);
          d.call(F);
        };
      }
      var m = ph(r, o, n, 0, null, !1, !1, "", hh);
      return n._reactRootContainer = m, n[Qi] = m.current, oo(n.nodeType === 8 ? n.parentNode : n), Lu(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var E = o;
      o = function() {
        var F = pf(T);
        E.call(F);
      };
    }
    var T = ff(n, 0, !1, null, null, !1, !1, "", hh);
    return n._reactRootContainer = T, n[Qi] = T.current, oo(n.nodeType === 8 ? n.parentNode : n), Lu(function() {
      df(r, T, l, o);
    }), T;
  }
  function Ps(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var E = c;
        c = function() {
          var T = pf(m);
          E.call(T);
        };
      }
      df(r, m, n, c);
    } else m = wy(l, r, n, c, o);
    return pf(m);
  }
  At = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Xa(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), ra(r, ct()), !(Ot & 6) && (To = ct() + 500, Ti()));
        }
        break;
      case 13:
        Lu(function() {
          var o = ha(n, 1);
          if (o !== null) {
            var c = Pn();
            zr(o, n, 1, c);
          }
        }), vf(n, 1);
    }
  }, Qo = function(n) {
    if (n.tag === 13) {
      var r = ha(n, 134217728);
      if (r !== null) {
        var l = Pn();
        zr(r, n, 134217728, l);
      }
      vf(n, 134217728);
    }
  }, hi = function(n) {
    if (n.tag === 13) {
      var r = Ni(n), l = ha(n, r);
      if (l !== null) {
        var o = Pn();
        zr(l, n, r, o);
      }
      vf(n, r);
    }
  }, it = function() {
    return Ft;
  }, Zu = function(n, r) {
    var l = Ft;
    try {
      return Ft = n, r();
    } finally {
      Ft = l;
    }
  }, qt = function(n, r, l) {
    switch (r) {
      case "input":
        if ($r(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = yn(o);
              if (!c) throw Error(x(90));
              br(o), $r(o, c);
            }
          }
        }
        break;
      case "textarea":
        $a(n, l);
        break;
      case "select":
        r = l.value, r != null && Tn(n, !!l.multiple, r, !1);
    }
  }, eu = $d, pl = Lu;
  var xy = { usingClientEntryPoint: !1, Events: [$e, ni, yn, Hi, Zl, $d] }, Vs = { findFiberByHostInstance: vu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, mh = { bundleType: Vs.bundleType, version: Vs.version, rendererPackageName: Vs.rendererPackageName, rendererConfig: Vs.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Fe.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = wn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Vs.findFiberByHostInstance || vh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber) try {
      ml = Vl.inject(mh), Qr = Vl;
    } catch {
    }
  }
  return Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = xy, Ia.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Zd(r)) throw Error(x(200));
    return Ty(n, r, null, l);
  }, Ia.createRoot = function(n, r) {
    if (!Zd(n)) throw Error(x(299));
    var l = !1, o = "", c = Au;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = ff(n, 1, !1, null, null, l, !1, o, c), n[Qi] = r.current, oo(n.nodeType === 8 ? n.parentNode : n), new Jd(r);
  }, Ia.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(x(188)) : (n = Object.keys(n).join(","), Error(x(268, n)));
    return n = wn(r), n = n === null ? null : n.stateNode, n;
  }, Ia.flushSync = function(n) {
    return Lu(n);
  }, Ia.hydrate = function(n, r, l) {
    if (!mf(r)) throw Error(x(200));
    return Ps(null, n, r, !0, l);
  }, Ia.hydrateRoot = function(n, r, l) {
    if (!Zd(n)) throw Error(x(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = Au;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = ph(r, null, n, 1, l ?? null, c, !1, d, m), n[Qi] = r.current, oo(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new hf(r);
  }, Ia.render = function(n, r, l) {
    if (!mf(r)) throw Error(x(200));
    return Ps(null, n, r, !1, l);
  }, Ia.unmountComponentAtNode = function(n) {
    if (!mf(n)) throw Error(x(40));
    return n._reactRootContainer ? (Lu(function() {
      Ps(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Ia.unstable_batchedUpdates = $d, Ia.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!mf(l)) throw Error(x(200));
    if (n == null || n._reactInternals === void 0) throw Error(x(38));
    return Ps(n, r, l, !1, o);
  }, Ia.version = "18.3.1-next-f1338f8080-20240426", Ia;
}
var Ya = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fT;
function fk() {
  return fT || (fT = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var N = _e, w = vT(), x = N.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, oe = !1;
    function ie(e) {
      oe = e;
    }
    function I(e) {
      if (!oe) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        he("warn", e, a);
      }
    }
    function g(e) {
      if (!oe) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        he("error", e, a);
      }
    }
    function he(e, t, a) {
      {
        var i = x.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var ee = 0, K = 1, Ve = 2, Q = 3, fe = 4, ae = 5, de = 6, te = 7, Ce = 8, Ie = 9, pe = 10, Re = 11, Fe = 12, Te = 13, Ye = 14, W = 15, ke = 16, Ke = 17, We = 18, ft = 19, ht = 21, Le = 22, Ut = 23, kt = 24, Mt = 25, Ue = !0, se = !1, ce = !1, le = !1, D = !1, Y = !0, nt = !0, et = !0, Et = !0, mt = /* @__PURE__ */ new Set(), pt = {}, yt = {};
    function Ct(e, t) {
      Wt(e, t), Wt(e + "Capture", t);
    }
    function Wt(e, t) {
      pt[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), pt[e] = t;
      {
        var a = e.toLowerCase();
        yt[a] = e, e === "onDoubleClick" && (yt.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        mt.add(t[i]);
    }
    var Nn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", br = Object.prototype.hasOwnProperty;
    function Rn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function rr(e) {
      try {
        return Bn(e), !1;
      } catch {
        return !0;
      }
    }
    function Bn(e) {
      return "" + e;
    }
    function In(e, t) {
      if (rr(e))
        return g("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Rn(e)), Bn(e);
    }
    function $r(e) {
      if (rr(e))
        return g("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Rn(e)), Bn(e);
    }
    function ci(e, t) {
      if (rr(e))
        return g("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Rn(e)), Bn(e);
    }
    function sa(e, t) {
      if (rr(e))
        return g("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Rn(e)), Bn(e);
    }
    function Kn(e) {
      if (rr(e))
        return g("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", Rn(e)), Bn(e);
    }
    function Tn(e) {
      if (rr(e))
        return g("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", Rn(e)), Bn(e);
    }
    var Yn = 0, Sr = 1, $a = 2, Ln = 3, Er = 4, ca = 5, Qa = 6, fi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ve = fi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", He = new RegExp("^[" + fi + "][" + ve + "]*$"), gt = {}, Yt = {};
    function rn(e) {
      return br.call(Yt, e) ? !0 : br.call(gt, e) ? !1 : He.test(e) ? (Yt[e] = !0, !0) : (gt[e] = !0, g("Invalid attribute name: `%s`", e), !1);
    }
    function hn(e, t, a) {
      return t !== null ? t.type === Yn : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function sn(e, t, a, i) {
      if (a !== null && a.type === Yn)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (i)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var u = e.toLowerCase().slice(0, 5);
          return u !== "data-" && u !== "aria-";
        }
        default:
          return !1;
      }
    }
    function Xn(e, t, a, i) {
      if (t === null || typeof t > "u" || sn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Ln:
            return !t;
          case Er:
            return t === !1;
          case ca:
            return isNaN(t);
          case Qa:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function an(e) {
      return qt.hasOwnProperty(e) ? qt[e] : null;
    }
    function Gt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === $a || t === Ln || t === Er, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var qt = {}, fa = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    fa.forEach(function(e) {
      qt[e] = new Gt(
        e,
        Yn,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      qt[t] = new Gt(
        t,
        Sr,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      qt[e] = new Gt(
        e,
        $a,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      qt[e] = new Gt(
        e,
        $a,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      qt[e] = new Gt(
        e,
        Ln,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      qt[e] = new Gt(
        e,
        Ln,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      qt[e] = new Gt(
        e,
        Er,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      qt[e] = new Gt(
        e,
        Qa,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      qt[e] = new Gt(
        e,
        ca,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Cr = /[\-\:]([a-z])/g, wa = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Cr, wa);
      qt[t] = new Gt(
        t,
        Sr,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Cr, wa);
      qt[t] = new Gt(
        t,
        Sr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Cr, wa);
      qt[t] = new Gt(
        t,
        Sr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      qt[e] = new Gt(
        e,
        Sr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Hi = "xlinkHref";
    qt[Hi] = new Gt(
      "xlinkHref",
      Sr,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      qt[e] = new Gt(
        e,
        Sr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var Zl = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, eu = !1;
    function pl(e) {
      !eu && Zl.test(e) && (eu = !0, g("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function vl(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        In(a, t), i.sanitizeURL && pl("" + a);
        var s = i.attributeName, f = null;
        if (i.type === Er) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : Xn(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (Xn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === Ln)
            return a;
          f = e.getAttribute(s);
        }
        return Xn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function tu(e, t, a, i) {
      {
        if (!rn(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return In(a, t), u === "" + a ? a : u;
      }
    }
    function _r(e, t, a, i) {
      var u = an(t);
      if (!hn(t, u, i)) {
        if (Xn(t, a, u, i) && (a = null), i || u === null) {
          if (rn(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (In(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = u.mustUseProperty;
        if (f) {
          var p = u.propertyName;
          if (a === null) {
            var v = u.type;
            e[p] = v === Ln ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var y = u.attributeName, S = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(y);
        else {
          var k = u.type, b;
          k === Ln || k === Er && a === !0 ? b = "" : (In(a, y), b = "" + a, u.sanitizeURL && pl(b.toString())), S ? e.setAttributeNS(S, y, b) : e.setAttribute(y, b);
        }
      }
    }
    var kr = Symbol.for("react.element"), ar = Symbol.for("react.portal"), di = Symbol.for("react.fragment"), Wa = Symbol.for("react.strict_mode"), pi = Symbol.for("react.profiler"), vi = Symbol.for("react.provider"), R = Symbol.for("react.context"), G = Symbol.for("react.forward_ref"), ge = Symbol.for("react.suspense"), Ne = Symbol.for("react.suspense_list"), st = Symbol.for("react.memo"), lt = Symbol.for("react.lazy"), wt = Symbol.for("react.scope"), Rt = Symbol.for("react.debug_trace_mode"), wn = Symbol.for("react.offscreen"), ln = Symbol.for("react.legacy_hidden"), cn = Symbol.for("react.cache"), ir = Symbol.for("react.tracing_marker"), Ga = Symbol.iterator, qa = "@@iterator";
    function ct(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ga && e[Ga] || e[qa];
      return typeof t == "function" ? t : null;
    }
    var vt = Object.assign, Ka = 0, nu, ru, hl, Wu, ml, Qr, $o;
    function Dr() {
    }
    Dr.__reactDisabledLog = !0;
    function uc() {
      {
        if (Ka === 0) {
          nu = console.log, ru = console.info, hl = console.warn, Wu = console.error, ml = console.group, Qr = console.groupCollapsed, $o = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Dr,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        Ka++;
      }
    }
    function oc() {
      {
        if (Ka--, Ka === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: vt({}, e, {
              value: nu
            }),
            info: vt({}, e, {
              value: ru
            }),
            warn: vt({}, e, {
              value: hl
            }),
            error: vt({}, e, {
              value: Wu
            }),
            group: vt({}, e, {
              value: ml
            }),
            groupCollapsed: vt({}, e, {
              value: Qr
            }),
            groupEnd: vt({}, e, {
              value: $o
            })
          });
        }
        Ka < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Gu = x.ReactCurrentDispatcher, yl;
    function da(e, t, a) {
      {
        if (yl === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            yl = i && i[1] || "";
          }
        return `
` + yl + e;
      }
    }
    var Xa = !1, Ja;
    {
      var qu = typeof WeakMap == "function" ? WeakMap : Map;
      Ja = new qu();
    }
    function au(e, t) {
      if (!e || Xa)
        return "";
      {
        var a = Ja.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      Xa = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Gu.current, Gu.current = null, uc();
      try {
        if (t) {
          var f = function() {
            throw Error();
          };
          if (Object.defineProperty(f.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(f, []);
            } catch (H) {
              i = H;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (H) {
              i = H;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (H) {
            i = H;
          }
          e();
        }
      } catch (H) {
        if (H && i && typeof H.stack == "string") {
          for (var p = H.stack.split(`
`), v = i.stack.split(`
`), y = p.length - 1, S = v.length - 1; y >= 1 && S >= 0 && p[y] !== v[S]; )
            S--;
          for (; y >= 1 && S >= 0; y--, S--)
            if (p[y] !== v[S]) {
              if (y !== 1 || S !== 1)
                do
                  if (y--, S--, S < 0 || p[y] !== v[S]) {
                    var k = `
` + p[y].replace(" at new ", " at ");
                    return e.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", e.displayName)), typeof e == "function" && Ja.set(e, k), k;
                  }
                while (y >= 1 && S >= 0);
              break;
            }
        }
      } finally {
        Xa = !1, Gu.current = s, oc(), Error.prepareStackTrace = u;
      }
      var b = e ? e.displayName || e.name : "", U = b ? da(b) : "";
      return typeof e == "function" && Ja.set(e, U), U;
    }
    function gl(e, t, a) {
      return au(e, !0);
    }
    function Ku(e, t, a) {
      return au(e, !1);
    }
    function Xu(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Pi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return au(e, Xu(e));
      if (typeof e == "string")
        return da(e);
      switch (e) {
        case ge:
          return da("Suspense");
        case Ne:
          return da("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case G:
            return Ku(e.render);
          case st:
            return Pi(e.type, t, a);
          case lt: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Pi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Gf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ae:
          return da(e.type);
        case ke:
          return da("Lazy");
        case Te:
          return da("Suspense");
        case ft:
          return da("SuspenseList");
        case ee:
        case Ve:
        case W:
          return Ku(e.type);
        case Re:
          return Ku(e.type.render);
        case K:
          return gl(e.type);
        default:
          return "";
      }
    }
    function Vi(e) {
      try {
        var t = "", a = e;
        do
          t += Gf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Ft(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Ju(e) {
      return e.displayName || "Context";
    }
    function At(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && g("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case di:
          return "Fragment";
        case ar:
          return "Portal";
        case pi:
          return "Profiler";
        case Wa:
          return "StrictMode";
        case ge:
          return "Suspense";
        case Ne:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case R:
            var t = e;
            return Ju(t) + ".Consumer";
          case vi:
            var a = e;
            return Ju(a._context) + ".Provider";
          case G:
            return Ft(e, e.render, "ForwardRef");
          case st:
            var i = e.displayName || null;
            return i !== null ? i : At(e.type) || "Memo";
          case lt: {
            var u = e, s = u._payload, f = u._init;
            try {
              return At(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Qo(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function hi(e) {
      return e.displayName || "Context";
    }
    function it(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case kt:
          return "Cache";
        case Ie:
          var i = a;
          return hi(i) + ".Consumer";
        case pe:
          var u = a;
          return hi(u._context) + ".Provider";
        case We:
          return "DehydratedFragment";
        case Re:
          return Qo(a, a.render, "ForwardRef");
        case te:
          return "Fragment";
        case ae:
          return a;
        case fe:
          return "Portal";
        case Q:
          return "Root";
        case de:
          return "Text";
        case ke:
          return At(a);
        case Ce:
          return a === Wa ? "StrictMode" : "Mode";
        case Le:
          return "Offscreen";
        case Fe:
          return "Profiler";
        case ht:
          return "Scope";
        case Te:
          return "Suspense";
        case ft:
          return "SuspenseList";
        case Mt:
          return "TracingMarker";
        case K:
        case ee:
        case Ke:
        case Ve:
        case Ye:
        case W:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Zu = x.ReactDebugCurrentFrame, lr = null, mi = !1;
    function Or() {
      {
        if (lr === null)
          return null;
        var e = lr._debugOwner;
        if (e !== null && typeof e < "u")
          return it(e);
      }
      return null;
    }
    function yi() {
      return lr === null ? "" : Vi(lr);
    }
    function fn() {
      Zu.getCurrentStack = null, lr = null, mi = !1;
    }
    function Kt(e) {
      Zu.getCurrentStack = e === null ? null : yi, lr = e, mi = !1;
    }
    function Sl() {
      return lr;
    }
    function $n(e) {
      mi = e;
    }
    function Nr(e) {
      return "" + e;
    }
    function xa(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return Tn(e), e;
        default:
          return "";
      }
    }
    var iu = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Wo(e, t) {
      iu[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || g("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || g("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Go(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function El(e) {
      return e._valueTracker;
    }
    function lu(e) {
      e._valueTracker = null;
    }
    function qf(e) {
      var t = "";
      return e && (Go(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function ba(e) {
      var t = Go(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      Tn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            Tn(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            Tn(p), i = "" + p;
          },
          stopTracking: function() {
            lu(e), delete e[t];
          }
        };
        return f;
      }
    }
    function Za(e) {
      El(e) || (e._valueTracker = ba(e));
    }
    function gi(e) {
      if (!e)
        return !1;
      var t = El(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = qf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function _a(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var eo = !1, to = !1, Cl = !1, uu = !1;
    function no(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function ro(e, t) {
      var a = e, i = t.checked, u = vt({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function ei(e, t) {
      Wo("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !to && (g("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), to = !0), t.value !== void 0 && t.defaultValue !== void 0 && !eo && (g("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), eo = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: xa(t.value != null ? t.value : i),
        controlled: no(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && _r(a, "checked", i, !1);
    }
    function C(e, t) {
      var a = e;
      {
        var i = no(t);
        !a._wrapperState.controlled && i && !uu && (g("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), uu = !0), a._wrapperState.controlled && !i && !Cl && (g("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Cl = !0);
      }
      h(e, t);
      var u = xa(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Nr(u)) : a.value !== Nr(u) && (a.value = Nr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Ge(a, t.type, u) : t.hasOwnProperty("defaultValue") && Ge(a, t.type, xa(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function j(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Nr(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function P(e, t) {
      var a = e;
      C(a, t), ue(a, t);
    }
    function ue(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        In(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = Ah(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            gi(f), C(f, p);
          }
        }
      }
    }
    function Ge(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || _a(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Nr(e._wrapperState.initialValue) : e.defaultValue !== Nr(a) && (e.defaultValue = Nr(a)));
    }
    var ye = !1, Je = !1, xt = !1;
    function zt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? N.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || Je || (Je = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (xt || (xt = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !ye && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), ye = !0);
    }
    function un(e, t) {
      t.value != null && e.setAttribute("value", Nr(xa(t.value)));
    }
    var Xt = Array.isArray;
    function St(e) {
      return Xt(e);
    }
    var Jt;
    Jt = !1;
    function mn() {
      var e = Or();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Rl = ["value", "defaultValue"];
    function qo(e) {
      {
        Wo("select", e);
        for (var t = 0; t < Rl.length; t++) {
          var a = Rl[t];
          if (e[a] != null) {
            var i = St(e[a]);
            e.multiple && !i ? g("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, mn()) : !e.multiple && i && g("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, mn());
          }
        }
      }
    }
    function Bi(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var s = a, f = {}, p = 0; p < s.length; p++)
          f["$" + s[p]] = !0;
        for (var v = 0; v < u.length; v++) {
          var y = f.hasOwnProperty("$" + u[v].value);
          u[v].selected !== y && (u[v].selected = y), y && i && (u[v].defaultSelected = !0);
        }
      } else {
        for (var S = Nr(xa(a)), k = null, b = 0; b < u.length; b++) {
          if (u[b].value === S) {
            u[b].selected = !0, i && (u[b].defaultSelected = !0);
            return;
          }
          k === null && !u[b].disabled && (k = u[b]);
        }
        k !== null && (k.selected = !0);
      }
    }
    function Ko(e, t) {
      return vt({}, t, {
        value: void 0
      });
    }
    function ou(e, t) {
      var a = e;
      qo(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Jt && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Jt = !0);
    }
    function Kf(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Bi(a, !!t.multiple, i, !1) : t.defaultValue != null && Bi(a, !!t.multiple, t.defaultValue, !0);
    }
    function sc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? Bi(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? Bi(a, !!t.multiple, t.defaultValue, !0) : Bi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Xf(e, t) {
      var a = e, i = t.value;
      i != null && Bi(a, !!t.multiple, i, !1);
    }
    var rv = !1;
    function Jf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = vt({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Nr(a._wrapperState.initialValue)
      });
      return i;
    }
    function Zf(e, t) {
      var a = e;
      Wo("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !rv && (g("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component"), rv = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          g("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (St(u)) {
              if (u.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              u = u[0];
            }
            s = u;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: xa(i)
      };
    }
    function av(e, t) {
      var a = e, i = xa(t.value), u = xa(t.defaultValue);
      if (i != null) {
        var s = Nr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Nr(u));
    }
    function iv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ey(e, t) {
      av(e, t);
    }
    var Ii = "http://www.w3.org/1999/xhtml", ed = "http://www.w3.org/1998/Math/MathML", td = "http://www.w3.org/2000/svg";
    function nd(e) {
      switch (e) {
        case "svg":
          return td;
        case "math":
          return ed;
        default:
          return Ii;
      }
    }
    function rd(e, t) {
      return e == null || e === Ii ? nd(t) : e === td && t === "foreignObject" ? Ii : e;
    }
    var lv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, cc, uv = lv(function(e, t) {
      if (e.namespaceURI === td && !("innerHTML" in e)) {
        cc = cc || document.createElement("div"), cc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = cc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Wr = 1, Yi = 3, Mn = 8, $i = 9, ad = 11, ao = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Yi) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Xo = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, Jo = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function ov(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var sv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Jo).forEach(function(e) {
      sv.forEach(function(t) {
        Jo[ov(t, e)] = Jo[e];
      });
    });
    function fc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Jo.hasOwnProperty(e) && Jo[e]) ? t + "px" : (sa(t, e), ("" + t).trim());
    }
    var cv = /([A-Z])/g, fv = /^ms-/;
    function io(e) {
      return e.replace(cv, "-$1").toLowerCase().replace(fv, "-ms-");
    }
    var dv = function() {
    };
    {
      var ty = /^(?:webkit|moz|o)[A-Z]/, ny = /^-ms-/, pv = /-(.)/g, id = /;\s*$/, Si = {}, su = {}, vv = !1, Zo = !1, ry = function(e) {
        return e.replace(pv, function(t, a) {
          return a.toUpperCase();
        });
      }, hv = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          ry(e.replace(ny, "ms-"))
        ));
      }, ld = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, ud = function(e, t) {
        su.hasOwnProperty(t) && su[t] || (su[t] = !0, g(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(id, "")));
      }, mv = function(e, t) {
        vv || (vv = !0, g("`NaN` is an invalid value for the `%s` css style property.", e));
      }, yv = function(e, t) {
        Zo || (Zo = !0, g("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      dv = function(e, t) {
        e.indexOf("-") > -1 ? hv(e) : ty.test(e) ? ld(e) : id.test(t) && ud(e, t), typeof t == "number" && (isNaN(t) ? mv(e, t) : isFinite(t) || yv(e, t));
      };
    }
    var gv = dv;
    function ay(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : io(i)) + ":", t += fc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function Sv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || gv(i, t[i]);
          var s = fc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function iy(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Ev(e) {
      var t = {};
      for (var a in e)
        for (var i = Xo[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function ly(e, t) {
      {
        if (!t)
          return;
        var a = Ev(e), i = Ev(t), u = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (u[v])
              continue;
            u[v] = !0, g("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", iy(e[f]) ? "Removing" : "Updating", f, p);
          }
        }
      }
    }
    var ti = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, es = vt({
      menuitem: !0
    }, ti), Cv = "__html";
    function dc(e, t) {
      if (t) {
        if (es[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Cv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && g("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Tl(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var ts = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, pc = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, lo = {}, uy = new RegExp("^(aria)-[" + ve + "]*$"), uo = new RegExp("^(aria)[A-Z][" + ve + "]*$");
    function od(e, t) {
      {
        if (br.call(lo, t) && lo[t])
          return !0;
        if (uo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = pc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return g("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), lo[t] = !0, !0;
          if (t !== i)
            return g("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), lo[t] = !0, !0;
        }
        if (uy.test(t)) {
          var u = t.toLowerCase(), s = pc.hasOwnProperty(u) ? u : null;
          if (s == null)
            return lo[t] = !0, !1;
          if (t !== s)
            return g("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), lo[t] = !0, !0;
        }
      }
      return !0;
    }
    function ns(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = od(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? g("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && g("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function sd(e, t) {
      Tl(e, t) || ns(e, t);
    }
    var cd = !1;
    function vc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !cd && (cd = !0, e === "select" && t.multiple ? g("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : g("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var cu = function() {
    };
    {
      var ur = {}, fd = /^on./, hc = /^on[^A-Z]/, Rv = new RegExp("^(aria)-[" + ve + "]*$"), Tv = new RegExp("^(aria)[A-Z][" + ve + "]*$");
      cu = function(e, t, a, i) {
        if (br.call(ur, t) && ur[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return g("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), ur[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(u) ? f[u] : null;
          if (p != null)
            return g("Invalid event handler property `%s`. Did you mean `%s`?", t, p), ur[t] = !0, !0;
          if (fd.test(t))
            return g("Unknown event handler property `%s`. It will be ignored.", t), ur[t] = !0, !0;
        } else if (fd.test(t))
          return hc.test(t) && g("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), ur[t] = !0, !0;
        if (Rv.test(t) || Tv.test(t))
          return !0;
        if (u === "innerhtml")
          return g("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), ur[t] = !0, !0;
        if (u === "aria")
          return g("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), ur[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return g("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), ur[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return g("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), ur[t] = !0, !0;
        var v = an(t), y = v !== null && v.type === Yn;
        if (ts.hasOwnProperty(u)) {
          var S = ts[u];
          if (S !== t)
            return g("Invalid DOM property `%s`. Did you mean `%s`?", t, S), ur[t] = !0, !0;
        } else if (!y && t !== u)
          return g("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), ur[t] = !0, !0;
        return typeof a == "boolean" && sn(t, a, v, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), ur[t] = !0, !0) : y ? !0 : sn(t, a, v, !1) ? (ur[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === Ln && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), ur[t] = !0), !0);
      };
    }
    var wv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var s = cu(e, u, t[u], a);
          s || i.push(u);
        }
        var f = i.map(function(p) {
          return "`" + p + "`";
        }).join(", ");
        i.length === 1 ? g("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && g("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function xv(e, t, a) {
      Tl(e, t) || wv(e, t, a);
    }
    var dd = 1, mc = 2, ka = 4, pd = dd | mc | ka, fu = null;
    function oy(e) {
      fu !== null && g("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), fu = e;
    }
    function sy() {
      fu === null && g("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), fu = null;
    }
    function rs(e) {
      return e === fu;
    }
    function vd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Yi ? t.parentNode : t;
    }
    var yc = null, du = null, $t = null;
    function gc(e) {
      var t = Do(e);
      if (t) {
        if (typeof yc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Ah(a);
          yc(t.stateNode, t.type, i);
        }
      }
    }
    function Sc(e) {
      yc = e;
    }
    function oo(e) {
      du ? $t ? $t.push(e) : $t = [e] : du = e;
    }
    function bv() {
      return du !== null || $t !== null;
    }
    function Ec() {
      if (du) {
        var e = du, t = $t;
        if (du = null, $t = null, gc(e), t)
          for (var a = 0; a < t.length; a++)
            gc(t[a]);
      }
    }
    var so = function(e, t) {
      return e(t);
    }, as = function() {
    }, wl = !1;
    function _v() {
      var e = bv();
      e && (as(), Ec());
    }
    function kv(e, t, a) {
      if (wl)
        return e(t, a);
      wl = !0;
      try {
        return so(e, t, a);
      } finally {
        wl = !1, _v();
      }
    }
    function cy(e, t, a) {
      so = e, as = a;
    }
    function Dv(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Cc(e, t, a) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(a.disabled && Dv(t));
        default:
          return !1;
      }
    }
    function xl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Ah(a);
      if (i === null)
        return null;
      var u = i[t];
      if (Cc(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var is = !1;
    if (Nn)
      try {
        var pu = {};
        Object.defineProperty(pu, "passive", {
          get: function() {
            is = !0;
          }
        }), window.addEventListener("test", pu, pu), window.removeEventListener("test", pu, pu);
      } catch {
        is = !1;
      }
    function Rc(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (S) {
        this.onError(S);
      }
    }
    var Tc = Rc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var hd = document.createElement("react");
      Tc = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var S = document.createEvent("Event"), k = !1, b = !0, U = window.event, H = Object.getOwnPropertyDescriptor(window, "event");
        function V() {
          hd.removeEventListener(B, qe, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = U);
        }
        var Ee = Array.prototype.slice.call(arguments, 3);
        function qe() {
          k = !0, V(), a.apply(i, Ee), b = !1;
        }
        var Pe, Lt = !1, bt = !1;
        function M(A) {
          if (Pe = A.error, Lt = !0, Pe === null && A.colno === 0 && A.lineno === 0 && (bt = !0), A.defaultPrevented && Pe != null && typeof Pe == "object")
            try {
              Pe._suppressLogging = !0;
            } catch {
            }
        }
        var B = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", M), hd.addEventListener(B, qe, !1), S.initEvent(B, !1, !1), hd.dispatchEvent(S), H && Object.defineProperty(window, "event", H), k && b && (Lt ? bt && (Pe = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Pe = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Pe)), window.removeEventListener("error", M), !k)
          return V(), Rc.apply(this, arguments);
      };
    }
    var Ov = Tc, co = !1, wc = null, fo = !1, Ei = null, Nv = {
      onError: function(e) {
        co = !0, wc = e;
      }
    };
    function bl(e, t, a, i, u, s, f, p, v) {
      co = !1, wc = null, Ov.apply(Nv, arguments);
    }
    function Ci(e, t, a, i, u, s, f, p, v) {
      if (bl.apply(this, arguments), co) {
        var y = us();
        fo || (fo = !0, Ei = y);
      }
    }
    function ls() {
      if (fo) {
        var e = Ei;
        throw fo = !1, Ei = null, e;
      }
    }
    function Qi() {
      return co;
    }
    function us() {
      if (co) {
        var e = wc;
        return co = !1, wc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function po(e) {
      return e._reactInternals;
    }
    function fy(e) {
      return e._reactInternals !== void 0;
    }
    function vu(e, t) {
      e._reactInternals = t;
    }
    var $e = (
      /*                      */
      0
    ), ni = (
      /*                */
      1
    ), yn = (
      /*                    */
      2
    ), Dt = (
      /*                       */
      4
    ), Da = (
      /*                */
      16
    ), Oa = (
      /*                 */
      32
    ), on = (
      /*                     */
      64
    ), Be = (
      /*                   */
      128
    ), Rr = (
      /*            */
      256
    ), Cn = (
      /*                          */
      512
    ), Qn = (
      /*                     */
      1024
    ), Gr = (
      /*                      */
      2048
    ), qr = (
      /*                    */
      4096
    ), An = (
      /*                   */
      8192
    ), vo = (
      /*             */
      16384
    ), Lv = (
      /*               */
      32767
    ), os = (
      /*                   */
      32768
    ), Jn = (
      /*                */
      65536
    ), xc = (
      /* */
      131072
    ), Ri = (
      /*                       */
      1048576
    ), ho = (
      /*                    */
      2097152
    ), Wi = (
      /*                 */
      4194304
    ), bc = (
      /*                */
      8388608
    ), _l = (
      /*               */
      16777216
    ), Ti = (
      /*              */
      33554432
    ), kl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Dt | Qn | 0
    ), Dl = yn | Dt | Da | Oa | Cn | qr | An, Ol = Dt | on | Cn | An, Gi = Gr | Da, zn = Wi | bc | ho, Na = x.ReactCurrentOwner;
    function pa(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (yn | qr)) !== $e && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === Q ? a : null;
    }
    function wi(e) {
      if (e.tag === Te) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function xi(e) {
      return e.tag === Q ? e.stateNode.containerInfo : null;
    }
    function hu(e) {
      return pa(e) === e;
    }
    function Mv(e) {
      {
        var t = Na.current;
        if (t !== null && t.tag === K) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", it(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = po(e);
      return u ? pa(u) === u : !1;
    }
    function _c(e) {
      if (pa(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function kc(e) {
      var t = e.alternate;
      if (!t) {
        var a = pa(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, u = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var f = s.alternate;
        if (f === null) {
          var p = s.return;
          if (p !== null) {
            i = u = p;
            continue;
          }
          break;
        }
        if (s.child === f.child) {
          for (var v = s.child; v; ) {
            if (v === i)
              return _c(s), e;
            if (v === u)
              return _c(s), t;
            v = v.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== u.return)
          i = s, u = f;
        else {
          for (var y = !1, S = s.child; S; ) {
            if (S === i) {
              y = !0, i = s, u = f;
              break;
            }
            if (S === u) {
              y = !0, u = s, i = f;
              break;
            }
            S = S.sibling;
          }
          if (!y) {
            for (S = f.child; S; ) {
              if (S === i) {
                y = !0, i = f, u = s;
                break;
              }
              if (S === u) {
                y = !0, u = f, i = s;
                break;
              }
              S = S.sibling;
            }
            if (!y)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== Q)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Kr(e) {
      var t = kc(e);
      return t !== null ? Xr(t) : null;
    }
    function Xr(e) {
      if (e.tag === ae || e.tag === de)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = Xr(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function pn(e) {
      var t = kc(e);
      return t !== null ? La(t) : null;
    }
    function La(e) {
      if (e.tag === ae || e.tag === de)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== fe) {
          var a = La(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var md = w.unstable_scheduleCallback, Av = w.unstable_cancelCallback, yd = w.unstable_shouldYield, gd = w.unstable_requestPaint, Wn = w.unstable_now, Dc = w.unstable_getCurrentPriorityLevel, ss = w.unstable_ImmediatePriority, Nl = w.unstable_UserBlockingPriority, qi = w.unstable_NormalPriority, dy = w.unstable_LowPriority, mu = w.unstable_IdlePriority, Oc = w.unstable_yieldValue, zv = w.unstable_setDisableYieldValue, yu = null, xn = null, Se = null, va = !1, Jr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function mo(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        nt && (e = vt({}, e, {
          getLaneLabelMap: gu,
          injectProfilingHooks: Ma
        })), yu = t.inject(e), xn = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Sd(e, t) {
      if (xn && typeof xn.onScheduleFiberRoot == "function")
        try {
          xn.onScheduleFiberRoot(yu, e, t);
        } catch (a) {
          va || (va = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function Ed(e, t) {
      if (xn && typeof xn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & Be) === Be;
          if (et) {
            var i;
            switch (t) {
              case Lr:
                i = ss;
                break;
              case _i:
                i = Nl;
                break;
              case Aa:
                i = qi;
                break;
              case za:
                i = mu;
                break;
              default:
                i = qi;
                break;
            }
            xn.onCommitFiberRoot(yu, e, i, a);
          }
        } catch (u) {
          va || (va = !0, g("React instrumentation encountered an error: %s", u));
        }
    }
    function Cd(e) {
      if (xn && typeof xn.onPostCommitFiberRoot == "function")
        try {
          xn.onPostCommitFiberRoot(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Rd(e) {
      if (xn && typeof xn.onCommitFiberUnmount == "function")
        try {
          xn.onCommitFiberUnmount(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function gn(e) {
      if (typeof Oc == "function" && (zv(e), ie(e)), xn && typeof xn.setStrictMode == "function")
        try {
          xn.setStrictMode(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Ma(e) {
      Se = e;
    }
    function gu() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Cu; a++) {
          var i = Hv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Td(e) {
      Se !== null && typeof Se.markCommitStarted == "function" && Se.markCommitStarted(e);
    }
    function wd() {
      Se !== null && typeof Se.markCommitStopped == "function" && Se.markCommitStopped();
    }
    function ha(e) {
      Se !== null && typeof Se.markComponentRenderStarted == "function" && Se.markComponentRenderStarted(e);
    }
    function ma() {
      Se !== null && typeof Se.markComponentRenderStopped == "function" && Se.markComponentRenderStopped();
    }
    function xd(e) {
      Se !== null && typeof Se.markComponentPassiveEffectMountStarted == "function" && Se.markComponentPassiveEffectMountStarted(e);
    }
    function Uv() {
      Se !== null && typeof Se.markComponentPassiveEffectMountStopped == "function" && Se.markComponentPassiveEffectMountStopped();
    }
    function Ki(e) {
      Se !== null && typeof Se.markComponentPassiveEffectUnmountStarted == "function" && Se.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ll() {
      Se !== null && typeof Se.markComponentPassiveEffectUnmountStopped == "function" && Se.markComponentPassiveEffectUnmountStopped();
    }
    function Nc(e) {
      Se !== null && typeof Se.markComponentLayoutEffectMountStarted == "function" && Se.markComponentLayoutEffectMountStarted(e);
    }
    function jv() {
      Se !== null && typeof Se.markComponentLayoutEffectMountStopped == "function" && Se.markComponentLayoutEffectMountStopped();
    }
    function cs(e) {
      Se !== null && typeof Se.markComponentLayoutEffectUnmountStarted == "function" && Se.markComponentLayoutEffectUnmountStarted(e);
    }
    function bd() {
      Se !== null && typeof Se.markComponentLayoutEffectUnmountStopped == "function" && Se.markComponentLayoutEffectUnmountStopped();
    }
    function fs(e, t, a) {
      Se !== null && typeof Se.markComponentErrored == "function" && Se.markComponentErrored(e, t, a);
    }
    function bi(e, t, a) {
      Se !== null && typeof Se.markComponentSuspended == "function" && Se.markComponentSuspended(e, t, a);
    }
    function ds(e) {
      Se !== null && typeof Se.markLayoutEffectsStarted == "function" && Se.markLayoutEffectsStarted(e);
    }
    function ps() {
      Se !== null && typeof Se.markLayoutEffectsStopped == "function" && Se.markLayoutEffectsStopped();
    }
    function Su(e) {
      Se !== null && typeof Se.markPassiveEffectsStarted == "function" && Se.markPassiveEffectsStarted(e);
    }
    function _d() {
      Se !== null && typeof Se.markPassiveEffectsStopped == "function" && Se.markPassiveEffectsStopped();
    }
    function Eu(e) {
      Se !== null && typeof Se.markRenderStarted == "function" && Se.markRenderStarted(e);
    }
    function Fv() {
      Se !== null && typeof Se.markRenderYielded == "function" && Se.markRenderYielded();
    }
    function Lc() {
      Se !== null && typeof Se.markRenderStopped == "function" && Se.markRenderStopped();
    }
    function Sn(e) {
      Se !== null && typeof Se.markRenderScheduled == "function" && Se.markRenderScheduled(e);
    }
    function Mc(e, t) {
      Se !== null && typeof Se.markForceUpdateScheduled == "function" && Se.markForceUpdateScheduled(e, t);
    }
    function vs(e, t) {
      Se !== null && typeof Se.markStateUpdateScheduled == "function" && Se.markStateUpdateScheduled(e, t);
    }
    var Qe = (
      /*                         */
      0
    ), Tt = (
      /*                 */
      1
    ), Ht = (
      /*                    */
      2
    ), Zt = (
      /*               */
      8
    ), Pt = (
      /*              */
      16
    ), Un = Math.clz32 ? Math.clz32 : hs, Zn = Math.log, Ac = Math.LN2;
    function hs(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Zn(t) / Ac | 0) | 0;
    }
    var Cu = 31, q = (
      /*                        */
      0
    ), jt = (
      /*                          */
      0
    ), tt = (
      /*                        */
      1
    ), Ml = (
      /*    */
      2
    ), ri = (
      /*             */
      4
    ), Tr = (
      /*            */
      8
    ), bn = (
      /*                     */
      16
    ), Xi = (
      /*                */
      32
    ), Al = (
      /*                       */
      4194240
    ), Ru = (
      /*                        */
      64
    ), zc = (
      /*                        */
      128
    ), Uc = (
      /*                        */
      256
    ), jc = (
      /*                        */
      512
    ), Fc = (
      /*                        */
      1024
    ), Hc = (
      /*                        */
      2048
    ), Pc = (
      /*                        */
      4096
    ), Vc = (
      /*                        */
      8192
    ), Bc = (
      /*                        */
      16384
    ), Tu = (
      /*                       */
      32768
    ), Ic = (
      /*                       */
      65536
    ), yo = (
      /*                       */
      131072
    ), go = (
      /*                       */
      262144
    ), Yc = (
      /*                       */
      524288
    ), ms = (
      /*                       */
      1048576
    ), $c = (
      /*                       */
      2097152
    ), ys = (
      /*                            */
      130023424
    ), wu = (
      /*                             */
      4194304
    ), Qc = (
      /*                             */
      8388608
    ), gs = (
      /*                             */
      16777216
    ), Wc = (
      /*                             */
      33554432
    ), Gc = (
      /*                             */
      67108864
    ), kd = wu, Ss = (
      /*          */
      134217728
    ), Dd = (
      /*                          */
      268435455
    ), Es = (
      /*               */
      268435456
    ), xu = (
      /*                        */
      536870912
    ), Zr = (
      /*                   */
      1073741824
    );
    function Hv(e) {
      {
        if (e & tt)
          return "Sync";
        if (e & Ml)
          return "InputContinuousHydration";
        if (e & ri)
          return "InputContinuous";
        if (e & Tr)
          return "DefaultHydration";
        if (e & bn)
          return "Default";
        if (e & Xi)
          return "TransitionHydration";
        if (e & Al)
          return "Transition";
        if (e & ys)
          return "Retry";
        if (e & Ss)
          return "SelectiveHydration";
        if (e & Es)
          return "IdleHydration";
        if (e & xu)
          return "Idle";
        if (e & Zr)
          return "Offscreen";
      }
    }
    var nn = -1, bu = Ru, qc = wu;
    function Cs(e) {
      switch (zl(e)) {
        case tt:
          return tt;
        case Ml:
          return Ml;
        case ri:
          return ri;
        case Tr:
          return Tr;
        case bn:
          return bn;
        case Xi:
          return Xi;
        case Ru:
        case zc:
        case Uc:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Tu:
        case Ic:
        case yo:
        case go:
        case Yc:
        case ms:
        case $c:
          return e & Al;
        case wu:
        case Qc:
        case gs:
        case Wc:
        case Gc:
          return e & ys;
        case Ss:
          return Ss;
        case Es:
          return Es;
        case xu:
          return xu;
        case Zr:
          return Zr;
        default:
          return g("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Kc(e, t) {
      var a = e.pendingLanes;
      if (a === q)
        return q;
      var i = q, u = e.suspendedLanes, s = e.pingedLanes, f = a & Dd;
      if (f !== q) {
        var p = f & ~u;
        if (p !== q)
          i = Cs(p);
        else {
          var v = f & s;
          v !== q && (i = Cs(v));
        }
      } else {
        var y = a & ~u;
        y !== q ? i = Cs(y) : s !== q && (i = Cs(s));
      }
      if (i === q)
        return q;
      if (t !== q && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === q) {
        var S = zl(i), k = zl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          S >= k || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          S === bn && (k & Al) !== q
        )
          return t;
      }
      (i & ri) !== q && (i |= a & bn);
      var b = e.entangledLanes;
      if (b !== q)
        for (var U = e.entanglements, H = i & b; H > 0; ) {
          var V = jn(H), Ee = 1 << V;
          i |= U[V], H &= ~Ee;
        }
      return i;
    }
    function ai(e, t) {
      for (var a = e.eventTimes, i = nn; t > 0; ) {
        var u = jn(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Od(e, t) {
      switch (e) {
        case tt:
        case Ml:
        case ri:
          return t + 250;
        case Tr:
        case bn:
        case Xi:
        case Ru:
        case zc:
        case Uc:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Tu:
        case Ic:
        case yo:
        case go:
        case Yc:
        case ms:
        case $c:
          return t + 5e3;
        case wu:
        case Qc:
        case gs:
        case Wc:
        case Gc:
          return nn;
        case Ss:
        case Es:
        case xu:
        case Zr:
          return nn;
        default:
          return g("Should have found matching lanes. This is a bug in React."), nn;
      }
    }
    function Xc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = jn(f), v = 1 << p, y = s[p];
        y === nn ? ((v & i) === q || (v & u) !== q) && (s[p] = Od(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Pv(e) {
      return Cs(e.pendingLanes);
    }
    function Jc(e) {
      var t = e.pendingLanes & ~Zr;
      return t !== q ? t : t & Zr ? Zr : q;
    }
    function Vv(e) {
      return (e & tt) !== q;
    }
    function Rs(e) {
      return (e & Dd) !== q;
    }
    function _u(e) {
      return (e & ys) === e;
    }
    function Nd(e) {
      var t = tt | ri | bn;
      return (e & t) === q;
    }
    function Ld(e) {
      return (e & Al) === e;
    }
    function Zc(e, t) {
      var a = Ml | ri | Tr | bn;
      return (t & a) !== q;
    }
    function Bv(e, t) {
      return (t & e.expiredLanes) !== q;
    }
    function Md(e) {
      return (e & Al) !== q;
    }
    function Ad() {
      var e = bu;
      return bu <<= 1, (bu & Al) === q && (bu = Ru), e;
    }
    function Iv() {
      var e = qc;
      return qc <<= 1, (qc & ys) === q && (qc = wu), e;
    }
    function zl(e) {
      return e & -e;
    }
    function Ts(e) {
      return zl(e);
    }
    function jn(e) {
      return 31 - Un(e);
    }
    function or(e) {
      return jn(e);
    }
    function ea(e, t) {
      return (e & t) !== q;
    }
    function ku(e, t) {
      return (e & t) === t;
    }
    function dt(e, t) {
      return e | t;
    }
    function ws(e, t) {
      return e & ~t;
    }
    function zd(e, t) {
      return e & t;
    }
    function Yv(e) {
      return e;
    }
    function $v(e, t) {
      return e !== jt && e < t ? e : t;
    }
    function xs(e) {
      for (var t = [], a = 0; a < Cu; a++)
        t.push(e);
      return t;
    }
    function So(e, t, a) {
      e.pendingLanes |= t, t !== xu && (e.suspendedLanes = q, e.pingedLanes = q);
      var i = e.eventTimes, u = or(t);
      i[u] = a;
    }
    function Qv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = jn(i), s = 1 << u;
        a[u] = nn, i &= ~s;
      }
    }
    function ef(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Ud(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = q, e.pingedLanes = q, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = jn(f), v = 1 << p;
        i[p] = q, u[p] = nn, s[p] = nn, f &= ~v;
      }
    }
    function tf(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = jn(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function jd(e, t) {
      var a = zl(t), i;
      switch (a) {
        case ri:
          i = Ml;
          break;
        case bn:
          i = Tr;
          break;
        case Ru:
        case zc:
        case Uc:
        case jc:
        case Fc:
        case Hc:
        case Pc:
        case Vc:
        case Bc:
        case Tu:
        case Ic:
        case yo:
        case go:
        case Yc:
        case ms:
        case $c:
        case wu:
        case Qc:
        case gs:
        case Wc:
        case Gc:
          i = Xi;
          break;
        case xu:
          i = Es;
          break;
        default:
          i = jt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== jt ? jt : i;
    }
    function bs(e, t, a) {
      if (Jr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = or(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function Wv(e, t) {
      if (Jr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = or(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Fd(e, t) {
      return null;
    }
    var Lr = tt, _i = ri, Aa = bn, za = xu, _s = jt;
    function Ua() {
      return _s;
    }
    function Fn(e) {
      _s = e;
    }
    function Gv(e, t) {
      var a = _s;
      try {
        return _s = e, t();
      } finally {
        _s = a;
      }
    }
    function qv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function ks(e, t) {
      return e > t ? e : t;
    }
    function er(e, t) {
      return e !== 0 && e < t;
    }
    function Kv(e) {
      var t = zl(e);
      return er(Lr, t) ? er(_i, t) ? Rs(t) ? Aa : za : _i : Lr;
    }
    function nf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Ds;
    function wr(e) {
      Ds = e;
    }
    function py(e) {
      Ds(e);
    }
    var Oe;
    function Eo(e) {
      Oe = e;
    }
    var rf;
    function Xv(e) {
      rf = e;
    }
    var Jv;
    function Os(e) {
      Jv = e;
    }
    var Ns;
    function Hd(e) {
      Ns = e;
    }
    var af = !1, Ls = [], Ji = null, ki = null, Di = null, _n = /* @__PURE__ */ new Map(), Mr = /* @__PURE__ */ new Map(), Ar = [], Zv = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function eh(e) {
      return Zv.indexOf(e) > -1;
    }
    function ii(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [i]
      };
    }
    function Pd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Ji = null;
          break;
        case "dragenter":
        case "dragleave":
          ki = null;
          break;
        case "mouseover":
        case "mouseout":
          Di = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          _n.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Mr.delete(i);
          break;
        }
      }
    }
    function ta(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = ii(t, a, i, u, s);
        if (t !== null) {
          var p = Do(t);
          p !== null && Oe(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function vy(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var s = u;
          return Ji = ta(Ji, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = u;
          return ki = ta(ki, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = u;
          return Di = ta(Di, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = u, y = v.pointerId;
          return _n.set(y, ta(_n.get(y) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var S = u, k = S.pointerId;
          return Mr.set(k, ta(Mr.get(k) || null, e, t, a, i, S)), !0;
        }
      }
      return !1;
    }
    function Vd(e) {
      var t = Ys(e.target);
      if (t !== null) {
        var a = pa(t);
        if (a !== null) {
          var i = a.tag;
          if (i === Te) {
            var u = wi(a);
            if (u !== null) {
              e.blockedOn = u, Ns(e.priority, function() {
                rf(a);
              });
              return;
            }
          } else if (i === Q) {
            var s = a.stateNode;
            if (nf(s)) {
              e.blockedOn = xi(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function th(e) {
      for (var t = Jv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Ar.length && er(t, Ar[i].priority); i++)
        ;
      Ar.splice(i, 0, a), i === 0 && Vd(a);
    }
    function Ms(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Ro(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          oy(s), u.target.dispatchEvent(s), sy();
        } else {
          var f = Do(i);
          return f !== null && Oe(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Bd(e, t, a) {
      Ms(e) && a.delete(t);
    }
    function hy() {
      af = !1, Ji !== null && Ms(Ji) && (Ji = null), ki !== null && Ms(ki) && (ki = null), Di !== null && Ms(Di) && (Di = null), _n.forEach(Bd), Mr.forEach(Bd);
    }
    function Ul(e, t) {
      e.blockedOn === t && (e.blockedOn = null, af || (af = !0, w.unstable_scheduleCallback(w.unstable_NormalPriority, hy)));
    }
    function Du(e) {
      if (Ls.length > 0) {
        Ul(Ls[0], e);
        for (var t = 1; t < Ls.length; t++) {
          var a = Ls[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Ji !== null && Ul(Ji, e), ki !== null && Ul(ki, e), Di !== null && Ul(Di, e);
      var i = function(p) {
        return Ul(p, e);
      };
      _n.forEach(i), Mr.forEach(i);
      for (var u = 0; u < Ar.length; u++) {
        var s = Ar[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Ar.length > 0; ) {
        var f = Ar[0];
        if (f.blockedOn !== null)
          break;
        Vd(f), f.blockedOn === null && Ar.shift();
      }
    }
    var sr = x.ReactCurrentBatchConfig, Ot = !0;
    function Gn(e) {
      Ot = !!e;
    }
    function Hn() {
      return Ot;
    }
    function cr(e, t, a) {
      var i = lf(t), u;
      switch (i) {
        case Lr:
          u = ya;
          break;
        case _i:
          u = Co;
          break;
        case Aa:
        default:
          u = kn;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ya(e, t, a, i) {
      var u = Ua(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(Lr), kn(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function Co(e, t, a, i) {
      var u = Ua(), s = sr.transition;
      sr.transition = null;
      try {
        Fn(_i), kn(e, t, a, i);
      } finally {
        Fn(u), sr.transition = s;
      }
    }
    function kn(e, t, a, i) {
      Ot && As(e, t, a, i);
    }
    function As(e, t, a, i) {
      var u = Ro(e, t, a, i);
      if (u === null) {
        Ly(e, t, i, Oi, a), Pd(e, i);
        return;
      }
      if (vy(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Pd(e, i), t & ka && eh(e)) {
        for (; u !== null; ) {
          var s = Do(u);
          s !== null && py(s);
          var f = Ro(e, t, a, i);
          if (f === null && Ly(e, t, i, Oi, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      Ly(e, t, i, null, a);
    }
    var Oi = null;
    function Ro(e, t, a, i) {
      Oi = null;
      var u = vd(i), s = Ys(u);
      if (s !== null) {
        var f = pa(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === Te) {
            var v = wi(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === Q) {
            var y = f.stateNode;
            if (nf(y))
              return xi(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Oi = s, null;
    }
    function lf(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return Lr;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return _i;
        case "message": {
          var t = Dc();
          switch (t) {
            case ss:
              return Lr;
            case Nl:
              return _i;
            case qi:
            case dy:
              return Aa;
            case mu:
              return za;
            default:
              return Aa;
          }
        }
        default:
          return Aa;
      }
    }
    function zs(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function na(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Id(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function To(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var ga = null, wo = null, Ou = null;
    function jl(e) {
      return ga = e, wo = Us(), !0;
    }
    function uf() {
      ga = null, wo = null, Ou = null;
    }
    function Zi() {
      if (Ou)
        return Ou;
      var e, t = wo, a = t.length, i, u = Us(), s = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === u[s - i]; i++)
        ;
      var p = i > 1 ? 1 - i : void 0;
      return Ou = u.slice(e, p), Ou;
    }
    function Us() {
      return "value" in ga ? ga.value : ga.textContent;
    }
    function Fl(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function xo() {
      return !0;
    }
    function js() {
      return !1;
    }
    function xr(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var y = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return y ? this.isDefaultPrevented = xo : this.isDefaultPrevented = js, this.isPropagationStopped = js, this;
      }
      return vt(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = xo);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = xo);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: xo
      }), t;
    }
    var Pn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Ni = xr(Pn), zr = vt({}, Pn, {
      view: 0,
      detail: 0
    }), ra = xr(zr), of, Fs, Nu;
    function my(e) {
      e !== Nu && (Nu && e.type === "mousemove" ? (of = e.screenX - Nu.screenX, Fs = e.screenY - Nu.screenY) : (of = 0, Fs = 0), Nu = e);
    }
    var li = vt({}, zr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: vn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (my(e), of);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Fs;
      }
    }), Yd = xr(li), $d = vt({}, li, {
      dataTransfer: 0
    }), Lu = xr($d), Qd = vt({}, zr, {
      relatedTarget: 0
    }), el = xr(Qd), nh = vt({}, Pn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), rh = xr(nh), Wd = vt({}, Pn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), sf = xr(Wd), yy = vt({}, Pn, {
      data: 0
    }), ah = xr(yy), ih = ah, lh = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, Mu = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function gy(e) {
      if (e.key) {
        var t = lh[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Fl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Mu[e.keyCode] || "Unidentified" : "";
    }
    var bo = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function uh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = bo[e];
      return i ? !!a[i] : !1;
    }
    function vn(e) {
      return uh;
    }
    var Sy = vt({}, zr, {
      key: gy,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: vn,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Fl(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Fl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), oh = xr(Sy), Ey = vt({}, li, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), sh = xr(Ey), ch = vt({}, zr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: vn
    }), fh = xr(ch), Cy = vt({}, Pn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ja = xr(Cy), Gd = vt({}, li, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), Ry = xr(Gd), Hl = [9, 13, 27, 32], Hs = 229, tl = Nn && "CompositionEvent" in window, Pl = null;
    Nn && "documentMode" in document && (Pl = document.documentMode);
    var qd = Nn && "TextEvent" in window && !Pl, cf = Nn && (!tl || Pl && Pl > 8 && Pl <= 11), dh = 32, ff = String.fromCharCode(dh);
    function Ty() {
      Ct("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Ct("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), Ct("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), Ct("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Kd = !1;
    function ph(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function df(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function pf(e, t) {
      return e === "keydown" && t.keyCode === Hs;
    }
    function Xd(e, t) {
      switch (e) {
        case "keyup":
          return Hl.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Hs;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function vf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function vh(e) {
      return e.locale === "ko";
    }
    var Au = !1;
    function Jd(e, t, a, i, u) {
      var s, f;
      if (tl ? s = df(t) : Au ? Xd(t, i) && (s = "onCompositionEnd") : pf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      cf && !vh(i) && (!Au && s === "onCompositionStart" ? Au = jl(u) : s === "onCompositionEnd" && Au && (f = Zi()));
      var p = Ch(a, s);
      if (p.length > 0) {
        var v = new ah(s, t, null, i, u);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var y = vf(i);
          y !== null && (v.data = y);
        }
      }
    }
    function hf(e, t) {
      switch (e) {
        case "compositionend":
          return vf(t);
        case "keypress":
          var a = t.which;
          return a !== dh ? null : (Kd = !0, ff);
        case "textInput":
          var i = t.data;
          return i === ff && Kd ? null : i;
        default:
          return null;
      }
    }
    function Zd(e, t) {
      if (Au) {
        if (e === "compositionend" || !tl && Xd(e, t)) {
          var a = Zi();
          return uf(), Au = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!ph(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return cf && !vh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function mf(e, t, a, i, u) {
      var s;
      if (qd ? s = hf(t, i) : s = Zd(t, i), !s)
        return null;
      var f = Ch(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new ih("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function hh(e, t, a, i, u, s, f) {
      Jd(e, t, a, i, u), mf(e, t, a, i, u);
    }
    var wy = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function Ps(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!wy[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function xy(e) {
      if (!Nn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Vs() {
      Ct("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function mh(e, t, a, i) {
      oo(i);
      var u = Ch(t, "onChange");
      if (u.length > 0) {
        var s = new Ni("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: u
        });
      }
    }
    var Vl = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      mh(t, n, e, vd(e)), kv(o, t);
    }
    function o(e) {
      AE(e, 0);
    }
    function c(e) {
      var t = Rf(e);
      if (gi(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var m = !1;
    Nn && (m = xy("input") && (!document.documentMode || document.documentMode > 9));
    function E(e, t) {
      Vl = e, n = t, Vl.attachEvent("onpropertychange", F);
    }
    function T() {
      Vl && (Vl.detachEvent("onpropertychange", F), Vl = null, n = null);
    }
    function F(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function J(e, t, a) {
      e === "focusin" ? (T(), E(t, a)) : e === "focusout" && T();
    }
    function ne(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function X(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function xe(e, t) {
      if (e === "click")
        return c(t);
    }
    function Me(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function je(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Ge(e, "number", e.value);
    }
    function Dn(e, t, a, i, u, s, f) {
      var p = a ? Rf(a) : window, v, y;
      if (r(p) ? v = d : Ps(p) ? m ? v = Me : (v = ne, y = J) : X(p) && (v = xe), v) {
        var S = v(t, a);
        if (S) {
          mh(e, S, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && je(p);
    }
    function L() {
      Wt("onMouseEnter", ["mouseout", "mouseover"]), Wt("onMouseLeave", ["mouseout", "mouseover"]), Wt("onPointerEnter", ["pointerout", "pointerover"]), Wt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function _(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !rs(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && (Ys(y) || pp(y)))
          return;
      }
      if (!(!v && !p)) {
        var S;
        if (u.window === u)
          S = u;
        else {
          var k = u.ownerDocument;
          k ? S = k.defaultView || k.parentWindow : S = window;
        }
        var b, U;
        if (v) {
          var H = i.relatedTarget || i.toElement;
          if (b = a, U = H ? Ys(H) : null, U !== null) {
            var V = pa(U);
            (U !== V || U.tag !== ae && U.tag !== de) && (U = null);
          }
        } else
          b = null, U = a;
        if (b !== U) {
          var Ee = Yd, qe = "onMouseLeave", Pe = "onMouseEnter", Lt = "mouse";
          (t === "pointerout" || t === "pointerover") && (Ee = sh, qe = "onPointerLeave", Pe = "onPointerEnter", Lt = "pointer");
          var bt = b == null ? S : Rf(b), M = U == null ? S : Rf(U), B = new Ee(qe, Lt + "leave", b, i, u);
          B.target = bt, B.relatedTarget = M;
          var A = null, re = Ys(u);
          if (re === a) {
            var De = new Ee(Pe, Lt + "enter", U, i, u);
            De.target = M, De.relatedTarget = bt, A = De;
          }
          UT(e, B, A, b, U);
        }
      }
    }
    function z(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var Z = typeof Object.is == "function" ? Object.is : z;
    function Ae(e, t) {
      if (Z(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!br.call(t, s) || !Z(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function Xe(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function Ze(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function at(e, t) {
      for (var a = Xe(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Yi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = Xe(Ze(a));
      }
    }
    function tr(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        u.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return Vt(e, u, s, f, p);
    }
    function Vt(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, y = 0, S = e, k = null;
      e: for (; ; ) {
        for (var b = null; S === t && (a === 0 || S.nodeType === Yi) && (f = s + a), S === i && (u === 0 || S.nodeType === Yi) && (p = s + u), S.nodeType === Yi && (s += S.nodeValue.length), (b = S.firstChild) !== null; )
          k = S, S = b;
        for (; ; ) {
          if (S === e)
            break e;
          if (k === t && ++v === a && (f = s), k === i && ++y === u && (p = s), (b = S.nextSibling) !== null)
            break;
          S = k, k = S.parentNode;
        }
        S = b;
      }
      return f === -1 || p === -1 ? null : {
        start: f,
        end: p
      };
    }
    function Bl(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), p = t.end === void 0 ? f : Math.min(t.end, s);
        if (!u.extend && f > p) {
          var v = p;
          p = f, f = v;
        }
        var y = at(e, f), S = at(e, p);
        if (y && S) {
          if (u.rangeCount === 1 && u.anchorNode === y.node && u.anchorOffset === y.offset && u.focusNode === S.node && u.focusOffset === S.offset)
            return;
          var k = a.createRange();
          k.setStart(y.node, y.offset), u.removeAllRanges(), f > p ? (u.addRange(k), u.extend(S.node, S.offset)) : (k.setEnd(S.node, S.offset), u.addRange(k));
        }
      }
    }
    function yh(e) {
      return e && e.nodeType === Yi;
    }
    function TE(e, t) {
      return !e || !t ? !1 : e === t ? !0 : yh(e) ? !1 : yh(t) ? TE(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function gT(e) {
      return e && e.ownerDocument && TE(e.ownerDocument.documentElement, e);
    }
    function ST(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function wE() {
      for (var e = window, t = _a(); t instanceof e.HTMLIFrameElement; ) {
        if (ST(t))
          e = t.contentWindow;
        else
          return t;
        t = _a(e.document);
      }
      return t;
    }
    function by(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function ET() {
      var e = wE();
      return {
        focusedElem: e,
        selectionRange: by(e) ? RT(e) : null
      };
    }
    function CT(e) {
      var t = wE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && gT(a)) {
        i !== null && by(a) && TT(a, i);
        for (var u = [], s = a; s = s.parentNode; )
          s.nodeType === Wr && u.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var f = 0; f < u.length; f++) {
          var p = u[f];
          p.element.scrollLeft = p.left, p.element.scrollTop = p.top;
        }
      }
    }
    function RT(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = tr(e), t || {
        start: 0,
        end: 0
      };
    }
    function TT(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Bl(e, t);
    }
    var wT = Nn && "documentMode" in document && document.documentMode <= 11;
    function xT() {
      Ct("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var yf = null, _y = null, ep = null, ky = !1;
    function bT(e) {
      if ("selectionStart" in e && by(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function _T(e) {
      return e.window === e ? e.document : e.nodeType === $i ? e : e.ownerDocument;
    }
    function xE(e, t, a) {
      var i = _T(a);
      if (!(ky || yf == null || yf !== _a(i))) {
        var u = bT(yf);
        if (!ep || !Ae(ep, u)) {
          ep = u;
          var s = Ch(_y, "onSelect");
          if (s.length > 0) {
            var f = new Ni("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = yf;
          }
        }
      }
    }
    function kT(e, t, a, i, u, s, f) {
      var p = a ? Rf(a) : window;
      switch (t) {
        case "focusin":
          (Ps(p) || p.contentEditable === "true") && (yf = p, _y = a, ep = null);
          break;
        case "focusout":
          yf = null, _y = null, ep = null;
          break;
        case "mousedown":
          ky = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ky = !1, xE(e, i, u);
          break;
        case "selectionchange":
          if (wT)
            break;
        case "keydown":
        case "keyup":
          xE(e, i, u);
      }
    }
    function gh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var gf = {
      animationend: gh("Animation", "AnimationEnd"),
      animationiteration: gh("Animation", "AnimationIteration"),
      animationstart: gh("Animation", "AnimationStart"),
      transitionend: gh("Transition", "TransitionEnd")
    }, Dy = {}, bE = {};
    Nn && (bE = document.createElement("div").style, "AnimationEvent" in window || (delete gf.animationend.animation, delete gf.animationiteration.animation, delete gf.animationstart.animation), "TransitionEvent" in window || delete gf.transitionend.transition);
    function Sh(e) {
      if (Dy[e])
        return Dy[e];
      if (!gf[e])
        return e;
      var t = gf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in bE)
          return Dy[e] = t[a];
      return e;
    }
    var _E = Sh("animationend"), kE = Sh("animationiteration"), DE = Sh("animationstart"), OE = Sh("transitionend"), NE = /* @__PURE__ */ new Map(), LE = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function _o(e, t) {
      NE.set(e, t), Ct(t, [e]);
    }
    function DT() {
      for (var e = 0; e < LE.length; e++) {
        var t = LE[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        _o(a, "on" + i);
      }
      _o(_E, "onAnimationEnd"), _o(kE, "onAnimationIteration"), _o(DE, "onAnimationStart"), _o("dblclick", "onDoubleClick"), _o("focusin", "onFocus"), _o("focusout", "onBlur"), _o(OE, "onTransitionEnd");
    }
    function OT(e, t, a, i, u, s, f) {
      var p = NE.get(t);
      if (p !== void 0) {
        var v = Ni, y = t;
        switch (t) {
          case "keypress":
            if (Fl(i) === 0)
              return;
          case "keydown":
          case "keyup":
            v = oh;
            break;
          case "focusin":
            y = "focus", v = el;
            break;
          case "focusout":
            y = "blur", v = el;
            break;
          case "beforeblur":
          case "afterblur":
            v = el;
            break;
          case "click":
            if (i.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            v = Yd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = Lu;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = fh;
            break;
          case _E:
          case kE:
          case DE:
            v = rh;
            break;
          case OE:
            v = ja;
            break;
          case "scroll":
            v = ra;
            break;
          case "wheel":
            v = Ry;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = sf;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = sh;
            break;
        }
        var S = (s & ka) !== 0;
        {
          var k = !S && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", b = AT(a, p, i.type, S, k);
          if (b.length > 0) {
            var U = new v(p, y, null, i, u);
            e.push({
              event: U,
              listeners: b
            });
          }
        }
      }
    }
    DT(), L(), Vs(), xT(), Ty();
    function NT(e, t, a, i, u, s, f) {
      OT(e, t, a, i, u, s);
      var p = (s & pd) === 0;
      p && (_(e, t, a, i, u), Dn(e, t, a, i, u), kT(e, t, a, i, u), hh(e, t, a, i, u));
    }
    var tp = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Oy = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(tp));
    function ME(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ci(i, t, void 0, e), e.currentTarget = null;
    }
    function LT(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          ME(e, v, p), i = f;
        }
      else
        for (var y = 0; y < t.length; y++) {
          var S = t[y], k = S.instance, b = S.currentTarget, U = S.listener;
          if (k !== i && e.isPropagationStopped())
            return;
          ME(e, U, b), i = k;
        }
    }
    function AE(e, t) {
      for (var a = (t & ka) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        LT(s, f, a);
      }
      ls();
    }
    function MT(e, t, a, i, u) {
      var s = vd(a), f = [];
      NT(f, e, i, a, s, t), AE(f, t);
    }
    function En(e, t) {
      Oy.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = sx(t), u = jT(e);
      i.has(u) || (zE(t, e, mc, a), i.add(u));
    }
    function Ny(e, t, a) {
      Oy.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= ka), zE(a, e, i, t);
    }
    var Eh = "_reactListening" + Math.random().toString(36).slice(2);
    function np(e) {
      if (!e[Eh]) {
        e[Eh] = !0, mt.forEach(function(a) {
          a !== "selectionchange" && (Oy.has(a) || Ny(a, !1, e), Ny(a, !0, e));
        });
        var t = e.nodeType === $i ? e : e.ownerDocument;
        t !== null && (t[Eh] || (t[Eh] = !0, Ny("selectionchange", !1, t)));
      }
    }
    function zE(e, t, a, i, u) {
      var s = cr(e, t, a), f = void 0;
      is && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Id(e, t, s, f) : na(e, t, s) : f !== void 0 ? To(e, t, s, f) : zs(e, t, s);
    }
    function UE(e, t) {
      return e === t || e.nodeType === Mn && e.parentNode === t;
    }
    function Ly(e, t, a, i, u) {
      var s = i;
      if (!(t & dd) && !(t & mc)) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === Q || v === fe) {
              var y = p.stateNode.containerInfo;
              if (UE(y, f))
                break;
              if (v === fe)
                for (var S = p.return; S !== null; ) {
                  var k = S.tag;
                  if (k === Q || k === fe) {
                    var b = S.stateNode.containerInfo;
                    if (UE(b, f))
                      return;
                  }
                  S = S.return;
                }
              for (; y !== null; ) {
                var U = Ys(y);
                if (U === null)
                  return;
                var H = U.tag;
                if (H === ae || H === de) {
                  p = s = U;
                  continue e;
                }
                y = y.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      kv(function() {
        return MT(e, t, a, s);
      });
    }
    function rp(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function AT(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, S = null; y !== null; ) {
        var k = y, b = k.stateNode, U = k.tag;
        if (U === ae && b !== null && (S = b, p !== null)) {
          var H = xl(y, p);
          H != null && v.push(rp(y, H, S));
        }
        if (u)
          break;
        y = y.return;
      }
      return v;
    }
    function Ch(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === ae && f !== null) {
          var v = f, y = xl(u, a);
          y != null && i.unshift(rp(u, y, v));
          var S = xl(u, t);
          S != null && i.push(rp(u, S, v));
        }
        u = u.return;
      }
      return i;
    }
    function Sf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== ae);
      return e || null;
    }
    function zT(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = Sf(s))
        u++;
      for (var f = 0, p = i; p; p = Sf(p))
        f++;
      for (; u - f > 0; )
        a = Sf(a), u--;
      for (; f - u > 0; )
        i = Sf(i), f--;
      for (var v = u; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = Sf(a), i = Sf(i);
      }
      return null;
    }
    function jE(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, S = v.stateNode, k = v.tag;
        if (y !== null && y === i)
          break;
        if (k === ae && S !== null) {
          var b = S;
          if (u) {
            var U = xl(p, s);
            U != null && f.unshift(rp(p, U, b));
          } else if (!u) {
            var H = xl(p, s);
            H != null && f.push(rp(p, H, b));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function UT(e, t, a, i, u) {
      var s = i && u ? zT(i, u) : null;
      i !== null && jE(e, t, i, s, !1), u !== null && a !== null && jE(e, a, u, s, !0);
    }
    function jT(e, t) {
      return e + "__bubble";
    }
    var Fa = !1, ap = "dangerouslySetInnerHTML", Rh = "suppressContentEditableWarning", ko = "suppressHydrationWarning", FE = "autoFocus", Bs = "children", Is = "style", Th = "__html", My, wh, ip, HE, xh, PE, VE;
    My = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, wh = function(e, t) {
      sd(e, t), vc(e, t), xv(e, t, {
        registrationNameDependencies: pt,
        possibleRegistrationNames: yt
      });
    }, PE = Nn && !document.documentMode, ip = function(e, t, a) {
      if (!Fa) {
        var i = bh(a), u = bh(t);
        u !== i && (Fa = !0, g("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, HE = function(e) {
      if (!Fa) {
        Fa = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), g("Extra attributes from the server: %s", t);
      }
    }, xh = function(e, t) {
      t === !1 ? g("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : g("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, VE = function(e, t) {
      var a = e.namespaceURI === Ii ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var FT = /\r\n?/g, HT = /\u0000|\uFFFD/g;
    function bh(e) {
      Kn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(FT, `
`).replace(HT, "");
    }
    function _h(e, t, a, i) {
      var u = bh(t), s = bh(e);
      if (s !== u && (i && (Fa || (Fa = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Ue))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function BE(e) {
      return e.nodeType === $i ? e : e.ownerDocument;
    }
    function PT() {
    }
    function kh(e) {
      e.onclick = PT;
    }
    function VT(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Is)
            f && Object.freeze(f), Sv(t, f);
          else if (s === ap) {
            var p = f ? f[Th] : void 0;
            p != null && uv(t, p);
          } else if (s === Bs)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && ao(t, f);
            } else typeof f == "number" && ao(t, "" + f);
          else s === Rh || s === ko || s === FE || (pt.hasOwnProperty(s) ? f != null && (typeof f != "function" && xh(s, f), s === "onScroll" && En("scroll", t)) : f != null && _r(t, s, f, u));
        }
    }
    function BT(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Is ? Sv(e, f) : s === ap ? uv(e, f) : s === Bs ? ao(e, f) : _r(e, s, f, i);
      }
    }
    function IT(e, t, a, i) {
      var u, s = BE(a), f, p = i;
      if (p === Ii && (p = nd(e)), p === Ii) {
        if (u = Tl(e, t), !u && e !== e.toLowerCase() && g("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var v = s.createElement("div");
          v.innerHTML = "<script><\/script>";
          var y = v.firstChild;
          f = v.removeChild(y);
        } else if (typeof t.is == "string")
          f = s.createElement(e, {
            is: t.is
          });
        else if (f = s.createElement(e), e === "select") {
          var S = f;
          t.multiple ? S.multiple = !0 : t.size && (S.size = t.size);
        }
      } else
        f = s.createElementNS(p, e);
      return p === Ii && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !br.call(My, e) && (My[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function YT(e, t) {
      return BE(t).createTextNode(e);
    }
    function $T(e, t, a, i) {
      var u = Tl(t, a);
      wh(t, a);
      var s;
      switch (t) {
        case "dialog":
          En("cancel", e), En("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          En("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < tp.length; f++)
            En(tp[f], e);
          s = a;
          break;
        case "source":
          En("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          En("error", e), En("load", e), s = a;
          break;
        case "details":
          En("toggle", e), s = a;
          break;
        case "input":
          ei(e, a), s = ro(e, a), En("invalid", e);
          break;
        case "option":
          zt(e, a), s = a;
          break;
        case "select":
          ou(e, a), s = Ko(e, a), En("invalid", e);
          break;
        case "textarea":
          Zf(e, a), s = Jf(e, a), En("invalid", e);
          break;
        default:
          s = a;
      }
      switch (dc(t, s), VT(t, e, i, s, u), t) {
        case "input":
          Za(e), j(e, a, !1);
          break;
        case "textarea":
          Za(e), iv(e);
          break;
        case "option":
          un(e, a);
          break;
        case "select":
          Kf(e, a);
          break;
        default:
          typeof s.onClick == "function" && kh(e);
          break;
      }
    }
    function QT(e, t, a, i, u) {
      wh(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = ro(e, a), p = ro(e, i), s = [];
          break;
        case "select":
          f = Ko(e, a), p = Ko(e, i), s = [];
          break;
        case "textarea":
          f = Jf(e, a), p = Jf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && kh(e);
          break;
      }
      dc(t, p);
      var v, y, S = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Is) {
            var k = f[v];
            for (y in k)
              k.hasOwnProperty(y) && (S || (S = {}), S[y] = "");
          } else v === ap || v === Bs || v === Rh || v === ko || v === FE || (pt.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var b = p[v], U = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || b === U || b == null && U == null))
          if (v === Is)
            if (b && Object.freeze(b), U) {
              for (y in U)
                U.hasOwnProperty(y) && (!b || !b.hasOwnProperty(y)) && (S || (S = {}), S[y] = "");
              for (y in b)
                b.hasOwnProperty(y) && U[y] !== b[y] && (S || (S = {}), S[y] = b[y]);
            } else
              S || (s || (s = []), s.push(v, S)), S = b;
          else if (v === ap) {
            var H = b ? b[Th] : void 0, V = U ? U[Th] : void 0;
            H != null && V !== H && (s = s || []).push(v, H);
          } else v === Bs ? (typeof b == "string" || typeof b == "number") && (s = s || []).push(v, "" + b) : v === Rh || v === ko || (pt.hasOwnProperty(v) ? (b != null && (typeof b != "function" && xh(v, b), v === "onScroll" && En("scroll", e)), !s && U !== b && (s = [])) : (s = s || []).push(v, b));
      }
      return S && (ly(S, p[Is]), (s = s || []).push(Is, S)), s;
    }
    function WT(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = Tl(a, i), f = Tl(a, u);
      switch (BT(e, t, s, f), a) {
        case "input":
          C(e, u);
          break;
        case "textarea":
          av(e, u);
          break;
        case "select":
          sc(e, u);
          break;
      }
    }
    function GT(e) {
      {
        var t = e.toLowerCase();
        return ts.hasOwnProperty(t) && ts[t] || null;
      }
    }
    function qT(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = Tl(t, a), wh(t, a), t) {
        case "dialog":
          En("cancel", e), En("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          En("load", e);
          break;
        case "video":
        case "audio":
          for (var y = 0; y < tp.length; y++)
            En(tp[y], e);
          break;
        case "source":
          En("error", e);
          break;
        case "img":
        case "image":
        case "link":
          En("error", e), En("load", e);
          break;
        case "details":
          En("toggle", e);
          break;
        case "input":
          ei(e, a), En("invalid", e);
          break;
        case "option":
          zt(e, a);
          break;
        case "select":
          ou(e, a), En("invalid", e);
          break;
        case "textarea":
          Zf(e, a), En("invalid", e);
          break;
      }
      dc(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var S = e.attributes, k = 0; k < S.length; k++) {
          var b = S[k].name.toLowerCase();
          switch (b) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(S[k].name);
          }
        }
      }
      var U = null;
      for (var H in a)
        if (a.hasOwnProperty(H)) {
          var V = a[H];
          if (H === Bs)
            typeof V == "string" ? e.textContent !== V && (a[ko] !== !0 && _h(e.textContent, V, s, f), U = [Bs, V]) : typeof V == "number" && e.textContent !== "" + V && (a[ko] !== !0 && _h(e.textContent, V, s, f), U = [Bs, "" + V]);
          else if (pt.hasOwnProperty(H))
            V != null && (typeof V != "function" && xh(H, V), H === "onScroll" && En("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var Ee = void 0, qe = an(H);
            if (a[ko] !== !0) {
              if (!(H === Rh || H === ko || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              H === "value" || H === "checked" || H === "selected")) {
                if (H === ap) {
                  var Pe = e.innerHTML, Lt = V ? V[Th] : void 0;
                  if (Lt != null) {
                    var bt = VE(e, Lt);
                    bt !== Pe && ip(H, Pe, bt);
                  }
                } else if (H === Is) {
                  if (v.delete(H), PE) {
                    var M = ay(V);
                    Ee = e.getAttribute("style"), M !== Ee && ip(H, Ee, M);
                  }
                } else if (p && !D)
                  v.delete(H.toLowerCase()), Ee = tu(e, H, V), V !== Ee && ip(H, Ee, V);
                else if (!hn(H, qe, p) && !Xn(H, V, qe, p)) {
                  var B = !1;
                  if (qe !== null)
                    v.delete(qe.attributeName), Ee = vl(e, H, V, qe);
                  else {
                    var A = i;
                    if (A === Ii && (A = nd(t)), A === Ii)
                      v.delete(H.toLowerCase());
                    else {
                      var re = GT(H);
                      re !== null && re !== H && (B = !0, v.delete(re)), v.delete(H);
                    }
                    Ee = tu(e, H, V);
                  }
                  var De = D;
                  !De && V !== Ee && !B && ip(H, Ee, V);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[ko] !== !0 && HE(v), t) {
        case "input":
          Za(e), j(e, a, !0);
          break;
        case "textarea":
          Za(e), iv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && kh(e);
          break;
      }
      return U;
    }
    function KT(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Ay(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, g("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function zy(e, t) {
      {
        if (Fa)
          return;
        Fa = !0, g('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Uy(e, t, a) {
      {
        if (Fa)
          return;
        Fa = !0, g("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function jy(e, t) {
      {
        if (t === "" || Fa)
          return;
        Fa = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function XT(e, t, a) {
      switch (t) {
        case "input":
          P(e, a);
          return;
        case "textarea":
          ey(e, a);
          return;
        case "select":
          Xf(e, a);
          return;
      }
    }
    var lp = function() {
    }, up = function() {
    };
    {
      var JT = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], IE = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], ZT = IE.concat(["button"]), ew = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], YE = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      up = function(e, t) {
        var a = vt({}, e || YE), i = {
          tag: t
        };
        return IE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), ZT.indexOf(t) !== -1 && (a.pTagInButtonScope = null), JT.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var tw = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return ew.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, nw = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, $E = {};
      lp = function(e, t, a) {
        a = a || YE;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && g("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = tw(e, u) ? null : i, f = s ? null : nw(e, a), p = s || f;
        if (p) {
          var v = p.tag, y = !!s + "|" + e + "|" + v;
          if (!$E[y]) {
            $E[y] = !0;
            var S = e, k = "";
            if (e === "#text" ? /\S/.test(t) ? S = "Text nodes" : (S = "Whitespace text nodes", k = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : S = "<" + e + ">", s) {
              var b = "";
              v === "table" && e === "tr" && (b += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", S, v, k, b);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", S, v);
          }
        }
      };
    }
    var Dh = "suppressHydrationWarning", Oh = "$", Nh = "/$", op = "$?", sp = "$!", rw = "style", Fy = null, Hy = null;
    function aw(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case $i:
        case ad: {
          t = i === $i ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : rd(null, "");
          break;
        }
        default: {
          var s = i === Mn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = rd(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = up(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function iw(e, t, a) {
      {
        var i = e, u = rd(i.namespace, t), s = up(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function qk(e) {
      return e;
    }
    function lw(e) {
      Fy = Hn(), Hy = ET();
      var t = null;
      return Gn(!1), t;
    }
    function uw(e) {
      CT(Hy), Gn(Fy), Fy = null, Hy = null;
    }
    function ow(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (lp(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = up(f.ancestorInfo, e);
          lp(null, p, v);
        }
        s = f.namespace;
      }
      var y = IT(e, t, a, s);
      return dp(u, y), Wy(y, t), y;
    }
    function sw(e, t) {
      e.appendChild(t);
    }
    function cw(e, t, a, i, u) {
      switch ($T(e, t, a, i), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function fw(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = up(f.ancestorInfo, t);
          lp(null, p, v);
        }
      }
      return QT(e, t, a, i);
    }
    function Py(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function dw(e, t, a, i) {
      {
        var u = a;
        lp(null, e, u.ancestorInfo);
      }
      var s = YT(e, t);
      return dp(i, s), s;
    }
    function pw() {
      var e = window.event;
      return e === void 0 ? Aa : lf(e.type);
    }
    var Vy = typeof setTimeout == "function" ? setTimeout : void 0, vw = typeof clearTimeout == "function" ? clearTimeout : void 0, By = -1, QE = typeof Promise == "function" ? Promise : void 0, hw = typeof queueMicrotask == "function" ? queueMicrotask : typeof QE < "u" ? function(e) {
      return QE.resolve(null).then(e).catch(mw);
    } : Vy;
    function mw(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function yw(e, t, a, i) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function gw(e, t, a, i, u, s) {
      WT(e, t, a, i, u), Wy(e, u);
    }
    function WE(e) {
      ao(e, "");
    }
    function Sw(e, t, a) {
      e.nodeValue = a;
    }
    function Ew(e, t) {
      e.appendChild(t);
    }
    function Cw(e, t) {
      var a;
      e.nodeType === Mn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && kh(a);
    }
    function Rw(e, t, a) {
      e.insertBefore(t, a);
    }
    function Tw(e, t, a) {
      e.nodeType === Mn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function ww(e, t) {
      e.removeChild(t);
    }
    function xw(e, t) {
      e.nodeType === Mn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Iy(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === Mn) {
          var s = u.data;
          if (s === Nh)
            if (i === 0) {
              e.removeChild(u), Du(t);
              return;
            } else
              i--;
          else (s === Oh || s === op || s === sp) && i++;
        }
        a = u;
      } while (a);
      Du(t);
    }
    function bw(e, t) {
      e.nodeType === Mn ? Iy(e.parentNode, t) : e.nodeType === Wr && Iy(e, t), Du(e);
    }
    function _w(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function kw(e) {
      e.nodeValue = "";
    }
    function Dw(e, t) {
      e = e;
      var a = t[rw], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = fc("display", i);
    }
    function Ow(e, t) {
      e.nodeValue = t;
    }
    function Nw(e) {
      e.nodeType === Wr ? e.textContent = "" : e.nodeType === $i && e.documentElement && e.removeChild(e.documentElement);
    }
    function Lw(e, t, a) {
      return e.nodeType !== Wr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function Mw(e, t) {
      return t === "" || e.nodeType !== Yi ? null : e;
    }
    function Aw(e) {
      return e.nodeType !== Mn ? null : e;
    }
    function GE(e) {
      return e.data === op;
    }
    function Yy(e) {
      return e.data === sp;
    }
    function zw(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function Uw(e, t) {
      e._reactRetry = t;
    }
    function Lh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Wr || t === Yi)
          break;
        if (t === Mn) {
          var a = e.data;
          if (a === Oh || a === sp || a === op)
            break;
          if (a === Nh)
            return null;
        }
      }
      return e;
    }
    function cp(e) {
      return Lh(e.nextSibling);
    }
    function jw(e) {
      return Lh(e.firstChild);
    }
    function Fw(e) {
      return Lh(e.firstChild);
    }
    function Hw(e) {
      return Lh(e.nextSibling);
    }
    function Pw(e, t, a, i, u, s, f) {
      dp(s, e), Wy(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & Tt) !== Qe;
      return qT(e, t, a, p, i, y, f);
    }
    function Vw(e, t, a, i) {
      return dp(a, e), a.mode & Tt, KT(e, t);
    }
    function Bw(e, t) {
      dp(t, e);
    }
    function Iw(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Nh) {
            if (a === 0)
              return cp(t);
            a--;
          } else (i === Oh || i === sp || i === op) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function qE(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Oh || i === sp || i === op) {
            if (a === 0)
              return t;
            a--;
          } else i === Nh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function Yw(e) {
      Du(e);
    }
    function $w(e) {
      Du(e);
    }
    function Qw(e) {
      return e !== "head" && e !== "body";
    }
    function Ww(e, t, a, i) {
      var u = !0;
      _h(t.nodeValue, a, i, u);
    }
    function Gw(e, t, a, i, u, s) {
      if (t[Dh] !== !0) {
        var f = !0;
        _h(i.nodeValue, u, s, f);
      }
    }
    function qw(e, t) {
      t.nodeType === Wr ? Ay(e, t) : t.nodeType === Mn || zy(e, t);
    }
    function Kw(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Wr ? Ay(a, t) : t.nodeType === Mn || zy(a, t));
      }
    }
    function Xw(e, t, a, i, u) {
      (u || t[Dh] !== !0) && (i.nodeType === Wr ? Ay(a, i) : i.nodeType === Mn || zy(a, i));
    }
    function Jw(e, t, a) {
      Uy(e, t);
    }
    function Zw(e, t) {
      jy(e, t);
    }
    function ex(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Uy(i, t);
      }
    }
    function tx(e, t) {
      {
        var a = e.parentNode;
        a !== null && jy(a, t);
      }
    }
    function nx(e, t, a, i, u, s) {
      (s || t[Dh] !== !0) && Uy(a, i);
    }
    function rx(e, t, a, i, u) {
      (u || t[Dh] !== !0) && jy(a, i);
    }
    function ax(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function ix(e) {
      np(e);
    }
    var Ef = Math.random().toString(36).slice(2), Cf = "__reactFiber$" + Ef, $y = "__reactProps$" + Ef, fp = "__reactContainer$" + Ef, Qy = "__reactEvents$" + Ef, lx = "__reactListeners$" + Ef, ux = "__reactHandles$" + Ef;
    function ox(e) {
      delete e[Cf], delete e[$y], delete e[Qy], delete e[lx], delete e[ux];
    }
    function dp(e, t) {
      t[Cf] = e;
    }
    function Mh(e, t) {
      t[fp] = e;
    }
    function KE(e) {
      e[fp] = null;
    }
    function pp(e) {
      return !!e[fp];
    }
    function Ys(e) {
      var t = e[Cf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[fp] || a[Cf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = qE(e); u !== null; ) {
              var s = u[Cf];
              if (s)
                return s;
              u = qE(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Do(e) {
      var t = e[Cf] || e[fp];
      return t && (t.tag === ae || t.tag === de || t.tag === Te || t.tag === Q) ? t : null;
    }
    function Rf(e) {
      if (e.tag === ae || e.tag === de)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Ah(e) {
      return e[$y] || null;
    }
    function Wy(e, t) {
      e[$y] = t;
    }
    function sx(e) {
      var t = e[Qy];
      return t === void 0 && (t = e[Qy] = /* @__PURE__ */ new Set()), t;
    }
    var XE = {}, JE = x.ReactDebugCurrentFrame;
    function zh(e) {
      if (e) {
        var t = e._owner, a = Pi(e.type, e._source, t ? t.type : null);
        JE.setExtraStackFrame(a);
      } else
        JE.setExtraStackFrame(null);
    }
    function nl(e, t, a, i, u) {
      {
        var s = Function.call.bind(br);
        for (var f in e)
          if (s(e, f)) {
            var p = void 0;
            try {
              if (typeof e[f] != "function") {
                var v = Error((i || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw v.name = "Invariant Violation", v;
              }
              p = e[f](t, f, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (y) {
              p = y;
            }
            p && !(p instanceof Error) && (zh(u), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), zh(null)), p instanceof Error && !(p.message in XE) && (XE[p.message] = !0, zh(u), g("Failed %s type: %s", a, p.message), zh(null));
          }
      }
    }
    var Gy = [], Uh;
    Uh = [];
    var zu = -1;
    function Oo(e) {
      return {
        current: e
      };
    }
    function aa(e, t) {
      if (zu < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== Uh[zu] && g("Unexpected Fiber popped."), e.current = Gy[zu], Gy[zu] = null, Uh[zu] = null, zu--;
    }
    function ia(e, t, a) {
      zu++, Gy[zu] = e.current, Uh[zu] = a, e.current = t;
    }
    var qy;
    qy = {};
    var ui = {};
    Object.freeze(ui);
    var Uu = Oo(ui), Il = Oo(!1), Ky = ui;
    function Tf(e, t, a) {
      return a && Yl(t) ? Ky : Uu.current;
    }
    function ZE(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function wf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return ui;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var p = it(e) || "Unknown";
          nl(i, s, "context", p);
        }
        return u && ZE(e, t, s), s;
      }
    }
    function jh() {
      return Il.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Fh(e) {
      aa(Il, e), aa(Uu, e);
    }
    function Xy(e) {
      aa(Il, e), aa(Uu, e);
    }
    function eC(e, t, a) {
      {
        if (Uu.current !== ui)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ia(Uu, t, e), ia(Il, a, e);
      }
    }
    function tC(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = it(e) || "Unknown";
            qy[s] || (qy[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((it(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = it(e) || "Unknown";
          nl(u, f, "child context", v);
        }
        return vt({}, a, f);
      }
    }
    function Hh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ui;
        return Ky = Uu.current, ia(Uu, a, e), ia(Il, Il.current, e), !0;
      }
    }
    function nC(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = tC(e, t, Ky);
          i.__reactInternalMemoizedMergedChildContext = u, aa(Il, e), aa(Uu, e), ia(Uu, u, e), ia(Il, a, e);
        } else
          aa(Il, e), ia(Il, a, e);
      }
    }
    function cx(e) {
      {
        if (!hu(e) || e.tag !== K)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case Q:
              return t.stateNode.context;
            case K: {
              var a = t.type;
              if (Yl(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var No = 0, Ph = 1, ju = null, Jy = !1, Zy = !1;
    function rC(e) {
      ju === null ? ju = [e] : ju.push(e);
    }
    function fx(e) {
      Jy = !0, rC(e);
    }
    function aC() {
      Jy && Lo();
    }
    function Lo() {
      if (!Zy && ju !== null) {
        Zy = !0;
        var e = 0, t = Ua();
        try {
          var a = !0, i = ju;
          for (Fn(Lr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          ju = null, Jy = !1;
        } catch (s) {
          throw ju !== null && (ju = ju.slice(e + 1)), md(ss, Lo), s;
        } finally {
          Fn(t), Zy = !1;
        }
      }
      return null;
    }
    var xf = [], bf = 0, Vh = null, Bh = 0, Li = [], Mi = 0, $s = null, Fu = 1, Hu = "";
    function dx(e) {
      return Ws(), (e.flags & Ri) !== $e;
    }
    function px(e) {
      return Ws(), Bh;
    }
    function vx() {
      var e = Hu, t = Fu, a = t & ~hx(t);
      return a.toString(32) + e;
    }
    function Qs(e, t) {
      Ws(), xf[bf++] = Bh, xf[bf++] = Vh, Vh = e, Bh = t;
    }
    function iC(e, t, a) {
      Ws(), Li[Mi++] = Fu, Li[Mi++] = Hu, Li[Mi++] = $s, $s = e;
      var i = Fu, u = Hu, s = Ih(i) - 1, f = i & ~(1 << s), p = a + 1, v = Ih(t) + s;
      if (v > 30) {
        var y = s - s % 5, S = (1 << y) - 1, k = (f & S).toString(32), b = f >> y, U = s - y, H = Ih(t) + U, V = p << U, Ee = V | b, qe = k + u;
        Fu = 1 << H | Ee, Hu = qe;
      } else {
        var Pe = p << s, Lt = Pe | f, bt = u;
        Fu = 1 << v | Lt, Hu = bt;
      }
    }
    function eg(e) {
      Ws();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Qs(e, a), iC(e, a, i);
      }
    }
    function Ih(e) {
      return 32 - Un(e);
    }
    function hx(e) {
      return 1 << Ih(e) - 1;
    }
    function tg(e) {
      for (; e === Vh; )
        Vh = xf[--bf], xf[bf] = null, Bh = xf[--bf], xf[bf] = null;
      for (; e === $s; )
        $s = Li[--Mi], Li[Mi] = null, Hu = Li[--Mi], Li[Mi] = null, Fu = Li[--Mi], Li[Mi] = null;
    }
    function mx() {
      return Ws(), $s !== null ? {
        id: Fu,
        overflow: Hu
      } : null;
    }
    function yx(e, t) {
      Ws(), Li[Mi++] = Fu, Li[Mi++] = Hu, Li[Mi++] = $s, Fu = t.id, Hu = t.overflow, $s = e;
    }
    function Ws() {
      jr() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ur = null, Ai = null, rl = !1, Gs = !1, Mo = null;
    function gx() {
      rl && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function lC() {
      Gs = !0;
    }
    function Sx() {
      return Gs;
    }
    function Ex(e) {
      var t = e.stateNode.containerInfo;
      return Ai = Fw(t), Ur = e, rl = !0, Mo = null, Gs = !1, !0;
    }
    function Cx(e, t, a) {
      return Ai = Hw(t), Ur = e, rl = !0, Mo = null, Gs = !1, a !== null && yx(e, a), !0;
    }
    function uC(e, t) {
      switch (e.tag) {
        case Q: {
          qw(e.stateNode.containerInfo, t);
          break;
        }
        case ae: {
          var a = (e.mode & Tt) !== Qe;
          Xw(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case Te: {
          var i = e.memoizedState;
          i.dehydrated !== null && Kw(i.dehydrated, t);
          break;
        }
      }
    }
    function oC(e, t) {
      uC(e, t);
      var a = x1();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Da) : i.push(a);
    }
    function ng(e, t) {
      {
        if (Gs)
          return;
        switch (e.tag) {
          case Q: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ae:
                var i = t.type;
                t.pendingProps, Jw(a, i);
                break;
              case de:
                var u = t.pendingProps;
                Zw(a, u);
                break;
            }
            break;
          }
          case ae: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case ae: {
                var v = t.type, y = t.pendingProps, S = (e.mode & Tt) !== Qe;
                nx(
                  s,
                  f,
                  p,
                  v,
                  y,
                  // TODO: Delete this argument when we remove the legacy root API.
                  S
                );
                break;
              }
              case de: {
                var k = t.pendingProps, b = (e.mode & Tt) !== Qe;
                rx(
                  s,
                  f,
                  p,
                  k,
                  // TODO: Delete this argument when we remove the legacy root API.
                  b
                );
                break;
              }
            }
            break;
          }
          case Te: {
            var U = e.memoizedState, H = U.dehydrated;
            if (H !== null) switch (t.tag) {
              case ae:
                var V = t.type;
                t.pendingProps, ex(H, V);
                break;
              case de:
                var Ee = t.pendingProps;
                tx(H, Ee);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function sC(e, t) {
      t.flags = t.flags & ~qr | yn, ng(e, t);
    }
    function cC(e, t) {
      switch (e.tag) {
        case ae: {
          var a = e.type;
          e.pendingProps;
          var i = Lw(t, a);
          return i !== null ? (e.stateNode = i, Ur = e, Ai = jw(i), !0) : !1;
        }
        case de: {
          var u = e.pendingProps, s = Mw(t, u);
          return s !== null ? (e.stateNode = s, Ur = e, Ai = null, !0) : !1;
        }
        case Te: {
          var f = Aw(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: mx(),
              retryLane: Zr
            };
            e.memoizedState = p;
            var v = b1(f);
            return v.return = e, e.child = v, Ur = e, Ai = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function rg(e) {
      return (e.mode & Tt) !== Qe && (e.flags & Be) === $e;
    }
    function ag(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function ig(e) {
      if (rl) {
        var t = Ai;
        if (!t) {
          rg(e) && (ng(Ur, e), ag()), sC(Ur, e), rl = !1, Ur = e;
          return;
        }
        var a = t;
        if (!cC(e, t)) {
          rg(e) && (ng(Ur, e), ag()), t = cp(a);
          var i = Ur;
          if (!t || !cC(e, t)) {
            sC(Ur, e), rl = !1, Ur = e;
            return;
          }
          oC(i, a);
        }
      }
    }
    function Rx(e, t, a) {
      var i = e.stateNode, u = !Gs, s = Pw(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function Tx(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Vw(t, a, e);
      if (i) {
        var u = Ur;
        if (u !== null)
          switch (u.tag) {
            case Q: {
              var s = u.stateNode.containerInfo, f = (u.mode & Tt) !== Qe;
              Ww(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case ae: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, S = (u.mode & Tt) !== Qe;
              Gw(
                p,
                v,
                y,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                S
              );
              break;
            }
          }
      }
      return i;
    }
    function wx(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Bw(a, e);
    }
    function xx(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Iw(a);
    }
    function fC(e) {
      for (var t = e.return; t !== null && t.tag !== ae && t.tag !== Q && t.tag !== Te; )
        t = t.return;
      Ur = t;
    }
    function Yh(e) {
      if (e !== Ur)
        return !1;
      if (!rl)
        return fC(e), rl = !0, !1;
      if (e.tag !== Q && (e.tag !== ae || Qw(e.type) && !Py(e.type, e.memoizedProps))) {
        var t = Ai;
        if (t)
          if (rg(e))
            dC(e), ag();
          else
            for (; t; )
              oC(e, t), t = cp(t);
      }
      return fC(e), e.tag === Te ? Ai = xx(e) : Ai = Ur ? cp(e.stateNode) : null, !0;
    }
    function bx() {
      return rl && Ai !== null;
    }
    function dC(e) {
      for (var t = Ai; t; )
        uC(e, t), t = cp(t);
    }
    function _f() {
      Ur = null, Ai = null, rl = !1, Gs = !1;
    }
    function pC() {
      Mo !== null && (lR(Mo), Mo = null);
    }
    function jr() {
      return rl;
    }
    function lg(e) {
      Mo === null ? Mo = [e] : Mo.push(e);
    }
    var _x = x.ReactCurrentBatchConfig, kx = null;
    function Dx() {
      return _x.transition;
    }
    var al = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var Ox = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Zt && (t = a), a = a.return;
        return t;
      }, qs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, vp = [], hp = [], mp = [], yp = [], gp = [], Sp = [], Ks = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Ks.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && vp.push(e), e.mode & Zt && typeof t.UNSAFE_componentWillMount == "function" && hp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && mp.push(e), e.mode & Zt && typeof t.UNSAFE_componentWillReceiveProps == "function" && yp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && gp.push(e), e.mode & Zt && typeof t.UNSAFE_componentWillUpdate == "function" && Sp.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        vp.length > 0 && (vp.forEach(function(b) {
          e.add(it(b) || "Component"), Ks.add(b.type);
        }), vp = []);
        var t = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(b) {
          t.add(it(b) || "Component"), Ks.add(b.type);
        }), hp = []);
        var a = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(b) {
          a.add(it(b) || "Component"), Ks.add(b.type);
        }), mp = []);
        var i = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(b) {
          i.add(it(b) || "Component"), Ks.add(b.type);
        }), yp = []);
        var u = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(b) {
          u.add(it(b) || "Component"), Ks.add(b.type);
        }), gp = []);
        var s = /* @__PURE__ */ new Set();
        if (Sp.length > 0 && (Sp.forEach(function(b) {
          s.add(it(b) || "Component"), Ks.add(b.type);
        }), Sp = []), t.size > 0) {
          var f = qs(t);
          g(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = qs(i);
          g(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = qs(s);
          g(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var y = qs(e);
          I(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var S = qs(a);
          I(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, S);
        }
        if (u.size > 0) {
          var k = qs(u);
          I(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, k);
        }
      };
      var $h = /* @__PURE__ */ new Map(), vC = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = Ox(e);
        if (a === null) {
          g("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!vC.has(e.type)) {
          var i = $h.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], $h.set(a, i)), i.push(e));
        }
      }, al.flushLegacyContextWarning = function() {
        $h.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(it(s) || "Component"), vC.add(s.type);
            });
            var u = qs(i);
            try {
              Kt(a), g(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              fn();
            }
          }
        });
      }, al.discardPendingWarnings = function() {
        vp = [], hp = [], mp = [], yp = [], gp = [], Sp = [], $h = /* @__PURE__ */ new Map();
      };
    }
    var ug, og, sg, cg, fg, hC = function(e, t) {
    };
    ug = !1, og = !1, sg = {}, cg = {}, fg = {}, hC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = it(t) || "Component";
        cg[a] || (cg[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function Nx(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Ep(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Zt || Y) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== K) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !Nx(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = it(e) || "Component";
          sg[u] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), sg[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== K)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = p.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var v = f;
          ci(i, "ref");
          var y = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === y)
            return t.ref;
          var S = function(k) {
            var b = v.refs;
            k === null ? delete b[y] : b[y] = k;
          };
          return S._stringRef = y, S;
        } else {
          if (typeof i != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + i + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return i;
    }
    function Qh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Wh(e) {
      {
        var t = it(e) || "Component";
        if (fg[t])
          return;
        fg[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function mC(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function yC(e) {
      function t(M, B) {
        if (e) {
          var A = M.deletions;
          A === null ? (M.deletions = [B], M.flags |= Da) : A.push(B);
        }
      }
      function a(M, B) {
        if (!e)
          return null;
        for (var A = B; A !== null; )
          t(M, A), A = A.sibling;
        return null;
      }
      function i(M, B) {
        for (var A = /* @__PURE__ */ new Map(), re = B; re !== null; )
          re.key !== null ? A.set(re.key, re) : A.set(re.index, re), re = re.sibling;
        return A;
      }
      function u(M, B) {
        var A = ic(M, B);
        return A.index = 0, A.sibling = null, A;
      }
      function s(M, B, A) {
        if (M.index = A, !e)
          return M.flags |= Ri, B;
        var re = M.alternate;
        if (re !== null) {
          var De = re.index;
          return De < B ? (M.flags |= yn, B) : De;
        } else
          return M.flags |= yn, B;
      }
      function f(M) {
        return e && M.alternate === null && (M.flags |= yn), M;
      }
      function p(M, B, A, re) {
        if (B === null || B.tag !== de) {
          var De = lE(A, M.mode, re);
          return De.return = M, De;
        } else {
          var we = u(B, A);
          return we.return = M, we;
        }
      }
      function v(M, B, A, re) {
        var De = A.type;
        if (De === di)
          return S(M, B, A.props.children, re, A.key);
        if (B !== null && (B.elementType === De || // Keep this check inline so it only runs on the false path:
        RR(B, A) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof De == "object" && De !== null && De.$$typeof === lt && mC(De) === B.type)) {
          var we = u(B, A.props);
          return we.ref = Ep(M, B, A), we.return = M, we._debugSource = A._source, we._debugOwner = A._owner, we;
        }
        var rt = iE(A, M.mode, re);
        return rt.ref = Ep(M, B, A), rt.return = M, rt;
      }
      function y(M, B, A, re) {
        if (B === null || B.tag !== fe || B.stateNode.containerInfo !== A.containerInfo || B.stateNode.implementation !== A.implementation) {
          var De = uE(A, M.mode, re);
          return De.return = M, De;
        } else {
          var we = u(B, A.children || []);
          return we.return = M, we;
        }
      }
      function S(M, B, A, re, De) {
        if (B === null || B.tag !== te) {
          var we = Yo(A, M.mode, re, De);
          return we.return = M, we;
        } else {
          var rt = u(B, A);
          return rt.return = M, rt;
        }
      }
      function k(M, B, A) {
        if (typeof B == "string" && B !== "" || typeof B == "number") {
          var re = lE("" + B, M.mode, A);
          return re.return = M, re;
        }
        if (typeof B == "object" && B !== null) {
          switch (B.$$typeof) {
            case kr: {
              var De = iE(B, M.mode, A);
              return De.ref = Ep(M, null, B), De.return = M, De;
            }
            case ar: {
              var we = uE(B, M.mode, A);
              return we.return = M, we;
            }
            case lt: {
              var rt = B._payload, ot = B._init;
              return k(M, ot(rt), A);
            }
          }
          if (St(B) || ct(B)) {
            var tn = Yo(B, M.mode, A, null);
            return tn.return = M, tn;
          }
          Qh(M, B);
        }
        return typeof B == "function" && Wh(M), null;
      }
      function b(M, B, A, re) {
        var De = B !== null ? B.key : null;
        if (typeof A == "string" && A !== "" || typeof A == "number")
          return De !== null ? null : p(M, B, "" + A, re);
        if (typeof A == "object" && A !== null) {
          switch (A.$$typeof) {
            case kr:
              return A.key === De ? v(M, B, A, re) : null;
            case ar:
              return A.key === De ? y(M, B, A, re) : null;
            case lt: {
              var we = A._payload, rt = A._init;
              return b(M, B, rt(we), re);
            }
          }
          if (St(A) || ct(A))
            return De !== null ? null : S(M, B, A, re, null);
          Qh(M, A);
        }
        return typeof A == "function" && Wh(M), null;
      }
      function U(M, B, A, re, De) {
        if (typeof re == "string" && re !== "" || typeof re == "number") {
          var we = M.get(A) || null;
          return p(B, we, "" + re, De);
        }
        if (typeof re == "object" && re !== null) {
          switch (re.$$typeof) {
            case kr: {
              var rt = M.get(re.key === null ? A : re.key) || null;
              return v(B, rt, re, De);
            }
            case ar: {
              var ot = M.get(re.key === null ? A : re.key) || null;
              return y(B, ot, re, De);
            }
            case lt:
              var tn = re._payload, Bt = re._init;
              return U(M, B, A, Bt(tn), De);
          }
          if (St(re) || ct(re)) {
            var qn = M.get(A) || null;
            return S(B, qn, re, De, null);
          }
          Qh(B, re);
        }
        return typeof re == "function" && Wh(B), null;
      }
      function H(M, B, A) {
        {
          if (typeof M != "object" || M === null)
            return B;
          switch (M.$$typeof) {
            case kr:
            case ar:
              hC(M, A);
              var re = M.key;
              if (typeof re != "string")
                break;
              if (B === null) {
                B = /* @__PURE__ */ new Set(), B.add(re);
                break;
              }
              if (!B.has(re)) {
                B.add(re);
                break;
              }
              g("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", re);
              break;
            case lt:
              var De = M._payload, we = M._init;
              H(we(De), B, A);
              break;
          }
        }
        return B;
      }
      function V(M, B, A, re) {
        for (var De = null, we = 0; we < A.length; we++) {
          var rt = A[we];
          De = H(rt, De, M);
        }
        for (var ot = null, tn = null, Bt = B, qn = 0, It = 0, Vn = null; Bt !== null && It < A.length; It++) {
          Bt.index > It ? (Vn = Bt, Bt = null) : Vn = Bt.sibling;
          var ua = b(M, Bt, A[It], re);
          if (ua === null) {
            Bt === null && (Bt = Vn);
            break;
          }
          e && Bt && ua.alternate === null && t(M, Bt), qn = s(ua, qn, It), tn === null ? ot = ua : tn.sibling = ua, tn = ua, Bt = Vn;
        }
        if (It === A.length) {
          if (a(M, Bt), jr()) {
            var Yr = It;
            Qs(M, Yr);
          }
          return ot;
        }
        if (Bt === null) {
          for (; It < A.length; It++) {
            var si = k(M, A[It], re);
            si !== null && (qn = s(si, qn, It), tn === null ? ot = si : tn.sibling = si, tn = si);
          }
          if (jr()) {
            var Ra = It;
            Qs(M, Ra);
          }
          return ot;
        }
        for (var Ta = i(M, Bt); It < A.length; It++) {
          var oa = U(Ta, M, It, A[It], re);
          oa !== null && (e && oa.alternate !== null && Ta.delete(oa.key === null ? It : oa.key), qn = s(oa, qn, It), tn === null ? ot = oa : tn.sibling = oa, tn = oa);
        }
        if (e && Ta.forEach(function(Qf) {
          return t(M, Qf);
        }), jr()) {
          var Qu = It;
          Qs(M, Qu);
        }
        return ot;
      }
      function Ee(M, B, A, re) {
        var De = ct(A);
        if (typeof De != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          A[Symbol.toStringTag] === "Generator" && (og || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), og = !0), A.entries === De && (ug || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), ug = !0);
          var we = De.call(A);
          if (we)
            for (var rt = null, ot = we.next(); !ot.done; ot = we.next()) {
              var tn = ot.value;
              rt = H(tn, rt, M);
            }
        }
        var Bt = De.call(A);
        if (Bt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var qn = null, It = null, Vn = B, ua = 0, Yr = 0, si = null, Ra = Bt.next(); Vn !== null && !Ra.done; Yr++, Ra = Bt.next()) {
          Vn.index > Yr ? (si = Vn, Vn = null) : si = Vn.sibling;
          var Ta = b(M, Vn, Ra.value, re);
          if (Ta === null) {
            Vn === null && (Vn = si);
            break;
          }
          e && Vn && Ta.alternate === null && t(M, Vn), ua = s(Ta, ua, Yr), It === null ? qn = Ta : It.sibling = Ta, It = Ta, Vn = si;
        }
        if (Ra.done) {
          if (a(M, Vn), jr()) {
            var oa = Yr;
            Qs(M, oa);
          }
          return qn;
        }
        if (Vn === null) {
          for (; !Ra.done; Yr++, Ra = Bt.next()) {
            var Qu = k(M, Ra.value, re);
            Qu !== null && (ua = s(Qu, ua, Yr), It === null ? qn = Qu : It.sibling = Qu, It = Qu);
          }
          if (jr()) {
            var Qf = Yr;
            Qs(M, Qf);
          }
          return qn;
        }
        for (var Jp = i(M, Vn); !Ra.done; Yr++, Ra = Bt.next()) {
          var Jl = U(Jp, M, Yr, Ra.value, re);
          Jl !== null && (e && Jl.alternate !== null && Jp.delete(Jl.key === null ? Yr : Jl.key), ua = s(Jl, ua, Yr), It === null ? qn = Jl : It.sibling = Jl, It = Jl);
        }
        if (e && Jp.forEach(function(rk) {
          return t(M, rk);
        }), jr()) {
          var nk = Yr;
          Qs(M, nk);
        }
        return qn;
      }
      function qe(M, B, A, re) {
        if (B !== null && B.tag === de) {
          a(M, B.sibling);
          var De = u(B, A);
          return De.return = M, De;
        }
        a(M, B);
        var we = lE(A, M.mode, re);
        return we.return = M, we;
      }
      function Pe(M, B, A, re) {
        for (var De = A.key, we = B; we !== null; ) {
          if (we.key === De) {
            var rt = A.type;
            if (rt === di) {
              if (we.tag === te) {
                a(M, we.sibling);
                var ot = u(we, A.props.children);
                return ot.return = M, ot._debugSource = A._source, ot._debugOwner = A._owner, ot;
              }
            } else if (we.elementType === rt || // Keep this check inline so it only runs on the false path:
            RR(we, A) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof rt == "object" && rt !== null && rt.$$typeof === lt && mC(rt) === we.type) {
              a(M, we.sibling);
              var tn = u(we, A.props);
              return tn.ref = Ep(M, we, A), tn.return = M, tn._debugSource = A._source, tn._debugOwner = A._owner, tn;
            }
            a(M, we);
            break;
          } else
            t(M, we);
          we = we.sibling;
        }
        if (A.type === di) {
          var Bt = Yo(A.props.children, M.mode, re, A.key);
          return Bt.return = M, Bt;
        } else {
          var qn = iE(A, M.mode, re);
          return qn.ref = Ep(M, B, A), qn.return = M, qn;
        }
      }
      function Lt(M, B, A, re) {
        for (var De = A.key, we = B; we !== null; ) {
          if (we.key === De)
            if (we.tag === fe && we.stateNode.containerInfo === A.containerInfo && we.stateNode.implementation === A.implementation) {
              a(M, we.sibling);
              var rt = u(we, A.children || []);
              return rt.return = M, rt;
            } else {
              a(M, we);
              break;
            }
          else
            t(M, we);
          we = we.sibling;
        }
        var ot = uE(A, M.mode, re);
        return ot.return = M, ot;
      }
      function bt(M, B, A, re) {
        var De = typeof A == "object" && A !== null && A.type === di && A.key === null;
        if (De && (A = A.props.children), typeof A == "object" && A !== null) {
          switch (A.$$typeof) {
            case kr:
              return f(Pe(M, B, A, re));
            case ar:
              return f(Lt(M, B, A, re));
            case lt:
              var we = A._payload, rt = A._init;
              return bt(M, B, rt(we), re);
          }
          if (St(A))
            return V(M, B, A, re);
          if (ct(A))
            return Ee(M, B, A, re);
          Qh(M, A);
        }
        return typeof A == "string" && A !== "" || typeof A == "number" ? f(qe(M, B, "" + A, re)) : (typeof A == "function" && Wh(M), a(M, B));
      }
      return bt;
    }
    var kf = yC(!0), gC = yC(!1);
    function Lx(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = ic(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = ic(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function Mx(e, t) {
      for (var a = e.child; a !== null; )
        E1(a, t), a = a.sibling;
    }
    var dg = Oo(null), pg;
    pg = {};
    var Gh = null, Df = null, vg = null, qh = !1;
    function Kh() {
      Gh = null, Df = null, vg = null, qh = !1;
    }
    function SC() {
      qh = !0;
    }
    function EC() {
      qh = !1;
    }
    function CC(e, t, a) {
      ia(dg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== pg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = pg;
    }
    function hg(e, t) {
      var a = dg.current;
      aa(dg, t), e._currentValue = a;
    }
    function mg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (ku(i.childLanes, t) ? u !== null && !ku(u.childLanes, t) && (u.childLanes = dt(u.childLanes, t)) : (i.childLanes = dt(i.childLanes, t), u !== null && (u.childLanes = dt(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ax(e, t, a) {
      zx(e, t, a);
    }
    function zx(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === K) {
                var p = Ts(a), v = Pu(nn, p);
                v.tag = Jh;
                var y = i.updateQueue;
                if (y !== null) {
                  var S = y.shared, k = S.pending;
                  k === null ? v.next = v : (v.next = k.next, k.next = v), S.pending = v;
                }
              }
              i.lanes = dt(i.lanes, a);
              var b = i.alternate;
              b !== null && (b.lanes = dt(b.lanes, a)), mg(i.return, a, e), s.lanes = dt(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === pe)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === We) {
          var U = i.return;
          if (U === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          U.lanes = dt(U.lanes, a);
          var H = U.alternate;
          H !== null && (H.lanes = dt(H.lanes, a)), mg(U, a, e), u = i.sibling;
        } else
          u = i.child;
        if (u !== null)
          u.return = i;
        else
          for (u = i; u !== null; ) {
            if (u === e) {
              u = null;
              break;
            }
            var V = u.sibling;
            if (V !== null) {
              V.return = u.return, u = V;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Of(e, t) {
      Gh = e, Df = null, vg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ea(a.lanes, t) && zp(), a.firstContext = null);
      }
    }
    function nr(e) {
      qh && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (vg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Df === null) {
          if (Gh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Df = a, Gh.dependencies = {
            lanes: q,
            firstContext: a
          };
        } else
          Df = Df.next = a;
      }
      return t;
    }
    var Xs = null;
    function yg(e) {
      Xs === null ? Xs = [e] : Xs.push(e);
    }
    function Ux() {
      if (Xs !== null) {
        for (var e = 0; e < Xs.length; e++) {
          var t = Xs[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, u = t.pending;
            if (u !== null) {
              var s = u.next;
              u.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        Xs = null;
      }
    }
    function RC(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, yg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Xh(e, i);
    }
    function jx(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, yg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function Fx(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, yg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Xh(e, i);
    }
    function Ha(e, t) {
      return Xh(e, t);
    }
    var Hx = Xh;
    function Xh(e, t) {
      e.lanes = dt(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = dt(a.lanes, t)), a === null && (e.flags & (yn | qr)) !== $e && gR(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = dt(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = dt(a.childLanes, t) : (u.flags & (yn | qr)) !== $e && gR(e), i = u, u = u.return;
      if (i.tag === Q) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var TC = 0, wC = 1, Jh = 2, gg = 3, Zh = !1, Sg, em;
    Sg = !1, em = null;
    function Eg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: q
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function xC(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var u = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = u;
      }
    }
    function Pu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: TC,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Ao(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (em === u && !Sg && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), Sg = !0), j_()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, Hx(e, a);
      } else
        return Fx(e, u, t, a);
    }
    function tm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (Md(a)) {
          var s = u.lanes;
          s = zd(s, e.pendingLanes);
          var f = dt(s, a);
          u.lanes = f, tf(e, f);
        }
      }
    }
    function Cg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var u = i.updateQueue;
        if (a === u) {
          var s = null, f = null, p = a.firstBaseUpdate;
          if (p !== null) {
            var v = p;
            do {
              var y = {
                eventTime: v.eventTime,
                lane: v.lane,
                tag: v.tag,
                payload: v.payload,
                callback: v.callback,
                next: null
              };
              f === null ? s = f = y : (f.next = y, f = y), v = v.next;
            } while (v !== null);
            f === null ? s = f = t : (f.next = t, f = t);
          } else
            s = f = t;
          a = {
            baseState: u.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: f,
            shared: u.shared,
            effects: u.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var S = a.lastBaseUpdate;
      S === null ? a.firstBaseUpdate = t : S.next = t, a.lastBaseUpdate = t;
    }
    function Px(e, t, a, i, u, s) {
      switch (a.tag) {
        case wC: {
          var f = a.payload;
          if (typeof f == "function") {
            SC();
            var p = f.call(s, i, u);
            {
              if (e.mode & Zt) {
                gn(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  gn(!1);
                }
              }
              EC();
            }
            return p;
          }
          return f;
        }
        case gg:
          e.flags = e.flags & ~Jn | Be;
        case TC: {
          var v = a.payload, y;
          if (typeof v == "function") {
            SC(), y = v.call(s, i, u);
            {
              if (e.mode & Zt) {
                gn(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  gn(!1);
                }
              }
              EC();
            }
          } else
            y = v;
          return y == null ? i : vt({}, i, y);
        }
        case Jh:
          return Zh = !0, i;
      }
      return i;
    }
    function nm(e, t, a, i) {
      var u = e.updateQueue;
      Zh = !1, em = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, y = v.next;
        v.next = null, f === null ? s = y : f.next = y, f = v;
        var S = e.alternate;
        if (S !== null) {
          var k = S.updateQueue, b = k.lastBaseUpdate;
          b !== f && (b === null ? k.firstBaseUpdate = y : b.next = y, k.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var U = u.baseState, H = q, V = null, Ee = null, qe = null, Pe = s;
        do {
          var Lt = Pe.lane, bt = Pe.eventTime;
          if (ku(i, Lt)) {
            if (qe !== null) {
              var B = {
                eventTime: bt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: jt,
                tag: Pe.tag,
                payload: Pe.payload,
                callback: Pe.callback,
                next: null
              };
              qe = qe.next = B;
            }
            U = Px(e, u, Pe, U, t, a);
            var A = Pe.callback;
            if (A !== null && // If the update was already committed, we should not queue its
            // callback again.
            Pe.lane !== jt) {
              e.flags |= on;
              var re = u.effects;
              re === null ? u.effects = [Pe] : re.push(Pe);
            }
          } else {
            var M = {
              eventTime: bt,
              lane: Lt,
              tag: Pe.tag,
              payload: Pe.payload,
              callback: Pe.callback,
              next: null
            };
            qe === null ? (Ee = qe = M, V = U) : qe = qe.next = M, H = dt(H, Lt);
          }
          if (Pe = Pe.next, Pe === null) {
            if (p = u.shared.pending, p === null)
              break;
            var De = p, we = De.next;
            De.next = null, Pe = we, u.lastBaseUpdate = De, u.shared.pending = null;
          }
        } while (!0);
        qe === null && (V = U), u.baseState = V, u.firstBaseUpdate = Ee, u.lastBaseUpdate = qe;
        var rt = u.shared.interleaved;
        if (rt !== null) {
          var ot = rt;
          do
            H = dt(H, ot.lane), ot = ot.next;
          while (ot !== rt);
        } else s === null && (u.shared.lanes = q);
        Wp(H), e.lanes = H, e.memoizedState = U;
      }
      em = null;
    }
    function Vx(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function bC() {
      Zh = !1;
    }
    function rm() {
      return Zh;
    }
    function _C(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, Vx(f, a));
        }
    }
    var Cp = {}, zo = Oo(Cp), Rp = Oo(Cp), am = Oo(Cp);
    function im(e) {
      if (e === Cp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function kC() {
      var e = im(am.current);
      return e;
    }
    function Rg(e, t) {
      ia(am, t, e), ia(Rp, e, e), ia(zo, Cp, e);
      var a = aw(t);
      aa(zo, e), ia(zo, a, e);
    }
    function Nf(e) {
      aa(zo, e), aa(Rp, e), aa(am, e);
    }
    function Tg() {
      var e = im(zo.current);
      return e;
    }
    function DC(e) {
      im(am.current);
      var t = im(zo.current), a = iw(t, e.type);
      t !== a && (ia(Rp, e, e), ia(zo, a, e));
    }
    function wg(e) {
      Rp.current === e && (aa(zo, e), aa(Rp, e));
    }
    var Bx = 0, OC = 1, NC = 1, Tp = 2, il = Oo(Bx);
    function xg(e, t) {
      return (e & t) !== 0;
    }
    function Lf(e) {
      return e & OC;
    }
    function bg(e, t) {
      return e & OC | t;
    }
    function Ix(e, t) {
      return e | t;
    }
    function Uo(e, t) {
      ia(il, t, e);
    }
    function Mf(e) {
      aa(il, e);
    }
    function Yx(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function lm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === Te) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || GE(i) || Yy(i))
              return t;
          }
        } else if (t.tag === ft && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & Be) !== $e;
          if (u)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Pa = (
      /*   */
      0
    ), fr = (
      /* */
      1
    ), $l = (
      /*  */
      2
    ), dr = (
      /*    */
      4
    ), Fr = (
      /*   */
      8
    ), _g = [];
    function kg() {
      for (var e = 0; e < _g.length; e++) {
        var t = _g[e];
        t._workInProgressVersionPrimary = null;
      }
      _g.length = 0;
    }
    function $x(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var be = x.ReactCurrentDispatcher, wp = x.ReactCurrentBatchConfig, Dg, Af;
    Dg = /* @__PURE__ */ new Set();
    var Js = q, en = null, pr = null, vr = null, um = !1, xp = !1, bp = 0, Qx = 0, Wx = 25, $ = null, zi = null, jo = -1, Og = !1;
    function Qt() {
      {
        var e = $;
        zi === null ? zi = [e] : zi.push(e);
      }
    }
    function me() {
      {
        var e = $;
        zi !== null && (jo++, zi[jo] !== e && Gx(e));
      }
    }
    function zf(e) {
      e != null && !St(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", $, typeof e);
    }
    function Gx(e) {
      {
        var t = it(en);
        if (!Dg.has(t) && (Dg.add(t), zi !== null)) {
          for (var a = "", i = 30, u = 0; u <= jo; u++) {
            for (var s = zi[u], f = u === jo ? e : s, p = u + 1 + ". " + s; p.length < i; )
              p += " ";
            p += f + `
`, a += p;
          }
          g(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function la() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function Ng(e, t) {
      if (Og)
        return !1;
      if (t === null)
        return g("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", $), !1;
      e.length !== t.length && g(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, $, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!Z(e[a], t[a]))
          return !1;
      return !0;
    }
    function Uf(e, t, a, i, u, s) {
      Js = s, en = t, zi = e !== null ? e._debugHookTypes : null, jo = -1, Og = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = q, e !== null && e.memoizedState !== null ? be.current = ZC : zi !== null ? be.current = JC : be.current = XC;
      var f = a(i, u);
      if (xp) {
        var p = 0;
        do {
          if (xp = !1, bp = 0, p >= Wx)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Og = !1, pr = null, vr = null, t.updateQueue = null, jo = -1, be.current = e0, f = a(i, u);
        } while (xp);
      }
      be.current = Em, t._debugHookTypes = zi;
      var v = pr !== null && pr.next !== null;
      if (Js = q, en = null, pr = null, vr = null, $ = null, zi = null, jo = -1, e !== null && (e.flags & zn) !== (t.flags & zn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & Tt) !== Qe && g("Internal React error: Expected static flag was missing. Please notify the React team."), um = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function jf() {
      var e = bp !== 0;
      return bp = 0, e;
    }
    function LC(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Pt) !== Qe ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = ws(e.lanes, a);
    }
    function MC() {
      if (be.current = Em, um) {
        for (var e = en.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        um = !1;
      }
      Js = q, en = null, pr = null, vr = null, zi = null, jo = -1, $ = null, QC = !1, xp = !1, bp = 0;
    }
    function Ql() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return vr === null ? en.memoizedState = vr = e : vr = vr.next = e, vr;
    }
    function Ui() {
      var e;
      if (pr === null) {
        var t = en.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = pr.next;
      var a;
      if (vr === null ? a = en.memoizedState : a = vr.next, a !== null)
        vr = a, a = vr.next, pr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        pr = e;
        var i = {
          memoizedState: pr.memoizedState,
          baseState: pr.baseState,
          baseQueue: pr.baseQueue,
          queue: pr.queue,
          next: null
        };
        vr === null ? en.memoizedState = vr = i : vr = vr.next = i;
      }
      return vr;
    }
    function AC() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Lg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Mg(e, t, a) {
      var i = Ql(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: q,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = Jx.bind(null, en, s);
      return [i.memoizedState, f];
    }
    function Ag(e, t, a) {
      var i = Ui(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = pr, f = s.baseQueue, p = u.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, y = p.next;
          f.next = y, p.next = v;
        }
        s.baseQueue !== f && g("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, u.pending = null;
      }
      if (f !== null) {
        var S = f.next, k = s.baseState, b = null, U = null, H = null, V = S;
        do {
          var Ee = V.lane;
          if (ku(Js, Ee)) {
            if (H !== null) {
              var Pe = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: jt,
                action: V.action,
                hasEagerState: V.hasEagerState,
                eagerState: V.eagerState,
                next: null
              };
              H = H.next = Pe;
            }
            if (V.hasEagerState)
              k = V.eagerState;
            else {
              var Lt = V.action;
              k = e(k, Lt);
            }
          } else {
            var qe = {
              lane: Ee,
              action: V.action,
              hasEagerState: V.hasEagerState,
              eagerState: V.eagerState,
              next: null
            };
            H === null ? (U = H = qe, b = k) : H = H.next = qe, en.lanes = dt(en.lanes, Ee), Wp(Ee);
          }
          V = V.next;
        } while (V !== null && V !== S);
        H === null ? b = k : H.next = U, Z(k, i.memoizedState) || zp(), i.memoizedState = k, i.baseState = b, i.baseQueue = H, u.lastRenderedState = k;
      }
      var bt = u.interleaved;
      if (bt !== null) {
        var M = bt;
        do {
          var B = M.lane;
          en.lanes = dt(en.lanes, B), Wp(B), M = M.next;
        } while (M !== bt);
      } else f === null && (u.lanes = q);
      var A = u.dispatch;
      return [i.memoizedState, A];
    }
    function zg(e, t, a) {
      var i = Ui(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = u.dispatch, f = u.pending, p = i.memoizedState;
      if (f !== null) {
        u.pending = null;
        var v = f.next, y = v;
        do {
          var S = y.action;
          p = e(p, S), y = y.next;
        } while (y !== v);
        Z(p, i.memoizedState) || zp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function Kk(e, t, a) {
    }
    function Xk(e, t, a) {
    }
    function Ug(e, t, a) {
      var i = en, u = Ql(), s, f = jr();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), Af || s !== a() && (g("The result of getServerSnapshot should be cached to avoid an infinite loop"), Af = !0);
      } else {
        if (s = t(), !Af) {
          var p = t();
          Z(s, p) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), Af = !0);
        }
        var v = Hm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(v, Js) || zC(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, dm(jC.bind(null, i, y, e), [e]), i.flags |= Gr, _p(fr | Fr, UC.bind(null, i, y, s, t), void 0, null), s;
    }
    function om(e, t, a) {
      var i = en, u = Ui(), s = t();
      if (!Af) {
        var f = t();
        Z(s, f) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), Af = !0);
      }
      var p = u.memoizedState, v = !Z(p, s);
      v && (u.memoizedState = s, zp());
      var y = u.queue;
      if (Dp(jC.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      vr !== null && vr.memoizedState.tag & fr) {
        i.flags |= Gr, _p(fr | Fr, UC.bind(null, i, y, s, t), void 0, null);
        var S = Hm();
        if (S === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(S, Js) || zC(i, t, s);
      }
      return s;
    }
    function zC(e, t, a) {
      e.flags |= vo;
      var i = {
        getSnapshot: t,
        value: a
      }, u = en.updateQueue;
      if (u === null)
        u = AC(), en.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function UC(e, t, a, i) {
      t.value = a, t.getSnapshot = i, FC(t) && HC(e);
    }
    function jC(e, t, a) {
      var i = function() {
        FC(t) && HC(e);
      };
      return a(i);
    }
    function FC(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !Z(a, i);
      } catch {
        return !0;
      }
    }
    function HC(e) {
      var t = Ha(e, tt);
      t !== null && gr(t, e, tt, nn);
    }
    function sm(e) {
      var t = Ql();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: q,
        dispatch: null,
        lastRenderedReducer: Lg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = Zx.bind(null, en, a);
      return [t.memoizedState, i];
    }
    function jg(e) {
      return Ag(Lg);
    }
    function Fg(e) {
      return zg(Lg);
    }
    function _p(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = en.updateQueue;
      if (s === null)
        s = AC(), en.updateQueue = s, s.lastEffect = u.next = u;
      else {
        var f = s.lastEffect;
        if (f === null)
          s.lastEffect = u.next = u;
        else {
          var p = f.next;
          f.next = u, u.next = p, s.lastEffect = u;
        }
      }
      return u;
    }
    function Hg(e) {
      var t = Ql();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function cm(e) {
      var t = Ui();
      return t.memoizedState;
    }
    function kp(e, t, a, i) {
      var u = Ql(), s = i === void 0 ? null : i;
      en.flags |= e, u.memoizedState = _p(fr | t, a, void 0, s);
    }
    function fm(e, t, a, i) {
      var u = Ui(), s = i === void 0 ? null : i, f = void 0;
      if (pr !== null) {
        var p = pr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (Ng(s, v)) {
            u.memoizedState = _p(t, a, f, s);
            return;
          }
        }
      }
      en.flags |= e, u.memoizedState = _p(fr | t, a, f, s);
    }
    function dm(e, t) {
      return (en.mode & Pt) !== Qe ? kp(Ti | Gr | bc, Fr, e, t) : kp(Gr | bc, Fr, e, t);
    }
    function Dp(e, t) {
      return fm(Gr, Fr, e, t);
    }
    function Pg(e, t) {
      return kp(Dt, $l, e, t);
    }
    function pm(e, t) {
      return fm(Dt, $l, e, t);
    }
    function Vg(e, t) {
      var a = Dt;
      return a |= Wi, (en.mode & Pt) !== Qe && (a |= _l), kp(a, dr, e, t);
    }
    function vm(e, t) {
      return fm(Dt, dr, e, t);
    }
    function PC(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var u = t;
        u.hasOwnProperty("current") || g("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(u).join(", ") + "}");
        var s = e();
        return u.current = s, function() {
          u.current = null;
        };
      }
    }
    function Bg(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = Dt;
      return u |= Wi, (en.mode & Pt) !== Qe && (u |= _l), kp(u, dr, PC.bind(null, t, e), i);
    }
    function hm(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return fm(Dt, dr, PC.bind(null, t, e), i);
    }
    function qx(e, t) {
    }
    var mm = qx;
    function Ig(e, t) {
      var a = Ql(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function ym(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Ng(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Yg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function gm(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Ng(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function $g(e) {
      var t = Ql();
      return t.memoizedState = e, e;
    }
    function VC(e) {
      var t = Ui(), a = pr, i = a.memoizedState;
      return IC(t, i, e);
    }
    function BC(e) {
      var t = Ui();
      if (pr === null)
        return t.memoizedState = e, e;
      var a = pr.memoizedState;
      return IC(t, a, e);
    }
    function IC(e, t, a) {
      var i = !Nd(Js);
      if (i) {
        if (!Z(a, t)) {
          var u = Ad();
          en.lanes = dt(en.lanes, u), Wp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, zp()), e.memoizedState = a, a;
    }
    function Kx(e, t, a) {
      var i = Ua();
      Fn(qv(i, _i)), e(!0);
      var u = wp.transition;
      wp.transition = {};
      var s = wp.transition;
      wp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Fn(i), wp.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && I("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Qg() {
      var e = sm(!1), t = e[0], a = e[1], i = Kx.bind(null, a), u = Ql();
      return u.memoizedState = i, [t, i];
    }
    function YC() {
      var e = jg(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    function $C() {
      var e = Fg(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    var QC = !1;
    function Xx() {
      return QC;
    }
    function Wg() {
      var e = Ql(), t = Hm(), a = t.identifierPrefix, i;
      if (jr()) {
        var u = vx();
        i = ":" + a + "R" + u;
        var s = bp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = Qx++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function Sm() {
      var e = Ui(), t = e.memoizedState;
      return t;
    }
    function Jx(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Bo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (WC(e))
        GC(t, u);
      else {
        var s = RC(e, t, u, i);
        if (s !== null) {
          var f = Ca();
          gr(s, e, i, f), qC(s, t, i);
        }
      }
      KC(e, i);
    }
    function Zx(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Bo(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (WC(e))
        GC(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === q && (s === null || s.lanes === q)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = be.current, be.current = ll;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, Z(y, v)) {
                jx(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              be.current = p;
            }
          }
        }
        var S = RC(e, t, u, i);
        if (S !== null) {
          var k = Ca();
          gr(S, e, i, k), qC(S, t, i);
        }
      }
      KC(e, i);
    }
    function WC(e) {
      var t = e.alternate;
      return e === en || t !== null && t === en;
    }
    function GC(e, t) {
      xp = um = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function qC(e, t, a) {
      if (Md(a)) {
        var i = t.lanes;
        i = zd(i, e.pendingLanes);
        var u = dt(i, a);
        t.lanes = u, tf(e, u);
      }
    }
    function KC(e, t, a) {
      vs(e, t);
    }
    var Em = {
      readContext: nr,
      useCallback: la,
      useContext: la,
      useEffect: la,
      useImperativeHandle: la,
      useInsertionEffect: la,
      useLayoutEffect: la,
      useMemo: la,
      useReducer: la,
      useRef: la,
      useState: la,
      useDebugValue: la,
      useDeferredValue: la,
      useTransition: la,
      useMutableSource: la,
      useSyncExternalStore: la,
      useId: la,
      unstable_isNewReconciler: se
    }, XC = null, JC = null, ZC = null, e0 = null, Wl = null, ll = null, Cm = null;
    {
      var Gg = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, ut = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      XC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", Qt(), zf(t), Ig(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", Qt(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", Qt(), zf(t), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", Qt(), zf(a), Bg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", Qt(), zf(t), Pg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", Qt(), zf(t), Vg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", Qt(), zf(t);
          var a = be.current;
          be.current = Wl;
          try {
            return Yg(e, t);
          } finally {
            be.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", Qt();
          var i = be.current;
          be.current = Wl;
          try {
            return Mg(e, t, a);
          } finally {
            be.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", Qt(), Hg(e);
        },
        useState: function(e) {
          $ = "useState", Qt();
          var t = be.current;
          be.current = Wl;
          try {
            return sm(e);
          } finally {
            be.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", Qt(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", Qt(), $g(e);
        },
        useTransition: function() {
          return $ = "useTransition", Qt(), Qg();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", Qt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", Qt(), Ug(e, t, a);
        },
        useId: function() {
          return $ = "useId", Qt(), Wg();
        },
        unstable_isNewReconciler: se
      }, JC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", me(), Ig(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", me(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", me(), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", me(), Bg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", me(), Pg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", me(), Vg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", me();
          var a = be.current;
          be.current = Wl;
          try {
            return Yg(e, t);
          } finally {
            be.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", me();
          var i = be.current;
          be.current = Wl;
          try {
            return Mg(e, t, a);
          } finally {
            be.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", me(), Hg(e);
        },
        useState: function(e) {
          $ = "useState", me();
          var t = be.current;
          be.current = Wl;
          try {
            return sm(e);
          } finally {
            be.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", me(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", me(), $g(e);
        },
        useTransition: function() {
          return $ = "useTransition", me(), Qg();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", me(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", me(), Ug(e, t, a);
        },
        useId: function() {
          return $ = "useId", me(), Wg();
        },
        unstable_isNewReconciler: se
      }, ZC = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", me(), ym(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", me(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", me(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", me(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", me(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", me(), vm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", me();
          var a = be.current;
          be.current = ll;
          try {
            return gm(e, t);
          } finally {
            be.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", me();
          var i = be.current;
          be.current = ll;
          try {
            return Ag(e, t, a);
          } finally {
            be.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", me(), cm();
        },
        useState: function(e) {
          $ = "useState", me();
          var t = be.current;
          be.current = ll;
          try {
            return jg(e);
          } finally {
            be.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", me(), mm();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", me(), VC(e);
        },
        useTransition: function() {
          return $ = "useTransition", me(), YC();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", me(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", me(), om(e, t);
        },
        useId: function() {
          return $ = "useId", me(), Sm();
        },
        unstable_isNewReconciler: se
      }, e0 = {
        readContext: function(e) {
          return nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", me(), ym(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", me(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", me(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", me(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", me(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", me(), vm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", me();
          var a = be.current;
          be.current = Cm;
          try {
            return gm(e, t);
          } finally {
            be.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", me();
          var i = be.current;
          be.current = Cm;
          try {
            return zg(e, t, a);
          } finally {
            be.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", me(), cm();
        },
        useState: function(e) {
          $ = "useState", me();
          var t = be.current;
          be.current = Cm;
          try {
            return Fg(e);
          } finally {
            be.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", me(), mm();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", me(), BC(e);
        },
        useTransition: function() {
          return $ = "useTransition", me(), $C();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", me(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", me(), om(e, t);
        },
        useId: function() {
          return $ = "useId", me(), Sm();
        },
        unstable_isNewReconciler: se
      }, Wl = {
        readContext: function(e) {
          return Gg(), nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ut(), Qt(), Ig(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ut(), Qt(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ut(), Qt(), dm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ut(), Qt(), Bg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ut(), Qt(), Pg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ut(), Qt(), Vg(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ut(), Qt();
          var a = be.current;
          be.current = Wl;
          try {
            return Yg(e, t);
          } finally {
            be.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ut(), Qt();
          var i = be.current;
          be.current = Wl;
          try {
            return Mg(e, t, a);
          } finally {
            be.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ut(), Qt(), Hg(e);
        },
        useState: function(e) {
          $ = "useState", ut(), Qt();
          var t = be.current;
          be.current = Wl;
          try {
            return sm(e);
          } finally {
            be.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ut(), Qt(), void 0;
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ut(), Qt(), $g(e);
        },
        useTransition: function() {
          return $ = "useTransition", ut(), Qt(), Qg();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ut(), Qt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ut(), Qt(), Ug(e, t, a);
        },
        useId: function() {
          return $ = "useId", ut(), Qt(), Wg();
        },
        unstable_isNewReconciler: se
      }, ll = {
        readContext: function(e) {
          return Gg(), nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ut(), me(), ym(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ut(), me(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ut(), me(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ut(), me(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ut(), me(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ut(), me(), vm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ut(), me();
          var a = be.current;
          be.current = ll;
          try {
            return gm(e, t);
          } finally {
            be.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ut(), me();
          var i = be.current;
          be.current = ll;
          try {
            return Ag(e, t, a);
          } finally {
            be.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ut(), me(), cm();
        },
        useState: function(e) {
          $ = "useState", ut(), me();
          var t = be.current;
          be.current = ll;
          try {
            return jg(e);
          } finally {
            be.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ut(), me(), mm();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ut(), me(), VC(e);
        },
        useTransition: function() {
          return $ = "useTransition", ut(), me(), YC();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ut(), me(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ut(), me(), om(e, t);
        },
        useId: function() {
          return $ = "useId", ut(), me(), Sm();
        },
        unstable_isNewReconciler: se
      }, Cm = {
        readContext: function(e) {
          return Gg(), nr(e);
        },
        useCallback: function(e, t) {
          return $ = "useCallback", ut(), me(), ym(e, t);
        },
        useContext: function(e) {
          return $ = "useContext", ut(), me(), nr(e);
        },
        useEffect: function(e, t) {
          return $ = "useEffect", ut(), me(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return $ = "useImperativeHandle", ut(), me(), hm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return $ = "useInsertionEffect", ut(), me(), pm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return $ = "useLayoutEffect", ut(), me(), vm(e, t);
        },
        useMemo: function(e, t) {
          $ = "useMemo", ut(), me();
          var a = be.current;
          be.current = ll;
          try {
            return gm(e, t);
          } finally {
            be.current = a;
          }
        },
        useReducer: function(e, t, a) {
          $ = "useReducer", ut(), me();
          var i = be.current;
          be.current = ll;
          try {
            return zg(e, t, a);
          } finally {
            be.current = i;
          }
        },
        useRef: function(e) {
          return $ = "useRef", ut(), me(), cm();
        },
        useState: function(e) {
          $ = "useState", ut(), me();
          var t = be.current;
          be.current = ll;
          try {
            return Fg(e);
          } finally {
            be.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return $ = "useDebugValue", ut(), me(), mm();
        },
        useDeferredValue: function(e) {
          return $ = "useDeferredValue", ut(), me(), BC(e);
        },
        useTransition: function() {
          return $ = "useTransition", ut(), me(), $C();
        },
        useMutableSource: function(e, t, a) {
          return $ = "useMutableSource", ut(), me(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return $ = "useSyncExternalStore", ut(), me(), om(e, t);
        },
        useId: function() {
          return $ = "useId", ut(), me(), Sm();
        },
        unstable_isNewReconciler: se
      };
    }
    var Fo = w.unstable_now, t0 = 0, Rm = -1, Op = -1, Tm = -1, qg = !1, wm = !1;
    function n0() {
      return qg;
    }
    function eb() {
      wm = !0;
    }
    function tb() {
      qg = !1, wm = !1;
    }
    function nb() {
      qg = wm, wm = !1;
    }
    function r0() {
      return t0;
    }
    function a0() {
      t0 = Fo();
    }
    function Kg(e) {
      Op = Fo(), e.actualStartTime < 0 && (e.actualStartTime = Fo());
    }
    function i0(e) {
      Op = -1;
    }
    function xm(e, t) {
      if (Op >= 0) {
        var a = Fo() - Op;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Op = -1;
      }
    }
    function Gl(e) {
      if (Rm >= 0) {
        var t = Fo() - Rm;
        Rm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case Q:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case Fe:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function Xg(e) {
      if (Tm >= 0) {
        var t = Fo() - Tm;
        Tm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case Q:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case Fe:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ql() {
      Rm = Fo();
    }
    function Jg() {
      Tm = Fo();
    }
    function Zg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ul(e, t) {
      if (e && e.defaultProps) {
        var a = vt({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var eS = {}, tS, nS, rS, aS, iS, l0, bm, lS, uS, oS, Np;
    {
      tS = /* @__PURE__ */ new Set(), nS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), iS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), oS = /* @__PURE__ */ new Set(), Np = /* @__PURE__ */ new Set();
      var u0 = /* @__PURE__ */ new Set();
      bm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          u0.has(a) || (u0.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, l0 = function(e, t) {
        if (t === void 0) {
          var a = At(e) || "Component";
          iS.has(a) || (iS.add(a), g("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(eS, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(eS);
    }
    function sS(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & Zt) {
          gn(!0);
          try {
            s = a(i, u);
          } finally {
            gn(!1);
          }
        }
        l0(t, s);
      }
      var f = s == null ? u : vt({}, u, s);
      if (e.memoizedState = f, e.lanes === q) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var cS = {
      isMounted: Mv,
      enqueueSetState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.payload = t, a != null && (bm(a, "setState"), f.callback = a);
        var p = Ao(i, f, s);
        p !== null && (gr(p, i, s, u), tm(p, i, s)), vs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = po(e), u = Ca(), s = Bo(i), f = Pu(u, s);
        f.tag = wC, f.payload = t, a != null && (bm(a, "replaceState"), f.callback = a);
        var p = Ao(i, f, s);
        p !== null && (gr(p, i, s, u), tm(p, i, s)), vs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = po(e), i = Ca(), u = Bo(a), s = Pu(i, u);
        s.tag = Jh, t != null && (bm(t, "forceUpdate"), s.callback = t);
        var f = Ao(a, s, u);
        f !== null && (gr(f, a, u, i), tm(f, a, u)), Mc(a, u);
      }
    };
    function o0(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Zt) {
            gn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              gn(!1);
            }
          }
          v === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", At(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Ae(a, i) || !Ae(u, s) : !0;
    }
    function rb(e, t, a) {
      var i = e.stateNode;
      {
        var u = At(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Np.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Zt) === Qe && (Np.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Np.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Zt) === Qe && (Np.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !uS.has(t) && (uS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", At(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !rS.has(t) && (rS.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", At(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || St(p)) && g("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function s0(e, t) {
      t.updater = cS, e.stateNode = t, vu(t, e), t._reactInternalInstance = eS;
    }
    function c0(e, t, a) {
      var i = !1, u = ui, s = ui, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === R && f._context === void 0
        );
        if (!p && !oS.has(t)) {
          oS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === vi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", At(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = nr(f);
      else {
        u = Tf(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? wf(e, u) : ui;
      }
      var S = new t(a, s);
      if (e.mode & Zt) {
        gn(!0);
        try {
          S = new t(a, s);
        } finally {
          gn(!1);
        }
      }
      var k = e.memoizedState = S.state !== null && S.state !== void 0 ? S.state : null;
      s0(e, S);
      {
        if (typeof t.getDerivedStateFromProps == "function" && k === null) {
          var b = At(t) || "Component";
          nS.has(b) || (nS.add(b), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", b, S.state === null ? "null" : "undefined", b));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof S.getSnapshotBeforeUpdate == "function") {
          var U = null, H = null, V = null;
          if (typeof S.componentWillMount == "function" && S.componentWillMount.__suppressDeprecationWarning !== !0 ? U = "componentWillMount" : typeof S.UNSAFE_componentWillMount == "function" && (U = "UNSAFE_componentWillMount"), typeof S.componentWillReceiveProps == "function" && S.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? H = "componentWillReceiveProps" : typeof S.UNSAFE_componentWillReceiveProps == "function" && (H = "UNSAFE_componentWillReceiveProps"), typeof S.componentWillUpdate == "function" && S.componentWillUpdate.__suppressDeprecationWarning !== !0 ? V = "componentWillUpdate" : typeof S.UNSAFE_componentWillUpdate == "function" && (V = "UNSAFE_componentWillUpdate"), U !== null || H !== null || V !== null) {
            var Ee = At(t) || "Component", qe = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            aS.has(Ee) || (aS.add(Ee), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, Ee, qe, U !== null ? `
  ` + U : "", H !== null ? `
  ` + H : "", V !== null ? `
  ` + V : ""));
          }
        }
      }
      return i && ZE(e, u, s), S;
    }
    function ab(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", it(e) || "Component"), cS.enqueueReplaceState(t, t.state, null));
    }
    function f0(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = it(e) || "Component";
          tS.has(s) || (tS.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        cS.enqueueReplaceState(t, t.state, null);
      }
    }
    function fS(e, t, a, i) {
      rb(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, Eg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = nr(s);
      else {
        var f = Tf(e, t, !0);
        u.context = wf(e, f);
      }
      {
        if (u.state === a) {
          var p = At(t) || "Component";
          lS.has(p) || (lS.add(p), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Zt && al.recordLegacyContextWarning(e, u), al.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (sS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (ab(e, u), nm(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = Dt;
        y |= Wi, (e.mode & Pt) !== Qe && (y |= _l), e.flags |= y;
      }
    }
    function ib(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = ui;
      if (typeof p == "object" && p !== null)
        v = nr(p);
      else {
        var y = Tf(e, t, !0);
        v = wf(e, y);
      }
      var S = t.getDerivedStateFromProps, k = typeof S == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !k && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && f0(e, u, a, v), bC();
      var b = e.memoizedState, U = u.state = b;
      if (nm(e, a, u, i), U = e.memoizedState, s === a && b === U && !jh() && !rm()) {
        if (typeof u.componentDidMount == "function") {
          var H = Dt;
          H |= Wi, (e.mode & Pt) !== Qe && (H |= _l), e.flags |= H;
        }
        return !1;
      }
      typeof S == "function" && (sS(e, t, S, a), U = e.memoizedState);
      var V = rm() || o0(e, t, s, a, b, U, v);
      if (V) {
        if (!k && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var Ee = Dt;
          Ee |= Wi, (e.mode & Pt) !== Qe && (Ee |= _l), e.flags |= Ee;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var qe = Dt;
          qe |= Wi, (e.mode & Pt) !== Qe && (qe |= _l), e.flags |= qe;
        }
        e.memoizedProps = a, e.memoizedState = U;
      }
      return u.props = a, u.state = U, u.context = v, V;
    }
    function lb(e, t, a, i, u) {
      var s = t.stateNode;
      xC(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ul(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, S = a.contextType, k = ui;
      if (typeof S == "object" && S !== null)
        k = nr(S);
      else {
        var b = Tf(t, a, !0);
        k = wf(t, b);
      }
      var U = a.getDerivedStateFromProps, H = typeof U == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !H && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== k) && f0(t, s, i, k), bC();
      var V = t.memoizedState, Ee = s.state = V;
      if (nm(t, i, s, u), Ee = t.memoizedState, f === v && V === Ee && !jh() && !rm() && !ce)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || V !== e.memoizedState) && (t.flags |= Dt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || V !== e.memoizedState) && (t.flags |= Qn), !1;
      typeof U == "function" && (sS(t, a, U, i), Ee = t.memoizedState);
      var qe = rm() || o0(t, a, p, i, V, Ee, k) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      ce;
      return qe ? (!H && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, Ee, k), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, Ee, k)), typeof s.componentDidUpdate == "function" && (t.flags |= Dt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Qn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || V !== e.memoizedState) && (t.flags |= Dt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || V !== e.memoizedState) && (t.flags |= Qn), t.memoizedProps = i, t.memoizedState = Ee), s.props = i, s.state = Ee, s.context = k, qe;
    }
    function Zs(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function dS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function ub(e, t) {
      return !0;
    }
    function pS(e, t) {
      try {
        var a = ub(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === K)
            return;
          console.error(i);
        }
        var p = u ? it(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === Q)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var S = it(e) || "Anonymous";
          y = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + S + ".");
        }
        var k = v + `
` + f + `

` + ("" + y);
        console.error(k);
      } catch (b) {
        setTimeout(function() {
          throw b;
        });
      }
    }
    var ob = typeof WeakMap == "function" ? WeakMap : Map;
    function d0(e, t, a) {
      var i = Pu(nn, a);
      i.tag = gg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        e1(u), pS(e, t);
      }, i;
    }
    function vS(e, t, a) {
      var i = Pu(nn, a);
      i.tag = gg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          TR(e), pS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        TR(e), pS(e, t), typeof u != "function" && J_(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (ea(e.lanes, tt) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", it(e) || "Unknown"));
      }), i;
    }
    function p0(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new ob(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = t1.bind(null, e, t, a);
        Jr && Gp(e, a), t.then(s, s);
      }
    }
    function sb(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function cb(e, t) {
      var a = e.tag;
      if ((e.mode & Tt) === Qe && (a === ee || a === Re || a === W)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function v0(e) {
      var t = e;
      do {
        if (t.tag === Te && Yx(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function h0(e, t, a, i, u) {
      if ((e.mode & Tt) === Qe) {
        if (e === t)
          e.flags |= Jn;
        else {
          if (e.flags |= Be, a.flags |= xc, a.flags &= -52805, a.tag === K) {
            var s = a.alternate;
            if (s === null)
              a.tag = Ke;
            else {
              var f = Pu(nn, tt);
              f.tag = Jh, Ao(a, f, tt);
            }
          }
          a.lanes = dt(a.lanes, tt);
        }
        return e;
      }
      return e.flags |= Jn, e.lanes = u, e;
    }
    function fb(e, t, a, i, u) {
      if (a.flags |= os, Jr && Gp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        cb(a), jr() && a.mode & Tt && lC();
        var f = v0(t);
        if (f !== null) {
          f.flags &= ~Rr, h0(f, t, a, e, u), f.mode & Tt && p0(e, s, u), sb(f, e, s);
          return;
        } else {
          if (!Vv(u)) {
            p0(e, s, u), WS();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (jr() && a.mode & Tt) {
        lC();
        var v = v0(t);
        if (v !== null) {
          (v.flags & Jn) === $e && (v.flags |= Rr), h0(v, t, a, e, u), lg(Zs(i, a));
          return;
        }
      }
      i = Zs(i, a), Y_(i);
      var y = t;
      do {
        switch (y.tag) {
          case Q: {
            var S = i;
            y.flags |= Jn;
            var k = Ts(u);
            y.lanes = dt(y.lanes, k);
            var b = d0(y, S, k);
            Cg(y, b);
            return;
          }
          case K:
            var U = i, H = y.type, V = y.stateNode;
            if ((y.flags & Be) === $e && (typeof H.getDerivedStateFromError == "function" || V !== null && typeof V.componentDidCatch == "function" && !vR(V))) {
              y.flags |= Jn;
              var Ee = Ts(u);
              y.lanes = dt(y.lanes, Ee);
              var qe = vS(y, U, Ee);
              Cg(y, qe);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function db() {
      return null;
    }
    var Lp = x.ReactCurrentOwner, ol = !1, hS, Mp, mS, yS, gS, ec, SS, _m, Ap;
    hS = {}, Mp = {}, mS = {}, yS = {}, gS = {}, ec = !1, SS = {}, _m = {}, Ap = {};
    function Sa(e, t, a, i) {
      e === null ? t.child = gC(t, null, a, i) : t.child = kf(t, e.child, a, i);
    }
    function pb(e, t, a, i) {
      t.child = kf(t, e.child, null, i), t.child = kf(t, null, a, i);
    }
    function m0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          At(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      Of(t, u), ha(t);
      {
        if (Lp.current = t, $n(!0), v = Uf(e, t, f, i, p, u), y = jf(), t.mode & Zt) {
          gn(!0);
          try {
            v = Uf(e, t, f, i, p, u), y = jf();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (LC(e, t, u), Vu(e, t, u)) : (jr() && y && eg(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function y0(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (g1(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = $f(s), t.tag = W, t.type = f, RS(t, s), g0(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && nl(
            p,
            i,
            // Resolved props
            "prop",
            At(s)
          ), a.defaultProps !== void 0) {
            var v = At(s) || "Unknown";
            Ap[v] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Ap[v] = !0);
          }
        }
        var y = aE(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var S = a.type, k = S.propTypes;
        k && nl(
          k,
          i,
          // Resolved props
          "prop",
          At(S)
        );
      }
      var b = e.child, U = kS(e, u);
      if (!U) {
        var H = b.memoizedProps, V = a.compare;
        if (V = V !== null ? V : Ae, V(H, i) && e.ref === t.ref)
          return Vu(e, t, u);
      }
      t.flags |= ni;
      var Ee = ic(b, i);
      return Ee.ref = t.ref, Ee.return = t, t.child = Ee, Ee;
    }
    function g0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === lt) {
          var f = s, p = f._payload, v = f._init;
          try {
            s = v(p);
          } catch {
            s = null;
          }
          var y = s && s.propTypes;
          y && nl(
            y,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            At(s)
          );
        }
      }
      if (e !== null) {
        var S = e.memoizedProps;
        if (Ae(S, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ol = !1, t.pendingProps = i = S, kS(e, u))
            (e.flags & xc) !== $e && (ol = !0);
          else return t.lanes = e.lanes, Vu(e, t, u);
      }
      return ES(e, t, a, i, u);
    }
    function S0(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || le)
        if ((t.mode & Tt) === Qe) {
          var f = {
            baseLanes: q,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Pm(t, a);
        } else if (ea(a, Zr)) {
          var k = {
            baseLanes: q,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = k;
          var b = s !== null ? s.baseLanes : a;
          Pm(t, b);
        } else {
          var p = null, v;
          if (s !== null) {
            var y = s.baseLanes;
            v = dt(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = Zr;
          var S = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = S, t.updateQueue = null, Pm(t, v), null;
        }
      else {
        var U;
        s !== null ? (U = dt(s.baseLanes, a), t.memoizedState = null) : U = a, Pm(t, U);
      }
      return Sa(e, t, u, a), t.child;
    }
    function vb(e, t, a) {
      var i = t.pendingProps;
      return Sa(e, t, i, a), t.child;
    }
    function hb(e, t, a) {
      var i = t.pendingProps.children;
      return Sa(e, t, i, a), t.child;
    }
    function mb(e, t, a) {
      {
        t.flags |= Dt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Sa(e, t, s, a), t.child;
    }
    function E0(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Cn, t.flags |= ho);
    }
    function ES(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          At(a)
        );
      }
      var f;
      {
        var p = Tf(t, a, !0);
        f = wf(t, p);
      }
      var v, y;
      Of(t, u), ha(t);
      {
        if (Lp.current = t, $n(!0), v = Uf(e, t, a, i, f, u), y = jf(), t.mode & Zt) {
          gn(!0);
          try {
            v = Uf(e, t, a, i, f, u), y = jf();
          } finally {
            gn(!1);
          }
        }
        $n(!1);
      }
      return ma(), e !== null && !ol ? (LC(e, t, u), Vu(e, t, u)) : (jr() && y && eg(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function C0(e, t, a, i, u) {
      {
        switch (M1(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= Be, t.flags |= Jn;
            var y = new Error("Simulated error coming from DevTools"), S = Ts(u);
            t.lanes = dt(t.lanes, S);
            var k = vS(t, Zs(y, t), S);
            Cg(t, k);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var b = a.propTypes;
          b && nl(
            b,
            i,
            // Resolved props
            "prop",
            At(a)
          );
        }
      }
      var U;
      Yl(a) ? (U = !0, Hh(t)) : U = !1, Of(t, u);
      var H = t.stateNode, V;
      H === null ? (Dm(e, t), c0(t, a, i), fS(t, a, i, u), V = !0) : e === null ? V = ib(t, a, i, u) : V = lb(e, t, a, i, u);
      var Ee = CS(e, t, a, V, U, u);
      {
        var qe = t.stateNode;
        V && qe.props !== i && (ec || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", it(t) || "a component"), ec = !0);
      }
      return Ee;
    }
    function CS(e, t, a, i, u, s) {
      E0(e, t);
      var f = (t.flags & Be) !== $e;
      if (!i && !f)
        return u && nC(t, a, !1), Vu(e, t, s);
      var p = t.stateNode;
      Lp.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, i0();
      else {
        ha(t);
        {
          if ($n(!0), v = p.render(), t.mode & Zt) {
            gn(!0);
            try {
              p.render();
            } finally {
              gn(!1);
            }
          }
          $n(!1);
        }
        ma();
      }
      return t.flags |= ni, e !== null && f ? pb(e, t, v, s) : Sa(e, t, v, s), t.memoizedState = p.state, u && nC(t, a, !0), t.child;
    }
    function R0(e) {
      var t = e.stateNode;
      t.pendingContext ? eC(e, t.pendingContext, t.pendingContext !== t.context) : t.context && eC(e, t.context, !1), Rg(e, t.containerInfo);
    }
    function yb(e, t, a) {
      if (R0(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      xC(e, t), nm(t, i, null, a);
      var f = t.memoizedState;
      t.stateNode;
      var p = f.element;
      if (u.isDehydrated) {
        var v = {
          element: p,
          isDehydrated: !1,
          cache: f.cache,
          pendingSuspenseBoundaries: f.pendingSuspenseBoundaries,
          transitions: f.transitions
        }, y = t.updateQueue;
        if (y.baseState = v, t.memoizedState = v, t.flags & Rr) {
          var S = Zs(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return T0(e, t, p, a, S);
        } else if (p !== s) {
          var k = Zs(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return T0(e, t, p, a, k);
        } else {
          Ex(t);
          var b = gC(t, null, p, a);
          t.child = b;
          for (var U = b; U; )
            U.flags = U.flags & ~yn | qr, U = U.sibling;
        }
      } else {
        if (_f(), p === s)
          return Vu(e, t, a);
        Sa(e, t, p, a);
      }
      return t.child;
    }
    function T0(e, t, a, i, u) {
      return _f(), lg(u), t.flags |= Rr, Sa(e, t, a, i), t.child;
    }
    function gb(e, t, a) {
      DC(t), e === null && ig(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Py(i, u);
      return p ? f = null : s !== null && Py(i, s) && (t.flags |= Oa), E0(e, t), Sa(e, t, f, a), t.child;
    }
    function Sb(e, t) {
      return e === null && ig(t), null;
    }
    function Eb(e, t, a, i) {
      Dm(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = S1(v), S = ul(v, u), k;
      switch (y) {
        case ee:
          return RS(t, v), t.type = v = $f(v), k = ES(null, t, v, S, i), k;
        case K:
          return t.type = v = JS(v), k = C0(null, t, v, S, i), k;
        case Re:
          return t.type = v = ZS(v), k = m0(null, t, v, S, i), k;
        case Ye: {
          if (t.type !== t.elementType) {
            var b = v.propTypes;
            b && nl(
              b,
              S,
              // Resolved for outer only
              "prop",
              At(v)
            );
          }
          return k = y0(
            null,
            t,
            v,
            ul(v.type, S),
            // The inner type can have defaults too
            i
          ), k;
        }
      }
      var U = "";
      throw v !== null && typeof v == "object" && v.$$typeof === lt && (U = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + U));
    }
    function Cb(e, t, a, i, u) {
      Dm(e, t), t.tag = K;
      var s;
      return Yl(a) ? (s = !0, Hh(t)) : s = !1, Of(t, u), c0(t, a, i), fS(t, a, i, u), CS(null, t, a, !0, s, u);
    }
    function Rb(e, t, a, i) {
      Dm(e, t);
      var u = t.pendingProps, s;
      {
        var f = Tf(t, a, !1);
        s = wf(t, f);
      }
      Of(t, i);
      var p, v;
      ha(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = At(a) || "Unknown";
          hS[y] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), hS[y] = !0);
        }
        t.mode & Zt && al.recordLegacyContextWarning(t, null), $n(!0), Lp.current = t, p = Uf(null, t, a, u, s, i), v = jf(), $n(!1);
      }
      if (ma(), t.flags |= ni, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var S = At(a) || "Unknown";
        Mp[S] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", S, S, S), Mp[S] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var k = At(a) || "Unknown";
          Mp[k] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", k, k, k), Mp[k] = !0);
        }
        t.tag = K, t.memoizedState = null, t.updateQueue = null;
        var b = !1;
        return Yl(a) ? (b = !0, Hh(t)) : b = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, Eg(t), s0(t, p), fS(t, a, u, i), CS(null, t, a, !0, b, i);
      } else {
        if (t.tag = ee, t.mode & Zt) {
          gn(!0);
          try {
            p = Uf(null, t, a, u, s, i), v = jf();
          } finally {
            gn(!1);
          }
        }
        return jr() && v && eg(t), Sa(null, t, p, i), RS(t, a), t.child;
      }
    }
    function RS(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Or();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), gS[u] || (gS[u] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = At(t) || "Unknown";
          Ap[f] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Ap[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = At(t) || "Unknown";
          yS[p] || (g("%s: Function components do not support getDerivedStateFromProps.", p), yS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = At(t) || "Unknown";
          mS[v] || (g("%s: Function components do not support contextType.", v), mS[v] = !0);
        }
      }
    }
    var TS = {
      dehydrated: null,
      treeContext: null,
      retryLane: jt
    };
    function wS(e) {
      return {
        baseLanes: e,
        cachePool: db(),
        transitions: null
      };
    }
    function Tb(e, t) {
      var a = null;
      return {
        baseLanes: dt(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function wb(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return xg(e, Tp);
    }
    function xb(e, t) {
      return ws(e.childLanes, t);
    }
    function w0(e, t, a) {
      var i = t.pendingProps;
      A1(t) && (t.flags |= Be);
      var u = il.current, s = !1, f = (t.flags & Be) !== $e;
      if (f || wb(u, e) ? (s = !0, t.flags &= ~Be) : (e === null || e.memoizedState !== null) && (u = Ix(u, NC)), u = Lf(u), Uo(t, u), e === null) {
        ig(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return Ob(t, v);
        }
        var y = i.children, S = i.fallback;
        if (s) {
          var k = bb(t, y, S, a), b = t.child;
          return b.memoizedState = wS(a), t.memoizedState = TS, k;
        } else
          return xS(t, y);
      } else {
        var U = e.memoizedState;
        if (U !== null) {
          var H = U.dehydrated;
          if (H !== null)
            return Nb(e, t, f, i, H, U, a);
        }
        if (s) {
          var V = i.fallback, Ee = i.children, qe = kb(e, t, Ee, V, a), Pe = t.child, Lt = e.child.memoizedState;
          return Pe.memoizedState = Lt === null ? wS(a) : Tb(Lt, a), Pe.childLanes = xb(e, a), t.memoizedState = TS, qe;
        } else {
          var bt = i.children, M = _b(e, t, bt, a);
          return t.memoizedState = null, M;
        }
      }
    }
    function xS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = bS(u, i);
      return s.return = e, e.child = s, s;
    }
    function bb(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & Tt) === Qe && s !== null ? (p = s, p.childLanes = q, p.pendingProps = f, e.mode & Ht && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Yo(a, u, i, null)) : (p = bS(f, u), v = Yo(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function bS(e, t, a) {
      return xR(e, t, q, null);
    }
    function x0(e, t) {
      return ic(e, t);
    }
    function _b(e, t, a, i) {
      var u = e.child, s = u.sibling, f = x0(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & Tt) === Qe && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= Da) : p.push(s);
      }
      return t.child = f, f;
    }
    function kb(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & Tt) === Qe && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var S = t.child;
        y = S, y.childLanes = q, y.pendingProps = v, t.mode & Ht && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = x0(f, v), y.subtreeFlags = f.subtreeFlags & zn;
      var k;
      return p !== null ? k = ic(p, i) : (k = Yo(i, s, u, null), k.flags |= yn), k.return = t, y.return = t, y.sibling = k, t.child = y, k;
    }
    function km(e, t, a, i) {
      i !== null && lg(i), kf(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = xS(t, s);
      return f.flags |= yn, t.memoizedState = null, f;
    }
    function Db(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = bS(f, s), v = Yo(i, s, u, null);
      return v.flags |= yn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & Tt) !== Qe && kf(t, e.child, null, u), v;
    }
    function Ob(e, t, a) {
      return (e.mode & Tt) === Qe ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = tt) : Yy(t) ? e.lanes = Tr : e.lanes = Zr, null;
    }
    function Nb(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Rr) {
          t.flags &= ~Rr;
          var M = dS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return km(e, t, f, M);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Be, null;
          var B = i.children, A = i.fallback, re = Db(e, t, B, A, f), De = t.child;
          return De.memoizedState = wS(f), t.memoizedState = TS, re;
        }
      else {
        if (gx(), (t.mode & Tt) === Qe)
          return km(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Yy(u)) {
          var p, v, y;
          {
            var S = zw(u);
            p = S.digest, v = S.message, y = S.stack;
          }
          var k;
          v ? k = new Error(v) : k = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var b = dS(k, p, y);
          return km(e, t, f, b);
        }
        var U = ea(f, e.childLanes);
        if (ol || U) {
          var H = Hm();
          if (H !== null) {
            var V = jd(H, f);
            if (V !== jt && V !== s.retryLane) {
              s.retryLane = V;
              var Ee = nn;
              Ha(e, V), gr(H, e, V, Ee);
            }
          }
          WS();
          var qe = dS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return km(e, t, f, qe);
        } else if (GE(u)) {
          t.flags |= Be, t.child = e.child;
          var Pe = n1.bind(null, e);
          return Uw(u, Pe), null;
        } else {
          Cx(t, u, s.treeContext);
          var Lt = i.children, bt = xS(t, Lt);
          return bt.flags |= qr, bt;
        }
      }
    }
    function b0(e, t, a) {
      e.lanes = dt(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = dt(i.lanes, t)), mg(e.return, t, a);
    }
    function Lb(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === Te) {
          var u = i.memoizedState;
          u !== null && b0(i, a, e);
        } else if (i.tag === ft)
          b0(i, a, e);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    function Mb(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && lm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function Ab(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !SS[e])
        if (SS[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              g('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              g('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              g('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          g('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function zb(e, t) {
      e !== void 0 && !_m[e] && (e !== "collapsed" && e !== "hidden" ? (_m[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (_m[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function _0(e, t) {
      {
        var a = St(e), i = !a && typeof ct(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function Ub(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (St(e)) {
          for (var a = 0; a < e.length; a++)
            if (!_0(e[a], a))
              return;
        } else {
          var i = ct(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!_0(s.value, f))
                  return;
                f++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function _S(e, t, a, i, u) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: u
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = u);
    }
    function k0(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      Ab(u), zb(s, u), Ub(f, u), Sa(e, t, f, a);
      var p = il.current, v = xg(p, Tp);
      if (v)
        p = bg(p, Tp), t.flags |= Be;
      else {
        var y = e !== null && (e.flags & Be) !== $e;
        y && Lb(t, t.child, a), p = Lf(p);
      }
      if (Uo(t, p), (t.mode & Tt) === Qe)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var S = Mb(t.child), k;
            S === null ? (k = t.child, t.child = null) : (k = S.sibling, S.sibling = null), _S(
              t,
              !1,
              // isBackwards
              k,
              S,
              s
            );
            break;
          }
          case "backwards": {
            var b = null, U = t.child;
            for (t.child = null; U !== null; ) {
              var H = U.alternate;
              if (H !== null && lm(H) === null) {
                t.child = U;
                break;
              }
              var V = U.sibling;
              U.sibling = b, b = U, U = V;
            }
            _S(
              t,
              !0,
              // isBackwards
              b,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            _S(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function jb(e, t, a) {
      Rg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = kf(t, null, i, a) : Sa(e, t, i, a), t.child;
    }
    var D0 = !1;
    function Fb(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || D0 || (D0 = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && nl(v, s, "prop", "Context.Provider");
      }
      if (CC(t, u, p), f !== null) {
        var y = f.value;
        if (Z(y, p)) {
          if (f.children === s.children && !jh())
            return Vu(e, t, a);
        } else
          Ax(t, u, a);
      }
      var S = s.children;
      return Sa(e, t, S, a), t.child;
    }
    var O0 = !1;
    function Hb(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (O0 || (O0 = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && g("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Of(t, a);
      var f = nr(i);
      ha(t);
      var p;
      return Lp.current = t, $n(!0), p = s(f), $n(!1), ma(), t.flags |= ni, Sa(e, t, p, a), t.child;
    }
    function zp() {
      ol = !0;
    }
    function Dm(e, t) {
      (t.mode & Tt) === Qe && e !== null && (e.alternate = null, t.alternate = null, t.flags |= yn);
    }
    function Vu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), i0(), Wp(t.lanes), ea(a, t.childLanes) ? (Lx(e, t), t.child) : null;
    }
    function Pb(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var u = i.child;
          if (u === null)
            throw new Error("Expected parent to have a child.");
          for (; u.sibling !== t; )
            if (u = u.sibling, u === null)
              throw new Error("Expected to find the previous sibling.");
          u.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [e], i.flags |= Da) : s.push(e), a.flags |= yn, a;
      }
    }
    function kS(e, t) {
      var a = e.lanes;
      return !!ea(a, t);
    }
    function Vb(e, t, a) {
      switch (t.tag) {
        case Q:
          R0(t), t.stateNode, _f();
          break;
        case ae:
          DC(t);
          break;
        case K: {
          var i = t.type;
          Yl(i) && Hh(t);
          break;
        }
        case fe:
          Rg(t, t.stateNode.containerInfo);
          break;
        case pe: {
          var u = t.memoizedProps.value, s = t.type._context;
          CC(t, s, u);
          break;
        }
        case Fe:
          {
            var f = ea(a, t.childLanes);
            f && (t.flags |= Dt);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case Te: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Uo(t, Lf(il.current)), t.flags |= Be, null;
            var y = t.child, S = y.childLanes;
            if (ea(a, S))
              return w0(e, t, a);
            Uo(t, Lf(il.current));
            var k = Vu(e, t, a);
            return k !== null ? k.sibling : null;
          } else
            Uo(t, Lf(il.current));
          break;
        }
        case ft: {
          var b = (e.flags & Be) !== $e, U = ea(a, t.childLanes);
          if (b) {
            if (U)
              return k0(e, t, a);
            t.flags |= Be;
          }
          var H = t.memoizedState;
          if (H !== null && (H.rendering = null, H.tail = null, H.lastEffect = null), Uo(t, il.current), U)
            break;
          return null;
        }
        case Le:
        case Ut:
          return t.lanes = q, S0(e, t, a);
      }
      return Vu(e, t, a);
    }
    function N0(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return Pb(e, t, aE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || jh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ol = !0;
        else {
          var s = kS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & Be) === $e)
            return ol = !1, Vb(e, t, a);
          (e.flags & xc) !== $e ? ol = !0 : ol = !1;
        }
      } else if (ol = !1, jr() && dx(t)) {
        var f = t.index, p = px();
        iC(t, p, f);
      }
      switch (t.lanes = q, t.tag) {
        case Ve:
          return Rb(e, t, t.type, a);
        case ke: {
          var v = t.elementType;
          return Eb(e, t, v, a);
        }
        case ee: {
          var y = t.type, S = t.pendingProps, k = t.elementType === y ? S : ul(y, S);
          return ES(e, t, y, k, a);
        }
        case K: {
          var b = t.type, U = t.pendingProps, H = t.elementType === b ? U : ul(b, U);
          return C0(e, t, b, H, a);
        }
        case Q:
          return yb(e, t, a);
        case ae:
          return gb(e, t, a);
        case de:
          return Sb(e, t);
        case Te:
          return w0(e, t, a);
        case fe:
          return jb(e, t, a);
        case Re: {
          var V = t.type, Ee = t.pendingProps, qe = t.elementType === V ? Ee : ul(V, Ee);
          return m0(e, t, V, qe, a);
        }
        case te:
          return vb(e, t, a);
        case Ce:
          return hb(e, t, a);
        case Fe:
          return mb(e, t, a);
        case pe:
          return Fb(e, t, a);
        case Ie:
          return Hb(e, t, a);
        case Ye: {
          var Pe = t.type, Lt = t.pendingProps, bt = ul(Pe, Lt);
          if (t.type !== t.elementType) {
            var M = Pe.propTypes;
            M && nl(
              M,
              bt,
              // Resolved for outer only
              "prop",
              At(Pe)
            );
          }
          return bt = ul(Pe.type, bt), y0(e, t, Pe, bt, a);
        }
        case W:
          return g0(e, t, t.type, t.pendingProps, a);
        case Ke: {
          var B = t.type, A = t.pendingProps, re = t.elementType === B ? A : ul(B, A);
          return Cb(e, t, B, re, a);
        }
        case ft:
          return k0(e, t, a);
        case ht:
          break;
        case Le:
          return S0(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ff(e) {
      e.flags |= Dt;
    }
    function L0(e) {
      e.flags |= Cn, e.flags |= ho;
    }
    var M0, DS, A0, z0;
    M0 = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === ae || u.tag === de)
          sw(e, u.stateNode);
        else if (u.tag !== fe) {
          if (u.child !== null) {
            u.child.return = u, u = u.child;
            continue;
          }
        }
        if (u === t)
          return;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === t)
            return;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    }, DS = function(e, t) {
    }, A0 = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Tg(), v = fw(f, a, s, i, u, p);
        t.updateQueue = v, v && Ff(t);
      }
    }, z0 = function(e, t, a, i) {
      a !== i && Ff(t);
    };
    function Up(e, t) {
      if (!jr())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var u = e.tail, s = null; u !== null; )
              u.alternate !== null && (s = u), u = u.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function Hr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = q, i = $e;
      if (t) {
        if ((e.mode & Ht) !== Qe) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = dt(a, dt(y.lanes, y.childLanes)), i |= y.subtreeFlags & zn, i |= y.flags & zn, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var S = e.child; S !== null; )
            a = dt(a, dt(S.lanes, S.childLanes)), i |= S.subtreeFlags & zn, i |= S.flags & zn, S.return = e, S = S.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Ht) !== Qe) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = dt(a, dt(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = dt(a, dt(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function Bb(e, t, a) {
      if (bx() && (t.mode & Tt) !== Qe && (t.flags & Be) === $e)
        return dC(t), _f(), t.flags |= Rr | os | Jn, !1;
      var i = Yh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (wx(t), Hr(t), (t.mode & Ht) !== Qe) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (_f(), (t.flags & Be) === $e && (t.memoizedState = null), t.flags |= Dt, Hr(t), (t.mode & Ht) !== Qe) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return pC(), !0;
    }
    function U0(e, t, a) {
      var i = t.pendingProps;
      switch (tg(t), t.tag) {
        case Ve:
        case ke:
        case W:
        case ee:
        case Re:
        case te:
        case Ce:
        case Fe:
        case Ie:
        case Ye:
          return Hr(t), null;
        case K: {
          var u = t.type;
          return Yl(u) && Fh(t), Hr(t), null;
        }
        case Q: {
          var s = t.stateNode;
          if (Nf(t), Xy(t), kg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Yh(t);
            if (f)
              Ff(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Rr) !== $e) && (t.flags |= Qn, pC());
            }
          }
          return DS(e, t), Hr(t), null;
        }
        case ae: {
          wg(t);
          var v = kC(), y = t.type;
          if (e !== null && t.stateNode != null)
            A0(e, t, y, i, v), e.ref !== t.ref && L0(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Hr(t), null;
            }
            var S = Tg(), k = Yh(t);
            if (k)
              Rx(t, v, S) && Ff(t);
            else {
              var b = ow(y, i, v, S, t);
              M0(b, t, !1, !1), t.stateNode = b, cw(b, y, i, v) && Ff(t);
            }
            t.ref !== null && L0(t);
          }
          return Hr(t), null;
        }
        case de: {
          var U = i;
          if (e && t.stateNode != null) {
            var H = e.memoizedProps;
            z0(e, t, H, U);
          } else {
            if (typeof U != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var V = kC(), Ee = Tg(), qe = Yh(t);
            qe ? Tx(t) && Ff(t) : t.stateNode = dw(U, V, Ee, t);
          }
          return Hr(t), null;
        }
        case Te: {
          Mf(t);
          var Pe = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Lt = Bb(e, t, Pe);
            if (!Lt)
              return t.flags & Jn ? t : null;
          }
          if ((t.flags & Be) !== $e)
            return t.lanes = a, (t.mode & Ht) !== Qe && Zg(t), t;
          var bt = Pe !== null, M = e !== null && e.memoizedState !== null;
          if (bt !== M && bt) {
            var B = t.child;
            if (B.flags |= An, (t.mode & Tt) !== Qe) {
              var A = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              A || xg(il.current, NC) ? I_() : WS();
            }
          }
          var re = t.updateQueue;
          if (re !== null && (t.flags |= Dt), Hr(t), (t.mode & Ht) !== Qe && bt) {
            var De = t.child;
            De !== null && (t.treeBaseDuration -= De.treeBaseDuration);
          }
          return null;
        }
        case fe:
          return Nf(t), DS(e, t), e === null && ix(t.stateNode.containerInfo), Hr(t), null;
        case pe:
          var we = t.type._context;
          return hg(we, t), Hr(t), null;
        case Ke: {
          var rt = t.type;
          return Yl(rt) && Fh(t), Hr(t), null;
        }
        case ft: {
          Mf(t);
          var ot = t.memoizedState;
          if (ot === null)
            return Hr(t), null;
          var tn = (t.flags & Be) !== $e, Bt = ot.rendering;
          if (Bt === null)
            if (tn)
              Up(ot, !1);
            else {
              var qn = $_() && (e === null || (e.flags & Be) === $e);
              if (!qn)
                for (var It = t.child; It !== null; ) {
                  var Vn = lm(It);
                  if (Vn !== null) {
                    tn = !0, t.flags |= Be, Up(ot, !1);
                    var ua = Vn.updateQueue;
                    return ua !== null && (t.updateQueue = ua, t.flags |= Dt), t.subtreeFlags = $e, Mx(t, a), Uo(t, bg(il.current, Tp)), t.child;
                  }
                  It = It.sibling;
                }
              ot.tail !== null && Wn() > rR() && (t.flags |= Be, tn = !0, Up(ot, !1), t.lanes = kd);
            }
          else {
            if (!tn) {
              var Yr = lm(Bt);
              if (Yr !== null) {
                t.flags |= Be, tn = !0;
                var si = Yr.updateQueue;
                if (si !== null && (t.updateQueue = si, t.flags |= Dt), Up(ot, !0), ot.tail === null && ot.tailMode === "hidden" && !Bt.alternate && !jr())
                  return Hr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Wn() * 2 - ot.renderingStartTime > rR() && a !== Zr && (t.flags |= Be, tn = !0, Up(ot, !1), t.lanes = kd);
            }
            if (ot.isBackwards)
              Bt.sibling = t.child, t.child = Bt;
            else {
              var Ra = ot.last;
              Ra !== null ? Ra.sibling = Bt : t.child = Bt, ot.last = Bt;
            }
          }
          if (ot.tail !== null) {
            var Ta = ot.tail;
            ot.rendering = Ta, ot.tail = Ta.sibling, ot.renderingStartTime = Wn(), Ta.sibling = null;
            var oa = il.current;
            return tn ? oa = bg(oa, Tp) : oa = Lf(oa), Uo(t, oa), Ta;
          }
          return Hr(t), null;
        }
        case ht:
          break;
        case Le:
        case Ut: {
          QS(t);
          var Qu = t.memoizedState, Qf = Qu !== null;
          if (e !== null) {
            var Jp = e.memoizedState, Jl = Jp !== null;
            Jl !== Qf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !le && (t.flags |= An);
          }
          return !Qf || (t.mode & Tt) === Qe ? Hr(t) : ea(Xl, Zr) && (Hr(t), t.subtreeFlags & (yn | Dt) && (t.flags |= An)), null;
        }
        case kt:
          return null;
        case Mt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ib(e, t, a) {
      switch (tg(t), t.tag) {
        case K: {
          var i = t.type;
          Yl(i) && Fh(t);
          var u = t.flags;
          return u & Jn ? (t.flags = u & ~Jn | Be, (t.mode & Ht) !== Qe && Zg(t), t) : null;
        }
        case Q: {
          t.stateNode, Nf(t), Xy(t), kg();
          var s = t.flags;
          return (s & Jn) !== $e && (s & Be) === $e ? (t.flags = s & ~Jn | Be, t) : null;
        }
        case ae:
          return wg(t), null;
        case Te: {
          Mf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            _f();
          }
          var p = t.flags;
          return p & Jn ? (t.flags = p & ~Jn | Be, (t.mode & Ht) !== Qe && Zg(t), t) : null;
        }
        case ft:
          return Mf(t), null;
        case fe:
          return Nf(t), null;
        case pe:
          var v = t.type._context;
          return hg(v, t), null;
        case Le:
        case Ut:
          return QS(t), null;
        case kt:
          return null;
        default:
          return null;
      }
    }
    function j0(e, t, a) {
      switch (tg(t), t.tag) {
        case K: {
          var i = t.type.childContextTypes;
          i != null && Fh(t);
          break;
        }
        case Q: {
          t.stateNode, Nf(t), Xy(t), kg();
          break;
        }
        case ae: {
          wg(t);
          break;
        }
        case fe:
          Nf(t);
          break;
        case Te:
          Mf(t);
          break;
        case ft:
          Mf(t);
          break;
        case pe:
          var u = t.type._context;
          hg(u, t);
          break;
        case Le:
        case Ut:
          QS(t);
          break;
      }
    }
    var F0 = null;
    F0 = /* @__PURE__ */ new Set();
    var Om = !1, Pr = !1, Yb = typeof WeakSet == "function" ? WeakSet : Set, ze = null, Hf = null, Pf = null;
    function $b(e) {
      bl(null, function() {
        throw e;
      }), us();
    }
    var Qb = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Ht)
        try {
          ql(), t.componentWillUnmount();
        } finally {
          Gl(e);
        }
      else
        t.componentWillUnmount();
    };
    function H0(e, t) {
      try {
        Ho(dr, e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function OS(e, t, a) {
      try {
        Qb(e, a);
      } catch (i) {
        dn(e, t, i);
      }
    }
    function Wb(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        dn(e, t, i);
      }
    }
    function P0(e, t) {
      try {
        B0(e);
      } catch (a) {
        dn(e, t, a);
      }
    }
    function Vf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (et && Et && e.mode & Ht)
              try {
                ql(), i = a(null);
              } finally {
                Gl(e);
              }
            else
              i = a(null);
          } catch (u) {
            dn(e, t, u);
          }
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", it(e));
        } else
          a.current = null;
    }
    function Nm(e, t, a) {
      try {
        a();
      } catch (i) {
        dn(e, t, i);
      }
    }
    var V0 = !1;
    function Gb(e, t) {
      lw(e.containerInfo), ze = t, qb();
      var a = V0;
      return V0 = !1, a;
    }
    function qb() {
      for (; ze !== null; ) {
        var e = ze, t = e.child;
        (e.subtreeFlags & kl) !== $e && t !== null ? (t.return = e, ze = t) : Kb();
      }
    }
    function Kb() {
      for (; ze !== null; ) {
        var e = ze;
        Kt(e);
        try {
          Xb(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        fn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ze = t;
          return;
        }
        ze = e.return;
      }
    }
    function Xb(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Qn) !== $e) {
        switch (Kt(e), e.tag) {
          case ee:
          case Re:
          case W:
            break;
          case K: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !ec && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", it(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", it(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ul(e.type, i), u);
              {
                var p = F0;
                f === void 0 && !p.has(e.type) && (p.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", it(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case Q: {
            {
              var v = e.stateNode;
              Nw(v.containerInfo);
            }
            break;
          }
          case ae:
          case de:
          case fe:
          case Ke:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        fn();
      }
    }
    function sl(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & Fr) !== Pa ? Ki(t) : (e & dr) !== Pa && cs(t), (e & $l) !== Pa && qp(!0), Nm(t, a, p), (e & $l) !== Pa && qp(!1), (e & Fr) !== Pa ? Ll() : (e & dr) !== Pa && bd());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Ho(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, s = u;
        do {
          if ((s.tag & e) === e) {
            (e & Fr) !== Pa ? xd(t) : (e & dr) !== Pa && Nc(t);
            var f = s.create;
            (e & $l) !== Pa && qp(!0), s.destroy = f(), (e & $l) !== Pa && qp(!1), (e & Fr) !== Pa ? Uv() : (e & dr) !== Pa && jv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & dr) !== $e ? v = "useLayoutEffect" : (s.tag & $l) !== $e ? v = "useInsertionEffect" : v = "useEffect";
                var y = void 0;
                p === null ? y = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof p.then == "function" ? y = `

It looks like you wrote ` + v + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + v + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : y = " You returned: " + p, g("%s must not return anything besides a function, which is used for clean-up.%s", v, y);
              }
            }
          }
          s = s.next;
        } while (s !== u);
      }
    }
    function Jb(e, t) {
      if ((t.flags & Dt) !== $e)
        switch (t.tag) {
          case Fe: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = r0(), p = t.alternate === null ? "mount" : "update";
            n0() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case Q:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
                case Fe:
                  var S = v.stateNode;
                  S.passiveEffectDuration += a;
                  break e;
              }
              v = v.return;
            }
            break;
          }
        }
    }
    function Zb(e, t, a, i) {
      if ((a.flags & Ol) !== $e)
        switch (a.tag) {
          case ee:
          case Re:
          case W: {
            if (!Pr)
              if (a.mode & Ht)
                try {
                  ql(), Ho(dr | fr, a);
                } finally {
                  Gl(a);
                }
              else
                Ho(dr | fr, a);
            break;
          }
          case K: {
            var u = a.stateNode;
            if (a.flags & Dt && !Pr)
              if (t === null)
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", it(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", it(a) || "instance")), a.mode & Ht)
                  try {
                    ql(), u.componentDidMount();
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ul(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", it(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", it(a) || "instance")), a.mode & Ht)
                  try {
                    ql(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !ec && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", it(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", it(a) || "instance")), _C(a, p, u));
            break;
          }
          case Q: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ae:
                    y = a.child.stateNode;
                    break;
                  case K:
                    y = a.child.stateNode;
                    break;
                }
              _C(a, v, y);
            }
            break;
          }
          case ae: {
            var S = a.stateNode;
            if (t === null && a.flags & Dt) {
              var k = a.type, b = a.memoizedProps;
              yw(S, k, b);
            }
            break;
          }
          case de:
            break;
          case fe:
            break;
          case Fe: {
            {
              var U = a.memoizedProps, H = U.onCommit, V = U.onRender, Ee = a.stateNode.effectDuration, qe = r0(), Pe = t === null ? "mount" : "update";
              n0() && (Pe = "nested-update"), typeof V == "function" && V(a.memoizedProps.id, Pe, a.actualDuration, a.treeBaseDuration, a.actualStartTime, qe);
              {
                typeof H == "function" && H(a.memoizedProps.id, Pe, Ee, qe), K_(a);
                var Lt = a.return;
                e: for (; Lt !== null; ) {
                  switch (Lt.tag) {
                    case Q:
                      var bt = Lt.stateNode;
                      bt.effectDuration += Ee;
                      break e;
                    case Fe:
                      var M = Lt.stateNode;
                      M.effectDuration += Ee;
                      break e;
                  }
                  Lt = Lt.return;
                }
              }
            }
            break;
          }
          case Te: {
            u_(e, a);
            break;
          }
          case ft:
          case Ke:
          case ht:
          case Le:
          case Ut:
          case Mt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Pr || a.flags & Cn && B0(a);
    }
    function e_(e) {
      switch (e.tag) {
        case ee:
        case Re:
        case W: {
          if (e.mode & Ht)
            try {
              ql(), H0(e, e.return);
            } finally {
              Gl(e);
            }
          else
            H0(e, e.return);
          break;
        }
        case K: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && Wb(e, e.return, t), P0(e, e.return);
          break;
        }
        case ae: {
          P0(e, e.return);
          break;
        }
      }
    }
    function t_(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ae) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? _w(u) : Dw(i.stateNode, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
          }
        } else if (i.tag === de) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? kw(s) : Ow(s, i.memoizedProps);
            } catch (f) {
              dn(e, e.return, f);
            }
        } else if (!((i.tag === Le || i.tag === Ut) && i.memoizedState !== null && i !== e)) {
          if (i.child !== null) {
            i.child.return = i, i = i.child;
            continue;
          }
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          a === i && (a = null), i = i.return;
        }
        a === i && (a = null), i.sibling.return = i.return, i = i.sibling;
      }
    }
    function B0(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case ae:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & Ht)
            try {
              ql(), u = t(i);
            } finally {
              Gl(e);
            }
          else
            u = t(i);
          typeof u == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", it(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", it(e)), t.current = i;
      }
    }
    function n_(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function I0(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, I0(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ae) {
          var a = e.stateNode;
          a !== null && ox(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function r_(e) {
      for (var t = e.return; t !== null; ) {
        if (Y0(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Y0(e) {
      return e.tag === ae || e.tag === Q || e.tag === fe;
    }
    function $0(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || Y0(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== ae && t.tag !== de && t.tag !== We; ) {
          if (t.flags & yn || t.child === null || t.tag === fe)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & yn))
          return t.stateNode;
      }
    }
    function a_(e) {
      var t = r_(e);
      switch (t.tag) {
        case ae: {
          var a = t.stateNode;
          t.flags & Oa && (WE(a), t.flags &= ~Oa);
          var i = $0(e);
          LS(e, i, a);
          break;
        }
        case Q:
        case fe: {
          var u = t.stateNode.containerInfo, s = $0(e);
          NS(e, s, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function NS(e, t, a) {
      var i = e.tag, u = i === ae || i === de;
      if (u) {
        var s = e.stateNode;
        t ? Tw(a, s, t) : Cw(a, s);
      } else if (i !== fe) {
        var f = e.child;
        if (f !== null) {
          NS(f, t, a);
          for (var p = f.sibling; p !== null; )
            NS(p, t, a), p = p.sibling;
        }
      }
    }
    function LS(e, t, a) {
      var i = e.tag, u = i === ae || i === de;
      if (u) {
        var s = e.stateNode;
        t ? Rw(a, s, t) : Ew(a, s);
      } else if (i !== fe) {
        var f = e.child;
        if (f !== null) {
          LS(f, t, a);
          for (var p = f.sibling; p !== null; )
            LS(p, t, a), p = p.sibling;
        }
      }
    }
    var Vr = null, cl = !1;
    function i_(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case ae: {
              Vr = i.stateNode, cl = !1;
              break e;
            }
            case Q: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case fe: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Vr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        Q0(e, t, a), Vr = null, cl = !1;
      }
      n_(a);
    }
    function Po(e, t, a) {
      for (var i = a.child; i !== null; )
        Q0(e, t, i), i = i.sibling;
    }
    function Q0(e, t, a) {
      switch (Rd(a), a.tag) {
        case ae:
          Pr || Vf(a, t);
        case de: {
          {
            var i = Vr, u = cl;
            Vr = null, Po(e, t, a), Vr = i, cl = u, Vr !== null && (cl ? xw(Vr, a.stateNode) : ww(Vr, a.stateNode));
          }
          return;
        }
        case We: {
          Vr !== null && (cl ? bw(Vr, a.stateNode) : Iy(Vr, a.stateNode));
          return;
        }
        case fe: {
          {
            var s = Vr, f = cl;
            Vr = a.stateNode.containerInfo, cl = !0, Po(e, t, a), Vr = s, cl = f;
          }
          return;
        }
        case ee:
        case Re:
        case Ye:
        case W: {
          if (!Pr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, S = y;
                do {
                  var k = S, b = k.destroy, U = k.tag;
                  b !== void 0 && ((U & $l) !== Pa ? Nm(a, t, b) : (U & dr) !== Pa && (cs(a), a.mode & Ht ? (ql(), Nm(a, t, b), Gl(a)) : Nm(a, t, b), bd())), S = S.next;
                } while (S !== y);
              }
            }
          }
          Po(e, t, a);
          return;
        }
        case K: {
          if (!Pr) {
            Vf(a, t);
            var H = a.stateNode;
            typeof H.componentWillUnmount == "function" && OS(a, t, H);
          }
          Po(e, t, a);
          return;
        }
        case ht: {
          Po(e, t, a);
          return;
        }
        case Le: {
          if (
            // TODO: Remove this dead flag
            a.mode & Tt
          ) {
            var V = Pr;
            Pr = V || a.memoizedState !== null, Po(e, t, a), Pr = V;
          } else
            Po(e, t, a);
          break;
        }
        default: {
          Po(e, t, a);
          return;
        }
      }
    }
    function l_(e) {
      e.memoizedState;
    }
    function u_(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && $w(s);
          }
        }
      }
    }
    function W0(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new Yb()), t.forEach(function(i) {
          var u = r1.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Jr)
              if (Hf !== null && Pf !== null)
                Gp(Pf, Hf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function o_(e, t, a) {
      Hf = a, Pf = e, Kt(t), G0(t, e), Kt(t), Hf = null, Pf = null;
    }
    function fl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            i_(e, t, s);
          } catch (v) {
            dn(s, t, v);
          }
        }
      var f = Sl();
      if (t.subtreeFlags & Dl)
        for (var p = t.child; p !== null; )
          Kt(p), G0(p, e), p = p.sibling;
      Kt(f);
    }
    function G0(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case ee:
        case Re:
        case Ye:
        case W: {
          if (fl(t, e), Kl(e), u & Dt) {
            try {
              sl($l | fr, e, e.return), Ho($l | fr, e);
            } catch (rt) {
              dn(e, e.return, rt);
            }
            if (e.mode & Ht) {
              try {
                ql(), sl(dr | fr, e, e.return);
              } catch (rt) {
                dn(e, e.return, rt);
              }
              Gl(e);
            } else
              try {
                sl(dr | fr, e, e.return);
              } catch (rt) {
                dn(e, e.return, rt);
              }
          }
          return;
        }
        case K: {
          fl(t, e), Kl(e), u & Cn && i !== null && Vf(i, i.return);
          return;
        }
        case ae: {
          fl(t, e), Kl(e), u & Cn && i !== null && Vf(i, i.return);
          {
            if (e.flags & Oa) {
              var s = e.stateNode;
              try {
                WE(s);
              } catch (rt) {
                dn(e, e.return, rt);
              }
            }
            if (u & Dt) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, S = e.updateQueue;
                if (e.updateQueue = null, S !== null)
                  try {
                    gw(f, S, y, v, p, e);
                  } catch (rt) {
                    dn(e, e.return, rt);
                  }
              }
            }
          }
          return;
        }
        case de: {
          if (fl(t, e), Kl(e), u & Dt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var k = e.stateNode, b = e.memoizedProps, U = i !== null ? i.memoizedProps : b;
            try {
              Sw(k, U, b);
            } catch (rt) {
              dn(e, e.return, rt);
            }
          }
          return;
        }
        case Q: {
          if (fl(t, e), Kl(e), u & Dt && i !== null) {
            var H = i.memoizedState;
            if (H.isDehydrated)
              try {
                Yw(t.containerInfo);
              } catch (rt) {
                dn(e, e.return, rt);
              }
          }
          return;
        }
        case fe: {
          fl(t, e), Kl(e);
          return;
        }
        case Te: {
          fl(t, e), Kl(e);
          var V = e.child;
          if (V.flags & An) {
            var Ee = V.stateNode, qe = V.memoizedState, Pe = qe !== null;
            if (Ee.isHidden = Pe, Pe) {
              var Lt = V.alternate !== null && V.alternate.memoizedState !== null;
              Lt || B_();
            }
          }
          if (u & Dt) {
            try {
              l_(e);
            } catch (rt) {
              dn(e, e.return, rt);
            }
            W0(e);
          }
          return;
        }
        case Le: {
          var bt = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Tt
          ) {
            var M = Pr;
            Pr = M || bt, fl(t, e), Pr = M;
          } else
            fl(t, e);
          if (Kl(e), u & An) {
            var B = e.stateNode, A = e.memoizedState, re = A !== null, De = e;
            if (B.isHidden = re, re && !bt && (De.mode & Tt) !== Qe) {
              ze = De;
              for (var we = De.child; we !== null; )
                ze = we, c_(we), we = we.sibling;
            }
            t_(De, re);
          }
          return;
        }
        case ft: {
          fl(t, e), Kl(e), u & Dt && W0(e);
          return;
        }
        case ht:
          return;
        default: {
          fl(t, e), Kl(e);
          return;
        }
      }
    }
    function Kl(e) {
      var t = e.flags;
      if (t & yn) {
        try {
          a_(e);
        } catch (a) {
          dn(e, e.return, a);
        }
        e.flags &= ~yn;
      }
      t & qr && (e.flags &= ~qr);
    }
    function s_(e, t, a) {
      Hf = a, Pf = t, ze = e, q0(e, t, a), Hf = null, Pf = null;
    }
    function q0(e, t, a) {
      for (var i = (e.mode & Tt) !== Qe; ze !== null; ) {
        var u = ze, s = u.child;
        if (u.tag === Le && i) {
          var f = u.memoizedState !== null, p = f || Om;
          if (p) {
            MS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, S = y || Pr, k = Om, b = Pr;
            Om = p, Pr = S, Pr && !b && (ze = u, f_(u));
            for (var U = s; U !== null; )
              ze = U, q0(
                U,
                // New root; bubble back up to here and stop.
                t,
                a
              ), U = U.sibling;
            ze = u, Om = k, Pr = b, MS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ol) !== $e && s !== null ? (s.return = u, ze = s) : MS(e, t, a);
      }
    }
    function MS(e, t, a) {
      for (; ze !== null; ) {
        var i = ze;
        if ((i.flags & Ol) !== $e) {
          var u = i.alternate;
          Kt(i);
          try {
            Zb(t, u, i, a);
          } catch (f) {
            dn(i, i.return, f);
          }
          fn();
        }
        if (i === e) {
          ze = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, ze = s;
          return;
        }
        ze = i.return;
      }
    }
    function c_(e) {
      for (; ze !== null; ) {
        var t = ze, a = t.child;
        switch (t.tag) {
          case ee:
          case Re:
          case Ye:
          case W: {
            if (t.mode & Ht)
              try {
                ql(), sl(dr, t, t.return);
              } finally {
                Gl(t);
              }
            else
              sl(dr, t, t.return);
            break;
          }
          case K: {
            Vf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && OS(t, t.return, i);
            break;
          }
          case ae: {
            Vf(t, t.return);
            break;
          }
          case Le: {
            var u = t.memoizedState !== null;
            if (u) {
              K0(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, ze = a) : K0(e);
      }
    }
    function K0(e) {
      for (; ze !== null; ) {
        var t = ze;
        if (t === e) {
          ze = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, ze = a;
          return;
        }
        ze = t.return;
      }
    }
    function f_(e) {
      for (; ze !== null; ) {
        var t = ze, a = t.child;
        if (t.tag === Le) {
          var i = t.memoizedState !== null;
          if (i) {
            X0(e);
            continue;
          }
        }
        a !== null ? (a.return = t, ze = a) : X0(e);
      }
    }
    function X0(e) {
      for (; ze !== null; ) {
        var t = ze;
        Kt(t);
        try {
          e_(t);
        } catch (i) {
          dn(t, t.return, i);
        }
        if (fn(), t === e) {
          ze = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, ze = a;
          return;
        }
        ze = t.return;
      }
    }
    function d_(e, t, a, i) {
      ze = t, p_(t, e, a, i);
    }
    function p_(e, t, a, i) {
      for (; ze !== null; ) {
        var u = ze, s = u.child;
        (u.subtreeFlags & Gi) !== $e && s !== null ? (s.return = u, ze = s) : v_(e, t, a, i);
      }
    }
    function v_(e, t, a, i) {
      for (; ze !== null; ) {
        var u = ze;
        if ((u.flags & Gr) !== $e) {
          Kt(u);
          try {
            h_(t, u, a, i);
          } catch (f) {
            dn(u, u.return, f);
          }
          fn();
        }
        if (u === e) {
          ze = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, ze = s;
          return;
        }
        ze = u.return;
      }
    }
    function h_(e, t, a, i) {
      switch (t.tag) {
        case ee:
        case Re:
        case W: {
          if (t.mode & Ht) {
            Jg();
            try {
              Ho(Fr | fr, t);
            } finally {
              Xg(t);
            }
          } else
            Ho(Fr | fr, t);
          break;
        }
      }
    }
    function m_(e) {
      ze = e, y_();
    }
    function y_() {
      for (; ze !== null; ) {
        var e = ze, t = e.child;
        if ((ze.flags & Da) !== $e) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              ze = u, E_(u, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var f = s.child;
                if (f !== null) {
                  s.child = null;
                  do {
                    var p = f.sibling;
                    f.sibling = null, f = p;
                  } while (f !== null);
                }
              }
            }
            ze = e;
          }
        }
        (e.subtreeFlags & Gi) !== $e && t !== null ? (t.return = e, ze = t) : g_();
      }
    }
    function g_() {
      for (; ze !== null; ) {
        var e = ze;
        (e.flags & Gr) !== $e && (Kt(e), S_(e), fn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ze = t;
          return;
        }
        ze = e.return;
      }
    }
    function S_(e) {
      switch (e.tag) {
        case ee:
        case Re:
        case W: {
          e.mode & Ht ? (Jg(), sl(Fr | fr, e, e.return), Xg(e)) : sl(Fr | fr, e, e.return);
          break;
        }
      }
    }
    function E_(e, t) {
      for (; ze !== null; ) {
        var a = ze;
        Kt(a), R_(a, t), fn();
        var i = a.child;
        i !== null ? (i.return = a, ze = i) : C_(e);
      }
    }
    function C_(e) {
      for (; ze !== null; ) {
        var t = ze, a = t.sibling, i = t.return;
        if (I0(t), t === e) {
          ze = null;
          return;
        }
        if (a !== null) {
          a.return = i, ze = a;
          return;
        }
        ze = i;
      }
    }
    function R_(e, t) {
      switch (e.tag) {
        case ee:
        case Re:
        case W: {
          e.mode & Ht ? (Jg(), sl(Fr, e, t), Xg(e)) : sl(Fr, e, t);
          break;
        }
      }
    }
    function T_(e) {
      switch (e.tag) {
        case ee:
        case Re:
        case W: {
          try {
            Ho(dr | fr, e);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case K: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
      }
    }
    function w_(e) {
      switch (e.tag) {
        case ee:
        case Re:
        case W: {
          try {
            Ho(Fr | fr, e);
          } catch (t) {
            dn(e, e.return, t);
          }
          break;
        }
      }
    }
    function x_(e) {
      switch (e.tag) {
        case ee:
        case Re:
        case W: {
          try {
            sl(dr | fr, e, e.return);
          } catch (a) {
            dn(e, e.return, a);
          }
          break;
        }
        case K: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && OS(e, e.return, t);
          break;
        }
      }
    }
    function b_(e) {
      switch (e.tag) {
        case ee:
        case Re:
        case W:
          try {
            sl(Fr | fr, e, e.return);
          } catch (t) {
            dn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var jp = Symbol.for;
      jp("selector.component"), jp("selector.has_pseudo_class"), jp("selector.role"), jp("selector.test_id"), jp("selector.text");
    }
    var __ = [];
    function k_() {
      __.forEach(function(e) {
        return e();
      });
    }
    var D_ = x.ReactCurrentActQueue;
    function O_(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function J0() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && D_.current !== null && g("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var N_ = Math.ceil, AS = x.ReactCurrentDispatcher, zS = x.ReactCurrentOwner, Br = x.ReactCurrentBatchConfig, dl = x.ReactCurrentActQueue, hr = (
      /*             */
      0
    ), Z0 = (
      /*               */
      1
    ), Ir = (
      /*                */
      2
    ), ji = (
      /*                */
      4
    ), Bu = 0, Fp = 1, tc = 2, Lm = 3, Hp = 4, eR = 5, US = 6, Nt = hr, Ea = null, On = null, mr = q, Xl = q, jS = Oo(q), yr = Bu, Pp = null, Mm = q, Vp = q, Am = q, Bp = null, Va = null, FS = 0, tR = 500, nR = 1 / 0, L_ = 500, Iu = null;
    function Ip() {
      nR = Wn() + L_;
    }
    function rR() {
      return nR;
    }
    var zm = !1, HS = null, Bf = null, nc = !1, Vo = null, Yp = q, PS = [], VS = null, M_ = 50, $p = 0, BS = null, IS = !1, Um = !1, A_ = 50, If = 0, jm = null, Qp = nn, Fm = q, aR = !1;
    function Hm() {
      return Ea;
    }
    function Ca() {
      return (Nt & (Ir | ji)) !== hr ? Wn() : (Qp !== nn || (Qp = Wn()), Qp);
    }
    function Bo(e) {
      var t = e.mode;
      if ((t & Tt) === Qe)
        return tt;
      if ((Nt & Ir) !== hr && mr !== q)
        return Ts(mr);
      var a = Dx() !== kx;
      if (a) {
        if (Br.transition !== null) {
          var i = Br.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Fm === jt && (Fm = Ad()), Fm;
      }
      var u = Ua();
      if (u !== jt)
        return u;
      var s = pw();
      return s;
    }
    function z_(e) {
      var t = e.mode;
      return (t & Tt) === Qe ? tt : Iv();
    }
    function gr(e, t, a, i) {
      i1(), aR && g("useInsertionEffect must not schedule updates."), IS && (Um = !0), So(e, a, i), (Nt & Ir) !== q && e === Ea ? o1(t) : (Jr && bs(e, t, a), s1(t), e === Ea && ((Nt & Ir) === hr && (Vp = dt(Vp, a)), yr === Hp && Io(e, mr)), Ba(e, i), a === tt && Nt === hr && (t.mode & Tt) === Qe && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !dl.isBatchingLegacy && (Ip(), aC()));
    }
    function U_(e, t, a) {
      var i = e.current;
      i.lanes = t, So(e, t, a), Ba(e, a);
    }
    function j_(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Nt & Ir) !== hr
      );
    }
    function Ba(e, t) {
      var a = e.callbackNode;
      Xc(e, t);
      var i = Kc(e, e === Ea ? mr : q);
      if (i === q) {
        a !== null && ER(a), e.callbackNode = null, e.callbackPriority = jt;
        return;
      }
      var u = zl(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== KS)) {
        a == null && s !== tt && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && ER(a);
      var f;
      if (u === tt)
        e.tag === No ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), fx(uR.bind(null, e))) : rC(uR.bind(null, e)), dl.current !== null ? dl.current.push(Lo) : hw(function() {
          (Nt & (Ir | ji)) === hr && Lo();
        }), f = null;
      else {
        var p;
        switch (Kv(i)) {
          case Lr:
            p = ss;
            break;
          case _i:
            p = Nl;
            break;
          case Aa:
            p = qi;
            break;
          case za:
            p = mu;
            break;
          default:
            p = qi;
            break;
        }
        f = XS(p, iR.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function iR(e, t) {
      if (tb(), Qp = nn, Fm = q, (Nt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = $u();
      if (i && e.callbackNode !== a)
        return null;
      var u = Kc(e, e === Ea ? mr : q);
      if (u === q)
        return null;
      var s = !Zc(e, u) && !Bv(e, u) && !t, f = s ? W_(e, u) : Vm(e, u);
      if (f !== Bu) {
        if (f === tc) {
          var p = Jc(e);
          p !== q && (u = p, f = YS(e, p));
        }
        if (f === Fp) {
          var v = Pp;
          throw rc(e, q), Io(e, u), Ba(e, Wn()), v;
        }
        if (f === US)
          Io(e, u);
        else {
          var y = !Zc(e, u), S = e.current.alternate;
          if (y && !H_(S)) {
            if (f = Vm(e, u), f === tc) {
              var k = Jc(e);
              k !== q && (u = k, f = YS(e, k));
            }
            if (f === Fp) {
              var b = Pp;
              throw rc(e, q), Io(e, u), Ba(e, Wn()), b;
            }
          }
          e.finishedWork = S, e.finishedLanes = u, F_(e, f, u);
        }
      }
      return Ba(e, Wn()), e.callbackNode === a ? iR.bind(null, e) : null;
    }
    function YS(e, t) {
      var a = Bp;
      if (nf(e)) {
        var i = rc(e, t);
        i.flags |= Rr, ax(e.containerInfo);
      }
      var u = Vm(e, t);
      if (u !== tc) {
        var s = Va;
        Va = a, s !== null && lR(s);
      }
      return u;
    }
    function lR(e) {
      Va === null ? Va = e : Va.push.apply(Va, e);
    }
    function F_(e, t, a) {
      switch (t) {
        case Bu:
        case Fp:
          throw new Error("Root did not complete. This is a bug in React.");
        case tc: {
          ac(e, Va, Iu);
          break;
        }
        case Lm: {
          if (Io(e, a), _u(a) && // do not delay if we're inside an act() scope
          !CR()) {
            var i = FS + tR - Wn();
            if (i > 10) {
              var u = Kc(e, q);
              if (u !== q)
                break;
              var s = e.suspendedLanes;
              if (!ku(s, a)) {
                Ca(), ef(e, s);
                break;
              }
              e.timeoutHandle = Vy(ac.bind(null, e, Va, Iu), i);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case Hp: {
          if (Io(e, a), Ld(a))
            break;
          if (!CR()) {
            var f = ai(e, a), p = f, v = Wn() - p, y = a1(v) - v;
            if (y > 10) {
              e.timeoutHandle = Vy(ac.bind(null, e, Va, Iu), y);
              break;
            }
          }
          ac(e, Va, Iu);
          break;
        }
        case eR: {
          ac(e, Va, Iu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function H_(e) {
      for (var t = e; ; ) {
        if (t.flags & vo) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!Z(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & vo && v !== null) {
          v.return = t, t = v;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function Io(e, t) {
      t = ws(t, Am), t = ws(t, Vp), Qv(e, t);
    }
    function uR(e) {
      if (nb(), (Nt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      $u();
      var t = Kc(e, q);
      if (!ea(t, tt))
        return Ba(e, Wn()), null;
      var a = Vm(e, t);
      if (e.tag !== No && a === tc) {
        var i = Jc(e);
        i !== q && (t = i, a = YS(e, i));
      }
      if (a === Fp) {
        var u = Pp;
        throw rc(e, q), Io(e, t), Ba(e, Wn()), u;
      }
      if (a === US)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, ac(e, Va, Iu), Ba(e, Wn()), null;
    }
    function P_(e, t) {
      t !== q && (tf(e, dt(t, tt)), Ba(e, Wn()), (Nt & (Ir | ji)) === hr && (Ip(), Lo()));
    }
    function $S(e, t) {
      var a = Nt;
      Nt |= Z0;
      try {
        return e(t);
      } finally {
        Nt = a, Nt === hr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !dl.isBatchingLegacy && (Ip(), aC());
      }
    }
    function V_(e, t, a, i, u) {
      var s = Ua(), f = Br.transition;
      try {
        return Br.transition = null, Fn(Lr), e(t, a, i, u);
      } finally {
        Fn(s), Br.transition = f, Nt === hr && Ip();
      }
    }
    function Yu(e) {
      Vo !== null && Vo.tag === No && (Nt & (Ir | ji)) === hr && $u();
      var t = Nt;
      Nt |= Z0;
      var a = Br.transition, i = Ua();
      try {
        return Br.transition = null, Fn(Lr), e ? e() : void 0;
      } finally {
        Fn(i), Br.transition = a, Nt = t, (Nt & (Ir | ji)) === hr && Lo();
      }
    }
    function oR() {
      return (Nt & (Ir | ji)) !== hr;
    }
    function Pm(e, t) {
      ia(jS, Xl, e), Xl = dt(Xl, t);
    }
    function QS(e) {
      Xl = jS.current, aa(jS, e);
    }
    function rc(e, t) {
      e.finishedWork = null, e.finishedLanes = q;
      var a = e.timeoutHandle;
      if (a !== By && (e.timeoutHandle = By, vw(a)), On !== null)
        for (var i = On.return; i !== null; ) {
          var u = i.alternate;
          j0(u, i), i = i.return;
        }
      Ea = e;
      var s = ic(e.current, null);
      return On = s, mr = Xl = t, yr = Bu, Pp = null, Mm = q, Vp = q, Am = q, Bp = null, Va = null, Ux(), al.discardPendingWarnings(), s;
    }
    function sR(e, t) {
      do {
        var a = On;
        try {
          if (Kh(), MC(), fn(), zS.current = null, a === null || a.return === null) {
            yr = Fp, Pp = t, On = null;
            return;
          }
          if (et && a.mode & Ht && xm(a, !0), nt)
            if (ma(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              bi(a, i, mr);
            } else
              fs(a, t, mr);
          fb(e, a.return, a, t, mr), pR(a);
        } catch (u) {
          t = u, On === a && a !== null ? (a = a.return, On = a) : a = On;
          continue;
        }
        return;
      } while (!0);
    }
    function cR() {
      var e = AS.current;
      return AS.current = Em, e === null ? Em : e;
    }
    function fR(e) {
      AS.current = e;
    }
    function B_() {
      FS = Wn();
    }
    function Wp(e) {
      Mm = dt(e, Mm);
    }
    function I_() {
      yr === Bu && (yr = Lm);
    }
    function WS() {
      (yr === Bu || yr === Lm || yr === tc) && (yr = Hp), Ea !== null && (Rs(Mm) || Rs(Vp)) && Io(Ea, mr);
    }
    function Y_(e) {
      yr !== Hp && (yr = tc), Bp === null ? Bp = [e] : Bp.push(e);
    }
    function $_() {
      return yr === Bu;
    }
    function Vm(e, t) {
      var a = Nt;
      Nt |= Ir;
      var i = cR();
      if (Ea !== e || mr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Gp(e, mr), u.clear()), Wv(e, t);
        }
        Iu = Fd(), rc(e, t);
      }
      Eu(t);
      do
        try {
          Q_();
          break;
        } catch (s) {
          sR(e, s);
        }
      while (!0);
      if (Kh(), Nt = a, fR(i), On !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Lc(), Ea = null, mr = q, yr;
    }
    function Q_() {
      for (; On !== null; )
        dR(On);
    }
    function W_(e, t) {
      var a = Nt;
      Nt |= Ir;
      var i = cR();
      if (Ea !== e || mr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Gp(e, mr), u.clear()), Wv(e, t);
        }
        Iu = Fd(), Ip(), rc(e, t);
      }
      Eu(t);
      do
        try {
          G_();
          break;
        } catch (s) {
          sR(e, s);
        }
      while (!0);
      return Kh(), fR(i), Nt = a, On !== null ? (Fv(), Bu) : (Lc(), Ea = null, mr = q, yr);
    }
    function G_() {
      for (; On !== null && !yd(); )
        dR(On);
    }
    function dR(e) {
      var t = e.alternate;
      Kt(e);
      var a;
      (e.mode & Ht) !== Qe ? (Kg(e), a = GS(t, e, Xl), xm(e, !0)) : a = GS(t, e, Xl), fn(), e.memoizedProps = e.pendingProps, a === null ? pR(e) : On = a, zS.current = null;
    }
    function pR(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & os) === $e) {
          Kt(t);
          var u = void 0;
          if ((t.mode & Ht) === Qe ? u = U0(a, t, Xl) : (Kg(t), u = U0(a, t, Xl), xm(t, !1)), fn(), u !== null) {
            On = u;
            return;
          }
        } else {
          var s = Ib(a, t);
          if (s !== null) {
            s.flags &= Lv, On = s;
            return;
          }
          if ((t.mode & Ht) !== Qe) {
            xm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= os, i.subtreeFlags = $e, i.deletions = null;
          else {
            yr = US, On = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          On = v;
          return;
        }
        t = i, On = t;
      } while (t !== null);
      yr === Bu && (yr = eR);
    }
    function ac(e, t, a) {
      var i = Ua(), u = Br.transition;
      try {
        Br.transition = null, Fn(Lr), q_(e, t, a, i);
      } finally {
        Br.transition = u, Fn(i);
      }
      return null;
    }
    function q_(e, t, a, i) {
      do
        $u();
      while (Vo !== null);
      if (l1(), (Nt & (Ir | ji)) !== hr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (Td(s), u === null)
        return wd(), null;
      if (s === q && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = q, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = jt;
      var f = dt(u.lanes, u.childLanes);
      Ud(e, f), e === Ea && (Ea = null, On = null, mr = q), ((u.subtreeFlags & Gi) !== $e || (u.flags & Gi) !== $e) && (nc || (nc = !0, VS = a, XS(qi, function() {
        return $u(), null;
      })));
      var p = (u.subtreeFlags & (kl | Dl | Ol | Gi)) !== $e, v = (u.flags & (kl | Dl | Ol | Gi)) !== $e;
      if (p || v) {
        var y = Br.transition;
        Br.transition = null;
        var S = Ua();
        Fn(Lr);
        var k = Nt;
        Nt |= ji, zS.current = null, Gb(e, u), a0(), o_(e, u, s), uw(e.containerInfo), e.current = u, ds(s), s_(u, e, s), ps(), gd(), Nt = k, Fn(S), Br.transition = y;
      } else
        e.current = u, a0();
      var b = nc;
      if (nc ? (nc = !1, Vo = e, Yp = s) : (If = 0, jm = null), f = e.pendingLanes, f === q && (Bf = null), b || yR(e.current, !1), Ed(u.stateNode, i), Jr && e.memoizedUpdaters.clear(), k_(), Ba(e, Wn()), t !== null)
        for (var U = e.onRecoverableError, H = 0; H < t.length; H++) {
          var V = t[H], Ee = V.stack, qe = V.digest;
          U(V.value, {
            componentStack: Ee,
            digest: qe
          });
        }
      if (zm) {
        zm = !1;
        var Pe = HS;
        throw HS = null, Pe;
      }
      return ea(Yp, tt) && e.tag !== No && $u(), f = e.pendingLanes, ea(f, tt) ? (eb(), e === BS ? $p++ : ($p = 0, BS = e)) : $p = 0, Lo(), wd(), null;
    }
    function $u() {
      if (Vo !== null) {
        var e = Kv(Yp), t = ks(Aa, e), a = Br.transition, i = Ua();
        try {
          return Br.transition = null, Fn(t), X_();
        } finally {
          Fn(i), Br.transition = a;
        }
      }
      return !1;
    }
    function K_(e) {
      PS.push(e), nc || (nc = !0, XS(qi, function() {
        return $u(), null;
      }));
    }
    function X_() {
      if (Vo === null)
        return !1;
      var e = VS;
      VS = null;
      var t = Vo, a = Yp;
      if (Vo = null, Yp = q, (Nt & (Ir | ji)) !== hr)
        throw new Error("Cannot flush passive effects while already rendering.");
      IS = !0, Um = !1, Su(a);
      var i = Nt;
      Nt |= ji, m_(t.current), d_(t, t.current, a, e);
      {
        var u = PS;
        PS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          Jb(t, f);
        }
      }
      _d(), yR(t.current, !0), Nt = i, Lo(), Um ? t === jm ? If++ : (If = 0, jm = t) : If = 0, IS = !1, Um = !1, Cd(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function vR(e) {
      return Bf !== null && Bf.has(e);
    }
    function J_(e) {
      Bf === null ? Bf = /* @__PURE__ */ new Set([e]) : Bf.add(e);
    }
    function Z_(e) {
      zm || (zm = !0, HS = e);
    }
    var e1 = Z_;
    function hR(e, t, a) {
      var i = Zs(a, t), u = d0(e, i, tt), s = Ao(e, u, tt), f = Ca();
      s !== null && (So(s, tt, f), Ba(s, f));
    }
    function dn(e, t, a) {
      if ($b(a), qp(!1), e.tag === Q) {
        hR(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === Q) {
          hR(i, e, a);
          return;
        } else if (i.tag === K) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !vR(s)) {
            var f = Zs(a, e), p = vS(i, f, tt), v = Ao(i, p, tt), y = Ca();
            v !== null && (So(v, tt, y), Ba(v, y));
            return;
          }
        }
        i = i.return;
      }
      g(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function t1(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ca();
      ef(e, a), c1(e), Ea === e && ku(mr, a) && (yr === Hp || yr === Lm && _u(mr) && Wn() - FS < tR ? rc(e, q) : Am = dt(Am, a)), Ba(e, u);
    }
    function mR(e, t) {
      t === jt && (t = z_(e));
      var a = Ca(), i = Ha(e, t);
      i !== null && (So(i, t, a), Ba(i, a));
    }
    function n1(e) {
      var t = e.memoizedState, a = jt;
      t !== null && (a = t.retryLane), mR(e, a);
    }
    function r1(e, t) {
      var a = jt, i;
      switch (e.tag) {
        case Te:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case ft:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), mR(e, a);
    }
    function a1(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : N_(e / 1960) * 1960;
    }
    function i1() {
      if ($p > M_)
        throw $p = 0, BS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      If > A_ && (If = 0, jm = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function l1() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function yR(e, t) {
      Kt(e), Bm(e, _l, x_), t && Bm(e, Ti, b_), Bm(e, _l, T_), t && Bm(e, Ti, w_), fn();
    }
    function Bm(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== $e ? i = i.child : ((i.flags & t) !== $e && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Im = null;
    function gR(e) {
      {
        if ((Nt & Ir) !== hr || !(e.mode & Tt))
          return;
        var t = e.tag;
        if (t !== Ve && t !== Q && t !== K && t !== ee && t !== Re && t !== Ye && t !== W)
          return;
        var a = it(e) || "ReactComponent";
        if (Im !== null) {
          if (Im.has(a))
            return;
          Im.add(a);
        } else
          Im = /* @__PURE__ */ new Set([a]);
        var i = lr;
        try {
          Kt(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Kt(e) : fn();
        }
      }
    }
    var GS;
    {
      var u1 = null;
      GS = function(e, t, a) {
        var i = bR(u1, t);
        try {
          return N0(e, t, a);
        } catch (s) {
          if (Sx() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Kh(), MC(), j0(e, t), bR(t, i), t.mode & Ht && Kg(t), bl(null, N0, null, e, t, a), Qi()) {
            var u = us();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var SR = !1, qS;
    qS = /* @__PURE__ */ new Set();
    function o1(e) {
      if (mi && !Xx())
        switch (e.tag) {
          case ee:
          case Re:
          case W: {
            var t = On && it(On) || "Unknown", a = t;
            if (!qS.has(a)) {
              qS.add(a);
              var i = it(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case K: {
            SR || (g("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), SR = !0);
            break;
          }
        }
    }
    function Gp(e, t) {
      if (Jr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          bs(e, i, t);
        });
      }
    }
    var KS = {};
    function XS(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), KS) : md(e, t);
      }
    }
    function ER(e) {
      if (e !== KS)
        return Av(e);
    }
    function CR() {
      return dl.current !== null;
    }
    function s1(e) {
      {
        if (e.mode & Tt) {
          if (!J0())
            return;
        } else if (!O_() || Nt !== hr || e.tag !== ee && e.tag !== Re && e.tag !== W)
          return;
        if (dl.current === null) {
          var t = lr;
          try {
            Kt(e), g(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, it(e));
          } finally {
            t ? Kt(e) : fn();
          }
        }
      }
    }
    function c1(e) {
      e.tag !== No && J0() && dl.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function qp(e) {
      aR = e;
    }
    var Fi = null, Yf = null, f1 = function(e) {
      Fi = e;
    };
    function $f(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function JS(e) {
      return $f(e);
    }
    function ZS(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = $f(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: G,
                render: a
              };
              return e.displayName !== void 0 && (i.displayName = e.displayName), i;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function RR(e, t) {
      {
        if (Fi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case K: {
            typeof i == "function" && (u = !0);
            break;
          }
          case ee: {
            (typeof i == "function" || s === lt) && (u = !0);
            break;
          }
          case Re: {
            (s === G || s === lt) && (u = !0);
            break;
          }
          case Ye:
          case W: {
            (s === st || s === lt) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var f = Fi(a);
          if (f !== void 0 && f === Fi(i))
            return !0;
        }
        return !1;
      }
    }
    function TR(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        Yf === null && (Yf = /* @__PURE__ */ new WeakSet()), Yf.add(e);
      }
    }
    var d1 = function(e, t) {
      {
        if (Fi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        $u(), Yu(function() {
          eE(e.current, i, a);
        });
      }
    }, p1 = function(e, t) {
      {
        if (e.context !== ui)
          return;
        $u(), Yu(function() {
          Kp(t, e, null, null);
        });
      }
    };
    function eE(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case ee:
          case W:
          case K:
            v = p;
            break;
          case Re:
            v = p.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, S = !1;
        if (v !== null) {
          var k = Fi(v);
          k !== void 0 && (a.has(k) ? S = !0 : t.has(k) && (f === K ? S = !0 : y = !0));
        }
        if (Yf !== null && (Yf.has(e) || i !== null && Yf.has(i)) && (S = !0), S && (e._debugNeedsRemount = !0), S || y) {
          var b = Ha(e, tt);
          b !== null && gr(b, e, tt, nn);
        }
        u !== null && !S && eE(u, t, a), s !== null && eE(s, t, a);
      }
    }
    var v1 = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return tE(e.current, i, a), a;
      }
    };
    function tE(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case ee:
          case W:
          case K:
            p = f;
            break;
          case Re:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? h1(e, a) : i !== null && tE(i, t, a), u !== null && tE(u, t, a);
      }
    }
    function h1(e, t) {
      {
        var a = m1(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ae:
              t.add(i.stateNode);
              return;
            case fe:
              t.add(i.stateNode.containerInfo);
              return;
            case Q:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function m1(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ae)
          i = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return i;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return i;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var nE;
    {
      nE = !1;
      try {
        var wR = Object.preventExtensions({});
      } catch {
        nE = !0;
      }
    }
    function y1(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = $e, this.subtreeFlags = $e, this.deletions = null, this.lanes = q, this.childLanes = q, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !nE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var oi = function(e, t, a, i) {
      return new y1(e, t, a, i);
    };
    function rE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function g1(e) {
      return typeof e == "function" && !rE(e) && e.defaultProps === void 0;
    }
    function S1(e) {
      if (typeof e == "function")
        return rE(e) ? K : ee;
      if (e != null) {
        var t = e.$$typeof;
        if (t === G)
          return Re;
        if (t === st)
          return Ye;
      }
      return Ve;
    }
    function ic(e, t) {
      var a = e.alternate;
      a === null ? (a = oi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = $e, a.subtreeFlags = $e, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & zn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case Ve:
        case ee:
        case W:
          a.type = $f(e.type);
          break;
        case K:
          a.type = JS(e.type);
          break;
        case Re:
          a.type = ZS(e.type);
          break;
      }
      return a;
    }
    function E1(e, t) {
      e.flags &= zn | yn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = q, e.lanes = t, e.child = null, e.subtreeFlags = $e, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = $e, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function C1(e, t, a) {
      var i;
      return e === Ph ? (i = Tt, t === !0 && (i |= Zt, i |= Pt)) : i = Qe, Jr && (i |= Ht), oi(Q, null, null, i);
    }
    function aE(e, t, a, i, u, s) {
      var f = Ve, p = e;
      if (typeof e == "function")
        rE(e) ? (f = K, p = JS(p)) : p = $f(p);
      else if (typeof e == "string")
        f = ae;
      else
        e: switch (e) {
          case di:
            return Yo(a.children, u, s, t);
          case Wa:
            f = Ce, u |= Zt, (u & Tt) !== Qe && (u |= Pt);
            break;
          case pi:
            return R1(a, u, s, t);
          case ge:
            return T1(a, u, s, t);
          case Ne:
            return w1(a, u, s, t);
          case wn:
            return xR(a, u, s, t);
          case ln:
          case wt:
          case cn:
          case ir:
          case Rt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case vi:
                  f = pe;
                  break e;
                case R:
                  f = Ie;
                  break e;
                case G:
                  f = Re, p = ZS(p);
                  break e;
                case st:
                  f = Ye;
                  break e;
                case lt:
                  f = ke, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? it(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var S = oi(f, a, t, u);
      return S.elementType = e, S.type = p, S.lanes = s, S._debugOwner = i, S;
    }
    function iE(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = aE(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Yo(e, t, a, i) {
      var u = oi(te, e, i, t);
      return u.lanes = a, u;
    }
    function R1(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = oi(Fe, e, i, t | Ht);
      return u.elementType = pi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function T1(e, t, a, i) {
      var u = oi(Te, e, i, t);
      return u.elementType = ge, u.lanes = a, u;
    }
    function w1(e, t, a, i) {
      var u = oi(ft, e, i, t);
      return u.elementType = Ne, u.lanes = a, u;
    }
    function xR(e, t, a, i) {
      var u = oi(Le, e, i, t);
      u.elementType = wn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function lE(e, t, a) {
      var i = oi(de, e, null, t);
      return i.lanes = a, i;
    }
    function x1() {
      var e = oi(ae, null, null, Qe);
      return e.elementType = "DELETED", e;
    }
    function b1(e) {
      var t = oi(We, null, null, Qe);
      return t.stateNode = e, t;
    }
    function uE(e, t, a) {
      var i = e.children !== null ? e.children : [], u = oi(fe, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function bR(e, t) {
      return e === null && (e = oi(Ve, null, null, Qe)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function _1(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = By, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = jt, this.eventTimes = xs(q), this.expirationTimes = xs(nn), this.pendingLanes = q, this.suspendedLanes = q, this.pingedLanes = q, this.expiredLanes = q, this.mutableReadLanes = q, this.finishedLanes = q, this.entangledLanes = q, this.entanglements = xs(q), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Cu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Ph:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case No:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function _R(e, t, a, i, u, s, f, p, v, y) {
      var S = new _1(e, t, a, p, v), k = C1(t, s);
      S.current = k, k.stateNode = S;
      {
        var b = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        k.memoizedState = b;
      }
      return Eg(k), S;
    }
    var oE = "18.3.1";
    function k1(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return $r(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: ar,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var sE, cE;
    sE = !1, cE = {};
    function kR(e) {
      if (!e)
        return ui;
      var t = po(e), a = cx(t);
      if (t.tag === K) {
        var i = t.type;
        if (Yl(i))
          return tC(t, i, a);
      }
      return a;
    }
    function D1(e, t) {
      {
        var a = po(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Kr(a);
        if (u === null)
          return null;
        if (u.mode & Zt) {
          var s = it(a) || "Component";
          if (!cE[s]) {
            cE[s] = !0;
            var f = lr;
            try {
              Kt(u), a.mode & Zt ? g("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : g("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? Kt(f) : fn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function DR(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return _R(e, t, v, y, a, i, u, s, f);
    }
    function OR(e, t, a, i, u, s, f, p, v, y) {
      var S = !0, k = _R(a, i, S, e, u, s, f, p, v);
      k.context = kR(null);
      var b = k.current, U = Ca(), H = Bo(b), V = Pu(U, H);
      return V.callback = t ?? null, Ao(b, V, H), U_(k, H, U), k;
    }
    function Kp(e, t, a, i) {
      Sd(t, e);
      var u = t.current, s = Ca(), f = Bo(u);
      Sn(f);
      var p = kR(a);
      t.context === null ? t.context = p : t.pendingContext = p, mi && lr !== null && !sE && (sE = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, it(lr) || "Unknown"));
      var v = Pu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && g("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = Ao(u, v, f);
      return y !== null && (gr(y, u, f, s), tm(y, u, f)), f;
    }
    function Ym(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ae:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function O1(e) {
      switch (e.tag) {
        case Q: {
          var t = e.stateNode;
          if (nf(t)) {
            var a = Pv(t);
            P_(t, a);
          }
          break;
        }
        case Te: {
          Yu(function() {
            var u = Ha(e, tt);
            if (u !== null) {
              var s = Ca();
              gr(u, e, tt, s);
            }
          });
          var i = tt;
          fE(e, i);
          break;
        }
      }
    }
    function NR(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = $v(a.retryLane, t));
    }
    function fE(e, t) {
      NR(e, t);
      var a = e.alternate;
      a && NR(a, t);
    }
    function N1(e) {
      if (e.tag === Te) {
        var t = Ss, a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        fE(e, t);
      }
    }
    function L1(e) {
      if (e.tag === Te) {
        var t = Bo(e), a = Ha(e, t);
        if (a !== null) {
          var i = Ca();
          gr(a, e, t, i);
        }
        fE(e, t);
      }
    }
    function LR(e) {
      var t = pn(e);
      return t === null ? null : t.stateNode;
    }
    var MR = function(e) {
      return null;
    };
    function M1(e) {
      return MR(e);
    }
    var AR = function(e) {
      return !1;
    };
    function A1(e) {
      return AR(e);
    }
    var zR = null, UR = null, jR = null, FR = null, HR = null, PR = null, VR = null, BR = null, IR = null;
    {
      var YR = function(e, t, a) {
        var i = t[a], u = St(e) ? e.slice() : vt({}, e);
        return a + 1 === t.length ? (St(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = YR(e[i], t, a + 1), u);
      }, $R = function(e, t) {
        return YR(e, t, 0);
      }, QR = function(e, t, a, i) {
        var u = t[i], s = St(e) ? e.slice() : vt({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], St(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = QR(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, WR = function(e, t, a) {
        if (t.length !== a.length) {
          I("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              I("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return QR(e, t, a, 0);
      }, GR = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = St(e) ? e.slice() : vt({}, e);
        return s[u] = GR(e[u], t, a + 1, i), s;
      }, qR = function(e, t, a) {
        return GR(e, t, 0, a);
      }, dE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      zR = function(e, t, a, i) {
        var u = dE(e, t);
        if (u !== null) {
          var s = qR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = vt({}, e.memoizedProps);
          var f = Ha(e, tt);
          f !== null && gr(f, e, tt, nn);
        }
      }, UR = function(e, t, a) {
        var i = dE(e, t);
        if (i !== null) {
          var u = $R(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = vt({}, e.memoizedProps);
          var s = Ha(e, tt);
          s !== null && gr(s, e, tt, nn);
        }
      }, jR = function(e, t, a, i) {
        var u = dE(e, t);
        if (u !== null) {
          var s = WR(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = vt({}, e.memoizedProps);
          var f = Ha(e, tt);
          f !== null && gr(f, e, tt, nn);
        }
      }, FR = function(e, t, a) {
        e.pendingProps = qR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, tt);
        i !== null && gr(i, e, tt, nn);
      }, HR = function(e, t) {
        e.pendingProps = $R(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ha(e, tt);
        a !== null && gr(a, e, tt, nn);
      }, PR = function(e, t, a) {
        e.pendingProps = WR(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ha(e, tt);
        i !== null && gr(i, e, tt, nn);
      }, VR = function(e) {
        var t = Ha(e, tt);
        t !== null && gr(t, e, tt, nn);
      }, BR = function(e) {
        MR = e;
      }, IR = function(e) {
        AR = e;
      };
    }
    function z1(e) {
      var t = Kr(e);
      return t === null ? null : t.stateNode;
    }
    function U1(e) {
      return null;
    }
    function j1() {
      return lr;
    }
    function F1(e) {
      var t = e.findFiberByHostInstance, a = x.ReactCurrentDispatcher;
      return mo({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: zR,
        overrideHookStateDeletePath: UR,
        overrideHookStateRenamePath: jR,
        overrideProps: FR,
        overridePropsDeletePath: HR,
        overridePropsRenamePath: PR,
        setErrorHandler: BR,
        setSuspenseHandler: IR,
        scheduleUpdate: VR,
        currentDispatcherRef: a,
        findHostInstanceByFiber: z1,
        findFiberByHostInstance: t || U1,
        // React Refresh
        findHostInstancesForRefresh: v1,
        scheduleRefresh: d1,
        scheduleRoot: p1,
        setRefreshHandler: f1,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: j1,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: oE
      });
    }
    var KR = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function pE(e) {
      this._internalRoot = e;
    }
    $m.prototype.render = pE.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? g("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Qm(arguments[1]) ? g("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && g("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Mn) {
          var i = LR(t.current);
          i && i.parentNode !== a && g("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Kp(e, t, null, null);
    }, $m.prototype.unmount = pE.prototype.unmount = function() {
      typeof arguments[0] == "function" && g("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        oR() && g("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Yu(function() {
          Kp(null, e, null, null);
        }), KE(t);
      }
    };
    function H1(e, t) {
      if (!Qm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      XR(e);
      var a = !1, i = !1, u = "", s = KR;
      t != null && (t.hydrate ? I("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === kr && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = DR(e, Ph, null, a, i, u, s);
      Mh(f.current, e);
      var p = e.nodeType === Mn ? e.parentNode : e;
      return np(p), new pE(f);
    }
    function $m(e) {
      this._internalRoot = e;
    }
    function P1(e) {
      e && th(e);
    }
    $m.prototype.unstable_scheduleHydration = P1;
    function V1(e, t, a) {
      if (!Qm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      XR(e), t === void 0 && g("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = KR;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = OR(t, null, e, Ph, i, s, f, p, v);
      if (Mh(y.current, e), np(e), u)
        for (var S = 0; S < u.length; S++) {
          var k = u[S];
          $x(y, k);
        }
      return new $m(y);
    }
    function Qm(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === ad));
    }
    function Xp(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === ad || e.nodeType === Mn && e.nodeValue === " react-mount-point-unstable "));
    }
    function XR(e) {
      e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), pp(e) && (e._reactRootContainer ? g("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : g("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var B1 = x.ReactCurrentOwner, JR;
    JR = function(e) {
      if (e._reactRootContainer && e.nodeType !== Mn) {
        var t = LR(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = vE(e), u = !!(i && Do(i));
      u && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function vE(e) {
      return e ? e.nodeType === $i ? e.documentElement : e.firstChild : null;
    }
    function ZR() {
    }
    function I1(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var b = Ym(f);
            s.call(b);
          };
        }
        var f = OR(
          t,
          i,
          e,
          No,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          ZR
        );
        e._reactRootContainer = f, Mh(f.current, e);
        var p = e.nodeType === Mn ? e.parentNode : e;
        return np(p), Yu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var b = Ym(S);
            y.call(b);
          };
        }
        var S = DR(
          e,
          No,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          ZR
        );
        e._reactRootContainer = S, Mh(S.current, e);
        var k = e.nodeType === Mn ? e.parentNode : e;
        return np(k), Yu(function() {
          Kp(t, S, a, i);
        }), S;
      }
    }
    function Y1(e, t) {
      e !== null && typeof e != "function" && g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Wm(e, t, a, i, u) {
      JR(a), Y1(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = I1(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = Ym(f);
            p.call(v);
          };
        }
        Kp(t, f, e, u);
      }
      return Ym(f);
    }
    var eT = !1;
    function $1(e) {
      {
        eT || (eT = !0, g("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = B1.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", At(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Wr ? e : D1(e, "findDOMNode");
    }
    function Q1(e, t, a) {
      if (g("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = pp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Wm(null, e, t, !0, a);
    }
    function W1(e, t, a) {
      if (g("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = pp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Wm(null, e, t, !1, a);
    }
    function G1(e, t, a, i) {
      if (g("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Xp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !fy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Wm(e, t, a, !1, i);
    }
    var tT = !1;
    function q1(e) {
      if (tT || (tT = !0, g("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Xp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = pp(e) && e._reactRootContainer === void 0;
        t && g("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = vE(e), i = a && !Do(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Yu(function() {
          Wm(null, null, e, !1, function() {
            e._reactRootContainer = null, KE(e);
          });
        }), !0;
      } else {
        {
          var u = vE(e), s = !!(u && Do(u)), f = e.nodeType === Wr && Xp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    wr(O1), Eo(N1), Xv(L1), Os(Ua), Hd(Gv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Sc(XT), cy($S, V_, Yu);
    function K1(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Qm(t))
        throw new Error("Target container is not a DOM element.");
      return k1(e, t, null, a);
    }
    function X1(e, t, a, i) {
      return G1(e, t, a, i);
    }
    var hE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Do, Rf, Ah, oo, Ec, $S]
    };
    function J1(e, t) {
      return hE.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), H1(e, t);
    }
    function Z1(e, t, a) {
      return hE.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), V1(e, t, a);
    }
    function ek(e) {
      return oR() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Yu(e);
    }
    var tk = F1({
      findFiberByHostInstance: Ys,
      bundleType: 1,
      version: oE,
      rendererPackageName: "react-dom"
    });
    if (!tk && Nn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var nT = window.location.protocol;
      /^(https?|file):$/.test(nT) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (nT === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ya.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = hE, Ya.createPortal = K1, Ya.createRoot = J1, Ya.findDOMNode = $1, Ya.flushSync = ek, Ya.hydrate = Q1, Ya.hydrateRoot = Z1, Ya.render = W1, Ya.unmountComponentAtNode = q1, Ya.unstable_batchedUpdates = $S, Ya.unstable_renderSubtreeIntoContainer = X1, Ya.version = oE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Ya;
}
function hT() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(hT);
    } catch (N) {
      console.error(N);
    }
  }
}
process.env.NODE_ENV === "production" ? (hT(), CE.exports = ck()) : CE.exports = fk();
var lc = CE.exports, RE, qm = lc;
if (process.env.NODE_ENV === "production")
  RE = qm.createRoot, qm.hydrateRoot;
else {
  var dT = qm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  RE = function(N, w) {
    dT.usingClientEntryPoint = !0;
    try {
      return qm.createRoot(N, w);
    } finally {
      dT.usingClientEntryPoint = !1;
    }
  };
}
const Km = {
  key: "sr3",
  label: "Shadowrun 3rd Edition",
  isPrimary: !0,
  mockDataLoaded: !0
}, dk = {
  activeEdition: Km,
  setEdition: () => {
  },
  supportedEditions: [Km],
  characterCreationData: void 0,
  reloadEditionData: async () => {
  },
  loadCampaignCharacterCreation: async () => {
  },
  clearCampaignCharacterCreation: () => {
  },
  isLoading: !1,
  error: void 0,
  campaignId: void 0,
  campaignCharacterCreation: void 0,
  campaignGameplayRules: void 0,
  campaignLoading: !1,
  campaignError: void 0
}, mT = _e.createContext(dk);
function pk({ children: N }) {
  const [w, x] = _e.useState(Km), [oe, ie] = _e.useState({}), [I, g] = _e.useState(null), he = _e.useMemo(
    () => [
      Km,
      {
        key: "sr5",
        label: "Shadowrun 5th Edition",
        isPrimary: !1,
        mockDataLoaded: !0
      }
    ],
    []
  ), ee = _e.useCallback(
    async (te) => {
      const Ce = te ?? w.key;
      if (ie((Ie) => {
        var pe;
        return {
          ...Ie,
          [Ce]: {
            data: (pe = Ie[Ce]) == null ? void 0 : pe.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        ie((Ie) => {
          var pe;
          return {
            ...Ie,
            [Ce]: {
              data: (pe = Ie[Ce]) == null ? void 0 : pe.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const Ie = await fetch(`/api/editions/${Ce}/character-creation`);
        if (!Ie.ok)
          throw new Error(`Failed to load edition data (${Ie.status})`);
        const pe = await Ie.json(), Re = (pe == null ? void 0 : pe.character_creation) ?? pe;
        ie((Fe) => ({
          ...Fe,
          [Ce]: {
            data: Re,
            loading: !1,
            error: void 0
          }
        }));
      } catch (Ie) {
        const pe = Ie instanceof Error ? Ie.message : "Unknown error loading edition data";
        ie((Re) => {
          var Fe;
          return {
            ...Re,
            [Ce]: {
              data: (Fe = Re[Ce]) == null ? void 0 : Fe.data,
              loading: !1,
              error: pe
            }
          };
        });
      }
    },
    [w.key]
  ), K = _e.useCallback((te) => `${new Intl.NumberFormat("en-US").format(te)}¥`, []), Ve = _e.useCallback((te) => JSON.parse(JSON.stringify(te)), []), Q = _e.useCallback(
    (te, Ce) => {
      var pe;
      if (!Ce)
        return Ve(te);
      const Ie = Ve(te);
      if (Ce.resources && ((pe = Ie.priorities) != null && pe.resources)) {
        const Re = Ie.priorities.resources;
        Object.entries(Ce.resources).forEach(([Fe, Te]) => {
          const Ye = Fe;
          typeof Te == "number" && Re[Ye] && (Re[Ye] = {
            ...Re[Ye],
            label: K(Te)
          });
        });
      }
      return Ie;
    },
    [Ve, K]
  ), fe = _e.useCallback(
    async (te) => {
      var Ce, Ie;
      if (te) {
        g((pe) => (pe == null ? void 0 : pe.campaignId) === te ? { ...pe, loading: !0, error: void 0 } : {
          campaignId: te,
          edition: w.key,
          data: pe == null ? void 0 : pe.data,
          gameplayRules: pe == null ? void 0 : pe.gameplayRules,
          loading: !0,
          error: void 0
        });
        try {
          const pe = await fetch(`/api/campaigns/${te}/character-creation`);
          if (!pe.ok)
            throw new Error(`Failed to load campaign character creation (${pe.status})`);
          const Re = await pe.json(), Fe = ((Ie = (Ce = Re.edition) == null ? void 0 : Ce.toLowerCase) == null ? void 0 : Ie.call(Ce)) ?? w.key, Te = Re.edition_data;
          Te && ie((Ye) => {
            var W;
            return {
              ...Ye,
              [Fe]: {
                data: ((W = Ye[Fe]) == null ? void 0 : W.data) ?? Te,
                loading: !1,
                error: void 0
              }
            };
          }), g({
            campaignId: te,
            edition: Fe,
            data: Te ? Q(Te, Re.gameplay_rules) : void 0,
            gameplayRules: Re.gameplay_rules,
            loading: !1,
            error: void 0
          });
        } catch (pe) {
          const Re = pe instanceof Error ? pe.message : "Unknown error loading campaign character creation data";
          throw g({
            campaignId: te,
            edition: w.key,
            data: void 0,
            gameplayRules: void 0,
            loading: !1,
            error: Re
          }), pe;
        }
      }
    },
    [w.key, Q]
  ), ae = _e.useCallback(() => {
    g(null);
  }, []), de = _e.useMemo(() => {
    const te = oe[w.key], Ce = I && !I.loading && !I.error && I.edition === w.key, Ie = Ce && I.data ? I.data : te == null ? void 0 : te.data;
    return {
      activeEdition: w,
      supportedEditions: he,
      setEdition: (pe) => {
        const Re = he.find((Fe) => Fe.key === pe);
        Re ? x(Re) : console.warn(`Edition '${pe}' is not registered; keeping current edition.`);
      },
      characterCreationData: Ie,
      reloadEditionData: ee,
      loadCampaignCharacterCreation: fe,
      clearCampaignCharacterCreation: ae,
      isLoading: (te == null ? void 0 : te.loading) ?? !1,
      error: te == null ? void 0 : te.error,
      campaignId: I == null ? void 0 : I.campaignId,
      campaignCharacterCreation: Ce ? I == null ? void 0 : I.data : void 0,
      campaignGameplayRules: Ce ? I == null ? void 0 : I.gameplayRules : void 0,
      campaignLoading: (I == null ? void 0 : I.loading) ?? !1,
      campaignError: I == null ? void 0 : I.error
    };
  }, [
    w,
    I,
    ae,
    oe,
    fe,
    ee,
    he
  ]);
  return _e.useEffect(() => {
    const te = oe[w.key];
    !(te != null && te.data) && !(te != null && te.loading) && ee(w.key);
  }, [w.key, oe, ee]), _e.useEffect(() => {
    typeof window > "u" || (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
      loadCampaignCharacterCreation: fe,
      clearCampaignCharacterCreation: ae
    }));
  }, [ae, fe]), _e.useEffect(() => {
    var pe, Re, Fe, Te, Ye, W;
    const te = oe[w.key], Ce = I && !I.loading && !I.error && I.edition === w.key, Ie = Ce && I.data ? I.data : te == null ? void 0 : te.data;
    Ie && typeof window < "u" && ((Re = (pe = window.ShadowmasterLegacyApp) == null ? void 0 : pe.setEditionData) == null || Re.call(pe, w.key, Ie)), typeof window < "u" && (Ce ? (Te = (Fe = window.ShadowmasterLegacyApp) == null ? void 0 : Fe.applyCampaignCreationDefaults) == null || Te.call(Fe, {
      campaignId: I.campaignId,
      edition: I.edition,
      gameplayRules: I.gameplayRules ?? null
    }) : (W = (Ye = window.ShadowmasterLegacyApp) == null ? void 0 : Ye.applyCampaignCreationDefaults) == null || W.call(Ye, null));
  }, [w.key, I, oe]), /* @__PURE__ */ O.jsx(mT.Provider, { value: de, children: N });
}
function vk() {
  const N = _e.useContext(mT);
  if (!N)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return N;
}
function gE(N, w) {
  return !!(N != null && N.roles.some((x) => x.toLowerCase() === w.toLowerCase()));
}
async function tv(N, w = {}) {
  const x = new Headers(w.headers || {});
  w.body && !x.has("Content-Type") && x.set("Content-Type", "application/json");
  const oe = await fetch(N, {
    ...w,
    headers: x,
    credentials: "include"
  });
  if (oe.status === 204)
    return {};
  const ie = await oe.text(), I = () => {
    try {
      return ie ? JSON.parse(ie) : {};
    } catch {
      return {};
    }
  };
  if (!oe.ok) {
    const g = I(), he = typeof g.error == "string" && g.error.trim().length > 0 ? g.error : oe.statusText;
    throw new Error(he);
  }
  return I();
}
function hk() {
  const [N, w] = _e.useState("login"), [x, oe] = _e.useState(null), [ie, I] = _e.useState(!1), [g, he] = _e.useState(null), [ee, K] = _e.useState(null), [Ve, Q] = _e.useState(""), [fe, ae] = _e.useState(""), [de, te] = _e.useState(""), [Ce, Ie] = _e.useState(""), [pe, Re] = _e.useState(""), [Fe, Te] = _e.useState(""), [Ye, W] = _e.useState(""), [ke, Ke] = _e.useState(""), [We, ft] = _e.useState(""), ht = _e.useRef(!1);
  _e.useEffect(() => {
    ht.current || (ht.current = !0, Le());
  }, []), _e.useEffect(() => {
    window.ShadowmasterAuth = {
      user: x,
      isAdministrator: gE(x, "administrator"),
      isGamemaster: gE(x, "gamemaster"),
      isPlayer: gE(x, "player")
    }, window.dispatchEvent(new CustomEvent("shadowmaster:auth", { detail: window.ShadowmasterAuth }));
  }, [x]);
  async function Le() {
    try {
      I(!0), he(null);
      const ce = await tv("/api/auth/me");
      oe(ce.user), w("login");
    } catch {
      oe(null);
    } finally {
      I(!1);
    }
  }
  async function Ut(ce) {
    ce.preventDefault(), I(!0), he(null), K(null);
    try {
      const le = await tv("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: Ve,
          password: fe
        })
      });
      oe(le.user), w("login"), ae(""), K("Welcome back!");
    } catch (le) {
      he(le instanceof Error ? le.message : "Login failed");
    } finally {
      I(!1);
    }
  }
  async function kt(ce) {
    if (ce.preventDefault(), pe !== Fe) {
      he("Passwords do not match");
      return;
    }
    I(!0), he(null), K(null);
    try {
      const le = await tv("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: de,
          username: Ce,
          password: pe
        })
      });
      oe(le.user), w("login"), K("Account created successfully."), Re(""), Te("");
    } catch (le) {
      he(le instanceof Error ? le.message : "Registration failed");
    } finally {
      I(!1);
    }
  }
  async function Mt() {
    I(!0), he(null), K(null);
    try {
      await tv("/api/auth/logout", { method: "POST" }), oe(null), w("login");
    } catch (ce) {
      he(ce instanceof Error ? ce.message : "Logout failed");
    } finally {
      I(!1);
    }
  }
  async function Ue(ce) {
    if (ce.preventDefault(), ke !== We) {
      he("New passwords do not match");
      return;
    }
    I(!0), he(null), K(null);
    try {
      await tv("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({
          current_password: Ye,
          new_password: ke
        })
      }), K("Password updated successfully."), W(""), Ke(""), ft(""), w("login");
    } catch (le) {
      he(le instanceof Error ? le.message : "Password update failed");
    } finally {
      I(!1);
    }
  }
  const se = _e.useMemo(() => x ? x.roles.join(", ") : "", [x]);
  return /* @__PURE__ */ O.jsxs("section", { className: "auth-panel", children: [
    /* @__PURE__ */ O.jsxs("header", { className: "auth-panel__header", children: [
      /* @__PURE__ */ O.jsx("h2", { children: x ? `Welcome, ${x.username}` : "Account Access" }),
      x && /* @__PURE__ */ O.jsx("div", { className: "auth-panel__roles", children: /* @__PURE__ */ O.jsx("span", { className: "auth-tag", children: se || "Player" }) })
    ] }),
    g && /* @__PURE__ */ O.jsx("div", { className: "auth-alert auth-alert--error", children: g }),
    ee && /* @__PURE__ */ O.jsx("div", { className: "auth-alert auth-alert--success", children: ee }),
    x ? /* @__PURE__ */ O.jsxs("div", { className: "auth-panel__content", children: [
      /* @__PURE__ */ O.jsxs("p", { className: "auth-panel__status", children: [
        "You are signed in as ",
        /* @__PURE__ */ O.jsx("strong", { children: x.email }),
        "."
      ] }),
      /* @__PURE__ */ O.jsxs("div", { className: "auth-panel__actions", children: [
        /* @__PURE__ */ O.jsx("button", { className: "btn btn-secondary", onClick: () => w(N === "password" ? "login" : "password"), children: N === "password" ? "Hide Password Form" : "Change Password" }),
        /* @__PURE__ */ O.jsx("button", { className: "btn btn-primary", onClick: Mt, disabled: ie, children: "Logout" })
      ] }),
      N === "password" && /* @__PURE__ */ O.jsxs("form", { className: "auth-form", onSubmit: Ue, children: [
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "current-password", children: "Current Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "current-password",
              type: "password",
              value: Ye,
              onChange: (ce) => W(ce.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "new-password", children: "New Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "new-password",
              type: "password",
              value: ke,
              onChange: (ce) => Ke(ce.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "confirm-password", children: "Confirm New Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "confirm-password",
              type: "password",
              value: We,
              onChange: (ce) => ft(ce.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsx("button", { className: "btn btn-primary", type: "submit", disabled: ie, children: "Update Password" })
      ] })
    ] }) : /* @__PURE__ */ O.jsxs("div", { className: "auth-panel__content", children: [
      N === "login" && /* @__PURE__ */ O.jsxs("form", { className: "auth-form", onSubmit: Ut, children: [
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "login-email", children: "Email" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "login-email",
              type: "email",
              value: Ve,
              onChange: (ce) => Q(ce.target.value),
              required: !0,
              autoComplete: "email"
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "login-password", children: "Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "login-password",
              type: "password",
              value: fe,
              onChange: (ce) => ae(ce.target.value),
              required: !0,
              autoComplete: "current-password"
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "auth-form__footer", children: [
          /* @__PURE__ */ O.jsx("button", { className: "btn btn-primary", type: "submit", disabled: ie, children: "Sign In" }),
          /* @__PURE__ */ O.jsx("button", { className: "btn btn-link", type: "button", onClick: () => w("register"), children: "Need an account?" })
        ] })
      ] }),
      N === "register" && /* @__PURE__ */ O.jsxs("form", { className: "auth-form", onSubmit: kt, children: [
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "register-email", children: "Email" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "register-email",
              type: "email",
              value: de,
              onChange: (ce) => te(ce.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "register-username", children: "Username" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "register-username",
              value: Ce,
              onChange: (ce) => Ie(ce.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "register-password", children: "Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "register-password",
              type: "password",
              value: pe,
              onChange: (ce) => Re(ce.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ O.jsx("label", { htmlFor: "register-confirm", children: "Confirm Password" }),
          /* @__PURE__ */ O.jsx(
            "input",
            {
              id: "register-confirm",
              type: "password",
              value: Fe,
              onChange: (ce) => Te(ce.target.value),
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ O.jsxs("div", { className: "auth-form__footer", children: [
          /* @__PURE__ */ O.jsx("button", { className: "btn btn-primary", type: "submit", disabled: ie, children: "Create Account" }),
          /* @__PURE__ */ O.jsx("button", { className: "btn btn-link", type: "button", onClick: () => w("login"), children: "Sign in instead" })
        ] })
      ] })
    ] })
  ] });
}
function mk() {
  var w, x;
  if (typeof window.showCreateCharacterModal == "function") {
    window.showCreateCharacterModal();
    return;
  }
  (x = (w = window.ShadowmasterLegacyApp) == null ? void 0 : w.showWizardStep) == null || x.call(w, 1);
  const N = document.getElementById("character-modal");
  N && (N.style.display = "block");
}
function yk() {
  const [N, w] = _e.useState(null);
  return _e.useEffect(() => {
    w(document.getElementById("characters-actions"));
  }, []), N ? lc.createPortal(
    /* @__PURE__ */ O.jsxs("div", { className: "characters-callout", children: [
      /* @__PURE__ */ O.jsxs("div", { className: "characters-callout__copy", children: [
        /* @__PURE__ */ O.jsx("h2", { children: "Characters" }),
        /* @__PURE__ */ O.jsx("p", { children: "Build new runners, review existing sheets, and keep your roster ready for the next mission." })
      ] }),
      /* @__PURE__ */ O.jsx("div", { className: "characters-callout__actions", children: /* @__PURE__ */ O.jsx(
        "button",
        {
          id: "create-character-btn",
          type: "button",
          className: "btn btn-primary",
          onClick: mk,
          children: "Create Character"
        }
      ) })
    ] }),
    N
  ) : null;
}
const Xm = [
  {
    key: "characters",
    label: "Characters",
    description: "Review your roster, build new runners, and edit existing sheets.",
    targetId: "characters-view"
  },
  {
    key: "campaigns",
    label: "Campaigns",
    description: "Manage campaign notes, participant lists, and session planning.",
    targetId: "campaigns-view"
  },
  {
    key: "sessions",
    label: "Sessions",
    description: "Track upcoming runs, agendas, and after-action reports.",
    targetId: "sessions-view"
  }
];
function gk() {
  const N = window.location.hash.replace("#", "").toLowerCase(), w = Xm.find((x) => x.key === N);
  return (w == null ? void 0 : w.key) ?? "characters";
}
function Sk(N) {
  _e.useEffect(() => {
    Xm.forEach(({ key: w, targetId: x }) => {
      const oe = document.getElementById(x);
      oe && (w === N ? (oe.removeAttribute("hidden"), oe.classList.add("main-tab-panel--active"), oe.style.display = "", oe.setAttribute("data-active-tab", w)) : (oe.setAttribute("hidden", "true"), oe.classList.remove("main-tab-panel--active"), oe.style.display = "none", oe.removeAttribute("data-active-tab")));
    });
  }, [N]);
}
function Ek() {
  const [N, w] = _e.useState(null), [x, oe] = _e.useState(() => gk());
  _e.useEffect(() => {
    w(document.getElementById("main-navigation-root"));
  }, []), Sk(x), _e.useEffect(() => {
    window.history.replaceState(null, "", `#${x}`);
  }, [x]);
  const ie = _e.useMemo(
    () => {
      var I;
      return ((I = Xm.find((g) => g.key === x)) == null ? void 0 : I.description) ?? "";
    },
    [x]
  );
  return N ? lc.createPortal(
    /* @__PURE__ */ O.jsxs("nav", { className: "main-tabs", role: "tablist", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ O.jsx("div", { className: "main-tabs__list", children: Xm.map((I) => {
        const g = I.key === x;
        return /* @__PURE__ */ O.jsx(
          "button",
          {
            role: "tab",
            id: `tab-${I.key}`,
            "aria-selected": g,
            "aria-controls": I.targetId,
            className: `main-tabs__tab${g ? " main-tabs__tab--active" : ""}`,
            onClick: () => oe(I.key),
            type: "button",
            children: I.label
          },
          I.key
        );
      }) }),
      /* @__PURE__ */ O.jsx("p", { className: "main-tabs__summary", role: "status", children: ie })
    ] }),
    N
  ) : null;
}
function Zm() {
  return vk();
}
const Wf = [
  "magic",
  "metatype",
  "attributes",
  "skills",
  "resources"
], Jm = ["A", "B", "C", "D", "E"], Ck = {
  magic: "Magic",
  metatype: "Metatype",
  attributes: "Attributes",
  skills: "Skills",
  resources: "Resources"
};
function Rk(N) {
  return Ck[N];
}
function Tk(N, w) {
  var oe;
  const x = (oe = N == null ? void 0 : N.priorities) == null ? void 0 : oe[w];
  return x ? Jm.map((ie) => {
    const I = x[ie] ?? { label: `Priority ${ie}` };
    return { code: ie, option: I };
  }) : Jm.map((ie) => ({
    code: ie,
    option: { label: `Priority ${ie}` }
  }));
}
function wk() {
  return {
    magic: "",
    metatype: "",
    attributes: "",
    skills: "",
    resources: ""
  };
}
function yT(N) {
  return Wf.reduce((w, x) => {
    const oe = N[x];
    return oe && w.push(oe), w;
  }, []);
}
function pT(N) {
  const w = new Set(yT(N));
  return Jm.filter((x) => !w.has(x));
}
function xk(N) {
  return yT(N).length === Jm.length;
}
function bk(N) {
  return N ? N.summary || N.description || N.label || "" : "Drag a priority letter from the pool into this category.";
}
function _k(N) {
  return Object.fromEntries(
    Object.entries(N).map(([w, x]) => [w, x || null])
  );
}
function kk() {
  var oe, ie;
  const N = wk();
  if (typeof window > "u")
    return N;
  const w = (ie = (oe = window.ShadowmasterLegacyApp) == null ? void 0 : oe.getPriorities) == null ? void 0 : ie.call(oe);
  if (!w)
    return N;
  const x = { ...N };
  for (const I of Wf) {
    const g = w[I];
    typeof g == "string" && g.length === 1 && (x[I] = g);
  }
  return x;
}
function Dk() {
  const {
    characterCreationData: N,
    activeEdition: w,
    isLoading: x,
    error: oe,
    campaignGameplayRules: ie,
    campaignLoading: I,
    campaignError: g
  } = Zm(), [he, ee] = _e.useState(() => kk()), [K, Ve] = _e.useState(null), Q = _e.useRef({});
  _e.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), _e.useEffect(() => {
    var ke;
    const W = (ke = window.ShadowmasterLegacyApp) == null ? void 0 : ke.setPriorities;
    W && W(_k(he));
  }, [he]);
  const fe = _e.useMemo(() => pT(he), [he]), ae = xk(he);
  function de(W) {
    ee((ke) => {
      const Ke = { ...ke };
      for (const We of Wf)
        Ke[We] === W && (Ke[We] = "");
      return Ke;
    });
  }
  function te(W, ke) {
    ke.dataTransfer.effectAllowed = "move", Ve({ source: "pool", priority: W }), ke.dataTransfer.setData("text/plain", W);
  }
  function Ce(W, ke, Ke) {
    Ke.dataTransfer.effectAllowed = "move", Ve({ source: "dropzone", category: W, priority: ke }), Ke.dataTransfer.setData("text/plain", ke);
  }
  function Ie() {
    Ve(null);
  }
  function pe(W, ke) {
    ke.preventDefault();
    const Ke = ke.dataTransfer.getData("text/plain") || (K == null ? void 0 : K.priority) || "";
    if (!Ke) {
      Ie();
      return;
    }
    ee((We) => {
      const ft = { ...We };
      for (const ht of Wf)
        ft[ht] === Ke && (ft[ht] = "");
      return ft[W] = Ke, ft;
    }), Ie();
  }
  function Re(W, ke) {
    ke.preventDefault();
    const Ke = Q.current[W];
    Ke && Ke.classList.add("active");
  }
  function Fe(W) {
    const ke = Q.current[W];
    ke && ke.classList.remove("active");
  }
  function Te(W) {
    const ke = Q.current[W];
    ke && ke.classList.remove("active");
  }
  function Ye(W) {
    const ke = fe[0];
    if (!ke) {
      de(W);
      return;
    }
    ee((Ke) => {
      const We = { ...Ke };
      for (const ft of Wf)
        We[ft] === W && (We[ft] = "");
      return We[ke] = W, We;
    });
  }
  return /* @__PURE__ */ O.jsxs("div", { className: "react-priority-wrapper", children: [
    /* @__PURE__ */ O.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ O.jsxs("span", { children: [
        "Priority Assignment — ",
        /* @__PURE__ */ O.jsx("strong", { children: w.label })
      ] }),
      /* @__PURE__ */ O.jsx("span", { children: g ? `Campaign defaults unavailable: ${g}` : I ? "Applying campaign defaults…" : x ? "Loading priority data…" : oe ? `Error: ${oe}` : "Drag letters into categories" })
    ] }),
    ie && /* @__PURE__ */ O.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ O.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        ie.label
      ] }),
      ie.description && /* @__PURE__ */ O.jsx("p", { children: ie.description })
    ] }),
    /* @__PURE__ */ O.jsxs("div", { className: "react-priority-layout", children: [
      /* @__PURE__ */ O.jsxs("aside", { className: "react-priority-pool", children: [
        /* @__PURE__ */ O.jsx("h4", { children: "Available Priorities" }),
        /* @__PURE__ */ O.jsx(
          "div",
          {
            className: "react-priority-dropzone",
            onDragOver: (W) => {
              W.preventDefault(), Ve((ke) => ke && { ...ke, category: void 0 });
            },
            onDrop: (W) => {
              W.preventDefault();
              const ke = W.dataTransfer.getData("text/plain") || (K == null ? void 0 : K.priority) || "";
              ke && de(ke), Ie();
            },
            children: /* @__PURE__ */ O.jsx("div", { className: "react-priority-chips", children: ["A", "B", "C", "D", "E"].map((W) => {
              const ke = pT(he).includes(W) === !1, Ke = (K == null ? void 0 : K.priority) === W && K.source === "pool";
              return /* @__PURE__ */ O.jsx(
                "div",
                {
                  className: `react-priority-chip ${ke ? "used" : ""} ${Ke ? "dragging" : ""}`,
                  draggable: !ke,
                  onDragStart: (We) => !ke && te(W, We),
                  onDragEnd: Ie,
                  onClick: () => Ye(W),
                  role: "button",
                  tabIndex: ke ? -1 : 0,
                  onKeyDown: (We) => {
                    !ke && (We.key === "Enter" || We.key === " ") && (We.preventDefault(), Ye(W));
                  },
                  children: W
                },
                W
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ O.jsx("section", { className: "react-priority-dropzones", children: Wf.map((W) => {
        const ke = Rk(W), Ke = Tk(N, W), We = he[W], ft = Ke.find((Le) => Le.code === We), ht = (K == null ? void 0 : K.source) === "dropzone" && K.category === W;
        return /* @__PURE__ */ O.jsxs(
          "div",
          {
            ref: (Le) => {
              Q.current[W] = Le;
            },
            className: `react-priority-dropzone ${We ? "filled" : ""}`,
            onDragOver: (Le) => Re(W, Le),
            onDragLeave: () => Fe(W),
            onDrop: (Le) => {
              pe(W, Le), Te(W);
            },
            children: [
              /* @__PURE__ */ O.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ O.jsx("span", { children: ke }),
                We && /* @__PURE__ */ O.jsxs("span", { children: [
                  We,
                  " — ",
                  (ft == null ? void 0 : ft.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ O.jsx("div", { className: "react-priority-description", children: bk(ft == null ? void 0 : ft.option) }),
              We ? /* @__PURE__ */ O.jsx(
                "div",
                {
                  className: `react-priority-chip ${ht ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (Le) => Ce(W, We, Le),
                  onDragEnd: Ie,
                  onDoubleClick: () => de(We),
                  children: We
                }
              ) : /* @__PURE__ */ O.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          W
        );
      }) })
    ] }),
    /* @__PURE__ */ O.jsx(
      "div",
      {
        className: `react-priority-status ${ae ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: ae ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${fe.join(", ")}`
      }
    )
  ] });
}
const Ok = {
  body: "Body",
  quickness: "Quickness",
  strength: "Strength",
  charisma: "Charisma",
  intelligence: "Intelligence",
  willpower: "Willpower"
};
function Nk(N, w) {
  if (!N)
    return [];
  const x = w || "E";
  return N.metatypes.map((oe) => {
    var ie;
    return {
      ...oe,
      priorityAllowed: ((ie = oe.priority_tiers) == null ? void 0 : ie.includes(x)) ?? !1
    };
  }).filter((oe) => oe.priorityAllowed);
}
function Lk(N) {
  return N === 0 ? "+0" : N > 0 ? `+${N}` : `${N}`;
}
function Mk(N) {
  const w = N.toLowerCase();
  return Ok[w] ?? N;
}
function Ak({ priority: N, selectedMetatype: w, onSelect: x }) {
  const { characterCreationData: oe, isLoading: ie, error: I, activeEdition: g } = Zm();
  _e.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const he = _e.useMemo(() => Nk(oe, N), [
    oe,
    N
  ]), ee = !!w, K = () => {
    var Q, fe;
    (fe = (Q = window.ShadowmasterLegacyApp) == null ? void 0 : Q.showWizardStep) == null || fe.call(Q, 1);
  }, Ve = () => {
    var Q, fe;
    w && ((fe = (Q = window.ShadowmasterLegacyApp) == null ? void 0 : Q.showWizardStep) == null || fe.call(Q, 3));
  };
  return ie ? /* @__PURE__ */ O.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : I ? /* @__PURE__ */ O.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    I
  ] }) : he.length ? /* @__PURE__ */ O.jsxs(O.Fragment, { children: [
    /* @__PURE__ */ O.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ O.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ O.jsxs("span", { children: [
        "Priority: ",
        N || "—"
      ] })
    ] }),
    /* @__PURE__ */ O.jsx("div", { className: "react-metatype-grid", children: he.map((Q) => /* @__PURE__ */ O.jsxs(
      "article",
      {
        className: `react-metatype-card ${w === Q.id ? "selected" : ""}`,
        onClick: () => x(Q.id),
        children: [
          /* @__PURE__ */ O.jsx("h4", { children: Q.name }),
          /* @__PURE__ */ O.jsxs("section", { className: "react-metatype-modifiers", children: [
            /* @__PURE__ */ O.jsx("strong", { children: "Attribute Modifiers" }),
            (() => {
              const fe = Q.attribute_modifiers ? Object.entries(Q.attribute_modifiers).filter(([, ae]) => ae !== 0) : [];
              return fe.length === 0 ? /* @__PURE__ */ O.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : fe.map(([ae, de]) => /* @__PURE__ */ O.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ O.jsx("span", { children: Mk(ae) }),
                /* @__PURE__ */ O.jsx("span", { className: de > 0 ? "positive" : "negative", children: Lk(de) })
              ] }, ae));
            })()
          ] }),
          g.key === "sr5" && Q.special_attribute_points && Object.keys(Q.special_attribute_points).length > 0 && /* @__PURE__ */ O.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ O.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(Q.special_attribute_points).map(([fe, ae]) => /* @__PURE__ */ O.jsx("div", { className: "ability", children: /* @__PURE__ */ O.jsxs("span", { children: [
              "Priority ",
              fe,
              ": ",
              ae
            ] }) }, fe))
          ] }),
          Q.abilities && Q.abilities.length > 0 && /* @__PURE__ */ O.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ O.jsx("strong", { children: "Special Abilities" }),
            Q.abilities.map((fe, ae) => /* @__PURE__ */ O.jsx("div", { className: "ability", children: /* @__PURE__ */ O.jsx("span", { children: fe }) }, ae))
          ] }),
          (!Q.abilities || Q.abilities.length === 0) && /* @__PURE__ */ O.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ O.jsx("strong", { children: "Special Abilities" }),
            /* @__PURE__ */ O.jsx("div", { className: "ability", children: /* @__PURE__ */ O.jsx("span", { children: "No inherent metatype abilities." }) })
          ] })
        ]
      },
      Q.id
    )) }),
    /* @__PURE__ */ O.jsxs("div", { className: "react-metatype-footer", children: [
      /* @__PURE__ */ O.jsx("button", { type: "button", className: "btn btn-secondary", onClick: K, children: "Back" }),
      /* @__PURE__ */ O.jsx("div", { className: `react-metatype-status ${ee ? "ready" : ""}`, children: ee ? "Metatype selected. Continue to magic." : "Select a metatype to continue." }),
      /* @__PURE__ */ O.jsx("button", { type: "button", className: "btn btn-primary", disabled: !ee, onClick: Ve, children: "Next: Choose Magical Abilities" })
    ] })
  ] }) : /* @__PURE__ */ O.jsx("p", { className: "react-metatype-status", children: "No metatypes available for this priority." });
}
const zk = ["Hermetic", "Shamanic"], Uk = [
  {
    id: "Bear",
    name: "Bear",
    description: "The Bear totem represents strength, healing, and the protective nature of the forest. Bear shamans draw power from the wilderness and have a deep connection to natural healing.",
    notes: [
      "+2 dice for Health spells",
      "+2 dice for Forest spirits",
      "Risk of berserk rage when wounded in combat"
    ]
  }
];
function jk(N) {
  return (N || "").toUpperCase();
}
function Fk({ priority: N, selection: w, onChange: x }) {
  var ae;
  const { characterCreationData: oe, activeEdition: ie } = Zm(), I = jk(N), g = ((ae = oe == null ? void 0 : oe.priorities) == null ? void 0 : ae.magic) ?? null, he = _e.useMemo(() => g && g[I] || null, [g, I]);
  _e.useEffect(() => (document.body.classList.add("react-magic-enabled"), () => {
    document.body.classList.remove("react-magic-enabled");
  }), []), _e.useEffect(() => {
    if (!I) {
      (w.type !== "Mundane" || w.tradition || w.totem) && x({ type: "Mundane", tradition: null, totem: null });
      return;
    }
    if (I === "A") {
      const de = w.tradition ?? "Hermetic", te = de === "Shamanic" ? w.totem : null;
      (w.type !== "Full Magician" || w.tradition !== de || w.totem !== te) && x({ type: "Full Magician", tradition: de, totem: te });
    } else if (I === "B") {
      let de = w.type;
      w.type !== "Adept" && w.type !== "Aspected Magician" && (de = "Adept");
      let te = w.tradition, Ce = w.totem;
      de === "Aspected Magician" ? (te = te ?? "Hermetic", te !== "Shamanic" && (Ce = null)) : (te = null, Ce = null), (w.type !== de || w.tradition !== te || w.totem !== Ce) && x({ type: de, tradition: te, totem: Ce });
    } else
      (w.type !== "Mundane" || w.tradition || w.totem) && x({ type: "Mundane", tradition: null, totem: null });
  }, [I]);
  const ee = (de) => {
    const te = {
      type: de.type !== void 0 ? de.type : w.type,
      tradition: de.tradition !== void 0 ? de.tradition : w.tradition,
      totem: de.totem !== void 0 ? de.totem : w.totem
    };
    te.type !== "Full Magician" && te.type !== "Aspected Magician" && (te.tradition = null, te.totem = null), te.tradition !== "Shamanic" && (te.totem = null), !(te.type === w.type && te.tradition === w.tradition && te.totem === w.totem) && x(te);
  }, K = () => !I || ["C", "D", "E", ""].includes(I) ? /* @__PURE__ */ O.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ O.jsxs(
    "article",
    {
      className: `react-magic-card ${w.type === "Mundane" ? "selected" : ""}`,
      onClick: () => ee({ type: "Mundane", tradition: null, totem: null }),
      children: [
        /* @__PURE__ */ O.jsx("h4", { children: "Mundane" }),
        /* @__PURE__ */ O.jsx("p", { children: "No magical ability. Magic Rating 0." })
      ]
    }
  ) }) : I === "A" ? /* @__PURE__ */ O.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ O.jsxs(
    "article",
    {
      className: `react-magic-card ${w.type === "Full Magician" ? "selected" : ""}`,
      onClick: () => ee({ type: "Full Magician" }),
      children: [
        /* @__PURE__ */ O.jsx("h4", { children: "Full Magician" }),
        /* @__PURE__ */ O.jsx("p", { children: "Magic Rating 6. Spell Points 25." }),
        /* @__PURE__ */ O.jsx("p", { children: "Must choose a magical tradition." })
      ]
    }
  ) }) : I === "B" ? /* @__PURE__ */ O.jsxs("div", { className: "react-magic-grid", children: [
    /* @__PURE__ */ O.jsxs(
      "article",
      {
        className: `react-magic-card ${w.type === "Adept" ? "selected" : ""}`,
        onClick: () => ee({ type: "Adept", tradition: null, totem: null }),
        children: [
          /* @__PURE__ */ O.jsx("h4", { children: "Adept" }),
          /* @__PURE__ */ O.jsx("p", { children: "Magic Rating 4. Gain Power Points for physical enhancements." })
        ]
      }
    ),
    /* @__PURE__ */ O.jsxs(
      "article",
      {
        className: `react-magic-card ${w.type === "Aspected Magician" ? "selected" : ""}`,
        onClick: () => ee({ type: "Aspected Magician" }),
        children: [
          /* @__PURE__ */ O.jsx("h4", { children: "Aspected Magician" }),
          /* @__PURE__ */ O.jsx("p", { children: "Magic Rating 4. Specializes in a single tradition aspect." }),
          /* @__PURE__ */ O.jsx("p", { children: "Must choose a magical tradition." })
        ]
      }
    )
  ] }) : null, Ve = () => !w.type || !["Full Magician", "Aspected Magician"].includes(w.type) ? null : /* @__PURE__ */ O.jsxs("div", { className: "react-magic-traditions", children: [
    /* @__PURE__ */ O.jsx("strong", { children: "Tradition" }),
    /* @__PURE__ */ O.jsx("div", { className: "tradition-options", children: zk.map((de) => /* @__PURE__ */ O.jsxs("label", { className: `tradition-option ${w.tradition === de ? "selected" : ""}`, children: [
      /* @__PURE__ */ O.jsx(
        "input",
        {
          type: "radio",
          name: "react-tradition",
          value: de,
          checked: w.tradition === de,
          onChange: () => ee({ tradition: de })
        }
      ),
      /* @__PURE__ */ O.jsx("span", { children: de })
    ] }, de)) })
  ] }), Q = () => w.tradition !== "Shamanic" ? null : /* @__PURE__ */ O.jsxs("div", { className: "react-magic-totems", children: [
    /* @__PURE__ */ O.jsx("strong", { children: "Select Totem" }),
    /* @__PURE__ */ O.jsx("div", { className: "totem-grid", children: Uk.map((de) => /* @__PURE__ */ O.jsxs(
      "article",
      {
        className: `totem-card ${w.totem === de.id ? "selected" : ""}`,
        onClick: () => ee({ totem: de.id }),
        children: [
          /* @__PURE__ */ O.jsx("h5", { children: de.name }),
          /* @__PURE__ */ O.jsx("p", { children: de.description }),
          /* @__PURE__ */ O.jsx("ul", { children: de.notes.map((te) => /* @__PURE__ */ O.jsx("li", { children: te }, te)) })
        ]
      },
      de.id
    )) })
  ] }), fe = () => {
    if (!w.type)
      return /* @__PURE__ */ O.jsx("p", { className: "react-magic-status", children: "Select a magical path to proceed." });
    if (w.type === "Full Magician" || w.type === "Aspected Magician") {
      if (!w.tradition)
        return /* @__PURE__ */ O.jsx("p", { className: "react-magic-status", children: "Choose a tradition to continue." });
      if (w.tradition === "Shamanic" && !w.totem)
        return /* @__PURE__ */ O.jsx("p", { className: "react-magic-status", children: "Select a totem for your shamanic path." });
    }
    return /* @__PURE__ */ O.jsx("p", { className: "react-magic-status ready", children: "Magical abilities ready. Continue to Attributes." });
  };
  return /* @__PURE__ */ O.jsxs("div", { className: "react-magic-wrapper", children: [
    /* @__PURE__ */ O.jsxs("div", { className: "react-magic-header", children: [
      /* @__PURE__ */ O.jsx("span", { children: "Magical Abilities" }),
      /* @__PURE__ */ O.jsxs("span", { children: [
        "Priority ",
        I || "—",
        " ",
        he != null && he.summary ? `— ${he.summary}` : ""
      ] })
    ] }),
    K(),
    Ve(),
    Q(),
    fe(),
    /* @__PURE__ */ O.jsx("footer", { className: "react-magic-footer", children: /* @__PURE__ */ O.jsxs("small", { children: [
      "Edition: ",
      ie.label
    ] }) })
  ] });
}
function Hk() {
  const [N, w] = _e.useState(null);
  return _e.useEffect(() => {
    w(document.getElementById("auth-root"));
  }, []), N ? lc.createPortal(/* @__PURE__ */ O.jsx(hk, {}), N) : null;
}
function Pk() {
  const [N, w] = _e.useState(null);
  return _e.useEffect(() => {
    w(document.getElementById("priority-assignment-react-root"));
  }, []), N ? lc.createPortal(/* @__PURE__ */ O.jsx(Dk, {}), N) : null;
}
function Vk() {
  const [N, w] = _e.useState(null), [x, oe] = _e.useState(""), [ie, I] = _e.useState(null);
  return _e.useEffect(() => {
    w(document.getElementById("metatype-selection-react-root"));
  }, []), _e.useEffect(() => {
    var ee;
    const g = window.ShadowmasterLegacyApp;
    if (!g) return;
    const he = () => {
      var K, Ve;
      oe(((K = g.getMetatypePriority) == null ? void 0 : K.call(g)) ?? ""), I(((Ve = g.getMetatypeSelection) == null ? void 0 : Ve.call(g)) ?? null);
    };
    return he(), (ee = g.subscribeMetatypeState) == null || ee.call(g, he), () => {
      var K;
      (K = g.unsubscribeMetatypeState) == null || K.call(g, he);
    };
  }, []), N ? lc.createPortal(
    /* @__PURE__ */ O.jsx(
      Ak,
      {
        priority: x,
        selectedMetatype: ie,
        onSelect: (g) => {
          var he, ee;
          I(g), (ee = (he = window.ShadowmasterLegacyApp) == null ? void 0 : he.setMetatypeSelection) == null || ee.call(he, g);
        }
      }
    ),
    N
  ) : null;
}
function Bk() {
  const [N, w] = _e.useState(null), [x, oe] = _e.useState({
    priority: "",
    type: null,
    tradition: null,
    totem: null
  });
  return _e.useEffect(() => {
    w(document.getElementById("magical-abilities-react-root"));
  }, []), _e.useEffect(() => {
    var g;
    const ie = window.ShadowmasterLegacyApp;
    if (!ie) return;
    const I = () => {
      var ee;
      const he = (ee = ie.getMagicState) == null ? void 0 : ee.call(ie);
      he && oe({
        priority: he.priority || "",
        type: he.type || null,
        tradition: he.tradition || null,
        totem: he.totem || null
      });
    };
    return I(), (g = ie.subscribeMagicState) == null || g.call(ie, I), () => {
      var he;
      (he = ie.unsubscribeMagicState) == null || he.call(ie, I);
    };
  }, []), N ? lc.createPortal(
    /* @__PURE__ */ O.jsx(
      Fk,
      {
        priority: x.priority,
        selection: { type: x.type, tradition: x.tradition, totem: x.totem },
        onChange: (ie) => {
          var I, g;
          (g = (I = window.ShadowmasterLegacyApp) == null ? void 0 : I.setMagicState) == null || g.call(I, ie);
        }
      }
    ),
    N
  ) : null;
}
function Ik() {
  const { activeEdition: N, isLoading: w, error: x, characterCreationData: oe } = Zm();
  let ie = "· data pending";
  return w ? ie = "· loading edition data…" : x ? ie = `· failed to load data: ${x}` : oe && (ie = "· edition data loaded"), /* @__PURE__ */ O.jsxs(O.Fragment, { children: [
    /* @__PURE__ */ O.jsx("div", { className: "react-banner", "data-active-edition": N.key, children: /* @__PURE__ */ O.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ O.jsx("strong", { children: N.label }),
      " ",
      ie
    ] }) }),
    /* @__PURE__ */ O.jsx(Hk, {}),
    /* @__PURE__ */ O.jsx(Ek, {}),
    /* @__PURE__ */ O.jsx(yk, {}),
    /* @__PURE__ */ O.jsx(Pk, {}),
    /* @__PURE__ */ O.jsx(Vk, {}),
    /* @__PURE__ */ O.jsx(Bk, {})
  ] });
}
const Yk = document.getElementById("shadowmaster-react-root"), $k = Yk ?? Qk();
function Qk() {
  const N = document.createElement("div");
  return N.id = "shadowmaster-react-root", N.dataset.controller = "react-shell", N.style.display = "contents", document.body.appendChild(N), N;
}
function Wk() {
  return _e.useEffect(() => {
    var N, w, x;
    (N = window.ShadowmasterLegacyApp) != null && N.initialize && !((x = (w = window.ShadowmasterLegacyApp).isInitialized) != null && x.call(w)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ O.jsx(_e.StrictMode, { children: /* @__PURE__ */ O.jsx(pk, { children: /* @__PURE__ */ O.jsx(Ik, {}) }) });
}
const Gk = RE($k);
Gk.render(/* @__PURE__ */ O.jsx(Wk, {}));

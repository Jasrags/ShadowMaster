var TE = { exports: {} }, tv = {}, RE = { exports: {} }, Pt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sw;
function ED() {
  if (sw) return Pt;
  sw = 1;
  var C = Symbol.for("react.element"), E = Symbol.for("react.portal"), b = Symbol.for("react.fragment"), q = Symbol.for("react.strict_mode"), ee = Symbol.for("react.profiler"), D = Symbol.for("react.provider"), g = Symbol.for("react.context"), ae = Symbol.for("react.forward_ref"), L = Symbol.for("react.suspense"), z = Symbol.for("react.memo"), ge = Symbol.for("react.lazy"), P = Symbol.iterator;
  function G(T) {
    return T === null || typeof T != "object" ? null : (T = P && T[P] || T["@@iterator"], typeof T == "function" ? T : null);
  }
  var te = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ne = Object.assign, X = {};
  function fe(T, M, Oe) {
    this.props = T, this.context = M, this.refs = X, this.updater = Oe || te;
  }
  fe.prototype.isReactComponent = {}, fe.prototype.setState = function(T, M) {
    if (typeof T != "object" && typeof T != "function" && T != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, T, M, "setState");
  }, fe.prototype.forceUpdate = function(T) {
    this.updater.enqueueForceUpdate(this, T, "forceUpdate");
  };
  function Le() {
  }
  Le.prototype = fe.prototype;
  function oe(T, M, Oe) {
    this.props = T, this.context = M, this.refs = X, this.updater = Oe || te;
  }
  var Ee = oe.prototype = new Le();
  Ee.constructor = oe, ne(Ee, fe.prototype), Ee.isPureReactComponent = !0;
  var Se = Array.isArray, le = Object.prototype.hasOwnProperty, se = { current: null }, U = { key: !0, ref: !0, __self: !0, __source: !0 };
  function pe(T, M, Oe) {
    var $e, St = {}, vt = null, mt = null;
    if (M != null) for ($e in M.ref !== void 0 && (mt = M.ref), M.key !== void 0 && (vt = "" + M.key), M) le.call(M, $e) && !U.hasOwnProperty($e) && (St[$e] = M[$e]);
    var Et = arguments.length - 2;
    if (Et === 1) St.children = Oe;
    else if (1 < Et) {
      for (var _t = Array(Et), Kt = 0; Kt < Et; Kt++) _t[Kt] = arguments[Kt + 2];
      St.children = _t;
    }
    if (T && T.defaultProps) for ($e in Et = T.defaultProps, Et) St[$e] === void 0 && (St[$e] = Et[$e]);
    return { $$typeof: C, type: T, key: vt, ref: mt, props: St, _owner: se.current };
  }
  function ue(T, M) {
    return { $$typeof: C, type: T.type, key: M, ref: T.ref, props: T.props, _owner: T._owner };
  }
  function be(T) {
    return typeof T == "object" && T !== null && T.$$typeof === C;
  }
  function je(T) {
    var M = { "=": "=0", ":": "=2" };
    return "$" + T.replace(/[=:]/g, function(Oe) {
      return M[Oe];
    });
  }
  var Je = /\/+/g;
  function re(T, M) {
    return typeof T == "object" && T !== null && T.key != null ? je("" + T.key) : M.toString(36);
  }
  function Fe(T, M, Oe, $e, St) {
    var vt = typeof T;
    (vt === "undefined" || vt === "boolean") && (T = null);
    var mt = !1;
    if (T === null) mt = !0;
    else switch (vt) {
      case "string":
      case "number":
        mt = !0;
        break;
      case "object":
        switch (T.$$typeof) {
          case C:
          case E:
            mt = !0;
        }
    }
    if (mt) return mt = T, St = St(mt), T = $e === "" ? "." + re(mt, 0) : $e, Se(St) ? (Oe = "", T != null && (Oe = T.replace(Je, "$&/") + "/"), Fe(St, M, Oe, "", function(Kt) {
      return Kt;
    })) : St != null && (be(St) && (St = ue(St, Oe + (!St.key || mt && mt.key === St.key ? "" : ("" + St.key).replace(Je, "$&/") + "/") + T)), M.push(St)), 1;
    if (mt = 0, $e = $e === "" ? "." : $e + ":", Se(T)) for (var Et = 0; Et < T.length; Et++) {
      vt = T[Et];
      var _t = $e + re(vt, Et);
      mt += Fe(vt, M, Oe, _t, St);
    }
    else if (_t = G(T), typeof _t == "function") for (T = _t.call(T), Et = 0; !(vt = T.next()).done; ) vt = vt.value, _t = $e + re(vt, Et++), mt += Fe(vt, M, Oe, _t, St);
    else if (vt === "object") throw M = String(T), Error("Objects are not valid as a React child (found: " + (M === "[object Object]" ? "object with keys {" + Object.keys(T).join(", ") + "}" : M) + "). If you meant to render a collection of children, use an array instead.");
    return mt;
  }
  function nt(T, M, Oe) {
    if (T == null) return T;
    var $e = [], St = 0;
    return Fe(T, $e, "", "", function(vt) {
      return M.call(Oe, vt, St++);
    }), $e;
  }
  function pt(T) {
    if (T._status === -1) {
      var M = T._result;
      M = M(), M.then(function(Oe) {
        (T._status === 0 || T._status === -1) && (T._status = 1, T._result = Oe);
      }, function(Oe) {
        (T._status === 0 || T._status === -1) && (T._status = 2, T._result = Oe);
      }), T._status === -1 && (T._status = 0, T._result = M);
    }
    if (T._status === 1) return T._result.default;
    throw T._result;
  }
  var Me = { current: null }, he = { transition: null }, Be = { ReactCurrentDispatcher: Me, ReactCurrentBatchConfig: he, ReactCurrentOwner: se };
  function Re() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Pt.Children = { map: nt, forEach: function(T, M, Oe) {
    nt(T, function() {
      M.apply(this, arguments);
    }, Oe);
  }, count: function(T) {
    var M = 0;
    return nt(T, function() {
      M++;
    }), M;
  }, toArray: function(T) {
    return nt(T, function(M) {
      return M;
    }) || [];
  }, only: function(T) {
    if (!be(T)) throw Error("React.Children.only expected to receive a single React element child.");
    return T;
  } }, Pt.Component = fe, Pt.Fragment = b, Pt.Profiler = ee, Pt.PureComponent = oe, Pt.StrictMode = q, Pt.Suspense = L, Pt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Be, Pt.act = Re, Pt.cloneElement = function(T, M, Oe) {
    if (T == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + T + ".");
    var $e = ne({}, T.props), St = T.key, vt = T.ref, mt = T._owner;
    if (M != null) {
      if (M.ref !== void 0 && (vt = M.ref, mt = se.current), M.key !== void 0 && (St = "" + M.key), T.type && T.type.defaultProps) var Et = T.type.defaultProps;
      for (_t in M) le.call(M, _t) && !U.hasOwnProperty(_t) && ($e[_t] = M[_t] === void 0 && Et !== void 0 ? Et[_t] : M[_t]);
    }
    var _t = arguments.length - 2;
    if (_t === 1) $e.children = Oe;
    else if (1 < _t) {
      Et = Array(_t);
      for (var Kt = 0; Kt < _t; Kt++) Et[Kt] = arguments[Kt + 2];
      $e.children = Et;
    }
    return { $$typeof: C, type: T.type, key: St, ref: vt, props: $e, _owner: mt };
  }, Pt.createContext = function(T) {
    return T = { $$typeof: g, _currentValue: T, _currentValue2: T, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, T.Provider = { $$typeof: D, _context: T }, T.Consumer = T;
  }, Pt.createElement = pe, Pt.createFactory = function(T) {
    var M = pe.bind(null, T);
    return M.type = T, M;
  }, Pt.createRef = function() {
    return { current: null };
  }, Pt.forwardRef = function(T) {
    return { $$typeof: ae, render: T };
  }, Pt.isValidElement = be, Pt.lazy = function(T) {
    return { $$typeof: ge, _payload: { _status: -1, _result: T }, _init: pt };
  }, Pt.memo = function(T, M) {
    return { $$typeof: z, type: T, compare: M === void 0 ? null : M };
  }, Pt.startTransition = function(T) {
    var M = he.transition;
    he.transition = {};
    try {
      T();
    } finally {
      he.transition = M;
    }
  }, Pt.unstable_act = Re, Pt.useCallback = function(T, M) {
    return Me.current.useCallback(T, M);
  }, Pt.useContext = function(T) {
    return Me.current.useContext(T);
  }, Pt.useDebugValue = function() {
  }, Pt.useDeferredValue = function(T) {
    return Me.current.useDeferredValue(T);
  }, Pt.useEffect = function(T, M) {
    return Me.current.useEffect(T, M);
  }, Pt.useId = function() {
    return Me.current.useId();
  }, Pt.useImperativeHandle = function(T, M, Oe) {
    return Me.current.useImperativeHandle(T, M, Oe);
  }, Pt.useInsertionEffect = function(T, M) {
    return Me.current.useInsertionEffect(T, M);
  }, Pt.useLayoutEffect = function(T, M) {
    return Me.current.useLayoutEffect(T, M);
  }, Pt.useMemo = function(T, M) {
    return Me.current.useMemo(T, M);
  }, Pt.useReducer = function(T, M, Oe) {
    return Me.current.useReducer(T, M, Oe);
  }, Pt.useRef = function(T) {
    return Me.current.useRef(T);
  }, Pt.useState = function(T) {
    return Me.current.useState(T);
  }, Pt.useSyncExternalStore = function(T, M, Oe) {
    return Me.current.useSyncExternalStore(T, M, Oe);
  }, Pt.useTransition = function() {
    return Me.current.useTransition();
  }, Pt.version = "18.3.1", Pt;
}
var lv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
lv.exports;
var cw;
function CD() {
  return cw || (cw = 1, function(C, E) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var b = "18.3.1", q = Symbol.for("react.element"), ee = Symbol.for("react.portal"), D = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), ae = Symbol.for("react.profiler"), L = Symbol.for("react.provider"), z = Symbol.for("react.context"), ge = Symbol.for("react.forward_ref"), P = Symbol.for("react.suspense"), G = Symbol.for("react.suspense_list"), te = Symbol.for("react.memo"), ne = Symbol.for("react.lazy"), X = Symbol.for("react.offscreen"), fe = Symbol.iterator, Le = "@@iterator";
      function oe(m) {
        if (m === null || typeof m != "object")
          return null;
        var R = fe && m[fe] || m[Le];
        return typeof R == "function" ? R : null;
      }
      var Ee = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Se = {
        transition: null
      }, le = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, se = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, U = {}, pe = null;
      function ue(m) {
        pe = m;
      }
      U.setExtraStackFrame = function(m) {
        pe = m;
      }, U.getCurrentStack = null, U.getStackAddendum = function() {
        var m = "";
        pe && (m += pe);
        var R = U.getCurrentStack;
        return R && (m += R() || ""), m;
      };
      var be = !1, je = !1, Je = !1, re = !1, Fe = !1, nt = {
        ReactCurrentDispatcher: Ee,
        ReactCurrentBatchConfig: Se,
        ReactCurrentOwner: se
      };
      nt.ReactDebugCurrentFrame = U, nt.ReactCurrentActQueue = le;
      function pt(m) {
        {
          for (var R = arguments.length, Y = new Array(R > 1 ? R - 1 : 0), K = 1; K < R; K++)
            Y[K - 1] = arguments[K];
          he("warn", m, Y);
        }
      }
      function Me(m) {
        {
          for (var R = arguments.length, Y = new Array(R > 1 ? R - 1 : 0), K = 1; K < R; K++)
            Y[K - 1] = arguments[K];
          he("error", m, Y);
        }
      }
      function he(m, R, Y) {
        {
          var K = nt.ReactDebugCurrentFrame, we = K.getStackAddendum();
          we !== "" && (R += "%s", Y = Y.concat([we]));
          var it = Y.map(function(Ne) {
            return String(Ne);
          });
          it.unshift("Warning: " + R), Function.prototype.apply.call(console[m], console, it);
        }
      }
      var Be = {};
      function Re(m, R) {
        {
          var Y = m.constructor, K = Y && (Y.displayName || Y.name) || "ReactClass", we = K + "." + R;
          if (Be[we])
            return;
          Me("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", R, K), Be[we] = !0;
        }
      }
      var T = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(m) {
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
        enqueueForceUpdate: function(m, R, Y) {
          Re(m, "forceUpdate");
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
        enqueueReplaceState: function(m, R, Y, K) {
          Re(m, "replaceState");
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
        enqueueSetState: function(m, R, Y, K) {
          Re(m, "setState");
        }
      }, M = Object.assign, Oe = {};
      Object.freeze(Oe);
      function $e(m, R, Y) {
        this.props = m, this.context = R, this.refs = Oe, this.updater = Y || T;
      }
      $e.prototype.isReactComponent = {}, $e.prototype.setState = function(m, R) {
        if (typeof m != "object" && typeof m != "function" && m != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, m, R, "setState");
      }, $e.prototype.forceUpdate = function(m) {
        this.updater.enqueueForceUpdate(this, m, "forceUpdate");
      };
      {
        var St = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, vt = function(m, R) {
          Object.defineProperty($e.prototype, m, {
            get: function() {
              pt("%s(...) is deprecated in plain JavaScript React classes. %s", R[0], R[1]);
            }
          });
        };
        for (var mt in St)
          St.hasOwnProperty(mt) && vt(mt, St[mt]);
      }
      function Et() {
      }
      Et.prototype = $e.prototype;
      function _t(m, R, Y) {
        this.props = m, this.context = R, this.refs = Oe, this.updater = Y || T;
      }
      var Kt = _t.prototype = new Et();
      Kt.constructor = _t, M(Kt, $e.prototype), Kt.isPureReactComponent = !0;
      function Cn() {
        var m = {
          current: null
        };
        return Object.seal(m), m;
      }
      var Hn = Array.isArray;
      function hn(m) {
        return Hn(m);
      }
      function Xn(m) {
        {
          var R = typeof Symbol == "function" && Symbol.toStringTag, Y = R && m[Symbol.toStringTag] || m.constructor.name || "Object";
          return Y;
        }
      }
      function Ht(m) {
        try {
          return kn(m), !1;
        } catch {
          return !0;
        }
      }
      function kn(m) {
        return "" + m;
      }
      function cr(m) {
        if (Ht(m))
          return Me("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Xn(m)), kn(m);
      }
      function Da(m, R, Y) {
        var K = m.displayName;
        if (K)
          return K;
        var we = R.displayName || R.name || "";
        return we !== "" ? Y + "(" + we + ")" : Y;
      }
      function _r(m) {
        return m.displayName || "Context";
      }
      function Dn(m) {
        if (m == null)
          return null;
        if (typeof m.tag == "number" && Me("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof m == "function")
          return m.displayName || m.name || null;
        if (typeof m == "string")
          return m;
        switch (m) {
          case D:
            return "Fragment";
          case ee:
            return "Portal";
          case ae:
            return "Profiler";
          case g:
            return "StrictMode";
          case P:
            return "Suspense";
          case G:
            return "SuspenseList";
        }
        if (typeof m == "object")
          switch (m.$$typeof) {
            case z:
              var R = m;
              return _r(R) + ".Consumer";
            case L:
              var Y = m;
              return _r(Y._context) + ".Provider";
            case ge:
              return Da(m, m.render, "ForwardRef");
            case te:
              var K = m.displayName || null;
              return K !== null ? K : Dn(m.type) || "Memo";
            case ne: {
              var we = m, it = we._payload, Ne = we._init;
              try {
                return Dn(Ne(it));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var xn = Object.prototype.hasOwnProperty, On = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Jn, ha, Nn;
      Nn = {};
      function ar(m) {
        if (xn.call(m, "ref")) {
          var R = Object.getOwnPropertyDescriptor(m, "ref").get;
          if (R && R.isReactWarning)
            return !1;
        }
        return m.ref !== void 0;
      }
      function Or(m) {
        if (xn.call(m, "key")) {
          var R = Object.getOwnPropertyDescriptor(m, "key").get;
          if (R && R.isReactWarning)
            return !1;
        }
        return m.key !== void 0;
      }
      function ma(m, R) {
        var Y = function() {
          Jn || (Jn = !0, Me("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", R));
        };
        Y.isReactWarning = !0, Object.defineProperty(m, "key", {
          get: Y,
          configurable: !0
        });
      }
      function Lr(m, R) {
        var Y = function() {
          ha || (ha = !0, Me("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", R));
        };
        Y.isReactWarning = !0, Object.defineProperty(m, "ref", {
          get: Y,
          configurable: !0
        });
      }
      function _e(m) {
        if (typeof m.ref == "string" && se.current && m.__self && se.current.stateNode !== m.__self) {
          var R = Dn(se.current.type);
          Nn[R] || (Me('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', R, m.ref), Nn[R] = !0);
        }
      }
      var Xe = function(m, R, Y, K, we, it, Ne) {
        var ut = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: q,
          // Built-in properties that belong on the element
          type: m,
          key: R,
          ref: Y,
          props: Ne,
          // Record the component responsible for creating this element.
          _owner: it
        };
        return ut._store = {}, Object.defineProperty(ut._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(ut, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: K
        }), Object.defineProperty(ut, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: we
        }), Object.freeze && (Object.freeze(ut.props), Object.freeze(ut)), ut;
      };
      function wt(m, R, Y) {
        var K, we = {}, it = null, Ne = null, ut = null, At = null;
        if (R != null) {
          ar(R) && (Ne = R.ref, _e(R)), Or(R) && (cr(R.key), it = "" + R.key), ut = R.__self === void 0 ? null : R.__self, At = R.__source === void 0 ? null : R.__source;
          for (K in R)
            xn.call(R, K) && !On.hasOwnProperty(K) && (we[K] = R[K]);
        }
        var Wt = arguments.length - 2;
        if (Wt === 1)
          we.children = Y;
        else if (Wt > 1) {
          for (var pn = Array(Wt), ln = 0; ln < Wt; ln++)
            pn[ln] = arguments[ln + 2];
          Object.freeze && Object.freeze(pn), we.children = pn;
        }
        if (m && m.defaultProps) {
          var Dt = m.defaultProps;
          for (K in Dt)
            we[K] === void 0 && (we[K] = Dt[K]);
        }
        if (it || Ne) {
          var on = typeof m == "function" ? m.displayName || m.name || "Unknown" : m;
          it && ma(we, on), Ne && Lr(we, on);
        }
        return Xe(m, it, Ne, ut, At, se.current, we);
      }
      function Te(m, R) {
        var Y = Xe(m.type, R, m.ref, m._self, m._source, m._owner, m.props);
        return Y;
      }
      function B(m, R, Y) {
        if (m == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + m + ".");
        var K, we = M({}, m.props), it = m.key, Ne = m.ref, ut = m._self, At = m._source, Wt = m._owner;
        if (R != null) {
          ar(R) && (Ne = R.ref, Wt = se.current), Or(R) && (cr(R.key), it = "" + R.key);
          var pn;
          m.type && m.type.defaultProps && (pn = m.type.defaultProps);
          for (K in R)
            xn.call(R, K) && !On.hasOwnProperty(K) && (R[K] === void 0 && pn !== void 0 ? we[K] = pn[K] : we[K] = R[K]);
        }
        var ln = arguments.length - 2;
        if (ln === 1)
          we.children = Y;
        else if (ln > 1) {
          for (var Dt = Array(ln), on = 0; on < ln; on++)
            Dt[on] = arguments[on + 2];
          we.children = Dt;
        }
        return Xe(m.type, it, Ne, ut, At, Wt, we);
      }
      function ke(m) {
        return typeof m == "object" && m !== null && m.$$typeof === q;
      }
      var tt = ".", Vt = ":";
      function Nt(m) {
        var R = /[=:]/g, Y = {
          "=": "=0",
          ":": "=2"
        }, K = m.replace(R, function(we) {
          return Y[we];
        });
        return "$" + K;
      }
      var jt = !1, Tt = /\/+/g;
      function Ut(m) {
        return m.replace(Tt, "$&/");
      }
      function zt(m, R) {
        return typeof m == "object" && m !== null && m.key != null ? (cr(m.key), Nt("" + m.key)) : R.toString(36);
      }
      function Vn(m, R, Y, K, we) {
        var it = typeof m;
        (it === "undefined" || it === "boolean") && (m = null);
        var Ne = !1;
        if (m === null)
          Ne = !0;
        else
          switch (it) {
            case "string":
            case "number":
              Ne = !0;
              break;
            case "object":
              switch (m.$$typeof) {
                case q:
                case ee:
                  Ne = !0;
              }
          }
        if (Ne) {
          var ut = m, At = we(ut), Wt = K === "" ? tt + zt(ut, 0) : K;
          if (hn(At)) {
            var pn = "";
            Wt != null && (pn = Ut(Wt) + "/"), Vn(At, R, pn, "", function(Zf) {
              return Zf;
            });
          } else At != null && (ke(At) && (At.key && (!ut || ut.key !== At.key) && cr(At.key), At = Te(
            At,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            Y + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (At.key && (!ut || ut.key !== At.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              Ut("" + At.key) + "/"
            ) : "") + Wt
          )), R.push(At));
          return 1;
        }
        var ln, Dt, on = 0, bn = K === "" ? tt : K + Vt;
        if (hn(m))
          for (var bl = 0; bl < m.length; bl++)
            ln = m[bl], Dt = bn + zt(ln, bl), on += Vn(ln, R, Y, Dt, we);
        else {
          var Xu = oe(m);
          if (typeof Xu == "function") {
            var Bi = m;
            Xu === Bi.entries && (jt || pt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), jt = !0);
            for (var Ju = Xu.call(Bi), co, Jf = 0; !(co = Ju.next()).done; )
              ln = co.value, Dt = bn + zt(ln, Jf++), on += Vn(ln, R, Y, Dt, we);
          } else if (it === "object") {
            var fc = String(m);
            throw new Error("Objects are not valid as a React child (found: " + (fc === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : fc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return on;
      }
      function fr(m, R, Y) {
        if (m == null)
          return m;
        var K = [], we = 0;
        return Vn(m, K, "", "", function(it) {
          return R.call(Y, it, we++);
        }), K;
      }
      function to(m) {
        var R = 0;
        return fr(m, function() {
          R++;
        }), R;
      }
      function no(m, R, Y) {
        fr(m, function() {
          R.apply(this, arguments);
        }, Y);
      }
      function vl(m) {
        return fr(m, function(R) {
          return R;
        }) || [];
      }
      function hl(m) {
        if (!ke(m))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return m;
      }
      function ro(m) {
        var R = {
          $$typeof: z,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: m,
          _currentValue2: m,
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
        R.Provider = {
          $$typeof: L,
          _context: R
        };
        var Y = !1, K = !1, we = !1;
        {
          var it = {
            $$typeof: z,
            _context: R
          };
          Object.defineProperties(it, {
            Provider: {
              get: function() {
                return K || (K = !0, Me("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), R.Provider;
              },
              set: function(Ne) {
                R.Provider = Ne;
              }
            },
            _currentValue: {
              get: function() {
                return R._currentValue;
              },
              set: function(Ne) {
                R._currentValue = Ne;
              }
            },
            _currentValue2: {
              get: function() {
                return R._currentValue2;
              },
              set: function(Ne) {
                R._currentValue2 = Ne;
              }
            },
            _threadCount: {
              get: function() {
                return R._threadCount;
              },
              set: function(Ne) {
                R._threadCount = Ne;
              }
            },
            Consumer: {
              get: function() {
                return Y || (Y = !0, Me("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), R.Consumer;
              }
            },
            displayName: {
              get: function() {
                return R.displayName;
              },
              set: function(Ne) {
                we || (pt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", Ne), we = !0);
              }
            }
          }), R.Consumer = it;
        }
        return R._currentRenderer = null, R._currentRenderer2 = null, R;
      }
      var Mr = -1, Ar = 0, dr = 1, pi = 2;
      function qa(m) {
        if (m._status === Mr) {
          var R = m._result, Y = R();
          if (Y.then(function(it) {
            if (m._status === Ar || m._status === Mr) {
              var Ne = m;
              Ne._status = dr, Ne._result = it;
            }
          }, function(it) {
            if (m._status === Ar || m._status === Mr) {
              var Ne = m;
              Ne._status = pi, Ne._result = it;
            }
          }), m._status === Mr) {
            var K = m;
            K._status = Ar, K._result = Y;
          }
        }
        if (m._status === dr) {
          var we = m._result;
          return we === void 0 && Me(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, we), "default" in we || Me(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, we), we.default;
        } else
          throw m._result;
      }
      function vi(m) {
        var R = {
          // We use these fields to store the result.
          _status: Mr,
          _result: m
        }, Y = {
          $$typeof: ne,
          _payload: R,
          _init: qa
        };
        {
          var K, we;
          Object.defineProperties(Y, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return K;
              },
              set: function(it) {
                Me("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), K = it, Object.defineProperty(Y, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return we;
              },
              set: function(it) {
                Me("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), we = it, Object.defineProperty(Y, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return Y;
      }
      function hi(m) {
        m != null && m.$$typeof === te ? Me("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof m != "function" ? Me("forwardRef requires a render function but was given %s.", m === null ? "null" : typeof m) : m.length !== 0 && m.length !== 2 && Me("forwardRef render functions accept exactly two parameters: props and ref. %s", m.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), m != null && (m.defaultProps != null || m.propTypes != null) && Me("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var R = {
          $$typeof: ge,
          render: m
        };
        {
          var Y;
          Object.defineProperty(R, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return Y;
            },
            set: function(K) {
              Y = K, !m.name && !m.displayName && (m.displayName = K);
            }
          });
        }
        return R;
      }
      var _;
      _ = Symbol.for("react.module.reference");
      function ce(m) {
        return !!(typeof m == "string" || typeof m == "function" || m === D || m === ae || Fe || m === g || m === P || m === G || re || m === X || be || je || Je || typeof m == "object" && m !== null && (m.$$typeof === ne || m.$$typeof === te || m.$$typeof === L || m.$$typeof === z || m.$$typeof === ge || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        m.$$typeof === _ || m.getModuleId !== void 0));
      }
      function Ae(m, R) {
        ce(m) || Me("memo: The first argument must be a component. Instead received: %s", m === null ? "null" : typeof m);
        var Y = {
          $$typeof: te,
          type: m,
          compare: R === void 0 ? null : R
        };
        {
          var K;
          Object.defineProperty(Y, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return K;
            },
            set: function(we) {
              K = we, !m.name && !m.displayName && (m.displayName = we);
            }
          });
        }
        return Y;
      }
      function Qe() {
        var m = Ee.current;
        return m === null && Me(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), m;
      }
      function xt(m) {
        var R = Qe();
        if (m._context !== void 0) {
          var Y = m._context;
          Y.Consumer === m ? Me("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : Y.Provider === m && Me("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return R.useContext(m);
      }
      function yt(m) {
        var R = Qe();
        return R.useState(m);
      }
      function Mt(m, R, Y) {
        var K = Qe();
        return K.useReducer(m, R, Y);
      }
      function Ot(m) {
        var R = Qe();
        return R.useRef(m);
      }
      function Ln(m, R) {
        var Y = Qe();
        return Y.useEffect(m, R);
      }
      function dn(m, R) {
        var Y = Qe();
        return Y.useInsertionEffect(m, R);
      }
      function mn(m, R) {
        var Y = Qe();
        return Y.useLayoutEffect(m, R);
      }
      function pr(m, R) {
        var Y = Qe();
        return Y.useCallback(m, R);
      }
      function Xa(m, R) {
        var Y = Qe();
        return Y.useMemo(m, R);
      }
      function Ja(m, R, Y) {
        var K = Qe();
        return K.useImperativeHandle(m, R, Y);
      }
      function bt(m, R) {
        {
          var Y = Qe();
          return Y.useDebugValue(m, R);
        }
      }
      function kt() {
        var m = Qe();
        return m.useTransition();
      }
      function Za(m) {
        var R = Qe();
        return R.useDeferredValue(m);
      }
      function ao() {
        var m = Qe();
        return m.useId();
      }
      function io(m, R, Y) {
        var K = Qe();
        return K.useSyncExternalStore(m, R, Y);
      }
      var ml = 0, qo, yl, Jr, Wu, zr, sc, cc;
      function Xo() {
      }
      Xo.__reactDisabledLog = !0;
      function gl() {
        {
          if (ml === 0) {
            qo = console.log, yl = console.info, Jr = console.warn, Wu = console.error, zr = console.group, sc = console.groupCollapsed, cc = console.groupEnd;
            var m = {
              configurable: !0,
              enumerable: !0,
              value: Xo,
              writable: !0
            };
            Object.defineProperties(console, {
              info: m,
              log: m,
              warn: m,
              error: m,
              group: m,
              groupCollapsed: m,
              groupEnd: m
            });
          }
          ml++;
        }
      }
      function ya() {
        {
          if (ml--, ml === 0) {
            var m = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: M({}, m, {
                value: qo
              }),
              info: M({}, m, {
                value: yl
              }),
              warn: M({}, m, {
                value: Jr
              }),
              error: M({}, m, {
                value: Wu
              }),
              group: M({}, m, {
                value: zr
              }),
              groupCollapsed: M({}, m, {
                value: sc
              }),
              groupEnd: M({}, m, {
                value: cc
              })
            });
          }
          ml < 0 && Me("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var ei = nt.ReactCurrentDispatcher, ti;
      function Jo(m, R, Y) {
        {
          if (ti === void 0)
            try {
              throw Error();
            } catch (we) {
              var K = we.stack.trim().match(/\n( *(at )?)/);
              ti = K && K[1] || "";
            }
          return `
` + ti + m;
        }
      }
      var lo = !1, Sl;
      {
        var Zo = typeof WeakMap == "function" ? WeakMap : Map;
        Sl = new Zo();
      }
      function eu(m, R) {
        if (!m || lo)
          return "";
        {
          var Y = Sl.get(m);
          if (Y !== void 0)
            return Y;
        }
        var K;
        lo = !0;
        var we = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var it;
        it = ei.current, ei.current = null, gl();
        try {
          if (R) {
            var Ne = function() {
              throw Error();
            };
            if (Object.defineProperty(Ne.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(Ne, []);
              } catch (bn) {
                K = bn;
              }
              Reflect.construct(m, [], Ne);
            } else {
              try {
                Ne.call();
              } catch (bn) {
                K = bn;
              }
              m.call(Ne.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (bn) {
              K = bn;
            }
            m();
          }
        } catch (bn) {
          if (bn && K && typeof bn.stack == "string") {
            for (var ut = bn.stack.split(`
`), At = K.stack.split(`
`), Wt = ut.length - 1, pn = At.length - 1; Wt >= 1 && pn >= 0 && ut[Wt] !== At[pn]; )
              pn--;
            for (; Wt >= 1 && pn >= 0; Wt--, pn--)
              if (ut[Wt] !== At[pn]) {
                if (Wt !== 1 || pn !== 1)
                  do
                    if (Wt--, pn--, pn < 0 || ut[Wt] !== At[pn]) {
                      var ln = `
` + ut[Wt].replace(" at new ", " at ");
                      return m.displayName && ln.includes("<anonymous>") && (ln = ln.replace("<anonymous>", m.displayName)), typeof m == "function" && Sl.set(m, ln), ln;
                    }
                  while (Wt >= 1 && pn >= 0);
                break;
              }
          }
        } finally {
          lo = !1, ei.current = it, ya(), Error.prepareStackTrace = we;
        }
        var Dt = m ? m.displayName || m.name : "", on = Dt ? Jo(Dt) : "";
        return typeof m == "function" && Sl.set(m, on), on;
      }
      function Hi(m, R, Y) {
        return eu(m, !1);
      }
      function qf(m) {
        var R = m.prototype;
        return !!(R && R.isReactComponent);
      }
      function Vi(m, R, Y) {
        if (m == null)
          return "";
        if (typeof m == "function")
          return eu(m, qf(m));
        if (typeof m == "string")
          return Jo(m);
        switch (m) {
          case P:
            return Jo("Suspense");
          case G:
            return Jo("SuspenseList");
        }
        if (typeof m == "object")
          switch (m.$$typeof) {
            case ge:
              return Hi(m.render);
            case te:
              return Vi(m.type, R, Y);
            case ne: {
              var K = m, we = K._payload, it = K._init;
              try {
                return Vi(it(we), R, Y);
              } catch {
              }
            }
          }
        return "";
      }
      var qt = {}, tu = nt.ReactDebugCurrentFrame;
      function Qt(m) {
        if (m) {
          var R = m._owner, Y = Vi(m.type, m._source, R ? R.type : null);
          tu.setExtraStackFrame(Y);
        } else
          tu.setExtraStackFrame(null);
      }
      function Gu(m, R, Y, K, we) {
        {
          var it = Function.call.bind(xn);
          for (var Ne in m)
            if (it(m, Ne)) {
              var ut = void 0;
              try {
                if (typeof m[Ne] != "function") {
                  var At = Error((K || "React class") + ": " + Y + " type `" + Ne + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof m[Ne] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw At.name = "Invariant Violation", At;
                }
                ut = m[Ne](R, Ne, K, Y, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Wt) {
                ut = Wt;
              }
              ut && !(ut instanceof Error) && (Qt(we), Me("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", K || "React class", Y, Ne, typeof ut), Qt(null)), ut instanceof Error && !(ut.message in qt) && (qt[ut.message] = !0, Qt(we), Me("Failed %s type: %s", Y, ut.message), Qt(null));
            }
        }
      }
      function mi(m) {
        if (m) {
          var R = m._owner, Y = Vi(m.type, m._source, R ? R.type : null);
          ue(Y);
        } else
          ue(null);
      }
      var ht;
      ht = !1;
      function nu() {
        if (se.current) {
          var m = Dn(se.current.type);
          if (m)
            return `

Check the render method of \`` + m + "`.";
        }
        return "";
      }
      function vr(m) {
        if (m !== void 0) {
          var R = m.fileName.replace(/^.*[\\\/]/, ""), Y = m.lineNumber;
          return `

Check your code at ` + R + ":" + Y + ".";
        }
        return "";
      }
      function yi(m) {
        return m != null ? vr(m.__source) : "";
      }
      var Ur = {};
      function gi(m) {
        var R = nu();
        if (!R) {
          var Y = typeof m == "string" ? m : m.displayName || m.name;
          Y && (R = `

Check the top-level render call using <` + Y + ">.");
        }
        return R;
      }
      function yn(m, R) {
        if (!(!m._store || m._store.validated || m.key != null)) {
          m._store.validated = !0;
          var Y = gi(R);
          if (!Ur[Y]) {
            Ur[Y] = !0;
            var K = "";
            m && m._owner && m._owner !== se.current && (K = " It was passed a child from " + Dn(m._owner.type) + "."), mi(m), Me('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', Y, K), mi(null);
          }
        }
      }
      function an(m, R) {
        if (typeof m == "object") {
          if (hn(m))
            for (var Y = 0; Y < m.length; Y++) {
              var K = m[Y];
              ke(K) && yn(K, R);
            }
          else if (ke(m))
            m._store && (m._store.validated = !0);
          else if (m) {
            var we = oe(m);
            if (typeof we == "function" && we !== m.entries)
              for (var it = we.call(m), Ne; !(Ne = it.next()).done; )
                ke(Ne.value) && yn(Ne.value, R);
          }
        }
      }
      function El(m) {
        {
          var R = m.type;
          if (R == null || typeof R == "string")
            return;
          var Y;
          if (typeof R == "function")
            Y = R.propTypes;
          else if (typeof R == "object" && (R.$$typeof === ge || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          R.$$typeof === te))
            Y = R.propTypes;
          else
            return;
          if (Y) {
            var K = Dn(R);
            Gu(Y, m.props, "prop", K, m);
          } else if (R.PropTypes !== void 0 && !ht) {
            ht = !0;
            var we = Dn(R);
            Me("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", we || "Unknown");
          }
          typeof R.getDefaultProps == "function" && !R.getDefaultProps.isReactClassApproved && Me("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Zn(m) {
        {
          for (var R = Object.keys(m.props), Y = 0; Y < R.length; Y++) {
            var K = R[Y];
            if (K !== "children" && K !== "key") {
              mi(m), Me("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", K), mi(null);
              break;
            }
          }
          m.ref !== null && (mi(m), Me("Invalid attribute `ref` supplied to `React.Fragment`."), mi(null));
        }
      }
      function Fr(m, R, Y) {
        var K = ce(m);
        if (!K) {
          var we = "";
          (m === void 0 || typeof m == "object" && m !== null && Object.keys(m).length === 0) && (we += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var it = yi(R);
          it ? we += it : we += nu();
          var Ne;
          m === null ? Ne = "null" : hn(m) ? Ne = "array" : m !== void 0 && m.$$typeof === q ? (Ne = "<" + (Dn(m.type) || "Unknown") + " />", we = " Did you accidentally export a JSX literal instead of a component?") : Ne = typeof m, Me("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Ne, we);
        }
        var ut = wt.apply(this, arguments);
        if (ut == null)
          return ut;
        if (K)
          for (var At = 2; At < arguments.length; At++)
            an(arguments[At], m);
        return m === D ? Zn(ut) : El(ut), ut;
      }
      var Na = !1;
      function oo(m) {
        var R = Fr.bind(null, m);
        return R.type = m, Na || (Na = !0, pt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(R, "type", {
          enumerable: !1,
          get: function() {
            return pt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: m
            }), m;
          }
        }), R;
      }
      function Ku(m, R, Y) {
        for (var K = B.apply(this, arguments), we = 2; we < arguments.length; we++)
          an(arguments[we], K.type);
        return El(K), K;
      }
      function qu(m, R) {
        var Y = Se.transition;
        Se.transition = {};
        var K = Se.transition;
        Se.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          m();
        } finally {
          if (Se.transition = Y, Y === null && K._updatedFibers) {
            var we = K._updatedFibers.size;
            we > 10 && pt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), K._updatedFibers.clear();
          }
        }
      }
      var Cl = !1, uo = null;
      function Xf(m) {
        if (uo === null)
          try {
            var R = ("require" + Math.random()).slice(0, 7), Y = C && C[R];
            uo = Y.call(C, "timers").setImmediate;
          } catch {
            uo = function(we) {
              Cl === !1 && (Cl = !0, typeof MessageChannel > "u" && Me("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var it = new MessageChannel();
              it.port1.onmessage = we, it.port2.postMessage(void 0);
            };
          }
        return uo(m);
      }
      var ja = 0, ni = !1;
      function Si(m) {
        {
          var R = ja;
          ja++, le.current === null && (le.current = []);
          var Y = le.isBatchingLegacy, K;
          try {
            if (le.isBatchingLegacy = !0, K = m(), !Y && le.didScheduleLegacyUpdate) {
              var we = le.current;
              we !== null && (le.didScheduleLegacyUpdate = !1, xl(we));
            }
          } catch (Dt) {
            throw Oa(R), Dt;
          } finally {
            le.isBatchingLegacy = Y;
          }
          if (K !== null && typeof K == "object" && typeof K.then == "function") {
            var it = K, Ne = !1, ut = {
              then: function(Dt, on) {
                Ne = !0, it.then(function(bn) {
                  Oa(R), ja === 0 ? ru(bn, Dt, on) : Dt(bn);
                }, function(bn) {
                  Oa(R), on(bn);
                });
              }
            };
            return !ni && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              Ne || (ni = !0, Me("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), ut;
          } else {
            var At = K;
            if (Oa(R), ja === 0) {
              var Wt = le.current;
              Wt !== null && (xl(Wt), le.current = null);
              var pn = {
                then: function(Dt, on) {
                  le.current === null ? (le.current = [], ru(At, Dt, on)) : Dt(At);
                }
              };
              return pn;
            } else {
              var ln = {
                then: function(Dt, on) {
                  Dt(At);
                }
              };
              return ln;
            }
          }
        }
      }
      function Oa(m) {
        m !== ja - 1 && Me("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), ja = m;
      }
      function ru(m, R, Y) {
        {
          var K = le.current;
          if (K !== null)
            try {
              xl(K), Xf(function() {
                K.length === 0 ? (le.current = null, R(m)) : ru(m, R, Y);
              });
            } catch (we) {
              Y(we);
            }
          else
            R(m);
        }
      }
      var au = !1;
      function xl(m) {
        if (!au) {
          au = !0;
          var R = 0;
          try {
            for (; R < m.length; R++) {
              var Y = m[R];
              do
                Y = Y(!0);
              while (Y !== null);
            }
            m.length = 0;
          } catch (K) {
            throw m = m.slice(R + 1), K;
          } finally {
            au = !1;
          }
        }
      }
      var so = Fr, iu = Ku, lu = oo, ri = {
        map: fr,
        forEach: no,
        count: to,
        toArray: vl,
        only: hl
      };
      E.Children = ri, E.Component = $e, E.Fragment = D, E.Profiler = ae, E.PureComponent = _t, E.StrictMode = g, E.Suspense = P, E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = nt, E.act = Si, E.cloneElement = iu, E.createContext = ro, E.createElement = so, E.createFactory = lu, E.createRef = Cn, E.forwardRef = hi, E.isValidElement = ke, E.lazy = vi, E.memo = Ae, E.startTransition = qu, E.unstable_act = Si, E.useCallback = pr, E.useContext = xt, E.useDebugValue = bt, E.useDeferredValue = Za, E.useEffect = Ln, E.useId = ao, E.useImperativeHandle = Ja, E.useInsertionEffect = dn, E.useLayoutEffect = mn, E.useMemo = Xa, E.useReducer = Mt, E.useRef = Ot, E.useState = yt, E.useSyncExternalStore = io, E.useTransition = kt, E.version = b, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(lv, lv.exports)), lv.exports;
}
process.env.NODE_ENV === "production" ? RE.exports = ED() : RE.exports = CD();
var A = RE.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fw;
function xD() {
  if (fw) return tv;
  fw = 1;
  var C = A, E = Symbol.for("react.element"), b = Symbol.for("react.fragment"), q = Object.prototype.hasOwnProperty, ee = C.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, D = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(ae, L, z) {
    var ge, P = {}, G = null, te = null;
    z !== void 0 && (G = "" + z), L.key !== void 0 && (G = "" + L.key), L.ref !== void 0 && (te = L.ref);
    for (ge in L) q.call(L, ge) && !D.hasOwnProperty(ge) && (P[ge] = L[ge]);
    if (ae && ae.defaultProps) for (ge in L = ae.defaultProps, L) P[ge] === void 0 && (P[ge] = L[ge]);
    return { $$typeof: E, type: ae, key: G, ref: te, props: P, _owner: ee.current };
  }
  return tv.Fragment = b, tv.jsx = g, tv.jsxs = g, tv;
}
var nv = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dw;
function bD() {
  return dw || (dw = 1, process.env.NODE_ENV !== "production" && function() {
    var C = A, E = Symbol.for("react.element"), b = Symbol.for("react.portal"), q = Symbol.for("react.fragment"), ee = Symbol.for("react.strict_mode"), D = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), ae = Symbol.for("react.context"), L = Symbol.for("react.forward_ref"), z = Symbol.for("react.suspense"), ge = Symbol.for("react.suspense_list"), P = Symbol.for("react.memo"), G = Symbol.for("react.lazy"), te = Symbol.for("react.offscreen"), ne = Symbol.iterator, X = "@@iterator";
    function fe(_) {
      if (_ === null || typeof _ != "object")
        return null;
      var ce = ne && _[ne] || _[X];
      return typeof ce == "function" ? ce : null;
    }
    var Le = C.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function oe(_) {
      {
        for (var ce = arguments.length, Ae = new Array(ce > 1 ? ce - 1 : 0), Qe = 1; Qe < ce; Qe++)
          Ae[Qe - 1] = arguments[Qe];
        Ee("error", _, Ae);
      }
    }
    function Ee(_, ce, Ae) {
      {
        var Qe = Le.ReactDebugCurrentFrame, xt = Qe.getStackAddendum();
        xt !== "" && (ce += "%s", Ae = Ae.concat([xt]));
        var yt = Ae.map(function(Mt) {
          return String(Mt);
        });
        yt.unshift("Warning: " + ce), Function.prototype.apply.call(console[_], console, yt);
      }
    }
    var Se = !1, le = !1, se = !1, U = !1, pe = !1, ue;
    ue = Symbol.for("react.module.reference");
    function be(_) {
      return !!(typeof _ == "string" || typeof _ == "function" || _ === q || _ === D || pe || _ === ee || _ === z || _ === ge || U || _ === te || Se || le || se || typeof _ == "object" && _ !== null && (_.$$typeof === G || _.$$typeof === P || _.$$typeof === g || _.$$typeof === ae || _.$$typeof === L || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      _.$$typeof === ue || _.getModuleId !== void 0));
    }
    function je(_, ce, Ae) {
      var Qe = _.displayName;
      if (Qe)
        return Qe;
      var xt = ce.displayName || ce.name || "";
      return xt !== "" ? Ae + "(" + xt + ")" : Ae;
    }
    function Je(_) {
      return _.displayName || "Context";
    }
    function re(_) {
      if (_ == null)
        return null;
      if (typeof _.tag == "number" && oe("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof _ == "function")
        return _.displayName || _.name || null;
      if (typeof _ == "string")
        return _;
      switch (_) {
        case q:
          return "Fragment";
        case b:
          return "Portal";
        case D:
          return "Profiler";
        case ee:
          return "StrictMode";
        case z:
          return "Suspense";
        case ge:
          return "SuspenseList";
      }
      if (typeof _ == "object")
        switch (_.$$typeof) {
          case ae:
            var ce = _;
            return Je(ce) + ".Consumer";
          case g:
            var Ae = _;
            return Je(Ae._context) + ".Provider";
          case L:
            return je(_, _.render, "ForwardRef");
          case P:
            var Qe = _.displayName || null;
            return Qe !== null ? Qe : re(_.type) || "Memo";
          case G: {
            var xt = _, yt = xt._payload, Mt = xt._init;
            try {
              return re(Mt(yt));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Fe = Object.assign, nt = 0, pt, Me, he, Be, Re, T, M;
    function Oe() {
    }
    Oe.__reactDisabledLog = !0;
    function $e() {
      {
        if (nt === 0) {
          pt = console.log, Me = console.info, he = console.warn, Be = console.error, Re = console.group, T = console.groupCollapsed, M = console.groupEnd;
          var _ = {
            configurable: !0,
            enumerable: !0,
            value: Oe,
            writable: !0
          };
          Object.defineProperties(console, {
            info: _,
            log: _,
            warn: _,
            error: _,
            group: _,
            groupCollapsed: _,
            groupEnd: _
          });
        }
        nt++;
      }
    }
    function St() {
      {
        if (nt--, nt === 0) {
          var _ = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Fe({}, _, {
              value: pt
            }),
            info: Fe({}, _, {
              value: Me
            }),
            warn: Fe({}, _, {
              value: he
            }),
            error: Fe({}, _, {
              value: Be
            }),
            group: Fe({}, _, {
              value: Re
            }),
            groupCollapsed: Fe({}, _, {
              value: T
            }),
            groupEnd: Fe({}, _, {
              value: M
            })
          });
        }
        nt < 0 && oe("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var vt = Le.ReactCurrentDispatcher, mt;
    function Et(_, ce, Ae) {
      {
        if (mt === void 0)
          try {
            throw Error();
          } catch (xt) {
            var Qe = xt.stack.trim().match(/\n( *(at )?)/);
            mt = Qe && Qe[1] || "";
          }
        return `
` + mt + _;
      }
    }
    var _t = !1, Kt;
    {
      var Cn = typeof WeakMap == "function" ? WeakMap : Map;
      Kt = new Cn();
    }
    function Hn(_, ce) {
      if (!_ || _t)
        return "";
      {
        var Ae = Kt.get(_);
        if (Ae !== void 0)
          return Ae;
      }
      var Qe;
      _t = !0;
      var xt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var yt;
      yt = vt.current, vt.current = null, $e();
      try {
        if (ce) {
          var Mt = function() {
            throw Error();
          };
          if (Object.defineProperty(Mt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Mt, []);
            } catch (bt) {
              Qe = bt;
            }
            Reflect.construct(_, [], Mt);
          } else {
            try {
              Mt.call();
            } catch (bt) {
              Qe = bt;
            }
            _.call(Mt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (bt) {
            Qe = bt;
          }
          _();
        }
      } catch (bt) {
        if (bt && Qe && typeof bt.stack == "string") {
          for (var Ot = bt.stack.split(`
`), Ln = Qe.stack.split(`
`), dn = Ot.length - 1, mn = Ln.length - 1; dn >= 1 && mn >= 0 && Ot[dn] !== Ln[mn]; )
            mn--;
          for (; dn >= 1 && mn >= 0; dn--, mn--)
            if (Ot[dn] !== Ln[mn]) {
              if (dn !== 1 || mn !== 1)
                do
                  if (dn--, mn--, mn < 0 || Ot[dn] !== Ln[mn]) {
                    var pr = `
` + Ot[dn].replace(" at new ", " at ");
                    return _.displayName && pr.includes("<anonymous>") && (pr = pr.replace("<anonymous>", _.displayName)), typeof _ == "function" && Kt.set(_, pr), pr;
                  }
                while (dn >= 1 && mn >= 0);
              break;
            }
        }
      } finally {
        _t = !1, vt.current = yt, St(), Error.prepareStackTrace = xt;
      }
      var Xa = _ ? _.displayName || _.name : "", Ja = Xa ? Et(Xa) : "";
      return typeof _ == "function" && Kt.set(_, Ja), Ja;
    }
    function hn(_, ce, Ae) {
      return Hn(_, !1);
    }
    function Xn(_) {
      var ce = _.prototype;
      return !!(ce && ce.isReactComponent);
    }
    function Ht(_, ce, Ae) {
      if (_ == null)
        return "";
      if (typeof _ == "function")
        return Hn(_, Xn(_));
      if (typeof _ == "string")
        return Et(_);
      switch (_) {
        case z:
          return Et("Suspense");
        case ge:
          return Et("SuspenseList");
      }
      if (typeof _ == "object")
        switch (_.$$typeof) {
          case L:
            return hn(_.render);
          case P:
            return Ht(_.type, ce, Ae);
          case G: {
            var Qe = _, xt = Qe._payload, yt = Qe._init;
            try {
              return Ht(yt(xt), ce, Ae);
            } catch {
            }
          }
        }
      return "";
    }
    var kn = Object.prototype.hasOwnProperty, cr = {}, Da = Le.ReactDebugCurrentFrame;
    function _r(_) {
      if (_) {
        var ce = _._owner, Ae = Ht(_.type, _._source, ce ? ce.type : null);
        Da.setExtraStackFrame(Ae);
      } else
        Da.setExtraStackFrame(null);
    }
    function Dn(_, ce, Ae, Qe, xt) {
      {
        var yt = Function.call.bind(kn);
        for (var Mt in _)
          if (yt(_, Mt)) {
            var Ot = void 0;
            try {
              if (typeof _[Mt] != "function") {
                var Ln = Error((Qe || "React class") + ": " + Ae + " type `" + Mt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof _[Mt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Ln.name = "Invariant Violation", Ln;
              }
              Ot = _[Mt](ce, Mt, Qe, Ae, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (dn) {
              Ot = dn;
            }
            Ot && !(Ot instanceof Error) && (_r(xt), oe("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Qe || "React class", Ae, Mt, typeof Ot), _r(null)), Ot instanceof Error && !(Ot.message in cr) && (cr[Ot.message] = !0, _r(xt), oe("Failed %s type: %s", Ae, Ot.message), _r(null));
          }
      }
    }
    var xn = Array.isArray;
    function On(_) {
      return xn(_);
    }
    function Jn(_) {
      {
        var ce = typeof Symbol == "function" && Symbol.toStringTag, Ae = ce && _[Symbol.toStringTag] || _.constructor.name || "Object";
        return Ae;
      }
    }
    function ha(_) {
      try {
        return Nn(_), !1;
      } catch {
        return !0;
      }
    }
    function Nn(_) {
      return "" + _;
    }
    function ar(_) {
      if (ha(_))
        return oe("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Jn(_)), Nn(_);
    }
    var Or = Le.ReactCurrentOwner, ma = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Lr, _e;
    function Xe(_) {
      if (kn.call(_, "ref")) {
        var ce = Object.getOwnPropertyDescriptor(_, "ref").get;
        if (ce && ce.isReactWarning)
          return !1;
      }
      return _.ref !== void 0;
    }
    function wt(_) {
      if (kn.call(_, "key")) {
        var ce = Object.getOwnPropertyDescriptor(_, "key").get;
        if (ce && ce.isReactWarning)
          return !1;
      }
      return _.key !== void 0;
    }
    function Te(_, ce) {
      typeof _.ref == "string" && Or.current;
    }
    function B(_, ce) {
      {
        var Ae = function() {
          Lr || (Lr = !0, oe("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ce));
        };
        Ae.isReactWarning = !0, Object.defineProperty(_, "key", {
          get: Ae,
          configurable: !0
        });
      }
    }
    function ke(_, ce) {
      {
        var Ae = function() {
          _e || (_e = !0, oe("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ce));
        };
        Ae.isReactWarning = !0, Object.defineProperty(_, "ref", {
          get: Ae,
          configurable: !0
        });
      }
    }
    var tt = function(_, ce, Ae, Qe, xt, yt, Mt) {
      var Ot = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: E,
        // Built-in properties that belong on the element
        type: _,
        key: ce,
        ref: Ae,
        props: Mt,
        // Record the component responsible for creating this element.
        _owner: yt
      };
      return Ot._store = {}, Object.defineProperty(Ot._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(Ot, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Qe
      }), Object.defineProperty(Ot, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: xt
      }), Object.freeze && (Object.freeze(Ot.props), Object.freeze(Ot)), Ot;
    };
    function Vt(_, ce, Ae, Qe, xt) {
      {
        var yt, Mt = {}, Ot = null, Ln = null;
        Ae !== void 0 && (ar(Ae), Ot = "" + Ae), wt(ce) && (ar(ce.key), Ot = "" + ce.key), Xe(ce) && (Ln = ce.ref, Te(ce, xt));
        for (yt in ce)
          kn.call(ce, yt) && !ma.hasOwnProperty(yt) && (Mt[yt] = ce[yt]);
        if (_ && _.defaultProps) {
          var dn = _.defaultProps;
          for (yt in dn)
            Mt[yt] === void 0 && (Mt[yt] = dn[yt]);
        }
        if (Ot || Ln) {
          var mn = typeof _ == "function" ? _.displayName || _.name || "Unknown" : _;
          Ot && B(Mt, mn), Ln && ke(Mt, mn);
        }
        return tt(_, Ot, Ln, xt, Qe, Or.current, Mt);
      }
    }
    var Nt = Le.ReactCurrentOwner, jt = Le.ReactDebugCurrentFrame;
    function Tt(_) {
      if (_) {
        var ce = _._owner, Ae = Ht(_.type, _._source, ce ? ce.type : null);
        jt.setExtraStackFrame(Ae);
      } else
        jt.setExtraStackFrame(null);
    }
    var Ut;
    Ut = !1;
    function zt(_) {
      return typeof _ == "object" && _ !== null && _.$$typeof === E;
    }
    function Vn() {
      {
        if (Nt.current) {
          var _ = re(Nt.current.type);
          if (_)
            return `

Check the render method of \`` + _ + "`.";
        }
        return "";
      }
    }
    function fr(_) {
      return "";
    }
    var to = {};
    function no(_) {
      {
        var ce = Vn();
        if (!ce) {
          var Ae = typeof _ == "string" ? _ : _.displayName || _.name;
          Ae && (ce = `

Check the top-level render call using <` + Ae + ">.");
        }
        return ce;
      }
    }
    function vl(_, ce) {
      {
        if (!_._store || _._store.validated || _.key != null)
          return;
        _._store.validated = !0;
        var Ae = no(ce);
        if (to[Ae])
          return;
        to[Ae] = !0;
        var Qe = "";
        _ && _._owner && _._owner !== Nt.current && (Qe = " It was passed a child from " + re(_._owner.type) + "."), Tt(_), oe('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', Ae, Qe), Tt(null);
      }
    }
    function hl(_, ce) {
      {
        if (typeof _ != "object")
          return;
        if (On(_))
          for (var Ae = 0; Ae < _.length; Ae++) {
            var Qe = _[Ae];
            zt(Qe) && vl(Qe, ce);
          }
        else if (zt(_))
          _._store && (_._store.validated = !0);
        else if (_) {
          var xt = fe(_);
          if (typeof xt == "function" && xt !== _.entries)
            for (var yt = xt.call(_), Mt; !(Mt = yt.next()).done; )
              zt(Mt.value) && vl(Mt.value, ce);
        }
      }
    }
    function ro(_) {
      {
        var ce = _.type;
        if (ce == null || typeof ce == "string")
          return;
        var Ae;
        if (typeof ce == "function")
          Ae = ce.propTypes;
        else if (typeof ce == "object" && (ce.$$typeof === L || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        ce.$$typeof === P))
          Ae = ce.propTypes;
        else
          return;
        if (Ae) {
          var Qe = re(ce);
          Dn(Ae, _.props, "prop", Qe, _);
        } else if (ce.PropTypes !== void 0 && !Ut) {
          Ut = !0;
          var xt = re(ce);
          oe("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", xt || "Unknown");
        }
        typeof ce.getDefaultProps == "function" && !ce.getDefaultProps.isReactClassApproved && oe("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Mr(_) {
      {
        for (var ce = Object.keys(_.props), Ae = 0; Ae < ce.length; Ae++) {
          var Qe = ce[Ae];
          if (Qe !== "children" && Qe !== "key") {
            Tt(_), oe("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Qe), Tt(null);
            break;
          }
        }
        _.ref !== null && (Tt(_), oe("Invalid attribute `ref` supplied to `React.Fragment`."), Tt(null));
      }
    }
    var Ar = {};
    function dr(_, ce, Ae, Qe, xt, yt) {
      {
        var Mt = be(_);
        if (!Mt) {
          var Ot = "";
          (_ === void 0 || typeof _ == "object" && _ !== null && Object.keys(_).length === 0) && (Ot += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ln = fr();
          Ln ? Ot += Ln : Ot += Vn();
          var dn;
          _ === null ? dn = "null" : On(_) ? dn = "array" : _ !== void 0 && _.$$typeof === E ? (dn = "<" + (re(_.type) || "Unknown") + " />", Ot = " Did you accidentally export a JSX literal instead of a component?") : dn = typeof _, oe("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", dn, Ot);
        }
        var mn = Vt(_, ce, Ae, xt, yt);
        if (mn == null)
          return mn;
        if (Mt) {
          var pr = ce.children;
          if (pr !== void 0)
            if (Qe)
              if (On(pr)) {
                for (var Xa = 0; Xa < pr.length; Xa++)
                  hl(pr[Xa], _);
                Object.freeze && Object.freeze(pr);
              } else
                oe("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              hl(pr, _);
        }
        if (kn.call(ce, "key")) {
          var Ja = re(_), bt = Object.keys(ce).filter(function(ao) {
            return ao !== "key";
          }), kt = bt.length > 0 ? "{key: someKey, " + bt.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Ar[Ja + kt]) {
            var Za = bt.length > 0 ? "{" + bt.join(": ..., ") + ": ...}" : "{}";
            oe(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, kt, Ja, Za, Ja), Ar[Ja + kt] = !0;
          }
        }
        return _ === q ? Mr(mn) : ro(mn), mn;
      }
    }
    function pi(_, ce, Ae) {
      return dr(_, ce, Ae, !0);
    }
    function qa(_, ce, Ae) {
      return dr(_, ce, Ae, !1);
    }
    var vi = qa, hi = pi;
    nv.Fragment = q, nv.jsx = vi, nv.jsxs = hi;
  }()), nv;
}
process.env.NODE_ENV === "production" ? TE.exports = xD() : TE.exports = bD();
var p = TE.exports, _E = { exports: {} }, Ga = {}, Zm = { exports: {} }, EE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pw;
function wD() {
  return pw || (pw = 1, function(C) {
    function E(he, Be) {
      var Re = he.length;
      he.push(Be);
      e: for (; 0 < Re; ) {
        var T = Re - 1 >>> 1, M = he[T];
        if (0 < ee(M, Be)) he[T] = Be, he[Re] = M, Re = T;
        else break e;
      }
    }
    function b(he) {
      return he.length === 0 ? null : he[0];
    }
    function q(he) {
      if (he.length === 0) return null;
      var Be = he[0], Re = he.pop();
      if (Re !== Be) {
        he[0] = Re;
        e: for (var T = 0, M = he.length, Oe = M >>> 1; T < Oe; ) {
          var $e = 2 * (T + 1) - 1, St = he[$e], vt = $e + 1, mt = he[vt];
          if (0 > ee(St, Re)) vt < M && 0 > ee(mt, St) ? (he[T] = mt, he[vt] = Re, T = vt) : (he[T] = St, he[$e] = Re, T = $e);
          else if (vt < M && 0 > ee(mt, Re)) he[T] = mt, he[vt] = Re, T = vt;
          else break e;
        }
      }
      return Be;
    }
    function ee(he, Be) {
      var Re = he.sortIndex - Be.sortIndex;
      return Re !== 0 ? Re : he.id - Be.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var D = performance;
      C.unstable_now = function() {
        return D.now();
      };
    } else {
      var g = Date, ae = g.now();
      C.unstable_now = function() {
        return g.now() - ae;
      };
    }
    var L = [], z = [], ge = 1, P = null, G = 3, te = !1, ne = !1, X = !1, fe = typeof setTimeout == "function" ? setTimeout : null, Le = typeof clearTimeout == "function" ? clearTimeout : null, oe = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Ee(he) {
      for (var Be = b(z); Be !== null; ) {
        if (Be.callback === null) q(z);
        else if (Be.startTime <= he) q(z), Be.sortIndex = Be.expirationTime, E(L, Be);
        else break;
        Be = b(z);
      }
    }
    function Se(he) {
      if (X = !1, Ee(he), !ne) if (b(L) !== null) ne = !0, pt(le);
      else {
        var Be = b(z);
        Be !== null && Me(Se, Be.startTime - he);
      }
    }
    function le(he, Be) {
      ne = !1, X && (X = !1, Le(pe), pe = -1), te = !0;
      var Re = G;
      try {
        for (Ee(Be), P = b(L); P !== null && (!(P.expirationTime > Be) || he && !je()); ) {
          var T = P.callback;
          if (typeof T == "function") {
            P.callback = null, G = P.priorityLevel;
            var M = T(P.expirationTime <= Be);
            Be = C.unstable_now(), typeof M == "function" ? P.callback = M : P === b(L) && q(L), Ee(Be);
          } else q(L);
          P = b(L);
        }
        if (P !== null) var Oe = !0;
        else {
          var $e = b(z);
          $e !== null && Me(Se, $e.startTime - Be), Oe = !1;
        }
        return Oe;
      } finally {
        P = null, G = Re, te = !1;
      }
    }
    var se = !1, U = null, pe = -1, ue = 5, be = -1;
    function je() {
      return !(C.unstable_now() - be < ue);
    }
    function Je() {
      if (U !== null) {
        var he = C.unstable_now();
        be = he;
        var Be = !0;
        try {
          Be = U(!0, he);
        } finally {
          Be ? re() : (se = !1, U = null);
        }
      } else se = !1;
    }
    var re;
    if (typeof oe == "function") re = function() {
      oe(Je);
    };
    else if (typeof MessageChannel < "u") {
      var Fe = new MessageChannel(), nt = Fe.port2;
      Fe.port1.onmessage = Je, re = function() {
        nt.postMessage(null);
      };
    } else re = function() {
      fe(Je, 0);
    };
    function pt(he) {
      U = he, se || (se = !0, re());
    }
    function Me(he, Be) {
      pe = fe(function() {
        he(C.unstable_now());
      }, Be);
    }
    C.unstable_IdlePriority = 5, C.unstable_ImmediatePriority = 1, C.unstable_LowPriority = 4, C.unstable_NormalPriority = 3, C.unstable_Profiling = null, C.unstable_UserBlockingPriority = 2, C.unstable_cancelCallback = function(he) {
      he.callback = null;
    }, C.unstable_continueExecution = function() {
      ne || te || (ne = !0, pt(le));
    }, C.unstable_forceFrameRate = function(he) {
      0 > he || 125 < he ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ue = 0 < he ? Math.floor(1e3 / he) : 5;
    }, C.unstable_getCurrentPriorityLevel = function() {
      return G;
    }, C.unstable_getFirstCallbackNode = function() {
      return b(L);
    }, C.unstable_next = function(he) {
      switch (G) {
        case 1:
        case 2:
        case 3:
          var Be = 3;
          break;
        default:
          Be = G;
      }
      var Re = G;
      G = Be;
      try {
        return he();
      } finally {
        G = Re;
      }
    }, C.unstable_pauseExecution = function() {
    }, C.unstable_requestPaint = function() {
    }, C.unstable_runWithPriority = function(he, Be) {
      switch (he) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          he = 3;
      }
      var Re = G;
      G = he;
      try {
        return Be();
      } finally {
        G = Re;
      }
    }, C.unstable_scheduleCallback = function(he, Be, Re) {
      var T = C.unstable_now();
      switch (typeof Re == "object" && Re !== null ? (Re = Re.delay, Re = typeof Re == "number" && 0 < Re ? T + Re : T) : Re = T, he) {
        case 1:
          var M = -1;
          break;
        case 2:
          M = 250;
          break;
        case 5:
          M = 1073741823;
          break;
        case 4:
          M = 1e4;
          break;
        default:
          M = 5e3;
      }
      return M = Re + M, he = { id: ge++, callback: Be, priorityLevel: he, startTime: Re, expirationTime: M, sortIndex: -1 }, Re > T ? (he.sortIndex = Re, E(z, he), b(L) === null && he === b(z) && (X ? (Le(pe), pe = -1) : X = !0, Me(Se, Re - T))) : (he.sortIndex = M, E(L, he), ne || te || (ne = !0, pt(le))), he;
    }, C.unstable_shouldYield = je, C.unstable_wrapCallback = function(he) {
      var Be = G;
      return function() {
        var Re = G;
        G = Be;
        try {
          return he.apply(this, arguments);
        } finally {
          G = Re;
        }
      };
    };
  }(EE)), EE;
}
var CE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vw;
function TD() {
  return vw || (vw = 1, function(C) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var E = !1, b = 5;
      function q(_e, Xe) {
        var wt = _e.length;
        _e.push(Xe), g(_e, Xe, wt);
      }
      function ee(_e) {
        return _e.length === 0 ? null : _e[0];
      }
      function D(_e) {
        if (_e.length === 0)
          return null;
        var Xe = _e[0], wt = _e.pop();
        return wt !== Xe && (_e[0] = wt, ae(_e, wt, 0)), Xe;
      }
      function g(_e, Xe, wt) {
        for (var Te = wt; Te > 0; ) {
          var B = Te - 1 >>> 1, ke = _e[B];
          if (L(ke, Xe) > 0)
            _e[B] = Xe, _e[Te] = ke, Te = B;
          else
            return;
        }
      }
      function ae(_e, Xe, wt) {
        for (var Te = wt, B = _e.length, ke = B >>> 1; Te < ke; ) {
          var tt = (Te + 1) * 2 - 1, Vt = _e[tt], Nt = tt + 1, jt = _e[Nt];
          if (L(Vt, Xe) < 0)
            Nt < B && L(jt, Vt) < 0 ? (_e[Te] = jt, _e[Nt] = Xe, Te = Nt) : (_e[Te] = Vt, _e[tt] = Xe, Te = tt);
          else if (Nt < B && L(jt, Xe) < 0)
            _e[Te] = jt, _e[Nt] = Xe, Te = Nt;
          else
            return;
        }
      }
      function L(_e, Xe) {
        var wt = _e.sortIndex - Xe.sortIndex;
        return wt !== 0 ? wt : _e.id - Xe.id;
      }
      var z = 1, ge = 2, P = 3, G = 4, te = 5;
      function ne(_e, Xe) {
      }
      var X = typeof performance == "object" && typeof performance.now == "function";
      if (X) {
        var fe = performance;
        C.unstable_now = function() {
          return fe.now();
        };
      } else {
        var Le = Date, oe = Le.now();
        C.unstable_now = function() {
          return Le.now() - oe;
        };
      }
      var Ee = 1073741823, Se = -1, le = 250, se = 5e3, U = 1e4, pe = Ee, ue = [], be = [], je = 1, Je = null, re = P, Fe = !1, nt = !1, pt = !1, Me = typeof setTimeout == "function" ? setTimeout : null, he = typeof clearTimeout == "function" ? clearTimeout : null, Be = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function Re(_e) {
        for (var Xe = ee(be); Xe !== null; ) {
          if (Xe.callback === null)
            D(be);
          else if (Xe.startTime <= _e)
            D(be), Xe.sortIndex = Xe.expirationTime, q(ue, Xe);
          else
            return;
          Xe = ee(be);
        }
      }
      function T(_e) {
        if (pt = !1, Re(_e), !nt)
          if (ee(ue) !== null)
            nt = !0, Nn(M);
          else {
            var Xe = ee(be);
            Xe !== null && ar(T, Xe.startTime - _e);
          }
      }
      function M(_e, Xe) {
        nt = !1, pt && (pt = !1, Or()), Fe = !0;
        var wt = re;
        try {
          var Te;
          if (!E) return Oe(_e, Xe);
        } finally {
          Je = null, re = wt, Fe = !1;
        }
      }
      function Oe(_e, Xe) {
        var wt = Xe;
        for (Re(wt), Je = ee(ue); Je !== null && !(Je.expirationTime > wt && (!_e || Da())); ) {
          var Te = Je.callback;
          if (typeof Te == "function") {
            Je.callback = null, re = Je.priorityLevel;
            var B = Je.expirationTime <= wt, ke = Te(B);
            wt = C.unstable_now(), typeof ke == "function" ? Je.callback = ke : Je === ee(ue) && D(ue), Re(wt);
          } else
            D(ue);
          Je = ee(ue);
        }
        if (Je !== null)
          return !0;
        var tt = ee(be);
        return tt !== null && ar(T, tt.startTime - wt), !1;
      }
      function $e(_e, Xe) {
        switch (_e) {
          case z:
          case ge:
          case P:
          case G:
          case te:
            break;
          default:
            _e = P;
        }
        var wt = re;
        re = _e;
        try {
          return Xe();
        } finally {
          re = wt;
        }
      }
      function St(_e) {
        var Xe;
        switch (re) {
          case z:
          case ge:
          case P:
            Xe = P;
            break;
          default:
            Xe = re;
            break;
        }
        var wt = re;
        re = Xe;
        try {
          return _e();
        } finally {
          re = wt;
        }
      }
      function vt(_e) {
        var Xe = re;
        return function() {
          var wt = re;
          re = Xe;
          try {
            return _e.apply(this, arguments);
          } finally {
            re = wt;
          }
        };
      }
      function mt(_e, Xe, wt) {
        var Te = C.unstable_now(), B;
        if (typeof wt == "object" && wt !== null) {
          var ke = wt.delay;
          typeof ke == "number" && ke > 0 ? B = Te + ke : B = Te;
        } else
          B = Te;
        var tt;
        switch (_e) {
          case z:
            tt = Se;
            break;
          case ge:
            tt = le;
            break;
          case te:
            tt = pe;
            break;
          case G:
            tt = U;
            break;
          case P:
          default:
            tt = se;
            break;
        }
        var Vt = B + tt, Nt = {
          id: je++,
          callback: Xe,
          priorityLevel: _e,
          startTime: B,
          expirationTime: Vt,
          sortIndex: -1
        };
        return B > Te ? (Nt.sortIndex = B, q(be, Nt), ee(ue) === null && Nt === ee(be) && (pt ? Or() : pt = !0, ar(T, B - Te))) : (Nt.sortIndex = Vt, q(ue, Nt), !nt && !Fe && (nt = !0, Nn(M))), Nt;
      }
      function Et() {
      }
      function _t() {
        !nt && !Fe && (nt = !0, Nn(M));
      }
      function Kt() {
        return ee(ue);
      }
      function Cn(_e) {
        _e.callback = null;
      }
      function Hn() {
        return re;
      }
      var hn = !1, Xn = null, Ht = -1, kn = b, cr = -1;
      function Da() {
        var _e = C.unstable_now() - cr;
        return !(_e < kn);
      }
      function _r() {
      }
      function Dn(_e) {
        if (_e < 0 || _e > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        _e > 0 ? kn = Math.floor(1e3 / _e) : kn = b;
      }
      var xn = function() {
        if (Xn !== null) {
          var _e = C.unstable_now();
          cr = _e;
          var Xe = !0, wt = !0;
          try {
            wt = Xn(Xe, _e);
          } finally {
            wt ? On() : (hn = !1, Xn = null);
          }
        } else
          hn = !1;
      }, On;
      if (typeof Be == "function")
        On = function() {
          Be(xn);
        };
      else if (typeof MessageChannel < "u") {
        var Jn = new MessageChannel(), ha = Jn.port2;
        Jn.port1.onmessage = xn, On = function() {
          ha.postMessage(null);
        };
      } else
        On = function() {
          Me(xn, 0);
        };
      function Nn(_e) {
        Xn = _e, hn || (hn = !0, On());
      }
      function ar(_e, Xe) {
        Ht = Me(function() {
          _e(C.unstable_now());
        }, Xe);
      }
      function Or() {
        he(Ht), Ht = -1;
      }
      var ma = _r, Lr = null;
      C.unstable_IdlePriority = te, C.unstable_ImmediatePriority = z, C.unstable_LowPriority = G, C.unstable_NormalPriority = P, C.unstable_Profiling = Lr, C.unstable_UserBlockingPriority = ge, C.unstable_cancelCallback = Cn, C.unstable_continueExecution = _t, C.unstable_forceFrameRate = Dn, C.unstable_getCurrentPriorityLevel = Hn, C.unstable_getFirstCallbackNode = Kt, C.unstable_next = St, C.unstable_pauseExecution = Et, C.unstable_requestPaint = ma, C.unstable_runWithPriority = $e, C.unstable_scheduleCallback = mt, C.unstable_shouldYield = Da, C.unstable_wrapCallback = vt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(CE)), CE;
}
var hw;
function bw() {
  return hw || (hw = 1, process.env.NODE_ENV === "production" ? Zm.exports = wD() : Zm.exports = TD()), Zm.exports;
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
var mw;
function RD() {
  if (mw) return Ga;
  mw = 1;
  var C = A, E = bw();
  function b(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var q = /* @__PURE__ */ new Set(), ee = {};
  function D(n, r) {
    g(n, r), g(n + "Capture", r);
  }
  function g(n, r) {
    for (ee[n] = r, n = 0; n < r.length; n++) q.add(r[n]);
  }
  var ae = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), L = Object.prototype.hasOwnProperty, z = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ge = {}, P = {};
  function G(n) {
    return L.call(P, n) ? !0 : L.call(ge, n) ? !1 : z.test(n) ? P[n] = !0 : (ge[n] = !0, !1);
  }
  function te(n, r, l, u) {
    if (l !== null && l.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return u ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function ne(n, r, l, u) {
    if (r === null || typeof r > "u" || te(n, r, l, u)) return !0;
    if (u) return !1;
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
  function X(n, r, l, u, c, d, y) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = u, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = y;
  }
  var fe = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    fe[n] = new X(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    fe[r] = new X(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    fe[n] = new X(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    fe[n] = new X(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    fe[n] = new X(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    fe[n] = new X(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    fe[n] = new X(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    fe[n] = new X(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    fe[n] = new X(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Le = /[\-:]([a-z])/g;
  function oe(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Le,
      oe
    );
    fe[r] = new X(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Le, oe);
    fe[r] = new X(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Le, oe);
    fe[r] = new X(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    fe[n] = new X(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), fe.xlinkHref = new X("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    fe[n] = new X(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function Ee(n, r, l, u) {
    var c = fe.hasOwnProperty(r) ? fe[r] : null;
    (c !== null ? c.type !== 0 : u || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ne(r, l, c, u) && (l = null), u || c === null ? G(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, u = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, u ? n.setAttributeNS(u, r, l) : n.setAttribute(r, l))));
  }
  var Se = C.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, le = Symbol.for("react.element"), se = Symbol.for("react.portal"), U = Symbol.for("react.fragment"), pe = Symbol.for("react.strict_mode"), ue = Symbol.for("react.profiler"), be = Symbol.for("react.provider"), je = Symbol.for("react.context"), Je = Symbol.for("react.forward_ref"), re = Symbol.for("react.suspense"), Fe = Symbol.for("react.suspense_list"), nt = Symbol.for("react.memo"), pt = Symbol.for("react.lazy"), Me = Symbol.for("react.offscreen"), he = Symbol.iterator;
  function Be(n) {
    return n === null || typeof n != "object" ? null : (n = he && n[he] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var Re = Object.assign, T;
  function M(n) {
    if (T === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      T = r && r[1] || "";
    }
    return `
` + T + n;
  }
  var Oe = !1;
  function $e(n, r) {
    if (!n || Oe) return "";
    Oe = !0;
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
        } catch (Q) {
          var u = Q;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (Q) {
          u = Q;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (Q) {
          u = Q;
        }
        n();
      }
    } catch (Q) {
      if (Q && u && typeof Q.stack == "string") {
        for (var c = Q.stack.split(`
`), d = u.stack.split(`
`), y = c.length - 1, w = d.length - 1; 1 <= y && 0 <= w && c[y] !== d[w]; ) w--;
        for (; 1 <= y && 0 <= w; y--, w--) if (c[y] !== d[w]) {
          if (y !== 1 || w !== 1)
            do
              if (y--, w--, 0 > w || c[y] !== d[w]) {
                var k = `
` + c[y].replace(" at new ", " at ");
                return n.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", n.displayName)), k;
              }
            while (1 <= y && 0 <= w);
          break;
        }
      }
    } finally {
      Oe = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? M(n) : "";
  }
  function St(n) {
    switch (n.tag) {
      case 5:
        return M(n.type);
      case 16:
        return M("Lazy");
      case 13:
        return M("Suspense");
      case 19:
        return M("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = $e(n.type, !1), n;
      case 11:
        return n = $e(n.type.render, !1), n;
      case 1:
        return n = $e(n.type, !0), n;
      default:
        return "";
    }
  }
  function vt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case U:
        return "Fragment";
      case se:
        return "Portal";
      case ue:
        return "Profiler";
      case pe:
        return "StrictMode";
      case re:
        return "Suspense";
      case Fe:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case je:
        return (n.displayName || "Context") + ".Consumer";
      case be:
        return (n._context.displayName || "Context") + ".Provider";
      case Je:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case nt:
        return r = n.displayName || null, r !== null ? r : vt(n.type) || "Memo";
      case pt:
        r = n._payload, n = n._init;
        try {
          return vt(n(r));
        } catch {
        }
    }
    return null;
  }
  function mt(n) {
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
        return vt(r);
      case 8:
        return r === pe ? "StrictMode" : "Mode";
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
  function Et(n) {
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
  function _t(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Kt(n) {
    var r = _t(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), u = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, d = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(y) {
        u = "" + y, d.call(this, y);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return u;
      }, setValue: function(y) {
        u = "" + y;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function Cn(n) {
    n._valueTracker || (n._valueTracker = Kt(n));
  }
  function Hn(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), u = "";
    return n && (u = _t(n) ? n.checked ? "true" : "false" : n.value), n = u, n !== l ? (r.setValue(n), !0) : !1;
  }
  function hn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function Xn(n, r) {
    var l = r.checked;
    return Re({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Ht(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, u = r.checked != null ? r.checked : r.defaultChecked;
    l = Et(r.value != null ? r.value : l), n._wrapperState = { initialChecked: u, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function kn(n, r) {
    r = r.checked, r != null && Ee(n, "checked", r, !1);
  }
  function cr(n, r) {
    kn(n, r);
    var l = Et(r.value), u = r.type;
    if (l != null) u === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (u === "submit" || u === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? _r(n, r.type, l) : r.hasOwnProperty("defaultValue") && _r(n, r.type, Et(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Da(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var u = r.type;
      if (!(u !== "submit" && u !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function _r(n, r, l) {
    (r !== "number" || hn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Dn = Array.isArray;
  function xn(n, r, l, u) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && u && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + Et(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, u && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function On(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(b(91));
    return Re({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Jn(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(b(92));
        if (Dn(l)) {
          if (1 < l.length) throw Error(b(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: Et(l) };
  }
  function ha(n, r) {
    var l = Et(r.value), u = Et(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), u != null && (n.defaultValue = "" + u);
  }
  function Nn(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function ar(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Or(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? ar(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var ma, Lr = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, u, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, u, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (ma = ma || document.createElement("div"), ma.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = ma.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function _e(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var Xe = {
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
  }, wt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Xe).forEach(function(n) {
    wt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), Xe[r] = Xe[n];
    });
  });
  function Te(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || Xe.hasOwnProperty(n) && Xe[n] ? ("" + r).trim() : r + "px";
  }
  function B(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var u = l.indexOf("--") === 0, c = Te(l, r[l], u);
      l === "float" && (l = "cssFloat"), u ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var ke = Re({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function tt(n, r) {
    if (r) {
      if (ke[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(b(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(b(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(b(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(b(62));
    }
  }
  function Vt(n, r) {
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
  var Nt = null;
  function jt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Tt = null, Ut = null, zt = null;
  function Vn(n) {
    if (n = rt(n)) {
      if (typeof Tt != "function") throw Error(b(280));
      var r = n.stateNode;
      r && (r = wn(r), Tt(n.stateNode, n.type, r));
    }
  }
  function fr(n) {
    Ut ? zt ? zt.push(n) : zt = [n] : Ut = n;
  }
  function to() {
    if (Ut) {
      var n = Ut, r = zt;
      if (zt = Ut = null, Vn(n), r) for (n = 0; n < r.length; n++) Vn(r[n]);
    }
  }
  function no(n, r) {
    return n(r);
  }
  function vl() {
  }
  var hl = !1;
  function ro(n, r, l) {
    if (hl) return n(r, l);
    hl = !0;
    try {
      return no(n, r, l);
    } finally {
      hl = !1, (Ut !== null || zt !== null) && (vl(), to());
    }
  }
  function Mr(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var u = wn(l);
    if (u === null) return null;
    l = u[r];
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
        (u = !u.disabled) || (n = n.type, u = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !u;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (l && typeof l != "function") throw Error(b(231, r, typeof l));
    return l;
  }
  var Ar = !1;
  if (ae) try {
    var dr = {};
    Object.defineProperty(dr, "passive", { get: function() {
      Ar = !0;
    } }), window.addEventListener("test", dr, dr), window.removeEventListener("test", dr, dr);
  } catch {
    Ar = !1;
  }
  function pi(n, r, l, u, c, d, y, w, k) {
    var Q = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, Q);
    } catch (me) {
      this.onError(me);
    }
  }
  var qa = !1, vi = null, hi = !1, _ = null, ce = { onError: function(n) {
    qa = !0, vi = n;
  } };
  function Ae(n, r, l, u, c, d, y, w, k) {
    qa = !1, vi = null, pi.apply(ce, arguments);
  }
  function Qe(n, r, l, u, c, d, y, w, k) {
    if (Ae.apply(this, arguments), qa) {
      if (qa) {
        var Q = vi;
        qa = !1, vi = null;
      } else throw Error(b(198));
      hi || (hi = !0, _ = Q);
    }
  }
  function xt(n) {
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
  function yt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Mt(n) {
    if (xt(n) !== n) throw Error(b(188));
  }
  function Ot(n) {
    var r = n.alternate;
    if (!r) {
      if (r = xt(n), r === null) throw Error(b(188));
      return r !== n ? null : n;
    }
    for (var l = n, u = r; ; ) {
      var c = l.return;
      if (c === null) break;
      var d = c.alternate;
      if (d === null) {
        if (u = c.return, u !== null) {
          l = u;
          continue;
        }
        break;
      }
      if (c.child === d.child) {
        for (d = c.child; d; ) {
          if (d === l) return Mt(c), n;
          if (d === u) return Mt(c), r;
          d = d.sibling;
        }
        throw Error(b(188));
      }
      if (l.return !== u.return) l = c, u = d;
      else {
        for (var y = !1, w = c.child; w; ) {
          if (w === l) {
            y = !0, l = c, u = d;
            break;
          }
          if (w === u) {
            y = !0, u = c, l = d;
            break;
          }
          w = w.sibling;
        }
        if (!y) {
          for (w = d.child; w; ) {
            if (w === l) {
              y = !0, l = d, u = c;
              break;
            }
            if (w === u) {
              y = !0, u = d, l = c;
              break;
            }
            w = w.sibling;
          }
          if (!y) throw Error(b(189));
        }
      }
      if (l.alternate !== u) throw Error(b(190));
    }
    if (l.tag !== 3) throw Error(b(188));
    return l.stateNode.current === l ? n : r;
  }
  function Ln(n) {
    return n = Ot(n), n !== null ? dn(n) : null;
  }
  function dn(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = dn(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var mn = E.unstable_scheduleCallback, pr = E.unstable_cancelCallback, Xa = E.unstable_shouldYield, Ja = E.unstable_requestPaint, bt = E.unstable_now, kt = E.unstable_getCurrentPriorityLevel, Za = E.unstable_ImmediatePriority, ao = E.unstable_UserBlockingPriority, io = E.unstable_NormalPriority, ml = E.unstable_LowPriority, qo = E.unstable_IdlePriority, yl = null, Jr = null;
  function Wu(n) {
    if (Jr && typeof Jr.onCommitFiberRoot == "function") try {
      Jr.onCommitFiberRoot(yl, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var zr = Math.clz32 ? Math.clz32 : Xo, sc = Math.log, cc = Math.LN2;
  function Xo(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (sc(n) / cc | 0) | 0;
  }
  var gl = 64, ya = 4194304;
  function ei(n) {
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
  function ti(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var u = 0, c = n.suspendedLanes, d = n.pingedLanes, y = l & 268435455;
    if (y !== 0) {
      var w = y & ~c;
      w !== 0 ? u = ei(w) : (d &= y, d !== 0 && (u = ei(d)));
    } else y = l & ~c, y !== 0 ? u = ei(y) : d !== 0 && (u = ei(d));
    if (u === 0) return 0;
    if (r !== 0 && r !== u && !(r & c) && (c = u & -u, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if (u & 4 && (u |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= u; 0 < r; ) l = 31 - zr(r), c = 1 << l, u |= n[l], r &= ~c;
    return u;
  }
  function Jo(n, r) {
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
  function lo(n, r) {
    for (var l = n.suspendedLanes, u = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var y = 31 - zr(d), w = 1 << y, k = c[y];
      k === -1 ? (!(w & l) || w & u) && (c[y] = Jo(w, r)) : k <= r && (n.expiredLanes |= w), d &= ~w;
    }
  }
  function Sl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Zo() {
    var n = gl;
    return gl <<= 1, !(gl & 4194240) && (gl = 64), n;
  }
  function eu(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Hi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - zr(r), n[r] = l;
  }
  function qf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var u = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - zr(l), d = 1 << c;
      r[c] = 0, u[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Vi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var u = 31 - zr(l), c = 1 << u;
      c & r | n[u] & r && (n[u] |= r), l &= ~c;
    }
  }
  var qt = 0;
  function tu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Qt, Gu, mi, ht, nu, vr = !1, yi = [], Ur = null, gi = null, yn = null, an = /* @__PURE__ */ new Map(), El = /* @__PURE__ */ new Map(), Zn = [], Fr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Na(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Ur = null;
        break;
      case "dragenter":
      case "dragleave":
        gi = null;
        break;
      case "mouseover":
      case "mouseout":
        yn = null;
        break;
      case "pointerover":
      case "pointerout":
        an.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        El.delete(r.pointerId);
    }
  }
  function oo(n, r, l, u, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: u, nativeEvent: d, targetContainers: [c] }, r !== null && (r = rt(r), r !== null && Gu(r)), n) : (n.eventSystemFlags |= u, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Ku(n, r, l, u, c) {
    switch (r) {
      case "focusin":
        return Ur = oo(Ur, n, r, l, u, c), !0;
      case "dragenter":
        return gi = oo(gi, n, r, l, u, c), !0;
      case "mouseover":
        return yn = oo(yn, n, r, l, u, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return an.set(d, oo(an.get(d) || null, n, r, l, u, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, El.set(d, oo(El.get(d) || null, n, r, l, u, c)), !0;
    }
    return !1;
  }
  function qu(n) {
    var r = yo(n.target);
    if (r !== null) {
      var l = xt(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = yt(l), r !== null) {
            n.blockedOn = r, nu(n.priority, function() {
              mi(l);
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
  function Cl(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = iu(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var u = new l.constructor(l.type, l);
        Nt = u, l.target.dispatchEvent(u), Nt = null;
      } else return r = rt(l), r !== null && Gu(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function uo(n, r, l) {
    Cl(n) && l.delete(r);
  }
  function Xf() {
    vr = !1, Ur !== null && Cl(Ur) && (Ur = null), gi !== null && Cl(gi) && (gi = null), yn !== null && Cl(yn) && (yn = null), an.forEach(uo), El.forEach(uo);
  }
  function ja(n, r) {
    n.blockedOn === r && (n.blockedOn = null, vr || (vr = !0, E.unstable_scheduleCallback(E.unstable_NormalPriority, Xf)));
  }
  function ni(n) {
    function r(c) {
      return ja(c, n);
    }
    if (0 < yi.length) {
      ja(yi[0], n);
      for (var l = 1; l < yi.length; l++) {
        var u = yi[l];
        u.blockedOn === n && (u.blockedOn = null);
      }
    }
    for (Ur !== null && ja(Ur, n), gi !== null && ja(gi, n), yn !== null && ja(yn, n), an.forEach(r), El.forEach(r), l = 0; l < Zn.length; l++) u = Zn[l], u.blockedOn === n && (u.blockedOn = null);
    for (; 0 < Zn.length && (l = Zn[0], l.blockedOn === null); ) qu(l), l.blockedOn === null && Zn.shift();
  }
  var Si = Se.ReactCurrentBatchConfig, Oa = !0;
  function ru(n, r, l, u) {
    var c = qt, d = Si.transition;
    Si.transition = null;
    try {
      qt = 1, xl(n, r, l, u);
    } finally {
      qt = c, Si.transition = d;
    }
  }
  function au(n, r, l, u) {
    var c = qt, d = Si.transition;
    Si.transition = null;
    try {
      qt = 4, xl(n, r, l, u);
    } finally {
      qt = c, Si.transition = d;
    }
  }
  function xl(n, r, l, u) {
    if (Oa) {
      var c = iu(n, r, l, u);
      if (c === null) xc(n, r, u, so, l), Na(n, u);
      else if (Ku(c, n, r, l, u)) u.stopPropagation();
      else if (Na(n, u), r & 4 && -1 < Fr.indexOf(n)) {
        for (; c !== null; ) {
          var d = rt(c);
          if (d !== null && Qt(d), d = iu(n, r, l, u), d === null && xc(n, r, u, so, l), d === c) break;
          c = d;
        }
        c !== null && u.stopPropagation();
      } else xc(n, r, u, null, l);
    }
  }
  var so = null;
  function iu(n, r, l, u) {
    if (so = null, n = jt(u), n = yo(n), n !== null) if (r = xt(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = yt(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return so = n, null;
  }
  function lu(n) {
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
        switch (kt()) {
          case Za:
            return 1;
          case ao:
            return 4;
          case io:
          case ml:
            return 16;
          case qo:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ri = null, m = null, R = null;
  function Y() {
    if (R) return R;
    var n, r = m, l = r.length, u, c = "value" in ri ? ri.value : ri.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var y = l - n;
    for (u = 1; u <= y && r[l - u] === c[d - u]; u++) ;
    return R = c.slice(n, 1 < u ? 1 - u : void 0);
  }
  function K(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function we() {
    return !0;
  }
  function it() {
    return !1;
  }
  function Ne(n) {
    function r(l, u, c, d, y) {
      this._reactName = l, this._targetInst = c, this.type = u, this.nativeEvent = d, this.target = y, this.currentTarget = null;
      for (var w in n) n.hasOwnProperty(w) && (l = n[w], this[w] = l ? l(d) : d[w]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? we : it, this.isPropagationStopped = it, this;
    }
    return Re(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = we);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = we);
    }, persist: function() {
    }, isPersistent: we }), r;
  }
  var ut = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, At = Ne(ut), Wt = Re({}, ut, { view: 0, detail: 0 }), pn = Ne(Wt), ln, Dt, on, bn = Re({}, Wt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: nd, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== on && (on && n.type === "mousemove" ? (ln = n.screenX - on.screenX, Dt = n.screenY - on.screenY) : Dt = ln = 0, on = n), ln);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : Dt;
  } }), bl = Ne(bn), Xu = Re({}, bn, { dataTransfer: 0 }), Bi = Ne(Xu), Ju = Re({}, Wt, { relatedTarget: 0 }), co = Ne(Ju), Jf = Re({}, ut, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), fc = Ne(Jf), Zf = Re({}, ut, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), uv = Ne(Zf), ed = Re({}, ut, { data: 0 }), td = Ne(ed), sv = {
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
  }, cv = {
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
  }, ay = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ay[n]) ? !!r[n] : !1;
  }
  function nd() {
    return Ii;
  }
  var rd = Re({}, Wt, { key: function(n) {
    if (n.key) {
      var r = sv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = K(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? cv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: nd, charCode: function(n) {
    return n.type === "keypress" ? K(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? K(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), ad = Ne(rd), id = Re({}, bn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), fv = Ne(id), dc = Re({}, Wt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: nd }), dv = Ne(dc), Zr = Re({}, ut, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), $i = Ne(Zr), Bn = Re({}, bn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Yi = Ne(Bn), ld = [9, 13, 27, 32], ou = ae && "CompositionEvent" in window, Zu = null;
  ae && "documentMode" in document && (Zu = document.documentMode);
  var es = ae && "TextEvent" in window && !Zu, pv = ae && (!ou || Zu && 8 < Zu && 11 >= Zu), vv = " ", pc = !1;
  function hv(n, r) {
    switch (n) {
      case "keyup":
        return ld.indexOf(r.keyCode) !== -1;
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
  function mv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var uu = !1;
  function yv(n, r) {
    switch (n) {
      case "compositionend":
        return mv(r);
      case "keypress":
        return r.which !== 32 ? null : (pc = !0, vv);
      case "textInput":
        return n = r.data, n === vv && pc ? null : n;
      default:
        return null;
    }
  }
  function iy(n, r) {
    if (uu) return n === "compositionend" || !ou && hv(n, r) ? (n = Y(), R = m = ri = null, uu = !1, n) : null;
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
        return pv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var ly = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function gv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!ly[n.type] : r === "textarea";
  }
  function od(n, r, l, u) {
    fr(u), r = ls(r, "onChange"), 0 < r.length && (l = new At("onChange", "change", null, l, u), n.push({ event: l, listeners: r }));
  }
  var Ei = null, fo = null;
  function Sv(n) {
    ho(n, 0);
  }
  function ts(n) {
    var r = ii(n);
    if (Hn(r)) return n;
  }
  function oy(n, r) {
    if (n === "change") return r;
  }
  var Ev = !1;
  if (ae) {
    var ud;
    if (ae) {
      var sd = "oninput" in document;
      if (!sd) {
        var Cv = document.createElement("div");
        Cv.setAttribute("oninput", "return;"), sd = typeof Cv.oninput == "function";
      }
      ud = sd;
    } else ud = !1;
    Ev = ud && (!document.documentMode || 9 < document.documentMode);
  }
  function xv() {
    Ei && (Ei.detachEvent("onpropertychange", bv), fo = Ei = null);
  }
  function bv(n) {
    if (n.propertyName === "value" && ts(fo)) {
      var r = [];
      od(r, fo, n, jt(n)), ro(Sv, r);
    }
  }
  function uy(n, r, l) {
    n === "focusin" ? (xv(), Ei = r, fo = l, Ei.attachEvent("onpropertychange", bv)) : n === "focusout" && xv();
  }
  function wv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return ts(fo);
  }
  function sy(n, r) {
    if (n === "click") return ts(r);
  }
  function Tv(n, r) {
    if (n === "input" || n === "change") return ts(r);
  }
  function cy(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ai = typeof Object.is == "function" ? Object.is : cy;
  function ns(n, r) {
    if (ai(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), u = Object.keys(r);
    if (l.length !== u.length) return !1;
    for (u = 0; u < l.length; u++) {
      var c = l[u];
      if (!L.call(r, c) || !ai(n[c], r[c])) return !1;
    }
    return !0;
  }
  function Rv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function vc(n, r) {
    var l = Rv(n);
    n = 0;
    for (var u; l; ) {
      if (l.nodeType === 3) {
        if (u = n + l.textContent.length, n <= r && u >= r) return { node: l, offset: r - n };
        n = u;
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
      l = Rv(l);
    }
  }
  function wl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? wl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function rs() {
    for (var n = window, r = hn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = hn(n.document);
    }
    return r;
  }
  function hc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function su(n) {
    var r = rs(), l = n.focusedElem, u = n.selectionRange;
    if (r !== l && l && l.ownerDocument && wl(l.ownerDocument.documentElement, l)) {
      if (u !== null && hc(l)) {
        if (r = u.start, n = u.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(u.start, c);
          u = u.end === void 0 ? d : Math.min(u.end, c), !n.extend && d > u && (c = u, u = d, d = c), c = vc(l, d);
          var y = vc(
            l,
            u
          );
          c && y && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== y.node || n.focusOffset !== y.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), d > u ? (n.addRange(r), n.extend(y.node, y.offset)) : (r.setEnd(y.node, y.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++) n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var fy = ae && "documentMode" in document && 11 >= document.documentMode, cu = null, cd = null, as = null, fd = !1;
  function dd(n, r, l) {
    var u = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    fd || cu == null || cu !== hn(u) || (u = cu, "selectionStart" in u && hc(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = { anchorNode: u.anchorNode, anchorOffset: u.anchorOffset, focusNode: u.focusNode, focusOffset: u.focusOffset }), as && ns(as, u) || (as = u, u = ls(cd, "onSelect"), 0 < u.length && (r = new At("onSelect", "select", null, r, l), n.push({ event: r, listeners: u }), r.target = cu)));
  }
  function mc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var po = { animationend: mc("Animation", "AnimationEnd"), animationiteration: mc("Animation", "AnimationIteration"), animationstart: mc("Animation", "AnimationStart"), transitionend: mc("Transition", "TransitionEnd") }, hr = {}, pd = {};
  ae && (pd = document.createElement("div").style, "AnimationEvent" in window || (delete po.animationend.animation, delete po.animationiteration.animation, delete po.animationstart.animation), "TransitionEvent" in window || delete po.transitionend.transition);
  function yc(n) {
    if (hr[n]) return hr[n];
    if (!po[n]) return n;
    var r = po[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in pd) return hr[n] = r[l];
    return n;
  }
  var _v = yc("animationend"), kv = yc("animationiteration"), Dv = yc("animationstart"), Nv = yc("transitionend"), vd = /* @__PURE__ */ new Map(), gc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function La(n, r) {
    vd.set(n, r), D(r, [n]);
  }
  for (var hd = 0; hd < gc.length; hd++) {
    var vo = gc[hd], dy = vo.toLowerCase(), py = vo[0].toUpperCase() + vo.slice(1);
    La(dy, "on" + py);
  }
  La(_v, "onAnimationEnd"), La(kv, "onAnimationIteration"), La(Dv, "onAnimationStart"), La("dblclick", "onDoubleClick"), La("focusin", "onFocus"), La("focusout", "onBlur"), La(Nv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), D("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), D("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), D("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), D("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), D("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), D("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var is = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), md = new Set("cancel close invalid load scroll toggle".split(" ").concat(is));
  function Sc(n, r, l) {
    var u = n.type || "unknown-event";
    n.currentTarget = l, Qe(u, r, void 0, n), n.currentTarget = null;
  }
  function ho(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var u = n[l], c = u.event;
      u = u.listeners;
      e: {
        var d = void 0;
        if (r) for (var y = u.length - 1; 0 <= y; y--) {
          var w = u[y], k = w.instance, Q = w.currentTarget;
          if (w = w.listener, k !== d && c.isPropagationStopped()) break e;
          Sc(c, w, Q), d = k;
        }
        else for (y = 0; y < u.length; y++) {
          if (w = u[y], k = w.instance, Q = w.currentTarget, w = w.listener, k !== d && c.isPropagationStopped()) break e;
          Sc(c, w, Q), d = k;
        }
      }
    }
    if (hi) throw n = _, hi = !1, _ = null, n;
  }
  function nn(n, r) {
    var l = r[ss];
    l === void 0 && (l = r[ss] = /* @__PURE__ */ new Set());
    var u = n + "__bubble";
    l.has(u) || (jv(r, n, 2, !1), l.add(u));
  }
  function Ec(n, r, l) {
    var u = 0;
    r && (u |= 4), jv(l, n, u, r);
  }
  var Cc = "_reactListening" + Math.random().toString(36).slice(2);
  function fu(n) {
    if (!n[Cc]) {
      n[Cc] = !0, q.forEach(function(l) {
        l !== "selectionchange" && (md.has(l) || Ec(l, !1, n), Ec(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Cc] || (r[Cc] = !0, Ec("selectionchange", !1, r));
    }
  }
  function jv(n, r, l, u) {
    switch (lu(r)) {
      case 1:
        var c = ru;
        break;
      case 4:
        c = au;
        break;
      default:
        c = xl;
    }
    l = c.bind(null, r, l, n), c = void 0, !Ar || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), u ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function xc(n, r, l, u, c) {
    var d = u;
    if (!(r & 1) && !(r & 2) && u !== null) e: for (; ; ) {
      if (u === null) return;
      var y = u.tag;
      if (y === 3 || y === 4) {
        var w = u.stateNode.containerInfo;
        if (w === c || w.nodeType === 8 && w.parentNode === c) break;
        if (y === 4) for (y = u.return; y !== null; ) {
          var k = y.tag;
          if ((k === 3 || k === 4) && (k = y.stateNode.containerInfo, k === c || k.nodeType === 8 && k.parentNode === c)) return;
          y = y.return;
        }
        for (; w !== null; ) {
          if (y = yo(w), y === null) return;
          if (k = y.tag, k === 5 || k === 6) {
            u = d = y;
            continue e;
          }
          w = w.parentNode;
        }
      }
      u = u.return;
    }
    ro(function() {
      var Q = d, me = jt(l), Ce = [];
      e: {
        var ve = vd.get(n);
        if (ve !== void 0) {
          var He = At, We = n;
          switch (n) {
            case "keypress":
              if (K(l) === 0) break e;
            case "keydown":
            case "keyup":
              He = ad;
              break;
            case "focusin":
              We = "focus", He = co;
              break;
            case "focusout":
              We = "blur", He = co;
              break;
            case "beforeblur":
            case "afterblur":
              He = co;
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
              He = bl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              He = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              He = dv;
              break;
            case _v:
            case kv:
            case Dv:
              He = fc;
              break;
            case Nv:
              He = $i;
              break;
            case "scroll":
              He = pn;
              break;
            case "wheel":
              He = Yi;
              break;
            case "copy":
            case "cut":
            case "paste":
              He = uv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              He = fv;
          }
          var qe = (r & 4) !== 0, Fn = !qe && n === "scroll", F = qe ? ve !== null ? ve + "Capture" : null : ve;
          qe = [];
          for (var j = Q, I; j !== null; ) {
            I = j;
            var ye = I.stateNode;
            if (I.tag === 5 && ye !== null && (I = ye, F !== null && (ye = Mr(j, F), ye != null && qe.push(du(j, ye, I)))), Fn) break;
            j = j.return;
          }
          0 < qe.length && (ve = new He(ve, We, null, l, me), Ce.push({ event: ve, listeners: qe }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (ve = n === "mouseover" || n === "pointerover", He = n === "mouseout" || n === "pointerout", ve && l !== Nt && (We = l.relatedTarget || l.fromElement) && (yo(We) || We[Qi])) break e;
          if ((He || ve) && (ve = me.window === me ? me : (ve = me.ownerDocument) ? ve.defaultView || ve.parentWindow : window, He ? (We = l.relatedTarget || l.toElement, He = Q, We = We ? yo(We) : null, We !== null && (Fn = xt(We), We !== Fn || We.tag !== 5 && We.tag !== 6) && (We = null)) : (He = null, We = Q), He !== We)) {
            if (qe = bl, ye = "onMouseLeave", F = "onMouseEnter", j = "mouse", (n === "pointerout" || n === "pointerover") && (qe = fv, ye = "onPointerLeave", F = "onPointerEnter", j = "pointer"), Fn = He == null ? ve : ii(He), I = We == null ? ve : ii(We), ve = new qe(ye, j + "leave", He, l, me), ve.target = Fn, ve.relatedTarget = I, ye = null, yo(me) === Q && (qe = new qe(F, j + "enter", We, l, me), qe.target = I, qe.relatedTarget = Fn, ye = qe), Fn = ye, He && We) t: {
              for (qe = He, F = We, j = 0, I = qe; I; I = Tl(I)) j++;
              for (I = 0, ye = F; ye; ye = Tl(ye)) I++;
              for (; 0 < j - I; ) qe = Tl(qe), j--;
              for (; 0 < I - j; ) F = Tl(F), I--;
              for (; j--; ) {
                if (qe === F || F !== null && qe === F.alternate) break t;
                qe = Tl(qe), F = Tl(F);
              }
              qe = null;
            }
            else qe = null;
            He !== null && Ov(Ce, ve, He, qe, !1), We !== null && Fn !== null && Ov(Ce, Fn, We, qe, !0);
          }
        }
        e: {
          if (ve = Q ? ii(Q) : window, He = ve.nodeName && ve.nodeName.toLowerCase(), He === "select" || He === "input" && ve.type === "file") var Ge = oy;
          else if (gv(ve)) if (Ev) Ge = Tv;
          else {
            Ge = wv;
            var ot = uy;
          }
          else (He = ve.nodeName) && He.toLowerCase() === "input" && (ve.type === "checkbox" || ve.type === "radio") && (Ge = sy);
          if (Ge && (Ge = Ge(n, Q))) {
            od(Ce, Ge, l, me);
            break e;
          }
          ot && ot(n, ve, Q), n === "focusout" && (ot = ve._wrapperState) && ot.controlled && ve.type === "number" && _r(ve, "number", ve.value);
        }
        switch (ot = Q ? ii(Q) : window, n) {
          case "focusin":
            (gv(ot) || ot.contentEditable === "true") && (cu = ot, cd = Q, as = null);
            break;
          case "focusout":
            as = cd = cu = null;
            break;
          case "mousedown":
            fd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            fd = !1, dd(Ce, l, me);
            break;
          case "selectionchange":
            if (fy) break;
          case "keydown":
          case "keyup":
            dd(Ce, l, me);
        }
        var st;
        if (ou) e: {
          switch (n) {
            case "compositionstart":
              var dt = "onCompositionStart";
              break e;
            case "compositionend":
              dt = "onCompositionEnd";
              break e;
            case "compositionupdate":
              dt = "onCompositionUpdate";
              break e;
          }
          dt = void 0;
        }
        else uu ? hv(n, l) && (dt = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (dt = "onCompositionStart");
        dt && (pv && l.locale !== "ko" && (uu || dt !== "onCompositionStart" ? dt === "onCompositionEnd" && uu && (st = Y()) : (ri = me, m = "value" in ri ? ri.value : ri.textContent, uu = !0)), ot = ls(Q, dt), 0 < ot.length && (dt = new td(dt, n, null, l, me), Ce.push({ event: dt, listeners: ot }), st ? dt.data = st : (st = mv(l), st !== null && (dt.data = st)))), (st = es ? yv(n, l) : iy(n, l)) && (Q = ls(Q, "onBeforeInput"), 0 < Q.length && (me = new td("onBeforeInput", "beforeinput", null, l, me), Ce.push({ event: me, listeners: Q }), me.data = st));
      }
      ho(Ce, r);
    });
  }
  function du(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function ls(n, r) {
    for (var l = r + "Capture", u = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = Mr(n, l), d != null && u.unshift(du(n, d, c)), d = Mr(n, r), d != null && u.push(du(n, d, c))), n = n.return;
    }
    return u;
  }
  function Tl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function Ov(n, r, l, u, c) {
    for (var d = r._reactName, y = []; l !== null && l !== u; ) {
      var w = l, k = w.alternate, Q = w.stateNode;
      if (k !== null && k === u) break;
      w.tag === 5 && Q !== null && (w = Q, c ? (k = Mr(l, d), k != null && y.unshift(du(l, k, w))) : c || (k = Mr(l, d), k != null && y.push(du(l, k, w)))), l = l.return;
    }
    y.length !== 0 && n.push({ event: r, listeners: y });
  }
  var Lv = /\r\n?/g, vy = /\u0000|\uFFFD/g;
  function Mv(n) {
    return (typeof n == "string" ? n : "" + n).replace(Lv, `
`).replace(vy, "");
  }
  function bc(n, r, l) {
    if (r = Mv(r), Mv(n) !== r && l) throw Error(b(425));
  }
  function Rl() {
  }
  var os = null, mo = null;
  function wc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Tc = typeof setTimeout == "function" ? setTimeout : void 0, yd = typeof clearTimeout == "function" ? clearTimeout : void 0, Av = typeof Promise == "function" ? Promise : void 0, pu = typeof queueMicrotask == "function" ? queueMicrotask : typeof Av < "u" ? function(n) {
    return Av.resolve(null).then(n).catch(Rc);
  } : Tc;
  function Rc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function vu(n, r) {
    var l = r, u = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8) if (l = c.data, l === "/$") {
        if (u === 0) {
          n.removeChild(c), ni(r);
          return;
        }
        u--;
      } else l !== "$" && l !== "$?" && l !== "$!" || u++;
      l = c;
    } while (l);
    ni(r);
  }
  function Ci(n) {
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
  function zv(n) {
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
  var _l = Math.random().toString(36).slice(2), xi = "__reactFiber$" + _l, us = "__reactProps$" + _l, Qi = "__reactContainer$" + _l, ss = "__reactEvents$" + _l, hu = "__reactListeners$" + _l, hy = "__reactHandles$" + _l;
  function yo(n) {
    var r = n[xi];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Qi] || l[xi]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = zv(n); n !== null; ) {
          if (l = n[xi]) return l;
          n = zv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function rt(n) {
    return n = n[xi] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ii(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(b(33));
  }
  function wn(n) {
    return n[us] || null;
  }
  var Bt = [], Ma = -1;
  function Aa(n) {
    return { current: n };
  }
  function vn(n) {
    0 > Ma || (n.current = Bt[Ma], Bt[Ma] = null, Ma--);
  }
  function et(n, r) {
    Ma++, Bt[Ma] = n.current, n.current = r;
  }
  var kr = {}, jn = Aa(kr), er = Aa(!1), ea = kr;
  function ta(n, r) {
    var l = n.type.contextTypes;
    if (!l) return kr;
    var u = n.stateNode;
    if (u && u.__reactInternalMemoizedUnmaskedChildContext === r) return u.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function In(n) {
    return n = n.childContextTypes, n != null;
  }
  function mu() {
    vn(er), vn(jn);
  }
  function Uv(n, r, l) {
    if (jn.current !== kr) throw Error(b(168));
    et(jn, r), et(er, l);
  }
  function cs(n, r, l) {
    var u = n.stateNode;
    if (r = r.childContextTypes, typeof u.getChildContext != "function") return l;
    u = u.getChildContext();
    for (var c in u) if (!(c in r)) throw Error(b(108, mt(n) || "Unknown", c));
    return Re({}, l, u);
  }
  function ir(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || kr, ea = jn.current, et(jn, n), et(er, er.current), !0;
  }
  function _c(n, r, l) {
    var u = n.stateNode;
    if (!u) throw Error(b(169));
    l ? (n = cs(n, r, ea), u.__reactInternalMemoizedMergedChildContext = n, vn(er), vn(jn), et(jn, n)) : vn(er), et(er, l);
  }
  var bi = null, yu = !1, Wi = !1;
  function kc(n) {
    bi === null ? bi = [n] : bi.push(n);
  }
  function kl(n) {
    yu = !0, kc(n);
  }
  function wi() {
    if (!Wi && bi !== null) {
      Wi = !0;
      var n = 0, r = qt;
      try {
        var l = bi;
        for (qt = 1; n < l.length; n++) {
          var u = l[n];
          do
            u = u(!0);
          while (u !== null);
        }
        bi = null, yu = !1;
      } catch (c) {
        throw bi !== null && (bi = bi.slice(n + 1)), mn(Za, wi), c;
      } finally {
        qt = r, Wi = !1;
      }
    }
    return null;
  }
  var Dl = [], Nl = 0, jl = null, Gi = 0, $n = [], za = 0, ga = null, Ti = 1, Ri = "";
  function go(n, r) {
    Dl[Nl++] = Gi, Dl[Nl++] = jl, jl = n, Gi = r;
  }
  function Fv(n, r, l) {
    $n[za++] = Ti, $n[za++] = Ri, $n[za++] = ga, ga = n;
    var u = Ti;
    n = Ri;
    var c = 32 - zr(u) - 1;
    u &= ~(1 << c), l += 1;
    var d = 32 - zr(r) + c;
    if (30 < d) {
      var y = c - c % 5;
      d = (u & (1 << y) - 1).toString(32), u >>= y, c -= y, Ti = 1 << 32 - zr(r) + c | l << c | u, Ri = d + n;
    } else Ti = 1 << d | l << c | u, Ri = n;
  }
  function Dc(n) {
    n.return !== null && (go(n, 1), Fv(n, 1, 0));
  }
  function Nc(n) {
    for (; n === jl; ) jl = Dl[--Nl], Dl[Nl] = null, Gi = Dl[--Nl], Dl[Nl] = null;
    for (; n === ga; ) ga = $n[--za], $n[za] = null, Ri = $n[--za], $n[za] = null, Ti = $n[--za], $n[za] = null;
  }
  var na = null, ra = null, Sn = !1, Ua = null;
  function gd(n, r) {
    var l = Ba(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Pv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, na = n, ra = Ci(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, na = n, ra = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = ga !== null ? { id: Ti, overflow: Ri } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Ba(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, na = n, ra = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Sd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Ed(n) {
    if (Sn) {
      var r = ra;
      if (r) {
        var l = r;
        if (!Pv(n, r)) {
          if (Sd(n)) throw Error(b(418));
          r = Ci(l.nextSibling);
          var u = na;
          r && Pv(n, r) ? gd(u, l) : (n.flags = n.flags & -4097 | 2, Sn = !1, na = n);
        }
      } else {
        if (Sd(n)) throw Error(b(418));
        n.flags = n.flags & -4097 | 2, Sn = !1, na = n;
      }
    }
  }
  function tr(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    na = n;
  }
  function jc(n) {
    if (n !== na) return !1;
    if (!Sn) return tr(n), Sn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !wc(n.type, n.memoizedProps)), r && (r = ra)) {
      if (Sd(n)) throw fs(), Error(b(418));
      for (; r; ) gd(n, r), r = Ci(r.nextSibling);
    }
    if (tr(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(b(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                ra = Ci(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        ra = null;
      }
    } else ra = na ? Ci(n.stateNode.nextSibling) : null;
    return !0;
  }
  function fs() {
    for (var n = ra; n; ) n = Ci(n.nextSibling);
  }
  function Ol() {
    ra = na = null, Sn = !1;
  }
  function Ki(n) {
    Ua === null ? Ua = [n] : Ua.push(n);
  }
  var my = Se.ReactCurrentBatchConfig;
  function So(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(b(309));
          var u = l.stateNode;
        }
        if (!u) throw Error(b(147, n));
        var c = u, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(y) {
          var w = c.refs;
          y === null ? delete w[d] : w[d] = y;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(b(284));
      if (!l._owner) throw Error(b(290, n));
    }
    return n;
  }
  function Oc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(b(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Hv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function Eo(n) {
    function r(F, j) {
      if (n) {
        var I = F.deletions;
        I === null ? (F.deletions = [j], F.flags |= 16) : I.push(j);
      }
    }
    function l(F, j) {
      if (!n) return null;
      for (; j !== null; ) r(F, j), j = j.sibling;
      return null;
    }
    function u(F, j) {
      for (F = /* @__PURE__ */ new Map(); j !== null; ) j.key !== null ? F.set(j.key, j) : F.set(j.index, j), j = j.sibling;
      return F;
    }
    function c(F, j) {
      return F = Hl(F, j), F.index = 0, F.sibling = null, F;
    }
    function d(F, j, I) {
      return F.index = I, n ? (I = F.alternate, I !== null ? (I = I.index, I < j ? (F.flags |= 2, j) : I) : (F.flags |= 2, j)) : (F.flags |= 1048576, j);
    }
    function y(F) {
      return n && F.alternate === null && (F.flags |= 2), F;
    }
    function w(F, j, I, ye) {
      return j === null || j.tag !== 6 ? (j = Xd(I, F.mode, ye), j.return = F, j) : (j = c(j, I), j.return = F, j);
    }
    function k(F, j, I, ye) {
      var Ge = I.type;
      return Ge === U ? me(F, j, I.props.children, ye, I.key) : j !== null && (j.elementType === Ge || typeof Ge == "object" && Ge !== null && Ge.$$typeof === pt && Hv(Ge) === j.type) ? (ye = c(j, I.props), ye.ref = So(F, j, I), ye.return = F, ye) : (ye = Vs(I.type, I.key, I.props, null, F.mode, ye), ye.ref = So(F, j, I), ye.return = F, ye);
    }
    function Q(F, j, I, ye) {
      return j === null || j.tag !== 4 || j.stateNode.containerInfo !== I.containerInfo || j.stateNode.implementation !== I.implementation ? (j = df(I, F.mode, ye), j.return = F, j) : (j = c(j, I.children || []), j.return = F, j);
    }
    function me(F, j, I, ye, Ge) {
      return j === null || j.tag !== 7 ? (j = tl(I, F.mode, ye, Ge), j.return = F, j) : (j = c(j, I), j.return = F, j);
    }
    function Ce(F, j, I) {
      if (typeof j == "string" && j !== "" || typeof j == "number") return j = Xd("" + j, F.mode, I), j.return = F, j;
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case le:
            return I = Vs(j.type, j.key, j.props, null, F.mode, I), I.ref = So(F, null, j), I.return = F, I;
          case se:
            return j = df(j, F.mode, I), j.return = F, j;
          case pt:
            var ye = j._init;
            return Ce(F, ye(j._payload), I);
        }
        if (Dn(j) || Be(j)) return j = tl(j, F.mode, I, null), j.return = F, j;
        Oc(F, j);
      }
      return null;
    }
    function ve(F, j, I, ye) {
      var Ge = j !== null ? j.key : null;
      if (typeof I == "string" && I !== "" || typeof I == "number") return Ge !== null ? null : w(F, j, "" + I, ye);
      if (typeof I == "object" && I !== null) {
        switch (I.$$typeof) {
          case le:
            return I.key === Ge ? k(F, j, I, ye) : null;
          case se:
            return I.key === Ge ? Q(F, j, I, ye) : null;
          case pt:
            return Ge = I._init, ve(
              F,
              j,
              Ge(I._payload),
              ye
            );
        }
        if (Dn(I) || Be(I)) return Ge !== null ? null : me(F, j, I, ye, null);
        Oc(F, I);
      }
      return null;
    }
    function He(F, j, I, ye, Ge) {
      if (typeof ye == "string" && ye !== "" || typeof ye == "number") return F = F.get(I) || null, w(j, F, "" + ye, Ge);
      if (typeof ye == "object" && ye !== null) {
        switch (ye.$$typeof) {
          case le:
            return F = F.get(ye.key === null ? I : ye.key) || null, k(j, F, ye, Ge);
          case se:
            return F = F.get(ye.key === null ? I : ye.key) || null, Q(j, F, ye, Ge);
          case pt:
            var ot = ye._init;
            return He(F, j, I, ot(ye._payload), Ge);
        }
        if (Dn(ye) || Be(ye)) return F = F.get(I) || null, me(j, F, ye, Ge, null);
        Oc(j, ye);
      }
      return null;
    }
    function We(F, j, I, ye) {
      for (var Ge = null, ot = null, st = j, dt = j = 0, ur = null; st !== null && dt < I.length; dt++) {
        st.index > dt ? (ur = st, st = null) : ur = st.sibling;
        var Zt = ve(F, st, I[dt], ye);
        if (Zt === null) {
          st === null && (st = ur);
          break;
        }
        n && st && Zt.alternate === null && r(F, st), j = d(Zt, j, dt), ot === null ? Ge = Zt : ot.sibling = Zt, ot = Zt, st = ur;
      }
      if (dt === I.length) return l(F, st), Sn && go(F, dt), Ge;
      if (st === null) {
        for (; dt < I.length; dt++) st = Ce(F, I[dt], ye), st !== null && (j = d(st, j, dt), ot === null ? Ge = st : ot.sibling = st, ot = st);
        return Sn && go(F, dt), Ge;
      }
      for (st = u(F, st); dt < I.length; dt++) ur = He(st, F, dt, I[dt], ye), ur !== null && (n && ur.alternate !== null && st.delete(ur.key === null ? dt : ur.key), j = d(ur, j, dt), ot === null ? Ge = ur : ot.sibling = ur, ot = ur);
      return n && st.forEach(function(Il) {
        return r(F, Il);
      }), Sn && go(F, dt), Ge;
    }
    function qe(F, j, I, ye) {
      var Ge = Be(I);
      if (typeof Ge != "function") throw Error(b(150));
      if (I = Ge.call(I), I == null) throw Error(b(151));
      for (var ot = Ge = null, st = j, dt = j = 0, ur = null, Zt = I.next(); st !== null && !Zt.done; dt++, Zt = I.next()) {
        st.index > dt ? (ur = st, st = null) : ur = st.sibling;
        var Il = ve(F, st, Zt.value, ye);
        if (Il === null) {
          st === null && (st = ur);
          break;
        }
        n && st && Il.alternate === null && r(F, st), j = d(Il, j, dt), ot === null ? Ge = Il : ot.sibling = Il, ot = Il, st = ur;
      }
      if (Zt.done) return l(
        F,
        st
      ), Sn && go(F, dt), Ge;
      if (st === null) {
        for (; !Zt.done; dt++, Zt = I.next()) Zt = Ce(F, Zt.value, ye), Zt !== null && (j = d(Zt, j, dt), ot === null ? Ge = Zt : ot.sibling = Zt, ot = Zt);
        return Sn && go(F, dt), Ge;
      }
      for (st = u(F, st); !Zt.done; dt++, Zt = I.next()) Zt = He(st, F, dt, Zt.value, ye), Zt !== null && (n && Zt.alternate !== null && st.delete(Zt.key === null ? dt : Zt.key), j = d(Zt, j, dt), ot === null ? Ge = Zt : ot.sibling = Zt, ot = Zt);
      return n && st.forEach(function(xh) {
        return r(F, xh);
      }), Sn && go(F, dt), Ge;
    }
    function Fn(F, j, I, ye) {
      if (typeof I == "object" && I !== null && I.type === U && I.key === null && (I = I.props.children), typeof I == "object" && I !== null) {
        switch (I.$$typeof) {
          case le:
            e: {
              for (var Ge = I.key, ot = j; ot !== null; ) {
                if (ot.key === Ge) {
                  if (Ge = I.type, Ge === U) {
                    if (ot.tag === 7) {
                      l(F, ot.sibling), j = c(ot, I.props.children), j.return = F, F = j;
                      break e;
                    }
                  } else if (ot.elementType === Ge || typeof Ge == "object" && Ge !== null && Ge.$$typeof === pt && Hv(Ge) === ot.type) {
                    l(F, ot.sibling), j = c(ot, I.props), j.ref = So(F, ot, I), j.return = F, F = j;
                    break e;
                  }
                  l(F, ot);
                  break;
                } else r(F, ot);
                ot = ot.sibling;
              }
              I.type === U ? (j = tl(I.props.children, F.mode, ye, I.key), j.return = F, F = j) : (ye = Vs(I.type, I.key, I.props, null, F.mode, ye), ye.ref = So(F, j, I), ye.return = F, F = ye);
            }
            return y(F);
          case se:
            e: {
              for (ot = I.key; j !== null; ) {
                if (j.key === ot) if (j.tag === 4 && j.stateNode.containerInfo === I.containerInfo && j.stateNode.implementation === I.implementation) {
                  l(F, j.sibling), j = c(j, I.children || []), j.return = F, F = j;
                  break e;
                } else {
                  l(F, j);
                  break;
                }
                else r(F, j);
                j = j.sibling;
              }
              j = df(I, F.mode, ye), j.return = F, F = j;
            }
            return y(F);
          case pt:
            return ot = I._init, Fn(F, j, ot(I._payload), ye);
        }
        if (Dn(I)) return We(F, j, I, ye);
        if (Be(I)) return qe(F, j, I, ye);
        Oc(F, I);
      }
      return typeof I == "string" && I !== "" || typeof I == "number" ? (I = "" + I, j !== null && j.tag === 6 ? (l(F, j.sibling), j = c(j, I), j.return = F, F = j) : (l(F, j), j = Xd(I, F.mode, ye), j.return = F, F = j), y(F)) : l(F, j);
    }
    return Fn;
  }
  var Mn = Eo(!0), ze = Eo(!1), Sa = Aa(null), aa = null, gu = null, Cd = null;
  function xd() {
    Cd = gu = aa = null;
  }
  function bd(n) {
    var r = Sa.current;
    vn(Sa), n._currentValue = r;
  }
  function wd(n, r, l) {
    for (; n !== null; ) {
      var u = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, u !== null && (u.childLanes |= r)) : u !== null && (u.childLanes & r) !== r && (u.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function Tn(n, r) {
    aa = n, Cd = gu = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Qn = !0), n.firstContext = null);
  }
  function Fa(n) {
    var r = n._currentValue;
    if (Cd !== n) if (n = { context: n, memoizedValue: r, next: null }, gu === null) {
      if (aa === null) throw Error(b(308));
      gu = n, aa.dependencies = { lanes: 0, firstContext: n };
    } else gu = gu.next = n;
    return r;
  }
  var Co = null;
  function Td(n) {
    Co === null ? Co = [n] : Co.push(n);
  }
  function Rd(n, r, l, u) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Td(r)) : (l.next = c.next, c.next = l), r.interleaved = l, Ea(n, u);
  }
  function Ea(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Ca = !1;
  function _d(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Vv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function qi(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ll(n, r, l) {
    var u = n.updateQueue;
    if (u === null) return null;
    if (u = u.shared, It & 2) {
      var c = u.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), u.pending = r, Ea(n, l);
    }
    return c = u.interleaved, c === null ? (r.next = r, Td(u)) : (r.next = c.next, c.next = r), u.interleaved = r, Ea(n, l);
  }
  function Lc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, Vi(n, l);
    }
  }
  function Bv(n, r) {
    var l = n.updateQueue, u = n.alternate;
    if (u !== null && (u = u.updateQueue, l === u)) {
      var c = null, d = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var y = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          d === null ? c = d = y : d = d.next = y, l = l.next;
        } while (l !== null);
        d === null ? c = d = r : d = d.next = r;
      } else c = d = r;
      l = { baseState: u.baseState, firstBaseUpdate: c, lastBaseUpdate: d, shared: u.shared, effects: u.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function ds(n, r, l, u) {
    var c = n.updateQueue;
    Ca = !1;
    var d = c.firstBaseUpdate, y = c.lastBaseUpdate, w = c.shared.pending;
    if (w !== null) {
      c.shared.pending = null;
      var k = w, Q = k.next;
      k.next = null, y === null ? d = Q : y.next = Q, y = k;
      var me = n.alternate;
      me !== null && (me = me.updateQueue, w = me.lastBaseUpdate, w !== y && (w === null ? me.firstBaseUpdate = Q : w.next = Q, me.lastBaseUpdate = k));
    }
    if (d !== null) {
      var Ce = c.baseState;
      y = 0, me = Q = k = null, w = d;
      do {
        var ve = w.lane, He = w.eventTime;
        if ((u & ve) === ve) {
          me !== null && (me = me.next = {
            eventTime: He,
            lane: 0,
            tag: w.tag,
            payload: w.payload,
            callback: w.callback,
            next: null
          });
          e: {
            var We = n, qe = w;
            switch (ve = r, He = l, qe.tag) {
              case 1:
                if (We = qe.payload, typeof We == "function") {
                  Ce = We.call(He, Ce, ve);
                  break e;
                }
                Ce = We;
                break e;
              case 3:
                We.flags = We.flags & -65537 | 128;
              case 0:
                if (We = qe.payload, ve = typeof We == "function" ? We.call(He, Ce, ve) : We, ve == null) break e;
                Ce = Re({}, Ce, ve);
                break e;
              case 2:
                Ca = !0;
            }
          }
          w.callback !== null && w.lane !== 0 && (n.flags |= 64, ve = c.effects, ve === null ? c.effects = [w] : ve.push(w));
        } else He = { eventTime: He, lane: ve, tag: w.tag, payload: w.payload, callback: w.callback, next: null }, me === null ? (Q = me = He, k = Ce) : me = me.next = He, y |= ve;
        if (w = w.next, w === null) {
          if (w = c.shared.pending, w === null) break;
          ve = w, w = ve.next, ve.next = null, c.lastBaseUpdate = ve, c.shared.pending = null;
        }
      } while (!0);
      if (me === null && (k = Ce), c.baseState = k, c.firstBaseUpdate = Q, c.lastBaseUpdate = me, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          y |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      ji |= y, n.lanes = y, n.memoizedState = Ce;
    }
  }
  function kd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var u = n[r], c = u.callback;
      if (c !== null) {
        if (u.callback = null, u = l, typeof c != "function") throw Error(b(191, c));
        c.call(u);
      }
    }
  }
  var ps = {}, _i = Aa(ps), vs = Aa(ps), hs = Aa(ps);
  function xo(n) {
    if (n === ps) throw Error(b(174));
    return n;
  }
  function Dd(n, r) {
    switch (et(hs, r), et(vs, n), et(_i, ps), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : Or(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = Or(r, n);
    }
    vn(_i), et(_i, r);
  }
  function bo() {
    vn(_i), vn(vs), vn(hs);
  }
  function Iv(n) {
    xo(hs.current);
    var r = xo(_i.current), l = Or(r, n.type);
    r !== l && (et(vs, n), et(_i, l));
  }
  function Mc(n) {
    vs.current === n && (vn(_i), vn(vs));
  }
  var Rn = Aa(0);
  function Ac(n) {
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
  var ms = [];
  function at() {
    for (var n = 0; n < ms.length; n++) ms[n]._workInProgressVersionPrimary = null;
    ms.length = 0;
  }
  var Lt = Se.ReactCurrentDispatcher, Xt = Se.ReactCurrentBatchConfig, un = 0, Jt = null, Yn = null, lr = null, zc = !1, ys = !1, wo = 0, de = 0;
  function Gt() {
    throw Error(b(321));
  }
  function ct(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ai(n[l], r[l])) return !1;
    return !0;
  }
  function Ml(n, r, l, u, c, d) {
    if (un = d, Jt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Lt.current = n === null || n.memoizedState === null ? Xc : bs, n = l(u, c), ys) {
      d = 0;
      do {
        if (ys = !1, wo = 0, 25 <= d) throw Error(b(301));
        d += 1, lr = Yn = null, r.updateQueue = null, Lt.current = Jc, n = l(u, c);
      } while (ys);
    }
    if (Lt.current = Do, r = Yn !== null && Yn.next !== null, un = 0, lr = Yn = Jt = null, zc = !1, r) throw Error(b(300));
    return n;
  }
  function li() {
    var n = wo !== 0;
    return wo = 0, n;
  }
  function Dr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return lr === null ? Jt.memoizedState = lr = n : lr = lr.next = n, lr;
  }
  function An() {
    if (Yn === null) {
      var n = Jt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Yn.next;
    var r = lr === null ? Jt.memoizedState : lr.next;
    if (r !== null) lr = r, Yn = n;
    else {
      if (n === null) throw Error(b(310));
      Yn = n, n = { memoizedState: Yn.memoizedState, baseState: Yn.baseState, baseQueue: Yn.baseQueue, queue: Yn.queue, next: null }, lr === null ? Jt.memoizedState = lr = n : lr = lr.next = n;
    }
    return lr;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Al(n) {
    var r = An(), l = r.queue;
    if (l === null) throw Error(b(311));
    l.lastRenderedReducer = n;
    var u = Yn, c = u.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var y = c.next;
        c.next = d.next, d.next = y;
      }
      u.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, u = u.baseState;
      var w = y = null, k = null, Q = d;
      do {
        var me = Q.lane;
        if ((un & me) === me) k !== null && (k = k.next = { lane: 0, action: Q.action, hasEagerState: Q.hasEagerState, eagerState: Q.eagerState, next: null }), u = Q.hasEagerState ? Q.eagerState : n(u, Q.action);
        else {
          var Ce = {
            lane: me,
            action: Q.action,
            hasEagerState: Q.hasEagerState,
            eagerState: Q.eagerState,
            next: null
          };
          k === null ? (w = k = Ce, y = u) : k = k.next = Ce, Jt.lanes |= me, ji |= me;
        }
        Q = Q.next;
      } while (Q !== null && Q !== d);
      k === null ? y = u : k.next = w, ai(u, r.memoizedState) || (Qn = !0), r.memoizedState = u, r.baseState = y, r.baseQueue = k, l.lastRenderedState = u;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Jt.lanes |= d, ji |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function To(n) {
    var r = An(), l = r.queue;
    if (l === null) throw Error(b(311));
    l.lastRenderedReducer = n;
    var u = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var y = c = c.next;
      do
        d = n(d, y.action), y = y.next;
      while (y !== c);
      ai(d, r.memoizedState) || (Qn = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, u];
  }
  function Uc() {
  }
  function Fc(n, r) {
    var l = Jt, u = An(), c = r(), d = !ai(u.memoizedState, c);
    if (d && (u.memoizedState = c, Qn = !0), u = u.queue, gs(Vc.bind(null, l, u, n), [n]), u.getSnapshot !== r || d || lr !== null && lr.memoizedState.tag & 1) {
      if (l.flags |= 2048, Ro(9, Hc.bind(null, l, u, c, r), void 0, null), nr === null) throw Error(b(349));
      un & 30 || Pc(l, r, c);
    }
    return c;
  }
  function Pc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Jt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Jt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Hc(n, r, l, u) {
    r.value = l, r.getSnapshot = u, Bc(r) && Ic(n);
  }
  function Vc(n, r, l) {
    return l(function() {
      Bc(r) && Ic(n);
    });
  }
  function Bc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ai(n, l);
    } catch {
      return !0;
    }
  }
  function Ic(n) {
    var r = Ea(n, 1);
    r !== null && Br(r, n, 1, -1);
  }
  function $c(n) {
    var r = Dr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = ko.bind(null, Jt, n), [r.memoizedState, n];
  }
  function Ro(n, r, l, u) {
    return n = { tag: n, create: r, destroy: l, deps: u, next: null }, r = Jt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Jt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (u = l.next, l.next = n, n.next = u, r.lastEffect = n)), n;
  }
  function Yc() {
    return An().memoizedState;
  }
  function Su(n, r, l, u) {
    var c = Dr();
    Jt.flags |= n, c.memoizedState = Ro(1 | r, l, void 0, u === void 0 ? null : u);
  }
  function Eu(n, r, l, u) {
    var c = An();
    u = u === void 0 ? null : u;
    var d = void 0;
    if (Yn !== null) {
      var y = Yn.memoizedState;
      if (d = y.destroy, u !== null && ct(u, y.deps)) {
        c.memoizedState = Ro(r, l, d, u);
        return;
      }
    }
    Jt.flags |= n, c.memoizedState = Ro(1 | r, l, d, u);
  }
  function Qc(n, r) {
    return Su(8390656, 8, n, r);
  }
  function gs(n, r) {
    return Eu(2048, 8, n, r);
  }
  function Wc(n, r) {
    return Eu(4, 2, n, r);
  }
  function Ss(n, r) {
    return Eu(4, 4, n, r);
  }
  function _o(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Gc(n, r, l) {
    return l = l != null ? l.concat([n]) : null, Eu(4, 4, _o.bind(null, r, n), l);
  }
  function Es() {
  }
  function Kc(n, r) {
    var l = An();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && ct(r, u[1]) ? u[0] : (l.memoizedState = [n, r], n);
  }
  function qc(n, r) {
    var l = An();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && ct(r, u[1]) ? u[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function Nd(n, r, l) {
    return un & 21 ? (ai(l, r) || (l = Zo(), Jt.lanes |= l, ji |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Qn = !0), n.memoizedState = l);
  }
  function Cs(n, r) {
    var l = qt;
    qt = l !== 0 && 4 > l ? l : 4, n(!0);
    var u = Xt.transition;
    Xt.transition = {};
    try {
      n(!1), r();
    } finally {
      qt = l, Xt.transition = u;
    }
  }
  function jd() {
    return An().memoizedState;
  }
  function xs(n, r, l) {
    var u = Oi(n);
    if (l = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null }, ia(n)) $v(r, l);
    else if (l = Rd(n, r, l, u), l !== null) {
      var c = Kn();
      Br(l, n, u, c), fn(l, r, u);
    }
  }
  function ko(n, r, l) {
    var u = Oi(n), c = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (ia(n)) $v(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var y = r.lastRenderedState, w = d(y, l);
        if (c.hasEagerState = !0, c.eagerState = w, ai(w, y)) {
          var k = r.interleaved;
          k === null ? (c.next = c, Td(r)) : (c.next = k.next, k.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = Rd(n, r, c, u), l !== null && (c = Kn(), Br(l, n, u, c), fn(l, r, u));
    }
  }
  function ia(n) {
    var r = n.alternate;
    return n === Jt || r !== null && r === Jt;
  }
  function $v(n, r) {
    ys = zc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function fn(n, r, l) {
    if (l & 4194240) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, Vi(n, l);
    }
  }
  var Do = { readContext: Fa, useCallback: Gt, useContext: Gt, useEffect: Gt, useImperativeHandle: Gt, useInsertionEffect: Gt, useLayoutEffect: Gt, useMemo: Gt, useReducer: Gt, useRef: Gt, useState: Gt, useDebugValue: Gt, useDeferredValue: Gt, useTransition: Gt, useMutableSource: Gt, useSyncExternalStore: Gt, useId: Gt, unstable_isNewReconciler: !1 }, Xc = { readContext: Fa, useCallback: function(n, r) {
    return Dr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Fa, useEffect: Qc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, Su(
      4194308,
      4,
      _o.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return Su(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return Su(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Dr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var u = Dr();
    return r = l !== void 0 ? l(r) : r, u.memoizedState = u.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, u.queue = n, n = n.dispatch = xs.bind(null, Jt, n), [u.memoizedState, n];
  }, useRef: function(n) {
    var r = Dr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: $c, useDebugValue: Es, useDeferredValue: function(n) {
    return Dr().memoizedState = n;
  }, useTransition: function() {
    var n = $c(!1), r = n[0];
    return n = Cs.bind(null, n[1]), Dr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var u = Jt, c = Dr();
    if (Sn) {
      if (l === void 0) throw Error(b(407));
      l = l();
    } else {
      if (l = r(), nr === null) throw Error(b(349));
      un & 30 || Pc(u, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Qc(Vc.bind(
      null,
      u,
      d,
      n
    ), [n]), u.flags |= 2048, Ro(9, Hc.bind(null, u, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Dr(), r = nr.identifierPrefix;
    if (Sn) {
      var l = Ri, u = Ti;
      l = (u & ~(1 << 32 - zr(u) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = wo++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = de++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, bs = {
    readContext: Fa,
    useCallback: Kc,
    useContext: Fa,
    useEffect: gs,
    useImperativeHandle: Gc,
    useInsertionEffect: Wc,
    useLayoutEffect: Ss,
    useMemo: qc,
    useReducer: Al,
    useRef: Yc,
    useState: function() {
      return Al(Xi);
    },
    useDebugValue: Es,
    useDeferredValue: function(n) {
      var r = An();
      return Nd(r, Yn.memoizedState, n);
    },
    useTransition: function() {
      var n = Al(Xi)[0], r = An().memoizedState;
      return [n, r];
    },
    useMutableSource: Uc,
    useSyncExternalStore: Fc,
    useId: jd,
    unstable_isNewReconciler: !1
  }, Jc = { readContext: Fa, useCallback: Kc, useContext: Fa, useEffect: gs, useImperativeHandle: Gc, useInsertionEffect: Wc, useLayoutEffect: Ss, useMemo: qc, useReducer: To, useRef: Yc, useState: function() {
    return To(Xi);
  }, useDebugValue: Es, useDeferredValue: function(n) {
    var r = An();
    return Yn === null ? r.memoizedState = n : Nd(r, Yn.memoizedState, n);
  }, useTransition: function() {
    var n = To(Xi)[0], r = An().memoizedState;
    return [n, r];
  }, useMutableSource: Uc, useSyncExternalStore: Fc, useId: jd, unstable_isNewReconciler: !1 };
  function oi(n, r) {
    if (n && n.defaultProps) {
      r = Re({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Od(n, r, l, u) {
    r = n.memoizedState, l = l(u, r), l = l == null ? r : Re({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Zc = { isMounted: function(n) {
    return (n = n._reactInternals) ? xt(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var u = Kn(), c = Oi(n), d = qi(u, c);
    d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (Br(r, n, c, u), Lc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var u = Kn(), c = Oi(n), d = qi(u, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (Br(r, n, c, u), Lc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Kn(), u = Oi(n), c = qi(l, u);
    c.tag = 2, r != null && (c.callback = r), r = Ll(n, c, u), r !== null && (Br(r, n, u, l), Lc(r, n, u));
  } };
  function Yv(n, r, l, u, c, d, y) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(u, d, y) : r.prototype && r.prototype.isPureReactComponent ? !ns(l, u) || !ns(c, d) : !0;
  }
  function ef(n, r, l) {
    var u = !1, c = kr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Fa(d) : (c = In(r) ? ea : jn.current, u = r.contextTypes, d = (u = u != null) ? ta(n, c) : kr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Zc, n.stateNode = r, r._reactInternals = n, u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Qv(n, r, l, u) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, u), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, u), r.state !== n && Zc.enqueueReplaceState(r, r.state, null);
  }
  function ws(n, r, l, u) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, _d(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Fa(d) : (d = In(r) ? ea : jn.current, c.context = ta(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Od(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Zc.enqueueReplaceState(c, c.state, null), ds(n, l, c, u), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function No(n, r) {
    try {
      var l = "", u = r;
      do
        l += St(u), u = u.return;
      while (u);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function Ld(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Md(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var tf = typeof WeakMap == "function" ? WeakMap : Map;
  function Wv(n, r, l) {
    l = qi(-1, l), l.tag = 3, l.payload = { element: null };
    var u = r.value;
    return l.callback = function() {
      Ru || (Ru = !0, Lo = u), Md(n, r);
    }, l;
  }
  function Ad(n, r, l) {
    l = qi(-1, l), l.tag = 3;
    var u = n.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var c = r.value;
      l.payload = function() {
        return u(c);
      }, l.callback = function() {
        Md(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Md(n, r), typeof u != "function" && (Fl === null ? Fl = /* @__PURE__ */ new Set([this]) : Fl.add(this));
      var y = r.stack;
      this.componentDidCatch(r.value, { componentStack: y !== null ? y : "" });
    }), l;
  }
  function zd(n, r, l) {
    var u = n.pingCache;
    if (u === null) {
      u = n.pingCache = new tf();
      var c = /* @__PURE__ */ new Set();
      u.set(r, c);
    } else c = u.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), u.set(r, c));
    c.has(l) || (c.add(l), n = by.bind(null, n, r, l), r.then(n, n));
  }
  function Gv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function zl(n, r, l, u, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = qi(-1, 1), r.tag = 2, Ll(l, r, 1))), l.lanes |= 1), n);
  }
  var Ts = Se.ReactCurrentOwner, Qn = !1;
  function mr(n, r, l, u) {
    r.child = n === null ? ze(r, null, l, u) : Mn(r, n.child, l, u);
  }
  function la(n, r, l, u, c) {
    l = l.render;
    var d = r.ref;
    return Tn(r, c), u = Ml(n, r, l, u, d, c), l = li(), n !== null && !Qn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Ha(n, r, c)) : (Sn && l && Dc(r), r.flags |= 1, mr(n, r, u, c), r.child);
  }
  function jo(n, r, l, u, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !qd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, Rt(n, r, d, u, c)) : (n = Vs(l.type, null, u, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var y = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : ns, l(y, u) && n.ref === r.ref) return Ha(n, r, c);
    }
    return r.flags |= 1, n = Hl(d, u), n.ref = r.ref, n.return = r, r.child = n;
  }
  function Rt(n, r, l, u, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (ns(d, u) && n.ref === r.ref) if (Qn = !1, r.pendingProps = u = d, (n.lanes & c) !== 0) n.flags & 131072 && (Qn = !0);
      else return r.lanes = n.lanes, Ha(n, r, c);
    }
    return Kv(n, r, l, u, c);
  }
  function Rs(n, r, l) {
    var u = r.pendingProps, c = u.children, d = n !== null ? n.memoizedState : null;
    if (u.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, et(bu, xa), xa |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, et(bu, xa), xa |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, u = d !== null ? d.baseLanes : l, et(bu, xa), xa |= u;
    }
    else d !== null ? (u = d.baseLanes | l, r.memoizedState = null) : u = l, et(bu, xa), xa |= u;
    return mr(n, r, c, l), r.child;
  }
  function Ud(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Kv(n, r, l, u, c) {
    var d = In(l) ? ea : jn.current;
    return d = ta(r, d), Tn(r, c), l = Ml(n, r, l, u, d, c), u = li(), n !== null && !Qn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Ha(n, r, c)) : (Sn && u && Dc(r), r.flags |= 1, mr(n, r, l, c), r.child);
  }
  function qv(n, r, l, u, c) {
    if (In(l)) {
      var d = !0;
      ir(r);
    } else d = !1;
    if (Tn(r, c), r.stateNode === null) Pa(n, r), ef(r, l, u), ws(r, l, u, c), u = !0;
    else if (n === null) {
      var y = r.stateNode, w = r.memoizedProps;
      y.props = w;
      var k = y.context, Q = l.contextType;
      typeof Q == "object" && Q !== null ? Q = Fa(Q) : (Q = In(l) ? ea : jn.current, Q = ta(r, Q));
      var me = l.getDerivedStateFromProps, Ce = typeof me == "function" || typeof y.getSnapshotBeforeUpdate == "function";
      Ce || typeof y.UNSAFE_componentWillReceiveProps != "function" && typeof y.componentWillReceiveProps != "function" || (w !== u || k !== Q) && Qv(r, y, u, Q), Ca = !1;
      var ve = r.memoizedState;
      y.state = ve, ds(r, u, y, c), k = r.memoizedState, w !== u || ve !== k || er.current || Ca ? (typeof me == "function" && (Od(r, l, me, u), k = r.memoizedState), (w = Ca || Yv(r, l, w, u, ve, k, Q)) ? (Ce || typeof y.UNSAFE_componentWillMount != "function" && typeof y.componentWillMount != "function" || (typeof y.componentWillMount == "function" && y.componentWillMount(), typeof y.UNSAFE_componentWillMount == "function" && y.UNSAFE_componentWillMount()), typeof y.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof y.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = u, r.memoizedState = k), y.props = u, y.state = k, y.context = Q, u = w) : (typeof y.componentDidMount == "function" && (r.flags |= 4194308), u = !1);
    } else {
      y = r.stateNode, Vv(n, r), w = r.memoizedProps, Q = r.type === r.elementType ? w : oi(r.type, w), y.props = Q, Ce = r.pendingProps, ve = y.context, k = l.contextType, typeof k == "object" && k !== null ? k = Fa(k) : (k = In(l) ? ea : jn.current, k = ta(r, k));
      var He = l.getDerivedStateFromProps;
      (me = typeof He == "function" || typeof y.getSnapshotBeforeUpdate == "function") || typeof y.UNSAFE_componentWillReceiveProps != "function" && typeof y.componentWillReceiveProps != "function" || (w !== Ce || ve !== k) && Qv(r, y, u, k), Ca = !1, ve = r.memoizedState, y.state = ve, ds(r, u, y, c);
      var We = r.memoizedState;
      w !== Ce || ve !== We || er.current || Ca ? (typeof He == "function" && (Od(r, l, He, u), We = r.memoizedState), (Q = Ca || Yv(r, l, Q, u, ve, We, k) || !1) ? (me || typeof y.UNSAFE_componentWillUpdate != "function" && typeof y.componentWillUpdate != "function" || (typeof y.componentWillUpdate == "function" && y.componentWillUpdate(u, We, k), typeof y.UNSAFE_componentWillUpdate == "function" && y.UNSAFE_componentWillUpdate(u, We, k)), typeof y.componentDidUpdate == "function" && (r.flags |= 4), typeof y.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof y.componentDidUpdate != "function" || w === n.memoizedProps && ve === n.memoizedState || (r.flags |= 4), typeof y.getSnapshotBeforeUpdate != "function" || w === n.memoizedProps && ve === n.memoizedState || (r.flags |= 1024), r.memoizedProps = u, r.memoizedState = We), y.props = u, y.state = We, y.context = k, u = Q) : (typeof y.componentDidUpdate != "function" || w === n.memoizedProps && ve === n.memoizedState || (r.flags |= 4), typeof y.getSnapshotBeforeUpdate != "function" || w === n.memoizedProps && ve === n.memoizedState || (r.flags |= 1024), u = !1);
    }
    return _s(n, r, l, u, d, c);
  }
  function _s(n, r, l, u, c, d) {
    Ud(n, r);
    var y = (r.flags & 128) !== 0;
    if (!u && !y) return c && _c(r, l, !1), Ha(n, r, d);
    u = r.stateNode, Ts.current = r;
    var w = y && typeof l.getDerivedStateFromError != "function" ? null : u.render();
    return r.flags |= 1, n !== null && y ? (r.child = Mn(r, n.child, null, d), r.child = Mn(r, null, w, d)) : mr(n, r, w, d), r.memoizedState = u.state, c && _c(r, l, !0), r.child;
  }
  function Cu(n) {
    var r = n.stateNode;
    r.pendingContext ? Uv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Uv(n, r.context, !1), Dd(n, r.containerInfo);
  }
  function Xv(n, r, l, u, c) {
    return Ol(), Ki(c), r.flags |= 256, mr(n, r, l, u), r.child;
  }
  var nf = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Fd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function rf(n, r, l) {
    var u = r.pendingProps, c = Rn.current, d = !1, y = (r.flags & 128) !== 0, w;
    if ((w = y) || (w = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), w ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), et(Rn, c & 1), n === null)
      return Ed(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (y = u.children, n = u.fallback, d ? (u = r.mode, d = r.child, y = { mode: "hidden", children: y }, !(u & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = y) : d = Vl(y, u, 0, null), n = tl(n, u, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Fd(l), r.memoizedState = nf, n) : Pd(r, y));
    if (c = n.memoizedState, c !== null && (w = c.dehydrated, w !== null)) return Jv(n, r, y, u, w, c, l);
    if (d) {
      d = u.fallback, y = r.mode, c = n.child, w = c.sibling;
      var k = { mode: "hidden", children: u.children };
      return !(y & 1) && r.child !== c ? (u = r.child, u.childLanes = 0, u.pendingProps = k, r.deletions = null) : (u = Hl(c, k), u.subtreeFlags = c.subtreeFlags & 14680064), w !== null ? d = Hl(w, d) : (d = tl(d, y, l, null), d.flags |= 2), d.return = r, u.return = r, u.sibling = d, r.child = u, u = d, d = r.child, y = n.child.memoizedState, y = y === null ? Fd(l) : { baseLanes: y.baseLanes | l, cachePool: null, transitions: y.transitions }, d.memoizedState = y, d.childLanes = n.childLanes & ~l, r.memoizedState = nf, u;
    }
    return d = n.child, n = d.sibling, u = Hl(d, { mode: "visible", children: u.children }), !(r.mode & 1) && (u.lanes = l), u.return = r, u.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = u, r.memoizedState = null, u;
  }
  function Pd(n, r) {
    return r = Vl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function ks(n, r, l, u) {
    return u !== null && Ki(u), Mn(r, n.child, null, l), n = Pd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Jv(n, r, l, u, c, d, y) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, u = Ld(Error(b(422))), ks(n, r, y, u)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = u.fallback, c = r.mode, u = Vl({ mode: "visible", children: u.children }, c, 0, null), d = tl(d, c, y, null), d.flags |= 2, u.return = r, d.return = r, u.sibling = d, r.child = u, r.mode & 1 && Mn(r, n.child, null, y), r.child.memoizedState = Fd(y), r.memoizedState = nf, d);
    if (!(r.mode & 1)) return ks(n, r, y, null);
    if (c.data === "$!") {
      if (u = c.nextSibling && c.nextSibling.dataset, u) var w = u.dgst;
      return u = w, d = Error(b(419)), u = Ld(d, u, void 0), ks(n, r, y, u);
    }
    if (w = (y & n.childLanes) !== 0, Qn || w) {
      if (u = nr, u !== null) {
        switch (y & -y) {
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
        c = c & (u.suspendedLanes | y) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, Ea(n, c), Br(u, n, c, -1));
      }
      return Kd(), u = Ld(Error(b(421))), ks(n, r, y, u);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = wy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, ra = Ci(c.nextSibling), na = r, Sn = !0, Ua = null, n !== null && ($n[za++] = Ti, $n[za++] = Ri, $n[za++] = ga, Ti = n.id, Ri = n.overflow, ga = r), r = Pd(r, u.children), r.flags |= 4096, r);
  }
  function Hd(n, r, l) {
    n.lanes |= r;
    var u = n.alternate;
    u !== null && (u.lanes |= r), wd(n.return, r, l);
  }
  function Pr(n, r, l, u, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: u, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = u, d.tail = l, d.tailMode = c);
  }
  function ki(n, r, l) {
    var u = r.pendingProps, c = u.revealOrder, d = u.tail;
    if (mr(n, r, u.children, l), u = Rn.current, u & 2) u = u & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Hd(n, l, r);
        else if (n.tag === 19) Hd(n, l, r);
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
      u &= 1;
    }
    if (et(Rn, u), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Ac(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Pr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Ac(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        Pr(r, !0, l, null, d);
        break;
      case "together":
        Pr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Pa(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Ha(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), ji |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(b(153));
    if (r.child !== null) {
      for (n = r.child, l = Hl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Hl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function Ds(n, r, l) {
    switch (r.tag) {
      case 3:
        Cu(r), Ol();
        break;
      case 5:
        Iv(r);
        break;
      case 1:
        In(r.type) && ir(r);
        break;
      case 4:
        Dd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var u = r.type._context, c = r.memoizedProps.value;
        et(Sa, u._currentValue), u._currentValue = c;
        break;
      case 13:
        if (u = r.memoizedState, u !== null)
          return u.dehydrated !== null ? (et(Rn, Rn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? rf(n, r, l) : (et(Rn, Rn.current & 1), n = Ha(n, r, l), n !== null ? n.sibling : null);
        et(Rn, Rn.current & 1);
        break;
      case 19:
        if (u = (l & r.childLanes) !== 0, n.flags & 128) {
          if (u) return ki(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), et(Rn, Rn.current), u) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Rs(n, r, l);
    }
    return Ha(n, r, l);
  }
  var Va, Wn, Zv, eh;
  Va = function(n, r) {
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
  }, Wn = function() {
  }, Zv = function(n, r, l, u) {
    var c = n.memoizedProps;
    if (c !== u) {
      n = r.stateNode, xo(_i.current);
      var d = null;
      switch (l) {
        case "input":
          c = Xn(n, c), u = Xn(n, u), d = [];
          break;
        case "select":
          c = Re({}, c, { value: void 0 }), u = Re({}, u, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = On(n, c), u = On(n, u), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof u.onClick == "function" && (n.onclick = Rl);
      }
      tt(l, u);
      var y;
      l = null;
      for (Q in c) if (!u.hasOwnProperty(Q) && c.hasOwnProperty(Q) && c[Q] != null) if (Q === "style") {
        var w = c[Q];
        for (y in w) w.hasOwnProperty(y) && (l || (l = {}), l[y] = "");
      } else Q !== "dangerouslySetInnerHTML" && Q !== "children" && Q !== "suppressContentEditableWarning" && Q !== "suppressHydrationWarning" && Q !== "autoFocus" && (ee.hasOwnProperty(Q) ? d || (d = []) : (d = d || []).push(Q, null));
      for (Q in u) {
        var k = u[Q];
        if (w = c != null ? c[Q] : void 0, u.hasOwnProperty(Q) && k !== w && (k != null || w != null)) if (Q === "style") if (w) {
          for (y in w) !w.hasOwnProperty(y) || k && k.hasOwnProperty(y) || (l || (l = {}), l[y] = "");
          for (y in k) k.hasOwnProperty(y) && w[y] !== k[y] && (l || (l = {}), l[y] = k[y]);
        } else l || (d || (d = []), d.push(
          Q,
          l
        )), l = k;
        else Q === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, w = w ? w.__html : void 0, k != null && w !== k && (d = d || []).push(Q, k)) : Q === "children" ? typeof k != "string" && typeof k != "number" || (d = d || []).push(Q, "" + k) : Q !== "suppressContentEditableWarning" && Q !== "suppressHydrationWarning" && (ee.hasOwnProperty(Q) ? (k != null && Q === "onScroll" && nn("scroll", n), d || w === k || (d = [])) : (d = d || []).push(Q, k));
      }
      l && (d = d || []).push("style", l);
      var Q = d;
      (r.updateQueue = Q) && (r.flags |= 4);
    }
  }, eh = function(n, r, l, u) {
    l !== u && (r.flags |= 4);
  };
  function Ns(n, r) {
    if (!Sn) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var l = null; r !== null; ) r.alternate !== null && (l = r), r = r.sibling;
        l === null ? n.tail = null : l.sibling = null;
        break;
      case "collapsed":
        l = n.tail;
        for (var u = null; l !== null; ) l.alternate !== null && (u = l), l = l.sibling;
        u === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : u.sibling = null;
    }
  }
  function or(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, u = 0;
    if (r) for (var c = n.child; c !== null; ) l |= c.lanes | c.childLanes, u |= c.subtreeFlags & 14680064, u |= c.flags & 14680064, c.return = n, c = c.sibling;
    else for (c = n.child; c !== null; ) l |= c.lanes | c.childLanes, u |= c.subtreeFlags, u |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= u, n.childLanes = l, r;
  }
  function th(n, r, l) {
    var u = r.pendingProps;
    switch (Nc(r), r.tag) {
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
        return or(r), null;
      case 1:
        return In(r.type) && mu(), or(r), null;
      case 3:
        return u = r.stateNode, bo(), vn(er), vn(jn), at(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (n === null || n.child === null) && (jc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Ua !== null && (Mo(Ua), Ua = null))), Wn(n, r), or(r), null;
      case 5:
        Mc(r);
        var c = xo(hs.current);
        if (l = r.type, n !== null && r.stateNode != null) Zv(n, r, l, u, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!u) {
            if (r.stateNode === null) throw Error(b(166));
            return or(r), null;
          }
          if (n = xo(_i.current), jc(r)) {
            u = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (u[xi] = r, u[us] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                nn("cancel", u), nn("close", u);
                break;
              case "iframe":
              case "object":
              case "embed":
                nn("load", u);
                break;
              case "video":
              case "audio":
                for (c = 0; c < is.length; c++) nn(is[c], u);
                break;
              case "source":
                nn("error", u);
                break;
              case "img":
              case "image":
              case "link":
                nn(
                  "error",
                  u
                ), nn("load", u);
                break;
              case "details":
                nn("toggle", u);
                break;
              case "input":
                Ht(u, d), nn("invalid", u);
                break;
              case "select":
                u._wrapperState = { wasMultiple: !!d.multiple }, nn("invalid", u);
                break;
              case "textarea":
                Jn(u, d), nn("invalid", u);
            }
            tt(l, d), c = null;
            for (var y in d) if (d.hasOwnProperty(y)) {
              var w = d[y];
              y === "children" ? typeof w == "string" ? u.textContent !== w && (d.suppressHydrationWarning !== !0 && bc(u.textContent, w, n), c = ["children", w]) : typeof w == "number" && u.textContent !== "" + w && (d.suppressHydrationWarning !== !0 && bc(
                u.textContent,
                w,
                n
              ), c = ["children", "" + w]) : ee.hasOwnProperty(y) && w != null && y === "onScroll" && nn("scroll", u);
            }
            switch (l) {
              case "input":
                Cn(u), Da(u, d, !0);
                break;
              case "textarea":
                Cn(u), Nn(u);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (u.onclick = Rl);
            }
            u = c, r.updateQueue = u, u !== null && (r.flags |= 4);
          } else {
            y = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = ar(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = y.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof u.is == "string" ? n = y.createElement(l, { is: u.is }) : (n = y.createElement(l), l === "select" && (y = n, u.multiple ? y.multiple = !0 : u.size && (y.size = u.size))) : n = y.createElementNS(n, l), n[xi] = r, n[us] = u, Va(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (y = Vt(l, u), l) {
                case "dialog":
                  nn("cancel", n), nn("close", n), c = u;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  nn("load", n), c = u;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < is.length; c++) nn(is[c], n);
                  c = u;
                  break;
                case "source":
                  nn("error", n), c = u;
                  break;
                case "img":
                case "image":
                case "link":
                  nn(
                    "error",
                    n
                  ), nn("load", n), c = u;
                  break;
                case "details":
                  nn("toggle", n), c = u;
                  break;
                case "input":
                  Ht(n, u), c = Xn(n, u), nn("invalid", n);
                  break;
                case "option":
                  c = u;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!u.multiple }, c = Re({}, u, { value: void 0 }), nn("invalid", n);
                  break;
                case "textarea":
                  Jn(n, u), c = On(n, u), nn("invalid", n);
                  break;
                default:
                  c = u;
              }
              tt(l, c), w = c;
              for (d in w) if (w.hasOwnProperty(d)) {
                var k = w[d];
                d === "style" ? B(n, k) : d === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, k != null && Lr(n, k)) : d === "children" ? typeof k == "string" ? (l !== "textarea" || k !== "") && _e(n, k) : typeof k == "number" && _e(n, "" + k) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (ee.hasOwnProperty(d) ? k != null && d === "onScroll" && nn("scroll", n) : k != null && Ee(n, d, k, y));
              }
              switch (l) {
                case "input":
                  Cn(n), Da(n, u, !1);
                  break;
                case "textarea":
                  Cn(n), Nn(n);
                  break;
                case "option":
                  u.value != null && n.setAttribute("value", "" + Et(u.value));
                  break;
                case "select":
                  n.multiple = !!u.multiple, d = u.value, d != null ? xn(n, !!u.multiple, d, !1) : u.defaultValue != null && xn(
                    n,
                    !!u.multiple,
                    u.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = Rl);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  u = !!u.autoFocus;
                  break e;
                case "img":
                  u = !0;
                  break e;
                default:
                  u = !1;
              }
            }
            u && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return or(r), null;
      case 6:
        if (n && r.stateNode != null) eh(n, r, n.memoizedProps, u);
        else {
          if (typeof u != "string" && r.stateNode === null) throw Error(b(166));
          if (l = xo(hs.current), xo(_i.current), jc(r)) {
            if (u = r.stateNode, l = r.memoizedProps, u[xi] = r, (d = u.nodeValue !== l) && (n = na, n !== null)) switch (n.tag) {
              case 3:
                bc(u.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && bc(u.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else u = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(u), u[xi] = r, r.stateNode = u;
        }
        return or(r), null;
      case 13:
        if (vn(Rn), u = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (Sn && ra !== null && r.mode & 1 && !(r.flags & 128)) fs(), Ol(), r.flags |= 98560, d = !1;
          else if (d = jc(r), u !== null && u.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(b(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(b(317));
              d[xi] = r;
            } else Ol(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            or(r), d = !1;
          } else Ua !== null && (Mo(Ua), Ua = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (u = u !== null, u !== (n !== null && n.memoizedState !== null) && u && (r.child.flags |= 8192, r.mode & 1 && (n === null || Rn.current & 1 ? Un === 0 && (Un = 3) : Kd())), r.updateQueue !== null && (r.flags |= 4), or(r), null);
      case 4:
        return bo(), Wn(n, r), n === null && fu(r.stateNode.containerInfo), or(r), null;
      case 10:
        return bd(r.type._context), or(r), null;
      case 17:
        return In(r.type) && mu(), or(r), null;
      case 19:
        if (vn(Rn), d = r.memoizedState, d === null) return or(r), null;
        if (u = (r.flags & 128) !== 0, y = d.rendering, y === null) if (u) Ns(d, !1);
        else {
          if (Un !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (y = Ac(n), y !== null) {
              for (r.flags |= 128, Ns(d, !1), u = y.updateQueue, u !== null && (r.updateQueue = u, r.flags |= 4), r.subtreeFlags = 0, u = l, l = r.child; l !== null; ) d = l, n = u, d.flags &= 14680066, y = d.alternate, y === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = y.childLanes, d.lanes = y.lanes, d.child = y.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = y.memoizedProps, d.memoizedState = y.memoizedState, d.updateQueue = y.updateQueue, d.type = y.type, n = y.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return et(Rn, Rn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && bt() > Tu && (r.flags |= 128, u = !0, Ns(d, !1), r.lanes = 4194304);
        }
        else {
          if (!u) if (n = Ac(y), n !== null) {
            if (r.flags |= 128, u = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ns(d, !0), d.tail === null && d.tailMode === "hidden" && !y.alternate && !Sn) return or(r), null;
          } else 2 * bt() - d.renderingStartTime > Tu && l !== 1073741824 && (r.flags |= 128, u = !0, Ns(d, !1), r.lanes = 4194304);
          d.isBackwards ? (y.sibling = r.child, r.child = y) : (l = d.last, l !== null ? l.sibling = y : r.child = y, d.last = y);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = bt(), r.sibling = null, l = Rn.current, et(Rn, u ? l & 1 | 2 : l & 1), r) : (or(r), null);
      case 22:
      case 23:
        return Gd(), u = r.memoizedState !== null, n !== null && n.memoizedState !== null !== u && (r.flags |= 8192), u && r.mode & 1 ? xa & 1073741824 && (or(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : or(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(b(156, r.tag));
  }
  function af(n, r) {
    switch (Nc(r), r.tag) {
      case 1:
        return In(r.type) && mu(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return bo(), vn(er), vn(jn), at(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Mc(r), null;
      case 13:
        if (vn(Rn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(b(340));
          Ol();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return vn(Rn), null;
      case 4:
        return bo(), null;
      case 10:
        return bd(r.type._context), null;
      case 22:
      case 23:
        return Gd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var js = !1, Nr = !1, yy = typeof WeakSet == "function" ? WeakSet : Set, Ye = null;
  function xu(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (u) {
      En(n, r, u);
    }
    else l.current = null;
  }
  function lf(n, r, l) {
    try {
      l();
    } catch (u) {
      En(n, r, u);
    }
  }
  var nh = !1;
  function rh(n, r) {
    if (os = Oa, n = rs(), hc(n)) {
      if ("selectionStart" in n) var l = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        l = (l = n.ownerDocument) && l.defaultView || window;
        var u = l.getSelection && l.getSelection();
        if (u && u.rangeCount !== 0) {
          l = u.anchorNode;
          var c = u.anchorOffset, d = u.focusNode;
          u = u.focusOffset;
          try {
            l.nodeType, d.nodeType;
          } catch {
            l = null;
            break e;
          }
          var y = 0, w = -1, k = -1, Q = 0, me = 0, Ce = n, ve = null;
          t: for (; ; ) {
            for (var He; Ce !== l || c !== 0 && Ce.nodeType !== 3 || (w = y + c), Ce !== d || u !== 0 && Ce.nodeType !== 3 || (k = y + u), Ce.nodeType === 3 && (y += Ce.nodeValue.length), (He = Ce.firstChild) !== null; )
              ve = Ce, Ce = He;
            for (; ; ) {
              if (Ce === n) break t;
              if (ve === l && ++Q === c && (w = y), ve === d && ++me === u && (k = y), (He = Ce.nextSibling) !== null) break;
              Ce = ve, ve = Ce.parentNode;
            }
            Ce = He;
          }
          l = w === -1 || k === -1 ? null : { start: w, end: k };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (mo = { focusedElem: n, selectionRange: l }, Oa = !1, Ye = r; Ye !== null; ) if (r = Ye, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Ye = n;
    else for (; Ye !== null; ) {
      r = Ye;
      try {
        var We = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (We !== null) {
              var qe = We.memoizedProps, Fn = We.memoizedState, F = r.stateNode, j = F.getSnapshotBeforeUpdate(r.elementType === r.type ? qe : oi(r.type, qe), Fn);
              F.__reactInternalSnapshotBeforeUpdate = j;
            }
            break;
          case 3:
            var I = r.stateNode.containerInfo;
            I.nodeType === 1 ? I.textContent = "" : I.nodeType === 9 && I.documentElement && I.removeChild(I.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(b(163));
        }
      } catch (ye) {
        En(r, r.return, ye);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Ye = n;
        break;
      }
      Ye = r.return;
    }
    return We = nh, nh = !1, We;
  }
  function Os(n, r, l) {
    var u = r.updateQueue;
    if (u = u !== null ? u.lastEffect : null, u !== null) {
      var c = u = u.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && lf(r, l, d);
        }
        c = c.next;
      } while (c !== u);
    }
  }
  function Ls(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var u = l.create;
          l.destroy = u();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Vd(n) {
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
  function of(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, of(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[xi], delete r[us], delete r[ss], delete r[hu], delete r[hy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ms(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Ji(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Ms(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function Di(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = Rl));
    else if (u !== 4 && (n = n.child, n !== null)) for (Di(n, r, l), n = n.sibling; n !== null; ) Di(n, r, l), n = n.sibling;
  }
  function Ni(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (u !== 4 && (n = n.child, n !== null)) for (Ni(n, r, l), n = n.sibling; n !== null; ) Ni(n, r, l), n = n.sibling;
  }
  var zn = null, Hr = !1;
  function Vr(n, r, l) {
    for (l = l.child; l !== null; ) ah(n, r, l), l = l.sibling;
  }
  function ah(n, r, l) {
    if (Jr && typeof Jr.onCommitFiberUnmount == "function") try {
      Jr.onCommitFiberUnmount(yl, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Nr || xu(l, r);
      case 6:
        var u = zn, c = Hr;
        zn = null, Vr(n, r, l), zn = u, Hr = c, zn !== null && (Hr ? (n = zn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : zn.removeChild(l.stateNode));
        break;
      case 18:
        zn !== null && (Hr ? (n = zn, l = l.stateNode, n.nodeType === 8 ? vu(n.parentNode, l) : n.nodeType === 1 && vu(n, l), ni(n)) : vu(zn, l.stateNode));
        break;
      case 4:
        u = zn, c = Hr, zn = l.stateNode.containerInfo, Hr = !0, Vr(n, r, l), zn = u, Hr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Nr && (u = l.updateQueue, u !== null && (u = u.lastEffect, u !== null))) {
          c = u = u.next;
          do {
            var d = c, y = d.destroy;
            d = d.tag, y !== void 0 && (d & 2 || d & 4) && lf(l, r, y), c = c.next;
          } while (c !== u);
        }
        Vr(n, r, l);
        break;
      case 1:
        if (!Nr && (xu(l, r), u = l.stateNode, typeof u.componentWillUnmount == "function")) try {
          u.props = l.memoizedProps, u.state = l.memoizedState, u.componentWillUnmount();
        } catch (w) {
          En(l, r, w);
        }
        Vr(n, r, l);
        break;
      case 21:
        Vr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Nr = (u = Nr) || l.memoizedState !== null, Vr(n, r, l), Nr = u) : Vr(n, r, l);
        break;
      default:
        Vr(n, r, l);
    }
  }
  function ih(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new yy()), r.forEach(function(u) {
        var c = vh.bind(null, n, u);
        l.has(u) || (l.add(u), u.then(c, c));
      });
    }
  }
  function ui(n, r) {
    var l = r.deletions;
    if (l !== null) for (var u = 0; u < l.length; u++) {
      var c = l[u];
      try {
        var d = n, y = r, w = y;
        e: for (; w !== null; ) {
          switch (w.tag) {
            case 5:
              zn = w.stateNode, Hr = !1;
              break e;
            case 3:
              zn = w.stateNode.containerInfo, Hr = !0;
              break e;
            case 4:
              zn = w.stateNode.containerInfo, Hr = !0;
              break e;
          }
          w = w.return;
        }
        if (zn === null) throw Error(b(160));
        ah(d, y, c), zn = null, Hr = !1;
        var k = c.alternate;
        k !== null && (k.return = null), c.return = null;
      } catch (Q) {
        En(c, r, Q);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Bd(r, n), r = r.sibling;
  }
  function Bd(n, r) {
    var l = n.alternate, u = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ui(r, n), oa(n), u & 4) {
          try {
            Os(3, n, n.return), Ls(3, n);
          } catch (qe) {
            En(n, n.return, qe);
          }
          try {
            Os(5, n, n.return);
          } catch (qe) {
            En(n, n.return, qe);
          }
        }
        break;
      case 1:
        ui(r, n), oa(n), u & 512 && l !== null && xu(l, l.return);
        break;
      case 5:
        if (ui(r, n), oa(n), u & 512 && l !== null && xu(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            _e(c, "");
          } catch (qe) {
            En(n, n.return, qe);
          }
        }
        if (u & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, y = l !== null ? l.memoizedProps : d, w = n.type, k = n.updateQueue;
          if (n.updateQueue = null, k !== null) try {
            w === "input" && d.type === "radio" && d.name != null && kn(c, d), Vt(w, y);
            var Q = Vt(w, d);
            for (y = 0; y < k.length; y += 2) {
              var me = k[y], Ce = k[y + 1];
              me === "style" ? B(c, Ce) : me === "dangerouslySetInnerHTML" ? Lr(c, Ce) : me === "children" ? _e(c, Ce) : Ee(c, me, Ce, Q);
            }
            switch (w) {
              case "input":
                cr(c, d);
                break;
              case "textarea":
                ha(c, d);
                break;
              case "select":
                var ve = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var He = d.value;
                He != null ? xn(c, !!d.multiple, He, !1) : ve !== !!d.multiple && (d.defaultValue != null ? xn(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : xn(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[us] = d;
          } catch (qe) {
            En(n, n.return, qe);
          }
        }
        break;
      case 6:
        if (ui(r, n), oa(n), u & 4) {
          if (n.stateNode === null) throw Error(b(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (qe) {
            En(n, n.return, qe);
          }
        }
        break;
      case 3:
        if (ui(r, n), oa(n), u & 4 && l !== null && l.memoizedState.isDehydrated) try {
          ni(r.containerInfo);
        } catch (qe) {
          En(n, n.return, qe);
        }
        break;
      case 4:
        ui(r, n), oa(n);
        break;
      case 13:
        ui(r, n), oa(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Yd = bt())), u & 4 && ih(n);
        break;
      case 22:
        if (me = l !== null && l.memoizedState !== null, n.mode & 1 ? (Nr = (Q = Nr) || me, ui(r, n), Nr = Q) : ui(r, n), oa(n), u & 8192) {
          if (Q = n.memoizedState !== null, (n.stateNode.isHidden = Q) && !me && n.mode & 1) for (Ye = n, me = n.child; me !== null; ) {
            for (Ce = Ye = me; Ye !== null; ) {
              switch (ve = Ye, He = ve.child, ve.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, ve, ve.return);
                  break;
                case 1:
                  xu(ve, ve.return);
                  var We = ve.stateNode;
                  if (typeof We.componentWillUnmount == "function") {
                    u = ve, l = ve.return;
                    try {
                      r = u, We.props = r.memoizedProps, We.state = r.memoizedState, We.componentWillUnmount();
                    } catch (qe) {
                      En(u, l, qe);
                    }
                  }
                  break;
                case 5:
                  xu(ve, ve.return);
                  break;
                case 22:
                  if (ve.memoizedState !== null) {
                    As(Ce);
                    continue;
                  }
              }
              He !== null ? (He.return = ve, Ye = He) : As(Ce);
            }
            me = me.sibling;
          }
          e: for (me = null, Ce = n; ; ) {
            if (Ce.tag === 5) {
              if (me === null) {
                me = Ce;
                try {
                  c = Ce.stateNode, Q ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (w = Ce.stateNode, k = Ce.memoizedProps.style, y = k != null && k.hasOwnProperty("display") ? k.display : null, w.style.display = Te("display", y));
                } catch (qe) {
                  En(n, n.return, qe);
                }
              }
            } else if (Ce.tag === 6) {
              if (me === null) try {
                Ce.stateNode.nodeValue = Q ? "" : Ce.memoizedProps;
              } catch (qe) {
                En(n, n.return, qe);
              }
            } else if ((Ce.tag !== 22 && Ce.tag !== 23 || Ce.memoizedState === null || Ce === n) && Ce.child !== null) {
              Ce.child.return = Ce, Ce = Ce.child;
              continue;
            }
            if (Ce === n) break e;
            for (; Ce.sibling === null; ) {
              if (Ce.return === null || Ce.return === n) break e;
              me === Ce && (me = null), Ce = Ce.return;
            }
            me === Ce && (me = null), Ce.sibling.return = Ce.return, Ce = Ce.sibling;
          }
        }
        break;
      case 19:
        ui(r, n), oa(n), u & 4 && ih(n);
        break;
      case 21:
        break;
      default:
        ui(
          r,
          n
        ), oa(n);
    }
  }
  function oa(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (Ms(l)) {
              var u = l;
              break e;
            }
            l = l.return;
          }
          throw Error(b(160));
        }
        switch (u.tag) {
          case 5:
            var c = u.stateNode;
            u.flags & 32 && (_e(c, ""), u.flags &= -33);
            var d = Ji(n);
            Ni(n, d, c);
            break;
          case 3:
          case 4:
            var y = u.stateNode.containerInfo, w = Ji(n);
            Di(n, w, y);
            break;
          default:
            throw Error(b(161));
        }
      } catch (k) {
        En(n, n.return, k);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function gy(n, r, l) {
    Ye = n, Id(n);
  }
  function Id(n, r, l) {
    for (var u = (n.mode & 1) !== 0; Ye !== null; ) {
      var c = Ye, d = c.child;
      if (c.tag === 22 && u) {
        var y = c.memoizedState !== null || js;
        if (!y) {
          var w = c.alternate, k = w !== null && w.memoizedState !== null || Nr;
          w = js;
          var Q = Nr;
          if (js = y, (Nr = k) && !Q) for (Ye = c; Ye !== null; ) y = Ye, k = y.child, y.tag === 22 && y.memoizedState !== null ? $d(c) : k !== null ? (k.return = y, Ye = k) : $d(c);
          for (; d !== null; ) Ye = d, Id(d), d = d.sibling;
          Ye = c, js = w, Nr = Q;
        }
        lh(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, Ye = d) : lh(n);
    }
  }
  function lh(n) {
    for (; Ye !== null; ) {
      var r = Ye;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Nr || Ls(5, r);
              break;
            case 1:
              var u = r.stateNode;
              if (r.flags & 4 && !Nr) if (l === null) u.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : oi(r.type, l.memoizedProps);
                u.componentDidUpdate(c, l.memoizedState, u.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && kd(r, d, u);
              break;
            case 3:
              var y = r.updateQueue;
              if (y !== null) {
                if (l = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    l = r.child.stateNode;
                    break;
                  case 1:
                    l = r.child.stateNode;
                }
                kd(r, y, l);
              }
              break;
            case 5:
              var w = r.stateNode;
              if (l === null && r.flags & 4) {
                l = w;
                var k = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k.autoFocus && l.focus();
                    break;
                  case "img":
                    k.src && (l.src = k.src);
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
                var Q = r.alternate;
                if (Q !== null) {
                  var me = Q.memoizedState;
                  if (me !== null) {
                    var Ce = me.dehydrated;
                    Ce !== null && ni(Ce);
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
              throw Error(b(163));
          }
          Nr || r.flags & 512 && Vd(r);
        } catch (ve) {
          En(r, r.return, ve);
        }
      }
      if (r === n) {
        Ye = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Ye = l;
        break;
      }
      Ye = r.return;
    }
  }
  function As(n) {
    for (; Ye !== null; ) {
      var r = Ye;
      if (r === n) {
        Ye = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Ye = l;
        break;
      }
      Ye = r.return;
    }
  }
  function $d(n) {
    for (; Ye !== null; ) {
      var r = Ye;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ls(4, r);
            } catch (k) {
              En(r, l, k);
            }
            break;
          case 1:
            var u = r.stateNode;
            if (typeof u.componentDidMount == "function") {
              var c = r.return;
              try {
                u.componentDidMount();
              } catch (k) {
                En(r, c, k);
              }
            }
            var d = r.return;
            try {
              Vd(r);
            } catch (k) {
              En(r, d, k);
            }
            break;
          case 5:
            var y = r.return;
            try {
              Vd(r);
            } catch (k) {
              En(r, y, k);
            }
        }
      } catch (k) {
        En(r, r.return, k);
      }
      if (r === n) {
        Ye = null;
        break;
      }
      var w = r.sibling;
      if (w !== null) {
        w.return = r.return, Ye = w;
        break;
      }
      Ye = r.return;
    }
  }
  var Sy = Math.ceil, Ul = Se.ReactCurrentDispatcher, Oo = Se.ReactCurrentOwner, yr = Se.ReactCurrentBatchConfig, It = 0, nr = null, Gn = null, gr = 0, xa = 0, bu = Aa(0), Un = 0, zs = null, ji = 0, wu = 0, uf = 0, Us = null, ua = null, Yd = 0, Tu = 1 / 0, ba = null, Ru = !1, Lo = null, Fl = null, sf = !1, Zi = null, Fs = 0, Pl = 0, _u = null, Ps = -1, jr = 0;
  function Kn() {
    return It & 6 ? bt() : Ps !== -1 ? Ps : Ps = bt();
  }
  function Oi(n) {
    return n.mode & 1 ? It & 2 && gr !== 0 ? gr & -gr : my.transition !== null ? (jr === 0 && (jr = Zo()), jr) : (n = qt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : lu(n.type)), n) : 1;
  }
  function Br(n, r, l, u) {
    if (50 < Pl) throw Pl = 0, _u = null, Error(b(185));
    Hi(n, l, u), (!(It & 2) || n !== nr) && (n === nr && (!(It & 2) && (wu |= l), Un === 4 && si(n, gr)), sa(n, u), l === 1 && It === 0 && !(r.mode & 1) && (Tu = bt() + 500, yu && wi()));
  }
  function sa(n, r) {
    var l = n.callbackNode;
    lo(n, r);
    var u = ti(n, n === nr ? gr : 0);
    if (u === 0) l !== null && pr(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = u & -u, n.callbackPriority !== r) {
      if (l != null && pr(l), r === 1) n.tag === 0 ? kl(Qd.bind(null, n)) : kc(Qd.bind(null, n)), pu(function() {
        !(It & 6) && wi();
      }), l = null;
      else {
        switch (tu(u)) {
          case 1:
            l = Za;
            break;
          case 4:
            l = ao;
            break;
          case 16:
            l = io;
            break;
          case 536870912:
            l = qo;
            break;
          default:
            l = io;
        }
        l = mh(l, cf.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function cf(n, r) {
    if (Ps = -1, jr = 0, It & 6) throw Error(b(327));
    var l = n.callbackNode;
    if (ku() && n.callbackNode !== l) return null;
    var u = ti(n, n === nr ? gr : 0);
    if (u === 0) return null;
    if (u & 30 || u & n.expiredLanes || r) r = ff(n, u);
    else {
      r = u;
      var c = It;
      It |= 2;
      var d = uh();
      (nr !== n || gr !== r) && (ba = null, Tu = bt() + 500, el(n, r));
      do
        try {
          sh();
          break;
        } catch (w) {
          oh(n, w);
        }
      while (!0);
      xd(), Ul.current = d, It = c, Gn !== null ? r = 0 : (nr = null, gr = 0, r = Un);
    }
    if (r !== 0) {
      if (r === 2 && (c = Sl(n), c !== 0 && (u = c, r = Hs(n, c))), r === 1) throw l = zs, el(n, 0), si(n, u), sa(n, bt()), l;
      if (r === 6) si(n, u);
      else {
        if (c = n.current.alternate, !(u & 30) && !Ey(c) && (r = ff(n, u), r === 2 && (d = Sl(n), d !== 0 && (u = d, r = Hs(n, d))), r === 1)) throw l = zs, el(n, 0), si(n, u), sa(n, bt()), l;
        switch (n.finishedWork = c, n.finishedLanes = u, r) {
          case 0:
          case 1:
            throw Error(b(345));
          case 2:
            zo(n, ua, ba);
            break;
          case 3:
            if (si(n, u), (u & 130023424) === u && (r = Yd + 500 - bt(), 10 < r)) {
              if (ti(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & u) !== u) {
                Kn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Tc(zo.bind(null, n, ua, ba), r);
              break;
            }
            zo(n, ua, ba);
            break;
          case 4:
            if (si(n, u), (u & 4194240) === u) break;
            for (r = n.eventTimes, c = -1; 0 < u; ) {
              var y = 31 - zr(u);
              d = 1 << y, y = r[y], y > c && (c = y), u &= ~d;
            }
            if (u = c, u = bt() - u, u = (120 > u ? 120 : 480 > u ? 480 : 1080 > u ? 1080 : 1920 > u ? 1920 : 3e3 > u ? 3e3 : 4320 > u ? 4320 : 1960 * Sy(u / 1960)) - u, 10 < u) {
              n.timeoutHandle = Tc(zo.bind(null, n, ua, ba), u);
              break;
            }
            zo(n, ua, ba);
            break;
          case 5:
            zo(n, ua, ba);
            break;
          default:
            throw Error(b(329));
        }
      }
    }
    return sa(n, bt()), n.callbackNode === l ? cf.bind(null, n) : null;
  }
  function Hs(n, r) {
    var l = Us;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = ff(n, r), n !== 2 && (r = ua, ua = l, r !== null && Mo(r)), n;
  }
  function Mo(n) {
    ua === null ? ua = n : ua.push.apply(ua, n);
  }
  function Ey(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var u = 0; u < l.length; u++) {
          var c = l[u], d = c.getSnapshot;
          c = c.value;
          try {
            if (!ai(d(), c)) return !1;
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
  function si(n, r) {
    for (r &= ~uf, r &= ~wu, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - zr(r), u = 1 << l;
      n[l] = -1, r &= ~u;
    }
  }
  function Qd(n) {
    if (It & 6) throw Error(b(327));
    ku();
    var r = ti(n, 0);
    if (!(r & 1)) return sa(n, bt()), null;
    var l = ff(n, r);
    if (n.tag !== 0 && l === 2) {
      var u = Sl(n);
      u !== 0 && (r = u, l = Hs(n, u));
    }
    if (l === 1) throw l = zs, el(n, 0), si(n, r), sa(n, bt()), l;
    if (l === 6) throw Error(b(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, zo(n, ua, ba), sa(n, bt()), null;
  }
  function Wd(n, r) {
    var l = It;
    It |= 1;
    try {
      return n(r);
    } finally {
      It = l, It === 0 && (Tu = bt() + 500, yu && wi());
    }
  }
  function Ao(n) {
    Zi !== null && Zi.tag === 0 && !(It & 6) && ku();
    var r = It;
    It |= 1;
    var l = yr.transition, u = qt;
    try {
      if (yr.transition = null, qt = 1, n) return n();
    } finally {
      qt = u, yr.transition = l, It = r, !(It & 6) && wi();
    }
  }
  function Gd() {
    xa = bu.current, vn(bu);
  }
  function el(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, yd(l)), Gn !== null) for (l = Gn.return; l !== null; ) {
      var u = l;
      switch (Nc(u), u.tag) {
        case 1:
          u = u.type.childContextTypes, u != null && mu();
          break;
        case 3:
          bo(), vn(er), vn(jn), at();
          break;
        case 5:
          Mc(u);
          break;
        case 4:
          bo();
          break;
        case 13:
          vn(Rn);
          break;
        case 19:
          vn(Rn);
          break;
        case 10:
          bd(u.type._context);
          break;
        case 22:
        case 23:
          Gd();
      }
      l = l.return;
    }
    if (nr = n, Gn = n = Hl(n.current, null), gr = xa = r, Un = 0, zs = null, uf = wu = ji = 0, ua = Us = null, Co !== null) {
      for (r = 0; r < Co.length; r++) if (l = Co[r], u = l.interleaved, u !== null) {
        l.interleaved = null;
        var c = u.next, d = l.pending;
        if (d !== null) {
          var y = d.next;
          d.next = c, u.next = y;
        }
        l.pending = u;
      }
      Co = null;
    }
    return n;
  }
  function oh(n, r) {
    do {
      var l = Gn;
      try {
        if (xd(), Lt.current = Do, zc) {
          for (var u = Jt.memoizedState; u !== null; ) {
            var c = u.queue;
            c !== null && (c.pending = null), u = u.next;
          }
          zc = !1;
        }
        if (un = 0, lr = Yn = Jt = null, ys = !1, wo = 0, Oo.current = null, l === null || l.return === null) {
          Un = 1, zs = r, Gn = null;
          break;
        }
        e: {
          var d = n, y = l.return, w = l, k = r;
          if (r = gr, w.flags |= 32768, k !== null && typeof k == "object" && typeof k.then == "function") {
            var Q = k, me = w, Ce = me.tag;
            if (!(me.mode & 1) && (Ce === 0 || Ce === 11 || Ce === 15)) {
              var ve = me.alternate;
              ve ? (me.updateQueue = ve.updateQueue, me.memoizedState = ve.memoizedState, me.lanes = ve.lanes) : (me.updateQueue = null, me.memoizedState = null);
            }
            var He = Gv(y);
            if (He !== null) {
              He.flags &= -257, zl(He, y, w, d, r), He.mode & 1 && zd(d, Q, r), r = He, k = Q;
              var We = r.updateQueue;
              if (We === null) {
                var qe = /* @__PURE__ */ new Set();
                qe.add(k), r.updateQueue = qe;
              } else We.add(k);
              break e;
            } else {
              if (!(r & 1)) {
                zd(d, Q, r), Kd();
                break e;
              }
              k = Error(b(426));
            }
          } else if (Sn && w.mode & 1) {
            var Fn = Gv(y);
            if (Fn !== null) {
              !(Fn.flags & 65536) && (Fn.flags |= 256), zl(Fn, y, w, d, r), Ki(No(k, w));
              break e;
            }
          }
          d = k = No(k, w), Un !== 4 && (Un = 2), Us === null ? Us = [d] : Us.push(d), d = y;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var F = Wv(d, k, r);
                Bv(d, F);
                break e;
              case 1:
                w = k;
                var j = d.type, I = d.stateNode;
                if (!(d.flags & 128) && (typeof j.getDerivedStateFromError == "function" || I !== null && typeof I.componentDidCatch == "function" && (Fl === null || !Fl.has(I)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var ye = Ad(d, w, r);
                  Bv(d, ye);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        fh(l);
      } catch (Ge) {
        r = Ge, Gn === l && l !== null && (Gn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function uh() {
    var n = Ul.current;
    return Ul.current = Do, n === null ? Do : n;
  }
  function Kd() {
    (Un === 0 || Un === 3 || Un === 2) && (Un = 4), nr === null || !(ji & 268435455) && !(wu & 268435455) || si(nr, gr);
  }
  function ff(n, r) {
    var l = It;
    It |= 2;
    var u = uh();
    (nr !== n || gr !== r) && (ba = null, el(n, r));
    do
      try {
        Cy();
        break;
      } catch (c) {
        oh(n, c);
      }
    while (!0);
    if (xd(), It = l, Ul.current = u, Gn !== null) throw Error(b(261));
    return nr = null, gr = 0, Un;
  }
  function Cy() {
    for (; Gn !== null; ) ch(Gn);
  }
  function sh() {
    for (; Gn !== null && !Xa(); ) ch(Gn);
  }
  function ch(n) {
    var r = hh(n.alternate, n, xa);
    n.memoizedProps = n.pendingProps, r === null ? fh(n) : Gn = r, Oo.current = null;
  }
  function fh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = af(l, r), l !== null) {
          l.flags &= 32767, Gn = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          Un = 6, Gn = null;
          return;
        }
      } else if (l = th(l, r, xa), l !== null) {
        Gn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        Gn = r;
        return;
      }
      Gn = r = n;
    } while (r !== null);
    Un === 0 && (Un = 5);
  }
  function zo(n, r, l) {
    var u = qt, c = yr.transition;
    try {
      yr.transition = null, qt = 1, xy(n, r, l, u);
    } finally {
      yr.transition = c, qt = u;
    }
    return null;
  }
  function xy(n, r, l, u) {
    do
      ku();
    while (Zi !== null);
    if (It & 6) throw Error(b(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(b(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (qf(n, d), n === nr && (Gn = nr = null, gr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || sf || (sf = !0, mh(io, function() {
      return ku(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = yr.transition, yr.transition = null;
      var y = qt;
      qt = 1;
      var w = It;
      It |= 4, Oo.current = null, rh(n, l), Bd(l, n), su(mo), Oa = !!os, mo = os = null, n.current = l, gy(l), Ja(), It = w, qt = y, yr.transition = d;
    } else n.current = l;
    if (sf && (sf = !1, Zi = n, Fs = c), d = n.pendingLanes, d === 0 && (Fl = null), Wu(l.stateNode), sa(n, bt()), r !== null) for (u = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], u(c.value, { componentStack: c.stack, digest: c.digest });
    if (Ru) throw Ru = !1, n = Lo, Lo = null, n;
    return Fs & 1 && n.tag !== 0 && ku(), d = n.pendingLanes, d & 1 ? n === _u ? Pl++ : (Pl = 0, _u = n) : Pl = 0, wi(), null;
  }
  function ku() {
    if (Zi !== null) {
      var n = tu(Fs), r = yr.transition, l = qt;
      try {
        if (yr.transition = null, qt = 16 > n ? 16 : n, Zi === null) var u = !1;
        else {
          if (n = Zi, Zi = null, Fs = 0, It & 6) throw Error(b(331));
          var c = It;
          for (It |= 4, Ye = n.current; Ye !== null; ) {
            var d = Ye, y = d.child;
            if (Ye.flags & 16) {
              var w = d.deletions;
              if (w !== null) {
                for (var k = 0; k < w.length; k++) {
                  var Q = w[k];
                  for (Ye = Q; Ye !== null; ) {
                    var me = Ye;
                    switch (me.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, me, d);
                    }
                    var Ce = me.child;
                    if (Ce !== null) Ce.return = me, Ye = Ce;
                    else for (; Ye !== null; ) {
                      me = Ye;
                      var ve = me.sibling, He = me.return;
                      if (of(me), me === Q) {
                        Ye = null;
                        break;
                      }
                      if (ve !== null) {
                        ve.return = He, Ye = ve;
                        break;
                      }
                      Ye = He;
                    }
                  }
                }
                var We = d.alternate;
                if (We !== null) {
                  var qe = We.child;
                  if (qe !== null) {
                    We.child = null;
                    do {
                      var Fn = qe.sibling;
                      qe.sibling = null, qe = Fn;
                    } while (qe !== null);
                  }
                }
                Ye = d;
              }
            }
            if (d.subtreeFlags & 2064 && y !== null) y.return = d, Ye = y;
            else e: for (; Ye !== null; ) {
              if (d = Ye, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, d, d.return);
              }
              var F = d.sibling;
              if (F !== null) {
                F.return = d.return, Ye = F;
                break e;
              }
              Ye = d.return;
            }
          }
          var j = n.current;
          for (Ye = j; Ye !== null; ) {
            y = Ye;
            var I = y.child;
            if (y.subtreeFlags & 2064 && I !== null) I.return = y, Ye = I;
            else e: for (y = j; Ye !== null; ) {
              if (w = Ye, w.flags & 2048) try {
                switch (w.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ls(9, w);
                }
              } catch (Ge) {
                En(w, w.return, Ge);
              }
              if (w === y) {
                Ye = null;
                break e;
              }
              var ye = w.sibling;
              if (ye !== null) {
                ye.return = w.return, Ye = ye;
                break e;
              }
              Ye = w.return;
            }
          }
          if (It = c, wi(), Jr && typeof Jr.onPostCommitFiberRoot == "function") try {
            Jr.onPostCommitFiberRoot(yl, n);
          } catch {
          }
          u = !0;
        }
        return u;
      } finally {
        qt = l, yr.transition = r;
      }
    }
    return !1;
  }
  function dh(n, r, l) {
    r = No(l, r), r = Wv(n, r, 1), n = Ll(n, r, 1), r = Kn(), n !== null && (Hi(n, 1, r), sa(n, r));
  }
  function En(n, r, l) {
    if (n.tag === 3) dh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        dh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var u = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (Fl === null || !Fl.has(u))) {
          n = No(l, n), n = Ad(r, n, 1), r = Ll(r, n, 1), n = Kn(), r !== null && (Hi(r, 1, n), sa(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function by(n, r, l) {
    var u = n.pingCache;
    u !== null && u.delete(r), r = Kn(), n.pingedLanes |= n.suspendedLanes & l, nr === n && (gr & l) === l && (Un === 4 || Un === 3 && (gr & 130023424) === gr && 500 > bt() - Yd ? el(n, 0) : uf |= l), sa(n, r);
  }
  function ph(n, r) {
    r === 0 && (n.mode & 1 ? (r = ya, ya <<= 1, !(ya & 130023424) && (ya = 4194304)) : r = 1);
    var l = Kn();
    n = Ea(n, r), n !== null && (Hi(n, r, l), sa(n, l));
  }
  function wy(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), ph(n, l);
  }
  function vh(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var u = n.stateNode, c = n.memoizedState;
        c !== null && (l = c.retryLane);
        break;
      case 19:
        u = n.stateNode;
        break;
      default:
        throw Error(b(314));
    }
    u !== null && u.delete(r), ph(n, l);
  }
  var hh;
  hh = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || er.current) Qn = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return Qn = !1, Ds(n, r, l);
      Qn = !!(n.flags & 131072);
    }
    else Qn = !1, Sn && r.flags & 1048576 && Fv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var u = r.type;
        Pa(n, r), n = r.pendingProps;
        var c = ta(r, jn.current);
        Tn(r, l), c = Ml(null, r, u, n, c, l);
        var d = li();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, In(u) ? (d = !0, ir(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, _d(r), c.updater = Zc, r.stateNode = c, c._reactInternals = r, ws(r, u, n, l), r = _s(null, r, u, !0, d, l)) : (r.tag = 0, Sn && d && Dc(r), mr(null, r, c, l), r = r.child), r;
      case 16:
        u = r.elementType;
        e: {
          switch (Pa(n, r), n = r.pendingProps, c = u._init, u = c(u._payload), r.type = u, c = r.tag = Ry(u), n = oi(u, n), c) {
            case 0:
              r = Kv(null, r, u, n, l);
              break e;
            case 1:
              r = qv(null, r, u, n, l);
              break e;
            case 11:
              r = la(null, r, u, n, l);
              break e;
            case 14:
              r = jo(null, r, u, oi(u.type, n), l);
              break e;
          }
          throw Error(b(
            306,
            u,
            ""
          ));
        }
        return r;
      case 0:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : oi(u, c), Kv(n, r, u, c, l);
      case 1:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : oi(u, c), qv(n, r, u, c, l);
      case 3:
        e: {
          if (Cu(r), n === null) throw Error(b(387));
          u = r.pendingProps, d = r.memoizedState, c = d.element, Vv(n, r), ds(r, u, null, l);
          var y = r.memoizedState;
          if (u = y.element, d.isDehydrated) if (d = { element: u, isDehydrated: !1, cache: y.cache, pendingSuspenseBoundaries: y.pendingSuspenseBoundaries, transitions: y.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = No(Error(b(423)), r), r = Xv(n, r, u, l, c);
            break e;
          } else if (u !== c) {
            c = No(Error(b(424)), r), r = Xv(n, r, u, l, c);
            break e;
          } else for (ra = Ci(r.stateNode.containerInfo.firstChild), na = r, Sn = !0, Ua = null, l = ze(r, null, u, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Ol(), u === c) {
              r = Ha(n, r, l);
              break e;
            }
            mr(n, r, u, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Iv(r), n === null && Ed(r), u = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, y = c.children, wc(u, c) ? y = null : d !== null && wc(u, d) && (r.flags |= 32), Ud(n, r), mr(n, r, y, l), r.child;
      case 6:
        return n === null && Ed(r), null;
      case 13:
        return rf(n, r, l);
      case 4:
        return Dd(r, r.stateNode.containerInfo), u = r.pendingProps, n === null ? r.child = Mn(r, null, u, l) : mr(n, r, u, l), r.child;
      case 11:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : oi(u, c), la(n, r, u, c, l);
      case 7:
        return mr(n, r, r.pendingProps, l), r.child;
      case 8:
        return mr(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return mr(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (u = r.type._context, c = r.pendingProps, d = r.memoizedProps, y = c.value, et(Sa, u._currentValue), u._currentValue = y, d !== null) if (ai(d.value, y)) {
            if (d.children === c.children && !er.current) {
              r = Ha(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var w = d.dependencies;
            if (w !== null) {
              y = d.child;
              for (var k = w.firstContext; k !== null; ) {
                if (k.context === u) {
                  if (d.tag === 1) {
                    k = qi(-1, l & -l), k.tag = 2;
                    var Q = d.updateQueue;
                    if (Q !== null) {
                      Q = Q.shared;
                      var me = Q.pending;
                      me === null ? k.next = k : (k.next = me.next, me.next = k), Q.pending = k;
                    }
                  }
                  d.lanes |= l, k = d.alternate, k !== null && (k.lanes |= l), wd(
                    d.return,
                    l,
                    r
                  ), w.lanes |= l;
                  break;
                }
                k = k.next;
              }
            } else if (d.tag === 10) y = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (y = d.return, y === null) throw Error(b(341));
              y.lanes |= l, w = y.alternate, w !== null && (w.lanes |= l), wd(y, l, r), y = d.sibling;
            } else y = d.child;
            if (y !== null) y.return = d;
            else for (y = d; y !== null; ) {
              if (y === r) {
                y = null;
                break;
              }
              if (d = y.sibling, d !== null) {
                d.return = y.return, y = d;
                break;
              }
              y = y.return;
            }
            d = y;
          }
          mr(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, u = r.pendingProps.children, Tn(r, l), c = Fa(c), u = u(c), r.flags |= 1, mr(n, r, u, l), r.child;
      case 14:
        return u = r.type, c = oi(u, r.pendingProps), c = oi(u.type, c), jo(n, r, u, c, l);
      case 15:
        return Rt(n, r, r.type, r.pendingProps, l);
      case 17:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : oi(u, c), Pa(n, r), r.tag = 1, In(u) ? (n = !0, ir(r)) : n = !1, Tn(r, l), ef(r, u, c), ws(r, u, c, l), _s(null, r, u, !0, n, l);
      case 19:
        return ki(n, r, l);
      case 22:
        return Rs(n, r, l);
    }
    throw Error(b(156, r.tag));
  };
  function mh(n, r) {
    return mn(n, r);
  }
  function Ty(n, r, l, u) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ba(n, r, l, u) {
    return new Ty(n, r, l, u);
  }
  function qd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Ry(n) {
    if (typeof n == "function") return qd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Je) return 11;
      if (n === nt) return 14;
    }
    return 2;
  }
  function Hl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Ba(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Vs(n, r, l, u, c, d) {
    var y = 2;
    if (u = n, typeof n == "function") qd(n) && (y = 1);
    else if (typeof n == "string") y = 5;
    else e: switch (n) {
      case U:
        return tl(l.children, c, d, r);
      case pe:
        y = 8, c |= 8;
        break;
      case ue:
        return n = Ba(12, l, r, c | 2), n.elementType = ue, n.lanes = d, n;
      case re:
        return n = Ba(13, l, r, c), n.elementType = re, n.lanes = d, n;
      case Fe:
        return n = Ba(19, l, r, c), n.elementType = Fe, n.lanes = d, n;
      case Me:
        return Vl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case be:
            y = 10;
            break e;
          case je:
            y = 9;
            break e;
          case Je:
            y = 11;
            break e;
          case nt:
            y = 14;
            break e;
          case pt:
            y = 16, u = null;
            break e;
        }
        throw Error(b(130, n == null ? n : typeof n, ""));
    }
    return r = Ba(y, l, r, c), r.elementType = n, r.type = u, r.lanes = d, r;
  }
  function tl(n, r, l, u) {
    return n = Ba(7, n, u, r), n.lanes = l, n;
  }
  function Vl(n, r, l, u) {
    return n = Ba(22, n, u, r), n.elementType = Me, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Xd(n, r, l) {
    return n = Ba(6, n, null, r), n.lanes = l, n;
  }
  function df(n, r, l) {
    return r = Ba(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function yh(n, r, l, u, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = eu(0), this.expirationTimes = eu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = eu(0), this.identifierPrefix = u, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function pf(n, r, l, u, c, d, y, w, k) {
    return n = new yh(n, r, l, w, k), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = Ba(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: u, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, _d(d), n;
  }
  function _y(n, r, l) {
    var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: se, key: u == null ? null : "" + u, children: n, containerInfo: r, implementation: l };
  }
  function Jd(n) {
    if (!n) return kr;
    n = n._reactInternals;
    e: {
      if (xt(n) !== n || n.tag !== 1) throw Error(b(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (In(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(b(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (In(l)) return cs(n, l, r);
    }
    return r;
  }
  function gh(n, r, l, u, c, d, y, w, k) {
    return n = pf(l, u, !0, n, c, d, y, w, k), n.context = Jd(null), l = n.current, u = Kn(), c = Oi(l), d = qi(u, c), d.callback = r ?? null, Ll(l, d, c), n.current.lanes = c, Hi(n, c, u), sa(n, u), n;
  }
  function vf(n, r, l, u) {
    var c = r.current, d = Kn(), y = Oi(c);
    return l = Jd(l), r.context === null ? r.context = l : r.pendingContext = l, r = qi(d, y), r.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (r.callback = u), n = Ll(c, r, y), n !== null && (Br(n, c, y, d), Lc(n, c, y)), y;
  }
  function hf(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function Zd(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function mf(n, r) {
    Zd(n, r), (n = n.alternate) && Zd(n, r);
  }
  function Sh() {
    return null;
  }
  var Uo = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function ep(n) {
    this._internalRoot = n;
  }
  yf.prototype.render = ep.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(b(409));
    vf(n, r, null, null);
  }, yf.prototype.unmount = ep.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Ao(function() {
        vf(null, n, null, null);
      }), r[Qi] = null;
    }
  };
  function yf(n) {
    this._internalRoot = n;
  }
  yf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = ht();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < Zn.length && r !== 0 && r < Zn[l].priority; l++) ;
      Zn.splice(l, 0, n), l === 0 && qu(n);
    }
  };
  function tp(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function gf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function Eh() {
  }
  function ky(n, r, l, u, c) {
    if (c) {
      if (typeof u == "function") {
        var d = u;
        u = function() {
          var Q = hf(y);
          d.call(Q);
        };
      }
      var y = gh(r, u, n, 0, null, !1, !1, "", Eh);
      return n._reactRootContainer = y, n[Qi] = y.current, fu(n.nodeType === 8 ? n.parentNode : n), Ao(), y;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof u == "function") {
      var w = u;
      u = function() {
        var Q = hf(k);
        w.call(Q);
      };
    }
    var k = pf(n, 0, !1, null, null, !1, !1, "", Eh);
    return n._reactRootContainer = k, n[Qi] = k.current, fu(n.nodeType === 8 ? n.parentNode : n), Ao(function() {
      vf(r, k, l, u);
    }), k;
  }
  function Bs(n, r, l, u, c) {
    var d = l._reactRootContainer;
    if (d) {
      var y = d;
      if (typeof c == "function") {
        var w = c;
        c = function() {
          var k = hf(y);
          w.call(k);
        };
      }
      vf(r, y, n, c);
    } else y = ky(l, r, n, c, u);
    return hf(y);
  }
  Qt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = ei(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), sa(r, bt()), !(It & 6) && (Tu = bt() + 500, wi()));
        }
        break;
      case 13:
        Ao(function() {
          var u = Ea(n, 1);
          if (u !== null) {
            var c = Kn();
            Br(u, n, 1, c);
          }
        }), mf(n, 1);
    }
  }, Gu = function(n) {
    if (n.tag === 13) {
      var r = Ea(n, 134217728);
      if (r !== null) {
        var l = Kn();
        Br(r, n, 134217728, l);
      }
      mf(n, 134217728);
    }
  }, mi = function(n) {
    if (n.tag === 13) {
      var r = Oi(n), l = Ea(n, r);
      if (l !== null) {
        var u = Kn();
        Br(l, n, r, u);
      }
      mf(n, r);
    }
  }, ht = function() {
    return qt;
  }, nu = function(n, r) {
    var l = qt;
    try {
      return qt = n, r();
    } finally {
      qt = l;
    }
  }, Tt = function(n, r, l) {
    switch (r) {
      case "input":
        if (cr(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var u = l[r];
            if (u !== n && u.form === n.form) {
              var c = wn(u);
              if (!c) throw Error(b(90));
              Hn(u), cr(u, c);
            }
          }
        }
        break;
      case "textarea":
        ha(n, l);
        break;
      case "select":
        r = l.value, r != null && xn(n, !!l.multiple, r, !1);
    }
  }, no = Wd, vl = Ao;
  var Dy = { usingClientEntryPoint: !1, Events: [rt, ii, wn, fr, to, Wd] }, Is = { findFiberByHostInstance: yo, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Ch = { bundleType: Is.bundleType, version: Is.version, rendererPackageName: Is.rendererPackageName, rendererConfig: Is.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Se.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Ln(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Is.findFiberByHostInstance || Sh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Bl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Bl.isDisabled && Bl.supportsFiber) try {
      yl = Bl.inject(Ch), Jr = Bl;
    } catch {
    }
  }
  return Ga.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Dy, Ga.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!tp(r)) throw Error(b(200));
    return _y(n, r, null, l);
  }, Ga.createRoot = function(n, r) {
    if (!tp(n)) throw Error(b(299));
    var l = !1, u = "", c = Uo;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (u = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = pf(n, 1, !1, null, null, l, !1, u, c), n[Qi] = r.current, fu(n.nodeType === 8 ? n.parentNode : n), new ep(r);
  }, Ga.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(b(188)) : (n = Object.keys(n).join(","), Error(b(268, n)));
    return n = Ln(r), n = n === null ? null : n.stateNode, n;
  }, Ga.flushSync = function(n) {
    return Ao(n);
  }, Ga.hydrate = function(n, r, l) {
    if (!gf(r)) throw Error(b(200));
    return Bs(null, n, r, !0, l);
  }, Ga.hydrateRoot = function(n, r, l) {
    if (!tp(n)) throw Error(b(405));
    var u = l != null && l.hydratedSources || null, c = !1, d = "", y = Uo;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (y = l.onRecoverableError)), r = gh(r, null, n, 1, l ?? null, c, !1, d, y), n[Qi] = r.current, fu(n), u) for (n = 0; n < u.length; n++) l = u[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new yf(r);
  }, Ga.render = function(n, r, l) {
    if (!gf(r)) throw Error(b(200));
    return Bs(null, n, r, !1, l);
  }, Ga.unmountComponentAtNode = function(n) {
    if (!gf(n)) throw Error(b(40));
    return n._reactRootContainer ? (Ao(function() {
      Bs(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Ga.unstable_batchedUpdates = Wd, Ga.unstable_renderSubtreeIntoContainer = function(n, r, l, u) {
    if (!gf(l)) throw Error(b(200));
    if (n == null || n._reactInternals === void 0) throw Error(b(38));
    return Bs(n, r, l, !1, u);
  }, Ga.version = "18.3.1-next-f1338f8080-20240426", Ga;
}
var Ka = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yw;
function _D() {
  return yw || (yw = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var C = A, E = bw(), b = C.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, q = !1;
    function ee(e) {
      q = e;
    }
    function D(e) {
      if (!q) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        ae("warn", e, a);
      }
    }
    function g(e) {
      if (!q) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        ae("error", e, a);
      }
    }
    function ae(e, t, a) {
      {
        var i = b.ReactDebugCurrentFrame, o = i.getStackAddendum();
        o !== "" && (t += "%s", a = a.concat([o]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var L = 0, z = 1, ge = 2, P = 3, G = 4, te = 5, ne = 6, X = 7, fe = 8, Le = 9, oe = 10, Ee = 11, Se = 12, le = 13, se = 14, U = 15, pe = 16, ue = 17, be = 18, je = 19, Je = 21, re = 22, Fe = 23, nt = 24, pt = 25, Me = !0, he = !1, Be = !1, Re = !1, T = !1, M = !0, Oe = !0, $e = !0, St = !0, vt = /* @__PURE__ */ new Set(), mt = {}, Et = {};
    function _t(e, t) {
      Kt(e, t), Kt(e + "Capture", t);
    }
    function Kt(e, t) {
      mt[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), mt[e] = t;
      {
        var a = e.toLowerCase();
        Et[a] = e, e === "onDoubleClick" && (Et.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        vt.add(t[i]);
    }
    var Cn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Hn = Object.prototype.hasOwnProperty;
    function hn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function Xn(e) {
      try {
        return Ht(e), !1;
      } catch {
        return !0;
      }
    }
    function Ht(e) {
      return "" + e;
    }
    function kn(e, t) {
      if (Xn(e))
        return g("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, hn(e)), Ht(e);
    }
    function cr(e) {
      if (Xn(e))
        return g("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", hn(e)), Ht(e);
    }
    function Da(e, t) {
      if (Xn(e))
        return g("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, hn(e)), Ht(e);
    }
    function _r(e, t) {
      if (Xn(e))
        return g("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, hn(e)), Ht(e);
    }
    function Dn(e) {
      if (Xn(e))
        return g("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", hn(e)), Ht(e);
    }
    function xn(e) {
      if (Xn(e))
        return g("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", hn(e)), Ht(e);
    }
    var On = 0, Jn = 1, ha = 2, Nn = 3, ar = 4, Or = 5, ma = 6, Lr = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", _e = Lr + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", Xe = new RegExp("^[" + Lr + "][" + _e + "]*$"), wt = {}, Te = {};
    function B(e) {
      return Hn.call(Te, e) ? !0 : Hn.call(wt, e) ? !1 : Xe.test(e) ? (Te[e] = !0, !0) : (wt[e] = !0, g("Invalid attribute name: `%s`", e), !1);
    }
    function ke(e, t, a) {
      return t !== null ? t.type === On : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function tt(e, t, a, i) {
      if (a !== null && a.type === On)
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
          var o = e.toLowerCase().slice(0, 5);
          return o !== "data-" && o !== "aria-";
        }
        default:
          return !1;
      }
    }
    function Vt(e, t, a, i) {
      if (t === null || typeof t > "u" || tt(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Nn:
            return !t;
          case ar:
            return t === !1;
          case Or:
            return isNaN(t);
          case ma:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function Nt(e) {
      return Tt.hasOwnProperty(e) ? Tt[e] : null;
    }
    function jt(e, t, a, i, o, s, f) {
      this.acceptsBooleans = t === ha || t === Nn || t === ar, this.attributeName = i, this.attributeNamespace = o, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var Tt = {}, Ut = [
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
    Ut.forEach(function(e) {
      Tt[e] = new jt(
        e,
        On,
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
      Tt[t] = new jt(
        t,
        Jn,
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
      Tt[e] = new jt(
        e,
        ha,
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
      Tt[e] = new jt(
        e,
        ha,
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
      Tt[e] = new jt(
        e,
        Nn,
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
      Tt[e] = new jt(
        e,
        Nn,
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
      Tt[e] = new jt(
        e,
        ar,
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
      Tt[e] = new jt(
        e,
        ma,
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
      Tt[e] = new jt(
        e,
        Or,
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
    var zt = /[\-\:]([a-z])/g, Vn = function(e) {
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
      var t = e.replace(zt, Vn);
      Tt[t] = new jt(
        t,
        Jn,
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
      var t = e.replace(zt, Vn);
      Tt[t] = new jt(
        t,
        Jn,
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
      var t = e.replace(zt, Vn);
      Tt[t] = new jt(
        t,
        Jn,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Tt[e] = new jt(
        e,
        Jn,
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
    var fr = "xlinkHref";
    Tt[fr] = new jt(
      "xlinkHref",
      Jn,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Tt[e] = new jt(
        e,
        Jn,
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
    var to = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, no = !1;
    function vl(e) {
      !no && to.test(e) && (no = !0, g("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function hl(e, t, a, i) {
      if (i.mustUseProperty) {
        var o = i.propertyName;
        return e[o];
      } else {
        kn(a, t), i.sanitizeURL && vl("" + a);
        var s = i.attributeName, f = null;
        if (i.type === ar) {
          if (e.hasAttribute(s)) {
            var v = e.getAttribute(s);
            return v === "" ? !0 : Vt(t, a, i, !1) ? v : v === "" + a ? a : v;
          }
        } else if (e.hasAttribute(s)) {
          if (Vt(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === Nn)
            return a;
          f = e.getAttribute(s);
        }
        return Vt(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function ro(e, t, a, i) {
      {
        if (!B(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var o = e.getAttribute(t);
        return kn(a, t), o === "" + a ? a : o;
      }
    }
    function Mr(e, t, a, i) {
      var o = Nt(t);
      if (!ke(t, o, i)) {
        if (Vt(t, a, o, i) && (a = null), i || o === null) {
          if (B(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (kn(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = o.mustUseProperty;
        if (f) {
          var v = o.propertyName;
          if (a === null) {
            var h = o.type;
            e[v] = h === Nn ? !1 : "";
          } else
            e[v] = a;
          return;
        }
        var S = o.attributeName, x = o.attributeNamespace;
        if (a === null)
          e.removeAttribute(S);
        else {
          var O = o.type, N;
          O === Nn || O === ar && a === !0 ? N = "" : (kn(a, S), N = "" + a, o.sanitizeURL && vl(N.toString())), x ? e.setAttributeNS(x, S, N) : e.setAttribute(S, N);
        }
      }
    }
    var Ar = Symbol.for("react.element"), dr = Symbol.for("react.portal"), pi = Symbol.for("react.fragment"), qa = Symbol.for("react.strict_mode"), vi = Symbol.for("react.profiler"), hi = Symbol.for("react.provider"), _ = Symbol.for("react.context"), ce = Symbol.for("react.forward_ref"), Ae = Symbol.for("react.suspense"), Qe = Symbol.for("react.suspense_list"), xt = Symbol.for("react.memo"), yt = Symbol.for("react.lazy"), Mt = Symbol.for("react.scope"), Ot = Symbol.for("react.debug_trace_mode"), Ln = Symbol.for("react.offscreen"), dn = Symbol.for("react.legacy_hidden"), mn = Symbol.for("react.cache"), pr = Symbol.for("react.tracing_marker"), Xa = Symbol.iterator, Ja = "@@iterator";
    function bt(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Xa && e[Xa] || e[Ja];
      return typeof t == "function" ? t : null;
    }
    var kt = Object.assign, Za = 0, ao, io, ml, qo, yl, Jr, Wu;
    function zr() {
    }
    zr.__reactDisabledLog = !0;
    function sc() {
      {
        if (Za === 0) {
          ao = console.log, io = console.info, ml = console.warn, qo = console.error, yl = console.group, Jr = console.groupCollapsed, Wu = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: zr,
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
        Za++;
      }
    }
    function cc() {
      {
        if (Za--, Za === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: kt({}, e, {
              value: ao
            }),
            info: kt({}, e, {
              value: io
            }),
            warn: kt({}, e, {
              value: ml
            }),
            error: kt({}, e, {
              value: qo
            }),
            group: kt({}, e, {
              value: yl
            }),
            groupCollapsed: kt({}, e, {
              value: Jr
            }),
            groupEnd: kt({}, e, {
              value: Wu
            })
          });
        }
        Za < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Xo = b.ReactCurrentDispatcher, gl;
    function ya(e, t, a) {
      {
        if (gl === void 0)
          try {
            throw Error();
          } catch (o) {
            var i = o.stack.trim().match(/\n( *(at )?)/);
            gl = i && i[1] || "";
          }
        return `
` + gl + e;
      }
    }
    var ei = !1, ti;
    {
      var Jo = typeof WeakMap == "function" ? WeakMap : Map;
      ti = new Jo();
    }
    function lo(e, t) {
      if (!e || ei)
        return "";
      {
        var a = ti.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      ei = !0;
      var o = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = Xo.current, Xo.current = null, sc();
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
            } catch (W) {
              i = W;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (W) {
              i = W;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (W) {
            i = W;
          }
          e();
        }
      } catch (W) {
        if (W && i && typeof W.stack == "string") {
          for (var v = W.stack.split(`
`), h = i.stack.split(`
`), S = v.length - 1, x = h.length - 1; S >= 1 && x >= 0 && v[S] !== h[x]; )
            x--;
          for (; S >= 1 && x >= 0; S--, x--)
            if (v[S] !== h[x]) {
              if (S !== 1 || x !== 1)
                do
                  if (S--, x--, x < 0 || v[S] !== h[x]) {
                    var O = `
` + v[S].replace(" at new ", " at ");
                    return e.displayName && O.includes("<anonymous>") && (O = O.replace("<anonymous>", e.displayName)), typeof e == "function" && ti.set(e, O), O;
                  }
                while (S >= 1 && x >= 0);
              break;
            }
        }
      } finally {
        ei = !1, Xo.current = s, cc(), Error.prepareStackTrace = o;
      }
      var N = e ? e.displayName || e.name : "", $ = N ? ya(N) : "";
      return typeof e == "function" && ti.set(e, $), $;
    }
    function Sl(e, t, a) {
      return lo(e, !0);
    }
    function Zo(e, t, a) {
      return lo(e, !1);
    }
    function eu(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Hi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return lo(e, eu(e));
      if (typeof e == "string")
        return ya(e);
      switch (e) {
        case Ae:
          return ya("Suspense");
        case Qe:
          return ya("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ce:
            return Zo(e.render);
          case xt:
            return Hi(e.type, t, a);
          case yt: {
            var i = e, o = i._payload, s = i._init;
            try {
              return Hi(s(o), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function qf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case te:
          return ya(e.type);
        case pe:
          return ya("Lazy");
        case le:
          return ya("Suspense");
        case je:
          return ya("SuspenseList");
        case L:
        case ge:
        case U:
          return Zo(e.type);
        case Ee:
          return Zo(e.type.render);
        case z:
          return Sl(e.type);
        default:
          return "";
      }
    }
    function Vi(e) {
      try {
        var t = "", a = e;
        do
          t += qf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function qt(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var o = t.displayName || t.name || "";
      return o !== "" ? a + "(" + o + ")" : a;
    }
    function tu(e) {
      return e.displayName || "Context";
    }
    function Qt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && g("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case pi:
          return "Fragment";
        case dr:
          return "Portal";
        case vi:
          return "Profiler";
        case qa:
          return "StrictMode";
        case Ae:
          return "Suspense";
        case Qe:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case _:
            var t = e;
            return tu(t) + ".Consumer";
          case hi:
            var a = e;
            return tu(a._context) + ".Provider";
          case ce:
            return qt(e, e.render, "ForwardRef");
          case xt:
            var i = e.displayName || null;
            return i !== null ? i : Qt(e.type) || "Memo";
          case yt: {
            var o = e, s = o._payload, f = o._init;
            try {
              return Qt(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Gu(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function mi(e) {
      return e.displayName || "Context";
    }
    function ht(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case nt:
          return "Cache";
        case Le:
          var i = a;
          return mi(i) + ".Consumer";
        case oe:
          var o = a;
          return mi(o._context) + ".Provider";
        case be:
          return "DehydratedFragment";
        case Ee:
          return Gu(a, a.render, "ForwardRef");
        case X:
          return "Fragment";
        case te:
          return a;
        case G:
          return "Portal";
        case P:
          return "Root";
        case ne:
          return "Text";
        case pe:
          return Qt(a);
        case fe:
          return a === qa ? "StrictMode" : "Mode";
        case re:
          return "Offscreen";
        case Se:
          return "Profiler";
        case Je:
          return "Scope";
        case le:
          return "Suspense";
        case je:
          return "SuspenseList";
        case pt:
          return "TracingMarker";
        case z:
        case L:
        case ue:
        case ge:
        case se:
        case U:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var nu = b.ReactDebugCurrentFrame, vr = null, yi = !1;
    function Ur() {
      {
        if (vr === null)
          return null;
        var e = vr._debugOwner;
        if (e !== null && typeof e < "u")
          return ht(e);
      }
      return null;
    }
    function gi() {
      return vr === null ? "" : Vi(vr);
    }
    function yn() {
      nu.getCurrentStack = null, vr = null, yi = !1;
    }
    function an(e) {
      nu.getCurrentStack = e === null ? null : gi, vr = e, yi = !1;
    }
    function El() {
      return vr;
    }
    function Zn(e) {
      yi = e;
    }
    function Fr(e) {
      return "" + e;
    }
    function Na(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return xn(e), e;
        default:
          return "";
      }
    }
    var oo = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Ku(e, t) {
      oo[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || g("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || g("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function qu(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Cl(e) {
      return e._valueTracker;
    }
    function uo(e) {
      e._valueTracker = null;
    }
    function Xf(e) {
      var t = "";
      return e && (qu(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function ja(e) {
      var t = qu(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      xn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var o = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return o.call(this);
          },
          set: function(v) {
            xn(v), i = "" + v, s.call(this, v);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(v) {
            xn(v), i = "" + v;
          },
          stopTracking: function() {
            uo(e), delete e[t];
          }
        };
        return f;
      }
    }
    function ni(e) {
      Cl(e) || (e._valueTracker = ja(e));
    }
    function Si(e) {
      if (!e)
        return !1;
      var t = Cl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Xf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function Oa(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var ru = !1, au = !1, xl = !1, so = !1;
    function iu(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function lu(e, t) {
      var a = e, i = t.checked, o = kt({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return o;
    }
    function ri(e, t) {
      Ku("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !au && (g("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Ur() || "A component", t.type), au = !0), t.value !== void 0 && t.defaultValue !== void 0 && !ru && (g("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Ur() || "A component", t.type), ru = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: Na(t.value != null ? t.value : i),
        controlled: iu(t)
      };
    }
    function m(e, t) {
      var a = e, i = t.checked;
      i != null && Mr(a, "checked", i, !1);
    }
    function R(e, t) {
      var a = e;
      {
        var i = iu(t);
        !a._wrapperState.controlled && i && !so && (g("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), so = !0), a._wrapperState.controlled && !i && !xl && (g("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), xl = !0);
      }
      m(e, t);
      var o = Na(t.value), s = t.type;
      if (o != null)
        s === "number" ? (o === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != o) && (a.value = Fr(o)) : a.value !== Fr(o) && (a.value = Fr(o));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? it(a, t.type, o) : t.hasOwnProperty("defaultValue") && it(a, t.type, Na(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function Y(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var o = t.type, s = o === "submit" || o === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Fr(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var v = i.name;
      v !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, v !== "" && (i.name = v);
    }
    function K(e, t) {
      var a = e;
      R(a, t), we(a, t);
    }
    function we(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        kn(a, "name");
        for (var o = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < o.length; s++) {
          var f = o[s];
          if (!(f === e || f.form !== e.form)) {
            var v = Ph(f);
            if (!v)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            Si(f), R(f, v);
          }
        }
      }
    }
    function it(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || Oa(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Fr(e._wrapperState.initialValue) : e.defaultValue !== Fr(a) && (e.defaultValue = Fr(a)));
    }
    var Ne = !1, ut = !1, At = !1;
    function Wt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? C.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || ut || (ut = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (At || (At = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !Ne && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), Ne = !0);
    }
    function pn(e, t) {
      t.value != null && e.setAttribute("value", Fr(Na(t.value)));
    }
    var ln = Array.isArray;
    function Dt(e) {
      return ln(e);
    }
    var on;
    on = !1;
    function bn() {
      var e = Ur();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var bl = ["value", "defaultValue"];
    function Xu(e) {
      {
        Ku("select", e);
        for (var t = 0; t < bl.length; t++) {
          var a = bl[t];
          if (e[a] != null) {
            var i = Dt(e[a]);
            e.multiple && !i ? g("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, bn()) : !e.multiple && i && g("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, bn());
          }
        }
      }
    }
    function Bi(e, t, a, i) {
      var o = e.options;
      if (t) {
        for (var s = a, f = {}, v = 0; v < s.length; v++)
          f["$" + s[v]] = !0;
        for (var h = 0; h < o.length; h++) {
          var S = f.hasOwnProperty("$" + o[h].value);
          o[h].selected !== S && (o[h].selected = S), S && i && (o[h].defaultSelected = !0);
        }
      } else {
        for (var x = Fr(Na(a)), O = null, N = 0; N < o.length; N++) {
          if (o[N].value === x) {
            o[N].selected = !0, i && (o[N].defaultSelected = !0);
            return;
          }
          O === null && !o[N].disabled && (O = o[N]);
        }
        O !== null && (O.selected = !0);
      }
    }
    function Ju(e, t) {
      return kt({}, t, {
        value: void 0
      });
    }
    function co(e, t) {
      var a = e;
      Xu(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !on && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), on = !0);
    }
    function Jf(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Bi(a, !!t.multiple, i, !1) : t.defaultValue != null && Bi(a, !!t.multiple, t.defaultValue, !0);
    }
    function fc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var o = t.value;
      o != null ? Bi(a, !!t.multiple, o, !1) : i !== !!t.multiple && (t.defaultValue != null ? Bi(a, !!t.multiple, t.defaultValue, !0) : Bi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Zf(e, t) {
      var a = e, i = t.value;
      i != null && Bi(a, !!t.multiple, i, !1);
    }
    var uv = !1;
    function ed(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = kt({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Fr(a._wrapperState.initialValue)
      });
      return i;
    }
    function td(e, t) {
      var a = e;
      Ku("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !uv && (g("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Ur() || "A component"), uv = !0);
      var i = t.value;
      if (i == null) {
        var o = t.children, s = t.defaultValue;
        if (o != null) {
          g("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (Dt(o)) {
              if (o.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              o = o[0];
            }
            s = o;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: Na(i)
      };
    }
    function sv(e, t) {
      var a = e, i = Na(t.value), o = Na(t.defaultValue);
      if (i != null) {
        var s = Fr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      o != null && (a.defaultValue = Fr(o));
    }
    function cv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ay(e, t) {
      sv(e, t);
    }
    var Ii = "http://www.w3.org/1999/xhtml", nd = "http://www.w3.org/1998/Math/MathML", rd = "http://www.w3.org/2000/svg";
    function ad(e) {
      switch (e) {
        case "svg":
          return rd;
        case "math":
          return nd;
        default:
          return Ii;
      }
    }
    function id(e, t) {
      return e == null || e === Ii ? ad(t) : e === rd && t === "foreignObject" ? Ii : e;
    }
    var fv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, o) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, o);
        });
      } : e;
    }, dc, dv = fv(function(e, t) {
      if (e.namespaceURI === rd && !("innerHTML" in e)) {
        dc = dc || document.createElement("div"), dc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = dc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Zr = 1, $i = 3, Bn = 8, Yi = 9, ld = 11, ou = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === $i) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Zu = {
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
    }, es = {
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
    function pv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var vv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(es).forEach(function(e) {
      vv.forEach(function(t) {
        es[pv(t, e)] = es[e];
      });
    });
    function pc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(es.hasOwnProperty(e) && es[e]) ? t + "px" : (_r(t, e), ("" + t).trim());
    }
    var hv = /([A-Z])/g, mv = /^ms-/;
    function uu(e) {
      return e.replace(hv, "-$1").toLowerCase().replace(mv, "-ms-");
    }
    var yv = function() {
    };
    {
      var iy = /^(?:webkit|moz|o)[A-Z]/, ly = /^-ms-/, gv = /-(.)/g, od = /;\s*$/, Ei = {}, fo = {}, Sv = !1, ts = !1, oy = function(e) {
        return e.replace(gv, function(t, a) {
          return a.toUpperCase();
        });
      }, Ev = function(e) {
        Ei.hasOwnProperty(e) && Ei[e] || (Ei[e] = !0, g(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          oy(e.replace(ly, "ms-"))
        ));
      }, ud = function(e) {
        Ei.hasOwnProperty(e) && Ei[e] || (Ei[e] = !0, g("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, sd = function(e, t) {
        fo.hasOwnProperty(t) && fo[t] || (fo[t] = !0, g(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(od, "")));
      }, Cv = function(e, t) {
        Sv || (Sv = !0, g("`NaN` is an invalid value for the `%s` css style property.", e));
      }, xv = function(e, t) {
        ts || (ts = !0, g("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      yv = function(e, t) {
        e.indexOf("-") > -1 ? Ev(e) : iy.test(e) ? ud(e) : od.test(t) && sd(e, t), typeof t == "number" && (isNaN(t) ? Cv(e, t) : isFinite(t) || xv(e, t));
      };
    }
    var bv = yv;
    function uy(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var o = e[i];
            if (o != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : uu(i)) + ":", t += pc(i, o, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function wv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var o = i.indexOf("--") === 0;
          o || bv(i, t[i]);
          var s = pc(i, t[i], o);
          i === "float" && (i = "cssFloat"), o ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function sy(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Tv(e) {
      var t = {};
      for (var a in e)
        for (var i = Zu[a] || [a], o = 0; o < i.length; o++)
          t[i[o]] = a;
      return t;
    }
    function cy(e, t) {
      {
        if (!t)
          return;
        var a = Tv(e), i = Tv(t), o = {};
        for (var s in a) {
          var f = a[s], v = i[s];
          if (v && f !== v) {
            var h = f + "," + v;
            if (o[h])
              continue;
            o[h] = !0, g("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", sy(e[f]) ? "Removing" : "Updating", f, v);
          }
        }
      }
    }
    var ai = {
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
    }, ns = kt({
      menuitem: !0
    }, ai), Rv = "__html";
    function vc(e, t) {
      if (t) {
        if (ns[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Rv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && g("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function wl(e, t) {
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
    var rs = {
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
    }, hc = {
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
    }, su = {}, fy = new RegExp("^(aria)-[" + _e + "]*$"), cu = new RegExp("^(aria)[A-Z][" + _e + "]*$");
    function cd(e, t) {
      {
        if (Hn.call(su, t) && su[t])
          return !0;
        if (cu.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = hc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return g("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), su[t] = !0, !0;
          if (t !== i)
            return g("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), su[t] = !0, !0;
        }
        if (fy.test(t)) {
          var o = t.toLowerCase(), s = hc.hasOwnProperty(o) ? o : null;
          if (s == null)
            return su[t] = !0, !1;
          if (t !== s)
            return g("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), su[t] = !0, !0;
        }
      }
      return !0;
    }
    function as(e, t) {
      {
        var a = [];
        for (var i in t) {
          var o = cd(e, i);
          o || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? g("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && g("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function fd(e, t) {
      wl(e, t) || as(e, t);
    }
    var dd = !1;
    function mc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !dd && (dd = !0, e === "select" && t.multiple ? g("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : g("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var po = function() {
    };
    {
      var hr = {}, pd = /^on./, yc = /^on[^A-Z]/, _v = new RegExp("^(aria)-[" + _e + "]*$"), kv = new RegExp("^(aria)[A-Z][" + _e + "]*$");
      po = function(e, t, a, i) {
        if (Hn.call(hr, t) && hr[t])
          return !0;
        var o = t.toLowerCase();
        if (o === "onfocusin" || o === "onfocusout")
          return g("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), hr[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var v = f.hasOwnProperty(o) ? f[o] : null;
          if (v != null)
            return g("Invalid event handler property `%s`. Did you mean `%s`?", t, v), hr[t] = !0, !0;
          if (pd.test(t))
            return g("Unknown event handler property `%s`. It will be ignored.", t), hr[t] = !0, !0;
        } else if (pd.test(t))
          return yc.test(t) && g("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), hr[t] = !0, !0;
        if (_v.test(t) || kv.test(t))
          return !0;
        if (o === "innerhtml")
          return g("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), hr[t] = !0, !0;
        if (o === "aria")
          return g("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), hr[t] = !0, !0;
        if (o === "is" && a !== null && a !== void 0 && typeof a != "string")
          return g("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), hr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return g("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), hr[t] = !0, !0;
        var h = Nt(t), S = h !== null && h.type === On;
        if (rs.hasOwnProperty(o)) {
          var x = rs[o];
          if (x !== t)
            return g("Invalid DOM property `%s`. Did you mean `%s`?", t, x), hr[t] = !0, !0;
        } else if (!S && t !== o)
          return g("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, o), hr[t] = !0, !0;
        return typeof a == "boolean" && tt(t, a, h, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), hr[t] = !0, !0) : S ? !0 : tt(t, a, h, !1) ? (hr[t] = !0, !1) : ((a === "false" || a === "true") && h !== null && h.type === Nn && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), hr[t] = !0), !0);
      };
    }
    var Dv = function(e, t, a) {
      {
        var i = [];
        for (var o in t) {
          var s = po(e, o, t[o], a);
          s || i.push(o);
        }
        var f = i.map(function(v) {
          return "`" + v + "`";
        }).join(", ");
        i.length === 1 ? g("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && g("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function Nv(e, t, a) {
      wl(e, t) || Dv(e, t, a);
    }
    var vd = 1, gc = 2, La = 4, hd = vd | gc | La, vo = null;
    function dy(e) {
      vo !== null && g("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), vo = e;
    }
    function py() {
      vo === null && g("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), vo = null;
    }
    function is(e) {
      return e === vo;
    }
    function md(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === $i ? t.parentNode : t;
    }
    var Sc = null, ho = null, nn = null;
    function Ec(e) {
      var t = ju(e);
      if (t) {
        if (typeof Sc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Ph(a);
          Sc(t.stateNode, t.type, i);
        }
      }
    }
    function Cc(e) {
      Sc = e;
    }
    function fu(e) {
      ho ? nn ? nn.push(e) : nn = [e] : ho = e;
    }
    function jv() {
      return ho !== null || nn !== null;
    }
    function xc() {
      if (ho) {
        var e = ho, t = nn;
        if (ho = null, nn = null, Ec(e), t)
          for (var a = 0; a < t.length; a++)
            Ec(t[a]);
      }
    }
    var du = function(e, t) {
      return e(t);
    }, ls = function() {
    }, Tl = !1;
    function Ov() {
      var e = jv();
      e && (ls(), xc());
    }
    function Lv(e, t, a) {
      if (Tl)
        return e(t, a);
      Tl = !0;
      try {
        return du(e, t, a);
      } finally {
        Tl = !1, Ov();
      }
    }
    function vy(e, t, a) {
      du = e, ls = a;
    }
    function Mv(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function bc(e, t, a) {
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
          return !!(a.disabled && Mv(t));
        default:
          return !1;
      }
    }
    function Rl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Ph(a);
      if (i === null)
        return null;
      var o = i[t];
      if (bc(t, e.type, i))
        return null;
      if (o && typeof o != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof o + "` type.");
      return o;
    }
    var os = !1;
    if (Cn)
      try {
        var mo = {};
        Object.defineProperty(mo, "passive", {
          get: function() {
            os = !0;
          }
        }), window.addEventListener("test", mo, mo), window.removeEventListener("test", mo, mo);
      } catch {
        os = !1;
      }
    function wc(e, t, a, i, o, s, f, v, h) {
      var S = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, S);
      } catch (x) {
        this.onError(x);
      }
    }
    var Tc = wc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var yd = document.createElement("react");
      Tc = function(t, a, i, o, s, f, v, h, S) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var x = document.createEvent("Event"), O = !1, N = !0, $ = window.event, W = Object.getOwnPropertyDescriptor(window, "event");
        function J() {
          yd.removeEventListener(Z, lt, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = $);
        }
        var Ue = Array.prototype.slice.call(arguments, 3);
        function lt() {
          O = !0, J(), a.apply(i, Ue), N = !1;
        }
        var Ze, Yt = !1, Ft = !1;
        function H(V) {
          if (Ze = V.error, Yt = !0, Ze === null && V.colno === 0 && V.lineno === 0 && (Ft = !0), V.defaultPrevented && Ze != null && typeof Ze == "object")
            try {
              Ze._suppressLogging = !0;
            } catch {
            }
        }
        var Z = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", H), yd.addEventListener(Z, lt, !1), x.initEvent(Z, !1, !1), yd.dispatchEvent(x), W && Object.defineProperty(window, "event", W), O && N && (Yt ? Ft && (Ze = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Ze = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Ze)), window.removeEventListener("error", H), !O)
          return J(), wc.apply(this, arguments);
      };
    }
    var Av = Tc, pu = !1, Rc = null, vu = !1, Ci = null, zv = {
      onError: function(e) {
        pu = !0, Rc = e;
      }
    };
    function _l(e, t, a, i, o, s, f, v, h) {
      pu = !1, Rc = null, Av.apply(zv, arguments);
    }
    function xi(e, t, a, i, o, s, f, v, h) {
      if (_l.apply(this, arguments), pu) {
        var S = ss();
        vu || (vu = !0, Ci = S);
      }
    }
    function us() {
      if (vu) {
        var e = Ci;
        throw vu = !1, Ci = null, e;
      }
    }
    function Qi() {
      return pu;
    }
    function ss() {
      if (pu) {
        var e = Rc;
        return pu = !1, Rc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function hu(e) {
      return e._reactInternals;
    }
    function hy(e) {
      return e._reactInternals !== void 0;
    }
    function yo(e, t) {
      e._reactInternals = t;
    }
    var rt = (
      /*                      */
      0
    ), ii = (
      /*                */
      1
    ), wn = (
      /*                    */
      2
    ), Bt = (
      /*                       */
      4
    ), Ma = (
      /*                */
      16
    ), Aa = (
      /*                 */
      32
    ), vn = (
      /*                     */
      64
    ), et = (
      /*                   */
      128
    ), kr = (
      /*            */
      256
    ), jn = (
      /*                          */
      512
    ), er = (
      /*                     */
      1024
    ), ea = (
      /*                      */
      2048
    ), ta = (
      /*                    */
      4096
    ), In = (
      /*                   */
      8192
    ), mu = (
      /*             */
      16384
    ), Uv = (
      /*               */
      32767
    ), cs = (
      /*                   */
      32768
    ), ir = (
      /*                */
      65536
    ), _c = (
      /* */
      131072
    ), bi = (
      /*                       */
      1048576
    ), yu = (
      /*                    */
      2097152
    ), Wi = (
      /*                 */
      4194304
    ), kc = (
      /*                */
      8388608
    ), kl = (
      /*               */
      16777216
    ), wi = (
      /*              */
      33554432
    ), Dl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Bt | er | 0
    ), Nl = wn | Bt | Ma | Aa | jn | ta | In, jl = Bt | vn | jn | In, Gi = ea | Ma, $n = Wi | kc | yu, za = b.ReactCurrentOwner;
    function ga(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (wn | ta)) !== rt && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === P ? a : null;
    }
    function Ti(e) {
      if (e.tag === le) {
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
    function Ri(e) {
      return e.tag === P ? e.stateNode.containerInfo : null;
    }
    function go(e) {
      return ga(e) === e;
    }
    function Fv(e) {
      {
        var t = za.current;
        if (t !== null && t.tag === z) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", ht(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var o = hu(e);
      return o ? ga(o) === o : !1;
    }
    function Dc(e) {
      if (ga(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function Nc(e) {
      var t = e.alternate;
      if (!t) {
        var a = ga(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, o = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var f = s.alternate;
        if (f === null) {
          var v = s.return;
          if (v !== null) {
            i = o = v;
            continue;
          }
          break;
        }
        if (s.child === f.child) {
          for (var h = s.child; h; ) {
            if (h === i)
              return Dc(s), e;
            if (h === o)
              return Dc(s), t;
            h = h.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== o.return)
          i = s, o = f;
        else {
          for (var S = !1, x = s.child; x; ) {
            if (x === i) {
              S = !0, i = s, o = f;
              break;
            }
            if (x === o) {
              S = !0, o = s, i = f;
              break;
            }
            x = x.sibling;
          }
          if (!S) {
            for (x = f.child; x; ) {
              if (x === i) {
                S = !0, i = f, o = s;
                break;
              }
              if (x === o) {
                S = !0, o = f, i = s;
                break;
              }
              x = x.sibling;
            }
            if (!S)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== o)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== P)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function na(e) {
      var t = Nc(e);
      return t !== null ? ra(t) : null;
    }
    function ra(e) {
      if (e.tag === te || e.tag === ne)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = ra(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function Sn(e) {
      var t = Nc(e);
      return t !== null ? Ua(t) : null;
    }
    function Ua(e) {
      if (e.tag === te || e.tag === ne)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== G) {
          var a = Ua(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var gd = E.unstable_scheduleCallback, Pv = E.unstable_cancelCallback, Sd = E.unstable_shouldYield, Ed = E.unstable_requestPaint, tr = E.unstable_now, jc = E.unstable_getCurrentPriorityLevel, fs = E.unstable_ImmediatePriority, Ol = E.unstable_UserBlockingPriority, Ki = E.unstable_NormalPriority, my = E.unstable_LowPriority, So = E.unstable_IdlePriority, Oc = E.unstable_yieldValue, Hv = E.unstable_setDisableYieldValue, Eo = null, Mn = null, ze = null, Sa = !1, aa = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function gu(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Oe && (e = kt({}, e, {
          getLaneLabelMap: Co,
          injectProfilingHooks: Fa
        })), Eo = t.inject(e), Mn = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Cd(e, t) {
      if (Mn && typeof Mn.onScheduleFiberRoot == "function")
        try {
          Mn.onScheduleFiberRoot(Eo, e, t);
        } catch (a) {
          Sa || (Sa = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function xd(e, t) {
      if (Mn && typeof Mn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & et) === et;
          if ($e) {
            var i;
            switch (t) {
              case Pr:
                i = fs;
                break;
              case ki:
                i = Ol;
                break;
              case Pa:
                i = Ki;
                break;
              case Ha:
                i = So;
                break;
              default:
                i = Ki;
                break;
            }
            Mn.onCommitFiberRoot(Eo, e, i, a);
          }
        } catch (o) {
          Sa || (Sa = !0, g("React instrumentation encountered an error: %s", o));
        }
    }
    function bd(e) {
      if (Mn && typeof Mn.onPostCommitFiberRoot == "function")
        try {
          Mn.onPostCommitFiberRoot(Eo, e);
        } catch (t) {
          Sa || (Sa = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function wd(e) {
      if (Mn && typeof Mn.onCommitFiberUnmount == "function")
        try {
          Mn.onCommitFiberUnmount(Eo, e);
        } catch (t) {
          Sa || (Sa = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Tn(e) {
      if (typeof Oc == "function" && (Hv(e), ee(e)), Mn && typeof Mn.setStrictMode == "function")
        try {
          Mn.setStrictMode(Eo, e);
        } catch (t) {
          Sa || (Sa = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Fa(e) {
      ze = e;
    }
    function Co() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < wo; a++) {
          var i = $v(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Td(e) {
      ze !== null && typeof ze.markCommitStarted == "function" && ze.markCommitStarted(e);
    }
    function Rd() {
      ze !== null && typeof ze.markCommitStopped == "function" && ze.markCommitStopped();
    }
    function Ea(e) {
      ze !== null && typeof ze.markComponentRenderStarted == "function" && ze.markComponentRenderStarted(e);
    }
    function Ca() {
      ze !== null && typeof ze.markComponentRenderStopped == "function" && ze.markComponentRenderStopped();
    }
    function _d(e) {
      ze !== null && typeof ze.markComponentPassiveEffectMountStarted == "function" && ze.markComponentPassiveEffectMountStarted(e);
    }
    function Vv() {
      ze !== null && typeof ze.markComponentPassiveEffectMountStopped == "function" && ze.markComponentPassiveEffectMountStopped();
    }
    function qi(e) {
      ze !== null && typeof ze.markComponentPassiveEffectUnmountStarted == "function" && ze.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ll() {
      ze !== null && typeof ze.markComponentPassiveEffectUnmountStopped == "function" && ze.markComponentPassiveEffectUnmountStopped();
    }
    function Lc(e) {
      ze !== null && typeof ze.markComponentLayoutEffectMountStarted == "function" && ze.markComponentLayoutEffectMountStarted(e);
    }
    function Bv() {
      ze !== null && typeof ze.markComponentLayoutEffectMountStopped == "function" && ze.markComponentLayoutEffectMountStopped();
    }
    function ds(e) {
      ze !== null && typeof ze.markComponentLayoutEffectUnmountStarted == "function" && ze.markComponentLayoutEffectUnmountStarted(e);
    }
    function kd() {
      ze !== null && typeof ze.markComponentLayoutEffectUnmountStopped == "function" && ze.markComponentLayoutEffectUnmountStopped();
    }
    function ps(e, t, a) {
      ze !== null && typeof ze.markComponentErrored == "function" && ze.markComponentErrored(e, t, a);
    }
    function _i(e, t, a) {
      ze !== null && typeof ze.markComponentSuspended == "function" && ze.markComponentSuspended(e, t, a);
    }
    function vs(e) {
      ze !== null && typeof ze.markLayoutEffectsStarted == "function" && ze.markLayoutEffectsStarted(e);
    }
    function hs() {
      ze !== null && typeof ze.markLayoutEffectsStopped == "function" && ze.markLayoutEffectsStopped();
    }
    function xo(e) {
      ze !== null && typeof ze.markPassiveEffectsStarted == "function" && ze.markPassiveEffectsStarted(e);
    }
    function Dd() {
      ze !== null && typeof ze.markPassiveEffectsStopped == "function" && ze.markPassiveEffectsStopped();
    }
    function bo(e) {
      ze !== null && typeof ze.markRenderStarted == "function" && ze.markRenderStarted(e);
    }
    function Iv() {
      ze !== null && typeof ze.markRenderYielded == "function" && ze.markRenderYielded();
    }
    function Mc() {
      ze !== null && typeof ze.markRenderStopped == "function" && ze.markRenderStopped();
    }
    function Rn(e) {
      ze !== null && typeof ze.markRenderScheduled == "function" && ze.markRenderScheduled(e);
    }
    function Ac(e, t) {
      ze !== null && typeof ze.markForceUpdateScheduled == "function" && ze.markForceUpdateScheduled(e, t);
    }
    function ms(e, t) {
      ze !== null && typeof ze.markStateUpdateScheduled == "function" && ze.markStateUpdateScheduled(e, t);
    }
    var at = (
      /*                         */
      0
    ), Lt = (
      /*                 */
      1
    ), Xt = (
      /*                    */
      2
    ), un = (
      /*               */
      8
    ), Jt = (
      /*              */
      16
    ), Yn = Math.clz32 ? Math.clz32 : ys, lr = Math.log, zc = Math.LN2;
    function ys(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (lr(t) / zc | 0) | 0;
    }
    var wo = 31, de = (
      /*                        */
      0
    ), Gt = (
      /*                          */
      0
    ), ct = (
      /*                        */
      1
    ), Ml = (
      /*    */
      2
    ), li = (
      /*             */
      4
    ), Dr = (
      /*            */
      8
    ), An = (
      /*                     */
      16
    ), Xi = (
      /*                */
      32
    ), Al = (
      /*                       */
      4194240
    ), To = (
      /*                        */
      64
    ), Uc = (
      /*                        */
      128
    ), Fc = (
      /*                        */
      256
    ), Pc = (
      /*                        */
      512
    ), Hc = (
      /*                        */
      1024
    ), Vc = (
      /*                        */
      2048
    ), Bc = (
      /*                        */
      4096
    ), Ic = (
      /*                        */
      8192
    ), $c = (
      /*                        */
      16384
    ), Ro = (
      /*                       */
      32768
    ), Yc = (
      /*                       */
      65536
    ), Su = (
      /*                       */
      131072
    ), Eu = (
      /*                       */
      262144
    ), Qc = (
      /*                       */
      524288
    ), gs = (
      /*                       */
      1048576
    ), Wc = (
      /*                       */
      2097152
    ), Ss = (
      /*                            */
      130023424
    ), _o = (
      /*                             */
      4194304
    ), Gc = (
      /*                             */
      8388608
    ), Es = (
      /*                             */
      16777216
    ), Kc = (
      /*                             */
      33554432
    ), qc = (
      /*                             */
      67108864
    ), Nd = _o, Cs = (
      /*          */
      134217728
    ), jd = (
      /*                          */
      268435455
    ), xs = (
      /*               */
      268435456
    ), ko = (
      /*                        */
      536870912
    ), ia = (
      /*                   */
      1073741824
    );
    function $v(e) {
      {
        if (e & ct)
          return "Sync";
        if (e & Ml)
          return "InputContinuousHydration";
        if (e & li)
          return "InputContinuous";
        if (e & Dr)
          return "DefaultHydration";
        if (e & An)
          return "Default";
        if (e & Xi)
          return "TransitionHydration";
        if (e & Al)
          return "Transition";
        if (e & Ss)
          return "Retry";
        if (e & Cs)
          return "SelectiveHydration";
        if (e & xs)
          return "IdleHydration";
        if (e & ko)
          return "Idle";
        if (e & ia)
          return "Offscreen";
      }
    }
    var fn = -1, Do = To, Xc = _o;
    function bs(e) {
      switch (zl(e)) {
        case ct:
          return ct;
        case Ml:
          return Ml;
        case li:
          return li;
        case Dr:
          return Dr;
        case An:
          return An;
        case Xi:
          return Xi;
        case To:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Vc:
        case Bc:
        case Ic:
        case $c:
        case Ro:
        case Yc:
        case Su:
        case Eu:
        case Qc:
        case gs:
        case Wc:
          return e & Al;
        case _o:
        case Gc:
        case Es:
        case Kc:
        case qc:
          return e & Ss;
        case Cs:
          return Cs;
        case xs:
          return xs;
        case ko:
          return ko;
        case ia:
          return ia;
        default:
          return g("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Jc(e, t) {
      var a = e.pendingLanes;
      if (a === de)
        return de;
      var i = de, o = e.suspendedLanes, s = e.pingedLanes, f = a & jd;
      if (f !== de) {
        var v = f & ~o;
        if (v !== de)
          i = bs(v);
        else {
          var h = f & s;
          h !== de && (i = bs(h));
        }
      } else {
        var S = a & ~o;
        S !== de ? i = bs(S) : s !== de && (i = bs(s));
      }
      if (i === de)
        return de;
      if (t !== de && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & o) === de) {
        var x = zl(i), O = zl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          x >= O || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          x === An && (O & Al) !== de
        )
          return t;
      }
      (i & li) !== de && (i |= a & An);
      var N = e.entangledLanes;
      if (N !== de)
        for (var $ = e.entanglements, W = i & N; W > 0; ) {
          var J = Qn(W), Ue = 1 << J;
          i |= $[J], W &= ~Ue;
        }
      return i;
    }
    function oi(e, t) {
      for (var a = e.eventTimes, i = fn; t > 0; ) {
        var o = Qn(t), s = 1 << o, f = a[o];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Od(e, t) {
      switch (e) {
        case ct:
        case Ml:
        case li:
          return t + 250;
        case Dr:
        case An:
        case Xi:
        case To:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Vc:
        case Bc:
        case Ic:
        case $c:
        case Ro:
        case Yc:
        case Su:
        case Eu:
        case Qc:
        case gs:
        case Wc:
          return t + 5e3;
        case _o:
        case Gc:
        case Es:
        case Kc:
        case qc:
          return fn;
        case Cs:
        case xs:
        case ko:
        case ia:
          return fn;
        default:
          return g("Should have found matching lanes. This is a bug in React."), fn;
      }
    }
    function Zc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, o = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var v = Qn(f), h = 1 << v, S = s[v];
        S === fn ? ((h & i) === de || (h & o) !== de) && (s[v] = Od(h, t)) : S <= t && (e.expiredLanes |= h), f &= ~h;
      }
    }
    function Yv(e) {
      return bs(e.pendingLanes);
    }
    function ef(e) {
      var t = e.pendingLanes & ~ia;
      return t !== de ? t : t & ia ? ia : de;
    }
    function Qv(e) {
      return (e & ct) !== de;
    }
    function ws(e) {
      return (e & jd) !== de;
    }
    function No(e) {
      return (e & Ss) === e;
    }
    function Ld(e) {
      var t = ct | li | An;
      return (e & t) === de;
    }
    function Md(e) {
      return (e & Al) === e;
    }
    function tf(e, t) {
      var a = Ml | li | Dr | An;
      return (t & a) !== de;
    }
    function Wv(e, t) {
      return (t & e.expiredLanes) !== de;
    }
    function Ad(e) {
      return (e & Al) !== de;
    }
    function zd() {
      var e = Do;
      return Do <<= 1, (Do & Al) === de && (Do = To), e;
    }
    function Gv() {
      var e = Xc;
      return Xc <<= 1, (Xc & Ss) === de && (Xc = _o), e;
    }
    function zl(e) {
      return e & -e;
    }
    function Ts(e) {
      return zl(e);
    }
    function Qn(e) {
      return 31 - Yn(e);
    }
    function mr(e) {
      return Qn(e);
    }
    function la(e, t) {
      return (e & t) !== de;
    }
    function jo(e, t) {
      return (e & t) === t;
    }
    function Rt(e, t) {
      return e | t;
    }
    function Rs(e, t) {
      return e & ~t;
    }
    function Ud(e, t) {
      return e & t;
    }
    function Kv(e) {
      return e;
    }
    function qv(e, t) {
      return e !== Gt && e < t ? e : t;
    }
    function _s(e) {
      for (var t = [], a = 0; a < wo; a++)
        t.push(e);
      return t;
    }
    function Cu(e, t, a) {
      e.pendingLanes |= t, t !== ko && (e.suspendedLanes = de, e.pingedLanes = de);
      var i = e.eventTimes, o = mr(t);
      i[o] = a;
    }
    function Xv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var o = Qn(i), s = 1 << o;
        a[o] = fn, i &= ~s;
      }
    }
    function nf(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Fd(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = de, e.pingedLanes = de, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, o = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var v = Qn(f), h = 1 << v;
        i[v] = de, o[v] = fn, s[v] = fn, f &= ~h;
      }
    }
    function rf(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, o = a; o; ) {
        var s = Qn(o), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), o &= ~f;
      }
    }
    function Pd(e, t) {
      var a = zl(t), i;
      switch (a) {
        case li:
          i = Ml;
          break;
        case An:
          i = Dr;
          break;
        case To:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Vc:
        case Bc:
        case Ic:
        case $c:
        case Ro:
        case Yc:
        case Su:
        case Eu:
        case Qc:
        case gs:
        case Wc:
        case _o:
        case Gc:
        case Es:
        case Kc:
        case qc:
          i = Xi;
          break;
        case ko:
          i = xs;
          break;
        default:
          i = Gt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Gt ? Gt : i;
    }
    function ks(e, t, a) {
      if (aa)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var o = mr(a), s = 1 << o, f = i[o];
          f.add(t), a &= ~s;
        }
    }
    function Jv(e, t) {
      if (aa)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var o = mr(t), s = 1 << o, f = a[o];
          f.size > 0 && (f.forEach(function(v) {
            var h = v.alternate;
            (h === null || !i.has(h)) && i.add(v);
          }), f.clear()), t &= ~s;
        }
    }
    function Hd(e, t) {
      return null;
    }
    var Pr = ct, ki = li, Pa = An, Ha = ko, Ds = Gt;
    function Va() {
      return Ds;
    }
    function Wn(e) {
      Ds = e;
    }
    function Zv(e, t) {
      var a = Ds;
      try {
        return Ds = e, t();
      } finally {
        Ds = a;
      }
    }
    function eh(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Ns(e, t) {
      return e > t ? e : t;
    }
    function or(e, t) {
      return e !== 0 && e < t;
    }
    function th(e) {
      var t = zl(e);
      return or(Pr, t) ? or(ki, t) ? ws(t) ? Pa : Ha : ki : Pr;
    }
    function af(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var js;
    function Nr(e) {
      js = e;
    }
    function yy(e) {
      js(e);
    }
    var Ye;
    function xu(e) {
      Ye = e;
    }
    var lf;
    function nh(e) {
      lf = e;
    }
    var rh;
    function Os(e) {
      rh = e;
    }
    var Ls;
    function Vd(e) {
      Ls = e;
    }
    var of = !1, Ms = [], Ji = null, Di = null, Ni = null, zn = /* @__PURE__ */ new Map(), Hr = /* @__PURE__ */ new Map(), Vr = [], ah = [
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
    function ih(e) {
      return ah.indexOf(e) > -1;
    }
    function ui(e, t, a, i, o) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: o,
        targetContainers: [i]
      };
    }
    function Bd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Ji = null;
          break;
        case "dragenter":
        case "dragleave":
          Di = null;
          break;
        case "mouseover":
        case "mouseout":
          Ni = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          zn.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Hr.delete(i);
          break;
        }
      }
    }
    function oa(e, t, a, i, o, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = ui(t, a, i, o, s);
        if (t !== null) {
          var v = ju(t);
          v !== null && Ye(v);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var h = e.targetContainers;
      return o !== null && h.indexOf(o) === -1 && h.push(o), e;
    }
    function gy(e, t, a, i, o) {
      switch (t) {
        case "focusin": {
          var s = o;
          return Ji = oa(Ji, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = o;
          return Di = oa(Di, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var v = o;
          return Ni = oa(Ni, e, t, a, i, v), !0;
        }
        case "pointerover": {
          var h = o, S = h.pointerId;
          return zn.set(S, oa(zn.get(S) || null, e, t, a, i, h)), !0;
        }
        case "gotpointercapture": {
          var x = o, O = x.pointerId;
          return Hr.set(O, oa(Hr.get(O) || null, e, t, a, i, x)), !0;
        }
      }
      return !1;
    }
    function Id(e) {
      var t = Qs(e.target);
      if (t !== null) {
        var a = ga(t);
        if (a !== null) {
          var i = a.tag;
          if (i === le) {
            var o = Ti(a);
            if (o !== null) {
              e.blockedOn = o, Ls(e.priority, function() {
                lf(a);
              });
              return;
            }
          } else if (i === P) {
            var s = a.stateNode;
            if (af(s)) {
              e.blockedOn = Ri(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function lh(e) {
      for (var t = rh(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Vr.length && or(t, Vr[i].priority); i++)
        ;
      Vr.splice(i, 0, a), i === 0 && Id(a);
    }
    function As(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = wu(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var o = e.nativeEvent, s = new o.constructor(o.type, o);
          dy(s), o.target.dispatchEvent(s), py();
        } else {
          var f = ju(i);
          return f !== null && Ye(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function $d(e, t, a) {
      As(e) && a.delete(t);
    }
    function Sy() {
      of = !1, Ji !== null && As(Ji) && (Ji = null), Di !== null && As(Di) && (Di = null), Ni !== null && As(Ni) && (Ni = null), zn.forEach($d), Hr.forEach($d);
    }
    function Ul(e, t) {
      e.blockedOn === t && (e.blockedOn = null, of || (of = !0, E.unstable_scheduleCallback(E.unstable_NormalPriority, Sy)));
    }
    function Oo(e) {
      if (Ms.length > 0) {
        Ul(Ms[0], e);
        for (var t = 1; t < Ms.length; t++) {
          var a = Ms[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Ji !== null && Ul(Ji, e), Di !== null && Ul(Di, e), Ni !== null && Ul(Ni, e);
      var i = function(v) {
        return Ul(v, e);
      };
      zn.forEach(i), Hr.forEach(i);
      for (var o = 0; o < Vr.length; o++) {
        var s = Vr[o];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Vr.length > 0; ) {
        var f = Vr[0];
        if (f.blockedOn !== null)
          break;
        Id(f), f.blockedOn === null && Vr.shift();
      }
    }
    var yr = b.ReactCurrentBatchConfig, It = !0;
    function nr(e) {
      It = !!e;
    }
    function Gn() {
      return It;
    }
    function gr(e, t, a) {
      var i = uf(t), o;
      switch (i) {
        case Pr:
          o = xa;
          break;
        case ki:
          o = bu;
          break;
        case Pa:
        default:
          o = Un;
          break;
      }
      return o.bind(null, t, a, e);
    }
    function xa(e, t, a, i) {
      var o = Va(), s = yr.transition;
      yr.transition = null;
      try {
        Wn(Pr), Un(e, t, a, i);
      } finally {
        Wn(o), yr.transition = s;
      }
    }
    function bu(e, t, a, i) {
      var o = Va(), s = yr.transition;
      yr.transition = null;
      try {
        Wn(ki), Un(e, t, a, i);
      } finally {
        Wn(o), yr.transition = s;
      }
    }
    function Un(e, t, a, i) {
      It && zs(e, t, a, i);
    }
    function zs(e, t, a, i) {
      var o = wu(e, t, a, i);
      if (o === null) {
        zy(e, t, i, ji, a), Bd(e, i);
        return;
      }
      if (gy(o, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Bd(e, i), t & La && ih(e)) {
        for (; o !== null; ) {
          var s = ju(o);
          s !== null && yy(s);
          var f = wu(e, t, a, i);
          if (f === null && zy(e, t, i, ji, a), f === o)
            break;
          o = f;
        }
        o !== null && i.stopPropagation();
        return;
      }
      zy(e, t, i, null, a);
    }
    var ji = null;
    function wu(e, t, a, i) {
      ji = null;
      var o = md(i), s = Qs(o);
      if (s !== null) {
        var f = ga(s);
        if (f === null)
          s = null;
        else {
          var v = f.tag;
          if (v === le) {
            var h = Ti(f);
            if (h !== null)
              return h;
            s = null;
          } else if (v === P) {
            var S = f.stateNode;
            if (af(S))
              return Ri(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return ji = s, null;
    }
    function uf(e) {
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
          return Pr;
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
          return ki;
        case "message": {
          var t = jc();
          switch (t) {
            case fs:
              return Pr;
            case Ol:
              return ki;
            case Ki:
            case my:
              return Pa;
            case So:
              return Ha;
            default:
              return Pa;
          }
        }
        default:
          return Pa;
      }
    }
    function Us(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function ua(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Yd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function Tu(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var ba = null, Ru = null, Lo = null;
    function Fl(e) {
      return ba = e, Ru = Fs(), !0;
    }
    function sf() {
      ba = null, Ru = null, Lo = null;
    }
    function Zi() {
      if (Lo)
        return Lo;
      var e, t = Ru, a = t.length, i, o = Fs(), s = o.length;
      for (e = 0; e < a && t[e] === o[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === o[s - i]; i++)
        ;
      var v = i > 1 ? 1 - i : void 0;
      return Lo = o.slice(e, v), Lo;
    }
    function Fs() {
      return "value" in ba ? ba.value : ba.textContent;
    }
    function Pl(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function _u() {
      return !0;
    }
    function Ps() {
      return !1;
    }
    function jr(e) {
      function t(a, i, o, s, f) {
        this._reactName = a, this._targetInst = o, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var v in e)
          if (e.hasOwnProperty(v)) {
            var h = e[v];
            h ? this[v] = h(s) : this[v] = s[v];
          }
        var S = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return S ? this.isDefaultPrevented = _u : this.isDefaultPrevented = Ps, this.isPropagationStopped = Ps, this;
      }
      return kt(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = _u);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = _u);
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
        isPersistent: _u
      }), t;
    }
    var Kn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Oi = jr(Kn), Br = kt({}, Kn, {
      view: 0,
      detail: 0
    }), sa = jr(Br), cf, Hs, Mo;
    function Ey(e) {
      e !== Mo && (Mo && e.type === "mousemove" ? (cf = e.screenX - Mo.screenX, Hs = e.screenY - Mo.screenY) : (cf = 0, Hs = 0), Mo = e);
    }
    var si = kt({}, Br, {
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
      getModifierState: En,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (Ey(e), cf);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Hs;
      }
    }), Qd = jr(si), Wd = kt({}, si, {
      dataTransfer: 0
    }), Ao = jr(Wd), Gd = kt({}, Br, {
      relatedTarget: 0
    }), el = jr(Gd), oh = kt({}, Kn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), uh = jr(oh), Kd = kt({}, Kn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), ff = jr(Kd), Cy = kt({}, Kn, {
      data: 0
    }), sh = jr(Cy), ch = sh, fh = {
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
    }, zo = {
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
    function xy(e) {
      if (e.key) {
        var t = fh[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Pl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? zo[e.keyCode] || "Unidentified" : "";
    }
    var ku = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function dh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = ku[e];
      return i ? !!a[i] : !1;
    }
    function En(e) {
      return dh;
    }
    var by = kt({}, Br, {
      key: xy,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: En,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Pl(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Pl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), ph = jr(by), wy = kt({}, si, {
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
    }), vh = jr(wy), hh = kt({}, Br, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: En
    }), mh = jr(hh), Ty = kt({}, Kn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Ba = jr(Ty), qd = kt({}, si, {
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
    }), Ry = jr(qd), Hl = [9, 13, 27, 32], Vs = 229, tl = Cn && "CompositionEvent" in window, Vl = null;
    Cn && "documentMode" in document && (Vl = document.documentMode);
    var Xd = Cn && "TextEvent" in window && !Vl, df = Cn && (!tl || Vl && Vl > 8 && Vl <= 11), yh = 32, pf = String.fromCharCode(yh);
    function _y() {
      _t("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), _t("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), _t("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), _t("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Jd = !1;
    function gh(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function vf(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function hf(e, t) {
      return e === "keydown" && t.keyCode === Vs;
    }
    function Zd(e, t) {
      switch (e) {
        case "keyup":
          return Hl.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Vs;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function mf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function Sh(e) {
      return e.locale === "ko";
    }
    var Uo = !1;
    function ep(e, t, a, i, o) {
      var s, f;
      if (tl ? s = vf(t) : Uo ? Zd(t, i) && (s = "onCompositionEnd") : hf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      df && !Sh(i) && (!Uo && s === "onCompositionStart" ? Uo = Fl(o) : s === "onCompositionEnd" && Uo && (f = Zi()));
      var v = Rh(a, s);
      if (v.length > 0) {
        var h = new sh(s, t, null, i, o);
        if (e.push({
          event: h,
          listeners: v
        }), f)
          h.data = f;
        else {
          var S = mf(i);
          S !== null && (h.data = S);
        }
      }
    }
    function yf(e, t) {
      switch (e) {
        case "compositionend":
          return mf(t);
        case "keypress":
          var a = t.which;
          return a !== yh ? null : (Jd = !0, pf);
        case "textInput":
          var i = t.data;
          return i === pf && Jd ? null : i;
        default:
          return null;
      }
    }
    function tp(e, t) {
      if (Uo) {
        if (e === "compositionend" || !tl && Zd(e, t)) {
          var a = Zi();
          return sf(), Uo = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!gh(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return df && !Sh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function gf(e, t, a, i, o) {
      var s;
      if (Xd ? s = yf(t, i) : s = tp(t, i), !s)
        return null;
      var f = Rh(a, "onBeforeInput");
      if (f.length > 0) {
        var v = new ch("onBeforeInput", "beforeinput", null, i, o);
        e.push({
          event: v,
          listeners: f
        }), v.data = s;
      }
    }
    function Eh(e, t, a, i, o, s, f) {
      ep(e, t, a, i, o), gf(e, t, a, i, o);
    }
    var ky = {
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
    function Bs(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!ky[e.type] : t === "textarea";
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
    function Dy(e) {
      if (!Cn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Is() {
      _t("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function Ch(e, t, a, i) {
      fu(i);
      var o = Rh(t, "onChange");
      if (o.length > 0) {
        var s = new Oi("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: o
        });
      }
    }
    var Bl = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      Ch(t, n, e, md(e)), Lv(u, t);
    }
    function u(e) {
      HE(e, 0);
    }
    function c(e) {
      var t = wf(e);
      if (Si(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var y = !1;
    Cn && (y = Dy("input") && (!document.documentMode || document.documentMode > 9));
    function w(e, t) {
      Bl = e, n = t, Bl.attachEvent("onpropertychange", Q);
    }
    function k() {
      Bl && (Bl.detachEvent("onpropertychange", Q), Bl = null, n = null);
    }
    function Q(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function me(e, t, a) {
      e === "focusin" ? (k(), w(t, a)) : e === "focusout" && k();
    }
    function Ce(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function ve(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function He(e, t) {
      if (e === "click")
        return c(t);
    }
    function We(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function qe(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || it(e, "number", e.value);
    }
    function Fn(e, t, a, i, o, s, f) {
      var v = a ? wf(a) : window, h, S;
      if (r(v) ? h = d : Bs(v) ? y ? h = We : (h = Ce, S = me) : ve(v) && (h = He), h) {
        var x = h(t, a);
        if (x) {
          Ch(e, x, i, o);
          return;
        }
      }
      S && S(t, v, a), t === "focusout" && qe(v);
    }
    function F() {
      Kt("onMouseEnter", ["mouseout", "mouseover"]), Kt("onMouseLeave", ["mouseout", "mouseover"]), Kt("onPointerEnter", ["pointerout", "pointerover"]), Kt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function j(e, t, a, i, o, s, f) {
      var v = t === "mouseover" || t === "pointerover", h = t === "mouseout" || t === "pointerout";
      if (v && !is(i)) {
        var S = i.relatedTarget || i.fromElement;
        if (S && (Qs(S) || hp(S)))
          return;
      }
      if (!(!h && !v)) {
        var x;
        if (o.window === o)
          x = o;
        else {
          var O = o.ownerDocument;
          O ? x = O.defaultView || O.parentWindow : x = window;
        }
        var N, $;
        if (h) {
          var W = i.relatedTarget || i.toElement;
          if (N = a, $ = W ? Qs(W) : null, $ !== null) {
            var J = ga($);
            ($ !== J || $.tag !== te && $.tag !== ne) && ($ = null);
          }
        } else
          N = null, $ = a;
        if (N !== $) {
          var Ue = Qd, lt = "onMouseLeave", Ze = "onMouseEnter", Yt = "mouse";
          (t === "pointerout" || t === "pointerover") && (Ue = vh, lt = "onPointerLeave", Ze = "onPointerEnter", Yt = "pointer");
          var Ft = N == null ? x : wf(N), H = $ == null ? x : wf($), Z = new Ue(lt, Yt + "leave", N, i, o);
          Z.target = Ft, Z.relatedTarget = H;
          var V = null, xe = Qs(o);
          if (xe === a) {
            var Ie = new Ue(Ze, Yt + "enter", $, i, o);
            Ie.target = H, Ie.relatedTarget = Ft, V = Ie;
          }
          Jw(e, Z, V, N, $);
        }
      }
    }
    function I(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var ye = typeof Object.is == "function" ? Object.is : I;
    function Ge(e, t) {
      if (ye(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var o = 0; o < a.length; o++) {
        var s = a[o];
        if (!Hn.call(t, s) || !ye(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function ot(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function st(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function dt(e, t) {
      for (var a = ot(e), i = 0, o = 0; a; ) {
        if (a.nodeType === $i) {
          if (o = i + a.textContent.length, i <= t && o >= t)
            return {
              node: a,
              offset: t - i
            };
          i = o;
        }
        a = ot(st(a));
      }
    }
    function ur(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var o = i.anchorNode, s = i.anchorOffset, f = i.focusNode, v = i.focusOffset;
      try {
        o.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return Zt(e, o, s, f, v);
    }
    function Zt(e, t, a, i, o) {
      var s = 0, f = -1, v = -1, h = 0, S = 0, x = e, O = null;
      e: for (; ; ) {
        for (var N = null; x === t && (a === 0 || x.nodeType === $i) && (f = s + a), x === i && (o === 0 || x.nodeType === $i) && (v = s + o), x.nodeType === $i && (s += x.nodeValue.length), (N = x.firstChild) !== null; )
          O = x, x = N;
        for (; ; ) {
          if (x === e)
            break e;
          if (O === t && ++h === a && (f = s), O === i && ++S === o && (v = s), (N = x.nextSibling) !== null)
            break;
          x = O, O = x.parentNode;
        }
        x = N;
      }
      return f === -1 || v === -1 ? null : {
        start: f,
        end: v
      };
    }
    function Il(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var o = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), v = t.end === void 0 ? f : Math.min(t.end, s);
        if (!o.extend && f > v) {
          var h = v;
          v = f, f = h;
        }
        var S = dt(e, f), x = dt(e, v);
        if (S && x) {
          if (o.rangeCount === 1 && o.anchorNode === S.node && o.anchorOffset === S.offset && o.focusNode === x.node && o.focusOffset === x.offset)
            return;
          var O = a.createRange();
          O.setStart(S.node, S.offset), o.removeAllRanges(), f > v ? (o.addRange(O), o.extend(x.node, x.offset)) : (O.setEnd(x.node, x.offset), o.addRange(O));
        }
      }
    }
    function xh(e) {
      return e && e.nodeType === $i;
    }
    function DE(e, t) {
      return !e || !t ? !1 : e === t ? !0 : xh(e) ? !1 : xh(t) ? DE(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function Mw(e) {
      return e && e.ownerDocument && DE(e.ownerDocument.documentElement, e);
    }
    function Aw(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function NE() {
      for (var e = window, t = Oa(); t instanceof e.HTMLIFrameElement; ) {
        if (Aw(t))
          e = t.contentWindow;
        else
          return t;
        t = Oa(e.document);
      }
      return t;
    }
    function Ny(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function zw() {
      var e = NE();
      return {
        focusedElem: e,
        selectionRange: Ny(e) ? Fw(e) : null
      };
    }
    function Uw(e) {
      var t = NE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && Mw(a)) {
        i !== null && Ny(a) && Pw(a, i);
        for (var o = [], s = a; s = s.parentNode; )
          s.nodeType === Zr && o.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var f = 0; f < o.length; f++) {
          var v = o[f];
          v.element.scrollLeft = v.left, v.element.scrollTop = v.top;
        }
      }
    }
    function Fw(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = ur(e), t || {
        start: 0,
        end: 0
      };
    }
    function Pw(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Il(e, t);
    }
    var Hw = Cn && "documentMode" in document && document.documentMode <= 11;
    function Vw() {
      _t("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var Sf = null, jy = null, np = null, Oy = !1;
    function Bw(e) {
      if ("selectionStart" in e && Ny(e))
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
    function Iw(e) {
      return e.window === e ? e.document : e.nodeType === Yi ? e : e.ownerDocument;
    }
    function jE(e, t, a) {
      var i = Iw(a);
      if (!(Oy || Sf == null || Sf !== Oa(i))) {
        var o = Bw(Sf);
        if (!np || !Ge(np, o)) {
          np = o;
          var s = Rh(jy, "onSelect");
          if (s.length > 0) {
            var f = new Oi("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = Sf;
          }
        }
      }
    }
    function $w(e, t, a, i, o, s, f) {
      var v = a ? wf(a) : window;
      switch (t) {
        case "focusin":
          (Bs(v) || v.contentEditable === "true") && (Sf = v, jy = a, np = null);
          break;
        case "focusout":
          Sf = null, jy = null, np = null;
          break;
        case "mousedown":
          Oy = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Oy = !1, jE(e, i, o);
          break;
        case "selectionchange":
          if (Hw)
            break;
        case "keydown":
        case "keyup":
          jE(e, i, o);
      }
    }
    function bh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var Ef = {
      animationend: bh("Animation", "AnimationEnd"),
      animationiteration: bh("Animation", "AnimationIteration"),
      animationstart: bh("Animation", "AnimationStart"),
      transitionend: bh("Transition", "TransitionEnd")
    }, Ly = {}, OE = {};
    Cn && (OE = document.createElement("div").style, "AnimationEvent" in window || (delete Ef.animationend.animation, delete Ef.animationiteration.animation, delete Ef.animationstart.animation), "TransitionEvent" in window || delete Ef.transitionend.transition);
    function wh(e) {
      if (Ly[e])
        return Ly[e];
      if (!Ef[e])
        return e;
      var t = Ef[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in OE)
          return Ly[e] = t[a];
      return e;
    }
    var LE = wh("animationend"), ME = wh("animationiteration"), AE = wh("animationstart"), zE = wh("transitionend"), UE = /* @__PURE__ */ new Map(), FE = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function Du(e, t) {
      UE.set(e, t), _t(t, [e]);
    }
    function Yw() {
      for (var e = 0; e < FE.length; e++) {
        var t = FE[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        Du(a, "on" + i);
      }
      Du(LE, "onAnimationEnd"), Du(ME, "onAnimationIteration"), Du(AE, "onAnimationStart"), Du("dblclick", "onDoubleClick"), Du("focusin", "onFocus"), Du("focusout", "onBlur"), Du(zE, "onTransitionEnd");
    }
    function Qw(e, t, a, i, o, s, f) {
      var v = UE.get(t);
      if (v !== void 0) {
        var h = Oi, S = t;
        switch (t) {
          case "keypress":
            if (Pl(i) === 0)
              return;
          case "keydown":
          case "keyup":
            h = ph;
            break;
          case "focusin":
            S = "focus", h = el;
            break;
          case "focusout":
            S = "blur", h = el;
            break;
          case "beforeblur":
          case "afterblur":
            h = el;
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
            h = Qd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            h = Ao;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            h = mh;
            break;
          case LE:
          case ME:
          case AE:
            h = uh;
            break;
          case zE:
            h = Ba;
            break;
          case "scroll":
            h = sa;
            break;
          case "wheel":
            h = Ry;
            break;
          case "copy":
          case "cut":
          case "paste":
            h = ff;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            h = vh;
            break;
        }
        var x = (s & La) !== 0;
        {
          var O = !x && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", N = qw(a, v, i.type, x, O);
          if (N.length > 0) {
            var $ = new h(v, S, null, i, o);
            e.push({
              event: $,
              listeners: N
            });
          }
        }
      }
    }
    Yw(), F(), Is(), Vw(), _y();
    function Ww(e, t, a, i, o, s, f) {
      Qw(e, t, a, i, o, s);
      var v = (s & hd) === 0;
      v && (j(e, t, a, i, o), Fn(e, t, a, i, o), $w(e, t, a, i, o), Eh(e, t, a, i, o));
    }
    var rp = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], My = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(rp));
    function PE(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, xi(i, t, void 0, e), e.currentTarget = null;
    }
    function Gw(e, t, a) {
      var i;
      if (a)
        for (var o = t.length - 1; o >= 0; o--) {
          var s = t[o], f = s.instance, v = s.currentTarget, h = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          PE(e, h, v), i = f;
        }
      else
        for (var S = 0; S < t.length; S++) {
          var x = t[S], O = x.instance, N = x.currentTarget, $ = x.listener;
          if (O !== i && e.isPropagationStopped())
            return;
          PE(e, $, N), i = O;
        }
    }
    function HE(e, t) {
      for (var a = (t & La) !== 0, i = 0; i < e.length; i++) {
        var o = e[i], s = o.event, f = o.listeners;
        Gw(s, f, a);
      }
      us();
    }
    function Kw(e, t, a, i, o) {
      var s = md(a), f = [];
      Ww(f, e, i, a, s, t), HE(f, t);
    }
    function _n(e, t) {
      My.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = TT(t), o = Zw(e);
      i.has(o) || (VE(t, e, gc, a), i.add(o));
    }
    function Ay(e, t, a) {
      My.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= La), VE(a, e, i, t);
    }
    var Th = "_reactListening" + Math.random().toString(36).slice(2);
    function ap(e) {
      if (!e[Th]) {
        e[Th] = !0, vt.forEach(function(a) {
          a !== "selectionchange" && (My.has(a) || Ay(a, !1, e), Ay(a, !0, e));
        });
        var t = e.nodeType === Yi ? e : e.ownerDocument;
        t !== null && (t[Th] || (t[Th] = !0, Ay("selectionchange", !1, t)));
      }
    }
    function VE(e, t, a, i, o) {
      var s = gr(e, t, a), f = void 0;
      os && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Yd(e, t, s, f) : ua(e, t, s) : f !== void 0 ? Tu(e, t, s, f) : Us(e, t, s);
    }
    function BE(e, t) {
      return e === t || e.nodeType === Bn && e.parentNode === t;
    }
    function zy(e, t, a, i, o) {
      var s = i;
      if (!(t & vd) && !(t & gc)) {
        var f = o;
        if (i !== null) {
          var v = i;
          e: for (; ; ) {
            if (v === null)
              return;
            var h = v.tag;
            if (h === P || h === G) {
              var S = v.stateNode.containerInfo;
              if (BE(S, f))
                break;
              if (h === G)
                for (var x = v.return; x !== null; ) {
                  var O = x.tag;
                  if (O === P || O === G) {
                    var N = x.stateNode.containerInfo;
                    if (BE(N, f))
                      return;
                  }
                  x = x.return;
                }
              for (; S !== null; ) {
                var $ = Qs(S);
                if ($ === null)
                  return;
                var W = $.tag;
                if (W === te || W === ne) {
                  v = s = $;
                  continue e;
                }
                S = S.parentNode;
              }
            }
            v = v.return;
          }
        }
      }
      Lv(function() {
        return Kw(e, t, a, s);
      });
    }
    function ip(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function qw(e, t, a, i, o, s) {
      for (var f = t !== null ? t + "Capture" : null, v = i ? f : t, h = [], S = e, x = null; S !== null; ) {
        var O = S, N = O.stateNode, $ = O.tag;
        if ($ === te && N !== null && (x = N, v !== null)) {
          var W = Rl(S, v);
          W != null && h.push(ip(S, W, x));
        }
        if (o)
          break;
        S = S.return;
      }
      return h;
    }
    function Rh(e, t) {
      for (var a = t + "Capture", i = [], o = e; o !== null; ) {
        var s = o, f = s.stateNode, v = s.tag;
        if (v === te && f !== null) {
          var h = f, S = Rl(o, a);
          S != null && i.unshift(ip(o, S, h));
          var x = Rl(o, t);
          x != null && i.push(ip(o, x, h));
        }
        o = o.return;
      }
      return i;
    }
    function Cf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== te);
      return e || null;
    }
    function Xw(e, t) {
      for (var a = e, i = t, o = 0, s = a; s; s = Cf(s))
        o++;
      for (var f = 0, v = i; v; v = Cf(v))
        f++;
      for (; o - f > 0; )
        a = Cf(a), o--;
      for (; f - o > 0; )
        i = Cf(i), f--;
      for (var h = o; h--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = Cf(a), i = Cf(i);
      }
      return null;
    }
    function IE(e, t, a, i, o) {
      for (var s = t._reactName, f = [], v = a; v !== null && v !== i; ) {
        var h = v, S = h.alternate, x = h.stateNode, O = h.tag;
        if (S !== null && S === i)
          break;
        if (O === te && x !== null) {
          var N = x;
          if (o) {
            var $ = Rl(v, s);
            $ != null && f.unshift(ip(v, $, N));
          } else if (!o) {
            var W = Rl(v, s);
            W != null && f.push(ip(v, W, N));
          }
        }
        v = v.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function Jw(e, t, a, i, o) {
      var s = i && o ? Xw(i, o) : null;
      i !== null && IE(e, t, i, s, !1), o !== null && a !== null && IE(e, a, o, s, !0);
    }
    function Zw(e, t) {
      return e + "__bubble";
    }
    var Ia = !1, lp = "dangerouslySetInnerHTML", _h = "suppressContentEditableWarning", Nu = "suppressHydrationWarning", $E = "autoFocus", $s = "children", Ys = "style", kh = "__html", Uy, Dh, op, YE, Nh, QE, WE;
    Uy = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Dh = function(e, t) {
      fd(e, t), mc(e, t), Nv(e, t, {
        registrationNameDependencies: mt,
        possibleRegistrationNames: Et
      });
    }, QE = Cn && !document.documentMode, op = function(e, t, a) {
      if (!Ia) {
        var i = jh(a), o = jh(t);
        o !== i && (Ia = !0, g("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(o), JSON.stringify(i)));
      }
    }, YE = function(e) {
      if (!Ia) {
        Ia = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), g("Extra attributes from the server: %s", t);
      }
    }, Nh = function(e, t) {
      t === !1 ? g("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : g("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, WE = function(e, t) {
      var a = e.namespaceURI === Ii ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var e0 = /\r\n?/g, t0 = /\u0000|\uFFFD/g;
    function jh(e) {
      Dn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(e0, `
`).replace(t0, "");
    }
    function Oh(e, t, a, i) {
      var o = jh(t), s = jh(e);
      if (s !== o && (i && (Ia || (Ia = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, o))), a && Me))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function GE(e) {
      return e.nodeType === Yi ? e : e.ownerDocument;
    }
    function n0() {
    }
    function Lh(e) {
      e.onclick = n0;
    }
    function r0(e, t, a, i, o) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Ys)
            f && Object.freeze(f), wv(t, f);
          else if (s === lp) {
            var v = f ? f[kh] : void 0;
            v != null && dv(t, v);
          } else if (s === $s)
            if (typeof f == "string") {
              var h = e !== "textarea" || f !== "";
              h && ou(t, f);
            } else typeof f == "number" && ou(t, "" + f);
          else s === _h || s === Nu || s === $E || (mt.hasOwnProperty(s) ? f != null && (typeof f != "function" && Nh(s, f), s === "onScroll" && _n("scroll", t)) : f != null && Mr(t, s, f, o));
        }
    }
    function a0(e, t, a, i) {
      for (var o = 0; o < t.length; o += 2) {
        var s = t[o], f = t[o + 1];
        s === Ys ? wv(e, f) : s === lp ? dv(e, f) : s === $s ? ou(e, f) : Mr(e, s, f, i);
      }
    }
    function i0(e, t, a, i) {
      var o, s = GE(a), f, v = i;
      if (v === Ii && (v = ad(e)), v === Ii) {
        if (o = wl(e, t), !o && e !== e.toLowerCase() && g("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var h = s.createElement("div");
          h.innerHTML = "<script><\/script>";
          var S = h.firstChild;
          f = h.removeChild(S);
        } else if (typeof t.is == "string")
          f = s.createElement(e, {
            is: t.is
          });
        else if (f = s.createElement(e), e === "select") {
          var x = f;
          t.multiple ? x.multiple = !0 : t.size && (x.size = t.size);
        }
      } else
        f = s.createElementNS(v, e);
      return v === Ii && !o && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !Hn.call(Uy, e) && (Uy[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function l0(e, t) {
      return GE(t).createTextNode(e);
    }
    function o0(e, t, a, i) {
      var o = wl(t, a);
      Dh(t, a);
      var s;
      switch (t) {
        case "dialog":
          _n("cancel", e), _n("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          _n("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < rp.length; f++)
            _n(rp[f], e);
          s = a;
          break;
        case "source":
          _n("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          _n("error", e), _n("load", e), s = a;
          break;
        case "details":
          _n("toggle", e), s = a;
          break;
        case "input":
          ri(e, a), s = lu(e, a), _n("invalid", e);
          break;
        case "option":
          Wt(e, a), s = a;
          break;
        case "select":
          co(e, a), s = Ju(e, a), _n("invalid", e);
          break;
        case "textarea":
          td(e, a), s = ed(e, a), _n("invalid", e);
          break;
        default:
          s = a;
      }
      switch (vc(t, s), r0(t, e, i, s, o), t) {
        case "input":
          ni(e), Y(e, a, !1);
          break;
        case "textarea":
          ni(e), cv(e);
          break;
        case "option":
          pn(e, a);
          break;
        case "select":
          Jf(e, a);
          break;
        default:
          typeof s.onClick == "function" && Lh(e);
          break;
      }
    }
    function u0(e, t, a, i, o) {
      Dh(t, i);
      var s = null, f, v;
      switch (t) {
        case "input":
          f = lu(e, a), v = lu(e, i), s = [];
          break;
        case "select":
          f = Ju(e, a), v = Ju(e, i), s = [];
          break;
        case "textarea":
          f = ed(e, a), v = ed(e, i), s = [];
          break;
        default:
          f = a, v = i, typeof f.onClick != "function" && typeof v.onClick == "function" && Lh(e);
          break;
      }
      vc(t, v);
      var h, S, x = null;
      for (h in f)
        if (!(v.hasOwnProperty(h) || !f.hasOwnProperty(h) || f[h] == null))
          if (h === Ys) {
            var O = f[h];
            for (S in O)
              O.hasOwnProperty(S) && (x || (x = {}), x[S] = "");
          } else h === lp || h === $s || h === _h || h === Nu || h === $E || (mt.hasOwnProperty(h) ? s || (s = []) : (s = s || []).push(h, null));
      for (h in v) {
        var N = v[h], $ = f != null ? f[h] : void 0;
        if (!(!v.hasOwnProperty(h) || N === $ || N == null && $ == null))
          if (h === Ys)
            if (N && Object.freeze(N), $) {
              for (S in $)
                $.hasOwnProperty(S) && (!N || !N.hasOwnProperty(S)) && (x || (x = {}), x[S] = "");
              for (S in N)
                N.hasOwnProperty(S) && $[S] !== N[S] && (x || (x = {}), x[S] = N[S]);
            } else
              x || (s || (s = []), s.push(h, x)), x = N;
          else if (h === lp) {
            var W = N ? N[kh] : void 0, J = $ ? $[kh] : void 0;
            W != null && J !== W && (s = s || []).push(h, W);
          } else h === $s ? (typeof N == "string" || typeof N == "number") && (s = s || []).push(h, "" + N) : h === _h || h === Nu || (mt.hasOwnProperty(h) ? (N != null && (typeof N != "function" && Nh(h, N), h === "onScroll" && _n("scroll", e)), !s && $ !== N && (s = [])) : (s = s || []).push(h, N));
      }
      return x && (cy(x, v[Ys]), (s = s || []).push(Ys, x)), s;
    }
    function s0(e, t, a, i, o) {
      a === "input" && o.type === "radio" && o.name != null && m(e, o);
      var s = wl(a, i), f = wl(a, o);
      switch (a0(e, t, s, f), a) {
        case "input":
          R(e, o);
          break;
        case "textarea":
          sv(e, o);
          break;
        case "select":
          fc(e, o);
          break;
      }
    }
    function c0(e) {
      {
        var t = e.toLowerCase();
        return rs.hasOwnProperty(t) && rs[t] || null;
      }
    }
    function f0(e, t, a, i, o, s, f) {
      var v, h;
      switch (v = wl(t, a), Dh(t, a), t) {
        case "dialog":
          _n("cancel", e), _n("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          _n("load", e);
          break;
        case "video":
        case "audio":
          for (var S = 0; S < rp.length; S++)
            _n(rp[S], e);
          break;
        case "source":
          _n("error", e);
          break;
        case "img":
        case "image":
        case "link":
          _n("error", e), _n("load", e);
          break;
        case "details":
          _n("toggle", e);
          break;
        case "input":
          ri(e, a), _n("invalid", e);
          break;
        case "option":
          Wt(e, a);
          break;
        case "select":
          co(e, a), _n("invalid", e);
          break;
        case "textarea":
          td(e, a), _n("invalid", e);
          break;
      }
      vc(t, a);
      {
        h = /* @__PURE__ */ new Set();
        for (var x = e.attributes, O = 0; O < x.length; O++) {
          var N = x[O].name.toLowerCase();
          switch (N) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              h.add(x[O].name);
          }
        }
      }
      var $ = null;
      for (var W in a)
        if (a.hasOwnProperty(W)) {
          var J = a[W];
          if (W === $s)
            typeof J == "string" ? e.textContent !== J && (a[Nu] !== !0 && Oh(e.textContent, J, s, f), $ = [$s, J]) : typeof J == "number" && e.textContent !== "" + J && (a[Nu] !== !0 && Oh(e.textContent, J, s, f), $ = [$s, "" + J]);
          else if (mt.hasOwnProperty(W))
            J != null && (typeof J != "function" && Nh(W, J), W === "onScroll" && _n("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof v == "boolean") {
            var Ue = void 0, lt = Nt(W);
            if (a[Nu] !== !0) {
              if (!(W === _h || W === Nu || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              W === "value" || W === "checked" || W === "selected")) {
                if (W === lp) {
                  var Ze = e.innerHTML, Yt = J ? J[kh] : void 0;
                  if (Yt != null) {
                    var Ft = WE(e, Yt);
                    Ft !== Ze && op(W, Ze, Ft);
                  }
                } else if (W === Ys) {
                  if (h.delete(W), QE) {
                    var H = uy(J);
                    Ue = e.getAttribute("style"), H !== Ue && op(W, Ue, H);
                  }
                } else if (v && !T)
                  h.delete(W.toLowerCase()), Ue = ro(e, W, J), J !== Ue && op(W, Ue, J);
                else if (!ke(W, lt, v) && !Vt(W, J, lt, v)) {
                  var Z = !1;
                  if (lt !== null)
                    h.delete(lt.attributeName), Ue = hl(e, W, J, lt);
                  else {
                    var V = i;
                    if (V === Ii && (V = ad(t)), V === Ii)
                      h.delete(W.toLowerCase());
                    else {
                      var xe = c0(W);
                      xe !== null && xe !== W && (Z = !0, h.delete(xe)), h.delete(W);
                    }
                    Ue = ro(e, W, J);
                  }
                  var Ie = T;
                  !Ie && J !== Ue && !Z && op(W, Ue, J);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      h.size > 0 && a[Nu] !== !0 && YE(h), t) {
        case "input":
          ni(e), Y(e, a, !0);
          break;
        case "textarea":
          ni(e), cv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && Lh(e);
          break;
      }
      return $;
    }
    function d0(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Fy(e, t) {
      {
        if (Ia)
          return;
        Ia = !0, g("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Py(e, t) {
      {
        if (Ia)
          return;
        Ia = !0, g('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Hy(e, t, a) {
      {
        if (Ia)
          return;
        Ia = !0, g("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Vy(e, t) {
      {
        if (t === "" || Ia)
          return;
        Ia = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function p0(e, t, a) {
      switch (t) {
        case "input":
          K(e, a);
          return;
        case "textarea":
          ay(e, a);
          return;
        case "select":
          Zf(e, a);
          return;
      }
    }
    var up = function() {
    }, sp = function() {
    };
    {
      var v0 = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], KE = [
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
      ], h0 = KE.concat(["button"]), m0 = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], qE = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      sp = function(e, t) {
        var a = kt({}, e || qE), i = {
          tag: t
        };
        return KE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), h0.indexOf(t) !== -1 && (a.pTagInButtonScope = null), v0.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var y0 = function(e, t) {
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
            return m0.indexOf(t) === -1;
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
      }, g0 = function(e, t) {
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
      }, XE = {};
      up = function(e, t, a) {
        a = a || qE;
        var i = a.current, o = i && i.tag;
        t != null && (e != null && g("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = y0(e, o) ? null : i, f = s ? null : g0(e, a), v = s || f;
        if (v) {
          var h = v.tag, S = !!s + "|" + e + "|" + h;
          if (!XE[S]) {
            XE[S] = !0;
            var x = e, O = "";
            if (e === "#text" ? /\S/.test(t) ? x = "Text nodes" : (x = "Whitespace text nodes", O = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : x = "<" + e + ">", s) {
              var N = "";
              h === "table" && e === "tr" && (N += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", x, h, O, N);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", x, h);
          }
        }
      };
    }
    var Mh = "suppressHydrationWarning", Ah = "$", zh = "/$", cp = "$?", fp = "$!", S0 = "style", By = null, Iy = null;
    function E0(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Yi:
        case ld: {
          t = i === Yi ? "#document" : "#fragment";
          var o = e.documentElement;
          a = o ? o.namespaceURI : id(null, "");
          break;
        }
        default: {
          var s = i === Bn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = id(f, t);
          break;
        }
      }
      {
        var v = t.toLowerCase(), h = sp(null, v);
        return {
          namespace: a,
          ancestorInfo: h
        };
      }
    }
    function C0(e, t, a) {
      {
        var i = e, o = id(i.namespace, t), s = sp(i.ancestorInfo, t);
        return {
          namespace: o,
          ancestorInfo: s
        };
      }
    }
    function k1(e) {
      return e;
    }
    function x0(e) {
      By = Gn(), Iy = zw();
      var t = null;
      return nr(!1), t;
    }
    function b0(e) {
      Uw(Iy), nr(By), By = null, Iy = null;
    }
    function w0(e, t, a, i, o) {
      var s;
      {
        var f = i;
        if (up(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var v = "" + t.children, h = sp(f.ancestorInfo, e);
          up(null, v, h);
        }
        s = f.namespace;
      }
      var S = i0(e, t, a, s);
      return vp(o, S), Xy(S, t), S;
    }
    function T0(e, t) {
      e.appendChild(t);
    }
    function R0(e, t, a, i, o) {
      switch (o0(e, t, a, i), t) {
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
    function _0(e, t, a, i, o, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var v = "" + i.children, h = sp(f.ancestorInfo, t);
          up(null, v, h);
        }
      }
      return u0(e, t, a, i);
    }
    function $y(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function k0(e, t, a, i) {
      {
        var o = a;
        up(null, e, o.ancestorInfo);
      }
      var s = l0(e, t);
      return vp(i, s), s;
    }
    function D0() {
      var e = window.event;
      return e === void 0 ? Pa : uf(e.type);
    }
    var Yy = typeof setTimeout == "function" ? setTimeout : void 0, N0 = typeof clearTimeout == "function" ? clearTimeout : void 0, Qy = -1, JE = typeof Promise == "function" ? Promise : void 0, j0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof JE < "u" ? function(e) {
      return JE.resolve(null).then(e).catch(O0);
    } : Yy;
    function O0(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function L0(e, t, a, i) {
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
    function M0(e, t, a, i, o, s) {
      s0(e, t, a, i, o), Xy(e, o);
    }
    function ZE(e) {
      ou(e, "");
    }
    function A0(e, t, a) {
      e.nodeValue = a;
    }
    function z0(e, t) {
      e.appendChild(t);
    }
    function U0(e, t) {
      var a;
      e.nodeType === Bn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Lh(a);
    }
    function F0(e, t, a) {
      e.insertBefore(t, a);
    }
    function P0(e, t, a) {
      e.nodeType === Bn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function H0(e, t) {
      e.removeChild(t);
    }
    function V0(e, t) {
      e.nodeType === Bn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Wy(e, t) {
      var a = t, i = 0;
      do {
        var o = a.nextSibling;
        if (e.removeChild(a), o && o.nodeType === Bn) {
          var s = o.data;
          if (s === zh)
            if (i === 0) {
              e.removeChild(o), Oo(t);
              return;
            } else
              i--;
          else (s === Ah || s === cp || s === fp) && i++;
        }
        a = o;
      } while (a);
      Oo(t);
    }
    function B0(e, t) {
      e.nodeType === Bn ? Wy(e.parentNode, t) : e.nodeType === Zr && Wy(e, t), Oo(e);
    }
    function I0(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function $0(e) {
      e.nodeValue = "";
    }
    function Y0(e, t) {
      e = e;
      var a = t[S0], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = pc("display", i);
    }
    function Q0(e, t) {
      e.nodeValue = t;
    }
    function W0(e) {
      e.nodeType === Zr ? e.textContent = "" : e.nodeType === Yi && e.documentElement && e.removeChild(e.documentElement);
    }
    function G0(e, t, a) {
      return e.nodeType !== Zr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function K0(e, t) {
      return t === "" || e.nodeType !== $i ? null : e;
    }
    function q0(e) {
      return e.nodeType !== Bn ? null : e;
    }
    function eC(e) {
      return e.data === cp;
    }
    function Gy(e) {
      return e.data === fp;
    }
    function X0(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, o;
      return t && (a = t.dgst, i = t.msg, o = t.stck), {
        message: i,
        digest: a,
        stack: o
      };
    }
    function J0(e, t) {
      e._reactRetry = t;
    }
    function Uh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Zr || t === $i)
          break;
        if (t === Bn) {
          var a = e.data;
          if (a === Ah || a === fp || a === cp)
            break;
          if (a === zh)
            return null;
        }
      }
      return e;
    }
    function dp(e) {
      return Uh(e.nextSibling);
    }
    function Z0(e) {
      return Uh(e.firstChild);
    }
    function eT(e) {
      return Uh(e.firstChild);
    }
    function tT(e) {
      return Uh(e.nextSibling);
    }
    function nT(e, t, a, i, o, s, f) {
      vp(s, e), Xy(e, a);
      var v;
      {
        var h = o;
        v = h.namespace;
      }
      var S = (s.mode & Lt) !== at;
      return f0(e, t, a, v, i, S, f);
    }
    function rT(e, t, a, i) {
      return vp(a, e), a.mode & Lt, d0(e, t);
    }
    function aT(e, t) {
      vp(t, e);
    }
    function iT(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Bn) {
          var i = t.data;
          if (i === zh) {
            if (a === 0)
              return dp(t);
            a--;
          } else (i === Ah || i === fp || i === cp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function tC(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Bn) {
          var i = t.data;
          if (i === Ah || i === fp || i === cp) {
            if (a === 0)
              return t;
            a--;
          } else i === zh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function lT(e) {
      Oo(e);
    }
    function oT(e) {
      Oo(e);
    }
    function uT(e) {
      return e !== "head" && e !== "body";
    }
    function sT(e, t, a, i) {
      var o = !0;
      Oh(t.nodeValue, a, i, o);
    }
    function cT(e, t, a, i, o, s) {
      if (t[Mh] !== !0) {
        var f = !0;
        Oh(i.nodeValue, o, s, f);
      }
    }
    function fT(e, t) {
      t.nodeType === Zr ? Fy(e, t) : t.nodeType === Bn || Py(e, t);
    }
    function dT(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Zr ? Fy(a, t) : t.nodeType === Bn || Py(a, t));
      }
    }
    function pT(e, t, a, i, o) {
      (o || t[Mh] !== !0) && (i.nodeType === Zr ? Fy(a, i) : i.nodeType === Bn || Py(a, i));
    }
    function vT(e, t, a) {
      Hy(e, t);
    }
    function hT(e, t) {
      Vy(e, t);
    }
    function mT(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Hy(i, t);
      }
    }
    function yT(e, t) {
      {
        var a = e.parentNode;
        a !== null && Vy(a, t);
      }
    }
    function gT(e, t, a, i, o, s) {
      (s || t[Mh] !== !0) && Hy(a, i);
    }
    function ST(e, t, a, i, o) {
      (o || t[Mh] !== !0) && Vy(a, i);
    }
    function ET(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function CT(e) {
      ap(e);
    }
    var xf = Math.random().toString(36).slice(2), bf = "__reactFiber$" + xf, Ky = "__reactProps$" + xf, pp = "__reactContainer$" + xf, qy = "__reactEvents$" + xf, xT = "__reactListeners$" + xf, bT = "__reactHandles$" + xf;
    function wT(e) {
      delete e[bf], delete e[Ky], delete e[qy], delete e[xT], delete e[bT];
    }
    function vp(e, t) {
      t[bf] = e;
    }
    function Fh(e, t) {
      t[pp] = e;
    }
    function nC(e) {
      e[pp] = null;
    }
    function hp(e) {
      return !!e[pp];
    }
    function Qs(e) {
      var t = e[bf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[pp] || a[bf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var o = tC(e); o !== null; ) {
              var s = o[bf];
              if (s)
                return s;
              o = tC(o);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function ju(e) {
      var t = e[bf] || e[pp];
      return t && (t.tag === te || t.tag === ne || t.tag === le || t.tag === P) ? t : null;
    }
    function wf(e) {
      if (e.tag === te || e.tag === ne)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Ph(e) {
      return e[Ky] || null;
    }
    function Xy(e, t) {
      e[Ky] = t;
    }
    function TT(e) {
      var t = e[qy];
      return t === void 0 && (t = e[qy] = /* @__PURE__ */ new Set()), t;
    }
    var rC = {}, aC = b.ReactDebugCurrentFrame;
    function Hh(e) {
      if (e) {
        var t = e._owner, a = Hi(e.type, e._source, t ? t.type : null);
        aC.setExtraStackFrame(a);
      } else
        aC.setExtraStackFrame(null);
    }
    function nl(e, t, a, i, o) {
      {
        var s = Function.call.bind(Hn);
        for (var f in e)
          if (s(e, f)) {
            var v = void 0;
            try {
              if (typeof e[f] != "function") {
                var h = Error((i || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw h.name = "Invariant Violation", h;
              }
              v = e[f](t, f, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (S) {
              v = S;
            }
            v && !(v instanceof Error) && (Hh(o), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof v), Hh(null)), v instanceof Error && !(v.message in rC) && (rC[v.message] = !0, Hh(o), g("Failed %s type: %s", a, v.message), Hh(null));
          }
      }
    }
    var Jy = [], Vh;
    Vh = [];
    var Fo = -1;
    function Ou(e) {
      return {
        current: e
      };
    }
    function ca(e, t) {
      if (Fo < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== Vh[Fo] && g("Unexpected Fiber popped."), e.current = Jy[Fo], Jy[Fo] = null, Vh[Fo] = null, Fo--;
    }
    function fa(e, t, a) {
      Fo++, Jy[Fo] = e.current, Vh[Fo] = a, e.current = t;
    }
    var Zy;
    Zy = {};
    var ci = {};
    Object.freeze(ci);
    var Po = Ou(ci), $l = Ou(!1), eg = ci;
    function Tf(e, t, a) {
      return a && Yl(t) ? eg : Po.current;
    }
    function iC(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Rf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return ci;
        var o = e.stateNode;
        if (o && o.__reactInternalMemoizedUnmaskedChildContext === t)
          return o.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var v = ht(e) || "Unknown";
          nl(i, s, "context", v);
        }
        return o && iC(e, t, s), s;
      }
    }
    function Bh() {
      return $l.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Ih(e) {
      ca($l, e), ca(Po, e);
    }
    function tg(e) {
      ca($l, e), ca(Po, e);
    }
    function lC(e, t, a) {
      {
        if (Po.current !== ci)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        fa(Po, t, e), fa($l, a, e);
      }
    }
    function oC(e, t, a) {
      {
        var i = e.stateNode, o = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = ht(e) || "Unknown";
            Zy[s] || (Zy[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var v in f)
          if (!(v in o))
            throw new Error((ht(e) || "Unknown") + '.getChildContext(): key "' + v + '" is not defined in childContextTypes.');
        {
          var h = ht(e) || "Unknown";
          nl(o, f, "child context", h);
        }
        return kt({}, a, f);
      }
    }
    function $h(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ci;
        return eg = Po.current, fa(Po, a, e), fa($l, $l.current, e), !0;
      }
    }
    function uC(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var o = oC(e, t, eg);
          i.__reactInternalMemoizedMergedChildContext = o, ca($l, e), ca(Po, e), fa(Po, o, e), fa($l, a, e);
        } else
          ca($l, e), fa($l, a, e);
      }
    }
    function RT(e) {
      {
        if (!go(e) || e.tag !== z)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case P:
              return t.stateNode.context;
            case z: {
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
    var Lu = 0, Yh = 1, Ho = null, ng = !1, rg = !1;
    function sC(e) {
      Ho === null ? Ho = [e] : Ho.push(e);
    }
    function _T(e) {
      ng = !0, sC(e);
    }
    function cC() {
      ng && Mu();
    }
    function Mu() {
      if (!rg && Ho !== null) {
        rg = !0;
        var e = 0, t = Va();
        try {
          var a = !0, i = Ho;
          for (Wn(Pr); e < i.length; e++) {
            var o = i[e];
            do
              o = o(a);
            while (o !== null);
          }
          Ho = null, ng = !1;
        } catch (s) {
          throw Ho !== null && (Ho = Ho.slice(e + 1)), gd(fs, Mu), s;
        } finally {
          Wn(t), rg = !1;
        }
      }
      return null;
    }
    var _f = [], kf = 0, Qh = null, Wh = 0, Li = [], Mi = 0, Ws = null, Vo = 1, Bo = "";
    function kT(e) {
      return Ks(), (e.flags & bi) !== rt;
    }
    function DT(e) {
      return Ks(), Wh;
    }
    function NT() {
      var e = Bo, t = Vo, a = t & ~jT(t);
      return a.toString(32) + e;
    }
    function Gs(e, t) {
      Ks(), _f[kf++] = Wh, _f[kf++] = Qh, Qh = e, Wh = t;
    }
    function fC(e, t, a) {
      Ks(), Li[Mi++] = Vo, Li[Mi++] = Bo, Li[Mi++] = Ws, Ws = e;
      var i = Vo, o = Bo, s = Gh(i) - 1, f = i & ~(1 << s), v = a + 1, h = Gh(t) + s;
      if (h > 30) {
        var S = s - s % 5, x = (1 << S) - 1, O = (f & x).toString(32), N = f >> S, $ = s - S, W = Gh(t) + $, J = v << $, Ue = J | N, lt = O + o;
        Vo = 1 << W | Ue, Bo = lt;
      } else {
        var Ze = v << s, Yt = Ze | f, Ft = o;
        Vo = 1 << h | Yt, Bo = Ft;
      }
    }
    function ag(e) {
      Ks();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Gs(e, a), fC(e, a, i);
      }
    }
    function Gh(e) {
      return 32 - Yn(e);
    }
    function jT(e) {
      return 1 << Gh(e) - 1;
    }
    function ig(e) {
      for (; e === Qh; )
        Qh = _f[--kf], _f[kf] = null, Wh = _f[--kf], _f[kf] = null;
      for (; e === Ws; )
        Ws = Li[--Mi], Li[Mi] = null, Bo = Li[--Mi], Li[Mi] = null, Vo = Li[--Mi], Li[Mi] = null;
    }
    function OT() {
      return Ks(), Ws !== null ? {
        id: Vo,
        overflow: Bo
      } : null;
    }
    function LT(e, t) {
      Ks(), Li[Mi++] = Vo, Li[Mi++] = Bo, Li[Mi++] = Ws, Vo = t.id, Bo = t.overflow, Ws = e;
    }
    function Ks() {
      $r() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ir = null, Ai = null, rl = !1, qs = !1, Au = null;
    function MT() {
      rl && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function dC() {
      qs = !0;
    }
    function AT() {
      return qs;
    }
    function zT(e) {
      var t = e.stateNode.containerInfo;
      return Ai = eT(t), Ir = e, rl = !0, Au = null, qs = !1, !0;
    }
    function UT(e, t, a) {
      return Ai = tT(t), Ir = e, rl = !0, Au = null, qs = !1, a !== null && LT(e, a), !0;
    }
    function pC(e, t) {
      switch (e.tag) {
        case P: {
          fT(e.stateNode.containerInfo, t);
          break;
        }
        case te: {
          var a = (e.mode & Lt) !== at;
          pT(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case le: {
          var i = e.memoizedState;
          i.dehydrated !== null && dT(i.dehydrated, t);
          break;
        }
      }
    }
    function vC(e, t) {
      pC(e, t);
      var a = Vk();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Ma) : i.push(a);
    }
    function lg(e, t) {
      {
        if (qs)
          return;
        switch (e.tag) {
          case P: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case te:
                var i = t.type;
                t.pendingProps, vT(a, i);
                break;
              case ne:
                var o = t.pendingProps;
                hT(a, o);
                break;
            }
            break;
          }
          case te: {
            var s = e.type, f = e.memoizedProps, v = e.stateNode;
            switch (t.tag) {
              case te: {
                var h = t.type, S = t.pendingProps, x = (e.mode & Lt) !== at;
                gT(
                  s,
                  f,
                  v,
                  h,
                  S,
                  // TODO: Delete this argument when we remove the legacy root API.
                  x
                );
                break;
              }
              case ne: {
                var O = t.pendingProps, N = (e.mode & Lt) !== at;
                ST(
                  s,
                  f,
                  v,
                  O,
                  // TODO: Delete this argument when we remove the legacy root API.
                  N
                );
                break;
              }
            }
            break;
          }
          case le: {
            var $ = e.memoizedState, W = $.dehydrated;
            if (W !== null) switch (t.tag) {
              case te:
                var J = t.type;
                t.pendingProps, mT(W, J);
                break;
              case ne:
                var Ue = t.pendingProps;
                yT(W, Ue);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function hC(e, t) {
      t.flags = t.flags & ~ta | wn, lg(e, t);
    }
    function mC(e, t) {
      switch (e.tag) {
        case te: {
          var a = e.type;
          e.pendingProps;
          var i = G0(t, a);
          return i !== null ? (e.stateNode = i, Ir = e, Ai = Z0(i), !0) : !1;
        }
        case ne: {
          var o = e.pendingProps, s = K0(t, o);
          return s !== null ? (e.stateNode = s, Ir = e, Ai = null, !0) : !1;
        }
        case le: {
          var f = q0(t);
          if (f !== null) {
            var v = {
              dehydrated: f,
              treeContext: OT(),
              retryLane: ia
            };
            e.memoizedState = v;
            var h = Bk(f);
            return h.return = e, e.child = h, Ir = e, Ai = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function og(e) {
      return (e.mode & Lt) !== at && (e.flags & et) === rt;
    }
    function ug(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function sg(e) {
      if (rl) {
        var t = Ai;
        if (!t) {
          og(e) && (lg(Ir, e), ug()), hC(Ir, e), rl = !1, Ir = e;
          return;
        }
        var a = t;
        if (!mC(e, t)) {
          og(e) && (lg(Ir, e), ug()), t = dp(a);
          var i = Ir;
          if (!t || !mC(e, t)) {
            hC(Ir, e), rl = !1, Ir = e;
            return;
          }
          vC(i, a);
        }
      }
    }
    function FT(e, t, a) {
      var i = e.stateNode, o = !qs, s = nT(i, e.type, e.memoizedProps, t, a, e, o);
      return e.updateQueue = s, s !== null;
    }
    function PT(e) {
      var t = e.stateNode, a = e.memoizedProps, i = rT(t, a, e);
      if (i) {
        var o = Ir;
        if (o !== null)
          switch (o.tag) {
            case P: {
              var s = o.stateNode.containerInfo, f = (o.mode & Lt) !== at;
              sT(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case te: {
              var v = o.type, h = o.memoizedProps, S = o.stateNode, x = (o.mode & Lt) !== at;
              cT(
                v,
                h,
                S,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                x
              );
              break;
            }
          }
      }
      return i;
    }
    function HT(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      aT(a, e);
    }
    function VT(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return iT(a);
    }
    function yC(e) {
      for (var t = e.return; t !== null && t.tag !== te && t.tag !== P && t.tag !== le; )
        t = t.return;
      Ir = t;
    }
    function Kh(e) {
      if (e !== Ir)
        return !1;
      if (!rl)
        return yC(e), rl = !0, !1;
      if (e.tag !== P && (e.tag !== te || uT(e.type) && !$y(e.type, e.memoizedProps))) {
        var t = Ai;
        if (t)
          if (og(e))
            gC(e), ug();
          else
            for (; t; )
              vC(e, t), t = dp(t);
      }
      return yC(e), e.tag === le ? Ai = VT(e) : Ai = Ir ? dp(e.stateNode) : null, !0;
    }
    function BT() {
      return rl && Ai !== null;
    }
    function gC(e) {
      for (var t = Ai; t; )
        pC(e, t), t = dp(t);
    }
    function Df() {
      Ir = null, Ai = null, rl = !1, qs = !1;
    }
    function SC() {
      Au !== null && (db(Au), Au = null);
    }
    function $r() {
      return rl;
    }
    function cg(e) {
      Au === null ? Au = [e] : Au.push(e);
    }
    var IT = b.ReactCurrentBatchConfig, $T = null;
    function YT() {
      return IT.transition;
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
      var QT = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & un && (t = a), a = a.return;
        return t;
      }, Xs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, mp = [], yp = [], gp = [], Sp = [], Ep = [], Cp = [], Js = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Js.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && mp.push(e), e.mode & un && typeof t.UNSAFE_componentWillMount == "function" && yp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && gp.push(e), e.mode & un && typeof t.UNSAFE_componentWillReceiveProps == "function" && Sp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Ep.push(e), e.mode & un && typeof t.UNSAFE_componentWillUpdate == "function" && Cp.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(N) {
          e.add(ht(N) || "Component"), Js.add(N.type);
        }), mp = []);
        var t = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(N) {
          t.add(ht(N) || "Component"), Js.add(N.type);
        }), yp = []);
        var a = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(N) {
          a.add(ht(N) || "Component"), Js.add(N.type);
        }), gp = []);
        var i = /* @__PURE__ */ new Set();
        Sp.length > 0 && (Sp.forEach(function(N) {
          i.add(ht(N) || "Component"), Js.add(N.type);
        }), Sp = []);
        var o = /* @__PURE__ */ new Set();
        Ep.length > 0 && (Ep.forEach(function(N) {
          o.add(ht(N) || "Component"), Js.add(N.type);
        }), Ep = []);
        var s = /* @__PURE__ */ new Set();
        if (Cp.length > 0 && (Cp.forEach(function(N) {
          s.add(ht(N) || "Component"), Js.add(N.type);
        }), Cp = []), t.size > 0) {
          var f = Xs(t);
          g(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var v = Xs(i);
          g(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, v);
        }
        if (s.size > 0) {
          var h = Xs(s);
          g(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, h);
        }
        if (e.size > 0) {
          var S = Xs(e);
          D(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, S);
        }
        if (a.size > 0) {
          var x = Xs(a);
          D(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, x);
        }
        if (o.size > 0) {
          var O = Xs(o);
          D(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, O);
        }
      };
      var qh = /* @__PURE__ */ new Map(), EC = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = QT(e);
        if (a === null) {
          g("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!EC.has(e.type)) {
          var i = qh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], qh.set(a, i)), i.push(e));
        }
      }, al.flushLegacyContextWarning = function() {
        qh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(ht(s) || "Component"), EC.add(s.type);
            });
            var o = Xs(i);
            try {
              an(a), g(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o);
            } finally {
              yn();
            }
          }
        });
      }, al.discardPendingWarnings = function() {
        mp = [], yp = [], gp = [], Sp = [], Ep = [], Cp = [], qh = /* @__PURE__ */ new Map();
      };
    }
    var fg, dg, pg, vg, hg, CC = function(e, t) {
    };
    fg = !1, dg = !1, pg = {}, vg = {}, hg = {}, CC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = ht(t) || "Component";
        vg[a] || (vg[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function WT(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function xp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & un || M) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== z) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !WT(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var o = ht(e) || "Component";
          pg[o] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', o, i), pg[o] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var v = s;
            if (v.tag !== z)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = v.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var h = f;
          Da(i, "ref");
          var S = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === S)
            return t.ref;
          var x = function(O) {
            var N = h.refs;
            O === null ? delete N[S] : N[S] = O;
          };
          return x._stringRef = S, x;
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
    function Xh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Jh(e) {
      {
        var t = ht(e) || "Component";
        if (hg[t])
          return;
        hg[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function xC(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function bC(e) {
      function t(H, Z) {
        if (e) {
          var V = H.deletions;
          V === null ? (H.deletions = [Z], H.flags |= Ma) : V.push(Z);
        }
      }
      function a(H, Z) {
        if (!e)
          return null;
        for (var V = Z; V !== null; )
          t(H, V), V = V.sibling;
        return null;
      }
      function i(H, Z) {
        for (var V = /* @__PURE__ */ new Map(), xe = Z; xe !== null; )
          xe.key !== null ? V.set(xe.key, xe) : V.set(xe.index, xe), xe = xe.sibling;
        return V;
      }
      function o(H, Z) {
        var V = oc(H, Z);
        return V.index = 0, V.sibling = null, V;
      }
      function s(H, Z, V) {
        if (H.index = V, !e)
          return H.flags |= bi, Z;
        var xe = H.alternate;
        if (xe !== null) {
          var Ie = xe.index;
          return Ie < Z ? (H.flags |= wn, Z) : Ie;
        } else
          return H.flags |= wn, Z;
      }
      function f(H) {
        return e && H.alternate === null && (H.flags |= wn), H;
      }
      function v(H, Z, V, xe) {
        if (Z === null || Z.tag !== ne) {
          var Ie = cE(V, H.mode, xe);
          return Ie.return = H, Ie;
        } else {
          var Pe = o(Z, V);
          return Pe.return = H, Pe;
        }
      }
      function h(H, Z, V, xe) {
        var Ie = V.type;
        if (Ie === pi)
          return x(H, Z, V.props.children, xe, V.key);
        if (Z !== null && (Z.elementType === Ie || // Keep this check inline so it only runs on the false path:
        kb(Z, V) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Ie == "object" && Ie !== null && Ie.$$typeof === yt && xC(Ie) === Z.type)) {
          var Pe = o(Z, V.props);
          return Pe.ref = xp(H, Z, V), Pe.return = H, Pe._debugSource = V._source, Pe._debugOwner = V._owner, Pe;
        }
        var ft = sE(V, H.mode, xe);
        return ft.ref = xp(H, Z, V), ft.return = H, ft;
      }
      function S(H, Z, V, xe) {
        if (Z === null || Z.tag !== G || Z.stateNode.containerInfo !== V.containerInfo || Z.stateNode.implementation !== V.implementation) {
          var Ie = fE(V, H.mode, xe);
          return Ie.return = H, Ie;
        } else {
          var Pe = o(Z, V.children || []);
          return Pe.return = H, Pe;
        }
      }
      function x(H, Z, V, xe, Ie) {
        if (Z === null || Z.tag !== X) {
          var Pe = Qu(V, H.mode, xe, Ie);
          return Pe.return = H, Pe;
        } else {
          var ft = o(Z, V);
          return ft.return = H, ft;
        }
      }
      function O(H, Z, V) {
        if (typeof Z == "string" && Z !== "" || typeof Z == "number") {
          var xe = cE("" + Z, H.mode, V);
          return xe.return = H, xe;
        }
        if (typeof Z == "object" && Z !== null) {
          switch (Z.$$typeof) {
            case Ar: {
              var Ie = sE(Z, H.mode, V);
              return Ie.ref = xp(H, null, Z), Ie.return = H, Ie;
            }
            case dr: {
              var Pe = fE(Z, H.mode, V);
              return Pe.return = H, Pe;
            }
            case yt: {
              var ft = Z._payload, Ct = Z._init;
              return O(H, Ct(ft), V);
            }
          }
          if (Dt(Z) || bt(Z)) {
            var cn = Qu(Z, H.mode, V, null);
            return cn.return = H, cn;
          }
          Xh(H, Z);
        }
        return typeof Z == "function" && Jh(H), null;
      }
      function N(H, Z, V, xe) {
        var Ie = Z !== null ? Z.key : null;
        if (typeof V == "string" && V !== "" || typeof V == "number")
          return Ie !== null ? null : v(H, Z, "" + V, xe);
        if (typeof V == "object" && V !== null) {
          switch (V.$$typeof) {
            case Ar:
              return V.key === Ie ? h(H, Z, V, xe) : null;
            case dr:
              return V.key === Ie ? S(H, Z, V, xe) : null;
            case yt: {
              var Pe = V._payload, ft = V._init;
              return N(H, Z, ft(Pe), xe);
            }
          }
          if (Dt(V) || bt(V))
            return Ie !== null ? null : x(H, Z, V, xe, null);
          Xh(H, V);
        }
        return typeof V == "function" && Jh(H), null;
      }
      function $(H, Z, V, xe, Ie) {
        if (typeof xe == "string" && xe !== "" || typeof xe == "number") {
          var Pe = H.get(V) || null;
          return v(Z, Pe, "" + xe, Ie);
        }
        if (typeof xe == "object" && xe !== null) {
          switch (xe.$$typeof) {
            case Ar: {
              var ft = H.get(xe.key === null ? V : xe.key) || null;
              return h(Z, ft, xe, Ie);
            }
            case dr: {
              var Ct = H.get(xe.key === null ? V : xe.key) || null;
              return S(Z, Ct, xe, Ie);
            }
            case yt:
              var cn = xe._payload, en = xe._init;
              return $(H, Z, V, en(cn), Ie);
          }
          if (Dt(xe) || bt(xe)) {
            var rr = H.get(V) || null;
            return x(Z, rr, xe, Ie, null);
          }
          Xh(Z, xe);
        }
        return typeof xe == "function" && Jh(Z), null;
      }
      function W(H, Z, V) {
        {
          if (typeof H != "object" || H === null)
            return Z;
          switch (H.$$typeof) {
            case Ar:
            case dr:
              CC(H, V);
              var xe = H.key;
              if (typeof xe != "string")
                break;
              if (Z === null) {
                Z = /* @__PURE__ */ new Set(), Z.add(xe);
                break;
              }
              if (!Z.has(xe)) {
                Z.add(xe);
                break;
              }
              g("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", xe);
              break;
            case yt:
              var Ie = H._payload, Pe = H._init;
              W(Pe(Ie), Z, V);
              break;
          }
        }
        return Z;
      }
      function J(H, Z, V, xe) {
        for (var Ie = null, Pe = 0; Pe < V.length; Pe++) {
          var ft = V[Pe];
          Ie = W(ft, Ie, H);
        }
        for (var Ct = null, cn = null, en = Z, rr = 0, tn = 0, qn = null; en !== null && tn < V.length; tn++) {
          en.index > tn ? (qn = en, en = null) : qn = en.sibling;
          var pa = N(H, en, V[tn], xe);
          if (pa === null) {
            en === null && (en = qn);
            break;
          }
          e && en && pa.alternate === null && t(H, en), rr = s(pa, rr, tn), cn === null ? Ct = pa : cn.sibling = pa, cn = pa, en = qn;
        }
        if (tn === V.length) {
          if (a(H, en), $r()) {
            var Xr = tn;
            Gs(H, Xr);
          }
          return Ct;
        }
        if (en === null) {
          for (; tn < V.length; tn++) {
            var di = O(H, V[tn], xe);
            di !== null && (rr = s(di, rr, tn), cn === null ? Ct = di : cn.sibling = di, cn = di);
          }
          if ($r()) {
            var _a = tn;
            Gs(H, _a);
          }
          return Ct;
        }
        for (var ka = i(H, en); tn < V.length; tn++) {
          var va = $(ka, H, tn, V[tn], xe);
          va !== null && (e && va.alternate !== null && ka.delete(va.key === null ? tn : va.key), rr = s(va, rr, tn), cn === null ? Ct = va : cn.sibling = va, cn = va);
        }
        if (e && ka.forEach(function(Gf) {
          return t(H, Gf);
        }), $r()) {
          var Ko = tn;
          Gs(H, Ko);
        }
        return Ct;
      }
      function Ue(H, Z, V, xe) {
        var Ie = bt(V);
        if (typeof Ie != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          V[Symbol.toStringTag] === "Generator" && (dg || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), dg = !0), V.entries === Ie && (fg || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), fg = !0);
          var Pe = Ie.call(V);
          if (Pe)
            for (var ft = null, Ct = Pe.next(); !Ct.done; Ct = Pe.next()) {
              var cn = Ct.value;
              ft = W(cn, ft, H);
            }
        }
        var en = Ie.call(V);
        if (en == null)
          throw new Error("An iterable object provided no iterator.");
        for (var rr = null, tn = null, qn = Z, pa = 0, Xr = 0, di = null, _a = en.next(); qn !== null && !_a.done; Xr++, _a = en.next()) {
          qn.index > Xr ? (di = qn, qn = null) : di = qn.sibling;
          var ka = N(H, qn, _a.value, xe);
          if (ka === null) {
            qn === null && (qn = di);
            break;
          }
          e && qn && ka.alternate === null && t(H, qn), pa = s(ka, pa, Xr), tn === null ? rr = ka : tn.sibling = ka, tn = ka, qn = di;
        }
        if (_a.done) {
          if (a(H, qn), $r()) {
            var va = Xr;
            Gs(H, va);
          }
          return rr;
        }
        if (qn === null) {
          for (; !_a.done; Xr++, _a = en.next()) {
            var Ko = O(H, _a.value, xe);
            Ko !== null && (pa = s(Ko, pa, Xr), tn === null ? rr = Ko : tn.sibling = Ko, tn = Ko);
          }
          if ($r()) {
            var Gf = Xr;
            Gs(H, Gf);
          }
          return rr;
        }
        for (var ev = i(H, qn); !_a.done; Xr++, _a = en.next()) {
          var Zl = $(ev, H, Xr, _a.value, xe);
          Zl !== null && (e && Zl.alternate !== null && ev.delete(Zl.key === null ? Xr : Zl.key), pa = s(Zl, pa, Xr), tn === null ? rr = Zl : tn.sibling = Zl, tn = Zl);
        }
        if (e && ev.forEach(function(SD) {
          return t(H, SD);
        }), $r()) {
          var gD = Xr;
          Gs(H, gD);
        }
        return rr;
      }
      function lt(H, Z, V, xe) {
        if (Z !== null && Z.tag === ne) {
          a(H, Z.sibling);
          var Ie = o(Z, V);
          return Ie.return = H, Ie;
        }
        a(H, Z);
        var Pe = cE(V, H.mode, xe);
        return Pe.return = H, Pe;
      }
      function Ze(H, Z, V, xe) {
        for (var Ie = V.key, Pe = Z; Pe !== null; ) {
          if (Pe.key === Ie) {
            var ft = V.type;
            if (ft === pi) {
              if (Pe.tag === X) {
                a(H, Pe.sibling);
                var Ct = o(Pe, V.props.children);
                return Ct.return = H, Ct._debugSource = V._source, Ct._debugOwner = V._owner, Ct;
              }
            } else if (Pe.elementType === ft || // Keep this check inline so it only runs on the false path:
            kb(Pe, V) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof ft == "object" && ft !== null && ft.$$typeof === yt && xC(ft) === Pe.type) {
              a(H, Pe.sibling);
              var cn = o(Pe, V.props);
              return cn.ref = xp(H, Pe, V), cn.return = H, cn._debugSource = V._source, cn._debugOwner = V._owner, cn;
            }
            a(H, Pe);
            break;
          } else
            t(H, Pe);
          Pe = Pe.sibling;
        }
        if (V.type === pi) {
          var en = Qu(V.props.children, H.mode, xe, V.key);
          return en.return = H, en;
        } else {
          var rr = sE(V, H.mode, xe);
          return rr.ref = xp(H, Z, V), rr.return = H, rr;
        }
      }
      function Yt(H, Z, V, xe) {
        for (var Ie = V.key, Pe = Z; Pe !== null; ) {
          if (Pe.key === Ie)
            if (Pe.tag === G && Pe.stateNode.containerInfo === V.containerInfo && Pe.stateNode.implementation === V.implementation) {
              a(H, Pe.sibling);
              var ft = o(Pe, V.children || []);
              return ft.return = H, ft;
            } else {
              a(H, Pe);
              break;
            }
          else
            t(H, Pe);
          Pe = Pe.sibling;
        }
        var Ct = fE(V, H.mode, xe);
        return Ct.return = H, Ct;
      }
      function Ft(H, Z, V, xe) {
        var Ie = typeof V == "object" && V !== null && V.type === pi && V.key === null;
        if (Ie && (V = V.props.children), typeof V == "object" && V !== null) {
          switch (V.$$typeof) {
            case Ar:
              return f(Ze(H, Z, V, xe));
            case dr:
              return f(Yt(H, Z, V, xe));
            case yt:
              var Pe = V._payload, ft = V._init;
              return Ft(H, Z, ft(Pe), xe);
          }
          if (Dt(V))
            return J(H, Z, V, xe);
          if (bt(V))
            return Ue(H, Z, V, xe);
          Xh(H, V);
        }
        return typeof V == "string" && V !== "" || typeof V == "number" ? f(lt(H, Z, "" + V, xe)) : (typeof V == "function" && Jh(H), a(H, Z));
      }
      return Ft;
    }
    var Nf = bC(!0), wC = bC(!1);
    function GT(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = oc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = oc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function KT(e, t) {
      for (var a = e.child; a !== null; )
        zk(a, t), a = a.sibling;
    }
    var mg = Ou(null), yg;
    yg = {};
    var Zh = null, jf = null, gg = null, em = !1;
    function tm() {
      Zh = null, jf = null, gg = null, em = !1;
    }
    function TC() {
      em = !0;
    }
    function RC() {
      em = !1;
    }
    function _C(e, t, a) {
      fa(mg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== yg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = yg;
    }
    function Sg(e, t) {
      var a = mg.current;
      ca(mg, t), e._currentValue = a;
    }
    function Eg(e, t, a) {
      for (var i = e; i !== null; ) {
        var o = i.alternate;
        if (jo(i.childLanes, t) ? o !== null && !jo(o.childLanes, t) && (o.childLanes = Rt(o.childLanes, t)) : (i.childLanes = Rt(i.childLanes, t), o !== null && (o.childLanes = Rt(o.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function qT(e, t, a) {
      XT(e, t, a);
    }
    function XT(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var o = void 0, s = i.dependencies;
        if (s !== null) {
          o = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === z) {
                var v = Ts(a), h = Io(fn, v);
                h.tag = rm;
                var S = i.updateQueue;
                if (S !== null) {
                  var x = S.shared, O = x.pending;
                  O === null ? h.next = h : (h.next = O.next, O.next = h), x.pending = h;
                }
              }
              i.lanes = Rt(i.lanes, a);
              var N = i.alternate;
              N !== null && (N.lanes = Rt(N.lanes, a)), Eg(i.return, a, e), s.lanes = Rt(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === oe)
          o = i.type === e.type ? null : i.child;
        else if (i.tag === be) {
          var $ = i.return;
          if ($ === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          $.lanes = Rt($.lanes, a);
          var W = $.alternate;
          W !== null && (W.lanes = Rt(W.lanes, a)), Eg($, a, e), o = i.sibling;
        } else
          o = i.child;
        if (o !== null)
          o.return = i;
        else
          for (o = i; o !== null; ) {
            if (o === e) {
              o = null;
              break;
            }
            var J = o.sibling;
            if (J !== null) {
              J.return = o.return, o = J;
              break;
            }
            o = o.return;
          }
        i = o;
      }
    }
    function Of(e, t) {
      Zh = e, jf = null, gg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (la(a.lanes, t) && Up(), a.firstContext = null);
      }
    }
    function sr(e) {
      em && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (gg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (jf === null) {
          if (Zh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          jf = a, Zh.dependencies = {
            lanes: de,
            firstContext: a
          };
        } else
          jf = jf.next = a;
      }
      return t;
    }
    var Zs = null;
    function Cg(e) {
      Zs === null ? Zs = [e] : Zs.push(e);
    }
    function JT() {
      if (Zs !== null) {
        for (var e = 0; e < Zs.length; e++) {
          var t = Zs[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, o = t.pending;
            if (o !== null) {
              var s = o.next;
              o.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        Zs = null;
      }
    }
    function kC(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, Cg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, nm(e, i);
    }
    function ZT(e, t, a, i) {
      var o = t.interleaved;
      o === null ? (a.next = a, Cg(t)) : (a.next = o.next, o.next = a), t.interleaved = a;
    }
    function eR(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, Cg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, nm(e, i);
    }
    function $a(e, t) {
      return nm(e, t);
    }
    var tR = nm;
    function nm(e, t) {
      e.lanes = Rt(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = Rt(a.lanes, t)), a === null && (e.flags & (wn | ta)) !== rt && wb(e);
      for (var i = e, o = e.return; o !== null; )
        o.childLanes = Rt(o.childLanes, t), a = o.alternate, a !== null ? a.childLanes = Rt(a.childLanes, t) : (o.flags & (wn | ta)) !== rt && wb(e), i = o, o = o.return;
      if (i.tag === P) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var DC = 0, NC = 1, rm = 2, xg = 3, am = !1, bg, im;
    bg = !1, im = null;
    function wg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: de
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function jC(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var o = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = o;
      }
    }
    function Io(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: DC,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function zu(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var o = i.shared;
      if (im === o && !bg && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), bg = !0), Z_()) {
        var s = o.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), o.pending = t, tR(e, a);
      } else
        return eR(e, o, t, a);
    }
    function lm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var o = i.shared;
        if (Ad(a)) {
          var s = o.lanes;
          s = Ud(s, e.pendingLanes);
          var f = Rt(s, a);
          o.lanes = f, rf(e, f);
        }
      }
    }
    function Tg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var o = i.updateQueue;
        if (a === o) {
          var s = null, f = null, v = a.firstBaseUpdate;
          if (v !== null) {
            var h = v;
            do {
              var S = {
                eventTime: h.eventTime,
                lane: h.lane,
                tag: h.tag,
                payload: h.payload,
                callback: h.callback,
                next: null
              };
              f === null ? s = f = S : (f.next = S, f = S), h = h.next;
            } while (h !== null);
            f === null ? s = f = t : (f.next = t, f = t);
          } else
            s = f = t;
          a = {
            baseState: o.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: f,
            shared: o.shared,
            effects: o.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var x = a.lastBaseUpdate;
      x === null ? a.firstBaseUpdate = t : x.next = t, a.lastBaseUpdate = t;
    }
    function nR(e, t, a, i, o, s) {
      switch (a.tag) {
        case NC: {
          var f = a.payload;
          if (typeof f == "function") {
            TC();
            var v = f.call(s, i, o);
            {
              if (e.mode & un) {
                Tn(!0);
                try {
                  f.call(s, i, o);
                } finally {
                  Tn(!1);
                }
              }
              RC();
            }
            return v;
          }
          return f;
        }
        case xg:
          e.flags = e.flags & ~ir | et;
        case DC: {
          var h = a.payload, S;
          if (typeof h == "function") {
            TC(), S = h.call(s, i, o);
            {
              if (e.mode & un) {
                Tn(!0);
                try {
                  h.call(s, i, o);
                } finally {
                  Tn(!1);
                }
              }
              RC();
            }
          } else
            S = h;
          return S == null ? i : kt({}, i, S);
        }
        case rm:
          return am = !0, i;
      }
      return i;
    }
    function om(e, t, a, i) {
      var o = e.updateQueue;
      am = !1, im = o.shared;
      var s = o.firstBaseUpdate, f = o.lastBaseUpdate, v = o.shared.pending;
      if (v !== null) {
        o.shared.pending = null;
        var h = v, S = h.next;
        h.next = null, f === null ? s = S : f.next = S, f = h;
        var x = e.alternate;
        if (x !== null) {
          var O = x.updateQueue, N = O.lastBaseUpdate;
          N !== f && (N === null ? O.firstBaseUpdate = S : N.next = S, O.lastBaseUpdate = h);
        }
      }
      if (s !== null) {
        var $ = o.baseState, W = de, J = null, Ue = null, lt = null, Ze = s;
        do {
          var Yt = Ze.lane, Ft = Ze.eventTime;
          if (jo(i, Yt)) {
            if (lt !== null) {
              var Z = {
                eventTime: Ft,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Gt,
                tag: Ze.tag,
                payload: Ze.payload,
                callback: Ze.callback,
                next: null
              };
              lt = lt.next = Z;
            }
            $ = nR(e, o, Ze, $, t, a);
            var V = Ze.callback;
            if (V !== null && // If the update was already committed, we should not queue its
            // callback again.
            Ze.lane !== Gt) {
              e.flags |= vn;
              var xe = o.effects;
              xe === null ? o.effects = [Ze] : xe.push(Ze);
            }
          } else {
            var H = {
              eventTime: Ft,
              lane: Yt,
              tag: Ze.tag,
              payload: Ze.payload,
              callback: Ze.callback,
              next: null
            };
            lt === null ? (Ue = lt = H, J = $) : lt = lt.next = H, W = Rt(W, Yt);
          }
          if (Ze = Ze.next, Ze === null) {
            if (v = o.shared.pending, v === null)
              break;
            var Ie = v, Pe = Ie.next;
            Ie.next = null, Ze = Pe, o.lastBaseUpdate = Ie, o.shared.pending = null;
          }
        } while (!0);
        lt === null && (J = $), o.baseState = J, o.firstBaseUpdate = Ue, o.lastBaseUpdate = lt;
        var ft = o.shared.interleaved;
        if (ft !== null) {
          var Ct = ft;
          do
            W = Rt(W, Ct.lane), Ct = Ct.next;
          while (Ct !== ft);
        } else s === null && (o.shared.lanes = de);
        Kp(W), e.lanes = W, e.memoizedState = $;
      }
      im = null;
    }
    function rR(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function OC() {
      am = !1;
    }
    function um() {
      return am;
    }
    function LC(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o], f = s.callback;
          f !== null && (s.callback = null, rR(f, a));
        }
    }
    var bp = {}, Uu = Ou(bp), wp = Ou(bp), sm = Ou(bp);
    function cm(e) {
      if (e === bp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function MC() {
      var e = cm(sm.current);
      return e;
    }
    function Rg(e, t) {
      fa(sm, t, e), fa(wp, e, e), fa(Uu, bp, e);
      var a = E0(t);
      ca(Uu, e), fa(Uu, a, e);
    }
    function Lf(e) {
      ca(Uu, e), ca(wp, e), ca(sm, e);
    }
    function _g() {
      var e = cm(Uu.current);
      return e;
    }
    function AC(e) {
      cm(sm.current);
      var t = cm(Uu.current), a = C0(t, e.type);
      t !== a && (fa(wp, e, e), fa(Uu, a, e));
    }
    function kg(e) {
      wp.current === e && (ca(Uu, e), ca(wp, e));
    }
    var aR = 0, zC = 1, UC = 1, Tp = 2, il = Ou(aR);
    function Dg(e, t) {
      return (e & t) !== 0;
    }
    function Mf(e) {
      return e & zC;
    }
    function Ng(e, t) {
      return e & zC | t;
    }
    function iR(e, t) {
      return e | t;
    }
    function Fu(e, t) {
      fa(il, t, e);
    }
    function Af(e) {
      ca(il, e);
    }
    function lR(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function fm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === le) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || eC(i) || Gy(i))
              return t;
          }
        } else if (t.tag === je && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var o = (t.flags & et) !== rt;
          if (o)
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
    var Ya = (
      /*   */
      0
    ), Sr = (
      /* */
      1
    ), Ql = (
      /*  */
      2
    ), Er = (
      /*    */
      4
    ), Yr = (
      /*   */
      8
    ), jg = [];
    function Og() {
      for (var e = 0; e < jg.length; e++) {
        var t = jg[e];
        t._workInProgressVersionPrimary = null;
      }
      jg.length = 0;
    }
    function oR(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var Ve = b.ReactCurrentDispatcher, Rp = b.ReactCurrentBatchConfig, Lg, zf;
    Lg = /* @__PURE__ */ new Set();
    var ec = de, sn = null, Cr = null, xr = null, dm = !1, _p = !1, kp = 0, uR = 0, sR = 25, ie = null, zi = null, Pu = -1, Mg = !1;
    function rn() {
      {
        var e = ie;
        zi === null ? zi = [e] : zi.push(e);
      }
    }
    function De() {
      {
        var e = ie;
        zi !== null && (Pu++, zi[Pu] !== e && cR(e));
      }
    }
    function Uf(e) {
      e != null && !Dt(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", ie, typeof e);
    }
    function cR(e) {
      {
        var t = ht(sn);
        if (!Lg.has(t) && (Lg.add(t), zi !== null)) {
          for (var a = "", i = 30, o = 0; o <= Pu; o++) {
            for (var s = zi[o], f = o === Pu ? e : s, v = o + 1 + ". " + s; v.length < i; )
              v += " ";
            v += f + `
`, a += v;
          }
          g(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function da() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function Ag(e, t) {
      if (Mg)
        return !1;
      if (t === null)
        return g("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", ie), !1;
      e.length !== t.length && g(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, ie, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!ye(e[a], t[a]))
          return !1;
      return !0;
    }
    function Ff(e, t, a, i, o, s) {
      ec = s, sn = t, zi = e !== null ? e._debugHookTypes : null, Pu = -1, Mg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = de, e !== null && e.memoizedState !== null ? Ve.current = ix : zi !== null ? Ve.current = ax : Ve.current = rx;
      var f = a(i, o);
      if (_p) {
        var v = 0;
        do {
          if (_p = !1, kp = 0, v >= sR)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          v += 1, Mg = !1, Cr = null, xr = null, t.updateQueue = null, Pu = -1, Ve.current = lx, f = a(i, o);
        } while (_p);
      }
      Ve.current = Tm, t._debugHookTypes = zi;
      var h = Cr !== null && Cr.next !== null;
      if (ec = de, sn = null, Cr = null, xr = null, ie = null, zi = null, Pu = -1, e !== null && (e.flags & $n) !== (t.flags & $n) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & Lt) !== at && g("Internal React error: Expected static flag was missing. Please notify the React team."), dm = !1, h)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Pf() {
      var e = kp !== 0;
      return kp = 0, e;
    }
    function FC(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Jt) !== at ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Rs(e.lanes, a);
    }
    function PC() {
      if (Ve.current = Tm, dm) {
        for (var e = sn.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        dm = !1;
      }
      ec = de, sn = null, Cr = null, xr = null, zi = null, Pu = -1, ie = null, JC = !1, _p = !1, kp = 0;
    }
    function Wl() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return xr === null ? sn.memoizedState = xr = e : xr = xr.next = e, xr;
    }
    function Ui() {
      var e;
      if (Cr === null) {
        var t = sn.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = Cr.next;
      var a;
      if (xr === null ? a = sn.memoizedState : a = xr.next, a !== null)
        xr = a, a = xr.next, Cr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        Cr = e;
        var i = {
          memoizedState: Cr.memoizedState,
          baseState: Cr.baseState,
          baseQueue: Cr.baseQueue,
          queue: Cr.queue,
          next: null
        };
        xr === null ? sn.memoizedState = xr = i : xr = xr.next = i;
      }
      return xr;
    }
    function HC() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function zg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Ug(e, t, a) {
      var i = Wl(), o;
      a !== void 0 ? o = a(t) : o = t, i.memoizedState = i.baseState = o;
      var s = {
        pending: null,
        interleaved: null,
        lanes: de,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: o
      };
      i.queue = s;
      var f = s.dispatch = vR.bind(null, sn, s);
      return [i.memoizedState, f];
    }
    function Fg(e, t, a) {
      var i = Ui(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = Cr, f = s.baseQueue, v = o.pending;
      if (v !== null) {
        if (f !== null) {
          var h = f.next, S = v.next;
          f.next = S, v.next = h;
        }
        s.baseQueue !== f && g("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = v, o.pending = null;
      }
      if (f !== null) {
        var x = f.next, O = s.baseState, N = null, $ = null, W = null, J = x;
        do {
          var Ue = J.lane;
          if (jo(ec, Ue)) {
            if (W !== null) {
              var Ze = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Gt,
                action: J.action,
                hasEagerState: J.hasEagerState,
                eagerState: J.eagerState,
                next: null
              };
              W = W.next = Ze;
            }
            if (J.hasEagerState)
              O = J.eagerState;
            else {
              var Yt = J.action;
              O = e(O, Yt);
            }
          } else {
            var lt = {
              lane: Ue,
              action: J.action,
              hasEagerState: J.hasEagerState,
              eagerState: J.eagerState,
              next: null
            };
            W === null ? ($ = W = lt, N = O) : W = W.next = lt, sn.lanes = Rt(sn.lanes, Ue), Kp(Ue);
          }
          J = J.next;
        } while (J !== null && J !== x);
        W === null ? N = O : W.next = $, ye(O, i.memoizedState) || Up(), i.memoizedState = O, i.baseState = N, i.baseQueue = W, o.lastRenderedState = O;
      }
      var Ft = o.interleaved;
      if (Ft !== null) {
        var H = Ft;
        do {
          var Z = H.lane;
          sn.lanes = Rt(sn.lanes, Z), Kp(Z), H = H.next;
        } while (H !== Ft);
      } else f === null && (o.lanes = de);
      var V = o.dispatch;
      return [i.memoizedState, V];
    }
    function Pg(e, t, a) {
      var i = Ui(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = o.dispatch, f = o.pending, v = i.memoizedState;
      if (f !== null) {
        o.pending = null;
        var h = f.next, S = h;
        do {
          var x = S.action;
          v = e(v, x), S = S.next;
        } while (S !== h);
        ye(v, i.memoizedState) || Up(), i.memoizedState = v, i.baseQueue === null && (i.baseState = v), o.lastRenderedState = v;
      }
      return [v, s];
    }
    function D1(e, t, a) {
    }
    function N1(e, t, a) {
    }
    function Hg(e, t, a) {
      var i = sn, o = Wl(), s, f = $r();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), zf || s !== a() && (g("The result of getServerSnapshot should be cached to avoid an infinite loop"), zf = !0);
      } else {
        if (s = t(), !zf) {
          var v = t();
          ye(s, v) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
        }
        var h = $m();
        if (h === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        tf(h, ec) || VC(i, t, s);
      }
      o.memoizedState = s;
      var S = {
        value: s,
        getSnapshot: t
      };
      return o.queue = S, ym(IC.bind(null, i, S, e), [e]), i.flags |= ea, Dp(Sr | Yr, BC.bind(null, i, S, s, t), void 0, null), s;
    }
    function pm(e, t, a) {
      var i = sn, o = Ui(), s = t();
      if (!zf) {
        var f = t();
        ye(s, f) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
      }
      var v = o.memoizedState, h = !ye(v, s);
      h && (o.memoizedState = s, Up());
      var S = o.queue;
      if (jp(IC.bind(null, i, S, e), [e]), S.getSnapshot !== t || h || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      xr !== null && xr.memoizedState.tag & Sr) {
        i.flags |= ea, Dp(Sr | Yr, BC.bind(null, i, S, s, t), void 0, null);
        var x = $m();
        if (x === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        tf(x, ec) || VC(i, t, s);
      }
      return s;
    }
    function VC(e, t, a) {
      e.flags |= mu;
      var i = {
        getSnapshot: t,
        value: a
      }, o = sn.updateQueue;
      if (o === null)
        o = HC(), sn.updateQueue = o, o.stores = [i];
      else {
        var s = o.stores;
        s === null ? o.stores = [i] : s.push(i);
      }
    }
    function BC(e, t, a, i) {
      t.value = a, t.getSnapshot = i, $C(t) && YC(e);
    }
    function IC(e, t, a) {
      var i = function() {
        $C(t) && YC(e);
      };
      return a(i);
    }
    function $C(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !ye(a, i);
      } catch {
        return !0;
      }
    }
    function YC(e) {
      var t = $a(e, ct);
      t !== null && Rr(t, e, ct, fn);
    }
    function vm(e) {
      var t = Wl();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: de,
        dispatch: null,
        lastRenderedReducer: zg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = hR.bind(null, sn, a);
      return [t.memoizedState, i];
    }
    function Vg(e) {
      return Fg(zg);
    }
    function Bg(e) {
      return Pg(zg);
    }
    function Dp(e, t, a, i) {
      var o = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = sn.updateQueue;
      if (s === null)
        s = HC(), sn.updateQueue = s, s.lastEffect = o.next = o;
      else {
        var f = s.lastEffect;
        if (f === null)
          s.lastEffect = o.next = o;
        else {
          var v = f.next;
          f.next = o, o.next = v, s.lastEffect = o;
        }
      }
      return o;
    }
    function Ig(e) {
      var t = Wl();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function hm(e) {
      var t = Ui();
      return t.memoizedState;
    }
    function Np(e, t, a, i) {
      var o = Wl(), s = i === void 0 ? null : i;
      sn.flags |= e, o.memoizedState = Dp(Sr | t, a, void 0, s);
    }
    function mm(e, t, a, i) {
      var o = Ui(), s = i === void 0 ? null : i, f = void 0;
      if (Cr !== null) {
        var v = Cr.memoizedState;
        if (f = v.destroy, s !== null) {
          var h = v.deps;
          if (Ag(s, h)) {
            o.memoizedState = Dp(t, a, f, s);
            return;
          }
        }
      }
      sn.flags |= e, o.memoizedState = Dp(Sr | t, a, f, s);
    }
    function ym(e, t) {
      return (sn.mode & Jt) !== at ? Np(wi | ea | kc, Yr, e, t) : Np(ea | kc, Yr, e, t);
    }
    function jp(e, t) {
      return mm(ea, Yr, e, t);
    }
    function $g(e, t) {
      return Np(Bt, Ql, e, t);
    }
    function gm(e, t) {
      return mm(Bt, Ql, e, t);
    }
    function Yg(e, t) {
      var a = Bt;
      return a |= Wi, (sn.mode & Jt) !== at && (a |= kl), Np(a, Er, e, t);
    }
    function Sm(e, t) {
      return mm(Bt, Er, e, t);
    }
    function QC(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var o = t;
        o.hasOwnProperty("current") || g("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(o).join(", ") + "}");
        var s = e();
        return o.current = s, function() {
          o.current = null;
        };
      }
    }
    function Qg(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, o = Bt;
      return o |= Wi, (sn.mode & Jt) !== at && (o |= kl), Np(o, Er, QC.bind(null, t, e), i);
    }
    function Em(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return mm(Bt, Er, QC.bind(null, t, e), i);
    }
    function fR(e, t) {
    }
    var Cm = fR;
    function Wg(e, t) {
      var a = Wl(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function xm(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (Ag(i, s))
          return o[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Gg(e, t) {
      var a = Wl(), i = t === void 0 ? null : t, o = e();
      return a.memoizedState = [o, i], o;
    }
    function bm(e, t) {
      var a = Ui(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (Ag(i, s))
          return o[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Kg(e) {
      var t = Wl();
      return t.memoizedState = e, e;
    }
    function WC(e) {
      var t = Ui(), a = Cr, i = a.memoizedState;
      return KC(t, i, e);
    }
    function GC(e) {
      var t = Ui();
      if (Cr === null)
        return t.memoizedState = e, e;
      var a = Cr.memoizedState;
      return KC(t, a, e);
    }
    function KC(e, t, a) {
      var i = !Ld(ec);
      if (i) {
        if (!ye(a, t)) {
          var o = zd();
          sn.lanes = Rt(sn.lanes, o), Kp(o), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Up()), e.memoizedState = a, a;
    }
    function dR(e, t, a) {
      var i = Va();
      Wn(eh(i, ki)), e(!0);
      var o = Rp.transition;
      Rp.transition = {};
      var s = Rp.transition;
      Rp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Wn(i), Rp.transition = o, o === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && D("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function qg() {
      var e = vm(!1), t = e[0], a = e[1], i = dR.bind(null, a), o = Wl();
      return o.memoizedState = i, [t, i];
    }
    function qC() {
      var e = Vg(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    function XC() {
      var e = Bg(), t = e[0], a = Ui(), i = a.memoizedState;
      return [t, i];
    }
    var JC = !1;
    function pR() {
      return JC;
    }
    function Xg() {
      var e = Wl(), t = $m(), a = t.identifierPrefix, i;
      if ($r()) {
        var o = NT();
        i = ":" + a + "R" + o;
        var s = kp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = uR++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function wm() {
      var e = Ui(), t = e.memoizedState;
      return t;
    }
    function vR(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = $u(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (ZC(e))
        ex(t, o);
      else {
        var s = kC(e, t, o, i);
        if (s !== null) {
          var f = Ra();
          Rr(s, e, i, f), tx(s, t, i);
        }
      }
      nx(e, i);
    }
    function hR(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = $u(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (ZC(e))
        ex(t, o);
      else {
        var s = e.alternate;
        if (e.lanes === de && (s === null || s.lanes === de)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var v;
            v = Ve.current, Ve.current = ll;
            try {
              var h = t.lastRenderedState, S = f(h, a);
              if (o.hasEagerState = !0, o.eagerState = S, ye(S, h)) {
                ZT(e, t, o, i);
                return;
              }
            } catch {
            } finally {
              Ve.current = v;
            }
          }
        }
        var x = kC(e, t, o, i);
        if (x !== null) {
          var O = Ra();
          Rr(x, e, i, O), tx(x, t, i);
        }
      }
      nx(e, i);
    }
    function ZC(e) {
      var t = e.alternate;
      return e === sn || t !== null && t === sn;
    }
    function ex(e, t) {
      _p = dm = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function tx(e, t, a) {
      if (Ad(a)) {
        var i = t.lanes;
        i = Ud(i, e.pendingLanes);
        var o = Rt(i, a);
        t.lanes = o, rf(e, o);
      }
    }
    function nx(e, t, a) {
      ms(e, t);
    }
    var Tm = {
      readContext: sr,
      useCallback: da,
      useContext: da,
      useEffect: da,
      useImperativeHandle: da,
      useInsertionEffect: da,
      useLayoutEffect: da,
      useMemo: da,
      useReducer: da,
      useRef: da,
      useState: da,
      useDebugValue: da,
      useDeferredValue: da,
      useTransition: da,
      useMutableSource: da,
      useSyncExternalStore: da,
      useId: da,
      unstable_isNewReconciler: he
    }, rx = null, ax = null, ix = null, lx = null, Gl = null, ll = null, Rm = null;
    {
      var Jg = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, gt = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      rx = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", rn(), Uf(t), Wg(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", rn(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", rn(), Uf(t), ym(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", rn(), Uf(a), Qg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", rn(), Uf(t), $g(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", rn(), Uf(t), Yg(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", rn(), Uf(t);
          var a = Ve.current;
          Ve.current = Gl;
          try {
            return Gg(e, t);
          } finally {
            Ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", rn();
          var i = Ve.current;
          Ve.current = Gl;
          try {
            return Ug(e, t, a);
          } finally {
            Ve.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", rn(), Ig(e);
        },
        useState: function(e) {
          ie = "useState", rn();
          var t = Ve.current;
          Ve.current = Gl;
          try {
            return vm(e);
          } finally {
            Ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", rn(), void 0;
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", rn(), Kg(e);
        },
        useTransition: function() {
          return ie = "useTransition", rn(), qg();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", rn(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", rn(), Hg(e, t, a);
        },
        useId: function() {
          return ie = "useId", rn(), Xg();
        },
        unstable_isNewReconciler: he
      }, ax = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", De(), Wg(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", De(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", De(), ym(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", De(), Qg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", De(), $g(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", De(), Yg(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", De();
          var a = Ve.current;
          Ve.current = Gl;
          try {
            return Gg(e, t);
          } finally {
            Ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", De();
          var i = Ve.current;
          Ve.current = Gl;
          try {
            return Ug(e, t, a);
          } finally {
            Ve.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", De(), Ig(e);
        },
        useState: function(e) {
          ie = "useState", De();
          var t = Ve.current;
          Ve.current = Gl;
          try {
            return vm(e);
          } finally {
            Ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", De(), void 0;
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", De(), Kg(e);
        },
        useTransition: function() {
          return ie = "useTransition", De(), qg();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", De(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", De(), Hg(e, t, a);
        },
        useId: function() {
          return ie = "useId", De(), Xg();
        },
        unstable_isNewReconciler: he
      }, ix = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", De(), xm(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", De(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", De(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", De(), Em(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", De(), gm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", De(), Sm(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", De();
          var a = Ve.current;
          Ve.current = ll;
          try {
            return bm(e, t);
          } finally {
            Ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", De();
          var i = Ve.current;
          Ve.current = ll;
          try {
            return Fg(e, t, a);
          } finally {
            Ve.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", De(), hm();
        },
        useState: function(e) {
          ie = "useState", De();
          var t = Ve.current;
          Ve.current = ll;
          try {
            return Vg(e);
          } finally {
            Ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", De(), Cm();
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", De(), WC(e);
        },
        useTransition: function() {
          return ie = "useTransition", De(), qC();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", De(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", De(), pm(e, t);
        },
        useId: function() {
          return ie = "useId", De(), wm();
        },
        unstable_isNewReconciler: he
      }, lx = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", De(), xm(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", De(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", De(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", De(), Em(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", De(), gm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", De(), Sm(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", De();
          var a = Ve.current;
          Ve.current = Rm;
          try {
            return bm(e, t);
          } finally {
            Ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", De();
          var i = Ve.current;
          Ve.current = Rm;
          try {
            return Pg(e, t, a);
          } finally {
            Ve.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", De(), hm();
        },
        useState: function(e) {
          ie = "useState", De();
          var t = Ve.current;
          Ve.current = Rm;
          try {
            return Bg(e);
          } finally {
            Ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", De(), Cm();
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", De(), GC(e);
        },
        useTransition: function() {
          return ie = "useTransition", De(), XC();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", De(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", De(), pm(e, t);
        },
        useId: function() {
          return ie = "useId", De(), wm();
        },
        unstable_isNewReconciler: he
      }, Gl = {
        readContext: function(e) {
          return Jg(), sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", gt(), rn(), Wg(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", gt(), rn(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", gt(), rn(), ym(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", gt(), rn(), Qg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", gt(), rn(), $g(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", gt(), rn(), Yg(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", gt(), rn();
          var a = Ve.current;
          Ve.current = Gl;
          try {
            return Gg(e, t);
          } finally {
            Ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", gt(), rn();
          var i = Ve.current;
          Ve.current = Gl;
          try {
            return Ug(e, t, a);
          } finally {
            Ve.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", gt(), rn(), Ig(e);
        },
        useState: function(e) {
          ie = "useState", gt(), rn();
          var t = Ve.current;
          Ve.current = Gl;
          try {
            return vm(e);
          } finally {
            Ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", gt(), rn(), void 0;
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", gt(), rn(), Kg(e);
        },
        useTransition: function() {
          return ie = "useTransition", gt(), rn(), qg();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", gt(), rn(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", gt(), rn(), Hg(e, t, a);
        },
        useId: function() {
          return ie = "useId", gt(), rn(), Xg();
        },
        unstable_isNewReconciler: he
      }, ll = {
        readContext: function(e) {
          return Jg(), sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", gt(), De(), xm(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", gt(), De(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", gt(), De(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", gt(), De(), Em(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", gt(), De(), gm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", gt(), De(), Sm(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", gt(), De();
          var a = Ve.current;
          Ve.current = ll;
          try {
            return bm(e, t);
          } finally {
            Ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", gt(), De();
          var i = Ve.current;
          Ve.current = ll;
          try {
            return Fg(e, t, a);
          } finally {
            Ve.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", gt(), De(), hm();
        },
        useState: function(e) {
          ie = "useState", gt(), De();
          var t = Ve.current;
          Ve.current = ll;
          try {
            return Vg(e);
          } finally {
            Ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", gt(), De(), Cm();
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", gt(), De(), WC(e);
        },
        useTransition: function() {
          return ie = "useTransition", gt(), De(), qC();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", gt(), De(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", gt(), De(), pm(e, t);
        },
        useId: function() {
          return ie = "useId", gt(), De(), wm();
        },
        unstable_isNewReconciler: he
      }, Rm = {
        readContext: function(e) {
          return Jg(), sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", gt(), De(), xm(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", gt(), De(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", gt(), De(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", gt(), De(), Em(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", gt(), De(), gm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", gt(), De(), Sm(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", gt(), De();
          var a = Ve.current;
          Ve.current = ll;
          try {
            return bm(e, t);
          } finally {
            Ve.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", gt(), De();
          var i = Ve.current;
          Ve.current = ll;
          try {
            return Pg(e, t, a);
          } finally {
            Ve.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", gt(), De(), hm();
        },
        useState: function(e) {
          ie = "useState", gt(), De();
          var t = Ve.current;
          Ve.current = ll;
          try {
            return Bg(e);
          } finally {
            Ve.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", gt(), De(), Cm();
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", gt(), De(), GC(e);
        },
        useTransition: function() {
          return ie = "useTransition", gt(), De(), XC();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", gt(), De(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", gt(), De(), pm(e, t);
        },
        useId: function() {
          return ie = "useId", gt(), De(), wm();
        },
        unstable_isNewReconciler: he
      };
    }
    var Hu = E.unstable_now, ox = 0, _m = -1, Op = -1, km = -1, Zg = !1, Dm = !1;
    function ux() {
      return Zg;
    }
    function mR() {
      Dm = !0;
    }
    function yR() {
      Zg = !1, Dm = !1;
    }
    function gR() {
      Zg = Dm, Dm = !1;
    }
    function sx() {
      return ox;
    }
    function cx() {
      ox = Hu();
    }
    function eS(e) {
      Op = Hu(), e.actualStartTime < 0 && (e.actualStartTime = Hu());
    }
    function fx(e) {
      Op = -1;
    }
    function Nm(e, t) {
      if (Op >= 0) {
        var a = Hu() - Op;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Op = -1;
      }
    }
    function Kl(e) {
      if (_m >= 0) {
        var t = Hu() - _m;
        _m = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case P:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case Se:
              var o = a.stateNode;
              o.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function tS(e) {
      if (km >= 0) {
        var t = Hu() - km;
        km = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case P:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case Se:
              var o = a.stateNode;
              o !== null && (o.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ql() {
      _m = Hu();
    }
    function nS() {
      km = Hu();
    }
    function rS(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ol(e, t) {
      if (e && e.defaultProps) {
        var a = kt({}, t), i = e.defaultProps;
        for (var o in i)
          a[o] === void 0 && (a[o] = i[o]);
        return a;
      }
      return t;
    }
    var aS = {}, iS, lS, oS, uS, sS, dx, jm, cS, fS, dS, Lp;
    {
      iS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), oS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), cS = /* @__PURE__ */ new Set(), sS = /* @__PURE__ */ new Set(), fS = /* @__PURE__ */ new Set(), dS = /* @__PURE__ */ new Set(), Lp = /* @__PURE__ */ new Set();
      var px = /* @__PURE__ */ new Set();
      jm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          px.has(a) || (px.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, dx = function(e, t) {
        if (t === void 0) {
          var a = Qt(e) || "Component";
          sS.has(a) || (sS.add(a), g("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(aS, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(aS);
    }
    function pS(e, t, a, i) {
      var o = e.memoizedState, s = a(i, o);
      {
        if (e.mode & un) {
          Tn(!0);
          try {
            s = a(i, o);
          } finally {
            Tn(!1);
          }
        }
        dx(t, s);
      }
      var f = s == null ? o : kt({}, o, s);
      if (e.memoizedState = f, e.lanes === de) {
        var v = e.updateQueue;
        v.baseState = f;
      }
    }
    var vS = {
      isMounted: Fv,
      enqueueSetState: function(e, t, a) {
        var i = hu(e), o = Ra(), s = $u(i), f = Io(o, s);
        f.payload = t, a != null && (jm(a, "setState"), f.callback = a);
        var v = zu(i, f, s);
        v !== null && (Rr(v, i, s, o), lm(v, i, s)), ms(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = hu(e), o = Ra(), s = $u(i), f = Io(o, s);
        f.tag = NC, f.payload = t, a != null && (jm(a, "replaceState"), f.callback = a);
        var v = zu(i, f, s);
        v !== null && (Rr(v, i, s, o), lm(v, i, s)), ms(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = hu(e), i = Ra(), o = $u(a), s = Io(i, o);
        s.tag = rm, t != null && (jm(t, "forceUpdate"), s.callback = t);
        var f = zu(a, s, o);
        f !== null && (Rr(f, a, o, i), lm(f, a, o)), Ac(a, o);
      }
    };
    function vx(e, t, a, i, o, s, f) {
      var v = e.stateNode;
      if (typeof v.shouldComponentUpdate == "function") {
        var h = v.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & un) {
            Tn(!0);
            try {
              h = v.shouldComponentUpdate(i, s, f);
            } finally {
              Tn(!1);
            }
          }
          h === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Qt(t) || "Component");
        }
        return h;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Ge(a, i) || !Ge(o, s) : !0;
    }
    function SR(e, t, a) {
      var i = e.stateNode;
      {
        var o = Qt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", o) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", o)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", o), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", o), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", o), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", o), t.childContextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & un) === at && (Lp.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), t.contextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & un) === at && (Lp.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", o), t.contextType && t.contextTypes && !fS.has(t) && (fS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", o)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", o), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Qt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", o), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", o), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", o), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", o);
        var f = i.props !== a;
        i.props !== void 0 && f && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", o, o), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", o, o), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !oS.has(t) && (oS.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Qt(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", o);
        var v = i.state;
        v && (typeof v != "object" || Dt(v)) && g("%s.state: must be set to an object or null", o), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", o);
      }
    }
    function hx(e, t) {
      t.updater = vS, e.stateNode = t, yo(t, e), t._reactInternalInstance = aS;
    }
    function mx(e, t, a) {
      var i = !1, o = ci, s = ci, f = t.contextType;
      if ("contextType" in t) {
        var v = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === _ && f._context === void 0
        );
        if (!v && !dS.has(t)) {
          dS.add(t);
          var h = "";
          f === void 0 ? h = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? h = " However, it is set to a " + typeof f + "." : f.$$typeof === hi ? h = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? h = " Did you accidentally pass the Context.Consumer instead?" : h = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Qt(t) || "Component", h);
        }
      }
      if (typeof f == "object" && f !== null)
        s = sr(f);
      else {
        o = Tf(e, t, !0);
        var S = t.contextTypes;
        i = S != null, s = i ? Rf(e, o) : ci;
      }
      var x = new t(a, s);
      if (e.mode & un) {
        Tn(!0);
        try {
          x = new t(a, s);
        } finally {
          Tn(!1);
        }
      }
      var O = e.memoizedState = x.state !== null && x.state !== void 0 ? x.state : null;
      hx(e, x);
      {
        if (typeof t.getDerivedStateFromProps == "function" && O === null) {
          var N = Qt(t) || "Component";
          lS.has(N) || (lS.add(N), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", N, x.state === null ? "null" : "undefined", N));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof x.getSnapshotBeforeUpdate == "function") {
          var $ = null, W = null, J = null;
          if (typeof x.componentWillMount == "function" && x.componentWillMount.__suppressDeprecationWarning !== !0 ? $ = "componentWillMount" : typeof x.UNSAFE_componentWillMount == "function" && ($ = "UNSAFE_componentWillMount"), typeof x.componentWillReceiveProps == "function" && x.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? W = "componentWillReceiveProps" : typeof x.UNSAFE_componentWillReceiveProps == "function" && (W = "UNSAFE_componentWillReceiveProps"), typeof x.componentWillUpdate == "function" && x.componentWillUpdate.__suppressDeprecationWarning !== !0 ? J = "componentWillUpdate" : typeof x.UNSAFE_componentWillUpdate == "function" && (J = "UNSAFE_componentWillUpdate"), $ !== null || W !== null || J !== null) {
            var Ue = Qt(t) || "Component", lt = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            uS.has(Ue) || (uS.add(Ue), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, Ue, lt, $ !== null ? `
  ` + $ : "", W !== null ? `
  ` + W : "", J !== null ? `
  ` + J : ""));
          }
        }
      }
      return i && iC(e, o, s), x;
    }
    function ER(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", ht(e) || "Component"), vS.enqueueReplaceState(t, t.state, null));
    }
    function yx(e, t, a, i) {
      var o = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== o) {
        {
          var s = ht(e) || "Component";
          iS.has(s) || (iS.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        vS.enqueueReplaceState(t, t.state, null);
      }
    }
    function hS(e, t, a, i) {
      SR(e, t, a);
      var o = e.stateNode;
      o.props = a, o.state = e.memoizedState, o.refs = {}, wg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        o.context = sr(s);
      else {
        var f = Tf(e, t, !0);
        o.context = Rf(e, f);
      }
      {
        if (o.state === a) {
          var v = Qt(t) || "Component";
          cS.has(v) || (cS.add(v), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", v));
        }
        e.mode & un && al.recordLegacyContextWarning(e, o), al.recordUnsafeLifecycleWarnings(e, o);
      }
      o.state = e.memoizedState;
      var h = t.getDerivedStateFromProps;
      if (typeof h == "function" && (pS(e, t, h, a), o.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof o.getSnapshotBeforeUpdate != "function" && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (ER(e, o), om(e, a, o, i), o.state = e.memoizedState), typeof o.componentDidMount == "function") {
        var S = Bt;
        S |= Wi, (e.mode & Jt) !== at && (S |= kl), e.flags |= S;
      }
    }
    function CR(e, t, a, i) {
      var o = e.stateNode, s = e.memoizedProps;
      o.props = s;
      var f = o.context, v = t.contextType, h = ci;
      if (typeof v == "object" && v !== null)
        h = sr(v);
      else {
        var S = Tf(e, t, !0);
        h = Rf(e, S);
      }
      var x = t.getDerivedStateFromProps, O = typeof x == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      !O && (typeof o.UNSAFE_componentWillReceiveProps == "function" || typeof o.componentWillReceiveProps == "function") && (s !== a || f !== h) && yx(e, o, a, h), OC();
      var N = e.memoizedState, $ = o.state = N;
      if (om(e, a, o, i), $ = e.memoizedState, s === a && N === $ && !Bh() && !um()) {
        if (typeof o.componentDidMount == "function") {
          var W = Bt;
          W |= Wi, (e.mode & Jt) !== at && (W |= kl), e.flags |= W;
        }
        return !1;
      }
      typeof x == "function" && (pS(e, t, x, a), $ = e.memoizedState);
      var J = um() || vx(e, t, s, a, N, $, h);
      if (J) {
        if (!O && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function") {
          var Ue = Bt;
          Ue |= Wi, (e.mode & Jt) !== at && (Ue |= kl), e.flags |= Ue;
        }
      } else {
        if (typeof o.componentDidMount == "function") {
          var lt = Bt;
          lt |= Wi, (e.mode & Jt) !== at && (lt |= kl), e.flags |= lt;
        }
        e.memoizedProps = a, e.memoizedState = $;
      }
      return o.props = a, o.state = $, o.context = h, J;
    }
    function xR(e, t, a, i, o) {
      var s = t.stateNode;
      jC(e, t);
      var f = t.memoizedProps, v = t.type === t.elementType ? f : ol(t.type, f);
      s.props = v;
      var h = t.pendingProps, S = s.context, x = a.contextType, O = ci;
      if (typeof x == "object" && x !== null)
        O = sr(x);
      else {
        var N = Tf(t, a, !0);
        O = Rf(t, N);
      }
      var $ = a.getDerivedStateFromProps, W = typeof $ == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !W && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== h || S !== O) && yx(t, s, i, O), OC();
      var J = t.memoizedState, Ue = s.state = J;
      if (om(t, i, s, o), Ue = t.memoizedState, f === h && J === Ue && !Bh() && !um() && !Be)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || J !== e.memoizedState) && (t.flags |= Bt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || J !== e.memoizedState) && (t.flags |= er), !1;
      typeof $ == "function" && (pS(t, a, $, i), Ue = t.memoizedState);
      var lt = um() || vx(t, a, v, i, J, Ue, O) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Be;
      return lt ? (!W && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, Ue, O), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, Ue, O)), typeof s.componentDidUpdate == "function" && (t.flags |= Bt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= er)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || J !== e.memoizedState) && (t.flags |= Bt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || J !== e.memoizedState) && (t.flags |= er), t.memoizedProps = i, t.memoizedState = Ue), s.props = i, s.state = Ue, s.context = O, lt;
    }
    function tc(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function mS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function bR(e, t) {
      return !0;
    }
    function yS(e, t) {
      try {
        var a = bR(e, t);
        if (a === !1)
          return;
        var i = t.value, o = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === z)
            return;
          console.error(i);
        }
        var v = o ? ht(o) : null, h = v ? "The above error occurred in the <" + v + "> component:" : "The above error occurred in one of your React components:", S;
        if (e.tag === P)
          S = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var x = ht(e) || "Anonymous";
          S = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + x + ".");
        }
        var O = h + `
` + f + `

` + ("" + S);
        console.error(O);
      } catch (N) {
        setTimeout(function() {
          throw N;
        });
      }
    }
    var wR = typeof WeakMap == "function" ? WeakMap : Map;
    function gx(e, t, a) {
      var i = Io(fn, a);
      i.tag = xg, i.payload = {
        element: null
      };
      var o = t.value;
      return i.callback = function() {
        mk(o), yS(e, t);
      }, i;
    }
    function gS(e, t, a) {
      var i = Io(fn, a);
      i.tag = xg;
      var o = e.type.getDerivedStateFromError;
      if (typeof o == "function") {
        var s = t.value;
        i.payload = function() {
          return o(s);
        }, i.callback = function() {
          Db(e), yS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        Db(e), yS(e, t), typeof o != "function" && vk(this);
        var h = t.value, S = t.stack;
        this.componentDidCatch(h, {
          componentStack: S !== null ? S : ""
        }), typeof o != "function" && (la(e.lanes, ct) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", ht(e) || "Unknown"));
      }), i;
    }
    function Sx(e, t, a) {
      var i = e.pingCache, o;
      if (i === null ? (i = e.pingCache = new wR(), o = /* @__PURE__ */ new Set(), i.set(t, o)) : (o = i.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), i.set(t, o))), !o.has(a)) {
        o.add(a);
        var s = yk.bind(null, e, t, a);
        aa && qp(e, a), t.then(s, s);
      }
    }
    function TR(e, t, a, i) {
      var o = e.updateQueue;
      if (o === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        o.add(a);
    }
    function RR(e, t) {
      var a = e.tag;
      if ((e.mode & Lt) === at && (a === L || a === Ee || a === U)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function Ex(e) {
      var t = e;
      do {
        if (t.tag === le && lR(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function Cx(e, t, a, i, o) {
      if ((e.mode & Lt) === at) {
        if (e === t)
          e.flags |= ir;
        else {
          if (e.flags |= et, a.flags |= _c, a.flags &= -52805, a.tag === z) {
            var s = a.alternate;
            if (s === null)
              a.tag = ue;
            else {
              var f = Io(fn, ct);
              f.tag = rm, zu(a, f, ct);
            }
          }
          a.lanes = Rt(a.lanes, ct);
        }
        return e;
      }
      return e.flags |= ir, e.lanes = o, e;
    }
    function _R(e, t, a, i, o) {
      if (a.flags |= cs, aa && qp(e, o), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        RR(a), $r() && a.mode & Lt && dC();
        var f = Ex(t);
        if (f !== null) {
          f.flags &= ~kr, Cx(f, t, a, e, o), f.mode & Lt && Sx(e, s, o), TR(f, e, s);
          return;
        } else {
          if (!Qv(o)) {
            Sx(e, s, o), XS();
            return;
          }
          var v = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = v;
        }
      } else if ($r() && a.mode & Lt) {
        dC();
        var h = Ex(t);
        if (h !== null) {
          (h.flags & ir) === rt && (h.flags |= kr), Cx(h, t, a, e, o), cg(tc(i, a));
          return;
        }
      }
      i = tc(i, a), lk(i);
      var S = t;
      do {
        switch (S.tag) {
          case P: {
            var x = i;
            S.flags |= ir;
            var O = Ts(o);
            S.lanes = Rt(S.lanes, O);
            var N = gx(S, x, O);
            Tg(S, N);
            return;
          }
          case z:
            var $ = i, W = S.type, J = S.stateNode;
            if ((S.flags & et) === rt && (typeof W.getDerivedStateFromError == "function" || J !== null && typeof J.componentDidCatch == "function" && !Eb(J))) {
              S.flags |= ir;
              var Ue = Ts(o);
              S.lanes = Rt(S.lanes, Ue);
              var lt = gS(S, $, Ue);
              Tg(S, lt);
              return;
            }
            break;
        }
        S = S.return;
      } while (S !== null);
    }
    function kR() {
      return null;
    }
    var Mp = b.ReactCurrentOwner, ul = !1, SS, Ap, ES, CS, xS, nc, bS, Om, zp;
    SS = {}, Ap = {}, ES = {}, CS = {}, xS = {}, nc = !1, bS = {}, Om = {}, zp = {};
    function wa(e, t, a, i) {
      e === null ? t.child = wC(t, null, a, i) : t.child = Nf(t, e.child, a, i);
    }
    function DR(e, t, a, i) {
      t.child = Nf(t, e.child, null, i), t.child = Nf(t, null, a, i);
    }
    function xx(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          Qt(a)
        );
      }
      var f = a.render, v = t.ref, h, S;
      Of(t, o), Ea(t);
      {
        if (Mp.current = t, Zn(!0), h = Ff(e, t, f, i, v, o), S = Pf(), t.mode & un) {
          Tn(!0);
          try {
            h = Ff(e, t, f, i, v, o), S = Pf();
          } finally {
            Tn(!1);
          }
        }
        Zn(!1);
      }
      return Ca(), e !== null && !ul ? (FC(e, t, o), $o(e, t, o)) : ($r() && S && ag(t), t.flags |= ii, wa(e, t, h, o), t.child);
    }
    function bx(e, t, a, i, o) {
      if (e === null) {
        var s = a.type;
        if (Mk(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Wf(s), t.tag = U, t.type = f, RS(t, s), wx(e, t, f, i, o);
        }
        {
          var v = s.propTypes;
          if (v && nl(
            v,
            i,
            // Resolved props
            "prop",
            Qt(s)
          ), a.defaultProps !== void 0) {
            var h = Qt(s) || "Unknown";
            zp[h] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", h), zp[h] = !0);
          }
        }
        var S = uE(a.type, null, i, t, t.mode, o);
        return S.ref = t.ref, S.return = t, t.child = S, S;
      }
      {
        var x = a.type, O = x.propTypes;
        O && nl(
          O,
          i,
          // Resolved props
          "prop",
          Qt(x)
        );
      }
      var N = e.child, $ = OS(e, o);
      if (!$) {
        var W = N.memoizedProps, J = a.compare;
        if (J = J !== null ? J : Ge, J(W, i) && e.ref === t.ref)
          return $o(e, t, o);
      }
      t.flags |= ii;
      var Ue = oc(N, i);
      return Ue.ref = t.ref, Ue.return = t, t.child = Ue, Ue;
    }
    function wx(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === yt) {
          var f = s, v = f._payload, h = f._init;
          try {
            s = h(v);
          } catch {
            s = null;
          }
          var S = s && s.propTypes;
          S && nl(
            S,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            Qt(s)
          );
        }
      }
      if (e !== null) {
        var x = e.memoizedProps;
        if (Ge(x, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ul = !1, t.pendingProps = i = x, OS(e, o))
            (e.flags & _c) !== rt && (ul = !0);
          else return t.lanes = e.lanes, $o(e, t, o);
      }
      return wS(e, t, a, i, o);
    }
    function Tx(e, t, a) {
      var i = t.pendingProps, o = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || Re)
        if ((t.mode & Lt) === at) {
          var f = {
            baseLanes: de,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Ym(t, a);
        } else if (la(a, ia)) {
          var O = {
            baseLanes: de,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = O;
          var N = s !== null ? s.baseLanes : a;
          Ym(t, N);
        } else {
          var v = null, h;
          if (s !== null) {
            var S = s.baseLanes;
            h = Rt(S, a);
          } else
            h = a;
          t.lanes = t.childLanes = ia;
          var x = {
            baseLanes: h,
            cachePool: v,
            transitions: null
          };
          return t.memoizedState = x, t.updateQueue = null, Ym(t, h), null;
        }
      else {
        var $;
        s !== null ? ($ = Rt(s.baseLanes, a), t.memoizedState = null) : $ = a, Ym(t, $);
      }
      return wa(e, t, o, a), t.child;
    }
    function NR(e, t, a) {
      var i = t.pendingProps;
      return wa(e, t, i, a), t.child;
    }
    function jR(e, t, a) {
      var i = t.pendingProps.children;
      return wa(e, t, i, a), t.child;
    }
    function OR(e, t, a) {
      {
        t.flags |= Bt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var o = t.pendingProps, s = o.children;
      return wa(e, t, s, a), t.child;
    }
    function Rx(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= jn, t.flags |= yu);
    }
    function wS(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          Qt(a)
        );
      }
      var f;
      {
        var v = Tf(t, a, !0);
        f = Rf(t, v);
      }
      var h, S;
      Of(t, o), Ea(t);
      {
        if (Mp.current = t, Zn(!0), h = Ff(e, t, a, i, f, o), S = Pf(), t.mode & un) {
          Tn(!0);
          try {
            h = Ff(e, t, a, i, f, o), S = Pf();
          } finally {
            Tn(!1);
          }
        }
        Zn(!1);
      }
      return Ca(), e !== null && !ul ? (FC(e, t, o), $o(e, t, o)) : ($r() && S && ag(t), t.flags |= ii, wa(e, t, h, o), t.child);
    }
    function _x(e, t, a, i, o) {
      {
        switch (Kk(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, v = new f(t.memoizedProps, s.context), h = v.state;
            s.updater.enqueueSetState(s, h, null);
            break;
          }
          case !0: {
            t.flags |= et, t.flags |= ir;
            var S = new Error("Simulated error coming from DevTools"), x = Ts(o);
            t.lanes = Rt(t.lanes, x);
            var O = gS(t, tc(S, t), x);
            Tg(t, O);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var N = a.propTypes;
          N && nl(
            N,
            i,
            // Resolved props
            "prop",
            Qt(a)
          );
        }
      }
      var $;
      Yl(a) ? ($ = !0, $h(t)) : $ = !1, Of(t, o);
      var W = t.stateNode, J;
      W === null ? (Mm(e, t), mx(t, a, i), hS(t, a, i, o), J = !0) : e === null ? J = CR(t, a, i, o) : J = xR(e, t, a, i, o);
      var Ue = TS(e, t, a, J, $, o);
      {
        var lt = t.stateNode;
        J && lt.props !== i && (nc || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", ht(t) || "a component"), nc = !0);
      }
      return Ue;
    }
    function TS(e, t, a, i, o, s) {
      Rx(e, t);
      var f = (t.flags & et) !== rt;
      if (!i && !f)
        return o && uC(t, a, !1), $o(e, t, s);
      var v = t.stateNode;
      Mp.current = t;
      var h;
      if (f && typeof a.getDerivedStateFromError != "function")
        h = null, fx();
      else {
        Ea(t);
        {
          if (Zn(!0), h = v.render(), t.mode & un) {
            Tn(!0);
            try {
              v.render();
            } finally {
              Tn(!1);
            }
          }
          Zn(!1);
        }
        Ca();
      }
      return t.flags |= ii, e !== null && f ? DR(e, t, h, s) : wa(e, t, h, s), t.memoizedState = v.state, o && uC(t, a, !0), t.child;
    }
    function kx(e) {
      var t = e.stateNode;
      t.pendingContext ? lC(e, t.pendingContext, t.pendingContext !== t.context) : t.context && lC(e, t.context, !1), Rg(e, t.containerInfo);
    }
    function LR(e, t, a) {
      if (kx(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, o = t.memoizedState, s = o.element;
      jC(e, t), om(t, i, null, a);
      var f = t.memoizedState;
      t.stateNode;
      var v = f.element;
      if (o.isDehydrated) {
        var h = {
          element: v,
          isDehydrated: !1,
          cache: f.cache,
          pendingSuspenseBoundaries: f.pendingSuspenseBoundaries,
          transitions: f.transitions
        }, S = t.updateQueue;
        if (S.baseState = h, t.memoizedState = h, t.flags & kr) {
          var x = tc(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return Dx(e, t, v, a, x);
        } else if (v !== s) {
          var O = tc(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return Dx(e, t, v, a, O);
        } else {
          zT(t);
          var N = wC(t, null, v, a);
          t.child = N;
          for (var $ = N; $; )
            $.flags = $.flags & ~wn | ta, $ = $.sibling;
        }
      } else {
        if (Df(), v === s)
          return $o(e, t, a);
        wa(e, t, v, a);
      }
      return t.child;
    }
    function Dx(e, t, a, i, o) {
      return Df(), cg(o), t.flags |= kr, wa(e, t, a, i), t.child;
    }
    function MR(e, t, a) {
      AC(t), e === null && sg(t);
      var i = t.type, o = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = o.children, v = $y(i, o);
      return v ? f = null : s !== null && $y(i, s) && (t.flags |= Aa), Rx(e, t), wa(e, t, f, a), t.child;
    }
    function AR(e, t) {
      return e === null && sg(t), null;
    }
    function zR(e, t, a, i) {
      Mm(e, t);
      var o = t.pendingProps, s = a, f = s._payload, v = s._init, h = v(f);
      t.type = h;
      var S = t.tag = Ak(h), x = ol(h, o), O;
      switch (S) {
        case L:
          return RS(t, h), t.type = h = Wf(h), O = wS(null, t, h, x, i), O;
        case z:
          return t.type = h = nE(h), O = _x(null, t, h, x, i), O;
        case Ee:
          return t.type = h = rE(h), O = xx(null, t, h, x, i), O;
        case se: {
          if (t.type !== t.elementType) {
            var N = h.propTypes;
            N && nl(
              N,
              x,
              // Resolved for outer only
              "prop",
              Qt(h)
            );
          }
          return O = bx(
            null,
            t,
            h,
            ol(h.type, x),
            // The inner type can have defaults too
            i
          ), O;
        }
      }
      var $ = "";
      throw h !== null && typeof h == "object" && h.$$typeof === yt && ($ = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + h + ". " + ("Lazy element type must resolve to a class or function." + $));
    }
    function UR(e, t, a, i, o) {
      Mm(e, t), t.tag = z;
      var s;
      return Yl(a) ? (s = !0, $h(t)) : s = !1, Of(t, o), mx(t, a, i), hS(t, a, i, o), TS(null, t, a, !0, s, o);
    }
    function FR(e, t, a, i) {
      Mm(e, t);
      var o = t.pendingProps, s;
      {
        var f = Tf(t, a, !1);
        s = Rf(t, f);
      }
      Of(t, i);
      var v, h;
      Ea(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var S = Qt(a) || "Unknown";
          SS[S] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", S, S), SS[S] = !0);
        }
        t.mode & un && al.recordLegacyContextWarning(t, null), Zn(!0), Mp.current = t, v = Ff(null, t, a, o, s, i), h = Pf(), Zn(!1);
      }
      if (Ca(), t.flags |= ii, typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0) {
        var x = Qt(a) || "Unknown";
        Ap[x] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", x, x, x), Ap[x] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0
      ) {
        {
          var O = Qt(a) || "Unknown";
          Ap[O] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", O, O, O), Ap[O] = !0);
        }
        t.tag = z, t.memoizedState = null, t.updateQueue = null;
        var N = !1;
        return Yl(a) ? (N = !0, $h(t)) : N = !1, t.memoizedState = v.state !== null && v.state !== void 0 ? v.state : null, wg(t), hx(t, v), hS(t, a, o, i), TS(null, t, a, !0, N, i);
      } else {
        if (t.tag = L, t.mode & un) {
          Tn(!0);
          try {
            v = Ff(null, t, a, o, s, i), h = Pf();
          } finally {
            Tn(!1);
          }
        }
        return $r() && h && ag(t), wa(null, t, v, i), RS(t, a), t.child;
      }
    }
    function RS(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Ur();
          i && (a += `

Check the render method of \`` + i + "`.");
          var o = i || "", s = e._debugSource;
          s && (o = s.fileName + ":" + s.lineNumber), xS[o] || (xS[o] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = Qt(t) || "Unknown";
          zp[f] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), zp[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var v = Qt(t) || "Unknown";
          CS[v] || (g("%s: Function components do not support getDerivedStateFromProps.", v), CS[v] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var h = Qt(t) || "Unknown";
          ES[h] || (g("%s: Function components do not support contextType.", h), ES[h] = !0);
        }
      }
    }
    var _S = {
      dehydrated: null,
      treeContext: null,
      retryLane: Gt
    };
    function kS(e) {
      return {
        baseLanes: e,
        cachePool: kR(),
        transitions: null
      };
    }
    function PR(e, t) {
      var a = null;
      return {
        baseLanes: Rt(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function HR(e, t, a, i) {
      if (t !== null) {
        var o = t.memoizedState;
        if (o === null)
          return !1;
      }
      return Dg(e, Tp);
    }
    function VR(e, t) {
      return Rs(e.childLanes, t);
    }
    function Nx(e, t, a) {
      var i = t.pendingProps;
      qk(t) && (t.flags |= et);
      var o = il.current, s = !1, f = (t.flags & et) !== rt;
      if (f || HR(o, e) ? (s = !0, t.flags &= ~et) : (e === null || e.memoizedState !== null) && (o = iR(o, UC)), o = Mf(o), Fu(t, o), e === null) {
        sg(t);
        var v = t.memoizedState;
        if (v !== null) {
          var h = v.dehydrated;
          if (h !== null)
            return QR(t, h);
        }
        var S = i.children, x = i.fallback;
        if (s) {
          var O = BR(t, S, x, a), N = t.child;
          return N.memoizedState = kS(a), t.memoizedState = _S, O;
        } else
          return DS(t, S);
      } else {
        var $ = e.memoizedState;
        if ($ !== null) {
          var W = $.dehydrated;
          if (W !== null)
            return WR(e, t, f, i, W, $, a);
        }
        if (s) {
          var J = i.fallback, Ue = i.children, lt = $R(e, t, Ue, J, a), Ze = t.child, Yt = e.child.memoizedState;
          return Ze.memoizedState = Yt === null ? kS(a) : PR(Yt, a), Ze.childLanes = VR(e, a), t.memoizedState = _S, lt;
        } else {
          var Ft = i.children, H = IR(e, t, Ft, a);
          return t.memoizedState = null, H;
        }
      }
    }
    function DS(e, t, a) {
      var i = e.mode, o = {
        mode: "visible",
        children: t
      }, s = NS(o, i);
      return s.return = e, e.child = s, s;
    }
    function BR(e, t, a, i) {
      var o = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, v, h;
      return (o & Lt) === at && s !== null ? (v = s, v.childLanes = de, v.pendingProps = f, e.mode & Xt && (v.actualDuration = 0, v.actualStartTime = -1, v.selfBaseDuration = 0, v.treeBaseDuration = 0), h = Qu(a, o, i, null)) : (v = NS(f, o), h = Qu(a, o, i, null)), v.return = e, h.return = e, v.sibling = h, e.child = v, h;
    }
    function NS(e, t, a) {
      return jb(e, t, de, null);
    }
    function jx(e, t) {
      return oc(e, t);
    }
    function IR(e, t, a, i) {
      var o = e.child, s = o.sibling, f = jx(o, {
        mode: "visible",
        children: a
      });
      if ((t.mode & Lt) === at && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var v = t.deletions;
        v === null ? (t.deletions = [s], t.flags |= Ma) : v.push(s);
      }
      return t.child = f, f;
    }
    function $R(e, t, a, i, o) {
      var s = t.mode, f = e.child, v = f.sibling, h = {
        mode: "hidden",
        children: a
      }, S;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & Lt) === at && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var x = t.child;
        S = x, S.childLanes = de, S.pendingProps = h, t.mode & Xt && (S.actualDuration = 0, S.actualStartTime = -1, S.selfBaseDuration = f.selfBaseDuration, S.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        S = jx(f, h), S.subtreeFlags = f.subtreeFlags & $n;
      var O;
      return v !== null ? O = oc(v, i) : (O = Qu(i, s, o, null), O.flags |= wn), O.return = t, S.return = t, S.sibling = O, t.child = S, O;
    }
    function Lm(e, t, a, i) {
      i !== null && cg(i), Nf(t, e.child, null, a);
      var o = t.pendingProps, s = o.children, f = DS(t, s);
      return f.flags |= wn, t.memoizedState = null, f;
    }
    function YR(e, t, a, i, o) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, v = NS(f, s), h = Qu(i, s, o, null);
      return h.flags |= wn, v.return = t, h.return = t, v.sibling = h, t.child = v, (t.mode & Lt) !== at && Nf(t, e.child, null, o), h;
    }
    function QR(e, t, a) {
      return (e.mode & Lt) === at ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = ct) : Gy(t) ? e.lanes = Dr : e.lanes = ia, null;
    }
    function WR(e, t, a, i, o, s, f) {
      if (a)
        if (t.flags & kr) {
          t.flags &= ~kr;
          var H = mS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Lm(e, t, f, H);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= et, null;
          var Z = i.children, V = i.fallback, xe = YR(e, t, Z, V, f), Ie = t.child;
          return Ie.memoizedState = kS(f), t.memoizedState = _S, xe;
        }
      else {
        if (MT(), (t.mode & Lt) === at)
          return Lm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Gy(o)) {
          var v, h, S;
          {
            var x = X0(o);
            v = x.digest, h = x.message, S = x.stack;
          }
          var O;
          h ? O = new Error(h) : O = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var N = mS(O, v, S);
          return Lm(e, t, f, N);
        }
        var $ = la(f, e.childLanes);
        if (ul || $) {
          var W = $m();
          if (W !== null) {
            var J = Pd(W, f);
            if (J !== Gt && J !== s.retryLane) {
              s.retryLane = J;
              var Ue = fn;
              $a(e, J), Rr(W, e, J, Ue);
            }
          }
          XS();
          var lt = mS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Lm(e, t, f, lt);
        } else if (eC(o)) {
          t.flags |= et, t.child = e.child;
          var Ze = gk.bind(null, e);
          return J0(o, Ze), null;
        } else {
          UT(t, o, s.treeContext);
          var Yt = i.children, Ft = DS(t, Yt);
          return Ft.flags |= ta, Ft;
        }
      }
    }
    function Ox(e, t, a) {
      e.lanes = Rt(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = Rt(i.lanes, t)), Eg(e.return, t, a);
    }
    function GR(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === le) {
          var o = i.memoizedState;
          o !== null && Ox(i, a, e);
        } else if (i.tag === je)
          Ox(i, a, e);
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
    function KR(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && fm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function qR(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !bS[e])
        if (bS[e] = !0, typeof e == "string")
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
    function XR(e, t) {
      e !== void 0 && !Om[e] && (e !== "collapsed" && e !== "hidden" ? (Om[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (Om[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function Lx(e, t) {
      {
        var a = Dt(e), i = !a && typeof bt(e) == "function";
        if (a || i) {
          var o = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", o, t, o), !1;
        }
      }
      return !0;
    }
    function JR(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (Dt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!Lx(e[a], a))
              return;
        } else {
          var i = bt(e);
          if (typeof i == "function") {
            var o = i.call(e);
            if (o)
              for (var s = o.next(), f = 0; !s.done; s = o.next()) {
                if (!Lx(s.value, f))
                  return;
                f++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function jS(e, t, a, i, o) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: o
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = o);
    }
    function Mx(e, t, a) {
      var i = t.pendingProps, o = i.revealOrder, s = i.tail, f = i.children;
      qR(o), XR(s, o), JR(f, o), wa(e, t, f, a);
      var v = il.current, h = Dg(v, Tp);
      if (h)
        v = Ng(v, Tp), t.flags |= et;
      else {
        var S = e !== null && (e.flags & et) !== rt;
        S && GR(t, t.child, a), v = Mf(v);
      }
      if (Fu(t, v), (t.mode & Lt) === at)
        t.memoizedState = null;
      else
        switch (o) {
          case "forwards": {
            var x = KR(t.child), O;
            x === null ? (O = t.child, t.child = null) : (O = x.sibling, x.sibling = null), jS(
              t,
              !1,
              // isBackwards
              O,
              x,
              s
            );
            break;
          }
          case "backwards": {
            var N = null, $ = t.child;
            for (t.child = null; $ !== null; ) {
              var W = $.alternate;
              if (W !== null && fm(W) === null) {
                t.child = $;
                break;
              }
              var J = $.sibling;
              $.sibling = N, N = $, $ = J;
            }
            jS(
              t,
              !0,
              // isBackwards
              N,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            jS(
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
    function ZR(e, t, a) {
      Rg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Nf(t, null, i, a) : wa(e, t, i, a), t.child;
    }
    var Ax = !1;
    function e_(e, t, a) {
      var i = t.type, o = i._context, s = t.pendingProps, f = t.memoizedProps, v = s.value;
      {
        "value" in s || Ax || (Ax = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var h = t.type.propTypes;
        h && nl(h, s, "prop", "Context.Provider");
      }
      if (_C(t, o, v), f !== null) {
        var S = f.value;
        if (ye(S, v)) {
          if (f.children === s.children && !Bh())
            return $o(e, t, a);
        } else
          qT(t, o, a);
      }
      var x = s.children;
      return wa(e, t, x, a), t.child;
    }
    var zx = !1;
    function t_(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (zx || (zx = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var o = t.pendingProps, s = o.children;
      typeof s != "function" && g("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Of(t, a);
      var f = sr(i);
      Ea(t);
      var v;
      return Mp.current = t, Zn(!0), v = s(f), Zn(!1), Ca(), t.flags |= ii, wa(e, t, v, a), t.child;
    }
    function Up() {
      ul = !0;
    }
    function Mm(e, t) {
      (t.mode & Lt) === at && e !== null && (e.alternate = null, t.alternate = null, t.flags |= wn);
    }
    function $o(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), fx(), Kp(t.lanes), la(a, t.childLanes) ? (GT(e, t), t.child) : null;
    }
    function n_(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var o = i.child;
          if (o === null)
            throw new Error("Expected parent to have a child.");
          for (; o.sibling !== t; )
            if (o = o.sibling, o === null)
              throw new Error("Expected to find the previous sibling.");
          o.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [e], i.flags |= Ma) : s.push(e), a.flags |= wn, a;
      }
    }
    function OS(e, t) {
      var a = e.lanes;
      return !!la(a, t);
    }
    function r_(e, t, a) {
      switch (t.tag) {
        case P:
          kx(t), t.stateNode, Df();
          break;
        case te:
          AC(t);
          break;
        case z: {
          var i = t.type;
          Yl(i) && $h(t);
          break;
        }
        case G:
          Rg(t, t.stateNode.containerInfo);
          break;
        case oe: {
          var o = t.memoizedProps.value, s = t.type._context;
          _C(t, s, o);
          break;
        }
        case Se:
          {
            var f = la(a, t.childLanes);
            f && (t.flags |= Bt);
            {
              var v = t.stateNode;
              v.effectDuration = 0, v.passiveEffectDuration = 0;
            }
          }
          break;
        case le: {
          var h = t.memoizedState;
          if (h !== null) {
            if (h.dehydrated !== null)
              return Fu(t, Mf(il.current)), t.flags |= et, null;
            var S = t.child, x = S.childLanes;
            if (la(a, x))
              return Nx(e, t, a);
            Fu(t, Mf(il.current));
            var O = $o(e, t, a);
            return O !== null ? O.sibling : null;
          } else
            Fu(t, Mf(il.current));
          break;
        }
        case je: {
          var N = (e.flags & et) !== rt, $ = la(a, t.childLanes);
          if (N) {
            if ($)
              return Mx(e, t, a);
            t.flags |= et;
          }
          var W = t.memoizedState;
          if (W !== null && (W.rendering = null, W.tail = null, W.lastEffect = null), Fu(t, il.current), $)
            break;
          return null;
        }
        case re:
        case Fe:
          return t.lanes = de, Tx(e, t, a);
      }
      return $o(e, t, a);
    }
    function Ux(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return n_(e, t, uE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, o = t.pendingProps;
        if (i !== o || Bh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ul = !0;
        else {
          var s = OS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & et) === rt)
            return ul = !1, r_(e, t, a);
          (e.flags & _c) !== rt ? ul = !0 : ul = !1;
        }
      } else if (ul = !1, $r() && kT(t)) {
        var f = t.index, v = DT();
        fC(t, v, f);
      }
      switch (t.lanes = de, t.tag) {
        case ge:
          return FR(e, t, t.type, a);
        case pe: {
          var h = t.elementType;
          return zR(e, t, h, a);
        }
        case L: {
          var S = t.type, x = t.pendingProps, O = t.elementType === S ? x : ol(S, x);
          return wS(e, t, S, O, a);
        }
        case z: {
          var N = t.type, $ = t.pendingProps, W = t.elementType === N ? $ : ol(N, $);
          return _x(e, t, N, W, a);
        }
        case P:
          return LR(e, t, a);
        case te:
          return MR(e, t, a);
        case ne:
          return AR(e, t);
        case le:
          return Nx(e, t, a);
        case G:
          return ZR(e, t, a);
        case Ee: {
          var J = t.type, Ue = t.pendingProps, lt = t.elementType === J ? Ue : ol(J, Ue);
          return xx(e, t, J, lt, a);
        }
        case X:
          return NR(e, t, a);
        case fe:
          return jR(e, t, a);
        case Se:
          return OR(e, t, a);
        case oe:
          return e_(e, t, a);
        case Le:
          return t_(e, t, a);
        case se: {
          var Ze = t.type, Yt = t.pendingProps, Ft = ol(Ze, Yt);
          if (t.type !== t.elementType) {
            var H = Ze.propTypes;
            H && nl(
              H,
              Ft,
              // Resolved for outer only
              "prop",
              Qt(Ze)
            );
          }
          return Ft = ol(Ze.type, Ft), bx(e, t, Ze, Ft, a);
        }
        case U:
          return wx(e, t, t.type, t.pendingProps, a);
        case ue: {
          var Z = t.type, V = t.pendingProps, xe = t.elementType === Z ? V : ol(Z, V);
          return UR(e, t, Z, xe, a);
        }
        case je:
          return Mx(e, t, a);
        case Je:
          break;
        case re:
          return Tx(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Hf(e) {
      e.flags |= Bt;
    }
    function Fx(e) {
      e.flags |= jn, e.flags |= yu;
    }
    var Px, LS, Hx, Vx;
    Px = function(e, t, a, i) {
      for (var o = t.child; o !== null; ) {
        if (o.tag === te || o.tag === ne)
          T0(e, o.stateNode);
        else if (o.tag !== G) {
          if (o.child !== null) {
            o.child.return = o, o = o.child;
            continue;
          }
        }
        if (o === t)
          return;
        for (; o.sibling === null; ) {
          if (o.return === null || o.return === t)
            return;
          o = o.return;
        }
        o.sibling.return = o.return, o = o.sibling;
      }
    }, LS = function(e, t) {
    }, Hx = function(e, t, a, i, o) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, v = _g(), h = _0(f, a, s, i, o, v);
        t.updateQueue = h, h && Hf(t);
      }
    }, Vx = function(e, t, a, i) {
      a !== i && Hf(t);
    };
    function Fp(e, t) {
      if (!$r())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var o = e.tail, s = null; o !== null; )
              o.alternate !== null && (s = o), o = o.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function Qr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = de, i = rt;
      if (t) {
        if ((e.mode & Xt) !== at) {
          for (var h = e.selfBaseDuration, S = e.child; S !== null; )
            a = Rt(a, Rt(S.lanes, S.childLanes)), i |= S.subtreeFlags & $n, i |= S.flags & $n, h += S.treeBaseDuration, S = S.sibling;
          e.treeBaseDuration = h;
        } else
          for (var x = e.child; x !== null; )
            a = Rt(a, Rt(x.lanes, x.childLanes)), i |= x.subtreeFlags & $n, i |= x.flags & $n, x.return = e, x = x.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Xt) !== at) {
          for (var o = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = Rt(a, Rt(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, o += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = o, e.treeBaseDuration = s;
        } else
          for (var v = e.child; v !== null; )
            a = Rt(a, Rt(v.lanes, v.childLanes)), i |= v.subtreeFlags, i |= v.flags, v.return = e, v = v.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function a_(e, t, a) {
      if (BT() && (t.mode & Lt) !== at && (t.flags & et) === rt)
        return gC(t), Df(), t.flags |= kr | cs | ir, !1;
      var i = Kh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (HT(t), Qr(t), (t.mode & Xt) !== at) {
            var o = a !== null;
            if (o) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (Df(), (t.flags & et) === rt && (t.memoizedState = null), t.flags |= Bt, Qr(t), (t.mode & Xt) !== at) {
            var f = a !== null;
            if (f) {
              var v = t.child;
              v !== null && (t.treeBaseDuration -= v.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return SC(), !0;
    }
    function Bx(e, t, a) {
      var i = t.pendingProps;
      switch (ig(t), t.tag) {
        case ge:
        case pe:
        case U:
        case L:
        case Ee:
        case X:
        case fe:
        case Se:
        case Le:
        case se:
          return Qr(t), null;
        case z: {
          var o = t.type;
          return Yl(o) && Ih(t), Qr(t), null;
        }
        case P: {
          var s = t.stateNode;
          if (Lf(t), tg(t), Og(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Kh(t);
            if (f)
              Hf(t);
            else if (e !== null) {
              var v = e.memoizedState;
              // Check if this is a client root
              (!v.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & kr) !== rt) && (t.flags |= er, SC());
            }
          }
          return LS(e, t), Qr(t), null;
        }
        case te: {
          kg(t);
          var h = MC(), S = t.type;
          if (e !== null && t.stateNode != null)
            Hx(e, t, S, i, h), e.ref !== t.ref && Fx(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Qr(t), null;
            }
            var x = _g(), O = Kh(t);
            if (O)
              FT(t, h, x) && Hf(t);
            else {
              var N = w0(S, i, h, x, t);
              Px(N, t, !1, !1), t.stateNode = N, R0(N, S, i, h) && Hf(t);
            }
            t.ref !== null && Fx(t);
          }
          return Qr(t), null;
        }
        case ne: {
          var $ = i;
          if (e && t.stateNode != null) {
            var W = e.memoizedProps;
            Vx(e, t, W, $);
          } else {
            if (typeof $ != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var J = MC(), Ue = _g(), lt = Kh(t);
            lt ? PT(t) && Hf(t) : t.stateNode = k0($, J, Ue, t);
          }
          return Qr(t), null;
        }
        case le: {
          Af(t);
          var Ze = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Yt = a_(e, t, Ze);
            if (!Yt)
              return t.flags & ir ? t : null;
          }
          if ((t.flags & et) !== rt)
            return t.lanes = a, (t.mode & Xt) !== at && rS(t), t;
          var Ft = Ze !== null, H = e !== null && e.memoizedState !== null;
          if (Ft !== H && Ft) {
            var Z = t.child;
            if (Z.flags |= In, (t.mode & Lt) !== at) {
              var V = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              V || Dg(il.current, UC) ? ik() : XS();
            }
          }
          var xe = t.updateQueue;
          if (xe !== null && (t.flags |= Bt), Qr(t), (t.mode & Xt) !== at && Ft) {
            var Ie = t.child;
            Ie !== null && (t.treeBaseDuration -= Ie.treeBaseDuration);
          }
          return null;
        }
        case G:
          return Lf(t), LS(e, t), e === null && CT(t.stateNode.containerInfo), Qr(t), null;
        case oe:
          var Pe = t.type._context;
          return Sg(Pe, t), Qr(t), null;
        case ue: {
          var ft = t.type;
          return Yl(ft) && Ih(t), Qr(t), null;
        }
        case je: {
          Af(t);
          var Ct = t.memoizedState;
          if (Ct === null)
            return Qr(t), null;
          var cn = (t.flags & et) !== rt, en = Ct.rendering;
          if (en === null)
            if (cn)
              Fp(Ct, !1);
            else {
              var rr = ok() && (e === null || (e.flags & et) === rt);
              if (!rr)
                for (var tn = t.child; tn !== null; ) {
                  var qn = fm(tn);
                  if (qn !== null) {
                    cn = !0, t.flags |= et, Fp(Ct, !1);
                    var pa = qn.updateQueue;
                    return pa !== null && (t.updateQueue = pa, t.flags |= Bt), t.subtreeFlags = rt, KT(t, a), Fu(t, Ng(il.current, Tp)), t.child;
                  }
                  tn = tn.sibling;
                }
              Ct.tail !== null && tr() > sb() && (t.flags |= et, cn = !0, Fp(Ct, !1), t.lanes = Nd);
            }
          else {
            if (!cn) {
              var Xr = fm(en);
              if (Xr !== null) {
                t.flags |= et, cn = !0;
                var di = Xr.updateQueue;
                if (di !== null && (t.updateQueue = di, t.flags |= Bt), Fp(Ct, !0), Ct.tail === null && Ct.tailMode === "hidden" && !en.alternate && !$r())
                  return Qr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              tr() * 2 - Ct.renderingStartTime > sb() && a !== ia && (t.flags |= et, cn = !0, Fp(Ct, !1), t.lanes = Nd);
            }
            if (Ct.isBackwards)
              en.sibling = t.child, t.child = en;
            else {
              var _a = Ct.last;
              _a !== null ? _a.sibling = en : t.child = en, Ct.last = en;
            }
          }
          if (Ct.tail !== null) {
            var ka = Ct.tail;
            Ct.rendering = ka, Ct.tail = ka.sibling, Ct.renderingStartTime = tr(), ka.sibling = null;
            var va = il.current;
            return cn ? va = Ng(va, Tp) : va = Mf(va), Fu(t, va), ka;
          }
          return Qr(t), null;
        }
        case Je:
          break;
        case re:
        case Fe: {
          qS(t);
          var Ko = t.memoizedState, Gf = Ko !== null;
          if (e !== null) {
            var ev = e.memoizedState, Zl = ev !== null;
            Zl !== Gf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !Re && (t.flags |= In);
          }
          return !Gf || (t.mode & Lt) === at ? Qr(t) : la(Jl, ia) && (Qr(t), t.subtreeFlags & (wn | Bt) && (t.flags |= In)), null;
        }
        case nt:
          return null;
        case pt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function i_(e, t, a) {
      switch (ig(t), t.tag) {
        case z: {
          var i = t.type;
          Yl(i) && Ih(t);
          var o = t.flags;
          return o & ir ? (t.flags = o & ~ir | et, (t.mode & Xt) !== at && rS(t), t) : null;
        }
        case P: {
          t.stateNode, Lf(t), tg(t), Og();
          var s = t.flags;
          return (s & ir) !== rt && (s & et) === rt ? (t.flags = s & ~ir | et, t) : null;
        }
        case te:
          return kg(t), null;
        case le: {
          Af(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            Df();
          }
          var v = t.flags;
          return v & ir ? (t.flags = v & ~ir | et, (t.mode & Xt) !== at && rS(t), t) : null;
        }
        case je:
          return Af(t), null;
        case G:
          return Lf(t), null;
        case oe:
          var h = t.type._context;
          return Sg(h, t), null;
        case re:
        case Fe:
          return qS(t), null;
        case nt:
          return null;
        default:
          return null;
      }
    }
    function Ix(e, t, a) {
      switch (ig(t), t.tag) {
        case z: {
          var i = t.type.childContextTypes;
          i != null && Ih(t);
          break;
        }
        case P: {
          t.stateNode, Lf(t), tg(t), Og();
          break;
        }
        case te: {
          kg(t);
          break;
        }
        case G:
          Lf(t);
          break;
        case le:
          Af(t);
          break;
        case je:
          Af(t);
          break;
        case oe:
          var o = t.type._context;
          Sg(o, t);
          break;
        case re:
        case Fe:
          qS(t);
          break;
      }
    }
    var $x = null;
    $x = /* @__PURE__ */ new Set();
    var Am = !1, Wr = !1, l_ = typeof WeakSet == "function" ? WeakSet : Set, Ke = null, Vf = null, Bf = null;
    function o_(e) {
      _l(null, function() {
        throw e;
      }), ss();
    }
    var u_ = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Xt)
        try {
          ql(), t.componentWillUnmount();
        } finally {
          Kl(e);
        }
      else
        t.componentWillUnmount();
    };
    function Yx(e, t) {
      try {
        Vu(Er, e);
      } catch (a) {
        gn(e, t, a);
      }
    }
    function MS(e, t, a) {
      try {
        u_(e, a);
      } catch (i) {
        gn(e, t, i);
      }
    }
    function s_(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        gn(e, t, i);
      }
    }
    function Qx(e, t) {
      try {
        Gx(e);
      } catch (a) {
        gn(e, t, a);
      }
    }
    function If(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if ($e && St && e.mode & Xt)
              try {
                ql(), i = a(null);
              } finally {
                Kl(e);
              }
            else
              i = a(null);
          } catch (o) {
            gn(e, t, o);
          }
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", ht(e));
        } else
          a.current = null;
    }
    function zm(e, t, a) {
      try {
        a();
      } catch (i) {
        gn(e, t, i);
      }
    }
    var Wx = !1;
    function c_(e, t) {
      x0(e.containerInfo), Ke = t, f_();
      var a = Wx;
      return Wx = !1, a;
    }
    function f_() {
      for (; Ke !== null; ) {
        var e = Ke, t = e.child;
        (e.subtreeFlags & Dl) !== rt && t !== null ? (t.return = e, Ke = t) : d_();
      }
    }
    function d_() {
      for (; Ke !== null; ) {
        var e = Ke;
        an(e);
        try {
          p_(e);
        } catch (a) {
          gn(e, e.return, a);
        }
        yn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ke = t;
          return;
        }
        Ke = e.return;
      }
    }
    function p_(e) {
      var t = e.alternate, a = e.flags;
      if ((a & er) !== rt) {
        switch (an(e), e.tag) {
          case L:
          case Ee:
          case U:
            break;
          case z: {
            if (t !== null) {
              var i = t.memoizedProps, o = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !nc && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", ht(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", ht(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ol(e.type, i), o);
              {
                var v = $x;
                f === void 0 && !v.has(e.type) && (v.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", ht(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case P: {
            {
              var h = e.stateNode;
              W0(h.containerInfo);
            }
            break;
          }
          case te:
          case ne:
          case G:
          case ue:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        yn();
      }
    }
    function sl(e, t, a) {
      var i = t.updateQueue, o = i !== null ? i.lastEffect : null;
      if (o !== null) {
        var s = o.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var v = f.destroy;
            f.destroy = void 0, v !== void 0 && ((e & Yr) !== Ya ? qi(t) : (e & Er) !== Ya && ds(t), (e & Ql) !== Ya && Xp(!0), zm(t, a, v), (e & Ql) !== Ya && Xp(!1), (e & Yr) !== Ya ? Ll() : (e & Er) !== Ya && kd());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Vu(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var o = i.next, s = o;
        do {
          if ((s.tag & e) === e) {
            (e & Yr) !== Ya ? _d(t) : (e & Er) !== Ya && Lc(t);
            var f = s.create;
            (e & Ql) !== Ya && Xp(!0), s.destroy = f(), (e & Ql) !== Ya && Xp(!1), (e & Yr) !== Ya ? Vv() : (e & Er) !== Ya && Bv();
            {
              var v = s.destroy;
              if (v !== void 0 && typeof v != "function") {
                var h = void 0;
                (s.tag & Er) !== rt ? h = "useLayoutEffect" : (s.tag & Ql) !== rt ? h = "useInsertionEffect" : h = "useEffect";
                var S = void 0;
                v === null ? S = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof v.then == "function" ? S = `

It looks like you wrote ` + h + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + h + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : S = " You returned: " + v, g("%s must not return anything besides a function, which is used for clean-up.%s", h, S);
              }
            }
          }
          s = s.next;
        } while (s !== o);
      }
    }
    function v_(e, t) {
      if ((t.flags & Bt) !== rt)
        switch (t.tag) {
          case Se: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, o = i.id, s = i.onPostCommit, f = sx(), v = t.alternate === null ? "mount" : "update";
            ux() && (v = "nested-update"), typeof s == "function" && s(o, v, a, f);
            var h = t.return;
            e: for (; h !== null; ) {
              switch (h.tag) {
                case P:
                  var S = h.stateNode;
                  S.passiveEffectDuration += a;
                  break e;
                case Se:
                  var x = h.stateNode;
                  x.passiveEffectDuration += a;
                  break e;
              }
              h = h.return;
            }
            break;
          }
        }
    }
    function h_(e, t, a, i) {
      if ((a.flags & jl) !== rt)
        switch (a.tag) {
          case L:
          case Ee:
          case U: {
            if (!Wr)
              if (a.mode & Xt)
                try {
                  ql(), Vu(Er | Sr, a);
                } finally {
                  Kl(a);
                }
              else
                Vu(Er | Sr, a);
            break;
          }
          case z: {
            var o = a.stateNode;
            if (a.flags & Bt && !Wr)
              if (t === null)
                if (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", ht(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", ht(a) || "instance")), a.mode & Xt)
                  try {
                    ql(), o.componentDidMount();
                  } finally {
                    Kl(a);
                  }
                else
                  o.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ol(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", ht(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", ht(a) || "instance")), a.mode & Xt)
                  try {
                    ql(), o.componentDidUpdate(s, f, o.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Kl(a);
                  }
                else
                  o.componentDidUpdate(s, f, o.__reactInternalSnapshotBeforeUpdate);
              }
            var v = a.updateQueue;
            v !== null && (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", ht(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", ht(a) || "instance")), LC(a, v, o));
            break;
          }
          case P: {
            var h = a.updateQueue;
            if (h !== null) {
              var S = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case te:
                    S = a.child.stateNode;
                    break;
                  case z:
                    S = a.child.stateNode;
                    break;
                }
              LC(a, h, S);
            }
            break;
          }
          case te: {
            var x = a.stateNode;
            if (t === null && a.flags & Bt) {
              var O = a.type, N = a.memoizedProps;
              L0(x, O, N);
            }
            break;
          }
          case ne:
            break;
          case G:
            break;
          case Se: {
            {
              var $ = a.memoizedProps, W = $.onCommit, J = $.onRender, Ue = a.stateNode.effectDuration, lt = sx(), Ze = t === null ? "mount" : "update";
              ux() && (Ze = "nested-update"), typeof J == "function" && J(a.memoizedProps.id, Ze, a.actualDuration, a.treeBaseDuration, a.actualStartTime, lt);
              {
                typeof W == "function" && W(a.memoizedProps.id, Ze, Ue, lt), dk(a);
                var Yt = a.return;
                e: for (; Yt !== null; ) {
                  switch (Yt.tag) {
                    case P:
                      var Ft = Yt.stateNode;
                      Ft.effectDuration += Ue;
                      break e;
                    case Se:
                      var H = Yt.stateNode;
                      H.effectDuration += Ue;
                      break e;
                  }
                  Yt = Yt.return;
                }
              }
            }
            break;
          }
          case le: {
            b_(e, a);
            break;
          }
          case je:
          case ue:
          case Je:
          case re:
          case Fe:
          case pt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Wr || a.flags & jn && Gx(a);
    }
    function m_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case U: {
          if (e.mode & Xt)
            try {
              ql(), Yx(e, e.return);
            } finally {
              Kl(e);
            }
          else
            Yx(e, e.return);
          break;
        }
        case z: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && s_(e, e.return, t), Qx(e, e.return);
          break;
        }
        case te: {
          Qx(e, e.return);
          break;
        }
      }
    }
    function y_(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === te) {
          if (a === null) {
            a = i;
            try {
              var o = i.stateNode;
              t ? I0(o) : Y0(i.stateNode, i.memoizedProps);
            } catch (f) {
              gn(e, e.return, f);
            }
          }
        } else if (i.tag === ne) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? $0(s) : Q0(s, i.memoizedProps);
            } catch (f) {
              gn(e, e.return, f);
            }
        } else if (!((i.tag === re || i.tag === Fe) && i.memoizedState !== null && i !== e)) {
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
    function Gx(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case te:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var o;
          if (e.mode & Xt)
            try {
              ql(), o = t(i);
            } finally {
              Kl(e);
            }
          else
            o = t(i);
          typeof o == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", ht(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", ht(e)), t.current = i;
      }
    }
    function g_(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function Kx(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, Kx(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === te) {
          var a = e.stateNode;
          a !== null && wT(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function S_(e) {
      for (var t = e.return; t !== null; ) {
        if (qx(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function qx(e) {
      return e.tag === te || e.tag === P || e.tag === G;
    }
    function Xx(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || qx(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== te && t.tag !== ne && t.tag !== be; ) {
          if (t.flags & wn || t.child === null || t.tag === G)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & wn))
          return t.stateNode;
      }
    }
    function E_(e) {
      var t = S_(e);
      switch (t.tag) {
        case te: {
          var a = t.stateNode;
          t.flags & Aa && (ZE(a), t.flags &= ~Aa);
          var i = Xx(e);
          zS(e, i, a);
          break;
        }
        case P:
        case G: {
          var o = t.stateNode.containerInfo, s = Xx(e);
          AS(e, s, o);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function AS(e, t, a) {
      var i = e.tag, o = i === te || i === ne;
      if (o) {
        var s = e.stateNode;
        t ? P0(a, s, t) : U0(a, s);
      } else if (i !== G) {
        var f = e.child;
        if (f !== null) {
          AS(f, t, a);
          for (var v = f.sibling; v !== null; )
            AS(v, t, a), v = v.sibling;
        }
      }
    }
    function zS(e, t, a) {
      var i = e.tag, o = i === te || i === ne;
      if (o) {
        var s = e.stateNode;
        t ? F0(a, s, t) : z0(a, s);
      } else if (i !== G) {
        var f = e.child;
        if (f !== null) {
          zS(f, t, a);
          for (var v = f.sibling; v !== null; )
            zS(v, t, a), v = v.sibling;
        }
      }
    }
    var Gr = null, cl = !1;
    function C_(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case te: {
              Gr = i.stateNode, cl = !1;
              break e;
            }
            case P: {
              Gr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case G: {
              Gr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Gr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        Jx(e, t, a), Gr = null, cl = !1;
      }
      g_(a);
    }
    function Bu(e, t, a) {
      for (var i = a.child; i !== null; )
        Jx(e, t, i), i = i.sibling;
    }
    function Jx(e, t, a) {
      switch (wd(a), a.tag) {
        case te:
          Wr || If(a, t);
        case ne: {
          {
            var i = Gr, o = cl;
            Gr = null, Bu(e, t, a), Gr = i, cl = o, Gr !== null && (cl ? V0(Gr, a.stateNode) : H0(Gr, a.stateNode));
          }
          return;
        }
        case be: {
          Gr !== null && (cl ? B0(Gr, a.stateNode) : Wy(Gr, a.stateNode));
          return;
        }
        case G: {
          {
            var s = Gr, f = cl;
            Gr = a.stateNode.containerInfo, cl = !0, Bu(e, t, a), Gr = s, cl = f;
          }
          return;
        }
        case L:
        case Ee:
        case se:
        case U: {
          if (!Wr) {
            var v = a.updateQueue;
            if (v !== null) {
              var h = v.lastEffect;
              if (h !== null) {
                var S = h.next, x = S;
                do {
                  var O = x, N = O.destroy, $ = O.tag;
                  N !== void 0 && (($ & Ql) !== Ya ? zm(a, t, N) : ($ & Er) !== Ya && (ds(a), a.mode & Xt ? (ql(), zm(a, t, N), Kl(a)) : zm(a, t, N), kd())), x = x.next;
                } while (x !== S);
              }
            }
          }
          Bu(e, t, a);
          return;
        }
        case z: {
          if (!Wr) {
            If(a, t);
            var W = a.stateNode;
            typeof W.componentWillUnmount == "function" && MS(a, t, W);
          }
          Bu(e, t, a);
          return;
        }
        case Je: {
          Bu(e, t, a);
          return;
        }
        case re: {
          if (
            // TODO: Remove this dead flag
            a.mode & Lt
          ) {
            var J = Wr;
            Wr = J || a.memoizedState !== null, Bu(e, t, a), Wr = J;
          } else
            Bu(e, t, a);
          break;
        }
        default: {
          Bu(e, t, a);
          return;
        }
      }
    }
    function x_(e) {
      e.memoizedState;
    }
    function b_(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var o = i.memoizedState;
          if (o !== null) {
            var s = o.dehydrated;
            s !== null && oT(s);
          }
        }
      }
    }
    function Zx(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new l_()), t.forEach(function(i) {
          var o = Sk.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), aa)
              if (Vf !== null && Bf !== null)
                qp(Bf, Vf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(o, o);
          }
        });
      }
    }
    function w_(e, t, a) {
      Vf = a, Bf = e, an(t), eb(t, e), an(t), Vf = null, Bf = null;
    }
    function fl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o];
          try {
            C_(e, t, s);
          } catch (h) {
            gn(s, t, h);
          }
        }
      var f = El();
      if (t.subtreeFlags & Nl)
        for (var v = t.child; v !== null; )
          an(v), eb(v, e), v = v.sibling;
      an(f);
    }
    function eb(e, t, a) {
      var i = e.alternate, o = e.flags;
      switch (e.tag) {
        case L:
        case Ee:
        case se:
        case U: {
          if (fl(t, e), Xl(e), o & Bt) {
            try {
              sl(Ql | Sr, e, e.return), Vu(Ql | Sr, e);
            } catch (ft) {
              gn(e, e.return, ft);
            }
            if (e.mode & Xt) {
              try {
                ql(), sl(Er | Sr, e, e.return);
              } catch (ft) {
                gn(e, e.return, ft);
              }
              Kl(e);
            } else
              try {
                sl(Er | Sr, e, e.return);
              } catch (ft) {
                gn(e, e.return, ft);
              }
          }
          return;
        }
        case z: {
          fl(t, e), Xl(e), o & jn && i !== null && If(i, i.return);
          return;
        }
        case te: {
          fl(t, e), Xl(e), o & jn && i !== null && If(i, i.return);
          {
            if (e.flags & Aa) {
              var s = e.stateNode;
              try {
                ZE(s);
              } catch (ft) {
                gn(e, e.return, ft);
              }
            }
            if (o & Bt) {
              var f = e.stateNode;
              if (f != null) {
                var v = e.memoizedProps, h = i !== null ? i.memoizedProps : v, S = e.type, x = e.updateQueue;
                if (e.updateQueue = null, x !== null)
                  try {
                    M0(f, x, S, h, v, e);
                  } catch (ft) {
                    gn(e, e.return, ft);
                  }
              }
            }
          }
          return;
        }
        case ne: {
          if (fl(t, e), Xl(e), o & Bt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var O = e.stateNode, N = e.memoizedProps, $ = i !== null ? i.memoizedProps : N;
            try {
              A0(O, $, N);
            } catch (ft) {
              gn(e, e.return, ft);
            }
          }
          return;
        }
        case P: {
          if (fl(t, e), Xl(e), o & Bt && i !== null) {
            var W = i.memoizedState;
            if (W.isDehydrated)
              try {
                lT(t.containerInfo);
              } catch (ft) {
                gn(e, e.return, ft);
              }
          }
          return;
        }
        case G: {
          fl(t, e), Xl(e);
          return;
        }
        case le: {
          fl(t, e), Xl(e);
          var J = e.child;
          if (J.flags & In) {
            var Ue = J.stateNode, lt = J.memoizedState, Ze = lt !== null;
            if (Ue.isHidden = Ze, Ze) {
              var Yt = J.alternate !== null && J.alternate.memoizedState !== null;
              Yt || ak();
            }
          }
          if (o & Bt) {
            try {
              x_(e);
            } catch (ft) {
              gn(e, e.return, ft);
            }
            Zx(e);
          }
          return;
        }
        case re: {
          var Ft = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Lt
          ) {
            var H = Wr;
            Wr = H || Ft, fl(t, e), Wr = H;
          } else
            fl(t, e);
          if (Xl(e), o & In) {
            var Z = e.stateNode, V = e.memoizedState, xe = V !== null, Ie = e;
            if (Z.isHidden = xe, xe && !Ft && (Ie.mode & Lt) !== at) {
              Ke = Ie;
              for (var Pe = Ie.child; Pe !== null; )
                Ke = Pe, R_(Pe), Pe = Pe.sibling;
            }
            y_(Ie, xe);
          }
          return;
        }
        case je: {
          fl(t, e), Xl(e), o & Bt && Zx(e);
          return;
        }
        case Je:
          return;
        default: {
          fl(t, e), Xl(e);
          return;
        }
      }
    }
    function Xl(e) {
      var t = e.flags;
      if (t & wn) {
        try {
          E_(e);
        } catch (a) {
          gn(e, e.return, a);
        }
        e.flags &= ~wn;
      }
      t & ta && (e.flags &= ~ta);
    }
    function T_(e, t, a) {
      Vf = a, Bf = t, Ke = e, tb(e, t, a), Vf = null, Bf = null;
    }
    function tb(e, t, a) {
      for (var i = (e.mode & Lt) !== at; Ke !== null; ) {
        var o = Ke, s = o.child;
        if (o.tag === re && i) {
          var f = o.memoizedState !== null, v = f || Am;
          if (v) {
            US(e, t, a);
            continue;
          } else {
            var h = o.alternate, S = h !== null && h.memoizedState !== null, x = S || Wr, O = Am, N = Wr;
            Am = v, Wr = x, Wr && !N && (Ke = o, __(o));
            for (var $ = s; $ !== null; )
              Ke = $, tb(
                $,
                // New root; bubble back up to here and stop.
                t,
                a
              ), $ = $.sibling;
            Ke = o, Am = O, Wr = N, US(e, t, a);
            continue;
          }
        }
        (o.subtreeFlags & jl) !== rt && s !== null ? (s.return = o, Ke = s) : US(e, t, a);
      }
    }
    function US(e, t, a) {
      for (; Ke !== null; ) {
        var i = Ke;
        if ((i.flags & jl) !== rt) {
          var o = i.alternate;
          an(i);
          try {
            h_(t, o, i, a);
          } catch (f) {
            gn(i, i.return, f);
          }
          yn();
        }
        if (i === e) {
          Ke = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, Ke = s;
          return;
        }
        Ke = i.return;
      }
    }
    function R_(e) {
      for (; Ke !== null; ) {
        var t = Ke, a = t.child;
        switch (t.tag) {
          case L:
          case Ee:
          case se:
          case U: {
            if (t.mode & Xt)
              try {
                ql(), sl(Er, t, t.return);
              } finally {
                Kl(t);
              }
            else
              sl(Er, t, t.return);
            break;
          }
          case z: {
            If(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && MS(t, t.return, i);
            break;
          }
          case te: {
            If(t, t.return);
            break;
          }
          case re: {
            var o = t.memoizedState !== null;
            if (o) {
              nb(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Ke = a) : nb(e);
      }
    }
    function nb(e) {
      for (; Ke !== null; ) {
        var t = Ke;
        if (t === e) {
          Ke = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ke = a;
          return;
        }
        Ke = t.return;
      }
    }
    function __(e) {
      for (; Ke !== null; ) {
        var t = Ke, a = t.child;
        if (t.tag === re) {
          var i = t.memoizedState !== null;
          if (i) {
            rb(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Ke = a) : rb(e);
      }
    }
    function rb(e) {
      for (; Ke !== null; ) {
        var t = Ke;
        an(t);
        try {
          m_(t);
        } catch (i) {
          gn(t, t.return, i);
        }
        if (yn(), t === e) {
          Ke = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ke = a;
          return;
        }
        Ke = t.return;
      }
    }
    function k_(e, t, a, i) {
      Ke = t, D_(t, e, a, i);
    }
    function D_(e, t, a, i) {
      for (; Ke !== null; ) {
        var o = Ke, s = o.child;
        (o.subtreeFlags & Gi) !== rt && s !== null ? (s.return = o, Ke = s) : N_(e, t, a, i);
      }
    }
    function N_(e, t, a, i) {
      for (; Ke !== null; ) {
        var o = Ke;
        if ((o.flags & ea) !== rt) {
          an(o);
          try {
            j_(t, o, a, i);
          } catch (f) {
            gn(o, o.return, f);
          }
          yn();
        }
        if (o === e) {
          Ke = null;
          return;
        }
        var s = o.sibling;
        if (s !== null) {
          s.return = o.return, Ke = s;
          return;
        }
        Ke = o.return;
      }
    }
    function j_(e, t, a, i) {
      switch (t.tag) {
        case L:
        case Ee:
        case U: {
          if (t.mode & Xt) {
            nS();
            try {
              Vu(Yr | Sr, t);
            } finally {
              tS(t);
            }
          } else
            Vu(Yr | Sr, t);
          break;
        }
      }
    }
    function O_(e) {
      Ke = e, L_();
    }
    function L_() {
      for (; Ke !== null; ) {
        var e = Ke, t = e.child;
        if ((Ke.flags & Ma) !== rt) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var o = a[i];
              Ke = o, z_(o, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var f = s.child;
                if (f !== null) {
                  s.child = null;
                  do {
                    var v = f.sibling;
                    f.sibling = null, f = v;
                  } while (f !== null);
                }
              }
            }
            Ke = e;
          }
        }
        (e.subtreeFlags & Gi) !== rt && t !== null ? (t.return = e, Ke = t) : M_();
      }
    }
    function M_() {
      for (; Ke !== null; ) {
        var e = Ke;
        (e.flags & ea) !== rt && (an(e), A_(e), yn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ke = t;
          return;
        }
        Ke = e.return;
      }
    }
    function A_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case U: {
          e.mode & Xt ? (nS(), sl(Yr | Sr, e, e.return), tS(e)) : sl(Yr | Sr, e, e.return);
          break;
        }
      }
    }
    function z_(e, t) {
      for (; Ke !== null; ) {
        var a = Ke;
        an(a), F_(a, t), yn();
        var i = a.child;
        i !== null ? (i.return = a, Ke = i) : U_(e);
      }
    }
    function U_(e) {
      for (; Ke !== null; ) {
        var t = Ke, a = t.sibling, i = t.return;
        if (Kx(t), t === e) {
          Ke = null;
          return;
        }
        if (a !== null) {
          a.return = i, Ke = a;
          return;
        }
        Ke = i;
      }
    }
    function F_(e, t) {
      switch (e.tag) {
        case L:
        case Ee:
        case U: {
          e.mode & Xt ? (nS(), sl(Yr, e, t), tS(e)) : sl(Yr, e, t);
          break;
        }
      }
    }
    function P_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case U: {
          try {
            Vu(Er | Sr, e);
          } catch (a) {
            gn(e, e.return, a);
          }
          break;
        }
        case z: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            gn(e, e.return, a);
          }
          break;
        }
      }
    }
    function H_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case U: {
          try {
            Vu(Yr | Sr, e);
          } catch (t) {
            gn(e, e.return, t);
          }
          break;
        }
      }
    }
    function V_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case U: {
          try {
            sl(Er | Sr, e, e.return);
          } catch (a) {
            gn(e, e.return, a);
          }
          break;
        }
        case z: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && MS(e, e.return, t);
          break;
        }
      }
    }
    function B_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case U:
          try {
            sl(Yr | Sr, e, e.return);
          } catch (t) {
            gn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Pp = Symbol.for;
      Pp("selector.component"), Pp("selector.has_pseudo_class"), Pp("selector.role"), Pp("selector.test_id"), Pp("selector.text");
    }
    var I_ = [];
    function $_() {
      I_.forEach(function(e) {
        return e();
      });
    }
    var Y_ = b.ReactCurrentActQueue;
    function Q_(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function ab() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && Y_.current !== null && g("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var W_ = Math.ceil, FS = b.ReactCurrentDispatcher, PS = b.ReactCurrentOwner, Kr = b.ReactCurrentBatchConfig, dl = b.ReactCurrentActQueue, br = (
      /*             */
      0
    ), ib = (
      /*               */
      1
    ), qr = (
      /*                */
      2
    ), Fi = (
      /*                */
      4
    ), Yo = 0, Hp = 1, rc = 2, Um = 3, Vp = 4, lb = 5, HS = 6, $t = br, Ta = null, Pn = null, wr = de, Jl = de, VS = Ou(de), Tr = Yo, Bp = null, Fm = de, Ip = de, Pm = de, $p = null, Qa = null, BS = 0, ob = 500, ub = 1 / 0, G_ = 500, Qo = null;
    function Yp() {
      ub = tr() + G_;
    }
    function sb() {
      return ub;
    }
    var Hm = !1, IS = null, $f = null, ac = !1, Iu = null, Qp = de, $S = [], YS = null, K_ = 50, Wp = 0, QS = null, WS = !1, Vm = !1, q_ = 50, Yf = 0, Bm = null, Gp = fn, Im = de, cb = !1;
    function $m() {
      return Ta;
    }
    function Ra() {
      return ($t & (qr | Fi)) !== br ? tr() : (Gp !== fn || (Gp = tr()), Gp);
    }
    function $u(e) {
      var t = e.mode;
      if ((t & Lt) === at)
        return ct;
      if (($t & qr) !== br && wr !== de)
        return Ts(wr);
      var a = YT() !== $T;
      if (a) {
        if (Kr.transition !== null) {
          var i = Kr.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Im === Gt && (Im = zd()), Im;
      }
      var o = Va();
      if (o !== Gt)
        return o;
      var s = D0();
      return s;
    }
    function X_(e) {
      var t = e.mode;
      return (t & Lt) === at ? ct : Gv();
    }
    function Rr(e, t, a, i) {
      Ck(), cb && g("useInsertionEffect must not schedule updates."), WS && (Vm = !0), Cu(e, a, i), ($t & qr) !== de && e === Ta ? wk(t) : (aa && ks(e, t, a), Tk(t), e === Ta && (($t & qr) === br && (Ip = Rt(Ip, a)), Tr === Vp && Yu(e, wr)), Wa(e, i), a === ct && $t === br && (t.mode & Lt) === at && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !dl.isBatchingLegacy && (Yp(), cC()));
    }
    function J_(e, t, a) {
      var i = e.current;
      i.lanes = t, Cu(e, t, a), Wa(e, a);
    }
    function Z_(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        ($t & qr) !== br
      );
    }
    function Wa(e, t) {
      var a = e.callbackNode;
      Zc(e, t);
      var i = Jc(e, e === Ta ? wr : de);
      if (i === de) {
        a !== null && Rb(a), e.callbackNode = null, e.callbackPriority = Gt;
        return;
      }
      var o = zl(i), s = e.callbackPriority;
      if (s === o && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== eE)) {
        a == null && s !== ct && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && Rb(a);
      var f;
      if (o === ct)
        e.tag === Lu ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), _T(pb.bind(null, e))) : sC(pb.bind(null, e)), dl.current !== null ? dl.current.push(Mu) : j0(function() {
          ($t & (qr | Fi)) === br && Mu();
        }), f = null;
      else {
        var v;
        switch (th(i)) {
          case Pr:
            v = fs;
            break;
          case ki:
            v = Ol;
            break;
          case Pa:
            v = Ki;
            break;
          case Ha:
            v = So;
            break;
          default:
            v = Ki;
            break;
        }
        f = tE(v, fb.bind(null, e));
      }
      e.callbackPriority = o, e.callbackNode = f;
    }
    function fb(e, t) {
      if (yR(), Gp = fn, Im = de, ($t & (qr | Fi)) !== br)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Go();
      if (i && e.callbackNode !== a)
        return null;
      var o = Jc(e, e === Ta ? wr : de);
      if (o === de)
        return null;
      var s = !tf(e, o) && !Wv(e, o) && !t, f = s ? sk(e, o) : Qm(e, o);
      if (f !== Yo) {
        if (f === rc) {
          var v = ef(e);
          v !== de && (o = v, f = GS(e, v));
        }
        if (f === Hp) {
          var h = Bp;
          throw ic(e, de), Yu(e, o), Wa(e, tr()), h;
        }
        if (f === HS)
          Yu(e, o);
        else {
          var S = !tf(e, o), x = e.current.alternate;
          if (S && !tk(x)) {
            if (f = Qm(e, o), f === rc) {
              var O = ef(e);
              O !== de && (o = O, f = GS(e, O));
            }
            if (f === Hp) {
              var N = Bp;
              throw ic(e, de), Yu(e, o), Wa(e, tr()), N;
            }
          }
          e.finishedWork = x, e.finishedLanes = o, ek(e, f, o);
        }
      }
      return Wa(e, tr()), e.callbackNode === a ? fb.bind(null, e) : null;
    }
    function GS(e, t) {
      var a = $p;
      if (af(e)) {
        var i = ic(e, t);
        i.flags |= kr, ET(e.containerInfo);
      }
      var o = Qm(e, t);
      if (o !== rc) {
        var s = Qa;
        Qa = a, s !== null && db(s);
      }
      return o;
    }
    function db(e) {
      Qa === null ? Qa = e : Qa.push.apply(Qa, e);
    }
    function ek(e, t, a) {
      switch (t) {
        case Yo:
        case Hp:
          throw new Error("Root did not complete. This is a bug in React.");
        case rc: {
          lc(e, Qa, Qo);
          break;
        }
        case Um: {
          if (Yu(e, a), No(a) && // do not delay if we're inside an act() scope
          !_b()) {
            var i = BS + ob - tr();
            if (i > 10) {
              var o = Jc(e, de);
              if (o !== de)
                break;
              var s = e.suspendedLanes;
              if (!jo(s, a)) {
                Ra(), nf(e, s);
                break;
              }
              e.timeoutHandle = Yy(lc.bind(null, e, Qa, Qo), i);
              break;
            }
          }
          lc(e, Qa, Qo);
          break;
        }
        case Vp: {
          if (Yu(e, a), Md(a))
            break;
          if (!_b()) {
            var f = oi(e, a), v = f, h = tr() - v, S = Ek(h) - h;
            if (S > 10) {
              e.timeoutHandle = Yy(lc.bind(null, e, Qa, Qo), S);
              break;
            }
          }
          lc(e, Qa, Qo);
          break;
        }
        case lb: {
          lc(e, Qa, Qo);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function tk(e) {
      for (var t = e; ; ) {
        if (t.flags & mu) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var o = 0; o < i.length; o++) {
                var s = i[o], f = s.getSnapshot, v = s.value;
                try {
                  if (!ye(f(), v))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var h = t.child;
        if (t.subtreeFlags & mu && h !== null) {
          h.return = t, t = h;
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
    function Yu(e, t) {
      t = Rs(t, Pm), t = Rs(t, Ip), Xv(e, t);
    }
    function pb(e) {
      if (gR(), ($t & (qr | Fi)) !== br)
        throw new Error("Should not already be working.");
      Go();
      var t = Jc(e, de);
      if (!la(t, ct))
        return Wa(e, tr()), null;
      var a = Qm(e, t);
      if (e.tag !== Lu && a === rc) {
        var i = ef(e);
        i !== de && (t = i, a = GS(e, i));
      }
      if (a === Hp) {
        var o = Bp;
        throw ic(e, de), Yu(e, t), Wa(e, tr()), o;
      }
      if (a === HS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, lc(e, Qa, Qo), Wa(e, tr()), null;
    }
    function nk(e, t) {
      t !== de && (rf(e, Rt(t, ct)), Wa(e, tr()), ($t & (qr | Fi)) === br && (Yp(), Mu()));
    }
    function KS(e, t) {
      var a = $t;
      $t |= ib;
      try {
        return e(t);
      } finally {
        $t = a, $t === br && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !dl.isBatchingLegacy && (Yp(), cC());
      }
    }
    function rk(e, t, a, i, o) {
      var s = Va(), f = Kr.transition;
      try {
        return Kr.transition = null, Wn(Pr), e(t, a, i, o);
      } finally {
        Wn(s), Kr.transition = f, $t === br && Yp();
      }
    }
    function Wo(e) {
      Iu !== null && Iu.tag === Lu && ($t & (qr | Fi)) === br && Go();
      var t = $t;
      $t |= ib;
      var a = Kr.transition, i = Va();
      try {
        return Kr.transition = null, Wn(Pr), e ? e() : void 0;
      } finally {
        Wn(i), Kr.transition = a, $t = t, ($t & (qr | Fi)) === br && Mu();
      }
    }
    function vb() {
      return ($t & (qr | Fi)) !== br;
    }
    function Ym(e, t) {
      fa(VS, Jl, e), Jl = Rt(Jl, t);
    }
    function qS(e) {
      Jl = VS.current, ca(VS, e);
    }
    function ic(e, t) {
      e.finishedWork = null, e.finishedLanes = de;
      var a = e.timeoutHandle;
      if (a !== Qy && (e.timeoutHandle = Qy, N0(a)), Pn !== null)
        for (var i = Pn.return; i !== null; ) {
          var o = i.alternate;
          Ix(o, i), i = i.return;
        }
      Ta = e;
      var s = oc(e.current, null);
      return Pn = s, wr = Jl = t, Tr = Yo, Bp = null, Fm = de, Ip = de, Pm = de, $p = null, Qa = null, JT(), al.discardPendingWarnings(), s;
    }
    function hb(e, t) {
      do {
        var a = Pn;
        try {
          if (tm(), PC(), yn(), PS.current = null, a === null || a.return === null) {
            Tr = Hp, Bp = t, Pn = null;
            return;
          }
          if ($e && a.mode & Xt && Nm(a, !0), Oe)
            if (Ca(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              _i(a, i, wr);
            } else
              ps(a, t, wr);
          _R(e, a.return, a, t, wr), Sb(a);
        } catch (o) {
          t = o, Pn === a && a !== null ? (a = a.return, Pn = a) : a = Pn;
          continue;
        }
        return;
      } while (!0);
    }
    function mb() {
      var e = FS.current;
      return FS.current = Tm, e === null ? Tm : e;
    }
    function yb(e) {
      FS.current = e;
    }
    function ak() {
      BS = tr();
    }
    function Kp(e) {
      Fm = Rt(e, Fm);
    }
    function ik() {
      Tr === Yo && (Tr = Um);
    }
    function XS() {
      (Tr === Yo || Tr === Um || Tr === rc) && (Tr = Vp), Ta !== null && (ws(Fm) || ws(Ip)) && Yu(Ta, wr);
    }
    function lk(e) {
      Tr !== Vp && (Tr = rc), $p === null ? $p = [e] : $p.push(e);
    }
    function ok() {
      return Tr === Yo;
    }
    function Qm(e, t) {
      var a = $t;
      $t |= qr;
      var i = mb();
      if (Ta !== e || wr !== t) {
        if (aa) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (qp(e, wr), o.clear()), Jv(e, t);
        }
        Qo = Hd(), ic(e, t);
      }
      bo(t);
      do
        try {
          uk();
          break;
        } catch (s) {
          hb(e, s);
        }
      while (!0);
      if (tm(), $t = a, yb(i), Pn !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Mc(), Ta = null, wr = de, Tr;
    }
    function uk() {
      for (; Pn !== null; )
        gb(Pn);
    }
    function sk(e, t) {
      var a = $t;
      $t |= qr;
      var i = mb();
      if (Ta !== e || wr !== t) {
        if (aa) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (qp(e, wr), o.clear()), Jv(e, t);
        }
        Qo = Hd(), Yp(), ic(e, t);
      }
      bo(t);
      do
        try {
          ck();
          break;
        } catch (s) {
          hb(e, s);
        }
      while (!0);
      return tm(), yb(i), $t = a, Pn !== null ? (Iv(), Yo) : (Mc(), Ta = null, wr = de, Tr);
    }
    function ck() {
      for (; Pn !== null && !Sd(); )
        gb(Pn);
    }
    function gb(e) {
      var t = e.alternate;
      an(e);
      var a;
      (e.mode & Xt) !== at ? (eS(e), a = JS(t, e, Jl), Nm(e, !0)) : a = JS(t, e, Jl), yn(), e.memoizedProps = e.pendingProps, a === null ? Sb(e) : Pn = a, PS.current = null;
    }
    function Sb(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & cs) === rt) {
          an(t);
          var o = void 0;
          if ((t.mode & Xt) === at ? o = Bx(a, t, Jl) : (eS(t), o = Bx(a, t, Jl), Nm(t, !1)), yn(), o !== null) {
            Pn = o;
            return;
          }
        } else {
          var s = i_(a, t);
          if (s !== null) {
            s.flags &= Uv, Pn = s;
            return;
          }
          if ((t.mode & Xt) !== at) {
            Nm(t, !1);
            for (var f = t.actualDuration, v = t.child; v !== null; )
              f += v.actualDuration, v = v.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= cs, i.subtreeFlags = rt, i.deletions = null;
          else {
            Tr = HS, Pn = null;
            return;
          }
        }
        var h = t.sibling;
        if (h !== null) {
          Pn = h;
          return;
        }
        t = i, Pn = t;
      } while (t !== null);
      Tr === Yo && (Tr = lb);
    }
    function lc(e, t, a) {
      var i = Va(), o = Kr.transition;
      try {
        Kr.transition = null, Wn(Pr), fk(e, t, a, i);
      } finally {
        Kr.transition = o, Wn(i);
      }
      return null;
    }
    function fk(e, t, a, i) {
      do
        Go();
      while (Iu !== null);
      if (xk(), ($t & (qr | Fi)) !== br)
        throw new Error("Should not already be working.");
      var o = e.finishedWork, s = e.finishedLanes;
      if (Td(s), o === null)
        return Rd(), null;
      if (s === de && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = de, o === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Gt;
      var f = Rt(o.lanes, o.childLanes);
      Fd(e, f), e === Ta && (Ta = null, Pn = null, wr = de), ((o.subtreeFlags & Gi) !== rt || (o.flags & Gi) !== rt) && (ac || (ac = !0, YS = a, tE(Ki, function() {
        return Go(), null;
      })));
      var v = (o.subtreeFlags & (Dl | Nl | jl | Gi)) !== rt, h = (o.flags & (Dl | Nl | jl | Gi)) !== rt;
      if (v || h) {
        var S = Kr.transition;
        Kr.transition = null;
        var x = Va();
        Wn(Pr);
        var O = $t;
        $t |= Fi, PS.current = null, c_(e, o), cx(), w_(e, o, s), b0(e.containerInfo), e.current = o, vs(s), T_(o, e, s), hs(), Ed(), $t = O, Wn(x), Kr.transition = S;
      } else
        e.current = o, cx();
      var N = ac;
      if (ac ? (ac = !1, Iu = e, Qp = s) : (Yf = 0, Bm = null), f = e.pendingLanes, f === de && ($f = null), N || bb(e.current, !1), xd(o.stateNode, i), aa && e.memoizedUpdaters.clear(), $_(), Wa(e, tr()), t !== null)
        for (var $ = e.onRecoverableError, W = 0; W < t.length; W++) {
          var J = t[W], Ue = J.stack, lt = J.digest;
          $(J.value, {
            componentStack: Ue,
            digest: lt
          });
        }
      if (Hm) {
        Hm = !1;
        var Ze = IS;
        throw IS = null, Ze;
      }
      return la(Qp, ct) && e.tag !== Lu && Go(), f = e.pendingLanes, la(f, ct) ? (mR(), e === QS ? Wp++ : (Wp = 0, QS = e)) : Wp = 0, Mu(), Rd(), null;
    }
    function Go() {
      if (Iu !== null) {
        var e = th(Qp), t = Ns(Pa, e), a = Kr.transition, i = Va();
        try {
          return Kr.transition = null, Wn(t), pk();
        } finally {
          Wn(i), Kr.transition = a;
        }
      }
      return !1;
    }
    function dk(e) {
      $S.push(e), ac || (ac = !0, tE(Ki, function() {
        return Go(), null;
      }));
    }
    function pk() {
      if (Iu === null)
        return !1;
      var e = YS;
      YS = null;
      var t = Iu, a = Qp;
      if (Iu = null, Qp = de, ($t & (qr | Fi)) !== br)
        throw new Error("Cannot flush passive effects while already rendering.");
      WS = !0, Vm = !1, xo(a);
      var i = $t;
      $t |= Fi, O_(t.current), k_(t, t.current, a, e);
      {
        var o = $S;
        $S = [];
        for (var s = 0; s < o.length; s++) {
          var f = o[s];
          v_(t, f);
        }
      }
      Dd(), bb(t.current, !0), $t = i, Mu(), Vm ? t === Bm ? Yf++ : (Yf = 0, Bm = t) : Yf = 0, WS = !1, Vm = !1, bd(t);
      {
        var v = t.current.stateNode;
        v.effectDuration = 0, v.passiveEffectDuration = 0;
      }
      return !0;
    }
    function Eb(e) {
      return $f !== null && $f.has(e);
    }
    function vk(e) {
      $f === null ? $f = /* @__PURE__ */ new Set([e]) : $f.add(e);
    }
    function hk(e) {
      Hm || (Hm = !0, IS = e);
    }
    var mk = hk;
    function Cb(e, t, a) {
      var i = tc(a, t), o = gx(e, i, ct), s = zu(e, o, ct), f = Ra();
      s !== null && (Cu(s, ct, f), Wa(s, f));
    }
    function gn(e, t, a) {
      if (o_(a), Xp(!1), e.tag === P) {
        Cb(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === P) {
          Cb(i, e, a);
          return;
        } else if (i.tag === z) {
          var o = i.type, s = i.stateNode;
          if (typeof o.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !Eb(s)) {
            var f = tc(a, e), v = gS(i, f, ct), h = zu(i, v, ct), S = Ra();
            h !== null && (Cu(h, ct, S), Wa(h, S));
            return;
          }
        }
        i = i.return;
      }
      g(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function yk(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var o = Ra();
      nf(e, a), Rk(e), Ta === e && jo(wr, a) && (Tr === Vp || Tr === Um && No(wr) && tr() - BS < ob ? ic(e, de) : Pm = Rt(Pm, a)), Wa(e, o);
    }
    function xb(e, t) {
      t === Gt && (t = X_(e));
      var a = Ra(), i = $a(e, t);
      i !== null && (Cu(i, t, a), Wa(i, a));
    }
    function gk(e) {
      var t = e.memoizedState, a = Gt;
      t !== null && (a = t.retryLane), xb(e, a);
    }
    function Sk(e, t) {
      var a = Gt, i;
      switch (e.tag) {
        case le:
          i = e.stateNode;
          var o = e.memoizedState;
          o !== null && (a = o.retryLane);
          break;
        case je:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), xb(e, a);
    }
    function Ek(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : W_(e / 1960) * 1960;
    }
    function Ck() {
      if (Wp > K_)
        throw Wp = 0, QS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Yf > q_ && (Yf = 0, Bm = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function xk() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function bb(e, t) {
      an(e), Wm(e, kl, V_), t && Wm(e, wi, B_), Wm(e, kl, P_), t && Wm(e, wi, H_), yn();
    }
    function Wm(e, t, a) {
      for (var i = e, o = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== o && i.child !== null && s !== rt ? i = i.child : ((i.flags & t) !== rt && a(i), i.sibling !== null ? i = i.sibling : i = o = i.return);
      }
    }
    var Gm = null;
    function wb(e) {
      {
        if (($t & qr) !== br || !(e.mode & Lt))
          return;
        var t = e.tag;
        if (t !== ge && t !== P && t !== z && t !== L && t !== Ee && t !== se && t !== U)
          return;
        var a = ht(e) || "ReactComponent";
        if (Gm !== null) {
          if (Gm.has(a))
            return;
          Gm.add(a);
        } else
          Gm = /* @__PURE__ */ new Set([a]);
        var i = vr;
        try {
          an(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? an(e) : yn();
        }
      }
    }
    var JS;
    {
      var bk = null;
      JS = function(e, t, a) {
        var i = Ob(bk, t);
        try {
          return Ux(e, t, a);
        } catch (s) {
          if (AT() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (tm(), PC(), Ix(e, t), Ob(t, i), t.mode & Xt && eS(t), _l(null, Ux, null, e, t, a), Qi()) {
            var o = ss();
            typeof o == "object" && o !== null && o._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var Tb = !1, ZS;
    ZS = /* @__PURE__ */ new Set();
    function wk(e) {
      if (yi && !pR())
        switch (e.tag) {
          case L:
          case Ee:
          case U: {
            var t = Pn && ht(Pn) || "Unknown", a = t;
            if (!ZS.has(a)) {
              ZS.add(a);
              var i = ht(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case z: {
            Tb || (g("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), Tb = !0);
            break;
          }
        }
    }
    function qp(e, t) {
      if (aa) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          ks(e, i, t);
        });
      }
    }
    var eE = {};
    function tE(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), eE) : gd(e, t);
      }
    }
    function Rb(e) {
      if (e !== eE)
        return Pv(e);
    }
    function _b() {
      return dl.current !== null;
    }
    function Tk(e) {
      {
        if (e.mode & Lt) {
          if (!ab())
            return;
        } else if (!Q_() || $t !== br || e.tag !== L && e.tag !== Ee && e.tag !== U)
          return;
        if (dl.current === null) {
          var t = vr;
          try {
            an(e), g(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, ht(e));
          } finally {
            t ? an(e) : yn();
          }
        }
      }
    }
    function Rk(e) {
      e.tag !== Lu && ab() && dl.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Xp(e) {
      cb = e;
    }
    var Pi = null, Qf = null, _k = function(e) {
      Pi = e;
    };
    function Wf(e) {
      {
        if (Pi === null)
          return e;
        var t = Pi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function nE(e) {
      return Wf(e);
    }
    function rE(e) {
      {
        if (Pi === null)
          return e;
        var t = Pi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Wf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: ce,
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
    function kb(e, t) {
      {
        if (Pi === null)
          return !1;
        var a = e.elementType, i = t.type, o = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case z: {
            typeof i == "function" && (o = !0);
            break;
          }
          case L: {
            (typeof i == "function" || s === yt) && (o = !0);
            break;
          }
          case Ee: {
            (s === ce || s === yt) && (o = !0);
            break;
          }
          case se:
          case U: {
            (s === xt || s === yt) && (o = !0);
            break;
          }
          default:
            return !1;
        }
        if (o) {
          var f = Pi(a);
          if (f !== void 0 && f === Pi(i))
            return !0;
        }
        return !1;
      }
    }
    function Db(e) {
      {
        if (Pi === null || typeof WeakSet != "function")
          return;
        Qf === null && (Qf = /* @__PURE__ */ new WeakSet()), Qf.add(e);
      }
    }
    var kk = function(e, t) {
      {
        if (Pi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Go(), Wo(function() {
          aE(e.current, i, a);
        });
      }
    }, Dk = function(e, t) {
      {
        if (e.context !== ci)
          return;
        Go(), Wo(function() {
          Jp(t, e, null, null);
        });
      }
    };
    function aE(e, t, a) {
      {
        var i = e.alternate, o = e.child, s = e.sibling, f = e.tag, v = e.type, h = null;
        switch (f) {
          case L:
          case U:
          case z:
            h = v;
            break;
          case Ee:
            h = v.render;
            break;
        }
        if (Pi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var S = !1, x = !1;
        if (h !== null) {
          var O = Pi(h);
          O !== void 0 && (a.has(O) ? x = !0 : t.has(O) && (f === z ? x = !0 : S = !0));
        }
        if (Qf !== null && (Qf.has(e) || i !== null && Qf.has(i)) && (x = !0), x && (e._debugNeedsRemount = !0), x || S) {
          var N = $a(e, ct);
          N !== null && Rr(N, e, ct, fn);
        }
        o !== null && !x && aE(o, t, a), s !== null && aE(s, t, a);
      }
    }
    var Nk = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(o) {
          return o.current;
        }));
        return iE(e.current, i, a), a;
      }
    };
    function iE(e, t, a) {
      {
        var i = e.child, o = e.sibling, s = e.tag, f = e.type, v = null;
        switch (s) {
          case L:
          case U:
          case z:
            v = f;
            break;
          case Ee:
            v = f.render;
            break;
        }
        var h = !1;
        v !== null && t.has(v) && (h = !0), h ? jk(e, a) : i !== null && iE(i, t, a), o !== null && iE(o, t, a);
      }
    }
    function jk(e, t) {
      {
        var a = Ok(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case te:
              t.add(i.stateNode);
              return;
            case G:
              t.add(i.stateNode.containerInfo);
              return;
            case P:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function Ok(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === te)
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
    var lE;
    {
      lE = !1;
      try {
        var Nb = Object.preventExtensions({});
      } catch {
        lE = !0;
      }
    }
    function Lk(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = rt, this.subtreeFlags = rt, this.deletions = null, this.lanes = de, this.childLanes = de, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !lE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var fi = function(e, t, a, i) {
      return new Lk(e, t, a, i);
    };
    function oE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Mk(e) {
      return typeof e == "function" && !oE(e) && e.defaultProps === void 0;
    }
    function Ak(e) {
      if (typeof e == "function")
        return oE(e) ? z : L;
      if (e != null) {
        var t = e.$$typeof;
        if (t === ce)
          return Ee;
        if (t === xt)
          return se;
      }
      return ge;
    }
    function oc(e, t) {
      var a = e.alternate;
      a === null ? (a = fi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = rt, a.subtreeFlags = rt, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & $n, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case ge:
        case L:
        case U:
          a.type = Wf(e.type);
          break;
        case z:
          a.type = nE(e.type);
          break;
        case Ee:
          a.type = rE(e.type);
          break;
      }
      return a;
    }
    function zk(e, t) {
      e.flags &= $n | wn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = de, e.lanes = t, e.child = null, e.subtreeFlags = rt, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = rt, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function Uk(e, t, a) {
      var i;
      return e === Yh ? (i = Lt, t === !0 && (i |= un, i |= Jt)) : i = at, aa && (i |= Xt), fi(P, null, null, i);
    }
    function uE(e, t, a, i, o, s) {
      var f = ge, v = e;
      if (typeof e == "function")
        oE(e) ? (f = z, v = nE(v)) : v = Wf(v);
      else if (typeof e == "string")
        f = te;
      else
        e: switch (e) {
          case pi:
            return Qu(a.children, o, s, t);
          case qa:
            f = fe, o |= un, (o & Lt) !== at && (o |= Jt);
            break;
          case vi:
            return Fk(a, o, s, t);
          case Ae:
            return Pk(a, o, s, t);
          case Qe:
            return Hk(a, o, s, t);
          case Ln:
            return jb(a, o, s, t);
          case dn:
          case Mt:
          case mn:
          case pr:
          case Ot:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case hi:
                  f = oe;
                  break e;
                case _:
                  f = Le;
                  break e;
                case ce:
                  f = Ee, v = rE(v);
                  break e;
                case xt:
                  f = se;
                  break e;
                case yt:
                  f = pe, v = null;
                  break e;
              }
            var h = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (h += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var S = i ? ht(i) : null;
              S && (h += `

Check the render method of \`` + S + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + h));
          }
        }
      var x = fi(f, a, t, o);
      return x.elementType = e, x.type = v, x.lanes = s, x._debugOwner = i, x;
    }
    function sE(e, t, a) {
      var i = null;
      i = e._owner;
      var o = e.type, s = e.key, f = e.props, v = uE(o, s, f, i, t, a);
      return v._debugSource = e._source, v._debugOwner = e._owner, v;
    }
    function Qu(e, t, a, i) {
      var o = fi(X, e, i, t);
      return o.lanes = a, o;
    }
    function Fk(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var o = fi(Se, e, i, t | Xt);
      return o.elementType = vi, o.lanes = a, o.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, o;
    }
    function Pk(e, t, a, i) {
      var o = fi(le, e, i, t);
      return o.elementType = Ae, o.lanes = a, o;
    }
    function Hk(e, t, a, i) {
      var o = fi(je, e, i, t);
      return o.elementType = Qe, o.lanes = a, o;
    }
    function jb(e, t, a, i) {
      var o = fi(re, e, i, t);
      o.elementType = Ln, o.lanes = a;
      var s = {
        isHidden: !1
      };
      return o.stateNode = s, o;
    }
    function cE(e, t, a) {
      var i = fi(ne, e, null, t);
      return i.lanes = a, i;
    }
    function Vk() {
      var e = fi(te, null, null, at);
      return e.elementType = "DELETED", e;
    }
    function Bk(e) {
      var t = fi(be, null, null, at);
      return t.stateNode = e, t;
    }
    function fE(e, t, a) {
      var i = e.children !== null ? e.children : [], o = fi(G, i, e.key, t);
      return o.lanes = a, o.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, o;
    }
    function Ob(e, t) {
      return e === null && (e = fi(ge, null, null, at)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function Ik(e, t, a, i, o) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Qy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Gt, this.eventTimes = _s(de), this.expirationTimes = _s(fn), this.pendingLanes = de, this.suspendedLanes = de, this.pingedLanes = de, this.expiredLanes = de, this.mutableReadLanes = de, this.finishedLanes = de, this.entangledLanes = de, this.entanglements = _s(de), this.identifierPrefix = i, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < wo; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Yh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Lu:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function Lb(e, t, a, i, o, s, f, v, h, S) {
      var x = new Ik(e, t, a, v, h), O = Uk(t, s);
      x.current = O, O.stateNode = x;
      {
        var N = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        O.memoizedState = N;
      }
      return wg(O), x;
    }
    var dE = "18.3.1";
    function $k(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return cr(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: dr,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var pE, vE;
    pE = !1, vE = {};
    function Mb(e) {
      if (!e)
        return ci;
      var t = hu(e), a = RT(t);
      if (t.tag === z) {
        var i = t.type;
        if (Yl(i))
          return oC(t, i, a);
      }
      return a;
    }
    function Yk(e, t) {
      {
        var a = hu(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var o = na(a);
        if (o === null)
          return null;
        if (o.mode & un) {
          var s = ht(a) || "Component";
          if (!vE[s]) {
            vE[s] = !0;
            var f = vr;
            try {
              an(o), a.mode & un ? g("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : g("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? an(f) : yn();
            }
          }
        }
        return o.stateNode;
      }
    }
    function Ab(e, t, a, i, o, s, f, v) {
      var h = !1, S = null;
      return Lb(e, t, h, S, a, i, o, s, f);
    }
    function zb(e, t, a, i, o, s, f, v, h, S) {
      var x = !0, O = Lb(a, i, x, e, o, s, f, v, h);
      O.context = Mb(null);
      var N = O.current, $ = Ra(), W = $u(N), J = Io($, W);
      return J.callback = t ?? null, zu(N, J, W), J_(O, W, $), O;
    }
    function Jp(e, t, a, i) {
      Cd(t, e);
      var o = t.current, s = Ra(), f = $u(o);
      Rn(f);
      var v = Mb(a);
      t.context === null ? t.context = v : t.pendingContext = v, yi && vr !== null && !pE && (pE = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, ht(vr) || "Unknown"));
      var h = Io(s, f);
      h.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && g("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), h.callback = i);
      var S = zu(o, h, f);
      return S !== null && (Rr(S, o, f, s), lm(S, o, f)), f;
    }
    function Km(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case te:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function Qk(e) {
      switch (e.tag) {
        case P: {
          var t = e.stateNode;
          if (af(t)) {
            var a = Yv(t);
            nk(t, a);
          }
          break;
        }
        case le: {
          Wo(function() {
            var o = $a(e, ct);
            if (o !== null) {
              var s = Ra();
              Rr(o, e, ct, s);
            }
          });
          var i = ct;
          hE(e, i);
          break;
        }
      }
    }
    function Ub(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = qv(a.retryLane, t));
    }
    function hE(e, t) {
      Ub(e, t);
      var a = e.alternate;
      a && Ub(a, t);
    }
    function Wk(e) {
      if (e.tag === le) {
        var t = Cs, a = $a(e, t);
        if (a !== null) {
          var i = Ra();
          Rr(a, e, t, i);
        }
        hE(e, t);
      }
    }
    function Gk(e) {
      if (e.tag === le) {
        var t = $u(e), a = $a(e, t);
        if (a !== null) {
          var i = Ra();
          Rr(a, e, t, i);
        }
        hE(e, t);
      }
    }
    function Fb(e) {
      var t = Sn(e);
      return t === null ? null : t.stateNode;
    }
    var Pb = function(e) {
      return null;
    };
    function Kk(e) {
      return Pb(e);
    }
    var Hb = function(e) {
      return !1;
    };
    function qk(e) {
      return Hb(e);
    }
    var Vb = null, Bb = null, Ib = null, $b = null, Yb = null, Qb = null, Wb = null, Gb = null, Kb = null;
    {
      var qb = function(e, t, a) {
        var i = t[a], o = Dt(e) ? e.slice() : kt({}, e);
        return a + 1 === t.length ? (Dt(o) ? o.splice(i, 1) : delete o[i], o) : (o[i] = qb(e[i], t, a + 1), o);
      }, Xb = function(e, t) {
        return qb(e, t, 0);
      }, Jb = function(e, t, a, i) {
        var o = t[i], s = Dt(e) ? e.slice() : kt({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[o], Dt(s) ? s.splice(o, 1) : delete s[o];
        } else
          s[o] = Jb(
            // $FlowFixMe number or string is fine here
            e[o],
            t,
            a,
            i + 1
          );
        return s;
      }, Zb = function(e, t, a) {
        if (t.length !== a.length) {
          D("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              D("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return Jb(e, t, a, 0);
      }, ew = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var o = t[a], s = Dt(e) ? e.slice() : kt({}, e);
        return s[o] = ew(e[o], t, a + 1, i), s;
      }, tw = function(e, t, a) {
        return ew(e, t, 0, a);
      }, mE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      Vb = function(e, t, a, i) {
        var o = mE(e, t);
        if (o !== null) {
          var s = tw(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = kt({}, e.memoizedProps);
          var f = $a(e, ct);
          f !== null && Rr(f, e, ct, fn);
        }
      }, Bb = function(e, t, a) {
        var i = mE(e, t);
        if (i !== null) {
          var o = Xb(i.memoizedState, a);
          i.memoizedState = o, i.baseState = o, e.memoizedProps = kt({}, e.memoizedProps);
          var s = $a(e, ct);
          s !== null && Rr(s, e, ct, fn);
        }
      }, Ib = function(e, t, a, i) {
        var o = mE(e, t);
        if (o !== null) {
          var s = Zb(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = kt({}, e.memoizedProps);
          var f = $a(e, ct);
          f !== null && Rr(f, e, ct, fn);
        }
      }, $b = function(e, t, a) {
        e.pendingProps = tw(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = $a(e, ct);
        i !== null && Rr(i, e, ct, fn);
      }, Yb = function(e, t) {
        e.pendingProps = Xb(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = $a(e, ct);
        a !== null && Rr(a, e, ct, fn);
      }, Qb = function(e, t, a) {
        e.pendingProps = Zb(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = $a(e, ct);
        i !== null && Rr(i, e, ct, fn);
      }, Wb = function(e) {
        var t = $a(e, ct);
        t !== null && Rr(t, e, ct, fn);
      }, Gb = function(e) {
        Pb = e;
      }, Kb = function(e) {
        Hb = e;
      };
    }
    function Xk(e) {
      var t = na(e);
      return t === null ? null : t.stateNode;
    }
    function Jk(e) {
      return null;
    }
    function Zk() {
      return vr;
    }
    function eD(e) {
      var t = e.findFiberByHostInstance, a = b.ReactCurrentDispatcher;
      return gu({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: Vb,
        overrideHookStateDeletePath: Bb,
        overrideHookStateRenamePath: Ib,
        overrideProps: $b,
        overridePropsDeletePath: Yb,
        overridePropsRenamePath: Qb,
        setErrorHandler: Gb,
        setSuspenseHandler: Kb,
        scheduleUpdate: Wb,
        currentDispatcherRef: a,
        findHostInstanceByFiber: Xk,
        findFiberByHostInstance: t || Jk,
        // React Refresh
        findHostInstancesForRefresh: Nk,
        scheduleRefresh: kk,
        scheduleRoot: Dk,
        setRefreshHandler: _k,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: Zk,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: dE
      });
    }
    var nw = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function yE(e) {
      this._internalRoot = e;
    }
    qm.prototype.render = yE.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? g("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Xm(arguments[1]) ? g("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && g("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Bn) {
          var i = Fb(t.current);
          i && i.parentNode !== a && g("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Jp(e, t, null, null);
    }, qm.prototype.unmount = yE.prototype.unmount = function() {
      typeof arguments[0] == "function" && g("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        vb() && g("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Wo(function() {
          Jp(null, e, null, null);
        }), nC(t);
      }
    };
    function tD(e, t) {
      if (!Xm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      rw(e);
      var a = !1, i = !1, o = "", s = nw;
      t != null && (t.hydrate ? D("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Ar && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = Ab(e, Yh, null, a, i, o, s);
      Fh(f.current, e);
      var v = e.nodeType === Bn ? e.parentNode : e;
      return ap(v), new yE(f);
    }
    function qm(e) {
      this._internalRoot = e;
    }
    function nD(e) {
      e && lh(e);
    }
    qm.prototype.unstable_scheduleHydration = nD;
    function rD(e, t, a) {
      if (!Xm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      rw(e), t === void 0 && g("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, o = a != null && a.hydratedSources || null, s = !1, f = !1, v = "", h = nw;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (v = a.identifierPrefix), a.onRecoverableError !== void 0 && (h = a.onRecoverableError));
      var S = zb(t, null, e, Yh, i, s, f, v, h);
      if (Fh(S.current, e), ap(e), o)
        for (var x = 0; x < o.length; x++) {
          var O = o[x];
          oR(S, O);
        }
      return new qm(S);
    }
    function Xm(e) {
      return !!(e && (e.nodeType === Zr || e.nodeType === Yi || e.nodeType === ld));
    }
    function Zp(e) {
      return !!(e && (e.nodeType === Zr || e.nodeType === Yi || e.nodeType === ld || e.nodeType === Bn && e.nodeValue === " react-mount-point-unstable "));
    }
    function rw(e) {
      e.nodeType === Zr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), hp(e) && (e._reactRootContainer ? g("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : g("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var aD = b.ReactCurrentOwner, aw;
    aw = function(e) {
      if (e._reactRootContainer && e.nodeType !== Bn) {
        var t = Fb(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = gE(e), o = !!(i && ju(i));
      o && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Zr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function gE(e) {
      return e ? e.nodeType === Yi ? e.documentElement : e.firstChild : null;
    }
    function iw() {
    }
    function iD(e, t, a, i, o) {
      if (o) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var N = Km(f);
            s.call(N);
          };
        }
        var f = zb(
          t,
          i,
          e,
          Lu,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          iw
        );
        e._reactRootContainer = f, Fh(f.current, e);
        var v = e.nodeType === Bn ? e.parentNode : e;
        return ap(v), Wo(), f;
      } else {
        for (var h; h = e.lastChild; )
          e.removeChild(h);
        if (typeof i == "function") {
          var S = i;
          i = function() {
            var N = Km(x);
            S.call(N);
          };
        }
        var x = Ab(
          e,
          Lu,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          iw
        );
        e._reactRootContainer = x, Fh(x.current, e);
        var O = e.nodeType === Bn ? e.parentNode : e;
        return ap(O), Wo(function() {
          Jp(t, x, a, i);
        }), x;
      }
    }
    function lD(e, t) {
      e !== null && typeof e != "function" && g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Jm(e, t, a, i, o) {
      aw(a), lD(o === void 0 ? null : o, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = iD(a, t, e, o, i);
      else {
        if (f = s, typeof o == "function") {
          var v = o;
          o = function() {
            var h = Km(f);
            v.call(h);
          };
        }
        Jp(t, f, e, o);
      }
      return Km(f);
    }
    var lw = !1;
    function oD(e) {
      {
        lw || (lw = !0, g("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = aD.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Qt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Zr ? e : Yk(e, "findDOMNode");
    }
    function uD(e, t, a) {
      if (g("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Zp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = hp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Jm(null, e, t, !0, a);
    }
    function sD(e, t, a) {
      if (g("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Zp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = hp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Jm(null, e, t, !1, a);
    }
    function cD(e, t, a, i) {
      if (g("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Zp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !hy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Jm(e, t, a, !1, i);
    }
    var ow = !1;
    function fD(e) {
      if (ow || (ow = !0, g("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Zp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = hp(e) && e._reactRootContainer === void 0;
        t && g("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = gE(e), i = a && !ju(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Wo(function() {
          Jm(null, null, e, !1, function() {
            e._reactRootContainer = null, nC(e);
          });
        }), !0;
      } else {
        {
          var o = gE(e), s = !!(o && ju(o)), f = e.nodeType === Zr && Zp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Nr(Qk), xu(Wk), nh(Gk), Os(Va), Vd(Zv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Cc(p0), vy(KS, rk, Wo);
    function dD(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Xm(t))
        throw new Error("Target container is not a DOM element.");
      return $k(e, t, null, a);
    }
    function pD(e, t, a, i) {
      return cD(e, t, a, i);
    }
    var SE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [ju, wf, Ph, fu, xc, KS]
    };
    function vD(e, t) {
      return SE.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), tD(e, t);
    }
    function hD(e, t, a) {
      return SE.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), rD(e, t, a);
    }
    function mD(e) {
      return vb() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Wo(e);
    }
    var yD = eD({
      findFiberByHostInstance: Qs,
      bundleType: 1,
      version: dE,
      rendererPackageName: "react-dom"
    });
    if (!yD && Cn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var uw = window.location.protocol;
      /^(https?|file):$/.test(uw) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (uw === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ka.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = SE, Ka.createPortal = dD, Ka.createRoot = vD, Ka.findDOMNode = oD, Ka.flushSync = mD, Ka.hydrate = uD, Ka.hydrateRoot = hD, Ka.render = sD, Ka.unmountComponentAtNode = fD, Ka.unstable_batchedUpdates = KS, Ka.unstable_renderSubtreeIntoContainer = pD, Ka.version = dE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Ka;
}
function ww() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ww);
    } catch (C) {
      console.error(C);
    }
  }
}
process.env.NODE_ENV === "production" ? (ww(), _E.exports = RD()) : _E.exports = _D();
var pl = _E.exports, kE, ey = pl;
if (process.env.NODE_ENV === "production")
  kE = ey.createRoot, ey.hydrateRoot;
else {
  var gw = ey.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  kE = function(C, E) {
    gw.usingClientEntryPoint = !0;
    try {
      return ey.createRoot(C, E);
    } finally {
      gw.usingClientEntryPoint = !1;
    }
  };
}
const ny = {
  key: "sr3",
  label: "Shadowrun 3rd Edition",
  isPrimary: !0,
  mockDataLoaded: !0
}, kD = {
  activeEdition: ny,
  setEdition: () => {
  },
  supportedEditions: [ny],
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
  campaignError: void 0,
  campaignCreationMethod: void 0
}, Tw = A.createContext(kD);
function DD({ children: C }) {
  const [E, b] = A.useState(ny), [q, ee] = A.useState({}), [D, g] = A.useState(null), ae = A.useMemo(
    () => [
      ny,
      {
        key: "sr5",
        label: "Shadowrun 5th Edition",
        isPrimary: !1,
        mockDataLoaded: !0
      }
    ],
    []
  ), L = A.useCallback(
    async (X) => {
      const fe = X ?? E.key;
      if (ee((Le) => {
        var oe;
        return {
          ...Le,
          [fe]: {
            data: (oe = Le[fe]) == null ? void 0 : oe.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        ee((Le) => {
          var oe;
          return {
            ...Le,
            [fe]: {
              data: (oe = Le[fe]) == null ? void 0 : oe.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const Le = await fetch(`/api/editions/${fe}/character-creation`);
        if (!Le.ok)
          throw new Error(`Failed to load edition data (${Le.status})`);
        const oe = await Le.json(), Ee = (oe == null ? void 0 : oe.character_creation) ?? oe;
        ee((Se) => ({
          ...Se,
          [fe]: {
            data: Ee,
            loading: !1,
            error: void 0
          }
        }));
      } catch (Le) {
        const oe = Le instanceof Error ? Le.message : "Unknown error loading edition data";
        ee((Ee) => {
          var Se;
          return {
            ...Ee,
            [fe]: {
              data: (Se = Ee[fe]) == null ? void 0 : Se.data,
              loading: !1,
              error: oe
            }
          };
        });
      }
    },
    [E.key]
  ), z = A.useCallback((X) => `${new Intl.NumberFormat("en-US").format(X)}¥`, []), ge = A.useCallback((X) => JSON.parse(JSON.stringify(X)), []), P = A.useCallback(
    (X, fe) => {
      var oe;
      if (!fe)
        return ge(X);
      const Le = ge(X);
      if (fe.resources && ((oe = Le.priorities) != null && oe.resources)) {
        const Ee = Le.priorities.resources;
        Object.entries(fe.resources).forEach(([Se, le]) => {
          const se = Se;
          typeof le == "number" && Ee[se] && (Ee[se] = {
            ...Ee[se],
            label: z(le)
          });
        });
      }
      return Le;
    },
    [ge, z]
  ), G = A.useCallback(
    async (X) => {
      var fe, Le;
      if (X) {
        g((oe) => (oe == null ? void 0 : oe.campaignId) === X ? { ...oe, loading: !0, error: void 0 } : {
          campaignId: X,
          edition: E.key,
          data: oe == null ? void 0 : oe.data,
          gameplayRules: oe == null ? void 0 : oe.gameplayRules,
          creationMethod: oe == null ? void 0 : oe.creationMethod,
          loading: !0,
          error: void 0
        });
        try {
          const oe = await fetch(`/api/campaigns/${X}/character-creation`);
          if (!oe.ok)
            throw new Error(`Failed to load campaign character creation (${oe.status})`);
          const Ee = await oe.json(), Se = ((Le = (fe = Ee.edition) == null ? void 0 : fe.toLowerCase) == null ? void 0 : Le.call(fe)) ?? E.key, le = Ee.edition_data;
          le && ee((se) => {
            var U;
            return {
              ...se,
              [Se]: {
                data: ((U = se[Se]) == null ? void 0 : U.data) ?? le,
                loading: !1,
                error: void 0
              }
            };
          }), g(() => ({
            campaignId: X,
            edition: Se,
            data: le ? P(le, Ee.gameplay_rules) : void 0,
            gameplayRules: Ee.gameplay_rules,
            creationMethod: Ee.creation_method ?? void 0,
            loading: !1,
            error: void 0
          }));
        } catch (oe) {
          const Ee = oe instanceof Error ? oe.message : "Unknown error loading campaign character creation data";
          throw g({
            campaignId: X,
            edition: E.key,
            data: void 0,
            gameplayRules: void 0,
            creationMethod: void 0,
            loading: !1,
            error: Ee
          }), oe;
        }
      }
    },
    [E.key, P]
  ), te = A.useCallback(() => {
    g(null);
  }, []), ne = A.useMemo(() => {
    const X = q[E.key], fe = D && !D.loading && !D.error && D.edition === E.key, Le = fe && D.data ? D.data : X == null ? void 0 : X.data, oe = fe ? D == null ? void 0 : D.creationMethod : void 0;
    return {
      activeEdition: E,
      supportedEditions: ae,
      setEdition: (Ee) => {
        const Se = ae.find((le) => le.key === Ee);
        Se ? b(Se) : console.warn(`Edition '${Ee}' is not registered; keeping current edition.`);
      },
      characterCreationData: Le,
      reloadEditionData: L,
      loadCampaignCharacterCreation: G,
      clearCampaignCharacterCreation: te,
      isLoading: (X == null ? void 0 : X.loading) ?? !1,
      error: X == null ? void 0 : X.error,
      campaignId: D == null ? void 0 : D.campaignId,
      campaignCharacterCreation: fe ? D == null ? void 0 : D.data : void 0,
      campaignGameplayRules: fe ? D == null ? void 0 : D.gameplayRules : void 0,
      campaignLoading: (D == null ? void 0 : D.loading) ?? !1,
      campaignError: D == null ? void 0 : D.error,
      campaignCreationMethod: oe
    };
  }, [
    E,
    D,
    te,
    q,
    G,
    L,
    ae
  ]);
  return A.useEffect(() => {
    const X = q[E.key];
    !(X != null && X.data) && !(X != null && X.loading) && L(E.key);
  }, [E.key, q, L]), A.useEffect(() => {
    typeof window > "u" || (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
      loadCampaignCharacterCreation: G,
      clearCampaignCharacterCreation: te
    }));
  }, [te, G]), A.useEffect(() => {
    var oe, Ee, Se, le, se, U;
    const X = q[E.key], fe = D && !D.loading && !D.error && D.edition === E.key, Le = fe && D.data ? D.data : X == null ? void 0 : X.data;
    Le && typeof window < "u" && ((Ee = (oe = window.ShadowmasterLegacyApp) == null ? void 0 : oe.setEditionData) == null || Ee.call(oe, E.key, Le)), typeof window < "u" && (fe ? (le = (Se = window.ShadowmasterLegacyApp) == null ? void 0 : Se.applyCampaignCreationDefaults) == null || le.call(Se, {
      campaignId: D.campaignId,
      edition: D.edition,
      gameplayRules: D.gameplayRules ?? null
    }) : (U = (se = window.ShadowmasterLegacyApp) == null ? void 0 : se.applyCampaignCreationDefaults) == null || U.call(se, null));
  }, [E.key, D, q]), /* @__PURE__ */ p.jsx(Tw.Provider, { value: ne, children: C });
}
function ND() {
  const C = A.useContext(Tw);
  if (!C)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return C;
}
const Rw = A.createContext(void 0);
function jD(C) {
  if (typeof document > "u")
    return { node: null, created: !1 };
  let E = document.getElementById(C);
  const b = !E;
  return E || (E = document.createElement("div"), E.id = C, document.body.appendChild(E)), { node: E, created: b };
}
const OD = 6e3;
function LD() {
  return typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function MD({ children: C }) {
  const [E, b] = A.useState([]), q = A.useRef(/* @__PURE__ */ new Map()), [ee, D] = A.useState(null);
  A.useEffect(() => {
    const { node: z, created: ge } = jD("shadowmaster-notifications");
    D(z);
    const P = q.current;
    return () => {
      P.forEach((G) => window.clearTimeout(G)), P.clear(), ge && (z != null && z.parentNode) && z.parentNode.removeChild(z);
    };
  }, []);
  const g = A.useCallback((z) => {
    b((P) => P.filter((G) => G.id !== z));
    const ge = q.current.get(z);
    ge && (window.clearTimeout(ge), q.current.delete(z));
  }, []), ae = A.useCallback(
    ({ id: z, type: ge = "info", title: P, description: G, durationMs: te = OD }) => {
      const ne = z ?? LD(), X = {
        id: ne,
        type: ge,
        title: P,
        description: G ?? "",
        durationMs: te,
        createdAt: Date.now()
      };
      if (b((fe) => [...fe, X]), te > 0) {
        const fe = window.setTimeout(() => {
          g(ne);
        }, te);
        q.current.set(ne, fe);
      }
      return ne;
    },
    [g]
  ), L = A.useMemo(
    () => ({
      pushNotification: ae,
      dismissNotification: g
    }),
    [g, ae]
  );
  return A.useEffect(() => {
    if (typeof window > "u")
      return;
    const z = (ge) => {
      const P = ge;
      P.detail && ae(P.detail);
    };
    return window.addEventListener("shadowmaster:notify", z), window.ShadowmasterNotify = ae, () => {
      window.removeEventListener("shadowmaster:notify", z), window.ShadowmasterNotify === ae && delete window.ShadowmasterNotify;
    };
  }, [ae]), /* @__PURE__ */ p.jsxs(Rw.Provider, { value: L, children: [
    C,
    ee && pl.createPortal(
      /* @__PURE__ */ p.jsx("div", { className: "notification-stack", role: "status", "aria-live": "polite", children: E.map((z) => /* @__PURE__ */ p.jsxs(
        "div",
        {
          className: `notification-toast notification-toast--${z.type}`,
          "data-notification-type": z.type,
          children: [
            /* @__PURE__ */ p.jsxs("div", { className: "notification-toast__content", children: [
              /* @__PURE__ */ p.jsx("strong", { children: z.title }),
              z.description && /* @__PURE__ */ p.jsx("p", { dangerouslySetInnerHTML: { __html: z.description.replace(/\n/g, "<br />") } })
            ] }),
            /* @__PURE__ */ p.jsx(
              "button",
              {
                type: "button",
                className: "notification-toast__close",
                "aria-label": "Dismiss notification",
                onClick: () => g(z.id),
                children: "×"
              }
            )
          ]
        },
        z.id
      )) }),
      ee
    )
  ] });
}
function _w() {
  const C = A.useContext(Rw);
  if (!C)
    throw new Error("useNotifications must be used within a NotificationProvider");
  return C;
}
function xE(C, E) {
  return !!(C != null && C.roles.some((b) => b.toLowerCase() === E.toLowerCase()));
}
async function rv(C, E = {}) {
  const b = new Headers(E.headers || {});
  E.body && !b.has("Content-Type") && b.set("Content-Type", "application/json");
  const q = await fetch(C, {
    ...E,
    headers: b,
    credentials: "include"
  });
  if (q.status === 204)
    return {};
  const ee = await q.text(), D = () => {
    try {
      return ee ? JSON.parse(ee) : {};
    } catch {
      return {};
    }
  };
  if (!q.ok) {
    const g = D(), ae = typeof g.error == "string" && g.error.trim().length > 0 ? g.error : q.statusText;
    throw new Error(ae);
  }
  return D();
}
function AD() {
  const [C, E] = A.useState("login"), [b, q] = A.useState(null), [ee, D] = A.useState(!1), [g, ae] = A.useState(!1), [L, z] = A.useState(""), [ge, P] = A.useState(""), [G, te] = A.useState(""), [ne, X] = A.useState(""), [fe, Le] = A.useState(""), [oe, Ee] = A.useState(""), [Se, le] = A.useState(""), [se, U] = A.useState(""), [pe, ue] = A.useState(""), be = A.useRef(!1), je = A.useRef(null), Je = "auth-menu-dropdown", re = "auth-menu-heading", { pushNotification: Fe } = _w();
  A.useEffect(() => {
    be.current || (be.current = !0, nt());
  }, []), A.useEffect(() => {
    window.ShadowmasterAuth = {
      user: b,
      isAdministrator: xE(b, "administrator"),
      isGamemaster: xE(b, "gamemaster"),
      isPlayer: xE(b, "player")
    }, window.dispatchEvent(new CustomEvent("shadowmaster:auth", { detail: window.ShadowmasterAuth }));
  }, [b]), A.useEffect(() => {
    if (!g)
      return;
    const M = ($e) => {
      je.current && (je.current.contains($e.target) || ae(!1));
    }, Oe = ($e) => {
      $e.key === "Escape" && ae(!1);
    };
    return document.addEventListener("mousedown", M), document.addEventListener("keydown", Oe), () => {
      document.removeEventListener("mousedown", M), document.removeEventListener("keydown", Oe);
    };
  }, [g]), A.useEffect(() => {
    if (!g || b)
      return;
    const M = C === "register" ? "register-email" : "login-email", Oe = window.setTimeout(() => {
      const $e = document.getElementById(M);
      $e == null || $e.focus();
    }, 0);
    return () => window.clearTimeout(Oe);
  }, [g, b, C]);
  async function nt() {
    try {
      D(!0);
      const M = await rv("/api/auth/me");
      q(M.user), E("login"), ae(!M.user);
    } catch {
      q(null), ae(!0);
    } finally {
      D(!1);
    }
  }
  async function pt(M) {
    M.preventDefault(), D(!0);
    try {
      const Oe = await rv("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: L,
          password: ge
        })
      });
      q(Oe.user), E("login"), P(""), ae(!1), Fe({
        type: "success",
        title: "Signed in",
        description: Oe.user ? `Welcome back, ${Oe.user.username || Oe.user.email}!` : "Signed in successfully."
      });
    } catch (Oe) {
      const $e = Oe instanceof Error ? Oe.message : "Login failed";
      Fe({
        type: "error",
        title: "Login failed",
        description: $e
      });
    } finally {
      D(!1);
    }
  }
  async function Me(M) {
    if (M.preventDefault(), fe !== oe) {
      Fe({
        type: "warning",
        title: "Passwords do not match",
        description: "Please confirm your password before continuing."
      });
      return;
    }
    D(!0);
    try {
      const Oe = await rv("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: G,
          username: ne,
          password: fe
        })
      });
      q(Oe.user), E("login"), Le(""), Ee(""), Fe({
        type: "success",
        title: "Account created",
        description: "You can now sign in with your new credentials."
      });
    } catch (Oe) {
      const $e = Oe instanceof Error ? Oe.message : "Registration failed";
      Fe({
        type: "error",
        title: "Registration failed",
        description: $e
      });
    } finally {
      D(!1);
    }
  }
  async function he() {
    D(!0);
    try {
      await rv("/api/auth/logout", { method: "POST" }), q(null), E("login"), ae(!0), Fe({
        type: "success",
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (M) {
      const Oe = M instanceof Error ? M.message : "Logout failed";
      Fe({
        type: "error",
        title: "Logout failed",
        description: Oe
      });
    } finally {
      D(!1);
    }
  }
  async function Be(M) {
    if (M.preventDefault(), se !== pe) {
      Fe({
        type: "warning",
        title: "New passwords do not match",
        description: "Make sure both password fields match before updating."
      });
      return;
    }
    D(!0);
    try {
      await rv("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({
          current_password: Se,
          new_password: se
        })
      }), le(""), U(""), ue(""), E("login"), Fe({
        type: "success",
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
    } catch (Oe) {
      const $e = Oe instanceof Error ? Oe.message : "Password update failed";
      Fe({
        type: "error",
        title: "Password update failed",
        description: $e
      });
    } finally {
      D(!1);
    }
  }
  const Re = A.useMemo(() => b ? b.roles.join(", ") : "", [b]), T = b ? `Signed in as ${b.email}.` : "Sign in to manage campaigns, sessions, and characters.";
  return /* @__PURE__ */ p.jsxs("section", { className: `auth-panel${g ? " auth-panel--open" : ""}`, ref: je, children: [
    /* @__PURE__ */ p.jsxs(
      "button",
      {
        type: "button",
        className: "auth-panel__toggle",
        "aria-haspopup": "dialog",
        "aria-expanded": g,
        "aria-controls": Je,
        onClick: () => ae((M) => !M),
        children: [
          /* @__PURE__ */ p.jsxs("span", { className: "auth-panel__hamburger", "aria-hidden": "true", children: [
            /* @__PURE__ */ p.jsx("span", {}),
            /* @__PURE__ */ p.jsx("span", {}),
            /* @__PURE__ */ p.jsx("span", {})
          ] }),
          /* @__PURE__ */ p.jsx("span", { className: "auth-panel__label", children: b ? b.username : "Sign In" }),
          b && /* @__PURE__ */ p.jsx("span", { className: "auth-panel__tag", children: Re || "Player" })
        ]
      }
    ),
    /* @__PURE__ */ p.jsxs(
      "div",
      {
        id: Je,
        className: "auth-panel__dropdown",
        role: "dialog",
        "aria-modal": "false",
        "aria-hidden": !g,
        "aria-labelledby": re,
        children: [
          /* @__PURE__ */ p.jsxs("header", { className: "auth-panel__header", children: [
            /* @__PURE__ */ p.jsxs("div", { children: [
              /* @__PURE__ */ p.jsx("h2", { id: re, children: b ? `Welcome, ${b.username}` : "Account Access" }),
              /* @__PURE__ */ p.jsx("p", { className: "auth-panel__status", children: T })
            ] }),
            b && /* @__PURE__ */ p.jsx("div", { className: "auth-panel__roles", children: /* @__PURE__ */ p.jsx("span", { className: "auth-tag", children: Re || "Player" }) })
          ] }),
          b ? /* @__PURE__ */ p.jsxs("div", { className: "auth-panel__content", children: [
            /* @__PURE__ */ p.jsxs("div", { className: "auth-panel__actions", children: [
              /* @__PURE__ */ p.jsx(
                "button",
                {
                  type: "button",
                  className: "btn btn-secondary",
                  onClick: () => {
                    E(C === "password" ? "login" : "password");
                  },
                  disabled: ee,
                  children: C === "password" ? "Hide Password Form" : "Change Password"
                }
              ),
              /* @__PURE__ */ p.jsx("button", { className: "btn btn-primary", type: "button", onClick: he, disabled: ee, children: "Logout" })
            ] }),
            C === "password" && /* @__PURE__ */ p.jsxs("form", { className: "auth-form", onSubmit: Be, children: [
              /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: "current-password", children: "Current Password" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: "current-password",
                    type: "password",
                    value: Se,
                    onChange: (M) => le(M.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: "new-password", children: "New Password" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: "new-password",
                    type: "password",
                    value: se,
                    onChange: (M) => U(M.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: "confirm-password", children: "Confirm New Password" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: "confirm-password",
                    type: "password",
                    value: pe,
                    onChange: (M) => ue(M.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ p.jsx("button", { className: "btn btn-primary", type: "submit", disabled: ee, children: "Update Password" })
            ] }),
            /* @__PURE__ */ p.jsx("div", { className: "auth-panel__menu-links", children: /* @__PURE__ */ p.jsxs("span", { className: "auth-panel__menu-link auth-panel__menu-link--disabled", children: [
              "Settings ",
              /* @__PURE__ */ p.jsx("small", { children: "Coming soon" })
            ] }) })
          ] }) : /* @__PURE__ */ p.jsxs("div", { className: "auth-panel__content", children: [
            C === "login" && /* @__PURE__ */ p.jsxs("form", { className: "auth-form", onSubmit: pt, children: [
              /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: "login-email", children: "Email" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: "login-email",
                    type: "email",
                    value: L,
                    onChange: (M) => z(M.target.value),
                    required: !0,
                    autoComplete: "email"
                  }
                )
              ] }),
              /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: "login-password", children: "Password" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: "login-password",
                    type: "password",
                    value: ge,
                    onChange: (M) => P(M.target.value),
                    required: !0,
                    autoComplete: "current-password"
                  }
                )
              ] }),
              /* @__PURE__ */ p.jsxs("div", { className: "auth-form__footer", children: [
                /* @__PURE__ */ p.jsx("button", { className: "btn btn-primary", type: "submit", disabled: ee, children: "Sign In" }),
                /* @__PURE__ */ p.jsx(
                  "button",
                  {
                    className: "btn btn-link",
                    type: "button",
                    onClick: () => {
                      E("register");
                    },
                    children: "Need an account?"
                  }
                )
              ] })
            ] }),
            C === "register" && /* @__PURE__ */ p.jsxs("form", { className: "auth-form", onSubmit: Me, children: [
              /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: "register-email", children: "Email" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: "register-email",
                    type: "email",
                    value: G,
                    onChange: (M) => te(M.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: "register-username", children: "Username" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: "register-username",
                    value: ne,
                    onChange: (M) => X(M.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: "register-password", children: "Password" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: "register-password",
                    type: "password",
                    value: fe,
                    onChange: (M) => Le(M.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: "register-confirm", children: "Confirm Password" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: "register-confirm",
                    type: "password",
                    value: oe,
                    onChange: (M) => Ee(M.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ p.jsxs("div", { className: "auth-form__footer", children: [
                /* @__PURE__ */ p.jsx("button", { className: "btn btn-primary", type: "submit", disabled: ee, children: "Create Account" }),
                /* @__PURE__ */ p.jsx(
                  "button",
                  {
                    className: "btn btn-link",
                    type: "button",
                    onClick: () => {
                      E("login");
                    },
                    children: "Sign in instead"
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
}
function zD() {
  var E, b;
  if (typeof window.showCreateCharacterModal == "function") {
    window.showCreateCharacterModal();
    return;
  }
  (b = (E = window.ShadowmasterLegacyApp) == null ? void 0 : E.showWizardStep) == null || b.call(E, 1);
  const C = document.getElementById("character-modal");
  C && (C.style.display = "block");
}
function UD() {
  const [C, E] = A.useState(null);
  return A.useEffect(() => {
    E(document.getElementById("characters-actions"));
  }, []), C ? pl.createPortal(
    /* @__PURE__ */ p.jsxs("div", { className: "characters-callout", children: [
      /* @__PURE__ */ p.jsxs("div", { className: "characters-callout__copy", children: [
        /* @__PURE__ */ p.jsx("h2", { children: "Characters" }),
        /* @__PURE__ */ p.jsx("p", { children: "Build new runners, review existing sheets, and keep your roster ready for the next mission." })
      ] }),
      /* @__PURE__ */ p.jsx("div", { className: "characters-callout__actions", children: /* @__PURE__ */ p.jsx(
        "button",
        {
          id: "create-character-btn",
          type: "button",
          className: "btn btn-primary",
          onClick: zD,
          children: "Create Character"
        }
      ) })
    ] }),
    C
  ) : null;
}
function Kf() {
  return ND();
}
const bE = [
  { label: "Priority (default)", value: "priority" },
  { label: "Sum-to-Ten (coming soon)", value: "sum_to_ten" },
  { label: "Karma (coming soon)", value: "karma" }
], wE = ["Basics", "Roster", "World", "Automation", "Session Seed", "Review"], FD = [
  {
    key: "initiative_automation",
    label: "Automate initiative order",
    description: "Track initiative passes and reorder combatants automatically."
  },
  {
    key: "recoil_tracking",
    label: "Track recoil and weapon heat",
    description: "Automatically apply recoil modifiers to firearms."
  },
  {
    key: "matrix_trace",
    label: "Matrix trace timers",
    description: "Monitor trace attempts and decker timers in the matrix."
  }
], PD = [
  { value: "blank", label: "Blank session", description: "Start fresh with your own outline." },
  {
    value: "social_meetup",
    label: "Johnson meet-and-greet",
    description: "Introductory social encounter with your fixer or Johnson."
  },
  {
    value: "matrix_recon",
    label: "Matrix scoping run",
    description: "Initial matrix reconnaissance to set the stage for future runs."
  },
  {
    value: "astral_patrol",
    label: "Astral patrol",
    description: "Magically oriented scene to explore astral threats or allies."
  }
];
function ov(C) {
  return typeof crypto < "u" && crypto.randomUUID ? `${C}-${crypto.randomUUID()}` : `${C}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function av(C) {
  return C.toLowerCase() === "sr5" ? "SR5" : C.toUpperCase();
}
function Sw(C) {
  return C === "SR5" ? "Shadowrun 5th Edition" : C;
}
const Ew = {
  name: "",
  description: "",
  theme: "",
  selectedPlayers: [],
  placeholders: [],
  factions: [],
  locations: [],
  houseRules: {},
  houseRuleNotes: "",
  sessionSeed: {
    title: "Session 0",
    objectives: "",
    sceneTemplate: "blank",
    skip: !1,
    summary: ""
  }
};
function HD(C, E) {
  switch (E.type) {
    case "RESET":
      return E.payload;
    case "UPDATE_FIELD":
      return {
        ...C,
        [E.field]: E.value
      };
    case "UPDATE_PLACEHOLDER":
      return {
        ...C,
        placeholders: C.placeholders.map(
          (b) => b.id === E.id ? { ...b, [E.field]: E.value } : b
        )
      };
    case "ADD_PLACEHOLDER":
      return {
        ...C,
        placeholders: [
          ...C.placeholders,
          {
            id: ov("placeholder"),
            name: "Runner Placeholder",
            role: "Unassigned"
          }
        ]
      };
    case "REMOVE_PLACEHOLDER":
      return {
        ...C,
        placeholders: C.placeholders.filter((b) => b.id !== E.id)
      };
    case "UPDATE_FACTION":
      return {
        ...C,
        factions: C.factions.map(
          (b) => b.id === E.id ? { ...b, [E.field]: E.value } : b
        )
      };
    case "ADD_FACTION":
      return {
        ...C,
        factions: [
          ...C.factions,
          {
            id: ov("faction"),
            name: "",
            tags: "",
            notes: ""
          }
        ]
      };
    case "REMOVE_FACTION":
      return {
        ...C,
        factions: C.factions.filter((b) => b.id !== E.id)
      };
    case "UPDATE_LOCATION":
      return {
        ...C,
        locations: C.locations.map(
          (b) => b.id === E.id ? { ...b, [E.field]: E.value } : b
        )
      };
    case "ADD_LOCATION":
      return {
        ...C,
        locations: [
          ...C.locations,
          {
            id: ov("location"),
            name: "",
            descriptor: ""
          }
        ]
      };
    case "REMOVE_LOCATION":
      return {
        ...C,
        locations: C.locations.filter((b) => b.id !== E.id)
      };
    case "UPDATE_HOUSE_RULE":
      return {
        ...C,
        houseRules: {
          ...C.houseRules,
          [E.key]: E.value
        }
      };
    case "UPDATE_SESSION_SEED":
      return {
        ...C,
        sessionSeed: {
          ...C.sessionSeed,
          [E.field]: E.value
        }
      };
    default:
      return C;
  }
}
function VD({ targetId: C = "campaign-creation-react-root", onCreated: E }) {
  const {
    activeEdition: b,
    supportedEditions: q,
    characterCreationData: ee,
    reloadEditionData: D,
    setEdition: g
  } = Kf(), [ae, L] = A.useState(null), [z, ge] = A.useState(b.key), [P, G] = A.useState(ee), [te, ne] = A.useState([]), [X, fe] = A.useState([]), [Le, oe] = A.useState(""), [Ee, Se] = A.useState("experienced"), [le, se] = A.useState("priority"), [U, pe] = A.useState([]), [ue, be] = A.useState({}), [je, Je] = A.useState(bE), [re, Fe] = A.useState(!1), [nt, pt] = A.useState(!1), [Me, he] = A.useState(null), [Be, Re] = A.useState(0), [T, M] = A.useReducer(HD, Ew), [Oe, $e] = A.useState([]), [St, vt] = A.useState(() => [av(b.key)]), [mt, Et] = A.useState(!1), [_t, Kt] = A.useState(!1), [Cn, Hn] = A.useState(null), { pushNotification: hn } = _w(), Xn = wE.length, Ht = A.useMemo(() => av(z), [z]), kn = A.useMemo(() => {
    const Te = /* @__PURE__ */ new Map();
    return Oe.forEach((B) => {
      Te.set(B.code.toUpperCase(), B.name);
    }), Te;
  }, [Oe]), cr = A.useMemo(
    () => St.map((Te) => kn.get(Te) ?? Te),
    [kn, St]
  );
  A.useEffect(() => {
    L(document.getElementById(C));
  }, [C]), A.useEffect(() => {
    ge(b.key);
  }, [b.key]), A.useEffect(() => {
    let Te = !1;
    async function B() {
      Kt(!0), Hn(null);
      try {
        const ke = await fetch(`/api/editions/${z}/books`);
        if (!ke.ok)
          throw new Error(`Failed to load books (${ke.status})`);
        const tt = await ke.json(), Vt = Array.isArray(tt == null ? void 0 : tt.books) ? tt.books : [];
        if (Te)
          return;
        const Nt = Vt.map((Ut) => ({
          ...Ut,
          code: (Ut.code || "").toUpperCase()
        })).filter((Ut) => Ut.code), Tt = Nt.some((Ut) => Ut.code === Ht) ? Nt : [
          ...Nt,
          {
            id: Ht.toLowerCase(),
            name: Sw(Ht),
            code: Ht
          }
        ];
        Tt.sort((Ut, zt) => Ut.code.localeCompare(zt.code)), $e(Tt), vt((Ut) => {
          const zt = new Set(Ut.map((fr) => fr.toUpperCase()));
          zt.add(Ht);
          const Vn = new Set(Tt.map((fr) => fr.code));
          return Array.from(zt).filter((fr) => Vn.has(fr)).sort();
        });
      } catch (ke) {
        if (console.error("Failed to load source books", ke), Te)
          return;
        Hn("Unable to load source books. Default core book applied.");
        const tt = [
          { id: Ht.toLowerCase(), name: Sw(Ht), code: Ht }
        ];
        $e(tt), vt([Ht]);
      } finally {
        Te || Kt(!1);
      }
    }
    return B(), () => {
      Te = !0;
    };
  }, [Ht, z]), A.useEffect(() => {
    async function Te(B) {
      var ke;
      try {
        const tt = await fetch(`/api/editions/${B}/character-creation`);
        if (!tt.ok)
          throw new Error(`Failed to load edition data (${tt.status})`);
        const Vt = await tt.json(), Nt = (Vt == null ? void 0 : Vt.character_creation) ?? Vt;
        G(Nt), be(Nt.creation_methods ?? {});
        const jt = Object.entries(Nt.gameplay_levels ?? {}).map(([Tt, { label: Ut }]) => ({
          value: Tt,
          label: Ut || Tt
        }));
        ne(jt), jt.some((Tt) => Tt.value === Ee) || Se(((ke = jt[0]) == null ? void 0 : ke.value) ?? "experienced");
      } catch (tt) {
        console.error("Failed to load edition data", tt);
      }
    }
    Te(z);
  }, [z, Ee]), A.useEffect(() => {
    async function Te() {
      try {
        const B = await fetch("/api/users?role=gamemaster,administrator");
        if (!B.ok)
          throw new Error(`Failed to load users (${B.status})`);
        const ke = await B.json();
        if (!Array.isArray(ke) || ke.length === 0) {
          pe([]);
          return;
        }
        pe(ke), ke.length > 0 && oe((tt) => tt || ke[0].id);
      } catch (B) {
        console.error("Failed to load users", B), pe([]);
      }
    }
    Te();
  }, []), A.useEffect(() => {
    async function Te() {
      try {
        const B = await fetch("/api/characters");
        if (!B.ok)
          throw new Error(`Failed to load characters (${B.status})`);
        const ke = await B.json();
        if (!Array.isArray(ke)) {
          fe([]);
          return;
        }
        fe(ke);
      } catch (B) {
        console.error("Failed to load characters", B), fe([]);
      }
    }
    Te();
  }, []), A.useEffect(() => {
    !P && ee && (G(ee), be(ee.creation_methods ?? {}));
  }, [ee, P]), A.useEffect(() => {
    if (!P && Object.keys(ue).length === 0) {
      Je(bE);
      return;
    }
    if (!ue || Object.keys(ue).length === 0) {
      Je(bE);
      return;
    }
    const Te = Object.entries(ue).map(([B, ke]) => ({
      value: B,
      label: ke.label || B
    }));
    Je(Te);
  }, [ue, P]), A.useEffect(() => {
    je.length !== 0 && (je.some((Te) => Te.value === le) || se(je[0].value));
  }, [je, le]);
  const Da = A.useMemo(() => q.map((Te) => ({
    label: Te.label,
    value: Te.key
  })), [q]), _r = A.useMemo(() => U.length === 0 ? [{ label: "No gamemasters found", value: "" }] : U.map((Te) => ({
    label: `${Te.username} (${Te.email})`,
    value: Te.id
  })), [U]), Dn = A.useCallback(
    (Te) => {
      var ke, tt;
      const B = Te ?? av(z);
      M({ type: "RESET", payload: { ...Ew } }), Se("experienced"), se(((ke = je[0]) == null ? void 0 : ke.value) ?? "priority"), oe(((tt = U[0]) == null ? void 0 : tt.id) ?? ""), he(null), Re(0), vt([B]), Et(!1), Hn(null);
    },
    [je, z, U]
  );
  function xn() {
    const Te = av(b.key);
    ge(b.key), Dn(Te), Fe(!0);
  }
  function On() {
    Dn(), Fe(!1);
  }
  function Jn(Te) {
    return Te === 0 && !T.name.trim() ? (he("Campaign name is required."), !1) : Te === 1 && T.selectedPlayers.length === 0 && T.placeholders.length === 0 ? (he("Select at least one existing character or create a placeholder runner."), !1) : Te === 2 && T.factions.length === 0 && T.locations.length === 0 ? (he("Add at least one faction or location, or use the quick-add template."), !1) : Te === 4 && !T.sessionSeed.skip && !T.sessionSeed.title.trim() ? (he("Provide a title for the initial session or choose to skip."), !1) : (he(null), !0);
  }
  const ha = () => {
    Jn(Be) && Re((Te) => Math.min(Te + 1, wE.length - 1));
  }, Nn = A.useCallback(() => {
    const Te = ov("faction");
    M({ type: "ADD_FACTION" }), M({
      type: "UPDATE_FACTION",
      id: Te,
      field: "name",
      value: "Ares Macrotechnology"
    }), M({
      type: "UPDATE_FACTION",
      id: Te,
      field: "tags",
      value: "Corporate, AAA"
    }), M({
      type: "UPDATE_FACTION",
      id: Te,
      field: "notes",
      value: "Megacorp interested in experimental weapons testing."
    });
  }, []), ar = A.useCallback(() => {
    const Te = ov("location");
    M({ type: "ADD_LOCATION" }), M({
      type: "UPDATE_LOCATION",
      id: Te,
      field: "name",
      value: "Downtown Seattle Safehouse"
    }), M({
      type: "UPDATE_LOCATION",
      id: Te,
      field: "descriptor",
      value: "Secure condo with rating 4 security and friendly neighbors."
    });
  }, []), Or = () => {
    he(null), Re((Te) => Math.max(Te - 1, 0));
  };
  async function ma(Te) {
    var B, ke;
    if (Te.preventDefault(), !!Jn(Be)) {
      pt(!0), he(null);
      try {
        const tt = U.find((zt) => zt.id === Le), Vt = T.name.trim() || "Campaign", Nt = {
          automation: T.houseRules,
          notes: T.houseRuleNotes,
          theme: T.theme,
          factions: T.factions,
          locations: T.locations,
          placeholders: T.placeholders,
          session_seed: T.sessionSeed
        }, jt = await fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: T.name.trim(),
            description: T.description,
            gm_user_id: Le,
            gm_name: (tt == null ? void 0 : tt.username) ?? (tt == null ? void 0 : tt.email) ?? "",
            edition: z,
            gameplay_level: Ee,
            creation_method: le,
            enabled_books: St,
            house_rules: JSON.stringify(Nt),
            status: "Active"
          })
        });
        if (!jt.ok) {
          const zt = await jt.text();
          throw new Error(zt || `Failed to create campaign (${jt.status})`);
        }
        const Tt = await jt.json(), Ut = [];
        if (T.placeholders.length > 0)
          try {
            await Promise.all(
              T.placeholders.map(async (zt) => {
                const Vn = await fetch("/api/characters", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: zt.name,
                    player_name: zt.role,
                    status: "Placeholder",
                    edition: z,
                    edition_data: {},
                    is_npc: !0,
                    campaign_id: Tt.id
                  })
                });
                if (!Vn.ok) {
                  const fr = await Vn.text();
                  throw new Error(fr || `Failed to create placeholder (${Vn.status})`);
                }
              })
            );
          } catch (zt) {
            console.error("Failed to create placeholder characters", zt), Ut.push("Placeholder runners were not saved.");
          }
        if (!T.sessionSeed.skip)
          try {
            const zt = await fetch("/api/sessions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                campaign_id: Tt.id,
                name: T.sessionSeed.title || "Session 0",
                description: T.sessionSeed.objectives,
                notes: T.sessionSeed.summary,
                session_date: (/* @__PURE__ */ new Date()).toISOString(),
                status: "Planned"
              })
            });
            if (!zt.ok) {
              const Vn = await zt.text();
              throw new Error(Vn || `Failed to create session seed (${zt.status})`);
            }
          } catch (zt) {
            console.error("Failed to create session seed", zt), Ut.push("Session seed could not be created automatically.");
          }
        Dn(), (ke = (B = window.ShadowmasterLegacyApp) == null ? void 0 : B.loadCampaigns) == null || ke.call(B), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), E == null || E(Tt), Fe(!1), hn({
          type: "success",
          title: `${Vt} created`,
          description: "Campaign is ready for onboarding."
        }), Ut.length > 0 && hn({
          type: "warning",
          title: "Campaign created with warnings",
          description: Ut.join(`
`)
        });
      } catch (tt) {
        const Vt = tt instanceof Error ? tt.message : "Failed to create campaign.";
        he(Vt), hn({
          type: "error",
          title: "Campaign creation failed",
          description: Vt
        });
      } finally {
        pt(!1);
      }
    }
  }
  const Lr = ue[le], _e = () => {
    var Te;
    switch (Be) {
      case 0:
        return /* @__PURE__ */ p.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "Campaign Essentials" }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { htmlFor: "campaign-name", children: "Campaign Name" }),
              /* @__PURE__ */ p.jsx(
                "input",
                {
                  id: "campaign-name",
                  name: "campaign-name",
                  value: T.name,
                  onChange: (B) => M({ type: "UPDATE_FIELD", field: "name", value: B.target.value }),
                  required: !0,
                  placeholder: "Enter campaign title"
                }
              )
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { htmlFor: "campaign-theme", children: "Theme / Tagline" }),
              /* @__PURE__ */ p.jsx(
                "input",
                {
                  id: "campaign-theme",
                  name: "campaign-theme",
                  value: T.theme,
                  onChange: (B) => M({ type: "UPDATE_FIELD", field: "theme", value: B.target.value }),
                  placeholder: "e.g., Neo-Tokyo corporate intrigue"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { htmlFor: "campaign-edition", children: "Edition" }),
              /* @__PURE__ */ p.jsx(
                "select",
                {
                  id: "campaign-edition",
                  name: "campaign-edition",
                  value: z,
                  onChange: (B) => {
                    const ke = B.target.value;
                    ge(ke), g(ke), vt([av(ke)]), Et(!1), Hn(null), D(ke);
                  },
                  children: Da.map((B) => /* @__PURE__ */ p.jsx("option", { value: B.value, children: B.label }, B.value))
                }
              )
            ] }),
            te.length > 0 && /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { htmlFor: "campaign-gameplay-level", children: "Gameplay Level" }),
              /* @__PURE__ */ p.jsx(
                "select",
                {
                  id: "campaign-gameplay-level",
                  name: "campaign-gameplay-level",
                  value: Ee,
                  onChange: (B) => Se(B.target.value),
                  children: te.map((B) => /* @__PURE__ */ p.jsx("option", { value: B.value, children: B.label }, B.value))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ p.jsx("label", { htmlFor: "campaign-creation-method", children: "Character Creation Method" }),
            /* @__PURE__ */ p.jsx(
              "select",
              {
                id: "campaign-creation-method",
                name: "campaign-creation-method",
                value: le,
                onChange: (B) => se(B.target.value),
                children: je.map((B) => /* @__PURE__ */ p.jsx("option", { value: B.value, children: B.label }, B.value))
              }
            ),
            /* @__PURE__ */ p.jsxs("div", { className: "form-help", children: [
              (Lr == null ? void 0 : Lr.description) && /* @__PURE__ */ p.jsx("p", { children: Lr.description }),
              le !== "priority" && /* @__PURE__ */ p.jsx("p", { children: "Support for Sum-to-Ten and Karma methods is still under development. Characters will temporarily default to Priority until the new workflows are implemented." })
            ] })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { className: "collapsible", children: [
            /* @__PURE__ */ p.jsxs(
              "button",
              {
                type: "button",
                className: "collapsible__trigger",
                "aria-expanded": mt,
                onClick: () => Et((B) => !B),
                children: [
                  /* @__PURE__ */ p.jsx("span", { children: "Source Books" }),
                  /* @__PURE__ */ p.jsx("span", { className: "collapsible__chevron", "aria-hidden": "true", children: mt ? "▾" : "▸" })
                ]
              }
            ),
            /* @__PURE__ */ p.jsxs(
              "div",
              {
                className: `collapsible__content ${mt ? "collapsible__content--open" : ""}`,
                "aria-live": "polite",
                children: [
                  /* @__PURE__ */ p.jsxs("p", { className: "form-help", children: [
                    "Enable the references that should be legal at your table. ",
                    Ht,
                    " is always required and stays selected."
                  ] }),
                  Cn && /* @__PURE__ */ p.jsx("p", { className: "form-warning", children: Cn }),
                  _t ? /* @__PURE__ */ p.jsx("p", { className: "form-help", children: "Loading books…" }) : /* @__PURE__ */ p.jsx("div", { className: "book-checkboxes", children: Oe.map((B) => {
                    const ke = B.code.toUpperCase(), tt = St.includes(ke), Vt = ke === Ht;
                    return /* @__PURE__ */ p.jsxs("label", { className: `book-checkbox ${Vt ? "book-checkbox--locked" : ""}`, children: [
                      /* @__PURE__ */ p.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: tt,
                          disabled: Vt,
                          onChange: (Nt) => {
                            const jt = Nt.target.checked;
                            vt((Tt) => {
                              const Ut = new Set(Tt.map((zt) => zt.toUpperCase()));
                              return jt ? Ut.add(ke) : Ut.delete(ke), Ut.has(Ht) || Ut.add(Ht), Array.from(Ut).sort();
                            });
                          }
                        }
                      ),
                      /* @__PURE__ */ p.jsxs("div", { children: [
                        /* @__PURE__ */ p.jsx("strong", { children: B.name }),
                        /* @__PURE__ */ p.jsx("span", { className: "book-code", children: ke })
                      ] })
                    ] }, ke);
                  }) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ p.jsx("label", { htmlFor: "campaign-gm", children: "Gamemaster" }),
            /* @__PURE__ */ p.jsx(
              "select",
              {
                id: "campaign-gm",
                name: "campaign-gm",
                value: Le,
                onChange: (B) => oe(B.target.value),
                children: _r.map((B) => /* @__PURE__ */ p.jsx("option", { value: B.value, children: B.label }, B.value))
              }
            )
          ] }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ p.jsx("label", { htmlFor: "campaign-description", children: "Campaign Overview" }),
            /* @__PURE__ */ p.jsx(
              "textarea",
              {
                id: "campaign-description",
                name: "campaign-description",
                value: T.description,
                onChange: (B) => M({ type: "UPDATE_FIELD", field: "description", value: B.target.value }),
                placeholder: "Summarize the campaign's premise, tone, and key hooks.",
                rows: 4
              }
            )
          ] })
        ] });
      case 1:
        return /* @__PURE__ */ p.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "Roster & Roles" }),
          /* @__PURE__ */ p.jsx("p", { children: "Attach existing player characters or create placeholders to represent expected runners." }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ p.jsx("label", { htmlFor: "campaign-players", children: "Existing Characters" }),
            X.length === 0 ? /* @__PURE__ */ p.jsx("p", { className: "form-help", children: "No characters found yet. You can create placeholders below." }) : /* @__PURE__ */ p.jsx("div", { className: "character-checkboxes", children: X.map((B) => {
              const ke = B.player_name ? `${B.name} — ${B.player_name}` : B.name, tt = T.selectedPlayers.includes(B.id);
              return /* @__PURE__ */ p.jsxs("label", { className: "character-checkbox", children: [
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: tt,
                    onChange: (Vt) => {
                      M({
                        type: "UPDATE_FIELD",
                        field: "selectedPlayers",
                        value: Vt.target.checked ? [...T.selectedPlayers, B.id] : T.selectedPlayers.filter((Nt) => Nt !== B.id)
                      });
                    }
                  }
                ),
                /* @__PURE__ */ p.jsx("span", { children: ke }),
                B.status && /* @__PURE__ */ p.jsx("small", { className: "character-status", children: B.status })
              ] }, B.id);
            }) })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ p.jsx("label", { children: "Player Characters" }),
            /* @__PURE__ */ p.jsx("p", { className: "form-help", children: "Player selection is coming soon. Use placeholders to capture your expected team composition." }),
            /* @__PURE__ */ p.jsxs("div", { className: "placeholder-list", children: [
              T.placeholders.map((B) => /* @__PURE__ */ p.jsxs("div", { className: "placeholder-card", children: [
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    value: B.name,
                    onChange: (ke) => M({
                      type: "UPDATE_PLACEHOLDER",
                      id: B.id,
                      field: "name",
                      value: ke.target.value
                    }),
                    placeholder: "Runner handle"
                  }
                ),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    value: B.role,
                    onChange: (ke) => M({
                      type: "UPDATE_PLACEHOLDER",
                      id: B.id,
                      field: "role",
                      value: ke.target.value
                    }),
                    placeholder: "Role / specialty"
                  }
                ),
                /* @__PURE__ */ p.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-link",
                    onClick: () => M({ type: "REMOVE_PLACEHOLDER", id: B.id }),
                    children: "Remove"
                  }
                )
              ] }, B.id)),
              /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: () => M({ type: "ADD_PLACEHOLDER" }), children: "Add Placeholder" })
            ] })
          ] })
        ] });
      case 2:
        return /* @__PURE__ */ p.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "World Backbone" }),
          /* @__PURE__ */ p.jsx("p", { children: "Capture recurring factions and key locations to anchor your campaign." }),
          Me && /* @__PURE__ */ p.jsx("p", { className: "form-error", children: Me }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { children: "Factions" }),
              /* @__PURE__ */ p.jsxs("div", { className: "backbone-list", children: [
                T.factions.map((B) => /* @__PURE__ */ p.jsxs("div", { className: "backbone-card", children: [
                  /* @__PURE__ */ p.jsx(
                    "input",
                    {
                      value: B.name,
                      onChange: (ke) => M({
                        type: "UPDATE_FACTION",
                        id: B.id,
                        field: "name",
                        value: ke.target.value
                      }),
                      placeholder: "Faction name"
                    }
                  ),
                  /* @__PURE__ */ p.jsx(
                    "input",
                    {
                      value: B.tags,
                      onChange: (ke) => M({
                        type: "UPDATE_FACTION",
                        id: B.id,
                        field: "tags",
                        value: ke.target.value
                      }),
                      placeholder: "Tags (corp, gang, fixer...)"
                    }
                  ),
                  /* @__PURE__ */ p.jsx(
                    "textarea",
                    {
                      value: B.notes,
                      onChange: (ke) => M({
                        type: "UPDATE_FACTION",
                        id: B.id,
                        field: "notes",
                        value: ke.target.value
                      }),
                      placeholder: "Notes / agenda"
                    }
                  ),
                  /* @__PURE__ */ p.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn-link",
                      onClick: () => M({ type: "REMOVE_FACTION", id: B.id }),
                      children: "Remove"
                    }
                  )
                ] }, B.id)),
                /* @__PURE__ */ p.jsxs("div", { className: "backbone-actions", children: [
                  /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: () => M({ type: "ADD_FACTION" }), children: "Add Faction" }),
                  /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-link", onClick: Nn, children: "Quick-add template" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { children: "Locations" }),
              /* @__PURE__ */ p.jsxs("div", { className: "backbone-list", children: [
                T.locations.map((B) => /* @__PURE__ */ p.jsxs("div", { className: "backbone-card", children: [
                  /* @__PURE__ */ p.jsx(
                    "input",
                    {
                      value: B.name,
                      onChange: (ke) => M({
                        type: "UPDATE_LOCATION",
                        id: B.id,
                        field: "name",
                        value: ke.target.value
                      }),
                      placeholder: "Location name"
                    }
                  ),
                  /* @__PURE__ */ p.jsx(
                    "textarea",
                    {
                      value: B.descriptor,
                      onChange: (ke) => M({
                        type: "UPDATE_LOCATION",
                        id: B.id,
                        field: "descriptor",
                        value: ke.target.value
                      }),
                      placeholder: "Descriptor (security rating, vibe...)"
                    }
                  ),
                  /* @__PURE__ */ p.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn-link",
                      onClick: () => M({ type: "REMOVE_LOCATION", id: B.id }),
                      children: "Remove"
                    }
                  )
                ] }, B.id)),
                /* @__PURE__ */ p.jsxs("div", { className: "backbone-actions", children: [
                  /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: () => M({ type: "ADD_LOCATION" }), children: "Add Location" }),
                  /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-link", onClick: ar, children: "Quick-add template" })
                ] })
              ] })
            ] })
          ] })
        ] });
      case 3:
        return /* @__PURE__ */ p.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "House Rules & Automation" }),
          /* @__PURE__ */ p.jsx("p", { children: "Toggle planned automation modules or make notes about house rules you plan to apply." }),
          /* @__PURE__ */ p.jsx("div", { className: "automation-grid", children: FD.map((B) => /* @__PURE__ */ p.jsxs("label", { className: "automation-toggle", children: [
            /* @__PURE__ */ p.jsx(
              "input",
              {
                type: "checkbox",
                checked: !!T.houseRules[B.key],
                onChange: (ke) => M({
                  type: "UPDATE_HOUSE_RULE",
                  key: B.key,
                  value: ke.target.checked
                })
              }
            ),
            /* @__PURE__ */ p.jsxs("div", { children: [
              /* @__PURE__ */ p.jsx("strong", { children: B.label }),
              /* @__PURE__ */ p.jsx("p", { children: B.description })
            ] })
          ] }, B.key)) }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ p.jsx("label", { htmlFor: "house-rule-notes", children: "House Rule Notes" }),
            /* @__PURE__ */ p.jsx(
              "textarea",
              {
                id: "house-rule-notes",
                value: T.houseRuleNotes,
                onChange: (B) => M({ type: "UPDATE_FIELD", field: "houseRuleNotes", value: B.target.value }),
                placeholder: "Describe any custom rules, optional modules, or reminders.",
                rows: 4
              }
            )
          ] })
        ] });
      case 4:
        return /* @__PURE__ */ p.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "Session Seed" }),
          /* @__PURE__ */ p.jsxs("label", { className: "skip-toggle", children: [
            /* @__PURE__ */ p.jsx(
              "input",
              {
                type: "checkbox",
                checked: T.sessionSeed.skip,
                onChange: (B) => M({
                  type: "UPDATE_SESSION_SEED",
                  field: "skip",
                  value: B.target.checked
                })
              }
            ),
            "Skip session setup for now"
          ] }),
          !T.sessionSeed.skip && /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { htmlFor: "session-title", children: "Session Title" }),
              /* @__PURE__ */ p.jsx(
                "input",
                {
                  id: "session-title",
                  value: T.sessionSeed.title,
                  onChange: (B) => M({
                    type: "UPDATE_SESSION_SEED",
                    field: "title",
                    value: B.target.value
                  }),
                  placeholder: "Session 0: The job offer"
                }
              )
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { htmlFor: "session-objectives", children: "Objectives / Notes" }),
              /* @__PURE__ */ p.jsx(
                "textarea",
                {
                  id: "session-objectives",
                  value: T.sessionSeed.objectives,
                  onChange: (B) => M({
                    type: "UPDATE_SESSION_SEED",
                    field: "objectives",
                    value: B.target.value
                  }),
                  placeholder: "List your opening beats, key NPCs, or complications.",
                  rows: 4
                }
              )
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { children: "Scene Template" }),
              /* @__PURE__ */ p.jsx("div", { className: "session-template-options", children: PD.map((B) => /* @__PURE__ */ p.jsxs("label", { className: "session-template", children: [
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    type: "radio",
                    name: "session-template",
                    value: B.value,
                    checked: T.sessionSeed.sceneTemplate === B.value,
                    onChange: (ke) => M({
                      type: "UPDATE_SESSION_SEED",
                      field: "sceneTemplate",
                      value: ke.target.value
                    })
                  }
                ),
                /* @__PURE__ */ p.jsxs("div", { children: [
                  /* @__PURE__ */ p.jsx("strong", { children: B.label }),
                  /* @__PURE__ */ p.jsx("p", { children: B.description })
                ] })
              ] }, B.value)) })
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { htmlFor: "session-summary", children: "Session Summary (what happened)" }),
              /* @__PURE__ */ p.jsx(
                "textarea",
                {
                  id: "session-summary",
                  value: T.sessionSeed.summary,
                  onChange: (B) => M({
                    type: "UPDATE_SESSION_SEED",
                    field: "summary",
                    value: B.target.value
                  }),
                  placeholder: "Quick notes on outcomes once the session wraps.",
                  rows: 3
                }
              )
            ] })
          ] })
        ] });
      case 5:
        return /* @__PURE__ */ p.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "Review & Launch" }),
          /* @__PURE__ */ p.jsxs("div", { className: "review-grid", children: [
            /* @__PURE__ */ p.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ p.jsx("h5", { children: "Campaign Overview" }),
              /* @__PURE__ */ p.jsxs("ul", { children: [
                /* @__PURE__ */ p.jsxs("li", { children: [
                  /* @__PURE__ */ p.jsx("strong", { children: "Name:" }),
                  " ",
                  T.name || "—"
                ] }),
                /* @__PURE__ */ p.jsxs("li", { children: [
                  /* @__PURE__ */ p.jsx("strong", { children: "Theme:" }),
                  " ",
                  T.theme || "—"
                ] }),
                /* @__PURE__ */ p.jsxs("li", { children: [
                  /* @__PURE__ */ p.jsx("strong", { children: "Edition:" }),
                  " ",
                  z.toUpperCase()
                ] }),
                /* @__PURE__ */ p.jsxs("li", { children: [
                  /* @__PURE__ */ p.jsx("strong", { children: "Gameplay Level:" }),
                  " ",
                  Ee
                ] }),
                /* @__PURE__ */ p.jsxs("li", { children: [
                  /* @__PURE__ */ p.jsx("strong", { children: "Creation Method:" }),
                  " ",
                  le
                ] }),
                /* @__PURE__ */ p.jsxs("li", { children: [
                  /* @__PURE__ */ p.jsx("strong", { children: "Source Books:" }),
                  " ",
                  cr.length > 0 ? cr.join(", ") : Ht
                ] }),
                /* @__PURE__ */ p.jsxs("li", { children: [
                  /* @__PURE__ */ p.jsx("strong", { children: "GM:" }),
                  " ",
                  ((Te = _r.find((B) => B.value === Le)) == null ? void 0 : Te.label) ?? "Unassigned"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ p.jsx("h5", { children: "Roster & World" }),
              /* @__PURE__ */ p.jsxs("p", { children: [
                /* @__PURE__ */ p.jsx("strong", { children: "Placeholders:" }),
                " ",
                T.placeholders.length,
                " ",
                T.placeholders.length > 0 && `(${T.placeholders.map((B) => B.name).join(", ")})`
              ] }),
              /* @__PURE__ */ p.jsxs("p", { children: [
                /* @__PURE__ */ p.jsx("strong", { children: "Factions:" }),
                " ",
                T.factions.length
              ] }),
              /* @__PURE__ */ p.jsxs("p", { children: [
                /* @__PURE__ */ p.jsx("strong", { children: "Locations:" }),
                " ",
                T.locations.length
              ] })
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ p.jsx("h5", { children: "Automation & Session" }),
              /* @__PURE__ */ p.jsxs("p", { children: [
                /* @__PURE__ */ p.jsx("strong", { children: "Automation toggles:" }),
                " ",
                Object.entries(T.houseRules).filter(([, B]) => B).map(([B]) => B.replace(/_/g, " ")).join(", ") || "None"
              ] }),
              /* @__PURE__ */ p.jsxs("p", { children: [
                /* @__PURE__ */ p.jsx("strong", { children: "House rule notes:" }),
                " ",
                T.houseRuleNotes || "—"
              ] }),
              /* @__PURE__ */ p.jsxs("p", { children: [
                /* @__PURE__ */ p.jsx("strong", { children: "Session seed:" }),
                " ",
                T.sessionSeed.skip ? "Skipped for now" : `${T.sessionSeed.title} (${T.sessionSeed.sceneTemplate})`
              ] }),
              !T.sessionSeed.skip && T.sessionSeed.objectives && /* @__PURE__ */ p.jsxs("p", { children: [
                /* @__PURE__ */ p.jsx("strong", { children: "Objectives:" }),
                " ",
                T.sessionSeed.objectives
              ] })
            ] })
          ] })
        ] });
      default:
        return null;
    }
  }, Xe = Be === 0, wt = Be === Xn - 1;
  return ae ? pl.createPortal(
    /* @__PURE__ */ p.jsx(
      "section",
      {
        className: `campaign-create-react ${re ? "campaign-create-react--open" : "campaign-create-react--collapsed"}`,
        children: re ? /* @__PURE__ */ p.jsxs("div", { className: "campaign-wizard", children: [
          /* @__PURE__ */ p.jsxs("div", { className: "campaign-wizard__header", children: [
            /* @__PURE__ */ p.jsx("h3", { children: "Create Campaign" }),
            /* @__PURE__ */ p.jsx("nav", { className: "campaign-wizard__navigation", "aria-label": "Campaign creation steps", children: wE.map((Te, B) => /* @__PURE__ */ p.jsxs(
              "button",
              {
                type: "button",
                className: `campaign-wizard__step ${Be === B ? "campaign-wizard__step--active" : ""} ${Be > B ? "campaign-wizard__step--completed" : ""}`,
                onClick: () => Re(B),
                children: [
                  /* @__PURE__ */ p.jsx("span", { className: "campaign-wizard__step-index", children: B + 1 }),
                  /* @__PURE__ */ p.jsx("span", { children: Te })
                ]
              },
              Te
            )) })
          ] }),
          /* @__PURE__ */ p.jsxs("form", { className: "campaign-wizard__form", onSubmit: ma, children: [
            _e(),
            Me && /* @__PURE__ */ p.jsx("p", { className: "form-error", children: Me }),
            /* @__PURE__ */ p.jsxs("div", { className: "campaign-wizard__actions", children: [
              /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: On, disabled: nt, children: "Cancel" }),
              /* @__PURE__ */ p.jsxs("div", { className: "campaign-wizard__actions-right", children: [
                !Xe && /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: Or, disabled: nt, children: "Back" }),
                wt ? /* @__PURE__ */ p.jsx("button", { type: "submit", className: "btn-primary", disabled: nt, children: nt ? "Creating…" : "Create Campaign" }) : /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-primary", onClick: ha, disabled: nt, children: "Next" })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ p.jsxs("div", { className: "campaign-create-trigger", children: [
          /* @__PURE__ */ p.jsxs("div", { className: "campaign-create-trigger__copy", children: [
            /* @__PURE__ */ p.jsx("h3", { children: "Plan Your Next Campaign" }),
            /* @__PURE__ */ p.jsx("p", { children: "Select an edition, assign a GM, and lock in gameplay defaults." })
          ] }),
          /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-primary", onClick: xn, children: "Create Campaign" })
        ] })
      }
    ),
    ae
  ) : null;
}
function BD(C, E, b) {
  const q = b === "asc" ? 1 : -1, ee = (ae) => ae instanceof Date ? ae.getTime() : typeof ae == "number" ? ae : typeof ae == "boolean" ? ae ? 1 : 0 : ae == null ? "" : String(ae).toLowerCase(), D = ee(C), g = ee(E);
  return D < g ? -1 * q : D > g ? 1 * q : 0;
}
function ID({
  columns: C,
  data: E,
  getRowId: b,
  loading: q = !1,
  emptyState: ee,
  enableSearch: D = !0,
  searchPlaceholder: g = "Search…",
  initialSortKey: ae,
  initialSortDirection: L = "asc",
  rowClassName: z
}) {
  var Se, le;
  const ge = A.useMemo(
    () => C.filter((se) => se.sortable),
    [C]
  ), P = ae ?? ((Se = ge[0]) == null ? void 0 : Se.key) ?? ((le = C[0]) == null ? void 0 : le.key) ?? "", [G, te] = A.useState(P), [ne, X] = A.useState(L), [fe, Le] = A.useState(""), oe = A.useMemo(() => {
    const se = C.filter((be) => be.searchable !== !1), U = E.filter((be) => !D || !fe.trim() ? !0 : se.some((je) => {
      const Je = je.accessor, re = Je ? Je(be) : be[je.key];
      return re == null ? !1 : String(re).toLowerCase().includes(fe.toLowerCase());
    }));
    if (!G)
      return U;
    const pe = C.find((be) => be.key === G);
    if (!pe)
      return U;
    const ue = pe.accessor;
    return [...U].sort((be, je) => {
      const Je = ue ? ue(be) : be[G], re = ue ? ue(je) : je[G];
      return BD(Je, re, ne);
    });
  }, [C, E, D, fe, ne, G]);
  function Ee(se) {
    G === se ? X((U) => U === "asc" ? "desc" : "asc") : (te(se), X("asc"));
  }
  return /* @__PURE__ */ p.jsxs("div", { className: "data-table-wrapper", children: [
    D && C.length > 0 && /* @__PURE__ */ p.jsx("div", { className: "data-table-toolbar", children: /* @__PURE__ */ p.jsx(
      "input",
      {
        type: "search",
        placeholder: g,
        value: fe,
        onChange: (se) => Le(se.target.value),
        "aria-label": "Search table"
      }
    ) }),
    /* @__PURE__ */ p.jsx("div", { className: "data-table-container", children: /* @__PURE__ */ p.jsxs("table", { className: "data-table", children: [
      /* @__PURE__ */ p.jsx("thead", { children: /* @__PURE__ */ p.jsx("tr", { children: C.map((se) => {
        const U = se.sortable !== !1, pe = se.key === G;
        return /* @__PURE__ */ p.jsxs(
          "th",
          {
            style: { width: se.width },
            className: [
              se.align ? `align-${se.align}` : "",
              U ? "sortable" : "",
              pe ? `sorted-${ne}` : ""
            ].filter(Boolean).join(" "),
            onClick: () => {
              U && Ee(se.key);
            },
            children: [
              /* @__PURE__ */ p.jsx("span", { children: se.header }),
              U && /* @__PURE__ */ p.jsx("span", { className: "sort-indicator", "aria-hidden": "true", children: pe ? ne === "asc" ? "▲" : "▼" : "↕" })
            ]
          },
          se.key
        );
      }) }) }),
      /* @__PURE__ */ p.jsx("tbody", { children: q ? /* @__PURE__ */ p.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ p.jsx("td", { colSpan: C.length, children: "Loading…" }) }) : oe.length === 0 ? /* @__PURE__ */ p.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ p.jsx("td", { colSpan: C.length, children: ee || "No records found." }) }) : oe.map((se, U) => /* @__PURE__ */ p.jsx("tr", { className: z == null ? void 0 : z(se), children: C.map((pe) => /* @__PURE__ */ p.jsx("td", { className: pe.align ? `align-${pe.align}` : void 0, children: pe.render ? pe.render(se) : se[pe.key] }, pe.key)) }, b(se, U))) })
    ] }) })
  ] });
}
function $D(C) {
  if (!C)
    return "—";
  const E = Date.parse(C);
  return Number.isNaN(E) ? C : new Date(E).toLocaleDateString();
}
function YD({
  campaigns: C,
  loading: E,
  error: b,
  onEdit: q,
  onDelete: ee,
  currentUser: D,
  actionInFlightId: g
}) {
  const ae = A.useMemo(
    () => [
      {
        key: "name",
        header: "Campaign",
        sortable: !0,
        accessor: (L) => L.name
      },
      {
        key: "edition",
        header: "Edition",
        sortable: !0,
        accessor: (L) => L.edition.toUpperCase()
      },
      {
        key: "gameplay_level",
        header: "Gameplay Level",
        sortable: !0,
        accessor: (L) => L.gameplay_level ?? "",
        render: (L) => {
          var z;
          return ((z = L.gameplay_level) == null ? void 0 : z.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "creation_method",
        header: "Creation Method",
        sortable: !0,
        accessor: (L) => L.creation_method,
        render: (L) => {
          var z;
          return ((z = L.creation_method) == null ? void 0 : z.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "gm_name",
        header: "Gamemaster",
        sortable: !0,
        accessor: (L) => L.gm_name ?? "",
        render: (L) => L.gm_name ?? "—"
      },
      {
        key: "status",
        header: "Status",
        sortable: !0,
        accessor: (L) => L.status ?? "",
        render: (L) => /* @__PURE__ */ p.jsx("span", { className: `status-badge status-${(L.status ?? "unknown").toLowerCase()}`, children: L.status ?? "—" })
      },
      {
        key: "updated_at",
        header: "Updated",
        sortable: !0,
        accessor: (L) => L.updated_at ? new Date(L.updated_at) : null,
        render: (L) => $D(L.updated_at)
      },
      {
        key: "actions",
        header: "Actions",
        sortable: !1,
        align: "right",
        render: (L) => {
          var te, ne, X;
          const z = L.can_edit || L.can_delete || (D == null ? void 0 : D.isAdministrator) || L.gm_user_id && ((te = D == null ? void 0 : D.user) == null ? void 0 : te.id) === L.gm_user_id, ge = g === L.id, P = (L.can_edit ?? !1) || (D == null ? void 0 : D.isAdministrator) || L.gm_user_id && ((ne = D == null ? void 0 : D.user) == null ? void 0 : ne.id) === L.gm_user_id, G = (L.can_delete ?? !1) || (D == null ? void 0 : D.isAdministrator) || L.gm_user_id && ((X = D == null ? void 0 : D.user) == null ? void 0 : X.id) === L.gm_user_id;
          return /* @__PURE__ */ p.jsxs("div", { className: "table-actions", children: [
            /* @__PURE__ */ p.jsx(
              "button",
              {
                type: "button",
                className: "button button--table",
                onClick: () => q(L),
                disabled: ge || !z || !P,
                children: "Edit"
              }
            ),
            /* @__PURE__ */ p.jsx(
              "button",
              {
                type: "button",
                className: "button button--table button--danger",
                onClick: () => ee(L),
                disabled: ge || !z || !G,
                children: "Delete"
              }
            )
          ] });
        }
      }
    ],
    [g, D, ee, q]
  );
  return /* @__PURE__ */ p.jsxs("div", { className: "campaign-table", children: [
    b && /* @__PURE__ */ p.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: b }),
    /* @__PURE__ */ p.jsx(
      ID,
      {
        columns: ae,
        data: C,
        loading: E,
        getRowId: (L) => L.id,
        emptyState: "No campaigns yet. Create one to get started!",
        searchPlaceholder: "Search campaigns…"
      }
    )
  ] });
}
const QD = ["Active", "Paused", "Completed"];
function WD({ campaign: C, gmUsers: E, gameplayRules: b, onClose: q, onSave: ee }) {
  const { loadCampaignCharacterCreation: D } = Kf(), [g, ae] = A.useState(C.name), [L, z] = A.useState(C.gm_user_id ?? ""), [ge, P] = A.useState(C.status ?? "Active"), [G, te] = A.useState(C.house_rules ?? ""), [ne, X] = A.useState(C.gameplay_level ?? "experienced"), [fe, Le] = A.useState(!1), [oe, Ee] = A.useState(null), Se = A.useMemo(() => E.length === 0 ? [{ label: "No gamemasters found", value: "" }] : E.map((U) => ({
    label: `${U.username} (${U.email})`,
    value: U.id
  })), [E]);
  A.useEffect(() => {
    ae(C.name), z(C.gm_user_id ?? ""), P(C.status ?? "Active"), te(C.house_rules ?? ""), X(C.gameplay_level ?? "experienced");
  }, [C]);
  const le = fe || g.trim().length === 0 || E.length > 0 && !L;
  async function se(U) {
    if (U.preventDefault(), !le) {
      Le(!0), Ee(null);
      try {
        const pe = E.find((ue) => ue.id === L);
        await ee({
          name: g.trim(),
          gm_user_id: L || void 0,
          gm_name: (pe == null ? void 0 : pe.username) ?? (pe == null ? void 0 : pe.email) ?? "",
          status: ge,
          house_rules: G,
          gameplay_level: ne
        }), await D(C.id), q();
      } catch (pe) {
        const ue = pe instanceof Error ? pe.message : "Failed to update campaign.";
        Ee(ue);
      } finally {
        Le(!1);
      }
    }
  }
  return /* @__PURE__ */ p.jsx("div", { className: "modal", style: { display: "block" }, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ p.jsxs("div", { className: "modal-content", children: [
    /* @__PURE__ */ p.jsxs("header", { className: "modal-header", children: [
      /* @__PURE__ */ p.jsx("h3", { children: "Edit Campaign" }),
      /* @__PURE__ */ p.jsx("button", { type: "button", className: "modal-close", onClick: q, "aria-label": "Close edit campaign form", children: "×" })
    ] }),
    /* @__PURE__ */ p.jsxs("form", { className: "campaign-form", onSubmit: se, children: [
      /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ p.jsx("label", { htmlFor: "edit-campaign-name", children: "Campaign Name" }),
        /* @__PURE__ */ p.jsx(
          "input",
          {
            id: "edit-campaign-name",
            name: "campaign-name",
            value: g,
            onChange: (U) => ae(U.target.value),
            required: !0
          }
        )
      ] }),
      /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ p.jsx("label", { htmlFor: "edit-campaign-gm", children: "Gamemaster" }),
        /* @__PURE__ */ p.jsx(
          "select",
          {
            id: "edit-campaign-gm",
            name: "campaign-gm",
            value: L,
            onChange: (U) => z(U.target.value),
            children: Se.map((U) => /* @__PURE__ */ p.jsx("option", { value: U.value, children: U.label }, U.value))
          }
        )
      ] }),
      /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ p.jsx("label", { htmlFor: "edit-campaign-status", children: "Status" }),
        /* @__PURE__ */ p.jsx(
          "select",
          {
            id: "edit-campaign-status",
            name: "campaign-status",
            value: ge,
            onChange: (U) => P(U.target.value),
            children: QD.map((U) => /* @__PURE__ */ p.jsx("option", { value: U, children: U }, U))
          }
        )
      ] }),
      /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ p.jsx("label", { htmlFor: "edit-campaign-gameplay-level", children: "Gameplay Level" }),
        /* @__PURE__ */ p.jsx(
          "select",
          {
            id: "edit-campaign-gameplay-level",
            name: "campaign-gameplay-level",
            value: ne,
            onChange: (U) => X(U.target.value),
            children: /* @__PURE__ */ p.jsx("option", { value: C.gameplay_level ?? "experienced", children: (b == null ? void 0 : b.label) || C.gameplay_level || "Experienced" })
          }
        ),
        /* @__PURE__ */ p.jsx("small", { children: "Gameplay level selections are constrained by the active edition." })
      ] }),
      /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ p.jsx("label", { htmlFor: "edit-campaign-house-rules", children: "House Rules" }),
        /* @__PURE__ */ p.jsx(
          "textarea",
          {
            id: "edit-campaign-house-rules",
            name: "campaign-house-rules",
            rows: 3,
            value: G,
            onChange: (U) => te(U.target.value)
          }
        )
      ] }),
      oe && /* @__PURE__ */ p.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: oe }),
      /* @__PURE__ */ p.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ p.jsx("button", { type: "button", className: "button button--secondary", onClick: q, children: "Cancel" }),
        /* @__PURE__ */ p.jsx("button", { type: "submit", className: "button button--primary", disabled: le, children: fe ? "Saving…" : "Save Changes" })
      ] })
    ] })
  ] }) });
}
const GD = "campaigns-list";
async function ty(C, E = {}) {
  const b = new Headers(E.headers || {});
  E.body && !b.has("Content-Type") && b.set("Content-Type", "application/json");
  const q = await fetch(C, {
    ...E,
    headers: b,
    credentials: "include"
  });
  if (!q.ok) {
    const ee = await q.text();
    throw new Error(ee || `Request failed (${q.status})`);
  }
  return q.status === 204 ? {} : await q.json();
}
function KD({ targetId: C = GD }) {
  const [E, b] = A.useState(null), [q, ee] = A.useState([]), [D, g] = A.useState(!1), [ae, L] = A.useState(null), [z, ge] = A.useState(null), [P, G] = A.useState(null), [te, ne] = A.useState(null), [X, fe] = A.useState(null), [Le, oe] = A.useState([]), [Ee, Se] = A.useState(
    window.ShadowmasterAuth ?? null
  );
  A.useEffect(() => {
    b(document.getElementById(C));
  }, [C]), A.useEffect(() => (document.body.classList.add("react-campaign-enabled"), () => {
    document.body.classList.remove("react-campaign-enabled");
  }), []);
  const le = A.useCallback(async () => {
    g(!0), L(null);
    try {
      const ue = await ty("/api/campaigns");
      ee(Array.isArray(ue) ? ue : []);
    } catch (ue) {
      const be = ue instanceof Error ? ue.message : "Failed to load campaigns.";
      L(be), ee([]);
    } finally {
      g(!1);
    }
  }, []), se = A.useCallback(async () => {
    try {
      const ue = await ty("/api/users?role=gamemaster,administrator");
      oe(Array.isArray(ue) ? ue : []);
    } catch (ue) {
      console.warn("Failed to load gamemaster roster", ue), oe([]);
    }
  }, []);
  A.useEffect(() => {
    le(), se();
  }, [le, se]), A.useEffect(() => {
    const ue = () => {
      le();
    };
    return window.addEventListener("shadowmaster:campaigns:refresh", ue), () => {
      window.removeEventListener("shadowmaster:campaigns:refresh", ue);
    };
  }, [le]), A.useEffect(() => (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
    loadCampaigns: () => {
      le();
    }
  }), () => {
    window.ShadowmasterLegacyApp && (window.ShadowmasterLegacyApp.loadCampaigns = void 0);
  }), [le]), A.useEffect(() => {
    const ue = (be) => {
      const je = be.detail;
      Se(je ?? null);
    };
    return window.addEventListener("shadowmaster:auth", ue), () => {
      window.removeEventListener("shadowmaster:auth", ue);
    };
  }, []), A.useEffect(() => {
    if (!P)
      return;
    const ue = window.setTimeout(() => G(null), 4e3);
    return () => window.clearTimeout(ue);
  }, [P]);
  const U = A.useCallback(
    async (ue) => {
      if (!(!ue.can_delete && !(Ee != null && Ee.isAdministrator) || !window.confirm(
        `Delete campaign "${ue.name}"? This action cannot be undone.`
      ))) {
        ge(null), G(null), ne(ue.id);
        try {
          await ty(`/api/campaigns/${ue.id}`, { method: "DELETE" }), G(`Campaign "${ue.name}" deleted.`), await le(), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh"));
        } catch (je) {
          const Je = je instanceof Error ? je.message : "Failed to delete campaign.";
          ge(Je);
        } finally {
          ne(null);
        }
      }
    },
    [Ee == null ? void 0 : Ee.isAdministrator, le]
  ), pe = A.useCallback(
    async (ue) => {
      if (X) {
        ge(null), G(null), ne(X.id);
        try {
          const be = JSON.stringify({
            name: ue.name,
            gm_name: ue.gm_name,
            gm_user_id: ue.gm_user_id,
            status: ue.status,
            house_rules: ue.house_rules,
            gameplay_level: ue.gameplay_level
          }), je = await ty(`/api/campaigns/${X.id}`, {
            method: "PUT",
            body: be
          });
          ee(
            (Je) => Je.map((re) => re.id === je.id ? je : re)
          ), G(`Campaign "${je.name}" updated.`), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), fe(null);
        } catch (be) {
          const je = be instanceof Error ? be.message : "Failed to update campaign.";
          ge(je);
        } finally {
          ne(null);
        }
      }
    },
    [X]
  );
  return E ? pl.createPortal(
    /* @__PURE__ */ p.jsxs("section", { className: "campaigns-react-shell", children: [
      P && /* @__PURE__ */ p.jsx("p", { className: "campaigns-table__status", children: P }),
      z && /* @__PURE__ */ p.jsx("p", { className: "campaigns-table__error", children: z }),
      /* @__PURE__ */ p.jsx(
        YD,
        {
          campaigns: q,
          loading: D,
          error: ae,
          onEdit: (ue) => fe(ue),
          onDelete: U,
          currentUser: Ee,
          actionInFlightId: te
        }
      ),
      X && /* @__PURE__ */ p.jsx(
        WD,
        {
          campaign: X,
          gmUsers: Le,
          gameplayRules: X.gameplay_rules,
          onClose: () => fe(null),
          onSave: pe
        }
      )
    ] }),
    E
  ) : null;
}
const ry = [
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
function qD() {
  const C = window.location.hash.replace("#", "").toLowerCase(), E = ry.find((b) => b.key === C);
  return (E == null ? void 0 : E.key) ?? "characters";
}
function XD(C) {
  A.useEffect(() => {
    ry.forEach(({ key: E, targetId: b }) => {
      const q = document.getElementById(b);
      q && (E === C ? (q.removeAttribute("hidden"), q.classList.add("main-tab-panel--active"), q.style.display = "", q.setAttribute("data-active-tab", E)) : (q.setAttribute("hidden", "true"), q.classList.remove("main-tab-panel--active"), q.style.display = "none", q.removeAttribute("data-active-tab")));
    });
  }, [C]);
}
function JD() {
  const [C, E] = A.useState(null), [b, q] = A.useState(() => qD());
  A.useEffect(() => {
    E(document.getElementById("main-navigation-root"));
  }, []), XD(b), A.useEffect(() => {
    window.history.replaceState(null, "", `#${b}`);
  }, [b]);
  const ee = A.useMemo(
    () => {
      var D;
      return ((D = ry.find((g) => g.key === b)) == null ? void 0 : D.description) ?? "";
    },
    [b]
  );
  return C ? pl.createPortal(
    /* @__PURE__ */ p.jsxs("nav", { className: "main-tabs", role: "tablist", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ p.jsx("div", { className: "main-tabs__list", children: ry.map((D) => {
        const g = D.key === b;
        return /* @__PURE__ */ p.jsx(
          "button",
          {
            role: "tab",
            id: `tab-${D.key}`,
            "aria-selected": g,
            "aria-controls": D.targetId,
            className: `main-tabs__tab${g ? " main-tabs__tab--active" : ""}`,
            onClick: () => q(D.key),
            type: "button",
            children: D.label
          },
          D.key
        );
      }) }),
      /* @__PURE__ */ p.jsx("p", { className: "main-tabs__summary", role: "status", children: ee })
    ] }),
    C
  ) : null;
}
const eo = ["magic", "metatype", "attributes", "skills", "resources"], uc = ["A", "B", "C", "D", "E"], ZD = {
  magic: "Magic",
  metatype: "Metatype",
  attributes: "Attributes",
  skills: "Skills",
  resources: "Resources"
};
function kw(C) {
  return ZD[C];
}
function Dw(C, E) {
  var q;
  const b = (q = C == null ? void 0 : C.priorities) == null ? void 0 : q[E];
  return b ? uc.map((ee) => {
    const D = b[ee] ?? { label: `Priority ${ee}` };
    return { code: ee, option: D };
  }) : uc.map((ee) => ({
    code: ee,
    option: { label: `Priority ${ee}` }
  }));
}
function e1() {
  return {
    magic: "",
    metatype: "",
    attributes: "",
    skills: "",
    resources: ""
  };
}
function Nw(C) {
  return eo.reduce((E, b) => {
    const q = C[b];
    return q && E.push(q), E;
  }, []);
}
function Cw(C) {
  const E = new Set(Nw(C));
  return uc.filter((b) => !E.has(b));
}
function t1(C) {
  return Nw(C).length === uc.length;
}
function jw(C) {
  return C ? C.summary || C.description || C.label || "" : "Drag a priority letter from the pool into this category.";
}
function n1(C) {
  if (!C)
    return "";
  const E = C.toLowerCase().trim().replace(/[\s-]+/g, "_");
  switch (E) {
    case "sumtotten":
    case "sum2ten":
    case "sum_to10":
      return "sum_to_ten";
    case "point_buy":
    case "pointbuy":
      return "karma";
    default:
      return E;
  }
}
function Ow(C) {
  return Object.fromEntries(
    Object.entries(C).map(([E, b]) => [E, b || null])
  );
}
function Lw() {
  var q, ee;
  const C = e1();
  if (typeof window > "u")
    return C;
  const E = (ee = (q = window.ShadowmasterLegacyApp) == null ? void 0 : q.getPriorities) == null ? void 0 : ee.call(q);
  if (!E)
    return C;
  const b = { ...C };
  for (const D of eo) {
    const g = E[D];
    typeof g == "string" && g.length === 1 && (b[D] = g);
  }
  return b;
}
function xw() {
  const C = Lw();
  return eo.some((b) => C[b]) || (C.magic = "A", C.metatype = "B", C.attributes = "C", C.skills = "D", C.resources = "E"), C;
}
function r1() {
  const {
    characterCreationData: C,
    activeEdition: E,
    isLoading: b,
    error: q,
    campaignGameplayRules: ee,
    campaignLoading: D,
    campaignError: g,
    campaignCreationMethod: ae
  } = Kf(), L = A.useMemo(
    () => (C == null ? void 0 : C.creation_methods) ?? {},
    [C == null ? void 0 : C.creation_methods]
  ), z = A.useMemo(() => {
    const ge = n1(ae);
    if (ge && L[ge])
      return ge;
    if (L.priority)
      return "priority";
    const P = Object.keys(L);
    return P.length > 0 ? P[0] : "priority";
  }, [ae, L]);
  return z === "sum_to_ten" && L.sum_to_ten ? /* @__PURE__ */ p.jsx(
    l1,
    {
      characterCreationData: C,
      creationMethod: L.sum_to_ten,
      activeEditionLabel: E.label,
      isLoading: b,
      error: q,
      campaignGameplayRules: ee,
      campaignLoading: D,
      campaignError: g
    }
  ) : z === "karma" && L.karma ? /* @__PURE__ */ p.jsx(
    o1,
    {
      characterCreationData: C,
      creationMethod: L.karma,
      activeEditionLabel: E.label,
      isLoading: b,
      error: q,
      campaignGameplayRules: ee,
      campaignLoading: D,
      campaignError: g
    }
  ) : /* @__PURE__ */ p.jsx(
    a1,
    {
      characterCreationData: C,
      activeEditionLabel: E.label,
      isLoading: b,
      error: q,
      campaignGameplayRules: ee,
      campaignLoading: D,
      campaignError: g
    }
  );
}
function a1({
  characterCreationData: C,
  activeEditionLabel: E,
  isLoading: b,
  error: q,
  campaignGameplayRules: ee,
  campaignLoading: D,
  campaignError: g
}) {
  const [ae, L] = A.useState(() => Lw()), [z, ge] = A.useState(null), P = A.useRef({});
  A.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), A.useEffect(() => {
    var U, pe;
    (pe = (U = window.ShadowmasterLegacyApp) == null ? void 0 : U.setPriorities) == null || pe.call(U, Ow(ae));
  }, [ae]);
  const G = A.useMemo(() => Cw(ae), [ae]), te = t1(ae);
  function ne(U) {
    L((pe) => {
      const ue = { ...pe };
      for (const be of eo)
        ue[be] === U && (ue[be] = "");
      return ue;
    });
  }
  function X(U, pe) {
    pe.dataTransfer.effectAllowed = "move", ge({ source: "pool", priority: U }), pe.dataTransfer.setData("text/plain", U);
  }
  function fe(U, pe, ue) {
    ue.dataTransfer.effectAllowed = "move", ge({ source: "dropzone", category: U, priority: pe }), ue.dataTransfer.setData("text/plain", pe);
  }
  function Le() {
    ge(null);
  }
  function oe(U, pe) {
    pe.preventDefault();
    const ue = pe.dataTransfer.getData("text/plain") || (z == null ? void 0 : z.priority) || "";
    if (!ue) {
      Le();
      return;
    }
    L((be) => {
      const je = { ...be };
      for (const Je of eo)
        je[Je] === ue && (je[Je] = "");
      return je[U] = ue, je;
    }), Le();
  }
  function Ee(U, pe) {
    pe.preventDefault();
    const ue = P.current[U];
    ue && ue.classList.add("active");
  }
  function Se(U) {
    const pe = P.current[U];
    pe && pe.classList.remove("active");
  }
  function le(U) {
    const pe = P.current[U];
    pe && pe.classList.remove("active");
  }
  function se(U) {
    const pe = G[0];
    if (!pe) {
      ne(U);
      return;
    }
    L((ue) => {
      const be = { ...ue };
      for (const je of eo)
        be[je] === U && (be[je] = "");
      return be[pe] = U, be;
    });
  }
  return /* @__PURE__ */ p.jsxs("div", { className: "react-priority-wrapper", children: [
    /* @__PURE__ */ p.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ p.jsxs("span", { children: [
        "Priority Assignment — ",
        /* @__PURE__ */ p.jsx("strong", { children: E })
      ] }),
      /* @__PURE__ */ p.jsx("span", { children: g ? `Campaign defaults unavailable: ${g}` : D ? "Applying campaign defaults…" : b ? "Loading priority data…" : q ? `Error: ${q}` : "Drag letters into categories" })
    ] }),
    ee && /* @__PURE__ */ p.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ p.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        ee.label
      ] }),
      ee.description && /* @__PURE__ */ p.jsx("p", { children: ee.description })
    ] }),
    /* @__PURE__ */ p.jsxs("div", { className: "react-priority-layout", children: [
      /* @__PURE__ */ p.jsxs("aside", { className: "react-priority-pool", children: [
        /* @__PURE__ */ p.jsx("h4", { children: "Available Priorities" }),
        /* @__PURE__ */ p.jsx(
          "div",
          {
            className: "react-priority-dropzone",
            onDragOver: (U) => {
              U.preventDefault(), ge((pe) => pe && { ...pe, category: void 0 });
            },
            onDrop: (U) => {
              U.preventDefault();
              const pe = U.dataTransfer.getData("text/plain") || (z == null ? void 0 : z.priority) || "";
              pe && ne(pe), Le();
            },
            children: /* @__PURE__ */ p.jsx("div", { className: "react-priority-chips", children: uc.map((U) => {
              const pe = !Cw(ae).includes(U), ue = (z == null ? void 0 : z.priority) === U && z.source === "pool";
              return /* @__PURE__ */ p.jsx(
                "div",
                {
                  className: `react-priority-chip ${pe ? "used" : ""} ${ue ? "dragging" : ""}`,
                  draggable: !pe,
                  onDragStart: (be) => !pe && X(U, be),
                  onDragEnd: Le,
                  onClick: () => se(U),
                  role: "button",
                  tabIndex: pe ? -1 : 0,
                  onKeyDown: (be) => {
                    !pe && (be.key === "Enter" || be.key === " ") && (be.preventDefault(), se(U));
                  },
                  children: U
                },
                U
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ p.jsx("section", { className: "react-priority-dropzones", children: eo.map((U) => {
        const pe = kw(U), ue = Dw(C, U), be = ae[U], je = ue.find((re) => re.code === be), Je = (z == null ? void 0 : z.source) === "dropzone" && z.category === U;
        return /* @__PURE__ */ p.jsxs(
          "div",
          {
            ref: (re) => {
              P.current[U] = re;
            },
            className: `react-priority-dropzone ${be ? "filled" : ""}`,
            onDragOver: (re) => Ee(U, re),
            onDragLeave: () => Se(U),
            onDrop: (re) => {
              oe(U, re), le(U);
            },
            children: [
              /* @__PURE__ */ p.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ p.jsx("span", { children: pe }),
                be && /* @__PURE__ */ p.jsxs("span", { children: [
                  be,
                  " — ",
                  (je == null ? void 0 : je.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ p.jsx("div", { className: "react-priority-description", children: jw(je == null ? void 0 : je.option) }),
              be ? /* @__PURE__ */ p.jsx(
                "div",
                {
                  className: `react-priority-chip ${Je ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (re) => fe(U, be, re),
                  onDragEnd: Le,
                  onDoubleClick: () => ne(be),
                  children: be
                }
              ) : /* @__PURE__ */ p.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          U
        );
      }) })
    ] }),
    /* @__PURE__ */ p.jsx(
      "div",
      {
        className: `react-priority-status ${te ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: te ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${G.join(", ")}`
      }
    )
  ] });
}
const i1 = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  E: 0
};
function l1({
  characterCreationData: C,
  creationMethod: E,
  activeEditionLabel: b,
  isLoading: q,
  error: ee,
  campaignGameplayRules: D,
  campaignLoading: g,
  campaignError: ae
}) {
  const [L, z] = A.useState(() => xw());
  A.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), A.useEffect(() => {
    var Se, le;
    (le = (Se = window.ShadowmasterLegacyApp) == null ? void 0 : Se.setPriorities) == null || le.call(Se, Ow(L));
  }, [L]);
  const ge = A.useMemo(() => {
    const Se = { ...i1 };
    return uc.forEach((le) => {
      var U;
      const se = (U = E.priority_costs) == null ? void 0 : U[le];
      typeof se == "number" && (Se[le] = se);
    }), Se;
  }, [E.priority_costs]), P = E.point_budget ?? 10, G = A.useMemo(() => eo.reduce((Se, le) => {
    const se = L[le];
    return Se + (se ? ge[se] ?? 0 : 0);
  }, 0), [L, ge]), te = P - G, ne = A.useMemo(
    () => eo.every((Se) => !!L[Se]),
    [L]
  ), X = ne && te === 0 ? "success" : te < 0 ? "error" : "warning", fe = ne ? te > 0 ? `Spend the remaining ${te} point${te === 1 ? "" : "s"}.` : te < 0 ? `Over budget by ${Math.abs(te)} point${Math.abs(te) === 1 ? "" : "s"}.` : "✓ All priorities assigned. You can proceed to metatype selection." : "Select a priority letter for each category.";
  function Le(Se, le) {
    z((se) => ({
      ...se,
      [Se]: le
    }));
  }
  function oe(Se, le) {
    const se = le.target.value, U = se ? se.toUpperCase() : "";
    Le(Se, U);
  }
  function Ee() {
    z(xw());
  }
  return /* @__PURE__ */ p.jsxs("div", { className: "react-priority-wrapper sum-to-ten-wrapper", children: [
    /* @__PURE__ */ p.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ p.jsxs("span", { children: [
        "Sum-to-Ten Assignment — ",
        /* @__PURE__ */ p.jsx("strong", { children: b })
      ] }),
      /* @__PURE__ */ p.jsx("span", { children: ae ? `Campaign defaults unavailable: ${ae}` : g ? "Applying campaign defaults…" : q ? "Loading priority data…" : ee ? `Error: ${ee}` : "Allocate priorities until you spend all points." })
    ] }),
    E.description && /* @__PURE__ */ p.jsx("p", { className: "sum-to-ten-description", children: E.description }),
    D && /* @__PURE__ */ p.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ p.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        D.label
      ] }),
      D.description && /* @__PURE__ */ p.jsx("p", { children: D.description })
    ] }),
    /* @__PURE__ */ p.jsx("div", { className: "sum-to-ten-grid", children: eo.map((Se) => {
      const le = kw(Se), se = Dw(C, Se), U = L[Se], pe = se.find((be) => be.code === U), ue = U ? ge[U] ?? 0 : 0;
      return /* @__PURE__ */ p.jsxs("div", { className: "sum-to-ten-card", children: [
        /* @__PURE__ */ p.jsxs("div", { className: "sum-to-ten-card__header", children: [
          /* @__PURE__ */ p.jsx("span", { children: le }),
          U && /* @__PURE__ */ p.jsxs("span", { children: [
            U,
            " · ",
            ue,
            " pts"
          ] })
        ] }),
        /* @__PURE__ */ p.jsxs("select", { value: U, onChange: (be) => oe(Se, be), children: [
          /* @__PURE__ */ p.jsx("option", { value: "", children: "Select priority" }),
          uc.map((be) => {
            const je = se.find((re) => re.code === be), Je = ge[be] ?? 0;
            return /* @__PURE__ */ p.jsx("option", { value: be, children: `${be} (${Je} pts) — ${(je == null ? void 0 : je.option.label) ?? `Priority ${be}`}` }, be);
          })
        ] }),
        /* @__PURE__ */ p.jsx("div", { className: "sum-to-ten-card__summary", children: jw(pe == null ? void 0 : pe.option) }),
        U && /* @__PURE__ */ p.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-link sum-to-ten-clear",
            onClick: () => Le(Se, ""),
            children: "Clear selection"
          }
        )
      ] }, Se);
    }) }),
    /* @__PURE__ */ p.jsx(
      "div",
      {
        className: `react-priority-status sum-to-ten-status ${X}`,
        role: "status",
        "aria-live": "polite",
        children: fe
      }
    ),
    /* @__PURE__ */ p.jsxs("div", { className: "sum-to-ten-footer", children: [
      /* @__PURE__ */ p.jsxs("span", { className: "sum-to-ten-metrics", children: [
        "Spent ",
        G,
        " / ",
        P,
        " points"
      ] }),
      /* @__PURE__ */ p.jsx("div", { className: "sum-to-ten-actions", children: /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn btn-secondary", onClick: Ee, children: "Reset to default" }) })
    ] })
  ] });
}
const iv = [
  { key: "attributes", label: "Attributes" },
  { key: "skills", label: "Skills" },
  { key: "qualities", label: "Qualities" },
  { key: "gear", label: "Gear & Lifestyle" },
  { key: "contacts", label: "Contacts" },
  { key: "other", label: "Other" }
];
function o1({
  characterCreationData: C,
  creationMethod: E,
  activeEditionLabel: b,
  isLoading: q,
  error: ee,
  campaignGameplayRules: D,
  campaignLoading: g,
  campaignError: ae
}) {
  var ue, be, je, Je;
  const L = A.useMemo(() => ((C == null ? void 0 : C.metatypes) ?? []).map((Fe) => ({
    value: Fe.id,
    label: Fe.name
  })), [C == null ? void 0 : C.metatypes]), [z, ge] = A.useState(() => {
    var re;
    return ((re = L[0]) == null ? void 0 : re.value) ?? "";
  }), [P, G] = A.useState(
    () => iv.reduce((re, Fe) => (re[Fe.key] = 0, re), {})
  );
  A.useEffect(() => {
    var Fe;
    const re = ((Fe = L[0]) == null ? void 0 : Fe.value) ?? "";
    ge((nt) => nt || re);
  }, [L]), A.useEffect(() => {
    var Fe, nt;
    const re = iv.map(({ key: pt, label: Me }) => ({
      category: pt,
      label: Me,
      karma: P[pt] ?? 0
    }));
    (nt = (Fe = window.ShadowmasterLegacyApp) == null ? void 0 : Fe.setKarmaPointBuy) == null || nt.call(Fe, {
      metatype_id: z,
      entries: re
    });
  }, [P, z]);
  const te = E.karma_budget ?? 800, ne = ((be = E.metatype_costs) == null ? void 0 : be[((ue = z == null ? void 0 : z.toLowerCase) == null ? void 0 : ue.call(z)) ?? ""]) ?? ((je = E.metatype_costs) == null ? void 0 : je.human) ?? 0, X = ne + iv.reduce((re, Fe) => re + (P[Fe.key] ?? 0), 0), fe = te - X, Le = P.gear ?? 0, oe = ((Je = E.gear_conversion) == null ? void 0 : Je.max_karma_for_gear) ?? null, Ee = oe !== null && Le > oe;
  let Se = "warning";
  fe === 0 ? Se = "success" : fe < 0 && (Se = "error");
  const le = fe === 0 ? "✓ All Karma allocated. Review the remaining steps, then proceed." : fe < 0 ? `Over budget by ${Math.abs(fe)} Karma. Adjust your selections.` : `Spend the remaining ${fe} Karma before finalizing.`;
  function se(re, Fe) {
    const nt = Number.parseInt(Fe.target.value, 10);
    G((pt) => ({
      ...pt,
      [re]: Number.isNaN(nt) || nt < 0 ? 0 : nt
    }));
  }
  function U(re) {
    ge(re.target.value);
  }
  function pe() {
    G(
      iv.reduce((re, Fe) => (re[Fe.key] = 0, re), {})
    ), L[0] && ge(L[0].value);
  }
  return /* @__PURE__ */ p.jsxs("div", { className: "react-priority-wrapper karma-wrapper", children: [
    /* @__PURE__ */ p.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ p.jsxs("span", { children: [
        "Karma Point-Buy — ",
        /* @__PURE__ */ p.jsx("strong", { children: b })
      ] }),
      /* @__PURE__ */ p.jsx("span", { children: ae ? `Campaign defaults unavailable: ${ae}` : g ? "Applying campaign defaults…" : q ? "Loading karma data…" : ee ? `Error: ${ee}` : "Allocate your Karma budget before moving on." })
    ] }),
    E.description && /* @__PURE__ */ p.jsx("p", { className: "karma-description", children: E.description }),
    E.notes && E.notes.length > 0 && /* @__PURE__ */ p.jsx("ul", { className: "karma-notes", children: E.notes.map((re) => /* @__PURE__ */ p.jsx("li", { children: re }, re)) }),
    D && /* @__PURE__ */ p.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ p.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        D.label
      ] }),
      D.description && /* @__PURE__ */ p.jsx("p", { children: D.description })
    ] }),
    /* @__PURE__ */ p.jsxs("div", { className: "karma-grid", children: [
      /* @__PURE__ */ p.jsxs("section", { className: "karma-panel", children: [
        /* @__PURE__ */ p.jsx("h4", { children: "Metatype" }),
        /* @__PURE__ */ p.jsxs("label", { className: "karma-field", children: [
          /* @__PURE__ */ p.jsx("span", { children: "Choose metatype" }),
          /* @__PURE__ */ p.jsx("select", { value: z, onChange: U, children: L.map((re) => {
            var nt, pt, Me, he;
            const Fe = ((Me = E.metatype_costs) == null ? void 0 : Me[((pt = (nt = re.value).toLowerCase) == null ? void 0 : pt.call(nt)) ?? ""]) ?? ((he = E.metatype_costs) == null ? void 0 : he.human) ?? 0;
            return /* @__PURE__ */ p.jsxs("option", { value: re.value, children: [
              re.label,
              " (",
              Fe,
              " Karma)"
            ] }, re.value);
          }) })
        ] }),
        /* @__PURE__ */ p.jsxs("p", { className: "karma-info", children: [
          "Metatype cost: ",
          /* @__PURE__ */ p.jsxs("strong", { children: [
            ne,
            " Karma"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ p.jsxs("section", { className: "karma-panel", children: [
        /* @__PURE__ */ p.jsx("h4", { children: "Karma Ledger" }),
        /* @__PURE__ */ p.jsx("div", { className: "karma-ledger", children: iv.map(({ key: re, label: Fe }) => {
          const nt = P[re] ?? 0, pt = re === "gear" && oe !== null ? ` (max ${oe} Karma)` : "";
          return /* @__PURE__ */ p.jsxs("label", { className: "karma-field karma-ledger-row", children: [
            /* @__PURE__ */ p.jsxs("span", { children: [
              Fe,
              pt
            ] }),
            /* @__PURE__ */ p.jsx(
              "input",
              {
                type: "number",
                min: 0,
                step: 5,
                value: nt,
                onChange: (Me) => se(re, Me)
              }
            )
          ] }, re);
        }) })
      ] }),
      /* @__PURE__ */ p.jsxs("section", { className: "karma-panel karma-summary", children: [
        /* @__PURE__ */ p.jsx("h4", { children: "Budget Summary" }),
        /* @__PURE__ */ p.jsxs("dl", { children: [
          /* @__PURE__ */ p.jsxs("div", { children: [
            /* @__PURE__ */ p.jsx("dt", { children: "Karma budget" }),
            /* @__PURE__ */ p.jsx("dd", { children: te })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { children: [
            /* @__PURE__ */ p.jsx("dt", { children: "Metatype cost" }),
            /* @__PURE__ */ p.jsx("dd", { children: ne })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { children: [
            /* @__PURE__ */ p.jsx("dt", { children: "Ledger spend" }),
            /* @__PURE__ */ p.jsx("dd", { children: X - ne })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { children: [
            /* @__PURE__ */ p.jsx("dt", { children: "Total spent" }),
            /* @__PURE__ */ p.jsx("dd", { children: X })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { children: [
            /* @__PURE__ */ p.jsx("dt", { children: "Remaining" }),
            /* @__PURE__ */ p.jsx("dd", { children: fe })
          ] })
        ] }),
        Ee && /* @__PURE__ */ p.jsxs("p", { className: "karma-warning", children: [
          "Gear conversion exceeds the campaign limit of ",
          oe,
          " Karma. Adjust your allocation."
        ] }),
        /* @__PURE__ */ p.jsx("p", { className: "karma-hint", children: "Remember: Only one Physical and one Mental attribute may start at their natural maximum. Attribute purchases should respect metatype caps." })
      ] })
    ] }),
    /* @__PURE__ */ p.jsx("div", { className: `react-priority-status karma-status ${Se}`, role: "status", "aria-live": "polite", children: le }),
    /* @__PURE__ */ p.jsxs("div", { className: "karma-footer", children: [
      /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn btn-secondary", onClick: pe, children: "Reset allocations" }),
      /* @__PURE__ */ p.jsx(
        "button",
        {
          type: "button",
          className: "btn btn-link",
          onClick: () => {
            var re, Fe;
            return (Fe = (re = window.ShadowmasterLegacyApp) == null ? void 0 : re.showLegacyKarmaWizard) == null ? void 0 : Fe.call(re);
          },
          children: "Open legacy point-buy wizard"
        }
      )
    ] })
  ] });
}
const u1 = {
  body: "Body",
  quickness: "Quickness",
  strength: "Strength",
  charisma: "Charisma",
  intelligence: "Intelligence",
  willpower: "Willpower"
};
function s1(C, E) {
  if (!C)
    return [];
  const b = E || "E";
  return C.metatypes.map((q) => {
    var ee;
    return {
      ...q,
      priorityAllowed: ((ee = q.priority_tiers) == null ? void 0 : ee.includes(b)) ?? !1
    };
  }).filter((q) => q.priorityAllowed);
}
function c1(C) {
  return C === 0 ? "+0" : C > 0 ? `+${C}` : `${C}`;
}
function f1(C) {
  const E = C.toLowerCase();
  return u1[E] ?? C;
}
function d1({ priority: C, selectedMetatype: E, onSelect: b }) {
  const { characterCreationData: q, isLoading: ee, error: D, activeEdition: g } = Kf();
  A.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const ae = A.useMemo(() => {
    var ne;
    const P = ((ne = C == null ? void 0 : C.toUpperCase) == null ? void 0 : ne.call(C)) ?? "", te = ["A", "B", "C", "D", "E"].includes(P) ? P : "";
    return s1(q, te);
  }, [q, C]), L = !!E, z = () => {
    var P, G;
    (G = (P = window.ShadowmasterLegacyApp) == null ? void 0 : P.showWizardStep) == null || G.call(P, 1);
  }, ge = () => {
    var P, G;
    E && ((G = (P = window.ShadowmasterLegacyApp) == null ? void 0 : P.showWizardStep) == null || G.call(P, 3));
  };
  return ee ? /* @__PURE__ */ p.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : D ? /* @__PURE__ */ p.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    D
  ] }) : ae.length ? /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
    /* @__PURE__ */ p.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ p.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ p.jsxs("span", { children: [
        "Priority: ",
        C || "—"
      ] })
    ] }),
    /* @__PURE__ */ p.jsx("div", { className: "react-metatype-grid", children: ae.map((P) => /* @__PURE__ */ p.jsxs(
      "article",
      {
        className: `react-metatype-card ${E === P.id ? "selected" : ""}`,
        onClick: () => b(P.id),
        children: [
          /* @__PURE__ */ p.jsx("h4", { children: P.name }),
          /* @__PURE__ */ p.jsxs("section", { className: "react-metatype-modifiers", children: [
            /* @__PURE__ */ p.jsx("strong", { children: "Attribute Modifiers" }),
            (() => {
              const G = P.attribute_modifiers ? Object.entries(P.attribute_modifiers).filter(([, te]) => te !== 0) : [];
              return G.length === 0 ? /* @__PURE__ */ p.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : G.map(([te, ne]) => /* @__PURE__ */ p.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ p.jsx("span", { children: f1(te) }),
                /* @__PURE__ */ p.jsx("span", { className: ne > 0 ? "positive" : "negative", children: c1(ne) })
              ] }, te));
            })()
          ] }),
          g.key === "sr5" && P.special_attribute_points && Object.keys(P.special_attribute_points).length > 0 && /* @__PURE__ */ p.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ p.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(P.special_attribute_points).map(([G, te]) => /* @__PURE__ */ p.jsx("div", { className: "ability", children: /* @__PURE__ */ p.jsxs("span", { children: [
              "Priority ",
              G,
              ": ",
              te
            ] }) }, G))
          ] }),
          P.abilities && P.abilities.length > 0 && /* @__PURE__ */ p.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ p.jsx("strong", { children: "Special Abilities" }),
            P.abilities.map((G, te) => /* @__PURE__ */ p.jsx("div", { className: "ability", children: /* @__PURE__ */ p.jsx("span", { children: G }) }, te))
          ] }),
          (!P.abilities || P.abilities.length === 0) && /* @__PURE__ */ p.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ p.jsx("strong", { children: "Special Abilities" }),
            /* @__PURE__ */ p.jsx("div", { className: "ability", children: /* @__PURE__ */ p.jsx("span", { children: "No inherent metatype abilities." }) })
          ] })
        ]
      },
      P.id
    )) }),
    /* @__PURE__ */ p.jsxs("div", { className: "react-metatype-footer", children: [
      /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn btn-secondary", onClick: z, children: "Back" }),
      /* @__PURE__ */ p.jsx("div", { className: `react-metatype-status ${L ? "ready" : ""}`, children: L ? "Metatype selected. Continue to magic." : "Select a metatype to continue." }),
      /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn btn-primary", disabled: !L, onClick: ge, children: "Next: Choose Magical Abilities" })
    ] })
  ] }) : /* @__PURE__ */ p.jsx("p", { className: "react-metatype-status", children: "No metatypes available for this priority." });
}
const p1 = ["Hermetic", "Shamanic"], v1 = [
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
function h1(C) {
  return (C || "").toUpperCase();
}
function m1({ priority: C, selection: E, onChange: b }) {
  var te;
  const { characterCreationData: q, activeEdition: ee } = Kf(), D = h1(C), g = ((te = q == null ? void 0 : q.priorities) == null ? void 0 : te.magic) ?? null, ae = A.useMemo(() => g && g[D] || null, [g, D]);
  A.useEffect(() => (document.body.classList.add("react-magic-enabled"), () => {
    document.body.classList.remove("react-magic-enabled");
  }), []), A.useEffect(() => {
    if (!D) {
      (E.type !== "Mundane" || E.tradition || E.totem) && b({ type: "Mundane", tradition: null, totem: null });
      return;
    }
    if (D === "A") {
      const ne = E.tradition ?? "Hermetic", X = ne === "Shamanic" ? E.totem : null;
      (E.type !== "Full Magician" || E.tradition !== ne || E.totem !== X) && b({ type: "Full Magician", tradition: ne, totem: X });
    } else if (D === "B") {
      let ne = E.type;
      E.type !== "Adept" && E.type !== "Aspected Magician" && (ne = "Adept");
      let X = E.tradition, fe = E.totem;
      ne === "Aspected Magician" ? (X = X ?? "Hermetic", X !== "Shamanic" && (fe = null)) : (X = null, fe = null), (E.type !== ne || E.tradition !== X || E.totem !== fe) && b({ type: ne, tradition: X, totem: fe });
    } else
      (E.type !== "Mundane" || E.tradition || E.totem) && b({ type: "Mundane", tradition: null, totem: null });
  }, [D]);
  const L = (ne) => {
    const X = {
      type: ne.type !== void 0 ? ne.type : E.type,
      tradition: ne.tradition !== void 0 ? ne.tradition : E.tradition,
      totem: ne.totem !== void 0 ? ne.totem : E.totem
    };
    X.type !== "Full Magician" && X.type !== "Aspected Magician" && (X.tradition = null, X.totem = null), X.tradition !== "Shamanic" && (X.totem = null), !(X.type === E.type && X.tradition === E.tradition && X.totem === E.totem) && b(X);
  }, z = () => !D || ["C", "D", "E", ""].includes(D) ? /* @__PURE__ */ p.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ p.jsxs(
    "article",
    {
      className: `react-magic-card ${E.type === "Mundane" ? "selected" : ""}`,
      onClick: () => L({ type: "Mundane", tradition: null, totem: null }),
      children: [
        /* @__PURE__ */ p.jsx("h4", { children: "Mundane" }),
        /* @__PURE__ */ p.jsx("p", { children: "No magical ability. Magic Rating 0." })
      ]
    }
  ) }) : D === "A" ? /* @__PURE__ */ p.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ p.jsxs(
    "article",
    {
      className: `react-magic-card ${E.type === "Full Magician" ? "selected" : ""}`,
      onClick: () => L({ type: "Full Magician" }),
      children: [
        /* @__PURE__ */ p.jsx("h4", { children: "Full Magician" }),
        /* @__PURE__ */ p.jsx("p", { children: "Magic Rating 6. Spell Points 25." }),
        /* @__PURE__ */ p.jsx("p", { children: "Must choose a magical tradition." })
      ]
    }
  ) }) : D === "B" ? /* @__PURE__ */ p.jsxs("div", { className: "react-magic-grid", children: [
    /* @__PURE__ */ p.jsxs(
      "article",
      {
        className: `react-magic-card ${E.type === "Adept" ? "selected" : ""}`,
        onClick: () => L({ type: "Adept", tradition: null, totem: null }),
        children: [
          /* @__PURE__ */ p.jsx("h4", { children: "Adept" }),
          /* @__PURE__ */ p.jsx("p", { children: "Magic Rating 4. Gain Power Points for physical enhancements." })
        ]
      }
    ),
    /* @__PURE__ */ p.jsxs(
      "article",
      {
        className: `react-magic-card ${E.type === "Aspected Magician" ? "selected" : ""}`,
        onClick: () => L({ type: "Aspected Magician" }),
        children: [
          /* @__PURE__ */ p.jsx("h4", { children: "Aspected Magician" }),
          /* @__PURE__ */ p.jsx("p", { children: "Magic Rating 4. Specializes in a single tradition aspect." }),
          /* @__PURE__ */ p.jsx("p", { children: "Must choose a magical tradition." })
        ]
      }
    )
  ] }) : null, ge = () => !E.type || !["Full Magician", "Aspected Magician"].includes(E.type) ? null : /* @__PURE__ */ p.jsxs("div", { className: "react-magic-traditions", children: [
    /* @__PURE__ */ p.jsx("strong", { children: "Tradition" }),
    /* @__PURE__ */ p.jsx("div", { className: "tradition-options", children: p1.map((ne) => /* @__PURE__ */ p.jsxs("label", { className: `tradition-option ${E.tradition === ne ? "selected" : ""}`, children: [
      /* @__PURE__ */ p.jsx(
        "input",
        {
          type: "radio",
          name: "react-tradition",
          value: ne,
          checked: E.tradition === ne,
          onChange: () => L({ tradition: ne })
        }
      ),
      /* @__PURE__ */ p.jsx("span", { children: ne })
    ] }, ne)) })
  ] }), P = () => E.tradition !== "Shamanic" ? null : /* @__PURE__ */ p.jsxs("div", { className: "react-magic-totems", children: [
    /* @__PURE__ */ p.jsx("strong", { children: "Select Totem" }),
    /* @__PURE__ */ p.jsx("div", { className: "totem-grid", children: v1.map((ne) => /* @__PURE__ */ p.jsxs(
      "article",
      {
        className: `totem-card ${E.totem === ne.id ? "selected" : ""}`,
        onClick: () => L({ totem: ne.id }),
        children: [
          /* @__PURE__ */ p.jsx("h5", { children: ne.name }),
          /* @__PURE__ */ p.jsx("p", { children: ne.description }),
          /* @__PURE__ */ p.jsx("ul", { children: ne.notes.map((X) => /* @__PURE__ */ p.jsx("li", { children: X }, X)) })
        ]
      },
      ne.id
    )) })
  ] }), G = () => {
    if (!E.type)
      return /* @__PURE__ */ p.jsx("p", { className: "react-magic-status", children: "Select a magical path to proceed." });
    if (E.type === "Full Magician" || E.type === "Aspected Magician") {
      if (!E.tradition)
        return /* @__PURE__ */ p.jsx("p", { className: "react-magic-status", children: "Choose a tradition to continue." });
      if (E.tradition === "Shamanic" && !E.totem)
        return /* @__PURE__ */ p.jsx("p", { className: "react-magic-status", children: "Select a totem for your shamanic path." });
    }
    return /* @__PURE__ */ p.jsx("p", { className: "react-magic-status ready", children: "Magical abilities ready. Continue to Attributes." });
  };
  return /* @__PURE__ */ p.jsxs("div", { className: "react-magic-wrapper", children: [
    /* @__PURE__ */ p.jsxs("div", { className: "react-magic-header", children: [
      /* @__PURE__ */ p.jsx("span", { children: "Magical Abilities" }),
      /* @__PURE__ */ p.jsxs("span", { children: [
        "Priority ",
        D || "—",
        " ",
        ae != null && ae.summary ? `— ${ae.summary}` : ""
      ] })
    ] }),
    z(),
    ge(),
    P(),
    G(),
    /* @__PURE__ */ p.jsx("footer", { className: "react-magic-footer", children: /* @__PURE__ */ p.jsxs("small", { children: [
      "Edition: ",
      ee.label
    ] }) })
  ] });
}
function y1({ targetId: C = "campaign-dashboard-root", campaign: E, onClose: b }) {
  var z, ge, P;
  const [q, ee] = A.useState(null);
  A.useEffect(() => {
    ee(document.getElementById(C));
  }, [C]);
  const D = A.useMemo(() => {
    if (!(E != null && E.house_rules))
      return {};
    try {
      return JSON.parse(E.house_rules);
    } catch (G) {
      return console.warn("Failed to parse campaign house rules payload", G), {};
    }
  }, [E == null ? void 0 : E.house_rules]);
  if (!q || !E)
    return null;
  const g = Object.entries(D.automation ?? {}).filter(([, G]) => G), ae = (((z = D.factions) == null ? void 0 : z.length) ?? 0) > 0 || (((ge = D.locations) == null ? void 0 : ge.length) ?? 0) > 0, L = D.session_seed;
  return pl.createPortal(
    /* @__PURE__ */ p.jsxs("section", { className: "campaign-dashboard", children: [
      /* @__PURE__ */ p.jsxs("header", { className: "campaign-dashboard__header", children: [
        /* @__PURE__ */ p.jsxs("div", { children: [
          /* @__PURE__ */ p.jsx("h3", { children: E.name }),
          /* @__PURE__ */ p.jsxs("p", { children: [
            E.edition.toUpperCase(),
            " · ",
            E.creation_method,
            " · ",
            E.gameplay_level ?? "experienced"
          ] })
        ] }),
        /* @__PURE__ */ p.jsx("div", { className: "campaign-dashboard__actions", children: /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: b, children: "Dismiss" }) })
      ] }),
      D.theme && /* @__PURE__ */ p.jsxs("p", { className: "campaign-dashboard__theme", children: [
        /* @__PURE__ */ p.jsx("strong", { children: "Theme:" }),
        " ",
        D.theme
      ] }),
      /* @__PURE__ */ p.jsxs("div", { className: "campaign-dashboard__grid", children: [
        /* @__PURE__ */ p.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "Roster" }),
          /* @__PURE__ */ p.jsxs("p", { children: [
            /* @__PURE__ */ p.jsx("strong", { children: "Placeholders:" }),
            " ",
            (P = D.placeholders) != null && P.length ? D.placeholders.map((G) => G.name).join(", ") : "None captured"
          ] })
        ] }),
        /* @__PURE__ */ p.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "Automation" }),
          g.length > 0 ? /* @__PURE__ */ p.jsx("ul", { children: g.map(([G]) => /* @__PURE__ */ p.jsx("li", { children: G.replace(/_/g, " ") }, G)) }) : /* @__PURE__ */ p.jsx("p", { children: "No automation modules selected." }),
          D.notes && /* @__PURE__ */ p.jsxs("p", { className: "campaign-dashboard__notes", children: [
            /* @__PURE__ */ p.jsx("strong", { children: "House rule notes:" }),
            " ",
            D.notes
          ] })
        ] }),
        /* @__PURE__ */ p.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "World Backbone" }),
          ae ? /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
            D.factions && D.factions.length > 0 && /* @__PURE__ */ p.jsxs("div", { children: [
              /* @__PURE__ */ p.jsx("strong", { children: "Factions" }),
              /* @__PURE__ */ p.jsx("ul", { children: D.factions.map((G) => /* @__PURE__ */ p.jsxs("li", { children: [
                /* @__PURE__ */ p.jsx("span", { children: G.name }),
                G.tags && /* @__PURE__ */ p.jsxs("small", { children: [
                  " · ",
                  G.tags
                ] }),
                G.notes && /* @__PURE__ */ p.jsx("p", { children: G.notes })
              ] }, G.id ?? G.name)) })
            ] }),
            D.locations && D.locations.length > 0 && /* @__PURE__ */ p.jsxs("div", { children: [
              /* @__PURE__ */ p.jsx("strong", { children: "Locations" }),
              /* @__PURE__ */ p.jsx("ul", { children: D.locations.map((G) => /* @__PURE__ */ p.jsxs("li", { children: [
                /* @__PURE__ */ p.jsx("span", { children: G.name }),
                G.descriptor && /* @__PURE__ */ p.jsx("p", { children: G.descriptor })
              ] }, G.id ?? G.name)) })
            ] })
          ] }) : /* @__PURE__ */ p.jsx("p", { children: "No factions or locations recorded yet." })
        ] }),
        /* @__PURE__ */ p.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "Session Seed" }),
          L != null && L.skip ? /* @__PURE__ */ p.jsx("p", { children: "Session planning skipped for now." }) : L ? /* @__PURE__ */ p.jsxs("ul", { children: [
            /* @__PURE__ */ p.jsxs("li", { children: [
              /* @__PURE__ */ p.jsx("strong", { children: "Title:" }),
              " ",
              L.title || "Session 0"
            ] }),
            L.sceneTemplate && /* @__PURE__ */ p.jsxs("li", { children: [
              /* @__PURE__ */ p.jsx("strong", { children: "Template:" }),
              " ",
              L.sceneTemplate
            ] }),
            L.objectives && /* @__PURE__ */ p.jsxs("li", { children: [
              /* @__PURE__ */ p.jsx("strong", { children: "Objectives:" }),
              " ",
              L.objectives
            ] }),
            L.summary && /* @__PURE__ */ p.jsxs("li", { children: [
              /* @__PURE__ */ p.jsx("strong", { children: "Summary:" }),
              " ",
              L.summary
            ] })
          ] }) : /* @__PURE__ */ p.jsx("p", { children: "No session seed captured." })
        ] })
      ] })
    ] }),
    q
  );
}
function g1() {
  const [C, E] = A.useState(null);
  return A.useEffect(() => {
    E(document.getElementById("auth-root"));
  }, []), C ? pl.createPortal(/* @__PURE__ */ p.jsx(AD, {}), C) : null;
}
function S1() {
  const [C, E] = A.useState(null);
  return A.useEffect(() => {
    E(document.getElementById("priority-assignment-react-root"));
  }, []), C ? pl.createPortal(/* @__PURE__ */ p.jsx(r1, {}), C) : null;
}
function E1() {
  const [C, E] = A.useState(null), [b, q] = A.useState(""), [ee, D] = A.useState(null);
  return A.useEffect(() => {
    E(document.getElementById("metatype-selection-react-root"));
  }, []), A.useEffect(() => {
    var L;
    const g = window.ShadowmasterLegacyApp;
    if (!g) return;
    const ae = () => {
      var z, ge;
      q(((z = g.getMetatypePriority) == null ? void 0 : z.call(g)) ?? ""), D(((ge = g.getMetatypeSelection) == null ? void 0 : ge.call(g)) ?? null);
    };
    return ae(), (L = g.subscribeMetatypeState) == null || L.call(g, ae), () => {
      var z;
      (z = g.unsubscribeMetatypeState) == null || z.call(g, ae);
    };
  }, []), C ? pl.createPortal(
    /* @__PURE__ */ p.jsx(
      d1,
      {
        priority: b,
        selectedMetatype: ee,
        onSelect: (g) => {
          var ae, L;
          D(g), (L = (ae = window.ShadowmasterLegacyApp) == null ? void 0 : ae.setMetatypeSelection) == null || L.call(ae, g);
        }
      }
    ),
    C
  ) : null;
}
function C1() {
  const [C, E] = A.useState(null), [b, q] = A.useState({
    priority: "",
    type: null,
    tradition: null,
    totem: null
  });
  return A.useEffect(() => {
    E(document.getElementById("magical-abilities-react-root"));
  }, []), A.useEffect(() => {
    var g;
    const ee = window.ShadowmasterLegacyApp;
    if (!ee) return;
    const D = () => {
      var L;
      const ae = (L = ee.getMagicState) == null ? void 0 : L.call(ee);
      ae && q({
        priority: ae.priority || "",
        type: ae.type || null,
        tradition: ae.tradition || null,
        totem: ae.totem || null
      });
    };
    return D(), (g = ee.subscribeMagicState) == null || g.call(ee, D), () => {
      var ae;
      (ae = ee.unsubscribeMagicState) == null || ae.call(ee, D);
    };
  }, []), C ? pl.createPortal(
    /* @__PURE__ */ p.jsx(
      m1,
      {
        priority: b.priority,
        selection: { type: b.type, tradition: b.tradition, totem: b.totem },
        onChange: (ee) => {
          var D, g;
          (g = (D = window.ShadowmasterLegacyApp) == null ? void 0 : D.setMagicState) == null || g.call(D, ee);
        }
      }
    ),
    C
  ) : null;
}
function x1() {
  const { activeEdition: C, isLoading: E, error: b, characterCreationData: q } = Kf(), [ee, D] = A.useState(null);
  let g = "· data pending";
  return E ? g = "· loading edition data…" : b ? g = `· failed to load data: ${b}` : q && (g = "· edition data loaded"), /* @__PURE__ */ p.jsxs(MD, { children: [
    /* @__PURE__ */ p.jsx("div", { className: "react-banner", "data-active-edition": C.key, children: /* @__PURE__ */ p.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ p.jsx("strong", { children: C.label }),
      " ",
      g
    ] }) }),
    /* @__PURE__ */ p.jsx(g1, {}),
    /* @__PURE__ */ p.jsx(JD, {}),
    /* @__PURE__ */ p.jsx(VD, { onCreated: (ae) => D(ae) }),
    /* @__PURE__ */ p.jsx(y1, { campaign: ee, onClose: () => D(null) }),
    /* @__PURE__ */ p.jsx(KD, {}),
    /* @__PURE__ */ p.jsx(UD, {}),
    /* @__PURE__ */ p.jsx(S1, {}),
    /* @__PURE__ */ p.jsx(E1, {}),
    /* @__PURE__ */ p.jsx(C1, {})
  ] });
}
const b1 = document.getElementById("shadowmaster-react-root"), w1 = b1 ?? T1();
function T1() {
  const C = document.createElement("div");
  return C.id = "shadowmaster-react-root", C.dataset.controller = "react-shell", C.style.display = "contents", document.body.appendChild(C), C;
}
function R1() {
  return A.useEffect(() => {
    var C, E, b;
    (C = window.ShadowmasterLegacyApp) != null && C.initialize && !((b = (E = window.ShadowmasterLegacyApp).isInitialized) != null && b.call(E)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ p.jsx(A.StrictMode, { children: /* @__PURE__ */ p.jsx(DD, { children: /* @__PURE__ */ p.jsx(x1, {}) }) });
}
const _1 = kE(w1);
_1.render(/* @__PURE__ */ p.jsx(R1, {}));

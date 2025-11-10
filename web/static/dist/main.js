var wE = { exports: {} }, tv = {}, TE = { exports: {} }, Mt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var u0;
function gD() {
  if (u0) return Mt;
  u0 = 1;
  var x = Symbol.for("react.element"), E = Symbol.for("react.portal"), b = Symbol.for("react.fragment"), q = Symbol.for("react.strict_mode"), ee = Symbol.for("react.profiler"), D = Symbol.for("react.provider"), g = Symbol.for("react.context"), ae = Symbol.for("react.forward_ref"), L = Symbol.for("react.suspense"), z = Symbol.for("react.memo"), ge = Symbol.for("react.lazy"), P = Symbol.iterator;
  function W(T) {
    return T === null || typeof T != "object" ? null : (T = P && T[P] || T["@@iterator"], typeof T == "function" ? T : null);
  }
  var te = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ne = Object.assign, X = {};
  function fe(T, M, Ne) {
    this.props = T, this.context = M, this.refs = X, this.updater = Ne || te;
  }
  fe.prototype.isReactComponent = {}, fe.prototype.setState = function(T, M) {
    if (typeof T != "object" && typeof T != "function" && T != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, T, M, "setState");
  }, fe.prototype.forceUpdate = function(T) {
    this.updater.enqueueForceUpdate(this, T, "forceUpdate");
  };
  function je() {
  }
  je.prototype = fe.prototype;
  function oe(T, M, Ne) {
    this.props = T, this.context = M, this.refs = X, this.updater = Ne || te;
  }
  var Ee = oe.prototype = new je();
  Ee.constructor = oe, ne(Ee, fe.prototype), Ee.isPureReactComponent = !0;
  var Se = Array.isArray, le = Object.prototype.hasOwnProperty, se = { current: null }, A = { key: !0, ref: !0, __self: !0, __source: !0 };
  function pe(T, M, Ne) {
    var Ie, bt = {}, gt = null, vt = null;
    if (M != null) for (Ie in M.ref !== void 0 && (vt = M.ref), M.key !== void 0 && (gt = "" + M.key), M) le.call(M, Ie) && !A.hasOwnProperty(Ie) && (bt[Ie] = M[Ie]);
    var Ct = arguments.length - 2;
    if (Ct === 1) bt.children = Ne;
    else if (1 < Ct) {
      for (var wt = Array(Ct), Bt = 0; Bt < Ct; Bt++) wt[Bt] = arguments[Bt + 2];
      bt.children = wt;
    }
    if (T && T.defaultProps) for (Ie in Ct = T.defaultProps, Ct) bt[Ie] === void 0 && (bt[Ie] = Ct[Ie]);
    return { $$typeof: x, type: T, key: gt, ref: vt, props: bt, _owner: se.current };
  }
  function ue(T, M) {
    return { $$typeof: x, type: T.type, key: M, ref: T.ref, props: T.props, _owner: T._owner };
  }
  function be(T) {
    return typeof T == "object" && T !== null && T.$$typeof === x;
  }
  function De(T) {
    var M = { "=": "=0", ":": "=2" };
    return "$" + T.replace(/[=:]/g, function(Ne) {
      return M[Ne];
    });
  }
  var Je = /\/+/g;
  function re(T, M) {
    return typeof T == "object" && T !== null && T.key != null ? De("" + T.key) : M.toString(36);
  }
  function ze(T, M, Ne, Ie, bt) {
    var gt = typeof T;
    (gt === "undefined" || gt === "boolean") && (T = null);
    var vt = !1;
    if (T === null) vt = !0;
    else switch (gt) {
      case "string":
      case "number":
        vt = !0;
        break;
      case "object":
        switch (T.$$typeof) {
          case x:
          case E:
            vt = !0;
        }
    }
    if (vt) return vt = T, bt = bt(vt), T = Ie === "" ? "." + re(vt, 0) : Ie, Se(bt) ? (Ne = "", T != null && (Ne = T.replace(Je, "$&/") + "/"), ze(bt, M, Ne, "", function(Bt) {
      return Bt;
    })) : bt != null && (be(bt) && (bt = ue(bt, Ne + (!bt.key || vt && vt.key === bt.key ? "" : ("" + bt.key).replace(Je, "$&/") + "/") + T)), M.push(bt)), 1;
    if (vt = 0, Ie = Ie === "" ? "." : Ie + ":", Se(T)) for (var Ct = 0; Ct < T.length; Ct++) {
      gt = T[Ct];
      var wt = Ie + re(gt, Ct);
      vt += ze(gt, M, Ne, wt, bt);
    }
    else if (wt = W(T), typeof wt == "function") for (T = wt.call(T), Ct = 0; !(gt = T.next()).done; ) gt = gt.value, wt = Ie + re(gt, Ct++), vt += ze(gt, M, Ne, wt, bt);
    else if (gt === "object") throw M = String(T), Error("Objects are not valid as a React child (found: " + (M === "[object Object]" ? "object with keys {" + Object.keys(T).join(", ") + "}" : M) + "). If you meant to render a collection of children, use an array instead.");
    return vt;
  }
  function tt(T, M, Ne) {
    if (T == null) return T;
    var Ie = [], bt = 0;
    return ze(T, Ie, "", "", function(gt) {
      return M.call(Ne, gt, bt++);
    }), Ie;
  }
  function dt(T) {
    if (T._status === -1) {
      var M = T._result;
      M = M(), M.then(function(Ne) {
        (T._status === 0 || T._status === -1) && (T._status = 1, T._result = Ne);
      }, function(Ne) {
        (T._status === 0 || T._status === -1) && (T._status = 2, T._result = Ne);
      }), T._status === -1 && (T._status = 0, T._result = M);
    }
    if (T._status === 1) return T._result.default;
    throw T._result;
  }
  var Oe = { current: null }, he = { transition: null }, He = { ReactCurrentDispatcher: Oe, ReactCurrentBatchConfig: he, ReactCurrentOwner: se };
  function Re() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Mt.Children = { map: tt, forEach: function(T, M, Ne) {
    tt(T, function() {
      M.apply(this, arguments);
    }, Ne);
  }, count: function(T) {
    var M = 0;
    return tt(T, function() {
      M++;
    }), M;
  }, toArray: function(T) {
    return tt(T, function(M) {
      return M;
    }) || [];
  }, only: function(T) {
    if (!be(T)) throw Error("React.Children.only expected to receive a single React element child.");
    return T;
  } }, Mt.Component = fe, Mt.Fragment = b, Mt.Profiler = ee, Mt.PureComponent = oe, Mt.StrictMode = q, Mt.Suspense = L, Mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = He, Mt.act = Re, Mt.cloneElement = function(T, M, Ne) {
    if (T == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + T + ".");
    var Ie = ne({}, T.props), bt = T.key, gt = T.ref, vt = T._owner;
    if (M != null) {
      if (M.ref !== void 0 && (gt = M.ref, vt = se.current), M.key !== void 0 && (bt = "" + M.key), T.type && T.type.defaultProps) var Ct = T.type.defaultProps;
      for (wt in M) le.call(M, wt) && !A.hasOwnProperty(wt) && (Ie[wt] = M[wt] === void 0 && Ct !== void 0 ? Ct[wt] : M[wt]);
    }
    var wt = arguments.length - 2;
    if (wt === 1) Ie.children = Ne;
    else if (1 < wt) {
      Ct = Array(wt);
      for (var Bt = 0; Bt < wt; Bt++) Ct[Bt] = arguments[Bt + 2];
      Ie.children = Ct;
    }
    return { $$typeof: x, type: T.type, key: bt, ref: gt, props: Ie, _owner: vt };
  }, Mt.createContext = function(T) {
    return T = { $$typeof: g, _currentValue: T, _currentValue2: T, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, T.Provider = { $$typeof: D, _context: T }, T.Consumer = T;
  }, Mt.createElement = pe, Mt.createFactory = function(T) {
    var M = pe.bind(null, T);
    return M.type = T, M;
  }, Mt.createRef = function() {
    return { current: null };
  }, Mt.forwardRef = function(T) {
    return { $$typeof: ae, render: T };
  }, Mt.isValidElement = be, Mt.lazy = function(T) {
    return { $$typeof: ge, _payload: { _status: -1, _result: T }, _init: dt };
  }, Mt.memo = function(T, M) {
    return { $$typeof: z, type: T, compare: M === void 0 ? null : M };
  }, Mt.startTransition = function(T) {
    var M = he.transition;
    he.transition = {};
    try {
      T();
    } finally {
      he.transition = M;
    }
  }, Mt.unstable_act = Re, Mt.useCallback = function(T, M) {
    return Oe.current.useCallback(T, M);
  }, Mt.useContext = function(T) {
    return Oe.current.useContext(T);
  }, Mt.useDebugValue = function() {
  }, Mt.useDeferredValue = function(T) {
    return Oe.current.useDeferredValue(T);
  }, Mt.useEffect = function(T, M) {
    return Oe.current.useEffect(T, M);
  }, Mt.useId = function() {
    return Oe.current.useId();
  }, Mt.useImperativeHandle = function(T, M, Ne) {
    return Oe.current.useImperativeHandle(T, M, Ne);
  }, Mt.useInsertionEffect = function(T, M) {
    return Oe.current.useInsertionEffect(T, M);
  }, Mt.useLayoutEffect = function(T, M) {
    return Oe.current.useLayoutEffect(T, M);
  }, Mt.useMemo = function(T, M) {
    return Oe.current.useMemo(T, M);
  }, Mt.useReducer = function(T, M, Ne) {
    return Oe.current.useReducer(T, M, Ne);
  }, Mt.useRef = function(T) {
    return Oe.current.useRef(T);
  }, Mt.useState = function(T) {
    return Oe.current.useState(T);
  }, Mt.useSyncExternalStore = function(T, M, Ne) {
    return Oe.current.useSyncExternalStore(T, M, Ne);
  }, Mt.useTransition = function() {
    return Oe.current.useTransition();
  }, Mt.version = "18.3.1", Mt;
}
var iv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
iv.exports;
var s0;
function SD() {
  return s0 || (s0 = 1, function(x, E) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var b = "18.3.1", q = Symbol.for("react.element"), ee = Symbol.for("react.portal"), D = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), ae = Symbol.for("react.profiler"), L = Symbol.for("react.provider"), z = Symbol.for("react.context"), ge = Symbol.for("react.forward_ref"), P = Symbol.for("react.suspense"), W = Symbol.for("react.suspense_list"), te = Symbol.for("react.memo"), ne = Symbol.for("react.lazy"), X = Symbol.for("react.offscreen"), fe = Symbol.iterator, je = "@@iterator";
      function oe(m) {
        if (m === null || typeof m != "object")
          return null;
        var R = fe && m[fe] || m[je];
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
      }, A = {}, pe = null;
      function ue(m) {
        pe = m;
      }
      A.setExtraStackFrame = function(m) {
        pe = m;
      }, A.getCurrentStack = null, A.getStackAddendum = function() {
        var m = "";
        pe && (m += pe);
        var R = A.getCurrentStack;
        return R && (m += R() || ""), m;
      };
      var be = !1, De = !1, Je = !1, re = !1, ze = !1, tt = {
        ReactCurrentDispatcher: Ee,
        ReactCurrentBatchConfig: Se,
        ReactCurrentOwner: se
      };
      tt.ReactDebugCurrentFrame = A, tt.ReactCurrentActQueue = le;
      function dt(m) {
        {
          for (var R = arguments.length, $ = new Array(R > 1 ? R - 1 : 0), K = 1; K < R; K++)
            $[K - 1] = arguments[K];
          he("warn", m, $);
        }
      }
      function Oe(m) {
        {
          for (var R = arguments.length, $ = new Array(R > 1 ? R - 1 : 0), K = 1; K < R; K++)
            $[K - 1] = arguments[K];
          he("error", m, $);
        }
      }
      function he(m, R, $) {
        {
          var K = tt.ReactDebugCurrentFrame, we = K.getStackAddendum();
          we !== "" && (R += "%s", $ = $.concat([we]));
          var at = $.map(function(ke) {
            return String(ke);
          });
          at.unshift("Warning: " + R), Function.prototype.apply.call(console[m], console, at);
        }
      }
      var He = {};
      function Re(m, R) {
        {
          var $ = m.constructor, K = $ && ($.displayName || $.name) || "ReactClass", we = K + "." + R;
          if (He[we])
            return;
          Oe("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", R, K), He[we] = !0;
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
        enqueueForceUpdate: function(m, R, $) {
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
        enqueueReplaceState: function(m, R, $, K) {
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
        enqueueSetState: function(m, R, $, K) {
          Re(m, "setState");
        }
      }, M = Object.assign, Ne = {};
      Object.freeze(Ne);
      function Ie(m, R, $) {
        this.props = m, this.context = R, this.refs = Ne, this.updater = $ || T;
      }
      Ie.prototype.isReactComponent = {}, Ie.prototype.setState = function(m, R) {
        if (typeof m != "object" && typeof m != "function" && m != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, m, R, "setState");
      }, Ie.prototype.forceUpdate = function(m) {
        this.updater.enqueueForceUpdate(this, m, "forceUpdate");
      };
      {
        var bt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, gt = function(m, R) {
          Object.defineProperty(Ie.prototype, m, {
            get: function() {
              dt("%s(...) is deprecated in plain JavaScript React classes. %s", R[0], R[1]);
            }
          });
        };
        for (var vt in bt)
          bt.hasOwnProperty(vt) && gt(vt, bt[vt]);
      }
      function Ct() {
      }
      Ct.prototype = Ie.prototype;
      function wt(m, R, $) {
        this.props = m, this.context = R, this.refs = Ne, this.updater = $ || T;
      }
      var Bt = wt.prototype = new Ct();
      Bt.constructor = wt, M(Bt, Ie.prototype), Bt.isPureReactComponent = !0;
      function jn() {
        var m = {
          current: null
        };
        return Object.seal(m), m;
      }
      var cr = Array.isArray;
      function bn(m) {
        return cr(m);
      }
      function Xn(m) {
        {
          var R = typeof Symbol == "function" && Symbol.toStringTag, $ = R && m[Symbol.toStringTag] || m.constructor.name || "Object";
          return $;
        }
      }
      function Mn(m) {
        try {
          return En(m), !1;
        } catch {
          return !0;
        }
      }
      function En(m) {
        return "" + m;
      }
      function Rr(m) {
        if (Mn(m))
          return Oe("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Xn(m)), En(m);
      }
      function _a(m, R, $) {
        var K = m.displayName;
        if (K)
          return K;
        var we = R.displayName || R.name || "";
        return we !== "" ? $ + "(" + we + ")" : $;
      }
      function Or(m) {
        return m.displayName || "Context";
      }
      function Ge(m) {
        if (m == null)
          return null;
        if (typeof m.tag == "number" && Oe("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof m == "function")
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
          case W:
            return "SuspenseList";
        }
        if (typeof m == "object")
          switch (m.$$typeof) {
            case z:
              var R = m;
              return Or(R) + ".Consumer";
            case L:
              var $ = m;
              return Or($._context) + ".Provider";
            case ge:
              return _a(m, m.render, "ForwardRef");
            case te:
              var K = m.displayName || null;
              return K !== null ? K : Ge(m.type) || "Memo";
            case ne: {
              var we = m, at = we._payload, ke = we._init;
              try {
                return Ge(ke(at));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var G = Object.prototype.hasOwnProperty, Xe = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Lt, wn, Jt;
      Jt = {};
      function vn(m) {
        if (G.call(m, "ref")) {
          var R = Object.getOwnPropertyDescriptor(m, "ref").get;
          if (R && R.isReactWarning)
            return !1;
        }
        return m.ref !== void 0;
      }
      function On(m) {
        if (G.call(m, "key")) {
          var R = Object.getOwnPropertyDescriptor(m, "key").get;
          if (R && R.isReactWarning)
            return !1;
        }
        return m.key !== void 0;
      }
      function rr(m, R) {
        var $ = function() {
          Lt || (Lt = !0, Oe("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", R));
        };
        $.isReactWarning = !0, Object.defineProperty(m, "key", {
          get: $,
          configurable: !0
        });
      }
      function hn(m, R) {
        var $ = function() {
          wn || (wn = !0, Oe("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", R));
        };
        $.isReactWarning = !0, Object.defineProperty(m, "ref", {
          get: $,
          configurable: !0
        });
      }
      function Te(m) {
        if (typeof m.ref == "string" && se.current && m.__self && se.current.stateNode !== m.__self) {
          var R = Ge(se.current.type);
          Jt[R] || (Oe('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', R, m.ref), Jt[R] = !0);
        }
      }
      var qe = function(m, R, $, K, we, at, ke) {
        var ot = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: q,
          // Built-in properties that belong on the element
          type: m,
          key: R,
          ref: $,
          props: ke,
          // Record the component responsible for creating this element.
          _owner: at
        };
        return ot._store = {}, Object.defineProperty(ot._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(ot, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: K
        }), Object.defineProperty(ot, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: we
        }), Object.freeze && (Object.freeze(ot.props), Object.freeze(ot)), ot;
      };
      function Rt(m, R, $) {
        var K, we = {}, at = null, ke = null, ot = null, jt = null;
        if (R != null) {
          vn(R) && (ke = R.ref, Te(R)), On(R) && (Rr(R.key), at = "" + R.key), ot = R.__self === void 0 ? null : R.__self, jt = R.__source === void 0 ? null : R.__source;
          for (K in R)
            G.call(R, K) && !Xe.hasOwnProperty(K) && (we[K] = R[K]);
        }
        var Ht = arguments.length - 2;
        if (Ht === 1)
          we.children = $;
        else if (Ht > 1) {
          for (var dn = Array(Ht), nn = 0; nn < Ht; nn++)
            dn[nn] = arguments[nn + 2];
          Object.freeze && Object.freeze(dn), we.children = dn;
        }
        if (m && m.defaultProps) {
          var _t = m.defaultProps;
          for (K in _t)
            we[K] === void 0 && (we[K] = _t[K]);
        }
        if (at || ke) {
          var rn = typeof m == "function" ? m.displayName || m.name || "Unknown" : m;
          at && rr(we, rn), ke && hn(we, rn);
        }
        return qe(m, at, ke, ot, jt, se.current, we);
      }
      function Kt(m, R) {
        var $ = qe(m.type, R, m.ref, m._self, m._source, m._owner, m.props);
        return $;
      }
      function sn(m, R, $) {
        if (m == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + m + ".");
        var K, we = M({}, m.props), at = m.key, ke = m.ref, ot = m._self, jt = m._source, Ht = m._owner;
        if (R != null) {
          vn(R) && (ke = R.ref, Ht = se.current), On(R) && (Rr(R.key), at = "" + R.key);
          var dn;
          m.type && m.type.defaultProps && (dn = m.type.defaultProps);
          for (K in R)
            G.call(R, K) && !Xe.hasOwnProperty(K) && (R[K] === void 0 && dn !== void 0 ? we[K] = dn[K] : we[K] = R[K]);
        }
        var nn = arguments.length - 2;
        if (nn === 1)
          we.children = $;
        else if (nn > 1) {
          for (var _t = Array(nn), rn = 0; rn < nn; rn++)
            _t[rn] = arguments[rn + 2];
          we.children = _t;
        }
        return qe(m.type, at, ke, ot, jt, Ht, we);
      }
      function Tn(m) {
        return typeof m == "object" && m !== null && m.$$typeof === q;
      }
      var mn = ".", ar = ":";
      function cn(m) {
        var R = /[=:]/g, $ = {
          "=": "=0",
          ":": "=2"
        }, K = m.replace(R, function(we) {
          return $[we];
        });
        return "$" + K;
      }
      var Zt = !1, en = /\/+/g;
      function va(m) {
        return m.replace(en, "$&/");
      }
      function _r(m, R) {
        return typeof m == "object" && m !== null && m.key != null ? (Rr(m.key), cn("" + m.key)) : R.toString(36);
      }
      function ka(m, R, $, K, we) {
        var at = typeof m;
        (at === "undefined" || at === "boolean") && (m = null);
        var ke = !1;
        if (m === null)
          ke = !0;
        else
          switch (at) {
            case "string":
            case "number":
              ke = !0;
              break;
            case "object":
              switch (m.$$typeof) {
                case q:
                case ee:
                  ke = !0;
              }
          }
        if (ke) {
          var ot = m, jt = we(ot), Ht = K === "" ? mn + _r(ot, 0) : K;
          if (bn(jt)) {
            var dn = "";
            Ht != null && (dn = va(Ht) + "/"), ka(jt, R, dn, "", function(Zf) {
              return Zf;
            });
          } else jt != null && (Tn(jt) && (jt.key && (!ot || ot.key !== jt.key) && Rr(jt.key), jt = Kt(
            jt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            $ + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (jt.key && (!ot || ot.key !== jt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              va("" + jt.key) + "/"
            ) : "") + Ht
          )), R.push(jt));
          return 1;
        }
        var nn, _t, rn = 0, Rn = K === "" ? mn : K + ar;
        if (bn(m))
          for (var bl = 0; bl < m.length; bl++)
            nn = m[bl], _t = Rn + _r(nn, bl), rn += ka(nn, R, $, _t, we);
        else {
          var Xu = oe(m);
          if (typeof Xu == "function") {
            var Bi = m;
            Xu === Bi.entries && (Zt || dt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Zt = !0);
            for (var Ju = Xu.call(Bi), co, Jf = 0; !(co = Ju.next()).done; )
              nn = co.value, _t = Rn + _r(nn, Jf++), rn += ka(nn, R, $, _t, we);
          } else if (at === "object") {
            var fc = String(m);
            throw new Error("Objects are not valid as a React child (found: " + (fc === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : fc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return rn;
      }
      function Pi(m, R, $) {
        if (m == null)
          return m;
        var K = [], we = 0;
        return ka(m, K, "", "", function(at) {
          return R.call($, at, we++);
        }), K;
      }
      function to(m) {
        var R = 0;
        return Pi(m, function() {
          R++;
        }), R;
      }
      function no(m, R, $) {
        Pi(m, function() {
          R.apply(this, arguments);
        }, $);
      }
      function vl(m) {
        return Pi(m, function(R) {
          return R;
        }) || [];
      }
      function hl(m) {
        if (!Tn(m))
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
        var $ = !1, K = !1, we = !1;
        {
          var at = {
            $$typeof: z,
            _context: R
          };
          Object.defineProperties(at, {
            Provider: {
              get: function() {
                return K || (K = !0, Oe("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), R.Provider;
              },
              set: function(ke) {
                R.Provider = ke;
              }
            },
            _currentValue: {
              get: function() {
                return R._currentValue;
              },
              set: function(ke) {
                R._currentValue = ke;
              }
            },
            _currentValue2: {
              get: function() {
                return R._currentValue2;
              },
              set: function(ke) {
                R._currentValue2 = ke;
              }
            },
            _threadCount: {
              get: function() {
                return R._threadCount;
              },
              set: function(ke) {
                R._threadCount = ke;
              }
            },
            Consumer: {
              get: function() {
                return $ || ($ = !0, Oe("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), R.Consumer;
              }
            },
            displayName: {
              get: function() {
                return R.displayName;
              },
              set: function(ke) {
                we || (dt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", ke), we = !0);
              }
            }
          }), R.Consumer = at;
        }
        return R._currentRenderer = null, R._currentRenderer2 = null, R;
      }
      var Lr = -1, Mr = 0, fr = 1, di = 2;
      function Ka(m) {
        if (m._status === Lr) {
          var R = m._result, $ = R();
          if ($.then(function(at) {
            if (m._status === Mr || m._status === Lr) {
              var ke = m;
              ke._status = fr, ke._result = at;
            }
          }, function(at) {
            if (m._status === Mr || m._status === Lr) {
              var ke = m;
              ke._status = di, ke._result = at;
            }
          }), m._status === Lr) {
            var K = m;
            K._status = Mr, K._result = $;
          }
        }
        if (m._status === fr) {
          var we = m._result;
          return we === void 0 && Oe(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, we), "default" in we || Oe(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, we), we.default;
        } else
          throw m._result;
      }
      function pi(m) {
        var R = {
          // We use these fields to store the result.
          _status: Lr,
          _result: m
        }, $ = {
          $$typeof: ne,
          _payload: R,
          _init: Ka
        };
        {
          var K, we;
          Object.defineProperties($, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return K;
              },
              set: function(at) {
                Oe("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), K = at, Object.defineProperty($, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return we;
              },
              set: function(at) {
                Oe("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), we = at, Object.defineProperty($, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return $;
      }
      function vi(m) {
        m != null && m.$$typeof === te ? Oe("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof m != "function" ? Oe("forwardRef requires a render function but was given %s.", m === null ? "null" : typeof m) : m.length !== 0 && m.length !== 2 && Oe("forwardRef render functions accept exactly two parameters: props and ref. %s", m.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), m != null && (m.defaultProps != null || m.propTypes != null) && Oe("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var R = {
          $$typeof: ge,
          render: m
        };
        {
          var $;
          Object.defineProperty(R, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return $;
            },
            set: function(K) {
              $ = K, !m.name && !m.displayName && (m.displayName = K);
            }
          });
        }
        return R;
      }
      var _;
      _ = Symbol.for("react.module.reference");
      function ce(m) {
        return !!(typeof m == "string" || typeof m == "function" || m === D || m === ae || ze || m === g || m === P || m === W || re || m === X || be || De || Je || typeof m == "object" && m !== null && (m.$$typeof === ne || m.$$typeof === te || m.$$typeof === L || m.$$typeof === z || m.$$typeof === ge || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        m.$$typeof === _ || m.getModuleId !== void 0));
      }
      function Le(m, R) {
        ce(m) || Oe("memo: The first argument must be a component. Instead received: %s", m === null ? "null" : typeof m);
        var $ = {
          $$typeof: te,
          type: m,
          compare: R === void 0 ? null : R
        };
        {
          var K;
          Object.defineProperty($, "displayName", {
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
        return $;
      }
      function $e() {
        var m = Ee.current;
        return m === null && Oe(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), m;
      }
      function St(m) {
        var R = $e();
        if (m._context !== void 0) {
          var $ = m._context;
          $.Consumer === m ? Oe("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : $.Provider === m && Oe("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return R.useContext(m);
      }
      function ht(m) {
        var R = $e();
        return R.useState(m);
      }
      function Nt(m, R, $) {
        var K = $e();
        return K.useReducer(m, R, $);
      }
      function kt(m) {
        var R = $e();
        return R.useRef(m);
      }
      function An(m, R) {
        var $ = $e();
        return $.useEffect(m, R);
      }
      function fn(m, R) {
        var $ = $e();
        return $.useInsertionEffect(m, R);
      }
      function yn(m, R) {
        var $ = $e();
        return $.useLayoutEffect(m, R);
      }
      function dr(m, R) {
        var $ = $e();
        return $.useCallback(m, R);
      }
      function qa(m, R) {
        var $ = $e();
        return $.useMemo(m, R);
      }
      function Xa(m, R, $) {
        var K = $e();
        return K.useImperativeHandle(m, R, $);
      }
      function Et(m, R) {
        {
          var $ = $e();
          return $.useDebugValue(m, R);
        }
      }
      function Tt() {
        var m = $e();
        return m.useTransition();
      }
      function Ja(m) {
        var R = $e();
        return R.useDeferredValue(m);
      }
      function ao() {
        var m = $e();
        return m.useId();
      }
      function io(m, R, $) {
        var K = $e();
        return K.useSyncExternalStore(m, R, $);
      }
      var ml = 0, qo, yl, Xr, Wu, Ar, sc, cc;
      function Xo() {
      }
      Xo.__reactDisabledLog = !0;
      function gl() {
        {
          if (ml === 0) {
            qo = console.log, yl = console.info, Xr = console.warn, Wu = console.error, Ar = console.group, sc = console.groupCollapsed, cc = console.groupEnd;
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
      function ha() {
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
                value: Xr
              }),
              error: M({}, m, {
                value: Wu
              }),
              group: M({}, m, {
                value: Ar
              }),
              groupCollapsed: M({}, m, {
                value: sc
              }),
              groupEnd: M({}, m, {
                value: cc
              })
            });
          }
          ml < 0 && Oe("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Za = tt.ReactCurrentDispatcher, ei;
      function Jo(m, R, $) {
        {
          if (ei === void 0)
            try {
              throw Error();
            } catch (we) {
              var K = we.stack.trim().match(/\n( *(at )?)/);
              ei = K && K[1] || "";
            }
          return `
` + ei + m;
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
          var $ = Sl.get(m);
          if ($ !== void 0)
            return $;
        }
        var K;
        lo = !0;
        var we = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var at;
        at = Za.current, Za.current = null, gl();
        try {
          if (R) {
            var ke = function() {
              throw Error();
            };
            if (Object.defineProperty(ke.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(ke, []);
              } catch (Rn) {
                K = Rn;
              }
              Reflect.construct(m, [], ke);
            } else {
              try {
                ke.call();
              } catch (Rn) {
                K = Rn;
              }
              m.call(ke.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (Rn) {
              K = Rn;
            }
            m();
          }
        } catch (Rn) {
          if (Rn && K && typeof Rn.stack == "string") {
            for (var ot = Rn.stack.split(`
`), jt = K.stack.split(`
`), Ht = ot.length - 1, dn = jt.length - 1; Ht >= 1 && dn >= 0 && ot[Ht] !== jt[dn]; )
              dn--;
            for (; Ht >= 1 && dn >= 0; Ht--, dn--)
              if (ot[Ht] !== jt[dn]) {
                if (Ht !== 1 || dn !== 1)
                  do
                    if (Ht--, dn--, dn < 0 || ot[Ht] !== jt[dn]) {
                      var nn = `
` + ot[Ht].replace(" at new ", " at ");
                      return m.displayName && nn.includes("<anonymous>") && (nn = nn.replace("<anonymous>", m.displayName)), typeof m == "function" && Sl.set(m, nn), nn;
                    }
                  while (Ht >= 1 && dn >= 0);
                break;
              }
          }
        } finally {
          lo = !1, Za.current = at, ha(), Error.prepareStackTrace = we;
        }
        var _t = m ? m.displayName || m.name : "", rn = _t ? Jo(_t) : "";
        return typeof m == "function" && Sl.set(m, rn), rn;
      }
      function Hi(m, R, $) {
        return eu(m, !1);
      }
      function qf(m) {
        var R = m.prototype;
        return !!(R && R.isReactComponent);
      }
      function Vi(m, R, $) {
        if (m == null)
          return "";
        if (typeof m == "function")
          return eu(m, qf(m));
        if (typeof m == "string")
          return Jo(m);
        switch (m) {
          case P:
            return Jo("Suspense");
          case W:
            return Jo("SuspenseList");
        }
        if (typeof m == "object")
          switch (m.$$typeof) {
            case ge:
              return Hi(m.render);
            case te:
              return Vi(m.type, R, $);
            case ne: {
              var K = m, we = K._payload, at = K._init;
              try {
                return Vi(at(we), R, $);
              } catch {
              }
            }
          }
        return "";
      }
      var It = {}, tu = tt.ReactDebugCurrentFrame;
      function Pt(m) {
        if (m) {
          var R = m._owner, $ = Vi(m.type, m._source, R ? R.type : null);
          tu.setExtraStackFrame($);
        } else
          tu.setExtraStackFrame(null);
      }
      function Gu(m, R, $, K, we) {
        {
          var at = Function.call.bind(G);
          for (var ke in m)
            if (at(m, ke)) {
              var ot = void 0;
              try {
                if (typeof m[ke] != "function") {
                  var jt = Error((K || "React class") + ": " + $ + " type `" + ke + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof m[ke] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw jt.name = "Invariant Violation", jt;
                }
                ot = m[ke](R, ke, K, $, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Ht) {
                ot = Ht;
              }
              ot && !(ot instanceof Error) && (Pt(we), Oe("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", K || "React class", $, ke, typeof ot), Pt(null)), ot instanceof Error && !(ot.message in It) && (It[ot.message] = !0, Pt(we), Oe("Failed %s type: %s", $, ot.message), Pt(null));
            }
        }
      }
      function hi(m) {
        if (m) {
          var R = m._owner, $ = Vi(m.type, m._source, R ? R.type : null);
          ue($);
        } else
          ue(null);
      }
      var pt;
      pt = !1;
      function nu() {
        if (se.current) {
          var m = Ge(se.current.type);
          if (m)
            return `

Check the render method of \`` + m + "`.";
        }
        return "";
      }
      function pr(m) {
        if (m !== void 0) {
          var R = m.fileName.replace(/^.*[\\\/]/, ""), $ = m.lineNumber;
          return `

Check your code at ` + R + ":" + $ + ".";
        }
        return "";
      }
      function mi(m) {
        return m != null ? pr(m.__source) : "";
      }
      var zr = {};
      function yi(m) {
        var R = nu();
        if (!R) {
          var $ = typeof m == "string" ? m : m.displayName || m.name;
          $ && (R = `

Check the top-level render call using <` + $ + ">.");
        }
        return R;
      }
      function gn(m, R) {
        if (!(!m._store || m._store.validated || m.key != null)) {
          m._store.validated = !0;
          var $ = yi(R);
          if (!zr[$]) {
            zr[$] = !0;
            var K = "";
            m && m._owner && m._owner !== se.current && (K = " It was passed a child from " + Ge(m._owner.type) + "."), hi(m), Oe('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', $, K), hi(null);
          }
        }
      }
      function tn(m, R) {
        if (typeof m == "object") {
          if (bn(m))
            for (var $ = 0; $ < m.length; $++) {
              var K = m[$];
              Tn(K) && gn(K, R);
            }
          else if (Tn(m))
            m._store && (m._store.validated = !0);
          else if (m) {
            var we = oe(m);
            if (typeof we == "function" && we !== m.entries)
              for (var at = we.call(m), ke; !(ke = at.next()).done; )
                Tn(ke.value) && gn(ke.value, R);
          }
        }
      }
      function El(m) {
        {
          var R = m.type;
          if (R == null || typeof R == "string")
            return;
          var $;
          if (typeof R == "function")
            $ = R.propTypes;
          else if (typeof R == "object" && (R.$$typeof === ge || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          R.$$typeof === te))
            $ = R.propTypes;
          else
            return;
          if ($) {
            var K = Ge(R);
            Gu($, m.props, "prop", K, m);
          } else if (R.PropTypes !== void 0 && !pt) {
            pt = !0;
            var we = Ge(R);
            Oe("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", we || "Unknown");
          }
          typeof R.getDefaultProps == "function" && !R.getDefaultProps.isReactClassApproved && Oe("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Jn(m) {
        {
          for (var R = Object.keys(m.props), $ = 0; $ < R.length; $++) {
            var K = R[$];
            if (K !== "children" && K !== "key") {
              hi(m), Oe("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", K), hi(null);
              break;
            }
          }
          m.ref !== null && (hi(m), Oe("Invalid attribute `ref` supplied to `React.Fragment`."), hi(null));
        }
      }
      function Ur(m, R, $) {
        var K = ce(m);
        if (!K) {
          var we = "";
          (m === void 0 || typeof m == "object" && m !== null && Object.keys(m).length === 0) && (we += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var at = mi(R);
          at ? we += at : we += nu();
          var ke;
          m === null ? ke = "null" : bn(m) ? ke = "array" : m !== void 0 && m.$$typeof === q ? (ke = "<" + (Ge(m.type) || "Unknown") + " />", we = " Did you accidentally export a JSX literal instead of a component?") : ke = typeof m, Oe("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ke, we);
        }
        var ot = Rt.apply(this, arguments);
        if (ot == null)
          return ot;
        if (K)
          for (var jt = 2; jt < arguments.length; jt++)
            tn(arguments[jt], m);
        return m === D ? Jn(ot) : El(ot), ot;
      }
      var Da = !1;
      function oo(m) {
        var R = Ur.bind(null, m);
        return R.type = m, Da || (Da = !0, dt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(R, "type", {
          enumerable: !1,
          get: function() {
            return dt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: m
            }), m;
          }
        }), R;
      }
      function Ku(m, R, $) {
        for (var K = sn.apply(this, arguments), we = 2; we < arguments.length; we++)
          tn(arguments[we], K.type);
        return El(K), K;
      }
      function qu(m, R) {
        var $ = Se.transition;
        Se.transition = {};
        var K = Se.transition;
        Se.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          m();
        } finally {
          if (Se.transition = $, $ === null && K._updatedFibers) {
            var we = K._updatedFibers.size;
            we > 10 && dt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), K._updatedFibers.clear();
          }
        }
      }
      var Cl = !1, uo = null;
      function Xf(m) {
        if (uo === null)
          try {
            var R = ("require" + Math.random()).slice(0, 7), $ = x && x[R];
            uo = $.call(x, "timers").setImmediate;
          } catch {
            uo = function(we) {
              Cl === !1 && (Cl = !0, typeof MessageChannel > "u" && Oe("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var at = new MessageChannel();
              at.port1.onmessage = we, at.port2.postMessage(void 0);
            };
          }
        return uo(m);
      }
      var Na = 0, ti = !1;
      function gi(m) {
        {
          var R = Na;
          Na++, le.current === null && (le.current = []);
          var $ = le.isBatchingLegacy, K;
          try {
            if (le.isBatchingLegacy = !0, K = m(), !$ && le.didScheduleLegacyUpdate) {
              var we = le.current;
              we !== null && (le.didScheduleLegacyUpdate = !1, xl(we));
            }
          } catch (_t) {
            throw ja(R), _t;
          } finally {
            le.isBatchingLegacy = $;
          }
          if (K !== null && typeof K == "object" && typeof K.then == "function") {
            var at = K, ke = !1, ot = {
              then: function(_t, rn) {
                ke = !0, at.then(function(Rn) {
                  ja(R), Na === 0 ? ru(Rn, _t, rn) : _t(Rn);
                }, function(Rn) {
                  ja(R), rn(Rn);
                });
              }
            };
            return !ti && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              ke || (ti = !0, Oe("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), ot;
          } else {
            var jt = K;
            if (ja(R), Na === 0) {
              var Ht = le.current;
              Ht !== null && (xl(Ht), le.current = null);
              var dn = {
                then: function(_t, rn) {
                  le.current === null ? (le.current = [], ru(jt, _t, rn)) : _t(jt);
                }
              };
              return dn;
            } else {
              var nn = {
                then: function(_t, rn) {
                  _t(jt);
                }
              };
              return nn;
            }
          }
        }
      }
      function ja(m) {
        m !== Na - 1 && Oe("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Na = m;
      }
      function ru(m, R, $) {
        {
          var K = le.current;
          if (K !== null)
            try {
              xl(K), Xf(function() {
                K.length === 0 ? (le.current = null, R(m)) : ru(m, R, $);
              });
            } catch (we) {
              $(we);
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
              var $ = m[R];
              do
                $ = $(!0);
              while ($ !== null);
            }
            m.length = 0;
          } catch (K) {
            throw m = m.slice(R + 1), K;
          } finally {
            au = !1;
          }
        }
      }
      var so = Ur, iu = Ku, lu = oo, ni = {
        map: Pi,
        forEach: no,
        count: to,
        toArray: vl,
        only: hl
      };
      E.Children = ni, E.Component = Ie, E.Fragment = D, E.Profiler = ae, E.PureComponent = wt, E.StrictMode = g, E.Suspense = P, E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tt, E.act = gi, E.cloneElement = iu, E.createContext = ro, E.createElement = so, E.createFactory = lu, E.createRef = jn, E.forwardRef = vi, E.isValidElement = Tn, E.lazy = pi, E.memo = Le, E.startTransition = qu, E.unstable_act = gi, E.useCallback = dr, E.useContext = St, E.useDebugValue = Et, E.useDeferredValue = Ja, E.useEffect = An, E.useId = ao, E.useImperativeHandle = Xa, E.useInsertionEffect = fn, E.useLayoutEffect = yn, E.useMemo = qa, E.useReducer = Nt, E.useRef = kt, E.useState = ht, E.useSyncExternalStore = io, E.useTransition = Tt, E.version = b, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(iv, iv.exports)), iv.exports;
}
process.env.NODE_ENV === "production" ? TE.exports = gD() : TE.exports = SD();
var F = TE.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var c0;
function ED() {
  if (c0) return tv;
  c0 = 1;
  var x = F, E = Symbol.for("react.element"), b = Symbol.for("react.fragment"), q = Object.prototype.hasOwnProperty, ee = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, D = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(ae, L, z) {
    var ge, P = {}, W = null, te = null;
    z !== void 0 && (W = "" + z), L.key !== void 0 && (W = "" + L.key), L.ref !== void 0 && (te = L.ref);
    for (ge in L) q.call(L, ge) && !D.hasOwnProperty(ge) && (P[ge] = L[ge]);
    if (ae && ae.defaultProps) for (ge in L = ae.defaultProps, L) P[ge] === void 0 && (P[ge] = L[ge]);
    return { $$typeof: E, type: ae, key: W, ref: te, props: P, _owner: ee.current };
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
var f0;
function CD() {
  return f0 || (f0 = 1, process.env.NODE_ENV !== "production" && function() {
    var x = F, E = Symbol.for("react.element"), b = Symbol.for("react.portal"), q = Symbol.for("react.fragment"), ee = Symbol.for("react.strict_mode"), D = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), ae = Symbol.for("react.context"), L = Symbol.for("react.forward_ref"), z = Symbol.for("react.suspense"), ge = Symbol.for("react.suspense_list"), P = Symbol.for("react.memo"), W = Symbol.for("react.lazy"), te = Symbol.for("react.offscreen"), ne = Symbol.iterator, X = "@@iterator";
    function fe(_) {
      if (_ === null || typeof _ != "object")
        return null;
      var ce = ne && _[ne] || _[X];
      return typeof ce == "function" ? ce : null;
    }
    var je = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function oe(_) {
      {
        for (var ce = arguments.length, Le = new Array(ce > 1 ? ce - 1 : 0), $e = 1; $e < ce; $e++)
          Le[$e - 1] = arguments[$e];
        Ee("error", _, Le);
      }
    }
    function Ee(_, ce, Le) {
      {
        var $e = je.ReactDebugCurrentFrame, St = $e.getStackAddendum();
        St !== "" && (ce += "%s", Le = Le.concat([St]));
        var ht = Le.map(function(Nt) {
          return String(Nt);
        });
        ht.unshift("Warning: " + ce), Function.prototype.apply.call(console[_], console, ht);
      }
    }
    var Se = !1, le = !1, se = !1, A = !1, pe = !1, ue;
    ue = Symbol.for("react.module.reference");
    function be(_) {
      return !!(typeof _ == "string" || typeof _ == "function" || _ === q || _ === D || pe || _ === ee || _ === z || _ === ge || A || _ === te || Se || le || se || typeof _ == "object" && _ !== null && (_.$$typeof === W || _.$$typeof === P || _.$$typeof === g || _.$$typeof === ae || _.$$typeof === L || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      _.$$typeof === ue || _.getModuleId !== void 0));
    }
    function De(_, ce, Le) {
      var $e = _.displayName;
      if ($e)
        return $e;
      var St = ce.displayName || ce.name || "";
      return St !== "" ? Le + "(" + St + ")" : Le;
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
            var Le = _;
            return Je(Le._context) + ".Provider";
          case L:
            return De(_, _.render, "ForwardRef");
          case P:
            var $e = _.displayName || null;
            return $e !== null ? $e : re(_.type) || "Memo";
          case W: {
            var St = _, ht = St._payload, Nt = St._init;
            try {
              return re(Nt(ht));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var ze = Object.assign, tt = 0, dt, Oe, he, He, Re, T, M;
    function Ne() {
    }
    Ne.__reactDisabledLog = !0;
    function Ie() {
      {
        if (tt === 0) {
          dt = console.log, Oe = console.info, he = console.warn, He = console.error, Re = console.group, T = console.groupCollapsed, M = console.groupEnd;
          var _ = {
            configurable: !0,
            enumerable: !0,
            value: Ne,
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
        tt++;
      }
    }
    function bt() {
      {
        if (tt--, tt === 0) {
          var _ = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: ze({}, _, {
              value: dt
            }),
            info: ze({}, _, {
              value: Oe
            }),
            warn: ze({}, _, {
              value: he
            }),
            error: ze({}, _, {
              value: He
            }),
            group: ze({}, _, {
              value: Re
            }),
            groupCollapsed: ze({}, _, {
              value: T
            }),
            groupEnd: ze({}, _, {
              value: M
            })
          });
        }
        tt < 0 && oe("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var gt = je.ReactCurrentDispatcher, vt;
    function Ct(_, ce, Le) {
      {
        if (vt === void 0)
          try {
            throw Error();
          } catch (St) {
            var $e = St.stack.trim().match(/\n( *(at )?)/);
            vt = $e && $e[1] || "";
          }
        return `
` + vt + _;
      }
    }
    var wt = !1, Bt;
    {
      var jn = typeof WeakMap == "function" ? WeakMap : Map;
      Bt = new jn();
    }
    function cr(_, ce) {
      if (!_ || wt)
        return "";
      {
        var Le = Bt.get(_);
        if (Le !== void 0)
          return Le;
      }
      var $e;
      wt = !0;
      var St = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var ht;
      ht = gt.current, gt.current = null, Ie();
      try {
        if (ce) {
          var Nt = function() {
            throw Error();
          };
          if (Object.defineProperty(Nt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Nt, []);
            } catch (Et) {
              $e = Et;
            }
            Reflect.construct(_, [], Nt);
          } else {
            try {
              Nt.call();
            } catch (Et) {
              $e = Et;
            }
            _.call(Nt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Et) {
            $e = Et;
          }
          _();
        }
      } catch (Et) {
        if (Et && $e && typeof Et.stack == "string") {
          for (var kt = Et.stack.split(`
`), An = $e.stack.split(`
`), fn = kt.length - 1, yn = An.length - 1; fn >= 1 && yn >= 0 && kt[fn] !== An[yn]; )
            yn--;
          for (; fn >= 1 && yn >= 0; fn--, yn--)
            if (kt[fn] !== An[yn]) {
              if (fn !== 1 || yn !== 1)
                do
                  if (fn--, yn--, yn < 0 || kt[fn] !== An[yn]) {
                    var dr = `
` + kt[fn].replace(" at new ", " at ");
                    return _.displayName && dr.includes("<anonymous>") && (dr = dr.replace("<anonymous>", _.displayName)), typeof _ == "function" && Bt.set(_, dr), dr;
                  }
                while (fn >= 1 && yn >= 0);
              break;
            }
        }
      } finally {
        wt = !1, gt.current = ht, bt(), Error.prepareStackTrace = St;
      }
      var qa = _ ? _.displayName || _.name : "", Xa = qa ? Ct(qa) : "";
      return typeof _ == "function" && Bt.set(_, Xa), Xa;
    }
    function bn(_, ce, Le) {
      return cr(_, !1);
    }
    function Xn(_) {
      var ce = _.prototype;
      return !!(ce && ce.isReactComponent);
    }
    function Mn(_, ce, Le) {
      if (_ == null)
        return "";
      if (typeof _ == "function")
        return cr(_, Xn(_));
      if (typeof _ == "string")
        return Ct(_);
      switch (_) {
        case z:
          return Ct("Suspense");
        case ge:
          return Ct("SuspenseList");
      }
      if (typeof _ == "object")
        switch (_.$$typeof) {
          case L:
            return bn(_.render);
          case P:
            return Mn(_.type, ce, Le);
          case W: {
            var $e = _, St = $e._payload, ht = $e._init;
            try {
              return Mn(ht(St), ce, Le);
            } catch {
            }
          }
        }
      return "";
    }
    var En = Object.prototype.hasOwnProperty, Rr = {}, _a = je.ReactDebugCurrentFrame;
    function Or(_) {
      if (_) {
        var ce = _._owner, Le = Mn(_.type, _._source, ce ? ce.type : null);
        _a.setExtraStackFrame(Le);
      } else
        _a.setExtraStackFrame(null);
    }
    function Ge(_, ce, Le, $e, St) {
      {
        var ht = Function.call.bind(En);
        for (var Nt in _)
          if (ht(_, Nt)) {
            var kt = void 0;
            try {
              if (typeof _[Nt] != "function") {
                var An = Error(($e || "React class") + ": " + Le + " type `" + Nt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof _[Nt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw An.name = "Invariant Violation", An;
              }
              kt = _[Nt](ce, Nt, $e, Le, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (fn) {
              kt = fn;
            }
            kt && !(kt instanceof Error) && (Or(St), oe("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", $e || "React class", Le, Nt, typeof kt), Or(null)), kt instanceof Error && !(kt.message in Rr) && (Rr[kt.message] = !0, Or(St), oe("Failed %s type: %s", Le, kt.message), Or(null));
          }
      }
    }
    var G = Array.isArray;
    function Xe(_) {
      return G(_);
    }
    function Lt(_) {
      {
        var ce = typeof Symbol == "function" && Symbol.toStringTag, Le = ce && _[Symbol.toStringTag] || _.constructor.name || "Object";
        return Le;
      }
    }
    function wn(_) {
      try {
        return Jt(_), !1;
      } catch {
        return !0;
      }
    }
    function Jt(_) {
      return "" + _;
    }
    function vn(_) {
      if (wn(_))
        return oe("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Lt(_)), Jt(_);
    }
    var On = je.ReactCurrentOwner, rr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, hn, Te;
    function qe(_) {
      if (En.call(_, "ref")) {
        var ce = Object.getOwnPropertyDescriptor(_, "ref").get;
        if (ce && ce.isReactWarning)
          return !1;
      }
      return _.ref !== void 0;
    }
    function Rt(_) {
      if (En.call(_, "key")) {
        var ce = Object.getOwnPropertyDescriptor(_, "key").get;
        if (ce && ce.isReactWarning)
          return !1;
      }
      return _.key !== void 0;
    }
    function Kt(_, ce) {
      typeof _.ref == "string" && On.current;
    }
    function sn(_, ce) {
      {
        var Le = function() {
          hn || (hn = !0, oe("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ce));
        };
        Le.isReactWarning = !0, Object.defineProperty(_, "key", {
          get: Le,
          configurable: !0
        });
      }
    }
    function Tn(_, ce) {
      {
        var Le = function() {
          Te || (Te = !0, oe("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ce));
        };
        Le.isReactWarning = !0, Object.defineProperty(_, "ref", {
          get: Le,
          configurable: !0
        });
      }
    }
    var mn = function(_, ce, Le, $e, St, ht, Nt) {
      var kt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: E,
        // Built-in properties that belong on the element
        type: _,
        key: ce,
        ref: Le,
        props: Nt,
        // Record the component responsible for creating this element.
        _owner: ht
      };
      return kt._store = {}, Object.defineProperty(kt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(kt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: $e
      }), Object.defineProperty(kt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: St
      }), Object.freeze && (Object.freeze(kt.props), Object.freeze(kt)), kt;
    };
    function ar(_, ce, Le, $e, St) {
      {
        var ht, Nt = {}, kt = null, An = null;
        Le !== void 0 && (vn(Le), kt = "" + Le), Rt(ce) && (vn(ce.key), kt = "" + ce.key), qe(ce) && (An = ce.ref, Kt(ce, St));
        for (ht in ce)
          En.call(ce, ht) && !rr.hasOwnProperty(ht) && (Nt[ht] = ce[ht]);
        if (_ && _.defaultProps) {
          var fn = _.defaultProps;
          for (ht in fn)
            Nt[ht] === void 0 && (Nt[ht] = fn[ht]);
        }
        if (kt || An) {
          var yn = typeof _ == "function" ? _.displayName || _.name || "Unknown" : _;
          kt && sn(Nt, yn), An && Tn(Nt, yn);
        }
        return mn(_, kt, An, St, $e, On.current, Nt);
      }
    }
    var cn = je.ReactCurrentOwner, Zt = je.ReactDebugCurrentFrame;
    function en(_) {
      if (_) {
        var ce = _._owner, Le = Mn(_.type, _._source, ce ? ce.type : null);
        Zt.setExtraStackFrame(Le);
      } else
        Zt.setExtraStackFrame(null);
    }
    var va;
    va = !1;
    function _r(_) {
      return typeof _ == "object" && _ !== null && _.$$typeof === E;
    }
    function ka() {
      {
        if (cn.current) {
          var _ = re(cn.current.type);
          if (_)
            return `

Check the render method of \`` + _ + "`.";
        }
        return "";
      }
    }
    function Pi(_) {
      return "";
    }
    var to = {};
    function no(_) {
      {
        var ce = ka();
        if (!ce) {
          var Le = typeof _ == "string" ? _ : _.displayName || _.name;
          Le && (ce = `

Check the top-level render call using <` + Le + ">.");
        }
        return ce;
      }
    }
    function vl(_, ce) {
      {
        if (!_._store || _._store.validated || _.key != null)
          return;
        _._store.validated = !0;
        var Le = no(ce);
        if (to[Le])
          return;
        to[Le] = !0;
        var $e = "";
        _ && _._owner && _._owner !== cn.current && ($e = " It was passed a child from " + re(_._owner.type) + "."), en(_), oe('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', Le, $e), en(null);
      }
    }
    function hl(_, ce) {
      {
        if (typeof _ != "object")
          return;
        if (Xe(_))
          for (var Le = 0; Le < _.length; Le++) {
            var $e = _[Le];
            _r($e) && vl($e, ce);
          }
        else if (_r(_))
          _._store && (_._store.validated = !0);
        else if (_) {
          var St = fe(_);
          if (typeof St == "function" && St !== _.entries)
            for (var ht = St.call(_), Nt; !(Nt = ht.next()).done; )
              _r(Nt.value) && vl(Nt.value, ce);
        }
      }
    }
    function ro(_) {
      {
        var ce = _.type;
        if (ce == null || typeof ce == "string")
          return;
        var Le;
        if (typeof ce == "function")
          Le = ce.propTypes;
        else if (typeof ce == "object" && (ce.$$typeof === L || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        ce.$$typeof === P))
          Le = ce.propTypes;
        else
          return;
        if (Le) {
          var $e = re(ce);
          Ge(Le, _.props, "prop", $e, _);
        } else if (ce.PropTypes !== void 0 && !va) {
          va = !0;
          var St = re(ce);
          oe("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", St || "Unknown");
        }
        typeof ce.getDefaultProps == "function" && !ce.getDefaultProps.isReactClassApproved && oe("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Lr(_) {
      {
        for (var ce = Object.keys(_.props), Le = 0; Le < ce.length; Le++) {
          var $e = ce[Le];
          if ($e !== "children" && $e !== "key") {
            en(_), oe("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", $e), en(null);
            break;
          }
        }
        _.ref !== null && (en(_), oe("Invalid attribute `ref` supplied to `React.Fragment`."), en(null));
      }
    }
    var Mr = {};
    function fr(_, ce, Le, $e, St, ht) {
      {
        var Nt = be(_);
        if (!Nt) {
          var kt = "";
          (_ === void 0 || typeof _ == "object" && _ !== null && Object.keys(_).length === 0) && (kt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var An = Pi();
          An ? kt += An : kt += ka();
          var fn;
          _ === null ? fn = "null" : Xe(_) ? fn = "array" : _ !== void 0 && _.$$typeof === E ? (fn = "<" + (re(_.type) || "Unknown") + " />", kt = " Did you accidentally export a JSX literal instead of a component?") : fn = typeof _, oe("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", fn, kt);
        }
        var yn = ar(_, ce, Le, St, ht);
        if (yn == null)
          return yn;
        if (Nt) {
          var dr = ce.children;
          if (dr !== void 0)
            if ($e)
              if (Xe(dr)) {
                for (var qa = 0; qa < dr.length; qa++)
                  hl(dr[qa], _);
                Object.freeze && Object.freeze(dr);
              } else
                oe("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              hl(dr, _);
        }
        if (En.call(ce, "key")) {
          var Xa = re(_), Et = Object.keys(ce).filter(function(ao) {
            return ao !== "key";
          }), Tt = Et.length > 0 ? "{key: someKey, " + Et.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Mr[Xa + Tt]) {
            var Ja = Et.length > 0 ? "{" + Et.join(": ..., ") + ": ...}" : "{}";
            oe(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Tt, Xa, Ja, Xa), Mr[Xa + Tt] = !0;
          }
        }
        return _ === q ? Lr(yn) : ro(yn), yn;
      }
    }
    function di(_, ce, Le) {
      return fr(_, ce, Le, !0);
    }
    function Ka(_, ce, Le) {
      return fr(_, ce, Le, !1);
    }
    var pi = Ka, vi = di;
    nv.Fragment = q, nv.jsx = pi, nv.jsxs = vi;
  }()), nv;
}
process.env.NODE_ENV === "production" ? wE.exports = ED() : wE.exports = CD();
var p = wE.exports, RE = { exports: {} }, Wa = {}, Jm = { exports: {} }, SE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var d0;
function xD() {
  return d0 || (d0 = 1, function(x) {
    function E(he, He) {
      var Re = he.length;
      he.push(He);
      e: for (; 0 < Re; ) {
        var T = Re - 1 >>> 1, M = he[T];
        if (0 < ee(M, He)) he[T] = He, he[Re] = M, Re = T;
        else break e;
      }
    }
    function b(he) {
      return he.length === 0 ? null : he[0];
    }
    function q(he) {
      if (he.length === 0) return null;
      var He = he[0], Re = he.pop();
      if (Re !== He) {
        he[0] = Re;
        e: for (var T = 0, M = he.length, Ne = M >>> 1; T < Ne; ) {
          var Ie = 2 * (T + 1) - 1, bt = he[Ie], gt = Ie + 1, vt = he[gt];
          if (0 > ee(bt, Re)) gt < M && 0 > ee(vt, bt) ? (he[T] = vt, he[gt] = Re, T = gt) : (he[T] = bt, he[Ie] = Re, T = Ie);
          else if (gt < M && 0 > ee(vt, Re)) he[T] = vt, he[gt] = Re, T = gt;
          else break e;
        }
      }
      return He;
    }
    function ee(he, He) {
      var Re = he.sortIndex - He.sortIndex;
      return Re !== 0 ? Re : he.id - He.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var D = performance;
      x.unstable_now = function() {
        return D.now();
      };
    } else {
      var g = Date, ae = g.now();
      x.unstable_now = function() {
        return g.now() - ae;
      };
    }
    var L = [], z = [], ge = 1, P = null, W = 3, te = !1, ne = !1, X = !1, fe = typeof setTimeout == "function" ? setTimeout : null, je = typeof clearTimeout == "function" ? clearTimeout : null, oe = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Ee(he) {
      for (var He = b(z); He !== null; ) {
        if (He.callback === null) q(z);
        else if (He.startTime <= he) q(z), He.sortIndex = He.expirationTime, E(L, He);
        else break;
        He = b(z);
      }
    }
    function Se(he) {
      if (X = !1, Ee(he), !ne) if (b(L) !== null) ne = !0, dt(le);
      else {
        var He = b(z);
        He !== null && Oe(Se, He.startTime - he);
      }
    }
    function le(he, He) {
      ne = !1, X && (X = !1, je(pe), pe = -1), te = !0;
      var Re = W;
      try {
        for (Ee(He), P = b(L); P !== null && (!(P.expirationTime > He) || he && !De()); ) {
          var T = P.callback;
          if (typeof T == "function") {
            P.callback = null, W = P.priorityLevel;
            var M = T(P.expirationTime <= He);
            He = x.unstable_now(), typeof M == "function" ? P.callback = M : P === b(L) && q(L), Ee(He);
          } else q(L);
          P = b(L);
        }
        if (P !== null) var Ne = !0;
        else {
          var Ie = b(z);
          Ie !== null && Oe(Se, Ie.startTime - He), Ne = !1;
        }
        return Ne;
      } finally {
        P = null, W = Re, te = !1;
      }
    }
    var se = !1, A = null, pe = -1, ue = 5, be = -1;
    function De() {
      return !(x.unstable_now() - be < ue);
    }
    function Je() {
      if (A !== null) {
        var he = x.unstable_now();
        be = he;
        var He = !0;
        try {
          He = A(!0, he);
        } finally {
          He ? re() : (se = !1, A = null);
        }
      } else se = !1;
    }
    var re;
    if (typeof oe == "function") re = function() {
      oe(Je);
    };
    else if (typeof MessageChannel < "u") {
      var ze = new MessageChannel(), tt = ze.port2;
      ze.port1.onmessage = Je, re = function() {
        tt.postMessage(null);
      };
    } else re = function() {
      fe(Je, 0);
    };
    function dt(he) {
      A = he, se || (se = !0, re());
    }
    function Oe(he, He) {
      pe = fe(function() {
        he(x.unstable_now());
      }, He);
    }
    x.unstable_IdlePriority = 5, x.unstable_ImmediatePriority = 1, x.unstable_LowPriority = 4, x.unstable_NormalPriority = 3, x.unstable_Profiling = null, x.unstable_UserBlockingPriority = 2, x.unstable_cancelCallback = function(he) {
      he.callback = null;
    }, x.unstable_continueExecution = function() {
      ne || te || (ne = !0, dt(le));
    }, x.unstable_forceFrameRate = function(he) {
      0 > he || 125 < he ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ue = 0 < he ? Math.floor(1e3 / he) : 5;
    }, x.unstable_getCurrentPriorityLevel = function() {
      return W;
    }, x.unstable_getFirstCallbackNode = function() {
      return b(L);
    }, x.unstable_next = function(he) {
      switch (W) {
        case 1:
        case 2:
        case 3:
          var He = 3;
          break;
        default:
          He = W;
      }
      var Re = W;
      W = He;
      try {
        return he();
      } finally {
        W = Re;
      }
    }, x.unstable_pauseExecution = function() {
    }, x.unstable_requestPaint = function() {
    }, x.unstable_runWithPriority = function(he, He) {
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
      var Re = W;
      W = he;
      try {
        return He();
      } finally {
        W = Re;
      }
    }, x.unstable_scheduleCallback = function(he, He, Re) {
      var T = x.unstable_now();
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
      return M = Re + M, he = { id: ge++, callback: He, priorityLevel: he, startTime: Re, expirationTime: M, sortIndex: -1 }, Re > T ? (he.sortIndex = Re, E(z, he), b(L) === null && he === b(z) && (X ? (je(pe), pe = -1) : X = !0, Oe(Se, Re - T))) : (he.sortIndex = M, E(L, he), ne || te || (ne = !0, dt(le))), he;
    }, x.unstable_shouldYield = De, x.unstable_wrapCallback = function(he) {
      var He = W;
      return function() {
        var Re = W;
        W = He;
        try {
          return he.apply(this, arguments);
        } finally {
          W = Re;
        }
      };
    };
  }(SE)), SE;
}
var EE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var p0;
function bD() {
  return p0 || (p0 = 1, function(x) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var E = !1, b = 5;
      function q(Te, qe) {
        var Rt = Te.length;
        Te.push(qe), g(Te, qe, Rt);
      }
      function ee(Te) {
        return Te.length === 0 ? null : Te[0];
      }
      function D(Te) {
        if (Te.length === 0)
          return null;
        var qe = Te[0], Rt = Te.pop();
        return Rt !== qe && (Te[0] = Rt, ae(Te, Rt, 0)), qe;
      }
      function g(Te, qe, Rt) {
        for (var Kt = Rt; Kt > 0; ) {
          var sn = Kt - 1 >>> 1, Tn = Te[sn];
          if (L(Tn, qe) > 0)
            Te[sn] = qe, Te[Kt] = Tn, Kt = sn;
          else
            return;
        }
      }
      function ae(Te, qe, Rt) {
        for (var Kt = Rt, sn = Te.length, Tn = sn >>> 1; Kt < Tn; ) {
          var mn = (Kt + 1) * 2 - 1, ar = Te[mn], cn = mn + 1, Zt = Te[cn];
          if (L(ar, qe) < 0)
            cn < sn && L(Zt, ar) < 0 ? (Te[Kt] = Zt, Te[cn] = qe, Kt = cn) : (Te[Kt] = ar, Te[mn] = qe, Kt = mn);
          else if (cn < sn && L(Zt, qe) < 0)
            Te[Kt] = Zt, Te[cn] = qe, Kt = cn;
          else
            return;
        }
      }
      function L(Te, qe) {
        var Rt = Te.sortIndex - qe.sortIndex;
        return Rt !== 0 ? Rt : Te.id - qe.id;
      }
      var z = 1, ge = 2, P = 3, W = 4, te = 5;
      function ne(Te, qe) {
      }
      var X = typeof performance == "object" && typeof performance.now == "function";
      if (X) {
        var fe = performance;
        x.unstable_now = function() {
          return fe.now();
        };
      } else {
        var je = Date, oe = je.now();
        x.unstable_now = function() {
          return je.now() - oe;
        };
      }
      var Ee = 1073741823, Se = -1, le = 250, se = 5e3, A = 1e4, pe = Ee, ue = [], be = [], De = 1, Je = null, re = P, ze = !1, tt = !1, dt = !1, Oe = typeof setTimeout == "function" ? setTimeout : null, he = typeof clearTimeout == "function" ? clearTimeout : null, He = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function Re(Te) {
        for (var qe = ee(be); qe !== null; ) {
          if (qe.callback === null)
            D(be);
          else if (qe.startTime <= Te)
            D(be), qe.sortIndex = qe.expirationTime, q(ue, qe);
          else
            return;
          qe = ee(be);
        }
      }
      function T(Te) {
        if (dt = !1, Re(Te), !tt)
          if (ee(ue) !== null)
            tt = !0, Jt(M);
          else {
            var qe = ee(be);
            qe !== null && vn(T, qe.startTime - Te);
          }
      }
      function M(Te, qe) {
        tt = !1, dt && (dt = !1, On()), ze = !0;
        var Rt = re;
        try {
          var Kt;
          if (!E) return Ne(Te, qe);
        } finally {
          Je = null, re = Rt, ze = !1;
        }
      }
      function Ne(Te, qe) {
        var Rt = qe;
        for (Re(Rt), Je = ee(ue); Je !== null && !(Je.expirationTime > Rt && (!Te || _a())); ) {
          var Kt = Je.callback;
          if (typeof Kt == "function") {
            Je.callback = null, re = Je.priorityLevel;
            var sn = Je.expirationTime <= Rt, Tn = Kt(sn);
            Rt = x.unstable_now(), typeof Tn == "function" ? Je.callback = Tn : Je === ee(ue) && D(ue), Re(Rt);
          } else
            D(ue);
          Je = ee(ue);
        }
        if (Je !== null)
          return !0;
        var mn = ee(be);
        return mn !== null && vn(T, mn.startTime - Rt), !1;
      }
      function Ie(Te, qe) {
        switch (Te) {
          case z:
          case ge:
          case P:
          case W:
          case te:
            break;
          default:
            Te = P;
        }
        var Rt = re;
        re = Te;
        try {
          return qe();
        } finally {
          re = Rt;
        }
      }
      function bt(Te) {
        var qe;
        switch (re) {
          case z:
          case ge:
          case P:
            qe = P;
            break;
          default:
            qe = re;
            break;
        }
        var Rt = re;
        re = qe;
        try {
          return Te();
        } finally {
          re = Rt;
        }
      }
      function gt(Te) {
        var qe = re;
        return function() {
          var Rt = re;
          re = qe;
          try {
            return Te.apply(this, arguments);
          } finally {
            re = Rt;
          }
        };
      }
      function vt(Te, qe, Rt) {
        var Kt = x.unstable_now(), sn;
        if (typeof Rt == "object" && Rt !== null) {
          var Tn = Rt.delay;
          typeof Tn == "number" && Tn > 0 ? sn = Kt + Tn : sn = Kt;
        } else
          sn = Kt;
        var mn;
        switch (Te) {
          case z:
            mn = Se;
            break;
          case ge:
            mn = le;
            break;
          case te:
            mn = pe;
            break;
          case W:
            mn = A;
            break;
          case P:
          default:
            mn = se;
            break;
        }
        var ar = sn + mn, cn = {
          id: De++,
          callback: qe,
          priorityLevel: Te,
          startTime: sn,
          expirationTime: ar,
          sortIndex: -1
        };
        return sn > Kt ? (cn.sortIndex = sn, q(be, cn), ee(ue) === null && cn === ee(be) && (dt ? On() : dt = !0, vn(T, sn - Kt))) : (cn.sortIndex = ar, q(ue, cn), !tt && !ze && (tt = !0, Jt(M))), cn;
      }
      function Ct() {
      }
      function wt() {
        !tt && !ze && (tt = !0, Jt(M));
      }
      function Bt() {
        return ee(ue);
      }
      function jn(Te) {
        Te.callback = null;
      }
      function cr() {
        return re;
      }
      var bn = !1, Xn = null, Mn = -1, En = b, Rr = -1;
      function _a() {
        var Te = x.unstable_now() - Rr;
        return !(Te < En);
      }
      function Or() {
      }
      function Ge(Te) {
        if (Te < 0 || Te > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        Te > 0 ? En = Math.floor(1e3 / Te) : En = b;
      }
      var G = function() {
        if (Xn !== null) {
          var Te = x.unstable_now();
          Rr = Te;
          var qe = !0, Rt = !0;
          try {
            Rt = Xn(qe, Te);
          } finally {
            Rt ? Xe() : (bn = !1, Xn = null);
          }
        } else
          bn = !1;
      }, Xe;
      if (typeof He == "function")
        Xe = function() {
          He(G);
        };
      else if (typeof MessageChannel < "u") {
        var Lt = new MessageChannel(), wn = Lt.port2;
        Lt.port1.onmessage = G, Xe = function() {
          wn.postMessage(null);
        };
      } else
        Xe = function() {
          Oe(G, 0);
        };
      function Jt(Te) {
        Xn = Te, bn || (bn = !0, Xe());
      }
      function vn(Te, qe) {
        Mn = Oe(function() {
          Te(x.unstable_now());
        }, qe);
      }
      function On() {
        he(Mn), Mn = -1;
      }
      var rr = Or, hn = null;
      x.unstable_IdlePriority = te, x.unstable_ImmediatePriority = z, x.unstable_LowPriority = W, x.unstable_NormalPriority = P, x.unstable_Profiling = hn, x.unstable_UserBlockingPriority = ge, x.unstable_cancelCallback = jn, x.unstable_continueExecution = wt, x.unstable_forceFrameRate = Ge, x.unstable_getCurrentPriorityLevel = cr, x.unstable_getFirstCallbackNode = Bt, x.unstable_next = bt, x.unstable_pauseExecution = Ct, x.unstable_requestPaint = rr, x.unstable_runWithPriority = Ie, x.unstable_scheduleCallback = vt, x.unstable_shouldYield = _a, x.unstable_wrapCallback = gt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(EE)), EE;
}
var v0;
function C0() {
  return v0 || (v0 = 1, process.env.NODE_ENV === "production" ? Jm.exports = xD() : Jm.exports = bD()), Jm.exports;
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
var h0;
function wD() {
  if (h0) return Wa;
  h0 = 1;
  var x = F, E = C0();
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
  function W(n) {
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
  var je = /[\-:]([a-z])/g;
  function oe(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      je,
      oe
    );
    fe[r] = new X(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(je, oe);
    fe[r] = new X(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(je, oe);
    fe[r] = new X(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    fe[n] = new X(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), fe.xlinkHref = new X("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    fe[n] = new X(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function Ee(n, r, l, u) {
    var c = fe.hasOwnProperty(r) ? fe[r] : null;
    (c !== null ? c.type !== 0 : u || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ne(r, l, c, u) && (l = null), u || c === null ? W(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, u = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, u ? n.setAttributeNS(u, r, l) : n.setAttribute(r, l))));
  }
  var Se = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, le = Symbol.for("react.element"), se = Symbol.for("react.portal"), A = Symbol.for("react.fragment"), pe = Symbol.for("react.strict_mode"), ue = Symbol.for("react.profiler"), be = Symbol.for("react.provider"), De = Symbol.for("react.context"), Je = Symbol.for("react.forward_ref"), re = Symbol.for("react.suspense"), ze = Symbol.for("react.suspense_list"), tt = Symbol.for("react.memo"), dt = Symbol.for("react.lazy"), Oe = Symbol.for("react.offscreen"), he = Symbol.iterator;
  function He(n) {
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
  var Ne = !1;
  function Ie(n, r) {
    if (!n || Ne) return "";
    Ne = !0;
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
        } catch (Y) {
          var u = Y;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (Y) {
          u = Y;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (Y) {
          u = Y;
        }
        n();
      }
    } catch (Y) {
      if (Y && u && typeof Y.stack == "string") {
        for (var c = Y.stack.split(`
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
      Ne = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? M(n) : "";
  }
  function bt(n) {
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
        return n = Ie(n.type, !1), n;
      case 11:
        return n = Ie(n.type.render, !1), n;
      case 1:
        return n = Ie(n.type, !0), n;
      default:
        return "";
    }
  }
  function gt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case A:
        return "Fragment";
      case se:
        return "Portal";
      case ue:
        return "Profiler";
      case pe:
        return "StrictMode";
      case re:
        return "Suspense";
      case ze:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case De:
        return (n.displayName || "Context") + ".Consumer";
      case be:
        return (n._context.displayName || "Context") + ".Provider";
      case Je:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case tt:
        return r = n.displayName || null, r !== null ? r : gt(n.type) || "Memo";
      case dt:
        r = n._payload, n = n._init;
        try {
          return gt(n(r));
        } catch {
        }
    }
    return null;
  }
  function vt(n) {
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
        return gt(r);
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
  function Ct(n) {
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
  function wt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Bt(n) {
    var r = wt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), u = "" + n[r];
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
  function jn(n) {
    n._valueTracker || (n._valueTracker = Bt(n));
  }
  function cr(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), u = "";
    return n && (u = wt(n) ? n.checked ? "true" : "false" : n.value), n = u, n !== l ? (r.setValue(n), !0) : !1;
  }
  function bn(n) {
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
  function Mn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, u = r.checked != null ? r.checked : r.defaultChecked;
    l = Ct(r.value != null ? r.value : l), n._wrapperState = { initialChecked: u, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function En(n, r) {
    r = r.checked, r != null && Ee(n, "checked", r, !1);
  }
  function Rr(n, r) {
    En(n, r);
    var l = Ct(r.value), u = r.type;
    if (l != null) u === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (u === "submit" || u === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? Or(n, r.type, l) : r.hasOwnProperty("defaultValue") && Or(n, r.type, Ct(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function _a(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var u = r.type;
      if (!(u !== "submit" && u !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function Or(n, r, l) {
    (r !== "number" || bn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Ge = Array.isArray;
  function G(n, r, l, u) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && u && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + Ct(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, u && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Xe(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(b(91));
    return Re({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Lt(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(b(92));
        if (Ge(l)) {
          if (1 < l.length) throw Error(b(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: Ct(l) };
  }
  function wn(n, r) {
    var l = Ct(r.value), u = Ct(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), u != null && (n.defaultValue = "" + u);
  }
  function Jt(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function vn(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function On(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? vn(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var rr, hn = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, u, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, u, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (rr = rr || document.createElement("div"), rr.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = rr.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function Te(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var qe = {
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
  }, Rt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(qe).forEach(function(n) {
    Rt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), qe[r] = qe[n];
    });
  });
  function Kt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || qe.hasOwnProperty(n) && qe[n] ? ("" + r).trim() : r + "px";
  }
  function sn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var u = l.indexOf("--") === 0, c = Kt(l, r[l], u);
      l === "float" && (l = "cssFloat"), u ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var Tn = Re({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function mn(n, r) {
    if (r) {
      if (Tn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(b(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(b(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(b(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(b(62));
    }
  }
  function ar(n, r) {
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
  var cn = null;
  function Zt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var en = null, va = null, _r = null;
  function ka(n) {
    if (n = nt(n)) {
      if (typeof en != "function") throw Error(b(280));
      var r = n.stateNode;
      r && (r = _n(r), en(n.stateNode, n.type, r));
    }
  }
  function Pi(n) {
    va ? _r ? _r.push(n) : _r = [n] : va = n;
  }
  function to() {
    if (va) {
      var n = va, r = _r;
      if (_r = va = null, ka(n), r) for (n = 0; n < r.length; n++) ka(r[n]);
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
      hl = !1, (va !== null || _r !== null) && (vl(), to());
    }
  }
  function Lr(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var u = _n(l);
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
  var Mr = !1;
  if (ae) try {
    var fr = {};
    Object.defineProperty(fr, "passive", { get: function() {
      Mr = !0;
    } }), window.addEventListener("test", fr, fr), window.removeEventListener("test", fr, fr);
  } catch {
    Mr = !1;
  }
  function di(n, r, l, u, c, d, y, w, k) {
    var Y = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, Y);
    } catch (me) {
      this.onError(me);
    }
  }
  var Ka = !1, pi = null, vi = !1, _ = null, ce = { onError: function(n) {
    Ka = !0, pi = n;
  } };
  function Le(n, r, l, u, c, d, y, w, k) {
    Ka = !1, pi = null, di.apply(ce, arguments);
  }
  function $e(n, r, l, u, c, d, y, w, k) {
    if (Le.apply(this, arguments), Ka) {
      if (Ka) {
        var Y = pi;
        Ka = !1, pi = null;
      } else throw Error(b(198));
      vi || (vi = !0, _ = Y);
    }
  }
  function St(n) {
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
  function ht(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Nt(n) {
    if (St(n) !== n) throw Error(b(188));
  }
  function kt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = St(n), r === null) throw Error(b(188));
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
          if (d === l) return Nt(c), n;
          if (d === u) return Nt(c), r;
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
  function An(n) {
    return n = kt(n), n !== null ? fn(n) : null;
  }
  function fn(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = fn(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var yn = E.unstable_scheduleCallback, dr = E.unstable_cancelCallback, qa = E.unstable_shouldYield, Xa = E.unstable_requestPaint, Et = E.unstable_now, Tt = E.unstable_getCurrentPriorityLevel, Ja = E.unstable_ImmediatePriority, ao = E.unstable_UserBlockingPriority, io = E.unstable_NormalPriority, ml = E.unstable_LowPriority, qo = E.unstable_IdlePriority, yl = null, Xr = null;
  function Wu(n) {
    if (Xr && typeof Xr.onCommitFiberRoot == "function") try {
      Xr.onCommitFiberRoot(yl, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Ar = Math.clz32 ? Math.clz32 : Xo, sc = Math.log, cc = Math.LN2;
  function Xo(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (sc(n) / cc | 0) | 0;
  }
  var gl = 64, ha = 4194304;
  function Za(n) {
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
  function ei(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var u = 0, c = n.suspendedLanes, d = n.pingedLanes, y = l & 268435455;
    if (y !== 0) {
      var w = y & ~c;
      w !== 0 ? u = Za(w) : (d &= y, d !== 0 && (u = Za(d)));
    } else y = l & ~c, y !== 0 ? u = Za(y) : d !== 0 && (u = Za(d));
    if (u === 0) return 0;
    if (r !== 0 && r !== u && !(r & c) && (c = u & -u, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if (u & 4 && (u |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= u; 0 < r; ) l = 31 - Ar(r), c = 1 << l, u |= n[l], r &= ~c;
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
      var y = 31 - Ar(d), w = 1 << y, k = c[y];
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
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Ar(r), n[r] = l;
  }
  function qf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var u = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - Ar(l), d = 1 << c;
      r[c] = 0, u[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Vi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var u = 31 - Ar(l), c = 1 << u;
      c & r | n[u] & r && (n[u] |= r), l &= ~c;
    }
  }
  var It = 0;
  function tu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Pt, Gu, hi, pt, nu, pr = !1, mi = [], zr = null, yi = null, gn = null, tn = /* @__PURE__ */ new Map(), El = /* @__PURE__ */ new Map(), Jn = [], Ur = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Da(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        zr = null;
        break;
      case "dragenter":
      case "dragleave":
        yi = null;
        break;
      case "mouseover":
      case "mouseout":
        gn = null;
        break;
      case "pointerover":
      case "pointerout":
        tn.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        El.delete(r.pointerId);
    }
  }
  function oo(n, r, l, u, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: u, nativeEvent: d, targetContainers: [c] }, r !== null && (r = nt(r), r !== null && Gu(r)), n) : (n.eventSystemFlags |= u, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Ku(n, r, l, u, c) {
    switch (r) {
      case "focusin":
        return zr = oo(zr, n, r, l, u, c), !0;
      case "dragenter":
        return yi = oo(yi, n, r, l, u, c), !0;
      case "mouseover":
        return gn = oo(gn, n, r, l, u, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return tn.set(d, oo(tn.get(d) || null, n, r, l, u, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, El.set(d, oo(El.get(d) || null, n, r, l, u, c)), !0;
    }
    return !1;
  }
  function qu(n) {
    var r = yo(n.target);
    if (r !== null) {
      var l = St(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = ht(l), r !== null) {
            n.blockedOn = r, nu(n.priority, function() {
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
  function Cl(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = iu(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var u = new l.constructor(l.type, l);
        cn = u, l.target.dispatchEvent(u), cn = null;
      } else return r = nt(l), r !== null && Gu(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function uo(n, r, l) {
    Cl(n) && l.delete(r);
  }
  function Xf() {
    pr = !1, zr !== null && Cl(zr) && (zr = null), yi !== null && Cl(yi) && (yi = null), gn !== null && Cl(gn) && (gn = null), tn.forEach(uo), El.forEach(uo);
  }
  function Na(n, r) {
    n.blockedOn === r && (n.blockedOn = null, pr || (pr = !0, E.unstable_scheduleCallback(E.unstable_NormalPriority, Xf)));
  }
  function ti(n) {
    function r(c) {
      return Na(c, n);
    }
    if (0 < mi.length) {
      Na(mi[0], n);
      for (var l = 1; l < mi.length; l++) {
        var u = mi[l];
        u.blockedOn === n && (u.blockedOn = null);
      }
    }
    for (zr !== null && Na(zr, n), yi !== null && Na(yi, n), gn !== null && Na(gn, n), tn.forEach(r), El.forEach(r), l = 0; l < Jn.length; l++) u = Jn[l], u.blockedOn === n && (u.blockedOn = null);
    for (; 0 < Jn.length && (l = Jn[0], l.blockedOn === null); ) qu(l), l.blockedOn === null && Jn.shift();
  }
  var gi = Se.ReactCurrentBatchConfig, ja = !0;
  function ru(n, r, l, u) {
    var c = It, d = gi.transition;
    gi.transition = null;
    try {
      It = 1, xl(n, r, l, u);
    } finally {
      It = c, gi.transition = d;
    }
  }
  function au(n, r, l, u) {
    var c = It, d = gi.transition;
    gi.transition = null;
    try {
      It = 4, xl(n, r, l, u);
    } finally {
      It = c, gi.transition = d;
    }
  }
  function xl(n, r, l, u) {
    if (ja) {
      var c = iu(n, r, l, u);
      if (c === null) xc(n, r, u, so, l), Da(n, u);
      else if (Ku(c, n, r, l, u)) u.stopPropagation();
      else if (Da(n, u), r & 4 && -1 < Ur.indexOf(n)) {
        for (; c !== null; ) {
          var d = nt(c);
          if (d !== null && Pt(d), d = iu(n, r, l, u), d === null && xc(n, r, u, so, l), d === c) break;
          c = d;
        }
        c !== null && u.stopPropagation();
      } else xc(n, r, u, null, l);
    }
  }
  var so = null;
  function iu(n, r, l, u) {
    if (so = null, n = Zt(u), n = yo(n), n !== null) if (r = St(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = ht(r), n !== null) return n;
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
        switch (Tt()) {
          case Ja:
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
  var ni = null, m = null, R = null;
  function $() {
    if (R) return R;
    var n, r = m, l = r.length, u, c = "value" in ni ? ni.value : ni.textContent, d = c.length;
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
  function at() {
    return !1;
  }
  function ke(n) {
    function r(l, u, c, d, y) {
      this._reactName = l, this._targetInst = c, this.type = u, this.nativeEvent = d, this.target = y, this.currentTarget = null;
      for (var w in n) n.hasOwnProperty(w) && (l = n[w], this[w] = l ? l(d) : d[w]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? we : at, this.isPropagationStopped = at, this;
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
  var ot = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, jt = ke(ot), Ht = Re({}, ot, { view: 0, detail: 0 }), dn = ke(Ht), nn, _t, rn, Rn = Re({}, Ht, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: nd, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== rn && (rn && n.type === "mousemove" ? (nn = n.screenX - rn.screenX, _t = n.screenY - rn.screenY) : _t = nn = 0, rn = n), nn);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : _t;
  } }), bl = ke(Rn), Xu = Re({}, Rn, { dataTransfer: 0 }), Bi = ke(Xu), Ju = Re({}, Ht, { relatedTarget: 0 }), co = ke(Ju), Jf = Re({}, ot, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), fc = ke(Jf), Zf = Re({}, ot, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), ov = ke(Zf), ed = Re({}, ot, { data: 0 }), td = ke(ed), uv = {
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
  }, sv = {
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
  }, ry = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ry[n]) ? !!r[n] : !1;
  }
  function nd() {
    return Ii;
  }
  var rd = Re({}, Ht, { key: function(n) {
    if (n.key) {
      var r = uv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = K(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? sv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: nd, charCode: function(n) {
    return n.type === "keypress" ? K(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? K(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), ad = ke(rd), id = Re({}, Rn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), cv = ke(id), dc = Re({}, Ht, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: nd }), fv = ke(dc), Jr = Re({}, ot, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), $i = ke(Jr), Bn = Re({}, Rn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Yi = ke(Bn), ld = [9, 13, 27, 32], ou = ae && "CompositionEvent" in window, Zu = null;
  ae && "documentMode" in document && (Zu = document.documentMode);
  var es = ae && "TextEvent" in window && !Zu, dv = ae && (!ou || Zu && 8 < Zu && 11 >= Zu), pv = " ", pc = !1;
  function vv(n, r) {
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
  function hv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var uu = !1;
  function mv(n, r) {
    switch (n) {
      case "compositionend":
        return hv(r);
      case "keypress":
        return r.which !== 32 ? null : (pc = !0, pv);
      case "textInput":
        return n = r.data, n === pv && pc ? null : n;
      default:
        return null;
    }
  }
  function ay(n, r) {
    if (uu) return n === "compositionend" || !ou && vv(n, r) ? (n = $(), R = m = ni = null, uu = !1, n) : null;
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
        return dv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var iy = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function yv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!iy[n.type] : r === "textarea";
  }
  function od(n, r, l, u) {
    Pi(u), r = ls(r, "onChange"), 0 < r.length && (l = new jt("onChange", "change", null, l, u), n.push({ event: l, listeners: r }));
  }
  var Si = null, fo = null;
  function gv(n) {
    ho(n, 0);
  }
  function ts(n) {
    var r = ai(n);
    if (cr(r)) return n;
  }
  function ly(n, r) {
    if (n === "change") return r;
  }
  var Sv = !1;
  if (ae) {
    var ud;
    if (ae) {
      var sd = "oninput" in document;
      if (!sd) {
        var Ev = document.createElement("div");
        Ev.setAttribute("oninput", "return;"), sd = typeof Ev.oninput == "function";
      }
      ud = sd;
    } else ud = !1;
    Sv = ud && (!document.documentMode || 9 < document.documentMode);
  }
  function Cv() {
    Si && (Si.detachEvent("onpropertychange", xv), fo = Si = null);
  }
  function xv(n) {
    if (n.propertyName === "value" && ts(fo)) {
      var r = [];
      od(r, fo, n, Zt(n)), ro(gv, r);
    }
  }
  function oy(n, r, l) {
    n === "focusin" ? (Cv(), Si = r, fo = l, Si.attachEvent("onpropertychange", xv)) : n === "focusout" && Cv();
  }
  function bv(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return ts(fo);
  }
  function uy(n, r) {
    if (n === "click") return ts(r);
  }
  function wv(n, r) {
    if (n === "input" || n === "change") return ts(r);
  }
  function sy(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ri = typeof Object.is == "function" ? Object.is : sy;
  function ns(n, r) {
    if (ri(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), u = Object.keys(r);
    if (l.length !== u.length) return !1;
    for (u = 0; u < l.length; u++) {
      var c = l[u];
      if (!L.call(r, c) || !ri(n[c], r[c])) return !1;
    }
    return !0;
  }
  function Tv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function vc(n, r) {
    var l = Tv(n);
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
      l = Tv(l);
    }
  }
  function wl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? wl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function rs() {
    for (var n = window, r = bn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = bn(n.document);
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
  var cy = ae && "documentMode" in document && 11 >= document.documentMode, cu = null, cd = null, as = null, fd = !1;
  function dd(n, r, l) {
    var u = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    fd || cu == null || cu !== bn(u) || (u = cu, "selectionStart" in u && hc(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = { anchorNode: u.anchorNode, anchorOffset: u.anchorOffset, focusNode: u.focusNode, focusOffset: u.focusOffset }), as && ns(as, u) || (as = u, u = ls(cd, "onSelect"), 0 < u.length && (r = new jt("onSelect", "select", null, r, l), n.push({ event: r, listeners: u }), r.target = cu)));
  }
  function mc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var po = { animationend: mc("Animation", "AnimationEnd"), animationiteration: mc("Animation", "AnimationIteration"), animationstart: mc("Animation", "AnimationStart"), transitionend: mc("Transition", "TransitionEnd") }, vr = {}, pd = {};
  ae && (pd = document.createElement("div").style, "AnimationEvent" in window || (delete po.animationend.animation, delete po.animationiteration.animation, delete po.animationstart.animation), "TransitionEvent" in window || delete po.transitionend.transition);
  function yc(n) {
    if (vr[n]) return vr[n];
    if (!po[n]) return n;
    var r = po[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in pd) return vr[n] = r[l];
    return n;
  }
  var Rv = yc("animationend"), _v = yc("animationiteration"), kv = yc("animationstart"), Dv = yc("transitionend"), vd = /* @__PURE__ */ new Map(), gc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Oa(n, r) {
    vd.set(n, r), D(r, [n]);
  }
  for (var hd = 0; hd < gc.length; hd++) {
    var vo = gc[hd], fy = vo.toLowerCase(), dy = vo[0].toUpperCase() + vo.slice(1);
    Oa(fy, "on" + dy);
  }
  Oa(Rv, "onAnimationEnd"), Oa(_v, "onAnimationIteration"), Oa(kv, "onAnimationStart"), Oa("dblclick", "onDoubleClick"), Oa("focusin", "onFocus"), Oa("focusout", "onBlur"), Oa(Dv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), D("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), D("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), D("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), D("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), D("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), D("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var is = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), md = new Set("cancel close invalid load scroll toggle".split(" ").concat(is));
  function Sc(n, r, l) {
    var u = n.type || "unknown-event";
    n.currentTarget = l, $e(u, r, void 0, n), n.currentTarget = null;
  }
  function ho(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var u = n[l], c = u.event;
      u = u.listeners;
      e: {
        var d = void 0;
        if (r) for (var y = u.length - 1; 0 <= y; y--) {
          var w = u[y], k = w.instance, Y = w.currentTarget;
          if (w = w.listener, k !== d && c.isPropagationStopped()) break e;
          Sc(c, w, Y), d = k;
        }
        else for (y = 0; y < u.length; y++) {
          if (w = u[y], k = w.instance, Y = w.currentTarget, w = w.listener, k !== d && c.isPropagationStopped()) break e;
          Sc(c, w, Y), d = k;
        }
      }
    }
    if (vi) throw n = _, vi = !1, _ = null, n;
  }
  function qt(n, r) {
    var l = r[ss];
    l === void 0 && (l = r[ss] = /* @__PURE__ */ new Set());
    var u = n + "__bubble";
    l.has(u) || (Nv(r, n, 2, !1), l.add(u));
  }
  function Ec(n, r, l) {
    var u = 0;
    r && (u |= 4), Nv(l, n, u, r);
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
  function Nv(n, r, l, u) {
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
    l = c.bind(null, r, l, n), c = void 0, !Mr || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), u ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
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
      var Y = d, me = Zt(l), Ce = [];
      e: {
        var ve = vd.get(n);
        if (ve !== void 0) {
          var Fe = jt, Ye = n;
          switch (n) {
            case "keypress":
              if (K(l) === 0) break e;
            case "keydown":
            case "keyup":
              Fe = ad;
              break;
            case "focusin":
              Ye = "focus", Fe = co;
              break;
            case "focusout":
              Ye = "blur", Fe = co;
              break;
            case "beforeblur":
            case "afterblur":
              Fe = co;
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
              Fe = bl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Fe = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Fe = fv;
              break;
            case Rv:
            case _v:
            case kv:
              Fe = fc;
              break;
            case Dv:
              Fe = $i;
              break;
            case "scroll":
              Fe = dn;
              break;
            case "wheel":
              Fe = Yi;
              break;
            case "copy":
            case "cut":
            case "paste":
              Fe = ov;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Fe = cv;
          }
          var Ke = (r & 4) !== 0, Hn = !Ke && n === "scroll", U = Ke ? ve !== null ? ve + "Capture" : null : ve;
          Ke = [];
          for (var j = Y, B; j !== null; ) {
            B = j;
            var ye = B.stateNode;
            if (B.tag === 5 && ye !== null && (B = ye, U !== null && (ye = Lr(j, U), ye != null && Ke.push(du(j, ye, B)))), Hn) break;
            j = j.return;
          }
          0 < Ke.length && (ve = new Fe(ve, Ye, null, l, me), Ce.push({ event: ve, listeners: Ke }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (ve = n === "mouseover" || n === "pointerover", Fe = n === "mouseout" || n === "pointerout", ve && l !== cn && (Ye = l.relatedTarget || l.fromElement) && (yo(Ye) || Ye[Qi])) break e;
          if ((Fe || ve) && (ve = me.window === me ? me : (ve = me.ownerDocument) ? ve.defaultView || ve.parentWindow : window, Fe ? (Ye = l.relatedTarget || l.toElement, Fe = Y, Ye = Ye ? yo(Ye) : null, Ye !== null && (Hn = St(Ye), Ye !== Hn || Ye.tag !== 5 && Ye.tag !== 6) && (Ye = null)) : (Fe = null, Ye = Y), Fe !== Ye)) {
            if (Ke = bl, ye = "onMouseLeave", U = "onMouseEnter", j = "mouse", (n === "pointerout" || n === "pointerover") && (Ke = cv, ye = "onPointerLeave", U = "onPointerEnter", j = "pointer"), Hn = Fe == null ? ve : ai(Fe), B = Ye == null ? ve : ai(Ye), ve = new Ke(ye, j + "leave", Fe, l, me), ve.target = Hn, ve.relatedTarget = B, ye = null, yo(me) === Y && (Ke = new Ke(U, j + "enter", Ye, l, me), Ke.target = B, Ke.relatedTarget = Hn, ye = Ke), Hn = ye, Fe && Ye) t: {
              for (Ke = Fe, U = Ye, j = 0, B = Ke; B; B = Tl(B)) j++;
              for (B = 0, ye = U; ye; ye = Tl(ye)) B++;
              for (; 0 < j - B; ) Ke = Tl(Ke), j--;
              for (; 0 < B - j; ) U = Tl(U), B--;
              for (; j--; ) {
                if (Ke === U || U !== null && Ke === U.alternate) break t;
                Ke = Tl(Ke), U = Tl(U);
              }
              Ke = null;
            }
            else Ke = null;
            Fe !== null && jv(Ce, ve, Fe, Ke, !1), Ye !== null && Hn !== null && jv(Ce, Hn, Ye, Ke, !0);
          }
        }
        e: {
          if (ve = Y ? ai(Y) : window, Fe = ve.nodeName && ve.nodeName.toLowerCase(), Fe === "select" || Fe === "input" && ve.type === "file") var Qe = ly;
          else if (yv(ve)) if (Sv) Qe = wv;
          else {
            Qe = bv;
            var lt = oy;
          }
          else (Fe = ve.nodeName) && Fe.toLowerCase() === "input" && (ve.type === "checkbox" || ve.type === "radio") && (Qe = uy);
          if (Qe && (Qe = Qe(n, Y))) {
            od(Ce, Qe, l, me);
            break e;
          }
          lt && lt(n, ve, Y), n === "focusout" && (lt = ve._wrapperState) && lt.controlled && ve.type === "number" && Or(ve, "number", ve.value);
        }
        switch (lt = Y ? ai(Y) : window, n) {
          case "focusin":
            (yv(lt) || lt.contentEditable === "true") && (cu = lt, cd = Y, as = null);
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
            if (cy) break;
          case "keydown":
          case "keyup":
            dd(Ce, l, me);
        }
        var ut;
        if (ou) e: {
          switch (n) {
            case "compositionstart":
              var ft = "onCompositionStart";
              break e;
            case "compositionend":
              ft = "onCompositionEnd";
              break e;
            case "compositionupdate":
              ft = "onCompositionUpdate";
              break e;
          }
          ft = void 0;
        }
        else uu ? vv(n, l) && (ft = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (ft = "onCompositionStart");
        ft && (dv && l.locale !== "ko" && (uu || ft !== "onCompositionStart" ? ft === "onCompositionEnd" && uu && (ut = $()) : (ni = me, m = "value" in ni ? ni.value : ni.textContent, uu = !0)), lt = ls(Y, ft), 0 < lt.length && (ft = new td(ft, n, null, l, me), Ce.push({ event: ft, listeners: lt }), ut ? ft.data = ut : (ut = hv(l), ut !== null && (ft.data = ut)))), (ut = es ? mv(n, l) : ay(n, l)) && (Y = ls(Y, "onBeforeInput"), 0 < Y.length && (me = new td("onBeforeInput", "beforeinput", null, l, me), Ce.push({ event: me, listeners: Y }), me.data = ut));
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
      c.tag === 5 && d !== null && (c = d, d = Lr(n, l), d != null && u.unshift(du(n, d, c)), d = Lr(n, r), d != null && u.push(du(n, d, c))), n = n.return;
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
  function jv(n, r, l, u, c) {
    for (var d = r._reactName, y = []; l !== null && l !== u; ) {
      var w = l, k = w.alternate, Y = w.stateNode;
      if (k !== null && k === u) break;
      w.tag === 5 && Y !== null && (w = Y, c ? (k = Lr(l, d), k != null && y.unshift(du(l, k, w))) : c || (k = Lr(l, d), k != null && y.push(du(l, k, w)))), l = l.return;
    }
    y.length !== 0 && n.push({ event: r, listeners: y });
  }
  var Ov = /\r\n?/g, py = /\u0000|\uFFFD/g;
  function Lv(n) {
    return (typeof n == "string" ? n : "" + n).replace(Ov, `
`).replace(py, "");
  }
  function bc(n, r, l) {
    if (r = Lv(r), Lv(n) !== r && l) throw Error(b(425));
  }
  function Rl() {
  }
  var os = null, mo = null;
  function wc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Tc = typeof setTimeout == "function" ? setTimeout : void 0, yd = typeof clearTimeout == "function" ? clearTimeout : void 0, Mv = typeof Promise == "function" ? Promise : void 0, pu = typeof queueMicrotask == "function" ? queueMicrotask : typeof Mv < "u" ? function(n) {
    return Mv.resolve(null).then(n).catch(Rc);
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
          n.removeChild(c), ti(r);
          return;
        }
        u--;
      } else l !== "$" && l !== "$?" && l !== "$!" || u++;
      l = c;
    } while (l);
    ti(r);
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
  function Av(n) {
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
  var _l = Math.random().toString(36).slice(2), Ci = "__reactFiber$" + _l, us = "__reactProps$" + _l, Qi = "__reactContainer$" + _l, ss = "__reactEvents$" + _l, hu = "__reactListeners$" + _l, vy = "__reactHandles$" + _l;
  function yo(n) {
    var r = n[Ci];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Qi] || l[Ci]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = Av(n); n !== null; ) {
          if (l = n[Ci]) return l;
          n = Av(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function nt(n) {
    return n = n[Ci] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ai(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(b(33));
  }
  function _n(n) {
    return n[us] || null;
  }
  var At = [], La = -1;
  function Ma(n) {
    return { current: n };
  }
  function pn(n) {
    0 > La || (n.current = At[La], At[La] = null, La--);
  }
  function et(n, r) {
    La++, At[La] = n.current, n.current = r;
  }
  var kr = {}, Ln = Ma(kr), Zn = Ma(!1), Zr = kr;
  function ea(n, r) {
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
    pn(Zn), pn(Ln);
  }
  function zv(n, r, l) {
    if (Ln.current !== kr) throw Error(b(168));
    et(Ln, r), et(Zn, l);
  }
  function cs(n, r, l) {
    var u = n.stateNode;
    if (r = r.childContextTypes, typeof u.getChildContext != "function") return l;
    u = u.getChildContext();
    for (var c in u) if (!(c in r)) throw Error(b(108, vt(n) || "Unknown", c));
    return Re({}, l, u);
  }
  function ir(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || kr, Zr = Ln.current, et(Ln, n), et(Zn, Zn.current), !0;
  }
  function _c(n, r, l) {
    var u = n.stateNode;
    if (!u) throw Error(b(169));
    l ? (n = cs(n, r, Zr), u.__reactInternalMemoizedMergedChildContext = n, pn(Zn), pn(Ln), et(Ln, n)) : pn(Zn), et(Zn, l);
  }
  var xi = null, yu = !1, Wi = !1;
  function kc(n) {
    xi === null ? xi = [n] : xi.push(n);
  }
  function kl(n) {
    yu = !0, kc(n);
  }
  function bi() {
    if (!Wi && xi !== null) {
      Wi = !0;
      var n = 0, r = It;
      try {
        var l = xi;
        for (It = 1; n < l.length; n++) {
          var u = l[n];
          do
            u = u(!0);
          while (u !== null);
        }
        xi = null, yu = !1;
      } catch (c) {
        throw xi !== null && (xi = xi.slice(n + 1)), yn(Ja, bi), c;
      } finally {
        It = r, Wi = !1;
      }
    }
    return null;
  }
  var Dl = [], Nl = 0, jl = null, Gi = 0, $n = [], Aa = 0, ma = null, wi = 1, Ti = "";
  function go(n, r) {
    Dl[Nl++] = Gi, Dl[Nl++] = jl, jl = n, Gi = r;
  }
  function Uv(n, r, l) {
    $n[Aa++] = wi, $n[Aa++] = Ti, $n[Aa++] = ma, ma = n;
    var u = wi;
    n = Ti;
    var c = 32 - Ar(u) - 1;
    u &= ~(1 << c), l += 1;
    var d = 32 - Ar(r) + c;
    if (30 < d) {
      var y = c - c % 5;
      d = (u & (1 << y) - 1).toString(32), u >>= y, c -= y, wi = 1 << 32 - Ar(r) + c | l << c | u, Ti = d + n;
    } else wi = 1 << d | l << c | u, Ti = n;
  }
  function Dc(n) {
    n.return !== null && (go(n, 1), Uv(n, 1, 0));
  }
  function Nc(n) {
    for (; n === jl; ) jl = Dl[--Nl], Dl[Nl] = null, Gi = Dl[--Nl], Dl[Nl] = null;
    for (; n === ma; ) ma = $n[--Aa], $n[Aa] = null, Ti = $n[--Aa], $n[Aa] = null, wi = $n[--Aa], $n[Aa] = null;
  }
  var ta = null, na = null, Cn = !1, za = null;
  function gd(n, r) {
    var l = Va(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Fv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, ta = n, na = Ei(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, ta = n, na = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = ma !== null ? { id: wi, overflow: Ti } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Va(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, ta = n, na = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Sd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Ed(n) {
    if (Cn) {
      var r = na;
      if (r) {
        var l = r;
        if (!Fv(n, r)) {
          if (Sd(n)) throw Error(b(418));
          r = Ei(l.nextSibling);
          var u = ta;
          r && Fv(n, r) ? gd(u, l) : (n.flags = n.flags & -4097 | 2, Cn = !1, ta = n);
        }
      } else {
        if (Sd(n)) throw Error(b(418));
        n.flags = n.flags & -4097 | 2, Cn = !1, ta = n;
      }
    }
  }
  function er(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    ta = n;
  }
  function jc(n) {
    if (n !== ta) return !1;
    if (!Cn) return er(n), Cn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !wc(n.type, n.memoizedProps)), r && (r = na)) {
      if (Sd(n)) throw fs(), Error(b(418));
      for (; r; ) gd(n, r), r = Ei(r.nextSibling);
    }
    if (er(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(b(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                na = Ei(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        na = null;
      }
    } else na = ta ? Ei(n.stateNode.nextSibling) : null;
    return !0;
  }
  function fs() {
    for (var n = na; n; ) n = Ei(n.nextSibling);
  }
  function Ol() {
    na = ta = null, Cn = !1;
  }
  function Ki(n) {
    za === null ? za = [n] : za.push(n);
  }
  var hy = Se.ReactCurrentBatchConfig;
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
  function Pv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function Eo(n) {
    function r(U, j) {
      if (n) {
        var B = U.deletions;
        B === null ? (U.deletions = [j], U.flags |= 16) : B.push(j);
      }
    }
    function l(U, j) {
      if (!n) return null;
      for (; j !== null; ) r(U, j), j = j.sibling;
      return null;
    }
    function u(U, j) {
      for (U = /* @__PURE__ */ new Map(); j !== null; ) j.key !== null ? U.set(j.key, j) : U.set(j.index, j), j = j.sibling;
      return U;
    }
    function c(U, j) {
      return U = Hl(U, j), U.index = 0, U.sibling = null, U;
    }
    function d(U, j, B) {
      return U.index = B, n ? (B = U.alternate, B !== null ? (B = B.index, B < j ? (U.flags |= 2, j) : B) : (U.flags |= 2, j)) : (U.flags |= 1048576, j);
    }
    function y(U) {
      return n && U.alternate === null && (U.flags |= 2), U;
    }
    function w(U, j, B, ye) {
      return j === null || j.tag !== 6 ? (j = Xd(B, U.mode, ye), j.return = U, j) : (j = c(j, B), j.return = U, j);
    }
    function k(U, j, B, ye) {
      var Qe = B.type;
      return Qe === A ? me(U, j, B.props.children, ye, B.key) : j !== null && (j.elementType === Qe || typeof Qe == "object" && Qe !== null && Qe.$$typeof === dt && Pv(Qe) === j.type) ? (ye = c(j, B.props), ye.ref = So(U, j, B), ye.return = U, ye) : (ye = Vs(B.type, B.key, B.props, null, U.mode, ye), ye.ref = So(U, j, B), ye.return = U, ye);
    }
    function Y(U, j, B, ye) {
      return j === null || j.tag !== 4 || j.stateNode.containerInfo !== B.containerInfo || j.stateNode.implementation !== B.implementation ? (j = df(B, U.mode, ye), j.return = U, j) : (j = c(j, B.children || []), j.return = U, j);
    }
    function me(U, j, B, ye, Qe) {
      return j === null || j.tag !== 7 ? (j = tl(B, U.mode, ye, Qe), j.return = U, j) : (j = c(j, B), j.return = U, j);
    }
    function Ce(U, j, B) {
      if (typeof j == "string" && j !== "" || typeof j == "number") return j = Xd("" + j, U.mode, B), j.return = U, j;
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case le:
            return B = Vs(j.type, j.key, j.props, null, U.mode, B), B.ref = So(U, null, j), B.return = U, B;
          case se:
            return j = df(j, U.mode, B), j.return = U, j;
          case dt:
            var ye = j._init;
            return Ce(U, ye(j._payload), B);
        }
        if (Ge(j) || He(j)) return j = tl(j, U.mode, B, null), j.return = U, j;
        Oc(U, j);
      }
      return null;
    }
    function ve(U, j, B, ye) {
      var Qe = j !== null ? j.key : null;
      if (typeof B == "string" && B !== "" || typeof B == "number") return Qe !== null ? null : w(U, j, "" + B, ye);
      if (typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case le:
            return B.key === Qe ? k(U, j, B, ye) : null;
          case se:
            return B.key === Qe ? Y(U, j, B, ye) : null;
          case dt:
            return Qe = B._init, ve(
              U,
              j,
              Qe(B._payload),
              ye
            );
        }
        if (Ge(B) || He(B)) return Qe !== null ? null : me(U, j, B, ye, null);
        Oc(U, B);
      }
      return null;
    }
    function Fe(U, j, B, ye, Qe) {
      if (typeof ye == "string" && ye !== "" || typeof ye == "number") return U = U.get(B) || null, w(j, U, "" + ye, Qe);
      if (typeof ye == "object" && ye !== null) {
        switch (ye.$$typeof) {
          case le:
            return U = U.get(ye.key === null ? B : ye.key) || null, k(j, U, ye, Qe);
          case se:
            return U = U.get(ye.key === null ? B : ye.key) || null, Y(j, U, ye, Qe);
          case dt:
            var lt = ye._init;
            return Fe(U, j, B, lt(ye._payload), Qe);
        }
        if (Ge(ye) || He(ye)) return U = U.get(B) || null, me(j, U, ye, Qe, null);
        Oc(j, ye);
      }
      return null;
    }
    function Ye(U, j, B, ye) {
      for (var Qe = null, lt = null, ut = j, ft = j = 0, ur = null; ut !== null && ft < B.length; ft++) {
        ut.index > ft ? (ur = ut, ut = null) : ur = ut.sibling;
        var Qt = ve(U, ut, B[ft], ye);
        if (Qt === null) {
          ut === null && (ut = ur);
          break;
        }
        n && ut && Qt.alternate === null && r(U, ut), j = d(Qt, j, ft), lt === null ? Qe = Qt : lt.sibling = Qt, lt = Qt, ut = ur;
      }
      if (ft === B.length) return l(U, ut), Cn && go(U, ft), Qe;
      if (ut === null) {
        for (; ft < B.length; ft++) ut = Ce(U, B[ft], ye), ut !== null && (j = d(ut, j, ft), lt === null ? Qe = ut : lt.sibling = ut, lt = ut);
        return Cn && go(U, ft), Qe;
      }
      for (ut = u(U, ut); ft < B.length; ft++) ur = Fe(ut, U, ft, B[ft], ye), ur !== null && (n && ur.alternate !== null && ut.delete(ur.key === null ? ft : ur.key), j = d(ur, j, ft), lt === null ? Qe = ur : lt.sibling = ur, lt = ur);
      return n && ut.forEach(function(Il) {
        return r(U, Il);
      }), Cn && go(U, ft), Qe;
    }
    function Ke(U, j, B, ye) {
      var Qe = He(B);
      if (typeof Qe != "function") throw Error(b(150));
      if (B = Qe.call(B), B == null) throw Error(b(151));
      for (var lt = Qe = null, ut = j, ft = j = 0, ur = null, Qt = B.next(); ut !== null && !Qt.done; ft++, Qt = B.next()) {
        ut.index > ft ? (ur = ut, ut = null) : ur = ut.sibling;
        var Il = ve(U, ut, Qt.value, ye);
        if (Il === null) {
          ut === null && (ut = ur);
          break;
        }
        n && ut && Il.alternate === null && r(U, ut), j = d(Il, j, ft), lt === null ? Qe = Il : lt.sibling = Il, lt = Il, ut = ur;
      }
      if (Qt.done) return l(
        U,
        ut
      ), Cn && go(U, ft), Qe;
      if (ut === null) {
        for (; !Qt.done; ft++, Qt = B.next()) Qt = Ce(U, Qt.value, ye), Qt !== null && (j = d(Qt, j, ft), lt === null ? Qe = Qt : lt.sibling = Qt, lt = Qt);
        return Cn && go(U, ft), Qe;
      }
      for (ut = u(U, ut); !Qt.done; ft++, Qt = B.next()) Qt = Fe(ut, U, ft, Qt.value, ye), Qt !== null && (n && Qt.alternate !== null && ut.delete(Qt.key === null ? ft : Qt.key), j = d(Qt, j, ft), lt === null ? Qe = Qt : lt.sibling = Qt, lt = Qt);
      return n && ut.forEach(function(Ch) {
        return r(U, Ch);
      }), Cn && go(U, ft), Qe;
    }
    function Hn(U, j, B, ye) {
      if (typeof B == "object" && B !== null && B.type === A && B.key === null && (B = B.props.children), typeof B == "object" && B !== null) {
        switch (B.$$typeof) {
          case le:
            e: {
              for (var Qe = B.key, lt = j; lt !== null; ) {
                if (lt.key === Qe) {
                  if (Qe = B.type, Qe === A) {
                    if (lt.tag === 7) {
                      l(U, lt.sibling), j = c(lt, B.props.children), j.return = U, U = j;
                      break e;
                    }
                  } else if (lt.elementType === Qe || typeof Qe == "object" && Qe !== null && Qe.$$typeof === dt && Pv(Qe) === lt.type) {
                    l(U, lt.sibling), j = c(lt, B.props), j.ref = So(U, lt, B), j.return = U, U = j;
                    break e;
                  }
                  l(U, lt);
                  break;
                } else r(U, lt);
                lt = lt.sibling;
              }
              B.type === A ? (j = tl(B.props.children, U.mode, ye, B.key), j.return = U, U = j) : (ye = Vs(B.type, B.key, B.props, null, U.mode, ye), ye.ref = So(U, j, B), ye.return = U, U = ye);
            }
            return y(U);
          case se:
            e: {
              for (lt = B.key; j !== null; ) {
                if (j.key === lt) if (j.tag === 4 && j.stateNode.containerInfo === B.containerInfo && j.stateNode.implementation === B.implementation) {
                  l(U, j.sibling), j = c(j, B.children || []), j.return = U, U = j;
                  break e;
                } else {
                  l(U, j);
                  break;
                }
                else r(U, j);
                j = j.sibling;
              }
              j = df(B, U.mode, ye), j.return = U, U = j;
            }
            return y(U);
          case dt:
            return lt = B._init, Hn(U, j, lt(B._payload), ye);
        }
        if (Ge(B)) return Ye(U, j, B, ye);
        if (He(B)) return Ke(U, j, B, ye);
        Oc(U, B);
      }
      return typeof B == "string" && B !== "" || typeof B == "number" ? (B = "" + B, j !== null && j.tag === 6 ? (l(U, j.sibling), j = c(j, B), j.return = U, U = j) : (l(U, j), j = Xd(B, U.mode, ye), j.return = U, U = j), y(U)) : l(U, j);
    }
    return Hn;
  }
  var zn = Eo(!0), Me = Eo(!1), ya = Ma(null), ra = null, gu = null, Cd = null;
  function xd() {
    Cd = gu = ra = null;
  }
  function bd(n) {
    var r = ya.current;
    pn(ya), n._currentValue = r;
  }
  function wd(n, r, l) {
    for (; n !== null; ) {
      var u = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, u !== null && (u.childLanes |= r)) : u !== null && (u.childLanes & r) !== r && (u.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function kn(n, r) {
    ra = n, Cd = gu = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Qn = !0), n.firstContext = null);
  }
  function Ua(n) {
    var r = n._currentValue;
    if (Cd !== n) if (n = { context: n, memoizedValue: r, next: null }, gu === null) {
      if (ra === null) throw Error(b(308));
      gu = n, ra.dependencies = { lanes: 0, firstContext: n };
    } else gu = gu.next = n;
    return r;
  }
  var Co = null;
  function Td(n) {
    Co === null ? Co = [n] : Co.push(n);
  }
  function Rd(n, r, l, u) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Td(r)) : (l.next = c.next, c.next = l), r.interleaved = l, ga(n, u);
  }
  function ga(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Sa = !1;
  function _d(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Hv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function qi(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ll(n, r, l) {
    var u = n.updateQueue;
    if (u === null) return null;
    if (u = u.shared, zt & 2) {
      var c = u.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), u.pending = r, ga(n, l);
    }
    return c = u.interleaved, c === null ? (r.next = r, Td(u)) : (r.next = c.next, c.next = r), u.interleaved = r, ga(n, l);
  }
  function Lc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, Vi(n, l);
    }
  }
  function Vv(n, r) {
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
    Sa = !1;
    var d = c.firstBaseUpdate, y = c.lastBaseUpdate, w = c.shared.pending;
    if (w !== null) {
      c.shared.pending = null;
      var k = w, Y = k.next;
      k.next = null, y === null ? d = Y : y.next = Y, y = k;
      var me = n.alternate;
      me !== null && (me = me.updateQueue, w = me.lastBaseUpdate, w !== y && (w === null ? me.firstBaseUpdate = Y : w.next = Y, me.lastBaseUpdate = k));
    }
    if (d !== null) {
      var Ce = c.baseState;
      y = 0, me = Y = k = null, w = d;
      do {
        var ve = w.lane, Fe = w.eventTime;
        if ((u & ve) === ve) {
          me !== null && (me = me.next = {
            eventTime: Fe,
            lane: 0,
            tag: w.tag,
            payload: w.payload,
            callback: w.callback,
            next: null
          });
          e: {
            var Ye = n, Ke = w;
            switch (ve = r, Fe = l, Ke.tag) {
              case 1:
                if (Ye = Ke.payload, typeof Ye == "function") {
                  Ce = Ye.call(Fe, Ce, ve);
                  break e;
                }
                Ce = Ye;
                break e;
              case 3:
                Ye.flags = Ye.flags & -65537 | 128;
              case 0:
                if (Ye = Ke.payload, ve = typeof Ye == "function" ? Ye.call(Fe, Ce, ve) : Ye, ve == null) break e;
                Ce = Re({}, Ce, ve);
                break e;
              case 2:
                Sa = !0;
            }
          }
          w.callback !== null && w.lane !== 0 && (n.flags |= 64, ve = c.effects, ve === null ? c.effects = [w] : ve.push(w));
        } else Fe = { eventTime: Fe, lane: ve, tag: w.tag, payload: w.payload, callback: w.callback, next: null }, me === null ? (Y = me = Fe, k = Ce) : me = me.next = Fe, y |= ve;
        if (w = w.next, w === null) {
          if (w = c.shared.pending, w === null) break;
          ve = w, w = ve.next, ve.next = null, c.lastBaseUpdate = ve, c.shared.pending = null;
        }
      } while (!0);
      if (me === null && (k = Ce), c.baseState = k, c.firstBaseUpdate = Y, c.lastBaseUpdate = me, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          y |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Ni |= y, n.lanes = y, n.memoizedState = Ce;
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
  var ps = {}, Ri = Ma(ps), vs = Ma(ps), hs = Ma(ps);
  function xo(n) {
    if (n === ps) throw Error(b(174));
    return n;
  }
  function Dd(n, r) {
    switch (et(hs, r), et(vs, n), et(Ri, ps), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : On(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = On(r, n);
    }
    pn(Ri), et(Ri, r);
  }
  function bo() {
    pn(Ri), pn(vs), pn(hs);
  }
  function Bv(n) {
    xo(hs.current);
    var r = xo(Ri.current), l = On(r, n.type);
    r !== l && (et(vs, n), et(Ri, l));
  }
  function Mc(n) {
    vs.current === n && (pn(Ri), pn(vs));
  }
  var Dn = Ma(0);
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
  function rt() {
    for (var n = 0; n < ms.length; n++) ms[n]._workInProgressVersionPrimary = null;
    ms.length = 0;
  }
  var Dt = Se.ReactCurrentDispatcher, $t = Se.ReactCurrentBatchConfig, an = 0, Yt = null, Yn = null, lr = null, zc = !1, ys = !1, wo = 0, de = 0;
  function Vt() {
    throw Error(b(321));
  }
  function st(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ri(n[l], r[l])) return !1;
    return !0;
  }
  function Ml(n, r, l, u, c, d) {
    if (an = d, Yt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Dt.current = n === null || n.memoizedState === null ? Xc : bs, n = l(u, c), ys) {
      d = 0;
      do {
        if (ys = !1, wo = 0, 25 <= d) throw Error(b(301));
        d += 1, lr = Yn = null, r.updateQueue = null, Dt.current = Jc, n = l(u, c);
      } while (ys);
    }
    if (Dt.current = Do, r = Yn !== null && Yn.next !== null, an = 0, lr = Yn = Yt = null, zc = !1, r) throw Error(b(300));
    return n;
  }
  function ii() {
    var n = wo !== 0;
    return wo = 0, n;
  }
  function Dr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return lr === null ? Yt.memoizedState = lr = n : lr = lr.next = n, lr;
  }
  function Un() {
    if (Yn === null) {
      var n = Yt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Yn.next;
    var r = lr === null ? Yt.memoizedState : lr.next;
    if (r !== null) lr = r, Yn = n;
    else {
      if (n === null) throw Error(b(310));
      Yn = n, n = { memoizedState: Yn.memoizedState, baseState: Yn.baseState, baseQueue: Yn.baseQueue, queue: Yn.queue, next: null }, lr === null ? Yt.memoizedState = lr = n : lr = lr.next = n;
    }
    return lr;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Al(n) {
    var r = Un(), l = r.queue;
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
      var w = y = null, k = null, Y = d;
      do {
        var me = Y.lane;
        if ((an & me) === me) k !== null && (k = k.next = { lane: 0, action: Y.action, hasEagerState: Y.hasEagerState, eagerState: Y.eagerState, next: null }), u = Y.hasEagerState ? Y.eagerState : n(u, Y.action);
        else {
          var Ce = {
            lane: me,
            action: Y.action,
            hasEagerState: Y.hasEagerState,
            eagerState: Y.eagerState,
            next: null
          };
          k === null ? (w = k = Ce, y = u) : k = k.next = Ce, Yt.lanes |= me, Ni |= me;
        }
        Y = Y.next;
      } while (Y !== null && Y !== d);
      k === null ? y = u : k.next = w, ri(u, r.memoizedState) || (Qn = !0), r.memoizedState = u, r.baseState = y, r.baseQueue = k, l.lastRenderedState = u;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Yt.lanes |= d, Ni |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function To(n) {
    var r = Un(), l = r.queue;
    if (l === null) throw Error(b(311));
    l.lastRenderedReducer = n;
    var u = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var y = c = c.next;
      do
        d = n(d, y.action), y = y.next;
      while (y !== c);
      ri(d, r.memoizedState) || (Qn = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, u];
  }
  function Uc() {
  }
  function Fc(n, r) {
    var l = Yt, u = Un(), c = r(), d = !ri(u.memoizedState, c);
    if (d && (u.memoizedState = c, Qn = !0), u = u.queue, gs(Vc.bind(null, l, u, n), [n]), u.getSnapshot !== r || d || lr !== null && lr.memoizedState.tag & 1) {
      if (l.flags |= 2048, Ro(9, Hc.bind(null, l, u, c, r), void 0, null), tr === null) throw Error(b(349));
      an & 30 || Pc(l, r, c);
    }
    return c;
  }
  function Pc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Yt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Yt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
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
      return !ri(n, l);
    } catch {
      return !0;
    }
  }
  function Ic(n) {
    var r = ga(n, 1);
    r !== null && Vr(r, n, 1, -1);
  }
  function $c(n) {
    var r = Dr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = ko.bind(null, Yt, n), [r.memoizedState, n];
  }
  function Ro(n, r, l, u) {
    return n = { tag: n, create: r, destroy: l, deps: u, next: null }, r = Yt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Yt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (u = l.next, l.next = n, n.next = u, r.lastEffect = n)), n;
  }
  function Yc() {
    return Un().memoizedState;
  }
  function Su(n, r, l, u) {
    var c = Dr();
    Yt.flags |= n, c.memoizedState = Ro(1 | r, l, void 0, u === void 0 ? null : u);
  }
  function Eu(n, r, l, u) {
    var c = Un();
    u = u === void 0 ? null : u;
    var d = void 0;
    if (Yn !== null) {
      var y = Yn.memoizedState;
      if (d = y.destroy, u !== null && st(u, y.deps)) {
        c.memoizedState = Ro(r, l, d, u);
        return;
      }
    }
    Yt.flags |= n, c.memoizedState = Ro(1 | r, l, d, u);
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
    var l = Un();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && st(r, u[1]) ? u[0] : (l.memoizedState = [n, r], n);
  }
  function qc(n, r) {
    var l = Un();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && st(r, u[1]) ? u[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function Nd(n, r, l) {
    return an & 21 ? (ri(l, r) || (l = Zo(), Yt.lanes |= l, Ni |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Qn = !0), n.memoizedState = l);
  }
  function Cs(n, r) {
    var l = It;
    It = l !== 0 && 4 > l ? l : 4, n(!0);
    var u = $t.transition;
    $t.transition = {};
    try {
      n(!1), r();
    } finally {
      It = l, $t.transition = u;
    }
  }
  function jd() {
    return Un().memoizedState;
  }
  function xs(n, r, l) {
    var u = ji(n);
    if (l = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null }, aa(n)) Iv(r, l);
    else if (l = Rd(n, r, l, u), l !== null) {
      var c = Kn();
      Vr(l, n, u, c), un(l, r, u);
    }
  }
  function ko(n, r, l) {
    var u = ji(n), c = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (aa(n)) Iv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var y = r.lastRenderedState, w = d(y, l);
        if (c.hasEagerState = !0, c.eagerState = w, ri(w, y)) {
          var k = r.interleaved;
          k === null ? (c.next = c, Td(r)) : (c.next = k.next, k.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = Rd(n, r, c, u), l !== null && (c = Kn(), Vr(l, n, u, c), un(l, r, u));
    }
  }
  function aa(n) {
    var r = n.alternate;
    return n === Yt || r !== null && r === Yt;
  }
  function Iv(n, r) {
    ys = zc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function un(n, r, l) {
    if (l & 4194240) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, Vi(n, l);
    }
  }
  var Do = { readContext: Ua, useCallback: Vt, useContext: Vt, useEffect: Vt, useImperativeHandle: Vt, useInsertionEffect: Vt, useLayoutEffect: Vt, useMemo: Vt, useReducer: Vt, useRef: Vt, useState: Vt, useDebugValue: Vt, useDeferredValue: Vt, useTransition: Vt, useMutableSource: Vt, useSyncExternalStore: Vt, useId: Vt, unstable_isNewReconciler: !1 }, Xc = { readContext: Ua, useCallback: function(n, r) {
    return Dr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ua, useEffect: Qc, useImperativeHandle: function(n, r, l) {
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
    return r = l !== void 0 ? l(r) : r, u.memoizedState = u.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, u.queue = n, n = n.dispatch = xs.bind(null, Yt, n), [u.memoizedState, n];
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
    var u = Yt, c = Dr();
    if (Cn) {
      if (l === void 0) throw Error(b(407));
      l = l();
    } else {
      if (l = r(), tr === null) throw Error(b(349));
      an & 30 || Pc(u, r, l);
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
    var n = Dr(), r = tr.identifierPrefix;
    if (Cn) {
      var l = Ti, u = wi;
      l = (u & ~(1 << 32 - Ar(u) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = wo++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = de++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, bs = {
    readContext: Ua,
    useCallback: Kc,
    useContext: Ua,
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
      var r = Un();
      return Nd(r, Yn.memoizedState, n);
    },
    useTransition: function() {
      var n = Al(Xi)[0], r = Un().memoizedState;
      return [n, r];
    },
    useMutableSource: Uc,
    useSyncExternalStore: Fc,
    useId: jd,
    unstable_isNewReconciler: !1
  }, Jc = { readContext: Ua, useCallback: Kc, useContext: Ua, useEffect: gs, useImperativeHandle: Gc, useInsertionEffect: Wc, useLayoutEffect: Ss, useMemo: qc, useReducer: To, useRef: Yc, useState: function() {
    return To(Xi);
  }, useDebugValue: Es, useDeferredValue: function(n) {
    var r = Un();
    return Yn === null ? r.memoizedState = n : Nd(r, Yn.memoizedState, n);
  }, useTransition: function() {
    var n = To(Xi)[0], r = Un().memoizedState;
    return [n, r];
  }, useMutableSource: Uc, useSyncExternalStore: Fc, useId: jd, unstable_isNewReconciler: !1 };
  function li(n, r) {
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
    return (n = n._reactInternals) ? St(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var u = Kn(), c = ji(n), d = qi(u, c);
    d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (Vr(r, n, c, u), Lc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var u = Kn(), c = ji(n), d = qi(u, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (Vr(r, n, c, u), Lc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Kn(), u = ji(n), c = qi(l, u);
    c.tag = 2, r != null && (c.callback = r), r = Ll(n, c, u), r !== null && (Vr(r, n, u, l), Lc(r, n, u));
  } };
  function $v(n, r, l, u, c, d, y) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(u, d, y) : r.prototype && r.prototype.isPureReactComponent ? !ns(l, u) || !ns(c, d) : !0;
  }
  function ef(n, r, l) {
    var u = !1, c = kr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Ua(d) : (c = In(r) ? Zr : Ln.current, u = r.contextTypes, d = (u = u != null) ? ea(n, c) : kr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Zc, n.stateNode = r, r._reactInternals = n, u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Yv(n, r, l, u) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, u), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, u), r.state !== n && Zc.enqueueReplaceState(r, r.state, null);
  }
  function ws(n, r, l, u) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, _d(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Ua(d) : (d = In(r) ? Zr : Ln.current, c.context = ea(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Od(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Zc.enqueueReplaceState(c, c.state, null), ds(n, l, c, u), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function No(n, r) {
    try {
      var l = "", u = r;
      do
        l += bt(u), u = u.return;
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
  function Qv(n, r, l) {
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
    c.has(l) || (c.add(l), n = xy.bind(null, n, r, l), r.then(n, n));
  }
  function Wv(n) {
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
  function hr(n, r, l, u) {
    r.child = n === null ? Me(r, null, l, u) : zn(r, n.child, l, u);
  }
  function ia(n, r, l, u, c) {
    l = l.render;
    var d = r.ref;
    return kn(r, c), u = Ml(n, r, l, u, d, c), l = ii(), n !== null && !Qn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Pa(n, r, c)) : (Cn && l && Dc(r), r.flags |= 1, hr(n, r, u, c), r.child);
  }
  function jo(n, r, l, u, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !qd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, xt(n, r, d, u, c)) : (n = Vs(l.type, null, u, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var y = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : ns, l(y, u) && n.ref === r.ref) return Pa(n, r, c);
    }
    return r.flags |= 1, n = Hl(d, u), n.ref = r.ref, n.return = r, r.child = n;
  }
  function xt(n, r, l, u, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (ns(d, u) && n.ref === r.ref) if (Qn = !1, r.pendingProps = u = d, (n.lanes & c) !== 0) n.flags & 131072 && (Qn = !0);
      else return r.lanes = n.lanes, Pa(n, r, c);
    }
    return Gv(n, r, l, u, c);
  }
  function Rs(n, r, l) {
    var u = r.pendingProps, c = u.children, d = n !== null ? n.memoizedState : null;
    if (u.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, et(bu, Ea), Ea |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, et(bu, Ea), Ea |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, u = d !== null ? d.baseLanes : l, et(bu, Ea), Ea |= u;
    }
    else d !== null ? (u = d.baseLanes | l, r.memoizedState = null) : u = l, et(bu, Ea), Ea |= u;
    return hr(n, r, c, l), r.child;
  }
  function Ud(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Gv(n, r, l, u, c) {
    var d = In(l) ? Zr : Ln.current;
    return d = ea(r, d), kn(r, c), l = Ml(n, r, l, u, d, c), u = ii(), n !== null && !Qn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Pa(n, r, c)) : (Cn && u && Dc(r), r.flags |= 1, hr(n, r, l, c), r.child);
  }
  function Kv(n, r, l, u, c) {
    if (In(l)) {
      var d = !0;
      ir(r);
    } else d = !1;
    if (kn(r, c), r.stateNode === null) Fa(n, r), ef(r, l, u), ws(r, l, u, c), u = !0;
    else if (n === null) {
      var y = r.stateNode, w = r.memoizedProps;
      y.props = w;
      var k = y.context, Y = l.contextType;
      typeof Y == "object" && Y !== null ? Y = Ua(Y) : (Y = In(l) ? Zr : Ln.current, Y = ea(r, Y));
      var me = l.getDerivedStateFromProps, Ce = typeof me == "function" || typeof y.getSnapshotBeforeUpdate == "function";
      Ce || typeof y.UNSAFE_componentWillReceiveProps != "function" && typeof y.componentWillReceiveProps != "function" || (w !== u || k !== Y) && Yv(r, y, u, Y), Sa = !1;
      var ve = r.memoizedState;
      y.state = ve, ds(r, u, y, c), k = r.memoizedState, w !== u || ve !== k || Zn.current || Sa ? (typeof me == "function" && (Od(r, l, me, u), k = r.memoizedState), (w = Sa || $v(r, l, w, u, ve, k, Y)) ? (Ce || typeof y.UNSAFE_componentWillMount != "function" && typeof y.componentWillMount != "function" || (typeof y.componentWillMount == "function" && y.componentWillMount(), typeof y.UNSAFE_componentWillMount == "function" && y.UNSAFE_componentWillMount()), typeof y.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof y.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = u, r.memoizedState = k), y.props = u, y.state = k, y.context = Y, u = w) : (typeof y.componentDidMount == "function" && (r.flags |= 4194308), u = !1);
    } else {
      y = r.stateNode, Hv(n, r), w = r.memoizedProps, Y = r.type === r.elementType ? w : li(r.type, w), y.props = Y, Ce = r.pendingProps, ve = y.context, k = l.contextType, typeof k == "object" && k !== null ? k = Ua(k) : (k = In(l) ? Zr : Ln.current, k = ea(r, k));
      var Fe = l.getDerivedStateFromProps;
      (me = typeof Fe == "function" || typeof y.getSnapshotBeforeUpdate == "function") || typeof y.UNSAFE_componentWillReceiveProps != "function" && typeof y.componentWillReceiveProps != "function" || (w !== Ce || ve !== k) && Yv(r, y, u, k), Sa = !1, ve = r.memoizedState, y.state = ve, ds(r, u, y, c);
      var Ye = r.memoizedState;
      w !== Ce || ve !== Ye || Zn.current || Sa ? (typeof Fe == "function" && (Od(r, l, Fe, u), Ye = r.memoizedState), (Y = Sa || $v(r, l, Y, u, ve, Ye, k) || !1) ? (me || typeof y.UNSAFE_componentWillUpdate != "function" && typeof y.componentWillUpdate != "function" || (typeof y.componentWillUpdate == "function" && y.componentWillUpdate(u, Ye, k), typeof y.UNSAFE_componentWillUpdate == "function" && y.UNSAFE_componentWillUpdate(u, Ye, k)), typeof y.componentDidUpdate == "function" && (r.flags |= 4), typeof y.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof y.componentDidUpdate != "function" || w === n.memoizedProps && ve === n.memoizedState || (r.flags |= 4), typeof y.getSnapshotBeforeUpdate != "function" || w === n.memoizedProps && ve === n.memoizedState || (r.flags |= 1024), r.memoizedProps = u, r.memoizedState = Ye), y.props = u, y.state = Ye, y.context = k, u = Y) : (typeof y.componentDidUpdate != "function" || w === n.memoizedProps && ve === n.memoizedState || (r.flags |= 4), typeof y.getSnapshotBeforeUpdate != "function" || w === n.memoizedProps && ve === n.memoizedState || (r.flags |= 1024), u = !1);
    }
    return _s(n, r, l, u, d, c);
  }
  function _s(n, r, l, u, c, d) {
    Ud(n, r);
    var y = (r.flags & 128) !== 0;
    if (!u && !y) return c && _c(r, l, !1), Pa(n, r, d);
    u = r.stateNode, Ts.current = r;
    var w = y && typeof l.getDerivedStateFromError != "function" ? null : u.render();
    return r.flags |= 1, n !== null && y ? (r.child = zn(r, n.child, null, d), r.child = zn(r, null, w, d)) : hr(n, r, w, d), r.memoizedState = u.state, c && _c(r, l, !0), r.child;
  }
  function Cu(n) {
    var r = n.stateNode;
    r.pendingContext ? zv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && zv(n, r.context, !1), Dd(n, r.containerInfo);
  }
  function qv(n, r, l, u, c) {
    return Ol(), Ki(c), r.flags |= 256, hr(n, r, l, u), r.child;
  }
  var nf = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Fd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function rf(n, r, l) {
    var u = r.pendingProps, c = Dn.current, d = !1, y = (r.flags & 128) !== 0, w;
    if ((w = y) || (w = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), w ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), et(Dn, c & 1), n === null)
      return Ed(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (y = u.children, n = u.fallback, d ? (u = r.mode, d = r.child, y = { mode: "hidden", children: y }, !(u & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = y) : d = Vl(y, u, 0, null), n = tl(n, u, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Fd(l), r.memoizedState = nf, n) : Pd(r, y));
    if (c = n.memoizedState, c !== null && (w = c.dehydrated, w !== null)) return Xv(n, r, y, u, w, c, l);
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
    return u !== null && Ki(u), zn(r, n.child, null, l), n = Pd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Xv(n, r, l, u, c, d, y) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, u = Ld(Error(b(422))), ks(n, r, y, u)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = u.fallback, c = r.mode, u = Vl({ mode: "visible", children: u.children }, c, 0, null), d = tl(d, c, y, null), d.flags |= 2, u.return = r, d.return = r, u.sibling = d, r.child = u, r.mode & 1 && zn(r, n.child, null, y), r.child.memoizedState = Fd(y), r.memoizedState = nf, d);
    if (!(r.mode & 1)) return ks(n, r, y, null);
    if (c.data === "$!") {
      if (u = c.nextSibling && c.nextSibling.dataset, u) var w = u.dgst;
      return u = w, d = Error(b(419)), u = Ld(d, u, void 0), ks(n, r, y, u);
    }
    if (w = (y & n.childLanes) !== 0, Qn || w) {
      if (u = tr, u !== null) {
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
        c = c & (u.suspendedLanes | y) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, ga(n, c), Vr(u, n, c, -1));
      }
      return Kd(), u = Ld(Error(b(421))), ks(n, r, y, u);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = by.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, na = Ei(c.nextSibling), ta = r, Cn = !0, za = null, n !== null && ($n[Aa++] = wi, $n[Aa++] = Ti, $n[Aa++] = ma, wi = n.id, Ti = n.overflow, ma = r), r = Pd(r, u.children), r.flags |= 4096, r);
  }
  function Hd(n, r, l) {
    n.lanes |= r;
    var u = n.alternate;
    u !== null && (u.lanes |= r), wd(n.return, r, l);
  }
  function Fr(n, r, l, u, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: u, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = u, d.tail = l, d.tailMode = c);
  }
  function _i(n, r, l) {
    var u = r.pendingProps, c = u.revealOrder, d = u.tail;
    if (hr(n, r, u.children, l), u = Dn.current, u & 2) u = u & 1 | 2, r.flags |= 128;
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
    if (et(Dn, u), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Ac(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Fr(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Ac(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        Fr(r, !0, l, null, d);
        break;
      case "together":
        Fr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Fa(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Pa(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Ni |= r.lanes, !(l & r.childLanes)) return null;
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
        Bv(r);
        break;
      case 1:
        In(r.type) && ir(r);
        break;
      case 4:
        Dd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var u = r.type._context, c = r.memoizedProps.value;
        et(ya, u._currentValue), u._currentValue = c;
        break;
      case 13:
        if (u = r.memoizedState, u !== null)
          return u.dehydrated !== null ? (et(Dn, Dn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? rf(n, r, l) : (et(Dn, Dn.current & 1), n = Pa(n, r, l), n !== null ? n.sibling : null);
        et(Dn, Dn.current & 1);
        break;
      case 19:
        if (u = (l & r.childLanes) !== 0, n.flags & 128) {
          if (u) return _i(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), et(Dn, Dn.current), u) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Rs(n, r, l);
    }
    return Pa(n, r, l);
  }
  var Ha, Wn, Jv, Zv;
  Ha = function(n, r) {
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
  }, Jv = function(n, r, l, u) {
    var c = n.memoizedProps;
    if (c !== u) {
      n = r.stateNode, xo(Ri.current);
      var d = null;
      switch (l) {
        case "input":
          c = Xn(n, c), u = Xn(n, u), d = [];
          break;
        case "select":
          c = Re({}, c, { value: void 0 }), u = Re({}, u, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Xe(n, c), u = Xe(n, u), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof u.onClick == "function" && (n.onclick = Rl);
      }
      mn(l, u);
      var y;
      l = null;
      for (Y in c) if (!u.hasOwnProperty(Y) && c.hasOwnProperty(Y) && c[Y] != null) if (Y === "style") {
        var w = c[Y];
        for (y in w) w.hasOwnProperty(y) && (l || (l = {}), l[y] = "");
      } else Y !== "dangerouslySetInnerHTML" && Y !== "children" && Y !== "suppressContentEditableWarning" && Y !== "suppressHydrationWarning" && Y !== "autoFocus" && (ee.hasOwnProperty(Y) ? d || (d = []) : (d = d || []).push(Y, null));
      for (Y in u) {
        var k = u[Y];
        if (w = c != null ? c[Y] : void 0, u.hasOwnProperty(Y) && k !== w && (k != null || w != null)) if (Y === "style") if (w) {
          for (y in w) !w.hasOwnProperty(y) || k && k.hasOwnProperty(y) || (l || (l = {}), l[y] = "");
          for (y in k) k.hasOwnProperty(y) && w[y] !== k[y] && (l || (l = {}), l[y] = k[y]);
        } else l || (d || (d = []), d.push(
          Y,
          l
        )), l = k;
        else Y === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, w = w ? w.__html : void 0, k != null && w !== k && (d = d || []).push(Y, k)) : Y === "children" ? typeof k != "string" && typeof k != "number" || (d = d || []).push(Y, "" + k) : Y !== "suppressContentEditableWarning" && Y !== "suppressHydrationWarning" && (ee.hasOwnProperty(Y) ? (k != null && Y === "onScroll" && qt("scroll", n), d || w === k || (d = [])) : (d = d || []).push(Y, k));
      }
      l && (d = d || []).push("style", l);
      var Y = d;
      (r.updateQueue = Y) && (r.flags |= 4);
    }
  }, Zv = function(n, r, l, u) {
    l !== u && (r.flags |= 4);
  };
  function Ns(n, r) {
    if (!Cn) switch (n.tailMode) {
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
  function eh(n, r, l) {
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
        return u = r.stateNode, bo(), pn(Zn), pn(Ln), rt(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (n === null || n.child === null) && (jc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, za !== null && (Mo(za), za = null))), Wn(n, r), or(r), null;
      case 5:
        Mc(r);
        var c = xo(hs.current);
        if (l = r.type, n !== null && r.stateNode != null) Jv(n, r, l, u, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!u) {
            if (r.stateNode === null) throw Error(b(166));
            return or(r), null;
          }
          if (n = xo(Ri.current), jc(r)) {
            u = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (u[Ci] = r, u[us] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                qt("cancel", u), qt("close", u);
                break;
              case "iframe":
              case "object":
              case "embed":
                qt("load", u);
                break;
              case "video":
              case "audio":
                for (c = 0; c < is.length; c++) qt(is[c], u);
                break;
              case "source":
                qt("error", u);
                break;
              case "img":
              case "image":
              case "link":
                qt(
                  "error",
                  u
                ), qt("load", u);
                break;
              case "details":
                qt("toggle", u);
                break;
              case "input":
                Mn(u, d), qt("invalid", u);
                break;
              case "select":
                u._wrapperState = { wasMultiple: !!d.multiple }, qt("invalid", u);
                break;
              case "textarea":
                Lt(u, d), qt("invalid", u);
            }
            mn(l, d), c = null;
            for (var y in d) if (d.hasOwnProperty(y)) {
              var w = d[y];
              y === "children" ? typeof w == "string" ? u.textContent !== w && (d.suppressHydrationWarning !== !0 && bc(u.textContent, w, n), c = ["children", w]) : typeof w == "number" && u.textContent !== "" + w && (d.suppressHydrationWarning !== !0 && bc(
                u.textContent,
                w,
                n
              ), c = ["children", "" + w]) : ee.hasOwnProperty(y) && w != null && y === "onScroll" && qt("scroll", u);
            }
            switch (l) {
              case "input":
                jn(u), _a(u, d, !0);
                break;
              case "textarea":
                jn(u), Jt(u);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (u.onclick = Rl);
            }
            u = c, r.updateQueue = u, u !== null && (r.flags |= 4);
          } else {
            y = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = vn(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = y.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof u.is == "string" ? n = y.createElement(l, { is: u.is }) : (n = y.createElement(l), l === "select" && (y = n, u.multiple ? y.multiple = !0 : u.size && (y.size = u.size))) : n = y.createElementNS(n, l), n[Ci] = r, n[us] = u, Ha(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (y = ar(l, u), l) {
                case "dialog":
                  qt("cancel", n), qt("close", n), c = u;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  qt("load", n), c = u;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < is.length; c++) qt(is[c], n);
                  c = u;
                  break;
                case "source":
                  qt("error", n), c = u;
                  break;
                case "img":
                case "image":
                case "link":
                  qt(
                    "error",
                    n
                  ), qt("load", n), c = u;
                  break;
                case "details":
                  qt("toggle", n), c = u;
                  break;
                case "input":
                  Mn(n, u), c = Xn(n, u), qt("invalid", n);
                  break;
                case "option":
                  c = u;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!u.multiple }, c = Re({}, u, { value: void 0 }), qt("invalid", n);
                  break;
                case "textarea":
                  Lt(n, u), c = Xe(n, u), qt("invalid", n);
                  break;
                default:
                  c = u;
              }
              mn(l, c), w = c;
              for (d in w) if (w.hasOwnProperty(d)) {
                var k = w[d];
                d === "style" ? sn(n, k) : d === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, k != null && hn(n, k)) : d === "children" ? typeof k == "string" ? (l !== "textarea" || k !== "") && Te(n, k) : typeof k == "number" && Te(n, "" + k) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (ee.hasOwnProperty(d) ? k != null && d === "onScroll" && qt("scroll", n) : k != null && Ee(n, d, k, y));
              }
              switch (l) {
                case "input":
                  jn(n), _a(n, u, !1);
                  break;
                case "textarea":
                  jn(n), Jt(n);
                  break;
                case "option":
                  u.value != null && n.setAttribute("value", "" + Ct(u.value));
                  break;
                case "select":
                  n.multiple = !!u.multiple, d = u.value, d != null ? G(n, !!u.multiple, d, !1) : u.defaultValue != null && G(
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
        if (n && r.stateNode != null) Zv(n, r, n.memoizedProps, u);
        else {
          if (typeof u != "string" && r.stateNode === null) throw Error(b(166));
          if (l = xo(hs.current), xo(Ri.current), jc(r)) {
            if (u = r.stateNode, l = r.memoizedProps, u[Ci] = r, (d = u.nodeValue !== l) && (n = ta, n !== null)) switch (n.tag) {
              case 3:
                bc(u.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && bc(u.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else u = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(u), u[Ci] = r, r.stateNode = u;
        }
        return or(r), null;
      case 13:
        if (pn(Dn), u = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (Cn && na !== null && r.mode & 1 && !(r.flags & 128)) fs(), Ol(), r.flags |= 98560, d = !1;
          else if (d = jc(r), u !== null && u.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(b(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(b(317));
              d[Ci] = r;
            } else Ol(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            or(r), d = !1;
          } else za !== null && (Mo(za), za = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (u = u !== null, u !== (n !== null && n.memoizedState !== null) && u && (r.child.flags |= 8192, r.mode & 1 && (n === null || Dn.current & 1 ? Pn === 0 && (Pn = 3) : Kd())), r.updateQueue !== null && (r.flags |= 4), or(r), null);
      case 4:
        return bo(), Wn(n, r), n === null && fu(r.stateNode.containerInfo), or(r), null;
      case 10:
        return bd(r.type._context), or(r), null;
      case 17:
        return In(r.type) && mu(), or(r), null;
      case 19:
        if (pn(Dn), d = r.memoizedState, d === null) return or(r), null;
        if (u = (r.flags & 128) !== 0, y = d.rendering, y === null) if (u) Ns(d, !1);
        else {
          if (Pn !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (y = Ac(n), y !== null) {
              for (r.flags |= 128, Ns(d, !1), u = y.updateQueue, u !== null && (r.updateQueue = u, r.flags |= 4), r.subtreeFlags = 0, u = l, l = r.child; l !== null; ) d = l, n = u, d.flags &= 14680066, y = d.alternate, y === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = y.childLanes, d.lanes = y.lanes, d.child = y.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = y.memoizedProps, d.memoizedState = y.memoizedState, d.updateQueue = y.updateQueue, d.type = y.type, n = y.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return et(Dn, Dn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && Et() > Tu && (r.flags |= 128, u = !0, Ns(d, !1), r.lanes = 4194304);
        }
        else {
          if (!u) if (n = Ac(y), n !== null) {
            if (r.flags |= 128, u = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ns(d, !0), d.tail === null && d.tailMode === "hidden" && !y.alternate && !Cn) return or(r), null;
          } else 2 * Et() - d.renderingStartTime > Tu && l !== 1073741824 && (r.flags |= 128, u = !0, Ns(d, !1), r.lanes = 4194304);
          d.isBackwards ? (y.sibling = r.child, r.child = y) : (l = d.last, l !== null ? l.sibling = y : r.child = y, d.last = y);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = Et(), r.sibling = null, l = Dn.current, et(Dn, u ? l & 1 | 2 : l & 1), r) : (or(r), null);
      case 22:
      case 23:
        return Gd(), u = r.memoizedState !== null, n !== null && n.memoizedState !== null !== u && (r.flags |= 8192), u && r.mode & 1 ? Ea & 1073741824 && (or(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : or(r), null;
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
        return bo(), pn(Zn), pn(Ln), rt(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Mc(r), null;
      case 13:
        if (pn(Dn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(b(340));
          Ol();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return pn(Dn), null;
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
  var js = !1, Nr = !1, my = typeof WeakSet == "function" ? WeakSet : Set, Be = null;
  function xu(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (u) {
      xn(n, r, u);
    }
    else l.current = null;
  }
  function lf(n, r, l) {
    try {
      l();
    } catch (u) {
      xn(n, r, u);
    }
  }
  var th = !1;
  function nh(n, r) {
    if (os = ja, n = rs(), hc(n)) {
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
          var y = 0, w = -1, k = -1, Y = 0, me = 0, Ce = n, ve = null;
          t: for (; ; ) {
            for (var Fe; Ce !== l || c !== 0 && Ce.nodeType !== 3 || (w = y + c), Ce !== d || u !== 0 && Ce.nodeType !== 3 || (k = y + u), Ce.nodeType === 3 && (y += Ce.nodeValue.length), (Fe = Ce.firstChild) !== null; )
              ve = Ce, Ce = Fe;
            for (; ; ) {
              if (Ce === n) break t;
              if (ve === l && ++Y === c && (w = y), ve === d && ++me === u && (k = y), (Fe = Ce.nextSibling) !== null) break;
              Ce = ve, ve = Ce.parentNode;
            }
            Ce = Fe;
          }
          l = w === -1 || k === -1 ? null : { start: w, end: k };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (mo = { focusedElem: n, selectionRange: l }, ja = !1, Be = r; Be !== null; ) if (r = Be, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Be = n;
    else for (; Be !== null; ) {
      r = Be;
      try {
        var Ye = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Ye !== null) {
              var Ke = Ye.memoizedProps, Hn = Ye.memoizedState, U = r.stateNode, j = U.getSnapshotBeforeUpdate(r.elementType === r.type ? Ke : li(r.type, Ke), Hn);
              U.__reactInternalSnapshotBeforeUpdate = j;
            }
            break;
          case 3:
            var B = r.stateNode.containerInfo;
            B.nodeType === 1 ? B.textContent = "" : B.nodeType === 9 && B.documentElement && B.removeChild(B.documentElement);
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
        xn(r, r.return, ye);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Be = n;
        break;
      }
      Be = r.return;
    }
    return Ye = th, th = !1, Ye;
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
    r !== null && (n.alternate = null, of(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ci], delete r[us], delete r[ss], delete r[hu], delete r[vy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
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
  function ki(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = Rl));
    else if (u !== 4 && (n = n.child, n !== null)) for (ki(n, r, l), n = n.sibling; n !== null; ) ki(n, r, l), n = n.sibling;
  }
  function Di(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (u !== 4 && (n = n.child, n !== null)) for (Di(n, r, l), n = n.sibling; n !== null; ) Di(n, r, l), n = n.sibling;
  }
  var Fn = null, Pr = !1;
  function Hr(n, r, l) {
    for (l = l.child; l !== null; ) rh(n, r, l), l = l.sibling;
  }
  function rh(n, r, l) {
    if (Xr && typeof Xr.onCommitFiberUnmount == "function") try {
      Xr.onCommitFiberUnmount(yl, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Nr || xu(l, r);
      case 6:
        var u = Fn, c = Pr;
        Fn = null, Hr(n, r, l), Fn = u, Pr = c, Fn !== null && (Pr ? (n = Fn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : Fn.removeChild(l.stateNode));
        break;
      case 18:
        Fn !== null && (Pr ? (n = Fn, l = l.stateNode, n.nodeType === 8 ? vu(n.parentNode, l) : n.nodeType === 1 && vu(n, l), ti(n)) : vu(Fn, l.stateNode));
        break;
      case 4:
        u = Fn, c = Pr, Fn = l.stateNode.containerInfo, Pr = !0, Hr(n, r, l), Fn = u, Pr = c;
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
        Hr(n, r, l);
        break;
      case 1:
        if (!Nr && (xu(l, r), u = l.stateNode, typeof u.componentWillUnmount == "function")) try {
          u.props = l.memoizedProps, u.state = l.memoizedState, u.componentWillUnmount();
        } catch (w) {
          xn(l, r, w);
        }
        Hr(n, r, l);
        break;
      case 21:
        Hr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Nr = (u = Nr) || l.memoizedState !== null, Hr(n, r, l), Nr = u) : Hr(n, r, l);
        break;
      default:
        Hr(n, r, l);
    }
  }
  function ah(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new my()), r.forEach(function(u) {
        var c = ph.bind(null, n, u);
        l.has(u) || (l.add(u), u.then(c, c));
      });
    }
  }
  function oi(n, r) {
    var l = r.deletions;
    if (l !== null) for (var u = 0; u < l.length; u++) {
      var c = l[u];
      try {
        var d = n, y = r, w = y;
        e: for (; w !== null; ) {
          switch (w.tag) {
            case 5:
              Fn = w.stateNode, Pr = !1;
              break e;
            case 3:
              Fn = w.stateNode.containerInfo, Pr = !0;
              break e;
            case 4:
              Fn = w.stateNode.containerInfo, Pr = !0;
              break e;
          }
          w = w.return;
        }
        if (Fn === null) throw Error(b(160));
        rh(d, y, c), Fn = null, Pr = !1;
        var k = c.alternate;
        k !== null && (k.return = null), c.return = null;
      } catch (Y) {
        xn(c, r, Y);
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
        if (oi(r, n), la(n), u & 4) {
          try {
            Os(3, n, n.return), Ls(3, n);
          } catch (Ke) {
            xn(n, n.return, Ke);
          }
          try {
            Os(5, n, n.return);
          } catch (Ke) {
            xn(n, n.return, Ke);
          }
        }
        break;
      case 1:
        oi(r, n), la(n), u & 512 && l !== null && xu(l, l.return);
        break;
      case 5:
        if (oi(r, n), la(n), u & 512 && l !== null && xu(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            Te(c, "");
          } catch (Ke) {
            xn(n, n.return, Ke);
          }
        }
        if (u & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, y = l !== null ? l.memoizedProps : d, w = n.type, k = n.updateQueue;
          if (n.updateQueue = null, k !== null) try {
            w === "input" && d.type === "radio" && d.name != null && En(c, d), ar(w, y);
            var Y = ar(w, d);
            for (y = 0; y < k.length; y += 2) {
              var me = k[y], Ce = k[y + 1];
              me === "style" ? sn(c, Ce) : me === "dangerouslySetInnerHTML" ? hn(c, Ce) : me === "children" ? Te(c, Ce) : Ee(c, me, Ce, Y);
            }
            switch (w) {
              case "input":
                Rr(c, d);
                break;
              case "textarea":
                wn(c, d);
                break;
              case "select":
                var ve = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var Fe = d.value;
                Fe != null ? G(c, !!d.multiple, Fe, !1) : ve !== !!d.multiple && (d.defaultValue != null ? G(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : G(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[us] = d;
          } catch (Ke) {
            xn(n, n.return, Ke);
          }
        }
        break;
      case 6:
        if (oi(r, n), la(n), u & 4) {
          if (n.stateNode === null) throw Error(b(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (Ke) {
            xn(n, n.return, Ke);
          }
        }
        break;
      case 3:
        if (oi(r, n), la(n), u & 4 && l !== null && l.memoizedState.isDehydrated) try {
          ti(r.containerInfo);
        } catch (Ke) {
          xn(n, n.return, Ke);
        }
        break;
      case 4:
        oi(r, n), la(n);
        break;
      case 13:
        oi(r, n), la(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Yd = Et())), u & 4 && ah(n);
        break;
      case 22:
        if (me = l !== null && l.memoizedState !== null, n.mode & 1 ? (Nr = (Y = Nr) || me, oi(r, n), Nr = Y) : oi(r, n), la(n), u & 8192) {
          if (Y = n.memoizedState !== null, (n.stateNode.isHidden = Y) && !me && n.mode & 1) for (Be = n, me = n.child; me !== null; ) {
            for (Ce = Be = me; Be !== null; ) {
              switch (ve = Be, Fe = ve.child, ve.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, ve, ve.return);
                  break;
                case 1:
                  xu(ve, ve.return);
                  var Ye = ve.stateNode;
                  if (typeof Ye.componentWillUnmount == "function") {
                    u = ve, l = ve.return;
                    try {
                      r = u, Ye.props = r.memoizedProps, Ye.state = r.memoizedState, Ye.componentWillUnmount();
                    } catch (Ke) {
                      xn(u, l, Ke);
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
              Fe !== null ? (Fe.return = ve, Be = Fe) : As(Ce);
            }
            me = me.sibling;
          }
          e: for (me = null, Ce = n; ; ) {
            if (Ce.tag === 5) {
              if (me === null) {
                me = Ce;
                try {
                  c = Ce.stateNode, Y ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (w = Ce.stateNode, k = Ce.memoizedProps.style, y = k != null && k.hasOwnProperty("display") ? k.display : null, w.style.display = Kt("display", y));
                } catch (Ke) {
                  xn(n, n.return, Ke);
                }
              }
            } else if (Ce.tag === 6) {
              if (me === null) try {
                Ce.stateNode.nodeValue = Y ? "" : Ce.memoizedProps;
              } catch (Ke) {
                xn(n, n.return, Ke);
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
        oi(r, n), la(n), u & 4 && ah(n);
        break;
      case 21:
        break;
      default:
        oi(
          r,
          n
        ), la(n);
    }
  }
  function la(n) {
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
            u.flags & 32 && (Te(c, ""), u.flags &= -33);
            var d = Ji(n);
            Di(n, d, c);
            break;
          case 3:
          case 4:
            var y = u.stateNode.containerInfo, w = Ji(n);
            ki(n, w, y);
            break;
          default:
            throw Error(b(161));
        }
      } catch (k) {
        xn(n, n.return, k);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function yy(n, r, l) {
    Be = n, Id(n);
  }
  function Id(n, r, l) {
    for (var u = (n.mode & 1) !== 0; Be !== null; ) {
      var c = Be, d = c.child;
      if (c.tag === 22 && u) {
        var y = c.memoizedState !== null || js;
        if (!y) {
          var w = c.alternate, k = w !== null && w.memoizedState !== null || Nr;
          w = js;
          var Y = Nr;
          if (js = y, (Nr = k) && !Y) for (Be = c; Be !== null; ) y = Be, k = y.child, y.tag === 22 && y.memoizedState !== null ? $d(c) : k !== null ? (k.return = y, Be = k) : $d(c);
          for (; d !== null; ) Be = d, Id(d), d = d.sibling;
          Be = c, js = w, Nr = Y;
        }
        ih(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, Be = d) : ih(n);
    }
  }
  function ih(n) {
    for (; Be !== null; ) {
      var r = Be;
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
                var c = r.elementType === r.type ? l.memoizedProps : li(r.type, l.memoizedProps);
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
                var Y = r.alternate;
                if (Y !== null) {
                  var me = Y.memoizedState;
                  if (me !== null) {
                    var Ce = me.dehydrated;
                    Ce !== null && ti(Ce);
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
          xn(r, r.return, ve);
        }
      }
      if (r === n) {
        Be = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Be = l;
        break;
      }
      Be = r.return;
    }
  }
  function As(n) {
    for (; Be !== null; ) {
      var r = Be;
      if (r === n) {
        Be = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Be = l;
        break;
      }
      Be = r.return;
    }
  }
  function $d(n) {
    for (; Be !== null; ) {
      var r = Be;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ls(4, r);
            } catch (k) {
              xn(r, l, k);
            }
            break;
          case 1:
            var u = r.stateNode;
            if (typeof u.componentDidMount == "function") {
              var c = r.return;
              try {
                u.componentDidMount();
              } catch (k) {
                xn(r, c, k);
              }
            }
            var d = r.return;
            try {
              Vd(r);
            } catch (k) {
              xn(r, d, k);
            }
            break;
          case 5:
            var y = r.return;
            try {
              Vd(r);
            } catch (k) {
              xn(r, y, k);
            }
        }
      } catch (k) {
        xn(r, r.return, k);
      }
      if (r === n) {
        Be = null;
        break;
      }
      var w = r.sibling;
      if (w !== null) {
        w.return = r.return, Be = w;
        break;
      }
      Be = r.return;
    }
  }
  var gy = Math.ceil, Ul = Se.ReactCurrentDispatcher, Oo = Se.ReactCurrentOwner, mr = Se.ReactCurrentBatchConfig, zt = 0, tr = null, Gn = null, yr = 0, Ea = 0, bu = Ma(0), Pn = 0, zs = null, Ni = 0, wu = 0, uf = 0, Us = null, oa = null, Yd = 0, Tu = 1 / 0, Ca = null, Ru = !1, Lo = null, Fl = null, sf = !1, Zi = null, Fs = 0, Pl = 0, _u = null, Ps = -1, jr = 0;
  function Kn() {
    return zt & 6 ? Et() : Ps !== -1 ? Ps : Ps = Et();
  }
  function ji(n) {
    return n.mode & 1 ? zt & 2 && yr !== 0 ? yr & -yr : hy.transition !== null ? (jr === 0 && (jr = Zo()), jr) : (n = It, n !== 0 || (n = window.event, n = n === void 0 ? 16 : lu(n.type)), n) : 1;
  }
  function Vr(n, r, l, u) {
    if (50 < Pl) throw Pl = 0, _u = null, Error(b(185));
    Hi(n, l, u), (!(zt & 2) || n !== tr) && (n === tr && (!(zt & 2) && (wu |= l), Pn === 4 && ui(n, yr)), ua(n, u), l === 1 && zt === 0 && !(r.mode & 1) && (Tu = Et() + 500, yu && bi()));
  }
  function ua(n, r) {
    var l = n.callbackNode;
    lo(n, r);
    var u = ei(n, n === tr ? yr : 0);
    if (u === 0) l !== null && dr(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = u & -u, n.callbackPriority !== r) {
      if (l != null && dr(l), r === 1) n.tag === 0 ? kl(Qd.bind(null, n)) : kc(Qd.bind(null, n)), pu(function() {
        !(zt & 6) && bi();
      }), l = null;
      else {
        switch (tu(u)) {
          case 1:
            l = Ja;
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
        l = hh(l, cf.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function cf(n, r) {
    if (Ps = -1, jr = 0, zt & 6) throw Error(b(327));
    var l = n.callbackNode;
    if (ku() && n.callbackNode !== l) return null;
    var u = ei(n, n === tr ? yr : 0);
    if (u === 0) return null;
    if (u & 30 || u & n.expiredLanes || r) r = ff(n, u);
    else {
      r = u;
      var c = zt;
      zt |= 2;
      var d = oh();
      (tr !== n || yr !== r) && (Ca = null, Tu = Et() + 500, el(n, r));
      do
        try {
          uh();
          break;
        } catch (w) {
          lh(n, w);
        }
      while (!0);
      xd(), Ul.current = d, zt = c, Gn !== null ? r = 0 : (tr = null, yr = 0, r = Pn);
    }
    if (r !== 0) {
      if (r === 2 && (c = Sl(n), c !== 0 && (u = c, r = Hs(n, c))), r === 1) throw l = zs, el(n, 0), ui(n, u), ua(n, Et()), l;
      if (r === 6) ui(n, u);
      else {
        if (c = n.current.alternate, !(u & 30) && !Sy(c) && (r = ff(n, u), r === 2 && (d = Sl(n), d !== 0 && (u = d, r = Hs(n, d))), r === 1)) throw l = zs, el(n, 0), ui(n, u), ua(n, Et()), l;
        switch (n.finishedWork = c, n.finishedLanes = u, r) {
          case 0:
          case 1:
            throw Error(b(345));
          case 2:
            zo(n, oa, Ca);
            break;
          case 3:
            if (ui(n, u), (u & 130023424) === u && (r = Yd + 500 - Et(), 10 < r)) {
              if (ei(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & u) !== u) {
                Kn(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Tc(zo.bind(null, n, oa, Ca), r);
              break;
            }
            zo(n, oa, Ca);
            break;
          case 4:
            if (ui(n, u), (u & 4194240) === u) break;
            for (r = n.eventTimes, c = -1; 0 < u; ) {
              var y = 31 - Ar(u);
              d = 1 << y, y = r[y], y > c && (c = y), u &= ~d;
            }
            if (u = c, u = Et() - u, u = (120 > u ? 120 : 480 > u ? 480 : 1080 > u ? 1080 : 1920 > u ? 1920 : 3e3 > u ? 3e3 : 4320 > u ? 4320 : 1960 * gy(u / 1960)) - u, 10 < u) {
              n.timeoutHandle = Tc(zo.bind(null, n, oa, Ca), u);
              break;
            }
            zo(n, oa, Ca);
            break;
          case 5:
            zo(n, oa, Ca);
            break;
          default:
            throw Error(b(329));
        }
      }
    }
    return ua(n, Et()), n.callbackNode === l ? cf.bind(null, n) : null;
  }
  function Hs(n, r) {
    var l = Us;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = ff(n, r), n !== 2 && (r = oa, oa = l, r !== null && Mo(r)), n;
  }
  function Mo(n) {
    oa === null ? oa = n : oa.push.apply(oa, n);
  }
  function Sy(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var u = 0; u < l.length; u++) {
          var c = l[u], d = c.getSnapshot;
          c = c.value;
          try {
            if (!ri(d(), c)) return !1;
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
  function ui(n, r) {
    for (r &= ~uf, r &= ~wu, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Ar(r), u = 1 << l;
      n[l] = -1, r &= ~u;
    }
  }
  function Qd(n) {
    if (zt & 6) throw Error(b(327));
    ku();
    var r = ei(n, 0);
    if (!(r & 1)) return ua(n, Et()), null;
    var l = ff(n, r);
    if (n.tag !== 0 && l === 2) {
      var u = Sl(n);
      u !== 0 && (r = u, l = Hs(n, u));
    }
    if (l === 1) throw l = zs, el(n, 0), ui(n, r), ua(n, Et()), l;
    if (l === 6) throw Error(b(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, zo(n, oa, Ca), ua(n, Et()), null;
  }
  function Wd(n, r) {
    var l = zt;
    zt |= 1;
    try {
      return n(r);
    } finally {
      zt = l, zt === 0 && (Tu = Et() + 500, yu && bi());
    }
  }
  function Ao(n) {
    Zi !== null && Zi.tag === 0 && !(zt & 6) && ku();
    var r = zt;
    zt |= 1;
    var l = mr.transition, u = It;
    try {
      if (mr.transition = null, It = 1, n) return n();
    } finally {
      It = u, mr.transition = l, zt = r, !(zt & 6) && bi();
    }
  }
  function Gd() {
    Ea = bu.current, pn(bu);
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
          bo(), pn(Zn), pn(Ln), rt();
          break;
        case 5:
          Mc(u);
          break;
        case 4:
          bo();
          break;
        case 13:
          pn(Dn);
          break;
        case 19:
          pn(Dn);
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
    if (tr = n, Gn = n = Hl(n.current, null), yr = Ea = r, Pn = 0, zs = null, uf = wu = Ni = 0, oa = Us = null, Co !== null) {
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
  function lh(n, r) {
    do {
      var l = Gn;
      try {
        if (xd(), Dt.current = Do, zc) {
          for (var u = Yt.memoizedState; u !== null; ) {
            var c = u.queue;
            c !== null && (c.pending = null), u = u.next;
          }
          zc = !1;
        }
        if (an = 0, lr = Yn = Yt = null, ys = !1, wo = 0, Oo.current = null, l === null || l.return === null) {
          Pn = 1, zs = r, Gn = null;
          break;
        }
        e: {
          var d = n, y = l.return, w = l, k = r;
          if (r = yr, w.flags |= 32768, k !== null && typeof k == "object" && typeof k.then == "function") {
            var Y = k, me = w, Ce = me.tag;
            if (!(me.mode & 1) && (Ce === 0 || Ce === 11 || Ce === 15)) {
              var ve = me.alternate;
              ve ? (me.updateQueue = ve.updateQueue, me.memoizedState = ve.memoizedState, me.lanes = ve.lanes) : (me.updateQueue = null, me.memoizedState = null);
            }
            var Fe = Wv(y);
            if (Fe !== null) {
              Fe.flags &= -257, zl(Fe, y, w, d, r), Fe.mode & 1 && zd(d, Y, r), r = Fe, k = Y;
              var Ye = r.updateQueue;
              if (Ye === null) {
                var Ke = /* @__PURE__ */ new Set();
                Ke.add(k), r.updateQueue = Ke;
              } else Ye.add(k);
              break e;
            } else {
              if (!(r & 1)) {
                zd(d, Y, r), Kd();
                break e;
              }
              k = Error(b(426));
            }
          } else if (Cn && w.mode & 1) {
            var Hn = Wv(y);
            if (Hn !== null) {
              !(Hn.flags & 65536) && (Hn.flags |= 256), zl(Hn, y, w, d, r), Ki(No(k, w));
              break e;
            }
          }
          d = k = No(k, w), Pn !== 4 && (Pn = 2), Us === null ? Us = [d] : Us.push(d), d = y;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var U = Qv(d, k, r);
                Vv(d, U);
                break e;
              case 1:
                w = k;
                var j = d.type, B = d.stateNode;
                if (!(d.flags & 128) && (typeof j.getDerivedStateFromError == "function" || B !== null && typeof B.componentDidCatch == "function" && (Fl === null || !Fl.has(B)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var ye = Ad(d, w, r);
                  Vv(d, ye);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        ch(l);
      } catch (Qe) {
        r = Qe, Gn === l && l !== null && (Gn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function oh() {
    var n = Ul.current;
    return Ul.current = Do, n === null ? Do : n;
  }
  function Kd() {
    (Pn === 0 || Pn === 3 || Pn === 2) && (Pn = 4), tr === null || !(Ni & 268435455) && !(wu & 268435455) || ui(tr, yr);
  }
  function ff(n, r) {
    var l = zt;
    zt |= 2;
    var u = oh();
    (tr !== n || yr !== r) && (Ca = null, el(n, r));
    do
      try {
        Ey();
        break;
      } catch (c) {
        lh(n, c);
      }
    while (!0);
    if (xd(), zt = l, Ul.current = u, Gn !== null) throw Error(b(261));
    return tr = null, yr = 0, Pn;
  }
  function Ey() {
    for (; Gn !== null; ) sh(Gn);
  }
  function uh() {
    for (; Gn !== null && !qa(); ) sh(Gn);
  }
  function sh(n) {
    var r = vh(n.alternate, n, Ea);
    n.memoizedProps = n.pendingProps, r === null ? ch(n) : Gn = r, Oo.current = null;
  }
  function ch(n) {
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
          Pn = 6, Gn = null;
          return;
        }
      } else if (l = eh(l, r, Ea), l !== null) {
        Gn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        Gn = r;
        return;
      }
      Gn = r = n;
    } while (r !== null);
    Pn === 0 && (Pn = 5);
  }
  function zo(n, r, l) {
    var u = It, c = mr.transition;
    try {
      mr.transition = null, It = 1, Cy(n, r, l, u);
    } finally {
      mr.transition = c, It = u;
    }
    return null;
  }
  function Cy(n, r, l, u) {
    do
      ku();
    while (Zi !== null);
    if (zt & 6) throw Error(b(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(b(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (qf(n, d), n === tr && (Gn = tr = null, yr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || sf || (sf = !0, hh(io, function() {
      return ku(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = mr.transition, mr.transition = null;
      var y = It;
      It = 1;
      var w = zt;
      zt |= 4, Oo.current = null, nh(n, l), Bd(l, n), su(mo), ja = !!os, mo = os = null, n.current = l, yy(l), Xa(), zt = w, It = y, mr.transition = d;
    } else n.current = l;
    if (sf && (sf = !1, Zi = n, Fs = c), d = n.pendingLanes, d === 0 && (Fl = null), Wu(l.stateNode), ua(n, Et()), r !== null) for (u = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], u(c.value, { componentStack: c.stack, digest: c.digest });
    if (Ru) throw Ru = !1, n = Lo, Lo = null, n;
    return Fs & 1 && n.tag !== 0 && ku(), d = n.pendingLanes, d & 1 ? n === _u ? Pl++ : (Pl = 0, _u = n) : Pl = 0, bi(), null;
  }
  function ku() {
    if (Zi !== null) {
      var n = tu(Fs), r = mr.transition, l = It;
      try {
        if (mr.transition = null, It = 16 > n ? 16 : n, Zi === null) var u = !1;
        else {
          if (n = Zi, Zi = null, Fs = 0, zt & 6) throw Error(b(331));
          var c = zt;
          for (zt |= 4, Be = n.current; Be !== null; ) {
            var d = Be, y = d.child;
            if (Be.flags & 16) {
              var w = d.deletions;
              if (w !== null) {
                for (var k = 0; k < w.length; k++) {
                  var Y = w[k];
                  for (Be = Y; Be !== null; ) {
                    var me = Be;
                    switch (me.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, me, d);
                    }
                    var Ce = me.child;
                    if (Ce !== null) Ce.return = me, Be = Ce;
                    else for (; Be !== null; ) {
                      me = Be;
                      var ve = me.sibling, Fe = me.return;
                      if (of(me), me === Y) {
                        Be = null;
                        break;
                      }
                      if (ve !== null) {
                        ve.return = Fe, Be = ve;
                        break;
                      }
                      Be = Fe;
                    }
                  }
                }
                var Ye = d.alternate;
                if (Ye !== null) {
                  var Ke = Ye.child;
                  if (Ke !== null) {
                    Ye.child = null;
                    do {
                      var Hn = Ke.sibling;
                      Ke.sibling = null, Ke = Hn;
                    } while (Ke !== null);
                  }
                }
                Be = d;
              }
            }
            if (d.subtreeFlags & 2064 && y !== null) y.return = d, Be = y;
            else e: for (; Be !== null; ) {
              if (d = Be, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, d, d.return);
              }
              var U = d.sibling;
              if (U !== null) {
                U.return = d.return, Be = U;
                break e;
              }
              Be = d.return;
            }
          }
          var j = n.current;
          for (Be = j; Be !== null; ) {
            y = Be;
            var B = y.child;
            if (y.subtreeFlags & 2064 && B !== null) B.return = y, Be = B;
            else e: for (y = j; Be !== null; ) {
              if (w = Be, w.flags & 2048) try {
                switch (w.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ls(9, w);
                }
              } catch (Qe) {
                xn(w, w.return, Qe);
              }
              if (w === y) {
                Be = null;
                break e;
              }
              var ye = w.sibling;
              if (ye !== null) {
                ye.return = w.return, Be = ye;
                break e;
              }
              Be = w.return;
            }
          }
          if (zt = c, bi(), Xr && typeof Xr.onPostCommitFiberRoot == "function") try {
            Xr.onPostCommitFiberRoot(yl, n);
          } catch {
          }
          u = !0;
        }
        return u;
      } finally {
        It = l, mr.transition = r;
      }
    }
    return !1;
  }
  function fh(n, r, l) {
    r = No(l, r), r = Qv(n, r, 1), n = Ll(n, r, 1), r = Kn(), n !== null && (Hi(n, 1, r), ua(n, r));
  }
  function xn(n, r, l) {
    if (n.tag === 3) fh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        fh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var u = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (Fl === null || !Fl.has(u))) {
          n = No(l, n), n = Ad(r, n, 1), r = Ll(r, n, 1), n = Kn(), r !== null && (Hi(r, 1, n), ua(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function xy(n, r, l) {
    var u = n.pingCache;
    u !== null && u.delete(r), r = Kn(), n.pingedLanes |= n.suspendedLanes & l, tr === n && (yr & l) === l && (Pn === 4 || Pn === 3 && (yr & 130023424) === yr && 500 > Et() - Yd ? el(n, 0) : uf |= l), ua(n, r);
  }
  function dh(n, r) {
    r === 0 && (n.mode & 1 ? (r = ha, ha <<= 1, !(ha & 130023424) && (ha = 4194304)) : r = 1);
    var l = Kn();
    n = ga(n, r), n !== null && (Hi(n, r, l), ua(n, l));
  }
  function by(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), dh(n, l);
  }
  function ph(n, r) {
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
    u !== null && u.delete(r), dh(n, l);
  }
  var vh;
  vh = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Zn.current) Qn = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return Qn = !1, Ds(n, r, l);
      Qn = !!(n.flags & 131072);
    }
    else Qn = !1, Cn && r.flags & 1048576 && Uv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var u = r.type;
        Fa(n, r), n = r.pendingProps;
        var c = ea(r, Ln.current);
        kn(r, l), c = Ml(null, r, u, n, c, l);
        var d = ii();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, In(u) ? (d = !0, ir(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, _d(r), c.updater = Zc, r.stateNode = c, c._reactInternals = r, ws(r, u, n, l), r = _s(null, r, u, !0, d, l)) : (r.tag = 0, Cn && d && Dc(r), hr(null, r, c, l), r = r.child), r;
      case 16:
        u = r.elementType;
        e: {
          switch (Fa(n, r), n = r.pendingProps, c = u._init, u = c(u._payload), r.type = u, c = r.tag = Ty(u), n = li(u, n), c) {
            case 0:
              r = Gv(null, r, u, n, l);
              break e;
            case 1:
              r = Kv(null, r, u, n, l);
              break e;
            case 11:
              r = ia(null, r, u, n, l);
              break e;
            case 14:
              r = jo(null, r, u, li(u.type, n), l);
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
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : li(u, c), Gv(n, r, u, c, l);
      case 1:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : li(u, c), Kv(n, r, u, c, l);
      case 3:
        e: {
          if (Cu(r), n === null) throw Error(b(387));
          u = r.pendingProps, d = r.memoizedState, c = d.element, Hv(n, r), ds(r, u, null, l);
          var y = r.memoizedState;
          if (u = y.element, d.isDehydrated) if (d = { element: u, isDehydrated: !1, cache: y.cache, pendingSuspenseBoundaries: y.pendingSuspenseBoundaries, transitions: y.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = No(Error(b(423)), r), r = qv(n, r, u, l, c);
            break e;
          } else if (u !== c) {
            c = No(Error(b(424)), r), r = qv(n, r, u, l, c);
            break e;
          } else for (na = Ei(r.stateNode.containerInfo.firstChild), ta = r, Cn = !0, za = null, l = Me(r, null, u, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Ol(), u === c) {
              r = Pa(n, r, l);
              break e;
            }
            hr(n, r, u, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Bv(r), n === null && Ed(r), u = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, y = c.children, wc(u, c) ? y = null : d !== null && wc(u, d) && (r.flags |= 32), Ud(n, r), hr(n, r, y, l), r.child;
      case 6:
        return n === null && Ed(r), null;
      case 13:
        return rf(n, r, l);
      case 4:
        return Dd(r, r.stateNode.containerInfo), u = r.pendingProps, n === null ? r.child = zn(r, null, u, l) : hr(n, r, u, l), r.child;
      case 11:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : li(u, c), ia(n, r, u, c, l);
      case 7:
        return hr(n, r, r.pendingProps, l), r.child;
      case 8:
        return hr(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return hr(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (u = r.type._context, c = r.pendingProps, d = r.memoizedProps, y = c.value, et(ya, u._currentValue), u._currentValue = y, d !== null) if (ri(d.value, y)) {
            if (d.children === c.children && !Zn.current) {
              r = Pa(n, r, l);
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
                    var Y = d.updateQueue;
                    if (Y !== null) {
                      Y = Y.shared;
                      var me = Y.pending;
                      me === null ? k.next = k : (k.next = me.next, me.next = k), Y.pending = k;
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
          hr(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, u = r.pendingProps.children, kn(r, l), c = Ua(c), u = u(c), r.flags |= 1, hr(n, r, u, l), r.child;
      case 14:
        return u = r.type, c = li(u, r.pendingProps), c = li(u.type, c), jo(n, r, u, c, l);
      case 15:
        return xt(n, r, r.type, r.pendingProps, l);
      case 17:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : li(u, c), Fa(n, r), r.tag = 1, In(u) ? (n = !0, ir(r)) : n = !1, kn(r, l), ef(r, u, c), ws(r, u, c, l), _s(null, r, u, !0, n, l);
      case 19:
        return _i(n, r, l);
      case 22:
        return Rs(n, r, l);
    }
    throw Error(b(156, r.tag));
  };
  function hh(n, r) {
    return yn(n, r);
  }
  function wy(n, r, l, u) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Va(n, r, l, u) {
    return new wy(n, r, l, u);
  }
  function qd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Ty(n) {
    if (typeof n == "function") return qd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Je) return 11;
      if (n === tt) return 14;
    }
    return 2;
  }
  function Hl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Va(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Vs(n, r, l, u, c, d) {
    var y = 2;
    if (u = n, typeof n == "function") qd(n) && (y = 1);
    else if (typeof n == "string") y = 5;
    else e: switch (n) {
      case A:
        return tl(l.children, c, d, r);
      case pe:
        y = 8, c |= 8;
        break;
      case ue:
        return n = Va(12, l, r, c | 2), n.elementType = ue, n.lanes = d, n;
      case re:
        return n = Va(13, l, r, c), n.elementType = re, n.lanes = d, n;
      case ze:
        return n = Va(19, l, r, c), n.elementType = ze, n.lanes = d, n;
      case Oe:
        return Vl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case be:
            y = 10;
            break e;
          case De:
            y = 9;
            break e;
          case Je:
            y = 11;
            break e;
          case tt:
            y = 14;
            break e;
          case dt:
            y = 16, u = null;
            break e;
        }
        throw Error(b(130, n == null ? n : typeof n, ""));
    }
    return r = Va(y, l, r, c), r.elementType = n, r.type = u, r.lanes = d, r;
  }
  function tl(n, r, l, u) {
    return n = Va(7, n, u, r), n.lanes = l, n;
  }
  function Vl(n, r, l, u) {
    return n = Va(22, n, u, r), n.elementType = Oe, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Xd(n, r, l) {
    return n = Va(6, n, null, r), n.lanes = l, n;
  }
  function df(n, r, l) {
    return r = Va(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function mh(n, r, l, u, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = eu(0), this.expirationTimes = eu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = eu(0), this.identifierPrefix = u, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function pf(n, r, l, u, c, d, y, w, k) {
    return n = new mh(n, r, l, w, k), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = Va(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: u, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, _d(d), n;
  }
  function Ry(n, r, l) {
    var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: se, key: u == null ? null : "" + u, children: n, containerInfo: r, implementation: l };
  }
  function Jd(n) {
    if (!n) return kr;
    n = n._reactInternals;
    e: {
      if (St(n) !== n || n.tag !== 1) throw Error(b(170));
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
  function yh(n, r, l, u, c, d, y, w, k) {
    return n = pf(l, u, !0, n, c, d, y, w, k), n.context = Jd(null), l = n.current, u = Kn(), c = ji(l), d = qi(u, c), d.callback = r ?? null, Ll(l, d, c), n.current.lanes = c, Hi(n, c, u), ua(n, u), n;
  }
  function vf(n, r, l, u) {
    var c = r.current, d = Kn(), y = ji(c);
    return l = Jd(l), r.context === null ? r.context = l : r.pendingContext = l, r = qi(d, y), r.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (r.callback = u), n = Ll(c, r, y), n !== null && (Vr(n, c, y, d), Lc(n, c, y)), y;
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
  function gh() {
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
      var r = pt();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < Jn.length && r !== 0 && r < Jn[l].priority; l++) ;
      Jn.splice(l, 0, n), l === 0 && qu(n);
    }
  };
  function tp(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function gf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function Sh() {
  }
  function _y(n, r, l, u, c) {
    if (c) {
      if (typeof u == "function") {
        var d = u;
        u = function() {
          var Y = hf(y);
          d.call(Y);
        };
      }
      var y = yh(r, u, n, 0, null, !1, !1, "", Sh);
      return n._reactRootContainer = y, n[Qi] = y.current, fu(n.nodeType === 8 ? n.parentNode : n), Ao(), y;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof u == "function") {
      var w = u;
      u = function() {
        var Y = hf(k);
        w.call(Y);
      };
    }
    var k = pf(n, 0, !1, null, null, !1, !1, "", Sh);
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
    } else y = _y(l, r, n, c, u);
    return hf(y);
  }
  Pt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Za(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), ua(r, Et()), !(zt & 6) && (Tu = Et() + 500, bi()));
        }
        break;
      case 13:
        Ao(function() {
          var u = ga(n, 1);
          if (u !== null) {
            var c = Kn();
            Vr(u, n, 1, c);
          }
        }), mf(n, 1);
    }
  }, Gu = function(n) {
    if (n.tag === 13) {
      var r = ga(n, 134217728);
      if (r !== null) {
        var l = Kn();
        Vr(r, n, 134217728, l);
      }
      mf(n, 134217728);
    }
  }, hi = function(n) {
    if (n.tag === 13) {
      var r = ji(n), l = ga(n, r);
      if (l !== null) {
        var u = Kn();
        Vr(l, n, r, u);
      }
      mf(n, r);
    }
  }, pt = function() {
    return It;
  }, nu = function(n, r) {
    var l = It;
    try {
      return It = n, r();
    } finally {
      It = l;
    }
  }, en = function(n, r, l) {
    switch (r) {
      case "input":
        if (Rr(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var u = l[r];
            if (u !== n && u.form === n.form) {
              var c = _n(u);
              if (!c) throw Error(b(90));
              cr(u), Rr(u, c);
            }
          }
        }
        break;
      case "textarea":
        wn(n, l);
        break;
      case "select":
        r = l.value, r != null && G(n, !!l.multiple, r, !1);
    }
  }, no = Wd, vl = Ao;
  var ky = { usingClientEntryPoint: !1, Events: [nt, ai, _n, Pi, to, Wd] }, Is = { findFiberByHostInstance: yo, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Eh = { bundleType: Is.bundleType, version: Is.version, rendererPackageName: Is.rendererPackageName, rendererConfig: Is.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Se.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = An(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Is.findFiberByHostInstance || gh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Bl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Bl.isDisabled && Bl.supportsFiber) try {
      yl = Bl.inject(Eh), Xr = Bl;
    } catch {
    }
  }
  return Wa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ky, Wa.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!tp(r)) throw Error(b(200));
    return Ry(n, r, null, l);
  }, Wa.createRoot = function(n, r) {
    if (!tp(n)) throw Error(b(299));
    var l = !1, u = "", c = Uo;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (u = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = pf(n, 1, !1, null, null, l, !1, u, c), n[Qi] = r.current, fu(n.nodeType === 8 ? n.parentNode : n), new ep(r);
  }, Wa.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(b(188)) : (n = Object.keys(n).join(","), Error(b(268, n)));
    return n = An(r), n = n === null ? null : n.stateNode, n;
  }, Wa.flushSync = function(n) {
    return Ao(n);
  }, Wa.hydrate = function(n, r, l) {
    if (!gf(r)) throw Error(b(200));
    return Bs(null, n, r, !0, l);
  }, Wa.hydrateRoot = function(n, r, l) {
    if (!tp(n)) throw Error(b(405));
    var u = l != null && l.hydratedSources || null, c = !1, d = "", y = Uo;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (y = l.onRecoverableError)), r = yh(r, null, n, 1, l ?? null, c, !1, d, y), n[Qi] = r.current, fu(n), u) for (n = 0; n < u.length; n++) l = u[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new yf(r);
  }, Wa.render = function(n, r, l) {
    if (!gf(r)) throw Error(b(200));
    return Bs(null, n, r, !1, l);
  }, Wa.unmountComponentAtNode = function(n) {
    if (!gf(n)) throw Error(b(40));
    return n._reactRootContainer ? (Ao(function() {
      Bs(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Wa.unstable_batchedUpdates = Wd, Wa.unstable_renderSubtreeIntoContainer = function(n, r, l, u) {
    if (!gf(l)) throw Error(b(200));
    if (n == null || n._reactInternals === void 0) throw Error(b(38));
    return Bs(n, r, l, !1, u);
  }, Wa.version = "18.3.1-next-f1338f8080-20240426", Wa;
}
var Ga = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var m0;
function TD() {
  return m0 || (m0 = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var x = F, E = C0(), b = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, q = !1;
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
    var L = 0, z = 1, ge = 2, P = 3, W = 4, te = 5, ne = 6, X = 7, fe = 8, je = 9, oe = 10, Ee = 11, Se = 12, le = 13, se = 14, A = 15, pe = 16, ue = 17, be = 18, De = 19, Je = 21, re = 22, ze = 23, tt = 24, dt = 25, Oe = !0, he = !1, He = !1, Re = !1, T = !1, M = !0, Ne = !0, Ie = !0, bt = !0, gt = /* @__PURE__ */ new Set(), vt = {}, Ct = {};
    function wt(e, t) {
      Bt(e, t), Bt(e + "Capture", t);
    }
    function Bt(e, t) {
      vt[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), vt[e] = t;
      {
        var a = e.toLowerCase();
        Ct[a] = e, e === "onDoubleClick" && (Ct.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        gt.add(t[i]);
    }
    var jn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", cr = Object.prototype.hasOwnProperty;
    function bn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function Xn(e) {
      try {
        return Mn(e), !1;
      } catch {
        return !0;
      }
    }
    function Mn(e) {
      return "" + e;
    }
    function En(e, t) {
      if (Xn(e))
        return g("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, bn(e)), Mn(e);
    }
    function Rr(e) {
      if (Xn(e))
        return g("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", bn(e)), Mn(e);
    }
    function _a(e, t) {
      if (Xn(e))
        return g("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, bn(e)), Mn(e);
    }
    function Or(e, t) {
      if (Xn(e))
        return g("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, bn(e)), Mn(e);
    }
    function Ge(e) {
      if (Xn(e))
        return g("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", bn(e)), Mn(e);
    }
    function G(e) {
      if (Xn(e))
        return g("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", bn(e)), Mn(e);
    }
    var Xe = 0, Lt = 1, wn = 2, Jt = 3, vn = 4, On = 5, rr = 6, hn = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", Te = hn + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", qe = new RegExp("^[" + hn + "][" + Te + "]*$"), Rt = {}, Kt = {};
    function sn(e) {
      return cr.call(Kt, e) ? !0 : cr.call(Rt, e) ? !1 : qe.test(e) ? (Kt[e] = !0, !0) : (Rt[e] = !0, g("Invalid attribute name: `%s`", e), !1);
    }
    function Tn(e, t, a) {
      return t !== null ? t.type === Xe : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function mn(e, t, a, i) {
      if (a !== null && a.type === Xe)
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
    function ar(e, t, a, i) {
      if (t === null || typeof t > "u" || mn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Jt:
            return !t;
          case vn:
            return t === !1;
          case On:
            return isNaN(t);
          case rr:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function cn(e) {
      return en.hasOwnProperty(e) ? en[e] : null;
    }
    function Zt(e, t, a, i, o, s, f) {
      this.acceptsBooleans = t === wn || t === Jt || t === vn, this.attributeName = i, this.attributeNamespace = o, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var en = {}, va = [
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
    va.forEach(function(e) {
      en[e] = new Zt(
        e,
        Xe,
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
      en[t] = new Zt(
        t,
        Lt,
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
      en[e] = new Zt(
        e,
        wn,
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
      en[e] = new Zt(
        e,
        wn,
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
      en[e] = new Zt(
        e,
        Jt,
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
      en[e] = new Zt(
        e,
        Jt,
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
      en[e] = new Zt(
        e,
        vn,
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
      en[e] = new Zt(
        e,
        rr,
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
      en[e] = new Zt(
        e,
        On,
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
    var _r = /[\-\:]([a-z])/g, ka = function(e) {
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
      var t = e.replace(_r, ka);
      en[t] = new Zt(
        t,
        Lt,
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
      var t = e.replace(_r, ka);
      en[t] = new Zt(
        t,
        Lt,
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
      var t = e.replace(_r, ka);
      en[t] = new Zt(
        t,
        Lt,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      en[e] = new Zt(
        e,
        Lt,
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
    var Pi = "xlinkHref";
    en[Pi] = new Zt(
      "xlinkHref",
      Lt,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      en[e] = new Zt(
        e,
        Lt,
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
        En(a, t), i.sanitizeURL && vl("" + a);
        var s = i.attributeName, f = null;
        if (i.type === vn) {
          if (e.hasAttribute(s)) {
            var v = e.getAttribute(s);
            return v === "" ? !0 : ar(t, a, i, !1) ? v : v === "" + a ? a : v;
          }
        } else if (e.hasAttribute(s)) {
          if (ar(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === Jt)
            return a;
          f = e.getAttribute(s);
        }
        return ar(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function ro(e, t, a, i) {
      {
        if (!sn(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var o = e.getAttribute(t);
        return En(a, t), o === "" + a ? a : o;
      }
    }
    function Lr(e, t, a, i) {
      var o = cn(t);
      if (!Tn(t, o, i)) {
        if (ar(t, a, o, i) && (a = null), i || o === null) {
          if (sn(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (En(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = o.mustUseProperty;
        if (f) {
          var v = o.propertyName;
          if (a === null) {
            var h = o.type;
            e[v] = h === Jt ? !1 : "";
          } else
            e[v] = a;
          return;
        }
        var S = o.attributeName, C = o.attributeNamespace;
        if (a === null)
          e.removeAttribute(S);
        else {
          var O = o.type, N;
          O === Jt || O === vn && a === !0 ? N = "" : (En(a, S), N = "" + a, o.sanitizeURL && vl(N.toString())), C ? e.setAttributeNS(C, S, N) : e.setAttribute(S, N);
        }
      }
    }
    var Mr = Symbol.for("react.element"), fr = Symbol.for("react.portal"), di = Symbol.for("react.fragment"), Ka = Symbol.for("react.strict_mode"), pi = Symbol.for("react.profiler"), vi = Symbol.for("react.provider"), _ = Symbol.for("react.context"), ce = Symbol.for("react.forward_ref"), Le = Symbol.for("react.suspense"), $e = Symbol.for("react.suspense_list"), St = Symbol.for("react.memo"), ht = Symbol.for("react.lazy"), Nt = Symbol.for("react.scope"), kt = Symbol.for("react.debug_trace_mode"), An = Symbol.for("react.offscreen"), fn = Symbol.for("react.legacy_hidden"), yn = Symbol.for("react.cache"), dr = Symbol.for("react.tracing_marker"), qa = Symbol.iterator, Xa = "@@iterator";
    function Et(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = qa && e[qa] || e[Xa];
      return typeof t == "function" ? t : null;
    }
    var Tt = Object.assign, Ja = 0, ao, io, ml, qo, yl, Xr, Wu;
    function Ar() {
    }
    Ar.__reactDisabledLog = !0;
    function sc() {
      {
        if (Ja === 0) {
          ao = console.log, io = console.info, ml = console.warn, qo = console.error, yl = console.group, Xr = console.groupCollapsed, Wu = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Ar,
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
        Ja++;
      }
    }
    function cc() {
      {
        if (Ja--, Ja === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Tt({}, e, {
              value: ao
            }),
            info: Tt({}, e, {
              value: io
            }),
            warn: Tt({}, e, {
              value: ml
            }),
            error: Tt({}, e, {
              value: qo
            }),
            group: Tt({}, e, {
              value: yl
            }),
            groupCollapsed: Tt({}, e, {
              value: Xr
            }),
            groupEnd: Tt({}, e, {
              value: Wu
            })
          });
        }
        Ja < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Xo = b.ReactCurrentDispatcher, gl;
    function ha(e, t, a) {
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
    var Za = !1, ei;
    {
      var Jo = typeof WeakMap == "function" ? WeakMap : Map;
      ei = new Jo();
    }
    function lo(e, t) {
      if (!e || Za)
        return "";
      {
        var a = ei.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      Za = !0;
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
            } catch (Q) {
              i = Q;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (Q) {
              i = Q;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Q) {
            i = Q;
          }
          e();
        }
      } catch (Q) {
        if (Q && i && typeof Q.stack == "string") {
          for (var v = Q.stack.split(`
`), h = i.stack.split(`
`), S = v.length - 1, C = h.length - 1; S >= 1 && C >= 0 && v[S] !== h[C]; )
            C--;
          for (; S >= 1 && C >= 0; S--, C--)
            if (v[S] !== h[C]) {
              if (S !== 1 || C !== 1)
                do
                  if (S--, C--, C < 0 || v[S] !== h[C]) {
                    var O = `
` + v[S].replace(" at new ", " at ");
                    return e.displayName && O.includes("<anonymous>") && (O = O.replace("<anonymous>", e.displayName)), typeof e == "function" && ei.set(e, O), O;
                  }
                while (S >= 1 && C >= 0);
              break;
            }
        }
      } finally {
        Za = !1, Xo.current = s, cc(), Error.prepareStackTrace = o;
      }
      var N = e ? e.displayName || e.name : "", I = N ? ha(N) : "";
      return typeof e == "function" && ei.set(e, I), I;
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
        return ha(e);
      switch (e) {
        case Le:
          return ha("Suspense");
        case $e:
          return ha("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ce:
            return Zo(e.render);
          case St:
            return Hi(e.type, t, a);
          case ht: {
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
          return ha(e.type);
        case pe:
          return ha("Lazy");
        case le:
          return ha("Suspense");
        case De:
          return ha("SuspenseList");
        case L:
        case ge:
        case A:
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
    function It(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var o = t.displayName || t.name || "";
      return o !== "" ? a + "(" + o + ")" : a;
    }
    function tu(e) {
      return e.displayName || "Context";
    }
    function Pt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && g("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case di:
          return "Fragment";
        case fr:
          return "Portal";
        case pi:
          return "Profiler";
        case Ka:
          return "StrictMode";
        case Le:
          return "Suspense";
        case $e:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case _:
            var t = e;
            return tu(t) + ".Consumer";
          case vi:
            var a = e;
            return tu(a._context) + ".Provider";
          case ce:
            return It(e, e.render, "ForwardRef");
          case St:
            var i = e.displayName || null;
            return i !== null ? i : Pt(e.type) || "Memo";
          case ht: {
            var o = e, s = o._payload, f = o._init;
            try {
              return Pt(f(s));
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
    function hi(e) {
      return e.displayName || "Context";
    }
    function pt(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case tt:
          return "Cache";
        case je:
          var i = a;
          return hi(i) + ".Consumer";
        case oe:
          var o = a;
          return hi(o._context) + ".Provider";
        case be:
          return "DehydratedFragment";
        case Ee:
          return Gu(a, a.render, "ForwardRef");
        case X:
          return "Fragment";
        case te:
          return a;
        case W:
          return "Portal";
        case P:
          return "Root";
        case ne:
          return "Text";
        case pe:
          return Pt(a);
        case fe:
          return a === Ka ? "StrictMode" : "Mode";
        case re:
          return "Offscreen";
        case Se:
          return "Profiler";
        case Je:
          return "Scope";
        case le:
          return "Suspense";
        case De:
          return "SuspenseList";
        case dt:
          return "TracingMarker";
        case z:
        case L:
        case ue:
        case ge:
        case se:
        case A:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var nu = b.ReactDebugCurrentFrame, pr = null, mi = !1;
    function zr() {
      {
        if (pr === null)
          return null;
        var e = pr._debugOwner;
        if (e !== null && typeof e < "u")
          return pt(e);
      }
      return null;
    }
    function yi() {
      return pr === null ? "" : Vi(pr);
    }
    function gn() {
      nu.getCurrentStack = null, pr = null, mi = !1;
    }
    function tn(e) {
      nu.getCurrentStack = e === null ? null : yi, pr = e, mi = !1;
    }
    function El() {
      return pr;
    }
    function Jn(e) {
      mi = e;
    }
    function Ur(e) {
      return "" + e;
    }
    function Da(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return G(e), e;
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
    function Na(e) {
      var t = qu(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      G(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var o = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return o.call(this);
          },
          set: function(v) {
            G(v), i = "" + v, s.call(this, v);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(v) {
            G(v), i = "" + v;
          },
          stopTracking: function() {
            uo(e), delete e[t];
          }
        };
        return f;
      }
    }
    function ti(e) {
      Cl(e) || (e._valueTracker = Na(e));
    }
    function gi(e) {
      if (!e)
        return !1;
      var t = Cl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Xf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function ja(e) {
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
      var a = e, i = t.checked, o = Tt({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return o;
    }
    function ni(e, t) {
      Ku("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !au && (g("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", zr() || "A component", t.type), au = !0), t.value !== void 0 && t.defaultValue !== void 0 && !ru && (g("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", zr() || "A component", t.type), ru = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: Da(t.value != null ? t.value : i),
        controlled: iu(t)
      };
    }
    function m(e, t) {
      var a = e, i = t.checked;
      i != null && Lr(a, "checked", i, !1);
    }
    function R(e, t) {
      var a = e;
      {
        var i = iu(t);
        !a._wrapperState.controlled && i && !so && (g("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), so = !0), a._wrapperState.controlled && !i && !xl && (g("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), xl = !0);
      }
      m(e, t);
      var o = Da(t.value), s = t.type;
      if (o != null)
        s === "number" ? (o === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != o) && (a.value = Ur(o)) : a.value !== Ur(o) && (a.value = Ur(o));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? at(a, t.type, o) : t.hasOwnProperty("defaultValue") && at(a, t.type, Da(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function $(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var o = t.type, s = o === "submit" || o === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Ur(i._wrapperState.initialValue);
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
        En(a, "name");
        for (var o = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < o.length; s++) {
          var f = o[s];
          if (!(f === e || f.form !== e.form)) {
            var v = Fh(f);
            if (!v)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            gi(f), R(f, v);
          }
        }
      }
    }
    function at(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || ja(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Ur(e._wrapperState.initialValue) : e.defaultValue !== Ur(a) && (e.defaultValue = Ur(a)));
    }
    var ke = !1, ot = !1, jt = !1;
    function Ht(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? x.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || ot || (ot = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (jt || (jt = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !ke && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), ke = !0);
    }
    function dn(e, t) {
      t.value != null && e.setAttribute("value", Ur(Da(t.value)));
    }
    var nn = Array.isArray;
    function _t(e) {
      return nn(e);
    }
    var rn;
    rn = !1;
    function Rn() {
      var e = zr();
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
            var i = _t(e[a]);
            e.multiple && !i ? g("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, Rn()) : !e.multiple && i && g("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, Rn());
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
        for (var C = Ur(Da(a)), O = null, N = 0; N < o.length; N++) {
          if (o[N].value === C) {
            o[N].selected = !0, i && (o[N].defaultSelected = !0);
            return;
          }
          O === null && !o[N].disabled && (O = o[N]);
        }
        O !== null && (O.selected = !0);
      }
    }
    function Ju(e, t) {
      return Tt({}, t, {
        value: void 0
      });
    }
    function co(e, t) {
      var a = e;
      Xu(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !rn && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), rn = !0);
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
    var ov = !1;
    function ed(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = Tt({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Ur(a._wrapperState.initialValue)
      });
      return i;
    }
    function td(e, t) {
      var a = e;
      Ku("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !ov && (g("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", zr() || "A component"), ov = !0);
      var i = t.value;
      if (i == null) {
        var o = t.children, s = t.defaultValue;
        if (o != null) {
          g("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (_t(o)) {
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
        initialValue: Da(i)
      };
    }
    function uv(e, t) {
      var a = e, i = Da(t.value), o = Da(t.defaultValue);
      if (i != null) {
        var s = Ur(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      o != null && (a.defaultValue = Ur(o));
    }
    function sv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ry(e, t) {
      uv(e, t);
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
    var cv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, o) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, o);
        });
      } : e;
    }, dc, fv = cv(function(e, t) {
      if (e.namespaceURI === rd && !("innerHTML" in e)) {
        dc = dc || document.createElement("div"), dc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = dc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Jr = 1, $i = 3, Bn = 8, Yi = 9, ld = 11, ou = function(e, t) {
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
    function dv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var pv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(es).forEach(function(e) {
      pv.forEach(function(t) {
        es[dv(t, e)] = es[e];
      });
    });
    function pc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(es.hasOwnProperty(e) && es[e]) ? t + "px" : (Or(t, e), ("" + t).trim());
    }
    var vv = /([A-Z])/g, hv = /^ms-/;
    function uu(e) {
      return e.replace(vv, "-$1").toLowerCase().replace(hv, "-ms-");
    }
    var mv = function() {
    };
    {
      var ay = /^(?:webkit|moz|o)[A-Z]/, iy = /^-ms-/, yv = /-(.)/g, od = /;\s*$/, Si = {}, fo = {}, gv = !1, ts = !1, ly = function(e) {
        return e.replace(yv, function(t, a) {
          return a.toUpperCase();
        });
      }, Sv = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          ly(e.replace(iy, "ms-"))
        ));
      }, ud = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, sd = function(e, t) {
        fo.hasOwnProperty(t) && fo[t] || (fo[t] = !0, g(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(od, "")));
      }, Ev = function(e, t) {
        gv || (gv = !0, g("`NaN` is an invalid value for the `%s` css style property.", e));
      }, Cv = function(e, t) {
        ts || (ts = !0, g("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      mv = function(e, t) {
        e.indexOf("-") > -1 ? Sv(e) : ay.test(e) ? ud(e) : od.test(t) && sd(e, t), typeof t == "number" && (isNaN(t) ? Ev(e, t) : isFinite(t) || Cv(e, t));
      };
    }
    var xv = mv;
    function oy(e) {
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
    function bv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var o = i.indexOf("--") === 0;
          o || xv(i, t[i]);
          var s = pc(i, t[i], o);
          i === "float" && (i = "cssFloat"), o ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function uy(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function wv(e) {
      var t = {};
      for (var a in e)
        for (var i = Zu[a] || [a], o = 0; o < i.length; o++)
          t[i[o]] = a;
      return t;
    }
    function sy(e, t) {
      {
        if (!t)
          return;
        var a = wv(e), i = wv(t), o = {};
        for (var s in a) {
          var f = a[s], v = i[s];
          if (v && f !== v) {
            var h = f + "," + v;
            if (o[h])
              continue;
            o[h] = !0, g("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", uy(e[f]) ? "Removing" : "Updating", f, v);
          }
        }
      }
    }
    var ri = {
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
    }, ns = Tt({
      menuitem: !0
    }, ri), Tv = "__html";
    function vc(e, t) {
      if (t) {
        if (ns[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Tv in t.dangerouslySetInnerHTML))
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
    }, su = {}, cy = new RegExp("^(aria)-[" + Te + "]*$"), cu = new RegExp("^(aria)[A-Z][" + Te + "]*$");
    function cd(e, t) {
      {
        if (cr.call(su, t) && su[t])
          return !0;
        if (cu.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = hc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return g("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), su[t] = !0, !0;
          if (t !== i)
            return g("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), su[t] = !0, !0;
        }
        if (cy.test(t)) {
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
      var vr = {}, pd = /^on./, yc = /^on[^A-Z]/, Rv = new RegExp("^(aria)-[" + Te + "]*$"), _v = new RegExp("^(aria)[A-Z][" + Te + "]*$");
      po = function(e, t, a, i) {
        if (cr.call(vr, t) && vr[t])
          return !0;
        var o = t.toLowerCase();
        if (o === "onfocusin" || o === "onfocusout")
          return g("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), vr[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var v = f.hasOwnProperty(o) ? f[o] : null;
          if (v != null)
            return g("Invalid event handler property `%s`. Did you mean `%s`?", t, v), vr[t] = !0, !0;
          if (pd.test(t))
            return g("Unknown event handler property `%s`. It will be ignored.", t), vr[t] = !0, !0;
        } else if (pd.test(t))
          return yc.test(t) && g("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), vr[t] = !0, !0;
        if (Rv.test(t) || _v.test(t))
          return !0;
        if (o === "innerhtml")
          return g("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), vr[t] = !0, !0;
        if (o === "aria")
          return g("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), vr[t] = !0, !0;
        if (o === "is" && a !== null && a !== void 0 && typeof a != "string")
          return g("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), vr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return g("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), vr[t] = !0, !0;
        var h = cn(t), S = h !== null && h.type === Xe;
        if (rs.hasOwnProperty(o)) {
          var C = rs[o];
          if (C !== t)
            return g("Invalid DOM property `%s`. Did you mean `%s`?", t, C), vr[t] = !0, !0;
        } else if (!S && t !== o)
          return g("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, o), vr[t] = !0, !0;
        return typeof a == "boolean" && mn(t, a, h, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), vr[t] = !0, !0) : S ? !0 : mn(t, a, h, !1) ? (vr[t] = !0, !1) : ((a === "false" || a === "true") && h !== null && h.type === Jt && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), vr[t] = !0), !0);
      };
    }
    var kv = function(e, t, a) {
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
    function Dv(e, t, a) {
      wl(e, t) || kv(e, t, a);
    }
    var vd = 1, gc = 2, Oa = 4, hd = vd | gc | Oa, vo = null;
    function fy(e) {
      vo !== null && g("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), vo = e;
    }
    function dy() {
      vo === null && g("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), vo = null;
    }
    function is(e) {
      return e === vo;
    }
    function md(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === $i ? t.parentNode : t;
    }
    var Sc = null, ho = null, qt = null;
    function Ec(e) {
      var t = ju(e);
      if (t) {
        if (typeof Sc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Fh(a);
          Sc(t.stateNode, t.type, i);
        }
      }
    }
    function Cc(e) {
      Sc = e;
    }
    function fu(e) {
      ho ? qt ? qt.push(e) : qt = [e] : ho = e;
    }
    function Nv() {
      return ho !== null || qt !== null;
    }
    function xc() {
      if (ho) {
        var e = ho, t = qt;
        if (ho = null, qt = null, Ec(e), t)
          for (var a = 0; a < t.length; a++)
            Ec(t[a]);
      }
    }
    var du = function(e, t) {
      return e(t);
    }, ls = function() {
    }, Tl = !1;
    function jv() {
      var e = Nv();
      e && (ls(), xc());
    }
    function Ov(e, t, a) {
      if (Tl)
        return e(t, a);
      Tl = !0;
      try {
        return du(e, t, a);
      } finally {
        Tl = !1, jv();
      }
    }
    function py(e, t, a) {
      du = e, ls = a;
    }
    function Lv(e) {
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
          return !!(a.disabled && Lv(t));
        default:
          return !1;
      }
    }
    function Rl(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Fh(a);
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
    if (jn)
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
      } catch (C) {
        this.onError(C);
      }
    }
    var Tc = wc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var yd = document.createElement("react");
      Tc = function(t, a, i, o, s, f, v, h, S) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var C = document.createEvent("Event"), O = !1, N = !0, I = window.event, Q = Object.getOwnPropertyDescriptor(window, "event");
        function J() {
          yd.removeEventListener(Z, it, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = I);
        }
        var Ae = Array.prototype.slice.call(arguments, 3);
        function it() {
          O = !0, J(), a.apply(i, Ae), N = !1;
        }
        var Ze, Ft = !1, Ot = !1;
        function H(V) {
          if (Ze = V.error, Ft = !0, Ze === null && V.colno === 0 && V.lineno === 0 && (Ot = !0), V.defaultPrevented && Ze != null && typeof Ze == "object")
            try {
              Ze._suppressLogging = !0;
            } catch {
            }
        }
        var Z = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", H), yd.addEventListener(Z, it, !1), C.initEvent(Z, !1, !1), yd.dispatchEvent(C), Q && Object.defineProperty(window, "event", Q), O && N && (Ft ? Ot && (Ze = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Ze = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Ze)), window.removeEventListener("error", H), !O)
          return J(), wc.apply(this, arguments);
      };
    }
    var Mv = Tc, pu = !1, Rc = null, vu = !1, Ei = null, Av = {
      onError: function(e) {
        pu = !0, Rc = e;
      }
    };
    function _l(e, t, a, i, o, s, f, v, h) {
      pu = !1, Rc = null, Mv.apply(Av, arguments);
    }
    function Ci(e, t, a, i, o, s, f, v, h) {
      if (_l.apply(this, arguments), pu) {
        var S = ss();
        vu || (vu = !0, Ei = S);
      }
    }
    function us() {
      if (vu) {
        var e = Ei;
        throw vu = !1, Ei = null, e;
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
    function vy(e) {
      return e._reactInternals !== void 0;
    }
    function yo(e, t) {
      e._reactInternals = t;
    }
    var nt = (
      /*                      */
      0
    ), ai = (
      /*                */
      1
    ), _n = (
      /*                    */
      2
    ), At = (
      /*                       */
      4
    ), La = (
      /*                */
      16
    ), Ma = (
      /*                 */
      32
    ), pn = (
      /*                     */
      64
    ), et = (
      /*                   */
      128
    ), kr = (
      /*            */
      256
    ), Ln = (
      /*                          */
      512
    ), Zn = (
      /*                     */
      1024
    ), Zr = (
      /*                      */
      2048
    ), ea = (
      /*                    */
      4096
    ), In = (
      /*                   */
      8192
    ), mu = (
      /*             */
      16384
    ), zv = (
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
    ), xi = (
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
    ), bi = (
      /*              */
      33554432
    ), Dl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      At | Zn | 0
    ), Nl = _n | At | La | Ma | Ln | ea | In, jl = At | pn | Ln | In, Gi = Zr | La, $n = Wi | kc | yu, Aa = b.ReactCurrentOwner;
    function ma(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (_n | ea)) !== nt && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === P ? a : null;
    }
    function wi(e) {
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
    function Ti(e) {
      return e.tag === P ? e.stateNode.containerInfo : null;
    }
    function go(e) {
      return ma(e) === e;
    }
    function Uv(e) {
      {
        var t = Aa.current;
        if (t !== null && t.tag === z) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", pt(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var o = hu(e);
      return o ? ma(o) === o : !1;
    }
    function Dc(e) {
      if (ma(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function Nc(e) {
      var t = e.alternate;
      if (!t) {
        var a = ma(e);
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
          for (var S = !1, C = s.child; C; ) {
            if (C === i) {
              S = !0, i = s, o = f;
              break;
            }
            if (C === o) {
              S = !0, o = s, i = f;
              break;
            }
            C = C.sibling;
          }
          if (!S) {
            for (C = f.child; C; ) {
              if (C === i) {
                S = !0, i = f, o = s;
                break;
              }
              if (C === o) {
                S = !0, o = f, i = s;
                break;
              }
              C = C.sibling;
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
    function ta(e) {
      var t = Nc(e);
      return t !== null ? na(t) : null;
    }
    function na(e) {
      if (e.tag === te || e.tag === ne)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = na(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function Cn(e) {
      var t = Nc(e);
      return t !== null ? za(t) : null;
    }
    function za(e) {
      if (e.tag === te || e.tag === ne)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== W) {
          var a = za(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var gd = E.unstable_scheduleCallback, Fv = E.unstable_cancelCallback, Sd = E.unstable_shouldYield, Ed = E.unstable_requestPaint, er = E.unstable_now, jc = E.unstable_getCurrentPriorityLevel, fs = E.unstable_ImmediatePriority, Ol = E.unstable_UserBlockingPriority, Ki = E.unstable_NormalPriority, hy = E.unstable_LowPriority, So = E.unstable_IdlePriority, Oc = E.unstable_yieldValue, Pv = E.unstable_setDisableYieldValue, Eo = null, zn = null, Me = null, ya = !1, ra = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function gu(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Ne && (e = Tt({}, e, {
          getLaneLabelMap: Co,
          injectProfilingHooks: Ua
        })), Eo = t.inject(e), zn = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Cd(e, t) {
      if (zn && typeof zn.onScheduleFiberRoot == "function")
        try {
          zn.onScheduleFiberRoot(Eo, e, t);
        } catch (a) {
          ya || (ya = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function xd(e, t) {
      if (zn && typeof zn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & et) === et;
          if (Ie) {
            var i;
            switch (t) {
              case Fr:
                i = fs;
                break;
              case _i:
                i = Ol;
                break;
              case Fa:
                i = Ki;
                break;
              case Pa:
                i = So;
                break;
              default:
                i = Ki;
                break;
            }
            zn.onCommitFiberRoot(Eo, e, i, a);
          }
        } catch (o) {
          ya || (ya = !0, g("React instrumentation encountered an error: %s", o));
        }
    }
    function bd(e) {
      if (zn && typeof zn.onPostCommitFiberRoot == "function")
        try {
          zn.onPostCommitFiberRoot(Eo, e);
        } catch (t) {
          ya || (ya = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function wd(e) {
      if (zn && typeof zn.onCommitFiberUnmount == "function")
        try {
          zn.onCommitFiberUnmount(Eo, e);
        } catch (t) {
          ya || (ya = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function kn(e) {
      if (typeof Oc == "function" && (Pv(e), ee(e)), zn && typeof zn.setStrictMode == "function")
        try {
          zn.setStrictMode(Eo, e);
        } catch (t) {
          ya || (ya = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Ua(e) {
      Me = e;
    }
    function Co() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < wo; a++) {
          var i = Iv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Td(e) {
      Me !== null && typeof Me.markCommitStarted == "function" && Me.markCommitStarted(e);
    }
    function Rd() {
      Me !== null && typeof Me.markCommitStopped == "function" && Me.markCommitStopped();
    }
    function ga(e) {
      Me !== null && typeof Me.markComponentRenderStarted == "function" && Me.markComponentRenderStarted(e);
    }
    function Sa() {
      Me !== null && typeof Me.markComponentRenderStopped == "function" && Me.markComponentRenderStopped();
    }
    function _d(e) {
      Me !== null && typeof Me.markComponentPassiveEffectMountStarted == "function" && Me.markComponentPassiveEffectMountStarted(e);
    }
    function Hv() {
      Me !== null && typeof Me.markComponentPassiveEffectMountStopped == "function" && Me.markComponentPassiveEffectMountStopped();
    }
    function qi(e) {
      Me !== null && typeof Me.markComponentPassiveEffectUnmountStarted == "function" && Me.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ll() {
      Me !== null && typeof Me.markComponentPassiveEffectUnmountStopped == "function" && Me.markComponentPassiveEffectUnmountStopped();
    }
    function Lc(e) {
      Me !== null && typeof Me.markComponentLayoutEffectMountStarted == "function" && Me.markComponentLayoutEffectMountStarted(e);
    }
    function Vv() {
      Me !== null && typeof Me.markComponentLayoutEffectMountStopped == "function" && Me.markComponentLayoutEffectMountStopped();
    }
    function ds(e) {
      Me !== null && typeof Me.markComponentLayoutEffectUnmountStarted == "function" && Me.markComponentLayoutEffectUnmountStarted(e);
    }
    function kd() {
      Me !== null && typeof Me.markComponentLayoutEffectUnmountStopped == "function" && Me.markComponentLayoutEffectUnmountStopped();
    }
    function ps(e, t, a) {
      Me !== null && typeof Me.markComponentErrored == "function" && Me.markComponentErrored(e, t, a);
    }
    function Ri(e, t, a) {
      Me !== null && typeof Me.markComponentSuspended == "function" && Me.markComponentSuspended(e, t, a);
    }
    function vs(e) {
      Me !== null && typeof Me.markLayoutEffectsStarted == "function" && Me.markLayoutEffectsStarted(e);
    }
    function hs() {
      Me !== null && typeof Me.markLayoutEffectsStopped == "function" && Me.markLayoutEffectsStopped();
    }
    function xo(e) {
      Me !== null && typeof Me.markPassiveEffectsStarted == "function" && Me.markPassiveEffectsStarted(e);
    }
    function Dd() {
      Me !== null && typeof Me.markPassiveEffectsStopped == "function" && Me.markPassiveEffectsStopped();
    }
    function bo(e) {
      Me !== null && typeof Me.markRenderStarted == "function" && Me.markRenderStarted(e);
    }
    function Bv() {
      Me !== null && typeof Me.markRenderYielded == "function" && Me.markRenderYielded();
    }
    function Mc() {
      Me !== null && typeof Me.markRenderStopped == "function" && Me.markRenderStopped();
    }
    function Dn(e) {
      Me !== null && typeof Me.markRenderScheduled == "function" && Me.markRenderScheduled(e);
    }
    function Ac(e, t) {
      Me !== null && typeof Me.markForceUpdateScheduled == "function" && Me.markForceUpdateScheduled(e, t);
    }
    function ms(e, t) {
      Me !== null && typeof Me.markStateUpdateScheduled == "function" && Me.markStateUpdateScheduled(e, t);
    }
    var rt = (
      /*                         */
      0
    ), Dt = (
      /*                 */
      1
    ), $t = (
      /*                    */
      2
    ), an = (
      /*               */
      8
    ), Yt = (
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
    ), Vt = (
      /*                          */
      0
    ), st = (
      /*                        */
      1
    ), Ml = (
      /*    */
      2
    ), ii = (
      /*             */
      4
    ), Dr = (
      /*            */
      8
    ), Un = (
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
    ), aa = (
      /*                   */
      1073741824
    );
    function Iv(e) {
      {
        if (e & st)
          return "Sync";
        if (e & Ml)
          return "InputContinuousHydration";
        if (e & ii)
          return "InputContinuous";
        if (e & Dr)
          return "DefaultHydration";
        if (e & Un)
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
        if (e & aa)
          return "Offscreen";
      }
    }
    var un = -1, Do = To, Xc = _o;
    function bs(e) {
      switch (zl(e)) {
        case st:
          return st;
        case Ml:
          return Ml;
        case ii:
          return ii;
        case Dr:
          return Dr;
        case Un:
          return Un;
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
        case aa:
          return aa;
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
        var C = zl(i), O = zl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          C >= O || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          C === Un && (O & Al) !== de
        )
          return t;
      }
      (i & ii) !== de && (i |= a & Un);
      var N = e.entangledLanes;
      if (N !== de)
        for (var I = e.entanglements, Q = i & N; Q > 0; ) {
          var J = Qn(Q), Ae = 1 << J;
          i |= I[J], Q &= ~Ae;
        }
      return i;
    }
    function li(e, t) {
      for (var a = e.eventTimes, i = un; t > 0; ) {
        var o = Qn(t), s = 1 << o, f = a[o];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Od(e, t) {
      switch (e) {
        case st:
        case Ml:
        case ii:
          return t + 250;
        case Dr:
        case Un:
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
          return un;
        case Cs:
        case xs:
        case ko:
        case aa:
          return un;
        default:
          return g("Should have found matching lanes. This is a bug in React."), un;
      }
    }
    function Zc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, o = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var v = Qn(f), h = 1 << v, S = s[v];
        S === un ? ((h & i) === de || (h & o) !== de) && (s[v] = Od(h, t)) : S <= t && (e.expiredLanes |= h), f &= ~h;
      }
    }
    function $v(e) {
      return bs(e.pendingLanes);
    }
    function ef(e) {
      var t = e.pendingLanes & ~aa;
      return t !== de ? t : t & aa ? aa : de;
    }
    function Yv(e) {
      return (e & st) !== de;
    }
    function ws(e) {
      return (e & jd) !== de;
    }
    function No(e) {
      return (e & Ss) === e;
    }
    function Ld(e) {
      var t = st | ii | Un;
      return (e & t) === de;
    }
    function Md(e) {
      return (e & Al) === e;
    }
    function tf(e, t) {
      var a = Ml | ii | Dr | Un;
      return (t & a) !== de;
    }
    function Qv(e, t) {
      return (t & e.expiredLanes) !== de;
    }
    function Ad(e) {
      return (e & Al) !== de;
    }
    function zd() {
      var e = Do;
      return Do <<= 1, (Do & Al) === de && (Do = To), e;
    }
    function Wv() {
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
    function hr(e) {
      return Qn(e);
    }
    function ia(e, t) {
      return (e & t) !== de;
    }
    function jo(e, t) {
      return (e & t) === t;
    }
    function xt(e, t) {
      return e | t;
    }
    function Rs(e, t) {
      return e & ~t;
    }
    function Ud(e, t) {
      return e & t;
    }
    function Gv(e) {
      return e;
    }
    function Kv(e, t) {
      return e !== Vt && e < t ? e : t;
    }
    function _s(e) {
      for (var t = [], a = 0; a < wo; a++)
        t.push(e);
      return t;
    }
    function Cu(e, t, a) {
      e.pendingLanes |= t, t !== ko && (e.suspendedLanes = de, e.pingedLanes = de);
      var i = e.eventTimes, o = hr(t);
      i[o] = a;
    }
    function qv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var o = Qn(i), s = 1 << o;
        a[o] = un, i &= ~s;
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
        i[v] = de, o[v] = un, s[v] = un, f &= ~h;
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
        case ii:
          i = Ml;
          break;
        case Un:
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
          i = Vt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Vt ? Vt : i;
    }
    function ks(e, t, a) {
      if (ra)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var o = hr(a), s = 1 << o, f = i[o];
          f.add(t), a &= ~s;
        }
    }
    function Xv(e, t) {
      if (ra)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var o = hr(t), s = 1 << o, f = a[o];
          f.size > 0 && (f.forEach(function(v) {
            var h = v.alternate;
            (h === null || !i.has(h)) && i.add(v);
          }), f.clear()), t &= ~s;
        }
    }
    function Hd(e, t) {
      return null;
    }
    var Fr = st, _i = ii, Fa = Un, Pa = ko, Ds = Vt;
    function Ha() {
      return Ds;
    }
    function Wn(e) {
      Ds = e;
    }
    function Jv(e, t) {
      var a = Ds;
      try {
        return Ds = e, t();
      } finally {
        Ds = a;
      }
    }
    function Zv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Ns(e, t) {
      return e > t ? e : t;
    }
    function or(e, t) {
      return e !== 0 && e < t;
    }
    function eh(e) {
      var t = zl(e);
      return or(Fr, t) ? or(_i, t) ? ws(t) ? Fa : Pa : _i : Fr;
    }
    function af(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var js;
    function Nr(e) {
      js = e;
    }
    function my(e) {
      js(e);
    }
    var Be;
    function xu(e) {
      Be = e;
    }
    var lf;
    function th(e) {
      lf = e;
    }
    var nh;
    function Os(e) {
      nh = e;
    }
    var Ls;
    function Vd(e) {
      Ls = e;
    }
    var of = !1, Ms = [], Ji = null, ki = null, Di = null, Fn = /* @__PURE__ */ new Map(), Pr = /* @__PURE__ */ new Map(), Hr = [], rh = [
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
    function ah(e) {
      return rh.indexOf(e) > -1;
    }
    function oi(e, t, a, i, o) {
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
          ki = null;
          break;
        case "mouseover":
        case "mouseout":
          Di = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          Fn.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Pr.delete(i);
          break;
        }
      }
    }
    function la(e, t, a, i, o, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = oi(t, a, i, o, s);
        if (t !== null) {
          var v = ju(t);
          v !== null && Be(v);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var h = e.targetContainers;
      return o !== null && h.indexOf(o) === -1 && h.push(o), e;
    }
    function yy(e, t, a, i, o) {
      switch (t) {
        case "focusin": {
          var s = o;
          return Ji = la(Ji, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = o;
          return ki = la(ki, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var v = o;
          return Di = la(Di, e, t, a, i, v), !0;
        }
        case "pointerover": {
          var h = o, S = h.pointerId;
          return Fn.set(S, la(Fn.get(S) || null, e, t, a, i, h)), !0;
        }
        case "gotpointercapture": {
          var C = o, O = C.pointerId;
          return Pr.set(O, la(Pr.get(O) || null, e, t, a, i, C)), !0;
        }
      }
      return !1;
    }
    function Id(e) {
      var t = Qs(e.target);
      if (t !== null) {
        var a = ma(t);
        if (a !== null) {
          var i = a.tag;
          if (i === le) {
            var o = wi(a);
            if (o !== null) {
              e.blockedOn = o, Ls(e.priority, function() {
                lf(a);
              });
              return;
            }
          } else if (i === P) {
            var s = a.stateNode;
            if (af(s)) {
              e.blockedOn = Ti(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function ih(e) {
      for (var t = nh(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Hr.length && or(t, Hr[i].priority); i++)
        ;
      Hr.splice(i, 0, a), i === 0 && Id(a);
    }
    function As(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = wu(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var o = e.nativeEvent, s = new o.constructor(o.type, o);
          fy(s), o.target.dispatchEvent(s), dy();
        } else {
          var f = ju(i);
          return f !== null && Be(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function $d(e, t, a) {
      As(e) && a.delete(t);
    }
    function gy() {
      of = !1, Ji !== null && As(Ji) && (Ji = null), ki !== null && As(ki) && (ki = null), Di !== null && As(Di) && (Di = null), Fn.forEach($d), Pr.forEach($d);
    }
    function Ul(e, t) {
      e.blockedOn === t && (e.blockedOn = null, of || (of = !0, E.unstable_scheduleCallback(E.unstable_NormalPriority, gy)));
    }
    function Oo(e) {
      if (Ms.length > 0) {
        Ul(Ms[0], e);
        for (var t = 1; t < Ms.length; t++) {
          var a = Ms[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Ji !== null && Ul(Ji, e), ki !== null && Ul(ki, e), Di !== null && Ul(Di, e);
      var i = function(v) {
        return Ul(v, e);
      };
      Fn.forEach(i), Pr.forEach(i);
      for (var o = 0; o < Hr.length; o++) {
        var s = Hr[o];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Hr.length > 0; ) {
        var f = Hr[0];
        if (f.blockedOn !== null)
          break;
        Id(f), f.blockedOn === null && Hr.shift();
      }
    }
    var mr = b.ReactCurrentBatchConfig, zt = !0;
    function tr(e) {
      zt = !!e;
    }
    function Gn() {
      return zt;
    }
    function yr(e, t, a) {
      var i = uf(t), o;
      switch (i) {
        case Fr:
          o = Ea;
          break;
        case _i:
          o = bu;
          break;
        case Fa:
        default:
          o = Pn;
          break;
      }
      return o.bind(null, t, a, e);
    }
    function Ea(e, t, a, i) {
      var o = Ha(), s = mr.transition;
      mr.transition = null;
      try {
        Wn(Fr), Pn(e, t, a, i);
      } finally {
        Wn(o), mr.transition = s;
      }
    }
    function bu(e, t, a, i) {
      var o = Ha(), s = mr.transition;
      mr.transition = null;
      try {
        Wn(_i), Pn(e, t, a, i);
      } finally {
        Wn(o), mr.transition = s;
      }
    }
    function Pn(e, t, a, i) {
      zt && zs(e, t, a, i);
    }
    function zs(e, t, a, i) {
      var o = wu(e, t, a, i);
      if (o === null) {
        Ay(e, t, i, Ni, a), Bd(e, i);
        return;
      }
      if (yy(o, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Bd(e, i), t & Oa && ah(e)) {
        for (; o !== null; ) {
          var s = ju(o);
          s !== null && my(s);
          var f = wu(e, t, a, i);
          if (f === null && Ay(e, t, i, Ni, a), f === o)
            break;
          o = f;
        }
        o !== null && i.stopPropagation();
        return;
      }
      Ay(e, t, i, null, a);
    }
    var Ni = null;
    function wu(e, t, a, i) {
      Ni = null;
      var o = md(i), s = Qs(o);
      if (s !== null) {
        var f = ma(s);
        if (f === null)
          s = null;
        else {
          var v = f.tag;
          if (v === le) {
            var h = wi(f);
            if (h !== null)
              return h;
            s = null;
          } else if (v === P) {
            var S = f.stateNode;
            if (af(S))
              return Ti(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Ni = s, null;
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
          return Fr;
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
          var t = jc();
          switch (t) {
            case fs:
              return Fr;
            case Ol:
              return _i;
            case Ki:
            case hy:
              return Fa;
            case So:
              return Pa;
            default:
              return Fa;
          }
        }
        default:
          return Fa;
      }
    }
    function Us(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function oa(e, t, a) {
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
    var Ca = null, Ru = null, Lo = null;
    function Fl(e) {
      return Ca = e, Ru = Fs(), !0;
    }
    function sf() {
      Ca = null, Ru = null, Lo = null;
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
      return "value" in Ca ? Ca.value : Ca.textContent;
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
      return Tt(t.prototype, {
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
    }, ji = jr(Kn), Vr = Tt({}, Kn, {
      view: 0,
      detail: 0
    }), ua = jr(Vr), cf, Hs, Mo;
    function Sy(e) {
      e !== Mo && (Mo && e.type === "mousemove" ? (cf = e.screenX - Mo.screenX, Hs = e.screenY - Mo.screenY) : (cf = 0, Hs = 0), Mo = e);
    }
    var ui = Tt({}, Vr, {
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
      getModifierState: xn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (Sy(e), cf);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Hs;
      }
    }), Qd = jr(ui), Wd = Tt({}, ui, {
      dataTransfer: 0
    }), Ao = jr(Wd), Gd = Tt({}, Vr, {
      relatedTarget: 0
    }), el = jr(Gd), lh = Tt({}, Kn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), oh = jr(lh), Kd = Tt({}, Kn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), ff = jr(Kd), Ey = Tt({}, Kn, {
      data: 0
    }), uh = jr(Ey), sh = uh, ch = {
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
    function Cy(e) {
      if (e.key) {
        var t = ch[e.key] || e.key;
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
    function fh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = ku[e];
      return i ? !!a[i] : !1;
    }
    function xn(e) {
      return fh;
    }
    var xy = Tt({}, Vr, {
      key: Cy,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: xn,
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
    }), dh = jr(xy), by = Tt({}, ui, {
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
    }), ph = jr(by), vh = Tt({}, Vr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: xn
    }), hh = jr(vh), wy = Tt({}, Kn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Va = jr(wy), qd = Tt({}, ui, {
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
    }), Ty = jr(qd), Hl = [9, 13, 27, 32], Vs = 229, tl = jn && "CompositionEvent" in window, Vl = null;
    jn && "documentMode" in document && (Vl = document.documentMode);
    var Xd = jn && "TextEvent" in window && !Vl, df = jn && (!tl || Vl && Vl > 8 && Vl <= 11), mh = 32, pf = String.fromCharCode(mh);
    function Ry() {
      wt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), wt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), wt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), wt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Jd = !1;
    function yh(e) {
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
    function gh(e) {
      return e.locale === "ko";
    }
    var Uo = !1;
    function ep(e, t, a, i, o) {
      var s, f;
      if (tl ? s = vf(t) : Uo ? Zd(t, i) && (s = "onCompositionEnd") : hf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      df && !gh(i) && (!Uo && s === "onCompositionStart" ? Uo = Fl(o) : s === "onCompositionEnd" && Uo && (f = Zi()));
      var v = Th(a, s);
      if (v.length > 0) {
        var h = new uh(s, t, null, i, o);
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
          return a !== mh ? null : (Jd = !0, pf);
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
          if (!yh(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return df && !gh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function gf(e, t, a, i, o) {
      var s;
      if (Xd ? s = yf(t, i) : s = tp(t, i), !s)
        return null;
      var f = Th(a, "onBeforeInput");
      if (f.length > 0) {
        var v = new sh("onBeforeInput", "beforeinput", null, i, o);
        e.push({
          event: v,
          listeners: f
        }), v.data = s;
      }
    }
    function Sh(e, t, a, i, o, s, f) {
      ep(e, t, a, i, o), gf(e, t, a, i, o);
    }
    var _y = {
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
      return t === "input" ? !!_y[e.type] : t === "textarea";
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
    function ky(e) {
      if (!jn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Is() {
      wt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function Eh(e, t, a, i) {
      fu(i);
      var o = Th(t, "onChange");
      if (o.length > 0) {
        var s = new ji("onChange", "change", null, a, i);
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
      Eh(t, n, e, md(e)), Ov(u, t);
    }
    function u(e) {
      PE(e, 0);
    }
    function c(e) {
      var t = wf(e);
      if (gi(t))
        return e;
    }
    function d(e, t) {
      if (e === "change")
        return t;
    }
    var y = !1;
    jn && (y = ky("input") && (!document.documentMode || document.documentMode > 9));
    function w(e, t) {
      Bl = e, n = t, Bl.attachEvent("onpropertychange", Y);
    }
    function k() {
      Bl && (Bl.detachEvent("onpropertychange", Y), Bl = null, n = null);
    }
    function Y(e) {
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
    function Fe(e, t) {
      if (e === "click")
        return c(t);
    }
    function Ye(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function Ke(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || at(e, "number", e.value);
    }
    function Hn(e, t, a, i, o, s, f) {
      var v = a ? wf(a) : window, h, S;
      if (r(v) ? h = d : Bs(v) ? y ? h = Ye : (h = Ce, S = me) : ve(v) && (h = Fe), h) {
        var C = h(t, a);
        if (C) {
          Eh(e, C, i, o);
          return;
        }
      }
      S && S(t, v, a), t === "focusout" && Ke(v);
    }
    function U() {
      Bt("onMouseEnter", ["mouseout", "mouseover"]), Bt("onMouseLeave", ["mouseout", "mouseover"]), Bt("onPointerEnter", ["pointerout", "pointerover"]), Bt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function j(e, t, a, i, o, s, f) {
      var v = t === "mouseover" || t === "pointerover", h = t === "mouseout" || t === "pointerout";
      if (v && !is(i)) {
        var S = i.relatedTarget || i.fromElement;
        if (S && (Qs(S) || hp(S)))
          return;
      }
      if (!(!h && !v)) {
        var C;
        if (o.window === o)
          C = o;
        else {
          var O = o.ownerDocument;
          O ? C = O.defaultView || O.parentWindow : C = window;
        }
        var N, I;
        if (h) {
          var Q = i.relatedTarget || i.toElement;
          if (N = a, I = Q ? Qs(Q) : null, I !== null) {
            var J = ma(I);
            (I !== J || I.tag !== te && I.tag !== ne) && (I = null);
          }
        } else
          N = null, I = a;
        if (N !== I) {
          var Ae = Qd, it = "onMouseLeave", Ze = "onMouseEnter", Ft = "mouse";
          (t === "pointerout" || t === "pointerover") && (Ae = ph, it = "onPointerLeave", Ze = "onPointerEnter", Ft = "pointer");
          var Ot = N == null ? C : wf(N), H = I == null ? C : wf(I), Z = new Ae(it, Ft + "leave", N, i, o);
          Z.target = Ot, Z.relatedTarget = H;
          var V = null, xe = Qs(o);
          if (xe === a) {
            var Ve = new Ae(Ze, Ft + "enter", I, i, o);
            Ve.target = H, Ve.relatedTarget = Ot, V = Ve;
          }
          q0(e, Z, V, N, I);
        }
      }
    }
    function B(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var ye = typeof Object.is == "function" ? Object.is : B;
    function Qe(e, t) {
      if (ye(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var o = 0; o < a.length; o++) {
        var s = a[o];
        if (!cr.call(t, s) || !ye(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function lt(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function ut(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function ft(e, t) {
      for (var a = lt(e), i = 0, o = 0; a; ) {
        if (a.nodeType === $i) {
          if (o = i + a.textContent.length, i <= t && o >= t)
            return {
              node: a,
              offset: t - i
            };
          i = o;
        }
        a = lt(ut(a));
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
      return Qt(e, o, s, f, v);
    }
    function Qt(e, t, a, i, o) {
      var s = 0, f = -1, v = -1, h = 0, S = 0, C = e, O = null;
      e: for (; ; ) {
        for (var N = null; C === t && (a === 0 || C.nodeType === $i) && (f = s + a), C === i && (o === 0 || C.nodeType === $i) && (v = s + o), C.nodeType === $i && (s += C.nodeValue.length), (N = C.firstChild) !== null; )
          O = C, C = N;
        for (; ; ) {
          if (C === e)
            break e;
          if (O === t && ++h === a && (f = s), O === i && ++S === o && (v = s), (N = C.nextSibling) !== null)
            break;
          C = O, O = C.parentNode;
        }
        C = N;
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
        var S = ft(e, f), C = ft(e, v);
        if (S && C) {
          if (o.rangeCount === 1 && o.anchorNode === S.node && o.anchorOffset === S.offset && o.focusNode === C.node && o.focusOffset === C.offset)
            return;
          var O = a.createRange();
          O.setStart(S.node, S.offset), o.removeAllRanges(), f > v ? (o.addRange(O), o.extend(C.node, C.offset)) : (O.setEnd(C.node, C.offset), o.addRange(O));
        }
      }
    }
    function Ch(e) {
      return e && e.nodeType === $i;
    }
    function kE(e, t) {
      return !e || !t ? !1 : e === t ? !0 : Ch(e) ? !1 : Ch(t) ? kE(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function O0(e) {
      return e && e.ownerDocument && kE(e.ownerDocument.documentElement, e);
    }
    function L0(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function DE() {
      for (var e = window, t = ja(); t instanceof e.HTMLIFrameElement; ) {
        if (L0(t))
          e = t.contentWindow;
        else
          return t;
        t = ja(e.document);
      }
      return t;
    }
    function Dy(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function M0() {
      var e = DE();
      return {
        focusedElem: e,
        selectionRange: Dy(e) ? z0(e) : null
      };
    }
    function A0(e) {
      var t = DE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && O0(a)) {
        i !== null && Dy(a) && U0(a, i);
        for (var o = [], s = a; s = s.parentNode; )
          s.nodeType === Jr && o.push({
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
    function z0(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = ur(e), t || {
        start: 0,
        end: 0
      };
    }
    function U0(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Il(e, t);
    }
    var F0 = jn && "documentMode" in document && document.documentMode <= 11;
    function P0() {
      wt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var Sf = null, Ny = null, np = null, jy = !1;
    function H0(e) {
      if ("selectionStart" in e && Dy(e))
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
    function V0(e) {
      return e.window === e ? e.document : e.nodeType === Yi ? e : e.ownerDocument;
    }
    function NE(e, t, a) {
      var i = V0(a);
      if (!(jy || Sf == null || Sf !== ja(i))) {
        var o = H0(Sf);
        if (!np || !Qe(np, o)) {
          np = o;
          var s = Th(Ny, "onSelect");
          if (s.length > 0) {
            var f = new ji("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = Sf;
          }
        }
      }
    }
    function B0(e, t, a, i, o, s, f) {
      var v = a ? wf(a) : window;
      switch (t) {
        case "focusin":
          (Bs(v) || v.contentEditable === "true") && (Sf = v, Ny = a, np = null);
          break;
        case "focusout":
          Sf = null, Ny = null, np = null;
          break;
        case "mousedown":
          jy = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          jy = !1, NE(e, i, o);
          break;
        case "selectionchange":
          if (F0)
            break;
        case "keydown":
        case "keyup":
          NE(e, i, o);
      }
    }
    function xh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var Ef = {
      animationend: xh("Animation", "AnimationEnd"),
      animationiteration: xh("Animation", "AnimationIteration"),
      animationstart: xh("Animation", "AnimationStart"),
      transitionend: xh("Transition", "TransitionEnd")
    }, Oy = {}, jE = {};
    jn && (jE = document.createElement("div").style, "AnimationEvent" in window || (delete Ef.animationend.animation, delete Ef.animationiteration.animation, delete Ef.animationstart.animation), "TransitionEvent" in window || delete Ef.transitionend.transition);
    function bh(e) {
      if (Oy[e])
        return Oy[e];
      if (!Ef[e])
        return e;
      var t = Ef[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in jE)
          return Oy[e] = t[a];
      return e;
    }
    var OE = bh("animationend"), LE = bh("animationiteration"), ME = bh("animationstart"), AE = bh("transitionend"), zE = /* @__PURE__ */ new Map(), UE = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function Du(e, t) {
      zE.set(e, t), wt(t, [e]);
    }
    function I0() {
      for (var e = 0; e < UE.length; e++) {
        var t = UE[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        Du(a, "on" + i);
      }
      Du(OE, "onAnimationEnd"), Du(LE, "onAnimationIteration"), Du(ME, "onAnimationStart"), Du("dblclick", "onDoubleClick"), Du("focusin", "onFocus"), Du("focusout", "onBlur"), Du(AE, "onTransitionEnd");
    }
    function $0(e, t, a, i, o, s, f) {
      var v = zE.get(t);
      if (v !== void 0) {
        var h = ji, S = t;
        switch (t) {
          case "keypress":
            if (Pl(i) === 0)
              return;
          case "keydown":
          case "keyup":
            h = dh;
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
            h = hh;
            break;
          case OE:
          case LE:
          case ME:
            h = oh;
            break;
          case AE:
            h = Va;
            break;
          case "scroll":
            h = ua;
            break;
          case "wheel":
            h = Ty;
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
            h = ph;
            break;
        }
        var C = (s & Oa) !== 0;
        {
          var O = !C && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", N = G0(a, v, i.type, C, O);
          if (N.length > 0) {
            var I = new h(v, S, null, i, o);
            e.push({
              event: I,
              listeners: N
            });
          }
        }
      }
    }
    I0(), U(), Is(), P0(), Ry();
    function Y0(e, t, a, i, o, s, f) {
      $0(e, t, a, i, o, s);
      var v = (s & hd) === 0;
      v && (j(e, t, a, i, o), Hn(e, t, a, i, o), B0(e, t, a, i, o), Sh(e, t, a, i, o));
    }
    var rp = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Ly = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(rp));
    function FE(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ci(i, t, void 0, e), e.currentTarget = null;
    }
    function Q0(e, t, a) {
      var i;
      if (a)
        for (var o = t.length - 1; o >= 0; o--) {
          var s = t[o], f = s.instance, v = s.currentTarget, h = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          FE(e, h, v), i = f;
        }
      else
        for (var S = 0; S < t.length; S++) {
          var C = t[S], O = C.instance, N = C.currentTarget, I = C.listener;
          if (O !== i && e.isPropagationStopped())
            return;
          FE(e, I, N), i = O;
        }
    }
    function PE(e, t) {
      for (var a = (t & Oa) !== 0, i = 0; i < e.length; i++) {
        var o = e[i], s = o.event, f = o.listeners;
        Q0(s, f, a);
      }
      us();
    }
    function W0(e, t, a, i, o) {
      var s = md(a), f = [];
      Y0(f, e, i, a, s, t), PE(f, t);
    }
    function Nn(e, t) {
      Ly.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = bT(t), o = X0(e);
      i.has(o) || (HE(t, e, gc, a), i.add(o));
    }
    function My(e, t, a) {
      Ly.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Oa), HE(a, e, i, t);
    }
    var wh = "_reactListening" + Math.random().toString(36).slice(2);
    function ap(e) {
      if (!e[wh]) {
        e[wh] = !0, gt.forEach(function(a) {
          a !== "selectionchange" && (Ly.has(a) || My(a, !1, e), My(a, !0, e));
        });
        var t = e.nodeType === Yi ? e : e.ownerDocument;
        t !== null && (t[wh] || (t[wh] = !0, My("selectionchange", !1, t)));
      }
    }
    function HE(e, t, a, i, o) {
      var s = yr(e, t, a), f = void 0;
      os && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Yd(e, t, s, f) : oa(e, t, s) : f !== void 0 ? Tu(e, t, s, f) : Us(e, t, s);
    }
    function VE(e, t) {
      return e === t || e.nodeType === Bn && e.parentNode === t;
    }
    function Ay(e, t, a, i, o) {
      var s = i;
      if (!(t & vd) && !(t & gc)) {
        var f = o;
        if (i !== null) {
          var v = i;
          e: for (; ; ) {
            if (v === null)
              return;
            var h = v.tag;
            if (h === P || h === W) {
              var S = v.stateNode.containerInfo;
              if (VE(S, f))
                break;
              if (h === W)
                for (var C = v.return; C !== null; ) {
                  var O = C.tag;
                  if (O === P || O === W) {
                    var N = C.stateNode.containerInfo;
                    if (VE(N, f))
                      return;
                  }
                  C = C.return;
                }
              for (; S !== null; ) {
                var I = Qs(S);
                if (I === null)
                  return;
                var Q = I.tag;
                if (Q === te || Q === ne) {
                  v = s = I;
                  continue e;
                }
                S = S.parentNode;
              }
            }
            v = v.return;
          }
        }
      }
      Ov(function() {
        return W0(e, t, a, s);
      });
    }
    function ip(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function G0(e, t, a, i, o, s) {
      for (var f = t !== null ? t + "Capture" : null, v = i ? f : t, h = [], S = e, C = null; S !== null; ) {
        var O = S, N = O.stateNode, I = O.tag;
        if (I === te && N !== null && (C = N, v !== null)) {
          var Q = Rl(S, v);
          Q != null && h.push(ip(S, Q, C));
        }
        if (o)
          break;
        S = S.return;
      }
      return h;
    }
    function Th(e, t) {
      for (var a = t + "Capture", i = [], o = e; o !== null; ) {
        var s = o, f = s.stateNode, v = s.tag;
        if (v === te && f !== null) {
          var h = f, S = Rl(o, a);
          S != null && i.unshift(ip(o, S, h));
          var C = Rl(o, t);
          C != null && i.push(ip(o, C, h));
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
    function K0(e, t) {
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
    function BE(e, t, a, i, o) {
      for (var s = t._reactName, f = [], v = a; v !== null && v !== i; ) {
        var h = v, S = h.alternate, C = h.stateNode, O = h.tag;
        if (S !== null && S === i)
          break;
        if (O === te && C !== null) {
          var N = C;
          if (o) {
            var I = Rl(v, s);
            I != null && f.unshift(ip(v, I, N));
          } else if (!o) {
            var Q = Rl(v, s);
            Q != null && f.push(ip(v, Q, N));
          }
        }
        v = v.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function q0(e, t, a, i, o) {
      var s = i && o ? K0(i, o) : null;
      i !== null && BE(e, t, i, s, !1), o !== null && a !== null && BE(e, a, o, s, !0);
    }
    function X0(e, t) {
      return e + "__bubble";
    }
    var Ba = !1, lp = "dangerouslySetInnerHTML", Rh = "suppressContentEditableWarning", Nu = "suppressHydrationWarning", IE = "autoFocus", $s = "children", Ys = "style", _h = "__html", zy, kh, op, $E, Dh, YE, QE;
    zy = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, kh = function(e, t) {
      fd(e, t), mc(e, t), Dv(e, t, {
        registrationNameDependencies: vt,
        possibleRegistrationNames: Ct
      });
    }, YE = jn && !document.documentMode, op = function(e, t, a) {
      if (!Ba) {
        var i = Nh(a), o = Nh(t);
        o !== i && (Ba = !0, g("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(o), JSON.stringify(i)));
      }
    }, $E = function(e) {
      if (!Ba) {
        Ba = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), g("Extra attributes from the server: %s", t);
      }
    }, Dh = function(e, t) {
      t === !1 ? g("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : g("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, QE = function(e, t) {
      var a = e.namespaceURI === Ii ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var J0 = /\r\n?/g, Z0 = /\u0000|\uFFFD/g;
    function Nh(e) {
      Ge(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(J0, `
`).replace(Z0, "");
    }
    function jh(e, t, a, i) {
      var o = Nh(t), s = Nh(e);
      if (s !== o && (i && (Ba || (Ba = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, o))), a && Oe))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function WE(e) {
      return e.nodeType === Yi ? e : e.ownerDocument;
    }
    function ew() {
    }
    function Oh(e) {
      e.onclick = ew;
    }
    function tw(e, t, a, i, o) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Ys)
            f && Object.freeze(f), bv(t, f);
          else if (s === lp) {
            var v = f ? f[_h] : void 0;
            v != null && fv(t, v);
          } else if (s === $s)
            if (typeof f == "string") {
              var h = e !== "textarea" || f !== "";
              h && ou(t, f);
            } else typeof f == "number" && ou(t, "" + f);
          else s === Rh || s === Nu || s === IE || (vt.hasOwnProperty(s) ? f != null && (typeof f != "function" && Dh(s, f), s === "onScroll" && Nn("scroll", t)) : f != null && Lr(t, s, f, o));
        }
    }
    function nw(e, t, a, i) {
      for (var o = 0; o < t.length; o += 2) {
        var s = t[o], f = t[o + 1];
        s === Ys ? bv(e, f) : s === lp ? fv(e, f) : s === $s ? ou(e, f) : Lr(e, s, f, i);
      }
    }
    function rw(e, t, a, i) {
      var o, s = WE(a), f, v = i;
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
          var C = f;
          t.multiple ? C.multiple = !0 : t.size && (C.size = t.size);
        }
      } else
        f = s.createElementNS(v, e);
      return v === Ii && !o && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !cr.call(zy, e) && (zy[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function aw(e, t) {
      return WE(t).createTextNode(e);
    }
    function iw(e, t, a, i) {
      var o = wl(t, a);
      kh(t, a);
      var s;
      switch (t) {
        case "dialog":
          Nn("cancel", e), Nn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          Nn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < rp.length; f++)
            Nn(rp[f], e);
          s = a;
          break;
        case "source":
          Nn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          Nn("error", e), Nn("load", e), s = a;
          break;
        case "details":
          Nn("toggle", e), s = a;
          break;
        case "input":
          ni(e, a), s = lu(e, a), Nn("invalid", e);
          break;
        case "option":
          Ht(e, a), s = a;
          break;
        case "select":
          co(e, a), s = Ju(e, a), Nn("invalid", e);
          break;
        case "textarea":
          td(e, a), s = ed(e, a), Nn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (vc(t, s), tw(t, e, i, s, o), t) {
        case "input":
          ti(e), $(e, a, !1);
          break;
        case "textarea":
          ti(e), sv(e);
          break;
        case "option":
          dn(e, a);
          break;
        case "select":
          Jf(e, a);
          break;
        default:
          typeof s.onClick == "function" && Oh(e);
          break;
      }
    }
    function lw(e, t, a, i, o) {
      kh(t, i);
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
          f = a, v = i, typeof f.onClick != "function" && typeof v.onClick == "function" && Oh(e);
          break;
      }
      vc(t, v);
      var h, S, C = null;
      for (h in f)
        if (!(v.hasOwnProperty(h) || !f.hasOwnProperty(h) || f[h] == null))
          if (h === Ys) {
            var O = f[h];
            for (S in O)
              O.hasOwnProperty(S) && (C || (C = {}), C[S] = "");
          } else h === lp || h === $s || h === Rh || h === Nu || h === IE || (vt.hasOwnProperty(h) ? s || (s = []) : (s = s || []).push(h, null));
      for (h in v) {
        var N = v[h], I = f != null ? f[h] : void 0;
        if (!(!v.hasOwnProperty(h) || N === I || N == null && I == null))
          if (h === Ys)
            if (N && Object.freeze(N), I) {
              for (S in I)
                I.hasOwnProperty(S) && (!N || !N.hasOwnProperty(S)) && (C || (C = {}), C[S] = "");
              for (S in N)
                N.hasOwnProperty(S) && I[S] !== N[S] && (C || (C = {}), C[S] = N[S]);
            } else
              C || (s || (s = []), s.push(h, C)), C = N;
          else if (h === lp) {
            var Q = N ? N[_h] : void 0, J = I ? I[_h] : void 0;
            Q != null && J !== Q && (s = s || []).push(h, Q);
          } else h === $s ? (typeof N == "string" || typeof N == "number") && (s = s || []).push(h, "" + N) : h === Rh || h === Nu || (vt.hasOwnProperty(h) ? (N != null && (typeof N != "function" && Dh(h, N), h === "onScroll" && Nn("scroll", e)), !s && I !== N && (s = [])) : (s = s || []).push(h, N));
      }
      return C && (sy(C, v[Ys]), (s = s || []).push(Ys, C)), s;
    }
    function ow(e, t, a, i, o) {
      a === "input" && o.type === "radio" && o.name != null && m(e, o);
      var s = wl(a, i), f = wl(a, o);
      switch (nw(e, t, s, f), a) {
        case "input":
          R(e, o);
          break;
        case "textarea":
          uv(e, o);
          break;
        case "select":
          fc(e, o);
          break;
      }
    }
    function uw(e) {
      {
        var t = e.toLowerCase();
        return rs.hasOwnProperty(t) && rs[t] || null;
      }
    }
    function sw(e, t, a, i, o, s, f) {
      var v, h;
      switch (v = wl(t, a), kh(t, a), t) {
        case "dialog":
          Nn("cancel", e), Nn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          Nn("load", e);
          break;
        case "video":
        case "audio":
          for (var S = 0; S < rp.length; S++)
            Nn(rp[S], e);
          break;
        case "source":
          Nn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          Nn("error", e), Nn("load", e);
          break;
        case "details":
          Nn("toggle", e);
          break;
        case "input":
          ni(e, a), Nn("invalid", e);
          break;
        case "option":
          Ht(e, a);
          break;
        case "select":
          co(e, a), Nn("invalid", e);
          break;
        case "textarea":
          td(e, a), Nn("invalid", e);
          break;
      }
      vc(t, a);
      {
        h = /* @__PURE__ */ new Set();
        for (var C = e.attributes, O = 0; O < C.length; O++) {
          var N = C[O].name.toLowerCase();
          switch (N) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              h.add(C[O].name);
          }
        }
      }
      var I = null;
      for (var Q in a)
        if (a.hasOwnProperty(Q)) {
          var J = a[Q];
          if (Q === $s)
            typeof J == "string" ? e.textContent !== J && (a[Nu] !== !0 && jh(e.textContent, J, s, f), I = [$s, J]) : typeof J == "number" && e.textContent !== "" + J && (a[Nu] !== !0 && jh(e.textContent, J, s, f), I = [$s, "" + J]);
          else if (vt.hasOwnProperty(Q))
            J != null && (typeof J != "function" && Dh(Q, J), Q === "onScroll" && Nn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof v == "boolean") {
            var Ae = void 0, it = cn(Q);
            if (a[Nu] !== !0) {
              if (!(Q === Rh || Q === Nu || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              Q === "value" || Q === "checked" || Q === "selected")) {
                if (Q === lp) {
                  var Ze = e.innerHTML, Ft = J ? J[_h] : void 0;
                  if (Ft != null) {
                    var Ot = QE(e, Ft);
                    Ot !== Ze && op(Q, Ze, Ot);
                  }
                } else if (Q === Ys) {
                  if (h.delete(Q), YE) {
                    var H = oy(J);
                    Ae = e.getAttribute("style"), H !== Ae && op(Q, Ae, H);
                  }
                } else if (v && !T)
                  h.delete(Q.toLowerCase()), Ae = ro(e, Q, J), J !== Ae && op(Q, Ae, J);
                else if (!Tn(Q, it, v) && !ar(Q, J, it, v)) {
                  var Z = !1;
                  if (it !== null)
                    h.delete(it.attributeName), Ae = hl(e, Q, J, it);
                  else {
                    var V = i;
                    if (V === Ii && (V = ad(t)), V === Ii)
                      h.delete(Q.toLowerCase());
                    else {
                      var xe = uw(Q);
                      xe !== null && xe !== Q && (Z = !0, h.delete(xe)), h.delete(Q);
                    }
                    Ae = ro(e, Q, J);
                  }
                  var Ve = T;
                  !Ve && J !== Ae && !Z && op(Q, Ae, J);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      h.size > 0 && a[Nu] !== !0 && $E(h), t) {
        case "input":
          ti(e), $(e, a, !0);
          break;
        case "textarea":
          ti(e), sv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && Oh(e);
          break;
      }
      return I;
    }
    function cw(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Uy(e, t) {
      {
        if (Ba)
          return;
        Ba = !0, g("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Fy(e, t) {
      {
        if (Ba)
          return;
        Ba = !0, g('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Py(e, t, a) {
      {
        if (Ba)
          return;
        Ba = !0, g("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Hy(e, t) {
      {
        if (t === "" || Ba)
          return;
        Ba = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function fw(e, t, a) {
      switch (t) {
        case "input":
          K(e, a);
          return;
        case "textarea":
          ry(e, a);
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
      var dw = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], GE = [
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
      ], pw = GE.concat(["button"]), vw = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], KE = {
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
        var a = Tt({}, e || KE), i = {
          tag: t
        };
        return GE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), pw.indexOf(t) !== -1 && (a.pTagInButtonScope = null), dw.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var hw = function(e, t) {
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
            return vw.indexOf(t) === -1;
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
      }, mw = function(e, t) {
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
      }, qE = {};
      up = function(e, t, a) {
        a = a || KE;
        var i = a.current, o = i && i.tag;
        t != null && (e != null && g("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = hw(e, o) ? null : i, f = s ? null : mw(e, a), v = s || f;
        if (v) {
          var h = v.tag, S = !!s + "|" + e + "|" + h;
          if (!qE[S]) {
            qE[S] = !0;
            var C = e, O = "";
            if (e === "#text" ? /\S/.test(t) ? C = "Text nodes" : (C = "Whitespace text nodes", O = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : C = "<" + e + ">", s) {
              var N = "";
              h === "table" && e === "tr" && (N += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", C, h, O, N);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", C, h);
          }
        }
      };
    }
    var Lh = "suppressHydrationWarning", Mh = "$", Ah = "/$", cp = "$?", fp = "$!", yw = "style", Vy = null, By = null;
    function gw(e) {
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
    function Sw(e, t, a) {
      {
        var i = e, o = id(i.namespace, t), s = sp(i.ancestorInfo, t);
        return {
          namespace: o,
          ancestorInfo: s
        };
      }
    }
    function R1(e) {
      return e;
    }
    function Ew(e) {
      Vy = Gn(), By = M0();
      var t = null;
      return tr(!1), t;
    }
    function Cw(e) {
      A0(By), tr(Vy), Vy = null, By = null;
    }
    function xw(e, t, a, i, o) {
      var s;
      {
        var f = i;
        if (up(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var v = "" + t.children, h = sp(f.ancestorInfo, e);
          up(null, v, h);
        }
        s = f.namespace;
      }
      var S = rw(e, t, a, s);
      return vp(o, S), qy(S, t), S;
    }
    function bw(e, t) {
      e.appendChild(t);
    }
    function ww(e, t, a, i, o) {
      switch (iw(e, t, a, i), t) {
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
    function Tw(e, t, a, i, o, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var v = "" + i.children, h = sp(f.ancestorInfo, t);
          up(null, v, h);
        }
      }
      return lw(e, t, a, i);
    }
    function Iy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function Rw(e, t, a, i) {
      {
        var o = a;
        up(null, e, o.ancestorInfo);
      }
      var s = aw(e, t);
      return vp(i, s), s;
    }
    function _w() {
      var e = window.event;
      return e === void 0 ? Fa : uf(e.type);
    }
    var $y = typeof setTimeout == "function" ? setTimeout : void 0, kw = typeof clearTimeout == "function" ? clearTimeout : void 0, Yy = -1, XE = typeof Promise == "function" ? Promise : void 0, Dw = typeof queueMicrotask == "function" ? queueMicrotask : typeof XE < "u" ? function(e) {
      return XE.resolve(null).then(e).catch(Nw);
    } : $y;
    function Nw(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function jw(e, t, a, i) {
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
    function Ow(e, t, a, i, o, s) {
      ow(e, t, a, i, o), qy(e, o);
    }
    function JE(e) {
      ou(e, "");
    }
    function Lw(e, t, a) {
      e.nodeValue = a;
    }
    function Mw(e, t) {
      e.appendChild(t);
    }
    function Aw(e, t) {
      var a;
      e.nodeType === Bn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Oh(a);
    }
    function zw(e, t, a) {
      e.insertBefore(t, a);
    }
    function Uw(e, t, a) {
      e.nodeType === Bn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function Fw(e, t) {
      e.removeChild(t);
    }
    function Pw(e, t) {
      e.nodeType === Bn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Qy(e, t) {
      var a = t, i = 0;
      do {
        var o = a.nextSibling;
        if (e.removeChild(a), o && o.nodeType === Bn) {
          var s = o.data;
          if (s === Ah)
            if (i === 0) {
              e.removeChild(o), Oo(t);
              return;
            } else
              i--;
          else (s === Mh || s === cp || s === fp) && i++;
        }
        a = o;
      } while (a);
      Oo(t);
    }
    function Hw(e, t) {
      e.nodeType === Bn ? Qy(e.parentNode, t) : e.nodeType === Jr && Qy(e, t), Oo(e);
    }
    function Vw(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function Bw(e) {
      e.nodeValue = "";
    }
    function Iw(e, t) {
      e = e;
      var a = t[yw], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = pc("display", i);
    }
    function $w(e, t) {
      e.nodeValue = t;
    }
    function Yw(e) {
      e.nodeType === Jr ? e.textContent = "" : e.nodeType === Yi && e.documentElement && e.removeChild(e.documentElement);
    }
    function Qw(e, t, a) {
      return e.nodeType !== Jr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function Ww(e, t) {
      return t === "" || e.nodeType !== $i ? null : e;
    }
    function Gw(e) {
      return e.nodeType !== Bn ? null : e;
    }
    function ZE(e) {
      return e.data === cp;
    }
    function Wy(e) {
      return e.data === fp;
    }
    function Kw(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, o;
      return t && (a = t.dgst, i = t.msg, o = t.stck), {
        message: i,
        digest: a,
        stack: o
      };
    }
    function qw(e, t) {
      e._reactRetry = t;
    }
    function zh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Jr || t === $i)
          break;
        if (t === Bn) {
          var a = e.data;
          if (a === Mh || a === fp || a === cp)
            break;
          if (a === Ah)
            return null;
        }
      }
      return e;
    }
    function dp(e) {
      return zh(e.nextSibling);
    }
    function Xw(e) {
      return zh(e.firstChild);
    }
    function Jw(e) {
      return zh(e.firstChild);
    }
    function Zw(e) {
      return zh(e.nextSibling);
    }
    function eT(e, t, a, i, o, s, f) {
      vp(s, e), qy(e, a);
      var v;
      {
        var h = o;
        v = h.namespace;
      }
      var S = (s.mode & Dt) !== rt;
      return sw(e, t, a, v, i, S, f);
    }
    function tT(e, t, a, i) {
      return vp(a, e), a.mode & Dt, cw(e, t);
    }
    function nT(e, t) {
      vp(t, e);
    }
    function rT(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Bn) {
          var i = t.data;
          if (i === Ah) {
            if (a === 0)
              return dp(t);
            a--;
          } else (i === Mh || i === fp || i === cp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function eC(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Bn) {
          var i = t.data;
          if (i === Mh || i === fp || i === cp) {
            if (a === 0)
              return t;
            a--;
          } else i === Ah && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function aT(e) {
      Oo(e);
    }
    function iT(e) {
      Oo(e);
    }
    function lT(e) {
      return e !== "head" && e !== "body";
    }
    function oT(e, t, a, i) {
      var o = !0;
      jh(t.nodeValue, a, i, o);
    }
    function uT(e, t, a, i, o, s) {
      if (t[Lh] !== !0) {
        var f = !0;
        jh(i.nodeValue, o, s, f);
      }
    }
    function sT(e, t) {
      t.nodeType === Jr ? Uy(e, t) : t.nodeType === Bn || Fy(e, t);
    }
    function cT(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Jr ? Uy(a, t) : t.nodeType === Bn || Fy(a, t));
      }
    }
    function fT(e, t, a, i, o) {
      (o || t[Lh] !== !0) && (i.nodeType === Jr ? Uy(a, i) : i.nodeType === Bn || Fy(a, i));
    }
    function dT(e, t, a) {
      Py(e, t);
    }
    function pT(e, t) {
      Hy(e, t);
    }
    function vT(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Py(i, t);
      }
    }
    function hT(e, t) {
      {
        var a = e.parentNode;
        a !== null && Hy(a, t);
      }
    }
    function mT(e, t, a, i, o, s) {
      (s || t[Lh] !== !0) && Py(a, i);
    }
    function yT(e, t, a, i, o) {
      (o || t[Lh] !== !0) && Hy(a, i);
    }
    function gT(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function ST(e) {
      ap(e);
    }
    var xf = Math.random().toString(36).slice(2), bf = "__reactFiber$" + xf, Gy = "__reactProps$" + xf, pp = "__reactContainer$" + xf, Ky = "__reactEvents$" + xf, ET = "__reactListeners$" + xf, CT = "__reactHandles$" + xf;
    function xT(e) {
      delete e[bf], delete e[Gy], delete e[Ky], delete e[ET], delete e[CT];
    }
    function vp(e, t) {
      t[bf] = e;
    }
    function Uh(e, t) {
      t[pp] = e;
    }
    function tC(e) {
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
            for (var o = eC(e); o !== null; ) {
              var s = o[bf];
              if (s)
                return s;
              o = eC(o);
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
    function Fh(e) {
      return e[Gy] || null;
    }
    function qy(e, t) {
      e[Gy] = t;
    }
    function bT(e) {
      var t = e[Ky];
      return t === void 0 && (t = e[Ky] = /* @__PURE__ */ new Set()), t;
    }
    var nC = {}, rC = b.ReactDebugCurrentFrame;
    function Ph(e) {
      if (e) {
        var t = e._owner, a = Hi(e.type, e._source, t ? t.type : null);
        rC.setExtraStackFrame(a);
      } else
        rC.setExtraStackFrame(null);
    }
    function nl(e, t, a, i, o) {
      {
        var s = Function.call.bind(cr);
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
            v && !(v instanceof Error) && (Ph(o), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof v), Ph(null)), v instanceof Error && !(v.message in nC) && (nC[v.message] = !0, Ph(o), g("Failed %s type: %s", a, v.message), Ph(null));
          }
      }
    }
    var Xy = [], Hh;
    Hh = [];
    var Fo = -1;
    function Ou(e) {
      return {
        current: e
      };
    }
    function sa(e, t) {
      if (Fo < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== Hh[Fo] && g("Unexpected Fiber popped."), e.current = Xy[Fo], Xy[Fo] = null, Hh[Fo] = null, Fo--;
    }
    function ca(e, t, a) {
      Fo++, Xy[Fo] = e.current, Hh[Fo] = a, e.current = t;
    }
    var Jy;
    Jy = {};
    var si = {};
    Object.freeze(si);
    var Po = Ou(si), $l = Ou(!1), Zy = si;
    function Tf(e, t, a) {
      return a && Yl(t) ? Zy : Po.current;
    }
    function aC(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Rf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return si;
        var o = e.stateNode;
        if (o && o.__reactInternalMemoizedUnmaskedChildContext === t)
          return o.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var v = pt(e) || "Unknown";
          nl(i, s, "context", v);
        }
        return o && aC(e, t, s), s;
      }
    }
    function Vh() {
      return $l.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Bh(e) {
      sa($l, e), sa(Po, e);
    }
    function eg(e) {
      sa($l, e), sa(Po, e);
    }
    function iC(e, t, a) {
      {
        if (Po.current !== si)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ca(Po, t, e), ca($l, a, e);
      }
    }
    function lC(e, t, a) {
      {
        var i = e.stateNode, o = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = pt(e) || "Unknown";
            Jy[s] || (Jy[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var v in f)
          if (!(v in o))
            throw new Error((pt(e) || "Unknown") + '.getChildContext(): key "' + v + '" is not defined in childContextTypes.');
        {
          var h = pt(e) || "Unknown";
          nl(o, f, "child context", h);
        }
        return Tt({}, a, f);
      }
    }
    function Ih(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || si;
        return Zy = Po.current, ca(Po, a, e), ca($l, $l.current, e), !0;
      }
    }
    function oC(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var o = lC(e, t, Zy);
          i.__reactInternalMemoizedMergedChildContext = o, sa($l, e), sa(Po, e), ca(Po, o, e), ca($l, a, e);
        } else
          sa($l, e), ca($l, a, e);
      }
    }
    function wT(e) {
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
    var Lu = 0, $h = 1, Ho = null, tg = !1, ng = !1;
    function uC(e) {
      Ho === null ? Ho = [e] : Ho.push(e);
    }
    function TT(e) {
      tg = !0, uC(e);
    }
    function sC() {
      tg && Mu();
    }
    function Mu() {
      if (!ng && Ho !== null) {
        ng = !0;
        var e = 0, t = Ha();
        try {
          var a = !0, i = Ho;
          for (Wn(Fr); e < i.length; e++) {
            var o = i[e];
            do
              o = o(a);
            while (o !== null);
          }
          Ho = null, tg = !1;
        } catch (s) {
          throw Ho !== null && (Ho = Ho.slice(e + 1)), gd(fs, Mu), s;
        } finally {
          Wn(t), ng = !1;
        }
      }
      return null;
    }
    var _f = [], kf = 0, Yh = null, Qh = 0, Oi = [], Li = 0, Ws = null, Vo = 1, Bo = "";
    function RT(e) {
      return Ks(), (e.flags & xi) !== nt;
    }
    function _T(e) {
      return Ks(), Qh;
    }
    function kT() {
      var e = Bo, t = Vo, a = t & ~DT(t);
      return a.toString(32) + e;
    }
    function Gs(e, t) {
      Ks(), _f[kf++] = Qh, _f[kf++] = Yh, Yh = e, Qh = t;
    }
    function cC(e, t, a) {
      Ks(), Oi[Li++] = Vo, Oi[Li++] = Bo, Oi[Li++] = Ws, Ws = e;
      var i = Vo, o = Bo, s = Wh(i) - 1, f = i & ~(1 << s), v = a + 1, h = Wh(t) + s;
      if (h > 30) {
        var S = s - s % 5, C = (1 << S) - 1, O = (f & C).toString(32), N = f >> S, I = s - S, Q = Wh(t) + I, J = v << I, Ae = J | N, it = O + o;
        Vo = 1 << Q | Ae, Bo = it;
      } else {
        var Ze = v << s, Ft = Ze | f, Ot = o;
        Vo = 1 << h | Ft, Bo = Ot;
      }
    }
    function rg(e) {
      Ks();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Gs(e, a), cC(e, a, i);
      }
    }
    function Wh(e) {
      return 32 - Yn(e);
    }
    function DT(e) {
      return 1 << Wh(e) - 1;
    }
    function ag(e) {
      for (; e === Yh; )
        Yh = _f[--kf], _f[kf] = null, Qh = _f[--kf], _f[kf] = null;
      for (; e === Ws; )
        Ws = Oi[--Li], Oi[Li] = null, Bo = Oi[--Li], Oi[Li] = null, Vo = Oi[--Li], Oi[Li] = null;
    }
    function NT() {
      return Ks(), Ws !== null ? {
        id: Vo,
        overflow: Bo
      } : null;
    }
    function jT(e, t) {
      Ks(), Oi[Li++] = Vo, Oi[Li++] = Bo, Oi[Li++] = Ws, Vo = t.id, Bo = t.overflow, Ws = e;
    }
    function Ks() {
      Ir() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Br = null, Mi = null, rl = !1, qs = !1, Au = null;
    function OT() {
      rl && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function fC() {
      qs = !0;
    }
    function LT() {
      return qs;
    }
    function MT(e) {
      var t = e.stateNode.containerInfo;
      return Mi = Jw(t), Br = e, rl = !0, Au = null, qs = !1, !0;
    }
    function AT(e, t, a) {
      return Mi = Zw(t), Br = e, rl = !0, Au = null, qs = !1, a !== null && jT(e, a), !0;
    }
    function dC(e, t) {
      switch (e.tag) {
        case P: {
          sT(e.stateNode.containerInfo, t);
          break;
        }
        case te: {
          var a = (e.mode & Dt) !== rt;
          fT(
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
          i.dehydrated !== null && cT(i.dehydrated, t);
          break;
        }
      }
    }
    function pC(e, t) {
      dC(e, t);
      var a = Pk();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= La) : i.push(a);
    }
    function ig(e, t) {
      {
        if (qs)
          return;
        switch (e.tag) {
          case P: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case te:
                var i = t.type;
                t.pendingProps, dT(a, i);
                break;
              case ne:
                var o = t.pendingProps;
                pT(a, o);
                break;
            }
            break;
          }
          case te: {
            var s = e.type, f = e.memoizedProps, v = e.stateNode;
            switch (t.tag) {
              case te: {
                var h = t.type, S = t.pendingProps, C = (e.mode & Dt) !== rt;
                mT(
                  s,
                  f,
                  v,
                  h,
                  S,
                  // TODO: Delete this argument when we remove the legacy root API.
                  C
                );
                break;
              }
              case ne: {
                var O = t.pendingProps, N = (e.mode & Dt) !== rt;
                yT(
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
            var I = e.memoizedState, Q = I.dehydrated;
            if (Q !== null) switch (t.tag) {
              case te:
                var J = t.type;
                t.pendingProps, vT(Q, J);
                break;
              case ne:
                var Ae = t.pendingProps;
                hT(Q, Ae);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function vC(e, t) {
      t.flags = t.flags & ~ea | _n, ig(e, t);
    }
    function hC(e, t) {
      switch (e.tag) {
        case te: {
          var a = e.type;
          e.pendingProps;
          var i = Qw(t, a);
          return i !== null ? (e.stateNode = i, Br = e, Mi = Xw(i), !0) : !1;
        }
        case ne: {
          var o = e.pendingProps, s = Ww(t, o);
          return s !== null ? (e.stateNode = s, Br = e, Mi = null, !0) : !1;
        }
        case le: {
          var f = Gw(t);
          if (f !== null) {
            var v = {
              dehydrated: f,
              treeContext: NT(),
              retryLane: aa
            };
            e.memoizedState = v;
            var h = Hk(f);
            return h.return = e, e.child = h, Br = e, Mi = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function lg(e) {
      return (e.mode & Dt) !== rt && (e.flags & et) === nt;
    }
    function og(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function ug(e) {
      if (rl) {
        var t = Mi;
        if (!t) {
          lg(e) && (ig(Br, e), og()), vC(Br, e), rl = !1, Br = e;
          return;
        }
        var a = t;
        if (!hC(e, t)) {
          lg(e) && (ig(Br, e), og()), t = dp(a);
          var i = Br;
          if (!t || !hC(e, t)) {
            vC(Br, e), rl = !1, Br = e;
            return;
          }
          pC(i, a);
        }
      }
    }
    function zT(e, t, a) {
      var i = e.stateNode, o = !qs, s = eT(i, e.type, e.memoizedProps, t, a, e, o);
      return e.updateQueue = s, s !== null;
    }
    function UT(e) {
      var t = e.stateNode, a = e.memoizedProps, i = tT(t, a, e);
      if (i) {
        var o = Br;
        if (o !== null)
          switch (o.tag) {
            case P: {
              var s = o.stateNode.containerInfo, f = (o.mode & Dt) !== rt;
              oT(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case te: {
              var v = o.type, h = o.memoizedProps, S = o.stateNode, C = (o.mode & Dt) !== rt;
              uT(
                v,
                h,
                S,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                C
              );
              break;
            }
          }
      }
      return i;
    }
    function FT(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      nT(a, e);
    }
    function PT(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return rT(a);
    }
    function mC(e) {
      for (var t = e.return; t !== null && t.tag !== te && t.tag !== P && t.tag !== le; )
        t = t.return;
      Br = t;
    }
    function Gh(e) {
      if (e !== Br)
        return !1;
      if (!rl)
        return mC(e), rl = !0, !1;
      if (e.tag !== P && (e.tag !== te || lT(e.type) && !Iy(e.type, e.memoizedProps))) {
        var t = Mi;
        if (t)
          if (lg(e))
            yC(e), og();
          else
            for (; t; )
              pC(e, t), t = dp(t);
      }
      return mC(e), e.tag === le ? Mi = PT(e) : Mi = Br ? dp(e.stateNode) : null, !0;
    }
    function HT() {
      return rl && Mi !== null;
    }
    function yC(e) {
      for (var t = Mi; t; )
        dC(e, t), t = dp(t);
    }
    function Df() {
      Br = null, Mi = null, rl = !1, qs = !1;
    }
    function gC() {
      Au !== null && (fb(Au), Au = null);
    }
    function Ir() {
      return rl;
    }
    function sg(e) {
      Au === null ? Au = [e] : Au.push(e);
    }
    var VT = b.ReactCurrentBatchConfig, BT = null;
    function IT() {
      return VT.transition;
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
      var $T = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & an && (t = a), a = a.return;
        return t;
      }, Xs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, mp = [], yp = [], gp = [], Sp = [], Ep = [], Cp = [], Js = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Js.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && mp.push(e), e.mode & an && typeof t.UNSAFE_componentWillMount == "function" && yp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && gp.push(e), e.mode & an && typeof t.UNSAFE_componentWillReceiveProps == "function" && Sp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Ep.push(e), e.mode & an && typeof t.UNSAFE_componentWillUpdate == "function" && Cp.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(N) {
          e.add(pt(N) || "Component"), Js.add(N.type);
        }), mp = []);
        var t = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(N) {
          t.add(pt(N) || "Component"), Js.add(N.type);
        }), yp = []);
        var a = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(N) {
          a.add(pt(N) || "Component"), Js.add(N.type);
        }), gp = []);
        var i = /* @__PURE__ */ new Set();
        Sp.length > 0 && (Sp.forEach(function(N) {
          i.add(pt(N) || "Component"), Js.add(N.type);
        }), Sp = []);
        var o = /* @__PURE__ */ new Set();
        Ep.length > 0 && (Ep.forEach(function(N) {
          o.add(pt(N) || "Component"), Js.add(N.type);
        }), Ep = []);
        var s = /* @__PURE__ */ new Set();
        if (Cp.length > 0 && (Cp.forEach(function(N) {
          s.add(pt(N) || "Component"), Js.add(N.type);
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
          var C = Xs(a);
          D(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, C);
        }
        if (o.size > 0) {
          var O = Xs(o);
          D(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, O);
        }
      };
      var Kh = /* @__PURE__ */ new Map(), SC = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = $T(e);
        if (a === null) {
          g("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!SC.has(e.type)) {
          var i = Kh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Kh.set(a, i)), i.push(e));
        }
      }, al.flushLegacyContextWarning = function() {
        Kh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(pt(s) || "Component"), SC.add(s.type);
            });
            var o = Xs(i);
            try {
              tn(a), g(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o);
            } finally {
              gn();
            }
          }
        });
      }, al.discardPendingWarnings = function() {
        mp = [], yp = [], gp = [], Sp = [], Ep = [], Cp = [], Kh = /* @__PURE__ */ new Map();
      };
    }
    var cg, fg, dg, pg, vg, EC = function(e, t) {
    };
    cg = !1, fg = !1, dg = {}, pg = {}, vg = {}, EC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = pt(t) || "Component";
        pg[a] || (pg[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function YT(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function xp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & an || M) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== z) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !YT(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var o = pt(e) || "Component";
          dg[o] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', o, i), dg[o] = !0);
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
          _a(i, "ref");
          var S = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === S)
            return t.ref;
          var C = function(O) {
            var N = h.refs;
            O === null ? delete N[S] : N[S] = O;
          };
          return C._stringRef = S, C;
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
    function qh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Xh(e) {
      {
        var t = pt(e) || "Component";
        if (vg[t])
          return;
        vg[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function CC(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function xC(e) {
      function t(H, Z) {
        if (e) {
          var V = H.deletions;
          V === null ? (H.deletions = [Z], H.flags |= La) : V.push(Z);
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
          return H.flags |= xi, Z;
        var xe = H.alternate;
        if (xe !== null) {
          var Ve = xe.index;
          return Ve < Z ? (H.flags |= _n, Z) : Ve;
        } else
          return H.flags |= _n, Z;
      }
      function f(H) {
        return e && H.alternate === null && (H.flags |= _n), H;
      }
      function v(H, Z, V, xe) {
        if (Z === null || Z.tag !== ne) {
          var Ve = sE(V, H.mode, xe);
          return Ve.return = H, Ve;
        } else {
          var Ue = o(Z, V);
          return Ue.return = H, Ue;
        }
      }
      function h(H, Z, V, xe) {
        var Ve = V.type;
        if (Ve === di)
          return C(H, Z, V.props.children, xe, V.key);
        if (Z !== null && (Z.elementType === Ve || // Keep this check inline so it only runs on the false path:
        _b(Z, V) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Ve == "object" && Ve !== null && Ve.$$typeof === ht && CC(Ve) === Z.type)) {
          var Ue = o(Z, V.props);
          return Ue.ref = xp(H, Z, V), Ue.return = H, Ue._debugSource = V._source, Ue._debugOwner = V._owner, Ue;
        }
        var ct = uE(V, H.mode, xe);
        return ct.ref = xp(H, Z, V), ct.return = H, ct;
      }
      function S(H, Z, V, xe) {
        if (Z === null || Z.tag !== W || Z.stateNode.containerInfo !== V.containerInfo || Z.stateNode.implementation !== V.implementation) {
          var Ve = cE(V, H.mode, xe);
          return Ve.return = H, Ve;
        } else {
          var Ue = o(Z, V.children || []);
          return Ue.return = H, Ue;
        }
      }
      function C(H, Z, V, xe, Ve) {
        if (Z === null || Z.tag !== X) {
          var Ue = Qu(V, H.mode, xe, Ve);
          return Ue.return = H, Ue;
        } else {
          var ct = o(Z, V);
          return ct.return = H, ct;
        }
      }
      function O(H, Z, V) {
        if (typeof Z == "string" && Z !== "" || typeof Z == "number") {
          var xe = sE("" + Z, H.mode, V);
          return xe.return = H, xe;
        }
        if (typeof Z == "object" && Z !== null) {
          switch (Z.$$typeof) {
            case Mr: {
              var Ve = uE(Z, H.mode, V);
              return Ve.ref = xp(H, null, Z), Ve.return = H, Ve;
            }
            case fr: {
              var Ue = cE(Z, H.mode, V);
              return Ue.return = H, Ue;
            }
            case ht: {
              var ct = Z._payload, yt = Z._init;
              return O(H, yt(ct), V);
            }
          }
          if (_t(Z) || Et(Z)) {
            var on = Qu(Z, H.mode, V, null);
            return on.return = H, on;
          }
          qh(H, Z);
        }
        return typeof Z == "function" && Xh(H), null;
      }
      function N(H, Z, V, xe) {
        var Ve = Z !== null ? Z.key : null;
        if (typeof V == "string" && V !== "" || typeof V == "number")
          return Ve !== null ? null : v(H, Z, "" + V, xe);
        if (typeof V == "object" && V !== null) {
          switch (V.$$typeof) {
            case Mr:
              return V.key === Ve ? h(H, Z, V, xe) : null;
            case fr:
              return V.key === Ve ? S(H, Z, V, xe) : null;
            case ht: {
              var Ue = V._payload, ct = V._init;
              return N(H, Z, ct(Ue), xe);
            }
          }
          if (_t(V) || Et(V))
            return Ve !== null ? null : C(H, Z, V, xe, null);
          qh(H, V);
        }
        return typeof V == "function" && Xh(H), null;
      }
      function I(H, Z, V, xe, Ve) {
        if (typeof xe == "string" && xe !== "" || typeof xe == "number") {
          var Ue = H.get(V) || null;
          return v(Z, Ue, "" + xe, Ve);
        }
        if (typeof xe == "object" && xe !== null) {
          switch (xe.$$typeof) {
            case Mr: {
              var ct = H.get(xe.key === null ? V : xe.key) || null;
              return h(Z, ct, xe, Ve);
            }
            case fr: {
              var yt = H.get(xe.key === null ? V : xe.key) || null;
              return S(Z, yt, xe, Ve);
            }
            case ht:
              var on = xe._payload, Wt = xe._init;
              return I(H, Z, V, Wt(on), Ve);
          }
          if (_t(xe) || Et(xe)) {
            var nr = H.get(V) || null;
            return C(Z, nr, xe, Ve, null);
          }
          qh(Z, xe);
        }
        return typeof xe == "function" && Xh(Z), null;
      }
      function Q(H, Z, V) {
        {
          if (typeof H != "object" || H === null)
            return Z;
          switch (H.$$typeof) {
            case Mr:
            case fr:
              EC(H, V);
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
            case ht:
              var Ve = H._payload, Ue = H._init;
              Q(Ue(Ve), Z, V);
              break;
          }
        }
        return Z;
      }
      function J(H, Z, V, xe) {
        for (var Ve = null, Ue = 0; Ue < V.length; Ue++) {
          var ct = V[Ue];
          Ve = Q(ct, Ve, H);
        }
        for (var yt = null, on = null, Wt = Z, nr = 0, Gt = 0, qn = null; Wt !== null && Gt < V.length; Gt++) {
          Wt.index > Gt ? (qn = Wt, Wt = null) : qn = Wt.sibling;
          var da = N(H, Wt, V[Gt], xe);
          if (da === null) {
            Wt === null && (Wt = qn);
            break;
          }
          e && Wt && da.alternate === null && t(H, Wt), nr = s(da, nr, Gt), on === null ? yt = da : on.sibling = da, on = da, Wt = qn;
        }
        if (Gt === V.length) {
          if (a(H, Wt), Ir()) {
            var qr = Gt;
            Gs(H, qr);
          }
          return yt;
        }
        if (Wt === null) {
          for (; Gt < V.length; Gt++) {
            var fi = O(H, V[Gt], xe);
            fi !== null && (nr = s(fi, nr, Gt), on === null ? yt = fi : on.sibling = fi, on = fi);
          }
          if (Ir()) {
            var Ta = Gt;
            Gs(H, Ta);
          }
          return yt;
        }
        for (var Ra = i(H, Wt); Gt < V.length; Gt++) {
          var pa = I(Ra, H, Gt, V[Gt], xe);
          pa !== null && (e && pa.alternate !== null && Ra.delete(pa.key === null ? Gt : pa.key), nr = s(pa, nr, Gt), on === null ? yt = pa : on.sibling = pa, on = pa);
        }
        if (e && Ra.forEach(function(Gf) {
          return t(H, Gf);
        }), Ir()) {
          var Ko = Gt;
          Gs(H, Ko);
        }
        return yt;
      }
      function Ae(H, Z, V, xe) {
        var Ve = Et(V);
        if (typeof Ve != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          V[Symbol.toStringTag] === "Generator" && (fg || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), fg = !0), V.entries === Ve && (cg || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), cg = !0);
          var Ue = Ve.call(V);
          if (Ue)
            for (var ct = null, yt = Ue.next(); !yt.done; yt = Ue.next()) {
              var on = yt.value;
              ct = Q(on, ct, H);
            }
        }
        var Wt = Ve.call(V);
        if (Wt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var nr = null, Gt = null, qn = Z, da = 0, qr = 0, fi = null, Ta = Wt.next(); qn !== null && !Ta.done; qr++, Ta = Wt.next()) {
          qn.index > qr ? (fi = qn, qn = null) : fi = qn.sibling;
          var Ra = N(H, qn, Ta.value, xe);
          if (Ra === null) {
            qn === null && (qn = fi);
            break;
          }
          e && qn && Ra.alternate === null && t(H, qn), da = s(Ra, da, qr), Gt === null ? nr = Ra : Gt.sibling = Ra, Gt = Ra, qn = fi;
        }
        if (Ta.done) {
          if (a(H, qn), Ir()) {
            var pa = qr;
            Gs(H, pa);
          }
          return nr;
        }
        if (qn === null) {
          for (; !Ta.done; qr++, Ta = Wt.next()) {
            var Ko = O(H, Ta.value, xe);
            Ko !== null && (da = s(Ko, da, qr), Gt === null ? nr = Ko : Gt.sibling = Ko, Gt = Ko);
          }
          if (Ir()) {
            var Gf = qr;
            Gs(H, Gf);
          }
          return nr;
        }
        for (var ev = i(H, qn); !Ta.done; qr++, Ta = Wt.next()) {
          var Zl = I(ev, H, qr, Ta.value, xe);
          Zl !== null && (e && Zl.alternate !== null && ev.delete(Zl.key === null ? qr : Zl.key), da = s(Zl, da, qr), Gt === null ? nr = Zl : Gt.sibling = Zl, Gt = Zl);
        }
        if (e && ev.forEach(function(yD) {
          return t(H, yD);
        }), Ir()) {
          var mD = qr;
          Gs(H, mD);
        }
        return nr;
      }
      function it(H, Z, V, xe) {
        if (Z !== null && Z.tag === ne) {
          a(H, Z.sibling);
          var Ve = o(Z, V);
          return Ve.return = H, Ve;
        }
        a(H, Z);
        var Ue = sE(V, H.mode, xe);
        return Ue.return = H, Ue;
      }
      function Ze(H, Z, V, xe) {
        for (var Ve = V.key, Ue = Z; Ue !== null; ) {
          if (Ue.key === Ve) {
            var ct = V.type;
            if (ct === di) {
              if (Ue.tag === X) {
                a(H, Ue.sibling);
                var yt = o(Ue, V.props.children);
                return yt.return = H, yt._debugSource = V._source, yt._debugOwner = V._owner, yt;
              }
            } else if (Ue.elementType === ct || // Keep this check inline so it only runs on the false path:
            _b(Ue, V) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof ct == "object" && ct !== null && ct.$$typeof === ht && CC(ct) === Ue.type) {
              a(H, Ue.sibling);
              var on = o(Ue, V.props);
              return on.ref = xp(H, Ue, V), on.return = H, on._debugSource = V._source, on._debugOwner = V._owner, on;
            }
            a(H, Ue);
            break;
          } else
            t(H, Ue);
          Ue = Ue.sibling;
        }
        if (V.type === di) {
          var Wt = Qu(V.props.children, H.mode, xe, V.key);
          return Wt.return = H, Wt;
        } else {
          var nr = uE(V, H.mode, xe);
          return nr.ref = xp(H, Z, V), nr.return = H, nr;
        }
      }
      function Ft(H, Z, V, xe) {
        for (var Ve = V.key, Ue = Z; Ue !== null; ) {
          if (Ue.key === Ve)
            if (Ue.tag === W && Ue.stateNode.containerInfo === V.containerInfo && Ue.stateNode.implementation === V.implementation) {
              a(H, Ue.sibling);
              var ct = o(Ue, V.children || []);
              return ct.return = H, ct;
            } else {
              a(H, Ue);
              break;
            }
          else
            t(H, Ue);
          Ue = Ue.sibling;
        }
        var yt = cE(V, H.mode, xe);
        return yt.return = H, yt;
      }
      function Ot(H, Z, V, xe) {
        var Ve = typeof V == "object" && V !== null && V.type === di && V.key === null;
        if (Ve && (V = V.props.children), typeof V == "object" && V !== null) {
          switch (V.$$typeof) {
            case Mr:
              return f(Ze(H, Z, V, xe));
            case fr:
              return f(Ft(H, Z, V, xe));
            case ht:
              var Ue = V._payload, ct = V._init;
              return Ot(H, Z, ct(Ue), xe);
          }
          if (_t(V))
            return J(H, Z, V, xe);
          if (Et(V))
            return Ae(H, Z, V, xe);
          qh(H, V);
        }
        return typeof V == "string" && V !== "" || typeof V == "number" ? f(it(H, Z, "" + V, xe)) : (typeof V == "function" && Xh(H), a(H, Z));
      }
      return Ot;
    }
    var Nf = xC(!0), bC = xC(!1);
    function QT(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = oc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = oc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function WT(e, t) {
      for (var a = e.child; a !== null; )
        Mk(a, t), a = a.sibling;
    }
    var hg = Ou(null), mg;
    mg = {};
    var Jh = null, jf = null, yg = null, Zh = !1;
    function em() {
      Jh = null, jf = null, yg = null, Zh = !1;
    }
    function wC() {
      Zh = !0;
    }
    function TC() {
      Zh = !1;
    }
    function RC(e, t, a) {
      ca(hg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== mg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = mg;
    }
    function gg(e, t) {
      var a = hg.current;
      sa(hg, t), e._currentValue = a;
    }
    function Sg(e, t, a) {
      for (var i = e; i !== null; ) {
        var o = i.alternate;
        if (jo(i.childLanes, t) ? o !== null && !jo(o.childLanes, t) && (o.childLanes = xt(o.childLanes, t)) : (i.childLanes = xt(i.childLanes, t), o !== null && (o.childLanes = xt(o.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function GT(e, t, a) {
      KT(e, t, a);
    }
    function KT(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var o = void 0, s = i.dependencies;
        if (s !== null) {
          o = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === z) {
                var v = Ts(a), h = Io(un, v);
                h.tag = nm;
                var S = i.updateQueue;
                if (S !== null) {
                  var C = S.shared, O = C.pending;
                  O === null ? h.next = h : (h.next = O.next, O.next = h), C.pending = h;
                }
              }
              i.lanes = xt(i.lanes, a);
              var N = i.alternate;
              N !== null && (N.lanes = xt(N.lanes, a)), Sg(i.return, a, e), s.lanes = xt(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === oe)
          o = i.type === e.type ? null : i.child;
        else if (i.tag === be) {
          var I = i.return;
          if (I === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          I.lanes = xt(I.lanes, a);
          var Q = I.alternate;
          Q !== null && (Q.lanes = xt(Q.lanes, a)), Sg(I, a, e), o = i.sibling;
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
      Jh = e, jf = null, yg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ia(a.lanes, t) && Up(), a.firstContext = null);
      }
    }
    function sr(e) {
      Zh && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (yg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (jf === null) {
          if (Jh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          jf = a, Jh.dependencies = {
            lanes: de,
            firstContext: a
          };
        } else
          jf = jf.next = a;
      }
      return t;
    }
    var Zs = null;
    function Eg(e) {
      Zs === null ? Zs = [e] : Zs.push(e);
    }
    function qT() {
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
    function _C(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, Eg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, tm(e, i);
    }
    function XT(e, t, a, i) {
      var o = t.interleaved;
      o === null ? (a.next = a, Eg(t)) : (a.next = o.next, o.next = a), t.interleaved = a;
    }
    function JT(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, Eg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, tm(e, i);
    }
    function Ia(e, t) {
      return tm(e, t);
    }
    var ZT = tm;
    function tm(e, t) {
      e.lanes = xt(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = xt(a.lanes, t)), a === null && (e.flags & (_n | ea)) !== nt && bb(e);
      for (var i = e, o = e.return; o !== null; )
        o.childLanes = xt(o.childLanes, t), a = o.alternate, a !== null ? a.childLanes = xt(a.childLanes, t) : (o.flags & (_n | ea)) !== nt && bb(e), i = o, o = o.return;
      if (i.tag === P) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var kC = 0, DC = 1, nm = 2, Cg = 3, rm = !1, xg, am;
    xg = !1, am = null;
    function bg(e) {
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
    function NC(e, t) {
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
        tag: kC,
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
      if (am === o && !xg && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), xg = !0), X_()) {
        var s = o.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), o.pending = t, ZT(e, a);
      } else
        return JT(e, o, t, a);
    }
    function im(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var o = i.shared;
        if (Ad(a)) {
          var s = o.lanes;
          s = Ud(s, e.pendingLanes);
          var f = xt(s, a);
          o.lanes = f, rf(e, f);
        }
      }
    }
    function wg(e, t) {
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
      var C = a.lastBaseUpdate;
      C === null ? a.firstBaseUpdate = t : C.next = t, a.lastBaseUpdate = t;
    }
    function eR(e, t, a, i, o, s) {
      switch (a.tag) {
        case DC: {
          var f = a.payload;
          if (typeof f == "function") {
            wC();
            var v = f.call(s, i, o);
            {
              if (e.mode & an) {
                kn(!0);
                try {
                  f.call(s, i, o);
                } finally {
                  kn(!1);
                }
              }
              TC();
            }
            return v;
          }
          return f;
        }
        case Cg:
          e.flags = e.flags & ~ir | et;
        case kC: {
          var h = a.payload, S;
          if (typeof h == "function") {
            wC(), S = h.call(s, i, o);
            {
              if (e.mode & an) {
                kn(!0);
                try {
                  h.call(s, i, o);
                } finally {
                  kn(!1);
                }
              }
              TC();
            }
          } else
            S = h;
          return S == null ? i : Tt({}, i, S);
        }
        case nm:
          return rm = !0, i;
      }
      return i;
    }
    function lm(e, t, a, i) {
      var o = e.updateQueue;
      rm = !1, am = o.shared;
      var s = o.firstBaseUpdate, f = o.lastBaseUpdate, v = o.shared.pending;
      if (v !== null) {
        o.shared.pending = null;
        var h = v, S = h.next;
        h.next = null, f === null ? s = S : f.next = S, f = h;
        var C = e.alternate;
        if (C !== null) {
          var O = C.updateQueue, N = O.lastBaseUpdate;
          N !== f && (N === null ? O.firstBaseUpdate = S : N.next = S, O.lastBaseUpdate = h);
        }
      }
      if (s !== null) {
        var I = o.baseState, Q = de, J = null, Ae = null, it = null, Ze = s;
        do {
          var Ft = Ze.lane, Ot = Ze.eventTime;
          if (jo(i, Ft)) {
            if (it !== null) {
              var Z = {
                eventTime: Ot,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Vt,
                tag: Ze.tag,
                payload: Ze.payload,
                callback: Ze.callback,
                next: null
              };
              it = it.next = Z;
            }
            I = eR(e, o, Ze, I, t, a);
            var V = Ze.callback;
            if (V !== null && // If the update was already committed, we should not queue its
            // callback again.
            Ze.lane !== Vt) {
              e.flags |= pn;
              var xe = o.effects;
              xe === null ? o.effects = [Ze] : xe.push(Ze);
            }
          } else {
            var H = {
              eventTime: Ot,
              lane: Ft,
              tag: Ze.tag,
              payload: Ze.payload,
              callback: Ze.callback,
              next: null
            };
            it === null ? (Ae = it = H, J = I) : it = it.next = H, Q = xt(Q, Ft);
          }
          if (Ze = Ze.next, Ze === null) {
            if (v = o.shared.pending, v === null)
              break;
            var Ve = v, Ue = Ve.next;
            Ve.next = null, Ze = Ue, o.lastBaseUpdate = Ve, o.shared.pending = null;
          }
        } while (!0);
        it === null && (J = I), o.baseState = J, o.firstBaseUpdate = Ae, o.lastBaseUpdate = it;
        var ct = o.shared.interleaved;
        if (ct !== null) {
          var yt = ct;
          do
            Q = xt(Q, yt.lane), yt = yt.next;
          while (yt !== ct);
        } else s === null && (o.shared.lanes = de);
        Kp(Q), e.lanes = Q, e.memoizedState = I;
      }
      am = null;
    }
    function tR(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function jC() {
      rm = !1;
    }
    function om() {
      return rm;
    }
    function OC(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o], f = s.callback;
          f !== null && (s.callback = null, tR(f, a));
        }
    }
    var bp = {}, Uu = Ou(bp), wp = Ou(bp), um = Ou(bp);
    function sm(e) {
      if (e === bp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function LC() {
      var e = sm(um.current);
      return e;
    }
    function Tg(e, t) {
      ca(um, t, e), ca(wp, e, e), ca(Uu, bp, e);
      var a = gw(t);
      sa(Uu, e), ca(Uu, a, e);
    }
    function Lf(e) {
      sa(Uu, e), sa(wp, e), sa(um, e);
    }
    function Rg() {
      var e = sm(Uu.current);
      return e;
    }
    function MC(e) {
      sm(um.current);
      var t = sm(Uu.current), a = Sw(t, e.type);
      t !== a && (ca(wp, e, e), ca(Uu, a, e));
    }
    function _g(e) {
      wp.current === e && (sa(Uu, e), sa(wp, e));
    }
    var nR = 0, AC = 1, zC = 1, Tp = 2, il = Ou(nR);
    function kg(e, t) {
      return (e & t) !== 0;
    }
    function Mf(e) {
      return e & AC;
    }
    function Dg(e, t) {
      return e & AC | t;
    }
    function rR(e, t) {
      return e | t;
    }
    function Fu(e, t) {
      ca(il, t, e);
    }
    function Af(e) {
      sa(il, e);
    }
    function aR(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function cm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === le) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || ZE(i) || Wy(i))
              return t;
          }
        } else if (t.tag === De && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var o = (t.flags & et) !== nt;
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
    var $a = (
      /*   */
      0
    ), gr = (
      /* */
      1
    ), Ql = (
      /*  */
      2
    ), Sr = (
      /*    */
      4
    ), $r = (
      /*   */
      8
    ), Ng = [];
    function jg() {
      for (var e = 0; e < Ng.length; e++) {
        var t = Ng[e];
        t._workInProgressVersionPrimary = null;
      }
      Ng.length = 0;
    }
    function iR(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var Pe = b.ReactCurrentDispatcher, Rp = b.ReactCurrentBatchConfig, Og, zf;
    Og = /* @__PURE__ */ new Set();
    var ec = de, ln = null, Er = null, Cr = null, fm = !1, _p = !1, kp = 0, lR = 0, oR = 25, ie = null, Ai = null, Pu = -1, Lg = !1;
    function Xt() {
      {
        var e = ie;
        Ai === null ? Ai = [e] : Ai.push(e);
      }
    }
    function _e() {
      {
        var e = ie;
        Ai !== null && (Pu++, Ai[Pu] !== e && uR(e));
      }
    }
    function Uf(e) {
      e != null && !_t(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", ie, typeof e);
    }
    function uR(e) {
      {
        var t = pt(ln);
        if (!Og.has(t) && (Og.add(t), Ai !== null)) {
          for (var a = "", i = 30, o = 0; o <= Pu; o++) {
            for (var s = Ai[o], f = o === Pu ? e : s, v = o + 1 + ". " + s; v.length < i; )
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
    function fa() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function Mg(e, t) {
      if (Lg)
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
      ec = s, ln = t, Ai = e !== null ? e._debugHookTypes : null, Pu = -1, Lg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = de, e !== null && e.memoizedState !== null ? Pe.current = ax : Ai !== null ? Pe.current = rx : Pe.current = nx;
      var f = a(i, o);
      if (_p) {
        var v = 0;
        do {
          if (_p = !1, kp = 0, v >= oR)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          v += 1, Lg = !1, Er = null, Cr = null, t.updateQueue = null, Pu = -1, Pe.current = ix, f = a(i, o);
        } while (_p);
      }
      Pe.current = wm, t._debugHookTypes = Ai;
      var h = Er !== null && Er.next !== null;
      if (ec = de, ln = null, Er = null, Cr = null, ie = null, Ai = null, Pu = -1, e !== null && (e.flags & $n) !== (t.flags & $n) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & Dt) !== rt && g("Internal React error: Expected static flag was missing. Please notify the React team."), fm = !1, h)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Pf() {
      var e = kp !== 0;
      return kp = 0, e;
    }
    function UC(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Yt) !== rt ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Rs(e.lanes, a);
    }
    function FC() {
      if (Pe.current = wm, fm) {
        for (var e = ln.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        fm = !1;
      }
      ec = de, ln = null, Er = null, Cr = null, Ai = null, Pu = -1, ie = null, XC = !1, _p = !1, kp = 0;
    }
    function Wl() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Cr === null ? ln.memoizedState = Cr = e : Cr = Cr.next = e, Cr;
    }
    function zi() {
      var e;
      if (Er === null) {
        var t = ln.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = Er.next;
      var a;
      if (Cr === null ? a = ln.memoizedState : a = Cr.next, a !== null)
        Cr = a, a = Cr.next, Er = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        Er = e;
        var i = {
          memoizedState: Er.memoizedState,
          baseState: Er.baseState,
          baseQueue: Er.baseQueue,
          queue: Er.queue,
          next: null
        };
        Cr === null ? ln.memoizedState = Cr = i : Cr = Cr.next = i;
      }
      return Cr;
    }
    function PC() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Ag(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function zg(e, t, a) {
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
      var f = s.dispatch = dR.bind(null, ln, s);
      return [i.memoizedState, f];
    }
    function Ug(e, t, a) {
      var i = zi(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = Er, f = s.baseQueue, v = o.pending;
      if (v !== null) {
        if (f !== null) {
          var h = f.next, S = v.next;
          f.next = S, v.next = h;
        }
        s.baseQueue !== f && g("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = v, o.pending = null;
      }
      if (f !== null) {
        var C = f.next, O = s.baseState, N = null, I = null, Q = null, J = C;
        do {
          var Ae = J.lane;
          if (jo(ec, Ae)) {
            if (Q !== null) {
              var Ze = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Vt,
                action: J.action,
                hasEagerState: J.hasEagerState,
                eagerState: J.eagerState,
                next: null
              };
              Q = Q.next = Ze;
            }
            if (J.hasEagerState)
              O = J.eagerState;
            else {
              var Ft = J.action;
              O = e(O, Ft);
            }
          } else {
            var it = {
              lane: Ae,
              action: J.action,
              hasEagerState: J.hasEagerState,
              eagerState: J.eagerState,
              next: null
            };
            Q === null ? (I = Q = it, N = O) : Q = Q.next = it, ln.lanes = xt(ln.lanes, Ae), Kp(Ae);
          }
          J = J.next;
        } while (J !== null && J !== C);
        Q === null ? N = O : Q.next = I, ye(O, i.memoizedState) || Up(), i.memoizedState = O, i.baseState = N, i.baseQueue = Q, o.lastRenderedState = O;
      }
      var Ot = o.interleaved;
      if (Ot !== null) {
        var H = Ot;
        do {
          var Z = H.lane;
          ln.lanes = xt(ln.lanes, Z), Kp(Z), H = H.next;
        } while (H !== Ot);
      } else f === null && (o.lanes = de);
      var V = o.dispatch;
      return [i.memoizedState, V];
    }
    function Fg(e, t, a) {
      var i = zi(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = o.dispatch, f = o.pending, v = i.memoizedState;
      if (f !== null) {
        o.pending = null;
        var h = f.next, S = h;
        do {
          var C = S.action;
          v = e(v, C), S = S.next;
        } while (S !== h);
        ye(v, i.memoizedState) || Up(), i.memoizedState = v, i.baseQueue === null && (i.baseState = v), o.lastRenderedState = v;
      }
      return [v, s];
    }
    function _1(e, t, a) {
    }
    function k1(e, t, a) {
    }
    function Pg(e, t, a) {
      var i = ln, o = Wl(), s, f = Ir();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), zf || s !== a() && (g("The result of getServerSnapshot should be cached to avoid an infinite loop"), zf = !0);
      } else {
        if (s = t(), !zf) {
          var v = t();
          ye(s, v) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
        }
        var h = Im();
        if (h === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        tf(h, ec) || HC(i, t, s);
      }
      o.memoizedState = s;
      var S = {
        value: s,
        getSnapshot: t
      };
      return o.queue = S, mm(BC.bind(null, i, S, e), [e]), i.flags |= Zr, Dp(gr | $r, VC.bind(null, i, S, s, t), void 0, null), s;
    }
    function dm(e, t, a) {
      var i = ln, o = zi(), s = t();
      if (!zf) {
        var f = t();
        ye(s, f) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
      }
      var v = o.memoizedState, h = !ye(v, s);
      h && (o.memoizedState = s, Up());
      var S = o.queue;
      if (jp(BC.bind(null, i, S, e), [e]), S.getSnapshot !== t || h || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      Cr !== null && Cr.memoizedState.tag & gr) {
        i.flags |= Zr, Dp(gr | $r, VC.bind(null, i, S, s, t), void 0, null);
        var C = Im();
        if (C === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        tf(C, ec) || HC(i, t, s);
      }
      return s;
    }
    function HC(e, t, a) {
      e.flags |= mu;
      var i = {
        getSnapshot: t,
        value: a
      }, o = ln.updateQueue;
      if (o === null)
        o = PC(), ln.updateQueue = o, o.stores = [i];
      else {
        var s = o.stores;
        s === null ? o.stores = [i] : s.push(i);
      }
    }
    function VC(e, t, a, i) {
      t.value = a, t.getSnapshot = i, IC(t) && $C(e);
    }
    function BC(e, t, a) {
      var i = function() {
        IC(t) && $C(e);
      };
      return a(i);
    }
    function IC(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !ye(a, i);
      } catch {
        return !0;
      }
    }
    function $C(e) {
      var t = Ia(e, st);
      t !== null && Tr(t, e, st, un);
    }
    function pm(e) {
      var t = Wl();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: de,
        dispatch: null,
        lastRenderedReducer: Ag,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = pR.bind(null, ln, a);
      return [t.memoizedState, i];
    }
    function Hg(e) {
      return Ug(Ag);
    }
    function Vg(e) {
      return Fg(Ag);
    }
    function Dp(e, t, a, i) {
      var o = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = ln.updateQueue;
      if (s === null)
        s = PC(), ln.updateQueue = s, s.lastEffect = o.next = o;
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
    function Bg(e) {
      var t = Wl();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function vm(e) {
      var t = zi();
      return t.memoizedState;
    }
    function Np(e, t, a, i) {
      var o = Wl(), s = i === void 0 ? null : i;
      ln.flags |= e, o.memoizedState = Dp(gr | t, a, void 0, s);
    }
    function hm(e, t, a, i) {
      var o = zi(), s = i === void 0 ? null : i, f = void 0;
      if (Er !== null) {
        var v = Er.memoizedState;
        if (f = v.destroy, s !== null) {
          var h = v.deps;
          if (Mg(s, h)) {
            o.memoizedState = Dp(t, a, f, s);
            return;
          }
        }
      }
      ln.flags |= e, o.memoizedState = Dp(gr | t, a, f, s);
    }
    function mm(e, t) {
      return (ln.mode & Yt) !== rt ? Np(bi | Zr | kc, $r, e, t) : Np(Zr | kc, $r, e, t);
    }
    function jp(e, t) {
      return hm(Zr, $r, e, t);
    }
    function Ig(e, t) {
      return Np(At, Ql, e, t);
    }
    function ym(e, t) {
      return hm(At, Ql, e, t);
    }
    function $g(e, t) {
      var a = At;
      return a |= Wi, (ln.mode & Yt) !== rt && (a |= kl), Np(a, Sr, e, t);
    }
    function gm(e, t) {
      return hm(At, Sr, e, t);
    }
    function YC(e, t) {
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
    function Yg(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, o = At;
      return o |= Wi, (ln.mode & Yt) !== rt && (o |= kl), Np(o, Sr, YC.bind(null, t, e), i);
    }
    function Sm(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return hm(At, Sr, YC.bind(null, t, e), i);
    }
    function sR(e, t) {
    }
    var Em = sR;
    function Qg(e, t) {
      var a = Wl(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function Cm(e, t) {
      var a = zi(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (Mg(i, s))
          return o[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Wg(e, t) {
      var a = Wl(), i = t === void 0 ? null : t, o = e();
      return a.memoizedState = [o, i], o;
    }
    function xm(e, t) {
      var a = zi(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (Mg(i, s))
          return o[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Gg(e) {
      var t = Wl();
      return t.memoizedState = e, e;
    }
    function QC(e) {
      var t = zi(), a = Er, i = a.memoizedState;
      return GC(t, i, e);
    }
    function WC(e) {
      var t = zi();
      if (Er === null)
        return t.memoizedState = e, e;
      var a = Er.memoizedState;
      return GC(t, a, e);
    }
    function GC(e, t, a) {
      var i = !Ld(ec);
      if (i) {
        if (!ye(a, t)) {
          var o = zd();
          ln.lanes = xt(ln.lanes, o), Kp(o), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Up()), e.memoizedState = a, a;
    }
    function cR(e, t, a) {
      var i = Ha();
      Wn(Zv(i, _i)), e(!0);
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
    function Kg() {
      var e = pm(!1), t = e[0], a = e[1], i = cR.bind(null, a), o = Wl();
      return o.memoizedState = i, [t, i];
    }
    function KC() {
      var e = Hg(), t = e[0], a = zi(), i = a.memoizedState;
      return [t, i];
    }
    function qC() {
      var e = Vg(), t = e[0], a = zi(), i = a.memoizedState;
      return [t, i];
    }
    var XC = !1;
    function fR() {
      return XC;
    }
    function qg() {
      var e = Wl(), t = Im(), a = t.identifierPrefix, i;
      if (Ir()) {
        var o = kT();
        i = ":" + a + "R" + o;
        var s = kp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = lR++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function bm() {
      var e = zi(), t = e.memoizedState;
      return t;
    }
    function dR(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = $u(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (JC(e))
        ZC(t, o);
      else {
        var s = _C(e, t, o, i);
        if (s !== null) {
          var f = wa();
          Tr(s, e, i, f), ex(s, t, i);
        }
      }
      tx(e, i);
    }
    function pR(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = $u(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (JC(e))
        ZC(t, o);
      else {
        var s = e.alternate;
        if (e.lanes === de && (s === null || s.lanes === de)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var v;
            v = Pe.current, Pe.current = ll;
            try {
              var h = t.lastRenderedState, S = f(h, a);
              if (o.hasEagerState = !0, o.eagerState = S, ye(S, h)) {
                XT(e, t, o, i);
                return;
              }
            } catch {
            } finally {
              Pe.current = v;
            }
          }
        }
        var C = _C(e, t, o, i);
        if (C !== null) {
          var O = wa();
          Tr(C, e, i, O), ex(C, t, i);
        }
      }
      tx(e, i);
    }
    function JC(e) {
      var t = e.alternate;
      return e === ln || t !== null && t === ln;
    }
    function ZC(e, t) {
      _p = fm = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function ex(e, t, a) {
      if (Ad(a)) {
        var i = t.lanes;
        i = Ud(i, e.pendingLanes);
        var o = xt(i, a);
        t.lanes = o, rf(e, o);
      }
    }
    function tx(e, t, a) {
      ms(e, t);
    }
    var wm = {
      readContext: sr,
      useCallback: fa,
      useContext: fa,
      useEffect: fa,
      useImperativeHandle: fa,
      useInsertionEffect: fa,
      useLayoutEffect: fa,
      useMemo: fa,
      useReducer: fa,
      useRef: fa,
      useState: fa,
      useDebugValue: fa,
      useDeferredValue: fa,
      useTransition: fa,
      useMutableSource: fa,
      useSyncExternalStore: fa,
      useId: fa,
      unstable_isNewReconciler: he
    }, nx = null, rx = null, ax = null, ix = null, Gl = null, ll = null, Tm = null;
    {
      var Xg = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, mt = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      nx = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", Xt(), Uf(t), Qg(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", Xt(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", Xt(), Uf(t), mm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", Xt(), Uf(a), Yg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", Xt(), Uf(t), Ig(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", Xt(), Uf(t), $g(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", Xt(), Uf(t);
          var a = Pe.current;
          Pe.current = Gl;
          try {
            return Wg(e, t);
          } finally {
            Pe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", Xt();
          var i = Pe.current;
          Pe.current = Gl;
          try {
            return zg(e, t, a);
          } finally {
            Pe.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", Xt(), Bg(e);
        },
        useState: function(e) {
          ie = "useState", Xt();
          var t = Pe.current;
          Pe.current = Gl;
          try {
            return pm(e);
          } finally {
            Pe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", Xt(), void 0;
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", Xt(), Gg(e);
        },
        useTransition: function() {
          return ie = "useTransition", Xt(), Kg();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", Xt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", Xt(), Pg(e, t, a);
        },
        useId: function() {
          return ie = "useId", Xt(), qg();
        },
        unstable_isNewReconciler: he
      }, rx = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", _e(), Qg(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", _e(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", _e(), mm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", _e(), Yg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", _e(), Ig(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", _e(), $g(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", _e();
          var a = Pe.current;
          Pe.current = Gl;
          try {
            return Wg(e, t);
          } finally {
            Pe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", _e();
          var i = Pe.current;
          Pe.current = Gl;
          try {
            return zg(e, t, a);
          } finally {
            Pe.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", _e(), Bg(e);
        },
        useState: function(e) {
          ie = "useState", _e();
          var t = Pe.current;
          Pe.current = Gl;
          try {
            return pm(e);
          } finally {
            Pe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", _e(), void 0;
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", _e(), Gg(e);
        },
        useTransition: function() {
          return ie = "useTransition", _e(), Kg();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", _e(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", _e(), Pg(e, t, a);
        },
        useId: function() {
          return ie = "useId", _e(), qg();
        },
        unstable_isNewReconciler: he
      }, ax = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", _e(), Cm(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", _e(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", _e(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", _e(), Sm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", _e(), ym(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", _e(), gm(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", _e();
          var a = Pe.current;
          Pe.current = ll;
          try {
            return xm(e, t);
          } finally {
            Pe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", _e();
          var i = Pe.current;
          Pe.current = ll;
          try {
            return Ug(e, t, a);
          } finally {
            Pe.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", _e(), vm();
        },
        useState: function(e) {
          ie = "useState", _e();
          var t = Pe.current;
          Pe.current = ll;
          try {
            return Hg(e);
          } finally {
            Pe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", _e(), Em();
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", _e(), QC(e);
        },
        useTransition: function() {
          return ie = "useTransition", _e(), KC();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", _e(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", _e(), dm(e, t);
        },
        useId: function() {
          return ie = "useId", _e(), bm();
        },
        unstable_isNewReconciler: he
      }, ix = {
        readContext: function(e) {
          return sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", _e(), Cm(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", _e(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", _e(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", _e(), Sm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", _e(), ym(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", _e(), gm(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", _e();
          var a = Pe.current;
          Pe.current = Tm;
          try {
            return xm(e, t);
          } finally {
            Pe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", _e();
          var i = Pe.current;
          Pe.current = Tm;
          try {
            return Fg(e, t, a);
          } finally {
            Pe.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", _e(), vm();
        },
        useState: function(e) {
          ie = "useState", _e();
          var t = Pe.current;
          Pe.current = Tm;
          try {
            return Vg(e);
          } finally {
            Pe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", _e(), Em();
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", _e(), WC(e);
        },
        useTransition: function() {
          return ie = "useTransition", _e(), qC();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", _e(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", _e(), dm(e, t);
        },
        useId: function() {
          return ie = "useId", _e(), bm();
        },
        unstable_isNewReconciler: he
      }, Gl = {
        readContext: function(e) {
          return Xg(), sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", mt(), Xt(), Qg(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", mt(), Xt(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", mt(), Xt(), mm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", mt(), Xt(), Yg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", mt(), Xt(), Ig(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", mt(), Xt(), $g(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", mt(), Xt();
          var a = Pe.current;
          Pe.current = Gl;
          try {
            return Wg(e, t);
          } finally {
            Pe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", mt(), Xt();
          var i = Pe.current;
          Pe.current = Gl;
          try {
            return zg(e, t, a);
          } finally {
            Pe.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", mt(), Xt(), Bg(e);
        },
        useState: function(e) {
          ie = "useState", mt(), Xt();
          var t = Pe.current;
          Pe.current = Gl;
          try {
            return pm(e);
          } finally {
            Pe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", mt(), Xt(), void 0;
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", mt(), Xt(), Gg(e);
        },
        useTransition: function() {
          return ie = "useTransition", mt(), Xt(), Kg();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", mt(), Xt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", mt(), Xt(), Pg(e, t, a);
        },
        useId: function() {
          return ie = "useId", mt(), Xt(), qg();
        },
        unstable_isNewReconciler: he
      }, ll = {
        readContext: function(e) {
          return Xg(), sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", mt(), _e(), Cm(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", mt(), _e(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", mt(), _e(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", mt(), _e(), Sm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", mt(), _e(), ym(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", mt(), _e(), gm(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", mt(), _e();
          var a = Pe.current;
          Pe.current = ll;
          try {
            return xm(e, t);
          } finally {
            Pe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", mt(), _e();
          var i = Pe.current;
          Pe.current = ll;
          try {
            return Ug(e, t, a);
          } finally {
            Pe.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", mt(), _e(), vm();
        },
        useState: function(e) {
          ie = "useState", mt(), _e();
          var t = Pe.current;
          Pe.current = ll;
          try {
            return Hg(e);
          } finally {
            Pe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", mt(), _e(), Em();
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", mt(), _e(), QC(e);
        },
        useTransition: function() {
          return ie = "useTransition", mt(), _e(), KC();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", mt(), _e(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", mt(), _e(), dm(e, t);
        },
        useId: function() {
          return ie = "useId", mt(), _e(), bm();
        },
        unstable_isNewReconciler: he
      }, Tm = {
        readContext: function(e) {
          return Xg(), sr(e);
        },
        useCallback: function(e, t) {
          return ie = "useCallback", mt(), _e(), Cm(e, t);
        },
        useContext: function(e) {
          return ie = "useContext", mt(), _e(), sr(e);
        },
        useEffect: function(e, t) {
          return ie = "useEffect", mt(), _e(), jp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return ie = "useImperativeHandle", mt(), _e(), Sm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return ie = "useInsertionEffect", mt(), _e(), ym(e, t);
        },
        useLayoutEffect: function(e, t) {
          return ie = "useLayoutEffect", mt(), _e(), gm(e, t);
        },
        useMemo: function(e, t) {
          ie = "useMemo", mt(), _e();
          var a = Pe.current;
          Pe.current = ll;
          try {
            return xm(e, t);
          } finally {
            Pe.current = a;
          }
        },
        useReducer: function(e, t, a) {
          ie = "useReducer", mt(), _e();
          var i = Pe.current;
          Pe.current = ll;
          try {
            return Fg(e, t, a);
          } finally {
            Pe.current = i;
          }
        },
        useRef: function(e) {
          return ie = "useRef", mt(), _e(), vm();
        },
        useState: function(e) {
          ie = "useState", mt(), _e();
          var t = Pe.current;
          Pe.current = ll;
          try {
            return Vg(e);
          } finally {
            Pe.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return ie = "useDebugValue", mt(), _e(), Em();
        },
        useDeferredValue: function(e) {
          return ie = "useDeferredValue", mt(), _e(), WC(e);
        },
        useTransition: function() {
          return ie = "useTransition", mt(), _e(), qC();
        },
        useMutableSource: function(e, t, a) {
          return ie = "useMutableSource", mt(), _e(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return ie = "useSyncExternalStore", mt(), _e(), dm(e, t);
        },
        useId: function() {
          return ie = "useId", mt(), _e(), bm();
        },
        unstable_isNewReconciler: he
      };
    }
    var Hu = E.unstable_now, lx = 0, Rm = -1, Op = -1, _m = -1, Jg = !1, km = !1;
    function ox() {
      return Jg;
    }
    function vR() {
      km = !0;
    }
    function hR() {
      Jg = !1, km = !1;
    }
    function mR() {
      Jg = km, km = !1;
    }
    function ux() {
      return lx;
    }
    function sx() {
      lx = Hu();
    }
    function Zg(e) {
      Op = Hu(), e.actualStartTime < 0 && (e.actualStartTime = Hu());
    }
    function cx(e) {
      Op = -1;
    }
    function Dm(e, t) {
      if (Op >= 0) {
        var a = Hu() - Op;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Op = -1;
      }
    }
    function Kl(e) {
      if (Rm >= 0) {
        var t = Hu() - Rm;
        Rm = -1;
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
    function eS(e) {
      if (_m >= 0) {
        var t = Hu() - _m;
        _m = -1;
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
      Rm = Hu();
    }
    function tS() {
      _m = Hu();
    }
    function nS(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ol(e, t) {
      if (e && e.defaultProps) {
        var a = Tt({}, t), i = e.defaultProps;
        for (var o in i)
          a[o] === void 0 && (a[o] = i[o]);
        return a;
      }
      return t;
    }
    var rS = {}, aS, iS, lS, oS, uS, fx, Nm, sS, cS, fS, Lp;
    {
      aS = /* @__PURE__ */ new Set(), iS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), oS = /* @__PURE__ */ new Set(), sS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), cS = /* @__PURE__ */ new Set(), fS = /* @__PURE__ */ new Set(), Lp = /* @__PURE__ */ new Set();
      var dx = /* @__PURE__ */ new Set();
      Nm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          dx.has(a) || (dx.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, fx = function(e, t) {
        if (t === void 0) {
          var a = Pt(e) || "Component";
          uS.has(a) || (uS.add(a), g("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(rS, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(rS);
    }
    function dS(e, t, a, i) {
      var o = e.memoizedState, s = a(i, o);
      {
        if (e.mode & an) {
          kn(!0);
          try {
            s = a(i, o);
          } finally {
            kn(!1);
          }
        }
        fx(t, s);
      }
      var f = s == null ? o : Tt({}, o, s);
      if (e.memoizedState = f, e.lanes === de) {
        var v = e.updateQueue;
        v.baseState = f;
      }
    }
    var pS = {
      isMounted: Uv,
      enqueueSetState: function(e, t, a) {
        var i = hu(e), o = wa(), s = $u(i), f = Io(o, s);
        f.payload = t, a != null && (Nm(a, "setState"), f.callback = a);
        var v = zu(i, f, s);
        v !== null && (Tr(v, i, s, o), im(v, i, s)), ms(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = hu(e), o = wa(), s = $u(i), f = Io(o, s);
        f.tag = DC, f.payload = t, a != null && (Nm(a, "replaceState"), f.callback = a);
        var v = zu(i, f, s);
        v !== null && (Tr(v, i, s, o), im(v, i, s)), ms(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = hu(e), i = wa(), o = $u(a), s = Io(i, o);
        s.tag = nm, t != null && (Nm(t, "forceUpdate"), s.callback = t);
        var f = zu(a, s, o);
        f !== null && (Tr(f, a, o, i), im(f, a, o)), Ac(a, o);
      }
    };
    function px(e, t, a, i, o, s, f) {
      var v = e.stateNode;
      if (typeof v.shouldComponentUpdate == "function") {
        var h = v.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & an) {
            kn(!0);
            try {
              h = v.shouldComponentUpdate(i, s, f);
            } finally {
              kn(!1);
            }
          }
          h === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Pt(t) || "Component");
        }
        return h;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Qe(a, i) || !Qe(o, s) : !0;
    }
    function yR(e, t, a) {
      var i = e.stateNode;
      {
        var o = Pt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", o) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", o)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", o), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", o), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", o), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", o), t.childContextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & an) === rt && (Lp.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), t.contextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & an) === rt && (Lp.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", o), t.contextType && t.contextTypes && !cS.has(t) && (cS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", o)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", o), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Pt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", o), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", o), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", o), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", o);
        var f = i.props !== a;
        i.props !== void 0 && f && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", o, o), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", o, o), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !lS.has(t) && (lS.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Pt(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", o);
        var v = i.state;
        v && (typeof v != "object" || _t(v)) && g("%s.state: must be set to an object or null", o), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", o);
      }
    }
    function vx(e, t) {
      t.updater = pS, e.stateNode = t, yo(t, e), t._reactInternalInstance = rS;
    }
    function hx(e, t, a) {
      var i = !1, o = si, s = si, f = t.contextType;
      if ("contextType" in t) {
        var v = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === _ && f._context === void 0
        );
        if (!v && !fS.has(t)) {
          fS.add(t);
          var h = "";
          f === void 0 ? h = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? h = " However, it is set to a " + typeof f + "." : f.$$typeof === vi ? h = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? h = " Did you accidentally pass the Context.Consumer instead?" : h = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Pt(t) || "Component", h);
        }
      }
      if (typeof f == "object" && f !== null)
        s = sr(f);
      else {
        o = Tf(e, t, !0);
        var S = t.contextTypes;
        i = S != null, s = i ? Rf(e, o) : si;
      }
      var C = new t(a, s);
      if (e.mode & an) {
        kn(!0);
        try {
          C = new t(a, s);
        } finally {
          kn(!1);
        }
      }
      var O = e.memoizedState = C.state !== null && C.state !== void 0 ? C.state : null;
      vx(e, C);
      {
        if (typeof t.getDerivedStateFromProps == "function" && O === null) {
          var N = Pt(t) || "Component";
          iS.has(N) || (iS.add(N), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", N, C.state === null ? "null" : "undefined", N));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof C.getSnapshotBeforeUpdate == "function") {
          var I = null, Q = null, J = null;
          if (typeof C.componentWillMount == "function" && C.componentWillMount.__suppressDeprecationWarning !== !0 ? I = "componentWillMount" : typeof C.UNSAFE_componentWillMount == "function" && (I = "UNSAFE_componentWillMount"), typeof C.componentWillReceiveProps == "function" && C.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? Q = "componentWillReceiveProps" : typeof C.UNSAFE_componentWillReceiveProps == "function" && (Q = "UNSAFE_componentWillReceiveProps"), typeof C.componentWillUpdate == "function" && C.componentWillUpdate.__suppressDeprecationWarning !== !0 ? J = "componentWillUpdate" : typeof C.UNSAFE_componentWillUpdate == "function" && (J = "UNSAFE_componentWillUpdate"), I !== null || Q !== null || J !== null) {
            var Ae = Pt(t) || "Component", it = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            oS.has(Ae) || (oS.add(Ae), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, Ae, it, I !== null ? `
  ` + I : "", Q !== null ? `
  ` + Q : "", J !== null ? `
  ` + J : ""));
          }
        }
      }
      return i && aC(e, o, s), C;
    }
    function gR(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", pt(e) || "Component"), pS.enqueueReplaceState(t, t.state, null));
    }
    function mx(e, t, a, i) {
      var o = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== o) {
        {
          var s = pt(e) || "Component";
          aS.has(s) || (aS.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        pS.enqueueReplaceState(t, t.state, null);
      }
    }
    function vS(e, t, a, i) {
      yR(e, t, a);
      var o = e.stateNode;
      o.props = a, o.state = e.memoizedState, o.refs = {}, bg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        o.context = sr(s);
      else {
        var f = Tf(e, t, !0);
        o.context = Rf(e, f);
      }
      {
        if (o.state === a) {
          var v = Pt(t) || "Component";
          sS.has(v) || (sS.add(v), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", v));
        }
        e.mode & an && al.recordLegacyContextWarning(e, o), al.recordUnsafeLifecycleWarnings(e, o);
      }
      o.state = e.memoizedState;
      var h = t.getDerivedStateFromProps;
      if (typeof h == "function" && (dS(e, t, h, a), o.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof o.getSnapshotBeforeUpdate != "function" && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (gR(e, o), lm(e, a, o, i), o.state = e.memoizedState), typeof o.componentDidMount == "function") {
        var S = At;
        S |= Wi, (e.mode & Yt) !== rt && (S |= kl), e.flags |= S;
      }
    }
    function SR(e, t, a, i) {
      var o = e.stateNode, s = e.memoizedProps;
      o.props = s;
      var f = o.context, v = t.contextType, h = si;
      if (typeof v == "object" && v !== null)
        h = sr(v);
      else {
        var S = Tf(e, t, !0);
        h = Rf(e, S);
      }
      var C = t.getDerivedStateFromProps, O = typeof C == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      !O && (typeof o.UNSAFE_componentWillReceiveProps == "function" || typeof o.componentWillReceiveProps == "function") && (s !== a || f !== h) && mx(e, o, a, h), jC();
      var N = e.memoizedState, I = o.state = N;
      if (lm(e, a, o, i), I = e.memoizedState, s === a && N === I && !Vh() && !om()) {
        if (typeof o.componentDidMount == "function") {
          var Q = At;
          Q |= Wi, (e.mode & Yt) !== rt && (Q |= kl), e.flags |= Q;
        }
        return !1;
      }
      typeof C == "function" && (dS(e, t, C, a), I = e.memoizedState);
      var J = om() || px(e, t, s, a, N, I, h);
      if (J) {
        if (!O && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function") {
          var Ae = At;
          Ae |= Wi, (e.mode & Yt) !== rt && (Ae |= kl), e.flags |= Ae;
        }
      } else {
        if (typeof o.componentDidMount == "function") {
          var it = At;
          it |= Wi, (e.mode & Yt) !== rt && (it |= kl), e.flags |= it;
        }
        e.memoizedProps = a, e.memoizedState = I;
      }
      return o.props = a, o.state = I, o.context = h, J;
    }
    function ER(e, t, a, i, o) {
      var s = t.stateNode;
      NC(e, t);
      var f = t.memoizedProps, v = t.type === t.elementType ? f : ol(t.type, f);
      s.props = v;
      var h = t.pendingProps, S = s.context, C = a.contextType, O = si;
      if (typeof C == "object" && C !== null)
        O = sr(C);
      else {
        var N = Tf(t, a, !0);
        O = Rf(t, N);
      }
      var I = a.getDerivedStateFromProps, Q = typeof I == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !Q && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== h || S !== O) && mx(t, s, i, O), jC();
      var J = t.memoizedState, Ae = s.state = J;
      if (lm(t, i, s, o), Ae = t.memoizedState, f === h && J === Ae && !Vh() && !om() && !He)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || J !== e.memoizedState) && (t.flags |= At), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || J !== e.memoizedState) && (t.flags |= Zn), !1;
      typeof I == "function" && (dS(t, a, I, i), Ae = t.memoizedState);
      var it = om() || px(t, a, v, i, J, Ae, O) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      He;
      return it ? (!Q && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, Ae, O), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, Ae, O)), typeof s.componentDidUpdate == "function" && (t.flags |= At), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Zn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || J !== e.memoizedState) && (t.flags |= At), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || J !== e.memoizedState) && (t.flags |= Zn), t.memoizedProps = i, t.memoizedState = Ae), s.props = i, s.state = Ae, s.context = O, it;
    }
    function tc(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function hS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function CR(e, t) {
      return !0;
    }
    function mS(e, t) {
      try {
        var a = CR(e, t);
        if (a === !1)
          return;
        var i = t.value, o = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === z)
            return;
          console.error(i);
        }
        var v = o ? pt(o) : null, h = v ? "The above error occurred in the <" + v + "> component:" : "The above error occurred in one of your React components:", S;
        if (e.tag === P)
          S = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var C = pt(e) || "Anonymous";
          S = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + C + ".");
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
    var xR = typeof WeakMap == "function" ? WeakMap : Map;
    function yx(e, t, a) {
      var i = Io(un, a);
      i.tag = Cg, i.payload = {
        element: null
      };
      var o = t.value;
      return i.callback = function() {
        vk(o), mS(e, t);
      }, i;
    }
    function yS(e, t, a) {
      var i = Io(un, a);
      i.tag = Cg;
      var o = e.type.getDerivedStateFromError;
      if (typeof o == "function") {
        var s = t.value;
        i.payload = function() {
          return o(s);
        }, i.callback = function() {
          kb(e), mS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        kb(e), mS(e, t), typeof o != "function" && dk(this);
        var h = t.value, S = t.stack;
        this.componentDidCatch(h, {
          componentStack: S !== null ? S : ""
        }), typeof o != "function" && (ia(e.lanes, st) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", pt(e) || "Unknown"));
      }), i;
    }
    function gx(e, t, a) {
      var i = e.pingCache, o;
      if (i === null ? (i = e.pingCache = new xR(), o = /* @__PURE__ */ new Set(), i.set(t, o)) : (o = i.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), i.set(t, o))), !o.has(a)) {
        o.add(a);
        var s = hk.bind(null, e, t, a);
        ra && qp(e, a), t.then(s, s);
      }
    }
    function bR(e, t, a, i) {
      var o = e.updateQueue;
      if (o === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        o.add(a);
    }
    function wR(e, t) {
      var a = e.tag;
      if ((e.mode & Dt) === rt && (a === L || a === Ee || a === A)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function Sx(e) {
      var t = e;
      do {
        if (t.tag === le && aR(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function Ex(e, t, a, i, o) {
      if ((e.mode & Dt) === rt) {
        if (e === t)
          e.flags |= ir;
        else {
          if (e.flags |= et, a.flags |= _c, a.flags &= -52805, a.tag === z) {
            var s = a.alternate;
            if (s === null)
              a.tag = ue;
            else {
              var f = Io(un, st);
              f.tag = nm, zu(a, f, st);
            }
          }
          a.lanes = xt(a.lanes, st);
        }
        return e;
      }
      return e.flags |= ir, e.lanes = o, e;
    }
    function TR(e, t, a, i, o) {
      if (a.flags |= cs, ra && qp(e, o), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        wR(a), Ir() && a.mode & Dt && fC();
        var f = Sx(t);
        if (f !== null) {
          f.flags &= ~kr, Ex(f, t, a, e, o), f.mode & Dt && gx(e, s, o), bR(f, e, s);
          return;
        } else {
          if (!Yv(o)) {
            gx(e, s, o), qS();
            return;
          }
          var v = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = v;
        }
      } else if (Ir() && a.mode & Dt) {
        fC();
        var h = Sx(t);
        if (h !== null) {
          (h.flags & ir) === nt && (h.flags |= kr), Ex(h, t, a, e, o), sg(tc(i, a));
          return;
        }
      }
      i = tc(i, a), ak(i);
      var S = t;
      do {
        switch (S.tag) {
          case P: {
            var C = i;
            S.flags |= ir;
            var O = Ts(o);
            S.lanes = xt(S.lanes, O);
            var N = yx(S, C, O);
            wg(S, N);
            return;
          }
          case z:
            var I = i, Q = S.type, J = S.stateNode;
            if ((S.flags & et) === nt && (typeof Q.getDerivedStateFromError == "function" || J !== null && typeof J.componentDidCatch == "function" && !Sb(J))) {
              S.flags |= ir;
              var Ae = Ts(o);
              S.lanes = xt(S.lanes, Ae);
              var it = yS(S, I, Ae);
              wg(S, it);
              return;
            }
            break;
        }
        S = S.return;
      } while (S !== null);
    }
    function RR() {
      return null;
    }
    var Mp = b.ReactCurrentOwner, ul = !1, gS, Ap, SS, ES, CS, nc, xS, jm, zp;
    gS = {}, Ap = {}, SS = {}, ES = {}, CS = {}, nc = !1, xS = {}, jm = {}, zp = {};
    function xa(e, t, a, i) {
      e === null ? t.child = bC(t, null, a, i) : t.child = Nf(t, e.child, a, i);
    }
    function _R(e, t, a, i) {
      t.child = Nf(t, e.child, null, i), t.child = Nf(t, null, a, i);
    }
    function Cx(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          Pt(a)
        );
      }
      var f = a.render, v = t.ref, h, S;
      Of(t, o), ga(t);
      {
        if (Mp.current = t, Jn(!0), h = Ff(e, t, f, i, v, o), S = Pf(), t.mode & an) {
          kn(!0);
          try {
            h = Ff(e, t, f, i, v, o), S = Pf();
          } finally {
            kn(!1);
          }
        }
        Jn(!1);
      }
      return Sa(), e !== null && !ul ? (UC(e, t, o), $o(e, t, o)) : (Ir() && S && rg(t), t.flags |= ai, xa(e, t, h, o), t.child);
    }
    function xx(e, t, a, i, o) {
      if (e === null) {
        var s = a.type;
        if (Ok(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Wf(s), t.tag = A, t.type = f, TS(t, s), bx(e, t, f, i, o);
        }
        {
          var v = s.propTypes;
          if (v && nl(
            v,
            i,
            // Resolved props
            "prop",
            Pt(s)
          ), a.defaultProps !== void 0) {
            var h = Pt(s) || "Unknown";
            zp[h] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", h), zp[h] = !0);
          }
        }
        var S = oE(a.type, null, i, t, t.mode, o);
        return S.ref = t.ref, S.return = t, t.child = S, S;
      }
      {
        var C = a.type, O = C.propTypes;
        O && nl(
          O,
          i,
          // Resolved props
          "prop",
          Pt(C)
        );
      }
      var N = e.child, I = jS(e, o);
      if (!I) {
        var Q = N.memoizedProps, J = a.compare;
        if (J = J !== null ? J : Qe, J(Q, i) && e.ref === t.ref)
          return $o(e, t, o);
      }
      t.flags |= ai;
      var Ae = oc(N, i);
      return Ae.ref = t.ref, Ae.return = t, t.child = Ae, Ae;
    }
    function bx(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === ht) {
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
            Pt(s)
          );
        }
      }
      if (e !== null) {
        var C = e.memoizedProps;
        if (Qe(C, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ul = !1, t.pendingProps = i = C, jS(e, o))
            (e.flags & _c) !== nt && (ul = !0);
          else return t.lanes = e.lanes, $o(e, t, o);
      }
      return bS(e, t, a, i, o);
    }
    function wx(e, t, a) {
      var i = t.pendingProps, o = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || Re)
        if ((t.mode & Dt) === rt) {
          var f = {
            baseLanes: de,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, $m(t, a);
        } else if (ia(a, aa)) {
          var O = {
            baseLanes: de,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = O;
          var N = s !== null ? s.baseLanes : a;
          $m(t, N);
        } else {
          var v = null, h;
          if (s !== null) {
            var S = s.baseLanes;
            h = xt(S, a);
          } else
            h = a;
          t.lanes = t.childLanes = aa;
          var C = {
            baseLanes: h,
            cachePool: v,
            transitions: null
          };
          return t.memoizedState = C, t.updateQueue = null, $m(t, h), null;
        }
      else {
        var I;
        s !== null ? (I = xt(s.baseLanes, a), t.memoizedState = null) : I = a, $m(t, I);
      }
      return xa(e, t, o, a), t.child;
    }
    function kR(e, t, a) {
      var i = t.pendingProps;
      return xa(e, t, i, a), t.child;
    }
    function DR(e, t, a) {
      var i = t.pendingProps.children;
      return xa(e, t, i, a), t.child;
    }
    function NR(e, t, a) {
      {
        t.flags |= At;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var o = t.pendingProps, s = o.children;
      return xa(e, t, s, a), t.child;
    }
    function Tx(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Ln, t.flags |= yu);
    }
    function bS(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          Pt(a)
        );
      }
      var f;
      {
        var v = Tf(t, a, !0);
        f = Rf(t, v);
      }
      var h, S;
      Of(t, o), ga(t);
      {
        if (Mp.current = t, Jn(!0), h = Ff(e, t, a, i, f, o), S = Pf(), t.mode & an) {
          kn(!0);
          try {
            h = Ff(e, t, a, i, f, o), S = Pf();
          } finally {
            kn(!1);
          }
        }
        Jn(!1);
      }
      return Sa(), e !== null && !ul ? (UC(e, t, o), $o(e, t, o)) : (Ir() && S && rg(t), t.flags |= ai, xa(e, t, h, o), t.child);
    }
    function Rx(e, t, a, i, o) {
      {
        switch (Wk(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, v = new f(t.memoizedProps, s.context), h = v.state;
            s.updater.enqueueSetState(s, h, null);
            break;
          }
          case !0: {
            t.flags |= et, t.flags |= ir;
            var S = new Error("Simulated error coming from DevTools"), C = Ts(o);
            t.lanes = xt(t.lanes, C);
            var O = yS(t, tc(S, t), C);
            wg(t, O);
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
            Pt(a)
          );
        }
      }
      var I;
      Yl(a) ? (I = !0, Ih(t)) : I = !1, Of(t, o);
      var Q = t.stateNode, J;
      Q === null ? (Lm(e, t), hx(t, a, i), vS(t, a, i, o), J = !0) : e === null ? J = SR(t, a, i, o) : J = ER(e, t, a, i, o);
      var Ae = wS(e, t, a, J, I, o);
      {
        var it = t.stateNode;
        J && it.props !== i && (nc || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", pt(t) || "a component"), nc = !0);
      }
      return Ae;
    }
    function wS(e, t, a, i, o, s) {
      Tx(e, t);
      var f = (t.flags & et) !== nt;
      if (!i && !f)
        return o && oC(t, a, !1), $o(e, t, s);
      var v = t.stateNode;
      Mp.current = t;
      var h;
      if (f && typeof a.getDerivedStateFromError != "function")
        h = null, cx();
      else {
        ga(t);
        {
          if (Jn(!0), h = v.render(), t.mode & an) {
            kn(!0);
            try {
              v.render();
            } finally {
              kn(!1);
            }
          }
          Jn(!1);
        }
        Sa();
      }
      return t.flags |= ai, e !== null && f ? _R(e, t, h, s) : xa(e, t, h, s), t.memoizedState = v.state, o && oC(t, a, !0), t.child;
    }
    function _x(e) {
      var t = e.stateNode;
      t.pendingContext ? iC(e, t.pendingContext, t.pendingContext !== t.context) : t.context && iC(e, t.context, !1), Tg(e, t.containerInfo);
    }
    function jR(e, t, a) {
      if (_x(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, o = t.memoizedState, s = o.element;
      NC(e, t), lm(t, i, null, a);
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
          var C = tc(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return kx(e, t, v, a, C);
        } else if (v !== s) {
          var O = tc(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return kx(e, t, v, a, O);
        } else {
          MT(t);
          var N = bC(t, null, v, a);
          t.child = N;
          for (var I = N; I; )
            I.flags = I.flags & ~_n | ea, I = I.sibling;
        }
      } else {
        if (Df(), v === s)
          return $o(e, t, a);
        xa(e, t, v, a);
      }
      return t.child;
    }
    function kx(e, t, a, i, o) {
      return Df(), sg(o), t.flags |= kr, xa(e, t, a, i), t.child;
    }
    function OR(e, t, a) {
      MC(t), e === null && ug(t);
      var i = t.type, o = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = o.children, v = Iy(i, o);
      return v ? f = null : s !== null && Iy(i, s) && (t.flags |= Ma), Tx(e, t), xa(e, t, f, a), t.child;
    }
    function LR(e, t) {
      return e === null && ug(t), null;
    }
    function MR(e, t, a, i) {
      Lm(e, t);
      var o = t.pendingProps, s = a, f = s._payload, v = s._init, h = v(f);
      t.type = h;
      var S = t.tag = Lk(h), C = ol(h, o), O;
      switch (S) {
        case L:
          return TS(t, h), t.type = h = Wf(h), O = bS(null, t, h, C, i), O;
        case z:
          return t.type = h = tE(h), O = Rx(null, t, h, C, i), O;
        case Ee:
          return t.type = h = nE(h), O = Cx(null, t, h, C, i), O;
        case se: {
          if (t.type !== t.elementType) {
            var N = h.propTypes;
            N && nl(
              N,
              C,
              // Resolved for outer only
              "prop",
              Pt(h)
            );
          }
          return O = xx(
            null,
            t,
            h,
            ol(h.type, C),
            // The inner type can have defaults too
            i
          ), O;
        }
      }
      var I = "";
      throw h !== null && typeof h == "object" && h.$$typeof === ht && (I = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + h + ". " + ("Lazy element type must resolve to a class or function." + I));
    }
    function AR(e, t, a, i, o) {
      Lm(e, t), t.tag = z;
      var s;
      return Yl(a) ? (s = !0, Ih(t)) : s = !1, Of(t, o), hx(t, a, i), vS(t, a, i, o), wS(null, t, a, !0, s, o);
    }
    function zR(e, t, a, i) {
      Lm(e, t);
      var o = t.pendingProps, s;
      {
        var f = Tf(t, a, !1);
        s = Rf(t, f);
      }
      Of(t, i);
      var v, h;
      ga(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var S = Pt(a) || "Unknown";
          gS[S] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", S, S), gS[S] = !0);
        }
        t.mode & an && al.recordLegacyContextWarning(t, null), Jn(!0), Mp.current = t, v = Ff(null, t, a, o, s, i), h = Pf(), Jn(!1);
      }
      if (Sa(), t.flags |= ai, typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0) {
        var C = Pt(a) || "Unknown";
        Ap[C] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", C, C, C), Ap[C] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0
      ) {
        {
          var O = Pt(a) || "Unknown";
          Ap[O] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", O, O, O), Ap[O] = !0);
        }
        t.tag = z, t.memoizedState = null, t.updateQueue = null;
        var N = !1;
        return Yl(a) ? (N = !0, Ih(t)) : N = !1, t.memoizedState = v.state !== null && v.state !== void 0 ? v.state : null, bg(t), vx(t, v), vS(t, a, o, i), wS(null, t, a, !0, N, i);
      } else {
        if (t.tag = L, t.mode & an) {
          kn(!0);
          try {
            v = Ff(null, t, a, o, s, i), h = Pf();
          } finally {
            kn(!1);
          }
        }
        return Ir() && h && rg(t), xa(null, t, v, i), TS(t, a), t.child;
      }
    }
    function TS(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = zr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var o = i || "", s = e._debugSource;
          s && (o = s.fileName + ":" + s.lineNumber), CS[o] || (CS[o] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = Pt(t) || "Unknown";
          zp[f] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), zp[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var v = Pt(t) || "Unknown";
          ES[v] || (g("%s: Function components do not support getDerivedStateFromProps.", v), ES[v] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var h = Pt(t) || "Unknown";
          SS[h] || (g("%s: Function components do not support contextType.", h), SS[h] = !0);
        }
      }
    }
    var RS = {
      dehydrated: null,
      treeContext: null,
      retryLane: Vt
    };
    function _S(e) {
      return {
        baseLanes: e,
        cachePool: RR(),
        transitions: null
      };
    }
    function UR(e, t) {
      var a = null;
      return {
        baseLanes: xt(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function FR(e, t, a, i) {
      if (t !== null) {
        var o = t.memoizedState;
        if (o === null)
          return !1;
      }
      return kg(e, Tp);
    }
    function PR(e, t) {
      return Rs(e.childLanes, t);
    }
    function Dx(e, t, a) {
      var i = t.pendingProps;
      Gk(t) && (t.flags |= et);
      var o = il.current, s = !1, f = (t.flags & et) !== nt;
      if (f || FR(o, e) ? (s = !0, t.flags &= ~et) : (e === null || e.memoizedState !== null) && (o = rR(o, zC)), o = Mf(o), Fu(t, o), e === null) {
        ug(t);
        var v = t.memoizedState;
        if (v !== null) {
          var h = v.dehydrated;
          if (h !== null)
            return $R(t, h);
        }
        var S = i.children, C = i.fallback;
        if (s) {
          var O = HR(t, S, C, a), N = t.child;
          return N.memoizedState = _S(a), t.memoizedState = RS, O;
        } else
          return kS(t, S);
      } else {
        var I = e.memoizedState;
        if (I !== null) {
          var Q = I.dehydrated;
          if (Q !== null)
            return YR(e, t, f, i, Q, I, a);
        }
        if (s) {
          var J = i.fallback, Ae = i.children, it = BR(e, t, Ae, J, a), Ze = t.child, Ft = e.child.memoizedState;
          return Ze.memoizedState = Ft === null ? _S(a) : UR(Ft, a), Ze.childLanes = PR(e, a), t.memoizedState = RS, it;
        } else {
          var Ot = i.children, H = VR(e, t, Ot, a);
          return t.memoizedState = null, H;
        }
      }
    }
    function kS(e, t, a) {
      var i = e.mode, o = {
        mode: "visible",
        children: t
      }, s = DS(o, i);
      return s.return = e, e.child = s, s;
    }
    function HR(e, t, a, i) {
      var o = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, v, h;
      return (o & Dt) === rt && s !== null ? (v = s, v.childLanes = de, v.pendingProps = f, e.mode & $t && (v.actualDuration = 0, v.actualStartTime = -1, v.selfBaseDuration = 0, v.treeBaseDuration = 0), h = Qu(a, o, i, null)) : (v = DS(f, o), h = Qu(a, o, i, null)), v.return = e, h.return = e, v.sibling = h, e.child = v, h;
    }
    function DS(e, t, a) {
      return Nb(e, t, de, null);
    }
    function Nx(e, t) {
      return oc(e, t);
    }
    function VR(e, t, a, i) {
      var o = e.child, s = o.sibling, f = Nx(o, {
        mode: "visible",
        children: a
      });
      if ((t.mode & Dt) === rt && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var v = t.deletions;
        v === null ? (t.deletions = [s], t.flags |= La) : v.push(s);
      }
      return t.child = f, f;
    }
    function BR(e, t, a, i, o) {
      var s = t.mode, f = e.child, v = f.sibling, h = {
        mode: "hidden",
        children: a
      }, S;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & Dt) === rt && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var C = t.child;
        S = C, S.childLanes = de, S.pendingProps = h, t.mode & $t && (S.actualDuration = 0, S.actualStartTime = -1, S.selfBaseDuration = f.selfBaseDuration, S.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        S = Nx(f, h), S.subtreeFlags = f.subtreeFlags & $n;
      var O;
      return v !== null ? O = oc(v, i) : (O = Qu(i, s, o, null), O.flags |= _n), O.return = t, S.return = t, S.sibling = O, t.child = S, O;
    }
    function Om(e, t, a, i) {
      i !== null && sg(i), Nf(t, e.child, null, a);
      var o = t.pendingProps, s = o.children, f = kS(t, s);
      return f.flags |= _n, t.memoizedState = null, f;
    }
    function IR(e, t, a, i, o) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, v = DS(f, s), h = Qu(i, s, o, null);
      return h.flags |= _n, v.return = t, h.return = t, v.sibling = h, t.child = v, (t.mode & Dt) !== rt && Nf(t, e.child, null, o), h;
    }
    function $R(e, t, a) {
      return (e.mode & Dt) === rt ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = st) : Wy(t) ? e.lanes = Dr : e.lanes = aa, null;
    }
    function YR(e, t, a, i, o, s, f) {
      if (a)
        if (t.flags & kr) {
          t.flags &= ~kr;
          var H = hS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Om(e, t, f, H);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= et, null;
          var Z = i.children, V = i.fallback, xe = IR(e, t, Z, V, f), Ve = t.child;
          return Ve.memoizedState = _S(f), t.memoizedState = RS, xe;
        }
      else {
        if (OT(), (t.mode & Dt) === rt)
          return Om(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Wy(o)) {
          var v, h, S;
          {
            var C = Kw(o);
            v = C.digest, h = C.message, S = C.stack;
          }
          var O;
          h ? O = new Error(h) : O = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var N = hS(O, v, S);
          return Om(e, t, f, N);
        }
        var I = ia(f, e.childLanes);
        if (ul || I) {
          var Q = Im();
          if (Q !== null) {
            var J = Pd(Q, f);
            if (J !== Vt && J !== s.retryLane) {
              s.retryLane = J;
              var Ae = un;
              Ia(e, J), Tr(Q, e, J, Ae);
            }
          }
          qS();
          var it = hS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Om(e, t, f, it);
        } else if (ZE(o)) {
          t.flags |= et, t.child = e.child;
          var Ze = mk.bind(null, e);
          return qw(o, Ze), null;
        } else {
          AT(t, o, s.treeContext);
          var Ft = i.children, Ot = kS(t, Ft);
          return Ot.flags |= ea, Ot;
        }
      }
    }
    function jx(e, t, a) {
      e.lanes = xt(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = xt(i.lanes, t)), Sg(e.return, t, a);
    }
    function QR(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === le) {
          var o = i.memoizedState;
          o !== null && jx(i, a, e);
        } else if (i.tag === De)
          jx(i, a, e);
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
    function WR(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && cm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function GR(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !xS[e])
        if (xS[e] = !0, typeof e == "string")
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
    function KR(e, t) {
      e !== void 0 && !jm[e] && (e !== "collapsed" && e !== "hidden" ? (jm[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (jm[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function Ox(e, t) {
      {
        var a = _t(e), i = !a && typeof Et(e) == "function";
        if (a || i) {
          var o = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", o, t, o), !1;
        }
      }
      return !0;
    }
    function qR(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (_t(e)) {
          for (var a = 0; a < e.length; a++)
            if (!Ox(e[a], a))
              return;
        } else {
          var i = Et(e);
          if (typeof i == "function") {
            var o = i.call(e);
            if (o)
              for (var s = o.next(), f = 0; !s.done; s = o.next()) {
                if (!Ox(s.value, f))
                  return;
                f++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function NS(e, t, a, i, o) {
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
    function Lx(e, t, a) {
      var i = t.pendingProps, o = i.revealOrder, s = i.tail, f = i.children;
      GR(o), KR(s, o), qR(f, o), xa(e, t, f, a);
      var v = il.current, h = kg(v, Tp);
      if (h)
        v = Dg(v, Tp), t.flags |= et;
      else {
        var S = e !== null && (e.flags & et) !== nt;
        S && QR(t, t.child, a), v = Mf(v);
      }
      if (Fu(t, v), (t.mode & Dt) === rt)
        t.memoizedState = null;
      else
        switch (o) {
          case "forwards": {
            var C = WR(t.child), O;
            C === null ? (O = t.child, t.child = null) : (O = C.sibling, C.sibling = null), NS(
              t,
              !1,
              // isBackwards
              O,
              C,
              s
            );
            break;
          }
          case "backwards": {
            var N = null, I = t.child;
            for (t.child = null; I !== null; ) {
              var Q = I.alternate;
              if (Q !== null && cm(Q) === null) {
                t.child = I;
                break;
              }
              var J = I.sibling;
              I.sibling = N, N = I, I = J;
            }
            NS(
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
            NS(
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
    function XR(e, t, a) {
      Tg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Nf(t, null, i, a) : xa(e, t, i, a), t.child;
    }
    var Mx = !1;
    function JR(e, t, a) {
      var i = t.type, o = i._context, s = t.pendingProps, f = t.memoizedProps, v = s.value;
      {
        "value" in s || Mx || (Mx = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var h = t.type.propTypes;
        h && nl(h, s, "prop", "Context.Provider");
      }
      if (RC(t, o, v), f !== null) {
        var S = f.value;
        if (ye(S, v)) {
          if (f.children === s.children && !Vh())
            return $o(e, t, a);
        } else
          GT(t, o, a);
      }
      var C = s.children;
      return xa(e, t, C, a), t.child;
    }
    var Ax = !1;
    function ZR(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (Ax || (Ax = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var o = t.pendingProps, s = o.children;
      typeof s != "function" && g("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Of(t, a);
      var f = sr(i);
      ga(t);
      var v;
      return Mp.current = t, Jn(!0), v = s(f), Jn(!1), Sa(), t.flags |= ai, xa(e, t, v, a), t.child;
    }
    function Up() {
      ul = !0;
    }
    function Lm(e, t) {
      (t.mode & Dt) === rt && e !== null && (e.alternate = null, t.alternate = null, t.flags |= _n);
    }
    function $o(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), cx(), Kp(t.lanes), ia(a, t.childLanes) ? (QT(e, t), t.child) : null;
    }
    function e_(e, t, a) {
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
        return s === null ? (i.deletions = [e], i.flags |= La) : s.push(e), a.flags |= _n, a;
      }
    }
    function jS(e, t) {
      var a = e.lanes;
      return !!ia(a, t);
    }
    function t_(e, t, a) {
      switch (t.tag) {
        case P:
          _x(t), t.stateNode, Df();
          break;
        case te:
          MC(t);
          break;
        case z: {
          var i = t.type;
          Yl(i) && Ih(t);
          break;
        }
        case W:
          Tg(t, t.stateNode.containerInfo);
          break;
        case oe: {
          var o = t.memoizedProps.value, s = t.type._context;
          RC(t, s, o);
          break;
        }
        case Se:
          {
            var f = ia(a, t.childLanes);
            f && (t.flags |= At);
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
            var S = t.child, C = S.childLanes;
            if (ia(a, C))
              return Dx(e, t, a);
            Fu(t, Mf(il.current));
            var O = $o(e, t, a);
            return O !== null ? O.sibling : null;
          } else
            Fu(t, Mf(il.current));
          break;
        }
        case De: {
          var N = (e.flags & et) !== nt, I = ia(a, t.childLanes);
          if (N) {
            if (I)
              return Lx(e, t, a);
            t.flags |= et;
          }
          var Q = t.memoizedState;
          if (Q !== null && (Q.rendering = null, Q.tail = null, Q.lastEffect = null), Fu(t, il.current), I)
            break;
          return null;
        }
        case re:
        case ze:
          return t.lanes = de, wx(e, t, a);
      }
      return $o(e, t, a);
    }
    function zx(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return e_(e, t, oE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, o = t.pendingProps;
        if (i !== o || Vh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ul = !0;
        else {
          var s = jS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & et) === nt)
            return ul = !1, t_(e, t, a);
          (e.flags & _c) !== nt ? ul = !0 : ul = !1;
        }
      } else if (ul = !1, Ir() && RT(t)) {
        var f = t.index, v = _T();
        cC(t, v, f);
      }
      switch (t.lanes = de, t.tag) {
        case ge:
          return zR(e, t, t.type, a);
        case pe: {
          var h = t.elementType;
          return MR(e, t, h, a);
        }
        case L: {
          var S = t.type, C = t.pendingProps, O = t.elementType === S ? C : ol(S, C);
          return bS(e, t, S, O, a);
        }
        case z: {
          var N = t.type, I = t.pendingProps, Q = t.elementType === N ? I : ol(N, I);
          return Rx(e, t, N, Q, a);
        }
        case P:
          return jR(e, t, a);
        case te:
          return OR(e, t, a);
        case ne:
          return LR(e, t);
        case le:
          return Dx(e, t, a);
        case W:
          return XR(e, t, a);
        case Ee: {
          var J = t.type, Ae = t.pendingProps, it = t.elementType === J ? Ae : ol(J, Ae);
          return Cx(e, t, J, it, a);
        }
        case X:
          return kR(e, t, a);
        case fe:
          return DR(e, t, a);
        case Se:
          return NR(e, t, a);
        case oe:
          return JR(e, t, a);
        case je:
          return ZR(e, t, a);
        case se: {
          var Ze = t.type, Ft = t.pendingProps, Ot = ol(Ze, Ft);
          if (t.type !== t.elementType) {
            var H = Ze.propTypes;
            H && nl(
              H,
              Ot,
              // Resolved for outer only
              "prop",
              Pt(Ze)
            );
          }
          return Ot = ol(Ze.type, Ot), xx(e, t, Ze, Ot, a);
        }
        case A:
          return bx(e, t, t.type, t.pendingProps, a);
        case ue: {
          var Z = t.type, V = t.pendingProps, xe = t.elementType === Z ? V : ol(Z, V);
          return AR(e, t, Z, xe, a);
        }
        case De:
          return Lx(e, t, a);
        case Je:
          break;
        case re:
          return wx(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Hf(e) {
      e.flags |= At;
    }
    function Ux(e) {
      e.flags |= Ln, e.flags |= yu;
    }
    var Fx, OS, Px, Hx;
    Fx = function(e, t, a, i) {
      for (var o = t.child; o !== null; ) {
        if (o.tag === te || o.tag === ne)
          bw(e, o.stateNode);
        else if (o.tag !== W) {
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
    }, OS = function(e, t) {
    }, Px = function(e, t, a, i, o) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, v = Rg(), h = Tw(f, a, s, i, o, v);
        t.updateQueue = h, h && Hf(t);
      }
    }, Hx = function(e, t, a, i) {
      a !== i && Hf(t);
    };
    function Fp(e, t) {
      if (!Ir())
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
    function Yr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = de, i = nt;
      if (t) {
        if ((e.mode & $t) !== rt) {
          for (var h = e.selfBaseDuration, S = e.child; S !== null; )
            a = xt(a, xt(S.lanes, S.childLanes)), i |= S.subtreeFlags & $n, i |= S.flags & $n, h += S.treeBaseDuration, S = S.sibling;
          e.treeBaseDuration = h;
        } else
          for (var C = e.child; C !== null; )
            a = xt(a, xt(C.lanes, C.childLanes)), i |= C.subtreeFlags & $n, i |= C.flags & $n, C.return = e, C = C.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & $t) !== rt) {
          for (var o = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = xt(a, xt(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, o += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = o, e.treeBaseDuration = s;
        } else
          for (var v = e.child; v !== null; )
            a = xt(a, xt(v.lanes, v.childLanes)), i |= v.subtreeFlags, i |= v.flags, v.return = e, v = v.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function n_(e, t, a) {
      if (HT() && (t.mode & Dt) !== rt && (t.flags & et) === nt)
        return yC(t), Df(), t.flags |= kr | cs | ir, !1;
      var i = Gh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (FT(t), Yr(t), (t.mode & $t) !== rt) {
            var o = a !== null;
            if (o) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (Df(), (t.flags & et) === nt && (t.memoizedState = null), t.flags |= At, Yr(t), (t.mode & $t) !== rt) {
            var f = a !== null;
            if (f) {
              var v = t.child;
              v !== null && (t.treeBaseDuration -= v.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return gC(), !0;
    }
    function Vx(e, t, a) {
      var i = t.pendingProps;
      switch (ag(t), t.tag) {
        case ge:
        case pe:
        case A:
        case L:
        case Ee:
        case X:
        case fe:
        case Se:
        case je:
        case se:
          return Yr(t), null;
        case z: {
          var o = t.type;
          return Yl(o) && Bh(t), Yr(t), null;
        }
        case P: {
          var s = t.stateNode;
          if (Lf(t), eg(t), jg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Gh(t);
            if (f)
              Hf(t);
            else if (e !== null) {
              var v = e.memoizedState;
              // Check if this is a client root
              (!v.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & kr) !== nt) && (t.flags |= Zn, gC());
            }
          }
          return OS(e, t), Yr(t), null;
        }
        case te: {
          _g(t);
          var h = LC(), S = t.type;
          if (e !== null && t.stateNode != null)
            Px(e, t, S, i, h), e.ref !== t.ref && Ux(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Yr(t), null;
            }
            var C = Rg(), O = Gh(t);
            if (O)
              zT(t, h, C) && Hf(t);
            else {
              var N = xw(S, i, h, C, t);
              Fx(N, t, !1, !1), t.stateNode = N, ww(N, S, i, h) && Hf(t);
            }
            t.ref !== null && Ux(t);
          }
          return Yr(t), null;
        }
        case ne: {
          var I = i;
          if (e && t.stateNode != null) {
            var Q = e.memoizedProps;
            Hx(e, t, Q, I);
          } else {
            if (typeof I != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var J = LC(), Ae = Rg(), it = Gh(t);
            it ? UT(t) && Hf(t) : t.stateNode = Rw(I, J, Ae, t);
          }
          return Yr(t), null;
        }
        case le: {
          Af(t);
          var Ze = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Ft = n_(e, t, Ze);
            if (!Ft)
              return t.flags & ir ? t : null;
          }
          if ((t.flags & et) !== nt)
            return t.lanes = a, (t.mode & $t) !== rt && nS(t), t;
          var Ot = Ze !== null, H = e !== null && e.memoizedState !== null;
          if (Ot !== H && Ot) {
            var Z = t.child;
            if (Z.flags |= In, (t.mode & Dt) !== rt) {
              var V = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              V || kg(il.current, zC) ? rk() : qS();
            }
          }
          var xe = t.updateQueue;
          if (xe !== null && (t.flags |= At), Yr(t), (t.mode & $t) !== rt && Ot) {
            var Ve = t.child;
            Ve !== null && (t.treeBaseDuration -= Ve.treeBaseDuration);
          }
          return null;
        }
        case W:
          return Lf(t), OS(e, t), e === null && ST(t.stateNode.containerInfo), Yr(t), null;
        case oe:
          var Ue = t.type._context;
          return gg(Ue, t), Yr(t), null;
        case ue: {
          var ct = t.type;
          return Yl(ct) && Bh(t), Yr(t), null;
        }
        case De: {
          Af(t);
          var yt = t.memoizedState;
          if (yt === null)
            return Yr(t), null;
          var on = (t.flags & et) !== nt, Wt = yt.rendering;
          if (Wt === null)
            if (on)
              Fp(yt, !1);
            else {
              var nr = ik() && (e === null || (e.flags & et) === nt);
              if (!nr)
                for (var Gt = t.child; Gt !== null; ) {
                  var qn = cm(Gt);
                  if (qn !== null) {
                    on = !0, t.flags |= et, Fp(yt, !1);
                    var da = qn.updateQueue;
                    return da !== null && (t.updateQueue = da, t.flags |= At), t.subtreeFlags = nt, WT(t, a), Fu(t, Dg(il.current, Tp)), t.child;
                  }
                  Gt = Gt.sibling;
                }
              yt.tail !== null && er() > ub() && (t.flags |= et, on = !0, Fp(yt, !1), t.lanes = Nd);
            }
          else {
            if (!on) {
              var qr = cm(Wt);
              if (qr !== null) {
                t.flags |= et, on = !0;
                var fi = qr.updateQueue;
                if (fi !== null && (t.updateQueue = fi, t.flags |= At), Fp(yt, !0), yt.tail === null && yt.tailMode === "hidden" && !Wt.alternate && !Ir())
                  return Yr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              er() * 2 - yt.renderingStartTime > ub() && a !== aa && (t.flags |= et, on = !0, Fp(yt, !1), t.lanes = Nd);
            }
            if (yt.isBackwards)
              Wt.sibling = t.child, t.child = Wt;
            else {
              var Ta = yt.last;
              Ta !== null ? Ta.sibling = Wt : t.child = Wt, yt.last = Wt;
            }
          }
          if (yt.tail !== null) {
            var Ra = yt.tail;
            yt.rendering = Ra, yt.tail = Ra.sibling, yt.renderingStartTime = er(), Ra.sibling = null;
            var pa = il.current;
            return on ? pa = Dg(pa, Tp) : pa = Mf(pa), Fu(t, pa), Ra;
          }
          return Yr(t), null;
        }
        case Je:
          break;
        case re:
        case ze: {
          KS(t);
          var Ko = t.memoizedState, Gf = Ko !== null;
          if (e !== null) {
            var ev = e.memoizedState, Zl = ev !== null;
            Zl !== Gf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !Re && (t.flags |= In);
          }
          return !Gf || (t.mode & Dt) === rt ? Yr(t) : ia(Jl, aa) && (Yr(t), t.subtreeFlags & (_n | At) && (t.flags |= In)), null;
        }
        case tt:
          return null;
        case dt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function r_(e, t, a) {
      switch (ag(t), t.tag) {
        case z: {
          var i = t.type;
          Yl(i) && Bh(t);
          var o = t.flags;
          return o & ir ? (t.flags = o & ~ir | et, (t.mode & $t) !== rt && nS(t), t) : null;
        }
        case P: {
          t.stateNode, Lf(t), eg(t), jg();
          var s = t.flags;
          return (s & ir) !== nt && (s & et) === nt ? (t.flags = s & ~ir | et, t) : null;
        }
        case te:
          return _g(t), null;
        case le: {
          Af(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            Df();
          }
          var v = t.flags;
          return v & ir ? (t.flags = v & ~ir | et, (t.mode & $t) !== rt && nS(t), t) : null;
        }
        case De:
          return Af(t), null;
        case W:
          return Lf(t), null;
        case oe:
          var h = t.type._context;
          return gg(h, t), null;
        case re:
        case ze:
          return KS(t), null;
        case tt:
          return null;
        default:
          return null;
      }
    }
    function Bx(e, t, a) {
      switch (ag(t), t.tag) {
        case z: {
          var i = t.type.childContextTypes;
          i != null && Bh(t);
          break;
        }
        case P: {
          t.stateNode, Lf(t), eg(t), jg();
          break;
        }
        case te: {
          _g(t);
          break;
        }
        case W:
          Lf(t);
          break;
        case le:
          Af(t);
          break;
        case De:
          Af(t);
          break;
        case oe:
          var o = t.type._context;
          gg(o, t);
          break;
        case re:
        case ze:
          KS(t);
          break;
      }
    }
    var Ix = null;
    Ix = /* @__PURE__ */ new Set();
    var Mm = !1, Qr = !1, a_ = typeof WeakSet == "function" ? WeakSet : Set, We = null, Vf = null, Bf = null;
    function i_(e) {
      _l(null, function() {
        throw e;
      }), ss();
    }
    var l_ = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & $t)
        try {
          ql(), t.componentWillUnmount();
        } finally {
          Kl(e);
        }
      else
        t.componentWillUnmount();
    };
    function $x(e, t) {
      try {
        Vu(Sr, e);
      } catch (a) {
        Sn(e, t, a);
      }
    }
    function LS(e, t, a) {
      try {
        l_(e, a);
      } catch (i) {
        Sn(e, t, i);
      }
    }
    function o_(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        Sn(e, t, i);
      }
    }
    function Yx(e, t) {
      try {
        Wx(e);
      } catch (a) {
        Sn(e, t, a);
      }
    }
    function If(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (Ie && bt && e.mode & $t)
              try {
                ql(), i = a(null);
              } finally {
                Kl(e);
              }
            else
              i = a(null);
          } catch (o) {
            Sn(e, t, o);
          }
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", pt(e));
        } else
          a.current = null;
    }
    function Am(e, t, a) {
      try {
        a();
      } catch (i) {
        Sn(e, t, i);
      }
    }
    var Qx = !1;
    function u_(e, t) {
      Ew(e.containerInfo), We = t, s_();
      var a = Qx;
      return Qx = !1, a;
    }
    function s_() {
      for (; We !== null; ) {
        var e = We, t = e.child;
        (e.subtreeFlags & Dl) !== nt && t !== null ? (t.return = e, We = t) : c_();
      }
    }
    function c_() {
      for (; We !== null; ) {
        var e = We;
        tn(e);
        try {
          f_(e);
        } catch (a) {
          Sn(e, e.return, a);
        }
        gn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, We = t;
          return;
        }
        We = e.return;
      }
    }
    function f_(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Zn) !== nt) {
        switch (tn(e), e.tag) {
          case L:
          case Ee:
          case A:
            break;
          case z: {
            if (t !== null) {
              var i = t.memoizedProps, o = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !nc && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ol(e.type, i), o);
              {
                var v = Ix;
                f === void 0 && !v.has(e.type) && (v.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", pt(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case P: {
            {
              var h = e.stateNode;
              Yw(h.containerInfo);
            }
            break;
          }
          case te:
          case ne:
          case W:
          case ue:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        gn();
      }
    }
    function sl(e, t, a) {
      var i = t.updateQueue, o = i !== null ? i.lastEffect : null;
      if (o !== null) {
        var s = o.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var v = f.destroy;
            f.destroy = void 0, v !== void 0 && ((e & $r) !== $a ? qi(t) : (e & Sr) !== $a && ds(t), (e & Ql) !== $a && Xp(!0), Am(t, a, v), (e & Ql) !== $a && Xp(!1), (e & $r) !== $a ? Ll() : (e & Sr) !== $a && kd());
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
            (e & $r) !== $a ? _d(t) : (e & Sr) !== $a && Lc(t);
            var f = s.create;
            (e & Ql) !== $a && Xp(!0), s.destroy = f(), (e & Ql) !== $a && Xp(!1), (e & $r) !== $a ? Hv() : (e & Sr) !== $a && Vv();
            {
              var v = s.destroy;
              if (v !== void 0 && typeof v != "function") {
                var h = void 0;
                (s.tag & Sr) !== nt ? h = "useLayoutEffect" : (s.tag & Ql) !== nt ? h = "useInsertionEffect" : h = "useEffect";
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
    function d_(e, t) {
      if ((t.flags & At) !== nt)
        switch (t.tag) {
          case Se: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, o = i.id, s = i.onPostCommit, f = ux(), v = t.alternate === null ? "mount" : "update";
            ox() && (v = "nested-update"), typeof s == "function" && s(o, v, a, f);
            var h = t.return;
            e: for (; h !== null; ) {
              switch (h.tag) {
                case P:
                  var S = h.stateNode;
                  S.passiveEffectDuration += a;
                  break e;
                case Se:
                  var C = h.stateNode;
                  C.passiveEffectDuration += a;
                  break e;
              }
              h = h.return;
            }
            break;
          }
        }
    }
    function p_(e, t, a, i) {
      if ((a.flags & jl) !== nt)
        switch (a.tag) {
          case L:
          case Ee:
          case A: {
            if (!Qr)
              if (a.mode & $t)
                try {
                  ql(), Vu(Sr | gr, a);
                } finally {
                  Kl(a);
                }
              else
                Vu(Sr | gr, a);
            break;
          }
          case z: {
            var o = a.stateNode;
            if (a.flags & At && !Qr)
              if (t === null)
                if (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(a) || "instance")), a.mode & $t)
                  try {
                    ql(), o.componentDidMount();
                  } finally {
                    Kl(a);
                  }
                else
                  o.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ol(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(a) || "instance")), a.mode & $t)
                  try {
                    ql(), o.componentDidUpdate(s, f, o.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Kl(a);
                  }
                else
                  o.componentDidUpdate(s, f, o.__reactInternalSnapshotBeforeUpdate);
              }
            var v = a.updateQueue;
            v !== null && (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(a) || "instance")), OC(a, v, o));
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
              OC(a, h, S);
            }
            break;
          }
          case te: {
            var C = a.stateNode;
            if (t === null && a.flags & At) {
              var O = a.type, N = a.memoizedProps;
              jw(C, O, N);
            }
            break;
          }
          case ne:
            break;
          case W:
            break;
          case Se: {
            {
              var I = a.memoizedProps, Q = I.onCommit, J = I.onRender, Ae = a.stateNode.effectDuration, it = ux(), Ze = t === null ? "mount" : "update";
              ox() && (Ze = "nested-update"), typeof J == "function" && J(a.memoizedProps.id, Ze, a.actualDuration, a.treeBaseDuration, a.actualStartTime, it);
              {
                typeof Q == "function" && Q(a.memoizedProps.id, Ze, Ae, it), ck(a);
                var Ft = a.return;
                e: for (; Ft !== null; ) {
                  switch (Ft.tag) {
                    case P:
                      var Ot = Ft.stateNode;
                      Ot.effectDuration += Ae;
                      break e;
                    case Se:
                      var H = Ft.stateNode;
                      H.effectDuration += Ae;
                      break e;
                  }
                  Ft = Ft.return;
                }
              }
            }
            break;
          }
          case le: {
            C_(e, a);
            break;
          }
          case De:
          case ue:
          case Je:
          case re:
          case ze:
          case dt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Qr || a.flags & Ln && Wx(a);
    }
    function v_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case A: {
          if (e.mode & $t)
            try {
              ql(), $x(e, e.return);
            } finally {
              Kl(e);
            }
          else
            $x(e, e.return);
          break;
        }
        case z: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && o_(e, e.return, t), Yx(e, e.return);
          break;
        }
        case te: {
          Yx(e, e.return);
          break;
        }
      }
    }
    function h_(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === te) {
          if (a === null) {
            a = i;
            try {
              var o = i.stateNode;
              t ? Vw(o) : Iw(i.stateNode, i.memoizedProps);
            } catch (f) {
              Sn(e, e.return, f);
            }
          }
        } else if (i.tag === ne) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? Bw(s) : $w(s, i.memoizedProps);
            } catch (f) {
              Sn(e, e.return, f);
            }
        } else if (!((i.tag === re || i.tag === ze) && i.memoizedState !== null && i !== e)) {
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
    function Wx(e) {
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
          if (e.mode & $t)
            try {
              ql(), o = t(i);
            } finally {
              Kl(e);
            }
          else
            o = t(i);
          typeof o == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", pt(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", pt(e)), t.current = i;
      }
    }
    function m_(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function Gx(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, Gx(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === te) {
          var a = e.stateNode;
          a !== null && xT(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function y_(e) {
      for (var t = e.return; t !== null; ) {
        if (Kx(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Kx(e) {
      return e.tag === te || e.tag === P || e.tag === W;
    }
    function qx(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || Kx(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== te && t.tag !== ne && t.tag !== be; ) {
          if (t.flags & _n || t.child === null || t.tag === W)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & _n))
          return t.stateNode;
      }
    }
    function g_(e) {
      var t = y_(e);
      switch (t.tag) {
        case te: {
          var a = t.stateNode;
          t.flags & Ma && (JE(a), t.flags &= ~Ma);
          var i = qx(e);
          AS(e, i, a);
          break;
        }
        case P:
        case W: {
          var o = t.stateNode.containerInfo, s = qx(e);
          MS(e, s, o);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function MS(e, t, a) {
      var i = e.tag, o = i === te || i === ne;
      if (o) {
        var s = e.stateNode;
        t ? Uw(a, s, t) : Aw(a, s);
      } else if (i !== W) {
        var f = e.child;
        if (f !== null) {
          MS(f, t, a);
          for (var v = f.sibling; v !== null; )
            MS(v, t, a), v = v.sibling;
        }
      }
    }
    function AS(e, t, a) {
      var i = e.tag, o = i === te || i === ne;
      if (o) {
        var s = e.stateNode;
        t ? zw(a, s, t) : Mw(a, s);
      } else if (i !== W) {
        var f = e.child;
        if (f !== null) {
          AS(f, t, a);
          for (var v = f.sibling; v !== null; )
            AS(v, t, a), v = v.sibling;
        }
      }
    }
    var Wr = null, cl = !1;
    function S_(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case te: {
              Wr = i.stateNode, cl = !1;
              break e;
            }
            case P: {
              Wr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case W: {
              Wr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Wr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        Xx(e, t, a), Wr = null, cl = !1;
      }
      m_(a);
    }
    function Bu(e, t, a) {
      for (var i = a.child; i !== null; )
        Xx(e, t, i), i = i.sibling;
    }
    function Xx(e, t, a) {
      switch (wd(a), a.tag) {
        case te:
          Qr || If(a, t);
        case ne: {
          {
            var i = Wr, o = cl;
            Wr = null, Bu(e, t, a), Wr = i, cl = o, Wr !== null && (cl ? Pw(Wr, a.stateNode) : Fw(Wr, a.stateNode));
          }
          return;
        }
        case be: {
          Wr !== null && (cl ? Hw(Wr, a.stateNode) : Qy(Wr, a.stateNode));
          return;
        }
        case W: {
          {
            var s = Wr, f = cl;
            Wr = a.stateNode.containerInfo, cl = !0, Bu(e, t, a), Wr = s, cl = f;
          }
          return;
        }
        case L:
        case Ee:
        case se:
        case A: {
          if (!Qr) {
            var v = a.updateQueue;
            if (v !== null) {
              var h = v.lastEffect;
              if (h !== null) {
                var S = h.next, C = S;
                do {
                  var O = C, N = O.destroy, I = O.tag;
                  N !== void 0 && ((I & Ql) !== $a ? Am(a, t, N) : (I & Sr) !== $a && (ds(a), a.mode & $t ? (ql(), Am(a, t, N), Kl(a)) : Am(a, t, N), kd())), C = C.next;
                } while (C !== S);
              }
            }
          }
          Bu(e, t, a);
          return;
        }
        case z: {
          if (!Qr) {
            If(a, t);
            var Q = a.stateNode;
            typeof Q.componentWillUnmount == "function" && LS(a, t, Q);
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
            a.mode & Dt
          ) {
            var J = Qr;
            Qr = J || a.memoizedState !== null, Bu(e, t, a), Qr = J;
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
    function E_(e) {
      e.memoizedState;
    }
    function C_(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var o = i.memoizedState;
          if (o !== null) {
            var s = o.dehydrated;
            s !== null && iT(s);
          }
        }
      }
    }
    function Jx(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new a_()), t.forEach(function(i) {
          var o = yk.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), ra)
              if (Vf !== null && Bf !== null)
                qp(Bf, Vf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(o, o);
          }
        });
      }
    }
    function x_(e, t, a) {
      Vf = a, Bf = e, tn(t), Zx(t, e), tn(t), Vf = null, Bf = null;
    }
    function fl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o];
          try {
            S_(e, t, s);
          } catch (h) {
            Sn(s, t, h);
          }
        }
      var f = El();
      if (t.subtreeFlags & Nl)
        for (var v = t.child; v !== null; )
          tn(v), Zx(v, e), v = v.sibling;
      tn(f);
    }
    function Zx(e, t, a) {
      var i = e.alternate, o = e.flags;
      switch (e.tag) {
        case L:
        case Ee:
        case se:
        case A: {
          if (fl(t, e), Xl(e), o & At) {
            try {
              sl(Ql | gr, e, e.return), Vu(Ql | gr, e);
            } catch (ct) {
              Sn(e, e.return, ct);
            }
            if (e.mode & $t) {
              try {
                ql(), sl(Sr | gr, e, e.return);
              } catch (ct) {
                Sn(e, e.return, ct);
              }
              Kl(e);
            } else
              try {
                sl(Sr | gr, e, e.return);
              } catch (ct) {
                Sn(e, e.return, ct);
              }
          }
          return;
        }
        case z: {
          fl(t, e), Xl(e), o & Ln && i !== null && If(i, i.return);
          return;
        }
        case te: {
          fl(t, e), Xl(e), o & Ln && i !== null && If(i, i.return);
          {
            if (e.flags & Ma) {
              var s = e.stateNode;
              try {
                JE(s);
              } catch (ct) {
                Sn(e, e.return, ct);
              }
            }
            if (o & At) {
              var f = e.stateNode;
              if (f != null) {
                var v = e.memoizedProps, h = i !== null ? i.memoizedProps : v, S = e.type, C = e.updateQueue;
                if (e.updateQueue = null, C !== null)
                  try {
                    Ow(f, C, S, h, v, e);
                  } catch (ct) {
                    Sn(e, e.return, ct);
                  }
              }
            }
          }
          return;
        }
        case ne: {
          if (fl(t, e), Xl(e), o & At) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var O = e.stateNode, N = e.memoizedProps, I = i !== null ? i.memoizedProps : N;
            try {
              Lw(O, I, N);
            } catch (ct) {
              Sn(e, e.return, ct);
            }
          }
          return;
        }
        case P: {
          if (fl(t, e), Xl(e), o & At && i !== null) {
            var Q = i.memoizedState;
            if (Q.isDehydrated)
              try {
                aT(t.containerInfo);
              } catch (ct) {
                Sn(e, e.return, ct);
              }
          }
          return;
        }
        case W: {
          fl(t, e), Xl(e);
          return;
        }
        case le: {
          fl(t, e), Xl(e);
          var J = e.child;
          if (J.flags & In) {
            var Ae = J.stateNode, it = J.memoizedState, Ze = it !== null;
            if (Ae.isHidden = Ze, Ze) {
              var Ft = J.alternate !== null && J.alternate.memoizedState !== null;
              Ft || nk();
            }
          }
          if (o & At) {
            try {
              E_(e);
            } catch (ct) {
              Sn(e, e.return, ct);
            }
            Jx(e);
          }
          return;
        }
        case re: {
          var Ot = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Dt
          ) {
            var H = Qr;
            Qr = H || Ot, fl(t, e), Qr = H;
          } else
            fl(t, e);
          if (Xl(e), o & In) {
            var Z = e.stateNode, V = e.memoizedState, xe = V !== null, Ve = e;
            if (Z.isHidden = xe, xe && !Ot && (Ve.mode & Dt) !== rt) {
              We = Ve;
              for (var Ue = Ve.child; Ue !== null; )
                We = Ue, w_(Ue), Ue = Ue.sibling;
            }
            h_(Ve, xe);
          }
          return;
        }
        case De: {
          fl(t, e), Xl(e), o & At && Jx(e);
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
      if (t & _n) {
        try {
          g_(e);
        } catch (a) {
          Sn(e, e.return, a);
        }
        e.flags &= ~_n;
      }
      t & ea && (e.flags &= ~ea);
    }
    function b_(e, t, a) {
      Vf = a, Bf = t, We = e, eb(e, t, a), Vf = null, Bf = null;
    }
    function eb(e, t, a) {
      for (var i = (e.mode & Dt) !== rt; We !== null; ) {
        var o = We, s = o.child;
        if (o.tag === re && i) {
          var f = o.memoizedState !== null, v = f || Mm;
          if (v) {
            zS(e, t, a);
            continue;
          } else {
            var h = o.alternate, S = h !== null && h.memoizedState !== null, C = S || Qr, O = Mm, N = Qr;
            Mm = v, Qr = C, Qr && !N && (We = o, T_(o));
            for (var I = s; I !== null; )
              We = I, eb(
                I,
                // New root; bubble back up to here and stop.
                t,
                a
              ), I = I.sibling;
            We = o, Mm = O, Qr = N, zS(e, t, a);
            continue;
          }
        }
        (o.subtreeFlags & jl) !== nt && s !== null ? (s.return = o, We = s) : zS(e, t, a);
      }
    }
    function zS(e, t, a) {
      for (; We !== null; ) {
        var i = We;
        if ((i.flags & jl) !== nt) {
          var o = i.alternate;
          tn(i);
          try {
            p_(t, o, i, a);
          } catch (f) {
            Sn(i, i.return, f);
          }
          gn();
        }
        if (i === e) {
          We = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, We = s;
          return;
        }
        We = i.return;
      }
    }
    function w_(e) {
      for (; We !== null; ) {
        var t = We, a = t.child;
        switch (t.tag) {
          case L:
          case Ee:
          case se:
          case A: {
            if (t.mode & $t)
              try {
                ql(), sl(Sr, t, t.return);
              } finally {
                Kl(t);
              }
            else
              sl(Sr, t, t.return);
            break;
          }
          case z: {
            If(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && LS(t, t.return, i);
            break;
          }
          case te: {
            If(t, t.return);
            break;
          }
          case re: {
            var o = t.memoizedState !== null;
            if (o) {
              tb(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, We = a) : tb(e);
      }
    }
    function tb(e) {
      for (; We !== null; ) {
        var t = We;
        if (t === e) {
          We = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, We = a;
          return;
        }
        We = t.return;
      }
    }
    function T_(e) {
      for (; We !== null; ) {
        var t = We, a = t.child;
        if (t.tag === re) {
          var i = t.memoizedState !== null;
          if (i) {
            nb(e);
            continue;
          }
        }
        a !== null ? (a.return = t, We = a) : nb(e);
      }
    }
    function nb(e) {
      for (; We !== null; ) {
        var t = We;
        tn(t);
        try {
          v_(t);
        } catch (i) {
          Sn(t, t.return, i);
        }
        if (gn(), t === e) {
          We = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, We = a;
          return;
        }
        We = t.return;
      }
    }
    function R_(e, t, a, i) {
      We = t, __(t, e, a, i);
    }
    function __(e, t, a, i) {
      for (; We !== null; ) {
        var o = We, s = o.child;
        (o.subtreeFlags & Gi) !== nt && s !== null ? (s.return = o, We = s) : k_(e, t, a, i);
      }
    }
    function k_(e, t, a, i) {
      for (; We !== null; ) {
        var o = We;
        if ((o.flags & Zr) !== nt) {
          tn(o);
          try {
            D_(t, o, a, i);
          } catch (f) {
            Sn(o, o.return, f);
          }
          gn();
        }
        if (o === e) {
          We = null;
          return;
        }
        var s = o.sibling;
        if (s !== null) {
          s.return = o.return, We = s;
          return;
        }
        We = o.return;
      }
    }
    function D_(e, t, a, i) {
      switch (t.tag) {
        case L:
        case Ee:
        case A: {
          if (t.mode & $t) {
            tS();
            try {
              Vu($r | gr, t);
            } finally {
              eS(t);
            }
          } else
            Vu($r | gr, t);
          break;
        }
      }
    }
    function N_(e) {
      We = e, j_();
    }
    function j_() {
      for (; We !== null; ) {
        var e = We, t = e.child;
        if ((We.flags & La) !== nt) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var o = a[i];
              We = o, M_(o, e);
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
            We = e;
          }
        }
        (e.subtreeFlags & Gi) !== nt && t !== null ? (t.return = e, We = t) : O_();
      }
    }
    function O_() {
      for (; We !== null; ) {
        var e = We;
        (e.flags & Zr) !== nt && (tn(e), L_(e), gn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, We = t;
          return;
        }
        We = e.return;
      }
    }
    function L_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case A: {
          e.mode & $t ? (tS(), sl($r | gr, e, e.return), eS(e)) : sl($r | gr, e, e.return);
          break;
        }
      }
    }
    function M_(e, t) {
      for (; We !== null; ) {
        var a = We;
        tn(a), z_(a, t), gn();
        var i = a.child;
        i !== null ? (i.return = a, We = i) : A_(e);
      }
    }
    function A_(e) {
      for (; We !== null; ) {
        var t = We, a = t.sibling, i = t.return;
        if (Gx(t), t === e) {
          We = null;
          return;
        }
        if (a !== null) {
          a.return = i, We = a;
          return;
        }
        We = i;
      }
    }
    function z_(e, t) {
      switch (e.tag) {
        case L:
        case Ee:
        case A: {
          e.mode & $t ? (tS(), sl($r, e, t), eS(e)) : sl($r, e, t);
          break;
        }
      }
    }
    function U_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case A: {
          try {
            Vu(Sr | gr, e);
          } catch (a) {
            Sn(e, e.return, a);
          }
          break;
        }
        case z: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            Sn(e, e.return, a);
          }
          break;
        }
      }
    }
    function F_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case A: {
          try {
            Vu($r | gr, e);
          } catch (t) {
            Sn(e, e.return, t);
          }
          break;
        }
      }
    }
    function P_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case A: {
          try {
            sl(Sr | gr, e, e.return);
          } catch (a) {
            Sn(e, e.return, a);
          }
          break;
        }
        case z: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && LS(e, e.return, t);
          break;
        }
      }
    }
    function H_(e) {
      switch (e.tag) {
        case L:
        case Ee:
        case A:
          try {
            sl($r | gr, e, e.return);
          } catch (t) {
            Sn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Pp = Symbol.for;
      Pp("selector.component"), Pp("selector.has_pseudo_class"), Pp("selector.role"), Pp("selector.test_id"), Pp("selector.text");
    }
    var V_ = [];
    function B_() {
      V_.forEach(function(e) {
        return e();
      });
    }
    var I_ = b.ReactCurrentActQueue;
    function $_(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function rb() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && I_.current !== null && g("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var Y_ = Math.ceil, US = b.ReactCurrentDispatcher, FS = b.ReactCurrentOwner, Gr = b.ReactCurrentBatchConfig, dl = b.ReactCurrentActQueue, xr = (
      /*             */
      0
    ), ab = (
      /*               */
      1
    ), Kr = (
      /*                */
      2
    ), Ui = (
      /*                */
      4
    ), Yo = 0, Hp = 1, rc = 2, zm = 3, Vp = 4, ib = 5, PS = 6, Ut = xr, ba = null, Vn = null, br = de, Jl = de, HS = Ou(de), wr = Yo, Bp = null, Um = de, Ip = de, Fm = de, $p = null, Ya = null, VS = 0, lb = 500, ob = 1 / 0, Q_ = 500, Qo = null;
    function Yp() {
      ob = er() + Q_;
    }
    function ub() {
      return ob;
    }
    var Pm = !1, BS = null, $f = null, ac = !1, Iu = null, Qp = de, IS = [], $S = null, W_ = 50, Wp = 0, YS = null, QS = !1, Hm = !1, G_ = 50, Yf = 0, Vm = null, Gp = un, Bm = de, sb = !1;
    function Im() {
      return ba;
    }
    function wa() {
      return (Ut & (Kr | Ui)) !== xr ? er() : (Gp !== un || (Gp = er()), Gp);
    }
    function $u(e) {
      var t = e.mode;
      if ((t & Dt) === rt)
        return st;
      if ((Ut & Kr) !== xr && br !== de)
        return Ts(br);
      var a = IT() !== BT;
      if (a) {
        if (Gr.transition !== null) {
          var i = Gr.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Bm === Vt && (Bm = zd()), Bm;
      }
      var o = Ha();
      if (o !== Vt)
        return o;
      var s = _w();
      return s;
    }
    function K_(e) {
      var t = e.mode;
      return (t & Dt) === rt ? st : Wv();
    }
    function Tr(e, t, a, i) {
      Sk(), sb && g("useInsertionEffect must not schedule updates."), QS && (Hm = !0), Cu(e, a, i), (Ut & Kr) !== de && e === ba ? xk(t) : (ra && ks(e, t, a), bk(t), e === ba && ((Ut & Kr) === xr && (Ip = xt(Ip, a)), wr === Vp && Yu(e, br)), Qa(e, i), a === st && Ut === xr && (t.mode & Dt) === rt && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !dl.isBatchingLegacy && (Yp(), sC()));
    }
    function q_(e, t, a) {
      var i = e.current;
      i.lanes = t, Cu(e, t, a), Qa(e, a);
    }
    function X_(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Ut & Kr) !== xr
      );
    }
    function Qa(e, t) {
      var a = e.callbackNode;
      Zc(e, t);
      var i = Jc(e, e === ba ? br : de);
      if (i === de) {
        a !== null && Tb(a), e.callbackNode = null, e.callbackPriority = Vt;
        return;
      }
      var o = zl(i), s = e.callbackPriority;
      if (s === o && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== ZS)) {
        a == null && s !== st && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && Tb(a);
      var f;
      if (o === st)
        e.tag === Lu ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), TT(db.bind(null, e))) : uC(db.bind(null, e)), dl.current !== null ? dl.current.push(Mu) : Dw(function() {
          (Ut & (Kr | Ui)) === xr && Mu();
        }), f = null;
      else {
        var v;
        switch (eh(i)) {
          case Fr:
            v = fs;
            break;
          case _i:
            v = Ol;
            break;
          case Fa:
            v = Ki;
            break;
          case Pa:
            v = So;
            break;
          default:
            v = Ki;
            break;
        }
        f = eE(v, cb.bind(null, e));
      }
      e.callbackPriority = o, e.callbackNode = f;
    }
    function cb(e, t) {
      if (hR(), Gp = un, Bm = de, (Ut & (Kr | Ui)) !== xr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Go();
      if (i && e.callbackNode !== a)
        return null;
      var o = Jc(e, e === ba ? br : de);
      if (o === de)
        return null;
      var s = !tf(e, o) && !Qv(e, o) && !t, f = s ? ok(e, o) : Ym(e, o);
      if (f !== Yo) {
        if (f === rc) {
          var v = ef(e);
          v !== de && (o = v, f = WS(e, v));
        }
        if (f === Hp) {
          var h = Bp;
          throw ic(e, de), Yu(e, o), Qa(e, er()), h;
        }
        if (f === PS)
          Yu(e, o);
        else {
          var S = !tf(e, o), C = e.current.alternate;
          if (S && !Z_(C)) {
            if (f = Ym(e, o), f === rc) {
              var O = ef(e);
              O !== de && (o = O, f = WS(e, O));
            }
            if (f === Hp) {
              var N = Bp;
              throw ic(e, de), Yu(e, o), Qa(e, er()), N;
            }
          }
          e.finishedWork = C, e.finishedLanes = o, J_(e, f, o);
        }
      }
      return Qa(e, er()), e.callbackNode === a ? cb.bind(null, e) : null;
    }
    function WS(e, t) {
      var a = $p;
      if (af(e)) {
        var i = ic(e, t);
        i.flags |= kr, gT(e.containerInfo);
      }
      var o = Ym(e, t);
      if (o !== rc) {
        var s = Ya;
        Ya = a, s !== null && fb(s);
      }
      return o;
    }
    function fb(e) {
      Ya === null ? Ya = e : Ya.push.apply(Ya, e);
    }
    function J_(e, t, a) {
      switch (t) {
        case Yo:
        case Hp:
          throw new Error("Root did not complete. This is a bug in React.");
        case rc: {
          lc(e, Ya, Qo);
          break;
        }
        case zm: {
          if (Yu(e, a), No(a) && // do not delay if we're inside an act() scope
          !Rb()) {
            var i = VS + lb - er();
            if (i > 10) {
              var o = Jc(e, de);
              if (o !== de)
                break;
              var s = e.suspendedLanes;
              if (!jo(s, a)) {
                wa(), nf(e, s);
                break;
              }
              e.timeoutHandle = $y(lc.bind(null, e, Ya, Qo), i);
              break;
            }
          }
          lc(e, Ya, Qo);
          break;
        }
        case Vp: {
          if (Yu(e, a), Md(a))
            break;
          if (!Rb()) {
            var f = li(e, a), v = f, h = er() - v, S = gk(h) - h;
            if (S > 10) {
              e.timeoutHandle = $y(lc.bind(null, e, Ya, Qo), S);
              break;
            }
          }
          lc(e, Ya, Qo);
          break;
        }
        case ib: {
          lc(e, Ya, Qo);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function Z_(e) {
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
      t = Rs(t, Fm), t = Rs(t, Ip), qv(e, t);
    }
    function db(e) {
      if (mR(), (Ut & (Kr | Ui)) !== xr)
        throw new Error("Should not already be working.");
      Go();
      var t = Jc(e, de);
      if (!ia(t, st))
        return Qa(e, er()), null;
      var a = Ym(e, t);
      if (e.tag !== Lu && a === rc) {
        var i = ef(e);
        i !== de && (t = i, a = WS(e, i));
      }
      if (a === Hp) {
        var o = Bp;
        throw ic(e, de), Yu(e, t), Qa(e, er()), o;
      }
      if (a === PS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, lc(e, Ya, Qo), Qa(e, er()), null;
    }
    function ek(e, t) {
      t !== de && (rf(e, xt(t, st)), Qa(e, er()), (Ut & (Kr | Ui)) === xr && (Yp(), Mu()));
    }
    function GS(e, t) {
      var a = Ut;
      Ut |= ab;
      try {
        return e(t);
      } finally {
        Ut = a, Ut === xr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !dl.isBatchingLegacy && (Yp(), sC());
      }
    }
    function tk(e, t, a, i, o) {
      var s = Ha(), f = Gr.transition;
      try {
        return Gr.transition = null, Wn(Fr), e(t, a, i, o);
      } finally {
        Wn(s), Gr.transition = f, Ut === xr && Yp();
      }
    }
    function Wo(e) {
      Iu !== null && Iu.tag === Lu && (Ut & (Kr | Ui)) === xr && Go();
      var t = Ut;
      Ut |= ab;
      var a = Gr.transition, i = Ha();
      try {
        return Gr.transition = null, Wn(Fr), e ? e() : void 0;
      } finally {
        Wn(i), Gr.transition = a, Ut = t, (Ut & (Kr | Ui)) === xr && Mu();
      }
    }
    function pb() {
      return (Ut & (Kr | Ui)) !== xr;
    }
    function $m(e, t) {
      ca(HS, Jl, e), Jl = xt(Jl, t);
    }
    function KS(e) {
      Jl = HS.current, sa(HS, e);
    }
    function ic(e, t) {
      e.finishedWork = null, e.finishedLanes = de;
      var a = e.timeoutHandle;
      if (a !== Yy && (e.timeoutHandle = Yy, kw(a)), Vn !== null)
        for (var i = Vn.return; i !== null; ) {
          var o = i.alternate;
          Bx(o, i), i = i.return;
        }
      ba = e;
      var s = oc(e.current, null);
      return Vn = s, br = Jl = t, wr = Yo, Bp = null, Um = de, Ip = de, Fm = de, $p = null, Ya = null, qT(), al.discardPendingWarnings(), s;
    }
    function vb(e, t) {
      do {
        var a = Vn;
        try {
          if (em(), FC(), gn(), FS.current = null, a === null || a.return === null) {
            wr = Hp, Bp = t, Vn = null;
            return;
          }
          if (Ie && a.mode & $t && Dm(a, !0), Ne)
            if (Sa(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Ri(a, i, br);
            } else
              ps(a, t, br);
          TR(e, a.return, a, t, br), gb(a);
        } catch (o) {
          t = o, Vn === a && a !== null ? (a = a.return, Vn = a) : a = Vn;
          continue;
        }
        return;
      } while (!0);
    }
    function hb() {
      var e = US.current;
      return US.current = wm, e === null ? wm : e;
    }
    function mb(e) {
      US.current = e;
    }
    function nk() {
      VS = er();
    }
    function Kp(e) {
      Um = xt(e, Um);
    }
    function rk() {
      wr === Yo && (wr = zm);
    }
    function qS() {
      (wr === Yo || wr === zm || wr === rc) && (wr = Vp), ba !== null && (ws(Um) || ws(Ip)) && Yu(ba, br);
    }
    function ak(e) {
      wr !== Vp && (wr = rc), $p === null ? $p = [e] : $p.push(e);
    }
    function ik() {
      return wr === Yo;
    }
    function Ym(e, t) {
      var a = Ut;
      Ut |= Kr;
      var i = hb();
      if (ba !== e || br !== t) {
        if (ra) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (qp(e, br), o.clear()), Xv(e, t);
        }
        Qo = Hd(), ic(e, t);
      }
      bo(t);
      do
        try {
          lk();
          break;
        } catch (s) {
          vb(e, s);
        }
      while (!0);
      if (em(), Ut = a, mb(i), Vn !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Mc(), ba = null, br = de, wr;
    }
    function lk() {
      for (; Vn !== null; )
        yb(Vn);
    }
    function ok(e, t) {
      var a = Ut;
      Ut |= Kr;
      var i = hb();
      if (ba !== e || br !== t) {
        if (ra) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (qp(e, br), o.clear()), Xv(e, t);
        }
        Qo = Hd(), Yp(), ic(e, t);
      }
      bo(t);
      do
        try {
          uk();
          break;
        } catch (s) {
          vb(e, s);
        }
      while (!0);
      return em(), mb(i), Ut = a, Vn !== null ? (Bv(), Yo) : (Mc(), ba = null, br = de, wr);
    }
    function uk() {
      for (; Vn !== null && !Sd(); )
        yb(Vn);
    }
    function yb(e) {
      var t = e.alternate;
      tn(e);
      var a;
      (e.mode & $t) !== rt ? (Zg(e), a = XS(t, e, Jl), Dm(e, !0)) : a = XS(t, e, Jl), gn(), e.memoizedProps = e.pendingProps, a === null ? gb(e) : Vn = a, FS.current = null;
    }
    function gb(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & cs) === nt) {
          tn(t);
          var o = void 0;
          if ((t.mode & $t) === rt ? o = Vx(a, t, Jl) : (Zg(t), o = Vx(a, t, Jl), Dm(t, !1)), gn(), o !== null) {
            Vn = o;
            return;
          }
        } else {
          var s = r_(a, t);
          if (s !== null) {
            s.flags &= zv, Vn = s;
            return;
          }
          if ((t.mode & $t) !== rt) {
            Dm(t, !1);
            for (var f = t.actualDuration, v = t.child; v !== null; )
              f += v.actualDuration, v = v.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= cs, i.subtreeFlags = nt, i.deletions = null;
          else {
            wr = PS, Vn = null;
            return;
          }
        }
        var h = t.sibling;
        if (h !== null) {
          Vn = h;
          return;
        }
        t = i, Vn = t;
      } while (t !== null);
      wr === Yo && (wr = ib);
    }
    function lc(e, t, a) {
      var i = Ha(), o = Gr.transition;
      try {
        Gr.transition = null, Wn(Fr), sk(e, t, a, i);
      } finally {
        Gr.transition = o, Wn(i);
      }
      return null;
    }
    function sk(e, t, a, i) {
      do
        Go();
      while (Iu !== null);
      if (Ek(), (Ut & (Kr | Ui)) !== xr)
        throw new Error("Should not already be working.");
      var o = e.finishedWork, s = e.finishedLanes;
      if (Td(s), o === null)
        return Rd(), null;
      if (s === de && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = de, o === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Vt;
      var f = xt(o.lanes, o.childLanes);
      Fd(e, f), e === ba && (ba = null, Vn = null, br = de), ((o.subtreeFlags & Gi) !== nt || (o.flags & Gi) !== nt) && (ac || (ac = !0, $S = a, eE(Ki, function() {
        return Go(), null;
      })));
      var v = (o.subtreeFlags & (Dl | Nl | jl | Gi)) !== nt, h = (o.flags & (Dl | Nl | jl | Gi)) !== nt;
      if (v || h) {
        var S = Gr.transition;
        Gr.transition = null;
        var C = Ha();
        Wn(Fr);
        var O = Ut;
        Ut |= Ui, FS.current = null, u_(e, o), sx(), x_(e, o, s), Cw(e.containerInfo), e.current = o, vs(s), b_(o, e, s), hs(), Ed(), Ut = O, Wn(C), Gr.transition = S;
      } else
        e.current = o, sx();
      var N = ac;
      if (ac ? (ac = !1, Iu = e, Qp = s) : (Yf = 0, Vm = null), f = e.pendingLanes, f === de && ($f = null), N || xb(e.current, !1), xd(o.stateNode, i), ra && e.memoizedUpdaters.clear(), B_(), Qa(e, er()), t !== null)
        for (var I = e.onRecoverableError, Q = 0; Q < t.length; Q++) {
          var J = t[Q], Ae = J.stack, it = J.digest;
          I(J.value, {
            componentStack: Ae,
            digest: it
          });
        }
      if (Pm) {
        Pm = !1;
        var Ze = BS;
        throw BS = null, Ze;
      }
      return ia(Qp, st) && e.tag !== Lu && Go(), f = e.pendingLanes, ia(f, st) ? (vR(), e === YS ? Wp++ : (Wp = 0, YS = e)) : Wp = 0, Mu(), Rd(), null;
    }
    function Go() {
      if (Iu !== null) {
        var e = eh(Qp), t = Ns(Fa, e), a = Gr.transition, i = Ha();
        try {
          return Gr.transition = null, Wn(t), fk();
        } finally {
          Wn(i), Gr.transition = a;
        }
      }
      return !1;
    }
    function ck(e) {
      IS.push(e), ac || (ac = !0, eE(Ki, function() {
        return Go(), null;
      }));
    }
    function fk() {
      if (Iu === null)
        return !1;
      var e = $S;
      $S = null;
      var t = Iu, a = Qp;
      if (Iu = null, Qp = de, (Ut & (Kr | Ui)) !== xr)
        throw new Error("Cannot flush passive effects while already rendering.");
      QS = !0, Hm = !1, xo(a);
      var i = Ut;
      Ut |= Ui, N_(t.current), R_(t, t.current, a, e);
      {
        var o = IS;
        IS = [];
        for (var s = 0; s < o.length; s++) {
          var f = o[s];
          d_(t, f);
        }
      }
      Dd(), xb(t.current, !0), Ut = i, Mu(), Hm ? t === Vm ? Yf++ : (Yf = 0, Vm = t) : Yf = 0, QS = !1, Hm = !1, bd(t);
      {
        var v = t.current.stateNode;
        v.effectDuration = 0, v.passiveEffectDuration = 0;
      }
      return !0;
    }
    function Sb(e) {
      return $f !== null && $f.has(e);
    }
    function dk(e) {
      $f === null ? $f = /* @__PURE__ */ new Set([e]) : $f.add(e);
    }
    function pk(e) {
      Pm || (Pm = !0, BS = e);
    }
    var vk = pk;
    function Eb(e, t, a) {
      var i = tc(a, t), o = yx(e, i, st), s = zu(e, o, st), f = wa();
      s !== null && (Cu(s, st, f), Qa(s, f));
    }
    function Sn(e, t, a) {
      if (i_(a), Xp(!1), e.tag === P) {
        Eb(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === P) {
          Eb(i, e, a);
          return;
        } else if (i.tag === z) {
          var o = i.type, s = i.stateNode;
          if (typeof o.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !Sb(s)) {
            var f = tc(a, e), v = yS(i, f, st), h = zu(i, v, st), S = wa();
            h !== null && (Cu(h, st, S), Qa(h, S));
            return;
          }
        }
        i = i.return;
      }
      g(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function hk(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var o = wa();
      nf(e, a), wk(e), ba === e && jo(br, a) && (wr === Vp || wr === zm && No(br) && er() - VS < lb ? ic(e, de) : Fm = xt(Fm, a)), Qa(e, o);
    }
    function Cb(e, t) {
      t === Vt && (t = K_(e));
      var a = wa(), i = Ia(e, t);
      i !== null && (Cu(i, t, a), Qa(i, a));
    }
    function mk(e) {
      var t = e.memoizedState, a = Vt;
      t !== null && (a = t.retryLane), Cb(e, a);
    }
    function yk(e, t) {
      var a = Vt, i;
      switch (e.tag) {
        case le:
          i = e.stateNode;
          var o = e.memoizedState;
          o !== null && (a = o.retryLane);
          break;
        case De:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), Cb(e, a);
    }
    function gk(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : Y_(e / 1960) * 1960;
    }
    function Sk() {
      if (Wp > W_)
        throw Wp = 0, YS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Yf > G_ && (Yf = 0, Vm = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function Ek() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function xb(e, t) {
      tn(e), Qm(e, kl, P_), t && Qm(e, bi, H_), Qm(e, kl, U_), t && Qm(e, bi, F_), gn();
    }
    function Qm(e, t, a) {
      for (var i = e, o = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== o && i.child !== null && s !== nt ? i = i.child : ((i.flags & t) !== nt && a(i), i.sibling !== null ? i = i.sibling : i = o = i.return);
      }
    }
    var Wm = null;
    function bb(e) {
      {
        if ((Ut & Kr) !== xr || !(e.mode & Dt))
          return;
        var t = e.tag;
        if (t !== ge && t !== P && t !== z && t !== L && t !== Ee && t !== se && t !== A)
          return;
        var a = pt(e) || "ReactComponent";
        if (Wm !== null) {
          if (Wm.has(a))
            return;
          Wm.add(a);
        } else
          Wm = /* @__PURE__ */ new Set([a]);
        var i = pr;
        try {
          tn(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? tn(e) : gn();
        }
      }
    }
    var XS;
    {
      var Ck = null;
      XS = function(e, t, a) {
        var i = jb(Ck, t);
        try {
          return zx(e, t, a);
        } catch (s) {
          if (LT() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (em(), FC(), Bx(e, t), jb(t, i), t.mode & $t && Zg(t), _l(null, zx, null, e, t, a), Qi()) {
            var o = ss();
            typeof o == "object" && o !== null && o._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var wb = !1, JS;
    JS = /* @__PURE__ */ new Set();
    function xk(e) {
      if (mi && !fR())
        switch (e.tag) {
          case L:
          case Ee:
          case A: {
            var t = Vn && pt(Vn) || "Unknown", a = t;
            if (!JS.has(a)) {
              JS.add(a);
              var i = pt(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case z: {
            wb || (g("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), wb = !0);
            break;
          }
        }
    }
    function qp(e, t) {
      if (ra) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          ks(e, i, t);
        });
      }
    }
    var ZS = {};
    function eE(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), ZS) : gd(e, t);
      }
    }
    function Tb(e) {
      if (e !== ZS)
        return Fv(e);
    }
    function Rb() {
      return dl.current !== null;
    }
    function bk(e) {
      {
        if (e.mode & Dt) {
          if (!rb())
            return;
        } else if (!$_() || Ut !== xr || e.tag !== L && e.tag !== Ee && e.tag !== A)
          return;
        if (dl.current === null) {
          var t = pr;
          try {
            tn(e), g(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, pt(e));
          } finally {
            t ? tn(e) : gn();
          }
        }
      }
    }
    function wk(e) {
      e.tag !== Lu && rb() && dl.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Xp(e) {
      sb = e;
    }
    var Fi = null, Qf = null, Tk = function(e) {
      Fi = e;
    };
    function Wf(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function tE(e) {
      return Wf(e);
    }
    function nE(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
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
    function _b(e, t) {
      {
        if (Fi === null)
          return !1;
        var a = e.elementType, i = t.type, o = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case z: {
            typeof i == "function" && (o = !0);
            break;
          }
          case L: {
            (typeof i == "function" || s === ht) && (o = !0);
            break;
          }
          case Ee: {
            (s === ce || s === ht) && (o = !0);
            break;
          }
          case se:
          case A: {
            (s === St || s === ht) && (o = !0);
            break;
          }
          default:
            return !1;
        }
        if (o) {
          var f = Fi(a);
          if (f !== void 0 && f === Fi(i))
            return !0;
        }
        return !1;
      }
    }
    function kb(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        Qf === null && (Qf = /* @__PURE__ */ new WeakSet()), Qf.add(e);
      }
    }
    var Rk = function(e, t) {
      {
        if (Fi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Go(), Wo(function() {
          rE(e.current, i, a);
        });
      }
    }, _k = function(e, t) {
      {
        if (e.context !== si)
          return;
        Go(), Wo(function() {
          Jp(t, e, null, null);
        });
      }
    };
    function rE(e, t, a) {
      {
        var i = e.alternate, o = e.child, s = e.sibling, f = e.tag, v = e.type, h = null;
        switch (f) {
          case L:
          case A:
          case z:
            h = v;
            break;
          case Ee:
            h = v.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var S = !1, C = !1;
        if (h !== null) {
          var O = Fi(h);
          O !== void 0 && (a.has(O) ? C = !0 : t.has(O) && (f === z ? C = !0 : S = !0));
        }
        if (Qf !== null && (Qf.has(e) || i !== null && Qf.has(i)) && (C = !0), C && (e._debugNeedsRemount = !0), C || S) {
          var N = Ia(e, st);
          N !== null && Tr(N, e, st, un);
        }
        o !== null && !C && rE(o, t, a), s !== null && rE(s, t, a);
      }
    }
    var kk = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(o) {
          return o.current;
        }));
        return aE(e.current, i, a), a;
      }
    };
    function aE(e, t, a) {
      {
        var i = e.child, o = e.sibling, s = e.tag, f = e.type, v = null;
        switch (s) {
          case L:
          case A:
          case z:
            v = f;
            break;
          case Ee:
            v = f.render;
            break;
        }
        var h = !1;
        v !== null && t.has(v) && (h = !0), h ? Dk(e, a) : i !== null && aE(i, t, a), o !== null && aE(o, t, a);
      }
    }
    function Dk(e, t) {
      {
        var a = Nk(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case te:
              t.add(i.stateNode);
              return;
            case W:
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
    function Nk(e, t) {
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
    var iE;
    {
      iE = !1;
      try {
        var Db = Object.preventExtensions({});
      } catch {
        iE = !0;
      }
    }
    function jk(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = nt, this.subtreeFlags = nt, this.deletions = null, this.lanes = de, this.childLanes = de, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !iE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var ci = function(e, t, a, i) {
      return new jk(e, t, a, i);
    };
    function lE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Ok(e) {
      return typeof e == "function" && !lE(e) && e.defaultProps === void 0;
    }
    function Lk(e) {
      if (typeof e == "function")
        return lE(e) ? z : L;
      if (e != null) {
        var t = e.$$typeof;
        if (t === ce)
          return Ee;
        if (t === St)
          return se;
      }
      return ge;
    }
    function oc(e, t) {
      var a = e.alternate;
      a === null ? (a = ci(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = nt, a.subtreeFlags = nt, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & $n, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case ge:
        case L:
        case A:
          a.type = Wf(e.type);
          break;
        case z:
          a.type = tE(e.type);
          break;
        case Ee:
          a.type = nE(e.type);
          break;
      }
      return a;
    }
    function Mk(e, t) {
      e.flags &= $n | _n;
      var a = e.alternate;
      if (a === null)
        e.childLanes = de, e.lanes = t, e.child = null, e.subtreeFlags = nt, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = nt, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function Ak(e, t, a) {
      var i;
      return e === $h ? (i = Dt, t === !0 && (i |= an, i |= Yt)) : i = rt, ra && (i |= $t), ci(P, null, null, i);
    }
    function oE(e, t, a, i, o, s) {
      var f = ge, v = e;
      if (typeof e == "function")
        lE(e) ? (f = z, v = tE(v)) : v = Wf(v);
      else if (typeof e == "string")
        f = te;
      else
        e: switch (e) {
          case di:
            return Qu(a.children, o, s, t);
          case Ka:
            f = fe, o |= an, (o & Dt) !== rt && (o |= Yt);
            break;
          case pi:
            return zk(a, o, s, t);
          case Le:
            return Uk(a, o, s, t);
          case $e:
            return Fk(a, o, s, t);
          case An:
            return Nb(a, o, s, t);
          case fn:
          case Nt:
          case yn:
          case dr:
          case kt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case vi:
                  f = oe;
                  break e;
                case _:
                  f = je;
                  break e;
                case ce:
                  f = Ee, v = nE(v);
                  break e;
                case St:
                  f = se;
                  break e;
                case ht:
                  f = pe, v = null;
                  break e;
              }
            var h = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (h += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var S = i ? pt(i) : null;
              S && (h += `

Check the render method of \`` + S + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + h));
          }
        }
      var C = ci(f, a, t, o);
      return C.elementType = e, C.type = v, C.lanes = s, C._debugOwner = i, C;
    }
    function uE(e, t, a) {
      var i = null;
      i = e._owner;
      var o = e.type, s = e.key, f = e.props, v = oE(o, s, f, i, t, a);
      return v._debugSource = e._source, v._debugOwner = e._owner, v;
    }
    function Qu(e, t, a, i) {
      var o = ci(X, e, i, t);
      return o.lanes = a, o;
    }
    function zk(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var o = ci(Se, e, i, t | $t);
      return o.elementType = pi, o.lanes = a, o.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, o;
    }
    function Uk(e, t, a, i) {
      var o = ci(le, e, i, t);
      return o.elementType = Le, o.lanes = a, o;
    }
    function Fk(e, t, a, i) {
      var o = ci(De, e, i, t);
      return o.elementType = $e, o.lanes = a, o;
    }
    function Nb(e, t, a, i) {
      var o = ci(re, e, i, t);
      o.elementType = An, o.lanes = a;
      var s = {
        isHidden: !1
      };
      return o.stateNode = s, o;
    }
    function sE(e, t, a) {
      var i = ci(ne, e, null, t);
      return i.lanes = a, i;
    }
    function Pk() {
      var e = ci(te, null, null, rt);
      return e.elementType = "DELETED", e;
    }
    function Hk(e) {
      var t = ci(be, null, null, rt);
      return t.stateNode = e, t;
    }
    function cE(e, t, a) {
      var i = e.children !== null ? e.children : [], o = ci(W, i, e.key, t);
      return o.lanes = a, o.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, o;
    }
    function jb(e, t) {
      return e === null && (e = ci(ge, null, null, rt)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function Vk(e, t, a, i, o) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Yy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Vt, this.eventTimes = _s(de), this.expirationTimes = _s(un), this.pendingLanes = de, this.suspendedLanes = de, this.pingedLanes = de, this.expiredLanes = de, this.mutableReadLanes = de, this.finishedLanes = de, this.entangledLanes = de, this.entanglements = _s(de), this.identifierPrefix = i, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < wo; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case $h:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Lu:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function Ob(e, t, a, i, o, s, f, v, h, S) {
      var C = new Vk(e, t, a, v, h), O = Ak(t, s);
      C.current = O, O.stateNode = C;
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
      return bg(O), C;
    }
    var fE = "18.3.1";
    function Bk(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return Rr(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: fr,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var dE, pE;
    dE = !1, pE = {};
    function Lb(e) {
      if (!e)
        return si;
      var t = hu(e), a = wT(t);
      if (t.tag === z) {
        var i = t.type;
        if (Yl(i))
          return lC(t, i, a);
      }
      return a;
    }
    function Ik(e, t) {
      {
        var a = hu(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var o = ta(a);
        if (o === null)
          return null;
        if (o.mode & an) {
          var s = pt(a) || "Component";
          if (!pE[s]) {
            pE[s] = !0;
            var f = pr;
            try {
              tn(o), a.mode & an ? g("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : g("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? tn(f) : gn();
            }
          }
        }
        return o.stateNode;
      }
    }
    function Mb(e, t, a, i, o, s, f, v) {
      var h = !1, S = null;
      return Ob(e, t, h, S, a, i, o, s, f);
    }
    function Ab(e, t, a, i, o, s, f, v, h, S) {
      var C = !0, O = Ob(a, i, C, e, o, s, f, v, h);
      O.context = Lb(null);
      var N = O.current, I = wa(), Q = $u(N), J = Io(I, Q);
      return J.callback = t ?? null, zu(N, J, Q), q_(O, Q, I), O;
    }
    function Jp(e, t, a, i) {
      Cd(t, e);
      var o = t.current, s = wa(), f = $u(o);
      Dn(f);
      var v = Lb(a);
      t.context === null ? t.context = v : t.pendingContext = v, mi && pr !== null && !dE && (dE = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, pt(pr) || "Unknown"));
      var h = Io(s, f);
      h.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && g("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), h.callback = i);
      var S = zu(o, h, f);
      return S !== null && (Tr(S, o, f, s), im(S, o, f)), f;
    }
    function Gm(e) {
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
    function $k(e) {
      switch (e.tag) {
        case P: {
          var t = e.stateNode;
          if (af(t)) {
            var a = $v(t);
            ek(t, a);
          }
          break;
        }
        case le: {
          Wo(function() {
            var o = Ia(e, st);
            if (o !== null) {
              var s = wa();
              Tr(o, e, st, s);
            }
          });
          var i = st;
          vE(e, i);
          break;
        }
      }
    }
    function zb(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Kv(a.retryLane, t));
    }
    function vE(e, t) {
      zb(e, t);
      var a = e.alternate;
      a && zb(a, t);
    }
    function Yk(e) {
      if (e.tag === le) {
        var t = Cs, a = Ia(e, t);
        if (a !== null) {
          var i = wa();
          Tr(a, e, t, i);
        }
        vE(e, t);
      }
    }
    function Qk(e) {
      if (e.tag === le) {
        var t = $u(e), a = Ia(e, t);
        if (a !== null) {
          var i = wa();
          Tr(a, e, t, i);
        }
        vE(e, t);
      }
    }
    function Ub(e) {
      var t = Cn(e);
      return t === null ? null : t.stateNode;
    }
    var Fb = function(e) {
      return null;
    };
    function Wk(e) {
      return Fb(e);
    }
    var Pb = function(e) {
      return !1;
    };
    function Gk(e) {
      return Pb(e);
    }
    var Hb = null, Vb = null, Bb = null, Ib = null, $b = null, Yb = null, Qb = null, Wb = null, Gb = null;
    {
      var Kb = function(e, t, a) {
        var i = t[a], o = _t(e) ? e.slice() : Tt({}, e);
        return a + 1 === t.length ? (_t(o) ? o.splice(i, 1) : delete o[i], o) : (o[i] = Kb(e[i], t, a + 1), o);
      }, qb = function(e, t) {
        return Kb(e, t, 0);
      }, Xb = function(e, t, a, i) {
        var o = t[i], s = _t(e) ? e.slice() : Tt({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[o], _t(s) ? s.splice(o, 1) : delete s[o];
        } else
          s[o] = Xb(
            // $FlowFixMe number or string is fine here
            e[o],
            t,
            a,
            i + 1
          );
        return s;
      }, Jb = function(e, t, a) {
        if (t.length !== a.length) {
          D("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              D("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return Xb(e, t, a, 0);
      }, Zb = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var o = t[a], s = _t(e) ? e.slice() : Tt({}, e);
        return s[o] = Zb(e[o], t, a + 1, i), s;
      }, e0 = function(e, t, a) {
        return Zb(e, t, 0, a);
      }, hE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      Hb = function(e, t, a, i) {
        var o = hE(e, t);
        if (o !== null) {
          var s = e0(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = Tt({}, e.memoizedProps);
          var f = Ia(e, st);
          f !== null && Tr(f, e, st, un);
        }
      }, Vb = function(e, t, a) {
        var i = hE(e, t);
        if (i !== null) {
          var o = qb(i.memoizedState, a);
          i.memoizedState = o, i.baseState = o, e.memoizedProps = Tt({}, e.memoizedProps);
          var s = Ia(e, st);
          s !== null && Tr(s, e, st, un);
        }
      }, Bb = function(e, t, a, i) {
        var o = hE(e, t);
        if (o !== null) {
          var s = Jb(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = Tt({}, e.memoizedProps);
          var f = Ia(e, st);
          f !== null && Tr(f, e, st, un);
        }
      }, Ib = function(e, t, a) {
        e.pendingProps = e0(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ia(e, st);
        i !== null && Tr(i, e, st, un);
      }, $b = function(e, t) {
        e.pendingProps = qb(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ia(e, st);
        a !== null && Tr(a, e, st, un);
      }, Yb = function(e, t, a) {
        e.pendingProps = Jb(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ia(e, st);
        i !== null && Tr(i, e, st, un);
      }, Qb = function(e) {
        var t = Ia(e, st);
        t !== null && Tr(t, e, st, un);
      }, Wb = function(e) {
        Fb = e;
      }, Gb = function(e) {
        Pb = e;
      };
    }
    function Kk(e) {
      var t = ta(e);
      return t === null ? null : t.stateNode;
    }
    function qk(e) {
      return null;
    }
    function Xk() {
      return pr;
    }
    function Jk(e) {
      var t = e.findFiberByHostInstance, a = b.ReactCurrentDispatcher;
      return gu({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: Hb,
        overrideHookStateDeletePath: Vb,
        overrideHookStateRenamePath: Bb,
        overrideProps: Ib,
        overridePropsDeletePath: $b,
        overridePropsRenamePath: Yb,
        setErrorHandler: Wb,
        setSuspenseHandler: Gb,
        scheduleUpdate: Qb,
        currentDispatcherRef: a,
        findHostInstanceByFiber: Kk,
        findFiberByHostInstance: t || qk,
        // React Refresh
        findHostInstancesForRefresh: kk,
        scheduleRefresh: Rk,
        scheduleRoot: _k,
        setRefreshHandler: Tk,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: Xk,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: fE
      });
    }
    var t0 = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function mE(e) {
      this._internalRoot = e;
    }
    Km.prototype.render = mE.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? g("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : qm(arguments[1]) ? g("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && g("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Bn) {
          var i = Ub(t.current);
          i && i.parentNode !== a && g("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Jp(e, t, null, null);
    }, Km.prototype.unmount = mE.prototype.unmount = function() {
      typeof arguments[0] == "function" && g("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        pb() && g("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Wo(function() {
          Jp(null, e, null, null);
        }), tC(t);
      }
    };
    function Zk(e, t) {
      if (!qm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      n0(e);
      var a = !1, i = !1, o = "", s = t0;
      t != null && (t.hydrate ? D("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Mr && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = Mb(e, $h, null, a, i, o, s);
      Uh(f.current, e);
      var v = e.nodeType === Bn ? e.parentNode : e;
      return ap(v), new mE(f);
    }
    function Km(e) {
      this._internalRoot = e;
    }
    function eD(e) {
      e && ih(e);
    }
    Km.prototype.unstable_scheduleHydration = eD;
    function tD(e, t, a) {
      if (!qm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      n0(e), t === void 0 && g("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, o = a != null && a.hydratedSources || null, s = !1, f = !1, v = "", h = t0;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (v = a.identifierPrefix), a.onRecoverableError !== void 0 && (h = a.onRecoverableError));
      var S = Ab(t, null, e, $h, i, s, f, v, h);
      if (Uh(S.current, e), ap(e), o)
        for (var C = 0; C < o.length; C++) {
          var O = o[C];
          iR(S, O);
        }
      return new Km(S);
    }
    function qm(e) {
      return !!(e && (e.nodeType === Jr || e.nodeType === Yi || e.nodeType === ld));
    }
    function Zp(e) {
      return !!(e && (e.nodeType === Jr || e.nodeType === Yi || e.nodeType === ld || e.nodeType === Bn && e.nodeValue === " react-mount-point-unstable "));
    }
    function n0(e) {
      e.nodeType === Jr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), hp(e) && (e._reactRootContainer ? g("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : g("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var nD = b.ReactCurrentOwner, r0;
    r0 = function(e) {
      if (e._reactRootContainer && e.nodeType !== Bn) {
        var t = Ub(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = yE(e), o = !!(i && ju(i));
      o && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Jr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function yE(e) {
      return e ? e.nodeType === Yi ? e.documentElement : e.firstChild : null;
    }
    function a0() {
    }
    function rD(e, t, a, i, o) {
      if (o) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var N = Gm(f);
            s.call(N);
          };
        }
        var f = Ab(
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
          a0
        );
        e._reactRootContainer = f, Uh(f.current, e);
        var v = e.nodeType === Bn ? e.parentNode : e;
        return ap(v), Wo(), f;
      } else {
        for (var h; h = e.lastChild; )
          e.removeChild(h);
        if (typeof i == "function") {
          var S = i;
          i = function() {
            var N = Gm(C);
            S.call(N);
          };
        }
        var C = Mb(
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
          a0
        );
        e._reactRootContainer = C, Uh(C.current, e);
        var O = e.nodeType === Bn ? e.parentNode : e;
        return ap(O), Wo(function() {
          Jp(t, C, a, i);
        }), C;
      }
    }
    function aD(e, t) {
      e !== null && typeof e != "function" && g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Xm(e, t, a, i, o) {
      r0(a), aD(o === void 0 ? null : o, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = rD(a, t, e, o, i);
      else {
        if (f = s, typeof o == "function") {
          var v = o;
          o = function() {
            var h = Gm(f);
            v.call(h);
          };
        }
        Jp(t, f, e, o);
      }
      return Gm(f);
    }
    var i0 = !1;
    function iD(e) {
      {
        i0 || (i0 = !0, g("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = nD.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Pt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Jr ? e : Ik(e, "findDOMNode");
    }
    function lD(e, t, a) {
      if (g("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Zp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = hp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Xm(null, e, t, !0, a);
    }
    function oD(e, t, a) {
      if (g("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Zp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = hp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Xm(null, e, t, !1, a);
    }
    function uD(e, t, a, i) {
      if (g("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Zp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !vy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Xm(e, t, a, !1, i);
    }
    var l0 = !1;
    function sD(e) {
      if (l0 || (l0 = !0, g("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Zp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = hp(e) && e._reactRootContainer === void 0;
        t && g("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = yE(e), i = a && !ju(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Wo(function() {
          Xm(null, null, e, !1, function() {
            e._reactRootContainer = null, tC(e);
          });
        }), !0;
      } else {
        {
          var o = yE(e), s = !!(o && ju(o)), f = e.nodeType === Jr && Zp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Nr($k), xu(Yk), th(Qk), Os(Ha), Vd(Jv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Cc(fw), py(GS, tk, Wo);
    function cD(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!qm(t))
        throw new Error("Target container is not a DOM element.");
      return Bk(e, t, null, a);
    }
    function fD(e, t, a, i) {
      return uD(e, t, a, i);
    }
    var gE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [ju, wf, Fh, fu, xc, GS]
    };
    function dD(e, t) {
      return gE.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), Zk(e, t);
    }
    function pD(e, t, a) {
      return gE.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), tD(e, t, a);
    }
    function vD(e) {
      return pb() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Wo(e);
    }
    var hD = Jk({
      findFiberByHostInstance: Qs,
      bundleType: 1,
      version: fE,
      rendererPackageName: "react-dom"
    });
    if (!hD && jn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var o0 = window.location.protocol;
      /^(https?|file):$/.test(o0) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (o0 === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ga.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = gE, Ga.createPortal = cD, Ga.createRoot = dD, Ga.findDOMNode = iD, Ga.flushSync = vD, Ga.hydrate = lD, Ga.hydrateRoot = pD, Ga.render = oD, Ga.unmountComponentAtNode = sD, Ga.unstable_batchedUpdates = GS, Ga.unstable_renderSubtreeIntoContainer = fD, Ga.version = fE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Ga;
}
function x0() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(x0);
    } catch (x) {
      console.error(x);
    }
  }
}
process.env.NODE_ENV === "production" ? (x0(), RE.exports = wD()) : RE.exports = TD();
var pl = RE.exports, _E, Zm = pl;
if (process.env.NODE_ENV === "production")
  _E = Zm.createRoot, Zm.hydrateRoot;
else {
  var y0 = Zm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  _E = function(x, E) {
    y0.usingClientEntryPoint = !0;
    try {
      return Zm.createRoot(x, E);
    } finally {
      y0.usingClientEntryPoint = !1;
    }
  };
}
const ty = {
  key: "sr3",
  label: "Shadowrun 3rd Edition",
  isPrimary: !0,
  mockDataLoaded: !0
}, RD = {
  activeEdition: ty,
  setEdition: () => {
  },
  supportedEditions: [ty],
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
}, b0 = F.createContext(RD);
function _D({ children: x }) {
  const [E, b] = F.useState(ty), [q, ee] = F.useState({}), [D, g] = F.useState(null), ae = F.useMemo(
    () => [
      ty,
      {
        key: "sr5",
        label: "Shadowrun 5th Edition",
        isPrimary: !1,
        mockDataLoaded: !0
      }
    ],
    []
  ), L = F.useCallback(
    async (X) => {
      const fe = X ?? E.key;
      if (ee((je) => {
        var oe;
        return {
          ...je,
          [fe]: {
            data: (oe = je[fe]) == null ? void 0 : oe.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        ee((je) => {
          var oe;
          return {
            ...je,
            [fe]: {
              data: (oe = je[fe]) == null ? void 0 : oe.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const je = await fetch(`/api/editions/${fe}/character-creation`);
        if (!je.ok)
          throw new Error(`Failed to load edition data (${je.status})`);
        const oe = await je.json(), Ee = (oe == null ? void 0 : oe.character_creation) ?? oe;
        ee((Se) => ({
          ...Se,
          [fe]: {
            data: Ee,
            loading: !1,
            error: void 0
          }
        }));
      } catch (je) {
        const oe = je instanceof Error ? je.message : "Unknown error loading edition data";
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
  ), z = F.useCallback((X) => `${new Intl.NumberFormat("en-US").format(X)}¥`, []), ge = F.useCallback((X) => JSON.parse(JSON.stringify(X)), []), P = F.useCallback(
    (X, fe) => {
      var oe;
      if (!fe)
        return ge(X);
      const je = ge(X);
      if (fe.resources && ((oe = je.priorities) != null && oe.resources)) {
        const Ee = je.priorities.resources;
        Object.entries(fe.resources).forEach(([Se, le]) => {
          const se = Se;
          typeof le == "number" && Ee[se] && (Ee[se] = {
            ...Ee[se],
            label: z(le)
          });
        });
      }
      return je;
    },
    [ge, z]
  ), W = F.useCallback(
    async (X) => {
      var fe, je;
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
          const Ee = await oe.json(), Se = ((je = (fe = Ee.edition) == null ? void 0 : fe.toLowerCase) == null ? void 0 : je.call(fe)) ?? E.key, le = Ee.edition_data;
          le && ee((se) => {
            var A;
            return {
              ...se,
              [Se]: {
                data: ((A = se[Se]) == null ? void 0 : A.data) ?? le,
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
  ), te = F.useCallback(() => {
    g(null);
  }, []), ne = F.useMemo(() => {
    const X = q[E.key], fe = D && !D.loading && !D.error && D.edition === E.key, je = fe && D.data ? D.data : X == null ? void 0 : X.data, oe = fe ? D == null ? void 0 : D.creationMethod : void 0;
    return {
      activeEdition: E,
      supportedEditions: ae,
      setEdition: (Ee) => {
        const Se = ae.find((le) => le.key === Ee);
        Se ? b(Se) : console.warn(`Edition '${Ee}' is not registered; keeping current edition.`);
      },
      characterCreationData: je,
      reloadEditionData: L,
      loadCampaignCharacterCreation: W,
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
    W,
    L,
    ae
  ]);
  return F.useEffect(() => {
    const X = q[E.key];
    !(X != null && X.data) && !(X != null && X.loading) && L(E.key);
  }, [E.key, q, L]), F.useEffect(() => {
    typeof window > "u" || (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
      loadCampaignCharacterCreation: W,
      clearCampaignCharacterCreation: te
    }));
  }, [te, W]), F.useEffect(() => {
    var oe, Ee, Se, le, se, A;
    const X = q[E.key], fe = D && !D.loading && !D.error && D.edition === E.key, je = fe && D.data ? D.data : X == null ? void 0 : X.data;
    je && typeof window < "u" && ((Ee = (oe = window.ShadowmasterLegacyApp) == null ? void 0 : oe.setEditionData) == null || Ee.call(oe, E.key, je)), typeof window < "u" && (fe ? (le = (Se = window.ShadowmasterLegacyApp) == null ? void 0 : Se.applyCampaignCreationDefaults) == null || le.call(Se, {
      campaignId: D.campaignId,
      edition: D.edition,
      gameplayRules: D.gameplayRules ?? null
    }) : (A = (se = window.ShadowmasterLegacyApp) == null ? void 0 : se.applyCampaignCreationDefaults) == null || A.call(se, null));
  }, [E.key, D, q]), /* @__PURE__ */ p.jsx(b0.Provider, { value: ne, children: x });
}
function kD() {
  const x = F.useContext(b0);
  if (!x)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return x;
}
const w0 = F.createContext(void 0);
function DD(x) {
  if (typeof document > "u")
    return { node: null, created: !1 };
  let E = document.getElementById(x);
  const b = !E;
  return E || (E = document.createElement("div"), E.id = x, document.body.appendChild(E)), { node: E, created: b };
}
const ND = 6e3;
function jD() {
  return typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function OD({ children: x }) {
  const [E, b] = F.useState([]), q = F.useRef(/* @__PURE__ */ new Map()), [ee, D] = F.useState(null);
  F.useEffect(() => {
    const { node: z, created: ge } = DD("shadowmaster-notifications");
    D(z);
    const P = q.current;
    return () => {
      P.forEach((W) => window.clearTimeout(W)), P.clear(), ge && (z != null && z.parentNode) && z.parentNode.removeChild(z);
    };
  }, []);
  const g = F.useCallback((z) => {
    b((P) => P.filter((W) => W.id !== z));
    const ge = q.current.get(z);
    ge && (window.clearTimeout(ge), q.current.delete(z));
  }, []), ae = F.useCallback(
    ({ id: z, type: ge = "info", title: P, description: W, durationMs: te = ND }) => {
      const ne = z ?? jD(), X = {
        id: ne,
        type: ge,
        title: P,
        description: W ?? "",
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
  ), L = F.useMemo(
    () => ({
      pushNotification: ae,
      dismissNotification: g
    }),
    [g, ae]
  );
  return F.useEffect(() => {
    if (typeof window > "u")
      return;
    const z = (ge) => {
      const P = ge;
      P.detail && ae(P.detail);
    };
    return window.addEventListener("shadowmaster:notify", z), window.ShadowmasterNotify = ae, () => {
      window.removeEventListener("shadowmaster:notify", z), window.ShadowmasterNotify === ae && delete window.ShadowmasterNotify;
    };
  }, [ae]), /* @__PURE__ */ p.jsxs(w0.Provider, { value: L, children: [
    x,
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
function T0() {
  const x = F.useContext(w0);
  if (!x)
    throw new Error("useNotifications must be used within a NotificationProvider");
  return x;
}
function CE(x, E) {
  return !!(x != null && x.roles.some((b) => b.toLowerCase() === E.toLowerCase()));
}
async function rv(x, E = {}) {
  const b = new Headers(E.headers || {});
  E.body && !b.has("Content-Type") && b.set("Content-Type", "application/json");
  const q = await fetch(x, {
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
function LD() {
  const [x, E] = F.useState("login"), [b, q] = F.useState(null), [ee, D] = F.useState(!1), [g, ae] = F.useState(!1), [L, z] = F.useState(""), [ge, P] = F.useState(""), [W, te] = F.useState(""), [ne, X] = F.useState(""), [fe, je] = F.useState(""), [oe, Ee] = F.useState(""), [Se, le] = F.useState(""), [se, A] = F.useState(""), [pe, ue] = F.useState(""), be = F.useRef(!1), De = F.useRef(null), Je = "auth-menu-dropdown", re = "auth-menu-heading", { pushNotification: ze } = T0();
  F.useEffect(() => {
    be.current || (be.current = !0, tt());
  }, []), F.useEffect(() => {
    window.ShadowmasterAuth = {
      user: b,
      isAdministrator: CE(b, "administrator"),
      isGamemaster: CE(b, "gamemaster"),
      isPlayer: CE(b, "player")
    }, window.dispatchEvent(new CustomEvent("shadowmaster:auth", { detail: window.ShadowmasterAuth }));
  }, [b]), F.useEffect(() => {
    if (!g)
      return;
    const M = (Ie) => {
      De.current && (De.current.contains(Ie.target) || ae(!1));
    }, Ne = (Ie) => {
      Ie.key === "Escape" && ae(!1);
    };
    return document.addEventListener("mousedown", M), document.addEventListener("keydown", Ne), () => {
      document.removeEventListener("mousedown", M), document.removeEventListener("keydown", Ne);
    };
  }, [g]), F.useEffect(() => {
    if (!g || b)
      return;
    const M = x === "register" ? "register-email" : "login-email", Ne = window.setTimeout(() => {
      const Ie = document.getElementById(M);
      Ie == null || Ie.focus();
    }, 0);
    return () => window.clearTimeout(Ne);
  }, [g, b, x]);
  async function tt() {
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
  async function dt(M) {
    M.preventDefault(), D(!0);
    try {
      const Ne = await rv("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: L,
          password: ge
        })
      });
      q(Ne.user), E("login"), P(""), ae(!1), ze({
        type: "success",
        title: "Signed in",
        description: Ne.user ? `Welcome back, ${Ne.user.username || Ne.user.email}!` : "Signed in successfully."
      });
    } catch (Ne) {
      const Ie = Ne instanceof Error ? Ne.message : "Login failed";
      ze({
        type: "error",
        title: "Login failed",
        description: Ie
      });
    } finally {
      D(!1);
    }
  }
  async function Oe(M) {
    if (M.preventDefault(), fe !== oe) {
      ze({
        type: "warning",
        title: "Passwords do not match",
        description: "Please confirm your password before continuing."
      });
      return;
    }
    D(!0);
    try {
      const Ne = await rv("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: W,
          username: ne,
          password: fe
        })
      });
      q(Ne.user), E("login"), je(""), Ee(""), ze({
        type: "success",
        title: "Account created",
        description: "You can now sign in with your new credentials."
      });
    } catch (Ne) {
      const Ie = Ne instanceof Error ? Ne.message : "Registration failed";
      ze({
        type: "error",
        title: "Registration failed",
        description: Ie
      });
    } finally {
      D(!1);
    }
  }
  async function he() {
    D(!0);
    try {
      await rv("/api/auth/logout", { method: "POST" }), q(null), E("login"), ae(!0), ze({
        type: "success",
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (M) {
      const Ne = M instanceof Error ? M.message : "Logout failed";
      ze({
        type: "error",
        title: "Logout failed",
        description: Ne
      });
    } finally {
      D(!1);
    }
  }
  async function He(M) {
    if (M.preventDefault(), se !== pe) {
      ze({
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
      }), le(""), A(""), ue(""), E("login"), ze({
        type: "success",
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
    } catch (Ne) {
      const Ie = Ne instanceof Error ? Ne.message : "Password update failed";
      ze({
        type: "error",
        title: "Password update failed",
        description: Ie
      });
    } finally {
      D(!1);
    }
  }
  const Re = F.useMemo(() => b ? b.roles.join(", ") : "", [b]), T = b ? `Signed in as ${b.email}.` : "Sign in to manage campaigns, sessions, and characters.";
  return /* @__PURE__ */ p.jsxs("section", { className: `auth-panel${g ? " auth-panel--open" : ""}`, ref: De, children: [
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
                    E(x === "password" ? "login" : "password");
                  },
                  disabled: ee,
                  children: x === "password" ? "Hide Password Form" : "Change Password"
                }
              ),
              /* @__PURE__ */ p.jsx("button", { className: "btn btn-primary", type: "button", onClick: he, disabled: ee, children: "Logout" })
            ] }),
            x === "password" && /* @__PURE__ */ p.jsxs("form", { className: "auth-form", onSubmit: He, children: [
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
                    onChange: (M) => A(M.target.value),
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
            x === "login" && /* @__PURE__ */ p.jsxs("form", { className: "auth-form", onSubmit: dt, children: [
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
            x === "register" && /* @__PURE__ */ p.jsxs("form", { className: "auth-form", onSubmit: Oe, children: [
              /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ p.jsx("label", { htmlFor: "register-email", children: "Email" }),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    id: "register-email",
                    type: "email",
                    value: W,
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
                    onChange: (M) => je(M.target.value),
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
function MD() {
  var E, b;
  if (typeof window.showCreateCharacterModal == "function") {
    window.showCreateCharacterModal();
    return;
  }
  (b = (E = window.ShadowmasterLegacyApp) == null ? void 0 : E.showWizardStep) == null || b.call(E, 1);
  const x = document.getElementById("character-modal");
  x && (x.style.display = "block");
}
function AD() {
  const [x, E] = F.useState(null);
  return F.useEffect(() => {
    E(document.getElementById("characters-actions"));
  }, []), x ? pl.createPortal(
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
          onClick: MD,
          children: "Create Character"
        }
      ) })
    ] }),
    x
  ) : null;
}
function Kf() {
  return kD();
}
const xE = [
  { label: "Priority (default)", value: "priority" },
  { label: "Sum-to-Ten (coming soon)", value: "sum_to_ten" },
  { label: "Karma (coming soon)", value: "karma" }
], bE = ["Basics", "Roster", "World", "Automation", "Session Seed", "Review"], zD = [
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
], UD = [
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
function lv(x) {
  return typeof crypto < "u" && crypto.randomUUID ? `${x}-${crypto.randomUUID()}` : `${x}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
const g0 = {
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
function FD(x, E) {
  switch (E.type) {
    case "RESET":
      return E.payload;
    case "UPDATE_FIELD":
      return {
        ...x,
        [E.field]: E.value
      };
    case "UPDATE_PLACEHOLDER":
      return {
        ...x,
        placeholders: x.placeholders.map(
          (b) => b.id === E.id ? { ...b, [E.field]: E.value } : b
        )
      };
    case "ADD_PLACEHOLDER":
      return {
        ...x,
        placeholders: [
          ...x.placeholders,
          {
            id: lv("placeholder"),
            name: "Runner Placeholder",
            role: "Unassigned"
          }
        ]
      };
    case "REMOVE_PLACEHOLDER":
      return {
        ...x,
        placeholders: x.placeholders.filter((b) => b.id !== E.id)
      };
    case "UPDATE_FACTION":
      return {
        ...x,
        factions: x.factions.map(
          (b) => b.id === E.id ? { ...b, [E.field]: E.value } : b
        )
      };
    case "ADD_FACTION":
      return {
        ...x,
        factions: [
          ...x.factions,
          {
            id: lv("faction"),
            name: "",
            tags: "",
            notes: ""
          }
        ]
      };
    case "REMOVE_FACTION":
      return {
        ...x,
        factions: x.factions.filter((b) => b.id !== E.id)
      };
    case "UPDATE_LOCATION":
      return {
        ...x,
        locations: x.locations.map(
          (b) => b.id === E.id ? { ...b, [E.field]: E.value } : b
        )
      };
    case "ADD_LOCATION":
      return {
        ...x,
        locations: [
          ...x.locations,
          {
            id: lv("location"),
            name: "",
            descriptor: ""
          }
        ]
      };
    case "REMOVE_LOCATION":
      return {
        ...x,
        locations: x.locations.filter((b) => b.id !== E.id)
      };
    case "UPDATE_HOUSE_RULE":
      return {
        ...x,
        houseRules: {
          ...x.houseRules,
          [E.key]: E.value
        }
      };
    case "UPDATE_SESSION_SEED":
      return {
        ...x,
        sessionSeed: {
          ...x.sessionSeed,
          [E.field]: E.value
        }
      };
    default:
      return x;
  }
}
function PD({ targetId: x = "campaign-creation-react-root", onCreated: E }) {
  const {
    activeEdition: b,
    supportedEditions: q,
    characterCreationData: ee,
    reloadEditionData: D,
    setEdition: g
  } = Kf(), [ae, L] = F.useState(null), [z, ge] = F.useState(b.key), [P, W] = F.useState(ee), [te, ne] = F.useState([]), [X, fe] = F.useState([]), [je, oe] = F.useState(""), [Ee, Se] = F.useState("experienced"), [le, se] = F.useState("priority"), [A, pe] = F.useState([]), [ue, be] = F.useState({}), [De, Je] = F.useState(xE), [re, ze] = F.useState(!1), [tt, dt] = F.useState(!1), [Oe, he] = F.useState(null), [He, Re] = F.useState(0), [T, M] = F.useReducer(FD, g0), { pushNotification: Ne } = T0(), Ie = bE.length;
  F.useEffect(() => {
    L(document.getElementById(x));
  }, [x]), F.useEffect(() => {
    ge(b.key);
  }, [b.key]), F.useEffect(() => {
    async function Ge(G) {
      var Xe;
      try {
        const Lt = await fetch(`/api/editions/${G}/character-creation`);
        if (!Lt.ok)
          throw new Error(`Failed to load edition data (${Lt.status})`);
        const wn = await Lt.json(), Jt = (wn == null ? void 0 : wn.character_creation) ?? wn;
        W(Jt), be(Jt.creation_methods ?? {});
        const vn = Object.entries(Jt.gameplay_levels ?? {}).map(([On, { label: rr }]) => ({
          value: On,
          label: rr || On
        }));
        ne(vn), vn.some((On) => On.value === Ee) || Se(((Xe = vn[0]) == null ? void 0 : Xe.value) ?? "experienced");
      } catch (Lt) {
        console.error("Failed to load edition data", Lt);
      }
    }
    Ge(z);
  }, [z, Ee]), F.useEffect(() => {
    async function Ge() {
      try {
        const G = await fetch("/api/users?role=gamemaster,administrator");
        if (!G.ok)
          throw new Error(`Failed to load users (${G.status})`);
        const Xe = await G.json();
        if (!Array.isArray(Xe) || Xe.length === 0) {
          pe([]);
          return;
        }
        pe(Xe), Xe.length > 0 && oe((Lt) => Lt || Xe[0].id);
      } catch (G) {
        console.error("Failed to load users", G), pe([]);
      }
    }
    Ge();
  }, []), F.useEffect(() => {
    async function Ge() {
      try {
        const G = await fetch("/api/characters");
        if (!G.ok)
          throw new Error(`Failed to load characters (${G.status})`);
        const Xe = await G.json();
        if (!Array.isArray(Xe)) {
          fe([]);
          return;
        }
        fe(Xe);
      } catch (G) {
        console.error("Failed to load characters", G), fe([]);
      }
    }
    Ge();
  }, []), F.useEffect(() => {
    !P && ee && (W(ee), be(ee.creation_methods ?? {}));
  }, [ee, P]), F.useEffect(() => {
    if (!P && Object.keys(ue).length === 0) {
      Je(xE);
      return;
    }
    if (!ue || Object.keys(ue).length === 0) {
      Je(xE);
      return;
    }
    const Ge = Object.entries(ue).map(([G, Xe]) => ({
      value: G,
      label: Xe.label || G
    }));
    Je(Ge);
  }, [ue, P]), F.useEffect(() => {
    De.length !== 0 && (De.some((Ge) => Ge.value === le) || se(De[0].value));
  }, [De, le]);
  const bt = F.useMemo(() => q.map((Ge) => ({
    label: Ge.label,
    value: Ge.key
  })), [q]), gt = F.useMemo(() => A.length === 0 ? [{ label: "No gamemasters found", value: "" }] : A.map((Ge) => ({
    label: `${Ge.username} (${Ge.email})`,
    value: Ge.id
  })), [A]), vt = F.useCallback(() => {
    var Ge, G;
    M({ type: "RESET", payload: { ...g0 } }), Se("experienced"), se(((Ge = De[0]) == null ? void 0 : Ge.value) ?? "priority"), oe(((G = A[0]) == null ? void 0 : G.id) ?? ""), he(null), Re(0);
  }, [De, A]);
  function Ct() {
    ge(b.key), vt(), ze(!0);
  }
  function wt() {
    vt(), ze(!1);
  }
  function Bt(Ge) {
    return Ge === 0 && !T.name.trim() ? (he("Campaign name is required."), !1) : Ge === 1 && T.selectedPlayers.length === 0 && T.placeholders.length === 0 ? (he("Select at least one existing character or create a placeholder runner."), !1) : Ge === 2 && T.factions.length === 0 && T.locations.length === 0 ? (he("Add at least one faction or location, or use the quick-add template."), !1) : Ge === 4 && !T.sessionSeed.skip && !T.sessionSeed.title.trim() ? (he("Provide a title for the initial session or choose to skip."), !1) : (he(null), !0);
  }
  const jn = () => {
    Bt(He) && Re((Ge) => Math.min(Ge + 1, bE.length - 1));
  }, cr = F.useCallback(() => {
    const Ge = lv("faction");
    M({ type: "ADD_FACTION" }), M({
      type: "UPDATE_FACTION",
      id: Ge,
      field: "name",
      value: "Ares Macrotechnology"
    }), M({
      type: "UPDATE_FACTION",
      id: Ge,
      field: "tags",
      value: "Corporate, AAA"
    }), M({
      type: "UPDATE_FACTION",
      id: Ge,
      field: "notes",
      value: "Megacorp interested in experimental weapons testing."
    });
  }, []), bn = F.useCallback(() => {
    const Ge = lv("location");
    M({ type: "ADD_LOCATION" }), M({
      type: "UPDATE_LOCATION",
      id: Ge,
      field: "name",
      value: "Downtown Seattle Safehouse"
    }), M({
      type: "UPDATE_LOCATION",
      id: Ge,
      field: "descriptor",
      value: "Secure condo with rating 4 security and friendly neighbors."
    });
  }, []), Xn = () => {
    he(null), Re((Ge) => Math.max(Ge - 1, 0));
  };
  async function Mn(Ge) {
    var G, Xe;
    if (Ge.preventDefault(), !!Bt(He)) {
      dt(!0), he(null);
      try {
        const Lt = A.find((hn) => hn.id === je), wn = T.name.trim() || "Campaign", Jt = {
          automation: T.houseRules,
          notes: T.houseRuleNotes,
          theme: T.theme,
          factions: T.factions,
          locations: T.locations,
          placeholders: T.placeholders,
          session_seed: T.sessionSeed
        }, vn = await fetch("/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: T.name.trim(),
            description: T.description,
            gm_user_id: je,
            gm_name: (Lt == null ? void 0 : Lt.username) ?? (Lt == null ? void 0 : Lt.email) ?? "",
            edition: z,
            gameplay_level: Ee,
            creation_method: le,
            house_rules: JSON.stringify(Jt),
            status: "Active"
          })
        });
        if (!vn.ok) {
          const hn = await vn.text();
          throw new Error(hn || `Failed to create campaign (${vn.status})`);
        }
        const On = await vn.json(), rr = [];
        if (T.placeholders.length > 0)
          try {
            await Promise.all(
              T.placeholders.map(async (hn) => {
                const Te = await fetch("/api/characters", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: hn.name,
                    player_name: hn.role,
                    status: "Placeholder",
                    edition: z,
                    edition_data: {},
                    is_npc: !0,
                    campaign_id: On.id
                  })
                });
                if (!Te.ok) {
                  const qe = await Te.text();
                  throw new Error(qe || `Failed to create placeholder (${Te.status})`);
                }
              })
            );
          } catch (hn) {
            console.error("Failed to create placeholder characters", hn), rr.push("Placeholder runners were not saved.");
          }
        if (!T.sessionSeed.skip)
          try {
            const hn = await fetch("/api/sessions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                campaign_id: On.id,
                name: T.sessionSeed.title || "Session 0",
                description: T.sessionSeed.objectives,
                notes: T.sessionSeed.summary,
                session_date: (/* @__PURE__ */ new Date()).toISOString(),
                status: "Planned"
              })
            });
            if (!hn.ok) {
              const Te = await hn.text();
              throw new Error(Te || `Failed to create session seed (${hn.status})`);
            }
          } catch (hn) {
            console.error("Failed to create session seed", hn), rr.push("Session seed could not be created automatically.");
          }
        vt(), (Xe = (G = window.ShadowmasterLegacyApp) == null ? void 0 : G.loadCampaigns) == null || Xe.call(G), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), E == null || E(On), ze(!1), Ne({
          type: "success",
          title: `${wn} created`,
          description: "Campaign is ready for onboarding."
        }), rr.length > 0 && Ne({
          type: "warning",
          title: "Campaign created with warnings",
          description: rr.join(`
`)
        });
      } catch (Lt) {
        const wn = Lt instanceof Error ? Lt.message : "Failed to create campaign.";
        he(wn), Ne({
          type: "error",
          title: "Campaign creation failed",
          description: wn
        });
      } finally {
        dt(!1);
      }
    }
  }
  const En = ue[le], Rr = () => {
    var Ge;
    switch (He) {
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
                  onChange: (G) => M({ type: "UPDATE_FIELD", field: "name", value: G.target.value }),
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
                  onChange: (G) => M({ type: "UPDATE_FIELD", field: "theme", value: G.target.value }),
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
                  onChange: (G) => {
                    const Xe = G.target.value;
                    ge(Xe), g(Xe), D(Xe);
                  },
                  children: bt.map((G) => /* @__PURE__ */ p.jsx("option", { value: G.value, children: G.label }, G.value))
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
                  onChange: (G) => Se(G.target.value),
                  children: te.map((G) => /* @__PURE__ */ p.jsx("option", { value: G.value, children: G.label }, G.value))
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
                onChange: (G) => se(G.target.value),
                children: De.map((G) => /* @__PURE__ */ p.jsx("option", { value: G.value, children: G.label }, G.value))
              }
            ),
            /* @__PURE__ */ p.jsxs("div", { className: "form-help", children: [
              (En == null ? void 0 : En.description) && /* @__PURE__ */ p.jsx("p", { children: En.description }),
              le !== "priority" && /* @__PURE__ */ p.jsx("p", { children: "Support for Sum-to-Ten and Karma methods is still under development. Characters will temporarily default to Priority until the new workflows are implemented." })
            ] })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ p.jsx("label", { htmlFor: "campaign-gm", children: "Gamemaster" }),
            /* @__PURE__ */ p.jsx(
              "select",
              {
                id: "campaign-gm",
                name: "campaign-gm",
                value: je,
                onChange: (G) => oe(G.target.value),
                children: gt.map((G) => /* @__PURE__ */ p.jsx("option", { value: G.value, children: G.label }, G.value))
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
                onChange: (G) => M({ type: "UPDATE_FIELD", field: "description", value: G.target.value }),
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
            X.length === 0 ? /* @__PURE__ */ p.jsx("p", { className: "form-help", children: "No characters found yet. You can create placeholders below." }) : /* @__PURE__ */ p.jsx("div", { className: "character-checkboxes", children: X.map((G) => {
              const Xe = G.player_name ? `${G.name} — ${G.player_name}` : G.name, Lt = T.selectedPlayers.includes(G.id);
              return /* @__PURE__ */ p.jsxs("label", { className: "character-checkbox", children: [
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Lt,
                    onChange: (wn) => {
                      M({
                        type: "UPDATE_FIELD",
                        field: "selectedPlayers",
                        value: wn.target.checked ? [...T.selectedPlayers, G.id] : T.selectedPlayers.filter((Jt) => Jt !== G.id)
                      });
                    }
                  }
                ),
                /* @__PURE__ */ p.jsx("span", { children: Xe }),
                G.status && /* @__PURE__ */ p.jsx("small", { className: "character-status", children: G.status })
              ] }, G.id);
            }) })
          ] }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ p.jsx("label", { children: "Player Characters" }),
            /* @__PURE__ */ p.jsx("p", { className: "form-help", children: "Player selection is coming soon. Use placeholders to capture your expected team composition." }),
            /* @__PURE__ */ p.jsxs("div", { className: "placeholder-list", children: [
              T.placeholders.map((G) => /* @__PURE__ */ p.jsxs("div", { className: "placeholder-card", children: [
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    value: G.name,
                    onChange: (Xe) => M({
                      type: "UPDATE_PLACEHOLDER",
                      id: G.id,
                      field: "name",
                      value: Xe.target.value
                    }),
                    placeholder: "Runner handle"
                  }
                ),
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    value: G.role,
                    onChange: (Xe) => M({
                      type: "UPDATE_PLACEHOLDER",
                      id: G.id,
                      field: "role",
                      value: Xe.target.value
                    }),
                    placeholder: "Role / specialty"
                  }
                ),
                /* @__PURE__ */ p.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-link",
                    onClick: () => M({ type: "REMOVE_PLACEHOLDER", id: G.id }),
                    children: "Remove"
                  }
                )
              ] }, G.id)),
              /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: () => M({ type: "ADD_PLACEHOLDER" }), children: "Add Placeholder" })
            ] })
          ] })
        ] });
      case 2:
        return /* @__PURE__ */ p.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "World Backbone" }),
          /* @__PURE__ */ p.jsx("p", { children: "Capture recurring factions and key locations to anchor your campaign." }),
          Oe && /* @__PURE__ */ p.jsx("p", { className: "form-error", children: Oe }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { children: "Factions" }),
              /* @__PURE__ */ p.jsxs("div", { className: "backbone-list", children: [
                T.factions.map((G) => /* @__PURE__ */ p.jsxs("div", { className: "backbone-card", children: [
                  /* @__PURE__ */ p.jsx(
                    "input",
                    {
                      value: G.name,
                      onChange: (Xe) => M({
                        type: "UPDATE_FACTION",
                        id: G.id,
                        field: "name",
                        value: Xe.target.value
                      }),
                      placeholder: "Faction name"
                    }
                  ),
                  /* @__PURE__ */ p.jsx(
                    "input",
                    {
                      value: G.tags,
                      onChange: (Xe) => M({
                        type: "UPDATE_FACTION",
                        id: G.id,
                        field: "tags",
                        value: Xe.target.value
                      }),
                      placeholder: "Tags (corp, gang, fixer...)"
                    }
                  ),
                  /* @__PURE__ */ p.jsx(
                    "textarea",
                    {
                      value: G.notes,
                      onChange: (Xe) => M({
                        type: "UPDATE_FACTION",
                        id: G.id,
                        field: "notes",
                        value: Xe.target.value
                      }),
                      placeholder: "Notes / agenda"
                    }
                  ),
                  /* @__PURE__ */ p.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn-link",
                      onClick: () => M({ type: "REMOVE_FACTION", id: G.id }),
                      children: "Remove"
                    }
                  )
                ] }, G.id)),
                /* @__PURE__ */ p.jsxs("div", { className: "backbone-actions", children: [
                  /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: () => M({ type: "ADD_FACTION" }), children: "Add Faction" }),
                  /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-link", onClick: cr, children: "Quick-add template" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { children: "Locations" }),
              /* @__PURE__ */ p.jsxs("div", { className: "backbone-list", children: [
                T.locations.map((G) => /* @__PURE__ */ p.jsxs("div", { className: "backbone-card", children: [
                  /* @__PURE__ */ p.jsx(
                    "input",
                    {
                      value: G.name,
                      onChange: (Xe) => M({
                        type: "UPDATE_LOCATION",
                        id: G.id,
                        field: "name",
                        value: Xe.target.value
                      }),
                      placeholder: "Location name"
                    }
                  ),
                  /* @__PURE__ */ p.jsx(
                    "textarea",
                    {
                      value: G.descriptor,
                      onChange: (Xe) => M({
                        type: "UPDATE_LOCATION",
                        id: G.id,
                        field: "descriptor",
                        value: Xe.target.value
                      }),
                      placeholder: "Descriptor (security rating, vibe...)"
                    }
                  ),
                  /* @__PURE__ */ p.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn-link",
                      onClick: () => M({ type: "REMOVE_LOCATION", id: G.id }),
                      children: "Remove"
                    }
                  )
                ] }, G.id)),
                /* @__PURE__ */ p.jsxs("div", { className: "backbone-actions", children: [
                  /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: () => M({ type: "ADD_LOCATION" }), children: "Add Location" }),
                  /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-link", onClick: bn, children: "Quick-add template" })
                ] })
              ] })
            ] })
          ] })
        ] });
      case 3:
        return /* @__PURE__ */ p.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "House Rules & Automation" }),
          /* @__PURE__ */ p.jsx("p", { children: "Toggle planned automation modules or make notes about house rules you plan to apply." }),
          /* @__PURE__ */ p.jsx("div", { className: "automation-grid", children: zD.map((G) => /* @__PURE__ */ p.jsxs("label", { className: "automation-toggle", children: [
            /* @__PURE__ */ p.jsx(
              "input",
              {
                type: "checkbox",
                checked: !!T.houseRules[G.key],
                onChange: (Xe) => M({
                  type: "UPDATE_HOUSE_RULE",
                  key: G.key,
                  value: Xe.target.checked
                })
              }
            ),
            /* @__PURE__ */ p.jsxs("div", { children: [
              /* @__PURE__ */ p.jsx("strong", { children: G.label }),
              /* @__PURE__ */ p.jsx("p", { children: G.description })
            ] })
          ] }, G.key)) }),
          /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ p.jsx("label", { htmlFor: "house-rule-notes", children: "House Rule Notes" }),
            /* @__PURE__ */ p.jsx(
              "textarea",
              {
                id: "house-rule-notes",
                value: T.houseRuleNotes,
                onChange: (G) => M({ type: "UPDATE_FIELD", field: "houseRuleNotes", value: G.target.value }),
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
                onChange: (G) => M({
                  type: "UPDATE_SESSION_SEED",
                  field: "skip",
                  value: G.target.checked
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
                  onChange: (G) => M({
                    type: "UPDATE_SESSION_SEED",
                    field: "title",
                    value: G.target.value
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
                  onChange: (G) => M({
                    type: "UPDATE_SESSION_SEED",
                    field: "objectives",
                    value: G.target.value
                  }),
                  placeholder: "List your opening beats, key NPCs, or complications.",
                  rows: 4
                }
              )
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { children: "Scene Template" }),
              /* @__PURE__ */ p.jsx("div", { className: "session-template-options", children: UD.map((G) => /* @__PURE__ */ p.jsxs("label", { className: "session-template", children: [
                /* @__PURE__ */ p.jsx(
                  "input",
                  {
                    type: "radio",
                    name: "session-template",
                    value: G.value,
                    checked: T.sessionSeed.sceneTemplate === G.value,
                    onChange: (Xe) => M({
                      type: "UPDATE_SESSION_SEED",
                      field: "sceneTemplate",
                      value: Xe.target.value
                    })
                  }
                ),
                /* @__PURE__ */ p.jsxs("div", { children: [
                  /* @__PURE__ */ p.jsx("strong", { children: G.label }),
                  /* @__PURE__ */ p.jsx("p", { children: G.description })
                ] })
              ] }, G.value)) })
            ] }),
            /* @__PURE__ */ p.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ p.jsx("label", { htmlFor: "session-summary", children: "Session Summary (what happened)" }),
              /* @__PURE__ */ p.jsx(
                "textarea",
                {
                  id: "session-summary",
                  value: T.sessionSeed.summary,
                  onChange: (G) => M({
                    type: "UPDATE_SESSION_SEED",
                    field: "summary",
                    value: G.target.value
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
                  /* @__PURE__ */ p.jsx("strong", { children: "GM:" }),
                  " ",
                  ((Ge = gt.find((G) => G.value === je)) == null ? void 0 : Ge.label) ?? "Unassigned"
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
                T.placeholders.length > 0 && `(${T.placeholders.map((G) => G.name).join(", ")})`
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
                Object.entries(T.houseRules).filter(([, G]) => G).map(([G]) => G.replace(/_/g, " ")).join(", ") || "None"
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
  }, _a = He === 0, Or = He === Ie - 1;
  return ae ? pl.createPortal(
    /* @__PURE__ */ p.jsx(
      "section",
      {
        className: `campaign-create-react ${re ? "campaign-create-react--open" : "campaign-create-react--collapsed"}`,
        children: re ? /* @__PURE__ */ p.jsxs("div", { className: "campaign-wizard", children: [
          /* @__PURE__ */ p.jsxs("div", { className: "campaign-wizard__header", children: [
            /* @__PURE__ */ p.jsx("h3", { children: "Create Campaign" }),
            /* @__PURE__ */ p.jsx("nav", { className: "campaign-wizard__navigation", "aria-label": "Campaign creation steps", children: bE.map((Ge, G) => /* @__PURE__ */ p.jsxs(
              "button",
              {
                type: "button",
                className: `campaign-wizard__step ${He === G ? "campaign-wizard__step--active" : ""} ${He > G ? "campaign-wizard__step--completed" : ""}`,
                onClick: () => Re(G),
                children: [
                  /* @__PURE__ */ p.jsx("span", { className: "campaign-wizard__step-index", children: G + 1 }),
                  /* @__PURE__ */ p.jsx("span", { children: Ge })
                ]
              },
              Ge
            )) })
          ] }),
          /* @__PURE__ */ p.jsxs("form", { className: "campaign-wizard__form", onSubmit: Mn, children: [
            Rr(),
            Oe && /* @__PURE__ */ p.jsx("p", { className: "form-error", children: Oe }),
            /* @__PURE__ */ p.jsxs("div", { className: "campaign-wizard__actions", children: [
              /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: wt, disabled: tt, children: "Cancel" }),
              /* @__PURE__ */ p.jsxs("div", { className: "campaign-wizard__actions-right", children: [
                !_a && /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-secondary", onClick: Xn, disabled: tt, children: "Back" }),
                Or ? /* @__PURE__ */ p.jsx("button", { type: "submit", className: "btn-primary", disabled: tt, children: tt ? "Creating…" : "Create Campaign" }) : /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-primary", onClick: jn, disabled: tt, children: "Next" })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ p.jsxs("div", { className: "campaign-create-trigger", children: [
          /* @__PURE__ */ p.jsxs("div", { className: "campaign-create-trigger__copy", children: [
            /* @__PURE__ */ p.jsx("h3", { children: "Plan Your Next Campaign" }),
            /* @__PURE__ */ p.jsx("p", { children: "Select an edition, assign a GM, and lock in gameplay defaults." })
          ] }),
          /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn-primary", onClick: Ct, children: "Create Campaign" })
        ] })
      }
    ),
    ae
  ) : null;
}
function HD(x, E, b) {
  const q = b === "asc" ? 1 : -1, ee = (ae) => ae instanceof Date ? ae.getTime() : typeof ae == "number" ? ae : typeof ae == "boolean" ? ae ? 1 : 0 : ae == null ? "" : String(ae).toLowerCase(), D = ee(x), g = ee(E);
  return D < g ? -1 * q : D > g ? 1 * q : 0;
}
function VD({
  columns: x,
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
  const ge = F.useMemo(
    () => x.filter((se) => se.sortable),
    [x]
  ), P = ae ?? ((Se = ge[0]) == null ? void 0 : Se.key) ?? ((le = x[0]) == null ? void 0 : le.key) ?? "", [W, te] = F.useState(P), [ne, X] = F.useState(L), [fe, je] = F.useState(""), oe = F.useMemo(() => {
    const se = x.filter((be) => be.searchable !== !1), A = E.filter((be) => !D || !fe.trim() ? !0 : se.some((De) => {
      const Je = De.accessor, re = Je ? Je(be) : be[De.key];
      return re == null ? !1 : String(re).toLowerCase().includes(fe.toLowerCase());
    }));
    if (!W)
      return A;
    const pe = x.find((be) => be.key === W);
    if (!pe)
      return A;
    const ue = pe.accessor;
    return [...A].sort((be, De) => {
      const Je = ue ? ue(be) : be[W], re = ue ? ue(De) : De[W];
      return HD(Je, re, ne);
    });
  }, [x, E, D, fe, ne, W]);
  function Ee(se) {
    W === se ? X((A) => A === "asc" ? "desc" : "asc") : (te(se), X("asc"));
  }
  return /* @__PURE__ */ p.jsxs("div", { className: "data-table-wrapper", children: [
    D && x.length > 0 && /* @__PURE__ */ p.jsx("div", { className: "data-table-toolbar", children: /* @__PURE__ */ p.jsx(
      "input",
      {
        type: "search",
        placeholder: g,
        value: fe,
        onChange: (se) => je(se.target.value),
        "aria-label": "Search table"
      }
    ) }),
    /* @__PURE__ */ p.jsx("div", { className: "data-table-container", children: /* @__PURE__ */ p.jsxs("table", { className: "data-table", children: [
      /* @__PURE__ */ p.jsx("thead", { children: /* @__PURE__ */ p.jsx("tr", { children: x.map((se) => {
        const A = se.sortable !== !1, pe = se.key === W;
        return /* @__PURE__ */ p.jsxs(
          "th",
          {
            style: { width: se.width },
            className: [
              se.align ? `align-${se.align}` : "",
              A ? "sortable" : "",
              pe ? `sorted-${ne}` : ""
            ].filter(Boolean).join(" "),
            onClick: () => {
              A && Ee(se.key);
            },
            children: [
              /* @__PURE__ */ p.jsx("span", { children: se.header }),
              A && /* @__PURE__ */ p.jsx("span", { className: "sort-indicator", "aria-hidden": "true", children: pe ? ne === "asc" ? "▲" : "▼" : "↕" })
            ]
          },
          se.key
        );
      }) }) }),
      /* @__PURE__ */ p.jsx("tbody", { children: q ? /* @__PURE__ */ p.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ p.jsx("td", { colSpan: x.length, children: "Loading…" }) }) : oe.length === 0 ? /* @__PURE__ */ p.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ p.jsx("td", { colSpan: x.length, children: ee || "No records found." }) }) : oe.map((se, A) => /* @__PURE__ */ p.jsx("tr", { className: z == null ? void 0 : z(se), children: x.map((pe) => /* @__PURE__ */ p.jsx("td", { className: pe.align ? `align-${pe.align}` : void 0, children: pe.render ? pe.render(se) : se[pe.key] }, pe.key)) }, b(se, A))) })
    ] }) })
  ] });
}
function BD(x) {
  if (!x)
    return "—";
  const E = Date.parse(x);
  return Number.isNaN(E) ? x : new Date(E).toLocaleDateString();
}
function ID({
  campaigns: x,
  loading: E,
  error: b,
  onEdit: q,
  onDelete: ee,
  currentUser: D,
  actionInFlightId: g
}) {
  const ae = F.useMemo(
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
        render: (L) => BD(L.updated_at)
      },
      {
        key: "actions",
        header: "Actions",
        sortable: !1,
        align: "right",
        render: (L) => {
          var te, ne, X;
          const z = L.can_edit || L.can_delete || (D == null ? void 0 : D.isAdministrator) || L.gm_user_id && ((te = D == null ? void 0 : D.user) == null ? void 0 : te.id) === L.gm_user_id, ge = g === L.id, P = (L.can_edit ?? !1) || (D == null ? void 0 : D.isAdministrator) || L.gm_user_id && ((ne = D == null ? void 0 : D.user) == null ? void 0 : ne.id) === L.gm_user_id, W = (L.can_delete ?? !1) || (D == null ? void 0 : D.isAdministrator) || L.gm_user_id && ((X = D == null ? void 0 : D.user) == null ? void 0 : X.id) === L.gm_user_id;
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
                disabled: ge || !z || !W,
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
      VD,
      {
        columns: ae,
        data: x,
        loading: E,
        getRowId: (L) => L.id,
        emptyState: "No campaigns yet. Create one to get started!",
        searchPlaceholder: "Search campaigns…"
      }
    )
  ] });
}
const $D = ["Active", "Paused", "Completed"];
function YD({ campaign: x, gmUsers: E, gameplayRules: b, onClose: q, onSave: ee }) {
  const { loadCampaignCharacterCreation: D } = Kf(), [g, ae] = F.useState(x.name), [L, z] = F.useState(x.gm_user_id ?? ""), [ge, P] = F.useState(x.status ?? "Active"), [W, te] = F.useState(x.house_rules ?? ""), [ne, X] = F.useState(x.gameplay_level ?? "experienced"), [fe, je] = F.useState(!1), [oe, Ee] = F.useState(null), Se = F.useMemo(() => E.length === 0 ? [{ label: "No gamemasters found", value: "" }] : E.map((A) => ({
    label: `${A.username} (${A.email})`,
    value: A.id
  })), [E]);
  F.useEffect(() => {
    ae(x.name), z(x.gm_user_id ?? ""), P(x.status ?? "Active"), te(x.house_rules ?? ""), X(x.gameplay_level ?? "experienced");
  }, [x]);
  const le = fe || g.trim().length === 0 || E.length > 0 && !L;
  async function se(A) {
    if (A.preventDefault(), !le) {
      je(!0), Ee(null);
      try {
        const pe = E.find((ue) => ue.id === L);
        await ee({
          name: g.trim(),
          gm_user_id: L || void 0,
          gm_name: (pe == null ? void 0 : pe.username) ?? (pe == null ? void 0 : pe.email) ?? "",
          status: ge,
          house_rules: W,
          gameplay_level: ne
        }), await D(x.id), q();
      } catch (pe) {
        const ue = pe instanceof Error ? pe.message : "Failed to update campaign.";
        Ee(ue);
      } finally {
        je(!1);
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
            onChange: (A) => ae(A.target.value),
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
            onChange: (A) => z(A.target.value),
            children: Se.map((A) => /* @__PURE__ */ p.jsx("option", { value: A.value, children: A.label }, A.value))
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
            onChange: (A) => P(A.target.value),
            children: $D.map((A) => /* @__PURE__ */ p.jsx("option", { value: A, children: A }, A))
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
            onChange: (A) => X(A.target.value),
            children: /* @__PURE__ */ p.jsx("option", { value: x.gameplay_level ?? "experienced", children: (b == null ? void 0 : b.label) || x.gameplay_level || "Experienced" })
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
            value: W,
            onChange: (A) => te(A.target.value)
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
const QD = "campaigns-list";
async function ey(x, E = {}) {
  const b = new Headers(E.headers || {});
  E.body && !b.has("Content-Type") && b.set("Content-Type", "application/json");
  const q = await fetch(x, {
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
function WD({ targetId: x = QD }) {
  const [E, b] = F.useState(null), [q, ee] = F.useState([]), [D, g] = F.useState(!1), [ae, L] = F.useState(null), [z, ge] = F.useState(null), [P, W] = F.useState(null), [te, ne] = F.useState(null), [X, fe] = F.useState(null), [je, oe] = F.useState([]), [Ee, Se] = F.useState(
    window.ShadowmasterAuth ?? null
  );
  F.useEffect(() => {
    b(document.getElementById(x));
  }, [x]), F.useEffect(() => (document.body.classList.add("react-campaign-enabled"), () => {
    document.body.classList.remove("react-campaign-enabled");
  }), []);
  const le = F.useCallback(async () => {
    g(!0), L(null);
    try {
      const ue = await ey("/api/campaigns");
      ee(Array.isArray(ue) ? ue : []);
    } catch (ue) {
      const be = ue instanceof Error ? ue.message : "Failed to load campaigns.";
      L(be), ee([]);
    } finally {
      g(!1);
    }
  }, []), se = F.useCallback(async () => {
    try {
      const ue = await ey("/api/users?role=gamemaster,administrator");
      oe(Array.isArray(ue) ? ue : []);
    } catch (ue) {
      console.warn("Failed to load gamemaster roster", ue), oe([]);
    }
  }, []);
  F.useEffect(() => {
    le(), se();
  }, [le, se]), F.useEffect(() => {
    const ue = () => {
      le();
    };
    return window.addEventListener("shadowmaster:campaigns:refresh", ue), () => {
      window.removeEventListener("shadowmaster:campaigns:refresh", ue);
    };
  }, [le]), F.useEffect(() => (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
    loadCampaigns: () => {
      le();
    }
  }), () => {
    window.ShadowmasterLegacyApp && (window.ShadowmasterLegacyApp.loadCampaigns = void 0);
  }), [le]), F.useEffect(() => {
    const ue = (be) => {
      const De = be.detail;
      Se(De ?? null);
    };
    return window.addEventListener("shadowmaster:auth", ue), () => {
      window.removeEventListener("shadowmaster:auth", ue);
    };
  }, []), F.useEffect(() => {
    if (!P)
      return;
    const ue = window.setTimeout(() => W(null), 4e3);
    return () => window.clearTimeout(ue);
  }, [P]);
  const A = F.useCallback(
    async (ue) => {
      if (!(!ue.can_delete && !(Ee != null && Ee.isAdministrator) || !window.confirm(
        `Delete campaign "${ue.name}"? This action cannot be undone.`
      ))) {
        ge(null), W(null), ne(ue.id);
        try {
          await ey(`/api/campaigns/${ue.id}`, { method: "DELETE" }), W(`Campaign "${ue.name}" deleted.`), await le(), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh"));
        } catch (De) {
          const Je = De instanceof Error ? De.message : "Failed to delete campaign.";
          ge(Je);
        } finally {
          ne(null);
        }
      }
    },
    [Ee == null ? void 0 : Ee.isAdministrator, le]
  ), pe = F.useCallback(
    async (ue) => {
      if (X) {
        ge(null), W(null), ne(X.id);
        try {
          const be = JSON.stringify({
            name: ue.name,
            gm_name: ue.gm_name,
            gm_user_id: ue.gm_user_id,
            status: ue.status,
            house_rules: ue.house_rules,
            gameplay_level: ue.gameplay_level
          }), De = await ey(`/api/campaigns/${X.id}`, {
            method: "PUT",
            body: be
          });
          ee(
            (Je) => Je.map((re) => re.id === De.id ? De : re)
          ), W(`Campaign "${De.name}" updated.`), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), fe(null);
        } catch (be) {
          const De = be instanceof Error ? be.message : "Failed to update campaign.";
          ge(De);
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
        ID,
        {
          campaigns: q,
          loading: D,
          error: ae,
          onEdit: (ue) => fe(ue),
          onDelete: A,
          currentUser: Ee,
          actionInFlightId: te
        }
      ),
      X && /* @__PURE__ */ p.jsx(
        YD,
        {
          campaign: X,
          gmUsers: je,
          gameplayRules: X.gameplay_rules,
          onClose: () => fe(null),
          onSave: pe
        }
      )
    ] }),
    E
  ) : null;
}
const ny = [
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
function GD() {
  const x = window.location.hash.replace("#", "").toLowerCase(), E = ny.find((b) => b.key === x);
  return (E == null ? void 0 : E.key) ?? "characters";
}
function KD(x) {
  F.useEffect(() => {
    ny.forEach(({ key: E, targetId: b }) => {
      const q = document.getElementById(b);
      q && (E === x ? (q.removeAttribute("hidden"), q.classList.add("main-tab-panel--active"), q.style.display = "", q.setAttribute("data-active-tab", E)) : (q.setAttribute("hidden", "true"), q.classList.remove("main-tab-panel--active"), q.style.display = "none", q.removeAttribute("data-active-tab")));
    });
  }, [x]);
}
function qD() {
  const [x, E] = F.useState(null), [b, q] = F.useState(() => GD());
  F.useEffect(() => {
    E(document.getElementById("main-navigation-root"));
  }, []), KD(b), F.useEffect(() => {
    window.history.replaceState(null, "", `#${b}`);
  }, [b]);
  const ee = F.useMemo(
    () => {
      var D;
      return ((D = ny.find((g) => g.key === b)) == null ? void 0 : D.description) ?? "";
    },
    [b]
  );
  return x ? pl.createPortal(
    /* @__PURE__ */ p.jsxs("nav", { className: "main-tabs", role: "tablist", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ p.jsx("div", { className: "main-tabs__list", children: ny.map((D) => {
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
    x
  ) : null;
}
const eo = ["magic", "metatype", "attributes", "skills", "resources"], uc = ["A", "B", "C", "D", "E"], XD = {
  magic: "Magic",
  metatype: "Metatype",
  attributes: "Attributes",
  skills: "Skills",
  resources: "Resources"
};
function R0(x) {
  return XD[x];
}
function _0(x, E) {
  var q;
  const b = (q = x == null ? void 0 : x.priorities) == null ? void 0 : q[E];
  return b ? uc.map((ee) => {
    const D = b[ee] ?? { label: `Priority ${ee}` };
    return { code: ee, option: D };
  }) : uc.map((ee) => ({
    code: ee,
    option: { label: `Priority ${ee}` }
  }));
}
function JD() {
  return {
    magic: "",
    metatype: "",
    attributes: "",
    skills: "",
    resources: ""
  };
}
function k0(x) {
  return eo.reduce((E, b) => {
    const q = x[b];
    return q && E.push(q), E;
  }, []);
}
function S0(x) {
  const E = new Set(k0(x));
  return uc.filter((b) => !E.has(b));
}
function ZD(x) {
  return k0(x).length === uc.length;
}
function D0(x) {
  return x ? x.summary || x.description || x.label || "" : "Drag a priority letter from the pool into this category.";
}
function e1(x) {
  if (!x)
    return "";
  const E = x.toLowerCase().trim().replace(/[\s-]+/g, "_");
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
function N0(x) {
  return Object.fromEntries(
    Object.entries(x).map(([E, b]) => [E, b || null])
  );
}
function j0() {
  var q, ee;
  const x = JD();
  if (typeof window > "u")
    return x;
  const E = (ee = (q = window.ShadowmasterLegacyApp) == null ? void 0 : q.getPriorities) == null ? void 0 : ee.call(q);
  if (!E)
    return x;
  const b = { ...x };
  for (const D of eo) {
    const g = E[D];
    typeof g == "string" && g.length === 1 && (b[D] = g);
  }
  return b;
}
function E0() {
  const x = j0();
  return eo.some((b) => x[b]) || (x.magic = "A", x.metatype = "B", x.attributes = "C", x.skills = "D", x.resources = "E"), x;
}
function t1() {
  const {
    characterCreationData: x,
    activeEdition: E,
    isLoading: b,
    error: q,
    campaignGameplayRules: ee,
    campaignLoading: D,
    campaignError: g,
    campaignCreationMethod: ae
  } = Kf(), L = F.useMemo(
    () => (x == null ? void 0 : x.creation_methods) ?? {},
    [x == null ? void 0 : x.creation_methods]
  ), z = F.useMemo(() => {
    const ge = e1(ae);
    if (ge && L[ge])
      return ge;
    if (L.priority)
      return "priority";
    const P = Object.keys(L);
    return P.length > 0 ? P[0] : "priority";
  }, [ae, L]);
  return z === "sum_to_ten" && L.sum_to_ten ? /* @__PURE__ */ p.jsx(
    a1,
    {
      characterCreationData: x,
      creationMethod: L.sum_to_ten,
      activeEditionLabel: E.label,
      isLoading: b,
      error: q,
      campaignGameplayRules: ee,
      campaignLoading: D,
      campaignError: g
    }
  ) : z === "karma" && L.karma ? /* @__PURE__ */ p.jsx(
    i1,
    {
      characterCreationData: x,
      creationMethod: L.karma,
      activeEditionLabel: E.label,
      isLoading: b,
      error: q,
      campaignGameplayRules: ee,
      campaignLoading: D,
      campaignError: g
    }
  ) : /* @__PURE__ */ p.jsx(
    n1,
    {
      characterCreationData: x,
      activeEditionLabel: E.label,
      isLoading: b,
      error: q,
      campaignGameplayRules: ee,
      campaignLoading: D,
      campaignError: g
    }
  );
}
function n1({
  characterCreationData: x,
  activeEditionLabel: E,
  isLoading: b,
  error: q,
  campaignGameplayRules: ee,
  campaignLoading: D,
  campaignError: g
}) {
  const [ae, L] = F.useState(() => j0()), [z, ge] = F.useState(null), P = F.useRef({});
  F.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), F.useEffect(() => {
    var A, pe;
    (pe = (A = window.ShadowmasterLegacyApp) == null ? void 0 : A.setPriorities) == null || pe.call(A, N0(ae));
  }, [ae]);
  const W = F.useMemo(() => S0(ae), [ae]), te = ZD(ae);
  function ne(A) {
    L((pe) => {
      const ue = { ...pe };
      for (const be of eo)
        ue[be] === A && (ue[be] = "");
      return ue;
    });
  }
  function X(A, pe) {
    pe.dataTransfer.effectAllowed = "move", ge({ source: "pool", priority: A }), pe.dataTransfer.setData("text/plain", A);
  }
  function fe(A, pe, ue) {
    ue.dataTransfer.effectAllowed = "move", ge({ source: "dropzone", category: A, priority: pe }), ue.dataTransfer.setData("text/plain", pe);
  }
  function je() {
    ge(null);
  }
  function oe(A, pe) {
    pe.preventDefault();
    const ue = pe.dataTransfer.getData("text/plain") || (z == null ? void 0 : z.priority) || "";
    if (!ue) {
      je();
      return;
    }
    L((be) => {
      const De = { ...be };
      for (const Je of eo)
        De[Je] === ue && (De[Je] = "");
      return De[A] = ue, De;
    }), je();
  }
  function Ee(A, pe) {
    pe.preventDefault();
    const ue = P.current[A];
    ue && ue.classList.add("active");
  }
  function Se(A) {
    const pe = P.current[A];
    pe && pe.classList.remove("active");
  }
  function le(A) {
    const pe = P.current[A];
    pe && pe.classList.remove("active");
  }
  function se(A) {
    const pe = W[0];
    if (!pe) {
      ne(A);
      return;
    }
    L((ue) => {
      const be = { ...ue };
      for (const De of eo)
        be[De] === A && (be[De] = "");
      return be[pe] = A, be;
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
            onDragOver: (A) => {
              A.preventDefault(), ge((pe) => pe && { ...pe, category: void 0 });
            },
            onDrop: (A) => {
              A.preventDefault();
              const pe = A.dataTransfer.getData("text/plain") || (z == null ? void 0 : z.priority) || "";
              pe && ne(pe), je();
            },
            children: /* @__PURE__ */ p.jsx("div", { className: "react-priority-chips", children: uc.map((A) => {
              const pe = !S0(ae).includes(A), ue = (z == null ? void 0 : z.priority) === A && z.source === "pool";
              return /* @__PURE__ */ p.jsx(
                "div",
                {
                  className: `react-priority-chip ${pe ? "used" : ""} ${ue ? "dragging" : ""}`,
                  draggable: !pe,
                  onDragStart: (be) => !pe && X(A, be),
                  onDragEnd: je,
                  onClick: () => se(A),
                  role: "button",
                  tabIndex: pe ? -1 : 0,
                  onKeyDown: (be) => {
                    !pe && (be.key === "Enter" || be.key === " ") && (be.preventDefault(), se(A));
                  },
                  children: A
                },
                A
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ p.jsx("section", { className: "react-priority-dropzones", children: eo.map((A) => {
        const pe = R0(A), ue = _0(x, A), be = ae[A], De = ue.find((re) => re.code === be), Je = (z == null ? void 0 : z.source) === "dropzone" && z.category === A;
        return /* @__PURE__ */ p.jsxs(
          "div",
          {
            ref: (re) => {
              P.current[A] = re;
            },
            className: `react-priority-dropzone ${be ? "filled" : ""}`,
            onDragOver: (re) => Ee(A, re),
            onDragLeave: () => Se(A),
            onDrop: (re) => {
              oe(A, re), le(A);
            },
            children: [
              /* @__PURE__ */ p.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ p.jsx("span", { children: pe }),
                be && /* @__PURE__ */ p.jsxs("span", { children: [
                  be,
                  " — ",
                  (De == null ? void 0 : De.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ p.jsx("div", { className: "react-priority-description", children: D0(De == null ? void 0 : De.option) }),
              be ? /* @__PURE__ */ p.jsx(
                "div",
                {
                  className: `react-priority-chip ${Je ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (re) => fe(A, be, re),
                  onDragEnd: je,
                  onDoubleClick: () => ne(be),
                  children: be
                }
              ) : /* @__PURE__ */ p.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          A
        );
      }) })
    ] }),
    /* @__PURE__ */ p.jsx(
      "div",
      {
        className: `react-priority-status ${te ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: te ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${W.join(", ")}`
      }
    )
  ] });
}
const r1 = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  E: 0
};
function a1({
  characterCreationData: x,
  creationMethod: E,
  activeEditionLabel: b,
  isLoading: q,
  error: ee,
  campaignGameplayRules: D,
  campaignLoading: g,
  campaignError: ae
}) {
  const [L, z] = F.useState(() => E0());
  F.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), F.useEffect(() => {
    var Se, le;
    (le = (Se = window.ShadowmasterLegacyApp) == null ? void 0 : Se.setPriorities) == null || le.call(Se, N0(L));
  }, [L]);
  const ge = F.useMemo(() => {
    const Se = { ...r1 };
    return uc.forEach((le) => {
      var A;
      const se = (A = E.priority_costs) == null ? void 0 : A[le];
      typeof se == "number" && (Se[le] = se);
    }), Se;
  }, [E.priority_costs]), P = E.point_budget ?? 10, W = F.useMemo(() => eo.reduce((Se, le) => {
    const se = L[le];
    return Se + (se ? ge[se] ?? 0 : 0);
  }, 0), [L, ge]), te = P - W, ne = F.useMemo(
    () => eo.every((Se) => !!L[Se]),
    [L]
  ), X = ne && te === 0 ? "success" : te < 0 ? "error" : "warning", fe = ne ? te > 0 ? `Spend the remaining ${te} point${te === 1 ? "" : "s"}.` : te < 0 ? `Over budget by ${Math.abs(te)} point${Math.abs(te) === 1 ? "" : "s"}.` : "✓ All priorities assigned. You can proceed to metatype selection." : "Select a priority letter for each category.";
  function je(Se, le) {
    z((se) => ({
      ...se,
      [Se]: le
    }));
  }
  function oe(Se, le) {
    const se = le.target.value, A = se ? se.toUpperCase() : "";
    je(Se, A);
  }
  function Ee() {
    z(E0());
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
      const le = R0(Se), se = _0(x, Se), A = L[Se], pe = se.find((be) => be.code === A), ue = A ? ge[A] ?? 0 : 0;
      return /* @__PURE__ */ p.jsxs("div", { className: "sum-to-ten-card", children: [
        /* @__PURE__ */ p.jsxs("div", { className: "sum-to-ten-card__header", children: [
          /* @__PURE__ */ p.jsx("span", { children: le }),
          A && /* @__PURE__ */ p.jsxs("span", { children: [
            A,
            " · ",
            ue,
            " pts"
          ] })
        ] }),
        /* @__PURE__ */ p.jsxs("select", { value: A, onChange: (be) => oe(Se, be), children: [
          /* @__PURE__ */ p.jsx("option", { value: "", children: "Select priority" }),
          uc.map((be) => {
            const De = se.find((re) => re.code === be), Je = ge[be] ?? 0;
            return /* @__PURE__ */ p.jsx("option", { value: be, children: `${be} (${Je} pts) — ${(De == null ? void 0 : De.option.label) ?? `Priority ${be}`}` }, be);
          })
        ] }),
        /* @__PURE__ */ p.jsx("div", { className: "sum-to-ten-card__summary", children: D0(pe == null ? void 0 : pe.option) }),
        A && /* @__PURE__ */ p.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-link sum-to-ten-clear",
            onClick: () => je(Se, ""),
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
        W,
        " / ",
        P,
        " points"
      ] }),
      /* @__PURE__ */ p.jsx("div", { className: "sum-to-ten-actions", children: /* @__PURE__ */ p.jsx("button", { type: "button", className: "btn btn-secondary", onClick: Ee, children: "Reset to default" }) })
    ] })
  ] });
}
const av = [
  { key: "attributes", label: "Attributes" },
  { key: "skills", label: "Skills" },
  { key: "qualities", label: "Qualities" },
  { key: "gear", label: "Gear & Lifestyle" },
  { key: "contacts", label: "Contacts" },
  { key: "other", label: "Other" }
];
function i1({
  characterCreationData: x,
  creationMethod: E,
  activeEditionLabel: b,
  isLoading: q,
  error: ee,
  campaignGameplayRules: D,
  campaignLoading: g,
  campaignError: ae
}) {
  var ue, be, De, Je;
  const L = F.useMemo(() => ((x == null ? void 0 : x.metatypes) ?? []).map((ze) => ({
    value: ze.id,
    label: ze.name
  })), [x == null ? void 0 : x.metatypes]), [z, ge] = F.useState(() => {
    var re;
    return ((re = L[0]) == null ? void 0 : re.value) ?? "";
  }), [P, W] = F.useState(
    () => av.reduce((re, ze) => (re[ze.key] = 0, re), {})
  );
  F.useEffect(() => {
    var ze;
    const re = ((ze = L[0]) == null ? void 0 : ze.value) ?? "";
    ge((tt) => tt || re);
  }, [L]), F.useEffect(() => {
    var ze, tt;
    const re = av.map(({ key: dt, label: Oe }) => ({
      category: dt,
      label: Oe,
      karma: P[dt] ?? 0
    }));
    (tt = (ze = window.ShadowmasterLegacyApp) == null ? void 0 : ze.setKarmaPointBuy) == null || tt.call(ze, {
      metatype_id: z,
      entries: re
    });
  }, [P, z]);
  const te = E.karma_budget ?? 800, ne = ((be = E.metatype_costs) == null ? void 0 : be[((ue = z == null ? void 0 : z.toLowerCase) == null ? void 0 : ue.call(z)) ?? ""]) ?? ((De = E.metatype_costs) == null ? void 0 : De.human) ?? 0, X = ne + av.reduce((re, ze) => re + (P[ze.key] ?? 0), 0), fe = te - X, je = P.gear ?? 0, oe = ((Je = E.gear_conversion) == null ? void 0 : Je.max_karma_for_gear) ?? null, Ee = oe !== null && je > oe;
  let Se = "warning";
  fe === 0 ? Se = "success" : fe < 0 && (Se = "error");
  const le = fe === 0 ? "✓ All Karma allocated. Review the remaining steps, then proceed." : fe < 0 ? `Over budget by ${Math.abs(fe)} Karma. Adjust your selections.` : `Spend the remaining ${fe} Karma before finalizing.`;
  function se(re, ze) {
    const tt = Number.parseInt(ze.target.value, 10);
    W((dt) => ({
      ...dt,
      [re]: Number.isNaN(tt) || tt < 0 ? 0 : tt
    }));
  }
  function A(re) {
    ge(re.target.value);
  }
  function pe() {
    W(
      av.reduce((re, ze) => (re[ze.key] = 0, re), {})
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
          /* @__PURE__ */ p.jsx("select", { value: z, onChange: A, children: L.map((re) => {
            var tt, dt, Oe, he;
            const ze = ((Oe = E.metatype_costs) == null ? void 0 : Oe[((dt = (tt = re.value).toLowerCase) == null ? void 0 : dt.call(tt)) ?? ""]) ?? ((he = E.metatype_costs) == null ? void 0 : he.human) ?? 0;
            return /* @__PURE__ */ p.jsxs("option", { value: re.value, children: [
              re.label,
              " (",
              ze,
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
        /* @__PURE__ */ p.jsx("div", { className: "karma-ledger", children: av.map(({ key: re, label: ze }) => {
          const tt = P[re] ?? 0, dt = re === "gear" && oe !== null ? ` (max ${oe} Karma)` : "";
          return /* @__PURE__ */ p.jsxs("label", { className: "karma-field karma-ledger-row", children: [
            /* @__PURE__ */ p.jsxs("span", { children: [
              ze,
              dt
            ] }),
            /* @__PURE__ */ p.jsx(
              "input",
              {
                type: "number",
                min: 0,
                step: 5,
                value: tt,
                onChange: (Oe) => se(re, Oe)
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
            var re, ze;
            return (ze = (re = window.ShadowmasterLegacyApp) == null ? void 0 : re.showLegacyKarmaWizard) == null ? void 0 : ze.call(re);
          },
          children: "Open legacy point-buy wizard"
        }
      )
    ] })
  ] });
}
const l1 = {
  body: "Body",
  quickness: "Quickness",
  strength: "Strength",
  charisma: "Charisma",
  intelligence: "Intelligence",
  willpower: "Willpower"
};
function o1(x, E) {
  if (!x)
    return [];
  const b = E || "E";
  return x.metatypes.map((q) => {
    var ee;
    return {
      ...q,
      priorityAllowed: ((ee = q.priority_tiers) == null ? void 0 : ee.includes(b)) ?? !1
    };
  }).filter((q) => q.priorityAllowed);
}
function u1(x) {
  return x === 0 ? "+0" : x > 0 ? `+${x}` : `${x}`;
}
function s1(x) {
  const E = x.toLowerCase();
  return l1[E] ?? x;
}
function c1({ priority: x, selectedMetatype: E, onSelect: b }) {
  const { characterCreationData: q, isLoading: ee, error: D, activeEdition: g } = Kf();
  F.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const ae = F.useMemo(() => {
    var ne;
    const P = ((ne = x == null ? void 0 : x.toUpperCase) == null ? void 0 : ne.call(x)) ?? "", te = ["A", "B", "C", "D", "E"].includes(P) ? P : "";
    return o1(q, te);
  }, [q, x]), L = !!E, z = () => {
    var P, W;
    (W = (P = window.ShadowmasterLegacyApp) == null ? void 0 : P.showWizardStep) == null || W.call(P, 1);
  }, ge = () => {
    var P, W;
    E && ((W = (P = window.ShadowmasterLegacyApp) == null ? void 0 : P.showWizardStep) == null || W.call(P, 3));
  };
  return ee ? /* @__PURE__ */ p.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : D ? /* @__PURE__ */ p.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    D
  ] }) : ae.length ? /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
    /* @__PURE__ */ p.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ p.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ p.jsxs("span", { children: [
        "Priority: ",
        x || "—"
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
              const W = P.attribute_modifiers ? Object.entries(P.attribute_modifiers).filter(([, te]) => te !== 0) : [];
              return W.length === 0 ? /* @__PURE__ */ p.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : W.map(([te, ne]) => /* @__PURE__ */ p.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ p.jsx("span", { children: s1(te) }),
                /* @__PURE__ */ p.jsx("span", { className: ne > 0 ? "positive" : "negative", children: u1(ne) })
              ] }, te));
            })()
          ] }),
          g.key === "sr5" && P.special_attribute_points && Object.keys(P.special_attribute_points).length > 0 && /* @__PURE__ */ p.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ p.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(P.special_attribute_points).map(([W, te]) => /* @__PURE__ */ p.jsx("div", { className: "ability", children: /* @__PURE__ */ p.jsxs("span", { children: [
              "Priority ",
              W,
              ": ",
              te
            ] }) }, W))
          ] }),
          P.abilities && P.abilities.length > 0 && /* @__PURE__ */ p.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ p.jsx("strong", { children: "Special Abilities" }),
            P.abilities.map((W, te) => /* @__PURE__ */ p.jsx("div", { className: "ability", children: /* @__PURE__ */ p.jsx("span", { children: W }) }, te))
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
const f1 = ["Hermetic", "Shamanic"], d1 = [
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
function p1(x) {
  return (x || "").toUpperCase();
}
function v1({ priority: x, selection: E, onChange: b }) {
  var te;
  const { characterCreationData: q, activeEdition: ee } = Kf(), D = p1(x), g = ((te = q == null ? void 0 : q.priorities) == null ? void 0 : te.magic) ?? null, ae = F.useMemo(() => g && g[D] || null, [g, D]);
  F.useEffect(() => (document.body.classList.add("react-magic-enabled"), () => {
    document.body.classList.remove("react-magic-enabled");
  }), []), F.useEffect(() => {
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
    /* @__PURE__ */ p.jsx("div", { className: "tradition-options", children: f1.map((ne) => /* @__PURE__ */ p.jsxs("label", { className: `tradition-option ${E.tradition === ne ? "selected" : ""}`, children: [
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
    /* @__PURE__ */ p.jsx("div", { className: "totem-grid", children: d1.map((ne) => /* @__PURE__ */ p.jsxs(
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
  ] }), W = () => {
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
    W(),
    /* @__PURE__ */ p.jsx("footer", { className: "react-magic-footer", children: /* @__PURE__ */ p.jsxs("small", { children: [
      "Edition: ",
      ee.label
    ] }) })
  ] });
}
function h1({ targetId: x = "campaign-dashboard-root", campaign: E, onClose: b }) {
  var z, ge, P;
  const [q, ee] = F.useState(null);
  F.useEffect(() => {
    ee(document.getElementById(x));
  }, [x]);
  const D = F.useMemo(() => {
    if (!(E != null && E.house_rules))
      return {};
    try {
      return JSON.parse(E.house_rules);
    } catch (W) {
      return console.warn("Failed to parse campaign house rules payload", W), {};
    }
  }, [E == null ? void 0 : E.house_rules]);
  if (!q || !E)
    return null;
  const g = Object.entries(D.automation ?? {}).filter(([, W]) => W), ae = (((z = D.factions) == null ? void 0 : z.length) ?? 0) > 0 || (((ge = D.locations) == null ? void 0 : ge.length) ?? 0) > 0, L = D.session_seed;
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
            (P = D.placeholders) != null && P.length ? D.placeholders.map((W) => W.name).join(", ") : "None captured"
          ] })
        ] }),
        /* @__PURE__ */ p.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ p.jsx("h4", { children: "Automation" }),
          g.length > 0 ? /* @__PURE__ */ p.jsx("ul", { children: g.map(([W]) => /* @__PURE__ */ p.jsx("li", { children: W.replace(/_/g, " ") }, W)) }) : /* @__PURE__ */ p.jsx("p", { children: "No automation modules selected." }),
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
              /* @__PURE__ */ p.jsx("ul", { children: D.factions.map((W) => /* @__PURE__ */ p.jsxs("li", { children: [
                /* @__PURE__ */ p.jsx("span", { children: W.name }),
                W.tags && /* @__PURE__ */ p.jsxs("small", { children: [
                  " · ",
                  W.tags
                ] }),
                W.notes && /* @__PURE__ */ p.jsx("p", { children: W.notes })
              ] }, W.id ?? W.name)) })
            ] }),
            D.locations && D.locations.length > 0 && /* @__PURE__ */ p.jsxs("div", { children: [
              /* @__PURE__ */ p.jsx("strong", { children: "Locations" }),
              /* @__PURE__ */ p.jsx("ul", { children: D.locations.map((W) => /* @__PURE__ */ p.jsxs("li", { children: [
                /* @__PURE__ */ p.jsx("span", { children: W.name }),
                W.descriptor && /* @__PURE__ */ p.jsx("p", { children: W.descriptor })
              ] }, W.id ?? W.name)) })
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
function m1() {
  const [x, E] = F.useState(null);
  return F.useEffect(() => {
    E(document.getElementById("auth-root"));
  }, []), x ? pl.createPortal(/* @__PURE__ */ p.jsx(LD, {}), x) : null;
}
function y1() {
  const [x, E] = F.useState(null);
  return F.useEffect(() => {
    E(document.getElementById("priority-assignment-react-root"));
  }, []), x ? pl.createPortal(/* @__PURE__ */ p.jsx(t1, {}), x) : null;
}
function g1() {
  const [x, E] = F.useState(null), [b, q] = F.useState(""), [ee, D] = F.useState(null);
  return F.useEffect(() => {
    E(document.getElementById("metatype-selection-react-root"));
  }, []), F.useEffect(() => {
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
  }, []), x ? pl.createPortal(
    /* @__PURE__ */ p.jsx(
      c1,
      {
        priority: b,
        selectedMetatype: ee,
        onSelect: (g) => {
          var ae, L;
          D(g), (L = (ae = window.ShadowmasterLegacyApp) == null ? void 0 : ae.setMetatypeSelection) == null || L.call(ae, g);
        }
      }
    ),
    x
  ) : null;
}
function S1() {
  const [x, E] = F.useState(null), [b, q] = F.useState({
    priority: "",
    type: null,
    tradition: null,
    totem: null
  });
  return F.useEffect(() => {
    E(document.getElementById("magical-abilities-react-root"));
  }, []), F.useEffect(() => {
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
  }, []), x ? pl.createPortal(
    /* @__PURE__ */ p.jsx(
      v1,
      {
        priority: b.priority,
        selection: { type: b.type, tradition: b.tradition, totem: b.totem },
        onChange: (ee) => {
          var D, g;
          (g = (D = window.ShadowmasterLegacyApp) == null ? void 0 : D.setMagicState) == null || g.call(D, ee);
        }
      }
    ),
    x
  ) : null;
}
function E1() {
  const { activeEdition: x, isLoading: E, error: b, characterCreationData: q } = Kf(), [ee, D] = F.useState(null);
  let g = "· data pending";
  return E ? g = "· loading edition data…" : b ? g = `· failed to load data: ${b}` : q && (g = "· edition data loaded"), /* @__PURE__ */ p.jsxs(OD, { children: [
    /* @__PURE__ */ p.jsx("div", { className: "react-banner", "data-active-edition": x.key, children: /* @__PURE__ */ p.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ p.jsx("strong", { children: x.label }),
      " ",
      g
    ] }) }),
    /* @__PURE__ */ p.jsx(m1, {}),
    /* @__PURE__ */ p.jsx(qD, {}),
    /* @__PURE__ */ p.jsx(PD, { onCreated: (ae) => D(ae) }),
    /* @__PURE__ */ p.jsx(h1, { campaign: ee, onClose: () => D(null) }),
    /* @__PURE__ */ p.jsx(WD, {}),
    /* @__PURE__ */ p.jsx(AD, {}),
    /* @__PURE__ */ p.jsx(y1, {}),
    /* @__PURE__ */ p.jsx(g1, {}),
    /* @__PURE__ */ p.jsx(S1, {})
  ] });
}
const C1 = document.getElementById("shadowmaster-react-root"), x1 = C1 ?? b1();
function b1() {
  const x = document.createElement("div");
  return x.id = "shadowmaster-react-root", x.dataset.controller = "react-shell", x.style.display = "contents", document.body.appendChild(x), x;
}
function w1() {
  return F.useEffect(() => {
    var x, E, b;
    (x = window.ShadowmasterLegacyApp) != null && x.initialize && !((b = (E = window.ShadowmasterLegacyApp).isInitialized) != null && b.call(E)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ p.jsx(F.StrictMode, { children: /* @__PURE__ */ p.jsx(_D, { children: /* @__PURE__ */ p.jsx(E1, {}) }) });
}
const T1 = _E(x1);
T1.render(/* @__PURE__ */ p.jsx(w1, {}));

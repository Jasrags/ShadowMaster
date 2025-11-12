var Nx = { exports: {} }, rm = {}, Dx = { exports: {} }, It = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var h_;
function kk() {
  if (h_) return It;
  h_ = 1;
  var x = Symbol.for("react.element"), S = Symbol.for("react.portal"), b = Symbol.for("react.fragment"), J = Symbol.for("react.strict_mode"), Z = Symbol.for("react.profiler"), N = Symbol.for("react.provider"), y = Symbol.for("react.context"), W = Symbol.for("react.forward_ref"), U = Symbol.for("react.suspense"), j = Symbol.for("react.memo"), de = Symbol.for("react.lazy"), z = Symbol.iterator;
  function Y(O) {
    return O === null || typeof O != "object" ? null : (O = z && O[z] || O["@@iterator"], typeof O == "function" ? O : null);
  }
  var G = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, re = Object.assign, oe = {};
  function ye(O, P, te) {
    this.props = O, this.context = P, this.refs = oe, this.updater = te || G;
  }
  ye.prototype.isReactComponent = {}, ye.prototype.setState = function(O, P) {
    if (typeof O != "object" && typeof O != "function" && O != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, O, P, "setState");
  }, ye.prototype.forceUpdate = function(O) {
    this.updater.enqueueForceUpdate(this, O, "forceUpdate");
  };
  function Ae() {
  }
  Ae.prototype = ye.prototype;
  function le(O, P, te) {
    this.props = O, this.context = P, this.refs = oe, this.updater = te || G;
  }
  var ke = le.prototype = new Ae();
  ke.constructor = le, re(ke, ye.prototype), ke.isPureReactComponent = !0;
  var Ee = Array.isArray, ce = Object.prototype.hasOwnProperty, me = { current: null }, I = { key: !0, ref: !0, __self: !0, __source: !0 };
  function _e(O, P, te) {
    var ue, bt = {}, Tt = null, yt = null;
    if (P != null) for (ue in P.ref !== void 0 && (yt = P.ref), P.key !== void 0 && (Tt = "" + P.key), P) ce.call(P, ue) && !I.hasOwnProperty(ue) && (bt[ue] = P[ue]);
    var mt = arguments.length - 2;
    if (mt === 1) bt.children = te;
    else if (1 < mt) {
      for (var gt = Array(mt), $t = 0; $t < mt; $t++) gt[$t] = arguments[$t + 2];
      bt.children = gt;
    }
    if (O && O.defaultProps) for (ue in mt = O.defaultProps, mt) bt[ue] === void 0 && (bt[ue] = mt[ue]);
    return { $$typeof: x, type: O, key: Tt, ref: yt, props: bt, _owner: me.current };
  }
  function Ue(O, P) {
    return { $$typeof: x, type: O.type, key: P, ref: O.ref, props: O.props, _owner: O._owner };
  }
  function De(O) {
    return typeof O == "object" && O !== null && O.$$typeof === x;
  }
  function he(O) {
    var P = { "=": "=0", ":": "=2" };
    return "$" + O.replace(/[=:]/g, function(te) {
      return P[te];
    });
  }
  var Be = /\/+/g;
  function ee(O, P) {
    return typeof O == "object" && O !== null && O.key != null ? he("" + O.key) : P.toString(36);
  }
  function Oe(O, P, te, ue, bt) {
    var Tt = typeof O;
    (Tt === "undefined" || Tt === "boolean") && (O = null);
    var yt = !1;
    if (O === null) yt = !0;
    else switch (Tt) {
      case "string":
      case "number":
        yt = !0;
        break;
      case "object":
        switch (O.$$typeof) {
          case x:
          case S:
            yt = !0;
        }
    }
    if (yt) return yt = O, bt = bt(yt), O = ue === "" ? "." + ee(yt, 0) : ue, Ee(bt) ? (te = "", O != null && (te = O.replace(Be, "$&/") + "/"), Oe(bt, P, te, "", function($t) {
      return $t;
    })) : bt != null && (De(bt) && (bt = Ue(bt, te + (!bt.key || yt && yt.key === bt.key ? "" : ("" + bt.key).replace(Be, "$&/") + "/") + O)), P.push(bt)), 1;
    if (yt = 0, ue = ue === "" ? "." : ue + ":", Ee(O)) for (var mt = 0; mt < O.length; mt++) {
      Tt = O[mt];
      var gt = ue + ee(Tt, mt);
      yt += Oe(Tt, P, te, gt, bt);
    }
    else if (gt = Y(O), typeof gt == "function") for (O = gt.call(O), mt = 0; !(Tt = O.next()).done; ) Tt = Tt.value, gt = ue + ee(Tt, mt++), yt += Oe(Tt, P, te, gt, bt);
    else if (Tt === "object") throw P = String(O), Error("Objects are not valid as a React child (found: " + (P === "[object Object]" ? "object with keys {" + Object.keys(O).join(", ") + "}" : P) + "). If you meant to render a collection of children, use an array instead.");
    return yt;
  }
  function Ze(O, P, te) {
    if (O == null) return O;
    var ue = [], bt = 0;
    return Oe(O, ue, "", "", function(Tt) {
      return P.call(te, Tt, bt++);
    }), ue;
  }
  function lt(O) {
    if (O._status === -1) {
      var P = O._result;
      P = P(), P.then(function(te) {
        (O._status === 0 || O._status === -1) && (O._status = 1, O._result = te);
      }, function(te) {
        (O._status === 0 || O._status === -1) && (O._status = 2, O._result = te);
      }), O._status === -1 && (O._status = 0, O._result = P);
    }
    if (O._status === 1) return O._result.default;
    throw O._result;
  }
  var je = { current: null }, Se = { transition: null }, Ie = { ReactCurrentDispatcher: je, ReactCurrentBatchConfig: Se, ReactCurrentOwner: me };
  function Re() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return It.Children = { map: Ze, forEach: function(O, P, te) {
    Ze(O, function() {
      P.apply(this, arguments);
    }, te);
  }, count: function(O) {
    var P = 0;
    return Ze(O, function() {
      P++;
    }), P;
  }, toArray: function(O) {
    return Ze(O, function(P) {
      return P;
    }) || [];
  }, only: function(O) {
    if (!De(O)) throw Error("React.Children.only expected to receive a single React element child.");
    return O;
  } }, It.Component = ye, It.Fragment = b, It.Profiler = Z, It.PureComponent = le, It.StrictMode = J, It.Suspense = U, It.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ie, It.act = Re, It.cloneElement = function(O, P, te) {
    if (O == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + O + ".");
    var ue = re({}, O.props), bt = O.key, Tt = O.ref, yt = O._owner;
    if (P != null) {
      if (P.ref !== void 0 && (Tt = P.ref, yt = me.current), P.key !== void 0 && (bt = "" + P.key), O.type && O.type.defaultProps) var mt = O.type.defaultProps;
      for (gt in P) ce.call(P, gt) && !I.hasOwnProperty(gt) && (ue[gt] = P[gt] === void 0 && mt !== void 0 ? mt[gt] : P[gt]);
    }
    var gt = arguments.length - 2;
    if (gt === 1) ue.children = te;
    else if (1 < gt) {
      mt = Array(gt);
      for (var $t = 0; $t < gt; $t++) mt[$t] = arguments[$t + 2];
      ue.children = mt;
    }
    return { $$typeof: x, type: O.type, key: bt, ref: Tt, props: ue, _owner: yt };
  }, It.createContext = function(O) {
    return O = { $$typeof: y, _currentValue: O, _currentValue2: O, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, O.Provider = { $$typeof: N, _context: O }, O.Consumer = O;
  }, It.createElement = _e, It.createFactory = function(O) {
    var P = _e.bind(null, O);
    return P.type = O, P;
  }, It.createRef = function() {
    return { current: null };
  }, It.forwardRef = function(O) {
    return { $$typeof: W, render: O };
  }, It.isValidElement = De, It.lazy = function(O) {
    return { $$typeof: de, _payload: { _status: -1, _result: O }, _init: lt };
  }, It.memo = function(O, P) {
    return { $$typeof: j, type: O, compare: P === void 0 ? null : P };
  }, It.startTransition = function(O) {
    var P = Se.transition;
    Se.transition = {};
    try {
      O();
    } finally {
      Se.transition = P;
    }
  }, It.unstable_act = Re, It.useCallback = function(O, P) {
    return je.current.useCallback(O, P);
  }, It.useContext = function(O) {
    return je.current.useContext(O);
  }, It.useDebugValue = function() {
  }, It.useDeferredValue = function(O) {
    return je.current.useDeferredValue(O);
  }, It.useEffect = function(O, P) {
    return je.current.useEffect(O, P);
  }, It.useId = function() {
    return je.current.useId();
  }, It.useImperativeHandle = function(O, P, te) {
    return je.current.useImperativeHandle(O, P, te);
  }, It.useInsertionEffect = function(O, P) {
    return je.current.useInsertionEffect(O, P);
  }, It.useLayoutEffect = function(O, P) {
    return je.current.useLayoutEffect(O, P);
  }, It.useMemo = function(O, P) {
    return je.current.useMemo(O, P);
  }, It.useReducer = function(O, P, te) {
    return je.current.useReducer(O, P, te);
  }, It.useRef = function(O) {
    return je.current.useRef(O);
  }, It.useState = function(O) {
    return je.current.useState(O);
  }, It.useSyncExternalStore = function(O, P, te) {
    return je.current.useSyncExternalStore(O, P, te);
  }, It.useTransition = function() {
    return je.current.useTransition();
  }, It.version = "18.3.1", It;
}
var sm = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
sm.exports;
var v_;
function Nk() {
  return v_ || (v_ = 1, function(x, S) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var b = "18.3.1", J = Symbol.for("react.element"), Z = Symbol.for("react.portal"), N = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), W = Symbol.for("react.profiler"), U = Symbol.for("react.provider"), j = Symbol.for("react.context"), de = Symbol.for("react.forward_ref"), z = Symbol.for("react.suspense"), Y = Symbol.for("react.suspense_list"), G = Symbol.for("react.memo"), re = Symbol.for("react.lazy"), oe = Symbol.for("react.offscreen"), ye = Symbol.iterator, Ae = "@@iterator";
      function le(v) {
        if (v === null || typeof v != "object")
          return null;
        var T = ye && v[ye] || v[Ae];
        return typeof T == "function" ? T : null;
      }
      var ke = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Ee = {
        transition: null
      }, ce = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, me = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, I = {}, _e = null;
      function Ue(v) {
        _e = v;
      }
      I.setExtraStackFrame = function(v) {
        _e = v;
      }, I.getCurrentStack = null, I.getStackAddendum = function() {
        var v = "";
        _e && (v += _e);
        var T = I.getCurrentStack;
        return T && (v += T() || ""), v;
      };
      var De = !1, he = !1, Be = !1, ee = !1, Oe = !1, Ze = {
        ReactCurrentDispatcher: ke,
        ReactCurrentBatchConfig: Ee,
        ReactCurrentOwner: me
      };
      Ze.ReactDebugCurrentFrame = I, Ze.ReactCurrentActQueue = ce;
      function lt(v) {
        {
          for (var T = arguments.length, K = new Array(T > 1 ? T - 1 : 0), ne = 1; ne < T; ne++)
            K[ne - 1] = arguments[ne];
          Se("warn", v, K);
        }
      }
      function je(v) {
        {
          for (var T = arguments.length, K = new Array(T > 1 ? T - 1 : 0), ne = 1; ne < T; ne++)
            K[ne - 1] = arguments[ne];
          Se("error", v, K);
        }
      }
      function Se(v, T, K) {
        {
          var ne = Ze.ReactDebugCurrentFrame, Ne = ne.getStackAddendum();
          Ne !== "" && (T += "%s", K = K.concat([Ne]));
          var ot = K.map(function(Fe) {
            return String(Fe);
          });
          ot.unshift("Warning: " + T), Function.prototype.apply.call(console[v], console, ot);
        }
      }
      var Ie = {};
      function Re(v, T) {
        {
          var K = v.constructor, ne = K && (K.displayName || K.name) || "ReactClass", Ne = ne + "." + T;
          if (Ie[Ne])
            return;
          je("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", T, ne), Ie[Ne] = !0;
        }
      }
      var O = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(v) {
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
        enqueueForceUpdate: function(v, T, K) {
          Re(v, "forceUpdate");
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
        enqueueReplaceState: function(v, T, K, ne) {
          Re(v, "replaceState");
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
        enqueueSetState: function(v, T, K, ne) {
          Re(v, "setState");
        }
      }, P = Object.assign, te = {};
      Object.freeze(te);
      function ue(v, T, K) {
        this.props = v, this.context = T, this.refs = te, this.updater = K || O;
      }
      ue.prototype.isReactComponent = {}, ue.prototype.setState = function(v, T) {
        if (typeof v != "object" && typeof v != "function" && v != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, v, T, "setState");
      }, ue.prototype.forceUpdate = function(v) {
        this.updater.enqueueForceUpdate(this, v, "forceUpdate");
      };
      {
        var bt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, Tt = function(v, T) {
          Object.defineProperty(ue.prototype, v, {
            get: function() {
              lt("%s(...) is deprecated in plain JavaScript React classes. %s", T[0], T[1]);
            }
          });
        };
        for (var yt in bt)
          bt.hasOwnProperty(yt) && Tt(yt, bt[yt]);
      }
      function mt() {
      }
      mt.prototype = ue.prototype;
      function gt(v, T, K) {
        this.props = v, this.context = T, this.refs = te, this.updater = K || O;
      }
      var $t = gt.prototype = new mt();
      $t.constructor = gt, P($t, ue.prototype), $t.isPureReactComponent = !0;
      function Dn() {
        var v = {
          current: null
        };
        return Object.seal(v), v;
      }
      var qn = Array.isArray;
      function xn(v) {
        return qn(v);
      }
      function En(v) {
        {
          var T = typeof Symbol == "function" && Symbol.toStringTag, K = T && v[Symbol.toStringTag] || v.constructor.name || "Object";
          return K;
        }
      }
      function On(v) {
        try {
          return Ct(v), !1;
        } catch {
          return !0;
        }
      }
      function Ct(v) {
        return "" + v;
      }
      function Tn(v) {
        if (On(v))
          return je("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", En(v)), Ct(v);
      }
      function Ln(v, T, K) {
        var ne = v.displayName;
        if (ne)
          return ne;
        var Ne = T.displayName || T.name || "";
        return Ne !== "" ? K + "(" + Ne + ")" : K;
      }
      function Qn(v) {
        return v.displayName || "Context";
      }
      function An(v) {
        if (v == null)
          return null;
        if (typeof v.tag == "number" && je("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof v == "function")
          return v.displayName || v.name || null;
        if (typeof v == "string")
          return v;
        switch (v) {
          case N:
            return "Fragment";
          case Z:
            return "Portal";
          case W:
            return "Profiler";
          case y:
            return "StrictMode";
          case z:
            return "Suspense";
          case Y:
            return "SuspenseList";
        }
        if (typeof v == "object")
          switch (v.$$typeof) {
            case j:
              var T = v;
              return Qn(T) + ".Consumer";
            case U:
              var K = v;
              return Qn(K._context) + ".Provider";
            case de:
              return Ln(v, v.render, "ForwardRef");
            case G:
              var ne = v.displayName || null;
              return ne !== null ? ne : An(v.type) || "Memo";
            case re: {
              var Ne = v, ot = Ne._payload, Fe = Ne._init;
              try {
                return An(Fe(ot));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var bn = Object.prototype.hasOwnProperty, Rn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, V, $e, St;
      St = {};
      function ht(v) {
        if (bn.call(v, "ref")) {
          var T = Object.getOwnPropertyDescriptor(v, "ref").get;
          if (T && T.isReactWarning)
            return !1;
        }
        return v.ref !== void 0;
      }
      function Ir(v) {
        if (bn.call(v, "key")) {
          var T = Object.getOwnPropertyDescriptor(v, "key").get;
          if (T && T.isReactWarning)
            return !1;
        }
        return v.key !== void 0;
      }
      function ua(v, T) {
        var K = function() {
          V || (V = !0, je("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", T));
        };
        K.isReactWarning = !0, Object.defineProperty(v, "key", {
          get: K,
          configurable: !0
        });
      }
      function ja(v, T) {
        var K = function() {
          $e || ($e = !0, je("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", T));
        };
        K.isReactWarning = !0, Object.defineProperty(v, "ref", {
          get: K,
          configurable: !0
        });
      }
      function Le(v) {
        if (typeof v.ref == "string" && me.current && v.__self && me.current.stateNode !== v.__self) {
          var T = An(me.current.type);
          St[T] || (je('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', T, v.ref), St[T] = !0);
        }
      }
      var et = function(v, T, K, ne, Ne, ot, Fe) {
        var ft = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: J,
          // Built-in properties that belong on the element
          type: v,
          key: T,
          ref: K,
          props: Fe,
          // Record the component responsible for creating this element.
          _owner: ot
        };
        return ft._store = {}, Object.defineProperty(ft._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(ft, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: ne
        }), Object.defineProperty(ft, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: Ne
        }), Object.freeze && (Object.freeze(ft.props), Object.freeze(ft)), ft;
      };
      function Dt(v, T, K) {
        var ne, Ne = {}, ot = null, Fe = null, ft = null, Ht = null;
        if (T != null) {
          ht(T) && (Fe = T.ref, Le(T)), Ir(T) && (Tn(T.key), ot = "" + T.key), ft = T.__self === void 0 ? null : T.__self, Ht = T.__source === void 0 ? null : T.__source;
          for (ne in T)
            bn.call(T, ne) && !Rn.hasOwnProperty(ne) && (Ne[ne] = T[ne]);
        }
        var Xt = arguments.length - 2;
        if (Xt === 1)
          Ne.children = K;
        else if (Xt > 1) {
          for (var kn = Array(Xt), hn = 0; hn < Xt; hn++)
            kn[hn] = arguments[hn + 2];
          Object.freeze && Object.freeze(kn), Ne.children = kn;
        }
        if (v && v.defaultProps) {
          var zt = v.defaultProps;
          for (ne in zt)
            Ne[ne] === void 0 && (Ne[ne] = zt[ne]);
        }
        if (ot || Fe) {
          var vn = typeof v == "function" ? v.displayName || v.name || "Unknown" : v;
          ot && ua(Ne, vn), Fe && ja(Ne, vn);
        }
        return et(v, ot, Fe, ft, Ht, me.current, Ne);
      }
      function Kt(v, T) {
        var K = et(v.type, T, v.ref, v._self, v._source, v._owner, v.props);
        return K;
      }
      function pn(v, T, K) {
        if (v == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + v + ".");
        var ne, Ne = P({}, v.props), ot = v.key, Fe = v.ref, ft = v._self, Ht = v._source, Xt = v._owner;
        if (T != null) {
          ht(T) && (Fe = T.ref, Xt = me.current), Ir(T) && (Tn(T.key), ot = "" + T.key);
          var kn;
          v.type && v.type.defaultProps && (kn = v.type.defaultProps);
          for (ne in T)
            bn.call(T, ne) && !Rn.hasOwnProperty(ne) && (T[ne] === void 0 && kn !== void 0 ? Ne[ne] = kn[ne] : Ne[ne] = T[ne]);
        }
        var hn = arguments.length - 2;
        if (hn === 1)
          Ne.children = K;
        else if (hn > 1) {
          for (var zt = Array(hn), vn = 0; vn < hn; vn++)
            zt[vn] = arguments[vn + 2];
          Ne.children = zt;
        }
        return et(v.type, ot, Fe, ft, Ht, Xt, Ne);
      }
      function Mn(v) {
        return typeof v == "object" && v !== null && v.$$typeof === J;
      }
      var Ut = ".", Xn = ":";
      function fn(v) {
        var T = /[=:]/g, K = {
          "=": "=0",
          ":": "=2"
        }, ne = v.replace(T, function(Ne) {
          return K[Ne];
        });
        return "$" + ne;
      }
      var on = !1, ln = /\/+/g;
      function jn(v) {
        return v.replace(ln, "$&/");
      }
      function Jn(v, T) {
        return typeof v == "object" && v !== null && v.key != null ? (Tn(v.key), fn("" + v.key)) : T.toString(36);
      }
      function jr(v, T, K, ne, Ne) {
        var ot = typeof v;
        (ot === "undefined" || ot === "boolean") && (v = null);
        var Fe = !1;
        if (v === null)
          Fe = !0;
        else
          switch (ot) {
            case "string":
            case "number":
              Fe = !0;
              break;
            case "object":
              switch (v.$$typeof) {
                case J:
                case Z:
                  Fe = !0;
              }
          }
        if (Fe) {
          var ft = v, Ht = Ne(ft), Xt = ne === "" ? Ut + Jn(ft, 0) : ne;
          if (xn(Ht)) {
            var kn = "";
            Xt != null && (kn = jn(Xt) + "/"), jr(Ht, T, kn, "", function(td) {
              return td;
            });
          } else Ht != null && (Mn(Ht) && (Ht.key && (!ft || ft.key !== Ht.key) && Tn(Ht.key), Ht = Kt(
            Ht,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            K + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (Ht.key && (!ft || ft.key !== Ht.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              jn("" + Ht.key) + "/"
            ) : "") + Xt
          )), T.push(Ht));
          return 1;
        }
        var hn, zt, vn = 0, Vn = ne === "" ? Ut : ne + Xn;
        if (xn(v))
          for (var Ll = 0; Ll < v.length; Ll++)
            hn = v[Ll], zt = Vn + Jn(hn, Ll), vn += jr(hn, T, K, zt, Ne);
        else {
          var eu = le(v);
          if (typeof eu == "function") {
            var rl = v;
            eu === rl.entries && (on || lt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), on = !0);
            for (var tu = eu.call(rl), vo, ed = 0; !(vo = tu.next()).done; )
              hn = vo.value, zt = Vn + Jn(hn, ed++), vn += jr(hn, T, K, zt, Ne);
          } else if (ot === "object") {
            var dc = String(v);
            throw new Error("Objects are not valid as a React child (found: " + (dc === "[object Object]" ? "object with keys {" + Object.keys(v).join(", ") + "}" : dc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return vn;
      }
      function ca(v, T, K) {
        if (v == null)
          return v;
        var ne = [], Ne = 0;
        return jr(v, ne, "", "", function(ot) {
          return T.call(K, ot, Ne++);
        }), ne;
      }
      function Qa(v) {
        var T = 0;
        return ca(v, function() {
          T++;
        }), T;
      }
      function Ga(v, T, K) {
        ca(v, function() {
          T.apply(this, arguments);
        }, K);
      }
      function Ri(v) {
        return ca(v, function(T) {
          return T;
        }) || [];
      }
      function ka(v) {
        if (!Mn(v))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return v;
      }
      function Zi(v) {
        var T = {
          $$typeof: j,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: v,
          _currentValue2: v,
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
        T.Provider = {
          $$typeof: U,
          _context: T
        };
        var K = !1, ne = !1, Ne = !1;
        {
          var ot = {
            $$typeof: j,
            _context: T
          };
          Object.defineProperties(ot, {
            Provider: {
              get: function() {
                return ne || (ne = !0, je("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), T.Provider;
              },
              set: function(Fe) {
                T.Provider = Fe;
              }
            },
            _currentValue: {
              get: function() {
                return T._currentValue;
              },
              set: function(Fe) {
                T._currentValue = Fe;
              }
            },
            _currentValue2: {
              get: function() {
                return T._currentValue2;
              },
              set: function(Fe) {
                T._currentValue2 = Fe;
              }
            },
            _threadCount: {
              get: function() {
                return T._threadCount;
              },
              set: function(Fe) {
                T._threadCount = Fe;
              }
            },
            Consumer: {
              get: function() {
                return K || (K = !0, je("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), T.Consumer;
              }
            },
            displayName: {
              get: function() {
                return T.displayName;
              },
              set: function(Fe) {
                Ne || (lt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", Fe), Ne = !0);
              }
            }
          }), T.Consumer = ot;
        }
        return T._currentRenderer = null, T._currentRenderer2 = null, T;
      }
      var ir = -1, kr = 0, Gn = 1, Ka = 2;
      function fa(v) {
        if (v._status === ir) {
          var T = v._result, K = T();
          if (K.then(function(ot) {
            if (v._status === kr || v._status === ir) {
              var Fe = v;
              Fe._status = Gn, Fe._result = ot;
            }
          }, function(ot) {
            if (v._status === kr || v._status === ir) {
              var Fe = v;
              Fe._status = Ka, Fe._result = ot;
            }
          }), v._status === ir) {
            var ne = v;
            ne._status = kr, ne._result = K;
          }
        }
        if (v._status === Gn) {
          var Ne = v._result;
          return Ne === void 0 && je(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, Ne), "default" in Ne || je(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, Ne), Ne.default;
        } else
          throw v._result;
      }
      function Na(v) {
        var T = {
          // We use these fields to store the result.
          _status: ir,
          _result: v
        }, K = {
          $$typeof: re,
          _payload: T,
          _init: fa
        };
        {
          var ne, Ne;
          Object.defineProperties(K, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return ne;
              },
              set: function(ot) {
                je("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), ne = ot, Object.defineProperty(K, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return Ne;
              },
              set: function(ot) {
                je("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), Ne = ot, Object.defineProperty(K, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return K;
      }
      function Da(v) {
        v != null && v.$$typeof === G ? je("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof v != "function" ? je("forwardRef requires a render function but was given %s.", v === null ? "null" : typeof v) : v.length !== 0 && v.length !== 2 && je("forwardRef render functions accept exactly two parameters: props and ref. %s", v.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), v != null && (v.defaultProps != null || v.propTypes != null) && je("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var T = {
          $$typeof: de,
          render: v
        };
        {
          var K;
          Object.defineProperty(T, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return K;
            },
            set: function(ne) {
              K = ne, !v.name && !v.displayName && (v.displayName = ne);
            }
          });
        }
        return T;
      }
      var R;
      R = Symbol.for("react.module.reference");
      function pe(v) {
        return !!(typeof v == "string" || typeof v == "function" || v === N || v === W || Oe || v === y || v === z || v === Y || ee || v === oe || De || he || Be || typeof v == "object" && v !== null && (v.$$typeof === re || v.$$typeof === G || v.$$typeof === U || v.$$typeof === j || v.$$typeof === de || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        v.$$typeof === R || v.getModuleId !== void 0));
      }
      function ze(v, T) {
        pe(v) || je("memo: The first argument must be a component. Instead received: %s", v === null ? "null" : typeof v);
        var K = {
          $$typeof: G,
          type: v,
          compare: T === void 0 ? null : T
        };
        {
          var ne;
          Object.defineProperty(K, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return ne;
            },
            set: function(Ne) {
              ne = Ne, !v.name && !v.displayName && (v.displayName = Ne);
            }
          });
        }
        return K;
      }
      function Qe() {
        var v = ke.current;
        return v === null && je(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), v;
      }
      function pt(v) {
        var T = Qe();
        if (v._context !== void 0) {
          var K = v._context;
          K.Consumer === v ? je("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : K.Provider === v && je("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return T.useContext(v);
      }
      function _t(v) {
        var T = Qe();
        return T.useState(v);
      }
      function Rt(v, T, K) {
        var ne = Qe();
        return ne.useReducer(v, T, K);
      }
      function Mt(v) {
        var T = Qe();
        return T.useRef(v);
      }
      function Un(v, T) {
        var K = Qe();
        return K.useEffect(v, T);
      }
      function Bt(v, T) {
        var K = Qe();
        return K.useInsertionEffect(v, T);
      }
      function Cn(v, T) {
        var K = Qe();
        return K.useLayoutEffect(v, T);
      }
      function yr(v, T) {
        var K = Qe();
        return K.useCallback(v, T);
      }
      function Oa(v, T) {
        var K = Qe();
        return K.useMemo(v, T);
      }
      function La(v, T, K) {
        var ne = Qe();
        return ne.useImperativeHandle(v, T, K);
      }
      function xt(v, T) {
        {
          var K = Qe();
          return K.useDebugValue(v, T);
        }
      }
      function Ot() {
        var v = Qe();
        return v.useTransition();
      }
      function Aa(v) {
        var T = Qe();
        return T.useDeferredValue(v);
      }
      function el() {
        var v = Qe();
        return v.useId();
      }
      function ji(v, T, K) {
        var ne = Qe();
        return ne.useSyncExternalStore(v, T, K);
      }
      var fe = 0, w, ve, ct, Ft, Lt, _n, lr;
      function dn() {
      }
      dn.__reactDisabledLog = !0;
      function or() {
        {
          if (fe === 0) {
            w = console.log, ve = console.info, ct = console.warn, Ft = console.error, Lt = console.group, _n = console.groupCollapsed, lr = console.groupEnd;
            var v = {
              configurable: !0,
              enumerable: !0,
              value: dn,
              writable: !0
            };
            Object.defineProperties(console, {
              info: v,
              log: v,
              warn: v,
              error: v,
              group: v,
              groupCollapsed: v,
              groupEnd: v
            });
          }
          fe++;
        }
      }
      function sn() {
        {
          if (fe--, fe === 0) {
            var v = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: P({}, v, {
                value: w
              }),
              info: P({}, v, {
                value: ve
              }),
              warn: P({}, v, {
                value: ct
              }),
              error: P({}, v, {
                value: Ft
              }),
              group: P({}, v, {
                value: Lt
              }),
              groupCollapsed: P({}, v, {
                value: _n
              }),
              groupEnd: P({}, v, {
                value: lr
              })
            });
          }
          fe < 0 && je("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Bn = Ze.ReactCurrentDispatcher, Ma;
      function ts(v, T, K) {
        {
          if (Ma === void 0)
            try {
              throw Error();
            } catch (Ne) {
              var ne = Ne.stack.trim().match(/\n( *(at )?)/);
              Ma = ne && ne[1] || "";
            }
          return `
` + Ma + v;
        }
      }
      var fo = !1, kl;
      {
        var ns = typeof WeakMap == "function" ? WeakMap : Map;
        kl = new ns();
      }
      function rs(v, T) {
        if (!v || fo)
          return "";
        {
          var K = kl.get(v);
          if (K !== void 0)
            return K;
        }
        var ne;
        fo = !0;
        var Ne = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var ot;
        ot = Bn.current, Bn.current = null, or();
        try {
          if (T) {
            var Fe = function() {
              throw Error();
            };
            if (Object.defineProperty(Fe.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(Fe, []);
              } catch (Vn) {
                ne = Vn;
              }
              Reflect.construct(v, [], Fe);
            } else {
              try {
                Fe.call();
              } catch (Vn) {
                ne = Vn;
              }
              v.call(Fe.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (Vn) {
              ne = Vn;
            }
            v();
          }
        } catch (Vn) {
          if (Vn && ne && typeof Vn.stack == "string") {
            for (var ft = Vn.stack.split(`
`), Ht = ne.stack.split(`
`), Xt = ft.length - 1, kn = Ht.length - 1; Xt >= 1 && kn >= 0 && ft[Xt] !== Ht[kn]; )
              kn--;
            for (; Xt >= 1 && kn >= 0; Xt--, kn--)
              if (ft[Xt] !== Ht[kn]) {
                if (Xt !== 1 || kn !== 1)
                  do
                    if (Xt--, kn--, kn < 0 || ft[Xt] !== Ht[kn]) {
                      var hn = `
` + ft[Xt].replace(" at new ", " at ");
                      return v.displayName && hn.includes("<anonymous>") && (hn = hn.replace("<anonymous>", v.displayName)), typeof v == "function" && kl.set(v, hn), hn;
                    }
                  while (Xt >= 1 && kn >= 0);
                break;
              }
          }
        } finally {
          fo = !1, Bn.current = ot, sn(), Error.prepareStackTrace = Ne;
        }
        var zt = v ? v.displayName || v.name : "", vn = zt ? ts(zt) : "";
        return typeof v == "function" && kl.set(v, vn), vn;
      }
      function tl(v, T, K) {
        return rs(v, !1);
      }
      function Jf(v) {
        var T = v.prototype;
        return !!(T && T.isReactComponent);
      }
      function nl(v, T, K) {
        if (v == null)
          return "";
        if (typeof v == "function")
          return rs(v, Jf(v));
        if (typeof v == "string")
          return ts(v);
        switch (v) {
          case z:
            return ts("Suspense");
          case Y:
            return ts("SuspenseList");
        }
        if (typeof v == "object")
          switch (v.$$typeof) {
            case de:
              return tl(v.render);
            case G:
              return nl(v.type, T, K);
            case re: {
              var ne = v, Ne = ne._payload, ot = ne._init;
              try {
                return nl(ot(Ne), T, K);
              } catch {
              }
            }
          }
        return "";
      }
      var Zt = {}, as = Ze.ReactDebugCurrentFrame;
      function qt(v) {
        if (v) {
          var T = v._owner, K = nl(v.type, v._source, T ? T.type : null);
          as.setExtraStackFrame(K);
        } else
          as.setExtraStackFrame(null);
      }
      function Xs(v, T, K, ne, Ne) {
        {
          var ot = Function.call.bind(bn);
          for (var Fe in v)
            if (ot(v, Fe)) {
              var ft = void 0;
              try {
                if (typeof v[Fe] != "function") {
                  var Ht = Error((ne || "React class") + ": " + K + " type `" + Fe + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof v[Fe] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Ht.name = "Invariant Violation", Ht;
                }
                ft = v[Fe](T, Fe, ne, K, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Xt) {
                ft = Xt;
              }
              ft && !(ft instanceof Error) && (qt(Ne), je("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", ne || "React class", K, Fe, typeof ft), qt(null)), ft instanceof Error && !(ft.message in Zt) && (Zt[ft.message] = !0, qt(Ne), je("Failed %s type: %s", K, ft.message), qt(null));
            }
        }
      }
      function ki(v) {
        if (v) {
          var T = v._owner, K = nl(v.type, v._source, T ? T.type : null);
          Ue(K);
        } else
          Ue(null);
      }
      var jt;
      jt = !1;
      function is() {
        if (me.current) {
          var v = An(me.current.type);
          if (v)
            return `

Check the render method of \`` + v + "`.";
        }
        return "";
      }
      function Nr(v) {
        if (v !== void 0) {
          var T = v.fileName.replace(/^.*[\\\/]/, ""), K = v.lineNumber;
          return `

Check your code at ` + T + ":" + K + ".";
        }
        return "";
      }
      function Ni(v) {
        return v != null ? Nr(v.__source) : "";
      }
      var Gr = {};
      function Di(v) {
        var T = is();
        if (!T) {
          var K = typeof v == "string" ? v : v.displayName || v.name;
          K && (T = `

Check the top-level render call using <` + K + ">.");
        }
        return T;
      }
      function zn(v, T) {
        if (!(!v._store || v._store.validated || v.key != null)) {
          v._store.validated = !0;
          var K = Di(T);
          if (!Gr[K]) {
            Gr[K] = !0;
            var ne = "";
            v && v._owner && v._owner !== me.current && (ne = " It was passed a child from " + An(v._owner.type) + "."), ki(v), je('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', K, ne), ki(null);
          }
        }
      }
      function mn(v, T) {
        if (typeof v == "object") {
          if (xn(v))
            for (var K = 0; K < v.length; K++) {
              var ne = v[K];
              Mn(ne) && zn(ne, T);
            }
          else if (Mn(v))
            v._store && (v._store.validated = !0);
          else if (v) {
            var Ne = le(v);
            if (typeof Ne == "function" && Ne !== v.entries)
              for (var ot = Ne.call(v), Fe; !(Fe = ot.next()).done; )
                Mn(Fe.value) && zn(Fe.value, T);
          }
        }
      }
      function Nl(v) {
        {
          var T = v.type;
          if (T == null || typeof T == "string")
            return;
          var K;
          if (typeof T == "function")
            K = T.propTypes;
          else if (typeof T == "object" && (T.$$typeof === de || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          T.$$typeof === G))
            K = T.propTypes;
          else
            return;
          if (K) {
            var ne = An(T);
            Xs(K, v.props, "prop", ne, v);
          } else if (T.PropTypes !== void 0 && !jt) {
            jt = !0;
            var Ne = An(T);
            je("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Ne || "Unknown");
          }
          typeof T.getDefaultProps == "function" && !T.getDefaultProps.isReactClassApproved && je("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function gr(v) {
        {
          for (var T = Object.keys(v.props), K = 0; K < T.length; K++) {
            var ne = T[K];
            if (ne !== "children" && ne !== "key") {
              ki(v), je("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", ne), ki(null);
              break;
            }
          }
          v.ref !== null && (ki(v), je("Invalid attribute `ref` supplied to `React.Fragment`."), ki(null));
        }
      }
      function Kr(v, T, K) {
        var ne = pe(v);
        if (!ne) {
          var Ne = "";
          (v === void 0 || typeof v == "object" && v !== null && Object.keys(v).length === 0) && (Ne += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var ot = Ni(T);
          ot ? Ne += ot : Ne += is();
          var Fe;
          v === null ? Fe = "null" : xn(v) ? Fe = "array" : v !== void 0 && v.$$typeof === J ? (Fe = "<" + (An(v.type) || "Unknown") + " />", Ne = " Did you accidentally export a JSX literal instead of a component?") : Fe = typeof v, je("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Fe, Ne);
        }
        var ft = Dt.apply(this, arguments);
        if (ft == null)
          return ft;
        if (ne)
          for (var Ht = 2; Ht < arguments.length; Ht++)
            mn(arguments[Ht], v);
        return v === N ? gr(ft) : Nl(ft), ft;
      }
      var qa = !1;
      function po(v) {
        var T = Kr.bind(null, v);
        return T.type = v, qa || (qa = !0, lt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(T, "type", {
          enumerable: !1,
          get: function() {
            return lt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: v
            }), v;
          }
        }), T;
      }
      function Js(v, T, K) {
        for (var ne = pn.apply(this, arguments), Ne = 2; Ne < arguments.length; Ne++)
          mn(arguments[Ne], ne.type);
        return Nl(ne), ne;
      }
      function Zs(v, T) {
        var K = Ee.transition;
        Ee.transition = {};
        var ne = Ee.transition;
        Ee.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          v();
        } finally {
          if (Ee.transition = K, K === null && ne._updatedFibers) {
            var Ne = ne._updatedFibers.size;
            Ne > 10 && lt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), ne._updatedFibers.clear();
          }
        }
      }
      var Dl = !1, mo = null;
      function Zf(v) {
        if (mo === null)
          try {
            var T = ("require" + Math.random()).slice(0, 7), K = x && x[T];
            mo = K.call(x, "timers").setImmediate;
          } catch {
            mo = function(Ne) {
              Dl === !1 && (Dl = !0, typeof MessageChannel > "u" && je("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var ot = new MessageChannel();
              ot.port1.onmessage = Ne, ot.port2.postMessage(void 0);
            };
          }
        return mo(v);
      }
      var Xa = 0, vi = !1;
      function Oi(v) {
        {
          var T = Xa;
          Xa++, ce.current === null && (ce.current = []);
          var K = ce.isBatchingLegacy, ne;
          try {
            if (ce.isBatchingLegacy = !0, ne = v(), !K && ce.didScheduleLegacyUpdate) {
              var Ne = ce.current;
              Ne !== null && (ce.didScheduleLegacyUpdate = !1, Ol(Ne));
            }
          } catch (zt) {
            throw Ja(T), zt;
          } finally {
            ce.isBatchingLegacy = K;
          }
          if (ne !== null && typeof ne == "object" && typeof ne.then == "function") {
            var ot = ne, Fe = !1, ft = {
              then: function(zt, vn) {
                Fe = !0, ot.then(function(Vn) {
                  Ja(T), Xa === 0 ? ls(Vn, zt, vn) : zt(Vn);
                }, function(Vn) {
                  Ja(T), vn(Vn);
                });
              }
            };
            return !vi && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              Fe || (vi = !0, je("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), ft;
          } else {
            var Ht = ne;
            if (Ja(T), Xa === 0) {
              var Xt = ce.current;
              Xt !== null && (Ol(Xt), ce.current = null);
              var kn = {
                then: function(zt, vn) {
                  ce.current === null ? (ce.current = [], ls(Ht, zt, vn)) : zt(Ht);
                }
              };
              return kn;
            } else {
              var hn = {
                then: function(zt, vn) {
                  zt(Ht);
                }
              };
              return hn;
            }
          }
        }
      }
      function Ja(v) {
        v !== Xa - 1 && je("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Xa = v;
      }
      function ls(v, T, K) {
        {
          var ne = ce.current;
          if (ne !== null)
            try {
              Ol(ne), Zf(function() {
                ne.length === 0 ? (ce.current = null, T(v)) : ls(v, T, K);
              });
            } catch (Ne) {
              K(Ne);
            }
          else
            T(v);
        }
      }
      var os = !1;
      function Ol(v) {
        if (!os) {
          os = !0;
          var T = 0;
          try {
            for (; T < v.length; T++) {
              var K = v[T];
              do
                K = K(!0);
              while (K !== null);
            }
            v.length = 0;
          } catch (ne) {
            throw v = v.slice(T + 1), ne;
          } finally {
            os = !1;
          }
        }
      }
      var ho = Kr, ss = Js, us = po, yi = {
        map: ca,
        forEach: Ga,
        count: Qa,
        toArray: Ri,
        only: ka
      };
      S.Children = yi, S.Component = ue, S.Fragment = N, S.Profiler = W, S.PureComponent = gt, S.StrictMode = y, S.Suspense = z, S.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ze, S.act = Oi, S.cloneElement = ss, S.createContext = Zi, S.createElement = ho, S.createFactory = us, S.createRef = Dn, S.forwardRef = Da, S.isValidElement = Mn, S.lazy = Na, S.memo = ze, S.startTransition = Zs, S.unstable_act = Oi, S.useCallback = yr, S.useContext = pt, S.useDebugValue = xt, S.useDeferredValue = Aa, S.useEffect = Un, S.useId = el, S.useImperativeHandle = La, S.useInsertionEffect = Bt, S.useLayoutEffect = Cn, S.useMemo = Oa, S.useReducer = Rt, S.useRef = Mt, S.useState = _t, S.useSyncExternalStore = ji, S.useTransition = Ot, S.version = b, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(sm, sm.exports)), sm.exports;
}
process.env.NODE_ENV === "production" ? Dx.exports = kk() : Dx.exports = Nk();
var k = Dx.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var y_;
function Dk() {
  if (y_) return rm;
  y_ = 1;
  var x = k, S = Symbol.for("react.element"), b = Symbol.for("react.fragment"), J = Object.prototype.hasOwnProperty, Z = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, N = { key: !0, ref: !0, __self: !0, __source: !0 };
  function y(W, U, j) {
    var de, z = {}, Y = null, G = null;
    j !== void 0 && (Y = "" + j), U.key !== void 0 && (Y = "" + U.key), U.ref !== void 0 && (G = U.ref);
    for (de in U) J.call(U, de) && !N.hasOwnProperty(de) && (z[de] = U[de]);
    if (W && W.defaultProps) for (de in U = W.defaultProps, U) z[de] === void 0 && (z[de] = U[de]);
    return { $$typeof: S, type: W, key: Y, ref: G, props: z, _owner: Z.current };
  }
  return rm.Fragment = b, rm.jsx = y, rm.jsxs = y, rm;
}
var am = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var g_;
function Ok() {
  return g_ || (g_ = 1, process.env.NODE_ENV !== "production" && function() {
    var x = k, S = Symbol.for("react.element"), b = Symbol.for("react.portal"), J = Symbol.for("react.fragment"), Z = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), y = Symbol.for("react.provider"), W = Symbol.for("react.context"), U = Symbol.for("react.forward_ref"), j = Symbol.for("react.suspense"), de = Symbol.for("react.suspense_list"), z = Symbol.for("react.memo"), Y = Symbol.for("react.lazy"), G = Symbol.for("react.offscreen"), re = Symbol.iterator, oe = "@@iterator";
    function ye(R) {
      if (R === null || typeof R != "object")
        return null;
      var pe = re && R[re] || R[oe];
      return typeof pe == "function" ? pe : null;
    }
    var Ae = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function le(R) {
      {
        for (var pe = arguments.length, ze = new Array(pe > 1 ? pe - 1 : 0), Qe = 1; Qe < pe; Qe++)
          ze[Qe - 1] = arguments[Qe];
        ke("error", R, ze);
      }
    }
    function ke(R, pe, ze) {
      {
        var Qe = Ae.ReactDebugCurrentFrame, pt = Qe.getStackAddendum();
        pt !== "" && (pe += "%s", ze = ze.concat([pt]));
        var _t = ze.map(function(Rt) {
          return String(Rt);
        });
        _t.unshift("Warning: " + pe), Function.prototype.apply.call(console[R], console, _t);
      }
    }
    var Ee = !1, ce = !1, me = !1, I = !1, _e = !1, Ue;
    Ue = Symbol.for("react.module.reference");
    function De(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === J || R === N || _e || R === Z || R === j || R === de || I || R === G || Ee || ce || me || typeof R == "object" && R !== null && (R.$$typeof === Y || R.$$typeof === z || R.$$typeof === y || R.$$typeof === W || R.$$typeof === U || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === Ue || R.getModuleId !== void 0));
    }
    function he(R, pe, ze) {
      var Qe = R.displayName;
      if (Qe)
        return Qe;
      var pt = pe.displayName || pe.name || "";
      return pt !== "" ? ze + "(" + pt + ")" : ze;
    }
    function Be(R) {
      return R.displayName || "Context";
    }
    function ee(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && le("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case J:
          return "Fragment";
        case b:
          return "Portal";
        case N:
          return "Profiler";
        case Z:
          return "StrictMode";
        case j:
          return "Suspense";
        case de:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case W:
            var pe = R;
            return Be(pe) + ".Consumer";
          case y:
            var ze = R;
            return Be(ze._context) + ".Provider";
          case U:
            return he(R, R.render, "ForwardRef");
          case z:
            var Qe = R.displayName || null;
            return Qe !== null ? Qe : ee(R.type) || "Memo";
          case Y: {
            var pt = R, _t = pt._payload, Rt = pt._init;
            try {
              return ee(Rt(_t));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Oe = Object.assign, Ze = 0, lt, je, Se, Ie, Re, O, P;
    function te() {
    }
    te.__reactDisabledLog = !0;
    function ue() {
      {
        if (Ze === 0) {
          lt = console.log, je = console.info, Se = console.warn, Ie = console.error, Re = console.group, O = console.groupCollapsed, P = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: te,
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
        Ze++;
      }
    }
    function bt() {
      {
        if (Ze--, Ze === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Oe({}, R, {
              value: lt
            }),
            info: Oe({}, R, {
              value: je
            }),
            warn: Oe({}, R, {
              value: Se
            }),
            error: Oe({}, R, {
              value: Ie
            }),
            group: Oe({}, R, {
              value: Re
            }),
            groupCollapsed: Oe({}, R, {
              value: O
            }),
            groupEnd: Oe({}, R, {
              value: P
            })
          });
        }
        Ze < 0 && le("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Tt = Ae.ReactCurrentDispatcher, yt;
    function mt(R, pe, ze) {
      {
        if (yt === void 0)
          try {
            throw Error();
          } catch (pt) {
            var Qe = pt.stack.trim().match(/\n( *(at )?)/);
            yt = Qe && Qe[1] || "";
          }
        return `
` + yt + R;
      }
    }
    var gt = !1, $t;
    {
      var Dn = typeof WeakMap == "function" ? WeakMap : Map;
      $t = new Dn();
    }
    function qn(R, pe) {
      if (!R || gt)
        return "";
      {
        var ze = $t.get(R);
        if (ze !== void 0)
          return ze;
      }
      var Qe;
      gt = !0;
      var pt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var _t;
      _t = Tt.current, Tt.current = null, ue();
      try {
        if (pe) {
          var Rt = function() {
            throw Error();
          };
          if (Object.defineProperty(Rt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Rt, []);
            } catch (xt) {
              Qe = xt;
            }
            Reflect.construct(R, [], Rt);
          } else {
            try {
              Rt.call();
            } catch (xt) {
              Qe = xt;
            }
            R.call(Rt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (xt) {
            Qe = xt;
          }
          R();
        }
      } catch (xt) {
        if (xt && Qe && typeof xt.stack == "string") {
          for (var Mt = xt.stack.split(`
`), Un = Qe.stack.split(`
`), Bt = Mt.length - 1, Cn = Un.length - 1; Bt >= 1 && Cn >= 0 && Mt[Bt] !== Un[Cn]; )
            Cn--;
          for (; Bt >= 1 && Cn >= 0; Bt--, Cn--)
            if (Mt[Bt] !== Un[Cn]) {
              if (Bt !== 1 || Cn !== 1)
                do
                  if (Bt--, Cn--, Cn < 0 || Mt[Bt] !== Un[Cn]) {
                    var yr = `
` + Mt[Bt].replace(" at new ", " at ");
                    return R.displayName && yr.includes("<anonymous>") && (yr = yr.replace("<anonymous>", R.displayName)), typeof R == "function" && $t.set(R, yr), yr;
                  }
                while (Bt >= 1 && Cn >= 0);
              break;
            }
        }
      } finally {
        gt = !1, Tt.current = _t, bt(), Error.prepareStackTrace = pt;
      }
      var Oa = R ? R.displayName || R.name : "", La = Oa ? mt(Oa) : "";
      return typeof R == "function" && $t.set(R, La), La;
    }
    function xn(R, pe, ze) {
      return qn(R, !1);
    }
    function En(R) {
      var pe = R.prototype;
      return !!(pe && pe.isReactComponent);
    }
    function On(R, pe, ze) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return qn(R, En(R));
      if (typeof R == "string")
        return mt(R);
      switch (R) {
        case j:
          return mt("Suspense");
        case de:
          return mt("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case U:
            return xn(R.render);
          case z:
            return On(R.type, pe, ze);
          case Y: {
            var Qe = R, pt = Qe._payload, _t = Qe._init;
            try {
              return On(_t(pt), pe, ze);
            } catch {
            }
          }
        }
      return "";
    }
    var Ct = Object.prototype.hasOwnProperty, Tn = {}, Ln = Ae.ReactDebugCurrentFrame;
    function Qn(R) {
      if (R) {
        var pe = R._owner, ze = On(R.type, R._source, pe ? pe.type : null);
        Ln.setExtraStackFrame(ze);
      } else
        Ln.setExtraStackFrame(null);
    }
    function An(R, pe, ze, Qe, pt) {
      {
        var _t = Function.call.bind(Ct);
        for (var Rt in R)
          if (_t(R, Rt)) {
            var Mt = void 0;
            try {
              if (typeof R[Rt] != "function") {
                var Un = Error((Qe || "React class") + ": " + ze + " type `" + Rt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[Rt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Un.name = "Invariant Violation", Un;
              }
              Mt = R[Rt](pe, Rt, Qe, ze, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (Bt) {
              Mt = Bt;
            }
            Mt && !(Mt instanceof Error) && (Qn(pt), le("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Qe || "React class", ze, Rt, typeof Mt), Qn(null)), Mt instanceof Error && !(Mt.message in Tn) && (Tn[Mt.message] = !0, Qn(pt), le("Failed %s type: %s", ze, Mt.message), Qn(null));
          }
      }
    }
    var bn = Array.isArray;
    function Rn(R) {
      return bn(R);
    }
    function V(R) {
      {
        var pe = typeof Symbol == "function" && Symbol.toStringTag, ze = pe && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return ze;
      }
    }
    function $e(R) {
      try {
        return St(R), !1;
      } catch {
        return !0;
      }
    }
    function St(R) {
      return "" + R;
    }
    function ht(R) {
      if ($e(R))
        return le("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", V(R)), St(R);
    }
    var Ir = Ae.ReactCurrentOwner, ua = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ja, Le;
    function et(R) {
      if (Ct.call(R, "ref")) {
        var pe = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (pe && pe.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function Dt(R) {
      if (Ct.call(R, "key")) {
        var pe = Object.getOwnPropertyDescriptor(R, "key").get;
        if (pe && pe.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function Kt(R, pe) {
      typeof R.ref == "string" && Ir.current;
    }
    function pn(R, pe) {
      {
        var ze = function() {
          ja || (ja = !0, le("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", pe));
        };
        ze.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: ze,
          configurable: !0
        });
      }
    }
    function Mn(R, pe) {
      {
        var ze = function() {
          Le || (Le = !0, le("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", pe));
        };
        ze.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: ze,
          configurable: !0
        });
      }
    }
    var Ut = function(R, pe, ze, Qe, pt, _t, Rt) {
      var Mt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: S,
        // Built-in properties that belong on the element
        type: R,
        key: pe,
        ref: ze,
        props: Rt,
        // Record the component responsible for creating this element.
        _owner: _t
      };
      return Mt._store = {}, Object.defineProperty(Mt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(Mt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Qe
      }), Object.defineProperty(Mt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: pt
      }), Object.freeze && (Object.freeze(Mt.props), Object.freeze(Mt)), Mt;
    };
    function Xn(R, pe, ze, Qe, pt) {
      {
        var _t, Rt = {}, Mt = null, Un = null;
        ze !== void 0 && (ht(ze), Mt = "" + ze), Dt(pe) && (ht(pe.key), Mt = "" + pe.key), et(pe) && (Un = pe.ref, Kt(pe, pt));
        for (_t in pe)
          Ct.call(pe, _t) && !ua.hasOwnProperty(_t) && (Rt[_t] = pe[_t]);
        if (R && R.defaultProps) {
          var Bt = R.defaultProps;
          for (_t in Bt)
            Rt[_t] === void 0 && (Rt[_t] = Bt[_t]);
        }
        if (Mt || Un) {
          var Cn = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          Mt && pn(Rt, Cn), Un && Mn(Rt, Cn);
        }
        return Ut(R, Mt, Un, pt, Qe, Ir.current, Rt);
      }
    }
    var fn = Ae.ReactCurrentOwner, on = Ae.ReactDebugCurrentFrame;
    function ln(R) {
      if (R) {
        var pe = R._owner, ze = On(R.type, R._source, pe ? pe.type : null);
        on.setExtraStackFrame(ze);
      } else
        on.setExtraStackFrame(null);
    }
    var jn;
    jn = !1;
    function Jn(R) {
      return typeof R == "object" && R !== null && R.$$typeof === S;
    }
    function jr() {
      {
        if (fn.current) {
          var R = ee(fn.current.type);
          if (R)
            return `

Check the render method of \`` + R + "`.";
        }
        return "";
      }
    }
    function ca(R) {
      return "";
    }
    var Qa = {};
    function Ga(R) {
      {
        var pe = jr();
        if (!pe) {
          var ze = typeof R == "string" ? R : R.displayName || R.name;
          ze && (pe = `

Check the top-level render call using <` + ze + ">.");
        }
        return pe;
      }
    }
    function Ri(R, pe) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var ze = Ga(pe);
        if (Qa[ze])
          return;
        Qa[ze] = !0;
        var Qe = "";
        R && R._owner && R._owner !== fn.current && (Qe = " It was passed a child from " + ee(R._owner.type) + "."), ln(R), le('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', ze, Qe), ln(null);
      }
    }
    function ka(R, pe) {
      {
        if (typeof R != "object")
          return;
        if (Rn(R))
          for (var ze = 0; ze < R.length; ze++) {
            var Qe = R[ze];
            Jn(Qe) && Ri(Qe, pe);
          }
        else if (Jn(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var pt = ye(R);
          if (typeof pt == "function" && pt !== R.entries)
            for (var _t = pt.call(R), Rt; !(Rt = _t.next()).done; )
              Jn(Rt.value) && Ri(Rt.value, pe);
        }
      }
    }
    function Zi(R) {
      {
        var pe = R.type;
        if (pe == null || typeof pe == "string")
          return;
        var ze;
        if (typeof pe == "function")
          ze = pe.propTypes;
        else if (typeof pe == "object" && (pe.$$typeof === U || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        pe.$$typeof === z))
          ze = pe.propTypes;
        else
          return;
        if (ze) {
          var Qe = ee(pe);
          An(ze, R.props, "prop", Qe, R);
        } else if (pe.PropTypes !== void 0 && !jn) {
          jn = !0;
          var pt = ee(pe);
          le("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", pt || "Unknown");
        }
        typeof pe.getDefaultProps == "function" && !pe.getDefaultProps.isReactClassApproved && le("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ir(R) {
      {
        for (var pe = Object.keys(R.props), ze = 0; ze < pe.length; ze++) {
          var Qe = pe[ze];
          if (Qe !== "children" && Qe !== "key") {
            ln(R), le("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Qe), ln(null);
            break;
          }
        }
        R.ref !== null && (ln(R), le("Invalid attribute `ref` supplied to `React.Fragment`."), ln(null));
      }
    }
    var kr = {};
    function Gn(R, pe, ze, Qe, pt, _t) {
      {
        var Rt = De(R);
        if (!Rt) {
          var Mt = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (Mt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Un = ca();
          Un ? Mt += Un : Mt += jr();
          var Bt;
          R === null ? Bt = "null" : Rn(R) ? Bt = "array" : R !== void 0 && R.$$typeof === S ? (Bt = "<" + (ee(R.type) || "Unknown") + " />", Mt = " Did you accidentally export a JSX literal instead of a component?") : Bt = typeof R, le("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Bt, Mt);
        }
        var Cn = Xn(R, pe, ze, pt, _t);
        if (Cn == null)
          return Cn;
        if (Rt) {
          var yr = pe.children;
          if (yr !== void 0)
            if (Qe)
              if (Rn(yr)) {
                for (var Oa = 0; Oa < yr.length; Oa++)
                  ka(yr[Oa], R);
                Object.freeze && Object.freeze(yr);
              } else
                le("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              ka(yr, R);
        }
        if (Ct.call(pe, "key")) {
          var La = ee(R), xt = Object.keys(pe).filter(function(el) {
            return el !== "key";
          }), Ot = xt.length > 0 ? "{key: someKey, " + xt.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!kr[La + Ot]) {
            var Aa = xt.length > 0 ? "{" + xt.join(": ..., ") + ": ...}" : "{}";
            le(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Ot, La, Aa, La), kr[La + Ot] = !0;
          }
        }
        return R === J ? ir(Cn) : Zi(Cn), Cn;
      }
    }
    function Ka(R, pe, ze) {
      return Gn(R, pe, ze, !0);
    }
    function fa(R, pe, ze) {
      return Gn(R, pe, ze, !1);
    }
    var Na = fa, Da = Ka;
    am.Fragment = J, am.jsx = Na, am.jsxs = Da;
  }()), am;
}
process.env.NODE_ENV === "production" ? Nx.exports = Dk() : Nx.exports = Ok();
var c = Nx.exports, Ox = { exports: {} }, mi = {}, ey = { exports: {} }, bx = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var S_;
function Lk() {
  return S_ || (S_ = 1, function(x) {
    function S(Se, Ie) {
      var Re = Se.length;
      Se.push(Ie);
      e: for (; 0 < Re; ) {
        var O = Re - 1 >>> 1, P = Se[O];
        if (0 < Z(P, Ie)) Se[O] = Ie, Se[Re] = P, Re = O;
        else break e;
      }
    }
    function b(Se) {
      return Se.length === 0 ? null : Se[0];
    }
    function J(Se) {
      if (Se.length === 0) return null;
      var Ie = Se[0], Re = Se.pop();
      if (Re !== Ie) {
        Se[0] = Re;
        e: for (var O = 0, P = Se.length, te = P >>> 1; O < te; ) {
          var ue = 2 * (O + 1) - 1, bt = Se[ue], Tt = ue + 1, yt = Se[Tt];
          if (0 > Z(bt, Re)) Tt < P && 0 > Z(yt, bt) ? (Se[O] = yt, Se[Tt] = Re, O = Tt) : (Se[O] = bt, Se[ue] = Re, O = ue);
          else if (Tt < P && 0 > Z(yt, Re)) Se[O] = yt, Se[Tt] = Re, O = Tt;
          else break e;
        }
      }
      return Ie;
    }
    function Z(Se, Ie) {
      var Re = Se.sortIndex - Ie.sortIndex;
      return Re !== 0 ? Re : Se.id - Ie.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var N = performance;
      x.unstable_now = function() {
        return N.now();
      };
    } else {
      var y = Date, W = y.now();
      x.unstable_now = function() {
        return y.now() - W;
      };
    }
    var U = [], j = [], de = 1, z = null, Y = 3, G = !1, re = !1, oe = !1, ye = typeof setTimeout == "function" ? setTimeout : null, Ae = typeof clearTimeout == "function" ? clearTimeout : null, le = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function ke(Se) {
      for (var Ie = b(j); Ie !== null; ) {
        if (Ie.callback === null) J(j);
        else if (Ie.startTime <= Se) J(j), Ie.sortIndex = Ie.expirationTime, S(U, Ie);
        else break;
        Ie = b(j);
      }
    }
    function Ee(Se) {
      if (oe = !1, ke(Se), !re) if (b(U) !== null) re = !0, lt(ce);
      else {
        var Ie = b(j);
        Ie !== null && je(Ee, Ie.startTime - Se);
      }
    }
    function ce(Se, Ie) {
      re = !1, oe && (oe = !1, Ae(_e), _e = -1), G = !0;
      var Re = Y;
      try {
        for (ke(Ie), z = b(U); z !== null && (!(z.expirationTime > Ie) || Se && !he()); ) {
          var O = z.callback;
          if (typeof O == "function") {
            z.callback = null, Y = z.priorityLevel;
            var P = O(z.expirationTime <= Ie);
            Ie = x.unstable_now(), typeof P == "function" ? z.callback = P : z === b(U) && J(U), ke(Ie);
          } else J(U);
          z = b(U);
        }
        if (z !== null) var te = !0;
        else {
          var ue = b(j);
          ue !== null && je(Ee, ue.startTime - Ie), te = !1;
        }
        return te;
      } finally {
        z = null, Y = Re, G = !1;
      }
    }
    var me = !1, I = null, _e = -1, Ue = 5, De = -1;
    function he() {
      return !(x.unstable_now() - De < Ue);
    }
    function Be() {
      if (I !== null) {
        var Se = x.unstable_now();
        De = Se;
        var Ie = !0;
        try {
          Ie = I(!0, Se);
        } finally {
          Ie ? ee() : (me = !1, I = null);
        }
      } else me = !1;
    }
    var ee;
    if (typeof le == "function") ee = function() {
      le(Be);
    };
    else if (typeof MessageChannel < "u") {
      var Oe = new MessageChannel(), Ze = Oe.port2;
      Oe.port1.onmessage = Be, ee = function() {
        Ze.postMessage(null);
      };
    } else ee = function() {
      ye(Be, 0);
    };
    function lt(Se) {
      I = Se, me || (me = !0, ee());
    }
    function je(Se, Ie) {
      _e = ye(function() {
        Se(x.unstable_now());
      }, Ie);
    }
    x.unstable_IdlePriority = 5, x.unstable_ImmediatePriority = 1, x.unstable_LowPriority = 4, x.unstable_NormalPriority = 3, x.unstable_Profiling = null, x.unstable_UserBlockingPriority = 2, x.unstable_cancelCallback = function(Se) {
      Se.callback = null;
    }, x.unstable_continueExecution = function() {
      re || G || (re = !0, lt(ce));
    }, x.unstable_forceFrameRate = function(Se) {
      0 > Se || 125 < Se ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Ue = 0 < Se ? Math.floor(1e3 / Se) : 5;
    }, x.unstable_getCurrentPriorityLevel = function() {
      return Y;
    }, x.unstable_getFirstCallbackNode = function() {
      return b(U);
    }, x.unstable_next = function(Se) {
      switch (Y) {
        case 1:
        case 2:
        case 3:
          var Ie = 3;
          break;
        default:
          Ie = Y;
      }
      var Re = Y;
      Y = Ie;
      try {
        return Se();
      } finally {
        Y = Re;
      }
    }, x.unstable_pauseExecution = function() {
    }, x.unstable_requestPaint = function() {
    }, x.unstable_runWithPriority = function(Se, Ie) {
      switch (Se) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          Se = 3;
      }
      var Re = Y;
      Y = Se;
      try {
        return Ie();
      } finally {
        Y = Re;
      }
    }, x.unstable_scheduleCallback = function(Se, Ie, Re) {
      var O = x.unstable_now();
      switch (typeof Re == "object" && Re !== null ? (Re = Re.delay, Re = typeof Re == "number" && 0 < Re ? O + Re : O) : Re = O, Se) {
        case 1:
          var P = -1;
          break;
        case 2:
          P = 250;
          break;
        case 5:
          P = 1073741823;
          break;
        case 4:
          P = 1e4;
          break;
        default:
          P = 5e3;
      }
      return P = Re + P, Se = { id: de++, callback: Ie, priorityLevel: Se, startTime: Re, expirationTime: P, sortIndex: -1 }, Re > O ? (Se.sortIndex = Re, S(j, Se), b(U) === null && Se === b(j) && (oe ? (Ae(_e), _e = -1) : oe = !0, je(Ee, Re - O))) : (Se.sortIndex = P, S(U, Se), re || G || (re = !0, lt(ce))), Se;
    }, x.unstable_shouldYield = he, x.unstable_wrapCallback = function(Se) {
      var Ie = Y;
      return function() {
        var Re = Y;
        Y = Ie;
        try {
          return Se.apply(this, arguments);
        } finally {
          Y = Re;
        }
      };
    };
  }(bx)), bx;
}
var Cx = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var x_;
function Ak() {
  return x_ || (x_ = 1, function(x) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var S = !1, b = 5;
      function J(Le, et) {
        var Dt = Le.length;
        Le.push(et), y(Le, et, Dt);
      }
      function Z(Le) {
        return Le.length === 0 ? null : Le[0];
      }
      function N(Le) {
        if (Le.length === 0)
          return null;
        var et = Le[0], Dt = Le.pop();
        return Dt !== et && (Le[0] = Dt, W(Le, Dt, 0)), et;
      }
      function y(Le, et, Dt) {
        for (var Kt = Dt; Kt > 0; ) {
          var pn = Kt - 1 >>> 1, Mn = Le[pn];
          if (U(Mn, et) > 0)
            Le[pn] = et, Le[Kt] = Mn, Kt = pn;
          else
            return;
        }
      }
      function W(Le, et, Dt) {
        for (var Kt = Dt, pn = Le.length, Mn = pn >>> 1; Kt < Mn; ) {
          var Ut = (Kt + 1) * 2 - 1, Xn = Le[Ut], fn = Ut + 1, on = Le[fn];
          if (U(Xn, et) < 0)
            fn < pn && U(on, Xn) < 0 ? (Le[Kt] = on, Le[fn] = et, Kt = fn) : (Le[Kt] = Xn, Le[Ut] = et, Kt = Ut);
          else if (fn < pn && U(on, et) < 0)
            Le[Kt] = on, Le[fn] = et, Kt = fn;
          else
            return;
        }
      }
      function U(Le, et) {
        var Dt = Le.sortIndex - et.sortIndex;
        return Dt !== 0 ? Dt : Le.id - et.id;
      }
      var j = 1, de = 2, z = 3, Y = 4, G = 5;
      function re(Le, et) {
      }
      var oe = typeof performance == "object" && typeof performance.now == "function";
      if (oe) {
        var ye = performance;
        x.unstable_now = function() {
          return ye.now();
        };
      } else {
        var Ae = Date, le = Ae.now();
        x.unstable_now = function() {
          return Ae.now() - le;
        };
      }
      var ke = 1073741823, Ee = -1, ce = 250, me = 5e3, I = 1e4, _e = ke, Ue = [], De = [], he = 1, Be = null, ee = z, Oe = !1, Ze = !1, lt = !1, je = typeof setTimeout == "function" ? setTimeout : null, Se = typeof clearTimeout == "function" ? clearTimeout : null, Ie = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function Re(Le) {
        for (var et = Z(De); et !== null; ) {
          if (et.callback === null)
            N(De);
          else if (et.startTime <= Le)
            N(De), et.sortIndex = et.expirationTime, J(Ue, et);
          else
            return;
          et = Z(De);
        }
      }
      function O(Le) {
        if (lt = !1, Re(Le), !Ze)
          if (Z(Ue) !== null)
            Ze = !0, St(P);
          else {
            var et = Z(De);
            et !== null && ht(O, et.startTime - Le);
          }
      }
      function P(Le, et) {
        Ze = !1, lt && (lt = !1, Ir()), Oe = !0;
        var Dt = ee;
        try {
          var Kt;
          if (!S) return te(Le, et);
        } finally {
          Be = null, ee = Dt, Oe = !1;
        }
      }
      function te(Le, et) {
        var Dt = et;
        for (Re(Dt), Be = Z(Ue); Be !== null && !(Be.expirationTime > Dt && (!Le || Ln())); ) {
          var Kt = Be.callback;
          if (typeof Kt == "function") {
            Be.callback = null, ee = Be.priorityLevel;
            var pn = Be.expirationTime <= Dt, Mn = Kt(pn);
            Dt = x.unstable_now(), typeof Mn == "function" ? Be.callback = Mn : Be === Z(Ue) && N(Ue), Re(Dt);
          } else
            N(Ue);
          Be = Z(Ue);
        }
        if (Be !== null)
          return !0;
        var Ut = Z(De);
        return Ut !== null && ht(O, Ut.startTime - Dt), !1;
      }
      function ue(Le, et) {
        switch (Le) {
          case j:
          case de:
          case z:
          case Y:
          case G:
            break;
          default:
            Le = z;
        }
        var Dt = ee;
        ee = Le;
        try {
          return et();
        } finally {
          ee = Dt;
        }
      }
      function bt(Le) {
        var et;
        switch (ee) {
          case j:
          case de:
          case z:
            et = z;
            break;
          default:
            et = ee;
            break;
        }
        var Dt = ee;
        ee = et;
        try {
          return Le();
        } finally {
          ee = Dt;
        }
      }
      function Tt(Le) {
        var et = ee;
        return function() {
          var Dt = ee;
          ee = et;
          try {
            return Le.apply(this, arguments);
          } finally {
            ee = Dt;
          }
        };
      }
      function yt(Le, et, Dt) {
        var Kt = x.unstable_now(), pn;
        if (typeof Dt == "object" && Dt !== null) {
          var Mn = Dt.delay;
          typeof Mn == "number" && Mn > 0 ? pn = Kt + Mn : pn = Kt;
        } else
          pn = Kt;
        var Ut;
        switch (Le) {
          case j:
            Ut = Ee;
            break;
          case de:
            Ut = ce;
            break;
          case G:
            Ut = _e;
            break;
          case Y:
            Ut = I;
            break;
          case z:
          default:
            Ut = me;
            break;
        }
        var Xn = pn + Ut, fn = {
          id: he++,
          callback: et,
          priorityLevel: Le,
          startTime: pn,
          expirationTime: Xn,
          sortIndex: -1
        };
        return pn > Kt ? (fn.sortIndex = pn, J(De, fn), Z(Ue) === null && fn === Z(De) && (lt ? Ir() : lt = !0, ht(O, pn - Kt))) : (fn.sortIndex = Xn, J(Ue, fn), !Ze && !Oe && (Ze = !0, St(P))), fn;
      }
      function mt() {
      }
      function gt() {
        !Ze && !Oe && (Ze = !0, St(P));
      }
      function $t() {
        return Z(Ue);
      }
      function Dn(Le) {
        Le.callback = null;
      }
      function qn() {
        return ee;
      }
      var xn = !1, En = null, On = -1, Ct = b, Tn = -1;
      function Ln() {
        var Le = x.unstable_now() - Tn;
        return !(Le < Ct);
      }
      function Qn() {
      }
      function An(Le) {
        if (Le < 0 || Le > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        Le > 0 ? Ct = Math.floor(1e3 / Le) : Ct = b;
      }
      var bn = function() {
        if (En !== null) {
          var Le = x.unstable_now();
          Tn = Le;
          var et = !0, Dt = !0;
          try {
            Dt = En(et, Le);
          } finally {
            Dt ? Rn() : (xn = !1, En = null);
          }
        } else
          xn = !1;
      }, Rn;
      if (typeof Ie == "function")
        Rn = function() {
          Ie(bn);
        };
      else if (typeof MessageChannel < "u") {
        var V = new MessageChannel(), $e = V.port2;
        V.port1.onmessage = bn, Rn = function() {
          $e.postMessage(null);
        };
      } else
        Rn = function() {
          je(bn, 0);
        };
      function St(Le) {
        En = Le, xn || (xn = !0, Rn());
      }
      function ht(Le, et) {
        On = je(function() {
          Le(x.unstable_now());
        }, et);
      }
      function Ir() {
        Se(On), On = -1;
      }
      var ua = Qn, ja = null;
      x.unstable_IdlePriority = G, x.unstable_ImmediatePriority = j, x.unstable_LowPriority = Y, x.unstable_NormalPriority = z, x.unstable_Profiling = ja, x.unstable_UserBlockingPriority = de, x.unstable_cancelCallback = Dn, x.unstable_continueExecution = gt, x.unstable_forceFrameRate = An, x.unstable_getCurrentPriorityLevel = qn, x.unstable_getFirstCallbackNode = $t, x.unstable_next = bt, x.unstable_pauseExecution = mt, x.unstable_requestPaint = ua, x.unstable_runWithPriority = ue, x.unstable_scheduleCallback = yt, x.unstable_shouldYield = Ln, x.unstable_wrapCallback = Tt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(Cx)), Cx;
}
var E_;
function D_() {
  return E_ || (E_ = 1, process.env.NODE_ENV === "production" ? ey.exports = Lk() : ey.exports = Ak()), ey.exports;
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
var b_;
function Mk() {
  if (b_) return mi;
  b_ = 1;
  var x = k, S = D_();
  function b(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var J = /* @__PURE__ */ new Set(), Z = {};
  function N(n, r) {
    y(n, r), y(n + "Capture", r);
  }
  function y(n, r) {
    for (Z[n] = r, n = 0; n < r.length; n++) J.add(r[n]);
  }
  var W = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), U = Object.prototype.hasOwnProperty, j = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, de = {}, z = {};
  function Y(n) {
    return U.call(z, n) ? !0 : U.call(de, n) ? !1 : j.test(n) ? z[n] = !0 : (de[n] = !0, !1);
  }
  function G(n, r, l, s) {
    if (l !== null && l.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return s ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function re(n, r, l, s) {
    if (r === null || typeof r > "u" || G(n, r, l, s)) return !0;
    if (s) return !1;
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
  function oe(n, r, l, s, f, p, g) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = s, this.attributeNamespace = f, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = p, this.removeEmptyString = g;
  }
  var ye = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    ye[n] = new oe(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    ye[r] = new oe(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    ye[n] = new oe(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    ye[n] = new oe(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    ye[n] = new oe(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    ye[n] = new oe(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    ye[n] = new oe(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    ye[n] = new oe(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    ye[n] = new oe(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Ae = /[\-:]([a-z])/g;
  function le(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Ae,
      le
    );
    ye[r] = new oe(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Ae, le);
    ye[r] = new oe(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Ae, le);
    ye[r] = new oe(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    ye[n] = new oe(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), ye.xlinkHref = new oe("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    ye[n] = new oe(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function ke(n, r, l, s) {
    var f = ye.hasOwnProperty(r) ? ye[r] : null;
    (f !== null ? f.type !== 0 : s || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (re(r, l, f, s) && (l = null), s || f === null ? Y(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : f.mustUseProperty ? n[f.propertyName] = l === null ? f.type === 3 ? !1 : "" : l : (r = f.attributeName, s = f.attributeNamespace, l === null ? n.removeAttribute(r) : (f = f.type, l = f === 3 || f === 4 && l === !0 ? "" : "" + l, s ? n.setAttributeNS(s, r, l) : n.setAttribute(r, l))));
  }
  var Ee = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ce = Symbol.for("react.element"), me = Symbol.for("react.portal"), I = Symbol.for("react.fragment"), _e = Symbol.for("react.strict_mode"), Ue = Symbol.for("react.profiler"), De = Symbol.for("react.provider"), he = Symbol.for("react.context"), Be = Symbol.for("react.forward_ref"), ee = Symbol.for("react.suspense"), Oe = Symbol.for("react.suspense_list"), Ze = Symbol.for("react.memo"), lt = Symbol.for("react.lazy"), je = Symbol.for("react.offscreen"), Se = Symbol.iterator;
  function Ie(n) {
    return n === null || typeof n != "object" ? null : (n = Se && n[Se] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var Re = Object.assign, O;
  function P(n) {
    if (O === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      O = r && r[1] || "";
    }
    return `
` + O + n;
  }
  var te = !1;
  function ue(n, r) {
    if (!n || te) return "";
    te = !0;
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
        } catch (q) {
          var s = q;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (q) {
          s = q;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (q) {
          s = q;
        }
        n();
      }
    } catch (q) {
      if (q && s && typeof q.stack == "string") {
        for (var f = q.stack.split(`
`), p = s.stack.split(`
`), g = f.length - 1, _ = p.length - 1; 1 <= g && 0 <= _ && f[g] !== p[_]; ) _--;
        for (; 1 <= g && 0 <= _; g--, _--) if (f[g] !== p[_]) {
          if (g !== 1 || _ !== 1)
            do
              if (g--, _--, 0 > _ || f[g] !== p[_]) {
                var D = `
` + f[g].replace(" at new ", " at ");
                return n.displayName && D.includes("<anonymous>") && (D = D.replace("<anonymous>", n.displayName)), D;
              }
            while (1 <= g && 0 <= _);
          break;
        }
      }
    } finally {
      te = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? P(n) : "";
  }
  function bt(n) {
    switch (n.tag) {
      case 5:
        return P(n.type);
      case 16:
        return P("Lazy");
      case 13:
        return P("Suspense");
      case 19:
        return P("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = ue(n.type, !1), n;
      case 11:
        return n = ue(n.type.render, !1), n;
      case 1:
        return n = ue(n.type, !0), n;
      default:
        return "";
    }
  }
  function Tt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case I:
        return "Fragment";
      case me:
        return "Portal";
      case Ue:
        return "Profiler";
      case _e:
        return "StrictMode";
      case ee:
        return "Suspense";
      case Oe:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case he:
        return (n.displayName || "Context") + ".Consumer";
      case De:
        return (n._context.displayName || "Context") + ".Provider";
      case Be:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case Ze:
        return r = n.displayName || null, r !== null ? r : Tt(n.type) || "Memo";
      case lt:
        r = n._payload, n = n._init;
        try {
          return Tt(n(r));
        } catch {
        }
    }
    return null;
  }
  function yt(n) {
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
        return Tt(r);
      case 8:
        return r === _e ? "StrictMode" : "Mode";
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
  function mt(n) {
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
  function gt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function $t(n) {
    var r = gt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), s = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var f = l.get, p = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return f.call(this);
      }, set: function(g) {
        s = "" + g, p.call(this, g);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return s;
      }, setValue: function(g) {
        s = "" + g;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function Dn(n) {
    n._valueTracker || (n._valueTracker = $t(n));
  }
  function qn(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), s = "";
    return n && (s = gt(n) ? n.checked ? "true" : "false" : n.value), n = s, n !== l ? (r.setValue(n), !0) : !1;
  }
  function xn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function En(n, r) {
    var l = r.checked;
    return Re({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function On(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, s = r.checked != null ? r.checked : r.defaultChecked;
    l = mt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: s, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function Ct(n, r) {
    r = r.checked, r != null && ke(n, "checked", r, !1);
  }
  function Tn(n, r) {
    Ct(n, r);
    var l = mt(r.value), s = r.type;
    if (l != null) s === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (s === "submit" || s === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? Qn(n, r.type, l) : r.hasOwnProperty("defaultValue") && Qn(n, r.type, mt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Ln(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var s = r.type;
      if (!(s !== "submit" && s !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function Qn(n, r, l) {
    (r !== "number" || xn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var An = Array.isArray;
  function bn(n, r, l, s) {
    if (n = n.options, r) {
      r = {};
      for (var f = 0; f < l.length; f++) r["$" + l[f]] = !0;
      for (l = 0; l < n.length; l++) f = r.hasOwnProperty("$" + n[l].value), n[l].selected !== f && (n[l].selected = f), f && s && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + mt(l), r = null, f = 0; f < n.length; f++) {
        if (n[f].value === l) {
          n[f].selected = !0, s && (n[f].defaultSelected = !0);
          return;
        }
        r !== null || n[f].disabled || (r = n[f]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Rn(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(b(91));
    return Re({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function V(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(b(92));
        if (An(l)) {
          if (1 < l.length) throw Error(b(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: mt(l) };
  }
  function $e(n, r) {
    var l = mt(r.value), s = mt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), s != null && (n.defaultValue = "" + s);
  }
  function St(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function ht(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Ir(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? ht(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var ua, ja = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, s, f) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, s, f);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (ua = ua || document.createElement("div"), ua.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = ua.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function Le(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var et = {
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
  }, Dt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(et).forEach(function(n) {
    Dt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), et[r] = et[n];
    });
  });
  function Kt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || et.hasOwnProperty(n) && et[n] ? ("" + r).trim() : r + "px";
  }
  function pn(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var s = l.indexOf("--") === 0, f = Kt(l, r[l], s);
      l === "float" && (l = "cssFloat"), s ? n.setProperty(l, f) : n[l] = f;
    }
  }
  var Mn = Re({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Ut(n, r) {
    if (r) {
      if (Mn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(b(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(b(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(b(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(b(62));
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
  var fn = null;
  function on(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var ln = null, jn = null, Jn = null;
  function jr(n) {
    if (n = at(n)) {
      if (typeof ln != "function") throw Error(b(280));
      var r = n.stateNode;
      r && (r = In(r), ln(n.stateNode, n.type, r));
    }
  }
  function ca(n) {
    jn ? Jn ? Jn.push(n) : Jn = [n] : jn = n;
  }
  function Qa() {
    if (jn) {
      var n = jn, r = Jn;
      if (Jn = jn = null, jr(n), r) for (n = 0; n < r.length; n++) jr(r[n]);
    }
  }
  function Ga(n, r) {
    return n(r);
  }
  function Ri() {
  }
  var ka = !1;
  function Zi(n, r, l) {
    if (ka) return n(r, l);
    ka = !0;
    try {
      return Ga(n, r, l);
    } finally {
      ka = !1, (jn !== null || Jn !== null) && (Ri(), Qa());
    }
  }
  function ir(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var s = In(l);
    if (s === null) return null;
    l = s[r];
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
        (s = !s.disabled) || (n = n.type, s = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !s;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (l && typeof l != "function") throw Error(b(231, r, typeof l));
    return l;
  }
  var kr = !1;
  if (W) try {
    var Gn = {};
    Object.defineProperty(Gn, "passive", { get: function() {
      kr = !0;
    } }), window.addEventListener("test", Gn, Gn), window.removeEventListener("test", Gn, Gn);
  } catch {
    kr = !1;
  }
  function Ka(n, r, l, s, f, p, g, _, D) {
    var q = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, q);
    } catch (be) {
      this.onError(be);
    }
  }
  var fa = !1, Na = null, Da = !1, R = null, pe = { onError: function(n) {
    fa = !0, Na = n;
  } };
  function ze(n, r, l, s, f, p, g, _, D) {
    fa = !1, Na = null, Ka.apply(pe, arguments);
  }
  function Qe(n, r, l, s, f, p, g, _, D) {
    if (ze.apply(this, arguments), fa) {
      if (fa) {
        var q = Na;
        fa = !1, Na = null;
      } else throw Error(b(198));
      Da || (Da = !0, R = q);
    }
  }
  function pt(n) {
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
  function _t(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Rt(n) {
    if (pt(n) !== n) throw Error(b(188));
  }
  function Mt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = pt(n), r === null) throw Error(b(188));
      return r !== n ? null : n;
    }
    for (var l = n, s = r; ; ) {
      var f = l.return;
      if (f === null) break;
      var p = f.alternate;
      if (p === null) {
        if (s = f.return, s !== null) {
          l = s;
          continue;
        }
        break;
      }
      if (f.child === p.child) {
        for (p = f.child; p; ) {
          if (p === l) return Rt(f), n;
          if (p === s) return Rt(f), r;
          p = p.sibling;
        }
        throw Error(b(188));
      }
      if (l.return !== s.return) l = f, s = p;
      else {
        for (var g = !1, _ = f.child; _; ) {
          if (_ === l) {
            g = !0, l = f, s = p;
            break;
          }
          if (_ === s) {
            g = !0, s = f, l = p;
            break;
          }
          _ = _.sibling;
        }
        if (!g) {
          for (_ = p.child; _; ) {
            if (_ === l) {
              g = !0, l = p, s = f;
              break;
            }
            if (_ === s) {
              g = !0, s = p, l = f;
              break;
            }
            _ = _.sibling;
          }
          if (!g) throw Error(b(189));
        }
      }
      if (l.alternate !== s) throw Error(b(190));
    }
    if (l.tag !== 3) throw Error(b(188));
    return l.stateNode.current === l ? n : r;
  }
  function Un(n) {
    return n = Mt(n), n !== null ? Bt(n) : null;
  }
  function Bt(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = Bt(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var Cn = S.unstable_scheduleCallback, yr = S.unstable_cancelCallback, Oa = S.unstable_shouldYield, La = S.unstable_requestPaint, xt = S.unstable_now, Ot = S.unstable_getCurrentPriorityLevel, Aa = S.unstable_ImmediatePriority, el = S.unstable_UserBlockingPriority, ji = S.unstable_NormalPriority, fe = S.unstable_LowPriority, w = S.unstable_IdlePriority, ve = null, ct = null;
  function Ft(n) {
    if (ct && typeof ct.onCommitFiberRoot == "function") try {
      ct.onCommitFiberRoot(ve, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Lt = Math.clz32 ? Math.clz32 : dn, _n = Math.log, lr = Math.LN2;
  function dn(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (_n(n) / lr | 0) | 0;
  }
  var or = 64, sn = 4194304;
  function Bn(n) {
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
  function Ma(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var s = 0, f = n.suspendedLanes, p = n.pingedLanes, g = l & 268435455;
    if (g !== 0) {
      var _ = g & ~f;
      _ !== 0 ? s = Bn(_) : (p &= g, p !== 0 && (s = Bn(p)));
    } else g = l & ~f, g !== 0 ? s = Bn(g) : p !== 0 && (s = Bn(p));
    if (s === 0) return 0;
    if (r !== 0 && r !== s && !(r & f) && (f = s & -s, p = r & -r, f >= p || f === 16 && (p & 4194240) !== 0)) return r;
    if (s & 4 && (s |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= s; 0 < r; ) l = 31 - Lt(r), f = 1 << l, s |= n[l], r &= ~f;
    return s;
  }
  function ts(n, r) {
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
  function fo(n, r) {
    for (var l = n.suspendedLanes, s = n.pingedLanes, f = n.expirationTimes, p = n.pendingLanes; 0 < p; ) {
      var g = 31 - Lt(p), _ = 1 << g, D = f[g];
      D === -1 ? (!(_ & l) || _ & s) && (f[g] = ts(_, r)) : D <= r && (n.expiredLanes |= _), p &= ~_;
    }
  }
  function kl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function ns() {
    var n = or;
    return or <<= 1, !(or & 4194240) && (or = 64), n;
  }
  function rs(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function tl(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Lt(r), n[r] = l;
  }
  function Jf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var s = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var f = 31 - Lt(l), p = 1 << f;
      r[f] = 0, s[f] = -1, n[f] = -1, l &= ~p;
    }
  }
  function nl(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var s = 31 - Lt(l), f = 1 << s;
      f & r | n[s] & r && (n[s] |= r), l &= ~f;
    }
  }
  var Zt = 0;
  function as(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var qt, Xs, ki, jt, is, Nr = !1, Ni = [], Gr = null, Di = null, zn = null, mn = /* @__PURE__ */ new Map(), Nl = /* @__PURE__ */ new Map(), gr = [], Kr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function qa(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Gr = null;
        break;
      case "dragenter":
      case "dragleave":
        Di = null;
        break;
      case "mouseover":
      case "mouseout":
        zn = null;
        break;
      case "pointerover":
      case "pointerout":
        mn.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Nl.delete(r.pointerId);
    }
  }
  function po(n, r, l, s, f, p) {
    return n === null || n.nativeEvent !== p ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: s, nativeEvent: p, targetContainers: [f] }, r !== null && (r = at(r), r !== null && Xs(r)), n) : (n.eventSystemFlags |= s, r = n.targetContainers, f !== null && r.indexOf(f) === -1 && r.push(f), n);
  }
  function Js(n, r, l, s, f) {
    switch (r) {
      case "focusin":
        return Gr = po(Gr, n, r, l, s, f), !0;
      case "dragenter":
        return Di = po(Di, n, r, l, s, f), !0;
      case "mouseover":
        return zn = po(zn, n, r, l, s, f), !0;
      case "pointerover":
        var p = f.pointerId;
        return mn.set(p, po(mn.get(p) || null, n, r, l, s, f)), !0;
      case "gotpointercapture":
        return p = f.pointerId, Nl.set(p, po(Nl.get(p) || null, n, r, l, s, f)), !0;
    }
    return !1;
  }
  function Zs(n) {
    var r = bo(n.target);
    if (r !== null) {
      var l = pt(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = _t(l), r !== null) {
            n.blockedOn = r, is(n.priority, function() {
              ki(l);
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
  function Dl(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = ss(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var s = new l.constructor(l.type, l);
        fn = s, l.target.dispatchEvent(s), fn = null;
      } else return r = at(l), r !== null && Xs(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function mo(n, r, l) {
    Dl(n) && l.delete(r);
  }
  function Zf() {
    Nr = !1, Gr !== null && Dl(Gr) && (Gr = null), Di !== null && Dl(Di) && (Di = null), zn !== null && Dl(zn) && (zn = null), mn.forEach(mo), Nl.forEach(mo);
  }
  function Xa(n, r) {
    n.blockedOn === r && (n.blockedOn = null, Nr || (Nr = !0, S.unstable_scheduleCallback(S.unstable_NormalPriority, Zf)));
  }
  function vi(n) {
    function r(f) {
      return Xa(f, n);
    }
    if (0 < Ni.length) {
      Xa(Ni[0], n);
      for (var l = 1; l < Ni.length; l++) {
        var s = Ni[l];
        s.blockedOn === n && (s.blockedOn = null);
      }
    }
    for (Gr !== null && Xa(Gr, n), Di !== null && Xa(Di, n), zn !== null && Xa(zn, n), mn.forEach(r), Nl.forEach(r), l = 0; l < gr.length; l++) s = gr[l], s.blockedOn === n && (s.blockedOn = null);
    for (; 0 < gr.length && (l = gr[0], l.blockedOn === null); ) Zs(l), l.blockedOn === null && gr.shift();
  }
  var Oi = Ee.ReactCurrentBatchConfig, Ja = !0;
  function ls(n, r, l, s) {
    var f = Zt, p = Oi.transition;
    Oi.transition = null;
    try {
      Zt = 1, Ol(n, r, l, s);
    } finally {
      Zt = f, Oi.transition = p;
    }
  }
  function os(n, r, l, s) {
    var f = Zt, p = Oi.transition;
    Oi.transition = null;
    try {
      Zt = 4, Ol(n, r, l, s);
    } finally {
      Zt = f, Oi.transition = p;
    }
  }
  function Ol(n, r, l, s) {
    if (Ja) {
      var f = ss(n, r, l, s);
      if (f === null) Cc(n, r, s, ho, l), qa(n, s);
      else if (Js(f, n, r, l, s)) s.stopPropagation();
      else if (qa(n, s), r & 4 && -1 < Kr.indexOf(n)) {
        for (; f !== null; ) {
          var p = at(f);
          if (p !== null && qt(p), p = ss(n, r, l, s), p === null && Cc(n, r, s, ho, l), p === f) break;
          f = p;
        }
        f !== null && s.stopPropagation();
      } else Cc(n, r, s, null, l);
    }
  }
  var ho = null;
  function ss(n, r, l, s) {
    if (ho = null, n = on(s), n = bo(n), n !== null) if (r = pt(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = _t(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return ho = n, null;
  }
  function us(n) {
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
        switch (Ot()) {
          case Aa:
            return 1;
          case el:
            return 4;
          case ji:
          case fe:
            return 16;
          case w:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var yi = null, v = null, T = null;
  function K() {
    if (T) return T;
    var n, r = v, l = r.length, s, f = "value" in yi ? yi.value : yi.textContent, p = f.length;
    for (n = 0; n < l && r[n] === f[n]; n++) ;
    var g = l - n;
    for (s = 1; s <= g && r[l - s] === f[p - s]; s++) ;
    return T = f.slice(n, 1 < s ? 1 - s : void 0);
  }
  function ne(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function Ne() {
    return !0;
  }
  function ot() {
    return !1;
  }
  function Fe(n) {
    function r(l, s, f, p, g) {
      this._reactName = l, this._targetInst = f, this.type = s, this.nativeEvent = p, this.target = g, this.currentTarget = null;
      for (var _ in n) n.hasOwnProperty(_) && (l = n[_], this[_] = l ? l(p) : p[_]);
      return this.isDefaultPrevented = (p.defaultPrevented != null ? p.defaultPrevented : p.returnValue === !1) ? Ne : ot, this.isPropagationStopped = ot, this;
    }
    return Re(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Ne);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Ne);
    }, persist: function() {
    }, isPersistent: Ne }), r;
  }
  var ft = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Ht = Fe(ft), Xt = Re({}, ft, { view: 0, detail: 0 }), kn = Fe(Xt), hn, zt, vn, Vn = Re({}, Xt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ad, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== vn && (vn && n.type === "mousemove" ? (hn = n.screenX - vn.screenX, zt = n.screenY - vn.screenY) : zt = hn = 0, vn = n), hn);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : zt;
  } }), Ll = Fe(Vn), eu = Re({}, Vn, { dataTransfer: 0 }), rl = Fe(eu), tu = Re({}, Xt, { relatedTarget: 0 }), vo = Fe(tu), ed = Re({}, ft, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), dc = Fe(ed), td = Re({}, ft, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), um = Fe(td), nd = Re({}, ft, { data: 0 }), rd = Fe(nd), cm = {
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
  }, fm = {
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
  }, ly = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function al(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ly[n]) ? !!r[n] : !1;
  }
  function ad() {
    return al;
  }
  var id = Re({}, Xt, { key: function(n) {
    if (n.key) {
      var r = cm[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = ne(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? fm[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ad, charCode: function(n) {
    return n.type === "keypress" ? ne(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? ne(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), ld = Fe(id), od = Re({}, Vn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), dm = Fe(od), pc = Re({}, Xt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ad }), pm = Fe(pc), da = Re({}, ft, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), il = Fe(da), sr = Re({}, Vn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), ll = Fe(sr), sd = [9, 13, 27, 32], cs = W && "CompositionEvent" in window, nu = null;
  W && "documentMode" in document && (nu = document.documentMode);
  var ru = W && "TextEvent" in window && !nu, mm = W && (!cs || nu && 8 < nu && 11 >= nu), hm = " ", mc = !1;
  function vm(n, r) {
    switch (n) {
      case "keyup":
        return sd.indexOf(r.keyCode) !== -1;
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
  function ym(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var fs = !1;
  function gm(n, r) {
    switch (n) {
      case "compositionend":
        return ym(r);
      case "keypress":
        return r.which !== 32 ? null : (mc = !0, hm);
      case "textInput":
        return n = r.data, n === hm && mc ? null : n;
      default:
        return null;
    }
  }
  function oy(n, r) {
    if (fs) return n === "compositionend" || !cs && vm(n, r) ? (n = K(), T = v = yi = null, fs = !1, n) : null;
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
        return mm && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var sy = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Sm(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!sy[n.type] : r === "textarea";
  }
  function ud(n, r, l, s) {
    ca(s), r = uu(r, "onChange"), 0 < r.length && (l = new Ht("onChange", "change", null, l, s), n.push({ event: l, listeners: r }));
  }
  var Li = null, yo = null;
  function xm(n) {
    xo(n, 0);
  }
  function au(n) {
    var r = Si(n);
    if (qn(r)) return n;
  }
  function uy(n, r) {
    if (n === "change") return r;
  }
  var Em = !1;
  if (W) {
    var cd;
    if (W) {
      var fd = "oninput" in document;
      if (!fd) {
        var bm = document.createElement("div");
        bm.setAttribute("oninput", "return;"), fd = typeof bm.oninput == "function";
      }
      cd = fd;
    } else cd = !1;
    Em = cd && (!document.documentMode || 9 < document.documentMode);
  }
  function Cm() {
    Li && (Li.detachEvent("onpropertychange", _m), yo = Li = null);
  }
  function _m(n) {
    if (n.propertyName === "value" && au(yo)) {
      var r = [];
      ud(r, yo, n, on(n)), Zi(xm, r);
    }
  }
  function cy(n, r, l) {
    n === "focusin" ? (Cm(), Li = r, yo = l, Li.attachEvent("onpropertychange", _m)) : n === "focusout" && Cm();
  }
  function wm(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return au(yo);
  }
  function fy(n, r) {
    if (n === "click") return au(r);
  }
  function Tm(n, r) {
    if (n === "input" || n === "change") return au(r);
  }
  function dy(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var gi = typeof Object.is == "function" ? Object.is : dy;
  function iu(n, r) {
    if (gi(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), s = Object.keys(r);
    if (l.length !== s.length) return !1;
    for (s = 0; s < l.length; s++) {
      var f = l[s];
      if (!U.call(r, f) || !gi(n[f], r[f])) return !1;
    }
    return !0;
  }
  function Rm(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function hc(n, r) {
    var l = Rm(n);
    n = 0;
    for (var s; l; ) {
      if (l.nodeType === 3) {
        if (s = n + l.textContent.length, n <= r && s >= r) return { node: l, offset: r - n };
        n = s;
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
      l = Rm(l);
    }
  }
  function Al(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Al(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function lu() {
    for (var n = window, r = xn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = xn(n.document);
    }
    return r;
  }
  function vc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function ds(n) {
    var r = lu(), l = n.focusedElem, s = n.selectionRange;
    if (r !== l && l && l.ownerDocument && Al(l.ownerDocument.documentElement, l)) {
      if (s !== null && vc(l)) {
        if (r = s.start, n = s.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var f = l.textContent.length, p = Math.min(s.start, f);
          s = s.end === void 0 ? p : Math.min(s.end, f), !n.extend && p > s && (f = s, s = p, p = f), f = hc(l, p);
          var g = hc(
            l,
            s
          );
          f && g && (n.rangeCount !== 1 || n.anchorNode !== f.node || n.anchorOffset !== f.offset || n.focusNode !== g.node || n.focusOffset !== g.offset) && (r = r.createRange(), r.setStart(f.node, f.offset), n.removeAllRanges(), p > s ? (n.addRange(r), n.extend(g.node, g.offset)) : (r.setEnd(g.node, g.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++) n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var py = W && "documentMode" in document && 11 >= document.documentMode, ps = null, dd = null, ou = null, pd = !1;
  function md(n, r, l) {
    var s = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    pd || ps == null || ps !== xn(s) || (s = ps, "selectionStart" in s && vc(s) ? s = { start: s.selectionStart, end: s.selectionEnd } : (s = (s.ownerDocument && s.ownerDocument.defaultView || window).getSelection(), s = { anchorNode: s.anchorNode, anchorOffset: s.anchorOffset, focusNode: s.focusNode, focusOffset: s.focusOffset }), ou && iu(ou, s) || (ou = s, s = uu(dd, "onSelect"), 0 < s.length && (r = new Ht("onSelect", "select", null, r, l), n.push({ event: r, listeners: s }), r.target = ps)));
  }
  function yc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var go = { animationend: yc("Animation", "AnimationEnd"), animationiteration: yc("Animation", "AnimationIteration"), animationstart: yc("Animation", "AnimationStart"), transitionend: yc("Transition", "TransitionEnd") }, Dr = {}, hd = {};
  W && (hd = document.createElement("div").style, "AnimationEvent" in window || (delete go.animationend.animation, delete go.animationiteration.animation, delete go.animationstart.animation), "TransitionEvent" in window || delete go.transitionend.transition);
  function gc(n) {
    if (Dr[n]) return Dr[n];
    if (!go[n]) return n;
    var r = go[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in hd) return Dr[n] = r[l];
    return n;
  }
  var jm = gc("animationend"), km = gc("animationiteration"), Nm = gc("animationstart"), Dm = gc("transitionend"), vd = /* @__PURE__ */ new Map(), Sc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Za(n, r) {
    vd.set(n, r), N(r, [n]);
  }
  for (var yd = 0; yd < Sc.length; yd++) {
    var So = Sc[yd], my = So.toLowerCase(), hy = So[0].toUpperCase() + So.slice(1);
    Za(my, "on" + hy);
  }
  Za(jm, "onAnimationEnd"), Za(km, "onAnimationIteration"), Za(Nm, "onAnimationStart"), Za("dblclick", "onDoubleClick"), Za("focusin", "onFocus"), Za("focusout", "onBlur"), Za(Dm, "onTransitionEnd"), y("onMouseEnter", ["mouseout", "mouseover"]), y("onMouseLeave", ["mouseout", "mouseover"]), y("onPointerEnter", ["pointerout", "pointerover"]), y("onPointerLeave", ["pointerout", "pointerover"]), N("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), N("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), N("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), N("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), N("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), N("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var su = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), gd = new Set("cancel close invalid load scroll toggle".split(" ").concat(su));
  function xc(n, r, l) {
    var s = n.type || "unknown-event";
    n.currentTarget = l, Qe(s, r, void 0, n), n.currentTarget = null;
  }
  function xo(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var s = n[l], f = s.event;
      s = s.listeners;
      e: {
        var p = void 0;
        if (r) for (var g = s.length - 1; 0 <= g; g--) {
          var _ = s[g], D = _.instance, q = _.currentTarget;
          if (_ = _.listener, D !== p && f.isPropagationStopped()) break e;
          xc(f, _, q), p = D;
        }
        else for (g = 0; g < s.length; g++) {
          if (_ = s[g], D = _.instance, q = _.currentTarget, _ = _.listener, D !== p && f.isPropagationStopped()) break e;
          xc(f, _, q), p = D;
        }
      }
    }
    if (Da) throw n = R, Da = !1, R = null, n;
  }
  function un(n, r) {
    var l = r[du];
    l === void 0 && (l = r[du] = /* @__PURE__ */ new Set());
    var s = n + "__bubble";
    l.has(s) || (Om(r, n, 2, !1), l.add(s));
  }
  function Ec(n, r, l) {
    var s = 0;
    r && (s |= 4), Om(l, n, s, r);
  }
  var bc = "_reactListening" + Math.random().toString(36).slice(2);
  function ms(n) {
    if (!n[bc]) {
      n[bc] = !0, J.forEach(function(l) {
        l !== "selectionchange" && (gd.has(l) || Ec(l, !1, n), Ec(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[bc] || (r[bc] = !0, Ec("selectionchange", !1, r));
    }
  }
  function Om(n, r, l, s) {
    switch (us(r)) {
      case 1:
        var f = ls;
        break;
      case 4:
        f = os;
        break;
      default:
        f = Ol;
    }
    l = f.bind(null, r, l, n), f = void 0, !kr || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (f = !0), s ? f !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: f }) : n.addEventListener(r, l, !0) : f !== void 0 ? n.addEventListener(r, l, { passive: f }) : n.addEventListener(r, l, !1);
  }
  function Cc(n, r, l, s, f) {
    var p = s;
    if (!(r & 1) && !(r & 2) && s !== null) e: for (; ; ) {
      if (s === null) return;
      var g = s.tag;
      if (g === 3 || g === 4) {
        var _ = s.stateNode.containerInfo;
        if (_ === f || _.nodeType === 8 && _.parentNode === f) break;
        if (g === 4) for (g = s.return; g !== null; ) {
          var D = g.tag;
          if ((D === 3 || D === 4) && (D = g.stateNode.containerInfo, D === f || D.nodeType === 8 && D.parentNode === f)) return;
          g = g.return;
        }
        for (; _ !== null; ) {
          if (g = bo(_), g === null) return;
          if (D = g.tag, D === 5 || D === 6) {
            s = p = g;
            continue e;
          }
          _ = _.parentNode;
        }
      }
      s = s.return;
    }
    Zi(function() {
      var q = p, be = on(l), we = [];
      e: {
        var xe = vd.get(n);
        if (xe !== void 0) {
          var Ye = Ht, qe = n;
          switch (n) {
            case "keypress":
              if (ne(l) === 0) break e;
            case "keydown":
            case "keyup":
              Ye = ld;
              break;
            case "focusin":
              qe = "focus", Ye = vo;
              break;
            case "focusout":
              qe = "blur", Ye = vo;
              break;
            case "beforeblur":
            case "afterblur":
              Ye = vo;
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
              Ye = Ll;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Ye = rl;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Ye = pm;
              break;
            case jm:
            case km:
            case Nm:
              Ye = dc;
              break;
            case Dm:
              Ye = il;
              break;
            case "scroll":
              Ye = kn;
              break;
            case "wheel":
              Ye = ll;
              break;
            case "copy":
            case "cut":
            case "paste":
              Ye = um;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Ye = dm;
          }
          var tt = (r & 4) !== 0, rr = !tt && n === "scroll", F = tt ? xe !== null ? xe + "Capture" : null : xe;
          tt = [];
          for (var A = q, $; A !== null; ) {
            $ = A;
            var Ce = $.stateNode;
            if ($.tag === 5 && Ce !== null && ($ = Ce, F !== null && (Ce = ir(A, F), Ce != null && tt.push(hs(A, Ce, $)))), rr) break;
            A = A.return;
          }
          0 < tt.length && (xe = new Ye(xe, qe, null, l, be), we.push({ event: xe, listeners: tt }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (xe = n === "mouseover" || n === "pointerover", Ye = n === "mouseout" || n === "pointerout", xe && l !== fn && (qe = l.relatedTarget || l.fromElement) && (bo(qe) || qe[ol])) break e;
          if ((Ye || xe) && (xe = be.window === be ? be : (xe = be.ownerDocument) ? xe.defaultView || xe.parentWindow : window, Ye ? (qe = l.relatedTarget || l.toElement, Ye = q, qe = qe ? bo(qe) : null, qe !== null && (rr = pt(qe), qe !== rr || qe.tag !== 5 && qe.tag !== 6) && (qe = null)) : (Ye = null, qe = q), Ye !== qe)) {
            if (tt = Ll, Ce = "onMouseLeave", F = "onMouseEnter", A = "mouse", (n === "pointerout" || n === "pointerover") && (tt = dm, Ce = "onPointerLeave", F = "onPointerEnter", A = "pointer"), rr = Ye == null ? xe : Si(Ye), $ = qe == null ? xe : Si(qe), xe = new tt(Ce, A + "leave", Ye, l, be), xe.target = rr, xe.relatedTarget = $, Ce = null, bo(be) === q && (tt = new tt(F, A + "enter", qe, l, be), tt.target = $, tt.relatedTarget = rr, Ce = tt), rr = Ce, Ye && qe) t: {
              for (tt = Ye, F = qe, A = 0, $ = tt; $; $ = Ml($)) A++;
              for ($ = 0, Ce = F; Ce; Ce = Ml(Ce)) $++;
              for (; 0 < A - $; ) tt = Ml(tt), A--;
              for (; 0 < $ - A; ) F = Ml(F), $--;
              for (; A--; ) {
                if (tt === F || F !== null && tt === F.alternate) break t;
                tt = Ml(tt), F = Ml(F);
              }
              tt = null;
            }
            else tt = null;
            Ye !== null && Lm(we, xe, Ye, tt, !1), qe !== null && rr !== null && Lm(we, rr, qe, tt, !0);
          }
        }
        e: {
          if (xe = q ? Si(q) : window, Ye = xe.nodeName && xe.nodeName.toLowerCase(), Ye === "select" || Ye === "input" && xe.type === "file") var Xe = uy;
          else if (Sm(xe)) if (Em) Xe = Tm;
          else {
            Xe = wm;
            var ut = cy;
          }
          else (Ye = xe.nodeName) && Ye.toLowerCase() === "input" && (xe.type === "checkbox" || xe.type === "radio") && (Xe = fy);
          if (Xe && (Xe = Xe(n, q))) {
            ud(we, Xe, l, be);
            break e;
          }
          ut && ut(n, xe, q), n === "focusout" && (ut = xe._wrapperState) && ut.controlled && xe.type === "number" && Qn(xe, "number", xe.value);
        }
        switch (ut = q ? Si(q) : window, n) {
          case "focusin":
            (Sm(ut) || ut.contentEditable === "true") && (ps = ut, dd = q, ou = null);
            break;
          case "focusout":
            ou = dd = ps = null;
            break;
          case "mousedown":
            pd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            pd = !1, md(we, l, be);
            break;
          case "selectionchange":
            if (py) break;
          case "keydown":
          case "keyup":
            md(we, l, be);
        }
        var dt;
        if (cs) e: {
          switch (n) {
            case "compositionstart":
              var wt = "onCompositionStart";
              break e;
            case "compositionend":
              wt = "onCompositionEnd";
              break e;
            case "compositionupdate":
              wt = "onCompositionUpdate";
              break e;
          }
          wt = void 0;
        }
        else fs ? vm(n, l) && (wt = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (wt = "onCompositionStart");
        wt && (mm && l.locale !== "ko" && (fs || wt !== "onCompositionStart" ? wt === "onCompositionEnd" && fs && (dt = K()) : (yi = be, v = "value" in yi ? yi.value : yi.textContent, fs = !0)), ut = uu(q, wt), 0 < ut.length && (wt = new rd(wt, n, null, l, be), we.push({ event: wt, listeners: ut }), dt ? wt.data = dt : (dt = ym(l), dt !== null && (wt.data = dt)))), (dt = ru ? gm(n, l) : oy(n, l)) && (q = uu(q, "onBeforeInput"), 0 < q.length && (be = new rd("onBeforeInput", "beforeinput", null, l, be), we.push({ event: be, listeners: q }), be.data = dt));
      }
      xo(we, r);
    });
  }
  function hs(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function uu(n, r) {
    for (var l = r + "Capture", s = []; n !== null; ) {
      var f = n, p = f.stateNode;
      f.tag === 5 && p !== null && (f = p, p = ir(n, l), p != null && s.unshift(hs(n, p, f)), p = ir(n, r), p != null && s.push(hs(n, p, f))), n = n.return;
    }
    return s;
  }
  function Ml(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function Lm(n, r, l, s, f) {
    for (var p = r._reactName, g = []; l !== null && l !== s; ) {
      var _ = l, D = _.alternate, q = _.stateNode;
      if (D !== null && D === s) break;
      _.tag === 5 && q !== null && (_ = q, f ? (D = ir(l, p), D != null && g.unshift(hs(l, D, _))) : f || (D = ir(l, p), D != null && g.push(hs(l, D, _)))), l = l.return;
    }
    g.length !== 0 && n.push({ event: r, listeners: g });
  }
  var Am = /\r\n?/g, vy = /\u0000|\uFFFD/g;
  function Mm(n) {
    return (typeof n == "string" ? n : "" + n).replace(Am, `
`).replace(vy, "");
  }
  function _c(n, r, l) {
    if (r = Mm(r), Mm(n) !== r && l) throw Error(b(425));
  }
  function Ul() {
  }
  var cu = null, Eo = null;
  function wc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Tc = typeof setTimeout == "function" ? setTimeout : void 0, Sd = typeof clearTimeout == "function" ? clearTimeout : void 0, Um = typeof Promise == "function" ? Promise : void 0, vs = typeof queueMicrotask == "function" ? queueMicrotask : typeof Um < "u" ? function(n) {
    return Um.resolve(null).then(n).catch(Rc);
  } : Tc;
  function Rc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function ys(n, r) {
    var l = r, s = 0;
    do {
      var f = l.nextSibling;
      if (n.removeChild(l), f && f.nodeType === 8) if (l = f.data, l === "/$") {
        if (s === 0) {
          n.removeChild(f), vi(r);
          return;
        }
        s--;
      } else l !== "$" && l !== "$?" && l !== "$!" || s++;
      l = f;
    } while (l);
    vi(r);
  }
  function Ai(n) {
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
  function zm(n) {
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
  var zl = Math.random().toString(36).slice(2), Mi = "__reactFiber$" + zl, fu = "__reactProps$" + zl, ol = "__reactContainer$" + zl, du = "__reactEvents$" + zl, gs = "__reactListeners$" + zl, yy = "__reactHandles$" + zl;
  function bo(n) {
    var r = n[Mi];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[ol] || l[Mi]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = zm(n); n !== null; ) {
          if (l = n[Mi]) return l;
          n = zm(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function at(n) {
    return n = n[Mi] || n[ol], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function Si(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(b(33));
  }
  function In(n) {
    return n[fu] || null;
  }
  var Yt = [], ei = -1;
  function ti(n) {
    return { current: n };
  }
  function Nn(n) {
    0 > ei || (n.current = Yt[ei], Yt[ei] = null, ei--);
  }
  function rt(n, r) {
    ei++, Yt[ei] = n.current, n.current = r;
  }
  var $r = {}, Kn = ti($r), Sr = ti(!1), pa = $r;
  function ma(n, r) {
    var l = n.type.contextTypes;
    if (!l) return $r;
    var s = n.stateNode;
    if (s && s.__reactInternalMemoizedUnmaskedChildContext === r) return s.__reactInternalMemoizedMaskedChildContext;
    var f = {}, p;
    for (p in l) f[p] = r[p];
    return s && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = f), f;
  }
  function ur(n) {
    return n = n.childContextTypes, n != null;
  }
  function Ss() {
    Nn(Sr), Nn(Kn);
  }
  function Fm(n, r, l) {
    if (Kn.current !== $r) throw Error(b(168));
    rt(Kn, r), rt(Sr, l);
  }
  function pu(n, r, l) {
    var s = n.stateNode;
    if (r = r.childContextTypes, typeof s.getChildContext != "function") return l;
    s = s.getChildContext();
    for (var f in s) if (!(f in r)) throw Error(b(108, yt(n) || "Unknown", f));
    return Re({}, l, s);
  }
  function Cr(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || $r, pa = Kn.current, rt(Kn, n), rt(Sr, Sr.current), !0;
  }
  function jc(n, r, l) {
    var s = n.stateNode;
    if (!s) throw Error(b(169));
    l ? (n = pu(n, r, pa), s.__reactInternalMemoizedMergedChildContext = n, Nn(Sr), Nn(Kn), rt(Kn, n)) : Nn(Sr), rt(Sr, l);
  }
  var Ui = null, xs = !1, sl = !1;
  function kc(n) {
    Ui === null ? Ui = [n] : Ui.push(n);
  }
  function Fl(n) {
    xs = !0, kc(n);
  }
  function zi() {
    if (!sl && Ui !== null) {
      sl = !0;
      var n = 0, r = Zt;
      try {
        var l = Ui;
        for (Zt = 1; n < l.length; n++) {
          var s = l[n];
          do
            s = s(!0);
          while (s !== null);
        }
        Ui = null, xs = !1;
      } catch (f) {
        throw Ui !== null && (Ui = Ui.slice(n + 1)), Cn(Aa, zi), f;
      } finally {
        Zt = r, sl = !1;
      }
    }
    return null;
  }
  var Pl = [], Hl = 0, Bl = null, ul = 0, cr = [], ni = 0, Ua = null, Fi = 1, Pi = "";
  function Co(n, r) {
    Pl[Hl++] = ul, Pl[Hl++] = Bl, Bl = n, ul = r;
  }
  function Pm(n, r, l) {
    cr[ni++] = Fi, cr[ni++] = Pi, cr[ni++] = Ua, Ua = n;
    var s = Fi;
    n = Pi;
    var f = 32 - Lt(s) - 1;
    s &= ~(1 << f), l += 1;
    var p = 32 - Lt(r) + f;
    if (30 < p) {
      var g = f - f % 5;
      p = (s & (1 << g) - 1).toString(32), s >>= g, f -= g, Fi = 1 << 32 - Lt(r) + f | l << f | s, Pi = p + n;
    } else Fi = 1 << p | l << f | s, Pi = n;
  }
  function Nc(n) {
    n.return !== null && (Co(n, 1), Pm(n, 1, 0));
  }
  function Dc(n) {
    for (; n === Bl; ) Bl = Pl[--Hl], Pl[Hl] = null, ul = Pl[--Hl], Pl[Hl] = null;
    for (; n === Ua; ) Ua = cr[--ni], cr[ni] = null, Pi = cr[--ni], cr[ni] = null, Fi = cr[--ni], cr[ni] = null;
  }
  var ha = null, va = null, Pn = !1, ri = null;
  function xd(n, r) {
    var l = si(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Hm(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, ha = n, va = Ai(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, ha = n, va = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = Ua !== null ? { id: Fi, overflow: Pi } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = si(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, ha = n, va = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Ed(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function bd(n) {
    if (Pn) {
      var r = va;
      if (r) {
        var l = r;
        if (!Hm(n, r)) {
          if (Ed(n)) throw Error(b(418));
          r = Ai(l.nextSibling);
          var s = ha;
          r && Hm(n, r) ? xd(s, l) : (n.flags = n.flags & -4097 | 2, Pn = !1, ha = n);
        }
      } else {
        if (Ed(n)) throw Error(b(418));
        n.flags = n.flags & -4097 | 2, Pn = !1, ha = n;
      }
    }
  }
  function xr(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    ha = n;
  }
  function Oc(n) {
    if (n !== ha) return !1;
    if (!Pn) return xr(n), Pn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !wc(n.type, n.memoizedProps)), r && (r = va)) {
      if (Ed(n)) throw mu(), Error(b(418));
      for (; r; ) xd(n, r), r = Ai(r.nextSibling);
    }
    if (xr(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(b(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                va = Ai(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        va = null;
      }
    } else va = ha ? Ai(n.stateNode.nextSibling) : null;
    return !0;
  }
  function mu() {
    for (var n = va; n; ) n = Ai(n.nextSibling);
  }
  function Vl() {
    va = ha = null, Pn = !1;
  }
  function cl(n) {
    ri === null ? ri = [n] : ri.push(n);
  }
  var gy = Ee.ReactCurrentBatchConfig;
  function _o(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(b(309));
          var s = l.stateNode;
        }
        if (!s) throw Error(b(147, n));
        var f = s, p = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === p ? r.ref : (r = function(g) {
          var _ = f.refs;
          g === null ? delete _[p] : _[p] = g;
        }, r._stringRef = p, r);
      }
      if (typeof n != "string") throw Error(b(284));
      if (!l._owner) throw Error(b(290, n));
    }
    return n;
  }
  function Lc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(b(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Bm(n) {
    var r = n._init;
    return r(n._payload);
  }
  function wo(n) {
    function r(F, A) {
      if (n) {
        var $ = F.deletions;
        $ === null ? (F.deletions = [A], F.flags |= 16) : $.push(A);
      }
    }
    function l(F, A) {
      if (!n) return null;
      for (; A !== null; ) r(F, A), A = A.sibling;
      return null;
    }
    function s(F, A) {
      for (F = /* @__PURE__ */ new Map(); A !== null; ) A.key !== null ? F.set(A.key, A) : F.set(A.index, A), A = A.sibling;
      return F;
    }
    function f(F, A) {
      return F = ql(F, A), F.index = 0, F.sibling = null, F;
    }
    function p(F, A, $) {
      return F.index = $, n ? ($ = F.alternate, $ !== null ? ($ = $.index, $ < A ? (F.flags |= 2, A) : $) : (F.flags |= 2, A)) : (F.flags |= 1048576, A);
    }
    function g(F) {
      return n && F.alternate === null && (F.flags |= 2), F;
    }
    function _(F, A, $, Ce) {
      return A === null || A.tag !== 6 ? (A = Zd($, F.mode, Ce), A.return = F, A) : (A = f(A, $), A.return = F, A);
    }
    function D(F, A, $, Ce) {
      var Xe = $.type;
      return Xe === I ? be(F, A, $.props.children, Ce, $.key) : A !== null && (A.elementType === Xe || typeof Xe == "object" && Xe !== null && Xe.$$typeof === lt && Bm(Xe) === A.type) ? (Ce = f(A, $.props), Ce.ref = _o(F, A, $), Ce.return = F, Ce) : (Ce = $u($.type, $.key, $.props, null, F.mode, Ce), Ce.ref = _o(F, A, $), Ce.return = F, Ce);
    }
    function q(F, A, $, Ce) {
      return A === null || A.tag !== 4 || A.stateNode.containerInfo !== $.containerInfo || A.stateNode.implementation !== $.implementation ? (A = pf($, F.mode, Ce), A.return = F, A) : (A = f(A, $.children || []), A.return = F, A);
    }
    function be(F, A, $, Ce, Xe) {
      return A === null || A.tag !== 7 ? (A = vl($, F.mode, Ce, Xe), A.return = F, A) : (A = f(A, $), A.return = F, A);
    }
    function we(F, A, $) {
      if (typeof A == "string" && A !== "" || typeof A == "number") return A = Zd("" + A, F.mode, $), A.return = F, A;
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case ce:
            return $ = $u(A.type, A.key, A.props, null, F.mode, $), $.ref = _o(F, null, A), $.return = F, $;
          case me:
            return A = pf(A, F.mode, $), A.return = F, A;
          case lt:
            var Ce = A._init;
            return we(F, Ce(A._payload), $);
        }
        if (An(A) || Ie(A)) return A = vl(A, F.mode, $, null), A.return = F, A;
        Lc(F, A);
      }
      return null;
    }
    function xe(F, A, $, Ce) {
      var Xe = A !== null ? A.key : null;
      if (typeof $ == "string" && $ !== "" || typeof $ == "number") return Xe !== null ? null : _(F, A, "" + $, Ce);
      if (typeof $ == "object" && $ !== null) {
        switch ($.$$typeof) {
          case ce:
            return $.key === Xe ? D(F, A, $, Ce) : null;
          case me:
            return $.key === Xe ? q(F, A, $, Ce) : null;
          case lt:
            return Xe = $._init, xe(
              F,
              A,
              Xe($._payload),
              Ce
            );
        }
        if (An($) || Ie($)) return Xe !== null ? null : be(F, A, $, Ce, null);
        Lc(F, $);
      }
      return null;
    }
    function Ye(F, A, $, Ce, Xe) {
      if (typeof Ce == "string" && Ce !== "" || typeof Ce == "number") return F = F.get($) || null, _(A, F, "" + Ce, Xe);
      if (typeof Ce == "object" && Ce !== null) {
        switch (Ce.$$typeof) {
          case ce:
            return F = F.get(Ce.key === null ? $ : Ce.key) || null, D(A, F, Ce, Xe);
          case me:
            return F = F.get(Ce.key === null ? $ : Ce.key) || null, q(A, F, Ce, Xe);
          case lt:
            var ut = Ce._init;
            return Ye(F, A, $, ut(Ce._payload), Xe);
        }
        if (An(Ce) || Ie(Ce)) return F = F.get($) || null, be(A, F, Ce, Xe, null);
        Lc(A, Ce);
      }
      return null;
    }
    function qe(F, A, $, Ce) {
      for (var Xe = null, ut = null, dt = A, wt = A = 0, Tr = null; dt !== null && wt < $.length; wt++) {
        dt.index > wt ? (Tr = dt, dt = null) : Tr = dt.sibling;
        var nn = xe(F, dt, $[wt], Ce);
        if (nn === null) {
          dt === null && (dt = Tr);
          break;
        }
        n && dt && nn.alternate === null && r(F, dt), A = p(nn, A, wt), ut === null ? Xe = nn : ut.sibling = nn, ut = nn, dt = Tr;
      }
      if (wt === $.length) return l(F, dt), Pn && Co(F, wt), Xe;
      if (dt === null) {
        for (; wt < $.length; wt++) dt = we(F, $[wt], Ce), dt !== null && (A = p(dt, A, wt), ut === null ? Xe = dt : ut.sibling = dt, ut = dt);
        return Pn && Co(F, wt), Xe;
      }
      for (dt = s(F, dt); wt < $.length; wt++) Tr = Ye(dt, F, wt, $[wt], Ce), Tr !== null && (n && Tr.alternate !== null && dt.delete(Tr.key === null ? wt : Tr.key), A = p(Tr, A, wt), ut === null ? Xe = Tr : ut.sibling = Tr, ut = Tr);
      return n && dt.forEach(function(Zl) {
        return r(F, Zl);
      }), Pn && Co(F, wt), Xe;
    }
    function tt(F, A, $, Ce) {
      var Xe = Ie($);
      if (typeof Xe != "function") throw Error(b(150));
      if ($ = Xe.call($), $ == null) throw Error(b(151));
      for (var ut = Xe = null, dt = A, wt = A = 0, Tr = null, nn = $.next(); dt !== null && !nn.done; wt++, nn = $.next()) {
        dt.index > wt ? (Tr = dt, dt = null) : Tr = dt.sibling;
        var Zl = xe(F, dt, nn.value, Ce);
        if (Zl === null) {
          dt === null && (dt = Tr);
          break;
        }
        n && dt && Zl.alternate === null && r(F, dt), A = p(Zl, A, wt), ut === null ? Xe = Zl : ut.sibling = Zl, ut = Zl, dt = Tr;
      }
      if (nn.done) return l(
        F,
        dt
      ), Pn && Co(F, wt), Xe;
      if (dt === null) {
        for (; !nn.done; wt++, nn = $.next()) nn = we(F, nn.value, Ce), nn !== null && (A = p(nn, A, wt), ut === null ? Xe = nn : ut.sibling = nn, ut = nn);
        return Pn && Co(F, wt), Xe;
      }
      for (dt = s(F, dt); !nn.done; wt++, nn = $.next()) nn = Ye(dt, F, wt, nn.value, Ce), nn !== null && (n && nn.alternate !== null && dt.delete(nn.key === null ? wt : nn.key), A = p(nn, A, wt), ut === null ? Xe = nn : ut.sibling = nn, ut = nn);
      return n && dt.forEach(function(Ch) {
        return r(F, Ch);
      }), Pn && Co(F, wt), Xe;
    }
    function rr(F, A, $, Ce) {
      if (typeof $ == "object" && $ !== null && $.type === I && $.key === null && ($ = $.props.children), typeof $ == "object" && $ !== null) {
        switch ($.$$typeof) {
          case ce:
            e: {
              for (var Xe = $.key, ut = A; ut !== null; ) {
                if (ut.key === Xe) {
                  if (Xe = $.type, Xe === I) {
                    if (ut.tag === 7) {
                      l(F, ut.sibling), A = f(ut, $.props.children), A.return = F, F = A;
                      break e;
                    }
                  } else if (ut.elementType === Xe || typeof Xe == "object" && Xe !== null && Xe.$$typeof === lt && Bm(Xe) === ut.type) {
                    l(F, ut.sibling), A = f(ut, $.props), A.ref = _o(F, ut, $), A.return = F, F = A;
                    break e;
                  }
                  l(F, ut);
                  break;
                } else r(F, ut);
                ut = ut.sibling;
              }
              $.type === I ? (A = vl($.props.children, F.mode, Ce, $.key), A.return = F, F = A) : (Ce = $u($.type, $.key, $.props, null, F.mode, Ce), Ce.ref = _o(F, A, $), Ce.return = F, F = Ce);
            }
            return g(F);
          case me:
            e: {
              for (ut = $.key; A !== null; ) {
                if (A.key === ut) if (A.tag === 4 && A.stateNode.containerInfo === $.containerInfo && A.stateNode.implementation === $.implementation) {
                  l(F, A.sibling), A = f(A, $.children || []), A.return = F, F = A;
                  break e;
                } else {
                  l(F, A);
                  break;
                }
                else r(F, A);
                A = A.sibling;
              }
              A = pf($, F.mode, Ce), A.return = F, F = A;
            }
            return g(F);
          case lt:
            return ut = $._init, rr(F, A, ut($._payload), Ce);
        }
        if (An($)) return qe(F, A, $, Ce);
        if (Ie($)) return tt(F, A, $, Ce);
        Lc(F, $);
      }
      return typeof $ == "string" && $ !== "" || typeof $ == "number" ? ($ = "" + $, A !== null && A.tag === 6 ? (l(F, A.sibling), A = f(A, $), A.return = F, F = A) : (l(F, A), A = Zd($, F.mode, Ce), A.return = F, F = A), g(F)) : l(F, A);
    }
    return rr;
  }
  var Zn = wo(!0), Pe = wo(!1), za = ti(null), ya = null, Es = null, Cd = null;
  function _d() {
    Cd = Es = ya = null;
  }
  function wd(n) {
    var r = za.current;
    Nn(za), n._currentValue = r;
  }
  function Td(n, r, l) {
    for (; n !== null; ) {
      var s = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, s !== null && (s.childLanes |= r)) : s !== null && (s.childLanes & r) !== r && (s.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function $n(n, r) {
    ya = n, Cd = Es = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (dr = !0), n.firstContext = null);
  }
  function ai(n) {
    var r = n._currentValue;
    if (Cd !== n) if (n = { context: n, memoizedValue: r, next: null }, Es === null) {
      if (ya === null) throw Error(b(308));
      Es = n, ya.dependencies = { lanes: 0, firstContext: n };
    } else Es = Es.next = n;
    return r;
  }
  var To = null;
  function Rd(n) {
    To === null ? To = [n] : To.push(n);
  }
  function jd(n, r, l, s) {
    var f = r.interleaved;
    return f === null ? (l.next = l, Rd(r)) : (l.next = f.next, f.next = l), r.interleaved = l, Fa(n, s);
  }
  function Fa(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Pa = !1;
  function kd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Vm(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function fl(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Il(n, r, l) {
    var s = n.updateQueue;
    if (s === null) return null;
    if (s = s.shared, Wt & 2) {
      var f = s.pending;
      return f === null ? r.next = r : (r.next = f.next, f.next = r), s.pending = r, Fa(n, l);
    }
    return f = s.interleaved, f === null ? (r.next = r, Rd(s)) : (r.next = f.next, f.next = r), s.interleaved = r, Fa(n, l);
  }
  function Ac(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var s = r.lanes;
      s &= n.pendingLanes, l |= s, r.lanes = l, nl(n, l);
    }
  }
  function Im(n, r) {
    var l = n.updateQueue, s = n.alternate;
    if (s !== null && (s = s.updateQueue, l === s)) {
      var f = null, p = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var g = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          p === null ? f = p = g : p = p.next = g, l = l.next;
        } while (l !== null);
        p === null ? f = p = r : p = p.next = r;
      } else f = p = r;
      l = { baseState: s.baseState, firstBaseUpdate: f, lastBaseUpdate: p, shared: s.shared, effects: s.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function hu(n, r, l, s) {
    var f = n.updateQueue;
    Pa = !1;
    var p = f.firstBaseUpdate, g = f.lastBaseUpdate, _ = f.shared.pending;
    if (_ !== null) {
      f.shared.pending = null;
      var D = _, q = D.next;
      D.next = null, g === null ? p = q : g.next = q, g = D;
      var be = n.alternate;
      be !== null && (be = be.updateQueue, _ = be.lastBaseUpdate, _ !== g && (_ === null ? be.firstBaseUpdate = q : _.next = q, be.lastBaseUpdate = D));
    }
    if (p !== null) {
      var we = f.baseState;
      g = 0, be = q = D = null, _ = p;
      do {
        var xe = _.lane, Ye = _.eventTime;
        if ((s & xe) === xe) {
          be !== null && (be = be.next = {
            eventTime: Ye,
            lane: 0,
            tag: _.tag,
            payload: _.payload,
            callback: _.callback,
            next: null
          });
          e: {
            var qe = n, tt = _;
            switch (xe = r, Ye = l, tt.tag) {
              case 1:
                if (qe = tt.payload, typeof qe == "function") {
                  we = qe.call(Ye, we, xe);
                  break e;
                }
                we = qe;
                break e;
              case 3:
                qe.flags = qe.flags & -65537 | 128;
              case 0:
                if (qe = tt.payload, xe = typeof qe == "function" ? qe.call(Ye, we, xe) : qe, xe == null) break e;
                we = Re({}, we, xe);
                break e;
              case 2:
                Pa = !0;
            }
          }
          _.callback !== null && _.lane !== 0 && (n.flags |= 64, xe = f.effects, xe === null ? f.effects = [_] : xe.push(_));
        } else Ye = { eventTime: Ye, lane: xe, tag: _.tag, payload: _.payload, callback: _.callback, next: null }, be === null ? (q = be = Ye, D = we) : be = be.next = Ye, g |= xe;
        if (_ = _.next, _ === null) {
          if (_ = f.shared.pending, _ === null) break;
          xe = _, _ = xe.next, xe.next = null, f.lastBaseUpdate = xe, f.shared.pending = null;
        }
      } while (!0);
      if (be === null && (D = we), f.baseState = D, f.firstBaseUpdate = q, f.lastBaseUpdate = be, r = f.shared.interleaved, r !== null) {
        f = r;
        do
          g |= f.lane, f = f.next;
        while (f !== r);
      } else p === null && (f.shared.lanes = 0);
      $i |= g, n.lanes = g, n.memoizedState = we;
    }
  }
  function Nd(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var s = n[r], f = s.callback;
      if (f !== null) {
        if (s.callback = null, s = l, typeof f != "function") throw Error(b(191, f));
        f.call(s);
      }
    }
  }
  var vu = {}, Hi = ti(vu), yu = ti(vu), gu = ti(vu);
  function Ro(n) {
    if (n === vu) throw Error(b(174));
    return n;
  }
  function Dd(n, r) {
    switch (rt(gu, r), rt(yu, n), rt(Hi, vu), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : Ir(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = Ir(r, n);
    }
    Nn(Hi), rt(Hi, r);
  }
  function jo() {
    Nn(Hi), Nn(yu), Nn(gu);
  }
  function $m(n) {
    Ro(gu.current);
    var r = Ro(Hi.current), l = Ir(r, n.type);
    r !== l && (rt(yu, n), rt(Hi, l));
  }
  function Mc(n) {
    yu.current === n && (Nn(Hi), Nn(yu));
  }
  var Yn = ti(0);
  function Uc(n) {
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
  var Su = [];
  function it() {
    for (var n = 0; n < Su.length; n++) Su[n]._workInProgressVersionPrimary = null;
    Su.length = 0;
  }
  var Pt = Ee.ReactCurrentDispatcher, en = Ee.ReactCurrentBatchConfig, yn = 0, tn = null, fr = null, _r = null, zc = !1, xu = !1, ko = 0, ge = 0;
  function Jt() {
    throw Error(b(321));
  }
  function vt(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!gi(n[l], r[l])) return !1;
    return !0;
  }
  function $l(n, r, l, s, f, p) {
    if (yn = p, tn = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Pt.current = n === null || n.memoizedState === null ? Jc : Tu, n = l(s, f), xu) {
      p = 0;
      do {
        if (xu = !1, ko = 0, 25 <= p) throw Error(b(301));
        p += 1, _r = fr = null, r.updateQueue = null, Pt.current = Zc, n = l(s, f);
      } while (xu);
    }
    if (Pt.current = Ao, r = fr !== null && fr.next !== null, yn = 0, _r = fr = tn = null, zc = !1, r) throw Error(b(300));
    return n;
  }
  function xi() {
    var n = ko !== 0;
    return ko = 0, n;
  }
  function Yr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return _r === null ? tn.memoizedState = _r = n : _r = _r.next = n, _r;
  }
  function er() {
    if (fr === null) {
      var n = tn.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = fr.next;
    var r = _r === null ? tn.memoizedState : _r.next;
    if (r !== null) _r = r, fr = n;
    else {
      if (n === null) throw Error(b(310));
      fr = n, n = { memoizedState: fr.memoizedState, baseState: fr.baseState, baseQueue: fr.baseQueue, queue: fr.queue, next: null }, _r === null ? tn.memoizedState = _r = n : _r = _r.next = n;
    }
    return _r;
  }
  function dl(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Yl(n) {
    var r = er(), l = r.queue;
    if (l === null) throw Error(b(311));
    l.lastRenderedReducer = n;
    var s = fr, f = s.baseQueue, p = l.pending;
    if (p !== null) {
      if (f !== null) {
        var g = f.next;
        f.next = p.next, p.next = g;
      }
      s.baseQueue = f = p, l.pending = null;
    }
    if (f !== null) {
      p = f.next, s = s.baseState;
      var _ = g = null, D = null, q = p;
      do {
        var be = q.lane;
        if ((yn & be) === be) D !== null && (D = D.next = { lane: 0, action: q.action, hasEagerState: q.hasEagerState, eagerState: q.eagerState, next: null }), s = q.hasEagerState ? q.eagerState : n(s, q.action);
        else {
          var we = {
            lane: be,
            action: q.action,
            hasEagerState: q.hasEagerState,
            eagerState: q.eagerState,
            next: null
          };
          D === null ? (_ = D = we, g = s) : D = D.next = we, tn.lanes |= be, $i |= be;
        }
        q = q.next;
      } while (q !== null && q !== p);
      D === null ? g = s : D.next = _, gi(s, r.memoizedState) || (dr = !0), r.memoizedState = s, r.baseState = g, r.baseQueue = D, l.lastRenderedState = s;
    }
    if (n = l.interleaved, n !== null) {
      f = n;
      do
        p = f.lane, tn.lanes |= p, $i |= p, f = f.next;
      while (f !== n);
    } else f === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function No(n) {
    var r = er(), l = r.queue;
    if (l === null) throw Error(b(311));
    l.lastRenderedReducer = n;
    var s = l.dispatch, f = l.pending, p = r.memoizedState;
    if (f !== null) {
      l.pending = null;
      var g = f = f.next;
      do
        p = n(p, g.action), g = g.next;
      while (g !== f);
      gi(p, r.memoizedState) || (dr = !0), r.memoizedState = p, r.baseQueue === null && (r.baseState = p), l.lastRenderedState = p;
    }
    return [p, s];
  }
  function Fc() {
  }
  function Pc(n, r) {
    var l = tn, s = er(), f = r(), p = !gi(s.memoizedState, f);
    if (p && (s.memoizedState = f, dr = !0), s = s.queue, Eu(Vc.bind(null, l, s, n), [n]), s.getSnapshot !== r || p || _r !== null && _r.memoizedState.tag & 1) {
      if (l.flags |= 2048, Do(9, Bc.bind(null, l, s, f, r), void 0, null), Er === null) throw Error(b(349));
      yn & 30 || Hc(l, r, f);
    }
    return f;
  }
  function Hc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = tn.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, tn.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Bc(n, r, l, s) {
    r.value = l, r.getSnapshot = s, Ic(r) && $c(n);
  }
  function Vc(n, r, l) {
    return l(function() {
      Ic(r) && $c(n);
    });
  }
  function Ic(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !gi(n, l);
    } catch {
      return !0;
    }
  }
  function $c(n) {
    var r = Fa(n, 1);
    r !== null && Zr(r, n, 1, -1);
  }
  function Yc(n) {
    var r = Yr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: dl, lastRenderedState: n }, r.queue = n, n = n.dispatch = Lo.bind(null, tn, n), [r.memoizedState, n];
  }
  function Do(n, r, l, s) {
    return n = { tag: n, create: r, destroy: l, deps: s, next: null }, r = tn.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, tn.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (s = l.next, l.next = n, n.next = s, r.lastEffect = n)), n;
  }
  function Wc() {
    return er().memoizedState;
  }
  function bs(n, r, l, s) {
    var f = Yr();
    tn.flags |= n, f.memoizedState = Do(1 | r, l, void 0, s === void 0 ? null : s);
  }
  function Cs(n, r, l, s) {
    var f = er();
    s = s === void 0 ? null : s;
    var p = void 0;
    if (fr !== null) {
      var g = fr.memoizedState;
      if (p = g.destroy, s !== null && vt(s, g.deps)) {
        f.memoizedState = Do(r, l, p, s);
        return;
      }
    }
    tn.flags |= n, f.memoizedState = Do(1 | r, l, p, s);
  }
  function Qc(n, r) {
    return bs(8390656, 8, n, r);
  }
  function Eu(n, r) {
    return Cs(2048, 8, n, r);
  }
  function Gc(n, r) {
    return Cs(4, 2, n, r);
  }
  function bu(n, r) {
    return Cs(4, 4, n, r);
  }
  function Oo(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Kc(n, r, l) {
    return l = l != null ? l.concat([n]) : null, Cs(4, 4, Oo.bind(null, r, n), l);
  }
  function Cu() {
  }
  function qc(n, r) {
    var l = er();
    r = r === void 0 ? null : r;
    var s = l.memoizedState;
    return s !== null && r !== null && vt(r, s[1]) ? s[0] : (l.memoizedState = [n, r], n);
  }
  function Xc(n, r) {
    var l = er();
    r = r === void 0 ? null : r;
    var s = l.memoizedState;
    return s !== null && r !== null && vt(r, s[1]) ? s[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function Od(n, r, l) {
    return yn & 21 ? (gi(l, r) || (l = ns(), tn.lanes |= l, $i |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, dr = !0), n.memoizedState = l);
  }
  function _u(n, r) {
    var l = Zt;
    Zt = l !== 0 && 4 > l ? l : 4, n(!0);
    var s = en.transition;
    en.transition = {};
    try {
      n(!1), r();
    } finally {
      Zt = l, en.transition = s;
    }
  }
  function Ld() {
    return er().memoizedState;
  }
  function wu(n, r, l) {
    var s = Yi(n);
    if (l = { lane: s, action: l, hasEagerState: !1, eagerState: null, next: null }, ga(n)) Ym(r, l);
    else if (l = jd(n, r, l, s), l !== null) {
      var f = hr();
      Zr(l, n, s, f), wn(l, r, s);
    }
  }
  function Lo(n, r, l) {
    var s = Yi(n), f = { lane: s, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (ga(n)) Ym(r, f);
    else {
      var p = n.alternate;
      if (n.lanes === 0 && (p === null || p.lanes === 0) && (p = r.lastRenderedReducer, p !== null)) try {
        var g = r.lastRenderedState, _ = p(g, l);
        if (f.hasEagerState = !0, f.eagerState = _, gi(_, g)) {
          var D = r.interleaved;
          D === null ? (f.next = f, Rd(r)) : (f.next = D.next, D.next = f), r.interleaved = f;
          return;
        }
      } catch {
      } finally {
      }
      l = jd(n, r, f, s), l !== null && (f = hr(), Zr(l, n, s, f), wn(l, r, s));
    }
  }
  function ga(n) {
    var r = n.alternate;
    return n === tn || r !== null && r === tn;
  }
  function Ym(n, r) {
    xu = zc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function wn(n, r, l) {
    if (l & 4194240) {
      var s = r.lanes;
      s &= n.pendingLanes, l |= s, r.lanes = l, nl(n, l);
    }
  }
  var Ao = { readContext: ai, useCallback: Jt, useContext: Jt, useEffect: Jt, useImperativeHandle: Jt, useInsertionEffect: Jt, useLayoutEffect: Jt, useMemo: Jt, useReducer: Jt, useRef: Jt, useState: Jt, useDebugValue: Jt, useDeferredValue: Jt, useTransition: Jt, useMutableSource: Jt, useSyncExternalStore: Jt, useId: Jt, unstable_isNewReconciler: !1 }, Jc = { readContext: ai, useCallback: function(n, r) {
    return Yr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: ai, useEffect: Qc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, bs(
      4194308,
      4,
      Oo.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return bs(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return bs(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Yr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var s = Yr();
    return r = l !== void 0 ? l(r) : r, s.memoizedState = s.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, s.queue = n, n = n.dispatch = wu.bind(null, tn, n), [s.memoizedState, n];
  }, useRef: function(n) {
    var r = Yr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Yc, useDebugValue: Cu, useDeferredValue: function(n) {
    return Yr().memoizedState = n;
  }, useTransition: function() {
    var n = Yc(!1), r = n[0];
    return n = _u.bind(null, n[1]), Yr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var s = tn, f = Yr();
    if (Pn) {
      if (l === void 0) throw Error(b(407));
      l = l();
    } else {
      if (l = r(), Er === null) throw Error(b(349));
      yn & 30 || Hc(s, r, l);
    }
    f.memoizedState = l;
    var p = { value: l, getSnapshot: r };
    return f.queue = p, Qc(Vc.bind(
      null,
      s,
      p,
      n
    ), [n]), s.flags |= 2048, Do(9, Bc.bind(null, s, p, l, r), void 0, null), l;
  }, useId: function() {
    var n = Yr(), r = Er.identifierPrefix;
    if (Pn) {
      var l = Pi, s = Fi;
      l = (s & ~(1 << 32 - Lt(s) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = ko++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = ge++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, Tu = {
    readContext: ai,
    useCallback: qc,
    useContext: ai,
    useEffect: Eu,
    useImperativeHandle: Kc,
    useInsertionEffect: Gc,
    useLayoutEffect: bu,
    useMemo: Xc,
    useReducer: Yl,
    useRef: Wc,
    useState: function() {
      return Yl(dl);
    },
    useDebugValue: Cu,
    useDeferredValue: function(n) {
      var r = er();
      return Od(r, fr.memoizedState, n);
    },
    useTransition: function() {
      var n = Yl(dl)[0], r = er().memoizedState;
      return [n, r];
    },
    useMutableSource: Fc,
    useSyncExternalStore: Pc,
    useId: Ld,
    unstable_isNewReconciler: !1
  }, Zc = { readContext: ai, useCallback: qc, useContext: ai, useEffect: Eu, useImperativeHandle: Kc, useInsertionEffect: Gc, useLayoutEffect: bu, useMemo: Xc, useReducer: No, useRef: Wc, useState: function() {
    return No(dl);
  }, useDebugValue: Cu, useDeferredValue: function(n) {
    var r = er();
    return fr === null ? r.memoizedState = n : Od(r, fr.memoizedState, n);
  }, useTransition: function() {
    var n = No(dl)[0], r = er().memoizedState;
    return [n, r];
  }, useMutableSource: Fc, useSyncExternalStore: Pc, useId: Ld, unstable_isNewReconciler: !1 };
  function Ei(n, r) {
    if (n && n.defaultProps) {
      r = Re({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Ad(n, r, l, s) {
    r = n.memoizedState, l = l(s, r), l = l == null ? r : Re({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var ef = { isMounted: function(n) {
    return (n = n._reactInternals) ? pt(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var s = hr(), f = Yi(n), p = fl(s, f);
    p.payload = r, l != null && (p.callback = l), r = Il(n, p, f), r !== null && (Zr(r, n, f, s), Ac(r, n, f));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var s = hr(), f = Yi(n), p = fl(s, f);
    p.tag = 1, p.payload = r, l != null && (p.callback = l), r = Il(n, p, f), r !== null && (Zr(r, n, f, s), Ac(r, n, f));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = hr(), s = Yi(n), f = fl(l, s);
    f.tag = 2, r != null && (f.callback = r), r = Il(n, f, s), r !== null && (Zr(r, n, s, l), Ac(r, n, s));
  } };
  function Wm(n, r, l, s, f, p, g) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(s, p, g) : r.prototype && r.prototype.isPureReactComponent ? !iu(l, s) || !iu(f, p) : !0;
  }
  function tf(n, r, l) {
    var s = !1, f = $r, p = r.contextType;
    return typeof p == "object" && p !== null ? p = ai(p) : (f = ur(r) ? pa : Kn.current, s = r.contextTypes, p = (s = s != null) ? ma(n, f) : $r), r = new r(l, p), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = ef, n.stateNode = r, r._reactInternals = n, s && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = f, n.__reactInternalMemoizedMaskedChildContext = p), r;
  }
  function Qm(n, r, l, s) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, s), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, s), r.state !== n && ef.enqueueReplaceState(r, r.state, null);
  }
  function Ru(n, r, l, s) {
    var f = n.stateNode;
    f.props = l, f.state = n.memoizedState, f.refs = {}, kd(n);
    var p = r.contextType;
    typeof p == "object" && p !== null ? f.context = ai(p) : (p = ur(r) ? pa : Kn.current, f.context = ma(n, p)), f.state = n.memoizedState, p = r.getDerivedStateFromProps, typeof p == "function" && (Ad(n, r, p, l), f.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof f.getSnapshotBeforeUpdate == "function" || typeof f.UNSAFE_componentWillMount != "function" && typeof f.componentWillMount != "function" || (r = f.state, typeof f.componentWillMount == "function" && f.componentWillMount(), typeof f.UNSAFE_componentWillMount == "function" && f.UNSAFE_componentWillMount(), r !== f.state && ef.enqueueReplaceState(f, f.state, null), hu(n, l, f, s), f.state = n.memoizedState), typeof f.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function Mo(n, r) {
    try {
      var l = "", s = r;
      do
        l += bt(s), s = s.return;
      while (s);
      var f = l;
    } catch (p) {
      f = `
Error generating stack: ` + p.message + `
` + p.stack;
    }
    return { value: n, source: r, stack: f, digest: null };
  }
  function Md(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Ud(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var nf = typeof WeakMap == "function" ? WeakMap : Map;
  function Gm(n, r, l) {
    l = fl(-1, l), l.tag = 3, l.payload = { element: null };
    var s = r.value;
    return l.callback = function() {
      ks || (ks = !0, Fo = s), Ud(n, r);
    }, l;
  }
  function zd(n, r, l) {
    l = fl(-1, l), l.tag = 3;
    var s = n.type.getDerivedStateFromError;
    if (typeof s == "function") {
      var f = r.value;
      l.payload = function() {
        return s(f);
      }, l.callback = function() {
        Ud(n, r);
      };
    }
    var p = n.stateNode;
    return p !== null && typeof p.componentDidCatch == "function" && (l.callback = function() {
      Ud(n, r), typeof s != "function" && (Gl === null ? Gl = /* @__PURE__ */ new Set([this]) : Gl.add(this));
      var g = r.stack;
      this.componentDidCatch(r.value, { componentStack: g !== null ? g : "" });
    }), l;
  }
  function Fd(n, r, l) {
    var s = n.pingCache;
    if (s === null) {
      s = n.pingCache = new nf();
      var f = /* @__PURE__ */ new Set();
      s.set(r, f);
    } else f = s.get(r), f === void 0 && (f = /* @__PURE__ */ new Set(), s.set(r, f));
    f.has(l) || (f.add(l), n = wy.bind(null, n, r, l), r.then(n, n));
  }
  function Km(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Wl(n, r, l, s, f) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = f, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = fl(-1, 1), r.tag = 2, Il(l, r, 1))), l.lanes |= 1), n);
  }
  var ju = Ee.ReactCurrentOwner, dr = !1;
  function Or(n, r, l, s) {
    r.child = n === null ? Pe(r, null, l, s) : Zn(r, n.child, l, s);
  }
  function Sa(n, r, l, s, f) {
    l = l.render;
    var p = r.ref;
    return $n(r, f), s = $l(n, r, l, s, p, f), l = xi(), n !== null && !dr ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~f, li(n, r, f)) : (Pn && l && Nc(r), r.flags |= 1, Or(n, r, s, f), r.child);
  }
  function Uo(n, r, l, s, f) {
    if (n === null) {
      var p = l.type;
      return typeof p == "function" && !Jd(p) && p.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = p, At(n, r, p, s, f)) : (n = $u(l.type, null, s, r, r.mode, f), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (p = n.child, !(n.lanes & f)) {
      var g = p.memoizedProps;
      if (l = l.compare, l = l !== null ? l : iu, l(g, s) && n.ref === r.ref) return li(n, r, f);
    }
    return r.flags |= 1, n = ql(p, s), n.ref = r.ref, n.return = r, r.child = n;
  }
  function At(n, r, l, s, f) {
    if (n !== null) {
      var p = n.memoizedProps;
      if (iu(p, s) && n.ref === r.ref) if (dr = !1, r.pendingProps = s = p, (n.lanes & f) !== 0) n.flags & 131072 && (dr = !0);
      else return r.lanes = n.lanes, li(n, r, f);
    }
    return qm(n, r, l, s, f);
  }
  function ku(n, r, l) {
    var s = r.pendingProps, f = s.children, p = n !== null ? n.memoizedState : null;
    if (s.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, rt(Ts, Ha), Ha |= l;
    else {
      if (!(l & 1073741824)) return n = p !== null ? p.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, rt(Ts, Ha), Ha |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, s = p !== null ? p.baseLanes : l, rt(Ts, Ha), Ha |= s;
    }
    else p !== null ? (s = p.baseLanes | l, r.memoizedState = null) : s = l, rt(Ts, Ha), Ha |= s;
    return Or(n, r, f, l), r.child;
  }
  function Pd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function qm(n, r, l, s, f) {
    var p = ur(l) ? pa : Kn.current;
    return p = ma(r, p), $n(r, f), l = $l(n, r, l, s, p, f), s = xi(), n !== null && !dr ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~f, li(n, r, f)) : (Pn && s && Nc(r), r.flags |= 1, Or(n, r, l, f), r.child);
  }
  function Xm(n, r, l, s, f) {
    if (ur(l)) {
      var p = !0;
      Cr(r);
    } else p = !1;
    if ($n(r, f), r.stateNode === null) ii(n, r), tf(r, l, s), Ru(r, l, s, f), s = !0;
    else if (n === null) {
      var g = r.stateNode, _ = r.memoizedProps;
      g.props = _;
      var D = g.context, q = l.contextType;
      typeof q == "object" && q !== null ? q = ai(q) : (q = ur(l) ? pa : Kn.current, q = ma(r, q));
      var be = l.getDerivedStateFromProps, we = typeof be == "function" || typeof g.getSnapshotBeforeUpdate == "function";
      we || typeof g.UNSAFE_componentWillReceiveProps != "function" && typeof g.componentWillReceiveProps != "function" || (_ !== s || D !== q) && Qm(r, g, s, q), Pa = !1;
      var xe = r.memoizedState;
      g.state = xe, hu(r, s, g, f), D = r.memoizedState, _ !== s || xe !== D || Sr.current || Pa ? (typeof be == "function" && (Ad(r, l, be, s), D = r.memoizedState), (_ = Pa || Wm(r, l, _, s, xe, D, q)) ? (we || typeof g.UNSAFE_componentWillMount != "function" && typeof g.componentWillMount != "function" || (typeof g.componentWillMount == "function" && g.componentWillMount(), typeof g.UNSAFE_componentWillMount == "function" && g.UNSAFE_componentWillMount()), typeof g.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof g.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = s, r.memoizedState = D), g.props = s, g.state = D, g.context = q, s = _) : (typeof g.componentDidMount == "function" && (r.flags |= 4194308), s = !1);
    } else {
      g = r.stateNode, Vm(n, r), _ = r.memoizedProps, q = r.type === r.elementType ? _ : Ei(r.type, _), g.props = q, we = r.pendingProps, xe = g.context, D = l.contextType, typeof D == "object" && D !== null ? D = ai(D) : (D = ur(l) ? pa : Kn.current, D = ma(r, D));
      var Ye = l.getDerivedStateFromProps;
      (be = typeof Ye == "function" || typeof g.getSnapshotBeforeUpdate == "function") || typeof g.UNSAFE_componentWillReceiveProps != "function" && typeof g.componentWillReceiveProps != "function" || (_ !== we || xe !== D) && Qm(r, g, s, D), Pa = !1, xe = r.memoizedState, g.state = xe, hu(r, s, g, f);
      var qe = r.memoizedState;
      _ !== we || xe !== qe || Sr.current || Pa ? (typeof Ye == "function" && (Ad(r, l, Ye, s), qe = r.memoizedState), (q = Pa || Wm(r, l, q, s, xe, qe, D) || !1) ? (be || typeof g.UNSAFE_componentWillUpdate != "function" && typeof g.componentWillUpdate != "function" || (typeof g.componentWillUpdate == "function" && g.componentWillUpdate(s, qe, D), typeof g.UNSAFE_componentWillUpdate == "function" && g.UNSAFE_componentWillUpdate(s, qe, D)), typeof g.componentDidUpdate == "function" && (r.flags |= 4), typeof g.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof g.componentDidUpdate != "function" || _ === n.memoizedProps && xe === n.memoizedState || (r.flags |= 4), typeof g.getSnapshotBeforeUpdate != "function" || _ === n.memoizedProps && xe === n.memoizedState || (r.flags |= 1024), r.memoizedProps = s, r.memoizedState = qe), g.props = s, g.state = qe, g.context = D, s = q) : (typeof g.componentDidUpdate != "function" || _ === n.memoizedProps && xe === n.memoizedState || (r.flags |= 4), typeof g.getSnapshotBeforeUpdate != "function" || _ === n.memoizedProps && xe === n.memoizedState || (r.flags |= 1024), s = !1);
    }
    return Nu(n, r, l, s, p, f);
  }
  function Nu(n, r, l, s, f, p) {
    Pd(n, r);
    var g = (r.flags & 128) !== 0;
    if (!s && !g) return f && jc(r, l, !1), li(n, r, p);
    s = r.stateNode, ju.current = r;
    var _ = g && typeof l.getDerivedStateFromError != "function" ? null : s.render();
    return r.flags |= 1, n !== null && g ? (r.child = Zn(r, n.child, null, p), r.child = Zn(r, null, _, p)) : Or(n, r, _, p), r.memoizedState = s.state, f && jc(r, l, !0), r.child;
  }
  function _s(n) {
    var r = n.stateNode;
    r.pendingContext ? Fm(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Fm(n, r.context, !1), Dd(n, r.containerInfo);
  }
  function Jm(n, r, l, s, f) {
    return Vl(), cl(f), r.flags |= 256, Or(n, r, l, s), r.child;
  }
  var rf = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Hd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function af(n, r, l) {
    var s = r.pendingProps, f = Yn.current, p = !1, g = (r.flags & 128) !== 0, _;
    if ((_ = g) || (_ = n !== null && n.memoizedState === null ? !1 : (f & 2) !== 0), _ ? (p = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (f |= 1), rt(Yn, f & 1), n === null)
      return bd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (g = s.children, n = s.fallback, p ? (s = r.mode, p = r.child, g = { mode: "hidden", children: g }, !(s & 1) && p !== null ? (p.childLanes = 0, p.pendingProps = g) : p = Xl(g, s, 0, null), n = vl(n, s, l, null), p.return = r, n.return = r, p.sibling = n, r.child = p, r.child.memoizedState = Hd(l), r.memoizedState = rf, n) : Bd(r, g));
    if (f = n.memoizedState, f !== null && (_ = f.dehydrated, _ !== null)) return Zm(n, r, g, s, _, f, l);
    if (p) {
      p = s.fallback, g = r.mode, f = n.child, _ = f.sibling;
      var D = { mode: "hidden", children: s.children };
      return !(g & 1) && r.child !== f ? (s = r.child, s.childLanes = 0, s.pendingProps = D, r.deletions = null) : (s = ql(f, D), s.subtreeFlags = f.subtreeFlags & 14680064), _ !== null ? p = ql(_, p) : (p = vl(p, g, l, null), p.flags |= 2), p.return = r, s.return = r, s.sibling = p, r.child = s, s = p, p = r.child, g = n.child.memoizedState, g = g === null ? Hd(l) : { baseLanes: g.baseLanes | l, cachePool: null, transitions: g.transitions }, p.memoizedState = g, p.childLanes = n.childLanes & ~l, r.memoizedState = rf, s;
    }
    return p = n.child, n = p.sibling, s = ql(p, { mode: "visible", children: s.children }), !(r.mode & 1) && (s.lanes = l), s.return = r, s.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = s, r.memoizedState = null, s;
  }
  function Bd(n, r) {
    return r = Xl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function Du(n, r, l, s) {
    return s !== null && cl(s), Zn(r, n.child, null, l), n = Bd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Zm(n, r, l, s, f, p, g) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, s = Md(Error(b(422))), Du(n, r, g, s)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (p = s.fallback, f = r.mode, s = Xl({ mode: "visible", children: s.children }, f, 0, null), p = vl(p, f, g, null), p.flags |= 2, s.return = r, p.return = r, s.sibling = p, r.child = s, r.mode & 1 && Zn(r, n.child, null, g), r.child.memoizedState = Hd(g), r.memoizedState = rf, p);
    if (!(r.mode & 1)) return Du(n, r, g, null);
    if (f.data === "$!") {
      if (s = f.nextSibling && f.nextSibling.dataset, s) var _ = s.dgst;
      return s = _, p = Error(b(419)), s = Md(p, s, void 0), Du(n, r, g, s);
    }
    if (_ = (g & n.childLanes) !== 0, dr || _) {
      if (s = Er, s !== null) {
        switch (g & -g) {
          case 4:
            f = 2;
            break;
          case 16:
            f = 8;
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
            f = 32;
            break;
          case 536870912:
            f = 268435456;
            break;
          default:
            f = 0;
        }
        f = f & (s.suspendedLanes | g) ? 0 : f, f !== 0 && f !== p.retryLane && (p.retryLane = f, Fa(n, f), Zr(s, n, f, -1));
      }
      return Xd(), s = Md(Error(b(421))), Du(n, r, g, s);
    }
    return f.data === "$?" ? (r.flags |= 128, r.child = n.child, r = Ty.bind(null, n), f._reactRetry = r, null) : (n = p.treeContext, va = Ai(f.nextSibling), ha = r, Pn = !0, ri = null, n !== null && (cr[ni++] = Fi, cr[ni++] = Pi, cr[ni++] = Ua, Fi = n.id, Pi = n.overflow, Ua = r), r = Bd(r, s.children), r.flags |= 4096, r);
  }
  function Vd(n, r, l) {
    n.lanes |= r;
    var s = n.alternate;
    s !== null && (s.lanes |= r), Td(n.return, r, l);
  }
  function qr(n, r, l, s, f) {
    var p = n.memoizedState;
    p === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: s, tail: l, tailMode: f } : (p.isBackwards = r, p.rendering = null, p.renderingStartTime = 0, p.last = s, p.tail = l, p.tailMode = f);
  }
  function Bi(n, r, l) {
    var s = r.pendingProps, f = s.revealOrder, p = s.tail;
    if (Or(n, r, s.children, l), s = Yn.current, s & 2) s = s & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Vd(n, l, r);
        else if (n.tag === 19) Vd(n, l, r);
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
      s &= 1;
    }
    if (rt(Yn, s), !(r.mode & 1)) r.memoizedState = null;
    else switch (f) {
      case "forwards":
        for (l = r.child, f = null; l !== null; ) n = l.alternate, n !== null && Uc(n) === null && (f = l), l = l.sibling;
        l = f, l === null ? (f = r.child, r.child = null) : (f = l.sibling, l.sibling = null), qr(r, !1, f, l, p);
        break;
      case "backwards":
        for (l = null, f = r.child, r.child = null; f !== null; ) {
          if (n = f.alternate, n !== null && Uc(n) === null) {
            r.child = f;
            break;
          }
          n = f.sibling, f.sibling = l, l = f, f = n;
        }
        qr(r, !0, l, null, p);
        break;
      case "together":
        qr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function ii(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function li(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), $i |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(b(153));
    if (r.child !== null) {
      for (n = r.child, l = ql(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = ql(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function Ou(n, r, l) {
    switch (r.tag) {
      case 3:
        _s(r), Vl();
        break;
      case 5:
        $m(r);
        break;
      case 1:
        ur(r.type) && Cr(r);
        break;
      case 4:
        Dd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var s = r.type._context, f = r.memoizedProps.value;
        rt(za, s._currentValue), s._currentValue = f;
        break;
      case 13:
        if (s = r.memoizedState, s !== null)
          return s.dehydrated !== null ? (rt(Yn, Yn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? af(n, r, l) : (rt(Yn, Yn.current & 1), n = li(n, r, l), n !== null ? n.sibling : null);
        rt(Yn, Yn.current & 1);
        break;
      case 19:
        if (s = (l & r.childLanes) !== 0, n.flags & 128) {
          if (s) return Bi(n, r, l);
          r.flags |= 128;
        }
        if (f = r.memoizedState, f !== null && (f.rendering = null, f.tail = null, f.lastEffect = null), rt(Yn, Yn.current), s) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, ku(n, r, l);
    }
    return li(n, r, l);
  }
  var oi, pr, eh, th;
  oi = function(n, r) {
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
  }, pr = function() {
  }, eh = function(n, r, l, s) {
    var f = n.memoizedProps;
    if (f !== s) {
      n = r.stateNode, Ro(Hi.current);
      var p = null;
      switch (l) {
        case "input":
          f = En(n, f), s = En(n, s), p = [];
          break;
        case "select":
          f = Re({}, f, { value: void 0 }), s = Re({}, s, { value: void 0 }), p = [];
          break;
        case "textarea":
          f = Rn(n, f), s = Rn(n, s), p = [];
          break;
        default:
          typeof f.onClick != "function" && typeof s.onClick == "function" && (n.onclick = Ul);
      }
      Ut(l, s);
      var g;
      l = null;
      for (q in f) if (!s.hasOwnProperty(q) && f.hasOwnProperty(q) && f[q] != null) if (q === "style") {
        var _ = f[q];
        for (g in _) _.hasOwnProperty(g) && (l || (l = {}), l[g] = "");
      } else q !== "dangerouslySetInnerHTML" && q !== "children" && q !== "suppressContentEditableWarning" && q !== "suppressHydrationWarning" && q !== "autoFocus" && (Z.hasOwnProperty(q) ? p || (p = []) : (p = p || []).push(q, null));
      for (q in s) {
        var D = s[q];
        if (_ = f != null ? f[q] : void 0, s.hasOwnProperty(q) && D !== _ && (D != null || _ != null)) if (q === "style") if (_) {
          for (g in _) !_.hasOwnProperty(g) || D && D.hasOwnProperty(g) || (l || (l = {}), l[g] = "");
          for (g in D) D.hasOwnProperty(g) && _[g] !== D[g] && (l || (l = {}), l[g] = D[g]);
        } else l || (p || (p = []), p.push(
          q,
          l
        )), l = D;
        else q === "dangerouslySetInnerHTML" ? (D = D ? D.__html : void 0, _ = _ ? _.__html : void 0, D != null && _ !== D && (p = p || []).push(q, D)) : q === "children" ? typeof D != "string" && typeof D != "number" || (p = p || []).push(q, "" + D) : q !== "suppressContentEditableWarning" && q !== "suppressHydrationWarning" && (Z.hasOwnProperty(q) ? (D != null && q === "onScroll" && un("scroll", n), p || _ === D || (p = [])) : (p = p || []).push(q, D));
      }
      l && (p = p || []).push("style", l);
      var q = p;
      (r.updateQueue = q) && (r.flags |= 4);
    }
  }, th = function(n, r, l, s) {
    l !== s && (r.flags |= 4);
  };
  function Lu(n, r) {
    if (!Pn) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var l = null; r !== null; ) r.alternate !== null && (l = r), r = r.sibling;
        l === null ? n.tail = null : l.sibling = null;
        break;
      case "collapsed":
        l = n.tail;
        for (var s = null; l !== null; ) l.alternate !== null && (s = l), l = l.sibling;
        s === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : s.sibling = null;
    }
  }
  function wr(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, s = 0;
    if (r) for (var f = n.child; f !== null; ) l |= f.lanes | f.childLanes, s |= f.subtreeFlags & 14680064, s |= f.flags & 14680064, f.return = n, f = f.sibling;
    else for (f = n.child; f !== null; ) l |= f.lanes | f.childLanes, s |= f.subtreeFlags, s |= f.flags, f.return = n, f = f.sibling;
    return n.subtreeFlags |= s, n.childLanes = l, r;
  }
  function nh(n, r, l) {
    var s = r.pendingProps;
    switch (Dc(r), r.tag) {
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
        return wr(r), null;
      case 1:
        return ur(r.type) && Ss(), wr(r), null;
      case 3:
        return s = r.stateNode, jo(), Nn(Sr), Nn(Kn), it(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), (n === null || n.child === null) && (Oc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, ri !== null && (Po(ri), ri = null))), pr(n, r), wr(r), null;
      case 5:
        Mc(r);
        var f = Ro(gu.current);
        if (l = r.type, n !== null && r.stateNode != null) eh(n, r, l, s, f), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!s) {
            if (r.stateNode === null) throw Error(b(166));
            return wr(r), null;
          }
          if (n = Ro(Hi.current), Oc(r)) {
            s = r.stateNode, l = r.type;
            var p = r.memoizedProps;
            switch (s[Mi] = r, s[fu] = p, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                un("cancel", s), un("close", s);
                break;
              case "iframe":
              case "object":
              case "embed":
                un("load", s);
                break;
              case "video":
              case "audio":
                for (f = 0; f < su.length; f++) un(su[f], s);
                break;
              case "source":
                un("error", s);
                break;
              case "img":
              case "image":
              case "link":
                un(
                  "error",
                  s
                ), un("load", s);
                break;
              case "details":
                un("toggle", s);
                break;
              case "input":
                On(s, p), un("invalid", s);
                break;
              case "select":
                s._wrapperState = { wasMultiple: !!p.multiple }, un("invalid", s);
                break;
              case "textarea":
                V(s, p), un("invalid", s);
            }
            Ut(l, p), f = null;
            for (var g in p) if (p.hasOwnProperty(g)) {
              var _ = p[g];
              g === "children" ? typeof _ == "string" ? s.textContent !== _ && (p.suppressHydrationWarning !== !0 && _c(s.textContent, _, n), f = ["children", _]) : typeof _ == "number" && s.textContent !== "" + _ && (p.suppressHydrationWarning !== !0 && _c(
                s.textContent,
                _,
                n
              ), f = ["children", "" + _]) : Z.hasOwnProperty(g) && _ != null && g === "onScroll" && un("scroll", s);
            }
            switch (l) {
              case "input":
                Dn(s), Ln(s, p, !0);
                break;
              case "textarea":
                Dn(s), St(s);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof p.onClick == "function" && (s.onclick = Ul);
            }
            s = f, r.updateQueue = s, s !== null && (r.flags |= 4);
          } else {
            g = f.nodeType === 9 ? f : f.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = ht(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = g.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof s.is == "string" ? n = g.createElement(l, { is: s.is }) : (n = g.createElement(l), l === "select" && (g = n, s.multiple ? g.multiple = !0 : s.size && (g.size = s.size))) : n = g.createElementNS(n, l), n[Mi] = r, n[fu] = s, oi(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (g = Xn(l, s), l) {
                case "dialog":
                  un("cancel", n), un("close", n), f = s;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  un("load", n), f = s;
                  break;
                case "video":
                case "audio":
                  for (f = 0; f < su.length; f++) un(su[f], n);
                  f = s;
                  break;
                case "source":
                  un("error", n), f = s;
                  break;
                case "img":
                case "image":
                case "link":
                  un(
                    "error",
                    n
                  ), un("load", n), f = s;
                  break;
                case "details":
                  un("toggle", n), f = s;
                  break;
                case "input":
                  On(n, s), f = En(n, s), un("invalid", n);
                  break;
                case "option":
                  f = s;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!s.multiple }, f = Re({}, s, { value: void 0 }), un("invalid", n);
                  break;
                case "textarea":
                  V(n, s), f = Rn(n, s), un("invalid", n);
                  break;
                default:
                  f = s;
              }
              Ut(l, f), _ = f;
              for (p in _) if (_.hasOwnProperty(p)) {
                var D = _[p];
                p === "style" ? pn(n, D) : p === "dangerouslySetInnerHTML" ? (D = D ? D.__html : void 0, D != null && ja(n, D)) : p === "children" ? typeof D == "string" ? (l !== "textarea" || D !== "") && Le(n, D) : typeof D == "number" && Le(n, "" + D) : p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && p !== "autoFocus" && (Z.hasOwnProperty(p) ? D != null && p === "onScroll" && un("scroll", n) : D != null && ke(n, p, D, g));
              }
              switch (l) {
                case "input":
                  Dn(n), Ln(n, s, !1);
                  break;
                case "textarea":
                  Dn(n), St(n);
                  break;
                case "option":
                  s.value != null && n.setAttribute("value", "" + mt(s.value));
                  break;
                case "select":
                  n.multiple = !!s.multiple, p = s.value, p != null ? bn(n, !!s.multiple, p, !1) : s.defaultValue != null && bn(
                    n,
                    !!s.multiple,
                    s.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof f.onClick == "function" && (n.onclick = Ul);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  s = !!s.autoFocus;
                  break e;
                case "img":
                  s = !0;
                  break e;
                default:
                  s = !1;
              }
            }
            s && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return wr(r), null;
      case 6:
        if (n && r.stateNode != null) th(n, r, n.memoizedProps, s);
        else {
          if (typeof s != "string" && r.stateNode === null) throw Error(b(166));
          if (l = Ro(gu.current), Ro(Hi.current), Oc(r)) {
            if (s = r.stateNode, l = r.memoizedProps, s[Mi] = r, (p = s.nodeValue !== l) && (n = ha, n !== null)) switch (n.tag) {
              case 3:
                _c(s.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && _c(s.nodeValue, l, (n.mode & 1) !== 0);
            }
            p && (r.flags |= 4);
          } else s = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(s), s[Mi] = r, r.stateNode = s;
        }
        return wr(r), null;
      case 13:
        if (Nn(Yn), s = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (Pn && va !== null && r.mode & 1 && !(r.flags & 128)) mu(), Vl(), r.flags |= 98560, p = !1;
          else if (p = Oc(r), s !== null && s.dehydrated !== null) {
            if (n === null) {
              if (!p) throw Error(b(318));
              if (p = r.memoizedState, p = p !== null ? p.dehydrated : null, !p) throw Error(b(317));
              p[Mi] = r;
            } else Vl(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            wr(r), p = !1;
          } else ri !== null && (Po(ri), ri = null), p = !0;
          if (!p) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (s = s !== null, s !== (n !== null && n.memoizedState !== null) && s && (r.child.flags |= 8192, r.mode & 1 && (n === null || Yn.current & 1 ? nr === 0 && (nr = 3) : Xd())), r.updateQueue !== null && (r.flags |= 4), wr(r), null);
      case 4:
        return jo(), pr(n, r), n === null && ms(r.stateNode.containerInfo), wr(r), null;
      case 10:
        return wd(r.type._context), wr(r), null;
      case 17:
        return ur(r.type) && Ss(), wr(r), null;
      case 19:
        if (Nn(Yn), p = r.memoizedState, p === null) return wr(r), null;
        if (s = (r.flags & 128) !== 0, g = p.rendering, g === null) if (s) Lu(p, !1);
        else {
          if (nr !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (g = Uc(n), g !== null) {
              for (r.flags |= 128, Lu(p, !1), s = g.updateQueue, s !== null && (r.updateQueue = s, r.flags |= 4), r.subtreeFlags = 0, s = l, l = r.child; l !== null; ) p = l, n = s, p.flags &= 14680066, g = p.alternate, g === null ? (p.childLanes = 0, p.lanes = n, p.child = null, p.subtreeFlags = 0, p.memoizedProps = null, p.memoizedState = null, p.updateQueue = null, p.dependencies = null, p.stateNode = null) : (p.childLanes = g.childLanes, p.lanes = g.lanes, p.child = g.child, p.subtreeFlags = 0, p.deletions = null, p.memoizedProps = g.memoizedProps, p.memoizedState = g.memoizedState, p.updateQueue = g.updateQueue, p.type = g.type, n = g.dependencies, p.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return rt(Yn, Yn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          p.tail !== null && xt() > js && (r.flags |= 128, s = !0, Lu(p, !1), r.lanes = 4194304);
        }
        else {
          if (!s) if (n = Uc(g), n !== null) {
            if (r.flags |= 128, s = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Lu(p, !0), p.tail === null && p.tailMode === "hidden" && !g.alternate && !Pn) return wr(r), null;
          } else 2 * xt() - p.renderingStartTime > js && l !== 1073741824 && (r.flags |= 128, s = !0, Lu(p, !1), r.lanes = 4194304);
          p.isBackwards ? (g.sibling = r.child, r.child = g) : (l = p.last, l !== null ? l.sibling = g : r.child = g, p.last = g);
        }
        return p.tail !== null ? (r = p.tail, p.rendering = r, p.tail = r.sibling, p.renderingStartTime = xt(), r.sibling = null, l = Yn.current, rt(Yn, s ? l & 1 | 2 : l & 1), r) : (wr(r), null);
      case 22:
      case 23:
        return qd(), s = r.memoizedState !== null, n !== null && n.memoizedState !== null !== s && (r.flags |= 8192), s && r.mode & 1 ? Ha & 1073741824 && (wr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : wr(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(b(156, r.tag));
  }
  function lf(n, r) {
    switch (Dc(r), r.tag) {
      case 1:
        return ur(r.type) && Ss(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return jo(), Nn(Sr), Nn(Kn), it(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Mc(r), null;
      case 13:
        if (Nn(Yn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(b(340));
          Vl();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return Nn(Yn), null;
      case 4:
        return jo(), null;
      case 10:
        return wd(r.type._context), null;
      case 22:
      case 23:
        return qd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Au = !1, Wr = !1, Sy = typeof WeakSet == "function" ? WeakSet : Set, Ke = null;
  function ws(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (s) {
      Hn(n, r, s);
    }
    else l.current = null;
  }
  function of(n, r, l) {
    try {
      l();
    } catch (s) {
      Hn(n, r, s);
    }
  }
  var rh = !1;
  function ah(n, r) {
    if (cu = Ja, n = lu(), vc(n)) {
      if ("selectionStart" in n) var l = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        l = (l = n.ownerDocument) && l.defaultView || window;
        var s = l.getSelection && l.getSelection();
        if (s && s.rangeCount !== 0) {
          l = s.anchorNode;
          var f = s.anchorOffset, p = s.focusNode;
          s = s.focusOffset;
          try {
            l.nodeType, p.nodeType;
          } catch {
            l = null;
            break e;
          }
          var g = 0, _ = -1, D = -1, q = 0, be = 0, we = n, xe = null;
          t: for (; ; ) {
            for (var Ye; we !== l || f !== 0 && we.nodeType !== 3 || (_ = g + f), we !== p || s !== 0 && we.nodeType !== 3 || (D = g + s), we.nodeType === 3 && (g += we.nodeValue.length), (Ye = we.firstChild) !== null; )
              xe = we, we = Ye;
            for (; ; ) {
              if (we === n) break t;
              if (xe === l && ++q === f && (_ = g), xe === p && ++be === s && (D = g), (Ye = we.nextSibling) !== null) break;
              we = xe, xe = we.parentNode;
            }
            we = Ye;
          }
          l = _ === -1 || D === -1 ? null : { start: _, end: D };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Eo = { focusedElem: n, selectionRange: l }, Ja = !1, Ke = r; Ke !== null; ) if (r = Ke, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Ke = n;
    else for (; Ke !== null; ) {
      r = Ke;
      try {
        var qe = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (qe !== null) {
              var tt = qe.memoizedProps, rr = qe.memoizedState, F = r.stateNode, A = F.getSnapshotBeforeUpdate(r.elementType === r.type ? tt : Ei(r.type, tt), rr);
              F.__reactInternalSnapshotBeforeUpdate = A;
            }
            break;
          case 3:
            var $ = r.stateNode.containerInfo;
            $.nodeType === 1 ? $.textContent = "" : $.nodeType === 9 && $.documentElement && $.removeChild($.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(b(163));
        }
      } catch (Ce) {
        Hn(r, r.return, Ce);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Ke = n;
        break;
      }
      Ke = r.return;
    }
    return qe = rh, rh = !1, qe;
  }
  function Mu(n, r, l) {
    var s = r.updateQueue;
    if (s = s !== null ? s.lastEffect : null, s !== null) {
      var f = s = s.next;
      do {
        if ((f.tag & n) === n) {
          var p = f.destroy;
          f.destroy = void 0, p !== void 0 && of(r, l, p);
        }
        f = f.next;
      } while (f !== s);
    }
  }
  function Uu(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var s = l.create;
          l.destroy = s();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Id(n) {
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
  function sf(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, sf(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Mi], delete r[fu], delete r[du], delete r[gs], delete r[yy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function zu(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function pl(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || zu(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function Vi(n, r, l) {
    var s = n.tag;
    if (s === 5 || s === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = Ul));
    else if (s !== 4 && (n = n.child, n !== null)) for (Vi(n, r, l), n = n.sibling; n !== null; ) Vi(n, r, l), n = n.sibling;
  }
  function Ii(n, r, l) {
    var s = n.tag;
    if (s === 5 || s === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (s !== 4 && (n = n.child, n !== null)) for (Ii(n, r, l), n = n.sibling; n !== null; ) Ii(n, r, l), n = n.sibling;
  }
  var tr = null, Xr = !1;
  function Jr(n, r, l) {
    for (l = l.child; l !== null; ) ih(n, r, l), l = l.sibling;
  }
  function ih(n, r, l) {
    if (ct && typeof ct.onCommitFiberUnmount == "function") try {
      ct.onCommitFiberUnmount(ve, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Wr || ws(l, r);
      case 6:
        var s = tr, f = Xr;
        tr = null, Jr(n, r, l), tr = s, Xr = f, tr !== null && (Xr ? (n = tr, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : tr.removeChild(l.stateNode));
        break;
      case 18:
        tr !== null && (Xr ? (n = tr, l = l.stateNode, n.nodeType === 8 ? ys(n.parentNode, l) : n.nodeType === 1 && ys(n, l), vi(n)) : ys(tr, l.stateNode));
        break;
      case 4:
        s = tr, f = Xr, tr = l.stateNode.containerInfo, Xr = !0, Jr(n, r, l), tr = s, Xr = f;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Wr && (s = l.updateQueue, s !== null && (s = s.lastEffect, s !== null))) {
          f = s = s.next;
          do {
            var p = f, g = p.destroy;
            p = p.tag, g !== void 0 && (p & 2 || p & 4) && of(l, r, g), f = f.next;
          } while (f !== s);
        }
        Jr(n, r, l);
        break;
      case 1:
        if (!Wr && (ws(l, r), s = l.stateNode, typeof s.componentWillUnmount == "function")) try {
          s.props = l.memoizedProps, s.state = l.memoizedState, s.componentWillUnmount();
        } catch (_) {
          Hn(l, r, _);
        }
        Jr(n, r, l);
        break;
      case 21:
        Jr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Wr = (s = Wr) || l.memoizedState !== null, Jr(n, r, l), Wr = s) : Jr(n, r, l);
        break;
      default:
        Jr(n, r, l);
    }
  }
  function lh(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new Sy()), r.forEach(function(s) {
        var f = hh.bind(null, n, s);
        l.has(s) || (l.add(s), s.then(f, f));
      });
    }
  }
  function bi(n, r) {
    var l = r.deletions;
    if (l !== null) for (var s = 0; s < l.length; s++) {
      var f = l[s];
      try {
        var p = n, g = r, _ = g;
        e: for (; _ !== null; ) {
          switch (_.tag) {
            case 5:
              tr = _.stateNode, Xr = !1;
              break e;
            case 3:
              tr = _.stateNode.containerInfo, Xr = !0;
              break e;
            case 4:
              tr = _.stateNode.containerInfo, Xr = !0;
              break e;
          }
          _ = _.return;
        }
        if (tr === null) throw Error(b(160));
        ih(p, g, f), tr = null, Xr = !1;
        var D = f.alternate;
        D !== null && (D.return = null), f.return = null;
      } catch (q) {
        Hn(f, r, q);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) $d(r, n), r = r.sibling;
  }
  function $d(n, r) {
    var l = n.alternate, s = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (bi(r, n), xa(n), s & 4) {
          try {
            Mu(3, n, n.return), Uu(3, n);
          } catch (tt) {
            Hn(n, n.return, tt);
          }
          try {
            Mu(5, n, n.return);
          } catch (tt) {
            Hn(n, n.return, tt);
          }
        }
        break;
      case 1:
        bi(r, n), xa(n), s & 512 && l !== null && ws(l, l.return);
        break;
      case 5:
        if (bi(r, n), xa(n), s & 512 && l !== null && ws(l, l.return), n.flags & 32) {
          var f = n.stateNode;
          try {
            Le(f, "");
          } catch (tt) {
            Hn(n, n.return, tt);
          }
        }
        if (s & 4 && (f = n.stateNode, f != null)) {
          var p = n.memoizedProps, g = l !== null ? l.memoizedProps : p, _ = n.type, D = n.updateQueue;
          if (n.updateQueue = null, D !== null) try {
            _ === "input" && p.type === "radio" && p.name != null && Ct(f, p), Xn(_, g);
            var q = Xn(_, p);
            for (g = 0; g < D.length; g += 2) {
              var be = D[g], we = D[g + 1];
              be === "style" ? pn(f, we) : be === "dangerouslySetInnerHTML" ? ja(f, we) : be === "children" ? Le(f, we) : ke(f, be, we, q);
            }
            switch (_) {
              case "input":
                Tn(f, p);
                break;
              case "textarea":
                $e(f, p);
                break;
              case "select":
                var xe = f._wrapperState.wasMultiple;
                f._wrapperState.wasMultiple = !!p.multiple;
                var Ye = p.value;
                Ye != null ? bn(f, !!p.multiple, Ye, !1) : xe !== !!p.multiple && (p.defaultValue != null ? bn(
                  f,
                  !!p.multiple,
                  p.defaultValue,
                  !0
                ) : bn(f, !!p.multiple, p.multiple ? [] : "", !1));
            }
            f[fu] = p;
          } catch (tt) {
            Hn(n, n.return, tt);
          }
        }
        break;
      case 6:
        if (bi(r, n), xa(n), s & 4) {
          if (n.stateNode === null) throw Error(b(162));
          f = n.stateNode, p = n.memoizedProps;
          try {
            f.nodeValue = p;
          } catch (tt) {
            Hn(n, n.return, tt);
          }
        }
        break;
      case 3:
        if (bi(r, n), xa(n), s & 4 && l !== null && l.memoizedState.isDehydrated) try {
          vi(r.containerInfo);
        } catch (tt) {
          Hn(n, n.return, tt);
        }
        break;
      case 4:
        bi(r, n), xa(n);
        break;
      case 13:
        bi(r, n), xa(n), f = n.child, f.flags & 8192 && (p = f.memoizedState !== null, f.stateNode.isHidden = p, !p || f.alternate !== null && f.alternate.memoizedState !== null || (Qd = xt())), s & 4 && lh(n);
        break;
      case 22:
        if (be = l !== null && l.memoizedState !== null, n.mode & 1 ? (Wr = (q = Wr) || be, bi(r, n), Wr = q) : bi(r, n), xa(n), s & 8192) {
          if (q = n.memoizedState !== null, (n.stateNode.isHidden = q) && !be && n.mode & 1) for (Ke = n, be = n.child; be !== null; ) {
            for (we = Ke = be; Ke !== null; ) {
              switch (xe = Ke, Ye = xe.child, xe.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Mu(4, xe, xe.return);
                  break;
                case 1:
                  ws(xe, xe.return);
                  var qe = xe.stateNode;
                  if (typeof qe.componentWillUnmount == "function") {
                    s = xe, l = xe.return;
                    try {
                      r = s, qe.props = r.memoizedProps, qe.state = r.memoizedState, qe.componentWillUnmount();
                    } catch (tt) {
                      Hn(s, l, tt);
                    }
                  }
                  break;
                case 5:
                  ws(xe, xe.return);
                  break;
                case 22:
                  if (xe.memoizedState !== null) {
                    Fu(we);
                    continue;
                  }
              }
              Ye !== null ? (Ye.return = xe, Ke = Ye) : Fu(we);
            }
            be = be.sibling;
          }
          e: for (be = null, we = n; ; ) {
            if (we.tag === 5) {
              if (be === null) {
                be = we;
                try {
                  f = we.stateNode, q ? (p = f.style, typeof p.setProperty == "function" ? p.setProperty("display", "none", "important") : p.display = "none") : (_ = we.stateNode, D = we.memoizedProps.style, g = D != null && D.hasOwnProperty("display") ? D.display : null, _.style.display = Kt("display", g));
                } catch (tt) {
                  Hn(n, n.return, tt);
                }
              }
            } else if (we.tag === 6) {
              if (be === null) try {
                we.stateNode.nodeValue = q ? "" : we.memoizedProps;
              } catch (tt) {
                Hn(n, n.return, tt);
              }
            } else if ((we.tag !== 22 && we.tag !== 23 || we.memoizedState === null || we === n) && we.child !== null) {
              we.child.return = we, we = we.child;
              continue;
            }
            if (we === n) break e;
            for (; we.sibling === null; ) {
              if (we.return === null || we.return === n) break e;
              be === we && (be = null), we = we.return;
            }
            be === we && (be = null), we.sibling.return = we.return, we = we.sibling;
          }
        }
        break;
      case 19:
        bi(r, n), xa(n), s & 4 && lh(n);
        break;
      case 21:
        break;
      default:
        bi(
          r,
          n
        ), xa(n);
    }
  }
  function xa(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (zu(l)) {
              var s = l;
              break e;
            }
            l = l.return;
          }
          throw Error(b(160));
        }
        switch (s.tag) {
          case 5:
            var f = s.stateNode;
            s.flags & 32 && (Le(f, ""), s.flags &= -33);
            var p = pl(n);
            Ii(n, p, f);
            break;
          case 3:
          case 4:
            var g = s.stateNode.containerInfo, _ = pl(n);
            Vi(n, _, g);
            break;
          default:
            throw Error(b(161));
        }
      } catch (D) {
        Hn(n, n.return, D);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function xy(n, r, l) {
    Ke = n, Yd(n);
  }
  function Yd(n, r, l) {
    for (var s = (n.mode & 1) !== 0; Ke !== null; ) {
      var f = Ke, p = f.child;
      if (f.tag === 22 && s) {
        var g = f.memoizedState !== null || Au;
        if (!g) {
          var _ = f.alternate, D = _ !== null && _.memoizedState !== null || Wr;
          _ = Au;
          var q = Wr;
          if (Au = g, (Wr = D) && !q) for (Ke = f; Ke !== null; ) g = Ke, D = g.child, g.tag === 22 && g.memoizedState !== null ? Wd(f) : D !== null ? (D.return = g, Ke = D) : Wd(f);
          for (; p !== null; ) Ke = p, Yd(p), p = p.sibling;
          Ke = f, Au = _, Wr = q;
        }
        oh(n);
      } else f.subtreeFlags & 8772 && p !== null ? (p.return = f, Ke = p) : oh(n);
    }
  }
  function oh(n) {
    for (; Ke !== null; ) {
      var r = Ke;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Wr || Uu(5, r);
              break;
            case 1:
              var s = r.stateNode;
              if (r.flags & 4 && !Wr) if (l === null) s.componentDidMount();
              else {
                var f = r.elementType === r.type ? l.memoizedProps : Ei(r.type, l.memoizedProps);
                s.componentDidUpdate(f, l.memoizedState, s.__reactInternalSnapshotBeforeUpdate);
              }
              var p = r.updateQueue;
              p !== null && Nd(r, p, s);
              break;
            case 3:
              var g = r.updateQueue;
              if (g !== null) {
                if (l = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    l = r.child.stateNode;
                    break;
                  case 1:
                    l = r.child.stateNode;
                }
                Nd(r, g, l);
              }
              break;
            case 5:
              var _ = r.stateNode;
              if (l === null && r.flags & 4) {
                l = _;
                var D = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    D.autoFocus && l.focus();
                    break;
                  case "img":
                    D.src && (l.src = D.src);
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
                var q = r.alternate;
                if (q !== null) {
                  var be = q.memoizedState;
                  if (be !== null) {
                    var we = be.dehydrated;
                    we !== null && vi(we);
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
          Wr || r.flags & 512 && Id(r);
        } catch (xe) {
          Hn(r, r.return, xe);
        }
      }
      if (r === n) {
        Ke = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Ke = l;
        break;
      }
      Ke = r.return;
    }
  }
  function Fu(n) {
    for (; Ke !== null; ) {
      var r = Ke;
      if (r === n) {
        Ke = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Ke = l;
        break;
      }
      Ke = r.return;
    }
  }
  function Wd(n) {
    for (; Ke !== null; ) {
      var r = Ke;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Uu(4, r);
            } catch (D) {
              Hn(r, l, D);
            }
            break;
          case 1:
            var s = r.stateNode;
            if (typeof s.componentDidMount == "function") {
              var f = r.return;
              try {
                s.componentDidMount();
              } catch (D) {
                Hn(r, f, D);
              }
            }
            var p = r.return;
            try {
              Id(r);
            } catch (D) {
              Hn(r, p, D);
            }
            break;
          case 5:
            var g = r.return;
            try {
              Id(r);
            } catch (D) {
              Hn(r, g, D);
            }
        }
      } catch (D) {
        Hn(r, r.return, D);
      }
      if (r === n) {
        Ke = null;
        break;
      }
      var _ = r.sibling;
      if (_ !== null) {
        _.return = r.return, Ke = _;
        break;
      }
      Ke = r.return;
    }
  }
  var Ey = Math.ceil, Ql = Ee.ReactCurrentDispatcher, zo = Ee.ReactCurrentOwner, Lr = Ee.ReactCurrentBatchConfig, Wt = 0, Er = null, mr = null, Ar = 0, Ha = 0, Ts = ti(0), nr = 0, Pu = null, $i = 0, Rs = 0, uf = 0, Hu = null, Ea = null, Qd = 0, js = 1 / 0, Ba = null, ks = !1, Fo = null, Gl = null, cf = !1, ml = null, Bu = 0, Kl = 0, Ns = null, Vu = -1, Qr = 0;
  function hr() {
    return Wt & 6 ? xt() : Vu !== -1 ? Vu : Vu = xt();
  }
  function Yi(n) {
    return n.mode & 1 ? Wt & 2 && Ar !== 0 ? Ar & -Ar : gy.transition !== null ? (Qr === 0 && (Qr = ns()), Qr) : (n = Zt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : us(n.type)), n) : 1;
  }
  function Zr(n, r, l, s) {
    if (50 < Kl) throw Kl = 0, Ns = null, Error(b(185));
    tl(n, l, s), (!(Wt & 2) || n !== Er) && (n === Er && (!(Wt & 2) && (Rs |= l), nr === 4 && Ci(n, Ar)), ba(n, s), l === 1 && Wt === 0 && !(r.mode & 1) && (js = xt() + 500, xs && zi()));
  }
  function ba(n, r) {
    var l = n.callbackNode;
    fo(n, r);
    var s = Ma(n, n === Er ? Ar : 0);
    if (s === 0) l !== null && yr(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = s & -s, n.callbackPriority !== r) {
      if (l != null && yr(l), r === 1) n.tag === 0 ? Fl(Gd.bind(null, n)) : kc(Gd.bind(null, n)), vs(function() {
        !(Wt & 6) && zi();
      }), l = null;
      else {
        switch (as(s)) {
          case 1:
            l = Aa;
            break;
          case 4:
            l = el;
            break;
          case 16:
            l = ji;
            break;
          case 536870912:
            l = w;
            break;
          default:
            l = ji;
        }
        l = yh(l, ff.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function ff(n, r) {
    if (Vu = -1, Qr = 0, Wt & 6) throw Error(b(327));
    var l = n.callbackNode;
    if (Ds() && n.callbackNode !== l) return null;
    var s = Ma(n, n === Er ? Ar : 0);
    if (s === 0) return null;
    if (s & 30 || s & n.expiredLanes || r) r = df(n, s);
    else {
      r = s;
      var f = Wt;
      Wt |= 2;
      var p = uh();
      (Er !== n || Ar !== r) && (Ba = null, js = xt() + 500, hl(n, r));
      do
        try {
          ch();
          break;
        } catch (_) {
          sh(n, _);
        }
      while (!0);
      _d(), Ql.current = p, Wt = f, mr !== null ? r = 0 : (Er = null, Ar = 0, r = nr);
    }
    if (r !== 0) {
      if (r === 2 && (f = kl(n), f !== 0 && (s = f, r = Iu(n, f))), r === 1) throw l = Pu, hl(n, 0), Ci(n, s), ba(n, xt()), l;
      if (r === 6) Ci(n, s);
      else {
        if (f = n.current.alternate, !(s & 30) && !by(f) && (r = df(n, s), r === 2 && (p = kl(n), p !== 0 && (s = p, r = Iu(n, p))), r === 1)) throw l = Pu, hl(n, 0), Ci(n, s), ba(n, xt()), l;
        switch (n.finishedWork = f, n.finishedLanes = s, r) {
          case 0:
          case 1:
            throw Error(b(345));
          case 2:
            Bo(n, Ea, Ba);
            break;
          case 3:
            if (Ci(n, s), (s & 130023424) === s && (r = Qd + 500 - xt(), 10 < r)) {
              if (Ma(n, 0) !== 0) break;
              if (f = n.suspendedLanes, (f & s) !== s) {
                hr(), n.pingedLanes |= n.suspendedLanes & f;
                break;
              }
              n.timeoutHandle = Tc(Bo.bind(null, n, Ea, Ba), r);
              break;
            }
            Bo(n, Ea, Ba);
            break;
          case 4:
            if (Ci(n, s), (s & 4194240) === s) break;
            for (r = n.eventTimes, f = -1; 0 < s; ) {
              var g = 31 - Lt(s);
              p = 1 << g, g = r[g], g > f && (f = g), s &= ~p;
            }
            if (s = f, s = xt() - s, s = (120 > s ? 120 : 480 > s ? 480 : 1080 > s ? 1080 : 1920 > s ? 1920 : 3e3 > s ? 3e3 : 4320 > s ? 4320 : 1960 * Ey(s / 1960)) - s, 10 < s) {
              n.timeoutHandle = Tc(Bo.bind(null, n, Ea, Ba), s);
              break;
            }
            Bo(n, Ea, Ba);
            break;
          case 5:
            Bo(n, Ea, Ba);
            break;
          default:
            throw Error(b(329));
        }
      }
    }
    return ba(n, xt()), n.callbackNode === l ? ff.bind(null, n) : null;
  }
  function Iu(n, r) {
    var l = Hu;
    return n.current.memoizedState.isDehydrated && (hl(n, r).flags |= 256), n = df(n, r), n !== 2 && (r = Ea, Ea = l, r !== null && Po(r)), n;
  }
  function Po(n) {
    Ea === null ? Ea = n : Ea.push.apply(Ea, n);
  }
  function by(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var s = 0; s < l.length; s++) {
          var f = l[s], p = f.getSnapshot;
          f = f.value;
          try {
            if (!gi(p(), f)) return !1;
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
  function Ci(n, r) {
    for (r &= ~uf, r &= ~Rs, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Lt(r), s = 1 << l;
      n[l] = -1, r &= ~s;
    }
  }
  function Gd(n) {
    if (Wt & 6) throw Error(b(327));
    Ds();
    var r = Ma(n, 0);
    if (!(r & 1)) return ba(n, xt()), null;
    var l = df(n, r);
    if (n.tag !== 0 && l === 2) {
      var s = kl(n);
      s !== 0 && (r = s, l = Iu(n, s));
    }
    if (l === 1) throw l = Pu, hl(n, 0), Ci(n, r), ba(n, xt()), l;
    if (l === 6) throw Error(b(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Bo(n, Ea, Ba), ba(n, xt()), null;
  }
  function Kd(n, r) {
    var l = Wt;
    Wt |= 1;
    try {
      return n(r);
    } finally {
      Wt = l, Wt === 0 && (js = xt() + 500, xs && zi());
    }
  }
  function Ho(n) {
    ml !== null && ml.tag === 0 && !(Wt & 6) && Ds();
    var r = Wt;
    Wt |= 1;
    var l = Lr.transition, s = Zt;
    try {
      if (Lr.transition = null, Zt = 1, n) return n();
    } finally {
      Zt = s, Lr.transition = l, Wt = r, !(Wt & 6) && zi();
    }
  }
  function qd() {
    Ha = Ts.current, Nn(Ts);
  }
  function hl(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, Sd(l)), mr !== null) for (l = mr.return; l !== null; ) {
      var s = l;
      switch (Dc(s), s.tag) {
        case 1:
          s = s.type.childContextTypes, s != null && Ss();
          break;
        case 3:
          jo(), Nn(Sr), Nn(Kn), it();
          break;
        case 5:
          Mc(s);
          break;
        case 4:
          jo();
          break;
        case 13:
          Nn(Yn);
          break;
        case 19:
          Nn(Yn);
          break;
        case 10:
          wd(s.type._context);
          break;
        case 22:
        case 23:
          qd();
      }
      l = l.return;
    }
    if (Er = n, mr = n = ql(n.current, null), Ar = Ha = r, nr = 0, Pu = null, uf = Rs = $i = 0, Ea = Hu = null, To !== null) {
      for (r = 0; r < To.length; r++) if (l = To[r], s = l.interleaved, s !== null) {
        l.interleaved = null;
        var f = s.next, p = l.pending;
        if (p !== null) {
          var g = p.next;
          p.next = f, s.next = g;
        }
        l.pending = s;
      }
      To = null;
    }
    return n;
  }
  function sh(n, r) {
    do {
      var l = mr;
      try {
        if (_d(), Pt.current = Ao, zc) {
          for (var s = tn.memoizedState; s !== null; ) {
            var f = s.queue;
            f !== null && (f.pending = null), s = s.next;
          }
          zc = !1;
        }
        if (yn = 0, _r = fr = tn = null, xu = !1, ko = 0, zo.current = null, l === null || l.return === null) {
          nr = 1, Pu = r, mr = null;
          break;
        }
        e: {
          var p = n, g = l.return, _ = l, D = r;
          if (r = Ar, _.flags |= 32768, D !== null && typeof D == "object" && typeof D.then == "function") {
            var q = D, be = _, we = be.tag;
            if (!(be.mode & 1) && (we === 0 || we === 11 || we === 15)) {
              var xe = be.alternate;
              xe ? (be.updateQueue = xe.updateQueue, be.memoizedState = xe.memoizedState, be.lanes = xe.lanes) : (be.updateQueue = null, be.memoizedState = null);
            }
            var Ye = Km(g);
            if (Ye !== null) {
              Ye.flags &= -257, Wl(Ye, g, _, p, r), Ye.mode & 1 && Fd(p, q, r), r = Ye, D = q;
              var qe = r.updateQueue;
              if (qe === null) {
                var tt = /* @__PURE__ */ new Set();
                tt.add(D), r.updateQueue = tt;
              } else qe.add(D);
              break e;
            } else {
              if (!(r & 1)) {
                Fd(p, q, r), Xd();
                break e;
              }
              D = Error(b(426));
            }
          } else if (Pn && _.mode & 1) {
            var rr = Km(g);
            if (rr !== null) {
              !(rr.flags & 65536) && (rr.flags |= 256), Wl(rr, g, _, p, r), cl(Mo(D, _));
              break e;
            }
          }
          p = D = Mo(D, _), nr !== 4 && (nr = 2), Hu === null ? Hu = [p] : Hu.push(p), p = g;
          do {
            switch (p.tag) {
              case 3:
                p.flags |= 65536, r &= -r, p.lanes |= r;
                var F = Gm(p, D, r);
                Im(p, F);
                break e;
              case 1:
                _ = D;
                var A = p.type, $ = p.stateNode;
                if (!(p.flags & 128) && (typeof A.getDerivedStateFromError == "function" || $ !== null && typeof $.componentDidCatch == "function" && (Gl === null || !Gl.has($)))) {
                  p.flags |= 65536, r &= -r, p.lanes |= r;
                  var Ce = zd(p, _, r);
                  Im(p, Ce);
                  break e;
                }
            }
            p = p.return;
          } while (p !== null);
        }
        dh(l);
      } catch (Xe) {
        r = Xe, mr === l && l !== null && (mr = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function uh() {
    var n = Ql.current;
    return Ql.current = Ao, n === null ? Ao : n;
  }
  function Xd() {
    (nr === 0 || nr === 3 || nr === 2) && (nr = 4), Er === null || !($i & 268435455) && !(Rs & 268435455) || Ci(Er, Ar);
  }
  function df(n, r) {
    var l = Wt;
    Wt |= 2;
    var s = uh();
    (Er !== n || Ar !== r) && (Ba = null, hl(n, r));
    do
      try {
        Cy();
        break;
      } catch (f) {
        sh(n, f);
      }
    while (!0);
    if (_d(), Wt = l, Ql.current = s, mr !== null) throw Error(b(261));
    return Er = null, Ar = 0, nr;
  }
  function Cy() {
    for (; mr !== null; ) fh(mr);
  }
  function ch() {
    for (; mr !== null && !Oa(); ) fh(mr);
  }
  function fh(n) {
    var r = vh(n.alternate, n, Ha);
    n.memoizedProps = n.pendingProps, r === null ? dh(n) : mr = r, zo.current = null;
  }
  function dh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = lf(l, r), l !== null) {
          l.flags &= 32767, mr = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          nr = 6, mr = null;
          return;
        }
      } else if (l = nh(l, r, Ha), l !== null) {
        mr = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        mr = r;
        return;
      }
      mr = r = n;
    } while (r !== null);
    nr === 0 && (nr = 5);
  }
  function Bo(n, r, l) {
    var s = Zt, f = Lr.transition;
    try {
      Lr.transition = null, Zt = 1, _y(n, r, l, s);
    } finally {
      Lr.transition = f, Zt = s;
    }
    return null;
  }
  function _y(n, r, l, s) {
    do
      Ds();
    while (ml !== null);
    if (Wt & 6) throw Error(b(327));
    l = n.finishedWork;
    var f = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(b(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var p = l.lanes | l.childLanes;
    if (Jf(n, p), n === Er && (mr = Er = null, Ar = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || cf || (cf = !0, yh(ji, function() {
      return Ds(), null;
    })), p = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || p) {
      p = Lr.transition, Lr.transition = null;
      var g = Zt;
      Zt = 1;
      var _ = Wt;
      Wt |= 4, zo.current = null, ah(n, l), $d(l, n), ds(Eo), Ja = !!cu, Eo = cu = null, n.current = l, xy(l), La(), Wt = _, Zt = g, Lr.transition = p;
    } else n.current = l;
    if (cf && (cf = !1, ml = n, Bu = f), p = n.pendingLanes, p === 0 && (Gl = null), Ft(l.stateNode), ba(n, xt()), r !== null) for (s = n.onRecoverableError, l = 0; l < r.length; l++) f = r[l], s(f.value, { componentStack: f.stack, digest: f.digest });
    if (ks) throw ks = !1, n = Fo, Fo = null, n;
    return Bu & 1 && n.tag !== 0 && Ds(), p = n.pendingLanes, p & 1 ? n === Ns ? Kl++ : (Kl = 0, Ns = n) : Kl = 0, zi(), null;
  }
  function Ds() {
    if (ml !== null) {
      var n = as(Bu), r = Lr.transition, l = Zt;
      try {
        if (Lr.transition = null, Zt = 16 > n ? 16 : n, ml === null) var s = !1;
        else {
          if (n = ml, ml = null, Bu = 0, Wt & 6) throw Error(b(331));
          var f = Wt;
          for (Wt |= 4, Ke = n.current; Ke !== null; ) {
            var p = Ke, g = p.child;
            if (Ke.flags & 16) {
              var _ = p.deletions;
              if (_ !== null) {
                for (var D = 0; D < _.length; D++) {
                  var q = _[D];
                  for (Ke = q; Ke !== null; ) {
                    var be = Ke;
                    switch (be.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Mu(8, be, p);
                    }
                    var we = be.child;
                    if (we !== null) we.return = be, Ke = we;
                    else for (; Ke !== null; ) {
                      be = Ke;
                      var xe = be.sibling, Ye = be.return;
                      if (sf(be), be === q) {
                        Ke = null;
                        break;
                      }
                      if (xe !== null) {
                        xe.return = Ye, Ke = xe;
                        break;
                      }
                      Ke = Ye;
                    }
                  }
                }
                var qe = p.alternate;
                if (qe !== null) {
                  var tt = qe.child;
                  if (tt !== null) {
                    qe.child = null;
                    do {
                      var rr = tt.sibling;
                      tt.sibling = null, tt = rr;
                    } while (tt !== null);
                  }
                }
                Ke = p;
              }
            }
            if (p.subtreeFlags & 2064 && g !== null) g.return = p, Ke = g;
            else e: for (; Ke !== null; ) {
              if (p = Ke, p.flags & 2048) switch (p.tag) {
                case 0:
                case 11:
                case 15:
                  Mu(9, p, p.return);
              }
              var F = p.sibling;
              if (F !== null) {
                F.return = p.return, Ke = F;
                break e;
              }
              Ke = p.return;
            }
          }
          var A = n.current;
          for (Ke = A; Ke !== null; ) {
            g = Ke;
            var $ = g.child;
            if (g.subtreeFlags & 2064 && $ !== null) $.return = g, Ke = $;
            else e: for (g = A; Ke !== null; ) {
              if (_ = Ke, _.flags & 2048) try {
                switch (_.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Uu(9, _);
                }
              } catch (Xe) {
                Hn(_, _.return, Xe);
              }
              if (_ === g) {
                Ke = null;
                break e;
              }
              var Ce = _.sibling;
              if (Ce !== null) {
                Ce.return = _.return, Ke = Ce;
                break e;
              }
              Ke = _.return;
            }
          }
          if (Wt = f, zi(), ct && typeof ct.onPostCommitFiberRoot == "function") try {
            ct.onPostCommitFiberRoot(ve, n);
          } catch {
          }
          s = !0;
        }
        return s;
      } finally {
        Zt = l, Lr.transition = r;
      }
    }
    return !1;
  }
  function ph(n, r, l) {
    r = Mo(l, r), r = Gm(n, r, 1), n = Il(n, r, 1), r = hr(), n !== null && (tl(n, 1, r), ba(n, r));
  }
  function Hn(n, r, l) {
    if (n.tag === 3) ph(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        ph(r, n, l);
        break;
      } else if (r.tag === 1) {
        var s = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && (Gl === null || !Gl.has(s))) {
          n = Mo(l, n), n = zd(r, n, 1), r = Il(r, n, 1), n = hr(), r !== null && (tl(r, 1, n), ba(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function wy(n, r, l) {
    var s = n.pingCache;
    s !== null && s.delete(r), r = hr(), n.pingedLanes |= n.suspendedLanes & l, Er === n && (Ar & l) === l && (nr === 4 || nr === 3 && (Ar & 130023424) === Ar && 500 > xt() - Qd ? hl(n, 0) : uf |= l), ba(n, r);
  }
  function mh(n, r) {
    r === 0 && (n.mode & 1 ? (r = sn, sn <<= 1, !(sn & 130023424) && (sn = 4194304)) : r = 1);
    var l = hr();
    n = Fa(n, r), n !== null && (tl(n, r, l), ba(n, l));
  }
  function Ty(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), mh(n, l);
  }
  function hh(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var s = n.stateNode, f = n.memoizedState;
        f !== null && (l = f.retryLane);
        break;
      case 19:
        s = n.stateNode;
        break;
      default:
        throw Error(b(314));
    }
    s !== null && s.delete(r), mh(n, l);
  }
  var vh;
  vh = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Sr.current) dr = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return dr = !1, Ou(n, r, l);
      dr = !!(n.flags & 131072);
    }
    else dr = !1, Pn && r.flags & 1048576 && Pm(r, ul, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var s = r.type;
        ii(n, r), n = r.pendingProps;
        var f = ma(r, Kn.current);
        $n(r, l), f = $l(null, r, s, n, f, l);
        var p = xi();
        return r.flags |= 1, typeof f == "object" && f !== null && typeof f.render == "function" && f.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, ur(s) ? (p = !0, Cr(r)) : p = !1, r.memoizedState = f.state !== null && f.state !== void 0 ? f.state : null, kd(r), f.updater = ef, r.stateNode = f, f._reactInternals = r, Ru(r, s, n, l), r = Nu(null, r, s, !0, p, l)) : (r.tag = 0, Pn && p && Nc(r), Or(null, r, f, l), r = r.child), r;
      case 16:
        s = r.elementType;
        e: {
          switch (ii(n, r), n = r.pendingProps, f = s._init, s = f(s._payload), r.type = s, f = r.tag = jy(s), n = Ei(s, n), f) {
            case 0:
              r = qm(null, r, s, n, l);
              break e;
            case 1:
              r = Xm(null, r, s, n, l);
              break e;
            case 11:
              r = Sa(null, r, s, n, l);
              break e;
            case 14:
              r = Uo(null, r, s, Ei(s.type, n), l);
              break e;
          }
          throw Error(b(
            306,
            s,
            ""
          ));
        }
        return r;
      case 0:
        return s = r.type, f = r.pendingProps, f = r.elementType === s ? f : Ei(s, f), qm(n, r, s, f, l);
      case 1:
        return s = r.type, f = r.pendingProps, f = r.elementType === s ? f : Ei(s, f), Xm(n, r, s, f, l);
      case 3:
        e: {
          if (_s(r), n === null) throw Error(b(387));
          s = r.pendingProps, p = r.memoizedState, f = p.element, Vm(n, r), hu(r, s, null, l);
          var g = r.memoizedState;
          if (s = g.element, p.isDehydrated) if (p = { element: s, isDehydrated: !1, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, r.updateQueue.baseState = p, r.memoizedState = p, r.flags & 256) {
            f = Mo(Error(b(423)), r), r = Jm(n, r, s, l, f);
            break e;
          } else if (s !== f) {
            f = Mo(Error(b(424)), r), r = Jm(n, r, s, l, f);
            break e;
          } else for (va = Ai(r.stateNode.containerInfo.firstChild), ha = r, Pn = !0, ri = null, l = Pe(r, null, s, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Vl(), s === f) {
              r = li(n, r, l);
              break e;
            }
            Or(n, r, s, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return $m(r), n === null && bd(r), s = r.type, f = r.pendingProps, p = n !== null ? n.memoizedProps : null, g = f.children, wc(s, f) ? g = null : p !== null && wc(s, p) && (r.flags |= 32), Pd(n, r), Or(n, r, g, l), r.child;
      case 6:
        return n === null && bd(r), null;
      case 13:
        return af(n, r, l);
      case 4:
        return Dd(r, r.stateNode.containerInfo), s = r.pendingProps, n === null ? r.child = Zn(r, null, s, l) : Or(n, r, s, l), r.child;
      case 11:
        return s = r.type, f = r.pendingProps, f = r.elementType === s ? f : Ei(s, f), Sa(n, r, s, f, l);
      case 7:
        return Or(n, r, r.pendingProps, l), r.child;
      case 8:
        return Or(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return Or(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (s = r.type._context, f = r.pendingProps, p = r.memoizedProps, g = f.value, rt(za, s._currentValue), s._currentValue = g, p !== null) if (gi(p.value, g)) {
            if (p.children === f.children && !Sr.current) {
              r = li(n, r, l);
              break e;
            }
          } else for (p = r.child, p !== null && (p.return = r); p !== null; ) {
            var _ = p.dependencies;
            if (_ !== null) {
              g = p.child;
              for (var D = _.firstContext; D !== null; ) {
                if (D.context === s) {
                  if (p.tag === 1) {
                    D = fl(-1, l & -l), D.tag = 2;
                    var q = p.updateQueue;
                    if (q !== null) {
                      q = q.shared;
                      var be = q.pending;
                      be === null ? D.next = D : (D.next = be.next, be.next = D), q.pending = D;
                    }
                  }
                  p.lanes |= l, D = p.alternate, D !== null && (D.lanes |= l), Td(
                    p.return,
                    l,
                    r
                  ), _.lanes |= l;
                  break;
                }
                D = D.next;
              }
            } else if (p.tag === 10) g = p.type === r.type ? null : p.child;
            else if (p.tag === 18) {
              if (g = p.return, g === null) throw Error(b(341));
              g.lanes |= l, _ = g.alternate, _ !== null && (_.lanes |= l), Td(g, l, r), g = p.sibling;
            } else g = p.child;
            if (g !== null) g.return = p;
            else for (g = p; g !== null; ) {
              if (g === r) {
                g = null;
                break;
              }
              if (p = g.sibling, p !== null) {
                p.return = g.return, g = p;
                break;
              }
              g = g.return;
            }
            p = g;
          }
          Or(n, r, f.children, l), r = r.child;
        }
        return r;
      case 9:
        return f = r.type, s = r.pendingProps.children, $n(r, l), f = ai(f), s = s(f), r.flags |= 1, Or(n, r, s, l), r.child;
      case 14:
        return s = r.type, f = Ei(s, r.pendingProps), f = Ei(s.type, f), Uo(n, r, s, f, l);
      case 15:
        return At(n, r, r.type, r.pendingProps, l);
      case 17:
        return s = r.type, f = r.pendingProps, f = r.elementType === s ? f : Ei(s, f), ii(n, r), r.tag = 1, ur(s) ? (n = !0, Cr(r)) : n = !1, $n(r, l), tf(r, s, f), Ru(r, s, f, l), Nu(null, r, s, !0, n, l);
      case 19:
        return Bi(n, r, l);
      case 22:
        return ku(n, r, l);
    }
    throw Error(b(156, r.tag));
  };
  function yh(n, r) {
    return Cn(n, r);
  }
  function Ry(n, r, l, s) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = s, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function si(n, r, l, s) {
    return new Ry(n, r, l, s);
  }
  function Jd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function jy(n) {
    if (typeof n == "function") return Jd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Be) return 11;
      if (n === Ze) return 14;
    }
    return 2;
  }
  function ql(n, r) {
    var l = n.alternate;
    return l === null ? (l = si(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function $u(n, r, l, s, f, p) {
    var g = 2;
    if (s = n, typeof n == "function") Jd(n) && (g = 1);
    else if (typeof n == "string") g = 5;
    else e: switch (n) {
      case I:
        return vl(l.children, f, p, r);
      case _e:
        g = 8, f |= 8;
        break;
      case Ue:
        return n = si(12, l, r, f | 2), n.elementType = Ue, n.lanes = p, n;
      case ee:
        return n = si(13, l, r, f), n.elementType = ee, n.lanes = p, n;
      case Oe:
        return n = si(19, l, r, f), n.elementType = Oe, n.lanes = p, n;
      case je:
        return Xl(l, f, p, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case De:
            g = 10;
            break e;
          case he:
            g = 9;
            break e;
          case Be:
            g = 11;
            break e;
          case Ze:
            g = 14;
            break e;
          case lt:
            g = 16, s = null;
            break e;
        }
        throw Error(b(130, n == null ? n : typeof n, ""));
    }
    return r = si(g, l, r, f), r.elementType = n, r.type = s, r.lanes = p, r;
  }
  function vl(n, r, l, s) {
    return n = si(7, n, s, r), n.lanes = l, n;
  }
  function Xl(n, r, l, s) {
    return n = si(22, n, s, r), n.elementType = je, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Zd(n, r, l) {
    return n = si(6, n, null, r), n.lanes = l, n;
  }
  function pf(n, r, l) {
    return r = si(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function gh(n, r, l, s, f) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = rs(0), this.expirationTimes = rs(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = rs(0), this.identifierPrefix = s, this.onRecoverableError = f, this.mutableSourceEagerHydrationData = null;
  }
  function mf(n, r, l, s, f, p, g, _, D) {
    return n = new gh(n, r, l, _, D), r === 1 ? (r = 1, p === !0 && (r |= 8)) : r = 0, p = si(3, null, null, r), n.current = p, p.stateNode = n, p.memoizedState = { element: s, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, kd(p), n;
  }
  function ky(n, r, l) {
    var s = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: me, key: s == null ? null : "" + s, children: n, containerInfo: r, implementation: l };
  }
  function ep(n) {
    if (!n) return $r;
    n = n._reactInternals;
    e: {
      if (pt(n) !== n || n.tag !== 1) throw Error(b(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (ur(r.type)) {
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
      if (ur(l)) return pu(n, l, r);
    }
    return r;
  }
  function Sh(n, r, l, s, f, p, g, _, D) {
    return n = mf(l, s, !0, n, f, p, g, _, D), n.context = ep(null), l = n.current, s = hr(), f = Yi(l), p = fl(s, f), p.callback = r ?? null, Il(l, p, f), n.current.lanes = f, tl(n, f, s), ba(n, s), n;
  }
  function hf(n, r, l, s) {
    var f = r.current, p = hr(), g = Yi(f);
    return l = ep(l), r.context === null ? r.context = l : r.pendingContext = l, r = fl(p, g), r.payload = { element: n }, s = s === void 0 ? null : s, s !== null && (r.callback = s), n = Il(f, r, g), n !== null && (Zr(n, f, g, p), Ac(n, f, g)), g;
  }
  function vf(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function tp(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function yf(n, r) {
    tp(n, r), (n = n.alternate) && tp(n, r);
  }
  function xh() {
    return null;
  }
  var Vo = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function np(n) {
    this._internalRoot = n;
  }
  gf.prototype.render = np.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(b(409));
    hf(n, r, null, null);
  }, gf.prototype.unmount = np.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Ho(function() {
        hf(null, n, null, null);
      }), r[ol] = null;
    }
  };
  function gf(n) {
    this._internalRoot = n;
  }
  gf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = jt();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < gr.length && r !== 0 && r < gr[l].priority; l++) ;
      gr.splice(l, 0, n), l === 0 && Zs(n);
    }
  };
  function rp(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function Sf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function Eh() {
  }
  function Ny(n, r, l, s, f) {
    if (f) {
      if (typeof s == "function") {
        var p = s;
        s = function() {
          var q = vf(g);
          p.call(q);
        };
      }
      var g = Sh(r, s, n, 0, null, !1, !1, "", Eh);
      return n._reactRootContainer = g, n[ol] = g.current, ms(n.nodeType === 8 ? n.parentNode : n), Ho(), g;
    }
    for (; f = n.lastChild; ) n.removeChild(f);
    if (typeof s == "function") {
      var _ = s;
      s = function() {
        var q = vf(D);
        _.call(q);
      };
    }
    var D = mf(n, 0, !1, null, null, !1, !1, "", Eh);
    return n._reactRootContainer = D, n[ol] = D.current, ms(n.nodeType === 8 ? n.parentNode : n), Ho(function() {
      hf(r, D, l, s);
    }), D;
  }
  function Yu(n, r, l, s, f) {
    var p = l._reactRootContainer;
    if (p) {
      var g = p;
      if (typeof f == "function") {
        var _ = f;
        f = function() {
          var D = vf(g);
          _.call(D);
        };
      }
      hf(r, g, n, f);
    } else g = Ny(l, r, n, f, s);
    return vf(g);
  }
  qt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Bn(r.pendingLanes);
          l !== 0 && (nl(r, l | 1), ba(r, xt()), !(Wt & 6) && (js = xt() + 500, zi()));
        }
        break;
      case 13:
        Ho(function() {
          var s = Fa(n, 1);
          if (s !== null) {
            var f = hr();
            Zr(s, n, 1, f);
          }
        }), yf(n, 1);
    }
  }, Xs = function(n) {
    if (n.tag === 13) {
      var r = Fa(n, 134217728);
      if (r !== null) {
        var l = hr();
        Zr(r, n, 134217728, l);
      }
      yf(n, 134217728);
    }
  }, ki = function(n) {
    if (n.tag === 13) {
      var r = Yi(n), l = Fa(n, r);
      if (l !== null) {
        var s = hr();
        Zr(l, n, r, s);
      }
      yf(n, r);
    }
  }, jt = function() {
    return Zt;
  }, is = function(n, r) {
    var l = Zt;
    try {
      return Zt = n, r();
    } finally {
      Zt = l;
    }
  }, ln = function(n, r, l) {
    switch (r) {
      case "input":
        if (Tn(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var s = l[r];
            if (s !== n && s.form === n.form) {
              var f = In(s);
              if (!f) throw Error(b(90));
              qn(s), Tn(s, f);
            }
          }
        }
        break;
      case "textarea":
        $e(n, l);
        break;
      case "select":
        r = l.value, r != null && bn(n, !!l.multiple, r, !1);
    }
  }, Ga = Kd, Ri = Ho;
  var Dy = { usingClientEntryPoint: !1, Events: [at, Si, In, ca, Qa, Kd] }, Wu = { findFiberByHostInstance: bo, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, bh = { bundleType: Wu.bundleType, version: Wu.version, rendererPackageName: Wu.rendererPackageName, rendererConfig: Wu.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Ee.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Un(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Wu.findFiberByHostInstance || xh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Jl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Jl.isDisabled && Jl.supportsFiber) try {
      ve = Jl.inject(bh), ct = Jl;
    } catch {
    }
  }
  return mi.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Dy, mi.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!rp(r)) throw Error(b(200));
    return ky(n, r, null, l);
  }, mi.createRoot = function(n, r) {
    if (!rp(n)) throw Error(b(299));
    var l = !1, s = "", f = Vo;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (s = r.identifierPrefix), r.onRecoverableError !== void 0 && (f = r.onRecoverableError)), r = mf(n, 1, !1, null, null, l, !1, s, f), n[ol] = r.current, ms(n.nodeType === 8 ? n.parentNode : n), new np(r);
  }, mi.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(b(188)) : (n = Object.keys(n).join(","), Error(b(268, n)));
    return n = Un(r), n = n === null ? null : n.stateNode, n;
  }, mi.flushSync = function(n) {
    return Ho(n);
  }, mi.hydrate = function(n, r, l) {
    if (!Sf(r)) throw Error(b(200));
    return Yu(null, n, r, !0, l);
  }, mi.hydrateRoot = function(n, r, l) {
    if (!rp(n)) throw Error(b(405));
    var s = l != null && l.hydratedSources || null, f = !1, p = "", g = Vo;
    if (l != null && (l.unstable_strictMode === !0 && (f = !0), l.identifierPrefix !== void 0 && (p = l.identifierPrefix), l.onRecoverableError !== void 0 && (g = l.onRecoverableError)), r = Sh(r, null, n, 1, l ?? null, f, !1, p, g), n[ol] = r.current, ms(n), s) for (n = 0; n < s.length; n++) l = s[n], f = l._getVersion, f = f(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, f] : r.mutableSourceEagerHydrationData.push(
      l,
      f
    );
    return new gf(r);
  }, mi.render = function(n, r, l) {
    if (!Sf(r)) throw Error(b(200));
    return Yu(null, n, r, !1, l);
  }, mi.unmountComponentAtNode = function(n) {
    if (!Sf(n)) throw Error(b(40));
    return n._reactRootContainer ? (Ho(function() {
      Yu(null, null, n, !1, function() {
        n._reactRootContainer = null, n[ol] = null;
      });
    }), !0) : !1;
  }, mi.unstable_batchedUpdates = Kd, mi.unstable_renderSubtreeIntoContainer = function(n, r, l, s) {
    if (!Sf(l)) throw Error(b(200));
    if (n == null || n._reactInternals === void 0) throw Error(b(38));
    return Yu(n, r, l, !1, s);
  }, mi.version = "18.3.1-next-f1338f8080-20240426", mi;
}
var hi = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var C_;
function Uk() {
  return C_ || (C_ = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var x = k, S = D_(), b = x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, J = !1;
    function Z(e) {
      J = e;
    }
    function N(e) {
      if (!J) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        W("warn", e, a);
      }
    }
    function y(e) {
      if (!J) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        W("error", e, a);
      }
    }
    function W(e, t, a) {
      {
        var i = b.ReactDebugCurrentFrame, o = i.getStackAddendum();
        o !== "" && (t += "%s", a = a.concat([o]));
        var u = a.map(function(d) {
          return String(d);
        });
        u.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, u);
      }
    }
    var U = 0, j = 1, de = 2, z = 3, Y = 4, G = 5, re = 6, oe = 7, ye = 8, Ae = 9, le = 10, ke = 11, Ee = 12, ce = 13, me = 14, I = 15, _e = 16, Ue = 17, De = 18, he = 19, Be = 21, ee = 22, Oe = 23, Ze = 24, lt = 25, je = !0, Se = !1, Ie = !1, Re = !1, O = !1, P = !0, te = !0, ue = !0, bt = !0, Tt = /* @__PURE__ */ new Set(), yt = {}, mt = {};
    function gt(e, t) {
      $t(e, t), $t(e + "Capture", t);
    }
    function $t(e, t) {
      yt[e] && y("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), yt[e] = t;
      {
        var a = e.toLowerCase();
        mt[a] = e, e === "onDoubleClick" && (mt.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        Tt.add(t[i]);
    }
    var Dn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", qn = Object.prototype.hasOwnProperty;
    function xn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function En(e) {
      try {
        return On(e), !1;
      } catch {
        return !0;
      }
    }
    function On(e) {
      return "" + e;
    }
    function Ct(e, t) {
      if (En(e))
        return y("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, xn(e)), On(e);
    }
    function Tn(e) {
      if (En(e))
        return y("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", xn(e)), On(e);
    }
    function Ln(e, t) {
      if (En(e))
        return y("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, xn(e)), On(e);
    }
    function Qn(e, t) {
      if (En(e))
        return y("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, xn(e)), On(e);
    }
    function An(e) {
      if (En(e))
        return y("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", xn(e)), On(e);
    }
    function bn(e) {
      if (En(e))
        return y("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", xn(e)), On(e);
    }
    var Rn = 0, V = 1, $e = 2, St = 3, ht = 4, Ir = 5, ua = 6, ja = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", Le = ja + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", et = new RegExp("^[" + ja + "][" + Le + "]*$"), Dt = {}, Kt = {};
    function pn(e) {
      return qn.call(Kt, e) ? !0 : qn.call(Dt, e) ? !1 : et.test(e) ? (Kt[e] = !0, !0) : (Dt[e] = !0, y("Invalid attribute name: `%s`", e), !1);
    }
    function Mn(e, t, a) {
      return t !== null ? t.type === Rn : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function Ut(e, t, a, i) {
      if (a !== null && a.type === Rn)
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
    function Xn(e, t, a, i) {
      if (t === null || typeof t > "u" || Ut(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case St:
            return !t;
          case ht:
            return t === !1;
          case Ir:
            return isNaN(t);
          case ua:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function fn(e) {
      return ln.hasOwnProperty(e) ? ln[e] : null;
    }
    function on(e, t, a, i, o, u, d) {
      this.acceptsBooleans = t === $e || t === St || t === ht, this.attributeName = i, this.attributeNamespace = o, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = u, this.removeEmptyString = d;
    }
    var ln = {}, jn = [
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
    jn.forEach(function(e) {
      ln[e] = new on(
        e,
        Rn,
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
      ln[t] = new on(
        t,
        V,
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
      ln[e] = new on(
        e,
        $e,
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
      ln[e] = new on(
        e,
        $e,
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
      ln[e] = new on(
        e,
        St,
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
      ln[e] = new on(
        e,
        St,
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
      ln[e] = new on(
        e,
        ht,
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
      ln[e] = new on(
        e,
        ua,
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
      ln[e] = new on(
        e,
        Ir,
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
    var Jn = /[\-\:]([a-z])/g, jr = function(e) {
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
      var t = e.replace(Jn, jr);
      ln[t] = new on(
        t,
        V,
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
      var t = e.replace(Jn, jr);
      ln[t] = new on(
        t,
        V,
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
      var t = e.replace(Jn, jr);
      ln[t] = new on(
        t,
        V,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      ln[e] = new on(
        e,
        V,
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
    var ca = "xlinkHref";
    ln[ca] = new on(
      "xlinkHref",
      V,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      ln[e] = new on(
        e,
        V,
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
    var Qa = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, Ga = !1;
    function Ri(e) {
      !Ga && Qa.test(e) && (Ga = !0, y("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function ka(e, t, a, i) {
      if (i.mustUseProperty) {
        var o = i.propertyName;
        return e[o];
      } else {
        Ct(a, t), i.sanitizeURL && Ri("" + a);
        var u = i.attributeName, d = null;
        if (i.type === ht) {
          if (e.hasAttribute(u)) {
            var m = e.getAttribute(u);
            return m === "" ? !0 : Xn(t, a, i, !1) ? m : m === "" + a ? a : m;
          }
        } else if (e.hasAttribute(u)) {
          if (Xn(t, a, i, !1))
            return e.getAttribute(u);
          if (i.type === St)
            return a;
          d = e.getAttribute(u);
        }
        return Xn(t, a, i, !1) ? d === null ? a : d : d === "" + a ? a : d;
      }
    }
    function Zi(e, t, a, i) {
      {
        if (!pn(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var o = e.getAttribute(t);
        return Ct(a, t), o === "" + a ? a : o;
      }
    }
    function ir(e, t, a, i) {
      var o = fn(t);
      if (!Mn(t, o, i)) {
        if (Xn(t, a, o, i) && (a = null), i || o === null) {
          if (pn(t)) {
            var u = t;
            a === null ? e.removeAttribute(u) : (Ct(a, t), e.setAttribute(u, "" + a));
          }
          return;
        }
        var d = o.mustUseProperty;
        if (d) {
          var m = o.propertyName;
          if (a === null) {
            var h = o.type;
            e[m] = h === St ? !1 : "";
          } else
            e[m] = a;
          return;
        }
        var E = o.attributeName, C = o.attributeNamespace;
        if (a === null)
          e.removeAttribute(E);
        else {
          var M = o.type, L;
          M === St || M === ht && a === !0 ? L = "" : (Ct(a, E), L = "" + a, o.sanitizeURL && Ri(L.toString())), C ? e.setAttributeNS(C, E, L) : e.setAttribute(E, L);
        }
      }
    }
    var kr = Symbol.for("react.element"), Gn = Symbol.for("react.portal"), Ka = Symbol.for("react.fragment"), fa = Symbol.for("react.strict_mode"), Na = Symbol.for("react.profiler"), Da = Symbol.for("react.provider"), R = Symbol.for("react.context"), pe = Symbol.for("react.forward_ref"), ze = Symbol.for("react.suspense"), Qe = Symbol.for("react.suspense_list"), pt = Symbol.for("react.memo"), _t = Symbol.for("react.lazy"), Rt = Symbol.for("react.scope"), Mt = Symbol.for("react.debug_trace_mode"), Un = Symbol.for("react.offscreen"), Bt = Symbol.for("react.legacy_hidden"), Cn = Symbol.for("react.cache"), yr = Symbol.for("react.tracing_marker"), Oa = Symbol.iterator, La = "@@iterator";
    function xt(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Oa && e[Oa] || e[La];
      return typeof t == "function" ? t : null;
    }
    var Ot = Object.assign, Aa = 0, el, ji, fe, w, ve, ct, Ft;
    function Lt() {
    }
    Lt.__reactDisabledLog = !0;
    function _n() {
      {
        if (Aa === 0) {
          el = console.log, ji = console.info, fe = console.warn, w = console.error, ve = console.group, ct = console.groupCollapsed, Ft = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Lt,
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
        Aa++;
      }
    }
    function lr() {
      {
        if (Aa--, Aa === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Ot({}, e, {
              value: el
            }),
            info: Ot({}, e, {
              value: ji
            }),
            warn: Ot({}, e, {
              value: fe
            }),
            error: Ot({}, e, {
              value: w
            }),
            group: Ot({}, e, {
              value: ve
            }),
            groupCollapsed: Ot({}, e, {
              value: ct
            }),
            groupEnd: Ot({}, e, {
              value: Ft
            })
          });
        }
        Aa < 0 && y("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var dn = b.ReactCurrentDispatcher, or;
    function sn(e, t, a) {
      {
        if (or === void 0)
          try {
            throw Error();
          } catch (o) {
            var i = o.stack.trim().match(/\n( *(at )?)/);
            or = i && i[1] || "";
          }
        return `
` + or + e;
      }
    }
    var Bn = !1, Ma;
    {
      var ts = typeof WeakMap == "function" ? WeakMap : Map;
      Ma = new ts();
    }
    function fo(e, t) {
      if (!e || Bn)
        return "";
      {
        var a = Ma.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      Bn = !0;
      var o = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var u;
      u = dn.current, dn.current = null, _n();
      try {
        if (t) {
          var d = function() {
            throw Error();
          };
          if (Object.defineProperty(d.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(d, []);
            } catch (X) {
              i = X;
            }
            Reflect.construct(e, [], d);
          } else {
            try {
              d.call();
            } catch (X) {
              i = X;
            }
            e.call(d.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (X) {
            i = X;
          }
          e();
        }
      } catch (X) {
        if (X && i && typeof X.stack == "string") {
          for (var m = X.stack.split(`
`), h = i.stack.split(`
`), E = m.length - 1, C = h.length - 1; E >= 1 && C >= 0 && m[E] !== h[C]; )
            C--;
          for (; E >= 1 && C >= 0; E--, C--)
            if (m[E] !== h[C]) {
              if (E !== 1 || C !== 1)
                do
                  if (E--, C--, C < 0 || m[E] !== h[C]) {
                    var M = `
` + m[E].replace(" at new ", " at ");
                    return e.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", e.displayName)), typeof e == "function" && Ma.set(e, M), M;
                  }
                while (E >= 1 && C >= 0);
              break;
            }
        }
      } finally {
        Bn = !1, dn.current = u, lr(), Error.prepareStackTrace = o;
      }
      var L = e ? e.displayName || e.name : "", Q = L ? sn(L) : "";
      return typeof e == "function" && Ma.set(e, Q), Q;
    }
    function kl(e, t, a) {
      return fo(e, !0);
    }
    function ns(e, t, a) {
      return fo(e, !1);
    }
    function rs(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function tl(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return fo(e, rs(e));
      if (typeof e == "string")
        return sn(e);
      switch (e) {
        case ze:
          return sn("Suspense");
        case Qe:
          return sn("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case pe:
            return ns(e.render);
          case pt:
            return tl(e.type, t, a);
          case _t: {
            var i = e, o = i._payload, u = i._init;
            try {
              return tl(u(o), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Jf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case G:
          return sn(e.type);
        case _e:
          return sn("Lazy");
        case ce:
          return sn("Suspense");
        case he:
          return sn("SuspenseList");
        case U:
        case de:
        case I:
          return ns(e.type);
        case ke:
          return ns(e.type.render);
        case j:
          return kl(e.type);
        default:
          return "";
      }
    }
    function nl(e) {
      try {
        var t = "", a = e;
        do
          t += Jf(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Zt(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var o = t.displayName || t.name || "";
      return o !== "" ? a + "(" + o + ")" : a;
    }
    function as(e) {
      return e.displayName || "Context";
    }
    function qt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && y("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case Ka:
          return "Fragment";
        case Gn:
          return "Portal";
        case Na:
          return "Profiler";
        case fa:
          return "StrictMode";
        case ze:
          return "Suspense";
        case Qe:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case R:
            var t = e;
            return as(t) + ".Consumer";
          case Da:
            var a = e;
            return as(a._context) + ".Provider";
          case pe:
            return Zt(e, e.render, "ForwardRef");
          case pt:
            var i = e.displayName || null;
            return i !== null ? i : qt(e.type) || "Memo";
          case _t: {
            var o = e, u = o._payload, d = o._init;
            try {
              return qt(d(u));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Xs(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function ki(e) {
      return e.displayName || "Context";
    }
    function jt(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Ze:
          return "Cache";
        case Ae:
          var i = a;
          return ki(i) + ".Consumer";
        case le:
          var o = a;
          return ki(o._context) + ".Provider";
        case De:
          return "DehydratedFragment";
        case ke:
          return Xs(a, a.render, "ForwardRef");
        case oe:
          return "Fragment";
        case G:
          return a;
        case Y:
          return "Portal";
        case z:
          return "Root";
        case re:
          return "Text";
        case _e:
          return qt(a);
        case ye:
          return a === fa ? "StrictMode" : "Mode";
        case ee:
          return "Offscreen";
        case Ee:
          return "Profiler";
        case Be:
          return "Scope";
        case ce:
          return "Suspense";
        case he:
          return "SuspenseList";
        case lt:
          return "TracingMarker";
        case j:
        case U:
        case Ue:
        case de:
        case me:
        case I:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var is = b.ReactDebugCurrentFrame, Nr = null, Ni = !1;
    function Gr() {
      {
        if (Nr === null)
          return null;
        var e = Nr._debugOwner;
        if (e !== null && typeof e < "u")
          return jt(e);
      }
      return null;
    }
    function Di() {
      return Nr === null ? "" : nl(Nr);
    }
    function zn() {
      is.getCurrentStack = null, Nr = null, Ni = !1;
    }
    function mn(e) {
      is.getCurrentStack = e === null ? null : Di, Nr = e, Ni = !1;
    }
    function Nl() {
      return Nr;
    }
    function gr(e) {
      Ni = e;
    }
    function Kr(e) {
      return "" + e;
    }
    function qa(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return bn(e), e;
        default:
          return "";
      }
    }
    var po = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Js(e, t) {
      po[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || y("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || y("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Zs(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Dl(e) {
      return e._valueTracker;
    }
    function mo(e) {
      e._valueTracker = null;
    }
    function Zf(e) {
      var t = "";
      return e && (Zs(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Xa(e) {
      var t = Zs(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      bn(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var o = a.get, u = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return o.call(this);
          },
          set: function(m) {
            bn(m), i = "" + m, u.call(this, m);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var d = {
          getValue: function() {
            return i;
          },
          setValue: function(m) {
            bn(m), i = "" + m;
          },
          stopTracking: function() {
            mo(e), delete e[t];
          }
        };
        return d;
      }
    }
    function vi(e) {
      Dl(e) || (e._valueTracker = Xa(e));
    }
    function Oi(e) {
      if (!e)
        return !1;
      var t = Dl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Zf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function Ja(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var ls = !1, os = !1, Ol = !1, ho = !1;
    function ss(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function us(e, t) {
      var a = e, i = t.checked, o = Ot({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return o;
    }
    function yi(e, t) {
      Js("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !os && (y("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Gr() || "A component", t.type), os = !0), t.value !== void 0 && t.defaultValue !== void 0 && !ls && (y("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Gr() || "A component", t.type), ls = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: qa(t.value != null ? t.value : i),
        controlled: ss(t)
      };
    }
    function v(e, t) {
      var a = e, i = t.checked;
      i != null && ir(a, "checked", i, !1);
    }
    function T(e, t) {
      var a = e;
      {
        var i = ss(t);
        !a._wrapperState.controlled && i && !ho && (y("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), ho = !0), a._wrapperState.controlled && !i && !Ol && (y("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Ol = !0);
      }
      v(e, t);
      var o = qa(t.value), u = t.type;
      if (o != null)
        u === "number" ? (o === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != o) && (a.value = Kr(o)) : a.value !== Kr(o) && (a.value = Kr(o));
      else if (u === "submit" || u === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? ot(a, t.type, o) : t.hasOwnProperty("defaultValue") && ot(a, t.type, qa(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function K(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var o = t.type, u = o === "submit" || o === "reset";
        if (u && (t.value === void 0 || t.value === null))
          return;
        var d = Kr(i._wrapperState.initialValue);
        a || d !== i.value && (i.value = d), i.defaultValue = d;
      }
      var m = i.name;
      m !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, m !== "" && (i.name = m);
    }
    function ne(e, t) {
      var a = e;
      T(a, t), Ne(a, t);
    }
    function Ne(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        Ct(a, "name");
        for (var o = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), u = 0; u < o.length; u++) {
          var d = o[u];
          if (!(d === e || d.form !== e.form)) {
            var m = Hh(d);
            if (!m)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            Oi(d), T(d, m);
          }
        }
      }
    }
    function ot(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || Ja(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Kr(e._wrapperState.initialValue) : e.defaultValue !== Kr(a) && (e.defaultValue = Kr(a)));
    }
    var Fe = !1, ft = !1, Ht = !1;
    function Xt(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? x.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || ft || (ft = !0, y("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Ht || (Ht = !0, y("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !Fe && (y("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), Fe = !0);
    }
    function kn(e, t) {
      t.value != null && e.setAttribute("value", Kr(qa(t.value)));
    }
    var hn = Array.isArray;
    function zt(e) {
      return hn(e);
    }
    var vn;
    vn = !1;
    function Vn() {
      var e = Gr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Ll = ["value", "defaultValue"];
    function eu(e) {
      {
        Js("select", e);
        for (var t = 0; t < Ll.length; t++) {
          var a = Ll[t];
          if (e[a] != null) {
            var i = zt(e[a]);
            e.multiple && !i ? y("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, Vn()) : !e.multiple && i && y("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, Vn());
          }
        }
      }
    }
    function rl(e, t, a, i) {
      var o = e.options;
      if (t) {
        for (var u = a, d = {}, m = 0; m < u.length; m++)
          d["$" + u[m]] = !0;
        for (var h = 0; h < o.length; h++) {
          var E = d.hasOwnProperty("$" + o[h].value);
          o[h].selected !== E && (o[h].selected = E), E && i && (o[h].defaultSelected = !0);
        }
      } else {
        for (var C = Kr(qa(a)), M = null, L = 0; L < o.length; L++) {
          if (o[L].value === C) {
            o[L].selected = !0, i && (o[L].defaultSelected = !0);
            return;
          }
          M === null && !o[L].disabled && (M = o[L]);
        }
        M !== null && (M.selected = !0);
      }
    }
    function tu(e, t) {
      return Ot({}, t, {
        value: void 0
      });
    }
    function vo(e, t) {
      var a = e;
      eu(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !vn && (y("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), vn = !0);
    }
    function ed(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? rl(a, !!t.multiple, i, !1) : t.defaultValue != null && rl(a, !!t.multiple, t.defaultValue, !0);
    }
    function dc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var o = t.value;
      o != null ? rl(a, !!t.multiple, o, !1) : i !== !!t.multiple && (t.defaultValue != null ? rl(a, !!t.multiple, t.defaultValue, !0) : rl(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function td(e, t) {
      var a = e, i = t.value;
      i != null && rl(a, !!t.multiple, i, !1);
    }
    var um = !1;
    function nd(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = Ot({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Kr(a._wrapperState.initialValue)
      });
      return i;
    }
    function rd(e, t) {
      var a = e;
      Js("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !um && (y("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Gr() || "A component"), um = !0);
      var i = t.value;
      if (i == null) {
        var o = t.children, u = t.defaultValue;
        if (o != null) {
          y("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (u != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (zt(o)) {
              if (o.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              o = o[0];
            }
            u = o;
          }
        }
        u == null && (u = ""), i = u;
      }
      a._wrapperState = {
        initialValue: qa(i)
      };
    }
    function cm(e, t) {
      var a = e, i = qa(t.value), o = qa(t.defaultValue);
      if (i != null) {
        var u = Kr(i);
        u !== a.value && (a.value = u), t.defaultValue == null && a.defaultValue !== u && (a.defaultValue = u);
      }
      o != null && (a.defaultValue = Kr(o));
    }
    function fm(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ly(e, t) {
      cm(e, t);
    }
    var al = "http://www.w3.org/1999/xhtml", ad = "http://www.w3.org/1998/Math/MathML", id = "http://www.w3.org/2000/svg";
    function ld(e) {
      switch (e) {
        case "svg":
          return id;
        case "math":
          return ad;
        default:
          return al;
      }
    }
    function od(e, t) {
      return e == null || e === al ? ld(t) : e === id && t === "foreignObject" ? al : e;
    }
    var dm = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, o) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, o);
        });
      } : e;
    }, pc, pm = dm(function(e, t) {
      if (e.namespaceURI === id && !("innerHTML" in e)) {
        pc = pc || document.createElement("div"), pc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = pc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), da = 1, il = 3, sr = 8, ll = 9, sd = 11, cs = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === il) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, nu = {
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
    }, ru = {
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
    function mm(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var hm = ["Webkit", "ms", "Moz", "O"];
    Object.keys(ru).forEach(function(e) {
      hm.forEach(function(t) {
        ru[mm(t, e)] = ru[e];
      });
    });
    function mc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(ru.hasOwnProperty(e) && ru[e]) ? t + "px" : (Qn(t, e), ("" + t).trim());
    }
    var vm = /([A-Z])/g, ym = /^ms-/;
    function fs(e) {
      return e.replace(vm, "-$1").toLowerCase().replace(ym, "-ms-");
    }
    var gm = function() {
    };
    {
      var oy = /^(?:webkit|moz|o)[A-Z]/, sy = /^-ms-/, Sm = /-(.)/g, ud = /;\s*$/, Li = {}, yo = {}, xm = !1, au = !1, uy = function(e) {
        return e.replace(Sm, function(t, a) {
          return a.toUpperCase();
        });
      }, Em = function(e) {
        Li.hasOwnProperty(e) && Li[e] || (Li[e] = !0, y(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          uy(e.replace(sy, "ms-"))
        ));
      }, cd = function(e) {
        Li.hasOwnProperty(e) && Li[e] || (Li[e] = !0, y("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, fd = function(e, t) {
        yo.hasOwnProperty(t) && yo[t] || (yo[t] = !0, y(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(ud, "")));
      }, bm = function(e, t) {
        xm || (xm = !0, y("`NaN` is an invalid value for the `%s` css style property.", e));
      }, Cm = function(e, t) {
        au || (au = !0, y("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      gm = function(e, t) {
        e.indexOf("-") > -1 ? Em(e) : oy.test(e) ? cd(e) : ud.test(t) && fd(e, t), typeof t == "number" && (isNaN(t) ? bm(e, t) : isFinite(t) || Cm(e, t));
      };
    }
    var _m = gm;
    function cy(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var o = e[i];
            if (o != null) {
              var u = i.indexOf("--") === 0;
              t += a + (u ? i : fs(i)) + ":", t += mc(i, o, u), a = ";";
            }
          }
        return t || null;
      }
    }
    function wm(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var o = i.indexOf("--") === 0;
          o || _m(i, t[i]);
          var u = mc(i, t[i], o);
          i === "float" && (i = "cssFloat"), o ? a.setProperty(i, u) : a[i] = u;
        }
    }
    function fy(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Tm(e) {
      var t = {};
      for (var a in e)
        for (var i = nu[a] || [a], o = 0; o < i.length; o++)
          t[i[o]] = a;
      return t;
    }
    function dy(e, t) {
      {
        if (!t)
          return;
        var a = Tm(e), i = Tm(t), o = {};
        for (var u in a) {
          var d = a[u], m = i[u];
          if (m && d !== m) {
            var h = d + "," + m;
            if (o[h])
              continue;
            o[h] = !0, y("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", fy(e[d]) ? "Removing" : "Updating", d, m);
          }
        }
      }
    }
    var gi = {
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
    }, iu = Ot({
      menuitem: !0
    }, gi), Rm = "__html";
    function hc(e, t) {
      if (t) {
        if (iu[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Rm in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && y("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Al(e, t) {
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
    var lu = {
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
    }, vc = {
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
    }, ds = {}, py = new RegExp("^(aria)-[" + Le + "]*$"), ps = new RegExp("^(aria)[A-Z][" + Le + "]*$");
    function dd(e, t) {
      {
        if (qn.call(ds, t) && ds[t])
          return !0;
        if (ps.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = vc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return y("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), ds[t] = !0, !0;
          if (t !== i)
            return y("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), ds[t] = !0, !0;
        }
        if (py.test(t)) {
          var o = t.toLowerCase(), u = vc.hasOwnProperty(o) ? o : null;
          if (u == null)
            return ds[t] = !0, !1;
          if (t !== u)
            return y("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, u), ds[t] = !0, !0;
        }
      }
      return !0;
    }
    function ou(e, t) {
      {
        var a = [];
        for (var i in t) {
          var o = dd(e, i);
          o || a.push(i);
        }
        var u = a.map(function(d) {
          return "`" + d + "`";
        }).join(", ");
        a.length === 1 ? y("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", u, e) : a.length > 1 && y("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", u, e);
      }
    }
    function pd(e, t) {
      Al(e, t) || ou(e, t);
    }
    var md = !1;
    function yc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !md && (md = !0, e === "select" && t.multiple ? y("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : y("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var go = function() {
    };
    {
      var Dr = {}, hd = /^on./, gc = /^on[^A-Z]/, jm = new RegExp("^(aria)-[" + Le + "]*$"), km = new RegExp("^(aria)[A-Z][" + Le + "]*$");
      go = function(e, t, a, i) {
        if (qn.call(Dr, t) && Dr[t])
          return !0;
        var o = t.toLowerCase();
        if (o === "onfocusin" || o === "onfocusout")
          return y("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), Dr[t] = !0, !0;
        if (i != null) {
          var u = i.registrationNameDependencies, d = i.possibleRegistrationNames;
          if (u.hasOwnProperty(t))
            return !0;
          var m = d.hasOwnProperty(o) ? d[o] : null;
          if (m != null)
            return y("Invalid event handler property `%s`. Did you mean `%s`?", t, m), Dr[t] = !0, !0;
          if (hd.test(t))
            return y("Unknown event handler property `%s`. It will be ignored.", t), Dr[t] = !0, !0;
        } else if (hd.test(t))
          return gc.test(t) && y("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), Dr[t] = !0, !0;
        if (jm.test(t) || km.test(t))
          return !0;
        if (o === "innerhtml")
          return y("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), Dr[t] = !0, !0;
        if (o === "aria")
          return y("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), Dr[t] = !0, !0;
        if (o === "is" && a !== null && a !== void 0 && typeof a != "string")
          return y("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), Dr[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return y("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), Dr[t] = !0, !0;
        var h = fn(t), E = h !== null && h.type === Rn;
        if (lu.hasOwnProperty(o)) {
          var C = lu[o];
          if (C !== t)
            return y("Invalid DOM property `%s`. Did you mean `%s`?", t, C), Dr[t] = !0, !0;
        } else if (!E && t !== o)
          return y("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, o), Dr[t] = !0, !0;
        return typeof a == "boolean" && Ut(t, a, h, !1) ? (a ? y('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : y('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), Dr[t] = !0, !0) : E ? !0 : Ut(t, a, h, !1) ? (Dr[t] = !0, !1) : ((a === "false" || a === "true") && h !== null && h.type === St && (y("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), Dr[t] = !0), !0);
      };
    }
    var Nm = function(e, t, a) {
      {
        var i = [];
        for (var o in t) {
          var u = go(e, o, t[o], a);
          u || i.push(o);
        }
        var d = i.map(function(m) {
          return "`" + m + "`";
        }).join(", ");
        i.length === 1 ? y("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", d, e) : i.length > 1 && y("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", d, e);
      }
    };
    function Dm(e, t, a) {
      Al(e, t) || Nm(e, t, a);
    }
    var vd = 1, Sc = 2, Za = 4, yd = vd | Sc | Za, So = null;
    function my(e) {
      So !== null && y("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), So = e;
    }
    function hy() {
      So === null && y("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), So = null;
    }
    function su(e) {
      return e === So;
    }
    function gd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === il ? t.parentNode : t;
    }
    var xc = null, xo = null, un = null;
    function Ec(e) {
      var t = As(e);
      if (t) {
        if (typeof xc != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = Hh(a);
          xc(t.stateNode, t.type, i);
        }
      }
    }
    function bc(e) {
      xc = e;
    }
    function ms(e) {
      xo ? un ? un.push(e) : un = [e] : xo = e;
    }
    function Om() {
      return xo !== null || un !== null;
    }
    function Cc() {
      if (xo) {
        var e = xo, t = un;
        if (xo = null, un = null, Ec(e), t)
          for (var a = 0; a < t.length; a++)
            Ec(t[a]);
      }
    }
    var hs = function(e, t) {
      return e(t);
    }, uu = function() {
    }, Ml = !1;
    function Lm() {
      var e = Om();
      e && (uu(), Cc());
    }
    function Am(e, t, a) {
      if (Ml)
        return e(t, a);
      Ml = !0;
      try {
        return hs(e, t, a);
      } finally {
        Ml = !1, Lm();
      }
    }
    function vy(e, t, a) {
      hs = e, uu = a;
    }
    function Mm(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function _c(e, t, a) {
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
          return !!(a.disabled && Mm(t));
        default:
          return !1;
      }
    }
    function Ul(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = Hh(a);
      if (i === null)
        return null;
      var o = i[t];
      if (_c(t, e.type, i))
        return null;
      if (o && typeof o != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof o + "` type.");
      return o;
    }
    var cu = !1;
    if (Dn)
      try {
        var Eo = {};
        Object.defineProperty(Eo, "passive", {
          get: function() {
            cu = !0;
          }
        }), window.addEventListener("test", Eo, Eo), window.removeEventListener("test", Eo, Eo);
      } catch {
        cu = !1;
      }
    function wc(e, t, a, i, o, u, d, m, h) {
      var E = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, E);
      } catch (C) {
        this.onError(C);
      }
    }
    var Tc = wc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var Sd = document.createElement("react");
      Tc = function(t, a, i, o, u, d, m, h, E) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var C = document.createEvent("Event"), M = !1, L = !0, Q = window.event, X = Object.getOwnPropertyDescriptor(window, "event");
        function ae() {
          Sd.removeEventListener(ie, st, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = Q);
        }
        var He = Array.prototype.slice.call(arguments, 3);
        function st() {
          M = !0, ae(), a.apply(i, He), L = !1;
        }
        var nt, Gt = !1, Vt = !1;
        function H(B) {
          if (nt = B.error, Gt = !0, nt === null && B.colno === 0 && B.lineno === 0 && (Vt = !0), B.defaultPrevented && nt != null && typeof nt == "object")
            try {
              nt._suppressLogging = !0;
            } catch {
            }
        }
        var ie = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", H), Sd.addEventListener(ie, st, !1), C.initEvent(ie, !1, !1), Sd.dispatchEvent(C), X && Object.defineProperty(window, "event", X), M && L && (Gt ? Vt && (nt = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : nt = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(nt)), window.removeEventListener("error", H), !M)
          return ae(), wc.apply(this, arguments);
      };
    }
    var Um = Tc, vs = !1, Rc = null, ys = !1, Ai = null, zm = {
      onError: function(e) {
        vs = !0, Rc = e;
      }
    };
    function zl(e, t, a, i, o, u, d, m, h) {
      vs = !1, Rc = null, Um.apply(zm, arguments);
    }
    function Mi(e, t, a, i, o, u, d, m, h) {
      if (zl.apply(this, arguments), vs) {
        var E = du();
        ys || (ys = !0, Ai = E);
      }
    }
    function fu() {
      if (ys) {
        var e = Ai;
        throw ys = !1, Ai = null, e;
      }
    }
    function ol() {
      return vs;
    }
    function du() {
      if (vs) {
        var e = Rc;
        return vs = !1, Rc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function gs(e) {
      return e._reactInternals;
    }
    function yy(e) {
      return e._reactInternals !== void 0;
    }
    function bo(e, t) {
      e._reactInternals = t;
    }
    var at = (
      /*                      */
      0
    ), Si = (
      /*                */
      1
    ), In = (
      /*                    */
      2
    ), Yt = (
      /*                       */
      4
    ), ei = (
      /*                */
      16
    ), ti = (
      /*                 */
      32
    ), Nn = (
      /*                     */
      64
    ), rt = (
      /*                   */
      128
    ), $r = (
      /*            */
      256
    ), Kn = (
      /*                          */
      512
    ), Sr = (
      /*                     */
      1024
    ), pa = (
      /*                      */
      2048
    ), ma = (
      /*                    */
      4096
    ), ur = (
      /*                   */
      8192
    ), Ss = (
      /*             */
      16384
    ), Fm = (
      /*               */
      32767
    ), pu = (
      /*                   */
      32768
    ), Cr = (
      /*                */
      65536
    ), jc = (
      /* */
      131072
    ), Ui = (
      /*                       */
      1048576
    ), xs = (
      /*                    */
      2097152
    ), sl = (
      /*                 */
      4194304
    ), kc = (
      /*                */
      8388608
    ), Fl = (
      /*               */
      16777216
    ), zi = (
      /*              */
      33554432
    ), Pl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Yt | Sr | 0
    ), Hl = In | Yt | ei | ti | Kn | ma | ur, Bl = Yt | Nn | Kn | ur, ul = pa | ei, cr = sl | kc | xs, ni = b.ReactCurrentOwner;
    function Ua(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (In | ma)) !== at && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === z ? a : null;
    }
    function Fi(e) {
      if (e.tag === ce) {
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
    function Pi(e) {
      return e.tag === z ? e.stateNode.containerInfo : null;
    }
    function Co(e) {
      return Ua(e) === e;
    }
    function Pm(e) {
      {
        var t = ni.current;
        if (t !== null && t.tag === j) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || y("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", jt(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var o = gs(e);
      return o ? Ua(o) === o : !1;
    }
    function Nc(e) {
      if (Ua(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function Dc(e) {
      var t = e.alternate;
      if (!t) {
        var a = Ua(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, o = t; ; ) {
        var u = i.return;
        if (u === null)
          break;
        var d = u.alternate;
        if (d === null) {
          var m = u.return;
          if (m !== null) {
            i = o = m;
            continue;
          }
          break;
        }
        if (u.child === d.child) {
          for (var h = u.child; h; ) {
            if (h === i)
              return Nc(u), e;
            if (h === o)
              return Nc(u), t;
            h = h.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== o.return)
          i = u, o = d;
        else {
          for (var E = !1, C = u.child; C; ) {
            if (C === i) {
              E = !0, i = u, o = d;
              break;
            }
            if (C === o) {
              E = !0, o = u, i = d;
              break;
            }
            C = C.sibling;
          }
          if (!E) {
            for (C = d.child; C; ) {
              if (C === i) {
                E = !0, i = d, o = u;
                break;
              }
              if (C === o) {
                E = !0, o = d, i = u;
                break;
              }
              C = C.sibling;
            }
            if (!E)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== o)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== z)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function ha(e) {
      var t = Dc(e);
      return t !== null ? va(t) : null;
    }
    function va(e) {
      if (e.tag === G || e.tag === re)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = va(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function Pn(e) {
      var t = Dc(e);
      return t !== null ? ri(t) : null;
    }
    function ri(e) {
      if (e.tag === G || e.tag === re)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== Y) {
          var a = ri(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var xd = S.unstable_scheduleCallback, Hm = S.unstable_cancelCallback, Ed = S.unstable_shouldYield, bd = S.unstable_requestPaint, xr = S.unstable_now, Oc = S.unstable_getCurrentPriorityLevel, mu = S.unstable_ImmediatePriority, Vl = S.unstable_UserBlockingPriority, cl = S.unstable_NormalPriority, gy = S.unstable_LowPriority, _o = S.unstable_IdlePriority, Lc = S.unstable_yieldValue, Bm = S.unstable_setDisableYieldValue, wo = null, Zn = null, Pe = null, za = !1, ya = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function Es(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return y("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        te && (e = Ot({}, e, {
          getLaneLabelMap: To,
          injectProfilingHooks: ai
        })), wo = t.inject(e), Zn = t;
      } catch (a) {
        y("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Cd(e, t) {
      if (Zn && typeof Zn.onScheduleFiberRoot == "function")
        try {
          Zn.onScheduleFiberRoot(wo, e, t);
        } catch (a) {
          za || (za = !0, y("React instrumentation encountered an error: %s", a));
        }
    }
    function _d(e, t) {
      if (Zn && typeof Zn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & rt) === rt;
          if (ue) {
            var i;
            switch (t) {
              case qr:
                i = mu;
                break;
              case Bi:
                i = Vl;
                break;
              case ii:
                i = cl;
                break;
              case li:
                i = _o;
                break;
              default:
                i = cl;
                break;
            }
            Zn.onCommitFiberRoot(wo, e, i, a);
          }
        } catch (o) {
          za || (za = !0, y("React instrumentation encountered an error: %s", o));
        }
    }
    function wd(e) {
      if (Zn && typeof Zn.onPostCommitFiberRoot == "function")
        try {
          Zn.onPostCommitFiberRoot(wo, e);
        } catch (t) {
          za || (za = !0, y("React instrumentation encountered an error: %s", t));
        }
    }
    function Td(e) {
      if (Zn && typeof Zn.onCommitFiberUnmount == "function")
        try {
          Zn.onCommitFiberUnmount(wo, e);
        } catch (t) {
          za || (za = !0, y("React instrumentation encountered an error: %s", t));
        }
    }
    function $n(e) {
      if (typeof Lc == "function" && (Bm(e), Z(e)), Zn && typeof Zn.setStrictMode == "function")
        try {
          Zn.setStrictMode(wo, e);
        } catch (t) {
          za || (za = !0, y("React instrumentation encountered an error: %s", t));
        }
    }
    function ai(e) {
      Pe = e;
    }
    function To() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < ko; a++) {
          var i = Ym(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Rd(e) {
      Pe !== null && typeof Pe.markCommitStarted == "function" && Pe.markCommitStarted(e);
    }
    function jd() {
      Pe !== null && typeof Pe.markCommitStopped == "function" && Pe.markCommitStopped();
    }
    function Fa(e) {
      Pe !== null && typeof Pe.markComponentRenderStarted == "function" && Pe.markComponentRenderStarted(e);
    }
    function Pa() {
      Pe !== null && typeof Pe.markComponentRenderStopped == "function" && Pe.markComponentRenderStopped();
    }
    function kd(e) {
      Pe !== null && typeof Pe.markComponentPassiveEffectMountStarted == "function" && Pe.markComponentPassiveEffectMountStarted(e);
    }
    function Vm() {
      Pe !== null && typeof Pe.markComponentPassiveEffectMountStopped == "function" && Pe.markComponentPassiveEffectMountStopped();
    }
    function fl(e) {
      Pe !== null && typeof Pe.markComponentPassiveEffectUnmountStarted == "function" && Pe.markComponentPassiveEffectUnmountStarted(e);
    }
    function Il() {
      Pe !== null && typeof Pe.markComponentPassiveEffectUnmountStopped == "function" && Pe.markComponentPassiveEffectUnmountStopped();
    }
    function Ac(e) {
      Pe !== null && typeof Pe.markComponentLayoutEffectMountStarted == "function" && Pe.markComponentLayoutEffectMountStarted(e);
    }
    function Im() {
      Pe !== null && typeof Pe.markComponentLayoutEffectMountStopped == "function" && Pe.markComponentLayoutEffectMountStopped();
    }
    function hu(e) {
      Pe !== null && typeof Pe.markComponentLayoutEffectUnmountStarted == "function" && Pe.markComponentLayoutEffectUnmountStarted(e);
    }
    function Nd() {
      Pe !== null && typeof Pe.markComponentLayoutEffectUnmountStopped == "function" && Pe.markComponentLayoutEffectUnmountStopped();
    }
    function vu(e, t, a) {
      Pe !== null && typeof Pe.markComponentErrored == "function" && Pe.markComponentErrored(e, t, a);
    }
    function Hi(e, t, a) {
      Pe !== null && typeof Pe.markComponentSuspended == "function" && Pe.markComponentSuspended(e, t, a);
    }
    function yu(e) {
      Pe !== null && typeof Pe.markLayoutEffectsStarted == "function" && Pe.markLayoutEffectsStarted(e);
    }
    function gu() {
      Pe !== null && typeof Pe.markLayoutEffectsStopped == "function" && Pe.markLayoutEffectsStopped();
    }
    function Ro(e) {
      Pe !== null && typeof Pe.markPassiveEffectsStarted == "function" && Pe.markPassiveEffectsStarted(e);
    }
    function Dd() {
      Pe !== null && typeof Pe.markPassiveEffectsStopped == "function" && Pe.markPassiveEffectsStopped();
    }
    function jo(e) {
      Pe !== null && typeof Pe.markRenderStarted == "function" && Pe.markRenderStarted(e);
    }
    function $m() {
      Pe !== null && typeof Pe.markRenderYielded == "function" && Pe.markRenderYielded();
    }
    function Mc() {
      Pe !== null && typeof Pe.markRenderStopped == "function" && Pe.markRenderStopped();
    }
    function Yn(e) {
      Pe !== null && typeof Pe.markRenderScheduled == "function" && Pe.markRenderScheduled(e);
    }
    function Uc(e, t) {
      Pe !== null && typeof Pe.markForceUpdateScheduled == "function" && Pe.markForceUpdateScheduled(e, t);
    }
    function Su(e, t) {
      Pe !== null && typeof Pe.markStateUpdateScheduled == "function" && Pe.markStateUpdateScheduled(e, t);
    }
    var it = (
      /*                         */
      0
    ), Pt = (
      /*                 */
      1
    ), en = (
      /*                    */
      2
    ), yn = (
      /*               */
      8
    ), tn = (
      /*              */
      16
    ), fr = Math.clz32 ? Math.clz32 : xu, _r = Math.log, zc = Math.LN2;
    function xu(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (_r(t) / zc | 0) | 0;
    }
    var ko = 31, ge = (
      /*                        */
      0
    ), Jt = (
      /*                          */
      0
    ), vt = (
      /*                        */
      1
    ), $l = (
      /*    */
      2
    ), xi = (
      /*             */
      4
    ), Yr = (
      /*            */
      8
    ), er = (
      /*                     */
      16
    ), dl = (
      /*                */
      32
    ), Yl = (
      /*                       */
      4194240
    ), No = (
      /*                        */
      64
    ), Fc = (
      /*                        */
      128
    ), Pc = (
      /*                        */
      256
    ), Hc = (
      /*                        */
      512
    ), Bc = (
      /*                        */
      1024
    ), Vc = (
      /*                        */
      2048
    ), Ic = (
      /*                        */
      4096
    ), $c = (
      /*                        */
      8192
    ), Yc = (
      /*                        */
      16384
    ), Do = (
      /*                       */
      32768
    ), Wc = (
      /*                       */
      65536
    ), bs = (
      /*                       */
      131072
    ), Cs = (
      /*                       */
      262144
    ), Qc = (
      /*                       */
      524288
    ), Eu = (
      /*                       */
      1048576
    ), Gc = (
      /*                       */
      2097152
    ), bu = (
      /*                            */
      130023424
    ), Oo = (
      /*                             */
      4194304
    ), Kc = (
      /*                             */
      8388608
    ), Cu = (
      /*                             */
      16777216
    ), qc = (
      /*                             */
      33554432
    ), Xc = (
      /*                             */
      67108864
    ), Od = Oo, _u = (
      /*          */
      134217728
    ), Ld = (
      /*                          */
      268435455
    ), wu = (
      /*               */
      268435456
    ), Lo = (
      /*                        */
      536870912
    ), ga = (
      /*                   */
      1073741824
    );
    function Ym(e) {
      {
        if (e & vt)
          return "Sync";
        if (e & $l)
          return "InputContinuousHydration";
        if (e & xi)
          return "InputContinuous";
        if (e & Yr)
          return "DefaultHydration";
        if (e & er)
          return "Default";
        if (e & dl)
          return "TransitionHydration";
        if (e & Yl)
          return "Transition";
        if (e & bu)
          return "Retry";
        if (e & _u)
          return "SelectiveHydration";
        if (e & wu)
          return "IdleHydration";
        if (e & Lo)
          return "Idle";
        if (e & ga)
          return "Offscreen";
      }
    }
    var wn = -1, Ao = No, Jc = Oo;
    function Tu(e) {
      switch (Wl(e)) {
        case vt:
          return vt;
        case $l:
          return $l;
        case xi:
          return xi;
        case Yr:
          return Yr;
        case er:
          return er;
        case dl:
          return dl;
        case No:
        case Fc:
        case Pc:
        case Hc:
        case Bc:
        case Vc:
        case Ic:
        case $c:
        case Yc:
        case Do:
        case Wc:
        case bs:
        case Cs:
        case Qc:
        case Eu:
        case Gc:
          return e & Yl;
        case Oo:
        case Kc:
        case Cu:
        case qc:
        case Xc:
          return e & bu;
        case _u:
          return _u;
        case wu:
          return wu;
        case Lo:
          return Lo;
        case ga:
          return ga;
        default:
          return y("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Zc(e, t) {
      var a = e.pendingLanes;
      if (a === ge)
        return ge;
      var i = ge, o = e.suspendedLanes, u = e.pingedLanes, d = a & Ld;
      if (d !== ge) {
        var m = d & ~o;
        if (m !== ge)
          i = Tu(m);
        else {
          var h = d & u;
          h !== ge && (i = Tu(h));
        }
      } else {
        var E = a & ~o;
        E !== ge ? i = Tu(E) : u !== ge && (i = Tu(u));
      }
      if (i === ge)
        return ge;
      if (t !== ge && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & o) === ge) {
        var C = Wl(i), M = Wl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          C >= M || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          C === er && (M & Yl) !== ge
        )
          return t;
      }
      (i & xi) !== ge && (i |= a & er);
      var L = e.entangledLanes;
      if (L !== ge)
        for (var Q = e.entanglements, X = i & L; X > 0; ) {
          var ae = dr(X), He = 1 << ae;
          i |= Q[ae], X &= ~He;
        }
      return i;
    }
    function Ei(e, t) {
      for (var a = e.eventTimes, i = wn; t > 0; ) {
        var o = dr(t), u = 1 << o, d = a[o];
        d > i && (i = d), t &= ~u;
      }
      return i;
    }
    function Ad(e, t) {
      switch (e) {
        case vt:
        case $l:
        case xi:
          return t + 250;
        case Yr:
        case er:
        case dl:
        case No:
        case Fc:
        case Pc:
        case Hc:
        case Bc:
        case Vc:
        case Ic:
        case $c:
        case Yc:
        case Do:
        case Wc:
        case bs:
        case Cs:
        case Qc:
        case Eu:
        case Gc:
          return t + 5e3;
        case Oo:
        case Kc:
        case Cu:
        case qc:
        case Xc:
          return wn;
        case _u:
        case wu:
        case Lo:
        case ga:
          return wn;
        default:
          return y("Should have found matching lanes. This is a bug in React."), wn;
      }
    }
    function ef(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, o = e.pingedLanes, u = e.expirationTimes, d = a; d > 0; ) {
        var m = dr(d), h = 1 << m, E = u[m];
        E === wn ? ((h & i) === ge || (h & o) !== ge) && (u[m] = Ad(h, t)) : E <= t && (e.expiredLanes |= h), d &= ~h;
      }
    }
    function Wm(e) {
      return Tu(e.pendingLanes);
    }
    function tf(e) {
      var t = e.pendingLanes & ~ga;
      return t !== ge ? t : t & ga ? ga : ge;
    }
    function Qm(e) {
      return (e & vt) !== ge;
    }
    function Ru(e) {
      return (e & Ld) !== ge;
    }
    function Mo(e) {
      return (e & bu) === e;
    }
    function Md(e) {
      var t = vt | xi | er;
      return (e & t) === ge;
    }
    function Ud(e) {
      return (e & Yl) === e;
    }
    function nf(e, t) {
      var a = $l | xi | Yr | er;
      return (t & a) !== ge;
    }
    function Gm(e, t) {
      return (t & e.expiredLanes) !== ge;
    }
    function zd(e) {
      return (e & Yl) !== ge;
    }
    function Fd() {
      var e = Ao;
      return Ao <<= 1, (Ao & Yl) === ge && (Ao = No), e;
    }
    function Km() {
      var e = Jc;
      return Jc <<= 1, (Jc & bu) === ge && (Jc = Oo), e;
    }
    function Wl(e) {
      return e & -e;
    }
    function ju(e) {
      return Wl(e);
    }
    function dr(e) {
      return 31 - fr(e);
    }
    function Or(e) {
      return dr(e);
    }
    function Sa(e, t) {
      return (e & t) !== ge;
    }
    function Uo(e, t) {
      return (e & t) === t;
    }
    function At(e, t) {
      return e | t;
    }
    function ku(e, t) {
      return e & ~t;
    }
    function Pd(e, t) {
      return e & t;
    }
    function qm(e) {
      return e;
    }
    function Xm(e, t) {
      return e !== Jt && e < t ? e : t;
    }
    function Nu(e) {
      for (var t = [], a = 0; a < ko; a++)
        t.push(e);
      return t;
    }
    function _s(e, t, a) {
      e.pendingLanes |= t, t !== Lo && (e.suspendedLanes = ge, e.pingedLanes = ge);
      var i = e.eventTimes, o = Or(t);
      i[o] = a;
    }
    function Jm(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var o = dr(i), u = 1 << o;
        a[o] = wn, i &= ~u;
      }
    }
    function rf(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Hd(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = ge, e.pingedLanes = ge, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, o = e.eventTimes, u = e.expirationTimes, d = a; d > 0; ) {
        var m = dr(d), h = 1 << m;
        i[m] = ge, o[m] = wn, u[m] = wn, d &= ~h;
      }
    }
    function af(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, o = a; o; ) {
        var u = dr(o), d = 1 << u;
        // Is this one of the newly entangled lanes?
        d & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[u] & t && (i[u] |= t), o &= ~d;
      }
    }
    function Bd(e, t) {
      var a = Wl(t), i;
      switch (a) {
        case xi:
          i = $l;
          break;
        case er:
          i = Yr;
          break;
        case No:
        case Fc:
        case Pc:
        case Hc:
        case Bc:
        case Vc:
        case Ic:
        case $c:
        case Yc:
        case Do:
        case Wc:
        case bs:
        case Cs:
        case Qc:
        case Eu:
        case Gc:
        case Oo:
        case Kc:
        case Cu:
        case qc:
        case Xc:
          i = dl;
          break;
        case Lo:
          i = wu;
          break;
        default:
          i = Jt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Jt ? Jt : i;
    }
    function Du(e, t, a) {
      if (ya)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var o = Or(a), u = 1 << o, d = i[o];
          d.add(t), a &= ~u;
        }
    }
    function Zm(e, t) {
      if (ya)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var o = Or(t), u = 1 << o, d = a[o];
          d.size > 0 && (d.forEach(function(m) {
            var h = m.alternate;
            (h === null || !i.has(h)) && i.add(m);
          }), d.clear()), t &= ~u;
        }
    }
    function Vd(e, t) {
      return null;
    }
    var qr = vt, Bi = xi, ii = er, li = Lo, Ou = Jt;
    function oi() {
      return Ou;
    }
    function pr(e) {
      Ou = e;
    }
    function eh(e, t) {
      var a = Ou;
      try {
        return Ou = e, t();
      } finally {
        Ou = a;
      }
    }
    function th(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Lu(e, t) {
      return e > t ? e : t;
    }
    function wr(e, t) {
      return e !== 0 && e < t;
    }
    function nh(e) {
      var t = Wl(e);
      return wr(qr, t) ? wr(Bi, t) ? Ru(t) ? ii : li : Bi : qr;
    }
    function lf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Au;
    function Wr(e) {
      Au = e;
    }
    function Sy(e) {
      Au(e);
    }
    var Ke;
    function ws(e) {
      Ke = e;
    }
    var of;
    function rh(e) {
      of = e;
    }
    var ah;
    function Mu(e) {
      ah = e;
    }
    var Uu;
    function Id(e) {
      Uu = e;
    }
    var sf = !1, zu = [], pl = null, Vi = null, Ii = null, tr = /* @__PURE__ */ new Map(), Xr = /* @__PURE__ */ new Map(), Jr = [], ih = [
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
    function lh(e) {
      return ih.indexOf(e) > -1;
    }
    function bi(e, t, a, i, o) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: o,
        targetContainers: [i]
      };
    }
    function $d(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          pl = null;
          break;
        case "dragenter":
        case "dragleave":
          Vi = null;
          break;
        case "mouseover":
        case "mouseout":
          Ii = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          tr.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Xr.delete(i);
          break;
        }
      }
    }
    function xa(e, t, a, i, o, u) {
      if (e === null || e.nativeEvent !== u) {
        var d = bi(t, a, i, o, u);
        if (t !== null) {
          var m = As(t);
          m !== null && Ke(m);
        }
        return d;
      }
      e.eventSystemFlags |= i;
      var h = e.targetContainers;
      return o !== null && h.indexOf(o) === -1 && h.push(o), e;
    }
    function xy(e, t, a, i, o) {
      switch (t) {
        case "focusin": {
          var u = o;
          return pl = xa(pl, e, t, a, i, u), !0;
        }
        case "dragenter": {
          var d = o;
          return Vi = xa(Vi, e, t, a, i, d), !0;
        }
        case "mouseover": {
          var m = o;
          return Ii = xa(Ii, e, t, a, i, m), !0;
        }
        case "pointerover": {
          var h = o, E = h.pointerId;
          return tr.set(E, xa(tr.get(E) || null, e, t, a, i, h)), !0;
        }
        case "gotpointercapture": {
          var C = o, M = C.pointerId;
          return Xr.set(M, xa(Xr.get(M) || null, e, t, a, i, C)), !0;
        }
      }
      return !1;
    }
    function Yd(e) {
      var t = Ku(e.target);
      if (t !== null) {
        var a = Ua(t);
        if (a !== null) {
          var i = a.tag;
          if (i === ce) {
            var o = Fi(a);
            if (o !== null) {
              e.blockedOn = o, Uu(e.priority, function() {
                of(a);
              });
              return;
            }
          } else if (i === z) {
            var u = a.stateNode;
            if (lf(u)) {
              e.blockedOn = Pi(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function oh(e) {
      for (var t = ah(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Jr.length && wr(t, Jr[i].priority); i++)
        ;
      Jr.splice(i, 0, a), i === 0 && Yd(a);
    }
    function Fu(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Rs(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var o = e.nativeEvent, u = new o.constructor(o.type, o);
          my(u), o.target.dispatchEvent(u), hy();
        } else {
          var d = As(i);
          return d !== null && Ke(d), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Wd(e, t, a) {
      Fu(e) && a.delete(t);
    }
    function Ey() {
      sf = !1, pl !== null && Fu(pl) && (pl = null), Vi !== null && Fu(Vi) && (Vi = null), Ii !== null && Fu(Ii) && (Ii = null), tr.forEach(Wd), Xr.forEach(Wd);
    }
    function Ql(e, t) {
      e.blockedOn === t && (e.blockedOn = null, sf || (sf = !0, S.unstable_scheduleCallback(S.unstable_NormalPriority, Ey)));
    }
    function zo(e) {
      if (zu.length > 0) {
        Ql(zu[0], e);
        for (var t = 1; t < zu.length; t++) {
          var a = zu[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      pl !== null && Ql(pl, e), Vi !== null && Ql(Vi, e), Ii !== null && Ql(Ii, e);
      var i = function(m) {
        return Ql(m, e);
      };
      tr.forEach(i), Xr.forEach(i);
      for (var o = 0; o < Jr.length; o++) {
        var u = Jr[o];
        u.blockedOn === e && (u.blockedOn = null);
      }
      for (; Jr.length > 0; ) {
        var d = Jr[0];
        if (d.blockedOn !== null)
          break;
        Yd(d), d.blockedOn === null && Jr.shift();
      }
    }
    var Lr = b.ReactCurrentBatchConfig, Wt = !0;
    function Er(e) {
      Wt = !!e;
    }
    function mr() {
      return Wt;
    }
    function Ar(e, t, a) {
      var i = uf(t), o;
      switch (i) {
        case qr:
          o = Ha;
          break;
        case Bi:
          o = Ts;
          break;
        case ii:
        default:
          o = nr;
          break;
      }
      return o.bind(null, t, a, e);
    }
    function Ha(e, t, a, i) {
      var o = oi(), u = Lr.transition;
      Lr.transition = null;
      try {
        pr(qr), nr(e, t, a, i);
      } finally {
        pr(o), Lr.transition = u;
      }
    }
    function Ts(e, t, a, i) {
      var o = oi(), u = Lr.transition;
      Lr.transition = null;
      try {
        pr(Bi), nr(e, t, a, i);
      } finally {
        pr(o), Lr.transition = u;
      }
    }
    function nr(e, t, a, i) {
      Wt && Pu(e, t, a, i);
    }
    function Pu(e, t, a, i) {
      var o = Rs(e, t, a, i);
      if (o === null) {
        Fy(e, t, i, $i, a), $d(e, i);
        return;
      }
      if (xy(o, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if ($d(e, i), t & Za && lh(e)) {
        for (; o !== null; ) {
          var u = As(o);
          u !== null && Sy(u);
          var d = Rs(e, t, a, i);
          if (d === null && Fy(e, t, i, $i, a), d === o)
            break;
          o = d;
        }
        o !== null && i.stopPropagation();
        return;
      }
      Fy(e, t, i, null, a);
    }
    var $i = null;
    function Rs(e, t, a, i) {
      $i = null;
      var o = gd(i), u = Ku(o);
      if (u !== null) {
        var d = Ua(u);
        if (d === null)
          u = null;
        else {
          var m = d.tag;
          if (m === ce) {
            var h = Fi(d);
            if (h !== null)
              return h;
            u = null;
          } else if (m === z) {
            var E = d.stateNode;
            if (lf(E))
              return Pi(d);
            u = null;
          } else d !== u && (u = null);
        }
      }
      return $i = u, null;
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
          return qr;
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
          return Bi;
        case "message": {
          var t = Oc();
          switch (t) {
            case mu:
              return qr;
            case Vl:
              return Bi;
            case cl:
            case gy:
              return ii;
            case _o:
              return li;
            default:
              return ii;
          }
        }
        default:
          return ii;
      }
    }
    function Hu(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function Ea(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Qd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function js(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var Ba = null, ks = null, Fo = null;
    function Gl(e) {
      return Ba = e, ks = Bu(), !0;
    }
    function cf() {
      Ba = null, ks = null, Fo = null;
    }
    function ml() {
      if (Fo)
        return Fo;
      var e, t = ks, a = t.length, i, o = Bu(), u = o.length;
      for (e = 0; e < a && t[e] === o[e]; e++)
        ;
      var d = a - e;
      for (i = 1; i <= d && t[a - i] === o[u - i]; i++)
        ;
      var m = i > 1 ? 1 - i : void 0;
      return Fo = o.slice(e, m), Fo;
    }
    function Bu() {
      return "value" in Ba ? Ba.value : Ba.textContent;
    }
    function Kl(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function Ns() {
      return !0;
    }
    function Vu() {
      return !1;
    }
    function Qr(e) {
      function t(a, i, o, u, d) {
        this._reactName = a, this._targetInst = o, this.type = i, this.nativeEvent = u, this.target = d, this.currentTarget = null;
        for (var m in e)
          if (e.hasOwnProperty(m)) {
            var h = e[m];
            h ? this[m] = h(u) : this[m] = u[m];
          }
        var E = u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1;
        return E ? this.isDefaultPrevented = Ns : this.isDefaultPrevented = Vu, this.isPropagationStopped = Vu, this;
      }
      return Ot(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Ns);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Ns);
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
        isPersistent: Ns
      }), t;
    }
    var hr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Yi = Qr(hr), Zr = Ot({}, hr, {
      view: 0,
      detail: 0
    }), ba = Qr(Zr), ff, Iu, Po;
    function by(e) {
      e !== Po && (Po && e.type === "mousemove" ? (ff = e.screenX - Po.screenX, Iu = e.screenY - Po.screenY) : (ff = 0, Iu = 0), Po = e);
    }
    var Ci = Ot({}, Zr, {
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
      getModifierState: Hn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (by(e), ff);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Iu;
      }
    }), Gd = Qr(Ci), Kd = Ot({}, Ci, {
      dataTransfer: 0
    }), Ho = Qr(Kd), qd = Ot({}, Zr, {
      relatedTarget: 0
    }), hl = Qr(qd), sh = Ot({}, hr, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), uh = Qr(sh), Xd = Ot({}, hr, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), df = Qr(Xd), Cy = Ot({}, hr, {
      data: 0
    }), ch = Qr(Cy), fh = ch, dh = {
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
    }, Bo = {
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
    function _y(e) {
      if (e.key) {
        var t = dh[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Kl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Bo[e.keyCode] || "Unidentified" : "";
    }
    var Ds = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function ph(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = Ds[e];
      return i ? !!a[i] : !1;
    }
    function Hn(e) {
      return ph;
    }
    var wy = Ot({}, Zr, {
      key: _y,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Hn,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Kl(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Kl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), mh = Qr(wy), Ty = Ot({}, Ci, {
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
    }), hh = Qr(Ty), vh = Ot({}, Zr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Hn
    }), yh = Qr(vh), Ry = Ot({}, hr, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), si = Qr(Ry), Jd = Ot({}, Ci, {
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
    }), jy = Qr(Jd), ql = [9, 13, 27, 32], $u = 229, vl = Dn && "CompositionEvent" in window, Xl = null;
    Dn && "documentMode" in document && (Xl = document.documentMode);
    var Zd = Dn && "TextEvent" in window && !Xl, pf = Dn && (!vl || Xl && Xl > 8 && Xl <= 11), gh = 32, mf = String.fromCharCode(gh);
    function ky() {
      gt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), gt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), gt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), gt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var ep = !1;
    function Sh(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function hf(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function vf(e, t) {
      return e === "keydown" && t.keyCode === $u;
    }
    function tp(e, t) {
      switch (e) {
        case "keyup":
          return ql.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== $u;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function yf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function xh(e) {
      return e.locale === "ko";
    }
    var Vo = !1;
    function np(e, t, a, i, o) {
      var u, d;
      if (vl ? u = hf(t) : Vo ? tp(t, i) && (u = "onCompositionEnd") : vf(t, i) && (u = "onCompositionStart"), !u)
        return null;
      pf && !xh(i) && (!Vo && u === "onCompositionStart" ? Vo = Gl(o) : u === "onCompositionEnd" && Vo && (d = ml()));
      var m = Rh(a, u);
      if (m.length > 0) {
        var h = new ch(u, t, null, i, o);
        if (e.push({
          event: h,
          listeners: m
        }), d)
          h.data = d;
        else {
          var E = yf(i);
          E !== null && (h.data = E);
        }
      }
    }
    function gf(e, t) {
      switch (e) {
        case "compositionend":
          return yf(t);
        case "keypress":
          var a = t.which;
          return a !== gh ? null : (ep = !0, mf);
        case "textInput":
          var i = t.data;
          return i === mf && ep ? null : i;
        default:
          return null;
      }
    }
    function rp(e, t) {
      if (Vo) {
        if (e === "compositionend" || !vl && tp(e, t)) {
          var a = ml();
          return cf(), Vo = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!Sh(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return pf && !xh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function Sf(e, t, a, i, o) {
      var u;
      if (Zd ? u = gf(t, i) : u = rp(t, i), !u)
        return null;
      var d = Rh(a, "onBeforeInput");
      if (d.length > 0) {
        var m = new fh("onBeforeInput", "beforeinput", null, i, o);
        e.push({
          event: m,
          listeners: d
        }), m.data = u;
      }
    }
    function Eh(e, t, a, i, o, u, d) {
      np(e, t, a, i, o), Sf(e, t, a, i, o);
    }
    var Ny = {
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
    function Yu(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Ny[e.type] : t === "textarea";
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
      if (!Dn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Wu() {
      gt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function bh(e, t, a, i) {
      ms(i);
      var o = Rh(t, "onChange");
      if (o.length > 0) {
        var u = new Yi("onChange", "change", null, a, i);
        e.push({
          event: u,
          listeners: o
        });
      }
    }
    var Jl = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      bh(t, n, e, gd(e)), Am(s, t);
    }
    function s(e) {
      Wx(e, 0);
    }
    function f(e) {
      var t = wf(e);
      if (Oi(t))
        return e;
    }
    function p(e, t) {
      if (e === "change")
        return t;
    }
    var g = !1;
    Dn && (g = Dy("input") && (!document.documentMode || document.documentMode > 9));
    function _(e, t) {
      Jl = e, n = t, Jl.attachEvent("onpropertychange", q);
    }
    function D() {
      Jl && (Jl.detachEvent("onpropertychange", q), Jl = null, n = null);
    }
    function q(e) {
      e.propertyName === "value" && f(n) && l(e);
    }
    function be(e, t, a) {
      e === "focusin" ? (D(), _(t, a)) : e === "focusout" && D();
    }
    function we(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return f(n);
    }
    function xe(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Ye(e, t) {
      if (e === "click")
        return f(t);
    }
    function qe(e, t) {
      if (e === "input" || e === "change")
        return f(t);
    }
    function tt(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || ot(e, "number", e.value);
    }
    function rr(e, t, a, i, o, u, d) {
      var m = a ? wf(a) : window, h, E;
      if (r(m) ? h = p : Yu(m) ? g ? h = qe : (h = we, E = be) : xe(m) && (h = Ye), h) {
        var C = h(t, a);
        if (C) {
          bh(e, C, i, o);
          return;
        }
      }
      E && E(t, m, a), t === "focusout" && tt(m);
    }
    function F() {
      $t("onMouseEnter", ["mouseout", "mouseover"]), $t("onMouseLeave", ["mouseout", "mouseover"]), $t("onPointerEnter", ["pointerout", "pointerover"]), $t("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function A(e, t, a, i, o, u, d) {
      var m = t === "mouseover" || t === "pointerover", h = t === "mouseout" || t === "pointerout";
      if (m && !su(i)) {
        var E = i.relatedTarget || i.fromElement;
        if (E && (Ku(E) || yp(E)))
          return;
      }
      if (!(!h && !m)) {
        var C;
        if (o.window === o)
          C = o;
        else {
          var M = o.ownerDocument;
          M ? C = M.defaultView || M.parentWindow : C = window;
        }
        var L, Q;
        if (h) {
          var X = i.relatedTarget || i.toElement;
          if (L = a, Q = X ? Ku(X) : null, Q !== null) {
            var ae = Ua(Q);
            (Q !== ae || Q.tag !== G && Q.tag !== re) && (Q = null);
          }
        } else
          L = null, Q = a;
        if (L !== Q) {
          var He = Gd, st = "onMouseLeave", nt = "onMouseEnter", Gt = "mouse";
          (t === "pointerout" || t === "pointerover") && (He = hh, st = "onPointerLeave", nt = "onPointerEnter", Gt = "pointer");
          var Vt = L == null ? C : wf(L), H = Q == null ? C : wf(Q), ie = new He(st, Gt + "leave", L, i, o);
          ie.target = Vt, ie.relatedTarget = H;
          var B = null, Te = Ku(o);
          if (Te === a) {
            var Ge = new He(nt, Gt + "enter", Q, i, o);
            Ge.target = H, Ge.relatedTarget = Vt, B = Ge;
          }
          ow(e, ie, B, L, Q);
        }
      }
    }
    function $(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var Ce = typeof Object.is == "function" ? Object.is : $;
    function Xe(e, t) {
      if (Ce(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var o = 0; o < a.length; o++) {
        var u = a[o];
        if (!qn.call(t, u) || !Ce(e[u], t[u]))
          return !1;
      }
      return !0;
    }
    function ut(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function dt(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function wt(e, t) {
      for (var a = ut(e), i = 0, o = 0; a; ) {
        if (a.nodeType === il) {
          if (o = i + a.textContent.length, i <= t && o >= t)
            return {
              node: a,
              offset: t - i
            };
          i = o;
        }
        a = ut(dt(a));
      }
    }
    function Tr(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var o = i.anchorNode, u = i.anchorOffset, d = i.focusNode, m = i.focusOffset;
      try {
        o.nodeType, d.nodeType;
      } catch {
        return null;
      }
      return nn(e, o, u, d, m);
    }
    function nn(e, t, a, i, o) {
      var u = 0, d = -1, m = -1, h = 0, E = 0, C = e, M = null;
      e: for (; ; ) {
        for (var L = null; C === t && (a === 0 || C.nodeType === il) && (d = u + a), C === i && (o === 0 || C.nodeType === il) && (m = u + o), C.nodeType === il && (u += C.nodeValue.length), (L = C.firstChild) !== null; )
          M = C, C = L;
        for (; ; ) {
          if (C === e)
            break e;
          if (M === t && ++h === a && (d = u), M === i && ++E === o && (m = u), (L = C.nextSibling) !== null)
            break;
          C = M, M = C.parentNode;
        }
        C = L;
      }
      return d === -1 || m === -1 ? null : {
        start: d,
        end: m
      };
    }
    function Zl(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var o = i.getSelection(), u = e.textContent.length, d = Math.min(t.start, u), m = t.end === void 0 ? d : Math.min(t.end, u);
        if (!o.extend && d > m) {
          var h = m;
          m = d, d = h;
        }
        var E = wt(e, d), C = wt(e, m);
        if (E && C) {
          if (o.rangeCount === 1 && o.anchorNode === E.node && o.anchorOffset === E.offset && o.focusNode === C.node && o.focusOffset === C.offset)
            return;
          var M = a.createRange();
          M.setStart(E.node, E.offset), o.removeAllRanges(), d > m ? (o.addRange(M), o.extend(C.node, C.offset)) : (M.setEnd(C.node, C.offset), o.addRange(M));
        }
      }
    }
    function Ch(e) {
      return e && e.nodeType === il;
    }
    function Mx(e, t) {
      return !e || !t ? !1 : e === t ? !0 : Ch(e) ? !1 : Ch(t) ? Mx(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function I_(e) {
      return e && e.ownerDocument && Mx(e.ownerDocument.documentElement, e);
    }
    function $_(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function Ux() {
      for (var e = window, t = Ja(); t instanceof e.HTMLIFrameElement; ) {
        if ($_(t))
          e = t.contentWindow;
        else
          return t;
        t = Ja(e.document);
      }
      return t;
    }
    function Oy(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function Y_() {
      var e = Ux();
      return {
        focusedElem: e,
        selectionRange: Oy(e) ? Q_(e) : null
      };
    }
    function W_(e) {
      var t = Ux(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && I_(a)) {
        i !== null && Oy(a) && G_(a, i);
        for (var o = [], u = a; u = u.parentNode; )
          u.nodeType === da && o.push({
            element: u,
            left: u.scrollLeft,
            top: u.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var d = 0; d < o.length; d++) {
          var m = o[d];
          m.element.scrollLeft = m.left, m.element.scrollTop = m.top;
        }
      }
    }
    function Q_(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = Tr(e), t || {
        start: 0,
        end: 0
      };
    }
    function G_(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Zl(e, t);
    }
    var K_ = Dn && "documentMode" in document && document.documentMode <= 11;
    function q_() {
      gt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var xf = null, Ly = null, ap = null, Ay = !1;
    function X_(e) {
      if ("selectionStart" in e && Oy(e))
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
    function J_(e) {
      return e.window === e ? e.document : e.nodeType === ll ? e : e.ownerDocument;
    }
    function zx(e, t, a) {
      var i = J_(a);
      if (!(Ay || xf == null || xf !== Ja(i))) {
        var o = X_(xf);
        if (!ap || !Xe(ap, o)) {
          ap = o;
          var u = Rh(Ly, "onSelect");
          if (u.length > 0) {
            var d = new Yi("onSelect", "select", null, t, a);
            e.push({
              event: d,
              listeners: u
            }), d.target = xf;
          }
        }
      }
    }
    function Z_(e, t, a, i, o, u, d) {
      var m = a ? wf(a) : window;
      switch (t) {
        case "focusin":
          (Yu(m) || m.contentEditable === "true") && (xf = m, Ly = a, ap = null);
          break;
        case "focusout":
          xf = null, Ly = null, ap = null;
          break;
        case "mousedown":
          Ay = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Ay = !1, zx(e, i, o);
          break;
        case "selectionchange":
          if (K_)
            break;
        case "keydown":
        case "keyup":
          zx(e, i, o);
      }
    }
    function _h(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var Ef = {
      animationend: _h("Animation", "AnimationEnd"),
      animationiteration: _h("Animation", "AnimationIteration"),
      animationstart: _h("Animation", "AnimationStart"),
      transitionend: _h("Transition", "TransitionEnd")
    }, My = {}, Fx = {};
    Dn && (Fx = document.createElement("div").style, "AnimationEvent" in window || (delete Ef.animationend.animation, delete Ef.animationiteration.animation, delete Ef.animationstart.animation), "TransitionEvent" in window || delete Ef.transitionend.transition);
    function wh(e) {
      if (My[e])
        return My[e];
      if (!Ef[e])
        return e;
      var t = Ef[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in Fx)
          return My[e] = t[a];
      return e;
    }
    var Px = wh("animationend"), Hx = wh("animationiteration"), Bx = wh("animationstart"), Vx = wh("transitionend"), Ix = /* @__PURE__ */ new Map(), $x = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function Os(e, t) {
      Ix.set(e, t), gt(t, [e]);
    }
    function ew() {
      for (var e = 0; e < $x.length; e++) {
        var t = $x[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        Os(a, "on" + i);
      }
      Os(Px, "onAnimationEnd"), Os(Hx, "onAnimationIteration"), Os(Bx, "onAnimationStart"), Os("dblclick", "onDoubleClick"), Os("focusin", "onFocus"), Os("focusout", "onBlur"), Os(Vx, "onTransitionEnd");
    }
    function tw(e, t, a, i, o, u, d) {
      var m = Ix.get(t);
      if (m !== void 0) {
        var h = Yi, E = t;
        switch (t) {
          case "keypress":
            if (Kl(i) === 0)
              return;
          case "keydown":
          case "keyup":
            h = mh;
            break;
          case "focusin":
            E = "focus", h = hl;
            break;
          case "focusout":
            E = "blur", h = hl;
            break;
          case "beforeblur":
          case "afterblur":
            h = hl;
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
            h = Gd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            h = Ho;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            h = yh;
            break;
          case Px:
          case Hx:
          case Bx:
            h = uh;
            break;
          case Vx:
            h = si;
            break;
          case "scroll":
            h = ba;
            break;
          case "wheel":
            h = jy;
            break;
          case "copy":
          case "cut":
          case "paste":
            h = df;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            h = hh;
            break;
        }
        var C = (u & Za) !== 0;
        {
          var M = !C && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", L = iw(a, m, i.type, C, M);
          if (L.length > 0) {
            var Q = new h(m, E, null, i, o);
            e.push({
              event: Q,
              listeners: L
            });
          }
        }
      }
    }
    ew(), F(), Wu(), q_(), ky();
    function nw(e, t, a, i, o, u, d) {
      tw(e, t, a, i, o, u);
      var m = (u & yd) === 0;
      m && (A(e, t, a, i, o), rr(e, t, a, i, o), Z_(e, t, a, i, o), Eh(e, t, a, i, o));
    }
    var ip = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Uy = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(ip));
    function Yx(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Mi(i, t, void 0, e), e.currentTarget = null;
    }
    function rw(e, t, a) {
      var i;
      if (a)
        for (var o = t.length - 1; o >= 0; o--) {
          var u = t[o], d = u.instance, m = u.currentTarget, h = u.listener;
          if (d !== i && e.isPropagationStopped())
            return;
          Yx(e, h, m), i = d;
        }
      else
        for (var E = 0; E < t.length; E++) {
          var C = t[E], M = C.instance, L = C.currentTarget, Q = C.listener;
          if (M !== i && e.isPropagationStopped())
            return;
          Yx(e, Q, L), i = M;
        }
    }
    function Wx(e, t) {
      for (var a = (t & Za) !== 0, i = 0; i < e.length; i++) {
        var o = e[i], u = o.event, d = o.listeners;
        rw(u, d, a);
      }
      fu();
    }
    function aw(e, t, a, i, o) {
      var u = gd(a), d = [];
      nw(d, e, i, a, u, t), Wx(d, t);
    }
    function Wn(e, t) {
      Uy.has(e) || y('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = A0(t), o = sw(e);
      i.has(o) || (Qx(t, e, Sc, a), i.add(o));
    }
    function zy(e, t, a) {
      Uy.has(e) && !t && y('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Za), Qx(a, e, i, t);
    }
    var Th = "_reactListening" + Math.random().toString(36).slice(2);
    function lp(e) {
      if (!e[Th]) {
        e[Th] = !0, Tt.forEach(function(a) {
          a !== "selectionchange" && (Uy.has(a) || zy(a, !1, e), zy(a, !0, e));
        });
        var t = e.nodeType === ll ? e : e.ownerDocument;
        t !== null && (t[Th] || (t[Th] = !0, zy("selectionchange", !1, t)));
      }
    }
    function Qx(e, t, a, i, o) {
      var u = Ar(e, t, a), d = void 0;
      cu && (t === "touchstart" || t === "touchmove" || t === "wheel") && (d = !0), e = e, i ? d !== void 0 ? Qd(e, t, u, d) : Ea(e, t, u) : d !== void 0 ? js(e, t, u, d) : Hu(e, t, u);
    }
    function Gx(e, t) {
      return e === t || e.nodeType === sr && e.parentNode === t;
    }
    function Fy(e, t, a, i, o) {
      var u = i;
      if (!(t & vd) && !(t & Sc)) {
        var d = o;
        if (i !== null) {
          var m = i;
          e: for (; ; ) {
            if (m === null)
              return;
            var h = m.tag;
            if (h === z || h === Y) {
              var E = m.stateNode.containerInfo;
              if (Gx(E, d))
                break;
              if (h === Y)
                for (var C = m.return; C !== null; ) {
                  var M = C.tag;
                  if (M === z || M === Y) {
                    var L = C.stateNode.containerInfo;
                    if (Gx(L, d))
                      return;
                  }
                  C = C.return;
                }
              for (; E !== null; ) {
                var Q = Ku(E);
                if (Q === null)
                  return;
                var X = Q.tag;
                if (X === G || X === re) {
                  m = u = Q;
                  continue e;
                }
                E = E.parentNode;
              }
            }
            m = m.return;
          }
        }
      }
      Am(function() {
        return aw(e, t, a, u);
      });
    }
    function op(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function iw(e, t, a, i, o, u) {
      for (var d = t !== null ? t + "Capture" : null, m = i ? d : t, h = [], E = e, C = null; E !== null; ) {
        var M = E, L = M.stateNode, Q = M.tag;
        if (Q === G && L !== null && (C = L, m !== null)) {
          var X = Ul(E, m);
          X != null && h.push(op(E, X, C));
        }
        if (o)
          break;
        E = E.return;
      }
      return h;
    }
    function Rh(e, t) {
      for (var a = t + "Capture", i = [], o = e; o !== null; ) {
        var u = o, d = u.stateNode, m = u.tag;
        if (m === G && d !== null) {
          var h = d, E = Ul(o, a);
          E != null && i.unshift(op(o, E, h));
          var C = Ul(o, t);
          C != null && i.push(op(o, C, h));
        }
        o = o.return;
      }
      return i;
    }
    function bf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== G);
      return e || null;
    }
    function lw(e, t) {
      for (var a = e, i = t, o = 0, u = a; u; u = bf(u))
        o++;
      for (var d = 0, m = i; m; m = bf(m))
        d++;
      for (; o - d > 0; )
        a = bf(a), o--;
      for (; d - o > 0; )
        i = bf(i), d--;
      for (var h = o; h--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = bf(a), i = bf(i);
      }
      return null;
    }
    function Kx(e, t, a, i, o) {
      for (var u = t._reactName, d = [], m = a; m !== null && m !== i; ) {
        var h = m, E = h.alternate, C = h.stateNode, M = h.tag;
        if (E !== null && E === i)
          break;
        if (M === G && C !== null) {
          var L = C;
          if (o) {
            var Q = Ul(m, u);
            Q != null && d.unshift(op(m, Q, L));
          } else if (!o) {
            var X = Ul(m, u);
            X != null && d.push(op(m, X, L));
          }
        }
        m = m.return;
      }
      d.length !== 0 && e.push({
        event: t,
        listeners: d
      });
    }
    function ow(e, t, a, i, o) {
      var u = i && o ? lw(i, o) : null;
      i !== null && Kx(e, t, i, u, !1), o !== null && a !== null && Kx(e, a, o, u, !0);
    }
    function sw(e, t) {
      return e + "__bubble";
    }
    var ui = !1, sp = "dangerouslySetInnerHTML", jh = "suppressContentEditableWarning", Ls = "suppressHydrationWarning", qx = "autoFocus", Qu = "children", Gu = "style", kh = "__html", Py, Nh, up, Xx, Dh, Jx, Zx;
    Py = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Nh = function(e, t) {
      pd(e, t), yc(e, t), Dm(e, t, {
        registrationNameDependencies: yt,
        possibleRegistrationNames: mt
      });
    }, Jx = Dn && !document.documentMode, up = function(e, t, a) {
      if (!ui) {
        var i = Oh(a), o = Oh(t);
        o !== i && (ui = !0, y("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(o), JSON.stringify(i)));
      }
    }, Xx = function(e) {
      if (!ui) {
        ui = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), y("Extra attributes from the server: %s", t);
      }
    }, Dh = function(e, t) {
      t === !1 ? y("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : y("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, Zx = function(e, t) {
      var a = e.namespaceURI === al ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var uw = /\r\n?/g, cw = /\u0000|\uFFFD/g;
    function Oh(e) {
      An(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(uw, `
`).replace(cw, "");
    }
    function Lh(e, t, a, i) {
      var o = Oh(t), u = Oh(e);
      if (u !== o && (i && (ui || (ui = !0, y('Text content did not match. Server: "%s" Client: "%s"', u, o))), a && je))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function eE(e) {
      return e.nodeType === ll ? e : e.ownerDocument;
    }
    function fw() {
    }
    function Ah(e) {
      e.onclick = fw;
    }
    function dw(e, t, a, i, o) {
      for (var u in i)
        if (i.hasOwnProperty(u)) {
          var d = i[u];
          if (u === Gu)
            d && Object.freeze(d), wm(t, d);
          else if (u === sp) {
            var m = d ? d[kh] : void 0;
            m != null && pm(t, m);
          } else if (u === Qu)
            if (typeof d == "string") {
              var h = e !== "textarea" || d !== "";
              h && cs(t, d);
            } else typeof d == "number" && cs(t, "" + d);
          else u === jh || u === Ls || u === qx || (yt.hasOwnProperty(u) ? d != null && (typeof d != "function" && Dh(u, d), u === "onScroll" && Wn("scroll", t)) : d != null && ir(t, u, d, o));
        }
    }
    function pw(e, t, a, i) {
      for (var o = 0; o < t.length; o += 2) {
        var u = t[o], d = t[o + 1];
        u === Gu ? wm(e, d) : u === sp ? pm(e, d) : u === Qu ? cs(e, d) : ir(e, u, d, i);
      }
    }
    function mw(e, t, a, i) {
      var o, u = eE(a), d, m = i;
      if (m === al && (m = ld(e)), m === al) {
        if (o = Al(e, t), !o && e !== e.toLowerCase() && y("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var h = u.createElement("div");
          h.innerHTML = "<script><\/script>";
          var E = h.firstChild;
          d = h.removeChild(E);
        } else if (typeof t.is == "string")
          d = u.createElement(e, {
            is: t.is
          });
        else if (d = u.createElement(e), e === "select") {
          var C = d;
          t.multiple ? C.multiple = !0 : t.size && (C.size = t.size);
        }
      } else
        d = u.createElementNS(m, e);
      return m === al && !o && Object.prototype.toString.call(d) === "[object HTMLUnknownElement]" && !qn.call(Py, e) && (Py[e] = !0, y("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), d;
    }
    function hw(e, t) {
      return eE(t).createTextNode(e);
    }
    function vw(e, t, a, i) {
      var o = Al(t, a);
      Nh(t, a);
      var u;
      switch (t) {
        case "dialog":
          Wn("cancel", e), Wn("close", e), u = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          Wn("load", e), u = a;
          break;
        case "video":
        case "audio":
          for (var d = 0; d < ip.length; d++)
            Wn(ip[d], e);
          u = a;
          break;
        case "source":
          Wn("error", e), u = a;
          break;
        case "img":
        case "image":
        case "link":
          Wn("error", e), Wn("load", e), u = a;
          break;
        case "details":
          Wn("toggle", e), u = a;
          break;
        case "input":
          yi(e, a), u = us(e, a), Wn("invalid", e);
          break;
        case "option":
          Xt(e, a), u = a;
          break;
        case "select":
          vo(e, a), u = tu(e, a), Wn("invalid", e);
          break;
        case "textarea":
          rd(e, a), u = nd(e, a), Wn("invalid", e);
          break;
        default:
          u = a;
      }
      switch (hc(t, u), dw(t, e, i, u, o), t) {
        case "input":
          vi(e), K(e, a, !1);
          break;
        case "textarea":
          vi(e), fm(e);
          break;
        case "option":
          kn(e, a);
          break;
        case "select":
          ed(e, a);
          break;
        default:
          typeof u.onClick == "function" && Ah(e);
          break;
      }
    }
    function yw(e, t, a, i, o) {
      Nh(t, i);
      var u = null, d, m;
      switch (t) {
        case "input":
          d = us(e, a), m = us(e, i), u = [];
          break;
        case "select":
          d = tu(e, a), m = tu(e, i), u = [];
          break;
        case "textarea":
          d = nd(e, a), m = nd(e, i), u = [];
          break;
        default:
          d = a, m = i, typeof d.onClick != "function" && typeof m.onClick == "function" && Ah(e);
          break;
      }
      hc(t, m);
      var h, E, C = null;
      for (h in d)
        if (!(m.hasOwnProperty(h) || !d.hasOwnProperty(h) || d[h] == null))
          if (h === Gu) {
            var M = d[h];
            for (E in M)
              M.hasOwnProperty(E) && (C || (C = {}), C[E] = "");
          } else h === sp || h === Qu || h === jh || h === Ls || h === qx || (yt.hasOwnProperty(h) ? u || (u = []) : (u = u || []).push(h, null));
      for (h in m) {
        var L = m[h], Q = d != null ? d[h] : void 0;
        if (!(!m.hasOwnProperty(h) || L === Q || L == null && Q == null))
          if (h === Gu)
            if (L && Object.freeze(L), Q) {
              for (E in Q)
                Q.hasOwnProperty(E) && (!L || !L.hasOwnProperty(E)) && (C || (C = {}), C[E] = "");
              for (E in L)
                L.hasOwnProperty(E) && Q[E] !== L[E] && (C || (C = {}), C[E] = L[E]);
            } else
              C || (u || (u = []), u.push(h, C)), C = L;
          else if (h === sp) {
            var X = L ? L[kh] : void 0, ae = Q ? Q[kh] : void 0;
            X != null && ae !== X && (u = u || []).push(h, X);
          } else h === Qu ? (typeof L == "string" || typeof L == "number") && (u = u || []).push(h, "" + L) : h === jh || h === Ls || (yt.hasOwnProperty(h) ? (L != null && (typeof L != "function" && Dh(h, L), h === "onScroll" && Wn("scroll", e)), !u && Q !== L && (u = [])) : (u = u || []).push(h, L));
      }
      return C && (dy(C, m[Gu]), (u = u || []).push(Gu, C)), u;
    }
    function gw(e, t, a, i, o) {
      a === "input" && o.type === "radio" && o.name != null && v(e, o);
      var u = Al(a, i), d = Al(a, o);
      switch (pw(e, t, u, d), a) {
        case "input":
          T(e, o);
          break;
        case "textarea":
          cm(e, o);
          break;
        case "select":
          dc(e, o);
          break;
      }
    }
    function Sw(e) {
      {
        var t = e.toLowerCase();
        return lu.hasOwnProperty(t) && lu[t] || null;
      }
    }
    function xw(e, t, a, i, o, u, d) {
      var m, h;
      switch (m = Al(t, a), Nh(t, a), t) {
        case "dialog":
          Wn("cancel", e), Wn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          Wn("load", e);
          break;
        case "video":
        case "audio":
          for (var E = 0; E < ip.length; E++)
            Wn(ip[E], e);
          break;
        case "source":
          Wn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          Wn("error", e), Wn("load", e);
          break;
        case "details":
          Wn("toggle", e);
          break;
        case "input":
          yi(e, a), Wn("invalid", e);
          break;
        case "option":
          Xt(e, a);
          break;
        case "select":
          vo(e, a), Wn("invalid", e);
          break;
        case "textarea":
          rd(e, a), Wn("invalid", e);
          break;
      }
      hc(t, a);
      {
        h = /* @__PURE__ */ new Set();
        for (var C = e.attributes, M = 0; M < C.length; M++) {
          var L = C[M].name.toLowerCase();
          switch (L) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              h.add(C[M].name);
          }
        }
      }
      var Q = null;
      for (var X in a)
        if (a.hasOwnProperty(X)) {
          var ae = a[X];
          if (X === Qu)
            typeof ae == "string" ? e.textContent !== ae && (a[Ls] !== !0 && Lh(e.textContent, ae, u, d), Q = [Qu, ae]) : typeof ae == "number" && e.textContent !== "" + ae && (a[Ls] !== !0 && Lh(e.textContent, ae, u, d), Q = [Qu, "" + ae]);
          else if (yt.hasOwnProperty(X))
            ae != null && (typeof ae != "function" && Dh(X, ae), X === "onScroll" && Wn("scroll", e));
          else if (d && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof m == "boolean") {
            var He = void 0, st = fn(X);
            if (a[Ls] !== !0) {
              if (!(X === jh || X === Ls || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              X === "value" || X === "checked" || X === "selected")) {
                if (X === sp) {
                  var nt = e.innerHTML, Gt = ae ? ae[kh] : void 0;
                  if (Gt != null) {
                    var Vt = Zx(e, Gt);
                    Vt !== nt && up(X, nt, Vt);
                  }
                } else if (X === Gu) {
                  if (h.delete(X), Jx) {
                    var H = cy(ae);
                    He = e.getAttribute("style"), H !== He && up(X, He, H);
                  }
                } else if (m && !O)
                  h.delete(X.toLowerCase()), He = Zi(e, X, ae), ae !== He && up(X, He, ae);
                else if (!Mn(X, st, m) && !Xn(X, ae, st, m)) {
                  var ie = !1;
                  if (st !== null)
                    h.delete(st.attributeName), He = ka(e, X, ae, st);
                  else {
                    var B = i;
                    if (B === al && (B = ld(t)), B === al)
                      h.delete(X.toLowerCase());
                    else {
                      var Te = Sw(X);
                      Te !== null && Te !== X && (ie = !0, h.delete(Te)), h.delete(X);
                    }
                    He = Zi(e, X, ae);
                  }
                  var Ge = O;
                  !Ge && ae !== He && !ie && up(X, He, ae);
                }
              }
            }
          }
        }
      switch (d && // $FlowFixMe - Should be inferred as not undefined.
      h.size > 0 && a[Ls] !== !0 && Xx(h), t) {
        case "input":
          vi(e), K(e, a, !0);
          break;
        case "textarea":
          vi(e), fm(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && Ah(e);
          break;
      }
      return Q;
    }
    function Ew(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Hy(e, t) {
      {
        if (ui)
          return;
        ui = !0, y("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function By(e, t) {
      {
        if (ui)
          return;
        ui = !0, y('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Vy(e, t, a) {
      {
        if (ui)
          return;
        ui = !0, y("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Iy(e, t) {
      {
        if (t === "" || ui)
          return;
        ui = !0, y('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function bw(e, t, a) {
      switch (t) {
        case "input":
          ne(e, a);
          return;
        case "textarea":
          ly(e, a);
          return;
        case "select":
          td(e, a);
          return;
      }
    }
    var cp = function() {
    }, fp = function() {
    };
    {
      var Cw = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], tE = [
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
      ], _w = tE.concat(["button"]), ww = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], nE = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      fp = function(e, t) {
        var a = Ot({}, e || nE), i = {
          tag: t
        };
        return tE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), _w.indexOf(t) !== -1 && (a.pTagInButtonScope = null), Cw.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var Tw = function(e, t) {
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
            return ww.indexOf(t) === -1;
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
      }, Rw = function(e, t) {
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
      }, rE = {};
      cp = function(e, t, a) {
        a = a || nE;
        var i = a.current, o = i && i.tag;
        t != null && (e != null && y("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var u = Tw(e, o) ? null : i, d = u ? null : Rw(e, a), m = u || d;
        if (m) {
          var h = m.tag, E = !!u + "|" + e + "|" + h;
          if (!rE[E]) {
            rE[E] = !0;
            var C = e, M = "";
            if (e === "#text" ? /\S/.test(t) ? C = "Text nodes" : (C = "Whitespace text nodes", M = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : C = "<" + e + ">", u) {
              var L = "";
              h === "table" && e === "tr" && (L += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), y("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", C, h, M, L);
            } else
              y("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", C, h);
          }
        }
      };
    }
    var Mh = "suppressHydrationWarning", Uh = "$", zh = "/$", dp = "$?", pp = "$!", jw = "style", $y = null, Yy = null;
    function kw(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case ll:
        case sd: {
          t = i === ll ? "#document" : "#fragment";
          var o = e.documentElement;
          a = o ? o.namespaceURI : od(null, "");
          break;
        }
        default: {
          var u = i === sr ? e.parentNode : e, d = u.namespaceURI || null;
          t = u.tagName, a = od(d, t);
          break;
        }
      }
      {
        var m = t.toLowerCase(), h = fp(null, m);
        return {
          namespace: a,
          ancestorInfo: h
        };
      }
    }
    function Nw(e, t, a) {
      {
        var i = e, o = od(i.namespace, t), u = fp(i.ancestorInfo, t);
        return {
          namespace: o,
          ancestorInfo: u
        };
      }
    }
    function PN(e) {
      return e;
    }
    function Dw(e) {
      $y = mr(), Yy = Y_();
      var t = null;
      return Er(!1), t;
    }
    function Ow(e) {
      W_(Yy), Er($y), $y = null, Yy = null;
    }
    function Lw(e, t, a, i, o) {
      var u;
      {
        var d = i;
        if (cp(e, null, d.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var m = "" + t.children, h = fp(d.ancestorInfo, e);
          cp(null, m, h);
        }
        u = d.namespace;
      }
      var E = mw(e, t, a, u);
      return vp(o, E), Zy(E, t), E;
    }
    function Aw(e, t) {
      e.appendChild(t);
    }
    function Mw(e, t, a, i, o) {
      switch (vw(e, t, a, i), t) {
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
    function Uw(e, t, a, i, o, u) {
      {
        var d = u;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var m = "" + i.children, h = fp(d.ancestorInfo, t);
          cp(null, m, h);
        }
      }
      return yw(e, t, a, i);
    }
    function Wy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function zw(e, t, a, i) {
      {
        var o = a;
        cp(null, e, o.ancestorInfo);
      }
      var u = hw(e, t);
      return vp(i, u), u;
    }
    function Fw() {
      var e = window.event;
      return e === void 0 ? ii : uf(e.type);
    }
    var Qy = typeof setTimeout == "function" ? setTimeout : void 0, Pw = typeof clearTimeout == "function" ? clearTimeout : void 0, Gy = -1, aE = typeof Promise == "function" ? Promise : void 0, Hw = typeof queueMicrotask == "function" ? queueMicrotask : typeof aE < "u" ? function(e) {
      return aE.resolve(null).then(e).catch(Bw);
    } : Qy;
    function Bw(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function Vw(e, t, a, i) {
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
    function Iw(e, t, a, i, o, u) {
      gw(e, t, a, i, o), Zy(e, o);
    }
    function iE(e) {
      cs(e, "");
    }
    function $w(e, t, a) {
      e.nodeValue = a;
    }
    function Yw(e, t) {
      e.appendChild(t);
    }
    function Ww(e, t) {
      var a;
      e.nodeType === sr ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Ah(a);
    }
    function Qw(e, t, a) {
      e.insertBefore(t, a);
    }
    function Gw(e, t, a) {
      e.nodeType === sr ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function Kw(e, t) {
      e.removeChild(t);
    }
    function qw(e, t) {
      e.nodeType === sr ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Ky(e, t) {
      var a = t, i = 0;
      do {
        var o = a.nextSibling;
        if (e.removeChild(a), o && o.nodeType === sr) {
          var u = o.data;
          if (u === zh)
            if (i === 0) {
              e.removeChild(o), zo(t);
              return;
            } else
              i--;
          else (u === Uh || u === dp || u === pp) && i++;
        }
        a = o;
      } while (a);
      zo(t);
    }
    function Xw(e, t) {
      e.nodeType === sr ? Ky(e.parentNode, t) : e.nodeType === da && Ky(e, t), zo(e);
    }
    function Jw(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function Zw(e) {
      e.nodeValue = "";
    }
    function e0(e, t) {
      e = e;
      var a = t[jw], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = mc("display", i);
    }
    function t0(e, t) {
      e.nodeValue = t;
    }
    function n0(e) {
      e.nodeType === da ? e.textContent = "" : e.nodeType === ll && e.documentElement && e.removeChild(e.documentElement);
    }
    function r0(e, t, a) {
      return e.nodeType !== da || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function a0(e, t) {
      return t === "" || e.nodeType !== il ? null : e;
    }
    function i0(e) {
      return e.nodeType !== sr ? null : e;
    }
    function lE(e) {
      return e.data === dp;
    }
    function qy(e) {
      return e.data === pp;
    }
    function l0(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, o;
      return t && (a = t.dgst, i = t.msg, o = t.stck), {
        message: i,
        digest: a,
        stack: o
      };
    }
    function o0(e, t) {
      e._reactRetry = t;
    }
    function Fh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === da || t === il)
          break;
        if (t === sr) {
          var a = e.data;
          if (a === Uh || a === pp || a === dp)
            break;
          if (a === zh)
            return null;
        }
      }
      return e;
    }
    function mp(e) {
      return Fh(e.nextSibling);
    }
    function s0(e) {
      return Fh(e.firstChild);
    }
    function u0(e) {
      return Fh(e.firstChild);
    }
    function c0(e) {
      return Fh(e.nextSibling);
    }
    function f0(e, t, a, i, o, u, d) {
      vp(u, e), Zy(e, a);
      var m;
      {
        var h = o;
        m = h.namespace;
      }
      var E = (u.mode & Pt) !== it;
      return xw(e, t, a, m, i, E, d);
    }
    function d0(e, t, a, i) {
      return vp(a, e), a.mode & Pt, Ew(e, t);
    }
    function p0(e, t) {
      vp(t, e);
    }
    function m0(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === sr) {
          var i = t.data;
          if (i === zh) {
            if (a === 0)
              return mp(t);
            a--;
          } else (i === Uh || i === pp || i === dp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function oE(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === sr) {
          var i = t.data;
          if (i === Uh || i === pp || i === dp) {
            if (a === 0)
              return t;
            a--;
          } else i === zh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function h0(e) {
      zo(e);
    }
    function v0(e) {
      zo(e);
    }
    function y0(e) {
      return e !== "head" && e !== "body";
    }
    function g0(e, t, a, i) {
      var o = !0;
      Lh(t.nodeValue, a, i, o);
    }
    function S0(e, t, a, i, o, u) {
      if (t[Mh] !== !0) {
        var d = !0;
        Lh(i.nodeValue, o, u, d);
      }
    }
    function x0(e, t) {
      t.nodeType === da ? Hy(e, t) : t.nodeType === sr || By(e, t);
    }
    function E0(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === da ? Hy(a, t) : t.nodeType === sr || By(a, t));
      }
    }
    function b0(e, t, a, i, o) {
      (o || t[Mh] !== !0) && (i.nodeType === da ? Hy(a, i) : i.nodeType === sr || By(a, i));
    }
    function C0(e, t, a) {
      Vy(e, t);
    }
    function _0(e, t) {
      Iy(e, t);
    }
    function w0(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Vy(i, t);
      }
    }
    function T0(e, t) {
      {
        var a = e.parentNode;
        a !== null && Iy(a, t);
      }
    }
    function R0(e, t, a, i, o, u) {
      (u || t[Mh] !== !0) && Vy(a, i);
    }
    function j0(e, t, a, i, o) {
      (o || t[Mh] !== !0) && Iy(a, i);
    }
    function k0(e) {
      y("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function N0(e) {
      lp(e);
    }
    var Cf = Math.random().toString(36).slice(2), _f = "__reactFiber$" + Cf, Xy = "__reactProps$" + Cf, hp = "__reactContainer$" + Cf, Jy = "__reactEvents$" + Cf, D0 = "__reactListeners$" + Cf, O0 = "__reactHandles$" + Cf;
    function L0(e) {
      delete e[_f], delete e[Xy], delete e[Jy], delete e[D0], delete e[O0];
    }
    function vp(e, t) {
      t[_f] = e;
    }
    function Ph(e, t) {
      t[hp] = e;
    }
    function sE(e) {
      e[hp] = null;
    }
    function yp(e) {
      return !!e[hp];
    }
    function Ku(e) {
      var t = e[_f];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[hp] || a[_f], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var o = oE(e); o !== null; ) {
              var u = o[_f];
              if (u)
                return u;
              o = oE(o);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function As(e) {
      var t = e[_f] || e[hp];
      return t && (t.tag === G || t.tag === re || t.tag === ce || t.tag === z) ? t : null;
    }
    function wf(e) {
      if (e.tag === G || e.tag === re)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Hh(e) {
      return e[Xy] || null;
    }
    function Zy(e, t) {
      e[Xy] = t;
    }
    function A0(e) {
      var t = e[Jy];
      return t === void 0 && (t = e[Jy] = /* @__PURE__ */ new Set()), t;
    }
    var uE = {}, cE = b.ReactDebugCurrentFrame;
    function Bh(e) {
      if (e) {
        var t = e._owner, a = tl(e.type, e._source, t ? t.type : null);
        cE.setExtraStackFrame(a);
      } else
        cE.setExtraStackFrame(null);
    }
    function yl(e, t, a, i, o) {
      {
        var u = Function.call.bind(qn);
        for (var d in e)
          if (u(e, d)) {
            var m = void 0;
            try {
              if (typeof e[d] != "function") {
                var h = Error((i || "React class") + ": " + a + " type `" + d + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[d] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw h.name = "Invariant Violation", h;
              }
              m = e[d](t, d, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (E) {
              m = E;
            }
            m && !(m instanceof Error) && (Bh(o), y("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, d, typeof m), Bh(null)), m instanceof Error && !(m.message in uE) && (uE[m.message] = !0, Bh(o), y("Failed %s type: %s", a, m.message), Bh(null));
          }
      }
    }
    var eg = [], Vh;
    Vh = [];
    var Io = -1;
    function Ms(e) {
      return {
        current: e
      };
    }
    function Ca(e, t) {
      if (Io < 0) {
        y("Unexpected pop.");
        return;
      }
      t !== Vh[Io] && y("Unexpected Fiber popped."), e.current = eg[Io], eg[Io] = null, Vh[Io] = null, Io--;
    }
    function _a(e, t, a) {
      Io++, eg[Io] = e.current, Vh[Io] = a, e.current = t;
    }
    var tg;
    tg = {};
    var _i = {};
    Object.freeze(_i);
    var $o = Ms(_i), eo = Ms(!1), ng = _i;
    function Tf(e, t, a) {
      return a && to(t) ? ng : $o.current;
    }
    function fE(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Rf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return _i;
        var o = e.stateNode;
        if (o && o.__reactInternalMemoizedUnmaskedChildContext === t)
          return o.__reactInternalMemoizedMaskedChildContext;
        var u = {};
        for (var d in i)
          u[d] = t[d];
        {
          var m = jt(e) || "Unknown";
          yl(i, u, "context", m);
        }
        return o && fE(e, t, u), u;
      }
    }
    function Ih() {
      return eo.current;
    }
    function to(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function $h(e) {
      Ca(eo, e), Ca($o, e);
    }
    function rg(e) {
      Ca(eo, e), Ca($o, e);
    }
    function dE(e, t, a) {
      {
        if ($o.current !== _i)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        _a($o, t, e), _a(eo, a, e);
      }
    }
    function pE(e, t, a) {
      {
        var i = e.stateNode, o = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var u = jt(e) || "Unknown";
            tg[u] || (tg[u] = !0, y("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", u, u));
          }
          return a;
        }
        var d = i.getChildContext();
        for (var m in d)
          if (!(m in o))
            throw new Error((jt(e) || "Unknown") + '.getChildContext(): key "' + m + '" is not defined in childContextTypes.');
        {
          var h = jt(e) || "Unknown";
          yl(o, d, "child context", h);
        }
        return Ot({}, a, d);
      }
    }
    function Yh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || _i;
        return ng = $o.current, _a($o, a, e), _a(eo, eo.current, e), !0;
      }
    }
    function mE(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var o = pE(e, t, ng);
          i.__reactInternalMemoizedMergedChildContext = o, Ca(eo, e), Ca($o, e), _a($o, o, e), _a(eo, a, e);
        } else
          Ca(eo, e), _a(eo, a, e);
      }
    }
    function M0(e) {
      {
        if (!Co(e) || e.tag !== j)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case z:
              return t.stateNode.context;
            case j: {
              var a = t.type;
              if (to(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var Us = 0, Wh = 1, Yo = null, ag = !1, ig = !1;
    function hE(e) {
      Yo === null ? Yo = [e] : Yo.push(e);
    }
    function U0(e) {
      ag = !0, hE(e);
    }
    function vE() {
      ag && zs();
    }
    function zs() {
      if (!ig && Yo !== null) {
        ig = !0;
        var e = 0, t = oi();
        try {
          var a = !0, i = Yo;
          for (pr(qr); e < i.length; e++) {
            var o = i[e];
            do
              o = o(a);
            while (o !== null);
          }
          Yo = null, ag = !1;
        } catch (u) {
          throw Yo !== null && (Yo = Yo.slice(e + 1)), xd(mu, zs), u;
        } finally {
          pr(t), ig = !1;
        }
      }
      return null;
    }
    var jf = [], kf = 0, Qh = null, Gh = 0, Wi = [], Qi = 0, qu = null, Wo = 1, Qo = "";
    function z0(e) {
      return Ju(), (e.flags & Ui) !== at;
    }
    function F0(e) {
      return Ju(), Gh;
    }
    function P0() {
      var e = Qo, t = Wo, a = t & ~H0(t);
      return a.toString(32) + e;
    }
    function Xu(e, t) {
      Ju(), jf[kf++] = Gh, jf[kf++] = Qh, Qh = e, Gh = t;
    }
    function yE(e, t, a) {
      Ju(), Wi[Qi++] = Wo, Wi[Qi++] = Qo, Wi[Qi++] = qu, qu = e;
      var i = Wo, o = Qo, u = Kh(i) - 1, d = i & ~(1 << u), m = a + 1, h = Kh(t) + u;
      if (h > 30) {
        var E = u - u % 5, C = (1 << E) - 1, M = (d & C).toString(32), L = d >> E, Q = u - E, X = Kh(t) + Q, ae = m << Q, He = ae | L, st = M + o;
        Wo = 1 << X | He, Qo = st;
      } else {
        var nt = m << u, Gt = nt | d, Vt = o;
        Wo = 1 << h | Gt, Qo = Vt;
      }
    }
    function lg(e) {
      Ju();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Xu(e, a), yE(e, a, i);
      }
    }
    function Kh(e) {
      return 32 - fr(e);
    }
    function H0(e) {
      return 1 << Kh(e) - 1;
    }
    function og(e) {
      for (; e === Qh; )
        Qh = jf[--kf], jf[kf] = null, Gh = jf[--kf], jf[kf] = null;
      for (; e === qu; )
        qu = Wi[--Qi], Wi[Qi] = null, Qo = Wi[--Qi], Wi[Qi] = null, Wo = Wi[--Qi], Wi[Qi] = null;
    }
    function B0() {
      return Ju(), qu !== null ? {
        id: Wo,
        overflow: Qo
      } : null;
    }
    function V0(e, t) {
      Ju(), Wi[Qi++] = Wo, Wi[Qi++] = Qo, Wi[Qi++] = qu, Wo = t.id, Qo = t.overflow, qu = e;
    }
    function Ju() {
      ta() || y("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var ea = null, Gi = null, gl = !1, Zu = !1, Fs = null;
    function I0() {
      gl && y("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function gE() {
      Zu = !0;
    }
    function $0() {
      return Zu;
    }
    function Y0(e) {
      var t = e.stateNode.containerInfo;
      return Gi = u0(t), ea = e, gl = !0, Fs = null, Zu = !1, !0;
    }
    function W0(e, t, a) {
      return Gi = c0(t), ea = e, gl = !0, Fs = null, Zu = !1, a !== null && V0(e, a), !0;
    }
    function SE(e, t) {
      switch (e.tag) {
        case z: {
          x0(e.stateNode.containerInfo, t);
          break;
        }
        case G: {
          var a = (e.mode & Pt) !== it;
          b0(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case ce: {
          var i = e.memoizedState;
          i.dehydrated !== null && E0(i.dehydrated, t);
          break;
        }
      }
    }
    function xE(e, t) {
      SE(e, t);
      var a = qj();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= ei) : i.push(a);
    }
    function sg(e, t) {
      {
        if (Zu)
          return;
        switch (e.tag) {
          case z: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case G:
                var i = t.type;
                t.pendingProps, C0(a, i);
                break;
              case re:
                var o = t.pendingProps;
                _0(a, o);
                break;
            }
            break;
          }
          case G: {
            var u = e.type, d = e.memoizedProps, m = e.stateNode;
            switch (t.tag) {
              case G: {
                var h = t.type, E = t.pendingProps, C = (e.mode & Pt) !== it;
                R0(
                  u,
                  d,
                  m,
                  h,
                  E,
                  // TODO: Delete this argument when we remove the legacy root API.
                  C
                );
                break;
              }
              case re: {
                var M = t.pendingProps, L = (e.mode & Pt) !== it;
                j0(
                  u,
                  d,
                  m,
                  M,
                  // TODO: Delete this argument when we remove the legacy root API.
                  L
                );
                break;
              }
            }
            break;
          }
          case ce: {
            var Q = e.memoizedState, X = Q.dehydrated;
            if (X !== null) switch (t.tag) {
              case G:
                var ae = t.type;
                t.pendingProps, w0(X, ae);
                break;
              case re:
                var He = t.pendingProps;
                T0(X, He);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function EE(e, t) {
      t.flags = t.flags & ~ma | In, sg(e, t);
    }
    function bE(e, t) {
      switch (e.tag) {
        case G: {
          var a = e.type;
          e.pendingProps;
          var i = r0(t, a);
          return i !== null ? (e.stateNode = i, ea = e, Gi = s0(i), !0) : !1;
        }
        case re: {
          var o = e.pendingProps, u = a0(t, o);
          return u !== null ? (e.stateNode = u, ea = e, Gi = null, !0) : !1;
        }
        case ce: {
          var d = i0(t);
          if (d !== null) {
            var m = {
              dehydrated: d,
              treeContext: B0(),
              retryLane: ga
            };
            e.memoizedState = m;
            var h = Xj(d);
            return h.return = e, e.child = h, ea = e, Gi = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function ug(e) {
      return (e.mode & Pt) !== it && (e.flags & rt) === at;
    }
    function cg(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function fg(e) {
      if (gl) {
        var t = Gi;
        if (!t) {
          ug(e) && (sg(ea, e), cg()), EE(ea, e), gl = !1, ea = e;
          return;
        }
        var a = t;
        if (!bE(e, t)) {
          ug(e) && (sg(ea, e), cg()), t = mp(a);
          var i = ea;
          if (!t || !bE(e, t)) {
            EE(ea, e), gl = !1, ea = e;
            return;
          }
          xE(i, a);
        }
      }
    }
    function Q0(e, t, a) {
      var i = e.stateNode, o = !Zu, u = f0(i, e.type, e.memoizedProps, t, a, e, o);
      return e.updateQueue = u, u !== null;
    }
    function G0(e) {
      var t = e.stateNode, a = e.memoizedProps, i = d0(t, a, e);
      if (i) {
        var o = ea;
        if (o !== null)
          switch (o.tag) {
            case z: {
              var u = o.stateNode.containerInfo, d = (o.mode & Pt) !== it;
              g0(
                u,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                d
              );
              break;
            }
            case G: {
              var m = o.type, h = o.memoizedProps, E = o.stateNode, C = (o.mode & Pt) !== it;
              S0(
                m,
                h,
                E,
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
    function K0(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      p0(a, e);
    }
    function q0(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return m0(a);
    }
    function CE(e) {
      for (var t = e.return; t !== null && t.tag !== G && t.tag !== z && t.tag !== ce; )
        t = t.return;
      ea = t;
    }
    function qh(e) {
      if (e !== ea)
        return !1;
      if (!gl)
        return CE(e), gl = !0, !1;
      if (e.tag !== z && (e.tag !== G || y0(e.type) && !Wy(e.type, e.memoizedProps))) {
        var t = Gi;
        if (t)
          if (ug(e))
            _E(e), cg();
          else
            for (; t; )
              xE(e, t), t = mp(t);
      }
      return CE(e), e.tag === ce ? Gi = q0(e) : Gi = ea ? mp(e.stateNode) : null, !0;
    }
    function X0() {
      return gl && Gi !== null;
    }
    function _E(e) {
      for (var t = Gi; t; )
        SE(e, t), t = mp(t);
    }
    function Nf() {
      ea = null, Gi = null, gl = !1, Zu = !1;
    }
    function wE() {
      Fs !== null && (gC(Fs), Fs = null);
    }
    function ta() {
      return gl;
    }
    function dg(e) {
      Fs === null ? Fs = [e] : Fs.push(e);
    }
    var J0 = b.ReactCurrentBatchConfig, Z0 = null;
    function eT() {
      return J0.transition;
    }
    var Sl = {
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
      var tT = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & yn && (t = a), a = a.return;
        return t;
      }, ec = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, gp = [], Sp = [], xp = [], Ep = [], bp = [], Cp = [], tc = /* @__PURE__ */ new Set();
      Sl.recordUnsafeLifecycleWarnings = function(e, t) {
        tc.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && gp.push(e), e.mode & yn && typeof t.UNSAFE_componentWillMount == "function" && Sp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && xp.push(e), e.mode & yn && typeof t.UNSAFE_componentWillReceiveProps == "function" && Ep.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && bp.push(e), e.mode & yn && typeof t.UNSAFE_componentWillUpdate == "function" && Cp.push(e));
      }, Sl.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(L) {
          e.add(jt(L) || "Component"), tc.add(L.type);
        }), gp = []);
        var t = /* @__PURE__ */ new Set();
        Sp.length > 0 && (Sp.forEach(function(L) {
          t.add(jt(L) || "Component"), tc.add(L.type);
        }), Sp = []);
        var a = /* @__PURE__ */ new Set();
        xp.length > 0 && (xp.forEach(function(L) {
          a.add(jt(L) || "Component"), tc.add(L.type);
        }), xp = []);
        var i = /* @__PURE__ */ new Set();
        Ep.length > 0 && (Ep.forEach(function(L) {
          i.add(jt(L) || "Component"), tc.add(L.type);
        }), Ep = []);
        var o = /* @__PURE__ */ new Set();
        bp.length > 0 && (bp.forEach(function(L) {
          o.add(jt(L) || "Component"), tc.add(L.type);
        }), bp = []);
        var u = /* @__PURE__ */ new Set();
        if (Cp.length > 0 && (Cp.forEach(function(L) {
          u.add(jt(L) || "Component"), tc.add(L.type);
        }), Cp = []), t.size > 0) {
          var d = ec(t);
          y(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, d);
        }
        if (i.size > 0) {
          var m = ec(i);
          y(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, m);
        }
        if (u.size > 0) {
          var h = ec(u);
          y(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, h);
        }
        if (e.size > 0) {
          var E = ec(e);
          N(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, E);
        }
        if (a.size > 0) {
          var C = ec(a);
          N(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, C);
        }
        if (o.size > 0) {
          var M = ec(o);
          N(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, M);
        }
      };
      var Xh = /* @__PURE__ */ new Map(), TE = /* @__PURE__ */ new Set();
      Sl.recordLegacyContextWarning = function(e, t) {
        var a = tT(e);
        if (a === null) {
          y("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!TE.has(e.type)) {
          var i = Xh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Xh.set(a, i)), i.push(e));
        }
      }, Sl.flushLegacyContextWarning = function() {
        Xh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(u) {
              i.add(jt(u) || "Component"), TE.add(u.type);
            });
            var o = ec(i);
            try {
              mn(a), y(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o);
            } finally {
              zn();
            }
          }
        });
      }, Sl.discardPendingWarnings = function() {
        gp = [], Sp = [], xp = [], Ep = [], bp = [], Cp = [], Xh = /* @__PURE__ */ new Map();
      };
    }
    var pg, mg, hg, vg, yg, RE = function(e, t) {
    };
    pg = !1, mg = !1, hg = {}, vg = {}, yg = {}, RE = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = jt(t) || "Component";
        vg[a] || (vg[a] = !0, y('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function nT(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function _p(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & yn || P) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== j) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !nT(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var o = jt(e) || "Component";
          hg[o] || (y('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', o, i), hg[o] = !0);
        }
        if (a._owner) {
          var u = a._owner, d;
          if (u) {
            var m = u;
            if (m.tag !== j)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            d = m.stateNode;
          }
          if (!d)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var h = d;
          Ln(i, "ref");
          var E = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === E)
            return t.ref;
          var C = function(M) {
            var L = h.refs;
            M === null ? delete L[E] : L[E] = M;
          };
          return C._stringRef = E, C;
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
    function Jh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Zh(e) {
      {
        var t = jt(e) || "Component";
        if (yg[t])
          return;
        yg[t] = !0, y("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function jE(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function kE(e) {
      function t(H, ie) {
        if (e) {
          var B = H.deletions;
          B === null ? (H.deletions = [ie], H.flags |= ei) : B.push(ie);
        }
      }
      function a(H, ie) {
        if (!e)
          return null;
        for (var B = ie; B !== null; )
          t(H, B), B = B.sibling;
        return null;
      }
      function i(H, ie) {
        for (var B = /* @__PURE__ */ new Map(), Te = ie; Te !== null; )
          Te.key !== null ? B.set(Te.key, Te) : B.set(Te.index, Te), Te = Te.sibling;
        return B;
      }
      function o(H, ie) {
        var B = cc(H, ie);
        return B.index = 0, B.sibling = null, B;
      }
      function u(H, ie, B) {
        if (H.index = B, !e)
          return H.flags |= Ui, ie;
        var Te = H.alternate;
        if (Te !== null) {
          var Ge = Te.index;
          return Ge < ie ? (H.flags |= In, ie) : Ge;
        } else
          return H.flags |= In, ie;
      }
      function d(H) {
        return e && H.alternate === null && (H.flags |= In), H;
      }
      function m(H, ie, B, Te) {
        if (ie === null || ie.tag !== re) {
          var Ge = dx(B, H.mode, Te);
          return Ge.return = H, Ge;
        } else {
          var Ve = o(ie, B);
          return Ve.return = H, Ve;
        }
      }
      function h(H, ie, B, Te) {
        var Ge = B.type;
        if (Ge === Ka)
          return C(H, ie, B.props.children, Te, B.key);
        if (ie !== null && (ie.elementType === Ge || // Keep this check inline so it only runs on the false path:
        AC(ie, B) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Ge == "object" && Ge !== null && Ge.$$typeof === _t && jE(Ge) === ie.type)) {
          var Ve = o(ie, B.props);
          return Ve.ref = _p(H, ie, B), Ve.return = H, Ve._debugSource = B._source, Ve._debugOwner = B._owner, Ve;
        }
        var Et = fx(B, H.mode, Te);
        return Et.ref = _p(H, ie, B), Et.return = H, Et;
      }
      function E(H, ie, B, Te) {
        if (ie === null || ie.tag !== Y || ie.stateNode.containerInfo !== B.containerInfo || ie.stateNode.implementation !== B.implementation) {
          var Ge = px(B, H.mode, Te);
          return Ge.return = H, Ge;
        } else {
          var Ve = o(ie, B.children || []);
          return Ve.return = H, Ve;
        }
      }
      function C(H, ie, B, Te, Ge) {
        if (ie === null || ie.tag !== oe) {
          var Ve = Ks(B, H.mode, Te, Ge);
          return Ve.return = H, Ve;
        } else {
          var Et = o(ie, B);
          return Et.return = H, Et;
        }
      }
      function M(H, ie, B) {
        if (typeof ie == "string" && ie !== "" || typeof ie == "number") {
          var Te = dx("" + ie, H.mode, B);
          return Te.return = H, Te;
        }
        if (typeof ie == "object" && ie !== null) {
          switch (ie.$$typeof) {
            case kr: {
              var Ge = fx(ie, H.mode, B);
              return Ge.ref = _p(H, null, ie), Ge.return = H, Ge;
            }
            case Gn: {
              var Ve = px(ie, H.mode, B);
              return Ve.return = H, Ve;
            }
            case _t: {
              var Et = ie._payload, Nt = ie._init;
              return M(H, Nt(Et), B);
            }
          }
          if (zt(ie) || xt(ie)) {
            var Sn = Ks(ie, H.mode, B, null);
            return Sn.return = H, Sn;
          }
          Jh(H, ie);
        }
        return typeof ie == "function" && Zh(H), null;
      }
      function L(H, ie, B, Te) {
        var Ge = ie !== null ? ie.key : null;
        if (typeof B == "string" && B !== "" || typeof B == "number")
          return Ge !== null ? null : m(H, ie, "" + B, Te);
        if (typeof B == "object" && B !== null) {
          switch (B.$$typeof) {
            case kr:
              return B.key === Ge ? h(H, ie, B, Te) : null;
            case Gn:
              return B.key === Ge ? E(H, ie, B, Te) : null;
            case _t: {
              var Ve = B._payload, Et = B._init;
              return L(H, ie, Et(Ve), Te);
            }
          }
          if (zt(B) || xt(B))
            return Ge !== null ? null : C(H, ie, B, Te, null);
          Jh(H, B);
        }
        return typeof B == "function" && Zh(H), null;
      }
      function Q(H, ie, B, Te, Ge) {
        if (typeof Te == "string" && Te !== "" || typeof Te == "number") {
          var Ve = H.get(B) || null;
          return m(ie, Ve, "" + Te, Ge);
        }
        if (typeof Te == "object" && Te !== null) {
          switch (Te.$$typeof) {
            case kr: {
              var Et = H.get(Te.key === null ? B : Te.key) || null;
              return h(ie, Et, Te, Ge);
            }
            case Gn: {
              var Nt = H.get(Te.key === null ? B : Te.key) || null;
              return E(ie, Nt, Te, Ge);
            }
            case _t:
              var Sn = Te._payload, rn = Te._init;
              return Q(H, ie, B, rn(Sn), Ge);
          }
          if (zt(Te) || xt(Te)) {
            var br = H.get(B) || null;
            return C(ie, br, Te, Ge, null);
          }
          Jh(ie, Te);
        }
        return typeof Te == "function" && Zh(ie), null;
      }
      function X(H, ie, B) {
        {
          if (typeof H != "object" || H === null)
            return ie;
          switch (H.$$typeof) {
            case kr:
            case Gn:
              RE(H, B);
              var Te = H.key;
              if (typeof Te != "string")
                break;
              if (ie === null) {
                ie = /* @__PURE__ */ new Set(), ie.add(Te);
                break;
              }
              if (!ie.has(Te)) {
                ie.add(Te);
                break;
              }
              y("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", Te);
              break;
            case _t:
              var Ge = H._payload, Ve = H._init;
              X(Ve(Ge), ie, B);
              break;
          }
        }
        return ie;
      }
      function ae(H, ie, B, Te) {
        for (var Ge = null, Ve = 0; Ve < B.length; Ve++) {
          var Et = B[Ve];
          Ge = X(Et, Ge, H);
        }
        for (var Nt = null, Sn = null, rn = ie, br = 0, an = 0, vr = null; rn !== null && an < B.length; an++) {
          rn.index > an ? (vr = rn, rn = null) : vr = rn.sibling;
          var Ta = L(H, rn, B[an], Te);
          if (Ta === null) {
            rn === null && (rn = vr);
            break;
          }
          e && rn && Ta.alternate === null && t(H, rn), br = u(Ta, br, an), Sn === null ? Nt = Ta : Sn.sibling = Ta, Sn = Ta, rn = vr;
        }
        if (an === B.length) {
          if (a(H, rn), ta()) {
            var sa = an;
            Xu(H, sa);
          }
          return Nt;
        }
        if (rn === null) {
          for (; an < B.length; an++) {
            var Ti = M(H, B[an], Te);
            Ti !== null && (br = u(Ti, br, an), Sn === null ? Nt = Ti : Sn.sibling = Ti, Sn = Ti);
          }
          if (ta()) {
            var Ya = an;
            Xu(H, Ya);
          }
          return Nt;
        }
        for (var Wa = i(H, rn); an < B.length; an++) {
          var Ra = Q(Wa, H, an, B[an], Te);
          Ra !== null && (e && Ra.alternate !== null && Wa.delete(Ra.key === null ? an : Ra.key), br = u(Ra, br, an), Sn === null ? Nt = Ra : Sn.sibling = Ra, Sn = Ra);
        }
        if (e && Wa.forEach(function(Kf) {
          return t(H, Kf);
        }), ta()) {
          var es = an;
          Xu(H, es);
        }
        return Nt;
      }
      function He(H, ie, B, Te) {
        var Ge = xt(B);
        if (typeof Ge != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          B[Symbol.toStringTag] === "Generator" && (mg || y("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), mg = !0), B.entries === Ge && (pg || y("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), pg = !0);
          var Ve = Ge.call(B);
          if (Ve)
            for (var Et = null, Nt = Ve.next(); !Nt.done; Nt = Ve.next()) {
              var Sn = Nt.value;
              Et = X(Sn, Et, H);
            }
        }
        var rn = Ge.call(B);
        if (rn == null)
          throw new Error("An iterable object provided no iterator.");
        for (var br = null, an = null, vr = ie, Ta = 0, sa = 0, Ti = null, Ya = rn.next(); vr !== null && !Ya.done; sa++, Ya = rn.next()) {
          vr.index > sa ? (Ti = vr, vr = null) : Ti = vr.sibling;
          var Wa = L(H, vr, Ya.value, Te);
          if (Wa === null) {
            vr === null && (vr = Ti);
            break;
          }
          e && vr && Wa.alternate === null && t(H, vr), Ta = u(Wa, Ta, sa), an === null ? br = Wa : an.sibling = Wa, an = Wa, vr = Ti;
        }
        if (Ya.done) {
          if (a(H, vr), ta()) {
            var Ra = sa;
            Xu(H, Ra);
          }
          return br;
        }
        if (vr === null) {
          for (; !Ya.done; sa++, Ya = rn.next()) {
            var es = M(H, Ya.value, Te);
            es !== null && (Ta = u(es, Ta, sa), an === null ? br = es : an.sibling = es, an = es);
          }
          if (ta()) {
            var Kf = sa;
            Xu(H, Kf);
          }
          return br;
        }
        for (var nm = i(H, vr); !Ya.done; sa++, Ya = rn.next()) {
          var uo = Q(nm, H, sa, Ya.value, Te);
          uo !== null && (e && uo.alternate !== null && nm.delete(uo.key === null ? sa : uo.key), Ta = u(uo, Ta, sa), an === null ? br = uo : an.sibling = uo, an = uo);
        }
        if (e && nm.forEach(function(jk) {
          return t(H, jk);
        }), ta()) {
          var Rk = sa;
          Xu(H, Rk);
        }
        return br;
      }
      function st(H, ie, B, Te) {
        if (ie !== null && ie.tag === re) {
          a(H, ie.sibling);
          var Ge = o(ie, B);
          return Ge.return = H, Ge;
        }
        a(H, ie);
        var Ve = dx(B, H.mode, Te);
        return Ve.return = H, Ve;
      }
      function nt(H, ie, B, Te) {
        for (var Ge = B.key, Ve = ie; Ve !== null; ) {
          if (Ve.key === Ge) {
            var Et = B.type;
            if (Et === Ka) {
              if (Ve.tag === oe) {
                a(H, Ve.sibling);
                var Nt = o(Ve, B.props.children);
                return Nt.return = H, Nt._debugSource = B._source, Nt._debugOwner = B._owner, Nt;
              }
            } else if (Ve.elementType === Et || // Keep this check inline so it only runs on the false path:
            AC(Ve, B) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof Et == "object" && Et !== null && Et.$$typeof === _t && jE(Et) === Ve.type) {
              a(H, Ve.sibling);
              var Sn = o(Ve, B.props);
              return Sn.ref = _p(H, Ve, B), Sn.return = H, Sn._debugSource = B._source, Sn._debugOwner = B._owner, Sn;
            }
            a(H, Ve);
            break;
          } else
            t(H, Ve);
          Ve = Ve.sibling;
        }
        if (B.type === Ka) {
          var rn = Ks(B.props.children, H.mode, Te, B.key);
          return rn.return = H, rn;
        } else {
          var br = fx(B, H.mode, Te);
          return br.ref = _p(H, ie, B), br.return = H, br;
        }
      }
      function Gt(H, ie, B, Te) {
        for (var Ge = B.key, Ve = ie; Ve !== null; ) {
          if (Ve.key === Ge)
            if (Ve.tag === Y && Ve.stateNode.containerInfo === B.containerInfo && Ve.stateNode.implementation === B.implementation) {
              a(H, Ve.sibling);
              var Et = o(Ve, B.children || []);
              return Et.return = H, Et;
            } else {
              a(H, Ve);
              break;
            }
          else
            t(H, Ve);
          Ve = Ve.sibling;
        }
        var Nt = px(B, H.mode, Te);
        return Nt.return = H, Nt;
      }
      function Vt(H, ie, B, Te) {
        var Ge = typeof B == "object" && B !== null && B.type === Ka && B.key === null;
        if (Ge && (B = B.props.children), typeof B == "object" && B !== null) {
          switch (B.$$typeof) {
            case kr:
              return d(nt(H, ie, B, Te));
            case Gn:
              return d(Gt(H, ie, B, Te));
            case _t:
              var Ve = B._payload, Et = B._init;
              return Vt(H, ie, Et(Ve), Te);
          }
          if (zt(B))
            return ae(H, ie, B, Te);
          if (xt(B))
            return He(H, ie, B, Te);
          Jh(H, B);
        }
        return typeof B == "string" && B !== "" || typeof B == "number" ? d(st(H, ie, "" + B, Te)) : (typeof B == "function" && Zh(H), a(H, ie));
      }
      return Vt;
    }
    var Df = kE(!0), NE = kE(!1);
    function rT(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = cc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = cc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function aT(e, t) {
      for (var a = e.child; a !== null; )
        Yj(a, t), a = a.sibling;
    }
    var gg = Ms(null), Sg;
    Sg = {};
    var ev = null, Of = null, xg = null, tv = !1;
    function nv() {
      ev = null, Of = null, xg = null, tv = !1;
    }
    function DE() {
      tv = !0;
    }
    function OE() {
      tv = !1;
    }
    function LE(e, t, a) {
      _a(gg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== Sg && y("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = Sg;
    }
    function Eg(e, t) {
      var a = gg.current;
      Ca(gg, t), e._currentValue = a;
    }
    function bg(e, t, a) {
      for (var i = e; i !== null; ) {
        var o = i.alternate;
        if (Uo(i.childLanes, t) ? o !== null && !Uo(o.childLanes, t) && (o.childLanes = At(o.childLanes, t)) : (i.childLanes = At(i.childLanes, t), o !== null && (o.childLanes = At(o.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && y("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function iT(e, t, a) {
      lT(e, t, a);
    }
    function lT(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var o = void 0, u = i.dependencies;
        if (u !== null) {
          o = i.child;
          for (var d = u.firstContext; d !== null; ) {
            if (d.context === t) {
              if (i.tag === j) {
                var m = ju(a), h = Go(wn, m);
                h.tag = av;
                var E = i.updateQueue;
                if (E !== null) {
                  var C = E.shared, M = C.pending;
                  M === null ? h.next = h : (h.next = M.next, M.next = h), C.pending = h;
                }
              }
              i.lanes = At(i.lanes, a);
              var L = i.alternate;
              L !== null && (L.lanes = At(L.lanes, a)), bg(i.return, a, e), u.lanes = At(u.lanes, a);
              break;
            }
            d = d.next;
          }
        } else if (i.tag === le)
          o = i.type === e.type ? null : i.child;
        else if (i.tag === De) {
          var Q = i.return;
          if (Q === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          Q.lanes = At(Q.lanes, a);
          var X = Q.alternate;
          X !== null && (X.lanes = At(X.lanes, a)), bg(Q, a, e), o = i.sibling;
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
            var ae = o.sibling;
            if (ae !== null) {
              ae.return = o.return, o = ae;
              break;
            }
            o = o.return;
          }
        i = o;
      }
    }
    function Lf(e, t) {
      ev = e, Of = null, xg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (Sa(a.lanes, t) && Pp(), a.firstContext = null);
      }
    }
    function Rr(e) {
      tv && y("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (xg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Of === null) {
          if (ev === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Of = a, ev.dependencies = {
            lanes: ge,
            firstContext: a
          };
        } else
          Of = Of.next = a;
      }
      return t;
    }
    var nc = null;
    function Cg(e) {
      nc === null ? nc = [e] : nc.push(e);
    }
    function oT() {
      if (nc !== null) {
        for (var e = 0; e < nc.length; e++) {
          var t = nc[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, o = t.pending;
            if (o !== null) {
              var u = o.next;
              o.next = i, a.next = u;
            }
            t.pending = a;
          }
        }
        nc = null;
      }
    }
    function AE(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, Cg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, rv(e, i);
    }
    function sT(e, t, a, i) {
      var o = t.interleaved;
      o === null ? (a.next = a, Cg(t)) : (a.next = o.next, o.next = a), t.interleaved = a;
    }
    function uT(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, Cg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, rv(e, i);
    }
    function ci(e, t) {
      return rv(e, t);
    }
    var cT = rv;
    function rv(e, t) {
      e.lanes = At(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = At(a.lanes, t)), a === null && (e.flags & (In | ma)) !== at && NC(e);
      for (var i = e, o = e.return; o !== null; )
        o.childLanes = At(o.childLanes, t), a = o.alternate, a !== null ? a.childLanes = At(a.childLanes, t) : (o.flags & (In | ma)) !== at && NC(e), i = o, o = o.return;
      if (i.tag === z) {
        var u = i.stateNode;
        return u;
      } else
        return null;
    }
    var ME = 0, UE = 1, av = 2, _g = 3, iv = !1, wg, lv;
    wg = !1, lv = null;
    function Tg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: ge
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function zE(e, t) {
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
    function Go(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: ME,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Ps(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var o = i.shared;
      if (lv === o && !wg && (y("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), wg = !0), sj()) {
        var u = o.pending;
        return u === null ? t.next = t : (t.next = u.next, u.next = t), o.pending = t, cT(e, a);
      } else
        return uT(e, o, t, a);
    }
    function ov(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var o = i.shared;
        if (zd(a)) {
          var u = o.lanes;
          u = Pd(u, e.pendingLanes);
          var d = At(u, a);
          o.lanes = d, af(e, d);
        }
      }
    }
    function Rg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var o = i.updateQueue;
        if (a === o) {
          var u = null, d = null, m = a.firstBaseUpdate;
          if (m !== null) {
            var h = m;
            do {
              var E = {
                eventTime: h.eventTime,
                lane: h.lane,
                tag: h.tag,
                payload: h.payload,
                callback: h.callback,
                next: null
              };
              d === null ? u = d = E : (d.next = E, d = E), h = h.next;
            } while (h !== null);
            d === null ? u = d = t : (d.next = t, d = t);
          } else
            u = d = t;
          a = {
            baseState: o.baseState,
            firstBaseUpdate: u,
            lastBaseUpdate: d,
            shared: o.shared,
            effects: o.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var C = a.lastBaseUpdate;
      C === null ? a.firstBaseUpdate = t : C.next = t, a.lastBaseUpdate = t;
    }
    function fT(e, t, a, i, o, u) {
      switch (a.tag) {
        case UE: {
          var d = a.payload;
          if (typeof d == "function") {
            DE();
            var m = d.call(u, i, o);
            {
              if (e.mode & yn) {
                $n(!0);
                try {
                  d.call(u, i, o);
                } finally {
                  $n(!1);
                }
              }
              OE();
            }
            return m;
          }
          return d;
        }
        case _g:
          e.flags = e.flags & ~Cr | rt;
        case ME: {
          var h = a.payload, E;
          if (typeof h == "function") {
            DE(), E = h.call(u, i, o);
            {
              if (e.mode & yn) {
                $n(!0);
                try {
                  h.call(u, i, o);
                } finally {
                  $n(!1);
                }
              }
              OE();
            }
          } else
            E = h;
          return E == null ? i : Ot({}, i, E);
        }
        case av:
          return iv = !0, i;
      }
      return i;
    }
    function sv(e, t, a, i) {
      var o = e.updateQueue;
      iv = !1, lv = o.shared;
      var u = o.firstBaseUpdate, d = o.lastBaseUpdate, m = o.shared.pending;
      if (m !== null) {
        o.shared.pending = null;
        var h = m, E = h.next;
        h.next = null, d === null ? u = E : d.next = E, d = h;
        var C = e.alternate;
        if (C !== null) {
          var M = C.updateQueue, L = M.lastBaseUpdate;
          L !== d && (L === null ? M.firstBaseUpdate = E : L.next = E, M.lastBaseUpdate = h);
        }
      }
      if (u !== null) {
        var Q = o.baseState, X = ge, ae = null, He = null, st = null, nt = u;
        do {
          var Gt = nt.lane, Vt = nt.eventTime;
          if (Uo(i, Gt)) {
            if (st !== null) {
              var ie = {
                eventTime: Vt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Jt,
                tag: nt.tag,
                payload: nt.payload,
                callback: nt.callback,
                next: null
              };
              st = st.next = ie;
            }
            Q = fT(e, o, nt, Q, t, a);
            var B = nt.callback;
            if (B !== null && // If the update was already committed, we should not queue its
            // callback again.
            nt.lane !== Jt) {
              e.flags |= Nn;
              var Te = o.effects;
              Te === null ? o.effects = [nt] : Te.push(nt);
            }
          } else {
            var H = {
              eventTime: Vt,
              lane: Gt,
              tag: nt.tag,
              payload: nt.payload,
              callback: nt.callback,
              next: null
            };
            st === null ? (He = st = H, ae = Q) : st = st.next = H, X = At(X, Gt);
          }
          if (nt = nt.next, nt === null) {
            if (m = o.shared.pending, m === null)
              break;
            var Ge = m, Ve = Ge.next;
            Ge.next = null, nt = Ve, o.lastBaseUpdate = Ge, o.shared.pending = null;
          }
        } while (!0);
        st === null && (ae = Q), o.baseState = ae, o.firstBaseUpdate = He, o.lastBaseUpdate = st;
        var Et = o.shared.interleaved;
        if (Et !== null) {
          var Nt = Et;
          do
            X = At(X, Nt.lane), Nt = Nt.next;
          while (Nt !== Et);
        } else u === null && (o.shared.lanes = ge);
        Xp(X), e.lanes = X, e.memoizedState = Q;
      }
      lv = null;
    }
    function dT(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function FE() {
      iv = !1;
    }
    function uv() {
      return iv;
    }
    function PE(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var o = 0; o < i.length; o++) {
          var u = i[o], d = u.callback;
          d !== null && (u.callback = null, dT(d, a));
        }
    }
    var wp = {}, Hs = Ms(wp), Tp = Ms(wp), cv = Ms(wp);
    function fv(e) {
      if (e === wp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function HE() {
      var e = fv(cv.current);
      return e;
    }
    function jg(e, t) {
      _a(cv, t, e), _a(Tp, e, e), _a(Hs, wp, e);
      var a = kw(t);
      Ca(Hs, e), _a(Hs, a, e);
    }
    function Af(e) {
      Ca(Hs, e), Ca(Tp, e), Ca(cv, e);
    }
    function kg() {
      var e = fv(Hs.current);
      return e;
    }
    function BE(e) {
      fv(cv.current);
      var t = fv(Hs.current), a = Nw(t, e.type);
      t !== a && (_a(Tp, e, e), _a(Hs, a, e));
    }
    function Ng(e) {
      Tp.current === e && (Ca(Hs, e), Ca(Tp, e));
    }
    var pT = 0, VE = 1, IE = 1, Rp = 2, xl = Ms(pT);
    function Dg(e, t) {
      return (e & t) !== 0;
    }
    function Mf(e) {
      return e & VE;
    }
    function Og(e, t) {
      return e & VE | t;
    }
    function mT(e, t) {
      return e | t;
    }
    function Bs(e, t) {
      _a(xl, t, e);
    }
    function Uf(e) {
      Ca(xl, e);
    }
    function hT(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function dv(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === ce) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || lE(i) || qy(i))
              return t;
          }
        } else if (t.tag === he && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var o = (t.flags & rt) !== at;
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
    var fi = (
      /*   */
      0
    ), Mr = (
      /* */
      1
    ), no = (
      /*  */
      2
    ), Ur = (
      /*    */
      4
    ), na = (
      /*   */
      8
    ), Lg = [];
    function Ag() {
      for (var e = 0; e < Lg.length; e++) {
        var t = Lg[e];
        t._workInProgressVersionPrimary = null;
      }
      Lg.length = 0;
    }
    function vT(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var We = b.ReactCurrentDispatcher, jp = b.ReactCurrentBatchConfig, Mg, zf;
    Mg = /* @__PURE__ */ new Set();
    var rc = ge, gn = null, zr = null, Fr = null, pv = !1, kp = !1, Np = 0, yT = 0, gT = 25, se = null, Ki = null, Vs = -1, Ug = !1;
    function cn() {
      {
        var e = se;
        Ki === null ? Ki = [e] : Ki.push(e);
      }
    }
    function Me() {
      {
        var e = se;
        Ki !== null && (Vs++, Ki[Vs] !== e && ST(e));
      }
    }
    function Ff(e) {
      e != null && !zt(e) && y("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", se, typeof e);
    }
    function ST(e) {
      {
        var t = jt(gn);
        if (!Mg.has(t) && (Mg.add(t), Ki !== null)) {
          for (var a = "", i = 30, o = 0; o <= Vs; o++) {
            for (var u = Ki[o], d = o === Vs ? e : u, m = o + 1 + ". " + u; m.length < i; )
              m += " ";
            m += d + `
`, a += m;
          }
          y(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function wa() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function zg(e, t) {
      if (Ug)
        return !1;
      if (t === null)
        return y("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", se), !1;
      e.length !== t.length && y(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, se, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!Ce(e[a], t[a]))
          return !1;
      return !0;
    }
    function Pf(e, t, a, i, o, u) {
      rc = u, gn = t, Ki = e !== null ? e._debugHookTypes : null, Vs = -1, Ug = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = ge, e !== null && e.memoizedState !== null ? We.current = fb : Ki !== null ? We.current = cb : We.current = ub;
      var d = a(i, o);
      if (kp) {
        var m = 0;
        do {
          if (kp = !1, Np = 0, m >= gT)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          m += 1, Ug = !1, zr = null, Fr = null, t.updateQueue = null, Vs = -1, We.current = db, d = a(i, o);
        } while (kp);
      }
      We.current = Tv, t._debugHookTypes = Ki;
      var h = zr !== null && zr.next !== null;
      if (rc = ge, gn = null, zr = null, Fr = null, se = null, Ki = null, Vs = -1, e !== null && (e.flags & cr) !== (t.flags & cr) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & Pt) !== it && y("Internal React error: Expected static flag was missing. Please notify the React team."), pv = !1, h)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return d;
    }
    function Hf() {
      var e = Np !== 0;
      return Np = 0, e;
    }
    function $E(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & tn) !== it ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = ku(e.lanes, a);
    }
    function YE() {
      if (We.current = Tv, pv) {
        for (var e = gn.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        pv = !1;
      }
      rc = ge, gn = null, zr = null, Fr = null, Ki = null, Vs = -1, se = null, ab = !1, kp = !1, Np = 0;
    }
    function ro() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Fr === null ? gn.memoizedState = Fr = e : Fr = Fr.next = e, Fr;
    }
    function qi() {
      var e;
      if (zr === null) {
        var t = gn.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = zr.next;
      var a;
      if (Fr === null ? a = gn.memoizedState : a = Fr.next, a !== null)
        Fr = a, a = Fr.next, zr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        zr = e;
        var i = {
          memoizedState: zr.memoizedState,
          baseState: zr.baseState,
          baseQueue: zr.baseQueue,
          queue: zr.queue,
          next: null
        };
        Fr === null ? gn.memoizedState = Fr = i : Fr = Fr.next = i;
      }
      return Fr;
    }
    function WE() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Fg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Pg(e, t, a) {
      var i = ro(), o;
      a !== void 0 ? o = a(t) : o = t, i.memoizedState = i.baseState = o;
      var u = {
        pending: null,
        interleaved: null,
        lanes: ge,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: o
      };
      i.queue = u;
      var d = u.dispatch = CT.bind(null, gn, u);
      return [i.memoizedState, d];
    }
    function Hg(e, t, a) {
      var i = qi(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var u = zr, d = u.baseQueue, m = o.pending;
      if (m !== null) {
        if (d !== null) {
          var h = d.next, E = m.next;
          d.next = E, m.next = h;
        }
        u.baseQueue !== d && y("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), u.baseQueue = d = m, o.pending = null;
      }
      if (d !== null) {
        var C = d.next, M = u.baseState, L = null, Q = null, X = null, ae = C;
        do {
          var He = ae.lane;
          if (Uo(rc, He)) {
            if (X !== null) {
              var nt = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Jt,
                action: ae.action,
                hasEagerState: ae.hasEagerState,
                eagerState: ae.eagerState,
                next: null
              };
              X = X.next = nt;
            }
            if (ae.hasEagerState)
              M = ae.eagerState;
            else {
              var Gt = ae.action;
              M = e(M, Gt);
            }
          } else {
            var st = {
              lane: He,
              action: ae.action,
              hasEagerState: ae.hasEagerState,
              eagerState: ae.eagerState,
              next: null
            };
            X === null ? (Q = X = st, L = M) : X = X.next = st, gn.lanes = At(gn.lanes, He), Xp(He);
          }
          ae = ae.next;
        } while (ae !== null && ae !== C);
        X === null ? L = M : X.next = Q, Ce(M, i.memoizedState) || Pp(), i.memoizedState = M, i.baseState = L, i.baseQueue = X, o.lastRenderedState = M;
      }
      var Vt = o.interleaved;
      if (Vt !== null) {
        var H = Vt;
        do {
          var ie = H.lane;
          gn.lanes = At(gn.lanes, ie), Xp(ie), H = H.next;
        } while (H !== Vt);
      } else d === null && (o.lanes = ge);
      var B = o.dispatch;
      return [i.memoizedState, B];
    }
    function Bg(e, t, a) {
      var i = qi(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var u = o.dispatch, d = o.pending, m = i.memoizedState;
      if (d !== null) {
        o.pending = null;
        var h = d.next, E = h;
        do {
          var C = E.action;
          m = e(m, C), E = E.next;
        } while (E !== h);
        Ce(m, i.memoizedState) || Pp(), i.memoizedState = m, i.baseQueue === null && (i.baseState = m), o.lastRenderedState = m;
      }
      return [m, u];
    }
    function HN(e, t, a) {
    }
    function BN(e, t, a) {
    }
    function Vg(e, t, a) {
      var i = gn, o = ro(), u, d = ta();
      if (d) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        u = a(), zf || u !== a() && (y("The result of getServerSnapshot should be cached to avoid an infinite loop"), zf = !0);
      } else {
        if (u = t(), !zf) {
          var m = t();
          Ce(u, m) || (y("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
        }
        var h = Yv();
        if (h === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        nf(h, rc) || QE(i, t, u);
      }
      o.memoizedState = u;
      var E = {
        value: u,
        getSnapshot: t
      };
      return o.queue = E, gv(KE.bind(null, i, E, e), [e]), i.flags |= pa, Dp(Mr | na, GE.bind(null, i, E, u, t), void 0, null), u;
    }
    function mv(e, t, a) {
      var i = gn, o = qi(), u = t();
      if (!zf) {
        var d = t();
        Ce(u, d) || (y("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
      }
      var m = o.memoizedState, h = !Ce(m, u);
      h && (o.memoizedState = u, Pp());
      var E = o.queue;
      if (Lp(KE.bind(null, i, E, e), [e]), E.getSnapshot !== t || h || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      Fr !== null && Fr.memoizedState.tag & Mr) {
        i.flags |= pa, Dp(Mr | na, GE.bind(null, i, E, u, t), void 0, null);
        var C = Yv();
        if (C === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        nf(C, rc) || QE(i, t, u);
      }
      return u;
    }
    function QE(e, t, a) {
      e.flags |= Ss;
      var i = {
        getSnapshot: t,
        value: a
      }, o = gn.updateQueue;
      if (o === null)
        o = WE(), gn.updateQueue = o, o.stores = [i];
      else {
        var u = o.stores;
        u === null ? o.stores = [i] : u.push(i);
      }
    }
    function GE(e, t, a, i) {
      t.value = a, t.getSnapshot = i, qE(t) && XE(e);
    }
    function KE(e, t, a) {
      var i = function() {
        qE(t) && XE(e);
      };
      return a(i);
    }
    function qE(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !Ce(a, i);
      } catch {
        return !0;
      }
    }
    function XE(e) {
      var t = ci(e, vt);
      t !== null && Vr(t, e, vt, wn);
    }
    function hv(e) {
      var t = ro();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: ge,
        dispatch: null,
        lastRenderedReducer: Fg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = _T.bind(null, gn, a);
      return [t.memoizedState, i];
    }
    function Ig(e) {
      return Hg(Fg);
    }
    function $g(e) {
      return Bg(Fg);
    }
    function Dp(e, t, a, i) {
      var o = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, u = gn.updateQueue;
      if (u === null)
        u = WE(), gn.updateQueue = u, u.lastEffect = o.next = o;
      else {
        var d = u.lastEffect;
        if (d === null)
          u.lastEffect = o.next = o;
        else {
          var m = d.next;
          d.next = o, o.next = m, u.lastEffect = o;
        }
      }
      return o;
    }
    function Yg(e) {
      var t = ro();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function vv(e) {
      var t = qi();
      return t.memoizedState;
    }
    function Op(e, t, a, i) {
      var o = ro(), u = i === void 0 ? null : i;
      gn.flags |= e, o.memoizedState = Dp(Mr | t, a, void 0, u);
    }
    function yv(e, t, a, i) {
      var o = qi(), u = i === void 0 ? null : i, d = void 0;
      if (zr !== null) {
        var m = zr.memoizedState;
        if (d = m.destroy, u !== null) {
          var h = m.deps;
          if (zg(u, h)) {
            o.memoizedState = Dp(t, a, d, u);
            return;
          }
        }
      }
      gn.flags |= e, o.memoizedState = Dp(Mr | t, a, d, u);
    }
    function gv(e, t) {
      return (gn.mode & tn) !== it ? Op(zi | pa | kc, na, e, t) : Op(pa | kc, na, e, t);
    }
    function Lp(e, t) {
      return yv(pa, na, e, t);
    }
    function Wg(e, t) {
      return Op(Yt, no, e, t);
    }
    function Sv(e, t) {
      return yv(Yt, no, e, t);
    }
    function Qg(e, t) {
      var a = Yt;
      return a |= sl, (gn.mode & tn) !== it && (a |= Fl), Op(a, Ur, e, t);
    }
    function xv(e, t) {
      return yv(Yt, Ur, e, t);
    }
    function JE(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var o = t;
        o.hasOwnProperty("current") || y("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(o).join(", ") + "}");
        var u = e();
        return o.current = u, function() {
          o.current = null;
        };
      }
    }
    function Gg(e, t, a) {
      typeof t != "function" && y("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, o = Yt;
      return o |= sl, (gn.mode & tn) !== it && (o |= Fl), Op(o, Ur, JE.bind(null, t, e), i);
    }
    function Ev(e, t, a) {
      typeof t != "function" && y("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return yv(Yt, Ur, JE.bind(null, t, e), i);
    }
    function xT(e, t) {
    }
    var bv = xT;
    function Kg(e, t) {
      var a = ro(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function Cv(e, t) {
      var a = qi(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var u = o[1];
        if (zg(i, u))
          return o[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function qg(e, t) {
      var a = ro(), i = t === void 0 ? null : t, o = e();
      return a.memoizedState = [o, i], o;
    }
    function _v(e, t) {
      var a = qi(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var u = o[1];
        if (zg(i, u))
          return o[0];
      }
      var d = e();
      return a.memoizedState = [d, i], d;
    }
    function Xg(e) {
      var t = ro();
      return t.memoizedState = e, e;
    }
    function ZE(e) {
      var t = qi(), a = zr, i = a.memoizedState;
      return tb(t, i, e);
    }
    function eb(e) {
      var t = qi();
      if (zr === null)
        return t.memoizedState = e, e;
      var a = zr.memoizedState;
      return tb(t, a, e);
    }
    function tb(e, t, a) {
      var i = !Md(rc);
      if (i) {
        if (!Ce(a, t)) {
          var o = Fd();
          gn.lanes = At(gn.lanes, o), Xp(o), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Pp()), e.memoizedState = a, a;
    }
    function ET(e, t, a) {
      var i = oi();
      pr(th(i, Bi)), e(!0);
      var o = jp.transition;
      jp.transition = {};
      var u = jp.transition;
      jp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (pr(i), jp.transition = o, o === null && u._updatedFibers) {
          var d = u._updatedFibers.size;
          d > 10 && N("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), u._updatedFibers.clear();
        }
      }
    }
    function Jg() {
      var e = hv(!1), t = e[0], a = e[1], i = ET.bind(null, a), o = ro();
      return o.memoizedState = i, [t, i];
    }
    function nb() {
      var e = Ig(), t = e[0], a = qi(), i = a.memoizedState;
      return [t, i];
    }
    function rb() {
      var e = $g(), t = e[0], a = qi(), i = a.memoizedState;
      return [t, i];
    }
    var ab = !1;
    function bT() {
      return ab;
    }
    function Zg() {
      var e = ro(), t = Yv(), a = t.identifierPrefix, i;
      if (ta()) {
        var o = P0();
        i = ":" + a + "R" + o;
        var u = Np++;
        u > 0 && (i += "H" + u.toString(32)), i += ":";
      } else {
        var d = yT++;
        i = ":" + a + "r" + d.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function wv() {
      var e = qi(), t = e.memoizedState;
      return t;
    }
    function CT(e, t, a) {
      typeof arguments[3] == "function" && y("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Qs(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (ib(e))
        lb(t, o);
      else {
        var u = AE(e, t, o, i);
        if (u !== null) {
          var d = $a();
          Vr(u, e, i, d), ob(u, t, i);
        }
      }
      sb(e, i);
    }
    function _T(e, t, a) {
      typeof arguments[3] == "function" && y("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Qs(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (ib(e))
        lb(t, o);
      else {
        var u = e.alternate;
        if (e.lanes === ge && (u === null || u.lanes === ge)) {
          var d = t.lastRenderedReducer;
          if (d !== null) {
            var m;
            m = We.current, We.current = El;
            try {
              var h = t.lastRenderedState, E = d(h, a);
              if (o.hasEagerState = !0, o.eagerState = E, Ce(E, h)) {
                sT(e, t, o, i);
                return;
              }
            } catch {
            } finally {
              We.current = m;
            }
          }
        }
        var C = AE(e, t, o, i);
        if (C !== null) {
          var M = $a();
          Vr(C, e, i, M), ob(C, t, i);
        }
      }
      sb(e, i);
    }
    function ib(e) {
      var t = e.alternate;
      return e === gn || t !== null && t === gn;
    }
    function lb(e, t) {
      kp = pv = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function ob(e, t, a) {
      if (zd(a)) {
        var i = t.lanes;
        i = Pd(i, e.pendingLanes);
        var o = At(i, a);
        t.lanes = o, af(e, o);
      }
    }
    function sb(e, t, a) {
      Su(e, t);
    }
    var Tv = {
      readContext: Rr,
      useCallback: wa,
      useContext: wa,
      useEffect: wa,
      useImperativeHandle: wa,
      useInsertionEffect: wa,
      useLayoutEffect: wa,
      useMemo: wa,
      useReducer: wa,
      useRef: wa,
      useState: wa,
      useDebugValue: wa,
      useDeferredValue: wa,
      useTransition: wa,
      useMutableSource: wa,
      useSyncExternalStore: wa,
      useId: wa,
      unstable_isNewReconciler: Se
    }, ub = null, cb = null, fb = null, db = null, ao = null, El = null, Rv = null;
    {
      var eS = function() {
        y("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, kt = function() {
        y("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      ub = {
        readContext: function(e) {
          return Rr(e);
        },
        useCallback: function(e, t) {
          return se = "useCallback", cn(), Ff(t), Kg(e, t);
        },
        useContext: function(e) {
          return se = "useContext", cn(), Rr(e);
        },
        useEffect: function(e, t) {
          return se = "useEffect", cn(), Ff(t), gv(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return se = "useImperativeHandle", cn(), Ff(a), Gg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return se = "useInsertionEffect", cn(), Ff(t), Wg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return se = "useLayoutEffect", cn(), Ff(t), Qg(e, t);
        },
        useMemo: function(e, t) {
          se = "useMemo", cn(), Ff(t);
          var a = We.current;
          We.current = ao;
          try {
            return qg(e, t);
          } finally {
            We.current = a;
          }
        },
        useReducer: function(e, t, a) {
          se = "useReducer", cn();
          var i = We.current;
          We.current = ao;
          try {
            return Pg(e, t, a);
          } finally {
            We.current = i;
          }
        },
        useRef: function(e) {
          return se = "useRef", cn(), Yg(e);
        },
        useState: function(e) {
          se = "useState", cn();
          var t = We.current;
          We.current = ao;
          try {
            return hv(e);
          } finally {
            We.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return se = "useDebugValue", cn(), void 0;
        },
        useDeferredValue: function(e) {
          return se = "useDeferredValue", cn(), Xg(e);
        },
        useTransition: function() {
          return se = "useTransition", cn(), Jg();
        },
        useMutableSource: function(e, t, a) {
          return se = "useMutableSource", cn(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return se = "useSyncExternalStore", cn(), Vg(e, t, a);
        },
        useId: function() {
          return se = "useId", cn(), Zg();
        },
        unstable_isNewReconciler: Se
      }, cb = {
        readContext: function(e) {
          return Rr(e);
        },
        useCallback: function(e, t) {
          return se = "useCallback", Me(), Kg(e, t);
        },
        useContext: function(e) {
          return se = "useContext", Me(), Rr(e);
        },
        useEffect: function(e, t) {
          return se = "useEffect", Me(), gv(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return se = "useImperativeHandle", Me(), Gg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return se = "useInsertionEffect", Me(), Wg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return se = "useLayoutEffect", Me(), Qg(e, t);
        },
        useMemo: function(e, t) {
          se = "useMemo", Me();
          var a = We.current;
          We.current = ao;
          try {
            return qg(e, t);
          } finally {
            We.current = a;
          }
        },
        useReducer: function(e, t, a) {
          se = "useReducer", Me();
          var i = We.current;
          We.current = ao;
          try {
            return Pg(e, t, a);
          } finally {
            We.current = i;
          }
        },
        useRef: function(e) {
          return se = "useRef", Me(), Yg(e);
        },
        useState: function(e) {
          se = "useState", Me();
          var t = We.current;
          We.current = ao;
          try {
            return hv(e);
          } finally {
            We.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return se = "useDebugValue", Me(), void 0;
        },
        useDeferredValue: function(e) {
          return se = "useDeferredValue", Me(), Xg(e);
        },
        useTransition: function() {
          return se = "useTransition", Me(), Jg();
        },
        useMutableSource: function(e, t, a) {
          return se = "useMutableSource", Me(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return se = "useSyncExternalStore", Me(), Vg(e, t, a);
        },
        useId: function() {
          return se = "useId", Me(), Zg();
        },
        unstable_isNewReconciler: Se
      }, fb = {
        readContext: function(e) {
          return Rr(e);
        },
        useCallback: function(e, t) {
          return se = "useCallback", Me(), Cv(e, t);
        },
        useContext: function(e) {
          return se = "useContext", Me(), Rr(e);
        },
        useEffect: function(e, t) {
          return se = "useEffect", Me(), Lp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return se = "useImperativeHandle", Me(), Ev(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return se = "useInsertionEffect", Me(), Sv(e, t);
        },
        useLayoutEffect: function(e, t) {
          return se = "useLayoutEffect", Me(), xv(e, t);
        },
        useMemo: function(e, t) {
          se = "useMemo", Me();
          var a = We.current;
          We.current = El;
          try {
            return _v(e, t);
          } finally {
            We.current = a;
          }
        },
        useReducer: function(e, t, a) {
          se = "useReducer", Me();
          var i = We.current;
          We.current = El;
          try {
            return Hg(e, t, a);
          } finally {
            We.current = i;
          }
        },
        useRef: function(e) {
          return se = "useRef", Me(), vv();
        },
        useState: function(e) {
          se = "useState", Me();
          var t = We.current;
          We.current = El;
          try {
            return Ig(e);
          } finally {
            We.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return se = "useDebugValue", Me(), bv();
        },
        useDeferredValue: function(e) {
          return se = "useDeferredValue", Me(), ZE(e);
        },
        useTransition: function() {
          return se = "useTransition", Me(), nb();
        },
        useMutableSource: function(e, t, a) {
          return se = "useMutableSource", Me(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return se = "useSyncExternalStore", Me(), mv(e, t);
        },
        useId: function() {
          return se = "useId", Me(), wv();
        },
        unstable_isNewReconciler: Se
      }, db = {
        readContext: function(e) {
          return Rr(e);
        },
        useCallback: function(e, t) {
          return se = "useCallback", Me(), Cv(e, t);
        },
        useContext: function(e) {
          return se = "useContext", Me(), Rr(e);
        },
        useEffect: function(e, t) {
          return se = "useEffect", Me(), Lp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return se = "useImperativeHandle", Me(), Ev(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return se = "useInsertionEffect", Me(), Sv(e, t);
        },
        useLayoutEffect: function(e, t) {
          return se = "useLayoutEffect", Me(), xv(e, t);
        },
        useMemo: function(e, t) {
          se = "useMemo", Me();
          var a = We.current;
          We.current = Rv;
          try {
            return _v(e, t);
          } finally {
            We.current = a;
          }
        },
        useReducer: function(e, t, a) {
          se = "useReducer", Me();
          var i = We.current;
          We.current = Rv;
          try {
            return Bg(e, t, a);
          } finally {
            We.current = i;
          }
        },
        useRef: function(e) {
          return se = "useRef", Me(), vv();
        },
        useState: function(e) {
          se = "useState", Me();
          var t = We.current;
          We.current = Rv;
          try {
            return $g(e);
          } finally {
            We.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return se = "useDebugValue", Me(), bv();
        },
        useDeferredValue: function(e) {
          return se = "useDeferredValue", Me(), eb(e);
        },
        useTransition: function() {
          return se = "useTransition", Me(), rb();
        },
        useMutableSource: function(e, t, a) {
          return se = "useMutableSource", Me(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return se = "useSyncExternalStore", Me(), mv(e, t);
        },
        useId: function() {
          return se = "useId", Me(), wv();
        },
        unstable_isNewReconciler: Se
      }, ao = {
        readContext: function(e) {
          return eS(), Rr(e);
        },
        useCallback: function(e, t) {
          return se = "useCallback", kt(), cn(), Kg(e, t);
        },
        useContext: function(e) {
          return se = "useContext", kt(), cn(), Rr(e);
        },
        useEffect: function(e, t) {
          return se = "useEffect", kt(), cn(), gv(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return se = "useImperativeHandle", kt(), cn(), Gg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return se = "useInsertionEffect", kt(), cn(), Wg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return se = "useLayoutEffect", kt(), cn(), Qg(e, t);
        },
        useMemo: function(e, t) {
          se = "useMemo", kt(), cn();
          var a = We.current;
          We.current = ao;
          try {
            return qg(e, t);
          } finally {
            We.current = a;
          }
        },
        useReducer: function(e, t, a) {
          se = "useReducer", kt(), cn();
          var i = We.current;
          We.current = ao;
          try {
            return Pg(e, t, a);
          } finally {
            We.current = i;
          }
        },
        useRef: function(e) {
          return se = "useRef", kt(), cn(), Yg(e);
        },
        useState: function(e) {
          se = "useState", kt(), cn();
          var t = We.current;
          We.current = ao;
          try {
            return hv(e);
          } finally {
            We.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return se = "useDebugValue", kt(), cn(), void 0;
        },
        useDeferredValue: function(e) {
          return se = "useDeferredValue", kt(), cn(), Xg(e);
        },
        useTransition: function() {
          return se = "useTransition", kt(), cn(), Jg();
        },
        useMutableSource: function(e, t, a) {
          return se = "useMutableSource", kt(), cn(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return se = "useSyncExternalStore", kt(), cn(), Vg(e, t, a);
        },
        useId: function() {
          return se = "useId", kt(), cn(), Zg();
        },
        unstable_isNewReconciler: Se
      }, El = {
        readContext: function(e) {
          return eS(), Rr(e);
        },
        useCallback: function(e, t) {
          return se = "useCallback", kt(), Me(), Cv(e, t);
        },
        useContext: function(e) {
          return se = "useContext", kt(), Me(), Rr(e);
        },
        useEffect: function(e, t) {
          return se = "useEffect", kt(), Me(), Lp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return se = "useImperativeHandle", kt(), Me(), Ev(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return se = "useInsertionEffect", kt(), Me(), Sv(e, t);
        },
        useLayoutEffect: function(e, t) {
          return se = "useLayoutEffect", kt(), Me(), xv(e, t);
        },
        useMemo: function(e, t) {
          se = "useMemo", kt(), Me();
          var a = We.current;
          We.current = El;
          try {
            return _v(e, t);
          } finally {
            We.current = a;
          }
        },
        useReducer: function(e, t, a) {
          se = "useReducer", kt(), Me();
          var i = We.current;
          We.current = El;
          try {
            return Hg(e, t, a);
          } finally {
            We.current = i;
          }
        },
        useRef: function(e) {
          return se = "useRef", kt(), Me(), vv();
        },
        useState: function(e) {
          se = "useState", kt(), Me();
          var t = We.current;
          We.current = El;
          try {
            return Ig(e);
          } finally {
            We.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return se = "useDebugValue", kt(), Me(), bv();
        },
        useDeferredValue: function(e) {
          return se = "useDeferredValue", kt(), Me(), ZE(e);
        },
        useTransition: function() {
          return se = "useTransition", kt(), Me(), nb();
        },
        useMutableSource: function(e, t, a) {
          return se = "useMutableSource", kt(), Me(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return se = "useSyncExternalStore", kt(), Me(), mv(e, t);
        },
        useId: function() {
          return se = "useId", kt(), Me(), wv();
        },
        unstable_isNewReconciler: Se
      }, Rv = {
        readContext: function(e) {
          return eS(), Rr(e);
        },
        useCallback: function(e, t) {
          return se = "useCallback", kt(), Me(), Cv(e, t);
        },
        useContext: function(e) {
          return se = "useContext", kt(), Me(), Rr(e);
        },
        useEffect: function(e, t) {
          return se = "useEffect", kt(), Me(), Lp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return se = "useImperativeHandle", kt(), Me(), Ev(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return se = "useInsertionEffect", kt(), Me(), Sv(e, t);
        },
        useLayoutEffect: function(e, t) {
          return se = "useLayoutEffect", kt(), Me(), xv(e, t);
        },
        useMemo: function(e, t) {
          se = "useMemo", kt(), Me();
          var a = We.current;
          We.current = El;
          try {
            return _v(e, t);
          } finally {
            We.current = a;
          }
        },
        useReducer: function(e, t, a) {
          se = "useReducer", kt(), Me();
          var i = We.current;
          We.current = El;
          try {
            return Bg(e, t, a);
          } finally {
            We.current = i;
          }
        },
        useRef: function(e) {
          return se = "useRef", kt(), Me(), vv();
        },
        useState: function(e) {
          se = "useState", kt(), Me();
          var t = We.current;
          We.current = El;
          try {
            return $g(e);
          } finally {
            We.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return se = "useDebugValue", kt(), Me(), bv();
        },
        useDeferredValue: function(e) {
          return se = "useDeferredValue", kt(), Me(), eb(e);
        },
        useTransition: function() {
          return se = "useTransition", kt(), Me(), rb();
        },
        useMutableSource: function(e, t, a) {
          return se = "useMutableSource", kt(), Me(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return se = "useSyncExternalStore", kt(), Me(), mv(e, t);
        },
        useId: function() {
          return se = "useId", kt(), Me(), wv();
        },
        unstable_isNewReconciler: Se
      };
    }
    var Is = S.unstable_now, pb = 0, jv = -1, Ap = -1, kv = -1, tS = !1, Nv = !1;
    function mb() {
      return tS;
    }
    function wT() {
      Nv = !0;
    }
    function TT() {
      tS = !1, Nv = !1;
    }
    function RT() {
      tS = Nv, Nv = !1;
    }
    function hb() {
      return pb;
    }
    function vb() {
      pb = Is();
    }
    function nS(e) {
      Ap = Is(), e.actualStartTime < 0 && (e.actualStartTime = Is());
    }
    function yb(e) {
      Ap = -1;
    }
    function Dv(e, t) {
      if (Ap >= 0) {
        var a = Is() - Ap;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Ap = -1;
      }
    }
    function io(e) {
      if (jv >= 0) {
        var t = Is() - jv;
        jv = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case z:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case Ee:
              var o = a.stateNode;
              o.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function rS(e) {
      if (kv >= 0) {
        var t = Is() - kv;
        kv = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case z:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case Ee:
              var o = a.stateNode;
              o !== null && (o.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function lo() {
      jv = Is();
    }
    function aS() {
      kv = Is();
    }
    function iS(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function bl(e, t) {
      if (e && e.defaultProps) {
        var a = Ot({}, t), i = e.defaultProps;
        for (var o in i)
          a[o] === void 0 && (a[o] = i[o]);
        return a;
      }
      return t;
    }
    var lS = {}, oS, sS, uS, cS, fS, gb, Ov, dS, pS, mS, Mp;
    {
      oS = /* @__PURE__ */ new Set(), sS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), cS = /* @__PURE__ */ new Set(), dS = /* @__PURE__ */ new Set(), fS = /* @__PURE__ */ new Set(), pS = /* @__PURE__ */ new Set(), mS = /* @__PURE__ */ new Set(), Mp = /* @__PURE__ */ new Set();
      var Sb = /* @__PURE__ */ new Set();
      Ov = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          Sb.has(a) || (Sb.add(a), y("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, gb = function(e, t) {
        if (t === void 0) {
          var a = qt(e) || "Component";
          fS.has(a) || (fS.add(a), y("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(lS, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(lS);
    }
    function hS(e, t, a, i) {
      var o = e.memoizedState, u = a(i, o);
      {
        if (e.mode & yn) {
          $n(!0);
          try {
            u = a(i, o);
          } finally {
            $n(!1);
          }
        }
        gb(t, u);
      }
      var d = u == null ? o : Ot({}, o, u);
      if (e.memoizedState = d, e.lanes === ge) {
        var m = e.updateQueue;
        m.baseState = d;
      }
    }
    var vS = {
      isMounted: Pm,
      enqueueSetState: function(e, t, a) {
        var i = gs(e), o = $a(), u = Qs(i), d = Go(o, u);
        d.payload = t, a != null && (Ov(a, "setState"), d.callback = a);
        var m = Ps(i, d, u);
        m !== null && (Vr(m, i, u, o), ov(m, i, u)), Su(i, u);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = gs(e), o = $a(), u = Qs(i), d = Go(o, u);
        d.tag = UE, d.payload = t, a != null && (Ov(a, "replaceState"), d.callback = a);
        var m = Ps(i, d, u);
        m !== null && (Vr(m, i, u, o), ov(m, i, u)), Su(i, u);
      },
      enqueueForceUpdate: function(e, t) {
        var a = gs(e), i = $a(), o = Qs(a), u = Go(i, o);
        u.tag = av, t != null && (Ov(t, "forceUpdate"), u.callback = t);
        var d = Ps(a, u, o);
        d !== null && (Vr(d, a, o, i), ov(d, a, o)), Uc(a, o);
      }
    };
    function xb(e, t, a, i, o, u, d) {
      var m = e.stateNode;
      if (typeof m.shouldComponentUpdate == "function") {
        var h = m.shouldComponentUpdate(i, u, d);
        {
          if (e.mode & yn) {
            $n(!0);
            try {
              h = m.shouldComponentUpdate(i, u, d);
            } finally {
              $n(!1);
            }
          }
          h === void 0 && y("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", qt(t) || "Component");
        }
        return h;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Xe(a, i) || !Xe(o, u) : !0;
    }
    function jT(e, t, a) {
      var i = e.stateNode;
      {
        var o = qt(t) || "Component", u = i.render;
        u || (t.prototype && typeof t.prototype.render == "function" ? y("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", o) : y("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", o)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && y("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", o), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && y("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", o), i.propTypes && y("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", o), i.contextType && y("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", o), t.childContextTypes && !Mp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & yn) === it && (Mp.add(t), y(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), t.contextTypes && !Mp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & yn) === it && (Mp.add(t), y(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), i.contextTypes && y("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", o), t.contextType && t.contextTypes && !pS.has(t) && (pS.add(t), y("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", o)), typeof i.componentShouldUpdate == "function" && y("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", o), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && y("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", qt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && y("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", o), typeof i.componentDidReceiveProps == "function" && y("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", o), typeof i.componentWillRecieveProps == "function" && y("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", o), typeof i.UNSAFE_componentWillRecieveProps == "function" && y("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", o);
        var d = i.props !== a;
        i.props !== void 0 && d && y("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", o, o), i.defaultProps && y("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", o, o), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !uS.has(t) && (uS.add(t), y("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", qt(t))), typeof i.getDerivedStateFromProps == "function" && y("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof i.getDerivedStateFromError == "function" && y("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof t.getSnapshotBeforeUpdate == "function" && y("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", o);
        var m = i.state;
        m && (typeof m != "object" || zt(m)) && y("%s.state: must be set to an object or null", o), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && y("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", o);
      }
    }
    function Eb(e, t) {
      t.updater = vS, e.stateNode = t, bo(t, e), t._reactInternalInstance = lS;
    }
    function bb(e, t, a) {
      var i = !1, o = _i, u = _i, d = t.contextType;
      if ("contextType" in t) {
        var m = (
          // Allow null for conditional declaration
          d === null || d !== void 0 && d.$$typeof === R && d._context === void 0
        );
        if (!m && !mS.has(t)) {
          mS.add(t);
          var h = "";
          d === void 0 ? h = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof d != "object" ? h = " However, it is set to a " + typeof d + "." : d.$$typeof === Da ? h = " Did you accidentally pass the Context.Provider instead?" : d._context !== void 0 ? h = " Did you accidentally pass the Context.Consumer instead?" : h = " However, it is set to an object with keys {" + Object.keys(d).join(", ") + "}.", y("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", qt(t) || "Component", h);
        }
      }
      if (typeof d == "object" && d !== null)
        u = Rr(d);
      else {
        o = Tf(e, t, !0);
        var E = t.contextTypes;
        i = E != null, u = i ? Rf(e, o) : _i;
      }
      var C = new t(a, u);
      if (e.mode & yn) {
        $n(!0);
        try {
          C = new t(a, u);
        } finally {
          $n(!1);
        }
      }
      var M = e.memoizedState = C.state !== null && C.state !== void 0 ? C.state : null;
      Eb(e, C);
      {
        if (typeof t.getDerivedStateFromProps == "function" && M === null) {
          var L = qt(t) || "Component";
          sS.has(L) || (sS.add(L), y("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", L, C.state === null ? "null" : "undefined", L));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof C.getSnapshotBeforeUpdate == "function") {
          var Q = null, X = null, ae = null;
          if (typeof C.componentWillMount == "function" && C.componentWillMount.__suppressDeprecationWarning !== !0 ? Q = "componentWillMount" : typeof C.UNSAFE_componentWillMount == "function" && (Q = "UNSAFE_componentWillMount"), typeof C.componentWillReceiveProps == "function" && C.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? X = "componentWillReceiveProps" : typeof C.UNSAFE_componentWillReceiveProps == "function" && (X = "UNSAFE_componentWillReceiveProps"), typeof C.componentWillUpdate == "function" && C.componentWillUpdate.__suppressDeprecationWarning !== !0 ? ae = "componentWillUpdate" : typeof C.UNSAFE_componentWillUpdate == "function" && (ae = "UNSAFE_componentWillUpdate"), Q !== null || X !== null || ae !== null) {
            var He = qt(t) || "Component", st = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            cS.has(He) || (cS.add(He), y(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, He, st, Q !== null ? `
  ` + Q : "", X !== null ? `
  ` + X : "", ae !== null ? `
  ` + ae : ""));
          }
        }
      }
      return i && fE(e, o, u), C;
    }
    function kT(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (y("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", jt(e) || "Component"), vS.enqueueReplaceState(t, t.state, null));
    }
    function Cb(e, t, a, i) {
      var o = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== o) {
        {
          var u = jt(e) || "Component";
          oS.has(u) || (oS.add(u), y("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", u));
        }
        vS.enqueueReplaceState(t, t.state, null);
      }
    }
    function yS(e, t, a, i) {
      jT(e, t, a);
      var o = e.stateNode;
      o.props = a, o.state = e.memoizedState, o.refs = {}, Tg(e);
      var u = t.contextType;
      if (typeof u == "object" && u !== null)
        o.context = Rr(u);
      else {
        var d = Tf(e, t, !0);
        o.context = Rf(e, d);
      }
      {
        if (o.state === a) {
          var m = qt(t) || "Component";
          dS.has(m) || (dS.add(m), y("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", m));
        }
        e.mode & yn && Sl.recordLegacyContextWarning(e, o), Sl.recordUnsafeLifecycleWarnings(e, o);
      }
      o.state = e.memoizedState;
      var h = t.getDerivedStateFromProps;
      if (typeof h == "function" && (hS(e, t, h, a), o.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof o.getSnapshotBeforeUpdate != "function" && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (kT(e, o), sv(e, a, o, i), o.state = e.memoizedState), typeof o.componentDidMount == "function") {
        var E = Yt;
        E |= sl, (e.mode & tn) !== it && (E |= Fl), e.flags |= E;
      }
    }
    function NT(e, t, a, i) {
      var o = e.stateNode, u = e.memoizedProps;
      o.props = u;
      var d = o.context, m = t.contextType, h = _i;
      if (typeof m == "object" && m !== null)
        h = Rr(m);
      else {
        var E = Tf(e, t, !0);
        h = Rf(e, E);
      }
      var C = t.getDerivedStateFromProps, M = typeof C == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      !M && (typeof o.UNSAFE_componentWillReceiveProps == "function" || typeof o.componentWillReceiveProps == "function") && (u !== a || d !== h) && Cb(e, o, a, h), FE();
      var L = e.memoizedState, Q = o.state = L;
      if (sv(e, a, o, i), Q = e.memoizedState, u === a && L === Q && !Ih() && !uv()) {
        if (typeof o.componentDidMount == "function") {
          var X = Yt;
          X |= sl, (e.mode & tn) !== it && (X |= Fl), e.flags |= X;
        }
        return !1;
      }
      typeof C == "function" && (hS(e, t, C, a), Q = e.memoizedState);
      var ae = uv() || xb(e, t, u, a, L, Q, h);
      if (ae) {
        if (!M && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function") {
          var He = Yt;
          He |= sl, (e.mode & tn) !== it && (He |= Fl), e.flags |= He;
        }
      } else {
        if (typeof o.componentDidMount == "function") {
          var st = Yt;
          st |= sl, (e.mode & tn) !== it && (st |= Fl), e.flags |= st;
        }
        e.memoizedProps = a, e.memoizedState = Q;
      }
      return o.props = a, o.state = Q, o.context = h, ae;
    }
    function DT(e, t, a, i, o) {
      var u = t.stateNode;
      zE(e, t);
      var d = t.memoizedProps, m = t.type === t.elementType ? d : bl(t.type, d);
      u.props = m;
      var h = t.pendingProps, E = u.context, C = a.contextType, M = _i;
      if (typeof C == "object" && C !== null)
        M = Rr(C);
      else {
        var L = Tf(t, a, !0);
        M = Rf(t, L);
      }
      var Q = a.getDerivedStateFromProps, X = typeof Q == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !X && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (d !== h || E !== M) && Cb(t, u, i, M), FE();
      var ae = t.memoizedState, He = u.state = ae;
      if (sv(t, i, u, o), He = t.memoizedState, d === h && ae === He && !Ih() && !uv() && !Ie)
        return typeof u.componentDidUpdate == "function" && (d !== e.memoizedProps || ae !== e.memoizedState) && (t.flags |= Yt), typeof u.getSnapshotBeforeUpdate == "function" && (d !== e.memoizedProps || ae !== e.memoizedState) && (t.flags |= Sr), !1;
      typeof Q == "function" && (hS(t, a, Q, i), He = t.memoizedState);
      var st = uv() || xb(t, a, m, i, ae, He, M) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Ie;
      return st ? (!X && (typeof u.UNSAFE_componentWillUpdate == "function" || typeof u.componentWillUpdate == "function") && (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(i, He, M), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(i, He, M)), typeof u.componentDidUpdate == "function" && (t.flags |= Yt), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= Sr)) : (typeof u.componentDidUpdate == "function" && (d !== e.memoizedProps || ae !== e.memoizedState) && (t.flags |= Yt), typeof u.getSnapshotBeforeUpdate == "function" && (d !== e.memoizedProps || ae !== e.memoizedState) && (t.flags |= Sr), t.memoizedProps = i, t.memoizedState = He), u.props = i, u.state = He, u.context = M, st;
    }
    function ac(e, t) {
      return {
        value: e,
        source: t,
        stack: nl(t),
        digest: null
      };
    }
    function gS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function OT(e, t) {
      return !0;
    }
    function SS(e, t) {
      try {
        var a = OT(e, t);
        if (a === !1)
          return;
        var i = t.value, o = t.source, u = t.stack, d = u !== null ? u : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === j)
            return;
          console.error(i);
        }
        var m = o ? jt(o) : null, h = m ? "The above error occurred in the <" + m + "> component:" : "The above error occurred in one of your React components:", E;
        if (e.tag === z)
          E = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var C = jt(e) || "Anonymous";
          E = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + C + ".");
        }
        var M = h + `
` + d + `

` + ("" + E);
        console.error(M);
      } catch (L) {
        setTimeout(function() {
          throw L;
        });
      }
    }
    var LT = typeof WeakMap == "function" ? WeakMap : Map;
    function _b(e, t, a) {
      var i = Go(wn, a);
      i.tag = _g, i.payload = {
        element: null
      };
      var o = t.value;
      return i.callback = function() {
        wj(o), SS(e, t);
      }, i;
    }
    function xS(e, t, a) {
      var i = Go(wn, a);
      i.tag = _g;
      var o = e.type.getDerivedStateFromError;
      if (typeof o == "function") {
        var u = t.value;
        i.payload = function() {
          return o(u);
        }, i.callback = function() {
          MC(e), SS(e, t);
        };
      }
      var d = e.stateNode;
      return d !== null && typeof d.componentDidCatch == "function" && (i.callback = function() {
        MC(e), SS(e, t), typeof o != "function" && Cj(this);
        var h = t.value, E = t.stack;
        this.componentDidCatch(h, {
          componentStack: E !== null ? E : ""
        }), typeof o != "function" && (Sa(e.lanes, vt) || y("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", jt(e) || "Unknown"));
      }), i;
    }
    function wb(e, t, a) {
      var i = e.pingCache, o;
      if (i === null ? (i = e.pingCache = new LT(), o = /* @__PURE__ */ new Set(), i.set(t, o)) : (o = i.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), i.set(t, o))), !o.has(a)) {
        o.add(a);
        var u = Tj.bind(null, e, t, a);
        ya && Jp(e, a), t.then(u, u);
      }
    }
    function AT(e, t, a, i) {
      var o = e.updateQueue;
      if (o === null) {
        var u = /* @__PURE__ */ new Set();
        u.add(a), e.updateQueue = u;
      } else
        o.add(a);
    }
    function MT(e, t) {
      var a = e.tag;
      if ((e.mode & Pt) === it && (a === U || a === ke || a === I)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function Tb(e) {
      var t = e;
      do {
        if (t.tag === ce && hT(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function Rb(e, t, a, i, o) {
      if ((e.mode & Pt) === it) {
        if (e === t)
          e.flags |= Cr;
        else {
          if (e.flags |= rt, a.flags |= jc, a.flags &= -52805, a.tag === j) {
            var u = a.alternate;
            if (u === null)
              a.tag = Ue;
            else {
              var d = Go(wn, vt);
              d.tag = av, Ps(a, d, vt);
            }
          }
          a.lanes = At(a.lanes, vt);
        }
        return e;
      }
      return e.flags |= Cr, e.lanes = o, e;
    }
    function UT(e, t, a, i, o) {
      if (a.flags |= pu, ya && Jp(e, o), i !== null && typeof i == "object" && typeof i.then == "function") {
        var u = i;
        MT(a), ta() && a.mode & Pt && gE();
        var d = Tb(t);
        if (d !== null) {
          d.flags &= ~$r, Rb(d, t, a, e, o), d.mode & Pt && wb(e, u, o), AT(d, e, u);
          return;
        } else {
          if (!Qm(o)) {
            wb(e, u, o), ZS();
            return;
          }
          var m = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = m;
        }
      } else if (ta() && a.mode & Pt) {
        gE();
        var h = Tb(t);
        if (h !== null) {
          (h.flags & Cr) === at && (h.flags |= $r), Rb(h, t, a, e, o), dg(ac(i, a));
          return;
        }
      }
      i = ac(i, a), hj(i);
      var E = t;
      do {
        switch (E.tag) {
          case z: {
            var C = i;
            E.flags |= Cr;
            var M = ju(o);
            E.lanes = At(E.lanes, M);
            var L = _b(E, C, M);
            Rg(E, L);
            return;
          }
          case j:
            var Q = i, X = E.type, ae = E.stateNode;
            if ((E.flags & rt) === at && (typeof X.getDerivedStateFromError == "function" || ae !== null && typeof ae.componentDidCatch == "function" && !TC(ae))) {
              E.flags |= Cr;
              var He = ju(o);
              E.lanes = At(E.lanes, He);
              var st = xS(E, Q, He);
              Rg(E, st);
              return;
            }
            break;
        }
        E = E.return;
      } while (E !== null);
    }
    function zT() {
      return null;
    }
    var Up = b.ReactCurrentOwner, Cl = !1, ES, zp, bS, CS, _S, ic, wS, Lv, Fp;
    ES = {}, zp = {}, bS = {}, CS = {}, _S = {}, ic = !1, wS = {}, Lv = {}, Fp = {};
    function Va(e, t, a, i) {
      e === null ? t.child = NE(t, null, a, i) : t.child = Df(t, e.child, a, i);
    }
    function FT(e, t, a, i) {
      t.child = Df(t, e.child, null, i), t.child = Df(t, null, a, i);
    }
    function jb(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var u = a.propTypes;
        u && yl(
          u,
          i,
          // Resolved props
          "prop",
          qt(a)
        );
      }
      var d = a.render, m = t.ref, h, E;
      Lf(t, o), Fa(t);
      {
        if (Up.current = t, gr(!0), h = Pf(e, t, d, i, m, o), E = Hf(), t.mode & yn) {
          $n(!0);
          try {
            h = Pf(e, t, d, i, m, o), E = Hf();
          } finally {
            $n(!1);
          }
        }
        gr(!1);
      }
      return Pa(), e !== null && !Cl ? ($E(e, t, o), Ko(e, t, o)) : (ta() && E && lg(t), t.flags |= Si, Va(e, t, h, o), t.child);
    }
    function kb(e, t, a, i, o) {
      if (e === null) {
        var u = a.type;
        if (Ij(u) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var d = u;
          return d = Gf(u), t.tag = I, t.type = d, jS(t, u), Nb(e, t, d, i, o);
        }
        {
          var m = u.propTypes;
          if (m && yl(
            m,
            i,
            // Resolved props
            "prop",
            qt(u)
          ), a.defaultProps !== void 0) {
            var h = qt(u) || "Unknown";
            Fp[h] || (y("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", h), Fp[h] = !0);
          }
        }
        var E = cx(a.type, null, i, t, t.mode, o);
        return E.ref = t.ref, E.return = t, t.child = E, E;
      }
      {
        var C = a.type, M = C.propTypes;
        M && yl(
          M,
          i,
          // Resolved props
          "prop",
          qt(C)
        );
      }
      var L = e.child, Q = AS(e, o);
      if (!Q) {
        var X = L.memoizedProps, ae = a.compare;
        if (ae = ae !== null ? ae : Xe, ae(X, i) && e.ref === t.ref)
          return Ko(e, t, o);
      }
      t.flags |= Si;
      var He = cc(L, i);
      return He.ref = t.ref, He.return = t, t.child = He, He;
    }
    function Nb(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var u = t.elementType;
        if (u.$$typeof === _t) {
          var d = u, m = d._payload, h = d._init;
          try {
            u = h(m);
          } catch {
            u = null;
          }
          var E = u && u.propTypes;
          E && yl(
            E,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            qt(u)
          );
        }
      }
      if (e !== null) {
        var C = e.memoizedProps;
        if (Xe(C, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (Cl = !1, t.pendingProps = i = C, AS(e, o))
            (e.flags & jc) !== at && (Cl = !0);
          else return t.lanes = e.lanes, Ko(e, t, o);
      }
      return TS(e, t, a, i, o);
    }
    function Db(e, t, a) {
      var i = t.pendingProps, o = i.children, u = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || Re)
        if ((t.mode & Pt) === it) {
          var d = {
            baseLanes: ge,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = d, Wv(t, a);
        } else if (Sa(a, ga)) {
          var M = {
            baseLanes: ge,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = M;
          var L = u !== null ? u.baseLanes : a;
          Wv(t, L);
        } else {
          var m = null, h;
          if (u !== null) {
            var E = u.baseLanes;
            h = At(E, a);
          } else
            h = a;
          t.lanes = t.childLanes = ga;
          var C = {
            baseLanes: h,
            cachePool: m,
            transitions: null
          };
          return t.memoizedState = C, t.updateQueue = null, Wv(t, h), null;
        }
      else {
        var Q;
        u !== null ? (Q = At(u.baseLanes, a), t.memoizedState = null) : Q = a, Wv(t, Q);
      }
      return Va(e, t, o, a), t.child;
    }
    function PT(e, t, a) {
      var i = t.pendingProps;
      return Va(e, t, i, a), t.child;
    }
    function HT(e, t, a) {
      var i = t.pendingProps.children;
      return Va(e, t, i, a), t.child;
    }
    function BT(e, t, a) {
      {
        t.flags |= Yt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var o = t.pendingProps, u = o.children;
      return Va(e, t, u, a), t.child;
    }
    function Ob(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Kn, t.flags |= xs);
    }
    function TS(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var u = a.propTypes;
        u && yl(
          u,
          i,
          // Resolved props
          "prop",
          qt(a)
        );
      }
      var d;
      {
        var m = Tf(t, a, !0);
        d = Rf(t, m);
      }
      var h, E;
      Lf(t, o), Fa(t);
      {
        if (Up.current = t, gr(!0), h = Pf(e, t, a, i, d, o), E = Hf(), t.mode & yn) {
          $n(!0);
          try {
            h = Pf(e, t, a, i, d, o), E = Hf();
          } finally {
            $n(!1);
          }
        }
        gr(!1);
      }
      return Pa(), e !== null && !Cl ? ($E(e, t, o), Ko(e, t, o)) : (ta() && E && lg(t), t.flags |= Si, Va(e, t, h, o), t.child);
    }
    function Lb(e, t, a, i, o) {
      {
        switch (ak(t)) {
          case !1: {
            var u = t.stateNode, d = t.type, m = new d(t.memoizedProps, u.context), h = m.state;
            u.updater.enqueueSetState(u, h, null);
            break;
          }
          case !0: {
            t.flags |= rt, t.flags |= Cr;
            var E = new Error("Simulated error coming from DevTools"), C = ju(o);
            t.lanes = At(t.lanes, C);
            var M = xS(t, ac(E, t), C);
            Rg(t, M);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var L = a.propTypes;
          L && yl(
            L,
            i,
            // Resolved props
            "prop",
            qt(a)
          );
        }
      }
      var Q;
      to(a) ? (Q = !0, Yh(t)) : Q = !1, Lf(t, o);
      var X = t.stateNode, ae;
      X === null ? (Mv(e, t), bb(t, a, i), yS(t, a, i, o), ae = !0) : e === null ? ae = NT(t, a, i, o) : ae = DT(e, t, a, i, o);
      var He = RS(e, t, a, ae, Q, o);
      {
        var st = t.stateNode;
        ae && st.props !== i && (ic || y("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", jt(t) || "a component"), ic = !0);
      }
      return He;
    }
    function RS(e, t, a, i, o, u) {
      Ob(e, t);
      var d = (t.flags & rt) !== at;
      if (!i && !d)
        return o && mE(t, a, !1), Ko(e, t, u);
      var m = t.stateNode;
      Up.current = t;
      var h;
      if (d && typeof a.getDerivedStateFromError != "function")
        h = null, yb();
      else {
        Fa(t);
        {
          if (gr(!0), h = m.render(), t.mode & yn) {
            $n(!0);
            try {
              m.render();
            } finally {
              $n(!1);
            }
          }
          gr(!1);
        }
        Pa();
      }
      return t.flags |= Si, e !== null && d ? FT(e, t, h, u) : Va(e, t, h, u), t.memoizedState = m.state, o && mE(t, a, !0), t.child;
    }
    function Ab(e) {
      var t = e.stateNode;
      t.pendingContext ? dE(e, t.pendingContext, t.pendingContext !== t.context) : t.context && dE(e, t.context, !1), jg(e, t.containerInfo);
    }
    function VT(e, t, a) {
      if (Ab(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, o = t.memoizedState, u = o.element;
      zE(e, t), sv(t, i, null, a);
      var d = t.memoizedState;
      t.stateNode;
      var m = d.element;
      if (o.isDehydrated) {
        var h = {
          element: m,
          isDehydrated: !1,
          cache: d.cache,
          pendingSuspenseBoundaries: d.pendingSuspenseBoundaries,
          transitions: d.transitions
        }, E = t.updateQueue;
        if (E.baseState = h, t.memoizedState = h, t.flags & $r) {
          var C = ac(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return Mb(e, t, m, a, C);
        } else if (m !== u) {
          var M = ac(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return Mb(e, t, m, a, M);
        } else {
          Y0(t);
          var L = NE(t, null, m, a);
          t.child = L;
          for (var Q = L; Q; )
            Q.flags = Q.flags & ~In | ma, Q = Q.sibling;
        }
      } else {
        if (Nf(), m === u)
          return Ko(e, t, a);
        Va(e, t, m, a);
      }
      return t.child;
    }
    function Mb(e, t, a, i, o) {
      return Nf(), dg(o), t.flags |= $r, Va(e, t, a, i), t.child;
    }
    function IT(e, t, a) {
      BE(t), e === null && fg(t);
      var i = t.type, o = t.pendingProps, u = e !== null ? e.memoizedProps : null, d = o.children, m = Wy(i, o);
      return m ? d = null : u !== null && Wy(i, u) && (t.flags |= ti), Ob(e, t), Va(e, t, d, a), t.child;
    }
    function $T(e, t) {
      return e === null && fg(t), null;
    }
    function YT(e, t, a, i) {
      Mv(e, t);
      var o = t.pendingProps, u = a, d = u._payload, m = u._init, h = m(d);
      t.type = h;
      var E = t.tag = $j(h), C = bl(h, o), M;
      switch (E) {
        case U:
          return jS(t, h), t.type = h = Gf(h), M = TS(null, t, h, C, i), M;
        case j:
          return t.type = h = ax(h), M = Lb(null, t, h, C, i), M;
        case ke:
          return t.type = h = ix(h), M = jb(null, t, h, C, i), M;
        case me: {
          if (t.type !== t.elementType) {
            var L = h.propTypes;
            L && yl(
              L,
              C,
              // Resolved for outer only
              "prop",
              qt(h)
            );
          }
          return M = kb(
            null,
            t,
            h,
            bl(h.type, C),
            // The inner type can have defaults too
            i
          ), M;
        }
      }
      var Q = "";
      throw h !== null && typeof h == "object" && h.$$typeof === _t && (Q = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + h + ". " + ("Lazy element type must resolve to a class or function." + Q));
    }
    function WT(e, t, a, i, o) {
      Mv(e, t), t.tag = j;
      var u;
      return to(a) ? (u = !0, Yh(t)) : u = !1, Lf(t, o), bb(t, a, i), yS(t, a, i, o), RS(null, t, a, !0, u, o);
    }
    function QT(e, t, a, i) {
      Mv(e, t);
      var o = t.pendingProps, u;
      {
        var d = Tf(t, a, !1);
        u = Rf(t, d);
      }
      Lf(t, i);
      var m, h;
      Fa(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var E = qt(a) || "Unknown";
          ES[E] || (y("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", E, E), ES[E] = !0);
        }
        t.mode & yn && Sl.recordLegacyContextWarning(t, null), gr(!0), Up.current = t, m = Pf(null, t, a, o, u, i), h = Hf(), gr(!1);
      }
      if (Pa(), t.flags |= Si, typeof m == "object" && m !== null && typeof m.render == "function" && m.$$typeof === void 0) {
        var C = qt(a) || "Unknown";
        zp[C] || (y("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", C, C, C), zp[C] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof m == "object" && m !== null && typeof m.render == "function" && m.$$typeof === void 0
      ) {
        {
          var M = qt(a) || "Unknown";
          zp[M] || (y("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", M, M, M), zp[M] = !0);
        }
        t.tag = j, t.memoizedState = null, t.updateQueue = null;
        var L = !1;
        return to(a) ? (L = !0, Yh(t)) : L = !1, t.memoizedState = m.state !== null && m.state !== void 0 ? m.state : null, Tg(t), Eb(t, m), yS(t, a, o, i), RS(null, t, a, !0, L, i);
      } else {
        if (t.tag = U, t.mode & yn) {
          $n(!0);
          try {
            m = Pf(null, t, a, o, u, i), h = Hf();
          } finally {
            $n(!1);
          }
        }
        return ta() && h && lg(t), Va(null, t, m, i), jS(t, a), t.child;
      }
    }
    function jS(e, t) {
      {
        if (t && t.childContextTypes && y("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Gr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var o = i || "", u = e._debugSource;
          u && (o = u.fileName + ":" + u.lineNumber), _S[o] || (_S[o] = !0, y("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var d = qt(t) || "Unknown";
          Fp[d] || (y("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", d), Fp[d] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var m = qt(t) || "Unknown";
          CS[m] || (y("%s: Function components do not support getDerivedStateFromProps.", m), CS[m] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var h = qt(t) || "Unknown";
          bS[h] || (y("%s: Function components do not support contextType.", h), bS[h] = !0);
        }
      }
    }
    var kS = {
      dehydrated: null,
      treeContext: null,
      retryLane: Jt
    };
    function NS(e) {
      return {
        baseLanes: e,
        cachePool: zT(),
        transitions: null
      };
    }
    function GT(e, t) {
      var a = null;
      return {
        baseLanes: At(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function KT(e, t, a, i) {
      if (t !== null) {
        var o = t.memoizedState;
        if (o === null)
          return !1;
      }
      return Dg(e, Rp);
    }
    function qT(e, t) {
      return ku(e.childLanes, t);
    }
    function Ub(e, t, a) {
      var i = t.pendingProps;
      ik(t) && (t.flags |= rt);
      var o = xl.current, u = !1, d = (t.flags & rt) !== at;
      if (d || KT(o, e) ? (u = !0, t.flags &= ~rt) : (e === null || e.memoizedState !== null) && (o = mT(o, IE)), o = Mf(o), Bs(t, o), e === null) {
        fg(t);
        var m = t.memoizedState;
        if (m !== null) {
          var h = m.dehydrated;
          if (h !== null)
            return tR(t, h);
        }
        var E = i.children, C = i.fallback;
        if (u) {
          var M = XT(t, E, C, a), L = t.child;
          return L.memoizedState = NS(a), t.memoizedState = kS, M;
        } else
          return DS(t, E);
      } else {
        var Q = e.memoizedState;
        if (Q !== null) {
          var X = Q.dehydrated;
          if (X !== null)
            return nR(e, t, d, i, X, Q, a);
        }
        if (u) {
          var ae = i.fallback, He = i.children, st = ZT(e, t, He, ae, a), nt = t.child, Gt = e.child.memoizedState;
          return nt.memoizedState = Gt === null ? NS(a) : GT(Gt, a), nt.childLanes = qT(e, a), t.memoizedState = kS, st;
        } else {
          var Vt = i.children, H = JT(e, t, Vt, a);
          return t.memoizedState = null, H;
        }
      }
    }
    function DS(e, t, a) {
      var i = e.mode, o = {
        mode: "visible",
        children: t
      }, u = OS(o, i);
      return u.return = e, e.child = u, u;
    }
    function XT(e, t, a, i) {
      var o = e.mode, u = e.child, d = {
        mode: "hidden",
        children: t
      }, m, h;
      return (o & Pt) === it && u !== null ? (m = u, m.childLanes = ge, m.pendingProps = d, e.mode & en && (m.actualDuration = 0, m.actualStartTime = -1, m.selfBaseDuration = 0, m.treeBaseDuration = 0), h = Ks(a, o, i, null)) : (m = OS(d, o), h = Ks(a, o, i, null)), m.return = e, h.return = e, m.sibling = h, e.child = m, h;
    }
    function OS(e, t, a) {
      return zC(e, t, ge, null);
    }
    function zb(e, t) {
      return cc(e, t);
    }
    function JT(e, t, a, i) {
      var o = e.child, u = o.sibling, d = zb(o, {
        mode: "visible",
        children: a
      });
      if ((t.mode & Pt) === it && (d.lanes = i), d.return = t, d.sibling = null, u !== null) {
        var m = t.deletions;
        m === null ? (t.deletions = [u], t.flags |= ei) : m.push(u);
      }
      return t.child = d, d;
    }
    function ZT(e, t, a, i, o) {
      var u = t.mode, d = e.child, m = d.sibling, h = {
        mode: "hidden",
        children: a
      }, E;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (u & Pt) === it && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== d
      ) {
        var C = t.child;
        E = C, E.childLanes = ge, E.pendingProps = h, t.mode & en && (E.actualDuration = 0, E.actualStartTime = -1, E.selfBaseDuration = d.selfBaseDuration, E.treeBaseDuration = d.treeBaseDuration), t.deletions = null;
      } else
        E = zb(d, h), E.subtreeFlags = d.subtreeFlags & cr;
      var M;
      return m !== null ? M = cc(m, i) : (M = Ks(i, u, o, null), M.flags |= In), M.return = t, E.return = t, E.sibling = M, t.child = E, M;
    }
    function Av(e, t, a, i) {
      i !== null && dg(i), Df(t, e.child, null, a);
      var o = t.pendingProps, u = o.children, d = DS(t, u);
      return d.flags |= In, t.memoizedState = null, d;
    }
    function eR(e, t, a, i, o) {
      var u = t.mode, d = {
        mode: "visible",
        children: a
      }, m = OS(d, u), h = Ks(i, u, o, null);
      return h.flags |= In, m.return = t, h.return = t, m.sibling = h, t.child = m, (t.mode & Pt) !== it && Df(t, e.child, null, o), h;
    }
    function tR(e, t, a) {
      return (e.mode & Pt) === it ? (y("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = vt) : qy(t) ? e.lanes = Yr : e.lanes = ga, null;
    }
    function nR(e, t, a, i, o, u, d) {
      if (a)
        if (t.flags & $r) {
          t.flags &= ~$r;
          var H = gS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Av(e, t, d, H);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= rt, null;
          var ie = i.children, B = i.fallback, Te = eR(e, t, ie, B, d), Ge = t.child;
          return Ge.memoizedState = NS(d), t.memoizedState = kS, Te;
        }
      else {
        if (I0(), (t.mode & Pt) === it)
          return Av(
            e,
            t,
            d,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (qy(o)) {
          var m, h, E;
          {
            var C = l0(o);
            m = C.digest, h = C.message, E = C.stack;
          }
          var M;
          h ? M = new Error(h) : M = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var L = gS(M, m, E);
          return Av(e, t, d, L);
        }
        var Q = Sa(d, e.childLanes);
        if (Cl || Q) {
          var X = Yv();
          if (X !== null) {
            var ae = Bd(X, d);
            if (ae !== Jt && ae !== u.retryLane) {
              u.retryLane = ae;
              var He = wn;
              ci(e, ae), Vr(X, e, ae, He);
            }
          }
          ZS();
          var st = gS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Av(e, t, d, st);
        } else if (lE(o)) {
          t.flags |= rt, t.child = e.child;
          var nt = Rj.bind(null, e);
          return o0(o, nt), null;
        } else {
          W0(t, o, u.treeContext);
          var Gt = i.children, Vt = DS(t, Gt);
          return Vt.flags |= ma, Vt;
        }
      }
    }
    function Fb(e, t, a) {
      e.lanes = At(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = At(i.lanes, t)), bg(e.return, t, a);
    }
    function rR(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === ce) {
          var o = i.memoizedState;
          o !== null && Fb(i, a, e);
        } else if (i.tag === he)
          Fb(i, a, e);
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
    function aR(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && dv(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function iR(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !wS[e])
        if (wS[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              y('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              y('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              y('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          y('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function lR(e, t) {
      e !== void 0 && !Lv[e] && (e !== "collapsed" && e !== "hidden" ? (Lv[e] = !0, y('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (Lv[e] = !0, y('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function Pb(e, t) {
      {
        var a = zt(e), i = !a && typeof xt(e) == "function";
        if (a || i) {
          var o = a ? "array" : "iterable";
          return y("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", o, t, o), !1;
        }
      }
      return !0;
    }
    function oR(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (zt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!Pb(e[a], a))
              return;
        } else {
          var i = xt(e);
          if (typeof i == "function") {
            var o = i.call(e);
            if (o)
              for (var u = o.next(), d = 0; !u.done; u = o.next()) {
                if (!Pb(u.value, d))
                  return;
                d++;
              }
          } else
            y('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function LS(e, t, a, i, o) {
      var u = e.memoizedState;
      u === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: o
      } : (u.isBackwards = t, u.rendering = null, u.renderingStartTime = 0, u.last = i, u.tail = a, u.tailMode = o);
    }
    function Hb(e, t, a) {
      var i = t.pendingProps, o = i.revealOrder, u = i.tail, d = i.children;
      iR(o), lR(u, o), oR(d, o), Va(e, t, d, a);
      var m = xl.current, h = Dg(m, Rp);
      if (h)
        m = Og(m, Rp), t.flags |= rt;
      else {
        var E = e !== null && (e.flags & rt) !== at;
        E && rR(t, t.child, a), m = Mf(m);
      }
      if (Bs(t, m), (t.mode & Pt) === it)
        t.memoizedState = null;
      else
        switch (o) {
          case "forwards": {
            var C = aR(t.child), M;
            C === null ? (M = t.child, t.child = null) : (M = C.sibling, C.sibling = null), LS(
              t,
              !1,
              // isBackwards
              M,
              C,
              u
            );
            break;
          }
          case "backwards": {
            var L = null, Q = t.child;
            for (t.child = null; Q !== null; ) {
              var X = Q.alternate;
              if (X !== null && dv(X) === null) {
                t.child = Q;
                break;
              }
              var ae = Q.sibling;
              Q.sibling = L, L = Q, Q = ae;
            }
            LS(
              t,
              !0,
              // isBackwards
              L,
              null,
              // last
              u
            );
            break;
          }
          case "together": {
            LS(
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
    function sR(e, t, a) {
      jg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Df(t, null, i, a) : Va(e, t, i, a), t.child;
    }
    var Bb = !1;
    function uR(e, t, a) {
      var i = t.type, o = i._context, u = t.pendingProps, d = t.memoizedProps, m = u.value;
      {
        "value" in u || Bb || (Bb = !0, y("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var h = t.type.propTypes;
        h && yl(h, u, "prop", "Context.Provider");
      }
      if (LE(t, o, m), d !== null) {
        var E = d.value;
        if (Ce(E, m)) {
          if (d.children === u.children && !Ih())
            return Ko(e, t, a);
        } else
          iT(t, o, a);
      }
      var C = u.children;
      return Va(e, t, C, a), t.child;
    }
    var Vb = !1;
    function cR(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (Vb || (Vb = !0, y("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var o = t.pendingProps, u = o.children;
      typeof u != "function" && y("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Lf(t, a);
      var d = Rr(i);
      Fa(t);
      var m;
      return Up.current = t, gr(!0), m = u(d), gr(!1), Pa(), t.flags |= Si, Va(e, t, m, a), t.child;
    }
    function Pp() {
      Cl = !0;
    }
    function Mv(e, t) {
      (t.mode & Pt) === it && e !== null && (e.alternate = null, t.alternate = null, t.flags |= In);
    }
    function Ko(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), yb(), Xp(t.lanes), Sa(a, t.childLanes) ? (rT(e, t), t.child) : null;
    }
    function fR(e, t, a) {
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
        var u = i.deletions;
        return u === null ? (i.deletions = [e], i.flags |= ei) : u.push(e), a.flags |= In, a;
      }
    }
    function AS(e, t) {
      var a = e.lanes;
      return !!Sa(a, t);
    }
    function dR(e, t, a) {
      switch (t.tag) {
        case z:
          Ab(t), t.stateNode, Nf();
          break;
        case G:
          BE(t);
          break;
        case j: {
          var i = t.type;
          to(i) && Yh(t);
          break;
        }
        case Y:
          jg(t, t.stateNode.containerInfo);
          break;
        case le: {
          var o = t.memoizedProps.value, u = t.type._context;
          LE(t, u, o);
          break;
        }
        case Ee:
          {
            var d = Sa(a, t.childLanes);
            d && (t.flags |= Yt);
            {
              var m = t.stateNode;
              m.effectDuration = 0, m.passiveEffectDuration = 0;
            }
          }
          break;
        case ce: {
          var h = t.memoizedState;
          if (h !== null) {
            if (h.dehydrated !== null)
              return Bs(t, Mf(xl.current)), t.flags |= rt, null;
            var E = t.child, C = E.childLanes;
            if (Sa(a, C))
              return Ub(e, t, a);
            Bs(t, Mf(xl.current));
            var M = Ko(e, t, a);
            return M !== null ? M.sibling : null;
          } else
            Bs(t, Mf(xl.current));
          break;
        }
        case he: {
          var L = (e.flags & rt) !== at, Q = Sa(a, t.childLanes);
          if (L) {
            if (Q)
              return Hb(e, t, a);
            t.flags |= rt;
          }
          var X = t.memoizedState;
          if (X !== null && (X.rendering = null, X.tail = null, X.lastEffect = null), Bs(t, xl.current), Q)
            break;
          return null;
        }
        case ee:
        case Oe:
          return t.lanes = ge, Db(e, t, a);
      }
      return Ko(e, t, a);
    }
    function Ib(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return fR(e, t, cx(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, o = t.pendingProps;
        if (i !== o || Ih() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          Cl = !0;
        else {
          var u = AS(e, a);
          if (!u && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & rt) === at)
            return Cl = !1, dR(e, t, a);
          (e.flags & jc) !== at ? Cl = !0 : Cl = !1;
        }
      } else if (Cl = !1, ta() && z0(t)) {
        var d = t.index, m = F0();
        yE(t, m, d);
      }
      switch (t.lanes = ge, t.tag) {
        case de:
          return QT(e, t, t.type, a);
        case _e: {
          var h = t.elementType;
          return YT(e, t, h, a);
        }
        case U: {
          var E = t.type, C = t.pendingProps, M = t.elementType === E ? C : bl(E, C);
          return TS(e, t, E, M, a);
        }
        case j: {
          var L = t.type, Q = t.pendingProps, X = t.elementType === L ? Q : bl(L, Q);
          return Lb(e, t, L, X, a);
        }
        case z:
          return VT(e, t, a);
        case G:
          return IT(e, t, a);
        case re:
          return $T(e, t);
        case ce:
          return Ub(e, t, a);
        case Y:
          return sR(e, t, a);
        case ke: {
          var ae = t.type, He = t.pendingProps, st = t.elementType === ae ? He : bl(ae, He);
          return jb(e, t, ae, st, a);
        }
        case oe:
          return PT(e, t, a);
        case ye:
          return HT(e, t, a);
        case Ee:
          return BT(e, t, a);
        case le:
          return uR(e, t, a);
        case Ae:
          return cR(e, t, a);
        case me: {
          var nt = t.type, Gt = t.pendingProps, Vt = bl(nt, Gt);
          if (t.type !== t.elementType) {
            var H = nt.propTypes;
            H && yl(
              H,
              Vt,
              // Resolved for outer only
              "prop",
              qt(nt)
            );
          }
          return Vt = bl(nt.type, Vt), kb(e, t, nt, Vt, a);
        }
        case I:
          return Nb(e, t, t.type, t.pendingProps, a);
        case Ue: {
          var ie = t.type, B = t.pendingProps, Te = t.elementType === ie ? B : bl(ie, B);
          return WT(e, t, ie, Te, a);
        }
        case he:
          return Hb(e, t, a);
        case Be:
          break;
        case ee:
          return Db(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Bf(e) {
      e.flags |= Yt;
    }
    function $b(e) {
      e.flags |= Kn, e.flags |= xs;
    }
    var Yb, MS, Wb, Qb;
    Yb = function(e, t, a, i) {
      for (var o = t.child; o !== null; ) {
        if (o.tag === G || o.tag === re)
          Aw(e, o.stateNode);
        else if (o.tag !== Y) {
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
    }, MS = function(e, t) {
    }, Wb = function(e, t, a, i, o) {
      var u = e.memoizedProps;
      if (u !== i) {
        var d = t.stateNode, m = kg(), h = Uw(d, a, u, i, o, m);
        t.updateQueue = h, h && Bf(t);
      }
    }, Qb = function(e, t, a, i) {
      a !== i && Bf(t);
    };
    function Hp(e, t) {
      if (!ta())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var o = e.tail, u = null; o !== null; )
              o.alternate !== null && (u = o), o = o.sibling;
            u === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : u.sibling = null;
            break;
          }
        }
    }
    function ra(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = ge, i = at;
      if (t) {
        if ((e.mode & en) !== it) {
          for (var h = e.selfBaseDuration, E = e.child; E !== null; )
            a = At(a, At(E.lanes, E.childLanes)), i |= E.subtreeFlags & cr, i |= E.flags & cr, h += E.treeBaseDuration, E = E.sibling;
          e.treeBaseDuration = h;
        } else
          for (var C = e.child; C !== null; )
            a = At(a, At(C.lanes, C.childLanes)), i |= C.subtreeFlags & cr, i |= C.flags & cr, C.return = e, C = C.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & en) !== it) {
          for (var o = e.actualDuration, u = e.selfBaseDuration, d = e.child; d !== null; )
            a = At(a, At(d.lanes, d.childLanes)), i |= d.subtreeFlags, i |= d.flags, o += d.actualDuration, u += d.treeBaseDuration, d = d.sibling;
          e.actualDuration = o, e.treeBaseDuration = u;
        } else
          for (var m = e.child; m !== null; )
            a = At(a, At(m.lanes, m.childLanes)), i |= m.subtreeFlags, i |= m.flags, m.return = e, m = m.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function pR(e, t, a) {
      if (X0() && (t.mode & Pt) !== it && (t.flags & rt) === at)
        return _E(t), Nf(), t.flags |= $r | pu | Cr, !1;
      var i = qh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (K0(t), ra(t), (t.mode & en) !== it) {
            var o = a !== null;
            if (o) {
              var u = t.child;
              u !== null && (t.treeBaseDuration -= u.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (Nf(), (t.flags & rt) === at && (t.memoizedState = null), t.flags |= Yt, ra(t), (t.mode & en) !== it) {
            var d = a !== null;
            if (d) {
              var m = t.child;
              m !== null && (t.treeBaseDuration -= m.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return wE(), !0;
    }
    function Gb(e, t, a) {
      var i = t.pendingProps;
      switch (og(t), t.tag) {
        case de:
        case _e:
        case I:
        case U:
        case ke:
        case oe:
        case ye:
        case Ee:
        case Ae:
        case me:
          return ra(t), null;
        case j: {
          var o = t.type;
          return to(o) && $h(t), ra(t), null;
        }
        case z: {
          var u = t.stateNode;
          if (Af(t), rg(t), Ag(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), e === null || e.child === null) {
            var d = qh(t);
            if (d)
              Bf(t);
            else if (e !== null) {
              var m = e.memoizedState;
              // Check if this is a client root
              (!m.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & $r) !== at) && (t.flags |= Sr, wE());
            }
          }
          return MS(e, t), ra(t), null;
        }
        case G: {
          Ng(t);
          var h = HE(), E = t.type;
          if (e !== null && t.stateNode != null)
            Wb(e, t, E, i, h), e.ref !== t.ref && $b(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return ra(t), null;
            }
            var C = kg(), M = qh(t);
            if (M)
              Q0(t, h, C) && Bf(t);
            else {
              var L = Lw(E, i, h, C, t);
              Yb(L, t, !1, !1), t.stateNode = L, Mw(L, E, i, h) && Bf(t);
            }
            t.ref !== null && $b(t);
          }
          return ra(t), null;
        }
        case re: {
          var Q = i;
          if (e && t.stateNode != null) {
            var X = e.memoizedProps;
            Qb(e, t, X, Q);
          } else {
            if (typeof Q != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var ae = HE(), He = kg(), st = qh(t);
            st ? G0(t) && Bf(t) : t.stateNode = zw(Q, ae, He, t);
          }
          return ra(t), null;
        }
        case ce: {
          Uf(t);
          var nt = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Gt = pR(e, t, nt);
            if (!Gt)
              return t.flags & Cr ? t : null;
          }
          if ((t.flags & rt) !== at)
            return t.lanes = a, (t.mode & en) !== it && iS(t), t;
          var Vt = nt !== null, H = e !== null && e.memoizedState !== null;
          if (Vt !== H && Vt) {
            var ie = t.child;
            if (ie.flags |= ur, (t.mode & Pt) !== it) {
              var B = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              B || Dg(xl.current, IE) ? mj() : ZS();
            }
          }
          var Te = t.updateQueue;
          if (Te !== null && (t.flags |= Yt), ra(t), (t.mode & en) !== it && Vt) {
            var Ge = t.child;
            Ge !== null && (t.treeBaseDuration -= Ge.treeBaseDuration);
          }
          return null;
        }
        case Y:
          return Af(t), MS(e, t), e === null && N0(t.stateNode.containerInfo), ra(t), null;
        case le:
          var Ve = t.type._context;
          return Eg(Ve, t), ra(t), null;
        case Ue: {
          var Et = t.type;
          return to(Et) && $h(t), ra(t), null;
        }
        case he: {
          Uf(t);
          var Nt = t.memoizedState;
          if (Nt === null)
            return ra(t), null;
          var Sn = (t.flags & rt) !== at, rn = Nt.rendering;
          if (rn === null)
            if (Sn)
              Hp(Nt, !1);
            else {
              var br = vj() && (e === null || (e.flags & rt) === at);
              if (!br)
                for (var an = t.child; an !== null; ) {
                  var vr = dv(an);
                  if (vr !== null) {
                    Sn = !0, t.flags |= rt, Hp(Nt, !1);
                    var Ta = vr.updateQueue;
                    return Ta !== null && (t.updateQueue = Ta, t.flags |= Yt), t.subtreeFlags = at, aT(t, a), Bs(t, Og(xl.current, Rp)), t.child;
                  }
                  an = an.sibling;
                }
              Nt.tail !== null && xr() > hC() && (t.flags |= rt, Sn = !0, Hp(Nt, !1), t.lanes = Od);
            }
          else {
            if (!Sn) {
              var sa = dv(rn);
              if (sa !== null) {
                t.flags |= rt, Sn = !0;
                var Ti = sa.updateQueue;
                if (Ti !== null && (t.updateQueue = Ti, t.flags |= Yt), Hp(Nt, !0), Nt.tail === null && Nt.tailMode === "hidden" && !rn.alternate && !ta())
                  return ra(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              xr() * 2 - Nt.renderingStartTime > hC() && a !== ga && (t.flags |= rt, Sn = !0, Hp(Nt, !1), t.lanes = Od);
            }
            if (Nt.isBackwards)
              rn.sibling = t.child, t.child = rn;
            else {
              var Ya = Nt.last;
              Ya !== null ? Ya.sibling = rn : t.child = rn, Nt.last = rn;
            }
          }
          if (Nt.tail !== null) {
            var Wa = Nt.tail;
            Nt.rendering = Wa, Nt.tail = Wa.sibling, Nt.renderingStartTime = xr(), Wa.sibling = null;
            var Ra = xl.current;
            return Sn ? Ra = Og(Ra, Rp) : Ra = Mf(Ra), Bs(t, Ra), Wa;
          }
          return ra(t), null;
        }
        case Be:
          break;
        case ee:
        case Oe: {
          JS(t);
          var es = t.memoizedState, Kf = es !== null;
          if (e !== null) {
            var nm = e.memoizedState, uo = nm !== null;
            uo !== Kf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !Re && (t.flags |= ur);
          }
          return !Kf || (t.mode & Pt) === it ? ra(t) : Sa(so, ga) && (ra(t), t.subtreeFlags & (In | Yt) && (t.flags |= ur)), null;
        }
        case Ze:
          return null;
        case lt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function mR(e, t, a) {
      switch (og(t), t.tag) {
        case j: {
          var i = t.type;
          to(i) && $h(t);
          var o = t.flags;
          return o & Cr ? (t.flags = o & ~Cr | rt, (t.mode & en) !== it && iS(t), t) : null;
        }
        case z: {
          t.stateNode, Af(t), rg(t), Ag();
          var u = t.flags;
          return (u & Cr) !== at && (u & rt) === at ? (t.flags = u & ~Cr | rt, t) : null;
        }
        case G:
          return Ng(t), null;
        case ce: {
          Uf(t);
          var d = t.memoizedState;
          if (d !== null && d.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            Nf();
          }
          var m = t.flags;
          return m & Cr ? (t.flags = m & ~Cr | rt, (t.mode & en) !== it && iS(t), t) : null;
        }
        case he:
          return Uf(t), null;
        case Y:
          return Af(t), null;
        case le:
          var h = t.type._context;
          return Eg(h, t), null;
        case ee:
        case Oe:
          return JS(t), null;
        case Ze:
          return null;
        default:
          return null;
      }
    }
    function Kb(e, t, a) {
      switch (og(t), t.tag) {
        case j: {
          var i = t.type.childContextTypes;
          i != null && $h(t);
          break;
        }
        case z: {
          t.stateNode, Af(t), rg(t), Ag();
          break;
        }
        case G: {
          Ng(t);
          break;
        }
        case Y:
          Af(t);
          break;
        case ce:
          Uf(t);
          break;
        case he:
          Uf(t);
          break;
        case le:
          var o = t.type._context;
          Eg(o, t);
          break;
        case ee:
        case Oe:
          JS(t);
          break;
      }
    }
    var qb = null;
    qb = /* @__PURE__ */ new Set();
    var Uv = !1, aa = !1, hR = typeof WeakSet == "function" ? WeakSet : Set, Je = null, Vf = null, If = null;
    function vR(e) {
      zl(null, function() {
        throw e;
      }), du();
    }
    var yR = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & en)
        try {
          lo(), t.componentWillUnmount();
        } finally {
          io(e);
        }
      else
        t.componentWillUnmount();
    };
    function Xb(e, t) {
      try {
        $s(Ur, e);
      } catch (a) {
        Fn(e, t, a);
      }
    }
    function US(e, t, a) {
      try {
        yR(e, a);
      } catch (i) {
        Fn(e, t, i);
      }
    }
    function gR(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        Fn(e, t, i);
      }
    }
    function Jb(e, t) {
      try {
        eC(e);
      } catch (a) {
        Fn(e, t, a);
      }
    }
    function $f(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (ue && bt && e.mode & en)
              try {
                lo(), i = a(null);
              } finally {
                io(e);
              }
            else
              i = a(null);
          } catch (o) {
            Fn(e, t, o);
          }
          typeof i == "function" && y("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", jt(e));
        } else
          a.current = null;
    }
    function zv(e, t, a) {
      try {
        a();
      } catch (i) {
        Fn(e, t, i);
      }
    }
    var Zb = !1;
    function SR(e, t) {
      Dw(e.containerInfo), Je = t, xR();
      var a = Zb;
      return Zb = !1, a;
    }
    function xR() {
      for (; Je !== null; ) {
        var e = Je, t = e.child;
        (e.subtreeFlags & Pl) !== at && t !== null ? (t.return = e, Je = t) : ER();
      }
    }
    function ER() {
      for (; Je !== null; ) {
        var e = Je;
        mn(e);
        try {
          bR(e);
        } catch (a) {
          Fn(e, e.return, a);
        }
        zn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Je = t;
          return;
        }
        Je = e.return;
      }
    }
    function bR(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Sr) !== at) {
        switch (mn(e), e.tag) {
          case U:
          case ke:
          case I:
            break;
          case j: {
            if (t !== null) {
              var i = t.memoizedProps, o = t.memoizedState, u = e.stateNode;
              e.type === e.elementType && !ic && (u.props !== e.memoizedProps && y("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", jt(e) || "instance"), u.state !== e.memoizedState && y("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", jt(e) || "instance"));
              var d = u.getSnapshotBeforeUpdate(e.elementType === e.type ? i : bl(e.type, i), o);
              {
                var m = qb;
                d === void 0 && !m.has(e.type) && (m.add(e.type), y("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", jt(e)));
              }
              u.__reactInternalSnapshotBeforeUpdate = d;
            }
            break;
          }
          case z: {
            {
              var h = e.stateNode;
              n0(h.containerInfo);
            }
            break;
          }
          case G:
          case re:
          case Y:
          case Ue:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        zn();
      }
    }
    function _l(e, t, a) {
      var i = t.updateQueue, o = i !== null ? i.lastEffect : null;
      if (o !== null) {
        var u = o.next, d = u;
        do {
          if ((d.tag & e) === e) {
            var m = d.destroy;
            d.destroy = void 0, m !== void 0 && ((e & na) !== fi ? fl(t) : (e & Ur) !== fi && hu(t), (e & no) !== fi && Zp(!0), zv(t, a, m), (e & no) !== fi && Zp(!1), (e & na) !== fi ? Il() : (e & Ur) !== fi && Nd());
          }
          d = d.next;
        } while (d !== u);
      }
    }
    function $s(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var o = i.next, u = o;
        do {
          if ((u.tag & e) === e) {
            (e & na) !== fi ? kd(t) : (e & Ur) !== fi && Ac(t);
            var d = u.create;
            (e & no) !== fi && Zp(!0), u.destroy = d(), (e & no) !== fi && Zp(!1), (e & na) !== fi ? Vm() : (e & Ur) !== fi && Im();
            {
              var m = u.destroy;
              if (m !== void 0 && typeof m != "function") {
                var h = void 0;
                (u.tag & Ur) !== at ? h = "useLayoutEffect" : (u.tag & no) !== at ? h = "useInsertionEffect" : h = "useEffect";
                var E = void 0;
                m === null ? E = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof m.then == "function" ? E = `

It looks like you wrote ` + h + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + h + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : E = " You returned: " + m, y("%s must not return anything besides a function, which is used for clean-up.%s", h, E);
              }
            }
          }
          u = u.next;
        } while (u !== o);
      }
    }
    function CR(e, t) {
      if ((t.flags & Yt) !== at)
        switch (t.tag) {
          case Ee: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, o = i.id, u = i.onPostCommit, d = hb(), m = t.alternate === null ? "mount" : "update";
            mb() && (m = "nested-update"), typeof u == "function" && u(o, m, a, d);
            var h = t.return;
            e: for (; h !== null; ) {
              switch (h.tag) {
                case z:
                  var E = h.stateNode;
                  E.passiveEffectDuration += a;
                  break e;
                case Ee:
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
    function _R(e, t, a, i) {
      if ((a.flags & Bl) !== at)
        switch (a.tag) {
          case U:
          case ke:
          case I: {
            if (!aa)
              if (a.mode & en)
                try {
                  lo(), $s(Ur | Mr, a);
                } finally {
                  io(a);
                }
              else
                $s(Ur | Mr, a);
            break;
          }
          case j: {
            var o = a.stateNode;
            if (a.flags & Yt && !aa)
              if (t === null)
                if (a.type === a.elementType && !ic && (o.props !== a.memoizedProps && y("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", jt(a) || "instance"), o.state !== a.memoizedState && y("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", jt(a) || "instance")), a.mode & en)
                  try {
                    lo(), o.componentDidMount();
                  } finally {
                    io(a);
                  }
                else
                  o.componentDidMount();
              else {
                var u = a.elementType === a.type ? t.memoizedProps : bl(a.type, t.memoizedProps), d = t.memoizedState;
                if (a.type === a.elementType && !ic && (o.props !== a.memoizedProps && y("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", jt(a) || "instance"), o.state !== a.memoizedState && y("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", jt(a) || "instance")), a.mode & en)
                  try {
                    lo(), o.componentDidUpdate(u, d, o.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    io(a);
                  }
                else
                  o.componentDidUpdate(u, d, o.__reactInternalSnapshotBeforeUpdate);
              }
            var m = a.updateQueue;
            m !== null && (a.type === a.elementType && !ic && (o.props !== a.memoizedProps && y("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", jt(a) || "instance"), o.state !== a.memoizedState && y("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", jt(a) || "instance")), PE(a, m, o));
            break;
          }
          case z: {
            var h = a.updateQueue;
            if (h !== null) {
              var E = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case G:
                    E = a.child.stateNode;
                    break;
                  case j:
                    E = a.child.stateNode;
                    break;
                }
              PE(a, h, E);
            }
            break;
          }
          case G: {
            var C = a.stateNode;
            if (t === null && a.flags & Yt) {
              var M = a.type, L = a.memoizedProps;
              Vw(C, M, L);
            }
            break;
          }
          case re:
            break;
          case Y:
            break;
          case Ee: {
            {
              var Q = a.memoizedProps, X = Q.onCommit, ae = Q.onRender, He = a.stateNode.effectDuration, st = hb(), nt = t === null ? "mount" : "update";
              mb() && (nt = "nested-update"), typeof ae == "function" && ae(a.memoizedProps.id, nt, a.actualDuration, a.treeBaseDuration, a.actualStartTime, st);
              {
                typeof X == "function" && X(a.memoizedProps.id, nt, He, st), Ej(a);
                var Gt = a.return;
                e: for (; Gt !== null; ) {
                  switch (Gt.tag) {
                    case z:
                      var Vt = Gt.stateNode;
                      Vt.effectDuration += He;
                      break e;
                    case Ee:
                      var H = Gt.stateNode;
                      H.effectDuration += He;
                      break e;
                  }
                  Gt = Gt.return;
                }
              }
            }
            break;
          }
          case ce: {
            OR(e, a);
            break;
          }
          case he:
          case Ue:
          case Be:
          case ee:
          case Oe:
          case lt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      aa || a.flags & Kn && eC(a);
    }
    function wR(e) {
      switch (e.tag) {
        case U:
        case ke:
        case I: {
          if (e.mode & en)
            try {
              lo(), Xb(e, e.return);
            } finally {
              io(e);
            }
          else
            Xb(e, e.return);
          break;
        }
        case j: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && gR(e, e.return, t), Jb(e, e.return);
          break;
        }
        case G: {
          Jb(e, e.return);
          break;
        }
      }
    }
    function TR(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === G) {
          if (a === null) {
            a = i;
            try {
              var o = i.stateNode;
              t ? Jw(o) : e0(i.stateNode, i.memoizedProps);
            } catch (d) {
              Fn(e, e.return, d);
            }
          }
        } else if (i.tag === re) {
          if (a === null)
            try {
              var u = i.stateNode;
              t ? Zw(u) : t0(u, i.memoizedProps);
            } catch (d) {
              Fn(e, e.return, d);
            }
        } else if (!((i.tag === ee || i.tag === Oe) && i.memoizedState !== null && i !== e)) {
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
    function eC(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case G:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var o;
          if (e.mode & en)
            try {
              lo(), o = t(i);
            } finally {
              io(e);
            }
          else
            o = t(i);
          typeof o == "function" && y("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", jt(e));
        } else
          t.hasOwnProperty("current") || y("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", jt(e)), t.current = i;
      }
    }
    function RR(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function tC(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, tC(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === G) {
          var a = e.stateNode;
          a !== null && L0(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function jR(e) {
      for (var t = e.return; t !== null; ) {
        if (nC(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function nC(e) {
      return e.tag === G || e.tag === z || e.tag === Y;
    }
    function rC(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || nC(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== G && t.tag !== re && t.tag !== De; ) {
          if (t.flags & In || t.child === null || t.tag === Y)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & In))
          return t.stateNode;
      }
    }
    function kR(e) {
      var t = jR(e);
      switch (t.tag) {
        case G: {
          var a = t.stateNode;
          t.flags & ti && (iE(a), t.flags &= ~ti);
          var i = rC(e);
          FS(e, i, a);
          break;
        }
        case z:
        case Y: {
          var o = t.stateNode.containerInfo, u = rC(e);
          zS(e, u, o);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function zS(e, t, a) {
      var i = e.tag, o = i === G || i === re;
      if (o) {
        var u = e.stateNode;
        t ? Gw(a, u, t) : Ww(a, u);
      } else if (i !== Y) {
        var d = e.child;
        if (d !== null) {
          zS(d, t, a);
          for (var m = d.sibling; m !== null; )
            zS(m, t, a), m = m.sibling;
        }
      }
    }
    function FS(e, t, a) {
      var i = e.tag, o = i === G || i === re;
      if (o) {
        var u = e.stateNode;
        t ? Qw(a, u, t) : Yw(a, u);
      } else if (i !== Y) {
        var d = e.child;
        if (d !== null) {
          FS(d, t, a);
          for (var m = d.sibling; m !== null; )
            FS(m, t, a), m = m.sibling;
        }
      }
    }
    var ia = null, wl = !1;
    function NR(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case G: {
              ia = i.stateNode, wl = !1;
              break e;
            }
            case z: {
              ia = i.stateNode.containerInfo, wl = !0;
              break e;
            }
            case Y: {
              ia = i.stateNode.containerInfo, wl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (ia === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        aC(e, t, a), ia = null, wl = !1;
      }
      RR(a);
    }
    function Ys(e, t, a) {
      for (var i = a.child; i !== null; )
        aC(e, t, i), i = i.sibling;
    }
    function aC(e, t, a) {
      switch (Td(a), a.tag) {
        case G:
          aa || $f(a, t);
        case re: {
          {
            var i = ia, o = wl;
            ia = null, Ys(e, t, a), ia = i, wl = o, ia !== null && (wl ? qw(ia, a.stateNode) : Kw(ia, a.stateNode));
          }
          return;
        }
        case De: {
          ia !== null && (wl ? Xw(ia, a.stateNode) : Ky(ia, a.stateNode));
          return;
        }
        case Y: {
          {
            var u = ia, d = wl;
            ia = a.stateNode.containerInfo, wl = !0, Ys(e, t, a), ia = u, wl = d;
          }
          return;
        }
        case U:
        case ke:
        case me:
        case I: {
          if (!aa) {
            var m = a.updateQueue;
            if (m !== null) {
              var h = m.lastEffect;
              if (h !== null) {
                var E = h.next, C = E;
                do {
                  var M = C, L = M.destroy, Q = M.tag;
                  L !== void 0 && ((Q & no) !== fi ? zv(a, t, L) : (Q & Ur) !== fi && (hu(a), a.mode & en ? (lo(), zv(a, t, L), io(a)) : zv(a, t, L), Nd())), C = C.next;
                } while (C !== E);
              }
            }
          }
          Ys(e, t, a);
          return;
        }
        case j: {
          if (!aa) {
            $f(a, t);
            var X = a.stateNode;
            typeof X.componentWillUnmount == "function" && US(a, t, X);
          }
          Ys(e, t, a);
          return;
        }
        case Be: {
          Ys(e, t, a);
          return;
        }
        case ee: {
          if (
            // TODO: Remove this dead flag
            a.mode & Pt
          ) {
            var ae = aa;
            aa = ae || a.memoizedState !== null, Ys(e, t, a), aa = ae;
          } else
            Ys(e, t, a);
          break;
        }
        default: {
          Ys(e, t, a);
          return;
        }
      }
    }
    function DR(e) {
      e.memoizedState;
    }
    function OR(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var o = i.memoizedState;
          if (o !== null) {
            var u = o.dehydrated;
            u !== null && v0(u);
          }
        }
      }
    }
    function iC(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new hR()), t.forEach(function(i) {
          var o = jj.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), ya)
              if (Vf !== null && If !== null)
                Jp(If, Vf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(o, o);
          }
        });
      }
    }
    function LR(e, t, a) {
      Vf = a, If = e, mn(t), lC(t, e), mn(t), Vf = null, If = null;
    }
    function Tl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var o = 0; o < i.length; o++) {
          var u = i[o];
          try {
            NR(e, t, u);
          } catch (h) {
            Fn(u, t, h);
          }
        }
      var d = Nl();
      if (t.subtreeFlags & Hl)
        for (var m = t.child; m !== null; )
          mn(m), lC(m, e), m = m.sibling;
      mn(d);
    }
    function lC(e, t, a) {
      var i = e.alternate, o = e.flags;
      switch (e.tag) {
        case U:
        case ke:
        case me:
        case I: {
          if (Tl(t, e), oo(e), o & Yt) {
            try {
              _l(no | Mr, e, e.return), $s(no | Mr, e);
            } catch (Et) {
              Fn(e, e.return, Et);
            }
            if (e.mode & en) {
              try {
                lo(), _l(Ur | Mr, e, e.return);
              } catch (Et) {
                Fn(e, e.return, Et);
              }
              io(e);
            } else
              try {
                _l(Ur | Mr, e, e.return);
              } catch (Et) {
                Fn(e, e.return, Et);
              }
          }
          return;
        }
        case j: {
          Tl(t, e), oo(e), o & Kn && i !== null && $f(i, i.return);
          return;
        }
        case G: {
          Tl(t, e), oo(e), o & Kn && i !== null && $f(i, i.return);
          {
            if (e.flags & ti) {
              var u = e.stateNode;
              try {
                iE(u);
              } catch (Et) {
                Fn(e, e.return, Et);
              }
            }
            if (o & Yt) {
              var d = e.stateNode;
              if (d != null) {
                var m = e.memoizedProps, h = i !== null ? i.memoizedProps : m, E = e.type, C = e.updateQueue;
                if (e.updateQueue = null, C !== null)
                  try {
                    Iw(d, C, E, h, m, e);
                  } catch (Et) {
                    Fn(e, e.return, Et);
                  }
              }
            }
          }
          return;
        }
        case re: {
          if (Tl(t, e), oo(e), o & Yt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var M = e.stateNode, L = e.memoizedProps, Q = i !== null ? i.memoizedProps : L;
            try {
              $w(M, Q, L);
            } catch (Et) {
              Fn(e, e.return, Et);
            }
          }
          return;
        }
        case z: {
          if (Tl(t, e), oo(e), o & Yt && i !== null) {
            var X = i.memoizedState;
            if (X.isDehydrated)
              try {
                h0(t.containerInfo);
              } catch (Et) {
                Fn(e, e.return, Et);
              }
          }
          return;
        }
        case Y: {
          Tl(t, e), oo(e);
          return;
        }
        case ce: {
          Tl(t, e), oo(e);
          var ae = e.child;
          if (ae.flags & ur) {
            var He = ae.stateNode, st = ae.memoizedState, nt = st !== null;
            if (He.isHidden = nt, nt) {
              var Gt = ae.alternate !== null && ae.alternate.memoizedState !== null;
              Gt || pj();
            }
          }
          if (o & Yt) {
            try {
              DR(e);
            } catch (Et) {
              Fn(e, e.return, Et);
            }
            iC(e);
          }
          return;
        }
        case ee: {
          var Vt = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Pt
          ) {
            var H = aa;
            aa = H || Vt, Tl(t, e), aa = H;
          } else
            Tl(t, e);
          if (oo(e), o & ur) {
            var ie = e.stateNode, B = e.memoizedState, Te = B !== null, Ge = e;
            if (ie.isHidden = Te, Te && !Vt && (Ge.mode & Pt) !== it) {
              Je = Ge;
              for (var Ve = Ge.child; Ve !== null; )
                Je = Ve, MR(Ve), Ve = Ve.sibling;
            }
            TR(Ge, Te);
          }
          return;
        }
        case he: {
          Tl(t, e), oo(e), o & Yt && iC(e);
          return;
        }
        case Be:
          return;
        default: {
          Tl(t, e), oo(e);
          return;
        }
      }
    }
    function oo(e) {
      var t = e.flags;
      if (t & In) {
        try {
          kR(e);
        } catch (a) {
          Fn(e, e.return, a);
        }
        e.flags &= ~In;
      }
      t & ma && (e.flags &= ~ma);
    }
    function AR(e, t, a) {
      Vf = a, If = t, Je = e, oC(e, t, a), Vf = null, If = null;
    }
    function oC(e, t, a) {
      for (var i = (e.mode & Pt) !== it; Je !== null; ) {
        var o = Je, u = o.child;
        if (o.tag === ee && i) {
          var d = o.memoizedState !== null, m = d || Uv;
          if (m) {
            PS(e, t, a);
            continue;
          } else {
            var h = o.alternate, E = h !== null && h.memoizedState !== null, C = E || aa, M = Uv, L = aa;
            Uv = m, aa = C, aa && !L && (Je = o, UR(o));
            for (var Q = u; Q !== null; )
              Je = Q, oC(
                Q,
                // New root; bubble back up to here and stop.
                t,
                a
              ), Q = Q.sibling;
            Je = o, Uv = M, aa = L, PS(e, t, a);
            continue;
          }
        }
        (o.subtreeFlags & Bl) !== at && u !== null ? (u.return = o, Je = u) : PS(e, t, a);
      }
    }
    function PS(e, t, a) {
      for (; Je !== null; ) {
        var i = Je;
        if ((i.flags & Bl) !== at) {
          var o = i.alternate;
          mn(i);
          try {
            _R(t, o, i, a);
          } catch (d) {
            Fn(i, i.return, d);
          }
          zn();
        }
        if (i === e) {
          Je = null;
          return;
        }
        var u = i.sibling;
        if (u !== null) {
          u.return = i.return, Je = u;
          return;
        }
        Je = i.return;
      }
    }
    function MR(e) {
      for (; Je !== null; ) {
        var t = Je, a = t.child;
        switch (t.tag) {
          case U:
          case ke:
          case me:
          case I: {
            if (t.mode & en)
              try {
                lo(), _l(Ur, t, t.return);
              } finally {
                io(t);
              }
            else
              _l(Ur, t, t.return);
            break;
          }
          case j: {
            $f(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && US(t, t.return, i);
            break;
          }
          case G: {
            $f(t, t.return);
            break;
          }
          case ee: {
            var o = t.memoizedState !== null;
            if (o) {
              sC(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Je = a) : sC(e);
      }
    }
    function sC(e) {
      for (; Je !== null; ) {
        var t = Je;
        if (t === e) {
          Je = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Je = a;
          return;
        }
        Je = t.return;
      }
    }
    function UR(e) {
      for (; Je !== null; ) {
        var t = Je, a = t.child;
        if (t.tag === ee) {
          var i = t.memoizedState !== null;
          if (i) {
            uC(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Je = a) : uC(e);
      }
    }
    function uC(e) {
      for (; Je !== null; ) {
        var t = Je;
        mn(t);
        try {
          wR(t);
        } catch (i) {
          Fn(t, t.return, i);
        }
        if (zn(), t === e) {
          Je = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Je = a;
          return;
        }
        Je = t.return;
      }
    }
    function zR(e, t, a, i) {
      Je = t, FR(t, e, a, i);
    }
    function FR(e, t, a, i) {
      for (; Je !== null; ) {
        var o = Je, u = o.child;
        (o.subtreeFlags & ul) !== at && u !== null ? (u.return = o, Je = u) : PR(e, t, a, i);
      }
    }
    function PR(e, t, a, i) {
      for (; Je !== null; ) {
        var o = Je;
        if ((o.flags & pa) !== at) {
          mn(o);
          try {
            HR(t, o, a, i);
          } catch (d) {
            Fn(o, o.return, d);
          }
          zn();
        }
        if (o === e) {
          Je = null;
          return;
        }
        var u = o.sibling;
        if (u !== null) {
          u.return = o.return, Je = u;
          return;
        }
        Je = o.return;
      }
    }
    function HR(e, t, a, i) {
      switch (t.tag) {
        case U:
        case ke:
        case I: {
          if (t.mode & en) {
            aS();
            try {
              $s(na | Mr, t);
            } finally {
              rS(t);
            }
          } else
            $s(na | Mr, t);
          break;
        }
      }
    }
    function BR(e) {
      Je = e, VR();
    }
    function VR() {
      for (; Je !== null; ) {
        var e = Je, t = e.child;
        if ((Je.flags & ei) !== at) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var o = a[i];
              Je = o, YR(o, e);
            }
            {
              var u = e.alternate;
              if (u !== null) {
                var d = u.child;
                if (d !== null) {
                  u.child = null;
                  do {
                    var m = d.sibling;
                    d.sibling = null, d = m;
                  } while (d !== null);
                }
              }
            }
            Je = e;
          }
        }
        (e.subtreeFlags & ul) !== at && t !== null ? (t.return = e, Je = t) : IR();
      }
    }
    function IR() {
      for (; Je !== null; ) {
        var e = Je;
        (e.flags & pa) !== at && (mn(e), $R(e), zn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Je = t;
          return;
        }
        Je = e.return;
      }
    }
    function $R(e) {
      switch (e.tag) {
        case U:
        case ke:
        case I: {
          e.mode & en ? (aS(), _l(na | Mr, e, e.return), rS(e)) : _l(na | Mr, e, e.return);
          break;
        }
      }
    }
    function YR(e, t) {
      for (; Je !== null; ) {
        var a = Je;
        mn(a), QR(a, t), zn();
        var i = a.child;
        i !== null ? (i.return = a, Je = i) : WR(e);
      }
    }
    function WR(e) {
      for (; Je !== null; ) {
        var t = Je, a = t.sibling, i = t.return;
        if (tC(t), t === e) {
          Je = null;
          return;
        }
        if (a !== null) {
          a.return = i, Je = a;
          return;
        }
        Je = i;
      }
    }
    function QR(e, t) {
      switch (e.tag) {
        case U:
        case ke:
        case I: {
          e.mode & en ? (aS(), _l(na, e, t), rS(e)) : _l(na, e, t);
          break;
        }
      }
    }
    function GR(e) {
      switch (e.tag) {
        case U:
        case ke:
        case I: {
          try {
            $s(Ur | Mr, e);
          } catch (a) {
            Fn(e, e.return, a);
          }
          break;
        }
        case j: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            Fn(e, e.return, a);
          }
          break;
        }
      }
    }
    function KR(e) {
      switch (e.tag) {
        case U:
        case ke:
        case I: {
          try {
            $s(na | Mr, e);
          } catch (t) {
            Fn(e, e.return, t);
          }
          break;
        }
      }
    }
    function qR(e) {
      switch (e.tag) {
        case U:
        case ke:
        case I: {
          try {
            _l(Ur | Mr, e, e.return);
          } catch (a) {
            Fn(e, e.return, a);
          }
          break;
        }
        case j: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && US(e, e.return, t);
          break;
        }
      }
    }
    function XR(e) {
      switch (e.tag) {
        case U:
        case ke:
        case I:
          try {
            _l(na | Mr, e, e.return);
          } catch (t) {
            Fn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Bp = Symbol.for;
      Bp("selector.component"), Bp("selector.has_pseudo_class"), Bp("selector.role"), Bp("selector.test_id"), Bp("selector.text");
    }
    var JR = [];
    function ZR() {
      JR.forEach(function(e) {
        return e();
      });
    }
    var ej = b.ReactCurrentActQueue;
    function tj(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function cC() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && ej.current !== null && y("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var nj = Math.ceil, HS = b.ReactCurrentDispatcher, BS = b.ReactCurrentOwner, la = b.ReactCurrentBatchConfig, Rl = b.ReactCurrentActQueue, Pr = (
      /*             */
      0
    ), fC = (
      /*               */
      1
    ), oa = (
      /*                */
      2
    ), Xi = (
      /*                */
      4
    ), qo = 0, Vp = 1, lc = 2, Fv = 3, Ip = 4, dC = 5, VS = 6, Qt = Pr, Ia = null, ar = null, Hr = ge, so = ge, IS = Ms(ge), Br = qo, $p = null, Pv = ge, Yp = ge, Hv = ge, Wp = null, di = null, $S = 0, pC = 500, mC = 1 / 0, rj = 500, Xo = null;
    function Qp() {
      mC = xr() + rj;
    }
    function hC() {
      return mC;
    }
    var Bv = !1, YS = null, Yf = null, oc = !1, Ws = null, Gp = ge, WS = [], QS = null, aj = 50, Kp = 0, GS = null, KS = !1, Vv = !1, ij = 50, Wf = 0, Iv = null, qp = wn, $v = ge, vC = !1;
    function Yv() {
      return Ia;
    }
    function $a() {
      return (Qt & (oa | Xi)) !== Pr ? xr() : (qp !== wn || (qp = xr()), qp);
    }
    function Qs(e) {
      var t = e.mode;
      if ((t & Pt) === it)
        return vt;
      if ((Qt & oa) !== Pr && Hr !== ge)
        return ju(Hr);
      var a = eT() !== Z0;
      if (a) {
        if (la.transition !== null) {
          var i = la.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return $v === Jt && ($v = Fd()), $v;
      }
      var o = oi();
      if (o !== Jt)
        return o;
      var u = Fw();
      return u;
    }
    function lj(e) {
      var t = e.mode;
      return (t & Pt) === it ? vt : Km();
    }
    function Vr(e, t, a, i) {
      Nj(), vC && y("useInsertionEffect must not schedule updates."), KS && (Vv = !0), _s(e, a, i), (Qt & oa) !== ge && e === Ia ? Lj(t) : (ya && Du(e, t, a), Aj(t), e === Ia && ((Qt & oa) === Pr && (Yp = At(Yp, a)), Br === Ip && Gs(e, Hr)), pi(e, i), a === vt && Qt === Pr && (t.mode & Pt) === it && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !Rl.isBatchingLegacy && (Qp(), vE()));
    }
    function oj(e, t, a) {
      var i = e.current;
      i.lanes = t, _s(e, t, a), pi(e, a);
    }
    function sj(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Qt & oa) !== Pr
      );
    }
    function pi(e, t) {
      var a = e.callbackNode;
      ef(e, t);
      var i = Zc(e, e === Ia ? Hr : ge);
      if (i === ge) {
        a !== null && OC(a), e.callbackNode = null, e.callbackPriority = Jt;
        return;
      }
      var o = Wl(i), u = e.callbackPriority;
      if (u === o && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(Rl.current !== null && a !== nx)) {
        a == null && u !== vt && y("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && OC(a);
      var d;
      if (o === vt)
        e.tag === Us ? (Rl.isBatchingLegacy !== null && (Rl.didScheduleLegacyUpdate = !0), U0(SC.bind(null, e))) : hE(SC.bind(null, e)), Rl.current !== null ? Rl.current.push(zs) : Hw(function() {
          (Qt & (oa | Xi)) === Pr && zs();
        }), d = null;
      else {
        var m;
        switch (nh(i)) {
          case qr:
            m = mu;
            break;
          case Bi:
            m = Vl;
            break;
          case ii:
            m = cl;
            break;
          case li:
            m = _o;
            break;
          default:
            m = cl;
            break;
        }
        d = rx(m, yC.bind(null, e));
      }
      e.callbackPriority = o, e.callbackNode = d;
    }
    function yC(e, t) {
      if (TT(), qp = wn, $v = ge, (Qt & (oa | Xi)) !== Pr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Zo();
      if (i && e.callbackNode !== a)
        return null;
      var o = Zc(e, e === Ia ? Hr : ge);
      if (o === ge)
        return null;
      var u = !nf(e, o) && !Gm(e, o) && !t, d = u ? gj(e, o) : Qv(e, o);
      if (d !== qo) {
        if (d === lc) {
          var m = tf(e);
          m !== ge && (o = m, d = qS(e, m));
        }
        if (d === Vp) {
          var h = $p;
          throw sc(e, ge), Gs(e, o), pi(e, xr()), h;
        }
        if (d === VS)
          Gs(e, o);
        else {
          var E = !nf(e, o), C = e.current.alternate;
          if (E && !cj(C)) {
            if (d = Qv(e, o), d === lc) {
              var M = tf(e);
              M !== ge && (o = M, d = qS(e, M));
            }
            if (d === Vp) {
              var L = $p;
              throw sc(e, ge), Gs(e, o), pi(e, xr()), L;
            }
          }
          e.finishedWork = C, e.finishedLanes = o, uj(e, d, o);
        }
      }
      return pi(e, xr()), e.callbackNode === a ? yC.bind(null, e) : null;
    }
    function qS(e, t) {
      var a = Wp;
      if (lf(e)) {
        var i = sc(e, t);
        i.flags |= $r, k0(e.containerInfo);
      }
      var o = Qv(e, t);
      if (o !== lc) {
        var u = di;
        di = a, u !== null && gC(u);
      }
      return o;
    }
    function gC(e) {
      di === null ? di = e : di.push.apply(di, e);
    }
    function uj(e, t, a) {
      switch (t) {
        case qo:
        case Vp:
          throw new Error("Root did not complete. This is a bug in React.");
        case lc: {
          uc(e, di, Xo);
          break;
        }
        case Fv: {
          if (Gs(e, a), Mo(a) && // do not delay if we're inside an act() scope
          !LC()) {
            var i = $S + pC - xr();
            if (i > 10) {
              var o = Zc(e, ge);
              if (o !== ge)
                break;
              var u = e.suspendedLanes;
              if (!Uo(u, a)) {
                $a(), rf(e, u);
                break;
              }
              e.timeoutHandle = Qy(uc.bind(null, e, di, Xo), i);
              break;
            }
          }
          uc(e, di, Xo);
          break;
        }
        case Ip: {
          if (Gs(e, a), Ud(a))
            break;
          if (!LC()) {
            var d = Ei(e, a), m = d, h = xr() - m, E = kj(h) - h;
            if (E > 10) {
              e.timeoutHandle = Qy(uc.bind(null, e, di, Xo), E);
              break;
            }
          }
          uc(e, di, Xo);
          break;
        }
        case dC: {
          uc(e, di, Xo);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function cj(e) {
      for (var t = e; ; ) {
        if (t.flags & Ss) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var o = 0; o < i.length; o++) {
                var u = i[o], d = u.getSnapshot, m = u.value;
                try {
                  if (!Ce(d(), m))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var h = t.child;
        if (t.subtreeFlags & Ss && h !== null) {
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
    function Gs(e, t) {
      t = ku(t, Hv), t = ku(t, Yp), Jm(e, t);
    }
    function SC(e) {
      if (RT(), (Qt & (oa | Xi)) !== Pr)
        throw new Error("Should not already be working.");
      Zo();
      var t = Zc(e, ge);
      if (!Sa(t, vt))
        return pi(e, xr()), null;
      var a = Qv(e, t);
      if (e.tag !== Us && a === lc) {
        var i = tf(e);
        i !== ge && (t = i, a = qS(e, i));
      }
      if (a === Vp) {
        var o = $p;
        throw sc(e, ge), Gs(e, t), pi(e, xr()), o;
      }
      if (a === VS)
        throw new Error("Root did not complete. This is a bug in React.");
      var u = e.current.alternate;
      return e.finishedWork = u, e.finishedLanes = t, uc(e, di, Xo), pi(e, xr()), null;
    }
    function fj(e, t) {
      t !== ge && (af(e, At(t, vt)), pi(e, xr()), (Qt & (oa | Xi)) === Pr && (Qp(), zs()));
    }
    function XS(e, t) {
      var a = Qt;
      Qt |= fC;
      try {
        return e(t);
      } finally {
        Qt = a, Qt === Pr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !Rl.isBatchingLegacy && (Qp(), vE());
      }
    }
    function dj(e, t, a, i, o) {
      var u = oi(), d = la.transition;
      try {
        return la.transition = null, pr(qr), e(t, a, i, o);
      } finally {
        pr(u), la.transition = d, Qt === Pr && Qp();
      }
    }
    function Jo(e) {
      Ws !== null && Ws.tag === Us && (Qt & (oa | Xi)) === Pr && Zo();
      var t = Qt;
      Qt |= fC;
      var a = la.transition, i = oi();
      try {
        return la.transition = null, pr(qr), e ? e() : void 0;
      } finally {
        pr(i), la.transition = a, Qt = t, (Qt & (oa | Xi)) === Pr && zs();
      }
    }
    function xC() {
      return (Qt & (oa | Xi)) !== Pr;
    }
    function Wv(e, t) {
      _a(IS, so, e), so = At(so, t);
    }
    function JS(e) {
      so = IS.current, Ca(IS, e);
    }
    function sc(e, t) {
      e.finishedWork = null, e.finishedLanes = ge;
      var a = e.timeoutHandle;
      if (a !== Gy && (e.timeoutHandle = Gy, Pw(a)), ar !== null)
        for (var i = ar.return; i !== null; ) {
          var o = i.alternate;
          Kb(o, i), i = i.return;
        }
      Ia = e;
      var u = cc(e.current, null);
      return ar = u, Hr = so = t, Br = qo, $p = null, Pv = ge, Yp = ge, Hv = ge, Wp = null, di = null, oT(), Sl.discardPendingWarnings(), u;
    }
    function EC(e, t) {
      do {
        var a = ar;
        try {
          if (nv(), YE(), zn(), BS.current = null, a === null || a.return === null) {
            Br = Vp, $p = t, ar = null;
            return;
          }
          if (ue && a.mode & en && Dv(a, !0), te)
            if (Pa(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Hi(a, i, Hr);
            } else
              vu(a, t, Hr);
          UT(e, a.return, a, t, Hr), wC(a);
        } catch (o) {
          t = o, ar === a && a !== null ? (a = a.return, ar = a) : a = ar;
          continue;
        }
        return;
      } while (!0);
    }
    function bC() {
      var e = HS.current;
      return HS.current = Tv, e === null ? Tv : e;
    }
    function CC(e) {
      HS.current = e;
    }
    function pj() {
      $S = xr();
    }
    function Xp(e) {
      Pv = At(e, Pv);
    }
    function mj() {
      Br === qo && (Br = Fv);
    }
    function ZS() {
      (Br === qo || Br === Fv || Br === lc) && (Br = Ip), Ia !== null && (Ru(Pv) || Ru(Yp)) && Gs(Ia, Hr);
    }
    function hj(e) {
      Br !== Ip && (Br = lc), Wp === null ? Wp = [e] : Wp.push(e);
    }
    function vj() {
      return Br === qo;
    }
    function Qv(e, t) {
      var a = Qt;
      Qt |= oa;
      var i = bC();
      if (Ia !== e || Hr !== t) {
        if (ya) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (Jp(e, Hr), o.clear()), Zm(e, t);
        }
        Xo = Vd(), sc(e, t);
      }
      jo(t);
      do
        try {
          yj();
          break;
        } catch (u) {
          EC(e, u);
        }
      while (!0);
      if (nv(), Qt = a, CC(i), ar !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Mc(), Ia = null, Hr = ge, Br;
    }
    function yj() {
      for (; ar !== null; )
        _C(ar);
    }
    function gj(e, t) {
      var a = Qt;
      Qt |= oa;
      var i = bC();
      if (Ia !== e || Hr !== t) {
        if (ya) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (Jp(e, Hr), o.clear()), Zm(e, t);
        }
        Xo = Vd(), Qp(), sc(e, t);
      }
      jo(t);
      do
        try {
          Sj();
          break;
        } catch (u) {
          EC(e, u);
        }
      while (!0);
      return nv(), CC(i), Qt = a, ar !== null ? ($m(), qo) : (Mc(), Ia = null, Hr = ge, Br);
    }
    function Sj() {
      for (; ar !== null && !Ed(); )
        _C(ar);
    }
    function _C(e) {
      var t = e.alternate;
      mn(e);
      var a;
      (e.mode & en) !== it ? (nS(e), a = ex(t, e, so), Dv(e, !0)) : a = ex(t, e, so), zn(), e.memoizedProps = e.pendingProps, a === null ? wC(e) : ar = a, BS.current = null;
    }
    function wC(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & pu) === at) {
          mn(t);
          var o = void 0;
          if ((t.mode & en) === it ? o = Gb(a, t, so) : (nS(t), o = Gb(a, t, so), Dv(t, !1)), zn(), o !== null) {
            ar = o;
            return;
          }
        } else {
          var u = mR(a, t);
          if (u !== null) {
            u.flags &= Fm, ar = u;
            return;
          }
          if ((t.mode & en) !== it) {
            Dv(t, !1);
            for (var d = t.actualDuration, m = t.child; m !== null; )
              d += m.actualDuration, m = m.sibling;
            t.actualDuration = d;
          }
          if (i !== null)
            i.flags |= pu, i.subtreeFlags = at, i.deletions = null;
          else {
            Br = VS, ar = null;
            return;
          }
        }
        var h = t.sibling;
        if (h !== null) {
          ar = h;
          return;
        }
        t = i, ar = t;
      } while (t !== null);
      Br === qo && (Br = dC);
    }
    function uc(e, t, a) {
      var i = oi(), o = la.transition;
      try {
        la.transition = null, pr(qr), xj(e, t, a, i);
      } finally {
        la.transition = o, pr(i);
      }
      return null;
    }
    function xj(e, t, a, i) {
      do
        Zo();
      while (Ws !== null);
      if (Dj(), (Qt & (oa | Xi)) !== Pr)
        throw new Error("Should not already be working.");
      var o = e.finishedWork, u = e.finishedLanes;
      if (Rd(u), o === null)
        return jd(), null;
      if (u === ge && y("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = ge, o === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Jt;
      var d = At(o.lanes, o.childLanes);
      Hd(e, d), e === Ia && (Ia = null, ar = null, Hr = ge), ((o.subtreeFlags & ul) !== at || (o.flags & ul) !== at) && (oc || (oc = !0, QS = a, rx(cl, function() {
        return Zo(), null;
      })));
      var m = (o.subtreeFlags & (Pl | Hl | Bl | ul)) !== at, h = (o.flags & (Pl | Hl | Bl | ul)) !== at;
      if (m || h) {
        var E = la.transition;
        la.transition = null;
        var C = oi();
        pr(qr);
        var M = Qt;
        Qt |= Xi, BS.current = null, SR(e, o), vb(), LR(e, o, u), Ow(e.containerInfo), e.current = o, yu(u), AR(o, e, u), gu(), bd(), Qt = M, pr(C), la.transition = E;
      } else
        e.current = o, vb();
      var L = oc;
      if (oc ? (oc = !1, Ws = e, Gp = u) : (Wf = 0, Iv = null), d = e.pendingLanes, d === ge && (Yf = null), L || kC(e.current, !1), _d(o.stateNode, i), ya && e.memoizedUpdaters.clear(), ZR(), pi(e, xr()), t !== null)
        for (var Q = e.onRecoverableError, X = 0; X < t.length; X++) {
          var ae = t[X], He = ae.stack, st = ae.digest;
          Q(ae.value, {
            componentStack: He,
            digest: st
          });
        }
      if (Bv) {
        Bv = !1;
        var nt = YS;
        throw YS = null, nt;
      }
      return Sa(Gp, vt) && e.tag !== Us && Zo(), d = e.pendingLanes, Sa(d, vt) ? (wT(), e === GS ? Kp++ : (Kp = 0, GS = e)) : Kp = 0, zs(), jd(), null;
    }
    function Zo() {
      if (Ws !== null) {
        var e = nh(Gp), t = Lu(ii, e), a = la.transition, i = oi();
        try {
          return la.transition = null, pr(t), bj();
        } finally {
          pr(i), la.transition = a;
        }
      }
      return !1;
    }
    function Ej(e) {
      WS.push(e), oc || (oc = !0, rx(cl, function() {
        return Zo(), null;
      }));
    }
    function bj() {
      if (Ws === null)
        return !1;
      var e = QS;
      QS = null;
      var t = Ws, a = Gp;
      if (Ws = null, Gp = ge, (Qt & (oa | Xi)) !== Pr)
        throw new Error("Cannot flush passive effects while already rendering.");
      KS = !0, Vv = !1, Ro(a);
      var i = Qt;
      Qt |= Xi, BR(t.current), zR(t, t.current, a, e);
      {
        var o = WS;
        WS = [];
        for (var u = 0; u < o.length; u++) {
          var d = o[u];
          CR(t, d);
        }
      }
      Dd(), kC(t.current, !0), Qt = i, zs(), Vv ? t === Iv ? Wf++ : (Wf = 0, Iv = t) : Wf = 0, KS = !1, Vv = !1, wd(t);
      {
        var m = t.current.stateNode;
        m.effectDuration = 0, m.passiveEffectDuration = 0;
      }
      return !0;
    }
    function TC(e) {
      return Yf !== null && Yf.has(e);
    }
    function Cj(e) {
      Yf === null ? Yf = /* @__PURE__ */ new Set([e]) : Yf.add(e);
    }
    function _j(e) {
      Bv || (Bv = !0, YS = e);
    }
    var wj = _j;
    function RC(e, t, a) {
      var i = ac(a, t), o = _b(e, i, vt), u = Ps(e, o, vt), d = $a();
      u !== null && (_s(u, vt, d), pi(u, d));
    }
    function Fn(e, t, a) {
      if (vR(a), Zp(!1), e.tag === z) {
        RC(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === z) {
          RC(i, e, a);
          return;
        } else if (i.tag === j) {
          var o = i.type, u = i.stateNode;
          if (typeof o.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && !TC(u)) {
            var d = ac(a, e), m = xS(i, d, vt), h = Ps(i, m, vt), E = $a();
            h !== null && (_s(h, vt, E), pi(h, E));
            return;
          }
        }
        i = i.return;
      }
      y(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function Tj(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var o = $a();
      rf(e, a), Mj(e), Ia === e && Uo(Hr, a) && (Br === Ip || Br === Fv && Mo(Hr) && xr() - $S < pC ? sc(e, ge) : Hv = At(Hv, a)), pi(e, o);
    }
    function jC(e, t) {
      t === Jt && (t = lj(e));
      var a = $a(), i = ci(e, t);
      i !== null && (_s(i, t, a), pi(i, a));
    }
    function Rj(e) {
      var t = e.memoizedState, a = Jt;
      t !== null && (a = t.retryLane), jC(e, a);
    }
    function jj(e, t) {
      var a = Jt, i;
      switch (e.tag) {
        case ce:
          i = e.stateNode;
          var o = e.memoizedState;
          o !== null && (a = o.retryLane);
          break;
        case he:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), jC(e, a);
    }
    function kj(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : nj(e / 1960) * 1960;
    }
    function Nj() {
      if (Kp > aj)
        throw Kp = 0, GS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Wf > ij && (Wf = 0, Iv = null, y("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function Dj() {
      Sl.flushLegacyContextWarning(), Sl.flushPendingUnsafeLifecycleWarnings();
    }
    function kC(e, t) {
      mn(e), Gv(e, Fl, qR), t && Gv(e, zi, XR), Gv(e, Fl, GR), t && Gv(e, zi, KR), zn();
    }
    function Gv(e, t, a) {
      for (var i = e, o = null; i !== null; ) {
        var u = i.subtreeFlags & t;
        i !== o && i.child !== null && u !== at ? i = i.child : ((i.flags & t) !== at && a(i), i.sibling !== null ? i = i.sibling : i = o = i.return);
      }
    }
    var Kv = null;
    function NC(e) {
      {
        if ((Qt & oa) !== Pr || !(e.mode & Pt))
          return;
        var t = e.tag;
        if (t !== de && t !== z && t !== j && t !== U && t !== ke && t !== me && t !== I)
          return;
        var a = jt(e) || "ReactComponent";
        if (Kv !== null) {
          if (Kv.has(a))
            return;
          Kv.add(a);
        } else
          Kv = /* @__PURE__ */ new Set([a]);
        var i = Nr;
        try {
          mn(e), y("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? mn(e) : zn();
        }
      }
    }
    var ex;
    {
      var Oj = null;
      ex = function(e, t, a) {
        var i = FC(Oj, t);
        try {
          return Ib(e, t, a);
        } catch (u) {
          if ($0() || u !== null && typeof u == "object" && typeof u.then == "function")
            throw u;
          if (nv(), YE(), Kb(e, t), FC(t, i), t.mode & en && nS(t), zl(null, Ib, null, e, t, a), ol()) {
            var o = du();
            typeof o == "object" && o !== null && o._suppressLogging && typeof u == "object" && u !== null && !u._suppressLogging && (u._suppressLogging = !0);
          }
          throw u;
        }
      };
    }
    var DC = !1, tx;
    tx = /* @__PURE__ */ new Set();
    function Lj(e) {
      if (Ni && !bT())
        switch (e.tag) {
          case U:
          case ke:
          case I: {
            var t = ar && jt(ar) || "Unknown", a = t;
            if (!tx.has(a)) {
              tx.add(a);
              var i = jt(e) || "Unknown";
              y("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case j: {
            DC || (y("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), DC = !0);
            break;
          }
        }
    }
    function Jp(e, t) {
      if (ya) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          Du(e, i, t);
        });
      }
    }
    var nx = {};
    function rx(e, t) {
      {
        var a = Rl.current;
        return a !== null ? (a.push(t), nx) : xd(e, t);
      }
    }
    function OC(e) {
      if (e !== nx)
        return Hm(e);
    }
    function LC() {
      return Rl.current !== null;
    }
    function Aj(e) {
      {
        if (e.mode & Pt) {
          if (!cC())
            return;
        } else if (!tj() || Qt !== Pr || e.tag !== U && e.tag !== ke && e.tag !== I)
          return;
        if (Rl.current === null) {
          var t = Nr;
          try {
            mn(e), y(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, jt(e));
          } finally {
            t ? mn(e) : zn();
          }
        }
      }
    }
    function Mj(e) {
      e.tag !== Us && cC() && Rl.current === null && y(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Zp(e) {
      vC = e;
    }
    var Ji = null, Qf = null, Uj = function(e) {
      Ji = e;
    };
    function Gf(e) {
      {
        if (Ji === null)
          return e;
        var t = Ji(e);
        return t === void 0 ? e : t.current;
      }
    }
    function ax(e) {
      return Gf(e);
    }
    function ix(e) {
      {
        if (Ji === null)
          return e;
        var t = Ji(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Gf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: pe,
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
    function AC(e, t) {
      {
        if (Ji === null)
          return !1;
        var a = e.elementType, i = t.type, o = !1, u = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case j: {
            typeof i == "function" && (o = !0);
            break;
          }
          case U: {
            (typeof i == "function" || u === _t) && (o = !0);
            break;
          }
          case ke: {
            (u === pe || u === _t) && (o = !0);
            break;
          }
          case me:
          case I: {
            (u === pt || u === _t) && (o = !0);
            break;
          }
          default:
            return !1;
        }
        if (o) {
          var d = Ji(a);
          if (d !== void 0 && d === Ji(i))
            return !0;
        }
        return !1;
      }
    }
    function MC(e) {
      {
        if (Ji === null || typeof WeakSet != "function")
          return;
        Qf === null && (Qf = /* @__PURE__ */ new WeakSet()), Qf.add(e);
      }
    }
    var zj = function(e, t) {
      {
        if (Ji === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Zo(), Jo(function() {
          lx(e.current, i, a);
        });
      }
    }, Fj = function(e, t) {
      {
        if (e.context !== _i)
          return;
        Zo(), Jo(function() {
          em(t, e, null, null);
        });
      }
    };
    function lx(e, t, a) {
      {
        var i = e.alternate, o = e.child, u = e.sibling, d = e.tag, m = e.type, h = null;
        switch (d) {
          case U:
          case I:
          case j:
            h = m;
            break;
          case ke:
            h = m.render;
            break;
        }
        if (Ji === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var E = !1, C = !1;
        if (h !== null) {
          var M = Ji(h);
          M !== void 0 && (a.has(M) ? C = !0 : t.has(M) && (d === j ? C = !0 : E = !0));
        }
        if (Qf !== null && (Qf.has(e) || i !== null && Qf.has(i)) && (C = !0), C && (e._debugNeedsRemount = !0), C || E) {
          var L = ci(e, vt);
          L !== null && Vr(L, e, vt, wn);
        }
        o !== null && !C && lx(o, t, a), u !== null && lx(u, t, a);
      }
    }
    var Pj = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(o) {
          return o.current;
        }));
        return ox(e.current, i, a), a;
      }
    };
    function ox(e, t, a) {
      {
        var i = e.child, o = e.sibling, u = e.tag, d = e.type, m = null;
        switch (u) {
          case U:
          case I:
          case j:
            m = d;
            break;
          case ke:
            m = d.render;
            break;
        }
        var h = !1;
        m !== null && t.has(m) && (h = !0), h ? Hj(e, a) : i !== null && ox(i, t, a), o !== null && ox(o, t, a);
      }
    }
    function Hj(e, t) {
      {
        var a = Bj(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case G:
              t.add(i.stateNode);
              return;
            case Y:
              t.add(i.stateNode.containerInfo);
              return;
            case z:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function Bj(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === G)
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
    var sx;
    {
      sx = !1;
      try {
        var UC = Object.preventExtensions({});
      } catch {
        sx = !0;
      }
    }
    function Vj(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = at, this.subtreeFlags = at, this.deletions = null, this.lanes = ge, this.childLanes = ge, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !sx && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var wi = function(e, t, a, i) {
      return new Vj(e, t, a, i);
    };
    function ux(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Ij(e) {
      return typeof e == "function" && !ux(e) && e.defaultProps === void 0;
    }
    function $j(e) {
      if (typeof e == "function")
        return ux(e) ? j : U;
      if (e != null) {
        var t = e.$$typeof;
        if (t === pe)
          return ke;
        if (t === pt)
          return me;
      }
      return de;
    }
    function cc(e, t) {
      var a = e.alternate;
      a === null ? (a = wi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = at, a.subtreeFlags = at, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & cr, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case de:
        case U:
        case I:
          a.type = Gf(e.type);
          break;
        case j:
          a.type = ax(e.type);
          break;
        case ke:
          a.type = ix(e.type);
          break;
      }
      return a;
    }
    function Yj(e, t) {
      e.flags &= cr | In;
      var a = e.alternate;
      if (a === null)
        e.childLanes = ge, e.lanes = t, e.child = null, e.subtreeFlags = at, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = at, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function Wj(e, t, a) {
      var i;
      return e === Wh ? (i = Pt, t === !0 && (i |= yn, i |= tn)) : i = it, ya && (i |= en), wi(z, null, null, i);
    }
    function cx(e, t, a, i, o, u) {
      var d = de, m = e;
      if (typeof e == "function")
        ux(e) ? (d = j, m = ax(m)) : m = Gf(m);
      else if (typeof e == "string")
        d = G;
      else
        e: switch (e) {
          case Ka:
            return Ks(a.children, o, u, t);
          case fa:
            d = ye, o |= yn, (o & Pt) !== it && (o |= tn);
            break;
          case Na:
            return Qj(a, o, u, t);
          case ze:
            return Gj(a, o, u, t);
          case Qe:
            return Kj(a, o, u, t);
          case Un:
            return zC(a, o, u, t);
          case Bt:
          case Rt:
          case Cn:
          case yr:
          case Mt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case Da:
                  d = le;
                  break e;
                case R:
                  d = Ae;
                  break e;
                case pe:
                  d = ke, m = ix(m);
                  break e;
                case pt:
                  d = me;
                  break e;
                case _t:
                  d = _e, m = null;
                  break e;
              }
            var h = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (h += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var E = i ? jt(i) : null;
              E && (h += `

Check the render method of \`` + E + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + h));
          }
        }
      var C = wi(d, a, t, o);
      return C.elementType = e, C.type = m, C.lanes = u, C._debugOwner = i, C;
    }
    function fx(e, t, a) {
      var i = null;
      i = e._owner;
      var o = e.type, u = e.key, d = e.props, m = cx(o, u, d, i, t, a);
      return m._debugSource = e._source, m._debugOwner = e._owner, m;
    }
    function Ks(e, t, a, i) {
      var o = wi(oe, e, i, t);
      return o.lanes = a, o;
    }
    function Qj(e, t, a, i) {
      typeof e.id != "string" && y('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var o = wi(Ee, e, i, t | en);
      return o.elementType = Na, o.lanes = a, o.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, o;
    }
    function Gj(e, t, a, i) {
      var o = wi(ce, e, i, t);
      return o.elementType = ze, o.lanes = a, o;
    }
    function Kj(e, t, a, i) {
      var o = wi(he, e, i, t);
      return o.elementType = Qe, o.lanes = a, o;
    }
    function zC(e, t, a, i) {
      var o = wi(ee, e, i, t);
      o.elementType = Un, o.lanes = a;
      var u = {
        isHidden: !1
      };
      return o.stateNode = u, o;
    }
    function dx(e, t, a) {
      var i = wi(re, e, null, t);
      return i.lanes = a, i;
    }
    function qj() {
      var e = wi(G, null, null, it);
      return e.elementType = "DELETED", e;
    }
    function Xj(e) {
      var t = wi(De, null, null, it);
      return t.stateNode = e, t;
    }
    function px(e, t, a) {
      var i = e.children !== null ? e.children : [], o = wi(Y, i, e.key, t);
      return o.lanes = a, o.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, o;
    }
    function FC(e, t) {
      return e === null && (e = wi(de, null, null, it)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function Jj(e, t, a, i, o) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Gy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Jt, this.eventTimes = Nu(ge), this.expirationTimes = Nu(wn), this.pendingLanes = ge, this.suspendedLanes = ge, this.pingedLanes = ge, this.expiredLanes = ge, this.mutableReadLanes = ge, this.finishedLanes = ge, this.entangledLanes = ge, this.entanglements = Nu(ge), this.identifierPrefix = i, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var u = this.pendingUpdatersLaneMap = [], d = 0; d < ko; d++)
          u.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Wh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Us:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function PC(e, t, a, i, o, u, d, m, h, E) {
      var C = new Jj(e, t, a, m, h), M = Wj(t, u);
      C.current = M, M.stateNode = C;
      {
        var L = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        M.memoizedState = L;
      }
      return Tg(M), C;
    }
    var mx = "18.3.1";
    function Zj(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return Tn(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: Gn,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var hx, vx;
    hx = !1, vx = {};
    function HC(e) {
      if (!e)
        return _i;
      var t = gs(e), a = M0(t);
      if (t.tag === j) {
        var i = t.type;
        if (to(i))
          return pE(t, i, a);
      }
      return a;
    }
    function ek(e, t) {
      {
        var a = gs(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var o = ha(a);
        if (o === null)
          return null;
        if (o.mode & yn) {
          var u = jt(a) || "Component";
          if (!vx[u]) {
            vx[u] = !0;
            var d = Nr;
            try {
              mn(o), a.mode & yn ? y("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, u) : y("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, u);
            } finally {
              d ? mn(d) : zn();
            }
          }
        }
        return o.stateNode;
      }
    }
    function BC(e, t, a, i, o, u, d, m) {
      var h = !1, E = null;
      return PC(e, t, h, E, a, i, o, u, d);
    }
    function VC(e, t, a, i, o, u, d, m, h, E) {
      var C = !0, M = PC(a, i, C, e, o, u, d, m, h);
      M.context = HC(null);
      var L = M.current, Q = $a(), X = Qs(L), ae = Go(Q, X);
      return ae.callback = t ?? null, Ps(L, ae, X), oj(M, X, Q), M;
    }
    function em(e, t, a, i) {
      Cd(t, e);
      var o = t.current, u = $a(), d = Qs(o);
      Yn(d);
      var m = HC(a);
      t.context === null ? t.context = m : t.pendingContext = m, Ni && Nr !== null && !hx && (hx = !0, y(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, jt(Nr) || "Unknown"));
      var h = Go(u, d);
      h.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && y("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), h.callback = i);
      var E = Ps(o, h, d);
      return E !== null && (Vr(E, o, d, u), ov(E, o, d)), d;
    }
    function qv(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case G:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function tk(e) {
      switch (e.tag) {
        case z: {
          var t = e.stateNode;
          if (lf(t)) {
            var a = Wm(t);
            fj(t, a);
          }
          break;
        }
        case ce: {
          Jo(function() {
            var o = ci(e, vt);
            if (o !== null) {
              var u = $a();
              Vr(o, e, vt, u);
            }
          });
          var i = vt;
          yx(e, i);
          break;
        }
      }
    }
    function IC(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Xm(a.retryLane, t));
    }
    function yx(e, t) {
      IC(e, t);
      var a = e.alternate;
      a && IC(a, t);
    }
    function nk(e) {
      if (e.tag === ce) {
        var t = _u, a = ci(e, t);
        if (a !== null) {
          var i = $a();
          Vr(a, e, t, i);
        }
        yx(e, t);
      }
    }
    function rk(e) {
      if (e.tag === ce) {
        var t = Qs(e), a = ci(e, t);
        if (a !== null) {
          var i = $a();
          Vr(a, e, t, i);
        }
        yx(e, t);
      }
    }
    function $C(e) {
      var t = Pn(e);
      return t === null ? null : t.stateNode;
    }
    var YC = function(e) {
      return null;
    };
    function ak(e) {
      return YC(e);
    }
    var WC = function(e) {
      return !1;
    };
    function ik(e) {
      return WC(e);
    }
    var QC = null, GC = null, KC = null, qC = null, XC = null, JC = null, ZC = null, e_ = null, t_ = null;
    {
      var n_ = function(e, t, a) {
        var i = t[a], o = zt(e) ? e.slice() : Ot({}, e);
        return a + 1 === t.length ? (zt(o) ? o.splice(i, 1) : delete o[i], o) : (o[i] = n_(e[i], t, a + 1), o);
      }, r_ = function(e, t) {
        return n_(e, t, 0);
      }, a_ = function(e, t, a, i) {
        var o = t[i], u = zt(e) ? e.slice() : Ot({}, e);
        if (i + 1 === t.length) {
          var d = a[i];
          u[d] = u[o], zt(u) ? u.splice(o, 1) : delete u[o];
        } else
          u[o] = a_(
            // $FlowFixMe number or string is fine here
            e[o],
            t,
            a,
            i + 1
          );
        return u;
      }, i_ = function(e, t, a) {
        if (t.length !== a.length) {
          N("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              N("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return a_(e, t, a, 0);
      }, l_ = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var o = t[a], u = zt(e) ? e.slice() : Ot({}, e);
        return u[o] = l_(e[o], t, a + 1, i), u;
      }, o_ = function(e, t, a) {
        return l_(e, t, 0, a);
      }, gx = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      QC = function(e, t, a, i) {
        var o = gx(e, t);
        if (o !== null) {
          var u = o_(o.memoizedState, a, i);
          o.memoizedState = u, o.baseState = u, e.memoizedProps = Ot({}, e.memoizedProps);
          var d = ci(e, vt);
          d !== null && Vr(d, e, vt, wn);
        }
      }, GC = function(e, t, a) {
        var i = gx(e, t);
        if (i !== null) {
          var o = r_(i.memoizedState, a);
          i.memoizedState = o, i.baseState = o, e.memoizedProps = Ot({}, e.memoizedProps);
          var u = ci(e, vt);
          u !== null && Vr(u, e, vt, wn);
        }
      }, KC = function(e, t, a, i) {
        var o = gx(e, t);
        if (o !== null) {
          var u = i_(o.memoizedState, a, i);
          o.memoizedState = u, o.baseState = u, e.memoizedProps = Ot({}, e.memoizedProps);
          var d = ci(e, vt);
          d !== null && Vr(d, e, vt, wn);
        }
      }, qC = function(e, t, a) {
        e.pendingProps = o_(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = ci(e, vt);
        i !== null && Vr(i, e, vt, wn);
      }, XC = function(e, t) {
        e.pendingProps = r_(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = ci(e, vt);
        a !== null && Vr(a, e, vt, wn);
      }, JC = function(e, t, a) {
        e.pendingProps = i_(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = ci(e, vt);
        i !== null && Vr(i, e, vt, wn);
      }, ZC = function(e) {
        var t = ci(e, vt);
        t !== null && Vr(t, e, vt, wn);
      }, e_ = function(e) {
        YC = e;
      }, t_ = function(e) {
        WC = e;
      };
    }
    function lk(e) {
      var t = ha(e);
      return t === null ? null : t.stateNode;
    }
    function ok(e) {
      return null;
    }
    function sk() {
      return Nr;
    }
    function uk(e) {
      var t = e.findFiberByHostInstance, a = b.ReactCurrentDispatcher;
      return Es({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: QC,
        overrideHookStateDeletePath: GC,
        overrideHookStateRenamePath: KC,
        overrideProps: qC,
        overridePropsDeletePath: XC,
        overridePropsRenamePath: JC,
        setErrorHandler: e_,
        setSuspenseHandler: t_,
        scheduleUpdate: ZC,
        currentDispatcherRef: a,
        findHostInstanceByFiber: lk,
        findFiberByHostInstance: t || ok,
        // React Refresh
        findHostInstancesForRefresh: Pj,
        scheduleRefresh: zj,
        scheduleRoot: Fj,
        setRefreshHandler: Uj,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: sk,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: mx
      });
    }
    var s_ = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function Sx(e) {
      this._internalRoot = e;
    }
    Xv.prototype.render = Sx.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? y("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Jv(arguments[1]) ? y("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && y("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== sr) {
          var i = $C(t.current);
          i && i.parentNode !== a && y("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      em(e, t, null, null);
    }, Xv.prototype.unmount = Sx.prototype.unmount = function() {
      typeof arguments[0] == "function" && y("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        xC() && y("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Jo(function() {
          em(null, e, null, null);
        }), sE(t);
      }
    };
    function ck(e, t) {
      if (!Jv(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      u_(e);
      var a = !1, i = !1, o = "", u = s_;
      t != null && (t.hydrate ? N("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === kr && y(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (u = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var d = BC(e, Wh, null, a, i, o, u);
      Ph(d.current, e);
      var m = e.nodeType === sr ? e.parentNode : e;
      return lp(m), new Sx(d);
    }
    function Xv(e) {
      this._internalRoot = e;
    }
    function fk(e) {
      e && oh(e);
    }
    Xv.prototype.unstable_scheduleHydration = fk;
    function dk(e, t, a) {
      if (!Jv(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      u_(e), t === void 0 && y("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, o = a != null && a.hydratedSources || null, u = !1, d = !1, m = "", h = s_;
      a != null && (a.unstable_strictMode === !0 && (u = !0), a.identifierPrefix !== void 0 && (m = a.identifierPrefix), a.onRecoverableError !== void 0 && (h = a.onRecoverableError));
      var E = VC(t, null, e, Wh, i, u, d, m, h);
      if (Ph(E.current, e), lp(e), o)
        for (var C = 0; C < o.length; C++) {
          var M = o[C];
          vT(E, M);
        }
      return new Xv(E);
    }
    function Jv(e) {
      return !!(e && (e.nodeType === da || e.nodeType === ll || e.nodeType === sd));
    }
    function tm(e) {
      return !!(e && (e.nodeType === da || e.nodeType === ll || e.nodeType === sd || e.nodeType === sr && e.nodeValue === " react-mount-point-unstable "));
    }
    function u_(e) {
      e.nodeType === da && e.tagName && e.tagName.toUpperCase() === "BODY" && y("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), yp(e) && (e._reactRootContainer ? y("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : y("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var pk = b.ReactCurrentOwner, c_;
    c_ = function(e) {
      if (e._reactRootContainer && e.nodeType !== sr) {
        var t = $C(e._reactRootContainer.current);
        t && t.parentNode !== e && y("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = xx(e), o = !!(i && As(i));
      o && !a && y("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === da && e.tagName && e.tagName.toUpperCase() === "BODY" && y("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function xx(e) {
      return e ? e.nodeType === ll ? e.documentElement : e.firstChild : null;
    }
    function f_() {
    }
    function mk(e, t, a, i, o) {
      if (o) {
        if (typeof i == "function") {
          var u = i;
          i = function() {
            var L = qv(d);
            u.call(L);
          };
        }
        var d = VC(
          t,
          i,
          e,
          Us,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          f_
        );
        e._reactRootContainer = d, Ph(d.current, e);
        var m = e.nodeType === sr ? e.parentNode : e;
        return lp(m), Jo(), d;
      } else {
        for (var h; h = e.lastChild; )
          e.removeChild(h);
        if (typeof i == "function") {
          var E = i;
          i = function() {
            var L = qv(C);
            E.call(L);
          };
        }
        var C = BC(
          e,
          Us,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          f_
        );
        e._reactRootContainer = C, Ph(C.current, e);
        var M = e.nodeType === sr ? e.parentNode : e;
        return lp(M), Jo(function() {
          em(t, C, a, i);
        }), C;
      }
    }
    function hk(e, t) {
      e !== null && typeof e != "function" && y("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Zv(e, t, a, i, o) {
      c_(a), hk(o === void 0 ? null : o, "render");
      var u = a._reactRootContainer, d;
      if (!u)
        d = mk(a, t, e, o, i);
      else {
        if (d = u, typeof o == "function") {
          var m = o;
          o = function() {
            var h = qv(d);
            m.call(h);
          };
        }
        em(t, d, e, o);
      }
      return qv(d);
    }
    var d_ = !1;
    function vk(e) {
      {
        d_ || (d_ = !0, y("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = pk.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || y("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", qt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === da ? e : ek(e, "findDOMNode");
    }
    function yk(e, t, a) {
      if (y("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !tm(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = yp(t) && t._reactRootContainer === void 0;
        i && y("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Zv(null, e, t, !0, a);
    }
    function gk(e, t, a) {
      if (y("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !tm(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = yp(t) && t._reactRootContainer === void 0;
        i && y("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Zv(null, e, t, !1, a);
    }
    function Sk(e, t, a, i) {
      if (y("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !tm(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !yy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Zv(e, t, a, !1, i);
    }
    var p_ = !1;
    function xk(e) {
      if (p_ || (p_ = !0, y("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !tm(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = yp(e) && e._reactRootContainer === void 0;
        t && y("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = xx(e), i = a && !As(a);
          i && y("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Jo(function() {
          Zv(null, null, e, !1, function() {
            e._reactRootContainer = null, sE(e);
          });
        }), !0;
      } else {
        {
          var o = xx(e), u = !!(o && As(o)), d = e.nodeType === da && tm(e.parentNode) && !!e.parentNode._reactRootContainer;
          u && y("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", d ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Wr(tk), ws(nk), rh(rk), Mu(oi), Id(eh), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && y("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), bc(bw), vy(XS, dj, Jo);
    function Ek(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Jv(t))
        throw new Error("Target container is not a DOM element.");
      return Zj(e, t, null, a);
    }
    function bk(e, t, a, i) {
      return Sk(e, t, a, i);
    }
    var Ex = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [As, wf, Hh, ms, Cc, XS]
    };
    function Ck(e, t) {
      return Ex.usingClientEntryPoint || y('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), ck(e, t);
    }
    function _k(e, t, a) {
      return Ex.usingClientEntryPoint || y('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), dk(e, t, a);
    }
    function wk(e) {
      return xC() && y("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Jo(e);
    }
    var Tk = uk({
      findFiberByHostInstance: Ku,
      bundleType: 1,
      version: mx,
      rendererPackageName: "react-dom"
    });
    if (!Tk && Dn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var m_ = window.location.protocol;
      /^(https?|file):$/.test(m_) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (m_ === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    hi.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ex, hi.createPortal = Ek, hi.createRoot = Ck, hi.findDOMNode = vk, hi.flushSync = wk, hi.hydrate = yk, hi.hydrateRoot = _k, hi.render = gk, hi.unmountComponentAtNode = xk, hi.unstable_batchedUpdates = XS, hi.unstable_renderSubtreeIntoContainer = bk, hi.version = mx, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), hi;
}
function O_() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(O_);
    } catch (x) {
      console.error(x);
    }
  }
}
process.env.NODE_ENV === "production" ? (O_(), Ox.exports = Mk()) : Ox.exports = Uk();
var jl = Ox.exports, Lx, ty = jl;
if (process.env.NODE_ENV === "production")
  Lx = ty.createRoot, ty.hydrateRoot;
else {
  var __ = ty.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  Lx = function(x, S) {
    __.usingClientEntryPoint = !0;
    try {
      return ty.createRoot(x, S);
    } finally {
      __.usingClientEntryPoint = !1;
    }
  };
}
const ay = {
  key: "sr3",
  label: "Shadowrun 3rd Edition",
  isPrimary: !0,
  mockDataLoaded: !0
}, zk = {
  activeEdition: ay,
  setEdition: () => {
  },
  supportedEditions: [ay],
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
}, L_ = k.createContext(zk);
function Fk({ children: x }) {
  const [S, b] = k.useState(ay), [J, Z] = k.useState({}), [N, y] = k.useState(null), W = k.useMemo(
    () => [
      ay,
      {
        key: "sr5",
        label: "Shadowrun 5th Edition",
        isPrimary: !1,
        mockDataLoaded: !0
      }
    ],
    []
  ), U = k.useCallback(
    async (oe) => {
      const ye = oe ?? S.key;
      if (Z((Ae) => {
        var le;
        return {
          ...Ae,
          [ye]: {
            data: (le = Ae[ye]) == null ? void 0 : le.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        Z((Ae) => {
          var le;
          return {
            ...Ae,
            [ye]: {
              data: (le = Ae[ye]) == null ? void 0 : le.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const Ae = await fetch(`/api/editions/${ye}/character-creation`);
        if (!Ae.ok)
          throw new Error(`Failed to load edition data (${Ae.status})`);
        const le = await Ae.json(), ke = (le == null ? void 0 : le.character_creation) ?? le;
        Z((Ee) => ({
          ...Ee,
          [ye]: {
            data: ke,
            loading: !1,
            error: void 0
          }
        }));
      } catch (Ae) {
        const le = Ae instanceof Error ? Ae.message : "Unknown error loading edition data";
        Z((ke) => {
          var Ee;
          return {
            ...ke,
            [ye]: {
              data: (Ee = ke[ye]) == null ? void 0 : Ee.data,
              loading: !1,
              error: le
            }
          };
        });
      }
    },
    [S.key]
  ), j = k.useCallback((oe) => `${new Intl.NumberFormat("en-US").format(oe)}¥`, []), de = k.useCallback((oe) => JSON.parse(JSON.stringify(oe)), []), z = k.useCallback(
    (oe, ye) => {
      var le;
      if (!ye)
        return de(oe);
      const Ae = de(oe);
      if (ye.resources && ((le = Ae.priorities) != null && le.resources)) {
        const ke = Ae.priorities.resources;
        Object.entries(ye.resources).forEach(([Ee, ce]) => {
          const me = Ee;
          typeof ce == "number" && ke[me] && (ke[me] = {
            ...ke[me],
            label: j(ce)
          });
        });
      }
      return Ae;
    },
    [de, j]
  ), Y = k.useCallback(
    async (oe) => {
      var ye, Ae;
      if (oe) {
        y((le) => (le == null ? void 0 : le.campaignId) === oe ? { ...le, loading: !0, error: void 0 } : {
          campaignId: oe,
          edition: S.key,
          data: le == null ? void 0 : le.data,
          gameplayRules: le == null ? void 0 : le.gameplayRules,
          creationMethod: le == null ? void 0 : le.creationMethod,
          loading: !0,
          error: void 0
        });
        try {
          const le = await fetch(`/api/campaigns/${oe}/character-creation`);
          if (!le.ok)
            throw new Error(`Failed to load campaign character creation (${le.status})`);
          const ke = await le.json(), Ee = ((Ae = (ye = ke.edition) == null ? void 0 : ye.toLowerCase) == null ? void 0 : Ae.call(ye)) ?? S.key, ce = ke.edition_data;
          ce && Z((me) => {
            var I;
            return {
              ...me,
              [Ee]: {
                data: ((I = me[Ee]) == null ? void 0 : I.data) ?? ce,
                loading: !1,
                error: void 0
              }
            };
          }), y(() => ({
            campaignId: oe,
            edition: Ee,
            data: ce ? z(ce, ke.gameplay_rules) : void 0,
            gameplayRules: ke.gameplay_rules,
            creationMethod: ke.creation_method ?? void 0,
            loading: !1,
            error: void 0
          }));
        } catch (le) {
          const ke = le instanceof Error ? le.message : "Unknown error loading campaign character creation data";
          throw y({
            campaignId: oe,
            edition: S.key,
            data: void 0,
            gameplayRules: void 0,
            creationMethod: void 0,
            loading: !1,
            error: ke
          }), le;
        }
      }
    },
    [S.key, z]
  ), G = k.useCallback(() => {
    y(null);
  }, []), re = k.useMemo(() => {
    const oe = J[S.key], ye = N && !N.loading && !N.error && N.edition === S.key, Ae = ye && N.data ? N.data : oe == null ? void 0 : oe.data, le = ye ? N == null ? void 0 : N.creationMethod : void 0;
    return {
      activeEdition: S,
      supportedEditions: W,
      setEdition: (ke) => {
        const Ee = W.find((ce) => ce.key === ke);
        Ee ? b(Ee) : console.warn(`Edition '${ke}' is not registered; keeping current edition.`);
      },
      characterCreationData: Ae,
      reloadEditionData: U,
      loadCampaignCharacterCreation: Y,
      clearCampaignCharacterCreation: G,
      isLoading: (oe == null ? void 0 : oe.loading) ?? !1,
      error: oe == null ? void 0 : oe.error,
      campaignId: N == null ? void 0 : N.campaignId,
      campaignCharacterCreation: ye ? N == null ? void 0 : N.data : void 0,
      campaignGameplayRules: ye ? N == null ? void 0 : N.gameplayRules : void 0,
      campaignLoading: (N == null ? void 0 : N.loading) ?? !1,
      campaignError: N == null ? void 0 : N.error,
      campaignCreationMethod: le
    };
  }, [
    S,
    N,
    G,
    J,
    Y,
    U,
    W
  ]);
  return k.useEffect(() => {
    const oe = J[S.key];
    !(oe != null && oe.data) && !(oe != null && oe.loading) && U(S.key);
  }, [S.key, J, U]), k.useEffect(() => {
    typeof window > "u" || (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
      loadCampaignCharacterCreation: Y,
      clearCampaignCharacterCreation: G
    }));
  }, [G, Y]), k.useEffect(() => {
    var le, ke, Ee, ce, me, I;
    const oe = J[S.key], ye = N && !N.loading && !N.error && N.edition === S.key, Ae = ye && N.data ? N.data : oe == null ? void 0 : oe.data;
    Ae && typeof window < "u" && ((ke = (le = window.ShadowmasterLegacyApp) == null ? void 0 : le.setEditionData) == null || ke.call(le, S.key, Ae)), typeof window < "u" && (ye ? (ce = (Ee = window.ShadowmasterLegacyApp) == null ? void 0 : Ee.applyCampaignCreationDefaults) == null || ce.call(Ee, {
      campaignId: N.campaignId,
      edition: N.edition,
      gameplayRules: N.gameplayRules ?? null
    }) : (I = (me = window.ShadowmasterLegacyApp) == null ? void 0 : me.applyCampaignCreationDefaults) == null || I.call(me, null));
  }, [S.key, N, J]), /* @__PURE__ */ c.jsx(L_.Provider, { value: re, children: x });
}
function Pk() {
  const x = k.useContext(L_);
  if (!x)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return x;
}
const A_ = k.createContext(void 0);
function Hk(x) {
  if (typeof document > "u")
    return { node: null, created: !1 };
  let S = document.getElementById(x);
  const b = !S;
  return S || (S = document.createElement("div"), S.id = x, document.body.appendChild(S)), { node: S, created: b };
}
const Bk = 6e3;
function Vk() {
  return typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Ik({ children: x }) {
  const [S, b] = k.useState([]), J = k.useRef(/* @__PURE__ */ new Map()), [Z, N] = k.useState(null);
  k.useEffect(() => {
    const { node: j, created: de } = Hk("shadowmaster-notifications");
    N(j);
    const z = J.current;
    return () => {
      z.forEach((Y) => window.clearTimeout(Y)), z.clear(), de && (j != null && j.parentNode) && j.parentNode.removeChild(j);
    };
  }, []);
  const y = k.useCallback((j) => {
    b((z) => z.filter((Y) => Y.id !== j));
    const de = J.current.get(j);
    de && (window.clearTimeout(de), J.current.delete(j));
  }, []), W = k.useCallback(
    ({ id: j, type: de = "info", title: z, description: Y, durationMs: G = Bk }) => {
      const re = j ?? Vk(), oe = {
        id: re,
        type: de,
        title: z,
        description: Y ?? "",
        durationMs: G,
        createdAt: Date.now()
      };
      if (b((ye) => [...ye, oe]), G > 0) {
        const ye = window.setTimeout(() => {
          y(re);
        }, G);
        J.current.set(re, ye);
      }
      return re;
    },
    [y]
  ), U = k.useMemo(
    () => ({
      pushNotification: W,
      dismissNotification: y
    }),
    [y, W]
  );
  return k.useEffect(() => {
    if (typeof window > "u")
      return;
    const j = (de) => {
      const z = de;
      z.detail && W(z.detail);
    };
    return window.addEventListener("shadowmaster:notify", j), window.ShadowmasterNotify = W, () => {
      window.removeEventListener("shadowmaster:notify", j), window.ShadowmasterNotify === W && delete window.ShadowmasterNotify;
    };
  }, [W]), /* @__PURE__ */ c.jsxs(A_.Provider, { value: U, children: [
    x,
    Z && jl.createPortal(
      /* @__PURE__ */ c.jsx("div", { className: "notification-stack", role: "status", "aria-live": "polite", children: S.map((j) => /* @__PURE__ */ c.jsxs(
        "div",
        {
          className: `notification-toast notification-toast--${j.type}`,
          "data-notification-type": j.type,
          children: [
            /* @__PURE__ */ c.jsxs("div", { className: "notification-toast__content", children: [
              /* @__PURE__ */ c.jsx("strong", { children: j.title }),
              j.description && /* @__PURE__ */ c.jsx("p", { dangerouslySetInnerHTML: { __html: j.description.replace(/\n/g, "<br />") } })
            ] }),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                type: "button",
                className: "notification-toast__close",
                "aria-label": "Dismiss notification",
                onClick: () => y(j.id),
                children: "×"
              }
            )
          ]
        },
        j.id
      )) }),
      Z
    )
  ] });
}
function M_() {
  const x = k.useContext(A_);
  if (!x)
    throw new Error("useNotifications must be used within a NotificationProvider");
  return x;
}
function _x(x, S) {
  return !!(x != null && x.roles.some((b) => b.toLowerCase() === S.toLowerCase()));
}
async function im(x, S = {}) {
  const b = new Headers(S.headers || {});
  S.body && !b.has("Content-Type") && b.set("Content-Type", "application/json");
  const J = await fetch(x, {
    ...S,
    headers: b,
    credentials: "include"
  });
  if (J.status === 204)
    return {};
  const Z = await J.text(), N = () => {
    try {
      return Z ? JSON.parse(Z) : {};
    } catch {
      return {};
    }
  };
  if (!J.ok) {
    const y = N(), W = typeof y.error == "string" && y.error.trim().length > 0 ? y.error : J.statusText;
    throw new Error(W);
  }
  return N();
}
function $k() {
  const [x, S] = k.useState("login"), [b, J] = k.useState(null), [Z, N] = k.useState(!1), [y, W] = k.useState(!1), [U, j] = k.useState(""), [de, z] = k.useState(""), [Y, G] = k.useState(""), [re, oe] = k.useState(""), [ye, Ae] = k.useState(""), [le, ke] = k.useState(""), [Ee, ce] = k.useState(""), [me, I] = k.useState(""), [_e, Ue] = k.useState(""), De = k.useRef(!1), he = k.useRef(null), Be = "auth-menu-dropdown", ee = "auth-menu-heading", { pushNotification: Oe } = M_();
  k.useEffect(() => {
    De.current || (De.current = !0, Ze());
  }, []), k.useEffect(() => {
    window.ShadowmasterAuth = {
      user: b,
      isAdministrator: _x(b, "administrator"),
      isGamemaster: _x(b, "gamemaster"),
      isPlayer: _x(b, "player")
    }, window.dispatchEvent(new CustomEvent("shadowmaster:auth", { detail: window.ShadowmasterAuth }));
  }, [b]), k.useEffect(() => {
    if (!y)
      return;
    const P = (ue) => {
      he.current && (he.current.contains(ue.target) || W(!1));
    }, te = (ue) => {
      ue.key === "Escape" && W(!1);
    };
    return document.addEventListener("mousedown", P), document.addEventListener("keydown", te), () => {
      document.removeEventListener("mousedown", P), document.removeEventListener("keydown", te);
    };
  }, [y]), k.useEffect(() => {
    if (!y || b)
      return;
    const P = x === "register" ? "register-email" : "login-email", te = window.setTimeout(() => {
      const ue = document.getElementById(P);
      ue == null || ue.focus();
    }, 0);
    return () => window.clearTimeout(te);
  }, [y, b, x]);
  async function Ze() {
    try {
      N(!0);
      const P = await im("/api/auth/me");
      J(P.user), S("login"), W(!P.user);
    } catch {
      J(null), W(!0);
    } finally {
      N(!1);
    }
  }
  async function lt(P) {
    P.preventDefault(), N(!0);
    try {
      const te = await im("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: U,
          password: de
        })
      });
      J(te.user), S("login"), z(""), W(!1), Oe({
        type: "success",
        title: "Signed in",
        description: te.user ? `Welcome back, ${te.user.username || te.user.email}!` : "Signed in successfully."
      });
    } catch (te) {
      const ue = te instanceof Error ? te.message : "Login failed";
      Oe({
        type: "error",
        title: "Login failed",
        description: ue
      });
    } finally {
      N(!1);
    }
  }
  async function je(P) {
    if (P.preventDefault(), ye !== le) {
      Oe({
        type: "warning",
        title: "Passwords do not match",
        description: "Please confirm your password before continuing."
      });
      return;
    }
    N(!0);
    try {
      const te = await im("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: Y,
          username: re,
          password: ye
        })
      });
      J(te.user), S("login"), Ae(""), ke(""), Oe({
        type: "success",
        title: "Account created",
        description: "You can now sign in with your new credentials."
      });
    } catch (te) {
      const ue = te instanceof Error ? te.message : "Registration failed";
      Oe({
        type: "error",
        title: "Registration failed",
        description: ue
      });
    } finally {
      N(!1);
    }
  }
  async function Se() {
    N(!0);
    try {
      await im("/api/auth/logout", { method: "POST" }), J(null), S("login"), W(!0), Oe({
        type: "success",
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (P) {
      const te = P instanceof Error ? P.message : "Logout failed";
      Oe({
        type: "error",
        title: "Logout failed",
        description: te
      });
    } finally {
      N(!1);
    }
  }
  async function Ie(P) {
    if (P.preventDefault(), me !== _e) {
      Oe({
        type: "warning",
        title: "New passwords do not match",
        description: "Make sure both password fields match before updating."
      });
      return;
    }
    N(!0);
    try {
      await im("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({
          current_password: Ee,
          new_password: me
        })
      }), ce(""), I(""), Ue(""), S("login"), Oe({
        type: "success",
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
    } catch (te) {
      const ue = te instanceof Error ? te.message : "Password update failed";
      Oe({
        type: "error",
        title: "Password update failed",
        description: ue
      });
    } finally {
      N(!1);
    }
  }
  const Re = k.useMemo(() => b ? b.roles.join(", ") : "", [b]), O = b ? `Signed in as ${b.email}.` : "Sign in to manage campaigns, sessions, and characters.";
  return /* @__PURE__ */ c.jsxs("section", { className: `auth-panel${y ? " auth-panel--open" : ""}`, ref: he, children: [
    /* @__PURE__ */ c.jsxs(
      "button",
      {
        type: "button",
        className: "auth-panel__toggle",
        "aria-haspopup": "dialog",
        "aria-expanded": y,
        "aria-controls": Be,
        onClick: () => W((P) => !P),
        children: [
          /* @__PURE__ */ c.jsxs("span", { className: "auth-panel__hamburger", "aria-hidden": "true", children: [
            /* @__PURE__ */ c.jsx("span", {}),
            /* @__PURE__ */ c.jsx("span", {}),
            /* @__PURE__ */ c.jsx("span", {})
          ] }),
          /* @__PURE__ */ c.jsx("span", { className: "auth-panel__label", children: b ? b.username : "Sign In" }),
          b && /* @__PURE__ */ c.jsx("span", { className: "auth-panel__tag", children: Re || "Player" })
        ]
      }
    ),
    /* @__PURE__ */ c.jsxs(
      "div",
      {
        id: Be,
        className: "auth-panel__dropdown",
        role: "dialog",
        "aria-modal": "false",
        "aria-hidden": !y,
        "aria-labelledby": ee,
        children: [
          /* @__PURE__ */ c.jsxs("header", { className: "auth-panel__header", children: [
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("h2", { id: ee, children: b ? `Welcome, ${b.username}` : "Account Access" }),
              /* @__PURE__ */ c.jsx("p", { className: "auth-panel__status", children: O })
            ] }),
            b && /* @__PURE__ */ c.jsx("div", { className: "auth-panel__roles", children: /* @__PURE__ */ c.jsx("span", { className: "auth-tag", children: Re || "Player" }) })
          ] }),
          b ? /* @__PURE__ */ c.jsxs("div", { className: "auth-panel__content", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "auth-panel__actions", children: [
              /* @__PURE__ */ c.jsx(
                "button",
                {
                  type: "button",
                  className: "btn btn-secondary",
                  onClick: () => {
                    S(x === "password" ? "login" : "password");
                  },
                  disabled: Z,
                  children: x === "password" ? "Hide Password Form" : "Change Password"
                }
              ),
              /* @__PURE__ */ c.jsx("button", { className: "btn btn-primary", type: "button", onClick: Se, disabled: Z, children: "Logout" })
            ] }),
            x === "password" && /* @__PURE__ */ c.jsxs("form", { className: "auth-form", onSubmit: Ie, children: [
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "current-password", children: "Current Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "current-password",
                    type: "password",
                    value: Ee,
                    onChange: (P) => ce(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "new-password", children: "New Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "new-password",
                    type: "password",
                    value: me,
                    onChange: (P) => I(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "confirm-password", children: "Confirm New Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "confirm-password",
                    type: "password",
                    value: _e,
                    onChange: (P) => Ue(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsx("button", { className: "btn btn-primary", type: "submit", disabled: Z, children: "Update Password" })
            ] }),
            /* @__PURE__ */ c.jsx("div", { className: "auth-panel__menu-links", children: /* @__PURE__ */ c.jsxs("span", { className: "auth-panel__menu-link auth-panel__menu-link--disabled", children: [
              "Settings ",
              /* @__PURE__ */ c.jsx("small", { children: "Coming soon" })
            ] }) })
          ] }) : /* @__PURE__ */ c.jsxs("div", { className: "auth-panel__content", children: [
            x === "login" && /* @__PURE__ */ c.jsxs("form", { className: "auth-form", onSubmit: lt, children: [
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "login-email", children: "Email" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "login-email",
                    type: "email",
                    value: U,
                    onChange: (P) => j(P.target.value),
                    required: !0,
                    autoComplete: "email"
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "login-password", children: "Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "login-password",
                    type: "password",
                    value: de,
                    onChange: (P) => z(P.target.value),
                    required: !0,
                    autoComplete: "current-password"
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "auth-form__footer", children: [
                /* @__PURE__ */ c.jsx("button", { className: "btn btn-primary", type: "submit", disabled: Z, children: "Sign In" }),
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    className: "btn btn-link",
                    type: "button",
                    onClick: () => {
                      S("register");
                    },
                    children: "Need an account?"
                  }
                )
              ] })
            ] }),
            x === "register" && /* @__PURE__ */ c.jsxs("form", { className: "auth-form", onSubmit: je, children: [
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "register-email", children: "Email" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "register-email",
                    type: "email",
                    value: Y,
                    onChange: (P) => G(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "register-username", children: "Username" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "register-username",
                    value: re,
                    onChange: (P) => oe(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "register-password", children: "Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "register-password",
                    type: "password",
                    value: ye,
                    onChange: (P) => Ae(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ c.jsx("label", { htmlFor: "register-confirm", children: "Confirm Password" }),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    id: "register-confirm",
                    type: "password",
                    value: le,
                    onChange: (P) => ke(P.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "auth-form__footer", children: [
                /* @__PURE__ */ c.jsx("button", { className: "btn btn-primary", type: "submit", disabled: Z, children: "Create Account" }),
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    className: "btn btn-link",
                    type: "button",
                    onClick: () => {
                      S("login");
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
function Yk() {
  var S, b;
  if (typeof window.showCreateCharacterModal == "function") {
    window.showCreateCharacterModal();
    return;
  }
  (b = (S = window.ShadowmasterLegacyApp) == null ? void 0 : S.showWizardStep) == null || b.call(S, 1);
  const x = document.getElementById("character-modal");
  x && (x.style.display = "block");
}
function Wk() {
  const [x, S] = k.useState(null);
  return k.useEffect(() => {
    S(document.getElementById("characters-actions"));
  }, []), x ? jl.createPortal(
    /* @__PURE__ */ c.jsxs("div", { className: "characters-callout", children: [
      /* @__PURE__ */ c.jsxs("div", { className: "characters-callout__copy", children: [
        /* @__PURE__ */ c.jsx("h2", { children: "Characters" }),
        /* @__PURE__ */ c.jsx("p", { children: "Build new runners, review existing sheets, and keep your roster ready for the next mission." })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "characters-callout__actions", children: /* @__PURE__ */ c.jsx(
        "button",
        {
          id: "create-character-btn",
          type: "button",
          className: "btn btn-primary",
          onClick: Yk,
          children: "Create Character"
        }
      ) })
    ] }),
    x
  ) : null;
}
function Xf() {
  return Pk();
}
const wx = [
  { label: "Priority (default)", value: "priority" },
  { label: "Sum-to-Ten (coming soon)", value: "sum_to_ten" },
  { label: "Karma (coming soon)", value: "karma" }
], Tx = ["Basics", "Roster", "World", "Automation", "Session Seed", "Review"], Qk = [
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
];
function qs(x) {
  return typeof crypto < "u" && crypto.randomUUID ? `${x}-${crypto.randomUUID()}` : `${x}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function lm(x) {
  return x.toLowerCase() === "sr5" ? "SR5" : x.toUpperCase();
}
function w_(x) {
  return x === "SR5" ? "Shadowrun 5th Edition" : x;
}
const T_ = {
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
function Gk(x, S) {
  switch (S.type) {
    case "RESET":
      return S.payload;
    case "UPDATE_FIELD":
      return {
        ...x,
        [S.field]: S.value
      };
    case "UPDATE_PLACEHOLDER":
      return {
        ...x,
        placeholders: x.placeholders.map(
          (b) => b.id === S.id ? { ...b, [S.field]: S.value } : b
        )
      };
    case "ADD_PLACEHOLDER":
      return {
        ...x,
        placeholders: [
          ...x.placeholders,
          {
            id: qs("placeholder"),
            name: "Runner Placeholder",
            role: "Unassigned"
          }
        ]
      };
    case "ADD_PLACEHOLDER_WITH_ID":
      return {
        ...x,
        placeholders: [
          ...x.placeholders,
          {
            id: S.id,
            name: S.name,
            role: S.role
          }
        ]
      };
    case "REMOVE_PLACEHOLDER":
      return {
        ...x,
        placeholders: x.placeholders.filter((b) => b.id !== S.id)
      };
    case "UPDATE_FACTION":
      return {
        ...x,
        factions: x.factions.map(
          (b) => b.id === S.id ? { ...b, [S.field]: S.value } : b
        )
      };
    case "ADD_FACTION":
      return {
        ...x,
        factions: [
          ...x.factions,
          {
            id: qs("faction"),
            name: "",
            tags: "",
            notes: ""
          }
        ]
      };
    case "ADD_FACTION_WITH_ID":
      return {
        ...x,
        factions: [
          ...x.factions,
          {
            id: S.id,
            name: "",
            tags: "",
            notes: ""
          }
        ]
      };
    case "REMOVE_FACTION":
      return {
        ...x,
        factions: x.factions.filter((b) => b.id !== S.id)
      };
    case "UPDATE_LOCATION":
      return {
        ...x,
        locations: x.locations.map(
          (b) => b.id === S.id ? { ...b, [S.field]: S.value } : b
        )
      };
    case "ADD_LOCATION":
      return {
        ...x,
        locations: [
          ...x.locations,
          {
            id: qs("location"),
            name: "",
            descriptor: ""
          }
        ]
      };
    case "ADD_LOCATION_WITH_ID":
      return {
        ...x,
        locations: [
          ...x.locations,
          {
            id: S.id,
            name: "",
            descriptor: ""
          }
        ]
      };
    case "REMOVE_LOCATION":
      return {
        ...x,
        locations: x.locations.filter((b) => b.id !== S.id)
      };
    case "UPDATE_HOUSE_RULE":
      return {
        ...x,
        houseRules: {
          ...x.houseRules,
          [S.key]: S.value
        }
      };
    case "UPDATE_SESSION_SEED":
      return {
        ...x,
        sessionSeed: {
          ...x.sessionSeed,
          [S.field]: S.value
        }
      };
    default:
      return x;
  }
}
function Kk({ targetId: x = "campaign-creation-react-root", onCreated: S }) {
  var ji;
  const {
    activeEdition: b,
    supportedEditions: J,
    characterCreationData: Z,
    campaignCharacterCreation: N,
    reloadEditionData: y,
    setEdition: W
  } = Xf(), U = k.useMemo(() => {
    const fe = J.find((w) => w.key === "sr5");
    return fe ? fe.key : b.key;
  }, [b.key, J]), [j, de] = k.useState(null), [z, Y] = k.useState(U), [G, re] = k.useState(Z), [oe, ye] = k.useState([]), [Ae, le] = k.useState([]), [ke, Ee] = k.useState(""), [ce, me] = k.useState("experienced"), [I, _e] = k.useState("priority"), [Ue, De] = k.useState([]), [he, Be] = k.useState({}), [ee, Oe] = k.useState(wx), [Ze, lt] = k.useState(!1), [je, Se] = k.useState(!1), [Ie, Re] = k.useState(null), [O, P] = k.useState(0), [te, ue] = k.useReducer(Gk, T_), [bt, Tt] = k.useState([]), [yt, mt] = k.useState(() => [lm(U)]), [gt, $t] = k.useState(!1), [Dn, qn] = k.useState(!1), [xn, En] = k.useState(null), { pushNotification: On } = M_(), [Ct, Tn] = k.useState({}), [Ln, Qn] = k.useState({}), [An, bn] = k.useState(!1), [Rn, V] = k.useState(!1), [$e, St] = k.useState(!1), [ht, Ir] = k.useState(!1), ua = k.useRef(null), ja = k.useRef(null), Le = k.useRef(null), et = k.useRef(null), Dt = k.useRef(null), Kt = k.useRef(null), pn = k.useRef(null), Mn = Tx.length, Ut = k.useMemo(() => lm(z), [z]), Xn = k.useMemo(() => {
    const fe = /* @__PURE__ */ new Map();
    return bt.forEach((w) => {
      fe.set(w.code.toUpperCase(), w.name);
    }), fe;
  }, [bt]), fn = k.useMemo(
    () => yt.map((fe) => Xn.get(fe) ?? fe),
    [Xn, yt]
  );
  k.useEffect(() => {
    de(document.getElementById(x));
  }, [x]), k.useEffect(() => {
    Y(U);
  }, [U]), k.useEffect(() => {
    b.key !== U && W(U);
  }, [b.key, U, W]), k.useEffect(() => {
    let fe = !1;
    async function w() {
      qn(!0), En(null);
      try {
        const ve = await fetch(`/api/editions/${z}/books`);
        if (!ve.ok)
          throw new Error(`Failed to load books (${ve.status})`);
        const ct = await ve.json(), Ft = Array.isArray(ct == null ? void 0 : ct.books) ? ct.books : [];
        if (fe)
          return;
        const Lt = Ft.map((dn) => ({
          ...dn,
          code: (dn.code || "").toUpperCase()
        })).filter((dn) => dn.code), lr = Lt.some((dn) => dn.code === Ut) ? Lt : [
          ...Lt,
          {
            id: Ut.toLowerCase(),
            name: w_(Ut),
            code: Ut
          }
        ];
        lr.sort((dn, or) => dn.code.localeCompare(or.code)), Tt(lr), mt((dn) => {
          const or = new Set(dn.map((Bn) => Bn.toUpperCase()));
          or.add(Ut);
          const sn = new Set(lr.map((Bn) => Bn.code));
          return Array.from(or).filter((Bn) => sn.has(Bn)).sort();
        });
      } catch (ve) {
        if (console.error("Failed to load source books", ve), fe)
          return;
        En("Unable to load source books. Default core book applied.");
        const ct = [
          { id: Ut.toLowerCase(), name: w_(Ut), code: Ut }
        ];
        Tt(ct), mt([Ut]);
      } finally {
        fe || qn(!1);
      }
    }
    return w(), () => {
      fe = !0;
    };
  }, [Ut, z]), k.useEffect(() => {
    async function fe(w) {
      var ve;
      try {
        const ct = await fetch(`/api/editions/${w}/character-creation`);
        if (!ct.ok)
          throw new Error(`Failed to load edition data (${ct.status})`);
        const Ft = await ct.json(), Lt = (Ft == null ? void 0 : Ft.character_creation) ?? Ft;
        re(Lt), Be(Lt.creation_methods ?? {});
        const _n = Object.entries(Lt.gameplay_levels ?? {}).map(([lr, { label: dn }]) => ({
          value: lr,
          label: dn || lr
        }));
        ye(_n), _n.some((lr) => lr.value === ce) || me(((ve = _n[0]) == null ? void 0 : ve.value) ?? "experienced");
      } catch (ct) {
        console.error("Failed to load edition data", ct);
      }
    }
    fe(z);
  }, [z, ce]), k.useEffect(() => {
    async function fe() {
      try {
        const w = await fetch("/api/users?role=gamemaster,administrator");
        if (!w.ok)
          throw new Error(`Failed to load users (${w.status})`);
        const ve = await w.json();
        if (!Array.isArray(ve) || ve.length === 0) {
          De([]);
          return;
        }
        De(ve), ve.length > 0 && Ee((ct) => ct || ve[0].id);
      } catch (w) {
        console.error("Failed to load users", w), De([]);
      }
    }
    fe();
  }, []), k.useEffect(() => {
    async function fe() {
      try {
        const w = await fetch("/api/characters");
        if (!w.ok)
          throw new Error(`Failed to load characters (${w.status})`);
        const ve = await w.json();
        if (!Array.isArray(ve)) {
          le([]);
          return;
        }
        le(ve);
      } catch (w) {
        console.error("Failed to load characters", w), le([]);
      }
    }
    fe();
  }, []), k.useEffect(() => {
    !G && Z && (re(Z), Be(Z.creation_methods ?? {}));
  }, [Z, G]), k.useEffect(() => {
    if (!G && Object.keys(he).length === 0) {
      Oe(wx);
      return;
    }
    if (!he || Object.keys(he).length === 0) {
      Oe(wx);
      return;
    }
    const fe = Object.entries(he).map(([w, ve]) => ({
      value: w,
      label: ve.label || w
    })).sort((w, ve) => w.value === "priority" ? -1 : ve.value === "priority" ? 1 : w.label.localeCompare(ve.label));
    Oe(fe);
  }, [he, G]), k.useEffect(() => {
    if (ee.length !== 0 && !ee.some((fe) => fe.value === I)) {
      const fe = ee.find((w) => w.value === "priority");
      _e((fe == null ? void 0 : fe.value) ?? ee[0].value);
      return;
    }
  }, [ee, I]);
  const on = k.useMemo(() => J.map((fe) => ({
    label: fe.label,
    value: fe.key
  })), [J]), ln = k.useMemo(() => Ue.length === 0 ? [{ label: "No gamemasters found", value: "" }] : Ue.map((fe) => ({
    label: `${fe.username} (${fe.email})`,
    value: fe.id
  })), [Ue]), jn = k.useMemo(() => (N == null ? void 0 : N.campaign_support) ?? (Z == null ? void 0 : Z.campaign_support), [N == null ? void 0 : N.campaign_support, Z == null ? void 0 : Z.campaign_support]), Jn = (jn == null ? void 0 : jn.factions) ?? [], jr = (jn == null ? void 0 : jn.locations) ?? [], ca = (jn == null ? void 0 : jn.placeholders) ?? [], Qa = (jn == null ? void 0 : jn.session_seeds) ?? [], [Ga, Ri] = k.useState(""), [ka, Zi] = k.useState(""), [ir, kr] = k.useState(""), [Gn, Ka] = k.useState(""), fa = k.useMemo(() => {
    if (!Ga.trim())
      return Jn;
    const fe = Ga.toLowerCase();
    return Jn.filter((w) => w.name.toLowerCase().includes(fe) || (w.tags ?? "").toLowerCase().includes(fe) || (w.notes ?? "").toLowerCase().includes(fe));
  }, [Ga, Jn]), Na = k.useMemo(() => {
    if (!ka.trim())
      return jr;
    const fe = ka.toLowerCase();
    return jr.filter((w) => w.name.toLowerCase().includes(fe) || (w.descriptor ?? "").toLowerCase().includes(fe));
  }, [ka, jr]), Da = k.useMemo(() => {
    if (!ir.trim())
      return ca;
    const fe = ir.toLowerCase();
    return ca.filter((w) => w.name.toLowerCase().includes(fe) || (w.role ?? "").toLowerCase().includes(fe));
  }, [ir, ca]), R = k.useMemo(() => {
    if (!Gn.trim())
      return Qa;
    const fe = Gn.toLowerCase();
    return Qa.filter((w) => w.title.toLowerCase().includes(fe) || (w.objectives ?? "").toLowerCase().includes(fe) || (w.scene_template ?? "").toLowerCase().includes(fe) || (w.summary ?? "").toLowerCase().includes(fe));
  }, [Gn, Qa]), pe = k.useCallback(
    (fe) => {
      var ve, ct;
      const w = fe ?? lm(z);
      ue({ type: "RESET", payload: { ...T_ } }), me("experienced"), _e(((ve = ee[0]) == null ? void 0 : ve.value) ?? "priority"), Ee(((ct = Ue[0]) == null ? void 0 : ct.id) ?? ""), Re(null), Tn({}), Qn({}), P(0), mt([w]), $t(!1), En(null);
    },
    [ee, z, Ue]
  );
  function ze() {
    const fe = lm(b.key);
    Y(b.key), pe(fe), lt(!0);
  }
  function Qe() {
    pe(), lt(!1);
  }
  function pt(fe) {
    const w = {};
    let ve;
    return fe === 0 && (te.name.trim() || (w.name = "Campaign name is required.", ve = "Provide a campaign name before continuing."), Ue.length > 0 && !ke && (w.gm = "Assign a gamemaster.", ve = ve ?? "Assign a gamemaster before continuing.")), fe === 1 && te.selectedPlayers.length === 0 && te.placeholders.length === 0 && (w.roster = "Select at least one existing character or create a placeholder runner.", ve = "Attach at least one runner before continuing."), fe === 2 && te.factions.length === 0 && te.locations.length === 0 && (w.backbone = "Add at least one faction or location, or use the quick-add template.", ve = "Capture at least one faction or location before continuing."), fe === 4 && !te.sessionSeed.skip && !te.sessionSeed.title.trim() && (w.sessionSeed = "Provide a title for the initial session or choose to skip.", ve = "Name your first session or choose to skip."), Object.keys(w).length > 0 ? (Mt(fe, w, ve), !1) : (Re(null), Tn({}), Un(fe), !0);
  }
  const _t = () => {
    var w;
    if (!pt(O))
      return;
    const fe = Math.min(O + 1, Tx.length - 1);
    Tn({}), P(fe), (w = Ln[fe]) != null && w.length ? pt(fe) : Object.values(Ln).some((ve) => ve == null ? void 0 : ve.length) || Re(null);
  }, Rt = (fe) => {
    !(fe != null && fe.current) || !(fe.current instanceof HTMLElement) || (fe.current.focus({ preventScroll: !0 }), fe.current.scrollIntoView({ behavior: "smooth", block: "center" }));
  }, Mt = (fe, w, ve) => {
    const ct = Object.keys(w), Ft = ct[0], Lt = ve != null ? [
      ve,
      ...ct.filter((_n) => _n !== Ft).map((_n) => w[_n]).filter((_n) => _n && _n !== ve)
    ] : ct.map((_n) => w[_n]);
    if (Re(Lt[0] ?? null), Tn(w), Qn((_n) => ({
      ..._n,
      [fe]: Lt.length > 0 ? Lt : ["Please resolve the highlighted fields."]
    })), Ft)
      switch (Ft) {
        case "name":
          Rt(ua);
          break;
        case "theme":
          Rt(ja);
          break;
        case "gm":
          Rt(Le);
          break;
        case "overview":
          Rt(et);
          break;
        case "roster":
          Rt(Dt);
          break;
        case "backbone":
          Rt(Kt);
          break;
        case "sessionSeed":
          Rt(pn);
          break;
      }
  }, Un = (fe) => {
    Qn((w) => {
      if (!(fe in w))
        return w;
      const { [fe]: ve, ...ct } = w;
      return Object.keys(ct).length === 0 && Re(null), ct;
    });
  }, Bt = (fe, w = O) => {
    Tn((ve) => {
      if (!(fe in ve))
        return ve;
      const ct = { ...ve };
      return delete ct[fe], Object.keys(ct).length === 0 && (w === O && Re(null), Un(w)), ct;
    });
  }, Cn = k.useCallback(() => {
    const fe = qs("faction");
    ue({ type: "ADD_FACTION_WITH_ID", id: fe }), ue({ type: "UPDATE_FACTION", id: fe, field: "name", value: "Ares Macrotechnology" }), ue({ type: "UPDATE_FACTION", id: fe, field: "tags", value: "Corporate, AAA" }), ue({
      type: "UPDATE_FACTION",
      id: fe,
      field: "notes",
      value: "Megacorp interested in experimental weapons testing."
    }), Bt("backbone", 2);
  }, [Bt]), yr = k.useCallback(() => {
    const fe = qs("location");
    ue({ type: "ADD_LOCATION_WITH_ID", id: fe }), ue({ type: "UPDATE_LOCATION", id: fe, field: "name", value: "Downtown Seattle Safehouse" }), ue({
      type: "UPDATE_LOCATION",
      id: fe,
      field: "descriptor",
      value: "Secure condo with rating 4 security and friendly neighbors."
    }), Bt("backbone", 2);
  }, [Bt]), Oa = () => {
    var w;
    const fe = Math.max(O - 1, 0);
    Tn({}), P(fe), (w = Ln[fe]) != null && w.length ? pt(fe) : Object.values(Ln).some((ve) => ve == null ? void 0 : ve.length) || Re(null);
  };
  async function La(fe) {
    var ve, ct;
    if (fe.preventDefault(), !pt(O))
      return;
    const w = Object.entries(Ln).find(
      ([Ft, Lt]) => Number(Ft) !== O && (Lt == null ? void 0 : Lt.length)
    );
    if (w) {
      const Ft = Number(w[0]);
      Tn({}), P(Ft), pt(Ft);
      return;
    }
    Se(!0), Re(null), Tn({}), Un(O);
    try {
      const Ft = Ue.find((sn) => sn.id === ke), Lt = te.name.trim() || "Campaign", _n = {
        automation: te.houseRules,
        notes: te.houseRuleNotes,
        theme: te.theme,
        factions: te.factions,
        locations: te.locations,
        placeholders: te.placeholders,
        session_seed: te.sessionSeed
      }, lr = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: te.name.trim(),
          description: te.description,
          gm_user_id: ke,
          gm_name: (Ft == null ? void 0 : Ft.username) ?? (Ft == null ? void 0 : Ft.email) ?? "",
          edition: z,
          gameplay_level: ce,
          creation_method: I,
          enabled_books: yt,
          house_rules: JSON.stringify(_n),
          status: "Active"
        })
      });
      if (!lr.ok) {
        const sn = await lr.text();
        throw new Error(sn || `Failed to create campaign (${lr.status})`);
      }
      const dn = await lr.json(), or = [];
      if (te.placeholders.length > 0)
        try {
          await Promise.all(
            te.placeholders.map(async (sn) => {
              const Bn = await fetch("/api/characters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: sn.name,
                  player_name: sn.role,
                  status: "Placeholder",
                  edition: z,
                  edition_data: {},
                  is_npc: !0,
                  campaign_id: dn.id
                })
              });
              if (!Bn.ok) {
                const Ma = await Bn.text();
                throw new Error(Ma || `Failed to create placeholder (${Bn.status})`);
              }
            })
          );
        } catch (sn) {
          console.error("Failed to create placeholder characters", sn), or.push("Placeholder runners were not saved.");
        }
      if (!te.sessionSeed.skip)
        try {
          const sn = await fetch("/api/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              campaign_id: dn.id,
              name: te.sessionSeed.title || "Session 0",
              description: te.sessionSeed.objectives,
              notes: te.sessionSeed.summary,
              session_date: (/* @__PURE__ */ new Date()).toISOString(),
              status: "Planned"
            })
          });
          if (!sn.ok) {
            const Bn = await sn.text();
            throw new Error(Bn || `Failed to create session seed (${sn.status})`);
          }
        } catch (sn) {
          console.error("Failed to create session seed", sn), or.push("Session seed could not be created automatically.");
        }
      pe(), (ct = (ve = window.ShadowmasterLegacyApp) == null ? void 0 : ve.loadCampaigns) == null || ct.call(ve), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), S == null || S(dn), lt(!1), On({
        type: "success",
        title: `${Lt} created`,
        description: "Campaign is ready for onboarding."
      }), or.length > 0 && On({
        type: "warning",
        title: "Campaign created with warnings",
        description: or.join(`
`)
      });
    } catch (Ft) {
      const Lt = Ft instanceof Error ? Ft.message : "Failed to create campaign.";
      Re(Lt), On({
        type: "error",
        title: "Campaign creation failed",
        description: Lt
      });
    } finally {
      Se(!1);
    }
  }
  const xt = he[I], Ot = () => {
    var fe;
    switch (O) {
      case 0:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Campaign Essentials" }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-name", children: "Campaign Name" }),
              /* @__PURE__ */ c.jsx(
                "input",
                {
                  id: "campaign-name",
                  name: "campaign-name",
                  value: te.name,
                  onChange: (w) => {
                    ue({ type: "UPDATE_FIELD", field: "name", value: w.target.value }), Bt("name");
                  },
                  autoFocus: !0,
                  maxLength: 80,
                  required: !0,
                  placeholder: "e.g., Emerald City Heist",
                  ref: ua,
                  className: Ct.name ? "input--invalid" : void 0,
                  "aria-invalid": Ct.name ? "true" : "false",
                  "aria-describedby": Ct.name ? "campaign-name-error" : void 0
                }
              ),
              /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "This title appears in dashboards, notifications, and session summaries." }),
              Ct.name && /* @__PURE__ */ c.jsx("p", { id: "campaign-name-error", className: "form-error", role: "alert", children: Ct.name })
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-theme", children: "Theme / Tagline" }),
              /* @__PURE__ */ c.jsx(
                "input",
                {
                  id: "campaign-theme",
                  name: "campaign-theme",
                  value: te.theme,
                  onChange: (w) => ue({ type: "UPDATE_FIELD", field: "theme", value: w.target.value }),
                  placeholder: "e.g., Neo-Tokyo corporate intrigue",
                  ref: ja
                }
              ),
              /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "A short hook that sets tone for players and appears alongside the title." })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-edition", children: "Edition" }),
              /* @__PURE__ */ c.jsx(
                "select",
                {
                  id: "campaign-edition",
                  name: "campaign-edition",
                  value: z,
                  onChange: (w) => {
                    const ve = w.target.value;
                    Y(ve), W(ve), mt([lm(ve)]), $t(!1), En(null), y(ve);
                  },
                  children: on.map((w) => /* @__PURE__ */ c.jsx("option", { value: w.value, children: w.label }, w.value))
                }
              )
            ] }),
            oe.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-gameplay-level", children: "Gameplay Level" }),
              /* @__PURE__ */ c.jsx(
                "select",
                {
                  id: "campaign-gameplay-level",
                  name: "campaign-gameplay-level",
                  value: ce,
                  onChange: (w) => me(w.target.value),
                  children: oe.map((w) => /* @__PURE__ */ c.jsx("option", { value: w.value, children: w.label }, w.value))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-creation-method", children: "Character Creation Method" }),
            /* @__PURE__ */ c.jsx(
              "select",
              {
                id: "campaign-creation-method",
                name: "campaign-creation-method",
                value: I,
                onChange: (w) => _e(w.target.value),
                children: ee.map((w) => /* @__PURE__ */ c.jsx("option", { value: w.value, children: w.label }, w.value))
              }
            ),
            /* @__PURE__ */ c.jsxs("div", { className: "form-help", children: [
              (xt == null ? void 0 : xt.description) && /* @__PURE__ */ c.jsx("p", { children: xt.description }),
              I !== "priority" && /* @__PURE__ */ c.jsx("p", { children: "Support for Sum-to-Ten and Karma methods is still under development. Characters will temporarily default to Priority until the new workflows are implemented." })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "collapsible", children: [
            /* @__PURE__ */ c.jsxs(
              "button",
              {
                type: "button",
                className: "collapsible__trigger",
                "aria-expanded": gt,
                onClick: () => $t((w) => !w),
                children: [
                  /* @__PURE__ */ c.jsx("span", { children: "Source Books" }),
                  /* @__PURE__ */ c.jsx("span", { className: "collapsible__chevron", "aria-hidden": "true", children: gt ? "▾" : "▸" })
                ]
              }
            ),
            /* @__PURE__ */ c.jsxs(
              "div",
              {
                className: `collapsible__content ${gt ? "collapsible__content--open" : ""}`,
                "aria-live": "polite",
                children: [
                  /* @__PURE__ */ c.jsxs("p", { className: "form-help", children: [
                    "Enable the references that should be legal at your table. ",
                    Ut,
                    " is always required and stays selected."
                  ] }),
                  xn && /* @__PURE__ */ c.jsx("p", { className: "form-warning", children: xn }),
                  Dn ? /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "Loading books…" }) : /* @__PURE__ */ c.jsx("div", { className: "book-checkboxes", children: bt.map((w) => {
                    const ve = w.code.toUpperCase(), ct = yt.includes(ve), Ft = ve === Ut;
                    return /* @__PURE__ */ c.jsxs("label", { className: `book-checkbox ${Ft ? "book-checkbox--locked" : ""}`, children: [
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: ct,
                          disabled: Ft,
                          onChange: (Lt) => {
                            const _n = Lt.target.checked;
                            mt((lr) => {
                              const dn = new Set(lr.map((or) => or.toUpperCase()));
                              return _n ? dn.add(ve) : dn.delete(ve), dn.has(Ut) || dn.add(Ut), Array.from(dn).sort();
                            });
                          }
                        }
                      ),
                      /* @__PURE__ */ c.jsxs("span", { className: "book-option", children: [
                        w.name,
                        " ",
                        /* @__PURE__ */ c.jsxs("span", { className: "book-code", children: [
                          "(",
                          ve,
                          ")"
                        ] }),
                        Ft && /* @__PURE__ */ c.jsx("span", { className: "book-required", children: "(required)" })
                      ] })
                    ] }, ve);
                  }) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-gm", children: "Gamemaster" }),
            /* @__PURE__ */ c.jsx(
              "select",
              {
                id: "campaign-gm",
                name: "campaign-gm",
                value: ke,
                onChange: (w) => {
                  Ee(w.target.value), Bt("gm");
                },
                ref: Le,
                className: Ct.gm ? "input--invalid" : void 0,
                "aria-invalid": Ct.gm ? "true" : "false",
                "aria-describedby": Ct.gm ? "campaign-gm-error" : void 0,
                children: ln.map((w) => /* @__PURE__ */ c.jsx("option", { value: w.value, children: w.label }, w.value))
              }
            ),
            Ct.gm && /* @__PURE__ */ c.jsx("p", { id: "campaign-gm-error", className: "form-error", role: "alert", children: Ct.gm })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-description", children: "Campaign Overview" }),
            /* @__PURE__ */ c.jsx(
              "textarea",
              {
                id: "campaign-description",
                name: "campaign-description",
                value: te.description,
                onChange: (w) => {
                  ue({ type: "UPDATE_FIELD", field: "description", value: w.target.value }), Bt("overview");
                },
                placeholder: "Outline the premise, tone, and first planned arc. Include touchstones players can latch onto.",
                rows: 6,
                ref: et,
                className: `campaign-form__textarea ${Ct.overview ? "input--invalid" : ""}`.trim(),
                "aria-invalid": Ct.overview ? "true" : "false",
                "aria-describedby": Ct.overview ? "campaign-description-error" : void 0
              }
            ),
            /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "Use this space for the elevator pitch—players will see it at a glance when they open the campaign." }),
            Ct.overview && /* @__PURE__ */ c.jsx("p", { id: "campaign-description-error", className: "form-error", role: "alert", children: Ct.overview })
          ] })
        ] });
      case 1:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Roster & Roles" }),
          /* @__PURE__ */ c.jsx("p", { children: "Attach existing player characters or create placeholders to represent expected runners." }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-players", children: "Existing Characters" }),
            Ae.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "No characters found yet. You can create placeholders below." }) : /* @__PURE__ */ c.jsx("div", { className: "character-checkboxes", ref: Dt, tabIndex: -1, children: Ae.map((w) => {
              const ve = w.player_name ? `${w.name} — ${w.player_name}` : w.name, ct = te.selectedPlayers.includes(w.id);
              return /* @__PURE__ */ c.jsxs("label", { className: "character-checkbox", children: [
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: ct,
                    onChange: (Ft) => {
                      ue({
                        type: "UPDATE_FIELD",
                        field: "selectedPlayers",
                        value: Ft.target.checked ? [...te.selectedPlayers, w.id] : te.selectedPlayers.filter((Lt) => Lt !== w.id)
                      }), Bt("roster");
                    }
                  }
                ),
                /* @__PURE__ */ c.jsx("span", { children: ve }),
                w.status && /* @__PURE__ */ c.jsx("small", { className: "character-status", children: w.status })
              ] }, w.id);
            }) })
          ] }),
          Ct.roster && /* @__PURE__ */ c.jsx("p", { className: "form-error", role: "alert", children: Ct.roster }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { children: "Player Characters" }),
            /* @__PURE__ */ c.jsx("p", { className: "form-help", children: "Player selection is coming soon. Use placeholders to capture your expected team composition." }),
            ca.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "backbone-library", children: [
              /* @__PURE__ */ c.jsx(
                "button",
                {
                  type: "button",
                  className: "btn-secondary",
                  onClick: () => St((w) => !w),
                  "aria-expanded": $e,
                  "aria-controls": "creation-placeholder-library",
                  children: $e ? "Hide library" : "Browse library"
                }
              ),
              $e && /* @__PURE__ */ c.jsxs(
                "div",
                {
                  id: "creation-placeholder-library",
                  className: "campaign-manage__preset-panel",
                  role: "region",
                  "aria-label": "Placeholder library",
                  children: [
                    /* @__PURE__ */ c.jsx(
                      "input",
                      {
                        type: "search",
                        placeholder: "Search placeholder library…",
                        value: ir,
                        onChange: (w) => kr(w.target.value)
                      }
                    ),
                    /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__preset-scroll", children: Da.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No matches." }) : Da.map((w) => /* @__PURE__ */ c.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "campaign-manage__preset-option",
                        onClick: () => {
                          const ve = qs("placeholder");
                          ue({
                            type: "ADD_PLACEHOLDER_WITH_ID",
                            id: ve,
                            name: w.name,
                            role: w.role ?? ""
                          }), Bt("roster", 1), St(!1);
                        },
                        children: [
                          /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-name", children: w.name }),
                          w.role && /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-tags", children: w.role })
                        ]
                      },
                      w.id
                    )) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "placeholder-list", children: [
              te.placeholders.map((w) => /* @__PURE__ */ c.jsxs("div", { className: "placeholder-card", children: [
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    value: w.name,
                    onChange: (ve) => ue({
                      type: "UPDATE_PLACEHOLDER",
                      id: w.id,
                      field: "name",
                      value: ve.target.value
                    }),
                    placeholder: "Runner handle"
                  }
                ),
                /* @__PURE__ */ c.jsx(
                  "input",
                  {
                    value: w.role,
                    onChange: (ve) => ue({
                      type: "UPDATE_PLACEHOLDER",
                      id: w.id,
                      field: "role",
                      value: ve.target.value
                    }),
                    placeholder: "Role / specialty"
                  }
                ),
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-link",
                    onClick: () => ue({ type: "REMOVE_PLACEHOLDER", id: w.id }),
                    children: "Remove"
                  }
                )
              ] }, w.id)),
              /* @__PURE__ */ c.jsx(
                "button",
                {
                  type: "button",
                  className: "btn-secondary",
                  onClick: () => {
                    ue({ type: "ADD_PLACEHOLDER" }), Bt("roster", 1);
                  },
                  children: "Add Placeholder"
                }
              )
            ] })
          ] })
        ] });
      case 2:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "World Backbone" }),
          /* @__PURE__ */ c.jsx("p", { children: "Capture recurring factions and key locations to anchor your campaign." }),
          /* @__PURE__ */ c.jsx("div", { ref: Kt, tabIndex: -1, children: /* @__PURE__ */ c.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { children: "Factions" }),
              Jn.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "backbone-library", children: [
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-secondary",
                    onClick: () => bn((w) => !w),
                    "aria-expanded": An,
                    "aria-controls": "creation-faction-library",
                    children: An ? "Hide library" : "Browse library"
                  }
                ),
                An && /* @__PURE__ */ c.jsxs(
                  "div",
                  {
                    id: "creation-faction-library",
                    className: "campaign-manage__preset-panel",
                    role: "region",
                    "aria-label": "Faction library",
                    children: [
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          type: "search",
                          placeholder: "Search faction library…",
                          value: Ga,
                          onChange: (w) => Ri(w.target.value)
                        }
                      ),
                      /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__preset-scroll", children: fa.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No matches." }) : fa.map((w) => /* @__PURE__ */ c.jsxs(
                        "button",
                        {
                          type: "button",
                          className: "campaign-manage__preset-option",
                          onClick: () => {
                            const ve = qs("faction");
                            ue({ type: "ADD_FACTION_WITH_ID", id: ve }), ue({ type: "UPDATE_FACTION", id: ve, field: "name", value: w.name }), ue({ type: "UPDATE_FACTION", id: ve, field: "tags", value: w.tags ?? "" }), ue({ type: "UPDATE_FACTION", id: ve, field: "notes", value: w.notes ?? "" }), bn(!1);
                          },
                          children: [
                            /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-name", children: w.name }),
                            w.tags && /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-tags", children: w.tags })
                          ]
                        },
                        w.id
                      )) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "backbone-list", children: [
                te.factions.map((w) => /* @__PURE__ */ c.jsxs("div", { className: "backbone-card", children: [
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      value: w.name,
                      onChange: (ve) => ue({
                        type: "UPDATE_FACTION",
                        id: w.id,
                        field: "name",
                        value: ve.target.value
                      }),
                      placeholder: "Faction name"
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      value: w.tags,
                      onChange: (ve) => ue({
                        type: "UPDATE_FACTION",
                        id: w.id,
                        field: "tags",
                        value: ve.target.value
                      }),
                      placeholder: "Tags (corp, gang, fixer...)"
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "textarea",
                    {
                      value: w.notes,
                      onChange: (ve) => ue({
                        type: "UPDATE_FACTION",
                        id: w.id,
                        field: "notes",
                        value: ve.target.value
                      }),
                      placeholder: "Notes / agenda"
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn-link",
                      onClick: () => ue({ type: "REMOVE_FACTION", id: w.id }),
                      children: "Remove"
                    }
                  )
                ] }, w.id)),
                /* @__PURE__ */ c.jsxs("div", { className: "backbone-actions", children: [
                  /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: () => ue({ type: "ADD_FACTION" }), children: "Add Faction" }),
                  /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-link", onClick: Cn, children: "Quick-add template" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { children: "Locations" }),
              jr.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "backbone-library", children: [
                /* @__PURE__ */ c.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-secondary",
                    onClick: () => V((w) => !w),
                    "aria-expanded": Rn,
                    "aria-controls": "creation-location-library",
                    children: Rn ? "Hide library" : "Browse library"
                  }
                ),
                Rn && /* @__PURE__ */ c.jsxs(
                  "div",
                  {
                    id: "creation-location-library",
                    className: "campaign-manage__preset-panel",
                    role: "region",
                    "aria-label": "Location library",
                    children: [
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          type: "search",
                          placeholder: "Search location library…",
                          value: ka,
                          onChange: (w) => Zi(w.target.value)
                        }
                      ),
                      /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__preset-scroll", children: Na.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No matches." }) : Na.map((w) => /* @__PURE__ */ c.jsxs(
                        "button",
                        {
                          type: "button",
                          className: "campaign-manage__preset-option",
                          onClick: () => {
                            const ve = qs("location");
                            ue({ type: "ADD_LOCATION_WITH_ID", id: ve }), ue({ type: "UPDATE_LOCATION", id: ve, field: "name", value: w.name }), ue({
                              type: "UPDATE_LOCATION",
                              id: ve,
                              field: "descriptor",
                              value: w.descriptor ?? ""
                            }), V(!1);
                          },
                          children: [
                            /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-name", children: w.name }),
                            w.descriptor && /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-tags", children: w.descriptor })
                          ]
                        },
                        w.id
                      )) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ c.jsxs("div", { className: "backbone-list", children: [
                te.locations.map((w) => /* @__PURE__ */ c.jsxs("div", { className: "backbone-card", children: [
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      value: w.name,
                      onChange: (ve) => ue({
                        type: "UPDATE_LOCATION",
                        id: w.id,
                        field: "name",
                        value: ve.target.value
                      }),
                      placeholder: "Location name"
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "textarea",
                    {
                      value: w.descriptor,
                      onChange: (ve) => ue({
                        type: "UPDATE_LOCATION",
                        id: w.id,
                        field: "descriptor",
                        value: ve.target.value
                      }),
                      placeholder: "Descriptor (security rating, vibe...)"
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn-link",
                      onClick: () => ue({ type: "REMOVE_LOCATION", id: w.id }),
                      children: "Remove"
                    }
                  )
                ] }, w.id)),
                /* @__PURE__ */ c.jsxs("div", { className: "backbone-actions", children: [
                  /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: () => ue({ type: "ADD_LOCATION" }), children: "Add Location" }),
                  /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-link", onClick: yr, children: "Quick-add template" })
                ] })
              ] })
            ] })
          ] }) }),
          Ct.backbone && /* @__PURE__ */ c.jsx("p", { className: "form-error", role: "alert", children: Ct.backbone })
        ] });
      case 3:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "House Rules & Automation" }),
          /* @__PURE__ */ c.jsx("p", { children: "Toggle planned automation modules or make notes about house rules you plan to apply." }),
          /* @__PURE__ */ c.jsx("div", { className: "automation-grid", children: Qk.map((w) => /* @__PURE__ */ c.jsxs("label", { className: "automation-toggle", children: [
            /* @__PURE__ */ c.jsx(
              "input",
              {
                type: "checkbox",
                checked: !!te.houseRules[w.key],
                onChange: (ve) => ue({
                  type: "UPDATE_HOUSE_RULE",
                  key: w.key,
                  value: ve.target.checked
                })
              }
            ),
            /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: w.label }),
              /* @__PURE__ */ c.jsx("p", { children: w.description })
            ] })
          ] }, w.key)) }),
          /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ c.jsx("label", { htmlFor: "house-rule-notes", children: "House Rule Notes" }),
            /* @__PURE__ */ c.jsx(
              "textarea",
              {
                id: "house-rule-notes",
                value: te.houseRuleNotes,
                onChange: (w) => ue({ type: "UPDATE_FIELD", field: "houseRuleNotes", value: w.target.value }),
                placeholder: "Describe any custom rules, optional modules, or reminders.",
                rows: 4
              }
            )
          ] })
        ] });
      case 4:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Session Planning" }),
          /* @__PURE__ */ c.jsx("p", { children: "Outline the opening session runners can expect." }),
          Qa.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "backbone-library", children: [
            /* @__PURE__ */ c.jsx(
              "button",
              {
                type: "button",
                className: "btn-secondary",
                onClick: () => Ir((w) => !w),
                "aria-expanded": ht,
                "aria-controls": "creation-session-library",
                children: ht ? "Hide templates" : "Browse templates"
              }
            ),
            ht && /* @__PURE__ */ c.jsxs(
              "div",
              {
                id: "creation-session-library",
                className: "campaign-manage__preset-panel",
                role: "region",
                "aria-label": "Session seed library",
                children: [
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      type: "search",
                      placeholder: "Search session templates…",
                      value: Gn,
                      onChange: (w) => Ka(w.target.value)
                    }
                  ),
                  /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__preset-scroll", children: R.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No matches." }) : R.map((w) => /* @__PURE__ */ c.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "campaign-manage__preset-option",
                      onClick: () => {
                        ue({ type: "UPDATE_SESSION_SEED", field: "skip", value: !1 }), ue({ type: "UPDATE_SESSION_SEED", field: "title", value: w.title }), ue({
                          type: "UPDATE_SESSION_SEED",
                          field: "objectives",
                          value: w.objectives ?? ""
                        }), ue({
                          type: "UPDATE_SESSION_SEED",
                          field: "sceneTemplate",
                          value: w.scene_template ?? te.sessionSeed.sceneTemplate
                        }), ue({
                          type: "UPDATE_SESSION_SEED",
                          field: "summary",
                          value: w.summary ?? ""
                        }), Bt("sessionSeed", 4), Ir(!1);
                      },
                      children: [
                        /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-name", children: w.title }),
                        w.objectives && /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-tags", children: w.objectives })
                      ]
                    },
                    w.id
                  )) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("label", { className: "campaign-manage__checkbox", children: [
            /* @__PURE__ */ c.jsx(
              "input",
              {
                type: "checkbox",
                checked: te.sessionSeed.skip,
                onChange: (w) => ue({
                  type: "UPDATE_SESSION_SEED",
                  field: "skip",
                  value: w.target.checked
                })
              }
            ),
            /* @__PURE__ */ c.jsx("span", { children: "Skip planning for now" })
          ] }),
          !te.sessionSeed.skip && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__session-grid", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { children: "Title" }),
              /* @__PURE__ */ c.jsx(
                "input",
                {
                  value: te.sessionSeed.title,
                  onChange: (w) => ue({
                    type: "UPDATE_SESSION_SEED",
                    field: "title",
                    value: w.target.value
                  }),
                  placeholder: "Session 0, The Run, etc."
                }
              )
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { children: "Scene Template" }),
              /* @__PURE__ */ c.jsx(
                "input",
                {
                  value: te.sessionSeed.sceneTemplate,
                  onChange: (w) => ue({
                    type: "UPDATE_SESSION_SEED",
                    field: "sceneTemplate",
                    value: w.target.value
                  }),
                  placeholder: "social_meetup, extraction, heist..."
                }
              )
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { children: "Objectives" }),
              /* @__PURE__ */ c.jsx(
                "textarea",
                {
                  rows: 3,
                  value: te.sessionSeed.objectives,
                  onChange: (w) => ue({
                    type: "UPDATE_SESSION_SEED",
                    field: "objectives",
                    value: w.target.value
                  })
                }
              )
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ c.jsx("label", { children: "Summary" }),
              /* @__PURE__ */ c.jsx(
                "textarea",
                {
                  rows: 3,
                  value: te.sessionSeed.summary,
                  onChange: (w) => ue({
                    type: "UPDATE_SESSION_SEED",
                    field: "summary",
                    value: w.target.value
                  })
                }
              )
            ] })
          ] }),
          Ct.sessionSeed && /* @__PURE__ */ c.jsx("p", { className: "form-error", role: "alert", children: Ct.sessionSeed })
        ] });
      case 5:
        return /* @__PURE__ */ c.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Review & Launch" }),
          /* @__PURE__ */ c.jsxs("div", { className: "review-grid", children: [
            /* @__PURE__ */ c.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ c.jsx("h5", { children: "Campaign Overview" }),
              /* @__PURE__ */ c.jsxs("ul", { children: [
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Name:" }),
                  " ",
                  te.name || "—"
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Theme:" }),
                  " ",
                  te.theme || "—"
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Edition:" }),
                  " ",
                  z.toUpperCase()
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Gameplay Level:" }),
                  " ",
                  ce
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Creation Method:" }),
                  " ",
                  I
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "Source Books:" }),
                  " ",
                  fn.length > 0 ? fn.join(", ") : Ut
                ] }),
                /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: "GM:" }),
                  " ",
                  ((fe = ln.find((w) => w.value === ke)) == null ? void 0 : fe.label) ?? "Unassigned"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ c.jsx("h5", { children: "Roster & World" }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Placeholders:" }),
                " ",
                te.placeholders.length,
                " ",
                te.placeholders.length > 0 && `(${te.placeholders.map((w) => w.name).join(", ")})`
              ] }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Factions:" }),
                " ",
                te.factions.length
              ] }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Locations:" }),
                " ",
                te.locations.length
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ c.jsx("h5", { children: "Automation & Session" }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Automation toggles:" }),
                " ",
                Object.entries(te.houseRules).filter(([, w]) => w).map(([w]) => w.replace(/_/g, " ")).join(", ") || "None"
              ] }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "House rule notes:" }),
                " ",
                te.houseRuleNotes || "—"
              ] }),
              /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Session seed:" }),
                " ",
                te.sessionSeed.skip ? "Skipped for now" : `${te.sessionSeed.title} (${te.sessionSeed.sceneTemplate})`
              ] }),
              !te.sessionSeed.skip && te.sessionSeed.objectives && /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Objectives:" }),
                " ",
                te.sessionSeed.objectives
              ] })
            ] })
          ] })
        ] });
      default:
        return null;
    }
  }, Aa = O === 0, el = O === Mn - 1;
  return j ? jl.createPortal(
    /* @__PURE__ */ c.jsx(
      "section",
      {
        className: `campaign-create-react ${Ze ? "campaign-create-react--open" : "campaign-create-react--collapsed"}`,
        children: Ze ? /* @__PURE__ */ c.jsxs("div", { className: "campaign-wizard", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "campaign-wizard__header", children: [
            /* @__PURE__ */ c.jsx("h3", { children: "Create Campaign" }),
            /* @__PURE__ */ c.jsx("nav", { className: "campaign-wizard__navigation", "aria-label": "Campaign creation steps", children: Tx.map((fe, w) => {
              var Lt;
              const ve = O === w, ct = O > w, Ft = !!((Lt = Ln[w]) != null && Lt.length);
              return /* @__PURE__ */ c.jsxs(
                "button",
                {
                  type: "button",
                  className: `campaign-wizard__step ${ve ? "campaign-wizard__step--active" : ""} ${ct ? "campaign-wizard__step--completed" : ""} ${Ft ? "campaign-wizard__step--error" : ""}`,
                  onClick: () => {
                    var _n;
                    Tn({}), P(w), (_n = Ln[w]) != null && _n.length ? pt(w) : Re(null);
                  },
                  children: [
                    /* @__PURE__ */ c.jsx("span", { className: "campaign-wizard__step-index", children: w + 1 }),
                    /* @__PURE__ */ c.jsx("span", { children: fe }),
                    Ft && /* @__PURE__ */ c.jsx("span", { className: "campaign-wizard__step-error-indicator", "aria-hidden": "true", children: "!" })
                  ]
                },
                fe
              );
            }) })
          ] }),
          /* @__PURE__ */ c.jsxs("form", { className: "campaign-wizard__form campaign-form", onSubmit: La, noValidate: !0, children: [
            Ot(),
            (((ji = Ln[O]) == null ? void 0 : ji.length) || Ie) && /* @__PURE__ */ c.jsx("div", { className: "form-error form-error--banner", role: "alert", "aria-live": "assertive", children: /* @__PURE__ */ c.jsx("ul", { className: "form-error__list", children: (Ln[O] ?? (Ie ? [Ie] : [])).map((fe, w) => /* @__PURE__ */ c.jsx("li", { children: fe }, `step-${O}-error-${w}`)) }) }),
            /* @__PURE__ */ c.jsxs("div", { className: "campaign-wizard__actions", children: [
              /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: Qe, disabled: je, children: "Cancel" }),
              /* @__PURE__ */ c.jsxs("div", { className: "campaign-wizard__actions-right", children: [
                !Aa && /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: Oa, disabled: je, children: "Back" }),
                el ? /* @__PURE__ */ c.jsx("button", { type: "submit", className: "btn-primary", disabled: je, children: je ? "Creating…" : "Create Campaign" }) : /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-primary", onClick: _t, disabled: je, children: "Next" })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ c.jsxs("div", { className: "campaign-create-trigger", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "campaign-create-trigger__copy", children: [
            /* @__PURE__ */ c.jsx("h3", { children: "Plan Your Next Campaign" }),
            /* @__PURE__ */ c.jsx("p", { children: "Select an edition, assign a GM, and lock in gameplay defaults." })
          ] }),
          /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-primary", onClick: ze, children: "Create Campaign" })
        ] })
      }
    ),
    j
  ) : null;
}
const U_ = k.forwardRef(
  ({ className: x, variant: S = "default", type: b = "text", ...J }, Z) => {
    const N = ["form-input"];
    return S === "search" && N.push("form-input--search"), x && N.push(x), /* @__PURE__ */ c.jsx("input", { ref: Z, type: b, className: N.join(" "), ...J });
  }
);
U_.displayName = "TextInput";
function qk(x, S, b) {
  const J = b === "asc" ? 1 : -1, Z = (W) => W instanceof Date ? W.getTime() : typeof W == "number" ? W : typeof W == "boolean" ? W ? 1 : 0 : W == null ? "" : String(W).toLowerCase(), N = Z(x), y = Z(S);
  return N < y ? -1 * J : N > y ? 1 * J : 0;
}
function Xk({
  columns: x,
  data: S,
  getRowId: b,
  loading: J = !1,
  emptyState: Z,
  enableSearch: N = !0,
  searchPlaceholder: y = "Search…",
  initialSortKey: W,
  initialSortDirection: U = "asc",
  rowClassName: j
}) {
  var Ee, ce;
  const de = k.useMemo(
    () => x.filter((me) => me.sortable),
    [x]
  ), z = W ?? ((Ee = de[0]) == null ? void 0 : Ee.key) ?? ((ce = x[0]) == null ? void 0 : ce.key) ?? "", [Y, G] = k.useState(z), [re, oe] = k.useState(U), [ye, Ae] = k.useState(""), le = k.useMemo(() => {
    const me = x.filter((De) => De.searchable !== !1), I = S.filter((De) => !N || !ye.trim() ? !0 : me.some((he) => {
      const Be = he.accessor, ee = Be ? Be(De) : De[he.key];
      return ee == null ? !1 : String(ee).toLowerCase().includes(ye.toLowerCase());
    }));
    if (!Y)
      return I;
    const _e = x.find((De) => De.key === Y);
    if (!_e)
      return I;
    const Ue = _e.accessor;
    return [...I].sort((De, he) => {
      const Be = Ue ? Ue(De) : De[Y], ee = Ue ? Ue(he) : he[Y];
      return qk(Be, ee, re);
    });
  }, [x, S, N, ye, re, Y]);
  function ke(me) {
    Y === me ? oe((I) => I === "asc" ? "desc" : "asc") : (G(me), oe("asc"));
  }
  return /* @__PURE__ */ c.jsxs("div", { className: "data-table-wrapper", children: [
    N && x.length > 0 && /* @__PURE__ */ c.jsx("div", { className: "data-table-toolbar", children: /* @__PURE__ */ c.jsx(
      U_,
      {
        variant: "search",
        type: "search",
        placeholder: y,
        value: ye,
        onChange: (me) => Ae(me.target.value),
        "aria-label": "Search table"
      }
    ) }),
    /* @__PURE__ */ c.jsx("div", { className: "data-table-container", children: /* @__PURE__ */ c.jsxs("table", { className: "data-table", children: [
      /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsx("tr", { children: x.map((me) => {
        const I = me.sortable !== !1, _e = me.key === Y;
        return /* @__PURE__ */ c.jsxs(
          "th",
          {
            style: { width: me.width },
            className: [
              me.align ? `align-${me.align}` : "",
              I ? "sortable" : "",
              _e ? `sorted-${re}` : ""
            ].filter(Boolean).join(" "),
            onClick: () => {
              I && ke(me.key);
            },
            children: [
              /* @__PURE__ */ c.jsx("span", { children: me.header }),
              I && /* @__PURE__ */ c.jsx("span", { className: "sort-indicator", "aria-hidden": "true", children: _e ? re === "asc" ? "▲" : "▼" : "↕" })
            ]
          },
          me.key
        );
      }) }) }),
      /* @__PURE__ */ c.jsx("tbody", { children: J ? /* @__PURE__ */ c.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ c.jsx("td", { colSpan: x.length, children: "Loading…" }) }) : le.length === 0 ? /* @__PURE__ */ c.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ c.jsx("td", { colSpan: x.length, children: Z || "No records found." }) }) : le.map((me, I) => /* @__PURE__ */ c.jsx("tr", { className: j == null ? void 0 : j(me), children: x.map((_e) => /* @__PURE__ */ c.jsx("td", { className: _e.align ? `align-${_e.align}` : void 0, children: _e.render ? _e.render(me) : me[_e.key] }, _e.key)) }, b(me, I))) })
    ] }) })
  ] });
}
function Jk(x) {
  if (!x)
    return "—";
  const S = Date.parse(x);
  return Number.isNaN(S) ? x : new Date(S).toLocaleDateString();
}
function Zk({
  campaigns: x,
  loading: S,
  error: b,
  onView: J,
  onEdit: Z,
  onDelete: N,
  currentUser: y,
  actionInFlightId: W
}) {
  const U = k.useMemo(
    () => [
      {
        key: "name",
        header: "Campaign",
        sortable: !0,
        accessor: (j) => j.name
      },
      {
        key: "edition",
        header: "Edition",
        sortable: !0,
        accessor: (j) => j.edition.toUpperCase()
      },
      {
        key: "gameplay_level",
        header: "Gameplay Level",
        sortable: !0,
        accessor: (j) => j.gameplay_level ?? "",
        render: (j) => {
          var de;
          return ((de = j.gameplay_level) == null ? void 0 : de.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "creation_method",
        header: "Creation Method",
        sortable: !0,
        accessor: (j) => j.creation_method,
        render: (j) => {
          var de;
          return ((de = j.creation_method) == null ? void 0 : de.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "gm_name",
        header: "Gamemaster",
        sortable: !0,
        accessor: (j) => j.gm_name ?? "",
        render: (j) => j.gm_name ?? "—"
      },
      {
        key: "status",
        header: "Status",
        sortable: !0,
        accessor: (j) => j.status ?? "",
        render: (j) => /* @__PURE__ */ c.jsx("span", { className: `status-badge status-${(j.status ?? "unknown").toLowerCase()}`, children: j.status ?? "—" })
      },
      {
        key: "updated_at",
        header: "Updated",
        sortable: !0,
        accessor: (j) => j.updated_at ? new Date(j.updated_at) : null,
        render: (j) => Jk(j.updated_at)
      },
      {
        key: "actions",
        header: "Actions",
        sortable: !1,
        align: "right",
        render: (j) => {
          var re, oe, ye;
          const de = j.can_edit || j.can_delete || (y == null ? void 0 : y.isAdministrator) || j.gm_user_id && ((re = y == null ? void 0 : y.user) == null ? void 0 : re.id) === j.gm_user_id, z = W === j.id, Y = (j.can_edit ?? !1) || (y == null ? void 0 : y.isAdministrator) || j.gm_user_id && ((oe = y == null ? void 0 : y.user) == null ? void 0 : oe.id) === j.gm_user_id, G = (j.can_delete ?? !1) || (y == null ? void 0 : y.isAdministrator) || j.gm_user_id && ((ye = y == null ? void 0 : y.user) == null ? void 0 : ye.id) === j.gm_user_id;
          return /* @__PURE__ */ c.jsxs("div", { className: "table-actions", children: [
            /* @__PURE__ */ c.jsx(
              "button",
              {
                type: "button",
                className: "button button--table",
                onClick: () => J(j),
                disabled: z,
                children: "View"
              }
            ),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                type: "button",
                className: "button button--table",
                onClick: () => Z(j),
                disabled: z || !de || !Y,
                children: "Edit"
              }
            ),
            /* @__PURE__ */ c.jsx(
              "button",
              {
                type: "button",
                className: "button button--table button--danger",
                onClick: () => N(j),
                disabled: z || !de || !G,
                children: "Delete"
              }
            )
          ] });
        }
      }
    ],
    [W, y, N, Z, J]
  );
  return /* @__PURE__ */ c.jsxs("div", { className: "campaign-table", children: [
    b && /* @__PURE__ */ c.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: b }),
    /* @__PURE__ */ c.jsx(
      Xk,
      {
        columns: U,
        data: x,
        loading: S,
        getRowId: (j) => j.id,
        emptyState: "No campaigns yet. Create one to get started!",
        searchPlaceholder: "Search campaigns…"
      }
    )
  ] });
}
const eN = ["Active", "Paused", "Completed"], Ax = [
  "initiative_automation",
  "recoil_tracking",
  "matrix_trace"
];
function ny(x) {
  return x ? x.replace(/[_-]+/g, " ").split(" ").filter(Boolean).map((S) => S.charAt(0).toUpperCase() + S.slice(1)).join(" ") : "";
}
function R_(x) {
  if (!x) return null;
  const S = new Date(x);
  return Number.isNaN(S.getTime()) ? null : new Intl.DateTimeFormat(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(S);
}
function qf(x) {
  return `${x}-${Math.random().toString(36).slice(2, 10)}`;
}
function Rx(x, S) {
  return x.map((b) => ({
    id: b.id ?? qf(S),
    ...b
  }));
}
function j_(x) {
  if (!x)
    return {
      valid: !0,
      value: {
        automation: Object.fromEntries(Ax.map((S) => [S, !1])),
        notes: "",
        theme: "",
        factions: [],
        locations: [],
        placeholders: [],
        sessionSeed: { title: "", objectives: "", sceneTemplate: "", summary: "", skip: !1 }
      }
    };
  try {
    const S = JSON.parse(x), b = new Set(Ax);
    S.automation && typeof S.automation == "object" && Object.keys(S.automation).forEach((j) => b.add(j));
    const J = {};
    b.forEach((j) => {
      J[j] = typeof S.automation == "object" && S.automation !== null ? !!S.automation[j] : !1;
    });
    const Z = Array.isArray(S.factions) ? Rx(
      S.factions.map((j) => ({
        id: typeof j.id == "string" ? j.id : void 0,
        name: typeof j.name == "string" ? j.name : "",
        tags: typeof j.tags == "string" ? j.tags : "",
        notes: typeof j.notes == "string" ? j.notes : ""
      })),
      "faction"
    ) : [], N = Array.isArray(S.locations) ? Rx(
      S.locations.map((j) => ({
        id: typeof j.id == "string" ? j.id : void 0,
        name: typeof j.name == "string" ? j.name : "",
        descriptor: typeof j.descriptor == "string" ? j.descriptor : ""
      })),
      "location"
    ) : [], y = Array.isArray(S.placeholders) ? Rx(
      S.placeholders.map((j) => ({
        id: typeof j.id == "string" ? j.id : void 0,
        name: typeof j.name == "string" ? j.name : "",
        role: typeof j.role == "string" ? j.role : ""
      })),
      "placeholder"
    ) : [], W = S.session_seed, U = {
      title: typeof (W == null ? void 0 : W.title) == "string" ? W.title : "",
      objectives: typeof (W == null ? void 0 : W.objectives) == "string" ? W.objectives : "",
      sceneTemplate: typeof (W == null ? void 0 : W.sceneTemplate) == "string" ? W.sceneTemplate : "",
      summary: typeof (W == null ? void 0 : W.summary) == "string" ? W.summary : "",
      skip: !!(W != null && W.skip)
    };
    return {
      valid: !0,
      value: {
        automation: J,
        notes: typeof S.notes == "string" ? S.notes : "",
        theme: typeof S.theme == "string" ? S.theme : "",
        factions: Z,
        locations: N,
        placeholders: y,
        sessionSeed: U
      }
    };
  } catch {
    return { valid: !1, raw: x };
  }
}
function tN(x) {
  const S = {};
  S.automation = x.automation, x.theme.trim() && (S.theme = x.theme.trim()), x.notes.trim() && (S.notes = x.notes.trim());
  const b = x.factions.map((N) => {
    var y, W;
    return {
      ...N,
      name: N.name.trim(),
      tags: ((y = N.tags) == null ? void 0 : y.trim()) || void 0,
      notes: ((W = N.notes) == null ? void 0 : W.trim()) || void 0
    };
  }).filter((N) => N.name.length > 0);
  b.length > 0 && (S.factions = b);
  const J = x.locations.map((N) => {
    var y;
    return {
      ...N,
      name: N.name.trim(),
      descriptor: ((y = N.descriptor) == null ? void 0 : y.trim()) || void 0
    };
  }).filter((N) => N.name.length > 0);
  J.length > 0 && (S.locations = J);
  const Z = x.placeholders.map((N) => ({
    ...N,
    name: N.name.trim(),
    role: N.role.trim()
  })).filter((N) => N.name.length > 0);
  return Z.length > 0 && (S.placeholders = Z), x.sessionSeed.skip ? S.session_seed = { skip: !0 } : (x.sessionSeed.title.trim() || x.sessionSeed.objectives.trim() || x.sessionSeed.sceneTemplate.trim() || x.sessionSeed.summary.trim()) && (S.session_seed = {
    title: x.sessionSeed.title.trim() || void 0,
    objectives: x.sessionSeed.objectives.trim() || void 0,
    sceneTemplate: x.sessionSeed.sceneTemplate.trim() || void 0,
    summary: x.sessionSeed.summary.trim() || void 0,
    skip: !1
  }), JSON.stringify(S, null, 2);
}
function nN({ campaign: x, gmUsers: S, gameplayRules: b, onClose: J, onSave: Z }) {
  var Rn;
  const {
    loadCampaignCharacterCreation: N,
    campaignCharacterCreation: y,
    characterCreationData: W
  } = Xf(), [U, j] = k.useState(x.name), [de, z] = k.useState(x.gm_user_id ?? ""), [Y, G] = k.useState(x.status ?? "Active"), [re, oe] = k.useState(!1), [ye, Ae] = k.useState(null), le = k.useMemo(() => j_(x.house_rules), [x.house_rules]), [ke, Ee] = k.useState(le.valid ? "" : le.raw), [ce, me] = k.useState(le.valid ? le.value.theme : ""), [I, _e] = k.useState(le.valid ? le.value.notes : ""), [Ue, De] = k.useState(
    le.valid ? le.value.automation : {}
  ), [he, Be] = k.useState(le.valid ? le.value.factions : []), [ee, Oe] = k.useState(le.valid ? le.value.locations : []), [Ze, lt] = k.useState(
    le.valid ? le.value.placeholders : []
  ), [je, Se] = k.useState(
    le.valid ? le.value.sessionSeed : { title: "", objectives: "", sceneTemplate: "", summary: "", skip: !1 }
  ), [Ie, Re] = k.useState(""), [O, P] = k.useState(""), [te, ue] = k.useState(!1), [bt, Tt] = k.useState(!1);
  k.useEffect(() => {
    j(x.name), z(x.gm_user_id ?? ""), G(x.status ?? "Active");
    const V = j_(x.house_rules);
    if (!V.valid) {
      Ee(V.raw), me(""), _e(""), De({}), Be([]), Oe([]), lt([]), Se({ title: "", objectives: "", sceneTemplate: "", summary: "", skip: !1 });
      return;
    }
    Ee(""), me(V.value.theme), _e(V.value.notes), De(V.value.automation), Be(V.value.factions), Oe(V.value.locations), lt(V.value.placeholders), Se(V.value.sessionSeed);
  }, [x]), k.useEffect(() => {
    N(x.id);
  }, [x.id, N]);
  const yt = k.useMemo(() => S.length === 0 ? [{ label: "No gamemasters found", value: "" }] : S.map((V) => ({
    label: `${V.username} (${V.email})`,
    value: V.id
  })), [S]), mt = re || U.trim().length === 0 || S.length > 0 && !de, gt = !le.valid;
  async function $t(V) {
    if (V.preventDefault(), !mt) {
      oe(!0), Ae(null);
      try {
        const $e = S.find((ht) => ht.id === de), St = gt ? ke.trim() : tN({
          automation: Ue,
          notes: I,
          theme: ce,
          factions: he,
          locations: ee,
          placeholders: Ze,
          sessionSeed: je
        });
        await Z({
          name: U.trim(),
          gm_user_id: de || void 0,
          gm_name: ($e == null ? void 0 : $e.username) ?? ($e == null ? void 0 : $e.email) ?? "",
          status: Y,
          house_rules: St
        }), await N(x.id), J();
      } catch ($e) {
        const St = $e instanceof Error ? $e.message : "Failed to update campaign.";
        Ae(St);
      } finally {
        oe(!1);
      }
    }
  }
  const Dn = ((Rn = x.edition) == null ? void 0 : Rn.toUpperCase()) ?? "SR5", qn = ny(x.creation_method), xn = (b == null ? void 0 : b.label) ?? ny(x.gameplay_level ?? "Experienced"), En = Object.entries(Ue), On = he.length > 0 || ee.length > 0, Ct = k.useMemo(
    () => (y == null ? void 0 : y.campaign_support) ?? (W == null ? void 0 : W.campaign_support),
    [y == null ? void 0 : y.campaign_support, W == null ? void 0 : W.campaign_support]
  ), Tn = k.useMemo(() => {
    const V = /* @__PURE__ */ new Set([...Ax]);
    return En.forEach(([$e]) => V.add($e)), Array.from(V);
  }, [En]), Ln = (Ct == null ? void 0 : Ct.factions) ?? [], Qn = (Ct == null ? void 0 : Ct.locations) ?? [], An = k.useMemo(() => {
    if (!Ie.trim())
      return Ln;
    const V = Ie.toLowerCase();
    return Ln.filter(($e) => $e.name.toLowerCase().includes(V) || ($e.tags ?? "").toLowerCase().includes(V) || ($e.notes ?? "").toLowerCase().includes(V));
  }, [Ie, Ln]), bn = k.useMemo(() => {
    if (!O.trim())
      return Qn;
    const V = O.toLowerCase();
    return Qn.filter(($e) => $e.name.toLowerCase().includes(V) || ($e.descriptor ?? "").toLowerCase().includes(V));
  }, [O, Qn]);
  return /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage", children: [
    /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__backdrop", "aria-hidden": "true" }),
    /* @__PURE__ */ c.jsxs(
      "section",
      {
        className: "campaign-manage__panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "campaign-manage-heading",
        children: [
          /* @__PURE__ */ c.jsx("header", { className: "campaign-manage__header", children: /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("h3", { id: "campaign-manage-heading", children: x.name }),
            /* @__PURE__ */ c.jsxs("p", { className: "campaign-manage__subtitle", children: [
              Dn,
              " · ",
              qn,
              " · ",
              xn
            ] })
          ] }) }),
          /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__body", children: [
            /* @__PURE__ */ c.jsxs("form", { className: "campaign-manage__form campaign-form", onSubmit: $t, children: [
              /* @__PURE__ */ c.jsxs("section", { children: [
                /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Basics" }),
                /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                  /* @__PURE__ */ c.jsx("label", { htmlFor: "edit-campaign-name", children: "Campaign Name" }),
                  /* @__PURE__ */ c.jsx(
                    "input",
                    {
                      id: "edit-campaign-name",
                      name: "campaign-name",
                      value: U,
                      onChange: (V) => j(V.target.value),
                      required: !0
                    }
                  )
                ] }),
                /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                  /* @__PURE__ */ c.jsx("label", { htmlFor: "edit-campaign-gm", children: "Gamemaster" }),
                  /* @__PURE__ */ c.jsx(
                    "select",
                    {
                      id: "edit-campaign-gm",
                      name: "campaign-gm",
                      value: de,
                      onChange: (V) => z(V.target.value),
                      children: yt.map((V) => /* @__PURE__ */ c.jsx("option", { value: V.value, children: V.label }, V.value))
                    }
                  )
                ] }),
                /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                  /* @__PURE__ */ c.jsx("label", { htmlFor: "edit-campaign-status", children: "Status" }),
                  /* @__PURE__ */ c.jsx(
                    "select",
                    {
                      id: "edit-campaign-status",
                      name: "campaign-status",
                      value: Y,
                      onChange: (V) => G(V.target.value),
                      children: eN.map((V) => /* @__PURE__ */ c.jsx("option", { value: V, children: V }, V))
                    }
                  )
                ] })
              ] }),
              gt ? /* @__PURE__ */ c.jsxs("section", { children: [
                /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "House Rules JSON" }),
                /* @__PURE__ */ c.jsx(
                  "textarea",
                  {
                    id: "edit-campaign-house-rules",
                    name: "campaign-house-rules",
                    rows: 10,
                    value: ke,
                    onChange: (V) => Ee(V.target.value),
                    placeholder: "Paste house rule JSON configuration..."
                  }
                ),
                /* @__PURE__ */ c.jsx("small", { children: "We could not parse the existing house rules into structured sections. Update the JSON directly and save to keep your changes." })
              ] }) : /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Table Guidance" }),
                  /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                    /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-theme", children: "Theme / Tagline" }),
                    /* @__PURE__ */ c.jsx(
                      "input",
                      {
                        id: "campaign-theme",
                        name: "campaign-theme",
                        value: ce,
                        onChange: (V) => me(V.target.value),
                        placeholder: "Neo-Tokyo corporate intrigue, deep-space survival, etc."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                    /* @__PURE__ */ c.jsx("label", { htmlFor: "campaign-notes", children: "GM Notes" }),
                    /* @__PURE__ */ c.jsx(
                      "textarea",
                      {
                        id: "campaign-notes",
                        name: "campaign-notes",
                        rows: 4,
                        value: I,
                        onChange: (V) => _e(V.target.value),
                        placeholder: "Session pacing tweaks, houseruled limits, table reminders..."
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Automation Toggles" }),
                  /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__toggle-grid", children: Tn.map((V) => /* @__PURE__ */ c.jsxs("label", { className: "campaign-manage__toggle", children: [
                    /* @__PURE__ */ c.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: !!Ue[V],
                        onChange: ($e) => De((St) => ({
                          ...St,
                          [V]: $e.target.checked
                        }))
                      }
                    ),
                    /* @__PURE__ */ c.jsx("span", { children: ny(V) })
                  ] }, V)) }),
                  /* @__PURE__ */ c.jsx("small", { className: "campaign-manage__hint", children: "These options mirror the automation helpers available in the wizard." })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__section-heading", children: [
                    /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Factions" }),
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        type: "button",
                        className: "btn-secondary",
                        onClick: () => Be((V) => [
                          ...V,
                          { id: qf("faction"), name: "", tags: "", notes: "" }
                        ]),
                        children: "Add Faction"
                      }
                    )
                  ] }),
                  Ln.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__preset", children: [
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        type: "button",
                        className: "btn-secondary",
                        onClick: () => ue((V) => !V),
                        "aria-expanded": te,
                        "aria-controls": "campaign-faction-library-panel",
                        children: te ? "Hide library" : "Browse library"
                      }
                    ),
                    te && /* @__PURE__ */ c.jsxs(
                      "div",
                      {
                        id: "campaign-faction-library-panel",
                        className: "campaign-manage__preset-panel",
                        role: "region",
                        "aria-label": "Faction library",
                        children: [
                          /* @__PURE__ */ c.jsx(
                            "input",
                            {
                              id: "campaign-faction-filter",
                              type: "search",
                              placeholder: "Search faction library…",
                              value: Ie,
                              onChange: (V) => {
                                Re(V.target.value);
                              }
                            }
                          ),
                          /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__preset-scroll", children: An.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No matches." }) : An.map((V) => /* @__PURE__ */ c.jsxs(
                            "button",
                            {
                              type: "button",
                              className: "campaign-manage__preset-option",
                              onClick: () => {
                                Be(($e) => [
                                  ...$e,
                                  {
                                    id: qf("faction"),
                                    name: V.name,
                                    tags: V.tags ?? "",
                                    notes: V.notes ?? ""
                                  }
                                ]), ue(!1);
                              },
                              children: [
                                /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-name", children: V.name }),
                                V.tags && /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-tags", children: V.tags })
                              ]
                            },
                            V.id
                          )) })
                        ]
                      }
                    )
                  ] }),
                  he.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No factions captured yet." }) : /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__collection", children: he.map((V) => /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-card", children: [
                    /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-header", children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Faction" }),
                      /* @__PURE__ */ c.jsx(
                        "button",
                        {
                          type: "button",
                          className: "btn-secondary",
                          onClick: () => Be(($e) => $e.filter((St) => St.id !== V.id)),
                          children: "Remove"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Name" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: V.name,
                          onChange: ($e) => Be(
                            (St) => St.map(
                              (ht) => ht.id === V.id ? { ...ht, name: $e.target.value } : ht
                            )
                          )
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Tags" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: V.tags ?? "",
                          onChange: ($e) => Be(
                            (St) => St.map(
                              (ht) => ht.id === V.id ? { ...ht, tags: $e.target.value } : ht
                            )
                          ),
                          placeholder: "Megacorp, Syndicate, Magical society..."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Notes" }),
                      /* @__PURE__ */ c.jsx(
                        "textarea",
                        {
                          rows: 3,
                          value: V.notes ?? "",
                          onChange: ($e) => Be(
                            (St) => St.map(
                              (ht) => ht.id === V.id ? { ...ht, notes: $e.target.value } : ht
                            )
                          )
                        }
                      )
                    ] })
                  ] }, V.id)) })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__section-heading", children: [
                    /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Locations" }),
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        type: "button",
                        className: "btn-secondary",
                        onClick: () => Oe((V) => [
                          ...V,
                          { id: qf("location"), name: "", descriptor: "" }
                        ]),
                        children: "Add Location"
                      }
                    )
                  ] }),
                  Qn.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__preset", children: [
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        type: "button",
                        className: "btn-secondary",
                        onClick: () => Tt((V) => !V),
                        "aria-expanded": bt,
                        "aria-controls": "campaign-location-library-panel",
                        children: bt ? "Hide library" : "Browse library"
                      }
                    ),
                    bt && /* @__PURE__ */ c.jsxs(
                      "div",
                      {
                        id: "campaign-location-library-panel",
                        className: "campaign-manage__preset-panel",
                        role: "region",
                        "aria-label": "Location library",
                        children: [
                          /* @__PURE__ */ c.jsx(
                            "input",
                            {
                              id: "campaign-location-filter",
                              type: "search",
                              placeholder: "Search location library…",
                              value: O,
                              onChange: (V) => {
                                P(V.target.value);
                              }
                            }
                          ),
                          /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__preset-scroll", children: bn.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No matches." }) : bn.map((V) => /* @__PURE__ */ c.jsxs(
                            "button",
                            {
                              type: "button",
                              className: "campaign-manage__preset-option",
                              onClick: () => {
                                Oe(($e) => [
                                  ...$e,
                                  {
                                    id: qf("location"),
                                    name: V.name,
                                    descriptor: V.descriptor ?? ""
                                  }
                                ]), Tt(!1);
                              },
                              children: [
                                /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-name", children: V.name }),
                                V.descriptor && /* @__PURE__ */ c.jsx("span", { className: "campaign-manage__preset-tags", children: V.descriptor })
                              ]
                            },
                            V.id
                          )) })
                        ]
                      }
                    )
                  ] }),
                  ee.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No safehouses or key locations yet." }) : /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__collection", children: ee.map((V) => /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-card", children: [
                    /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-header", children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Location" }),
                      /* @__PURE__ */ c.jsx(
                        "button",
                        {
                          type: "button",
                          className: "btn-secondary",
                          onClick: () => Oe(
                            ($e) => $e.filter((St) => St.id !== V.id)
                          ),
                          children: "Remove"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Name" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: V.name,
                          onChange: ($e) => Oe(
                            (St) => St.map(
                              (ht) => ht.id === V.id ? { ...ht, name: $e.target.value } : ht
                            )
                          )
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Descriptor" }),
                      /* @__PURE__ */ c.jsx(
                        "textarea",
                        {
                          rows: 3,
                          value: V.descriptor ?? "",
                          onChange: ($e) => Oe(
                            (St) => St.map(
                              (ht) => ht.id === V.id ? { ...ht, descriptor: $e.target.value } : ht
                            )
                          ),
                          placeholder: "Security rating, vibes, hooks..."
                        }
                      )
                    ] })
                  ] }, V.id)) })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__section-heading", children: [
                    /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Placeholder Runners" }),
                    /* @__PURE__ */ c.jsx(
                      "button",
                      {
                        type: "button",
                        className: "btn-secondary",
                        onClick: () => lt((V) => [
                          ...V,
                          { id: qf("placeholder"), name: "", role: "" }
                        ]),
                        children: "Add Placeholder"
                      }
                    )
                  ] }),
                  Ze.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-manage__empty", children: "No placeholders yet." }) : /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__collection", children: Ze.map((V) => /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-card", children: [
                    /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__collection-header", children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Runner" }),
                      /* @__PURE__ */ c.jsx(
                        "button",
                        {
                          type: "button",
                          className: "btn-secondary",
                          onClick: () => lt(
                            ($e) => $e.filter((St) => St.id !== V.id)
                          ),
                          children: "Remove"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Handle" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: V.name,
                          onChange: ($e) => lt(
                            (St) => St.map(
                              (ht) => ht.id === V.id ? { ...ht, name: $e.target.value } : ht
                            )
                          ),
                          placeholder: "Maverick, Cipher..."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Role" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: V.role,
                          onChange: ($e) => lt(
                            (St) => St.map(
                              (ht) => ht.id === V.id ? { ...ht, role: $e.target.value } : ht
                            )
                          ),
                          placeholder: "Face, Rigger, Adept..."
                        }
                      )
                    ] })
                  ] }, V.id)) })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { children: [
                  /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Session Seed" }),
                  /* @__PURE__ */ c.jsxs("label", { className: "campaign-manage__checkbox", children: [
                    /* @__PURE__ */ c.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: je.skip,
                        onChange: (V) => Se(($e) => ({ ...$e, skip: V.target.checked }))
                      }
                    ),
                    /* @__PURE__ */ c.jsx("span", { children: "Skip planning for now" })
                  ] }),
                  !je.skip && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__session-grid", children: [
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Title" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: je.title,
                          onChange: (V) => Se(($e) => ({ ...$e, title: V.target.value })),
                          placeholder: "Session 0, The Run, etc."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Scene Template" }),
                      /* @__PURE__ */ c.jsx(
                        "input",
                        {
                          value: je.sceneTemplate,
                          onChange: (V) => Se(($e) => ({
                            ...$e,
                            sceneTemplate: V.target.value
                          })),
                          placeholder: "social_meetup, extraction, heist..."
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Objectives" }),
                      /* @__PURE__ */ c.jsx(
                        "textarea",
                        {
                          rows: 3,
                          value: je.objectives,
                          onChange: (V) => Se(($e) => ({
                            ...$e,
                            objectives: V.target.value
                          }))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c.jsxs("div", { className: "form-group", children: [
                      /* @__PURE__ */ c.jsx("label", { children: "Summary" }),
                      /* @__PURE__ */ c.jsx(
                        "textarea",
                        {
                          rows: 3,
                          value: je.summary,
                          onChange: (V) => Se(($e) => ({ ...$e, summary: V.target.value }))
                        }
                      )
                    ] })
                  ] })
                ] })
              ] }),
              ye && /* @__PURE__ */ c.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: ye }),
              /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__actions", children: [
                /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: J, children: "Cancel" }),
                /* @__PURE__ */ c.jsx("button", { type: "submit", className: "btn-primary", disabled: mt, children: re ? "Saving…" : "Save Changes" })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("aside", { className: "campaign-manage__aside", children: [
              /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ c.jsx("h4", { children: "Roster" }),
                Ze.length > 0 ? /* @__PURE__ */ c.jsx("ul", { className: "campaign-manage__list", children: Ze.map((V) => /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: V.name || "Unnamed runner" }),
                  V.role && /* @__PURE__ */ c.jsxs("span", { children: [
                    " — ",
                    V.role
                  ] })
                ] }, V.id)) }) : /* @__PURE__ */ c.jsx("p", { children: "No placeholder runners captured." })
              ] }),
              /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ c.jsx("h4", { children: "Campaign Overview" }),
                /* @__PURE__ */ c.jsxs("dl", { children: [
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Edition" }),
                    /* @__PURE__ */ c.jsx("dd", { children: Dn })
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Creation Method" }),
                    /* @__PURE__ */ c.jsx("dd", { children: qn })
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Gameplay Level" }),
                    /* @__PURE__ */ c.jsx("dd", { children: xn })
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Status" }),
                    /* @__PURE__ */ c.jsx("dd", { children: Y })
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Created" }),
                    /* @__PURE__ */ c.jsx("dd", { children: R_(x.created_at) ?? "Unknown" })
                  ] }),
                  /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Last Updated" }),
                    /* @__PURE__ */ c.jsx("dd", { children: R_(x.updated_at) ?? "Unknown" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ c.jsx("h4", { children: "Source Books" }),
                x.enabled_books.length > 0 ? /* @__PURE__ */ c.jsx("ul", { className: "campaign-manage__list", children: x.enabled_books.map((V) => /* @__PURE__ */ c.jsx("li", { children: /* @__PURE__ */ c.jsx("span", { className: "pill pill--muted", children: V }) }, V)) }) : /* @__PURE__ */ c.jsx("p", { children: "No additional source books enabled." }),
                /* @__PURE__ */ c.jsx("small", { className: "campaign-manage__hint", children: "Book availability is locked after creation for fairness." })
              ] }),
              !gt && /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                  /* @__PURE__ */ c.jsx("h4", { children: "House Rule Snapshot" }),
                  ce.trim() && /* @__PURE__ */ c.jsxs("p", { children: [
                    /* @__PURE__ */ c.jsx("strong", { children: "Theme:" }),
                    " ",
                    ce
                  ] }),
                  En.some(([, V]) => V) ? /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("strong", { children: "Automation:" }),
                    /* @__PURE__ */ c.jsx("ul", { className: "campaign-manage__list", children: En.filter(([, V]) => V).map(([V]) => /* @__PURE__ */ c.jsx("li", { children: ny(V) }, V)) })
                  ] }) : /* @__PURE__ */ c.jsx("p", { children: "No automation modules toggled." }),
                  I.trim() && /* @__PURE__ */ c.jsxs("p", { className: "campaign-manage__notes", children: [
                    /* @__PURE__ */ c.jsx("strong", { children: "Notes:" }),
                    " ",
                    I
                  ] })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                  /* @__PURE__ */ c.jsx("h4", { children: "World Backbone" }),
                  On ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
                    he.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__sublist", children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Factions" }),
                      /* @__PURE__ */ c.jsx("ul", { children: he.map((V) => /* @__PURE__ */ c.jsxs("li", { children: [
                        /* @__PURE__ */ c.jsx("span", { children: V.name || "Unnamed faction" }),
                        V.tags && /* @__PURE__ */ c.jsxs("small", { children: [
                          " · ",
                          V.tags
                        ] }),
                        V.notes && /* @__PURE__ */ c.jsx("p", { children: V.notes })
                      ] }, V.id)) })
                    ] }),
                    ee.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__sublist", children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Locations" }),
                      /* @__PURE__ */ c.jsx("ul", { children: ee.map((V) => /* @__PURE__ */ c.jsxs("li", { children: [
                        /* @__PURE__ */ c.jsx("span", { children: V.name || "Unnamed location" }),
                        V.descriptor && /* @__PURE__ */ c.jsx("p", { children: V.descriptor })
                      ] }, V.id)) })
                    ] })
                  ] }) : /* @__PURE__ */ c.jsx("p", { children: "No factions or locations captured yet." })
                ] }),
                /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                  /* @__PURE__ */ c.jsx("h4", { children: "Session Seed" }),
                  je.skip ? /* @__PURE__ */ c.jsx("p", { children: "Session planning skipped for now." }) : /* @__PURE__ */ c.jsxs("ul", { className: "campaign-manage__list", children: [
                    /* @__PURE__ */ c.jsxs("li", { children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Title:" }),
                      " ",
                      je.title || "Session 0"
                    ] }),
                    je.sceneTemplate && /* @__PURE__ */ c.jsxs("li", { children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Template:" }),
                      " ",
                      je.sceneTemplate
                    ] }),
                    je.objectives && /* @__PURE__ */ c.jsxs("li", { children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Objectives:" }),
                      " ",
                      je.objectives
                    ] }),
                    je.summary && /* @__PURE__ */ c.jsxs("li", { children: [
                      /* @__PURE__ */ c.jsx("strong", { children: "Summary:" }),
                      " ",
                      je.summary
                    ] })
                  ] })
                ] })
              ] }),
              gt && /* @__PURE__ */ c.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ c.jsx("h4", { children: "House Rule Snapshot" }),
                /* @__PURE__ */ c.jsx("p", { children: "House rules are stored as custom JSON. Edit the raw payload above to make changes." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("footer", { className: "campaign-manage__footer", children: [
            /* @__PURE__ */ c.jsx("span", { className: `pill pill--status-${Y.toLowerCase()}`, children: Y }),
            /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: J, children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function jx(x) {
  return x ? x.replace(/[_-]+/g, " ").split(" ").filter(Boolean).map((S) => S.charAt(0).toUpperCase() + S.slice(1)).join(" ") : "";
}
function kx(x) {
  if (!x) return null;
  const S = new Date(x);
  return Number.isNaN(S.getTime()) ? null : new Intl.DateTimeFormat(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(S);
}
function rN(x) {
  if (!x)
    return {
      automation: {},
      factions: [],
      locations: [],
      placeholders: [],
      isValid: !0
    };
  try {
    const S = JSON.parse(x), b = {};
    S.automation && typeof S.automation == "object" && Object.entries(S.automation).forEach(([U, j]) => {
      b[U] = !!j;
    });
    const J = Array.isArray(S.factions) ? S.factions.map((U) => ({
      name: typeof U.name == "string" ? U.name : "",
      tags: typeof U.tags == "string" ? U.tags : void 0,
      notes: typeof U.notes == "string" ? U.notes : void 0
    })) : [], Z = Array.isArray(S.locations) ? S.locations.map((U) => ({
      name: typeof U.name == "string" ? U.name : "",
      descriptor: typeof U.descriptor == "string" ? U.descriptor : void 0
    })) : [], N = Array.isArray(S.placeholders) ? S.placeholders.map((U) => ({
      name: typeof U.name == "string" ? U.name : "",
      role: typeof U.role == "string" ? U.role : void 0
    })) : [], y = S.session_seed, W = y ? {
      title: typeof y.title == "string" ? y.title : void 0,
      objectives: typeof y.objectives == "string" ? y.objectives : void 0,
      sceneTemplate: typeof y.sceneTemplate == "string" ? y.sceneTemplate : void 0,
      summary: typeof y.summary == "string" ? y.summary : void 0,
      skip: !!y.skip
    } : void 0;
    return {
      theme: typeof S.theme == "string" ? S.theme : void 0,
      notes: typeof S.notes == "string" ? S.notes : void 0,
      automation: b,
      factions: J,
      locations: Z,
      placeholders: N,
      sessionSeed: W,
      isValid: !0
    };
  } catch {
    return {
      automation: {},
      factions: [],
      locations: [],
      placeholders: [],
      raw: x,
      isValid: !1
    };
  }
}
function aN({ campaign: x, onClose: S }) {
  var de, z, Y;
  const b = k.useMemo(() => rN(x.house_rules), [x.house_rules]), J = ((de = x.edition) == null ? void 0 : de.toUpperCase()) ?? "SR5", Z = jx(x.creation_method), N = jx(x.gameplay_level ?? ((z = x.gameplay_rules) == null ? void 0 : z.label)), y = kx(x.updated_at), W = kx(x.created_at), U = kx(x.setup_locked_at), j = x.enabled_books ?? [];
  return /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage campaign-view", children: [
    /* @__PURE__ */ c.jsx("div", { className: "campaign-manage__backdrop", "aria-hidden": "true" }),
    /* @__PURE__ */ c.jsxs(
      "section",
      {
        className: "campaign-manage__panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "campaign-view-heading",
        children: [
          /* @__PURE__ */ c.jsx("header", { className: "campaign-manage__header", children: /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("h3", { id: "campaign-view-heading", children: x.name }),
            /* @__PURE__ */ c.jsxs("p", { className: "campaign-manage__subtitle", children: [
              J,
              " · ",
              Z || "Unknown method",
              " · ",
              N || "Gameplay level unset"
            ] })
          ] }) }),
          /* @__PURE__ */ c.jsxs("div", { className: "campaign-manage__body campaign-view__body", children: [
            /* @__PURE__ */ c.jsxs("section", { className: "campaign-view__section", children: [
              /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Summary" }),
              /* @__PURE__ */ c.jsxs("dl", { className: "campaign-view__list", children: [
                /* @__PURE__ */ c.jsxs("div", { children: [
                  /* @__PURE__ */ c.jsx("dt", { children: "Gamemaster" }),
                  /* @__PURE__ */ c.jsx("dd", { children: x.gm_name ?? "—" })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { children: [
                  /* @__PURE__ */ c.jsx("dt", { children: "Edition" }),
                  /* @__PURE__ */ c.jsx("dd", { children: J })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { children: [
                  /* @__PURE__ */ c.jsx("dt", { children: "Creation Method" }),
                  /* @__PURE__ */ c.jsx("dd", { children: Z || "—" })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { children: [
                  /* @__PURE__ */ c.jsx("dt", { children: "Gameplay Level" }),
                  /* @__PURE__ */ c.jsx("dd", { children: N || "—" })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { children: [
                  /* @__PURE__ */ c.jsx("dt", { children: "Status" }),
                  /* @__PURE__ */ c.jsx("dd", { children: x.status ?? "—" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("section", { className: "campaign-view__section", children: [
              /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Timeline" }),
              /* @__PURE__ */ c.jsxs("dl", { className: "campaign-view__list", children: [
                /* @__PURE__ */ c.jsxs("div", { children: [
                  /* @__PURE__ */ c.jsx("dt", { children: "Created" }),
                  /* @__PURE__ */ c.jsx("dd", { children: W ?? "—" })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { children: [
                  /* @__PURE__ */ c.jsx("dt", { children: "Last Updated" }),
                  /* @__PURE__ */ c.jsx("dd", { children: y ?? "—" })
                ] }),
                /* @__PURE__ */ c.jsxs("div", { children: [
                  /* @__PURE__ */ c.jsx("dt", { children: "Setup Locked" }),
                  /* @__PURE__ */ c.jsx("dd", { children: U ?? "Not locked" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("section", { className: "campaign-view__section", children: [
              /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "Enabled Sourcebooks" }),
              j.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "campaign-view__empty", children: "No additional sourcebooks enabled." }) : /* @__PURE__ */ c.jsx("ul", { className: "campaign-view__pill-list", children: j.map((G) => /* @__PURE__ */ c.jsx("li", { className: "pill", children: G }, G)) })
            ] }),
            /* @__PURE__ */ c.jsxs("section", { className: "campaign-view__section", children: [
              /* @__PURE__ */ c.jsx("h4", { className: "campaign-manage__section-title", children: "House Rules" }),
              b.theme && /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Theme:" }),
                " ",
                b.theme
              ] }),
              b.notes && /* @__PURE__ */ c.jsxs("p", { children: [
                /* @__PURE__ */ c.jsx("strong", { children: "Notes:" }),
                " ",
                b.notes
              ] }),
              b.automation && Object.keys(b.automation).length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-view__subsection", children: [
                /* @__PURE__ */ c.jsx("h5", { children: "Automation Toggles" }),
                /* @__PURE__ */ c.jsx("ul", { children: Object.entries(b.automation).map(([G, re]) => /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("span", { className: re ? "campaign-view__badge campaign-view__badge--on" : "campaign-view__badge campaign-view__badge--off", children: re ? "On" : "Off" }),
                  " ",
                  jx(G)
                ] }, G)) })
              ] }),
              b.factions.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-view__subsection", children: [
                /* @__PURE__ */ c.jsx("h5", { children: "Factions" }),
                /* @__PURE__ */ c.jsx("ul", { children: b.factions.map((G, re) => /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: G.name || "Unnamed faction" }),
                  G.tags ? ` — ${G.tags}` : "",
                  G.notes ? ` (${G.notes})` : ""
                ] }, `${G.name}-${re}`)) })
              ] }),
              b.locations.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-view__subsection", children: [
                /* @__PURE__ */ c.jsx("h5", { children: "Locations" }),
                /* @__PURE__ */ c.jsx("ul", { children: b.locations.map((G, re) => /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: G.name || "Unnamed location" }),
                  G.descriptor ? ` — ${G.descriptor}` : ""
                ] }, `${G.name}-${re}`)) })
              ] }),
              b.placeholders.length > 0 && /* @__PURE__ */ c.jsxs("div", { className: "campaign-view__subsection", children: [
                /* @__PURE__ */ c.jsx("h5", { children: "Runner Placeholders" }),
                /* @__PURE__ */ c.jsx("ul", { children: b.placeholders.map((G, re) => /* @__PURE__ */ c.jsxs("li", { children: [
                  /* @__PURE__ */ c.jsx("strong", { children: G.name || "Placeholder" }),
                  G.role ? ` — ${G.role}` : ""
                ] }, `${G.name}-${re}`)) })
              ] }),
              b.sessionSeed && !b.sessionSeed.skip && /* @__PURE__ */ c.jsxs("div", { className: "campaign-view__subsection", children: [
                /* @__PURE__ */ c.jsx("h5", { children: "Session Seed" }),
                /* @__PURE__ */ c.jsxs("dl", { children: [
                  b.sessionSeed.title && /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Title" }),
                    /* @__PURE__ */ c.jsx("dd", { children: b.sessionSeed.title })
                  ] }),
                  b.sessionSeed.objectives && /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Objectives" }),
                    /* @__PURE__ */ c.jsx("dd", { children: b.sessionSeed.objectives })
                  ] }),
                  b.sessionSeed.sceneTemplate && /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Scene Template" }),
                    /* @__PURE__ */ c.jsx("dd", { children: b.sessionSeed.sceneTemplate })
                  ] }),
                  b.sessionSeed.summary && /* @__PURE__ */ c.jsxs("div", { children: [
                    /* @__PURE__ */ c.jsx("dt", { children: "Summary" }),
                    /* @__PURE__ */ c.jsx("dd", { children: b.sessionSeed.summary })
                  ] })
                ] })
              ] }),
              ((Y = b.sessionSeed) == null ? void 0 : Y.skip) && /* @__PURE__ */ c.jsx("p", { className: "campaign-view__empty", children: "Session seed intentionally skipped." }),
              !b.isValid && b.raw && /* @__PURE__ */ c.jsxs("div", { className: "campaign-view__subsection", children: [
                /* @__PURE__ */ c.jsx("h5", { children: "Raw House Rules" }),
                /* @__PURE__ */ c.jsx("pre", { className: "campaign-view__code-block", children: b.raw })
              ] }),
              b.isValid && b.theme === void 0 && b.notes === void 0 && Object.keys(b.automation).length === 0 && b.factions.length === 0 && b.locations.length === 0 && b.placeholders.length === 0 && !b.sessionSeed && /* @__PURE__ */ c.jsx("p", { className: "campaign-view__empty", children: "No additional house rules configured." })
            ] })
          ] }),
          /* @__PURE__ */ c.jsxs("footer", { className: "campaign-view__footer", children: [
            /* @__PURE__ */ c.jsx("span", { className: `pill pill--status-${(x.status ?? "unknown").toLowerCase()}`, children: x.status ?? "Unknown" }),
            /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: S, children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
const iN = "campaigns-list";
async function ry(x, S = {}) {
  const b = new Headers(S.headers || {});
  S.body && !b.has("Content-Type") && b.set("Content-Type", "application/json");
  const J = await fetch(x, {
    ...S,
    headers: b,
    credentials: "include"
  });
  if (!J.ok) {
    const Z = await J.text();
    throw new Error(Z || `Request failed (${J.status})`);
  }
  return J.status === 204 ? {} : await J.json();
}
function lN({ targetId: x = iN }) {
  const [S, b] = k.useState(null), [J, Z] = k.useState([]), [N, y] = k.useState(!1), [W, U] = k.useState(null), [j, de] = k.useState(null), [z, Y] = k.useState(null), [G, re] = k.useState(null), [oe, ye] = k.useState(null), [Ae, le] = k.useState(null), [ke, Ee] = k.useState([]), [ce, me] = k.useState(
    window.ShadowmasterAuth ?? null
  );
  k.useEffect(() => {
    b(document.getElementById(x));
  }, [x]), k.useEffect(() => (document.body.classList.add("react-campaign-enabled"), () => {
    document.body.classList.remove("react-campaign-enabled");
  }), []);
  const I = k.useCallback(async () => {
    y(!0), U(null);
    try {
      const he = await ry("/api/campaigns");
      Z(Array.isArray(he) ? he : []);
    } catch (he) {
      const Be = he instanceof Error ? he.message : "Failed to load campaigns.";
      U(Be), Z([]);
    } finally {
      y(!1);
    }
  }, []), _e = k.useCallback(async () => {
    try {
      const he = await ry("/api/users?role=gamemaster,administrator");
      Ee(Array.isArray(he) ? he : []);
    } catch (he) {
      console.warn("Failed to load gamemaster roster", he), Ee([]);
    }
  }, []);
  k.useEffect(() => {
    I(), _e();
  }, [I, _e]), k.useEffect(() => {
    const he = () => {
      I();
    };
    return window.addEventListener("shadowmaster:campaigns:refresh", he), () => {
      window.removeEventListener("shadowmaster:campaigns:refresh", he);
    };
  }, [I]), k.useEffect(() => (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
    loadCampaigns: () => {
      I();
    }
  }), () => {
    window.ShadowmasterLegacyApp && (window.ShadowmasterLegacyApp.loadCampaigns = void 0);
  }), [I]), k.useEffect(() => {
    const he = (Be) => {
      const ee = Be.detail;
      me(ee ?? null);
    };
    return window.addEventListener("shadowmaster:auth", he), () => {
      window.removeEventListener("shadowmaster:auth", he);
    };
  }, []), k.useEffect(() => {
    if (!z)
      return;
    const he = window.setTimeout(() => Y(null), 4e3);
    return () => window.clearTimeout(he);
  }, [z]);
  const Ue = k.useCallback(
    async (he) => {
      if (!(!he.can_delete && !(ce != null && ce.isAdministrator) || !window.confirm(
        `Delete campaign "${he.name}"? This action cannot be undone.`
      ))) {
        de(null), Y(null), re(he.id);
        try {
          await ry(`/api/campaigns/${he.id}`, { method: "DELETE" }), Y(`Campaign "${he.name}" deleted.`), await I(), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh"));
        } catch (ee) {
          const Oe = ee instanceof Error ? ee.message : "Failed to delete campaign.";
          de(Oe);
        } finally {
          re(null);
        }
      }
    },
    [ce == null ? void 0 : ce.isAdministrator, I]
  ), De = k.useCallback(
    async (he) => {
      if (Ae) {
        de(null), Y(null), re(Ae.id);
        try {
          const Be = JSON.stringify({
            name: he.name,
            gm_name: he.gm_name,
            gm_user_id: he.gm_user_id,
            status: he.status,
            house_rules: he.house_rules,
            enabled_books: he.enabled_books
          }), ee = await ry(`/api/campaigns/${Ae.id}`, {
            method: "PUT",
            body: Be
          });
          Z(
            (Oe) => Oe.map((Ze) => Ze.id === ee.id ? ee : Ze)
          ), Y(`Campaign "${ee.name}" updated.`), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), le(null);
        } catch (Be) {
          const ee = Be instanceof Error ? Be.message : "Failed to update campaign.";
          de(ee);
        } finally {
          re(null);
        }
      }
    },
    [Ae]
  );
  return S ? jl.createPortal(
    /* @__PURE__ */ c.jsxs("section", { className: "campaigns-react-shell", children: [
      z && /* @__PURE__ */ c.jsx("p", { className: "campaigns-table__status", children: z }),
      j && /* @__PURE__ */ c.jsx("p", { className: "campaigns-table__error", children: j }),
      /* @__PURE__ */ c.jsx(
        Zk,
        {
          campaigns: J,
          loading: N,
          error: W,
          onView: (he) => ye(he),
          onEdit: (he) => le(he),
          onDelete: Ue,
          currentUser: ce,
          actionInFlightId: G
        }
      ),
      oe && /* @__PURE__ */ c.jsx(
        aN,
        {
          campaign: oe,
          onClose: () => ye(null)
        }
      ),
      Ae && /* @__PURE__ */ c.jsx(
        nN,
        {
          campaign: Ae,
          gmUsers: ke,
          gameplayRules: Ae.gameplay_rules,
          onClose: () => le(null),
          onSave: De
        }
      )
    ] }),
    S
  ) : null;
}
const iy = [
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
function oN() {
  const x = window.location.hash.replace("#", "").toLowerCase(), S = iy.find((b) => b.key === x);
  return (S == null ? void 0 : S.key) ?? "characters";
}
function sN(x) {
  k.useEffect(() => {
    iy.forEach(({ key: S, targetId: b }) => {
      const J = document.getElementById(b);
      J && (S === x ? (J.removeAttribute("hidden"), J.classList.add("main-tab-panel--active"), J.style.display = "", J.setAttribute("data-active-tab", S)) : (J.setAttribute("hidden", "true"), J.classList.remove("main-tab-panel--active"), J.style.display = "none", J.removeAttribute("data-active-tab")));
    });
  }, [x]);
}
function uN() {
  const [x, S] = k.useState(null), [b, J] = k.useState(() => oN());
  k.useEffect(() => {
    S(document.getElementById("main-navigation-root"));
  }, []), sN(b), k.useEffect(() => {
    window.history.replaceState(null, "", `#${b}`);
  }, [b]);
  const Z = k.useMemo(
    () => {
      var N;
      return ((N = iy.find((y) => y.key === b)) == null ? void 0 : N.description) ?? "";
    },
    [b]
  );
  return x ? jl.createPortal(
    /* @__PURE__ */ c.jsxs("nav", { className: "main-tabs", role: "tablist", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ c.jsx("div", { className: "main-tabs__list", children: iy.map((N) => {
        const y = N.key === b;
        return /* @__PURE__ */ c.jsx(
          "button",
          {
            role: "tab",
            id: `tab-${N.key}`,
            "aria-selected": y,
            "aria-controls": N.targetId,
            className: `main-tabs__tab${y ? " main-tabs__tab--active" : ""}`,
            onClick: () => J(N.key),
            type: "button",
            children: N.label
          },
          N.key
        );
      }) }),
      /* @__PURE__ */ c.jsx("p", { className: "main-tabs__summary", role: "status", children: Z })
    ] }),
    x
  ) : null;
}
const co = ["magic", "metatype", "attributes", "skills", "resources"], fc = ["A", "B", "C", "D", "E"], cN = {
  magic: "Magic",
  metatype: "Metatype",
  attributes: "Attributes",
  skills: "Skills",
  resources: "Resources"
};
function z_(x) {
  return cN[x];
}
function F_(x, S) {
  var J;
  const b = (J = x == null ? void 0 : x.priorities) == null ? void 0 : J[S];
  return b ? fc.map((Z) => {
    const N = b[Z] ?? { label: `Priority ${Z}` };
    return { code: Z, option: N };
  }) : fc.map((Z) => ({
    code: Z,
    option: { label: `Priority ${Z}` }
  }));
}
function fN() {
  return {
    magic: "",
    metatype: "",
    attributes: "",
    skills: "",
    resources: ""
  };
}
function P_(x) {
  return co.reduce((S, b) => {
    const J = x[b];
    return J && S.push(J), S;
  }, []);
}
function k_(x) {
  const S = new Set(P_(x));
  return fc.filter((b) => !S.has(b));
}
function dN(x) {
  return P_(x).length === fc.length;
}
function H_(x) {
  return x ? x.summary || x.description || x.label || "" : "Drag a priority letter from the pool into this category.";
}
function pN(x) {
  if (!x)
    return "";
  const S = x.toLowerCase().trim().replace(/[\s-]+/g, "_");
  switch (S) {
    case "sumtotten":
    case "sum2ten":
    case "sum_to10":
      return "sum_to_ten";
    case "point_buy":
    case "pointbuy":
      return "karma";
    default:
      return S;
  }
}
function B_(x) {
  return Object.fromEntries(
    Object.entries(x).map(([S, b]) => [S, b || null])
  );
}
function V_() {
  var J, Z;
  const x = fN();
  if (typeof window > "u")
    return x;
  const S = (Z = (J = window.ShadowmasterLegacyApp) == null ? void 0 : J.getPriorities) == null ? void 0 : Z.call(J);
  if (!S)
    return x;
  const b = { ...x };
  for (const N of co) {
    const y = S[N];
    typeof y == "string" && y.length === 1 && (b[N] = y);
  }
  return b;
}
function N_() {
  const x = V_();
  return co.some((b) => x[b]) || (x.magic = "A", x.metatype = "B", x.attributes = "C", x.skills = "D", x.resources = "E"), x;
}
function mN() {
  const {
    characterCreationData: x,
    activeEdition: S,
    isLoading: b,
    error: J,
    campaignGameplayRules: Z,
    campaignLoading: N,
    campaignError: y,
    campaignCreationMethod: W
  } = Xf(), U = k.useMemo(
    () => (x == null ? void 0 : x.creation_methods) ?? {},
    [x == null ? void 0 : x.creation_methods]
  ), j = k.useMemo(() => {
    const de = pN(W);
    if (de && U[de])
      return de;
    if (U.priority)
      return "priority";
    const z = Object.keys(U);
    return z.length > 0 ? z[0] : "priority";
  }, [W, U]);
  return j === "sum_to_ten" && U.sum_to_ten ? /* @__PURE__ */ c.jsx(
    yN,
    {
      characterCreationData: x,
      creationMethod: U.sum_to_ten,
      activeEditionLabel: S.label,
      isLoading: b,
      error: J,
      campaignGameplayRules: Z,
      campaignLoading: N,
      campaignError: y
    }
  ) : j === "karma" && U.karma ? /* @__PURE__ */ c.jsx(
    gN,
    {
      characterCreationData: x,
      creationMethod: U.karma,
      activeEditionLabel: S.label,
      isLoading: b,
      error: J,
      campaignGameplayRules: Z,
      campaignLoading: N,
      campaignError: y
    }
  ) : /* @__PURE__ */ c.jsx(
    hN,
    {
      characterCreationData: x,
      activeEditionLabel: S.label,
      isLoading: b,
      error: J,
      campaignGameplayRules: Z,
      campaignLoading: N,
      campaignError: y
    }
  );
}
function hN({
  characterCreationData: x,
  activeEditionLabel: S,
  isLoading: b,
  error: J,
  campaignGameplayRules: Z,
  campaignLoading: N,
  campaignError: y
}) {
  const [W, U] = k.useState(() => V_()), [j, de] = k.useState(null), z = k.useRef({});
  k.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), k.useEffect(() => {
    var I, _e;
    (_e = (I = window.ShadowmasterLegacyApp) == null ? void 0 : I.setPriorities) == null || _e.call(I, B_(W));
  }, [W]);
  const Y = k.useMemo(() => k_(W), [W]), G = dN(W);
  function re(I) {
    U((_e) => {
      const Ue = { ..._e };
      for (const De of co)
        Ue[De] === I && (Ue[De] = "");
      return Ue;
    });
  }
  function oe(I, _e) {
    _e.dataTransfer.effectAllowed = "move", de({ source: "pool", priority: I }), _e.dataTransfer.setData("text/plain", I);
  }
  function ye(I, _e, Ue) {
    Ue.dataTransfer.effectAllowed = "move", de({ source: "dropzone", category: I, priority: _e }), Ue.dataTransfer.setData("text/plain", _e);
  }
  function Ae() {
    de(null);
  }
  function le(I, _e) {
    _e.preventDefault();
    const Ue = _e.dataTransfer.getData("text/plain") || (j == null ? void 0 : j.priority) || "";
    if (!Ue) {
      Ae();
      return;
    }
    U((De) => {
      const he = { ...De };
      for (const Be of co)
        he[Be] === Ue && (he[Be] = "");
      return he[I] = Ue, he;
    }), Ae();
  }
  function ke(I, _e) {
    _e.preventDefault();
    const Ue = z.current[I];
    Ue && Ue.classList.add("active");
  }
  function Ee(I) {
    const _e = z.current[I];
    _e && _e.classList.remove("active");
  }
  function ce(I) {
    const _e = z.current[I];
    _e && _e.classList.remove("active");
  }
  function me(I) {
    const _e = Y[0];
    if (!_e) {
      re(I);
      return;
    }
    U((Ue) => {
      const De = { ...Ue };
      for (const he of co)
        De[he] === I && (De[he] = "");
      return De[_e] = I, De;
    });
  }
  return /* @__PURE__ */ c.jsxs("div", { className: "react-priority-wrapper", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Priority Assignment — ",
        /* @__PURE__ */ c.jsx("strong", { children: S })
      ] }),
      /* @__PURE__ */ c.jsx("span", { children: y ? `Campaign defaults unavailable: ${y}` : N ? "Applying campaign defaults…" : b ? "Loading priority data…" : J ? `Error: ${J}` : "Drag letters into categories" })
    ] }),
    Z && /* @__PURE__ */ c.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ c.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        Z.label
      ] }),
      Z.description && /* @__PURE__ */ c.jsx("p", { children: Z.description })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "react-priority-layout", children: [
      /* @__PURE__ */ c.jsxs("aside", { className: "react-priority-pool", children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Available Priorities" }),
        /* @__PURE__ */ c.jsx(
          "div",
          {
            className: "react-priority-dropzone",
            onDragOver: (I) => {
              I.preventDefault(), de((_e) => _e && { ..._e, category: void 0 });
            },
            onDrop: (I) => {
              I.preventDefault();
              const _e = I.dataTransfer.getData("text/plain") || (j == null ? void 0 : j.priority) || "";
              _e && re(_e), Ae();
            },
            children: /* @__PURE__ */ c.jsx("div", { className: "react-priority-chips", children: fc.map((I) => {
              const _e = !k_(W).includes(I), Ue = (j == null ? void 0 : j.priority) === I && j.source === "pool";
              return /* @__PURE__ */ c.jsx(
                "div",
                {
                  className: `react-priority-chip ${_e ? "used" : ""} ${Ue ? "dragging" : ""}`,
                  draggable: !_e,
                  onDragStart: (De) => !_e && oe(I, De),
                  onDragEnd: Ae,
                  onClick: () => me(I),
                  role: "button",
                  tabIndex: _e ? -1 : 0,
                  onKeyDown: (De) => {
                    !_e && (De.key === "Enter" || De.key === " ") && (De.preventDefault(), me(I));
                  },
                  children: I
                },
                I
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ c.jsx("section", { className: "react-priority-dropzones", children: co.map((I) => {
        const _e = z_(I), Ue = F_(x, I), De = W[I], he = Ue.find((ee) => ee.code === De), Be = (j == null ? void 0 : j.source) === "dropzone" && j.category === I;
        return /* @__PURE__ */ c.jsxs(
          "div",
          {
            ref: (ee) => {
              z.current[I] = ee;
            },
            className: `react-priority-dropzone ${De ? "filled" : ""}`,
            onDragOver: (ee) => ke(I, ee),
            onDragLeave: () => Ee(I),
            onDrop: (ee) => {
              le(I, ee), ce(I);
            },
            children: [
              /* @__PURE__ */ c.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ c.jsx("span", { children: _e }),
                De && /* @__PURE__ */ c.jsxs("span", { children: [
                  De,
                  " — ",
                  (he == null ? void 0 : he.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ c.jsx("div", { className: "react-priority-description", children: H_(he == null ? void 0 : he.option) }),
              De ? /* @__PURE__ */ c.jsx(
                "div",
                {
                  className: `react-priority-chip ${Be ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (ee) => ye(I, De, ee),
                  onDragEnd: Ae,
                  onDoubleClick: () => re(De),
                  children: De
                }
              ) : /* @__PURE__ */ c.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          I
        );
      }) })
    ] }),
    /* @__PURE__ */ c.jsx(
      "div",
      {
        className: `react-priority-status ${G ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: G ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${Y.join(", ")}`
      }
    )
  ] });
}
const vN = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  E: 0
};
function yN({
  characterCreationData: x,
  creationMethod: S,
  activeEditionLabel: b,
  isLoading: J,
  error: Z,
  campaignGameplayRules: N,
  campaignLoading: y,
  campaignError: W
}) {
  const [U, j] = k.useState(() => N_());
  k.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), k.useEffect(() => {
    var Ee, ce;
    (ce = (Ee = window.ShadowmasterLegacyApp) == null ? void 0 : Ee.setPriorities) == null || ce.call(Ee, B_(U));
  }, [U]);
  const de = k.useMemo(() => {
    const Ee = { ...vN };
    return fc.forEach((ce) => {
      var I;
      const me = (I = S.priority_costs) == null ? void 0 : I[ce];
      typeof me == "number" && (Ee[ce] = me);
    }), Ee;
  }, [S.priority_costs]), z = S.point_budget ?? 10, Y = k.useMemo(() => co.reduce((Ee, ce) => {
    const me = U[ce];
    return Ee + (me ? de[me] ?? 0 : 0);
  }, 0), [U, de]), G = z - Y, re = k.useMemo(
    () => co.every((Ee) => !!U[Ee]),
    [U]
  ), oe = re && G === 0 ? "success" : G < 0 ? "error" : "warning", ye = re ? G > 0 ? `Spend the remaining ${G} point${G === 1 ? "" : "s"}.` : G < 0 ? `Over budget by ${Math.abs(G)} point${Math.abs(G) === 1 ? "" : "s"}.` : "✓ All priorities assigned. You can proceed to metatype selection." : "Select a priority letter for each category.";
  function Ae(Ee, ce) {
    j((me) => ({
      ...me,
      [Ee]: ce
    }));
  }
  function le(Ee, ce) {
    const me = ce.target.value, I = me ? me.toUpperCase() : "";
    Ae(Ee, I);
  }
  function ke() {
    j(N_());
  }
  return /* @__PURE__ */ c.jsxs("div", { className: "react-priority-wrapper sum-to-ten-wrapper", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Sum-to-Ten Assignment — ",
        /* @__PURE__ */ c.jsx("strong", { children: b })
      ] }),
      /* @__PURE__ */ c.jsx("span", { children: W ? `Campaign defaults unavailable: ${W}` : y ? "Applying campaign defaults…" : J ? "Loading priority data…" : Z ? `Error: ${Z}` : "Allocate priorities until you spend all points." })
    ] }),
    S.description && /* @__PURE__ */ c.jsx("p", { className: "sum-to-ten-description", children: S.description }),
    N && /* @__PURE__ */ c.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ c.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        N.label
      ] }),
      N.description && /* @__PURE__ */ c.jsx("p", { children: N.description })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "sum-to-ten-grid", children: co.map((Ee) => {
      const ce = z_(Ee), me = F_(x, Ee), I = U[Ee], _e = me.find((De) => De.code === I), Ue = I ? de[I] ?? 0 : 0;
      return /* @__PURE__ */ c.jsxs("div", { className: "sum-to-ten-card", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "sum-to-ten-card__header", children: [
          /* @__PURE__ */ c.jsx("span", { children: ce }),
          I && /* @__PURE__ */ c.jsxs("span", { children: [
            I,
            " · ",
            Ue,
            " pts"
          ] })
        ] }),
        /* @__PURE__ */ c.jsxs("select", { value: I, onChange: (De) => le(Ee, De), children: [
          /* @__PURE__ */ c.jsx("option", { value: "", children: "Select priority" }),
          fc.map((De) => {
            const he = me.find((ee) => ee.code === De), Be = de[De] ?? 0;
            return /* @__PURE__ */ c.jsx("option", { value: De, children: `${De} (${Be} pts) — ${(he == null ? void 0 : he.option.label) ?? `Priority ${De}`}` }, De);
          })
        ] }),
        /* @__PURE__ */ c.jsx("div", { className: "sum-to-ten-card__summary", children: H_(_e == null ? void 0 : _e.option) }),
        I && /* @__PURE__ */ c.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-link sum-to-ten-clear",
            onClick: () => Ae(Ee, ""),
            children: "Clear selection"
          }
        )
      ] }, Ee);
    }) }),
    /* @__PURE__ */ c.jsx(
      "div",
      {
        className: `react-priority-status sum-to-ten-status ${oe}`,
        role: "status",
        "aria-live": "polite",
        children: ye
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "sum-to-ten-footer", children: [
      /* @__PURE__ */ c.jsxs("span", { className: "sum-to-ten-metrics", children: [
        "Spent ",
        Y,
        " / ",
        z,
        " points"
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "sum-to-ten-actions", children: /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn btn-secondary", onClick: ke, children: "Reset to default" }) })
    ] })
  ] });
}
const om = [
  { key: "attributes", label: "Attributes" },
  { key: "skills", label: "Skills" },
  { key: "qualities", label: "Qualities" },
  { key: "gear", label: "Gear & Lifestyle" },
  { key: "contacts", label: "Contacts" },
  { key: "other", label: "Other" }
];
function gN({
  characterCreationData: x,
  creationMethod: S,
  activeEditionLabel: b,
  isLoading: J,
  error: Z,
  campaignGameplayRules: N,
  campaignLoading: y,
  campaignError: W
}) {
  var Ue, De, he, Be;
  const U = k.useMemo(() => ((x == null ? void 0 : x.metatypes) ?? []).map((Oe) => ({
    value: Oe.id,
    label: Oe.name
  })), [x == null ? void 0 : x.metatypes]), [j, de] = k.useState(() => {
    var ee;
    return ((ee = U[0]) == null ? void 0 : ee.value) ?? "";
  }), [z, Y] = k.useState(
    () => om.reduce((ee, Oe) => (ee[Oe.key] = 0, ee), {})
  );
  k.useEffect(() => {
    var Oe;
    const ee = ((Oe = U[0]) == null ? void 0 : Oe.value) ?? "";
    de((Ze) => Ze || ee);
  }, [U]), k.useEffect(() => {
    var Oe, Ze;
    const ee = om.map(({ key: lt, label: je }) => ({
      category: lt,
      label: je,
      karma: z[lt] ?? 0
    }));
    (Ze = (Oe = window.ShadowmasterLegacyApp) == null ? void 0 : Oe.setKarmaPointBuy) == null || Ze.call(Oe, {
      metatype_id: j,
      entries: ee
    });
  }, [z, j]);
  const G = S.karma_budget ?? 800, re = ((De = S.metatype_costs) == null ? void 0 : De[((Ue = j == null ? void 0 : j.toLowerCase) == null ? void 0 : Ue.call(j)) ?? ""]) ?? ((he = S.metatype_costs) == null ? void 0 : he.human) ?? 0, oe = re + om.reduce((ee, Oe) => ee + (z[Oe.key] ?? 0), 0), ye = G - oe, Ae = z.gear ?? 0, le = ((Be = S.gear_conversion) == null ? void 0 : Be.max_karma_for_gear) ?? null, ke = le !== null && Ae > le;
  let Ee = "warning";
  ye === 0 ? Ee = "success" : ye < 0 && (Ee = "error");
  const ce = ye === 0 ? "✓ All Karma allocated. Review the remaining steps, then proceed." : ye < 0 ? `Over budget by ${Math.abs(ye)} Karma. Adjust your selections.` : `Spend the remaining ${ye} Karma before finalizing.`;
  function me(ee, Oe) {
    const Ze = Number.parseInt(Oe.target.value, 10);
    Y((lt) => ({
      ...lt,
      [ee]: Number.isNaN(Ze) || Ze < 0 ? 0 : Ze
    }));
  }
  function I(ee) {
    de(ee.target.value);
  }
  function _e() {
    Y(
      om.reduce((ee, Oe) => (ee[Oe.key] = 0, ee), {})
    ), U[0] && de(U[0].value);
  }
  return /* @__PURE__ */ c.jsxs("div", { className: "react-priority-wrapper karma-wrapper", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Karma Point-Buy — ",
        /* @__PURE__ */ c.jsx("strong", { children: b })
      ] }),
      /* @__PURE__ */ c.jsx("span", { children: W ? `Campaign defaults unavailable: ${W}` : y ? "Applying campaign defaults…" : J ? "Loading karma data…" : Z ? `Error: ${Z}` : "Allocate your Karma budget before moving on." })
    ] }),
    S.description && /* @__PURE__ */ c.jsx("p", { className: "karma-description", children: S.description }),
    S.notes && S.notes.length > 0 && /* @__PURE__ */ c.jsx("ul", { className: "karma-notes", children: S.notes.map((ee) => /* @__PURE__ */ c.jsx("li", { children: ee }, ee)) }),
    N && /* @__PURE__ */ c.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ c.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        N.label
      ] }),
      N.description && /* @__PURE__ */ c.jsx("p", { children: N.description })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "karma-grid", children: [
      /* @__PURE__ */ c.jsxs("section", { className: "karma-panel", children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Metatype" }),
        /* @__PURE__ */ c.jsxs("label", { className: "karma-field", children: [
          /* @__PURE__ */ c.jsx("span", { children: "Choose metatype" }),
          /* @__PURE__ */ c.jsx("select", { value: j, onChange: I, children: U.map((ee) => {
            var Ze, lt, je, Se;
            const Oe = ((je = S.metatype_costs) == null ? void 0 : je[((lt = (Ze = ee.value).toLowerCase) == null ? void 0 : lt.call(Ze)) ?? ""]) ?? ((Se = S.metatype_costs) == null ? void 0 : Se.human) ?? 0;
            return /* @__PURE__ */ c.jsxs("option", { value: ee.value, children: [
              ee.label,
              " (",
              Oe,
              " Karma)"
            ] }, ee.value);
          }) })
        ] }),
        /* @__PURE__ */ c.jsxs("p", { className: "karma-info", children: [
          "Metatype cost: ",
          /* @__PURE__ */ c.jsxs("strong", { children: [
            re,
            " Karma"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ c.jsxs("section", { className: "karma-panel", children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Karma Ledger" }),
        /* @__PURE__ */ c.jsx("div", { className: "karma-ledger", children: om.map(({ key: ee, label: Oe }) => {
          const Ze = z[ee] ?? 0, lt = ee === "gear" && le !== null ? ` (max ${le} Karma)` : "";
          return /* @__PURE__ */ c.jsxs("label", { className: "karma-field karma-ledger-row", children: [
            /* @__PURE__ */ c.jsxs("span", { children: [
              Oe,
              lt
            ] }),
            /* @__PURE__ */ c.jsx(
              "input",
              {
                type: "number",
                min: 0,
                step: 5,
                value: Ze,
                onChange: (je) => me(ee, je)
              }
            )
          ] }, ee);
        }) })
      ] }),
      /* @__PURE__ */ c.jsxs("section", { className: "karma-panel karma-summary", children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Budget Summary" }),
        /* @__PURE__ */ c.jsxs("dl", { children: [
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("dt", { children: "Karma budget" }),
            /* @__PURE__ */ c.jsx("dd", { children: G })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("dt", { children: "Metatype cost" }),
            /* @__PURE__ */ c.jsx("dd", { children: re })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("dt", { children: "Ledger spend" }),
            /* @__PURE__ */ c.jsx("dd", { children: oe - re })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("dt", { children: "Total spent" }),
            /* @__PURE__ */ c.jsx("dd", { children: oe })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("dt", { children: "Remaining" }),
            /* @__PURE__ */ c.jsx("dd", { children: ye })
          ] })
        ] }),
        ke && /* @__PURE__ */ c.jsxs("p", { className: "karma-warning", children: [
          "Gear conversion exceeds the campaign limit of ",
          le,
          " Karma. Adjust your allocation."
        ] }),
        /* @__PURE__ */ c.jsx("p", { className: "karma-hint", children: "Remember: Only one Physical and one Mental attribute may start at their natural maximum. Attribute purchases should respect metatype caps." })
      ] })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: `react-priority-status karma-status ${Ee}`, role: "status", "aria-live": "polite", children: ce }),
    /* @__PURE__ */ c.jsxs("div", { className: "karma-footer", children: [
      /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn btn-secondary", onClick: _e, children: "Reset allocations" }),
      /* @__PURE__ */ c.jsx(
        "button",
        {
          type: "button",
          className: "btn btn-link",
          onClick: () => {
            var ee, Oe;
            return (Oe = (ee = window.ShadowmasterLegacyApp) == null ? void 0 : ee.showLegacyKarmaWizard) == null ? void 0 : Oe.call(ee);
          },
          children: "Open legacy point-buy wizard"
        }
      )
    ] })
  ] });
}
const SN = {
  body: "Body",
  quickness: "Quickness",
  strength: "Strength",
  charisma: "Charisma",
  intelligence: "Intelligence",
  willpower: "Willpower"
};
function xN(x, S) {
  if (!x)
    return [];
  const b = S || "E";
  return x.metatypes.map((J) => {
    var Z;
    return {
      ...J,
      priorityAllowed: ((Z = J.priority_tiers) == null ? void 0 : Z.includes(b)) ?? !1
    };
  }).filter((J) => J.priorityAllowed);
}
function EN(x) {
  return x === 0 ? "+0" : x > 0 ? `+${x}` : `${x}`;
}
function bN(x) {
  const S = x.toLowerCase();
  return SN[S] ?? x;
}
function CN({ priority: x, selectedMetatype: S, onSelect: b }) {
  const { characterCreationData: J, isLoading: Z, error: N, activeEdition: y } = Xf();
  k.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const W = k.useMemo(() => {
    var re;
    const z = ((re = x == null ? void 0 : x.toUpperCase) == null ? void 0 : re.call(x)) ?? "", G = ["A", "B", "C", "D", "E"].includes(z) ? z : "";
    return xN(J, G);
  }, [J, x]), U = !!S, j = () => {
    var z, Y;
    (Y = (z = window.ShadowmasterLegacyApp) == null ? void 0 : z.showWizardStep) == null || Y.call(z, 1);
  }, de = () => {
    var z, Y;
    S && ((Y = (z = window.ShadowmasterLegacyApp) == null ? void 0 : z.showWizardStep) == null || Y.call(z, 3));
  };
  return Z ? /* @__PURE__ */ c.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : N ? /* @__PURE__ */ c.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    N
  ] }) : W.length ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ c.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Priority: ",
        x || "—"
      ] })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "react-metatype-grid", children: W.map((z) => /* @__PURE__ */ c.jsxs(
      "article",
      {
        className: `react-metatype-card ${S === z.id ? "selected" : ""}`,
        onClick: () => b(z.id),
        children: [
          /* @__PURE__ */ c.jsx("h4", { children: z.name }),
          /* @__PURE__ */ c.jsxs("section", { className: "react-metatype-modifiers", children: [
            /* @__PURE__ */ c.jsx("strong", { children: "Attribute Modifiers" }),
            (() => {
              const Y = z.attribute_modifiers ? Object.entries(z.attribute_modifiers).filter(([, G]) => G !== 0) : [];
              return Y.length === 0 ? /* @__PURE__ */ c.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : Y.map(([G, re]) => /* @__PURE__ */ c.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ c.jsx("span", { children: bN(G) }),
                /* @__PURE__ */ c.jsx("span", { className: re > 0 ? "positive" : "negative", children: EN(re) })
              ] }, G));
            })()
          ] }),
          y.key === "sr5" && z.special_attribute_points && Object.keys(z.special_attribute_points).length > 0 && /* @__PURE__ */ c.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ c.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(z.special_attribute_points).map(([Y, G]) => /* @__PURE__ */ c.jsx("div", { className: "ability", children: /* @__PURE__ */ c.jsxs("span", { children: [
              "Priority ",
              Y,
              ": ",
              G
            ] }) }, Y))
          ] }),
          z.abilities && z.abilities.length > 0 && /* @__PURE__ */ c.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ c.jsx("strong", { children: "Special Abilities" }),
            z.abilities.map((Y, G) => /* @__PURE__ */ c.jsx("div", { className: "ability", children: /* @__PURE__ */ c.jsx("span", { children: Y }) }, G))
          ] }),
          (!z.abilities || z.abilities.length === 0) && /* @__PURE__ */ c.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ c.jsx("strong", { children: "Special Abilities" }),
            /* @__PURE__ */ c.jsx("div", { className: "ability", children: /* @__PURE__ */ c.jsx("span", { children: "No inherent metatype abilities." }) })
          ] })
        ]
      },
      z.id
    )) }),
    /* @__PURE__ */ c.jsxs("div", { className: "react-metatype-footer", children: [
      /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn btn-secondary", onClick: j, children: "Back" }),
      /* @__PURE__ */ c.jsx("div", { className: `react-metatype-status ${U ? "ready" : ""}`, children: U ? "Metatype selected. Continue to magic." : "Select a metatype to continue." }),
      /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn btn-primary", disabled: !U, onClick: de, children: "Next: Choose Magical Abilities" })
    ] })
  ] }) : /* @__PURE__ */ c.jsx("p", { className: "react-metatype-status", children: "No metatypes available for this priority." });
}
const _N = ["Hermetic", "Shamanic"], wN = [
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
function TN(x) {
  return (x || "").toUpperCase();
}
function RN({ priority: x, selection: S, onChange: b }) {
  var G;
  const { characterCreationData: J, activeEdition: Z } = Xf(), N = TN(x), y = ((G = J == null ? void 0 : J.priorities) == null ? void 0 : G.magic) ?? null, W = k.useMemo(() => y && y[N] || null, [y, N]);
  k.useEffect(() => (document.body.classList.add("react-magic-enabled"), () => {
    document.body.classList.remove("react-magic-enabled");
  }), []), k.useEffect(() => {
    if (!N) {
      (S.type !== "Mundane" || S.tradition || S.totem) && b({ type: "Mundane", tradition: null, totem: null });
      return;
    }
    if (N === "A") {
      const re = S.tradition ?? "Hermetic", oe = re === "Shamanic" ? S.totem : null;
      (S.type !== "Full Magician" || S.tradition !== re || S.totem !== oe) && b({ type: "Full Magician", tradition: re, totem: oe });
    } else if (N === "B") {
      let re = S.type;
      S.type !== "Adept" && S.type !== "Aspected Magician" && (re = "Adept");
      let oe = S.tradition, ye = S.totem;
      re === "Aspected Magician" ? (oe = oe ?? "Hermetic", oe !== "Shamanic" && (ye = null)) : (oe = null, ye = null), (S.type !== re || S.tradition !== oe || S.totem !== ye) && b({ type: re, tradition: oe, totem: ye });
    } else
      (S.type !== "Mundane" || S.tradition || S.totem) && b({ type: "Mundane", tradition: null, totem: null });
  }, [N]);
  const U = (re) => {
    const oe = {
      type: re.type !== void 0 ? re.type : S.type,
      tradition: re.tradition !== void 0 ? re.tradition : S.tradition,
      totem: re.totem !== void 0 ? re.totem : S.totem
    };
    oe.type !== "Full Magician" && oe.type !== "Aspected Magician" && (oe.tradition = null, oe.totem = null), oe.tradition !== "Shamanic" && (oe.totem = null), !(oe.type === S.type && oe.tradition === S.tradition && oe.totem === S.totem) && b(oe);
  }, j = () => !N || ["C", "D", "E", ""].includes(N) ? /* @__PURE__ */ c.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ c.jsxs(
    "article",
    {
      className: `react-magic-card ${S.type === "Mundane" ? "selected" : ""}`,
      onClick: () => U({ type: "Mundane", tradition: null, totem: null }),
      children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Mundane" }),
        /* @__PURE__ */ c.jsx("p", { children: "No magical ability. Magic Rating 0." })
      ]
    }
  ) }) : N === "A" ? /* @__PURE__ */ c.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ c.jsxs(
    "article",
    {
      className: `react-magic-card ${S.type === "Full Magician" ? "selected" : ""}`,
      onClick: () => U({ type: "Full Magician" }),
      children: [
        /* @__PURE__ */ c.jsx("h4", { children: "Full Magician" }),
        /* @__PURE__ */ c.jsx("p", { children: "Magic Rating 6. Spell Points 25." }),
        /* @__PURE__ */ c.jsx("p", { children: "Must choose a magical tradition." })
      ]
    }
  ) }) : N === "B" ? /* @__PURE__ */ c.jsxs("div", { className: "react-magic-grid", children: [
    /* @__PURE__ */ c.jsxs(
      "article",
      {
        className: `react-magic-card ${S.type === "Adept" ? "selected" : ""}`,
        onClick: () => U({ type: "Adept", tradition: null, totem: null }),
        children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Adept" }),
          /* @__PURE__ */ c.jsx("p", { children: "Magic Rating 4. Gain Power Points for physical enhancements." })
        ]
      }
    ),
    /* @__PURE__ */ c.jsxs(
      "article",
      {
        className: `react-magic-card ${S.type === "Aspected Magician" ? "selected" : ""}`,
        onClick: () => U({ type: "Aspected Magician" }),
        children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Aspected Magician" }),
          /* @__PURE__ */ c.jsx("p", { children: "Magic Rating 4. Specializes in a single tradition aspect." }),
          /* @__PURE__ */ c.jsx("p", { children: "Must choose a magical tradition." })
        ]
      }
    )
  ] }) : null, de = () => !S.type || !["Full Magician", "Aspected Magician"].includes(S.type) ? null : /* @__PURE__ */ c.jsxs("div", { className: "react-magic-traditions", children: [
    /* @__PURE__ */ c.jsx("strong", { children: "Tradition" }),
    /* @__PURE__ */ c.jsx("div", { className: "tradition-options", children: _N.map((re) => /* @__PURE__ */ c.jsxs("label", { className: `tradition-option ${S.tradition === re ? "selected" : ""}`, children: [
      /* @__PURE__ */ c.jsx(
        "input",
        {
          type: "radio",
          name: "react-tradition",
          value: re,
          checked: S.tradition === re,
          onChange: () => U({ tradition: re })
        }
      ),
      /* @__PURE__ */ c.jsx("span", { children: re })
    ] }, re)) })
  ] }), z = () => S.tradition !== "Shamanic" ? null : /* @__PURE__ */ c.jsxs("div", { className: "react-magic-totems", children: [
    /* @__PURE__ */ c.jsx("strong", { children: "Select Totem" }),
    /* @__PURE__ */ c.jsx("div", { className: "totem-grid", children: wN.map((re) => /* @__PURE__ */ c.jsxs(
      "article",
      {
        className: `totem-card ${S.totem === re.id ? "selected" : ""}`,
        onClick: () => U({ totem: re.id }),
        children: [
          /* @__PURE__ */ c.jsx("h5", { children: re.name }),
          /* @__PURE__ */ c.jsx("p", { children: re.description }),
          /* @__PURE__ */ c.jsx("ul", { children: re.notes.map((oe) => /* @__PURE__ */ c.jsx("li", { children: oe }, oe)) })
        ]
      },
      re.id
    )) })
  ] }), Y = () => {
    if (!S.type)
      return /* @__PURE__ */ c.jsx("p", { className: "react-magic-status", children: "Select a magical path to proceed." });
    if (S.type === "Full Magician" || S.type === "Aspected Magician") {
      if (!S.tradition)
        return /* @__PURE__ */ c.jsx("p", { className: "react-magic-status", children: "Choose a tradition to continue." });
      if (S.tradition === "Shamanic" && !S.totem)
        return /* @__PURE__ */ c.jsx("p", { className: "react-magic-status", children: "Select a totem for your shamanic path." });
    }
    return /* @__PURE__ */ c.jsx("p", { className: "react-magic-status ready", children: "Magical abilities ready. Continue to Attributes." });
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "react-magic-wrapper", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "react-magic-header", children: [
      /* @__PURE__ */ c.jsx("span", { children: "Magical Abilities" }),
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Priority ",
        N || "—",
        " ",
        W != null && W.summary ? `— ${W.summary}` : ""
      ] })
    ] }),
    j(),
    de(),
    z(),
    Y(),
    /* @__PURE__ */ c.jsx("footer", { className: "react-magic-footer", children: /* @__PURE__ */ c.jsxs("small", { children: [
      "Edition: ",
      Z.label
    ] }) })
  ] });
}
function jN({ targetId: x = "campaign-dashboard-root", campaign: S, onClose: b }) {
  var j, de, z;
  const [J, Z] = k.useState(null);
  k.useEffect(() => {
    Z(document.getElementById(x));
  }, [x]);
  const N = k.useMemo(() => {
    if (!(S != null && S.house_rules))
      return {};
    try {
      return JSON.parse(S.house_rules);
    } catch (Y) {
      return console.warn("Failed to parse campaign house rules payload", Y), {};
    }
  }, [S == null ? void 0 : S.house_rules]);
  if (!J || !S)
    return null;
  const y = Object.entries(N.automation ?? {}).filter(([, Y]) => Y), W = (((j = N.factions) == null ? void 0 : j.length) ?? 0) > 0 || (((de = N.locations) == null ? void 0 : de.length) ?? 0) > 0, U = N.session_seed;
  return jl.createPortal(
    /* @__PURE__ */ c.jsxs("section", { className: "campaign-dashboard", children: [
      /* @__PURE__ */ c.jsxs("header", { className: "campaign-dashboard__header", children: [
        /* @__PURE__ */ c.jsxs("div", { children: [
          /* @__PURE__ */ c.jsx("h3", { children: S.name }),
          /* @__PURE__ */ c.jsxs("p", { children: [
            S.edition.toUpperCase(),
            " · ",
            S.creation_method,
            " · ",
            S.gameplay_level ?? "experienced"
          ] })
        ] }),
        /* @__PURE__ */ c.jsx("div", { className: "campaign-dashboard__actions", children: /* @__PURE__ */ c.jsx("button", { type: "button", className: "btn-secondary", onClick: b, children: "Dismiss" }) })
      ] }),
      N.theme && /* @__PURE__ */ c.jsxs("p", { className: "campaign-dashboard__theme", children: [
        /* @__PURE__ */ c.jsx("strong", { children: "Theme:" }),
        " ",
        N.theme
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "campaign-dashboard__grid", children: [
        /* @__PURE__ */ c.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Roster" }),
          /* @__PURE__ */ c.jsxs("p", { children: [
            /* @__PURE__ */ c.jsx("strong", { children: "Placeholders:" }),
            " ",
            (z = N.placeholders) != null && z.length ? N.placeholders.map((Y) => Y.name).join(", ") : "None captured"
          ] })
        ] }),
        /* @__PURE__ */ c.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Automation" }),
          y.length > 0 ? /* @__PURE__ */ c.jsx("ul", { children: y.map(([Y]) => /* @__PURE__ */ c.jsx("li", { children: Y.replace(/_/g, " ") }, Y)) }) : /* @__PURE__ */ c.jsx("p", { children: "No automation modules selected." }),
          N.notes && /* @__PURE__ */ c.jsxs("p", { className: "campaign-dashboard__notes", children: [
            /* @__PURE__ */ c.jsx("strong", { children: "House rule notes:" }),
            " ",
            N.notes
          ] })
        ] }),
        /* @__PURE__ */ c.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "World Backbone" }),
          W ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
            N.factions && N.factions.length > 0 && /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Factions" }),
              /* @__PURE__ */ c.jsx("ul", { children: N.factions.map((Y) => /* @__PURE__ */ c.jsxs("li", { children: [
                /* @__PURE__ */ c.jsx("span", { children: Y.name }),
                Y.tags && /* @__PURE__ */ c.jsxs("small", { children: [
                  " · ",
                  Y.tags
                ] }),
                Y.notes && /* @__PURE__ */ c.jsx("p", { children: Y.notes })
              ] }, Y.id ?? Y.name)) })
            ] }),
            N.locations && N.locations.length > 0 && /* @__PURE__ */ c.jsxs("div", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Locations" }),
              /* @__PURE__ */ c.jsx("ul", { children: N.locations.map((Y) => /* @__PURE__ */ c.jsxs("li", { children: [
                /* @__PURE__ */ c.jsx("span", { children: Y.name }),
                Y.descriptor && /* @__PURE__ */ c.jsx("p", { children: Y.descriptor })
              ] }, Y.id ?? Y.name)) })
            ] })
          ] }) : /* @__PURE__ */ c.jsx("p", { children: "No factions or locations recorded yet." })
        ] }),
        /* @__PURE__ */ c.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ c.jsx("h4", { children: "Session Seed" }),
          U != null && U.skip ? /* @__PURE__ */ c.jsx("p", { children: "Session planning skipped for now." }) : U ? /* @__PURE__ */ c.jsxs("ul", { children: [
            /* @__PURE__ */ c.jsxs("li", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Title:" }),
              " ",
              U.title || "Session 0"
            ] }),
            U.sceneTemplate && /* @__PURE__ */ c.jsxs("li", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Template:" }),
              " ",
              U.sceneTemplate
            ] }),
            U.objectives && /* @__PURE__ */ c.jsxs("li", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Objectives:" }),
              " ",
              U.objectives
            ] }),
            U.summary && /* @__PURE__ */ c.jsxs("li", { children: [
              /* @__PURE__ */ c.jsx("strong", { children: "Summary:" }),
              " ",
              U.summary
            ] })
          ] }) : /* @__PURE__ */ c.jsx("p", { children: "No session seed captured." })
        ] })
      ] })
    ] }),
    J
  );
}
function kN() {
  const [x, S] = k.useState(null);
  return k.useEffect(() => {
    S(document.getElementById("auth-root"));
  }, []), x ? jl.createPortal(/* @__PURE__ */ c.jsx($k, {}), x) : null;
}
function NN() {
  const [x, S] = k.useState(null);
  return k.useEffect(() => {
    S(document.getElementById("priority-assignment-react-root"));
  }, []), x ? jl.createPortal(/* @__PURE__ */ c.jsx(mN, {}), x) : null;
}
function DN() {
  const [x, S] = k.useState(null), [b, J] = k.useState(""), [Z, N] = k.useState(null);
  return k.useEffect(() => {
    S(document.getElementById("metatype-selection-react-root"));
  }, []), k.useEffect(() => {
    var U;
    const y = window.ShadowmasterLegacyApp;
    if (!y) return;
    const W = () => {
      var j, de;
      J(((j = y.getMetatypePriority) == null ? void 0 : j.call(y)) ?? ""), N(((de = y.getMetatypeSelection) == null ? void 0 : de.call(y)) ?? null);
    };
    return W(), (U = y.subscribeMetatypeState) == null || U.call(y, W), () => {
      var j;
      (j = y.unsubscribeMetatypeState) == null || j.call(y, W);
    };
  }, []), x ? jl.createPortal(
    /* @__PURE__ */ c.jsx(
      CN,
      {
        priority: b,
        selectedMetatype: Z,
        onSelect: (y) => {
          var W, U;
          N(y), (U = (W = window.ShadowmasterLegacyApp) == null ? void 0 : W.setMetatypeSelection) == null || U.call(W, y);
        }
      }
    ),
    x
  ) : null;
}
function ON() {
  const [x, S] = k.useState(null), [b, J] = k.useState({
    priority: "",
    type: null,
    tradition: null,
    totem: null
  });
  return k.useEffect(() => {
    S(document.getElementById("magical-abilities-react-root"));
  }, []), k.useEffect(() => {
    var y;
    const Z = window.ShadowmasterLegacyApp;
    if (!Z) return;
    const N = () => {
      var U;
      const W = (U = Z.getMagicState) == null ? void 0 : U.call(Z);
      W && J({
        priority: W.priority || "",
        type: W.type || null,
        tradition: W.tradition || null,
        totem: W.totem || null
      });
    };
    return N(), (y = Z.subscribeMagicState) == null || y.call(Z, N), () => {
      var W;
      (W = Z.unsubscribeMagicState) == null || W.call(Z, N);
    };
  }, []), x ? jl.createPortal(
    /* @__PURE__ */ c.jsx(
      RN,
      {
        priority: b.priority,
        selection: { type: b.type, tradition: b.tradition, totem: b.totem },
        onChange: (Z) => {
          var N, y;
          (y = (N = window.ShadowmasterLegacyApp) == null ? void 0 : N.setMagicState) == null || y.call(N, Z);
        }
      }
    ),
    x
  ) : null;
}
function LN() {
  const { activeEdition: x, isLoading: S, error: b, characterCreationData: J } = Xf(), [Z, N] = k.useState(null);
  let y = "· data pending";
  return S ? y = "· loading edition data…" : b ? y = `· failed to load data: ${b}` : J && (y = "· edition data loaded"), /* @__PURE__ */ c.jsxs(Ik, { children: [
    /* @__PURE__ */ c.jsx("div", { className: "react-banner", "data-active-edition": x.key, children: /* @__PURE__ */ c.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ c.jsx("strong", { children: x.label }),
      " ",
      y
    ] }) }),
    /* @__PURE__ */ c.jsx(kN, {}),
    /* @__PURE__ */ c.jsx(uN, {}),
    /* @__PURE__ */ c.jsx(Kk, { onCreated: (W) => N(W) }),
    /* @__PURE__ */ c.jsx(jN, { campaign: Z, onClose: () => N(null) }),
    /* @__PURE__ */ c.jsx(lN, {}),
    /* @__PURE__ */ c.jsx(Wk, {}),
    /* @__PURE__ */ c.jsx(NN, {}),
    /* @__PURE__ */ c.jsx(DN, {}),
    /* @__PURE__ */ c.jsx(ON, {})
  ] });
}
const AN = document.getElementById("shadowmaster-react-root"), MN = AN ?? UN();
function UN() {
  const x = document.createElement("div");
  return x.id = "shadowmaster-react-root", x.dataset.controller = "react-shell", x.style.display = "contents", document.body.appendChild(x), x;
}
function zN() {
  return k.useEffect(() => {
    var x, S, b;
    (x = window.ShadowmasterLegacyApp) != null && x.initialize && !((b = (S = window.ShadowmasterLegacyApp).isInitialized) != null && b.call(S)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ c.jsx(k.StrictMode, { children: /* @__PURE__ */ c.jsx(Fk, { children: /* @__PURE__ */ c.jsx(LN, {}) }) });
}
const FN = Lx(MN);
FN.render(/* @__PURE__ */ c.jsx(zN, {}));

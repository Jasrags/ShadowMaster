var RE = { exports: {} }, tv = {}, _E = { exports: {} }, Ft = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cw;
function bj() {
  if (cw) return Ft;
  cw = 1;
  var E = Symbol.for("react.element"), x = Symbol.for("react.portal"), b = Symbol.for("react.fragment"), K = Symbol.for("react.strict_mode"), J = Symbol.for("react.profiler"), j = Symbol.for("react.provider"), g = Symbol.for("react.context"), re = Symbol.for("react.forward_ref"), D = Symbol.for("react.suspense"), B = Symbol.for("react.memo"), oe = Symbol.for("react.lazy"), F = Symbol.iterator;
  function I(M) {
    return M === null || typeof M != "object" ? null : (M = F && M[F] || M["@@iterator"], typeof M == "function" ? M : null);
  }
  var ne = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ie = Object.assign, Z = {};
  function me(M, _, pe) {
    this.props = M, this.context = _, this.refs = Z, this.updater = pe || ne;
  }
  me.prototype.isReactComponent = {}, me.prototype.setState = function(M, _) {
    if (typeof M != "object" && typeof M != "function" && M != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, M, _, "setState");
  }, me.prototype.forceUpdate = function(M) {
    this.updater.enqueueForceUpdate(this, M, "forceUpdate");
  };
  function Ue() {
  }
  Ue.prototype = me.prototype;
  function se(M, _, pe) {
    this.props = M, this.context = _, this.refs = Z, this.updater = pe || ne;
  }
  var ce = se.prototype = new Ue();
  ce.constructor = se, ie(ce, me.prototype), ce.isPureReactComponent = !0;
  var ge = Array.isArray, fe = Object.prototype.hasOwnProperty, ue = { current: null }, G = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Ce(M, _, pe) {
    var Ye, Rt = {}, gt = null, pt = null;
    if (_ != null) for (Ye in _.ref !== void 0 && (pt = _.ref), _.key !== void 0 && (gt = "" + _.key), _) fe.call(_, Ye) && !G.hasOwnProperty(Ye) && (Rt[Ye] = _[Ye]);
    var xt = arguments.length - 2;
    if (xt === 1) Rt.children = pe;
    else if (1 < xt) {
      for (var wt = Array(xt), en = 0; en < xt; en++) wt[en] = arguments[en + 2];
      Rt.children = wt;
    }
    if (M && M.defaultProps) for (Ye in xt = M.defaultProps, xt) Rt[Ye] === void 0 && (Rt[Ye] = xt[Ye]);
    return { $$typeof: E, type: M, key: gt, ref: pt, props: Rt, _owner: ue.current };
  }
  function ve(M, _) {
    return { $$typeof: E, type: M.type, key: _, ref: M.ref, props: M.props, _owner: M._owner };
  }
  function Te(M) {
    return typeof M == "object" && M !== null && M.$$typeof === E;
  }
  function Le(M) {
    var _ = { "=": "=0", ":": "=2" };
    return "$" + M.replace(/[=:]/g, function(pe) {
      return _[pe];
    });
  }
  var Ge = /\/+/g;
  function ae(M, _) {
    return typeof M == "object" && M !== null && M.key != null ? Le("" + M.key) : _.toString(36);
  }
  function Fe(M, _, pe, Ye, Rt) {
    var gt = typeof M;
    (gt === "undefined" || gt === "boolean") && (M = null);
    var pt = !1;
    if (M === null) pt = !0;
    else switch (gt) {
      case "string":
      case "number":
        pt = !0;
        break;
      case "object":
        switch (M.$$typeof) {
          case E:
          case x:
            pt = !0;
        }
    }
    if (pt) return pt = M, Rt = Rt(pt), M = Ye === "" ? "." + ae(pt, 0) : Ye, ge(Rt) ? (pe = "", M != null && (pe = M.replace(Ge, "$&/") + "/"), Fe(Rt, _, pe, "", function(en) {
      return en;
    })) : Rt != null && (Te(Rt) && (Rt = ve(Rt, pe + (!Rt.key || pt && pt.key === Rt.key ? "" : ("" + Rt.key).replace(Ge, "$&/") + "/") + M)), _.push(Rt)), 1;
    if (pt = 0, Ye = Ye === "" ? "." : Ye + ":", ge(M)) for (var xt = 0; xt < M.length; xt++) {
      gt = M[xt];
      var wt = Ye + ae(gt, xt);
      pt += Fe(gt, _, pe, wt, Rt);
    }
    else if (wt = I(M), typeof wt == "function") for (M = wt.call(M), xt = 0; !(gt = M.next()).done; ) gt = gt.value, wt = Ye + ae(gt, xt++), pt += Fe(gt, _, pe, wt, Rt);
    else if (gt === "object") throw _ = String(M), Error("Objects are not valid as a React child (found: " + (_ === "[object Object]" ? "object with keys {" + Object.keys(M).join(", ") + "}" : _) + "). If you meant to render a collection of children, use an array instead.");
    return pt;
  }
  function nt(M, _, pe) {
    if (M == null) return M;
    var Ye = [], Rt = 0;
    return Fe(M, Ye, "", "", function(gt) {
      return _.call(pe, gt, Rt++);
    }), Ye;
  }
  function we(M) {
    if (M._status === -1) {
      var _ = M._result;
      _ = _(), _.then(function(pe) {
        (M._status === 0 || M._status === -1) && (M._status = 1, M._result = pe);
      }, function(pe) {
        (M._status === 0 || M._status === -1) && (M._status = 2, M._result = pe);
      }), M._status === -1 && (M._status = 0, M._result = _);
    }
    if (M._status === 1) return M._result.default;
    throw M._result;
  }
  var De = { current: null }, be = { transition: null }, Be = { ReactCurrentDispatcher: De, ReactCurrentBatchConfig: be, ReactCurrentOwner: ue };
  function Re() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Ft.Children = { map: nt, forEach: function(M, _, pe) {
    nt(M, function() {
      _.apply(this, arguments);
    }, pe);
  }, count: function(M) {
    var _ = 0;
    return nt(M, function() {
      _++;
    }), _;
  }, toArray: function(M) {
    return nt(M, function(_) {
      return _;
    }) || [];
  }, only: function(M) {
    if (!Te(M)) throw Error("React.Children.only expected to receive a single React element child.");
    return M;
  } }, Ft.Component = me, Ft.Fragment = b, Ft.Profiler = J, Ft.PureComponent = se, Ft.StrictMode = K, Ft.Suspense = D, Ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Be, Ft.act = Re, Ft.cloneElement = function(M, _, pe) {
    if (M == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + M + ".");
    var Ye = ie({}, M.props), Rt = M.key, gt = M.ref, pt = M._owner;
    if (_ != null) {
      if (_.ref !== void 0 && (gt = _.ref, pt = ue.current), _.key !== void 0 && (Rt = "" + _.key), M.type && M.type.defaultProps) var xt = M.type.defaultProps;
      for (wt in _) fe.call(_, wt) && !G.hasOwnProperty(wt) && (Ye[wt] = _[wt] === void 0 && xt !== void 0 ? xt[wt] : _[wt]);
    }
    var wt = arguments.length - 2;
    if (wt === 1) Ye.children = pe;
    else if (1 < wt) {
      xt = Array(wt);
      for (var en = 0; en < wt; en++) xt[en] = arguments[en + 2];
      Ye.children = xt;
    }
    return { $$typeof: E, type: M.type, key: Rt, ref: gt, props: Ye, _owner: pt };
  }, Ft.createContext = function(M) {
    return M = { $$typeof: g, _currentValue: M, _currentValue2: M, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, M.Provider = { $$typeof: j, _context: M }, M.Consumer = M;
  }, Ft.createElement = Ce, Ft.createFactory = function(M) {
    var _ = Ce.bind(null, M);
    return _.type = M, _;
  }, Ft.createRef = function() {
    return { current: null };
  }, Ft.forwardRef = function(M) {
    return { $$typeof: re, render: M };
  }, Ft.isValidElement = Te, Ft.lazy = function(M) {
    return { $$typeof: oe, _payload: { _status: -1, _result: M }, _init: we };
  }, Ft.memo = function(M, _) {
    return { $$typeof: B, type: M, compare: _ === void 0 ? null : _ };
  }, Ft.startTransition = function(M) {
    var _ = be.transition;
    be.transition = {};
    try {
      M();
    } finally {
      be.transition = _;
    }
  }, Ft.unstable_act = Re, Ft.useCallback = function(M, _) {
    return De.current.useCallback(M, _);
  }, Ft.useContext = function(M) {
    return De.current.useContext(M);
  }, Ft.useDebugValue = function() {
  }, Ft.useDeferredValue = function(M) {
    return De.current.useDeferredValue(M);
  }, Ft.useEffect = function(M, _) {
    return De.current.useEffect(M, _);
  }, Ft.useId = function() {
    return De.current.useId();
  }, Ft.useImperativeHandle = function(M, _, pe) {
    return De.current.useImperativeHandle(M, _, pe);
  }, Ft.useInsertionEffect = function(M, _) {
    return De.current.useInsertionEffect(M, _);
  }, Ft.useLayoutEffect = function(M, _) {
    return De.current.useLayoutEffect(M, _);
  }, Ft.useMemo = function(M, _) {
    return De.current.useMemo(M, _);
  }, Ft.useReducer = function(M, _, pe) {
    return De.current.useReducer(M, _, pe);
  }, Ft.useRef = function(M) {
    return De.current.useRef(M);
  }, Ft.useState = function(M) {
    return De.current.useState(M);
  }, Ft.useSyncExternalStore = function(M, _, pe) {
    return De.current.useSyncExternalStore(M, _, pe);
  }, Ft.useTransition = function() {
    return De.current.useTransition();
  }, Ft.version = "18.3.1", Ft;
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
var fw;
function wj() {
  return fw || (fw = 1, function(E, x) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var b = "18.3.1", K = Symbol.for("react.element"), J = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), re = Symbol.for("react.profiler"), D = Symbol.for("react.provider"), B = Symbol.for("react.context"), oe = Symbol.for("react.forward_ref"), F = Symbol.for("react.suspense"), I = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), ie = Symbol.for("react.lazy"), Z = Symbol.for("react.offscreen"), me = Symbol.iterator, Ue = "@@iterator";
      function se(m) {
        if (m === null || typeof m != "object")
          return null;
        var R = me && m[me] || m[Ue];
        return typeof R == "function" ? R : null;
      }
      var ce = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, ge = {
        transition: null
      }, fe = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, ue = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, G = {}, Ce = null;
      function ve(m) {
        Ce = m;
      }
      G.setExtraStackFrame = function(m) {
        Ce = m;
      }, G.getCurrentStack = null, G.getStackAddendum = function() {
        var m = "";
        Ce && (m += Ce);
        var R = G.getCurrentStack;
        return R && (m += R() || ""), m;
      };
      var Te = !1, Le = !1, Ge = !1, ae = !1, Fe = !1, nt = {
        ReactCurrentDispatcher: ce,
        ReactCurrentBatchConfig: ge,
        ReactCurrentOwner: ue
      };
      nt.ReactDebugCurrentFrame = G, nt.ReactCurrentActQueue = fe;
      function we(m) {
        {
          for (var R = arguments.length, Y = new Array(R > 1 ? R - 1 : 0), q = 1; q < R; q++)
            Y[q - 1] = arguments[q];
          be("warn", m, Y);
        }
      }
      function De(m) {
        {
          for (var R = arguments.length, Y = new Array(R > 1 ? R - 1 : 0), q = 1; q < R; q++)
            Y[q - 1] = arguments[q];
          be("error", m, Y);
        }
      }
      function be(m, R, Y) {
        {
          var q = nt.ReactDebugCurrentFrame, je = q.getStackAddendum();
          je !== "" && (R += "%s", Y = Y.concat([je]));
          var lt = Y.map(function(ze) {
            return String(ze);
          });
          lt.unshift("Warning: " + R), Function.prototype.apply.call(console[m], console, lt);
        }
      }
      var Be = {};
      function Re(m, R) {
        {
          var Y = m.constructor, q = Y && (Y.displayName || Y.name) || "ReactClass", je = q + "." + R;
          if (Be[je])
            return;
          De("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", R, q), Be[je] = !0;
        }
      }
      var M = {
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
        enqueueReplaceState: function(m, R, Y, q) {
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
        enqueueSetState: function(m, R, Y, q) {
          Re(m, "setState");
        }
      }, _ = Object.assign, pe = {};
      Object.freeze(pe);
      function Ye(m, R, Y) {
        this.props = m, this.context = R, this.refs = pe, this.updater = Y || M;
      }
      Ye.prototype.isReactComponent = {}, Ye.prototype.setState = function(m, R) {
        if (typeof m != "object" && typeof m != "function" && m != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, m, R, "setState");
      }, Ye.prototype.forceUpdate = function(m) {
        this.updater.enqueueForceUpdate(this, m, "forceUpdate");
      };
      {
        var Rt = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, gt = function(m, R) {
          Object.defineProperty(Ye.prototype, m, {
            get: function() {
              we("%s(...) is deprecated in plain JavaScript React classes. %s", R[0], R[1]);
            }
          });
        };
        for (var pt in Rt)
          Rt.hasOwnProperty(pt) && gt(pt, Rt[pt]);
      }
      function xt() {
      }
      xt.prototype = Ye.prototype;
      function wt(m, R, Y) {
        this.props = m, this.context = R, this.refs = pe, this.updater = Y || M;
      }
      var en = wt.prototype = new xt();
      en.constructor = wt, _(en, Ye.prototype), en.isPureReactComponent = !0;
      function Nn() {
        var m = {
          current: null
        };
        return Object.seal(m), m;
      }
      var cr = Array.isArray;
      function gn(m) {
        return cr(m);
      }
      function Pn(m) {
        {
          var R = typeof Symbol == "function" && Symbol.toStringTag, Y = R && m[Symbol.toStringTag] || m.constructor.name || "Object";
          return Y;
        }
      }
      function jt(m) {
        try {
          return ln(m), !1;
        } catch {
          return !0;
        }
      }
      function ln(m) {
        return "" + m;
      }
      function Rn(m) {
        if (jt(m))
          return De("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Pn(m)), ln(m);
      }
      function Zr(m, R, Y) {
        var q = m.displayName;
        if (q)
          return q;
        var je = R.displayName || R.name || "";
        return je !== "" ? Y + "(" + je + ")" : Y;
      }
      function Or(m) {
        return m.displayName || "Context";
      }
      function Hn(m) {
        if (m == null)
          return null;
        if (typeof m.tag == "number" && De("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof m == "function")
          return m.displayName || m.name || null;
        if (typeof m == "string")
          return m;
        switch (m) {
          case j:
            return "Fragment";
          case J:
            return "Portal";
          case re:
            return "Profiler";
          case g:
            return "StrictMode";
          case F:
            return "Suspense";
          case I:
            return "SuspenseList";
        }
        if (typeof m == "object")
          switch (m.$$typeof) {
            case B:
              var R = m;
              return Or(R) + ".Consumer";
            case D:
              var Y = m;
              return Or(Y._context) + ".Provider";
            case oe:
              return Zr(m, m.render, "ForwardRef");
            case ne:
              var q = m.displayName || null;
              return q !== null ? q : Hn(m.type) || "Memo";
            case ie: {
              var je = m, lt = je._payload, ze = je._init;
              try {
                return Hn(ze(lt));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var _n = Object.prototype.hasOwnProperty, Un = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, ar, ea, Dn;
      Dn = {};
      function fr(m) {
        if (_n.call(m, "ref")) {
          var R = Object.getOwnPropertyDescriptor(m, "ref").get;
          if (R && R.isReactWarning)
            return !1;
        }
        return m.ref !== void 0;
      }
      function on(m) {
        if (_n.call(m, "key")) {
          var R = Object.getOwnPropertyDescriptor(m, "key").get;
          if (R && R.isReactWarning)
            return !1;
        }
        return m.key !== void 0;
      }
      function ta(m, R) {
        var Y = function() {
          ar || (ar = !0, De("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", R));
        };
        Y.isReactWarning = !0, Object.defineProperty(m, "key", {
          get: Y,
          configurable: !0
        });
      }
      function Ea(m, R) {
        var Y = function() {
          ea || (ea = !0, De("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", R));
        };
        Y.isReactWarning = !0, Object.defineProperty(m, "ref", {
          get: Y,
          configurable: !0
        });
      }
      function Me(m) {
        if (typeof m.ref == "string" && ue.current && m.__self && ue.current.stateNode !== m.__self) {
          var R = Hn(ue.current.type);
          Dn[R] || (De('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', R, m.ref), Dn[R] = !0);
        }
      }
      var Je = function(m, R, Y, q, je, lt, ze) {
        var st = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: K,
          // Built-in properties that belong on the element
          type: m,
          key: R,
          ref: Y,
          props: ze,
          // Record the component responsible for creating this element.
          _owner: lt
        };
        return st._store = {}, Object.defineProperty(st._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(st, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: q
        }), Object.defineProperty(st, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: je
        }), Object.freeze && (Object.freeze(st.props), Object.freeze(st)), st;
      };
      function Ct(m, R, Y) {
        var q, je = {}, lt = null, ze = null, st = null, Mt = null;
        if (R != null) {
          fr(R) && (ze = R.ref, Me(R)), on(R) && (Rn(R.key), lt = "" + R.key), st = R.__self === void 0 ? null : R.__self, Mt = R.__source === void 0 ? null : R.__source;
          for (q in R)
            _n.call(R, q) && !Un.hasOwnProperty(q) && (je[q] = R[q]);
        }
        var $t = arguments.length - 2;
        if ($t === 1)
          je.children = Y;
        else if ($t > 1) {
          for (var xn = Array($t), fn = 0; fn < $t; fn++)
            xn[fn] = arguments[fn + 2];
          Object.freeze && Object.freeze(xn), je.children = xn;
        }
        if (m && m.defaultProps) {
          var Nt = m.defaultProps;
          for (q in Nt)
            je[q] === void 0 && (je[q] = Nt[q]);
        }
        if (lt || ze) {
          var dn = typeof m == "function" ? m.displayName || m.name || "Unknown" : m;
          lt && ta(je, dn), ze && Ea(je, dn);
        }
        return Je(m, lt, ze, st, Mt, ue.current, je);
      }
      function Yt(m, R) {
        var Y = Je(m.type, R, m.ref, m._self, m._source, m._owner, m.props);
        return Y;
      }
      function un(m, R, Y) {
        if (m == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + m + ".");
        var q, je = _({}, m.props), lt = m.key, ze = m.ref, st = m._self, Mt = m._source, $t = m._owner;
        if (R != null) {
          fr(R) && (ze = R.ref, $t = ue.current), on(R) && (Rn(R.key), lt = "" + R.key);
          var xn;
          m.type && m.type.defaultProps && (xn = m.type.defaultProps);
          for (q in R)
            _n.call(R, q) && !Un.hasOwnProperty(q) && (R[q] === void 0 && xn !== void 0 ? je[q] = xn[q] : je[q] = R[q]);
        }
        var fn = arguments.length - 2;
        if (fn === 1)
          je.children = Y;
        else if (fn > 1) {
          for (var Nt = Array(fn), dn = 0; dn < fn; dn++)
            Nt[dn] = arguments[dn + 2];
          je.children = Nt;
        }
        return Je(m.type, lt, ze, st, Mt, $t, je);
      }
      function tn(m) {
        return typeof m == "object" && m !== null && m.$$typeof === K;
      }
      var mn = ".", Gn = ":";
      function sn(m) {
        var R = /[=:]/g, Y = {
          "=": "=0",
          ":": "=2"
        }, q = m.replace(R, function(je) {
          return Y[je];
        });
        return "$" + q;
      }
      var Ut = !1, nn = /\/+/g;
      function yr(m) {
        return m.replace(nn, "$&/");
      }
      function Sn(m, R) {
        return typeof m == "object" && m !== null && m.key != null ? (Rn(m.key), sn("" + m.key)) : R.toString(36);
      }
      function na(m, R, Y, q, je) {
        var lt = typeof m;
        (lt === "undefined" || lt === "boolean") && (m = null);
        var ze = !1;
        if (m === null)
          ze = !0;
        else
          switch (lt) {
            case "string":
            case "number":
              ze = !0;
              break;
            case "object":
              switch (m.$$typeof) {
                case K:
                case J:
                  ze = !0;
              }
          }
        if (ze) {
          var st = m, Mt = je(st), $t = q === "" ? mn + Sn(st, 0) : q;
          if (gn(Mt)) {
            var xn = "";
            $t != null && (xn = yr($t) + "/"), na(Mt, R, xn, "", function(Zf) {
              return Zf;
            });
          } else Mt != null && (tn(Mt) && (Mt.key && (!st || st.key !== Mt.key) && Rn(Mt.key), Mt = Yt(
            Mt,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            Y + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (Mt.key && (!st || st.key !== Mt.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              yr("" + Mt.key) + "/"
            ) : "") + $t
          )), R.push(Mt));
          return 1;
        }
        var fn, Nt, dn = 0, On = q === "" ? mn : q + Gn;
        if (gn(m))
          for (var Rl = 0; Rl < m.length; Rl++)
            fn = m[Rl], Nt = On + Sn(fn, Rl), dn += na(fn, R, Y, Nt, je);
        else {
          var Xu = se(m);
          if (typeof Xu == "function") {
            var Wi = m;
            Xu === Wi.entries && (Ut || we("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Ut = !0);
            for (var Ju = Xu.call(Wi), co, Jf = 0; !(co = Ju.next()).done; )
              fn = co.value, Nt = On + Sn(fn, Jf++), dn += na(fn, R, Y, Nt, je);
          } else if (lt === "object") {
            var fc = String(m);
            throw new Error("Objects are not valid as a React child (found: " + (fc === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : fc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return dn;
      }
      function ei(m, R, Y) {
        if (m == null)
          return m;
        var q = [], je = 0;
        return na(m, q, "", "", function(lt) {
          return R.call(Y, lt, je++);
        }), q;
      }
      function La(m) {
        var R = 0;
        return ei(m, function() {
          R++;
        }), R;
      }
      function $i(m, R, Y) {
        ei(m, function() {
          R.apply(this, arguments);
        }, Y);
      }
      function yi(m) {
        return ei(m, function(R) {
          return R;
        }) || [];
      }
      function gi(m) {
        if (!tn(m))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return m;
      }
      function Si(m) {
        var R = {
          $$typeof: B,
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
          $$typeof: D,
          _context: R
        };
        var Y = !1, q = !1, je = !1;
        {
          var lt = {
            $$typeof: B,
            _context: R
          };
          Object.defineProperties(lt, {
            Provider: {
              get: function() {
                return q || (q = !0, De("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), R.Provider;
              },
              set: function(ze) {
                R.Provider = ze;
              }
            },
            _currentValue: {
              get: function() {
                return R._currentValue;
              },
              set: function(ze) {
                R._currentValue = ze;
              }
            },
            _currentValue2: {
              get: function() {
                return R._currentValue2;
              },
              set: function(ze) {
                R._currentValue2 = ze;
              }
            },
            _threadCount: {
              get: function() {
                return R._threadCount;
              },
              set: function(ze) {
                R._threadCount = ze;
              }
            },
            Consumer: {
              get: function() {
                return Y || (Y = !0, De("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), R.Consumer;
              }
            },
            displayName: {
              get: function() {
                return R.displayName;
              },
              set: function(ze) {
                je || (we("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", ze), je = !0);
              }
            }
          }), R.Consumer = lt;
        }
        return R._currentRenderer = null, R._currentRenderer2 = null, R;
      }
      var Se = -1, A = 0, de = 1, vt = 2;
      function St(m) {
        if (m._status === Se) {
          var R = m._result, Y = R();
          if (Y.then(function(lt) {
            if (m._status === A || m._status === Se) {
              var ze = m;
              ze._status = de, ze._result = lt;
            }
          }, function(lt) {
            if (m._status === A || m._status === Se) {
              var ze = m;
              ze._status = vt, ze._result = lt;
            }
          }), m._status === Se) {
            var q = m;
            q._status = A, q._result = Y;
          }
        }
        if (m._status === de) {
          var je = m._result;
          return je === void 0 && De(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, je), "default" in je || De(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, je), je.default;
        } else
          throw m._result;
      }
      function At(m) {
        var R = {
          // We use these fields to store the result.
          _status: Se,
          _result: m
        }, Y = {
          $$typeof: ie,
          _payload: R,
          _init: St
        };
        {
          var q, je;
          Object.defineProperties(Y, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return q;
              },
              set: function(lt) {
                De("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), q = lt, Object.defineProperty(Y, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return je;
              },
              set: function(lt) {
                De("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), je = lt, Object.defineProperty(Y, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return Y;
      }
      function Qt(m) {
        m != null && m.$$typeof === ne ? De("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof m != "function" ? De("forwardRef requires a render function but was given %s.", m === null ? "null" : typeof m) : m.length !== 0 && m.length !== 2 && De("forwardRef render functions accept exactly two parameters: props and ref. %s", m.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), m != null && (m.defaultProps != null || m.propTypes != null) && De("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var R = {
          $$typeof: oe,
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
            set: function(q) {
              Y = q, !m.name && !m.displayName && (m.displayName = q);
            }
          });
        }
        return R;
      }
      var T;
      T = Symbol.for("react.module.reference");
      function X(m) {
        return !!(typeof m == "string" || typeof m == "function" || m === j || m === re || Fe || m === g || m === F || m === I || ae || m === Z || Te || Le || Ge || typeof m == "object" && m !== null && (m.$$typeof === ie || m.$$typeof === ne || m.$$typeof === D || m.$$typeof === B || m.$$typeof === oe || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        m.$$typeof === T || m.getModuleId !== void 0));
      }
      function Ne(m, R) {
        X(m) || De("memo: The first argument must be a component. Instead received: %s", m === null ? "null" : typeof m);
        var Y = {
          $$typeof: ne,
          type: m,
          compare: R === void 0 ? null : R
        };
        {
          var q;
          Object.defineProperty(Y, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return q;
            },
            set: function(je) {
              q = je, !m.name && !m.displayName && (m.displayName = je);
            }
          });
        }
        return Y;
      }
      function Oe() {
        var m = ce.current;
        return m === null && De(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), m;
      }
      function rt(m) {
        var R = Oe();
        if (m._context !== void 0) {
          var Y = m._context;
          Y.Consumer === m ? De("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : Y.Provider === m && De("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return R.useContext(m);
      }
      function ht(m) {
        var R = Oe();
        return R.useState(m);
      }
      function Lt(m, R, Y) {
        var q = Oe();
        return q.useReducer(m, R, Y);
      }
      function Dt(m) {
        var R = Oe();
        return R.useRef(m);
      }
      function Bn(m, R) {
        var Y = Oe();
        return Y.useEffect(m, R);
      }
      function En(m, R) {
        var Y = Oe();
        return Y.useInsertionEffect(m, R);
      }
      function bn(m, R) {
        var Y = Oe();
        return Y.useLayoutEffect(m, R);
      }
      function gr(m, R) {
        var Y = Oe();
        return Y.useCallback(m, R);
      }
      function ti(m, R) {
        var Y = Oe();
        return Y.useMemo(m, R);
      }
      function ni(m, R, Y) {
        var q = Oe();
        return q.useImperativeHandle(m, R, Y);
      }
      function Tt(m, R) {
        {
          var Y = Oe();
          return Y.useDebugValue(m, R);
        }
      }
      function kt() {
        var m = Oe();
        return m.useTransition();
      }
      function ri(m) {
        var R = Oe();
        return R.useDeferredValue(m);
      }
      function ao() {
        var m = Oe();
        return m.useId();
      }
      function io(m, R, Y) {
        var q = Oe();
        return q.useSyncExternalStore(m, R, Y);
      }
      var Sl = 0, qo, El, ra, Wu, Ur, sc, cc;
      function Xo() {
      }
      Xo.__reactDisabledLog = !0;
      function xl() {
        {
          if (Sl === 0) {
            qo = console.log, El = console.info, ra = console.warn, Wu = console.error, Ur = console.group, sc = console.groupCollapsed, cc = console.groupEnd;
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
          Sl++;
        }
      }
      function xa() {
        {
          if (Sl--, Sl === 0) {
            var m = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: _({}, m, {
                value: qo
              }),
              info: _({}, m, {
                value: El
              }),
              warn: _({}, m, {
                value: ra
              }),
              error: _({}, m, {
                value: Wu
              }),
              group: _({}, m, {
                value: Ur
              }),
              groupCollapsed: _({}, m, {
                value: sc
              }),
              groupEnd: _({}, m, {
                value: cc
              })
            });
          }
          Sl < 0 && De("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var ai = nt.ReactCurrentDispatcher, ii;
      function Jo(m, R, Y) {
        {
          if (ii === void 0)
            try {
              throw Error();
            } catch (je) {
              var q = je.stack.trim().match(/\n( *(at )?)/);
              ii = q && q[1] || "";
            }
          return `
` + ii + m;
        }
      }
      var lo = !1, Cl;
      {
        var Zo = typeof WeakMap == "function" ? WeakMap : Map;
        Cl = new Zo();
      }
      function eu(m, R) {
        if (!m || lo)
          return "";
        {
          var Y = Cl.get(m);
          if (Y !== void 0)
            return Y;
        }
        var q;
        lo = !0;
        var je = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var lt;
        lt = ai.current, ai.current = null, xl();
        try {
          if (R) {
            var ze = function() {
              throw Error();
            };
            if (Object.defineProperty(ze.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(ze, []);
              } catch (On) {
                q = On;
              }
              Reflect.construct(m, [], ze);
            } else {
              try {
                ze.call();
              } catch (On) {
                q = On;
              }
              m.call(ze.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (On) {
              q = On;
            }
            m();
          }
        } catch (On) {
          if (On && q && typeof On.stack == "string") {
            for (var st = On.stack.split(`
`), Mt = q.stack.split(`
`), $t = st.length - 1, xn = Mt.length - 1; $t >= 1 && xn >= 0 && st[$t] !== Mt[xn]; )
              xn--;
            for (; $t >= 1 && xn >= 0; $t--, xn--)
              if (st[$t] !== Mt[xn]) {
                if ($t !== 1 || xn !== 1)
                  do
                    if ($t--, xn--, xn < 0 || st[$t] !== Mt[xn]) {
                      var fn = `
` + st[$t].replace(" at new ", " at ");
                      return m.displayName && fn.includes("<anonymous>") && (fn = fn.replace("<anonymous>", m.displayName)), typeof m == "function" && Cl.set(m, fn), fn;
                    }
                  while ($t >= 1 && xn >= 0);
                break;
              }
          }
        } finally {
          lo = !1, ai.current = lt, xa(), Error.prepareStackTrace = je;
        }
        var Nt = m ? m.displayName || m.name : "", dn = Nt ? Jo(Nt) : "";
        return typeof m == "function" && Cl.set(m, dn), dn;
      }
      function Yi(m, R, Y) {
        return eu(m, !1);
      }
      function qf(m) {
        var R = m.prototype;
        return !!(R && R.isReactComponent);
      }
      function Qi(m, R, Y) {
        if (m == null)
          return "";
        if (typeof m == "function")
          return eu(m, qf(m));
        if (typeof m == "string")
          return Jo(m);
        switch (m) {
          case F:
            return Jo("Suspense");
          case I:
            return Jo("SuspenseList");
        }
        if (typeof m == "object")
          switch (m.$$typeof) {
            case oe:
              return Yi(m.render);
            case ne:
              return Qi(m.type, R, Y);
            case ie: {
              var q = m, je = q._payload, lt = q._init;
              try {
                return Qi(lt(je), R, Y);
              } catch {
              }
            }
          }
        return "";
      }
      var Gt = {}, tu = nt.ReactDebugCurrentFrame;
      function It(m) {
        if (m) {
          var R = m._owner, Y = Qi(m.type, m._source, R ? R.type : null);
          tu.setExtraStackFrame(Y);
        } else
          tu.setExtraStackFrame(null);
      }
      function Gu(m, R, Y, q, je) {
        {
          var lt = Function.call.bind(_n);
          for (var ze in m)
            if (lt(m, ze)) {
              var st = void 0;
              try {
                if (typeof m[ze] != "function") {
                  var Mt = Error((q || "React class") + ": " + Y + " type `" + ze + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof m[ze] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw Mt.name = "Invariant Violation", Mt;
                }
                st = m[ze](R, ze, q, Y, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch ($t) {
                st = $t;
              }
              st && !(st instanceof Error) && (It(je), De("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", q || "React class", Y, ze, typeof st), It(null)), st instanceof Error && !(st.message in Gt) && (Gt[st.message] = !0, It(je), De("Failed %s type: %s", Y, st.message), It(null));
            }
        }
      }
      function Ei(m) {
        if (m) {
          var R = m._owner, Y = Qi(m.type, m._source, R ? R.type : null);
          ve(Y);
        } else
          ve(null);
      }
      var yt;
      yt = !1;
      function nu() {
        if (ue.current) {
          var m = Hn(ue.current.type);
          if (m)
            return `

Check the render method of \`` + m + "`.";
        }
        return "";
      }
      function Sr(m) {
        if (m !== void 0) {
          var R = m.fileName.replace(/^.*[\\\/]/, ""), Y = m.lineNumber;
          return `

Check your code at ` + R + ":" + Y + ".";
        }
        return "";
      }
      function xi(m) {
        return m != null ? Sr(m.__source) : "";
      }
      var Fr = {};
      function Ci(m) {
        var R = nu();
        if (!R) {
          var Y = typeof m == "string" ? m : m.displayName || m.name;
          Y && (R = `

Check the top-level render call using <` + Y + ">.");
        }
        return R;
      }
      function wn(m, R) {
        if (!(!m._store || m._store.validated || m.key != null)) {
          m._store.validated = !0;
          var Y = Ci(R);
          if (!Fr[Y]) {
            Fr[Y] = !0;
            var q = "";
            m && m._owner && m._owner !== ue.current && (q = " It was passed a child from " + Hn(m._owner.type) + "."), Ei(m), De('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', Y, q), Ei(null);
          }
        }
      }
      function cn(m, R) {
        if (typeof m == "object") {
          if (gn(m))
            for (var Y = 0; Y < m.length; Y++) {
              var q = m[Y];
              tn(q) && wn(q, R);
            }
          else if (tn(m))
            m._store && (m._store.validated = !0);
          else if (m) {
            var je = se(m);
            if (typeof je == "function" && je !== m.entries)
              for (var lt = je.call(m), ze; !(ze = lt.next()).done; )
                tn(ze.value) && wn(ze.value, R);
          }
        }
      }
      function bl(m) {
        {
          var R = m.type;
          if (R == null || typeof R == "string")
            return;
          var Y;
          if (typeof R == "function")
            Y = R.propTypes;
          else if (typeof R == "object" && (R.$$typeof === oe || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          R.$$typeof === ne))
            Y = R.propTypes;
          else
            return;
          if (Y) {
            var q = Hn(R);
            Gu(Y, m.props, "prop", q, m);
          } else if (R.PropTypes !== void 0 && !yt) {
            yt = !0;
            var je = Hn(R);
            De("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", je || "Unknown");
          }
          typeof R.getDefaultProps == "function" && !R.getDefaultProps.isReactClassApproved && De("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function ir(m) {
        {
          for (var R = Object.keys(m.props), Y = 0; Y < R.length; Y++) {
            var q = R[Y];
            if (q !== "children" && q !== "key") {
              Ei(m), De("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", q), Ei(null);
              break;
            }
          }
          m.ref !== null && (Ei(m), De("Invalid attribute `ref` supplied to `React.Fragment`."), Ei(null));
        }
      }
      function Pr(m, R, Y) {
        var q = X(m);
        if (!q) {
          var je = "";
          (m === void 0 || typeof m == "object" && m !== null && Object.keys(m).length === 0) && (je += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var lt = xi(R);
          lt ? je += lt : je += nu();
          var ze;
          m === null ? ze = "null" : gn(m) ? ze = "array" : m !== void 0 && m.$$typeof === K ? (ze = "<" + (Hn(m.type) || "Unknown") + " />", je = " Did you accidentally export a JSX literal instead of a component?") : ze = typeof m, De("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ze, je);
        }
        var st = Ct.apply(this, arguments);
        if (st == null)
          return st;
        if (q)
          for (var Mt = 2; Mt < arguments.length; Mt++)
            cn(arguments[Mt], m);
        return m === j ? ir(st) : bl(st), st;
      }
      var Ma = !1;
      function oo(m) {
        var R = Pr.bind(null, m);
        return R.type = m, Ma || (Ma = !0, we("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(R, "type", {
          enumerable: !1,
          get: function() {
            return we("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: m
            }), m;
          }
        }), R;
      }
      function Ku(m, R, Y) {
        for (var q = un.apply(this, arguments), je = 2; je < arguments.length; je++)
          cn(arguments[je], q.type);
        return bl(q), q;
      }
      function qu(m, R) {
        var Y = ge.transition;
        ge.transition = {};
        var q = ge.transition;
        ge.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          m();
        } finally {
          if (ge.transition = Y, Y === null && q._updatedFibers) {
            var je = q._updatedFibers.size;
            je > 10 && we("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), q._updatedFibers.clear();
          }
        }
      }
      var wl = !1, uo = null;
      function Xf(m) {
        if (uo === null)
          try {
            var R = ("require" + Math.random()).slice(0, 7), Y = E && E[R];
            uo = Y.call(E, "timers").setImmediate;
          } catch {
            uo = function(je) {
              wl === !1 && (wl = !0, typeof MessageChannel > "u" && De("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var lt = new MessageChannel();
              lt.port1.onmessage = je, lt.port2.postMessage(void 0);
            };
          }
        return uo(m);
      }
      var Aa = 0, li = !1;
      function bi(m) {
        {
          var R = Aa;
          Aa++, fe.current === null && (fe.current = []);
          var Y = fe.isBatchingLegacy, q;
          try {
            if (fe.isBatchingLegacy = !0, q = m(), !Y && fe.didScheduleLegacyUpdate) {
              var je = fe.current;
              je !== null && (fe.didScheduleLegacyUpdate = !1, Tl(je));
            }
          } catch (Nt) {
            throw za(R), Nt;
          } finally {
            fe.isBatchingLegacy = Y;
          }
          if (q !== null && typeof q == "object" && typeof q.then == "function") {
            var lt = q, ze = !1, st = {
              then: function(Nt, dn) {
                ze = !0, lt.then(function(On) {
                  za(R), Aa === 0 ? ru(On, Nt, dn) : Nt(On);
                }, function(On) {
                  za(R), dn(On);
                });
              }
            };
            return !li && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              ze || (li = !0, De("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), st;
          } else {
            var Mt = q;
            if (za(R), Aa === 0) {
              var $t = fe.current;
              $t !== null && (Tl($t), fe.current = null);
              var xn = {
                then: function(Nt, dn) {
                  fe.current === null ? (fe.current = [], ru(Mt, Nt, dn)) : Nt(Mt);
                }
              };
              return xn;
            } else {
              var fn = {
                then: function(Nt, dn) {
                  Nt(Mt);
                }
              };
              return fn;
            }
          }
        }
      }
      function za(m) {
        m !== Aa - 1 && De("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Aa = m;
      }
      function ru(m, R, Y) {
        {
          var q = fe.current;
          if (q !== null)
            try {
              Tl(q), Xf(function() {
                q.length === 0 ? (fe.current = null, R(m)) : ru(m, R, Y);
              });
            } catch (je) {
              Y(je);
            }
          else
            R(m);
        }
      }
      var au = !1;
      function Tl(m) {
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
          } catch (q) {
            throw m = m.slice(R + 1), q;
          } finally {
            au = !1;
          }
        }
      }
      var so = Pr, iu = Ku, lu = oo, oi = {
        map: ei,
        forEach: $i,
        count: La,
        toArray: yi,
        only: gi
      };
      x.Children = oi, x.Component = Ye, x.Fragment = j, x.Profiler = re, x.PureComponent = wt, x.StrictMode = g, x.Suspense = F, x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = nt, x.act = bi, x.cloneElement = iu, x.createContext = Si, x.createElement = so, x.createFactory = lu, x.createRef = Nn, x.forwardRef = Qt, x.isValidElement = tn, x.lazy = At, x.memo = Ne, x.startTransition = qu, x.unstable_act = bi, x.useCallback = gr, x.useContext = rt, x.useDebugValue = Tt, x.useDeferredValue = ri, x.useEffect = Bn, x.useId = ao, x.useImperativeHandle = ni, x.useInsertionEffect = En, x.useLayoutEffect = bn, x.useMemo = ti, x.useReducer = Lt, x.useRef = Dt, x.useState = ht, x.useSyncExternalStore = io, x.useTransition = kt, x.version = b, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(lv, lv.exports)), lv.exports;
}
process.env.NODE_ENV === "production" ? _E.exports = bj() : _E.exports = wj();
var z = _E.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dw;
function Tj() {
  if (dw) return tv;
  dw = 1;
  var E = z, x = Symbol.for("react.element"), b = Symbol.for("react.fragment"), K = Object.prototype.hasOwnProperty, J = E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, j = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(re, D, B) {
    var oe, F = {}, I = null, ne = null;
    B !== void 0 && (I = "" + B), D.key !== void 0 && (I = "" + D.key), D.ref !== void 0 && (ne = D.ref);
    for (oe in D) K.call(D, oe) && !j.hasOwnProperty(oe) && (F[oe] = D[oe]);
    if (re && re.defaultProps) for (oe in D = re.defaultProps, D) F[oe] === void 0 && (F[oe] = D[oe]);
    return { $$typeof: x, type: re, key: I, ref: ne, props: F, _owner: J.current };
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
var pw;
function Rj() {
  return pw || (pw = 1, process.env.NODE_ENV !== "production" && function() {
    var E = z, x = Symbol.for("react.element"), b = Symbol.for("react.portal"), K = Symbol.for("react.fragment"), J = Symbol.for("react.strict_mode"), j = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), re = Symbol.for("react.context"), D = Symbol.for("react.forward_ref"), B = Symbol.for("react.suspense"), oe = Symbol.for("react.suspense_list"), F = Symbol.for("react.memo"), I = Symbol.for("react.lazy"), ne = Symbol.for("react.offscreen"), ie = Symbol.iterator, Z = "@@iterator";
    function me(T) {
      if (T === null || typeof T != "object")
        return null;
      var X = ie && T[ie] || T[Z];
      return typeof X == "function" ? X : null;
    }
    var Ue = E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function se(T) {
      {
        for (var X = arguments.length, Ne = new Array(X > 1 ? X - 1 : 0), Oe = 1; Oe < X; Oe++)
          Ne[Oe - 1] = arguments[Oe];
        ce("error", T, Ne);
      }
    }
    function ce(T, X, Ne) {
      {
        var Oe = Ue.ReactDebugCurrentFrame, rt = Oe.getStackAddendum();
        rt !== "" && (X += "%s", Ne = Ne.concat([rt]));
        var ht = Ne.map(function(Lt) {
          return String(Lt);
        });
        ht.unshift("Warning: " + X), Function.prototype.apply.call(console[T], console, ht);
      }
    }
    var ge = !1, fe = !1, ue = !1, G = !1, Ce = !1, ve;
    ve = Symbol.for("react.module.reference");
    function Te(T) {
      return !!(typeof T == "string" || typeof T == "function" || T === K || T === j || Ce || T === J || T === B || T === oe || G || T === ne || ge || fe || ue || typeof T == "object" && T !== null && (T.$$typeof === I || T.$$typeof === F || T.$$typeof === g || T.$$typeof === re || T.$$typeof === D || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      T.$$typeof === ve || T.getModuleId !== void 0));
    }
    function Le(T, X, Ne) {
      var Oe = T.displayName;
      if (Oe)
        return Oe;
      var rt = X.displayName || X.name || "";
      return rt !== "" ? Ne + "(" + rt + ")" : Ne;
    }
    function Ge(T) {
      return T.displayName || "Context";
    }
    function ae(T) {
      if (T == null)
        return null;
      if (typeof T.tag == "number" && se("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof T == "function")
        return T.displayName || T.name || null;
      if (typeof T == "string")
        return T;
      switch (T) {
        case K:
          return "Fragment";
        case b:
          return "Portal";
        case j:
          return "Profiler";
        case J:
          return "StrictMode";
        case B:
          return "Suspense";
        case oe:
          return "SuspenseList";
      }
      if (typeof T == "object")
        switch (T.$$typeof) {
          case re:
            var X = T;
            return Ge(X) + ".Consumer";
          case g:
            var Ne = T;
            return Ge(Ne._context) + ".Provider";
          case D:
            return Le(T, T.render, "ForwardRef");
          case F:
            var Oe = T.displayName || null;
            return Oe !== null ? Oe : ae(T.type) || "Memo";
          case I: {
            var rt = T, ht = rt._payload, Lt = rt._init;
            try {
              return ae(Lt(ht));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Fe = Object.assign, nt = 0, we, De, be, Be, Re, M, _;
    function pe() {
    }
    pe.__reactDisabledLog = !0;
    function Ye() {
      {
        if (nt === 0) {
          we = console.log, De = console.info, be = console.warn, Be = console.error, Re = console.group, M = console.groupCollapsed, _ = console.groupEnd;
          var T = {
            configurable: !0,
            enumerable: !0,
            value: pe,
            writable: !0
          };
          Object.defineProperties(console, {
            info: T,
            log: T,
            warn: T,
            error: T,
            group: T,
            groupCollapsed: T,
            groupEnd: T
          });
        }
        nt++;
      }
    }
    function Rt() {
      {
        if (nt--, nt === 0) {
          var T = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Fe({}, T, {
              value: we
            }),
            info: Fe({}, T, {
              value: De
            }),
            warn: Fe({}, T, {
              value: be
            }),
            error: Fe({}, T, {
              value: Be
            }),
            group: Fe({}, T, {
              value: Re
            }),
            groupCollapsed: Fe({}, T, {
              value: M
            }),
            groupEnd: Fe({}, T, {
              value: _
            })
          });
        }
        nt < 0 && se("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var gt = Ue.ReactCurrentDispatcher, pt;
    function xt(T, X, Ne) {
      {
        if (pt === void 0)
          try {
            throw Error();
          } catch (rt) {
            var Oe = rt.stack.trim().match(/\n( *(at )?)/);
            pt = Oe && Oe[1] || "";
          }
        return `
` + pt + T;
      }
    }
    var wt = !1, en;
    {
      var Nn = typeof WeakMap == "function" ? WeakMap : Map;
      en = new Nn();
    }
    function cr(T, X) {
      if (!T || wt)
        return "";
      {
        var Ne = en.get(T);
        if (Ne !== void 0)
          return Ne;
      }
      var Oe;
      wt = !0;
      var rt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var ht;
      ht = gt.current, gt.current = null, Ye();
      try {
        if (X) {
          var Lt = function() {
            throw Error();
          };
          if (Object.defineProperty(Lt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Lt, []);
            } catch (Tt) {
              Oe = Tt;
            }
            Reflect.construct(T, [], Lt);
          } else {
            try {
              Lt.call();
            } catch (Tt) {
              Oe = Tt;
            }
            T.call(Lt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Tt) {
            Oe = Tt;
          }
          T();
        }
      } catch (Tt) {
        if (Tt && Oe && typeof Tt.stack == "string") {
          for (var Dt = Tt.stack.split(`
`), Bn = Oe.stack.split(`
`), En = Dt.length - 1, bn = Bn.length - 1; En >= 1 && bn >= 0 && Dt[En] !== Bn[bn]; )
            bn--;
          for (; En >= 1 && bn >= 0; En--, bn--)
            if (Dt[En] !== Bn[bn]) {
              if (En !== 1 || bn !== 1)
                do
                  if (En--, bn--, bn < 0 || Dt[En] !== Bn[bn]) {
                    var gr = `
` + Dt[En].replace(" at new ", " at ");
                    return T.displayName && gr.includes("<anonymous>") && (gr = gr.replace("<anonymous>", T.displayName)), typeof T == "function" && en.set(T, gr), gr;
                  }
                while (En >= 1 && bn >= 0);
              break;
            }
        }
      } finally {
        wt = !1, gt.current = ht, Rt(), Error.prepareStackTrace = rt;
      }
      var ti = T ? T.displayName || T.name : "", ni = ti ? xt(ti) : "";
      return typeof T == "function" && en.set(T, ni), ni;
    }
    function gn(T, X, Ne) {
      return cr(T, !1);
    }
    function Pn(T) {
      var X = T.prototype;
      return !!(X && X.isReactComponent);
    }
    function jt(T, X, Ne) {
      if (T == null)
        return "";
      if (typeof T == "function")
        return cr(T, Pn(T));
      if (typeof T == "string")
        return xt(T);
      switch (T) {
        case B:
          return xt("Suspense");
        case oe:
          return xt("SuspenseList");
      }
      if (typeof T == "object")
        switch (T.$$typeof) {
          case D:
            return gn(T.render);
          case F:
            return jt(T.type, X, Ne);
          case I: {
            var Oe = T, rt = Oe._payload, ht = Oe._init;
            try {
              return jt(ht(rt), X, Ne);
            } catch {
            }
          }
        }
      return "";
    }
    var ln = Object.prototype.hasOwnProperty, Rn = {}, Zr = Ue.ReactDebugCurrentFrame;
    function Or(T) {
      if (T) {
        var X = T._owner, Ne = jt(T.type, T._source, X ? X.type : null);
        Zr.setExtraStackFrame(Ne);
      } else
        Zr.setExtraStackFrame(null);
    }
    function Hn(T, X, Ne, Oe, rt) {
      {
        var ht = Function.call.bind(ln);
        for (var Lt in T)
          if (ht(T, Lt)) {
            var Dt = void 0;
            try {
              if (typeof T[Lt] != "function") {
                var Bn = Error((Oe || "React class") + ": " + Ne + " type `" + Lt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof T[Lt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Bn.name = "Invariant Violation", Bn;
              }
              Dt = T[Lt](X, Lt, Oe, Ne, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (En) {
              Dt = En;
            }
            Dt && !(Dt instanceof Error) && (Or(rt), se("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Oe || "React class", Ne, Lt, typeof Dt), Or(null)), Dt instanceof Error && !(Dt.message in Rn) && (Rn[Dt.message] = !0, Or(rt), se("Failed %s type: %s", Ne, Dt.message), Or(null));
          }
      }
    }
    var _n = Array.isArray;
    function Un(T) {
      return _n(T);
    }
    function ar(T) {
      {
        var X = typeof Symbol == "function" && Symbol.toStringTag, Ne = X && T[Symbol.toStringTag] || T.constructor.name || "Object";
        return Ne;
      }
    }
    function ea(T) {
      try {
        return Dn(T), !1;
      } catch {
        return !0;
      }
    }
    function Dn(T) {
      return "" + T;
    }
    function fr(T) {
      if (ea(T))
        return se("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", ar(T)), Dn(T);
    }
    var on = Ue.ReactCurrentOwner, ta = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Ea, Me;
    function Je(T) {
      if (ln.call(T, "ref")) {
        var X = Object.getOwnPropertyDescriptor(T, "ref").get;
        if (X && X.isReactWarning)
          return !1;
      }
      return T.ref !== void 0;
    }
    function Ct(T) {
      if (ln.call(T, "key")) {
        var X = Object.getOwnPropertyDescriptor(T, "key").get;
        if (X && X.isReactWarning)
          return !1;
      }
      return T.key !== void 0;
    }
    function Yt(T, X) {
      typeof T.ref == "string" && on.current;
    }
    function un(T, X) {
      {
        var Ne = function() {
          Ea || (Ea = !0, se("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", X));
        };
        Ne.isReactWarning = !0, Object.defineProperty(T, "key", {
          get: Ne,
          configurable: !0
        });
      }
    }
    function tn(T, X) {
      {
        var Ne = function() {
          Me || (Me = !0, se("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", X));
        };
        Ne.isReactWarning = !0, Object.defineProperty(T, "ref", {
          get: Ne,
          configurable: !0
        });
      }
    }
    var mn = function(T, X, Ne, Oe, rt, ht, Lt) {
      var Dt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: x,
        // Built-in properties that belong on the element
        type: T,
        key: X,
        ref: Ne,
        props: Lt,
        // Record the component responsible for creating this element.
        _owner: ht
      };
      return Dt._store = {}, Object.defineProperty(Dt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(Dt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Oe
      }), Object.defineProperty(Dt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: rt
      }), Object.freeze && (Object.freeze(Dt.props), Object.freeze(Dt)), Dt;
    };
    function Gn(T, X, Ne, Oe, rt) {
      {
        var ht, Lt = {}, Dt = null, Bn = null;
        Ne !== void 0 && (fr(Ne), Dt = "" + Ne), Ct(X) && (fr(X.key), Dt = "" + X.key), Je(X) && (Bn = X.ref, Yt(X, rt));
        for (ht in X)
          ln.call(X, ht) && !ta.hasOwnProperty(ht) && (Lt[ht] = X[ht]);
        if (T && T.defaultProps) {
          var En = T.defaultProps;
          for (ht in En)
            Lt[ht] === void 0 && (Lt[ht] = En[ht]);
        }
        if (Dt || Bn) {
          var bn = typeof T == "function" ? T.displayName || T.name || "Unknown" : T;
          Dt && un(Lt, bn), Bn && tn(Lt, bn);
        }
        return mn(T, Dt, Bn, rt, Oe, on.current, Lt);
      }
    }
    var sn = Ue.ReactCurrentOwner, Ut = Ue.ReactDebugCurrentFrame;
    function nn(T) {
      if (T) {
        var X = T._owner, Ne = jt(T.type, T._source, X ? X.type : null);
        Ut.setExtraStackFrame(Ne);
      } else
        Ut.setExtraStackFrame(null);
    }
    var yr;
    yr = !1;
    function Sn(T) {
      return typeof T == "object" && T !== null && T.$$typeof === x;
    }
    function na() {
      {
        if (sn.current) {
          var T = ae(sn.current.type);
          if (T)
            return `

Check the render method of \`` + T + "`.";
        }
        return "";
      }
    }
    function ei(T) {
      return "";
    }
    var La = {};
    function $i(T) {
      {
        var X = na();
        if (!X) {
          var Ne = typeof T == "string" ? T : T.displayName || T.name;
          Ne && (X = `

Check the top-level render call using <` + Ne + ">.");
        }
        return X;
      }
    }
    function yi(T, X) {
      {
        if (!T._store || T._store.validated || T.key != null)
          return;
        T._store.validated = !0;
        var Ne = $i(X);
        if (La[Ne])
          return;
        La[Ne] = !0;
        var Oe = "";
        T && T._owner && T._owner !== sn.current && (Oe = " It was passed a child from " + ae(T._owner.type) + "."), nn(T), se('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', Ne, Oe), nn(null);
      }
    }
    function gi(T, X) {
      {
        if (typeof T != "object")
          return;
        if (Un(T))
          for (var Ne = 0; Ne < T.length; Ne++) {
            var Oe = T[Ne];
            Sn(Oe) && yi(Oe, X);
          }
        else if (Sn(T))
          T._store && (T._store.validated = !0);
        else if (T) {
          var rt = me(T);
          if (typeof rt == "function" && rt !== T.entries)
            for (var ht = rt.call(T), Lt; !(Lt = ht.next()).done; )
              Sn(Lt.value) && yi(Lt.value, X);
        }
      }
    }
    function Si(T) {
      {
        var X = T.type;
        if (X == null || typeof X == "string")
          return;
        var Ne;
        if (typeof X == "function")
          Ne = X.propTypes;
        else if (typeof X == "object" && (X.$$typeof === D || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        X.$$typeof === F))
          Ne = X.propTypes;
        else
          return;
        if (Ne) {
          var Oe = ae(X);
          Hn(Ne, T.props, "prop", Oe, T);
        } else if (X.PropTypes !== void 0 && !yr) {
          yr = !0;
          var rt = ae(X);
          se("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", rt || "Unknown");
        }
        typeof X.getDefaultProps == "function" && !X.getDefaultProps.isReactClassApproved && se("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Se(T) {
      {
        for (var X = Object.keys(T.props), Ne = 0; Ne < X.length; Ne++) {
          var Oe = X[Ne];
          if (Oe !== "children" && Oe !== "key") {
            nn(T), se("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Oe), nn(null);
            break;
          }
        }
        T.ref !== null && (nn(T), se("Invalid attribute `ref` supplied to `React.Fragment`."), nn(null));
      }
    }
    var A = {};
    function de(T, X, Ne, Oe, rt, ht) {
      {
        var Lt = Te(T);
        if (!Lt) {
          var Dt = "";
          (T === void 0 || typeof T == "object" && T !== null && Object.keys(T).length === 0) && (Dt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Bn = ei();
          Bn ? Dt += Bn : Dt += na();
          var En;
          T === null ? En = "null" : Un(T) ? En = "array" : T !== void 0 && T.$$typeof === x ? (En = "<" + (ae(T.type) || "Unknown") + " />", Dt = " Did you accidentally export a JSX literal instead of a component?") : En = typeof T, se("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", En, Dt);
        }
        var bn = Gn(T, X, Ne, rt, ht);
        if (bn == null)
          return bn;
        if (Lt) {
          var gr = X.children;
          if (gr !== void 0)
            if (Oe)
              if (Un(gr)) {
                for (var ti = 0; ti < gr.length; ti++)
                  gi(gr[ti], T);
                Object.freeze && Object.freeze(gr);
              } else
                se("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              gi(gr, T);
        }
        if (ln.call(X, "key")) {
          var ni = ae(T), Tt = Object.keys(X).filter(function(ao) {
            return ao !== "key";
          }), kt = Tt.length > 0 ? "{key: someKey, " + Tt.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!A[ni + kt]) {
            var ri = Tt.length > 0 ? "{" + Tt.join(": ..., ") + ": ...}" : "{}";
            se(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, kt, ni, ri, ni), A[ni + kt] = !0;
          }
        }
        return T === K ? Se(bn) : Si(bn), bn;
      }
    }
    function vt(T, X, Ne) {
      return de(T, X, Ne, !0);
    }
    function St(T, X, Ne) {
      return de(T, X, Ne, !1);
    }
    var At = St, Qt = vt;
    nv.Fragment = K, nv.jsx = At, nv.jsxs = Qt;
  }()), nv;
}
process.env.NODE_ENV === "production" ? RE.exports = Tj() : RE.exports = Rj();
var d = RE.exports, kE = { exports: {} }, Ja = {}, Zm = { exports: {} }, EE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vw;
function _j() {
  return vw || (vw = 1, function(E) {
    function x(be, Be) {
      var Re = be.length;
      be.push(Be);
      e: for (; 0 < Re; ) {
        var M = Re - 1 >>> 1, _ = be[M];
        if (0 < J(_, Be)) be[M] = Be, be[Re] = _, Re = M;
        else break e;
      }
    }
    function b(be) {
      return be.length === 0 ? null : be[0];
    }
    function K(be) {
      if (be.length === 0) return null;
      var Be = be[0], Re = be.pop();
      if (Re !== Be) {
        be[0] = Re;
        e: for (var M = 0, _ = be.length, pe = _ >>> 1; M < pe; ) {
          var Ye = 2 * (M + 1) - 1, Rt = be[Ye], gt = Ye + 1, pt = be[gt];
          if (0 > J(Rt, Re)) gt < _ && 0 > J(pt, Rt) ? (be[M] = pt, be[gt] = Re, M = gt) : (be[M] = Rt, be[Ye] = Re, M = Ye);
          else if (gt < _ && 0 > J(pt, Re)) be[M] = pt, be[gt] = Re, M = gt;
          else break e;
        }
      }
      return Be;
    }
    function J(be, Be) {
      var Re = be.sortIndex - Be.sortIndex;
      return Re !== 0 ? Re : be.id - Be.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var j = performance;
      E.unstable_now = function() {
        return j.now();
      };
    } else {
      var g = Date, re = g.now();
      E.unstable_now = function() {
        return g.now() - re;
      };
    }
    var D = [], B = [], oe = 1, F = null, I = 3, ne = !1, ie = !1, Z = !1, me = typeof setTimeout == "function" ? setTimeout : null, Ue = typeof clearTimeout == "function" ? clearTimeout : null, se = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function ce(be) {
      for (var Be = b(B); Be !== null; ) {
        if (Be.callback === null) K(B);
        else if (Be.startTime <= be) K(B), Be.sortIndex = Be.expirationTime, x(D, Be);
        else break;
        Be = b(B);
      }
    }
    function ge(be) {
      if (Z = !1, ce(be), !ie) if (b(D) !== null) ie = !0, we(fe);
      else {
        var Be = b(B);
        Be !== null && De(ge, Be.startTime - be);
      }
    }
    function fe(be, Be) {
      ie = !1, Z && (Z = !1, Ue(Ce), Ce = -1), ne = !0;
      var Re = I;
      try {
        for (ce(Be), F = b(D); F !== null && (!(F.expirationTime > Be) || be && !Le()); ) {
          var M = F.callback;
          if (typeof M == "function") {
            F.callback = null, I = F.priorityLevel;
            var _ = M(F.expirationTime <= Be);
            Be = E.unstable_now(), typeof _ == "function" ? F.callback = _ : F === b(D) && K(D), ce(Be);
          } else K(D);
          F = b(D);
        }
        if (F !== null) var pe = !0;
        else {
          var Ye = b(B);
          Ye !== null && De(ge, Ye.startTime - Be), pe = !1;
        }
        return pe;
      } finally {
        F = null, I = Re, ne = !1;
      }
    }
    var ue = !1, G = null, Ce = -1, ve = 5, Te = -1;
    function Le() {
      return !(E.unstable_now() - Te < ve);
    }
    function Ge() {
      if (G !== null) {
        var be = E.unstable_now();
        Te = be;
        var Be = !0;
        try {
          Be = G(!0, be);
        } finally {
          Be ? ae() : (ue = !1, G = null);
        }
      } else ue = !1;
    }
    var ae;
    if (typeof se == "function") ae = function() {
      se(Ge);
    };
    else if (typeof MessageChannel < "u") {
      var Fe = new MessageChannel(), nt = Fe.port2;
      Fe.port1.onmessage = Ge, ae = function() {
        nt.postMessage(null);
      };
    } else ae = function() {
      me(Ge, 0);
    };
    function we(be) {
      G = be, ue || (ue = !0, ae());
    }
    function De(be, Be) {
      Ce = me(function() {
        be(E.unstable_now());
      }, Be);
    }
    E.unstable_IdlePriority = 5, E.unstable_ImmediatePriority = 1, E.unstable_LowPriority = 4, E.unstable_NormalPriority = 3, E.unstable_Profiling = null, E.unstable_UserBlockingPriority = 2, E.unstable_cancelCallback = function(be) {
      be.callback = null;
    }, E.unstable_continueExecution = function() {
      ie || ne || (ie = !0, we(fe));
    }, E.unstable_forceFrameRate = function(be) {
      0 > be || 125 < be ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ve = 0 < be ? Math.floor(1e3 / be) : 5;
    }, E.unstable_getCurrentPriorityLevel = function() {
      return I;
    }, E.unstable_getFirstCallbackNode = function() {
      return b(D);
    }, E.unstable_next = function(be) {
      switch (I) {
        case 1:
        case 2:
        case 3:
          var Be = 3;
          break;
        default:
          Be = I;
      }
      var Re = I;
      I = Be;
      try {
        return be();
      } finally {
        I = Re;
      }
    }, E.unstable_pauseExecution = function() {
    }, E.unstable_requestPaint = function() {
    }, E.unstable_runWithPriority = function(be, Be) {
      switch (be) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          be = 3;
      }
      var Re = I;
      I = be;
      try {
        return Be();
      } finally {
        I = Re;
      }
    }, E.unstable_scheduleCallback = function(be, Be, Re) {
      var M = E.unstable_now();
      switch (typeof Re == "object" && Re !== null ? (Re = Re.delay, Re = typeof Re == "number" && 0 < Re ? M + Re : M) : Re = M, be) {
        case 1:
          var _ = -1;
          break;
        case 2:
          _ = 250;
          break;
        case 5:
          _ = 1073741823;
          break;
        case 4:
          _ = 1e4;
          break;
        default:
          _ = 5e3;
      }
      return _ = Re + _, be = { id: oe++, callback: Be, priorityLevel: be, startTime: Re, expirationTime: _, sortIndex: -1 }, Re > M ? (be.sortIndex = Re, x(B, be), b(D) === null && be === b(B) && (Z ? (Ue(Ce), Ce = -1) : Z = !0, De(ge, Re - M))) : (be.sortIndex = _, x(D, be), ie || ne || (ie = !0, we(fe))), be;
    }, E.unstable_shouldYield = Le, E.unstable_wrapCallback = function(be) {
      var Be = I;
      return function() {
        var Re = I;
        I = Be;
        try {
          return be.apply(this, arguments);
        } finally {
          I = Re;
        }
      };
    };
  }(EE)), EE;
}
var xE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hw;
function kj() {
  return hw || (hw = 1, function(E) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var x = !1, b = 5;
      function K(Me, Je) {
        var Ct = Me.length;
        Me.push(Je), g(Me, Je, Ct);
      }
      function J(Me) {
        return Me.length === 0 ? null : Me[0];
      }
      function j(Me) {
        if (Me.length === 0)
          return null;
        var Je = Me[0], Ct = Me.pop();
        return Ct !== Je && (Me[0] = Ct, re(Me, Ct, 0)), Je;
      }
      function g(Me, Je, Ct) {
        for (var Yt = Ct; Yt > 0; ) {
          var un = Yt - 1 >>> 1, tn = Me[un];
          if (D(tn, Je) > 0)
            Me[un] = Je, Me[Yt] = tn, Yt = un;
          else
            return;
        }
      }
      function re(Me, Je, Ct) {
        for (var Yt = Ct, un = Me.length, tn = un >>> 1; Yt < tn; ) {
          var mn = (Yt + 1) * 2 - 1, Gn = Me[mn], sn = mn + 1, Ut = Me[sn];
          if (D(Gn, Je) < 0)
            sn < un && D(Ut, Gn) < 0 ? (Me[Yt] = Ut, Me[sn] = Je, Yt = sn) : (Me[Yt] = Gn, Me[mn] = Je, Yt = mn);
          else if (sn < un && D(Ut, Je) < 0)
            Me[Yt] = Ut, Me[sn] = Je, Yt = sn;
          else
            return;
        }
      }
      function D(Me, Je) {
        var Ct = Me.sortIndex - Je.sortIndex;
        return Ct !== 0 ? Ct : Me.id - Je.id;
      }
      var B = 1, oe = 2, F = 3, I = 4, ne = 5;
      function ie(Me, Je) {
      }
      var Z = typeof performance == "object" && typeof performance.now == "function";
      if (Z) {
        var me = performance;
        E.unstable_now = function() {
          return me.now();
        };
      } else {
        var Ue = Date, se = Ue.now();
        E.unstable_now = function() {
          return Ue.now() - se;
        };
      }
      var ce = 1073741823, ge = -1, fe = 250, ue = 5e3, G = 1e4, Ce = ce, ve = [], Te = [], Le = 1, Ge = null, ae = F, Fe = !1, nt = !1, we = !1, De = typeof setTimeout == "function" ? setTimeout : null, be = typeof clearTimeout == "function" ? clearTimeout : null, Be = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function Re(Me) {
        for (var Je = J(Te); Je !== null; ) {
          if (Je.callback === null)
            j(Te);
          else if (Je.startTime <= Me)
            j(Te), Je.sortIndex = Je.expirationTime, K(ve, Je);
          else
            return;
          Je = J(Te);
        }
      }
      function M(Me) {
        if (we = !1, Re(Me), !nt)
          if (J(ve) !== null)
            nt = !0, Dn(_);
          else {
            var Je = J(Te);
            Je !== null && fr(M, Je.startTime - Me);
          }
      }
      function _(Me, Je) {
        nt = !1, we && (we = !1, on()), Fe = !0;
        var Ct = ae;
        try {
          var Yt;
          if (!x) return pe(Me, Je);
        } finally {
          Ge = null, ae = Ct, Fe = !1;
        }
      }
      function pe(Me, Je) {
        var Ct = Je;
        for (Re(Ct), Ge = J(ve); Ge !== null && !(Ge.expirationTime > Ct && (!Me || Zr())); ) {
          var Yt = Ge.callback;
          if (typeof Yt == "function") {
            Ge.callback = null, ae = Ge.priorityLevel;
            var un = Ge.expirationTime <= Ct, tn = Yt(un);
            Ct = E.unstable_now(), typeof tn == "function" ? Ge.callback = tn : Ge === J(ve) && j(ve), Re(Ct);
          } else
            j(ve);
          Ge = J(ve);
        }
        if (Ge !== null)
          return !0;
        var mn = J(Te);
        return mn !== null && fr(M, mn.startTime - Ct), !1;
      }
      function Ye(Me, Je) {
        switch (Me) {
          case B:
          case oe:
          case F:
          case I:
          case ne:
            break;
          default:
            Me = F;
        }
        var Ct = ae;
        ae = Me;
        try {
          return Je();
        } finally {
          ae = Ct;
        }
      }
      function Rt(Me) {
        var Je;
        switch (ae) {
          case B:
          case oe:
          case F:
            Je = F;
            break;
          default:
            Je = ae;
            break;
        }
        var Ct = ae;
        ae = Je;
        try {
          return Me();
        } finally {
          ae = Ct;
        }
      }
      function gt(Me) {
        var Je = ae;
        return function() {
          var Ct = ae;
          ae = Je;
          try {
            return Me.apply(this, arguments);
          } finally {
            ae = Ct;
          }
        };
      }
      function pt(Me, Je, Ct) {
        var Yt = E.unstable_now(), un;
        if (typeof Ct == "object" && Ct !== null) {
          var tn = Ct.delay;
          typeof tn == "number" && tn > 0 ? un = Yt + tn : un = Yt;
        } else
          un = Yt;
        var mn;
        switch (Me) {
          case B:
            mn = ge;
            break;
          case oe:
            mn = fe;
            break;
          case ne:
            mn = Ce;
            break;
          case I:
            mn = G;
            break;
          case F:
          default:
            mn = ue;
            break;
        }
        var Gn = un + mn, sn = {
          id: Le++,
          callback: Je,
          priorityLevel: Me,
          startTime: un,
          expirationTime: Gn,
          sortIndex: -1
        };
        return un > Yt ? (sn.sortIndex = un, K(Te, sn), J(ve) === null && sn === J(Te) && (we ? on() : we = !0, fr(M, un - Yt))) : (sn.sortIndex = Gn, K(ve, sn), !nt && !Fe && (nt = !0, Dn(_))), sn;
      }
      function xt() {
      }
      function wt() {
        !nt && !Fe && (nt = !0, Dn(_));
      }
      function en() {
        return J(ve);
      }
      function Nn(Me) {
        Me.callback = null;
      }
      function cr() {
        return ae;
      }
      var gn = !1, Pn = null, jt = -1, ln = b, Rn = -1;
      function Zr() {
        var Me = E.unstable_now() - Rn;
        return !(Me < ln);
      }
      function Or() {
      }
      function Hn(Me) {
        if (Me < 0 || Me > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        Me > 0 ? ln = Math.floor(1e3 / Me) : ln = b;
      }
      var _n = function() {
        if (Pn !== null) {
          var Me = E.unstable_now();
          Rn = Me;
          var Je = !0, Ct = !0;
          try {
            Ct = Pn(Je, Me);
          } finally {
            Ct ? Un() : (gn = !1, Pn = null);
          }
        } else
          gn = !1;
      }, Un;
      if (typeof Be == "function")
        Un = function() {
          Be(_n);
        };
      else if (typeof MessageChannel < "u") {
        var ar = new MessageChannel(), ea = ar.port2;
        ar.port1.onmessage = _n, Un = function() {
          ea.postMessage(null);
        };
      } else
        Un = function() {
          De(_n, 0);
        };
      function Dn(Me) {
        Pn = Me, gn || (gn = !0, Un());
      }
      function fr(Me, Je) {
        jt = De(function() {
          Me(E.unstable_now());
        }, Je);
      }
      function on() {
        be(jt), jt = -1;
      }
      var ta = Or, Ea = null;
      E.unstable_IdlePriority = ne, E.unstable_ImmediatePriority = B, E.unstable_LowPriority = I, E.unstable_NormalPriority = F, E.unstable_Profiling = Ea, E.unstable_UserBlockingPriority = oe, E.unstable_cancelCallback = Nn, E.unstable_continueExecution = wt, E.unstable_forceFrameRate = Hn, E.unstable_getCurrentPriorityLevel = cr, E.unstable_getFirstCallbackNode = en, E.unstable_next = Rt, E.unstable_pauseExecution = xt, E.unstable_requestPaint = ta, E.unstable_runWithPriority = Ye, E.unstable_scheduleCallback = pt, E.unstable_shouldYield = Zr, E.unstable_wrapCallback = gt, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(xE)), xE;
}
var mw;
function Tw() {
  return mw || (mw = 1, process.env.NODE_ENV === "production" ? Zm.exports = _j() : Zm.exports = kj()), Zm.exports;
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
var yw;
function jj() {
  if (yw) return Ja;
  yw = 1;
  var E = z, x = Tw();
  function b(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var K = /* @__PURE__ */ new Set(), J = {};
  function j(n, r) {
    g(n, r), g(n + "Capture", r);
  }
  function g(n, r) {
    for (J[n] = r, n = 0; n < r.length; n++) K.add(r[n]);
  }
  var re = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), D = Object.prototype.hasOwnProperty, B = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, oe = {}, F = {};
  function I(n) {
    return D.call(F, n) ? !0 : D.call(oe, n) ? !1 : B.test(n) ? F[n] = !0 : (oe[n] = !0, !1);
  }
  function ne(n, r, l, u) {
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
  function ie(n, r, l, u) {
    if (r === null || typeof r > "u" || ne(n, r, l, u)) return !0;
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
  function Z(n, r, l, u, c, p, y) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = u, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = p, this.removeEmptyString = y;
  }
  var me = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    me[n] = new Z(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    me[r] = new Z(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    me[n] = new Z(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    me[n] = new Z(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    me[n] = new Z(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    me[n] = new Z(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    me[n] = new Z(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    me[n] = new Z(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    me[n] = new Z(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Ue = /[\-:]([a-z])/g;
  function se(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Ue,
      se
    );
    me[r] = new Z(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Ue, se);
    me[r] = new Z(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Ue, se);
    me[r] = new Z(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    me[n] = new Z(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), me.xlinkHref = new Z("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    me[n] = new Z(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function ce(n, r, l, u) {
    var c = me.hasOwnProperty(r) ? me[r] : null;
    (c !== null ? c.type !== 0 : u || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ie(r, l, c, u) && (l = null), u || c === null ? I(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, u = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, u ? n.setAttributeNS(u, r, l) : n.setAttribute(r, l))));
  }
  var ge = E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, fe = Symbol.for("react.element"), ue = Symbol.for("react.portal"), G = Symbol.for("react.fragment"), Ce = Symbol.for("react.strict_mode"), ve = Symbol.for("react.profiler"), Te = Symbol.for("react.provider"), Le = Symbol.for("react.context"), Ge = Symbol.for("react.forward_ref"), ae = Symbol.for("react.suspense"), Fe = Symbol.for("react.suspense_list"), nt = Symbol.for("react.memo"), we = Symbol.for("react.lazy"), De = Symbol.for("react.offscreen"), be = Symbol.iterator;
  function Be(n) {
    return n === null || typeof n != "object" ? null : (n = be && n[be] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var Re = Object.assign, M;
  function _(n) {
    if (M === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      M = r && r[1] || "";
    }
    return `
` + M + n;
  }
  var pe = !1;
  function Ye(n, r) {
    if (!n || pe) return "";
    pe = !0;
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
`), p = u.stack.split(`
`), y = c.length - 1, w = p.length - 1; 1 <= y && 0 <= w && c[y] !== p[w]; ) w--;
        for (; 1 <= y && 0 <= w; y--, w--) if (c[y] !== p[w]) {
          if (y !== 1 || w !== 1)
            do
              if (y--, w--, 0 > w || c[y] !== p[w]) {
                var k = `
` + c[y].replace(" at new ", " at ");
                return n.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", n.displayName)), k;
              }
            while (1 <= y && 0 <= w);
          break;
        }
      }
    } finally {
      pe = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? _(n) : "";
  }
  function Rt(n) {
    switch (n.tag) {
      case 5:
        return _(n.type);
      case 16:
        return _("Lazy");
      case 13:
        return _("Suspense");
      case 19:
        return _("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Ye(n.type, !1), n;
      case 11:
        return n = Ye(n.type.render, !1), n;
      case 1:
        return n = Ye(n.type, !0), n;
      default:
        return "";
    }
  }
  function gt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case G:
        return "Fragment";
      case ue:
        return "Portal";
      case ve:
        return "Profiler";
      case Ce:
        return "StrictMode";
      case ae:
        return "Suspense";
      case Fe:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case Le:
        return (n.displayName || "Context") + ".Consumer";
      case Te:
        return (n._context.displayName || "Context") + ".Provider";
      case Ge:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case nt:
        return r = n.displayName || null, r !== null ? r : gt(n.type) || "Memo";
      case we:
        r = n._payload, n = n._init;
        try {
          return gt(n(r));
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
        return gt(r);
      case 8:
        return r === Ce ? "StrictMode" : "Mode";
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
  function xt(n) {
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
  function en(n) {
    var r = wt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), u = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, p = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(y) {
        u = "" + y, p.call(this, y);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return u;
      }, setValue: function(y) {
        u = "" + y;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function Nn(n) {
    n._valueTracker || (n._valueTracker = en(n));
  }
  function cr(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), u = "";
    return n && (u = wt(n) ? n.checked ? "true" : "false" : n.value), n = u, n !== l ? (r.setValue(n), !0) : !1;
  }
  function gn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function Pn(n, r) {
    var l = r.checked;
    return Re({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function jt(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, u = r.checked != null ? r.checked : r.defaultChecked;
    l = xt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: u, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function ln(n, r) {
    r = r.checked, r != null && ce(n, "checked", r, !1);
  }
  function Rn(n, r) {
    ln(n, r);
    var l = xt(r.value), u = r.type;
    if (l != null) u === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (u === "submit" || u === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? Or(n, r.type, l) : r.hasOwnProperty("defaultValue") && Or(n, r.type, xt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Zr(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var u = r.type;
      if (!(u !== "submit" && u !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function Or(n, r, l) {
    (r !== "number" || gn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Hn = Array.isArray;
  function _n(n, r, l, u) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && u && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + xt(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, u && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Un(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(b(91));
    return Re({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function ar(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(b(92));
        if (Hn(l)) {
          if (1 < l.length) throw Error(b(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: xt(l) };
  }
  function ea(n, r) {
    var l = xt(r.value), u = xt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), u != null && (n.defaultValue = "" + u);
  }
  function Dn(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function fr(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function on(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? fr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var ta, Ea = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, u, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, u, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (ta = ta || document.createElement("div"), ta.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = ta.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function Me(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var Je = {
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
  }, Ct = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Je).forEach(function(n) {
    Ct.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), Je[r] = Je[n];
    });
  });
  function Yt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || Je.hasOwnProperty(n) && Je[n] ? ("" + r).trim() : r + "px";
  }
  function un(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var u = l.indexOf("--") === 0, c = Yt(l, r[l], u);
      l === "float" && (l = "cssFloat"), u ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var tn = Re({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function mn(n, r) {
    if (r) {
      if (tn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(b(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(b(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(b(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(b(62));
    }
  }
  function Gn(n, r) {
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
  var sn = null;
  function Ut(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var nn = null, yr = null, Sn = null;
  function na(n) {
    if (n = at(n)) {
      if (typeof nn != "function") throw Error(b(280));
      var r = n.stateNode;
      r && (r = Ln(r), nn(n.stateNode, n.type, r));
    }
  }
  function ei(n) {
    yr ? Sn ? Sn.push(n) : Sn = [n] : yr = n;
  }
  function La() {
    if (yr) {
      var n = yr, r = Sn;
      if (Sn = yr = null, na(n), r) for (n = 0; n < r.length; n++) na(r[n]);
    }
  }
  function $i(n, r) {
    return n(r);
  }
  function yi() {
  }
  var gi = !1;
  function Si(n, r, l) {
    if (gi) return n(r, l);
    gi = !0;
    try {
      return $i(n, r, l);
    } finally {
      gi = !1, (yr !== null || Sn !== null) && (yi(), La());
    }
  }
  function Se(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var u = Ln(l);
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
  var A = !1;
  if (re) try {
    var de = {};
    Object.defineProperty(de, "passive", { get: function() {
      A = !0;
    } }), window.addEventListener("test", de, de), window.removeEventListener("test", de, de);
  } catch {
    A = !1;
  }
  function vt(n, r, l, u, c, p, y, w, k) {
    var Q = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, Q);
    } catch (Ee) {
      this.onError(Ee);
    }
  }
  var St = !1, At = null, Qt = !1, T = null, X = { onError: function(n) {
    St = !0, At = n;
  } };
  function Ne(n, r, l, u, c, p, y, w, k) {
    St = !1, At = null, vt.apply(X, arguments);
  }
  function Oe(n, r, l, u, c, p, y, w, k) {
    if (Ne.apply(this, arguments), St) {
      if (St) {
        var Q = At;
        St = !1, At = null;
      } else throw Error(b(198));
      Qt || (Qt = !0, T = Q);
    }
  }
  function rt(n) {
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
  function Lt(n) {
    if (rt(n) !== n) throw Error(b(188));
  }
  function Dt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = rt(n), r === null) throw Error(b(188));
      return r !== n ? null : n;
    }
    for (var l = n, u = r; ; ) {
      var c = l.return;
      if (c === null) break;
      var p = c.alternate;
      if (p === null) {
        if (u = c.return, u !== null) {
          l = u;
          continue;
        }
        break;
      }
      if (c.child === p.child) {
        for (p = c.child; p; ) {
          if (p === l) return Lt(c), n;
          if (p === u) return Lt(c), r;
          p = p.sibling;
        }
        throw Error(b(188));
      }
      if (l.return !== u.return) l = c, u = p;
      else {
        for (var y = !1, w = c.child; w; ) {
          if (w === l) {
            y = !0, l = c, u = p;
            break;
          }
          if (w === u) {
            y = !0, u = c, l = p;
            break;
          }
          w = w.sibling;
        }
        if (!y) {
          for (w = p.child; w; ) {
            if (w === l) {
              y = !0, l = p, u = c;
              break;
            }
            if (w === u) {
              y = !0, u = p, l = c;
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
  function Bn(n) {
    return n = Dt(n), n !== null ? En(n) : null;
  }
  function En(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = En(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var bn = x.unstable_scheduleCallback, gr = x.unstable_cancelCallback, ti = x.unstable_shouldYield, ni = x.unstable_requestPaint, Tt = x.unstable_now, kt = x.unstable_getCurrentPriorityLevel, ri = x.unstable_ImmediatePriority, ao = x.unstable_UserBlockingPriority, io = x.unstable_NormalPriority, Sl = x.unstable_LowPriority, qo = x.unstable_IdlePriority, El = null, ra = null;
  function Wu(n) {
    if (ra && typeof ra.onCommitFiberRoot == "function") try {
      ra.onCommitFiberRoot(El, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Ur = Math.clz32 ? Math.clz32 : Xo, sc = Math.log, cc = Math.LN2;
  function Xo(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (sc(n) / cc | 0) | 0;
  }
  var xl = 64, xa = 4194304;
  function ai(n) {
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
  function ii(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var u = 0, c = n.suspendedLanes, p = n.pingedLanes, y = l & 268435455;
    if (y !== 0) {
      var w = y & ~c;
      w !== 0 ? u = ai(w) : (p &= y, p !== 0 && (u = ai(p)));
    } else y = l & ~c, y !== 0 ? u = ai(y) : p !== 0 && (u = ai(p));
    if (u === 0) return 0;
    if (r !== 0 && r !== u && !(r & c) && (c = u & -u, p = r & -r, c >= p || c === 16 && (p & 4194240) !== 0)) return r;
    if (u & 4 && (u |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= u; 0 < r; ) l = 31 - Ur(r), c = 1 << l, u |= n[l], r &= ~c;
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
    for (var l = n.suspendedLanes, u = n.pingedLanes, c = n.expirationTimes, p = n.pendingLanes; 0 < p; ) {
      var y = 31 - Ur(p), w = 1 << y, k = c[y];
      k === -1 ? (!(w & l) || w & u) && (c[y] = Jo(w, r)) : k <= r && (n.expiredLanes |= w), p &= ~w;
    }
  }
  function Cl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Zo() {
    var n = xl;
    return xl <<= 1, !(xl & 4194240) && (xl = 64), n;
  }
  function eu(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Yi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Ur(r), n[r] = l;
  }
  function qf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var u = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - Ur(l), p = 1 << c;
      r[c] = 0, u[c] = -1, n[c] = -1, l &= ~p;
    }
  }
  function Qi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var u = 31 - Ur(l), c = 1 << u;
      c & r | n[u] & r && (n[u] |= r), l &= ~c;
    }
  }
  var Gt = 0;
  function tu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var It, Gu, Ei, yt, nu, Sr = !1, xi = [], Fr = null, Ci = null, wn = null, cn = /* @__PURE__ */ new Map(), bl = /* @__PURE__ */ new Map(), ir = [], Pr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ma(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Fr = null;
        break;
      case "dragenter":
      case "dragleave":
        Ci = null;
        break;
      case "mouseover":
      case "mouseout":
        wn = null;
        break;
      case "pointerover":
      case "pointerout":
        cn.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        bl.delete(r.pointerId);
    }
  }
  function oo(n, r, l, u, c, p) {
    return n === null || n.nativeEvent !== p ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: u, nativeEvent: p, targetContainers: [c] }, r !== null && (r = at(r), r !== null && Gu(r)), n) : (n.eventSystemFlags |= u, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Ku(n, r, l, u, c) {
    switch (r) {
      case "focusin":
        return Fr = oo(Fr, n, r, l, u, c), !0;
      case "dragenter":
        return Ci = oo(Ci, n, r, l, u, c), !0;
      case "mouseover":
        return wn = oo(wn, n, r, l, u, c), !0;
      case "pointerover":
        var p = c.pointerId;
        return cn.set(p, oo(cn.get(p) || null, n, r, l, u, c)), !0;
      case "gotpointercapture":
        return p = c.pointerId, bl.set(p, oo(bl.get(p) || null, n, r, l, u, c)), !0;
    }
    return !1;
  }
  function qu(n) {
    var r = yo(n.target);
    if (r !== null) {
      var l = rt(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = ht(l), r !== null) {
            n.blockedOn = r, nu(n.priority, function() {
              Ei(l);
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
  function wl(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = iu(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var u = new l.constructor(l.type, l);
        sn = u, l.target.dispatchEvent(u), sn = null;
      } else return r = at(l), r !== null && Gu(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function uo(n, r, l) {
    wl(n) && l.delete(r);
  }
  function Xf() {
    Sr = !1, Fr !== null && wl(Fr) && (Fr = null), Ci !== null && wl(Ci) && (Ci = null), wn !== null && wl(wn) && (wn = null), cn.forEach(uo), bl.forEach(uo);
  }
  function Aa(n, r) {
    n.blockedOn === r && (n.blockedOn = null, Sr || (Sr = !0, x.unstable_scheduleCallback(x.unstable_NormalPriority, Xf)));
  }
  function li(n) {
    function r(c) {
      return Aa(c, n);
    }
    if (0 < xi.length) {
      Aa(xi[0], n);
      for (var l = 1; l < xi.length; l++) {
        var u = xi[l];
        u.blockedOn === n && (u.blockedOn = null);
      }
    }
    for (Fr !== null && Aa(Fr, n), Ci !== null && Aa(Ci, n), wn !== null && Aa(wn, n), cn.forEach(r), bl.forEach(r), l = 0; l < ir.length; l++) u = ir[l], u.blockedOn === n && (u.blockedOn = null);
    for (; 0 < ir.length && (l = ir[0], l.blockedOn === null); ) qu(l), l.blockedOn === null && ir.shift();
  }
  var bi = ge.ReactCurrentBatchConfig, za = !0;
  function ru(n, r, l, u) {
    var c = Gt, p = bi.transition;
    bi.transition = null;
    try {
      Gt = 1, Tl(n, r, l, u);
    } finally {
      Gt = c, bi.transition = p;
    }
  }
  function au(n, r, l, u) {
    var c = Gt, p = bi.transition;
    bi.transition = null;
    try {
      Gt = 4, Tl(n, r, l, u);
    } finally {
      Gt = c, bi.transition = p;
    }
  }
  function Tl(n, r, l, u) {
    if (za) {
      var c = iu(n, r, l, u);
      if (c === null) Cc(n, r, u, so, l), Ma(n, u);
      else if (Ku(c, n, r, l, u)) u.stopPropagation();
      else if (Ma(n, u), r & 4 && -1 < Pr.indexOf(n)) {
        for (; c !== null; ) {
          var p = at(c);
          if (p !== null && It(p), p = iu(n, r, l, u), p === null && Cc(n, r, u, so, l), p === c) break;
          c = p;
        }
        c !== null && u.stopPropagation();
      } else Cc(n, r, u, null, l);
    }
  }
  var so = null;
  function iu(n, r, l, u) {
    if (so = null, n = Ut(u), n = yo(n), n !== null) if (r = rt(n), r === null) n = null;
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
        switch (kt()) {
          case ri:
            return 1;
          case ao:
            return 4;
          case io:
          case Sl:
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
  var oi = null, m = null, R = null;
  function Y() {
    if (R) return R;
    var n, r = m, l = r.length, u, c = "value" in oi ? oi.value : oi.textContent, p = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var y = l - n;
    for (u = 1; u <= y && r[l - u] === c[p - u]; u++) ;
    return R = c.slice(n, 1 < u ? 1 - u : void 0);
  }
  function q(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function je() {
    return !0;
  }
  function lt() {
    return !1;
  }
  function ze(n) {
    function r(l, u, c, p, y) {
      this._reactName = l, this._targetInst = c, this.type = u, this.nativeEvent = p, this.target = y, this.currentTarget = null;
      for (var w in n) n.hasOwnProperty(w) && (l = n[w], this[w] = l ? l(p) : p[w]);
      return this.isDefaultPrevented = (p.defaultPrevented != null ? p.defaultPrevented : p.returnValue === !1) ? je : lt, this.isPropagationStopped = lt, this;
    }
    return Re(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = je);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = je);
    }, persist: function() {
    }, isPersistent: je }), r;
  }
  var st = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Mt = ze(st), $t = Re({}, st, { view: 0, detail: 0 }), xn = ze($t), fn, Nt, dn, On = Re({}, $t, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: nd, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== dn && (dn && n.type === "mousemove" ? (fn = n.screenX - dn.screenX, Nt = n.screenY - dn.screenY) : Nt = fn = 0, dn = n), fn);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : Nt;
  } }), Rl = ze(On), Xu = Re({}, On, { dataTransfer: 0 }), Wi = ze(Xu), Ju = Re({}, $t, { relatedTarget: 0 }), co = ze(Ju), Jf = Re({}, st, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), fc = ze(Jf), Zf = Re({}, st, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), uv = ze(Zf), ed = Re({}, st, { data: 0 }), td = ze(ed), sv = {
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
  function Gi(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ay[n]) ? !!r[n] : !1;
  }
  function nd() {
    return Gi;
  }
  var rd = Re({}, $t, { key: function(n) {
    if (n.key) {
      var r = sv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = q(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? cv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: nd, charCode: function(n) {
    return n.type === "keypress" ? q(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? q(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), ad = ze(rd), id = Re({}, On, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), fv = ze(id), dc = Re({}, $t, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: nd }), dv = ze(dc), aa = Re({}, st, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Ki = ze(aa), Kn = Re({}, On, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), qi = ze(Kn), ld = [9, 13, 27, 32], ou = re && "CompositionEvent" in window, Zu = null;
  re && "documentMode" in document && (Zu = document.documentMode);
  var es = re && "TextEvent" in window && !Zu, pv = re && (!ou || Zu && 8 < Zu && 11 >= Zu), vv = " ", pc = !1;
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
    if (uu) return n === "compositionend" || !ou && hv(n, r) ? (n = Y(), R = m = oi = null, uu = !1, n) : null;
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
    ei(u), r = ls(r, "onChange"), 0 < r.length && (l = new Mt("onChange", "change", null, l, u), n.push({ event: l, listeners: r }));
  }
  var wi = null, fo = null;
  function Sv(n) {
    ho(n, 0);
  }
  function ts(n) {
    var r = si(n);
    if (cr(r)) return n;
  }
  function oy(n, r) {
    if (n === "change") return r;
  }
  var Ev = !1;
  if (re) {
    var ud;
    if (re) {
      var sd = "oninput" in document;
      if (!sd) {
        var xv = document.createElement("div");
        xv.setAttribute("oninput", "return;"), sd = typeof xv.oninput == "function";
      }
      ud = sd;
    } else ud = !1;
    Ev = ud && (!document.documentMode || 9 < document.documentMode);
  }
  function Cv() {
    wi && (wi.detachEvent("onpropertychange", bv), fo = wi = null);
  }
  function bv(n) {
    if (n.propertyName === "value" && ts(fo)) {
      var r = [];
      od(r, fo, n, Ut(n)), Si(Sv, r);
    }
  }
  function uy(n, r, l) {
    n === "focusin" ? (Cv(), wi = r, fo = l, wi.attachEvent("onpropertychange", bv)) : n === "focusout" && Cv();
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
  var ui = typeof Object.is == "function" ? Object.is : cy;
  function ns(n, r) {
    if (ui(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), u = Object.keys(r);
    if (l.length !== u.length) return !1;
    for (u = 0; u < l.length; u++) {
      var c = l[u];
      if (!D.call(r, c) || !ui(n[c], r[c])) return !1;
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
  function _l(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? _l(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function rs() {
    for (var n = window, r = gn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = gn(n.document);
    }
    return r;
  }
  function hc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function su(n) {
    var r = rs(), l = n.focusedElem, u = n.selectionRange;
    if (r !== l && l && l.ownerDocument && _l(l.ownerDocument.documentElement, l)) {
      if (u !== null && hc(l)) {
        if (r = u.start, n = u.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, p = Math.min(u.start, c);
          u = u.end === void 0 ? p : Math.min(u.end, c), !n.extend && p > u && (c = u, u = p, p = c), c = vc(l, p);
          var y = vc(
            l,
            u
          );
          c && y && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== y.node || n.focusOffset !== y.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), p > u ? (n.addRange(r), n.extend(y.node, y.offset)) : (r.setEnd(y.node, y.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++) n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var fy = re && "documentMode" in document && 11 >= document.documentMode, cu = null, cd = null, as = null, fd = !1;
  function dd(n, r, l) {
    var u = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    fd || cu == null || cu !== gn(u) || (u = cu, "selectionStart" in u && hc(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = { anchorNode: u.anchorNode, anchorOffset: u.anchorOffset, focusNode: u.focusNode, focusOffset: u.focusOffset }), as && ns(as, u) || (as = u, u = ls(cd, "onSelect"), 0 < u.length && (r = new Mt("onSelect", "select", null, r, l), n.push({ event: r, listeners: u }), r.target = cu)));
  }
  function mc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var po = { animationend: mc("Animation", "AnimationEnd"), animationiteration: mc("Animation", "AnimationIteration"), animationstart: mc("Animation", "AnimationStart"), transitionend: mc("Transition", "TransitionEnd") }, Er = {}, pd = {};
  re && (pd = document.createElement("div").style, "AnimationEvent" in window || (delete po.animationend.animation, delete po.animationiteration.animation, delete po.animationstart.animation), "TransitionEvent" in window || delete po.transitionend.transition);
  function yc(n) {
    if (Er[n]) return Er[n];
    if (!po[n]) return n;
    var r = po[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in pd) return Er[n] = r[l];
    return n;
  }
  var _v = yc("animationend"), kv = yc("animationiteration"), jv = yc("animationstart"), Nv = yc("transitionend"), vd = /* @__PURE__ */ new Map(), gc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Ua(n, r) {
    vd.set(n, r), j(r, [n]);
  }
  for (var hd = 0; hd < gc.length; hd++) {
    var vo = gc[hd], dy = vo.toLowerCase(), py = vo[0].toUpperCase() + vo.slice(1);
    Ua(dy, "on" + py);
  }
  Ua(_v, "onAnimationEnd"), Ua(kv, "onAnimationIteration"), Ua(jv, "onAnimationStart"), Ua("dblclick", "onDoubleClick"), Ua("focusin", "onFocus"), Ua("focusout", "onBlur"), Ua(Nv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), j("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), j("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), j("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), j("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), j("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), j("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var is = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), md = new Set("cancel close invalid load scroll toggle".split(" ").concat(is));
  function Sc(n, r, l) {
    var u = n.type || "unknown-event";
    n.currentTarget = l, Oe(u, r, void 0, n), n.currentTarget = null;
  }
  function ho(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var u = n[l], c = u.event;
      u = u.listeners;
      e: {
        var p = void 0;
        if (r) for (var y = u.length - 1; 0 <= y; y--) {
          var w = u[y], k = w.instance, Q = w.currentTarget;
          if (w = w.listener, k !== p && c.isPropagationStopped()) break e;
          Sc(c, w, Q), p = k;
        }
        else for (y = 0; y < u.length; y++) {
          if (w = u[y], k = w.instance, Q = w.currentTarget, w = w.listener, k !== p && c.isPropagationStopped()) break e;
          Sc(c, w, Q), p = k;
        }
      }
    }
    if (Qt) throw n = T, Qt = !1, T = null, n;
  }
  function rn(n, r) {
    var l = r[ss];
    l === void 0 && (l = r[ss] = /* @__PURE__ */ new Set());
    var u = n + "__bubble";
    l.has(u) || (Dv(r, n, 2, !1), l.add(u));
  }
  function Ec(n, r, l) {
    var u = 0;
    r && (u |= 4), Dv(l, n, u, r);
  }
  var xc = "_reactListening" + Math.random().toString(36).slice(2);
  function fu(n) {
    if (!n[xc]) {
      n[xc] = !0, K.forEach(function(l) {
        l !== "selectionchange" && (md.has(l) || Ec(l, !1, n), Ec(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[xc] || (r[xc] = !0, Ec("selectionchange", !1, r));
    }
  }
  function Dv(n, r, l, u) {
    switch (lu(r)) {
      case 1:
        var c = ru;
        break;
      case 4:
        c = au;
        break;
      default:
        c = Tl;
    }
    l = c.bind(null, r, l, n), c = void 0, !A || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), u ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function Cc(n, r, l, u, c) {
    var p = u;
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
            u = p = y;
            continue e;
          }
          w = w.parentNode;
        }
      }
      u = u.return;
    }
    Si(function() {
      var Q = p, Ee = Ut(l), _e = [];
      e: {
        var ye = vd.get(n);
        if (ye !== void 0) {
          var Ie = Mt, Ke = n;
          switch (n) {
            case "keypress":
              if (q(l) === 0) break e;
            case "keydown":
            case "keyup":
              Ie = ad;
              break;
            case "focusin":
              Ke = "focus", Ie = co;
              break;
            case "focusout":
              Ke = "blur", Ie = co;
              break;
            case "beforeblur":
            case "afterblur":
              Ie = co;
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
              Ie = Rl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Ie = Wi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Ie = dv;
              break;
            case _v:
            case kv:
            case jv:
              Ie = fc;
              break;
            case Nv:
              Ie = Ki;
              break;
            case "scroll":
              Ie = xn;
              break;
            case "wheel":
              Ie = qi;
              break;
            case "copy":
            case "cut":
            case "paste":
              Ie = uv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Ie = fv;
          }
          var Ze = (r & 4) !== 0, Qn = !Ze && n === "scroll", U = Ze ? ye !== null ? ye + "Capture" : null : ye;
          Ze = [];
          for (var O = Q, V; O !== null; ) {
            V = O;
            var xe = V.stateNode;
            if (V.tag === 5 && xe !== null && (V = xe, U !== null && (xe = Se(O, U), xe != null && Ze.push(du(O, xe, V)))), Qn) break;
            O = O.return;
          }
          0 < Ze.length && (ye = new Ie(ye, Ke, null, l, Ee), _e.push({ event: ye, listeners: Ze }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (ye = n === "mouseover" || n === "pointerover", Ie = n === "mouseout" || n === "pointerout", ye && l !== sn && (Ke = l.relatedTarget || l.fromElement) && (yo(Ke) || Ke[Xi])) break e;
          if ((Ie || ye) && (ye = Ee.window === Ee ? Ee : (ye = Ee.ownerDocument) ? ye.defaultView || ye.parentWindow : window, Ie ? (Ke = l.relatedTarget || l.toElement, Ie = Q, Ke = Ke ? yo(Ke) : null, Ke !== null && (Qn = rt(Ke), Ke !== Qn || Ke.tag !== 5 && Ke.tag !== 6) && (Ke = null)) : (Ie = null, Ke = Q), Ie !== Ke)) {
            if (Ze = Rl, xe = "onMouseLeave", U = "onMouseEnter", O = "mouse", (n === "pointerout" || n === "pointerover") && (Ze = fv, xe = "onPointerLeave", U = "onPointerEnter", O = "pointer"), Qn = Ie == null ? ye : si(Ie), V = Ke == null ? ye : si(Ke), ye = new Ze(xe, O + "leave", Ie, l, Ee), ye.target = Qn, ye.relatedTarget = V, xe = null, yo(Ee) === Q && (Ze = new Ze(U, O + "enter", Ke, l, Ee), Ze.target = V, Ze.relatedTarget = Qn, xe = Ze), Qn = xe, Ie && Ke) t: {
              for (Ze = Ie, U = Ke, O = 0, V = Ze; V; V = kl(V)) O++;
              for (V = 0, xe = U; xe; xe = kl(xe)) V++;
              for (; 0 < O - V; ) Ze = kl(Ze), O--;
              for (; 0 < V - O; ) U = kl(U), V--;
              for (; O--; ) {
                if (Ze === U || U !== null && Ze === U.alternate) break t;
                Ze = kl(Ze), U = kl(U);
              }
              Ze = null;
            }
            else Ze = null;
            Ie !== null && Ov(_e, ye, Ie, Ze, !1), Ke !== null && Qn !== null && Ov(_e, Qn, Ke, Ze, !0);
          }
        }
        e: {
          if (ye = Q ? si(Q) : window, Ie = ye.nodeName && ye.nodeName.toLowerCase(), Ie === "select" || Ie === "input" && ye.type === "file") var qe = oy;
          else if (gv(ye)) if (Ev) qe = Tv;
          else {
            qe = wv;
            var ut = uy;
          }
          else (Ie = ye.nodeName) && Ie.toLowerCase() === "input" && (ye.type === "checkbox" || ye.type === "radio") && (qe = sy);
          if (qe && (qe = qe(n, Q))) {
            od(_e, qe, l, Ee);
            break e;
          }
          ut && ut(n, ye, Q), n === "focusout" && (ut = ye._wrapperState) && ut.controlled && ye.type === "number" && Or(ye, "number", ye.value);
        }
        switch (ut = Q ? si(Q) : window, n) {
          case "focusin":
            (gv(ut) || ut.contentEditable === "true") && (cu = ut, cd = Q, as = null);
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
            fd = !1, dd(_e, l, Ee);
            break;
          case "selectionchange":
            if (fy) break;
          case "keydown":
          case "keyup":
            dd(_e, l, Ee);
        }
        var ct;
        if (ou) e: {
          switch (n) {
            case "compositionstart":
              var mt = "onCompositionStart";
              break e;
            case "compositionend":
              mt = "onCompositionEnd";
              break e;
            case "compositionupdate":
              mt = "onCompositionUpdate";
              break e;
          }
          mt = void 0;
        }
        else uu ? hv(n, l) && (mt = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (mt = "onCompositionStart");
        mt && (pv && l.locale !== "ko" && (uu || mt !== "onCompositionStart" ? mt === "onCompositionEnd" && uu && (ct = Y()) : (oi = Ee, m = "value" in oi ? oi.value : oi.textContent, uu = !0)), ut = ls(Q, mt), 0 < ut.length && (mt = new td(mt, n, null, l, Ee), _e.push({ event: mt, listeners: ut }), ct ? mt.data = ct : (ct = mv(l), ct !== null && (mt.data = ct)))), (ct = es ? yv(n, l) : iy(n, l)) && (Q = ls(Q, "onBeforeInput"), 0 < Q.length && (Ee = new td("onBeforeInput", "beforeinput", null, l, Ee), _e.push({ event: Ee, listeners: Q }), Ee.data = ct));
      }
      ho(_e, r);
    });
  }
  function du(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function ls(n, r) {
    for (var l = r + "Capture", u = []; n !== null; ) {
      var c = n, p = c.stateNode;
      c.tag === 5 && p !== null && (c = p, p = Se(n, l), p != null && u.unshift(du(n, p, c)), p = Se(n, r), p != null && u.push(du(n, p, c))), n = n.return;
    }
    return u;
  }
  function kl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function Ov(n, r, l, u, c) {
    for (var p = r._reactName, y = []; l !== null && l !== u; ) {
      var w = l, k = w.alternate, Q = w.stateNode;
      if (k !== null && k === u) break;
      w.tag === 5 && Q !== null && (w = Q, c ? (k = Se(l, p), k != null && y.unshift(du(l, k, w))) : c || (k = Se(l, p), k != null && y.push(du(l, k, w)))), l = l.return;
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
  function jl() {
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
          n.removeChild(c), li(r);
          return;
        }
        u--;
      } else l !== "$" && l !== "$?" && l !== "$!" || u++;
      l = c;
    } while (l);
    li(r);
  }
  function Ti(n) {
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
  var Nl = Math.random().toString(36).slice(2), Ri = "__reactFiber$" + Nl, us = "__reactProps$" + Nl, Xi = "__reactContainer$" + Nl, ss = "__reactEvents$" + Nl, hu = "__reactListeners$" + Nl, hy = "__reactHandles$" + Nl;
  function yo(n) {
    var r = n[Ri];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Xi] || l[Ri]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = zv(n); n !== null; ) {
          if (l = n[Ri]) return l;
          n = zv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function at(n) {
    return n = n[Ri] || n[Xi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function si(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(b(33));
  }
  function Ln(n) {
    return n[us] || null;
  }
  var Pt = [], Fa = -1;
  function Pa(n) {
    return { current: n };
  }
  function Cn(n) {
    0 > Fa || (n.current = Pt[Fa], Pt[Fa] = null, Fa--);
  }
  function tt(n, r) {
    Fa++, Pt[Fa] = n.current, n.current = r;
  }
  var Lr = {}, Fn = Pa(Lr), lr = Pa(!1), ia = Lr;
  function la(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Lr;
    var u = n.stateNode;
    if (u && u.__reactInternalMemoizedUnmaskedChildContext === r) return u.__reactInternalMemoizedMaskedChildContext;
    var c = {}, p;
    for (p in l) c[p] = r[p];
    return u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function qn(n) {
    return n = n.childContextTypes, n != null;
  }
  function mu() {
    Cn(lr), Cn(Fn);
  }
  function Uv(n, r, l) {
    if (Fn.current !== Lr) throw Error(b(168));
    tt(Fn, r), tt(lr, l);
  }
  function cs(n, r, l) {
    var u = n.stateNode;
    if (r = r.childContextTypes, typeof u.getChildContext != "function") return l;
    u = u.getChildContext();
    for (var c in u) if (!(c in r)) throw Error(b(108, pt(n) || "Unknown", c));
    return Re({}, l, u);
  }
  function dr(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Lr, ia = Fn.current, tt(Fn, n), tt(lr, lr.current), !0;
  }
  function _c(n, r, l) {
    var u = n.stateNode;
    if (!u) throw Error(b(169));
    l ? (n = cs(n, r, ia), u.__reactInternalMemoizedMergedChildContext = n, Cn(lr), Cn(Fn), tt(Fn, n)) : Cn(lr), tt(lr, l);
  }
  var _i = null, yu = !1, Ji = !1;
  function kc(n) {
    _i === null ? _i = [n] : _i.push(n);
  }
  function Dl(n) {
    yu = !0, kc(n);
  }
  function ki() {
    if (!Ji && _i !== null) {
      Ji = !0;
      var n = 0, r = Gt;
      try {
        var l = _i;
        for (Gt = 1; n < l.length; n++) {
          var u = l[n];
          do
            u = u(!0);
          while (u !== null);
        }
        _i = null, yu = !1;
      } catch (c) {
        throw _i !== null && (_i = _i.slice(n + 1)), bn(ri, ki), c;
      } finally {
        Gt = r, Ji = !1;
      }
    }
    return null;
  }
  var Ol = [], Ll = 0, Ml = null, Zi = 0, Xn = [], Ha = 0, Ca = null, ji = 1, Ni = "";
  function go(n, r) {
    Ol[Ll++] = Zi, Ol[Ll++] = Ml, Ml = n, Zi = r;
  }
  function Fv(n, r, l) {
    Xn[Ha++] = ji, Xn[Ha++] = Ni, Xn[Ha++] = Ca, Ca = n;
    var u = ji;
    n = Ni;
    var c = 32 - Ur(u) - 1;
    u &= ~(1 << c), l += 1;
    var p = 32 - Ur(r) + c;
    if (30 < p) {
      var y = c - c % 5;
      p = (u & (1 << y) - 1).toString(32), u >>= y, c -= y, ji = 1 << 32 - Ur(r) + c | l << c | u, Ni = p + n;
    } else ji = 1 << p | l << c | u, Ni = n;
  }
  function jc(n) {
    n.return !== null && (go(n, 1), Fv(n, 1, 0));
  }
  function Nc(n) {
    for (; n === Ml; ) Ml = Ol[--Ll], Ol[Ll] = null, Zi = Ol[--Ll], Ol[Ll] = null;
    for (; n === Ca; ) Ca = Xn[--Ha], Xn[Ha] = null, Ni = Xn[--Ha], Xn[Ha] = null, ji = Xn[--Ha], Xn[Ha] = null;
  }
  var oa = null, ua = null, kn = !1, Ba = null;
  function gd(n, r) {
    var l = Qa(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function Pv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, oa = n, ua = Ti(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, oa = n, ua = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = Ca !== null ? { id: ji, overflow: Ni } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Qa(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, oa = n, ua = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Sd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Ed(n) {
    if (kn) {
      var r = ua;
      if (r) {
        var l = r;
        if (!Pv(n, r)) {
          if (Sd(n)) throw Error(b(418));
          r = Ti(l.nextSibling);
          var u = oa;
          r && Pv(n, r) ? gd(u, l) : (n.flags = n.flags & -4097 | 2, kn = !1, oa = n);
        }
      } else {
        if (Sd(n)) throw Error(b(418));
        n.flags = n.flags & -4097 | 2, kn = !1, oa = n;
      }
    }
  }
  function or(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    oa = n;
  }
  function Dc(n) {
    if (n !== oa) return !1;
    if (!kn) return or(n), kn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !wc(n.type, n.memoizedProps)), r && (r = ua)) {
      if (Sd(n)) throw fs(), Error(b(418));
      for (; r; ) gd(n, r), r = Ti(r.nextSibling);
    }
    if (or(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(b(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                ua = Ti(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        ua = null;
      }
    } else ua = oa ? Ti(n.stateNode.nextSibling) : null;
    return !0;
  }
  function fs() {
    for (var n = ua; n; ) n = Ti(n.nextSibling);
  }
  function Al() {
    ua = oa = null, kn = !1;
  }
  function el(n) {
    Ba === null ? Ba = [n] : Ba.push(n);
  }
  var my = ge.ReactCurrentBatchConfig;
  function So(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(b(309));
          var u = l.stateNode;
        }
        if (!u) throw Error(b(147, n));
        var c = u, p = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === p ? r.ref : (r = function(y) {
          var w = c.refs;
          y === null ? delete w[p] : w[p] = y;
        }, r._stringRef = p, r);
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
    function r(U, O) {
      if (n) {
        var V = U.deletions;
        V === null ? (U.deletions = [O], U.flags |= 16) : V.push(O);
      }
    }
    function l(U, O) {
      if (!n) return null;
      for (; O !== null; ) r(U, O), O = O.sibling;
      return null;
    }
    function u(U, O) {
      for (U = /* @__PURE__ */ new Map(); O !== null; ) O.key !== null ? U.set(O.key, O) : U.set(O.index, O), O = O.sibling;
      return U;
    }
    function c(U, O) {
      return U = Il(U, O), U.index = 0, U.sibling = null, U;
    }
    function p(U, O, V) {
      return U.index = V, n ? (V = U.alternate, V !== null ? (V = V.index, V < O ? (U.flags |= 2, O) : V) : (U.flags |= 2, O)) : (U.flags |= 1048576, O);
    }
    function y(U) {
      return n && U.alternate === null && (U.flags |= 2), U;
    }
    function w(U, O, V, xe) {
      return O === null || O.tag !== 6 ? (O = Xd(V, U.mode, xe), O.return = U, O) : (O = c(O, V), O.return = U, O);
    }
    function k(U, O, V, xe) {
      var qe = V.type;
      return qe === G ? Ee(U, O, V.props.children, xe, V.key) : O !== null && (O.elementType === qe || typeof qe == "object" && qe !== null && qe.$$typeof === we && Hv(qe) === O.type) ? (xe = c(O, V.props), xe.ref = So(U, O, V), xe.return = U, xe) : (xe = Bs(V.type, V.key, V.props, null, U.mode, xe), xe.ref = So(U, O, V), xe.return = U, xe);
    }
    function Q(U, O, V, xe) {
      return O === null || O.tag !== 4 || O.stateNode.containerInfo !== V.containerInfo || O.stateNode.implementation !== V.implementation ? (O = df(V, U.mode, xe), O.return = U, O) : (O = c(O, V.children || []), O.return = U, O);
    }
    function Ee(U, O, V, xe, qe) {
      return O === null || O.tag !== 7 ? (O = ll(V, U.mode, xe, qe), O.return = U, O) : (O = c(O, V), O.return = U, O);
    }
    function _e(U, O, V) {
      if (typeof O == "string" && O !== "" || typeof O == "number") return O = Xd("" + O, U.mode, V), O.return = U, O;
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case fe:
            return V = Bs(O.type, O.key, O.props, null, U.mode, V), V.ref = So(U, null, O), V.return = U, V;
          case ue:
            return O = df(O, U.mode, V), O.return = U, O;
          case we:
            var xe = O._init;
            return _e(U, xe(O._payload), V);
        }
        if (Hn(O) || Be(O)) return O = ll(O, U.mode, V, null), O.return = U, O;
        Oc(U, O);
      }
      return null;
    }
    function ye(U, O, V, xe) {
      var qe = O !== null ? O.key : null;
      if (typeof V == "string" && V !== "" || typeof V == "number") return qe !== null ? null : w(U, O, "" + V, xe);
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case fe:
            return V.key === qe ? k(U, O, V, xe) : null;
          case ue:
            return V.key === qe ? Q(U, O, V, xe) : null;
          case we:
            return qe = V._init, ye(
              U,
              O,
              qe(V._payload),
              xe
            );
        }
        if (Hn(V) || Be(V)) return qe !== null ? null : Ee(U, O, V, xe, null);
        Oc(U, V);
      }
      return null;
    }
    function Ie(U, O, V, xe, qe) {
      if (typeof xe == "string" && xe !== "" || typeof xe == "number") return U = U.get(V) || null, w(O, U, "" + xe, qe);
      if (typeof xe == "object" && xe !== null) {
        switch (xe.$$typeof) {
          case fe:
            return U = U.get(xe.key === null ? V : xe.key) || null, k(O, U, xe, qe);
          case ue:
            return U = U.get(xe.key === null ? V : xe.key) || null, Q(O, U, xe, qe);
          case we:
            var ut = xe._init;
            return Ie(U, O, V, ut(xe._payload), qe);
        }
        if (Hn(xe) || Be(xe)) return U = U.get(V) || null, Ee(O, U, xe, qe, null);
        Oc(O, xe);
      }
      return null;
    }
    function Ke(U, O, V, xe) {
      for (var qe = null, ut = null, ct = O, mt = O = 0, hr = null; ct !== null && mt < V.length; mt++) {
        ct.index > mt ? (hr = ct, ct = null) : hr = ct.sibling;
        var Xt = ye(U, ct, V[mt], xe);
        if (Xt === null) {
          ct === null && (ct = hr);
          break;
        }
        n && ct && Xt.alternate === null && r(U, ct), O = p(Xt, O, mt), ut === null ? qe = Xt : ut.sibling = Xt, ut = Xt, ct = hr;
      }
      if (mt === V.length) return l(U, ct), kn && go(U, mt), qe;
      if (ct === null) {
        for (; mt < V.length; mt++) ct = _e(U, V[mt], xe), ct !== null && (O = p(ct, O, mt), ut === null ? qe = ct : ut.sibling = ct, ut = ct);
        return kn && go(U, mt), qe;
      }
      for (ct = u(U, ct); mt < V.length; mt++) hr = Ie(ct, U, mt, V[mt], xe), hr !== null && (n && hr.alternate !== null && ct.delete(hr.key === null ? mt : hr.key), O = p(hr, O, mt), ut === null ? qe = hr : ut.sibling = hr, ut = hr);
      return n && ct.forEach(function(Ql) {
        return r(U, Ql);
      }), kn && go(U, mt), qe;
    }
    function Ze(U, O, V, xe) {
      var qe = Be(V);
      if (typeof qe != "function") throw Error(b(150));
      if (V = qe.call(V), V == null) throw Error(b(151));
      for (var ut = qe = null, ct = O, mt = O = 0, hr = null, Xt = V.next(); ct !== null && !Xt.done; mt++, Xt = V.next()) {
        ct.index > mt ? (hr = ct, ct = null) : hr = ct.sibling;
        var Ql = ye(U, ct, Xt.value, xe);
        if (Ql === null) {
          ct === null && (ct = hr);
          break;
        }
        n && ct && Ql.alternate === null && r(U, ct), O = p(Ql, O, mt), ut === null ? qe = Ql : ut.sibling = Ql, ut = Ql, ct = hr;
      }
      if (Xt.done) return l(
        U,
        ct
      ), kn && go(U, mt), qe;
      if (ct === null) {
        for (; !Xt.done; mt++, Xt = V.next()) Xt = _e(U, Xt.value, xe), Xt !== null && (O = p(Xt, O, mt), ut === null ? qe = Xt : ut.sibling = Xt, ut = Xt);
        return kn && go(U, mt), qe;
      }
      for (ct = u(U, ct); !Xt.done; mt++, Xt = V.next()) Xt = Ie(ct, U, mt, Xt.value, xe), Xt !== null && (n && Xt.alternate !== null && ct.delete(Xt.key === null ? mt : Xt.key), O = p(Xt, O, mt), ut === null ? qe = Xt : ut.sibling = Xt, ut = Xt);
      return n && ct.forEach(function(Ch) {
        return r(U, Ch);
      }), kn && go(U, mt), qe;
    }
    function Qn(U, O, V, xe) {
      if (typeof V == "object" && V !== null && V.type === G && V.key === null && (V = V.props.children), typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case fe:
            e: {
              for (var qe = V.key, ut = O; ut !== null; ) {
                if (ut.key === qe) {
                  if (qe = V.type, qe === G) {
                    if (ut.tag === 7) {
                      l(U, ut.sibling), O = c(ut, V.props.children), O.return = U, U = O;
                      break e;
                    }
                  } else if (ut.elementType === qe || typeof qe == "object" && qe !== null && qe.$$typeof === we && Hv(qe) === ut.type) {
                    l(U, ut.sibling), O = c(ut, V.props), O.ref = So(U, ut, V), O.return = U, U = O;
                    break e;
                  }
                  l(U, ut);
                  break;
                } else r(U, ut);
                ut = ut.sibling;
              }
              V.type === G ? (O = ll(V.props.children, U.mode, xe, V.key), O.return = U, U = O) : (xe = Bs(V.type, V.key, V.props, null, U.mode, xe), xe.ref = So(U, O, V), xe.return = U, U = xe);
            }
            return y(U);
          case ue:
            e: {
              for (ut = V.key; O !== null; ) {
                if (O.key === ut) if (O.tag === 4 && O.stateNode.containerInfo === V.containerInfo && O.stateNode.implementation === V.implementation) {
                  l(U, O.sibling), O = c(O, V.children || []), O.return = U, U = O;
                  break e;
                } else {
                  l(U, O);
                  break;
                }
                else r(U, O);
                O = O.sibling;
              }
              O = df(V, U.mode, xe), O.return = U, U = O;
            }
            return y(U);
          case we:
            return ut = V._init, Qn(U, O, ut(V._payload), xe);
        }
        if (Hn(V)) return Ke(U, O, V, xe);
        if (Be(V)) return Ze(U, O, V, xe);
        Oc(U, V);
      }
      return typeof V == "string" && V !== "" || typeof V == "number" ? (V = "" + V, O !== null && O.tag === 6 ? (l(U, O.sibling), O = c(O, V), O.return = U, U = O) : (l(U, O), O = Xd(V, U.mode, xe), O.return = U, U = O), y(U)) : l(U, O);
    }
    return Qn;
  }
  var Vn = Eo(!0), Pe = Eo(!1), ba = Pa(null), sa = null, gu = null, xd = null;
  function Cd() {
    xd = gu = sa = null;
  }
  function bd(n) {
    var r = ba.current;
    Cn(ba), n._currentValue = r;
  }
  function wd(n, r, l) {
    for (; n !== null; ) {
      var u = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, u !== null && (u.childLanes |= r)) : u !== null && (u.childLanes & r) !== r && (u.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function Mn(n, r) {
    sa = n, xd = gu = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Zn = !0), n.firstContext = null);
  }
  function Va(n) {
    var r = n._currentValue;
    if (xd !== n) if (n = { context: n, memoizedValue: r, next: null }, gu === null) {
      if (sa === null) throw Error(b(308));
      gu = n, sa.dependencies = { lanes: 0, firstContext: n };
    } else gu = gu.next = n;
    return r;
  }
  var xo = null;
  function Td(n) {
    xo === null ? xo = [n] : xo.push(n);
  }
  function Rd(n, r, l, u) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Td(r)) : (l.next = c.next, c.next = l), r.interleaved = l, wa(n, u);
  }
  function wa(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Ta = !1;
  function _d(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Bv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function tl(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function zl(n, r, l) {
    var u = n.updateQueue;
    if (u === null) return null;
    if (u = u.shared, Ht & 2) {
      var c = u.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), u.pending = r, wa(n, l);
    }
    return c = u.interleaved, c === null ? (r.next = r, Td(u)) : (r.next = c.next, c.next = r), u.interleaved = r, wa(n, l);
  }
  function Lc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, Qi(n, l);
    }
  }
  function Vv(n, r) {
    var l = n.updateQueue, u = n.alternate;
    if (u !== null && (u = u.updateQueue, l === u)) {
      var c = null, p = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var y = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          p === null ? c = p = y : p = p.next = y, l = l.next;
        } while (l !== null);
        p === null ? c = p = r : p = p.next = r;
      } else c = p = r;
      l = { baseState: u.baseState, firstBaseUpdate: c, lastBaseUpdate: p, shared: u.shared, effects: u.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function ds(n, r, l, u) {
    var c = n.updateQueue;
    Ta = !1;
    var p = c.firstBaseUpdate, y = c.lastBaseUpdate, w = c.shared.pending;
    if (w !== null) {
      c.shared.pending = null;
      var k = w, Q = k.next;
      k.next = null, y === null ? p = Q : y.next = Q, y = k;
      var Ee = n.alternate;
      Ee !== null && (Ee = Ee.updateQueue, w = Ee.lastBaseUpdate, w !== y && (w === null ? Ee.firstBaseUpdate = Q : w.next = Q, Ee.lastBaseUpdate = k));
    }
    if (p !== null) {
      var _e = c.baseState;
      y = 0, Ee = Q = k = null, w = p;
      do {
        var ye = w.lane, Ie = w.eventTime;
        if ((u & ye) === ye) {
          Ee !== null && (Ee = Ee.next = {
            eventTime: Ie,
            lane: 0,
            tag: w.tag,
            payload: w.payload,
            callback: w.callback,
            next: null
          });
          e: {
            var Ke = n, Ze = w;
            switch (ye = r, Ie = l, Ze.tag) {
              case 1:
                if (Ke = Ze.payload, typeof Ke == "function") {
                  _e = Ke.call(Ie, _e, ye);
                  break e;
                }
                _e = Ke;
                break e;
              case 3:
                Ke.flags = Ke.flags & -65537 | 128;
              case 0:
                if (Ke = Ze.payload, ye = typeof Ke == "function" ? Ke.call(Ie, _e, ye) : Ke, ye == null) break e;
                _e = Re({}, _e, ye);
                break e;
              case 2:
                Ta = !0;
            }
          }
          w.callback !== null && w.lane !== 0 && (n.flags |= 64, ye = c.effects, ye === null ? c.effects = [w] : ye.push(w));
        } else Ie = { eventTime: Ie, lane: ye, tag: w.tag, payload: w.payload, callback: w.callback, next: null }, Ee === null ? (Q = Ee = Ie, k = _e) : Ee = Ee.next = Ie, y |= ye;
        if (w = w.next, w === null) {
          if (w = c.shared.pending, w === null) break;
          ye = w, w = ye.next, ye.next = null, c.lastBaseUpdate = ye, c.shared.pending = null;
        }
      } while (!0);
      if (Ee === null && (k = _e), c.baseState = k, c.firstBaseUpdate = Q, c.lastBaseUpdate = Ee, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          y |= c.lane, c = c.next;
        while (c !== r);
      } else p === null && (c.shared.lanes = 0);
      Ai |= y, n.lanes = y, n.memoizedState = _e;
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
  var ps = {}, Di = Pa(ps), vs = Pa(ps), hs = Pa(ps);
  function Co(n) {
    if (n === ps) throw Error(b(174));
    return n;
  }
  function jd(n, r) {
    switch (tt(hs, r), tt(vs, n), tt(Di, ps), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : on(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = on(r, n);
    }
    Cn(Di), tt(Di, r);
  }
  function bo() {
    Cn(Di), Cn(vs), Cn(hs);
  }
  function Iv(n) {
    Co(hs.current);
    var r = Co(Di.current), l = on(r, n.type);
    r !== l && (tt(vs, n), tt(Di, l));
  }
  function Mc(n) {
    vs.current === n && (Cn(Di), Cn(vs));
  }
  var An = Pa(0);
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
  function it() {
    for (var n = 0; n < ms.length; n++) ms[n]._workInProgressVersionPrimary = null;
    ms.length = 0;
  }
  var Ot = ge.ReactCurrentDispatcher, Kt = ge.ReactCurrentBatchConfig, pn = 0, qt = null, Jn = null, pr = null, zc = !1, ys = !1, wo = 0, he = 0;
  function Wt() {
    throw Error(b(321));
  }
  function ft(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ui(n[l], r[l])) return !1;
    return !0;
  }
  function Ul(n, r, l, u, c, p) {
    if (pn = p, qt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Ot.current = n === null || n.memoizedState === null ? Xc : bs, n = l(u, c), ys) {
      p = 0;
      do {
        if (ys = !1, wo = 0, 25 <= p) throw Error(b(301));
        p += 1, pr = Jn = null, r.updateQueue = null, Ot.current = Jc, n = l(u, c);
      } while (ys);
    }
    if (Ot.current = jo, r = Jn !== null && Jn.next !== null, pn = 0, pr = Jn = qt = null, zc = !1, r) throw Error(b(300));
    return n;
  }
  function ci() {
    var n = wo !== 0;
    return wo = 0, n;
  }
  function Mr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return pr === null ? qt.memoizedState = pr = n : pr = pr.next = n, pr;
  }
  function In() {
    if (Jn === null) {
      var n = qt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Jn.next;
    var r = pr === null ? qt.memoizedState : pr.next;
    if (r !== null) pr = r, Jn = n;
    else {
      if (n === null) throw Error(b(310));
      Jn = n, n = { memoizedState: Jn.memoizedState, baseState: Jn.baseState, baseQueue: Jn.baseQueue, queue: Jn.queue, next: null }, pr === null ? qt.memoizedState = pr = n : pr = pr.next = n;
    }
    return pr;
  }
  function nl(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Fl(n) {
    var r = In(), l = r.queue;
    if (l === null) throw Error(b(311));
    l.lastRenderedReducer = n;
    var u = Jn, c = u.baseQueue, p = l.pending;
    if (p !== null) {
      if (c !== null) {
        var y = c.next;
        c.next = p.next, p.next = y;
      }
      u.baseQueue = c = p, l.pending = null;
    }
    if (c !== null) {
      p = c.next, u = u.baseState;
      var w = y = null, k = null, Q = p;
      do {
        var Ee = Q.lane;
        if ((pn & Ee) === Ee) k !== null && (k = k.next = { lane: 0, action: Q.action, hasEagerState: Q.hasEagerState, eagerState: Q.eagerState, next: null }), u = Q.hasEagerState ? Q.eagerState : n(u, Q.action);
        else {
          var _e = {
            lane: Ee,
            action: Q.action,
            hasEagerState: Q.hasEagerState,
            eagerState: Q.eagerState,
            next: null
          };
          k === null ? (w = k = _e, y = u) : k = k.next = _e, qt.lanes |= Ee, Ai |= Ee;
        }
        Q = Q.next;
      } while (Q !== null && Q !== p);
      k === null ? y = u : k.next = w, ui(u, r.memoizedState) || (Zn = !0), r.memoizedState = u, r.baseState = y, r.baseQueue = k, l.lastRenderedState = u;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        p = c.lane, qt.lanes |= p, Ai |= p, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function To(n) {
    var r = In(), l = r.queue;
    if (l === null) throw Error(b(311));
    l.lastRenderedReducer = n;
    var u = l.dispatch, c = l.pending, p = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var y = c = c.next;
      do
        p = n(p, y.action), y = y.next;
      while (y !== c);
      ui(p, r.memoizedState) || (Zn = !0), r.memoizedState = p, r.baseQueue === null && (r.baseState = p), l.lastRenderedState = p;
    }
    return [p, u];
  }
  function Uc() {
  }
  function Fc(n, r) {
    var l = qt, u = In(), c = r(), p = !ui(u.memoizedState, c);
    if (p && (u.memoizedState = c, Zn = !0), u = u.queue, gs(Bc.bind(null, l, u, n), [n]), u.getSnapshot !== r || p || pr !== null && pr.memoizedState.tag & 1) {
      if (l.flags |= 2048, Ro(9, Hc.bind(null, l, u, c, r), void 0, null), ur === null) throw Error(b(349));
      pn & 30 || Pc(l, r, c);
    }
    return c;
  }
  function Pc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = qt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, qt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Hc(n, r, l, u) {
    r.value = l, r.getSnapshot = u, Vc(r) && Ic(n);
  }
  function Bc(n, r, l) {
    return l(function() {
      Vc(r) && Ic(n);
    });
  }
  function Vc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ui(n, l);
    } catch {
      return !0;
    }
  }
  function Ic(n) {
    var r = wa(n, 1);
    r !== null && Ir(r, n, 1, -1);
  }
  function $c(n) {
    var r = Mr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: nl, lastRenderedState: n }, r.queue = n, n = n.dispatch = ko.bind(null, qt, n), [r.memoizedState, n];
  }
  function Ro(n, r, l, u) {
    return n = { tag: n, create: r, destroy: l, deps: u, next: null }, r = qt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, qt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (u = l.next, l.next = n, n.next = u, r.lastEffect = n)), n;
  }
  function Yc() {
    return In().memoizedState;
  }
  function Su(n, r, l, u) {
    var c = Mr();
    qt.flags |= n, c.memoizedState = Ro(1 | r, l, void 0, u === void 0 ? null : u);
  }
  function Eu(n, r, l, u) {
    var c = In();
    u = u === void 0 ? null : u;
    var p = void 0;
    if (Jn !== null) {
      var y = Jn.memoizedState;
      if (p = y.destroy, u !== null && ft(u, y.deps)) {
        c.memoizedState = Ro(r, l, p, u);
        return;
      }
    }
    qt.flags |= n, c.memoizedState = Ro(1 | r, l, p, u);
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
    var l = In();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && ft(r, u[1]) ? u[0] : (l.memoizedState = [n, r], n);
  }
  function qc(n, r) {
    var l = In();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && ft(r, u[1]) ? u[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function Nd(n, r, l) {
    return pn & 21 ? (ui(l, r) || (l = Zo(), qt.lanes |= l, Ai |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Zn = !0), n.memoizedState = l);
  }
  function xs(n, r) {
    var l = Gt;
    Gt = l !== 0 && 4 > l ? l : 4, n(!0);
    var u = Kt.transition;
    Kt.transition = {};
    try {
      n(!1), r();
    } finally {
      Gt = l, Kt.transition = u;
    }
  }
  function Dd() {
    return In().memoizedState;
  }
  function Cs(n, r, l) {
    var u = zi(n);
    if (l = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null }, ca(n)) $v(r, l);
    else if (l = Rd(n, r, l, u), l !== null) {
      var c = nr();
      Ir(l, n, u, c), yn(l, r, u);
    }
  }
  function ko(n, r, l) {
    var u = zi(n), c = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (ca(n)) $v(r, c);
    else {
      var p = n.alternate;
      if (n.lanes === 0 && (p === null || p.lanes === 0) && (p = r.lastRenderedReducer, p !== null)) try {
        var y = r.lastRenderedState, w = p(y, l);
        if (c.hasEagerState = !0, c.eagerState = w, ui(w, y)) {
          var k = r.interleaved;
          k === null ? (c.next = c, Td(r)) : (c.next = k.next, k.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = Rd(n, r, c, u), l !== null && (c = nr(), Ir(l, n, u, c), yn(l, r, u));
    }
  }
  function ca(n) {
    var r = n.alternate;
    return n === qt || r !== null && r === qt;
  }
  function $v(n, r) {
    ys = zc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function yn(n, r, l) {
    if (l & 4194240) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, Qi(n, l);
    }
  }
  var jo = { readContext: Va, useCallback: Wt, useContext: Wt, useEffect: Wt, useImperativeHandle: Wt, useInsertionEffect: Wt, useLayoutEffect: Wt, useMemo: Wt, useReducer: Wt, useRef: Wt, useState: Wt, useDebugValue: Wt, useDeferredValue: Wt, useTransition: Wt, useMutableSource: Wt, useSyncExternalStore: Wt, useId: Wt, unstable_isNewReconciler: !1 }, Xc = { readContext: Va, useCallback: function(n, r) {
    return Mr().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Va, useEffect: Qc, useImperativeHandle: function(n, r, l) {
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
    var l = Mr();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var u = Mr();
    return r = l !== void 0 ? l(r) : r, u.memoizedState = u.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, u.queue = n, n = n.dispatch = Cs.bind(null, qt, n), [u.memoizedState, n];
  }, useRef: function(n) {
    var r = Mr();
    return n = { current: n }, r.memoizedState = n;
  }, useState: $c, useDebugValue: Es, useDeferredValue: function(n) {
    return Mr().memoizedState = n;
  }, useTransition: function() {
    var n = $c(!1), r = n[0];
    return n = xs.bind(null, n[1]), Mr().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var u = qt, c = Mr();
    if (kn) {
      if (l === void 0) throw Error(b(407));
      l = l();
    } else {
      if (l = r(), ur === null) throw Error(b(349));
      pn & 30 || Pc(u, r, l);
    }
    c.memoizedState = l;
    var p = { value: l, getSnapshot: r };
    return c.queue = p, Qc(Bc.bind(
      null,
      u,
      p,
      n
    ), [n]), u.flags |= 2048, Ro(9, Hc.bind(null, u, p, l, r), void 0, null), l;
  }, useId: function() {
    var n = Mr(), r = ur.identifierPrefix;
    if (kn) {
      var l = Ni, u = ji;
      l = (u & ~(1 << 32 - Ur(u) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = wo++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = he++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, bs = {
    readContext: Va,
    useCallback: Kc,
    useContext: Va,
    useEffect: gs,
    useImperativeHandle: Gc,
    useInsertionEffect: Wc,
    useLayoutEffect: Ss,
    useMemo: qc,
    useReducer: Fl,
    useRef: Yc,
    useState: function() {
      return Fl(nl);
    },
    useDebugValue: Es,
    useDeferredValue: function(n) {
      var r = In();
      return Nd(r, Jn.memoizedState, n);
    },
    useTransition: function() {
      var n = Fl(nl)[0], r = In().memoizedState;
      return [n, r];
    },
    useMutableSource: Uc,
    useSyncExternalStore: Fc,
    useId: Dd,
    unstable_isNewReconciler: !1
  }, Jc = { readContext: Va, useCallback: Kc, useContext: Va, useEffect: gs, useImperativeHandle: Gc, useInsertionEffect: Wc, useLayoutEffect: Ss, useMemo: qc, useReducer: To, useRef: Yc, useState: function() {
    return To(nl);
  }, useDebugValue: Es, useDeferredValue: function(n) {
    var r = In();
    return Jn === null ? r.memoizedState = n : Nd(r, Jn.memoizedState, n);
  }, useTransition: function() {
    var n = To(nl)[0], r = In().memoizedState;
    return [n, r];
  }, useMutableSource: Uc, useSyncExternalStore: Fc, useId: Dd, unstable_isNewReconciler: !1 };
  function fi(n, r) {
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
    return (n = n._reactInternals) ? rt(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var u = nr(), c = zi(n), p = tl(u, c);
    p.payload = r, l != null && (p.callback = l), r = zl(n, p, c), r !== null && (Ir(r, n, c, u), Lc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var u = nr(), c = zi(n), p = tl(u, c);
    p.tag = 1, p.payload = r, l != null && (p.callback = l), r = zl(n, p, c), r !== null && (Ir(r, n, c, u), Lc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = nr(), u = zi(n), c = tl(l, u);
    c.tag = 2, r != null && (c.callback = r), r = zl(n, c, u), r !== null && (Ir(r, n, u, l), Lc(r, n, u));
  } };
  function Yv(n, r, l, u, c, p, y) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(u, p, y) : r.prototype && r.prototype.isPureReactComponent ? !ns(l, u) || !ns(c, p) : !0;
  }
  function ef(n, r, l) {
    var u = !1, c = Lr, p = r.contextType;
    return typeof p == "object" && p !== null ? p = Va(p) : (c = qn(r) ? ia : Fn.current, u = r.contextTypes, p = (u = u != null) ? la(n, c) : Lr), r = new r(l, p), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Zc, n.stateNode = r, r._reactInternals = n, u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = p), r;
  }
  function Qv(n, r, l, u) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, u), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, u), r.state !== n && Zc.enqueueReplaceState(r, r.state, null);
  }
  function ws(n, r, l, u) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, _d(n);
    var p = r.contextType;
    typeof p == "object" && p !== null ? c.context = Va(p) : (p = qn(r) ? ia : Fn.current, c.context = la(n, p)), c.state = n.memoizedState, p = r.getDerivedStateFromProps, typeof p == "function" && (Od(n, r, p, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Zc.enqueueReplaceState(c, c.state, null), ds(n, l, c, u), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function No(n, r) {
    try {
      var l = "", u = r;
      do
        l += Rt(u), u = u.return;
      while (u);
      var c = l;
    } catch (p) {
      c = `
Error generating stack: ` + p.message + `
` + p.stack;
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
    l = tl(-1, l), l.tag = 3, l.payload = { element: null };
    var u = r.value;
    return l.callback = function() {
      Ru || (Ru = !0, Lo = u), Md(n, r);
    }, l;
  }
  function Ad(n, r, l) {
    l = tl(-1, l), l.tag = 3;
    var u = n.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var c = r.value;
      l.payload = function() {
        return u(c);
      }, l.callback = function() {
        Md(n, r);
      };
    }
    var p = n.stateNode;
    return p !== null && typeof p.componentDidCatch == "function" && (l.callback = function() {
      Md(n, r), typeof u != "function" && (Bl === null ? Bl = /* @__PURE__ */ new Set([this]) : Bl.add(this));
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
  function Pl(n, r, l, u, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = tl(-1, 1), r.tag = 2, zl(l, r, 1))), l.lanes |= 1), n);
  }
  var Ts = ge.ReactCurrentOwner, Zn = !1;
  function xr(n, r, l, u) {
    r.child = n === null ? Pe(r, null, l, u) : Vn(r, n.child, l, u);
  }
  function fa(n, r, l, u, c) {
    l = l.render;
    var p = r.ref;
    return Mn(r, c), u = Ul(n, r, l, u, p, c), l = ci(), n !== null && !Zn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, $a(n, r, c)) : (kn && l && jc(r), r.flags |= 1, xr(n, r, u, c), r.child);
  }
  function Do(n, r, l, u, c) {
    if (n === null) {
      var p = l.type;
      return typeof p == "function" && !qd(p) && p.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = p, _t(n, r, p, u, c)) : (n = Bs(l.type, null, u, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (p = n.child, !(n.lanes & c)) {
      var y = p.memoizedProps;
      if (l = l.compare, l = l !== null ? l : ns, l(y, u) && n.ref === r.ref) return $a(n, r, c);
    }
    return r.flags |= 1, n = Il(p, u), n.ref = r.ref, n.return = r, r.child = n;
  }
  function _t(n, r, l, u, c) {
    if (n !== null) {
      var p = n.memoizedProps;
      if (ns(p, u) && n.ref === r.ref) if (Zn = !1, r.pendingProps = u = p, (n.lanes & c) !== 0) n.flags & 131072 && (Zn = !0);
      else return r.lanes = n.lanes, $a(n, r, c);
    }
    return Kv(n, r, l, u, c);
  }
  function Rs(n, r, l) {
    var u = r.pendingProps, c = u.children, p = n !== null ? n.memoizedState : null;
    if (u.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, tt(bu, Ra), Ra |= l;
    else {
      if (!(l & 1073741824)) return n = p !== null ? p.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, tt(bu, Ra), Ra |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, u = p !== null ? p.baseLanes : l, tt(bu, Ra), Ra |= u;
    }
    else p !== null ? (u = p.baseLanes | l, r.memoizedState = null) : u = l, tt(bu, Ra), Ra |= u;
    return xr(n, r, c, l), r.child;
  }
  function Ud(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function Kv(n, r, l, u, c) {
    var p = qn(l) ? ia : Fn.current;
    return p = la(r, p), Mn(r, c), l = Ul(n, r, l, u, p, c), u = ci(), n !== null && !Zn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, $a(n, r, c)) : (kn && u && jc(r), r.flags |= 1, xr(n, r, l, c), r.child);
  }
  function qv(n, r, l, u, c) {
    if (qn(l)) {
      var p = !0;
      dr(r);
    } else p = !1;
    if (Mn(r, c), r.stateNode === null) Ia(n, r), ef(r, l, u), ws(r, l, u, c), u = !0;
    else if (n === null) {
      var y = r.stateNode, w = r.memoizedProps;
      y.props = w;
      var k = y.context, Q = l.contextType;
      typeof Q == "object" && Q !== null ? Q = Va(Q) : (Q = qn(l) ? ia : Fn.current, Q = la(r, Q));
      var Ee = l.getDerivedStateFromProps, _e = typeof Ee == "function" || typeof y.getSnapshotBeforeUpdate == "function";
      _e || typeof y.UNSAFE_componentWillReceiveProps != "function" && typeof y.componentWillReceiveProps != "function" || (w !== u || k !== Q) && Qv(r, y, u, Q), Ta = !1;
      var ye = r.memoizedState;
      y.state = ye, ds(r, u, y, c), k = r.memoizedState, w !== u || ye !== k || lr.current || Ta ? (typeof Ee == "function" && (Od(r, l, Ee, u), k = r.memoizedState), (w = Ta || Yv(r, l, w, u, ye, k, Q)) ? (_e || typeof y.UNSAFE_componentWillMount != "function" && typeof y.componentWillMount != "function" || (typeof y.componentWillMount == "function" && y.componentWillMount(), typeof y.UNSAFE_componentWillMount == "function" && y.UNSAFE_componentWillMount()), typeof y.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof y.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = u, r.memoizedState = k), y.props = u, y.state = k, y.context = Q, u = w) : (typeof y.componentDidMount == "function" && (r.flags |= 4194308), u = !1);
    } else {
      y = r.stateNode, Bv(n, r), w = r.memoizedProps, Q = r.type === r.elementType ? w : fi(r.type, w), y.props = Q, _e = r.pendingProps, ye = y.context, k = l.contextType, typeof k == "object" && k !== null ? k = Va(k) : (k = qn(l) ? ia : Fn.current, k = la(r, k));
      var Ie = l.getDerivedStateFromProps;
      (Ee = typeof Ie == "function" || typeof y.getSnapshotBeforeUpdate == "function") || typeof y.UNSAFE_componentWillReceiveProps != "function" && typeof y.componentWillReceiveProps != "function" || (w !== _e || ye !== k) && Qv(r, y, u, k), Ta = !1, ye = r.memoizedState, y.state = ye, ds(r, u, y, c);
      var Ke = r.memoizedState;
      w !== _e || ye !== Ke || lr.current || Ta ? (typeof Ie == "function" && (Od(r, l, Ie, u), Ke = r.memoizedState), (Q = Ta || Yv(r, l, Q, u, ye, Ke, k) || !1) ? (Ee || typeof y.UNSAFE_componentWillUpdate != "function" && typeof y.componentWillUpdate != "function" || (typeof y.componentWillUpdate == "function" && y.componentWillUpdate(u, Ke, k), typeof y.UNSAFE_componentWillUpdate == "function" && y.UNSAFE_componentWillUpdate(u, Ke, k)), typeof y.componentDidUpdate == "function" && (r.flags |= 4), typeof y.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof y.componentDidUpdate != "function" || w === n.memoizedProps && ye === n.memoizedState || (r.flags |= 4), typeof y.getSnapshotBeforeUpdate != "function" || w === n.memoizedProps && ye === n.memoizedState || (r.flags |= 1024), r.memoizedProps = u, r.memoizedState = Ke), y.props = u, y.state = Ke, y.context = k, u = Q) : (typeof y.componentDidUpdate != "function" || w === n.memoizedProps && ye === n.memoizedState || (r.flags |= 4), typeof y.getSnapshotBeforeUpdate != "function" || w === n.memoizedProps && ye === n.memoizedState || (r.flags |= 1024), u = !1);
    }
    return _s(n, r, l, u, p, c);
  }
  function _s(n, r, l, u, c, p) {
    Ud(n, r);
    var y = (r.flags & 128) !== 0;
    if (!u && !y) return c && _c(r, l, !1), $a(n, r, p);
    u = r.stateNode, Ts.current = r;
    var w = y && typeof l.getDerivedStateFromError != "function" ? null : u.render();
    return r.flags |= 1, n !== null && y ? (r.child = Vn(r, n.child, null, p), r.child = Vn(r, null, w, p)) : xr(n, r, w, p), r.memoizedState = u.state, c && _c(r, l, !0), r.child;
  }
  function xu(n) {
    var r = n.stateNode;
    r.pendingContext ? Uv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Uv(n, r.context, !1), jd(n, r.containerInfo);
  }
  function Xv(n, r, l, u, c) {
    return Al(), el(c), r.flags |= 256, xr(n, r, l, u), r.child;
  }
  var nf = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Fd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function rf(n, r, l) {
    var u = r.pendingProps, c = An.current, p = !1, y = (r.flags & 128) !== 0, w;
    if ((w = y) || (w = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), w ? (p = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), tt(An, c & 1), n === null)
      return Ed(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (y = u.children, n = u.fallback, p ? (u = r.mode, p = r.child, y = { mode: "hidden", children: y }, !(u & 1) && p !== null ? (p.childLanes = 0, p.pendingProps = y) : p = $l(y, u, 0, null), n = ll(n, u, l, null), p.return = r, n.return = r, p.sibling = n, r.child = p, r.child.memoizedState = Fd(l), r.memoizedState = nf, n) : Pd(r, y));
    if (c = n.memoizedState, c !== null && (w = c.dehydrated, w !== null)) return Jv(n, r, y, u, w, c, l);
    if (p) {
      p = u.fallback, y = r.mode, c = n.child, w = c.sibling;
      var k = { mode: "hidden", children: u.children };
      return !(y & 1) && r.child !== c ? (u = r.child, u.childLanes = 0, u.pendingProps = k, r.deletions = null) : (u = Il(c, k), u.subtreeFlags = c.subtreeFlags & 14680064), w !== null ? p = Il(w, p) : (p = ll(p, y, l, null), p.flags |= 2), p.return = r, u.return = r, u.sibling = p, r.child = u, u = p, p = r.child, y = n.child.memoizedState, y = y === null ? Fd(l) : { baseLanes: y.baseLanes | l, cachePool: null, transitions: y.transitions }, p.memoizedState = y, p.childLanes = n.childLanes & ~l, r.memoizedState = nf, u;
    }
    return p = n.child, n = p.sibling, u = Il(p, { mode: "visible", children: u.children }), !(r.mode & 1) && (u.lanes = l), u.return = r, u.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = u, r.memoizedState = null, u;
  }
  function Pd(n, r) {
    return r = $l({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function ks(n, r, l, u) {
    return u !== null && el(u), Vn(r, n.child, null, l), n = Pd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Jv(n, r, l, u, c, p, y) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, u = Ld(Error(b(422))), ks(n, r, y, u)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (p = u.fallback, c = r.mode, u = $l({ mode: "visible", children: u.children }, c, 0, null), p = ll(p, c, y, null), p.flags |= 2, u.return = r, p.return = r, u.sibling = p, r.child = u, r.mode & 1 && Vn(r, n.child, null, y), r.child.memoizedState = Fd(y), r.memoizedState = nf, p);
    if (!(r.mode & 1)) return ks(n, r, y, null);
    if (c.data === "$!") {
      if (u = c.nextSibling && c.nextSibling.dataset, u) var w = u.dgst;
      return u = w, p = Error(b(419)), u = Ld(p, u, void 0), ks(n, r, y, u);
    }
    if (w = (y & n.childLanes) !== 0, Zn || w) {
      if (u = ur, u !== null) {
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
        c = c & (u.suspendedLanes | y) ? 0 : c, c !== 0 && c !== p.retryLane && (p.retryLane = c, wa(n, c), Ir(u, n, c, -1));
      }
      return Kd(), u = Ld(Error(b(421))), ks(n, r, y, u);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = wy.bind(null, n), c._reactRetry = r, null) : (n = p.treeContext, ua = Ti(c.nextSibling), oa = r, kn = !0, Ba = null, n !== null && (Xn[Ha++] = ji, Xn[Ha++] = Ni, Xn[Ha++] = Ca, ji = n.id, Ni = n.overflow, Ca = r), r = Pd(r, u.children), r.flags |= 4096, r);
  }
  function Hd(n, r, l) {
    n.lanes |= r;
    var u = n.alternate;
    u !== null && (u.lanes |= r), wd(n.return, r, l);
  }
  function Hr(n, r, l, u, c) {
    var p = n.memoizedState;
    p === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: u, tail: l, tailMode: c } : (p.isBackwards = r, p.rendering = null, p.renderingStartTime = 0, p.last = u, p.tail = l, p.tailMode = c);
  }
  function Oi(n, r, l) {
    var u = r.pendingProps, c = u.revealOrder, p = u.tail;
    if (xr(n, r, u.children, l), u = An.current, u & 2) u = u & 1 | 2, r.flags |= 128;
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
    if (tt(An, u), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Ac(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Hr(r, !1, c, l, p);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Ac(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        Hr(r, !0, l, null, p);
        break;
      case "together":
        Hr(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Ia(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function $a(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Ai |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(b(153));
    if (r.child !== null) {
      for (n = r.child, l = Il(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Il(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function js(n, r, l) {
    switch (r.tag) {
      case 3:
        xu(r), Al();
        break;
      case 5:
        Iv(r);
        break;
      case 1:
        qn(r.type) && dr(r);
        break;
      case 4:
        jd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var u = r.type._context, c = r.memoizedProps.value;
        tt(ba, u._currentValue), u._currentValue = c;
        break;
      case 13:
        if (u = r.memoizedState, u !== null)
          return u.dehydrated !== null ? (tt(An, An.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? rf(n, r, l) : (tt(An, An.current & 1), n = $a(n, r, l), n !== null ? n.sibling : null);
        tt(An, An.current & 1);
        break;
      case 19:
        if (u = (l & r.childLanes) !== 0, n.flags & 128) {
          if (u) return Oi(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), tt(An, An.current), u) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Rs(n, r, l);
    }
    return $a(n, r, l);
  }
  var Ya, er, Zv, eh;
  Ya = function(n, r) {
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
  }, er = function() {
  }, Zv = function(n, r, l, u) {
    var c = n.memoizedProps;
    if (c !== u) {
      n = r.stateNode, Co(Di.current);
      var p = null;
      switch (l) {
        case "input":
          c = Pn(n, c), u = Pn(n, u), p = [];
          break;
        case "select":
          c = Re({}, c, { value: void 0 }), u = Re({}, u, { value: void 0 }), p = [];
          break;
        case "textarea":
          c = Un(n, c), u = Un(n, u), p = [];
          break;
        default:
          typeof c.onClick != "function" && typeof u.onClick == "function" && (n.onclick = jl);
      }
      mn(l, u);
      var y;
      l = null;
      for (Q in c) if (!u.hasOwnProperty(Q) && c.hasOwnProperty(Q) && c[Q] != null) if (Q === "style") {
        var w = c[Q];
        for (y in w) w.hasOwnProperty(y) && (l || (l = {}), l[y] = "");
      } else Q !== "dangerouslySetInnerHTML" && Q !== "children" && Q !== "suppressContentEditableWarning" && Q !== "suppressHydrationWarning" && Q !== "autoFocus" && (J.hasOwnProperty(Q) ? p || (p = []) : (p = p || []).push(Q, null));
      for (Q in u) {
        var k = u[Q];
        if (w = c != null ? c[Q] : void 0, u.hasOwnProperty(Q) && k !== w && (k != null || w != null)) if (Q === "style") if (w) {
          for (y in w) !w.hasOwnProperty(y) || k && k.hasOwnProperty(y) || (l || (l = {}), l[y] = "");
          for (y in k) k.hasOwnProperty(y) && w[y] !== k[y] && (l || (l = {}), l[y] = k[y]);
        } else l || (p || (p = []), p.push(
          Q,
          l
        )), l = k;
        else Q === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, w = w ? w.__html : void 0, k != null && w !== k && (p = p || []).push(Q, k)) : Q === "children" ? typeof k != "string" && typeof k != "number" || (p = p || []).push(Q, "" + k) : Q !== "suppressContentEditableWarning" && Q !== "suppressHydrationWarning" && (J.hasOwnProperty(Q) ? (k != null && Q === "onScroll" && rn("scroll", n), p || w === k || (p = [])) : (p = p || []).push(Q, k));
      }
      l && (p = p || []).push("style", l);
      var Q = p;
      (r.updateQueue = Q) && (r.flags |= 4);
    }
  }, eh = function(n, r, l, u) {
    l !== u && (r.flags |= 4);
  };
  function Ns(n, r) {
    if (!kn) switch (n.tailMode) {
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
  function vr(n) {
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
        return vr(r), null;
      case 1:
        return qn(r.type) && mu(), vr(r), null;
      case 3:
        return u = r.stateNode, bo(), Cn(lr), Cn(Fn), it(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (n === null || n.child === null) && (Dc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Ba !== null && (Mo(Ba), Ba = null))), er(n, r), vr(r), null;
      case 5:
        Mc(r);
        var c = Co(hs.current);
        if (l = r.type, n !== null && r.stateNode != null) Zv(n, r, l, u, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!u) {
            if (r.stateNode === null) throw Error(b(166));
            return vr(r), null;
          }
          if (n = Co(Di.current), Dc(r)) {
            u = r.stateNode, l = r.type;
            var p = r.memoizedProps;
            switch (u[Ri] = r, u[us] = p, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                rn("cancel", u), rn("close", u);
                break;
              case "iframe":
              case "object":
              case "embed":
                rn("load", u);
                break;
              case "video":
              case "audio":
                for (c = 0; c < is.length; c++) rn(is[c], u);
                break;
              case "source":
                rn("error", u);
                break;
              case "img":
              case "image":
              case "link":
                rn(
                  "error",
                  u
                ), rn("load", u);
                break;
              case "details":
                rn("toggle", u);
                break;
              case "input":
                jt(u, p), rn("invalid", u);
                break;
              case "select":
                u._wrapperState = { wasMultiple: !!p.multiple }, rn("invalid", u);
                break;
              case "textarea":
                ar(u, p), rn("invalid", u);
            }
            mn(l, p), c = null;
            for (var y in p) if (p.hasOwnProperty(y)) {
              var w = p[y];
              y === "children" ? typeof w == "string" ? u.textContent !== w && (p.suppressHydrationWarning !== !0 && bc(u.textContent, w, n), c = ["children", w]) : typeof w == "number" && u.textContent !== "" + w && (p.suppressHydrationWarning !== !0 && bc(
                u.textContent,
                w,
                n
              ), c = ["children", "" + w]) : J.hasOwnProperty(y) && w != null && y === "onScroll" && rn("scroll", u);
            }
            switch (l) {
              case "input":
                Nn(u), Zr(u, p, !0);
                break;
              case "textarea":
                Nn(u), Dn(u);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof p.onClick == "function" && (u.onclick = jl);
            }
            u = c, r.updateQueue = u, u !== null && (r.flags |= 4);
          } else {
            y = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = fr(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = y.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof u.is == "string" ? n = y.createElement(l, { is: u.is }) : (n = y.createElement(l), l === "select" && (y = n, u.multiple ? y.multiple = !0 : u.size && (y.size = u.size))) : n = y.createElementNS(n, l), n[Ri] = r, n[us] = u, Ya(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (y = Gn(l, u), l) {
                case "dialog":
                  rn("cancel", n), rn("close", n), c = u;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  rn("load", n), c = u;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < is.length; c++) rn(is[c], n);
                  c = u;
                  break;
                case "source":
                  rn("error", n), c = u;
                  break;
                case "img":
                case "image":
                case "link":
                  rn(
                    "error",
                    n
                  ), rn("load", n), c = u;
                  break;
                case "details":
                  rn("toggle", n), c = u;
                  break;
                case "input":
                  jt(n, u), c = Pn(n, u), rn("invalid", n);
                  break;
                case "option":
                  c = u;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!u.multiple }, c = Re({}, u, { value: void 0 }), rn("invalid", n);
                  break;
                case "textarea":
                  ar(n, u), c = Un(n, u), rn("invalid", n);
                  break;
                default:
                  c = u;
              }
              mn(l, c), w = c;
              for (p in w) if (w.hasOwnProperty(p)) {
                var k = w[p];
                p === "style" ? un(n, k) : p === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, k != null && Ea(n, k)) : p === "children" ? typeof k == "string" ? (l !== "textarea" || k !== "") && Me(n, k) : typeof k == "number" && Me(n, "" + k) : p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && p !== "autoFocus" && (J.hasOwnProperty(p) ? k != null && p === "onScroll" && rn("scroll", n) : k != null && ce(n, p, k, y));
              }
              switch (l) {
                case "input":
                  Nn(n), Zr(n, u, !1);
                  break;
                case "textarea":
                  Nn(n), Dn(n);
                  break;
                case "option":
                  u.value != null && n.setAttribute("value", "" + xt(u.value));
                  break;
                case "select":
                  n.multiple = !!u.multiple, p = u.value, p != null ? _n(n, !!u.multiple, p, !1) : u.defaultValue != null && _n(
                    n,
                    !!u.multiple,
                    u.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = jl);
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
        return vr(r), null;
      case 6:
        if (n && r.stateNode != null) eh(n, r, n.memoizedProps, u);
        else {
          if (typeof u != "string" && r.stateNode === null) throw Error(b(166));
          if (l = Co(hs.current), Co(Di.current), Dc(r)) {
            if (u = r.stateNode, l = r.memoizedProps, u[Ri] = r, (p = u.nodeValue !== l) && (n = oa, n !== null)) switch (n.tag) {
              case 3:
                bc(u.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && bc(u.nodeValue, l, (n.mode & 1) !== 0);
            }
            p && (r.flags |= 4);
          } else u = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(u), u[Ri] = r, r.stateNode = u;
        }
        return vr(r), null;
      case 13:
        if (Cn(An), u = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (kn && ua !== null && r.mode & 1 && !(r.flags & 128)) fs(), Al(), r.flags |= 98560, p = !1;
          else if (p = Dc(r), u !== null && u.dehydrated !== null) {
            if (n === null) {
              if (!p) throw Error(b(318));
              if (p = r.memoizedState, p = p !== null ? p.dehydrated : null, !p) throw Error(b(317));
              p[Ri] = r;
            } else Al(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            vr(r), p = !1;
          } else Ba !== null && (Mo(Ba), Ba = null), p = !0;
          if (!p) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (u = u !== null, u !== (n !== null && n.memoizedState !== null) && u && (r.child.flags |= 8192, r.mode & 1 && (n === null || An.current & 1 ? Yn === 0 && (Yn = 3) : Kd())), r.updateQueue !== null && (r.flags |= 4), vr(r), null);
      case 4:
        return bo(), er(n, r), n === null && fu(r.stateNode.containerInfo), vr(r), null;
      case 10:
        return bd(r.type._context), vr(r), null;
      case 17:
        return qn(r.type) && mu(), vr(r), null;
      case 19:
        if (Cn(An), p = r.memoizedState, p === null) return vr(r), null;
        if (u = (r.flags & 128) !== 0, y = p.rendering, y === null) if (u) Ns(p, !1);
        else {
          if (Yn !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (y = Ac(n), y !== null) {
              for (r.flags |= 128, Ns(p, !1), u = y.updateQueue, u !== null && (r.updateQueue = u, r.flags |= 4), r.subtreeFlags = 0, u = l, l = r.child; l !== null; ) p = l, n = u, p.flags &= 14680066, y = p.alternate, y === null ? (p.childLanes = 0, p.lanes = n, p.child = null, p.subtreeFlags = 0, p.memoizedProps = null, p.memoizedState = null, p.updateQueue = null, p.dependencies = null, p.stateNode = null) : (p.childLanes = y.childLanes, p.lanes = y.lanes, p.child = y.child, p.subtreeFlags = 0, p.deletions = null, p.memoizedProps = y.memoizedProps, p.memoizedState = y.memoizedState, p.updateQueue = y.updateQueue, p.type = y.type, n = y.dependencies, p.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return tt(An, An.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          p.tail !== null && Tt() > Tu && (r.flags |= 128, u = !0, Ns(p, !1), r.lanes = 4194304);
        }
        else {
          if (!u) if (n = Ac(y), n !== null) {
            if (r.flags |= 128, u = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ns(p, !0), p.tail === null && p.tailMode === "hidden" && !y.alternate && !kn) return vr(r), null;
          } else 2 * Tt() - p.renderingStartTime > Tu && l !== 1073741824 && (r.flags |= 128, u = !0, Ns(p, !1), r.lanes = 4194304);
          p.isBackwards ? (y.sibling = r.child, r.child = y) : (l = p.last, l !== null ? l.sibling = y : r.child = y, p.last = y);
        }
        return p.tail !== null ? (r = p.tail, p.rendering = r, p.tail = r.sibling, p.renderingStartTime = Tt(), r.sibling = null, l = An.current, tt(An, u ? l & 1 | 2 : l & 1), r) : (vr(r), null);
      case 22:
      case 23:
        return Gd(), u = r.memoizedState !== null, n !== null && n.memoizedState !== null !== u && (r.flags |= 8192), u && r.mode & 1 ? Ra & 1073741824 && (vr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : vr(r), null;
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
        return qn(r.type) && mu(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return bo(), Cn(lr), Cn(Fn), it(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Mc(r), null;
      case 13:
        if (Cn(An), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(b(340));
          Al();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return Cn(An), null;
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
  var Ds = !1, Ar = !1, yy = typeof WeakSet == "function" ? WeakSet : Set, We = null;
  function Cu(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (u) {
      jn(n, r, u);
    }
    else l.current = null;
  }
  function lf(n, r, l) {
    try {
      l();
    } catch (u) {
      jn(n, r, u);
    }
  }
  var nh = !1;
  function rh(n, r) {
    if (os = za, n = rs(), hc(n)) {
      if ("selectionStart" in n) var l = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        l = (l = n.ownerDocument) && l.defaultView || window;
        var u = l.getSelection && l.getSelection();
        if (u && u.rangeCount !== 0) {
          l = u.anchorNode;
          var c = u.anchorOffset, p = u.focusNode;
          u = u.focusOffset;
          try {
            l.nodeType, p.nodeType;
          } catch {
            l = null;
            break e;
          }
          var y = 0, w = -1, k = -1, Q = 0, Ee = 0, _e = n, ye = null;
          t: for (; ; ) {
            for (var Ie; _e !== l || c !== 0 && _e.nodeType !== 3 || (w = y + c), _e !== p || u !== 0 && _e.nodeType !== 3 || (k = y + u), _e.nodeType === 3 && (y += _e.nodeValue.length), (Ie = _e.firstChild) !== null; )
              ye = _e, _e = Ie;
            for (; ; ) {
              if (_e === n) break t;
              if (ye === l && ++Q === c && (w = y), ye === p && ++Ee === u && (k = y), (Ie = _e.nextSibling) !== null) break;
              _e = ye, ye = _e.parentNode;
            }
            _e = Ie;
          }
          l = w === -1 || k === -1 ? null : { start: w, end: k };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (mo = { focusedElem: n, selectionRange: l }, za = !1, We = r; We !== null; ) if (r = We, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, We = n;
    else for (; We !== null; ) {
      r = We;
      try {
        var Ke = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Ke !== null) {
              var Ze = Ke.memoizedProps, Qn = Ke.memoizedState, U = r.stateNode, O = U.getSnapshotBeforeUpdate(r.elementType === r.type ? Ze : fi(r.type, Ze), Qn);
              U.__reactInternalSnapshotBeforeUpdate = O;
            }
            break;
          case 3:
            var V = r.stateNode.containerInfo;
            V.nodeType === 1 ? V.textContent = "" : V.nodeType === 9 && V.documentElement && V.removeChild(V.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(b(163));
        }
      } catch (xe) {
        jn(r, r.return, xe);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, We = n;
        break;
      }
      We = r.return;
    }
    return Ke = nh, nh = !1, Ke;
  }
  function Os(n, r, l) {
    var u = r.updateQueue;
    if (u = u !== null ? u.lastEffect : null, u !== null) {
      var c = u = u.next;
      do {
        if ((c.tag & n) === n) {
          var p = c.destroy;
          c.destroy = void 0, p !== void 0 && lf(r, l, p);
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
  function Bd(n) {
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
    r !== null && (n.alternate = null, of(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ri], delete r[us], delete r[ss], delete r[hu], delete r[hy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Ms(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function rl(n) {
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
  function Li(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = jl));
    else if (u !== 4 && (n = n.child, n !== null)) for (Li(n, r, l), n = n.sibling; n !== null; ) Li(n, r, l), n = n.sibling;
  }
  function Mi(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (u !== 4 && (n = n.child, n !== null)) for (Mi(n, r, l), n = n.sibling; n !== null; ) Mi(n, r, l), n = n.sibling;
  }
  var $n = null, Br = !1;
  function Vr(n, r, l) {
    for (l = l.child; l !== null; ) ah(n, r, l), l = l.sibling;
  }
  function ah(n, r, l) {
    if (ra && typeof ra.onCommitFiberUnmount == "function") try {
      ra.onCommitFiberUnmount(El, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Ar || Cu(l, r);
      case 6:
        var u = $n, c = Br;
        $n = null, Vr(n, r, l), $n = u, Br = c, $n !== null && (Br ? (n = $n, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : $n.removeChild(l.stateNode));
        break;
      case 18:
        $n !== null && (Br ? (n = $n, l = l.stateNode, n.nodeType === 8 ? vu(n.parentNode, l) : n.nodeType === 1 && vu(n, l), li(n)) : vu($n, l.stateNode));
        break;
      case 4:
        u = $n, c = Br, $n = l.stateNode.containerInfo, Br = !0, Vr(n, r, l), $n = u, Br = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Ar && (u = l.updateQueue, u !== null && (u = u.lastEffect, u !== null))) {
          c = u = u.next;
          do {
            var p = c, y = p.destroy;
            p = p.tag, y !== void 0 && (p & 2 || p & 4) && lf(l, r, y), c = c.next;
          } while (c !== u);
        }
        Vr(n, r, l);
        break;
      case 1:
        if (!Ar && (Cu(l, r), u = l.stateNode, typeof u.componentWillUnmount == "function")) try {
          u.props = l.memoizedProps, u.state = l.memoizedState, u.componentWillUnmount();
        } catch (w) {
          jn(l, r, w);
        }
        Vr(n, r, l);
        break;
      case 21:
        Vr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Ar = (u = Ar) || l.memoizedState !== null, Vr(n, r, l), Ar = u) : Vr(n, r, l);
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
  function di(n, r) {
    var l = r.deletions;
    if (l !== null) for (var u = 0; u < l.length; u++) {
      var c = l[u];
      try {
        var p = n, y = r, w = y;
        e: for (; w !== null; ) {
          switch (w.tag) {
            case 5:
              $n = w.stateNode, Br = !1;
              break e;
            case 3:
              $n = w.stateNode.containerInfo, Br = !0;
              break e;
            case 4:
              $n = w.stateNode.containerInfo, Br = !0;
              break e;
          }
          w = w.return;
        }
        if ($n === null) throw Error(b(160));
        ah(p, y, c), $n = null, Br = !1;
        var k = c.alternate;
        k !== null && (k.return = null), c.return = null;
      } catch (Q) {
        jn(c, r, Q);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Vd(r, n), r = r.sibling;
  }
  function Vd(n, r) {
    var l = n.alternate, u = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (di(r, n), da(n), u & 4) {
          try {
            Os(3, n, n.return), Ls(3, n);
          } catch (Ze) {
            jn(n, n.return, Ze);
          }
          try {
            Os(5, n, n.return);
          } catch (Ze) {
            jn(n, n.return, Ze);
          }
        }
        break;
      case 1:
        di(r, n), da(n), u & 512 && l !== null && Cu(l, l.return);
        break;
      case 5:
        if (di(r, n), da(n), u & 512 && l !== null && Cu(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            Me(c, "");
          } catch (Ze) {
            jn(n, n.return, Ze);
          }
        }
        if (u & 4 && (c = n.stateNode, c != null)) {
          var p = n.memoizedProps, y = l !== null ? l.memoizedProps : p, w = n.type, k = n.updateQueue;
          if (n.updateQueue = null, k !== null) try {
            w === "input" && p.type === "radio" && p.name != null && ln(c, p), Gn(w, y);
            var Q = Gn(w, p);
            for (y = 0; y < k.length; y += 2) {
              var Ee = k[y], _e = k[y + 1];
              Ee === "style" ? un(c, _e) : Ee === "dangerouslySetInnerHTML" ? Ea(c, _e) : Ee === "children" ? Me(c, _e) : ce(c, Ee, _e, Q);
            }
            switch (w) {
              case "input":
                Rn(c, p);
                break;
              case "textarea":
                ea(c, p);
                break;
              case "select":
                var ye = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!p.multiple;
                var Ie = p.value;
                Ie != null ? _n(c, !!p.multiple, Ie, !1) : ye !== !!p.multiple && (p.defaultValue != null ? _n(
                  c,
                  !!p.multiple,
                  p.defaultValue,
                  !0
                ) : _n(c, !!p.multiple, p.multiple ? [] : "", !1));
            }
            c[us] = p;
          } catch (Ze) {
            jn(n, n.return, Ze);
          }
        }
        break;
      case 6:
        if (di(r, n), da(n), u & 4) {
          if (n.stateNode === null) throw Error(b(162));
          c = n.stateNode, p = n.memoizedProps;
          try {
            c.nodeValue = p;
          } catch (Ze) {
            jn(n, n.return, Ze);
          }
        }
        break;
      case 3:
        if (di(r, n), da(n), u & 4 && l !== null && l.memoizedState.isDehydrated) try {
          li(r.containerInfo);
        } catch (Ze) {
          jn(n, n.return, Ze);
        }
        break;
      case 4:
        di(r, n), da(n);
        break;
      case 13:
        di(r, n), da(n), c = n.child, c.flags & 8192 && (p = c.memoizedState !== null, c.stateNode.isHidden = p, !p || c.alternate !== null && c.alternate.memoizedState !== null || (Yd = Tt())), u & 4 && ih(n);
        break;
      case 22:
        if (Ee = l !== null && l.memoizedState !== null, n.mode & 1 ? (Ar = (Q = Ar) || Ee, di(r, n), Ar = Q) : di(r, n), da(n), u & 8192) {
          if (Q = n.memoizedState !== null, (n.stateNode.isHidden = Q) && !Ee && n.mode & 1) for (We = n, Ee = n.child; Ee !== null; ) {
            for (_e = We = Ee; We !== null; ) {
              switch (ye = We, Ie = ye.child, ye.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Os(4, ye, ye.return);
                  break;
                case 1:
                  Cu(ye, ye.return);
                  var Ke = ye.stateNode;
                  if (typeof Ke.componentWillUnmount == "function") {
                    u = ye, l = ye.return;
                    try {
                      r = u, Ke.props = r.memoizedProps, Ke.state = r.memoizedState, Ke.componentWillUnmount();
                    } catch (Ze) {
                      jn(u, l, Ze);
                    }
                  }
                  break;
                case 5:
                  Cu(ye, ye.return);
                  break;
                case 22:
                  if (ye.memoizedState !== null) {
                    As(_e);
                    continue;
                  }
              }
              Ie !== null ? (Ie.return = ye, We = Ie) : As(_e);
            }
            Ee = Ee.sibling;
          }
          e: for (Ee = null, _e = n; ; ) {
            if (_e.tag === 5) {
              if (Ee === null) {
                Ee = _e;
                try {
                  c = _e.stateNode, Q ? (p = c.style, typeof p.setProperty == "function" ? p.setProperty("display", "none", "important") : p.display = "none") : (w = _e.stateNode, k = _e.memoizedProps.style, y = k != null && k.hasOwnProperty("display") ? k.display : null, w.style.display = Yt("display", y));
                } catch (Ze) {
                  jn(n, n.return, Ze);
                }
              }
            } else if (_e.tag === 6) {
              if (Ee === null) try {
                _e.stateNode.nodeValue = Q ? "" : _e.memoizedProps;
              } catch (Ze) {
                jn(n, n.return, Ze);
              }
            } else if ((_e.tag !== 22 && _e.tag !== 23 || _e.memoizedState === null || _e === n) && _e.child !== null) {
              _e.child.return = _e, _e = _e.child;
              continue;
            }
            if (_e === n) break e;
            for (; _e.sibling === null; ) {
              if (_e.return === null || _e.return === n) break e;
              Ee === _e && (Ee = null), _e = _e.return;
            }
            Ee === _e && (Ee = null), _e.sibling.return = _e.return, _e = _e.sibling;
          }
        }
        break;
      case 19:
        di(r, n), da(n), u & 4 && ih(n);
        break;
      case 21:
        break;
      default:
        di(
          r,
          n
        ), da(n);
    }
  }
  function da(n) {
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
            u.flags & 32 && (Me(c, ""), u.flags &= -33);
            var p = rl(n);
            Mi(n, p, c);
            break;
          case 3:
          case 4:
            var y = u.stateNode.containerInfo, w = rl(n);
            Li(n, w, y);
            break;
          default:
            throw Error(b(161));
        }
      } catch (k) {
        jn(n, n.return, k);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function gy(n, r, l) {
    We = n, Id(n);
  }
  function Id(n, r, l) {
    for (var u = (n.mode & 1) !== 0; We !== null; ) {
      var c = We, p = c.child;
      if (c.tag === 22 && u) {
        var y = c.memoizedState !== null || Ds;
        if (!y) {
          var w = c.alternate, k = w !== null && w.memoizedState !== null || Ar;
          w = Ds;
          var Q = Ar;
          if (Ds = y, (Ar = k) && !Q) for (We = c; We !== null; ) y = We, k = y.child, y.tag === 22 && y.memoizedState !== null ? $d(c) : k !== null ? (k.return = y, We = k) : $d(c);
          for (; p !== null; ) We = p, Id(p), p = p.sibling;
          We = c, Ds = w, Ar = Q;
        }
        lh(n);
      } else c.subtreeFlags & 8772 && p !== null ? (p.return = c, We = p) : lh(n);
    }
  }
  function lh(n) {
    for (; We !== null; ) {
      var r = We;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Ar || Ls(5, r);
              break;
            case 1:
              var u = r.stateNode;
              if (r.flags & 4 && !Ar) if (l === null) u.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : fi(r.type, l.memoizedProps);
                u.componentDidUpdate(c, l.memoizedState, u.__reactInternalSnapshotBeforeUpdate);
              }
              var p = r.updateQueue;
              p !== null && kd(r, p, u);
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
                  var Ee = Q.memoizedState;
                  if (Ee !== null) {
                    var _e = Ee.dehydrated;
                    _e !== null && li(_e);
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
          Ar || r.flags & 512 && Bd(r);
        } catch (ye) {
          jn(r, r.return, ye);
        }
      }
      if (r === n) {
        We = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, We = l;
        break;
      }
      We = r.return;
    }
  }
  function As(n) {
    for (; We !== null; ) {
      var r = We;
      if (r === n) {
        We = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, We = l;
        break;
      }
      We = r.return;
    }
  }
  function $d(n) {
    for (; We !== null; ) {
      var r = We;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ls(4, r);
            } catch (k) {
              jn(r, l, k);
            }
            break;
          case 1:
            var u = r.stateNode;
            if (typeof u.componentDidMount == "function") {
              var c = r.return;
              try {
                u.componentDidMount();
              } catch (k) {
                jn(r, c, k);
              }
            }
            var p = r.return;
            try {
              Bd(r);
            } catch (k) {
              jn(r, p, k);
            }
            break;
          case 5:
            var y = r.return;
            try {
              Bd(r);
            } catch (k) {
              jn(r, y, k);
            }
        }
      } catch (k) {
        jn(r, r.return, k);
      }
      if (r === n) {
        We = null;
        break;
      }
      var w = r.sibling;
      if (w !== null) {
        w.return = r.return, We = w;
        break;
      }
      We = r.return;
    }
  }
  var Sy = Math.ceil, Hl = ge.ReactCurrentDispatcher, Oo = ge.ReactCurrentOwner, Cr = ge.ReactCurrentBatchConfig, Ht = 0, ur = null, tr = null, br = 0, Ra = 0, bu = Pa(0), Yn = 0, zs = null, Ai = 0, wu = 0, uf = 0, Us = null, pa = null, Yd = 0, Tu = 1 / 0, _a = null, Ru = !1, Lo = null, Bl = null, sf = !1, al = null, Fs = 0, Vl = 0, _u = null, Ps = -1, zr = 0;
  function nr() {
    return Ht & 6 ? Tt() : Ps !== -1 ? Ps : Ps = Tt();
  }
  function zi(n) {
    return n.mode & 1 ? Ht & 2 && br !== 0 ? br & -br : my.transition !== null ? (zr === 0 && (zr = Zo()), zr) : (n = Gt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : lu(n.type)), n) : 1;
  }
  function Ir(n, r, l, u) {
    if (50 < Vl) throw Vl = 0, _u = null, Error(b(185));
    Yi(n, l, u), (!(Ht & 2) || n !== ur) && (n === ur && (!(Ht & 2) && (wu |= l), Yn === 4 && pi(n, br)), va(n, u), l === 1 && Ht === 0 && !(r.mode & 1) && (Tu = Tt() + 500, yu && ki()));
  }
  function va(n, r) {
    var l = n.callbackNode;
    lo(n, r);
    var u = ii(n, n === ur ? br : 0);
    if (u === 0) l !== null && gr(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = u & -u, n.callbackPriority !== r) {
      if (l != null && gr(l), r === 1) n.tag === 0 ? Dl(Qd.bind(null, n)) : kc(Qd.bind(null, n)), pu(function() {
        !(Ht & 6) && ki();
      }), l = null;
      else {
        switch (tu(u)) {
          case 1:
            l = ri;
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
    if (Ps = -1, zr = 0, Ht & 6) throw Error(b(327));
    var l = n.callbackNode;
    if (ku() && n.callbackNode !== l) return null;
    var u = ii(n, n === ur ? br : 0);
    if (u === 0) return null;
    if (u & 30 || u & n.expiredLanes || r) r = ff(n, u);
    else {
      r = u;
      var c = Ht;
      Ht |= 2;
      var p = uh();
      (ur !== n || br !== r) && (_a = null, Tu = Tt() + 500, il(n, r));
      do
        try {
          sh();
          break;
        } catch (w) {
          oh(n, w);
        }
      while (!0);
      Cd(), Hl.current = p, Ht = c, tr !== null ? r = 0 : (ur = null, br = 0, r = Yn);
    }
    if (r !== 0) {
      if (r === 2 && (c = Cl(n), c !== 0 && (u = c, r = Hs(n, c))), r === 1) throw l = zs, il(n, 0), pi(n, u), va(n, Tt()), l;
      if (r === 6) pi(n, u);
      else {
        if (c = n.current.alternate, !(u & 30) && !Ey(c) && (r = ff(n, u), r === 2 && (p = Cl(n), p !== 0 && (u = p, r = Hs(n, p))), r === 1)) throw l = zs, il(n, 0), pi(n, u), va(n, Tt()), l;
        switch (n.finishedWork = c, n.finishedLanes = u, r) {
          case 0:
          case 1:
            throw Error(b(345));
          case 2:
            zo(n, pa, _a);
            break;
          case 3:
            if (pi(n, u), (u & 130023424) === u && (r = Yd + 500 - Tt(), 10 < r)) {
              if (ii(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & u) !== u) {
                nr(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Tc(zo.bind(null, n, pa, _a), r);
              break;
            }
            zo(n, pa, _a);
            break;
          case 4:
            if (pi(n, u), (u & 4194240) === u) break;
            for (r = n.eventTimes, c = -1; 0 < u; ) {
              var y = 31 - Ur(u);
              p = 1 << y, y = r[y], y > c && (c = y), u &= ~p;
            }
            if (u = c, u = Tt() - u, u = (120 > u ? 120 : 480 > u ? 480 : 1080 > u ? 1080 : 1920 > u ? 1920 : 3e3 > u ? 3e3 : 4320 > u ? 4320 : 1960 * Sy(u / 1960)) - u, 10 < u) {
              n.timeoutHandle = Tc(zo.bind(null, n, pa, _a), u);
              break;
            }
            zo(n, pa, _a);
            break;
          case 5:
            zo(n, pa, _a);
            break;
          default:
            throw Error(b(329));
        }
      }
    }
    return va(n, Tt()), n.callbackNode === l ? cf.bind(null, n) : null;
  }
  function Hs(n, r) {
    var l = Us;
    return n.current.memoizedState.isDehydrated && (il(n, r).flags |= 256), n = ff(n, r), n !== 2 && (r = pa, pa = l, r !== null && Mo(r)), n;
  }
  function Mo(n) {
    pa === null ? pa = n : pa.push.apply(pa, n);
  }
  function Ey(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var u = 0; u < l.length; u++) {
          var c = l[u], p = c.getSnapshot;
          c = c.value;
          try {
            if (!ui(p(), c)) return !1;
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
  function pi(n, r) {
    for (r &= ~uf, r &= ~wu, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Ur(r), u = 1 << l;
      n[l] = -1, r &= ~u;
    }
  }
  function Qd(n) {
    if (Ht & 6) throw Error(b(327));
    ku();
    var r = ii(n, 0);
    if (!(r & 1)) return va(n, Tt()), null;
    var l = ff(n, r);
    if (n.tag !== 0 && l === 2) {
      var u = Cl(n);
      u !== 0 && (r = u, l = Hs(n, u));
    }
    if (l === 1) throw l = zs, il(n, 0), pi(n, r), va(n, Tt()), l;
    if (l === 6) throw Error(b(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, zo(n, pa, _a), va(n, Tt()), null;
  }
  function Wd(n, r) {
    var l = Ht;
    Ht |= 1;
    try {
      return n(r);
    } finally {
      Ht = l, Ht === 0 && (Tu = Tt() + 500, yu && ki());
    }
  }
  function Ao(n) {
    al !== null && al.tag === 0 && !(Ht & 6) && ku();
    var r = Ht;
    Ht |= 1;
    var l = Cr.transition, u = Gt;
    try {
      if (Cr.transition = null, Gt = 1, n) return n();
    } finally {
      Gt = u, Cr.transition = l, Ht = r, !(Ht & 6) && ki();
    }
  }
  function Gd() {
    Ra = bu.current, Cn(bu);
  }
  function il(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, yd(l)), tr !== null) for (l = tr.return; l !== null; ) {
      var u = l;
      switch (Nc(u), u.tag) {
        case 1:
          u = u.type.childContextTypes, u != null && mu();
          break;
        case 3:
          bo(), Cn(lr), Cn(Fn), it();
          break;
        case 5:
          Mc(u);
          break;
        case 4:
          bo();
          break;
        case 13:
          Cn(An);
          break;
        case 19:
          Cn(An);
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
    if (ur = n, tr = n = Il(n.current, null), br = Ra = r, Yn = 0, zs = null, uf = wu = Ai = 0, pa = Us = null, xo !== null) {
      for (r = 0; r < xo.length; r++) if (l = xo[r], u = l.interleaved, u !== null) {
        l.interleaved = null;
        var c = u.next, p = l.pending;
        if (p !== null) {
          var y = p.next;
          p.next = c, u.next = y;
        }
        l.pending = u;
      }
      xo = null;
    }
    return n;
  }
  function oh(n, r) {
    do {
      var l = tr;
      try {
        if (Cd(), Ot.current = jo, zc) {
          for (var u = qt.memoizedState; u !== null; ) {
            var c = u.queue;
            c !== null && (c.pending = null), u = u.next;
          }
          zc = !1;
        }
        if (pn = 0, pr = Jn = qt = null, ys = !1, wo = 0, Oo.current = null, l === null || l.return === null) {
          Yn = 1, zs = r, tr = null;
          break;
        }
        e: {
          var p = n, y = l.return, w = l, k = r;
          if (r = br, w.flags |= 32768, k !== null && typeof k == "object" && typeof k.then == "function") {
            var Q = k, Ee = w, _e = Ee.tag;
            if (!(Ee.mode & 1) && (_e === 0 || _e === 11 || _e === 15)) {
              var ye = Ee.alternate;
              ye ? (Ee.updateQueue = ye.updateQueue, Ee.memoizedState = ye.memoizedState, Ee.lanes = ye.lanes) : (Ee.updateQueue = null, Ee.memoizedState = null);
            }
            var Ie = Gv(y);
            if (Ie !== null) {
              Ie.flags &= -257, Pl(Ie, y, w, p, r), Ie.mode & 1 && zd(p, Q, r), r = Ie, k = Q;
              var Ke = r.updateQueue;
              if (Ke === null) {
                var Ze = /* @__PURE__ */ new Set();
                Ze.add(k), r.updateQueue = Ze;
              } else Ke.add(k);
              break e;
            } else {
              if (!(r & 1)) {
                zd(p, Q, r), Kd();
                break e;
              }
              k = Error(b(426));
            }
          } else if (kn && w.mode & 1) {
            var Qn = Gv(y);
            if (Qn !== null) {
              !(Qn.flags & 65536) && (Qn.flags |= 256), Pl(Qn, y, w, p, r), el(No(k, w));
              break e;
            }
          }
          p = k = No(k, w), Yn !== 4 && (Yn = 2), Us === null ? Us = [p] : Us.push(p), p = y;
          do {
            switch (p.tag) {
              case 3:
                p.flags |= 65536, r &= -r, p.lanes |= r;
                var U = Wv(p, k, r);
                Vv(p, U);
                break e;
              case 1:
                w = k;
                var O = p.type, V = p.stateNode;
                if (!(p.flags & 128) && (typeof O.getDerivedStateFromError == "function" || V !== null && typeof V.componentDidCatch == "function" && (Bl === null || !Bl.has(V)))) {
                  p.flags |= 65536, r &= -r, p.lanes |= r;
                  var xe = Ad(p, w, r);
                  Vv(p, xe);
                  break e;
                }
            }
            p = p.return;
          } while (p !== null);
        }
        fh(l);
      } catch (qe) {
        r = qe, tr === l && l !== null && (tr = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function uh() {
    var n = Hl.current;
    return Hl.current = jo, n === null ? jo : n;
  }
  function Kd() {
    (Yn === 0 || Yn === 3 || Yn === 2) && (Yn = 4), ur === null || !(Ai & 268435455) && !(wu & 268435455) || pi(ur, br);
  }
  function ff(n, r) {
    var l = Ht;
    Ht |= 2;
    var u = uh();
    (ur !== n || br !== r) && (_a = null, il(n, r));
    do
      try {
        xy();
        break;
      } catch (c) {
        oh(n, c);
      }
    while (!0);
    if (Cd(), Ht = l, Hl.current = u, tr !== null) throw Error(b(261));
    return ur = null, br = 0, Yn;
  }
  function xy() {
    for (; tr !== null; ) ch(tr);
  }
  function sh() {
    for (; tr !== null && !ti(); ) ch(tr);
  }
  function ch(n) {
    var r = hh(n.alternate, n, Ra);
    n.memoizedProps = n.pendingProps, r === null ? fh(n) : tr = r, Oo.current = null;
  }
  function fh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = af(l, r), l !== null) {
          l.flags &= 32767, tr = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          Yn = 6, tr = null;
          return;
        }
      } else if (l = th(l, r, Ra), l !== null) {
        tr = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        tr = r;
        return;
      }
      tr = r = n;
    } while (r !== null);
    Yn === 0 && (Yn = 5);
  }
  function zo(n, r, l) {
    var u = Gt, c = Cr.transition;
    try {
      Cr.transition = null, Gt = 1, Cy(n, r, l, u);
    } finally {
      Cr.transition = c, Gt = u;
    }
    return null;
  }
  function Cy(n, r, l, u) {
    do
      ku();
    while (al !== null);
    if (Ht & 6) throw Error(b(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(b(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var p = l.lanes | l.childLanes;
    if (qf(n, p), n === ur && (tr = ur = null, br = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || sf || (sf = !0, mh(io, function() {
      return ku(), null;
    })), p = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || p) {
      p = Cr.transition, Cr.transition = null;
      var y = Gt;
      Gt = 1;
      var w = Ht;
      Ht |= 4, Oo.current = null, rh(n, l), Vd(l, n), su(mo), za = !!os, mo = os = null, n.current = l, gy(l), ni(), Ht = w, Gt = y, Cr.transition = p;
    } else n.current = l;
    if (sf && (sf = !1, al = n, Fs = c), p = n.pendingLanes, p === 0 && (Bl = null), Wu(l.stateNode), va(n, Tt()), r !== null) for (u = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], u(c.value, { componentStack: c.stack, digest: c.digest });
    if (Ru) throw Ru = !1, n = Lo, Lo = null, n;
    return Fs & 1 && n.tag !== 0 && ku(), p = n.pendingLanes, p & 1 ? n === _u ? Vl++ : (Vl = 0, _u = n) : Vl = 0, ki(), null;
  }
  function ku() {
    if (al !== null) {
      var n = tu(Fs), r = Cr.transition, l = Gt;
      try {
        if (Cr.transition = null, Gt = 16 > n ? 16 : n, al === null) var u = !1;
        else {
          if (n = al, al = null, Fs = 0, Ht & 6) throw Error(b(331));
          var c = Ht;
          for (Ht |= 4, We = n.current; We !== null; ) {
            var p = We, y = p.child;
            if (We.flags & 16) {
              var w = p.deletions;
              if (w !== null) {
                for (var k = 0; k < w.length; k++) {
                  var Q = w[k];
                  for (We = Q; We !== null; ) {
                    var Ee = We;
                    switch (Ee.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Os(8, Ee, p);
                    }
                    var _e = Ee.child;
                    if (_e !== null) _e.return = Ee, We = _e;
                    else for (; We !== null; ) {
                      Ee = We;
                      var ye = Ee.sibling, Ie = Ee.return;
                      if (of(Ee), Ee === Q) {
                        We = null;
                        break;
                      }
                      if (ye !== null) {
                        ye.return = Ie, We = ye;
                        break;
                      }
                      We = Ie;
                    }
                  }
                }
                var Ke = p.alternate;
                if (Ke !== null) {
                  var Ze = Ke.child;
                  if (Ze !== null) {
                    Ke.child = null;
                    do {
                      var Qn = Ze.sibling;
                      Ze.sibling = null, Ze = Qn;
                    } while (Ze !== null);
                  }
                }
                We = p;
              }
            }
            if (p.subtreeFlags & 2064 && y !== null) y.return = p, We = y;
            else e: for (; We !== null; ) {
              if (p = We, p.flags & 2048) switch (p.tag) {
                case 0:
                case 11:
                case 15:
                  Os(9, p, p.return);
              }
              var U = p.sibling;
              if (U !== null) {
                U.return = p.return, We = U;
                break e;
              }
              We = p.return;
            }
          }
          var O = n.current;
          for (We = O; We !== null; ) {
            y = We;
            var V = y.child;
            if (y.subtreeFlags & 2064 && V !== null) V.return = y, We = V;
            else e: for (y = O; We !== null; ) {
              if (w = We, w.flags & 2048) try {
                switch (w.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ls(9, w);
                }
              } catch (qe) {
                jn(w, w.return, qe);
              }
              if (w === y) {
                We = null;
                break e;
              }
              var xe = w.sibling;
              if (xe !== null) {
                xe.return = w.return, We = xe;
                break e;
              }
              We = w.return;
            }
          }
          if (Ht = c, ki(), ra && typeof ra.onPostCommitFiberRoot == "function") try {
            ra.onPostCommitFiberRoot(El, n);
          } catch {
          }
          u = !0;
        }
        return u;
      } finally {
        Gt = l, Cr.transition = r;
      }
    }
    return !1;
  }
  function dh(n, r, l) {
    r = No(l, r), r = Wv(n, r, 1), n = zl(n, r, 1), r = nr(), n !== null && (Yi(n, 1, r), va(n, r));
  }
  function jn(n, r, l) {
    if (n.tag === 3) dh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        dh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var u = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (Bl === null || !Bl.has(u))) {
          n = No(l, n), n = Ad(r, n, 1), r = zl(r, n, 1), n = nr(), r !== null && (Yi(r, 1, n), va(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function by(n, r, l) {
    var u = n.pingCache;
    u !== null && u.delete(r), r = nr(), n.pingedLanes |= n.suspendedLanes & l, ur === n && (br & l) === l && (Yn === 4 || Yn === 3 && (br & 130023424) === br && 500 > Tt() - Yd ? il(n, 0) : uf |= l), va(n, r);
  }
  function ph(n, r) {
    r === 0 && (n.mode & 1 ? (r = xa, xa <<= 1, !(xa & 130023424) && (xa = 4194304)) : r = 1);
    var l = nr();
    n = wa(n, r), n !== null && (Yi(n, r, l), va(n, l));
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
    if (n !== null) if (n.memoizedProps !== r.pendingProps || lr.current) Zn = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return Zn = !1, js(n, r, l);
      Zn = !!(n.flags & 131072);
    }
    else Zn = !1, kn && r.flags & 1048576 && Fv(r, Zi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var u = r.type;
        Ia(n, r), n = r.pendingProps;
        var c = la(r, Fn.current);
        Mn(r, l), c = Ul(null, r, u, n, c, l);
        var p = ci();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, qn(u) ? (p = !0, dr(r)) : p = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, _d(r), c.updater = Zc, r.stateNode = c, c._reactInternals = r, ws(r, u, n, l), r = _s(null, r, u, !0, p, l)) : (r.tag = 0, kn && p && jc(r), xr(null, r, c, l), r = r.child), r;
      case 16:
        u = r.elementType;
        e: {
          switch (Ia(n, r), n = r.pendingProps, c = u._init, u = c(u._payload), r.type = u, c = r.tag = Ry(u), n = fi(u, n), c) {
            case 0:
              r = Kv(null, r, u, n, l);
              break e;
            case 1:
              r = qv(null, r, u, n, l);
              break e;
            case 11:
              r = fa(null, r, u, n, l);
              break e;
            case 14:
              r = Do(null, r, u, fi(u.type, n), l);
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
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : fi(u, c), Kv(n, r, u, c, l);
      case 1:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : fi(u, c), qv(n, r, u, c, l);
      case 3:
        e: {
          if (xu(r), n === null) throw Error(b(387));
          u = r.pendingProps, p = r.memoizedState, c = p.element, Bv(n, r), ds(r, u, null, l);
          var y = r.memoizedState;
          if (u = y.element, p.isDehydrated) if (p = { element: u, isDehydrated: !1, cache: y.cache, pendingSuspenseBoundaries: y.pendingSuspenseBoundaries, transitions: y.transitions }, r.updateQueue.baseState = p, r.memoizedState = p, r.flags & 256) {
            c = No(Error(b(423)), r), r = Xv(n, r, u, l, c);
            break e;
          } else if (u !== c) {
            c = No(Error(b(424)), r), r = Xv(n, r, u, l, c);
            break e;
          } else for (ua = Ti(r.stateNode.containerInfo.firstChild), oa = r, kn = !0, Ba = null, l = Pe(r, null, u, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Al(), u === c) {
              r = $a(n, r, l);
              break e;
            }
            xr(n, r, u, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Iv(r), n === null && Ed(r), u = r.type, c = r.pendingProps, p = n !== null ? n.memoizedProps : null, y = c.children, wc(u, c) ? y = null : p !== null && wc(u, p) && (r.flags |= 32), Ud(n, r), xr(n, r, y, l), r.child;
      case 6:
        return n === null && Ed(r), null;
      case 13:
        return rf(n, r, l);
      case 4:
        return jd(r, r.stateNode.containerInfo), u = r.pendingProps, n === null ? r.child = Vn(r, null, u, l) : xr(n, r, u, l), r.child;
      case 11:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : fi(u, c), fa(n, r, u, c, l);
      case 7:
        return xr(n, r, r.pendingProps, l), r.child;
      case 8:
        return xr(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return xr(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (u = r.type._context, c = r.pendingProps, p = r.memoizedProps, y = c.value, tt(ba, u._currentValue), u._currentValue = y, p !== null) if (ui(p.value, y)) {
            if (p.children === c.children && !lr.current) {
              r = $a(n, r, l);
              break e;
            }
          } else for (p = r.child, p !== null && (p.return = r); p !== null; ) {
            var w = p.dependencies;
            if (w !== null) {
              y = p.child;
              for (var k = w.firstContext; k !== null; ) {
                if (k.context === u) {
                  if (p.tag === 1) {
                    k = tl(-1, l & -l), k.tag = 2;
                    var Q = p.updateQueue;
                    if (Q !== null) {
                      Q = Q.shared;
                      var Ee = Q.pending;
                      Ee === null ? k.next = k : (k.next = Ee.next, Ee.next = k), Q.pending = k;
                    }
                  }
                  p.lanes |= l, k = p.alternate, k !== null && (k.lanes |= l), wd(
                    p.return,
                    l,
                    r
                  ), w.lanes |= l;
                  break;
                }
                k = k.next;
              }
            } else if (p.tag === 10) y = p.type === r.type ? null : p.child;
            else if (p.tag === 18) {
              if (y = p.return, y === null) throw Error(b(341));
              y.lanes |= l, w = y.alternate, w !== null && (w.lanes |= l), wd(y, l, r), y = p.sibling;
            } else y = p.child;
            if (y !== null) y.return = p;
            else for (y = p; y !== null; ) {
              if (y === r) {
                y = null;
                break;
              }
              if (p = y.sibling, p !== null) {
                p.return = y.return, y = p;
                break;
              }
              y = y.return;
            }
            p = y;
          }
          xr(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, u = r.pendingProps.children, Mn(r, l), c = Va(c), u = u(c), r.flags |= 1, xr(n, r, u, l), r.child;
      case 14:
        return u = r.type, c = fi(u, r.pendingProps), c = fi(u.type, c), Do(n, r, u, c, l);
      case 15:
        return _t(n, r, r.type, r.pendingProps, l);
      case 17:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : fi(u, c), Ia(n, r), r.tag = 1, qn(u) ? (n = !0, dr(r)) : n = !1, Mn(r, l), ef(r, u, c), ws(r, u, c, l), _s(null, r, u, !0, n, l);
      case 19:
        return Oi(n, r, l);
      case 22:
        return Rs(n, r, l);
    }
    throw Error(b(156, r.tag));
  };
  function mh(n, r) {
    return bn(n, r);
  }
  function Ty(n, r, l, u) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Qa(n, r, l, u) {
    return new Ty(n, r, l, u);
  }
  function qd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Ry(n) {
    if (typeof n == "function") return qd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Ge) return 11;
      if (n === nt) return 14;
    }
    return 2;
  }
  function Il(n, r) {
    var l = n.alternate;
    return l === null ? (l = Qa(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Bs(n, r, l, u, c, p) {
    var y = 2;
    if (u = n, typeof n == "function") qd(n) && (y = 1);
    else if (typeof n == "string") y = 5;
    else e: switch (n) {
      case G:
        return ll(l.children, c, p, r);
      case Ce:
        y = 8, c |= 8;
        break;
      case ve:
        return n = Qa(12, l, r, c | 2), n.elementType = ve, n.lanes = p, n;
      case ae:
        return n = Qa(13, l, r, c), n.elementType = ae, n.lanes = p, n;
      case Fe:
        return n = Qa(19, l, r, c), n.elementType = Fe, n.lanes = p, n;
      case De:
        return $l(l, c, p, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Te:
            y = 10;
            break e;
          case Le:
            y = 9;
            break e;
          case Ge:
            y = 11;
            break e;
          case nt:
            y = 14;
            break e;
          case we:
            y = 16, u = null;
            break e;
        }
        throw Error(b(130, n == null ? n : typeof n, ""));
    }
    return r = Qa(y, l, r, c), r.elementType = n, r.type = u, r.lanes = p, r;
  }
  function ll(n, r, l, u) {
    return n = Qa(7, n, u, r), n.lanes = l, n;
  }
  function $l(n, r, l, u) {
    return n = Qa(22, n, u, r), n.elementType = De, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Xd(n, r, l) {
    return n = Qa(6, n, null, r), n.lanes = l, n;
  }
  function df(n, r, l) {
    return r = Qa(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function yh(n, r, l, u, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = eu(0), this.expirationTimes = eu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = eu(0), this.identifierPrefix = u, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function pf(n, r, l, u, c, p, y, w, k) {
    return n = new yh(n, r, l, w, k), r === 1 ? (r = 1, p === !0 && (r |= 8)) : r = 0, p = Qa(3, null, null, r), n.current = p, p.stateNode = n, p.memoizedState = { element: u, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, _d(p), n;
  }
  function _y(n, r, l) {
    var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ue, key: u == null ? null : "" + u, children: n, containerInfo: r, implementation: l };
  }
  function Jd(n) {
    if (!n) return Lr;
    n = n._reactInternals;
    e: {
      if (rt(n) !== n || n.tag !== 1) throw Error(b(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (qn(r.type)) {
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
      if (qn(l)) return cs(n, l, r);
    }
    return r;
  }
  function gh(n, r, l, u, c, p, y, w, k) {
    return n = pf(l, u, !0, n, c, p, y, w, k), n.context = Jd(null), l = n.current, u = nr(), c = zi(l), p = tl(u, c), p.callback = r ?? null, zl(l, p, c), n.current.lanes = c, Yi(n, c, u), va(n, u), n;
  }
  function vf(n, r, l, u) {
    var c = r.current, p = nr(), y = zi(c);
    return l = Jd(l), r.context === null ? r.context = l : r.pendingContext = l, r = tl(p, y), r.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (r.callback = u), n = zl(c, r, y), n !== null && (Ir(n, c, y, p), Lc(n, c, y)), y;
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
      }), r[Xi] = null;
    }
  };
  function yf(n) {
    this._internalRoot = n;
  }
  yf.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = yt();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < ir.length && r !== 0 && r < ir[l].priority; l++) ;
      ir.splice(l, 0, n), l === 0 && qu(n);
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
        var p = u;
        u = function() {
          var Q = hf(y);
          p.call(Q);
        };
      }
      var y = gh(r, u, n, 0, null, !1, !1, "", Eh);
      return n._reactRootContainer = y, n[Xi] = y.current, fu(n.nodeType === 8 ? n.parentNode : n), Ao(), y;
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
    return n._reactRootContainer = k, n[Xi] = k.current, fu(n.nodeType === 8 ? n.parentNode : n), Ao(function() {
      vf(r, k, l, u);
    }), k;
  }
  function Vs(n, r, l, u, c) {
    var p = l._reactRootContainer;
    if (p) {
      var y = p;
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
  It = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = ai(r.pendingLanes);
          l !== 0 && (Qi(r, l | 1), va(r, Tt()), !(Ht & 6) && (Tu = Tt() + 500, ki()));
        }
        break;
      case 13:
        Ao(function() {
          var u = wa(n, 1);
          if (u !== null) {
            var c = nr();
            Ir(u, n, 1, c);
          }
        }), mf(n, 1);
    }
  }, Gu = function(n) {
    if (n.tag === 13) {
      var r = wa(n, 134217728);
      if (r !== null) {
        var l = nr();
        Ir(r, n, 134217728, l);
      }
      mf(n, 134217728);
    }
  }, Ei = function(n) {
    if (n.tag === 13) {
      var r = zi(n), l = wa(n, r);
      if (l !== null) {
        var u = nr();
        Ir(l, n, r, u);
      }
      mf(n, r);
    }
  }, yt = function() {
    return Gt;
  }, nu = function(n, r) {
    var l = Gt;
    try {
      return Gt = n, r();
    } finally {
      Gt = l;
    }
  }, nn = function(n, r, l) {
    switch (r) {
      case "input":
        if (Rn(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var u = l[r];
            if (u !== n && u.form === n.form) {
              var c = Ln(u);
              if (!c) throw Error(b(90));
              cr(u), Rn(u, c);
            }
          }
        }
        break;
      case "textarea":
        ea(n, l);
        break;
      case "select":
        r = l.value, r != null && _n(n, !!l.multiple, r, !1);
    }
  }, $i = Wd, yi = Ao;
  var jy = { usingClientEntryPoint: !1, Events: [at, si, Ln, ei, La, Wd] }, Is = { findFiberByHostInstance: yo, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, xh = { bundleType: Is.bundleType, version: Is.version, rendererPackageName: Is.rendererPackageName, rendererConfig: Is.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ge.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Bn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Is.findFiberByHostInstance || Sh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Yl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Yl.isDisabled && Yl.supportsFiber) try {
      El = Yl.inject(xh), ra = Yl;
    } catch {
    }
  }
  return Ja.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = jy, Ja.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!tp(r)) throw Error(b(200));
    return _y(n, r, null, l);
  }, Ja.createRoot = function(n, r) {
    if (!tp(n)) throw Error(b(299));
    var l = !1, u = "", c = Uo;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (u = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = pf(n, 1, !1, null, null, l, !1, u, c), n[Xi] = r.current, fu(n.nodeType === 8 ? n.parentNode : n), new ep(r);
  }, Ja.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(b(188)) : (n = Object.keys(n).join(","), Error(b(268, n)));
    return n = Bn(r), n = n === null ? null : n.stateNode, n;
  }, Ja.flushSync = function(n) {
    return Ao(n);
  }, Ja.hydrate = function(n, r, l) {
    if (!gf(r)) throw Error(b(200));
    return Vs(null, n, r, !0, l);
  }, Ja.hydrateRoot = function(n, r, l) {
    if (!tp(n)) throw Error(b(405));
    var u = l != null && l.hydratedSources || null, c = !1, p = "", y = Uo;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (p = l.identifierPrefix), l.onRecoverableError !== void 0 && (y = l.onRecoverableError)), r = gh(r, null, n, 1, l ?? null, c, !1, p, y), n[Xi] = r.current, fu(n), u) for (n = 0; n < u.length; n++) l = u[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new yf(r);
  }, Ja.render = function(n, r, l) {
    if (!gf(r)) throw Error(b(200));
    return Vs(null, n, r, !1, l);
  }, Ja.unmountComponentAtNode = function(n) {
    if (!gf(n)) throw Error(b(40));
    return n._reactRootContainer ? (Ao(function() {
      Vs(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Xi] = null;
      });
    }), !0) : !1;
  }, Ja.unstable_batchedUpdates = Wd, Ja.unstable_renderSubtreeIntoContainer = function(n, r, l, u) {
    if (!gf(l)) throw Error(b(200));
    if (n == null || n._reactInternals === void 0) throw Error(b(38));
    return Vs(n, r, l, !1, u);
  }, Ja.version = "18.3.1-next-f1338f8080-20240426", Ja;
}
var Za = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gw;
function Nj() {
  return gw || (gw = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var E = z, x = Tw(), b = E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, K = !1;
    function J(e) {
      K = e;
    }
    function j(e) {
      if (!K) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        re("warn", e, a);
      }
    }
    function g(e) {
      if (!K) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        re("error", e, a);
      }
    }
    function re(e, t, a) {
      {
        var i = b.ReactDebugCurrentFrame, o = i.getStackAddendum();
        o !== "" && (t += "%s", a = a.concat([o]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var D = 0, B = 1, oe = 2, F = 3, I = 4, ne = 5, ie = 6, Z = 7, me = 8, Ue = 9, se = 10, ce = 11, ge = 12, fe = 13, ue = 14, G = 15, Ce = 16, ve = 17, Te = 18, Le = 19, Ge = 21, ae = 22, Fe = 23, nt = 24, we = 25, De = !0, be = !1, Be = !1, Re = !1, M = !1, _ = !0, pe = !0, Ye = !0, Rt = !0, gt = /* @__PURE__ */ new Set(), pt = {}, xt = {};
    function wt(e, t) {
      en(e, t), en(e + "Capture", t);
    }
    function en(e, t) {
      pt[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), pt[e] = t;
      {
        var a = e.toLowerCase();
        xt[a] = e, e === "onDoubleClick" && (xt.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        gt.add(t[i]);
    }
    var Nn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", cr = Object.prototype.hasOwnProperty;
    function gn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function Pn(e) {
      try {
        return jt(e), !1;
      } catch {
        return !0;
      }
    }
    function jt(e) {
      return "" + e;
    }
    function ln(e, t) {
      if (Pn(e))
        return g("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, gn(e)), jt(e);
    }
    function Rn(e) {
      if (Pn(e))
        return g("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", gn(e)), jt(e);
    }
    function Zr(e, t) {
      if (Pn(e))
        return g("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, gn(e)), jt(e);
    }
    function Or(e, t) {
      if (Pn(e))
        return g("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, gn(e)), jt(e);
    }
    function Hn(e) {
      if (Pn(e))
        return g("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", gn(e)), jt(e);
    }
    function _n(e) {
      if (Pn(e))
        return g("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", gn(e)), jt(e);
    }
    var Un = 0, ar = 1, ea = 2, Dn = 3, fr = 4, on = 5, ta = 6, Ea = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", Me = Ea + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", Je = new RegExp("^[" + Ea + "][" + Me + "]*$"), Ct = {}, Yt = {};
    function un(e) {
      return cr.call(Yt, e) ? !0 : cr.call(Ct, e) ? !1 : Je.test(e) ? (Yt[e] = !0, !0) : (Ct[e] = !0, g("Invalid attribute name: `%s`", e), !1);
    }
    function tn(e, t, a) {
      return t !== null ? t.type === Un : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function mn(e, t, a, i) {
      if (a !== null && a.type === Un)
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
    function Gn(e, t, a, i) {
      if (t === null || typeof t > "u" || mn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case Dn:
            return !t;
          case fr:
            return t === !1;
          case on:
            return isNaN(t);
          case ta:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function sn(e) {
      return nn.hasOwnProperty(e) ? nn[e] : null;
    }
    function Ut(e, t, a, i, o, s, f) {
      this.acceptsBooleans = t === ea || t === Dn || t === fr, this.attributeName = i, this.attributeNamespace = o, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var nn = {}, yr = [
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
    yr.forEach(function(e) {
      nn[e] = new Ut(
        e,
        Un,
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
      nn[t] = new Ut(
        t,
        ar,
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
      nn[e] = new Ut(
        e,
        ea,
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
      nn[e] = new Ut(
        e,
        ea,
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
      nn[e] = new Ut(
        e,
        Dn,
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
      nn[e] = new Ut(
        e,
        Dn,
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
      nn[e] = new Ut(
        e,
        fr,
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
      nn[e] = new Ut(
        e,
        ta,
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
      nn[e] = new Ut(
        e,
        on,
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
    var Sn = /[\-\:]([a-z])/g, na = function(e) {
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
      var t = e.replace(Sn, na);
      nn[t] = new Ut(
        t,
        ar,
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
      var t = e.replace(Sn, na);
      nn[t] = new Ut(
        t,
        ar,
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
      var t = e.replace(Sn, na);
      nn[t] = new Ut(
        t,
        ar,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      nn[e] = new Ut(
        e,
        ar,
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
    var ei = "xlinkHref";
    nn[ei] = new Ut(
      "xlinkHref",
      ar,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      nn[e] = new Ut(
        e,
        ar,
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
    var La = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, $i = !1;
    function yi(e) {
      !$i && La.test(e) && ($i = !0, g("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function gi(e, t, a, i) {
      if (i.mustUseProperty) {
        var o = i.propertyName;
        return e[o];
      } else {
        ln(a, t), i.sanitizeURL && yi("" + a);
        var s = i.attributeName, f = null;
        if (i.type === fr) {
          if (e.hasAttribute(s)) {
            var v = e.getAttribute(s);
            return v === "" ? !0 : Gn(t, a, i, !1) ? v : v === "" + a ? a : v;
          }
        } else if (e.hasAttribute(s)) {
          if (Gn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === Dn)
            return a;
          f = e.getAttribute(s);
        }
        return Gn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function Si(e, t, a, i) {
      {
        if (!un(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var o = e.getAttribute(t);
        return ln(a, t), o === "" + a ? a : o;
      }
    }
    function Se(e, t, a, i) {
      var o = sn(t);
      if (!tn(t, o, i)) {
        if (Gn(t, a, o, i) && (a = null), i || o === null) {
          if (un(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (ln(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = o.mustUseProperty;
        if (f) {
          var v = o.propertyName;
          if (a === null) {
            var h = o.type;
            e[v] = h === Dn ? !1 : "";
          } else
            e[v] = a;
          return;
        }
        var S = o.attributeName, C = o.attributeNamespace;
        if (a === null)
          e.removeAttribute(S);
        else {
          var L = o.type, N;
          L === Dn || L === fr && a === !0 ? N = "" : (ln(a, S), N = "" + a, o.sanitizeURL && yi(N.toString())), C ? e.setAttributeNS(C, S, N) : e.setAttribute(S, N);
        }
      }
    }
    var A = Symbol.for("react.element"), de = Symbol.for("react.portal"), vt = Symbol.for("react.fragment"), St = Symbol.for("react.strict_mode"), At = Symbol.for("react.profiler"), Qt = Symbol.for("react.provider"), T = Symbol.for("react.context"), X = Symbol.for("react.forward_ref"), Ne = Symbol.for("react.suspense"), Oe = Symbol.for("react.suspense_list"), rt = Symbol.for("react.memo"), ht = Symbol.for("react.lazy"), Lt = Symbol.for("react.scope"), Dt = Symbol.for("react.debug_trace_mode"), Bn = Symbol.for("react.offscreen"), En = Symbol.for("react.legacy_hidden"), bn = Symbol.for("react.cache"), gr = Symbol.for("react.tracing_marker"), ti = Symbol.iterator, ni = "@@iterator";
    function Tt(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = ti && e[ti] || e[ni];
      return typeof t == "function" ? t : null;
    }
    var kt = Object.assign, ri = 0, ao, io, Sl, qo, El, ra, Wu;
    function Ur() {
    }
    Ur.__reactDisabledLog = !0;
    function sc() {
      {
        if (ri === 0) {
          ao = console.log, io = console.info, Sl = console.warn, qo = console.error, El = console.group, ra = console.groupCollapsed, Wu = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Ur,
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
        ri++;
      }
    }
    function cc() {
      {
        if (ri--, ri === 0) {
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
              value: Sl
            }),
            error: kt({}, e, {
              value: qo
            }),
            group: kt({}, e, {
              value: El
            }),
            groupCollapsed: kt({}, e, {
              value: ra
            }),
            groupEnd: kt({}, e, {
              value: Wu
            })
          });
        }
        ri < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Xo = b.ReactCurrentDispatcher, xl;
    function xa(e, t, a) {
      {
        if (xl === void 0)
          try {
            throw Error();
          } catch (o) {
            var i = o.stack.trim().match(/\n( *(at )?)/);
            xl = i && i[1] || "";
          }
        return `
` + xl + e;
      }
    }
    var ai = !1, ii;
    {
      var Jo = typeof WeakMap == "function" ? WeakMap : Map;
      ii = new Jo();
    }
    function lo(e, t) {
      if (!e || ai)
        return "";
      {
        var a = ii.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      ai = !0;
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
`), S = v.length - 1, C = h.length - 1; S >= 1 && C >= 0 && v[S] !== h[C]; )
            C--;
          for (; S >= 1 && C >= 0; S--, C--)
            if (v[S] !== h[C]) {
              if (S !== 1 || C !== 1)
                do
                  if (S--, C--, C < 0 || v[S] !== h[C]) {
                    var L = `
` + v[S].replace(" at new ", " at ");
                    return e.displayName && L.includes("<anonymous>") && (L = L.replace("<anonymous>", e.displayName)), typeof e == "function" && ii.set(e, L), L;
                  }
                while (S >= 1 && C >= 0);
              break;
            }
        }
      } finally {
        ai = !1, Xo.current = s, cc(), Error.prepareStackTrace = o;
      }
      var N = e ? e.displayName || e.name : "", $ = N ? xa(N) : "";
      return typeof e == "function" && ii.set(e, $), $;
    }
    function Cl(e, t, a) {
      return lo(e, !0);
    }
    function Zo(e, t, a) {
      return lo(e, !1);
    }
    function eu(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Yi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return lo(e, eu(e));
      if (typeof e == "string")
        return xa(e);
      switch (e) {
        case Ne:
          return xa("Suspense");
        case Oe:
          return xa("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case X:
            return Zo(e.render);
          case rt:
            return Yi(e.type, t, a);
          case ht: {
            var i = e, o = i._payload, s = i._init;
            try {
              return Yi(s(o), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function qf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ne:
          return xa(e.type);
        case Ce:
          return xa("Lazy");
        case fe:
          return xa("Suspense");
        case Le:
          return xa("SuspenseList");
        case D:
        case oe:
        case G:
          return Zo(e.type);
        case ce:
          return Zo(e.type.render);
        case B:
          return Cl(e.type);
        default:
          return "";
      }
    }
    function Qi(e) {
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
    function Gt(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var o = t.displayName || t.name || "";
      return o !== "" ? a + "(" + o + ")" : a;
    }
    function tu(e) {
      return e.displayName || "Context";
    }
    function It(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && g("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case vt:
          return "Fragment";
        case de:
          return "Portal";
        case At:
          return "Profiler";
        case St:
          return "StrictMode";
        case Ne:
          return "Suspense";
        case Oe:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case T:
            var t = e;
            return tu(t) + ".Consumer";
          case Qt:
            var a = e;
            return tu(a._context) + ".Provider";
          case X:
            return Gt(e, e.render, "ForwardRef");
          case rt:
            var i = e.displayName || null;
            return i !== null ? i : It(e.type) || "Memo";
          case ht: {
            var o = e, s = o._payload, f = o._init;
            try {
              return It(f(s));
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
    function Ei(e) {
      return e.displayName || "Context";
    }
    function yt(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case nt:
          return "Cache";
        case Ue:
          var i = a;
          return Ei(i) + ".Consumer";
        case se:
          var o = a;
          return Ei(o._context) + ".Provider";
        case Te:
          return "DehydratedFragment";
        case ce:
          return Gu(a, a.render, "ForwardRef");
        case Z:
          return "Fragment";
        case ne:
          return a;
        case I:
          return "Portal";
        case F:
          return "Root";
        case ie:
          return "Text";
        case Ce:
          return It(a);
        case me:
          return a === St ? "StrictMode" : "Mode";
        case ae:
          return "Offscreen";
        case ge:
          return "Profiler";
        case Ge:
          return "Scope";
        case fe:
          return "Suspense";
        case Le:
          return "SuspenseList";
        case we:
          return "TracingMarker";
        case B:
        case D:
        case ve:
        case oe:
        case ue:
        case G:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var nu = b.ReactDebugCurrentFrame, Sr = null, xi = !1;
    function Fr() {
      {
        if (Sr === null)
          return null;
        var e = Sr._debugOwner;
        if (e !== null && typeof e < "u")
          return yt(e);
      }
      return null;
    }
    function Ci() {
      return Sr === null ? "" : Qi(Sr);
    }
    function wn() {
      nu.getCurrentStack = null, Sr = null, xi = !1;
    }
    function cn(e) {
      nu.getCurrentStack = e === null ? null : Ci, Sr = e, xi = !1;
    }
    function bl() {
      return Sr;
    }
    function ir(e) {
      xi = e;
    }
    function Pr(e) {
      return "" + e;
    }
    function Ma(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return _n(e), e;
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
    function wl(e) {
      return e._valueTracker;
    }
    function uo(e) {
      e._valueTracker = null;
    }
    function Xf(e) {
      var t = "";
      return e && (qu(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Aa(e) {
      var t = qu(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      _n(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var o = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return o.call(this);
          },
          set: function(v) {
            _n(v), i = "" + v, s.call(this, v);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(v) {
            _n(v), i = "" + v;
          },
          stopTracking: function() {
            uo(e), delete e[t];
          }
        };
        return f;
      }
    }
    function li(e) {
      wl(e) || (e._valueTracker = Aa(e));
    }
    function bi(e) {
      if (!e)
        return !1;
      var t = wl(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Xf(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function za(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var ru = !1, au = !1, Tl = !1, so = !1;
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
    function oi(e, t) {
      Ku("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !au && (g("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Fr() || "A component", t.type), au = !0), t.value !== void 0 && t.defaultValue !== void 0 && !ru && (g("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Fr() || "A component", t.type), ru = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: Ma(t.value != null ? t.value : i),
        controlled: iu(t)
      };
    }
    function m(e, t) {
      var a = e, i = t.checked;
      i != null && Se(a, "checked", i, !1);
    }
    function R(e, t) {
      var a = e;
      {
        var i = iu(t);
        !a._wrapperState.controlled && i && !so && (g("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), so = !0), a._wrapperState.controlled && !i && !Tl && (g("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Tl = !0);
      }
      m(e, t);
      var o = Ma(t.value), s = t.type;
      if (o != null)
        s === "number" ? (o === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != o) && (a.value = Pr(o)) : a.value !== Pr(o) && (a.value = Pr(o));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? lt(a, t.type, o) : t.hasOwnProperty("defaultValue") && lt(a, t.type, Ma(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function Y(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var o = t.type, s = o === "submit" || o === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Pr(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var v = i.name;
      v !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, v !== "" && (i.name = v);
    }
    function q(e, t) {
      var a = e;
      R(a, t), je(a, t);
    }
    function je(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        ln(a, "name");
        for (var o = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < o.length; s++) {
          var f = o[s];
          if (!(f === e || f.form !== e.form)) {
            var v = Ph(f);
            if (!v)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            bi(f), R(f, v);
          }
        }
      }
    }
    function lt(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || za(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Pr(e._wrapperState.initialValue) : e.defaultValue !== Pr(a) && (e.defaultValue = Pr(a)));
    }
    var ze = !1, st = !1, Mt = !1;
    function $t(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? E.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || st || (st = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Mt || (Mt = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !ze && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), ze = !0);
    }
    function xn(e, t) {
      t.value != null && e.setAttribute("value", Pr(Ma(t.value)));
    }
    var fn = Array.isArray;
    function Nt(e) {
      return fn(e);
    }
    var dn;
    dn = !1;
    function On() {
      var e = Fr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Rl = ["value", "defaultValue"];
    function Xu(e) {
      {
        Ku("select", e);
        for (var t = 0; t < Rl.length; t++) {
          var a = Rl[t];
          if (e[a] != null) {
            var i = Nt(e[a]);
            e.multiple && !i ? g("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, On()) : !e.multiple && i && g("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, On());
          }
        }
      }
    }
    function Wi(e, t, a, i) {
      var o = e.options;
      if (t) {
        for (var s = a, f = {}, v = 0; v < s.length; v++)
          f["$" + s[v]] = !0;
        for (var h = 0; h < o.length; h++) {
          var S = f.hasOwnProperty("$" + o[h].value);
          o[h].selected !== S && (o[h].selected = S), S && i && (o[h].defaultSelected = !0);
        }
      } else {
        for (var C = Pr(Ma(a)), L = null, N = 0; N < o.length; N++) {
          if (o[N].value === C) {
            o[N].selected = !0, i && (o[N].defaultSelected = !0);
            return;
          }
          L === null && !o[N].disabled && (L = o[N]);
        }
        L !== null && (L.selected = !0);
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
      }, t.value !== void 0 && t.defaultValue !== void 0 && !dn && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), dn = !0);
    }
    function Jf(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Wi(a, !!t.multiple, i, !1) : t.defaultValue != null && Wi(a, !!t.multiple, t.defaultValue, !0);
    }
    function fc(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var o = t.value;
      o != null ? Wi(a, !!t.multiple, o, !1) : i !== !!t.multiple && (t.defaultValue != null ? Wi(a, !!t.multiple, t.defaultValue, !0) : Wi(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Zf(e, t) {
      var a = e, i = t.value;
      i != null && Wi(a, !!t.multiple, i, !1);
    }
    var uv = !1;
    function ed(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = kt({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Pr(a._wrapperState.initialValue)
      });
      return i;
    }
    function td(e, t) {
      var a = e;
      Ku("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !uv && (g("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Fr() || "A component"), uv = !0);
      var i = t.value;
      if (i == null) {
        var o = t.children, s = t.defaultValue;
        if (o != null) {
          g("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (Nt(o)) {
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
        initialValue: Ma(i)
      };
    }
    function sv(e, t) {
      var a = e, i = Ma(t.value), o = Ma(t.defaultValue);
      if (i != null) {
        var s = Pr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      o != null && (a.defaultValue = Pr(o));
    }
    function cv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ay(e, t) {
      sv(e, t);
    }
    var Gi = "http://www.w3.org/1999/xhtml", nd = "http://www.w3.org/1998/Math/MathML", rd = "http://www.w3.org/2000/svg";
    function ad(e) {
      switch (e) {
        case "svg":
          return rd;
        case "math":
          return nd;
        default:
          return Gi;
      }
    }
    function id(e, t) {
      return e == null || e === Gi ? ad(t) : e === rd && t === "foreignObject" ? Gi : e;
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
    }), aa = 1, Ki = 3, Kn = 8, qi = 9, ld = 11, ou = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Ki) {
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
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(es.hasOwnProperty(e) && es[e]) ? t + "px" : (Or(t, e), ("" + t).trim());
    }
    var hv = /([A-Z])/g, mv = /^ms-/;
    function uu(e) {
      return e.replace(hv, "-$1").toLowerCase().replace(mv, "-ms-");
    }
    var yv = function() {
    };
    {
      var iy = /^(?:webkit|moz|o)[A-Z]/, ly = /^-ms-/, gv = /-(.)/g, od = /;\s*$/, wi = {}, fo = {}, Sv = !1, ts = !1, oy = function(e) {
        return e.replace(gv, function(t, a) {
          return a.toUpperCase();
        });
      }, Ev = function(e) {
        wi.hasOwnProperty(e) && wi[e] || (wi[e] = !0, g(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          oy(e.replace(ly, "ms-"))
        ));
      }, ud = function(e) {
        wi.hasOwnProperty(e) && wi[e] || (wi[e] = !0, g("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, sd = function(e, t) {
        fo.hasOwnProperty(t) && fo[t] || (fo[t] = !0, g(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(od, "")));
      }, xv = function(e, t) {
        Sv || (Sv = !0, g("`NaN` is an invalid value for the `%s` css style property.", e));
      }, Cv = function(e, t) {
        ts || (ts = !0, g("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      yv = function(e, t) {
        e.indexOf("-") > -1 ? Ev(e) : iy.test(e) ? ud(e) : od.test(t) && sd(e, t), typeof t == "number" && (isNaN(t) ? xv(e, t) : isFinite(t) || Cv(e, t));
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
    var ui = {
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
    }, ui), Rv = "__html";
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
    function _l(e, t) {
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
    }, su = {}, fy = new RegExp("^(aria)-[" + Me + "]*$"), cu = new RegExp("^(aria)[A-Z][" + Me + "]*$");
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
      _l(e, t) || as(e, t);
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
      var Er = {}, pd = /^on./, yc = /^on[^A-Z]/, _v = new RegExp("^(aria)-[" + Me + "]*$"), kv = new RegExp("^(aria)[A-Z][" + Me + "]*$");
      po = function(e, t, a, i) {
        if (cr.call(Er, t) && Er[t])
          return !0;
        var o = t.toLowerCase();
        if (o === "onfocusin" || o === "onfocusout")
          return g("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), Er[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var v = f.hasOwnProperty(o) ? f[o] : null;
          if (v != null)
            return g("Invalid event handler property `%s`. Did you mean `%s`?", t, v), Er[t] = !0, !0;
          if (pd.test(t))
            return g("Unknown event handler property `%s`. It will be ignored.", t), Er[t] = !0, !0;
        } else if (pd.test(t))
          return yc.test(t) && g("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), Er[t] = !0, !0;
        if (_v.test(t) || kv.test(t))
          return !0;
        if (o === "innerhtml")
          return g("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), Er[t] = !0, !0;
        if (o === "aria")
          return g("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), Er[t] = !0, !0;
        if (o === "is" && a !== null && a !== void 0 && typeof a != "string")
          return g("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), Er[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return g("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), Er[t] = !0, !0;
        var h = sn(t), S = h !== null && h.type === Un;
        if (rs.hasOwnProperty(o)) {
          var C = rs[o];
          if (C !== t)
            return g("Invalid DOM property `%s`. Did you mean `%s`?", t, C), Er[t] = !0, !0;
        } else if (!S && t !== o)
          return g("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, o), Er[t] = !0, !0;
        return typeof a == "boolean" && mn(t, a, h, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), Er[t] = !0, !0) : S ? !0 : mn(t, a, h, !1) ? (Er[t] = !0, !1) : ((a === "false" || a === "true") && h !== null && h.type === Dn && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), Er[t] = !0), !0);
      };
    }
    var jv = function(e, t, a) {
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
      _l(e, t) || jv(e, t, a);
    }
    var vd = 1, gc = 2, Ua = 4, hd = vd | gc | Ua, vo = null;
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
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Ki ? t.parentNode : t;
    }
    var Sc = null, ho = null, rn = null;
    function Ec(e) {
      var t = Du(e);
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
    function xc(e) {
      Sc = e;
    }
    function fu(e) {
      ho ? rn ? rn.push(e) : rn = [e] : ho = e;
    }
    function Dv() {
      return ho !== null || rn !== null;
    }
    function Cc() {
      if (ho) {
        var e = ho, t = rn;
        if (ho = null, rn = null, Ec(e), t)
          for (var a = 0; a < t.length; a++)
            Ec(t[a]);
      }
    }
    var du = function(e, t) {
      return e(t);
    }, ls = function() {
    }, kl = !1;
    function Ov() {
      var e = Dv();
      e && (ls(), Cc());
    }
    function Lv(e, t, a) {
      if (kl)
        return e(t, a);
      kl = !0;
      try {
        return du(e, t, a);
      } finally {
        kl = !1, Ov();
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
    function jl(e, t) {
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
    if (Nn)
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
        var C = document.createEvent("Event"), L = !1, N = !0, $ = window.event, W = Object.getOwnPropertyDescriptor(window, "event");
        function ee() {
          yd.removeEventListener(te, ot, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = $);
        }
        var He = Array.prototype.slice.call(arguments, 3);
        function ot() {
          L = !0, ee(), a.apply(i, He), N = !1;
        }
        var et, Vt = !1, zt = !1;
        function P(H) {
          if (et = H.error, Vt = !0, et === null && H.colno === 0 && H.lineno === 0 && (zt = !0), H.defaultPrevented && et != null && typeof et == "object")
            try {
              et._suppressLogging = !0;
            } catch {
            }
        }
        var te = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", P), yd.addEventListener(te, ot, !1), C.initEvent(te, !1, !1), yd.dispatchEvent(C), W && Object.defineProperty(window, "event", W), L && N && (Vt ? zt && (et = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : et = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(et)), window.removeEventListener("error", P), !L)
          return ee(), wc.apply(this, arguments);
      };
    }
    var Av = Tc, pu = !1, Rc = null, vu = !1, Ti = null, zv = {
      onError: function(e) {
        pu = !0, Rc = e;
      }
    };
    function Nl(e, t, a, i, o, s, f, v, h) {
      pu = !1, Rc = null, Av.apply(zv, arguments);
    }
    function Ri(e, t, a, i, o, s, f, v, h) {
      if (Nl.apply(this, arguments), pu) {
        var S = ss();
        vu || (vu = !0, Ti = S);
      }
    }
    function us() {
      if (vu) {
        var e = Ti;
        throw vu = !1, Ti = null, e;
      }
    }
    function Xi() {
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
    var at = (
      /*                      */
      0
    ), si = (
      /*                */
      1
    ), Ln = (
      /*                    */
      2
    ), Pt = (
      /*                       */
      4
    ), Fa = (
      /*                */
      16
    ), Pa = (
      /*                 */
      32
    ), Cn = (
      /*                     */
      64
    ), tt = (
      /*                   */
      128
    ), Lr = (
      /*            */
      256
    ), Fn = (
      /*                          */
      512
    ), lr = (
      /*                     */
      1024
    ), ia = (
      /*                      */
      2048
    ), la = (
      /*                    */
      4096
    ), qn = (
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
    ), dr = (
      /*                */
      65536
    ), _c = (
      /* */
      131072
    ), _i = (
      /*                       */
      1048576
    ), yu = (
      /*                    */
      2097152
    ), Ji = (
      /*                 */
      4194304
    ), kc = (
      /*                */
      8388608
    ), Dl = (
      /*               */
      16777216
    ), ki = (
      /*              */
      33554432
    ), Ol = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Pt | lr | 0
    ), Ll = Ln | Pt | Fa | Pa | Fn | la | qn, Ml = Pt | Cn | Fn | qn, Zi = ia | Fa, Xn = Ji | kc | yu, Ha = b.ReactCurrentOwner;
    function Ca(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (Ln | la)) !== at && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === F ? a : null;
    }
    function ji(e) {
      if (e.tag === fe) {
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
    function Ni(e) {
      return e.tag === F ? e.stateNode.containerInfo : null;
    }
    function go(e) {
      return Ca(e) === e;
    }
    function Fv(e) {
      {
        var t = Ha.current;
        if (t !== null && t.tag === B) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", yt(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var o = hu(e);
      return o ? Ca(o) === o : !1;
    }
    function jc(e) {
      if (Ca(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function Nc(e) {
      var t = e.alternate;
      if (!t) {
        var a = Ca(e);
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
              return jc(s), e;
            if (h === o)
              return jc(s), t;
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
      if (i.tag !== F)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function oa(e) {
      var t = Nc(e);
      return t !== null ? ua(t) : null;
    }
    function ua(e) {
      if (e.tag === ne || e.tag === ie)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = ua(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function kn(e) {
      var t = Nc(e);
      return t !== null ? Ba(t) : null;
    }
    function Ba(e) {
      if (e.tag === ne || e.tag === ie)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== I) {
          var a = Ba(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var gd = x.unstable_scheduleCallback, Pv = x.unstable_cancelCallback, Sd = x.unstable_shouldYield, Ed = x.unstable_requestPaint, or = x.unstable_now, Dc = x.unstable_getCurrentPriorityLevel, fs = x.unstable_ImmediatePriority, Al = x.unstable_UserBlockingPriority, el = x.unstable_NormalPriority, my = x.unstable_LowPriority, So = x.unstable_IdlePriority, Oc = x.unstable_yieldValue, Hv = x.unstable_setDisableYieldValue, Eo = null, Vn = null, Pe = null, ba = !1, sa = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function gu(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        pe && (e = kt({}, e, {
          getLaneLabelMap: xo,
          injectProfilingHooks: Va
        })), Eo = t.inject(e), Vn = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function xd(e, t) {
      if (Vn && typeof Vn.onScheduleFiberRoot == "function")
        try {
          Vn.onScheduleFiberRoot(Eo, e, t);
        } catch (a) {
          ba || (ba = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function Cd(e, t) {
      if (Vn && typeof Vn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & tt) === tt;
          if (Ye) {
            var i;
            switch (t) {
              case Hr:
                i = fs;
                break;
              case Oi:
                i = Al;
                break;
              case Ia:
                i = el;
                break;
              case $a:
                i = So;
                break;
              default:
                i = el;
                break;
            }
            Vn.onCommitFiberRoot(Eo, e, i, a);
          }
        } catch (o) {
          ba || (ba = !0, g("React instrumentation encountered an error: %s", o));
        }
    }
    function bd(e) {
      if (Vn && typeof Vn.onPostCommitFiberRoot == "function")
        try {
          Vn.onPostCommitFiberRoot(Eo, e);
        } catch (t) {
          ba || (ba = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function wd(e) {
      if (Vn && typeof Vn.onCommitFiberUnmount == "function")
        try {
          Vn.onCommitFiberUnmount(Eo, e);
        } catch (t) {
          ba || (ba = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Mn(e) {
      if (typeof Oc == "function" && (Hv(e), J(e)), Vn && typeof Vn.setStrictMode == "function")
        try {
          Vn.setStrictMode(Eo, e);
        } catch (t) {
          ba || (ba = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Va(e) {
      Pe = e;
    }
    function xo() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < wo; a++) {
          var i = $v(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function Td(e) {
      Pe !== null && typeof Pe.markCommitStarted == "function" && Pe.markCommitStarted(e);
    }
    function Rd() {
      Pe !== null && typeof Pe.markCommitStopped == "function" && Pe.markCommitStopped();
    }
    function wa(e) {
      Pe !== null && typeof Pe.markComponentRenderStarted == "function" && Pe.markComponentRenderStarted(e);
    }
    function Ta() {
      Pe !== null && typeof Pe.markComponentRenderStopped == "function" && Pe.markComponentRenderStopped();
    }
    function _d(e) {
      Pe !== null && typeof Pe.markComponentPassiveEffectMountStarted == "function" && Pe.markComponentPassiveEffectMountStarted(e);
    }
    function Bv() {
      Pe !== null && typeof Pe.markComponentPassiveEffectMountStopped == "function" && Pe.markComponentPassiveEffectMountStopped();
    }
    function tl(e) {
      Pe !== null && typeof Pe.markComponentPassiveEffectUnmountStarted == "function" && Pe.markComponentPassiveEffectUnmountStarted(e);
    }
    function zl() {
      Pe !== null && typeof Pe.markComponentPassiveEffectUnmountStopped == "function" && Pe.markComponentPassiveEffectUnmountStopped();
    }
    function Lc(e) {
      Pe !== null && typeof Pe.markComponentLayoutEffectMountStarted == "function" && Pe.markComponentLayoutEffectMountStarted(e);
    }
    function Vv() {
      Pe !== null && typeof Pe.markComponentLayoutEffectMountStopped == "function" && Pe.markComponentLayoutEffectMountStopped();
    }
    function ds(e) {
      Pe !== null && typeof Pe.markComponentLayoutEffectUnmountStarted == "function" && Pe.markComponentLayoutEffectUnmountStarted(e);
    }
    function kd() {
      Pe !== null && typeof Pe.markComponentLayoutEffectUnmountStopped == "function" && Pe.markComponentLayoutEffectUnmountStopped();
    }
    function ps(e, t, a) {
      Pe !== null && typeof Pe.markComponentErrored == "function" && Pe.markComponentErrored(e, t, a);
    }
    function Di(e, t, a) {
      Pe !== null && typeof Pe.markComponentSuspended == "function" && Pe.markComponentSuspended(e, t, a);
    }
    function vs(e) {
      Pe !== null && typeof Pe.markLayoutEffectsStarted == "function" && Pe.markLayoutEffectsStarted(e);
    }
    function hs() {
      Pe !== null && typeof Pe.markLayoutEffectsStopped == "function" && Pe.markLayoutEffectsStopped();
    }
    function Co(e) {
      Pe !== null && typeof Pe.markPassiveEffectsStarted == "function" && Pe.markPassiveEffectsStarted(e);
    }
    function jd() {
      Pe !== null && typeof Pe.markPassiveEffectsStopped == "function" && Pe.markPassiveEffectsStopped();
    }
    function bo(e) {
      Pe !== null && typeof Pe.markRenderStarted == "function" && Pe.markRenderStarted(e);
    }
    function Iv() {
      Pe !== null && typeof Pe.markRenderYielded == "function" && Pe.markRenderYielded();
    }
    function Mc() {
      Pe !== null && typeof Pe.markRenderStopped == "function" && Pe.markRenderStopped();
    }
    function An(e) {
      Pe !== null && typeof Pe.markRenderScheduled == "function" && Pe.markRenderScheduled(e);
    }
    function Ac(e, t) {
      Pe !== null && typeof Pe.markForceUpdateScheduled == "function" && Pe.markForceUpdateScheduled(e, t);
    }
    function ms(e, t) {
      Pe !== null && typeof Pe.markStateUpdateScheduled == "function" && Pe.markStateUpdateScheduled(e, t);
    }
    var it = (
      /*                         */
      0
    ), Ot = (
      /*                 */
      1
    ), Kt = (
      /*                    */
      2
    ), pn = (
      /*               */
      8
    ), qt = (
      /*              */
      16
    ), Jn = Math.clz32 ? Math.clz32 : ys, pr = Math.log, zc = Math.LN2;
    function ys(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (pr(t) / zc | 0) | 0;
    }
    var wo = 31, he = (
      /*                        */
      0
    ), Wt = (
      /*                          */
      0
    ), ft = (
      /*                        */
      1
    ), Ul = (
      /*    */
      2
    ), ci = (
      /*             */
      4
    ), Mr = (
      /*            */
      8
    ), In = (
      /*                     */
      16
    ), nl = (
      /*                */
      32
    ), Fl = (
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
    ), Bc = (
      /*                        */
      2048
    ), Vc = (
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
    ), Nd = _o, xs = (
      /*          */
      134217728
    ), Dd = (
      /*                          */
      268435455
    ), Cs = (
      /*               */
      268435456
    ), ko = (
      /*                        */
      536870912
    ), ca = (
      /*                   */
      1073741824
    );
    function $v(e) {
      {
        if (e & ft)
          return "Sync";
        if (e & Ul)
          return "InputContinuousHydration";
        if (e & ci)
          return "InputContinuous";
        if (e & Mr)
          return "DefaultHydration";
        if (e & In)
          return "Default";
        if (e & nl)
          return "TransitionHydration";
        if (e & Fl)
          return "Transition";
        if (e & Ss)
          return "Retry";
        if (e & xs)
          return "SelectiveHydration";
        if (e & Cs)
          return "IdleHydration";
        if (e & ko)
          return "Idle";
        if (e & ca)
          return "Offscreen";
      }
    }
    var yn = -1, jo = To, Xc = _o;
    function bs(e) {
      switch (Pl(e)) {
        case ft:
          return ft;
        case Ul:
          return Ul;
        case ci:
          return ci;
        case Mr:
          return Mr;
        case In:
          return In;
        case nl:
          return nl;
        case To:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Bc:
        case Vc:
        case Ic:
        case $c:
        case Ro:
        case Yc:
        case Su:
        case Eu:
        case Qc:
        case gs:
        case Wc:
          return e & Fl;
        case _o:
        case Gc:
        case Es:
        case Kc:
        case qc:
          return e & Ss;
        case xs:
          return xs;
        case Cs:
          return Cs;
        case ko:
          return ko;
        case ca:
          return ca;
        default:
          return g("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Jc(e, t) {
      var a = e.pendingLanes;
      if (a === he)
        return he;
      var i = he, o = e.suspendedLanes, s = e.pingedLanes, f = a & Dd;
      if (f !== he) {
        var v = f & ~o;
        if (v !== he)
          i = bs(v);
        else {
          var h = f & s;
          h !== he && (i = bs(h));
        }
      } else {
        var S = a & ~o;
        S !== he ? i = bs(S) : s !== he && (i = bs(s));
      }
      if (i === he)
        return he;
      if (t !== he && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & o) === he) {
        var C = Pl(i), L = Pl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          C >= L || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          C === In && (L & Fl) !== he
        )
          return t;
      }
      (i & ci) !== he && (i |= a & In);
      var N = e.entangledLanes;
      if (N !== he)
        for (var $ = e.entanglements, W = i & N; W > 0; ) {
          var ee = Zn(W), He = 1 << ee;
          i |= $[ee], W &= ~He;
        }
      return i;
    }
    function fi(e, t) {
      for (var a = e.eventTimes, i = yn; t > 0; ) {
        var o = Zn(t), s = 1 << o, f = a[o];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Od(e, t) {
      switch (e) {
        case ft:
        case Ul:
        case ci:
          return t + 250;
        case Mr:
        case In:
        case nl:
        case To:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Bc:
        case Vc:
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
          return yn;
        case xs:
        case Cs:
        case ko:
        case ca:
          return yn;
        default:
          return g("Should have found matching lanes. This is a bug in React."), yn;
      }
    }
    function Zc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, o = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var v = Zn(f), h = 1 << v, S = s[v];
        S === yn ? ((h & i) === he || (h & o) !== he) && (s[v] = Od(h, t)) : S <= t && (e.expiredLanes |= h), f &= ~h;
      }
    }
    function Yv(e) {
      return bs(e.pendingLanes);
    }
    function ef(e) {
      var t = e.pendingLanes & ~ca;
      return t !== he ? t : t & ca ? ca : he;
    }
    function Qv(e) {
      return (e & ft) !== he;
    }
    function ws(e) {
      return (e & Dd) !== he;
    }
    function No(e) {
      return (e & Ss) === e;
    }
    function Ld(e) {
      var t = ft | ci | In;
      return (e & t) === he;
    }
    function Md(e) {
      return (e & Fl) === e;
    }
    function tf(e, t) {
      var a = Ul | ci | Mr | In;
      return (t & a) !== he;
    }
    function Wv(e, t) {
      return (t & e.expiredLanes) !== he;
    }
    function Ad(e) {
      return (e & Fl) !== he;
    }
    function zd() {
      var e = jo;
      return jo <<= 1, (jo & Fl) === he && (jo = To), e;
    }
    function Gv() {
      var e = Xc;
      return Xc <<= 1, (Xc & Ss) === he && (Xc = _o), e;
    }
    function Pl(e) {
      return e & -e;
    }
    function Ts(e) {
      return Pl(e);
    }
    function Zn(e) {
      return 31 - Jn(e);
    }
    function xr(e) {
      return Zn(e);
    }
    function fa(e, t) {
      return (e & t) !== he;
    }
    function Do(e, t) {
      return (e & t) === t;
    }
    function _t(e, t) {
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
      return e !== Wt && e < t ? e : t;
    }
    function _s(e) {
      for (var t = [], a = 0; a < wo; a++)
        t.push(e);
      return t;
    }
    function xu(e, t, a) {
      e.pendingLanes |= t, t !== ko && (e.suspendedLanes = he, e.pingedLanes = he);
      var i = e.eventTimes, o = xr(t);
      i[o] = a;
    }
    function Xv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var o = Zn(i), s = 1 << o;
        a[o] = yn, i &= ~s;
      }
    }
    function nf(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Fd(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = he, e.pingedLanes = he, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, o = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var v = Zn(f), h = 1 << v;
        i[v] = he, o[v] = yn, s[v] = yn, f &= ~h;
      }
    }
    function rf(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, o = a; o; ) {
        var s = Zn(o), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), o &= ~f;
      }
    }
    function Pd(e, t) {
      var a = Pl(t), i;
      switch (a) {
        case ci:
          i = Ul;
          break;
        case In:
          i = Mr;
          break;
        case To:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Bc:
        case Vc:
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
          i = nl;
          break;
        case ko:
          i = Cs;
          break;
        default:
          i = Wt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Wt ? Wt : i;
    }
    function ks(e, t, a) {
      if (sa)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var o = xr(a), s = 1 << o, f = i[o];
          f.add(t), a &= ~s;
        }
    }
    function Jv(e, t) {
      if (sa)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var o = xr(t), s = 1 << o, f = a[o];
          f.size > 0 && (f.forEach(function(v) {
            var h = v.alternate;
            (h === null || !i.has(h)) && i.add(v);
          }), f.clear()), t &= ~s;
        }
    }
    function Hd(e, t) {
      return null;
    }
    var Hr = ft, Oi = ci, Ia = In, $a = ko, js = Wt;
    function Ya() {
      return js;
    }
    function er(e) {
      js = e;
    }
    function Zv(e, t) {
      var a = js;
      try {
        return js = e, t();
      } finally {
        js = a;
      }
    }
    function eh(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Ns(e, t) {
      return e > t ? e : t;
    }
    function vr(e, t) {
      return e !== 0 && e < t;
    }
    function th(e) {
      var t = Pl(e);
      return vr(Hr, t) ? vr(Oi, t) ? ws(t) ? Ia : $a : Oi : Hr;
    }
    function af(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Ds;
    function Ar(e) {
      Ds = e;
    }
    function yy(e) {
      Ds(e);
    }
    var We;
    function Cu(e) {
      We = e;
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
    function Bd(e) {
      Ls = e;
    }
    var of = !1, Ms = [], rl = null, Li = null, Mi = null, $n = /* @__PURE__ */ new Map(), Br = /* @__PURE__ */ new Map(), Vr = [], ah = [
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
    function di(e, t, a, i, o) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: o,
        targetContainers: [i]
      };
    }
    function Vd(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          rl = null;
          break;
        case "dragenter":
        case "dragleave":
          Li = null;
          break;
        case "mouseover":
        case "mouseout":
          Mi = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          $n.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Br.delete(i);
          break;
        }
      }
    }
    function da(e, t, a, i, o, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = di(t, a, i, o, s);
        if (t !== null) {
          var v = Du(t);
          v !== null && We(v);
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
          return rl = da(rl, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = o;
          return Li = da(Li, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var v = o;
          return Mi = da(Mi, e, t, a, i, v), !0;
        }
        case "pointerover": {
          var h = o, S = h.pointerId;
          return $n.set(S, da($n.get(S) || null, e, t, a, i, h)), !0;
        }
        case "gotpointercapture": {
          var C = o, L = C.pointerId;
          return Br.set(L, da(Br.get(L) || null, e, t, a, i, C)), !0;
        }
      }
      return !1;
    }
    function Id(e) {
      var t = Qs(e.target);
      if (t !== null) {
        var a = Ca(t);
        if (a !== null) {
          var i = a.tag;
          if (i === fe) {
            var o = ji(a);
            if (o !== null) {
              e.blockedOn = o, Ls(e.priority, function() {
                lf(a);
              });
              return;
            }
          } else if (i === F) {
            var s = a.stateNode;
            if (af(s)) {
              e.blockedOn = Ni(a);
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
      }, i = 0; i < Vr.length && vr(t, Vr[i].priority); i++)
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
          var f = Du(i);
          return f !== null && We(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function $d(e, t, a) {
      As(e) && a.delete(t);
    }
    function Sy() {
      of = !1, rl !== null && As(rl) && (rl = null), Li !== null && As(Li) && (Li = null), Mi !== null && As(Mi) && (Mi = null), $n.forEach($d), Br.forEach($d);
    }
    function Hl(e, t) {
      e.blockedOn === t && (e.blockedOn = null, of || (of = !0, x.unstable_scheduleCallback(x.unstable_NormalPriority, Sy)));
    }
    function Oo(e) {
      if (Ms.length > 0) {
        Hl(Ms[0], e);
        for (var t = 1; t < Ms.length; t++) {
          var a = Ms[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      rl !== null && Hl(rl, e), Li !== null && Hl(Li, e), Mi !== null && Hl(Mi, e);
      var i = function(v) {
        return Hl(v, e);
      };
      $n.forEach(i), Br.forEach(i);
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
    var Cr = b.ReactCurrentBatchConfig, Ht = !0;
    function ur(e) {
      Ht = !!e;
    }
    function tr() {
      return Ht;
    }
    function br(e, t, a) {
      var i = uf(t), o;
      switch (i) {
        case Hr:
          o = Ra;
          break;
        case Oi:
          o = bu;
          break;
        case Ia:
        default:
          o = Yn;
          break;
      }
      return o.bind(null, t, a, e);
    }
    function Ra(e, t, a, i) {
      var o = Ya(), s = Cr.transition;
      Cr.transition = null;
      try {
        er(Hr), Yn(e, t, a, i);
      } finally {
        er(o), Cr.transition = s;
      }
    }
    function bu(e, t, a, i) {
      var o = Ya(), s = Cr.transition;
      Cr.transition = null;
      try {
        er(Oi), Yn(e, t, a, i);
      } finally {
        er(o), Cr.transition = s;
      }
    }
    function Yn(e, t, a, i) {
      Ht && zs(e, t, a, i);
    }
    function zs(e, t, a, i) {
      var o = wu(e, t, a, i);
      if (o === null) {
        zy(e, t, i, Ai, a), Vd(e, i);
        return;
      }
      if (gy(o, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Vd(e, i), t & Ua && ih(e)) {
        for (; o !== null; ) {
          var s = Du(o);
          s !== null && yy(s);
          var f = wu(e, t, a, i);
          if (f === null && zy(e, t, i, Ai, a), f === o)
            break;
          o = f;
        }
        o !== null && i.stopPropagation();
        return;
      }
      zy(e, t, i, null, a);
    }
    var Ai = null;
    function wu(e, t, a, i) {
      Ai = null;
      var o = md(i), s = Qs(o);
      if (s !== null) {
        var f = Ca(s);
        if (f === null)
          s = null;
        else {
          var v = f.tag;
          if (v === fe) {
            var h = ji(f);
            if (h !== null)
              return h;
            s = null;
          } else if (v === F) {
            var S = f.stateNode;
            if (af(S))
              return Ni(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return Ai = s, null;
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
          return Hr;
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
          return Oi;
        case "message": {
          var t = Dc();
          switch (t) {
            case fs:
              return Hr;
            case Al:
              return Oi;
            case el:
            case my:
              return Ia;
            case So:
              return $a;
            default:
              return Ia;
          }
        }
        default:
          return Ia;
      }
    }
    function Us(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function pa(e, t, a) {
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
    var _a = null, Ru = null, Lo = null;
    function Bl(e) {
      return _a = e, Ru = Fs(), !0;
    }
    function sf() {
      _a = null, Ru = null, Lo = null;
    }
    function al() {
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
      return "value" in _a ? _a.value : _a.textContent;
    }
    function Vl(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function _u() {
      return !0;
    }
    function Ps() {
      return !1;
    }
    function zr(e) {
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
    var nr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, zi = zr(nr), Ir = kt({}, nr, {
      view: 0,
      detail: 0
    }), va = zr(Ir), cf, Hs, Mo;
    function Ey(e) {
      e !== Mo && (Mo && e.type === "mousemove" ? (cf = e.screenX - Mo.screenX, Hs = e.screenY - Mo.screenY) : (cf = 0, Hs = 0), Mo = e);
    }
    var pi = kt({}, Ir, {
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
      getModifierState: jn,
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
    }), Qd = zr(pi), Wd = kt({}, pi, {
      dataTransfer: 0
    }), Ao = zr(Wd), Gd = kt({}, Ir, {
      relatedTarget: 0
    }), il = zr(Gd), oh = kt({}, nr, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), uh = zr(oh), Kd = kt({}, nr, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), ff = zr(Kd), xy = kt({}, nr, {
      data: 0
    }), sh = zr(xy), ch = sh, fh = {
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
        var t = fh[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Vl(e);
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
    function jn(e) {
      return dh;
    }
    var by = kt({}, Ir, {
      key: Cy,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: jn,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Vl(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Vl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), ph = zr(by), wy = kt({}, pi, {
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
    }), vh = zr(wy), hh = kt({}, Ir, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: jn
    }), mh = zr(hh), Ty = kt({}, nr, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Qa = zr(Ty), qd = kt({}, pi, {
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
    }), Ry = zr(qd), Il = [9, 13, 27, 32], Bs = 229, ll = Nn && "CompositionEvent" in window, $l = null;
    Nn && "documentMode" in document && ($l = document.documentMode);
    var Xd = Nn && "TextEvent" in window && !$l, df = Nn && (!ll || $l && $l > 8 && $l <= 11), yh = 32, pf = String.fromCharCode(yh);
    function _y() {
      wt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), wt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), wt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), wt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
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
      return e === "keydown" && t.keyCode === Bs;
    }
    function Zd(e, t) {
      switch (e) {
        case "keyup":
          return Il.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Bs;
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
      if (ll ? s = vf(t) : Uo ? Zd(t, i) && (s = "onCompositionEnd") : hf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      df && !Sh(i) && (!Uo && s === "onCompositionStart" ? Uo = Bl(o) : s === "onCompositionEnd" && Uo && (f = al()));
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
        if (e === "compositionend" || !ll && Zd(e, t)) {
          var a = al();
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
    function Vs(e) {
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
    function jy(e) {
      if (!Nn)
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
    function xh(e, t, a, i) {
      fu(i);
      var o = Rh(t, "onChange");
      if (o.length > 0) {
        var s = new zi("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: o
        });
      }
    }
    var Yl = null, n = null;
    function r(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function l(e) {
      var t = [];
      xh(t, n, e, md(e)), Lv(u, t);
    }
    function u(e) {
      BE(e, 0);
    }
    function c(e) {
      var t = wf(e);
      if (bi(t))
        return e;
    }
    function p(e, t) {
      if (e === "change")
        return t;
    }
    var y = !1;
    Nn && (y = jy("input") && (!document.documentMode || document.documentMode > 9));
    function w(e, t) {
      Yl = e, n = t, Yl.attachEvent("onpropertychange", Q);
    }
    function k() {
      Yl && (Yl.detachEvent("onpropertychange", Q), Yl = null, n = null);
    }
    function Q(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function Ee(e, t, a) {
      e === "focusin" ? (k(), w(t, a)) : e === "focusout" && k();
    }
    function _e(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function ye(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Ie(e, t) {
      if (e === "click")
        return c(t);
    }
    function Ke(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function Ze(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || lt(e, "number", e.value);
    }
    function Qn(e, t, a, i, o, s, f) {
      var v = a ? wf(a) : window, h, S;
      if (r(v) ? h = p : Vs(v) ? y ? h = Ke : (h = _e, S = Ee) : ye(v) && (h = Ie), h) {
        var C = h(t, a);
        if (C) {
          xh(e, C, i, o);
          return;
        }
      }
      S && S(t, v, a), t === "focusout" && Ze(v);
    }
    function U() {
      en("onMouseEnter", ["mouseout", "mouseover"]), en("onMouseLeave", ["mouseout", "mouseover"]), en("onPointerEnter", ["pointerout", "pointerover"]), en("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function O(e, t, a, i, o, s, f) {
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
          var L = o.ownerDocument;
          L ? C = L.defaultView || L.parentWindow : C = window;
        }
        var N, $;
        if (h) {
          var W = i.relatedTarget || i.toElement;
          if (N = a, $ = W ? Qs(W) : null, $ !== null) {
            var ee = Ca($);
            ($ !== ee || $.tag !== ne && $.tag !== ie) && ($ = null);
          }
        } else
          N = null, $ = a;
        if (N !== $) {
          var He = Qd, ot = "onMouseLeave", et = "onMouseEnter", Vt = "mouse";
          (t === "pointerout" || t === "pointerover") && (He = vh, ot = "onPointerLeave", et = "onPointerEnter", Vt = "pointer");
          var zt = N == null ? C : wf(N), P = $ == null ? C : wf($), te = new He(ot, Vt + "leave", N, i, o);
          te.target = zt, te.relatedTarget = P;
          var H = null, ke = Qs(o);
          if (ke === a) {
            var Qe = new He(et, Vt + "enter", $, i, o);
            Qe.target = P, Qe.relatedTarget = zt, H = Qe;
          }
          t0(e, te, H, N, $);
        }
      }
    }
    function V(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var xe = typeof Object.is == "function" ? Object.is : V;
    function qe(e, t) {
      if (xe(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var o = 0; o < a.length; o++) {
        var s = a[o];
        if (!cr.call(t, s) || !xe(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function ut(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function ct(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function mt(e, t) {
      for (var a = ut(e), i = 0, o = 0; a; ) {
        if (a.nodeType === Ki) {
          if (o = i + a.textContent.length, i <= t && o >= t)
            return {
              node: a,
              offset: t - i
            };
          i = o;
        }
        a = ut(ct(a));
      }
    }
    function hr(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var o = i.anchorNode, s = i.anchorOffset, f = i.focusNode, v = i.focusOffset;
      try {
        o.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return Xt(e, o, s, f, v);
    }
    function Xt(e, t, a, i, o) {
      var s = 0, f = -1, v = -1, h = 0, S = 0, C = e, L = null;
      e: for (; ; ) {
        for (var N = null; C === t && (a === 0 || C.nodeType === Ki) && (f = s + a), C === i && (o === 0 || C.nodeType === Ki) && (v = s + o), C.nodeType === Ki && (s += C.nodeValue.length), (N = C.firstChild) !== null; )
          L = C, C = N;
        for (; ; ) {
          if (C === e)
            break e;
          if (L === t && ++h === a && (f = s), L === i && ++S === o && (v = s), (N = C.nextSibling) !== null)
            break;
          C = L, L = C.parentNode;
        }
        C = N;
      }
      return f === -1 || v === -1 ? null : {
        start: f,
        end: v
      };
    }
    function Ql(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var o = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), v = t.end === void 0 ? f : Math.min(t.end, s);
        if (!o.extend && f > v) {
          var h = v;
          v = f, f = h;
        }
        var S = mt(e, f), C = mt(e, v);
        if (S && C) {
          if (o.rangeCount === 1 && o.anchorNode === S.node && o.anchorOffset === S.offset && o.focusNode === C.node && o.focusOffset === C.offset)
            return;
          var L = a.createRange();
          L.setStart(S.node, S.offset), o.removeAllRanges(), f > v ? (o.addRange(L), o.extend(C.node, C.offset)) : (L.setEnd(C.node, C.offset), o.addRange(L));
        }
      }
    }
    function Ch(e) {
      return e && e.nodeType === Ki;
    }
    function NE(e, t) {
      return !e || !t ? !1 : e === t ? !0 : Ch(e) ? !1 : Ch(t) ? NE(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function Uw(e) {
      return e && e.ownerDocument && NE(e.ownerDocument.documentElement, e);
    }
    function Fw(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function DE() {
      for (var e = window, t = za(); t instanceof e.HTMLIFrameElement; ) {
        if (Fw(t))
          e = t.contentWindow;
        else
          return t;
        t = za(e.document);
      }
      return t;
    }
    function Ny(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function Pw() {
      var e = DE();
      return {
        focusedElem: e,
        selectionRange: Ny(e) ? Bw(e) : null
      };
    }
    function Hw(e) {
      var t = DE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && Uw(a)) {
        i !== null && Ny(a) && Vw(a, i);
        for (var o = [], s = a; s = s.parentNode; )
          s.nodeType === aa && o.push({
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
    function Bw(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = hr(e), t || {
        start: 0,
        end: 0
      };
    }
    function Vw(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Ql(e, t);
    }
    var Iw = Nn && "documentMode" in document && document.documentMode <= 11;
    function $w() {
      wt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var Sf = null, Dy = null, np = null, Oy = !1;
    function Yw(e) {
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
    function Qw(e) {
      return e.window === e ? e.document : e.nodeType === qi ? e : e.ownerDocument;
    }
    function OE(e, t, a) {
      var i = Qw(a);
      if (!(Oy || Sf == null || Sf !== za(i))) {
        var o = Yw(Sf);
        if (!np || !qe(np, o)) {
          np = o;
          var s = Rh(Dy, "onSelect");
          if (s.length > 0) {
            var f = new zi("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = Sf;
          }
        }
      }
    }
    function Ww(e, t, a, i, o, s, f) {
      var v = a ? wf(a) : window;
      switch (t) {
        case "focusin":
          (Vs(v) || v.contentEditable === "true") && (Sf = v, Dy = a, np = null);
          break;
        case "focusout":
          Sf = null, Dy = null, np = null;
          break;
        case "mousedown":
          Oy = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Oy = !1, OE(e, i, o);
          break;
        case "selectionchange":
          if (Iw)
            break;
        case "keydown":
        case "keyup":
          OE(e, i, o);
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
    }, Ly = {}, LE = {};
    Nn && (LE = document.createElement("div").style, "AnimationEvent" in window || (delete Ef.animationend.animation, delete Ef.animationiteration.animation, delete Ef.animationstart.animation), "TransitionEvent" in window || delete Ef.transitionend.transition);
    function wh(e) {
      if (Ly[e])
        return Ly[e];
      if (!Ef[e])
        return e;
      var t = Ef[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in LE)
          return Ly[e] = t[a];
      return e;
    }
    var ME = wh("animationend"), AE = wh("animationiteration"), zE = wh("animationstart"), UE = wh("transitionend"), FE = /* @__PURE__ */ new Map(), PE = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function ju(e, t) {
      FE.set(e, t), wt(t, [e]);
    }
    function Gw() {
      for (var e = 0; e < PE.length; e++) {
        var t = PE[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        ju(a, "on" + i);
      }
      ju(ME, "onAnimationEnd"), ju(AE, "onAnimationIteration"), ju(zE, "onAnimationStart"), ju("dblclick", "onDoubleClick"), ju("focusin", "onFocus"), ju("focusout", "onBlur"), ju(UE, "onTransitionEnd");
    }
    function Kw(e, t, a, i, o, s, f) {
      var v = FE.get(t);
      if (v !== void 0) {
        var h = zi, S = t;
        switch (t) {
          case "keypress":
            if (Vl(i) === 0)
              return;
          case "keydown":
          case "keyup":
            h = ph;
            break;
          case "focusin":
            S = "focus", h = il;
            break;
          case "focusout":
            S = "blur", h = il;
            break;
          case "beforeblur":
          case "afterblur":
            h = il;
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
          case ME:
          case AE:
          case zE:
            h = uh;
            break;
          case UE:
            h = Qa;
            break;
          case "scroll":
            h = va;
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
        var C = (s & Ua) !== 0;
        {
          var L = !C && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", N = Zw(a, v, i.type, C, L);
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
    Gw(), U(), Is(), $w(), _y();
    function qw(e, t, a, i, o, s, f) {
      Kw(e, t, a, i, o, s);
      var v = (s & hd) === 0;
      v && (O(e, t, a, i, o), Qn(e, t, a, i, o), Ww(e, t, a, i, o), Eh(e, t, a, i, o));
    }
    var rp = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], My = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(rp));
    function HE(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ri(i, t, void 0, e), e.currentTarget = null;
    }
    function Xw(e, t, a) {
      var i;
      if (a)
        for (var o = t.length - 1; o >= 0; o--) {
          var s = t[o], f = s.instance, v = s.currentTarget, h = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          HE(e, h, v), i = f;
        }
      else
        for (var S = 0; S < t.length; S++) {
          var C = t[S], L = C.instance, N = C.currentTarget, $ = C.listener;
          if (L !== i && e.isPropagationStopped())
            return;
          HE(e, $, N), i = L;
        }
    }
    function BE(e, t) {
      for (var a = (t & Ua) !== 0, i = 0; i < e.length; i++) {
        var o = e[i], s = o.event, f = o.listeners;
        Xw(s, f, a);
      }
      us();
    }
    function Jw(e, t, a, i, o) {
      var s = md(a), f = [];
      qw(f, e, i, a, s, t), BE(f, t);
    }
    function zn(e, t) {
      My.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = kT(t), o = n0(e);
      i.has(o) || (VE(t, e, gc, a), i.add(o));
    }
    function Ay(e, t, a) {
      My.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Ua), VE(a, e, i, t);
    }
    var Th = "_reactListening" + Math.random().toString(36).slice(2);
    function ap(e) {
      if (!e[Th]) {
        e[Th] = !0, gt.forEach(function(a) {
          a !== "selectionchange" && (My.has(a) || Ay(a, !1, e), Ay(a, !0, e));
        });
        var t = e.nodeType === qi ? e : e.ownerDocument;
        t !== null && (t[Th] || (t[Th] = !0, Ay("selectionchange", !1, t)));
      }
    }
    function VE(e, t, a, i, o) {
      var s = br(e, t, a), f = void 0;
      os && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Yd(e, t, s, f) : pa(e, t, s) : f !== void 0 ? Tu(e, t, s, f) : Us(e, t, s);
    }
    function IE(e, t) {
      return e === t || e.nodeType === Kn && e.parentNode === t;
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
            if (h === F || h === I) {
              var S = v.stateNode.containerInfo;
              if (IE(S, f))
                break;
              if (h === I)
                for (var C = v.return; C !== null; ) {
                  var L = C.tag;
                  if (L === F || L === I) {
                    var N = C.stateNode.containerInfo;
                    if (IE(N, f))
                      return;
                  }
                  C = C.return;
                }
              for (; S !== null; ) {
                var $ = Qs(S);
                if ($ === null)
                  return;
                var W = $.tag;
                if (W === ne || W === ie) {
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
        return Jw(e, t, a, s);
      });
    }
    function ip(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function Zw(e, t, a, i, o, s) {
      for (var f = t !== null ? t + "Capture" : null, v = i ? f : t, h = [], S = e, C = null; S !== null; ) {
        var L = S, N = L.stateNode, $ = L.tag;
        if ($ === ne && N !== null && (C = N, v !== null)) {
          var W = jl(S, v);
          W != null && h.push(ip(S, W, C));
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
        if (v === ne && f !== null) {
          var h = f, S = jl(o, a);
          S != null && i.unshift(ip(o, S, h));
          var C = jl(o, t);
          C != null && i.push(ip(o, C, h));
        }
        o = o.return;
      }
      return i;
    }
    function xf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== ne);
      return e || null;
    }
    function e0(e, t) {
      for (var a = e, i = t, o = 0, s = a; s; s = xf(s))
        o++;
      for (var f = 0, v = i; v; v = xf(v))
        f++;
      for (; o - f > 0; )
        a = xf(a), o--;
      for (; f - o > 0; )
        i = xf(i), f--;
      for (var h = o; h--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = xf(a), i = xf(i);
      }
      return null;
    }
    function $E(e, t, a, i, o) {
      for (var s = t._reactName, f = [], v = a; v !== null && v !== i; ) {
        var h = v, S = h.alternate, C = h.stateNode, L = h.tag;
        if (S !== null && S === i)
          break;
        if (L === ne && C !== null) {
          var N = C;
          if (o) {
            var $ = jl(v, s);
            $ != null && f.unshift(ip(v, $, N));
          } else if (!o) {
            var W = jl(v, s);
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
    function t0(e, t, a, i, o) {
      var s = i && o ? e0(i, o) : null;
      i !== null && $E(e, t, i, s, !1), o !== null && a !== null && $E(e, a, o, s, !0);
    }
    function n0(e, t) {
      return e + "__bubble";
    }
    var Wa = !1, lp = "dangerouslySetInnerHTML", _h = "suppressContentEditableWarning", Nu = "suppressHydrationWarning", YE = "autoFocus", $s = "children", Ys = "style", kh = "__html", Uy, jh, op, QE, Nh, WE, GE;
    Uy = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, jh = function(e, t) {
      fd(e, t), mc(e, t), Nv(e, t, {
        registrationNameDependencies: pt,
        possibleRegistrationNames: xt
      });
    }, WE = Nn && !document.documentMode, op = function(e, t, a) {
      if (!Wa) {
        var i = Dh(a), o = Dh(t);
        o !== i && (Wa = !0, g("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(o), JSON.stringify(i)));
      }
    }, QE = function(e) {
      if (!Wa) {
        Wa = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), g("Extra attributes from the server: %s", t);
      }
    }, Nh = function(e, t) {
      t === !1 ? g("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : g("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, GE = function(e, t) {
      var a = e.namespaceURI === Gi ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var r0 = /\r\n?/g, a0 = /\u0000|\uFFFD/g;
    function Dh(e) {
      Hn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(r0, `
`).replace(a0, "");
    }
    function Oh(e, t, a, i) {
      var o = Dh(t), s = Dh(e);
      if (s !== o && (i && (Wa || (Wa = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, o))), a && De))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function KE(e) {
      return e.nodeType === qi ? e : e.ownerDocument;
    }
    function i0() {
    }
    function Lh(e) {
      e.onclick = i0;
    }
    function l0(e, t, a, i, o) {
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
          else s === _h || s === Nu || s === YE || (pt.hasOwnProperty(s) ? f != null && (typeof f != "function" && Nh(s, f), s === "onScroll" && zn("scroll", t)) : f != null && Se(t, s, f, o));
        }
    }
    function o0(e, t, a, i) {
      for (var o = 0; o < t.length; o += 2) {
        var s = t[o], f = t[o + 1];
        s === Ys ? wv(e, f) : s === lp ? dv(e, f) : s === $s ? ou(e, f) : Se(e, s, f, i);
      }
    }
    function u0(e, t, a, i) {
      var o, s = KE(a), f, v = i;
      if (v === Gi && (v = ad(e)), v === Gi) {
        if (o = _l(e, t), !o && e !== e.toLowerCase() && g("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
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
      return v === Gi && !o && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !cr.call(Uy, e) && (Uy[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function s0(e, t) {
      return KE(t).createTextNode(e);
    }
    function c0(e, t, a, i) {
      var o = _l(t, a);
      jh(t, a);
      var s;
      switch (t) {
        case "dialog":
          zn("cancel", e), zn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          zn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < rp.length; f++)
            zn(rp[f], e);
          s = a;
          break;
        case "source":
          zn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          zn("error", e), zn("load", e), s = a;
          break;
        case "details":
          zn("toggle", e), s = a;
          break;
        case "input":
          oi(e, a), s = lu(e, a), zn("invalid", e);
          break;
        case "option":
          $t(e, a), s = a;
          break;
        case "select":
          co(e, a), s = Ju(e, a), zn("invalid", e);
          break;
        case "textarea":
          td(e, a), s = ed(e, a), zn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (vc(t, s), l0(t, e, i, s, o), t) {
        case "input":
          li(e), Y(e, a, !1);
          break;
        case "textarea":
          li(e), cv(e);
          break;
        case "option":
          xn(e, a);
          break;
        case "select":
          Jf(e, a);
          break;
        default:
          typeof s.onClick == "function" && Lh(e);
          break;
      }
    }
    function f0(e, t, a, i, o) {
      jh(t, i);
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
      var h, S, C = null;
      for (h in f)
        if (!(v.hasOwnProperty(h) || !f.hasOwnProperty(h) || f[h] == null))
          if (h === Ys) {
            var L = f[h];
            for (S in L)
              L.hasOwnProperty(S) && (C || (C = {}), C[S] = "");
          } else h === lp || h === $s || h === _h || h === Nu || h === YE || (pt.hasOwnProperty(h) ? s || (s = []) : (s = s || []).push(h, null));
      for (h in v) {
        var N = v[h], $ = f != null ? f[h] : void 0;
        if (!(!v.hasOwnProperty(h) || N === $ || N == null && $ == null))
          if (h === Ys)
            if (N && Object.freeze(N), $) {
              for (S in $)
                $.hasOwnProperty(S) && (!N || !N.hasOwnProperty(S)) && (C || (C = {}), C[S] = "");
              for (S in N)
                N.hasOwnProperty(S) && $[S] !== N[S] && (C || (C = {}), C[S] = N[S]);
            } else
              C || (s || (s = []), s.push(h, C)), C = N;
          else if (h === lp) {
            var W = N ? N[kh] : void 0, ee = $ ? $[kh] : void 0;
            W != null && ee !== W && (s = s || []).push(h, W);
          } else h === $s ? (typeof N == "string" || typeof N == "number") && (s = s || []).push(h, "" + N) : h === _h || h === Nu || (pt.hasOwnProperty(h) ? (N != null && (typeof N != "function" && Nh(h, N), h === "onScroll" && zn("scroll", e)), !s && $ !== N && (s = [])) : (s = s || []).push(h, N));
      }
      return C && (cy(C, v[Ys]), (s = s || []).push(Ys, C)), s;
    }
    function d0(e, t, a, i, o) {
      a === "input" && o.type === "radio" && o.name != null && m(e, o);
      var s = _l(a, i), f = _l(a, o);
      switch (o0(e, t, s, f), a) {
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
    function p0(e) {
      {
        var t = e.toLowerCase();
        return rs.hasOwnProperty(t) && rs[t] || null;
      }
    }
    function v0(e, t, a, i, o, s, f) {
      var v, h;
      switch (v = _l(t, a), jh(t, a), t) {
        case "dialog":
          zn("cancel", e), zn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          zn("load", e);
          break;
        case "video":
        case "audio":
          for (var S = 0; S < rp.length; S++)
            zn(rp[S], e);
          break;
        case "source":
          zn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          zn("error", e), zn("load", e);
          break;
        case "details":
          zn("toggle", e);
          break;
        case "input":
          oi(e, a), zn("invalid", e);
          break;
        case "option":
          $t(e, a);
          break;
        case "select":
          co(e, a), zn("invalid", e);
          break;
        case "textarea":
          td(e, a), zn("invalid", e);
          break;
      }
      vc(t, a);
      {
        h = /* @__PURE__ */ new Set();
        for (var C = e.attributes, L = 0; L < C.length; L++) {
          var N = C[L].name.toLowerCase();
          switch (N) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              h.add(C[L].name);
          }
        }
      }
      var $ = null;
      for (var W in a)
        if (a.hasOwnProperty(W)) {
          var ee = a[W];
          if (W === $s)
            typeof ee == "string" ? e.textContent !== ee && (a[Nu] !== !0 && Oh(e.textContent, ee, s, f), $ = [$s, ee]) : typeof ee == "number" && e.textContent !== "" + ee && (a[Nu] !== !0 && Oh(e.textContent, ee, s, f), $ = [$s, "" + ee]);
          else if (pt.hasOwnProperty(W))
            ee != null && (typeof ee != "function" && Nh(W, ee), W === "onScroll" && zn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof v == "boolean") {
            var He = void 0, ot = sn(W);
            if (a[Nu] !== !0) {
              if (!(W === _h || W === Nu || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              W === "value" || W === "checked" || W === "selected")) {
                if (W === lp) {
                  var et = e.innerHTML, Vt = ee ? ee[kh] : void 0;
                  if (Vt != null) {
                    var zt = GE(e, Vt);
                    zt !== et && op(W, et, zt);
                  }
                } else if (W === Ys) {
                  if (h.delete(W), WE) {
                    var P = uy(ee);
                    He = e.getAttribute("style"), P !== He && op(W, He, P);
                  }
                } else if (v && !M)
                  h.delete(W.toLowerCase()), He = Si(e, W, ee), ee !== He && op(W, He, ee);
                else if (!tn(W, ot, v) && !Gn(W, ee, ot, v)) {
                  var te = !1;
                  if (ot !== null)
                    h.delete(ot.attributeName), He = gi(e, W, ee, ot);
                  else {
                    var H = i;
                    if (H === Gi && (H = ad(t)), H === Gi)
                      h.delete(W.toLowerCase());
                    else {
                      var ke = p0(W);
                      ke !== null && ke !== W && (te = !0, h.delete(ke)), h.delete(W);
                    }
                    He = Si(e, W, ee);
                  }
                  var Qe = M;
                  !Qe && ee !== He && !te && op(W, He, ee);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      h.size > 0 && a[Nu] !== !0 && QE(h), t) {
        case "input":
          li(e), Y(e, a, !0);
          break;
        case "textarea":
          li(e), cv(e);
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
    function h0(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Fy(e, t) {
      {
        if (Wa)
          return;
        Wa = !0, g("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Py(e, t) {
      {
        if (Wa)
          return;
        Wa = !0, g('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Hy(e, t, a) {
      {
        if (Wa)
          return;
        Wa = !0, g("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function By(e, t) {
      {
        if (t === "" || Wa)
          return;
        Wa = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function m0(e, t, a) {
      switch (t) {
        case "input":
          q(e, a);
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
      var y0 = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], qE = [
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
      ], g0 = qE.concat(["button"]), S0 = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], XE = {
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
        var a = kt({}, e || XE), i = {
          tag: t
        };
        return qE.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), g0.indexOf(t) !== -1 && (a.pTagInButtonScope = null), y0.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var E0 = function(e, t) {
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
            return S0.indexOf(t) === -1;
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
      }, x0 = function(e, t) {
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
      }, JE = {};
      up = function(e, t, a) {
        a = a || XE;
        var i = a.current, o = i && i.tag;
        t != null && (e != null && g("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = E0(e, o) ? null : i, f = s ? null : x0(e, a), v = s || f;
        if (v) {
          var h = v.tag, S = !!s + "|" + e + "|" + h;
          if (!JE[S]) {
            JE[S] = !0;
            var C = e, L = "";
            if (e === "#text" ? /\S/.test(t) ? C = "Text nodes" : (C = "Whitespace text nodes", L = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : C = "<" + e + ">", s) {
              var N = "";
              h === "table" && e === "tr" && (N += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", C, h, L, N);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", C, h);
          }
        }
      };
    }
    var Mh = "suppressHydrationWarning", Ah = "$", zh = "/$", cp = "$?", fp = "$!", C0 = "style", Vy = null, Iy = null;
    function b0(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case qi:
        case ld: {
          t = i === qi ? "#document" : "#fragment";
          var o = e.documentElement;
          a = o ? o.namespaceURI : id(null, "");
          break;
        }
        default: {
          var s = i === Kn ? e.parentNode : e, f = s.namespaceURI || null;
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
    function w0(e, t, a) {
      {
        var i = e, o = id(i.namespace, t), s = sp(i.ancestorInfo, t);
        return {
          namespace: o,
          ancestorInfo: s
        };
      }
    }
    function DN(e) {
      return e;
    }
    function T0(e) {
      Vy = tr(), Iy = Pw();
      var t = null;
      return ur(!1), t;
    }
    function R0(e) {
      Hw(Iy), ur(Vy), Vy = null, Iy = null;
    }
    function _0(e, t, a, i, o) {
      var s;
      {
        var f = i;
        if (up(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var v = "" + t.children, h = sp(f.ancestorInfo, e);
          up(null, v, h);
        }
        s = f.namespace;
      }
      var S = u0(e, t, a, s);
      return vp(o, S), Xy(S, t), S;
    }
    function k0(e, t) {
      e.appendChild(t);
    }
    function j0(e, t, a, i, o) {
      switch (c0(e, t, a, i), t) {
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
    function N0(e, t, a, i, o, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var v = "" + i.children, h = sp(f.ancestorInfo, t);
          up(null, v, h);
        }
      }
      return f0(e, t, a, i);
    }
    function $y(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function D0(e, t, a, i) {
      {
        var o = a;
        up(null, e, o.ancestorInfo);
      }
      var s = s0(e, t);
      return vp(i, s), s;
    }
    function O0() {
      var e = window.event;
      return e === void 0 ? Ia : uf(e.type);
    }
    var Yy = typeof setTimeout == "function" ? setTimeout : void 0, L0 = typeof clearTimeout == "function" ? clearTimeout : void 0, Qy = -1, ZE = typeof Promise == "function" ? Promise : void 0, M0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof ZE < "u" ? function(e) {
      return ZE.resolve(null).then(e).catch(A0);
    } : Yy;
    function A0(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function z0(e, t, a, i) {
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
    function U0(e, t, a, i, o, s) {
      d0(e, t, a, i, o), Xy(e, o);
    }
    function ex(e) {
      ou(e, "");
    }
    function F0(e, t, a) {
      e.nodeValue = a;
    }
    function P0(e, t) {
      e.appendChild(t);
    }
    function H0(e, t) {
      var a;
      e.nodeType === Kn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Lh(a);
    }
    function B0(e, t, a) {
      e.insertBefore(t, a);
    }
    function V0(e, t, a) {
      e.nodeType === Kn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function I0(e, t) {
      e.removeChild(t);
    }
    function $0(e, t) {
      e.nodeType === Kn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Wy(e, t) {
      var a = t, i = 0;
      do {
        var o = a.nextSibling;
        if (e.removeChild(a), o && o.nodeType === Kn) {
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
    function Y0(e, t) {
      e.nodeType === Kn ? Wy(e.parentNode, t) : e.nodeType === aa && Wy(e, t), Oo(e);
    }
    function Q0(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function W0(e) {
      e.nodeValue = "";
    }
    function G0(e, t) {
      e = e;
      var a = t[C0], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = pc("display", i);
    }
    function K0(e, t) {
      e.nodeValue = t;
    }
    function q0(e) {
      e.nodeType === aa ? e.textContent = "" : e.nodeType === qi && e.documentElement && e.removeChild(e.documentElement);
    }
    function X0(e, t, a) {
      return e.nodeType !== aa || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function J0(e, t) {
      return t === "" || e.nodeType !== Ki ? null : e;
    }
    function Z0(e) {
      return e.nodeType !== Kn ? null : e;
    }
    function tx(e) {
      return e.data === cp;
    }
    function Gy(e) {
      return e.data === fp;
    }
    function eT(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, o;
      return t && (a = t.dgst, i = t.msg, o = t.stck), {
        message: i,
        digest: a,
        stack: o
      };
    }
    function tT(e, t) {
      e._reactRetry = t;
    }
    function Uh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === aa || t === Ki)
          break;
        if (t === Kn) {
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
    function nT(e) {
      return Uh(e.firstChild);
    }
    function rT(e) {
      return Uh(e.firstChild);
    }
    function aT(e) {
      return Uh(e.nextSibling);
    }
    function iT(e, t, a, i, o, s, f) {
      vp(s, e), Xy(e, a);
      var v;
      {
        var h = o;
        v = h.namespace;
      }
      var S = (s.mode & Ot) !== it;
      return v0(e, t, a, v, i, S, f);
    }
    function lT(e, t, a, i) {
      return vp(a, e), a.mode & Ot, h0(e, t);
    }
    function oT(e, t) {
      vp(t, e);
    }
    function uT(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Kn) {
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
    function nx(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Kn) {
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
    function sT(e) {
      Oo(e);
    }
    function cT(e) {
      Oo(e);
    }
    function fT(e) {
      return e !== "head" && e !== "body";
    }
    function dT(e, t, a, i) {
      var o = !0;
      Oh(t.nodeValue, a, i, o);
    }
    function pT(e, t, a, i, o, s) {
      if (t[Mh] !== !0) {
        var f = !0;
        Oh(i.nodeValue, o, s, f);
      }
    }
    function vT(e, t) {
      t.nodeType === aa ? Fy(e, t) : t.nodeType === Kn || Py(e, t);
    }
    function hT(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === aa ? Fy(a, t) : t.nodeType === Kn || Py(a, t));
      }
    }
    function mT(e, t, a, i, o) {
      (o || t[Mh] !== !0) && (i.nodeType === aa ? Fy(a, i) : i.nodeType === Kn || Py(a, i));
    }
    function yT(e, t, a) {
      Hy(e, t);
    }
    function gT(e, t) {
      By(e, t);
    }
    function ST(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Hy(i, t);
      }
    }
    function ET(e, t) {
      {
        var a = e.parentNode;
        a !== null && By(a, t);
      }
    }
    function xT(e, t, a, i, o, s) {
      (s || t[Mh] !== !0) && Hy(a, i);
    }
    function CT(e, t, a, i, o) {
      (o || t[Mh] !== !0) && By(a, i);
    }
    function bT(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function wT(e) {
      ap(e);
    }
    var Cf = Math.random().toString(36).slice(2), bf = "__reactFiber$" + Cf, Ky = "__reactProps$" + Cf, pp = "__reactContainer$" + Cf, qy = "__reactEvents$" + Cf, TT = "__reactListeners$" + Cf, RT = "__reactHandles$" + Cf;
    function _T(e) {
      delete e[bf], delete e[Ky], delete e[qy], delete e[TT], delete e[RT];
    }
    function vp(e, t) {
      t[bf] = e;
    }
    function Fh(e, t) {
      t[pp] = e;
    }
    function rx(e) {
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
            for (var o = nx(e); o !== null; ) {
              var s = o[bf];
              if (s)
                return s;
              o = nx(o);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Du(e) {
      var t = e[bf] || e[pp];
      return t && (t.tag === ne || t.tag === ie || t.tag === fe || t.tag === F) ? t : null;
    }
    function wf(e) {
      if (e.tag === ne || e.tag === ie)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Ph(e) {
      return e[Ky] || null;
    }
    function Xy(e, t) {
      e[Ky] = t;
    }
    function kT(e) {
      var t = e[qy];
      return t === void 0 && (t = e[qy] = /* @__PURE__ */ new Set()), t;
    }
    var ax = {}, ix = b.ReactDebugCurrentFrame;
    function Hh(e) {
      if (e) {
        var t = e._owner, a = Yi(e.type, e._source, t ? t.type : null);
        ix.setExtraStackFrame(a);
      } else
        ix.setExtraStackFrame(null);
    }
    function ol(e, t, a, i, o) {
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
            v && !(v instanceof Error) && (Hh(o), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof v), Hh(null)), v instanceof Error && !(v.message in ax) && (ax[v.message] = !0, Hh(o), g("Failed %s type: %s", a, v.message), Hh(null));
          }
      }
    }
    var Jy = [], Bh;
    Bh = [];
    var Fo = -1;
    function Ou(e) {
      return {
        current: e
      };
    }
    function ha(e, t) {
      if (Fo < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== Bh[Fo] && g("Unexpected Fiber popped."), e.current = Jy[Fo], Jy[Fo] = null, Bh[Fo] = null, Fo--;
    }
    function ma(e, t, a) {
      Fo++, Jy[Fo] = e.current, Bh[Fo] = a, e.current = t;
    }
    var Zy;
    Zy = {};
    var vi = {};
    Object.freeze(vi);
    var Po = Ou(vi), Wl = Ou(!1), eg = vi;
    function Tf(e, t, a) {
      return a && Gl(t) ? eg : Po.current;
    }
    function lx(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function Rf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return vi;
        var o = e.stateNode;
        if (o && o.__reactInternalMemoizedUnmaskedChildContext === t)
          return o.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var v = yt(e) || "Unknown";
          ol(i, s, "context", v);
        }
        return o && lx(e, t, s), s;
      }
    }
    function Vh() {
      return Wl.current;
    }
    function Gl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Ih(e) {
      ha(Wl, e), ha(Po, e);
    }
    function tg(e) {
      ha(Wl, e), ha(Po, e);
    }
    function ox(e, t, a) {
      {
        if (Po.current !== vi)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ma(Po, t, e), ma(Wl, a, e);
      }
    }
    function ux(e, t, a) {
      {
        var i = e.stateNode, o = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = yt(e) || "Unknown";
            Zy[s] || (Zy[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var v in f)
          if (!(v in o))
            throw new Error((yt(e) || "Unknown") + '.getChildContext(): key "' + v + '" is not defined in childContextTypes.');
        {
          var h = yt(e) || "Unknown";
          ol(o, f, "child context", h);
        }
        return kt({}, a, f);
      }
    }
    function $h(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || vi;
        return eg = Po.current, ma(Po, a, e), ma(Wl, Wl.current, e), !0;
      }
    }
    function sx(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var o = ux(e, t, eg);
          i.__reactInternalMemoizedMergedChildContext = o, ha(Wl, e), ha(Po, e), ma(Po, o, e), ma(Wl, a, e);
        } else
          ha(Wl, e), ma(Wl, a, e);
      }
    }
    function jT(e) {
      {
        if (!go(e) || e.tag !== B)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case F:
              return t.stateNode.context;
            case B: {
              var a = t.type;
              if (Gl(a))
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
    function cx(e) {
      Ho === null ? Ho = [e] : Ho.push(e);
    }
    function NT(e) {
      ng = !0, cx(e);
    }
    function fx() {
      ng && Mu();
    }
    function Mu() {
      if (!rg && Ho !== null) {
        rg = !0;
        var e = 0, t = Ya();
        try {
          var a = !0, i = Ho;
          for (er(Hr); e < i.length; e++) {
            var o = i[e];
            do
              o = o(a);
            while (o !== null);
          }
          Ho = null, ng = !1;
        } catch (s) {
          throw Ho !== null && (Ho = Ho.slice(e + 1)), gd(fs, Mu), s;
        } finally {
          er(t), rg = !1;
        }
      }
      return null;
    }
    var _f = [], kf = 0, Qh = null, Wh = 0, Ui = [], Fi = 0, Ws = null, Bo = 1, Vo = "";
    function DT(e) {
      return Ks(), (e.flags & _i) !== at;
    }
    function OT(e) {
      return Ks(), Wh;
    }
    function LT() {
      var e = Vo, t = Bo, a = t & ~MT(t);
      return a.toString(32) + e;
    }
    function Gs(e, t) {
      Ks(), _f[kf++] = Wh, _f[kf++] = Qh, Qh = e, Wh = t;
    }
    function dx(e, t, a) {
      Ks(), Ui[Fi++] = Bo, Ui[Fi++] = Vo, Ui[Fi++] = Ws, Ws = e;
      var i = Bo, o = Vo, s = Gh(i) - 1, f = i & ~(1 << s), v = a + 1, h = Gh(t) + s;
      if (h > 30) {
        var S = s - s % 5, C = (1 << S) - 1, L = (f & C).toString(32), N = f >> S, $ = s - S, W = Gh(t) + $, ee = v << $, He = ee | N, ot = L + o;
        Bo = 1 << W | He, Vo = ot;
      } else {
        var et = v << s, Vt = et | f, zt = o;
        Bo = 1 << h | Vt, Vo = zt;
      }
    }
    function ag(e) {
      Ks();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Gs(e, a), dx(e, a, i);
      }
    }
    function Gh(e) {
      return 32 - Jn(e);
    }
    function MT(e) {
      return 1 << Gh(e) - 1;
    }
    function ig(e) {
      for (; e === Qh; )
        Qh = _f[--kf], _f[kf] = null, Wh = _f[--kf], _f[kf] = null;
      for (; e === Ws; )
        Ws = Ui[--Fi], Ui[Fi] = null, Vo = Ui[--Fi], Ui[Fi] = null, Bo = Ui[--Fi], Ui[Fi] = null;
    }
    function AT() {
      return Ks(), Ws !== null ? {
        id: Bo,
        overflow: Vo
      } : null;
    }
    function zT(e, t) {
      Ks(), Ui[Fi++] = Bo, Ui[Fi++] = Vo, Ui[Fi++] = Ws, Bo = t.id, Vo = t.overflow, Ws = e;
    }
    function Ks() {
      Yr() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var $r = null, Pi = null, ul = !1, qs = !1, Au = null;
    function UT() {
      ul && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function px() {
      qs = !0;
    }
    function FT() {
      return qs;
    }
    function PT(e) {
      var t = e.stateNode.containerInfo;
      return Pi = rT(t), $r = e, ul = !0, Au = null, qs = !1, !0;
    }
    function HT(e, t, a) {
      return Pi = aT(t), $r = e, ul = !0, Au = null, qs = !1, a !== null && zT(e, a), !0;
    }
    function vx(e, t) {
      switch (e.tag) {
        case F: {
          vT(e.stateNode.containerInfo, t);
          break;
        }
        case ne: {
          var a = (e.mode & Ot) !== it;
          mT(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case fe: {
          var i = e.memoizedState;
          i.dehydrated !== null && hT(i.dehydrated, t);
          break;
        }
      }
    }
    function hx(e, t) {
      vx(e, t);
      var a = $k();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Fa) : i.push(a);
    }
    function lg(e, t) {
      {
        if (qs)
          return;
        switch (e.tag) {
          case F: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ne:
                var i = t.type;
                t.pendingProps, yT(a, i);
                break;
              case ie:
                var o = t.pendingProps;
                gT(a, o);
                break;
            }
            break;
          }
          case ne: {
            var s = e.type, f = e.memoizedProps, v = e.stateNode;
            switch (t.tag) {
              case ne: {
                var h = t.type, S = t.pendingProps, C = (e.mode & Ot) !== it;
                xT(
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
              case ie: {
                var L = t.pendingProps, N = (e.mode & Ot) !== it;
                CT(
                  s,
                  f,
                  v,
                  L,
                  // TODO: Delete this argument when we remove the legacy root API.
                  N
                );
                break;
              }
            }
            break;
          }
          case fe: {
            var $ = e.memoizedState, W = $.dehydrated;
            if (W !== null) switch (t.tag) {
              case ne:
                var ee = t.type;
                t.pendingProps, ST(W, ee);
                break;
              case ie:
                var He = t.pendingProps;
                ET(W, He);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function mx(e, t) {
      t.flags = t.flags & ~la | Ln, lg(e, t);
    }
    function yx(e, t) {
      switch (e.tag) {
        case ne: {
          var a = e.type;
          e.pendingProps;
          var i = X0(t, a);
          return i !== null ? (e.stateNode = i, $r = e, Pi = nT(i), !0) : !1;
        }
        case ie: {
          var o = e.pendingProps, s = J0(t, o);
          return s !== null ? (e.stateNode = s, $r = e, Pi = null, !0) : !1;
        }
        case fe: {
          var f = Z0(t);
          if (f !== null) {
            var v = {
              dehydrated: f,
              treeContext: AT(),
              retryLane: ca
            };
            e.memoizedState = v;
            var h = Yk(f);
            return h.return = e, e.child = h, $r = e, Pi = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function og(e) {
      return (e.mode & Ot) !== it && (e.flags & tt) === at;
    }
    function ug(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function sg(e) {
      if (ul) {
        var t = Pi;
        if (!t) {
          og(e) && (lg($r, e), ug()), mx($r, e), ul = !1, $r = e;
          return;
        }
        var a = t;
        if (!yx(e, t)) {
          og(e) && (lg($r, e), ug()), t = dp(a);
          var i = $r;
          if (!t || !yx(e, t)) {
            mx($r, e), ul = !1, $r = e;
            return;
          }
          hx(i, a);
        }
      }
    }
    function BT(e, t, a) {
      var i = e.stateNode, o = !qs, s = iT(i, e.type, e.memoizedProps, t, a, e, o);
      return e.updateQueue = s, s !== null;
    }
    function VT(e) {
      var t = e.stateNode, a = e.memoizedProps, i = lT(t, a, e);
      if (i) {
        var o = $r;
        if (o !== null)
          switch (o.tag) {
            case F: {
              var s = o.stateNode.containerInfo, f = (o.mode & Ot) !== it;
              dT(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case ne: {
              var v = o.type, h = o.memoizedProps, S = o.stateNode, C = (o.mode & Ot) !== it;
              pT(
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
    function IT(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      oT(a, e);
    }
    function $T(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return uT(a);
    }
    function gx(e) {
      for (var t = e.return; t !== null && t.tag !== ne && t.tag !== F && t.tag !== fe; )
        t = t.return;
      $r = t;
    }
    function Kh(e) {
      if (e !== $r)
        return !1;
      if (!ul)
        return gx(e), ul = !0, !1;
      if (e.tag !== F && (e.tag !== ne || fT(e.type) && !$y(e.type, e.memoizedProps))) {
        var t = Pi;
        if (t)
          if (og(e))
            Sx(e), ug();
          else
            for (; t; )
              hx(e, t), t = dp(t);
      }
      return gx(e), e.tag === fe ? Pi = $T(e) : Pi = $r ? dp(e.stateNode) : null, !0;
    }
    function YT() {
      return ul && Pi !== null;
    }
    function Sx(e) {
      for (var t = Pi; t; )
        vx(e, t), t = dp(t);
    }
    function jf() {
      $r = null, Pi = null, ul = !1, qs = !1;
    }
    function Ex() {
      Au !== null && (pb(Au), Au = null);
    }
    function Yr() {
      return ul;
    }
    function cg(e) {
      Au === null ? Au = [e] : Au.push(e);
    }
    var QT = b.ReactCurrentBatchConfig, WT = null;
    function GT() {
      return QT.transition;
    }
    var sl = {
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
      var KT = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & pn && (t = a), a = a.return;
        return t;
      }, Xs = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, mp = [], yp = [], gp = [], Sp = [], Ep = [], xp = [], Js = /* @__PURE__ */ new Set();
      sl.recordUnsafeLifecycleWarnings = function(e, t) {
        Js.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && mp.push(e), e.mode & pn && typeof t.UNSAFE_componentWillMount == "function" && yp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && gp.push(e), e.mode & pn && typeof t.UNSAFE_componentWillReceiveProps == "function" && Sp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Ep.push(e), e.mode & pn && typeof t.UNSAFE_componentWillUpdate == "function" && xp.push(e));
      }, sl.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(N) {
          e.add(yt(N) || "Component"), Js.add(N.type);
        }), mp = []);
        var t = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(N) {
          t.add(yt(N) || "Component"), Js.add(N.type);
        }), yp = []);
        var a = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(N) {
          a.add(yt(N) || "Component"), Js.add(N.type);
        }), gp = []);
        var i = /* @__PURE__ */ new Set();
        Sp.length > 0 && (Sp.forEach(function(N) {
          i.add(yt(N) || "Component"), Js.add(N.type);
        }), Sp = []);
        var o = /* @__PURE__ */ new Set();
        Ep.length > 0 && (Ep.forEach(function(N) {
          o.add(yt(N) || "Component"), Js.add(N.type);
        }), Ep = []);
        var s = /* @__PURE__ */ new Set();
        if (xp.length > 0 && (xp.forEach(function(N) {
          s.add(yt(N) || "Component"), Js.add(N.type);
        }), xp = []), t.size > 0) {
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
          j(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, S);
        }
        if (a.size > 0) {
          var C = Xs(a);
          j(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, C);
        }
        if (o.size > 0) {
          var L = Xs(o);
          j(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, L);
        }
      };
      var qh = /* @__PURE__ */ new Map(), xx = /* @__PURE__ */ new Set();
      sl.recordLegacyContextWarning = function(e, t) {
        var a = KT(e);
        if (a === null) {
          g("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!xx.has(e.type)) {
          var i = qh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], qh.set(a, i)), i.push(e));
        }
      }, sl.flushLegacyContextWarning = function() {
        qh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(yt(s) || "Component"), xx.add(s.type);
            });
            var o = Xs(i);
            try {
              cn(a), g(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o);
            } finally {
              wn();
            }
          }
        });
      }, sl.discardPendingWarnings = function() {
        mp = [], yp = [], gp = [], Sp = [], Ep = [], xp = [], qh = /* @__PURE__ */ new Map();
      };
    }
    var fg, dg, pg, vg, hg, Cx = function(e, t) {
    };
    fg = !1, dg = !1, pg = {}, vg = {}, hg = {}, Cx = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = yt(t) || "Component";
        vg[a] || (vg[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function qT(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Cp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & pn || _) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== B) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !qT(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var o = yt(e) || "Component";
          pg[o] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', o, i), pg[o] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var v = s;
            if (v.tag !== B)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = v.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var h = f;
          Zr(i, "ref");
          var S = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === S)
            return t.ref;
          var C = function(L) {
            var N = h.refs;
            L === null ? delete N[S] : N[S] = L;
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
    function Xh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Jh(e) {
      {
        var t = yt(e) || "Component";
        if (hg[t])
          return;
        hg[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function bx(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function wx(e) {
      function t(P, te) {
        if (e) {
          var H = P.deletions;
          H === null ? (P.deletions = [te], P.flags |= Fa) : H.push(te);
        }
      }
      function a(P, te) {
        if (!e)
          return null;
        for (var H = te; H !== null; )
          t(P, H), H = H.sibling;
        return null;
      }
      function i(P, te) {
        for (var H = /* @__PURE__ */ new Map(), ke = te; ke !== null; )
          ke.key !== null ? H.set(ke.key, ke) : H.set(ke.index, ke), ke = ke.sibling;
        return H;
      }
      function o(P, te) {
        var H = oc(P, te);
        return H.index = 0, H.sibling = null, H;
      }
      function s(P, te, H) {
        if (P.index = H, !e)
          return P.flags |= _i, te;
        var ke = P.alternate;
        if (ke !== null) {
          var Qe = ke.index;
          return Qe < te ? (P.flags |= Ln, te) : Qe;
        } else
          return P.flags |= Ln, te;
      }
      function f(P) {
        return e && P.alternate === null && (P.flags |= Ln), P;
      }
      function v(P, te, H, ke) {
        if (te === null || te.tag !== ie) {
          var Qe = cE(H, P.mode, ke);
          return Qe.return = P, Qe;
        } else {
          var Ve = o(te, H);
          return Ve.return = P, Ve;
        }
      }
      function h(P, te, H, ke) {
        var Qe = H.type;
        if (Qe === vt)
          return C(P, te, H.props.children, ke, H.key);
        if (te !== null && (te.elementType === Qe || // Keep this check inline so it only runs on the false path:
        jb(te, H) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof Qe == "object" && Qe !== null && Qe.$$typeof === ht && bx(Qe) === te.type)) {
          var Ve = o(te, H.props);
          return Ve.ref = Cp(P, te, H), Ve.return = P, Ve._debugSource = H._source, Ve._debugOwner = H._owner, Ve;
        }
        var dt = sE(H, P.mode, ke);
        return dt.ref = Cp(P, te, H), dt.return = P, dt;
      }
      function S(P, te, H, ke) {
        if (te === null || te.tag !== I || te.stateNode.containerInfo !== H.containerInfo || te.stateNode.implementation !== H.implementation) {
          var Qe = fE(H, P.mode, ke);
          return Qe.return = P, Qe;
        } else {
          var Ve = o(te, H.children || []);
          return Ve.return = P, Ve;
        }
      }
      function C(P, te, H, ke, Qe) {
        if (te === null || te.tag !== Z) {
          var Ve = Qu(H, P.mode, ke, Qe);
          return Ve.return = P, Ve;
        } else {
          var dt = o(te, H);
          return dt.return = P, dt;
        }
      }
      function L(P, te, H) {
        if (typeof te == "string" && te !== "" || typeof te == "number") {
          var ke = cE("" + te, P.mode, H);
          return ke.return = P, ke;
        }
        if (typeof te == "object" && te !== null) {
          switch (te.$$typeof) {
            case A: {
              var Qe = sE(te, P.mode, H);
              return Qe.ref = Cp(P, null, te), Qe.return = P, Qe;
            }
            case de: {
              var Ve = fE(te, P.mode, H);
              return Ve.return = P, Ve;
            }
            case ht: {
              var dt = te._payload, bt = te._init;
              return L(P, bt(dt), H);
            }
          }
          if (Nt(te) || Tt(te)) {
            var hn = Qu(te, P.mode, H, null);
            return hn.return = P, hn;
          }
          Xh(P, te);
        }
        return typeof te == "function" && Jh(P), null;
      }
      function N(P, te, H, ke) {
        var Qe = te !== null ? te.key : null;
        if (typeof H == "string" && H !== "" || typeof H == "number")
          return Qe !== null ? null : v(P, te, "" + H, ke);
        if (typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case A:
              return H.key === Qe ? h(P, te, H, ke) : null;
            case de:
              return H.key === Qe ? S(P, te, H, ke) : null;
            case ht: {
              var Ve = H._payload, dt = H._init;
              return N(P, te, dt(Ve), ke);
            }
          }
          if (Nt(H) || Tt(H))
            return Qe !== null ? null : C(P, te, H, ke, null);
          Xh(P, H);
        }
        return typeof H == "function" && Jh(P), null;
      }
      function $(P, te, H, ke, Qe) {
        if (typeof ke == "string" && ke !== "" || typeof ke == "number") {
          var Ve = P.get(H) || null;
          return v(te, Ve, "" + ke, Qe);
        }
        if (typeof ke == "object" && ke !== null) {
          switch (ke.$$typeof) {
            case A: {
              var dt = P.get(ke.key === null ? H : ke.key) || null;
              return h(te, dt, ke, Qe);
            }
            case de: {
              var bt = P.get(ke.key === null ? H : ke.key) || null;
              return S(te, bt, ke, Qe);
            }
            case ht:
              var hn = ke._payload, Jt = ke._init;
              return $(P, te, H, Jt(hn), Qe);
          }
          if (Nt(ke) || Tt(ke)) {
            var sr = P.get(H) || null;
            return C(te, sr, ke, Qe, null);
          }
          Xh(te, ke);
        }
        return typeof ke == "function" && Jh(te), null;
      }
      function W(P, te, H) {
        {
          if (typeof P != "object" || P === null)
            return te;
          switch (P.$$typeof) {
            case A:
            case de:
              Cx(P, H);
              var ke = P.key;
              if (typeof ke != "string")
                break;
              if (te === null) {
                te = /* @__PURE__ */ new Set(), te.add(ke);
                break;
              }
              if (!te.has(ke)) {
                te.add(ke);
                break;
              }
              g("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", ke);
              break;
            case ht:
              var Qe = P._payload, Ve = P._init;
              W(Ve(Qe), te, H);
              break;
          }
        }
        return te;
      }
      function ee(P, te, H, ke) {
        for (var Qe = null, Ve = 0; Ve < H.length; Ve++) {
          var dt = H[Ve];
          Qe = W(dt, Qe, P);
        }
        for (var bt = null, hn = null, Jt = te, sr = 0, Zt = 0, rr = null; Jt !== null && Zt < H.length; Zt++) {
          Jt.index > Zt ? (rr = Jt, Jt = null) : rr = Jt.sibling;
          var ga = N(P, Jt, H[Zt], ke);
          if (ga === null) {
            Jt === null && (Jt = rr);
            break;
          }
          e && Jt && ga.alternate === null && t(P, Jt), sr = s(ga, sr, Zt), hn === null ? bt = ga : hn.sibling = ga, hn = ga, Jt = rr;
        }
        if (Zt === H.length) {
          if (a(P, Jt), Yr()) {
            var Jr = Zt;
            Gs(P, Jr);
          }
          return bt;
        }
        if (Jt === null) {
          for (; Zt < H.length; Zt++) {
            var mi = L(P, H[Zt], ke);
            mi !== null && (sr = s(mi, sr, Zt), hn === null ? bt = mi : hn.sibling = mi, hn = mi);
          }
          if (Yr()) {
            var Da = Zt;
            Gs(P, Da);
          }
          return bt;
        }
        for (var Oa = i(P, Jt); Zt < H.length; Zt++) {
          var Sa = $(Oa, P, Zt, H[Zt], ke);
          Sa !== null && (e && Sa.alternate !== null && Oa.delete(Sa.key === null ? Zt : Sa.key), sr = s(Sa, sr, Zt), hn === null ? bt = Sa : hn.sibling = Sa, hn = Sa);
        }
        if (e && Oa.forEach(function(Gf) {
          return t(P, Gf);
        }), Yr()) {
          var Ko = Zt;
          Gs(P, Ko);
        }
        return bt;
      }
      function He(P, te, H, ke) {
        var Qe = Tt(H);
        if (typeof Qe != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          H[Symbol.toStringTag] === "Generator" && (dg || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), dg = !0), H.entries === Qe && (fg || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), fg = !0);
          var Ve = Qe.call(H);
          if (Ve)
            for (var dt = null, bt = Ve.next(); !bt.done; bt = Ve.next()) {
              var hn = bt.value;
              dt = W(hn, dt, P);
            }
        }
        var Jt = Qe.call(H);
        if (Jt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var sr = null, Zt = null, rr = te, ga = 0, Jr = 0, mi = null, Da = Jt.next(); rr !== null && !Da.done; Jr++, Da = Jt.next()) {
          rr.index > Jr ? (mi = rr, rr = null) : mi = rr.sibling;
          var Oa = N(P, rr, Da.value, ke);
          if (Oa === null) {
            rr === null && (rr = mi);
            break;
          }
          e && rr && Oa.alternate === null && t(P, rr), ga = s(Oa, ga, Jr), Zt === null ? sr = Oa : Zt.sibling = Oa, Zt = Oa, rr = mi;
        }
        if (Da.done) {
          if (a(P, rr), Yr()) {
            var Sa = Jr;
            Gs(P, Sa);
          }
          return sr;
        }
        if (rr === null) {
          for (; !Da.done; Jr++, Da = Jt.next()) {
            var Ko = L(P, Da.value, ke);
            Ko !== null && (ga = s(Ko, ga, Jr), Zt === null ? sr = Ko : Zt.sibling = Ko, Zt = Ko);
          }
          if (Yr()) {
            var Gf = Jr;
            Gs(P, Gf);
          }
          return sr;
        }
        for (var ev = i(P, rr); !Da.done; Jr++, Da = Jt.next()) {
          var no = $(ev, P, Jr, Da.value, ke);
          no !== null && (e && no.alternate !== null && ev.delete(no.key === null ? Jr : no.key), ga = s(no, ga, Jr), Zt === null ? sr = no : Zt.sibling = no, Zt = no);
        }
        if (e && ev.forEach(function(Cj) {
          return t(P, Cj);
        }), Yr()) {
          var xj = Jr;
          Gs(P, xj);
        }
        return sr;
      }
      function ot(P, te, H, ke) {
        if (te !== null && te.tag === ie) {
          a(P, te.sibling);
          var Qe = o(te, H);
          return Qe.return = P, Qe;
        }
        a(P, te);
        var Ve = cE(H, P.mode, ke);
        return Ve.return = P, Ve;
      }
      function et(P, te, H, ke) {
        for (var Qe = H.key, Ve = te; Ve !== null; ) {
          if (Ve.key === Qe) {
            var dt = H.type;
            if (dt === vt) {
              if (Ve.tag === Z) {
                a(P, Ve.sibling);
                var bt = o(Ve, H.props.children);
                return bt.return = P, bt._debugSource = H._source, bt._debugOwner = H._owner, bt;
              }
            } else if (Ve.elementType === dt || // Keep this check inline so it only runs on the false path:
            jb(Ve, H) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof dt == "object" && dt !== null && dt.$$typeof === ht && bx(dt) === Ve.type) {
              a(P, Ve.sibling);
              var hn = o(Ve, H.props);
              return hn.ref = Cp(P, Ve, H), hn.return = P, hn._debugSource = H._source, hn._debugOwner = H._owner, hn;
            }
            a(P, Ve);
            break;
          } else
            t(P, Ve);
          Ve = Ve.sibling;
        }
        if (H.type === vt) {
          var Jt = Qu(H.props.children, P.mode, ke, H.key);
          return Jt.return = P, Jt;
        } else {
          var sr = sE(H, P.mode, ke);
          return sr.ref = Cp(P, te, H), sr.return = P, sr;
        }
      }
      function Vt(P, te, H, ke) {
        for (var Qe = H.key, Ve = te; Ve !== null; ) {
          if (Ve.key === Qe)
            if (Ve.tag === I && Ve.stateNode.containerInfo === H.containerInfo && Ve.stateNode.implementation === H.implementation) {
              a(P, Ve.sibling);
              var dt = o(Ve, H.children || []);
              return dt.return = P, dt;
            } else {
              a(P, Ve);
              break;
            }
          else
            t(P, Ve);
          Ve = Ve.sibling;
        }
        var bt = fE(H, P.mode, ke);
        return bt.return = P, bt;
      }
      function zt(P, te, H, ke) {
        var Qe = typeof H == "object" && H !== null && H.type === vt && H.key === null;
        if (Qe && (H = H.props.children), typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case A:
              return f(et(P, te, H, ke));
            case de:
              return f(Vt(P, te, H, ke));
            case ht:
              var Ve = H._payload, dt = H._init;
              return zt(P, te, dt(Ve), ke);
          }
          if (Nt(H))
            return ee(P, te, H, ke);
          if (Tt(H))
            return He(P, te, H, ke);
          Xh(P, H);
        }
        return typeof H == "string" && H !== "" || typeof H == "number" ? f(ot(P, te, "" + H, ke)) : (typeof H == "function" && Jh(P), a(P, te));
      }
      return zt;
    }
    var Nf = wx(!0), Tx = wx(!1);
    function XT(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = oc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = oc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function JT(e, t) {
      for (var a = e.child; a !== null; )
        Pk(a, t), a = a.sibling;
    }
    var mg = Ou(null), yg;
    yg = {};
    var Zh = null, Df = null, gg = null, em = !1;
    function tm() {
      Zh = null, Df = null, gg = null, em = !1;
    }
    function Rx() {
      em = !0;
    }
    function _x() {
      em = !1;
    }
    function kx(e, t, a) {
      ma(mg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== yg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = yg;
    }
    function Sg(e, t) {
      var a = mg.current;
      ha(mg, t), e._currentValue = a;
    }
    function Eg(e, t, a) {
      for (var i = e; i !== null; ) {
        var o = i.alternate;
        if (Do(i.childLanes, t) ? o !== null && !Do(o.childLanes, t) && (o.childLanes = _t(o.childLanes, t)) : (i.childLanes = _t(i.childLanes, t), o !== null && (o.childLanes = _t(o.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function ZT(e, t, a) {
      eR(e, t, a);
    }
    function eR(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var o = void 0, s = i.dependencies;
        if (s !== null) {
          o = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === B) {
                var v = Ts(a), h = Io(yn, v);
                h.tag = rm;
                var S = i.updateQueue;
                if (S !== null) {
                  var C = S.shared, L = C.pending;
                  L === null ? h.next = h : (h.next = L.next, L.next = h), C.pending = h;
                }
              }
              i.lanes = _t(i.lanes, a);
              var N = i.alternate;
              N !== null && (N.lanes = _t(N.lanes, a)), Eg(i.return, a, e), s.lanes = _t(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === se)
          o = i.type === e.type ? null : i.child;
        else if (i.tag === Te) {
          var $ = i.return;
          if ($ === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          $.lanes = _t($.lanes, a);
          var W = $.alternate;
          W !== null && (W.lanes = _t(W.lanes, a)), Eg($, a, e), o = i.sibling;
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
            var ee = o.sibling;
            if (ee !== null) {
              ee.return = o.return, o = ee;
              break;
            }
            o = o.return;
          }
        i = o;
      }
    }
    function Of(e, t) {
      Zh = e, Df = null, gg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (fa(a.lanes, t) && Up(), a.firstContext = null);
      }
    }
    function mr(e) {
      em && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (gg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Df === null) {
          if (Zh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Df = a, Zh.dependencies = {
            lanes: he,
            firstContext: a
          };
        } else
          Df = Df.next = a;
      }
      return t;
    }
    var Zs = null;
    function xg(e) {
      Zs === null ? Zs = [e] : Zs.push(e);
    }
    function tR() {
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
    function jx(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, xg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, nm(e, i);
    }
    function nR(e, t, a, i) {
      var o = t.interleaved;
      o === null ? (a.next = a, xg(t)) : (a.next = o.next, o.next = a), t.interleaved = a;
    }
    function rR(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, xg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, nm(e, i);
    }
    function Ga(e, t) {
      return nm(e, t);
    }
    var aR = nm;
    function nm(e, t) {
      e.lanes = _t(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = _t(a.lanes, t)), a === null && (e.flags & (Ln | la)) !== at && Tb(e);
      for (var i = e, o = e.return; o !== null; )
        o.childLanes = _t(o.childLanes, t), a = o.alternate, a !== null ? a.childLanes = _t(a.childLanes, t) : (o.flags & (Ln | la)) !== at && Tb(e), i = o, o = o.return;
      if (i.tag === F) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var Nx = 0, Dx = 1, rm = 2, Cg = 3, am = !1, bg, im;
    bg = !1, im = null;
    function wg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: he
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function Ox(e, t) {
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
        tag: Nx,
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
      if (im === o && !bg && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), bg = !0), nk()) {
        var s = o.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), o.pending = t, aR(e, a);
      } else
        return rR(e, o, t, a);
    }
    function lm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var o = i.shared;
        if (Ad(a)) {
          var s = o.lanes;
          s = Ud(s, e.pendingLanes);
          var f = _t(s, a);
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
      var C = a.lastBaseUpdate;
      C === null ? a.firstBaseUpdate = t : C.next = t, a.lastBaseUpdate = t;
    }
    function iR(e, t, a, i, o, s) {
      switch (a.tag) {
        case Dx: {
          var f = a.payload;
          if (typeof f == "function") {
            Rx();
            var v = f.call(s, i, o);
            {
              if (e.mode & pn) {
                Mn(!0);
                try {
                  f.call(s, i, o);
                } finally {
                  Mn(!1);
                }
              }
              _x();
            }
            return v;
          }
          return f;
        }
        case Cg:
          e.flags = e.flags & ~dr | tt;
        case Nx: {
          var h = a.payload, S;
          if (typeof h == "function") {
            Rx(), S = h.call(s, i, o);
            {
              if (e.mode & pn) {
                Mn(!0);
                try {
                  h.call(s, i, o);
                } finally {
                  Mn(!1);
                }
              }
              _x();
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
        var C = e.alternate;
        if (C !== null) {
          var L = C.updateQueue, N = L.lastBaseUpdate;
          N !== f && (N === null ? L.firstBaseUpdate = S : N.next = S, L.lastBaseUpdate = h);
        }
      }
      if (s !== null) {
        var $ = o.baseState, W = he, ee = null, He = null, ot = null, et = s;
        do {
          var Vt = et.lane, zt = et.eventTime;
          if (Do(i, Vt)) {
            if (ot !== null) {
              var te = {
                eventTime: zt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Wt,
                tag: et.tag,
                payload: et.payload,
                callback: et.callback,
                next: null
              };
              ot = ot.next = te;
            }
            $ = iR(e, o, et, $, t, a);
            var H = et.callback;
            if (H !== null && // If the update was already committed, we should not queue its
            // callback again.
            et.lane !== Wt) {
              e.flags |= Cn;
              var ke = o.effects;
              ke === null ? o.effects = [et] : ke.push(et);
            }
          } else {
            var P = {
              eventTime: zt,
              lane: Vt,
              tag: et.tag,
              payload: et.payload,
              callback: et.callback,
              next: null
            };
            ot === null ? (He = ot = P, ee = $) : ot = ot.next = P, W = _t(W, Vt);
          }
          if (et = et.next, et === null) {
            if (v = o.shared.pending, v === null)
              break;
            var Qe = v, Ve = Qe.next;
            Qe.next = null, et = Ve, o.lastBaseUpdate = Qe, o.shared.pending = null;
          }
        } while (!0);
        ot === null && (ee = $), o.baseState = ee, o.firstBaseUpdate = He, o.lastBaseUpdate = ot;
        var dt = o.shared.interleaved;
        if (dt !== null) {
          var bt = dt;
          do
            W = _t(W, bt.lane), bt = bt.next;
          while (bt !== dt);
        } else s === null && (o.shared.lanes = he);
        Kp(W), e.lanes = W, e.memoizedState = $;
      }
      im = null;
    }
    function lR(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function Lx() {
      am = !1;
    }
    function um() {
      return am;
    }
    function Mx(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o], f = s.callback;
          f !== null && (s.callback = null, lR(f, a));
        }
    }
    var bp = {}, Uu = Ou(bp), wp = Ou(bp), sm = Ou(bp);
    function cm(e) {
      if (e === bp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function Ax() {
      var e = cm(sm.current);
      return e;
    }
    function Rg(e, t) {
      ma(sm, t, e), ma(wp, e, e), ma(Uu, bp, e);
      var a = b0(t);
      ha(Uu, e), ma(Uu, a, e);
    }
    function Lf(e) {
      ha(Uu, e), ha(wp, e), ha(sm, e);
    }
    function _g() {
      var e = cm(Uu.current);
      return e;
    }
    function zx(e) {
      cm(sm.current);
      var t = cm(Uu.current), a = w0(t, e.type);
      t !== a && (ma(wp, e, e), ma(Uu, a, e));
    }
    function kg(e) {
      wp.current === e && (ha(Uu, e), ha(wp, e));
    }
    var oR = 0, Ux = 1, Fx = 1, Tp = 2, cl = Ou(oR);
    function jg(e, t) {
      return (e & t) !== 0;
    }
    function Mf(e) {
      return e & Ux;
    }
    function Ng(e, t) {
      return e & Ux | t;
    }
    function uR(e, t) {
      return e | t;
    }
    function Fu(e, t) {
      ma(cl, t, e);
    }
    function Af(e) {
      ha(cl, e);
    }
    function sR(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function fm(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === fe) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || tx(i) || Gy(i))
              return t;
          }
        } else if (t.tag === Le && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var o = (t.flags & tt) !== at;
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
    var Ka = (
      /*   */
      0
    ), wr = (
      /* */
      1
    ), Kl = (
      /*  */
      2
    ), Tr = (
      /*    */
      4
    ), Qr = (
      /*   */
      8
    ), Dg = [];
    function Og() {
      for (var e = 0; e < Dg.length; e++) {
        var t = Dg[e];
        t._workInProgressVersionPrimary = null;
      }
      Dg.length = 0;
    }
    function cR(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var $e = b.ReactCurrentDispatcher, Rp = b.ReactCurrentBatchConfig, Lg, zf;
    Lg = /* @__PURE__ */ new Set();
    var ec = he, vn = null, Rr = null, _r = null, dm = !1, _p = !1, kp = 0, fR = 0, dR = 25, le = null, Hi = null, Pu = -1, Mg = !1;
    function an() {
      {
        var e = le;
        Hi === null ? Hi = [e] : Hi.push(e);
      }
    }
    function Ae() {
      {
        var e = le;
        Hi !== null && (Pu++, Hi[Pu] !== e && pR(e));
      }
    }
    function Uf(e) {
      e != null && !Nt(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", le, typeof e);
    }
    function pR(e) {
      {
        var t = yt(vn);
        if (!Lg.has(t) && (Lg.add(t), Hi !== null)) {
          for (var a = "", i = 30, o = 0; o <= Pu; o++) {
            for (var s = Hi[o], f = o === Pu ? e : s, v = o + 1 + ". " + s; v.length < i; )
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
    function ya() {
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
        return g("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", le), !1;
      e.length !== t.length && g(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, le, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!xe(e[a], t[a]))
          return !1;
      return !0;
    }
    function Ff(e, t, a, i, o, s) {
      ec = s, vn = t, Hi = e !== null ? e._debugHookTypes : null, Pu = -1, Mg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = he, e !== null && e.memoizedState !== null ? $e.current = lC : Hi !== null ? $e.current = iC : $e.current = aC;
      var f = a(i, o);
      if (_p) {
        var v = 0;
        do {
          if (_p = !1, kp = 0, v >= dR)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          v += 1, Mg = !1, Rr = null, _r = null, t.updateQueue = null, Pu = -1, $e.current = oC, f = a(i, o);
        } while (_p);
      }
      $e.current = Tm, t._debugHookTypes = Hi;
      var h = Rr !== null && Rr.next !== null;
      if (ec = he, vn = null, Rr = null, _r = null, le = null, Hi = null, Pu = -1, e !== null && (e.flags & Xn) !== (t.flags & Xn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & Ot) !== it && g("Internal React error: Expected static flag was missing. Please notify the React team."), dm = !1, h)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Pf() {
      var e = kp !== 0;
      return kp = 0, e;
    }
    function Px(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & qt) !== it ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Rs(e.lanes, a);
    }
    function Hx() {
      if ($e.current = Tm, dm) {
        for (var e = vn.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        dm = !1;
      }
      ec = he, vn = null, Rr = null, _r = null, Hi = null, Pu = -1, le = null, Zx = !1, _p = !1, kp = 0;
    }
    function ql() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return _r === null ? vn.memoizedState = _r = e : _r = _r.next = e, _r;
    }
    function Bi() {
      var e;
      if (Rr === null) {
        var t = vn.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = Rr.next;
      var a;
      if (_r === null ? a = vn.memoizedState : a = _r.next, a !== null)
        _r = a, a = _r.next, Rr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        Rr = e;
        var i = {
          memoizedState: Rr.memoizedState,
          baseState: Rr.baseState,
          baseQueue: Rr.baseQueue,
          queue: Rr.queue,
          next: null
        };
        _r === null ? vn.memoizedState = _r = i : _r = _r.next = i;
      }
      return _r;
    }
    function Bx() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function zg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function Ug(e, t, a) {
      var i = ql(), o;
      a !== void 0 ? o = a(t) : o = t, i.memoizedState = i.baseState = o;
      var s = {
        pending: null,
        interleaved: null,
        lanes: he,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: o
      };
      i.queue = s;
      var f = s.dispatch = yR.bind(null, vn, s);
      return [i.memoizedState, f];
    }
    function Fg(e, t, a) {
      var i = Bi(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = Rr, f = s.baseQueue, v = o.pending;
      if (v !== null) {
        if (f !== null) {
          var h = f.next, S = v.next;
          f.next = S, v.next = h;
        }
        s.baseQueue !== f && g("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = v, o.pending = null;
      }
      if (f !== null) {
        var C = f.next, L = s.baseState, N = null, $ = null, W = null, ee = C;
        do {
          var He = ee.lane;
          if (Do(ec, He)) {
            if (W !== null) {
              var et = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Wt,
                action: ee.action,
                hasEagerState: ee.hasEagerState,
                eagerState: ee.eagerState,
                next: null
              };
              W = W.next = et;
            }
            if (ee.hasEagerState)
              L = ee.eagerState;
            else {
              var Vt = ee.action;
              L = e(L, Vt);
            }
          } else {
            var ot = {
              lane: He,
              action: ee.action,
              hasEagerState: ee.hasEagerState,
              eagerState: ee.eagerState,
              next: null
            };
            W === null ? ($ = W = ot, N = L) : W = W.next = ot, vn.lanes = _t(vn.lanes, He), Kp(He);
          }
          ee = ee.next;
        } while (ee !== null && ee !== C);
        W === null ? N = L : W.next = $, xe(L, i.memoizedState) || Up(), i.memoizedState = L, i.baseState = N, i.baseQueue = W, o.lastRenderedState = L;
      }
      var zt = o.interleaved;
      if (zt !== null) {
        var P = zt;
        do {
          var te = P.lane;
          vn.lanes = _t(vn.lanes, te), Kp(te), P = P.next;
        } while (P !== zt);
      } else f === null && (o.lanes = he);
      var H = o.dispatch;
      return [i.memoizedState, H];
    }
    function Pg(e, t, a) {
      var i = Bi(), o = i.queue;
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
        xe(v, i.memoizedState) || Up(), i.memoizedState = v, i.baseQueue === null && (i.baseState = v), o.lastRenderedState = v;
      }
      return [v, s];
    }
    function ON(e, t, a) {
    }
    function LN(e, t, a) {
    }
    function Hg(e, t, a) {
      var i = vn, o = ql(), s, f = Yr();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), zf || s !== a() && (g("The result of getServerSnapshot should be cached to avoid an infinite loop"), zf = !0);
      } else {
        if (s = t(), !zf) {
          var v = t();
          xe(s, v) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
        }
        var h = $m();
        if (h === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        tf(h, ec) || Vx(i, t, s);
      }
      o.memoizedState = s;
      var S = {
        value: s,
        getSnapshot: t
      };
      return o.queue = S, ym($x.bind(null, i, S, e), [e]), i.flags |= ia, jp(wr | Qr, Ix.bind(null, i, S, s, t), void 0, null), s;
    }
    function pm(e, t, a) {
      var i = vn, o = Bi(), s = t();
      if (!zf) {
        var f = t();
        xe(s, f) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), zf = !0);
      }
      var v = o.memoizedState, h = !xe(v, s);
      h && (o.memoizedState = s, Up());
      var S = o.queue;
      if (Dp($x.bind(null, i, S, e), [e]), S.getSnapshot !== t || h || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      _r !== null && _r.memoizedState.tag & wr) {
        i.flags |= ia, jp(wr | Qr, Ix.bind(null, i, S, s, t), void 0, null);
        var C = $m();
        if (C === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        tf(C, ec) || Vx(i, t, s);
      }
      return s;
    }
    function Vx(e, t, a) {
      e.flags |= mu;
      var i = {
        getSnapshot: t,
        value: a
      }, o = vn.updateQueue;
      if (o === null)
        o = Bx(), vn.updateQueue = o, o.stores = [i];
      else {
        var s = o.stores;
        s === null ? o.stores = [i] : s.push(i);
      }
    }
    function Ix(e, t, a, i) {
      t.value = a, t.getSnapshot = i, Yx(t) && Qx(e);
    }
    function $x(e, t, a) {
      var i = function() {
        Yx(t) && Qx(e);
      };
      return a(i);
    }
    function Yx(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !xe(a, i);
      } catch {
        return !0;
      }
    }
    function Qx(e) {
      var t = Ga(e, ft);
      t !== null && Dr(t, e, ft, yn);
    }
    function vm(e) {
      var t = ql();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: he,
        dispatch: null,
        lastRenderedReducer: zg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = gR.bind(null, vn, a);
      return [t.memoizedState, i];
    }
    function Bg(e) {
      return Fg(zg);
    }
    function Vg(e) {
      return Pg(zg);
    }
    function jp(e, t, a, i) {
      var o = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = vn.updateQueue;
      if (s === null)
        s = Bx(), vn.updateQueue = s, s.lastEffect = o.next = o;
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
      var t = ql();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function hm(e) {
      var t = Bi();
      return t.memoizedState;
    }
    function Np(e, t, a, i) {
      var o = ql(), s = i === void 0 ? null : i;
      vn.flags |= e, o.memoizedState = jp(wr | t, a, void 0, s);
    }
    function mm(e, t, a, i) {
      var o = Bi(), s = i === void 0 ? null : i, f = void 0;
      if (Rr !== null) {
        var v = Rr.memoizedState;
        if (f = v.destroy, s !== null) {
          var h = v.deps;
          if (Ag(s, h)) {
            o.memoizedState = jp(t, a, f, s);
            return;
          }
        }
      }
      vn.flags |= e, o.memoizedState = jp(wr | t, a, f, s);
    }
    function ym(e, t) {
      return (vn.mode & qt) !== it ? Np(ki | ia | kc, Qr, e, t) : Np(ia | kc, Qr, e, t);
    }
    function Dp(e, t) {
      return mm(ia, Qr, e, t);
    }
    function $g(e, t) {
      return Np(Pt, Kl, e, t);
    }
    function gm(e, t) {
      return mm(Pt, Kl, e, t);
    }
    function Yg(e, t) {
      var a = Pt;
      return a |= Ji, (vn.mode & qt) !== it && (a |= Dl), Np(a, Tr, e, t);
    }
    function Sm(e, t) {
      return mm(Pt, Tr, e, t);
    }
    function Wx(e, t) {
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
      var i = a != null ? a.concat([e]) : null, o = Pt;
      return o |= Ji, (vn.mode & qt) !== it && (o |= Dl), Np(o, Tr, Wx.bind(null, t, e), i);
    }
    function Em(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return mm(Pt, Tr, Wx.bind(null, t, e), i);
    }
    function vR(e, t) {
    }
    var xm = vR;
    function Wg(e, t) {
      var a = ql(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function Cm(e, t) {
      var a = Bi(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (Ag(i, s))
          return o[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Gg(e, t) {
      var a = ql(), i = t === void 0 ? null : t, o = e();
      return a.memoizedState = [o, i], o;
    }
    function bm(e, t) {
      var a = Bi(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (Ag(i, s))
          return o[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Kg(e) {
      var t = ql();
      return t.memoizedState = e, e;
    }
    function Gx(e) {
      var t = Bi(), a = Rr, i = a.memoizedState;
      return qx(t, i, e);
    }
    function Kx(e) {
      var t = Bi();
      if (Rr === null)
        return t.memoizedState = e, e;
      var a = Rr.memoizedState;
      return qx(t, a, e);
    }
    function qx(e, t, a) {
      var i = !Ld(ec);
      if (i) {
        if (!xe(a, t)) {
          var o = zd();
          vn.lanes = _t(vn.lanes, o), Kp(o), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Up()), e.memoizedState = a, a;
    }
    function hR(e, t, a) {
      var i = Ya();
      er(eh(i, Oi)), e(!0);
      var o = Rp.transition;
      Rp.transition = {};
      var s = Rp.transition;
      Rp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (er(i), Rp.transition = o, o === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && j("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function qg() {
      var e = vm(!1), t = e[0], a = e[1], i = hR.bind(null, a), o = ql();
      return o.memoizedState = i, [t, i];
    }
    function Xx() {
      var e = Bg(), t = e[0], a = Bi(), i = a.memoizedState;
      return [t, i];
    }
    function Jx() {
      var e = Vg(), t = e[0], a = Bi(), i = a.memoizedState;
      return [t, i];
    }
    var Zx = !1;
    function mR() {
      return Zx;
    }
    function Xg() {
      var e = ql(), t = $m(), a = t.identifierPrefix, i;
      if (Yr()) {
        var o = LT();
        i = ":" + a + "R" + o;
        var s = kp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = fR++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function wm() {
      var e = Bi(), t = e.memoizedState;
      return t;
    }
    function yR(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = $u(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (eC(e))
        tC(t, o);
      else {
        var s = jx(e, t, o, i);
        if (s !== null) {
          var f = Na();
          Dr(s, e, i, f), nC(s, t, i);
        }
      }
      rC(e, i);
    }
    function gR(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = $u(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (eC(e))
        tC(t, o);
      else {
        var s = e.alternate;
        if (e.lanes === he && (s === null || s.lanes === he)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var v;
            v = $e.current, $e.current = fl;
            try {
              var h = t.lastRenderedState, S = f(h, a);
              if (o.hasEagerState = !0, o.eagerState = S, xe(S, h)) {
                nR(e, t, o, i);
                return;
              }
            } catch {
            } finally {
              $e.current = v;
            }
          }
        }
        var C = jx(e, t, o, i);
        if (C !== null) {
          var L = Na();
          Dr(C, e, i, L), nC(C, t, i);
        }
      }
      rC(e, i);
    }
    function eC(e) {
      var t = e.alternate;
      return e === vn || t !== null && t === vn;
    }
    function tC(e, t) {
      _p = dm = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function nC(e, t, a) {
      if (Ad(a)) {
        var i = t.lanes;
        i = Ud(i, e.pendingLanes);
        var o = _t(i, a);
        t.lanes = o, rf(e, o);
      }
    }
    function rC(e, t, a) {
      ms(e, t);
    }
    var Tm = {
      readContext: mr,
      useCallback: ya,
      useContext: ya,
      useEffect: ya,
      useImperativeHandle: ya,
      useInsertionEffect: ya,
      useLayoutEffect: ya,
      useMemo: ya,
      useReducer: ya,
      useRef: ya,
      useState: ya,
      useDebugValue: ya,
      useDeferredValue: ya,
      useTransition: ya,
      useMutableSource: ya,
      useSyncExternalStore: ya,
      useId: ya,
      unstable_isNewReconciler: be
    }, aC = null, iC = null, lC = null, oC = null, Xl = null, fl = null, Rm = null;
    {
      var Jg = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, Et = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      aC = {
        readContext: function(e) {
          return mr(e);
        },
        useCallback: function(e, t) {
          return le = "useCallback", an(), Uf(t), Wg(e, t);
        },
        useContext: function(e) {
          return le = "useContext", an(), mr(e);
        },
        useEffect: function(e, t) {
          return le = "useEffect", an(), Uf(t), ym(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return le = "useImperativeHandle", an(), Uf(a), Qg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return le = "useInsertionEffect", an(), Uf(t), $g(e, t);
        },
        useLayoutEffect: function(e, t) {
          return le = "useLayoutEffect", an(), Uf(t), Yg(e, t);
        },
        useMemo: function(e, t) {
          le = "useMemo", an(), Uf(t);
          var a = $e.current;
          $e.current = Xl;
          try {
            return Gg(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          le = "useReducer", an();
          var i = $e.current;
          $e.current = Xl;
          try {
            return Ug(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return le = "useRef", an(), Ig(e);
        },
        useState: function(e) {
          le = "useState", an();
          var t = $e.current;
          $e.current = Xl;
          try {
            return vm(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return le = "useDebugValue", an(), void 0;
        },
        useDeferredValue: function(e) {
          return le = "useDeferredValue", an(), Kg(e);
        },
        useTransition: function() {
          return le = "useTransition", an(), qg();
        },
        useMutableSource: function(e, t, a) {
          return le = "useMutableSource", an(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return le = "useSyncExternalStore", an(), Hg(e, t, a);
        },
        useId: function() {
          return le = "useId", an(), Xg();
        },
        unstable_isNewReconciler: be
      }, iC = {
        readContext: function(e) {
          return mr(e);
        },
        useCallback: function(e, t) {
          return le = "useCallback", Ae(), Wg(e, t);
        },
        useContext: function(e) {
          return le = "useContext", Ae(), mr(e);
        },
        useEffect: function(e, t) {
          return le = "useEffect", Ae(), ym(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return le = "useImperativeHandle", Ae(), Qg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return le = "useInsertionEffect", Ae(), $g(e, t);
        },
        useLayoutEffect: function(e, t) {
          return le = "useLayoutEffect", Ae(), Yg(e, t);
        },
        useMemo: function(e, t) {
          le = "useMemo", Ae();
          var a = $e.current;
          $e.current = Xl;
          try {
            return Gg(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          le = "useReducer", Ae();
          var i = $e.current;
          $e.current = Xl;
          try {
            return Ug(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return le = "useRef", Ae(), Ig(e);
        },
        useState: function(e) {
          le = "useState", Ae();
          var t = $e.current;
          $e.current = Xl;
          try {
            return vm(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return le = "useDebugValue", Ae(), void 0;
        },
        useDeferredValue: function(e) {
          return le = "useDeferredValue", Ae(), Kg(e);
        },
        useTransition: function() {
          return le = "useTransition", Ae(), qg();
        },
        useMutableSource: function(e, t, a) {
          return le = "useMutableSource", Ae(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return le = "useSyncExternalStore", Ae(), Hg(e, t, a);
        },
        useId: function() {
          return le = "useId", Ae(), Xg();
        },
        unstable_isNewReconciler: be
      }, lC = {
        readContext: function(e) {
          return mr(e);
        },
        useCallback: function(e, t) {
          return le = "useCallback", Ae(), Cm(e, t);
        },
        useContext: function(e) {
          return le = "useContext", Ae(), mr(e);
        },
        useEffect: function(e, t) {
          return le = "useEffect", Ae(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return le = "useImperativeHandle", Ae(), Em(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return le = "useInsertionEffect", Ae(), gm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return le = "useLayoutEffect", Ae(), Sm(e, t);
        },
        useMemo: function(e, t) {
          le = "useMemo", Ae();
          var a = $e.current;
          $e.current = fl;
          try {
            return bm(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          le = "useReducer", Ae();
          var i = $e.current;
          $e.current = fl;
          try {
            return Fg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return le = "useRef", Ae(), hm();
        },
        useState: function(e) {
          le = "useState", Ae();
          var t = $e.current;
          $e.current = fl;
          try {
            return Bg(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return le = "useDebugValue", Ae(), xm();
        },
        useDeferredValue: function(e) {
          return le = "useDeferredValue", Ae(), Gx(e);
        },
        useTransition: function() {
          return le = "useTransition", Ae(), Xx();
        },
        useMutableSource: function(e, t, a) {
          return le = "useMutableSource", Ae(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return le = "useSyncExternalStore", Ae(), pm(e, t);
        },
        useId: function() {
          return le = "useId", Ae(), wm();
        },
        unstable_isNewReconciler: be
      }, oC = {
        readContext: function(e) {
          return mr(e);
        },
        useCallback: function(e, t) {
          return le = "useCallback", Ae(), Cm(e, t);
        },
        useContext: function(e) {
          return le = "useContext", Ae(), mr(e);
        },
        useEffect: function(e, t) {
          return le = "useEffect", Ae(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return le = "useImperativeHandle", Ae(), Em(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return le = "useInsertionEffect", Ae(), gm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return le = "useLayoutEffect", Ae(), Sm(e, t);
        },
        useMemo: function(e, t) {
          le = "useMemo", Ae();
          var a = $e.current;
          $e.current = Rm;
          try {
            return bm(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          le = "useReducer", Ae();
          var i = $e.current;
          $e.current = Rm;
          try {
            return Pg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return le = "useRef", Ae(), hm();
        },
        useState: function(e) {
          le = "useState", Ae();
          var t = $e.current;
          $e.current = Rm;
          try {
            return Vg(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return le = "useDebugValue", Ae(), xm();
        },
        useDeferredValue: function(e) {
          return le = "useDeferredValue", Ae(), Kx(e);
        },
        useTransition: function() {
          return le = "useTransition", Ae(), Jx();
        },
        useMutableSource: function(e, t, a) {
          return le = "useMutableSource", Ae(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return le = "useSyncExternalStore", Ae(), pm(e, t);
        },
        useId: function() {
          return le = "useId", Ae(), wm();
        },
        unstable_isNewReconciler: be
      }, Xl = {
        readContext: function(e) {
          return Jg(), mr(e);
        },
        useCallback: function(e, t) {
          return le = "useCallback", Et(), an(), Wg(e, t);
        },
        useContext: function(e) {
          return le = "useContext", Et(), an(), mr(e);
        },
        useEffect: function(e, t) {
          return le = "useEffect", Et(), an(), ym(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return le = "useImperativeHandle", Et(), an(), Qg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return le = "useInsertionEffect", Et(), an(), $g(e, t);
        },
        useLayoutEffect: function(e, t) {
          return le = "useLayoutEffect", Et(), an(), Yg(e, t);
        },
        useMemo: function(e, t) {
          le = "useMemo", Et(), an();
          var a = $e.current;
          $e.current = Xl;
          try {
            return Gg(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          le = "useReducer", Et(), an();
          var i = $e.current;
          $e.current = Xl;
          try {
            return Ug(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return le = "useRef", Et(), an(), Ig(e);
        },
        useState: function(e) {
          le = "useState", Et(), an();
          var t = $e.current;
          $e.current = Xl;
          try {
            return vm(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return le = "useDebugValue", Et(), an(), void 0;
        },
        useDeferredValue: function(e) {
          return le = "useDeferredValue", Et(), an(), Kg(e);
        },
        useTransition: function() {
          return le = "useTransition", Et(), an(), qg();
        },
        useMutableSource: function(e, t, a) {
          return le = "useMutableSource", Et(), an(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return le = "useSyncExternalStore", Et(), an(), Hg(e, t, a);
        },
        useId: function() {
          return le = "useId", Et(), an(), Xg();
        },
        unstable_isNewReconciler: be
      }, fl = {
        readContext: function(e) {
          return Jg(), mr(e);
        },
        useCallback: function(e, t) {
          return le = "useCallback", Et(), Ae(), Cm(e, t);
        },
        useContext: function(e) {
          return le = "useContext", Et(), Ae(), mr(e);
        },
        useEffect: function(e, t) {
          return le = "useEffect", Et(), Ae(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return le = "useImperativeHandle", Et(), Ae(), Em(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return le = "useInsertionEffect", Et(), Ae(), gm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return le = "useLayoutEffect", Et(), Ae(), Sm(e, t);
        },
        useMemo: function(e, t) {
          le = "useMemo", Et(), Ae();
          var a = $e.current;
          $e.current = fl;
          try {
            return bm(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          le = "useReducer", Et(), Ae();
          var i = $e.current;
          $e.current = fl;
          try {
            return Fg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return le = "useRef", Et(), Ae(), hm();
        },
        useState: function(e) {
          le = "useState", Et(), Ae();
          var t = $e.current;
          $e.current = fl;
          try {
            return Bg(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return le = "useDebugValue", Et(), Ae(), xm();
        },
        useDeferredValue: function(e) {
          return le = "useDeferredValue", Et(), Ae(), Gx(e);
        },
        useTransition: function() {
          return le = "useTransition", Et(), Ae(), Xx();
        },
        useMutableSource: function(e, t, a) {
          return le = "useMutableSource", Et(), Ae(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return le = "useSyncExternalStore", Et(), Ae(), pm(e, t);
        },
        useId: function() {
          return le = "useId", Et(), Ae(), wm();
        },
        unstable_isNewReconciler: be
      }, Rm = {
        readContext: function(e) {
          return Jg(), mr(e);
        },
        useCallback: function(e, t) {
          return le = "useCallback", Et(), Ae(), Cm(e, t);
        },
        useContext: function(e) {
          return le = "useContext", Et(), Ae(), mr(e);
        },
        useEffect: function(e, t) {
          return le = "useEffect", Et(), Ae(), Dp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return le = "useImperativeHandle", Et(), Ae(), Em(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return le = "useInsertionEffect", Et(), Ae(), gm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return le = "useLayoutEffect", Et(), Ae(), Sm(e, t);
        },
        useMemo: function(e, t) {
          le = "useMemo", Et(), Ae();
          var a = $e.current;
          $e.current = fl;
          try {
            return bm(e, t);
          } finally {
            $e.current = a;
          }
        },
        useReducer: function(e, t, a) {
          le = "useReducer", Et(), Ae();
          var i = $e.current;
          $e.current = fl;
          try {
            return Pg(e, t, a);
          } finally {
            $e.current = i;
          }
        },
        useRef: function(e) {
          return le = "useRef", Et(), Ae(), hm();
        },
        useState: function(e) {
          le = "useState", Et(), Ae();
          var t = $e.current;
          $e.current = fl;
          try {
            return Vg(e);
          } finally {
            $e.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return le = "useDebugValue", Et(), Ae(), xm();
        },
        useDeferredValue: function(e) {
          return le = "useDeferredValue", Et(), Ae(), Kx(e);
        },
        useTransition: function() {
          return le = "useTransition", Et(), Ae(), Jx();
        },
        useMutableSource: function(e, t, a) {
          return le = "useMutableSource", Et(), Ae(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return le = "useSyncExternalStore", Et(), Ae(), pm(e, t);
        },
        useId: function() {
          return le = "useId", Et(), Ae(), wm();
        },
        unstable_isNewReconciler: be
      };
    }
    var Hu = x.unstable_now, uC = 0, _m = -1, Op = -1, km = -1, Zg = !1, jm = !1;
    function sC() {
      return Zg;
    }
    function SR() {
      jm = !0;
    }
    function ER() {
      Zg = !1, jm = !1;
    }
    function xR() {
      Zg = jm, jm = !1;
    }
    function cC() {
      return uC;
    }
    function fC() {
      uC = Hu();
    }
    function eS(e) {
      Op = Hu(), e.actualStartTime < 0 && (e.actualStartTime = Hu());
    }
    function dC(e) {
      Op = -1;
    }
    function Nm(e, t) {
      if (Op >= 0) {
        var a = Hu() - Op;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Op = -1;
      }
    }
    function Jl(e) {
      if (_m >= 0) {
        var t = Hu() - _m;
        _m = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case F:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case ge:
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
            case F:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case ge:
              var o = a.stateNode;
              o !== null && (o.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function Zl() {
      _m = Hu();
    }
    function nS() {
      km = Hu();
    }
    function rS(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function dl(e, t) {
      if (e && e.defaultProps) {
        var a = kt({}, t), i = e.defaultProps;
        for (var o in i)
          a[o] === void 0 && (a[o] = i[o]);
        return a;
      }
      return t;
    }
    var aS = {}, iS, lS, oS, uS, sS, pC, Dm, cS, fS, dS, Lp;
    {
      iS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), oS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), cS = /* @__PURE__ */ new Set(), sS = /* @__PURE__ */ new Set(), fS = /* @__PURE__ */ new Set(), dS = /* @__PURE__ */ new Set(), Lp = /* @__PURE__ */ new Set();
      var vC = /* @__PURE__ */ new Set();
      Dm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          vC.has(a) || (vC.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, pC = function(e, t) {
        if (t === void 0) {
          var a = It(e) || "Component";
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
        if (e.mode & pn) {
          Mn(!0);
          try {
            s = a(i, o);
          } finally {
            Mn(!1);
          }
        }
        pC(t, s);
      }
      var f = s == null ? o : kt({}, o, s);
      if (e.memoizedState = f, e.lanes === he) {
        var v = e.updateQueue;
        v.baseState = f;
      }
    }
    var vS = {
      isMounted: Fv,
      enqueueSetState: function(e, t, a) {
        var i = hu(e), o = Na(), s = $u(i), f = Io(o, s);
        f.payload = t, a != null && (Dm(a, "setState"), f.callback = a);
        var v = zu(i, f, s);
        v !== null && (Dr(v, i, s, o), lm(v, i, s)), ms(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = hu(e), o = Na(), s = $u(i), f = Io(o, s);
        f.tag = Dx, f.payload = t, a != null && (Dm(a, "replaceState"), f.callback = a);
        var v = zu(i, f, s);
        v !== null && (Dr(v, i, s, o), lm(v, i, s)), ms(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = hu(e), i = Na(), o = $u(a), s = Io(i, o);
        s.tag = rm, t != null && (Dm(t, "forceUpdate"), s.callback = t);
        var f = zu(a, s, o);
        f !== null && (Dr(f, a, o, i), lm(f, a, o)), Ac(a, o);
      }
    };
    function hC(e, t, a, i, o, s, f) {
      var v = e.stateNode;
      if (typeof v.shouldComponentUpdate == "function") {
        var h = v.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & pn) {
            Mn(!0);
            try {
              h = v.shouldComponentUpdate(i, s, f);
            } finally {
              Mn(!1);
            }
          }
          h === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", It(t) || "Component");
        }
        return h;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !qe(a, i) || !qe(o, s) : !0;
    }
    function CR(e, t, a) {
      var i = e.stateNode;
      {
        var o = It(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", o) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", o)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", o), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", o), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", o), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", o), t.childContextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & pn) === it && (Lp.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), t.contextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & pn) === it && (Lp.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", o), t.contextType && t.contextTypes && !fS.has(t) && (fS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", o)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", o), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", It(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", o), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", o), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", o), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", o);
        var f = i.props !== a;
        i.props !== void 0 && f && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", o, o), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", o, o), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !oS.has(t) && (oS.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", It(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", o);
        var v = i.state;
        v && (typeof v != "object" || Nt(v)) && g("%s.state: must be set to an object or null", o), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", o);
      }
    }
    function mC(e, t) {
      t.updater = vS, e.stateNode = t, yo(t, e), t._reactInternalInstance = aS;
    }
    function yC(e, t, a) {
      var i = !1, o = vi, s = vi, f = t.contextType;
      if ("contextType" in t) {
        var v = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === T && f._context === void 0
        );
        if (!v && !dS.has(t)) {
          dS.add(t);
          var h = "";
          f === void 0 ? h = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? h = " However, it is set to a " + typeof f + "." : f.$$typeof === Qt ? h = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? h = " Did you accidentally pass the Context.Consumer instead?" : h = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", It(t) || "Component", h);
        }
      }
      if (typeof f == "object" && f !== null)
        s = mr(f);
      else {
        o = Tf(e, t, !0);
        var S = t.contextTypes;
        i = S != null, s = i ? Rf(e, o) : vi;
      }
      var C = new t(a, s);
      if (e.mode & pn) {
        Mn(!0);
        try {
          C = new t(a, s);
        } finally {
          Mn(!1);
        }
      }
      var L = e.memoizedState = C.state !== null && C.state !== void 0 ? C.state : null;
      mC(e, C);
      {
        if (typeof t.getDerivedStateFromProps == "function" && L === null) {
          var N = It(t) || "Component";
          lS.has(N) || (lS.add(N), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", N, C.state === null ? "null" : "undefined", N));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof C.getSnapshotBeforeUpdate == "function") {
          var $ = null, W = null, ee = null;
          if (typeof C.componentWillMount == "function" && C.componentWillMount.__suppressDeprecationWarning !== !0 ? $ = "componentWillMount" : typeof C.UNSAFE_componentWillMount == "function" && ($ = "UNSAFE_componentWillMount"), typeof C.componentWillReceiveProps == "function" && C.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? W = "componentWillReceiveProps" : typeof C.UNSAFE_componentWillReceiveProps == "function" && (W = "UNSAFE_componentWillReceiveProps"), typeof C.componentWillUpdate == "function" && C.componentWillUpdate.__suppressDeprecationWarning !== !0 ? ee = "componentWillUpdate" : typeof C.UNSAFE_componentWillUpdate == "function" && (ee = "UNSAFE_componentWillUpdate"), $ !== null || W !== null || ee !== null) {
            var He = It(t) || "Component", ot = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            uS.has(He) || (uS.add(He), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, He, ot, $ !== null ? `
  ` + $ : "", W !== null ? `
  ` + W : "", ee !== null ? `
  ` + ee : ""));
          }
        }
      }
      return i && lx(e, o, s), C;
    }
    function bR(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", yt(e) || "Component"), vS.enqueueReplaceState(t, t.state, null));
    }
    function gC(e, t, a, i) {
      var o = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== o) {
        {
          var s = yt(e) || "Component";
          iS.has(s) || (iS.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        vS.enqueueReplaceState(t, t.state, null);
      }
    }
    function hS(e, t, a, i) {
      CR(e, t, a);
      var o = e.stateNode;
      o.props = a, o.state = e.memoizedState, o.refs = {}, wg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        o.context = mr(s);
      else {
        var f = Tf(e, t, !0);
        o.context = Rf(e, f);
      }
      {
        if (o.state === a) {
          var v = It(t) || "Component";
          cS.has(v) || (cS.add(v), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", v));
        }
        e.mode & pn && sl.recordLegacyContextWarning(e, o), sl.recordUnsafeLifecycleWarnings(e, o);
      }
      o.state = e.memoizedState;
      var h = t.getDerivedStateFromProps;
      if (typeof h == "function" && (pS(e, t, h, a), o.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof o.getSnapshotBeforeUpdate != "function" && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (bR(e, o), om(e, a, o, i), o.state = e.memoizedState), typeof o.componentDidMount == "function") {
        var S = Pt;
        S |= Ji, (e.mode & qt) !== it && (S |= Dl), e.flags |= S;
      }
    }
    function wR(e, t, a, i) {
      var o = e.stateNode, s = e.memoizedProps;
      o.props = s;
      var f = o.context, v = t.contextType, h = vi;
      if (typeof v == "object" && v !== null)
        h = mr(v);
      else {
        var S = Tf(e, t, !0);
        h = Rf(e, S);
      }
      var C = t.getDerivedStateFromProps, L = typeof C == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      !L && (typeof o.UNSAFE_componentWillReceiveProps == "function" || typeof o.componentWillReceiveProps == "function") && (s !== a || f !== h) && gC(e, o, a, h), Lx();
      var N = e.memoizedState, $ = o.state = N;
      if (om(e, a, o, i), $ = e.memoizedState, s === a && N === $ && !Vh() && !um()) {
        if (typeof o.componentDidMount == "function") {
          var W = Pt;
          W |= Ji, (e.mode & qt) !== it && (W |= Dl), e.flags |= W;
        }
        return !1;
      }
      typeof C == "function" && (pS(e, t, C, a), $ = e.memoizedState);
      var ee = um() || hC(e, t, s, a, N, $, h);
      if (ee) {
        if (!L && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function") {
          var He = Pt;
          He |= Ji, (e.mode & qt) !== it && (He |= Dl), e.flags |= He;
        }
      } else {
        if (typeof o.componentDidMount == "function") {
          var ot = Pt;
          ot |= Ji, (e.mode & qt) !== it && (ot |= Dl), e.flags |= ot;
        }
        e.memoizedProps = a, e.memoizedState = $;
      }
      return o.props = a, o.state = $, o.context = h, ee;
    }
    function TR(e, t, a, i, o) {
      var s = t.stateNode;
      Ox(e, t);
      var f = t.memoizedProps, v = t.type === t.elementType ? f : dl(t.type, f);
      s.props = v;
      var h = t.pendingProps, S = s.context, C = a.contextType, L = vi;
      if (typeof C == "object" && C !== null)
        L = mr(C);
      else {
        var N = Tf(t, a, !0);
        L = Rf(t, N);
      }
      var $ = a.getDerivedStateFromProps, W = typeof $ == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !W && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== h || S !== L) && gC(t, s, i, L), Lx();
      var ee = t.memoizedState, He = s.state = ee;
      if (om(t, i, s, o), He = t.memoizedState, f === h && ee === He && !Vh() && !um() && !Be)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || ee !== e.memoizedState) && (t.flags |= Pt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || ee !== e.memoizedState) && (t.flags |= lr), !1;
      typeof $ == "function" && (pS(t, a, $, i), He = t.memoizedState);
      var ot = um() || hC(t, a, v, i, ee, He, L) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Be;
      return ot ? (!W && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, He, L), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, He, L)), typeof s.componentDidUpdate == "function" && (t.flags |= Pt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= lr)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || ee !== e.memoizedState) && (t.flags |= Pt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || ee !== e.memoizedState) && (t.flags |= lr), t.memoizedProps = i, t.memoizedState = He), s.props = i, s.state = He, s.context = L, ot;
    }
    function tc(e, t) {
      return {
        value: e,
        source: t,
        stack: Qi(t),
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
    function RR(e, t) {
      return !0;
    }
    function yS(e, t) {
      try {
        var a = RR(e, t);
        if (a === !1)
          return;
        var i = t.value, o = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === B)
            return;
          console.error(i);
        }
        var v = o ? yt(o) : null, h = v ? "The above error occurred in the <" + v + "> component:" : "The above error occurred in one of your React components:", S;
        if (e.tag === F)
          S = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var C = yt(e) || "Anonymous";
          S = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + C + ".");
        }
        var L = h + `
` + f + `

` + ("" + S);
        console.error(L);
      } catch (N) {
        setTimeout(function() {
          throw N;
        });
      }
    }
    var _R = typeof WeakMap == "function" ? WeakMap : Map;
    function SC(e, t, a) {
      var i = Io(yn, a);
      i.tag = Cg, i.payload = {
        element: null
      };
      var o = t.value;
      return i.callback = function() {
        Sk(o), yS(e, t);
      }, i;
    }
    function gS(e, t, a) {
      var i = Io(yn, a);
      i.tag = Cg;
      var o = e.type.getDerivedStateFromError;
      if (typeof o == "function") {
        var s = t.value;
        i.payload = function() {
          return o(s);
        }, i.callback = function() {
          Nb(e), yS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        Nb(e), yS(e, t), typeof o != "function" && yk(this);
        var h = t.value, S = t.stack;
        this.componentDidCatch(h, {
          componentStack: S !== null ? S : ""
        }), typeof o != "function" && (fa(e.lanes, ft) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", yt(e) || "Unknown"));
      }), i;
    }
    function EC(e, t, a) {
      var i = e.pingCache, o;
      if (i === null ? (i = e.pingCache = new _R(), o = /* @__PURE__ */ new Set(), i.set(t, o)) : (o = i.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), i.set(t, o))), !o.has(a)) {
        o.add(a);
        var s = Ek.bind(null, e, t, a);
        sa && qp(e, a), t.then(s, s);
      }
    }
    function kR(e, t, a, i) {
      var o = e.updateQueue;
      if (o === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        o.add(a);
    }
    function jR(e, t) {
      var a = e.tag;
      if ((e.mode & Ot) === it && (a === D || a === ce || a === G)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function xC(e) {
      var t = e;
      do {
        if (t.tag === fe && sR(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function CC(e, t, a, i, o) {
      if ((e.mode & Ot) === it) {
        if (e === t)
          e.flags |= dr;
        else {
          if (e.flags |= tt, a.flags |= _c, a.flags &= -52805, a.tag === B) {
            var s = a.alternate;
            if (s === null)
              a.tag = ve;
            else {
              var f = Io(yn, ft);
              f.tag = rm, zu(a, f, ft);
            }
          }
          a.lanes = _t(a.lanes, ft);
        }
        return e;
      }
      return e.flags |= dr, e.lanes = o, e;
    }
    function NR(e, t, a, i, o) {
      if (a.flags |= cs, sa && qp(e, o), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        jR(a), Yr() && a.mode & Ot && px();
        var f = xC(t);
        if (f !== null) {
          f.flags &= ~Lr, CC(f, t, a, e, o), f.mode & Ot && EC(e, s, o), kR(f, e, s);
          return;
        } else {
          if (!Qv(o)) {
            EC(e, s, o), XS();
            return;
          }
          var v = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = v;
        }
      } else if (Yr() && a.mode & Ot) {
        px();
        var h = xC(t);
        if (h !== null) {
          (h.flags & dr) === at && (h.flags |= Lr), CC(h, t, a, e, o), cg(tc(i, a));
          return;
        }
      }
      i = tc(i, a), sk(i);
      var S = t;
      do {
        switch (S.tag) {
          case F: {
            var C = i;
            S.flags |= dr;
            var L = Ts(o);
            S.lanes = _t(S.lanes, L);
            var N = SC(S, C, L);
            Tg(S, N);
            return;
          }
          case B:
            var $ = i, W = S.type, ee = S.stateNode;
            if ((S.flags & tt) === at && (typeof W.getDerivedStateFromError == "function" || ee !== null && typeof ee.componentDidCatch == "function" && !xb(ee))) {
              S.flags |= dr;
              var He = Ts(o);
              S.lanes = _t(S.lanes, He);
              var ot = gS(S, $, He);
              Tg(S, ot);
              return;
            }
            break;
        }
        S = S.return;
      } while (S !== null);
    }
    function DR() {
      return null;
    }
    var Mp = b.ReactCurrentOwner, pl = !1, SS, Ap, ES, xS, CS, nc, bS, Om, zp;
    SS = {}, Ap = {}, ES = {}, xS = {}, CS = {}, nc = !1, bS = {}, Om = {}, zp = {};
    function ka(e, t, a, i) {
      e === null ? t.child = Tx(t, null, a, i) : t.child = Nf(t, e.child, a, i);
    }
    function OR(e, t, a, i) {
      t.child = Nf(t, e.child, null, i), t.child = Nf(t, null, a, i);
    }
    function bC(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && ol(
          s,
          i,
          // Resolved props
          "prop",
          It(a)
        );
      }
      var f = a.render, v = t.ref, h, S;
      Of(t, o), wa(t);
      {
        if (Mp.current = t, ir(!0), h = Ff(e, t, f, i, v, o), S = Pf(), t.mode & pn) {
          Mn(!0);
          try {
            h = Ff(e, t, f, i, v, o), S = Pf();
          } finally {
            Mn(!1);
          }
        }
        ir(!1);
      }
      return Ta(), e !== null && !pl ? (Px(e, t, o), $o(e, t, o)) : (Yr() && S && ag(t), t.flags |= si, ka(e, t, h, o), t.child);
    }
    function wC(e, t, a, i, o) {
      if (e === null) {
        var s = a.type;
        if (Uk(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Wf(s), t.tag = G, t.type = f, RS(t, s), TC(e, t, f, i, o);
        }
        {
          var v = s.propTypes;
          if (v && ol(
            v,
            i,
            // Resolved props
            "prop",
            It(s)
          ), a.defaultProps !== void 0) {
            var h = It(s) || "Unknown";
            zp[h] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", h), zp[h] = !0);
          }
        }
        var S = uE(a.type, null, i, t, t.mode, o);
        return S.ref = t.ref, S.return = t, t.child = S, S;
      }
      {
        var C = a.type, L = C.propTypes;
        L && ol(
          L,
          i,
          // Resolved props
          "prop",
          It(C)
        );
      }
      var N = e.child, $ = OS(e, o);
      if (!$) {
        var W = N.memoizedProps, ee = a.compare;
        if (ee = ee !== null ? ee : qe, ee(W, i) && e.ref === t.ref)
          return $o(e, t, o);
      }
      t.flags |= si;
      var He = oc(N, i);
      return He.ref = t.ref, He.return = t, t.child = He, He;
    }
    function TC(e, t, a, i, o) {
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
          S && ol(
            S,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            It(s)
          );
        }
      }
      if (e !== null) {
        var C = e.memoizedProps;
        if (qe(C, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (pl = !1, t.pendingProps = i = C, OS(e, o))
            (e.flags & _c) !== at && (pl = !0);
          else return t.lanes = e.lanes, $o(e, t, o);
      }
      return wS(e, t, a, i, o);
    }
    function RC(e, t, a) {
      var i = t.pendingProps, o = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || Re)
        if ((t.mode & Ot) === it) {
          var f = {
            baseLanes: he,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Ym(t, a);
        } else if (fa(a, ca)) {
          var L = {
            baseLanes: he,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = L;
          var N = s !== null ? s.baseLanes : a;
          Ym(t, N);
        } else {
          var v = null, h;
          if (s !== null) {
            var S = s.baseLanes;
            h = _t(S, a);
          } else
            h = a;
          t.lanes = t.childLanes = ca;
          var C = {
            baseLanes: h,
            cachePool: v,
            transitions: null
          };
          return t.memoizedState = C, t.updateQueue = null, Ym(t, h), null;
        }
      else {
        var $;
        s !== null ? ($ = _t(s.baseLanes, a), t.memoizedState = null) : $ = a, Ym(t, $);
      }
      return ka(e, t, o, a), t.child;
    }
    function LR(e, t, a) {
      var i = t.pendingProps;
      return ka(e, t, i, a), t.child;
    }
    function MR(e, t, a) {
      var i = t.pendingProps.children;
      return ka(e, t, i, a), t.child;
    }
    function AR(e, t, a) {
      {
        t.flags |= Pt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var o = t.pendingProps, s = o.children;
      return ka(e, t, s, a), t.child;
    }
    function _C(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Fn, t.flags |= yu);
    }
    function wS(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && ol(
          s,
          i,
          // Resolved props
          "prop",
          It(a)
        );
      }
      var f;
      {
        var v = Tf(t, a, !0);
        f = Rf(t, v);
      }
      var h, S;
      Of(t, o), wa(t);
      {
        if (Mp.current = t, ir(!0), h = Ff(e, t, a, i, f, o), S = Pf(), t.mode & pn) {
          Mn(!0);
          try {
            h = Ff(e, t, a, i, f, o), S = Pf();
          } finally {
            Mn(!1);
          }
        }
        ir(!1);
      }
      return Ta(), e !== null && !pl ? (Px(e, t, o), $o(e, t, o)) : (Yr() && S && ag(t), t.flags |= si, ka(e, t, h, o), t.child);
    }
    function kC(e, t, a, i, o) {
      {
        switch (Jk(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, v = new f(t.memoizedProps, s.context), h = v.state;
            s.updater.enqueueSetState(s, h, null);
            break;
          }
          case !0: {
            t.flags |= tt, t.flags |= dr;
            var S = new Error("Simulated error coming from DevTools"), C = Ts(o);
            t.lanes = _t(t.lanes, C);
            var L = gS(t, tc(S, t), C);
            Tg(t, L);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var N = a.propTypes;
          N && ol(
            N,
            i,
            // Resolved props
            "prop",
            It(a)
          );
        }
      }
      var $;
      Gl(a) ? ($ = !0, $h(t)) : $ = !1, Of(t, o);
      var W = t.stateNode, ee;
      W === null ? (Mm(e, t), yC(t, a, i), hS(t, a, i, o), ee = !0) : e === null ? ee = wR(t, a, i, o) : ee = TR(e, t, a, i, o);
      var He = TS(e, t, a, ee, $, o);
      {
        var ot = t.stateNode;
        ee && ot.props !== i && (nc || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", yt(t) || "a component"), nc = !0);
      }
      return He;
    }
    function TS(e, t, a, i, o, s) {
      _C(e, t);
      var f = (t.flags & tt) !== at;
      if (!i && !f)
        return o && sx(t, a, !1), $o(e, t, s);
      var v = t.stateNode;
      Mp.current = t;
      var h;
      if (f && typeof a.getDerivedStateFromError != "function")
        h = null, dC();
      else {
        wa(t);
        {
          if (ir(!0), h = v.render(), t.mode & pn) {
            Mn(!0);
            try {
              v.render();
            } finally {
              Mn(!1);
            }
          }
          ir(!1);
        }
        Ta();
      }
      return t.flags |= si, e !== null && f ? OR(e, t, h, s) : ka(e, t, h, s), t.memoizedState = v.state, o && sx(t, a, !0), t.child;
    }
    function jC(e) {
      var t = e.stateNode;
      t.pendingContext ? ox(e, t.pendingContext, t.pendingContext !== t.context) : t.context && ox(e, t.context, !1), Rg(e, t.containerInfo);
    }
    function zR(e, t, a) {
      if (jC(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, o = t.memoizedState, s = o.element;
      Ox(e, t), om(t, i, null, a);
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
        if (S.baseState = h, t.memoizedState = h, t.flags & Lr) {
          var C = tc(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return NC(e, t, v, a, C);
        } else if (v !== s) {
          var L = tc(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return NC(e, t, v, a, L);
        } else {
          PT(t);
          var N = Tx(t, null, v, a);
          t.child = N;
          for (var $ = N; $; )
            $.flags = $.flags & ~Ln | la, $ = $.sibling;
        }
      } else {
        if (jf(), v === s)
          return $o(e, t, a);
        ka(e, t, v, a);
      }
      return t.child;
    }
    function NC(e, t, a, i, o) {
      return jf(), cg(o), t.flags |= Lr, ka(e, t, a, i), t.child;
    }
    function UR(e, t, a) {
      zx(t), e === null && sg(t);
      var i = t.type, o = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = o.children, v = $y(i, o);
      return v ? f = null : s !== null && $y(i, s) && (t.flags |= Pa), _C(e, t), ka(e, t, f, a), t.child;
    }
    function FR(e, t) {
      return e === null && sg(t), null;
    }
    function PR(e, t, a, i) {
      Mm(e, t);
      var o = t.pendingProps, s = a, f = s._payload, v = s._init, h = v(f);
      t.type = h;
      var S = t.tag = Fk(h), C = dl(h, o), L;
      switch (S) {
        case D:
          return RS(t, h), t.type = h = Wf(h), L = wS(null, t, h, C, i), L;
        case B:
          return t.type = h = nE(h), L = kC(null, t, h, C, i), L;
        case ce:
          return t.type = h = rE(h), L = bC(null, t, h, C, i), L;
        case ue: {
          if (t.type !== t.elementType) {
            var N = h.propTypes;
            N && ol(
              N,
              C,
              // Resolved for outer only
              "prop",
              It(h)
            );
          }
          return L = wC(
            null,
            t,
            h,
            dl(h.type, C),
            // The inner type can have defaults too
            i
          ), L;
        }
      }
      var $ = "";
      throw h !== null && typeof h == "object" && h.$$typeof === ht && ($ = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + h + ". " + ("Lazy element type must resolve to a class or function." + $));
    }
    function HR(e, t, a, i, o) {
      Mm(e, t), t.tag = B;
      var s;
      return Gl(a) ? (s = !0, $h(t)) : s = !1, Of(t, o), yC(t, a, i), hS(t, a, i, o), TS(null, t, a, !0, s, o);
    }
    function BR(e, t, a, i) {
      Mm(e, t);
      var o = t.pendingProps, s;
      {
        var f = Tf(t, a, !1);
        s = Rf(t, f);
      }
      Of(t, i);
      var v, h;
      wa(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var S = It(a) || "Unknown";
          SS[S] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", S, S), SS[S] = !0);
        }
        t.mode & pn && sl.recordLegacyContextWarning(t, null), ir(!0), Mp.current = t, v = Ff(null, t, a, o, s, i), h = Pf(), ir(!1);
      }
      if (Ta(), t.flags |= si, typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0) {
        var C = It(a) || "Unknown";
        Ap[C] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", C, C, C), Ap[C] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof v == "object" && v !== null && typeof v.render == "function" && v.$$typeof === void 0
      ) {
        {
          var L = It(a) || "Unknown";
          Ap[L] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", L, L, L), Ap[L] = !0);
        }
        t.tag = B, t.memoizedState = null, t.updateQueue = null;
        var N = !1;
        return Gl(a) ? (N = !0, $h(t)) : N = !1, t.memoizedState = v.state !== null && v.state !== void 0 ? v.state : null, wg(t), mC(t, v), hS(t, a, o, i), TS(null, t, a, !0, N, i);
      } else {
        if (t.tag = D, t.mode & pn) {
          Mn(!0);
          try {
            v = Ff(null, t, a, o, s, i), h = Pf();
          } finally {
            Mn(!1);
          }
        }
        return Yr() && h && ag(t), ka(null, t, v, i), RS(t, a), t.child;
      }
    }
    function RS(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Fr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var o = i || "", s = e._debugSource;
          s && (o = s.fileName + ":" + s.lineNumber), CS[o] || (CS[o] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = It(t) || "Unknown";
          zp[f] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), zp[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var v = It(t) || "Unknown";
          xS[v] || (g("%s: Function components do not support getDerivedStateFromProps.", v), xS[v] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var h = It(t) || "Unknown";
          ES[h] || (g("%s: Function components do not support contextType.", h), ES[h] = !0);
        }
      }
    }
    var _S = {
      dehydrated: null,
      treeContext: null,
      retryLane: Wt
    };
    function kS(e) {
      return {
        baseLanes: e,
        cachePool: DR(),
        transitions: null
      };
    }
    function VR(e, t) {
      var a = null;
      return {
        baseLanes: _t(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function IR(e, t, a, i) {
      if (t !== null) {
        var o = t.memoizedState;
        if (o === null)
          return !1;
      }
      return jg(e, Tp);
    }
    function $R(e, t) {
      return Rs(e.childLanes, t);
    }
    function DC(e, t, a) {
      var i = t.pendingProps;
      Zk(t) && (t.flags |= tt);
      var o = cl.current, s = !1, f = (t.flags & tt) !== at;
      if (f || IR(o, e) ? (s = !0, t.flags &= ~tt) : (e === null || e.memoizedState !== null) && (o = uR(o, Fx)), o = Mf(o), Fu(t, o), e === null) {
        sg(t);
        var v = t.memoizedState;
        if (v !== null) {
          var h = v.dehydrated;
          if (h !== null)
            return KR(t, h);
        }
        var S = i.children, C = i.fallback;
        if (s) {
          var L = YR(t, S, C, a), N = t.child;
          return N.memoizedState = kS(a), t.memoizedState = _S, L;
        } else
          return jS(t, S);
      } else {
        var $ = e.memoizedState;
        if ($ !== null) {
          var W = $.dehydrated;
          if (W !== null)
            return qR(e, t, f, i, W, $, a);
        }
        if (s) {
          var ee = i.fallback, He = i.children, ot = WR(e, t, He, ee, a), et = t.child, Vt = e.child.memoizedState;
          return et.memoizedState = Vt === null ? kS(a) : VR(Vt, a), et.childLanes = $R(e, a), t.memoizedState = _S, ot;
        } else {
          var zt = i.children, P = QR(e, t, zt, a);
          return t.memoizedState = null, P;
        }
      }
    }
    function jS(e, t, a) {
      var i = e.mode, o = {
        mode: "visible",
        children: t
      }, s = NS(o, i);
      return s.return = e, e.child = s, s;
    }
    function YR(e, t, a, i) {
      var o = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, v, h;
      return (o & Ot) === it && s !== null ? (v = s, v.childLanes = he, v.pendingProps = f, e.mode & Kt && (v.actualDuration = 0, v.actualStartTime = -1, v.selfBaseDuration = 0, v.treeBaseDuration = 0), h = Qu(a, o, i, null)) : (v = NS(f, o), h = Qu(a, o, i, null)), v.return = e, h.return = e, v.sibling = h, e.child = v, h;
    }
    function NS(e, t, a) {
      return Ob(e, t, he, null);
    }
    function OC(e, t) {
      return oc(e, t);
    }
    function QR(e, t, a, i) {
      var o = e.child, s = o.sibling, f = OC(o, {
        mode: "visible",
        children: a
      });
      if ((t.mode & Ot) === it && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var v = t.deletions;
        v === null ? (t.deletions = [s], t.flags |= Fa) : v.push(s);
      }
      return t.child = f, f;
    }
    function WR(e, t, a, i, o) {
      var s = t.mode, f = e.child, v = f.sibling, h = {
        mode: "hidden",
        children: a
      }, S;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & Ot) === it && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var C = t.child;
        S = C, S.childLanes = he, S.pendingProps = h, t.mode & Kt && (S.actualDuration = 0, S.actualStartTime = -1, S.selfBaseDuration = f.selfBaseDuration, S.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        S = OC(f, h), S.subtreeFlags = f.subtreeFlags & Xn;
      var L;
      return v !== null ? L = oc(v, i) : (L = Qu(i, s, o, null), L.flags |= Ln), L.return = t, S.return = t, S.sibling = L, t.child = S, L;
    }
    function Lm(e, t, a, i) {
      i !== null && cg(i), Nf(t, e.child, null, a);
      var o = t.pendingProps, s = o.children, f = jS(t, s);
      return f.flags |= Ln, t.memoizedState = null, f;
    }
    function GR(e, t, a, i, o) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, v = NS(f, s), h = Qu(i, s, o, null);
      return h.flags |= Ln, v.return = t, h.return = t, v.sibling = h, t.child = v, (t.mode & Ot) !== it && Nf(t, e.child, null, o), h;
    }
    function KR(e, t, a) {
      return (e.mode & Ot) === it ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = ft) : Gy(t) ? e.lanes = Mr : e.lanes = ca, null;
    }
    function qR(e, t, a, i, o, s, f) {
      if (a)
        if (t.flags & Lr) {
          t.flags &= ~Lr;
          var P = mS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Lm(e, t, f, P);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= tt, null;
          var te = i.children, H = i.fallback, ke = GR(e, t, te, H, f), Qe = t.child;
          return Qe.memoizedState = kS(f), t.memoizedState = _S, ke;
        }
      else {
        if (UT(), (t.mode & Ot) === it)
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
            var C = eT(o);
            v = C.digest, h = C.message, S = C.stack;
          }
          var L;
          h ? L = new Error(h) : L = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var N = mS(L, v, S);
          return Lm(e, t, f, N);
        }
        var $ = fa(f, e.childLanes);
        if (pl || $) {
          var W = $m();
          if (W !== null) {
            var ee = Pd(W, f);
            if (ee !== Wt && ee !== s.retryLane) {
              s.retryLane = ee;
              var He = yn;
              Ga(e, ee), Dr(W, e, ee, He);
            }
          }
          XS();
          var ot = mS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Lm(e, t, f, ot);
        } else if (tx(o)) {
          t.flags |= tt, t.child = e.child;
          var et = xk.bind(null, e);
          return tT(o, et), null;
        } else {
          HT(t, o, s.treeContext);
          var Vt = i.children, zt = jS(t, Vt);
          return zt.flags |= la, zt;
        }
      }
    }
    function LC(e, t, a) {
      e.lanes = _t(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = _t(i.lanes, t)), Eg(e.return, t, a);
    }
    function XR(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === fe) {
          var o = i.memoizedState;
          o !== null && LC(i, a, e);
        } else if (i.tag === Le)
          LC(i, a, e);
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
    function JR(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && fm(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function ZR(e) {
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
    function e_(e, t) {
      e !== void 0 && !Om[e] && (e !== "collapsed" && e !== "hidden" ? (Om[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (Om[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function MC(e, t) {
      {
        var a = Nt(e), i = !a && typeof Tt(e) == "function";
        if (a || i) {
          var o = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", o, t, o), !1;
        }
      }
      return !0;
    }
    function t_(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (Nt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!MC(e[a], a))
              return;
        } else {
          var i = Tt(e);
          if (typeof i == "function") {
            var o = i.call(e);
            if (o)
              for (var s = o.next(), f = 0; !s.done; s = o.next()) {
                if (!MC(s.value, f))
                  return;
                f++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function DS(e, t, a, i, o) {
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
    function AC(e, t, a) {
      var i = t.pendingProps, o = i.revealOrder, s = i.tail, f = i.children;
      ZR(o), e_(s, o), t_(f, o), ka(e, t, f, a);
      var v = cl.current, h = jg(v, Tp);
      if (h)
        v = Ng(v, Tp), t.flags |= tt;
      else {
        var S = e !== null && (e.flags & tt) !== at;
        S && XR(t, t.child, a), v = Mf(v);
      }
      if (Fu(t, v), (t.mode & Ot) === it)
        t.memoizedState = null;
      else
        switch (o) {
          case "forwards": {
            var C = JR(t.child), L;
            C === null ? (L = t.child, t.child = null) : (L = C.sibling, C.sibling = null), DS(
              t,
              !1,
              // isBackwards
              L,
              C,
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
              var ee = $.sibling;
              $.sibling = N, N = $, $ = ee;
            }
            DS(
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
            DS(
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
    function n_(e, t, a) {
      Rg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Nf(t, null, i, a) : ka(e, t, i, a), t.child;
    }
    var zC = !1;
    function r_(e, t, a) {
      var i = t.type, o = i._context, s = t.pendingProps, f = t.memoizedProps, v = s.value;
      {
        "value" in s || zC || (zC = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var h = t.type.propTypes;
        h && ol(h, s, "prop", "Context.Provider");
      }
      if (kx(t, o, v), f !== null) {
        var S = f.value;
        if (xe(S, v)) {
          if (f.children === s.children && !Vh())
            return $o(e, t, a);
        } else
          ZT(t, o, a);
      }
      var C = s.children;
      return ka(e, t, C, a), t.child;
    }
    var UC = !1;
    function a_(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (UC || (UC = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var o = t.pendingProps, s = o.children;
      typeof s != "function" && g("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Of(t, a);
      var f = mr(i);
      wa(t);
      var v;
      return Mp.current = t, ir(!0), v = s(f), ir(!1), Ta(), t.flags |= si, ka(e, t, v, a), t.child;
    }
    function Up() {
      pl = !0;
    }
    function Mm(e, t) {
      (t.mode & Ot) === it && e !== null && (e.alternate = null, t.alternate = null, t.flags |= Ln);
    }
    function $o(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), dC(), Kp(t.lanes), fa(a, t.childLanes) ? (XT(e, t), t.child) : null;
    }
    function i_(e, t, a) {
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
        return s === null ? (i.deletions = [e], i.flags |= Fa) : s.push(e), a.flags |= Ln, a;
      }
    }
    function OS(e, t) {
      var a = e.lanes;
      return !!fa(a, t);
    }
    function l_(e, t, a) {
      switch (t.tag) {
        case F:
          jC(t), t.stateNode, jf();
          break;
        case ne:
          zx(t);
          break;
        case B: {
          var i = t.type;
          Gl(i) && $h(t);
          break;
        }
        case I:
          Rg(t, t.stateNode.containerInfo);
          break;
        case se: {
          var o = t.memoizedProps.value, s = t.type._context;
          kx(t, s, o);
          break;
        }
        case ge:
          {
            var f = fa(a, t.childLanes);
            f && (t.flags |= Pt);
            {
              var v = t.stateNode;
              v.effectDuration = 0, v.passiveEffectDuration = 0;
            }
          }
          break;
        case fe: {
          var h = t.memoizedState;
          if (h !== null) {
            if (h.dehydrated !== null)
              return Fu(t, Mf(cl.current)), t.flags |= tt, null;
            var S = t.child, C = S.childLanes;
            if (fa(a, C))
              return DC(e, t, a);
            Fu(t, Mf(cl.current));
            var L = $o(e, t, a);
            return L !== null ? L.sibling : null;
          } else
            Fu(t, Mf(cl.current));
          break;
        }
        case Le: {
          var N = (e.flags & tt) !== at, $ = fa(a, t.childLanes);
          if (N) {
            if ($)
              return AC(e, t, a);
            t.flags |= tt;
          }
          var W = t.memoizedState;
          if (W !== null && (W.rendering = null, W.tail = null, W.lastEffect = null), Fu(t, cl.current), $)
            break;
          return null;
        }
        case ae:
        case Fe:
          return t.lanes = he, RC(e, t, a);
      }
      return $o(e, t, a);
    }
    function FC(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return i_(e, t, uE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, o = t.pendingProps;
        if (i !== o || Vh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          pl = !0;
        else {
          var s = OS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & tt) === at)
            return pl = !1, l_(e, t, a);
          (e.flags & _c) !== at ? pl = !0 : pl = !1;
        }
      } else if (pl = !1, Yr() && DT(t)) {
        var f = t.index, v = OT();
        dx(t, v, f);
      }
      switch (t.lanes = he, t.tag) {
        case oe:
          return BR(e, t, t.type, a);
        case Ce: {
          var h = t.elementType;
          return PR(e, t, h, a);
        }
        case D: {
          var S = t.type, C = t.pendingProps, L = t.elementType === S ? C : dl(S, C);
          return wS(e, t, S, L, a);
        }
        case B: {
          var N = t.type, $ = t.pendingProps, W = t.elementType === N ? $ : dl(N, $);
          return kC(e, t, N, W, a);
        }
        case F:
          return zR(e, t, a);
        case ne:
          return UR(e, t, a);
        case ie:
          return FR(e, t);
        case fe:
          return DC(e, t, a);
        case I:
          return n_(e, t, a);
        case ce: {
          var ee = t.type, He = t.pendingProps, ot = t.elementType === ee ? He : dl(ee, He);
          return bC(e, t, ee, ot, a);
        }
        case Z:
          return LR(e, t, a);
        case me:
          return MR(e, t, a);
        case ge:
          return AR(e, t, a);
        case se:
          return r_(e, t, a);
        case Ue:
          return a_(e, t, a);
        case ue: {
          var et = t.type, Vt = t.pendingProps, zt = dl(et, Vt);
          if (t.type !== t.elementType) {
            var P = et.propTypes;
            P && ol(
              P,
              zt,
              // Resolved for outer only
              "prop",
              It(et)
            );
          }
          return zt = dl(et.type, zt), wC(e, t, et, zt, a);
        }
        case G:
          return TC(e, t, t.type, t.pendingProps, a);
        case ve: {
          var te = t.type, H = t.pendingProps, ke = t.elementType === te ? H : dl(te, H);
          return HR(e, t, te, ke, a);
        }
        case Le:
          return AC(e, t, a);
        case Ge:
          break;
        case ae:
          return RC(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Hf(e) {
      e.flags |= Pt;
    }
    function PC(e) {
      e.flags |= Fn, e.flags |= yu;
    }
    var HC, LS, BC, VC;
    HC = function(e, t, a, i) {
      for (var o = t.child; o !== null; ) {
        if (o.tag === ne || o.tag === ie)
          k0(e, o.stateNode);
        else if (o.tag !== I) {
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
    }, BC = function(e, t, a, i, o) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, v = _g(), h = N0(f, a, s, i, o, v);
        t.updateQueue = h, h && Hf(t);
      }
    }, VC = function(e, t, a, i) {
      a !== i && Hf(t);
    };
    function Fp(e, t) {
      if (!Yr())
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
    function Wr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = he, i = at;
      if (t) {
        if ((e.mode & Kt) !== it) {
          for (var h = e.selfBaseDuration, S = e.child; S !== null; )
            a = _t(a, _t(S.lanes, S.childLanes)), i |= S.subtreeFlags & Xn, i |= S.flags & Xn, h += S.treeBaseDuration, S = S.sibling;
          e.treeBaseDuration = h;
        } else
          for (var C = e.child; C !== null; )
            a = _t(a, _t(C.lanes, C.childLanes)), i |= C.subtreeFlags & Xn, i |= C.flags & Xn, C.return = e, C = C.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Kt) !== it) {
          for (var o = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = _t(a, _t(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, o += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = o, e.treeBaseDuration = s;
        } else
          for (var v = e.child; v !== null; )
            a = _t(a, _t(v.lanes, v.childLanes)), i |= v.subtreeFlags, i |= v.flags, v.return = e, v = v.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function o_(e, t, a) {
      if (YT() && (t.mode & Ot) !== it && (t.flags & tt) === at)
        return Sx(t), jf(), t.flags |= Lr | cs | dr, !1;
      var i = Kh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (IT(t), Wr(t), (t.mode & Kt) !== it) {
            var o = a !== null;
            if (o) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (jf(), (t.flags & tt) === at && (t.memoizedState = null), t.flags |= Pt, Wr(t), (t.mode & Kt) !== it) {
            var f = a !== null;
            if (f) {
              var v = t.child;
              v !== null && (t.treeBaseDuration -= v.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return Ex(), !0;
    }
    function IC(e, t, a) {
      var i = t.pendingProps;
      switch (ig(t), t.tag) {
        case oe:
        case Ce:
        case G:
        case D:
        case ce:
        case Z:
        case me:
        case ge:
        case Ue:
        case ue:
          return Wr(t), null;
        case B: {
          var o = t.type;
          return Gl(o) && Ih(t), Wr(t), null;
        }
        case F: {
          var s = t.stateNode;
          if (Lf(t), tg(t), Og(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Kh(t);
            if (f)
              Hf(t);
            else if (e !== null) {
              var v = e.memoizedState;
              // Check if this is a client root
              (!v.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Lr) !== at) && (t.flags |= lr, Ex());
            }
          }
          return LS(e, t), Wr(t), null;
        }
        case ne: {
          kg(t);
          var h = Ax(), S = t.type;
          if (e !== null && t.stateNode != null)
            BC(e, t, S, i, h), e.ref !== t.ref && PC(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Wr(t), null;
            }
            var C = _g(), L = Kh(t);
            if (L)
              BT(t, h, C) && Hf(t);
            else {
              var N = _0(S, i, h, C, t);
              HC(N, t, !1, !1), t.stateNode = N, j0(N, S, i, h) && Hf(t);
            }
            t.ref !== null && PC(t);
          }
          return Wr(t), null;
        }
        case ie: {
          var $ = i;
          if (e && t.stateNode != null) {
            var W = e.memoizedProps;
            VC(e, t, W, $);
          } else {
            if (typeof $ != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var ee = Ax(), He = _g(), ot = Kh(t);
            ot ? VT(t) && Hf(t) : t.stateNode = D0($, ee, He, t);
          }
          return Wr(t), null;
        }
        case fe: {
          Af(t);
          var et = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Vt = o_(e, t, et);
            if (!Vt)
              return t.flags & dr ? t : null;
          }
          if ((t.flags & tt) !== at)
            return t.lanes = a, (t.mode & Kt) !== it && rS(t), t;
          var zt = et !== null, P = e !== null && e.memoizedState !== null;
          if (zt !== P && zt) {
            var te = t.child;
            if (te.flags |= qn, (t.mode & Ot) !== it) {
              var H = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              H || jg(cl.current, Fx) ? uk() : XS();
            }
          }
          var ke = t.updateQueue;
          if (ke !== null && (t.flags |= Pt), Wr(t), (t.mode & Kt) !== it && zt) {
            var Qe = t.child;
            Qe !== null && (t.treeBaseDuration -= Qe.treeBaseDuration);
          }
          return null;
        }
        case I:
          return Lf(t), LS(e, t), e === null && wT(t.stateNode.containerInfo), Wr(t), null;
        case se:
          var Ve = t.type._context;
          return Sg(Ve, t), Wr(t), null;
        case ve: {
          var dt = t.type;
          return Gl(dt) && Ih(t), Wr(t), null;
        }
        case Le: {
          Af(t);
          var bt = t.memoizedState;
          if (bt === null)
            return Wr(t), null;
          var hn = (t.flags & tt) !== at, Jt = bt.rendering;
          if (Jt === null)
            if (hn)
              Fp(bt, !1);
            else {
              var sr = ck() && (e === null || (e.flags & tt) === at);
              if (!sr)
                for (var Zt = t.child; Zt !== null; ) {
                  var rr = fm(Zt);
                  if (rr !== null) {
                    hn = !0, t.flags |= tt, Fp(bt, !1);
                    var ga = rr.updateQueue;
                    return ga !== null && (t.updateQueue = ga, t.flags |= Pt), t.subtreeFlags = at, JT(t, a), Fu(t, Ng(cl.current, Tp)), t.child;
                  }
                  Zt = Zt.sibling;
                }
              bt.tail !== null && or() > cb() && (t.flags |= tt, hn = !0, Fp(bt, !1), t.lanes = Nd);
            }
          else {
            if (!hn) {
              var Jr = fm(Jt);
              if (Jr !== null) {
                t.flags |= tt, hn = !0;
                var mi = Jr.updateQueue;
                if (mi !== null && (t.updateQueue = mi, t.flags |= Pt), Fp(bt, !0), bt.tail === null && bt.tailMode === "hidden" && !Jt.alternate && !Yr())
                  return Wr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              or() * 2 - bt.renderingStartTime > cb() && a !== ca && (t.flags |= tt, hn = !0, Fp(bt, !1), t.lanes = Nd);
            }
            if (bt.isBackwards)
              Jt.sibling = t.child, t.child = Jt;
            else {
              var Da = bt.last;
              Da !== null ? Da.sibling = Jt : t.child = Jt, bt.last = Jt;
            }
          }
          if (bt.tail !== null) {
            var Oa = bt.tail;
            bt.rendering = Oa, bt.tail = Oa.sibling, bt.renderingStartTime = or(), Oa.sibling = null;
            var Sa = cl.current;
            return hn ? Sa = Ng(Sa, Tp) : Sa = Mf(Sa), Fu(t, Sa), Oa;
          }
          return Wr(t), null;
        }
        case Ge:
          break;
        case ae:
        case Fe: {
          qS(t);
          var Ko = t.memoizedState, Gf = Ko !== null;
          if (e !== null) {
            var ev = e.memoizedState, no = ev !== null;
            no !== Gf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !Re && (t.flags |= qn);
          }
          return !Gf || (t.mode & Ot) === it ? Wr(t) : fa(to, ca) && (Wr(t), t.subtreeFlags & (Ln | Pt) && (t.flags |= qn)), null;
        }
        case nt:
          return null;
        case we:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function u_(e, t, a) {
      switch (ig(t), t.tag) {
        case B: {
          var i = t.type;
          Gl(i) && Ih(t);
          var o = t.flags;
          return o & dr ? (t.flags = o & ~dr | tt, (t.mode & Kt) !== it && rS(t), t) : null;
        }
        case F: {
          t.stateNode, Lf(t), tg(t), Og();
          var s = t.flags;
          return (s & dr) !== at && (s & tt) === at ? (t.flags = s & ~dr | tt, t) : null;
        }
        case ne:
          return kg(t), null;
        case fe: {
          Af(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            jf();
          }
          var v = t.flags;
          return v & dr ? (t.flags = v & ~dr | tt, (t.mode & Kt) !== it && rS(t), t) : null;
        }
        case Le:
          return Af(t), null;
        case I:
          return Lf(t), null;
        case se:
          var h = t.type._context;
          return Sg(h, t), null;
        case ae:
        case Fe:
          return qS(t), null;
        case nt:
          return null;
        default:
          return null;
      }
    }
    function $C(e, t, a) {
      switch (ig(t), t.tag) {
        case B: {
          var i = t.type.childContextTypes;
          i != null && Ih(t);
          break;
        }
        case F: {
          t.stateNode, Lf(t), tg(t), Og();
          break;
        }
        case ne: {
          kg(t);
          break;
        }
        case I:
          Lf(t);
          break;
        case fe:
          Af(t);
          break;
        case Le:
          Af(t);
          break;
        case se:
          var o = t.type._context;
          Sg(o, t);
          break;
        case ae:
        case Fe:
          qS(t);
          break;
      }
    }
    var YC = null;
    YC = /* @__PURE__ */ new Set();
    var Am = !1, Gr = !1, s_ = typeof WeakSet == "function" ? WeakSet : Set, Xe = null, Bf = null, Vf = null;
    function c_(e) {
      Nl(null, function() {
        throw e;
      }), ss();
    }
    var f_ = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Kt)
        try {
          Zl(), t.componentWillUnmount();
        } finally {
          Jl(e);
        }
      else
        t.componentWillUnmount();
    };
    function QC(e, t) {
      try {
        Bu(Tr, e);
      } catch (a) {
        Tn(e, t, a);
      }
    }
    function MS(e, t, a) {
      try {
        f_(e, a);
      } catch (i) {
        Tn(e, t, i);
      }
    }
    function d_(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        Tn(e, t, i);
      }
    }
    function WC(e, t) {
      try {
        KC(e);
      } catch (a) {
        Tn(e, t, a);
      }
    }
    function If(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (Ye && Rt && e.mode & Kt)
              try {
                Zl(), i = a(null);
              } finally {
                Jl(e);
              }
            else
              i = a(null);
          } catch (o) {
            Tn(e, t, o);
          }
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", yt(e));
        } else
          a.current = null;
    }
    function zm(e, t, a) {
      try {
        a();
      } catch (i) {
        Tn(e, t, i);
      }
    }
    var GC = !1;
    function p_(e, t) {
      T0(e.containerInfo), Xe = t, v_();
      var a = GC;
      return GC = !1, a;
    }
    function v_() {
      for (; Xe !== null; ) {
        var e = Xe, t = e.child;
        (e.subtreeFlags & Ol) !== at && t !== null ? (t.return = e, Xe = t) : h_();
      }
    }
    function h_() {
      for (; Xe !== null; ) {
        var e = Xe;
        cn(e);
        try {
          m_(e);
        } catch (a) {
          Tn(e, e.return, a);
        }
        wn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Xe = t;
          return;
        }
        Xe = e.return;
      }
    }
    function m_(e) {
      var t = e.alternate, a = e.flags;
      if ((a & lr) !== at) {
        switch (cn(e), e.tag) {
          case D:
          case ce:
          case G:
            break;
          case B: {
            if (t !== null) {
              var i = t.memoizedProps, o = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !nc && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", yt(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", yt(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : dl(e.type, i), o);
              {
                var v = YC;
                f === void 0 && !v.has(e.type) && (v.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", yt(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case F: {
            {
              var h = e.stateNode;
              q0(h.containerInfo);
            }
            break;
          }
          case ne:
          case ie:
          case I:
          case ve:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        wn();
      }
    }
    function vl(e, t, a) {
      var i = t.updateQueue, o = i !== null ? i.lastEffect : null;
      if (o !== null) {
        var s = o.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var v = f.destroy;
            f.destroy = void 0, v !== void 0 && ((e & Qr) !== Ka ? tl(t) : (e & Tr) !== Ka && ds(t), (e & Kl) !== Ka && Xp(!0), zm(t, a, v), (e & Kl) !== Ka && Xp(!1), (e & Qr) !== Ka ? zl() : (e & Tr) !== Ka && kd());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Bu(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var o = i.next, s = o;
        do {
          if ((s.tag & e) === e) {
            (e & Qr) !== Ka ? _d(t) : (e & Tr) !== Ka && Lc(t);
            var f = s.create;
            (e & Kl) !== Ka && Xp(!0), s.destroy = f(), (e & Kl) !== Ka && Xp(!1), (e & Qr) !== Ka ? Bv() : (e & Tr) !== Ka && Vv();
            {
              var v = s.destroy;
              if (v !== void 0 && typeof v != "function") {
                var h = void 0;
                (s.tag & Tr) !== at ? h = "useLayoutEffect" : (s.tag & Kl) !== at ? h = "useInsertionEffect" : h = "useEffect";
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
    function y_(e, t) {
      if ((t.flags & Pt) !== at)
        switch (t.tag) {
          case ge: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, o = i.id, s = i.onPostCommit, f = cC(), v = t.alternate === null ? "mount" : "update";
            sC() && (v = "nested-update"), typeof s == "function" && s(o, v, a, f);
            var h = t.return;
            e: for (; h !== null; ) {
              switch (h.tag) {
                case F:
                  var S = h.stateNode;
                  S.passiveEffectDuration += a;
                  break e;
                case ge:
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
    function g_(e, t, a, i) {
      if ((a.flags & Ml) !== at)
        switch (a.tag) {
          case D:
          case ce:
          case G: {
            if (!Gr)
              if (a.mode & Kt)
                try {
                  Zl(), Bu(Tr | wr, a);
                } finally {
                  Jl(a);
                }
              else
                Bu(Tr | wr, a);
            break;
          }
          case B: {
            var o = a.stateNode;
            if (a.flags & Pt && !Gr)
              if (t === null)
                if (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", yt(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", yt(a) || "instance")), a.mode & Kt)
                  try {
                    Zl(), o.componentDidMount();
                  } finally {
                    Jl(a);
                  }
                else
                  o.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : dl(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", yt(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", yt(a) || "instance")), a.mode & Kt)
                  try {
                    Zl(), o.componentDidUpdate(s, f, o.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Jl(a);
                  }
                else
                  o.componentDidUpdate(s, f, o.__reactInternalSnapshotBeforeUpdate);
              }
            var v = a.updateQueue;
            v !== null && (a.type === a.elementType && !nc && (o.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", yt(a) || "instance"), o.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", yt(a) || "instance")), Mx(a, v, o));
            break;
          }
          case F: {
            var h = a.updateQueue;
            if (h !== null) {
              var S = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ne:
                    S = a.child.stateNode;
                    break;
                  case B:
                    S = a.child.stateNode;
                    break;
                }
              Mx(a, h, S);
            }
            break;
          }
          case ne: {
            var C = a.stateNode;
            if (t === null && a.flags & Pt) {
              var L = a.type, N = a.memoizedProps;
              z0(C, L, N);
            }
            break;
          }
          case ie:
            break;
          case I:
            break;
          case ge: {
            {
              var $ = a.memoizedProps, W = $.onCommit, ee = $.onRender, He = a.stateNode.effectDuration, ot = cC(), et = t === null ? "mount" : "update";
              sC() && (et = "nested-update"), typeof ee == "function" && ee(a.memoizedProps.id, et, a.actualDuration, a.treeBaseDuration, a.actualStartTime, ot);
              {
                typeof W == "function" && W(a.memoizedProps.id, et, He, ot), hk(a);
                var Vt = a.return;
                e: for (; Vt !== null; ) {
                  switch (Vt.tag) {
                    case F:
                      var zt = Vt.stateNode;
                      zt.effectDuration += He;
                      break e;
                    case ge:
                      var P = Vt.stateNode;
                      P.effectDuration += He;
                      break e;
                  }
                  Vt = Vt.return;
                }
              }
            }
            break;
          }
          case fe: {
            R_(e, a);
            break;
          }
          case Le:
          case ve:
          case Ge:
          case ae:
          case Fe:
          case we:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Gr || a.flags & Fn && KC(a);
    }
    function S_(e) {
      switch (e.tag) {
        case D:
        case ce:
        case G: {
          if (e.mode & Kt)
            try {
              Zl(), QC(e, e.return);
            } finally {
              Jl(e);
            }
          else
            QC(e, e.return);
          break;
        }
        case B: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && d_(e, e.return, t), WC(e, e.return);
          break;
        }
        case ne: {
          WC(e, e.return);
          break;
        }
      }
    }
    function E_(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ne) {
          if (a === null) {
            a = i;
            try {
              var o = i.stateNode;
              t ? Q0(o) : G0(i.stateNode, i.memoizedProps);
            } catch (f) {
              Tn(e, e.return, f);
            }
          }
        } else if (i.tag === ie) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? W0(s) : K0(s, i.memoizedProps);
            } catch (f) {
              Tn(e, e.return, f);
            }
        } else if (!((i.tag === ae || i.tag === Fe) && i.memoizedState !== null && i !== e)) {
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
    function KC(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case ne:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var o;
          if (e.mode & Kt)
            try {
              Zl(), o = t(i);
            } finally {
              Jl(e);
            }
          else
            o = t(i);
          typeof o == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", yt(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", yt(e)), t.current = i;
      }
    }
    function x_(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function qC(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, qC(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ne) {
          var a = e.stateNode;
          a !== null && _T(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function C_(e) {
      for (var t = e.return; t !== null; ) {
        if (XC(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function XC(e) {
      return e.tag === ne || e.tag === F || e.tag === I;
    }
    function JC(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || XC(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== ne && t.tag !== ie && t.tag !== Te; ) {
          if (t.flags & Ln || t.child === null || t.tag === I)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & Ln))
          return t.stateNode;
      }
    }
    function b_(e) {
      var t = C_(e);
      switch (t.tag) {
        case ne: {
          var a = t.stateNode;
          t.flags & Pa && (ex(a), t.flags &= ~Pa);
          var i = JC(e);
          zS(e, i, a);
          break;
        }
        case F:
        case I: {
          var o = t.stateNode.containerInfo, s = JC(e);
          AS(e, s, o);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function AS(e, t, a) {
      var i = e.tag, o = i === ne || i === ie;
      if (o) {
        var s = e.stateNode;
        t ? V0(a, s, t) : H0(a, s);
      } else if (i !== I) {
        var f = e.child;
        if (f !== null) {
          AS(f, t, a);
          for (var v = f.sibling; v !== null; )
            AS(v, t, a), v = v.sibling;
        }
      }
    }
    function zS(e, t, a) {
      var i = e.tag, o = i === ne || i === ie;
      if (o) {
        var s = e.stateNode;
        t ? B0(a, s, t) : P0(a, s);
      } else if (i !== I) {
        var f = e.child;
        if (f !== null) {
          zS(f, t, a);
          for (var v = f.sibling; v !== null; )
            zS(v, t, a), v = v.sibling;
        }
      }
    }
    var Kr = null, hl = !1;
    function w_(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case ne: {
              Kr = i.stateNode, hl = !1;
              break e;
            }
            case F: {
              Kr = i.stateNode.containerInfo, hl = !0;
              break e;
            }
            case I: {
              Kr = i.stateNode.containerInfo, hl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Kr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        ZC(e, t, a), Kr = null, hl = !1;
      }
      x_(a);
    }
    function Vu(e, t, a) {
      for (var i = a.child; i !== null; )
        ZC(e, t, i), i = i.sibling;
    }
    function ZC(e, t, a) {
      switch (wd(a), a.tag) {
        case ne:
          Gr || If(a, t);
        case ie: {
          {
            var i = Kr, o = hl;
            Kr = null, Vu(e, t, a), Kr = i, hl = o, Kr !== null && (hl ? $0(Kr, a.stateNode) : I0(Kr, a.stateNode));
          }
          return;
        }
        case Te: {
          Kr !== null && (hl ? Y0(Kr, a.stateNode) : Wy(Kr, a.stateNode));
          return;
        }
        case I: {
          {
            var s = Kr, f = hl;
            Kr = a.stateNode.containerInfo, hl = !0, Vu(e, t, a), Kr = s, hl = f;
          }
          return;
        }
        case D:
        case ce:
        case ue:
        case G: {
          if (!Gr) {
            var v = a.updateQueue;
            if (v !== null) {
              var h = v.lastEffect;
              if (h !== null) {
                var S = h.next, C = S;
                do {
                  var L = C, N = L.destroy, $ = L.tag;
                  N !== void 0 && (($ & Kl) !== Ka ? zm(a, t, N) : ($ & Tr) !== Ka && (ds(a), a.mode & Kt ? (Zl(), zm(a, t, N), Jl(a)) : zm(a, t, N), kd())), C = C.next;
                } while (C !== S);
              }
            }
          }
          Vu(e, t, a);
          return;
        }
        case B: {
          if (!Gr) {
            If(a, t);
            var W = a.stateNode;
            typeof W.componentWillUnmount == "function" && MS(a, t, W);
          }
          Vu(e, t, a);
          return;
        }
        case Ge: {
          Vu(e, t, a);
          return;
        }
        case ae: {
          if (
            // TODO: Remove this dead flag
            a.mode & Ot
          ) {
            var ee = Gr;
            Gr = ee || a.memoizedState !== null, Vu(e, t, a), Gr = ee;
          } else
            Vu(e, t, a);
          break;
        }
        default: {
          Vu(e, t, a);
          return;
        }
      }
    }
    function T_(e) {
      e.memoizedState;
    }
    function R_(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var o = i.memoizedState;
          if (o !== null) {
            var s = o.dehydrated;
            s !== null && cT(s);
          }
        }
      }
    }
    function eb(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new s_()), t.forEach(function(i) {
          var o = Ck.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), sa)
              if (Bf !== null && Vf !== null)
                qp(Vf, Bf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(o, o);
          }
        });
      }
    }
    function __(e, t, a) {
      Bf = a, Vf = e, cn(t), tb(t, e), cn(t), Bf = null, Vf = null;
    }
    function ml(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o];
          try {
            w_(e, t, s);
          } catch (h) {
            Tn(s, t, h);
          }
        }
      var f = bl();
      if (t.subtreeFlags & Ll)
        for (var v = t.child; v !== null; )
          cn(v), tb(v, e), v = v.sibling;
      cn(f);
    }
    function tb(e, t, a) {
      var i = e.alternate, o = e.flags;
      switch (e.tag) {
        case D:
        case ce:
        case ue:
        case G: {
          if (ml(t, e), eo(e), o & Pt) {
            try {
              vl(Kl | wr, e, e.return), Bu(Kl | wr, e);
            } catch (dt) {
              Tn(e, e.return, dt);
            }
            if (e.mode & Kt) {
              try {
                Zl(), vl(Tr | wr, e, e.return);
              } catch (dt) {
                Tn(e, e.return, dt);
              }
              Jl(e);
            } else
              try {
                vl(Tr | wr, e, e.return);
              } catch (dt) {
                Tn(e, e.return, dt);
              }
          }
          return;
        }
        case B: {
          ml(t, e), eo(e), o & Fn && i !== null && If(i, i.return);
          return;
        }
        case ne: {
          ml(t, e), eo(e), o & Fn && i !== null && If(i, i.return);
          {
            if (e.flags & Pa) {
              var s = e.stateNode;
              try {
                ex(s);
              } catch (dt) {
                Tn(e, e.return, dt);
              }
            }
            if (o & Pt) {
              var f = e.stateNode;
              if (f != null) {
                var v = e.memoizedProps, h = i !== null ? i.memoizedProps : v, S = e.type, C = e.updateQueue;
                if (e.updateQueue = null, C !== null)
                  try {
                    U0(f, C, S, h, v, e);
                  } catch (dt) {
                    Tn(e, e.return, dt);
                  }
              }
            }
          }
          return;
        }
        case ie: {
          if (ml(t, e), eo(e), o & Pt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var L = e.stateNode, N = e.memoizedProps, $ = i !== null ? i.memoizedProps : N;
            try {
              F0(L, $, N);
            } catch (dt) {
              Tn(e, e.return, dt);
            }
          }
          return;
        }
        case F: {
          if (ml(t, e), eo(e), o & Pt && i !== null) {
            var W = i.memoizedState;
            if (W.isDehydrated)
              try {
                sT(t.containerInfo);
              } catch (dt) {
                Tn(e, e.return, dt);
              }
          }
          return;
        }
        case I: {
          ml(t, e), eo(e);
          return;
        }
        case fe: {
          ml(t, e), eo(e);
          var ee = e.child;
          if (ee.flags & qn) {
            var He = ee.stateNode, ot = ee.memoizedState, et = ot !== null;
            if (He.isHidden = et, et) {
              var Vt = ee.alternate !== null && ee.alternate.memoizedState !== null;
              Vt || ok();
            }
          }
          if (o & Pt) {
            try {
              T_(e);
            } catch (dt) {
              Tn(e, e.return, dt);
            }
            eb(e);
          }
          return;
        }
        case ae: {
          var zt = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Ot
          ) {
            var P = Gr;
            Gr = P || zt, ml(t, e), Gr = P;
          } else
            ml(t, e);
          if (eo(e), o & qn) {
            var te = e.stateNode, H = e.memoizedState, ke = H !== null, Qe = e;
            if (te.isHidden = ke, ke && !zt && (Qe.mode & Ot) !== it) {
              Xe = Qe;
              for (var Ve = Qe.child; Ve !== null; )
                Xe = Ve, j_(Ve), Ve = Ve.sibling;
            }
            E_(Qe, ke);
          }
          return;
        }
        case Le: {
          ml(t, e), eo(e), o & Pt && eb(e);
          return;
        }
        case Ge:
          return;
        default: {
          ml(t, e), eo(e);
          return;
        }
      }
    }
    function eo(e) {
      var t = e.flags;
      if (t & Ln) {
        try {
          b_(e);
        } catch (a) {
          Tn(e, e.return, a);
        }
        e.flags &= ~Ln;
      }
      t & la && (e.flags &= ~la);
    }
    function k_(e, t, a) {
      Bf = a, Vf = t, Xe = e, nb(e, t, a), Bf = null, Vf = null;
    }
    function nb(e, t, a) {
      for (var i = (e.mode & Ot) !== it; Xe !== null; ) {
        var o = Xe, s = o.child;
        if (o.tag === ae && i) {
          var f = o.memoizedState !== null, v = f || Am;
          if (v) {
            US(e, t, a);
            continue;
          } else {
            var h = o.alternate, S = h !== null && h.memoizedState !== null, C = S || Gr, L = Am, N = Gr;
            Am = v, Gr = C, Gr && !N && (Xe = o, N_(o));
            for (var $ = s; $ !== null; )
              Xe = $, nb(
                $,
                // New root; bubble back up to here and stop.
                t,
                a
              ), $ = $.sibling;
            Xe = o, Am = L, Gr = N, US(e, t, a);
            continue;
          }
        }
        (o.subtreeFlags & Ml) !== at && s !== null ? (s.return = o, Xe = s) : US(e, t, a);
      }
    }
    function US(e, t, a) {
      for (; Xe !== null; ) {
        var i = Xe;
        if ((i.flags & Ml) !== at) {
          var o = i.alternate;
          cn(i);
          try {
            g_(t, o, i, a);
          } catch (f) {
            Tn(i, i.return, f);
          }
          wn();
        }
        if (i === e) {
          Xe = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, Xe = s;
          return;
        }
        Xe = i.return;
      }
    }
    function j_(e) {
      for (; Xe !== null; ) {
        var t = Xe, a = t.child;
        switch (t.tag) {
          case D:
          case ce:
          case ue:
          case G: {
            if (t.mode & Kt)
              try {
                Zl(), vl(Tr, t, t.return);
              } finally {
                Jl(t);
              }
            else
              vl(Tr, t, t.return);
            break;
          }
          case B: {
            If(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && MS(t, t.return, i);
            break;
          }
          case ne: {
            If(t, t.return);
            break;
          }
          case ae: {
            var o = t.memoizedState !== null;
            if (o) {
              rb(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Xe = a) : rb(e);
      }
    }
    function rb(e) {
      for (; Xe !== null; ) {
        var t = Xe;
        if (t === e) {
          Xe = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Xe = a;
          return;
        }
        Xe = t.return;
      }
    }
    function N_(e) {
      for (; Xe !== null; ) {
        var t = Xe, a = t.child;
        if (t.tag === ae) {
          var i = t.memoizedState !== null;
          if (i) {
            ab(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Xe = a) : ab(e);
      }
    }
    function ab(e) {
      for (; Xe !== null; ) {
        var t = Xe;
        cn(t);
        try {
          S_(t);
        } catch (i) {
          Tn(t, t.return, i);
        }
        if (wn(), t === e) {
          Xe = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Xe = a;
          return;
        }
        Xe = t.return;
      }
    }
    function D_(e, t, a, i) {
      Xe = t, O_(t, e, a, i);
    }
    function O_(e, t, a, i) {
      for (; Xe !== null; ) {
        var o = Xe, s = o.child;
        (o.subtreeFlags & Zi) !== at && s !== null ? (s.return = o, Xe = s) : L_(e, t, a, i);
      }
    }
    function L_(e, t, a, i) {
      for (; Xe !== null; ) {
        var o = Xe;
        if ((o.flags & ia) !== at) {
          cn(o);
          try {
            M_(t, o, a, i);
          } catch (f) {
            Tn(o, o.return, f);
          }
          wn();
        }
        if (o === e) {
          Xe = null;
          return;
        }
        var s = o.sibling;
        if (s !== null) {
          s.return = o.return, Xe = s;
          return;
        }
        Xe = o.return;
      }
    }
    function M_(e, t, a, i) {
      switch (t.tag) {
        case D:
        case ce:
        case G: {
          if (t.mode & Kt) {
            nS();
            try {
              Bu(Qr | wr, t);
            } finally {
              tS(t);
            }
          } else
            Bu(Qr | wr, t);
          break;
        }
      }
    }
    function A_(e) {
      Xe = e, z_();
    }
    function z_() {
      for (; Xe !== null; ) {
        var e = Xe, t = e.child;
        if ((Xe.flags & Fa) !== at) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var o = a[i];
              Xe = o, P_(o, e);
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
            Xe = e;
          }
        }
        (e.subtreeFlags & Zi) !== at && t !== null ? (t.return = e, Xe = t) : U_();
      }
    }
    function U_() {
      for (; Xe !== null; ) {
        var e = Xe;
        (e.flags & ia) !== at && (cn(e), F_(e), wn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Xe = t;
          return;
        }
        Xe = e.return;
      }
    }
    function F_(e) {
      switch (e.tag) {
        case D:
        case ce:
        case G: {
          e.mode & Kt ? (nS(), vl(Qr | wr, e, e.return), tS(e)) : vl(Qr | wr, e, e.return);
          break;
        }
      }
    }
    function P_(e, t) {
      for (; Xe !== null; ) {
        var a = Xe;
        cn(a), B_(a, t), wn();
        var i = a.child;
        i !== null ? (i.return = a, Xe = i) : H_(e);
      }
    }
    function H_(e) {
      for (; Xe !== null; ) {
        var t = Xe, a = t.sibling, i = t.return;
        if (qC(t), t === e) {
          Xe = null;
          return;
        }
        if (a !== null) {
          a.return = i, Xe = a;
          return;
        }
        Xe = i;
      }
    }
    function B_(e, t) {
      switch (e.tag) {
        case D:
        case ce:
        case G: {
          e.mode & Kt ? (nS(), vl(Qr, e, t), tS(e)) : vl(Qr, e, t);
          break;
        }
      }
    }
    function V_(e) {
      switch (e.tag) {
        case D:
        case ce:
        case G: {
          try {
            Bu(Tr | wr, e);
          } catch (a) {
            Tn(e, e.return, a);
          }
          break;
        }
        case B: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            Tn(e, e.return, a);
          }
          break;
        }
      }
    }
    function I_(e) {
      switch (e.tag) {
        case D:
        case ce:
        case G: {
          try {
            Bu(Qr | wr, e);
          } catch (t) {
            Tn(e, e.return, t);
          }
          break;
        }
      }
    }
    function $_(e) {
      switch (e.tag) {
        case D:
        case ce:
        case G: {
          try {
            vl(Tr | wr, e, e.return);
          } catch (a) {
            Tn(e, e.return, a);
          }
          break;
        }
        case B: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && MS(e, e.return, t);
          break;
        }
      }
    }
    function Y_(e) {
      switch (e.tag) {
        case D:
        case ce:
        case G:
          try {
            vl(Qr | wr, e, e.return);
          } catch (t) {
            Tn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Pp = Symbol.for;
      Pp("selector.component"), Pp("selector.has_pseudo_class"), Pp("selector.role"), Pp("selector.test_id"), Pp("selector.text");
    }
    var Q_ = [];
    function W_() {
      Q_.forEach(function(e) {
        return e();
      });
    }
    var G_ = b.ReactCurrentActQueue;
    function K_(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function ib() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && G_.current !== null && g("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var q_ = Math.ceil, FS = b.ReactCurrentDispatcher, PS = b.ReactCurrentOwner, qr = b.ReactCurrentBatchConfig, yl = b.ReactCurrentActQueue, kr = (
      /*             */
      0
    ), lb = (
      /*               */
      1
    ), Xr = (
      /*                */
      2
    ), Vi = (
      /*                */
      4
    ), Yo = 0, Hp = 1, rc = 2, Um = 3, Bp = 4, ob = 5, HS = 6, Bt = kr, ja = null, Wn = null, jr = he, to = he, BS = Ou(he), Nr = Yo, Vp = null, Fm = he, Ip = he, Pm = he, $p = null, qa = null, VS = 0, ub = 500, sb = 1 / 0, X_ = 500, Qo = null;
    function Yp() {
      sb = or() + X_;
    }
    function cb() {
      return sb;
    }
    var Hm = !1, IS = null, $f = null, ac = !1, Iu = null, Qp = he, $S = [], YS = null, J_ = 50, Wp = 0, QS = null, WS = !1, Bm = !1, Z_ = 50, Yf = 0, Vm = null, Gp = yn, Im = he, fb = !1;
    function $m() {
      return ja;
    }
    function Na() {
      return (Bt & (Xr | Vi)) !== kr ? or() : (Gp !== yn || (Gp = or()), Gp);
    }
    function $u(e) {
      var t = e.mode;
      if ((t & Ot) === it)
        return ft;
      if ((Bt & Xr) !== kr && jr !== he)
        return Ts(jr);
      var a = GT() !== WT;
      if (a) {
        if (qr.transition !== null) {
          var i = qr.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Im === Wt && (Im = zd()), Im;
      }
      var o = Ya();
      if (o !== Wt)
        return o;
      var s = O0();
      return s;
    }
    function ek(e) {
      var t = e.mode;
      return (t & Ot) === it ? ft : Gv();
    }
    function Dr(e, t, a, i) {
      wk(), fb && g("useInsertionEffect must not schedule updates."), WS && (Bm = !0), xu(e, a, i), (Bt & Xr) !== he && e === ja ? _k(t) : (sa && ks(e, t, a), kk(t), e === ja && ((Bt & Xr) === kr && (Ip = _t(Ip, a)), Nr === Bp && Yu(e, jr)), Xa(e, i), a === ft && Bt === kr && (t.mode & Ot) === it && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !yl.isBatchingLegacy && (Yp(), fx()));
    }
    function tk(e, t, a) {
      var i = e.current;
      i.lanes = t, xu(e, t, a), Xa(e, a);
    }
    function nk(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Bt & Xr) !== kr
      );
    }
    function Xa(e, t) {
      var a = e.callbackNode;
      Zc(e, t);
      var i = Jc(e, e === ja ? jr : he);
      if (i === he) {
        a !== null && _b(a), e.callbackNode = null, e.callbackPriority = Wt;
        return;
      }
      var o = Pl(i), s = e.callbackPriority;
      if (s === o && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(yl.current !== null && a !== eE)) {
        a == null && s !== ft && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && _b(a);
      var f;
      if (o === ft)
        e.tag === Lu ? (yl.isBatchingLegacy !== null && (yl.didScheduleLegacyUpdate = !0), NT(vb.bind(null, e))) : cx(vb.bind(null, e)), yl.current !== null ? yl.current.push(Mu) : M0(function() {
          (Bt & (Xr | Vi)) === kr && Mu();
        }), f = null;
      else {
        var v;
        switch (th(i)) {
          case Hr:
            v = fs;
            break;
          case Oi:
            v = Al;
            break;
          case Ia:
            v = el;
            break;
          case $a:
            v = So;
            break;
          default:
            v = el;
            break;
        }
        f = tE(v, db.bind(null, e));
      }
      e.callbackPriority = o, e.callbackNode = f;
    }
    function db(e, t) {
      if (ER(), Gp = yn, Im = he, (Bt & (Xr | Vi)) !== kr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Go();
      if (i && e.callbackNode !== a)
        return null;
      var o = Jc(e, e === ja ? jr : he);
      if (o === he)
        return null;
      var s = !tf(e, o) && !Wv(e, o) && !t, f = s ? dk(e, o) : Qm(e, o);
      if (f !== Yo) {
        if (f === rc) {
          var v = ef(e);
          v !== he && (o = v, f = GS(e, v));
        }
        if (f === Hp) {
          var h = Vp;
          throw ic(e, he), Yu(e, o), Xa(e, or()), h;
        }
        if (f === HS)
          Yu(e, o);
        else {
          var S = !tf(e, o), C = e.current.alternate;
          if (S && !ak(C)) {
            if (f = Qm(e, o), f === rc) {
              var L = ef(e);
              L !== he && (o = L, f = GS(e, L));
            }
            if (f === Hp) {
              var N = Vp;
              throw ic(e, he), Yu(e, o), Xa(e, or()), N;
            }
          }
          e.finishedWork = C, e.finishedLanes = o, rk(e, f, o);
        }
      }
      return Xa(e, or()), e.callbackNode === a ? db.bind(null, e) : null;
    }
    function GS(e, t) {
      var a = $p;
      if (af(e)) {
        var i = ic(e, t);
        i.flags |= Lr, bT(e.containerInfo);
      }
      var o = Qm(e, t);
      if (o !== rc) {
        var s = qa;
        qa = a, s !== null && pb(s);
      }
      return o;
    }
    function pb(e) {
      qa === null ? qa = e : qa.push.apply(qa, e);
    }
    function rk(e, t, a) {
      switch (t) {
        case Yo:
        case Hp:
          throw new Error("Root did not complete. This is a bug in React.");
        case rc: {
          lc(e, qa, Qo);
          break;
        }
        case Um: {
          if (Yu(e, a), No(a) && // do not delay if we're inside an act() scope
          !kb()) {
            var i = VS + ub - or();
            if (i > 10) {
              var o = Jc(e, he);
              if (o !== he)
                break;
              var s = e.suspendedLanes;
              if (!Do(s, a)) {
                Na(), nf(e, s);
                break;
              }
              e.timeoutHandle = Yy(lc.bind(null, e, qa, Qo), i);
              break;
            }
          }
          lc(e, qa, Qo);
          break;
        }
        case Bp: {
          if (Yu(e, a), Md(a))
            break;
          if (!kb()) {
            var f = fi(e, a), v = f, h = or() - v, S = bk(h) - h;
            if (S > 10) {
              e.timeoutHandle = Yy(lc.bind(null, e, qa, Qo), S);
              break;
            }
          }
          lc(e, qa, Qo);
          break;
        }
        case ob: {
          lc(e, qa, Qo);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function ak(e) {
      for (var t = e; ; ) {
        if (t.flags & mu) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var o = 0; o < i.length; o++) {
                var s = i[o], f = s.getSnapshot, v = s.value;
                try {
                  if (!xe(f(), v))
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
    function vb(e) {
      if (xR(), (Bt & (Xr | Vi)) !== kr)
        throw new Error("Should not already be working.");
      Go();
      var t = Jc(e, he);
      if (!fa(t, ft))
        return Xa(e, or()), null;
      var a = Qm(e, t);
      if (e.tag !== Lu && a === rc) {
        var i = ef(e);
        i !== he && (t = i, a = GS(e, i));
      }
      if (a === Hp) {
        var o = Vp;
        throw ic(e, he), Yu(e, t), Xa(e, or()), o;
      }
      if (a === HS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, lc(e, qa, Qo), Xa(e, or()), null;
    }
    function ik(e, t) {
      t !== he && (rf(e, _t(t, ft)), Xa(e, or()), (Bt & (Xr | Vi)) === kr && (Yp(), Mu()));
    }
    function KS(e, t) {
      var a = Bt;
      Bt |= lb;
      try {
        return e(t);
      } finally {
        Bt = a, Bt === kr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !yl.isBatchingLegacy && (Yp(), fx());
      }
    }
    function lk(e, t, a, i, o) {
      var s = Ya(), f = qr.transition;
      try {
        return qr.transition = null, er(Hr), e(t, a, i, o);
      } finally {
        er(s), qr.transition = f, Bt === kr && Yp();
      }
    }
    function Wo(e) {
      Iu !== null && Iu.tag === Lu && (Bt & (Xr | Vi)) === kr && Go();
      var t = Bt;
      Bt |= lb;
      var a = qr.transition, i = Ya();
      try {
        return qr.transition = null, er(Hr), e ? e() : void 0;
      } finally {
        er(i), qr.transition = a, Bt = t, (Bt & (Xr | Vi)) === kr && Mu();
      }
    }
    function hb() {
      return (Bt & (Xr | Vi)) !== kr;
    }
    function Ym(e, t) {
      ma(BS, to, e), to = _t(to, t);
    }
    function qS(e) {
      to = BS.current, ha(BS, e);
    }
    function ic(e, t) {
      e.finishedWork = null, e.finishedLanes = he;
      var a = e.timeoutHandle;
      if (a !== Qy && (e.timeoutHandle = Qy, L0(a)), Wn !== null)
        for (var i = Wn.return; i !== null; ) {
          var o = i.alternate;
          $C(o, i), i = i.return;
        }
      ja = e;
      var s = oc(e.current, null);
      return Wn = s, jr = to = t, Nr = Yo, Vp = null, Fm = he, Ip = he, Pm = he, $p = null, qa = null, tR(), sl.discardPendingWarnings(), s;
    }
    function mb(e, t) {
      do {
        var a = Wn;
        try {
          if (tm(), Hx(), wn(), PS.current = null, a === null || a.return === null) {
            Nr = Hp, Vp = t, Wn = null;
            return;
          }
          if (Ye && a.mode & Kt && Nm(a, !0), pe)
            if (Ta(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Di(a, i, jr);
            } else
              ps(a, t, jr);
          NR(e, a.return, a, t, jr), Eb(a);
        } catch (o) {
          t = o, Wn === a && a !== null ? (a = a.return, Wn = a) : a = Wn;
          continue;
        }
        return;
      } while (!0);
    }
    function yb() {
      var e = FS.current;
      return FS.current = Tm, e === null ? Tm : e;
    }
    function gb(e) {
      FS.current = e;
    }
    function ok() {
      VS = or();
    }
    function Kp(e) {
      Fm = _t(e, Fm);
    }
    function uk() {
      Nr === Yo && (Nr = Um);
    }
    function XS() {
      (Nr === Yo || Nr === Um || Nr === rc) && (Nr = Bp), ja !== null && (ws(Fm) || ws(Ip)) && Yu(ja, jr);
    }
    function sk(e) {
      Nr !== Bp && (Nr = rc), $p === null ? $p = [e] : $p.push(e);
    }
    function ck() {
      return Nr === Yo;
    }
    function Qm(e, t) {
      var a = Bt;
      Bt |= Xr;
      var i = yb();
      if (ja !== e || jr !== t) {
        if (sa) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (qp(e, jr), o.clear()), Jv(e, t);
        }
        Qo = Hd(), ic(e, t);
      }
      bo(t);
      do
        try {
          fk();
          break;
        } catch (s) {
          mb(e, s);
        }
      while (!0);
      if (tm(), Bt = a, gb(i), Wn !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Mc(), ja = null, jr = he, Nr;
    }
    function fk() {
      for (; Wn !== null; )
        Sb(Wn);
    }
    function dk(e, t) {
      var a = Bt;
      Bt |= Xr;
      var i = yb();
      if (ja !== e || jr !== t) {
        if (sa) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (qp(e, jr), o.clear()), Jv(e, t);
        }
        Qo = Hd(), Yp(), ic(e, t);
      }
      bo(t);
      do
        try {
          pk();
          break;
        } catch (s) {
          mb(e, s);
        }
      while (!0);
      return tm(), gb(i), Bt = a, Wn !== null ? (Iv(), Yo) : (Mc(), ja = null, jr = he, Nr);
    }
    function pk() {
      for (; Wn !== null && !Sd(); )
        Sb(Wn);
    }
    function Sb(e) {
      var t = e.alternate;
      cn(e);
      var a;
      (e.mode & Kt) !== it ? (eS(e), a = JS(t, e, to), Nm(e, !0)) : a = JS(t, e, to), wn(), e.memoizedProps = e.pendingProps, a === null ? Eb(e) : Wn = a, PS.current = null;
    }
    function Eb(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & cs) === at) {
          cn(t);
          var o = void 0;
          if ((t.mode & Kt) === it ? o = IC(a, t, to) : (eS(t), o = IC(a, t, to), Nm(t, !1)), wn(), o !== null) {
            Wn = o;
            return;
          }
        } else {
          var s = u_(a, t);
          if (s !== null) {
            s.flags &= Uv, Wn = s;
            return;
          }
          if ((t.mode & Kt) !== it) {
            Nm(t, !1);
            for (var f = t.actualDuration, v = t.child; v !== null; )
              f += v.actualDuration, v = v.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= cs, i.subtreeFlags = at, i.deletions = null;
          else {
            Nr = HS, Wn = null;
            return;
          }
        }
        var h = t.sibling;
        if (h !== null) {
          Wn = h;
          return;
        }
        t = i, Wn = t;
      } while (t !== null);
      Nr === Yo && (Nr = ob);
    }
    function lc(e, t, a) {
      var i = Ya(), o = qr.transition;
      try {
        qr.transition = null, er(Hr), vk(e, t, a, i);
      } finally {
        qr.transition = o, er(i);
      }
      return null;
    }
    function vk(e, t, a, i) {
      do
        Go();
      while (Iu !== null);
      if (Tk(), (Bt & (Xr | Vi)) !== kr)
        throw new Error("Should not already be working.");
      var o = e.finishedWork, s = e.finishedLanes;
      if (Td(s), o === null)
        return Rd(), null;
      if (s === he && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = he, o === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Wt;
      var f = _t(o.lanes, o.childLanes);
      Fd(e, f), e === ja && (ja = null, Wn = null, jr = he), ((o.subtreeFlags & Zi) !== at || (o.flags & Zi) !== at) && (ac || (ac = !0, YS = a, tE(el, function() {
        return Go(), null;
      })));
      var v = (o.subtreeFlags & (Ol | Ll | Ml | Zi)) !== at, h = (o.flags & (Ol | Ll | Ml | Zi)) !== at;
      if (v || h) {
        var S = qr.transition;
        qr.transition = null;
        var C = Ya();
        er(Hr);
        var L = Bt;
        Bt |= Vi, PS.current = null, p_(e, o), fC(), __(e, o, s), R0(e.containerInfo), e.current = o, vs(s), k_(o, e, s), hs(), Ed(), Bt = L, er(C), qr.transition = S;
      } else
        e.current = o, fC();
      var N = ac;
      if (ac ? (ac = !1, Iu = e, Qp = s) : (Yf = 0, Vm = null), f = e.pendingLanes, f === he && ($f = null), N || wb(e.current, !1), Cd(o.stateNode, i), sa && e.memoizedUpdaters.clear(), W_(), Xa(e, or()), t !== null)
        for (var $ = e.onRecoverableError, W = 0; W < t.length; W++) {
          var ee = t[W], He = ee.stack, ot = ee.digest;
          $(ee.value, {
            componentStack: He,
            digest: ot
          });
        }
      if (Hm) {
        Hm = !1;
        var et = IS;
        throw IS = null, et;
      }
      return fa(Qp, ft) && e.tag !== Lu && Go(), f = e.pendingLanes, fa(f, ft) ? (SR(), e === QS ? Wp++ : (Wp = 0, QS = e)) : Wp = 0, Mu(), Rd(), null;
    }
    function Go() {
      if (Iu !== null) {
        var e = th(Qp), t = Ns(Ia, e), a = qr.transition, i = Ya();
        try {
          return qr.transition = null, er(t), mk();
        } finally {
          er(i), qr.transition = a;
        }
      }
      return !1;
    }
    function hk(e) {
      $S.push(e), ac || (ac = !0, tE(el, function() {
        return Go(), null;
      }));
    }
    function mk() {
      if (Iu === null)
        return !1;
      var e = YS;
      YS = null;
      var t = Iu, a = Qp;
      if (Iu = null, Qp = he, (Bt & (Xr | Vi)) !== kr)
        throw new Error("Cannot flush passive effects while already rendering.");
      WS = !0, Bm = !1, Co(a);
      var i = Bt;
      Bt |= Vi, A_(t.current), D_(t, t.current, a, e);
      {
        var o = $S;
        $S = [];
        for (var s = 0; s < o.length; s++) {
          var f = o[s];
          y_(t, f);
        }
      }
      jd(), wb(t.current, !0), Bt = i, Mu(), Bm ? t === Vm ? Yf++ : (Yf = 0, Vm = t) : Yf = 0, WS = !1, Bm = !1, bd(t);
      {
        var v = t.current.stateNode;
        v.effectDuration = 0, v.passiveEffectDuration = 0;
      }
      return !0;
    }
    function xb(e) {
      return $f !== null && $f.has(e);
    }
    function yk(e) {
      $f === null ? $f = /* @__PURE__ */ new Set([e]) : $f.add(e);
    }
    function gk(e) {
      Hm || (Hm = !0, IS = e);
    }
    var Sk = gk;
    function Cb(e, t, a) {
      var i = tc(a, t), o = SC(e, i, ft), s = zu(e, o, ft), f = Na();
      s !== null && (xu(s, ft, f), Xa(s, f));
    }
    function Tn(e, t, a) {
      if (c_(a), Xp(!1), e.tag === F) {
        Cb(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === F) {
          Cb(i, e, a);
          return;
        } else if (i.tag === B) {
          var o = i.type, s = i.stateNode;
          if (typeof o.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !xb(s)) {
            var f = tc(a, e), v = gS(i, f, ft), h = zu(i, v, ft), S = Na();
            h !== null && (xu(h, ft, S), Xa(h, S));
            return;
          }
        }
        i = i.return;
      }
      g(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function Ek(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var o = Na();
      nf(e, a), jk(e), ja === e && Do(jr, a) && (Nr === Bp || Nr === Um && No(jr) && or() - VS < ub ? ic(e, he) : Pm = _t(Pm, a)), Xa(e, o);
    }
    function bb(e, t) {
      t === Wt && (t = ek(e));
      var a = Na(), i = Ga(e, t);
      i !== null && (xu(i, t, a), Xa(i, a));
    }
    function xk(e) {
      var t = e.memoizedState, a = Wt;
      t !== null && (a = t.retryLane), bb(e, a);
    }
    function Ck(e, t) {
      var a = Wt, i;
      switch (e.tag) {
        case fe:
          i = e.stateNode;
          var o = e.memoizedState;
          o !== null && (a = o.retryLane);
          break;
        case Le:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), bb(e, a);
    }
    function bk(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : q_(e / 1960) * 1960;
    }
    function wk() {
      if (Wp > J_)
        throw Wp = 0, QS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Yf > Z_ && (Yf = 0, Vm = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function Tk() {
      sl.flushLegacyContextWarning(), sl.flushPendingUnsafeLifecycleWarnings();
    }
    function wb(e, t) {
      cn(e), Wm(e, Dl, $_), t && Wm(e, ki, Y_), Wm(e, Dl, V_), t && Wm(e, ki, I_), wn();
    }
    function Wm(e, t, a) {
      for (var i = e, o = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== o && i.child !== null && s !== at ? i = i.child : ((i.flags & t) !== at && a(i), i.sibling !== null ? i = i.sibling : i = o = i.return);
      }
    }
    var Gm = null;
    function Tb(e) {
      {
        if ((Bt & Xr) !== kr || !(e.mode & Ot))
          return;
        var t = e.tag;
        if (t !== oe && t !== F && t !== B && t !== D && t !== ce && t !== ue && t !== G)
          return;
        var a = yt(e) || "ReactComponent";
        if (Gm !== null) {
          if (Gm.has(a))
            return;
          Gm.add(a);
        } else
          Gm = /* @__PURE__ */ new Set([a]);
        var i = Sr;
        try {
          cn(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? cn(e) : wn();
        }
      }
    }
    var JS;
    {
      var Rk = null;
      JS = function(e, t, a) {
        var i = Lb(Rk, t);
        try {
          return FC(e, t, a);
        } catch (s) {
          if (FT() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (tm(), Hx(), $C(e, t), Lb(t, i), t.mode & Kt && eS(t), Nl(null, FC, null, e, t, a), Xi()) {
            var o = ss();
            typeof o == "object" && o !== null && o._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var Rb = !1, ZS;
    ZS = /* @__PURE__ */ new Set();
    function _k(e) {
      if (xi && !mR())
        switch (e.tag) {
          case D:
          case ce:
          case G: {
            var t = Wn && yt(Wn) || "Unknown", a = t;
            if (!ZS.has(a)) {
              ZS.add(a);
              var i = yt(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case B: {
            Rb || (g("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), Rb = !0);
            break;
          }
        }
    }
    function qp(e, t) {
      if (sa) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          ks(e, i, t);
        });
      }
    }
    var eE = {};
    function tE(e, t) {
      {
        var a = yl.current;
        return a !== null ? (a.push(t), eE) : gd(e, t);
      }
    }
    function _b(e) {
      if (e !== eE)
        return Pv(e);
    }
    function kb() {
      return yl.current !== null;
    }
    function kk(e) {
      {
        if (e.mode & Ot) {
          if (!ib())
            return;
        } else if (!K_() || Bt !== kr || e.tag !== D && e.tag !== ce && e.tag !== G)
          return;
        if (yl.current === null) {
          var t = Sr;
          try {
            cn(e), g(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, yt(e));
          } finally {
            t ? cn(e) : wn();
          }
        }
      }
    }
    function jk(e) {
      e.tag !== Lu && ib() && yl.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Xp(e) {
      fb = e;
    }
    var Ii = null, Qf = null, Nk = function(e) {
      Ii = e;
    };
    function Wf(e) {
      {
        if (Ii === null)
          return e;
        var t = Ii(e);
        return t === void 0 ? e : t.current;
      }
    }
    function nE(e) {
      return Wf(e);
    }
    function rE(e) {
      {
        if (Ii === null)
          return e;
        var t = Ii(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Wf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: X,
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
    function jb(e, t) {
      {
        if (Ii === null)
          return !1;
        var a = e.elementType, i = t.type, o = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case B: {
            typeof i == "function" && (o = !0);
            break;
          }
          case D: {
            (typeof i == "function" || s === ht) && (o = !0);
            break;
          }
          case ce: {
            (s === X || s === ht) && (o = !0);
            break;
          }
          case ue:
          case G: {
            (s === rt || s === ht) && (o = !0);
            break;
          }
          default:
            return !1;
        }
        if (o) {
          var f = Ii(a);
          if (f !== void 0 && f === Ii(i))
            return !0;
        }
        return !1;
      }
    }
    function Nb(e) {
      {
        if (Ii === null || typeof WeakSet != "function")
          return;
        Qf === null && (Qf = /* @__PURE__ */ new WeakSet()), Qf.add(e);
      }
    }
    var Dk = function(e, t) {
      {
        if (Ii === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Go(), Wo(function() {
          aE(e.current, i, a);
        });
      }
    }, Ok = function(e, t) {
      {
        if (e.context !== vi)
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
          case D:
          case G:
          case B:
            h = v;
            break;
          case ce:
            h = v.render;
            break;
        }
        if (Ii === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var S = !1, C = !1;
        if (h !== null) {
          var L = Ii(h);
          L !== void 0 && (a.has(L) ? C = !0 : t.has(L) && (f === B ? C = !0 : S = !0));
        }
        if (Qf !== null && (Qf.has(e) || i !== null && Qf.has(i)) && (C = !0), C && (e._debugNeedsRemount = !0), C || S) {
          var N = Ga(e, ft);
          N !== null && Dr(N, e, ft, yn);
        }
        o !== null && !C && aE(o, t, a), s !== null && aE(s, t, a);
      }
    }
    var Lk = function(e, t) {
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
          case D:
          case G:
          case B:
            v = f;
            break;
          case ce:
            v = f.render;
            break;
        }
        var h = !1;
        v !== null && t.has(v) && (h = !0), h ? Mk(e, a) : i !== null && iE(i, t, a), o !== null && iE(o, t, a);
      }
    }
    function Mk(e, t) {
      {
        var a = Ak(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ne:
              t.add(i.stateNode);
              return;
            case I:
              t.add(i.stateNode.containerInfo);
              return;
            case F:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function Ak(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ne)
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
        var Db = Object.preventExtensions({});
      } catch {
        lE = !0;
      }
    }
    function zk(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = at, this.subtreeFlags = at, this.deletions = null, this.lanes = he, this.childLanes = he, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !lE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var hi = function(e, t, a, i) {
      return new zk(e, t, a, i);
    };
    function oE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Uk(e) {
      return typeof e == "function" && !oE(e) && e.defaultProps === void 0;
    }
    function Fk(e) {
      if (typeof e == "function")
        return oE(e) ? B : D;
      if (e != null) {
        var t = e.$$typeof;
        if (t === X)
          return ce;
        if (t === rt)
          return ue;
      }
      return oe;
    }
    function oc(e, t) {
      var a = e.alternate;
      a === null ? (a = hi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = at, a.subtreeFlags = at, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & Xn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case oe:
        case D:
        case G:
          a.type = Wf(e.type);
          break;
        case B:
          a.type = nE(e.type);
          break;
        case ce:
          a.type = rE(e.type);
          break;
      }
      return a;
    }
    function Pk(e, t) {
      e.flags &= Xn | Ln;
      var a = e.alternate;
      if (a === null)
        e.childLanes = he, e.lanes = t, e.child = null, e.subtreeFlags = at, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
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
    function Hk(e, t, a) {
      var i;
      return e === Yh ? (i = Ot, t === !0 && (i |= pn, i |= qt)) : i = it, sa && (i |= Kt), hi(F, null, null, i);
    }
    function uE(e, t, a, i, o, s) {
      var f = oe, v = e;
      if (typeof e == "function")
        oE(e) ? (f = B, v = nE(v)) : v = Wf(v);
      else if (typeof e == "string")
        f = ne;
      else
        e: switch (e) {
          case vt:
            return Qu(a.children, o, s, t);
          case St:
            f = me, o |= pn, (o & Ot) !== it && (o |= qt);
            break;
          case At:
            return Bk(a, o, s, t);
          case Ne:
            return Vk(a, o, s, t);
          case Oe:
            return Ik(a, o, s, t);
          case Bn:
            return Ob(a, o, s, t);
          case En:
          case Lt:
          case bn:
          case gr:
          case Dt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case Qt:
                  f = se;
                  break e;
                case T:
                  f = Ue;
                  break e;
                case X:
                  f = ce, v = rE(v);
                  break e;
                case rt:
                  f = ue;
                  break e;
                case ht:
                  f = Ce, v = null;
                  break e;
              }
            var h = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (h += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var S = i ? yt(i) : null;
              S && (h += `

Check the render method of \`` + S + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + h));
          }
        }
      var C = hi(f, a, t, o);
      return C.elementType = e, C.type = v, C.lanes = s, C._debugOwner = i, C;
    }
    function sE(e, t, a) {
      var i = null;
      i = e._owner;
      var o = e.type, s = e.key, f = e.props, v = uE(o, s, f, i, t, a);
      return v._debugSource = e._source, v._debugOwner = e._owner, v;
    }
    function Qu(e, t, a, i) {
      var o = hi(Z, e, i, t);
      return o.lanes = a, o;
    }
    function Bk(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var o = hi(ge, e, i, t | Kt);
      return o.elementType = At, o.lanes = a, o.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, o;
    }
    function Vk(e, t, a, i) {
      var o = hi(fe, e, i, t);
      return o.elementType = Ne, o.lanes = a, o;
    }
    function Ik(e, t, a, i) {
      var o = hi(Le, e, i, t);
      return o.elementType = Oe, o.lanes = a, o;
    }
    function Ob(e, t, a, i) {
      var o = hi(ae, e, i, t);
      o.elementType = Bn, o.lanes = a;
      var s = {
        isHidden: !1
      };
      return o.stateNode = s, o;
    }
    function cE(e, t, a) {
      var i = hi(ie, e, null, t);
      return i.lanes = a, i;
    }
    function $k() {
      var e = hi(ne, null, null, it);
      return e.elementType = "DELETED", e;
    }
    function Yk(e) {
      var t = hi(Te, null, null, it);
      return t.stateNode = e, t;
    }
    function fE(e, t, a) {
      var i = e.children !== null ? e.children : [], o = hi(I, i, e.key, t);
      return o.lanes = a, o.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, o;
    }
    function Lb(e, t) {
      return e === null && (e = hi(oe, null, null, it)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function Qk(e, t, a, i, o) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Qy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Wt, this.eventTimes = _s(he), this.expirationTimes = _s(yn), this.pendingLanes = he, this.suspendedLanes = he, this.pingedLanes = he, this.expiredLanes = he, this.mutableReadLanes = he, this.finishedLanes = he, this.entangledLanes = he, this.entanglements = _s(he), this.identifierPrefix = i, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
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
    function Mb(e, t, a, i, o, s, f, v, h, S) {
      var C = new Qk(e, t, a, v, h), L = Hk(t, s);
      C.current = L, L.stateNode = C;
      {
        var N = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        L.memoizedState = N;
      }
      return wg(L), C;
    }
    var dE = "18.3.1";
    function Wk(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return Rn(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: de,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var pE, vE;
    pE = !1, vE = {};
    function Ab(e) {
      if (!e)
        return vi;
      var t = hu(e), a = jT(t);
      if (t.tag === B) {
        var i = t.type;
        if (Gl(i))
          return ux(t, i, a);
      }
      return a;
    }
    function Gk(e, t) {
      {
        var a = hu(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var o = oa(a);
        if (o === null)
          return null;
        if (o.mode & pn) {
          var s = yt(a) || "Component";
          if (!vE[s]) {
            vE[s] = !0;
            var f = Sr;
            try {
              cn(o), a.mode & pn ? g("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : g("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? cn(f) : wn();
            }
          }
        }
        return o.stateNode;
      }
    }
    function zb(e, t, a, i, o, s, f, v) {
      var h = !1, S = null;
      return Mb(e, t, h, S, a, i, o, s, f);
    }
    function Ub(e, t, a, i, o, s, f, v, h, S) {
      var C = !0, L = Mb(a, i, C, e, o, s, f, v, h);
      L.context = Ab(null);
      var N = L.current, $ = Na(), W = $u(N), ee = Io($, W);
      return ee.callback = t ?? null, zu(N, ee, W), tk(L, W, $), L;
    }
    function Jp(e, t, a, i) {
      xd(t, e);
      var o = t.current, s = Na(), f = $u(o);
      An(f);
      var v = Ab(a);
      t.context === null ? t.context = v : t.pendingContext = v, xi && Sr !== null && !pE && (pE = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, yt(Sr) || "Unknown"));
      var h = Io(s, f);
      h.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && g("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), h.callback = i);
      var S = zu(o, h, f);
      return S !== null && (Dr(S, o, f, s), lm(S, o, f)), f;
    }
    function Km(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ne:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function Kk(e) {
      switch (e.tag) {
        case F: {
          var t = e.stateNode;
          if (af(t)) {
            var a = Yv(t);
            ik(t, a);
          }
          break;
        }
        case fe: {
          Wo(function() {
            var o = Ga(e, ft);
            if (o !== null) {
              var s = Na();
              Dr(o, e, ft, s);
            }
          });
          var i = ft;
          hE(e, i);
          break;
        }
      }
    }
    function Fb(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = qv(a.retryLane, t));
    }
    function hE(e, t) {
      Fb(e, t);
      var a = e.alternate;
      a && Fb(a, t);
    }
    function qk(e) {
      if (e.tag === fe) {
        var t = xs, a = Ga(e, t);
        if (a !== null) {
          var i = Na();
          Dr(a, e, t, i);
        }
        hE(e, t);
      }
    }
    function Xk(e) {
      if (e.tag === fe) {
        var t = $u(e), a = Ga(e, t);
        if (a !== null) {
          var i = Na();
          Dr(a, e, t, i);
        }
        hE(e, t);
      }
    }
    function Pb(e) {
      var t = kn(e);
      return t === null ? null : t.stateNode;
    }
    var Hb = function(e) {
      return null;
    };
    function Jk(e) {
      return Hb(e);
    }
    var Bb = function(e) {
      return !1;
    };
    function Zk(e) {
      return Bb(e);
    }
    var Vb = null, Ib = null, $b = null, Yb = null, Qb = null, Wb = null, Gb = null, Kb = null, qb = null;
    {
      var Xb = function(e, t, a) {
        var i = t[a], o = Nt(e) ? e.slice() : kt({}, e);
        return a + 1 === t.length ? (Nt(o) ? o.splice(i, 1) : delete o[i], o) : (o[i] = Xb(e[i], t, a + 1), o);
      }, Jb = function(e, t) {
        return Xb(e, t, 0);
      }, Zb = function(e, t, a, i) {
        var o = t[i], s = Nt(e) ? e.slice() : kt({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[o], Nt(s) ? s.splice(o, 1) : delete s[o];
        } else
          s[o] = Zb(
            // $FlowFixMe number or string is fine here
            e[o],
            t,
            a,
            i + 1
          );
        return s;
      }, ew = function(e, t, a) {
        if (t.length !== a.length) {
          j("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              j("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return Zb(e, t, a, 0);
      }, tw = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var o = t[a], s = Nt(e) ? e.slice() : kt({}, e);
        return s[o] = tw(e[o], t, a + 1, i), s;
      }, nw = function(e, t, a) {
        return tw(e, t, 0, a);
      }, mE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      Vb = function(e, t, a, i) {
        var o = mE(e, t);
        if (o !== null) {
          var s = nw(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = kt({}, e.memoizedProps);
          var f = Ga(e, ft);
          f !== null && Dr(f, e, ft, yn);
        }
      }, Ib = function(e, t, a) {
        var i = mE(e, t);
        if (i !== null) {
          var o = Jb(i.memoizedState, a);
          i.memoizedState = o, i.baseState = o, e.memoizedProps = kt({}, e.memoizedProps);
          var s = Ga(e, ft);
          s !== null && Dr(s, e, ft, yn);
        }
      }, $b = function(e, t, a, i) {
        var o = mE(e, t);
        if (o !== null) {
          var s = ew(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = kt({}, e.memoizedProps);
          var f = Ga(e, ft);
          f !== null && Dr(f, e, ft, yn);
        }
      }, Yb = function(e, t, a) {
        e.pendingProps = nw(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ga(e, ft);
        i !== null && Dr(i, e, ft, yn);
      }, Qb = function(e, t) {
        e.pendingProps = Jb(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ga(e, ft);
        a !== null && Dr(a, e, ft, yn);
      }, Wb = function(e, t, a) {
        e.pendingProps = ew(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Ga(e, ft);
        i !== null && Dr(i, e, ft, yn);
      }, Gb = function(e) {
        var t = Ga(e, ft);
        t !== null && Dr(t, e, ft, yn);
      }, Kb = function(e) {
        Hb = e;
      }, qb = function(e) {
        Bb = e;
      };
    }
    function ej(e) {
      var t = oa(e);
      return t === null ? null : t.stateNode;
    }
    function tj(e) {
      return null;
    }
    function nj() {
      return Sr;
    }
    function rj(e) {
      var t = e.findFiberByHostInstance, a = b.ReactCurrentDispatcher;
      return gu({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: Vb,
        overrideHookStateDeletePath: Ib,
        overrideHookStateRenamePath: $b,
        overrideProps: Yb,
        overridePropsDeletePath: Qb,
        overridePropsRenamePath: Wb,
        setErrorHandler: Kb,
        setSuspenseHandler: qb,
        scheduleUpdate: Gb,
        currentDispatcherRef: a,
        findHostInstanceByFiber: ej,
        findFiberByHostInstance: t || tj,
        // React Refresh
        findHostInstancesForRefresh: Lk,
        scheduleRefresh: Dk,
        scheduleRoot: Ok,
        setRefreshHandler: Nk,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: nj,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: dE
      });
    }
    var rw = typeof reportError == "function" ? (
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
        if (a.nodeType !== Kn) {
          var i = Pb(t.current);
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
        hb() && g("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Wo(function() {
          Jp(null, e, null, null);
        }), rx(t);
      }
    };
    function aj(e, t) {
      if (!Xm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      aw(e);
      var a = !1, i = !1, o = "", s = rw;
      t != null && (t.hydrate ? j("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === A && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = zb(e, Yh, null, a, i, o, s);
      Fh(f.current, e);
      var v = e.nodeType === Kn ? e.parentNode : e;
      return ap(v), new yE(f);
    }
    function qm(e) {
      this._internalRoot = e;
    }
    function ij(e) {
      e && lh(e);
    }
    qm.prototype.unstable_scheduleHydration = ij;
    function lj(e, t, a) {
      if (!Xm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      aw(e), t === void 0 && g("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, o = a != null && a.hydratedSources || null, s = !1, f = !1, v = "", h = rw;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (v = a.identifierPrefix), a.onRecoverableError !== void 0 && (h = a.onRecoverableError));
      var S = Ub(t, null, e, Yh, i, s, f, v, h);
      if (Fh(S.current, e), ap(e), o)
        for (var C = 0; C < o.length; C++) {
          var L = o[C];
          cR(S, L);
        }
      return new qm(S);
    }
    function Xm(e) {
      return !!(e && (e.nodeType === aa || e.nodeType === qi || e.nodeType === ld));
    }
    function Zp(e) {
      return !!(e && (e.nodeType === aa || e.nodeType === qi || e.nodeType === ld || e.nodeType === Kn && e.nodeValue === " react-mount-point-unstable "));
    }
    function aw(e) {
      e.nodeType === aa && e.tagName && e.tagName.toUpperCase() === "BODY" && g("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), hp(e) && (e._reactRootContainer ? g("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : g("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var oj = b.ReactCurrentOwner, iw;
    iw = function(e) {
      if (e._reactRootContainer && e.nodeType !== Kn) {
        var t = Pb(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = gE(e), o = !!(i && Du(i));
      o && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === aa && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function gE(e) {
      return e ? e.nodeType === qi ? e.documentElement : e.firstChild : null;
    }
    function lw() {
    }
    function uj(e, t, a, i, o) {
      if (o) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var N = Km(f);
            s.call(N);
          };
        }
        var f = Ub(
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
          lw
        );
        e._reactRootContainer = f, Fh(f.current, e);
        var v = e.nodeType === Kn ? e.parentNode : e;
        return ap(v), Wo(), f;
      } else {
        for (var h; h = e.lastChild; )
          e.removeChild(h);
        if (typeof i == "function") {
          var S = i;
          i = function() {
            var N = Km(C);
            S.call(N);
          };
        }
        var C = zb(
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
          lw
        );
        e._reactRootContainer = C, Fh(C.current, e);
        var L = e.nodeType === Kn ? e.parentNode : e;
        return ap(L), Wo(function() {
          Jp(t, C, a, i);
        }), C;
      }
    }
    function sj(e, t) {
      e !== null && typeof e != "function" && g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Jm(e, t, a, i, o) {
      iw(a), sj(o === void 0 ? null : o, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = uj(a, t, e, o, i);
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
    var ow = !1;
    function cj(e) {
      {
        ow || (ow = !0, g("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = oj.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", It(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === aa ? e : Gk(e, "findDOMNode");
    }
    function fj(e, t, a) {
      if (g("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Zp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = hp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Jm(null, e, t, !0, a);
    }
    function dj(e, t, a) {
      if (g("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Zp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = hp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Jm(null, e, t, !1, a);
    }
    function pj(e, t, a, i) {
      if (g("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Zp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !hy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Jm(e, t, a, !1, i);
    }
    var uw = !1;
    function vj(e) {
      if (uw || (uw = !0, g("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Zp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = hp(e) && e._reactRootContainer === void 0;
        t && g("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = gE(e), i = a && !Du(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Wo(function() {
          Jm(null, null, e, !1, function() {
            e._reactRootContainer = null, rx(e);
          });
        }), !0;
      } else {
        {
          var o = gE(e), s = !!(o && Du(o)), f = e.nodeType === aa && Zp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Ar(Kk), Cu(qk), nh(Xk), Os(Ya), Bd(Zv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), xc(m0), vy(KS, lk, Wo);
    function hj(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Xm(t))
        throw new Error("Target container is not a DOM element.");
      return Wk(e, t, null, a);
    }
    function mj(e, t, a, i) {
      return pj(e, t, a, i);
    }
    var SE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Du, wf, Ph, fu, Cc, KS]
    };
    function yj(e, t) {
      return SE.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), aj(e, t);
    }
    function gj(e, t, a) {
      return SE.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), lj(e, t, a);
    }
    function Sj(e) {
      return hb() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Wo(e);
    }
    var Ej = rj({
      findFiberByHostInstance: Qs,
      bundleType: 1,
      version: dE,
      rendererPackageName: "react-dom"
    });
    if (!Ej && Nn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var sw = window.location.protocol;
      /^(https?|file):$/.test(sw) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (sw === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Za.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = SE, Za.createPortal = hj, Za.createRoot = yj, Za.findDOMNode = cj, Za.flushSync = Sj, Za.hydrate = fj, Za.hydrateRoot = gj, Za.render = dj, Za.unmountComponentAtNode = vj, Za.unstable_batchedUpdates = KS, Za.unstable_renderSubtreeIntoContainer = mj, Za.version = dE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Za;
}
function Rw() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Rw);
    } catch (E) {
      console.error(E);
    }
  }
}
process.env.NODE_ENV === "production" ? (Rw(), kE.exports = jj()) : kE.exports = Nj();
var gl = kE.exports, jE, ey = gl;
if (process.env.NODE_ENV === "production")
  jE = ey.createRoot, ey.hydrateRoot;
else {
  var Sw = ey.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  jE = function(E, x) {
    Sw.usingClientEntryPoint = !0;
    try {
      return ey.createRoot(E, x);
    } finally {
      Sw.usingClientEntryPoint = !1;
    }
  };
}
const ny = {
  key: "sr3",
  label: "Shadowrun 3rd Edition",
  isPrimary: !0,
  mockDataLoaded: !0
}, Dj = {
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
}, _w = z.createContext(Dj);
function Oj({ children: E }) {
  const [x, b] = z.useState(ny), [K, J] = z.useState({}), [j, g] = z.useState(null), re = z.useMemo(
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
  ), D = z.useCallback(
    async (Z) => {
      const me = Z ?? x.key;
      if (J((Ue) => {
        var se;
        return {
          ...Ue,
          [me]: {
            data: (se = Ue[me]) == null ? void 0 : se.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        J((Ue) => {
          var se;
          return {
            ...Ue,
            [me]: {
              data: (se = Ue[me]) == null ? void 0 : se.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const Ue = await fetch(`/api/editions/${me}/character-creation`);
        if (!Ue.ok)
          throw new Error(`Failed to load edition data (${Ue.status})`);
        const se = await Ue.json(), ce = (se == null ? void 0 : se.character_creation) ?? se;
        J((ge) => ({
          ...ge,
          [me]: {
            data: ce,
            loading: !1,
            error: void 0
          }
        }));
      } catch (Ue) {
        const se = Ue instanceof Error ? Ue.message : "Unknown error loading edition data";
        J((ce) => {
          var ge;
          return {
            ...ce,
            [me]: {
              data: (ge = ce[me]) == null ? void 0 : ge.data,
              loading: !1,
              error: se
            }
          };
        });
      }
    },
    [x.key]
  ), B = z.useCallback((Z) => `${new Intl.NumberFormat("en-US").format(Z)}¥`, []), oe = z.useCallback((Z) => JSON.parse(JSON.stringify(Z)), []), F = z.useCallback(
    (Z, me) => {
      var se;
      if (!me)
        return oe(Z);
      const Ue = oe(Z);
      if (me.resources && ((se = Ue.priorities) != null && se.resources)) {
        const ce = Ue.priorities.resources;
        Object.entries(me.resources).forEach(([ge, fe]) => {
          const ue = ge;
          typeof fe == "number" && ce[ue] && (ce[ue] = {
            ...ce[ue],
            label: B(fe)
          });
        });
      }
      return Ue;
    },
    [oe, B]
  ), I = z.useCallback(
    async (Z) => {
      var me, Ue;
      if (Z) {
        g((se) => (se == null ? void 0 : se.campaignId) === Z ? { ...se, loading: !0, error: void 0 } : {
          campaignId: Z,
          edition: x.key,
          data: se == null ? void 0 : se.data,
          gameplayRules: se == null ? void 0 : se.gameplayRules,
          creationMethod: se == null ? void 0 : se.creationMethod,
          loading: !0,
          error: void 0
        });
        try {
          const se = await fetch(`/api/campaigns/${Z}/character-creation`);
          if (!se.ok)
            throw new Error(`Failed to load campaign character creation (${se.status})`);
          const ce = await se.json(), ge = ((Ue = (me = ce.edition) == null ? void 0 : me.toLowerCase) == null ? void 0 : Ue.call(me)) ?? x.key, fe = ce.edition_data;
          fe && J((ue) => {
            var G;
            return {
              ...ue,
              [ge]: {
                data: ((G = ue[ge]) == null ? void 0 : G.data) ?? fe,
                loading: !1,
                error: void 0
              }
            };
          }), g(() => ({
            campaignId: Z,
            edition: ge,
            data: fe ? F(fe, ce.gameplay_rules) : void 0,
            gameplayRules: ce.gameplay_rules,
            creationMethod: ce.creation_method ?? void 0,
            loading: !1,
            error: void 0
          }));
        } catch (se) {
          const ce = se instanceof Error ? se.message : "Unknown error loading campaign character creation data";
          throw g({
            campaignId: Z,
            edition: x.key,
            data: void 0,
            gameplayRules: void 0,
            creationMethod: void 0,
            loading: !1,
            error: ce
          }), se;
        }
      }
    },
    [x.key, F]
  ), ne = z.useCallback(() => {
    g(null);
  }, []), ie = z.useMemo(() => {
    const Z = K[x.key], me = j && !j.loading && !j.error && j.edition === x.key, Ue = me && j.data ? j.data : Z == null ? void 0 : Z.data, se = me ? j == null ? void 0 : j.creationMethod : void 0;
    return {
      activeEdition: x,
      supportedEditions: re,
      setEdition: (ce) => {
        const ge = re.find((fe) => fe.key === ce);
        ge ? b(ge) : console.warn(`Edition '${ce}' is not registered; keeping current edition.`);
      },
      characterCreationData: Ue,
      reloadEditionData: D,
      loadCampaignCharacterCreation: I,
      clearCampaignCharacterCreation: ne,
      isLoading: (Z == null ? void 0 : Z.loading) ?? !1,
      error: Z == null ? void 0 : Z.error,
      campaignId: j == null ? void 0 : j.campaignId,
      campaignCharacterCreation: me ? j == null ? void 0 : j.data : void 0,
      campaignGameplayRules: me ? j == null ? void 0 : j.gameplayRules : void 0,
      campaignLoading: (j == null ? void 0 : j.loading) ?? !1,
      campaignError: j == null ? void 0 : j.error,
      campaignCreationMethod: se
    };
  }, [
    x,
    j,
    ne,
    K,
    I,
    D,
    re
  ]);
  return z.useEffect(() => {
    const Z = K[x.key];
    !(Z != null && Z.data) && !(Z != null && Z.loading) && D(x.key);
  }, [x.key, K, D]), z.useEffect(() => {
    typeof window > "u" || (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
      loadCampaignCharacterCreation: I,
      clearCampaignCharacterCreation: ne
    }));
  }, [ne, I]), z.useEffect(() => {
    var se, ce, ge, fe, ue, G;
    const Z = K[x.key], me = j && !j.loading && !j.error && j.edition === x.key, Ue = me && j.data ? j.data : Z == null ? void 0 : Z.data;
    Ue && typeof window < "u" && ((ce = (se = window.ShadowmasterLegacyApp) == null ? void 0 : se.setEditionData) == null || ce.call(se, x.key, Ue)), typeof window < "u" && (me ? (fe = (ge = window.ShadowmasterLegacyApp) == null ? void 0 : ge.applyCampaignCreationDefaults) == null || fe.call(ge, {
      campaignId: j.campaignId,
      edition: j.edition,
      gameplayRules: j.gameplayRules ?? null
    }) : (G = (ue = window.ShadowmasterLegacyApp) == null ? void 0 : ue.applyCampaignCreationDefaults) == null || G.call(ue, null));
  }, [x.key, j, K]), /* @__PURE__ */ d.jsx(_w.Provider, { value: ie, children: E });
}
function Lj() {
  const E = z.useContext(_w);
  if (!E)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return E;
}
const kw = z.createContext(void 0);
function Mj(E) {
  if (typeof document > "u")
    return { node: null, created: !1 };
  let x = document.getElementById(E);
  const b = !x;
  return x || (x = document.createElement("div"), x.id = E, document.body.appendChild(x)), { node: x, created: b };
}
const Aj = 6e3;
function zj() {
  return typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Uj({ children: E }) {
  const [x, b] = z.useState([]), K = z.useRef(/* @__PURE__ */ new Map()), [J, j] = z.useState(null);
  z.useEffect(() => {
    const { node: B, created: oe } = Mj("shadowmaster-notifications");
    j(B);
    const F = K.current;
    return () => {
      F.forEach((I) => window.clearTimeout(I)), F.clear(), oe && (B != null && B.parentNode) && B.parentNode.removeChild(B);
    };
  }, []);
  const g = z.useCallback((B) => {
    b((F) => F.filter((I) => I.id !== B));
    const oe = K.current.get(B);
    oe && (window.clearTimeout(oe), K.current.delete(B));
  }, []), re = z.useCallback(
    ({ id: B, type: oe = "info", title: F, description: I, durationMs: ne = Aj }) => {
      const ie = B ?? zj(), Z = {
        id: ie,
        type: oe,
        title: F,
        description: I ?? "",
        durationMs: ne,
        createdAt: Date.now()
      };
      if (b((me) => [...me, Z]), ne > 0) {
        const me = window.setTimeout(() => {
          g(ie);
        }, ne);
        K.current.set(ie, me);
      }
      return ie;
    },
    [g]
  ), D = z.useMemo(
    () => ({
      pushNotification: re,
      dismissNotification: g
    }),
    [g, re]
  );
  return z.useEffect(() => {
    if (typeof window > "u")
      return;
    const B = (oe) => {
      const F = oe;
      F.detail && re(F.detail);
    };
    return window.addEventListener("shadowmaster:notify", B), window.ShadowmasterNotify = re, () => {
      window.removeEventListener("shadowmaster:notify", B), window.ShadowmasterNotify === re && delete window.ShadowmasterNotify;
    };
  }, [re]), /* @__PURE__ */ d.jsxs(kw.Provider, { value: D, children: [
    E,
    J && gl.createPortal(
      /* @__PURE__ */ d.jsx("div", { className: "notification-stack", role: "status", "aria-live": "polite", children: x.map((B) => /* @__PURE__ */ d.jsxs(
        "div",
        {
          className: `notification-toast notification-toast--${B.type}`,
          "data-notification-type": B.type,
          children: [
            /* @__PURE__ */ d.jsxs("div", { className: "notification-toast__content", children: [
              /* @__PURE__ */ d.jsx("strong", { children: B.title }),
              B.description && /* @__PURE__ */ d.jsx("p", { dangerouslySetInnerHTML: { __html: B.description.replace(/\n/g, "<br />") } })
            ] }),
            /* @__PURE__ */ d.jsx(
              "button",
              {
                type: "button",
                className: "notification-toast__close",
                "aria-label": "Dismiss notification",
                onClick: () => g(B.id),
                children: "×"
              }
            )
          ]
        },
        B.id
      )) }),
      J
    )
  ] });
}
function jw() {
  const E = z.useContext(kw);
  if (!E)
    throw new Error("useNotifications must be used within a NotificationProvider");
  return E;
}
function CE(E, x) {
  return !!(E != null && E.roles.some((b) => b.toLowerCase() === x.toLowerCase()));
}
async function rv(E, x = {}) {
  const b = new Headers(x.headers || {});
  x.body && !b.has("Content-Type") && b.set("Content-Type", "application/json");
  const K = await fetch(E, {
    ...x,
    headers: b,
    credentials: "include"
  });
  if (K.status === 204)
    return {};
  const J = await K.text(), j = () => {
    try {
      return J ? JSON.parse(J) : {};
    } catch {
      return {};
    }
  };
  if (!K.ok) {
    const g = j(), re = typeof g.error == "string" && g.error.trim().length > 0 ? g.error : K.statusText;
    throw new Error(re);
  }
  return j();
}
function Fj() {
  const [E, x] = z.useState("login"), [b, K] = z.useState(null), [J, j] = z.useState(!1), [g, re] = z.useState(!1), [D, B] = z.useState(""), [oe, F] = z.useState(""), [I, ne] = z.useState(""), [ie, Z] = z.useState(""), [me, Ue] = z.useState(""), [se, ce] = z.useState(""), [ge, fe] = z.useState(""), [ue, G] = z.useState(""), [Ce, ve] = z.useState(""), Te = z.useRef(!1), Le = z.useRef(null), Ge = "auth-menu-dropdown", ae = "auth-menu-heading", { pushNotification: Fe } = jw();
  z.useEffect(() => {
    Te.current || (Te.current = !0, nt());
  }, []), z.useEffect(() => {
    window.ShadowmasterAuth = {
      user: b,
      isAdministrator: CE(b, "administrator"),
      isGamemaster: CE(b, "gamemaster"),
      isPlayer: CE(b, "player")
    }, window.dispatchEvent(new CustomEvent("shadowmaster:auth", { detail: window.ShadowmasterAuth }));
  }, [b]), z.useEffect(() => {
    if (!g)
      return;
    const _ = (Ye) => {
      Le.current && (Le.current.contains(Ye.target) || re(!1));
    }, pe = (Ye) => {
      Ye.key === "Escape" && re(!1);
    };
    return document.addEventListener("mousedown", _), document.addEventListener("keydown", pe), () => {
      document.removeEventListener("mousedown", _), document.removeEventListener("keydown", pe);
    };
  }, [g]), z.useEffect(() => {
    if (!g || b)
      return;
    const _ = E === "register" ? "register-email" : "login-email", pe = window.setTimeout(() => {
      const Ye = document.getElementById(_);
      Ye == null || Ye.focus();
    }, 0);
    return () => window.clearTimeout(pe);
  }, [g, b, E]);
  async function nt() {
    try {
      j(!0);
      const _ = await rv("/api/auth/me");
      K(_.user), x("login"), re(!_.user);
    } catch {
      K(null), re(!0);
    } finally {
      j(!1);
    }
  }
  async function we(_) {
    _.preventDefault(), j(!0);
    try {
      const pe = await rv("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: D,
          password: oe
        })
      });
      K(pe.user), x("login"), F(""), re(!1), Fe({
        type: "success",
        title: "Signed in",
        description: pe.user ? `Welcome back, ${pe.user.username || pe.user.email}!` : "Signed in successfully."
      });
    } catch (pe) {
      const Ye = pe instanceof Error ? pe.message : "Login failed";
      Fe({
        type: "error",
        title: "Login failed",
        description: Ye
      });
    } finally {
      j(!1);
    }
  }
  async function De(_) {
    if (_.preventDefault(), me !== se) {
      Fe({
        type: "warning",
        title: "Passwords do not match",
        description: "Please confirm your password before continuing."
      });
      return;
    }
    j(!0);
    try {
      const pe = await rv("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: I,
          username: ie,
          password: me
        })
      });
      K(pe.user), x("login"), Ue(""), ce(""), Fe({
        type: "success",
        title: "Account created",
        description: "You can now sign in with your new credentials."
      });
    } catch (pe) {
      const Ye = pe instanceof Error ? pe.message : "Registration failed";
      Fe({
        type: "error",
        title: "Registration failed",
        description: Ye
      });
    } finally {
      j(!1);
    }
  }
  async function be() {
    j(!0);
    try {
      await rv("/api/auth/logout", { method: "POST" }), K(null), x("login"), re(!0), Fe({
        type: "success",
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (_) {
      const pe = _ instanceof Error ? _.message : "Logout failed";
      Fe({
        type: "error",
        title: "Logout failed",
        description: pe
      });
    } finally {
      j(!1);
    }
  }
  async function Be(_) {
    if (_.preventDefault(), ue !== Ce) {
      Fe({
        type: "warning",
        title: "New passwords do not match",
        description: "Make sure both password fields match before updating."
      });
      return;
    }
    j(!0);
    try {
      await rv("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({
          current_password: ge,
          new_password: ue
        })
      }), fe(""), G(""), ve(""), x("login"), Fe({
        type: "success",
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
    } catch (pe) {
      const Ye = pe instanceof Error ? pe.message : "Password update failed";
      Fe({
        type: "error",
        title: "Password update failed",
        description: Ye
      });
    } finally {
      j(!1);
    }
  }
  const Re = z.useMemo(() => b ? b.roles.join(", ") : "", [b]), M = b ? `Signed in as ${b.email}.` : "Sign in to manage campaigns, sessions, and characters.";
  return /* @__PURE__ */ d.jsxs("section", { className: `auth-panel${g ? " auth-panel--open" : ""}`, ref: Le, children: [
    /* @__PURE__ */ d.jsxs(
      "button",
      {
        type: "button",
        className: "auth-panel__toggle",
        "aria-haspopup": "dialog",
        "aria-expanded": g,
        "aria-controls": Ge,
        onClick: () => re((_) => !_),
        children: [
          /* @__PURE__ */ d.jsxs("span", { className: "auth-panel__hamburger", "aria-hidden": "true", children: [
            /* @__PURE__ */ d.jsx("span", {}),
            /* @__PURE__ */ d.jsx("span", {}),
            /* @__PURE__ */ d.jsx("span", {})
          ] }),
          /* @__PURE__ */ d.jsx("span", { className: "auth-panel__label", children: b ? b.username : "Sign In" }),
          b && /* @__PURE__ */ d.jsx("span", { className: "auth-panel__tag", children: Re || "Player" })
        ]
      }
    ),
    /* @__PURE__ */ d.jsxs(
      "div",
      {
        id: Ge,
        className: "auth-panel__dropdown",
        role: "dialog",
        "aria-modal": "false",
        "aria-hidden": !g,
        "aria-labelledby": ae,
        children: [
          /* @__PURE__ */ d.jsxs("header", { className: "auth-panel__header", children: [
            /* @__PURE__ */ d.jsxs("div", { children: [
              /* @__PURE__ */ d.jsx("h2", { id: ae, children: b ? `Welcome, ${b.username}` : "Account Access" }),
              /* @__PURE__ */ d.jsx("p", { className: "auth-panel__status", children: M })
            ] }),
            b && /* @__PURE__ */ d.jsx("div", { className: "auth-panel__roles", children: /* @__PURE__ */ d.jsx("span", { className: "auth-tag", children: Re || "Player" }) })
          ] }),
          b ? /* @__PURE__ */ d.jsxs("div", { className: "auth-panel__content", children: [
            /* @__PURE__ */ d.jsxs("div", { className: "auth-panel__actions", children: [
              /* @__PURE__ */ d.jsx(
                "button",
                {
                  type: "button",
                  className: "btn btn-secondary",
                  onClick: () => {
                    x(E === "password" ? "login" : "password");
                  },
                  disabled: J,
                  children: E === "password" ? "Hide Password Form" : "Change Password"
                }
              ),
              /* @__PURE__ */ d.jsx("button", { className: "btn btn-primary", type: "button", onClick: be, disabled: J, children: "Logout" })
            ] }),
            E === "password" && /* @__PURE__ */ d.jsxs("form", { className: "auth-form", onSubmit: Be, children: [
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "current-password", children: "Current Password" }),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    id: "current-password",
                    type: "password",
                    value: ge,
                    onChange: (_) => fe(_.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "new-password", children: "New Password" }),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    id: "new-password",
                    type: "password",
                    value: ue,
                    onChange: (_) => G(_.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "confirm-password", children: "Confirm New Password" }),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    id: "confirm-password",
                    type: "password",
                    value: Ce,
                    onChange: (_) => ve(_.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsx("button", { className: "btn btn-primary", type: "submit", disabled: J, children: "Update Password" })
            ] }),
            /* @__PURE__ */ d.jsx("div", { className: "auth-panel__menu-links", children: /* @__PURE__ */ d.jsxs("span", { className: "auth-panel__menu-link auth-panel__menu-link--disabled", children: [
              "Settings ",
              /* @__PURE__ */ d.jsx("small", { children: "Coming soon" })
            ] }) })
          ] }) : /* @__PURE__ */ d.jsxs("div", { className: "auth-panel__content", children: [
            E === "login" && /* @__PURE__ */ d.jsxs("form", { className: "auth-form", onSubmit: we, children: [
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "login-email", children: "Email" }),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    id: "login-email",
                    type: "email",
                    value: D,
                    onChange: (_) => B(_.target.value),
                    required: !0,
                    autoComplete: "email"
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "login-password", children: "Password" }),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    id: "login-password",
                    type: "password",
                    value: oe,
                    onChange: (_) => F(_.target.value),
                    required: !0,
                    autoComplete: "current-password"
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "auth-form__footer", children: [
                /* @__PURE__ */ d.jsx("button", { className: "btn btn-primary", type: "submit", disabled: J, children: "Sign In" }),
                /* @__PURE__ */ d.jsx(
                  "button",
                  {
                    className: "btn btn-link",
                    type: "button",
                    onClick: () => {
                      x("register");
                    },
                    children: "Need an account?"
                  }
                )
              ] })
            ] }),
            E === "register" && /* @__PURE__ */ d.jsxs("form", { className: "auth-form", onSubmit: De, children: [
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "register-email", children: "Email" }),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    id: "register-email",
                    type: "email",
                    value: I,
                    onChange: (_) => ne(_.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "register-username", children: "Username" }),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    id: "register-username",
                    value: ie,
                    onChange: (_) => Z(_.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "register-password", children: "Password" }),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    id: "register-password",
                    type: "password",
                    value: me,
                    onChange: (_) => Ue(_.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "register-confirm", children: "Confirm Password" }),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    id: "register-confirm",
                    type: "password",
                    value: se,
                    onChange: (_) => ce(_.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "auth-form__footer", children: [
                /* @__PURE__ */ d.jsx("button", { className: "btn btn-primary", type: "submit", disabled: J, children: "Create Account" }),
                /* @__PURE__ */ d.jsx(
                  "button",
                  {
                    className: "btn btn-link",
                    type: "button",
                    onClick: () => {
                      x("login");
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
function Pj() {
  var x, b;
  if (typeof window.showCreateCharacterModal == "function") {
    window.showCreateCharacterModal();
    return;
  }
  (b = (x = window.ShadowmasterLegacyApp) == null ? void 0 : x.showWizardStep) == null || b.call(x, 1);
  const E = document.getElementById("character-modal");
  E && (E.style.display = "block");
}
function Hj() {
  const [E, x] = z.useState(null);
  return z.useEffect(() => {
    x(document.getElementById("characters-actions"));
  }, []), E ? gl.createPortal(
    /* @__PURE__ */ d.jsxs("div", { className: "characters-callout", children: [
      /* @__PURE__ */ d.jsxs("div", { className: "characters-callout__copy", children: [
        /* @__PURE__ */ d.jsx("h2", { children: "Characters" }),
        /* @__PURE__ */ d.jsx("p", { children: "Build new runners, review existing sheets, and keep your roster ready for the next mission." })
      ] }),
      /* @__PURE__ */ d.jsx("div", { className: "characters-callout__actions", children: /* @__PURE__ */ d.jsx(
        "button",
        {
          id: "create-character-btn",
          type: "button",
          className: "btn btn-primary",
          onClick: Pj,
          children: "Create Character"
        }
      ) })
    ] }),
    E
  ) : null;
}
function Kf() {
  return Lj();
}
const bE = [
  { label: "Priority (default)", value: "priority" },
  { label: "Sum-to-Ten (coming soon)", value: "sum_to_ten" },
  { label: "Karma (coming soon)", value: "karma" }
], wE = ["Basics", "Roster", "World", "Automation", "Session Seed", "Review"], Bj = [
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
], Vj = [
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
function ov(E) {
  return typeof crypto < "u" && crypto.randomUUID ? `${E}-${crypto.randomUUID()}` : `${E}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function av(E) {
  return E.toLowerCase() === "sr5" ? "SR5" : E.toUpperCase();
}
function Ew(E) {
  return E === "SR5" ? "Shadowrun 5th Edition" : E;
}
const xw = {
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
function Ij(E, x) {
  switch (x.type) {
    case "RESET":
      return x.payload;
    case "UPDATE_FIELD":
      return {
        ...E,
        [x.field]: x.value
      };
    case "UPDATE_PLACEHOLDER":
      return {
        ...E,
        placeholders: E.placeholders.map(
          (b) => b.id === x.id ? { ...b, [x.field]: x.value } : b
        )
      };
    case "ADD_PLACEHOLDER":
      return {
        ...E,
        placeholders: [
          ...E.placeholders,
          {
            id: ov("placeholder"),
            name: "Runner Placeholder",
            role: "Unassigned"
          }
        ]
      };
    case "REMOVE_PLACEHOLDER":
      return {
        ...E,
        placeholders: E.placeholders.filter((b) => b.id !== x.id)
      };
    case "UPDATE_FACTION":
      return {
        ...E,
        factions: E.factions.map(
          (b) => b.id === x.id ? { ...b, [x.field]: x.value } : b
        )
      };
    case "ADD_FACTION":
      return {
        ...E,
        factions: [
          ...E.factions,
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
        ...E,
        factions: E.factions.filter((b) => b.id !== x.id)
      };
    case "UPDATE_LOCATION":
      return {
        ...E,
        locations: E.locations.map(
          (b) => b.id === x.id ? { ...b, [x.field]: x.value } : b
        )
      };
    case "ADD_LOCATION":
      return {
        ...E,
        locations: [
          ...E.locations,
          {
            id: ov("location"),
            name: "",
            descriptor: ""
          }
        ]
      };
    case "REMOVE_LOCATION":
      return {
        ...E,
        locations: E.locations.filter((b) => b.id !== x.id)
      };
    case "UPDATE_HOUSE_RULE":
      return {
        ...E,
        houseRules: {
          ...E.houseRules,
          [x.key]: x.value
        }
      };
    case "UPDATE_SESSION_SEED":
      return {
        ...E,
        sessionSeed: {
          ...E.sessionSeed,
          [x.field]: x.value
        }
      };
    default:
      return E;
  }
}
function $j({ targetId: E = "campaign-creation-react-root", onCreated: x }) {
  var Si;
  const {
    activeEdition: b,
    supportedEditions: K,
    characterCreationData: J,
    reloadEditionData: j,
    setEdition: g
  } = Kf(), re = z.useMemo(() => {
    const Se = K.find((A) => A.key === "sr5");
    return Se ? Se.key : b.key;
  }, [b.key, K]), [D, B] = z.useState(null), [oe, F] = z.useState(re), [I, ne] = z.useState(J), [ie, Z] = z.useState([]), [me, Ue] = z.useState([]), [se, ce] = z.useState(""), [ge, fe] = z.useState("experienced"), [ue, G] = z.useState("priority"), [Ce, ve] = z.useState([]), [Te, Le] = z.useState({}), [Ge, ae] = z.useState(bE), [Fe, nt] = z.useState(!1), [we, De] = z.useState(!1), [be, Be] = z.useState(null), [Re, M] = z.useState(0), [_, pe] = z.useReducer(Ij, xw), [Ye, Rt] = z.useState([]), [gt, pt] = z.useState(() => [av(re)]), [xt, wt] = z.useState(!1), [en, Nn] = z.useState(!1), [cr, gn] = z.useState(null), { pushNotification: Pn } = jw(), [jt, ln] = z.useState({}), [Rn, Zr] = z.useState({}), Or = z.useRef(null), Hn = z.useRef(null), _n = z.useRef(null), Un = z.useRef(null), ar = z.useRef(null), ea = z.useRef(null), Dn = z.useRef(null), fr = wE.length, on = z.useMemo(() => av(oe), [oe]), ta = z.useMemo(() => {
    const Se = /* @__PURE__ */ new Map();
    return Ye.forEach((A) => {
      Se.set(A.code.toUpperCase(), A.name);
    }), Se;
  }, [Ye]), Ea = z.useMemo(
    () => gt.map((Se) => ta.get(Se) ?? Se),
    [ta, gt]
  );
  z.useEffect(() => {
    B(document.getElementById(E));
  }, [E]), z.useEffect(() => {
    F(re);
  }, [re]), z.useEffect(() => {
    b.key !== re && g(re);
  }, [b.key, re, g]), z.useEffect(() => {
    let Se = !1;
    async function A() {
      Nn(!0), gn(null);
      try {
        const de = await fetch(`/api/editions/${oe}/books`);
        if (!de.ok)
          throw new Error(`Failed to load books (${de.status})`);
        const vt = await de.json(), St = Array.isArray(vt == null ? void 0 : vt.books) ? vt.books : [];
        if (Se)
          return;
        const At = St.map((X) => ({
          ...X,
          code: (X.code || "").toUpperCase()
        })).filter((X) => X.code), T = At.some((X) => X.code === on) ? At : [
          ...At,
          {
            id: on.toLowerCase(),
            name: Ew(on),
            code: on
          }
        ];
        T.sort((X, Ne) => X.code.localeCompare(Ne.code)), Rt(T), pt((X) => {
          const Ne = new Set(X.map((rt) => rt.toUpperCase()));
          Ne.add(on);
          const Oe = new Set(T.map((rt) => rt.code));
          return Array.from(Ne).filter((rt) => Oe.has(rt)).sort();
        });
      } catch (de) {
        if (console.error("Failed to load source books", de), Se)
          return;
        gn("Unable to load source books. Default core book applied.");
        const vt = [
          { id: on.toLowerCase(), name: Ew(on), code: on }
        ];
        Rt(vt), pt([on]);
      } finally {
        Se || Nn(!1);
      }
    }
    return A(), () => {
      Se = !0;
    };
  }, [on, oe]), z.useEffect(() => {
    async function Se(A) {
      var de;
      try {
        const vt = await fetch(`/api/editions/${A}/character-creation`);
        if (!vt.ok)
          throw new Error(`Failed to load edition data (${vt.status})`);
        const St = await vt.json(), At = (St == null ? void 0 : St.character_creation) ?? St;
        ne(At), Le(At.creation_methods ?? {});
        const Qt = Object.entries(At.gameplay_levels ?? {}).map(([T, { label: X }]) => ({
          value: T,
          label: X || T
        }));
        Z(Qt), Qt.some((T) => T.value === ge) || fe(((de = Qt[0]) == null ? void 0 : de.value) ?? "experienced");
      } catch (vt) {
        console.error("Failed to load edition data", vt);
      }
    }
    Se(oe);
  }, [oe, ge]), z.useEffect(() => {
    async function Se() {
      try {
        const A = await fetch("/api/users?role=gamemaster,administrator");
        if (!A.ok)
          throw new Error(`Failed to load users (${A.status})`);
        const de = await A.json();
        if (!Array.isArray(de) || de.length === 0) {
          ve([]);
          return;
        }
        ve(de), de.length > 0 && ce((vt) => vt || de[0].id);
      } catch (A) {
        console.error("Failed to load users", A), ve([]);
      }
    }
    Se();
  }, []), z.useEffect(() => {
    async function Se() {
      try {
        const A = await fetch("/api/characters");
        if (!A.ok)
          throw new Error(`Failed to load characters (${A.status})`);
        const de = await A.json();
        if (!Array.isArray(de)) {
          Ue([]);
          return;
        }
        Ue(de);
      } catch (A) {
        console.error("Failed to load characters", A), Ue([]);
      }
    }
    Se();
  }, []), z.useEffect(() => {
    !I && J && (ne(J), Le(J.creation_methods ?? {}));
  }, [J, I]), z.useEffect(() => {
    if (!I && Object.keys(Te).length === 0) {
      ae(bE);
      return;
    }
    if (!Te || Object.keys(Te).length === 0) {
      ae(bE);
      return;
    }
    const Se = Object.entries(Te).map(([A, de]) => ({
      value: A,
      label: de.label || A
    })).sort((A, de) => A.value === "priority" ? -1 : de.value === "priority" ? 1 : A.label.localeCompare(de.label));
    ae(Se);
  }, [Te, I]), z.useEffect(() => {
    if (Ge.length !== 0 && !Ge.some((Se) => Se.value === ue)) {
      const Se = Ge.find((A) => A.value === "priority");
      G((Se == null ? void 0 : Se.value) ?? Ge[0].value);
      return;
    }
  }, [Ge, ue]);
  const Me = z.useMemo(() => K.map((Se) => ({
    label: Se.label,
    value: Se.key
  })), [K]), Je = z.useMemo(() => Ce.length === 0 ? [{ label: "No gamemasters found", value: "" }] : Ce.map((Se) => ({
    label: `${Se.username} (${Se.email})`,
    value: Se.id
  })), [Ce]), Ct = z.useCallback(
    (Se) => {
      var de, vt;
      const A = Se ?? av(oe);
      pe({ type: "RESET", payload: { ...xw } }), fe("experienced"), G(((de = Ge[0]) == null ? void 0 : de.value) ?? "priority"), ce(((vt = Ce[0]) == null ? void 0 : vt.id) ?? ""), Be(null), ln({}), Zr({}), M(0), pt([A]), wt(!1), gn(null);
    },
    [Ge, oe, Ce]
  );
  function Yt() {
    const Se = av(b.key);
    F(b.key), Ct(Se), nt(!0);
  }
  function un() {
    Ct(), nt(!1);
  }
  function tn(Se) {
    const A = {};
    let de;
    return Se === 0 && (_.name.trim() || (A.name = "Campaign name is required.", de = "Provide a campaign name before continuing."), Ce.length > 0 && !se && (A.gm = "Assign a gamemaster.", de = de ?? "Assign a gamemaster before continuing.")), Se === 1 && _.selectedPlayers.length === 0 && _.placeholders.length === 0 && (A.roster = "Select at least one existing character or create a placeholder runner.", de = "Attach at least one runner before continuing."), Se === 2 && _.factions.length === 0 && _.locations.length === 0 && (A.backbone = "Add at least one faction or location, or use the quick-add template.", de = "Capture at least one faction or location before continuing."), Se === 4 && !_.sessionSeed.skip && !_.sessionSeed.title.trim() && (A.sessionSeed = "Provide a title for the initial session or choose to skip.", de = "Name your first session or choose to skip."), Object.keys(A).length > 0 ? (nn(Se, A, de), !1) : (Be(null), ln({}), yr(Se), !0);
  }
  const mn = () => {
    var A;
    if (!tn(Re))
      return;
    const Se = Math.min(Re + 1, wE.length - 1);
    ln({}), M(Se), (A = Rn[Se]) != null && A.length ? tn(Se) : Object.values(Rn).some((de) => de == null ? void 0 : de.length) || Be(null);
  }, Gn = z.useCallback(() => {
    const Se = ov("faction");
    pe({ type: "ADD_FACTION" }), pe({
      type: "UPDATE_FACTION",
      id: Se,
      field: "name",
      value: "Ares Macrotechnology"
    }), pe({
      type: "UPDATE_FACTION",
      id: Se,
      field: "tags",
      value: "Corporate, AAA"
    }), pe({
      type: "UPDATE_FACTION",
      id: Se,
      field: "notes",
      value: "Megacorp interested in experimental weapons testing."
    }), Sn("backbone", 2);
  }, []), sn = z.useCallback(() => {
    const Se = ov("location");
    pe({ type: "ADD_LOCATION" }), pe({
      type: "UPDATE_LOCATION",
      id: Se,
      field: "name",
      value: "Downtown Seattle Safehouse"
    }), pe({
      type: "UPDATE_LOCATION",
      id: Se,
      field: "descriptor",
      value: "Secure condo with rating 4 security and friendly neighbors."
    }), Sn("backbone", 2);
  }, []), Ut = (Se) => {
    !(Se != null && Se.current) || !(Se.current instanceof HTMLElement) || (Se.current.focus({ preventScroll: !0 }), Se.current.scrollIntoView({ behavior: "smooth", block: "center" }));
  }, nn = (Se, A, de) => {
    const vt = Object.keys(A), St = vt[0], At = de != null ? [
      de,
      ...vt.filter((Qt) => Qt !== St).map((Qt) => A[Qt]).filter((Qt) => Qt && Qt !== de)
    ] : vt.map((Qt) => A[Qt]);
    if (Be(At[0] ?? null), ln(A), Zr((Qt) => ({
      ...Qt,
      [Se]: At.length > 0 ? At : ["Please resolve the highlighted fields."]
    })), St)
      switch (St) {
        case "name":
          Ut(Or);
          break;
        case "theme":
          Ut(Hn);
          break;
        case "gm":
          Ut(_n);
          break;
        case "overview":
          Ut(Un);
          break;
        case "roster":
          Ut(ar);
          break;
        case "backbone":
          Ut(ea);
          break;
        case "sessionSeed":
          Ut(Dn);
          break;
      }
  }, yr = (Se) => {
    Zr((A) => {
      if (!(Se in A))
        return A;
      const { [Se]: de, ...vt } = A;
      return Object.keys(vt).length === 0 && Be(null), vt;
    });
  }, Sn = (Se, A = Re) => {
    ln((de) => {
      if (!(Se in de))
        return de;
      const vt = { ...de };
      return delete vt[Se], Object.keys(vt).length === 0 && (A === Re && Be(null), yr(A)), vt;
    });
  }, na = () => {
    var A;
    const Se = Math.max(Re - 1, 0);
    ln({}), M(Se), (A = Rn[Se]) != null && A.length ? tn(Se) : Object.values(Rn).some((de) => de == null ? void 0 : de.length) || Be(null);
  };
  async function ei(Se) {
    var de, vt;
    if (Se.preventDefault(), !tn(Re))
      return;
    const A = Object.entries(Rn).find(
      ([St, At]) => Number(St) !== Re && (At == null ? void 0 : At.length)
    );
    if (A) {
      const St = Number(A[0]);
      ln({}), M(St), tn(St);
      return;
    }
    De(!0), Be(null), ln({}), yr(Re);
    try {
      const St = Ce.find((Oe) => Oe.id === se), At = _.name.trim() || "Campaign", Qt = {
        automation: _.houseRules,
        notes: _.houseRuleNotes,
        theme: _.theme,
        factions: _.factions,
        locations: _.locations,
        placeholders: _.placeholders,
        session_seed: _.sessionSeed
      }, T = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: _.name.trim(),
          description: _.description,
          gm_user_id: se,
          gm_name: (St == null ? void 0 : St.username) ?? (St == null ? void 0 : St.email) ?? "",
          edition: oe,
          gameplay_level: ge,
          creation_method: ue,
          enabled_books: gt,
          house_rules: JSON.stringify(Qt),
          status: "Active"
        })
      });
      if (!T.ok) {
        const Oe = await T.text();
        throw new Error(Oe || `Failed to create campaign (${T.status})`);
      }
      const X = await T.json(), Ne = [];
      if (_.placeholders.length > 0)
        try {
          await Promise.all(
            _.placeholders.map(async (Oe) => {
              const rt = await fetch("/api/characters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: Oe.name,
                  player_name: Oe.role,
                  status: "Placeholder",
                  edition: oe,
                  edition_data: {},
                  is_npc: !0,
                  campaign_id: X.id
                })
              });
              if (!rt.ok) {
                const ht = await rt.text();
                throw new Error(ht || `Failed to create placeholder (${rt.status})`);
              }
            })
          );
        } catch (Oe) {
          console.error("Failed to create placeholder characters", Oe), Ne.push("Placeholder runners were not saved.");
        }
      if (!_.sessionSeed.skip)
        try {
          const Oe = await fetch("/api/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              campaign_id: X.id,
              name: _.sessionSeed.title || "Session 0",
              description: _.sessionSeed.objectives,
              notes: _.sessionSeed.summary,
              session_date: (/* @__PURE__ */ new Date()).toISOString(),
              status: "Planned"
            })
          });
          if (!Oe.ok) {
            const rt = await Oe.text();
            throw new Error(rt || `Failed to create session seed (${Oe.status})`);
          }
        } catch (Oe) {
          console.error("Failed to create session seed", Oe), Ne.push("Session seed could not be created automatically.");
        }
      Ct(), (vt = (de = window.ShadowmasterLegacyApp) == null ? void 0 : de.loadCampaigns) == null || vt.call(de), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), x == null || x(X), nt(!1), Pn({
        type: "success",
        title: `${At} created`,
        description: "Campaign is ready for onboarding."
      }), Ne.length > 0 && Pn({
        type: "warning",
        title: "Campaign created with warnings",
        description: Ne.join(`
`)
      });
    } catch (St) {
      const At = St instanceof Error ? St.message : "Failed to create campaign.";
      Be(At), Pn({
        type: "error",
        title: "Campaign creation failed",
        description: At
      });
    } finally {
      De(!1);
    }
  }
  const La = Te[ue], $i = () => {
    var Se;
    switch (Re) {
      case 0:
        return /* @__PURE__ */ d.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ d.jsx("h4", { children: "Campaign Essentials" }),
          /* @__PURE__ */ d.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ d.jsx("label", { htmlFor: "campaign-name", children: "Campaign Name" }),
              /* @__PURE__ */ d.jsx(
                "input",
                {
                  id: "campaign-name",
                  name: "campaign-name",
                  value: _.name,
                  onChange: (A) => {
                    pe({ type: "UPDATE_FIELD", field: "name", value: A.target.value }), Sn("name");
                  },
                  autoFocus: !0,
                  maxLength: 80,
                  required: !0,
                  placeholder: "e.g., Emerald City Heist",
                  ref: Or,
                  className: jt.name ? "input--invalid" : void 0,
                  "aria-invalid": jt.name ? "true" : "false",
                  "aria-describedby": jt.name ? "campaign-name-error" : void 0
                }
              ),
              /* @__PURE__ */ d.jsx("p", { className: "form-help", children: "This title appears in dashboards, notifications, and session summaries." }),
              jt.name && /* @__PURE__ */ d.jsx("p", { id: "campaign-name-error", className: "form-error", role: "alert", children: jt.name })
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ d.jsx("label", { htmlFor: "campaign-theme", children: "Theme / Tagline" }),
              /* @__PURE__ */ d.jsx(
                "input",
                {
                  id: "campaign-theme",
                  name: "campaign-theme",
                  value: _.theme,
                  onChange: (A) => pe({ type: "UPDATE_FIELD", field: "theme", value: A.target.value }),
                  placeholder: "e.g., Neo-Tokyo corporate intrigue",
                  ref: Hn
                }
              ),
              /* @__PURE__ */ d.jsx("p", { className: "form-help", children: "A short hook that sets tone for players and appears alongside the title." })
            ] })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ d.jsx("label", { htmlFor: "campaign-edition", children: "Edition" }),
              /* @__PURE__ */ d.jsx(
                "select",
                {
                  id: "campaign-edition",
                  name: "campaign-edition",
                  value: oe,
                  onChange: (A) => {
                    const de = A.target.value;
                    F(de), g(de), pt([av(de)]), wt(!1), gn(null), j(de);
                  },
                  children: Me.map((A) => /* @__PURE__ */ d.jsx("option", { value: A.value, children: A.label }, A.value))
                }
              )
            ] }),
            ie.length > 0 && /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ d.jsx("label", { htmlFor: "campaign-gameplay-level", children: "Gameplay Level" }),
              /* @__PURE__ */ d.jsx(
                "select",
                {
                  id: "campaign-gameplay-level",
                  name: "campaign-gameplay-level",
                  value: ge,
                  onChange: (A) => fe(A.target.value),
                  children: ie.map((A) => /* @__PURE__ */ d.jsx("option", { value: A.value, children: A.label }, A.value))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ d.jsx("label", { htmlFor: "campaign-creation-method", children: "Character Creation Method" }),
            /* @__PURE__ */ d.jsx(
              "select",
              {
                id: "campaign-creation-method",
                name: "campaign-creation-method",
                value: ue,
                onChange: (A) => G(A.target.value),
                children: Ge.map((A) => /* @__PURE__ */ d.jsx("option", { value: A.value, children: A.label }, A.value))
              }
            ),
            /* @__PURE__ */ d.jsxs("div", { className: "form-help", children: [
              (La == null ? void 0 : La.description) && /* @__PURE__ */ d.jsx("p", { children: La.description }),
              ue !== "priority" && /* @__PURE__ */ d.jsx("p", { children: "Support for Sum-to-Ten and Karma methods is still under development. Characters will temporarily default to Priority until the new workflows are implemented." })
            ] })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { className: "collapsible", children: [
            /* @__PURE__ */ d.jsxs(
              "button",
              {
                type: "button",
                className: "collapsible__trigger",
                "aria-expanded": xt,
                onClick: () => wt((A) => !A),
                children: [
                  /* @__PURE__ */ d.jsx("span", { children: "Source Books" }),
                  /* @__PURE__ */ d.jsx("span", { className: "collapsible__chevron", "aria-hidden": "true", children: xt ? "▾" : "▸" })
                ]
              }
            ),
            /* @__PURE__ */ d.jsxs(
              "div",
              {
                className: `collapsible__content ${xt ? "collapsible__content--open" : ""}`,
                "aria-live": "polite",
                children: [
                  /* @__PURE__ */ d.jsxs("p", { className: "form-help", children: [
                    "Enable the references that should be legal at your table. ",
                    on,
                    " is always required and stays selected."
                  ] }),
                  cr && /* @__PURE__ */ d.jsx("p", { className: "form-warning", children: cr }),
                  en ? /* @__PURE__ */ d.jsx("p", { className: "form-help", children: "Loading books…" }) : /* @__PURE__ */ d.jsx("div", { className: "book-checkboxes", children: Ye.map((A) => {
                    const de = A.code.toUpperCase(), vt = gt.includes(de), St = de === on;
                    return /* @__PURE__ */ d.jsxs("label", { className: `book-checkbox ${St ? "book-checkbox--locked" : ""}`, children: [
                      /* @__PURE__ */ d.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: vt,
                          disabled: St,
                          onChange: (At) => {
                            const Qt = At.target.checked;
                            pt((T) => {
                              const X = new Set(T.map((Ne) => Ne.toUpperCase()));
                              return Qt ? X.add(de) : X.delete(de), X.has(on) || X.add(on), Array.from(X).sort();
                            });
                          }
                        }
                      ),
                      /* @__PURE__ */ d.jsxs("span", { className: "book-option", children: [
                        A.name,
                        " ",
                        /* @__PURE__ */ d.jsxs("span", { className: "book-code", children: [
                          "(",
                          de,
                          ")"
                        ] }),
                        St && /* @__PURE__ */ d.jsx("span", { className: "book-required", children: "(required)" })
                      ] })
                    ] }, de);
                  }) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ d.jsx("label", { htmlFor: "campaign-gm", children: "Gamemaster" }),
            /* @__PURE__ */ d.jsx(
              "select",
              {
                id: "campaign-gm",
                name: "campaign-gm",
                value: se,
                onChange: (A) => {
                  ce(A.target.value), Sn("gm");
                },
                ref: _n,
                className: jt.gm ? "input--invalid" : void 0,
                "aria-invalid": jt.gm ? "true" : "false",
                "aria-describedby": jt.gm ? "campaign-gm-error" : void 0,
                children: Je.map((A) => /* @__PURE__ */ d.jsx("option", { value: A.value, children: A.label }, A.value))
              }
            ),
            jt.gm && /* @__PURE__ */ d.jsx("p", { id: "campaign-gm-error", className: "form-error", role: "alert", children: jt.gm })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ d.jsx("label", { htmlFor: "campaign-description", children: "Campaign Overview" }),
            /* @__PURE__ */ d.jsx(
              "textarea",
              {
                id: "campaign-description",
                name: "campaign-description",
                value: _.description,
                onChange: (A) => {
                  pe({ type: "UPDATE_FIELD", field: "description", value: A.target.value }), Sn("overview");
                },
                placeholder: "Outline the premise, tone, and first planned arc. Include touchstones players can latch onto.",
                rows: 6,
                ref: Un,
                className: `campaign-form__textarea ${jt.overview ? "input--invalid" : ""}`.trim(),
                "aria-invalid": jt.overview ? "true" : "false",
                "aria-describedby": jt.overview ? "campaign-description-error" : void 0
              }
            ),
            /* @__PURE__ */ d.jsx("p", { className: "form-help", children: "Use this space for the elevator pitch—players will see it at a glance when they open the campaign." }),
            jt.overview && /* @__PURE__ */ d.jsx("p", { id: "campaign-description-error", className: "form-error", role: "alert", children: jt.overview })
          ] })
        ] });
      case 1:
        return /* @__PURE__ */ d.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ d.jsx("h4", { children: "Roster & Roles" }),
          /* @__PURE__ */ d.jsx("p", { children: "Attach existing player characters or create placeholders to represent expected runners." }),
          /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ d.jsx("label", { htmlFor: "campaign-players", children: "Existing Characters" }),
            me.length === 0 ? /* @__PURE__ */ d.jsx("p", { className: "form-help", children: "No characters found yet. You can create placeholders below." }) : /* @__PURE__ */ d.jsx("div", { className: "character-checkboxes", ref: ar, tabIndex: -1, children: me.map((A) => {
              const de = A.player_name ? `${A.name} — ${A.player_name}` : A.name, vt = _.selectedPlayers.includes(A.id);
              return /* @__PURE__ */ d.jsxs("label", { className: "character-checkbox", children: [
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: vt,
                    onChange: (St) => {
                      pe({
                        type: "UPDATE_FIELD",
                        field: "selectedPlayers",
                        value: St.target.checked ? [..._.selectedPlayers, A.id] : _.selectedPlayers.filter((At) => At !== A.id)
                      }), Sn("roster");
                    }
                  }
                ),
                /* @__PURE__ */ d.jsx("span", { children: de }),
                A.status && /* @__PURE__ */ d.jsx("small", { className: "character-status", children: A.status })
              ] }, A.id);
            }) })
          ] }),
          jt.roster && /* @__PURE__ */ d.jsx("p", { className: "form-error", role: "alert", children: jt.roster }),
          /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ d.jsx("label", { children: "Player Characters" }),
            /* @__PURE__ */ d.jsx("p", { className: "form-help", children: "Player selection is coming soon. Use placeholders to capture your expected team composition." }),
            /* @__PURE__ */ d.jsxs("div", { className: "placeholder-list", children: [
              _.placeholders.map((A) => /* @__PURE__ */ d.jsxs("div", { className: "placeholder-card", children: [
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    value: A.name,
                    onChange: (de) => pe({
                      type: "UPDATE_PLACEHOLDER",
                      id: A.id,
                      field: "name",
                      value: de.target.value
                    }),
                    placeholder: "Runner handle"
                  }
                ),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    value: A.role,
                    onChange: (de) => pe({
                      type: "UPDATE_PLACEHOLDER",
                      id: A.id,
                      field: "role",
                      value: de.target.value
                    }),
                    placeholder: "Role / specialty"
                  }
                ),
                /* @__PURE__ */ d.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-link",
                    onClick: () => pe({ type: "REMOVE_PLACEHOLDER", id: A.id }),
                    children: "Remove"
                  }
                )
              ] }, A.id)),
              /* @__PURE__ */ d.jsx(
                "button",
                {
                  type: "button",
                  className: "btn-secondary",
                  onClick: () => {
                    pe({ type: "ADD_PLACEHOLDER" }), Sn("roster", 1);
                  },
                  children: "Add Placeholder"
                }
              )
            ] })
          ] })
        ] });
      case 2:
        return /* @__PURE__ */ d.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ d.jsx("h4", { children: "World Backbone" }),
          /* @__PURE__ */ d.jsx("p", { children: "Capture recurring factions and key locations to anchor your campaign." }),
          /* @__PURE__ */ d.jsx("div", { ref: ea, tabIndex: -1, children: /* @__PURE__ */ d.jsxs("div", { className: "form-grid", children: [
            /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ d.jsx("label", { children: "Factions" }),
              /* @__PURE__ */ d.jsxs("div", { className: "backbone-list", children: [
                _.factions.map((A) => /* @__PURE__ */ d.jsxs("div", { className: "backbone-card", children: [
                  /* @__PURE__ */ d.jsx(
                    "input",
                    {
                      value: A.name,
                      onChange: (de) => pe({
                        type: "UPDATE_FACTION",
                        id: A.id,
                        field: "name",
                        value: de.target.value
                      }),
                      placeholder: "Faction name"
                    }
                  ),
                  /* @__PURE__ */ d.jsx(
                    "input",
                    {
                      value: A.tags,
                      onChange: (de) => pe({
                        type: "UPDATE_FACTION",
                        id: A.id,
                        field: "tags",
                        value: de.target.value
                      }),
                      placeholder: "Tags (corp, gang, fixer...)"
                    }
                  ),
                  /* @__PURE__ */ d.jsx(
                    "textarea",
                    {
                      value: A.notes,
                      onChange: (de) => pe({
                        type: "UPDATE_FACTION",
                        id: A.id,
                        field: "notes",
                        value: de.target.value
                      }),
                      placeholder: "Notes / agenda"
                    }
                  ),
                  /* @__PURE__ */ d.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn-link",
                      onClick: () => pe({ type: "REMOVE_FACTION", id: A.id }),
                      children: "Remove"
                    }
                  )
                ] }, A.id)),
                /* @__PURE__ */ d.jsxs("div", { className: "backbone-actions", children: [
                  /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-secondary", onClick: () => pe({ type: "ADD_FACTION" }), children: "Add Faction" }),
                  /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-link", onClick: Gn, children: "Quick-add template" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ d.jsx("label", { children: "Locations" }),
              /* @__PURE__ */ d.jsxs("div", { className: "backbone-list", children: [
                _.locations.map((A) => /* @__PURE__ */ d.jsxs("div", { className: "backbone-card", children: [
                  /* @__PURE__ */ d.jsx(
                    "input",
                    {
                      value: A.name,
                      onChange: (de) => pe({
                        type: "UPDATE_LOCATION",
                        id: A.id,
                        field: "name",
                        value: de.target.value
                      }),
                      placeholder: "Location name"
                    }
                  ),
                  /* @__PURE__ */ d.jsx(
                    "textarea",
                    {
                      value: A.descriptor,
                      onChange: (de) => pe({
                        type: "UPDATE_LOCATION",
                        id: A.id,
                        field: "descriptor",
                        value: de.target.value
                      }),
                      placeholder: "Descriptor (security rating, vibe...)"
                    }
                  ),
                  /* @__PURE__ */ d.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn-link",
                      onClick: () => pe({ type: "REMOVE_LOCATION", id: A.id }),
                      children: "Remove"
                    }
                  )
                ] }, A.id)),
                /* @__PURE__ */ d.jsxs("div", { className: "backbone-actions", children: [
                  /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-secondary", onClick: () => pe({ type: "ADD_LOCATION" }), children: "Add Location" }),
                  /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-link", onClick: sn, children: "Quick-add template" })
                ] })
              ] })
            ] })
          ] }) }),
          jt.backbone && /* @__PURE__ */ d.jsx("p", { className: "form-error", role: "alert", children: jt.backbone })
        ] });
      case 3:
        return /* @__PURE__ */ d.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ d.jsx("h4", { children: "House Rules & Automation" }),
          /* @__PURE__ */ d.jsx("p", { children: "Toggle planned automation modules or make notes about house rules you plan to apply." }),
          /* @__PURE__ */ d.jsx("div", { className: "automation-grid", children: Bj.map((A) => /* @__PURE__ */ d.jsxs("label", { className: "automation-toggle", children: [
            /* @__PURE__ */ d.jsx(
              "input",
              {
                type: "checkbox",
                checked: !!_.houseRules[A.key],
                onChange: (de) => pe({
                  type: "UPDATE_HOUSE_RULE",
                  key: A.key,
                  value: de.target.checked
                })
              }
            ),
            /* @__PURE__ */ d.jsxs("div", { children: [
              /* @__PURE__ */ d.jsx("strong", { children: A.label }),
              /* @__PURE__ */ d.jsx("p", { children: A.description })
            ] })
          ] }, A.key)) }),
          /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ d.jsx("label", { htmlFor: "house-rule-notes", children: "House Rule Notes" }),
            /* @__PURE__ */ d.jsx(
              "textarea",
              {
                id: "house-rule-notes",
                value: _.houseRuleNotes,
                onChange: (A) => pe({ type: "UPDATE_FIELD", field: "houseRuleNotes", value: A.target.value }),
                placeholder: "Describe any custom rules, optional modules, or reminders.",
                rows: 4
              }
            )
          ] })
        ] });
      case 4:
        return /* @__PURE__ */ d.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ d.jsx("h4", { children: "Session Seed" }),
          /* @__PURE__ */ d.jsxs("div", { ref: Dn, tabIndex: -1, children: [
            /* @__PURE__ */ d.jsxs("label", { className: "skip-toggle", children: [
              /* @__PURE__ */ d.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: _.sessionSeed.skip,
                  onChange: (A) => {
                    pe({
                      type: "UPDATE_SESSION_SEED",
                      field: "skip",
                      value: A.target.checked
                    }), A.target.checked && Sn("sessionSeed", 4);
                  }
                }
              ),
              "Skip session setup for now"
            ] }),
            !_.sessionSeed.skip && /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "session-title", children: "Session Title" }),
                /* @__PURE__ */ d.jsx(
                  "input",
                  {
                    id: "session-title",
                    value: _.sessionSeed.title,
                    onChange: (A) => {
                      pe({
                        type: "UPDATE_SESSION_SEED",
                        field: "title",
                        value: A.target.value
                      }), Sn("sessionSeed", 4);
                    },
                    placeholder: "Session 0: The job offer"
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "session-objectives", children: "Objectives / Notes" }),
                /* @__PURE__ */ d.jsx(
                  "textarea",
                  {
                    id: "session-objectives",
                    value: _.sessionSeed.objectives,
                    onChange: (A) => pe({
                      type: "UPDATE_SESSION_SEED",
                      field: "objectives",
                      value: A.target.value
                    }),
                    placeholder: "List your opening beats, key NPCs, or complications.",
                    rows: 4
                  }
                )
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { children: "Scene Template" }),
                /* @__PURE__ */ d.jsx("div", { className: "session-template-options", children: Vj.map((A) => /* @__PURE__ */ d.jsxs("label", { className: "session-template", children: [
                  /* @__PURE__ */ d.jsx(
                    "input",
                    {
                      type: "radio",
                      name: "session-template",
                      value: A.value,
                      checked: _.sessionSeed.sceneTemplate === A.value,
                      onChange: (de) => pe({
                        type: "UPDATE_SESSION_SEED",
                        field: "sceneTemplate",
                        value: de.target.value
                      })
                    }
                  ),
                  /* @__PURE__ */ d.jsxs("div", { children: [
                    /* @__PURE__ */ d.jsx("strong", { children: A.label }),
                    /* @__PURE__ */ d.jsx("p", { children: A.description })
                  ] })
                ] }, A.value)) })
              ] }),
              /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ d.jsx("label", { htmlFor: "session-summary", children: "Session Summary (what happened)" }),
                /* @__PURE__ */ d.jsx(
                  "textarea",
                  {
                    id: "session-summary",
                    value: _.sessionSeed.summary,
                    onChange: (A) => pe({
                      type: "UPDATE_SESSION_SEED",
                      field: "summary",
                      value: A.target.value
                    }),
                    placeholder: "Quick notes on outcomes once the session wraps.",
                    rows: 3
                  }
                )
              ] })
            ] })
          ] }),
          jt.sessionSeed && !_.sessionSeed.skip && /* @__PURE__ */ d.jsx("p", { className: "form-error", role: "alert", children: jt.sessionSeed })
        ] });
      case 5:
        return /* @__PURE__ */ d.jsxs("section", { className: "campaign-step", children: [
          /* @__PURE__ */ d.jsx("h4", { children: "Review & Launch" }),
          /* @__PURE__ */ d.jsxs("div", { className: "review-grid", children: [
            /* @__PURE__ */ d.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ d.jsx("h5", { children: "Campaign Overview" }),
              /* @__PURE__ */ d.jsxs("ul", { children: [
                /* @__PURE__ */ d.jsxs("li", { children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "Name:" }),
                  " ",
                  _.name || "—"
                ] }),
                /* @__PURE__ */ d.jsxs("li", { children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "Theme:" }),
                  " ",
                  _.theme || "—"
                ] }),
                /* @__PURE__ */ d.jsxs("li", { children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "Edition:" }),
                  " ",
                  oe.toUpperCase()
                ] }),
                /* @__PURE__ */ d.jsxs("li", { children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "Gameplay Level:" }),
                  " ",
                  ge
                ] }),
                /* @__PURE__ */ d.jsxs("li", { children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "Creation Method:" }),
                  " ",
                  ue
                ] }),
                /* @__PURE__ */ d.jsxs("li", { children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "Source Books:" }),
                  " ",
                  Ea.length > 0 ? Ea.join(", ") : on
                ] }),
                /* @__PURE__ */ d.jsxs("li", { children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "GM:" }),
                  " ",
                  ((Se = Je.find((A) => A.value === se)) == null ? void 0 : Se.label) ?? "Unassigned"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ d.jsx("h5", { children: "Roster & World" }),
              /* @__PURE__ */ d.jsxs("p", { children: [
                /* @__PURE__ */ d.jsx("strong", { children: "Placeholders:" }),
                " ",
                _.placeholders.length,
                " ",
                _.placeholders.length > 0 && `(${_.placeholders.map((A) => A.name).join(", ")})`
              ] }),
              /* @__PURE__ */ d.jsxs("p", { children: [
                /* @__PURE__ */ d.jsx("strong", { children: "Factions:" }),
                " ",
                _.factions.length
              ] }),
              /* @__PURE__ */ d.jsxs("p", { children: [
                /* @__PURE__ */ d.jsx("strong", { children: "Locations:" }),
                " ",
                _.locations.length
              ] })
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "review-card", children: [
              /* @__PURE__ */ d.jsx("h5", { children: "Automation & Session" }),
              /* @__PURE__ */ d.jsxs("p", { children: [
                /* @__PURE__ */ d.jsx("strong", { children: "Automation toggles:" }),
                " ",
                Object.entries(_.houseRules).filter(([, A]) => A).map(([A]) => A.replace(/_/g, " ")).join(", ") || "None"
              ] }),
              /* @__PURE__ */ d.jsxs("p", { children: [
                /* @__PURE__ */ d.jsx("strong", { children: "House rule notes:" }),
                " ",
                _.houseRuleNotes || "—"
              ] }),
              /* @__PURE__ */ d.jsxs("p", { children: [
                /* @__PURE__ */ d.jsx("strong", { children: "Session seed:" }),
                " ",
                _.sessionSeed.skip ? "Skipped for now" : `${_.sessionSeed.title} (${_.sessionSeed.sceneTemplate})`
              ] }),
              !_.sessionSeed.skip && _.sessionSeed.objectives && /* @__PURE__ */ d.jsxs("p", { children: [
                /* @__PURE__ */ d.jsx("strong", { children: "Objectives:" }),
                " ",
                _.sessionSeed.objectives
              ] })
            ] })
          ] })
        ] });
      default:
        return null;
    }
  }, yi = Re === 0, gi = Re === fr - 1;
  return D ? gl.createPortal(
    /* @__PURE__ */ d.jsx(
      "section",
      {
        className: `campaign-create-react ${Fe ? "campaign-create-react--open" : "campaign-create-react--collapsed"}`,
        children: Fe ? /* @__PURE__ */ d.jsxs("div", { className: "campaign-wizard", children: [
          /* @__PURE__ */ d.jsxs("div", { className: "campaign-wizard__header", children: [
            /* @__PURE__ */ d.jsx("h3", { children: "Create Campaign" }),
            /* @__PURE__ */ d.jsx("nav", { className: "campaign-wizard__navigation", "aria-label": "Campaign creation steps", children: wE.map((Se, A) => {
              var At;
              const de = Re === A, vt = Re > A, St = !!((At = Rn[A]) != null && At.length);
              return /* @__PURE__ */ d.jsxs(
                "button",
                {
                  type: "button",
                  className: `campaign-wizard__step ${de ? "campaign-wizard__step--active" : ""} ${vt ? "campaign-wizard__step--completed" : ""} ${St ? "campaign-wizard__step--error" : ""}`,
                  onClick: () => {
                    var Qt;
                    ln({}), M(A), (Qt = Rn[A]) != null && Qt.length ? tn(A) : Be(null);
                  },
                  children: [
                    /* @__PURE__ */ d.jsx("span", { className: "campaign-wizard__step-index", children: A + 1 }),
                    /* @__PURE__ */ d.jsx("span", { children: Se }),
                    St && /* @__PURE__ */ d.jsx("span", { className: "campaign-wizard__step-error-indicator", "aria-hidden": "true", children: "!" })
                  ]
                },
                Se
              );
            }) })
          ] }),
          /* @__PURE__ */ d.jsxs("form", { className: "campaign-wizard__form campaign-form", onSubmit: ei, noValidate: !0, children: [
            $i(),
            (((Si = Rn[Re]) == null ? void 0 : Si.length) || be) && /* @__PURE__ */ d.jsx("div", { className: "form-error form-error--banner", role: "alert", "aria-live": "assertive", children: /* @__PURE__ */ d.jsx("ul", { className: "form-error__list", children: (Rn[Re] ?? (be ? [be] : [])).map((Se, A) => /* @__PURE__ */ d.jsx("li", { children: Se }, `step-${Re}-error-${A}`)) }) }),
            /* @__PURE__ */ d.jsxs("div", { className: "campaign-wizard__actions", children: [
              /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-secondary", onClick: un, disabled: we, children: "Cancel" }),
              /* @__PURE__ */ d.jsxs("div", { className: "campaign-wizard__actions-right", children: [
                !yi && /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-secondary", onClick: na, disabled: we, children: "Back" }),
                gi ? /* @__PURE__ */ d.jsx("button", { type: "submit", className: "btn-primary", disabled: we, children: we ? "Creating…" : "Create Campaign" }) : /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-primary", onClick: mn, disabled: we, children: "Next" })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ d.jsxs("div", { className: "campaign-create-trigger", children: [
          /* @__PURE__ */ d.jsxs("div", { className: "campaign-create-trigger__copy", children: [
            /* @__PURE__ */ d.jsx("h3", { children: "Plan Your Next Campaign" }),
            /* @__PURE__ */ d.jsx("p", { children: "Select an edition, assign a GM, and lock in gameplay defaults." })
          ] }),
          /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-primary", onClick: Yt, children: "Create Campaign" })
        ] })
      }
    ),
    D
  ) : null;
}
const Nw = z.forwardRef(
  ({ className: E, variant: x = "default", type: b = "text", ...K }, J) => {
    const j = ["form-input"];
    return x === "search" && j.push("form-input--search"), E && j.push(E), /* @__PURE__ */ d.jsx("input", { ref: J, type: b, className: j.join(" "), ...K });
  }
);
Nw.displayName = "TextInput";
function Yj(E, x, b) {
  const K = b === "asc" ? 1 : -1, J = (re) => re instanceof Date ? re.getTime() : typeof re == "number" ? re : typeof re == "boolean" ? re ? 1 : 0 : re == null ? "" : String(re).toLowerCase(), j = J(E), g = J(x);
  return j < g ? -1 * K : j > g ? 1 * K : 0;
}
function Qj({
  columns: E,
  data: x,
  getRowId: b,
  loading: K = !1,
  emptyState: J,
  enableSearch: j = !0,
  searchPlaceholder: g = "Search…",
  initialSortKey: re,
  initialSortDirection: D = "asc",
  rowClassName: B
}) {
  var ge, fe;
  const oe = z.useMemo(
    () => E.filter((ue) => ue.sortable),
    [E]
  ), F = re ?? ((ge = oe[0]) == null ? void 0 : ge.key) ?? ((fe = E[0]) == null ? void 0 : fe.key) ?? "", [I, ne] = z.useState(F), [ie, Z] = z.useState(D), [me, Ue] = z.useState(""), se = z.useMemo(() => {
    const ue = E.filter((Te) => Te.searchable !== !1), G = x.filter((Te) => !j || !me.trim() ? !0 : ue.some((Le) => {
      const Ge = Le.accessor, ae = Ge ? Ge(Te) : Te[Le.key];
      return ae == null ? !1 : String(ae).toLowerCase().includes(me.toLowerCase());
    }));
    if (!I)
      return G;
    const Ce = E.find((Te) => Te.key === I);
    if (!Ce)
      return G;
    const ve = Ce.accessor;
    return [...G].sort((Te, Le) => {
      const Ge = ve ? ve(Te) : Te[I], ae = ve ? ve(Le) : Le[I];
      return Yj(Ge, ae, ie);
    });
  }, [E, x, j, me, ie, I]);
  function ce(ue) {
    I === ue ? Z((G) => G === "asc" ? "desc" : "asc") : (ne(ue), Z("asc"));
  }
  return /* @__PURE__ */ d.jsxs("div", { className: "data-table-wrapper", children: [
    j && E.length > 0 && /* @__PURE__ */ d.jsx("div", { className: "data-table-toolbar", children: /* @__PURE__ */ d.jsx(
      Nw,
      {
        variant: "search",
        type: "search",
        placeholder: g,
        value: me,
        onChange: (ue) => Ue(ue.target.value),
        "aria-label": "Search table"
      }
    ) }),
    /* @__PURE__ */ d.jsx("div", { className: "data-table-container", children: /* @__PURE__ */ d.jsxs("table", { className: "data-table", children: [
      /* @__PURE__ */ d.jsx("thead", { children: /* @__PURE__ */ d.jsx("tr", { children: E.map((ue) => {
        const G = ue.sortable !== !1, Ce = ue.key === I;
        return /* @__PURE__ */ d.jsxs(
          "th",
          {
            style: { width: ue.width },
            className: [
              ue.align ? `align-${ue.align}` : "",
              G ? "sortable" : "",
              Ce ? `sorted-${ie}` : ""
            ].filter(Boolean).join(" "),
            onClick: () => {
              G && ce(ue.key);
            },
            children: [
              /* @__PURE__ */ d.jsx("span", { children: ue.header }),
              G && /* @__PURE__ */ d.jsx("span", { className: "sort-indicator", "aria-hidden": "true", children: Ce ? ie === "asc" ? "▲" : "▼" : "↕" })
            ]
          },
          ue.key
        );
      }) }) }),
      /* @__PURE__ */ d.jsx("tbody", { children: K ? /* @__PURE__ */ d.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ d.jsx("td", { colSpan: E.length, children: "Loading…" }) }) : se.length === 0 ? /* @__PURE__ */ d.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ d.jsx("td", { colSpan: E.length, children: J || "No records found." }) }) : se.map((ue, G) => /* @__PURE__ */ d.jsx("tr", { className: B == null ? void 0 : B(ue), children: E.map((Ce) => /* @__PURE__ */ d.jsx("td", { className: Ce.align ? `align-${Ce.align}` : void 0, children: Ce.render ? Ce.render(ue) : ue[Ce.key] }, Ce.key)) }, b(ue, G))) })
    ] }) })
  ] });
}
function Wj(E) {
  if (!E)
    return "—";
  const x = Date.parse(E);
  return Number.isNaN(x) ? E : new Date(x).toLocaleDateString();
}
function Gj({
  campaigns: E,
  loading: x,
  error: b,
  onEdit: K,
  onDelete: J,
  currentUser: j,
  actionInFlightId: g
}) {
  const re = z.useMemo(
    () => [
      {
        key: "name",
        header: "Campaign",
        sortable: !0,
        accessor: (D) => D.name
      },
      {
        key: "edition",
        header: "Edition",
        sortable: !0,
        accessor: (D) => D.edition.toUpperCase()
      },
      {
        key: "gameplay_level",
        header: "Gameplay Level",
        sortable: !0,
        accessor: (D) => D.gameplay_level ?? "",
        render: (D) => {
          var B;
          return ((B = D.gameplay_level) == null ? void 0 : B.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "creation_method",
        header: "Creation Method",
        sortable: !0,
        accessor: (D) => D.creation_method,
        render: (D) => {
          var B;
          return ((B = D.creation_method) == null ? void 0 : B.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "gm_name",
        header: "Gamemaster",
        sortable: !0,
        accessor: (D) => D.gm_name ?? "",
        render: (D) => D.gm_name ?? "—"
      },
      {
        key: "status",
        header: "Status",
        sortable: !0,
        accessor: (D) => D.status ?? "",
        render: (D) => /* @__PURE__ */ d.jsx("span", { className: `status-badge status-${(D.status ?? "unknown").toLowerCase()}`, children: D.status ?? "—" })
      },
      {
        key: "updated_at",
        header: "Updated",
        sortable: !0,
        accessor: (D) => D.updated_at ? new Date(D.updated_at) : null,
        render: (D) => Wj(D.updated_at)
      },
      {
        key: "actions",
        header: "Actions",
        sortable: !1,
        align: "right",
        render: (D) => {
          var ne, ie, Z;
          const B = D.can_edit || D.can_delete || (j == null ? void 0 : j.isAdministrator) || D.gm_user_id && ((ne = j == null ? void 0 : j.user) == null ? void 0 : ne.id) === D.gm_user_id, oe = g === D.id, F = (D.can_edit ?? !1) || (j == null ? void 0 : j.isAdministrator) || D.gm_user_id && ((ie = j == null ? void 0 : j.user) == null ? void 0 : ie.id) === D.gm_user_id, I = (D.can_delete ?? !1) || (j == null ? void 0 : j.isAdministrator) || D.gm_user_id && ((Z = j == null ? void 0 : j.user) == null ? void 0 : Z.id) === D.gm_user_id;
          return /* @__PURE__ */ d.jsxs("div", { className: "table-actions", children: [
            /* @__PURE__ */ d.jsx(
              "button",
              {
                type: "button",
                className: "button button--table",
                onClick: () => K(D),
                disabled: oe || !B || !F,
                children: "Edit"
              }
            ),
            /* @__PURE__ */ d.jsx(
              "button",
              {
                type: "button",
                className: "button button--table button--danger",
                onClick: () => J(D),
                disabled: oe || !B || !I,
                children: "Delete"
              }
            )
          ] });
        }
      }
    ],
    [g, j, J, K]
  );
  return /* @__PURE__ */ d.jsxs("div", { className: "campaign-table", children: [
    b && /* @__PURE__ */ d.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: b }),
    /* @__PURE__ */ d.jsx(
      Qj,
      {
        columns: re,
        data: E,
        loading: x,
        getRowId: (D) => D.id,
        emptyState: "No campaigns yet. Create one to get started!",
        searchPlaceholder: "Search campaigns…"
      }
    )
  ] });
}
const Kj = ["Active", "Paused", "Completed"];
function TE(E) {
  return E ? E.replace(/[_-]+/g, " ").split(" ").filter(Boolean).map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join(" ") : "";
}
function Cw(E) {
  if (!E) return null;
  const x = new Date(E);
  return Number.isNaN(x.getTime()) ? null : new Intl.DateTimeFormat(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(x);
}
function qj({ campaign: E, gmUsers: x, gameplayRules: b, onClose: K, onSave: J }) {
  var ae, Fe, nt;
  const { loadCampaignCharacterCreation: j } = Kf(), [g, re] = z.useState(E.name), [D, B] = z.useState(E.gm_user_id ?? ""), [oe, F] = z.useState(E.status ?? "Active"), [I, ne] = z.useState(() => {
    if (!E.house_rules) return "";
    try {
      return JSON.stringify(JSON.parse(E.house_rules), null, 2);
    } catch {
      return E.house_rules;
    }
  }), [ie, Z] = z.useState(!1), [me, Ue] = z.useState(null), se = z.useMemo(() => x.length === 0 ? [{ label: "No gamemasters found", value: "" }] : x.map((we) => ({
    label: `${we.username} (${we.email})`,
    value: we.id
  })), [x]), ce = z.useMemo(() => {
    if (!I.trim())
      return {};
    try {
      return JSON.parse(I);
    } catch {
      return { raw: I.trim() };
    }
  }, [I]);
  z.useEffect(() => {
    re(E.name), B(E.gm_user_id ?? ""), F(E.status ?? "Active"), ne(() => {
      if (!E.house_rules) return "";
      try {
        return JSON.stringify(JSON.parse(E.house_rules), null, 2);
      } catch {
        return E.house_rules;
      }
    });
  }, [E]);
  const ge = ie || g.trim().length === 0 || x.length > 0 && !D;
  async function fe(we) {
    if (we.preventDefault(), !ge) {
      Z(!0), Ue(null);
      try {
        const De = x.find((be) => be.id === D);
        await J({
          name: g.trim(),
          gm_user_id: D || void 0,
          gm_name: (De == null ? void 0 : De.username) ?? (De == null ? void 0 : De.email) ?? "",
          status: oe,
          house_rules: I.trim()
        }), await j(E.id), K();
      } catch (De) {
        const be = De instanceof Error ? De.message : "Failed to update campaign.";
        Ue(be);
      } finally {
        Z(!1);
      }
    }
  }
  const ue = ((ae = E.edition) == null ? void 0 : ae.toUpperCase()) ?? "SR5", G = TE(E.creation_method), Ce = (b == null ? void 0 : b.label) ?? TE(E.gameplay_level ?? "Experienced"), ve = Object.entries(ce.automation ?? {}).filter(
    ([, we]) => we
  ), Te = (((Fe = ce.factions) == null ? void 0 : Fe.length) ?? 0) > 0 || (((nt = ce.locations) == null ? void 0 : nt.length) ?? 0) > 0, Le = ce.session_seed, Ge = ce.placeholders ?? [];
  return /* @__PURE__ */ d.jsxs("div", { className: "campaign-manage", children: [
    /* @__PURE__ */ d.jsx("div", { className: "campaign-manage__backdrop", "aria-hidden": "true" }),
    /* @__PURE__ */ d.jsxs(
      "section",
      {
        className: "campaign-manage__panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "campaign-manage-heading",
        children: [
          /* @__PURE__ */ d.jsxs("header", { className: "campaign-manage__header", children: [
            /* @__PURE__ */ d.jsxs("div", { children: [
              /* @__PURE__ */ d.jsx("h3", { id: "campaign-manage-heading", children: E.name }),
              /* @__PURE__ */ d.jsxs("p", { className: "campaign-manage__subtitle", children: [
                ue,
                " · ",
                G,
                " · ",
                Ce
              ] })
            ] }),
            /* @__PURE__ */ d.jsxs("div", { className: "campaign-manage__header-actions", children: [
              /* @__PURE__ */ d.jsx("span", { className: `pill pill--status-${oe.toLowerCase()}`, children: oe }),
              /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-secondary", onClick: K, children: "Close" })
            ] })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { className: "campaign-manage__body", children: [
            /* @__PURE__ */ d.jsxs("form", { className: "campaign-manage__form campaign-form", onSubmit: fe, children: [
              /* @__PURE__ */ d.jsxs("section", { children: [
                /* @__PURE__ */ d.jsx("h4", { className: "campaign-manage__section-title", children: "Basics" }),
                /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                  /* @__PURE__ */ d.jsx("label", { htmlFor: "edit-campaign-name", children: "Campaign Name" }),
                  /* @__PURE__ */ d.jsx(
                    "input",
                    {
                      id: "edit-campaign-name",
                      name: "campaign-name",
                      value: g,
                      onChange: (we) => re(we.target.value),
                      required: !0
                    }
                  )
                ] }),
                /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                  /* @__PURE__ */ d.jsx("label", { htmlFor: "edit-campaign-gm", children: "Gamemaster" }),
                  /* @__PURE__ */ d.jsx(
                    "select",
                    {
                      id: "edit-campaign-gm",
                      name: "campaign-gm",
                      value: D,
                      onChange: (we) => B(we.target.value),
                      children: se.map((we) => /* @__PURE__ */ d.jsx("option", { value: we.value, children: we.label }, we.value))
                    }
                  )
                ] }),
                /* @__PURE__ */ d.jsxs("div", { className: "form-group", children: [
                  /* @__PURE__ */ d.jsx("label", { htmlFor: "edit-campaign-status", children: "Status" }),
                  /* @__PURE__ */ d.jsx(
                    "select",
                    {
                      id: "edit-campaign-status",
                      name: "campaign-status",
                      value: oe,
                      onChange: (we) => F(we.target.value),
                      children: Kj.map((we) => /* @__PURE__ */ d.jsx("option", { value: we, children: we }, we))
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ d.jsxs("section", { children: [
                /* @__PURE__ */ d.jsx("h4", { className: "campaign-manage__section-title", children: "House Rules" }),
                /* @__PURE__ */ d.jsx(
                  "textarea",
                  {
                    id: "edit-campaign-house-rules",
                    name: "campaign-house-rules",
                    rows: 8,
                    value: I,
                    onChange: (we) => ne(we.target.value),
                    placeholder: "Examples: Initiative edge, downtime pacing, advancement tweaks…"
                  }
                ),
                /* @__PURE__ */ d.jsx("small", { children: "JSON is supported; we’ll store exactly what you paste." })
              ] }),
              me && /* @__PURE__ */ d.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: me }),
              /* @__PURE__ */ d.jsxs("div", { className: "campaign-manage__actions", children: [
                /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-secondary", onClick: K, children: "Cancel" }),
                /* @__PURE__ */ d.jsx("button", { type: "submit", className: "btn-primary", disabled: ge, children: ie ? "Saving…" : "Save Changes" })
              ] })
            ] }),
            /* @__PURE__ */ d.jsxs("aside", { className: "campaign-manage__aside", children: [
              /* @__PURE__ */ d.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ d.jsx("h4", { children: "Roster" }),
                Ge.length > 0 ? /* @__PURE__ */ d.jsx("ul", { className: "campaign-manage__list", children: Ge.map((we, De) => /* @__PURE__ */ d.jsxs("li", { children: [
                  /* @__PURE__ */ d.jsx("strong", { children: we.name || `Runner ${De + 1}` }),
                  we.role && /* @__PURE__ */ d.jsxs("span", { children: [
                    " — ",
                    we.role
                  ] })
                ] }, we.name || De)) }) : /* @__PURE__ */ d.jsx("p", { children: "No placeholder runners captured." })
              ] }),
              /* @__PURE__ */ d.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ d.jsx("h4", { children: "Campaign Overview" }),
                /* @__PURE__ */ d.jsxs("dl", { children: [
                  /* @__PURE__ */ d.jsxs("div", { children: [
                    /* @__PURE__ */ d.jsx("dt", { children: "Edition" }),
                    /* @__PURE__ */ d.jsx("dd", { children: ue })
                  ] }),
                  /* @__PURE__ */ d.jsxs("div", { children: [
                    /* @__PURE__ */ d.jsx("dt", { children: "Creation Method" }),
                    /* @__PURE__ */ d.jsx("dd", { children: G })
                  ] }),
                  /* @__PURE__ */ d.jsxs("div", { children: [
                    /* @__PURE__ */ d.jsx("dt", { children: "Gameplay Level" }),
                    /* @__PURE__ */ d.jsx("dd", { children: Ce })
                  ] }),
                  /* @__PURE__ */ d.jsxs("div", { children: [
                    /* @__PURE__ */ d.jsx("dt", { children: "Status" }),
                    /* @__PURE__ */ d.jsx("dd", { children: oe })
                  ] }),
                  /* @__PURE__ */ d.jsxs("div", { children: [
                    /* @__PURE__ */ d.jsx("dt", { children: "Created" }),
                    /* @__PURE__ */ d.jsx("dd", { children: Cw(E.created_at) ?? "Unknown" })
                  ] }),
                  /* @__PURE__ */ d.jsxs("div", { children: [
                    /* @__PURE__ */ d.jsx("dt", { children: "Last Updated" }),
                    /* @__PURE__ */ d.jsx("dd", { children: Cw(E.updated_at) ?? "Unknown" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ d.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ d.jsx("h4", { children: "Source Books" }),
                E.enabled_books.length > 0 ? /* @__PURE__ */ d.jsx("ul", { className: "campaign-manage__list", children: E.enabled_books.map((we) => /* @__PURE__ */ d.jsx("li", { children: /* @__PURE__ */ d.jsx("span", { className: "pill pill--muted", children: we }) }, we)) }) : /* @__PURE__ */ d.jsx("p", { children: "No additional source books enabled." }),
                /* @__PURE__ */ d.jsx("small", { className: "campaign-manage__hint", children: "Book availability is locked after creation for fairness." })
              ] }),
              /* @__PURE__ */ d.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ d.jsx("h4", { children: "House Rule Snapshot" }),
                ce.theme && /* @__PURE__ */ d.jsxs("p", { children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "Theme:" }),
                  " ",
                  ce.theme
                ] }),
                ve.length > 0 ? /* @__PURE__ */ d.jsxs("div", { children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "Automation:" }),
                  /* @__PURE__ */ d.jsx("ul", { className: "campaign-manage__list", children: ve.map(([we]) => /* @__PURE__ */ d.jsx("li", { children: TE(we) }, we)) })
                ] }) : /* @__PURE__ */ d.jsx("p", { children: "No automation modules toggled." }),
                ce.notes && /* @__PURE__ */ d.jsxs("p", { className: "campaign-manage__notes", children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "Notes:" }),
                  " ",
                  ce.notes
                ] }),
                ce.raw && /* @__PURE__ */ d.jsxs("p", { className: "campaign-manage__notes", children: [
                  /* @__PURE__ */ d.jsx("strong", { children: "Notes:" }),
                  " ",
                  ce.raw
                ] })
              ] }),
              /* @__PURE__ */ d.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ d.jsx("h4", { children: "World Backbone" }),
                Te ? /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
                  ce.factions && ce.factions.length > 0 && /* @__PURE__ */ d.jsxs("div", { className: "campaign-manage__sublist", children: [
                    /* @__PURE__ */ d.jsx("strong", { children: "Factions" }),
                    /* @__PURE__ */ d.jsx("ul", { children: ce.factions.map((we) => /* @__PURE__ */ d.jsxs("li", { children: [
                      /* @__PURE__ */ d.jsx("span", { children: we.name }),
                      we.tags && /* @__PURE__ */ d.jsxs("small", { children: [
                        " · ",
                        we.tags
                      ] }),
                      we.notes && /* @__PURE__ */ d.jsx("p", { children: we.notes })
                    ] }, we.id ?? we.name)) })
                  ] }),
                  ce.locations && ce.locations.length > 0 && /* @__PURE__ */ d.jsxs("div", { className: "campaign-manage__sublist", children: [
                    /* @__PURE__ */ d.jsx("strong", { children: "Locations" }),
                    /* @__PURE__ */ d.jsx("ul", { children: ce.locations.map((we) => /* @__PURE__ */ d.jsxs("li", { children: [
                      /* @__PURE__ */ d.jsx("span", { children: we.name }),
                      we.descriptor && /* @__PURE__ */ d.jsx("p", { children: we.descriptor })
                    ] }, we.id ?? we.name)) })
                  ] })
                ] }) : /* @__PURE__ */ d.jsx("p", { children: "No factions or locations captured yet." })
              ] }),
              /* @__PURE__ */ d.jsxs("section", { className: "campaign-manage__card", children: [
                /* @__PURE__ */ d.jsx("h4", { children: "Session Seed" }),
                Le != null && Le.skip ? /* @__PURE__ */ d.jsx("p", { children: "Session planning skipped for now." }) : Le ? /* @__PURE__ */ d.jsxs("ul", { className: "campaign-manage__list", children: [
                  /* @__PURE__ */ d.jsxs("li", { children: [
                    /* @__PURE__ */ d.jsx("strong", { children: "Title:" }),
                    " ",
                    Le.title || "Session 0"
                  ] }),
                  Le.sceneTemplate && /* @__PURE__ */ d.jsxs("li", { children: [
                    /* @__PURE__ */ d.jsx("strong", { children: "Template:" }),
                    " ",
                    Le.sceneTemplate
                  ] }),
                  Le.objectives && /* @__PURE__ */ d.jsxs("li", { children: [
                    /* @__PURE__ */ d.jsx("strong", { children: "Objectives:" }),
                    " ",
                    Le.objectives
                  ] }),
                  Le.summary && /* @__PURE__ */ d.jsxs("li", { children: [
                    /* @__PURE__ */ d.jsx("strong", { children: "Summary:" }),
                    " ",
                    Le.summary
                  ] })
                ] }) : /* @__PURE__ */ d.jsx("p", { children: "No session seed recorded." })
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
}
const Xj = "campaigns-list";
async function ty(E, x = {}) {
  const b = new Headers(x.headers || {});
  x.body && !b.has("Content-Type") && b.set("Content-Type", "application/json");
  const K = await fetch(E, {
    ...x,
    headers: b,
    credentials: "include"
  });
  if (!K.ok) {
    const J = await K.text();
    throw new Error(J || `Request failed (${K.status})`);
  }
  return K.status === 204 ? {} : await K.json();
}
function Jj({ targetId: E = Xj }) {
  const [x, b] = z.useState(null), [K, J] = z.useState([]), [j, g] = z.useState(!1), [re, D] = z.useState(null), [B, oe] = z.useState(null), [F, I] = z.useState(null), [ne, ie] = z.useState(null), [Z, me] = z.useState(null), [Ue, se] = z.useState([]), [ce, ge] = z.useState(
    window.ShadowmasterAuth ?? null
  );
  z.useEffect(() => {
    b(document.getElementById(E));
  }, [E]), z.useEffect(() => (document.body.classList.add("react-campaign-enabled"), () => {
    document.body.classList.remove("react-campaign-enabled");
  }), []);
  const fe = z.useCallback(async () => {
    g(!0), D(null);
    try {
      const ve = await ty("/api/campaigns");
      J(Array.isArray(ve) ? ve : []);
    } catch (ve) {
      const Te = ve instanceof Error ? ve.message : "Failed to load campaigns.";
      D(Te), J([]);
    } finally {
      g(!1);
    }
  }, []), ue = z.useCallback(async () => {
    try {
      const ve = await ty("/api/users?role=gamemaster,administrator");
      se(Array.isArray(ve) ? ve : []);
    } catch (ve) {
      console.warn("Failed to load gamemaster roster", ve), se([]);
    }
  }, []);
  z.useEffect(() => {
    fe(), ue();
  }, [fe, ue]), z.useEffect(() => {
    const ve = () => {
      fe();
    };
    return window.addEventListener("shadowmaster:campaigns:refresh", ve), () => {
      window.removeEventListener("shadowmaster:campaigns:refresh", ve);
    };
  }, [fe]), z.useEffect(() => (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
    loadCampaigns: () => {
      fe();
    }
  }), () => {
    window.ShadowmasterLegacyApp && (window.ShadowmasterLegacyApp.loadCampaigns = void 0);
  }), [fe]), z.useEffect(() => {
    const ve = (Te) => {
      const Le = Te.detail;
      ge(Le ?? null);
    };
    return window.addEventListener("shadowmaster:auth", ve), () => {
      window.removeEventListener("shadowmaster:auth", ve);
    };
  }, []), z.useEffect(() => {
    if (!F)
      return;
    const ve = window.setTimeout(() => I(null), 4e3);
    return () => window.clearTimeout(ve);
  }, [F]);
  const G = z.useCallback(
    async (ve) => {
      if (!(!ve.can_delete && !(ce != null && ce.isAdministrator) || !window.confirm(
        `Delete campaign "${ve.name}"? This action cannot be undone.`
      ))) {
        oe(null), I(null), ie(ve.id);
        try {
          await ty(`/api/campaigns/${ve.id}`, { method: "DELETE" }), I(`Campaign "${ve.name}" deleted.`), await fe(), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh"));
        } catch (Le) {
          const Ge = Le instanceof Error ? Le.message : "Failed to delete campaign.";
          oe(Ge);
        } finally {
          ie(null);
        }
      }
    },
    [ce == null ? void 0 : ce.isAdministrator, fe]
  ), Ce = z.useCallback(
    async (ve) => {
      if (Z) {
        oe(null), I(null), ie(Z.id);
        try {
          const Te = JSON.stringify({
            name: ve.name,
            gm_name: ve.gm_name,
            gm_user_id: ve.gm_user_id,
            status: ve.status,
            house_rules: ve.house_rules,
            enabled_books: ve.enabled_books
          }), Le = await ty(`/api/campaigns/${Z.id}`, {
            method: "PUT",
            body: Te
          });
          J(
            (Ge) => Ge.map((ae) => ae.id === Le.id ? Le : ae)
          ), I(`Campaign "${Le.name}" updated.`), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), me(null);
        } catch (Te) {
          const Le = Te instanceof Error ? Te.message : "Failed to update campaign.";
          oe(Le);
        } finally {
          ie(null);
        }
      }
    },
    [Z]
  );
  return x ? gl.createPortal(
    /* @__PURE__ */ d.jsxs("section", { className: "campaigns-react-shell", children: [
      F && /* @__PURE__ */ d.jsx("p", { className: "campaigns-table__status", children: F }),
      B && /* @__PURE__ */ d.jsx("p", { className: "campaigns-table__error", children: B }),
      /* @__PURE__ */ d.jsx(
        Gj,
        {
          campaigns: K,
          loading: j,
          error: re,
          onEdit: (ve) => me(ve),
          onDelete: G,
          currentUser: ce,
          actionInFlightId: ne
        }
      ),
      Z && /* @__PURE__ */ d.jsx(
        qj,
        {
          campaign: Z,
          gmUsers: Ue,
          gameplayRules: Z.gameplay_rules,
          onClose: () => me(null),
          onSave: Ce
        }
      )
    ] }),
    x
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
function Zj() {
  const E = window.location.hash.replace("#", "").toLowerCase(), x = ry.find((b) => b.key === E);
  return (x == null ? void 0 : x.key) ?? "characters";
}
function eN(E) {
  z.useEffect(() => {
    ry.forEach(({ key: x, targetId: b }) => {
      const K = document.getElementById(b);
      K && (x === E ? (K.removeAttribute("hidden"), K.classList.add("main-tab-panel--active"), K.style.display = "", K.setAttribute("data-active-tab", x)) : (K.setAttribute("hidden", "true"), K.classList.remove("main-tab-panel--active"), K.style.display = "none", K.removeAttribute("data-active-tab")));
    });
  }, [E]);
}
function tN() {
  const [E, x] = z.useState(null), [b, K] = z.useState(() => Zj());
  z.useEffect(() => {
    x(document.getElementById("main-navigation-root"));
  }, []), eN(b), z.useEffect(() => {
    window.history.replaceState(null, "", `#${b}`);
  }, [b]);
  const J = z.useMemo(
    () => {
      var j;
      return ((j = ry.find((g) => g.key === b)) == null ? void 0 : j.description) ?? "";
    },
    [b]
  );
  return E ? gl.createPortal(
    /* @__PURE__ */ d.jsxs("nav", { className: "main-tabs", role: "tablist", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ d.jsx("div", { className: "main-tabs__list", children: ry.map((j) => {
        const g = j.key === b;
        return /* @__PURE__ */ d.jsx(
          "button",
          {
            role: "tab",
            id: `tab-${j.key}`,
            "aria-selected": g,
            "aria-controls": j.targetId,
            className: `main-tabs__tab${g ? " main-tabs__tab--active" : ""}`,
            onClick: () => K(j.key),
            type: "button",
            children: j.label
          },
          j.key
        );
      }) }),
      /* @__PURE__ */ d.jsx("p", { className: "main-tabs__summary", role: "status", children: J })
    ] }),
    E
  ) : null;
}
const ro = ["magic", "metatype", "attributes", "skills", "resources"], uc = ["A", "B", "C", "D", "E"], nN = {
  magic: "Magic",
  metatype: "Metatype",
  attributes: "Attributes",
  skills: "Skills",
  resources: "Resources"
};
function Dw(E) {
  return nN[E];
}
function Ow(E, x) {
  var K;
  const b = (K = E == null ? void 0 : E.priorities) == null ? void 0 : K[x];
  return b ? uc.map((J) => {
    const j = b[J] ?? { label: `Priority ${J}` };
    return { code: J, option: j };
  }) : uc.map((J) => ({
    code: J,
    option: { label: `Priority ${J}` }
  }));
}
function rN() {
  return {
    magic: "",
    metatype: "",
    attributes: "",
    skills: "",
    resources: ""
  };
}
function Lw(E) {
  return ro.reduce((x, b) => {
    const K = E[b];
    return K && x.push(K), x;
  }, []);
}
function bw(E) {
  const x = new Set(Lw(E));
  return uc.filter((b) => !x.has(b));
}
function aN(E) {
  return Lw(E).length === uc.length;
}
function Mw(E) {
  return E ? E.summary || E.description || E.label || "" : "Drag a priority letter from the pool into this category.";
}
function iN(E) {
  if (!E)
    return "";
  const x = E.toLowerCase().trim().replace(/[\s-]+/g, "_");
  switch (x) {
    case "sumtotten":
    case "sum2ten":
    case "sum_to10":
      return "sum_to_ten";
    case "point_buy":
    case "pointbuy":
      return "karma";
    default:
      return x;
  }
}
function Aw(E) {
  return Object.fromEntries(
    Object.entries(E).map(([x, b]) => [x, b || null])
  );
}
function zw() {
  var K, J;
  const E = rN();
  if (typeof window > "u")
    return E;
  const x = (J = (K = window.ShadowmasterLegacyApp) == null ? void 0 : K.getPriorities) == null ? void 0 : J.call(K);
  if (!x)
    return E;
  const b = { ...E };
  for (const j of ro) {
    const g = x[j];
    typeof g == "string" && g.length === 1 && (b[j] = g);
  }
  return b;
}
function ww() {
  const E = zw();
  return ro.some((b) => E[b]) || (E.magic = "A", E.metatype = "B", E.attributes = "C", E.skills = "D", E.resources = "E"), E;
}
function lN() {
  const {
    characterCreationData: E,
    activeEdition: x,
    isLoading: b,
    error: K,
    campaignGameplayRules: J,
    campaignLoading: j,
    campaignError: g,
    campaignCreationMethod: re
  } = Kf(), D = z.useMemo(
    () => (E == null ? void 0 : E.creation_methods) ?? {},
    [E == null ? void 0 : E.creation_methods]
  ), B = z.useMemo(() => {
    const oe = iN(re);
    if (oe && D[oe])
      return oe;
    if (D.priority)
      return "priority";
    const F = Object.keys(D);
    return F.length > 0 ? F[0] : "priority";
  }, [re, D]);
  return B === "sum_to_ten" && D.sum_to_ten ? /* @__PURE__ */ d.jsx(
    sN,
    {
      characterCreationData: E,
      creationMethod: D.sum_to_ten,
      activeEditionLabel: x.label,
      isLoading: b,
      error: K,
      campaignGameplayRules: J,
      campaignLoading: j,
      campaignError: g
    }
  ) : B === "karma" && D.karma ? /* @__PURE__ */ d.jsx(
    cN,
    {
      characterCreationData: E,
      creationMethod: D.karma,
      activeEditionLabel: x.label,
      isLoading: b,
      error: K,
      campaignGameplayRules: J,
      campaignLoading: j,
      campaignError: g
    }
  ) : /* @__PURE__ */ d.jsx(
    oN,
    {
      characterCreationData: E,
      activeEditionLabel: x.label,
      isLoading: b,
      error: K,
      campaignGameplayRules: J,
      campaignLoading: j,
      campaignError: g
    }
  );
}
function oN({
  characterCreationData: E,
  activeEditionLabel: x,
  isLoading: b,
  error: K,
  campaignGameplayRules: J,
  campaignLoading: j,
  campaignError: g
}) {
  const [re, D] = z.useState(() => zw()), [B, oe] = z.useState(null), F = z.useRef({});
  z.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), z.useEffect(() => {
    var G, Ce;
    (Ce = (G = window.ShadowmasterLegacyApp) == null ? void 0 : G.setPriorities) == null || Ce.call(G, Aw(re));
  }, [re]);
  const I = z.useMemo(() => bw(re), [re]), ne = aN(re);
  function ie(G) {
    D((Ce) => {
      const ve = { ...Ce };
      for (const Te of ro)
        ve[Te] === G && (ve[Te] = "");
      return ve;
    });
  }
  function Z(G, Ce) {
    Ce.dataTransfer.effectAllowed = "move", oe({ source: "pool", priority: G }), Ce.dataTransfer.setData("text/plain", G);
  }
  function me(G, Ce, ve) {
    ve.dataTransfer.effectAllowed = "move", oe({ source: "dropzone", category: G, priority: Ce }), ve.dataTransfer.setData("text/plain", Ce);
  }
  function Ue() {
    oe(null);
  }
  function se(G, Ce) {
    Ce.preventDefault();
    const ve = Ce.dataTransfer.getData("text/plain") || (B == null ? void 0 : B.priority) || "";
    if (!ve) {
      Ue();
      return;
    }
    D((Te) => {
      const Le = { ...Te };
      for (const Ge of ro)
        Le[Ge] === ve && (Le[Ge] = "");
      return Le[G] = ve, Le;
    }), Ue();
  }
  function ce(G, Ce) {
    Ce.preventDefault();
    const ve = F.current[G];
    ve && ve.classList.add("active");
  }
  function ge(G) {
    const Ce = F.current[G];
    Ce && Ce.classList.remove("active");
  }
  function fe(G) {
    const Ce = F.current[G];
    Ce && Ce.classList.remove("active");
  }
  function ue(G) {
    const Ce = I[0];
    if (!Ce) {
      ie(G);
      return;
    }
    D((ve) => {
      const Te = { ...ve };
      for (const Le of ro)
        Te[Le] === G && (Te[Le] = "");
      return Te[Ce] = G, Te;
    });
  }
  return /* @__PURE__ */ d.jsxs("div", { className: "react-priority-wrapper", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ d.jsxs("span", { children: [
        "Priority Assignment — ",
        /* @__PURE__ */ d.jsx("strong", { children: x })
      ] }),
      /* @__PURE__ */ d.jsx("span", { children: g ? `Campaign defaults unavailable: ${g}` : j ? "Applying campaign defaults…" : b ? "Loading priority data…" : K ? `Error: ${K}` : "Drag letters into categories" })
    ] }),
    J && /* @__PURE__ */ d.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ d.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        J.label
      ] }),
      J.description && /* @__PURE__ */ d.jsx("p", { children: J.description })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "react-priority-layout", children: [
      /* @__PURE__ */ d.jsxs("aside", { className: "react-priority-pool", children: [
        /* @__PURE__ */ d.jsx("h4", { children: "Available Priorities" }),
        /* @__PURE__ */ d.jsx(
          "div",
          {
            className: "react-priority-dropzone",
            onDragOver: (G) => {
              G.preventDefault(), oe((Ce) => Ce && { ...Ce, category: void 0 });
            },
            onDrop: (G) => {
              G.preventDefault();
              const Ce = G.dataTransfer.getData("text/plain") || (B == null ? void 0 : B.priority) || "";
              Ce && ie(Ce), Ue();
            },
            children: /* @__PURE__ */ d.jsx("div", { className: "react-priority-chips", children: uc.map((G) => {
              const Ce = !bw(re).includes(G), ve = (B == null ? void 0 : B.priority) === G && B.source === "pool";
              return /* @__PURE__ */ d.jsx(
                "div",
                {
                  className: `react-priority-chip ${Ce ? "used" : ""} ${ve ? "dragging" : ""}`,
                  draggable: !Ce,
                  onDragStart: (Te) => !Ce && Z(G, Te),
                  onDragEnd: Ue,
                  onClick: () => ue(G),
                  role: "button",
                  tabIndex: Ce ? -1 : 0,
                  onKeyDown: (Te) => {
                    !Ce && (Te.key === "Enter" || Te.key === " ") && (Te.preventDefault(), ue(G));
                  },
                  children: G
                },
                G
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ d.jsx("section", { className: "react-priority-dropzones", children: ro.map((G) => {
        const Ce = Dw(G), ve = Ow(E, G), Te = re[G], Le = ve.find((ae) => ae.code === Te), Ge = (B == null ? void 0 : B.source) === "dropzone" && B.category === G;
        return /* @__PURE__ */ d.jsxs(
          "div",
          {
            ref: (ae) => {
              F.current[G] = ae;
            },
            className: `react-priority-dropzone ${Te ? "filled" : ""}`,
            onDragOver: (ae) => ce(G, ae),
            onDragLeave: () => ge(G),
            onDrop: (ae) => {
              se(G, ae), fe(G);
            },
            children: [
              /* @__PURE__ */ d.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ d.jsx("span", { children: Ce }),
                Te && /* @__PURE__ */ d.jsxs("span", { children: [
                  Te,
                  " — ",
                  (Le == null ? void 0 : Le.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ d.jsx("div", { className: "react-priority-description", children: Mw(Le == null ? void 0 : Le.option) }),
              Te ? /* @__PURE__ */ d.jsx(
                "div",
                {
                  className: `react-priority-chip ${Ge ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (ae) => me(G, Te, ae),
                  onDragEnd: Ue,
                  onDoubleClick: () => ie(Te),
                  children: Te
                }
              ) : /* @__PURE__ */ d.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          G
        );
      }) })
    ] }),
    /* @__PURE__ */ d.jsx(
      "div",
      {
        className: `react-priority-status ${ne ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: ne ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${I.join(", ")}`
      }
    )
  ] });
}
const uN = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  E: 0
};
function sN({
  characterCreationData: E,
  creationMethod: x,
  activeEditionLabel: b,
  isLoading: K,
  error: J,
  campaignGameplayRules: j,
  campaignLoading: g,
  campaignError: re
}) {
  const [D, B] = z.useState(() => ww());
  z.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), z.useEffect(() => {
    var ge, fe;
    (fe = (ge = window.ShadowmasterLegacyApp) == null ? void 0 : ge.setPriorities) == null || fe.call(ge, Aw(D));
  }, [D]);
  const oe = z.useMemo(() => {
    const ge = { ...uN };
    return uc.forEach((fe) => {
      var G;
      const ue = (G = x.priority_costs) == null ? void 0 : G[fe];
      typeof ue == "number" && (ge[fe] = ue);
    }), ge;
  }, [x.priority_costs]), F = x.point_budget ?? 10, I = z.useMemo(() => ro.reduce((ge, fe) => {
    const ue = D[fe];
    return ge + (ue ? oe[ue] ?? 0 : 0);
  }, 0), [D, oe]), ne = F - I, ie = z.useMemo(
    () => ro.every((ge) => !!D[ge]),
    [D]
  ), Z = ie && ne === 0 ? "success" : ne < 0 ? "error" : "warning", me = ie ? ne > 0 ? `Spend the remaining ${ne} point${ne === 1 ? "" : "s"}.` : ne < 0 ? `Over budget by ${Math.abs(ne)} point${Math.abs(ne) === 1 ? "" : "s"}.` : "✓ All priorities assigned. You can proceed to metatype selection." : "Select a priority letter for each category.";
  function Ue(ge, fe) {
    B((ue) => ({
      ...ue,
      [ge]: fe
    }));
  }
  function se(ge, fe) {
    const ue = fe.target.value, G = ue ? ue.toUpperCase() : "";
    Ue(ge, G);
  }
  function ce() {
    B(ww());
  }
  return /* @__PURE__ */ d.jsxs("div", { className: "react-priority-wrapper sum-to-ten-wrapper", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ d.jsxs("span", { children: [
        "Sum-to-Ten Assignment — ",
        /* @__PURE__ */ d.jsx("strong", { children: b })
      ] }),
      /* @__PURE__ */ d.jsx("span", { children: re ? `Campaign defaults unavailable: ${re}` : g ? "Applying campaign defaults…" : K ? "Loading priority data…" : J ? `Error: ${J}` : "Allocate priorities until you spend all points." })
    ] }),
    x.description && /* @__PURE__ */ d.jsx("p", { className: "sum-to-ten-description", children: x.description }),
    j && /* @__PURE__ */ d.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ d.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        j.label
      ] }),
      j.description && /* @__PURE__ */ d.jsx("p", { children: j.description })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "sum-to-ten-grid", children: ro.map((ge) => {
      const fe = Dw(ge), ue = Ow(E, ge), G = D[ge], Ce = ue.find((Te) => Te.code === G), ve = G ? oe[G] ?? 0 : 0;
      return /* @__PURE__ */ d.jsxs("div", { className: "sum-to-ten-card", children: [
        /* @__PURE__ */ d.jsxs("div", { className: "sum-to-ten-card__header", children: [
          /* @__PURE__ */ d.jsx("span", { children: fe }),
          G && /* @__PURE__ */ d.jsxs("span", { children: [
            G,
            " · ",
            ve,
            " pts"
          ] })
        ] }),
        /* @__PURE__ */ d.jsxs("select", { value: G, onChange: (Te) => se(ge, Te), children: [
          /* @__PURE__ */ d.jsx("option", { value: "", children: "Select priority" }),
          uc.map((Te) => {
            const Le = ue.find((ae) => ae.code === Te), Ge = oe[Te] ?? 0;
            return /* @__PURE__ */ d.jsx("option", { value: Te, children: `${Te} (${Ge} pts) — ${(Le == null ? void 0 : Le.option.label) ?? `Priority ${Te}`}` }, Te);
          })
        ] }),
        /* @__PURE__ */ d.jsx("div", { className: "sum-to-ten-card__summary", children: Mw(Ce == null ? void 0 : Ce.option) }),
        G && /* @__PURE__ */ d.jsx(
          "button",
          {
            type: "button",
            className: "btn btn-link sum-to-ten-clear",
            onClick: () => Ue(ge, ""),
            children: "Clear selection"
          }
        )
      ] }, ge);
    }) }),
    /* @__PURE__ */ d.jsx(
      "div",
      {
        className: `react-priority-status sum-to-ten-status ${Z}`,
        role: "status",
        "aria-live": "polite",
        children: me
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "sum-to-ten-footer", children: [
      /* @__PURE__ */ d.jsxs("span", { className: "sum-to-ten-metrics", children: [
        "Spent ",
        I,
        " / ",
        F,
        " points"
      ] }),
      /* @__PURE__ */ d.jsx("div", { className: "sum-to-ten-actions", children: /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn btn-secondary", onClick: ce, children: "Reset to default" }) })
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
function cN({
  characterCreationData: E,
  creationMethod: x,
  activeEditionLabel: b,
  isLoading: K,
  error: J,
  campaignGameplayRules: j,
  campaignLoading: g,
  campaignError: re
}) {
  var ve, Te, Le, Ge;
  const D = z.useMemo(() => ((E == null ? void 0 : E.metatypes) ?? []).map((Fe) => ({
    value: Fe.id,
    label: Fe.name
  })), [E == null ? void 0 : E.metatypes]), [B, oe] = z.useState(() => {
    var ae;
    return ((ae = D[0]) == null ? void 0 : ae.value) ?? "";
  }), [F, I] = z.useState(
    () => iv.reduce((ae, Fe) => (ae[Fe.key] = 0, ae), {})
  );
  z.useEffect(() => {
    var Fe;
    const ae = ((Fe = D[0]) == null ? void 0 : Fe.value) ?? "";
    oe((nt) => nt || ae);
  }, [D]), z.useEffect(() => {
    var Fe, nt;
    const ae = iv.map(({ key: we, label: De }) => ({
      category: we,
      label: De,
      karma: F[we] ?? 0
    }));
    (nt = (Fe = window.ShadowmasterLegacyApp) == null ? void 0 : Fe.setKarmaPointBuy) == null || nt.call(Fe, {
      metatype_id: B,
      entries: ae
    });
  }, [F, B]);
  const ne = x.karma_budget ?? 800, ie = ((Te = x.metatype_costs) == null ? void 0 : Te[((ve = B == null ? void 0 : B.toLowerCase) == null ? void 0 : ve.call(B)) ?? ""]) ?? ((Le = x.metatype_costs) == null ? void 0 : Le.human) ?? 0, Z = ie + iv.reduce((ae, Fe) => ae + (F[Fe.key] ?? 0), 0), me = ne - Z, Ue = F.gear ?? 0, se = ((Ge = x.gear_conversion) == null ? void 0 : Ge.max_karma_for_gear) ?? null, ce = se !== null && Ue > se;
  let ge = "warning";
  me === 0 ? ge = "success" : me < 0 && (ge = "error");
  const fe = me === 0 ? "✓ All Karma allocated. Review the remaining steps, then proceed." : me < 0 ? `Over budget by ${Math.abs(me)} Karma. Adjust your selections.` : `Spend the remaining ${me} Karma before finalizing.`;
  function ue(ae, Fe) {
    const nt = Number.parseInt(Fe.target.value, 10);
    I((we) => ({
      ...we,
      [ae]: Number.isNaN(nt) || nt < 0 ? 0 : nt
    }));
  }
  function G(ae) {
    oe(ae.target.value);
  }
  function Ce() {
    I(
      iv.reduce((ae, Fe) => (ae[Fe.key] = 0, ae), {})
    ), D[0] && oe(D[0].value);
  }
  return /* @__PURE__ */ d.jsxs("div", { className: "react-priority-wrapper karma-wrapper", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ d.jsxs("span", { children: [
        "Karma Point-Buy — ",
        /* @__PURE__ */ d.jsx("strong", { children: b })
      ] }),
      /* @__PURE__ */ d.jsx("span", { children: re ? `Campaign defaults unavailable: ${re}` : g ? "Applying campaign defaults…" : K ? "Loading karma data…" : J ? `Error: ${J}` : "Allocate your Karma budget before moving on." })
    ] }),
    x.description && /* @__PURE__ */ d.jsx("p", { className: "karma-description", children: x.description }),
    x.notes && x.notes.length > 0 && /* @__PURE__ */ d.jsx("ul", { className: "karma-notes", children: x.notes.map((ae) => /* @__PURE__ */ d.jsx("li", { children: ae }, ae)) }),
    j && /* @__PURE__ */ d.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ d.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        j.label
      ] }),
      j.description && /* @__PURE__ */ d.jsx("p", { children: j.description })
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "karma-grid", children: [
      /* @__PURE__ */ d.jsxs("section", { className: "karma-panel", children: [
        /* @__PURE__ */ d.jsx("h4", { children: "Metatype" }),
        /* @__PURE__ */ d.jsxs("label", { className: "karma-field", children: [
          /* @__PURE__ */ d.jsx("span", { children: "Choose metatype" }),
          /* @__PURE__ */ d.jsx("select", { value: B, onChange: G, children: D.map((ae) => {
            var nt, we, De, be;
            const Fe = ((De = x.metatype_costs) == null ? void 0 : De[((we = (nt = ae.value).toLowerCase) == null ? void 0 : we.call(nt)) ?? ""]) ?? ((be = x.metatype_costs) == null ? void 0 : be.human) ?? 0;
            return /* @__PURE__ */ d.jsxs("option", { value: ae.value, children: [
              ae.label,
              " (",
              Fe,
              " Karma)"
            ] }, ae.value);
          }) })
        ] }),
        /* @__PURE__ */ d.jsxs("p", { className: "karma-info", children: [
          "Metatype cost: ",
          /* @__PURE__ */ d.jsxs("strong", { children: [
            ie,
            " Karma"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ d.jsxs("section", { className: "karma-panel", children: [
        /* @__PURE__ */ d.jsx("h4", { children: "Karma Ledger" }),
        /* @__PURE__ */ d.jsx("div", { className: "karma-ledger", children: iv.map(({ key: ae, label: Fe }) => {
          const nt = F[ae] ?? 0, we = ae === "gear" && se !== null ? ` (max ${se} Karma)` : "";
          return /* @__PURE__ */ d.jsxs("label", { className: "karma-field karma-ledger-row", children: [
            /* @__PURE__ */ d.jsxs("span", { children: [
              Fe,
              we
            ] }),
            /* @__PURE__ */ d.jsx(
              "input",
              {
                type: "number",
                min: 0,
                step: 5,
                value: nt,
                onChange: (De) => ue(ae, De)
              }
            )
          ] }, ae);
        }) })
      ] }),
      /* @__PURE__ */ d.jsxs("section", { className: "karma-panel karma-summary", children: [
        /* @__PURE__ */ d.jsx("h4", { children: "Budget Summary" }),
        /* @__PURE__ */ d.jsxs("dl", { children: [
          /* @__PURE__ */ d.jsxs("div", { children: [
            /* @__PURE__ */ d.jsx("dt", { children: "Karma budget" }),
            /* @__PURE__ */ d.jsx("dd", { children: ne })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { children: [
            /* @__PURE__ */ d.jsx("dt", { children: "Metatype cost" }),
            /* @__PURE__ */ d.jsx("dd", { children: ie })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { children: [
            /* @__PURE__ */ d.jsx("dt", { children: "Ledger spend" }),
            /* @__PURE__ */ d.jsx("dd", { children: Z - ie })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { children: [
            /* @__PURE__ */ d.jsx("dt", { children: "Total spent" }),
            /* @__PURE__ */ d.jsx("dd", { children: Z })
          ] }),
          /* @__PURE__ */ d.jsxs("div", { children: [
            /* @__PURE__ */ d.jsx("dt", { children: "Remaining" }),
            /* @__PURE__ */ d.jsx("dd", { children: me })
          ] })
        ] }),
        ce && /* @__PURE__ */ d.jsxs("p", { className: "karma-warning", children: [
          "Gear conversion exceeds the campaign limit of ",
          se,
          " Karma. Adjust your allocation."
        ] }),
        /* @__PURE__ */ d.jsx("p", { className: "karma-hint", children: "Remember: Only one Physical and one Mental attribute may start at their natural maximum. Attribute purchases should respect metatype caps." })
      ] })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: `react-priority-status karma-status ${ge}`, role: "status", "aria-live": "polite", children: fe }),
    /* @__PURE__ */ d.jsxs("div", { className: "karma-footer", children: [
      /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn btn-secondary", onClick: Ce, children: "Reset allocations" }),
      /* @__PURE__ */ d.jsx(
        "button",
        {
          type: "button",
          className: "btn btn-link",
          onClick: () => {
            var ae, Fe;
            return (Fe = (ae = window.ShadowmasterLegacyApp) == null ? void 0 : ae.showLegacyKarmaWizard) == null ? void 0 : Fe.call(ae);
          },
          children: "Open legacy point-buy wizard"
        }
      )
    ] })
  ] });
}
const fN = {
  body: "Body",
  quickness: "Quickness",
  strength: "Strength",
  charisma: "Charisma",
  intelligence: "Intelligence",
  willpower: "Willpower"
};
function dN(E, x) {
  if (!E)
    return [];
  const b = x || "E";
  return E.metatypes.map((K) => {
    var J;
    return {
      ...K,
      priorityAllowed: ((J = K.priority_tiers) == null ? void 0 : J.includes(b)) ?? !1
    };
  }).filter((K) => K.priorityAllowed);
}
function pN(E) {
  return E === 0 ? "+0" : E > 0 ? `+${E}` : `${E}`;
}
function vN(E) {
  const x = E.toLowerCase();
  return fN[x] ?? E;
}
function hN({ priority: E, selectedMetatype: x, onSelect: b }) {
  const { characterCreationData: K, isLoading: J, error: j, activeEdition: g } = Kf();
  z.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const re = z.useMemo(() => {
    var ie;
    const F = ((ie = E == null ? void 0 : E.toUpperCase) == null ? void 0 : ie.call(E)) ?? "", ne = ["A", "B", "C", "D", "E"].includes(F) ? F : "";
    return dN(K, ne);
  }, [K, E]), D = !!x, B = () => {
    var F, I;
    (I = (F = window.ShadowmasterLegacyApp) == null ? void 0 : F.showWizardStep) == null || I.call(F, 1);
  }, oe = () => {
    var F, I;
    x && ((I = (F = window.ShadowmasterLegacyApp) == null ? void 0 : F.showWizardStep) == null || I.call(F, 3));
  };
  return J ? /* @__PURE__ */ d.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : j ? /* @__PURE__ */ d.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    j
  ] }) : re.length ? /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
    /* @__PURE__ */ d.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ d.jsxs("span", { children: [
        "Priority: ",
        E || "—"
      ] })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "react-metatype-grid", children: re.map((F) => /* @__PURE__ */ d.jsxs(
      "article",
      {
        className: `react-metatype-card ${x === F.id ? "selected" : ""}`,
        onClick: () => b(F.id),
        children: [
          /* @__PURE__ */ d.jsx("h4", { children: F.name }),
          /* @__PURE__ */ d.jsxs("section", { className: "react-metatype-modifiers", children: [
            /* @__PURE__ */ d.jsx("strong", { children: "Attribute Modifiers" }),
            (() => {
              const I = F.attribute_modifiers ? Object.entries(F.attribute_modifiers).filter(([, ne]) => ne !== 0) : [];
              return I.length === 0 ? /* @__PURE__ */ d.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : I.map(([ne, ie]) => /* @__PURE__ */ d.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ d.jsx("span", { children: vN(ne) }),
                /* @__PURE__ */ d.jsx("span", { className: ie > 0 ? "positive" : "negative", children: pN(ie) })
              ] }, ne));
            })()
          ] }),
          g.key === "sr5" && F.special_attribute_points && Object.keys(F.special_attribute_points).length > 0 && /* @__PURE__ */ d.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ d.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(F.special_attribute_points).map(([I, ne]) => /* @__PURE__ */ d.jsx("div", { className: "ability", children: /* @__PURE__ */ d.jsxs("span", { children: [
              "Priority ",
              I,
              ": ",
              ne
            ] }) }, I))
          ] }),
          F.abilities && F.abilities.length > 0 && /* @__PURE__ */ d.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ d.jsx("strong", { children: "Special Abilities" }),
            F.abilities.map((I, ne) => /* @__PURE__ */ d.jsx("div", { className: "ability", children: /* @__PURE__ */ d.jsx("span", { children: I }) }, ne))
          ] }),
          (!F.abilities || F.abilities.length === 0) && /* @__PURE__ */ d.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ d.jsx("strong", { children: "Special Abilities" }),
            /* @__PURE__ */ d.jsx("div", { className: "ability", children: /* @__PURE__ */ d.jsx("span", { children: "No inherent metatype abilities." }) })
          ] })
        ]
      },
      F.id
    )) }),
    /* @__PURE__ */ d.jsxs("div", { className: "react-metatype-footer", children: [
      /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn btn-secondary", onClick: B, children: "Back" }),
      /* @__PURE__ */ d.jsx("div", { className: `react-metatype-status ${D ? "ready" : ""}`, children: D ? "Metatype selected. Continue to magic." : "Select a metatype to continue." }),
      /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn btn-primary", disabled: !D, onClick: oe, children: "Next: Choose Magical Abilities" })
    ] })
  ] }) : /* @__PURE__ */ d.jsx("p", { className: "react-metatype-status", children: "No metatypes available for this priority." });
}
const mN = ["Hermetic", "Shamanic"], yN = [
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
function gN(E) {
  return (E || "").toUpperCase();
}
function SN({ priority: E, selection: x, onChange: b }) {
  var ne;
  const { characterCreationData: K, activeEdition: J } = Kf(), j = gN(E), g = ((ne = K == null ? void 0 : K.priorities) == null ? void 0 : ne.magic) ?? null, re = z.useMemo(() => g && g[j] || null, [g, j]);
  z.useEffect(() => (document.body.classList.add("react-magic-enabled"), () => {
    document.body.classList.remove("react-magic-enabled");
  }), []), z.useEffect(() => {
    if (!j) {
      (x.type !== "Mundane" || x.tradition || x.totem) && b({ type: "Mundane", tradition: null, totem: null });
      return;
    }
    if (j === "A") {
      const ie = x.tradition ?? "Hermetic", Z = ie === "Shamanic" ? x.totem : null;
      (x.type !== "Full Magician" || x.tradition !== ie || x.totem !== Z) && b({ type: "Full Magician", tradition: ie, totem: Z });
    } else if (j === "B") {
      let ie = x.type;
      x.type !== "Adept" && x.type !== "Aspected Magician" && (ie = "Adept");
      let Z = x.tradition, me = x.totem;
      ie === "Aspected Magician" ? (Z = Z ?? "Hermetic", Z !== "Shamanic" && (me = null)) : (Z = null, me = null), (x.type !== ie || x.tradition !== Z || x.totem !== me) && b({ type: ie, tradition: Z, totem: me });
    } else
      (x.type !== "Mundane" || x.tradition || x.totem) && b({ type: "Mundane", tradition: null, totem: null });
  }, [j]);
  const D = (ie) => {
    const Z = {
      type: ie.type !== void 0 ? ie.type : x.type,
      tradition: ie.tradition !== void 0 ? ie.tradition : x.tradition,
      totem: ie.totem !== void 0 ? ie.totem : x.totem
    };
    Z.type !== "Full Magician" && Z.type !== "Aspected Magician" && (Z.tradition = null, Z.totem = null), Z.tradition !== "Shamanic" && (Z.totem = null), !(Z.type === x.type && Z.tradition === x.tradition && Z.totem === x.totem) && b(Z);
  }, B = () => !j || ["C", "D", "E", ""].includes(j) ? /* @__PURE__ */ d.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ d.jsxs(
    "article",
    {
      className: `react-magic-card ${x.type === "Mundane" ? "selected" : ""}`,
      onClick: () => D({ type: "Mundane", tradition: null, totem: null }),
      children: [
        /* @__PURE__ */ d.jsx("h4", { children: "Mundane" }),
        /* @__PURE__ */ d.jsx("p", { children: "No magical ability. Magic Rating 0." })
      ]
    }
  ) }) : j === "A" ? /* @__PURE__ */ d.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ d.jsxs(
    "article",
    {
      className: `react-magic-card ${x.type === "Full Magician" ? "selected" : ""}`,
      onClick: () => D({ type: "Full Magician" }),
      children: [
        /* @__PURE__ */ d.jsx("h4", { children: "Full Magician" }),
        /* @__PURE__ */ d.jsx("p", { children: "Magic Rating 6. Spell Points 25." }),
        /* @__PURE__ */ d.jsx("p", { children: "Must choose a magical tradition." })
      ]
    }
  ) }) : j === "B" ? /* @__PURE__ */ d.jsxs("div", { className: "react-magic-grid", children: [
    /* @__PURE__ */ d.jsxs(
      "article",
      {
        className: `react-magic-card ${x.type === "Adept" ? "selected" : ""}`,
        onClick: () => D({ type: "Adept", tradition: null, totem: null }),
        children: [
          /* @__PURE__ */ d.jsx("h4", { children: "Adept" }),
          /* @__PURE__ */ d.jsx("p", { children: "Magic Rating 4. Gain Power Points for physical enhancements." })
        ]
      }
    ),
    /* @__PURE__ */ d.jsxs(
      "article",
      {
        className: `react-magic-card ${x.type === "Aspected Magician" ? "selected" : ""}`,
        onClick: () => D({ type: "Aspected Magician" }),
        children: [
          /* @__PURE__ */ d.jsx("h4", { children: "Aspected Magician" }),
          /* @__PURE__ */ d.jsx("p", { children: "Magic Rating 4. Specializes in a single tradition aspect." }),
          /* @__PURE__ */ d.jsx("p", { children: "Must choose a magical tradition." })
        ]
      }
    )
  ] }) : null, oe = () => !x.type || !["Full Magician", "Aspected Magician"].includes(x.type) ? null : /* @__PURE__ */ d.jsxs("div", { className: "react-magic-traditions", children: [
    /* @__PURE__ */ d.jsx("strong", { children: "Tradition" }),
    /* @__PURE__ */ d.jsx("div", { className: "tradition-options", children: mN.map((ie) => /* @__PURE__ */ d.jsxs("label", { className: `tradition-option ${x.tradition === ie ? "selected" : ""}`, children: [
      /* @__PURE__ */ d.jsx(
        "input",
        {
          type: "radio",
          name: "react-tradition",
          value: ie,
          checked: x.tradition === ie,
          onChange: () => D({ tradition: ie })
        }
      ),
      /* @__PURE__ */ d.jsx("span", { children: ie })
    ] }, ie)) })
  ] }), F = () => x.tradition !== "Shamanic" ? null : /* @__PURE__ */ d.jsxs("div", { className: "react-magic-totems", children: [
    /* @__PURE__ */ d.jsx("strong", { children: "Select Totem" }),
    /* @__PURE__ */ d.jsx("div", { className: "totem-grid", children: yN.map((ie) => /* @__PURE__ */ d.jsxs(
      "article",
      {
        className: `totem-card ${x.totem === ie.id ? "selected" : ""}`,
        onClick: () => D({ totem: ie.id }),
        children: [
          /* @__PURE__ */ d.jsx("h5", { children: ie.name }),
          /* @__PURE__ */ d.jsx("p", { children: ie.description }),
          /* @__PURE__ */ d.jsx("ul", { children: ie.notes.map((Z) => /* @__PURE__ */ d.jsx("li", { children: Z }, Z)) })
        ]
      },
      ie.id
    )) })
  ] }), I = () => {
    if (!x.type)
      return /* @__PURE__ */ d.jsx("p", { className: "react-magic-status", children: "Select a magical path to proceed." });
    if (x.type === "Full Magician" || x.type === "Aspected Magician") {
      if (!x.tradition)
        return /* @__PURE__ */ d.jsx("p", { className: "react-magic-status", children: "Choose a tradition to continue." });
      if (x.tradition === "Shamanic" && !x.totem)
        return /* @__PURE__ */ d.jsx("p", { className: "react-magic-status", children: "Select a totem for your shamanic path." });
    }
    return /* @__PURE__ */ d.jsx("p", { className: "react-magic-status ready", children: "Magical abilities ready. Continue to Attributes." });
  };
  return /* @__PURE__ */ d.jsxs("div", { className: "react-magic-wrapper", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "react-magic-header", children: [
      /* @__PURE__ */ d.jsx("span", { children: "Magical Abilities" }),
      /* @__PURE__ */ d.jsxs("span", { children: [
        "Priority ",
        j || "—",
        " ",
        re != null && re.summary ? `— ${re.summary}` : ""
      ] })
    ] }),
    B(),
    oe(),
    F(),
    I(),
    /* @__PURE__ */ d.jsx("footer", { className: "react-magic-footer", children: /* @__PURE__ */ d.jsxs("small", { children: [
      "Edition: ",
      J.label
    ] }) })
  ] });
}
function EN({ targetId: E = "campaign-dashboard-root", campaign: x, onClose: b }) {
  var B, oe, F;
  const [K, J] = z.useState(null);
  z.useEffect(() => {
    J(document.getElementById(E));
  }, [E]);
  const j = z.useMemo(() => {
    if (!(x != null && x.house_rules))
      return {};
    try {
      return JSON.parse(x.house_rules);
    } catch (I) {
      return console.warn("Failed to parse campaign house rules payload", I), {};
    }
  }, [x == null ? void 0 : x.house_rules]);
  if (!K || !x)
    return null;
  const g = Object.entries(j.automation ?? {}).filter(([, I]) => I), re = (((B = j.factions) == null ? void 0 : B.length) ?? 0) > 0 || (((oe = j.locations) == null ? void 0 : oe.length) ?? 0) > 0, D = j.session_seed;
  return gl.createPortal(
    /* @__PURE__ */ d.jsxs("section", { className: "campaign-dashboard", children: [
      /* @__PURE__ */ d.jsxs("header", { className: "campaign-dashboard__header", children: [
        /* @__PURE__ */ d.jsxs("div", { children: [
          /* @__PURE__ */ d.jsx("h3", { children: x.name }),
          /* @__PURE__ */ d.jsxs("p", { children: [
            x.edition.toUpperCase(),
            " · ",
            x.creation_method,
            " · ",
            x.gameplay_level ?? "experienced"
          ] })
        ] }),
        /* @__PURE__ */ d.jsx("div", { className: "campaign-dashboard__actions", children: /* @__PURE__ */ d.jsx("button", { type: "button", className: "btn-secondary", onClick: b, children: "Dismiss" }) })
      ] }),
      j.theme && /* @__PURE__ */ d.jsxs("p", { className: "campaign-dashboard__theme", children: [
        /* @__PURE__ */ d.jsx("strong", { children: "Theme:" }),
        " ",
        j.theme
      ] }),
      /* @__PURE__ */ d.jsxs("div", { className: "campaign-dashboard__grid", children: [
        /* @__PURE__ */ d.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ d.jsx("h4", { children: "Roster" }),
          /* @__PURE__ */ d.jsxs("p", { children: [
            /* @__PURE__ */ d.jsx("strong", { children: "Placeholders:" }),
            " ",
            (F = j.placeholders) != null && F.length ? j.placeholders.map((I) => I.name).join(", ") : "None captured"
          ] })
        ] }),
        /* @__PURE__ */ d.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ d.jsx("h4", { children: "Automation" }),
          g.length > 0 ? /* @__PURE__ */ d.jsx("ul", { children: g.map(([I]) => /* @__PURE__ */ d.jsx("li", { children: I.replace(/_/g, " ") }, I)) }) : /* @__PURE__ */ d.jsx("p", { children: "No automation modules selected." }),
          j.notes && /* @__PURE__ */ d.jsxs("p", { className: "campaign-dashboard__notes", children: [
            /* @__PURE__ */ d.jsx("strong", { children: "House rule notes:" }),
            " ",
            j.notes
          ] })
        ] }),
        /* @__PURE__ */ d.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ d.jsx("h4", { children: "World Backbone" }),
          re ? /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
            j.factions && j.factions.length > 0 && /* @__PURE__ */ d.jsxs("div", { children: [
              /* @__PURE__ */ d.jsx("strong", { children: "Factions" }),
              /* @__PURE__ */ d.jsx("ul", { children: j.factions.map((I) => /* @__PURE__ */ d.jsxs("li", { children: [
                /* @__PURE__ */ d.jsx("span", { children: I.name }),
                I.tags && /* @__PURE__ */ d.jsxs("small", { children: [
                  " · ",
                  I.tags
                ] }),
                I.notes && /* @__PURE__ */ d.jsx("p", { children: I.notes })
              ] }, I.id ?? I.name)) })
            ] }),
            j.locations && j.locations.length > 0 && /* @__PURE__ */ d.jsxs("div", { children: [
              /* @__PURE__ */ d.jsx("strong", { children: "Locations" }),
              /* @__PURE__ */ d.jsx("ul", { children: j.locations.map((I) => /* @__PURE__ */ d.jsxs("li", { children: [
                /* @__PURE__ */ d.jsx("span", { children: I.name }),
                I.descriptor && /* @__PURE__ */ d.jsx("p", { children: I.descriptor })
              ] }, I.id ?? I.name)) })
            ] })
          ] }) : /* @__PURE__ */ d.jsx("p", { children: "No factions or locations recorded yet." })
        ] }),
        /* @__PURE__ */ d.jsxs("section", { className: "campaign-dashboard__card", children: [
          /* @__PURE__ */ d.jsx("h4", { children: "Session Seed" }),
          D != null && D.skip ? /* @__PURE__ */ d.jsx("p", { children: "Session planning skipped for now." }) : D ? /* @__PURE__ */ d.jsxs("ul", { children: [
            /* @__PURE__ */ d.jsxs("li", { children: [
              /* @__PURE__ */ d.jsx("strong", { children: "Title:" }),
              " ",
              D.title || "Session 0"
            ] }),
            D.sceneTemplate && /* @__PURE__ */ d.jsxs("li", { children: [
              /* @__PURE__ */ d.jsx("strong", { children: "Template:" }),
              " ",
              D.sceneTemplate
            ] }),
            D.objectives && /* @__PURE__ */ d.jsxs("li", { children: [
              /* @__PURE__ */ d.jsx("strong", { children: "Objectives:" }),
              " ",
              D.objectives
            ] }),
            D.summary && /* @__PURE__ */ d.jsxs("li", { children: [
              /* @__PURE__ */ d.jsx("strong", { children: "Summary:" }),
              " ",
              D.summary
            ] })
          ] }) : /* @__PURE__ */ d.jsx("p", { children: "No session seed captured." })
        ] })
      ] })
    ] }),
    K
  );
}
function xN() {
  const [E, x] = z.useState(null);
  return z.useEffect(() => {
    x(document.getElementById("auth-root"));
  }, []), E ? gl.createPortal(/* @__PURE__ */ d.jsx(Fj, {}), E) : null;
}
function CN() {
  const [E, x] = z.useState(null);
  return z.useEffect(() => {
    x(document.getElementById("priority-assignment-react-root"));
  }, []), E ? gl.createPortal(/* @__PURE__ */ d.jsx(lN, {}), E) : null;
}
function bN() {
  const [E, x] = z.useState(null), [b, K] = z.useState(""), [J, j] = z.useState(null);
  return z.useEffect(() => {
    x(document.getElementById("metatype-selection-react-root"));
  }, []), z.useEffect(() => {
    var D;
    const g = window.ShadowmasterLegacyApp;
    if (!g) return;
    const re = () => {
      var B, oe;
      K(((B = g.getMetatypePriority) == null ? void 0 : B.call(g)) ?? ""), j(((oe = g.getMetatypeSelection) == null ? void 0 : oe.call(g)) ?? null);
    };
    return re(), (D = g.subscribeMetatypeState) == null || D.call(g, re), () => {
      var B;
      (B = g.unsubscribeMetatypeState) == null || B.call(g, re);
    };
  }, []), E ? gl.createPortal(
    /* @__PURE__ */ d.jsx(
      hN,
      {
        priority: b,
        selectedMetatype: J,
        onSelect: (g) => {
          var re, D;
          j(g), (D = (re = window.ShadowmasterLegacyApp) == null ? void 0 : re.setMetatypeSelection) == null || D.call(re, g);
        }
      }
    ),
    E
  ) : null;
}
function wN() {
  const [E, x] = z.useState(null), [b, K] = z.useState({
    priority: "",
    type: null,
    tradition: null,
    totem: null
  });
  return z.useEffect(() => {
    x(document.getElementById("magical-abilities-react-root"));
  }, []), z.useEffect(() => {
    var g;
    const J = window.ShadowmasterLegacyApp;
    if (!J) return;
    const j = () => {
      var D;
      const re = (D = J.getMagicState) == null ? void 0 : D.call(J);
      re && K({
        priority: re.priority || "",
        type: re.type || null,
        tradition: re.tradition || null,
        totem: re.totem || null
      });
    };
    return j(), (g = J.subscribeMagicState) == null || g.call(J, j), () => {
      var re;
      (re = J.unsubscribeMagicState) == null || re.call(J, j);
    };
  }, []), E ? gl.createPortal(
    /* @__PURE__ */ d.jsx(
      SN,
      {
        priority: b.priority,
        selection: { type: b.type, tradition: b.tradition, totem: b.totem },
        onChange: (J) => {
          var j, g;
          (g = (j = window.ShadowmasterLegacyApp) == null ? void 0 : j.setMagicState) == null || g.call(j, J);
        }
      }
    ),
    E
  ) : null;
}
function TN() {
  const { activeEdition: E, isLoading: x, error: b, characterCreationData: K } = Kf(), [J, j] = z.useState(null);
  let g = "· data pending";
  return x ? g = "· loading edition data…" : b ? g = `· failed to load data: ${b}` : K && (g = "· edition data loaded"), /* @__PURE__ */ d.jsxs(Uj, { children: [
    /* @__PURE__ */ d.jsx("div", { className: "react-banner", "data-active-edition": E.key, children: /* @__PURE__ */ d.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ d.jsx("strong", { children: E.label }),
      " ",
      g
    ] }) }),
    /* @__PURE__ */ d.jsx(xN, {}),
    /* @__PURE__ */ d.jsx(tN, {}),
    /* @__PURE__ */ d.jsx($j, { onCreated: (re) => j(re) }),
    /* @__PURE__ */ d.jsx(EN, { campaign: J, onClose: () => j(null) }),
    /* @__PURE__ */ d.jsx(Jj, {}),
    /* @__PURE__ */ d.jsx(Hj, {}),
    /* @__PURE__ */ d.jsx(CN, {}),
    /* @__PURE__ */ d.jsx(bN, {}),
    /* @__PURE__ */ d.jsx(wN, {})
  ] });
}
const RN = document.getElementById("shadowmaster-react-root"), _N = RN ?? kN();
function kN() {
  const E = document.createElement("div");
  return E.id = "shadowmaster-react-root", E.dataset.controller = "react-shell", E.style.display = "contents", document.body.appendChild(E), E;
}
function jN() {
  return z.useEffect(() => {
    var E, x, b;
    (E = window.ShadowmasterLegacyApp) != null && E.initialize && !((b = (x = window.ShadowmasterLegacyApp).isInitialized) != null && b.call(x)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ d.jsx(z.StrictMode, { children: /* @__PURE__ */ d.jsx(Oj, { children: /* @__PURE__ */ d.jsx(TN, {}) }) });
}
const NN = jE(_N);
NN.render(/* @__PURE__ */ d.jsx(jN, {}));

var CE = { exports: {} }, ev = {}, wE = { exports: {} }, Nt = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ix;
function lk() {
  if (ix) return Nt;
  ix = 1;
  var T = Symbol.for("react.element"), w = Symbol.for("react.portal"), x = Symbol.for("react.fragment"), Z = Symbol.for("react.strict_mode"), J = Symbol.for("react.profiler"), A = Symbol.for("react.provider"), g = Symbol.for("react.context"), re = Symbol.for("react.forward_ref"), U = Symbol.for("react.suspense"), Q = Symbol.for("react.memo"), Re = Symbol.for("react.lazy"), I = Symbol.iterator;
  function ee(N) {
    return N === null || typeof N != "object" ? null : (N = I && N[I] || N["@@iterator"], typeof N == "function" ? N : null);
  }
  var te = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, ne = Object.assign, K = {};
  function Ee(N, q, nt) {
    this.props = N, this.context = q, this.refs = K, this.updater = nt || te;
  }
  Ee.prototype.isReactComponent = {}, Ee.prototype.setState = function(N, q) {
    if (typeof N != "object" && typeof N != "function" && N != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, N, q, "setState");
  }, Ee.prototype.forceUpdate = function(N) {
    this.updater.enqueueForceUpdate(this, N, "forceUpdate");
  };
  function Ue() {
  }
  Ue.prototype = Ee.prototype;
  function ce(N, q, nt) {
    this.props = N, this.context = q, this.refs = K, this.updater = nt || te;
  }
  var ge = ce.prototype = new Ue();
  ge.constructor = ce, ne(ge, Ee.prototype), ge.isPureReactComponent = !0;
  var Le = Array.isArray, he = Object.prototype.hasOwnProperty, Se = { current: null }, P = { key: !0, ref: !0, __self: !0, __source: !0 };
  function de(N, q, nt) {
    var et, be = {}, We = null, fe = null;
    if (q != null) for (et in q.ref !== void 0 && (fe = q.ref), q.key !== void 0 && (We = "" + q.key), q) he.call(q, et) && !P.hasOwnProperty(et) && (be[et] = q[et]);
    var Fe = arguments.length - 2;
    if (Fe === 1) be.children = nt;
    else if (1 < Fe) {
      for (var rt = Array(Fe), dt = 0; dt < Fe; dt++) rt[dt] = arguments[dt + 2];
      be.children = rt;
    }
    if (N && N.defaultProps) for (et in Fe = N.defaultProps, Fe) be[et] === void 0 && (be[et] = Fe[et]);
    return { $$typeof: T, type: N, key: We, ref: fe, props: be, _owner: Se.current };
  }
  function ie(N, q) {
    return { $$typeof: T, type: N.type, key: q, ref: N.ref, props: N.props, _owner: N._owner };
  }
  function Te(N) {
    return typeof N == "object" && N !== null && N.$$typeof === T;
  }
  function He(N) {
    var q = { "=": "=0", ":": "=2" };
    return "$" + N.replace(/[=:]/g, function(nt) {
      return q[nt];
    });
  }
  var tt = /\/+/g;
  function Ce(N, q) {
    return typeof N == "object" && N !== null && N.key != null ? He("" + N.key) : q.toString(36);
  }
  function kt(N, q, nt, et, be) {
    var We = typeof N;
    (We === "undefined" || We === "boolean") && (N = null);
    var fe = !1;
    if (N === null) fe = !0;
    else switch (We) {
      case "string":
      case "number":
        fe = !0;
        break;
      case "object":
        switch (N.$$typeof) {
          case T:
          case w:
            fe = !0;
        }
    }
    if (fe) return fe = N, be = be(fe), N = et === "" ? "." + Ce(fe, 0) : et, Le(be) ? (nt = "", N != null && (nt = N.replace(tt, "$&/") + "/"), kt(be, q, nt, "", function(dt) {
      return dt;
    })) : be != null && (Te(be) && (be = ie(be, nt + (!be.key || fe && fe.key === be.key ? "" : ("" + be.key).replace(tt, "$&/") + "/") + N)), q.push(be)), 1;
    if (fe = 0, et = et === "" ? "." : et + ":", Le(N)) for (var Fe = 0; Fe < N.length; Fe++) {
      We = N[Fe];
      var rt = et + Ce(We, Fe);
      fe += kt(We, q, nt, rt, be);
    }
    else if (rt = ee(N), typeof rt == "function") for (N = rt.call(N), Fe = 0; !(We = N.next()).done; ) We = We.value, rt = et + Ce(We, Fe++), fe += kt(We, q, nt, rt, be);
    else if (We === "object") throw q = String(N), Error("Objects are not valid as a React child (found: " + (q === "[object Object]" ? "object with keys {" + Object.keys(N).join(", ") + "}" : q) + "). If you meant to render a collection of children, use an array instead.");
    return fe;
  }
  function Ct(N, q, nt) {
    if (N == null) return N;
    var et = [], be = 0;
    return kt(N, et, "", "", function(We) {
      return q.call(nt, We, be++);
    }), et;
  }
  function Dt(N) {
    if (N._status === -1) {
      var q = N._result;
      q = q(), q.then(function(nt) {
        (N._status === 0 || N._status === -1) && (N._status = 1, N._result = nt);
      }, function(nt) {
        (N._status === 0 || N._status === -1) && (N._status = 2, N._result = nt);
      }), N._status === -1 && (N._status = 0, N._result = q);
    }
    if (N._status === 1) return N._result.default;
    throw N._result;
  }
  var Ve = { current: null }, me = { transition: null }, Qe = { ReactCurrentDispatcher: Ve, ReactCurrentBatchConfig: me, ReactCurrentOwner: Se };
  function we() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Nt.Children = { map: Ct, forEach: function(N, q, nt) {
    Ct(N, function() {
      q.apply(this, arguments);
    }, nt);
  }, count: function(N) {
    var q = 0;
    return Ct(N, function() {
      q++;
    }), q;
  }, toArray: function(N) {
    return Ct(N, function(q) {
      return q;
    }) || [];
  }, only: function(N) {
    if (!Te(N)) throw Error("React.Children.only expected to receive a single React element child.");
    return N;
  } }, Nt.Component = Ee, Nt.Fragment = x, Nt.Profiler = J, Nt.PureComponent = ce, Nt.StrictMode = Z, Nt.Suspense = U, Nt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Qe, Nt.act = we, Nt.cloneElement = function(N, q, nt) {
    if (N == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + N + ".");
    var et = ne({}, N.props), be = N.key, We = N.ref, fe = N._owner;
    if (q != null) {
      if (q.ref !== void 0 && (We = q.ref, fe = Se.current), q.key !== void 0 && (be = "" + q.key), N.type && N.type.defaultProps) var Fe = N.type.defaultProps;
      for (rt in q) he.call(q, rt) && !P.hasOwnProperty(rt) && (et[rt] = q[rt] === void 0 && Fe !== void 0 ? Fe[rt] : q[rt]);
    }
    var rt = arguments.length - 2;
    if (rt === 1) et.children = nt;
    else if (1 < rt) {
      Fe = Array(rt);
      for (var dt = 0; dt < rt; dt++) Fe[dt] = arguments[dt + 2];
      et.children = Fe;
    }
    return { $$typeof: T, type: N.type, key: be, ref: We, props: et, _owner: fe };
  }, Nt.createContext = function(N) {
    return N = { $$typeof: g, _currentValue: N, _currentValue2: N, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, N.Provider = { $$typeof: A, _context: N }, N.Consumer = N;
  }, Nt.createElement = de, Nt.createFactory = function(N) {
    var q = de.bind(null, N);
    return q.type = N, q;
  }, Nt.createRef = function() {
    return { current: null };
  }, Nt.forwardRef = function(N) {
    return { $$typeof: re, render: N };
  }, Nt.isValidElement = Te, Nt.lazy = function(N) {
    return { $$typeof: Re, _payload: { _status: -1, _result: N }, _init: Dt };
  }, Nt.memo = function(N, q) {
    return { $$typeof: Q, type: N, compare: q === void 0 ? null : q };
  }, Nt.startTransition = function(N) {
    var q = me.transition;
    me.transition = {};
    try {
      N();
    } finally {
      me.transition = q;
    }
  }, Nt.unstable_act = we, Nt.useCallback = function(N, q) {
    return Ve.current.useCallback(N, q);
  }, Nt.useContext = function(N) {
    return Ve.current.useContext(N);
  }, Nt.useDebugValue = function() {
  }, Nt.useDeferredValue = function(N) {
    return Ve.current.useDeferredValue(N);
  }, Nt.useEffect = function(N, q) {
    return Ve.current.useEffect(N, q);
  }, Nt.useId = function() {
    return Ve.current.useId();
  }, Nt.useImperativeHandle = function(N, q, nt) {
    return Ve.current.useImperativeHandle(N, q, nt);
  }, Nt.useInsertionEffect = function(N, q) {
    return Ve.current.useInsertionEffect(N, q);
  }, Nt.useLayoutEffect = function(N, q) {
    return Ve.current.useLayoutEffect(N, q);
  }, Nt.useMemo = function(N, q) {
    return Ve.current.useMemo(N, q);
  }, Nt.useReducer = function(N, q, nt) {
    return Ve.current.useReducer(N, q, nt);
  }, Nt.useRef = function(N) {
    return Ve.current.useRef(N);
  }, Nt.useState = function(N) {
    return Ve.current.useState(N);
  }, Nt.useSyncExternalStore = function(N, q, nt) {
    return Ve.current.useSyncExternalStore(N, q, nt);
  }, Nt.useTransition = function() {
    return Ve.current.useTransition();
  }, Nt.version = "18.3.1", Nt;
}
var rv = { exports: {} };
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
rv.exports;
var lx;
function uk() {
  return lx || (lx = 1, function(T, w) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var x = "18.3.1", Z = Symbol.for("react.element"), J = Symbol.for("react.portal"), A = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), re = Symbol.for("react.profiler"), U = Symbol.for("react.provider"), Q = Symbol.for("react.context"), Re = Symbol.for("react.forward_ref"), I = Symbol.for("react.suspense"), ee = Symbol.for("react.suspense_list"), te = Symbol.for("react.memo"), ne = Symbol.for("react.lazy"), K = Symbol.for("react.offscreen"), Ee = Symbol.iterator, Ue = "@@iterator";
      function ce(h) {
        if (h === null || typeof h != "object")
          return null;
        var b = Ee && h[Ee] || h[Ue];
        return typeof b == "function" ? b : null;
      }
      var ge = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, Le = {
        transition: null
      }, he = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, Se = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, P = {}, de = null;
      function ie(h) {
        de = h;
      }
      P.setExtraStackFrame = function(h) {
        de = h;
      }, P.getCurrentStack = null, P.getStackAddendum = function() {
        var h = "";
        de && (h += de);
        var b = P.getCurrentStack;
        return b && (h += b() || ""), h;
      };
      var Te = !1, He = !1, tt = !1, Ce = !1, kt = !1, Ct = {
        ReactCurrentDispatcher: ge,
        ReactCurrentBatchConfig: Le,
        ReactCurrentOwner: Se
      };
      Ct.ReactDebugCurrentFrame = P, Ct.ReactCurrentActQueue = he;
      function Dt(h) {
        {
          for (var b = arguments.length, H = new Array(b > 1 ? b - 1 : 0), $ = 1; $ < b; $++)
            H[$ - 1] = arguments[$];
          me("warn", h, H);
        }
      }
      function Ve(h) {
        {
          for (var b = arguments.length, H = new Array(b > 1 ? b - 1 : 0), $ = 1; $ < b; $++)
            H[$ - 1] = arguments[$];
          me("error", h, H);
        }
      }
      function me(h, b, H) {
        {
          var $ = Ct.ReactDebugCurrentFrame, ye = $.getStackAddendum();
          ye !== "" && (b += "%s", H = H.concat([ye]));
          var at = H.map(function(ke) {
            return String(ke);
          });
          at.unshift("Warning: " + b), Function.prototype.apply.call(console[h], console, at);
        }
      }
      var Qe = {};
      function we(h, b) {
        {
          var H = h.constructor, $ = H && (H.displayName || H.name) || "ReactClass", ye = $ + "." + b;
          if (Qe[ye])
            return;
          Ve("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", b, $), Qe[ye] = !0;
        }
      }
      var N = {
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
        enqueueForceUpdate: function(h, b, H) {
          we(h, "forceUpdate");
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
        enqueueReplaceState: function(h, b, H, $) {
          we(h, "replaceState");
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
        enqueueSetState: function(h, b, H, $) {
          we(h, "setState");
        }
      }, q = Object.assign, nt = {};
      Object.freeze(nt);
      function et(h, b, H) {
        this.props = h, this.context = b, this.refs = nt, this.updater = H || N;
      }
      et.prototype.isReactComponent = {}, et.prototype.setState = function(h, b) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, b, "setState");
      }, et.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var be = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, We = function(h, b) {
          Object.defineProperty(et.prototype, h, {
            get: function() {
              Dt("%s(...) is deprecated in plain JavaScript React classes. %s", b[0], b[1]);
            }
          });
        };
        for (var fe in be)
          be.hasOwnProperty(fe) && We(fe, be[fe]);
      }
      function Fe() {
      }
      Fe.prototype = et.prototype;
      function rt(h, b, H) {
        this.props = h, this.context = b, this.refs = nt, this.updater = H || N;
      }
      var dt = rt.prototype = new Fe();
      dt.constructor = rt, q(dt, et.prototype), dt.isPureReactComponent = !0;
      function $t() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var yn = Array.isArray;
      function cn(h) {
        return yn(h);
      }
      function bn(h) {
        {
          var b = typeof Symbol == "function" && Symbol.toStringTag, H = b && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return H;
        }
      }
      function Tn(h) {
        try {
          return $n(h), !1;
        } catch {
          return !0;
        }
      }
      function $n(h) {
        return "" + h;
      }
      function $r(h) {
        if (Tn(h))
          return Ve("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", bn(h)), $n(h);
      }
      function ci(h, b, H) {
        var $ = h.displayName;
        if ($)
          return $;
        var ye = b.displayName || b.name || "";
        return ye !== "" ? H + "(" + ye + ")" : H;
      }
      function sa(h) {
        return h.displayName || "Context";
      }
      function Jn(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && Ve("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case A:
            return "Fragment";
          case J:
            return "Portal";
          case re:
            return "Profiler";
          case g:
            return "StrictMode";
          case I:
            return "Suspense";
          case ee:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Q:
              var b = h;
              return sa(b) + ".Consumer";
            case U:
              var H = h;
              return sa(H._context) + ".Provider";
            case Re:
              return ci(h, h.render, "ForwardRef");
            case te:
              var $ = h.displayName || null;
              return $ !== null ? $ : Jn(h.type) || "Memo";
            case ne: {
              var ye = h, at = ye._payload, ke = ye._init;
              try {
                return Jn(ke(at));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var _n = Object.prototype.hasOwnProperty, Qn = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Er, $a, An;
      An = {};
      function Cr(h) {
        if (_n.call(h, "ref")) {
          var b = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (b && b.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function ca(h) {
        if (_n.call(h, "key")) {
          var b = Object.getOwnPropertyDescriptor(h, "key").get;
          if (b && b.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function Qa(h, b) {
        var H = function() {
          Er || (Er = !0, Ve("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", b));
        };
        H.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: H,
          configurable: !0
        });
      }
      function fi(h, b) {
        var H = function() {
          $a || ($a = !0, Ve("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", b));
        };
        H.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: H,
          configurable: !0
        });
      }
      function xe(h) {
        if (typeof h.ref == "string" && Se.current && h.__self && Se.current.stateNode !== h.__self) {
          var b = Jn(Se.current.type);
          An[b] || (Ve('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', b, h.ref), An[b] = !0);
        }
      }
      var qe = function(h, b, H, $, ye, at, ke) {
        var ut = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: Z,
          // Built-in properties that belong on the element
          type: h,
          key: b,
          ref: H,
          props: ke,
          // Record the component responsible for creating this element.
          _owner: at
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
          value: $
        }), Object.defineProperty(ut, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: ye
        }), Object.freeze && (Object.freeze(ut.props), Object.freeze(ut)), ut;
      };
      function wt(h, b, H) {
        var $, ye = {}, at = null, ke = null, ut = null, _t = null;
        if (b != null) {
          Cr(b) && (ke = b.ref, xe(b)), ca(b) && ($r(b.key), at = "" + b.key), ut = b.__self === void 0 ? null : b.__self, _t = b.__source === void 0 ? null : b.__source;
          for ($ in b)
            _n.call(b, $) && !Qn.hasOwnProperty($) && (ye[$] = b[$]);
        }
        var Ut = arguments.length - 2;
        if (Ut === 1)
          ye.children = H;
        else if (Ut > 1) {
          for (var on = Array(Ut), Jt = 0; Jt < Ut; Jt++)
            on[Jt] = arguments[Jt + 2];
          Object.freeze && Object.freeze(on), ye.children = on;
        }
        if (h && h.defaultProps) {
          var xt = h.defaultProps;
          for ($ in xt)
            ye[$] === void 0 && (ye[$] = xt[$]);
        }
        if (at || ke) {
          var Zt = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          at && Qa(ye, Zt), ke && fi(ye, Zt);
        }
        return qe(h, at, ke, ut, _t, Se.current, ye);
      }
      function Qt(h, b) {
        var H = qe(h.type, b, h.ref, h._self, h._source, h._owner, h.props);
        return H;
      }
      function an(h, b, H) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var $, ye = q({}, h.props), at = h.key, ke = h.ref, ut = h._self, _t = h._source, Ut = h._owner;
        if (b != null) {
          Cr(b) && (ke = b.ref, Ut = Se.current), ca(b) && ($r(b.key), at = "" + b.key);
          var on;
          h.type && h.type.defaultProps && (on = h.type.defaultProps);
          for ($ in b)
            _n.call(b, $) && !Qn.hasOwnProperty($) && (b[$] === void 0 && on !== void 0 ? ye[$] = on[$] : ye[$] = b[$]);
        }
        var Jt = arguments.length - 2;
        if (Jt === 1)
          ye.children = H;
        else if (Jt > 1) {
          for (var xt = Array(Jt), Zt = 0; Zt < Jt; Zt++)
            xt[Zt] = arguments[Zt + 2];
          ye.children = xt;
        }
        return qe(h.type, at, ke, ut, _t, Ut, ye);
      }
      function gn(h) {
        return typeof h == "object" && h !== null && h.$$typeof === Z;
      }
      var fn = ".", Zn = ":";
      function ln(h) {
        var b = /[=:]/g, H = {
          "=": "=0",
          ":": "=2"
        }, $ = h.replace(b, function(ye) {
          return H[ye];
        });
        return "$" + $;
      }
      var qt = !1, Kt = /\/+/g;
      function fa(h) {
        return h.replace(Kt, "$&/");
      }
      function wr(h, b) {
        return typeof h == "object" && h !== null && h.key != null ? ($r(h.key), ln("" + h.key)) : b.toString(36);
      }
      function ba(h, b, H, $, ye) {
        var at = typeof h;
        (at === "undefined" || at === "boolean") && (h = null);
        var ke = !1;
        if (h === null)
          ke = !0;
        else
          switch (at) {
            case "string":
            case "number":
              ke = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case Z:
                case J:
                  ke = !0;
              }
          }
        if (ke) {
          var ut = h, _t = ye(ut), Ut = $ === "" ? fn + wr(ut, 0) : $;
          if (cn(_t)) {
            var on = "";
            Ut != null && (on = fa(Ut) + "/"), ba(_t, b, on, "", function(Jf) {
              return Jf;
            });
          } else _t != null && (gn(_t) && (_t.key && (!ut || ut.key !== _t.key) && $r(_t.key), _t = Qt(
            _t,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            H + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (_t.key && (!ut || ut.key !== _t.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              fa("" + _t.key) + "/"
            ) : "") + Ut
          )), b.push(_t));
          return 1;
        }
        var Jt, xt, Zt = 0, Sn = $ === "" ? fn : $ + Zn;
        if (cn(h))
          for (var wl = 0; wl < h.length; wl++)
            Jt = h[wl], xt = Sn + wr(Jt, wl), Zt += ba(Jt, b, H, xt, ye);
        else {
          var Ko = ce(h);
          if (typeof Ko == "function") {
            var Bi = h;
            Ko === Bi.entries && (qt || Dt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), qt = !0);
            for (var Xo = Ko.call(Bi), ou, Xf = 0; !(ou = Xo.next()).done; )
              Jt = ou.value, xt = Sn + wr(Jt, Xf++), Zt += ba(Jt, b, H, xt, ye);
          } else if (at === "object") {
            var sc = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (sc === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : sc) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Zt;
      }
      function Pi(h, b, H) {
        if (h == null)
          return h;
        var $ = [], ye = 0;
        return ba(h, $, "", "", function(at) {
          return b.call(H, at, ye++);
        }), $;
      }
      function Zl(h) {
        var b = 0;
        return Pi(h, function() {
          b++;
        }), b;
      }
      function eu(h, b, H) {
        Pi(h, function() {
          b.apply(this, arguments);
        }, H);
      }
      function pl(h) {
        return Pi(h, function(b) {
          return b;
        }) || [];
      }
      function vl(h) {
        if (!gn(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function tu(h) {
        var b = {
          $$typeof: Q,
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
        b.Provider = {
          $$typeof: U,
          _context: b
        };
        var H = !1, $ = !1, ye = !1;
        {
          var at = {
            $$typeof: Q,
            _context: b
          };
          Object.defineProperties(at, {
            Provider: {
              get: function() {
                return $ || ($ = !0, Ve("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), b.Provider;
              },
              set: function(ke) {
                b.Provider = ke;
              }
            },
            _currentValue: {
              get: function() {
                return b._currentValue;
              },
              set: function(ke) {
                b._currentValue = ke;
              }
            },
            _currentValue2: {
              get: function() {
                return b._currentValue2;
              },
              set: function(ke) {
                b._currentValue2 = ke;
              }
            },
            _threadCount: {
              get: function() {
                return b._threadCount;
              },
              set: function(ke) {
                b._threadCount = ke;
              }
            },
            Consumer: {
              get: function() {
                return H || (H = !0, Ve("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), b.Consumer;
              }
            },
            displayName: {
              get: function() {
                return b.displayName;
              },
              set: function(ke) {
                ye || (Dt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", ke), ye = !0);
              }
            }
          }), b.Consumer = at;
        }
        return b._currentRenderer = null, b._currentRenderer2 = null, b;
      }
      var _r = -1, kr = 0, ir = 1, di = 2;
      function Wa(h) {
        if (h._status === _r) {
          var b = h._result, H = b();
          if (H.then(function(at) {
            if (h._status === kr || h._status === _r) {
              var ke = h;
              ke._status = ir, ke._result = at;
            }
          }, function(at) {
            if (h._status === kr || h._status === _r) {
              var ke = h;
              ke._status = di, ke._result = at;
            }
          }), h._status === _r) {
            var $ = h;
            $._status = kr, $._result = H;
          }
        }
        if (h._status === ir) {
          var ye = h._result;
          return ye === void 0 && Ve(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, ye), "default" in ye || Ve(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, ye), ye.default;
        } else
          throw h._result;
      }
      function pi(h) {
        var b = {
          // We use these fields to store the result.
          _status: _r,
          _result: h
        }, H = {
          $$typeof: ne,
          _payload: b,
          _init: Wa
        };
        {
          var $, ye;
          Object.defineProperties(H, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return $;
              },
              set: function(at) {
                Ve("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), $ = at, Object.defineProperty(H, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return ye;
              },
              set: function(at) {
                Ve("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), ye = at, Object.defineProperty(H, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return H;
      }
      function vi(h) {
        h != null && h.$$typeof === te ? Ve("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? Ve("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && Ve("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && Ve("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var b = {
          $$typeof: Re,
          render: h
        };
        {
          var H;
          Object.defineProperty(b, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return H;
            },
            set: function($) {
              H = $, !h.name && !h.displayName && (h.displayName = $);
            }
          });
        }
        return b;
      }
      var R;
      R = Symbol.for("react.module.reference");
      function ae(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === A || h === re || kt || h === g || h === I || h === ee || Ce || h === K || Te || He || tt || typeof h == "object" && h !== null && (h.$$typeof === ne || h.$$typeof === te || h.$$typeof === U || h.$$typeof === Q || h.$$typeof === Re || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === R || h.getModuleId !== void 0));
      }
      function De(h, b) {
        ae(h) || Ve("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var H = {
          $$typeof: te,
          type: h,
          compare: b === void 0 ? null : b
        };
        {
          var $;
          Object.defineProperty(H, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return $;
            },
            set: function(ye) {
              $ = ye, !h.name && !h.displayName && (h.displayName = ye);
            }
          });
        }
        return H;
      }
      function Be() {
        var h = ge.current;
        return h === null && Ve(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function yt(h) {
        var b = Be();
        if (h._context !== void 0) {
          var H = h._context;
          H.Consumer === h ? Ve("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : H.Provider === h && Ve("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return b.useContext(h);
      }
      function vt(h) {
        var b = Be();
        return b.useState(h);
      }
      function Tt(h, b, H) {
        var $ = Be();
        return $.useReducer(h, b, H);
      }
      function bt(h) {
        var b = Be();
        return b.useRef(h);
      }
      function kn(h, b) {
        var H = Be();
        return H.useEffect(h, b);
      }
      function un(h, b) {
        var H = Be();
        return H.useInsertionEffect(h, b);
      }
      function dn(h, b) {
        var H = Be();
        return H.useLayoutEffect(h, b);
      }
      function lr(h, b) {
        var H = Be();
        return H.useCallback(h, b);
      }
      function Ga(h, b) {
        var H = Be();
        return H.useMemo(h, b);
      }
      function qa(h, b, H) {
        var $ = Be();
        return $.useImperativeHandle(h, b, H);
      }
      function gt(h, b) {
        {
          var H = Be();
          return H.useDebugValue(h, b);
        }
      }
      function Et() {
        var h = Be();
        return h.useTransition();
      }
      function Ka(h) {
        var b = Be();
        return b.useDeferredValue(h);
      }
      function nu() {
        var h = Be();
        return h.useId();
      }
      function ru(h, b, H) {
        var $ = Be();
        return $.useSyncExternalStore(h, b, H);
      }
      var hl = 0, Gu, ml, Qr, Qo, Dr, uc, oc;
      function qu() {
      }
      qu.__reactDisabledLog = !0;
      function yl() {
        {
          if (hl === 0) {
            Gu = console.log, ml = console.info, Qr = console.warn, Qo = console.error, Dr = console.group, uc = console.groupCollapsed, oc = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: qu,
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
              log: q({}, h, {
                value: Gu
              }),
              info: q({}, h, {
                value: ml
              }),
              warn: q({}, h, {
                value: Qr
              }),
              error: q({}, h, {
                value: Qo
              }),
              group: q({}, h, {
                value: Dr
              }),
              groupCollapsed: q({}, h, {
                value: uc
              }),
              groupEnd: q({}, h, {
                value: oc
              })
            });
          }
          hl < 0 && Ve("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Xa = Ct.ReactCurrentDispatcher, Ja;
      function Ku(h, b, H) {
        {
          if (Ja === void 0)
            try {
              throw Error();
            } catch (ye) {
              var $ = ye.stack.trim().match(/\n( *(at )?)/);
              Ja = $ && $[1] || "";
            }
          return `
` + Ja + h;
        }
      }
      var au = !1, gl;
      {
        var Xu = typeof WeakMap == "function" ? WeakMap : Map;
        gl = new Xu();
      }
      function Ju(h, b) {
        if (!h || au)
          return "";
        {
          var H = gl.get(h);
          if (H !== void 0)
            return H;
        }
        var $;
        au = !0;
        var ye = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var at;
        at = Xa.current, Xa.current = null, yl();
        try {
          if (b) {
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
              } catch (Sn) {
                $ = Sn;
              }
              Reflect.construct(h, [], ke);
            } else {
              try {
                ke.call();
              } catch (Sn) {
                $ = Sn;
              }
              h.call(ke.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (Sn) {
              $ = Sn;
            }
            h();
          }
        } catch (Sn) {
          if (Sn && $ && typeof Sn.stack == "string") {
            for (var ut = Sn.stack.split(`
`), _t = $.stack.split(`
`), Ut = ut.length - 1, on = _t.length - 1; Ut >= 1 && on >= 0 && ut[Ut] !== _t[on]; )
              on--;
            for (; Ut >= 1 && on >= 0; Ut--, on--)
              if (ut[Ut] !== _t[on]) {
                if (Ut !== 1 || on !== 1)
                  do
                    if (Ut--, on--, on < 0 || ut[Ut] !== _t[on]) {
                      var Jt = `
` + ut[Ut].replace(" at new ", " at ");
                      return h.displayName && Jt.includes("<anonymous>") && (Jt = Jt.replace("<anonymous>", h.displayName)), typeof h == "function" && gl.set(h, Jt), Jt;
                    }
                  while (Ut >= 1 && on >= 0);
                break;
              }
          }
        } finally {
          au = !1, Xa.current = at, da(), Error.prepareStackTrace = ye;
        }
        var xt = h ? h.displayName || h.name : "", Zt = xt ? Ku(xt) : "";
        return typeof h == "function" && gl.set(h, Zt), Zt;
      }
      function Hi(h, b, H) {
        return Ju(h, !1);
      }
      function qf(h) {
        var b = h.prototype;
        return !!(b && b.isReactComponent);
      }
      function Vi(h, b, H) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Ju(h, qf(h));
        if (typeof h == "string")
          return Ku(h);
        switch (h) {
          case I:
            return Ku("Suspense");
          case ee:
            return Ku("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case Re:
              return Hi(h.render);
            case te:
              return Vi(h.type, b, H);
            case ne: {
              var $ = h, ye = $._payload, at = $._init;
              try {
                return Vi(at(ye), b, H);
              } catch {
              }
            }
          }
        return "";
      }
      var Pt = {}, Zu = Ct.ReactDebugCurrentFrame;
      function zt(h) {
        if (h) {
          var b = h._owner, H = Vi(h.type, h._source, b ? b.type : null);
          Zu.setExtraStackFrame(H);
        } else
          Zu.setExtraStackFrame(null);
      }
      function Wo(h, b, H, $, ye) {
        {
          var at = Function.call.bind(_n);
          for (var ke in h)
            if (at(h, ke)) {
              var ut = void 0;
              try {
                if (typeof h[ke] != "function") {
                  var _t = Error(($ || "React class") + ": " + H + " type `" + ke + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[ke] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw _t.name = "Invariant Violation", _t;
                }
                ut = h[ke](b, ke, $, H, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Ut) {
                ut = Ut;
              }
              ut && !(ut instanceof Error) && (zt(ye), Ve("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", $ || "React class", H, ke, typeof ut), zt(null)), ut instanceof Error && !(ut.message in Pt) && (Pt[ut.message] = !0, zt(ye), Ve("Failed %s type: %s", H, ut.message), zt(null));
            }
        }
      }
      function hi(h) {
        if (h) {
          var b = h._owner, H = Vi(h.type, h._source, b ? b.type : null);
          ie(H);
        } else
          ie(null);
      }
      var pt;
      pt = !1;
      function eo() {
        if (Se.current) {
          var h = Jn(Se.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function ur(h) {
        if (h !== void 0) {
          var b = h.fileName.replace(/^.*[\\\/]/, ""), H = h.lineNumber;
          return `

Check your code at ` + b + ":" + H + ".";
        }
        return "";
      }
      function mi(h) {
        return h != null ? ur(h.__source) : "";
      }
      var Or = {};
      function yi(h) {
        var b = eo();
        if (!b) {
          var H = typeof h == "string" ? h : h.displayName || h.name;
          H && (b = `

Check the top-level render call using <` + H + ">.");
        }
        return b;
      }
      function pn(h, b) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var H = yi(b);
          if (!Or[H]) {
            Or[H] = !0;
            var $ = "";
            h && h._owner && h._owner !== Se.current && ($ = " It was passed a child from " + Jn(h._owner.type) + "."), hi(h), Ve('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', H, $), hi(null);
          }
        }
      }
      function Xt(h, b) {
        if (typeof h == "object") {
          if (cn(h))
            for (var H = 0; H < h.length; H++) {
              var $ = h[H];
              gn($) && pn($, b);
            }
          else if (gn(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var ye = ce(h);
            if (typeof ye == "function" && ye !== h.entries)
              for (var at = ye.call(h), ke; !(ke = at.next()).done; )
                gn(ke.value) && pn(ke.value, b);
          }
        }
      }
      function Sl(h) {
        {
          var b = h.type;
          if (b == null || typeof b == "string")
            return;
          var H;
          if (typeof b == "function")
            H = b.propTypes;
          else if (typeof b == "object" && (b.$$typeof === Re || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          b.$$typeof === te))
            H = b.propTypes;
          else
            return;
          if (H) {
            var $ = Jn(b);
            Wo(H, h.props, "prop", $, h);
          } else if (b.PropTypes !== void 0 && !pt) {
            pt = !0;
            var ye = Jn(b);
            Ve("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ye || "Unknown");
          }
          typeof b.getDefaultProps == "function" && !b.getDefaultProps.isReactClassApproved && Ve("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function Wn(h) {
        {
          for (var b = Object.keys(h.props), H = 0; H < b.length; H++) {
            var $ = b[H];
            if ($ !== "children" && $ !== "key") {
              hi(h), Ve("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", $), hi(null);
              break;
            }
          }
          h.ref !== null && (hi(h), Ve("Invalid attribute `ref` supplied to `React.Fragment`."), hi(null));
        }
      }
      function Nr(h, b, H) {
        var $ = ae(h);
        if (!$) {
          var ye = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (ye += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var at = mi(b);
          at ? ye += at : ye += eo();
          var ke;
          h === null ? ke = "null" : cn(h) ? ke = "array" : h !== void 0 && h.$$typeof === Z ? (ke = "<" + (Jn(h.type) || "Unknown") + " />", ye = " Did you accidentally export a JSX literal instead of a component?") : ke = typeof h, Ve("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ke, ye);
        }
        var ut = wt.apply(this, arguments);
        if (ut == null)
          return ut;
        if ($)
          for (var _t = 2; _t < arguments.length; _t++)
            Xt(arguments[_t], h);
        return h === A ? Wn(ut) : Sl(ut), ut;
      }
      var Ra = !1;
      function iu(h) {
        var b = Nr.bind(null, h);
        return b.type = h, Ra || (Ra = !0, Dt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(b, "type", {
          enumerable: !1,
          get: function() {
            return Dt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), b;
      }
      function Go(h, b, H) {
        for (var $ = an.apply(this, arguments), ye = 2; ye < arguments.length; ye++)
          Xt(arguments[ye], $.type);
        return Sl($), $;
      }
      function qo(h, b) {
        var H = Le.transition;
        Le.transition = {};
        var $ = Le.transition;
        Le.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (Le.transition = H, H === null && $._updatedFibers) {
            var ye = $._updatedFibers.size;
            ye > 10 && Dt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), $._updatedFibers.clear();
          }
        }
      }
      var El = !1, lu = null;
      function Kf(h) {
        if (lu === null)
          try {
            var b = ("require" + Math.random()).slice(0, 7), H = T && T[b];
            lu = H.call(T, "timers").setImmediate;
          } catch {
            lu = function(ye) {
              El === !1 && (El = !0, typeof MessageChannel > "u" && Ve("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var at = new MessageChannel();
              at.port1.onmessage = ye, at.port2.postMessage(void 0);
            };
          }
        return lu(h);
      }
      var Ta = 0, Za = !1;
      function gi(h) {
        {
          var b = Ta;
          Ta++, he.current === null && (he.current = []);
          var H = he.isBatchingLegacy, $;
          try {
            if (he.isBatchingLegacy = !0, $ = h(), !H && he.didScheduleLegacyUpdate) {
              var ye = he.current;
              ye !== null && (he.didScheduleLegacyUpdate = !1, Cl(ye));
            }
          } catch (xt) {
            throw _a(b), xt;
          } finally {
            he.isBatchingLegacy = H;
          }
          if ($ !== null && typeof $ == "object" && typeof $.then == "function") {
            var at = $, ke = !1, ut = {
              then: function(xt, Zt) {
                ke = !0, at.then(function(Sn) {
                  _a(b), Ta === 0 ? to(Sn, xt, Zt) : xt(Sn);
                }, function(Sn) {
                  _a(b), Zt(Sn);
                });
              }
            };
            return !Za && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              ke || (Za = !0, Ve("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), ut;
          } else {
            var _t = $;
            if (_a(b), Ta === 0) {
              var Ut = he.current;
              Ut !== null && (Cl(Ut), he.current = null);
              var on = {
                then: function(xt, Zt) {
                  he.current === null ? (he.current = [], to(_t, xt, Zt)) : xt(_t);
                }
              };
              return on;
            } else {
              var Jt = {
                then: function(xt, Zt) {
                  xt(_t);
                }
              };
              return Jt;
            }
          }
        }
      }
      function _a(h) {
        h !== Ta - 1 && Ve("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Ta = h;
      }
      function to(h, b, H) {
        {
          var $ = he.current;
          if ($ !== null)
            try {
              Cl($), Kf(function() {
                $.length === 0 ? (he.current = null, b(h)) : to(h, b, H);
              });
            } catch (ye) {
              H(ye);
            }
          else
            b(h);
        }
      }
      var no = !1;
      function Cl(h) {
        if (!no) {
          no = !0;
          var b = 0;
          try {
            for (; b < h.length; b++) {
              var H = h[b];
              do
                H = H(!0);
              while (H !== null);
            }
            h.length = 0;
          } catch ($) {
            throw h = h.slice(b + 1), $;
          } finally {
            no = !1;
          }
        }
      }
      var uu = Nr, ro = Go, ao = iu, ei = {
        map: Pi,
        forEach: eu,
        count: Zl,
        toArray: pl,
        only: vl
      };
      w.Children = ei, w.Component = et, w.Fragment = A, w.Profiler = re, w.PureComponent = rt, w.StrictMode = g, w.Suspense = I, w.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ct, w.act = gi, w.cloneElement = ro, w.createContext = tu, w.createElement = uu, w.createFactory = ao, w.createRef = $t, w.forwardRef = vi, w.isValidElement = gn, w.lazy = pi, w.memo = De, w.startTransition = qo, w.unstable_act = gi, w.useCallback = lr, w.useContext = yt, w.useDebugValue = gt, w.useDeferredValue = Ka, w.useEffect = kn, w.useId = nu, w.useImperativeHandle = qa, w.useInsertionEffect = un, w.useLayoutEffect = dn, w.useMemo = Ga, w.useReducer = Tt, w.useRef = bt, w.useState = vt, w.useSyncExternalStore = ru, w.useTransition = Et, w.version = x, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(rv, rv.exports)), rv.exports;
}
process.env.NODE_ENV === "production" ? wE.exports = lk() : wE.exports = uk();
var Y = wE.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ux;
function ok() {
  if (ux) return ev;
  ux = 1;
  var T = Y, w = Symbol.for("react.element"), x = Symbol.for("react.fragment"), Z = Object.prototype.hasOwnProperty, J = T.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, A = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(re, U, Q) {
    var Re, I = {}, ee = null, te = null;
    Q !== void 0 && (ee = "" + Q), U.key !== void 0 && (ee = "" + U.key), U.ref !== void 0 && (te = U.ref);
    for (Re in U) Z.call(U, Re) && !A.hasOwnProperty(Re) && (I[Re] = U[Re]);
    if (re && re.defaultProps) for (Re in U = re.defaultProps, U) I[Re] === void 0 && (I[Re] = U[Re]);
    return { $$typeof: w, type: re, key: ee, ref: te, props: I, _owner: J.current };
  }
  return ev.Fragment = x, ev.jsx = g, ev.jsxs = g, ev;
}
var tv = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ox;
function sk() {
  return ox || (ox = 1, process.env.NODE_ENV !== "production" && function() {
    var T = Y, w = Symbol.for("react.element"), x = Symbol.for("react.portal"), Z = Symbol.for("react.fragment"), J = Symbol.for("react.strict_mode"), A = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), re = Symbol.for("react.context"), U = Symbol.for("react.forward_ref"), Q = Symbol.for("react.suspense"), Re = Symbol.for("react.suspense_list"), I = Symbol.for("react.memo"), ee = Symbol.for("react.lazy"), te = Symbol.for("react.offscreen"), ne = Symbol.iterator, K = "@@iterator";
    function Ee(R) {
      if (R === null || typeof R != "object")
        return null;
      var ae = ne && R[ne] || R[K];
      return typeof ae == "function" ? ae : null;
    }
    var Ue = T.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function ce(R) {
      {
        for (var ae = arguments.length, De = new Array(ae > 1 ? ae - 1 : 0), Be = 1; Be < ae; Be++)
          De[Be - 1] = arguments[Be];
        ge("error", R, De);
      }
    }
    function ge(R, ae, De) {
      {
        var Be = Ue.ReactDebugCurrentFrame, yt = Be.getStackAddendum();
        yt !== "" && (ae += "%s", De = De.concat([yt]));
        var vt = De.map(function(Tt) {
          return String(Tt);
        });
        vt.unshift("Warning: " + ae), Function.prototype.apply.call(console[R], console, vt);
      }
    }
    var Le = !1, he = !1, Se = !1, P = !1, de = !1, ie;
    ie = Symbol.for("react.module.reference");
    function Te(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === Z || R === A || de || R === J || R === Q || R === Re || P || R === te || Le || he || Se || typeof R == "object" && R !== null && (R.$$typeof === ee || R.$$typeof === I || R.$$typeof === g || R.$$typeof === re || R.$$typeof === U || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === ie || R.getModuleId !== void 0));
    }
    function He(R, ae, De) {
      var Be = R.displayName;
      if (Be)
        return Be;
      var yt = ae.displayName || ae.name || "";
      return yt !== "" ? De + "(" + yt + ")" : De;
    }
    function tt(R) {
      return R.displayName || "Context";
    }
    function Ce(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && ce("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case Z:
          return "Fragment";
        case x:
          return "Portal";
        case A:
          return "Profiler";
        case J:
          return "StrictMode";
        case Q:
          return "Suspense";
        case Re:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case re:
            var ae = R;
            return tt(ae) + ".Consumer";
          case g:
            var De = R;
            return tt(De._context) + ".Provider";
          case U:
            return He(R, R.render, "ForwardRef");
          case I:
            var Be = R.displayName || null;
            return Be !== null ? Be : Ce(R.type) || "Memo";
          case ee: {
            var yt = R, vt = yt._payload, Tt = yt._init;
            try {
              return Ce(Tt(vt));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var kt = Object.assign, Ct = 0, Dt, Ve, me, Qe, we, N, q;
    function nt() {
    }
    nt.__reactDisabledLog = !0;
    function et() {
      {
        if (Ct === 0) {
          Dt = console.log, Ve = console.info, me = console.warn, Qe = console.error, we = console.group, N = console.groupCollapsed, q = console.groupEnd;
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
        Ct++;
      }
    }
    function be() {
      {
        if (Ct--, Ct === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: kt({}, R, {
              value: Dt
            }),
            info: kt({}, R, {
              value: Ve
            }),
            warn: kt({}, R, {
              value: me
            }),
            error: kt({}, R, {
              value: Qe
            }),
            group: kt({}, R, {
              value: we
            }),
            groupCollapsed: kt({}, R, {
              value: N
            }),
            groupEnd: kt({}, R, {
              value: q
            })
          });
        }
        Ct < 0 && ce("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var We = Ue.ReactCurrentDispatcher, fe;
    function Fe(R, ae, De) {
      {
        if (fe === void 0)
          try {
            throw Error();
          } catch (yt) {
            var Be = yt.stack.trim().match(/\n( *(at )?)/);
            fe = Be && Be[1] || "";
          }
        return `
` + fe + R;
      }
    }
    var rt = !1, dt;
    {
      var $t = typeof WeakMap == "function" ? WeakMap : Map;
      dt = new $t();
    }
    function yn(R, ae) {
      if (!R || rt)
        return "";
      {
        var De = dt.get(R);
        if (De !== void 0)
          return De;
      }
      var Be;
      rt = !0;
      var yt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var vt;
      vt = We.current, We.current = null, et();
      try {
        if (ae) {
          var Tt = function() {
            throw Error();
          };
          if (Object.defineProperty(Tt.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Tt, []);
            } catch (gt) {
              Be = gt;
            }
            Reflect.construct(R, [], Tt);
          } else {
            try {
              Tt.call();
            } catch (gt) {
              Be = gt;
            }
            R.call(Tt.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (gt) {
            Be = gt;
          }
          R();
        }
      } catch (gt) {
        if (gt && Be && typeof gt.stack == "string") {
          for (var bt = gt.stack.split(`
`), kn = Be.stack.split(`
`), un = bt.length - 1, dn = kn.length - 1; un >= 1 && dn >= 0 && bt[un] !== kn[dn]; )
            dn--;
          for (; un >= 1 && dn >= 0; un--, dn--)
            if (bt[un] !== kn[dn]) {
              if (un !== 1 || dn !== 1)
                do
                  if (un--, dn--, dn < 0 || bt[un] !== kn[dn]) {
                    var lr = `
` + bt[un].replace(" at new ", " at ");
                    return R.displayName && lr.includes("<anonymous>") && (lr = lr.replace("<anonymous>", R.displayName)), typeof R == "function" && dt.set(R, lr), lr;
                  }
                while (un >= 1 && dn >= 0);
              break;
            }
        }
      } finally {
        rt = !1, We.current = vt, be(), Error.prepareStackTrace = yt;
      }
      var Ga = R ? R.displayName || R.name : "", qa = Ga ? Fe(Ga) : "";
      return typeof R == "function" && dt.set(R, qa), qa;
    }
    function cn(R, ae, De) {
      return yn(R, !1);
    }
    function bn(R) {
      var ae = R.prototype;
      return !!(ae && ae.isReactComponent);
    }
    function Tn(R, ae, De) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return yn(R, bn(R));
      if (typeof R == "string")
        return Fe(R);
      switch (R) {
        case Q:
          return Fe("Suspense");
        case Re:
          return Fe("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case U:
            return cn(R.render);
          case I:
            return Tn(R.type, ae, De);
          case ee: {
            var Be = R, yt = Be._payload, vt = Be._init;
            try {
              return Tn(vt(yt), ae, De);
            } catch {
            }
          }
        }
      return "";
    }
    var $n = Object.prototype.hasOwnProperty, $r = {}, ci = Ue.ReactDebugCurrentFrame;
    function sa(R) {
      if (R) {
        var ae = R._owner, De = Tn(R.type, R._source, ae ? ae.type : null);
        ci.setExtraStackFrame(De);
      } else
        ci.setExtraStackFrame(null);
    }
    function Jn(R, ae, De, Be, yt) {
      {
        var vt = Function.call.bind($n);
        for (var Tt in R)
          if (vt(R, Tt)) {
            var bt = void 0;
            try {
              if (typeof R[Tt] != "function") {
                var kn = Error((Be || "React class") + ": " + De + " type `" + Tt + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[Tt] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw kn.name = "Invariant Violation", kn;
              }
              bt = R[Tt](ae, Tt, Be, De, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (un) {
              bt = un;
            }
            bt && !(bt instanceof Error) && (sa(yt), ce("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Be || "React class", De, Tt, typeof bt), sa(null)), bt instanceof Error && !(bt.message in $r) && ($r[bt.message] = !0, sa(yt), ce("Failed %s type: %s", De, bt.message), sa(null));
          }
      }
    }
    var _n = Array.isArray;
    function Qn(R) {
      return _n(R);
    }
    function Er(R) {
      {
        var ae = typeof Symbol == "function" && Symbol.toStringTag, De = ae && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return De;
      }
    }
    function $a(R) {
      try {
        return An(R), !1;
      } catch {
        return !0;
      }
    }
    function An(R) {
      return "" + R;
    }
    function Cr(R) {
      if ($a(R))
        return ce("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Er(R)), An(R);
    }
    var ca = Ue.ReactCurrentOwner, Qa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, fi, xe;
    function qe(R) {
      if ($n.call(R, "ref")) {
        var ae = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (ae && ae.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function wt(R) {
      if ($n.call(R, "key")) {
        var ae = Object.getOwnPropertyDescriptor(R, "key").get;
        if (ae && ae.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function Qt(R, ae) {
      typeof R.ref == "string" && ca.current;
    }
    function an(R, ae) {
      {
        var De = function() {
          fi || (fi = !0, ce("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ae));
        };
        De.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: De,
          configurable: !0
        });
      }
    }
    function gn(R, ae) {
      {
        var De = function() {
          xe || (xe = !0, ce("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", ae));
        };
        De.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: De,
          configurable: !0
        });
      }
    }
    var fn = function(R, ae, De, Be, yt, vt, Tt) {
      var bt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: w,
        // Built-in properties that belong on the element
        type: R,
        key: ae,
        ref: De,
        props: Tt,
        // Record the component responsible for creating this element.
        _owner: vt
      };
      return bt._store = {}, Object.defineProperty(bt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(bt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Be
      }), Object.defineProperty(bt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: yt
      }), Object.freeze && (Object.freeze(bt.props), Object.freeze(bt)), bt;
    };
    function Zn(R, ae, De, Be, yt) {
      {
        var vt, Tt = {}, bt = null, kn = null;
        De !== void 0 && (Cr(De), bt = "" + De), wt(ae) && (Cr(ae.key), bt = "" + ae.key), qe(ae) && (kn = ae.ref, Qt(ae, yt));
        for (vt in ae)
          $n.call(ae, vt) && !Qa.hasOwnProperty(vt) && (Tt[vt] = ae[vt]);
        if (R && R.defaultProps) {
          var un = R.defaultProps;
          for (vt in un)
            Tt[vt] === void 0 && (Tt[vt] = un[vt]);
        }
        if (bt || kn) {
          var dn = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          bt && an(Tt, dn), kn && gn(Tt, dn);
        }
        return fn(R, bt, kn, yt, Be, ca.current, Tt);
      }
    }
    var ln = Ue.ReactCurrentOwner, qt = Ue.ReactDebugCurrentFrame;
    function Kt(R) {
      if (R) {
        var ae = R._owner, De = Tn(R.type, R._source, ae ? ae.type : null);
        qt.setExtraStackFrame(De);
      } else
        qt.setExtraStackFrame(null);
    }
    var fa;
    fa = !1;
    function wr(R) {
      return typeof R == "object" && R !== null && R.$$typeof === w;
    }
    function ba() {
      {
        if (ln.current) {
          var R = Ce(ln.current.type);
          if (R)
            return `

Check the render method of \`` + R + "`.";
        }
        return "";
      }
    }
    function Pi(R) {
      return "";
    }
    var Zl = {};
    function eu(R) {
      {
        var ae = ba();
        if (!ae) {
          var De = typeof R == "string" ? R : R.displayName || R.name;
          De && (ae = `

Check the top-level render call using <` + De + ">.");
        }
        return ae;
      }
    }
    function pl(R, ae) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var De = eu(ae);
        if (Zl[De])
          return;
        Zl[De] = !0;
        var Be = "";
        R && R._owner && R._owner !== ln.current && (Be = " It was passed a child from " + Ce(R._owner.type) + "."), Kt(R), ce('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', De, Be), Kt(null);
      }
    }
    function vl(R, ae) {
      {
        if (typeof R != "object")
          return;
        if (Qn(R))
          for (var De = 0; De < R.length; De++) {
            var Be = R[De];
            wr(Be) && pl(Be, ae);
          }
        else if (wr(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var yt = Ee(R);
          if (typeof yt == "function" && yt !== R.entries)
            for (var vt = yt.call(R), Tt; !(Tt = vt.next()).done; )
              wr(Tt.value) && pl(Tt.value, ae);
        }
      }
    }
    function tu(R) {
      {
        var ae = R.type;
        if (ae == null || typeof ae == "string")
          return;
        var De;
        if (typeof ae == "function")
          De = ae.propTypes;
        else if (typeof ae == "object" && (ae.$$typeof === U || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        ae.$$typeof === I))
          De = ae.propTypes;
        else
          return;
        if (De) {
          var Be = Ce(ae);
          Jn(De, R.props, "prop", Be, R);
        } else if (ae.PropTypes !== void 0 && !fa) {
          fa = !0;
          var yt = Ce(ae);
          ce("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", yt || "Unknown");
        }
        typeof ae.getDefaultProps == "function" && !ae.getDefaultProps.isReactClassApproved && ce("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function _r(R) {
      {
        for (var ae = Object.keys(R.props), De = 0; De < ae.length; De++) {
          var Be = ae[De];
          if (Be !== "children" && Be !== "key") {
            Kt(R), ce("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Be), Kt(null);
            break;
          }
        }
        R.ref !== null && (Kt(R), ce("Invalid attribute `ref` supplied to `React.Fragment`."), Kt(null));
      }
    }
    var kr = {};
    function ir(R, ae, De, Be, yt, vt) {
      {
        var Tt = Te(R);
        if (!Tt) {
          var bt = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (bt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var kn = Pi();
          kn ? bt += kn : bt += ba();
          var un;
          R === null ? un = "null" : Qn(R) ? un = "array" : R !== void 0 && R.$$typeof === w ? (un = "<" + (Ce(R.type) || "Unknown") + " />", bt = " Did you accidentally export a JSX literal instead of a component?") : un = typeof R, ce("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", un, bt);
        }
        var dn = Zn(R, ae, De, yt, vt);
        if (dn == null)
          return dn;
        if (Tt) {
          var lr = ae.children;
          if (lr !== void 0)
            if (Be)
              if (Qn(lr)) {
                for (var Ga = 0; Ga < lr.length; Ga++)
                  vl(lr[Ga], R);
                Object.freeze && Object.freeze(lr);
              } else
                ce("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              vl(lr, R);
        }
        if ($n.call(ae, "key")) {
          var qa = Ce(R), gt = Object.keys(ae).filter(function(nu) {
            return nu !== "key";
          }), Et = gt.length > 0 ? "{key: someKey, " + gt.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!kr[qa + Et]) {
            var Ka = gt.length > 0 ? "{" + gt.join(": ..., ") + ": ...}" : "{}";
            ce(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Et, qa, Ka, qa), kr[qa + Et] = !0;
          }
        }
        return R === Z ? _r(dn) : tu(dn), dn;
      }
    }
    function di(R, ae, De) {
      return ir(R, ae, De, !0);
    }
    function Wa(R, ae, De) {
      return ir(R, ae, De, !1);
    }
    var pi = Wa, vi = di;
    tv.Fragment = Z, tv.jsx = pi, tv.jsxs = vi;
  }()), tv;
}
process.env.NODE_ENV === "production" ? CE.exports = ok() : CE.exports = sk();
var E = CE.exports, xE = { exports: {} }, Ia = {}, qm = { exports: {} }, yE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sx;
function ck() {
  return sx || (sx = 1, function(T) {
    function w(me, Qe) {
      var we = me.length;
      me.push(Qe);
      e: for (; 0 < we; ) {
        var N = we - 1 >>> 1, q = me[N];
        if (0 < J(q, Qe)) me[N] = Qe, me[we] = q, we = N;
        else break e;
      }
    }
    function x(me) {
      return me.length === 0 ? null : me[0];
    }
    function Z(me) {
      if (me.length === 0) return null;
      var Qe = me[0], we = me.pop();
      if (we !== Qe) {
        me[0] = we;
        e: for (var N = 0, q = me.length, nt = q >>> 1; N < nt; ) {
          var et = 2 * (N + 1) - 1, be = me[et], We = et + 1, fe = me[We];
          if (0 > J(be, we)) We < q && 0 > J(fe, be) ? (me[N] = fe, me[We] = we, N = We) : (me[N] = be, me[et] = we, N = et);
          else if (We < q && 0 > J(fe, we)) me[N] = fe, me[We] = we, N = We;
          else break e;
        }
      }
      return Qe;
    }
    function J(me, Qe) {
      var we = me.sortIndex - Qe.sortIndex;
      return we !== 0 ? we : me.id - Qe.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var A = performance;
      T.unstable_now = function() {
        return A.now();
      };
    } else {
      var g = Date, re = g.now();
      T.unstable_now = function() {
        return g.now() - re;
      };
    }
    var U = [], Q = [], Re = 1, I = null, ee = 3, te = !1, ne = !1, K = !1, Ee = typeof setTimeout == "function" ? setTimeout : null, Ue = typeof clearTimeout == "function" ? clearTimeout : null, ce = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function ge(me) {
      for (var Qe = x(Q); Qe !== null; ) {
        if (Qe.callback === null) Z(Q);
        else if (Qe.startTime <= me) Z(Q), Qe.sortIndex = Qe.expirationTime, w(U, Qe);
        else break;
        Qe = x(Q);
      }
    }
    function Le(me) {
      if (K = !1, ge(me), !ne) if (x(U) !== null) ne = !0, Dt(he);
      else {
        var Qe = x(Q);
        Qe !== null && Ve(Le, Qe.startTime - me);
      }
    }
    function he(me, Qe) {
      ne = !1, K && (K = !1, Ue(de), de = -1), te = !0;
      var we = ee;
      try {
        for (ge(Qe), I = x(U); I !== null && (!(I.expirationTime > Qe) || me && !He()); ) {
          var N = I.callback;
          if (typeof N == "function") {
            I.callback = null, ee = I.priorityLevel;
            var q = N(I.expirationTime <= Qe);
            Qe = T.unstable_now(), typeof q == "function" ? I.callback = q : I === x(U) && Z(U), ge(Qe);
          } else Z(U);
          I = x(U);
        }
        if (I !== null) var nt = !0;
        else {
          var et = x(Q);
          et !== null && Ve(Le, et.startTime - Qe), nt = !1;
        }
        return nt;
      } finally {
        I = null, ee = we, te = !1;
      }
    }
    var Se = !1, P = null, de = -1, ie = 5, Te = -1;
    function He() {
      return !(T.unstable_now() - Te < ie);
    }
    function tt() {
      if (P !== null) {
        var me = T.unstable_now();
        Te = me;
        var Qe = !0;
        try {
          Qe = P(!0, me);
        } finally {
          Qe ? Ce() : (Se = !1, P = null);
        }
      } else Se = !1;
    }
    var Ce;
    if (typeof ce == "function") Ce = function() {
      ce(tt);
    };
    else if (typeof MessageChannel < "u") {
      var kt = new MessageChannel(), Ct = kt.port2;
      kt.port1.onmessage = tt, Ce = function() {
        Ct.postMessage(null);
      };
    } else Ce = function() {
      Ee(tt, 0);
    };
    function Dt(me) {
      P = me, Se || (Se = !0, Ce());
    }
    function Ve(me, Qe) {
      de = Ee(function() {
        me(T.unstable_now());
      }, Qe);
    }
    T.unstable_IdlePriority = 5, T.unstable_ImmediatePriority = 1, T.unstable_LowPriority = 4, T.unstable_NormalPriority = 3, T.unstable_Profiling = null, T.unstable_UserBlockingPriority = 2, T.unstable_cancelCallback = function(me) {
      me.callback = null;
    }, T.unstable_continueExecution = function() {
      ne || te || (ne = !0, Dt(he));
    }, T.unstable_forceFrameRate = function(me) {
      0 > me || 125 < me ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ie = 0 < me ? Math.floor(1e3 / me) : 5;
    }, T.unstable_getCurrentPriorityLevel = function() {
      return ee;
    }, T.unstable_getFirstCallbackNode = function() {
      return x(U);
    }, T.unstable_next = function(me) {
      switch (ee) {
        case 1:
        case 2:
        case 3:
          var Qe = 3;
          break;
        default:
          Qe = ee;
      }
      var we = ee;
      ee = Qe;
      try {
        return me();
      } finally {
        ee = we;
      }
    }, T.unstable_pauseExecution = function() {
    }, T.unstable_requestPaint = function() {
    }, T.unstable_runWithPriority = function(me, Qe) {
      switch (me) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          me = 3;
      }
      var we = ee;
      ee = me;
      try {
        return Qe();
      } finally {
        ee = we;
      }
    }, T.unstable_scheduleCallback = function(me, Qe, we) {
      var N = T.unstable_now();
      switch (typeof we == "object" && we !== null ? (we = we.delay, we = typeof we == "number" && 0 < we ? N + we : N) : we = N, me) {
        case 1:
          var q = -1;
          break;
        case 2:
          q = 250;
          break;
        case 5:
          q = 1073741823;
          break;
        case 4:
          q = 1e4;
          break;
        default:
          q = 5e3;
      }
      return q = we + q, me = { id: Re++, callback: Qe, priorityLevel: me, startTime: we, expirationTime: q, sortIndex: -1 }, we > N ? (me.sortIndex = we, w(Q, me), x(U) === null && me === x(Q) && (K ? (Ue(de), de = -1) : K = !0, Ve(Le, we - N))) : (me.sortIndex = q, w(U, me), ne || te || (ne = !0, Dt(he))), me;
    }, T.unstable_shouldYield = He, T.unstable_wrapCallback = function(me) {
      var Qe = ee;
      return function() {
        var we = ee;
        ee = Qe;
        try {
          return me.apply(this, arguments);
        } finally {
          ee = we;
        }
      };
    };
  }(yE)), yE;
}
var gE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cx;
function fk() {
  return cx || (cx = 1, function(T) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var w = !1, x = 5;
      function Z(xe, qe) {
        var wt = xe.length;
        xe.push(qe), g(xe, qe, wt);
      }
      function J(xe) {
        return xe.length === 0 ? null : xe[0];
      }
      function A(xe) {
        if (xe.length === 0)
          return null;
        var qe = xe[0], wt = xe.pop();
        return wt !== qe && (xe[0] = wt, re(xe, wt, 0)), qe;
      }
      function g(xe, qe, wt) {
        for (var Qt = wt; Qt > 0; ) {
          var an = Qt - 1 >>> 1, gn = xe[an];
          if (U(gn, qe) > 0)
            xe[an] = qe, xe[Qt] = gn, Qt = an;
          else
            return;
        }
      }
      function re(xe, qe, wt) {
        for (var Qt = wt, an = xe.length, gn = an >>> 1; Qt < gn; ) {
          var fn = (Qt + 1) * 2 - 1, Zn = xe[fn], ln = fn + 1, qt = xe[ln];
          if (U(Zn, qe) < 0)
            ln < an && U(qt, Zn) < 0 ? (xe[Qt] = qt, xe[ln] = qe, Qt = ln) : (xe[Qt] = Zn, xe[fn] = qe, Qt = fn);
          else if (ln < an && U(qt, qe) < 0)
            xe[Qt] = qt, xe[ln] = qe, Qt = ln;
          else
            return;
        }
      }
      function U(xe, qe) {
        var wt = xe.sortIndex - qe.sortIndex;
        return wt !== 0 ? wt : xe.id - qe.id;
      }
      var Q = 1, Re = 2, I = 3, ee = 4, te = 5;
      function ne(xe, qe) {
      }
      var K = typeof performance == "object" && typeof performance.now == "function";
      if (K) {
        var Ee = performance;
        T.unstable_now = function() {
          return Ee.now();
        };
      } else {
        var Ue = Date, ce = Ue.now();
        T.unstable_now = function() {
          return Ue.now() - ce;
        };
      }
      var ge = 1073741823, Le = -1, he = 250, Se = 5e3, P = 1e4, de = ge, ie = [], Te = [], He = 1, tt = null, Ce = I, kt = !1, Ct = !1, Dt = !1, Ve = typeof setTimeout == "function" ? setTimeout : null, me = typeof clearTimeout == "function" ? clearTimeout : null, Qe = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function we(xe) {
        for (var qe = J(Te); qe !== null; ) {
          if (qe.callback === null)
            A(Te);
          else if (qe.startTime <= xe)
            A(Te), qe.sortIndex = qe.expirationTime, Z(ie, qe);
          else
            return;
          qe = J(Te);
        }
      }
      function N(xe) {
        if (Dt = !1, we(xe), !Ct)
          if (J(ie) !== null)
            Ct = !0, An(q);
          else {
            var qe = J(Te);
            qe !== null && Cr(N, qe.startTime - xe);
          }
      }
      function q(xe, qe) {
        Ct = !1, Dt && (Dt = !1, ca()), kt = !0;
        var wt = Ce;
        try {
          var Qt;
          if (!w) return nt(xe, qe);
        } finally {
          tt = null, Ce = wt, kt = !1;
        }
      }
      function nt(xe, qe) {
        var wt = qe;
        for (we(wt), tt = J(ie); tt !== null && !(tt.expirationTime > wt && (!xe || ci())); ) {
          var Qt = tt.callback;
          if (typeof Qt == "function") {
            tt.callback = null, Ce = tt.priorityLevel;
            var an = tt.expirationTime <= wt, gn = Qt(an);
            wt = T.unstable_now(), typeof gn == "function" ? tt.callback = gn : tt === J(ie) && A(ie), we(wt);
          } else
            A(ie);
          tt = J(ie);
        }
        if (tt !== null)
          return !0;
        var fn = J(Te);
        return fn !== null && Cr(N, fn.startTime - wt), !1;
      }
      function et(xe, qe) {
        switch (xe) {
          case Q:
          case Re:
          case I:
          case ee:
          case te:
            break;
          default:
            xe = I;
        }
        var wt = Ce;
        Ce = xe;
        try {
          return qe();
        } finally {
          Ce = wt;
        }
      }
      function be(xe) {
        var qe;
        switch (Ce) {
          case Q:
          case Re:
          case I:
            qe = I;
            break;
          default:
            qe = Ce;
            break;
        }
        var wt = Ce;
        Ce = qe;
        try {
          return xe();
        } finally {
          Ce = wt;
        }
      }
      function We(xe) {
        var qe = Ce;
        return function() {
          var wt = Ce;
          Ce = qe;
          try {
            return xe.apply(this, arguments);
          } finally {
            Ce = wt;
          }
        };
      }
      function fe(xe, qe, wt) {
        var Qt = T.unstable_now(), an;
        if (typeof wt == "object" && wt !== null) {
          var gn = wt.delay;
          typeof gn == "number" && gn > 0 ? an = Qt + gn : an = Qt;
        } else
          an = Qt;
        var fn;
        switch (xe) {
          case Q:
            fn = Le;
            break;
          case Re:
            fn = he;
            break;
          case te:
            fn = de;
            break;
          case ee:
            fn = P;
            break;
          case I:
          default:
            fn = Se;
            break;
        }
        var Zn = an + fn, ln = {
          id: He++,
          callback: qe,
          priorityLevel: xe,
          startTime: an,
          expirationTime: Zn,
          sortIndex: -1
        };
        return an > Qt ? (ln.sortIndex = an, Z(Te, ln), J(ie) === null && ln === J(Te) && (Dt ? ca() : Dt = !0, Cr(N, an - Qt))) : (ln.sortIndex = Zn, Z(ie, ln), !Ct && !kt && (Ct = !0, An(q))), ln;
      }
      function Fe() {
      }
      function rt() {
        !Ct && !kt && (Ct = !0, An(q));
      }
      function dt() {
        return J(ie);
      }
      function $t(xe) {
        xe.callback = null;
      }
      function yn() {
        return Ce;
      }
      var cn = !1, bn = null, Tn = -1, $n = x, $r = -1;
      function ci() {
        var xe = T.unstable_now() - $r;
        return !(xe < $n);
      }
      function sa() {
      }
      function Jn(xe) {
        if (xe < 0 || xe > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        xe > 0 ? $n = Math.floor(1e3 / xe) : $n = x;
      }
      var _n = function() {
        if (bn !== null) {
          var xe = T.unstable_now();
          $r = xe;
          var qe = !0, wt = !0;
          try {
            wt = bn(qe, xe);
          } finally {
            wt ? Qn() : (cn = !1, bn = null);
          }
        } else
          cn = !1;
      }, Qn;
      if (typeof Qe == "function")
        Qn = function() {
          Qe(_n);
        };
      else if (typeof MessageChannel < "u") {
        var Er = new MessageChannel(), $a = Er.port2;
        Er.port1.onmessage = _n, Qn = function() {
          $a.postMessage(null);
        };
      } else
        Qn = function() {
          Ve(_n, 0);
        };
      function An(xe) {
        bn = xe, cn || (cn = !0, Qn());
      }
      function Cr(xe, qe) {
        Tn = Ve(function() {
          xe(T.unstable_now());
        }, qe);
      }
      function ca() {
        me(Tn), Tn = -1;
      }
      var Qa = sa, fi = null;
      T.unstable_IdlePriority = te, T.unstable_ImmediatePriority = Q, T.unstable_LowPriority = ee, T.unstable_NormalPriority = I, T.unstable_Profiling = fi, T.unstable_UserBlockingPriority = Re, T.unstable_cancelCallback = $t, T.unstable_continueExecution = rt, T.unstable_forceFrameRate = Jn, T.unstable_getCurrentPriorityLevel = yn, T.unstable_getFirstCallbackNode = dt, T.unstable_next = be, T.unstable_pauseExecution = Fe, T.unstable_requestPaint = Qa, T.unstable_runWithPriority = et, T.unstable_scheduleCallback = fe, T.unstable_shouldYield = ci, T.unstable_wrapCallback = We, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(gE)), gE;
}
var fx;
function mx() {
  return fx || (fx = 1, process.env.NODE_ENV === "production" ? qm.exports = ck() : qm.exports = fk()), qm.exports;
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
var dx;
function dk() {
  if (dx) return Ia;
  dx = 1;
  var T = Y, w = mx();
  function x(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var Z = /* @__PURE__ */ new Set(), J = {};
  function A(n, r) {
    g(n, r), g(n + "Capture", r);
  }
  function g(n, r) {
    for (J[n] = r, n = 0; n < r.length; n++) Z.add(r[n]);
  }
  var re = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), U = Object.prototype.hasOwnProperty, Q = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Re = {}, I = {};
  function ee(n) {
    return U.call(I, n) ? !0 : U.call(Re, n) ? !1 : Q.test(n) ? I[n] = !0 : (Re[n] = !0, !1);
  }
  function te(n, r, l, o) {
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
  function ne(n, r, l, o) {
    if (r === null || typeof r > "u" || te(n, r, l, o)) return !0;
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
  function K(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var Ee = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    Ee[n] = new K(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    Ee[r] = new K(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    Ee[n] = new K(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    Ee[n] = new K(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    Ee[n] = new K(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    Ee[n] = new K(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    Ee[n] = new K(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    Ee[n] = new K(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    Ee[n] = new K(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Ue = /[\-:]([a-z])/g;
  function ce(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Ue,
      ce
    );
    Ee[r] = new K(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Ue, ce);
    Ee[r] = new K(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Ue, ce);
    Ee[r] = new K(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    Ee[n] = new K(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), Ee.xlinkHref = new K("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    Ee[n] = new K(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function ge(n, r, l, o) {
    var c = Ee.hasOwnProperty(r) ? Ee[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ne(r, l, c, o) && (l = null), o || c === null ? ee(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var Le = T.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, he = Symbol.for("react.element"), Se = Symbol.for("react.portal"), P = Symbol.for("react.fragment"), de = Symbol.for("react.strict_mode"), ie = Symbol.for("react.profiler"), Te = Symbol.for("react.provider"), He = Symbol.for("react.context"), tt = Symbol.for("react.forward_ref"), Ce = Symbol.for("react.suspense"), kt = Symbol.for("react.suspense_list"), Ct = Symbol.for("react.memo"), Dt = Symbol.for("react.lazy"), Ve = Symbol.for("react.offscreen"), me = Symbol.iterator;
  function Qe(n) {
    return n === null || typeof n != "object" ? null : (n = me && n[me] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var we = Object.assign, N;
  function q(n) {
    if (N === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      N = r && r[1] || "";
    }
    return `
` + N + n;
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
        } catch (V) {
          var o = V;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (V) {
          o = V;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (V) {
          o = V;
        }
        n();
      }
    } catch (V) {
      if (V && o && typeof V.stack == "string") {
        for (var c = V.stack.split(`
`), d = o.stack.split(`
`), m = c.length - 1, C = d.length - 1; 1 <= m && 0 <= C && c[m] !== d[C]; ) C--;
        for (; 1 <= m && 0 <= C; m--, C--) if (c[m] !== d[C]) {
          if (m !== 1 || C !== 1)
            do
              if (m--, C--, 0 > C || c[m] !== d[C]) {
                var _ = `
` + c[m].replace(" at new ", " at ");
                return n.displayName && _.includes("<anonymous>") && (_ = _.replace("<anonymous>", n.displayName)), _;
              }
            while (1 <= m && 0 <= C);
          break;
        }
      }
    } finally {
      nt = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? q(n) : "";
  }
  function be(n) {
    switch (n.tag) {
      case 5:
        return q(n.type);
      case 16:
        return q("Lazy");
      case 13:
        return q("Suspense");
      case 19:
        return q("SuspenseList");
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
  function We(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case P:
        return "Fragment";
      case Se:
        return "Portal";
      case ie:
        return "Profiler";
      case de:
        return "StrictMode";
      case Ce:
        return "Suspense";
      case kt:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case He:
        return (n.displayName || "Context") + ".Consumer";
      case Te:
        return (n._context.displayName || "Context") + ".Provider";
      case tt:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case Ct:
        return r = n.displayName || null, r !== null ? r : We(n.type) || "Memo";
      case Dt:
        r = n._payload, n = n._init;
        try {
          return We(n(r));
        } catch {
        }
    }
    return null;
  }
  function fe(n) {
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
        return We(r);
      case 8:
        return r === de ? "StrictMode" : "Mode";
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
  function Fe(n) {
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
  function rt(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function dt(n) {
    var r = rt(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
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
  function $t(n) {
    n._valueTracker || (n._valueTracker = dt(n));
  }
  function yn(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), o = "";
    return n && (o = rt(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function cn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function bn(n, r) {
    var l = r.checked;
    return we({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Tn(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = Fe(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function $n(n, r) {
    r = r.checked, r != null && ge(n, "checked", r, !1);
  }
  function $r(n, r) {
    $n(n, r);
    var l = Fe(r.value), o = r.type;
    if (l != null) o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? sa(n, r.type, l) : r.hasOwnProperty("defaultValue") && sa(n, r.type, Fe(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
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
    (r !== "number" || cn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var Jn = Array.isArray;
  function _n(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + Fe(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Qn(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(x(91));
    return we({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Er(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(x(92));
        if (Jn(l)) {
          if (1 < l.length) throw Error(x(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: Fe(l) };
  }
  function $a(n, r) {
    var l = Fe(r.value), o = Fe(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function An(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Cr(n) {
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
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Cr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
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
  function xe(n, r) {
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
  }, wt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(qe).forEach(function(n) {
    wt.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), qe[r] = qe[n];
    });
  });
  function Qt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || qe.hasOwnProperty(n) && qe[n] ? ("" + r).trim() : r + "px";
  }
  function an(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var o = l.indexOf("--") === 0, c = Qt(l, r[l], o);
      l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var gn = we({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function fn(n, r) {
    if (r) {
      if (gn[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(x(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(x(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(x(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(x(62));
    }
  }
  function Zn(n, r) {
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
  var ln = null;
  function qt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var Kt = null, fa = null, wr = null;
  function ba(n) {
    if (n = Je(n)) {
      if (typeof Kt != "function") throw Error(x(280));
      var r = n.stateNode;
      r && (r = En(r), Kt(n.stateNode, n.type, r));
    }
  }
  function Pi(n) {
    fa ? wr ? wr.push(n) : wr = [n] : fa = n;
  }
  function Zl() {
    if (fa) {
      var n = fa, r = wr;
      if (wr = fa = null, ba(n), r) for (n = 0; n < r.length; n++) ba(r[n]);
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
      vl = !1, (fa !== null || wr !== null) && (pl(), Zl());
    }
  }
  function _r(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var o = En(l);
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
  if (re) try {
    var ir = {};
    Object.defineProperty(ir, "passive", { get: function() {
      kr = !0;
    } }), window.addEventListener("test", ir, ir), window.removeEventListener("test", ir, ir);
  } catch {
    kr = !1;
  }
  function di(n, r, l, o, c, d, m, C, _) {
    var V = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, V);
    } catch (oe) {
      this.onError(oe);
    }
  }
  var Wa = !1, pi = null, vi = !1, R = null, ae = { onError: function(n) {
    Wa = !0, pi = n;
  } };
  function De(n, r, l, o, c, d, m, C, _) {
    Wa = !1, pi = null, di.apply(ae, arguments);
  }
  function Be(n, r, l, o, c, d, m, C, _) {
    if (De.apply(this, arguments), Wa) {
      if (Wa) {
        var V = pi;
        Wa = !1, pi = null;
      } else throw Error(x(198));
      vi || (vi = !0, R = V);
    }
  }
  function yt(n) {
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
  function vt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Tt(n) {
    if (yt(n) !== n) throw Error(x(188));
  }
  function bt(n) {
    var r = n.alternate;
    if (!r) {
      if (r = yt(n), r === null) throw Error(x(188));
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
          if (d === l) return Tt(c), n;
          if (d === o) return Tt(c), r;
          d = d.sibling;
        }
        throw Error(x(188));
      }
      if (l.return !== o.return) l = c, o = d;
      else {
        for (var m = !1, C = c.child; C; ) {
          if (C === l) {
            m = !0, l = c, o = d;
            break;
          }
          if (C === o) {
            m = !0, o = c, l = d;
            break;
          }
          C = C.sibling;
        }
        if (!m) {
          for (C = d.child; C; ) {
            if (C === l) {
              m = !0, l = d, o = c;
              break;
            }
            if (C === o) {
              m = !0, o = d, l = c;
              break;
            }
            C = C.sibling;
          }
          if (!m) throw Error(x(189));
        }
      }
      if (l.alternate !== o) throw Error(x(190));
    }
    if (l.tag !== 3) throw Error(x(188));
    return l.stateNode.current === l ? n : r;
  }
  function kn(n) {
    return n = bt(n), n !== null ? un(n) : null;
  }
  function un(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = un(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var dn = w.unstable_scheduleCallback, lr = w.unstable_cancelCallback, Ga = w.unstable_shouldYield, qa = w.unstable_requestPaint, gt = w.unstable_now, Et = w.unstable_getCurrentPriorityLevel, Ka = w.unstable_ImmediatePriority, nu = w.unstable_UserBlockingPriority, ru = w.unstable_NormalPriority, hl = w.unstable_LowPriority, Gu = w.unstable_IdlePriority, ml = null, Qr = null;
  function Qo(n) {
    if (Qr && typeof Qr.onCommitFiberRoot == "function") try {
      Qr.onCommitFiberRoot(ml, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Dr = Math.clz32 ? Math.clz32 : qu, uc = Math.log, oc = Math.LN2;
  function qu(n) {
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
      var C = m & ~c;
      C !== 0 ? o = Xa(C) : (d &= m, d !== 0 && (o = Xa(d)));
    } else m = l & ~c, m !== 0 ? o = Xa(m) : d !== 0 && (o = Xa(d));
    if (o === 0) return 0;
    if (r !== 0 && r !== o && !(r & c) && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if (o & 4 && (o |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= o; 0 < r; ) l = 31 - Dr(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function Ku(n, r) {
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
      var m = 31 - Dr(d), C = 1 << m, _ = c[m];
      _ === -1 ? (!(C & l) || C & o) && (c[m] = Ku(C, r)) : _ <= r && (n.expiredLanes |= C), d &= ~C;
    }
  }
  function gl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Xu() {
    var n = yl;
    return yl <<= 1, !(yl & 4194240) && (yl = 64), n;
  }
  function Ju(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Hi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Dr(r), n[r] = l;
  }
  function qf(n, r) {
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
  var Pt = 0;
  function Zu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var zt, Wo, hi, pt, eo, ur = !1, mi = [], Or = null, yi = null, pn = null, Xt = /* @__PURE__ */ new Map(), Sl = /* @__PURE__ */ new Map(), Wn = [], Nr = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ra(n, r) {
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
        pn = null;
        break;
      case "pointerover":
      case "pointerout":
        Xt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Sl.delete(r.pointerId);
    }
  }
  function iu(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = Je(r), r !== null && Wo(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function Go(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return Or = iu(Or, n, r, l, o, c), !0;
      case "dragenter":
        return yi = iu(yi, n, r, l, o, c), !0;
      case "mouseover":
        return pn = iu(pn, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return Xt.set(d, iu(Xt.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, Sl.set(d, iu(Sl.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function qo(n) {
    var r = vu(n.target);
    if (r !== null) {
      var l = yt(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = vt(l), r !== null) {
            n.blockedOn = r, eo(n.priority, function() {
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
      var l = ro(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        ln = o, l.target.dispatchEvent(o), ln = null;
      } else return r = Je(l), r !== null && Wo(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function lu(n, r, l) {
    El(n) && l.delete(r);
  }
  function Kf() {
    ur = !1, Or !== null && El(Or) && (Or = null), yi !== null && El(yi) && (yi = null), pn !== null && El(pn) && (pn = null), Xt.forEach(lu), Sl.forEach(lu);
  }
  function Ta(n, r) {
    n.blockedOn === r && (n.blockedOn = null, ur || (ur = !0, w.unstable_scheduleCallback(w.unstable_NormalPriority, Kf)));
  }
  function Za(n) {
    function r(c) {
      return Ta(c, n);
    }
    if (0 < mi.length) {
      Ta(mi[0], n);
      for (var l = 1; l < mi.length; l++) {
        var o = mi[l];
        o.blockedOn === n && (o.blockedOn = null);
      }
    }
    for (Or !== null && Ta(Or, n), yi !== null && Ta(yi, n), pn !== null && Ta(pn, n), Xt.forEach(r), Sl.forEach(r), l = 0; l < Wn.length; l++) o = Wn[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < Wn.length && (l = Wn[0], l.blockedOn === null); ) qo(l), l.blockedOn === null && Wn.shift();
  }
  var gi = Le.ReactCurrentBatchConfig, _a = !0;
  function to(n, r, l, o) {
    var c = Pt, d = gi.transition;
    gi.transition = null;
    try {
      Pt = 1, Cl(n, r, l, o);
    } finally {
      Pt = c, gi.transition = d;
    }
  }
  function no(n, r, l, o) {
    var c = Pt, d = gi.transition;
    gi.transition = null;
    try {
      Pt = 4, Cl(n, r, l, o);
    } finally {
      Pt = c, gi.transition = d;
    }
  }
  function Cl(n, r, l, o) {
    if (_a) {
      var c = ro(n, r, l, o);
      if (c === null) Ec(n, r, o, uu, l), Ra(n, o);
      else if (Go(c, n, r, l, o)) o.stopPropagation();
      else if (Ra(n, o), r & 4 && -1 < Nr.indexOf(n)) {
        for (; c !== null; ) {
          var d = Je(c);
          if (d !== null && zt(d), d = ro(n, r, l, o), d === null && Ec(n, r, o, uu, l), d === c) break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else Ec(n, r, o, null, l);
    }
  }
  var uu = null;
  function ro(n, r, l, o) {
    if (uu = null, n = qt(o), n = vu(n), n !== null) if (r = yt(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = vt(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return uu = n, null;
  }
  function ao(n) {
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
        switch (Et()) {
          case Ka:
            return 1;
          case nu:
            return 4;
          case ru:
          case hl:
            return 16;
          case Gu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ei = null, h = null, b = null;
  function H() {
    if (b) return b;
    var n, r = h, l = r.length, o, c = "value" in ei ? ei.value : ei.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++) ;
    return b = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function $(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function ye() {
    return !0;
  }
  function at() {
    return !1;
  }
  function ke(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var C in n) n.hasOwnProperty(C) && (l = n[C], this[C] = l ? l(d) : d[C]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? ye : at, this.isPropagationStopped = at, this;
    }
    return we(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = ye);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = ye);
    }, persist: function() {
    }, isPersistent: ye }), r;
  }
  var ut = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, _t = ke(ut), Ut = we({}, ut, { view: 0, detail: 0 }), on = ke(Ut), Jt, xt, Zt, Sn = we({}, Ut, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: td, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Zt && (Zt && n.type === "mousemove" ? (Jt = n.screenX - Zt.screenX, xt = n.screenY - Zt.screenY) : xt = Jt = 0, Zt = n), Jt);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : xt;
  } }), wl = ke(Sn), Ko = we({}, Sn, { dataTransfer: 0 }), Bi = ke(Ko), Xo = we({}, Ut, { relatedTarget: 0 }), ou = ke(Xo), Xf = we({}, ut, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), sc = ke(Xf), Jf = we({}, ut, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), av = ke(Jf), Zf = we({}, ut, { data: 0 }), ed = ke(Zf), iv = {
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
  }, lv = {
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
  }, ty = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ii(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ty[n]) ? !!r[n] : !1;
  }
  function td() {
    return Ii;
  }
  var nd = we({}, Ut, { key: function(n) {
    if (n.key) {
      var r = iv[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = $(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? lv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: td, charCode: function(n) {
    return n.type === "keypress" ? $(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? $(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), rd = ke(nd), ad = we({}, Sn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), uv = ke(ad), cc = we({}, Ut, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: td }), ov = ke(cc), Wr = we({}, ut, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yi = ke(Wr), zn = we({}, Sn, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), $i = ke(zn), id = [9, 13, 27, 32], io = re && "CompositionEvent" in window, Jo = null;
  re && "documentMode" in document && (Jo = document.documentMode);
  var Zo = re && "TextEvent" in window && !Jo, sv = re && (!io || Jo && 8 < Jo && 11 >= Jo), cv = " ", fc = !1;
  function fv(n, r) {
    switch (n) {
      case "keyup":
        return id.indexOf(r.keyCode) !== -1;
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
  function dv(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var lo = !1;
  function pv(n, r) {
    switch (n) {
      case "compositionend":
        return dv(r);
      case "keypress":
        return r.which !== 32 ? null : (fc = !0, cv);
      case "textInput":
        return n = r.data, n === cv && fc ? null : n;
      default:
        return null;
    }
  }
  function ny(n, r) {
    if (lo) return n === "compositionend" || !io && fv(n, r) ? (n = H(), b = h = ei = null, lo = !1, n) : null;
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
        return sv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var ry = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function vv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!ry[n.type] : r === "textarea";
  }
  function ld(n, r, l, o) {
    Pi(o), r = is(r, "onChange"), 0 < r.length && (l = new _t("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var Si = null, su = null;
  function hv(n) {
    du(n, 0);
  }
  function es(n) {
    var r = ni(n);
    if (yn(r)) return n;
  }
  function ay(n, r) {
    if (n === "change") return r;
  }
  var mv = !1;
  if (re) {
    var ud;
    if (re) {
      var od = "oninput" in document;
      if (!od) {
        var yv = document.createElement("div");
        yv.setAttribute("oninput", "return;"), od = typeof yv.oninput == "function";
      }
      ud = od;
    } else ud = !1;
    mv = ud && (!document.documentMode || 9 < document.documentMode);
  }
  function gv() {
    Si && (Si.detachEvent("onpropertychange", Sv), su = Si = null);
  }
  function Sv(n) {
    if (n.propertyName === "value" && es(su)) {
      var r = [];
      ld(r, su, n, qt(n)), tu(hv, r);
    }
  }
  function iy(n, r, l) {
    n === "focusin" ? (gv(), Si = r, su = l, Si.attachEvent("onpropertychange", Sv)) : n === "focusout" && gv();
  }
  function Ev(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return es(su);
  }
  function ly(n, r) {
    if (n === "click") return es(r);
  }
  function Cv(n, r) {
    if (n === "input" || n === "change") return es(r);
  }
  function uy(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ti = typeof Object.is == "function" ? Object.is : uy;
  function ts(n, r) {
    if (ti(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length) return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!U.call(r, c) || !ti(n[c], r[c])) return !1;
    }
    return !0;
  }
  function wv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function dc(n, r) {
    var l = wv(n);
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
      l = wv(l);
    }
  }
  function xl(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? xl(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function ns() {
    for (var n = window, r = cn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = cn(n.document);
    }
    return r;
  }
  function pc(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function uo(n) {
    var r = ns(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && xl(l.ownerDocument.documentElement, l)) {
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
  var oy = re && "documentMode" in document && 11 >= document.documentMode, oo = null, sd = null, rs = null, cd = !1;
  function fd(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    cd || oo == null || oo !== cn(o) || (o = oo, "selectionStart" in o && pc(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), rs && ts(rs, o) || (rs = o, o = is(sd, "onSelect"), 0 < o.length && (r = new _t("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = oo)));
  }
  function vc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var cu = { animationend: vc("Animation", "AnimationEnd"), animationiteration: vc("Animation", "AnimationIteration"), animationstart: vc("Animation", "AnimationStart"), transitionend: vc("Transition", "TransitionEnd") }, or = {}, dd = {};
  re && (dd = document.createElement("div").style, "AnimationEvent" in window || (delete cu.animationend.animation, delete cu.animationiteration.animation, delete cu.animationstart.animation), "TransitionEvent" in window || delete cu.transitionend.transition);
  function hc(n) {
    if (or[n]) return or[n];
    if (!cu[n]) return n;
    var r = cu[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in dd) return or[n] = r[l];
    return n;
  }
  var xv = hc("animationend"), bv = hc("animationiteration"), Rv = hc("animationstart"), Tv = hc("transitionend"), pd = /* @__PURE__ */ new Map(), mc = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ka(n, r) {
    pd.set(n, r), A(r, [n]);
  }
  for (var vd = 0; vd < mc.length; vd++) {
    var fu = mc[vd], sy = fu.toLowerCase(), cy = fu[0].toUpperCase() + fu.slice(1);
    ka(sy, "on" + cy);
  }
  ka(xv, "onAnimationEnd"), ka(bv, "onAnimationIteration"), ka(Rv, "onAnimationStart"), ka("dblclick", "onDoubleClick"), ka("focusin", "onFocus"), ka("focusout", "onBlur"), ka(Tv, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), A("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), A("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), A("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), A("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), A("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), A("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var as = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), hd = new Set("cancel close invalid load scroll toggle".split(" ").concat(as));
  function yc(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, Be(o, r, void 0, n), n.currentTarget = null;
  }
  function du(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r) for (var m = o.length - 1; 0 <= m; m--) {
          var C = o[m], _ = C.instance, V = C.currentTarget;
          if (C = C.listener, _ !== d && c.isPropagationStopped()) break e;
          yc(c, C, V), d = _;
        }
        else for (m = 0; m < o.length; m++) {
          if (C = o[m], _ = C.instance, V = C.currentTarget, C = C.listener, _ !== d && c.isPropagationStopped()) break e;
          yc(c, C, V), d = _;
        }
      }
    }
    if (vi) throw n = R, vi = !1, R = null, n;
  }
  function Wt(n, r) {
    var l = r[os];
    l === void 0 && (l = r[os] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (_v(r, n, 2, !1), l.add(o));
  }
  function gc(n, r, l) {
    var o = 0;
    r && (o |= 4), _v(l, n, o, r);
  }
  var Sc = "_reactListening" + Math.random().toString(36).slice(2);
  function so(n) {
    if (!n[Sc]) {
      n[Sc] = !0, Z.forEach(function(l) {
        l !== "selectionchange" && (hd.has(l) || gc(l, !1, n), gc(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Sc] || (r[Sc] = !0, gc("selectionchange", !1, r));
    }
  }
  function _v(n, r, l, o) {
    switch (ao(r)) {
      case 1:
        var c = to;
        break;
      case 4:
        c = no;
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
        var C = o.stateNode.containerInfo;
        if (C === c || C.nodeType === 8 && C.parentNode === c) break;
        if (m === 4) for (m = o.return; m !== null; ) {
          var _ = m.tag;
          if ((_ === 3 || _ === 4) && (_ = m.stateNode.containerInfo, _ === c || _.nodeType === 8 && _.parentNode === c)) return;
          m = m.return;
        }
        for (; C !== null; ) {
          if (m = vu(C), m === null) return;
          if (_ = m.tag, _ === 5 || _ === 6) {
            o = d = m;
            continue e;
          }
          C = C.parentNode;
        }
      }
      o = o.return;
    }
    tu(function() {
      var V = d, oe = qt(l), pe = [];
      e: {
        var ue = pd.get(n);
        if (ue !== void 0) {
          var je = _t, Ie = n;
          switch (n) {
            case "keypress":
              if ($(l) === 0) break e;
            case "keydown":
            case "keyup":
              je = rd;
              break;
            case "focusin":
              Ie = "focus", je = ou;
              break;
            case "focusout":
              Ie = "blur", je = ou;
              break;
            case "beforeblur":
            case "afterblur":
              je = ou;
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
              je = wl;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              je = Bi;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              je = ov;
              break;
            case xv:
            case bv:
            case Rv:
              je = sc;
              break;
            case Tv:
              je = Yi;
              break;
            case "scroll":
              je = on;
              break;
            case "wheel":
              je = $i;
              break;
            case "copy":
            case "cut":
            case "paste":
              je = av;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              je = uv;
          }
          var Ge = (r & 4) !== 0, Mn = !Ge && n === "scroll", L = Ge ? ue !== null ? ue + "Capture" : null : ue;
          Ge = [];
          for (var D = V, z; D !== null; ) {
            z = D;
            var se = z.stateNode;
            if (z.tag === 5 && se !== null && (z = se, L !== null && (se = _r(D, L), se != null && Ge.push(co(D, se, z)))), Mn) break;
            D = D.return;
          }
          0 < Ge.length && (ue = new je(ue, Ie, null, l, oe), pe.push({ event: ue, listeners: Ge }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (ue = n === "mouseover" || n === "pointerover", je = n === "mouseout" || n === "pointerout", ue && l !== ln && (Ie = l.relatedTarget || l.fromElement) && (vu(Ie) || Ie[Qi])) break e;
          if ((je || ue) && (ue = oe.window === oe ? oe : (ue = oe.ownerDocument) ? ue.defaultView || ue.parentWindow : window, je ? (Ie = l.relatedTarget || l.toElement, je = V, Ie = Ie ? vu(Ie) : null, Ie !== null && (Mn = yt(Ie), Ie !== Mn || Ie.tag !== 5 && Ie.tag !== 6) && (Ie = null)) : (je = null, Ie = V), je !== Ie)) {
            if (Ge = wl, se = "onMouseLeave", L = "onMouseEnter", D = "mouse", (n === "pointerout" || n === "pointerover") && (Ge = uv, se = "onPointerLeave", L = "onPointerEnter", D = "pointer"), Mn = je == null ? ue : ni(je), z = Ie == null ? ue : ni(Ie), ue = new Ge(se, D + "leave", je, l, oe), ue.target = Mn, ue.relatedTarget = z, se = null, vu(oe) === V && (Ge = new Ge(L, D + "enter", Ie, l, oe), Ge.target = z, Ge.relatedTarget = Mn, se = Ge), Mn = se, je && Ie) t: {
              for (Ge = je, L = Ie, D = 0, z = Ge; z; z = bl(z)) D++;
              for (z = 0, se = L; se; se = bl(se)) z++;
              for (; 0 < D - z; ) Ge = bl(Ge), D--;
              for (; 0 < z - D; ) L = bl(L), z--;
              for (; D--; ) {
                if (Ge === L || L !== null && Ge === L.alternate) break t;
                Ge = bl(Ge), L = bl(L);
              }
              Ge = null;
            }
            else Ge = null;
            je !== null && kv(pe, ue, je, Ge, !1), Ie !== null && Mn !== null && kv(pe, Mn, Ie, Ge, !0);
          }
        }
        e: {
          if (ue = V ? ni(V) : window, je = ue.nodeName && ue.nodeName.toLowerCase(), je === "select" || je === "input" && ue.type === "file") var Ye = ay;
          else if (vv(ue)) if (mv) Ye = Cv;
          else {
            Ye = Ev;
            var lt = iy;
          }
          else (je = ue.nodeName) && je.toLowerCase() === "input" && (ue.type === "checkbox" || ue.type === "radio") && (Ye = ly);
          if (Ye && (Ye = Ye(n, V))) {
            ld(pe, Ye, l, oe);
            break e;
          }
          lt && lt(n, ue, V), n === "focusout" && (lt = ue._wrapperState) && lt.controlled && ue.type === "number" && sa(ue, "number", ue.value);
        }
        switch (lt = V ? ni(V) : window, n) {
          case "focusin":
            (vv(lt) || lt.contentEditable === "true") && (oo = lt, sd = V, rs = null);
            break;
          case "focusout":
            rs = sd = oo = null;
            break;
          case "mousedown":
            cd = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            cd = !1, fd(pe, l, oe);
            break;
          case "selectionchange":
            if (oy) break;
          case "keydown":
          case "keyup":
            fd(pe, l, oe);
        }
        var ot;
        if (io) e: {
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
        else lo ? fv(n, l) && (ft = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (ft = "onCompositionStart");
        ft && (sv && l.locale !== "ko" && (lo || ft !== "onCompositionStart" ? ft === "onCompositionEnd" && lo && (ot = H()) : (ei = oe, h = "value" in ei ? ei.value : ei.textContent, lo = !0)), lt = is(V, ft), 0 < lt.length && (ft = new ed(ft, n, null, l, oe), pe.push({ event: ft, listeners: lt }), ot ? ft.data = ot : (ot = dv(l), ot !== null && (ft.data = ot)))), (ot = Zo ? pv(n, l) : ny(n, l)) && (V = is(V, "onBeforeInput"), 0 < V.length && (oe = new ed("onBeforeInput", "beforeinput", null, l, oe), pe.push({ event: oe, listeners: V }), oe.data = ot));
      }
      du(pe, r);
    });
  }
  function co(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function is(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = _r(n, l), d != null && o.unshift(co(n, d, c)), d = _r(n, r), d != null && o.push(co(n, d, c))), n = n.return;
    }
    return o;
  }
  function bl(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function kv(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var C = l, _ = C.alternate, V = C.stateNode;
      if (_ !== null && _ === o) break;
      C.tag === 5 && V !== null && (C = V, c ? (_ = _r(l, d), _ != null && m.unshift(co(l, _, C))) : c || (_ = _r(l, d), _ != null && m.push(co(l, _, C)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var Dv = /\r\n?/g, fy = /\u0000|\uFFFD/g;
  function Ov(n) {
    return (typeof n == "string" ? n : "" + n).replace(Dv, `
`).replace(fy, "");
  }
  function Cc(n, r, l) {
    if (r = Ov(r), Ov(n) !== r && l) throw Error(x(425));
  }
  function Rl() {
  }
  var ls = null, pu = null;
  function wc(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var xc = typeof setTimeout == "function" ? setTimeout : void 0, md = typeof clearTimeout == "function" ? clearTimeout : void 0, Nv = typeof Promise == "function" ? Promise : void 0, fo = typeof queueMicrotask == "function" ? queueMicrotask : typeof Nv < "u" ? function(n) {
    return Nv.resolve(null).then(n).catch(bc);
  } : xc;
  function bc(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function po(n, r) {
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
  function Lv(n) {
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
  var Tl = Math.random().toString(36).slice(2), Ci = "__reactFiber$" + Tl, us = "__reactProps$" + Tl, Qi = "__reactContainer$" + Tl, os = "__reactEvents$" + Tl, vo = "__reactListeners$" + Tl, dy = "__reactHandles$" + Tl;
  function vu(n) {
    var r = n[Ci];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Qi] || l[Ci]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = Lv(n); n !== null; ) {
          if (l = n[Ci]) return l;
          n = Lv(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function Je(n) {
    return n = n[Ci] || n[Qi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ni(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(x(33));
  }
  function En(n) {
    return n[us] || null;
  }
  var Lt = [], Da = -1;
  function Oa(n) {
    return { current: n };
  }
  function sn(n) {
    0 > Da || (n.current = Lt[Da], Lt[Da] = null, Da--);
  }
  function Xe(n, r) {
    Da++, Lt[Da] = n.current, n.current = r;
  }
  var xr = {}, Rn = Oa(xr), Gn = Oa(!1), Gr = xr;
  function qr(n, r) {
    var l = n.type.contextTypes;
    if (!l) return xr;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r) return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function Un(n) {
    return n = n.childContextTypes, n != null;
  }
  function ho() {
    sn(Gn), sn(Rn);
  }
  function Mv(n, r, l) {
    if (Rn.current !== xr) throw Error(x(168));
    Xe(Rn, r), Xe(Gn, l);
  }
  function ss(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function") return l;
    o = o.getChildContext();
    for (var c in o) if (!(c in r)) throw Error(x(108, fe(n) || "Unknown", c));
    return we({}, l, o);
  }
  function er(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || xr, Gr = Rn.current, Xe(Rn, n), Xe(Gn, Gn.current), !0;
  }
  function Rc(n, r, l) {
    var o = n.stateNode;
    if (!o) throw Error(x(169));
    l ? (n = ss(n, r, Gr), o.__reactInternalMemoizedMergedChildContext = n, sn(Gn), sn(Rn), Xe(Rn, n)) : sn(Gn), Xe(Gn, l);
  }
  var wi = null, mo = !1, Wi = !1;
  function Tc(n) {
    wi === null ? wi = [n] : wi.push(n);
  }
  function _l(n) {
    mo = !0, Tc(n);
  }
  function xi() {
    if (!Wi && wi !== null) {
      Wi = !0;
      var n = 0, r = Pt;
      try {
        var l = wi;
        for (Pt = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        wi = null, mo = !1;
      } catch (c) {
        throw wi !== null && (wi = wi.slice(n + 1)), dn(Ka, xi), c;
      } finally {
        Pt = r, Wi = !1;
      }
    }
    return null;
  }
  var kl = [], Dl = 0, Ol = null, Gi = 0, Fn = [], Na = 0, pa = null, bi = 1, Ri = "";
  function hu(n, r) {
    kl[Dl++] = Gi, kl[Dl++] = Ol, Ol = n, Gi = r;
  }
  function jv(n, r, l) {
    Fn[Na++] = bi, Fn[Na++] = Ri, Fn[Na++] = pa, pa = n;
    var o = bi;
    n = Ri;
    var c = 32 - Dr(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - Dr(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, bi = 1 << 32 - Dr(r) + c | l << c | o, Ri = d + n;
    } else bi = 1 << d | l << c | o, Ri = n;
  }
  function _c(n) {
    n.return !== null && (hu(n, 1), jv(n, 1, 0));
  }
  function kc(n) {
    for (; n === Ol; ) Ol = kl[--Dl], kl[Dl] = null, Gi = kl[--Dl], kl[Dl] = null;
    for (; n === pa; ) pa = Fn[--Na], Fn[Na] = null, Ri = Fn[--Na], Fn[Na] = null, bi = Fn[--Na], Fn[Na] = null;
  }
  var Kr = null, Xr = null, hn = !1, La = null;
  function yd(n, r) {
    var l = Ua(5, null, null, 0);
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
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = pa !== null ? { id: bi, overflow: Ri } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Ua(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Kr = n, Xr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function gd(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Sd(n) {
    if (hn) {
      var r = Xr;
      if (r) {
        var l = r;
        if (!Av(n, r)) {
          if (gd(n)) throw Error(x(418));
          r = Ei(l.nextSibling);
          var o = Kr;
          r && Av(n, r) ? yd(o, l) : (n.flags = n.flags & -4097 | 2, hn = !1, Kr = n);
        }
      } else {
        if (gd(n)) throw Error(x(418));
        n.flags = n.flags & -4097 | 2, hn = !1, Kr = n;
      }
    }
  }
  function qn(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Kr = n;
  }
  function Dc(n) {
    if (n !== Kr) return !1;
    if (!hn) return qn(n), hn = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !wc(n.type, n.memoizedProps)), r && (r = Xr)) {
      if (gd(n)) throw cs(), Error(x(418));
      for (; r; ) yd(n, r), r = Ei(r.nextSibling);
    }
    if (qn(n), n.tag === 13) {
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
  function cs() {
    for (var n = Xr; n; ) n = Ei(n.nextSibling);
  }
  function Nl() {
    Xr = Kr = null, hn = !1;
  }
  function qi(n) {
    La === null ? La = [n] : La.push(n);
  }
  var py = Le.ReactCurrentBatchConfig;
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
          var C = c.refs;
          m === null ? delete C[d] : C[d] = m;
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
    function r(L, D) {
      if (n) {
        var z = L.deletions;
        z === null ? (L.deletions = [D], L.flags |= 16) : z.push(D);
      }
    }
    function l(L, D) {
      if (!n) return null;
      for (; D !== null; ) r(L, D), D = D.sibling;
      return null;
    }
    function o(L, D) {
      for (L = /* @__PURE__ */ new Map(); D !== null; ) D.key !== null ? L.set(D.key, D) : L.set(D.index, D), D = D.sibling;
      return L;
    }
    function c(L, D) {
      return L = Pl(L, D), L.index = 0, L.sibling = null, L;
    }
    function d(L, D, z) {
      return L.index = z, n ? (z = L.alternate, z !== null ? (z = z.index, z < D ? (L.flags |= 2, D) : z) : (L.flags |= 2, D)) : (L.flags |= 1048576, D);
    }
    function m(L) {
      return n && L.alternate === null && (L.flags |= 2), L;
    }
    function C(L, D, z, se) {
      return D === null || D.tag !== 6 ? (D = Kd(z, L.mode, se), D.return = L, D) : (D = c(D, z), D.return = L, D);
    }
    function _(L, D, z, se) {
      var Ye = z.type;
      return Ye === P ? oe(L, D, z.props.children, se, z.key) : D !== null && (D.elementType === Ye || typeof Ye == "object" && Ye !== null && Ye.$$typeof === Dt && zv(Ye) === D.type) ? (se = c(D, z.props), se.ref = mu(L, D, z), se.return = L, se) : (se = Hs(z.type, z.key, z.props, null, L.mode, se), se.ref = mu(L, D, z), se.return = L, se);
    }
    function V(L, D, z, se) {
      return D === null || D.tag !== 4 || D.stateNode.containerInfo !== z.containerInfo || D.stateNode.implementation !== z.implementation ? (D = cf(z, L.mode, se), D.return = L, D) : (D = c(D, z.children || []), D.return = L, D);
    }
    function oe(L, D, z, se, Ye) {
      return D === null || D.tag !== 7 ? (D = tl(z, L.mode, se, Ye), D.return = L, D) : (D = c(D, z), D.return = L, D);
    }
    function pe(L, D, z) {
      if (typeof D == "string" && D !== "" || typeof D == "number") return D = Kd("" + D, L.mode, z), D.return = L, D;
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case he:
            return z = Hs(D.type, D.key, D.props, null, L.mode, z), z.ref = mu(L, null, D), z.return = L, z;
          case Se:
            return D = cf(D, L.mode, z), D.return = L, D;
          case Dt:
            var se = D._init;
            return pe(L, se(D._payload), z);
        }
        if (Jn(D) || Qe(D)) return D = tl(D, L.mode, z, null), D.return = L, D;
        Oc(L, D);
      }
      return null;
    }
    function ue(L, D, z, se) {
      var Ye = D !== null ? D.key : null;
      if (typeof z == "string" && z !== "" || typeof z == "number") return Ye !== null ? null : C(L, D, "" + z, se);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case he:
            return z.key === Ye ? _(L, D, z, se) : null;
          case Se:
            return z.key === Ye ? V(L, D, z, se) : null;
          case Dt:
            return Ye = z._init, ue(
              L,
              D,
              Ye(z._payload),
              se
            );
        }
        if (Jn(z) || Qe(z)) return Ye !== null ? null : oe(L, D, z, se, null);
        Oc(L, z);
      }
      return null;
    }
    function je(L, D, z, se, Ye) {
      if (typeof se == "string" && se !== "" || typeof se == "number") return L = L.get(z) || null, C(D, L, "" + se, Ye);
      if (typeof se == "object" && se !== null) {
        switch (se.$$typeof) {
          case he:
            return L = L.get(se.key === null ? z : se.key) || null, _(D, L, se, Ye);
          case Se:
            return L = L.get(se.key === null ? z : se.key) || null, V(D, L, se, Ye);
          case Dt:
            var lt = se._init;
            return je(L, D, z, lt(se._payload), Ye);
        }
        if (Jn(se) || Qe(se)) return L = L.get(z) || null, oe(D, L, se, Ye, null);
        Oc(D, se);
      }
      return null;
    }
    function Ie(L, D, z, se) {
      for (var Ye = null, lt = null, ot = D, ft = D = 0, rr = null; ot !== null && ft < z.length; ft++) {
        ot.index > ft ? (rr = ot, ot = null) : rr = ot.sibling;
        var Bt = ue(L, ot, z[ft], se);
        if (Bt === null) {
          ot === null && (ot = rr);
          break;
        }
        n && ot && Bt.alternate === null && r(L, ot), D = d(Bt, D, ft), lt === null ? Ye = Bt : lt.sibling = Bt, lt = Bt, ot = rr;
      }
      if (ft === z.length) return l(L, ot), hn && hu(L, ft), Ye;
      if (ot === null) {
        for (; ft < z.length; ft++) ot = pe(L, z[ft], se), ot !== null && (D = d(ot, D, ft), lt === null ? Ye = ot : lt.sibling = ot, lt = ot);
        return hn && hu(L, ft), Ye;
      }
      for (ot = o(L, ot); ft < z.length; ft++) rr = je(ot, L, ft, z[ft], se), rr !== null && (n && rr.alternate !== null && ot.delete(rr.key === null ? ft : rr.key), D = d(rr, D, ft), lt === null ? Ye = rr : lt.sibling = rr, lt = rr);
      return n && ot.forEach(function(Bl) {
        return r(L, Bl);
      }), hn && hu(L, ft), Ye;
    }
    function Ge(L, D, z, se) {
      var Ye = Qe(z);
      if (typeof Ye != "function") throw Error(x(150));
      if (z = Ye.call(z), z == null) throw Error(x(151));
      for (var lt = Ye = null, ot = D, ft = D = 0, rr = null, Bt = z.next(); ot !== null && !Bt.done; ft++, Bt = z.next()) {
        ot.index > ft ? (rr = ot, ot = null) : rr = ot.sibling;
        var Bl = ue(L, ot, Bt.value, se);
        if (Bl === null) {
          ot === null && (ot = rr);
          break;
        }
        n && ot && Bl.alternate === null && r(L, ot), D = d(Bl, D, ft), lt === null ? Ye = Bl : lt.sibling = Bl, lt = Bl, ot = rr;
      }
      if (Bt.done) return l(
        L,
        ot
      ), hn && hu(L, ft), Ye;
      if (ot === null) {
        for (; !Bt.done; ft++, Bt = z.next()) Bt = pe(L, Bt.value, se), Bt !== null && (D = d(Bt, D, ft), lt === null ? Ye = Bt : lt.sibling = Bt, lt = Bt);
        return hn && hu(L, ft), Ye;
      }
      for (ot = o(L, ot); !Bt.done; ft++, Bt = z.next()) Bt = je(ot, L, ft, Bt.value, se), Bt !== null && (n && Bt.alternate !== null && ot.delete(Bt.key === null ? ft : Bt.key), D = d(Bt, D, ft), lt === null ? Ye = Bt : lt.sibling = Bt, lt = Bt);
      return n && ot.forEach(function(gh) {
        return r(L, gh);
      }), hn && hu(L, ft), Ye;
    }
    function Mn(L, D, z, se) {
      if (typeof z == "object" && z !== null && z.type === P && z.key === null && (z = z.props.children), typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case he:
            e: {
              for (var Ye = z.key, lt = D; lt !== null; ) {
                if (lt.key === Ye) {
                  if (Ye = z.type, Ye === P) {
                    if (lt.tag === 7) {
                      l(L, lt.sibling), D = c(lt, z.props.children), D.return = L, L = D;
                      break e;
                    }
                  } else if (lt.elementType === Ye || typeof Ye == "object" && Ye !== null && Ye.$$typeof === Dt && zv(Ye) === lt.type) {
                    l(L, lt.sibling), D = c(lt, z.props), D.ref = mu(L, lt, z), D.return = L, L = D;
                    break e;
                  }
                  l(L, lt);
                  break;
                } else r(L, lt);
                lt = lt.sibling;
              }
              z.type === P ? (D = tl(z.props.children, L.mode, se, z.key), D.return = L, L = D) : (se = Hs(z.type, z.key, z.props, null, L.mode, se), se.ref = mu(L, D, z), se.return = L, L = se);
            }
            return m(L);
          case Se:
            e: {
              for (lt = z.key; D !== null; ) {
                if (D.key === lt) if (D.tag === 4 && D.stateNode.containerInfo === z.containerInfo && D.stateNode.implementation === z.implementation) {
                  l(L, D.sibling), D = c(D, z.children || []), D.return = L, L = D;
                  break e;
                } else {
                  l(L, D);
                  break;
                }
                else r(L, D);
                D = D.sibling;
              }
              D = cf(z, L.mode, se), D.return = L, L = D;
            }
            return m(L);
          case Dt:
            return lt = z._init, Mn(L, D, lt(z._payload), se);
        }
        if (Jn(z)) return Ie(L, D, z, se);
        if (Qe(z)) return Ge(L, D, z, se);
        Oc(L, z);
      }
      return typeof z == "string" && z !== "" || typeof z == "number" ? (z = "" + z, D !== null && D.tag === 6 ? (l(L, D.sibling), D = c(D, z), D.return = L, L = D) : (l(L, D), D = Kd(z, L.mode, se), D.return = L, L = D), m(L)) : l(L, D);
    }
    return Mn;
  }
  var Dn = yu(!0), Oe = yu(!1), va = Oa(null), Jr = null, yo = null, Ed = null;
  function Cd() {
    Ed = yo = Jr = null;
  }
  function wd(n) {
    var r = va.current;
    sn(va), n._currentValue = r;
  }
  function xd(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function Cn(n, r) {
    Jr = n, Ed = yo = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Hn = !0), n.firstContext = null);
  }
  function Ma(n) {
    var r = n._currentValue;
    if (Ed !== n) if (n = { context: n, memoizedValue: r, next: null }, yo === null) {
      if (Jr === null) throw Error(x(308));
      yo = n, Jr.dependencies = { lanes: 0, firstContext: n };
    } else yo = yo.next = n;
    return r;
  }
  var gu = null;
  function bd(n) {
    gu === null ? gu = [n] : gu.push(n);
  }
  function Rd(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, bd(r)) : (l.next = c.next, c.next = l), r.interleaved = l, ha(n, o);
  }
  function ha(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var ma = !1;
  function Td(n) {
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
    if (o = o.shared, Mt & 2) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, ha(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, bd(o)) : (r.next = c.next, c.next = r), o.interleaved = r, ha(n, l);
  }
  function Nc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  function Fv(n, r) {
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
  function fs(n, r, l, o) {
    var c = n.updateQueue;
    ma = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, C = c.shared.pending;
    if (C !== null) {
      c.shared.pending = null;
      var _ = C, V = _.next;
      _.next = null, m === null ? d = V : m.next = V, m = _;
      var oe = n.alternate;
      oe !== null && (oe = oe.updateQueue, C = oe.lastBaseUpdate, C !== m && (C === null ? oe.firstBaseUpdate = V : C.next = V, oe.lastBaseUpdate = _));
    }
    if (d !== null) {
      var pe = c.baseState;
      m = 0, oe = V = _ = null, C = d;
      do {
        var ue = C.lane, je = C.eventTime;
        if ((o & ue) === ue) {
          oe !== null && (oe = oe.next = {
            eventTime: je,
            lane: 0,
            tag: C.tag,
            payload: C.payload,
            callback: C.callback,
            next: null
          });
          e: {
            var Ie = n, Ge = C;
            switch (ue = r, je = l, Ge.tag) {
              case 1:
                if (Ie = Ge.payload, typeof Ie == "function") {
                  pe = Ie.call(je, pe, ue);
                  break e;
                }
                pe = Ie;
                break e;
              case 3:
                Ie.flags = Ie.flags & -65537 | 128;
              case 0:
                if (Ie = Ge.payload, ue = typeof Ie == "function" ? Ie.call(je, pe, ue) : Ie, ue == null) break e;
                pe = we({}, pe, ue);
                break e;
              case 2:
                ma = !0;
            }
          }
          C.callback !== null && C.lane !== 0 && (n.flags |= 64, ue = c.effects, ue === null ? c.effects = [C] : ue.push(C));
        } else je = { eventTime: je, lane: ue, tag: C.tag, payload: C.payload, callback: C.callback, next: null }, oe === null ? (V = oe = je, _ = pe) : oe = oe.next = je, m |= ue;
        if (C = C.next, C === null) {
          if (C = c.shared.pending, C === null) break;
          ue = C, C = ue.next, ue.next = null, c.lastBaseUpdate = ue, c.shared.pending = null;
        }
      } while (!0);
      if (oe === null && (_ = pe), c.baseState = _, c.firstBaseUpdate = V, c.lastBaseUpdate = oe, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      Oi |= m, n.lanes = m, n.memoizedState = pe;
    }
  }
  function _d(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var o = n[r], c = o.callback;
      if (c !== null) {
        if (o.callback = null, o = l, typeof c != "function") throw Error(x(191, c));
        c.call(o);
      }
    }
  }
  var ds = {}, Ti = Oa(ds), ps = Oa(ds), vs = Oa(ds);
  function Su(n) {
    if (n === ds) throw Error(x(174));
    return n;
  }
  function kd(n, r) {
    switch (Xe(vs, r), Xe(ps, n), Xe(Ti, ds), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : ca(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = ca(r, n);
    }
    sn(Ti), Xe(Ti, r);
  }
  function Eu() {
    sn(Ti), sn(ps), sn(vs);
  }
  function Pv(n) {
    Su(vs.current);
    var r = Su(Ti.current), l = ca(r, n.type);
    r !== l && (Xe(ps, n), Xe(Ti, l));
  }
  function Lc(n) {
    ps.current === n && (sn(Ti), sn(ps));
  }
  var wn = Oa(0);
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
  var hs = [];
  function Ze() {
    for (var n = 0; n < hs.length; n++) hs[n]._workInProgressVersionPrimary = null;
    hs.length = 0;
  }
  var Rt = Le.ReactCurrentDispatcher, Ht = Le.ReactCurrentBatchConfig, en = 0, Vt = null, Pn = null, tr = null, jc = !1, ms = !1, Cu = 0, le = 0;
  function Ft() {
    throw Error(x(321));
  }
  function st(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ti(n[l], r[l])) return !1;
    return !0;
  }
  function Ml(n, r, l, o, c, d) {
    if (en = d, Vt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Rt.current = n === null || n.memoizedState === null ? qc : ws, n = l(o, c), ms) {
      d = 0;
      do {
        if (ms = !1, Cu = 0, 25 <= d) throw Error(x(301));
        d += 1, tr = Pn = null, r.updateQueue = null, Rt.current = Kc, n = l(o, c);
      } while (ms);
    }
    if (Rt.current = Tu, r = Pn !== null && Pn.next !== null, en = 0, tr = Pn = Vt = null, jc = !1, r) throw Error(x(300));
    return n;
  }
  function ri() {
    var n = Cu !== 0;
    return Cu = 0, n;
  }
  function br() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return tr === null ? Vt.memoizedState = tr = n : tr = tr.next = n, tr;
  }
  function On() {
    if (Pn === null) {
      var n = Vt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Pn.next;
    var r = tr === null ? Vt.memoizedState : tr.next;
    if (r !== null) tr = r, Pn = n;
    else {
      if (n === null) throw Error(x(310));
      Pn = n, n = { memoizedState: Pn.memoizedState, baseState: Pn.baseState, baseQueue: Pn.baseQueue, queue: Pn.queue, next: null }, tr === null ? Vt.memoizedState = tr = n : tr = tr.next = n;
    }
    return tr;
  }
  function Xi(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function jl(n) {
    var r = On(), l = r.queue;
    if (l === null) throw Error(x(311));
    l.lastRenderedReducer = n;
    var o = Pn, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var m = c.next;
        c.next = d.next, d.next = m;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var C = m = null, _ = null, V = d;
      do {
        var oe = V.lane;
        if ((en & oe) === oe) _ !== null && (_ = _.next = { lane: 0, action: V.action, hasEagerState: V.hasEagerState, eagerState: V.eagerState, next: null }), o = V.hasEagerState ? V.eagerState : n(o, V.action);
        else {
          var pe = {
            lane: oe,
            action: V.action,
            hasEagerState: V.hasEagerState,
            eagerState: V.eagerState,
            next: null
          };
          _ === null ? (C = _ = pe, m = o) : _ = _.next = pe, Vt.lanes |= oe, Oi |= oe;
        }
        V = V.next;
      } while (V !== null && V !== d);
      _ === null ? m = o : _.next = C, ti(o, r.memoizedState) || (Hn = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = _, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Vt.lanes |= d, Oi |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function wu(n) {
    var r = On(), l = r.queue;
    if (l === null) throw Error(x(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ti(d, r.memoizedState) || (Hn = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function Ac() {
  }
  function zc(n, r) {
    var l = Vt, o = On(), c = r(), d = !ti(o.memoizedState, c);
    if (d && (o.memoizedState = c, Hn = !0), o = o.queue, ys(Pc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || tr !== null && tr.memoizedState.tag & 1) {
      if (l.flags |= 2048, xu(9, Fc.bind(null, l, o, c, r), void 0, null), Kn === null) throw Error(x(349));
      en & 30 || Uc(l, r, c);
    }
    return c;
  }
  function Uc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Vt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Vt.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Fc(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Hc(r) && Vc(n);
  }
  function Pc(n, r, l) {
    return l(function() {
      Hc(r) && Vc(n);
    });
  }
  function Hc(n) {
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
    r !== null && Ar(r, n, 1, -1);
  }
  function Bc(n) {
    var r = br();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xi, lastRenderedState: n }, r.queue = n, n = n.dispatch = Ru.bind(null, Vt, n), [r.memoizedState, n];
  }
  function xu(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = Vt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Vt.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Ic() {
    return On().memoizedState;
  }
  function go(n, r, l, o) {
    var c = br();
    Vt.flags |= n, c.memoizedState = xu(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function So(n, r, l, o) {
    var c = On();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (Pn !== null) {
      var m = Pn.memoizedState;
      if (d = m.destroy, o !== null && st(o, m.deps)) {
        c.memoizedState = xu(r, l, d, o);
        return;
      }
    }
    Vt.flags |= n, c.memoizedState = xu(1 | r, l, d, o);
  }
  function Yc(n, r) {
    return go(8390656, 8, n, r);
  }
  function ys(n, r) {
    return So(2048, 8, n, r);
  }
  function $c(n, r) {
    return So(4, 2, n, r);
  }
  function gs(n, r) {
    return So(4, 4, n, r);
  }
  function bu(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Qc(n, r, l) {
    return l = l != null ? l.concat([n]) : null, So(4, 4, bu.bind(null, r, n), l);
  }
  function Ss() {
  }
  function Wc(n, r) {
    var l = On();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && st(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Gc(n, r) {
    var l = On();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && st(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function Dd(n, r, l) {
    return en & 21 ? (ti(l, r) || (l = Xu(), Vt.lanes |= l, Oi |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Hn = !0), n.memoizedState = l);
  }
  function Es(n, r) {
    var l = Pt;
    Pt = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Ht.transition;
    Ht.transition = {};
    try {
      n(!1), r();
    } finally {
      Pt = l, Ht.transition = o;
    }
  }
  function Od() {
    return On().memoizedState;
  }
  function Cs(n, r, l) {
    var o = Ni(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, Zr(n)) Hv(r, l);
    else if (l = Rd(n, r, l, o), l !== null) {
      var c = In();
      Ar(l, n, o, c), rn(l, r, o);
    }
  }
  function Ru(n, r, l) {
    var o = Ni(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (Zr(n)) Hv(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var m = r.lastRenderedState, C = d(m, l);
        if (c.hasEagerState = !0, c.eagerState = C, ti(C, m)) {
          var _ = r.interleaved;
          _ === null ? (c.next = c, bd(r)) : (c.next = _.next, _.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = Rd(n, r, c, o), l !== null && (c = In(), Ar(l, n, o, c), rn(l, r, o));
    }
  }
  function Zr(n) {
    var r = n.alternate;
    return n === Vt || r !== null && r === Vt;
  }
  function Hv(n, r) {
    ms = jc = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function rn(n, r, l) {
    if (l & 4194240) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, Vi(n, l);
    }
  }
  var Tu = { readContext: Ma, useCallback: Ft, useContext: Ft, useEffect: Ft, useImperativeHandle: Ft, useInsertionEffect: Ft, useLayoutEffect: Ft, useMemo: Ft, useReducer: Ft, useRef: Ft, useState: Ft, useDebugValue: Ft, useDeferredValue: Ft, useTransition: Ft, useMutableSource: Ft, useSyncExternalStore: Ft, useId: Ft, unstable_isNewReconciler: !1 }, qc = { readContext: Ma, useCallback: function(n, r) {
    return br().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ma, useEffect: Yc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, go(
      4194308,
      4,
      bu.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return go(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return go(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = br();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = br();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Cs.bind(null, Vt, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = br();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Bc, useDebugValue: Ss, useDeferredValue: function(n) {
    return br().memoizedState = n;
  }, useTransition: function() {
    var n = Bc(!1), r = n[0];
    return n = Es.bind(null, n[1]), br().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = Vt, c = br();
    if (hn) {
      if (l === void 0) throw Error(x(407));
      l = l();
    } else {
      if (l = r(), Kn === null) throw Error(x(349));
      en & 30 || Uc(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Yc(Pc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, xu(9, Fc.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = br(), r = Kn.identifierPrefix;
    if (hn) {
      var l = Ri, o = bi;
      l = (o & ~(1 << 32 - Dr(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Cu++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = le++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, ws = {
    readContext: Ma,
    useCallback: Wc,
    useContext: Ma,
    useEffect: ys,
    useImperativeHandle: Qc,
    useInsertionEffect: $c,
    useLayoutEffect: gs,
    useMemo: Gc,
    useReducer: jl,
    useRef: Ic,
    useState: function() {
      return jl(Xi);
    },
    useDebugValue: Ss,
    useDeferredValue: function(n) {
      var r = On();
      return Dd(r, Pn.memoizedState, n);
    },
    useTransition: function() {
      var n = jl(Xi)[0], r = On().memoizedState;
      return [n, r];
    },
    useMutableSource: Ac,
    useSyncExternalStore: zc,
    useId: Od,
    unstable_isNewReconciler: !1
  }, Kc = { readContext: Ma, useCallback: Wc, useContext: Ma, useEffect: ys, useImperativeHandle: Qc, useInsertionEffect: $c, useLayoutEffect: gs, useMemo: Gc, useReducer: wu, useRef: Ic, useState: function() {
    return wu(Xi);
  }, useDebugValue: Ss, useDeferredValue: function(n) {
    var r = On();
    return Pn === null ? r.memoizedState = n : Dd(r, Pn.memoizedState, n);
  }, useTransition: function() {
    var n = wu(Xi)[0], r = On().memoizedState;
    return [n, r];
  }, useMutableSource: Ac, useSyncExternalStore: zc, useId: Od, unstable_isNewReconciler: !1 };
  function ai(n, r) {
    if (n && n.defaultProps) {
      r = we({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function Nd(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : we({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Xc = { isMounted: function(n) {
    return (n = n._reactInternals) ? yt(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = In(), c = Ni(n), d = Ki(o, c);
    d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (Ar(r, n, c, o), Nc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = In(), c = Ni(n), d = Ki(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = Ll(n, d, c), r !== null && (Ar(r, n, c, o), Nc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = In(), o = Ni(n), c = Ki(l, o);
    c.tag = 2, r != null && (c.callback = r), r = Ll(n, c, o), r !== null && (Ar(r, n, o, l), Nc(r, n, o));
  } };
  function Vv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !ts(l, o) || !ts(c, d) : !0;
  }
  function Jc(n, r, l) {
    var o = !1, c = xr, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Ma(d) : (c = Un(r) ? Gr : Rn.current, o = r.contextTypes, d = (o = o != null) ? qr(n, c) : xr), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Xc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Bv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && Xc.enqueueReplaceState(r, r.state, null);
  }
  function xs(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, Td(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Ma(d) : (d = Un(r) ? Gr : Rn.current, c.context = qr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Nd(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Xc.enqueueReplaceState(c, c.state, null), fs(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function _u(n, r) {
    try {
      var l = "", o = r;
      do
        l += be(o), o = o.return;
      while (o);
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
  var Zc = typeof WeakMap == "function" ? WeakMap : Map;
  function Iv(n, r, l) {
    l = Ki(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      Ro || (Ro = !0, Ou = o), Md(n, r);
    }, l;
  }
  function jd(n, r, l) {
    l = Ki(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        Md(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Md(n, r), typeof o != "function" && (Ul === null ? Ul = /* @__PURE__ */ new Set([this]) : Ul.add(this));
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
    c.has(l) || (c.add(l), n = Ey.bind(null, n, r, l), r.then(n, n));
  }
  function Yv(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Al(n, r, l, o, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ki(-1, 1), r.tag = 2, Ll(l, r, 1))), l.lanes |= 1), n);
  }
  var bs = Le.ReactCurrentOwner, Hn = !1;
  function sr(n, r, l, o) {
    r.child = n === null ? Oe(r, null, l, o) : Dn(r, n.child, l, o);
  }
  function ea(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return Cn(r, c), o = Ml(n, r, l, o, d, c), l = ri(), n !== null && !Hn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Aa(n, r, c)) : (hn && l && _c(r), r.flags |= 1, sr(n, r, o, c), r.child);
  }
  function ku(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !qd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, St(n, r, d, o, c)) : (n = Hs(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : ts, l(m, o) && n.ref === r.ref) return Aa(n, r, c);
    }
    return r.flags |= 1, n = Pl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function St(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (ts(d, o) && n.ref === r.ref) if (Hn = !1, r.pendingProps = o = d, (n.lanes & c) !== 0) n.flags & 131072 && (Hn = !0);
      else return r.lanes = n.lanes, Aa(n, r, c);
    }
    return $v(n, r, l, o, c);
  }
  function Rs(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Xe(wo, ya), ya |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Xe(wo, ya), ya |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, Xe(wo, ya), ya |= o;
    }
    else d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, Xe(wo, ya), ya |= o;
    return sr(n, r, c, l), r.child;
  }
  function zd(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function $v(n, r, l, o, c) {
    var d = Un(l) ? Gr : Rn.current;
    return d = qr(r, d), Cn(r, c), l = Ml(n, r, l, o, d, c), o = ri(), n !== null && !Hn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, Aa(n, r, c)) : (hn && o && _c(r), r.flags |= 1, sr(n, r, l, c), r.child);
  }
  function Qv(n, r, l, o, c) {
    if (Un(l)) {
      var d = !0;
      er(r);
    } else d = !1;
    if (Cn(r, c), r.stateNode === null) ja(n, r), Jc(r, l, o), xs(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, C = r.memoizedProps;
      m.props = C;
      var _ = m.context, V = l.contextType;
      typeof V == "object" && V !== null ? V = Ma(V) : (V = Un(l) ? Gr : Rn.current, V = qr(r, V));
      var oe = l.getDerivedStateFromProps, pe = typeof oe == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      pe || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (C !== o || _ !== V) && Bv(r, m, o, V), ma = !1;
      var ue = r.memoizedState;
      m.state = ue, fs(r, o, m, c), _ = r.memoizedState, C !== o || ue !== _ || Gn.current || ma ? (typeof oe == "function" && (Nd(r, l, oe, o), _ = r.memoizedState), (C = ma || Vv(r, l, C, o, ue, _, V)) ? (pe || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = _), m.props = o, m.state = _, m.context = V, o = C) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, Uv(n, r), C = r.memoizedProps, V = r.type === r.elementType ? C : ai(r.type, C), m.props = V, pe = r.pendingProps, ue = m.context, _ = l.contextType, typeof _ == "object" && _ !== null ? _ = Ma(_) : (_ = Un(l) ? Gr : Rn.current, _ = qr(r, _));
      var je = l.getDerivedStateFromProps;
      (oe = typeof je == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (C !== pe || ue !== _) && Bv(r, m, o, _), ma = !1, ue = r.memoizedState, m.state = ue, fs(r, o, m, c);
      var Ie = r.memoizedState;
      C !== pe || ue !== Ie || Gn.current || ma ? (typeof je == "function" && (Nd(r, l, je, o), Ie = r.memoizedState), (V = ma || Vv(r, l, V, o, ue, Ie, _) || !1) ? (oe || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, Ie, _), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, Ie, _)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || C === n.memoizedProps && ue === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || C === n.memoizedProps && ue === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = Ie), m.props = o, m.state = Ie, m.context = _, o = V) : (typeof m.componentDidUpdate != "function" || C === n.memoizedProps && ue === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || C === n.memoizedProps && ue === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return Ts(n, r, l, o, d, c);
  }
  function Ts(n, r, l, o, c, d) {
    zd(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m) return c && Rc(r, l, !1), Aa(n, r, d);
    o = r.stateNode, bs.current = r;
    var C = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = Dn(r, n.child, null, d), r.child = Dn(r, null, C, d)) : sr(n, r, C, d), r.memoizedState = o.state, c && Rc(r, l, !0), r.child;
  }
  function Eo(n) {
    var r = n.stateNode;
    r.pendingContext ? Mv(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Mv(n, r.context, !1), kd(n, r.containerInfo);
  }
  function Wv(n, r, l, o, c) {
    return Nl(), qi(c), r.flags |= 256, sr(n, r, l, o), r.child;
  }
  var ef = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ud(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function tf(n, r, l) {
    var o = r.pendingProps, c = wn.current, d = !1, m = (r.flags & 128) !== 0, C;
    if ((C = m) || (C = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), C ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), Xe(wn, c & 1), n === null)
      return Sd(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, !(o & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Hl(m, o, 0, null), n = tl(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Ud(l), r.memoizedState = ef, n) : Fd(r, m));
    if (c = n.memoizedState, c !== null && (C = c.dehydrated, C !== null)) return Gv(n, r, m, o, C, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, C = c.sibling;
      var _ = { mode: "hidden", children: o.children };
      return !(m & 1) && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = _, r.deletions = null) : (o = Pl(c, _), o.subtreeFlags = c.subtreeFlags & 14680064), C !== null ? d = Pl(C, d) : (d = tl(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? Ud(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = ef, o;
    }
    return d = n.child, n = d.sibling, o = Pl(d, { mode: "visible", children: o.children }), !(r.mode & 1) && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Fd(n, r) {
    return r = Hl({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function _s(n, r, l, o) {
    return o !== null && qi(o), Dn(r, n.child, null, l), n = Fd(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Gv(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = Ld(Error(x(422))), _s(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Hl({ mode: "visible", children: o.children }, c, 0, null), d = tl(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, r.mode & 1 && Dn(r, n.child, null, m), r.child.memoizedState = Ud(m), r.memoizedState = ef, d);
    if (!(r.mode & 1)) return _s(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o) var C = o.dgst;
      return o = C, d = Error(x(419)), o = Ld(d, o, void 0), _s(n, r, m, o);
    }
    if (C = (m & n.childLanes) !== 0, Hn || C) {
      if (o = Kn, o !== null) {
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
        c = c & (o.suspendedLanes | m) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, ha(n, c), Ar(o, n, c, -1));
      }
      return Gd(), o = Ld(Error(x(421))), _s(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = Cy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Xr = Ei(c.nextSibling), Kr = r, hn = !0, La = null, n !== null && (Fn[Na++] = bi, Fn[Na++] = Ri, Fn[Na++] = pa, bi = n.id, Ri = n.overflow, pa = r), r = Fd(r, o.children), r.flags |= 4096, r);
  }
  function Pd(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), xd(n.return, r, l);
  }
  function Lr(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function _i(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (sr(n, r, o.children, l), o = wn.current, o & 2) o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Pd(n, l, r);
        else if (n.tag === 19) Pd(n, l, r);
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
    if (Xe(wn, o), !(r.mode & 1)) r.memoizedState = null;
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
  function ja(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Aa(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Oi |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(x(153));
    if (r.child !== null) {
      for (n = r.child, l = Pl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = Pl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function ks(n, r, l) {
    switch (r.tag) {
      case 3:
        Eo(r), Nl();
        break;
      case 5:
        Pv(r);
        break;
      case 1:
        Un(r.type) && er(r);
        break;
      case 4:
        kd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        Xe(va, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (Xe(wn, wn.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? tf(n, r, l) : (Xe(wn, wn.current & 1), n = Aa(n, r, l), n !== null ? n.sibling : null);
        Xe(wn, wn.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, n.flags & 128) {
          if (o) return _i(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Xe(wn, wn.current), o) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Rs(n, r, l);
    }
    return Aa(n, r, l);
  }
  var za, Vn, qv, Kv;
  za = function(n, r) {
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
  }, Vn = function() {
  }, qv = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, Su(Ti.current);
      var d = null;
      switch (l) {
        case "input":
          c = bn(n, c), o = bn(n, o), d = [];
          break;
        case "select":
          c = we({}, c, { value: void 0 }), o = we({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Qn(n, c), o = Qn(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = Rl);
      }
      fn(l, o);
      var m;
      l = null;
      for (V in c) if (!o.hasOwnProperty(V) && c.hasOwnProperty(V) && c[V] != null) if (V === "style") {
        var C = c[V];
        for (m in C) C.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
      } else V !== "dangerouslySetInnerHTML" && V !== "children" && V !== "suppressContentEditableWarning" && V !== "suppressHydrationWarning" && V !== "autoFocus" && (J.hasOwnProperty(V) ? d || (d = []) : (d = d || []).push(V, null));
      for (V in o) {
        var _ = o[V];
        if (C = c != null ? c[V] : void 0, o.hasOwnProperty(V) && _ !== C && (_ != null || C != null)) if (V === "style") if (C) {
          for (m in C) !C.hasOwnProperty(m) || _ && _.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
          for (m in _) _.hasOwnProperty(m) && C[m] !== _[m] && (l || (l = {}), l[m] = _[m]);
        } else l || (d || (d = []), d.push(
          V,
          l
        )), l = _;
        else V === "dangerouslySetInnerHTML" ? (_ = _ ? _.__html : void 0, C = C ? C.__html : void 0, _ != null && C !== _ && (d = d || []).push(V, _)) : V === "children" ? typeof _ != "string" && typeof _ != "number" || (d = d || []).push(V, "" + _) : V !== "suppressContentEditableWarning" && V !== "suppressHydrationWarning" && (J.hasOwnProperty(V) ? (_ != null && V === "onScroll" && Wt("scroll", n), d || C === _ || (d = [])) : (d = d || []).push(V, _));
      }
      l && (d = d || []).push("style", l);
      var V = d;
      (r.updateQueue = V) && (r.flags |= 4);
    }
  }, Kv = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function Ds(n, r) {
    if (!hn) switch (n.tailMode) {
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
  function nr(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, o = 0;
    if (r) for (var c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags & 14680064, o |= c.flags & 14680064, c.return = n, c = c.sibling;
    else for (c = n.child; c !== null; ) l |= c.lanes | c.childLanes, o |= c.subtreeFlags, o |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= o, n.childLanes = l, r;
  }
  function Xv(n, r, l) {
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
        return nr(r), null;
      case 1:
        return Un(r.type) && ho(), nr(r), null;
      case 3:
        return o = r.stateNode, Eu(), sn(Gn), sn(Rn), Ze(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (Dc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, La !== null && (Nu(La), La = null))), Vn(n, r), nr(r), null;
      case 5:
        Lc(r);
        var c = Su(vs.current);
        if (l = r.type, n !== null && r.stateNode != null) qv(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null) throw Error(x(166));
            return nr(r), null;
          }
          if (n = Su(Ti.current), Dc(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[Ci] = r, o[us] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                Wt("cancel", o), Wt("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Wt("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < as.length; c++) Wt(as[c], o);
                break;
              case "source":
                Wt("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Wt(
                  "error",
                  o
                ), Wt("load", o);
                break;
              case "details":
                Wt("toggle", o);
                break;
              case "input":
                Tn(o, d), Wt("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Wt("invalid", o);
                break;
              case "textarea":
                Er(o, d), Wt("invalid", o);
            }
            fn(l, d), c = null;
            for (var m in d) if (d.hasOwnProperty(m)) {
              var C = d[m];
              m === "children" ? typeof C == "string" ? o.textContent !== C && (d.suppressHydrationWarning !== !0 && Cc(o.textContent, C, n), c = ["children", C]) : typeof C == "number" && o.textContent !== "" + C && (d.suppressHydrationWarning !== !0 && Cc(
                o.textContent,
                C,
                n
              ), c = ["children", "" + C]) : J.hasOwnProperty(m) && C != null && m === "onScroll" && Wt("scroll", o);
            }
            switch (l) {
              case "input":
                $t(o), ci(o, d, !0);
                break;
              case "textarea":
                $t(o), An(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = Rl);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Cr(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[Ci] = r, n[us] = o, za(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = Zn(l, o), l) {
                case "dialog":
                  Wt("cancel", n), Wt("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Wt("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < as.length; c++) Wt(as[c], n);
                  c = o;
                  break;
                case "source":
                  Wt("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Wt(
                    "error",
                    n
                  ), Wt("load", n), c = o;
                  break;
                case "details":
                  Wt("toggle", n), c = o;
                  break;
                case "input":
                  Tn(n, o), c = bn(n, o), Wt("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = we({}, o, { value: void 0 }), Wt("invalid", n);
                  break;
                case "textarea":
                  Er(n, o), c = Qn(n, o), Wt("invalid", n);
                  break;
                default:
                  c = o;
              }
              fn(l, c), C = c;
              for (d in C) if (C.hasOwnProperty(d)) {
                var _ = C[d];
                d === "style" ? an(n, _) : d === "dangerouslySetInnerHTML" ? (_ = _ ? _.__html : void 0, _ != null && fi(n, _)) : d === "children" ? typeof _ == "string" ? (l !== "textarea" || _ !== "") && xe(n, _) : typeof _ == "number" && xe(n, "" + _) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (J.hasOwnProperty(d) ? _ != null && d === "onScroll" && Wt("scroll", n) : _ != null && ge(n, d, _, m));
              }
              switch (l) {
                case "input":
                  $t(n), ci(n, o, !1);
                  break;
                case "textarea":
                  $t(n), An(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + Fe(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? _n(n, !!o.multiple, d, !1) : o.defaultValue != null && _n(
                    n,
                    !!o.multiple,
                    o.defaultValue,
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
        return nr(r), null;
      case 6:
        if (n && r.stateNode != null) Kv(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null) throw Error(x(166));
          if (l = Su(vs.current), Su(Ti.current), Dc(r)) {
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
        return nr(r), null;
      case 13:
        if (sn(wn), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (hn && Xr !== null && r.mode & 1 && !(r.flags & 128)) cs(), Nl(), r.flags |= 98560, d = !1;
          else if (d = Dc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(x(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(x(317));
              d[Ci] = r;
            } else Nl(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            nr(r), d = !1;
          } else La !== null && (Nu(La), La = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, r.mode & 1 && (n === null || wn.current & 1 ? Ln === 0 && (Ln = 3) : Gd())), r.updateQueue !== null && (r.flags |= 4), nr(r), null);
      case 4:
        return Eu(), Vn(n, r), n === null && so(r.stateNode.containerInfo), nr(r), null;
      case 10:
        return wd(r.type._context), nr(r), null;
      case 17:
        return Un(r.type) && ho(), nr(r), null;
      case 19:
        if (sn(wn), d = r.memoizedState, d === null) return nr(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null) if (o) Ds(d, !1);
        else {
          if (Ln !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (m = Mc(n), m !== null) {
              for (r.flags |= 128, Ds(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; ) d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return Xe(wn, wn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && gt() > bo && (r.flags |= 128, o = !0, Ds(d, !1), r.lanes = 4194304);
        }
        else {
          if (!o) if (n = Mc(m), n !== null) {
            if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Ds(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !hn) return nr(r), null;
          } else 2 * gt() - d.renderingStartTime > bo && l !== 1073741824 && (r.flags |= 128, o = !0, Ds(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = gt(), r.sibling = null, l = wn.current, Xe(wn, o ? l & 1 | 2 : l & 1), r) : (nr(r), null);
      case 22:
      case 23:
        return Wd(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && r.mode & 1 ? ya & 1073741824 && (nr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : nr(r), null;
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
        return Un(r.type) && ho(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Eu(), sn(Gn), sn(Rn), Ze(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Lc(r), null;
      case 13:
        if (sn(wn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(x(340));
          Nl();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return sn(wn), null;
      case 4:
        return Eu(), null;
      case 10:
        return wd(r.type._context), null;
      case 22:
      case 23:
        return Wd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Os = !1, Rr = !1, vy = typeof WeakSet == "function" ? WeakSet : Set, Pe = null;
  function Co(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (o) {
      mn(n, r, o);
    }
    else l.current = null;
  }
  function rf(n, r, l) {
    try {
      l();
    } catch (o) {
      mn(n, r, o);
    }
  }
  var Jv = !1;
  function Zv(n, r) {
    if (ls = _a, n = ns(), pc(n)) {
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
          var m = 0, C = -1, _ = -1, V = 0, oe = 0, pe = n, ue = null;
          t: for (; ; ) {
            for (var je; pe !== l || c !== 0 && pe.nodeType !== 3 || (C = m + c), pe !== d || o !== 0 && pe.nodeType !== 3 || (_ = m + o), pe.nodeType === 3 && (m += pe.nodeValue.length), (je = pe.firstChild) !== null; )
              ue = pe, pe = je;
            for (; ; ) {
              if (pe === n) break t;
              if (ue === l && ++V === c && (C = m), ue === d && ++oe === o && (_ = m), (je = pe.nextSibling) !== null) break;
              pe = ue, ue = pe.parentNode;
            }
            pe = je;
          }
          l = C === -1 || _ === -1 ? null : { start: C, end: _ };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (pu = { focusedElem: n, selectionRange: l }, _a = !1, Pe = r; Pe !== null; ) if (r = Pe, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Pe = n;
    else for (; Pe !== null; ) {
      r = Pe;
      try {
        var Ie = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Ie !== null) {
              var Ge = Ie.memoizedProps, Mn = Ie.memoizedState, L = r.stateNode, D = L.getSnapshotBeforeUpdate(r.elementType === r.type ? Ge : ai(r.type, Ge), Mn);
              L.__reactInternalSnapshotBeforeUpdate = D;
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
      } catch (se) {
        mn(r, r.return, se);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Pe = n;
        break;
      }
      Pe = r.return;
    }
    return Ie = Jv, Jv = !1, Ie;
  }
  function Ns(n, r, l) {
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
  function Ls(n, r) {
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
    r !== null && (n.alternate = null, af(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Ci], delete r[us], delete r[os], delete r[vo], delete r[dy])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
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
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = Rl));
    else if (o !== 4 && (n = n.child, n !== null)) for (ki(n, r, l), n = n.sibling; n !== null; ) ki(n, r, l), n = n.sibling;
  }
  function Di(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null)) for (Di(n, r, l), n = n.sibling; n !== null; ) Di(n, r, l), n = n.sibling;
  }
  var Nn = null, Mr = !1;
  function jr(n, r, l) {
    for (l = l.child; l !== null; ) eh(n, r, l), l = l.sibling;
  }
  function eh(n, r, l) {
    if (Qr && typeof Qr.onCommitFiberUnmount == "function") try {
      Qr.onCommitFiberUnmount(ml, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        Rr || Co(l, r);
      case 6:
        var o = Nn, c = Mr;
        Nn = null, jr(n, r, l), Nn = o, Mr = c, Nn !== null && (Mr ? (n = Nn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : Nn.removeChild(l.stateNode));
        break;
      case 18:
        Nn !== null && (Mr ? (n = Nn, l = l.stateNode, n.nodeType === 8 ? po(n.parentNode, l) : n.nodeType === 1 && po(n, l), Za(n)) : po(Nn, l.stateNode));
        break;
      case 4:
        o = Nn, c = Mr, Nn = l.stateNode.containerInfo, Mr = !0, jr(n, r, l), Nn = o, Mr = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Rr && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && (d & 2 || d & 4) && rf(l, r, m), c = c.next;
          } while (c !== o);
        }
        jr(n, r, l);
        break;
      case 1:
        if (!Rr && (Co(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function")) try {
          o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
        } catch (C) {
          mn(l, r, C);
        }
        jr(n, r, l);
        break;
      case 21:
        jr(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Rr = (o = Rr) || l.memoizedState !== null, jr(n, r, l), Rr = o) : jr(n, r, l);
        break;
      default:
        jr(n, r, l);
    }
  }
  function th(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new vy()), r.forEach(function(o) {
        var c = ch.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function ii(n, r) {
    var l = r.deletions;
    if (l !== null) for (var o = 0; o < l.length; o++) {
      var c = l[o];
      try {
        var d = n, m = r, C = m;
        e: for (; C !== null; ) {
          switch (C.tag) {
            case 5:
              Nn = C.stateNode, Mr = !1;
              break e;
            case 3:
              Nn = C.stateNode.containerInfo, Mr = !0;
              break e;
            case 4:
              Nn = C.stateNode.containerInfo, Mr = !0;
              break e;
          }
          C = C.return;
        }
        if (Nn === null) throw Error(x(160));
        eh(d, m, c), Nn = null, Mr = !1;
        var _ = c.alternate;
        _ !== null && (_.return = null), c.return = null;
      } catch (V) {
        mn(c, r, V);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Vd(r, n), r = r.sibling;
  }
  function Vd(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ii(r, n), ta(n), o & 4) {
          try {
            Ns(3, n, n.return), Ls(3, n);
          } catch (Ge) {
            mn(n, n.return, Ge);
          }
          try {
            Ns(5, n, n.return);
          } catch (Ge) {
            mn(n, n.return, Ge);
          }
        }
        break;
      case 1:
        ii(r, n), ta(n), o & 512 && l !== null && Co(l, l.return);
        break;
      case 5:
        if (ii(r, n), ta(n), o & 512 && l !== null && Co(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            xe(c, "");
          } catch (Ge) {
            mn(n, n.return, Ge);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, C = n.type, _ = n.updateQueue;
          if (n.updateQueue = null, _ !== null) try {
            C === "input" && d.type === "radio" && d.name != null && $n(c, d), Zn(C, m);
            var V = Zn(C, d);
            for (m = 0; m < _.length; m += 2) {
              var oe = _[m], pe = _[m + 1];
              oe === "style" ? an(c, pe) : oe === "dangerouslySetInnerHTML" ? fi(c, pe) : oe === "children" ? xe(c, pe) : ge(c, oe, pe, V);
            }
            switch (C) {
              case "input":
                $r(c, d);
                break;
              case "textarea":
                $a(c, d);
                break;
              case "select":
                var ue = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var je = d.value;
                je != null ? _n(c, !!d.multiple, je, !1) : ue !== !!d.multiple && (d.defaultValue != null ? _n(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : _n(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[us] = d;
          } catch (Ge) {
            mn(n, n.return, Ge);
          }
        }
        break;
      case 6:
        if (ii(r, n), ta(n), o & 4) {
          if (n.stateNode === null) throw Error(x(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (Ge) {
            mn(n, n.return, Ge);
          }
        }
        break;
      case 3:
        if (ii(r, n), ta(n), o & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Za(r.containerInfo);
        } catch (Ge) {
          mn(n, n.return, Ge);
        }
        break;
      case 4:
        ii(r, n), ta(n);
        break;
      case 13:
        ii(r, n), ta(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Yd = gt())), o & 4 && th(n);
        break;
      case 22:
        if (oe = l !== null && l.memoizedState !== null, n.mode & 1 ? (Rr = (V = Rr) || oe, ii(r, n), Rr = V) : ii(r, n), ta(n), o & 8192) {
          if (V = n.memoizedState !== null, (n.stateNode.isHidden = V) && !oe && n.mode & 1) for (Pe = n, oe = n.child; oe !== null; ) {
            for (pe = Pe = oe; Pe !== null; ) {
              switch (ue = Pe, je = ue.child, ue.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Ns(4, ue, ue.return);
                  break;
                case 1:
                  Co(ue, ue.return);
                  var Ie = ue.stateNode;
                  if (typeof Ie.componentWillUnmount == "function") {
                    o = ue, l = ue.return;
                    try {
                      r = o, Ie.props = r.memoizedProps, Ie.state = r.memoizedState, Ie.componentWillUnmount();
                    } catch (Ge) {
                      mn(o, l, Ge);
                    }
                  }
                  break;
                case 5:
                  Co(ue, ue.return);
                  break;
                case 22:
                  if (ue.memoizedState !== null) {
                    js(pe);
                    continue;
                  }
              }
              je !== null ? (je.return = ue, Pe = je) : js(pe);
            }
            oe = oe.sibling;
          }
          e: for (oe = null, pe = n; ; ) {
            if (pe.tag === 5) {
              if (oe === null) {
                oe = pe;
                try {
                  c = pe.stateNode, V ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (C = pe.stateNode, _ = pe.memoizedProps.style, m = _ != null && _.hasOwnProperty("display") ? _.display : null, C.style.display = Qt("display", m));
                } catch (Ge) {
                  mn(n, n.return, Ge);
                }
              }
            } else if (pe.tag === 6) {
              if (oe === null) try {
                pe.stateNode.nodeValue = V ? "" : pe.memoizedProps;
              } catch (Ge) {
                mn(n, n.return, Ge);
              }
            } else if ((pe.tag !== 22 && pe.tag !== 23 || pe.memoizedState === null || pe === n) && pe.child !== null) {
              pe.child.return = pe, pe = pe.child;
              continue;
            }
            if (pe === n) break e;
            for (; pe.sibling === null; ) {
              if (pe.return === null || pe.return === n) break e;
              oe === pe && (oe = null), pe = pe.return;
            }
            oe === pe && (oe = null), pe.sibling.return = pe.return, pe = pe.sibling;
          }
        }
        break;
      case 19:
        ii(r, n), ta(n), o & 4 && th(n);
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
            if (Ms(l)) {
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
            o.flags & 32 && (xe(c, ""), o.flags &= -33);
            var d = Ji(n);
            Di(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, C = Ji(n);
            ki(n, C, m);
            break;
          default:
            throw Error(x(161));
        }
      } catch (_) {
        mn(n, n.return, _);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function hy(n, r, l) {
    Pe = n, Bd(n);
  }
  function Bd(n, r, l) {
    for (var o = (n.mode & 1) !== 0; Pe !== null; ) {
      var c = Pe, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || Os;
        if (!m) {
          var C = c.alternate, _ = C !== null && C.memoizedState !== null || Rr;
          C = Os;
          var V = Rr;
          if (Os = m, (Rr = _) && !V) for (Pe = c; Pe !== null; ) m = Pe, _ = m.child, m.tag === 22 && m.memoizedState !== null ? Id(c) : _ !== null ? (_.return = m, Pe = _) : Id(c);
          for (; d !== null; ) Pe = d, Bd(d), d = d.sibling;
          Pe = c, Os = C, Rr = V;
        }
        nh(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, Pe = d) : nh(n);
    }
  }
  function nh(n) {
    for (; Pe !== null; ) {
      var r = Pe;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              Rr || Ls(5, r);
              break;
            case 1:
              var o = r.stateNode;
              if (r.flags & 4 && !Rr) if (l === null) o.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : ai(r.type, l.memoizedProps);
                o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && _d(r, d, o);
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
                _d(r, m, l);
              }
              break;
            case 5:
              var C = r.stateNode;
              if (l === null && r.flags & 4) {
                l = C;
                var _ = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    _.autoFocus && l.focus();
                    break;
                  case "img":
                    _.src && (l.src = _.src);
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
                var V = r.alternate;
                if (V !== null) {
                  var oe = V.memoizedState;
                  if (oe !== null) {
                    var pe = oe.dehydrated;
                    pe !== null && Za(pe);
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
          Rr || r.flags & 512 && Hd(r);
        } catch (ue) {
          mn(r, r.return, ue);
        }
      }
      if (r === n) {
        Pe = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, Pe = l;
        break;
      }
      Pe = r.return;
    }
  }
  function js(n) {
    for (; Pe !== null; ) {
      var r = Pe;
      if (r === n) {
        Pe = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, Pe = l;
        break;
      }
      Pe = r.return;
    }
  }
  function Id(n) {
    for (; Pe !== null; ) {
      var r = Pe;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              Ls(4, r);
            } catch (_) {
              mn(r, l, _);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (_) {
                mn(r, c, _);
              }
            }
            var d = r.return;
            try {
              Hd(r);
            } catch (_) {
              mn(r, d, _);
            }
            break;
          case 5:
            var m = r.return;
            try {
              Hd(r);
            } catch (_) {
              mn(r, m, _);
            }
        }
      } catch (_) {
        mn(r, r.return, _);
      }
      if (r === n) {
        Pe = null;
        break;
      }
      var C = r.sibling;
      if (C !== null) {
        C.return = r.return, Pe = C;
        break;
      }
      Pe = r.return;
    }
  }
  var my = Math.ceil, zl = Le.ReactCurrentDispatcher, Du = Le.ReactCurrentOwner, cr = Le.ReactCurrentBatchConfig, Mt = 0, Kn = null, Bn = null, fr = 0, ya = 0, wo = Oa(0), Ln = 0, As = null, Oi = 0, xo = 0, lf = 0, zs = null, na = null, Yd = 0, bo = 1 / 0, ga = null, Ro = !1, Ou = null, Ul = null, uf = !1, Zi = null, Us = 0, Fl = 0, To = null, Fs = -1, Tr = 0;
  function In() {
    return Mt & 6 ? gt() : Fs !== -1 ? Fs : Fs = gt();
  }
  function Ni(n) {
    return n.mode & 1 ? Mt & 2 && fr !== 0 ? fr & -fr : py.transition !== null ? (Tr === 0 && (Tr = Xu()), Tr) : (n = Pt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : ao(n.type)), n) : 1;
  }
  function Ar(n, r, l, o) {
    if (50 < Fl) throw Fl = 0, To = null, Error(x(185));
    Hi(n, l, o), (!(Mt & 2) || n !== Kn) && (n === Kn && (!(Mt & 2) && (xo |= l), Ln === 4 && li(n, fr)), ra(n, o), l === 1 && Mt === 0 && !(r.mode & 1) && (bo = gt() + 500, mo && xi()));
  }
  function ra(n, r) {
    var l = n.callbackNode;
    au(n, r);
    var o = Ja(n, n === Kn ? fr : 0);
    if (o === 0) l !== null && lr(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && lr(l), r === 1) n.tag === 0 ? _l($d.bind(null, n)) : Tc($d.bind(null, n)), fo(function() {
        !(Mt & 6) && xi();
      }), l = null;
      else {
        switch (Zu(o)) {
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
            l = Gu;
            break;
          default:
            l = ru;
        }
        l = dh(l, of.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function of(n, r) {
    if (Fs = -1, Tr = 0, Mt & 6) throw Error(x(327));
    var l = n.callbackNode;
    if (_o() && n.callbackNode !== l) return null;
    var o = Ja(n, n === Kn ? fr : 0);
    if (o === 0) return null;
    if (o & 30 || o & n.expiredLanes || r) r = sf(n, o);
    else {
      r = o;
      var c = Mt;
      Mt |= 2;
      var d = ah();
      (Kn !== n || fr !== r) && (ga = null, bo = gt() + 500, el(n, r));
      do
        try {
          ih();
          break;
        } catch (C) {
          rh(n, C);
        }
      while (!0);
      Cd(), zl.current = d, Mt = c, Bn !== null ? r = 0 : (Kn = null, fr = 0, r = Ln);
    }
    if (r !== 0) {
      if (r === 2 && (c = gl(n), c !== 0 && (o = c, r = Ps(n, c))), r === 1) throw l = As, el(n, 0), li(n, o), ra(n, gt()), l;
      if (r === 6) li(n, o);
      else {
        if (c = n.current.alternate, !(o & 30) && !yy(c) && (r = sf(n, o), r === 2 && (d = gl(n), d !== 0 && (o = d, r = Ps(n, d))), r === 1)) throw l = As, el(n, 0), li(n, o), ra(n, gt()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(x(345));
          case 2:
            Mu(n, na, ga);
            break;
          case 3:
            if (li(n, o), (o & 130023424) === o && (r = Yd + 500 - gt(), 10 < r)) {
              if (Ja(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                In(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = xc(Mu.bind(null, n, na, ga), r);
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
            if (o = c, o = gt() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * my(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = xc(Mu.bind(null, n, na, ga), o);
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
    return ra(n, gt()), n.callbackNode === l ? of.bind(null, n) : null;
  }
  function Ps(n, r) {
    var l = zs;
    return n.current.memoizedState.isDehydrated && (el(n, r).flags |= 256), n = sf(n, r), n !== 2 && (r = na, na = l, r !== null && Nu(r)), n;
  }
  function Nu(n) {
    na === null ? na = n : na.push.apply(na, n);
  }
  function yy(n) {
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
    for (r &= ~lf, r &= ~xo, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - Dr(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function $d(n) {
    if (Mt & 6) throw Error(x(327));
    _o();
    var r = Ja(n, 0);
    if (!(r & 1)) return ra(n, gt()), null;
    var l = sf(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = gl(n);
      o !== 0 && (r = o, l = Ps(n, o));
    }
    if (l === 1) throw l = As, el(n, 0), li(n, r), ra(n, gt()), l;
    if (l === 6) throw Error(x(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Mu(n, na, ga), ra(n, gt()), null;
  }
  function Qd(n, r) {
    var l = Mt;
    Mt |= 1;
    try {
      return n(r);
    } finally {
      Mt = l, Mt === 0 && (bo = gt() + 500, mo && xi());
    }
  }
  function Lu(n) {
    Zi !== null && Zi.tag === 0 && !(Mt & 6) && _o();
    var r = Mt;
    Mt |= 1;
    var l = cr.transition, o = Pt;
    try {
      if (cr.transition = null, Pt = 1, n) return n();
    } finally {
      Pt = o, cr.transition = l, Mt = r, !(Mt & 6) && xi();
    }
  }
  function Wd() {
    ya = wo.current, sn(wo);
  }
  function el(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, md(l)), Bn !== null) for (l = Bn.return; l !== null; ) {
      var o = l;
      switch (kc(o), o.tag) {
        case 1:
          o = o.type.childContextTypes, o != null && ho();
          break;
        case 3:
          Eu(), sn(Gn), sn(Rn), Ze();
          break;
        case 5:
          Lc(o);
          break;
        case 4:
          Eu();
          break;
        case 13:
          sn(wn);
          break;
        case 19:
          sn(wn);
          break;
        case 10:
          wd(o.type._context);
          break;
        case 22:
        case 23:
          Wd();
      }
      l = l.return;
    }
    if (Kn = n, Bn = n = Pl(n.current, null), fr = ya = r, Ln = 0, As = null, lf = xo = Oi = 0, na = zs = null, gu !== null) {
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
  function rh(n, r) {
    do {
      var l = Bn;
      try {
        if (Cd(), Rt.current = Tu, jc) {
          for (var o = Vt.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          jc = !1;
        }
        if (en = 0, tr = Pn = Vt = null, ms = !1, Cu = 0, Du.current = null, l === null || l.return === null) {
          Ln = 1, As = r, Bn = null;
          break;
        }
        e: {
          var d = n, m = l.return, C = l, _ = r;
          if (r = fr, C.flags |= 32768, _ !== null && typeof _ == "object" && typeof _.then == "function") {
            var V = _, oe = C, pe = oe.tag;
            if (!(oe.mode & 1) && (pe === 0 || pe === 11 || pe === 15)) {
              var ue = oe.alternate;
              ue ? (oe.updateQueue = ue.updateQueue, oe.memoizedState = ue.memoizedState, oe.lanes = ue.lanes) : (oe.updateQueue = null, oe.memoizedState = null);
            }
            var je = Yv(m);
            if (je !== null) {
              je.flags &= -257, Al(je, m, C, d, r), je.mode & 1 && Ad(d, V, r), r = je, _ = V;
              var Ie = r.updateQueue;
              if (Ie === null) {
                var Ge = /* @__PURE__ */ new Set();
                Ge.add(_), r.updateQueue = Ge;
              } else Ie.add(_);
              break e;
            } else {
              if (!(r & 1)) {
                Ad(d, V, r), Gd();
                break e;
              }
              _ = Error(x(426));
            }
          } else if (hn && C.mode & 1) {
            var Mn = Yv(m);
            if (Mn !== null) {
              !(Mn.flags & 65536) && (Mn.flags |= 256), Al(Mn, m, C, d, r), qi(_u(_, C));
              break e;
            }
          }
          d = _ = _u(_, C), Ln !== 4 && (Ln = 2), zs === null ? zs = [d] : zs.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var L = Iv(d, _, r);
                Fv(d, L);
                break e;
              case 1:
                C = _;
                var D = d.type, z = d.stateNode;
                if (!(d.flags & 128) && (typeof D.getDerivedStateFromError == "function" || z !== null && typeof z.componentDidCatch == "function" && (Ul === null || !Ul.has(z)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var se = jd(d, C, r);
                  Fv(d, se);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        uh(l);
      } catch (Ye) {
        r = Ye, Bn === l && l !== null && (Bn = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ah() {
    var n = zl.current;
    return zl.current = Tu, n === null ? Tu : n;
  }
  function Gd() {
    (Ln === 0 || Ln === 3 || Ln === 2) && (Ln = 4), Kn === null || !(Oi & 268435455) && !(xo & 268435455) || li(Kn, fr);
  }
  function sf(n, r) {
    var l = Mt;
    Mt |= 2;
    var o = ah();
    (Kn !== n || fr !== r) && (ga = null, el(n, r));
    do
      try {
        gy();
        break;
      } catch (c) {
        rh(n, c);
      }
    while (!0);
    if (Cd(), Mt = l, zl.current = o, Bn !== null) throw Error(x(261));
    return Kn = null, fr = 0, Ln;
  }
  function gy() {
    for (; Bn !== null; ) lh(Bn);
  }
  function ih() {
    for (; Bn !== null && !Ga(); ) lh(Bn);
  }
  function lh(n) {
    var r = fh(n.alternate, n, ya);
    n.memoizedProps = n.pendingProps, r === null ? uh(n) : Bn = r, Du.current = null;
  }
  function uh(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = nf(l, r), l !== null) {
          l.flags &= 32767, Bn = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          Ln = 6, Bn = null;
          return;
        }
      } else if (l = Xv(l, r, ya), l !== null) {
        Bn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        Bn = r;
        return;
      }
      Bn = r = n;
    } while (r !== null);
    Ln === 0 && (Ln = 5);
  }
  function Mu(n, r, l) {
    var o = Pt, c = cr.transition;
    try {
      cr.transition = null, Pt = 1, Sy(n, r, l, o);
    } finally {
      cr.transition = c, Pt = o;
    }
    return null;
  }
  function Sy(n, r, l, o) {
    do
      _o();
    while (Zi !== null);
    if (Mt & 6) throw Error(x(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(x(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (qf(n, d), n === Kn && (Bn = Kn = null, fr = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || uf || (uf = !0, dh(ru, function() {
      return _o(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = cr.transition, cr.transition = null;
      var m = Pt;
      Pt = 1;
      var C = Mt;
      Mt |= 4, Du.current = null, Zv(n, l), Vd(l, n), uo(pu), _a = !!ls, pu = ls = null, n.current = l, hy(l), qa(), Mt = C, Pt = m, cr.transition = d;
    } else n.current = l;
    if (uf && (uf = !1, Zi = n, Us = c), d = n.pendingLanes, d === 0 && (Ul = null), Qo(l.stateNode), ra(n, gt()), r !== null) for (o = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (Ro) throw Ro = !1, n = Ou, Ou = null, n;
    return Us & 1 && n.tag !== 0 && _o(), d = n.pendingLanes, d & 1 ? n === To ? Fl++ : (Fl = 0, To = n) : Fl = 0, xi(), null;
  }
  function _o() {
    if (Zi !== null) {
      var n = Zu(Us), r = cr.transition, l = Pt;
      try {
        if (cr.transition = null, Pt = 16 > n ? 16 : n, Zi === null) var o = !1;
        else {
          if (n = Zi, Zi = null, Us = 0, Mt & 6) throw Error(x(331));
          var c = Mt;
          for (Mt |= 4, Pe = n.current; Pe !== null; ) {
            var d = Pe, m = d.child;
            if (Pe.flags & 16) {
              var C = d.deletions;
              if (C !== null) {
                for (var _ = 0; _ < C.length; _++) {
                  var V = C[_];
                  for (Pe = V; Pe !== null; ) {
                    var oe = Pe;
                    switch (oe.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ns(8, oe, d);
                    }
                    var pe = oe.child;
                    if (pe !== null) pe.return = oe, Pe = pe;
                    else for (; Pe !== null; ) {
                      oe = Pe;
                      var ue = oe.sibling, je = oe.return;
                      if (af(oe), oe === V) {
                        Pe = null;
                        break;
                      }
                      if (ue !== null) {
                        ue.return = je, Pe = ue;
                        break;
                      }
                      Pe = je;
                    }
                  }
                }
                var Ie = d.alternate;
                if (Ie !== null) {
                  var Ge = Ie.child;
                  if (Ge !== null) {
                    Ie.child = null;
                    do {
                      var Mn = Ge.sibling;
                      Ge.sibling = null, Ge = Mn;
                    } while (Ge !== null);
                  }
                }
                Pe = d;
              }
            }
            if (d.subtreeFlags & 2064 && m !== null) m.return = d, Pe = m;
            else e: for (; Pe !== null; ) {
              if (d = Pe, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  Ns(9, d, d.return);
              }
              var L = d.sibling;
              if (L !== null) {
                L.return = d.return, Pe = L;
                break e;
              }
              Pe = d.return;
            }
          }
          var D = n.current;
          for (Pe = D; Pe !== null; ) {
            m = Pe;
            var z = m.child;
            if (m.subtreeFlags & 2064 && z !== null) z.return = m, Pe = z;
            else e: for (m = D; Pe !== null; ) {
              if (C = Pe, C.flags & 2048) try {
                switch (C.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ls(9, C);
                }
              } catch (Ye) {
                mn(C, C.return, Ye);
              }
              if (C === m) {
                Pe = null;
                break e;
              }
              var se = C.sibling;
              if (se !== null) {
                se.return = C.return, Pe = se;
                break e;
              }
              Pe = C.return;
            }
          }
          if (Mt = c, xi(), Qr && typeof Qr.onPostCommitFiberRoot == "function") try {
            Qr.onPostCommitFiberRoot(ml, n);
          } catch {
          }
          o = !0;
        }
        return o;
      } finally {
        Pt = l, cr.transition = r;
      }
    }
    return !1;
  }
  function oh(n, r, l) {
    r = _u(l, r), r = Iv(n, r, 1), n = Ll(n, r, 1), r = In(), n !== null && (Hi(n, 1, r), ra(n, r));
  }
  function mn(n, r, l) {
    if (n.tag === 3) oh(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        oh(r, n, l);
        break;
      } else if (r.tag === 1) {
        var o = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (Ul === null || !Ul.has(o))) {
          n = _u(l, n), n = jd(r, n, 1), r = Ll(r, n, 1), n = In(), r !== null && (Hi(r, 1, n), ra(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function Ey(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = In(), n.pingedLanes |= n.suspendedLanes & l, Kn === n && (fr & l) === l && (Ln === 4 || Ln === 3 && (fr & 130023424) === fr && 500 > gt() - Yd ? el(n, 0) : lf |= l), ra(n, r);
  }
  function sh(n, r) {
    r === 0 && (n.mode & 1 ? (r = da, da <<= 1, !(da & 130023424) && (da = 4194304)) : r = 1);
    var l = In();
    n = ha(n, r), n !== null && (Hi(n, r, l), ra(n, l));
  }
  function Cy(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), sh(n, l);
  }
  function ch(n, r) {
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
    o !== null && o.delete(r), sh(n, l);
  }
  var fh;
  fh = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Gn.current) Hn = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return Hn = !1, ks(n, r, l);
      Hn = !!(n.flags & 131072);
    }
    else Hn = !1, hn && r.flags & 1048576 && jv(r, Gi, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        ja(n, r), n = r.pendingProps;
        var c = qr(r, Rn.current);
        Cn(r, l), c = Ml(null, r, o, n, c, l);
        var d = ri();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Un(o) ? (d = !0, er(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, Td(r), c.updater = Xc, r.stateNode = c, c._reactInternals = r, xs(r, o, n, l), r = Ts(null, r, o, !0, d, l)) : (r.tag = 0, hn && d && _c(r), sr(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (ja(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = xy(o), n = ai(o, n), c) {
            case 0:
              r = $v(null, r, o, n, l);
              break e;
            case 1:
              r = Qv(null, r, o, n, l);
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
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), $v(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), Qv(n, r, o, c, l);
      case 3:
        e: {
          if (Eo(r), n === null) throw Error(x(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, Uv(n, r), fs(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated) if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = _u(Error(x(423)), r), r = Wv(n, r, o, l, c);
            break e;
          } else if (o !== c) {
            c = _u(Error(x(424)), r), r = Wv(n, r, o, l, c);
            break e;
          } else for (Xr = Ei(r.stateNode.containerInfo.firstChild), Kr = r, hn = !0, La = null, l = Oe(r, null, o, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Nl(), o === c) {
              r = Aa(n, r, l);
              break e;
            }
            sr(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Pv(r), n === null && Sd(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, wc(o, c) ? m = null : d !== null && wc(o, d) && (r.flags |= 32), zd(n, r), sr(n, r, m, l), r.child;
      case 6:
        return n === null && Sd(r), null;
      case 13:
        return tf(n, r, l);
      case 4:
        return kd(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = Dn(r, null, o, l) : sr(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), ea(n, r, o, c, l);
      case 7:
        return sr(n, r, r.pendingProps, l), r.child;
      case 8:
        return sr(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return sr(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, Xe(va, o._currentValue), o._currentValue = m, d !== null) if (ti(d.value, m)) {
            if (d.children === c.children && !Gn.current) {
              r = Aa(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var C = d.dependencies;
            if (C !== null) {
              m = d.child;
              for (var _ = C.firstContext; _ !== null; ) {
                if (_.context === o) {
                  if (d.tag === 1) {
                    _ = Ki(-1, l & -l), _.tag = 2;
                    var V = d.updateQueue;
                    if (V !== null) {
                      V = V.shared;
                      var oe = V.pending;
                      oe === null ? _.next = _ : (_.next = oe.next, oe.next = _), V.pending = _;
                    }
                  }
                  d.lanes |= l, _ = d.alternate, _ !== null && (_.lanes |= l), xd(
                    d.return,
                    l,
                    r
                  ), C.lanes |= l;
                  break;
                }
                _ = _.next;
              }
            } else if (d.tag === 10) m = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (m = d.return, m === null) throw Error(x(341));
              m.lanes |= l, C = m.alternate, C !== null && (C.lanes |= l), xd(m, l, r), m = d.sibling;
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
          sr(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, Cn(r, l), c = Ma(c), o = o(c), r.flags |= 1, sr(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ai(o, r.pendingProps), c = ai(o.type, c), ku(n, r, o, c, l);
      case 15:
        return St(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ai(o, c), ja(n, r), r.tag = 1, Un(o) ? (n = !0, er(r)) : n = !1, Cn(r, l), Jc(r, o, c), xs(r, o, c, l), Ts(null, r, o, !0, n, l);
      case 19:
        return _i(n, r, l);
      case 22:
        return Rs(n, r, l);
    }
    throw Error(x(156, r.tag));
  };
  function dh(n, r) {
    return dn(n, r);
  }
  function wy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ua(n, r, l, o) {
    return new wy(n, r, l, o);
  }
  function qd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function xy(n) {
    if (typeof n == "function") return qd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === tt) return 11;
      if (n === Ct) return 14;
    }
    return 2;
  }
  function Pl(n, r) {
    var l = n.alternate;
    return l === null ? (l = Ua(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Hs(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function") qd(n) && (m = 1);
    else if (typeof n == "string") m = 5;
    else e: switch (n) {
      case P:
        return tl(l.children, c, d, r);
      case de:
        m = 8, c |= 8;
        break;
      case ie:
        return n = Ua(12, l, r, c | 2), n.elementType = ie, n.lanes = d, n;
      case Ce:
        return n = Ua(13, l, r, c), n.elementType = Ce, n.lanes = d, n;
      case kt:
        return n = Ua(19, l, r, c), n.elementType = kt, n.lanes = d, n;
      case Ve:
        return Hl(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Te:
            m = 10;
            break e;
          case He:
            m = 9;
            break e;
          case tt:
            m = 11;
            break e;
          case Ct:
            m = 14;
            break e;
          case Dt:
            m = 16, o = null;
            break e;
        }
        throw Error(x(130, n == null ? n : typeof n, ""));
    }
    return r = Ua(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function tl(n, r, l, o) {
    return n = Ua(7, n, o, r), n.lanes = l, n;
  }
  function Hl(n, r, l, o) {
    return n = Ua(22, n, o, r), n.elementType = Ve, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Kd(n, r, l) {
    return n = Ua(6, n, null, r), n.lanes = l, n;
  }
  function cf(n, r, l) {
    return r = Ua(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function ph(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Ju(0), this.expirationTimes = Ju(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ju(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function ff(n, r, l, o, c, d, m, C, _) {
    return n = new ph(n, r, l, C, _), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = Ua(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Td(d), n;
  }
  function by(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Se, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function Xd(n) {
    if (!n) return xr;
    n = n._reactInternals;
    e: {
      if (yt(n) !== n || n.tag !== 1) throw Error(x(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (Un(r.type)) {
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
      if (Un(l)) return ss(n, l, r);
    }
    return r;
  }
  function vh(n, r, l, o, c, d, m, C, _) {
    return n = ff(l, o, !0, n, c, d, m, C, _), n.context = Xd(null), l = n.current, o = In(), c = Ni(l), d = Ki(o, c), d.callback = r ?? null, Ll(l, d, c), n.current.lanes = c, Hi(n, c, o), ra(n, o), n;
  }
  function df(n, r, l, o) {
    var c = r.current, d = In(), m = Ni(c);
    return l = Xd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ki(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = Ll(c, r, m), n !== null && (Ar(n, c, m, d), Nc(n, c, m)), m;
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
  function Jd(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function vf(n, r) {
    Jd(n, r), (n = n.alternate) && Jd(n, r);
  }
  function hh() {
    return null;
  }
  var ju = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Zd(n) {
    this._internalRoot = n;
  }
  hf.prototype.render = Zd.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(x(409));
    df(n, r, null, null);
  }, hf.prototype.unmount = Zd.prototype.unmount = function() {
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
      var r = pt();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < Wn.length && r !== 0 && r < Wn[l].priority; l++) ;
      Wn.splice(l, 0, n), l === 0 && qo(n);
    }
  };
  function ep(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function mf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function mh() {
  }
  function Ry(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var V = pf(m);
          d.call(V);
        };
      }
      var m = vh(r, o, n, 0, null, !1, !1, "", mh);
      return n._reactRootContainer = m, n[Qi] = m.current, so(n.nodeType === 8 ? n.parentNode : n), Lu(), m;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof o == "function") {
      var C = o;
      o = function() {
        var V = pf(_);
        C.call(V);
      };
    }
    var _ = ff(n, 0, !1, null, null, !1, !1, "", mh);
    return n._reactRootContainer = _, n[Qi] = _.current, so(n.nodeType === 8 ? n.parentNode : n), Lu(function() {
      df(r, _, l, o);
    }), _;
  }
  function Vs(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var C = c;
        c = function() {
          var _ = pf(m);
          C.call(_);
        };
      }
      df(r, m, n, c);
    } else m = Ry(l, r, n, c, o);
    return pf(m);
  }
  zt = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Xa(r.pendingLanes);
          l !== 0 && (Vi(r, l | 1), ra(r, gt()), !(Mt & 6) && (bo = gt() + 500, xi()));
        }
        break;
      case 13:
        Lu(function() {
          var o = ha(n, 1);
          if (o !== null) {
            var c = In();
            Ar(o, n, 1, c);
          }
        }), vf(n, 1);
    }
  }, Wo = function(n) {
    if (n.tag === 13) {
      var r = ha(n, 134217728);
      if (r !== null) {
        var l = In();
        Ar(r, n, 134217728, l);
      }
      vf(n, 134217728);
    }
  }, hi = function(n) {
    if (n.tag === 13) {
      var r = Ni(n), l = ha(n, r);
      if (l !== null) {
        var o = In();
        Ar(l, n, r, o);
      }
      vf(n, r);
    }
  }, pt = function() {
    return Pt;
  }, eo = function(n, r) {
    var l = Pt;
    try {
      return Pt = n, r();
    } finally {
      Pt = l;
    }
  }, Kt = function(n, r, l) {
    switch (r) {
      case "input":
        if ($r(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = En(o);
              if (!c) throw Error(x(90));
              yn(o), $r(o, c);
            }
          }
        }
        break;
      case "textarea":
        $a(n, l);
        break;
      case "select":
        r = l.value, r != null && _n(n, !!l.multiple, r, !1);
    }
  }, eu = Qd, pl = Lu;
  var Ty = { usingClientEntryPoint: !1, Events: [Je, ni, En, Pi, Zl, Qd] }, Bs = { findFiberByHostInstance: vu, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, yh = { bundleType: Bs.bundleType, version: Bs.version, rendererPackageName: Bs.rendererPackageName, rendererConfig: Bs.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Le.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = kn(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Bs.findFiberByHostInstance || hh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Vl.isDisabled && Vl.supportsFiber) try {
      ml = Vl.inject(yh), Qr = Vl;
    } catch {
    }
  }
  return Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ty, Ia.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ep(r)) throw Error(x(200));
    return by(n, r, null, l);
  }, Ia.createRoot = function(n, r) {
    if (!ep(n)) throw Error(x(299));
    var l = !1, o = "", c = ju;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = ff(n, 1, !1, null, null, l, !1, o, c), n[Qi] = r.current, so(n.nodeType === 8 ? n.parentNode : n), new Zd(r);
  }, Ia.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(x(188)) : (n = Object.keys(n).join(","), Error(x(268, n)));
    return n = kn(r), n = n === null ? null : n.stateNode, n;
  }, Ia.flushSync = function(n) {
    return Lu(n);
  }, Ia.hydrate = function(n, r, l) {
    if (!mf(r)) throw Error(x(200));
    return Vs(null, n, r, !0, l);
  }, Ia.hydrateRoot = function(n, r, l) {
    if (!ep(n)) throw Error(x(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = ju;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = vh(r, null, n, 1, l ?? null, c, !1, d, m), n[Qi] = r.current, so(n), o) for (n = 0; n < o.length; n++) l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new hf(r);
  }, Ia.render = function(n, r, l) {
    if (!mf(r)) throw Error(x(200));
    return Vs(null, n, r, !1, l);
  }, Ia.unmountComponentAtNode = function(n) {
    if (!mf(n)) throw Error(x(40));
    return n._reactRootContainer ? (Lu(function() {
      Vs(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Qi] = null;
      });
    }), !0) : !1;
  }, Ia.unstable_batchedUpdates = Qd, Ia.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!mf(l)) throw Error(x(200));
    if (n == null || n._reactInternals === void 0) throw Error(x(38));
    return Vs(n, r, l, !1, o);
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
var px;
function pk() {
  return px || (px = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var T = Y, w = mx(), x = T.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Z = !1;
    function J(e) {
      Z = e;
    }
    function A(e) {
      if (!Z) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        re("warn", e, a);
      }
    }
    function g(e) {
      if (!Z) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        re("error", e, a);
      }
    }
    function re(e, t, a) {
      {
        var i = x.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var U = 0, Q = 1, Re = 2, I = 3, ee = 4, te = 5, ne = 6, K = 7, Ee = 8, Ue = 9, ce = 10, ge = 11, Le = 12, he = 13, Se = 14, P = 15, de = 16, ie = 17, Te = 18, He = 19, tt = 21, Ce = 22, kt = 23, Ct = 24, Dt = 25, Ve = !0, me = !1, Qe = !1, we = !1, N = !1, q = !0, nt = !0, et = !0, be = !0, We = /* @__PURE__ */ new Set(), fe = {}, Fe = {};
    function rt(e, t) {
      dt(e, t), dt(e + "Capture", t);
    }
    function dt(e, t) {
      fe[e] && g("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), fe[e] = t;
      {
        var a = e.toLowerCase();
        Fe[a] = e, e === "onDoubleClick" && (Fe.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        We.add(t[i]);
    }
    var $t = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", yn = Object.prototype.hasOwnProperty;
    function cn(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function bn(e) {
      try {
        return Tn(e), !1;
      } catch {
        return !0;
      }
    }
    function Tn(e) {
      return "" + e;
    }
    function $n(e, t) {
      if (bn(e))
        return g("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, cn(e)), Tn(e);
    }
    function $r(e) {
      if (bn(e))
        return g("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", cn(e)), Tn(e);
    }
    function ci(e, t) {
      if (bn(e))
        return g("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, cn(e)), Tn(e);
    }
    function sa(e, t) {
      if (bn(e))
        return g("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, cn(e)), Tn(e);
    }
    function Jn(e) {
      if (bn(e))
        return g("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", cn(e)), Tn(e);
    }
    function _n(e) {
      if (bn(e))
        return g("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", cn(e)), Tn(e);
    }
    var Qn = 0, Er = 1, $a = 2, An = 3, Cr = 4, ca = 5, Qa = 6, fi = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", xe = fi + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", qe = new RegExp("^[" + fi + "][" + xe + "]*$"), wt = {}, Qt = {};
    function an(e) {
      return yn.call(Qt, e) ? !0 : yn.call(wt, e) ? !1 : qe.test(e) ? (Qt[e] = !0, !0) : (wt[e] = !0, g("Invalid attribute name: `%s`", e), !1);
    }
    function gn(e, t, a) {
      return t !== null ? t.type === Qn : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function fn(e, t, a, i) {
      if (a !== null && a.type === Qn)
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
    function Zn(e, t, a, i) {
      if (t === null || typeof t > "u" || fn(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case An:
            return !t;
          case Cr:
            return t === !1;
          case ca:
            return isNaN(t);
          case Qa:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function ln(e) {
      return Kt.hasOwnProperty(e) ? Kt[e] : null;
    }
    function qt(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === $a || t === An || t === Cr, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var Kt = {}, fa = [
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
      Kt[e] = new qt(
        e,
        Qn,
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
      Kt[t] = new qt(
        t,
        Er,
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
      Kt[e] = new qt(
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
      Kt[e] = new qt(
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
      Kt[e] = new qt(
        e,
        An,
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
      Kt[e] = new qt(
        e,
        An,
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
      Kt[e] = new qt(
        e,
        Cr,
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
      Kt[e] = new qt(
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
      Kt[e] = new qt(
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
    var wr = /[\-\:]([a-z])/g, ba = function(e) {
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
      var t = e.replace(wr, ba);
      Kt[t] = new qt(
        t,
        Er,
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
      var t = e.replace(wr, ba);
      Kt[t] = new qt(
        t,
        Er,
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
      var t = e.replace(wr, ba);
      Kt[t] = new qt(
        t,
        Er,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Kt[e] = new qt(
        e,
        Er,
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
    Kt[Pi] = new qt(
      "xlinkHref",
      Er,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Kt[e] = new qt(
        e,
        Er,
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
        $n(a, t), i.sanitizeURL && pl("" + a);
        var s = i.attributeName, f = null;
        if (i.type === Cr) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : Zn(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (Zn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === An)
            return a;
          f = e.getAttribute(s);
        }
        return Zn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function tu(e, t, a, i) {
      {
        if (!an(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return $n(a, t), u === "" + a ? a : u;
      }
    }
    function _r(e, t, a, i) {
      var u = ln(t);
      if (!gn(t, u, i)) {
        if (Zn(t, a, u, i) && (a = null), i || u === null) {
          if (an(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : ($n(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = u.mustUseProperty;
        if (f) {
          var p = u.propertyName;
          if (a === null) {
            var v = u.type;
            e[p] = v === An ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var y = u.attributeName, S = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(y);
        else {
          var O = u.type, k;
          O === An || O === Cr && a === !0 ? k = "" : ($n(a, y), k = "" + a, u.sanitizeURL && pl(k.toString())), S ? e.setAttributeNS(S, y, k) : e.setAttribute(y, k);
        }
      }
    }
    var kr = Symbol.for("react.element"), ir = Symbol.for("react.portal"), di = Symbol.for("react.fragment"), Wa = Symbol.for("react.strict_mode"), pi = Symbol.for("react.profiler"), vi = Symbol.for("react.provider"), R = Symbol.for("react.context"), ae = Symbol.for("react.forward_ref"), De = Symbol.for("react.suspense"), Be = Symbol.for("react.suspense_list"), yt = Symbol.for("react.memo"), vt = Symbol.for("react.lazy"), Tt = Symbol.for("react.scope"), bt = Symbol.for("react.debug_trace_mode"), kn = Symbol.for("react.offscreen"), un = Symbol.for("react.legacy_hidden"), dn = Symbol.for("react.cache"), lr = Symbol.for("react.tracing_marker"), Ga = Symbol.iterator, qa = "@@iterator";
    function gt(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ga && e[Ga] || e[qa];
      return typeof t == "function" ? t : null;
    }
    var Et = Object.assign, Ka = 0, nu, ru, hl, Gu, ml, Qr, Qo;
    function Dr() {
    }
    Dr.__reactDisabledLog = !0;
    function uc() {
      {
        if (Ka === 0) {
          nu = console.log, ru = console.info, hl = console.warn, Gu = console.error, ml = console.group, Qr = console.groupCollapsed, Qo = console.groupEnd;
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
            log: Et({}, e, {
              value: nu
            }),
            info: Et({}, e, {
              value: ru
            }),
            warn: Et({}, e, {
              value: hl
            }),
            error: Et({}, e, {
              value: Gu
            }),
            group: Et({}, e, {
              value: ml
            }),
            groupCollapsed: Et({}, e, {
              value: Qr
            }),
            groupEnd: Et({}, e, {
              value: Qo
            })
          });
        }
        Ka < 0 && g("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var qu = x.ReactCurrentDispatcher, yl;
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
      var Ku = typeof WeakMap == "function" ? WeakMap : Map;
      Ja = new Ku();
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
      s = qu.current, qu.current = null, uc();
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
            } catch (B) {
              i = B;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (B) {
              i = B;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (B) {
            i = B;
          }
          e();
        }
      } catch (B) {
        if (B && i && typeof B.stack == "string") {
          for (var p = B.stack.split(`
`), v = i.stack.split(`
`), y = p.length - 1, S = v.length - 1; y >= 1 && S >= 0 && p[y] !== v[S]; )
            S--;
          for (; y >= 1 && S >= 0; y--, S--)
            if (p[y] !== v[S]) {
              if (y !== 1 || S !== 1)
                do
                  if (y--, S--, S < 0 || p[y] !== v[S]) {
                    var O = `
` + p[y].replace(" at new ", " at ");
                    return e.displayName && O.includes("<anonymous>") && (O = O.replace("<anonymous>", e.displayName)), typeof e == "function" && Ja.set(e, O), O;
                  }
                while (y >= 1 && S >= 0);
              break;
            }
        }
      } finally {
        Xa = !1, qu.current = s, oc(), Error.prepareStackTrace = u;
      }
      var k = e ? e.displayName || e.name : "", F = k ? da(k) : "";
      return typeof e == "function" && Ja.set(e, F), F;
    }
    function gl(e, t, a) {
      return au(e, !0);
    }
    function Xu(e, t, a) {
      return au(e, !1);
    }
    function Ju(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Hi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return au(e, Ju(e));
      if (typeof e == "string")
        return da(e);
      switch (e) {
        case De:
          return da("Suspense");
        case Be:
          return da("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ae:
            return Xu(e.render);
          case yt:
            return Hi(e.type, t, a);
          case vt: {
            var i = e, u = i._payload, s = i._init;
            try {
              return Hi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function qf(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case te:
          return da(e.type);
        case de:
          return da("Lazy");
        case he:
          return da("Suspense");
        case He:
          return da("SuspenseList");
        case U:
        case Re:
        case P:
          return Xu(e.type);
        case ge:
          return Xu(e.type.render);
        case Q:
          return gl(e.type);
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
    function Pt(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Zu(e) {
      return e.displayName || "Context";
    }
    function zt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && g("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case di:
          return "Fragment";
        case ir:
          return "Portal";
        case pi:
          return "Profiler";
        case Wa:
          return "StrictMode";
        case De:
          return "Suspense";
        case Be:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case R:
            var t = e;
            return Zu(t) + ".Consumer";
          case vi:
            var a = e;
            return Zu(a._context) + ".Provider";
          case ae:
            return Pt(e, e.render, "ForwardRef");
          case yt:
            var i = e.displayName || null;
            return i !== null ? i : zt(e.type) || "Memo";
          case vt: {
            var u = e, s = u._payload, f = u._init;
            try {
              return zt(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Wo(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function hi(e) {
      return e.displayName || "Context";
    }
    function pt(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case Ct:
          return "Cache";
        case Ue:
          var i = a;
          return hi(i) + ".Consumer";
        case ce:
          var u = a;
          return hi(u._context) + ".Provider";
        case Te:
          return "DehydratedFragment";
        case ge:
          return Wo(a, a.render, "ForwardRef");
        case K:
          return "Fragment";
        case te:
          return a;
        case ee:
          return "Portal";
        case I:
          return "Root";
        case ne:
          return "Text";
        case de:
          return zt(a);
        case Ee:
          return a === Wa ? "StrictMode" : "Mode";
        case Ce:
          return "Offscreen";
        case Le:
          return "Profiler";
        case tt:
          return "Scope";
        case he:
          return "Suspense";
        case He:
          return "SuspenseList";
        case Dt:
          return "TracingMarker";
        case Q:
        case U:
        case ie:
        case Re:
        case Se:
        case P:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var eo = x.ReactDebugCurrentFrame, ur = null, mi = !1;
    function Or() {
      {
        if (ur === null)
          return null;
        var e = ur._debugOwner;
        if (e !== null && typeof e < "u")
          return pt(e);
      }
      return null;
    }
    function yi() {
      return ur === null ? "" : Vi(ur);
    }
    function pn() {
      eo.getCurrentStack = null, ur = null, mi = !1;
    }
    function Xt(e) {
      eo.getCurrentStack = e === null ? null : yi, ur = e, mi = !1;
    }
    function Sl() {
      return ur;
    }
    function Wn(e) {
      mi = e;
    }
    function Nr(e) {
      return "" + e;
    }
    function Ra(e) {
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
    var iu = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Go(e, t) {
      iu[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || g("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || g("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function qo(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function El(e) {
      return e._valueTracker;
    }
    function lu(e) {
      e._valueTracker = null;
    }
    function Kf(e) {
      var t = "";
      return e && (qo(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Ta(e) {
      var t = qo(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      _n(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            _n(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            _n(p), i = "" + p;
          },
          stopTracking: function() {
            lu(e), delete e[t];
          }
        };
        return f;
      }
    }
    function Za(e) {
      El(e) || (e._valueTracker = Ta(e));
    }
    function gi(e) {
      if (!e)
        return !1;
      var t = El(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Kf(e);
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
    var to = !1, no = !1, Cl = !1, uu = !1;
    function ro(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function ao(e, t) {
      var a = e, i = t.checked, u = Et({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function ei(e, t) {
      Go("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !no && (g("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), no = !0), t.value !== void 0 && t.defaultValue !== void 0 && !to && (g("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component", t.type), to = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: Ra(t.value != null ? t.value : i),
        controlled: ro(t)
      };
    }
    function h(e, t) {
      var a = e, i = t.checked;
      i != null && _r(a, "checked", i, !1);
    }
    function b(e, t) {
      var a = e;
      {
        var i = ro(t);
        !a._wrapperState.controlled && i && !uu && (g("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), uu = !0), a._wrapperState.controlled && !i && !Cl && (g("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Cl = !0);
      }
      h(e, t);
      var u = Ra(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Nr(u)) : a.value !== Nr(u) && (a.value = Nr(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? at(a, t.type, u) : t.hasOwnProperty("defaultValue") && at(a, t.type, Ra(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function H(e, t, a) {
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
    function $(e, t) {
      var a = e;
      b(a, t), ye(a, t);
    }
    function ye(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        $n(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = Ah(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            gi(f), b(f, p);
          }
        }
      }
    }
    function at(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || _a(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Nr(e._wrapperState.initialValue) : e.defaultValue !== Nr(a) && (e.defaultValue = Nr(a)));
    }
    var ke = !1, ut = !1, _t = !1;
    function Ut(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? T.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || ut || (ut = !0, g("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (_t || (_t = !0, g("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !ke && (g("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), ke = !0);
    }
    function on(e, t) {
      t.value != null && e.setAttribute("value", Nr(Ra(t.value)));
    }
    var Jt = Array.isArray;
    function xt(e) {
      return Jt(e);
    }
    var Zt;
    Zt = !1;
    function Sn() {
      var e = Or();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var wl = ["value", "defaultValue"];
    function Ko(e) {
      {
        Go("select", e);
        for (var t = 0; t < wl.length; t++) {
          var a = wl[t];
          if (e[a] != null) {
            var i = xt(e[a]);
            e.multiple && !i ? g("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, Sn()) : !e.multiple && i && g("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, Sn());
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
        for (var S = Nr(Ra(a)), O = null, k = 0; k < u.length; k++) {
          if (u[k].value === S) {
            u[k].selected = !0, i && (u[k].defaultSelected = !0);
            return;
          }
          O === null && !u[k].disabled && (O = u[k]);
        }
        O !== null && (O.selected = !0);
      }
    }
    function Xo(e, t) {
      return Et({}, t, {
        value: void 0
      });
    }
    function ou(e, t) {
      var a = e;
      Ko(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Zt && (g("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Zt = !0);
    }
    function Xf(e, t) {
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
    function Jf(e, t) {
      var a = e, i = t.value;
      i != null && Bi(a, !!t.multiple, i, !1);
    }
    var av = !1;
    function Zf(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = Et({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Nr(a._wrapperState.initialValue)
      });
      return i;
    }
    function ed(e, t) {
      var a = e;
      Go("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !av && (g("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Or() || "A component"), av = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          g("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (xt(u)) {
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
        initialValue: Ra(i)
      };
    }
    function iv(e, t) {
      var a = e, i = Ra(t.value), u = Ra(t.defaultValue);
      if (i != null) {
        var s = Nr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Nr(u));
    }
    function lv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function ty(e, t) {
      iv(e, t);
    }
    var Ii = "http://www.w3.org/1999/xhtml", td = "http://www.w3.org/1998/Math/MathML", nd = "http://www.w3.org/2000/svg";
    function rd(e) {
      switch (e) {
        case "svg":
          return nd;
        case "math":
          return td;
        default:
          return Ii;
      }
    }
    function ad(e, t) {
      return e == null || e === Ii ? rd(t) : e === nd && t === "foreignObject" ? Ii : e;
    }
    var uv = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, cc, ov = uv(function(e, t) {
      if (e.namespaceURI === nd && !("innerHTML" in e)) {
        cc = cc || document.createElement("div"), cc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = cc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), Wr = 1, Yi = 3, zn = 8, $i = 9, id = 11, io = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Yi) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Jo = {
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
    }, Zo = {
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
    function sv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var cv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Zo).forEach(function(e) {
      cv.forEach(function(t) {
        Zo[sv(t, e)] = Zo[e];
      });
    });
    function fc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Zo.hasOwnProperty(e) && Zo[e]) ? t + "px" : (sa(t, e), ("" + t).trim());
    }
    var fv = /([A-Z])/g, dv = /^ms-/;
    function lo(e) {
      return e.replace(fv, "-$1").toLowerCase().replace(dv, "-ms-");
    }
    var pv = function() {
    };
    {
      var ny = /^(?:webkit|moz|o)[A-Z]/, ry = /^-ms-/, vv = /-(.)/g, ld = /;\s*$/, Si = {}, su = {}, hv = !1, es = !1, ay = function(e) {
        return e.replace(vv, function(t, a) {
          return a.toUpperCase();
        });
      }, mv = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          ay(e.replace(ry, "ms-"))
        ));
      }, ud = function(e) {
        Si.hasOwnProperty(e) && Si[e] || (Si[e] = !0, g("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, od = function(e, t) {
        su.hasOwnProperty(t) && su[t] || (su[t] = !0, g(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(ld, "")));
      }, yv = function(e, t) {
        hv || (hv = !0, g("`NaN` is an invalid value for the `%s` css style property.", e));
      }, gv = function(e, t) {
        es || (es = !0, g("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      pv = function(e, t) {
        e.indexOf("-") > -1 ? mv(e) : ny.test(e) ? ud(e) : ld.test(t) && od(e, t), typeof t == "number" && (isNaN(t) ? yv(e, t) : isFinite(t) || gv(e, t));
      };
    }
    var Sv = pv;
    function iy(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : lo(i)) + ":", t += fc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function Ev(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || Sv(i, t[i]);
          var s = fc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function ly(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Cv(e) {
      var t = {};
      for (var a in e)
        for (var i = Jo[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function uy(e, t) {
      {
        if (!t)
          return;
        var a = Cv(e), i = Cv(t), u = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (u[v])
              continue;
            u[v] = !0, g("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", ly(e[f]) ? "Removing" : "Updating", f, p);
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
    }, ts = Et({
      menuitem: !0
    }, ti), wv = "__html";
    function dc(e, t) {
      if (t) {
        if (ts[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(wv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && g("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function xl(e, t) {
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
    var ns = {
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
    }, uo = {}, oy = new RegExp("^(aria)-[" + xe + "]*$"), oo = new RegExp("^(aria)[A-Z][" + xe + "]*$");
    function sd(e, t) {
      {
        if (yn.call(uo, t) && uo[t])
          return !0;
        if (oo.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = pc.hasOwnProperty(a) ? a : null;
          if (i == null)
            return g("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), uo[t] = !0, !0;
          if (t !== i)
            return g("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), uo[t] = !0, !0;
        }
        if (oy.test(t)) {
          var u = t.toLowerCase(), s = pc.hasOwnProperty(u) ? u : null;
          if (s == null)
            return uo[t] = !0, !1;
          if (t !== s)
            return g("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), uo[t] = !0, !0;
        }
      }
      return !0;
    }
    function rs(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = sd(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? g("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && g("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function cd(e, t) {
      xl(e, t) || rs(e, t);
    }
    var fd = !1;
    function vc(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !fd && (fd = !0, e === "select" && t.multiple ? g("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : g("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var cu = function() {
    };
    {
      var or = {}, dd = /^on./, hc = /^on[^A-Z]/, xv = new RegExp("^(aria)-[" + xe + "]*$"), bv = new RegExp("^(aria)[A-Z][" + xe + "]*$");
      cu = function(e, t, a, i) {
        if (yn.call(or, t) && or[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return g("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), or[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(u) ? f[u] : null;
          if (p != null)
            return g("Invalid event handler property `%s`. Did you mean `%s`?", t, p), or[t] = !0, !0;
          if (dd.test(t))
            return g("Unknown event handler property `%s`. It will be ignored.", t), or[t] = !0, !0;
        } else if (dd.test(t))
          return hc.test(t) && g("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), or[t] = !0, !0;
        if (xv.test(t) || bv.test(t))
          return !0;
        if (u === "innerhtml")
          return g("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), or[t] = !0, !0;
        if (u === "aria")
          return g("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), or[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return g("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), or[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return g("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), or[t] = !0, !0;
        var v = ln(t), y = v !== null && v.type === Qn;
        if (ns.hasOwnProperty(u)) {
          var S = ns[u];
          if (S !== t)
            return g("Invalid DOM property `%s`. Did you mean `%s`?", t, S), or[t] = !0, !0;
        } else if (!y && t !== u)
          return g("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), or[t] = !0, !0;
        return typeof a == "boolean" && fn(t, a, v, !1) ? (a ? g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : g('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), or[t] = !0, !0) : y ? !0 : fn(t, a, v, !1) ? (or[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === An && (g("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), or[t] = !0), !0);
      };
    }
    var Rv = function(e, t, a) {
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
    function Tv(e, t, a) {
      xl(e, t) || Rv(e, t, a);
    }
    var pd = 1, mc = 2, ka = 4, vd = pd | mc | ka, fu = null;
    function sy(e) {
      fu !== null && g("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), fu = e;
    }
    function cy() {
      fu === null && g("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), fu = null;
    }
    function as(e) {
      return e === fu;
    }
    function hd(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Yi ? t.parentNode : t;
    }
    var yc = null, du = null, Wt = null;
    function gc(e) {
      var t = Oo(e);
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
    function so(e) {
      du ? Wt ? Wt.push(e) : Wt = [e] : du = e;
    }
    function _v() {
      return du !== null || Wt !== null;
    }
    function Ec() {
      if (du) {
        var e = du, t = Wt;
        if (du = null, Wt = null, gc(e), t)
          for (var a = 0; a < t.length; a++)
            gc(t[a]);
      }
    }
    var co = function(e, t) {
      return e(t);
    }, is = function() {
    }, bl = !1;
    function kv() {
      var e = _v();
      e && (is(), Ec());
    }
    function Dv(e, t, a) {
      if (bl)
        return e(t, a);
      bl = !0;
      try {
        return co(e, t, a);
      } finally {
        bl = !1, kv();
      }
    }
    function fy(e, t, a) {
      co = e, is = a;
    }
    function Ov(e) {
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
          return !!(a.disabled && Ov(t));
        default:
          return !1;
      }
    }
    function Rl(e, t) {
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
    var ls = !1;
    if ($t)
      try {
        var pu = {};
        Object.defineProperty(pu, "passive", {
          get: function() {
            ls = !0;
          }
        }), window.addEventListener("test", pu, pu), window.removeEventListener("test", pu, pu);
      } catch {
        ls = !1;
      }
    function wc(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (S) {
        this.onError(S);
      }
    }
    var xc = wc;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var md = document.createElement("react");
      xc = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var S = document.createEvent("Event"), O = !1, k = !0, F = window.event, B = Object.getOwnPropertyDescriptor(window, "event");
        function W() {
          md.removeEventListener(G, it, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = F);
        }
        var Ne = Array.prototype.slice.call(arguments, 3);
        function it() {
          O = !0, W(), a.apply(i, Ne), k = !1;
        }
        var Ke, At = !1, Ot = !1;
        function M(j) {
          if (Ke = j.error, At = !0, Ke === null && j.colno === 0 && j.lineno === 0 && (Ot = !0), j.defaultPrevented && Ke != null && typeof Ke == "object")
            try {
              Ke._suppressLogging = !0;
            } catch {
            }
        }
        var G = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", M), md.addEventListener(G, it, !1), S.initEvent(G, !1, !1), md.dispatchEvent(S), B && Object.defineProperty(window, "event", B), O && k && (At ? Ot && (Ke = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Ke = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Ke)), window.removeEventListener("error", M), !O)
          return W(), wc.apply(this, arguments);
      };
    }
    var Nv = xc, fo = !1, bc = null, po = !1, Ei = null, Lv = {
      onError: function(e) {
        fo = !0, bc = e;
      }
    };
    function Tl(e, t, a, i, u, s, f, p, v) {
      fo = !1, bc = null, Nv.apply(Lv, arguments);
    }
    function Ci(e, t, a, i, u, s, f, p, v) {
      if (Tl.apply(this, arguments), fo) {
        var y = os();
        po || (po = !0, Ei = y);
      }
    }
    function us() {
      if (po) {
        var e = Ei;
        throw po = !1, Ei = null, e;
      }
    }
    function Qi() {
      return fo;
    }
    function os() {
      if (fo) {
        var e = bc;
        return fo = !1, bc = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function vo(e) {
      return e._reactInternals;
    }
    function dy(e) {
      return e._reactInternals !== void 0;
    }
    function vu(e, t) {
      e._reactInternals = t;
    }
    var Je = (
      /*                      */
      0
    ), ni = (
      /*                */
      1
    ), En = (
      /*                    */
      2
    ), Lt = (
      /*                       */
      4
    ), Da = (
      /*                */
      16
    ), Oa = (
      /*                 */
      32
    ), sn = (
      /*                     */
      64
    ), Xe = (
      /*                   */
      128
    ), xr = (
      /*            */
      256
    ), Rn = (
      /*                          */
      512
    ), Gn = (
      /*                     */
      1024
    ), Gr = (
      /*                      */
      2048
    ), qr = (
      /*                    */
      4096
    ), Un = (
      /*                   */
      8192
    ), ho = (
      /*             */
      16384
    ), Mv = (
      /*               */
      32767
    ), ss = (
      /*                   */
      32768
    ), er = (
      /*                */
      65536
    ), Rc = (
      /* */
      131072
    ), wi = (
      /*                       */
      1048576
    ), mo = (
      /*                    */
      2097152
    ), Wi = (
      /*                 */
      4194304
    ), Tc = (
      /*                */
      8388608
    ), _l = (
      /*               */
      16777216
    ), xi = (
      /*              */
      33554432
    ), kl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Lt | Gn | 0
    ), Dl = En | Lt | Da | Oa | Rn | qr | Un, Ol = Lt | sn | Rn | Un, Gi = Gr | Da, Fn = Wi | Tc | mo, Na = x.ReactCurrentOwner;
    function pa(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (En | qr)) !== Je && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === I ? a : null;
    }
    function bi(e) {
      if (e.tag === he) {
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
      return e.tag === I ? e.stateNode.containerInfo : null;
    }
    function hu(e) {
      return pa(e) === e;
    }
    function jv(e) {
      {
        var t = Na.current;
        if (t !== null && t.tag === Q) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || g("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", pt(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = vo(e);
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
      if (i.tag !== I)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Kr(e) {
      var t = kc(e);
      return t !== null ? Xr(t) : null;
    }
    function Xr(e) {
      if (e.tag === te || e.tag === ne)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = Xr(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function hn(e) {
      var t = kc(e);
      return t !== null ? La(t) : null;
    }
    function La(e) {
      if (e.tag === te || e.tag === ne)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== ee) {
          var a = La(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var yd = w.unstable_scheduleCallback, Av = w.unstable_cancelCallback, gd = w.unstable_shouldYield, Sd = w.unstable_requestPaint, qn = w.unstable_now, Dc = w.unstable_getCurrentPriorityLevel, cs = w.unstable_ImmediatePriority, Nl = w.unstable_UserBlockingPriority, qi = w.unstable_NormalPriority, py = w.unstable_LowPriority, mu = w.unstable_IdlePriority, Oc = w.unstable_yieldValue, zv = w.unstable_setDisableYieldValue, yu = null, Dn = null, Oe = null, va = !1, Jr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function yo(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return g("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        nt && (e = Et({}, e, {
          getLaneLabelMap: gu,
          injectProfilingHooks: Ma
        })), yu = t.inject(e), Dn = t;
      } catch (a) {
        g("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Ed(e, t) {
      if (Dn && typeof Dn.onScheduleFiberRoot == "function")
        try {
          Dn.onScheduleFiberRoot(yu, e, t);
        } catch (a) {
          va || (va = !0, g("React instrumentation encountered an error: %s", a));
        }
    }
    function Cd(e, t) {
      if (Dn && typeof Dn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & Xe) === Xe;
          if (et) {
            var i;
            switch (t) {
              case Lr:
                i = cs;
                break;
              case _i:
                i = Nl;
                break;
              case ja:
                i = qi;
                break;
              case Aa:
                i = mu;
                break;
              default:
                i = qi;
                break;
            }
            Dn.onCommitFiberRoot(yu, e, i, a);
          }
        } catch (u) {
          va || (va = !0, g("React instrumentation encountered an error: %s", u));
        }
    }
    function wd(e) {
      if (Dn && typeof Dn.onPostCommitFiberRoot == "function")
        try {
          Dn.onPostCommitFiberRoot(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function xd(e) {
      if (Dn && typeof Dn.onCommitFiberUnmount == "function")
        try {
          Dn.onCommitFiberUnmount(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Cn(e) {
      if (typeof Oc == "function" && (zv(e), J(e)), Dn && typeof Dn.setStrictMode == "function")
        try {
          Dn.setStrictMode(yu, e);
        } catch (t) {
          va || (va = !0, g("React instrumentation encountered an error: %s", t));
        }
    }
    function Ma(e) {
      Oe = e;
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
    function bd(e) {
      Oe !== null && typeof Oe.markCommitStarted == "function" && Oe.markCommitStarted(e);
    }
    function Rd() {
      Oe !== null && typeof Oe.markCommitStopped == "function" && Oe.markCommitStopped();
    }
    function ha(e) {
      Oe !== null && typeof Oe.markComponentRenderStarted == "function" && Oe.markComponentRenderStarted(e);
    }
    function ma() {
      Oe !== null && typeof Oe.markComponentRenderStopped == "function" && Oe.markComponentRenderStopped();
    }
    function Td(e) {
      Oe !== null && typeof Oe.markComponentPassiveEffectMountStarted == "function" && Oe.markComponentPassiveEffectMountStarted(e);
    }
    function Uv() {
      Oe !== null && typeof Oe.markComponentPassiveEffectMountStopped == "function" && Oe.markComponentPassiveEffectMountStopped();
    }
    function Ki(e) {
      Oe !== null && typeof Oe.markComponentPassiveEffectUnmountStarted == "function" && Oe.markComponentPassiveEffectUnmountStarted(e);
    }
    function Ll() {
      Oe !== null && typeof Oe.markComponentPassiveEffectUnmountStopped == "function" && Oe.markComponentPassiveEffectUnmountStopped();
    }
    function Nc(e) {
      Oe !== null && typeof Oe.markComponentLayoutEffectMountStarted == "function" && Oe.markComponentLayoutEffectMountStarted(e);
    }
    function Fv() {
      Oe !== null && typeof Oe.markComponentLayoutEffectMountStopped == "function" && Oe.markComponentLayoutEffectMountStopped();
    }
    function fs(e) {
      Oe !== null && typeof Oe.markComponentLayoutEffectUnmountStarted == "function" && Oe.markComponentLayoutEffectUnmountStarted(e);
    }
    function _d() {
      Oe !== null && typeof Oe.markComponentLayoutEffectUnmountStopped == "function" && Oe.markComponentLayoutEffectUnmountStopped();
    }
    function ds(e, t, a) {
      Oe !== null && typeof Oe.markComponentErrored == "function" && Oe.markComponentErrored(e, t, a);
    }
    function Ti(e, t, a) {
      Oe !== null && typeof Oe.markComponentSuspended == "function" && Oe.markComponentSuspended(e, t, a);
    }
    function ps(e) {
      Oe !== null && typeof Oe.markLayoutEffectsStarted == "function" && Oe.markLayoutEffectsStarted(e);
    }
    function vs() {
      Oe !== null && typeof Oe.markLayoutEffectsStopped == "function" && Oe.markLayoutEffectsStopped();
    }
    function Su(e) {
      Oe !== null && typeof Oe.markPassiveEffectsStarted == "function" && Oe.markPassiveEffectsStarted(e);
    }
    function kd() {
      Oe !== null && typeof Oe.markPassiveEffectsStopped == "function" && Oe.markPassiveEffectsStopped();
    }
    function Eu(e) {
      Oe !== null && typeof Oe.markRenderStarted == "function" && Oe.markRenderStarted(e);
    }
    function Pv() {
      Oe !== null && typeof Oe.markRenderYielded == "function" && Oe.markRenderYielded();
    }
    function Lc() {
      Oe !== null && typeof Oe.markRenderStopped == "function" && Oe.markRenderStopped();
    }
    function wn(e) {
      Oe !== null && typeof Oe.markRenderScheduled == "function" && Oe.markRenderScheduled(e);
    }
    function Mc(e, t) {
      Oe !== null && typeof Oe.markForceUpdateScheduled == "function" && Oe.markForceUpdateScheduled(e, t);
    }
    function hs(e, t) {
      Oe !== null && typeof Oe.markStateUpdateScheduled == "function" && Oe.markStateUpdateScheduled(e, t);
    }
    var Ze = (
      /*                         */
      0
    ), Rt = (
      /*                 */
      1
    ), Ht = (
      /*                    */
      2
    ), en = (
      /*               */
      8
    ), Vt = (
      /*              */
      16
    ), Pn = Math.clz32 ? Math.clz32 : ms, tr = Math.log, jc = Math.LN2;
    function ms(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (tr(t) / jc | 0) | 0;
    }
    var Cu = 31, le = (
      /*                        */
      0
    ), Ft = (
      /*                          */
      0
    ), st = (
      /*                        */
      1
    ), Ml = (
      /*    */
      2
    ), ri = (
      /*             */
      4
    ), br = (
      /*            */
      8
    ), On = (
      /*                     */
      16
    ), Xi = (
      /*                */
      32
    ), jl = (
      /*                       */
      4194240
    ), wu = (
      /*                        */
      64
    ), Ac = (
      /*                        */
      128
    ), zc = (
      /*                        */
      256
    ), Uc = (
      /*                        */
      512
    ), Fc = (
      /*                        */
      1024
    ), Pc = (
      /*                        */
      2048
    ), Hc = (
      /*                        */
      4096
    ), Vc = (
      /*                        */
      8192
    ), Bc = (
      /*                        */
      16384
    ), xu = (
      /*                       */
      32768
    ), Ic = (
      /*                       */
      65536
    ), go = (
      /*                       */
      131072
    ), So = (
      /*                       */
      262144
    ), Yc = (
      /*                       */
      524288
    ), ys = (
      /*                       */
      1048576
    ), $c = (
      /*                       */
      2097152
    ), gs = (
      /*                            */
      130023424
    ), bu = (
      /*                             */
      4194304
    ), Qc = (
      /*                             */
      8388608
    ), Ss = (
      /*                             */
      16777216
    ), Wc = (
      /*                             */
      33554432
    ), Gc = (
      /*                             */
      67108864
    ), Dd = bu, Es = (
      /*          */
      134217728
    ), Od = (
      /*                          */
      268435455
    ), Cs = (
      /*               */
      268435456
    ), Ru = (
      /*                        */
      536870912
    ), Zr = (
      /*                   */
      1073741824
    );
    function Hv(e) {
      {
        if (e & st)
          return "Sync";
        if (e & Ml)
          return "InputContinuousHydration";
        if (e & ri)
          return "InputContinuous";
        if (e & br)
          return "DefaultHydration";
        if (e & On)
          return "Default";
        if (e & Xi)
          return "TransitionHydration";
        if (e & jl)
          return "Transition";
        if (e & gs)
          return "Retry";
        if (e & Es)
          return "SelectiveHydration";
        if (e & Cs)
          return "IdleHydration";
        if (e & Ru)
          return "Idle";
        if (e & Zr)
          return "Offscreen";
      }
    }
    var rn = -1, Tu = wu, qc = bu;
    function ws(e) {
      switch (Al(e)) {
        case st:
          return st;
        case Ml:
          return Ml;
        case ri:
          return ri;
        case br:
          return br;
        case On:
          return On;
        case Xi:
          return Xi;
        case wu:
        case Ac:
        case zc:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Vc:
        case Bc:
        case xu:
        case Ic:
        case go:
        case So:
        case Yc:
        case ys:
        case $c:
          return e & jl;
        case bu:
        case Qc:
        case Ss:
        case Wc:
        case Gc:
          return e & gs;
        case Es:
          return Es;
        case Cs:
          return Cs;
        case Ru:
          return Ru;
        case Zr:
          return Zr;
        default:
          return g("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Kc(e, t) {
      var a = e.pendingLanes;
      if (a === le)
        return le;
      var i = le, u = e.suspendedLanes, s = e.pingedLanes, f = a & Od;
      if (f !== le) {
        var p = f & ~u;
        if (p !== le)
          i = ws(p);
        else {
          var v = f & s;
          v !== le && (i = ws(v));
        }
      } else {
        var y = a & ~u;
        y !== le ? i = ws(y) : s !== le && (i = ws(s));
      }
      if (i === le)
        return le;
      if (t !== le && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === le) {
        var S = Al(i), O = Al(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          S >= O || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          S === On && (O & jl) !== le
        )
          return t;
      }
      (i & ri) !== le && (i |= a & On);
      var k = e.entangledLanes;
      if (k !== le)
        for (var F = e.entanglements, B = i & k; B > 0; ) {
          var W = Hn(B), Ne = 1 << W;
          i |= F[W], B &= ~Ne;
        }
      return i;
    }
    function ai(e, t) {
      for (var a = e.eventTimes, i = rn; t > 0; ) {
        var u = Hn(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function Nd(e, t) {
      switch (e) {
        case st:
        case Ml:
        case ri:
          return t + 250;
        case br:
        case On:
        case Xi:
        case wu:
        case Ac:
        case zc:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Vc:
        case Bc:
        case xu:
        case Ic:
        case go:
        case So:
        case Yc:
        case ys:
        case $c:
          return t + 5e3;
        case bu:
        case Qc:
        case Ss:
        case Wc:
        case Gc:
          return rn;
        case Es:
        case Cs:
        case Ru:
        case Zr:
          return rn;
        default:
          return g("Should have found matching lanes. This is a bug in React."), rn;
      }
    }
    function Xc(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Hn(f), v = 1 << p, y = s[p];
        y === rn ? ((v & i) === le || (v & u) !== le) && (s[p] = Nd(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Vv(e) {
      return ws(e.pendingLanes);
    }
    function Jc(e) {
      var t = e.pendingLanes & ~Zr;
      return t !== le ? t : t & Zr ? Zr : le;
    }
    function Bv(e) {
      return (e & st) !== le;
    }
    function xs(e) {
      return (e & Od) !== le;
    }
    function _u(e) {
      return (e & gs) === e;
    }
    function Ld(e) {
      var t = st | ri | On;
      return (e & t) === le;
    }
    function Md(e) {
      return (e & jl) === e;
    }
    function Zc(e, t) {
      var a = Ml | ri | br | On;
      return (t & a) !== le;
    }
    function Iv(e, t) {
      return (t & e.expiredLanes) !== le;
    }
    function jd(e) {
      return (e & jl) !== le;
    }
    function Ad() {
      var e = Tu;
      return Tu <<= 1, (Tu & jl) === le && (Tu = wu), e;
    }
    function Yv() {
      var e = qc;
      return qc <<= 1, (qc & gs) === le && (qc = bu), e;
    }
    function Al(e) {
      return e & -e;
    }
    function bs(e) {
      return Al(e);
    }
    function Hn(e) {
      return 31 - Pn(e);
    }
    function sr(e) {
      return Hn(e);
    }
    function ea(e, t) {
      return (e & t) !== le;
    }
    function ku(e, t) {
      return (e & t) === t;
    }
    function St(e, t) {
      return e | t;
    }
    function Rs(e, t) {
      return e & ~t;
    }
    function zd(e, t) {
      return e & t;
    }
    function $v(e) {
      return e;
    }
    function Qv(e, t) {
      return e !== Ft && e < t ? e : t;
    }
    function Ts(e) {
      for (var t = [], a = 0; a < Cu; a++)
        t.push(e);
      return t;
    }
    function Eo(e, t, a) {
      e.pendingLanes |= t, t !== Ru && (e.suspendedLanes = le, e.pingedLanes = le);
      var i = e.eventTimes, u = sr(t);
      i[u] = a;
    }
    function Wv(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = Hn(i), s = 1 << u;
        a[u] = rn, i &= ~s;
      }
    }
    function ef(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Ud(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = le, e.pingedLanes = le, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Hn(f), v = 1 << p;
        i[p] = le, u[p] = rn, s[p] = rn, f &= ~v;
      }
    }
    function tf(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = Hn(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function Fd(e, t) {
      var a = Al(t), i;
      switch (a) {
        case ri:
          i = Ml;
          break;
        case On:
          i = br;
          break;
        case wu:
        case Ac:
        case zc:
        case Uc:
        case Fc:
        case Pc:
        case Hc:
        case Vc:
        case Bc:
        case xu:
        case Ic:
        case go:
        case So:
        case Yc:
        case ys:
        case $c:
        case bu:
        case Qc:
        case Ss:
        case Wc:
        case Gc:
          i = Xi;
          break;
        case Ru:
          i = Cs;
          break;
        default:
          i = Ft;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== Ft ? Ft : i;
    }
    function _s(e, t, a) {
      if (Jr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = sr(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function Gv(e, t) {
      if (Jr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = sr(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Pd(e, t) {
      return null;
    }
    var Lr = st, _i = ri, ja = On, Aa = Ru, ks = Ft;
    function za() {
      return ks;
    }
    function Vn(e) {
      ks = e;
    }
    function qv(e, t) {
      var a = ks;
      try {
        return ks = e, t();
      } finally {
        ks = a;
      }
    }
    function Kv(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Ds(e, t) {
      return e > t ? e : t;
    }
    function nr(e, t) {
      return e !== 0 && e < t;
    }
    function Xv(e) {
      var t = Al(e);
      return nr(Lr, t) ? nr(_i, t) ? xs(t) ? ja : Aa : _i : Lr;
    }
    function nf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Os;
    function Rr(e) {
      Os = e;
    }
    function vy(e) {
      Os(e);
    }
    var Pe;
    function Co(e) {
      Pe = e;
    }
    var rf;
    function Jv(e) {
      rf = e;
    }
    var Zv;
    function Ns(e) {
      Zv = e;
    }
    var Ls;
    function Hd(e) {
      Ls = e;
    }
    var af = !1, Ms = [], Ji = null, ki = null, Di = null, Nn = /* @__PURE__ */ new Map(), Mr = /* @__PURE__ */ new Map(), jr = [], eh = [
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
    function th(e) {
      return eh.indexOf(e) > -1;
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
    function Vd(e, t) {
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
          Nn.delete(a);
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
          var p = Oo(t);
          p !== null && Pe(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function hy(e, t, a, i, u) {
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
          return Nn.set(y, ta(Nn.get(y) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var S = u, O = S.pointerId;
          return Mr.set(O, ta(Mr.get(O) || null, e, t, a, i, S)), !0;
        }
      }
      return !1;
    }
    function Bd(e) {
      var t = $s(e.target);
      if (t !== null) {
        var a = pa(t);
        if (a !== null) {
          var i = a.tag;
          if (i === he) {
            var u = bi(a);
            if (u !== null) {
              e.blockedOn = u, Ls(e.priority, function() {
                rf(a);
              });
              return;
            }
          } else if (i === I) {
            var s = a.stateNode;
            if (nf(s)) {
              e.blockedOn = Ri(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function nh(e) {
      for (var t = Zv(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < jr.length && nr(t, jr[i].priority); i++)
        ;
      jr.splice(i, 0, a), i === 0 && Bd(a);
    }
    function js(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = xo(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          sy(s), u.target.dispatchEvent(s), cy();
        } else {
          var f = Oo(i);
          return f !== null && Pe(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Id(e, t, a) {
      js(e) && a.delete(t);
    }
    function my() {
      af = !1, Ji !== null && js(Ji) && (Ji = null), ki !== null && js(ki) && (ki = null), Di !== null && js(Di) && (Di = null), Nn.forEach(Id), Mr.forEach(Id);
    }
    function zl(e, t) {
      e.blockedOn === t && (e.blockedOn = null, af || (af = !0, w.unstable_scheduleCallback(w.unstable_NormalPriority, my)));
    }
    function Du(e) {
      if (Ms.length > 0) {
        zl(Ms[0], e);
        for (var t = 1; t < Ms.length; t++) {
          var a = Ms[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Ji !== null && zl(Ji, e), ki !== null && zl(ki, e), Di !== null && zl(Di, e);
      var i = function(p) {
        return zl(p, e);
      };
      Nn.forEach(i), Mr.forEach(i);
      for (var u = 0; u < jr.length; u++) {
        var s = jr[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; jr.length > 0; ) {
        var f = jr[0];
        if (f.blockedOn !== null)
          break;
        Bd(f), f.blockedOn === null && jr.shift();
      }
    }
    var cr = x.ReactCurrentBatchConfig, Mt = !0;
    function Kn(e) {
      Mt = !!e;
    }
    function Bn() {
      return Mt;
    }
    function fr(e, t, a) {
      var i = lf(t), u;
      switch (i) {
        case Lr:
          u = ya;
          break;
        case _i:
          u = wo;
          break;
        case ja:
        default:
          u = Ln;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function ya(e, t, a, i) {
      var u = za(), s = cr.transition;
      cr.transition = null;
      try {
        Vn(Lr), Ln(e, t, a, i);
      } finally {
        Vn(u), cr.transition = s;
      }
    }
    function wo(e, t, a, i) {
      var u = za(), s = cr.transition;
      cr.transition = null;
      try {
        Vn(_i), Ln(e, t, a, i);
      } finally {
        Vn(u), cr.transition = s;
      }
    }
    function Ln(e, t, a, i) {
      Mt && As(e, t, a, i);
    }
    function As(e, t, a, i) {
      var u = xo(e, t, a, i);
      if (u === null) {
        My(e, t, i, Oi, a), Vd(e, i);
        return;
      }
      if (hy(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (Vd(e, i), t & ka && th(e)) {
        for (; u !== null; ) {
          var s = Oo(u);
          s !== null && vy(s);
          var f = xo(e, t, a, i);
          if (f === null && My(e, t, i, Oi, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      My(e, t, i, null, a);
    }
    var Oi = null;
    function xo(e, t, a, i) {
      Oi = null;
      var u = hd(i), s = $s(u);
      if (s !== null) {
        var f = pa(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === he) {
            var v = bi(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === I) {
            var y = f.stateNode;
            if (nf(y))
              return Ri(f);
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
            case cs:
              return Lr;
            case Nl:
              return _i;
            case qi:
            case py:
              return ja;
            case mu:
              return Aa;
            default:
              return ja;
          }
        }
        default:
          return ja;
      }
    }
    function zs(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function na(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Yd(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function bo(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var ga = null, Ro = null, Ou = null;
    function Ul(e) {
      return ga = e, Ro = Us(), !0;
    }
    function uf() {
      ga = null, Ro = null, Ou = null;
    }
    function Zi() {
      if (Ou)
        return Ou;
      var e, t = Ro, a = t.length, i, u = Us(), s = u.length;
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
    function To() {
      return !0;
    }
    function Fs() {
      return !1;
    }
    function Tr(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var y = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return y ? this.isDefaultPrevented = To : this.isDefaultPrevented = Fs, this.isPropagationStopped = Fs, this;
      }
      return Et(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = To);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = To);
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
        isPersistent: To
      }), t;
    }
    var In = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Ni = Tr(In), Ar = Et({}, In, {
      view: 0,
      detail: 0
    }), ra = Tr(Ar), of, Ps, Nu;
    function yy(e) {
      e !== Nu && (Nu && e.type === "mousemove" ? (of = e.screenX - Nu.screenX, Ps = e.screenY - Nu.screenY) : (of = 0, Ps = 0), Nu = e);
    }
    var li = Et({}, Ar, {
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
      getModifierState: mn,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (yy(e), of);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Ps;
      }
    }), $d = Tr(li), Qd = Et({}, li, {
      dataTransfer: 0
    }), Lu = Tr(Qd), Wd = Et({}, Ar, {
      relatedTarget: 0
    }), el = Tr(Wd), rh = Et({}, In, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), ah = Tr(rh), Gd = Et({}, In, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), sf = Tr(Gd), gy = Et({}, In, {
      data: 0
    }), ih = Tr(gy), lh = ih, uh = {
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
    function Sy(e) {
      if (e.key) {
        var t = uh[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Fl(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Mu[e.keyCode] || "Unidentified" : "";
    }
    var _o = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function oh(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = _o[e];
      return i ? !!a[i] : !1;
    }
    function mn(e) {
      return oh;
    }
    var Ey = Et({}, Ar, {
      key: Sy,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: mn,
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
    }), sh = Tr(Ey), Cy = Et({}, li, {
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
    }), ch = Tr(Cy), fh = Et({}, Ar, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: mn
    }), dh = Tr(fh), wy = Et({}, In, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Ua = Tr(wy), qd = Et({}, li, {
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
    }), xy = Tr(qd), Pl = [9, 13, 27, 32], Hs = 229, tl = $t && "CompositionEvent" in window, Hl = null;
    $t && "documentMode" in document && (Hl = document.documentMode);
    var Kd = $t && "TextEvent" in window && !Hl, cf = $t && (!tl || Hl && Hl > 8 && Hl <= 11), ph = 32, ff = String.fromCharCode(ph);
    function by() {
      rt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), rt("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), rt("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), rt("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Xd = !1;
    function vh(e) {
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
    function Jd(e, t) {
      switch (e) {
        case "keyup":
          return Pl.indexOf(t.keyCode) !== -1;
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
    function hh(e) {
      return e.locale === "ko";
    }
    var ju = !1;
    function Zd(e, t, a, i, u) {
      var s, f;
      if (tl ? s = df(t) : ju ? Jd(t, i) && (s = "onCompositionEnd") : pf(t, i) && (s = "onCompositionStart"), !s)
        return null;
      cf && !hh(i) && (!ju && s === "onCompositionStart" ? ju = Ul(u) : s === "onCompositionEnd" && ju && (f = Zi()));
      var p = wh(a, s);
      if (p.length > 0) {
        var v = new ih(s, t, null, i, u);
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
          return a !== ph ? null : (Xd = !0, ff);
        case "textInput":
          var i = t.data;
          return i === ff && Xd ? null : i;
        default:
          return null;
      }
    }
    function ep(e, t) {
      if (ju) {
        if (e === "compositionend" || !tl && Jd(e, t)) {
          var a = Zi();
          return uf(), ju = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!vh(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return cf && !hh(t) ? null : t.data;
        default:
          return null;
      }
    }
    function mf(e, t, a, i, u) {
      var s;
      if (Kd ? s = hf(t, i) : s = ep(t, i), !s)
        return null;
      var f = wh(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new lh("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function mh(e, t, a, i, u, s, f) {
      Zd(e, t, a, i, u), mf(e, t, a, i, u);
    }
    var Ry = {
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
      return t === "input" ? !!Ry[e.type] : t === "textarea";
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
    function Ty(e) {
      if (!$t)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function Bs() {
      rt("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function yh(e, t, a, i) {
      so(i);
      var u = wh(t, "onChange");
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
      yh(t, n, e, hd(e)), Dv(o, t);
    }
    function o(e) {
      zE(e, 0);
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
    var m = !1;
    $t && (m = Ty("input") && (!document.documentMode || document.documentMode > 9));
    function C(e, t) {
      Vl = e, n = t, Vl.attachEvent("onpropertychange", V);
    }
    function _() {
      Vl && (Vl.detachEvent("onpropertychange", V), Vl = null, n = null);
    }
    function V(e) {
      e.propertyName === "value" && c(n) && l(e);
    }
    function oe(e, t, a) {
      e === "focusin" ? (_(), C(t, a)) : e === "focusout" && _();
    }
    function pe(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return c(n);
    }
    function ue(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function je(e, t) {
      if (e === "click")
        return c(t);
    }
    function Ie(e, t) {
      if (e === "input" || e === "change")
        return c(t);
    }
    function Ge(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || at(e, "number", e.value);
    }
    function Mn(e, t, a, i, u, s, f) {
      var p = a ? wf(a) : window, v, y;
      if (r(p) ? v = d : Vs(p) ? m ? v = Ie : (v = pe, y = oe) : ue(p) && (v = je), v) {
        var S = v(t, a);
        if (S) {
          yh(e, S, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && Ge(p);
    }
    function L() {
      dt("onMouseEnter", ["mouseout", "mouseover"]), dt("onMouseLeave", ["mouseout", "mouseover"]), dt("onPointerEnter", ["pointerout", "pointerover"]), dt("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function D(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !as(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && ($s(y) || vp(y)))
          return;
      }
      if (!(!v && !p)) {
        var S;
        if (u.window === u)
          S = u;
        else {
          var O = u.ownerDocument;
          O ? S = O.defaultView || O.parentWindow : S = window;
        }
        var k, F;
        if (v) {
          var B = i.relatedTarget || i.toElement;
          if (k = a, F = B ? $s(B) : null, F !== null) {
            var W = pa(F);
            (F !== W || F.tag !== te && F.tag !== ne) && (F = null);
          }
        } else
          k = null, F = a;
        if (k !== F) {
          var Ne = $d, it = "onMouseLeave", Ke = "onMouseEnter", At = "mouse";
          (t === "pointerout" || t === "pointerover") && (Ne = ch, it = "onPointerLeave", Ke = "onPointerEnter", At = "pointer");
          var Ot = k == null ? S : wf(k), M = F == null ? S : wf(F), G = new Ne(it, At + "leave", k, i, u);
          G.target = Ot, G.relatedTarget = M;
          var j = null, ve = $s(u);
          if (ve === a) {
            var ze = new Ne(Ke, At + "enter", F, i, u);
            ze.target = M, ze.relatedTarget = Ot, j = ze;
          }
          Fx(e, G, j, k, F);
        }
      }
    }
    function z(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var se = typeof Object.is == "function" ? Object.is : z;
    function Ye(e, t) {
      if (se(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!yn.call(t, s) || !se(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function lt(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function ot(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function ft(e, t) {
      for (var a = lt(e), i = 0, u = 0; a; ) {
        if (a.nodeType === Yi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = lt(ot(a));
      }
    }
    function rr(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        u.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return Bt(e, u, s, f, p);
    }
    function Bt(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, y = 0, S = e, O = null;
      e: for (; ; ) {
        for (var k = null; S === t && (a === 0 || S.nodeType === Yi) && (f = s + a), S === i && (u === 0 || S.nodeType === Yi) && (p = s + u), S.nodeType === Yi && (s += S.nodeValue.length), (k = S.firstChild) !== null; )
          O = S, S = k;
        for (; ; ) {
          if (S === e)
            break e;
          if (O === t && ++v === a && (f = s), O === i && ++y === u && (p = s), (k = S.nextSibling) !== null)
            break;
          S = O, O = S.parentNode;
        }
        S = k;
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
        var y = ft(e, f), S = ft(e, p);
        if (y && S) {
          if (u.rangeCount === 1 && u.anchorNode === y.node && u.anchorOffset === y.offset && u.focusNode === S.node && u.focusOffset === S.offset)
            return;
          var O = a.createRange();
          O.setStart(y.node, y.offset), u.removeAllRanges(), f > p ? (u.addRange(O), u.extend(S.node, S.offset)) : (O.setEnd(S.node, S.offset), u.addRange(O));
        }
      }
    }
    function gh(e) {
      return e && e.nodeType === Yi;
    }
    function RE(e, t) {
      return !e || !t ? !1 : e === t ? !0 : gh(e) ? !1 : gh(t) ? RE(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function Ex(e) {
      return e && e.ownerDocument && RE(e.ownerDocument.documentElement, e);
    }
    function Cx(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function TE() {
      for (var e = window, t = _a(); t instanceof e.HTMLIFrameElement; ) {
        if (Cx(t))
          e = t.contentWindow;
        else
          return t;
        t = _a(e.document);
      }
      return t;
    }
    function _y(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function wx() {
      var e = TE();
      return {
        focusedElem: e,
        selectionRange: _y(e) ? bx(e) : null
      };
    }
    function xx(e) {
      var t = TE(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && Ex(a)) {
        i !== null && _y(a) && Rx(a, i);
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
    function bx(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = rr(e), t || {
        start: 0,
        end: 0
      };
    }
    function Rx(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : Bl(e, t);
    }
    var Tx = $t && "documentMode" in document && document.documentMode <= 11;
    function _x() {
      rt("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var yf = null, ky = null, tp = null, Dy = !1;
    function kx(e) {
      if ("selectionStart" in e && _y(e))
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
    function Dx(e) {
      return e.window === e ? e.document : e.nodeType === $i ? e : e.ownerDocument;
    }
    function _E(e, t, a) {
      var i = Dx(a);
      if (!(Dy || yf == null || yf !== _a(i))) {
        var u = kx(yf);
        if (!tp || !Ye(tp, u)) {
          tp = u;
          var s = wh(ky, "onSelect");
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
    function Ox(e, t, a, i, u, s, f) {
      var p = a ? wf(a) : window;
      switch (t) {
        case "focusin":
          (Vs(p) || p.contentEditable === "true") && (yf = p, ky = a, tp = null);
          break;
        case "focusout":
          yf = null, ky = null, tp = null;
          break;
        case "mousedown":
          Dy = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Dy = !1, _E(e, i, u);
          break;
        case "selectionchange":
          if (Tx)
            break;
        case "keydown":
        case "keyup":
          _E(e, i, u);
      }
    }
    function Sh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var gf = {
      animationend: Sh("Animation", "AnimationEnd"),
      animationiteration: Sh("Animation", "AnimationIteration"),
      animationstart: Sh("Animation", "AnimationStart"),
      transitionend: Sh("Transition", "TransitionEnd")
    }, Oy = {}, kE = {};
    $t && (kE = document.createElement("div").style, "AnimationEvent" in window || (delete gf.animationend.animation, delete gf.animationiteration.animation, delete gf.animationstart.animation), "TransitionEvent" in window || delete gf.transitionend.transition);
    function Eh(e) {
      if (Oy[e])
        return Oy[e];
      if (!gf[e])
        return e;
      var t = gf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in kE)
          return Oy[e] = t[a];
      return e;
    }
    var DE = Eh("animationend"), OE = Eh("animationiteration"), NE = Eh("animationstart"), LE = Eh("transitionend"), ME = /* @__PURE__ */ new Map(), jE = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function ko(e, t) {
      ME.set(e, t), rt(t, [e]);
    }
    function Nx() {
      for (var e = 0; e < jE.length; e++) {
        var t = jE[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        ko(a, "on" + i);
      }
      ko(DE, "onAnimationEnd"), ko(OE, "onAnimationIteration"), ko(NE, "onAnimationStart"), ko("dblclick", "onDoubleClick"), ko("focusin", "onFocus"), ko("focusout", "onBlur"), ko(LE, "onTransitionEnd");
    }
    function Lx(e, t, a, i, u, s, f) {
      var p = ME.get(t);
      if (p !== void 0) {
        var v = Ni, y = t;
        switch (t) {
          case "keypress":
            if (Fl(i) === 0)
              return;
          case "keydown":
          case "keyup":
            v = sh;
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
            v = $d;
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
            v = dh;
            break;
          case DE:
          case OE:
          case NE:
            v = ah;
            break;
          case LE:
            v = Ua;
            break;
          case "scroll":
            v = ra;
            break;
          case "wheel":
            v = xy;
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
            v = ch;
            break;
        }
        var S = (s & ka) !== 0;
        {
          var O = !S && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", k = zx(a, p, i.type, S, O);
          if (k.length > 0) {
            var F = new v(p, y, null, i, u);
            e.push({
              event: F,
              listeners: k
            });
          }
        }
      }
    }
    Nx(), L(), Bs(), _x(), by();
    function Mx(e, t, a, i, u, s, f) {
      Lx(e, t, a, i, u, s);
      var p = (s & vd) === 0;
      p && (D(e, t, a, i, u), Mn(e, t, a, i, u), Ox(e, t, a, i, u), mh(e, t, a, i, u));
    }
    var np = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Ny = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(np));
    function AE(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Ci(i, t, void 0, e), e.currentTarget = null;
    }
    function jx(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          AE(e, v, p), i = f;
        }
      else
        for (var y = 0; y < t.length; y++) {
          var S = t[y], O = S.instance, k = S.currentTarget, F = S.listener;
          if (O !== i && e.isPropagationStopped())
            return;
          AE(e, F, k), i = O;
        }
    }
    function zE(e, t) {
      for (var a = (t & ka) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        jx(s, f, a);
      }
      us();
    }
    function Ax(e, t, a, i, u) {
      var s = hd(a), f = [];
      Mx(f, e, i, a, s, t), zE(f, t);
    }
    function xn(e, t) {
      Ny.has(e) || g('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = fR(t), u = Px(e);
      i.has(u) || (UE(t, e, mc, a), i.add(u));
    }
    function Ly(e, t, a) {
      Ny.has(e) && !t && g('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= ka), UE(a, e, i, t);
    }
    var Ch = "_reactListening" + Math.random().toString(36).slice(2);
    function rp(e) {
      if (!e[Ch]) {
        e[Ch] = !0, We.forEach(function(a) {
          a !== "selectionchange" && (Ny.has(a) || Ly(a, !1, e), Ly(a, !0, e));
        });
        var t = e.nodeType === $i ? e : e.ownerDocument;
        t !== null && (t[Ch] || (t[Ch] = !0, Ly("selectionchange", !1, t)));
      }
    }
    function UE(e, t, a, i, u) {
      var s = fr(e, t, a), f = void 0;
      ls && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Yd(e, t, s, f) : na(e, t, s) : f !== void 0 ? bo(e, t, s, f) : zs(e, t, s);
    }
    function FE(e, t) {
      return e === t || e.nodeType === zn && e.parentNode === t;
    }
    function My(e, t, a, i, u) {
      var s = i;
      if (!(t & pd) && !(t & mc)) {
        var f = u;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === I || v === ee) {
              var y = p.stateNode.containerInfo;
              if (FE(y, f))
                break;
              if (v === ee)
                for (var S = p.return; S !== null; ) {
                  var O = S.tag;
                  if (O === I || O === ee) {
                    var k = S.stateNode.containerInfo;
                    if (FE(k, f))
                      return;
                  }
                  S = S.return;
                }
              for (; y !== null; ) {
                var F = $s(y);
                if (F === null)
                  return;
                var B = F.tag;
                if (B === te || B === ne) {
                  p = s = F;
                  continue e;
                }
                y = y.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      Dv(function() {
        return Ax(e, t, a, s);
      });
    }
    function ap(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function zx(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, S = null; y !== null; ) {
        var O = y, k = O.stateNode, F = O.tag;
        if (F === te && k !== null && (S = k, p !== null)) {
          var B = Rl(y, p);
          B != null && v.push(ap(y, B, S));
        }
        if (u)
          break;
        y = y.return;
      }
      return v;
    }
    function wh(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === te && f !== null) {
          var v = f, y = Rl(u, a);
          y != null && i.unshift(ap(u, y, v));
          var S = Rl(u, t);
          S != null && i.push(ap(u, S, v));
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
      while (e && e.tag !== te);
      return e || null;
    }
    function Ux(e, t) {
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
    function PE(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, S = v.stateNode, O = v.tag;
        if (y !== null && y === i)
          break;
        if (O === te && S !== null) {
          var k = S;
          if (u) {
            var F = Rl(p, s);
            F != null && f.unshift(ap(p, F, k));
          } else if (!u) {
            var B = Rl(p, s);
            B != null && f.push(ap(p, B, k));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function Fx(e, t, a, i, u) {
      var s = i && u ? Ux(i, u) : null;
      i !== null && PE(e, t, i, s, !1), u !== null && a !== null && PE(e, a, u, s, !0);
    }
    function Px(e, t) {
      return e + "__bubble";
    }
    var Fa = !1, ip = "dangerouslySetInnerHTML", xh = "suppressContentEditableWarning", Do = "suppressHydrationWarning", HE = "autoFocus", Is = "children", Ys = "style", bh = "__html", jy, Rh, lp, VE, Th, BE, IE;
    jy = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Rh = function(e, t) {
      cd(e, t), vc(e, t), Tv(e, t, {
        registrationNameDependencies: fe,
        possibleRegistrationNames: Fe
      });
    }, BE = $t && !document.documentMode, lp = function(e, t, a) {
      if (!Fa) {
        var i = _h(a), u = _h(t);
        u !== i && (Fa = !0, g("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, VE = function(e) {
      if (!Fa) {
        Fa = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), g("Extra attributes from the server: %s", t);
      }
    }, Th = function(e, t) {
      t === !1 ? g("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : g("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, IE = function(e, t) {
      var a = e.namespaceURI === Ii ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var Hx = /\r\n?/g, Vx = /\u0000|\uFFFD/g;
    function _h(e) {
      Jn(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(Hx, `
`).replace(Vx, "");
    }
    function kh(e, t, a, i) {
      var u = _h(t), s = _h(e);
      if (s !== u && (i && (Fa || (Fa = !0, g('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && Ve))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function YE(e) {
      return e.nodeType === $i ? e : e.ownerDocument;
    }
    function Bx() {
    }
    function Dh(e) {
      e.onclick = Bx;
    }
    function Ix(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Ys)
            f && Object.freeze(f), Ev(t, f);
          else if (s === ip) {
            var p = f ? f[bh] : void 0;
            p != null && ov(t, p);
          } else if (s === Is)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && io(t, f);
            } else typeof f == "number" && io(t, "" + f);
          else s === xh || s === Do || s === HE || (fe.hasOwnProperty(s) ? f != null && (typeof f != "function" && Th(s, f), s === "onScroll" && xn("scroll", t)) : f != null && _r(t, s, f, u));
        }
    }
    function Yx(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Ys ? Ev(e, f) : s === ip ? ov(e, f) : s === Is ? io(e, f) : _r(e, s, f, i);
      }
    }
    function $x(e, t, a, i) {
      var u, s = YE(a), f, p = i;
      if (p === Ii && (p = rd(e)), p === Ii) {
        if (u = xl(e, t), !u && e !== e.toLowerCase() && g("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
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
      return p === Ii && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !yn.call(jy, e) && (jy[e] = !0, g("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function Qx(e, t) {
      return YE(t).createTextNode(e);
    }
    function Wx(e, t, a, i) {
      var u = xl(t, a);
      Rh(t, a);
      var s;
      switch (t) {
        case "dialog":
          xn("cancel", e), xn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          xn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < np.length; f++)
            xn(np[f], e);
          s = a;
          break;
        case "source":
          xn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          xn("error", e), xn("load", e), s = a;
          break;
        case "details":
          xn("toggle", e), s = a;
          break;
        case "input":
          ei(e, a), s = ao(e, a), xn("invalid", e);
          break;
        case "option":
          Ut(e, a), s = a;
          break;
        case "select":
          ou(e, a), s = Xo(e, a), xn("invalid", e);
          break;
        case "textarea":
          ed(e, a), s = Zf(e, a), xn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (dc(t, s), Ix(t, e, i, s, u), t) {
        case "input":
          Za(e), H(e, a, !1);
          break;
        case "textarea":
          Za(e), lv(e);
          break;
        case "option":
          on(e, a);
          break;
        case "select":
          Xf(e, a);
          break;
        default:
          typeof s.onClick == "function" && Dh(e);
          break;
      }
    }
    function Gx(e, t, a, i, u) {
      Rh(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = ao(e, a), p = ao(e, i), s = [];
          break;
        case "select":
          f = Xo(e, a), p = Xo(e, i), s = [];
          break;
        case "textarea":
          f = Zf(e, a), p = Zf(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && Dh(e);
          break;
      }
      dc(t, p);
      var v, y, S = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Ys) {
            var O = f[v];
            for (y in O)
              O.hasOwnProperty(y) && (S || (S = {}), S[y] = "");
          } else v === ip || v === Is || v === xh || v === Do || v === HE || (fe.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var k = p[v], F = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || k === F || k == null && F == null))
          if (v === Ys)
            if (k && Object.freeze(k), F) {
              for (y in F)
                F.hasOwnProperty(y) && (!k || !k.hasOwnProperty(y)) && (S || (S = {}), S[y] = "");
              for (y in k)
                k.hasOwnProperty(y) && F[y] !== k[y] && (S || (S = {}), S[y] = k[y]);
            } else
              S || (s || (s = []), s.push(v, S)), S = k;
          else if (v === ip) {
            var B = k ? k[bh] : void 0, W = F ? F[bh] : void 0;
            B != null && W !== B && (s = s || []).push(v, B);
          } else v === Is ? (typeof k == "string" || typeof k == "number") && (s = s || []).push(v, "" + k) : v === xh || v === Do || (fe.hasOwnProperty(v) ? (k != null && (typeof k != "function" && Th(v, k), v === "onScroll" && xn("scroll", e)), !s && F !== k && (s = [])) : (s = s || []).push(v, k));
      }
      return S && (uy(S, p[Ys]), (s = s || []).push(Ys, S)), s;
    }
    function qx(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && h(e, u);
      var s = xl(a, i), f = xl(a, u);
      switch (Yx(e, t, s, f), a) {
        case "input":
          b(e, u);
          break;
        case "textarea":
          iv(e, u);
          break;
        case "select":
          sc(e, u);
          break;
      }
    }
    function Kx(e) {
      {
        var t = e.toLowerCase();
        return ns.hasOwnProperty(t) && ns[t] || null;
      }
    }
    function Xx(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = xl(t, a), Rh(t, a), t) {
        case "dialog":
          xn("cancel", e), xn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          xn("load", e);
          break;
        case "video":
        case "audio":
          for (var y = 0; y < np.length; y++)
            xn(np[y], e);
          break;
        case "source":
          xn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          xn("error", e), xn("load", e);
          break;
        case "details":
          xn("toggle", e);
          break;
        case "input":
          ei(e, a), xn("invalid", e);
          break;
        case "option":
          Ut(e, a);
          break;
        case "select":
          ou(e, a), xn("invalid", e);
          break;
        case "textarea":
          ed(e, a), xn("invalid", e);
          break;
      }
      dc(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var S = e.attributes, O = 0; O < S.length; O++) {
          var k = S[O].name.toLowerCase();
          switch (k) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(S[O].name);
          }
        }
      }
      var F = null;
      for (var B in a)
        if (a.hasOwnProperty(B)) {
          var W = a[B];
          if (B === Is)
            typeof W == "string" ? e.textContent !== W && (a[Do] !== !0 && kh(e.textContent, W, s, f), F = [Is, W]) : typeof W == "number" && e.textContent !== "" + W && (a[Do] !== !0 && kh(e.textContent, W, s, f), F = [Is, "" + W]);
          else if (fe.hasOwnProperty(B))
            W != null && (typeof W != "function" && Th(B, W), B === "onScroll" && xn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var Ne = void 0, it = ln(B);
            if (a[Do] !== !0) {
              if (!(B === xh || B === Do || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              B === "value" || B === "checked" || B === "selected")) {
                if (B === ip) {
                  var Ke = e.innerHTML, At = W ? W[bh] : void 0;
                  if (At != null) {
                    var Ot = IE(e, At);
                    Ot !== Ke && lp(B, Ke, Ot);
                  }
                } else if (B === Ys) {
                  if (v.delete(B), BE) {
                    var M = iy(W);
                    Ne = e.getAttribute("style"), M !== Ne && lp(B, Ne, M);
                  }
                } else if (p && !N)
                  v.delete(B.toLowerCase()), Ne = tu(e, B, W), W !== Ne && lp(B, Ne, W);
                else if (!gn(B, it, p) && !Zn(B, W, it, p)) {
                  var G = !1;
                  if (it !== null)
                    v.delete(it.attributeName), Ne = vl(e, B, W, it);
                  else {
                    var j = i;
                    if (j === Ii && (j = rd(t)), j === Ii)
                      v.delete(B.toLowerCase());
                    else {
                      var ve = Kx(B);
                      ve !== null && ve !== B && (G = !0, v.delete(ve)), v.delete(B);
                    }
                    Ne = tu(e, B, W);
                  }
                  var ze = N;
                  !ze && W !== Ne && !G && lp(B, Ne, W);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[Do] !== !0 && VE(v), t) {
        case "input":
          Za(e), H(e, a, !0);
          break;
        case "textarea":
          Za(e), lv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && Dh(e);
          break;
      }
      return F;
    }
    function Jx(e, t, a) {
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
    function Fy(e, t) {
      {
        if (t === "" || Fa)
          return;
        Fa = !0, g('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function Zx(e, t, a) {
      switch (t) {
        case "input":
          $(e, a);
          return;
        case "textarea":
          ty(e, a);
          return;
        case "select":
          Jf(e, a);
          return;
      }
    }
    var up = function() {
    }, op = function() {
    };
    {
      var eb = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], $E = [
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
      ], tb = $E.concat(["button"]), nb = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], QE = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      op = function(e, t) {
        var a = Et({}, e || QE), i = {
          tag: t
        };
        return $E.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), tb.indexOf(t) !== -1 && (a.pTagInButtonScope = null), eb.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var rb = function(e, t) {
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
            return nb.indexOf(t) === -1;
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
      }, ab = function(e, t) {
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
      }, WE = {};
      up = function(e, t, a) {
        a = a || QE;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && g("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = rb(e, u) ? null : i, f = s ? null : ab(e, a), p = s || f;
        if (p) {
          var v = p.tag, y = !!s + "|" + e + "|" + v;
          if (!WE[y]) {
            WE[y] = !0;
            var S = e, O = "";
            if (e === "#text" ? /\S/.test(t) ? S = "Text nodes" : (S = "Whitespace text nodes", O = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : S = "<" + e + ">", s) {
              var k = "";
              v === "table" && e === "tr" && (k += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), g("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", S, v, O, k);
            } else
              g("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", S, v);
          }
        }
      };
    }
    var Oh = "suppressHydrationWarning", Nh = "$", Lh = "/$", sp = "$?", cp = "$!", ib = "style", Py = null, Hy = null;
    function lb(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case $i:
        case id: {
          t = i === $i ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : ad(null, "");
          break;
        }
        default: {
          var s = i === zn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = ad(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = op(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function ub(e, t, a) {
      {
        var i = e, u = ad(i.namespace, t), s = op(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function lD(e) {
      return e;
    }
    function ob(e) {
      Py = Bn(), Hy = wx();
      var t = null;
      return Kn(!1), t;
    }
    function sb(e) {
      xx(Hy), Kn(Py), Py = null, Hy = null;
    }
    function cb(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (up(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = op(f.ancestorInfo, e);
          up(null, p, v);
        }
        s = f.namespace;
      }
      var y = $x(e, t, a, s);
      return pp(u, y), Gy(y, t), y;
    }
    function fb(e, t) {
      e.appendChild(t);
    }
    function db(e, t, a, i, u) {
      switch (Wx(e, t, a, i), t) {
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
    function pb(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = op(f.ancestorInfo, t);
          up(null, p, v);
        }
      }
      return Gx(e, t, a, i);
    }
    function Vy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function vb(e, t, a, i) {
      {
        var u = a;
        up(null, e, u.ancestorInfo);
      }
      var s = Qx(e, t);
      return pp(i, s), s;
    }
    function hb() {
      var e = window.event;
      return e === void 0 ? ja : lf(e.type);
    }
    var By = typeof setTimeout == "function" ? setTimeout : void 0, mb = typeof clearTimeout == "function" ? clearTimeout : void 0, Iy = -1, GE = typeof Promise == "function" ? Promise : void 0, yb = typeof queueMicrotask == "function" ? queueMicrotask : typeof GE < "u" ? function(e) {
      return GE.resolve(null).then(e).catch(gb);
    } : By;
    function gb(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function Sb(e, t, a, i) {
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
    function Eb(e, t, a, i, u, s) {
      qx(e, t, a, i, u), Gy(e, u);
    }
    function qE(e) {
      io(e, "");
    }
    function Cb(e, t, a) {
      e.nodeValue = a;
    }
    function wb(e, t) {
      e.appendChild(t);
    }
    function xb(e, t) {
      var a;
      e.nodeType === zn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && Dh(a);
    }
    function bb(e, t, a) {
      e.insertBefore(t, a);
    }
    function Rb(e, t, a) {
      e.nodeType === zn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function Tb(e, t) {
      e.removeChild(t);
    }
    function _b(e, t) {
      e.nodeType === zn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Yy(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === zn) {
          var s = u.data;
          if (s === Lh)
            if (i === 0) {
              e.removeChild(u), Du(t);
              return;
            } else
              i--;
          else (s === Nh || s === sp || s === cp) && i++;
        }
        a = u;
      } while (a);
      Du(t);
    }
    function kb(e, t) {
      e.nodeType === zn ? Yy(e.parentNode, t) : e.nodeType === Wr && Yy(e, t), Du(e);
    }
    function Db(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function Ob(e) {
      e.nodeValue = "";
    }
    function Nb(e, t) {
      e = e;
      var a = t[ib], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = fc("display", i);
    }
    function Lb(e, t) {
      e.nodeValue = t;
    }
    function Mb(e) {
      e.nodeType === Wr ? e.textContent = "" : e.nodeType === $i && e.documentElement && e.removeChild(e.documentElement);
    }
    function jb(e, t, a) {
      return e.nodeType !== Wr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function Ab(e, t) {
      return t === "" || e.nodeType !== Yi ? null : e;
    }
    function zb(e) {
      return e.nodeType !== zn ? null : e;
    }
    function KE(e) {
      return e.data === sp;
    }
    function $y(e) {
      return e.data === cp;
    }
    function Ub(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function Fb(e, t) {
      e._reactRetry = t;
    }
    function Mh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === Wr || t === Yi)
          break;
        if (t === zn) {
          var a = e.data;
          if (a === Nh || a === cp || a === sp)
            break;
          if (a === Lh)
            return null;
        }
      }
      return e;
    }
    function fp(e) {
      return Mh(e.nextSibling);
    }
    function Pb(e) {
      return Mh(e.firstChild);
    }
    function Hb(e) {
      return Mh(e.firstChild);
    }
    function Vb(e) {
      return Mh(e.nextSibling);
    }
    function Bb(e, t, a, i, u, s, f) {
      pp(s, e), Gy(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & Rt) !== Ze;
      return Xx(e, t, a, p, i, y, f);
    }
    function Ib(e, t, a, i) {
      return pp(a, e), a.mode & Rt, Jx(e, t);
    }
    function Yb(e, t) {
      pp(t, e);
    }
    function $b(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === zn) {
          var i = t.data;
          if (i === Lh) {
            if (a === 0)
              return fp(t);
            a--;
          } else (i === Nh || i === cp || i === sp) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function XE(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === zn) {
          var i = t.data;
          if (i === Nh || i === cp || i === sp) {
            if (a === 0)
              return t;
            a--;
          } else i === Lh && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function Qb(e) {
      Du(e);
    }
    function Wb(e) {
      Du(e);
    }
    function Gb(e) {
      return e !== "head" && e !== "body";
    }
    function qb(e, t, a, i) {
      var u = !0;
      kh(t.nodeValue, a, i, u);
    }
    function Kb(e, t, a, i, u, s) {
      if (t[Oh] !== !0) {
        var f = !0;
        kh(i.nodeValue, u, s, f);
      }
    }
    function Xb(e, t) {
      t.nodeType === Wr ? Ay(e, t) : t.nodeType === zn || zy(e, t);
    }
    function Jb(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === Wr ? Ay(a, t) : t.nodeType === zn || zy(a, t));
      }
    }
    function Zb(e, t, a, i, u) {
      (u || t[Oh] !== !0) && (i.nodeType === Wr ? Ay(a, i) : i.nodeType === zn || zy(a, i));
    }
    function eR(e, t, a) {
      Uy(e, t);
    }
    function tR(e, t) {
      Fy(e, t);
    }
    function nR(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Uy(i, t);
      }
    }
    function rR(e, t) {
      {
        var a = e.parentNode;
        a !== null && Fy(a, t);
      }
    }
    function aR(e, t, a, i, u, s) {
      (s || t[Oh] !== !0) && Uy(a, i);
    }
    function iR(e, t, a, i, u) {
      (u || t[Oh] !== !0) && Fy(a, i);
    }
    function lR(e) {
      g("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function uR(e) {
      rp(e);
    }
    var Ef = Math.random().toString(36).slice(2), Cf = "__reactFiber$" + Ef, Qy = "__reactProps$" + Ef, dp = "__reactContainer$" + Ef, Wy = "__reactEvents$" + Ef, oR = "__reactListeners$" + Ef, sR = "__reactHandles$" + Ef;
    function cR(e) {
      delete e[Cf], delete e[Qy], delete e[Wy], delete e[oR], delete e[sR];
    }
    function pp(e, t) {
      t[Cf] = e;
    }
    function jh(e, t) {
      t[dp] = e;
    }
    function JE(e) {
      e[dp] = null;
    }
    function vp(e) {
      return !!e[dp];
    }
    function $s(e) {
      var t = e[Cf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[dp] || a[Cf], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = XE(e); u !== null; ) {
              var s = u[Cf];
              if (s)
                return s;
              u = XE(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Oo(e) {
      var t = e[Cf] || e[dp];
      return t && (t.tag === te || t.tag === ne || t.tag === he || t.tag === I) ? t : null;
    }
    function wf(e) {
      if (e.tag === te || e.tag === ne)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function Ah(e) {
      return e[Qy] || null;
    }
    function Gy(e, t) {
      e[Qy] = t;
    }
    function fR(e) {
      var t = e[Wy];
      return t === void 0 && (t = e[Wy] = /* @__PURE__ */ new Set()), t;
    }
    var ZE = {}, eC = x.ReactDebugCurrentFrame;
    function zh(e) {
      if (e) {
        var t = e._owner, a = Hi(e.type, e._source, t ? t.type : null);
        eC.setExtraStackFrame(a);
      } else
        eC.setExtraStackFrame(null);
    }
    function nl(e, t, a, i, u) {
      {
        var s = Function.call.bind(yn);
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
            p && !(p instanceof Error) && (zh(u), g("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), zh(null)), p instanceof Error && !(p.message in ZE) && (ZE[p.message] = !0, zh(u), g("Failed %s type: %s", a, p.message), zh(null));
          }
      }
    }
    var qy = [], Uh;
    Uh = [];
    var Au = -1;
    function No(e) {
      return {
        current: e
      };
    }
    function aa(e, t) {
      if (Au < 0) {
        g("Unexpected pop.");
        return;
      }
      t !== Uh[Au] && g("Unexpected Fiber popped."), e.current = qy[Au], qy[Au] = null, Uh[Au] = null, Au--;
    }
    function ia(e, t, a) {
      Au++, qy[Au] = e.current, Uh[Au] = a, e.current = t;
    }
    var Ky;
    Ky = {};
    var ui = {};
    Object.freeze(ui);
    var zu = No(ui), Il = No(!1), Xy = ui;
    function xf(e, t, a) {
      return a && Yl(t) ? Xy : zu.current;
    }
    function tC(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function bf(e, t) {
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
          var p = pt(e) || "Unknown";
          nl(i, s, "context", p);
        }
        return u && tC(e, t, s), s;
      }
    }
    function Fh() {
      return Il.current;
    }
    function Yl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Ph(e) {
      aa(Il, e), aa(zu, e);
    }
    function Jy(e) {
      aa(Il, e), aa(zu, e);
    }
    function nC(e, t, a) {
      {
        if (zu.current !== ui)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ia(zu, t, e), ia(Il, a, e);
      }
    }
    function rC(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = pt(e) || "Unknown";
            Ky[s] || (Ky[s] = !0, g("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((pt(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = pt(e) || "Unknown";
          nl(u, f, "child context", v);
        }
        return Et({}, a, f);
      }
    }
    function Hh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ui;
        return Xy = zu.current, ia(zu, a, e), ia(Il, Il.current, e), !0;
      }
    }
    function aC(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = rC(e, t, Xy);
          i.__reactInternalMemoizedMergedChildContext = u, aa(Il, e), aa(zu, e), ia(zu, u, e), ia(Il, a, e);
        } else
          aa(Il, e), ia(Il, a, e);
      }
    }
    function dR(e) {
      {
        if (!hu(e) || e.tag !== Q)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case I:
              return t.stateNode.context;
            case Q: {
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
    var Lo = 0, Vh = 1, Uu = null, Zy = !1, eg = !1;
    function iC(e) {
      Uu === null ? Uu = [e] : Uu.push(e);
    }
    function pR(e) {
      Zy = !0, iC(e);
    }
    function lC() {
      Zy && Mo();
    }
    function Mo() {
      if (!eg && Uu !== null) {
        eg = !0;
        var e = 0, t = za();
        try {
          var a = !0, i = Uu;
          for (Vn(Lr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          Uu = null, Zy = !1;
        } catch (s) {
          throw Uu !== null && (Uu = Uu.slice(e + 1)), yd(cs, Mo), s;
        } finally {
          Vn(t), eg = !1;
        }
      }
      return null;
    }
    var Rf = [], Tf = 0, Bh = null, Ih = 0, Li = [], Mi = 0, Qs = null, Fu = 1, Pu = "";
    function vR(e) {
      return Gs(), (e.flags & wi) !== Je;
    }
    function hR(e) {
      return Gs(), Ih;
    }
    function mR() {
      var e = Pu, t = Fu, a = t & ~yR(t);
      return a.toString(32) + e;
    }
    function Ws(e, t) {
      Gs(), Rf[Tf++] = Ih, Rf[Tf++] = Bh, Bh = e, Ih = t;
    }
    function uC(e, t, a) {
      Gs(), Li[Mi++] = Fu, Li[Mi++] = Pu, Li[Mi++] = Qs, Qs = e;
      var i = Fu, u = Pu, s = Yh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Yh(t) + s;
      if (v > 30) {
        var y = s - s % 5, S = (1 << y) - 1, O = (f & S).toString(32), k = f >> y, F = s - y, B = Yh(t) + F, W = p << F, Ne = W | k, it = O + u;
        Fu = 1 << B | Ne, Pu = it;
      } else {
        var Ke = p << s, At = Ke | f, Ot = u;
        Fu = 1 << v | At, Pu = Ot;
      }
    }
    function tg(e) {
      Gs();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Ws(e, a), uC(e, a, i);
      }
    }
    function Yh(e) {
      return 32 - Pn(e);
    }
    function yR(e) {
      return 1 << Yh(e) - 1;
    }
    function ng(e) {
      for (; e === Bh; )
        Bh = Rf[--Tf], Rf[Tf] = null, Ih = Rf[--Tf], Rf[Tf] = null;
      for (; e === Qs; )
        Qs = Li[--Mi], Li[Mi] = null, Pu = Li[--Mi], Li[Mi] = null, Fu = Li[--Mi], Li[Mi] = null;
    }
    function gR() {
      return Gs(), Qs !== null ? {
        id: Fu,
        overflow: Pu
      } : null;
    }
    function SR(e, t) {
      Gs(), Li[Mi++] = Fu, Li[Mi++] = Pu, Li[Mi++] = Qs, Fu = t.id, Pu = t.overflow, Qs = e;
    }
    function Gs() {
      Ur() || g("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var zr = null, ji = null, rl = !1, qs = !1, jo = null;
    function ER() {
      rl && g("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function oC() {
      qs = !0;
    }
    function CR() {
      return qs;
    }
    function wR(e) {
      var t = e.stateNode.containerInfo;
      return ji = Hb(t), zr = e, rl = !0, jo = null, qs = !1, !0;
    }
    function xR(e, t, a) {
      return ji = Vb(t), zr = e, rl = !0, jo = null, qs = !1, a !== null && SR(e, a), !0;
    }
    function sC(e, t) {
      switch (e.tag) {
        case I: {
          Xb(e.stateNode.containerInfo, t);
          break;
        }
        case te: {
          var a = (e.mode & Rt) !== Ze;
          Zb(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case he: {
          var i = e.memoizedState;
          i.dehydrated !== null && Jb(i.dehydrated, t);
          break;
        }
      }
    }
    function cC(e, t) {
      sC(e, t);
      var a = _1();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Da) : i.push(a);
    }
    function rg(e, t) {
      {
        if (qs)
          return;
        switch (e.tag) {
          case I: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case te:
                var i = t.type;
                t.pendingProps, eR(a, i);
                break;
              case ne:
                var u = t.pendingProps;
                tR(a, u);
                break;
            }
            break;
          }
          case te: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case te: {
                var v = t.type, y = t.pendingProps, S = (e.mode & Rt) !== Ze;
                aR(
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
              case ne: {
                var O = t.pendingProps, k = (e.mode & Rt) !== Ze;
                iR(
                  s,
                  f,
                  p,
                  O,
                  // TODO: Delete this argument when we remove the legacy root API.
                  k
                );
                break;
              }
            }
            break;
          }
          case he: {
            var F = e.memoizedState, B = F.dehydrated;
            if (B !== null) switch (t.tag) {
              case te:
                var W = t.type;
                t.pendingProps, nR(B, W);
                break;
              case ne:
                var Ne = t.pendingProps;
                rR(B, Ne);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function fC(e, t) {
      t.flags = t.flags & ~qr | En, rg(e, t);
    }
    function dC(e, t) {
      switch (e.tag) {
        case te: {
          var a = e.type;
          e.pendingProps;
          var i = jb(t, a);
          return i !== null ? (e.stateNode = i, zr = e, ji = Pb(i), !0) : !1;
        }
        case ne: {
          var u = e.pendingProps, s = Ab(t, u);
          return s !== null ? (e.stateNode = s, zr = e, ji = null, !0) : !1;
        }
        case he: {
          var f = zb(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: gR(),
              retryLane: Zr
            };
            e.memoizedState = p;
            var v = k1(f);
            return v.return = e, e.child = v, zr = e, ji = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function ag(e) {
      return (e.mode & Rt) !== Ze && (e.flags & Xe) === Je;
    }
    function ig(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function lg(e) {
      if (rl) {
        var t = ji;
        if (!t) {
          ag(e) && (rg(zr, e), ig()), fC(zr, e), rl = !1, zr = e;
          return;
        }
        var a = t;
        if (!dC(e, t)) {
          ag(e) && (rg(zr, e), ig()), t = fp(a);
          var i = zr;
          if (!t || !dC(e, t)) {
            fC(zr, e), rl = !1, zr = e;
            return;
          }
          cC(i, a);
        }
      }
    }
    function bR(e, t, a) {
      var i = e.stateNode, u = !qs, s = Bb(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function RR(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Ib(t, a, e);
      if (i) {
        var u = zr;
        if (u !== null)
          switch (u.tag) {
            case I: {
              var s = u.stateNode.containerInfo, f = (u.mode & Rt) !== Ze;
              qb(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case te: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, S = (u.mode & Rt) !== Ze;
              Kb(
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
    function TR(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Yb(a, e);
    }
    function _R(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return $b(a);
    }
    function pC(e) {
      for (var t = e.return; t !== null && t.tag !== te && t.tag !== I && t.tag !== he; )
        t = t.return;
      zr = t;
    }
    function $h(e) {
      if (e !== zr)
        return !1;
      if (!rl)
        return pC(e), rl = !0, !1;
      if (e.tag !== I && (e.tag !== te || Gb(e.type) && !Vy(e.type, e.memoizedProps))) {
        var t = ji;
        if (t)
          if (ag(e))
            vC(e), ig();
          else
            for (; t; )
              cC(e, t), t = fp(t);
      }
      return pC(e), e.tag === he ? ji = _R(e) : ji = zr ? fp(e.stateNode) : null, !0;
    }
    function kR() {
      return rl && ji !== null;
    }
    function vC(e) {
      for (var t = ji; t; )
        sC(e, t), t = fp(t);
    }
    function _f() {
      zr = null, ji = null, rl = !1, qs = !1;
    }
    function hC() {
      jo !== null && (ow(jo), jo = null);
    }
    function Ur() {
      return rl;
    }
    function ug(e) {
      jo === null ? jo = [e] : jo.push(e);
    }
    var DR = x.ReactCurrentBatchConfig, OR = null;
    function NR() {
      return DR.transition;
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
      var LR = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & en && (t = a), a = a.return;
        return t;
      }, Ks = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, hp = [], mp = [], yp = [], gp = [], Sp = [], Ep = [], Xs = /* @__PURE__ */ new Set();
      al.recordUnsafeLifecycleWarnings = function(e, t) {
        Xs.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && hp.push(e), e.mode & en && typeof t.UNSAFE_componentWillMount == "function" && mp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && yp.push(e), e.mode & en && typeof t.UNSAFE_componentWillReceiveProps == "function" && gp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Sp.push(e), e.mode & en && typeof t.UNSAFE_componentWillUpdate == "function" && Ep.push(e));
      }, al.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        hp.length > 0 && (hp.forEach(function(k) {
          e.add(pt(k) || "Component"), Xs.add(k.type);
        }), hp = []);
        var t = /* @__PURE__ */ new Set();
        mp.length > 0 && (mp.forEach(function(k) {
          t.add(pt(k) || "Component"), Xs.add(k.type);
        }), mp = []);
        var a = /* @__PURE__ */ new Set();
        yp.length > 0 && (yp.forEach(function(k) {
          a.add(pt(k) || "Component"), Xs.add(k.type);
        }), yp = []);
        var i = /* @__PURE__ */ new Set();
        gp.length > 0 && (gp.forEach(function(k) {
          i.add(pt(k) || "Component"), Xs.add(k.type);
        }), gp = []);
        var u = /* @__PURE__ */ new Set();
        Sp.length > 0 && (Sp.forEach(function(k) {
          u.add(pt(k) || "Component"), Xs.add(k.type);
        }), Sp = []);
        var s = /* @__PURE__ */ new Set();
        if (Ep.length > 0 && (Ep.forEach(function(k) {
          s.add(pt(k) || "Component"), Xs.add(k.type);
        }), Ep = []), t.size > 0) {
          var f = Ks(t);
          g(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = Ks(i);
          g(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = Ks(s);
          g(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var y = Ks(e);
          A(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var S = Ks(a);
          A(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, S);
        }
        if (u.size > 0) {
          var O = Ks(u);
          A(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, O);
        }
      };
      var Qh = /* @__PURE__ */ new Map(), mC = /* @__PURE__ */ new Set();
      al.recordLegacyContextWarning = function(e, t) {
        var a = LR(e);
        if (a === null) {
          g("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!mC.has(e.type)) {
          var i = Qh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Qh.set(a, i)), i.push(e));
        }
      }, al.flushLegacyContextWarning = function() {
        Qh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(pt(s) || "Component"), mC.add(s.type);
            });
            var u = Ks(i);
            try {
              Xt(a), g(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              pn();
            }
          }
        });
      }, al.discardPendingWarnings = function() {
        hp = [], mp = [], yp = [], gp = [], Sp = [], Ep = [], Qh = /* @__PURE__ */ new Map();
      };
    }
    var og, sg, cg, fg, dg, yC = function(e, t) {
    };
    og = !1, sg = !1, cg = {}, fg = {}, dg = {}, yC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = pt(t) || "Component";
        fg[a] || (fg[a] = !0, g('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function MR(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Cp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & en || q) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== Q) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !MR(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var u = pt(e) || "Component";
          cg[u] || (g('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', u, i), cg[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== Q)
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
          var S = function(O) {
            var k = v.refs;
            O === null ? delete k[y] : k[y] = O;
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
    function Wh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Gh(e) {
      {
        var t = pt(e) || "Component";
        if (dg[t])
          return;
        dg[t] = !0, g("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function gC(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function SC(e) {
      function t(M, G) {
        if (e) {
          var j = M.deletions;
          j === null ? (M.deletions = [G], M.flags |= Da) : j.push(G);
        }
      }
      function a(M, G) {
        if (!e)
          return null;
        for (var j = G; j !== null; )
          t(M, j), j = j.sibling;
        return null;
      }
      function i(M, G) {
        for (var j = /* @__PURE__ */ new Map(), ve = G; ve !== null; )
          ve.key !== null ? j.set(ve.key, ve) : j.set(ve.index, ve), ve = ve.sibling;
        return j;
      }
      function u(M, G) {
        var j = lc(M, G);
        return j.index = 0, j.sibling = null, j;
      }
      function s(M, G, j) {
        if (M.index = j, !e)
          return M.flags |= wi, G;
        var ve = M.alternate;
        if (ve !== null) {
          var ze = ve.index;
          return ze < G ? (M.flags |= En, G) : ze;
        } else
          return M.flags |= En, G;
      }
      function f(M) {
        return e && M.alternate === null && (M.flags |= En), M;
      }
      function p(M, G, j, ve) {
        if (G === null || G.tag !== ne) {
          var ze = uE(j, M.mode, ve);
          return ze.return = M, ze;
        } else {
          var Me = u(G, j);
          return Me.return = M, Me;
        }
      }
      function v(M, G, j, ve) {
        var ze = j.type;
        if (ze === di)
          return S(M, G, j.props.children, ve, j.key);
        if (G !== null && (G.elementType === ze || // Keep this check inline so it only runs on the false path:
        bw(G, j) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof ze == "object" && ze !== null && ze.$$typeof === vt && gC(ze) === G.type)) {
          var Me = u(G, j.props);
          return Me.ref = Cp(M, G, j), Me.return = M, Me._debugSource = j._source, Me._debugOwner = j._owner, Me;
        }
        var ct = lE(j, M.mode, ve);
        return ct.ref = Cp(M, G, j), ct.return = M, ct;
      }
      function y(M, G, j, ve) {
        if (G === null || G.tag !== ee || G.stateNode.containerInfo !== j.containerInfo || G.stateNode.implementation !== j.implementation) {
          var ze = oE(j, M.mode, ve);
          return ze.return = M, ze;
        } else {
          var Me = u(G, j.children || []);
          return Me.return = M, Me;
        }
      }
      function S(M, G, j, ve, ze) {
        if (G === null || G.tag !== K) {
          var Me = $o(j, M.mode, ve, ze);
          return Me.return = M, Me;
        } else {
          var ct = u(G, j);
          return ct.return = M, ct;
        }
      }
      function O(M, G, j) {
        if (typeof G == "string" && G !== "" || typeof G == "number") {
          var ve = uE("" + G, M.mode, j);
          return ve.return = M, ve;
        }
        if (typeof G == "object" && G !== null) {
          switch (G.$$typeof) {
            case kr: {
              var ze = lE(G, M.mode, j);
              return ze.ref = Cp(M, null, G), ze.return = M, ze;
            }
            case ir: {
              var Me = oE(G, M.mode, j);
              return Me.return = M, Me;
            }
            case vt: {
              var ct = G._payload, mt = G._init;
              return O(M, mt(ct), j);
            }
          }
          if (xt(G) || gt(G)) {
            var nn = $o(G, M.mode, j, null);
            return nn.return = M, nn;
          }
          Wh(M, G);
        }
        return typeof G == "function" && Gh(M), null;
      }
      function k(M, G, j, ve) {
        var ze = G !== null ? G.key : null;
        if (typeof j == "string" && j !== "" || typeof j == "number")
          return ze !== null ? null : p(M, G, "" + j, ve);
        if (typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case kr:
              return j.key === ze ? v(M, G, j, ve) : null;
            case ir:
              return j.key === ze ? y(M, G, j, ve) : null;
            case vt: {
              var Me = j._payload, ct = j._init;
              return k(M, G, ct(Me), ve);
            }
          }
          if (xt(j) || gt(j))
            return ze !== null ? null : S(M, G, j, ve, null);
          Wh(M, j);
        }
        return typeof j == "function" && Gh(M), null;
      }
      function F(M, G, j, ve, ze) {
        if (typeof ve == "string" && ve !== "" || typeof ve == "number") {
          var Me = M.get(j) || null;
          return p(G, Me, "" + ve, ze);
        }
        if (typeof ve == "object" && ve !== null) {
          switch (ve.$$typeof) {
            case kr: {
              var ct = M.get(ve.key === null ? j : ve.key) || null;
              return v(G, ct, ve, ze);
            }
            case ir: {
              var mt = M.get(ve.key === null ? j : ve.key) || null;
              return y(G, mt, ve, ze);
            }
            case vt:
              var nn = ve._payload, It = ve._init;
              return F(M, G, j, It(nn), ze);
          }
          if (xt(ve) || gt(ve)) {
            var Xn = M.get(j) || null;
            return S(G, Xn, ve, ze, null);
          }
          Wh(G, ve);
        }
        return typeof ve == "function" && Gh(G), null;
      }
      function B(M, G, j) {
        {
          if (typeof M != "object" || M === null)
            return G;
          switch (M.$$typeof) {
            case kr:
            case ir:
              yC(M, j);
              var ve = M.key;
              if (typeof ve != "string")
                break;
              if (G === null) {
                G = /* @__PURE__ */ new Set(), G.add(ve);
                break;
              }
              if (!G.has(ve)) {
                G.add(ve);
                break;
              }
              g("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", ve);
              break;
            case vt:
              var ze = M._payload, Me = M._init;
              B(Me(ze), G, j);
              break;
          }
        }
        return G;
      }
      function W(M, G, j, ve) {
        for (var ze = null, Me = 0; Me < j.length; Me++) {
          var ct = j[Me];
          ze = B(ct, ze, M);
        }
        for (var mt = null, nn = null, It = G, Xn = 0, Yt = 0, Yn = null; It !== null && Yt < j.length; Yt++) {
          It.index > Yt ? (Yn = It, It = null) : Yn = It.sibling;
          var ua = k(M, It, j[Yt], ve);
          if (ua === null) {
            It === null && (It = Yn);
            break;
          }
          e && It && ua.alternate === null && t(M, It), Xn = s(ua, Xn, Yt), nn === null ? mt = ua : nn.sibling = ua, nn = ua, It = Yn;
        }
        if (Yt === j.length) {
          if (a(M, It), Ur()) {
            var Yr = Yt;
            Ws(M, Yr);
          }
          return mt;
        }
        if (It === null) {
          for (; Yt < j.length; Yt++) {
            var si = O(M, j[Yt], ve);
            si !== null && (Xn = s(si, Xn, Yt), nn === null ? mt = si : nn.sibling = si, nn = si);
          }
          if (Ur()) {
            var wa = Yt;
            Ws(M, wa);
          }
          return mt;
        }
        for (var xa = i(M, It); Yt < j.length; Yt++) {
          var oa = F(xa, M, Yt, j[Yt], ve);
          oa !== null && (e && oa.alternate !== null && xa.delete(oa.key === null ? Yt : oa.key), Xn = s(oa, Xn, Yt), nn === null ? mt = oa : nn.sibling = oa, nn = oa);
        }
        if (e && xa.forEach(function(Qf) {
          return t(M, Qf);
        }), Ur()) {
          var Qu = Yt;
          Ws(M, Qu);
        }
        return mt;
      }
      function Ne(M, G, j, ve) {
        var ze = gt(j);
        if (typeof ze != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          j[Symbol.toStringTag] === "Generator" && (sg || g("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), sg = !0), j.entries === ze && (og || g("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), og = !0);
          var Me = ze.call(j);
          if (Me)
            for (var ct = null, mt = Me.next(); !mt.done; mt = Me.next()) {
              var nn = mt.value;
              ct = B(nn, ct, M);
            }
        }
        var It = ze.call(j);
        if (It == null)
          throw new Error("An iterable object provided no iterator.");
        for (var Xn = null, Yt = null, Yn = G, ua = 0, Yr = 0, si = null, wa = It.next(); Yn !== null && !wa.done; Yr++, wa = It.next()) {
          Yn.index > Yr ? (si = Yn, Yn = null) : si = Yn.sibling;
          var xa = k(M, Yn, wa.value, ve);
          if (xa === null) {
            Yn === null && (Yn = si);
            break;
          }
          e && Yn && xa.alternate === null && t(M, Yn), ua = s(xa, ua, Yr), Yt === null ? Xn = xa : Yt.sibling = xa, Yt = xa, Yn = si;
        }
        if (wa.done) {
          if (a(M, Yn), Ur()) {
            var oa = Yr;
            Ws(M, oa);
          }
          return Xn;
        }
        if (Yn === null) {
          for (; !wa.done; Yr++, wa = It.next()) {
            var Qu = O(M, wa.value, ve);
            Qu !== null && (ua = s(Qu, ua, Yr), Yt === null ? Xn = Qu : Yt.sibling = Qu, Yt = Qu);
          }
          if (Ur()) {
            var Qf = Yr;
            Ws(M, Qf);
          }
          return Xn;
        }
        for (var Zp = i(M, Yn); !wa.done; Yr++, wa = It.next()) {
          var Jl = F(Zp, M, Yr, wa.value, ve);
          Jl !== null && (e && Jl.alternate !== null && Zp.delete(Jl.key === null ? Yr : Jl.key), ua = s(Jl, ua, Yr), Yt === null ? Xn = Jl : Yt.sibling = Jl, Yt = Jl);
        }
        if (e && Zp.forEach(function(ik) {
          return t(M, ik);
        }), Ur()) {
          var ak = Yr;
          Ws(M, ak);
        }
        return Xn;
      }
      function it(M, G, j, ve) {
        if (G !== null && G.tag === ne) {
          a(M, G.sibling);
          var ze = u(G, j);
          return ze.return = M, ze;
        }
        a(M, G);
        var Me = uE(j, M.mode, ve);
        return Me.return = M, Me;
      }
      function Ke(M, G, j, ve) {
        for (var ze = j.key, Me = G; Me !== null; ) {
          if (Me.key === ze) {
            var ct = j.type;
            if (ct === di) {
              if (Me.tag === K) {
                a(M, Me.sibling);
                var mt = u(Me, j.props.children);
                return mt.return = M, mt._debugSource = j._source, mt._debugOwner = j._owner, mt;
              }
            } else if (Me.elementType === ct || // Keep this check inline so it only runs on the false path:
            bw(Me, j) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof ct == "object" && ct !== null && ct.$$typeof === vt && gC(ct) === Me.type) {
              a(M, Me.sibling);
              var nn = u(Me, j.props);
              return nn.ref = Cp(M, Me, j), nn.return = M, nn._debugSource = j._source, nn._debugOwner = j._owner, nn;
            }
            a(M, Me);
            break;
          } else
            t(M, Me);
          Me = Me.sibling;
        }
        if (j.type === di) {
          var It = $o(j.props.children, M.mode, ve, j.key);
          return It.return = M, It;
        } else {
          var Xn = lE(j, M.mode, ve);
          return Xn.ref = Cp(M, G, j), Xn.return = M, Xn;
        }
      }
      function At(M, G, j, ve) {
        for (var ze = j.key, Me = G; Me !== null; ) {
          if (Me.key === ze)
            if (Me.tag === ee && Me.stateNode.containerInfo === j.containerInfo && Me.stateNode.implementation === j.implementation) {
              a(M, Me.sibling);
              var ct = u(Me, j.children || []);
              return ct.return = M, ct;
            } else {
              a(M, Me);
              break;
            }
          else
            t(M, Me);
          Me = Me.sibling;
        }
        var mt = oE(j, M.mode, ve);
        return mt.return = M, mt;
      }
      function Ot(M, G, j, ve) {
        var ze = typeof j == "object" && j !== null && j.type === di && j.key === null;
        if (ze && (j = j.props.children), typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case kr:
              return f(Ke(M, G, j, ve));
            case ir:
              return f(At(M, G, j, ve));
            case vt:
              var Me = j._payload, ct = j._init;
              return Ot(M, G, ct(Me), ve);
          }
          if (xt(j))
            return W(M, G, j, ve);
          if (gt(j))
            return Ne(M, G, j, ve);
          Wh(M, j);
        }
        return typeof j == "string" && j !== "" || typeof j == "number" ? f(it(M, G, "" + j, ve)) : (typeof j == "function" && Gh(M), a(M, G));
      }
      return Ot;
    }
    var kf = SC(!0), EC = SC(!1);
    function jR(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = lc(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = lc(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function AR(e, t) {
      for (var a = e.child; a !== null; )
        w1(a, t), a = a.sibling;
    }
    var pg = No(null), vg;
    vg = {};
    var qh = null, Df = null, hg = null, Kh = !1;
    function Xh() {
      qh = null, Df = null, hg = null, Kh = !1;
    }
    function CC() {
      Kh = !0;
    }
    function wC() {
      Kh = !1;
    }
    function xC(e, t, a) {
      ia(pg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== vg && g("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = vg;
    }
    function mg(e, t) {
      var a = pg.current;
      aa(pg, t), e._currentValue = a;
    }
    function yg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (ku(i.childLanes, t) ? u !== null && !ku(u.childLanes, t) && (u.childLanes = St(u.childLanes, t)) : (i.childLanes = St(i.childLanes, t), u !== null && (u.childLanes = St(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && g("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function zR(e, t, a) {
      UR(e, t, a);
    }
    function UR(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === Q) {
                var p = bs(a), v = Hu(rn, p);
                v.tag = Zh;
                var y = i.updateQueue;
                if (y !== null) {
                  var S = y.shared, O = S.pending;
                  O === null ? v.next = v : (v.next = O.next, O.next = v), S.pending = v;
                }
              }
              i.lanes = St(i.lanes, a);
              var k = i.alternate;
              k !== null && (k.lanes = St(k.lanes, a)), yg(i.return, a, e), s.lanes = St(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === ce)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === Te) {
          var F = i.return;
          if (F === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          F.lanes = St(F.lanes, a);
          var B = F.alternate;
          B !== null && (B.lanes = St(B.lanes, a)), yg(F, a, e), u = i.sibling;
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
            var W = u.sibling;
            if (W !== null) {
              W.return = u.return, u = W;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Of(e, t) {
      qh = e, Df = null, hg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ea(a.lanes, t) && zp(), a.firstContext = null);
      }
    }
    function ar(e) {
      Kh && g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (hg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Df === null) {
          if (qh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Df = a, qh.dependencies = {
            lanes: le,
            firstContext: a
          };
        } else
          Df = Df.next = a;
      }
      return t;
    }
    var Js = null;
    function gg(e) {
      Js === null ? Js = [e] : Js.push(e);
    }
    function FR() {
      if (Js !== null) {
        for (var e = 0; e < Js.length; e++) {
          var t = Js[e], a = t.interleaved;
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
        Js = null;
      }
    }
    function bC(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, gg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Jh(e, i);
    }
    function PR(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, gg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function HR(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, gg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, Jh(e, i);
    }
    function Pa(e, t) {
      return Jh(e, t);
    }
    var VR = Jh;
    function Jh(e, t) {
      e.lanes = St(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = St(a.lanes, t)), a === null && (e.flags & (En | qr)) !== Je && Ew(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = St(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = St(a.childLanes, t) : (u.flags & (En | qr)) !== Je && Ew(e), i = u, u = u.return;
      if (i.tag === I) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var RC = 0, TC = 1, Zh = 2, Sg = 3, em = !1, Eg, tm;
    Eg = !1, tm = null;
    function Cg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: le
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function _C(e, t) {
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
    function Hu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: RC,
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
      if (tm === u && !Eg && (g("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), Eg = !0), P_()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, VR(e, a);
      } else
        return HR(e, u, t, a);
    }
    function nm(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (jd(a)) {
          var s = u.lanes;
          s = zd(s, e.pendingLanes);
          var f = St(s, a);
          u.lanes = f, tf(e, f);
        }
      }
    }
    function wg(e, t) {
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
    function BR(e, t, a, i, u, s) {
      switch (a.tag) {
        case TC: {
          var f = a.payload;
          if (typeof f == "function") {
            CC();
            var p = f.call(s, i, u);
            {
              if (e.mode & en) {
                Cn(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  Cn(!1);
                }
              }
              wC();
            }
            return p;
          }
          return f;
        }
        case Sg:
          e.flags = e.flags & ~er | Xe;
        case RC: {
          var v = a.payload, y;
          if (typeof v == "function") {
            CC(), y = v.call(s, i, u);
            {
              if (e.mode & en) {
                Cn(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  Cn(!1);
                }
              }
              wC();
            }
          } else
            y = v;
          return y == null ? i : Et({}, i, y);
        }
        case Zh:
          return em = !0, i;
      }
      return i;
    }
    function rm(e, t, a, i) {
      var u = e.updateQueue;
      em = !1, tm = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, y = v.next;
        v.next = null, f === null ? s = y : f.next = y, f = v;
        var S = e.alternate;
        if (S !== null) {
          var O = S.updateQueue, k = O.lastBaseUpdate;
          k !== f && (k === null ? O.firstBaseUpdate = y : k.next = y, O.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var F = u.baseState, B = le, W = null, Ne = null, it = null, Ke = s;
        do {
          var At = Ke.lane, Ot = Ke.eventTime;
          if (ku(i, At)) {
            if (it !== null) {
              var G = {
                eventTime: Ot,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Ft,
                tag: Ke.tag,
                payload: Ke.payload,
                callback: Ke.callback,
                next: null
              };
              it = it.next = G;
            }
            F = BR(e, u, Ke, F, t, a);
            var j = Ke.callback;
            if (j !== null && // If the update was already committed, we should not queue its
            // callback again.
            Ke.lane !== Ft) {
              e.flags |= sn;
              var ve = u.effects;
              ve === null ? u.effects = [Ke] : ve.push(Ke);
            }
          } else {
            var M = {
              eventTime: Ot,
              lane: At,
              tag: Ke.tag,
              payload: Ke.payload,
              callback: Ke.callback,
              next: null
            };
            it === null ? (Ne = it = M, W = F) : it = it.next = M, B = St(B, At);
          }
          if (Ke = Ke.next, Ke === null) {
            if (p = u.shared.pending, p === null)
              break;
            var ze = p, Me = ze.next;
            ze.next = null, Ke = Me, u.lastBaseUpdate = ze, u.shared.pending = null;
          }
        } while (!0);
        it === null && (W = F), u.baseState = W, u.firstBaseUpdate = Ne, u.lastBaseUpdate = it;
        var ct = u.shared.interleaved;
        if (ct !== null) {
          var mt = ct;
          do
            B = St(B, mt.lane), mt = mt.next;
          while (mt !== ct);
        } else s === null && (u.shared.lanes = le);
        Gp(B), e.lanes = B, e.memoizedState = F;
      }
      tm = null;
    }
    function IR(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function kC() {
      em = !1;
    }
    function am() {
      return em;
    }
    function DC(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, IR(f, a));
        }
    }
    var wp = {}, zo = No(wp), xp = No(wp), im = No(wp);
    function lm(e) {
      if (e === wp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function OC() {
      var e = lm(im.current);
      return e;
    }
    function xg(e, t) {
      ia(im, t, e), ia(xp, e, e), ia(zo, wp, e);
      var a = lb(t);
      aa(zo, e), ia(zo, a, e);
    }
    function Nf(e) {
      aa(zo, e), aa(xp, e), aa(im, e);
    }
    function bg() {
      var e = lm(zo.current);
      return e;
    }
    function NC(e) {
      lm(im.current);
      var t = lm(zo.current), a = ub(t, e.type);
      t !== a && (ia(xp, e, e), ia(zo, a, e));
    }
    function Rg(e) {
      xp.current === e && (aa(zo, e), aa(xp, e));
    }
    var YR = 0, LC = 1, MC = 1, bp = 2, il = No(YR);
    function Tg(e, t) {
      return (e & t) !== 0;
    }
    function Lf(e) {
      return e & LC;
    }
    function _g(e, t) {
      return e & LC | t;
    }
    function $R(e, t) {
      return e | t;
    }
    function Uo(e, t) {
      ia(il, t, e);
    }
    function Mf(e) {
      aa(il, e);
    }
    function QR(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function um(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === he) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || KE(i) || $y(i))
              return t;
          }
        } else if (t.tag === He && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & Xe) !== Je;
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
    var Ha = (
      /*   */
      0
    ), dr = (
      /* */
      1
    ), $l = (
      /*  */
      2
    ), pr = (
      /*    */
      4
    ), Fr = (
      /*   */
      8
    ), kg = [];
    function Dg() {
      for (var e = 0; e < kg.length; e++) {
        var t = kg[e];
        t._workInProgressVersionPrimary = null;
      }
      kg.length = 0;
    }
    function WR(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var Ae = x.ReactCurrentDispatcher, Rp = x.ReactCurrentBatchConfig, Og, jf;
    Og = /* @__PURE__ */ new Set();
    var Zs = le, tn = null, vr = null, hr = null, om = !1, Tp = !1, _p = 0, GR = 0, qR = 25, X = null, Ai = null, Fo = -1, Ng = !1;
    function Gt() {
      {
        var e = X;
        Ai === null ? Ai = [e] : Ai.push(e);
      }
    }
    function _e() {
      {
        var e = X;
        Ai !== null && (Fo++, Ai[Fo] !== e && KR(e));
      }
    }
    function Af(e) {
      e != null && !xt(e) && g("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", X, typeof e);
    }
    function KR(e) {
      {
        var t = pt(tn);
        if (!Og.has(t) && (Og.add(t), Ai !== null)) {
          for (var a = "", i = 30, u = 0; u <= Fo; u++) {
            for (var s = Ai[u], f = u === Fo ? e : s, p = u + 1 + ". " + s; p.length < i; )
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
    function Lg(e, t) {
      if (Ng)
        return !1;
      if (t === null)
        return g("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", X), !1;
      e.length !== t.length && g(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, X, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!se(e[a], t[a]))
          return !1;
      return !0;
    }
    function zf(e, t, a, i, u, s) {
      Zs = s, tn = t, Ai = e !== null ? e._debugHookTypes : null, Fo = -1, Ng = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = le, e !== null && e.memoizedState !== null ? Ae.current = t0 : Ai !== null ? Ae.current = e0 : Ae.current = ZC;
      var f = a(i, u);
      if (Tp) {
        var p = 0;
        do {
          if (Tp = !1, _p = 0, p >= qR)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Ng = !1, vr = null, hr = null, t.updateQueue = null, Fo = -1, Ae.current = n0, f = a(i, u);
        } while (Tp);
      }
      Ae.current = Cm, t._debugHookTypes = Ai;
      var v = vr !== null && vr.next !== null;
      if (Zs = le, tn = null, vr = null, hr = null, X = null, Ai = null, Fo = -1, e !== null && (e.flags & Fn) !== (t.flags & Fn) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & Rt) !== Ze && g("Internal React error: Expected static flag was missing. Please notify the React team."), om = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function Uf() {
      var e = _p !== 0;
      return _p = 0, e;
    }
    function jC(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & Vt) !== Ze ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Rs(e.lanes, a);
    }
    function AC() {
      if (Ae.current = Cm, om) {
        for (var e = tn.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        om = !1;
      }
      Zs = le, tn = null, vr = null, hr = null, Ai = null, Fo = -1, X = null, GC = !1, Tp = !1, _p = 0;
    }
    function Ql() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return hr === null ? tn.memoizedState = hr = e : hr = hr.next = e, hr;
    }
    function zi() {
      var e;
      if (vr === null) {
        var t = tn.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = vr.next;
      var a;
      if (hr === null ? a = tn.memoizedState : a = hr.next, a !== null)
        hr = a, a = hr.next, vr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        vr = e;
        var i = {
          memoizedState: vr.memoizedState,
          baseState: vr.baseState,
          baseQueue: vr.baseQueue,
          queue: vr.queue,
          next: null
        };
        hr === null ? tn.memoizedState = hr = i : hr = hr.next = i;
      }
      return hr;
    }
    function zC() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Mg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function jg(e, t, a) {
      var i = Ql(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: le,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = eT.bind(null, tn, s);
      return [i.memoizedState, f];
    }
    function Ag(e, t, a) {
      var i = zi(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = vr, f = s.baseQueue, p = u.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, y = p.next;
          f.next = y, p.next = v;
        }
        s.baseQueue !== f && g("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, u.pending = null;
      }
      if (f !== null) {
        var S = f.next, O = s.baseState, k = null, F = null, B = null, W = S;
        do {
          var Ne = W.lane;
          if (ku(Zs, Ne)) {
            if (B !== null) {
              var Ke = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Ft,
                action: W.action,
                hasEagerState: W.hasEagerState,
                eagerState: W.eagerState,
                next: null
              };
              B = B.next = Ke;
            }
            if (W.hasEagerState)
              O = W.eagerState;
            else {
              var At = W.action;
              O = e(O, At);
            }
          } else {
            var it = {
              lane: Ne,
              action: W.action,
              hasEagerState: W.hasEagerState,
              eagerState: W.eagerState,
              next: null
            };
            B === null ? (F = B = it, k = O) : B = B.next = it, tn.lanes = St(tn.lanes, Ne), Gp(Ne);
          }
          W = W.next;
        } while (W !== null && W !== S);
        B === null ? k = O : B.next = F, se(O, i.memoizedState) || zp(), i.memoizedState = O, i.baseState = k, i.baseQueue = B, u.lastRenderedState = O;
      }
      var Ot = u.interleaved;
      if (Ot !== null) {
        var M = Ot;
        do {
          var G = M.lane;
          tn.lanes = St(tn.lanes, G), Gp(G), M = M.next;
        } while (M !== Ot);
      } else f === null && (u.lanes = le);
      var j = u.dispatch;
      return [i.memoizedState, j];
    }
    function zg(e, t, a) {
      var i = zi(), u = i.queue;
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
        se(p, i.memoizedState) || zp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function uD(e, t, a) {
    }
    function oD(e, t, a) {
    }
    function Ug(e, t, a) {
      var i = tn, u = Ql(), s, f = Ur();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), jf || s !== a() && (g("The result of getServerSnapshot should be cached to avoid an infinite loop"), jf = !0);
      } else {
        if (s = t(), !jf) {
          var p = t();
          se(s, p) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), jf = !0);
        }
        var v = Hm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(v, Zs) || UC(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, pm(PC.bind(null, i, y, e), [e]), i.flags |= Gr, kp(dr | Fr, FC.bind(null, i, y, s, t), void 0, null), s;
    }
    function sm(e, t, a) {
      var i = tn, u = zi(), s = t();
      if (!jf) {
        var f = t();
        se(s, f) || (g("The result of getSnapshot should be cached to avoid an infinite loop"), jf = !0);
      }
      var p = u.memoizedState, v = !se(p, s);
      v && (u.memoizedState = s, zp());
      var y = u.queue;
      if (Op(PC.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      hr !== null && hr.memoizedState.tag & dr) {
        i.flags |= Gr, kp(dr | Fr, FC.bind(null, i, y, s, t), void 0, null);
        var S = Hm();
        if (S === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Zc(S, Zs) || UC(i, t, s);
      }
      return s;
    }
    function UC(e, t, a) {
      e.flags |= ho;
      var i = {
        getSnapshot: t,
        value: a
      }, u = tn.updateQueue;
      if (u === null)
        u = zC(), tn.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function FC(e, t, a, i) {
      t.value = a, t.getSnapshot = i, HC(t) && VC(e);
    }
    function PC(e, t, a) {
      var i = function() {
        HC(t) && VC(e);
      };
      return a(i);
    }
    function HC(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !se(a, i);
      } catch {
        return !0;
      }
    }
    function VC(e) {
      var t = Pa(e, st);
      t !== null && Sr(t, e, st, rn);
    }
    function cm(e) {
      var t = Ql();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: le,
        dispatch: null,
        lastRenderedReducer: Mg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = tT.bind(null, tn, a);
      return [t.memoizedState, i];
    }
    function Fg(e) {
      return Ag(Mg);
    }
    function Pg(e) {
      return zg(Mg);
    }
    function kp(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = tn.updateQueue;
      if (s === null)
        s = zC(), tn.updateQueue = s, s.lastEffect = u.next = u;
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
    function fm(e) {
      var t = zi();
      return t.memoizedState;
    }
    function Dp(e, t, a, i) {
      var u = Ql(), s = i === void 0 ? null : i;
      tn.flags |= e, u.memoizedState = kp(dr | t, a, void 0, s);
    }
    function dm(e, t, a, i) {
      var u = zi(), s = i === void 0 ? null : i, f = void 0;
      if (vr !== null) {
        var p = vr.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (Lg(s, v)) {
            u.memoizedState = kp(t, a, f, s);
            return;
          }
        }
      }
      tn.flags |= e, u.memoizedState = kp(dr | t, a, f, s);
    }
    function pm(e, t) {
      return (tn.mode & Vt) !== Ze ? Dp(xi | Gr | Tc, Fr, e, t) : Dp(Gr | Tc, Fr, e, t);
    }
    function Op(e, t) {
      return dm(Gr, Fr, e, t);
    }
    function Vg(e, t) {
      return Dp(Lt, $l, e, t);
    }
    function vm(e, t) {
      return dm(Lt, $l, e, t);
    }
    function Bg(e, t) {
      var a = Lt;
      return a |= Wi, (tn.mode & Vt) !== Ze && (a |= _l), Dp(a, pr, e, t);
    }
    function hm(e, t) {
      return dm(Lt, pr, e, t);
    }
    function BC(e, t) {
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
    function Ig(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = Lt;
      return u |= Wi, (tn.mode & Vt) !== Ze && (u |= _l), Dp(u, pr, BC.bind(null, t, e), i);
    }
    function mm(e, t, a) {
      typeof t != "function" && g("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return dm(Lt, pr, BC.bind(null, t, e), i);
    }
    function XR(e, t) {
    }
    var ym = XR;
    function Yg(e, t) {
      var a = Ql(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function gm(e, t) {
      var a = zi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Lg(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function $g(e, t) {
      var a = Ql(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function Sm(e, t) {
      var a = zi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Lg(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Qg(e) {
      var t = Ql();
      return t.memoizedState = e, e;
    }
    function IC(e) {
      var t = zi(), a = vr, i = a.memoizedState;
      return $C(t, i, e);
    }
    function YC(e) {
      var t = zi();
      if (vr === null)
        return t.memoizedState = e, e;
      var a = vr.memoizedState;
      return $C(t, a, e);
    }
    function $C(e, t, a) {
      var i = !Ld(Zs);
      if (i) {
        if (!se(a, t)) {
          var u = Ad();
          tn.lanes = St(tn.lanes, u), Gp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, zp()), e.memoizedState = a, a;
    }
    function JR(e, t, a) {
      var i = za();
      Vn(Kv(i, _i)), e(!0);
      var u = Rp.transition;
      Rp.transition = {};
      var s = Rp.transition;
      Rp.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Vn(i), Rp.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && A("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Wg() {
      var e = cm(!1), t = e[0], a = e[1], i = JR.bind(null, a), u = Ql();
      return u.memoizedState = i, [t, i];
    }
    function QC() {
      var e = Fg(), t = e[0], a = zi(), i = a.memoizedState;
      return [t, i];
    }
    function WC() {
      var e = Pg(), t = e[0], a = zi(), i = a.memoizedState;
      return [t, i];
    }
    var GC = !1;
    function ZR() {
      return GC;
    }
    function Gg() {
      var e = Ql(), t = Hm(), a = t.identifierPrefix, i;
      if (Ur()) {
        var u = mR();
        i = ":" + a + "R" + u;
        var s = _p++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = GR++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function Em() {
      var e = zi(), t = e.memoizedState;
      return t;
    }
    function eT(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Io(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (qC(e))
        KC(t, u);
      else {
        var s = bC(e, t, u, i);
        if (s !== null) {
          var f = Ca();
          Sr(s, e, i, f), XC(s, t, i);
        }
      }
      JC(e, i);
    }
    function tT(e, t, a) {
      typeof arguments[3] == "function" && g("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Io(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (qC(e))
        KC(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === le && (s === null || s.lanes === le)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = Ae.current, Ae.current = ll;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, se(y, v)) {
                PR(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              Ae.current = p;
            }
          }
        }
        var S = bC(e, t, u, i);
        if (S !== null) {
          var O = Ca();
          Sr(S, e, i, O), XC(S, t, i);
        }
      }
      JC(e, i);
    }
    function qC(e) {
      var t = e.alternate;
      return e === tn || t !== null && t === tn;
    }
    function KC(e, t) {
      Tp = om = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function XC(e, t, a) {
      if (jd(a)) {
        var i = t.lanes;
        i = zd(i, e.pendingLanes);
        var u = St(i, a);
        t.lanes = u, tf(e, u);
      }
    }
    function JC(e, t, a) {
      hs(e, t);
    }
    var Cm = {
      readContext: ar,
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
      unstable_isNewReconciler: me
    }, ZC = null, e0 = null, t0 = null, n0 = null, Wl = null, ll = null, wm = null;
    {
      var qg = function() {
        g("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, ht = function() {
        g("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      ZC = {
        readContext: function(e) {
          return ar(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", Gt(), Af(t), Yg(e, t);
        },
        useContext: function(e) {
          return X = "useContext", Gt(), ar(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", Gt(), Af(t), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", Gt(), Af(a), Ig(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", Gt(), Af(t), Vg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", Gt(), Af(t), Bg(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", Gt(), Af(t);
          var a = Ae.current;
          Ae.current = Wl;
          try {
            return $g(e, t);
          } finally {
            Ae.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", Gt();
          var i = Ae.current;
          Ae.current = Wl;
          try {
            return jg(e, t, a);
          } finally {
            Ae.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", Gt(), Hg(e);
        },
        useState: function(e) {
          X = "useState", Gt();
          var t = Ae.current;
          Ae.current = Wl;
          try {
            return cm(e);
          } finally {
            Ae.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", Gt(), void 0;
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", Gt(), Qg(e);
        },
        useTransition: function() {
          return X = "useTransition", Gt(), Wg();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", Gt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", Gt(), Ug(e, t, a);
        },
        useId: function() {
          return X = "useId", Gt(), Gg();
        },
        unstable_isNewReconciler: me
      }, e0 = {
        readContext: function(e) {
          return ar(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", _e(), Yg(e, t);
        },
        useContext: function(e) {
          return X = "useContext", _e(), ar(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", _e(), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", _e(), Ig(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", _e(), Vg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", _e(), Bg(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", _e();
          var a = Ae.current;
          Ae.current = Wl;
          try {
            return $g(e, t);
          } finally {
            Ae.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", _e();
          var i = Ae.current;
          Ae.current = Wl;
          try {
            return jg(e, t, a);
          } finally {
            Ae.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", _e(), Hg(e);
        },
        useState: function(e) {
          X = "useState", _e();
          var t = Ae.current;
          Ae.current = Wl;
          try {
            return cm(e);
          } finally {
            Ae.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", _e(), void 0;
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", _e(), Qg(e);
        },
        useTransition: function() {
          return X = "useTransition", _e(), Wg();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", _e(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", _e(), Ug(e, t, a);
        },
        useId: function() {
          return X = "useId", _e(), Gg();
        },
        unstable_isNewReconciler: me
      }, t0 = {
        readContext: function(e) {
          return ar(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", _e(), gm(e, t);
        },
        useContext: function(e) {
          return X = "useContext", _e(), ar(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", _e(), Op(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", _e(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", _e(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", _e(), hm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", _e();
          var a = Ae.current;
          Ae.current = ll;
          try {
            return Sm(e, t);
          } finally {
            Ae.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", _e();
          var i = Ae.current;
          Ae.current = ll;
          try {
            return Ag(e, t, a);
          } finally {
            Ae.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", _e(), fm();
        },
        useState: function(e) {
          X = "useState", _e();
          var t = Ae.current;
          Ae.current = ll;
          try {
            return Fg(e);
          } finally {
            Ae.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", _e(), ym();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", _e(), IC(e);
        },
        useTransition: function() {
          return X = "useTransition", _e(), QC();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", _e(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", _e(), sm(e, t);
        },
        useId: function() {
          return X = "useId", _e(), Em();
        },
        unstable_isNewReconciler: me
      }, n0 = {
        readContext: function(e) {
          return ar(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", _e(), gm(e, t);
        },
        useContext: function(e) {
          return X = "useContext", _e(), ar(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", _e(), Op(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", _e(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", _e(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", _e(), hm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", _e();
          var a = Ae.current;
          Ae.current = wm;
          try {
            return Sm(e, t);
          } finally {
            Ae.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", _e();
          var i = Ae.current;
          Ae.current = wm;
          try {
            return zg(e, t, a);
          } finally {
            Ae.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", _e(), fm();
        },
        useState: function(e) {
          X = "useState", _e();
          var t = Ae.current;
          Ae.current = wm;
          try {
            return Pg(e);
          } finally {
            Ae.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", _e(), ym();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", _e(), YC(e);
        },
        useTransition: function() {
          return X = "useTransition", _e(), WC();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", _e(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", _e(), sm(e, t);
        },
        useId: function() {
          return X = "useId", _e(), Em();
        },
        unstable_isNewReconciler: me
      }, Wl = {
        readContext: function(e) {
          return qg(), ar(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", ht(), Gt(), Yg(e, t);
        },
        useContext: function(e) {
          return X = "useContext", ht(), Gt(), ar(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", ht(), Gt(), pm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", ht(), Gt(), Ig(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", ht(), Gt(), Vg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", ht(), Gt(), Bg(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", ht(), Gt();
          var a = Ae.current;
          Ae.current = Wl;
          try {
            return $g(e, t);
          } finally {
            Ae.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", ht(), Gt();
          var i = Ae.current;
          Ae.current = Wl;
          try {
            return jg(e, t, a);
          } finally {
            Ae.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", ht(), Gt(), Hg(e);
        },
        useState: function(e) {
          X = "useState", ht(), Gt();
          var t = Ae.current;
          Ae.current = Wl;
          try {
            return cm(e);
          } finally {
            Ae.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", ht(), Gt(), void 0;
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", ht(), Gt(), Qg(e);
        },
        useTransition: function() {
          return X = "useTransition", ht(), Gt(), Wg();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", ht(), Gt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", ht(), Gt(), Ug(e, t, a);
        },
        useId: function() {
          return X = "useId", ht(), Gt(), Gg();
        },
        unstable_isNewReconciler: me
      }, ll = {
        readContext: function(e) {
          return qg(), ar(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", ht(), _e(), gm(e, t);
        },
        useContext: function(e) {
          return X = "useContext", ht(), _e(), ar(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", ht(), _e(), Op(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", ht(), _e(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", ht(), _e(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", ht(), _e(), hm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", ht(), _e();
          var a = Ae.current;
          Ae.current = ll;
          try {
            return Sm(e, t);
          } finally {
            Ae.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", ht(), _e();
          var i = Ae.current;
          Ae.current = ll;
          try {
            return Ag(e, t, a);
          } finally {
            Ae.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", ht(), _e(), fm();
        },
        useState: function(e) {
          X = "useState", ht(), _e();
          var t = Ae.current;
          Ae.current = ll;
          try {
            return Fg(e);
          } finally {
            Ae.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", ht(), _e(), ym();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", ht(), _e(), IC(e);
        },
        useTransition: function() {
          return X = "useTransition", ht(), _e(), QC();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", ht(), _e(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", ht(), _e(), sm(e, t);
        },
        useId: function() {
          return X = "useId", ht(), _e(), Em();
        },
        unstable_isNewReconciler: me
      }, wm = {
        readContext: function(e) {
          return qg(), ar(e);
        },
        useCallback: function(e, t) {
          return X = "useCallback", ht(), _e(), gm(e, t);
        },
        useContext: function(e) {
          return X = "useContext", ht(), _e(), ar(e);
        },
        useEffect: function(e, t) {
          return X = "useEffect", ht(), _e(), Op(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return X = "useImperativeHandle", ht(), _e(), mm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return X = "useInsertionEffect", ht(), _e(), vm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return X = "useLayoutEffect", ht(), _e(), hm(e, t);
        },
        useMemo: function(e, t) {
          X = "useMemo", ht(), _e();
          var a = Ae.current;
          Ae.current = ll;
          try {
            return Sm(e, t);
          } finally {
            Ae.current = a;
          }
        },
        useReducer: function(e, t, a) {
          X = "useReducer", ht(), _e();
          var i = Ae.current;
          Ae.current = ll;
          try {
            return zg(e, t, a);
          } finally {
            Ae.current = i;
          }
        },
        useRef: function(e) {
          return X = "useRef", ht(), _e(), fm();
        },
        useState: function(e) {
          X = "useState", ht(), _e();
          var t = Ae.current;
          Ae.current = ll;
          try {
            return Pg(e);
          } finally {
            Ae.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return X = "useDebugValue", ht(), _e(), ym();
        },
        useDeferredValue: function(e) {
          return X = "useDeferredValue", ht(), _e(), YC(e);
        },
        useTransition: function() {
          return X = "useTransition", ht(), _e(), WC();
        },
        useMutableSource: function(e, t, a) {
          return X = "useMutableSource", ht(), _e(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return X = "useSyncExternalStore", ht(), _e(), sm(e, t);
        },
        useId: function() {
          return X = "useId", ht(), _e(), Em();
        },
        unstable_isNewReconciler: me
      };
    }
    var Po = w.unstable_now, r0 = 0, xm = -1, Np = -1, bm = -1, Kg = !1, Rm = !1;
    function a0() {
      return Kg;
    }
    function nT() {
      Rm = !0;
    }
    function rT() {
      Kg = !1, Rm = !1;
    }
    function aT() {
      Kg = Rm, Rm = !1;
    }
    function i0() {
      return r0;
    }
    function l0() {
      r0 = Po();
    }
    function Xg(e) {
      Np = Po(), e.actualStartTime < 0 && (e.actualStartTime = Po());
    }
    function u0(e) {
      Np = -1;
    }
    function Tm(e, t) {
      if (Np >= 0) {
        var a = Po() - Np;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Np = -1;
      }
    }
    function Gl(e) {
      if (xm >= 0) {
        var t = Po() - xm;
        xm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case I:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case Le:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function Jg(e) {
      if (bm >= 0) {
        var t = Po() - bm;
        bm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case I:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case Le:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function ql() {
      xm = Po();
    }
    function Zg() {
      bm = Po();
    }
    function eS(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ul(e, t) {
      if (e && e.defaultProps) {
        var a = Et({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var tS = {}, nS, rS, aS, iS, lS, o0, _m, uS, oS, sS, Lp;
    {
      nS = /* @__PURE__ */ new Set(), rS = /* @__PURE__ */ new Set(), aS = /* @__PURE__ */ new Set(), iS = /* @__PURE__ */ new Set(), uS = /* @__PURE__ */ new Set(), lS = /* @__PURE__ */ new Set(), oS = /* @__PURE__ */ new Set(), sS = /* @__PURE__ */ new Set(), Lp = /* @__PURE__ */ new Set();
      var s0 = /* @__PURE__ */ new Set();
      _m = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          s0.has(a) || (s0.add(a), g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, o0 = function(e, t) {
        if (t === void 0) {
          var a = zt(e) || "Component";
          lS.has(a) || (lS.add(a), g("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(tS, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(tS);
    }
    function cS(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & en) {
          Cn(!0);
          try {
            s = a(i, u);
          } finally {
            Cn(!1);
          }
        }
        o0(t, s);
      }
      var f = s == null ? u : Et({}, u, s);
      if (e.memoizedState = f, e.lanes === le) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var fS = {
      isMounted: jv,
      enqueueSetState: function(e, t, a) {
        var i = vo(e), u = Ca(), s = Io(i), f = Hu(u, s);
        f.payload = t, a != null && (_m(a, "setState"), f.callback = a);
        var p = Ao(i, f, s);
        p !== null && (Sr(p, i, s, u), nm(p, i, s)), hs(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = vo(e), u = Ca(), s = Io(i), f = Hu(u, s);
        f.tag = TC, f.payload = t, a != null && (_m(a, "replaceState"), f.callback = a);
        var p = Ao(i, f, s);
        p !== null && (Sr(p, i, s, u), nm(p, i, s)), hs(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = vo(e), i = Ca(), u = Io(a), s = Hu(i, u);
        s.tag = Zh, t != null && (_m(t, "forceUpdate"), s.callback = t);
        var f = Ao(a, s, u);
        f !== null && (Sr(f, a, u, i), nm(f, a, u)), Mc(a, u);
      }
    };
    function c0(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & en) {
            Cn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              Cn(!1);
            }
          }
          v === void 0 && g("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", zt(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Ye(a, i) || !Ye(u, s) : !0;
    }
    function iT(e, t, a) {
      var i = e.stateNode;
      {
        var u = zt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? g("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : g("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && g("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && g("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && g("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && g("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), t.childContextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & en) === Ze && (Lp.add(t), g(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), t.contextTypes && !Lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & en) === Ze && (Lp.add(t), g(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u)), i.contextTypes && g("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !oS.has(t) && (oS.add(t), g("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && g("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && g("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", zt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && g("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && g("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && g("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && g("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && g("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && g("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !aS.has(t) && (aS.add(t), g("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", zt(t))), typeof i.getDerivedStateFromProps == "function" && g("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && g("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && g("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || xt(p)) && g("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && g("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function f0(e, t) {
      t.updater = fS, e.stateNode = t, vu(t, e), t._reactInternalInstance = tS;
    }
    function d0(e, t, a) {
      var i = !1, u = ui, s = ui, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === R && f._context === void 0
        );
        if (!p && !sS.has(t)) {
          sS.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === vi ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", g("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", zt(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = ar(f);
      else {
        u = xf(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? bf(e, u) : ui;
      }
      var S = new t(a, s);
      if (e.mode & en) {
        Cn(!0);
        try {
          S = new t(a, s);
        } finally {
          Cn(!1);
        }
      }
      var O = e.memoizedState = S.state !== null && S.state !== void 0 ? S.state : null;
      f0(e, S);
      {
        if (typeof t.getDerivedStateFromProps == "function" && O === null) {
          var k = zt(t) || "Component";
          rS.has(k) || (rS.add(k), g("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", k, S.state === null ? "null" : "undefined", k));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof S.getSnapshotBeforeUpdate == "function") {
          var F = null, B = null, W = null;
          if (typeof S.componentWillMount == "function" && S.componentWillMount.__suppressDeprecationWarning !== !0 ? F = "componentWillMount" : typeof S.UNSAFE_componentWillMount == "function" && (F = "UNSAFE_componentWillMount"), typeof S.componentWillReceiveProps == "function" && S.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? B = "componentWillReceiveProps" : typeof S.UNSAFE_componentWillReceiveProps == "function" && (B = "UNSAFE_componentWillReceiveProps"), typeof S.componentWillUpdate == "function" && S.componentWillUpdate.__suppressDeprecationWarning !== !0 ? W = "componentWillUpdate" : typeof S.UNSAFE_componentWillUpdate == "function" && (W = "UNSAFE_componentWillUpdate"), F !== null || B !== null || W !== null) {
            var Ne = zt(t) || "Component", it = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            iS.has(Ne) || (iS.add(Ne), g(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, Ne, it, F !== null ? `
  ` + F : "", B !== null ? `
  ` + B : "", W !== null ? `
  ` + W : ""));
          }
        }
      }
      return i && tC(e, u, s), S;
    }
    function lT(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (g("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", pt(e) || "Component"), fS.enqueueReplaceState(t, t.state, null));
    }
    function p0(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = pt(e) || "Component";
          nS.has(s) || (nS.add(s), g("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        fS.enqueueReplaceState(t, t.state, null);
      }
    }
    function dS(e, t, a, i) {
      iT(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = {}, Cg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = ar(s);
      else {
        var f = xf(e, t, !0);
        u.context = bf(e, f);
      }
      {
        if (u.state === a) {
          var p = zt(t) || "Component";
          uS.has(p) || (uS.add(p), g("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & en && al.recordLegacyContextWarning(e, u), al.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (cS(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (lT(e, u), rm(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = Lt;
        y |= Wi, (e.mode & Vt) !== Ze && (y |= _l), e.flags |= y;
      }
    }
    function uT(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = ui;
      if (typeof p == "object" && p !== null)
        v = ar(p);
      else {
        var y = xf(e, t, !0);
        v = bf(e, y);
      }
      var S = t.getDerivedStateFromProps, O = typeof S == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !O && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && p0(e, u, a, v), kC();
      var k = e.memoizedState, F = u.state = k;
      if (rm(e, a, u, i), F = e.memoizedState, s === a && k === F && !Fh() && !am()) {
        if (typeof u.componentDidMount == "function") {
          var B = Lt;
          B |= Wi, (e.mode & Vt) !== Ze && (B |= _l), e.flags |= B;
        }
        return !1;
      }
      typeof S == "function" && (cS(e, t, S, a), F = e.memoizedState);
      var W = am() || c0(e, t, s, a, k, F, v);
      if (W) {
        if (!O && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var Ne = Lt;
          Ne |= Wi, (e.mode & Vt) !== Ze && (Ne |= _l), e.flags |= Ne;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var it = Lt;
          it |= Wi, (e.mode & Vt) !== Ze && (it |= _l), e.flags |= it;
        }
        e.memoizedProps = a, e.memoizedState = F;
      }
      return u.props = a, u.state = F, u.context = v, W;
    }
    function oT(e, t, a, i, u) {
      var s = t.stateNode;
      _C(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : ul(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, S = a.contextType, O = ui;
      if (typeof S == "object" && S !== null)
        O = ar(S);
      else {
        var k = xf(t, a, !0);
        O = bf(t, k);
      }
      var F = a.getDerivedStateFromProps, B = typeof F == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !B && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== O) && p0(t, s, i, O), kC();
      var W = t.memoizedState, Ne = s.state = W;
      if (rm(t, i, s, u), Ne = t.memoizedState, f === v && W === Ne && !Fh() && !am() && !Qe)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= Lt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= Gn), !1;
      typeof F == "function" && (cS(t, a, F, i), Ne = t.memoizedState);
      var it = am() || c0(t, a, p, i, W, Ne, O) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Qe;
      return it ? (!B && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, Ne, O), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, Ne, O)), typeof s.componentDidUpdate == "function" && (t.flags |= Lt), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Gn)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= Lt), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || W !== e.memoizedState) && (t.flags |= Gn), t.memoizedProps = i, t.memoizedState = Ne), s.props = i, s.state = Ne, s.context = O, it;
    }
    function ec(e, t) {
      return {
        value: e,
        source: t,
        stack: Vi(t),
        digest: null
      };
    }
    function pS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function sT(e, t) {
      return !0;
    }
    function vS(e, t) {
      try {
        var a = sT(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === Q)
            return;
          console.error(i);
        }
        var p = u ? pt(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === I)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var S = pt(e) || "Anonymous";
          y = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + S + ".");
        }
        var O = v + `
` + f + `

` + ("" + y);
        console.error(O);
      } catch (k) {
        setTimeout(function() {
          throw k;
        });
      }
    }
    var cT = typeof WeakMap == "function" ? WeakMap : Map;
    function v0(e, t, a) {
      var i = Hu(rn, a);
      i.tag = Sg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        n1(u), vS(e, t);
      }, i;
    }
    function hS(e, t, a) {
      var i = Hu(rn, a);
      i.tag = Sg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          Rw(e), vS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        Rw(e), vS(e, t), typeof u != "function" && e1(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (ea(e.lanes, st) || g("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", pt(e) || "Unknown"));
      }), i;
    }
    function h0(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new cT(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = r1.bind(null, e, t, a);
        Jr && qp(e, a), t.then(s, s);
      }
    }
    function fT(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function dT(e, t) {
      var a = e.tag;
      if ((e.mode & Rt) === Ze && (a === U || a === ge || a === P)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function m0(e) {
      var t = e;
      do {
        if (t.tag === he && QR(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function y0(e, t, a, i, u) {
      if ((e.mode & Rt) === Ze) {
        if (e === t)
          e.flags |= er;
        else {
          if (e.flags |= Xe, a.flags |= Rc, a.flags &= -52805, a.tag === Q) {
            var s = a.alternate;
            if (s === null)
              a.tag = ie;
            else {
              var f = Hu(rn, st);
              f.tag = Zh, Ao(a, f, st);
            }
          }
          a.lanes = St(a.lanes, st);
        }
        return e;
      }
      return e.flags |= er, e.lanes = u, e;
    }
    function pT(e, t, a, i, u) {
      if (a.flags |= ss, Jr && qp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        dT(a), Ur() && a.mode & Rt && oC();
        var f = m0(t);
        if (f !== null) {
          f.flags &= ~xr, y0(f, t, a, e, u), f.mode & Rt && h0(e, s, u), fT(f, e, s);
          return;
        } else {
          if (!Bv(u)) {
            h0(e, s, u), GS();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (Ur() && a.mode & Rt) {
        oC();
        var v = m0(t);
        if (v !== null) {
          (v.flags & er) === Je && (v.flags |= xr), y0(v, t, a, e, u), ug(ec(i, a));
          return;
        }
      }
      i = ec(i, a), Q_(i);
      var y = t;
      do {
        switch (y.tag) {
          case I: {
            var S = i;
            y.flags |= er;
            var O = bs(u);
            y.lanes = St(y.lanes, O);
            var k = v0(y, S, O);
            wg(y, k);
            return;
          }
          case Q:
            var F = i, B = y.type, W = y.stateNode;
            if ((y.flags & Xe) === Je && (typeof B.getDerivedStateFromError == "function" || W !== null && typeof W.componentDidCatch == "function" && !mw(W))) {
              y.flags |= er;
              var Ne = bs(u);
              y.lanes = St(y.lanes, Ne);
              var it = hS(y, F, Ne);
              wg(y, it);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function vT() {
      return null;
    }
    var Mp = x.ReactCurrentOwner, ol = !1, mS, jp, yS, gS, SS, tc, ES, km, Ap;
    mS = {}, jp = {}, yS = {}, gS = {}, SS = {}, tc = !1, ES = {}, km = {}, Ap = {};
    function Sa(e, t, a, i) {
      e === null ? t.child = EC(t, null, a, i) : t.child = kf(t, e.child, a, i);
    }
    function hT(e, t, a, i) {
      t.child = kf(t, e.child, null, i), t.child = kf(t, null, a, i);
    }
    function g0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          zt(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      Of(t, u), ha(t);
      {
        if (Mp.current = t, Wn(!0), v = zf(e, t, f, i, p, u), y = Uf(), t.mode & en) {
          Cn(!0);
          try {
            v = zf(e, t, f, i, p, u), y = Uf();
          } finally {
            Cn(!1);
          }
        }
        Wn(!1);
      }
      return ma(), e !== null && !ol ? (jC(e, t, u), Vu(e, t, u)) : (Ur() && y && tg(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function S0(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (E1(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = $f(s), t.tag = P, t.type = f, xS(t, s), E0(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          if (p && nl(
            p,
            i,
            // Resolved props
            "prop",
            zt(s)
          ), a.defaultProps !== void 0) {
            var v = zt(s) || "Unknown";
            Ap[v] || (g("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), Ap[v] = !0);
          }
        }
        var y = iE(a.type, null, i, t, t.mode, u);
        return y.ref = t.ref, y.return = t, t.child = y, y;
      }
      {
        var S = a.type, O = S.propTypes;
        O && nl(
          O,
          i,
          // Resolved props
          "prop",
          zt(S)
        );
      }
      var k = e.child, F = DS(e, u);
      if (!F) {
        var B = k.memoizedProps, W = a.compare;
        if (W = W !== null ? W : Ye, W(B, i) && e.ref === t.ref)
          return Vu(e, t, u);
      }
      t.flags |= ni;
      var Ne = lc(k, i);
      return Ne.ref = t.ref, Ne.return = t, t.child = Ne, Ne;
    }
    function E0(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === vt) {
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
            zt(s)
          );
        }
      }
      if (e !== null) {
        var S = e.memoizedProps;
        if (Ye(S, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ol = !1, t.pendingProps = i = S, DS(e, u))
            (e.flags & Rc) !== Je && (ol = !0);
          else return t.lanes = e.lanes, Vu(e, t, u);
      }
      return CS(e, t, a, i, u);
    }
    function C0(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || we)
        if ((t.mode & Rt) === Ze) {
          var f = {
            baseLanes: le,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Vm(t, a);
        } else if (ea(a, Zr)) {
          var O = {
            baseLanes: le,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = O;
          var k = s !== null ? s.baseLanes : a;
          Vm(t, k);
        } else {
          var p = null, v;
          if (s !== null) {
            var y = s.baseLanes;
            v = St(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = Zr;
          var S = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = S, t.updateQueue = null, Vm(t, v), null;
        }
      else {
        var F;
        s !== null ? (F = St(s.baseLanes, a), t.memoizedState = null) : F = a, Vm(t, F);
      }
      return Sa(e, t, u, a), t.child;
    }
    function mT(e, t, a) {
      var i = t.pendingProps;
      return Sa(e, t, i, a), t.child;
    }
    function yT(e, t, a) {
      var i = t.pendingProps.children;
      return Sa(e, t, i, a), t.child;
    }
    function gT(e, t, a) {
      {
        t.flags |= Lt;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Sa(e, t, s, a), t.child;
    }
    function w0(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Rn, t.flags |= mo);
    }
    function CS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && nl(
          s,
          i,
          // Resolved props
          "prop",
          zt(a)
        );
      }
      var f;
      {
        var p = xf(t, a, !0);
        f = bf(t, p);
      }
      var v, y;
      Of(t, u), ha(t);
      {
        if (Mp.current = t, Wn(!0), v = zf(e, t, a, i, f, u), y = Uf(), t.mode & en) {
          Cn(!0);
          try {
            v = zf(e, t, a, i, f, u), y = Uf();
          } finally {
            Cn(!1);
          }
        }
        Wn(!1);
      }
      return ma(), e !== null && !ol ? (jC(e, t, u), Vu(e, t, u)) : (Ur() && y && tg(t), t.flags |= ni, Sa(e, t, v, u), t.child);
    }
    function x0(e, t, a, i, u) {
      {
        switch (A1(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= Xe, t.flags |= er;
            var y = new Error("Simulated error coming from DevTools"), S = bs(u);
            t.lanes = St(t.lanes, S);
            var O = hS(t, ec(y, t), S);
            wg(t, O);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var k = a.propTypes;
          k && nl(
            k,
            i,
            // Resolved props
            "prop",
            zt(a)
          );
        }
      }
      var F;
      Yl(a) ? (F = !0, Hh(t)) : F = !1, Of(t, u);
      var B = t.stateNode, W;
      B === null ? (Om(e, t), d0(t, a, i), dS(t, a, i, u), W = !0) : e === null ? W = uT(t, a, i, u) : W = oT(e, t, a, i, u);
      var Ne = wS(e, t, a, W, F, u);
      {
        var it = t.stateNode;
        W && it.props !== i && (tc || g("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", pt(t) || "a component"), tc = !0);
      }
      return Ne;
    }
    function wS(e, t, a, i, u, s) {
      w0(e, t);
      var f = (t.flags & Xe) !== Je;
      if (!i && !f)
        return u && aC(t, a, !1), Vu(e, t, s);
      var p = t.stateNode;
      Mp.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, u0();
      else {
        ha(t);
        {
          if (Wn(!0), v = p.render(), t.mode & en) {
            Cn(!0);
            try {
              p.render();
            } finally {
              Cn(!1);
            }
          }
          Wn(!1);
        }
        ma();
      }
      return t.flags |= ni, e !== null && f ? hT(e, t, v, s) : Sa(e, t, v, s), t.memoizedState = p.state, u && aC(t, a, !0), t.child;
    }
    function b0(e) {
      var t = e.stateNode;
      t.pendingContext ? nC(e, t.pendingContext, t.pendingContext !== t.context) : t.context && nC(e, t.context, !1), xg(e, t.containerInfo);
    }
    function ST(e, t, a) {
      if (b0(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      _C(e, t), rm(t, i, null, a);
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
        if (y.baseState = v, t.memoizedState = v, t.flags & xr) {
          var S = ec(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return R0(e, t, p, a, S);
        } else if (p !== s) {
          var O = ec(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return R0(e, t, p, a, O);
        } else {
          wR(t);
          var k = EC(t, null, p, a);
          t.child = k;
          for (var F = k; F; )
            F.flags = F.flags & ~En | qr, F = F.sibling;
        }
      } else {
        if (_f(), p === s)
          return Vu(e, t, a);
        Sa(e, t, p, a);
      }
      return t.child;
    }
    function R0(e, t, a, i, u) {
      return _f(), ug(u), t.flags |= xr, Sa(e, t, a, i), t.child;
    }
    function ET(e, t, a) {
      NC(t), e === null && lg(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Vy(i, u);
      return p ? f = null : s !== null && Vy(i, s) && (t.flags |= Oa), w0(e, t), Sa(e, t, f, a), t.child;
    }
    function CT(e, t) {
      return e === null && lg(t), null;
    }
    function wT(e, t, a, i) {
      Om(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = C1(v), S = ul(v, u), O;
      switch (y) {
        case U:
          return xS(t, v), t.type = v = $f(v), O = CS(null, t, v, S, i), O;
        case Q:
          return t.type = v = ZS(v), O = x0(null, t, v, S, i), O;
        case ge:
          return t.type = v = eE(v), O = g0(null, t, v, S, i), O;
        case Se: {
          if (t.type !== t.elementType) {
            var k = v.propTypes;
            k && nl(
              k,
              S,
              // Resolved for outer only
              "prop",
              zt(v)
            );
          }
          return O = S0(
            null,
            t,
            v,
            ul(v.type, S),
            // The inner type can have defaults too
            i
          ), O;
        }
      }
      var F = "";
      throw v !== null && typeof v == "object" && v.$$typeof === vt && (F = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + F));
    }
    function xT(e, t, a, i, u) {
      Om(e, t), t.tag = Q;
      var s;
      return Yl(a) ? (s = !0, Hh(t)) : s = !1, Of(t, u), d0(t, a, i), dS(t, a, i, u), wS(null, t, a, !0, s, u);
    }
    function bT(e, t, a, i) {
      Om(e, t);
      var u = t.pendingProps, s;
      {
        var f = xf(t, a, !1);
        s = bf(t, f);
      }
      Of(t, i);
      var p, v;
      ha(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = zt(a) || "Unknown";
          mS[y] || (g("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), mS[y] = !0);
        }
        t.mode & en && al.recordLegacyContextWarning(t, null), Wn(!0), Mp.current = t, p = zf(null, t, a, u, s, i), v = Uf(), Wn(!1);
      }
      if (ma(), t.flags |= ni, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var S = zt(a) || "Unknown";
        jp[S] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", S, S, S), jp[S] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var O = zt(a) || "Unknown";
          jp[O] || (g("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", O, O, O), jp[O] = !0);
        }
        t.tag = Q, t.memoizedState = null, t.updateQueue = null;
        var k = !1;
        return Yl(a) ? (k = !0, Hh(t)) : k = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, Cg(t), f0(t, p), dS(t, a, u, i), wS(null, t, a, !0, k, i);
      } else {
        if (t.tag = U, t.mode & en) {
          Cn(!0);
          try {
            p = zf(null, t, a, u, s, i), v = Uf();
          } finally {
            Cn(!1);
          }
        }
        return Ur() && v && tg(t), Sa(null, t, p, i), xS(t, a), t.child;
      }
    }
    function xS(e, t) {
      {
        if (t && t.childContextTypes && g("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Or();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), SS[u] || (SS[u] = !0, g("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = zt(t) || "Unknown";
          Ap[f] || (g("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), Ap[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = zt(t) || "Unknown";
          gS[p] || (g("%s: Function components do not support getDerivedStateFromProps.", p), gS[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = zt(t) || "Unknown";
          yS[v] || (g("%s: Function components do not support contextType.", v), yS[v] = !0);
        }
      }
    }
    var bS = {
      dehydrated: null,
      treeContext: null,
      retryLane: Ft
    };
    function RS(e) {
      return {
        baseLanes: e,
        cachePool: vT(),
        transitions: null
      };
    }
    function RT(e, t) {
      var a = null;
      return {
        baseLanes: St(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function TT(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return Tg(e, bp);
    }
    function _T(e, t) {
      return Rs(e.childLanes, t);
    }
    function T0(e, t, a) {
      var i = t.pendingProps;
      z1(t) && (t.flags |= Xe);
      var u = il.current, s = !1, f = (t.flags & Xe) !== Je;
      if (f || TT(u, e) ? (s = !0, t.flags &= ~Xe) : (e === null || e.memoizedState !== null) && (u = $R(u, MC)), u = Lf(u), Uo(t, u), e === null) {
        lg(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return LT(t, v);
        }
        var y = i.children, S = i.fallback;
        if (s) {
          var O = kT(t, y, S, a), k = t.child;
          return k.memoizedState = RS(a), t.memoizedState = bS, O;
        } else
          return TS(t, y);
      } else {
        var F = e.memoizedState;
        if (F !== null) {
          var B = F.dehydrated;
          if (B !== null)
            return MT(e, t, f, i, B, F, a);
        }
        if (s) {
          var W = i.fallback, Ne = i.children, it = OT(e, t, Ne, W, a), Ke = t.child, At = e.child.memoizedState;
          return Ke.memoizedState = At === null ? RS(a) : RT(At, a), Ke.childLanes = _T(e, a), t.memoizedState = bS, it;
        } else {
          var Ot = i.children, M = DT(e, t, Ot, a);
          return t.memoizedState = null, M;
        }
      }
    }
    function TS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = _S(u, i);
      return s.return = e, e.child = s, s;
    }
    function kT(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & Rt) === Ze && s !== null ? (p = s, p.childLanes = le, p.pendingProps = f, e.mode & Ht && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = $o(a, u, i, null)) : (p = _S(f, u), v = $o(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function _S(e, t, a) {
      return _w(e, t, le, null);
    }
    function _0(e, t) {
      return lc(e, t);
    }
    function DT(e, t, a, i) {
      var u = e.child, s = u.sibling, f = _0(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & Rt) === Ze && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= Da) : p.push(s);
      }
      return t.child = f, f;
    }
    function OT(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & Rt) === Ze && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var S = t.child;
        y = S, y.childLanes = le, y.pendingProps = v, t.mode & Ht && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = _0(f, v), y.subtreeFlags = f.subtreeFlags & Fn;
      var O;
      return p !== null ? O = lc(p, i) : (O = $o(i, s, u, null), O.flags |= En), O.return = t, y.return = t, y.sibling = O, t.child = y, O;
    }
    function Dm(e, t, a, i) {
      i !== null && ug(i), kf(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = TS(t, s);
      return f.flags |= En, t.memoizedState = null, f;
    }
    function NT(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = _S(f, s), v = $o(i, s, u, null);
      return v.flags |= En, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & Rt) !== Ze && kf(t, e.child, null, u), v;
    }
    function LT(e, t, a) {
      return (e.mode & Rt) === Ze ? (g("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = st) : $y(t) ? e.lanes = br : e.lanes = Zr, null;
    }
    function MT(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & xr) {
          t.flags &= ~xr;
          var M = pS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Dm(e, t, f, M);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Xe, null;
          var G = i.children, j = i.fallback, ve = NT(e, t, G, j, f), ze = t.child;
          return ze.memoizedState = RS(f), t.memoizedState = bS, ve;
        }
      else {
        if (ER(), (t.mode & Rt) === Ze)
          return Dm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if ($y(u)) {
          var p, v, y;
          {
            var S = Ub(u);
            p = S.digest, v = S.message, y = S.stack;
          }
          var O;
          v ? O = new Error(v) : O = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var k = pS(O, p, y);
          return Dm(e, t, f, k);
        }
        var F = ea(f, e.childLanes);
        if (ol || F) {
          var B = Hm();
          if (B !== null) {
            var W = Fd(B, f);
            if (W !== Ft && W !== s.retryLane) {
              s.retryLane = W;
              var Ne = rn;
              Pa(e, W), Sr(B, e, W, Ne);
            }
          }
          GS();
          var it = pS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Dm(e, t, f, it);
        } else if (KE(u)) {
          t.flags |= Xe, t.child = e.child;
          var Ke = a1.bind(null, e);
          return Fb(u, Ke), null;
        } else {
          xR(t, u, s.treeContext);
          var At = i.children, Ot = TS(t, At);
          return Ot.flags |= qr, Ot;
        }
      }
    }
    function k0(e, t, a) {
      e.lanes = St(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = St(i.lanes, t)), yg(e.return, t, a);
    }
    function jT(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === he) {
          var u = i.memoizedState;
          u !== null && k0(i, a, e);
        } else if (i.tag === He)
          k0(i, a, e);
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
    function AT(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && um(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function zT(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !ES[e])
        if (ES[e] = !0, typeof e == "string")
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
    function UT(e, t) {
      e !== void 0 && !km[e] && (e !== "collapsed" && e !== "hidden" ? (km[e] = !0, g('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (km[e] = !0, g('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function D0(e, t) {
      {
        var a = xt(e), i = !a && typeof gt(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return g("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function FT(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (xt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!D0(e[a], a))
              return;
        } else {
          var i = gt(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!D0(s.value, f))
                  return;
                f++;
              }
          } else
            g('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function kS(e, t, a, i, u) {
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
    function O0(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      zT(u), UT(s, u), FT(f, u), Sa(e, t, f, a);
      var p = il.current, v = Tg(p, bp);
      if (v)
        p = _g(p, bp), t.flags |= Xe;
      else {
        var y = e !== null && (e.flags & Xe) !== Je;
        y && jT(t, t.child, a), p = Lf(p);
      }
      if (Uo(t, p), (t.mode & Rt) === Ze)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var S = AT(t.child), O;
            S === null ? (O = t.child, t.child = null) : (O = S.sibling, S.sibling = null), kS(
              t,
              !1,
              // isBackwards
              O,
              S,
              s
            );
            break;
          }
          case "backwards": {
            var k = null, F = t.child;
            for (t.child = null; F !== null; ) {
              var B = F.alternate;
              if (B !== null && um(B) === null) {
                t.child = F;
                break;
              }
              var W = F.sibling;
              F.sibling = k, k = F, F = W;
            }
            kS(
              t,
              !0,
              // isBackwards
              k,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            kS(
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
    function PT(e, t, a) {
      xg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = kf(t, null, i, a) : Sa(e, t, i, a), t.child;
    }
    var N0 = !1;
    function HT(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || N0 || (N0 = !0, g("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && nl(v, s, "prop", "Context.Provider");
      }
      if (xC(t, u, p), f !== null) {
        var y = f.value;
        if (se(y, p)) {
          if (f.children === s.children && !Fh())
            return Vu(e, t, a);
        } else
          zR(t, u, a);
      }
      var S = s.children;
      return Sa(e, t, S, a), t.child;
    }
    var L0 = !1;
    function VT(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (L0 || (L0 = !0, g("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && g("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Of(t, a);
      var f = ar(i);
      ha(t);
      var p;
      return Mp.current = t, Wn(!0), p = s(f), Wn(!1), ma(), t.flags |= ni, Sa(e, t, p, a), t.child;
    }
    function zp() {
      ol = !0;
    }
    function Om(e, t) {
      (t.mode & Rt) === Ze && e !== null && (e.alternate = null, t.alternate = null, t.flags |= En);
    }
    function Vu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), u0(), Gp(t.lanes), ea(a, t.childLanes) ? (jR(e, t), t.child) : null;
    }
    function BT(e, t, a) {
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
        return s === null ? (i.deletions = [e], i.flags |= Da) : s.push(e), a.flags |= En, a;
      }
    }
    function DS(e, t) {
      var a = e.lanes;
      return !!ea(a, t);
    }
    function IT(e, t, a) {
      switch (t.tag) {
        case I:
          b0(t), t.stateNode, _f();
          break;
        case te:
          NC(t);
          break;
        case Q: {
          var i = t.type;
          Yl(i) && Hh(t);
          break;
        }
        case ee:
          xg(t, t.stateNode.containerInfo);
          break;
        case ce: {
          var u = t.memoizedProps.value, s = t.type._context;
          xC(t, s, u);
          break;
        }
        case Le:
          {
            var f = ea(a, t.childLanes);
            f && (t.flags |= Lt);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case he: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Uo(t, Lf(il.current)), t.flags |= Xe, null;
            var y = t.child, S = y.childLanes;
            if (ea(a, S))
              return T0(e, t, a);
            Uo(t, Lf(il.current));
            var O = Vu(e, t, a);
            return O !== null ? O.sibling : null;
          } else
            Uo(t, Lf(il.current));
          break;
        }
        case He: {
          var k = (e.flags & Xe) !== Je, F = ea(a, t.childLanes);
          if (k) {
            if (F)
              return O0(e, t, a);
            t.flags |= Xe;
          }
          var B = t.memoizedState;
          if (B !== null && (B.rendering = null, B.tail = null, B.lastEffect = null), Uo(t, il.current), F)
            break;
          return null;
        }
        case Ce:
        case kt:
          return t.lanes = le, C0(e, t, a);
      }
      return Vu(e, t, a);
    }
    function M0(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return BT(e, t, iE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || Fh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ol = !0;
        else {
          var s = DS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & Xe) === Je)
            return ol = !1, IT(e, t, a);
          (e.flags & Rc) !== Je ? ol = !0 : ol = !1;
        }
      } else if (ol = !1, Ur() && vR(t)) {
        var f = t.index, p = hR();
        uC(t, p, f);
      }
      switch (t.lanes = le, t.tag) {
        case Re:
          return bT(e, t, t.type, a);
        case de: {
          var v = t.elementType;
          return wT(e, t, v, a);
        }
        case U: {
          var y = t.type, S = t.pendingProps, O = t.elementType === y ? S : ul(y, S);
          return CS(e, t, y, O, a);
        }
        case Q: {
          var k = t.type, F = t.pendingProps, B = t.elementType === k ? F : ul(k, F);
          return x0(e, t, k, B, a);
        }
        case I:
          return ST(e, t, a);
        case te:
          return ET(e, t, a);
        case ne:
          return CT(e, t);
        case he:
          return T0(e, t, a);
        case ee:
          return PT(e, t, a);
        case ge: {
          var W = t.type, Ne = t.pendingProps, it = t.elementType === W ? Ne : ul(W, Ne);
          return g0(e, t, W, it, a);
        }
        case K:
          return mT(e, t, a);
        case Ee:
          return yT(e, t, a);
        case Le:
          return gT(e, t, a);
        case ce:
          return HT(e, t, a);
        case Ue:
          return VT(e, t, a);
        case Se: {
          var Ke = t.type, At = t.pendingProps, Ot = ul(Ke, At);
          if (t.type !== t.elementType) {
            var M = Ke.propTypes;
            M && nl(
              M,
              Ot,
              // Resolved for outer only
              "prop",
              zt(Ke)
            );
          }
          return Ot = ul(Ke.type, Ot), S0(e, t, Ke, Ot, a);
        }
        case P:
          return E0(e, t, t.type, t.pendingProps, a);
        case ie: {
          var G = t.type, j = t.pendingProps, ve = t.elementType === G ? j : ul(G, j);
          return xT(e, t, G, ve, a);
        }
        case He:
          return O0(e, t, a);
        case tt:
          break;
        case Ce:
          return C0(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ff(e) {
      e.flags |= Lt;
    }
    function j0(e) {
      e.flags |= Rn, e.flags |= mo;
    }
    var A0, OS, z0, U0;
    A0 = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === te || u.tag === ne)
          fb(e, u.stateNode);
        else if (u.tag !== ee) {
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
    }, OS = function(e, t) {
    }, z0 = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = bg(), v = pb(f, a, s, i, u, p);
        t.updateQueue = v, v && Ff(t);
      }
    }, U0 = function(e, t, a, i) {
      a !== i && Ff(t);
    };
    function Up(e, t) {
      if (!Ur())
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
    function Pr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = le, i = Je;
      if (t) {
        if ((e.mode & Ht) !== Ze) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = St(a, St(y.lanes, y.childLanes)), i |= y.subtreeFlags & Fn, i |= y.flags & Fn, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var S = e.child; S !== null; )
            a = St(a, St(S.lanes, S.childLanes)), i |= S.subtreeFlags & Fn, i |= S.flags & Fn, S.return = e, S = S.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & Ht) !== Ze) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = St(a, St(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = St(a, St(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function YT(e, t, a) {
      if (kR() && (t.mode & Rt) !== Ze && (t.flags & Xe) === Je)
        return vC(t), _f(), t.flags |= xr | ss | er, !1;
      var i = $h(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (TR(t), Pr(t), (t.mode & Ht) !== Ze) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (_f(), (t.flags & Xe) === Je && (t.memoizedState = null), t.flags |= Lt, Pr(t), (t.mode & Ht) !== Ze) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return hC(), !0;
    }
    function F0(e, t, a) {
      var i = t.pendingProps;
      switch (ng(t), t.tag) {
        case Re:
        case de:
        case P:
        case U:
        case ge:
        case K:
        case Ee:
        case Le:
        case Ue:
        case Se:
          return Pr(t), null;
        case Q: {
          var u = t.type;
          return Yl(u) && Ph(t), Pr(t), null;
        }
        case I: {
          var s = t.stateNode;
          if (Nf(t), Jy(t), Dg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = $h(t);
            if (f)
              Ff(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & xr) !== Je) && (t.flags |= Gn, hC());
            }
          }
          return OS(e, t), Pr(t), null;
        }
        case te: {
          Rg(t);
          var v = OC(), y = t.type;
          if (e !== null && t.stateNode != null)
            z0(e, t, y, i, v), e.ref !== t.ref && j0(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Pr(t), null;
            }
            var S = bg(), O = $h(t);
            if (O)
              bR(t, v, S) && Ff(t);
            else {
              var k = cb(y, i, v, S, t);
              A0(k, t, !1, !1), t.stateNode = k, db(k, y, i, v) && Ff(t);
            }
            t.ref !== null && j0(t);
          }
          return Pr(t), null;
        }
        case ne: {
          var F = i;
          if (e && t.stateNode != null) {
            var B = e.memoizedProps;
            U0(e, t, B, F);
          } else {
            if (typeof F != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var W = OC(), Ne = bg(), it = $h(t);
            it ? RR(t) && Ff(t) : t.stateNode = vb(F, W, Ne, t);
          }
          return Pr(t), null;
        }
        case he: {
          Mf(t);
          var Ke = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var At = YT(e, t, Ke);
            if (!At)
              return t.flags & er ? t : null;
          }
          if ((t.flags & Xe) !== Je)
            return t.lanes = a, (t.mode & Ht) !== Ze && eS(t), t;
          var Ot = Ke !== null, M = e !== null && e.memoizedState !== null;
          if (Ot !== M && Ot) {
            var G = t.child;
            if (G.flags |= Un, (t.mode & Rt) !== Ze) {
              var j = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              j || Tg(il.current, MC) ? $_() : GS();
            }
          }
          var ve = t.updateQueue;
          if (ve !== null && (t.flags |= Lt), Pr(t), (t.mode & Ht) !== Ze && Ot) {
            var ze = t.child;
            ze !== null && (t.treeBaseDuration -= ze.treeBaseDuration);
          }
          return null;
        }
        case ee:
          return Nf(t), OS(e, t), e === null && uR(t.stateNode.containerInfo), Pr(t), null;
        case ce:
          var Me = t.type._context;
          return mg(Me, t), Pr(t), null;
        case ie: {
          var ct = t.type;
          return Yl(ct) && Ph(t), Pr(t), null;
        }
        case He: {
          Mf(t);
          var mt = t.memoizedState;
          if (mt === null)
            return Pr(t), null;
          var nn = (t.flags & Xe) !== Je, It = mt.rendering;
          if (It === null)
            if (nn)
              Up(mt, !1);
            else {
              var Xn = W_() && (e === null || (e.flags & Xe) === Je);
              if (!Xn)
                for (var Yt = t.child; Yt !== null; ) {
                  var Yn = um(Yt);
                  if (Yn !== null) {
                    nn = !0, t.flags |= Xe, Up(mt, !1);
                    var ua = Yn.updateQueue;
                    return ua !== null && (t.updateQueue = ua, t.flags |= Lt), t.subtreeFlags = Je, AR(t, a), Uo(t, _g(il.current, bp)), t.child;
                  }
                  Yt = Yt.sibling;
                }
              mt.tail !== null && qn() > iw() && (t.flags |= Xe, nn = !0, Up(mt, !1), t.lanes = Dd);
            }
          else {
            if (!nn) {
              var Yr = um(It);
              if (Yr !== null) {
                t.flags |= Xe, nn = !0;
                var si = Yr.updateQueue;
                if (si !== null && (t.updateQueue = si, t.flags |= Lt), Up(mt, !0), mt.tail === null && mt.tailMode === "hidden" && !It.alternate && !Ur())
                  return Pr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              qn() * 2 - mt.renderingStartTime > iw() && a !== Zr && (t.flags |= Xe, nn = !0, Up(mt, !1), t.lanes = Dd);
            }
            if (mt.isBackwards)
              It.sibling = t.child, t.child = It;
            else {
              var wa = mt.last;
              wa !== null ? wa.sibling = It : t.child = It, mt.last = It;
            }
          }
          if (mt.tail !== null) {
            var xa = mt.tail;
            mt.rendering = xa, mt.tail = xa.sibling, mt.renderingStartTime = qn(), xa.sibling = null;
            var oa = il.current;
            return nn ? oa = _g(oa, bp) : oa = Lf(oa), Uo(t, oa), xa;
          }
          return Pr(t), null;
        }
        case tt:
          break;
        case Ce:
        case kt: {
          WS(t);
          var Qu = t.memoizedState, Qf = Qu !== null;
          if (e !== null) {
            var Zp = e.memoizedState, Jl = Zp !== null;
            Jl !== Qf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !we && (t.flags |= Un);
          }
          return !Qf || (t.mode & Rt) === Ze ? Pr(t) : ea(Xl, Zr) && (Pr(t), t.subtreeFlags & (En | Lt) && (t.flags |= Un)), null;
        }
        case Ct:
          return null;
        case Dt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function $T(e, t, a) {
      switch (ng(t), t.tag) {
        case Q: {
          var i = t.type;
          Yl(i) && Ph(t);
          var u = t.flags;
          return u & er ? (t.flags = u & ~er | Xe, (t.mode & Ht) !== Ze && eS(t), t) : null;
        }
        case I: {
          t.stateNode, Nf(t), Jy(t), Dg();
          var s = t.flags;
          return (s & er) !== Je && (s & Xe) === Je ? (t.flags = s & ~er | Xe, t) : null;
        }
        case te:
          return Rg(t), null;
        case he: {
          Mf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            _f();
          }
          var p = t.flags;
          return p & er ? (t.flags = p & ~er | Xe, (t.mode & Ht) !== Ze && eS(t), t) : null;
        }
        case He:
          return Mf(t), null;
        case ee:
          return Nf(t), null;
        case ce:
          var v = t.type._context;
          return mg(v, t), null;
        case Ce:
        case kt:
          return WS(t), null;
        case Ct:
          return null;
        default:
          return null;
      }
    }
    function P0(e, t, a) {
      switch (ng(t), t.tag) {
        case Q: {
          var i = t.type.childContextTypes;
          i != null && Ph(t);
          break;
        }
        case I: {
          t.stateNode, Nf(t), Jy(t), Dg();
          break;
        }
        case te: {
          Rg(t);
          break;
        }
        case ee:
          Nf(t);
          break;
        case he:
          Mf(t);
          break;
        case He:
          Mf(t);
          break;
        case ce:
          var u = t.type._context;
          mg(u, t);
          break;
        case Ce:
        case kt:
          WS(t);
          break;
      }
    }
    var H0 = null;
    H0 = /* @__PURE__ */ new Set();
    var Nm = !1, Hr = !1, QT = typeof WeakSet == "function" ? WeakSet : Set, $e = null, Pf = null, Hf = null;
    function WT(e) {
      Tl(null, function() {
        throw e;
      }), os();
    }
    var GT = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Ht)
        try {
          ql(), t.componentWillUnmount();
        } finally {
          Gl(e);
        }
      else
        t.componentWillUnmount();
    };
    function V0(e, t) {
      try {
        Ho(pr, e);
      } catch (a) {
        vn(e, t, a);
      }
    }
    function NS(e, t, a) {
      try {
        GT(e, a);
      } catch (i) {
        vn(e, t, i);
      }
    }
    function qT(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        vn(e, t, i);
      }
    }
    function B0(e, t) {
      try {
        Y0(e);
      } catch (a) {
        vn(e, t, a);
      }
    }
    function Vf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (et && be && e.mode & Ht)
              try {
                ql(), i = a(null);
              } finally {
                Gl(e);
              }
            else
              i = a(null);
          } catch (u) {
            vn(e, t, u);
          }
          typeof i == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", pt(e));
        } else
          a.current = null;
    }
    function Lm(e, t, a) {
      try {
        a();
      } catch (i) {
        vn(e, t, i);
      }
    }
    var I0 = !1;
    function KT(e, t) {
      ob(e.containerInfo), $e = t, XT();
      var a = I0;
      return I0 = !1, a;
    }
    function XT() {
      for (; $e !== null; ) {
        var e = $e, t = e.child;
        (e.subtreeFlags & kl) !== Je && t !== null ? (t.return = e, $e = t) : JT();
      }
    }
    function JT() {
      for (; $e !== null; ) {
        var e = $e;
        Xt(e);
        try {
          ZT(e);
        } catch (a) {
          vn(e, e.return, a);
        }
        pn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, $e = t;
          return;
        }
        $e = e.return;
      }
    }
    function ZT(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Gn) !== Je) {
        switch (Xt(e), e.tag) {
          case U:
          case ge:
          case P:
            break;
          case Q: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !tc && (s.props !== e.memoizedProps && g("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(e) || "instance"), s.state !== e.memoizedState && g("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : ul(e.type, i), u);
              {
                var p = H0;
                f === void 0 && !p.has(e.type) && (p.add(e.type), g("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", pt(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case I: {
            {
              var v = e.stateNode;
              Mb(v.containerInfo);
            }
            break;
          }
          case te:
          case ne:
          case ee:
          case ie:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        pn();
      }
    }
    function sl(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & Fr) !== Ha ? Ki(t) : (e & pr) !== Ha && fs(t), (e & $l) !== Ha && Kp(!0), Lm(t, a, p), (e & $l) !== Ha && Kp(!1), (e & Fr) !== Ha ? Ll() : (e & pr) !== Ha && _d());
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
            (e & Fr) !== Ha ? Td(t) : (e & pr) !== Ha && Nc(t);
            var f = s.create;
            (e & $l) !== Ha && Kp(!0), s.destroy = f(), (e & $l) !== Ha && Kp(!1), (e & Fr) !== Ha ? Uv() : (e & pr) !== Ha && Fv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & pr) !== Je ? v = "useLayoutEffect" : (s.tag & $l) !== Je ? v = "useInsertionEffect" : v = "useEffect";
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
    function e_(e, t) {
      if ((t.flags & Lt) !== Je)
        switch (t.tag) {
          case Le: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = i0(), p = t.alternate === null ? "mount" : "update";
            a0() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case I:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
                case Le:
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
    function t_(e, t, a, i) {
      if ((a.flags & Ol) !== Je)
        switch (a.tag) {
          case U:
          case ge:
          case P: {
            if (!Hr)
              if (a.mode & Ht)
                try {
                  ql(), Ho(pr | dr, a);
                } finally {
                  Gl(a);
                }
              else
                Ho(pr | dr, a);
            break;
          }
          case Q: {
            var u = a.stateNode;
            if (a.flags & Lt && !Hr)
              if (t === null)
                if (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(a) || "instance")), a.mode & Ht)
                  try {
                    ql(), u.componentDidMount();
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : ul(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(a) || "instance")), a.mode & Ht)
                  try {
                    ql(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Gl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !tc && (u.props !== a.memoizedProps && g("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", pt(a) || "instance"), u.state !== a.memoizedState && g("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", pt(a) || "instance")), DC(a, p, u));
            break;
          }
          case I: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case te:
                    y = a.child.stateNode;
                    break;
                  case Q:
                    y = a.child.stateNode;
                    break;
                }
              DC(a, v, y);
            }
            break;
          }
          case te: {
            var S = a.stateNode;
            if (t === null && a.flags & Lt) {
              var O = a.type, k = a.memoizedProps;
              Sb(S, O, k);
            }
            break;
          }
          case ne:
            break;
          case ee:
            break;
          case Le: {
            {
              var F = a.memoizedProps, B = F.onCommit, W = F.onRender, Ne = a.stateNode.effectDuration, it = i0(), Ke = t === null ? "mount" : "update";
              a0() && (Ke = "nested-update"), typeof W == "function" && W(a.memoizedProps.id, Ke, a.actualDuration, a.treeBaseDuration, a.actualStartTime, it);
              {
                typeof B == "function" && B(a.memoizedProps.id, Ke, Ne, it), J_(a);
                var At = a.return;
                e: for (; At !== null; ) {
                  switch (At.tag) {
                    case I:
                      var Ot = At.stateNode;
                      Ot.effectDuration += Ne;
                      break e;
                    case Le:
                      var M = At.stateNode;
                      M.effectDuration += Ne;
                      break e;
                  }
                  At = At.return;
                }
              }
            }
            break;
          }
          case he: {
            s_(e, a);
            break;
          }
          case He:
          case ie:
          case tt:
          case Ce:
          case kt:
          case Dt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Hr || a.flags & Rn && Y0(a);
    }
    function n_(e) {
      switch (e.tag) {
        case U:
        case ge:
        case P: {
          if (e.mode & Ht)
            try {
              ql(), V0(e, e.return);
            } finally {
              Gl(e);
            }
          else
            V0(e, e.return);
          break;
        }
        case Q: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && qT(e, e.return, t), B0(e, e.return);
          break;
        }
        case te: {
          B0(e, e.return);
          break;
        }
      }
    }
    function r_(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === te) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? Db(u) : Nb(i.stateNode, i.memoizedProps);
            } catch (f) {
              vn(e, e.return, f);
            }
          }
        } else if (i.tag === ne) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? Ob(s) : Lb(s, i.memoizedProps);
            } catch (f) {
              vn(e, e.return, f);
            }
        } else if (!((i.tag === Ce || i.tag === kt) && i.memoizedState !== null && i !== e)) {
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
    function Y0(e) {
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
          var u;
          if (e.mode & Ht)
            try {
              ql(), u = t(i);
            } finally {
              Gl(e);
            }
          else
            u = t(i);
          typeof u == "function" && g("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", pt(e));
        } else
          t.hasOwnProperty("current") || g("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", pt(e)), t.current = i;
      }
    }
    function a_(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function $0(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, $0(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === te) {
          var a = e.stateNode;
          a !== null && cR(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function i_(e) {
      for (var t = e.return; t !== null; ) {
        if (Q0(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Q0(e) {
      return e.tag === te || e.tag === I || e.tag === ee;
    }
    function W0(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || Q0(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== te && t.tag !== ne && t.tag !== Te; ) {
          if (t.flags & En || t.child === null || t.tag === ee)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & En))
          return t.stateNode;
      }
    }
    function l_(e) {
      var t = i_(e);
      switch (t.tag) {
        case te: {
          var a = t.stateNode;
          t.flags & Oa && (qE(a), t.flags &= ~Oa);
          var i = W0(e);
          MS(e, i, a);
          break;
        }
        case I:
        case ee: {
          var u = t.stateNode.containerInfo, s = W0(e);
          LS(e, s, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function LS(e, t, a) {
      var i = e.tag, u = i === te || i === ne;
      if (u) {
        var s = e.stateNode;
        t ? Rb(a, s, t) : xb(a, s);
      } else if (i !== ee) {
        var f = e.child;
        if (f !== null) {
          LS(f, t, a);
          for (var p = f.sibling; p !== null; )
            LS(p, t, a), p = p.sibling;
        }
      }
    }
    function MS(e, t, a) {
      var i = e.tag, u = i === te || i === ne;
      if (u) {
        var s = e.stateNode;
        t ? bb(a, s, t) : wb(a, s);
      } else if (i !== ee) {
        var f = e.child;
        if (f !== null) {
          MS(f, t, a);
          for (var p = f.sibling; p !== null; )
            MS(p, t, a), p = p.sibling;
        }
      }
    }
    var Vr = null, cl = !1;
    function u_(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case te: {
              Vr = i.stateNode, cl = !1;
              break e;
            }
            case I: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
            case ee: {
              Vr = i.stateNode.containerInfo, cl = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Vr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        G0(e, t, a), Vr = null, cl = !1;
      }
      a_(a);
    }
    function Vo(e, t, a) {
      for (var i = a.child; i !== null; )
        G0(e, t, i), i = i.sibling;
    }
    function G0(e, t, a) {
      switch (xd(a), a.tag) {
        case te:
          Hr || Vf(a, t);
        case ne: {
          {
            var i = Vr, u = cl;
            Vr = null, Vo(e, t, a), Vr = i, cl = u, Vr !== null && (cl ? _b(Vr, a.stateNode) : Tb(Vr, a.stateNode));
          }
          return;
        }
        case Te: {
          Vr !== null && (cl ? kb(Vr, a.stateNode) : Yy(Vr, a.stateNode));
          return;
        }
        case ee: {
          {
            var s = Vr, f = cl;
            Vr = a.stateNode.containerInfo, cl = !0, Vo(e, t, a), Vr = s, cl = f;
          }
          return;
        }
        case U:
        case ge:
        case Se:
        case P: {
          if (!Hr) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, S = y;
                do {
                  var O = S, k = O.destroy, F = O.tag;
                  k !== void 0 && ((F & $l) !== Ha ? Lm(a, t, k) : (F & pr) !== Ha && (fs(a), a.mode & Ht ? (ql(), Lm(a, t, k), Gl(a)) : Lm(a, t, k), _d())), S = S.next;
                } while (S !== y);
              }
            }
          }
          Vo(e, t, a);
          return;
        }
        case Q: {
          if (!Hr) {
            Vf(a, t);
            var B = a.stateNode;
            typeof B.componentWillUnmount == "function" && NS(a, t, B);
          }
          Vo(e, t, a);
          return;
        }
        case tt: {
          Vo(e, t, a);
          return;
        }
        case Ce: {
          if (
            // TODO: Remove this dead flag
            a.mode & Rt
          ) {
            var W = Hr;
            Hr = W || a.memoizedState !== null, Vo(e, t, a), Hr = W;
          } else
            Vo(e, t, a);
          break;
        }
        default: {
          Vo(e, t, a);
          return;
        }
      }
    }
    function o_(e) {
      e.memoizedState;
    }
    function s_(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && Wb(s);
          }
        }
      }
    }
    function q0(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new QT()), t.forEach(function(i) {
          var u = i1.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), Jr)
              if (Pf !== null && Hf !== null)
                qp(Hf, Pf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function c_(e, t, a) {
      Pf = a, Hf = e, Xt(t), K0(t, e), Xt(t), Pf = null, Hf = null;
    }
    function fl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            u_(e, t, s);
          } catch (v) {
            vn(s, t, v);
          }
        }
      var f = Sl();
      if (t.subtreeFlags & Dl)
        for (var p = t.child; p !== null; )
          Xt(p), K0(p, e), p = p.sibling;
      Xt(f);
    }
    function K0(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case U:
        case ge:
        case Se:
        case P: {
          if (fl(t, e), Kl(e), u & Lt) {
            try {
              sl($l | dr, e, e.return), Ho($l | dr, e);
            } catch (ct) {
              vn(e, e.return, ct);
            }
            if (e.mode & Ht) {
              try {
                ql(), sl(pr | dr, e, e.return);
              } catch (ct) {
                vn(e, e.return, ct);
              }
              Gl(e);
            } else
              try {
                sl(pr | dr, e, e.return);
              } catch (ct) {
                vn(e, e.return, ct);
              }
          }
          return;
        }
        case Q: {
          fl(t, e), Kl(e), u & Rn && i !== null && Vf(i, i.return);
          return;
        }
        case te: {
          fl(t, e), Kl(e), u & Rn && i !== null && Vf(i, i.return);
          {
            if (e.flags & Oa) {
              var s = e.stateNode;
              try {
                qE(s);
              } catch (ct) {
                vn(e, e.return, ct);
              }
            }
            if (u & Lt) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, S = e.updateQueue;
                if (e.updateQueue = null, S !== null)
                  try {
                    Eb(f, S, y, v, p, e);
                  } catch (ct) {
                    vn(e, e.return, ct);
                  }
              }
            }
          }
          return;
        }
        case ne: {
          if (fl(t, e), Kl(e), u & Lt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var O = e.stateNode, k = e.memoizedProps, F = i !== null ? i.memoizedProps : k;
            try {
              Cb(O, F, k);
            } catch (ct) {
              vn(e, e.return, ct);
            }
          }
          return;
        }
        case I: {
          if (fl(t, e), Kl(e), u & Lt && i !== null) {
            var B = i.memoizedState;
            if (B.isDehydrated)
              try {
                Qb(t.containerInfo);
              } catch (ct) {
                vn(e, e.return, ct);
              }
          }
          return;
        }
        case ee: {
          fl(t, e), Kl(e);
          return;
        }
        case he: {
          fl(t, e), Kl(e);
          var W = e.child;
          if (W.flags & Un) {
            var Ne = W.stateNode, it = W.memoizedState, Ke = it !== null;
            if (Ne.isHidden = Ke, Ke) {
              var At = W.alternate !== null && W.alternate.memoizedState !== null;
              At || Y_();
            }
          }
          if (u & Lt) {
            try {
              o_(e);
            } catch (ct) {
              vn(e, e.return, ct);
            }
            q0(e);
          }
          return;
        }
        case Ce: {
          var Ot = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Rt
          ) {
            var M = Hr;
            Hr = M || Ot, fl(t, e), Hr = M;
          } else
            fl(t, e);
          if (Kl(e), u & Un) {
            var G = e.stateNode, j = e.memoizedState, ve = j !== null, ze = e;
            if (G.isHidden = ve, ve && !Ot && (ze.mode & Rt) !== Ze) {
              $e = ze;
              for (var Me = ze.child; Me !== null; )
                $e = Me, d_(Me), Me = Me.sibling;
            }
            r_(ze, ve);
          }
          return;
        }
        case He: {
          fl(t, e), Kl(e), u & Lt && q0(e);
          return;
        }
        case tt:
          return;
        default: {
          fl(t, e), Kl(e);
          return;
        }
      }
    }
    function Kl(e) {
      var t = e.flags;
      if (t & En) {
        try {
          l_(e);
        } catch (a) {
          vn(e, e.return, a);
        }
        e.flags &= ~En;
      }
      t & qr && (e.flags &= ~qr);
    }
    function f_(e, t, a) {
      Pf = a, Hf = t, $e = e, X0(e, t, a), Pf = null, Hf = null;
    }
    function X0(e, t, a) {
      for (var i = (e.mode & Rt) !== Ze; $e !== null; ) {
        var u = $e, s = u.child;
        if (u.tag === Ce && i) {
          var f = u.memoizedState !== null, p = f || Nm;
          if (p) {
            jS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, S = y || Hr, O = Nm, k = Hr;
            Nm = p, Hr = S, Hr && !k && ($e = u, p_(u));
            for (var F = s; F !== null; )
              $e = F, X0(
                F,
                // New root; bubble back up to here and stop.
                t,
                a
              ), F = F.sibling;
            $e = u, Nm = O, Hr = k, jS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & Ol) !== Je && s !== null ? (s.return = u, $e = s) : jS(e, t, a);
      }
    }
    function jS(e, t, a) {
      for (; $e !== null; ) {
        var i = $e;
        if ((i.flags & Ol) !== Je) {
          var u = i.alternate;
          Xt(i);
          try {
            t_(t, u, i, a);
          } catch (f) {
            vn(i, i.return, f);
          }
          pn();
        }
        if (i === e) {
          $e = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, $e = s;
          return;
        }
        $e = i.return;
      }
    }
    function d_(e) {
      for (; $e !== null; ) {
        var t = $e, a = t.child;
        switch (t.tag) {
          case U:
          case ge:
          case Se:
          case P: {
            if (t.mode & Ht)
              try {
                ql(), sl(pr, t, t.return);
              } finally {
                Gl(t);
              }
            else
              sl(pr, t, t.return);
            break;
          }
          case Q: {
            Vf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && NS(t, t.return, i);
            break;
          }
          case te: {
            Vf(t, t.return);
            break;
          }
          case Ce: {
            var u = t.memoizedState !== null;
            if (u) {
              J0(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, $e = a) : J0(e);
      }
    }
    function J0(e) {
      for (; $e !== null; ) {
        var t = $e;
        if (t === e) {
          $e = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, $e = a;
          return;
        }
        $e = t.return;
      }
    }
    function p_(e) {
      for (; $e !== null; ) {
        var t = $e, a = t.child;
        if (t.tag === Ce) {
          var i = t.memoizedState !== null;
          if (i) {
            Z0(e);
            continue;
          }
        }
        a !== null ? (a.return = t, $e = a) : Z0(e);
      }
    }
    function Z0(e) {
      for (; $e !== null; ) {
        var t = $e;
        Xt(t);
        try {
          n_(t);
        } catch (i) {
          vn(t, t.return, i);
        }
        if (pn(), t === e) {
          $e = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, $e = a;
          return;
        }
        $e = t.return;
      }
    }
    function v_(e, t, a, i) {
      $e = t, h_(t, e, a, i);
    }
    function h_(e, t, a, i) {
      for (; $e !== null; ) {
        var u = $e, s = u.child;
        (u.subtreeFlags & Gi) !== Je && s !== null ? (s.return = u, $e = s) : m_(e, t, a, i);
      }
    }
    function m_(e, t, a, i) {
      for (; $e !== null; ) {
        var u = $e;
        if ((u.flags & Gr) !== Je) {
          Xt(u);
          try {
            y_(t, u, a, i);
          } catch (f) {
            vn(u, u.return, f);
          }
          pn();
        }
        if (u === e) {
          $e = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, $e = s;
          return;
        }
        $e = u.return;
      }
    }
    function y_(e, t, a, i) {
      switch (t.tag) {
        case U:
        case ge:
        case P: {
          if (t.mode & Ht) {
            Zg();
            try {
              Ho(Fr | dr, t);
            } finally {
              Jg(t);
            }
          } else
            Ho(Fr | dr, t);
          break;
        }
      }
    }
    function g_(e) {
      $e = e, S_();
    }
    function S_() {
      for (; $e !== null; ) {
        var e = $e, t = e.child;
        if (($e.flags & Da) !== Je) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              $e = u, w_(u, e);
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
            $e = e;
          }
        }
        (e.subtreeFlags & Gi) !== Je && t !== null ? (t.return = e, $e = t) : E_();
      }
    }
    function E_() {
      for (; $e !== null; ) {
        var e = $e;
        (e.flags & Gr) !== Je && (Xt(e), C_(e), pn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, $e = t;
          return;
        }
        $e = e.return;
      }
    }
    function C_(e) {
      switch (e.tag) {
        case U:
        case ge:
        case P: {
          e.mode & Ht ? (Zg(), sl(Fr | dr, e, e.return), Jg(e)) : sl(Fr | dr, e, e.return);
          break;
        }
      }
    }
    function w_(e, t) {
      for (; $e !== null; ) {
        var a = $e;
        Xt(a), b_(a, t), pn();
        var i = a.child;
        i !== null ? (i.return = a, $e = i) : x_(e);
      }
    }
    function x_(e) {
      for (; $e !== null; ) {
        var t = $e, a = t.sibling, i = t.return;
        if ($0(t), t === e) {
          $e = null;
          return;
        }
        if (a !== null) {
          a.return = i, $e = a;
          return;
        }
        $e = i;
      }
    }
    function b_(e, t) {
      switch (e.tag) {
        case U:
        case ge:
        case P: {
          e.mode & Ht ? (Zg(), sl(Fr, e, t), Jg(e)) : sl(Fr, e, t);
          break;
        }
      }
    }
    function R_(e) {
      switch (e.tag) {
        case U:
        case ge:
        case P: {
          try {
            Ho(pr | dr, e);
          } catch (a) {
            vn(e, e.return, a);
          }
          break;
        }
        case Q: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            vn(e, e.return, a);
          }
          break;
        }
      }
    }
    function T_(e) {
      switch (e.tag) {
        case U:
        case ge:
        case P: {
          try {
            Ho(Fr | dr, e);
          } catch (t) {
            vn(e, e.return, t);
          }
          break;
        }
      }
    }
    function __(e) {
      switch (e.tag) {
        case U:
        case ge:
        case P: {
          try {
            sl(pr | dr, e, e.return);
          } catch (a) {
            vn(e, e.return, a);
          }
          break;
        }
        case Q: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && NS(e, e.return, t);
          break;
        }
      }
    }
    function k_(e) {
      switch (e.tag) {
        case U:
        case ge:
        case P:
          try {
            sl(Fr | dr, e, e.return);
          } catch (t) {
            vn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Fp = Symbol.for;
      Fp("selector.component"), Fp("selector.has_pseudo_class"), Fp("selector.role"), Fp("selector.test_id"), Fp("selector.text");
    }
    var D_ = [];
    function O_() {
      D_.forEach(function(e) {
        return e();
      });
    }
    var N_ = x.ReactCurrentActQueue;
    function L_(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function ew() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && N_.current !== null && g("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var M_ = Math.ceil, AS = x.ReactCurrentDispatcher, zS = x.ReactCurrentOwner, Br = x.ReactCurrentBatchConfig, dl = x.ReactCurrentActQueue, mr = (
      /*             */
      0
    ), tw = (
      /*               */
      1
    ), Ir = (
      /*                */
      2
    ), Ui = (
      /*                */
      4
    ), Bu = 0, Pp = 1, nc = 2, Mm = 3, Hp = 4, nw = 5, US = 6, jt = mr, Ea = null, jn = null, yr = le, Xl = le, FS = No(le), gr = Bu, Vp = null, jm = le, Bp = le, Am = le, Ip = null, Va = null, PS = 0, rw = 500, aw = 1 / 0, j_ = 500, Iu = null;
    function Yp() {
      aw = qn() + j_;
    }
    function iw() {
      return aw;
    }
    var zm = !1, HS = null, Bf = null, rc = !1, Bo = null, $p = le, VS = [], BS = null, A_ = 50, Qp = 0, IS = null, YS = !1, Um = !1, z_ = 50, If = 0, Fm = null, Wp = rn, Pm = le, lw = !1;
    function Hm() {
      return Ea;
    }
    function Ca() {
      return (jt & (Ir | Ui)) !== mr ? qn() : (Wp !== rn || (Wp = qn()), Wp);
    }
    function Io(e) {
      var t = e.mode;
      if ((t & Rt) === Ze)
        return st;
      if ((jt & Ir) !== mr && yr !== le)
        return bs(yr);
      var a = NR() !== OR;
      if (a) {
        if (Br.transition !== null) {
          var i = Br.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Pm === Ft && (Pm = Ad()), Pm;
      }
      var u = za();
      if (u !== Ft)
        return u;
      var s = hb();
      return s;
    }
    function U_(e) {
      var t = e.mode;
      return (t & Rt) === Ze ? st : Yv();
    }
    function Sr(e, t, a, i) {
      u1(), lw && g("useInsertionEffect must not schedule updates."), YS && (Um = !0), Eo(e, a, i), (jt & Ir) !== le && e === Ea ? c1(t) : (Jr && _s(e, t, a), f1(t), e === Ea && ((jt & Ir) === mr && (Bp = St(Bp, a)), gr === Hp && Yo(e, yr)), Ba(e, i), a === st && jt === mr && (t.mode & Rt) === Ze && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !dl.isBatchingLegacy && (Yp(), lC()));
    }
    function F_(e, t, a) {
      var i = e.current;
      i.lanes = t, Eo(e, t, a), Ba(e, a);
    }
    function P_(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (jt & Ir) !== mr
      );
    }
    function Ba(e, t) {
      var a = e.callbackNode;
      Xc(e, t);
      var i = Kc(e, e === Ea ? yr : le);
      if (i === le) {
        a !== null && ww(a), e.callbackNode = null, e.callbackPriority = Ft;
        return;
      }
      var u = Al(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(dl.current !== null && a !== XS)) {
        a == null && s !== st && g("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && ww(a);
      var f;
      if (u === st)
        e.tag === Lo ? (dl.isBatchingLegacy !== null && (dl.didScheduleLegacyUpdate = !0), pR(sw.bind(null, e))) : iC(sw.bind(null, e)), dl.current !== null ? dl.current.push(Mo) : yb(function() {
          (jt & (Ir | Ui)) === mr && Mo();
        }), f = null;
      else {
        var p;
        switch (Xv(i)) {
          case Lr:
            p = cs;
            break;
          case _i:
            p = Nl;
            break;
          case ja:
            p = qi;
            break;
          case Aa:
            p = mu;
            break;
          default:
            p = qi;
            break;
        }
        f = JS(p, uw.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function uw(e, t) {
      if (rT(), Wp = rn, Pm = le, (jt & (Ir | Ui)) !== mr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = $u();
      if (i && e.callbackNode !== a)
        return null;
      var u = Kc(e, e === Ea ? yr : le);
      if (u === le)
        return null;
      var s = !Zc(e, u) && !Iv(e, u) && !t, f = s ? q_(e, u) : Bm(e, u);
      if (f !== Bu) {
        if (f === nc) {
          var p = Jc(e);
          p !== le && (u = p, f = $S(e, p));
        }
        if (f === Pp) {
          var v = Vp;
          throw ac(e, le), Yo(e, u), Ba(e, qn()), v;
        }
        if (f === US)
          Yo(e, u);
        else {
          var y = !Zc(e, u), S = e.current.alternate;
          if (y && !V_(S)) {
            if (f = Bm(e, u), f === nc) {
              var O = Jc(e);
              O !== le && (u = O, f = $S(e, O));
            }
            if (f === Pp) {
              var k = Vp;
              throw ac(e, le), Yo(e, u), Ba(e, qn()), k;
            }
          }
          e.finishedWork = S, e.finishedLanes = u, H_(e, f, u);
        }
      }
      return Ba(e, qn()), e.callbackNode === a ? uw.bind(null, e) : null;
    }
    function $S(e, t) {
      var a = Ip;
      if (nf(e)) {
        var i = ac(e, t);
        i.flags |= xr, lR(e.containerInfo);
      }
      var u = Bm(e, t);
      if (u !== nc) {
        var s = Va;
        Va = a, s !== null && ow(s);
      }
      return u;
    }
    function ow(e) {
      Va === null ? Va = e : Va.push.apply(Va, e);
    }
    function H_(e, t, a) {
      switch (t) {
        case Bu:
        case Pp:
          throw new Error("Root did not complete. This is a bug in React.");
        case nc: {
          ic(e, Va, Iu);
          break;
        }
        case Mm: {
          if (Yo(e, a), _u(a) && // do not delay if we're inside an act() scope
          !xw()) {
            var i = PS + rw - qn();
            if (i > 10) {
              var u = Kc(e, le);
              if (u !== le)
                break;
              var s = e.suspendedLanes;
              if (!ku(s, a)) {
                Ca(), ef(e, s);
                break;
              }
              e.timeoutHandle = By(ic.bind(null, e, Va, Iu), i);
              break;
            }
          }
          ic(e, Va, Iu);
          break;
        }
        case Hp: {
          if (Yo(e, a), Md(a))
            break;
          if (!xw()) {
            var f = ai(e, a), p = f, v = qn() - p, y = l1(v) - v;
            if (y > 10) {
              e.timeoutHandle = By(ic.bind(null, e, Va, Iu), y);
              break;
            }
          }
          ic(e, Va, Iu);
          break;
        }
        case nw: {
          ic(e, Va, Iu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function V_(e) {
      for (var t = e; ; ) {
        if (t.flags & ho) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!se(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & ho && v !== null) {
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
    function Yo(e, t) {
      t = Rs(t, Am), t = Rs(t, Bp), Wv(e, t);
    }
    function sw(e) {
      if (aT(), (jt & (Ir | Ui)) !== mr)
        throw new Error("Should not already be working.");
      $u();
      var t = Kc(e, le);
      if (!ea(t, st))
        return Ba(e, qn()), null;
      var a = Bm(e, t);
      if (e.tag !== Lo && a === nc) {
        var i = Jc(e);
        i !== le && (t = i, a = $S(e, i));
      }
      if (a === Pp) {
        var u = Vp;
        throw ac(e, le), Yo(e, t), Ba(e, qn()), u;
      }
      if (a === US)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, ic(e, Va, Iu), Ba(e, qn()), null;
    }
    function B_(e, t) {
      t !== le && (tf(e, St(t, st)), Ba(e, qn()), (jt & (Ir | Ui)) === mr && (Yp(), Mo()));
    }
    function QS(e, t) {
      var a = jt;
      jt |= tw;
      try {
        return e(t);
      } finally {
        jt = a, jt === mr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !dl.isBatchingLegacy && (Yp(), lC());
      }
    }
    function I_(e, t, a, i, u) {
      var s = za(), f = Br.transition;
      try {
        return Br.transition = null, Vn(Lr), e(t, a, i, u);
      } finally {
        Vn(s), Br.transition = f, jt === mr && Yp();
      }
    }
    function Yu(e) {
      Bo !== null && Bo.tag === Lo && (jt & (Ir | Ui)) === mr && $u();
      var t = jt;
      jt |= tw;
      var a = Br.transition, i = za();
      try {
        return Br.transition = null, Vn(Lr), e ? e() : void 0;
      } finally {
        Vn(i), Br.transition = a, jt = t, (jt & (Ir | Ui)) === mr && Mo();
      }
    }
    function cw() {
      return (jt & (Ir | Ui)) !== mr;
    }
    function Vm(e, t) {
      ia(FS, Xl, e), Xl = St(Xl, t);
    }
    function WS(e) {
      Xl = FS.current, aa(FS, e);
    }
    function ac(e, t) {
      e.finishedWork = null, e.finishedLanes = le;
      var a = e.timeoutHandle;
      if (a !== Iy && (e.timeoutHandle = Iy, mb(a)), jn !== null)
        for (var i = jn.return; i !== null; ) {
          var u = i.alternate;
          P0(u, i), i = i.return;
        }
      Ea = e;
      var s = lc(e.current, null);
      return jn = s, yr = Xl = t, gr = Bu, Vp = null, jm = le, Bp = le, Am = le, Ip = null, Va = null, FR(), al.discardPendingWarnings(), s;
    }
    function fw(e, t) {
      do {
        var a = jn;
        try {
          if (Xh(), AC(), pn(), zS.current = null, a === null || a.return === null) {
            gr = Pp, Vp = t, jn = null;
            return;
          }
          if (et && a.mode & Ht && Tm(a, !0), nt)
            if (ma(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Ti(a, i, yr);
            } else
              ds(a, t, yr);
          pT(e, a.return, a, t, yr), hw(a);
        } catch (u) {
          t = u, jn === a && a !== null ? (a = a.return, jn = a) : a = jn;
          continue;
        }
        return;
      } while (!0);
    }
    function dw() {
      var e = AS.current;
      return AS.current = Cm, e === null ? Cm : e;
    }
    function pw(e) {
      AS.current = e;
    }
    function Y_() {
      PS = qn();
    }
    function Gp(e) {
      jm = St(e, jm);
    }
    function $_() {
      gr === Bu && (gr = Mm);
    }
    function GS() {
      (gr === Bu || gr === Mm || gr === nc) && (gr = Hp), Ea !== null && (xs(jm) || xs(Bp)) && Yo(Ea, yr);
    }
    function Q_(e) {
      gr !== Hp && (gr = nc), Ip === null ? Ip = [e] : Ip.push(e);
    }
    function W_() {
      return gr === Bu;
    }
    function Bm(e, t) {
      var a = jt;
      jt |= Ir;
      var i = dw();
      if (Ea !== e || yr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (qp(e, yr), u.clear()), Gv(e, t);
        }
        Iu = Pd(), ac(e, t);
      }
      Eu(t);
      do
        try {
          G_();
          break;
        } catch (s) {
          fw(e, s);
        }
      while (!0);
      if (Xh(), jt = a, pw(i), jn !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return Lc(), Ea = null, yr = le, gr;
    }
    function G_() {
      for (; jn !== null; )
        vw(jn);
    }
    function q_(e, t) {
      var a = jt;
      jt |= Ir;
      var i = dw();
      if (Ea !== e || yr !== t) {
        if (Jr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (qp(e, yr), u.clear()), Gv(e, t);
        }
        Iu = Pd(), Yp(), ac(e, t);
      }
      Eu(t);
      do
        try {
          K_();
          break;
        } catch (s) {
          fw(e, s);
        }
      while (!0);
      return Xh(), pw(i), jt = a, jn !== null ? (Pv(), Bu) : (Lc(), Ea = null, yr = le, gr);
    }
    function K_() {
      for (; jn !== null && !gd(); )
        vw(jn);
    }
    function vw(e) {
      var t = e.alternate;
      Xt(e);
      var a;
      (e.mode & Ht) !== Ze ? (Xg(e), a = qS(t, e, Xl), Tm(e, !0)) : a = qS(t, e, Xl), pn(), e.memoizedProps = e.pendingProps, a === null ? hw(e) : jn = a, zS.current = null;
    }
    function hw(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & ss) === Je) {
          Xt(t);
          var u = void 0;
          if ((t.mode & Ht) === Ze ? u = F0(a, t, Xl) : (Xg(t), u = F0(a, t, Xl), Tm(t, !1)), pn(), u !== null) {
            jn = u;
            return;
          }
        } else {
          var s = $T(a, t);
          if (s !== null) {
            s.flags &= Mv, jn = s;
            return;
          }
          if ((t.mode & Ht) !== Ze) {
            Tm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= ss, i.subtreeFlags = Je, i.deletions = null;
          else {
            gr = US, jn = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          jn = v;
          return;
        }
        t = i, jn = t;
      } while (t !== null);
      gr === Bu && (gr = nw);
    }
    function ic(e, t, a) {
      var i = za(), u = Br.transition;
      try {
        Br.transition = null, Vn(Lr), X_(e, t, a, i);
      } finally {
        Br.transition = u, Vn(i);
      }
      return null;
    }
    function X_(e, t, a, i) {
      do
        $u();
      while (Bo !== null);
      if (o1(), (jt & (Ir | Ui)) !== mr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (bd(s), u === null)
        return Rd(), null;
      if (s === le && g("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = le, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Ft;
      var f = St(u.lanes, u.childLanes);
      Ud(e, f), e === Ea && (Ea = null, jn = null, yr = le), ((u.subtreeFlags & Gi) !== Je || (u.flags & Gi) !== Je) && (rc || (rc = !0, BS = a, JS(qi, function() {
        return $u(), null;
      })));
      var p = (u.subtreeFlags & (kl | Dl | Ol | Gi)) !== Je, v = (u.flags & (kl | Dl | Ol | Gi)) !== Je;
      if (p || v) {
        var y = Br.transition;
        Br.transition = null;
        var S = za();
        Vn(Lr);
        var O = jt;
        jt |= Ui, zS.current = null, KT(e, u), l0(), c_(e, u, s), sb(e.containerInfo), e.current = u, ps(s), f_(u, e, s), vs(), Sd(), jt = O, Vn(S), Br.transition = y;
      } else
        e.current = u, l0();
      var k = rc;
      if (rc ? (rc = !1, Bo = e, $p = s) : (If = 0, Fm = null), f = e.pendingLanes, f === le && (Bf = null), k || Sw(e.current, !1), Cd(u.stateNode, i), Jr && e.memoizedUpdaters.clear(), O_(), Ba(e, qn()), t !== null)
        for (var F = e.onRecoverableError, B = 0; B < t.length; B++) {
          var W = t[B], Ne = W.stack, it = W.digest;
          F(W.value, {
            componentStack: Ne,
            digest: it
          });
        }
      if (zm) {
        zm = !1;
        var Ke = HS;
        throw HS = null, Ke;
      }
      return ea($p, st) && e.tag !== Lo && $u(), f = e.pendingLanes, ea(f, st) ? (nT(), e === IS ? Qp++ : (Qp = 0, IS = e)) : Qp = 0, Mo(), Rd(), null;
    }
    function $u() {
      if (Bo !== null) {
        var e = Xv($p), t = Ds(ja, e), a = Br.transition, i = za();
        try {
          return Br.transition = null, Vn(t), Z_();
        } finally {
          Vn(i), Br.transition = a;
        }
      }
      return !1;
    }
    function J_(e) {
      VS.push(e), rc || (rc = !0, JS(qi, function() {
        return $u(), null;
      }));
    }
    function Z_() {
      if (Bo === null)
        return !1;
      var e = BS;
      BS = null;
      var t = Bo, a = $p;
      if (Bo = null, $p = le, (jt & (Ir | Ui)) !== mr)
        throw new Error("Cannot flush passive effects while already rendering.");
      YS = !0, Um = !1, Su(a);
      var i = jt;
      jt |= Ui, g_(t.current), v_(t, t.current, a, e);
      {
        var u = VS;
        VS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          e_(t, f);
        }
      }
      kd(), Sw(t.current, !0), jt = i, Mo(), Um ? t === Fm ? If++ : (If = 0, Fm = t) : If = 0, YS = !1, Um = !1, wd(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function mw(e) {
      return Bf !== null && Bf.has(e);
    }
    function e1(e) {
      Bf === null ? Bf = /* @__PURE__ */ new Set([e]) : Bf.add(e);
    }
    function t1(e) {
      zm || (zm = !0, HS = e);
    }
    var n1 = t1;
    function yw(e, t, a) {
      var i = ec(a, t), u = v0(e, i, st), s = Ao(e, u, st), f = Ca();
      s !== null && (Eo(s, st, f), Ba(s, f));
    }
    function vn(e, t, a) {
      if (WT(a), Kp(!1), e.tag === I) {
        yw(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === I) {
          yw(i, e, a);
          return;
        } else if (i.tag === Q) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !mw(s)) {
            var f = ec(a, e), p = hS(i, f, st), v = Ao(i, p, st), y = Ca();
            v !== null && (Eo(v, st, y), Ba(v, y));
            return;
          }
        }
        i = i.return;
      }
      g(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function r1(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ca();
      ef(e, a), d1(e), Ea === e && ku(yr, a) && (gr === Hp || gr === Mm && _u(yr) && qn() - PS < rw ? ac(e, le) : Am = St(Am, a)), Ba(e, u);
    }
    function gw(e, t) {
      t === Ft && (t = U_(e));
      var a = Ca(), i = Pa(e, t);
      i !== null && (Eo(i, t, a), Ba(i, a));
    }
    function a1(e) {
      var t = e.memoizedState, a = Ft;
      t !== null && (a = t.retryLane), gw(e, a);
    }
    function i1(e, t) {
      var a = Ft, i;
      switch (e.tag) {
        case he:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case He:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), gw(e, a);
    }
    function l1(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : M_(e / 1960) * 1960;
    }
    function u1() {
      if (Qp > A_)
        throw Qp = 0, IS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      If > z_ && (If = 0, Fm = null, g("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function o1() {
      al.flushLegacyContextWarning(), al.flushPendingUnsafeLifecycleWarnings();
    }
    function Sw(e, t) {
      Xt(e), Im(e, _l, __), t && Im(e, xi, k_), Im(e, _l, R_), t && Im(e, xi, T_), pn();
    }
    function Im(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== Je ? i = i.child : ((i.flags & t) !== Je && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Ym = null;
    function Ew(e) {
      {
        if ((jt & Ir) !== mr || !(e.mode & Rt))
          return;
        var t = e.tag;
        if (t !== Re && t !== I && t !== Q && t !== U && t !== ge && t !== Se && t !== P)
          return;
        var a = pt(e) || "ReactComponent";
        if (Ym !== null) {
          if (Ym.has(a))
            return;
          Ym.add(a);
        } else
          Ym = /* @__PURE__ */ new Set([a]);
        var i = ur;
        try {
          Xt(e), g("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? Xt(e) : pn();
        }
      }
    }
    var qS;
    {
      var s1 = null;
      qS = function(e, t, a) {
        var i = kw(s1, t);
        try {
          return M0(e, t, a);
        } catch (s) {
          if (CR() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Xh(), AC(), P0(e, t), kw(t, i), t.mode & Ht && Xg(t), Tl(null, M0, null, e, t, a), Qi()) {
            var u = os();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var Cw = !1, KS;
    KS = /* @__PURE__ */ new Set();
    function c1(e) {
      if (mi && !ZR())
        switch (e.tag) {
          case U:
          case ge:
          case P: {
            var t = jn && pt(jn) || "Unknown", a = t;
            if (!KS.has(a)) {
              KS.add(a);
              var i = pt(e) || "Unknown";
              g("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case Q: {
            Cw || (g("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), Cw = !0);
            break;
          }
        }
    }
    function qp(e, t) {
      if (Jr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          _s(e, i, t);
        });
      }
    }
    var XS = {};
    function JS(e, t) {
      {
        var a = dl.current;
        return a !== null ? (a.push(t), XS) : yd(e, t);
      }
    }
    function ww(e) {
      if (e !== XS)
        return Av(e);
    }
    function xw() {
      return dl.current !== null;
    }
    function f1(e) {
      {
        if (e.mode & Rt) {
          if (!ew())
            return;
        } else if (!L_() || jt !== mr || e.tag !== U && e.tag !== ge && e.tag !== P)
          return;
        if (dl.current === null) {
          var t = ur;
          try {
            Xt(e), g(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, pt(e));
          } finally {
            t ? Xt(e) : pn();
          }
        }
      }
    }
    function d1(e) {
      e.tag !== Lo && ew() && dl.current === null && g(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Kp(e) {
      lw = e;
    }
    var Fi = null, Yf = null, p1 = function(e) {
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
    function ZS(e) {
      return $f(e);
    }
    function eE(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = $f(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: ae,
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
    function bw(e, t) {
      {
        if (Fi === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case Q: {
            typeof i == "function" && (u = !0);
            break;
          }
          case U: {
            (typeof i == "function" || s === vt) && (u = !0);
            break;
          }
          case ge: {
            (s === ae || s === vt) && (u = !0);
            break;
          }
          case Se:
          case P: {
            (s === yt || s === vt) && (u = !0);
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
    function Rw(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        Yf === null && (Yf = /* @__PURE__ */ new WeakSet()), Yf.add(e);
      }
    }
    var v1 = function(e, t) {
      {
        if (Fi === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        $u(), Yu(function() {
          tE(e.current, i, a);
        });
      }
    }, h1 = function(e, t) {
      {
        if (e.context !== ui)
          return;
        $u(), Yu(function() {
          Xp(t, e, null, null);
        });
      }
    };
    function tE(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case U:
          case P:
          case Q:
            v = p;
            break;
          case ge:
            v = p.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, S = !1;
        if (v !== null) {
          var O = Fi(v);
          O !== void 0 && (a.has(O) ? S = !0 : t.has(O) && (f === Q ? S = !0 : y = !0));
        }
        if (Yf !== null && (Yf.has(e) || i !== null && Yf.has(i)) && (S = !0), S && (e._debugNeedsRemount = !0), S || y) {
          var k = Pa(e, st);
          k !== null && Sr(k, e, st, rn);
        }
        u !== null && !S && tE(u, t, a), s !== null && tE(s, t, a);
      }
    }
    var m1 = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return nE(e.current, i, a), a;
      }
    };
    function nE(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case U:
          case P:
          case Q:
            p = f;
            break;
          case ge:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? y1(e, a) : i !== null && nE(i, t, a), u !== null && nE(u, t, a);
      }
    }
    function y1(e, t) {
      {
        var a = g1(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case te:
              t.add(i.stateNode);
              return;
            case ee:
              t.add(i.stateNode.containerInfo);
              return;
            case I:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function g1(e, t) {
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
    var rE;
    {
      rE = !1;
      try {
        var Tw = Object.preventExtensions({});
      } catch {
        rE = !0;
      }
    }
    function S1(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = Je, this.subtreeFlags = Je, this.deletions = null, this.lanes = le, this.childLanes = le, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !rE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var oi = function(e, t, a, i) {
      return new S1(e, t, a, i);
    };
    function aE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function E1(e) {
      return typeof e == "function" && !aE(e) && e.defaultProps === void 0;
    }
    function C1(e) {
      if (typeof e == "function")
        return aE(e) ? Q : U;
      if (e != null) {
        var t = e.$$typeof;
        if (t === ae)
          return ge;
        if (t === yt)
          return Se;
      }
      return Re;
    }
    function lc(e, t) {
      var a = e.alternate;
      a === null ? (a = oi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Je, a.subtreeFlags = Je, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & Fn, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case Re:
        case U:
        case P:
          a.type = $f(e.type);
          break;
        case Q:
          a.type = ZS(e.type);
          break;
        case ge:
          a.type = eE(e.type);
          break;
      }
      return a;
    }
    function w1(e, t) {
      e.flags &= Fn | En;
      var a = e.alternate;
      if (a === null)
        e.childLanes = le, e.lanes = t, e.child = null, e.subtreeFlags = Je, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Je, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function x1(e, t, a) {
      var i;
      return e === Vh ? (i = Rt, t === !0 && (i |= en, i |= Vt)) : i = Ze, Jr && (i |= Ht), oi(I, null, null, i);
    }
    function iE(e, t, a, i, u, s) {
      var f = Re, p = e;
      if (typeof e == "function")
        aE(e) ? (f = Q, p = ZS(p)) : p = $f(p);
      else if (typeof e == "string")
        f = te;
      else
        e: switch (e) {
          case di:
            return $o(a.children, u, s, t);
          case Wa:
            f = Ee, u |= en, (u & Rt) !== Ze && (u |= Vt);
            break;
          case pi:
            return b1(a, u, s, t);
          case De:
            return R1(a, u, s, t);
          case Be:
            return T1(a, u, s, t);
          case kn:
            return _w(a, u, s, t);
          case un:
          case Tt:
          case dn:
          case lr:
          case bt:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case vi:
                  f = ce;
                  break e;
                case R:
                  f = Ue;
                  break e;
                case ae:
                  f = ge, p = eE(p);
                  break e;
                case yt:
                  f = Se;
                  break e;
                case vt:
                  f = de, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var y = i ? pt(i) : null;
              y && (v += `

Check the render method of \`` + y + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var S = oi(f, a, t, u);
      return S.elementType = e, S.type = p, S.lanes = s, S._debugOwner = i, S;
    }
    function lE(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = iE(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function $o(e, t, a, i) {
      var u = oi(K, e, i, t);
      return u.lanes = a, u;
    }
    function b1(e, t, a, i) {
      typeof e.id != "string" && g('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = oi(Le, e, i, t | Ht);
      return u.elementType = pi, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function R1(e, t, a, i) {
      var u = oi(he, e, i, t);
      return u.elementType = De, u.lanes = a, u;
    }
    function T1(e, t, a, i) {
      var u = oi(He, e, i, t);
      return u.elementType = Be, u.lanes = a, u;
    }
    function _w(e, t, a, i) {
      var u = oi(Ce, e, i, t);
      u.elementType = kn, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function uE(e, t, a) {
      var i = oi(ne, e, null, t);
      return i.lanes = a, i;
    }
    function _1() {
      var e = oi(te, null, null, Ze);
      return e.elementType = "DELETED", e;
    }
    function k1(e) {
      var t = oi(Te, null, null, Ze);
      return t.stateNode = e, t;
    }
    function oE(e, t, a) {
      var i = e.children !== null ? e.children : [], u = oi(ee, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function kw(e, t) {
      return e === null && (e = oi(Re, null, null, Ze)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function D1(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Iy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Ft, this.eventTimes = Ts(le), this.expirationTimes = Ts(rn), this.pendingLanes = le, this.suspendedLanes = le, this.pingedLanes = le, this.expiredLanes = le, this.mutableReadLanes = le, this.finishedLanes = le, this.entangledLanes = le, this.entanglements = Ts(le), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < Cu; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Vh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Lo:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function Dw(e, t, a, i, u, s, f, p, v, y) {
      var S = new D1(e, t, a, p, v), O = x1(t, s);
      S.current = O, O.stateNode = S;
      {
        var k = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        O.memoizedState = k;
      }
      return Cg(O), S;
    }
    var sE = "18.3.1";
    function O1(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return $r(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: ir,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var cE, fE;
    cE = !1, fE = {};
    function Ow(e) {
      if (!e)
        return ui;
      var t = vo(e), a = dR(t);
      if (t.tag === Q) {
        var i = t.type;
        if (Yl(i))
          return rC(t, i, a);
      }
      return a;
    }
    function N1(e, t) {
      {
        var a = vo(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Kr(a);
        if (u === null)
          return null;
        if (u.mode & en) {
          var s = pt(a) || "Component";
          if (!fE[s]) {
            fE[s] = !0;
            var f = ur;
            try {
              Xt(u), a.mode & en ? g("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : g("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? Xt(f) : pn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function Nw(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return Dw(e, t, v, y, a, i, u, s, f);
    }
    function Lw(e, t, a, i, u, s, f, p, v, y) {
      var S = !0, O = Dw(a, i, S, e, u, s, f, p, v);
      O.context = Ow(null);
      var k = O.current, F = Ca(), B = Io(k), W = Hu(F, B);
      return W.callback = t ?? null, Ao(k, W, B), F_(O, B, F), O;
    }
    function Xp(e, t, a, i) {
      Ed(t, e);
      var u = t.current, s = Ca(), f = Io(u);
      wn(f);
      var p = Ow(a);
      t.context === null ? t.context = p : t.pendingContext = p, mi && ur !== null && !cE && (cE = !0, g(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, pt(ur) || "Unknown"));
      var v = Hu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && g("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = Ao(u, v, f);
      return y !== null && (Sr(y, u, f, s), nm(y, u, f)), f;
    }
    function $m(e) {
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
    function L1(e) {
      switch (e.tag) {
        case I: {
          var t = e.stateNode;
          if (nf(t)) {
            var a = Vv(t);
            B_(t, a);
          }
          break;
        }
        case he: {
          Yu(function() {
            var u = Pa(e, st);
            if (u !== null) {
              var s = Ca();
              Sr(u, e, st, s);
            }
          });
          var i = st;
          dE(e, i);
          break;
        }
      }
    }
    function Mw(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Qv(a.retryLane, t));
    }
    function dE(e, t) {
      Mw(e, t);
      var a = e.alternate;
      a && Mw(a, t);
    }
    function M1(e) {
      if (e.tag === he) {
        var t = Es, a = Pa(e, t);
        if (a !== null) {
          var i = Ca();
          Sr(a, e, t, i);
        }
        dE(e, t);
      }
    }
    function j1(e) {
      if (e.tag === he) {
        var t = Io(e), a = Pa(e, t);
        if (a !== null) {
          var i = Ca();
          Sr(a, e, t, i);
        }
        dE(e, t);
      }
    }
    function jw(e) {
      var t = hn(e);
      return t === null ? null : t.stateNode;
    }
    var Aw = function(e) {
      return null;
    };
    function A1(e) {
      return Aw(e);
    }
    var zw = function(e) {
      return !1;
    };
    function z1(e) {
      return zw(e);
    }
    var Uw = null, Fw = null, Pw = null, Hw = null, Vw = null, Bw = null, Iw = null, Yw = null, $w = null;
    {
      var Qw = function(e, t, a) {
        var i = t[a], u = xt(e) ? e.slice() : Et({}, e);
        return a + 1 === t.length ? (xt(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = Qw(e[i], t, a + 1), u);
      }, Ww = function(e, t) {
        return Qw(e, t, 0);
      }, Gw = function(e, t, a, i) {
        var u = t[i], s = xt(e) ? e.slice() : Et({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], xt(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = Gw(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, qw = function(e, t, a) {
        if (t.length !== a.length) {
          A("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              A("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return Gw(e, t, a, 0);
      }, Kw = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = xt(e) ? e.slice() : Et({}, e);
        return s[u] = Kw(e[u], t, a + 1, i), s;
      }, Xw = function(e, t, a) {
        return Kw(e, t, 0, a);
      }, pE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      Uw = function(e, t, a, i) {
        var u = pE(e, t);
        if (u !== null) {
          var s = Xw(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = Et({}, e.memoizedProps);
          var f = Pa(e, st);
          f !== null && Sr(f, e, st, rn);
        }
      }, Fw = function(e, t, a) {
        var i = pE(e, t);
        if (i !== null) {
          var u = Ww(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = Et({}, e.memoizedProps);
          var s = Pa(e, st);
          s !== null && Sr(s, e, st, rn);
        }
      }, Pw = function(e, t, a, i) {
        var u = pE(e, t);
        if (u !== null) {
          var s = qw(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = Et({}, e.memoizedProps);
          var f = Pa(e, st);
          f !== null && Sr(f, e, st, rn);
        }
      }, Hw = function(e, t, a) {
        e.pendingProps = Xw(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Pa(e, st);
        i !== null && Sr(i, e, st, rn);
      }, Vw = function(e, t) {
        e.pendingProps = Ww(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Pa(e, st);
        a !== null && Sr(a, e, st, rn);
      }, Bw = function(e, t, a) {
        e.pendingProps = qw(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Pa(e, st);
        i !== null && Sr(i, e, st, rn);
      }, Iw = function(e) {
        var t = Pa(e, st);
        t !== null && Sr(t, e, st, rn);
      }, Yw = function(e) {
        Aw = e;
      }, $w = function(e) {
        zw = e;
      };
    }
    function U1(e) {
      var t = Kr(e);
      return t === null ? null : t.stateNode;
    }
    function F1(e) {
      return null;
    }
    function P1() {
      return ur;
    }
    function H1(e) {
      var t = e.findFiberByHostInstance, a = x.ReactCurrentDispatcher;
      return yo({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: Uw,
        overrideHookStateDeletePath: Fw,
        overrideHookStateRenamePath: Pw,
        overrideProps: Hw,
        overridePropsDeletePath: Vw,
        overridePropsRenamePath: Bw,
        setErrorHandler: Yw,
        setSuspenseHandler: $w,
        scheduleUpdate: Iw,
        currentDispatcherRef: a,
        findHostInstanceByFiber: U1,
        findFiberByHostInstance: t || F1,
        // React Refresh
        findHostInstancesForRefresh: m1,
        scheduleRefresh: v1,
        scheduleRoot: h1,
        setRefreshHandler: p1,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: P1,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: sE
      });
    }
    var Jw = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function vE(e) {
      this._internalRoot = e;
    }
    Qm.prototype.render = vE.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? g("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Wm(arguments[1]) ? g("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && g("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== zn) {
          var i = jw(t.current);
          i && i.parentNode !== a && g("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Xp(e, t, null, null);
    }, Qm.prototype.unmount = vE.prototype.unmount = function() {
      typeof arguments[0] == "function" && g("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        cw() && g("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Yu(function() {
          Xp(null, e, null, null);
        }), JE(t);
      }
    };
    function V1(e, t) {
      if (!Wm(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      Zw(e);
      var a = !1, i = !1, u = "", s = Jw;
      t != null && (t.hydrate ? A("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === kr && g(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = Nw(e, Vh, null, a, i, u, s);
      jh(f.current, e);
      var p = e.nodeType === zn ? e.parentNode : e;
      return rp(p), new vE(f);
    }
    function Qm(e) {
      this._internalRoot = e;
    }
    function B1(e) {
      e && nh(e);
    }
    Qm.prototype.unstable_scheduleHydration = B1;
    function I1(e, t, a) {
      if (!Wm(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      Zw(e), t === void 0 && g("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = Jw;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = Lw(t, null, e, Vh, i, s, f, p, v);
      if (jh(y.current, e), rp(e), u)
        for (var S = 0; S < u.length; S++) {
          var O = u[S];
          WR(y, O);
        }
      return new Qm(y);
    }
    function Wm(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === id));
    }
    function Jp(e) {
      return !!(e && (e.nodeType === Wr || e.nodeType === $i || e.nodeType === id || e.nodeType === zn && e.nodeValue === " react-mount-point-unstable "));
    }
    function Zw(e) {
      e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), vp(e) && (e._reactRootContainer ? g("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : g("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var Y1 = x.ReactCurrentOwner, ex;
    ex = function(e) {
      if (e._reactRootContainer && e.nodeType !== zn) {
        var t = jw(e._reactRootContainer.current);
        t && t.parentNode !== e && g("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = hE(e), u = !!(i && Oo(i));
      u && !a && g("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === Wr && e.tagName && e.tagName.toUpperCase() === "BODY" && g("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function hE(e) {
      return e ? e.nodeType === $i ? e.documentElement : e.firstChild : null;
    }
    function tx() {
    }
    function $1(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var k = $m(f);
            s.call(k);
          };
        }
        var f = Lw(
          t,
          i,
          e,
          Lo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          tx
        );
        e._reactRootContainer = f, jh(f.current, e);
        var p = e.nodeType === zn ? e.parentNode : e;
        return rp(p), Yu(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var k = $m(S);
            y.call(k);
          };
        }
        var S = Nw(
          e,
          Lo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          tx
        );
        e._reactRootContainer = S, jh(S.current, e);
        var O = e.nodeType === zn ? e.parentNode : e;
        return rp(O), Yu(function() {
          Xp(t, S, a, i);
        }), S;
      }
    }
    function Q1(e, t) {
      e !== null && typeof e != "function" && g("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Gm(e, t, a, i, u) {
      ex(a), Q1(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = $1(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = $m(f);
            p.call(v);
          };
        }
        Xp(t, f, e, u);
      }
      return $m(f);
    }
    var nx = !1;
    function W1(e) {
      {
        nx || (nx = !0, g("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = Y1.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || g("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", zt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === Wr ? e : N1(e, "findDOMNode");
    }
    function G1(e, t, a) {
      if (g("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Jp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = vp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Gm(null, e, t, !0, a);
    }
    function q1(e, t, a) {
      if (g("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Jp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = vp(t) && t._reactRootContainer === void 0;
        i && g("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Gm(null, e, t, !1, a);
    }
    function K1(e, t, a, i) {
      if (g("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Jp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !dy(e))
        throw new Error("parentComponent must be a valid React Component");
      return Gm(e, t, a, !1, i);
    }
    var rx = !1;
    function X1(e) {
      if (rx || (rx = !0, g("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Jp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = vp(e) && e._reactRootContainer === void 0;
        t && g("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = hE(e), i = a && !Oo(a);
          i && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Yu(function() {
          Gm(null, null, e, !1, function() {
            e._reactRootContainer = null, JE(e);
          });
        }), !0;
      } else {
        {
          var u = hE(e), s = !!(u && Oo(u)), f = e.nodeType === Wr && Jp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && g("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Rr(L1), Co(M1), Jv(j1), Ns(za), Hd(qv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && g("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), Sc(Zx), fy(QS, I_, Yu);
    function J1(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Wm(t))
        throw new Error("Target container is not a DOM element.");
      return O1(e, t, null, a);
    }
    function Z1(e, t, a, i) {
      return K1(e, t, a, i);
    }
    var mE = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Oo, wf, Ah, so, Ec, QS]
    };
    function ek(e, t) {
      return mE.usingClientEntryPoint || g('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), V1(e, t);
    }
    function tk(e, t, a) {
      return mE.usingClientEntryPoint || g('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), I1(e, t, a);
    }
    function nk(e) {
      return cw() && g("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Yu(e);
    }
    var rk = H1({
      findFiberByHostInstance: $s,
      bundleType: 1,
      version: sE,
      rendererPackageName: "react-dom"
    });
    if (!rk && $t && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var ax = window.location.protocol;
      /^(https?|file):$/.test(ax) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (ax === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ya.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = mE, Ya.createPortal = J1, Ya.createRoot = ek, Ya.findDOMNode = W1, Ya.flushSync = nk, Ya.hydrate = G1, Ya.hydrateRoot = tk, Ya.render = q1, Ya.unmountComponentAtNode = X1, Ya.unstable_batchedUpdates = QS, Ya.unstable_renderSubtreeIntoContainer = Z1, Ya.version = sE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Ya;
}
function yx() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(yx);
    } catch (T) {
      console.error(T);
    }
  }
}
process.env.NODE_ENV === "production" ? (yx(), xE.exports = dk()) : xE.exports = pk();
var Wu = xE.exports, bE, Km = Wu;
if (process.env.NODE_ENV === "production")
  bE = Km.createRoot, Km.hydrateRoot;
else {
  var vx = Km.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  bE = function(T, w) {
    vx.usingClientEntryPoint = !0;
    try {
      return Km.createRoot(T, w);
    } finally {
      vx.usingClientEntryPoint = !1;
    }
  };
}
const Jm = {
  key: "sr3",
  label: "Shadowrun 3rd Edition",
  isPrimary: !0,
  mockDataLoaded: !0
}, vk = {
  activeEdition: Jm,
  setEdition: () => {
  },
  supportedEditions: [Jm],
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
}, gx = Y.createContext(vk);
function hk({ children: T }) {
  const [w, x] = Y.useState(Jm), [Z, J] = Y.useState({}), [A, g] = Y.useState(null), re = Y.useMemo(
    () => [
      Jm,
      {
        key: "sr5",
        label: "Shadowrun 5th Edition",
        isPrimary: !1,
        mockDataLoaded: !0
      }
    ],
    []
  ), U = Y.useCallback(
    async (K) => {
      const Ee = K ?? w.key;
      if (J((Ue) => {
        var ce;
        return {
          ...Ue,
          [Ee]: {
            data: (ce = Ue[Ee]) == null ? void 0 : ce.data,
            loading: !0,
            error: void 0
          }
        };
      }), typeof fetch != "function") {
        J((Ue) => {
          var ce;
          return {
            ...Ue,
            [Ee]: {
              data: (ce = Ue[Ee]) == null ? void 0 : ce.data,
              loading: !1,
              error: "fetch is not available in this environment"
            }
          };
        });
        return;
      }
      try {
        const Ue = await fetch(`/api/editions/${Ee}/character-creation`);
        if (!Ue.ok)
          throw new Error(`Failed to load edition data (${Ue.status})`);
        const ce = await Ue.json(), ge = (ce == null ? void 0 : ce.character_creation) ?? ce;
        J((Le) => ({
          ...Le,
          [Ee]: {
            data: ge,
            loading: !1,
            error: void 0
          }
        }));
      } catch (Ue) {
        const ce = Ue instanceof Error ? Ue.message : "Unknown error loading edition data";
        J((ge) => {
          var Le;
          return {
            ...ge,
            [Ee]: {
              data: (Le = ge[Ee]) == null ? void 0 : Le.data,
              loading: !1,
              error: ce
            }
          };
        });
      }
    },
    [w.key]
  ), Q = Y.useCallback((K) => `${new Intl.NumberFormat("en-US").format(K)}¥`, []), Re = Y.useCallback((K) => JSON.parse(JSON.stringify(K)), []), I = Y.useCallback(
    (K, Ee) => {
      var ce;
      if (!Ee)
        return Re(K);
      const Ue = Re(K);
      if (Ee.resources && ((ce = Ue.priorities) != null && ce.resources)) {
        const ge = Ue.priorities.resources;
        Object.entries(Ee.resources).forEach(([Le, he]) => {
          const Se = Le;
          typeof he == "number" && ge[Se] && (ge[Se] = {
            ...ge[Se],
            label: Q(he)
          });
        });
      }
      return Ue;
    },
    [Re, Q]
  ), ee = Y.useCallback(
    async (K) => {
      var Ee, Ue;
      if (K) {
        g((ce) => (ce == null ? void 0 : ce.campaignId) === K ? { ...ce, loading: !0, error: void 0 } : {
          campaignId: K,
          edition: w.key,
          data: ce == null ? void 0 : ce.data,
          gameplayRules: ce == null ? void 0 : ce.gameplayRules,
          loading: !0,
          error: void 0
        });
        try {
          const ce = await fetch(`/api/campaigns/${K}/character-creation`);
          if (!ce.ok)
            throw new Error(`Failed to load campaign character creation (${ce.status})`);
          const ge = await ce.json(), Le = ((Ue = (Ee = ge.edition) == null ? void 0 : Ee.toLowerCase) == null ? void 0 : Ue.call(Ee)) ?? w.key, he = ge.edition_data;
          he && J((Se) => {
            var P;
            return {
              ...Se,
              [Le]: {
                data: ((P = Se[Le]) == null ? void 0 : P.data) ?? he,
                loading: !1,
                error: void 0
              }
            };
          }), g({
            campaignId: K,
            edition: Le,
            data: he ? I(he, ge.gameplay_rules) : void 0,
            gameplayRules: ge.gameplay_rules,
            loading: !1,
            error: void 0
          });
        } catch (ce) {
          const ge = ce instanceof Error ? ce.message : "Unknown error loading campaign character creation data";
          throw g({
            campaignId: K,
            edition: w.key,
            data: void 0,
            gameplayRules: void 0,
            loading: !1,
            error: ge
          }), ce;
        }
      }
    },
    [w.key, I]
  ), te = Y.useCallback(() => {
    g(null);
  }, []), ne = Y.useMemo(() => {
    const K = Z[w.key], Ee = A && !A.loading && !A.error && A.edition === w.key, Ue = Ee && A.data ? A.data : K == null ? void 0 : K.data;
    return {
      activeEdition: w,
      supportedEditions: re,
      setEdition: (ce) => {
        const ge = re.find((Le) => Le.key === ce);
        ge ? x(ge) : console.warn(`Edition '${ce}' is not registered; keeping current edition.`);
      },
      characterCreationData: Ue,
      reloadEditionData: U,
      loadCampaignCharacterCreation: ee,
      clearCampaignCharacterCreation: te,
      isLoading: (K == null ? void 0 : K.loading) ?? !1,
      error: K == null ? void 0 : K.error,
      campaignId: A == null ? void 0 : A.campaignId,
      campaignCharacterCreation: Ee ? A == null ? void 0 : A.data : void 0,
      campaignGameplayRules: Ee ? A == null ? void 0 : A.gameplayRules : void 0,
      campaignLoading: (A == null ? void 0 : A.loading) ?? !1,
      campaignError: A == null ? void 0 : A.error
    };
  }, [
    w,
    A,
    te,
    Z,
    ee,
    U,
    re
  ]);
  return Y.useEffect(() => {
    const K = Z[w.key];
    !(K != null && K.data) && !(K != null && K.loading) && U(w.key);
  }, [w.key, Z, U]), Y.useEffect(() => {
    typeof window > "u" || (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
      loadCampaignCharacterCreation: ee,
      clearCampaignCharacterCreation: te
    }));
  }, [te, ee]), Y.useEffect(() => {
    var ce, ge, Le, he, Se, P;
    const K = Z[w.key], Ee = A && !A.loading && !A.error && A.edition === w.key, Ue = Ee && A.data ? A.data : K == null ? void 0 : K.data;
    Ue && typeof window < "u" && ((ge = (ce = window.ShadowmasterLegacyApp) == null ? void 0 : ce.setEditionData) == null || ge.call(ce, w.key, Ue)), typeof window < "u" && (Ee ? (he = (Le = window.ShadowmasterLegacyApp) == null ? void 0 : Le.applyCampaignCreationDefaults) == null || he.call(Le, {
      campaignId: A.campaignId,
      edition: A.edition,
      gameplayRules: A.gameplayRules ?? null
    }) : (P = (Se = window.ShadowmasterLegacyApp) == null ? void 0 : Se.applyCampaignCreationDefaults) == null || P.call(Se, null));
  }, [w.key, A, Z]), /* @__PURE__ */ E.jsx(gx.Provider, { value: ne, children: T });
}
function mk() {
  const T = Y.useContext(gx);
  if (!T)
    throw new Error("useEditionContext must be used within an EditionProvider.");
  return T;
}
function SE(T, w) {
  return !!(T != null && T.roles.some((x) => x.toLowerCase() === w.toLowerCase()));
}
async function nv(T, w = {}) {
  const x = new Headers(w.headers || {});
  w.body && !x.has("Content-Type") && x.set("Content-Type", "application/json");
  const Z = await fetch(T, {
    ...w,
    headers: x,
    credentials: "include"
  });
  if (Z.status === 204)
    return {};
  const J = await Z.text(), A = () => {
    try {
      return J ? JSON.parse(J) : {};
    } catch {
      return {};
    }
  };
  if (!Z.ok) {
    const g = A(), re = typeof g.error == "string" && g.error.trim().length > 0 ? g.error : Z.statusText;
    throw new Error(re);
  }
  return A();
}
function yk() {
  const [T, w] = Y.useState("login"), [x, Z] = Y.useState(null), [J, A] = Y.useState(!1), [g, re] = Y.useState(null), [U, Q] = Y.useState(null), [Re, I] = Y.useState(!1), [ee, te] = Y.useState(""), [ne, K] = Y.useState(""), [Ee, Ue] = Y.useState(""), [ce, ge] = Y.useState(""), [Le, he] = Y.useState(""), [Se, P] = Y.useState(""), [de, ie] = Y.useState(""), [Te, He] = Y.useState(""), [tt, Ce] = Y.useState(""), kt = Y.useRef(!1), Ct = Y.useRef(null), Dt = "auth-menu-dropdown", Ve = "auth-menu-heading";
  Y.useEffect(() => {
    kt.current || (kt.current = !0, me());
  }, []), Y.useEffect(() => {
    window.ShadowmasterAuth = {
      user: x,
      isAdministrator: SE(x, "administrator"),
      isGamemaster: SE(x, "gamemaster"),
      isPlayer: SE(x, "player")
    }, window.dispatchEvent(new CustomEvent("shadowmaster:auth", { detail: window.ShadowmasterAuth }));
  }, [x]), Y.useEffect(() => {
    if (!Re)
      return;
    const be = (fe) => {
      Ct.current && (Ct.current.contains(fe.target) || I(!1));
    }, We = (fe) => {
      fe.key === "Escape" && I(!1);
    };
    return document.addEventListener("mousedown", be), document.addEventListener("keydown", We), () => {
      document.removeEventListener("mousedown", be), document.removeEventListener("keydown", We);
    };
  }, [Re]), Y.useEffect(() => {
    if (!Re || x)
      return;
    const be = T === "register" ? "register-email" : "login-email", We = window.setTimeout(() => {
      const fe = document.getElementById(be);
      fe == null || fe.focus();
    }, 0);
    return () => window.clearTimeout(We);
  }, [Re, x, T]);
  async function me() {
    try {
      A(!0), re(null);
      const be = await nv("/api/auth/me");
      Z(be.user), w("login"), I(!be.user);
    } catch {
      Z(null), I(!0);
    } finally {
      A(!1);
    }
  }
  async function Qe(be) {
    be.preventDefault(), A(!0), re(null), Q(null);
    try {
      const We = await nv("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: ee,
          password: ne
        })
      });
      Z(We.user), w("login"), K(""), Q("Welcome back!"), I(!1);
    } catch (We) {
      re(We instanceof Error ? We.message : "Login failed");
    } finally {
      A(!1);
    }
  }
  async function we(be) {
    if (be.preventDefault(), Le !== Se) {
      re("Passwords do not match");
      return;
    }
    A(!0), re(null), Q(null);
    try {
      const We = await nv("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: Ee,
          username: ce,
          password: Le
        })
      });
      Z(We.user), w("login"), Q("Account created successfully."), he(""), P("");
    } catch (We) {
      re(We instanceof Error ? We.message : "Registration failed");
    } finally {
      A(!1);
    }
  }
  async function N() {
    A(!0), re(null), Q(null);
    try {
      await nv("/api/auth/logout", { method: "POST" }), Z(null), w("login"), Q("Signed out successfully."), I(!0);
    } catch (be) {
      re(be instanceof Error ? be.message : "Logout failed");
    } finally {
      A(!1);
    }
  }
  async function q(be) {
    if (be.preventDefault(), Te !== tt) {
      re("New passwords do not match");
      return;
    }
    A(!0), re(null), Q(null);
    try {
      await nv("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({
          current_password: de,
          new_password: Te
        })
      }), Q("Password updated successfully."), ie(""), He(""), Ce(""), w("login");
    } catch (We) {
      re(We instanceof Error ? We.message : "Password update failed");
    } finally {
      A(!1);
    }
  }
  const nt = Y.useMemo(() => x ? x.roles.join(", ") : "", [x]), et = x ? `Signed in as ${x.email}.` : "Sign in to manage campaigns, sessions, and characters.";
  return /* @__PURE__ */ E.jsxs("section", { className: `auth-panel${Re ? " auth-panel--open" : ""}`, ref: Ct, children: [
    /* @__PURE__ */ E.jsxs(
      "button",
      {
        type: "button",
        className: "auth-panel__toggle",
        "aria-haspopup": "dialog",
        "aria-expanded": Re,
        "aria-controls": Dt,
        onClick: () => I((be) => !be),
        children: [
          /* @__PURE__ */ E.jsxs("span", { className: "auth-panel__hamburger", "aria-hidden": "true", children: [
            /* @__PURE__ */ E.jsx("span", {}),
            /* @__PURE__ */ E.jsx("span", {}),
            /* @__PURE__ */ E.jsx("span", {})
          ] }),
          /* @__PURE__ */ E.jsx("span", { className: "auth-panel__label", children: x ? x.username : "Sign In" }),
          x && /* @__PURE__ */ E.jsx("span", { className: "auth-panel__tag", children: nt || "Player" })
        ]
      }
    ),
    /* @__PURE__ */ E.jsxs(
      "div",
      {
        id: Dt,
        className: "auth-panel__dropdown",
        role: "dialog",
        "aria-modal": "false",
        "aria-hidden": !Re,
        "aria-labelledby": Ve,
        children: [
          /* @__PURE__ */ E.jsxs("header", { className: "auth-panel__header", children: [
            /* @__PURE__ */ E.jsxs("div", { children: [
              /* @__PURE__ */ E.jsx("h2", { id: Ve, children: x ? `Welcome, ${x.username}` : "Account Access" }),
              /* @__PURE__ */ E.jsx("p", { className: "auth-panel__status", children: et })
            ] }),
            x && /* @__PURE__ */ E.jsx("div", { className: "auth-panel__roles", children: /* @__PURE__ */ E.jsx("span", { className: "auth-tag", children: nt || "Player" }) })
          ] }),
          g && /* @__PURE__ */ E.jsx("div", { className: "auth-alert auth-alert--error", children: g }),
          U && /* @__PURE__ */ E.jsx("div", { className: "auth-alert auth-alert--success", children: U }),
          x ? /* @__PURE__ */ E.jsxs("div", { className: "auth-panel__content", children: [
            /* @__PURE__ */ E.jsxs("div", { className: "auth-panel__actions", children: [
              /* @__PURE__ */ E.jsx(
                "button",
                {
                  type: "button",
                  className: "btn btn-secondary",
                  onClick: () => {
                    re(null), Q(null), w(T === "password" ? "login" : "password");
                  },
                  disabled: J,
                  children: T === "password" ? "Hide Password Form" : "Change Password"
                }
              ),
              /* @__PURE__ */ E.jsx("button", { className: "btn btn-primary", type: "button", onClick: N, disabled: J, children: "Logout" })
            ] }),
            T === "password" && /* @__PURE__ */ E.jsxs("form", { className: "auth-form", onSubmit: q, children: [
              /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ E.jsx("label", { htmlFor: "current-password", children: "Current Password" }),
                /* @__PURE__ */ E.jsx(
                  "input",
                  {
                    id: "current-password",
                    type: "password",
                    value: de,
                    onChange: (be) => ie(be.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ E.jsx("label", { htmlFor: "new-password", children: "New Password" }),
                /* @__PURE__ */ E.jsx(
                  "input",
                  {
                    id: "new-password",
                    type: "password",
                    value: Te,
                    onChange: (be) => He(be.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ E.jsx("label", { htmlFor: "confirm-password", children: "Confirm New Password" }),
                /* @__PURE__ */ E.jsx(
                  "input",
                  {
                    id: "confirm-password",
                    type: "password",
                    value: tt,
                    onChange: (be) => Ce(be.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsx("button", { className: "btn btn-primary", type: "submit", disabled: J, children: "Update Password" })
            ] }),
            /* @__PURE__ */ E.jsx("div", { className: "auth-panel__menu-links", children: /* @__PURE__ */ E.jsxs("span", { className: "auth-panel__menu-link auth-panel__menu-link--disabled", children: [
              "Settings ",
              /* @__PURE__ */ E.jsx("small", { children: "Coming soon" })
            ] }) })
          ] }) : /* @__PURE__ */ E.jsxs("div", { className: "auth-panel__content", children: [
            T === "login" && /* @__PURE__ */ E.jsxs("form", { className: "auth-form", onSubmit: Qe, children: [
              /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ E.jsx("label", { htmlFor: "login-email", children: "Email" }),
                /* @__PURE__ */ E.jsx(
                  "input",
                  {
                    id: "login-email",
                    type: "email",
                    value: ee,
                    onChange: (be) => te(be.target.value),
                    required: !0,
                    autoComplete: "email"
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ E.jsx("label", { htmlFor: "login-password", children: "Password" }),
                /* @__PURE__ */ E.jsx(
                  "input",
                  {
                    id: "login-password",
                    type: "password",
                    value: ne,
                    onChange: (be) => K(be.target.value),
                    required: !0,
                    autoComplete: "current-password"
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "auth-form__footer", children: [
                /* @__PURE__ */ E.jsx("button", { className: "btn btn-primary", type: "submit", disabled: J, children: "Sign In" }),
                /* @__PURE__ */ E.jsx(
                  "button",
                  {
                    className: "btn btn-link",
                    type: "button",
                    onClick: () => {
                      w("register"), re(null), Q(null);
                    },
                    children: "Need an account?"
                  }
                )
              ] })
            ] }),
            T === "register" && /* @__PURE__ */ E.jsxs("form", { className: "auth-form", onSubmit: we, children: [
              /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ E.jsx("label", { htmlFor: "register-email", children: "Email" }),
                /* @__PURE__ */ E.jsx(
                  "input",
                  {
                    id: "register-email",
                    type: "email",
                    value: Ee,
                    onChange: (be) => Ue(be.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ E.jsx("label", { htmlFor: "register-username", children: "Username" }),
                /* @__PURE__ */ E.jsx(
                  "input",
                  {
                    id: "register-username",
                    value: ce,
                    onChange: (be) => ge(be.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ E.jsx("label", { htmlFor: "register-password", children: "Password" }),
                /* @__PURE__ */ E.jsx(
                  "input",
                  {
                    id: "register-password",
                    type: "password",
                    value: Le,
                    onChange: (be) => he(be.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
                /* @__PURE__ */ E.jsx("label", { htmlFor: "register-confirm", children: "Confirm Password" }),
                /* @__PURE__ */ E.jsx(
                  "input",
                  {
                    id: "register-confirm",
                    type: "password",
                    value: Se,
                    onChange: (be) => P(be.target.value),
                    required: !0
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "auth-form__footer", children: [
                /* @__PURE__ */ E.jsx("button", { className: "btn btn-primary", type: "submit", disabled: J, children: "Create Account" }),
                /* @__PURE__ */ E.jsx(
                  "button",
                  {
                    className: "btn btn-link",
                    type: "button",
                    onClick: () => {
                      w("login"), re(null), Q(null);
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
function gk() {
  var w, x;
  if (typeof window.showCreateCharacterModal == "function") {
    window.showCreateCharacterModal();
    return;
  }
  (x = (w = window.ShadowmasterLegacyApp) == null ? void 0 : w.showWizardStep) == null || x.call(w, 1);
  const T = document.getElementById("character-modal");
  T && (T.style.display = "block");
}
function Sk() {
  const [T, w] = Y.useState(null);
  return Y.useEffect(() => {
    w(document.getElementById("characters-actions"));
  }, []), T ? Wu.createPortal(
    /* @__PURE__ */ E.jsxs("div", { className: "characters-callout", children: [
      /* @__PURE__ */ E.jsxs("div", { className: "characters-callout__copy", children: [
        /* @__PURE__ */ E.jsx("h2", { children: "Characters" }),
        /* @__PURE__ */ E.jsx("p", { children: "Build new runners, review existing sheets, and keep your roster ready for the next mission." })
      ] }),
      /* @__PURE__ */ E.jsx("div", { className: "characters-callout__actions", children: /* @__PURE__ */ E.jsx(
        "button",
        {
          id: "create-character-btn",
          type: "button",
          className: "btn btn-primary",
          onClick: gk,
          children: "Create Character"
        }
      ) })
    ] }),
    T
  ) : null;
}
function Gf() {
  return mk();
}
const EE = [
  { label: "Priority (default)", value: "priority" },
  { label: "Sum-to-Ten (coming soon)", value: "sum_to_ten" },
  { label: "Karma (coming soon)", value: "karma" }
];
function Ek({ targetId: T = "campaign-creation-react-root", onCreated: w }) {
  var be, We;
  const {
    activeEdition: x,
    supportedEditions: Z,
    characterCreationData: J,
    reloadEditionData: A,
    setEdition: g
  } = Gf(), [re, U] = Y.useState(null), [Q, Re] = Y.useState(x.key), [I, ee] = Y.useState(J), [te, ne] = Y.useState([]), [K, Ee] = Y.useState(""), [Ue, ce] = Y.useState(""), [ge, Le] = Y.useState("experienced"), [he, Se] = Y.useState("priority"), [P, de] = Y.useState([]), [ie, Te] = Y.useState({}), [He, tt] = Y.useState(EE), [Ce, kt] = Y.useState(!1), [Ct, Dt] = Y.useState(!1), [Ve, me] = Y.useState(null);
  Y.useEffect(() => {
    U(document.getElementById(T));
  }, [T]), Y.useEffect(() => {
    if (!Ce)
      return;
    const fe = window.setTimeout(() => {
      const Fe = document.getElementById("campaign-name");
      Fe == null || Fe.focus({ preventScroll: !1 });
    }, 0);
    return () => window.clearTimeout(fe);
  }, [Ce]), Y.useEffect(() => {
    Re(x.key);
  }, [x.key]), Y.useEffect(() => {
    async function fe(Fe) {
      var rt;
      try {
        const dt = await fetch(`/api/editions/${Fe}/character-creation`);
        if (!dt.ok)
          throw new Error(`Failed to load edition data (${dt.status})`);
        const $t = await dt.json(), yn = ($t == null ? void 0 : $t.character_creation) ?? $t;
        ee(yn), Te(yn.creation_methods ?? {});
        const cn = Object.entries(yn.gameplay_levels ?? {}).map(([bn, { label: Tn }]) => ({
          value: bn,
          label: Tn || bn
        }));
        ne(cn), cn.some((bn) => bn.value === ge) || Le(((rt = cn[0]) == null ? void 0 : rt.value) ?? "experienced");
      } catch (dt) {
        console.error("Failed to load edition data", dt);
      }
    }
    fe(Q);
  }, [Q, ge]), Y.useEffect(() => {
    async function fe() {
      try {
        const Fe = await fetch("/api/users?role=gamemaster,administrator");
        if (!Fe.ok)
          throw new Error(`Failed to load users (${Fe.status})`);
        const rt = await Fe.json();
        if (!Array.isArray(rt) || rt.length === 0) {
          de([]);
          return;
        }
        de(rt), rt.length > 0 && ce((dt) => dt || rt[0].id);
      } catch (Fe) {
        console.error("Failed to load users", Fe), de([]);
      }
    }
    fe();
  }, []), Y.useEffect(() => {
    !I && J && (ee(J), Te(J.creation_methods ?? {}));
  }, [J, I]), Y.useEffect(() => {
    if (!I && Object.keys(ie).length === 0) {
      tt(EE);
      return;
    }
    if (!ie || Object.keys(ie).length === 0) {
      tt(EE);
      return;
    }
    const fe = Object.entries(ie).map(([Fe, rt]) => ({
      value: Fe,
      label: rt.label || Fe
    }));
    tt(fe);
  }, [ie, I]), Y.useEffect(() => {
    He.length !== 0 && (He.some((fe) => fe.value === he) || Se(He[0].value));
  }, [He, he]);
  const Qe = Y.useMemo(() => Z.map((fe) => ({
    label: fe.label,
    value: fe.key
  })), [Z]), we = Y.useMemo(() => P.length === 0 ? [{ label: "No gamemasters found", value: "" }] : P.map((fe) => ({
    label: `${fe.username} (${fe.email})`,
    value: fe.id
  })), [P]);
  function N() {
    var fe, Fe;
    Ee(""), Le("experienced"), Se(((fe = He[0]) == null ? void 0 : fe.value) ?? "priority"), ce(((Fe = P[0]) == null ? void 0 : Fe.id) ?? ""), me(null);
  }
  function q() {
    N(), kt(!0);
  }
  function nt() {
    N(), kt(!1);
  }
  async function et(fe) {
    var Fe, rt;
    fe.preventDefault(), Dt(!0), me(null);
    try {
      const dt = P.find((yn) => yn.id === Ue), $t = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: K,
          gm_user_id: Ue,
          gm_name: (dt == null ? void 0 : dt.username) ?? (dt == null ? void 0 : dt.email) ?? "",
          edition: Q,
          gameplay_level: ge,
          creation_method: he,
          status: "Active"
        })
      });
      if (!$t.ok) {
        const yn = await $t.text();
        throw new Error(yn || `Failed to create campaign (${$t.status})`);
      }
      N(), (rt = (Fe = window.ShadowmasterLegacyApp) == null ? void 0 : Fe.loadCampaigns) == null || rt.call(Fe), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), w == null || w(), kt(!1);
    } catch (dt) {
      const $t = dt instanceof Error ? dt.message : "Failed to create campaign.";
      me($t);
    } finally {
      Dt(!1);
    }
  }
  return re ? Wu.createPortal(
    /* @__PURE__ */ E.jsx(
      "section",
      {
        className: `campaign-create-react ${Ce ? "campaign-create-react--open" : "campaign-create-react--collapsed"}`,
        children: Ce ? /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
          /* @__PURE__ */ E.jsx("h3", { children: "Create Campaign" }),
          /* @__PURE__ */ E.jsxs("form", { className: "campaign-form", onSubmit: et, children: [
            /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ E.jsx("label", { htmlFor: "campaign-name", children: "Campaign Name" }),
              /* @__PURE__ */ E.jsx(
                "input",
                {
                  id: "campaign-name",
                  name: "campaign-name",
                  value: K,
                  onChange: (fe) => Ee(fe.target.value),
                  required: !0,
                  placeholder: "Enter campaign title"
                }
              )
            ] }),
            /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ E.jsx("label", { htmlFor: "campaign-edition", children: "Edition" }),
              /* @__PURE__ */ E.jsx(
                "select",
                {
                  id: "campaign-edition",
                  name: "campaign-edition",
                  value: Q,
                  onChange: (fe) => {
                    const Fe = fe.target.value;
                    Re(Fe), g(Fe), A(Fe);
                  },
                  children: Qe.map((fe) => /* @__PURE__ */ E.jsx("option", { value: fe.value, children: fe.label }, fe.value))
                }
              )
            ] }),
            te.length > 0 && /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ E.jsx("label", { htmlFor: "campaign-gameplay-level", children: "Gameplay Level" }),
              /* @__PURE__ */ E.jsx(
                "select",
                {
                  id: "campaign-gameplay-level",
                  name: "campaign-gameplay-level",
                  value: ge,
                  onChange: (fe) => Le(fe.target.value),
                  children: te.map((fe) => /* @__PURE__ */ E.jsx("option", { value: fe.value, children: fe.label }, fe.value))
                }
              )
            ] }),
            /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ E.jsx("label", { htmlFor: "campaign-creation-method", children: "Character Creation Method" }),
              /* @__PURE__ */ E.jsx(
                "select",
                {
                  id: "campaign-creation-method",
                  name: "campaign-creation-method",
                  value: he,
                  onChange: (fe) => Se(fe.target.value),
                  children: He.map((fe) => /* @__PURE__ */ E.jsx("option", { value: fe.value, children: fe.label }, fe.value))
                }
              ),
              /* @__PURE__ */ E.jsxs("div", { className: "form-help", children: [
                ((be = ie[he]) == null ? void 0 : be.description) && /* @__PURE__ */ E.jsx("p", { children: (We = ie[he]) == null ? void 0 : We.description }),
                he !== "priority" && /* @__PURE__ */ E.jsx("p", { children: "Support for Sum-to-Ten and Karma methods is still under development. Characters will temporarily default to Priority until the new workflows are implemented." })
              ] })
            ] }),
            /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ E.jsx("label", { htmlFor: "campaign-gm", children: "Gamemaster" }),
              /* @__PURE__ */ E.jsx(
                "select",
                {
                  id: "campaign-gm",
                  name: "campaign-gm",
                  value: Ue,
                  onChange: (fe) => ce(fe.target.value),
                  children: we.map((fe) => /* @__PURE__ */ E.jsx("option", { value: fe.value, children: fe.label }, fe.value))
                }
              )
            ] }),
            Ve && /* @__PURE__ */ E.jsx("p", { className: "form-error", children: Ve }),
            /* @__PURE__ */ E.jsxs("div", { className: "form-actions", children: [
              /* @__PURE__ */ E.jsx("button", { type: "button", className: "btn-secondary", disabled: Ct, onClick: nt, children: "Cancel" }),
              /* @__PURE__ */ E.jsx("button", { type: "submit", className: "btn-primary", disabled: Ct, children: Ct ? "Creating…" : "Create Campaign" })
            ] })
          ] })
        ] }) : /* @__PURE__ */ E.jsxs("div", { className: "campaign-create-trigger", children: [
          /* @__PURE__ */ E.jsxs("div", { className: "campaign-create-trigger__copy", children: [
            /* @__PURE__ */ E.jsx("h3", { children: "Plan Your Next Campaign" }),
            /* @__PURE__ */ E.jsx("p", { children: "Select an edition, assign a GM, and lock in gameplay defaults." })
          ] }),
          /* @__PURE__ */ E.jsx("button", { type: "button", className: "btn-primary", onClick: q, children: "Create Campaign" })
        ] })
      }
    ),
    re
  ) : null;
}
function Ck(T, w, x) {
  const Z = x === "asc" ? 1 : -1, J = (re) => re instanceof Date ? re.getTime() : typeof re == "number" ? re : typeof re == "boolean" ? re ? 1 : 0 : re == null ? "" : String(re).toLowerCase(), A = J(T), g = J(w);
  return A < g ? -1 * Z : A > g ? 1 * Z : 0;
}
function wk({
  columns: T,
  data: w,
  getRowId: x,
  loading: Z = !1,
  emptyState: J,
  enableSearch: A = !0,
  searchPlaceholder: g = "Search…",
  initialSortKey: re,
  initialSortDirection: U = "asc",
  rowClassName: Q
}) {
  var Le, he;
  const Re = Y.useMemo(
    () => T.filter((Se) => Se.sortable),
    [T]
  ), I = re ?? ((Le = Re[0]) == null ? void 0 : Le.key) ?? ((he = T[0]) == null ? void 0 : he.key) ?? "", [ee, te] = Y.useState(I), [ne, K] = Y.useState(U), [Ee, Ue] = Y.useState(""), ce = Y.useMemo(() => {
    const Se = T.filter((Te) => Te.searchable !== !1), P = w.filter((Te) => !A || !Ee.trim() ? !0 : Se.some((He) => {
      const tt = He.accessor, Ce = tt ? tt(Te) : Te[He.key];
      return Ce == null ? !1 : String(Ce).toLowerCase().includes(Ee.toLowerCase());
    }));
    if (!ee)
      return P;
    const de = T.find((Te) => Te.key === ee);
    if (!de)
      return P;
    const ie = de.accessor;
    return [...P].sort((Te, He) => {
      const tt = ie ? ie(Te) : Te[ee], Ce = ie ? ie(He) : He[ee];
      return Ck(tt, Ce, ne);
    });
  }, [T, w, A, Ee, ne, ee]);
  function ge(Se) {
    ee === Se ? K((P) => P === "asc" ? "desc" : "asc") : (te(Se), K("asc"));
  }
  return /* @__PURE__ */ E.jsxs("div", { className: "data-table-wrapper", children: [
    A && T.length > 0 && /* @__PURE__ */ E.jsx("div", { className: "data-table-toolbar", children: /* @__PURE__ */ E.jsx(
      "input",
      {
        type: "search",
        placeholder: g,
        value: Ee,
        onChange: (Se) => Ue(Se.target.value),
        "aria-label": "Search table"
      }
    ) }),
    /* @__PURE__ */ E.jsx("div", { className: "data-table-container", children: /* @__PURE__ */ E.jsxs("table", { className: "data-table", children: [
      /* @__PURE__ */ E.jsx("thead", { children: /* @__PURE__ */ E.jsx("tr", { children: T.map((Se) => {
        const P = Se.sortable !== !1, de = Se.key === ee;
        return /* @__PURE__ */ E.jsxs(
          "th",
          {
            style: { width: Se.width },
            className: [
              Se.align ? `align-${Se.align}` : "",
              P ? "sortable" : "",
              de ? `sorted-${ne}` : ""
            ].filter(Boolean).join(" "),
            onClick: () => {
              P && ge(Se.key);
            },
            children: [
              /* @__PURE__ */ E.jsx("span", { children: Se.header }),
              P && /* @__PURE__ */ E.jsx("span", { className: "sort-indicator", "aria-hidden": "true", children: de ? ne === "asc" ? "▲" : "▼" : "↕" })
            ]
          },
          Se.key
        );
      }) }) }),
      /* @__PURE__ */ E.jsx("tbody", { children: Z ? /* @__PURE__ */ E.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ E.jsx("td", { colSpan: T.length, children: "Loading…" }) }) : ce.length === 0 ? /* @__PURE__ */ E.jsx("tr", { className: "data-table-empty", children: /* @__PURE__ */ E.jsx("td", { colSpan: T.length, children: J || "No records found." }) }) : ce.map((Se, P) => /* @__PURE__ */ E.jsx("tr", { className: Q == null ? void 0 : Q(Se), children: T.map((de) => /* @__PURE__ */ E.jsx("td", { className: de.align ? `align-${de.align}` : void 0, children: de.render ? de.render(Se) : Se[de.key] }, de.key)) }, x(Se, P))) })
    ] }) })
  ] });
}
function xk(T) {
  if (!T)
    return "—";
  const w = Date.parse(T);
  return Number.isNaN(w) ? T : new Date(w).toLocaleDateString();
}
function bk({
  campaigns: T,
  loading: w,
  error: x,
  onEdit: Z,
  onDelete: J,
  currentUser: A,
  actionInFlightId: g
}) {
  const re = Y.useMemo(
    () => [
      {
        key: "name",
        header: "Campaign",
        sortable: !0,
        accessor: (U) => U.name
      },
      {
        key: "edition",
        header: "Edition",
        sortable: !0,
        accessor: (U) => U.edition.toUpperCase()
      },
      {
        key: "gameplay_level",
        header: "Gameplay Level",
        sortable: !0,
        accessor: (U) => U.gameplay_level ?? "",
        render: (U) => {
          var Q;
          return ((Q = U.gameplay_level) == null ? void 0 : Q.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "creation_method",
        header: "Creation Method",
        sortable: !0,
        accessor: (U) => U.creation_method,
        render: (U) => {
          var Q;
          return ((Q = U.creation_method) == null ? void 0 : Q.replace(/_/g, " ")) ?? "—";
        }
      },
      {
        key: "gm_name",
        header: "Gamemaster",
        sortable: !0,
        accessor: (U) => U.gm_name ?? "",
        render: (U) => U.gm_name ?? "—"
      },
      {
        key: "status",
        header: "Status",
        sortable: !0,
        accessor: (U) => U.status ?? "",
        render: (U) => /* @__PURE__ */ E.jsx("span", { className: `status-badge status-${(U.status ?? "unknown").toLowerCase()}`, children: U.status ?? "—" })
      },
      {
        key: "updated_at",
        header: "Updated",
        sortable: !0,
        accessor: (U) => U.updated_at ? new Date(U.updated_at) : null,
        render: (U) => xk(U.updated_at)
      },
      {
        key: "actions",
        header: "Actions",
        sortable: !1,
        align: "right",
        render: (U) => {
          var te, ne, K;
          const Q = U.can_edit || U.can_delete || (A == null ? void 0 : A.isAdministrator) || U.gm_user_id && ((te = A == null ? void 0 : A.user) == null ? void 0 : te.id) === U.gm_user_id, Re = g === U.id, I = (U.can_edit ?? !1) || (A == null ? void 0 : A.isAdministrator) || U.gm_user_id && ((ne = A == null ? void 0 : A.user) == null ? void 0 : ne.id) === U.gm_user_id, ee = (U.can_delete ?? !1) || (A == null ? void 0 : A.isAdministrator) || U.gm_user_id && ((K = A == null ? void 0 : A.user) == null ? void 0 : K.id) === U.gm_user_id;
          return /* @__PURE__ */ E.jsxs("div", { className: "table-actions", children: [
            /* @__PURE__ */ E.jsx(
              "button",
              {
                type: "button",
                className: "button button--table",
                onClick: () => Z(U),
                disabled: Re || !Q || !I,
                children: "Edit"
              }
            ),
            /* @__PURE__ */ E.jsx(
              "button",
              {
                type: "button",
                className: "button button--table button--danger",
                onClick: () => J(U),
                disabled: Re || !Q || !ee,
                children: "Delete"
              }
            )
          ] });
        }
      }
    ],
    [g, A, J, Z]
  );
  return /* @__PURE__ */ E.jsxs("div", { className: "campaign-table", children: [
    x && /* @__PURE__ */ E.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: x }),
    /* @__PURE__ */ E.jsx(
      wk,
      {
        columns: re,
        data: T,
        loading: w,
        getRowId: (U) => U.id,
        emptyState: "No campaigns yet. Create one to get started!",
        searchPlaceholder: "Search campaigns…"
      }
    )
  ] });
}
const Rk = ["Active", "Paused", "Completed"];
function Tk({ campaign: T, gmUsers: w, gameplayRules: x, onClose: Z, onSave: J }) {
  const { loadCampaignCharacterCreation: A } = Gf(), [g, re] = Y.useState(T.name), [U, Q] = Y.useState(T.gm_user_id ?? ""), [Re, I] = Y.useState(T.status ?? "Active"), [ee, te] = Y.useState(T.house_rules ?? ""), [ne, K] = Y.useState(T.gameplay_level ?? "experienced"), [Ee, Ue] = Y.useState(!1), [ce, ge] = Y.useState(null), Le = Y.useMemo(() => w.length === 0 ? [{ label: "No gamemasters found", value: "" }] : w.map((P) => ({
    label: `${P.username} (${P.email})`,
    value: P.id
  })), [w]);
  Y.useEffect(() => {
    re(T.name), Q(T.gm_user_id ?? ""), I(T.status ?? "Active"), te(T.house_rules ?? ""), K(T.gameplay_level ?? "experienced");
  }, [T]);
  const he = Ee || g.trim().length === 0 || w.length > 0 && !U;
  async function Se(P) {
    if (P.preventDefault(), !he) {
      Ue(!0), ge(null);
      try {
        const de = w.find((ie) => ie.id === U);
        await J({
          name: g.trim(),
          gm_user_id: U || void 0,
          gm_name: (de == null ? void 0 : de.username) ?? (de == null ? void 0 : de.email) ?? "",
          status: Re,
          house_rules: ee,
          gameplay_level: ne
        }), await A(T.id), Z();
      } catch (de) {
        const ie = de instanceof Error ? de.message : "Failed to update campaign.";
        ge(ie);
      } finally {
        Ue(!1);
      }
    }
  }
  return /* @__PURE__ */ E.jsx("div", { className: "modal", style: { display: "block" }, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ E.jsxs("div", { className: "modal-content", children: [
    /* @__PURE__ */ E.jsxs("header", { className: "modal-header", children: [
      /* @__PURE__ */ E.jsx("h3", { children: "Edit Campaign" }),
      /* @__PURE__ */ E.jsx("button", { type: "button", className: "modal-close", onClick: Z, "aria-label": "Close edit campaign form", children: "×" })
    ] }),
    /* @__PURE__ */ E.jsxs("form", { className: "campaign-form", onSubmit: Se, children: [
      /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ E.jsx("label", { htmlFor: "edit-campaign-name", children: "Campaign Name" }),
        /* @__PURE__ */ E.jsx(
          "input",
          {
            id: "edit-campaign-name",
            name: "campaign-name",
            value: g,
            onChange: (P) => re(P.target.value),
            required: !0
          }
        )
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ E.jsx("label", { htmlFor: "edit-campaign-gm", children: "Gamemaster" }),
        /* @__PURE__ */ E.jsx(
          "select",
          {
            id: "edit-campaign-gm",
            name: "campaign-gm",
            value: U,
            onChange: (P) => Q(P.target.value),
            children: Le.map((P) => /* @__PURE__ */ E.jsx("option", { value: P.value, children: P.label }, P.value))
          }
        )
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ E.jsx("label", { htmlFor: "edit-campaign-status", children: "Status" }),
        /* @__PURE__ */ E.jsx(
          "select",
          {
            id: "edit-campaign-status",
            name: "campaign-status",
            value: Re,
            onChange: (P) => I(P.target.value),
            children: Rk.map((P) => /* @__PURE__ */ E.jsx("option", { value: P, children: P }, P))
          }
        )
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ E.jsx("label", { htmlFor: "edit-campaign-gameplay-level", children: "Gameplay Level" }),
        /* @__PURE__ */ E.jsx(
          "select",
          {
            id: "edit-campaign-gameplay-level",
            name: "campaign-gameplay-level",
            value: ne,
            onChange: (P) => K(P.target.value),
            children: /* @__PURE__ */ E.jsx("option", { value: T.gameplay_level ?? "experienced", children: (x == null ? void 0 : x.label) || T.gameplay_level || "Experienced" })
          }
        ),
        /* @__PURE__ */ E.jsx("small", { children: "Gameplay level selections are constrained by the active edition." })
      ] }),
      /* @__PURE__ */ E.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ E.jsx("label", { htmlFor: "edit-campaign-house-rules", children: "House Rules" }),
        /* @__PURE__ */ E.jsx(
          "textarea",
          {
            id: "edit-campaign-house-rules",
            name: "campaign-house-rules",
            rows: 3,
            value: ee,
            onChange: (P) => te(P.target.value)
          }
        )
      ] }),
      ce && /* @__PURE__ */ E.jsx("div", { className: "form-feedback form-feedback--error", role: "alert", children: ce }),
      /* @__PURE__ */ E.jsxs("div", { className: "modal-actions", children: [
        /* @__PURE__ */ E.jsx("button", { type: "button", className: "button button--secondary", onClick: Z, children: "Cancel" }),
        /* @__PURE__ */ E.jsx("button", { type: "submit", className: "button button--primary", disabled: he, children: Ee ? "Saving…" : "Save Changes" })
      ] })
    ] })
  ] }) });
}
const _k = "campaigns-list";
async function Xm(T, w = {}) {
  const x = new Headers(w.headers || {});
  w.body && !x.has("Content-Type") && x.set("Content-Type", "application/json");
  const Z = await fetch(T, {
    ...w,
    headers: x,
    credentials: "include"
  });
  if (!Z.ok) {
    const J = await Z.text();
    throw new Error(J || `Request failed (${Z.status})`);
  }
  return Z.status === 204 ? {} : await Z.json();
}
function kk({ targetId: T = _k }) {
  const [w, x] = Y.useState(null), [Z, J] = Y.useState([]), [A, g] = Y.useState(!1), [re, U] = Y.useState(null), [Q, Re] = Y.useState(null), [I, ee] = Y.useState(null), [te, ne] = Y.useState(null), [K, Ee] = Y.useState(null), [Ue, ce] = Y.useState([]), [ge, Le] = Y.useState(
    window.ShadowmasterAuth ?? null
  );
  Y.useEffect(() => {
    x(document.getElementById(T));
  }, [T]), Y.useEffect(() => (document.body.classList.add("react-campaign-enabled"), () => {
    document.body.classList.remove("react-campaign-enabled");
  }), []);
  const he = Y.useCallback(async () => {
    g(!0), U(null);
    try {
      const ie = await Xm("/api/campaigns");
      J(Array.isArray(ie) ? ie : []);
    } catch (ie) {
      const Te = ie instanceof Error ? ie.message : "Failed to load campaigns.";
      U(Te), J([]);
    } finally {
      g(!1);
    }
  }, []), Se = Y.useCallback(async () => {
    try {
      const ie = await Xm("/api/users?role=gamemaster,administrator");
      ce(Array.isArray(ie) ? ie : []);
    } catch (ie) {
      console.warn("Failed to load gamemaster roster", ie), ce([]);
    }
  }, []);
  Y.useEffect(() => {
    he(), Se();
  }, [he, Se]), Y.useEffect(() => {
    const ie = () => {
      he();
    };
    return window.addEventListener("shadowmaster:campaigns:refresh", ie), () => {
      window.removeEventListener("shadowmaster:campaigns:refresh", ie);
    };
  }, [he]), Y.useEffect(() => (window.ShadowmasterLegacyApp = Object.assign(window.ShadowmasterLegacyApp ?? {}, {
    loadCampaigns: () => {
      he();
    }
  }), () => {
    window.ShadowmasterLegacyApp && (window.ShadowmasterLegacyApp.loadCampaigns = void 0);
  }), [he]), Y.useEffect(() => {
    const ie = (Te) => {
      const He = Te.detail;
      Le(He ?? null);
    };
    return window.addEventListener("shadowmaster:auth", ie), () => {
      window.removeEventListener("shadowmaster:auth", ie);
    };
  }, []), Y.useEffect(() => {
    if (!I)
      return;
    const ie = window.setTimeout(() => ee(null), 4e3);
    return () => window.clearTimeout(ie);
  }, [I]);
  const P = Y.useCallback(
    async (ie) => {
      if (!(!ie.can_delete && !(ge != null && ge.isAdministrator) || !window.confirm(
        `Delete campaign "${ie.name}"? This action cannot be undone.`
      ))) {
        Re(null), ee(null), ne(ie.id);
        try {
          await Xm(`/api/campaigns/${ie.id}`, { method: "DELETE" }), ee(`Campaign "${ie.name}" deleted.`), await he(), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh"));
        } catch (He) {
          const tt = He instanceof Error ? He.message : "Failed to delete campaign.";
          Re(tt);
        } finally {
          ne(null);
        }
      }
    },
    [ge == null ? void 0 : ge.isAdministrator, he]
  ), de = Y.useCallback(
    async (ie) => {
      if (K) {
        Re(null), ee(null), ne(K.id);
        try {
          const Te = JSON.stringify({
            name: ie.name,
            gm_name: ie.gm_name,
            gm_user_id: ie.gm_user_id,
            status: ie.status,
            house_rules: ie.house_rules,
            gameplay_level: ie.gameplay_level
          }), He = await Xm(`/api/campaigns/${K.id}`, {
            method: "PUT",
            body: Te
          });
          J(
            (tt) => tt.map((Ce) => Ce.id === He.id ? He : Ce)
          ), ee(`Campaign "${He.name}" updated.`), window.dispatchEvent(new Event("shadowmaster:campaigns:refresh")), Ee(null);
        } catch (Te) {
          const He = Te instanceof Error ? Te.message : "Failed to update campaign.";
          Re(He);
        } finally {
          ne(null);
        }
      }
    },
    [K]
  );
  return w ? Wu.createPortal(
    /* @__PURE__ */ E.jsxs("section", { className: "campaigns-react-shell", children: [
      I && /* @__PURE__ */ E.jsx("p", { className: "campaigns-table__status", children: I }),
      Q && /* @__PURE__ */ E.jsx("p", { className: "campaigns-table__error", children: Q }),
      /* @__PURE__ */ E.jsx(
        bk,
        {
          campaigns: Z,
          loading: A,
          error: re,
          onEdit: (ie) => Ee(ie),
          onDelete: P,
          currentUser: ge,
          actionInFlightId: te
        }
      ),
      K && /* @__PURE__ */ E.jsx(
        Tk,
        {
          campaign: K,
          gmUsers: Ue,
          gameplayRules: K.gameplay_rules,
          onClose: () => Ee(null),
          onSave: de
        }
      )
    ] }),
    w
  ) : null;
}
const Zm = [
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
function Dk() {
  const T = window.location.hash.replace("#", "").toLowerCase(), w = Zm.find((x) => x.key === T);
  return (w == null ? void 0 : w.key) ?? "characters";
}
function Ok(T) {
  Y.useEffect(() => {
    Zm.forEach(({ key: w, targetId: x }) => {
      const Z = document.getElementById(x);
      Z && (w === T ? (Z.removeAttribute("hidden"), Z.classList.add("main-tab-panel--active"), Z.style.display = "", Z.setAttribute("data-active-tab", w)) : (Z.setAttribute("hidden", "true"), Z.classList.remove("main-tab-panel--active"), Z.style.display = "none", Z.removeAttribute("data-active-tab")));
    });
  }, [T]);
}
function Nk() {
  const [T, w] = Y.useState(null), [x, Z] = Y.useState(() => Dk());
  Y.useEffect(() => {
    w(document.getElementById("main-navigation-root"));
  }, []), Ok(x), Y.useEffect(() => {
    window.history.replaceState(null, "", `#${x}`);
  }, [x]);
  const J = Y.useMemo(
    () => {
      var A;
      return ((A = Zm.find((g) => g.key === x)) == null ? void 0 : A.description) ?? "";
    },
    [x]
  );
  return T ? Wu.createPortal(
    /* @__PURE__ */ E.jsxs("nav", { className: "main-tabs", role: "tablist", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ E.jsx("div", { className: "main-tabs__list", children: Zm.map((A) => {
        const g = A.key === x;
        return /* @__PURE__ */ E.jsx(
          "button",
          {
            role: "tab",
            id: `tab-${A.key}`,
            "aria-selected": g,
            "aria-controls": A.targetId,
            className: `main-tabs__tab${g ? " main-tabs__tab--active" : ""}`,
            onClick: () => Z(A.key),
            type: "button",
            children: A.label
          },
          A.key
        );
      }) }),
      /* @__PURE__ */ E.jsx("p", { className: "main-tabs__summary", role: "status", children: J })
    ] }),
    T
  ) : null;
}
const Wf = [
  "magic",
  "metatype",
  "attributes",
  "skills",
  "resources"
], ey = ["A", "B", "C", "D", "E"], Lk = {
  magic: "Magic",
  metatype: "Metatype",
  attributes: "Attributes",
  skills: "Skills",
  resources: "Resources"
};
function Mk(T) {
  return Lk[T];
}
function jk(T, w) {
  var Z;
  const x = (Z = T == null ? void 0 : T.priorities) == null ? void 0 : Z[w];
  return x ? ey.map((J) => {
    const A = x[J] ?? { label: `Priority ${J}` };
    return { code: J, option: A };
  }) : ey.map((J) => ({
    code: J,
    option: { label: `Priority ${J}` }
  }));
}
function Ak() {
  return {
    magic: "",
    metatype: "",
    attributes: "",
    skills: "",
    resources: ""
  };
}
function Sx(T) {
  return Wf.reduce((w, x) => {
    const Z = T[x];
    return Z && w.push(Z), w;
  }, []);
}
function hx(T) {
  const w = new Set(Sx(T));
  return ey.filter((x) => !w.has(x));
}
function zk(T) {
  return Sx(T).length === ey.length;
}
function Uk(T) {
  return T ? T.summary || T.description || T.label || "" : "Drag a priority letter from the pool into this category.";
}
function Fk(T) {
  return Object.fromEntries(
    Object.entries(T).map(([w, x]) => [w, x || null])
  );
}
function Pk() {
  var Z, J;
  const T = Ak();
  if (typeof window > "u")
    return T;
  const w = (J = (Z = window.ShadowmasterLegacyApp) == null ? void 0 : Z.getPriorities) == null ? void 0 : J.call(Z);
  if (!w)
    return T;
  const x = { ...T };
  for (const A of Wf) {
    const g = w[A];
    typeof g == "string" && g.length === 1 && (x[A] = g);
  }
  return x;
}
function Hk() {
  const {
    characterCreationData: T,
    activeEdition: w,
    isLoading: x,
    error: Z,
    campaignGameplayRules: J,
    campaignLoading: A,
    campaignError: g
  } = Gf(), [re, U] = Y.useState(() => Pk()), [Q, Re] = Y.useState(null), I = Y.useRef({});
  Y.useEffect(() => (document.body.classList.add("react-priority-enabled"), () => {
    document.body.classList.remove("react-priority-enabled");
  }), []), Y.useEffect(() => {
    var de;
    const P = (de = window.ShadowmasterLegacyApp) == null ? void 0 : de.setPriorities;
    P && P(Fk(re));
  }, [re]);
  const ee = Y.useMemo(() => hx(re), [re]), te = zk(re);
  function ne(P) {
    U((de) => {
      const ie = { ...de };
      for (const Te of Wf)
        ie[Te] === P && (ie[Te] = "");
      return ie;
    });
  }
  function K(P, de) {
    de.dataTransfer.effectAllowed = "move", Re({ source: "pool", priority: P }), de.dataTransfer.setData("text/plain", P);
  }
  function Ee(P, de, ie) {
    ie.dataTransfer.effectAllowed = "move", Re({ source: "dropzone", category: P, priority: de }), ie.dataTransfer.setData("text/plain", de);
  }
  function Ue() {
    Re(null);
  }
  function ce(P, de) {
    de.preventDefault();
    const ie = de.dataTransfer.getData("text/plain") || (Q == null ? void 0 : Q.priority) || "";
    if (!ie) {
      Ue();
      return;
    }
    U((Te) => {
      const He = { ...Te };
      for (const tt of Wf)
        He[tt] === ie && (He[tt] = "");
      return He[P] = ie, He;
    }), Ue();
  }
  function ge(P, de) {
    de.preventDefault();
    const ie = I.current[P];
    ie && ie.classList.add("active");
  }
  function Le(P) {
    const de = I.current[P];
    de && de.classList.remove("active");
  }
  function he(P) {
    const de = I.current[P];
    de && de.classList.remove("active");
  }
  function Se(P) {
    const de = ee[0];
    if (!de) {
      ne(P);
      return;
    }
    U((ie) => {
      const Te = { ...ie };
      for (const He of Wf)
        Te[He] === P && (Te[He] = "");
      return Te[de] = P, Te;
    });
  }
  return /* @__PURE__ */ E.jsxs("div", { className: "react-priority-wrapper", children: [
    /* @__PURE__ */ E.jsxs("div", { className: "react-priority-header", children: [
      /* @__PURE__ */ E.jsxs("span", { children: [
        "Priority Assignment — ",
        /* @__PURE__ */ E.jsx("strong", { children: w.label })
      ] }),
      /* @__PURE__ */ E.jsx("span", { children: g ? `Campaign defaults unavailable: ${g}` : A ? "Applying campaign defaults…" : x ? "Loading priority data…" : Z ? `Error: ${Z}` : "Drag letters into categories" })
    ] }),
    J && /* @__PURE__ */ E.jsxs("div", { className: "react-priority-campaign", children: [
      /* @__PURE__ */ E.jsxs("span", { className: "campaign-tag", children: [
        "Campaign Defaults • ",
        J.label
      ] }),
      J.description && /* @__PURE__ */ E.jsx("p", { children: J.description })
    ] }),
    /* @__PURE__ */ E.jsxs("div", { className: "react-priority-layout", children: [
      /* @__PURE__ */ E.jsxs("aside", { className: "react-priority-pool", children: [
        /* @__PURE__ */ E.jsx("h4", { children: "Available Priorities" }),
        /* @__PURE__ */ E.jsx(
          "div",
          {
            className: "react-priority-dropzone",
            onDragOver: (P) => {
              P.preventDefault(), Re((de) => de && { ...de, category: void 0 });
            },
            onDrop: (P) => {
              P.preventDefault();
              const de = P.dataTransfer.getData("text/plain") || (Q == null ? void 0 : Q.priority) || "";
              de && ne(de), Ue();
            },
            children: /* @__PURE__ */ E.jsx("div", { className: "react-priority-chips", children: ["A", "B", "C", "D", "E"].map((P) => {
              const de = hx(re).includes(P) === !1, ie = (Q == null ? void 0 : Q.priority) === P && Q.source === "pool";
              return /* @__PURE__ */ E.jsx(
                "div",
                {
                  className: `react-priority-chip ${de ? "used" : ""} ${ie ? "dragging" : ""}`,
                  draggable: !de,
                  onDragStart: (Te) => !de && K(P, Te),
                  onDragEnd: Ue,
                  onClick: () => Se(P),
                  role: "button",
                  tabIndex: de ? -1 : 0,
                  onKeyDown: (Te) => {
                    !de && (Te.key === "Enter" || Te.key === " ") && (Te.preventDefault(), Se(P));
                  },
                  children: P
                },
                P
              );
            }) })
          }
        )
      ] }),
      /* @__PURE__ */ E.jsx("section", { className: "react-priority-dropzones", children: Wf.map((P) => {
        const de = Mk(P), ie = jk(T, P), Te = re[P], He = ie.find((Ce) => Ce.code === Te), tt = (Q == null ? void 0 : Q.source) === "dropzone" && Q.category === P;
        return /* @__PURE__ */ E.jsxs(
          "div",
          {
            ref: (Ce) => {
              I.current[P] = Ce;
            },
            className: `react-priority-dropzone ${Te ? "filled" : ""}`,
            onDragOver: (Ce) => ge(P, Ce),
            onDragLeave: () => Le(P),
            onDrop: (Ce) => {
              ce(P, Ce), he(P);
            },
            children: [
              /* @__PURE__ */ E.jsxs("div", { className: "react-priority-category", children: [
                /* @__PURE__ */ E.jsx("span", { children: de }),
                Te && /* @__PURE__ */ E.jsxs("span", { children: [
                  Te,
                  " — ",
                  (He == null ? void 0 : He.option.label) ?? "Unknown"
                ] })
              ] }),
              /* @__PURE__ */ E.jsx("div", { className: "react-priority-description", children: Uk(He == null ? void 0 : He.option) }),
              Te ? /* @__PURE__ */ E.jsx(
                "div",
                {
                  className: `react-priority-chip ${tt ? "dragging" : ""}`,
                  draggable: !0,
                  onDragStart: (Ce) => Ee(P, Te, Ce),
                  onDragEnd: Ue,
                  onDoubleClick: () => ne(Te),
                  children: Te
                }
              ) : /* @__PURE__ */ E.jsx("div", { style: { fontSize: "0.8rem", color: "#6b8599" }, children: "Drop priority here" })
            ]
          },
          P
        );
      }) })
    ] }),
    /* @__PURE__ */ E.jsx(
      "div",
      {
        className: `react-priority-status ${te ? "success" : ""}`,
        role: "status",
        "aria-live": "polite",
        children: te ? "✓ All priorities assigned. You can proceed to metatype selection." : `Missing priorities: ${ee.join(", ")}`
      }
    )
  ] });
}
const Vk = {
  body: "Body",
  quickness: "Quickness",
  strength: "Strength",
  charisma: "Charisma",
  intelligence: "Intelligence",
  willpower: "Willpower"
};
function Bk(T, w) {
  if (!T)
    return [];
  const x = w || "E";
  return T.metatypes.map((Z) => {
    var J;
    return {
      ...Z,
      priorityAllowed: ((J = Z.priority_tiers) == null ? void 0 : J.includes(x)) ?? !1
    };
  }).filter((Z) => Z.priorityAllowed);
}
function Ik(T) {
  return T === 0 ? "+0" : T > 0 ? `+${T}` : `${T}`;
}
function Yk(T) {
  const w = T.toLowerCase();
  return Vk[w] ?? T;
}
function $k({ priority: T, selectedMetatype: w, onSelect: x }) {
  const { characterCreationData: Z, isLoading: J, error: A, activeEdition: g } = Gf();
  Y.useEffect(() => (document.body.classList.add("react-metatype-enabled"), () => {
    document.body.classList.remove("react-metatype-enabled");
  }), []);
  const re = Y.useMemo(() => {
    var ne;
    const I = ((ne = T == null ? void 0 : T.toUpperCase) == null ? void 0 : ne.call(T)) ?? "", te = ["A", "B", "C", "D", "E"].includes(I) ? I : "";
    return Bk(Z, te);
  }, [Z, T]), U = !!w, Q = () => {
    var I, ee;
    (ee = (I = window.ShadowmasterLegacyApp) == null ? void 0 : I.showWizardStep) == null || ee.call(I, 1);
  }, Re = () => {
    var I, ee;
    w && ((ee = (I = window.ShadowmasterLegacyApp) == null ? void 0 : I.showWizardStep) == null || ee.call(I, 3));
  };
  return J ? /* @__PURE__ */ E.jsx("p", { className: "react-metatype-status", children: "Loading metatype data…" }) : A ? /* @__PURE__ */ E.jsxs("p", { className: "react-metatype-status", children: [
    "Error loading metatypes: ",
    A
  ] }) : re.length ? /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
    /* @__PURE__ */ E.jsxs("div", { className: "react-metatype-header", children: [
      /* @__PURE__ */ E.jsx("span", { children: "Available Metatypes" }),
      /* @__PURE__ */ E.jsxs("span", { children: [
        "Priority: ",
        T || "—"
      ] })
    ] }),
    /* @__PURE__ */ E.jsx("div", { className: "react-metatype-grid", children: re.map((I) => /* @__PURE__ */ E.jsxs(
      "article",
      {
        className: `react-metatype-card ${w === I.id ? "selected" : ""}`,
        onClick: () => x(I.id),
        children: [
          /* @__PURE__ */ E.jsx("h4", { children: I.name }),
          /* @__PURE__ */ E.jsxs("section", { className: "react-metatype-modifiers", children: [
            /* @__PURE__ */ E.jsx("strong", { children: "Attribute Modifiers" }),
            (() => {
              const ee = I.attribute_modifiers ? Object.entries(I.attribute_modifiers).filter(([, te]) => te !== 0) : [];
              return ee.length === 0 ? /* @__PURE__ */ E.jsx("div", { className: "attribute-mod", children: "No attribute modifiers." }) : ee.map(([te, ne]) => /* @__PURE__ */ E.jsxs("div", { className: "attribute-mod", children: [
                /* @__PURE__ */ E.jsx("span", { children: Yk(te) }),
                /* @__PURE__ */ E.jsx("span", { className: ne > 0 ? "positive" : "negative", children: Ik(ne) })
              ] }, te));
            })()
          ] }),
          g.key === "sr5" && I.special_attribute_points && Object.keys(I.special_attribute_points).length > 0 && /* @__PURE__ */ E.jsxs("section", { className: "react-metatype-special", children: [
            /* @__PURE__ */ E.jsx("strong", { children: "Special Attribute Points (SR5)" }),
            Object.entries(I.special_attribute_points).map(([ee, te]) => /* @__PURE__ */ E.jsx("div", { className: "ability", children: /* @__PURE__ */ E.jsxs("span", { children: [
              "Priority ",
              ee,
              ": ",
              te
            ] }) }, ee))
          ] }),
          I.abilities && I.abilities.length > 0 && /* @__PURE__ */ E.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ E.jsx("strong", { children: "Special Abilities" }),
            I.abilities.map((ee, te) => /* @__PURE__ */ E.jsx("div", { className: "ability", children: /* @__PURE__ */ E.jsx("span", { children: ee }) }, te))
          ] }),
          (!I.abilities || I.abilities.length === 0) && /* @__PURE__ */ E.jsxs("section", { className: "react-metatype-abilities", children: [
            /* @__PURE__ */ E.jsx("strong", { children: "Special Abilities" }),
            /* @__PURE__ */ E.jsx("div", { className: "ability", children: /* @__PURE__ */ E.jsx("span", { children: "No inherent metatype abilities." }) })
          ] })
        ]
      },
      I.id
    )) }),
    /* @__PURE__ */ E.jsxs("div", { className: "react-metatype-footer", children: [
      /* @__PURE__ */ E.jsx("button", { type: "button", className: "btn btn-secondary", onClick: Q, children: "Back" }),
      /* @__PURE__ */ E.jsx("div", { className: `react-metatype-status ${U ? "ready" : ""}`, children: U ? "Metatype selected. Continue to magic." : "Select a metatype to continue." }),
      /* @__PURE__ */ E.jsx("button", { type: "button", className: "btn btn-primary", disabled: !U, onClick: Re, children: "Next: Choose Magical Abilities" })
    ] })
  ] }) : /* @__PURE__ */ E.jsx("p", { className: "react-metatype-status", children: "No metatypes available for this priority." });
}
const Qk = ["Hermetic", "Shamanic"], Wk = [
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
function Gk(T) {
  return (T || "").toUpperCase();
}
function qk({ priority: T, selection: w, onChange: x }) {
  var te;
  const { characterCreationData: Z, activeEdition: J } = Gf(), A = Gk(T), g = ((te = Z == null ? void 0 : Z.priorities) == null ? void 0 : te.magic) ?? null, re = Y.useMemo(() => g && g[A] || null, [g, A]);
  Y.useEffect(() => (document.body.classList.add("react-magic-enabled"), () => {
    document.body.classList.remove("react-magic-enabled");
  }), []), Y.useEffect(() => {
    if (!A) {
      (w.type !== "Mundane" || w.tradition || w.totem) && x({ type: "Mundane", tradition: null, totem: null });
      return;
    }
    if (A === "A") {
      const ne = w.tradition ?? "Hermetic", K = ne === "Shamanic" ? w.totem : null;
      (w.type !== "Full Magician" || w.tradition !== ne || w.totem !== K) && x({ type: "Full Magician", tradition: ne, totem: K });
    } else if (A === "B") {
      let ne = w.type;
      w.type !== "Adept" && w.type !== "Aspected Magician" && (ne = "Adept");
      let K = w.tradition, Ee = w.totem;
      ne === "Aspected Magician" ? (K = K ?? "Hermetic", K !== "Shamanic" && (Ee = null)) : (K = null, Ee = null), (w.type !== ne || w.tradition !== K || w.totem !== Ee) && x({ type: ne, tradition: K, totem: Ee });
    } else
      (w.type !== "Mundane" || w.tradition || w.totem) && x({ type: "Mundane", tradition: null, totem: null });
  }, [A]);
  const U = (ne) => {
    const K = {
      type: ne.type !== void 0 ? ne.type : w.type,
      tradition: ne.tradition !== void 0 ? ne.tradition : w.tradition,
      totem: ne.totem !== void 0 ? ne.totem : w.totem
    };
    K.type !== "Full Magician" && K.type !== "Aspected Magician" && (K.tradition = null, K.totem = null), K.tradition !== "Shamanic" && (K.totem = null), !(K.type === w.type && K.tradition === w.tradition && K.totem === w.totem) && x(K);
  }, Q = () => !A || ["C", "D", "E", ""].includes(A) ? /* @__PURE__ */ E.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ E.jsxs(
    "article",
    {
      className: `react-magic-card ${w.type === "Mundane" ? "selected" : ""}`,
      onClick: () => U({ type: "Mundane", tradition: null, totem: null }),
      children: [
        /* @__PURE__ */ E.jsx("h4", { children: "Mundane" }),
        /* @__PURE__ */ E.jsx("p", { children: "No magical ability. Magic Rating 0." })
      ]
    }
  ) }) : A === "A" ? /* @__PURE__ */ E.jsx("div", { className: "react-magic-grid", children: /* @__PURE__ */ E.jsxs(
    "article",
    {
      className: `react-magic-card ${w.type === "Full Magician" ? "selected" : ""}`,
      onClick: () => U({ type: "Full Magician" }),
      children: [
        /* @__PURE__ */ E.jsx("h4", { children: "Full Magician" }),
        /* @__PURE__ */ E.jsx("p", { children: "Magic Rating 6. Spell Points 25." }),
        /* @__PURE__ */ E.jsx("p", { children: "Must choose a magical tradition." })
      ]
    }
  ) }) : A === "B" ? /* @__PURE__ */ E.jsxs("div", { className: "react-magic-grid", children: [
    /* @__PURE__ */ E.jsxs(
      "article",
      {
        className: `react-magic-card ${w.type === "Adept" ? "selected" : ""}`,
        onClick: () => U({ type: "Adept", tradition: null, totem: null }),
        children: [
          /* @__PURE__ */ E.jsx("h4", { children: "Adept" }),
          /* @__PURE__ */ E.jsx("p", { children: "Magic Rating 4. Gain Power Points for physical enhancements." })
        ]
      }
    ),
    /* @__PURE__ */ E.jsxs(
      "article",
      {
        className: `react-magic-card ${w.type === "Aspected Magician" ? "selected" : ""}`,
        onClick: () => U({ type: "Aspected Magician" }),
        children: [
          /* @__PURE__ */ E.jsx("h4", { children: "Aspected Magician" }),
          /* @__PURE__ */ E.jsx("p", { children: "Magic Rating 4. Specializes in a single tradition aspect." }),
          /* @__PURE__ */ E.jsx("p", { children: "Must choose a magical tradition." })
        ]
      }
    )
  ] }) : null, Re = () => !w.type || !["Full Magician", "Aspected Magician"].includes(w.type) ? null : /* @__PURE__ */ E.jsxs("div", { className: "react-magic-traditions", children: [
    /* @__PURE__ */ E.jsx("strong", { children: "Tradition" }),
    /* @__PURE__ */ E.jsx("div", { className: "tradition-options", children: Qk.map((ne) => /* @__PURE__ */ E.jsxs("label", { className: `tradition-option ${w.tradition === ne ? "selected" : ""}`, children: [
      /* @__PURE__ */ E.jsx(
        "input",
        {
          type: "radio",
          name: "react-tradition",
          value: ne,
          checked: w.tradition === ne,
          onChange: () => U({ tradition: ne })
        }
      ),
      /* @__PURE__ */ E.jsx("span", { children: ne })
    ] }, ne)) })
  ] }), I = () => w.tradition !== "Shamanic" ? null : /* @__PURE__ */ E.jsxs("div", { className: "react-magic-totems", children: [
    /* @__PURE__ */ E.jsx("strong", { children: "Select Totem" }),
    /* @__PURE__ */ E.jsx("div", { className: "totem-grid", children: Wk.map((ne) => /* @__PURE__ */ E.jsxs(
      "article",
      {
        className: `totem-card ${w.totem === ne.id ? "selected" : ""}`,
        onClick: () => U({ totem: ne.id }),
        children: [
          /* @__PURE__ */ E.jsx("h5", { children: ne.name }),
          /* @__PURE__ */ E.jsx("p", { children: ne.description }),
          /* @__PURE__ */ E.jsx("ul", { children: ne.notes.map((K) => /* @__PURE__ */ E.jsx("li", { children: K }, K)) })
        ]
      },
      ne.id
    )) })
  ] }), ee = () => {
    if (!w.type)
      return /* @__PURE__ */ E.jsx("p", { className: "react-magic-status", children: "Select a magical path to proceed." });
    if (w.type === "Full Magician" || w.type === "Aspected Magician") {
      if (!w.tradition)
        return /* @__PURE__ */ E.jsx("p", { className: "react-magic-status", children: "Choose a tradition to continue." });
      if (w.tradition === "Shamanic" && !w.totem)
        return /* @__PURE__ */ E.jsx("p", { className: "react-magic-status", children: "Select a totem for your shamanic path." });
    }
    return /* @__PURE__ */ E.jsx("p", { className: "react-magic-status ready", children: "Magical abilities ready. Continue to Attributes." });
  };
  return /* @__PURE__ */ E.jsxs("div", { className: "react-magic-wrapper", children: [
    /* @__PURE__ */ E.jsxs("div", { className: "react-magic-header", children: [
      /* @__PURE__ */ E.jsx("span", { children: "Magical Abilities" }),
      /* @__PURE__ */ E.jsxs("span", { children: [
        "Priority ",
        A || "—",
        " ",
        re != null && re.summary ? `— ${re.summary}` : ""
      ] })
    ] }),
    Q(),
    Re(),
    I(),
    ee(),
    /* @__PURE__ */ E.jsx("footer", { className: "react-magic-footer", children: /* @__PURE__ */ E.jsxs("small", { children: [
      "Edition: ",
      J.label
    ] }) })
  ] });
}
function Kk() {
  const [T, w] = Y.useState(null);
  return Y.useEffect(() => {
    w(document.getElementById("auth-root"));
  }, []), T ? Wu.createPortal(/* @__PURE__ */ E.jsx(yk, {}), T) : null;
}
function Xk() {
  const [T, w] = Y.useState(null);
  return Y.useEffect(() => {
    w(document.getElementById("priority-assignment-react-root"));
  }, []), T ? Wu.createPortal(/* @__PURE__ */ E.jsx(Hk, {}), T) : null;
}
function Jk() {
  const [T, w] = Y.useState(null), [x, Z] = Y.useState(""), [J, A] = Y.useState(null);
  return Y.useEffect(() => {
    w(document.getElementById("metatype-selection-react-root"));
  }, []), Y.useEffect(() => {
    var U;
    const g = window.ShadowmasterLegacyApp;
    if (!g) return;
    const re = () => {
      var Q, Re;
      Z(((Q = g.getMetatypePriority) == null ? void 0 : Q.call(g)) ?? ""), A(((Re = g.getMetatypeSelection) == null ? void 0 : Re.call(g)) ?? null);
    };
    return re(), (U = g.subscribeMetatypeState) == null || U.call(g, re), () => {
      var Q;
      (Q = g.unsubscribeMetatypeState) == null || Q.call(g, re);
    };
  }, []), T ? Wu.createPortal(
    /* @__PURE__ */ E.jsx(
      $k,
      {
        priority: x,
        selectedMetatype: J,
        onSelect: (g) => {
          var re, U;
          A(g), (U = (re = window.ShadowmasterLegacyApp) == null ? void 0 : re.setMetatypeSelection) == null || U.call(re, g);
        }
      }
    ),
    T
  ) : null;
}
function Zk() {
  const [T, w] = Y.useState(null), [x, Z] = Y.useState({
    priority: "",
    type: null,
    tradition: null,
    totem: null
  });
  return Y.useEffect(() => {
    w(document.getElementById("magical-abilities-react-root"));
  }, []), Y.useEffect(() => {
    var g;
    const J = window.ShadowmasterLegacyApp;
    if (!J) return;
    const A = () => {
      var U;
      const re = (U = J.getMagicState) == null ? void 0 : U.call(J);
      re && Z({
        priority: re.priority || "",
        type: re.type || null,
        tradition: re.tradition || null,
        totem: re.totem || null
      });
    };
    return A(), (g = J.subscribeMagicState) == null || g.call(J, A), () => {
      var re;
      (re = J.unsubscribeMagicState) == null || re.call(J, A);
    };
  }, []), T ? Wu.createPortal(
    /* @__PURE__ */ E.jsx(
      qk,
      {
        priority: x.priority,
        selection: { type: x.type, tradition: x.tradition, totem: x.totem },
        onChange: (J) => {
          var A, g;
          (g = (A = window.ShadowmasterLegacyApp) == null ? void 0 : A.setMagicState) == null || g.call(A, J);
        }
      }
    ),
    T
  ) : null;
}
function eD() {
  const { activeEdition: T, isLoading: w, error: x, characterCreationData: Z } = Gf();
  let J = "· data pending";
  return w ? J = "· loading edition data…" : x ? J = `· failed to load data: ${x}` : Z && (J = "· edition data loaded"), /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
    /* @__PURE__ */ E.jsx("div", { className: "react-banner", "data-active-edition": T.key, children: /* @__PURE__ */ E.jsxs("small", { children: [
      "React shell active — controlling edition context for ",
      /* @__PURE__ */ E.jsx("strong", { children: T.label }),
      " ",
      J
    ] }) }),
    /* @__PURE__ */ E.jsx(Kk, {}),
    /* @__PURE__ */ E.jsx(Nk, {}),
    /* @__PURE__ */ E.jsx(Ek, {}),
    /* @__PURE__ */ E.jsx(kk, {}),
    /* @__PURE__ */ E.jsx(Sk, {}),
    /* @__PURE__ */ E.jsx(Xk, {}),
    /* @__PURE__ */ E.jsx(Jk, {}),
    /* @__PURE__ */ E.jsx(Zk, {})
  ] });
}
const tD = document.getElementById("shadowmaster-react-root"), nD = tD ?? rD();
function rD() {
  const T = document.createElement("div");
  return T.id = "shadowmaster-react-root", T.dataset.controller = "react-shell", T.style.display = "contents", document.body.appendChild(T), T;
}
function aD() {
  return Y.useEffect(() => {
    var T, w, x;
    (T = window.ShadowmasterLegacyApp) != null && T.initialize && !((x = (w = window.ShadowmasterLegacyApp).isInitialized) != null && x.call(w)) && window.ShadowmasterLegacyApp.initialize();
  }, []), /* @__PURE__ */ E.jsx(Y.StrictMode, { children: /* @__PURE__ */ E.jsx(hk, { children: /* @__PURE__ */ E.jsx(eD, {}) }) });
}
const iD = bE(nD);
iD.render(/* @__PURE__ */ E.jsx(aD, {}));
